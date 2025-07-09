ETON: It didn't give any error and executed successfully. But it didn't delete a piece of dictionary data as I expected. The same deletion logic can delete a piece of dictionary data in other functions (reply to 88742)

&rey: Perhaps you forgot to save data? (reply to 88823)

Bogdan: Hey, everyone. Can someone tell me how to call a smart contract function from funC on the React? The contract is already deployed

&rey: Please check out https://docs.ton.org/develop/get-started-with-ton#preparing-mining-messages — it is quite relevant, though not totally. (reply to 88836)

Nerses: how I can create message of this type message Commit{     data: CommitData; } struct CommitData{     hopChains: map<Int,StringImpl>;     hopAssets: map<Int,StringImpl>;     hopAddresses: map<Int,StringImpl>;     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address;     jettonMasterAddress: Slice;     jettonWalletCode: Slice;       amount: Int;  } to send it as field custom_payload in jetton transfer message ?

Nerses: here is how it is stored   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell()); but anyway get error 130 => the contract doesnt accept such message type,although it implements that type

Nerses: and here is the transaction https://testnet.tonviewer.com/transaction/0338e24f1dc8e019125f218eb0806f706a15f68e69ad6a007c54af8d696d672e

&rey: There probably should be opcode for Commit message. (reply to 88840)

Nerses: i have added this after all the code  const custom_payload = beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell(); (reply to 88846)

Nerses: but still I got exit code 130   https://testnet.tonviewer.com/transaction/6a2f3014a7793c527982c2d008cea83ff7ea18bf7542eb9efb7ccbf2d6e8e6c4

&rey: Well, .md file in build artifacts should explain that. (reply to 88848)

Nerses: Invalid incoming message  the exit code for 130. I thought it is generic exit code for every contract like -14 for example,thats why i didnt mention error message (reply to 88849)

Nerses: in case the message in custom_payload is created correctly why should i get such exit code ?

&rey: Contract accepts TokenNotification(0x7362d09c), right? (reply to 88851)

Nerses: yup (reply to 88852)

Nerses: shouldnt i pass it with forward_payload ? and in custom_payload I sent this message for receivers inner logic (reply to 88852)

&rey: In forward payload, of course. Custom is for jetton wallets. (reply to 88855)

Nerses: i passed that message as argument for field forward-payload  but got error Too many references .One can be Cell? another one slice as remaining. (reply to 88856)

Nerses: in case i change the type of argument in forward_payload to Slice I get Type 'Slice' is missing the following properties from type 'Cell': type, bits, refs, mask, and 10 more. (reply to 88860)

Adams: Thank you. However, the destination is a Tonkeeper wallet from a local wall. Please give examples of arbitrary comments you mean? Thank you once again. (reply to 88820)

&rey: Example: no comment at all. Example: "2024-07". (reply to 88864)

Adams: Thank you so much 👍 (reply to 88865)

Adams: Please, for the future reference: if I wish to send from a local wallet to an exchange like OKX or Binance, what will the comments look like and why the comments section while transferring Ton? (reply to 88865)

&rey: The exchange will generate a memo like 220330. You will need to set comment 220330 then. (reply to 88868)

Adams: I really appreciate your kind attention.   My best regards (reply to 88869)

&rey: Chat generally can help (in particular, chat history). (reply to 88873)

Ed, 🌱SEED🍅🔵 ONUS🐾🐐❤️🐾 BabyDoge PAWS Bums: Hello and good evening everyone.

Dexter: use java dev？ guys

User<6008048161>: Hello! I specialized in building Dapps, TMAs and TG bots on EVM, SOLANA and TON I also provide advanced responsive UI/UX product using React/Next Plz lemme know if there's an opportunity where I can lend a hand!

Heydar: why i cant see code of the contract? I want to see it's codes like tact or func . https://tonviewer.com/EQDI8_skWpQ9E67CNMGKTDmGg6ZCYMsLXvMgi1dXXaeebGjs?section=code

Chipi: Hello everyone! We use tonconnect ui react. When connecting a wallet, it displays an error   Error: Decryption error:   message: <...>  sender pubkey: <...> keypair pubkey: <...> key pair secretkey: <...>  What could be the problem? Has anyone come across this?

Chipi: We have already changed different domains. The problem remains (reply to 88907)

— 2024-07-27 —

Itach: Hello, We can help you (reply to 88477)

МАВЛУТБУ: @ChatKeeperBot

ETON: I saved the data, and as a test comparison, I modified, at the same time, the other  global variables, and saved the dictionary along with the other section global variables. Then after querying their values, the query values for the global variables were as expected, and the query values for the dictionary were not as expected (reply to 88826)

ETON: fixed it (reply to 88945)

Elvis 🎯🧲: please Anyone know how i can get a couple test ton, test giver bot not working

Victor: You can buy test ton on tonapi.io (reply to 88960)

Victor: Because something go wrong: u built the cells incorrectly or error in smart contract (reply to 88893)

Victor: Because how create this nft_item contract didn’t verify it (reply to 88885)

blocksdev: Don’t send a InlineKeyboard with the message… (reply to 88538)

Elvis 🎯🧲: Bought but haven’t received, looks like it sent to another address, not the one I included. Anyone having this problem? (reply to 88967)

Victor: send me a link to your wallet and transactions (tonviewer) (reply to 88973)

Naseer: Hi

Victor: Yeep (reply to 88976)

Butcher: Is ton mining bot on telegram legit ??

&rey: TON Foundation doesn't run one. Please DYOR; in particular, don't give secret keys of existing wallet so you won't be able to lose TON you have. (reply to 88980)

Butcher: If i upgrade the mine to core i5, can I withdraw ton?? (reply to 88981)

Butcher: Or do i have to upgrade up to i7

&rey: If the bot asks you to "do just one more step before withdrawing", probably it won't allow you to withdraw anything at all. (reply to 88983)

Elvis 🎯🧲: I have recieved , all good now (reply to 88975)

Lego: Hi everyone! I'm looking for recommendations for an audit firm for the TACT smart contract. Any suggestions?

Огурчік: Hi everyone, I have an idea, but I need specialists who can tell me if it's a bad idea or a good one, and I believe there are such specialists in this chat.  Here's my idea: For example, I have 10 accounts in the TON network that I generated based on a single public key and managed with a single private key, with each being assigned a different wallet_id during generation.  Clients will be transferring funds to these accounts, and I want the funds to be automatically transferred from these accounts to another one of my accounts upon receipt.  As I understand it, can I deploy a smart contract on each of these 10 accounts that will automatically transfer the funds to another account upon receipt?  Or is this not how it's done? I find it a stupid solution to write software that will scan the accounts in various loops, as it seems like smart contracts can handle this.  I don't quite understand how this would work yet.

&rey: Yes, you can do so. It will be a quite simple contract. (reply to 88993)

Огурчік: perhaps do you have an example?😁 (reply to 88994)

&rey: () recv_internal() { send_raw_message(get_data(), 128); }  and set appropriate message in contract's data. (reply to 88996)

&rey: For instance, data: beginCell().storeUint(0x10, 6).storeSlice(centralWallet).storeUint(0, 4 + 107 + 32).storeStringTail("user-uuid").endCell()

Огурчік: 🙏🙏🙏🙏🙏 (reply to 88998)

Огурчік: thanks)

Alan: may I know how to customize jetton token address like notcoin?

Ruslan: https://github.com/AntonMeep/vaniton (reply to 89003)

Alan: thanks a lot (reply to 89004)

Alan: Hi Ruslan, thanks for the instructions, I am new to ton development, may I know how to use the generated wallet address for jetton token address, and which type of wallet address should be used,  it would be very appreicated if you could send some links, cheers (reply to 89004)

Ruslan: Actually, if you need the Jetton master vanity name, then you have to modify this repo (change code and unit state to the data of Jetton master). This repo will work only with usual wallet. Here is one more link about how to deploy this contract: https://github.com/ton-community/vanity-contract (reply to 89007)

zoie: hello, why are transaction fees displayed differently on tonscan and tonviewer? tx c1cd971ea6ebdcac73be17c32faaab92bd97f3047e1ac10a2c5ac374949fa582 only 0.003197586TON  in tonscan and tonviewer 0.003988532 TON

Marcus: anyone need smart contract developer? i work for free. just want to learn ton development

Sonu: I want (reply to 89011)

Haq: Hello guys I have a question.  Do you know how to create SmartContract which will have a balance in USDT? Base functions:  - receive USDT  - store USDT - be able to send USDT  Maybe you have examples or some links to article?

Percy: hello anyone can help to sent me 1 ton testnet pls ?

Percy: i cant find faucet for ton

Haq: https://t.me/testgiver_ton_bot  Here is bot for it (reply to 89020)

Percy: its done , thank you sir (reply to 89022)

&rey: Any contract can do so. Sending jettons can be rewritten from https://docs.ton.org/develop/dapps/asset-processing/jettons#best-practices. (reply to 89019)

Пользователь: It doesn't listen it exist immediately (reply to 88760)

Haq: Thanks for your answer 🤗 I will go through it and check it out. (reply to 89027)

Almatbek: who needs a developer

Пользователь: Anyone know? (reply to 88759)

Victor: Use tonapi (reply to 88759)

Ankit j: Has anyone worked on click event on react or typescript?..or any existing Git repository that I can refer?

Пользователь: Can you share me any example (reply to 89034)

Пользователь: Should I use this?

Victor: Check here -> https://docs.tonconsole.com/tonapi/api-v2 (reply to 89039)

Пользователь: But api calls are limited to 1 request per second (reply to 89040)

the_renovatio: is there a way to generate the transaction hash after sending a message of the transaction? i am using pytoniq wallet raw_transfer?

SP: Can we parse code and data from raw (cell, boc) ?

&rey: You can; you will get bytecode (TVM assembly) from code cell and array of (bits, refs) from data cell. (reply to 89043)

SP: Any sdk func to get it

TG: Hey all 👋

&rey: Please remember that anyone DM-ing you might be a scammer. (reply to 88993)

Огурчік: I know, they have already tried to steal a couple of TONs from my testnet wallet 😆😆😆😆 (reply to 89060)

Kryptonite: Hi there ! are there any apis using which i can read smart contract states ?

&rey: Pretty much any. Toncenter (/getAddressInformation), for instance. (reply to 89074)

Mage: Hi

Nxrix: How to get address from dns? is there and api? dton?

TG: Hey everyone, some of our top Mini Apps devs have just completed some projects, lovely apps they’ve made.  Theyre open to some more projects so let me know if you or anyone else needs some Mini apps developed with fair prices, DM for more info

Frank: Hello, Team. Anyone can guide the course for writing  smartcontract in Rust? I mean smartcontract on the TON network.

&rey: 1. Fork Rust, deleting all reference business (making all types Copy); 2. Create compiler from Rust to TVM Assembly; 3. Write smart contract. (reply to 89089)

&rey: It is an idea I like, but very ambitious.

Frank: Yes, it is very challenge for me. (reply to 89095)

Frank: I'm checking ever_sdk, ever_block,  Can I write smartcontract and deploy using these packages?

&rey: You can write smart contracts in FunC. Most of them can also be made in Tact, though with increased gas usage.

&rey: 1. Those aren't built for TON; they seem to be for Everscale blockchain. 2. Probably you can't make a smart contract there, you need to compile it separately. (reply to 89098)

Frank: So there is no any example on rust smartcontract on TON, yet? (reply to 89100)

Frank: For now Func is the only way?

Frank: I found these packages by searching ton_sdk, ton_blcok. What about these packages? (reply to 89100)

Rishabh: Hi guys

Rishabh: Hi guys, I want to know which projects got grants by TON. How can I know it?

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please

&rey: got grants by whom, exactly? (reply to 89121)

Rishabh: By TON under TON grants program (reply to 89124)

&rey: There isn't a single entity called "TON" having money to issue grants. TON Foundation, perhaps? Or TON Society? (reply to 89125)

Rishabh: I don't bro. Just checkout TON official site there's a page called TON grants (reply to 89126)

Anton: from the UAHg project. We have noticed that certain individuals have created a token that mimics our project on the Ton network, directly inputting false data with links to the official resources of the real project. Dear colleagues, have there been any precedents for the removal of such tokens or deactivation of addresses with a token that is recognized as fraudulent? How can we address this issue?

&rey: TON Foundation grants, then. Grant updates are at bottom of the page, I think they are up to date. (reply to 89127)

&rey: not possible. Make sure that your users know address of official jetton master; perhaps include it in links as well, since those are kept? (reply to 89128)

Anton: Thx (reply to 89132)

Rishabh: Ohk. Then is there any list of projects which got grants? (reply to 89129)

Human: Tell me what is the latest working version of tonconnect ?

&rey: I don't know of one; you can compile it. (reply to 89136)

Rishabh: How can I compile it? Is there any source? (reply to 89139)

&rey: Sources = 1) grant updates at bottom of the page, 2) transactions from TON Foundation wallet (hard to filter, though). (reply to 89141)

Rishabh: Where at the bottom of the page? (reply to 89143)

&rey: This list: https://blog.ton.org/category/grants. (reply to 89145)

Rishabh: Ohk. So how does this grant program works?   Like does TON will give grants to two projects who are competitors in the same domain? (reply to 89146)

Development: I'm looking for a job as a developer, studied funC, tact, fift, worked on pythone, organized several breakfasts in Bangkok

Presidente: hey guys what block explorer can show me blocks like in lighning network style

Presidente: How I can look my W5 wallet blocks?

programmer: how can i connect to a wallet and withdraw an amount with tonweb ?

Tech🧑‍💻🐾: Let talk buddy (reply to 89155)

Crylion: 💥 Seeking Agency for AI Crypto Bots and Mini Apps Development!  Hello everyone,  We are currently looking to collaborate with a professional agency that specializes in perfecting AI Crypto Bots and Mini Apps. Our goal is to enhance the functionality, performance, and user experience of our existing solutions.  Requirements:  Proven experience in AI and cryptocurrency-related projects. Expertise in developing and optimizing Telegram bots. Ability to create seamless mini apps with user-friendly interfaces. Strong portfolio showcasing previous similar projects. Excellent communication skills and ability to meet deadlines. If your agency fits this description or if you can recommend someone, please reach out to us with your portfolio and a brief overview of your approach to this project.  Looking forward to your responses!

Zain: Hey developers!  I wanted to hop-in and talk about TEP - targetted towards security.  We are trying to make TON easy, simple and user friendly, but this should also not comprimize on user security.  I wanted to start a discussion to talk more about the security of "mini apps" and how we can ensure they are not malicious.  After reading the WP it seems, TON has done a great work, but my idea is to deploy a safety tag that the user can set at their own end, which is displayed before connecting with any mini-app.  Keen to hear other devs on this idea.

— 2024-07-28 —

Nekomya: Hi Developers!  I get an error when running Ton Speedrun Quest3 (Check point 2) , I tried to fix the code, but it still states that the 'stack.readBigNumber' method is not a function...

Crylion: @princedev00 HE IS SCAMMER

Tech🧑‍💻🐾: How? Why? (reply to 89200)

Prince: we are all devs so they don't like me (reply to 89209)

Prince: people who don't have any talent always, always insult talented guys

Tech🧑‍💻🐾: Ummm 🤔 (reply to 89211)

Foxero: Hey guys, do you know if you have to put 20k in the liquidity pool if you create a project on TON?

.: Hi why had I error ?  https://testnet.tonscan.org/tx/CdgDfZP8FZiVGHYmhUGD8613wdnCQB0s5u0XKoEI658= Code: (it is code in recv_internal) var destination_1 = “0:969bcc97acc12716c7a8046afe89ef8ddd2b6d6310acdd7ed49350d56a690f16”; send_raw_message(begin_cell()     .store_uint(0x10, 6)     .store_slice(destination_1)     .store_coins(15000000)  ;; 0.015 TON     .store_uint(0, 107)     .end_cell(), 1);   send_raw_message(begin_cell()     .store_uint(0x10, 6)     .store_slice(destination_1)     .store_coins(0)     .store_uint(0, 107)     .end_cell(), 64);  ;; all remaining TON

Nekomya: When you first add the project to the liqid pool, the amount of tons put in and the pool prices affect the prices, so make sure you put it in a balanced way.  Since I didn't know this at first, I was caught in sniper bots, they deleted the liqid pool 2-3 times. - 400 ~ 500 USD  At the moment, it is very difficult to put money into the liqid pool because the price is unstable. This is just my experience, subject to. (reply to 89214)

Foxero: Thank you so much for the response, so there's no obligation to put a minimum amount of cash into a project? I can launch an app and choose the amount of cash? (reply to 89224)

Nekomya: You are free to add it to the liqid pool in DEX applications (STONFI & Dedust) However, if you want to list, there is a liqid pool requirement of 10,000 usd for stonfi. You can refer to the official documents for details. (reply to 89225)

Nekomya: It's just good to research and learn more about the part I'm investigating, it reduces errors and doesn't negatively affect the future of the project.

Ajay: You want to send jetton (wallet A to wallet B) (reply to 89122)

Foxero: Thank you so if i understand there is no obligation on the telegram web app, I can develop my web app and launch it on telegram without any prior audit from your or any other organisation. (reply to 89227)

Nekomya: You're welcome. Good luck with your project 🍀 (reply to 89231)

.: Hi  Can anyone help ? (reply to 89220)

Entul: sorry not understand (reply to 89243)

User<6008048161>: Hello! I'm a detail-oriented and enthusiastic frontend developer with extensive expertise in HTML, CSS, JavaScript, TypeScript, React (including Next.js), and Node.js. In addition to my technical skills, I also provide responsive UI/UX design services using Figma. My greatest strengths are my ability to work at a high speed while maintaining exceptional quality. I'm seeking an internship opportunity to further refine my skills, contribute to innovative projects, and gain practical experience within a dynamic team environment. Please let me know if you have any need for my assistance.

&rey: This isn't an address, you need to put "..."a. (reply to 89220)

.: For example ”0QCWm8yXrMEnFseoBGr-ie-N3SttYxCs3X7Uk1DVamkPFkYT”a ? (reply to 89256)

Development: Hello.graduated from ton dev study, second stream, looking for paid assignments, my rate is $15 per hour

Alexander: There’s no chance of someone hiring you. You better graduate from the university and even this doesn’t make a lot of sense. You’ve scammed if you paid for this (reply to 89258)

Alexander: And by the way workers at KFC get paid more than 15$/h 💀 (reply to 89258)

Development: most likely you are mistaken, I organized ton breakfast in Bangkok and I have already received orders, including from here, in this chat there are a lot of scammers who will take your money and disappear (reply to 89259)

Development: in that case, look at other options for employment at McDonald's if that suits you, we're talking about something else here (reply to 89260)

Alexander: I’m definitely not mistaken of how much KFC workers and Uber drivers paid (reply to 89261)

Alexander: Make an agreement with the developer, verify his identity and there’s much less chance of getting scammed. Done. (reply to 89261)

User<6848286966>: I dont know where you live but in europe uber and KFC are more 9€ after taxe ^^ (reply to 89263)

Development: can you please go discuss kfc salary in kfc chat?i am here looking for tasks for ton blockchain developer (reply to 89263)

Alexander: In the U.S. in general. But anyway, have you seen experienced software engineers working for 15$/h? That’s insane (reply to 89265)

Alexander: I know the Europe market, even the salary of a Junior Frontend Developer will be higher than 15$/h. And I have done a lot of projects with Europe based companies

Alexander: But being a developer on TON it’s not the same of being a Junior Frontend. You could ask 200-500$/h if you have enough experience depending on a project (reply to 89266)

User<6249963055>: Sup Need to use W5 wallet, am i right that i need to add source here to use it?

Jack: Hi guys, I am trying to use window.Telegram.WebApp.disableVerticalSwipes()   But it seems not working. It's a new feature. Have u guys tried it?

Alexander: To deploy a wallet v5 you definitely need to have the code.  But just to send messages to an already deployed contract you don’t. (reply to 89270)

Alexander: You better ask in @twa_dev (reply to 89274)

Haq: Guys do any one know what i should type in the bot or in which way too get USDT on testnet?   BOT: https://t.me/testnet_usdt_giver_bot  I try:  - /get{5} - /get 5

Stephan: From custom contract A to wallet B (reply to 89230)

rkonrock / "🌱SEED"/ 🌊 Wave: Hello admin please help me

Haq: Or any one know how to get USDT on testnet? the good one? (reply to 89282)

Aleks: Hey guys. Does TON have contract libraries/standards comparable to what OpenZeppelin offers on EVM?

.: Hi How to mint NFT with FunC?

King🥇: aha, ton-contracts will be help you (reply to 89292)

&rey: Within existing collection? (reply to 89292)

&rey: What functionality could such a library provide? I've heard of one existing, but it isn't that useful. (reply to 89291)

.: No, I want to mint NFT and collection with my FunC smart contract  For example, user send to smart contract 1 Ton, then smart contract create collection and NFT   Is it really ? (reply to 89294)

&rey: Yes, but absent other requirements it requires a contract architect to choose the best option to do so. (reply to 89296)

Haq: https://docs.ton.org/develop/dapps/tutorials/collection-minting  Here you can start (reply to 89296)

Aleks: Like following the standards defined in the TEPs (reply to 89295)

.: Please, think first, then write This is guide with Node JS I need FunC (reply to 89298)

Haq: There you can read about NFT on TON, what you will need for your collection.  And also there are more resources about NFT and FunC.  That's way i wrote "Here you can start" (reply to 89301)

.: sorry :) (reply to 89303)

Haq: np bro 🪂 (reply to 89304)

Bogdan: Hi everyone. Is there a function template for sending a Jetton coins to a specified address, such that only the recipient has to pay for the transaction?

&rey: No, it isn't even possible. (reply to 89310)

Bogdan: 😢 (reply to 89311)

Nekomya: If such a thing happened, everywhere would be filled with scam users ☠️ (reply to 89310)

Bogdan: I got it. I just wanted to make a game where you could get a reward for quests in jettons (reply to 89314)

Bogdan: Maybe it's done differently or maybe I just don't understand it right

.: Hi  I use example from docs for transfer NFT  But I got error with op::transfer (op::transfer() is not defined)  How to fix ?

&rey: 1. remove parens to get simply op::transfer 2. define const int op::transfer = 0x and HEX code from TL-B. (reply to 89319)

&rey: So, in your idea user gets jettons but they need to pay transaction fee, right? (reply to 89316)

Bogdan: yes (reply to 89321)

&rey: So, you need a system similar to payment channels, but single-directional (where only server sends jettons to user) and non-closeable. (reply to 89323)

DEGGAN | Drops💧: hi I want to ask. when I import my ton wallet from Telegram to Tonkeeper, why my address different?

&rey: Fully different or just a few characters in beginning and end? (reply to 89325)

DEGGAN | Drops💧: from telegram: UQBWZOpf30MrvZuq5-Cs9k6w78E5FgEFNmmz9I59JFO5WpKO from Tonkeeper: UQCjqBfCl-uHODb_Do3khkgzPZKrAJU5VtSZaWfULtPKDtIC (reply to 89326)

&rey: Different wallet versions, probably. (reply to 89327)

Nekomya: Check your wallet is different from the main wallet and Tonspace (reply to 89325)

DEGGAN | Drops💧: so which one is correct? (reply to 89328)

&rey: Both? They are different accounts, indeed, but both might be yours. (reply to 89330)

DEGGAN | Drops💧: i import the phrase from tonspace beta to tonkeeper (reply to 89329)

DEGGAN | Drops💧: Ton network is build different than EVM? (reply to 89331)

Nekomya: It depends on which one you want to open in Tonkeeper. If you want to use Tonspace, here are the steps in order: Wallet     ⏬ Ton Space      ⏬ Settings      ⏬ Copy your 12-digit code     ⏬ Open and import the tonkeeper. (reply to 89332)

Haq: Guys if i have USDT master address on testnet, can I mint some USDT by myself?   https://testnet.tonviewer.com/kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy

&rey: No unless you are its admin. (Testnet is not different from mainnet in most regards.) (reply to 89336)

Haq: Ok, hmm maybe you can how to get some USDT on testnet?  I need to write and test smartContracts which will receive USDT and store them (reply to 89338)

&rey: Get some other jetton via https://minter.ton.org/?testnet=true. (reply to 89339)

Haq: Yea I think I will crate new one and mint by myself. thx (reply to 89340)

Ivan: Is there a service to catch transaction status by webhook in TON Network. like Alchemy ?

Tanya: Hello, devs. how to get a JettonWallet address from my Ton wallet?

&rey: Pretty easily (https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offchain). (reply to 89346)

Tanya: what is this? (reply to 89347)

Ivan: Why address in TON transaction can be differ that wallet address?

Ivan: I'm using https://github.com/xssnick/tonutils-go/blob/master/example/accept-payments/main.go

Ivan: But message in logs show me different address then my sender wallet

&rey: Is it fully different or just a few characters in beginning and end? (reply to 89356)

Ivan: fully.. should be UQCfSNO_5T4YROw-nI4jOUjQnWmIJj_DpG38de0j4HXByphn but comes EQCfSNO_5T4YROw-nI4jOUjQnWmIJj_DpG38de0j4HXBysWi here is a transation: https://tonviewer.com/transaction/75d18101ab3152bd1fc8c6a0db45e958aa548145dbe08b78210a4600a1774526 (reply to 89357)

&rey: Just a few characters, alright. Different address forms (you expect non-bounceable, get bounceable). (reply to 89358)

Ivan: Thanks, but where did you see a few characters ?

Ivan: Ohhh..after -

&rey: .QCfSNO_5T4YROw-nI4jOUjQnWmIJj_DpG38de0j4HXBy... is same (reply to 89361)

Ivan: Can you tell how to convert it to bounceble ? (reply to 89360)

&rey: I don't know Go so I can't. (reply to 89365)

Ivan: any other language? I hope sdk should be same (reply to 89366)

Abdulaziz: How does telegram web app login or authentication works, i need docs

&rey: >>> pytoniq.Address('0:fce729b16610e20aeabf7980890c49847f4a889e9a588bbd45e8a7e33ddf7a56').to_str(True, True, False) 'UQD85ymxZhDiCuq_eYCJDEmEf0qInppYi71F6KfjPd96VnO9' (reply to 89367)

Ivan: to whom it can help, in Go it can be done this way  ti := tx.IO.In.AsInternal() src := ti.SrcAddr src.SetBounce(false)

Ivan: So if user connect (link) his wallet in web3 dApp it always be shows as non-bounceable ?

Ivan: So I can rely on it and link payments based on that flag?

&rey: Appropriate format of user address is usually non-bounceable. (reply to 89373)

Ivan: In the near future, all wallets in TON are transitioning to the non-bounceable format, so don't be surprised if, using the same key, you see different address formats in different wallets. It depends on the developers of the specific wallet and the format they have chosen, but official services will tend to adopt the new format.  Is that true info?

Ivan: Is there method in SDK to get all options in array? So I can check it at once ?

Ivan: like isValid('bounceble-address', 'sender-address')

Ivan: nvm, found docs 🙂 https://docs.ton.org/develop/dapps/cookbook#what-flags-are-there-in-user-friendly-addresses

.: Hi  Can I deploy NFT smart contract (https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-item.fc)  on other address, not mine ?  is it possible?

Vincent: toncenter's APIs is frequency return 500 error, are you guys experiencing that?

MM: Hello, everyone. I am looking for a TON blockchain developer with expertise in NFT and highloadwallet. I want write a simple js script that send NFT to multi users via highloadwallet If interested, please DM me

Thea: Hello dm (reply to 89391)

Prince: I recommend highload v2 wallet for sending (reply to 89391)

NPA120: Please dm (reply to 89391)

Prince: May I share my script? (reply to 89391)

Vladislav: Have a nice day everyone 👋 I use react and the @ton/ton package  My goal is to receive a transaction just sent via @tonconnect/ui-react and wait for its final result: success or failure and get the exitCode in this case  I receive targetBoc from the response of sending a transaction via tonconnect. Then I interpret it in hash with the following code: const hash = Cell.fromBase64(targetBoc) .hash() .toString("base64");  Then in a loop with some frequency I receive and analyze transactions using the code: const lastTxs = await client.getTransactions(walletAddress, { limit: 10, hash: hash });  for (const lastTx of lastTxs) { const txDescription = lastTx.description; if (txDescription.type !== 'generic' || txDescription.computePhase.type !== 'vm') { console.log(txDescription); continue; }  Until I find my transaction among the transactions by comparing hashes: if (lastTx && lastTx.inMessage) { const msgCell = beginCell().store(storeMessage(lastTx.inMessage)).endCell(); const inMsgHash = msgCell.hash().toString("base64");  if (inMsgHash === hash) { console.log("This is our transaction");  But then I don't understand how to understand whether the transaction is successful, my unsuccessful and successful transactions differ only in: lt, storageFeesCollected and body data and other hashes And also actionPhase is created and executed successfully for all transactions "actionPhase": { "success": true,  But the flags bounce: true and bounced: false for outgoing messages and incoming, if any, remain unchanged TonKeeper understands that the contract has issued an error and marks the transaction as unsuccessful. The contract produces an error using require  So how do you understand that the transaction is successful or unsuccessful?

Abdulaziz: How to set wallet name?

Abdulaziz: Why does this address have name zero-address.ton and it's to force another person

I'm: Hi everyone, I use @ton/ton to get jetton master info. And I get this result like this: getJettonData(provider: ContractProvider): Promise<{     adminAddress: Address;     content: Cell;     mintable: boolean;     totalSupply: bigint;     walletCode: Cell; }>  I can read adminAddress. But I cannot read data in content. I search a lot of websites but no example.  Please help me, thank bro.

Vladislav: you have the answer on your screen, I think (reply to 89407)

MM: Hello, everyone. I am looking for a TON blockchain developer with expertise in NFT and highloadwallet.  I want write a simple js script that send NFT to multi users via highloadwallet  If interested, please DM me

Abdulaziz: I mean why burn address has this name, and owner is Alexey1024? (reply to 89409)

Vladislav: I don't think this is an official address for burning. It's just that someone managed to register such an address (reply to 89411)

Abdulaziz: tonviewer.com/UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ (reply to 89412)

Vladislav: ah, it also has the status of Uninit and the address 0:00000000000000000000000000000000000000000000000000000000000000000  Yes, it is official, well, maybe one of the founders registered it, that's why it belongs to him. This is my conclusion, not the truth (reply to 89413)

User<6898858959>: Hi. Please DM me (reply to 89410)

Reza: Hi

λ markus.py: How do I get a transaction by its hash? Is there a specific run_get_method in pytoniq? I want a way to do it without an api, only with the direct liteserver connection

&: Hi i have high-load wallet tg-bot to bulk send/buy/sell  nfts . DM me for more detail (reply to 89410)

&: Goto @tonhunt (reply to 89266)

Mubashar Rahman Aronno: Hellow brother.  I am currently representing a project who want to move in to the TON.   Would like to ask gor your help

Mubashar Rahman Aronno: Can u guyss tell me more about the nft  space  in ton?

User<6249963055>: Any guides available? (reply to 89276)

Vladislav: I haven't tried it, but I think the previous answer to you implied that you need to find the code for the version 5 wallet and deploy it yourself  I found a link to the wallet source code in the docs https://docs.ton.org/participate/wallets/ There is a source code for the version 5 wallet contract contracts#flow https://github.com/tonkeeper/w5/tree/main  Maybe this will help you 🤷‍♂️ (reply to 89433)

Dr.Bitcoiner: any dev expert in jetton and stonfi lp creation? i would love a paid consultation call with him

User<6898858959>: Hi. Please DM me. (reply to 89440)

Vladislav: Hi Jacob, if you are a professional ton-dev. Can you please 🙏 answer how to check the success of the calculated transaction or failure and get the error code? What transaction parameters should I look at if I get a list of them by code: const lastTxs = await client.getTransactions(walletAddress, { limit: 10, hash: hash }); (reply to 89442)

Dr.Bitcoiner: he is not a dev ? (reply to 89443)

Vladislav: I don't know, but he just writes to everyone "DM me, DM me". Well, I decided to try my luck  But no one here can answer most of the questions with simple advice, and basic ones at that, which the ton-developers should write a document on to make it easier for newcomers to develop this network (reply to 89444)

User<6898858959>: hi, vladislav.

User<6898858959>: check this code

Aleks: I’ve deployed some NFT contracts based of howarpen9 nft-template-in-tact. Is there a way to connect those with getgems on testnet in order to actually see the metadata and all?

User<6898858959>: the server removed my message

Vladislav: Hi 👋, your code was deleted, but I briefly saw that there was seqno  This is not a solution to the problem - I need to get not the result of sending the transaction, but the result of whether the transaction was executed successfully, and otherwise exitCode (reply to 89446)

User<6898858959>: I'll send you the code soon. okay?

Vladislav: I would be grateful in that case 🙏🤝  but I hope it’s not the code from the first Google link for the request "ton get transaction status"  here is this link https://answers.ton.org/question/1542513974774337536/how-do-i-get-the-result-and-status-of-transactions-with-the-tonweb-sdk (reply to 89456)

User<6898858959>: const TonWeb = require('tonweb'); const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', { apiKey: '' }));

Ahmed: how can i build a transaction message for a dedust swap ?

Ahmed: I found this in funC #include "imports/stdlib.fc";  ;; ;; Common ;;  const int msg_flag::bounceable = 0x18;  builder store_zeros(builder b, int n) asm "STZEROES";  slice addr_none() asm "b{00} PUSHSLICE";  ;; ;; DEX ;;  const slice TON_VAULT_ADDR = "EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"a;  ;; Where to send bought jettons? const slice RECIPIENT_ADDR = "EQDz0wQL6EEdgbPkFgS7nNmywzr468AvgLyhH7PIMALxPB6G"a;  ;; Can be taken from DeDust.io: https://dedust.io/earn/<pool_addr> const slice TON_SCALE_POOL_ADDR = "EQDcm06RlreuMurm-yik9WbL6kI617B77OrSRF_ZjoCYFuny"a;  const int MIN_BALANCE = 100000000; ;; 0.1 TON const int MIN_TRADE_AMOUNT = 1000000000; ;; 1 TON const int TRADE_FEE = 200000000; ;; 0.2 TON  const int ton_vault::swap = 0xea06185d;  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);     if (flags & 1) {         ;; NOTE: Ignore bounced messages.         return ();     }      int trade_value = my_balance - MIN_BALANCE;     if (trade_value < MIN_TRADE_AMOUNT + TRADE_FEE) {         ;; NOTE: Ignore messages if balance is too low.         return ();     }      {-         timestamp#_ _:uint32 = Timestamp;          step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;         step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;          swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress                       fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;          swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;     -}      cell body = begin_cell()         .store_uint(ton_vault::swap, 32)         .store_uint(0, 64) ;; query_id:int64         .store_coins(trade_value - TRADE_FEE) ;; amount:Coins # subtract gas         ;; _:SwapStep         .store_slice(TON_SCALE_POOL_ADDR) ;; pool_addr:MsgAddressInt         .store_uint(0, 1) ;; kind:SwapKind         .store_coins(0) ;; limit:Coins         .store_maybe_ref(null()) ;; next:(Maybe ^SwapStep)         ;; swap_params:^SwapParams         .store_ref(             begin_cell()                 .store_uint(now() + 60 * 5, 32) ;; deadline:Timestamp # 5 min                 .store_slice(RECIPIENT_ADDR) ;; recipient_addr:MsgAddressInt                 .store_slice(addr_none()) ;; referral_addr:MsgAddress                 .store_maybe_ref(null()) ;; fulfill_payload:(Maybe ^Cell)                 .store_maybe_ref(null()) ;; reject_payload:(Maybe ^Cell)                 .end_cell()         )         .end_cell();      send_raw_message(         begin_cell()             .store_uint(msg_flag::bounceable, 6)             .store_slice(TON_VAULT_ADDR)             .store_coins(trade_value)             .store_zeros(1 + 4 + 4 + 64 + 32 + 1)             .store_maybe_ref(body)             .end_cell(),         0     ); }

Ahmed: but i want to do it in javascript

Vladislav: try to ask DeDust Dev about that https://t.me/dedust_dev_chat :) (reply to 89461)

Ahmed: thanks

Itach: who can help me?

Abdulaziz: Hello, the question is, can i see the open source of smart contacts with ton explorers like tonviewer? Or only bytecode

&rey: Conditional on contracts having source code published, you can. (reply to 89469)

Abdulaziz: If not, i can only bytecode, right? (reply to 89471)

Abdulaziz: Is it possible to compare source code and byte code? (reply to 89471)

&rey: Yes. verifier.ton.org does that, for instance. (reply to 89474)

Pibu: Hello! Is there a preferred way of testing interactions between my and 3rd party (think jettons) smart contracts? I am using blueprint with typescript tests... I want to test interactions between my contracts and jettons and I don't know if there's a way of doing that other than including jetton code in my project...

&rey: you have to do so, at least bytecode. (reply to 89476)

Vladislav: The problem is trivially simple, I checked the walletAddress from which I sent the transaction, but I needed to check the address of the contract to which the transaction is sent, because execution occurs on the contract and errors occur there too 🤦‍♂️ (reply to 89399)

Vladislav: Guys, please help me figure this out (although this is not really a developer question):  I sent Jacob (https://t.me/Jacob20613) money to the wallet he sent me (https://tonscan.org/address/UQCCR983I8ZEPVlWRmxqVfJiGUBPmOA_Q9QNMAwL1siE_1FF) it was not initialized, and as a result it remained so, and I received a message in TonKeeper that the wallet was initialized  After that I immediately received three NFT: https://tonscan.org/address/EQAaUs_tfFvgUcSS32TtiCXSosOAvEKu0cdhuFKXb6NLqyXO https://tonscan.org/address/EQCXqWBBTuHdEaHF0oq5d5qVuqC10YShfjCrxKXokQkPTPKa https://tonscan.org/address/EQDMW8BPrSLXGjy6Rg_GchKkUOUiXqDRloJUOsFY-WPVa7F-  These NFTs are a scam, am I right?

Pibu: do you know how can I load a compiled bytecode? I took the *.fif files from the token-contract repo, also took their wrappers, but I don't know how to use them :( (reply to 89477)

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please  This is a transaction https://testnet.tonviewer.com/transaction/dcfcfce74543141193d6f0ac8dcdadf05e9c50adfb38c83d9fb992f9d9d2dcd3

Vladislav: Exit code 62972  as someone wrote is Invalid balance, https://t.me/tondev_eng/17625  from your code example:         // Update balance         self.balance = self.balance - msg.amount;          require(self.balance >= 0, "Invalid balance");  You are probably trying to send more than you have in your wallet. (reply to 89488)

Stephan: The fact is that after the deployment, I sent tokens to the contract (1000). (reply to 89489)

Vladislav: Yes, I saw that you have 1000 tokens. And how much are you requesting in the transfer?  If such an error occurred, and you did not change the code, then the attempt to withdraw is greater than the available amount (reply to 89490)

Stephan: self.tokenValue = ton("100");  Here. It’s enough (reply to 89491)

Nel_Z_I: I'm not a developer, but I'm in a few private groups for Web3 founders and have friends who are founders too. They often need developers. If you're a developer and interested, send me a DM.  Just a heads up, opportunities might not come up all the time, so keep your expectations in check.

Pibu: I actually found a way - compiled the minter and wallet, got their outputs from the build folder and used Cell.loadFromBoc() and I can deploy the minter from my test (reply to 89486)

Stephan: I also tried entering the amount in nanoTon and it also doesn’t work (reply to 89491)

Haq: Hey Man, did you found a way how to check is transaction was success? (reply to 89485)

Vladislav: I'm not sure, but it seems you're sending to the address of the tone wallet, not to the address of your token wallet (reply to 89496)

Vladislav: https://testnet.tonviewer.com/kQAXImSI3108Buwn-qRVgW-YM8Qde2NgT-3VZElnrwRzE57T/jetton/kQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bSaM  here you can see the holder address and the wallet address  try  the first one (reply to 89496)

Stephan: I know, but I also tried to send the message to JettonWallet, it also doesn’t work (reply to 89500)

Stephan: But even if this is the case, why does the error 62972 Invalid Balance come out? (reply to 89499)

Vladislav: well, yes, you are right, the execution occurs in this case precisely on the contract of your token wallet. Otherwise, the error would not be like that at all (reply to 89503)

Vladislav: yes, first step is this article https://medium.com/coinmonks/understanding-ton-transactions-how-to-track-transaction-results-and-utilize-tonclient-b992336eb3a3  and after this line: if (inMsgHash === hash) {  You can use this code block const computePhase = lastTx.description.computePhase; if (txDescription.type !== 'generic' || txDescription.computePhase.type !== 'vm') { // I'm not sure if I should use "vm" here too return; }  if (!computePhase.success) { const exitCode = computePhase.exitCode; console.log(exitCode); return; }  // Here it turns out the transaction was executed successfully  Something like that, I hope I helped (reply to 89498)

Stephan: to: contractAddress(initContract),   And how do I pass JettonWallet instead of this parameter while writing the script? That is, you can try after deploying and sending the token (and not before, as it was in the contract) to find out the exact Jetton Wallet of the sender and contact him already. As an option

Vladislav: your token wallet address should be and can be calculated based on the contract code and the input parameters of the initialization method  and also in the example code of the lesson that you threw - the master contract has a method for getting the initialization state, which can be used to get the wallet address virtual fun getJettonWalletInit(address: Address): StateInit { return initOf JettonDefaultWallet(myAddress(), address); } then you pass the received StateInit to export declare function contractAddress(workchain: number, init: StateInit): Address; contractAddress from the '@ton/core' package  But I didn't do it that way, I did it differently: I took its class from the compiled contract code, say JettonWallet, and then used the following code: const jetteonWalletInit = await JettonWallet.fromInit(initArg0, initArg1, ...); const jettonWallet = client.open(jetteonWallet);  const jettonWalletAddress = jettonWallet.address In my case client is TonClient from '@ton/ton' package I guess that's all I can help you with :)  UPD:  Example code also has this getter     get fun get_wallet_address(owner: Address): Address {         let winit: StateInit = self.getJettonWalletInit(owner);         return contractAddress(winit);     } (reply to 89508)

Faithful1ofall: Do you need a paid. Consultation (reply to 89512)

Vladislav: sorry, I don't think so :)  I've only been messing around with the TON-network for the second week. I'm just trying to help newbies like me. Because there is often silence in the chat and scanty responses  UPD: sorry, I read it wrong (reply to 89513)

Stephan: ok, thank you, i will try do something (reply to 89512)

User<7215159918>: /

I16000: how can i transform hex code b5eee.... in FunC to slice or cell?

I16000: when i trying to "b5eee..."s,i have error Invalid hex bitstring constant

I'm: Hi everyone, I am trying to read jetton data but I cannot parse the response in Cell format. Can you share me a docs or an example code. Thank you

Thea: Hello dm please (reply to 89440)

.: Hi  Can I create NFT directly for my friend ?

— 2024-07-29 —

Thea: Sure you can (reply to 89549)

.: How ?)) (reply to 89550)

Thea: You find a dev for it (reply to 89551)

tony: Hello everyone! We are a team dedicated to building the TON ecosystem. We have developed several AI bots to assist with development. Currently, we have three bots: a bot to help with the issuance of Jetton tokens, a bot to assist in writing Tact, and a TON documentation assistant bot. We welcome everyone to give them a try!

tony: These are some of our links. You can check them out.

Prince: just ask here what you want to know (reply to 89551)

Prince: we support all members

.: Hi  I want to know is it possible? If yes - how to do in FunC or other languages (it is not important)?  (Q:  Can I create NFT directly for my friend ?) (reply to 89566)

SJ: Hi

SJ: @combot

Prince: https://docs.ton.org/develop/dapps/tutorials/collection-minting

Prince: follow this and if you face difficulty, then feel free ask to us

Prince: but if you want just create only one, why don't you try getgems.io?

.: Hi  How to deploy smart contract via other smart contract on FunC (one smart contract deploy other smart contract)?

leaf: I'm having problems linking wallets in development, can anyone help me?

kevin: https://github.com/ton-blockchain/token-contract/blob/2c13d3ef61ca4288293ad65bf0cfeaed83879b93/ft/jetton-minter.fc#L28 (reply to 89585)

.: How to try this with nft smart contract? Is nft minter? (reply to 89588)

kevin: https://github.com/ton-blockchain/token-contract/blob/2c13d3ef61ca4288293ad65bf0cfeaed83879b93/nft/nft-collection.fc (reply to 89589)

Kryptonite: can someone please share any code snippet in js to compile and build smart contract from hex

Kryptonite: basically i completed my smart contract development on blueprint, and now have hex generated, but need to integrate it in other js

cloudb: how to get the gas price?

Development: hi. looking for a job as a developer. studied at the official school ton dev study

Harpreet: Can I connect Ton Keeper Mini App wallet to another Mini app?

Think: Thank you for the talk last night  I learned alot thank you

Prince: let's,,,, be careful about scams

&rey: At https://tonviewer.com/config#21. It is pretty much constant, actually — changing it requires votes of 2/3 validators. (reply to 89598)

&rey: On getgems.io, for instance. (reply to 89551)

.: Hi  What do I wrong ? int op::transfer asm “0x5fcc3d14 PUSHINT”;

&rey: Either const int op::transfer = 0x5fcc3d14; or int op::transfer() asm "0x5fcc3d14 PUSHINT"; (reply to 89622)

Almatbek: Plz use tonweb package  const TonWeb = require('tonweb'); const tonweb = new TonWeb();  async function checkTransaction(txHash) {     const response = await tonweb.net.queryCollection({         collection: 'transactions',         filter: { id: { eq: txHash } },         result: 'id, status, error'     });      const txDetails = response.result.data[0];     if (txDetails.status === 'success') {         console.log('Transaction successful');     } else {         console.log(Transaction failed with error: ${txDetails.error || 'Unknown error'});     } }  checkTransaction('<transaction-hash>'); (reply to 89443)

Pradeep: How to create stake and unstake transaction object/payload for tonstakers liquid staking protocol which accepts wallet address and amount

Barbell: Hi I am having an issue to store Dictionary in inititial state. I am using ton web but I am getting serializer issue. My dictionary configuration Dictionary<number,OwnerDetails>;

Barbell: export function multiSignatureConfigToCell(config: MultiSignatureConfig): Cell {     return beginCell()     .storeUint(config.id, 32)     .storeUint(config.verified_signers, 32)     .storeUint(config.request_id, 32)     .storeDict(config.ctx_owners,          Dictionary.Keys.Uint(256),         Dictionary.Values.Buffer(256)     )       .endCell(); }

Nightfall: Hello, when out function flow consists of multiple messages, can we be assured that all the messages (txns) will be "mined" at some point? (reply to 89623)

&rey: Yes, TON guarantees that every internal will be delivered and processed eventually. (reply to 89631)

&rey: Even if the queue is several hours long, as it happened once.

Nightfall: cool, thank you! (reply to 89632)

I'm: Hi everyone, I am writing a function that use one wallet to send TON to multiple wallet. I have problem when create the transfer payload that "seqno" is the same for all transfer payload. If I wait each transfer done to update "seqno" and made next transfer, it is bad code and very slow. Dp you have any solution or properly way? Please support me, thank bro.

Nightfall: also one more question, about try-catch, is it only applied to compute phase and not action phase? (e.g putting an action that would cause error 37 insufficient value  when sending, would it go to catch clause?) (reply to 89632)

&rey: Compute phase only. (reply to 89636)

&rey: Flag +2 allows to ignore errors in action phase.

Nightfall: thank you man :) (reply to 89638)

Nerses: Who can explain differences of fields custom_payload  and forward_payload in Jetton Transfer message ?

Artem: the question is that when i send a get request with the following url tonapi io/v2/accounts/0:57da21736334b6a0e41f0496e9dcae07b929a56602a556710d942a67a27f484d/jettons/history?limit=100 i get empty events array, when in fact it is not empty

I16000: Anybody knows how I can convert hex code to cell inside contract, FunC language,I need deploy contract from another contract

Uncle: hey, does ton smart contract revert state changes if there is bounce?

&rey: Yes. Or, rather, not applies them. (reply to 89653)

Uncle: state i mean mapping data etc. (reply to 89654)

Uncle: means mapping data also got reverted if bounce right bro?

Sumit: self.mapping.set(k, v); send(….) // <———This bounces (reply to 89654)

Sumit: then it wont revert

&rey: Well, it isn't an error during contract execution. (reply to 89659)

Sumit: cool.

UncleRooks: Please i need help

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 60 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 13  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

&rey: Seems like stdlib is corrupted.

UncleRooks: how do i fix it pls (reply to 89669)

&rey: Save stdlib.fc, for instance (tab indicates unsaved changes).

UncleRooks: wow it worked😂😂😂 i have been on the issue for a week now

Raf: have you been developing on TON/func for a long time ? (reply to 89671)

Akachi: Why its not showing in testnet tonscan?

Энди: Hello everyone!   I'm doing lesson part 2, Step 8: Deploy the contract on-chain  When input in terminal the next command "npx blueprint run "  I choose testnet, wallet Tonkeeper, but get error:  "ManifestNotFoundError: [TON_CONNECT_SDK_ERROR] ManifestNotFoundError: Manifest not found. Make sure you added tonconnect-manifest.json to the root of your app or passed correct manifestUrl.  Unable to connect to wallet. "  Where is mistake?

Snow Lee: alright so depends on which language you code with you always want your tonconnect-manifest.json to be viewable publicly (reply to 89681)

Snow Lee: for example [DOMAIN_NAME_HERE]/tonconnect-manifest.json, if you can view the json's detail then and only then will Tonconnect register your manifest

Abdulaziz: Is that not important to connect via nmp or yarn or pnpm?

Abdulaziz: I mean my hosting does not support yarn nmp or pnpm

Abdulaziz: Only php with compоser, i hope it's enough for starting

&rey: Projects are usually built locally or on runners, then deployed. (reply to 89689)

&rey: There's no need for anything special in backend, or for any backend at all IIRC. (reply to 89691)

Abdulaziz: I can deploy smart contracts using ton sdk on php, but i need compile it by myself, maybe that's can be problem if I want to make compiling process automatic (reply to 89694)

&rey: Please check if you do so on frontend or backend. Any of two can interact with blockchain. (reply to 89695)

defany: Hi everyone! I'm playing now with sending jettons via ton connect, I took from the documentation an example of sending a payment with a commentary  The request reaches the wallet, the window for payment confirmation is also visible, but the transaction itself falls with an error, can you tell me what I'm doing wrong?)  Idk how to show you my code, because bot is deleting my messages with links on gist and with code examples...

Bryce: hi guys im trying to emulate a boc in tonapi i have created the cell with this code const cell = await sender_contract.createTransfer({     seqno,     secretKey: sender_keyPair.secretKey,     messages: [internal({         value: '0.002',         to: address(String(receiver_wallet.address)).toString({ bounceable: false }),         body: 'Hello world',         bounce: false     })],     sendMode: 1 }) and getting the boc with this code console.log(cell.toBoc().toString("hex")) and it returns the boc hex then i send it to emulate event endpoint on ton api and it returns {   "error": "not enough bits" }  what is the problem?

-/-: Hello, everybody. I'm on a research about TON and there is something im wondering about. Can somebody give me information about when to use FunC and when to use Fift?

Key - NEVER DM FIRST: Hi sir i have built a mini app, it works fun on desktop and ios , but it shows nothing on andriod，have anyone met this problem？

-/-: I mean I understand that the Fift is a way low-level and better for direct interaction between TVM and contract but I cannot really find a real-world case for that (reply to 89706)

&rey: TVM assembly (commonly confused with Fift) can be used when you need certain placement of values on stack, or invoke some instructions directly. FunC is type-checked, on other hand. (reply to 89706)

-/-: So, can we say it like; Fift is for kind of "complex memory management" in TVM? (reply to 89709)

&rey: For instance, it is quite hard to rewrite such code in FunC: tuple digitize_number(int value)   asm "NIL WHILE:<{ OVER }>DO<{ SWAP TEN DIVMOD s1 s2 XCHG TPUSH }> NIP";

-/-: Okay but cannot i invoke instructions directly via FunC? (reply to 89709)

Nguyễn Linh: Hey, How can I track the outcome status of transaction after sending using TonClient

Abdulaziz: On ton blockchain address can be wallet address, or smart contract or token or anything, right?

&rey: Yes. In particular, wallets are smart contracts. (reply to 89715)

-/-: @pcrafter , any idea on that? (reply to 89712)

&rey: You can (using asm intrinsics, though), when types of inputs and outputs can be written down. (reply to 89719)

Nguyễn Linh: const TonWeb = require('tonweb'); const tonweb = new TonWeb();  async function checkTransaction(txHash) {     const response = await tonweb.net.queryCollection({         collection: 'transactions',         filter: { id: { eq: txHash } },         result: 'id, status, error'     });      const txDetails = response.result.data[0];     if (txDetails.status === 'success') {         console.log('Transaction successful');     } else {         console.log(Transaction failed with error: ${txDetails.error || 'Unknown error'});     } } r

-/-: So, to invoke instructions; I need to use asm in FunC, but via Fift; I dont need to use asm in-block (reply to 89720)

Kishidle: What's the best way to interact w/ TON on the backend-side, preferably using blueprint's wrapper classes for the contract(s)?

Kishidle: I'm looking at ton-sdk right now, but I'm not sure which one here.

Tanya: for free? (reply to 89732)

Tanya: maybe your coin is 0$??? (reply to 89735)

Tanya: this is received history. not send history (reply to 89737)

Mubashar Rahman Aronno: Hey guysss

Mubashar Rahman Aronno: What are we having here?

kapil: How to send the data in the form of the array in the func language or ton blockchain

kapil: ... (reply to 89742)

Tanya: can you send me 1000 toncoin? (reply to 89745)

Mubashar Rahman Aronno: Bros?  Is there any nft chat group of ton in tg?

kapil: How a can send the multiple address along with there token amount to transfer to different account

Mubashar Rahman Aronno: Who falls for this kinda scam man!

Bryce: hi guys im trying to emulate a boc in tonapi i have created the cell with this code const cell = await sender_contract.createTransfer({     seqno,     secretKey: sender_keyPair.secretKey,     messages: [internal({         value: '0.002',         to: address(String(receiver_wallet.address)).toString({ bounceable: false }),         body: 'Hello world',         bounce: false     })],     sendMode: 1 }) and getting the boc with this code console.log(cell.toBoc().toString("hex")) and it returns the boc hex then i send it to emulate event endpoint on ton api and it returns {   "error": "not enough bits" }  what is the problem?

Dmitriy: Could you please elaborate a bit on how does +2 mode work? I didn’t really get what does “ignore errors in action phase” means E.g. if there is not enough TONs to send message, what will happen? (reply to 89638)

.: Hi, if I call deploy nft 10 times, will I get one transaction with multiple outputs or multiple transactions?  (https://github.com/ton-blockchain/token-contract/blob/2c13d3ef61ca4288293ad65bf0cfeaed83879b93/nft/nft-collection.fc)

User<7019829594>: Hello Guys I'm new here, I wanna become a professional TON developer. if you have a task for me, I can do it for free. I wanna get a experience with someone's task. FEEL FREE and please contact me. thanks

Robbie: You need to base64 encode 🙂 not hex    cell.toBoc().toString("base64") (reply to 89754)

User<7019829594>: Additionally I have experience with node.js, Django for backend. I was worked at microsoft. at that company, my role is backend developer. but now I focused TON blockchain. TON is feature's Network. because TON is asynchronous blockchain unlike other blockchain. I'm sure that TON will be great chain~~~~~~

kapil: How we can send the multiple address in the message body in the ton

User<7019829594>: you can send it with blueprint (reply to 89768)

kapil: I want to ask which data set to use

kapil: While sending the address

&rey: You need to send multiple messages. (reply to 89768)

kapil: I can't send the multiple address with in the single message (reply to 89774)

&rey: No, messages have one source and one destination. They are not multicast-able. (reply to 89775)

kapil: By using the dictionary

kapil: And the list of the addresss

.: Hi, I start test and I got error: const is not defined (reply to 89623)

&rey: Maybe too old compiler? (reply to 89781)

.: I used FunC compiler in ide nujan (reply to 89782)

.: If I do send_raw_message in loop “while” it will be working like this ? (reply to 88774)

&rey: Yes, up to 255 messages can be sent.

friew0: hi is there a ton job group?

Sagara: @pcrafter Hi,  I'm running a Ton full node and it's growing and I need to prune the node. Is this possible and if so is there any documentation for this task ?

Anton: I tried to send transaction by node Js 😤   status: 429,     statusText: 'Too Many Requests',  it's testnet issue?

TON Bounty Bridge: ​TON Smart contract development course (Chinese)  🏷 Education  Summary:I will make TON Smart contract development course(6 lessons) in Chinese.Mainly focus on Func Smart ...  Rewards: • 2500 USD  Created by kojhliang

Daniil: Hi! Maybe someone can help me?  I am creating next.js app with @tonconnect/ui-react. I am facing with such issue: sometimes when I launch my app useTonWallet hook returns null for a moment, and than returns normal wallet object (Wallet is currently connected to the app). How to fix this?

Mage: Hi

Abdulaziz: query_id has fixed value or it can change by time?

&rey: It can be arbitrarily selected by user. (reply to 89813)

User<7321842220>: Hello, we are lооking for emрlоyees for a crypto рroject: Beta tester ($37/hour) Moderator ($400/week) NFT artist (to be discussed) Advertisers (to be discussed) Web Developer (to be discussed) If you are interested in collаborating, plеase send me a DM!!!

&rey: Isn't @tonhunt better for that? (reply to 89817)

TON Bounty Bridge: ​Multilingual localization collaboration system for TON Docs  🏷 Developer Tool  Summary:The Translation Program is a collaborative effort to translate various documents related to TON into...  Rewards: • 5000 USD  Created by TonSquare

Abdulaziz: Is smart contract can create another smart contract?

&rey: Yes. (reply to 89822)

Aleks: Anyone know a good explorer for testnet where we can also see the NFTs and their metadata?

𝚠𝚊𝚕𝚝𝚌𝚘𝚘𝚔𝚜: testnet.tonviewer.com (reply to 89824)

Aleks: No NFT metadata on that one it seems tho (reply to 89825)

Aleks: https://testnet.explorer.tonnft.tools/

𝚠𝚊𝚕𝚝𝚌𝚘𝚘𝚔𝚜: hmm, I can see metadatas, for example this 🤔 https://testnet.tonviewer.com/kQCtX5mBXkcKl3hPTD4q0BKkRxI-LZ_LobDOOLeTPJXOA60i?section=nft (reply to 89826)

Aleks: Okk nice! This confirms me that the problem is on my end then 😃Thanks (reply to 89829)

Nxrix: Is it possible to make a web app that can load ton domain based websites?

Aleks: https://github.com/howardpen9/nft-template-in-tact

Aleks: Anyone been able to deploy a collection based from this on testnet? (reply to 89835)

Vinit: Hey folks, We are currently running a ticket giveaway for TOKEN2049 Singapore! Please DM me if you're interested in participating.

Aleks: That'd be lovely. I'm probably missing simple details (reply to 89846)

Faithful1ofall: Who need Devops engineer ??

Development: Who need Devops engineer ??

Dmitriy: Hey guys! Does anybody know how GUI wallet apps like tonkeeper fetch the info about jettons ownership? Is it based on transfer_notification or they poll api from time to time? Just wondering if it makes sense to set non-zero forward_ton_amount while doing the regular jetton transfers from my contract

UncleRooks: i am back again guys

UncleRooks: cannot use import statement outside a module. pls how do i fix this

Maxey: Has anyone encountered the ETIMEOUT ERROR when calling api.telegram.org APIs on GCP?

— 2024-07-30 —

Almatbek: Could there be an opportunity for a capable developer to contribute to your project?

Crypto: Hello

Crypto: Can anybody help me with my code?  I’m sending a message to the parent contract from the child contract   So the parent contract can send rewards to the owner of the child contract   But the Jetton transfer keeps bringing error

Crypto: Here’s my code

Crypto: fun sendJettonTransfer(to: Address, amount: Int) {         // Send a message to the Jetton contract to perform the transfer         send(SendParameters{             to: self.rewardTokenWallet,             body: Transfer{             jettonAmount: amount,             to: to,             responseAddress: myAddress(),             customPayload: null,             forwardTonAmount: ton("0.05"),             forwardPayload: emptySlice(),             }.toCell(),             value: ton("0.2"), // Fee to cover the transaction             mode: SendIgnoreErrors         });

3BASE: Hello  🌟 We are 3Base, one of the Largest Telegram Apps Stores. 🛫 We are dedicated to helping developers promote their Mini APPS for free.  🚀 Publish your app on 3Base now, 🔥 and gain at least 2,0000 users for free!  🤖 Bot: @ton_3base_bot 📢 Channel: @official3basechannel  🌐 Website: https://3base.io 🐦 Twitter: https://twitter.com/3base_io  👤 Publish Support: @Ton_3Base  🚀 Exclusive Opportunity: Enjoy free top banner ad placement for a limited time! Act fast and submit your app today!

.: Hi  How I create 100 or 200 NFT (via 1 transaction) with smart contract?

kevin: You can do it with highload wallet (reply to 89926)

.: Do you have documentation or anything about it ? (reply to 89928)

UncleRooks: Guys pls help my life (reply to 89871)

UwU•JJ: Hi sers!  Following this docs: https://docs.ton.org/develop/dapps/ton-connect/sign#structure-of-ton_proof  I tried and wondering if the domain can be manually configured? now it seems to be auto-gened by the sdk to be the running server of FE? (localhost in my case)

kevin: DM you (reply to 89929)

kapil: What are exotic cells and why do we use them

Celina 🌈: Hello Ton Team! We would like to integrate TON api to our website to receive our users payment (deposit) and send funds to our users(withdrawals). We would like to generate an unique Ton address for each of our user. For example, they will only need to deposit/transfer TON to their unique ton address, then they will have balance in their account with us. May I know which part of the API document shall we refer to?

User<6477320571>: /

Celina 🌈: Anyone here can assist me with my concern? Thank you! (reply to 89945)

User<7321842220>: Hello, we are lооking for emрlоyees for a crypto рroject: Beta tester ($37/hour) Moderator ($400/week) NFT artist (to be discussed) Advertisers (to be discussed) Web Developer (to be discussed) If you are interested in collаborating, plеase send me a DM!!!

Prince: be careful about scam, guys.

Evelyn | Twendee: Need senior devs to speed up projects? We can help. Recent success: A Telegram Miniapp with 30k users in a month. DM for inquiries

User<7192644220>: How can I create testnet wallet? I have the log "wallet is not deployed" in step9.ts in tutorial.

User<7192644220>: Here is my code. const endpoint = await getHttpEndpoint({ network: 'testnet' })   const client = new TonClient({ endpoint })    // make sure wallet is deployed   if (!(await client.isContractDeployed(wallet.address))) {     return console.log('wallet is not deployed')   }

kapil: store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)

kapil: explain this if possible

UncleRooks: /

UncleRooks: Pls what is wrong with my code

User<6327676316>: Hi. chunk-RN2IYJU5.js?v=2c7647cd:557 Uncaught ReferenceError: Buffer is not defined     at node_modules/@ton/core/dist/boc/BitString.js (chunk-RN2IYJU5.js?v=2c7647cd:557:37)     at __require2 (chunk-PLDDJCW6.js?v=2c7647cd:17:50)     at node_modules/@ton/core/dist/boc/BitBuilder.js (chunk-RN2IYJU5.js?v=2c7647cd:569:23)     at __require2 (chunk-PLDDJCW6.js?v=2c7647cd:17:50)     at node_modules/@ton/core/dist/boc/Builder.js (chunk-RN2IYJU5.js?v=2c7647cd:15000:24)     at __require2 (chunk-PLDDJCW6.js?v=2c7647cd:17:50)     at node_modules/@ton/core/dist/address/contractAddress.js (chunk-RN2IYJU5.js?v=2c7647cd:15547:21)     at __require2 (chunk-PLDDJCW6.js?v=2c7647cd:17:50)     at node_modules/@ton/core/dist/index.js (chunk-RN2IYJU5.js?v=2c7647cd:18340:29)     at __require2 (chunk-PLDDJCW6.js?v=2c7647cd:17:50)  Please help me.

kapil: What is seed

kapil: ... (reply to 89968)

prometheusoo: How to send external messages to highload wallets on web pages?

&rey: Bit representation of left number was made to fit block.tlb, filling message parameters. (reply to 89960)

&rey: Private key. (reply to 89968)

kapil: () set_claimed() impure asm "<b 1 1 u, b> PUSHREF c4 POP";

Buggy: Hi guys, is there any way to change the chain to testnet in Telegram wallet?

Nerses: Hello everyone,  I'm excited to share a project I've been working on! We've developed a new protocol called PreHTLC, an evolution of the traditional HTLC (Hash Time-Locked Contract) designed for crypto asset transfers. This protocol aims to facilitate truly permissionless and trustless cross-chain asset transactions.  We're providing a user-friendly UI along with the necessary links and access to our GitHub repository for those interested in diving into the code or providing feedback.  Looking forward to your thoughts and feedback!  UI: https://layerswap.io/v8  GitHub: https://github.com/layerswap/layerswap-atomic-bridge

&rey: One lock can process at most 32K messages, right? Alright, seen that you delete inactive locks/commits. (reply to 89976)

&rey: I believe it would be best to put some thought into optimization. For instance, do something like     receive(msg: Unlock) {         let ctx: Context = context();         let lock: HTLC = self.locks.get(msg.data.hashlock)!!;         require(lock.timelock < now(), "Not Passed Timelock");         require(!lock.unlocked && !lock.redeemed, "Invalid State To Unlock");                      if (lock.sender == ctx.sender) {             send(SendParameters{                                 to: ctx.sender,                                 bounce: false,                                 value: lock.amount,                                 mode: 64                             });         } else {             send(SendParameters{                     to: lock.sender,                     bounce: true,                     value: lock.amount,                     mode: 0                 });             send(SendParameters{                     to: ctx.sender,                     bounce: false,                     value: 0,                     mode: 64                 });         }          self.locks.del(msg.data.hashlock);     }

&rey: (In fact, there is no place where unlocked would be set to true.)

Nerses: It will be optimization in context of compute fees,won't it ? (reply to 89978)

Nerses: as I delete it,I think there is no need to change state of unlocked (reply to 89979)

tony: Hello everyone! We are a team dedicated to building the TON ecosystem. We have developed several AI bots to assist with development. Currently, we have three bots: a bot to help with the issuance of Jetton tokens, a bot to assist in writing Tact, and a TON documentation assistant bot. We welcome everyone to give them a try!

Nerses: why it is better to use mode 64 than 0 in that case ? (reply to 89978)

&rey: Because it deducts TON used for computation fees. If you sent all of ctx.value back, contract would pay for computations on it, and that's not stable. (reply to 89985)

Irina|Rubic OFF, delayed replies: @tsivarev could you pls check DM

Suntrider: anyone complete smart contract of babyjubjub signature verfiy？

0xbera: what is the difference between external and internal messages in TON?

.: Hi, I have question, if I mint NFT, I will get on my address or collection address  ?

&rey: Externals come from outside of blockchain. Internals are between contracts and thus carry TON. (reply to 89999)

0xbera: so, external messages cannot carry TON? (reply to 90001)

&rey: Yes, because there is no TON outside of TON Blockchain. (reply to 90002)

0xbera: thank you - is something like this possible in TON 1. wallet-A prepares a message for wallet-C (msg-1) 2. wallet-A sends the prepared mssage (msg-1) to an intermediate wallet (wallet-B) 3. wallet-B sends msg-1 (prepared by wallet-A) to wallet-C  ??

Abdulaziz: [2024-07-30T09:50:10+00:00] (error) Error occurred: Class "TonMnemonic" not found [2024-07-30T09:50:10+00:00] (error) Stack trace: #0 {main} An error occurred: Class "TonMnemonic" not found TON php sdk

kapil: Why do we use the msg_value and msg_balance in the rec_internal function

Abdulaziz: How to fix, maybe i did something wrong (reply to 90006)

Pika: how can i convert my public key to uint256. it is required for sign verification on TON. please help.  https://docs.ton.org/develop/func/stdlib#signature-checks

kapil: A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.

0xbera: I was reading the source code for xssnick/tonutils-go and it sends all messages as external messages via the following line   err = c.client.QueryLiteserver(ctx, SendMessage{Body: req.ToBOCWithFlags(false)}, &resp)   I was wondering how fees are paid / deducted from the sending wallet..? (reply to 90001)

&rey: If contract (user's wallet) accepts the external, it pays its processing fees. (reply to 90021)

0xbera: ah - I see - thank you!

kapil: How is fees deduction is done in the ton blockchain

Vraj: Hello folks!  I want build token smart contract on TON chain....Now, I am new to FunC and Tact....Can someone give me examples of token smart contract? (fungible like erc20)

Thanh TX: How could I deal with error: "Network not allowed". Trying to transfer ton using tonweb, rpc testnet of toncenter

kevin: https://github.com/ton-blockchain/token-contract/tree/2c13d3ef61ca4288293ad65bf0cfeaed83879b93/ft (reply to 90027)

Vraj: yeah, I saw this but this contract is for ICO, right? I just want token contract (reply to 90029)

kapil: TypeError: Do not know how to serialize a BigInt         at stringify (<anonymous>

kevin: check jetton minter pls (reply to 90030)

Jupiter: Hi, I'm looking for a creative designer preferably from Europe, who'd help me design the UI for a Telegram mini app and draw some items for it.   If you're a designer or know anyone suitable, please DM me.

Pibu: hey everyone. I need to store some identification information about a smart contract. I can't use address really, beacuse it has to be a 32 byte value (256 bit). How can I generate a hash of the address returned by my_address()?

Sunil | Aerius Labs: what can we use instead of this npm package endpoint "@orbs-network/ton-access", facing issues with this.

Marshal: hey guys i need to see every transaction done in blockchain in nfts what can i do?  for example i need to create a price alert bot that reports me that new nfts are listed or transfered from a collection

0xbera: are there any commercial litenode providers with defined API rate limits? any recommendations?

0xbera: any idea or speculation why that package only uses external messages? (reply to 90022)

M: /me

&rey: Because entity outside of blockchain can only send external messages. (reply to 90046)

Presidente: sup mates i searched whole sites/docs/notions and cant find clear visualisation of how the chain works so i put this in mermaid ai  "Make a new example where Alice sends Bob 1 TON, Bob sends 5 people 0.2 TON each, and then all of those people send their TON to Trump"  can somebody review this or send me any better picture about wtf is going on here please

Raf: I managed to store coins in a cell, in a bank contract, how am i supposed to decode it from JS ?

Raf: global cell ctx_balance;  () save_data(int coins) impure {   set_data(     begin_cell()       .store_ref(         begin_cell()           .store_coins(coins)           .end_cell()       )       .end_cell()   ); } ...  // in the wrapper async getBal(provider: ContractProvider) {   const result = await provider.get('get_bal', []);   return result.stack.readCell(); } // how to decode this ? // x{50BA43B7400}

&rey:     result.stack.readCell()         .beginParse().preloadRef()         .beginParse().preloadCoins(); (reply to 90061)

Almatbek: I can help you (reply to 90041)

Nerses: I used this code from compiled files of my project,while trying to use it I get wrror too much referecnes but the maximum count of references I have is 4 which is ok.Can someone hint what can be the problem ?   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());    let b = new Builder();    const forward_payload = b.storeUint(1734998782, 32).storeBuilder(b_0).asCell();

Raf: Thank you this is my Wrapper code to get balance , just slightly different    async getBal(provider: ContractProvider) {     const result = await provider.get('get_bal', []);     return result.stack.readCell().beginParse().preloadCoins();   } (reply to 90063)

&rey: Error usually points at specific line. Where does it point in this case? (reply to 90065)

kapil: What is the use of the msg value in the internal msg

𝘈𝘭𝘦𝘹𝘦𝘺: Hi (reply to 89407)

&rey: It allows contract to get how much TON were sent to it in the message. (reply to 90069)

Raf: @pcrafter i pushed this simple contract on github, it's supposed to just store TON right now, does it have security issues / or do you have any remark/guidance about it ? https://github.com/fabcotech/ton-func-contracts/blob/main/contracts/bank.fc

Nerses: I use it in ts script to intercat with smart contract.The error i get is Error: Too many references at ........(all files in node_modules)  and at line within the same script.The line is   await contractProvider.send(walletSender, { value: toNano("0.2"), bounce: true }, tokenTransferMessage); (reply to 90067)

&rey: Then probably error occurs within contract? (reply to 90073)

&rey: Yes, this contract has issues. in_msg_body~load_coins() cannot be trusted; you should add msg_value instead. (reply to 90072)

Nerses: i dont think it would be in contract,as i use that long script as forward_payload   for Jetton Transfer,and also when i comment one  of the storeDict  it works (although in that case contract as forward-payload gets invalid message throing exit code 130[invalid message]) (reply to 90074)

&rey: How is forward_payload converted into tokenTransferMessage?

Nerses: as forward_payload is Cell field within in tokenTransferMessage i pass all that aggregated data as argument for the field forward_payload (reply to 90078)

kapil: @pcrafter can you testing code for the jetton transfer token

Nerses: Slice as remaining is type for  forward_payload,i am mistaken.I pass the vraiable in previous code snippet (reply to 90079)

TON Bounty Bridge: ​10,000,000  🏷 Developer Tool  Summary:از چشمها یا اثر انگشت برای ورود استفاده کنید  Created by Hildahirad

???: Hello everyone, at the development stage I noticed one problem: when you disconnect a wallet from your web app, the data that the wallet is disconnected is not transmitted correctly, the web app still thinks that it is connected. After testing in the browser, I noticed that everything works correctly and the wallet is disconnected correctly .What could be the problem?

Raf: @pcrafter When we deploy a contract with example toNano('0.05') (=50000000) as msg.value. This amount of TON is stored as balance of the contract right ? Just want to make sure.

???: from me as always (reply to 90088)

Abdulaziz: How did you got this dns? Are you founder of TON or something? (reply to 90070)

Cube: Have someone used Tonhub credit card?

???: guys😢...

kapil: Difference between the msg_value and jeeeton amount

Raf: msg_value is the amount of TON attached to the transaction, TON is the native asset of the blockchain, just like ETH is for Ethereum mainnet (reply to 90095)

kapil: I want to ask want is difference when we are sending the amount in the msg body and value in the internal message

&rey: can be arbitrarily set by sender. (reply to 90097)

&rey: Value of internal message is checked by validator.

kapil: Can you elaborate more

kapil: ... (reply to 90100)

Abdulaziz: I heard that a smart contract must pay rent during its existence, that is, all tokens and wallets are smart contracts, does this mean that the NFT can disappear from the wallet? Explain please

𝘈𝘭𝘦𝘹𝘦𝘺: I am not an employee of the TON Foundation. I am Pavel Durov from my second account, but several dozen people have already declassified me.   But seriously, I'm an ordinary person, and I was lucky to buy such a domain and link it to a zero address (reply to 90091)

𝘈𝘭𝘦𝘹𝘦𝘺: The payment there is so microscopic that the contract can live for several years without transfers. (reply to 90105)

Abdulaziz: NFTs also pay? (reply to 90108)

Abdulaziz: What's actual gas fee for minting nft with smart contact?

𝘈𝘭𝘦𝘹𝘦𝘺: Each NFT has a certain amount of TON to operate. If they run out, you will then have to pay a slightly higher commission to send NFT. (reply to 90109)

kapil: Value and amount (reply to 90100)

&rey: Around 0.02 TON should be left on NFT contract, so including collection update that should be near 0.03 TON. (reply to 90110)

Marinov | Injscribed - DiscoverInj: How to generate fair random number in Ton?

Abdulaziz: Does all smart contract have their own private keys? Mnemonic word

&rey: No. (reply to 90119)

&rey: There are ECVRF oracles which generate fair random numbers not predictable by any another party. (reply to 90118)

Marinov | Injscribed - DiscoverInj: Can u link me the source or any example? (reply to 90121)

&rey: Example? https://ratingers.pythonanywhere.com/ecvrf-about.html. (reply to 90122)

Marinov | Injscribed - DiscoverInj: This can be implemented inside smart contract? (reply to 90123)

Abdulaziz: Anybody knows how to switch to testnet on php ton sdk?

kapil: Can anyone share the test in blueprint for the jetton transfer tokan

H: Hi , hru , in nft-collectiin contract if i mint a new nft dose deploy new nft to new reciver or just for the owner of nft-collection ? Cause i didn't see recipient address in in_msg_body when i send it with op==2(it means deploy new nft). 🙏

H: You must upload metadata off chain or on chain (reply to 90136)

UncleRooks: error code: cannot find module

UncleRooks: please how do i fix this guys

sunyoki: what's the difference between this address calculation and the address calculation in jetton's warehouse

&rey: Both are writing the same bit-ref sequence in different ways.

sunyoki: Is it the same

Tom - Bushi: two nft questions: 1. I want the metadata to be stored on IPFS. Does that mean that the item's individual_content should store this IPFS link or is it found on the collection? 2. How can I get all the items owned by an address?

sunyoki: The first one is found in the TL-B document, which seems to be easier to understand

&rey: Common way is cell init = begin_cell().store_uint(6, 5).store_ref(code).store_ref(data).end_cell().

sunyoki: No matter what kind, including the one you sent, the result is the same, can be used

sunyoki: Is that so?

sunyoki: ok

sunyoki: this one's not documented. I can't read it 🙈

UncleRooks: guys can u actually see my texts or i am a ghost in this group😂😂

rkonrock / "🌱SEED"/ 🌊 Wave: @alefman help me

UncleRooks: then pls i beg you all someone should respond to my question. i have asked more than 3 times now

UncleRooks: this pls (reply to 90140)

UncleRooks: hello iris (reply to 90169)

Nerses: can i get blockhash of the specific node on chain (TACT) ?

kapil: Can you send the test code in blueprint for jetton token transfer from owner address to another address

sunyoki: ton-compiler     can also compile (reply to 90171)

Дмитрий: Hello, I have this problem, I created a simple counter in tact, but when I deleted the line self.reply and build it again, then when the transaction is executed, the same thing happens.

Abdulaziz: I see your wallet contract type is "Telegram: @username", how you did that (reply to 90111)

MEW: hello guys, have some problem with tact's compile file

MEW: what does the __system do?

MEW: such a long cell

MEW: and i see this in the output .fc file, why we need this?

Abdulaziz: Will the contract type be written in the smart contract itself or with the ton sdk before deployment?

kapil: What is difference between the treasury and address while using in blueprint for testing

Sammy: Hi all! I need developer to create a wallet with functions such as receiving, sending and storing cryptocurrency. I'm waiting for your portfolio in DM.

&rey: Have you considered forking an existing wallet? (reply to 90207)

Thea: Scammwr (reply to 90207)

Sammy: Proof? (reply to 90209)

Sammy: I want my own project like @wallet bro) (reply to 90208)

Thea: You know I have it (reply to 90210)

Sammy: Show them (reply to 90213)

&rey: I'd like to review. (reply to 90213)

Thea: Please help me with dm I will send it right away (reply to 90214)

Sammy: Send it here. (reply to 90216)

Thea: Ok

Thea: This is some of our conversation I will send the work am doing

Sammy: 😂😂😂 (reply to 90222)

Sammy: With conversation you are telling me like scammer?

Sammy: Show me the project that you have done?

User<7019829594>: kidding? (reply to 90222)

User<7019829594>: share your code on here (reply to 90245)

User<7019829594>: this channel is for dev not for job

Thea: He said to update his Mini App.   His Mini App. TapMBoys_Bot.  While I am on it I told him that I will deliver it in a few moments, because am having trouble with database because he didn't give me any code base to look at to that will help me to finish fast. and this guy just deleted all the messages because I told him to have a little patience

Sammy: You didn't finished ur work in deadline which u said.  Every day you tried to prolong the time with different excuses.  You didn't finish the project for me. You just presented me with a work in image format. You didn't even respond for days when I asked you to build and test it in bot format. (reply to 90267)

Thea: http s://github.com/arewageek/tapmboys (reply to 90264)

Sammy: So, go away from here!!

Abdulaziz: /sdcard/exam $ npx func-js ./brazzers.fc --boc ./sexycontract.boc npm error could not determine executable to run npm error A complete log of this run can be found in: /data/data/com.termux/files/home/.npm/_logs/2024-07-30T19_14_10_854Z-debug-0.log /sdcard/exam $ Why can't just compile contract?

Thea: That's because you are not a dev, you think it's easy a dev something to update without giving them codebase to know how the codes looks, I even tried (reply to 90286)

Sammy: So, dont tell me deadline date!!! (reply to 90291)

Sammy: why you tell deadline date

Sammy: if you cant finish in that date

Thea: and and am not talking to you the admin is watching so I will say anything to you (reply to 90289)

Sammy: why are you calling me like scammer? What, i stole ur project or smth like that?

Sammy: FOR WHAT REASON ARE YOU CALLING ME LIKE THIS?

Sammy: https://t.me/xrocket  i need like this project (reply to 90207)

Artem: This isn't the first time you've been called a scammer (reply to 90297)

Artem: Which is starting to make me suspicious

Sammy: Who said again?) (reply to 90302)

VenomDev: Hi, I am expertise with figma UI/UX design,smart contract, front-end and integration, tg bot & tg mini apps. Plz let me know if you need a dev.

weifu: I am considering the candidacy of a telegram mini-application developer, I need a developer with extensive experience in a large project, possibly in the future 🏆

&: Why don't you try with blueprint? (reply to 90290)

&: @pcrafter  I think we need another job & self-promotion group. @tonhunt is not enough for them. This group is becoming mess recently. Only 2 msgs of recent 20 msg is technical, others are off-topic. (reply to 90301)

weifu: Hi, everybody 👋   We are looking for an experienced developer who knows how to work with TON blockchain, backend, frontend We will consider all candidates, you need experience in this field, you can send me examples of your work in dm

Neo: Have you gotten any responses yet? (reply to 90323)

— 2024-07-31 —

Alex: /stat@combot

Alex: Всем привет👋  Ищем опытного разработчика, умеющего работать с блокчейном TON, бэкендом, фронтендом. Рассмотрим всех кандидатов, нужен опыт работы в данной сфере, примеры ваших работ можете прислать мне в дм

User<7483137682>: hi, everyone this guy is scammer plz dont click some link he is sent  he send someone zoom or VDECK link for discussing the project  this link is very dangerous hope my advice is help (reply to 90323)

prometheusoo: https://t.me/tondev_zh Is the administrator of this group here? I don't know why I can't join this group anymore. Please help me lift the restriction. Thank you

D_d: hey guys basic question

D_d: I'm building ton mini app. I want to have a feature like connect your wallet. So the question is, app itself should made it on client side or this should be done on backend and provided to the app as API ?

prometheusoo: on client side with tonConnectUI

D_d: thanks

0xAadarsh🌱SEED: Can you share me guide to build a mini app from scratch...please (reply to 90368)

NakeyJakey: When I input the same seed phrase in tonkeeper desktop and tonkeeper mobile, they yield a different address. I have already made sure that they are both at version v5

NakeyJakey: any reason why that happened?

NakeyJakey: I am importing a testnet wallet on tonkeeper mobile btw

kapil: What does Slice_bits()

D_d: I can not paste links here but you can find it on docs ton org develop/dapps/telegram-apps/step-by-step-guide (reply to 90375)

Buggy: Is there an example of watching an updated event of the contract? For example, watching if the balance of the jetton wallet increases/decreases off-chain (ts, js, rust)?

tony: Hello everyone! We are a team dedicated to building the TON ecosystem. We have developed several AI bots to assist with development. Currently, we have three bots: a bot to help with the issuance of Jetton tokens, a bot to assist in writing Tact, and a TON documentation assistant bot. We welcome everyone to give them a try!

Alan: hi guys, I am new here, may I know how to monitor all the swap event of a single trading pair from ston.fi/dedust? Really appreciated! (reply to 89004)

0xAadarsh🌱SEED: is there any alternate for this?? (reply to 90389)

D_d: wym?

Deceive Deception: @alefman kindly check dms

c: Why did my ton collection wallet refund me when I paid ton using ton sdk?

Razak: Scam (reply to 90323)

c: Why is the address I get here always different from my token address?

Pasza: Is it possible to send jettons on StonFi to another user?

c: yes (reply to 90408)

Pasza: I mean specifying the recipient during the swap, instead of doing it in a separate transaction.

c: The problem I'm encountering now is that I can't get this token (reply to 90410)

Pasza: оh, sorry, this doesn't relate to your question, I just asked my own.

.: Hello, I have a quick question:  If Wallet A sends Jetton to Wallet B, and Wallet A shows the funds transferred out, but Wallet B’s main account doesn’t show the incoming funds while its Jetton Wallet does, what could be the reason for this? Is the transfer complete? Can anyone help?

kapil: throw_unless(707,      equal_slices(jetton_master_address, sender_address)       |       equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)   );                                                                                               when i am transfering the ton from one account to another account the transtion is being reverted due to above code can anyone assist me

NakeyJakey: is there any example contract that store both int / string and dictionary data at the same time? How should I allocate the data slice?

NakeyJakey: thanks in advance

L: Hi community.

L: I am far from France

L: I have created this script mining via AI . Will you check this for me? Can you help me with a JSON file too?

sunyoki: How to update a contract

Buggy: Can a contract in TON own a jetton wallet? I want to create a contract that will be able to hold a jetton but I got error when transfer jetton to a contract. But no error for the wallet contract with the same code.

L: Whats à contrat!

tan: 🫡

User<5183898074>: Why can't tonview recognize the contract type of the contract as jetton_master?

kapil: Can anyone tell me why I am not able to transfer the token from the one wallet to the another wallet

Umar 1000 🍅: Dm (reply to 90452)

Umar 1000 🍅: Come inbox (reply to 90442)

Kummer: I'm trying to understand how to send a simple ton transaction using a signature obtained from an external source (fireblocks platform). can someone help me?

Marcus: Hello. is there Adsgram admin here?

Marcus: I submit the applications but do not get response

Орельан [NEVER DM FIRST]: Hey there guys, has anyone managed to fully deploy and interact with the jetton deployed by from the code in: https://github.com/ton-blockchain/minter-contract  I've deployed but i kinda struggle to actually mint and transfers because of the lack of wrapper contracts, pretty much gotta encode everything ourselves after the jetton is deployed

sunyoki: func  How does  print a log 🤷🏼‍♂️

Nerses: is this correct data tree ?   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());      let b = new Builder();    const forward_payload = b.storeUint(1734998782, 32).storeBuilder(b_0).asCell();

Felix: Hey guys, – we're looking to build a shop bot for digital products and need an experienced developer!  Is there a place / board where we can share more details?  Anyhow, if you're interested, feel free to DM! 🙂  Best, Felix  PS: We're one of the largest crypto online shops globally 🐝

Thea: Send details (reply to 90481)

Felix: I'm afraid to post links inside this groups, because it got me auto-banned before 😅

Thea: Chat in DM (reply to 90483)

Felix: We're coinsbee, a global online shop for gift cards, mobile phone top ups, game points and more. We're really excited about USDT on TON and want to launch a Bot Shop natively on TG.  We're looking for a developer, that has had experience with developing more complex TG bots, and can also make good judgement calls in terms of what functionality we'd like to implement natively, and what functionality can stay on the webapp. (In tandem with us of course)

Felix: Will do 👍

Jupiter: That's quite a project. Check DMs, maybe we can help you out (reply to 90487)

Dev: DM (reply to 90487)

sunyoki: How to update a contract

Danila: Use set_code TVM instruction (reply to 90493)

Vraj: Hey guys, I am getting an error while deploying token on Ton chain (Tact lang)  Getting error of "Invalid address"   Code:          const owner = Address.parse("tonkeeper address");     const jettonMaster = provider.open(await JettonMaster.fromInit(owner));   I also logged owner address and it's coming right  Can someone help here?

Artem: please help, it is necessary to send not a tone, but another coin import { useEffect, useState } from 'react'; import { Address, toNano, Cell } from '@ton/core'; import { useInit } from './useInit.ts'; import { MainContract } from '../contracts/contractWrapper.ts'; import { useTonClient } from './useTonClient.ts'; import { useConnection } from './useConnection.ts'; import TonWeb from 'tonweb';  const JETTON_WALLET_ADDRESS = 'EQCcXKwYGCCZnzQj9vwwg8Y-F3d8H7cow-Mwgj8pTFruBfP8'; const WALLET2_ADDRESS = 'UQBOhE4qpB9px4eJWGh-g2GNtFik-U2w9YHkzvz74iXjPzry';  export function useContractWrapper() {     const client = useTonClient();     const connection = useConnection();     const [contractData, setContractData] = useState<null | { recent_sender: Address; number: number }>();      const mainContract = useInit(async () => {         if (!client) return null;         const contract = new MainContract(Address.parse(JETTON_WALLET_ADDRESS));         return client.open(contract) as any; // Adjusted for type safety, replace any with proper type     }, [client]);      useEffect(() => {         async function getValue() {             if (!mainContract) return;             setContractData(null);             const data = await mainContract.getData();             setContractData({                 recent_sender: data.recent_sender,                 number: data.number,             });         }         getValue();     }, [mainContract]);      const sendToken = async () => {         if (!mainContract || !client) return;          // Ensure using the correct provider type for TonWeb         const httpProvider = new TonWeb.HttpProvider(); // Initialize correctly with necessary parameters         const jettonWallet = new TonWeb.token.jetton.JettonWallet(httpProvider, {             address: new TonWeb.utils.Address(JETTON_WALLET_ADDRESS),         });          const commentText = 'Sending TRIBE tokens';         const comment = new Uint8Array([...new Uint8Array(4), ...new TextEncoder().encode(commentText)]);          // Ensure you use the correct method signature and property names         const transferBody = await jettonWallet.createTransferBody({             amount: TonWeb.utils.toNano('500'), // Corrected property name             to_address: new TonWeb.utils.Address(WALLET2_ADDRESS), // Correct property name             forward_amount: TonWeb.utils.toNano('0.01'), // Correct property name             forward_payload: comment, // Correct property name             response_address: new TonWeb.utils.Address(JETTON_WALLET_ADDRESS), // Correct property name         });          await mainContract.sendInternalMessage(connection.sender, toNano('0.05'), transferBody);     };      return {         contract_address: mainContract?.address.toString(),         ...contractData,         sendToken,     }; }

Raf: How to know the balance of a smart contract from within the smart contract ???

Stephan: hello guys, please help, where can i find nft tact standard?

MZ: Are you able to connect wallet by @tonconnect/ui-react on your desktop? It works only on my mobile phone. On desktop it opens the page I attached on the screen, but in fact I have Tonkeeper extension already installed and configured.

&rey: my_balance().first() or sth like that. Also, the fourth argument from right side of recv_internal indicates same. (reply to 90507)

&rey: Is there any issue? (reply to 90502)

&rey: What line does the error point at? (reply to 90500)

Vraj: At provider.open line (reply to 90520)

&rey: let jettonMasterGen = await JettonMaster.fromInit(owner); — is that OK?

Vraj: yess  const jettonMaster = provider.open(await JettonMaster.fromInit(owner));

DOR: hello! will one tonconntect-ui-react be enough for full-fledged work and communication with the backend?

Ivan: Can TON Wallet assets be blocked as USDT/USDC?

&rey: No. 1. TON Connect 2 is write-only; it cannot read anything from blockchain; 2. TON Connect 2 doesn't provide any interaction with your backend. (reply to 90525)

DOR: well, how do I link it to ui-react? (reply to 90527)

&rey: No, there is no such functionality for initialized wallets. Even suspending uninit wallet requires validator consensus. (reply to 90526)

&rey: Call appropriate methods of tonConnectUI in your TS/JS code. (reply to 90528)

sunyoki: func has no logging function

&rey: ~dump(x); ~strdump("segment X"); (reply to 90531)

sunyoki: how to debug

sunyoki: oh

DOR: can you please tell me what methods? I did not find it in the documentation, or can you please send a link to the documentation (reply to 90530)

sunyoki: where to view logs (reply to 90532)

Raf: if you use blueprint you will see them in the Node console (reply to 90541)

Raf: How can I know he balance of a deployed smart contract ? bankContract = blockchain.openContract(Bank.createFromConfig(code));

kapil: Can some tell me how to use deployed contract for the real transaction

sunyoki: i me see

Vraj: @here   Can someone help with the doubts? We are trying to deploy tokens on ton chain for our DEX which we will be launching soon.....We are facing issues while deploying token......It would be appreciated if someone could help (reply to 90500)

Kryptonite: why i am getting this error ? and not able to connect tonkeeper ?

defany: i guess invalid manifest json

defany: or url to manijest json

Kryptonite: is there any way i can put manifest.json in code

Kryptonite: and not load from url ?

defany: no, u must provide url to ur manifest json

Kryptonite: okay

Kryptonite: Thanks

Kryptonite: This is how my manifest.json looks like:  {     "url": "http://localhost:3000",     "name": “test”,     "iconUrl": "https://ton.vote/logo.png" } (reply to 90554)

fun🦴: check "ton_proof" Error: message ='EOF'  https://github.com/ton-connect/demo-dapp-with-react-ui/blob/f739f62d0674c490f3aa267af2f67a1a53d1728f/src/server/services/ton-api-service.ts#L34  message ='EOF' stack ='Error: EOF\n    at TupleReader.pop any help?

fun🦴: result

defany: can u send a url to ur manifest? (reply to 90560)

MZ: Anyone has the same problem? (reply to 90511)

Rodolfo Azevedo: Hi guys

-/-: Can I directly bridge my custom token from TON network to BSC network? I didn't see any instructions about that on the bridging document.

▪️Eba: How to get my telegram handle or that's mean it's my username

sunyoki: Unverified Token

sunyoki: Fail to display correctly

Nerses: in case i know the contract accepts message type but how do i know in what TL-B scheme it accepts ?.for example what data tom store as reference

Kryptonite: how much bit can be processed with store_coins() state, so i am trying to do calculations to giveout some jettons, and i want to handle decimal places as well

Kryptonite: so till how much decimal places it is safe to do division and multiplication before it causes overflow

Metin: Hi everyone, is there a repo for production ready nft contracts?

Mirodil O: Hi everyone, I am learning ton blockchain, and have questions: 1. Is it possible to make p2p toncoin transfer logic or should user deposit to my smart contract and another user withdraw it from there? 2. Should I store transaction history in separate database or is there another way to get it?

Pibu: if I understand correctly, the address of the contract is calculated based on stateinit, but what happens when I implement an upgrade and use set_code? the stateinit would change then, right?

sunyoki: where do get this data 🤣

Rodolfo Azevedo: Is there a way to do wallet transfer using SDKs without pass any secret or private key?

Viktor: Hi everyone, who can I talk to for questions about the Ton Locker / Ton Believers Fund?  I was wondering if the tokens currently in the Locker/Fund are considered in the circulating supply? Or if they are considered locked and therefore part of the remaining total supply?

0xbera: IIUC you will need to send it as an external message (reply to 90457)

&rey: 120 bits of value at max. It takes 4-124 bits in cell. (reply to 90599)

Vivian: If you are looking for professional and trusted outsourcing development team, please kindly let me know, thank you!

&rey: No, since no person allows transfer of their TON without authorization. (reply to 90610)

&rey: StateInit stands for initial state of contract, set_data and set_code do not change that. (reply to 90604)

sunyoki: how to view🤣

&rey: debugLogs on blockchain object in blueprint.

sunyoki: Is there an example here 🤣

&rey: It so happens that there is. https://t.me/tondev_eng/47087. (reply to 90630)

sunyoki: 666

Денис: Hi everybody. Please tell me how to implement such mapping in Tact mapping(uint256 => uint256[]) referrals;

&rey: You should write down what you want to do with it, actually. (reply to 90638)

Pibu: hm, yes, but let's say there is a factory contract and the code for the one that's being produced changes/updates? think jetton-wallet gets upgraded and jetton-minter now stores new wallet-code - this will change the addresses, right? I'm trying to figure this out (reply to 90623)

Anton: hello! how to decode a message in transaction when inMessage.info.type === "external-in"? This is looks like I don't understand basics because "internal" looks fine

&rey: It's better not to upgrade jetton wallets separately but instead provide functionality for jetton migration from older to newer wallets. (reply to 90643)

Pibu: agreed! I'm not implementing a jetton, but I'm using a similar design (main contract and several side contracts that communicate with the main contract, they are deployed via the main contract function) and since this is a poc I wanted to add upgrades to easily iterate on testnet... but I got stuck on what will actually happen after upgrades :) (reply to 90646)

r0uted (@slicebots): https://ton.org/en/buy-toncoin  Are all which are listed on this website safe and secure to use ?

MR: Guys, how can I send TON to multiple addresses in one transaction? (without Tonkeeper pro

&rey: Use a programming interface. @ton/ton supports that. (reply to 90649)

MR: What's this? NPM package? (reply to 90651)

Granit /: Hi, Granit founder of Walletor   We have +100,000 products on our inventory. We want to create a mini app, how do we import all of them?

jaq₿ek.eth: How to handle storing multiple wallet addresses with signed to them value like elapsed time(its for my game)? I am able only to achive contract storing one address with time that has active state. FunC on testnet. Anoyone can help?

J: Hello can someone confirm for me how many bits are returned from the stdlib's now() function?

&rey: It returns an integer, UNIX timestamp. TVM integer is at most int257, though no contract likely will survive until even 40 bits are needed. (reply to 90663)

&rey: A standard choice is 32 bits, though it is a bit too little.

&rey: Miniapp is simply a website. (reply to 90656)

Jay: Is this the right channel to ask TonConnect questions?

Дмитрий: Hi, I have a question, I write a smart contract on tact how can I accept a transaction with a certain comment and then send a GET request

&rey: Smart contract cannot do anything outside of blockchain. Generally you can use a simple wallet, parsing incoming comments and sending requests. (reply to 90672)

Dev: DM (reply to 90500)

Дмитрий: How I can do this? Api? (reply to 90673)

&rey: Yes, like https://github.com/toncenter/examples/blob/main/deposits.js. (reply to 90677)

Дмитрий: It can use with testnet? (reply to 90679)

Дмитрий: Really thanks 😊 (reply to 90679)

Jay: I'm implementing a Kotlin Andriod app to integrate with TonConnect and when I try the developer bridge (bridge dot tonapi dot io) I'm getting 404's.  Is there a different developer bridge I can use?

Zain: Do we have a video explanation on the subject of how “multisignature” contract works on TON?  I am trying to understand how voting process can be created for tokenization of the the temporary state of the system.  Denial of service is a big thing- and I’m studying this at the moment

Jay: Is the TonConnect developer bridge referenced in the docs broken? bridge dot tonapi dot io Is there another bridge I could use?

Akira: You need to get on your tsconfig.json and enable  "resolveJsonModule": true (reply to 90171)

周润发: I want to re-auction the expired domain name.  Who do I need to contact?

— 2024-08-01 —

Blockchain: Hi, on contract, can I send multi send_raw_message?

Blockchain: with Func? I receive dict from client and each dict has wallet address and jetton amount, I want to send jetton to all addresses. is it possbile?

𝔸𝕄: Hi everyone. I have specific question If you need to deploy contract with "coins" type field you can just use BigInt and then ~load_coins(). Easy. But what about dictionaries? When making dicts you have to provide exact amount of bits in BigInt. And here where i stuck. As far as i understand the size of coins value might be 128 bits long.  So it tried:   const allocation: Dictionary<DictionaryKeyTypes, bigint> = Dictionary.empty(                     Dictionary.Keys.Uint(32),                     Dictionary.Values.BigInt(128),                 ); but load_coins() fails here. But it works ok if i do load_uint(128).  Same with 64, 256 but only if i do load_uint(x). What could happen with load_coins()?  Thanks guys in advance

𝔸𝕄:  (slice allocation_cs, int found) = allocation_data.udict_get?(32, whitelist?);          ifnot (found) {             throw(exc::tier_not_configured);         }         int allocation = allocation_cs~load_uint(256); ;; load_coins() not working here So currently i use 256 and it works but i am curious why load_coins() will not work here

𝔸𝕄: I also tried both BigInt and BigUint if it makes sence

𝔸𝕄: just loop the dict and call send_raw_message for each user. Here is my repo with hand-made jetton distributor using dicts. It's not perfect but could be a good example. It also has tests inside so you can make sure everything is working ok https://github.com/artemmartyhin/jetton-distributor (reply to 90722)

Blockchain: sorry, can you point exact file, exact function? and I wonder even if I have 1000, possbile send all messages 1000 times

𝔸𝕄: contracts/base/distributor.fc  op::transfer_notification  I am not sure about 1000, i tested with 10, you can try and check. Just edit test/distributor.spec.ts  for (let i = 0; i < 10; i++) { <—— change 10 to 1000             users.push(await blockchain.treasury(user${i}));         } and in test/distrubutor.ts  export const INITIAL_JETTON_BALANCE: bigint = toNano('1000.00');  extend to 100000.00 if u need 1000 users and the same result in tests

Blockchain: sorry but I can't find it.... (reply to 90729)

Blockchain: sorry, I found and I will try (reply to 90730)

Blockchain: but when I tried this, why always failed? can anyone explain?  cell data = in_msg_body~load_dict();  int index = 0;   ;; while(index <= 3 ){         ;;     (slice, int) (bid_params_data, flag) = udict_get?(data,256, index);         ;;     if(flag == -1){         ;;         slice wallet_address = bid_params_data~load_msg_addr();         ;;         int amount = bid_params_data~load_coins();         ;;         send_tokens(wallet_address,amount,query_id, jetton_address);         ;;         index = index + 1;         ;;     }         ;;     if(flag == 0){         ;;         return ();         ;;     }         ;;     ;; index = index + 1;         ;; }  Action Phase Success: false Result code: 37 Total actions: 3 Skipped actions: 0

fun🦴: https://github.com/ton-connect/demo-dapp-with-react-ui/blob/f739f62d0674c490f3aa267af2f67a1a53d1728f/src/server/wrappers/wallets-data.ts#L25 How to solve the problem of encountering a higher version of wallet (tonkeeper currently defaults to v5)? What about V6, V7, V8, V9, and VX in the future?

Akachi: https://testnet.tonscan.org/address/EQC_ElzMyYg3uCNQfcHHJ2oXYnNDgkJJSHaMSgTrrDqgMM9S#source  I have deployed simple contract to ton test chain.  How can I verify it?

Almatbek: who needs a developer?

Blockchain: Thanks @princedev00. you are the genius. now I get wisdom from him.

Ajay: https://www.npmjs.com/package/jetton-transfer  Used this (reply to 90452)

N: ton connect react sdk give to us a onConnect or something like it? how can i check if user connected the wallet?

Ajay: you have hook useWallet() (reply to 90752)

Ajay: When wallet is connected it will return address,chain other wise null

N: Ok, but I need to implement an API to connect the wallet first, right? I added a Ton Connect button, but when I click it, it stays in infinite loading. (reply to 90754)

Ajay: Yes you have to connect wallet first (reply to 90756)

N: and how can i do this? what the hook i need to use? i dont find it on the docs

N: very thanks for your support

TKAINU: Hello, I'm a new developer on Ton, I'm looking to build my project on Ton, but I'm wondering between two languages, FunC and Tact, I want to use a language that can guarantee security. Reentrancy security and decentralization like Solidity, thank you very much

Ajay: https://docs.ton.org/develop/dapps/ton-connect/react (reply to 90758)

N: thank you so much (reply to 90763)

sunyoki: target contract error, this code does not execute, how to write

sunyoki: 🤣

Akachi: Any solution for this? (reply to 90737)

N: Does the Ton Connect SDK for React provide this component for us, or do I need to create it myself?

Пользователь: Anyone know how listen to incoming deposits for wallet_v3r2 using python SDK?

Ajay: you need to create it self (reply to 90776)

sunyoki: what's to be done

NPA120: you can use ton api for monitoring your wallet. (reply to 90777)

kapil: client.provider(jetton_master).internal(, {         value: toNano("0.1"),         sendMode: SendMode.PAY_GAS_SEPARATELY,         body: beginCell().endCell()     }))   can some tell how to get the sender

kapil: Plzz tell it's very urgent (reply to 90783)

sunyoki: Bounce back information, can ordinary users call

Vraj: While deploying the token on ton testnet, while Sending transaction. Approve in your wallet...  I am not able to see any transaction in tonkeeper wallet. (Wallet is already connected)  So, what's the issue?

Kelly: Who knows why

Vraj: can anyone help? (reply to 90791)

sunyoki: can any user fill in this field at will

Kelly: /stat@combot

kapil: why the excess is not working can anyone tell me the reason

&rey: Last contract in that chain couldn't process the excess message. Somewhy it was sent to sender's jetton wallet.. (reply to 90816)

&rey: Bounce is automatic, happening if destination contract fails to process the message (for instance, if it doesn't have any code yet) and if sender specified that bounce may be run. (reply to 90787)

&rey: Ordinary users cannot send messages with "bounced: true" from their wallet in response to transactions which have happened.

sunyoki: The mandatory assignment is invalid, right? It's gonna be overwritten

Пользователь: Is it free? The wallet isn't owned by me (reply to 90781)

&rey: Any chance you could use JS instead? https://github.com/toncenter/examples/blob/main/deposits.js. (reply to 90777)

Hankson: Hi guys, the EVM contract can deploy another contract. Can TON do this as well?

Пользователь: I'm not familiar with JS, i tried to use it but failed (reply to 90827)

&rey: Yes. Just attach StateInit to the message. Btw are you familiar with TON address generation? (reply to 90829)

Hankson: 😂 I'm not familiar with it. (reply to 90831)

Hankson: Any doc?

v: https://tonviewer.com/transaction/3024b5097408b64528b72dbc6886a8d66bd0c5a72f0314398124a13217edf836  why?

&rey: Address of a contract in TON is pretty much uniquely determined by its StateInit. (reply to 90832)

Hankson: Ok, got it. (reply to 90835)

Danila: Good example is in Jetton Smart Contract (reply to 90833)

TwentyZrThree: How can I retrieve events on the Ton network similar to how it's done with EVM? Currently, I'm using the Toncenter API to get the transaction list, but it misses some transactions. Is there a more effective way to do this? Thank you!

Hslot: What is Jetton in Ton chain?

TwentyZrThree: it like ERC20 token on EVM (reply to 90840)

Anton: any thoughts? (reply to 90644)

Eugene: Hi all! I've created a TON Site that opens perfectly in the browser using Tonutils-Proxy but doesn't open in Telegram  Sometimes doesn't open at all, sometimes the text loads without images and CSS   Do you have any idea what can be the problem?

Eugene: I can't post direct clickable link to the website here because of antispam, but it is paperplanes dot ton

Eugene: I see that Telegram uses intermediary websites on magic dot org  So for antonlukin dot ton there is antonlukin-dton dot magic dot org that's accessible even without proxy  But there is no paperplanes-dton dot magic dot org and I wonder why is that and how can I change it

Ceza: anyone has a tuto on how to turn a nextjs app into a telegram bot? I know how to make a bot, I have a nextjs app hosted to do some testing but can't find the last piece to get the nextjs to show up on tg? I tried following the tg tuto but adding this line ended up crashing my app 🫡<script src="https://telegram.org/js/telegram-web-app.js"></script>

Kashish: /bin/sh: 1: /home/user/tonstarter-contractsmain/node_modules/ton-compiler/bin/macos/func: Exec format error  FATAL ERROR: 'func' with version >= 0.2.0 executable is not found, is it installed and in path?  Can anyone help me with this error? I executed the Tonstarter-Contract git repo after cloning  It's showing me this error

Northman: For sell

Hankson: Hi guys, can we use a EVM address get a TON address? Or use a TON address get a EVM address?

Жоуд: can we delete those files to free up spaces?  archive.38148054.pack

Жоуд: because they are taking around 1+tb

Жоуд: and I cannot find LOG.old file

User<745529128>: 1. You can host using the TON storage, then yes. Otherwise you need a reverse proxy to get an address in the TON network.  2. Yes, you can access using the adnl address or domain, but via proxy. (reply to 90845)

&rey: TON is not EVM-compatible, and its wallet contracts do not reflect EVM wallets. (reply to 90868)

User<745529128>: it seems paperplanes is misconfigured, it's not accessible indeed  RLDP Proxy Error:Get "http://": failed to request rldp-http site: failed to query http over rldp: failed to send query parts: failed to send message part 5: failed to send custom packet: connection was closed    make sure that adnl address is correct and the server is properly configured (reply to 90854)

&rey: The most you can do is use same Ed25519 keypair to create wallets in both networks. (reply to 90875)

Dmitriy: Hi guys! Is the account_id hash different on mainnet and testnet for the contract with the same initial code and state?

&rey: It is not. (reply to 90879)

Eugene: There was some issue on the server, but it seems to be a different one  I've restarted the tonutils-reverse-proxy on the server, can you access paperplanes ton now via the browser? (reply to 90876)

User<745529128>: nope (reply to 90884)

Hankson: Any way to bind a EVM address with a TON address? (reply to 90875)

User<745529128>: what do you want? transfer from eth to ton? (reply to 90888)

&rey: What do you mean by "bind"? Could you describe that in terms of how TON and ETH should move? (reply to 90888)

User<745529128>: i guess the answer might be https://bridge.ton.org/

Hankson: If bind a EVM address with a TON address, I can transfer toncoin between TON and EVM

Hankson: How did it work?  I mean program (reply to 90891)

Hankson: Ok it should input a EVM or TON address ：）

Eugene: That's weird, opens just fine for me in the browser  If anyone else can check, I would appreciate it (reply to 90886)

&rey: paperplanes.ton.run times out for me. (reply to 90897)

User<745529128>: ton.run is unreliable in general, unfortunately (reply to 90899)

&rey: Yes, though still evidence to server working incorrectly. (reply to 90901)

Sina: is testnet down ?

Noor: Hello

Sina: LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted (reply to 90908)

sunyoki: If there is a problem with this method, if the target contract reports an error, the current contract data is also saved

UwU•JJ: wondering is it possible to downgrade wallet version in Tonkeeper to another version instead of W5 (for newly created contract)

UwU•JJ: newly created wallet*

Uncle: hello, can ton smart contract can be upgraded?

sunyoki: set_code (reply to 90921)

sunyoki: my problem, is it real🤣

Nerses: How to convert Cell to Slice as remaining  ?

Prince: Hi, guys. Can I use webm on mini app?

Prince: And I want mini app which can connect with phatom wallet on mini app on mobile. but really difficult. anybody did it?

.: Hi, How to send jetton with smart contract on FunC?

Sina: [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 5F7E9ADE3F9DA295A6D5CB12B13A70BDA5CE0DD554A8D4BA3D831562A847CA8B: exitcode=36, steps=77, gas_used=0 VM Log (truncated): ...4D718D20001F264C858CF16CF8301CF16 execute PUSHCONT x30C824CF40CF8384095005A1A514CF40 execute IFELSE execute CTOS execute XCHG2 s0,s4 execute LDSLICEX execute LDI 1 execute SWAP execute THROWIF 36 default exception handler, terminating vm with exit code 36 ".] {   code: 'ERR_UNHANDLED_REJECTION' } (reply to 90915)

Nerses: while sending Jettons with field forward_payload i also send message that will trigger receiver to do some action.Should i send that message in same TL-B scheme as receiver accepts,or the important is to have all fields filled. for insatnce will bld and bld2  be equivalent and both acceptable if they were messages     const bld = new Builder();   bld.storeInt(123,257);    const bld2 = new Builder();   const additionalbld = new Builder();   additionalbld.storeInt(123,257);   bld2.storeRef(additionalbld);

Akachi: Is this contract verified?

Vladimir: Yep (reply to 90954)

Akachi: But why I get this message when I check in tonviewer? (reply to 90955)

Vladimir: For the same address? (reply to 90954)

Akachi: Yes (reply to 90958)

Vladimir: Both on mainnet? (reply to 90959)

Akachi: kQC_ElzMyYg3uCNQfcHHJ2oXYnNDgkJJSHaMSgTrrDqgMHTY

Akachi: Both on testnet

Vladimir: Not exists yet. Send any ton to it to deploy (reply to 90962)

Vladimir: Oh, I see (reply to 90965)

Akachi: This group automatically removes the messages, not sure why

Akachi: It has TON balance (reply to 90967)

Денис: Hi, does anyone know how to deploy the wallet of the contract owner on the server using Js to manage the contract.

Akachi: Do I need to send some TON to contract? (reply to 90967)

Vladimir: Nope, contract was already deployed in the testnet. I don’t know why tonviewer didn’t want to show the code :( (reply to 90973)

Akachi: Yeah verifier told its verified, but tonviewer says its not (reply to 90974)

Vladimir: Guys, anyone who verifies their contracts in testnet, what’s wrong?

Vladimir: Maybe bug in tonviewer 🤔 (reply to 90975)

Akachi: It could be. (reply to 90977)

&rey: Testnet verification isn't same as mainnet verification, because otherwise everyone would pay fee in testnet TON. (reply to 90976)

&rey: Depends on receiver, though equivalent options would be beginCell().storeUint(0, 1).storeInt(123, 257).endCell() beginCell().storeUint(1, 1).storeRef(beginCell().storeInt(123, 257).endCell()).endCell() (reply to 90951)

Nerses: it is so weird I try to send message with forward_payload  and aggregate data like is done in wrappers   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());   let b = new Builder();   const forward_payload =  b.storeUint(1734998782, 32).storeBuilder(b_0).asCell();   in this case i gett too much references , although I have checked thousand times  couldnt find more than 4 references, when i create Cell tree the contract fails handling it. What to do in such case ? (reply to 90982)

Vladimir: But testnet verification not equal to mainnet 🤔 (reply to 90981)

&rey: I've already asked: how is forward_payload converted into jetton transfer message? Problem could be in those lines of code. Or in contract, actually. (reply to 90985)

&rey: Like here: https://t.me/tondev_eng/87362. (reply to 90945)

Nerses: I am doing Jetton transfer with message TokenTransfer ,  one of the fields of TokenTransfer message is forward_payload, I pass the above message as argument for field forward_payload.expecting with Jetton transfer also trigger (with message) to contract to do some actions. (reply to 90987)

Nerses: the transaction with that message isnt even executed because of mentioned error

.: I don’t understand, how can we get data for send ? (reply to 90990)

Akshay | Moki: How can I precompute the amount of gas required for a transaction on TON? I want to perform a multi-hop transaction on Dedust. The Dedust documentation mentions the gas amount for 2 hops, but I need to know how to compute the gas required for multiple hops.

Nerses: here is how I convert typescript    const queryId = BigInt(Date.now()); // Unique identifier for the transaction   const amount = 1n; // Amount to transfer, here it's 1 TON   const destination = Address.parse("kQBVGEJQIO5_tI4QuFOfWznCwC6kTMcMAUQAuelhX4pp9Kfe"); // Recipient address   const response_destination = Address.parse("kQCfCUwHtdIzOvupHmIQO-z40lrb2sUsYWRrPgPhCiiw69Rw"); // Address to receive response, usually the sender's wallet   const custom_payload: Cell | null = beginCell().storeInt(0,32).storeStringTail("Success").endCell(); // Optional custom payload   const forward_ton_amount = toNano("0.1"); // TONs to forward with the payload  const hopChains = createStrMap([     [0n, { $$type: 'StringImpl', data: "chain 1" }],     [1n, { $$type: 'StringImpl', data: "chain 2" }],     [2n, { $$type: 'StringImpl', data: "chain 3" }]   ]);      const hopAssets = createStrMap([     [0n, { $$type: 'StringImpl', data: "asset 1" }],     [1n, { $$type: 'StringImpl', data: "asset 2" }],     [2n, { $$type: 'StringImpl', data: "asset 3" }]   ]);      const hopAddresses = createStrMap([     [0n, { $$type: 'StringImpl', data: "address 1" }],     [1n, { $$type: 'StringImpl', data: "address 2" }],     [2n, { $$type: 'StringImpl', data: "address 3" }]   ]);      const dstChain: string = "STARKNET SEPOLIA";   const dstAsset: string = "STARKNET SEPOLIA";   const dstAddress: string = "0x0430a74277723D1EBba7119339F0F8276ca946c1B2c73DE7636Fd9EBA31e1c1f";   const srcAsset: string = "TON";   const srcReceiver: Address = Address.parse("0QBdIYx_26bIOerW5uWXaQOahyxZE9GxjySpOiXoIPUaGrPB");   const timelock = BigInt(Math.floor(Date.now() / 1000) + 3600);    const messenger: Address = Address.parse("EQBIgdusaVOdJbcN9r0O65iCF7KH9aUzS8kK-pDGJKs4ZHc_");      // Sample Jetton-related data   const jettonMasterAddress = beginCell().storeAddress(Address.parse("kQDAChK6XPuYj0GKB9bQdwG2MpwSgVzMZA_2X3E2jHZ2f1ah")).endCell();   const jettonWalletCode = beginCell().storeStringTail("b5ee9c720102220344bc.................8200f5fc21c2fff2f44330523").endCell();  let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());      let b = new Builder();      const forward_payload =  b.storeUint(1734998782, 32).storeBuilder(b_0).asCell();       const tokenTransferMessage: TokenTransfer = {     $$type: 'TokenTransfer',     queryId,     amount,     destination,     response_destination,     custom_payload,     forward_ton_amount,     forward_payload,   };    await contractProvider.send(walletSender, { value: toNano("0.2"), bounce: true }, tokenTransferMessage); (reply to 90987)

&rey: But... that's straight out wrong... Cell.fromBase64('b5ee9c...') would be correct... (reply to 90999)

&rey: Also, serialization of forward_payload isn't TEP-74 compliant (because Tact doesn't have tools to define that field correctly).

&rey: You should use const forward_payload = beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();

Nerses: you are right.I was searching mistake in wrong place.Thanks a lot (reply to 91001)

Tuan: I'm facing the error: http provider parse response error result: {     '@type': 'smc.runResult',     gas_used: 0,     stack: [ [Array], [Array] ],     exit_code: -13,     '@extra': '1722525923.3238227:6:0.1962850886005515',     block_id: {       '@type': 'ton.blockIdExt',       workchain: -1,       shard: '-9223372036854775808',       seqno: 39416334,       root_hash: 'rw6ft96f4HC5hdxM4miU4Pd6Bqech+rH1IanhbmDJuY=',       file_hash: 'U/hKVUATqL24oOirCdFeJOi5ypunlc7FFuVsNAFveEE='     },     last_transaction_id: {       '@type': 'internal.transactionId',       lt: '0',       hash: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='     }   } const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {       address: info.address,     });     const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(hotWalletAddress);

Nerses: the contract ( D )  accepts message (0x6769fafe) although while receiving it throws exit code 130 (invalid message), what can cause that ?   https://testnet.tonviewer.com/transaction/7568e4843648b914e2e8920d6ef5a884683de7a86bbbeb599aebb153dafe5323

Ilya: Guys is anybody experinced same error ??   "CustomEvent is not defined"

&rey: Nope.. (reply to 91021)

Hiroto: I am interested in your job. Please dm me (reply to 48964)

Prince: pls be careful about scam. (reply to 91027)

Hiroto: thx for your explanation (reply to 91030)

TON Bounty Bridge: ​Telegram bot for Developer Docs  🏷 Developer Tool  Summary:This proposing developer tool is a Telegram bot designed to enhance productivity for TON developers....  Rewards: • Rewards : 2000 USD in TON  Created by anuragasawa20

N: Hey guys, how I can save the wallet in my database? Does Ton Connect provide something like an onSuccess callback? How can I know if the user has connected the wallet? i want to create a /api/wallet/connect that will check the wallet

Пользователь: Bro is this free? (reply to 90827)

&rey: Should work with free API key, I think. (reply to 91042)

Орельан [NEVER DM FIRST]: Hey guys, anyone having problem with assets-sdk ? Whenever i send something, no matter whether it is a jetton deploy or mint or whatever it just stays stuck until it eventually return a 500 error. Anyone has experienced this?

Jay: I'm also curious about this - I started looking at Ton Connect in Kotlin, but the bridge they supply in the documentations doesn't work. (reply to 69261)

Jay: Does this support Ton Connect? (reply to 26402)

Jay: Is there a TON Connect Dev chat in Telegram?

Marcus: Hello. Is there anyone faced the issue that i send amount of ton coin with data, after destination wallet receive, it send the ton back to sender?

Karim: Is there any interface to upload bag of files to TON Storage? I could find a provider here: ton-storage _ org

Ronaldo: Any news about Ton Connect for Kotlin or Java? (reply to 91045)

Ronaldo: I really need Ton Connect in Java or Kotlin... otherise I can't go ahead with the integration...

User<745529128>: Does anybody want to give a try binding their domain.com with CNAME targeting my proxy service? That will allow you to see domain.ton at domain.com

Lucas: ahhh

Lucas: I guess it doesn't not like "magic" urls but all urls huh?

Lucas: I got my TON site up and running and it works through the public proxy... does someone know how the process works or if it will eventually automatically work with tonsite://

Lucas: kinda a new feature overall

Дмитрий: Hello, who knows how I can make such a button on the site that when it is pressed, a transaction is generated and the person only needs to go to the wallet to confirm.

Lucas: Does it have to be a TLD? (reply to 91060)

User<745529128>: Nope, anything I guess (reply to 91072)

&: Do you have any experience in tonconnect in Nodejs? (reply to 91058)

Binaplexus1: No, I don't (reply to 91076)

&: Then goto docs.ton.org and search tonconnect.  Tip: did you add manifest URL? (reply to 91077)

Ronaldo: Unfortunately, my expertise is limited to Java/Kotlin, not Node.js. I implemented WalletConnect in Kotlin, and it's working fine (But it not support TON)... (reply to 91076)

Ronaldo: Doesn't anyone here use Java/Kotlin?

MZ: I think I don't fully understand signature verification. I'd like to be sure, that connected wallet belongs to the user and save it to database.   I try to use this code to verify on backend: https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/services/ton-proof-service.ts.   As I see I need to generate payload "nonce", then user signs it during wallet connection and then there is the verification on backend. However, when I analyze that code I don't see payload "nonce" verification anywhere on backend. Am I missing something?  I assumed it should work like this: 1. I generate nonce on backend and save it to database. 2. User signs it during wallet connection. 3. I'm checking response from 2. on the backend and compare if nonce from point 1 is the same.  Does it work in this way? Where is the nonce verification on the backend then?

Eugene: I'm trying to run a TON site with Tonutils Reverse Proxy and get this error:  "Failed to configure domain: failed to run dnsresolve method: lite server error, code 651: too big masterchain block seqno"  What can that be and how do I fix it?

H: any hint will be usefull why nft-item contract dont initialize while i mint an nft🙏

Pibu: if I send a stateinit from contract, can I immediately send another message to it?

Pibu: stateinit doesn't contain all info required for contract initialisation (some random data needs to be used after deploy, that would break discoverability)

hbgwydtiws: hi

Lajcik007: Hello, Im fairly new to ton and got stuck on something. Right now Im working on creating NFT collection and honestly I cant understand how is selling and minting done. I want to be able to set website on which customer can connect with wallet and mint nft while paying for it certain amount in ton. I dont get how to implement in tonlike manner part of selling.

Lajcik007: are all collections preminted and set for sale on markets like getgems?

Artem: Please , help

User<6031319387>: Does anyone have a ton site that has already been built? Can I take a look?

— 2024-08-02 —

Kcard: Okay (reply to 91129)

Artem: const sendTransaction = async () => {     if (!connected) {       console.error("Wallet not connected");       return;     }      try {       const client = new TonClient({         endpoint: "https://toncenter.com/api/v2/jsonRPC",         apiKey:           "07dadccff840f86c67b4ebcf3257cc57ecd2f8123ae9898de676bf4bb348ce42",       });        // Fetch contract state for fee calculation       // const contractState = await client.getContractState(       //   Address.parse(contractInfo.contractAddress)       // );        const ownerAddrParsed = Address.parse(         "UQAXd3nFwaf-bdh10cvEOp5XSk41HF50kyvBPo5M509z3Z1E"       );        const destinationAddrParsed = Address.parse(         "UQBOhE4qpB9px4eJWGh-g2GNtFik-U2w9YHkzvz74iXjPzry"       );        // Build the body for the internal message       const body = beginCell()         .storeUint(0xf8a7ea5, 32) // jetton transfer op code         .storeUint(0, 64) // query_id:uint64         .storeCoins(500) // amount:(VarUInteger 16) - Jetton amount for transfer         .storeAddress(destinationAddrParsed) // destination:MsgAddress         .storeAddress(ownerAddrParsed) // response_destination:MsgAddress         .storeUint(0, 1) // custom_payload:(Maybe ^Cell)         .storeCoins(toNano(0.05)) // forward_ton_amount:(VarUInteger 16)         .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)         .endCell();        // Estimate the fees       const estimate = await client.estimateFees({         from: Address.parse(contractInfo.contractAddress),         messages: [{ to: contractInfo.contractAddress, amount: toNano(0.05), body: body.toBoc().toString("base64") }],         stateInit: null,       });        const totalFee = estimate.totalFee;        const transactionMessage = {         address: contractInfo.contractAddress,         amount: totalFee.add(toNano(0.05)).toString(), // Ensure to cover the transaction fee and the actual transfer amount         payload: body.toBoc().toString("base64"),       };        // Send the transaction using tonConnectUI       await tonConnectUI.sendTransaction({         valid_until: Math.floor(Date.now() / 1000) + 600,         messages: [transactionMessage],         state_init: null,       });        console.log("Transaction sent successfully!");     } catch (error) {       console.error("Error sending transaction:", error);     }   }; failde to calculate fee , please help https://t.me/artem_mykhailenko99

UncleRooks: Please I need help. I am on the verge of crying😭😭

Thea: We might have misunderstanding but second chance let's finish the deal (reply to 91138)

Almatbek: DM me (reply to 91138)

Alex: could anyone help me move coins from a pool on a validator onto a wallet? It seems like there may be a bug on my validator that prevents me from doing so...  Everytime I use withdraw_from_single_pool it actually adds 1.35 TON coin to it...

Alex: did you get it to work? (reply to 88124)

Hankson: Hi, guys. Does the TON wallet support a 12-word mnemonic? And does the TON mnemonic completely cover the EVM mnemonic?

sangmin: When I check it on tonscan, I don't see the jetton transmission record. I want to check the jetton transmission record using toncenter indexer, how can I track it?

Prince: recommend tonviewer (reply to 91162)

sangmin: I want to track it with the ton api interface. (reply to 91164)

Prince: sure you can

Prince: tonapi transaction you can see jettontransfer

&rey: Yes. Moreover, you can send payload in the same message and it will be processed as usual. (reply to 91108)

sangmin: Should I find out if it's a jettonttransfer in Opcode within the transaction??

sangmin: I only have InMsg Hash since sendboc.

Kowser |: TonWeb not support W5?

Rick: Is there a dedust api v3?

Shrish Yadav: Hi, can I create a mini app If the solidity smart contracts are deployed on an other blockchain, If not then is it mandatory to deploy those contracts on TON blockchain and will there be any changes in contract which I need to do?

yoshi~: Is there a significant indexing latency of tonapi? Is it more profitable in terms of latency and stability to use private liteserver or tonapi's indexing hardware is superior? The context is simple actions like getting wallet's balance and querying jetton metadata.

Matthew: hello my fellow indians

Casa: Hi I need a simple ton nft generating script. I am a newbie to ton chain. Could you guide me how to make it?

Smart: is there method to get contract type(wallet v4) from address in ton/ton or tonweb?

User<6623141573>: Hellow bros

User<6623141573>: How ya all doing mmm

&rey: You've probably wanted to ask this question about TON? Each transaction only works on one contract, so you need to do transfers from each wallet manually. (reply to 91210)

Shrish Yadav: can someone please help me re guarding this (reply to 91185)

&rey: Miniapp can work with EVM blockchains. Though this is chat about TON, and TON is very much not EVM-compatible. (reply to 91212)

ETON: I'm sorry, I sent you to the wrong group. I deleted it

Shrish Yadav: Thanks for replying, I have written a NFT marketplace in solidity smart contract and it’s deployed on bnb blockchain so can we use marketplace functionality using telegram app? or we have to deploy it on TON blockchain (reply to 91214)

Akachi: https://testnet.tonviewer.com/kQBkh2bzI-MaYgKne_9eLYSw4iCrQrD9CKT9zC_rsapym1u-?section=code  Hi, how can I verify this smart contract?

Lukasz: Hi guys I want create smart contract with new Jetton I clone repo from GitHub with smart contract from here  https://github.com/ton-blockchain/minter-contract.git  Next I need to install npm install   And what about this - npm create ton@latest Should I install this to project or not??  I try use function npm run build  in my smart contract from GitHub but this doesn’t works.  What I do wrong?

Lukasz: Help please!!

musashi: you use this command to create new blueprint project, so no need to run this command (reply to 91236)

Prince: you don't have to. (reply to 91217)

Assasin: Lt not in db..error...how to resolve this...when sending funds..to other address..  Any ideas guys?

K.: There are detailed instructions on how to deploy this contract from your computer in the README:  https://github.com/ton-blockchain/minter-contract?tab=readme-ov-file#instructions-1 (reply to 91236)

K.: https://verifier.ton.org/?testnet=true is for testnet 🙂 There's no switch in the app, sadly, but this works. (reply to 91226)

Lukasz: I did everything but I get error when try use npm run build. Error like no have installed funC.   And idk what should I do (reply to 91245)

Lukasz: 1 Make sure you have all "Dependencies and Requirements" as described in tonstarter-contracts repo.   So before I clone repo I should install this dependencies or not? There is npm create ton&latest (reply to 91241)

K.: Yes, absolutely.   npm create ton@latest does not install dependencies, it sets up a new project and not needed here. After you have cloned the minter-contract repo, you need to run npm install as the first thing to install the dependencies. You might need a FunC compiler as well: https://github.com/ton-defi-org/ton-binaries. (reply to 91251)

Lukasz: So how instal this  dependencies when I open this file there I find another repo and in readme see command like npm create ton&latest but I don’t need this.   I try also install func compiler because I don’t have this at the moment

K.: There's no mention of npm create ton@latest in this repository you linked. (reply to 91251)

Lukasz: So what I should install apart npm install and clone repo? (reply to 91257)

Akachi: https://verifier.ton.org/EQBkh2bzI-MaYgKne_9eLYSw4iCrQrD9CKT9zC_rsapym-A0?testnet=  I tried, but can not verify. (reply to 91226)

Akachi: What do you mean? (reply to 91243)

Akachi: I tried true option, but still can not verify (reply to 91247)

Nerses: what indicates this Jetton wallet error 5 · Integer out of expected range . more scpecifically what integer is mentioned about ?

Lukasz: Yea but there is info I need tonsttarter contract and when u open this there is link to new  version   https://github.com/ton-org/blueprint.git (reply to 91257)

User<69210164>: hello hello everyone!   I have a quick question about TON domains, I hope this specific chat is relevant to ask one: How can you renew an expired domain? The support told me to search here, but all 60 search results are not helpful at all and I can't find any details about it here.  I'm willing to pay $20 with an escrow/middleman for someone who helps me successfully

&rey: Renew? You can do so regardless of its expiry. (reply to 91279)

Anton: how to get transaction state? In the all cases callback is undefined . How I can make sure that transaction was send to blockchain ?  await contract.send(transfer);

Lucky: Hello  i am looking for NFTs smart contracts dev

Jacob: Hi, Lucky. Please DM me (reply to 91288)

Prince: you are dev? just ask here what you want to know (reply to 91288)

Lucky: Yes i am a frontend dev, project manager, web3 marketer and collab manager (reply to 91290)

Prince: oh, not blockchain dev?

Lucky: Yeah (reply to 91294)

Вячеслав: Hi everyone Please help to solve one problem - i'm trying to connect to (v4r2) wallet (owner of smart contract) with 100% correct mnemonic from backend, but when i try, it connects to different address. Mnemonic is correct, v4 or v3 doesn't matter, it gives different addresses with my mnemonic, but still not mine

Lucky: Hello  i am looking for NFTs smart contracts dev

alex: Hi (reply to 91297)

alex: Interesting

Nerses: how should i send Jettons in case i want to trigger reciever contract do some action.  In this example payload code is the message with which i want to trigger receiver contract but actullay receiver gets only Jetton notify with forward_payload of triggering message  https://testnet.tonviewer.com/transaction/151f995eb67dab93c93a81fb4d9ed1a08b75b5446af13d5acc56f20284952349

Lucky: Dm (reply to 91298)

Prince: just tell here what you want. we can help you here (reply to 91297)

alex: sure (reply to 91301)

Razak: I can help you , please send Dm (reply to 48964)

alex: That's very interesting! I am a full stack/ blockchain developer. I am familiar with TON. Let's discuss about your requirement in detail so we can explore the best approach for your project! (reply to 48964)

Prince: hey, man. be careful about scam (reply to 91309)

alex: Rohit is scammer? (reply to 91310)

Prince: I didn't say

alex: Thank you anyway

sunyoki: int op::transfer_notification() asm "0x7362d09c PUSHINT";

sunyoki: What's this for? The wallet doesn't seem to be processing the notification

sunyoki: 🤷🏼‍♂️?

&rey: For DEX or whatever other contract. (reply to 91319)

sunyoki: This is the code, isn't it forwarded to its own contract, it has no handler

&rey: But owner_address isn't always a wallet, is it?

sunyoki: 😂   inquisitive

Lucas: In Tonkeeper if you have your collectible sent there, there will be a button to renew... as i understand it... if you can... you'll wanna wait until like ONE hour before the expiry date to take care of it because regardless of when you execute the renewal it will always be for one year (reply to 91279)

Nerses: in this jetton transfer evrything worked correctly without any errors but why D contract havent done anything based on message which got with forward_payload ?

Огурчік: Can someone explain whats wrong? i just try to deploy my wallet, but got this error ...  Crated account with address -> EQDRSryt6GqqRLLHi4Y-c_XxBTgrMaruJ_bijXl5NPpddjU7 with id 160 ** (CaseClauseError) no case clause matching: {:ok, %HTTPoison.Response{status_code: 500, body: "{\"ok\":false,\"error\":\"LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state\",\"code\":500}", headers: [{"Date", "Fri, 02 Aug 2024 13:09:48 GMT"}, {"Content-Type", "application/json"}, {"Content-Length", "134"}, {"Connection", "keep-alive"}, {"access-control-allow-origin", "*"}, {"access-control-allow-methods", "GET, POST, OPTIONS"}, {"access-control-allow-headers", "User-Agent,Keep-Alive,Content-Type,X-API-Key,X-Ton-Client-Version"}, {"CF-Cache-Status", "DYNAMIC"}, {"Report-To", "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=6mtP%2FRH%2B%2BOK07MwpCMVv5lSJ%2FfrmkYUfoOX0KGpps80yAHWIr7zJ%2FKpR5xfSdt42Obwcl%2BBNcA1CruTQh6HkDIeSFI0R0fUYxHbcpfgvKDjPA5OmCP7OE5VX4XWABAT042PIcSO6Sw%3D%3D\"}],\"group\":\"cf-nel\",\"max_age\":604800}"}, {"NEL", "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"}, {"Server", "cloudflare"}, {"CF-RAY", "8ace4df37c2ebfc6-WAW"}], request_url: "https://testnet.toncenter.com/api/v2/sendBoc", request: %HTTPoison.Request{method: :post, url: "https://testnet.toncenter.com/api/v2/sendBoc", headers: [{"Content-Type", "application/json"}], body: "{\"boc\":\"te6cckECFwEAA6gAA+OIAaKVeVvQ1VSJZY8XDHzn6+IKcFZjVdxP7cUa8vJp9LrsEZeKMlz5JhKfNn963G3X9o6A9WQhhTPU6Ojv6VeiRi0MSw1F/nbtU7AVns61sV665nX19PPSOUWXAb/QOnbfkeFgAAAUH////+AAAAAAAHADAgEAYGIAaKVeVvQ1VSJZY8XDHzn6+IKcFZjVdxP7cUa8vJp9LrsAAAAAAAAAAAAAAAAAAABRAAAAAAAAAKBfKwtFcVDUYDMzpa5JbpqnJWfEq0rOutG2tHT+TrL0GEABFP8A9KQT9LzyyAsEAgEgCgUE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8JCAcGAAr0AMntVABsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBu0gf6ANTUIvkABcjKBxXL/8nQd3SAGMjLBcsCIs8WUAX6AhTLaxLMzMlz+wDIQBSBAQj0UfKnAgIBSBQLAgEgDQwAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAIBIA8OABG4yX7UTQ1wsfgCAVgTEAIBIBIRABmvHfaiaEAQa5DrhY/AABmtznaiaEAga5Drhf/AAD2ynftRNCBAUDXIfQEMALIygfL/8nQAYEBCPQKb6ExgAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNFhUAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGMpP98A==\"}", params: %{}, options: []}}}     (f 0.1.0) lib/deploy_wallet.ex:11: DeployWallet.create_and_send_transfer/1     iex:59: (file)

Огурчік: As I understand it, the problem is with BOC, but what exactly is the problem, I get a 500 error, which doesn’t really mean anything (reply to 91342)

sunyoki: How do I know  what    I'm  using of     FUNC version

Огурчік: this is my code to create BOC    defp create_boc(wallet, secret_key, address) do     {:ok, to_address} = Ton.parse_address(address)      params = [       seqno: 0,       bounce: true,       secret_key: secret_key,       value: 0,       to_address: to_address,       timeout: 60,     ]      Ton.create_transfer_boc(wallet, params)   end  i hope i understand right, to initialize wallet i have to use transaction to my wallet with 0 value from my wallet , right? (reply to 91342)

Nerses: is it possible to call another receive() method from same contract's other receive()

Urban: Hi all. I've create a contract to which I can send USDT without a problem through my tonkeeper wallet. The use case that I want to test is this: how can I generate an transaction (transfer USDT with comment message) for an arbitrary user. So for example you just get the QR code to sign. My project is setup thrugh blueprint so using it's tooling would be nice. I'we been trying to get my head around this: https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer-with-comment but it's been giving me issues. Are there any example (repos) where I can look this up?

Nightfall: Hello, when running blueprint test, do you know which port is the local blockchain running under? can we supply that localhost endpoint to a TonClient instance? (reply to 91328)

&rey: Blueprint doesn't run true validator, only a WASM emulation within the script. Data doesn't leave the JS process. (reply to 91356)

V 🍅 🐾: Can I ask if there is any support library that can use a seed phrase to connect to a dapp qr code with such an address?  https://app.tonkeeper.com/ton-connect?v=2&id=******&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fton-connect.github.io%2Fdemo -dapp-with-react-ui%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D

Nadire: 8

&rey: Automatic TON Connect? I believe it's easier to inject script into webpage and emulate embedded browser or like. (reply to 91359)

V 🍅 🐾: automatically connect Ton with seed phrase, for example I want to connect wallet with @BlumCryptoBot (reply to 91364)

Nightfall: thank you :) (reply to 91358)

Adapt: Hi there, anyone from ton-websites dev group? The cache is too aggressive, if I have data that changes every few minutes, in Telegram window my site has 30-60 minutes delay regardless hitting Refresh button all the time. Similar issue on Desktop and Android apps.  Can you suggest any workaround to this?

Орельан [NEVER DM FIRST]: Hey there guys, i noticed that when i mint a jetton sometimes the metadata seems to be not properly updated, and tonviewer will just show "Unknown Token", is there a way to fix this? Is the metadata determined according to some pre-calculation somehow?

TON Bounty Bridge: ​Ok  🏷 Developer Tool  Summary:Ok  Created by Hoangtho119955

Lukasz: guys i want create new token i download repo from github minter contract and all is fine but when i use npm run deploy i get  Config file '.env' found and will be used for deployment!  - Wallet address used to deploy from is: EQDpHe1zGBv1yZrsdF8XoyAffw41vmZfMTspYi5uNgFCYI5r  - ERROR: Wallet has less than 0.2 TON for gas (0 TON), please send some TON for gas first  but this is my adress wallet: Bounceable: EQASNS1EsRGc4YQz0pnuuuEHv4ixRKNkzQbqbJRonvMknYZD Non-bounceable: UQASNS1EsRGc4YQz0pnuuuEHv4ixRKNkzQbqbJRonvMknduG  but in file .env i have this DEPLOYER_WALLET=org.ton.wallets.v4.r2 DEPLOYER_MNEMONIC="my menmonics"  and in file deploy.ts i have WalletV3R2Source and cant change it on newest version beacause last version what can choose is v3r2  what should i do?

Kono: Hello. I can build website & smart contracts and tg bots & mini app games, Does anyone need?

Lukasz: i checked this script load v3r2 wallet, can someone help me how change it in script  on v4r2 wallet?

DogeSaveTheGod: god damn at least name your module "ChocoCookies" or something less suspicious 😭 (reply to 91423)

Mr Radikali: How can fix when i connect tonconnect ui both react and js with wallet

Mr Radikali: Help me please (reply to 91426)

Skye2920: Hi, interesting (reply to 91297)

NBRT: Hello everyone. Can you explain how I can realize token claim function on my website ?

— 2024-08-03 —

Tech🧑‍💻🐾: React (reply to 91058)

Tech🧑‍💻🐾: You want to build one? (reply to 91125)

Lucas: anybody know if it is planned to do support for punnycode in TON domains since technically this is a generally accepted standard?  tonsite:// in telegram with "ä" as part of the domain name won't work yet

Lucas: for now it's more like TON is a step back compared to regular web... but i am glad about all the other aspects the TON web brings us

Lucas: Man what kind of wording is this?  Why DNS auction burns coins? If we will not burn coins from DNS auctions, then, who we will need send money to?

Lucas: from the TEPs on Github on TON block chain

Lucas: Why DNS auction burns coins? >If we will not burn coins from DNS auctions, then, who we will need send money to?  Send it to Pavel Durov and in return he'll send me Premium, for up to a few (2-3) years of Telegram Premium... FAIR is FAIR 😂

Lucas: I hope it doesn't count as out of scope for this chat. (reply to 91461)

Nguyễn Linh: Hi, is Ton Center JSON-RPC v3 available to use?

11: Hi guys, can i init a global variable in smart contract like this: global int a =1?

Tech🧑‍💻🐾: Hello everyone,  I'm currently working on integrating a Func contract with my React frontend but am facing some issues. I'm using Tonweb to pass the contract's address and BOC; however, it seems that the methods in my contract are not being correctly recognized. Is there any documentation or guidance available that could help with this integration?

Tech🧑‍💻🐾: @pcrafter (reply to 91472)

Lukasz: Hello can someone help me, I want deploy minter contract from GitHub repo but when deploy scripts use v3r2 version wallet and I can’t change newest version like v4r2 because in script last version is v3r2

NBRT: Exactly telegram app (reply to 91448)

User<6213849490>: Hello people, does anyone know how to make a payment in a telegram bot in C++?

Tech🧑‍💻🐾: Payment method, you mean  And which telegram bot? (reply to 91478)

User<6213849490>: type of telegram bot entertaining, payment method by cards

Lukasz: Guys someone used minter contract for deploy new token? I need help with something

User<6213849490>: what kind of help exactly?

Lukasz: This scripts use maximum v3r2 and I can’t change version on newest like v4r2 in deploy.ts because last version wallet what can choose is v3r2

Tech🧑‍💻🐾: Hello everyone,  I'm currently working on integrating a Func contract with my React frontend but am facing some issues. I'm using Tonweb to pass the contract's address and BOC; however, it seems that the methods in my contract are not being correctly recognized. Is there any documentation or guidance available that could help with this integration?

Lukasz: Can you help me on dm? (reply to 91484)

User<6213849490>: I've never issued a token, I've only seen others do it, I don't know how to help, sorry

Lukasz: I send you message can you check this?

Binaplexus1: Okay (reply to 91489)

Cirill: Hey guys! Who can help with token development, verification, and adding a token/USDT liquidity pair on Stonfi? We need a specialist with experience in this field. Payment will be task-based. Please dm🙏🏻

Lukasz: This scripts use maximum v3r2 and I can’t change version on newest like v4r2 in deploy.ts because last version wallet what can choose is v3r2 (reply to 91492)

Jacob: Hi, friend. I'm Jacob. I had some issues  so this is my new account. Please DM me (reply to 89444)

Nguyễn Linh: Can anyone let me know why this jetton transfer failed?  async function main () {     // 1. init Ton Testnet RPC     const client = new TonClient({         endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',         apiKey: API_KEY     });      // 2. open wallet v4     const keyPair = await mnemonicToPrivateKey(MNEMONIC.split(' ').map(word => word.trim()));     const walletContract = WalletContractV4.create({workchain: WORKCHAIN, publicKey: keyPair.publicKey});     const contract = client.open(walletContract);      // 3. init jetton contract     const aiotxMasterAddress = Address.parse('kQAiboDEv_qRrcEdrYdwbVLNOXBHwShFbtKGbQVJ2OKxY_Di');     const aiotxMasterContract = client.open(JettonMaster.create(aiotxMasterAddress));     const jettonWalletAddress = await aiotxMasterContract.getWalletAddress(walletContract.address);      // todo: need construct message manually     const destinationAddress = Address.parse(ADDRESS_TEST_2);     const responseAddress = Address.parse(ADDRESS_TEST_1);     const forwardPayload = beginCell()         .storeUint(0, 32) // 0 opcode means we have a comment         .storeStringTail('Have a good day!')         .endCell();      const messageBody = beginCell()         .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer         .storeUint(0, 64) // query id         .storeCoins(toNano(0.002)) // jetton amount, amount * 10^9         .storeAddress(destinationAddress)         .storeAddress(responseAddress) // response destination, who get remain token         .storeBit(0) // no custom payload         .storeCoins(toNano('0.000000001')) // forward amount - if >0, will send notification message         .storeBit(1) // we store forwardPayload as a reference         .storeRef(forwardPayload)         .endCell();      const internalMessage = internal({         to: jettonWalletAddress, // JettonWallet of sender         value: toNano('0.1'),         bounce: true,         body: messageBody     });      // todo: try to send this internal message     const seqno: number = await contract.getSeqno();     const tx = walletContract.createTransfer({         secretKey: keyPair.secretKey,         seqno: seqno,         messages: [             internalMessage         ]     })      const api = 'https://testnet.toncenter.com/api/v2/sendBocReturnHash'     const boc = tx.toBoc().toString('base64');      const a = await fetch(         api,{             method: 'POST',             headers: {                 'Content-Type': 'application/json',                 'X-API-KEY': API_KEY             },             body: JSON.stringify({                 query: {'boc': boc}             })         });     const hash = await a.json();     console.log('hash', hash);      return; }  main()

Nguyễn Linh: error:  {   ok: false,   error: 'Validation error: 1 validation error for Request\n' +     'body -> boc\n' +     '  field required (type=value_error.missing)',   code: 422 }

&rey: Maybe you need just 'boc': boc? (reply to 91499)

Nguyễn Linh: I think I constructed the boc wrong way (reply to 91501)

Nguyễn Linh: I need a serialized boc file: fully packed and serialized external message as input for that API. How can I get the boc like that?

Жоуд: hello my validator keeps increasing in sync why?

Жоуд: it has been more than 13h

Tech🧑‍💻🐾: import React, { createContext, useContext, useState, useEffect } from "react"; import TonWeb from "tonweb"; import bocArray from "../data/output";  const ContractContext = createContext(null);  export const ContractProvider = ({ children }) => {   const [contract, setContract] = useState(null);    useEffect(() => {     const initContract = async () => {       try {         const tonweb = new TonWeb(           new TonWeb.HttpProvider("https://mainnet.ton.dev")         );          const contractOptions = {           address: "EQCetJiNCM0Xy0EaFai5OOA1NXQSJujVA3irJmr1hm0dcYUt",           code: bocArray, // Use the imported Uint8Array for the contract code         };         const tonContract = new tonweb.Contract(contractOptions);          setContract(tonContract);       } catch (error) {         console.error("Failed to initialize contract:", error);       }     };      initContract();   }, []);    return (     <ContractContext.Provider value={contract}>       {children}     </ContractContext.Provider>   ); };  export const useContract = () => useContext(ContractContext);

Tech🧑‍💻🐾: const bocArray = new Uint8Array([   181, 238, 156, 114, 1, 2, 18, 1, 0, 2, 26, 0, 1, 20, 255, 0, 244, 164, 19,   244, 188, 242, 200, 11, 1, 2, 1, 98, 2, 3, 2, 2, 204, 4, 5, 2, 1, 32, 14, 15,   2, 1, 32, 6, 7, 0, 131, 223, 106, 38, 134, 152, 255, 210, 7, 160, 38, 152, 1,   135, 193, 66, 145, 134, 56, 47, 151, 3, 42, 154, 29, 223, 151, 3, 66, 137,   165, 11, 132, 0, 134, 70, 88, 41, 38, 120, 178, 128, 55, 208, 16, 174, 91, 86,   75, 135, 216, 2, 192, 30, 70, 88, 250, 198, 120, 183, 160, 6, 88, 6, 79, 106,   164, 2, 1, 32, 8, 9, 2, 1, 32, 10, 11, 0, 181, 67, 34, 28, 112, 9, 21, 190,   13, 13, 48, 51, 7, 27, 9, 19, 14, 13, 49, 242, 24, 17, 35, 75, 169, 163, 29,   49, 253, 48, 13, 49, 243, 15, 0, 56, 227, 82, 24, 18, 52, 91, 169, 53, 191, 0,   88, 226, 146, 24, 19, 69, 107, 169, 53, 191, 0, 104, 225, 210, 24, 20, 86,   123, 169, 53, 191, 0, 120, 225, 16, 24, 21, 103, 139, 169, 93, 49, 243, 15, 0,   137, 67, 15, 44, 6, 94, 46, 46, 46, 46, 40, 0, 161, 94, 212, 77, 13, 49, 255,   164, 15, 64, 77, 48, 3, 2, 11, 63, 46, 6, 98, 104, 16, 62, 139, 226, 120, 32,   128, 244, 36, 11, 187, 15, 46, 6, 114, 76, 32, 15, 46, 6, 159, 130, 130, 124,   140, 177, 241, 124, 176, 1, 92, 177, 252, 157, 0, 95, 144, 20, 80, 8, 48, 127,   65, 96, 74, 5, 3, 48, 60, 140, 177, 245, 140, 241, 111, 64, 12, 176, 12, 158,   213, 72, 0, 199, 94, 212, 77, 13, 49, 255, 164, 15, 64, 77, 48, 3, 15, 130,   130, 15, 144, 18, 56, 48, 127, 64, 230, 250, 31, 46, 6, 77, 49, 253, 48, 13,   49, 243, 15, 130, 48, 27, 44, 140, 191, 252, 159, 144, 10, 147, 128, 0, 27,   168, 225, 74, 160, 7, 8, 1, 12, 140, 176, 82, 60, 241, 101, 143, 160, 44, 182,   172, 151, 15, 176, 9, 49, 90, 0, 78, 47, 144, 21, 136, 48, 127, 69, 179, 0,   16, 60, 140, 177, 245, 140, 241, 111, 64, 12, 176, 12, 158, 213, 72, 2, 1, 32,   12, 13, 0, 75, 59, 81, 52, 52, 199, 254, 144, 61, 1, 52, 192, 12, 12, 62, 10,   20, 136, 49, 193, 124, 184, 25, 95, 192, 242, 50, 199, 214, 51, 197, 189, 0,   50, 192, 50, 123, 85, 32, 0, 75, 59, 81, 52, 52, 199, 254, 144, 61, 1, 52,   192, 12, 12, 62, 10, 20, 136, 49, 193, 124, 184, 25, 92, 0, 242, 50, 199, 214,   51, 197, 189, 0, 50, 192, 50, 123, 85, 32, 2, 1, 88, 16, 17, 0, 33, 188, 182,   7, 106, 38, 134, 152, 255, 210, 7, 160, 38, 152, 1, 130, 248, 28, 0, 37, 180,   163, 189, 168, 154, 26, 99, 255, 72, 30, 128, 154, 96, 6, 2, 4, 107, 224, 112,   0, 33, 182, 111, 93, 168, 154, 26, 99, 255, 72, 30, 128, 154, 96, 6, 13, 134,   48, ]);  export default bocArray;

Tech🧑‍💻🐾: i have created array of the boc

Tech🧑‍💻🐾: const contract = useContract();

Tech🧑‍💻🐾: Here's the request 👇👇👇  I'm currently working on integrating a Func contract with my React frontend but am facing some issues. I'm using Tonweb to pass the contract's address and BOC; however, it seems that the methods in my contract are not being correctly recognized. Is there any documentation or guidance available that could help with this integration?

Tech🧑‍💻🐾: @pcrafter

ashes: hi guys, is there a doc or an example of how to deserialize the body from in_msg.body using tonweb, cant find anything relevant

&rey: I don't know how to work with tonweb.Contract. (reply to 91527)

&rey: Also, API URL seems off, like it doesn't refer to TON.

MZ: What do you do to retrieve publicKey from connected wallet if the wallet has been just created and it doesn't have any transactions (it's not deployed to blockchain)?

M: I installed mytonctrl2, and when I tried to run it with mytonctrl, it said: "Found new version of mytonctrl! Migrating!". So, I navigated to /usr/src/mytonctrl and attempted to run migrate.py, but I encountered this error: ModuleNotFoundError: No module named 'mypylib.mypylib'. This error occurred because the code includes from mypylib.mypylib import MyPyClass and from mytoncore.mytoncore import MyTonCore. It also has from mypylib.mypylib import run_as_root.  How can I migrate? How can I run this file?

&rey: Get it from StateInit or publicKey provided by wallet app. (reply to 91536)

Stephan: hello guys, please help, how do I link metadata to the nft and nft collections when deploying in the blueprint library?

MZ: I use this example and looks like stateInit doesn't have public key when the wallet has just been created. It works properly only when there was any transaction on the wallet.   Where can I find publicKey provided by wallet app? (reply to 91540)

Nguyễn Linh: Can you help with this @pcrafter (reply to 91508)

Serhii: Guys, can someone recommend learning materials about low-level ton components like mempool, relay networks, validator work?  I’ve read everything in docs.ton.org and whitepaper but it’s not enough.

yoshi~: Is there a significant indexing latency of tonapi? Is it more profitable in terms of latency and stability to use private liteserver or tonapi's indexing hardware is superior? The context is simple actions like getting wallet's balance and querying jetton metadata.

Pibu: hey everyone, I have a Root contract and Child contract. Child contracts are deployed per user address. User can do something in their contract and it sends a notification to Root. It is easy to discover the user contract by providing an address. But there is also a case when I get a string (let's say some code) and I need to find user's contract based on that string. I was thinking about using a dict (storing code -> user address) but as I understand this is not TON way. So am I correct to assume that it would be better to deploy a Child2 contract that maps that string to user and sends appropriate data to the Child user contract?

Артур: Hi guys! Could anybody explain this weird tact compiler behavior?  When I do:  send(SendParameters{             to: self.bankWalletContractAddress,             value: context().value - self.minBalance,             mode: SendRemainingValue,             bounce: true         });  it compiles. But when I try to specify some value in tons:   send(SendParameters{             to: self.bankWalletContractAddress,             value: ton("0.005"),             mode: 0,             bounce: true         });  compiler says "Error: Struct value is missing a field: body"

Almatbek: Could there be an opportunity for a capable developer to contribute to your project?

Anton: Hi, can you please file this as an issue here? https://github.com/tact-lang/tact/issues/new  Would be nice to have a way to reproduce it locally (reply to 91551)

User<6422235070>: Does anyone know where to put the tonapi bridge token in pytonconnect?

M: I installed mytonctrl2, and when I tried to run it with mytonctrl, it said: "Found new version of mytonctrl! Migrating!". So, I navigated to /usr/src/mytonctrl and attempted to run migrate.py, but I encountered this error: ModuleNotFoundError: No module named 'mypylib.mypylib'. This error occurred because the code includes from mypylib.mypylib import MyPyClass and from mytoncore.mytoncore import MyTonCore. It also has from mypylib.mypylib import run_as_root.  How can I migrate? How can I run this file?  Even when installing version two, it gives this error:  ModuleNotFoundError: No module named 'mypylib.mypylib'

президент шкільної ради: ???

президент шкільної ради: am i supposed to use the ton web3 proxy to browse docs or what does this mean

&rey: This isn't TON site. (reply to 91562)

&rey: ton.org is official, one which you browse is not.

Артур: sure (reply to 91555)

Vova: const wallet = useTonWallet();  how i can get same addres as in tonconnect button   Address.parse(wallet.account.address).toString()  givin me different representation

Bored: Hey looking for some philiphines devs anyone interested?

Артур: UPD: I have created new project using npm create ton@latest and problem disappeared (used the same code) (reply to 91551)

Dave: How can I get started? (reply to 66688)

Pedro|💲🔓: /stat@combot

GIM: Hi

GIM: How can I delete my jetton logo's cache

GIM: I found some websites use cached jetton logo.

User<6558719212>: Guys , does anyone have ai for making miniapp or website?

&rey: You should read about TON architecture and then decide if you want more theoretical or more hands-on experience. (reply to 91627)

Sol: Hello everyone. I am here to answer questions and improve my skills:)

— 2024-08-04 —

Donas: Hello, good evening! How can I verify a token in Tonkeeper? Thanks

Howard: make sure it's the both in mainnet? (reply to 90382)

NakeyJakey: I create a wallet with tonkeeper deskop and import the wallet to tonkeeper mobile with the dev option “import test wallet” using the same seed. But the result addr is entirely different (reply to 91720)

Howard: 👍🏾 (reply to 67263)

NakeyJakey: I want to use my mobile wallet for testnet (blueprint)

NakeyJakey: But i give up now. Switch over to use the mnemonic option in blueprint

Carpin: Hello, a pleasure to greet this powerful community.   My name is Isaac, a crazy understander of how the Crypto world works.   It is very easy for me to create self-sustaining projects in the Digital world and that is why I am looking for help from an app programmer on the TON blockchain to link it to my BOT as a mini app.   Lesía would appreciate it very much 🙏

Rohit: I created a Jetton contract in Tact language. Yesterday, it showed the contract type as "Jetton" and provided details when clicked. Today, it shows the contract type as "unknown." Can anyone explain the reason for this?

Dave: I'm a practical guy 😜 (reply to 91646)

Sagara: @pcrafter I'm synching a ton Archive node with flags --state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000, So far the DB is 4.3 TB. Document say the DB is 4 TB.  any idea about how big the DB is ? I need to get an idea how long it will take to sync. I used snapshot also.

Alex: Hi guys. Does somebody know what could be a problem? My transaction shows as failed even at the confirmation stage :(

Thea: Write to me (reply to 91730)

Alex: the code behind the transfer:       const body = beginCell()     .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code     .storeUint(0, 64)                         // query_id:uint64     .storeCoins(toNano(100))                      // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)     .storeAddress(Address.parse(destination))  // destination:MsgAddress     .storeAddress(Address.parse(destination))  // response_destination:MsgAddress     .storeBit(0) // no custom payload     .storeCoins(0)                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message     .storeUint(0,1)     .endCell();      const transaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [             {                 address: senderAddress.toString(), // sender jetton wallet                 amount: toNano(0.02).toString(), // for commission fees, excess will be returned                 payload: body.toBoc().toString("base64") // payload with jetton transfer body             }         ],     } Could somebody help me please? (reply to 91740)

Δανιήλ: Hello, I need your help:  Is there a way to get historical wallet balance data? A week/month/1 year ago,  I have the ability to calculate the price of all tokens for a specific date and their amount, but this makes a bit more queries, which is not desirable.  Thank you

Victor: accept transaction and send what error happens in tonviewer (reply to 91755)

Alex: I've tried. I've got an error like "Transaction error Unable to complete the operation" (reply to 91758)

Victor: open tonviewer and enter your wallet address there then send me the link and I'll take a look (reply to 91759)

Victor: I can’t understand what exactly happened without error

Victor: the screenshot doesn't say anything about the error

Alex: Actually, the error I can see in the tonviewer doesn't say anything too :( (reply to 91764)

Muhammad: I need contact someone from TON customer service .

Victor: u error is 709 - not enough gas.  change to amount: toNano(0.1).toString()  the rest of the ton will return to the wallet (reply to 91755)

Alex: But I've sent even more, like 0.5, 0.2 (reply to 91768)

Victor: nope u send 0.05 (reply to 91769)

Victor: This is not enough (reply to 91770)

Alex: omg, thank you so much, I'll try (reply to 91770)

Victor: I'm monitoring the wallet, if there is an error I'll write (reply to 91773)

Alex: It's all working, thank you. (reply to 91774)

Victor: good (reply to 91778)

Nightfall: but if we are deep in the message chain, i.e   user wallet -> contract 1 -> contract 2 (failing here)  throwing error will just bounce back to contract 1, and if it does not process bounced message then the fund is stuck in contract 1, right? that being said, even if contract 1 processes bounced message, it will not even have the original sender address to send back the fund (since bounced message data is limited to under 256 bit of the original message, not enough to store the user address).  So in this case, should we catch the error in contract 2 and refund the user right away? (reply to 66695)

&rey: This is correct. (reply to 91783)

Nightfall: thanks! but in this case, the message from contract 1 -> contract 2 will not have an exit code, although it failed. So to determine if a particular function is successful or failed we have to do manually right? (i.e attaching more data - an exit code maybe - in the refund message) (reply to 91784)

&rey: Yes. Also, a good opcode to use in contract 2 => user wallet is 0xFFFFFFFF. (reply to 91785)

Nightfall: May I know why? Jetton uses 0xd53276db as excess opcode afaik (reply to 91786)

&rey: Because you are executing bounce, essentially? (reply to 91787)

Nightfall: oh (reply to 91788)

Nightfall: I did not think about that

Nightfall: I use the same opcode for refunding both in success and error cases

Nightfall: Will change that, thank you

Sol: hooray I managed to make my first website on ton

Pouya: hi, I'm working with the TON blockchain and I'm trying to identify the version of a wallet using its stateInit value. I've encountered an unfamiliar stateInit value and I'm unsure how to decode it or determine the wallet version it corresponds to.  Here is the stateInit value: te6cckECFAEAAoEAART/APSkE/S88sgLAQIBIAINAgFIAwQC3NAg10nBIJFbj2Mg1wsfIIIQZXh0br0hghBzaW50vbCSXwPgghBleHRuuo60gCDXIQHQdNch+kAw+kT4KPpEMFi9kVvg7UTQgQFB1yH0BYMH9A5voTGRMOGAQNchcH/bPOAxINdJgQKAuZEw4HDiEA8CASAFDAIBIAYJAgFuBwgAGa3OdqJoQCDrkOuF/8AAGa8d9qJoQBDrkOuFj8ACAUgKCwAXsyX7UTQcdch1wsfgABGyYvtRNDXCgCAAGb5fD2omhAgKDrkPoCwBAvIOAR4g1wsfghBzaWduuvLgin8PAeaO8O2i7fshgwjXIgKDCNcjIIAg1yHTH9Mf0x/tRNDSANMfINMf0//XCgAK+QFAzPkQmiiUXwrbMeHywIffArNQB7Dy0IRRJbry4IVQNrry4Ib4I7vy0IgikvgA3gGkf8jKAMsfAc8Wye1UIJL4D95w2zzYEAP27aLt+wL0BCFukmwhjkwCIdc5MHCUIccAs44tAdcoIHYeQ2wg10nACPLgkyDXSsAC8uCTINcdBscSwgBSMLDy0InXTNc5MAGk6GwShAe78uCT10rAAPLgk+1V4tIAAcAAkVvg69csCBQgkXCWAdcsCBwS4lIQseMPINdKERITAJYB+kAB+kT4KPpEMFi68uCR7UTQgQFB1xj0BQSdf8jKAEAEgwf0U/Lgi44UA4MH9Fvy4Iwi1woAIW4Bs7Dy0JDiyFADzxYS9ADJ7VQAcjDXLAgkji0h8uCS0gDtRNDSAFETuvLQj1RQMJExnAGBAUDXIdcKAPLgjuLIygBYzxbJ7VST8sCN4gAQk1vbMeHXTNC01sNe  so i have faced with this error :unsupported wallet version can anyone helps me?

Bryce: do any one have jetton_wallet_v2 code?

Tanya: I am looking for an interesting project. If u need a developer, let me know

hentai8: I have the same issue. Did you fixed it ? (reply to 77676)

I'm: Hi everyone, do you have document/website which have the tutorials to create highload wallet with JS?. Thank bro

Jasper: Hi

🦴Maestro Rafael: Hello! I'm new to this business. I have a question. When transferring TON from the Broker to my wallet, I am asked for a MEMO/TAG from Ton. Could you help me with this? Where can I find this TAG or Memo? ￼

Crypto noobie: Hi!  How can I implement coin transfers with fees on the TON blockchain using React for the frontend and Node.js for the backend? I want to transfer coins from one user to another and also take a fee for each transaction.

&rey: Via TON Connect 2, you mean? (reply to 91854)

Crypto noobie: yes via ton connect

Crypto noobie: I want some guide, not asking for full implementation 🙌

&rey: Visit TON Cookbook, token transfers are detailed there. To take fee, set responseAddress to your wallet and set outermost TON value to include that fee. (reply to 91856)

Crypto noobie: Thank you for the response. To confirm, based on the TON Cookbook example for token transfers:   await scaleWallet.sendTransfer(sender, toNano("0.3"), {   amount: amountIn,   destination: scaleVault.address,   responseAddress: sender.address,   forwardAmount: toNano("0.25"),   forwardPayload: VaultJetton.createSwapPayload({ poolAddress }), });   To confirm my understanding should I set the responseAddress to my wallet address to collect the fee? Is this correct? Also, can you confirm if the responseAddress is indeed used for collecting the fee or just for returning the gas fee to the sender?

Nguyễn Văn Tâm: /

&rey: Jetton wallet returns unused gas (TON) to whoever is specified in responseAddress. (reply to 91860)

Crypto noobie: Thank you for the clarification! Really appreciate it  🙌🙌🙌

Sammy: PHP developers for making mini-app, please contact me in DM!

Clare: DM

Prince: pls careful about scam (reply to 91873)

ᅠ: How do I install TON Proxy from my phone?

Павел: Help please. i use tonconnectSDK when i connect to my wallet i confirm this connection but i don't get the answer in my application. onStatusChange method don't work.

ᅠ: IOS (reply to 91877)

Mickey | SuperteamPL: /report

itay: /report

EDITOR FRED: if working with Nutgram (reply to 91869)

User<7075577942>: Okay (reply to 91900)

Manish: Just curious to know what mini apps you have built

Michael: Hi guys, I want to uninstall ton Blockchain and remove all the data in it and start syncing from latest block.  Any easy and fast way to do this?  It would really be appreciated

Howard: /spammmmmmm (reply to 91934)

— 2024-08-05 —

Svαtoωλ‎: i used vanity-fast from tonutils go and generated address. how to use private key? for contract deploy or etc idk

prodvd: What is w5? (reply to 91180)

Ruslan: This is the latest version of the TON wallet smartcontract. https://github.com/ton-blockchain/wallet-contract-v5 (reply to 91948)

prodvd: Thank you. (reply to 91949)

L: Hello are you still looking for NFT smart contract dev? (reply to 91297)

Nightfall: Hello, does ton have anything equivalent to event/log on evm/solana? (reply to 91788)

&rey: Yes, but it is largely useless as you can track transactions on the contract with the same result. (reply to 91958)

Sagara: Yes, What is the issue you are facing out of those ? (reply to 91814)

Sagara: @pcrafter Do you have any thoughts about the size of the Ton Archive node? (reply to 91738)

&rey: Some TB. (reply to 91963)

Nguyễn Linh: Hi, can I ask why this transfer did not succeed in sending 0.07 TON to the receiver? The body:  const tx = walletContract.createTransfer({     seqno: seqno,     secretKey: keyPair.secretKey,     messages: [internal({         value: '0.07',         to: ADDRESS_TEST_2,         body: 'Test listen ton tx status!',         bounce: true // todo: check why set this true can not work?     })] })

&rey: This should be string in nanoTON instead. Or toNano('0.07') at least. (reply to 91969)

Nguyễn Linh: I tried it but still not work. This is the tx: https://testnet.tonviewer.com/transaction/188f348c5d6919bef40eb844701b0c820b1c8c843f805cc5601fd48df43ac50a (reply to 91970)

&rey: Well, you asked for bounce if destination contract could not process the message, destination contract could not as it was uninit, so TON bounced.

Nguyễn Linh: How can I check if the destination contract can process the message or not? Or, should I always send my messages with the bounce flag set to false? (reply to 91974)

Nguyễn Linh: I also read the bounce from the docs and it's said that we should not allow sends with unbounceable: It is a good idea not to allow the end user (e.g., of a wallet) to send unbounceable messages containing large amounts of value (e.g., more than five Toncoins) or to warn them if they do

&rey: You've read the full sentence, haven't you? (reply to 91976)

Nguyễn Linh: So how to check if the destination contract can process the message? (reply to 91977)

&rey: Is ADDRESS_TEST_2 intended to be some wallet? If so, once you check that address is correct, bounce should be false.

Nguyễn Linh: ty, I get the point (reply to 91981)

Rjx: Hi Team,  I'm encountering an issue where the [TON_CONNECT_SDK] Bridge is reconnecting with a 5000ms delay. Could anyone provide insights into what might be causing this problem?  Thanks!

ΛŁĩ: Hi , I have a tonweb lib code for transferring, but when I confirmed it, gaves unknown error

Kane: Hello everyone, who can I ask for Star payment question? The star we counted by our API and star I received is not the same

hentai8: I tried to run the full node, but I have the issue "does not have a valid ShardAccount to unpack" in /var/ton-work/log.thread.log (reply to 91962)

Michael: Hi guys, I want to uninstall ton Blockchain and remove all the data in it and start syncing from latest block.  Any easy and fast way to do this?  It would really be appreciated (reply to 91974)

Lucas: In TON transfer transactions, what does the sendMode field mean?

Buggy: Can we convert a timestamp to logical time (lt) off-chain?

Buzz: Hello, I am new TON developer. I created a contract using Func language.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            but in_msg_body.slice_empty?() value is always true.  I don't know what is the reason. I hope someone helps me. Thanks

sunyoki: to see, how does this method get called (reply to 92002)

Buzz: Thanks for your reply. This functions worked exactly before I update contract. I added a cell in constructor. it is not working after this action.. (reply to 92006)

sunyoki: don't see anything wrong🙈

Buzz: Hmm, Don't you see this error before? (reply to 92010)

0xbera: Hello -- can someone please recommend commercial liteserver providers (iwth a high request rate) that work with a framework like xssnick/tonutils-go for example

sunyoki: I'm not (reply to 92012)

Buzz: Thanks anyway

alex: Is this spam? (reply to 92023)

Nerses: what is the proper way to use forward_payload  as body. Should it be converted ?  typescript      receive(msg: TokenNotification){         let ctx: Context = context();                 send(SendParameters{                                 to: myAddress(),                                 value: ctx.value,                                 bounce: true,                                 mode: 0,                                 body: (msg.forward_payload),                             }         );     }

Akachi: Is there any way to invoke the tx and execute using scan explorer like etherscan?

&rey: You can use msg.forward_payload.asCell() (though I think you don't want to send message to yourself in this case; just call appropriate function!) (reply to 92026)

Nerses: i want to send to my contract. Would it be better approach to use function for it ? (reply to 92029)

&rey: Yes, as each message incurs considerable forward fees. (reply to 92030)

Rjx: Hi Team,  I'm encountering an issue where the [TON_CONNECT_SDK] Bridge is reconnecting with a 5000ms delay. Could anyone provide insights into what might be causing this problem?  Thanks!

Nerses: under the hood that function would implement send , then what would be the trade off ? (reply to 92031)

&rey: Ain't that @liteserver_bot? Though I haven't used one. (reply to 92014)

User<7452384231>: Hi, everyone! const internalMessage = beginCell()          .storeUint(0x10, 6) // no bounce          .storeAddress(Address.parse(XXX))          .storeCoins(toNano("0.03"))          .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1 that means we have body as a reference          .storeRef(internalMessageBody)          .endCell();

User<7452384231>: I want to know type of "XXX".

Nerses: will it be more fee eifficent to use self.forward  instead of send  or there is more appropriate approach ? https://docs.tact-lang.org/ref/core-base#self-forward (reply to 92029)

&rey: No. It would be more fee efficient to avoid message in that place at all. (reply to 92038)

Nerses: then how to invoke smart contract based on forward_payload  of Token Notification  ? (reply to 92039)

sangmin: At what value can I check if the transaction is successful??

&rey: Refactor contract so that its functionality is in a function fun processIn(...). Call that once you get TokenNotification or another message. (reply to 92040)

Aksana: Hi all  Who know where i can find support bot of notcoin ?  I have problem with my ton voucher. Voucher is at the at the zero-addres ton and idk how to return it to my wallet

Nerses: so it will be just encapsulation of send  inside fun processIn(...),wont it ? (reply to 92044)

sangmin: I tried to check whether it was successful with exit_code value in complet_ph in the description, but there are transactions that do not have exit_code value.  help..

&rey: Why? You can just directly do the logic = update contract parameters, etc. (reply to 92046)

Nerses: now i get it.thanks for explanation (reply to 92049)

Nerses: does forward_payload has such structure or it is just visualization , so is it possible to get for example op_code or value` ?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 61 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 15  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

0xbera: Thank you for the pointer! I would like to use their service and would be even willing to pay $160 for the month but cannot find any documentation ..? 😿️️️️️️ (reply to 92034)

Kan: hey guys, where can I find some stats about telegram mini apps, i'm doing research for my article

Mikhail: I am looking for owners and managers of clickers and tapclick in Telegram Mini Web Apps  for cooperation and placement of our advertising.

v1t4l3y: Guys i’m validating in testnet, but cannot find how to update pool fee? can someone help

Nerses: receive(msg: TokenNotification){         let ctx: Context = context();         let op_code: Int = msg.forward_payload.preloadUint(32);         if (op_code == 1734998782){             commit(msg.forward_payload , ctx);         }     }      fun commit(msg: Commit,ctx: Context){... }   i have modified the part of handling with forward_payload  but it throws error Function "commit" expects 0 arguments, got 2 (reply to 92049)

&rey: commit is a Tact stdlib function. (reply to 92074)

Buggy: Hi, can anyone help me, I curious if I can implement a contract to have an ability of Wallet (e.g. WalletV4R2), in order to customize my wallet contract to have something special, like a state or some feature that the default wallet doesn't have. Since the wallet in Ton is contract, I hope there is a way to do so.. Thanks in advance for help.

7183 | BIG Labs: Hey, do you mind if I dm you? (reply to 91935)

Денис: Has anyone encountered it? when trying to send an address to the getter, an Unsupported stackitemtype: undefined error occurs    Is the transfer of the address to the gutter supported in fact?  try {         const result = await this.client.callGetMethod(this.address, 'getPlayerBalance', [             { type: 'address', value: address }  // Fix here: Use the address variable         ]);         ..     } catch (error) {         console.error("Error getting player balance:", error);         return BigInt(0);     }

ΛŁĩ: Have any experience in tonweb?

Almatbek: What do you want (reply to 92060)

Almatbek: I have (reply to 92082)

ΛŁĩ: Pls check dm (reply to 92084)

RUN: Hey guys... Is there any sites like iancoleman that generates ton mnemonic and address?

Ken Wang - BYBIT: anyone comes from Tonviewer?

&rey: Is wallet.ton.org sufficient? (reply to 92093)

ΛŁĩ: Guys i use tonweb js for transaction on ton but I got unknown transaction error

final: Very informative👍 (reply to 92097)

RadolyTech🍅: Yes (reply to 91701)

RadolyTech🍅: Needed help (reply to 91701)

RUN: Not actually I want it to be able to copy and see the list of addresses (reply to 92096)

Stephan: good afternoon everyone, who knows what the error "132: Access denied" means when calling Mint in the nft collection? https://testnet.tonviewer.com/transaction/a610be0fa8f71ace85398b31690f4eacbc2b51c3f294ffc2f62376d75e526c9d

RUN: I need something like iancoleman.io/bip39/ (reply to 92096)

ashes: Does any1 has an example of sending jetton tokens using blueprint?

iAbdurahmon: Hi Where can i find guide for launching Ton Site I can't find or don't work

Nerses: this operation doesnt cause any error   let op_code: Int = msg.forward_payload.preloadUint(32);    but when i try to do operation op_code - 567876  it throws error cell underflow . what can cause that ?

&rey: Because if you don't use a value its calculation can be removed. (reply to 92111)

Louis: Is there a mechanism for TON to trigger events and have external monitoring

Louis: What should I do if I call the factory contract through a message, and the token is deployed in the factory contract, but the address of the token cannot be obtained externally, and those states cannot be obtained either?

Nerses: here is what I do in the end      receive(msg: TokenNotification){         let ctx: Context = context();         let op_code: Int = msg.forward_payload.preloadUint(32);         if (op_code == 1734998782){             self._commit(Commit.fromSlice(msg.forward_payload), ctx);         }         if (op_code == 3995289619){             self._lock(Lock.fromSlice(msg.forward_payload), ctx);         }     }  i thought the cell underflow comes from passing wrong layout to fromSlice, but it turns out I got same error even in case       receive(msg: TokenNotification){         let ctx: Context = context();         let op_code: Int = msg.forward_payload.preloadUint(32);             require(op_code - 1734998782 == 0,"unknown error")      } (reply to 92112)

Chakra: ..

Nerses: let ctx: Context = context();         let op_code: Int = msg.forward_payload.preloadUint(32);         if (op_code == 1734998782){             // self._commit(Commit.fromSlice(msg.forward_payload), ctx);         }         if (op_code == 3995289619){             // self._lock(Lock.fromSlice(msg.forward_payload), ctx);         }     }   also same error get for this version. so it should occur only because of if statement. Is ther any solution for such cases or any hint ? (reply to 92112)

sunyoki: How can I get other contract data within a contract

Nerses: It is not possible for one contract on TON to call a method on another smart contract on TON.   https://answers.ton.org/question/1485787094973419520/how-can-one-smart-contract-on-ton-blockchain-call-a-method-on-another-smart-contract#:~:text=It%20is%20not%20possible%20for%20one%20contract%20on%20TON%20to%20call%20a%20method%20on%20another%20smart%20contract%20on%20TON. (reply to 92122)

sunyoki: 😂

123.Fuxked: I am (reply to 66637)

ΛŁĩ: I used tonweb for transferring ton but why it refund every transactions    https://tonscan.org/address/UQDN8MT1l7IuFxmtFM3JQgQLv7NwcmUxYH__cHMu80d32fgK#events

&rey: That's called "bounce". (reply to 92132)

ΛŁĩ: I didn't get it actually (reply to 92134)

&rey: Almost all internal messages sent between smart contracts should be bounceable, i.e., should have their "bounce" bit set. Then, if the destination smart contract does not exist, or if it throws an unhandled exception while processing this message, the message will be "bounced" back carrying the remainder of the original value (minus all message transfer and gas fees). (reply to 92135)

ΛŁĩ: But everything is ok , params and code , how can solve this problem (reply to 92136)

&rey: Destination contract is uninit. (reply to 92137)

ΛŁĩ: Oh okey , my project is working like a wallet, with tonweb generate wallets and when transferring to another wallet it refund it , my generation address are EQ, maybe it's a problem? (reply to 92138)

ΛŁĩ: But tonweb only generate EQ , how can I generate UQ wallets

&rey: addr.toString(true, true, false) (reply to 92140)

ΛŁĩ: This for generation the wallet yes? By this it would generate UQ?  I use v4r2 (reply to 92141)

0xbera: Hello! I am trying to bring up a full node and get this error:   Failed to check adnl connection to local node: host: ip1.ip2.ip3.ip4, port: 31819, pubkey: CwVy4jsAm2JJaLrMjE/5sGw2ldD3ogOxdyLJYR7TLnI=, error: timed out   any advice how to fix this?

dlkash: 1

User<6397988095>: ✅Does anyone need a web engineer?

Nerses: in case i encapsulate message inside forwar_payload is it proper way to handle with that data to call needed function ?     receive(msg: TokenNotification){         let ctx: Context = context();         let op_code: Int = msg.forward_payload.loadRef().asSlice().preloadUint(32);         if (op_code == 1734998782){             self._commit(Commit.fromSlice(msg.forward_payload.loadRef().asSlice()), ctx);         }     }

Joe: Hi, what if i send state_init to contract that is already inited? Will transaction bounce or init will be just skipped

&rey: Init will be skipped. (proof: jettons) (reply to 92151)

&rey: This should only be done once. (reply to 92150)

Nerses: so the second time when i do that operations the data already is cut and not exists,isnt it ? can preload be solution for it ? (reply to 92153)

&rey: Yes. Not preload, variables are a fine solution. (reply to 92154)

Kirill: Здравствуйте.  Вопрос, есть ли здесь русско говорящие люди которые могут помочь с консультацией и настройкой сайта на домене. TON (example dot ton)

Nerses: is this approach better ?   receive(msg: TokenNotification){         let ctx: Context = context();         let data: Slice = msg.forward_payload.loadRef().asSlice();         let op_code: Int = data.loadUint(32);         if (op_code == 1734998782){             let _msg = beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(op_code, 32).storeSlice(data).endCell()).endCell();             self._commit(Commit.fromSlice(_msg.asSlice()), ctx);         }     } (reply to 92155)

Nerses: i aggregate the message again to be able to pass it as an argument to function (reply to 92160)

&rey:  receive(msg: TokenNotification){         let ctx: Context = context();         let data: Slice = msg.forward_payload.loadRef().asSlice();         let op_code: Int = data.preloadUint(32);         if (op_code == 1734998782){             self._commit(Commit.fromSlice(data), ctx);         }     } (reply to 92160)

Nerses: as to read op_code is used preload method the op_code remains in data,isnt it ? (reply to 92162)

Inayat: is ther any way to change the admin address if I minted jetton through https://minter.ton.org/

Haint: Hey man, when sending a transaction that initiates a chain of messages between multiple contracts, how do I make sure that all the transactions have been confirmed?  await contract.sendUpdateSomething(); // using contract opened by TonClient    Is it correct that after this call we can say that all the transactions are confirmed?  I have seen people using seqno as a way to do the checking (if it increases then it's likely the transactions have landed) but I think it's not very reliable since the user can send another transaction elsewhere. (reply to 92162)

&rey: You can't. In general, you should wait until all effects are done. (reply to 92172)

Haint: do you mean I have to check the state? (for example, check if "something" is actually changed in the contract's storage) (reply to 92173)

&rey: Yes. Though, once first transaction of tree is sent, the others are bound to happen eventually. (reply to 92174)

Haint: thank you man (reply to 92175)

Carpin: I am looking for a programmer to develop a mini-app on the TON blockchain     If you speak Spanish better.

weifu: Looking for a good new WEB3 project

Anonicz: Hello, guys.

Anonicz: Method not Allowed. I can’t get data from the blockchain. Why? who can tell

0xbera: I am sending 24 txs with a 150 millisecond pause from a wallet_highload_v3r1 wallet ; some off these get sent but some just get dropped for some reason. The https://github.com/xssnick/tonutils-go package just says:  transaction was not confirmed in a given deadline, but it may still be confirmed later   However - these txs never get sent or confirmed.  Any idea why this is or how I could improve the number of txs that are sent successfully?

&rey: What API endpoint are you calling? (reply to 92183)

Anonicz: My? I installed a lite server (reply to 92191)

Anonicz: Do you know how to fix it (reply to 92191)

&rey: What's specific endpoint you passed to TonClient?

Anonicz: All from github (reply to 92198)

Anonicz: Lnks not allowed there

&rey: localhost:8000/??? or something other?

Anonicz: Where can i see this? (reply to 92202)

Almatbek: Contact me (reply to 92179)

Anonicz: ? (reply to 92202)

&rey: this.tonClient is set somewhere. (reply to 92203)

Dev: DM! (reply to 92179)

Ronaldo: How can i sync it with Java? (reply to 91440)

RadolyTech🍅: I got a demo if you don't mind we can discuss better in pm (reply to 92179)

^_^: Hi, Please DM me (reply to 92179)

Xayat: 090 733 1092

User<5953422956>: /stat@combot

Xayat: Ok

— 2024-08-06 —

Terence: Hello fellow Ton devs - anyone know of an automated smart contract analyzer similar to Slither for EVM smart contracts?

7183 | BIG Labs: I’m Daniele BD Manager at BIG Labs, a Dev House specialized in building web3 applications on Cosmos.  Who can I contact to discuss what’s the best way for us to start building on TON?

boris: hello, is it possible to integrate ton connect in custodial wallet?

Prince: you want consulting for your team? (reply to 92264)

7183 | BIG Labs: I would like to have a chat with someone from the team to better understand how we can help in the TON expansion (reply to 92268)

minhtienhcmus: hi everyone, i. call contract on testnet by func  but error  as above:  how to resolve error?  thanks,

tony: What programming language do you currently use to write smart contracts on TON? Do you use Tact?

minhtienhcmus: i use func (reply to 92272)

minhtienhcmus: tomorow it work. but today error

tony: I see that there is very little content in Tact's official development documentation.

Joel Mun: Tact is not for production right now

Prince: so you mean you want to contribute to ton chain? (reply to 92270)

Prince: any idea?

7183 | BIG Labs: Exactly (reply to 92279)

7183 | BIG Labs: I would like to discuss them with someone from the team, to get some feedback before going further (reply to 92281)

Prince: 4hrs later @pcrafter will come back. then you can talk to him

7183 | BIG Labs: Thank you! (reply to 92285)

cai: Does Tact have any security issues? (reply to 92276)

Joel Mun: no but it's just that some important functionalities are not supported yet and it hasn't gone through thorough security reviews (reply to 92289)

cai: Okay, thank you. I am a beginner in TON chain contract development, and FunC is too difficult for me.😭 (reply to 92290)

Joel Mun: func is indeed difficult. docs are scarce.

Joel Mun: https://research.lazer1.xyz/blog/how-jettons-work-on-ton-with-sharding-in-mind-part-1/

Joel Mun: I wrote some article to get started with TON basics with jetton as an example

Joel Mun: check it out

sunyoki: 666

Рабочий чат: Do you know what the issue might be and how to fix it? In the clicker app (mini app), when clicking with multiple fingers, the app sometimes minimizes.

cai: Thank you for sharing!! (reply to 92294)

tony: Perhaps you could try our tool; it can help you debug Tact. Please DM me, and I will send you the usage link. (reply to 92291)

Joel Mun: scam (reply to 92302)

Sol: Hello/i need work

cai: 👌 (reply to 92303)

Harry: guys, i have nft on testnet getgems but i can't read it with testnet.tonapi.io, why? do i need to config anything?

Dmitry: Hi guys! Does anyone have any clues about fractional NFTs on TON?

tony: I am not a scammer; I just can't send the link to the group. (reply to 92303)

tony: This is our bot.

David: Hi! Do you have any example showing how to use the plugin function? like how to add plugin, how to authenticate the plugin, and so on. Thanks! (reply to 60624)

^_^: I'm here (reply to 92315)

Bryce: Hello,  I want to use Highload Wallet V3 to pay the transaction fees instead of Wallet V5 (similar to Tonkeeper Battery). Does anyone have a reference or guide on how to achieve this?  (im new to TON blockchain)

Steven: Hi, Does anyone can explain or paste some link of resource or document about why the recipient would be charged transaction fee unlike other blockchains? please help🙏

Matthew: hello my fellow indians

Stanislav: It seems that in testnet toncenter indexer API v3 estimateFee endpoint disappeared (although it's still available in mainnet version still). Does anyone know what happened? Not sure if it's just a bug, or intentional removal.

cai: https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers (reply to 92327)

Steven: thank you so much (reply to 92330)

Огурчік: how i can understand, it is mainnet or testnet? EQBrOR20pmQQr8Vi3xtaahTFWDS-luPcaakS_cRzy-j2VJX2

Nerses: while executing this code      receive(msg: TokenNotification){         let ctx: Context = context();         let data: Slice = msg.forward_payload.loadRef().asSlice();         let op_code: Int = data.preloadUint(32);         if (op_code == 1734998782){             self._commit(Commit.fromSlice(data), ctx);         }     }  I got cell underflow, which occurs because of passing a data with layout different from the Message Commit. Here is the message structure and how I create layout,any hints or help will be appreaciated ! https://gist.github.com/nerses-asaturyan/d4dc102cd9d20a24204a4f6dcc198aa0

Haint: I dont know tact, but the use of preloadUint might be a problem here (reply to 92333)

Haint: yes it is, the CommitData does not expect an opcode, the use of preloadUint will not modify the slice, so you end up passing the data with the opcode also

Haint: change it to loadUint

Nerses: but here Commit.fromSlice(data)  Commit message expects op_code,isnt it ?  would it be ok to pass without op_code ? (reply to 92337)

Haint: message Commit{     data: CommitData; } (reply to 92339)

Haint: CommitData does not have an opcode

Nerses: i will try now with load . thanks a lot (reply to 92341)

Nerses: i tried with load but seems it wasnt the probelm.error cell underflow  still remains  https://testnet.tonviewer.com/transaction/ec459842fe691e6796185241e8324bfc5eedb4b96de2343e88d70985fd81bd39 (reply to 92338)

Haint: why dont you run an unit test and putting logs in the contract to see which line is causing the problem? (reply to 92343)

Haint: there might be multiple problems there

Haint: I think the opcode is just one of them

Nerses: for this case I have already tested on testnet,thats why I dont use tests. But you are right that could be solution (reply to 92344)

MR: Question:  How can we do OTC trade tokens on the TON? For examle with smart contract or telegram bot, one put a order and the other accepts it (without them trusting each other)

0xbera: Hello! I am sending 33 external messages (every 150ms) to a wallet_highload_v3r1 contract -- only 11 make it, 22 are dropped. Can somebody please explain what is going on? Also, any ideas how to investigate this or improve the success rate?

0xbera: sending tx / external message to highload wallet contract and occasionally get this error:  failed to send message: lite server error, code 0: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction CEC9A545233639371FCBB0E297E8AE93CCDF7E6BED477A795AAE30BC407A7989: exitcode=35, steps=68, gas_used=0 VM Log (truncated): ...xecute EQUAL execute THROWIFNOT 38 execute NOW execute PUSH s10 execute SUB execute PUXC s5,s-1 execute GREATER execute THROWIFNOT 35 execute XCHG s4 execute NOW execute LEQ execute THROWIFNOT 35 default exception handler, terminating vm with exit code 35  any idea what this means and/or how to fix it?

sunyoki: send_raw_message  3  What is the pattern that is not in the document

Haint: 3 is (1 | 2), 1 is pay fees separately, 2 is ignore errors (reply to 92358)

0xbera: what happens if a (wallet) contract receives an external message while it's still processing a previous message? Does the new message get dropped because the contract is still busy?

0xbera: /me

sunyoki: thanks

Matthew: greetings my fellow indians

sunyoki: How did you get this trade hash

sunyoki: How do I know if the transaction is successful 🤣

&rey: "while it's still processing" does not make much sense, but common wallet cannot process two externals in the same block because of seqno protection (and emulation prefiltering of externals). (reply to 92360)

&rey: Well, my wallet has a test script, and it involves using plugins. That code can be as-is copied to wherever plugins need to be manipulated. (reply to 92314)

&rey: You can send same message cells several times (generally, until it is recorded or deadline expires). (reply to 92349)

&rey: One party can deploy a smart contract locking their tokens, which would release them to whomever pays appropriate amount of second token. (reply to 92348)

&rey: No, validators guarantee that source addresses cannot be forged. (reply to 92322)

&rey: Unfortunately if you learn Tact you will face mostly the same difficulties but attribute them to TON in general. (reply to 92291)

Minimal ☄️: Hi everyone,  I am considering on developing a game on TON blockchain, but I have one question when it comes to the transaction fees that I don't understand.  My app would have a lot of small value transactions, but looking at the lost dogs for example (when I am buying BONES with NOT using Ton Space) I am getting fees of $0.3 per transaction, which I find a lot. I have tested sending NOT to a friend via TON space to mimic the transaction, and have seen that Telegram actually returns the excess funds (it has first told me that fee is going to be 0.1 TON but it was 0.017 TON in the end),  but I suppose that the network is not congested currently, and according to the docs, fee can go up to 1.05 TON (which could be around 5-10 dollars or more - depending on the TON price, which gives me the ETH and not Solana fees vibes)  TLDR: Are transaction fees on Telegram really this expensive, do you know of any plans to make them cheaper in the near future?    One more question, Why are some smart contracts such as the one from the Lost Dogs private and unable to be read? Only the 'assembly' code is visible, and the source code is hidden?  Isn't that the point of blockchain explorer?

Frol AnoGem: Hi there, can anyone explain to me how that formula works?   What is MIN/MAX parameters mean?

Crylion: 👋 With a solid foundation in computer science and years of experience in blockchain development. My expertise includes blockchain architecture design, protocol development, and decentralized application deployment. Does anyone need developer?🫡

Vladimir: Telegram ≠ TON. But you’re right, transaction fees is huge and core team thinks that it’s ok (reply to 92382)

Vladimir: If developer verifies contract, you can see contract sources in places like TonViewer, otherwise you can see only TVM instructions (reply to 92382)

Nerses: is there a way to get blockhash in TON like is done in solidity ? https://docs.soliditylang.org/en/latest/units-and-global-variables.html#:~:text=blockhash(uint%20blockNumber)%20returns%20(bytes32)

SP: can i calculate txs hash from txs boc

cai: Yes, but Tact code is easier to read.🤣 (reply to 92375)

&rey: What? Fees are constant. (reply to 92382)

&rey: The contract can be without source code if no one published said source code. After all, anyone can deploy a contract, and that requires only TVM assembly code.

Minimal ☄️: Why is so big fee for lost dogs for example, when buying bones with not coin?  Is their commission included in it, are that the smart contract expsneses? (reply to 92395)

Minimal ☄️: Is that fee for when sending any tokens to any sc?

&rey: It is usually lower, like 0.03 TON, but you do need to perform 3-5 transactions after all! (reply to 92399)

&rey: Wherever two jettons are involved, there are like 8 atomic transactions, more precise number depending on DEX.

Nerses: is it possible to get previous block's referecne while deploying contract ? https://docs.ton.org/develop/data-formats/block-layout#:~:text=A%20reference%20to%20the%20previous%20block.%20Stored%20in%20a%20reference.

MZ: Is it possible in Ton Network to send someone USDT when he doesn't have any TON tokens?   I read that in TON Contracts work in a little different way than EVM, so is it possible to create a wallet contract which will pay for user fess and he just will be able to transfer USDT without worrying about any fees?

Bryce: LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 7134542352E5467BC894692D36AE4C2DFDC859197444A98BDBDCDA51D55B2E30: exitcode=38, steps=61, gas_used=0 VM Log (truncated): ...ecute LDU 8 execute LDU 13 execute LDU 10 execute LDU 64 execute LDU 22 execute ENDS execute XCPU s6,s8 execute EQUAL execute THROWIFNOT 34 execute XCPU s5,s10 execute EQUAL execute THROWIFNOT 38 default exception handler, terminating vm with exit code 38 i get this error while transfering message with highload wallet v3 do anyone know why is that?  the code : https://pastebin.com/QhnrF6PZ

&rey: Someone still needs to pay TON for that transfer. Tonkeeper has pool for doing so, for instance. (reply to 92407)

AB: How to interact jetton token in another contract?

MZ: So I can transfer USDT using ton keeper even if I don’t have any TON tokens? (reply to 92415)

safal: Hello... I am working on react app on TON. When there is a "/" in transaction hash, i am not able to navigate the user to that specific transaction on tonviewer through the react app. Anyone have idea on how to work with the transaction hash containing "/" in it?

King: This is a senior blockchain full stack engineer with rich experience and deep knowledge about ton, solana and evm technology. I excel in developing high-throughput dApps & game and seamless smart contract integration using web3, telegram bot & miniapp. Please contact me anytime if you need a developer.

Minimal ☄️: Is 0.017 TON fixed fee for each tx on the Blockchain or it depends on the network congestions or anything else?

Mobin: Whos here from foundation?

&rey: Fee does not change with network load, but it depends on size of message sent between contracts and on amount of computation in said contracts. (reply to 92430)

&: then use raw format (reply to 92422)

&rey: Encode it in base64url. (reply to 92422)

Louis: How to add token liquidity through FUNC contract code

Minimal ☄️: Is that the minimum contract fee? If I don't have any Blockchain logic in my app besides distribution of rewards, does my app need to have a contract or can I use a simple wallet address? (reply to 92436)

Anton: https://t.me/tondev_news/136

&rey: Just a wallet, though if you distribute jettons custom jetton contract is better. (reply to 92444)

Minimal ☄️: Hm, I am not sure I understand, still trying to get around the TON concepts, could you please translate that to this example:  Let's say I am building an app similar to lost dogs, it's going to receive and store couple currencies (let's say NOT, TON and USDT), and same as lost dogs, at the end of the day, I am going to take a % for myself and distribute the rest to the winners at the end of the day, but the difference is that there is going to be 5-15x daily transactions and they are going to be mostly low value (1, 5 or 15$), I'd like to know what would be TX cost for users when doing those transactions, or at last an interval (like between 0.01 and 0.03 TON)?  my main concern is how much would each TX cost for the users (because I am unable to reverse engineer lost dogs contract to see what they are doing inside and taking much more than 0.017 TON, if that is their commission or they have some expensive operations in their contract). (reply to 92448)

Bryce: does anyone has wallet_highload_v2r2 contract source code and wrapper?

&rey: Around 0.03 TON per user's action (transaction tree). (reply to 92451)

Uncle: hy everyone

Uncle: how can i check on which line of smart contract is error occuring?

Kenny: Hi guys. I'm new to TON, and could anyone kindly help me understand the memory layout in TON? I know that memory in TON is based on cells. Unlike our computers, where the memory is based on bytes (or a large array of bytes). I know each cell can store up to 1023 bits, and can reference at most 4 other cells. As a result, we can only emulate the commonly seen data structures with some cells.  So am I working on a tree of cells, or on a DAG of cells? It seems that TON only limits the max number of cells one cell can reference, and it doesn't limit the number of cells which reference a cell.  The TON course says we are working on a tree of cells, but I think we are actually working on a DAG of cells. Which one is correct? Thanks!

Emma_dygli: /

&rey: DAG. "tree" is just commonly used as a simpler word (and since cells are immutable, there isn't that much of difference). (reply to 92469)

Mulalem: How can I activate my ton wallet

Mulalem: It says like this " Sorry, withdraw failed, please make sure your address is active, and try again ".

&rey: Looks like you got this message from a scam service. (reply to 92476)

Nerses: How can I get random data while deploying contract ? i dont want to use random or randomInt. in my architecture I need data like blockhash or something like that

&rey: Do you need similar contracts to have different addresses? (reply to 92485)

Nerses: i just need some data that can be modified using nonce and all that result use as ID.   for example ID = blockhash ^ nonce (reply to 92488)

Nerses: id will incremenatlly increase while blockhash can be used as randomness seed (reply to 92489)

&rey: You can use thirteenth c7 parameter: https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07. (reply to 92492)

&rey: (It's worth noting that this data is not that random or unpredictable IIUC.)

Nerses: Yeah in my case it's okay. Is there any example how to get data on chain ? (reply to 92494)

Samtek 💠: Suggest internship program to get experience for web3

Дмитрий: Hello, I have problem, may be someone can help me. When I run command export CC=clang && export CXX=clang++ && cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc) jn my vps it is comes to this [ 21%] Building CXX object tl/CMakeFiles/tl_api.dir/generate/auto/tl/ton_api.cpp.o and doesn't go any further

MZ: I use this code to transfer 0.1 USDT, but still transcation fails and getting 65535 Exit Error.  What can be a reason?

MZ: Here is the transaction: https://tonviewer.com/transaction/9a3a71385f3afec7a8ce1a51e3ef9299db76cd3ba9defbe8f3669d4d46b73eba.   I see there is 65535 Exit Code, but I'm not sure how to check more details about this error.  Any advices? (reply to 92510)

&rey: jettonWalletContract seems incorrect. (reply to 92508)

&rey: Not related to TON in any way. (reply to 92505)

MZ: Hmm, looks like it's Tether contract: https://tonscan.org/address/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs (reply to 92514)

&rey: But this is not jetton wallet, it is jetton master. (reply to 92516)

MZ: Hmm, I took that address from coingecko. How can I find USDT Jetton Wallet Address? (reply to 92517)

&rey: TON Cookbook shows how jetton wallet is derived from jetton master. (reply to 92518)

&rey: Someone still needs to pay for USDT transfer. Tonkeeper may do so, but it is not supported in TON Connect 2 yet. (Why not use TON itself, actually? Native token is easier processed...)

MZ: Sorry, I realized that you answered me in messages above already, so removed my message. (reply to 92522)

Evgenii: for those struggling with the issue related to ton-connect manifest not found - recheck your SSL certificate on the server where the manifest file is placed. in my case I forgot to put the certificate chain. browser check passed well and everything seemed well. turned out that the wallet's party has way more sensitive SSL validation. it's good idea to check from tonkeeper mobile acc built-in browser if your manifest file can be opened.

MZ: Btw. do you recommend to just get jetton wallet once using code from the cookbook and save it or I should do it everytime, because it can change? (reply to 92519)

&rey: Once. (reply to 92526)

&rey: No jetton systems are deployed which would change their code. Moreover, it would be incompatible with pretty much any contract.

MZ: I don't get it. There is a variable for jettonMasterAddress and it's okay I'll paste there USDT master address, but what is userAddress? (reply to 92528)

&rey: userAddress is tonConnectUI.account.address — whoever sends the token. (Jetton wallets are different for different users.) (reply to 92508)

MZ: I used this code and just get my wallet address finally. Meanwhile I expected to get USDT Wallet Address.  I thought it works similar to EVM, so: 1. I have USDT contract. 2. I use transfer function in USDT contact to transfer from wallet A, to wallet B.  So, I used in my code USDT contact address and expected to use a transfer function there and transfer tokens from wallet A to B.  How to do it properly? (reply to 92531)

&rey: No. In TON: user's USDT balance is stored in his separate jetton wallet contract. (reply to 92532)

&rey: So to use it message must be sent there.

Pibu: does anyone know about some articles/docs regarding running a local ton node? I'm starting mylocalton but I have no idea how to deploy my contracts to it. I'm using blueprint as well and I have the option to use a custom network but no matter what details I enter there it fails

MZ: Do you have any working github example where I can see jetton transfer code? (reply to 92533)

NPA120: It is an open source, mate (reply to 92537)

Pibu: here's a repo with reference jetton implementation https://github.com/ton-blockchain/token-contract/blob/main/ft (reply to 92537)

&rey: Wait, you had one? Just fix the jettonWalletAddress and it's going to be fine. (reply to 92537)

&rey: Oh. Also fix forward TON amount. To zero, for lowest fees.

MZ: Ok, now I have this code, so used code from Cookbook, to obtain jetton wallet address, but it still doesn't work. (reply to 92540)

&rey: response_destination := tonConnectUI.account?.address forward_ton_amount := 0

MZ: Not sure where to change forward_ton_amount to 0, but changed responseDestination as you said and still getting error.  But now error number is 48. (reply to 92543)

&rey: .storeCoins(toNano(0.05)) // forward_ton_amount => .storeCoins(toNano(0)) (reply to 92544)

MZ: Yeah, finally works! Thank you very much! (reply to 92545)

MZ: Btw. I'm not sure if you use this package: https://www.npmjs.com/package/@tonconnect/ui-react and if it's even official, but there is an error.   It connects properly when I run app on desktop, but it doesn't work in two cases:  1. When I try to connect using Chrome Responsive Mode (i.e. as iPhone 12). 2. When I try to connect when my app is open as Telegram Mini App on Telegram Desktop (macOS).  It even doesn't work on this official example: https://ton-connect.github.io/demo-dapp-with-react-ui/ (reply to 92545)

TON Bounty Bridge: ​TonPay (For Speedy, Safer, and Secured payments)  🏷 Developer Tool  Summary:Ton is the future of cryptocurrency and blockchain, as such, we need to develop a decentralized paym...  Created by abarukayya

Valamar.$888: Hi guys I wanna build my own Blockchain network do you have any suggestions especially on consusus

Valamar.$888: Consensus

Valamar.$888: And if you provide with some resources it would be great 😃

TON Bounty Bridge: ​Ton Review (Write, Read and Explore trusted reviews, polls and rating from real community)  🏷 Developer Tool  Summary:TonReview is a telegram mini app that will be serve as directory listings of all Apps, Games, and ch...  Created by abarukayya

Ali: Hi Can you guide me how I can develop ton network with Scheme language(r7rs)?

Ali: If it is as much as the introduction of an article or book or... it can help

Ali: Or if there are examples of smart contracts for the construction of the second layer network in the Ton network, it would be good

Ali: anyone? (reply to 92579)

— 2024-08-07 —

Anthony: Hey all, I am a fullstack dev, I do a ton of solidity development, going to get my hands dirty on the ton network documentation this week!

Anthony: My friends, which vscode extension do we use for fc files?

cai: "FunC Language Support" (reply to 92594)

Irwyn: Hi, I am using the sample stablecoin-contract repo from Ton-blockchain, how do i burn coins?

User<5183898074>: did 'https://sandbox-v4.tonhubapi.com '  crash?  I cant deploy the contract to the testnet because the network timed out

JC: Hello everyone, I am using tact for smart contract programming. Is there a way for me to get the op code in receive?  My scenario is: I want to check whether 12.34 USDT is passed in when the user calls deposit

Tanya: I am finding ton smart contract developer.

Brave: Anyone knows how to shorten ton wallet address like this? Preferably a reactjs solution

Snow Lee: JS have a substring function, use that (reply to 92614)

Brave: i thought there is some tonconnect sdk function etc.. (reply to 92615)

Snow Lee: don't overthink it, ton wallet address will return you a string, do whatever you want with the string (reply to 92616)

Rjx: Hi Team,  I’m experiencing an issue where the [TON_CONNECT_SDK] Bridge is intermittently reconnecting with a 5000ms delay. I’m using Toncenter with API keys from the free plan. The error does not occur continuously but happens randomly.  Could anyone provide insights into what might be causing this problem?  Thanks!

L: Anyone have your own idea about blockchain?

Mostafa: what are you searching for ? (reply to 92624)

L: I mean, blockchain project idea or something like this.. (reply to 92625)

Mostafa: yes - I know - this field is huge and there are a lot of concepts and things that you can do - what's your interest ?

L: I have solid experience with building dex, making trading bot and sniper bot... (reply to 92627)

Mostafa: DM pls (reply to 92630)

Rhonda: how to sign off-chain and verify in contract?

Rhonda: Is there an example?

&rey: Please look how wallet contracts work, they do exactly same. (reply to 92632)

Orion: How to solve this problem ton-http-api No working liteservers with ls_index=None, archival=None？

Kenny: Hi. I'm wondering if I can randomly access an arbitrary bit in a slice?  For example, if I want to read the 5th bit, I have to read the first 4 bits beforehead. I cannot jump to the 5th bit to see it's 0 or 1. Is it possible to do so?

sangmin: Is there a way to decode IN_MSG's body for transactions? I'm using toncenter API.

&rey: You can use SDSUBSTR opcode or similar. (reply to 92642)

Kenny: Thanks! But according to the FunC standard library [here](https://docs.ton.org/develop/func/stdlib#slice-primitives) it seems that there's no corresponding FunC function to perform SDSUBSTR. I'm not sure if I've missed something... (reply to 92645)

&rey: Then you can define your own!  slice __asm_substr(slice s, int offset, int len) asm "SDSUBSTR"; int get_bit(slice s, int offset) inline {     return s.__asm_substr(offset, 1).preload_uint(1); } (reply to 92646)

Kenny: Oh cool! Thanks a lot! 🫡

TON Bounty Bridge: ​взгляд на свап  🏷 Developer Tool  Summary:для декс:а) обратная совместимость свапа в моменте:  Created by u1tran

Bát Nháo: Help me how to put IAP Ton into Unity Game like WizzwoodsBot

Mao: How to convert address slice to string in funC?

Mao: It can be printed using ~dump.

Irwyn: anyone knows how to solve this issue?

Johnny Le: a parameter in deploy script is mising (reply to 92665)

TON Bounty Bridge: ​опциональное улучшение уровня безопасности  🏷 Developer Tool  Summary:заблокированная отдельным от пин [1] паролем [2] опциональная фоновая функция устанавливаемая в секу...  Created by u1tran

Er: Ehy guys , having a problem with the first step for the "Counter" contract example . Whenever i try to deploy it says that my wallet is not deployed even though tonscan i see the state not being inactive . Am i missing something on how wallet works ?

Totti: Hello, everybody. I wanna study how to develop telegram mini game like tapswap, hamster kombat and notcoin. What  should I start from?

Nerses: Is there way to get any data (Int type) from c7 register ? In my code logic that data will be used after deployment

Dave: Hey please what's the minimum amount of ton that can be transferred?

&rey: 1 nanoTON (though there will be fees > 100 microTON). (reply to 92673)

Hiroto: https://core.telegram.org/bots/webapps#launching-mini-apps-from-the-menu-button You can start with it (reply to 92673)

Dave: Haha (reply to 92675)

Dave: Thanks (reply to 92674)

Mohammad: Hey everybody I wanted to raise a number to the power of 1/10. Is it possible to get precise result? I cannot get enough accuracy using binpow function

Artem: const updateTransaction = (wallets, callback) => {     const inputAmountNano = inputAmount * 100;        if (isNaN(Number(inputAmountNano))) {       console.error("Invalid input amount");       return;     }        if (wallets.length > 0) {       const firstWallet = wallets[0];          const body = beginCell()         .storeUint(0xf8a7ea5, 32)         .storeUint(0, 64)         .storeCoins(inputAmountNano)         .storeAddress(           Address.parse("UQBOhE4qpB9px4eJWGh-g2GNtFik-U2w9YHkzvz74iXjPzry")         )         .storeAddress(           Address.parse("EQCcXKwYGCCZnzQj9vwwg8Y-F3d8H7cow-Mwgj8pTFruBfP8")         )         .storeUint(0, 1)         .storeCoins(1)         .storeUint(0, 1)         .endCell();          const newTransaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [           {             address: firstWallet.address,             amount: toNano(0.05).toString(),             payload: body.toBoc().toString("base64"),           },         ],       };          // Serialize the transaction and calculate the hash       const transactionCell = beginCell()         .storeAddress(Address.parse(firstWallet.address))         .storeCoins(toNano(0.05))         .storeRef(body)         .endCell();          const transactionHashBuffer = transactionCell.hash(); // This gives you the buffer of the hash       const transactionHashBase64 = base64Encode(transactionHashBuffer); // Convert the hash buffer to base64          // Set the transaction and pass it to the callback       const transactionWithHash = { ...newTransaction, hash: transactionHashBase64 };       setMyTransaction(transactionWithHash);       if (callback) callback(transactionWithHash);     }   }; Hello everyone, tell me how to get the address of this transaction

Karan: Hi guys im looking for telegram developers, DM if you are experienced with tg and ton development

Thea: Let's chat (reply to 92686)

&rey: You can't do so offchain. (reply to 92685)

Er: Why does is says that my wallet is uninitialized ? I've received and sent some testnet coins and the explorer says wallet v4r2

&rey: Probably you haven't sent testnet TON from there. (reply to 92693)

Marc: Can anyone explain what are the benefits for business on developing their infrastructure on ton?

Er: I have sent some Tons through the telegram bot , if i look my wallet in the explorer it says it's active

&rey: Are there any technical docs, audit results, so on? (reply to 92694)

meomeocoj | Mike: We are working to Zelic to audit our contract (reply to 92700)

&rey: What infrastructure do you consider? (reply to 92696)

Er: Do i need so send something when i try to deploy my smartcontract directly from there to make it active ?

Marc: I am very new to blockchain and am not sure. I just want to know what are the benefits of using ton instead of using services like stripe and centralized cloud architectures (reply to 92702)

meomeocoj | Mike: We are on progress to docs stuff. Bassically, we implements based on IBC and RSQuad idea. (reply to 92700)

&rey: On TON, some processes can be run automatically, without you allocating any server to handle it. Also, if users can sensibly interact in some ways, blockchain can handle that again without any backend (therefore, without possibility to block such interactions in a centralized way). (reply to 92705)

Nerses: can be passed to random()  arguments in hex ? https://docs.tact-lang.org/cookbook/random#:~:text=number%20%3D%20random(1%2C%2012)

Nerses: or only lower bound (reply to 92708)

Jacob: Hi, Please DM me (reply to 92686)

Marc: does it mean it can be cheaper for businesses than running on centralized architectures? (reply to 92707)

&rey: It can be more stable. (reply to 92712)

Richard: Does anyone know anything about the TG Coin Creator App. We are trying to create a coin for a local community to use. I have Minted 1000000 coins called Stones but not sure how we access the coins. Do we need a custom Wallet built to access these coins in order to transact with them.

Valamar.$888: Guys should I use A PBFT consensus for my Blockchain network with a rate higher than (n-1)/3

C: Hello Karan I have rich experience with TG bot and TON development I can work with you (reply to 92686)

Marc: Like stable how? Isn't aws already pretty reliable? (reply to 92713)

Richard: Thanks. We have got to the point of minting the coins but not sure where we go from here. (reply to 92721)

Richard: If I go into Edit Metadata it shows that I can add a Coin Logo and then has Start Mint again and asks me for more Ton. But does that mean I am Minting a whole lot more coins or is that part of the process (reply to 92721)

Richard: Sorry I thought that was a reply to my question. My Bad (reply to 92721)

Nerses: for this simple code I get compile error   get fun greeting(): Int {         let rand: Int = random(10000000000000000000000000000000000000000000000000000000000000000000000000000,99999999999999999999999999999999999999999999999999999999999999999999999999999);         let result: Int = (rand ^ 1);         return result;       }  but have no idea what causes that. Any hints ? here is the error message Syntax error: expected ")", "{", "(", "!!", ".", "%", "/", "*", "|", "&", "<<", ">>", "-", "+", "&&", "<=", "<", ">=", ">", "==", "!=", "?", or "||"

Vladimir: Post all the code, it looks good. (reply to 92728)

Nerses: I just wanted to test something so it is the only function in code. import "@stdlib/deploy";  contract HelloWorld with Deployable {     init(){     }               get fun greeting(): Int {         let rand: Int = random(10000000000000000000000000000000000000000000000000000000000000000000000000000,99999999999999999999999999999999999999999999999999999999999999999999999999999);         let result: Int = (rand ^ 1);         return result;       }         } (reply to 92729)

Vladimir: compiled like a charm (reply to 92730)

Nerses: which version of compiler do you use ? (reply to 92731)

Ricky: Me and my team are building an on chain platform on TON, where can I get on touch with the ecosystem team of TON?

Vladimir: "devDependencies": {         "@tact-lang/emulator": "^4.3.0",         "@ton/blueprint": "^0.22.0",         "@ton/core": "^0.56.3",         "@ton/crypto": "^3.2.0",         "@ton/sandbox": "^0.20.0",         "@ton/test-utils": "^0.4.2",         "@ton/ton": "^13.11.2",         "@types/jest": "^29.5.12",         "@types/node": "^20.14.10",         "jest": "^29.7.0",         "prettier": "^3.3.3",         "ton-abi": "^0.0.1",         "ts-jest": "^29.2.2",         "ts-node": "^10.9.2",         "typescript": "^5.5.3"     } (reply to 92733)

Ricky: I've been reaching out to a lot of folks from TON foundation but none of them seem to reply!

&rey: Could you explain more, please? (reply to 92739)

User<7483137682>: you are right this guy is scammer dont join some link provided by him and dont share the CV (reply to 92739)

Tanya: you are real scammer. Show the evidence. (reply to 92739)

Tanya: you are using 2 telegram account. It's real scam (reply to 92743)

H: hi developers , i connected wallet in nuxt3 i access to tonconnectui and tonconnect but how do i can get sender to put in in wrapper to be able use my contract ??

MZ: @pcrafter I use a code from Cookbook to parse USDT wallet transactions, but the problem is that op of each transaction is equal to 395134233 which is 0x178d4519 in hex. As I see it corresponds to internal_transfer.   Meanwhile the code in the Cookbook has "if" only for 0x7362d09c which is transfer_notification.  Do you have any example of how to parse internal_transfer or should I do something differently?  I even tried to set destinationAddress in two fields on the screen instead of "tonConnectUI.account?.address" in response, but still doesn't work.   Here is the USDT Ton Wallet I'm trying to scan: https://tonviewer.com/EQCywXl0qspc31U5s_oY7KaLc43M-4s2SVPoa5vJnA-dg_1h

Kryptonite: can someone please let me know what should be my rpc url in mobile app config for tonkeeper testnet

&rey: Well, that is correct, you should adapt code instead to parse internal_transfer-s. (reply to 92749)

MZ: So why is there an example for transfer_notification instead of internal_transfer in the cookbook if USDT is I guess most used Jetton on TON?  When does Jetton use transfer_notification? What it depends on? (reply to 92752)

Nerses: could you please give hint how to use random in case I need that value to be assigned global variable ? I tried to do it with this approach  import "@stdlib/deploy";  contract HelloWorld with Deployable {     init(){     }               rand: Int = random(10000000000000000000000000000000000000000000000000000000000000000000000000000,99999999999999999999999999999999999999999999999999999999999999999999999999999); }  but got error Cannot reduce expression to a constant integer (reply to 92735)

&rey: All jettons use transfer notifications to user's wallet, if sender provides money to do so. Also, internal transfers MAY have different format in another jettons. (reply to 92753)

Yannick | Chorus One: I want to deploy nominator-pool contract with github.com/xssnick/tonutils-go.  I reproduced the example from https://github.com/xssnick/tonutils-go/blob/master/example/deploy-nft-collection/main.go  When I try to deploy the contract, the initialization returns code 9 (cell underflow): https://testnet.tonviewer.com/transaction/0fac47109c455157d26c26ced0f039eaa8a92d33d9e6df27aecc1e033a0404c9  I understand the data I pass to the contract is malformed. Any ideas what's wrong ?  func getNominatorPoolData(ownerAddress *address.Address) *cell.Cell {  emptyDict := cell.Dictionary{}   config := cell.BeginCell().   MustStoreAddr(ownerAddress). // should be uint(addr, 256) but doesn't work too   MustStoreUInt(40, 16).   MustStoreCoins(1).   MustStoreCoins(10000).   EndCell()   data := cell.BeginCell().   MustStoreUInt(0, 8).   MustStoreUInt(0, 16).   MustStoreCoins(0).   MustStoreCoins(0).   MustStoreRef(config).   MustStoreDict(&emptyDict).   MustStoreDict(&emptyDict).   MustStoreUInt(0, 32).   MustStoreUInt(0, 256).   MustStoreUInt(0, 8).   MustStoreUInt(0, 32).   MustStoreUInt(0, 32).   MustStoreDict(&emptyDict).   EndCell()   return data   expected data from contract: https://github.com/ton-blockchain/nominator-pool/blob/main/func/pool.fc#L180

MZ: I use this code to do USDT transfer. Then scan destination USDT wallet address using   const transactions = await tonClient.getTransactions(myAddress, {     limit: 5,   });  and all transactions have op === 0x178d4519 - so they are internal_transfer instead of transfer_notification.  How to get transfer_notification transaction then? (reply to 92757)

Anonicz: i can pay. pls help me

Karan: Hi guys im looking for ton and tg developers DM me

I'm: Hello everyone, do you know why when I transfer jetton, I set the sender_address as wallet receive the remaining TON after transaction success. I got remaining TON back with every jetton transfer. But when I check jetton_of_receiver_address it also increase TON balance every time the wallet receive jetton token. Thank you for support.

User<7483137682>: Hi @daisukenaratan  are you using the lite server as development only node server?

&rey: Please check forward amount = amount of TON you send to destination wallet. (reply to 92775)

Nerses: I use in my contract fromSlice method.I get in this way message and send it to another party which cant execute it (exit code 130 Invalid incoming message) I think the main problem comes from wrong layout although cant figure out what is wrong. Couls someone give any hint or enlight how I can fix this ? here is the message and how i create layout which later is passed pas parametr to fromSlice https://gist.github.com/nerses-asaturyan/d4dc102cd9d20a24204a4f6dcc198aa0

Artem: const updateTransaction = (wallets, callback) => {     const inputAmountNano = inputAmount * 100;        if (isNaN(Number(inputAmountNano))) {       console.error("Invalid input amount");       return;     }        if (wallets.length > 0) {       const firstWallet = wallets[0];          const body = beginCell()         .storeUint(0xf8a7ea5, 32)         .storeUint(0, 64)         .storeCoins(inputAmountNano)         .storeAddress(           Address.parse("UQBOhE4qpB9px4eJWGh-g2GNtFik-U2w9YHkzvz74iXjPzry")         )         .storeAddress(           Address.parse("EQCcXKwYGCCZnzQj9vwwg8Y-F3d8H7cow-Mwgj8pTFruBfP8")         )         .storeUint(0, 1)         .storeCoins(1)         .storeUint(0, 1)         .endCell();          const newTransaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [           {             address: firstWallet.address,             amount: toNano(0.05).toString(),             payload: body.toBoc().toString("base64"),           },         ],       };          // Serialize the transaction and calculate the hash       const transactionCell = beginCell()         .storeAddress(Address.parse(firstWallet.address))         .storeCoins(toNano(0.05))         .storeRef(body)         .endCell();          const transactionHashBuffer = transactionCell.hash(); // This gives you the buffer of the hash       const transactionHashBase64 = base64Encode(transactionHashBuffer); // Convert the hash buffer to base64          // Set the transaction and pass it to the callback       const transactionWithHash = { ...newTransaction, hash: transactionHashBase64 };       setMyTransaction(transactionWithHash);       if (callback) callback(transactionWithHash);     }   }; Hello everyone, tell me how to get the address of this transaction

Chris: Hello devs,   I am a crypto marketer and KOLs manager. We are recruiting a team of experienced devs for a ton ecosystem game (like tapswap, hamster and notcoin) If you are working on any existing projects or want to work with us from scratch we offer a great co-working space and environment with good monetary value for freelancers or payscale devs.   Budget is good kindly let me know if you are interested by sending a CV and LinkedIn (if available)  Note : We are also making good investments via our VC branch and if you have ideas or existing projects we would be glad to arrange meeting for grants/scholarship.  Dm again if i missed your text

Vesper: Hi dev someone already experimented ECDSA instead of ed25519 on Ton ?

Kryptonite: can someone help to understand what might cause this error: Error: Unable to execute get method. Got exit_code: -13     at TonClient.runMethod (TonClient.js:43:19)

Apple: Hello

David: Hello!

Apple: Hi, I'm very interested in your custom wallet development.

MZ: In the cookbook there is an example of how to parse transfer_notification (0x7362d09c), but where can I find information of how to parse internal_transfer (0x178d4519)? There is just binary code in body, so I don't know how it's structured etc.  Alternatively what should I do to have transfer_notification in my transactions? (reply to 92757)

Dinesh: hello everyone. I have a mobile app. which is run by a bot and it has thirdweb connectivity. Opening it in the safari browser clicking on metamask redirects me to metamask. But when I go to the same link via the telegram bot, it doesn't work as expected. Is there a way around to fix it? Or this is how it is supposed to work?? Any help is much appreciated!!!

Richard: We are looking for a developer that can create a custom wallet for us for use in local communities with our own coin. If you can help with this and give us some sort of estimated cost then please DM me. Thanks

Hiroto: dm (reply to 92821)

к.: Hello guys, I was studying TON contracts permanent storage and I reached that each contract/actor has a cell as it's storage (but I didn't find any references of it on ton core source code to be honest). Now the question is how does FunC store a hashmap or an array in this given storage exactly?  How does it retrieve it?   Also, are slice and dict the same data structures as array and hashmaps in FunC?

к.: Also there are some guides and threads on ton answers and ton research about it, but still there are no exact low-level details of it. They mostly explain how to use them in FunC.

User<7192644220>: dm me (reply to 92821)

Apple: I'm very interested in this position. Actually, I'm a full-stack blockchain developer and experience with Smart contract like Solidity, Rust, and func (reply to 92821)

&: Does anybody have CRUD operation code for dictionary in FUNC?

— 2024-08-08 —

^_^: I can d it, Please DM me. (reply to 92821)

alex: That's very interesting idea! (reply to 92821)

C: dm (reply to 92821)

Rodolfo Azevedo: Hey folks, can I send a transfer from a wallet using v4 to a wallet using v3?

Rodolfo Azevedo: btw, Ton blockchain is down? It shows my wallet is active, but when I execute a transfer using JavaScript SDK it says my wallet was not deployed or I get error 500.

Rodolfo Azevedo: Testnet

Rodolfo Azevedo: Ok, the issue was on my side. It's solved. Good night everyone!

jojo: Does anyone have the writeup for the ton blockchain hacking challenge?

Davis: I check code examples in docs and found this code:  if (toncoinAmount.gte(toncoinBalance)) {     console.log('there is not enough Toncoin balance to process the Jetton withdrawal'); }    Why is gte used instead of gt? If they are equal, then the balance should be enough. Why can this be done?  Source: github+toncenter/examples/blob/main/withdrawals-jettons.js#L168-L170

Haint: just a guess, if you use mode pay fee separately from msg value, then you still need some ton in your balance after deducting the amount to pay for transaction fees (reply to 92864)

Asaki: When I use ton/ton client to call the get method of a contract, it occasionally returns a 292 exit code. Does anyone know what this error means?

I'm: As your guide, I changed .storeCoins(toNano("0.05")) in forward amount and the transaction was failed (0.05 is the TON that I send for the fee). I try to set it to "0.01" but I loss for 0.01 TON fee for other  new message. (reply to 92777)

I'm: Hi everyone, Can I use highload wallet to check TON and JETTON balance  for multuple address in one request? Thank you for supporting.

David: Hi guys, does anyone have an example showing how to connect to @wallet from a tg bot (not mini app)?

sunyoki: Can't identify jetton

sunyoki: what's the reason🤣

sunyoki: https://testnet.tonviewer.com/kQBuTm5pacc3zSqlXTI5kKaGcbHbrEWZJ7e_bITqkLGaTCJa

Ajitesh: UQDizlkDMzCNbmLYKB5m8zNf3G5v4pwDC5oE0C2HMJ40Hyk4

User<6034345711>: Hello everyone asking for help, on my unity web3 game , The connect wallet button on the top right corner, I want to move this connect wallet button to go somewhere else, I can customize where to put it myself, how should I do it?

Ian: Hi guys. I need help. Are there global chat moderators here?

Krypto Whale 🤖: Sure mate, do you need one (reply to 92894)

Ian: Yes (reply to 92896)

Baco: Find out it here   https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation (reply to 92892)

Joel: Lol idk which word is that is lol

Joel: Hey guys. I’m building some serious financial primitives on TON. No air-drop narratives, no useless games, just pure finance stuff. Lending, swaps, derivatives, synthetic assets and stuff.   I’m trying to get in touch with anyone who’s interested in building defi together on TON. Ideally, you should be a swiss army knife: func + fullstack. Here’s my github handle: 9oelm. Lmk if anyone’s interested.

Rjx: Hey guys, error: [TON_CONNECT_SDK] Bridge reconnecting, 5000ms delay. I am getting this error in my TG bot while using it, This issue does not occur continuously but intermittently. Can someone please assist me with this?

&rey: 1. Check out specific jetton you're listening to, its source code provides TL-B for internal_transfer. 2. Listen to transactions on common wallet, not on jetton wallet (you'll lose ones with zero forward amount) to get transfer_notification. (reply to 92816)

&rey: What do you mean "to check balance"? To do so you don't need any smart contract. (reply to 92877)

&rey: Contract only knows. Maybe it's specified in its code or build artifacts? (reply to 92873)

&rey: I guess because there might be storage fee, which is hard to estimate. (reply to 92864)

Matthew: i see your face (reply to 92891)

MZ: Thanks. What forward_ton_amount means in fact? Does it mean that I send also some TON to a recipent except Jetton tokens?  What is the main utility of forward_ton_amount? (reply to 92916)

Joel Mun: Its used for transfer notification (reply to 92922)

Joel Mun: Its another message that is sent from the message to the jetton recipients wallet

Joel Mun: For example, u might want to notify some other contracts about the jetton transfer

Joel Mun: In that case set forward ton amount and forward ton payload  as needed

MZ: Oh ok. I see. One more question.   @pcrafter said: "Check out specific jetton you're listening to, its source code provides TL-B for internal_transfer."  Here is the source code of the jetton I use to transfer and scan: https://tonscan.org/address/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs#source  How can I find binary structure of internal_transfer body to know how to parse it? (reply to 92926)

&rey: It wasn't embedded within contract, but here is matching file: https://github.com/ton-blockchain/stablecoin-contract/blob/62f661d79012a259c0110dce611dafc31359be78/contracts/jetton.tlb#L67-L74. (reply to 92927)

MZ: Thanks. Btw. is there minimum TON amount that I should set in forward_ton_amount to get notification? (reply to 92928)

Joel Mun: it really depends on what the transfer notification will do to the contract receiving the msg (reply to 92929)

Alex: Hi everyone. I’ve made a Jetton transfer from address A to address B. I’m trying to fetch last transfers from the address B and I receive only internal transfer from address C to B (address C has owner as address A). How I can get that owner address?

MZ: Just want to have notification to parse it like in this example: https://docs.ton.org/develop/dapps/cookbook#how-to-parse-transactions-of-an-account-transfers-jettons-nfts (reply to 92930)

Joel Mun: the jetton wallet test suite has 0.05 as a forward amount for a little payload of 128 bits. https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/sandbox_tests/JettonWallet.spec.ts#L273 it's a good strategy to adjust the forward amount to see below which amount it throws run out of gas error. (reply to 92933)

&rey: 1 nanoTON is OK if you parse that offchain. (reply to 92933)

&rey: 0.05 TON or like if destination contract parses forward payload onchain but doesn't make further jetton transfers.

Lucas: Ok, well how do you start the auction again for an expired domain, I can't seem to find what should be (and probably) is somewhere here already to find... (reply to 91279)

&rey: https://t.me/tondev_eng/71518. (reply to 92937)

Lucas: thanks, amount is based on the domain length, right? (reply to 92938)

sangmin: Can you tell me how to decrypt msg in the transaction? plz...

MZ: Here: https://docs.ton.org/develop/dapps/cookbook#how-to-parse-transactions-of-an-account-transfers-jettons-nfts (reply to 92941)

sangmin: thanks !  Is there only a way to decrypt using tonweb lib? Is there a way to use ton-http-api's API?? (reply to 92942)

User<6034345711>: Hahaha (reply to 92921)

MZ: You can check also this, but I haven't used it: https://docs.ton.org/develop/dapps/asset-processing#get-incomingoutgoing-transactions (reply to 92943)

Ruslan: With ton-http-api you can only collect data, but you also need to decode it. (reply to 92943)

sangmin: Thank you! I'll check it out. (reply to 92945)

sangmin: I am worried because the message is displayed well in TON transmission using ton-http-api, but the message is not displayed in Jetton transmission. (reply to 92946)

Ruslan: Do you mean a text comment of Jetton transfer? (reply to 92949)

sangmin: yes ! (reply to 92950)

Ruslan: Okay, for this the only way is to decode it using tonweb or any other library (tonsdk, tontools, pytoniq, @ton/ton-core, tonweb)

sangmin: Is there a library available in java as well??

MM: Hello, everyone Is there anyone who can solve this problem? This is not matter of my code My code works find on the other pc

SP: "in_msg":{ "@type":"raw.message", "source":"EQANsvIDPk22MqkDtk-TCeBTW1MDz5PP-Gy35WVGOZ15N1LF", "destination":"EQClRL5UpS51_wm1Vmzs7GKquvCOZY7C6tv_PmrNOI0wENXF", "value":"20000000", "fwd_fee":"461337", "ihr_fee":"0", "created_lt":"24325525000002", "body_hash":"4nIC4tpC2aRMnGymkSN/Z72vYV+IqClvje96czP1d00=", "msg_data":{ "@type":"msg.dataRaw", "body":"te6cckEBAwEAVAACDyv1xOGBkAADAQIAQ7+NsvIDPk22MqkDtk+TCeBTW1MDz5PP+Gy35WVGOZ15N8AAQ7+QLZYDBkkCtsmxcRJqWPAIw81owF79ShN7vigMsj81pMDn44rX", "init_state":"" }, "message":"K/XE4YGQAAI=\n" },  how can we extract op_code from msg data?

Er: Ehy guys , is there any API source to get info from smart contract ?

Autumn: Is darttonconnect still under maintenance?

Er: Also are endpoint free ? Looking around and most of the "public" rpc give limited request  , can you suggest me one ?

&rey: Time is set incorrectly on that computer. (see: last instructions are NOW, LEQ, THROWIF 136) (reply to 92955)

Amir: -' (reply to 91602)

&rey: Orbs for mainnet works fine, without API keys and without rate limits. (reply to 92966)

I'm: Check TON balance or Jetton balance. Now, I use API from toncenter to check balance of the address. But 1 address need to call one request. So if I have to check 100 addresses, I have to use 100 requests. Is there any way to check 100 balance of addresses in one request?. Thank bro (reply to 92917)

&rey: I think you need tonapi here, with their /v2/accounts/_bulk request. (reply to 92972)

Nerses: @pcrafter would you please take a look ? I use in my contract fromSlice method.I get in this way message and send it to another party which cant execute it (exit code 130 Invalid incoming message) I think the main problem comes from wrong layout although cant figure out what is wrong. Here is the message and how i create layout which later is passed pas parametr to fromSlice https://gist.github.com/nerses-asaturyan/d4dc102cd9d20a24204a4f6dcc198aa0

Think: Does anyone want to help in building a game my designs are complete

Er: As you know is there any API to retrieve data from smart contract such as getters or execute msg ? (reply to 92971)

&rey: Getters = https://toncenter.com/api/v2/#/run%20method/run_get_method_runGetMethod_post. (reply to 92982)

I'm: Thank bro. It works. I can check TON balance multiple addresses in a request.Hi, may I ask more question.  Can I withdraw TON balance in my jetton wallet? (reply to 92973)

&rey: In common implementations, this is impossible. (reply to 92984)

Er: Oh thanks , whare are the method and the stack referring to in the query parameter ? (reply to 92983)

I'm: Ok bro. Because when I use MyTonWallet app or use testnet to send jetton to other address. It also send around 0.01TON to receiver_jetton_address. It is so wasted money when I send to 100 or more addresses. Thank bro support. (reply to 92986)

Anton: Hi, Could you please help me? I can't parse the payload in onBounce; it fails on owner_address.    var msg = begin_cell()                 .store_uint(0x18, 6)                 .store_slice(tier_address)                 .store_coins(gas::min_tons_for_withdraw)                 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)                 .store_uint(op::claim, 32)                 .store_uint(query_id, 64)                 .store_slice(owner_address)                 .store_coins(earnedAmount)                 .end_cell();              send_raw_message(msg, 1);  () on_bounce (slice in_msg_body) impure {      in_msg_body~skip_bits(32);        load_data();       int op = in_msg_body~load_uint(32);       if (op == op::claim) {         int query_id = in_msg_body~load_uint(64);          slice staking_owner = in_msg_body~load_msg_addr();         int earnedAmount = in_msg_body~load_coins();          storage::earned += earnedAmount;         save_data();      } However, if I remove owner_address from the payload, everything parses successfully.   If the transaction doesn't fall into onBounce, then both owner_address and earnedAmount are successfully parsed on the receiving contract  if(op == op::claim) {         slice staking_owner = in_msg_body~load_msg_addr();         int claim_amount = in_msg_body~load_coins(); }

&rey: Bounced message is cut to 256 bits (+ 32 bits for 0xFFFFFFFF opcode), and even one address usually takes 267. (reply to 92993)

Anton: Thanks a lot (reply to 92995)

&rey: Since staking_owner does not influence your actions, you should swap it with earnedAmount and read latter only.

Rhonda: How to manually create a sender?Guys, help me.

&rey: Like that: https://github.com/ProgramCrafter/wallet-contract/blob/c4e9271abae8abe554a82e7d34f8c87b073acd8e/wallet-inplug-v2.ts#L231-L242. (reply to 93000)

Er: Only get method are retrievable ? Is it possible to query also execute method from a smart contract ?

&rey: Well, you can emulate specific message to contract via tonapi. (reply to 93007)

Er: But this means i should already know the message before emulating it right ? (reply to 93010)

Tanya: my code is not working well. contract.sendTransfer is not called. guys, pls help me

Grigoriy: Hello everyone, I can’t figure out what the return value of f? is?  var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);  This is batch deploy of new nfts   And where is the value cell from the ton documentation lost? (cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";

Nerses: how in TACT i can read b_0 and uint from this Cell ? beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell()

George: Hey everyone!  My name is George. I'm developing Radar, a service for analyzing Telegram Mini Apps.  Here is a short brief overview of what Radar currently offers: – A list of all mini-apps and bots categorized by "New", "Trending", and "Top"; – Historical data on MAU (Monthly Active Users); – Links to channels and communities; – Coming soon: keyword search and category filtering.  Open Radar: @radar_tg_bot

Apple: I'm very interested in this position. Actually, I'm a full-stack blockchain developer and experience with Smart contract like Solidity, Rust, and func (reply to 92908)

User<69210164>: hello hello everyone!   I have a quick question about TON domains, I hope this specific chat is relevant to ask one: How can you restart auction for an expired domain? The support told me to search here, but all 60 search results are not helpful at all and I can't find any details about it here.  I'm willing to pay $20 with an escrow/middleman for someone who helps me successfully

sheh: Hello everyone, I want to deploy a contract that will transfer funds to another address when they are received on the TON account  1 - Does the account need to be active to deploy such a contract on it? 2 - And as I understand it, in order to do this, I need to deploy the contract to the account from which I want to make transfers when they are received?

Max: [ 0][t 1][2024-08-08 14:17:26.973973471][Status.h:559][!Tonlib][&status_.is_ok()] [Error : 500 : LITE_SERVER_NOTREADY: cannot load proof link for (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF : not in db(during last block synchronization)]  Seen a few similar errors in the chat, did anybody manage to solve it?

Max: toncenter http-api v2 (reply to 93050)

Keep: Hey everyone.  Can someone send a link or ready smart contract example for paid mint of nft collection? The task is to create some NFTs which contract will deploy after payment from buyer's side.

Ruslan: Hello, you are trying to query an old block and you node is not an archival node. Which method gives you this error? (reply to 93050)

Max: Hi!  My both Mainnet and Testnet nodes are Archive, just installed and synced to the chain tip. And I'm not querying anything yet, this are the logs from the https://github.com/toncenter/ton-http-api while it just runs and does some requests in the background. (reply to 93055)

Max: [ 3][t 5][2024-08-08 14:28:55.408612989][liteserver.cpp:2593][!litequery] performing a getBlockProof(4097, (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF, (-1,8000000000000000,39560144):739699086F429A2091EA211FA8BAFA966E4C362DBD549AC5CC49A86174855903:FCA987E05FD54CC65915381DF50864F59CE933E207FF810E7514D66F9459D1CC) query [ 3][t 5][2024-08-08 14:28:55.410261951][liteserver.cpp:2686][!litequery] continuing getBlockProof(4097, (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF, (-1,8000000000000000,39560144):739699086F429A2091EA211FA8BAFA966E4C362DBD549AC5CC49A86174855903:FCA987E05FD54CC65915381DF50864F59CE933E207FF810E7514D66F9459D1CC) query with a state for (-1,8000000000000000,39560144):739699086F429A2091EA211FA8BAFA966E4C362DBD549AC5CC49A86174855903:FCA987E05FD54CC65915381DF50864F59CE933E207FF810E7514D66F9459D1CC [ 3][t 5][2024-08-08 14:28:55.410311881][liteserver.cpp:2764][!litequery] constructing a forward proof link from (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF to (-1,8000000000000000,34837578):E418B3D9F3EA2953677CF9234EA9420C582243CF7D7D5AA98D117097917DC254:319A65A86D2D0BF4451E9982EF93C02BBCF99017215542D1B89A30BFC6DD3194 [ 3][t 3][2024-08-08 14:28:55.410405571][liteserver.cpp:84][!litequery] aborted liteserver query: [Error : 651 : cannot load proof link for (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF : not in db]   interesting, these are the logs from Mainnet Archive node

Ruslan: Ah, okay. In background ton-http-api sometimes checks whether the node is an archival one or not

Ruslan: If you are able to query data from the ton-http-api, then just ignore these errors.

&rey: Please try searching in this chat. In particular, I've posted the solution. (reply to 93039)

Max: But can it work if all api workers are dead due to this error? (reply to 93059)

Ruslan: No, it can't

Ruslan: How to update the init_block?    Get latest masterchain block with getMasterchainInfo, then use workchain+shard+seqno to getBlockHeader. From block header you need to get new_seqno from "prev_key_block_seqno" field.    After this, put workchain+shard+new_seqno (workchain and shard will be the same) in getBlockHeader. The necessary info is in "result.id" field.    Finally, remove double quotes in shard field. (reply to 93064)

Ruslan: In private/mainnet.json there is a section init_block. Update this section by the instruction above. (reply to 93064)

Haint: hey man, what's the use of set_c3 after running set_code? also what does .bless() do?  set_code(new_code); set_c3(new_code.begin_parse().bless()); (reply to 93063)

Nguyen: Hi how can I parse Jetton balance type BigNumber to int or float

Haint: Number(balance) (reply to 93070)

Nguyen: my balance is 0.24 in Tonkeeper, but it return 241903. How can i get exactly 0.24 (reply to 93071)

Haint: divide it by 1000000000 (10^9) (reply to 93073)

Nguyen: It has to 10^6 @@! (reply to 93074)

Haint: yes depends on the decimals (reply to 93076)

Haint: your jetton master might have 6 decimals, in that case divide by 10^6

Nguyen: thank you sir

Max: Interesting... According to your explanation, the init_block http-api refers to is pruned, but I have both nodes Archival. Maybe during the node deployment "something" went wrong and the ledger got corrupted, idk.  I will be installing a few more fresh nodes, will test it and get back here. (reply to 13508)

&rey: Functions without inline or inline_ref are taken from new code once set_c3 is run. (reply to 93069)

IBM: Hello there

IBM: Is there anyone who can assist me in priv?

Tanya: ? (reply to 93089)

IBM: I need to invoke the true burn function

&rey: Send (begin_cell()     .store_uint(0x595f07bc, 32)  # burn opcode     .store_uint(0, 64)     .store_coins(burn)     .store_address(your_address)  # for excess TON return     .store_uint(0, 1)     .end_cell()) to your jetton wallet. (reply to 93091)

Keep: I am looking for a developer to help me create a paid minting process for my NFT collection. This collection will consist of 5,000 identical NFTs (the same image). There needs to be a website where users can connect their wallet and a "mint" button that initiates a transaction for, say, 1 TON per NFT. Once the transaction is completed, the smart contract should create the NFT and send it to the user who paid, while transferring the TON to the owner.  Budget for that up to 400$  Please dm me if you did it before and cab do it.

@Bored 🐵: Hi, I can help you (reply to 93096)

Nico: Hi

Haint: thank you in a sharding architecture like jetton wallet, is there anyway to do set_code efficiently (without manually upgrade every single one) or it is a bad idea? (reply to 93084)

Keep: Can any admin from here be a guarantor/escrow of deal?

&rey: Changing code of jetton wallets doesn't seem a good idea. (reply to 93102)

User<6059084492>: hey could anyone help me with tonconnect? if anyone has a function to just connect to a tc:// link using only the seed phrase send it to me pls

Apple: I can develop (reply to 93096)

Anthony: Best way to learn ton development my friends?   Been doing ton spreedrun and the other tutorials on the documentation

Akachi: https://testnet.tonviewer.com/transaction/3ed050632bca4aed60ce6d7cbd9416b80d58da13afc9fd9a21b3a885ea16d8aa How can I check why the tx is failed?

User<6059084492>: the contract u are interacting with is out of gas (reply to 93133)

H: hi , how can i get the address_1 from res in »»»»»»  res=Address.parse(address_1)

Akachi: Thanks, so I need to send more TON ? (reply to 93134)

&: y (reply to 93148)

H: solved  :   Address.parse(address_1).toString(args= {         urlSafe: true,         bounceable: true,         testOnly: true,     }  ) (reply to 93138)

Kunaal | Hire AI Agents |: Any builder from India?

yarik: i can weld (reply to 93153)

Akachi: It works thanks (reply to 93149)

quartz: /warn (reply to 93193)

— 2024-08-09 —

User<6984952426>: When I tried the TON app, I was able to use the in-app services without signing up or logging in, just by pressing the "play" button next to the chat box.  How can I verify user's information?

Degen: Mine minted NFT is showing unverified NFT on ton keeper, why？ How to publish a verified NFT

Tom: Hi, where i can faucet usdt testnet ?

Miss Siyu: Hi, @ton/ton How can I switch to wallet v5 r1?

Matthew: Is it ok to have lists in a smart contract?

Miss Siyu: No

Matthew: yes it is. because sometimes you need multiple references of the same smart contract

Miss Siyu: My TonKeeper wallet is W5, how do I switch to W4?

Miss Siyu: Because @ton/ton doesn't have a V5 contract

Alex: TON should place anonymity and privacy on its road map to be complete... How do we get there?

Matthew: greetings my fellow indians

NICK: Is there any detailed guide available how to host .ton websites?

Daniel: hey guys, im trying to figure out what is this 0028 prefix created by Cell for e.g.      #DEBUG#: s0 = CS{Cell{00285893b5a76c3f739645648885bdccc06cd70a3cd3} bits: 0..160; refs: 0..0}     #DEBUG#: s0 = CS{Cell{0028ff6cb952589bde862c25ef4392132fb9d4a42157} bits: 0..160; refs: 0..0}     #DEBUG#: s0 = CS{Cell{0028114de8460193bdf3a2fcf81f86a09765f4762fd1} bits: 0..160; refs: 0..0}  as you can see all of them has this 0028 prefix is which is 40 in decimal which seems to signify the length of the following bytes which is 20 bytes (40 characters)  this prefix seems to be automatically added by Cell structure and if so do you know where in the docs is it stated?  also somehow related qn when i try to log the cell structure i get something like this      x{C7_}      x{2_}       x{2_}        x{2_}         x{2_}          x{1624ED69DB0FDCE5915922216F73301B35C28F34E_}          x{3FDB2E549626F7A18B097BD0E484CBEE75290855E_}         x{2_}          x{04537A118064EF7CE8BF3E07E1A825D97D1D8BF46_}          x{041E8021ACCB5E825DE49A88144C761CC74E72FAE_}        x{2_}         x{2_}          x{2320ACBF60BEBB49C47566BC3C926745B9C9BDACA_}          x{046CE5D5B0109106F9B61942DA6D53AF9C5788D0E_}         x{2_}          x{153396D34D23EDD2E563A259B8BB0F6F525629F36_}          x{0579F2BC1F138F7239F11A7E4B233623EE0016882_}       x{2_}        x{2_}         x{2_}          x{1D28EFE44E54F5A54983622F06A89693BB8D8FBC2_}          x{0002B001D9C9ECD7EFA8B6B0A3FB9732C3FA9DA3A_}         x{2_}          x{2BD173B44DAE76789240D192BA227D7229C8FF052_}          x{3E4C492DF1CE210F2EE27A193218B0E3377333E56_}        x{2_}         x{2_}          x{34B30DE93700DAA348CAD23D8B3751CC504BD2242_}          x{369E63DA25A8CCC7D92D2304B4755FF672F9C2046_}         x{2_}          x{1C6A86F874DB2BF8E19E443E670278D1E2670670E_}          x{2064ADB9CE1F335DA09DF05F6AC6DE9409F02CF3E_}      x{62_}       x{2_}        x{05E3886B4B9DEB819C455273EEC7E71EA76025BA2_}        x{178521FCD545740AA49D4D412A35D51C6E7D27B6E_}       x{46FBEBC898F403E4773E95FEB15E80C9A99C8348D}  can someone help me understand what this means? and if this is not the right place to ask this qn i would appreciate it if i can get directed to the right place to do so, thank you! specifically what is (C7, 2, 2, 2, ..., 62)

Loui🏅: hi there~ anyone knows how to get the walletId  ? 🙏🏻

Louis: How to monitor data on the TON chain, just like the EVM event

Haint: Take this wrapper function from jetton for example, how do I provide a seqno for it? The internal function doesn't seem to have it as an argument. (reply to 68055)

Daniil: You don’t have to manage seqno yourself (reply to 93285)

Polly | GetBlock: Hi! I'm Polly, PR and Events Manager from GetBlock, a leading RPC Node Provider. 👋 We would like to support your upcoming hackathons or events with node support, media coverage, etc. Are you planning any events soon or in the next year? Who should we contact to discuss this further?

Haint: I mean in the case of resending transaction (reply to 93287)

Haint: if we dont manage the seqno how can we make sure it's still the same

Daniil: What exactly do you want to achieve by “resending” it? (reply to 93289)

Daniil: If seqno changes - it means that the transaction was confirmed

Haint: because sometimes tx might get lost (reply to 93291)

Haint: yeah I'm afraid of the case that I fail to detect the seqno change, and still resend the transaction (reply to 93292)

Haint: it will be dupped

Yo: Hello, I have a problem. How can I calculate Txid through message_hash?

Sunil | Aerius Labs: why ston.fi sdk v2 in not available yet, it is given in docs but I don't why it is not available for dev.

Louis: now it's use v1 still (reply to 93297)

Sunil | Aerius Labs: Is it available for testnet ? (reply to 93298)

sunyoki: dict  cell What's the difference?

DPL: Regarding the node:  Local validator status: working for 9 hours Local validator out of sync: 7 seconds Local validator last state serialization: 89,470 blocks ago  Is this normal? It returns LITE_SERVER_NETWORK / query timeout errors upon requests.

Pasza: Hi. Can someone help? I want to subscribe to changes in the wallet (transactions and their status) to understand the current stage of the jetton swap. I'm using ton-connect/ui-react. What can you recommend?

David: I have the same question😂 did u find out anything? (reply to 83147)

sunyoki: 🤣

Sunil | Aerius Labs: How one can create a pool ston.fi ?

MZ: @pcrafter do you maybe know any github example or documentation that shows how to send jetton from given wallet (knowing it seeds/private key) to another wallet programatically?

Emmy: Hello, I love the Ton ecosystem and I'm wondering if I could be part of this team to help moderate this community or any other community under ton (reply to 93291)

Nikita: Hi there How is this possible that tonhub api responding with 403 for some wallets?   "method":"get","url":"https://mainnet-v4.tonhubapi.com/block/latest"},"status":403} msg=Request failed with status code 403

TKAINU: Hello. im using Mac intel. i want install toncli but i can not download pre-builds, There isn't any content here, Also, is there any way to install toncli?

&rey: seqno is embedded within via: Sender. You should provide another Sender, that would send the given message once exactly. (reply to 93285)

&rey: Get-methods are like interfaces, so that NFTs can execute some code to generate content (example: Meridian's layered graphic). (reply to 83147)

Nguyễn Linh: Hi, can anyone please explain me how the total fee 0.002107428 TON be calculated in this tx? https://testnet.tonviewer.com/transaction/bbeef4f482fd19cccc216a08c09edd202f1ef083b1612ff549a71f21ef5d64fe?section=trace

&rey: dict is either null or cell of specific format. cell is... well, a cell of any format, having 0-4 refs and 0-1023 bits. (reply to 93300)

&rey: You'd better use value flow. (reply to 93339)

&rey: 0028 is prefix added by ~dump, indicating ref and bit count — you can find that in whitepapers under term "cell descriptors". (reply to 93272)

Nguyễn Linh: I see in the value flow that the network fee = 0.002374097 = 0.002107428 + 0.000266669 (Fwd Fee).  So the 0.002107428 should be equal to action_fees + computation_fees + storage_fees. I try to sum up the three fees above, but the result is different. (reply to 93341)

Degen: How to get the tx of a transaction through the transaction result boc issued by tonConnectUI

&rey: The latter is some binary tree (prob a dictionary). x{2_} stands for b0010 — two zero bits; you can find match that against dictionary definitions in block.tlb. (reply to 93272)

MZ: Anyone? I try to use Tonweb example, but there is something like:  const WalletClass = tonweb.wallet.all["v3R1"];  and looks like it doesn't have a possibility to set W5 wallet version.   Is there any other way to do it? (reply to 93319)

Nerses: in case the data is encapsulted inside variable in this way beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();   and send it as field in message will this be correct way to read the data ?           let op_code: Int = mainMsg.loadUint(32);         let b_0: Slice = mainMsg.loadRef().asSlice();    here mainMsg is the value of sent data

Nguyễn Linh: Do you have an idea on this @pcrafter? I found only 0.001901028 of 0.002107428  1901028  = 133331 + 400000 (Action fee) + 1323200 (Compute fee) + 44497 (Storage fee) (reply to 93344)

Nathan: hello guys, good morning

TON Bounty Bridge: ​Create graphs describing TON contract systems  🏷 Approved 🏷 Developer Tool  Summary:I suggest to create tool [semi]automatically converting information about message chains (from#466) ...  Rewards: • TBD • TON Footsteps NFT  Assignees: ProgramCrafter, kehiy Created by ProgramCrafter

Nathan: does anyone know if it's possible to put a query in the direct link of the mini app? i put it in the url of my site, but it's not that effective.

Nathan: my idea was to get the appointment: ?is_telegram=true and hide one of my login buttons and only show the tonConnect button when opened by telegram  (mobile only

Vladimir: miniapp add own sdk https://core.telegram.org/bots/webapps#initializing-mini-apps so just check it. If you need some logic only on mobile — check the platform. (reply to 93360)

TON Bounty Bridge: ​TON Static Analysis based on Symbolic Execution  🏷 Approved 🏷 Developer Tool  Summary:Static analysis tool for TON offers following advantages:  Rewards: • 💰 9000 USD • 🕑 6 weeks (3 sprints)  Assignees: korifey Created by korifey

TON Bounty Bridge: ​TL-B serialization in Rust  🏷 Approved 🏷 Developer Tool  Summary:Implement a Rust library for effective and convenient TL-B (Typed Language Binary) serialization and...  Assignees: mitinarseny Created by mitinarseny

Nathan: ok (reply to 93362)

turink: Hello everyone I want to make a bot for memecoins on ton, different ones, for trading and like, notifications that sends every buys on a specific memecoin. I couldn't dind any resources, do you guys know where to find?

TON Bounty Bridge: ​Swift SDK For TON  🏷 Approved 🏷 Developer Tool  Summary:This footstep is for the development of the Swift SDK. Swift is popular not only among mobile develo...  Rewards: • 5,000 USD in TON equivalent • Standard TON Footstep NFT  Assignees: nerzh Created by nerzh

Vladimir: It's simple, you need to: — list of memecoin addresses — listen blockchain trxs related to them (reply to 93369)

turink: Hey Vladimir, thank you for your reply! Is there any resources that explains this with broader views? (reply to 93372)

Санчо Пансо: Hey, is there any example of how we should track&find transactions after sending on dapps? I can't get any on testnet by methods tryLocateResultTx

TON Bounty Bridge: ​A series of improvements to Tact Language  🏷 Approved 🏷 Developer Tool  Summary:Implement necessary improvements and features in Tact language used for writing TON smart contracts  Rewards: • SBT Bounty Reward • 3000 USD in TON  Assignees: Gusarich Created by Gusarich

Vladimir: Start from official docs https://docs.ton.org/develop/dapps/asset-processing/jettons (reply to 93374)

Nerses: what is the anloag in TACT for Cell.fromBase64  ?

Vova: Need to make simple trading bot to trade my token to make movement on the market. Is it any library or script or something that can be useful  🙏🏽

Jacob: hi, please DM me (reply to 93387)

Apple: Hi, @Clane I have experience with Trading bot on TON like Sniper, Sandwich, MEV, Volume (reply to 93369)

Apple: Check dm (reply to 93387)

Vova: Yes I need something like that maybe you can share with me something? (reply to 93392)

turink: Hit me upwith smth (reply to 93389)

Skye2920: DM (reply to 93387)

MZ: I have this code to transfer USDT programatically.   The problem is that it still sends just 0 USDT. What is the reason?  https://tonscan.org/address/EQCgrTs4o1gCvXjv637IHyMP9w7KTC4YJIsAnT1lsbk3yra5#events

Max: Nah, Node doesn't sync after installation using Archival snapshot with the error:  [ 0][t 4][2024-08-09 13:54:24.858426913][Status.h:273][!downloadstate] Unexpected Status [Error : 652 : timeout] in file /ton/validator/shard-client.cpp at line 96 [pid 1] [time 1723211664] Signal: 6 ------- Stack Backtrace ------- validator-engine(+0x22de29)[0x55c7d73b0e29] validator-engine(+0x22c0f6)[0x55c7d73af0f6] /lib/x86_64-linux-gnu/libc.so.6(+0x42520)[0x7f1f4c934520] /lib/x86_64-linux-gnu/libc.so.6(pthread_kill+0x12c)[0x7f1f4c9889fc] /lib/x86_64-linux-gnu/libc.so.6(raise+0x16)[0x7f1f4c934476] /lib/x86_64-linux-gnu/libc.so.6(abort+0xd3)[0x7f1f4c91a7f3] validator-engine(+0x2389a7)[0x55c7d73bb9a7] validator-engine(+0x238b92)[0x55c7d73bbb92] validator-engine(+0x2386e4)[0x55c7d73bb6e4] validator-engine(+0x15f540)[0x55c7d72e2540] validator-engine(+0x4ff31d)[0x55c7d768231d] validator-engine(+0x4ff2b4)[0x55c7d76822b4] validator-engine(+0x556f25)[0x55c7d76d9f25] validator-engine(+0x24ac40)[0x55c7d73cdc40] validator-engine(+0x24afbd)[0x55c7d73cdfbd] validator-engine(+0x25285a)[0x55c7d73d585a] validator-engine(+0x250b17)[0x55c7d73d3b17] validator-engine(+0x250b7e)[0x55c7d73d3b7e] validator-engine(+0x1a2be0)[0x55c7d7325be0] /lib/x86_64-linux-gnu/libc.so.6(+0x94ac3)[0x7f1f4c986ac3] /lib/x86_64-linux-gnu/libc.so.6(+0x126850)[0x7f1f4ca18850] ------------------------------- (reply to 93081)

Max: It starts, downloads state for some time and then crashes, restarts and starts over again. (reply to 93402)

Ruslan: Btw, have you changed ttl in /etc/systemd/system/validator-engine.service according to the instruction? https://docs.ton.org/participate/run-nodes/archive-node#update-configuration (reply to 93402)

Max: Ofc (reply to 93404)

Nerses: the forward_payload which is aggregated like this   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());      const forward_payload = beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();  i get as message field. I have correctly parsed the data of op_code . here is the code         let slice = msg.forward_payload.asCell().beginParse();          let flag = slice.loadUint(1);           let refCell = slice.loadRef();           let refSlice = refCell.beginParse();         let op_code = refSlice.loadUint(32);     could someone give a hint how I can get the data of b_0 ?

Max: I had a working Archival Mainnet Node installed from the snapshot a month ago, now I'm deploying another node and doing exactly the same actions, same Node version, everything equal. (reply to 93405)

Max: The Node version is v2024.06 Entrypoint is validator-engine --local-config=/var/ton-work/db/config.json --global-config=/var/ton-work/db/ton-global.config --db=/var/ton-work/db --threads=15 --state-ttl=315360000 --archive-ttl=315360000 --block-ttl=315360000 (reply to 93402)

&rey: refSlice contains data of b_0 exactly in this case. (reply to 93406)

Dave: Please is there a place I can see all methods for run_get_method of pytoniq

Nerses: it is a lil bit weired as when I test this code     receive(msg: TokenNotification){         let ctx: Context = context();          let slice = msg.forward_payload.asCell().beginParse();          let flag = slice.loadUint(1);           let refCell = slice.loadRef();           let refSlice = refCell.beginParse();         let op_code = refSlice.loadUint(32);           let data = refSlice;              if (op_code == 1734998782){             emit(CommitId {commitId: op_code}.toCell());             // self._commit(CommitData.fromSlice(refSlice), ctx);         }     }  it works correctly (emit is done)  when I open the comment is fails.i am sure that b_0 has the layout of CommitData.so my only prediction what throws exit code is because of fromSlice. Did I miss something or anlayze wrong ? as it should work correctly nothing is wrong i think (reply to 93409)

&rey: Have you tried preloadUint? (reply to 93413)

&rey: Also, I'd like to see full FunC code generated in your project, because I didn't find doc for fromSlice.

Nerses: https://docs.tact-lang.org/ref/core-cells#messagefromslice (reply to 93417)

badbadnotgood: ⚠️ Can somebody please help?  How do I send a custom message to ton contract?  F.E I have implemented   message SomeEvent {     user: Address;         amount: Int; }.  Where should I specify the message type? I'm talking about sending messages outside of ton contract, f.e using TonConnect or api/wallet.

Nerses: i have changed the architecture of my code.now the function just accepts the struct message Commit{     data: CommitData; } struct CommitData{     hopChains: map<Int,StringImpl>;     hopAssets: map<Int,StringImpl>;     hopAddresses: map<Int,StringImpl>;     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address;     jettonMasterAddress: Slice;     jettonWalletCode: Slice;       amount: Int;  } so I dont use preload (reply to 93416)

Nerses: but I can try that way also

MZ: Any idea? (reply to 93398)

Nerses: with this code          let slice = msg.forward_payload.asCell().beginParse();          let flag = slice.loadUint(1);           let refCell = slice.loadRef();           let refSlice = refCell.beginParse();         let op_code = refSlice.preloadUint(32);           let data = refSlice;              if (op_code == 1734998782){             emit(CommitId {commitId: op_code}.toCell());             self._commit(CommitData.fromSlice(refSlice), ctx);         } it throws again exit code 9 https://testnet.tonviewer.com/transaction/571b0c8eda7733422af7bd52f5cd8dbfeb04e7519dc15666702b147306b56f84 (reply to 93416)

&rey: This seems better! (reply to 93421)

Nerses: so fromSlice should work correctly as it is exact b_0 . I cant even predict now where can be the problem (reply to 93425)

0xbera: /me

0xbera: any idea what this error message means? I am trying to send TON from one wallet to another:   External message was not accepted Cannot run message on account: inbound external message rejected by transaction CEC9A545233639371FCBB0E297E8AE93CCDF7E6BED477A795AAE30BC407A7989: exitcode=36, steps=80, gas_used=0 VM Log (truncated): ...ecute DICTUGETREF execute NULLSWAPIFNOT execute PUSHCONT xD024D721D70A00F264 execute PUSHCONT x30 execute IFELSE execute CTOS execute PUSH s4 execute SDSKIPFIRST execute PLDI 1 execute THROWIF 36 default exception handler, terminating vm with exit code 36

x: please DM me (reply to 93096)

&rey: Why are you using this command? (reply to 93432)

Blockchain: Hi, guys, what is the difference NFT send and NFT transfer? I am interested in NFT transfer.

Blockchain: And nft_item.fc is able to transfer NFT? I can't see any...

0xbera: I was banned a few times for no good reason -- just checking what my status is 😛 (reply to 93446)

&rey: "send" and "transfer" are exactly same. (reply to 93447)

&rey: Well, there isn't anything useful (as you've just checked) and it clobbers chat. (reply to 93451)

Blockchain: well, but even same, How can I transfer NFT to many users? not send....

Blockchain: and those kind of nft_item has no collection address.

Nerses: for this piece of code             let msg: CommitData? = null;             try {                 msg = CommitData.fromSlice(msgSlc);             } catch (e) {                 require(false,"Unable to resolve CommitData");             }             require(ctx.value != 0,"Funds Not Sent");             require(msg.timelock > now(),"Not Future Timelock"); i got error `Invalid type "CommitData?" for field access                                                                                          Line 202, col 21:   201 |             require(ctx.value != 0,"Funds Not Sent"); > 202 |             require(msg.timelock > now(),"Not Future Timelock");  i tried to use (msg.timelock)!!`  but again got same error. Any hints how this can be solved ?

Blockchain: is there any code about that? (reply to 93452)

Blockchain: if (op == op::transfer()) {        transfer_ownership(my_balance, index, collection_address, owner_address, content, sender_address, query_id, in_msg_body, fwd_fee);        return ();      }      if (op == op::get_static_data()) {        send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message        return ();      } normal nft_item only have this op code but when I see above transaction, they have ownership_assigned. how can I implement this?

&rey: let msg: CommitData = CommitData.fromSlice(msgSlc)!!; (reply to 93458)

Blockchain: deploy without collection address is possbile? (reply to 93456)

Nerses: here is full code     receive(msg: TokenNotification){         let ctx: Context = context();          let slice = msg.forward_payload.asCell().beginParse();          let flag = slice.loadUint(1);           let refCell = slice.loadRef();           let refSlice = refCell.beginParse();         let op_code = refSlice.loadUint(32);            if (op_code == 1734998782){             self._commit(refSlice, ctx);         }     }      fun _commit(msgSlc: Slice,ctx: Context){             try {                 let msg: CommitData = CommitData.fromSlice(msgSlc)!!;             } catch (e) {                 require(false,"Unable to resolve CommitData");             }             require(ctx.value != 0,"Funds Not Sent");             require(msg.timelock > now(),"Not Future Timelock");             self.contractNonce +=1;             let commitId: Int = self.seed ^ self.contractNonce;               require(self.commitExists(commitId) == false,"Commit Already Exists");             self.commits.set(commitId, PHTLC {                                                 dstAddress: msg.dstAddress,                                                 dstChain: msg.dstChain,                                                 dstAsset: msg.dstAsset,                                                 srcAsset: msg.srcAsset,                                                 sender: ctx.sender,                                                 srcReceiver: msg.srcReceiver,                                                 timelock: msg.timelock,                                                  amount: msg.amount,                                                 messenger: msg.messenger,                                                 locked: false,                                                 uncommitted: false,                                                 jettonMasterAddress: msg.jettonMasterAddress,                                                 jettonWalletCode: msg.jettonWalletCode                                                 });             emit(CommitId {commitId: commitId}.toCell());     } but it throws error after the change Type "CommitData" is not optional Line 193, col 39:   192 |             try { > 193 |                 let msg: CommitData = CommitData.fromSlice(msgSlc)!!;                                               ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   194 |             } catch (e) { (reply to 93464)

Blockchain: we deploy nft on collection. but for this, we have to deploy on own?    cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();  }    slice calculate_nft_item_address(int wc, cell state_init) {    return begin_cell().store_uint(4, 3)                       .store_int(wc, 8)                       .store_uint(cell_hash(state_init), 256)                       .end_cell()                       .begin_parse();  }    () deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {    cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);    slice nft_address = calculate_nft_item_address(workchain(), state_init);    var msg = begin_cell()              .store_uint(0x18, 6)              .store_slice(nft_address)              .store_coins(amount)              .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)              .store_ref(state_init)              .store_ref(nft_content);    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors  }

&rey: Oh. CommitData.fromSlice(msgSlc); then. Also you don't need to catch exception just to rethrow it, I guess.

&rey: Yes, such NFTs are collectionless and deployed one by one. (reply to 93467)

Blockchain: but when I deploy NFT item as own, I can't upload metadata...

MZ: Is anyone able to help me with it? (reply to 93398)

Blockchain: Do I have to study NFT_item and NFT_collection? is that only way to deploy my own NFT for transfer?

Nerses: yeah in this way contract compiled successfully,but the error because of fromSlice remains. In this way by error no one can distinguish from which logical part it is (reply to 93468)

Degen: How to determine whether a transaction has been completed? Is there any API to detect it?

Guru: Hi guys. I want to build on TON, but I dont understand a few things. I would really appreciate if someone could help.  How does TON help with discoverability exactly? I dont see the app store in my telegram app. Where do people access these apps on TON?

NPA120: There is no special API for it. You have to monitor the balance changes of the wallet. (reply to 93474)

NPA120: You can find the open source in github (reply to 93474)

Blockchain: is there NFT opensource?

Blockchain: not only standard but also expert's own nft_item which has no collection address. ;-)

Alexey: can anyone help me? I'm making a jetton smart contract, and I often get 37 error

Alexey: how to learn to count gas?

Apple: Check dm (reply to 93396)

Degen: Can you provide an open source link? thks (reply to 93480)

Anonicz: │            └ <aiohttp.client_reqrep.ClientRequest object at 0x7ca55072eb50>           └ <class 'aiohttp.client_exceptions.ClientConnectorError'>  aiohttp.client_exceptions.ClientConnectorError: Cannot connect to host 185.244.183.78:80 ssl:default [Connect call failed ('185.244.183.78', 80)]   Who can help? Payed

Max: After about 7 retries during the past 24h, the node managed to start syncing after emitting these logs: [ 3][t11][2024-08-09 20:07:56.641542954][manager-init.cpp:279][!reiniter] downloaded all shards [ 3][t11][2024-08-09 20:07:56.641871353][manager-init.cpp:290][!reiniter] persistent state download finished [ 3][t 2][2024-08-09 20:07:56.645091947][manager.cpp:1785][!manager] groups=0 seqno=39583185 our_seqno=39583185  I think there is a potential bug that causes panic when a Timeout happens during state downloading (according to the stack trace). Not sure ofc... Maybe will file an issue to TON Node repo next week.  cc @ruslixag (reply to 93402)

Алина: Is it possible that differnt lite servers report different lt value for a transaction?

&rey: For same hash? Nope. (reply to 93515)

Алина: Yes, it makes sense. I have trouble getting the actual balance of a wallet. I have a withdraw transaction and after a lite server signals it's completion it's not guaranteed that if i request my wallet's balance it's going to be updated with that transaction.  I thought i'd take the lt value of this transaction and then compare it to the lt of the account and only believe it's balance value if it's >= to the lt of the transaction. Does that make sense? (reply to 93516)

Алина: It didn't work out. I'm still getting balance that is out-of date although withdraw transaction is marked completed.

&rey: Different liteservers might sync at different times, actually.

&rey: You can use pytoniq.LiteClient.raw_get_account_state specifying block where transaction has already been included.

Димас: anyone please can help me with the generation signature (method sign text) to venom.network ? Idk why but i receive always wrong result

MZ: Imagine there is a typing error in @ton/ton library and it didn't work, because I was using "tokenAmount" and there should be "jettonAmount" - which throws typing error... (reply to 93398)

MZ: What is even more weird that this problem was already 11 months ago and it's still not fixed: https://answers.ton.org/question/1612576097562529792/zero-amount-jettons-in-transaction

&rey: Well, TonWeb is not maintained. (reply to 93525)

MZ: Is there any newer library that is more often updated that I could use instead of tonweb? (reply to 93526)

&rey: @ton/ton. Generally, please choose from https://docs.ton.org/develop/dapps/apis/sdk. (reply to 93527)

Алина: Sounds like a good solution too. I'm afraid i'm not sure how to identify which block a transaction is included in 😅 (reply to 93521)

Алина: oh, i guess, this one?

Алина: Your approach with specifying the transaction's block to get a wallet balance that is in accordance with that transaction worked perfectly, i'm so happy. Can't thank you enough! 😅 (reply to 93521)

— 2024-08-10 —

Lucas: To query TON domain names and their expirey date... can someone help me how to get started on that....   I think I need a lite server to do it on my own terms...  But i could probably just as well use TonCenter API

trungnotchung: I have a transaction with many recursive actions, but the depth does not exceed 17. It causes an error, running out of gas with exit code -14 in the sandbox. I have tried with msg_value equal to 1000 TON, but it still errors. Can someone please help?

11: Hi guys, is save_data a fixed function name?

Haint: no, set_data is (reply to 93569)

trungnotchung: how can i increase my gas_limit, i have tried set_gas_limit but it didn't work

A.: Hey, anyone who bought courses on Ton development, what can you recommend that's worth it's money and time

Alfred: Reading docs and existing code might be the best way to learn it from my experience. (reply to 93586)

Alfred: Once you have figured out how to design the message flow and the data structure, you can start building some contracts and learn from it.

&rey: You can use Orbs. Or, actually, non-Toncenter-like APIs — dton.io/graphql, for instance. (reply to 93554)

Ahmed: hello guys, how can I send two messages in a row (not at the same time) in one transaction

&rey: "one transaction" happens at single time, so that seems impossible. (reply to 93594)

&rey: You can't await completion of transaction tree initiated by first message either. That's kind of point of TON.

Ahmed: I was able to do it this way

Ahmed: what I meant is that it be in this structure

Ahmed: maybe I didnt explain what i meant enough in the first message, but people are doing it (reply to 93595)

Atharva🥠: Hey guys, I just wanted a little help from u people I see a lot of DEVs here so I really wanted to ask abt it I'm a 18 years old and I'm soon going to start with my college Very recently crypto has caught my interest and TON has been a major reason for that I'm wishing to learn more and contribute as a DEV in our ecosystem and explore other opportunities in the crypto world I wanted to ask for a pathway to start of with my journey I'm just trying to begin with python can anyone of u help me with ur suggestions? @admin

Az ᴛʜᴇ ᴄʀᴀʏ: GameFi? (reply to 92180)

&rey: You need to handle some message in A. It won't be in same transaction, of course. (reply to 93600)

&rey: Ideas: 1. system to send TON transfers reliably 2. system to receive TON transfers reliably 3. same, but when server can be shutdown at arbitrary moment (reply to 93604)

Ahmed: what Im aiming to do I believe is called multi hop swap (reply to 93606)

Atharva🥠: I'm sorry mate but was that reply actually meant for me? (reply to 93607)

Anton: Is it possible to make a swap and put the received token into the liquidity pool, in one transaction for the user (so that you do not have to wait and confirm the transaction twice). The problem is that a swap and a message to liquidity pool are sent to the network at the same time, which is why sending for liquidity breaks. Is it possible to somehow "delay" the message, or do you still need a smart contract or two requests to the wallet?

trungnotchung: @pcrafter hi mate, how can i increase gas_limit per tx, i have tried set_gas_limit but it didn't work, now it is only 1.000.000 gas uint per tx

MZ: I decided to use @ton/ton instead on tonweb to use the newest library.  However I see there is a little difference.   When I use the code from the screen it sends 0.03 TON and I don't get back any remaining amount.   Meanwhile when I was using tonweb I was sending 0.03 TON and was getting back something like 0,017043995 TON. At least I seen it in transaction history.  Do I need to set something more in the code? What is the reason I don't get unused fees now? (reply to 93529)

Almatbek: Who needs a developer?

&rey: response_destination: wallet.address (reply to 93614)

&rey: It's impossible to delay the message. (reply to 93610)

&rey: 1M gas is limit for any single transaction. You should split computation into several transactions. (reply to 93612)

MZ: Yeah, but where should I set it? sendTransfer doesn't have such option to set response_destination. (reply to 93618)

trungnotchung: can i increase gas limit for more complex tx (reply to 93620)

&rey: Please look carefully at the code forming body and its comments. (reply to 93622)

&rey: You should split computation into several transactions or ask validators to vote "yea" on gas limit increase. (reply to 93623)

trungnotchung: thank you (reply to 93631)

Anton: So sc is the only variant? (reply to 93619)

wendy: Hello everyone, does anyone know how to send an external message to a TON smart contract using the @ton/ton library？

MZ: Thank you. I've found it and set as senderAddress. However, because of some reason it still doesn't work.   Maybe I need to increase forward_ton_amount or something? (reply to 93627)

Filip: Please can anyone help me on how to get new pool api on the ton network

Samuel Arthur: You mean notcoin api  for new pools ? (reply to 93648)

Samuel Arthur: Who can help ? I think he is looking for notcoin api

Anton: @tonchain_helpdesk is writing dm, asking for wallet phase. Be careful.

Alexey: Hi all! Tell me, can you use the SendRemainingValue mod if you need to send several messages in the body of one function?

Nerses: the forward_payload which is aggregated like this    let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());      const forward_payload = beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();   i get as message field. I have correctly parsed the data of op_code . here is the code          let slice = msg.forward_payload.asCell().beginParse();          let flag = slice.loadUint(1);           let refCell = slice.loadRef();           let refSlice = refCell.beginParse();         let op_code = refSlice.loadUint(32);      could someone give a hint how I can get the data of b_0 ?   @TrueCarry can you have a look at this ?

KingsMan: Hello. I'm trying to write a bot that will inform about the creation of new Jettons on the network. I connected to the LiteServer through pytoniq. I'm downloading transactions from each block. And now my question. How can I recognize that a transaction is a transaction that creates a Jetton? Or where can I find a tutorial that describes the whole process?

Tim: Seems like your refSlice is b0 (reply to 93672)

Nerses: when I use fromSlice passing it as argument it throws cell underflow,while the layout of b_0 is exactly the struct i try to get from b_0. if refSlice is ok do you have any suspicions where the error can be ,as I am sure it is because of fromSlice? (reply to 93676)

Tim: Try one more loadRef from forward payload

Prince: analyze the transaction then you can get easily (reply to 93674)

KingsMan: But what should I be looking for? It seems to me that the appropriate op_code is needed, but I don't know how to find it in a single transaction. Below is an example of a random transaction. < Tl-B Transaction account_addr: b'\xff|\xfd\x0e\xc6SU\x80>\xf3\x8d\x00\x87\xc9|\x02\x89\xf3A\x9an\x8f\xd8\x9b\x0b\xf1\xb9\xeb\x8a\x88\x08\xf4' account_addr_hex: 'ff7cfd0ec65355803ef38d0087c97c0289f3419a6e8fd89b0bf1b9eb8a8808f4' lt: 48352541000001 prev_trans_hash: b'\x8f\xa7\x17;\xfa\xed|\xc18n\xe7^;\xba\x87\x1f\x18\x0bc\xb6\x8e\xe7\x0b\xfe\xf3\r\xccA\xb0mW+' prev_trans_lt: 48294366000001 now: 1723298761 outmsg_cnt: 1 orig_status: < Tl-B AccountStatus type_: 'active' > end_status: < Tl-B AccountStatus type_: 'active' > in_msg: < Tl-B MessageAny info: < Tl-B ExternalMsgInfo src: None dest: Address<EQD_fP0OxlNVgD7zjQCHyXwCifNBmm6P2JsL8bnriogI9LZq> import_fee: 0 > init: None body: <Cell 624[CF3007A8F91E65B46C7D6736A72C552A0DC8394A054EF09ADCCEE7CE66665C446E89557C18612FBB9F450A730C662EED8EDED8A8EBE30DE714F387AC6794790129A9A31766B77405000000070003] -> 1 refs> > out_msgs: [< Tl-B MessageAny info: < Tl-B InternalMsgInfo ihr_disabled: True bounce: False bounced: False src: Address<EQD_fP0OxlNVgD7zjQCHyXwCifNBmm6P2JsL8bnriogI9LZq> dest: Address<EQAuYz5NHwEUyKW8A-6AGyWmn-DNJ3OK5giIR1I4J7g6FTh6> value: < Tl-B CurrencyCollection grams: 10000000 other: < Tl-B ExtraCurrencyCollection dict: None > > value_coins: 10000000 ihr_fee: 0 fwd_fee: 306136 created_lt: 48352541000002 created_at: 1723298761 > init: None body: <Cell 32[CC0CF832] -> 1 refs> >] total_fees: < Tl-B CurrencyCollection grams: 2208251 other: < Tl-B ExtraCurrencyCollection dict: None > > state_update: < Tl-B HashUpdate old_hash: b'\x02\x1a\x1e\xe8\xd6G\xa7\xfe?\x1b\x1c\xdb5\xcc\xabq\xcfx!lu\x15\xf18m\xed=zJ\xab \xdf' new_hash: b'\x14\xd3Va,\xbb\x8c\xb0L],\xdf\xa3\x1f\xf4\xd5\xb3,~^\xb5\xb5\x08\x1b\xdfg#\xda\xd9i\xb1\x86' > description: < Tl-B TransactionOrdinary type_: 'ordinary' credit_first: True storage_ph: < Tl-B TrStoragePhase storage_fees_collected: 56787 storage_fees_due: None status_change: < Tl-B AccStatusChange type_: 'unchanged' > > credit_ph: None compute_ph: < Tl-B TrComputePhase type_: 'vm' success: True msg_state_used: False account_activated: False gas_fees: 1323200 gas_used: 3308 gas_limit: None gas_credit: 10000 mode: 0 exit_code: 0 exit_arg: None vm_steps: 68 vm_init_state_hash: b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' vm_final_state_hash: b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' > action: < Tl-B TrActionPhase success: True valid: True no_funds: False status_change: < Tl-B AccStatusChange type_: 'unchanged' > total_fwd_fees: 459200 total_action_fees: 153064 result_code: 0 result_arg: None tot_actions: 1 spec_actions: 0 skipped_actions: 0 msgs_created: 1 action_list_hash: b'V\x0by\x97\xf6\xa0kY\x18\xe5bR~<\xb6YG\xf2\xfa\x04=\x96=\x1dG\n%\xde\xfc\x11\xebd' tot_msg_size: < Tl-B StorageUsedShort cells: 2 bits: 777 > > aborted: False bounce: None destroyed: False > cell: <Cell 724[7FF7CFD0EC65355803EF38D0087C97C0289F3419A6E8FD89B0BF1B9EB8A8808F400002BF9F407C1418FA7173BFAED7CC1386EE75E3BBA871F180B63B68EE70BFEF30DCC41B06D572B00002BEC6887B38166B773C90003464363F60] -> 3 refs> > (reply to 93679)

Prince: just analyze all similar transaction then you can find similar factor

KingsMan: Ok. Can I find this information in any documentation ? (reply to 93681)

Prince: I didn't see any doc so you can also do

Nerses: do you mean after getting op_code ? (reply to 93678)

Tim: After loadRef (reply to 93684)

ashes: Can i send multiple messages in one blueprint script? When trying to send them one after another - only the first one executes  await kadys.send(   sender,   {     value: toNano('0.05'),   },   {     $$type: 'Unstake',     amount: pendingWithdrawal.amount,     from: Address.parse(pendingWithdrawal.to),   }, );

Alexey: Hello, I'm writing smart on tact, I just can't figure out the gas when sending several messages from one smart contract function I often get 37 exit code For some reason, SendRemainingValue does not take into account the sent ton from previous messages Has anyone encountered anything like this?

Lucas: DTon... I like it... Like.. De-Ton  Like... Deutschland-Ton. I mean not really, but leave me my delusional thoughts (reply to 93590)

&rey: You have to do so manually, not through Sender. (reply to 93689)

Samuel Arthur: Lemme know when you are done with this bot .   Seems  to be good idea (reply to 93680)

Samuel Arthur: Who have any idea on how to get the api of the various bot on telegram ?

&rey: Parse tx.in_msg.body. (reply to 93680)

Chris ◇: Botfather (reply to 93737)

— 2024-08-11 —

Blvck Lion: Hi, I topped up but my outgoing transfers are unsuccessful. Please any idea? (reply to 2583)

Barbell: Hi I upgraded the latest TonSDK.NET and I am facing an issue

Barbell: Task<RunGetMethodResult?> RunGetMethod(Address address, string method, string[][] stack)     {       if (this._type != TonClientType.HTTP_TONCENTERAPIV2 || this._type != TonClientType.HTTP_TONWHALESAPI)         throw new ArgumentException("string[][] stack, must be defined with HTTP_TONCENTERAPIV2 type.");       return new RunGetMethodResult?(await this._httpApi.RunGetMethod(address, method, stack));     }

Barbell: throws the exception even I am passing the stack [][] into the function.

Barbell: Did you check the error code? If your tx has failed there will be error code associated with transaction. (reply to 93770)

MEMELORD: I have had a mistake after command: npx blueprint run Follow the guide, step 8.

MEMELORD: test@applemachine Counter % npx blueprint run  (node:90876) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time (Use node --trace-warnings ... to show where the warning was created) TypeError: Cannot read properties of undefined (reading 'slice')     at /Users/test/Desktop/Ton/smart_contract/Counter/node_modules/@ton/blueprint/dist/utils/selection.utils.js:50:47     at Array.map (<anonymous>)     at findScripts (/Users/test/Desktop/Ton/smart_contract/Counter/node_modules/@ton/blueprint/dist/utils/selection.utils.js:49:10)     at async run (/Users/test/Desktop/Ton/smart_contract/Counter/node_modules/@ton/blueprint/dist/cli/run.js:17:59)     at async main (/Users/test/Desktop/Ton/smart_contract/Counter/node_modules/@ton/blueprint/dist/cli/cli.js:91:5)

Resha: Hey i am rrying to integrate ton wallet in angular app so using js sdk for same. However the loggin in with popup from extension not working and after a while getting customElementRegistry error in console. Can anyone help

Prince: guys, pls careful about scam

EDITOR FRED: Sure, but we will always give it a try ❤️❤️❤️ (reply to 93797)

EDITOR FRED: Recently someone wasted my time for two weeks+ I was working for them (since 19 July) (claimed to be ideasoft) he blocked me today after completing the project for them, I had sleepless night just to not get fired after everything they took code and blocked me. I'm even more angry because I ditched some job that was supposed to pay me l cos I don't want to be distracted. It was a Solana project and I thought I would make it from there but nope it was all imagination 😔😔. Well it only added to my experience. I'm sad deep down

Degen: Is the getgems market in the browser fixed?

turink: what is the website where you verify your token on TON Network?

Blvck Lion: Thank you I will (reply to 93783)

MEMELORD: Lower then 18.0? (reply to 93795)

Barbell: yes I resolved I can't use the old one string[][] so I had to change the signature to var stackItems = new List<ItemStack> (); And then pass ToArray() (reply to 93815)

Victor: Install 18 (LTS) (reply to 93817)

Blvck Lion: This is what it says (reply to 93821)

&rey: Please remember to do your own research on which OS suits you better. I don't think this chat is place to discuss "but which OS is better 'objectively'?"

Samuel Arthur: Thanks Chris (reply to 93754)

Samuel Arthur: We move (reply to 93800)

Haint: Hey man, is it ok to never throw an error but instead catch it then do the refund? (we cant bounce the message back) I'm doing this but transactions are always successful even if they fail logicwise so I'm not so sure (reply to 93836)

EDITOR FRED: regardless LEL (reply to 93838)

EDITOR FRED: Tact, (reply to 93840)

EDITOR FRED: you are welcome -  if you are already familiar with typescript and js/rust you will get it easily it is stright forward (reply to 93844)

H: Hi , i mint an nft and visible on my wallet but doesn't shoe the on_chain meta data that i send it along the transaction, can i mint an nft with onchain metadata? Or only off chain available?

Aleks: Hey guys. Using @ton/ton’s WalletContractV4.sendTransfer. The method returns void. What would be the best approach to get the tx hash associated with that call?

&rey: (well, no one has transaction hash at the moment when method completes..) You need to listen to transactions on either source or destination contract, keeping in mind that external message may get included after some delay or be lost altogether. (reply to 93869)

Aleks: Yea so given the async nature of the whole thing, this makes it not so straightforward indeed… Do you have a recommended sdk to use? (reply to 93872)

Makis: Hello. Can someone point me to the right direction in terms of subscribing to swap events?

Makis: From popular dexes using websockets for example

Makis: Can I use the api[dot]ston[dot]fi to subscribe to swaps?

&rey: If there is no method, you can't. It seems there is no such method. (reply to 93884)

Makis: In the schemas there is a swap event not sure where it is used. (reply to 93886)

Makis: Not sure, thats why I am here! For ETH I implemented a custom solution to parse Uniswap events. For Solana I used Helius. For TON I am a bit lost. All I want is to get realtime swaps of a list of pairs.

Alfred: Hey, is there any documentation describing how is the next validator to produce a block elected ? or is it just whoever produces first ? what is the mechanism here ?

Carter🧹: Whitepaper (reply to 93898)

Alfred: so the whitepaper still accurately represents the currently implemented mechanism ? asking because the last update of it was in 2021 so things could be outdated (reply to 93899)

Carter🧹: Yep everything in there is correct, everything else is built ontop

Shadow: Hello! I want to create a TON/Jetton pool using implementation of Ston.fi, but when I try to call getProvideLiquidityTonTxParams, I receive a transaction where my TON returns back to me. I think my knowledge of pTON is insufficient, and I can’t understand what's happening. Could someone help me and provide a brief instruction on how to obtain pTON and create the pool, please?

I16000: Does anybody know,what is the stonfi  pool formula, TOKEN1*TOKEN2=CONSTANT, or something different?

糍粑: 自助词忘了怎么办？

— 2024-08-12 —

User<6984952426>: Hello guys!  In TMA, users can use the service immediately without signing up or logging in, is it because we use "Telegram.WebApp.initDataUnsafe.user" to get the user's data?

Joel: Hey guys Im working on a next gen func parser/compiler in Rust. The current parser implementation is only in C++ and is not very reusable. Im planning to make the repo open source after some work has been done. Anyone who wants to contribute please DM me

User<6984952426>: Thanks!

User<6984952426>: How do I validate users after I've imported their information?

TON Bounty Bridge: ​> i think should to findout how was smart-contracts were used in ton by ethereum before announce and why a "few" still dream... may keep backdoors.  Created by u1tran

Chi: import {   TonClient,   Address,   internal,   WalletContractV4,   TonClient4, } from "@ton/ton";  import { mnemonicToPrivateKey } from "@ton/crypto";  const keyPair = await mnemonicToPrivateKey(fromMnemonic.split(" "));  const wallet = WalletContractV4.create({   publicKey: keyPair.publicKey,   workchain: 0, });  const walletContract = client.open(wallet); const address = wallet.address.toString();  // Prepare transfer const resInfo = await fetch(   `https://testnet.toncenter.com/api/v2/getAddressInformation?address=${address}`,   {  method: "GET",  headers: {    "Content-Type": "application/json",    "X-API-Key":   process.env.API_KEY,  },   } );  const info = await resInfo.json(); const seqno = info.result.block_id.seqno;  console.log(seqno, amount, toAddress); console.log(await client.getBalance(Address.parse(address)));  const cell = walletContract.createTransfer({   seqno,   secretKey: keyPair.secretKey,   messages: [  internal({    value: "1",    to: "EQBmzLAL3h2i78tu72Lt5pc0KxecwVOgpvLu8R-ySb0C4TYQ",    bounce: false,  }),   ], });  console.log(await walletContract.send(cell));        Hello everyone, I'm trying to build a API to transfer TON, but always get 405 Method Not Allowed when sending transaction from walletContract  boc is exist, error message like this:  method: 'post',     url: 'https://testnet.toncenter.com/api/v2/',     data: '{"boc":"te6cckEBAgEAqgAB4YgBrBHk6YRVs5wxu4C2MLyx1orUsJbO1sdgE0wSYvmv834BEn6l6bjNHlv3+dfEDeDj4Ejxnw86G10jgUdABV/I+5EEGBw4WmrGOGUK5d6WXcA0g+ReeUjGQky76SHzIgnQQU1NGLs1y7rYCnc9eAAMAQBoQgAzZlgF7w7Rd+W3d7F280uaFYvOYKnQU3l3eI/ZJN6BcKHc1lAAAAAAAAAAAAAAAAAAAPhgElk="}' .... data: { ok: false, error: 'Method Not Allowed', code: 405 }   Then I copied the boc data, and pasted it to toncenter Swagger Got the error message :    "ok": false,   "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction D608F274C22AD9CE18DDC05B185E58EB456A584B676B63B009A609317CD7F9BF:\nexitcode=33, steps=23, gas_used=0\nVM Log (truncated):\n...te NOW\nexecute LEQ\nexecute THROWIF 36\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute LDDICT\nexecute ENDS\nexecute XCPU s4,s3\nexecute EQUAL\nexecute THROWIFNOT 33\ndefault exception handler, terminating vm with exit code 33\n",   "code": 500   Supposed the boc encoding has errors, how do I fix it ?

&rey: In that regard (and in most regards, in fact), it does. IIRC the relevant file is catchain.pdf. (reply to 93901)

Degen: What graphql service do you use to retrieve data on the chain?

Degen: I want to get information about the collection on the chain, including selling it, how should I proceed?

&rey: dton.io/graphql is commonly used. I heard tonapi is also launching their GraphQL endpoints. (reply to 93938)

Degen: https://tonapi.io/v2/graphql/playground (reply to 93943)

Degen: Yes, which one is better?

tony: Hello, we are the PuzzleMind team, aiming to create a product on Telegram that helps developers use the Tact language more efficiently. We are currently in the early stages of the product, and we hope to collect everyone's needs. After experiencing our product, you can fill out the questionnaire, and we will offer a USDT reward! https://forms.gle/iqDJQyiQ6p1wzoAz7

Degen: I want to obtain information about the collections on the chain, including sales information. Can this be achieved using graphql? Or do I need to aggregate the data? (reply to 93943)

kalix: hello 🙂  how to debug telegram miniapp?

Degen: https://docs.telegram-mini-apps.com/platform/debugging (reply to 93949)

kalix: thx:) (reply to 93951)

Олег: Hi all.Anyone looking for a collaborator? I'm looking for where to contribute 🧘

Degen: {   searchNFTs(     nft_collection_address: {addresses: [{       workchain:0,       address_friendly: "EQC1Bq1GJY9ON_2WpSroVlXpejzfLNA8XoL2MYxtN50ZbJfN"}]}   ) {     data {       nft_collection_address       nft_owner_address       nft_address       nft_has_reveal       nft_reveal_mode       nft_index       sale_type       gen_utime     }   } }  Why can't I find any data in this query? (reply to 93943)

Degen: Using https://dton.io/

Jenya: Is it possible to calculate how many blocks a chain of transactions will pass?

Steffen: Hi, is there any liteserver provider for hosted nodes out there?

TON Bounty Bridge: ​Token Transfer Failed on TON Blockchain  🏷 Developer Tool  Summary:I am experiencing an issue when trying to send tokens using the TON blockchain. The transaction fail...  Created by Deepakab56

[+_-]: Hey everyone, hope you're having a great week! I've got a few questions about dictionaries. First off, how can I calculate the storage size of an empty dictionary in a contract to avoid -8 exception? I came across this explanation in the documentation:  An empty hashmap is represented as null by TVM; hence, it is not a cell. To store a dictionary in a cell, you first save one bit (0 for empty, 1 otherwise) and then add a reference if the hashmap is not empty. So, store_maybe_ref and store_dict are interchangeable, and some smart contract authors use load_dict to load a Maybe ^Cell from an incoming message or storage.  From what I understand, this relates to the following TL-B schemes: hme_empty$0 {n:#} {X:Type} = HashmapE n X; hme_root$1 {n:#} {X:Type} root:^(Hashmap n X) = HashmapE n X; But I'm still not entirely clear—does this mean that HashmapE is either null or a reference, so we only count the one bit of the constructor? Or do we also need to account for {n:#}, which would add at least 32 bits?  If anyone here is well-versed in this, I’d really appreciate a few words of clarification. Thanks in advance!🍪🍪

Leo: {n:#} here is an implicit parameter of this type so it doesn't count into the bits data of the cell HashmapE is always exactly 1 bit in the containing cell and in non-null case it adds a ref to the actual hashmap cell (reply to 93981)

Karan: HI guys im looking for ambassadors, dm if interested

hentai8: Please, could anybody help me to understand why my TON node cant sync.  Out of sync time is increasing.  mytonctrl [info]    12.08.2024, 07:50:53.555 (UTC)  <MainThread>  Start program /var/snap/amazon-ssm-agent/7993/mytonctrl.py Welcome to the console. Enter 'help' to display the help menu. [debug]   12.08.2024, 07:50:54.267 (UTC)  <MainThread>  start GetValidatorStatus function ============================================================================================  Node is out of sync. The displayed status is incomplete. ============================================================================================ MyTonCtrl> status [debug]   12.08.2024, 07:50:57.293 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   12.08.2024, 07:50:57.294 (UTC)  <MainThread>  start GetLocalWallet function [debug]   12.08.2024, 07:50:57.294 (UTC)  <MainThread>  start GetWalletFromFile function [debug]   12.08.2024, 07:50:57.294 (UTC)  <MainThread>  start WalletVersion2Wallet function [debug]   12.08.2024, 07:50:57.294 (UTC)  <MainThread>  start GetDbSize function ===[ Local validator status ]=== Validator index: n/a Validator efficiency: n/a ADNL address of local validator: xxx Public ADNL address of node: xxx Local validator wallet address: xxx Local validator wallet balance: Load average[8]: 3.06, 2.93, 2.97 Network load average (Mbit/s): 7.47, 8.05, 13.57 Memory load: ram:[5.84 Gb, 19.0%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): nvme0n1:[34.26, 99.89%] Mytoncore status: working, 6 days Local validator status: working, 11 minutes Local validator out of sync: 238592 s Local validator last state serialization: 94939 blocks ago Local validator database size: 151.28 Gb, 31.6% Version mytonctrl: e92989c (mytonctrl2) Version validator: 5c392e0 (master)

hentai8: I've been running it for a week now, but out of sync time is increasing. (reply to 93986)

Ma><im: same problem (reply to 93956)

Matthew: greetings my fellow indians

Govind: What is this how this works plz tell as I'm new here

User<69210164>: hello hello everyone!   I have a quick question about TON domains, I hope this specific chat is relevant to ask one: How can you restart auction for an expired domain? The support told me to search here, but all 60 search results are not helpful at all and I can't find any details about it here.  I'm willing to pay $20 with an escrow/middleman for someone who helps me successfully

&rey: This should be helpful: https://t.me/tondev_eng/71518. Replace ton://transfer with https://app.tonkeeper.com/transfer for Tonkeeper though. (reply to 93994)

Sniper Man: the error indicates that you sent a wrong seqno, check if the seqno you send with the tx is equal to the seqno in the wallet contract (reply to 93934)

Chi: Thanks 🙏, I already resolved it (reply to 93997)

Anton: Hi, how get current blockchain gasPrice in @ton/sandbox?

Minimal ☄️: Hi guys,  I am trying to vanilla JS telegram web app in my website, but I am unable to use a lot of methods because the version is 6.0, how can I change the version?  I have newest telegram app on the phone.

Sniper Man: https://github.com/ston-fi/dex-core/blob/main/contracts/pool/amm.func this file shows how the dex works, it's basically the same as Univ2 but with different fee policies (reply to 93914)

Nerses: in case my contract gets TokenNotification can i having only that message get the address who triggered his jettonWallet address to do transfer,and all that do on chain ?

Sniper Man: the message itself contains sender, query_id, amount and forward payload packed in a slice, use slice.load to extract each peace information (reply to 94003)

Nerses: is the value of sender  jetton wallet address who did internal token transfer or it is the address who triggered his jetton wallet address ? (reply to 94005)

Sniper Man: it is the address firing the transfer message of the jetton wallet, can be either a user wallet or a contract based on your context

Nerses: thanks a lot (reply to 94007)

Sniper Man: i just can think of your node is slower than other peers on the network and not able to catch up latest blocks, maybe changing the location of the node where it is closer to other peers can help (reply to 93986)

0xbera: Hello!  I am sending 51 transactions between 2 wallets; the sum of their balances before is: 3.1413688669999997 TON; after sending the sum is: 2.64928451 TON. Am I correct to assume that sending these 51 transactions used 0.49208435699999953 in gas/fees (0.009648712882352932 per transaction)?   If so, this is twice as much as I expected 🙁 after each transaction I printed the total fees for it and I see a TON fee of 0.00521599 -- that fee multiplied by 51 would amount to 0.26601549  Can someone explain this difference?

Sniper Man: one possible way is to pack multiple nft transfer messages to a transaction using wallet contract v4, so you can execute multiple transfers with a single sign (reply to 94011)

MM: You should send internal message with opcode 0x05138d91 to nft_item contract (reply to 94013)

MM: On wallet, there is no option to send message with transfer opcode (reply to 94016)

MM: You should update the nft_item contract (reply to 94024)

MM: I guess, no (reply to 94026)

MM: Yes (reply to 94029)

MM: You can create a single nft item, or you have to update both collection and item contract (reply to 94031)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 52 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 21  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

KaKui: ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction F18B7F9637823812BEF03174FF68CD4CF40ED9AD21CB152DDBBFF28BFB6E3B58:\n' +         'exitcode=0, steps=0, gas_used=0',       code: 500

Sniper Man: Can u paste the full err msg (reply to 94039)

KaKui: response: {     status: 500,     statusText: 'Internal Server Error',     headers: Object [AxiosHeaders] {       connection: 'close',       'content-length': '317',       'access-control-allow-headers': 'User-Agent,Keep-Alive,Content-Type,X-API-Key,X-Ton-Client-Version',       'access-control-allow-methods': 'GET, POST, OPTIONS',       'access-control-allow-origin': '*',       'cf-cache-status': 'DYNAMIC',       'cf-ray': '8b1fa34f6b8a5167-HKG',       'content-type': 'application/json',       date: 'Mon, 12 Aug 2024 10:03:51 GMT',       nel: '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',       'report-to': '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=qFqbB983qMyA6gNn0odYWlQ%2BNmFCJKFdbDhYC3XODaie3zRhKXzns3fYUJwzVX65eq4qF254D05vsh0KkdsuujFGkmPRzBrmZlhpKXu860s0YpynIN9DoSyvyQnIU1G0x7kMCF9RzQ%3D%3D"}],"group":"cf-nel","max_age":604800}',       server: 'cloudflare'     },     config: {       transitional: [Object],       adapter: [Array],       transformRequest: [Array],       transformResponse: [Array],       timeout: 30000,       xsrfCookieName: 'XSRF-TOKEN',       xsrfHeaderName: 'X-XSRF-TOKEN',       maxContentLength: -1,       maxBodyLength: -1,       env: [Object],       validateStatus: [Function: validateStatus],       headers: [Object [AxiosHeaders]],       method: 'post',       url: 'https://testnet.toncenter.com/api/v2/jsonRPC',       data: '{"id":"1","jsonrpc":"2.0","method":"sendBoc","params":{"boc":"te6cckECMQEABGMAAUWIAeMW/yxvBHAlfeBi6f7RmpnoHbNaQ5YqW7d/5Rf23HawDAEBmefvaM8GRZVN0UBQQ27BktBD3JFIT/F4+A9ju34cSFZoCNG4f6RxgeuigfZRM543mN7MqtnYJFmhEQFHEB36Jg8pqaMXZrngD0YLSUnAAgICzAMiAgEgBBMCASAFDAIBIAYJAQMA4AcBZmIAeMW/yxvBHAlfeBi6f7RmpnoHbNaQ5YqW7d/5Rf23HawcxLQAAAAAAAAAAAAAAAAAAQgAJAAAAABIZWxsbywgVE9OISAjMAEDAOAKAWZiAHjFv8sbwRwJX3gYun+0ZqZ6B2zWkOWKlu3f+UX9tx2sHMS0AAAAAAAAAAAAAAAAAAELACQAAAAASGVsbG8sIFRPTiEgIzECASANEAEDAOAOAWZiAHjFv8sbwRwJX3gYun+0ZqZ6B2zWkOWKlu3f+UX9tx2sHMS0AAAAAAAAAAAAAAAAAAEPACQAAAAASGVsbG8sIFRPTiEgIzIBAwDgEQFmYgB4xb/LG8EcCV94GLp/tGamegds1pDlipbt3/lF/bcdrBzEtAAAAAAAAAAAAAAAAAABEgAkAAAAAEhlbGxvLCBUT04hICMzAgEgFBsCASAVGAEDAOAWAWZiAHjFv8sbwRwJX3gYun+0ZqZ6B2zWkOWKlu3f+UX9tx2sHMS0AAAAAAAAAAAAAAAAAAEXACQAAAAASGVsbG8sIFRPTiEgIzQBAwDgGQFmYgB4xb/LG8EcCV94GLp/tGamegds1pDlipbt3/lF/bcdrBzEtAAAAAAAAAAAAAAAAAABGgAkAAAAAEhlbGxvLCBUT04hICM1AgEgHB8BAwDgHQFmYgB4xb/LG8EcCV94GLp/tGamegds1pDlipbt3/lF/bcdrBzEtAAAAAAAAAAAAAAAAAABHgAkAAAAAEhlbGxvLCBUT04hICM2AQMA4CABZmIAeMW/yxvBHAlfeBi6f7RmpnoHbNaQ5YqW7d/5Rf23HawcxLQAAAAAAAAAAAAAAAAAASEAJAAAAABIZWxsbywgVE9OISAjNwIBSCMqAgEgJCcBAwDgJQFmYgB4xb/LG8EcCV94GLp/tGamegds1pDlipbt3/lF/bcdrBzEtAAAAAAAAAAAAAAAAAABJgAkAAAAAEhlbGxvLCBUT04hICM4AQMA4CgBZmIAeMW/yxvBHAlfeBi6f7RmpnoHbNaQ5YqW7d/5Rf23HawcxLQAAAAAAAAAAAAAAAAAASkAJAAAAABIZWxsbywgVE9OISAjOQIBICsuAQMA4CwBZmIAeMW/yxvBHAlfeBi6f7RmpnoHbNaQ5YqW7d/5Rf23HawcxLQAAAAAAAAAAAAAAAAAAS0AJgAAAABIZWxsbywgVE9OISAjMTABAwDgLwFmYgB4xb/LG8EcCV94GLp/tGamegds1pDlipbt3/lF/bcdrBzEtAAAAAAAAAAAAAAAAAABMAAmAAAAAEhlbGxvLCBUT04hICMxMY9Zj3I="}}'     },     request: <ref *1> ClientRequest {       _events: [Object: null prototype],       _eventsCount: 7,       _maxListeners: undefined,       outputData: [],       outputSize: 0,       writable: true,       destroyed: false,       _last: false,       chunkedEncoding: false,       shouldKeepAlive: false,       maxRequestsOnConnectionReached: false,       _defaultKeepAlive: true,       useChunkedEncodingByDefault: true,       sendDate: false,       _removedConnection: false,       _removedContLen: false,       _removedTE: false,       strictContentLength: false,       _contentLength: '1585',       _hasBody: true,       _trailer: '',       finished: true,       _headerSent: true,       _closed: false,       _header: 'POST https://testnet.toncenter.com/api/v2/jsonRPC HTTP/1.1\r\n' +         'Accept: application/json, text/plain, */*\r\n' +         'Content-Type: application/json\r\n' +         'X-Ton-Client-Version: 14.0.0\r\n' +         'User-Agent: axios/1.7.3\r\n' +         'Content-Length: 1585\r\n' +         'Accept-Encoding: gzip, compress, deflate, br\r\n' +

sunyoki: Are there any instructions on how to use tuple

KaKui: https://docs.ton.org/mandarin/develop/smart-contracts/tutorials/wallet#%E9%83%A8%E7%BD%B2%E9%AB%98%E8%B4%9F%E8%BD%BD%E9%92%B1%E5%8C%85 I have referred to the code of the document

Samuel Arthur: How . We are creating a bot that will notify us whenever there is a pool in notcoin mini app.    Please do you guys know how to get the notcoin api

KaKui: help me thinks (reply to 94044)

Chi: Hello, TON newbie here. I am migrating a Ethereum project to TON, it basically consists of two contracts: A and Oracle B, where B receive regular price info from off-chain and A queries B for latest price info. However EVM supports synchronous call so I can do B(address).queryPrice inside A's code. But in TON's world, that's impossible. So I am thinking if I should combine A and B into one big funC contract so I can access latest Oracle price stored in storage cell, otherwise go with separate contract A.fc and B.fc, reading the price and process the data would be real pain in the ass. What's the best practice here? Please advice

&rey: Big contract is fine generally. (reply to 94070)

&rey: That is, like, obvious? FunC Cookbook has a bit on that. (reply to 94044)

Chelsea: Looking for telegram mini app(not bot) developer for our mvp, who can start off right away. Dm me with expected compensation

Jacob: Hi, Chelsea. Please DM me (reply to 94078)

Nerses: how much will be fee for such message TokenTransfer {                                     queryId: queryIndex,                                     amount: commitObj.amount,                                     destination: commitObj.sender,                                     response_destination: myAddress(),                                     custom_payload: null,                                     forward_ton_amount: 2000000,                                     forward_payload: ("Uncommitted").asSlice(),                                  }.toCell(),   . is it good practise to specify certain number in forward_ton_amount ?

Minimal ☄️: How to change webAppVersion of https://telegram.org/js/telegram-web-app.js?  It's always set to 6.0 and I am unable to use any of the fields the telegram is offering?  I have newest version of Telegram, tried with reinstalling, tried with other devices

&rey: Yes. 0 in general, 1 if you need text comment to user's wallet, <some amount> if you need message to be processed. (reply to 94080)

&rey: This is off topic; please check in @devs. (reply to 94081)

Joel Mun: On TON you can use carry-value pattern. That is, you send a message containing the signed price information from the oracle and check the validity of the signature on-chain. That is how Redstone oracle works on TON. Check it out. (reply to 94070)

Nerses: in case i use such code in smart contract for Jetton transfer will it deplot jetton wallet contract for receiver in case it doersnt have,as i specified init code and data ?         send(SendParameters{                             to: lockObj.htlcJettonWalletAddress.loadAddress(),                             value: ctx.value,                             bounce: true,                             mode: 0,                             body: TokenTransfer {                                                 queryId: queryIndex,                                                 amount: lockObj.amount,                                                 destination: lockObj.srcReceiver,                                                 response_destination: sender(),                                                 custom_payload: null,                                                 forward_ton_amount: 1,                                                 forward_payload: ("Redeemed").asSlice(),                                              }.toCell(),                             code: lockObj.initCode,                             data: lockObj.initData,                                              }         );

𝓼𝓸𝓵𝓪𝓷𝓪ᅠ ᅠ: hello everyone, im new into this, what library can be used for ton development on c#(sorry for my english)

0xbera: can someone explain what happened to this transaction: https://tonviewer.com/transaction/f0ed52aced59a46841fcf28a0b7c8ea12212bb2fc28d31f2f9611c6d59cab1fa  it says "confirmed transaction" but also "exit code -14, out of gas error"  how can both of these be true?

Smart: how can i check connected wallet ,if it is testnet or mainnet address? i use ton/ton ts

Smart: found it: Address.parseFriendly("someaddress").isTestOnly (reply to 94101)

Орельан [NEVER DM FIRST]: Does anyone know why Jetton metadata sometimes will not show on Tonviewer but will on Tonscan? is it an ipfs problem?

User<7362018204>: Hello @Denish  Bohra

User<7362018204>: Are you here

Pegu: Is it possible to create a ton contract that receives jetton and forwards that jetton to another address?

Pegu: Is there any example / reference to this? (reply to 94118)

Prince: and it's simple. come on. you can do that (reply to 94121)

Pegu: I'm new to ton blockchain, any pointers? Do i based on Jetton Notify · 0x7362d09c, decode the message and send a transfer body message to the jetton wallet? (reply to 94124)

Crypto Valley: Are you guys only developing clicker games or do we see other Mini Apps soon? What's even possible with Mini Apps?  If some devs are interessted to team up, i'd have a really nice idea😀. DM's are open.

&rey: Is there a chance your job offer is suitable for @tonhunt? (reply to 94130)

Pegu: How do i know which jetton is it? The jetton notify internal message don't seem to contain the jetton address

&rey: Do you need to know that? Notification comes from jetton wallet, actually, so you just have to send message back to it. (reply to 94132)

Crypto Valley: Might be😊👍 (reply to 94131)

Pegu: Ahhhh, that makes much more sense (reply to 94133)

Pegu: thank you

Pegu: Hmmmm so I would only have to address of the sender

Pegu: Is it possible to forward the jetton to another address other than the sender?

Prince: yeah (reply to 94139)

Apple: Hi, @Chelsea, I'm very interested in your job. (reply to 94078)

@Bored 🐵: Hello, Chelsea I can handle your project, please dm me (reply to 94078)

User<6902275324>: I am interested in your project, feel free to ask me (reply to 94078)

EDITOR FRED: I'm Interested, what are we building? (reply to 94130)

&rey: You get notification from *your* jetton wallet. (reply to 94137)

Pegu: from the jetton notify itself? (reply to 94140)

EDITOR FRED: Done #Ton of things lately 😁 building things for fun 😌. I still want to build more. Any ideas ? or where I can contribute is welcome. NOTE: I'm only a Dev gat no money to invest 🧘

Pegu: yeah understood, the jetton notify will contain the from address right? (reply to 94146)

&rey: Open-source? My personal project https://github.com/ProgramCrafter/ratelance would benefit from a good UI. (reply to 94150)

EDITOR FRED: Wish it was built with js/ts other than py (reply to 94153)

&rey: Well there is JS (Svelte) frontend. Have I forgotten to publish it? (reply to 94154)

EDITOR FRED: I saw it, (reply to 94155)

EDITOR FRED: Anyone here who has use adsgram?

EDITOR FRED: I Published an update on the npm package yesterday. in case anyone is interested. It's built with typescript.

Pegu: I'm trying to build like a router / middleman contract for swap dexes. For those jetton swap that were rejected, it will be returned back to my middleman contract. I would like to auto forward it to the user that initiated the swap through the middleman contract.   Is it possible to do the forwarding? From how I'm seeing, I need to save the user's address that initiated the swap using query ID?  Sorry if I'm asking dumb questions

H: hi , i mint an nft and in nft item contract i can see it is initialized and return the content and its not empty but it dosent show any data on wallet or tonviewr about metadata that i provided on_chain , what im missing ?? here is the code about constructing metadata : export function setItemContentCell_nft(content: itemContent): Cell {     console.log("content content content",content.image);          const itemContentDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())     .set(toSha256("name"), toTextCell1(content.name))     .set(toSha256("description"), toTextCell1(content.description))     .set(toSha256("image"), toTextCell1(content.image))            return beginCell()             .storeUint(0,8)             .storeDict(itemContentDict)             .endCell(); }

ㅤㅤㅤ ㅤㅤㅤmamad: /admin (reply to 94215)

Development: Hello, can you tell me how to include this library?

— 2024-08-13 —

D_d: hey guys how can I get defaul locale of the telegram?

Development: Hello, can you tell me how to include this library?  mathlib

User<7220633900>: Guys please help someone hacked my telegram account.. kindly recover it i was participating many airdrops so kindly requesting you to please recover it

User<7220633900>: Guys please help me to recover my project

User<7220633900>: /stat@combot

Development: Help please

TLG👽: What app you use for programming buddy (reply to 94239)

defany: Its vs code (reply to 94244)

wonderful: hi guys,If a transaction occurs with Ton, how should I determine if it is successful

Matthew: greetings my fellow indians

TKAINU: Hello everyone, can I ask if I can interact with smart contract through the build/jettonMinter.compile.js file and Ton contract address? I can't find any documentation about this, thank you very much.

sunyoki: https://github.com/ton-blockchain/token-contract/blob/main/scripts/minterController.ts

sunyoki: here (reply to 94249)

alex: Are you seeking a Web3 developer? I am currently looking for work and would be happy to discuss your project ideas. Please feel free to contact me to explore potential collaboration and visibility.

Pegu: I guess its not possible? (reply to 94159)

Max: Hey, @ruslixag   I've managed to successfully deploy the archive node, there was an issue with the ZFS pool that prevented the correct ZFS snapshot restoration. All is fine. (reply to 93507)

hentai8: Okay, thank u for your advice. (reply to 94009)

MM: Hello, everyone. I am an experienced blockchain developer with expertise in ton network I have already developed lots of dapps like presale, staking, farming, swap, NFT on ton network If someone is interested in me, please feel free to DM me.

Kapil: Staking of jetton token code

Ahmed: how to connect ton keeper with reactjs

Kapil: Can anyone tell me how to pass an empty dictionary in the blueprint while testing

User<7220633900>: Guys please help someone hacked my telegram account.. kindly recover it i was participating many airdrops so kindly requesting you to please recover it

User<7220633900>: Guys could you please help me out

EDITOR FRED: use cmd (reply to 94223)

UTKARSH: Hi,  I am looking for fullscreen and screen orientation support in mini taps  I cant find any api, Neither it supports default js apis  Also i can't open chrome web view, now you have telegram webview by default..  How do i do this for my users? Please help

sunyoki: How can the assets in the contract be transferred out

Kapil: It is giving exit code 9 error (reply to 94287)

sunyoki: Such as the usdt assets in the contract

Kapil: I am creating a staking jetton contract and I am passing the dictionary for mapping the value from the address to amount the transaction is completed but the data is not stored. I am find the error that I am not able to pass the empty dictionary.due to which the different address of the contract is generated.

Kapil: It's is calling some different contract.

prodvd: I am looking for funC and tact developer who can work on meme with tax. For more details, please join in  @bullrun_ton_dev

User<6764095230>: With pretty experience in dApps, I can handle UI/UX design, smart contract development and web3 integration if you need my service.

Ruslan: Hi, Max! Glad to hear! (reply to 94276)

TKAINU: Hello everyone, I'm wondering about the relationship between jetton wallet and jetton minter in the stable coin contract. If I deploy jetton minter, can it run like an erc20 contract on EVM? And what is the running order of these files? For me, there is another question: how to interact with the smart contract from the BackEnd, can I use the address contract and the build/jettonMinter.compile.json file?

Xander: What's the most straightforward way to set up my smartcontract environment? Trying to connect a .fc to my front end  but always having issues either with the compiler or smth else? I've read through the docs and everything but feel like someone here might be able to point me in the right direction please 🙏

Shadow: Hello! Why do the reserves sometimes update when I provide liquidity, but other times they do not? Is the reason in amount of liquidity? how i can calculate the rights amounts? ston-fi pool

Nguyễn Linh: Is there any good way to estimate jetton transaction fee?

Sergey: Hi all, can anyone provide resources on smart contract security on TON, besides tips from documentation? I've seen a CTF like for Solidity contracts, but for 2022, maybe there are such things somewhere else?

Maksim: probably you have slow disk. what’s your disk’s iops? (reply to 93986)

Serhii: Where can I find my liteserver's ed25519 public key on my node machine?  /var/ton-work/db/config.json doesn’t have it

Peng: It should be auto generated with init.sh (reply to 94332)

Peng: /var/ton-work/db

Peng: Should be inside here

Peng: The file name is liteserver.pub if im not mistaken

Milad: what library i can use for Hierarchical Deterministic for ton wallet ? nodejs and typescript

Serhii: maybe it’s /var/ton-work/keys/liteserver.pub? (reply to 94338)

Peng: Erm i dont have a key folder for mine its just in db (reply to 94340)

Serhii: I don’t have any keys in db folder agh… maybe they changed location in mytonctrl2

Peng: Are u using docker or something? (reply to 94340)

Serhii: no, plain ubuntu

Peng: Ah u are using mytonctrl2

Peng: I remember the thing is generated by init.sh script Maybe u can check there

Kapil: Is the anyway of debugging in the ton just like Solidity

Serhii: are you talking about debugging a transaction? you can use retracer.ton.org (reply to 94348)

Kapil: For the contract

Serhii: you can check the docs: https://docs.ton.org/develop/smart-contracts (reply to 94351)

Nerses: how to convert TON API fetch data to JSON format ?

Peng: Ton indexer or ton http api (reply to 94354)

Kapil: store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)

Dave: Hello guys. Trying to create a telegram mini app. Already read the tutorial and I linked my website url to the bot menu. The problem is I am trying to download an image from my website. Normally, it works fine but when I open it as a telegram mini app, I can't download the image. On chrome dev tools it says download is not allowed. Any workarounds for this ? Is it not possible to save an image in telegram mini apps ? Thanks you in advance for any help!

ashes: Why in this case i get 708 exit code, should I forward something else than emptySlice?  send(SendParameters{ to: self.contractJettonWallet!!, value: 0, mode: (SendRemainingValue + SendIgnoreErrors), bounce: false, // 0x7362d09c - notify new owner body: TokenTransfer{ queryId: now(), amount: msg.amount, destination: context().sender, response_destination: myAddress(), custom_payload: null, forward_ton_amount: ton("0.01"), forward_payload: emptySlice() }.toCell() } );

Cat: Hi! Could you please tell me what this error code means? I can't find it in the documentation.  Unable to execute get method. Got exit_code: -13

Sunil | Aerius Labs: is there any doc on how to write upgradable contracts in tact ?

Dave: Anyome has an idea for a workaround on this ? (reply to 94360)

&rey: Yes. Forward payload should contain zero bit in such a case. (reply to 94363)

ashes: When I tried to do that, I got 709, does it mean that I have to send also some value of ton? (reply to 94371)

&rey: from pytoniq import LiteBalancer import asyncio  wallet_addr = ''  async def main():     provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()          state = await provider.get_account_state(wallet_addr)     balance = state.balance     print(balance / 1e9, 'TON')          await provider.close_all()  asyncio.run(main()) (reply to 94369)

User<7315837098>: Hello, we are lооking for emрlоyees for a crypto рroject: Beta tester ($37/hour) Moderator ($400/week) NFT artist (to be discussed) Advertisers (to be discussed) Web Developer (to be discussed) If you are interested in collаborating, plеase send me a DM!!!

Nerses: can Jetton transfers be bouncable ?

yash: I’m looking to get a scalable telegram clicker mini app created, who can help? please text.

L: I can help you. Please dm me (reply to 94376)

&rey: And that is already in the chat! https://t.me/tondev_eng/71244 (reply to 94377)

&rey: No, their "bounce" must be done manually. (reply to 94375)

Nerses: for example the smart contract to whom is sent jettons but with wrong message(i mean with wrong payload e.g.) then on whose side that manual bounce should be done ? (reply to 94383)

&rey: Contract must return those jettons. Preferably set zero forward TON so that source contract cannot attempt to resend. (reply to 94384)

UwU•JJ: Have anyone encounter some error like this?   TonClient error: Tonlib error (Method: RawSendMessageReturnHash, code: 500, message: LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 16E5881DCC11EA05F49E4329488D7BEAA557D84E8FEA7F423691AE6812A4A9F8: exitcode=33, steps=23, gas_used=0 VM Log (truncated): ...te NOW execute LEQ execute THROWIF 36 execute PUSH c4 execute CTOS execute LDU 32 execute LDU 32 execute LDU 256 execute LDDICT execute ENDS execute XCPU s4,s3 execute EQUAL execute THROWIFNOT 33 default exception handler, terminating vm with exit code 33 )   I encountered this when trying to transfer Jetton via BackEnd, using Rust with Stonfi's tonlib-rs.  I really need a solution for this one, try all methods I could think of, read any issues/docs I could find related but no solution is found.

ashes: Works like this, not sure if its correct approach, but it works 🙂  SendParameters{     to: self.contractJettonWallet!!,     value: ton("0.000001"),     mode: (SendRemainingValue + SendIgnoreErrors),     bounce: false, // 0x7362d09c - notify new owner     body: TokenTransfer{         queryId: now(),         amount: msg.amount,         destination: context().sender,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.000001"),         forward_payload: beginCell().storeUint(0,1).endCell().asSlice() }     .toCell() } (reply to 94371)

Swapnil 🚀: We've noticed that clicker games tied to quests and rewards are gaining significant traction. This seems to be an effective strategy for building the top of funnel for projects. It appears that many projects are leveraging this same engagement approach.  Is there a plug n play model being utilised at the backend?

Kenny: Hi! I've heard that in TON, developers can control who pays for the transaction fee, i.e., the message sender or the receiving contract.  I've already known that transaction fee is the sum of the following 5: 1) storage_fees 2) in_fwd_fees 3) computation_fees 4) action_fees 5) out_fwd_fees  Now, I'm wondering who pays the fee under the case of INTERNAL messages. Is my following understanding correct?  The in_fwd_fees doesn't come into play in the case of internal messages. All 3 of the storage_fees, action_fees, out_fwd_fees are paid by the contract. For the computation_fees, if the contract calls accept_message or set_gas_limit functions, then the computation_fees will be completely paid by the contract. Otherwise if the contract doesn't call either of these 2 functions, the message value (toncoins which are attached to the message by the sender) will first be deducted. Only after using up the message value, the contract balance will begin to be deducted.

rack001: are sending links not allowed in chat?

rack001: I am trying to deploy a jetton using howardpen9's github repo called jetton-implementation-in-tact, but i keep getting error 500 when deploying through tonhub api, but when i use other api to send boc (like toncenter v2's sendboc endpoint I get Lite_server_unknown: cannot apply external message to current state: failed to unpack account state

rack001: has anyone previous used that repo to successfully deploy a jetton? if yes any help would be appreciated, the only change done is that i have replaced the mnemonic from mytonwallet

Cube: Can someone explain how to change current time of blockchain instance in jest tests? let blockchain: Blockchain;

Vladimir: Who are "we"? 😄

Shivam: On my way

nonam3e: blockchain.now = 1000000; (reply to 94429)

User<7347480327>: Hello, seniors. I wanna connect Bitget wallet which is supported in TON in Telegram Mini app. Please help me

User<7347480327>: Please check this video

Prince: be careful about scam, guys

Cryptskii: Could someone tell me why this test is failing?  it('should not allow transfer with zero address', async () => {         const zeroAddress = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');                  const transferResult = await nftItem.sendTransfer(deployer.getSender(), {             newOwner: zeroAddress,             value: toNano('0.05'),             forwardAmount: toNano('0.01'),             responseTo: deployer.address,         });          expect(transferResult.transactions).toHaveTransaction({             from: deployer.address,             to: nftItem.address,             success: false,             exitCode: 402,         });          const nftData = await nftItem.getNFTData();         expect(nftData.ownerAddress.toString()).toBe(deployer.address.toString());     }); });

frank-keller.ton: who knows what the problem is? nothing in the code is highlighted in red TypeError: Cannot read properties of undefined (reading 'slice')     at /home/nevantain/Desktop/code/func/less1/node_modules/@ton/blueprint/dist/utils/selection.utils.js:50:47     at Array.map (<anonymous>)     at findScripts (/home/nevantain/Desktop/code/func/less1/node_modules/@ton/blueprint/dist/utils/selection.utils.js:49:10)     at async run (/home/nevantain/Desktop/code/func/less1/node_modules/@ton/blueprint/dist/cli/run.js:17:59)     at async main (/home/nevantain/Desktop/code/func/less1/node_modules/@ton/blueprint/dist/cli/cli.js:91:5)

Vanya: Hello, I have a problem in rejecting transactions from my wallet   Can smb help me?

Prince: pls tell here

Kapil: If we don't provide the storage fee to the contract will it save the data

Kapil: For our contract

Prince: will never happend

x: Hello, fam how are you doing?

x: I have some issue in Mini app development

x: please help me

x: I have problem when the page scroll. On the web it works fine, but on mobile I have the following issues:

x: please check above image (reply to 94470)

x: So, how to solve it?

Vadzim: What ton indexer has most up-to-date data? Currently, i'm using tonapi streaming api for getting transactions with specific opcode, but maybe there is more convenient way of doing it?

Acr: Hello, there is no docker image available to run a full node or liteserver?

Acr: Ok juste found fmira21/ton-node-docker

$1m: Hello, I need a smart contact dev

$1m: If you can write a proper smart contract on TON blockchain, please signify

&rey: Please be careful of scams in DMs. (reply to 94495)

Bassel: I have an open question: I served my app on nginx and using ton domain. But in telegram only the header is working and nothing else. Tried normal domain on browser everything working there

Bassel: Can any one suggest me how to debug inside a telegram browser

Ali: Hi i want to speak with a TON smart contract developer

User<7106205946>: Please DM me. I'll help you. (reply to 94508)

User<5606596245>: Hi, what can I do to get wallet addresses from who sent and who received?  import requests   def get_transactions(address, api_key):     url = f"https://toncenter.com/api/v2/getTransactions"     params = {         'address': address,         'limit': 3,  # Укажите количество транзакций, которое хотите получить         'api_key': api_key     }     response = requests.get(url, params=params)     if response.status_code == 200:         return response.json()     else:         raise Exception(f"Error fetching transactions: {response.status_code}")   def parse_transaction_data(transactions):     parsed_data = []     for transaction in transactions.get('result', []):         # Извлекаем отправителя и получателя         from_address = transaction.get('address', 'Unknown')         to_address = transaction.get('destination', 'Unknown')         parsed_data.append((from_address, to_address))     return parsed_data   def main():     address = ''  # Замените на адрес, для которого хотите получить транзакции     api_key = ''  # Замените на ваш API ключ от Toncenter      try:         transactions = get_transactions(address, api_key)         parsed_data = parse_transaction_data(transactions)         for from_address, to_address in parsed_data:             print(f"From: {from_address}, To: {to_address}")     except Exception as e:         print(f"An error occurred: {e}")   if __name__ == "__main__":     main()

Tron Degen: Please can someone point me to how I can validate a ton address

User<5606596245>: ? (reply to 94517)

Tron Degen: I want to validate a ton address

Apple: I'm a right engineer for your project. Can we discuss more details via dm?

Apple: I'm very interested (reply to 94494)

Apple: I'm here. (reply to 94508)

User<7499757256>: Dm me (reply to 94508)

— 2024-08-14 —

Oguzhan: Hello, is the download function not supported in the mini app?

Qyver: Hello everyone! I’m trying to deploy a token from Python using the v2/blockchain/message endpoint. I’m getting an error: “cannot apply external message to current state: External message was not accepted,” with TVM exit code 33. What would you recommend in this situation?

User<6984952426>: Hi guys,  Is it impossible to use tdlib on TMA?

Alex: Hello everyone

Alex: I have a problem to analysis ton project

Alex: Who can help me?

Alex: const int op::new_stake = 0x4e73744b;  const int op::new_stake_error = 0xee6f454c;  const int op::new_stake_ok = 0xf374484c;  const int op::recover_stake = 0x47657424;  const int op::recover_stake_error = 0xfffffffe;  const int op::recover_stake_ok = 0xf96f7324;    const int op::ownership_assigned = 0x05138d91;  const int op::get_static_data = 0x2fcb26a2;  const int op::report_static_data = 0x8b771735;

Alex: please tell me about this.

gavin: What problem did you encounter? (reply to 94548)

Alex: thanks for asking (reply to 94553)

Alex: I don't know how to get this value 0x4e73744b, 0xee6f4554c ..

gavin: This is the opcode in the Ton contract. The contract needs to process the corresponding business logic according to this opcode. This opcode code is usually provided in the document. (reply to 94555)

gavin: You can write your own jetton master contract to achieve freezing, but this may be marked as a fraudulent contract (reply to 94559)

gavin: Yes, you can define a freeze and undo opcode to achieve this. You can take a look at the relevant documents of Jetton (reply to 94563)

User<6764095230>: Join Our Team of Web & Web3 Developers! Are you a skilled developer eager to work on groundbreaking web projects? We're on the lookout for talented Web Developers and Web3 Developers to become part of our innovative team.  If you're ready to contribute to exciting projects and advance your career, we'd love to connect with you!  How to Apply: Send your resume via direct message (DM) to join our team and elevate your career.

SACGRO: It can be developed (reply to 94567)

Kookie | KT 🥠: gm all, has any devs been able to minimise the size of the telegram mini-app bar and also run their games in an optimised landscape format?

🔥: i don't think we can do that yet (reply to 94576)

Kookie | KT 🥠: oh my bad we can't send images?

Kookie | KT 🥠: in terms of optimisation of the colour of the bar like what Hamster Kombat did, is there any reference guide that is publicly available (reply to 94577)

TKAINU: hello, I have cloned jetton contract and added some logic inside, but when I deployed, the contract lost contract_type=jetton_master, does this have any effect, and is there any way to fix it, thank you very much

TKAINU: please help me 😭 (reply to 94582)

Chelsea: Hiring dev for short term gig  - Trying to build mini app. Need someone capable of UI/client side part using  NextJS, ShadCN, and Tailwind.   setting up bots and overall point system, tap-related interaction, leaderboard, referral and item related stuff and co work with our dev who will care for BE related thing.  - timeline : who can start right away and deliver within this week.  - pay : suggest first  Contact me with portfolio and we write contract upfront cuz I got scammed few times before  Thanks

SACGRO: Can you DM me the designs? (reply to 94587)

Abcold: TypeError: axios_1.default.get is not a function     at TonClient4.getLastBlock (TonClient4.js:49:1)     at Object.getState (TonClient4.js:338:1). how to fix it please ? anyone?

Degen: Why can't tonconnect connect to okx web3 wallet?

Ali: Hi guys, is it possible to deploy the app( not a mini app) on the TON network?   Our project is web3 ride sharing and we want to deploy it on Solana Blockchain, but considering ton is in hype and I think have more TPS im interested to know if an we do it on ton or not

Nguyễn Linh: Is there any docs about account locked balance on ton blockchain?

Ali: Product allready designed and only need contract development (reply to 94595)

Kapil: I have made some changes in the jetton wallet contract and trying to send the transaction to the jetton staking contract.the data is not saved in the bloackchain for the jetton staking contract. Help me as early as possible.

Kookie | KT 🥠: For reference:  set Screen.fullScreen = true in Unity set document.fullscreenEnabled = true in JS canvas.requestFullscreen() in JS (reply to 94579)

Son: Hi. Why are there some basechain blocks aren’t included in any of the masterchain blocks when calling shards api? My understanding is that the basechain blocks should be included into a masterchain blocks to be finalized.

Kapil: What does the in_msg_body.empty_slice() function check in the body

&rey: They are acknowledged implicitly by blocks after them being included in masterchain. (reply to 94602)

&rey: So, if shardchain's blocks 100 and 103 are included in masterchain, then validity of 1-103 is affirmed.

User<6984952426>: Hi guys,  Is it impossible to use tdlib on TMA?

Kapil: Can anyone tell me that I am sending data in the message body but it is showing me as the in_msg_body as empty

v1t4l3y: Hi guys I remember there was a website where I can buy testnet tokens, could someone share the link ?

User<6984952426>: is there Dogs(miniapp) github repository link?

David: Hi, Does anyone know why the replay attack of this transaction is possible? tx1: https://tonviewer.com/transaction/a7a64f30a66deb8f2f70f37cc92349713d7b5552f18e4fe5a0ff731efd0402d0.  tx2: https://tonviewer.com/transaction/242fbaee39e4f0b37afa8e7fcf391be296bfd1813a711198b1de3fa488acc752

User<6984952426>: How can I get these information(account age, account level...)?

Shadow: hello, can someone help, please. How i can make transaction with 2 msgs and send it to ton-connect/ui-react for sign by user?

&rey: It's quite simple, isn't it? Just pass two messages in array. (reply to 94623)

Shadow: but the original method:  (method) TonConnectUI.sendTransaction(tx: SendTransactionRequest, options?: ActionConfiguration): Promise<SendTransactionResponse>  there is no possible to paste the array (reply to 94624)

&rey: Please look carefully inside SendTransactionRequest. (reply to 94625)

Shadow: oh, thank you ❤️

Son: Thanks a lot. Appreciate the clear explanation (reply to 94607)

Kookie | KT 🥠: Currently building out the campaign page for GTM and hit a snag on the telegram Mini-app API link back to twitter.  Has anyone been able to successfully create a button on TMA to auto-generate a tweet + attach campaign image (e.g. the kind where previously most protocols were launching 'quests' had their users post and share on CT based on the game score that they achieved)?  From a couple of interactions, it seems like its not feasible atm, and the closest workaround is posting on telegram stories.

Cat: Hi! Could you please tell me what this error code means? I can't find it in the documentation.  Unable to execute get method. Got exit_code: -13

Daniel: hey guys assuming i have this function  int keccak(slice s, int h) asm "HASHEXT_KECCAK256";    what if i want to pass in a payload thats more than 1023 bits and wont fit a single cell and hash it? is the recommended way to split that into a cell chain e.g. cell 1 -> cell 2 -> ... and then just turn cell 1 into slice and pass into the keccak function and it will automatically hash everything including the refs or is there another recommended way?

gavin: I think calculating hash for cells is a good idea

Daniel: hmm can you elaborate on this? (reply to 94640)

ehwangah: hello!

ehwangah: My app keeps getting rejected on the TON app application, can someone help?

gavin: You can read this document for more information  https://docs.ton.org/develop/func/stdlib#hashes (reply to 94641)

L: plz share screenshot (reply to 94643)

ehwangah: Now I can't even find it lol

Sammy: Blockchain developers, please contact me. We need to work on big project  If u don't have portfolio, please ignore this message.

L: What do you use to build it? (reply to 94650)

Smart: How to verify Func smart contract on tonviewer?

&rey: verifier.ton.org does that. (reply to 94657)

Smart: I tried

Smart: testnet,tonviewer,com/kQDKGHM7lftpwk0EKGmaTIW2b-n3N4ABucXexOHF92gYPOai?section=code  This is my contract.

Smart: verifier,ton,org/EQDKGHM7lftpwk0EKGmaTIW2b-n3N4ABucXexOHF92gYPF0o?testnet=  Verified in here

Smart: But still showing not verified

ehwangah: It's a PWA, just a webapp (reply to 94652)

NeTaM: /stat@combot

hentai8: 7200 iops.I see in the doc that the iops requirement is 64k, but does it really need to be that high in practice? I'm using AWS server, and the max IOPS I can set is 16k. (reply to 94331)

Kapil: I am sending data but my contract message body is throw error for the empty slice can someone help me plzz

Maksim: it is (reply to 94672)

hentai8: Okay, thanks bro. (reply to 94679)

Tames: Hello I am interested (reply to 94566)

Marin: Does anyone know how monthly user counts are calculated for mini-apps? Is this process automated?

Ali: i didnt use ********** in my text 😅 (reply to 94687)

Ali: I want to post a developer recruitment ad

Walter: Hello there, is there a devnet for ton?

Mr magic: Guys I want help

Mr magic: I received usdt token in ton network by mistake and now it is unusable

Mr magic: 500 Usdt

Mr magic: It was my payment for a work

Mr magic: Plz someone

Mr magic: Help me

Ma><im: good afternoon.  does the W5 wallet allow you to transfer Jettons without TON?

Mr magic: I am not that good with crypto

&rey: You do need a bit of TON (or Tonkeeper, if wallet is v5), but those USDT are not unusable. (reply to 94696)

[+_-]: Hi here👀 I faced with compilation problem and it's still pretty unclear to me, so I've made a research and here is what I found. I'm using global variables in my contract, including a dictionary to make my code more concise. However, I'm encountering this compilation error: [ 1][t 0][2024-08-14 11:02:50.371000][Fift.cpp:67]  top: <continuation 0xb261c8>     level 1: <continuation 0xb1e320> { <continuation 0xb266d0> } <continuation 0xb25b00> **HERE** <continuation 0xb1e508>      level 2: <continuation 0xb1e6a0> 1 31 <continuation 0xb3e698> **HERE** <continuation 0xb21640> <literal of type 4> <continuation 0xb23250> <continuation 0xb1e320> 5 <continuation 0xb1e070> <continuation 0xb41280>      level 3: <text interpreter continuation>  main.fif:365:       GETGLOB:Out of range In message I reply to - there said that it is not possible to use global variables with modifying methods right now, so I changed my code several and tried to get rid of such a places, but nothing has changed, so I'm here to ask for help. Also, I haven't found lots of materials about compilation troubleshooting and so on - so if anyone know couple of nice articles, or something else I may miss, don't be shy to share it; thanks in advance☀️ (reply to 15435)

Anton: Can you share a minimized example that can still reproduce the same error message? (reply to 94739)

L: No, it is impossible. You need some TON (reply to 94715)

[+_-]: What to you mean by minimized example? I thought that places, where I call modifying methods on global variables produces it, but seems like its not (reply to 94741)

[+_-]: (slice _value, int found) = this::some_dict~dict_delete_get?(ADDRESS_SIZE, pack_address(sender_address)); (reply to 94741)

&rey: Misleading: user by themselves can't, but with Tonkeeper battery they can. (reply to 94742)

[+_-]: But I believe that its is something else, I've been researching on how global variables works and especially GETGLOB opcode related to them: GETGLOB k ( – x), returns the k-th global variable for 1 ≤ k ≤ 31. Equivalent to PUSH c7; INDEXQ k. But the I have 14 global variables, not 31, so out of range here looks strange (reply to 94739)

Anton: A self-contained FunC file that I can try compiling locally. It does not have to include all your original code, just enough to reproduce your error (reply to 94743)

&rey: You have too much this::... global variables, probably. (reply to 94744)

Max: that bug was fixed long ago as suggested above, you probably have too many global variables (reply to 94739)

[+_-]: But I have never seen about global var limits, how can I found out about this more? (reply to 94749)

[+_-]: I have 21, there are 5 cells also

Dmitriy: Does anyone know how to get ton balance or make any transaction?  I'm using js sdk

L: You can use tonweb sdk (reply to 94753)

Apple: I'm very interested in you. (reply to 94566)

Dmitriy: I don’t understand where to get the keys - publicKey, secretKey (reply to 94754)

Dmitriy: now i use @tonconnect/sdk (reply to 94754)

L: Hmm. Don't need secretKey. Just use wallet address

Apple: I'm very interested in you (reply to 94587)

Dmitriy: in new version secretKey is required parameter (reply to 94759)

Dmitriy: Maybe you have an example of how to get a balance and make a test transaction? I think this could help me (reply to 94759)

L: Just a sec (reply to 94763)

Dmitriy: but now i use @tonconnect/sdk for auth   @tonconnect/sdk does not have the necessary functions for get balance and others (reply to 94764)

L: Dm me (reply to 94765)

Islom: hey guys, may be someone knows, how to find .json file of an NFT collection? I have the following piece of code from a test and to use it I have to specify the collection's content uri referring to a .json file. Let's assume it would be a not-coin .json file. Any help appreciated  NftCollection nftCollection = NftCollection.builder()                 .tonlib(tonlib)                 .adminAddress(adminWallet.getAddress())                 .royalty(0.13)                 .royaltyAddress(adminWallet.getAddress())                 .collectionContentUri("https://raw.githubusercontent.com/neodiX42/ton4j/main/1-media/nft-collection.json")                 .collectionContentBaseUri("https://raw.githubusercontent.com/neodiX42/ton4j/main/1-media/")                 .nftItemCodeHex(WalletCodes.nftItem.getValue())                 .build();

L2L2🎒: Where to get test token?

&rey: TON Connect is write-only. (reply to 94765)

Dmitriy: Need to use an additional library to perform transactions? (reply to 94782)

&rey: To perform transactions, no. To *read* from blockchain, yes. (reply to 94783)

TON Bounty Bridge: ​Asymmetric cryptography capabilities through TON Wallets via ton-connect SDK  🏷 Developer Tool  Summary:Allow the World to utilize current functionality of Wallet's Encrypted Messenger.  Rewards: • $1200 ton-connect modification • $ 200 ton-wallet  Created by wedvjin

Amjad: I have a token swapper running as a tg mini app the only issue is how do I connect the app with the user's wallet

Mark from DYOR.io: Hi, if you are a dev and have a working product or mvp, email me, there is a suggestion that you might be interested and be helpful 😉

Benjamin: Hi, we're doing a tournament in our game about TON and we're doing a Twitter space to introduce TON to our community. Would anyone from the TON team/community want to join as a speaker?

Sprotoz: What is your game about, Is there a way we can get access to it before the space? (reply to 94806)

Benjamin: It's an online first person shooter where we give a different token every week as a reward for a 3 days tournament. This week we will give TON (which we buy on the market) as a reward and we will brand the game about it with holograms, the starting screen etc.

Benjamin: Since you are a chain involved in the gaming space and especially Telegram games we thought it would be a great chain to showcase to our community

Benjamin: We've also made a Telegram game

Benjamin: I cannot post links here but our game is called Shockwaves, it's been released since last year and you can find it on the game launcher Elixir

Kraneed: Hi. Could you please tell me how to buy an expired TON domain? How can I initiate an auction?

Naman: Hey guys, what is the LiteClient 'console'?

Haint: Hello man, I'm having a problem with upgrading contract  I create a new version of my contract, with an additional global variable in storage. In the upgrade function, first I use set_code, then set_c3 so a method_id function is executed from the new code. Inside that function I set the new variable to a new value, then use set_data to save it. Problem is it keeps throwing exit code 7, and it would not if I comment out the set_data call. What do you think is going wrong? (reply to 94784)

Naman: In the GRAMCOIN howto link  they say " However, before running "pow-miner", you need to know the actual values of "seed" and "complexity" parameters of the chosen "proof-of-work giver" smart contract. This can be done by invoking get-method "get_pow_params" of this smart contract. For instance, if you use giver smart contract [REPLACE_GIVER_ADDRESS], you can simply type:      > runmethod EQDB8Mo9EviBkg_BxfNv6C2LO_foJRXcgEF41pmQvMvnB9Jn get_pow_params  in the LiteClient console and obtain output like: "

Naman: Is it a CLI tool? if so where do I find it? I cant find by googling LiteClient Console.

Apple: I'm very interested in you, and I hope to discuss more details. (reply to 94804)

TON Bounty Bridge: ​Add hide (scam/fishing) token functionality in TonKeeper Wallet  🏷 Developer Tool  Summary:The proposal aims to add a "hide token" functionality in the TonKeeper Wallet to allow users to conc...  Created by yashgo0018

Ali: Hi I did not enter the comment phrase while depositing ton. The deposit exchange said you must enter that. How can I solve this problem through TON network?

Development: Hello everyone,  I have been working on a smart contract using FunC for selling tokens. The goal is to accept 0.5 TON and issue 1 "next" token in return. I started by using code from the Disintar sale-dapp repository as a base, but I keep running into several issues during compilation.  Here is a summary of the problems I am facing:  Undefined Function store_data: The compiler throws an error saying that the function store_data is undefined. I have defined it in my contract, but it still isn't recognized during compilation.  Undefined Function msg_sender: Similarly, the function msg_sender is also reported as undefined. I attempted to replace it with get_sender, but the errors persist.  Issues with equal_slice_bits: The compiler also fails when applying the equal_slice_bits function, indicating a type mismatch between the slices I am comparing.  Here is a snippet of the code where the issues are occurring:  func

Development: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);      if (flags & 1) {          return ();     }      slice sender_addr = cs~load_msg_addr();     load_data();      if (equal_slice_bits(sender_addr, ctx_owner) & (in_msg_body.slice_empty?())) {         int op = in_msg_body~load_uint(32);          if (op == op_update_data) {             set_data(in_msg_body~load_ref());         } else if (op == op_update_code) {             set_code(in_msg_body~load_ref());         } else if (op == op_topup) {             return();         }         return();     }      if (msg_value >= required_amount) {         send_next(sender_addr, exchange_rate);     } else {         send_money_back(sender_addr, msg_value, "Insufficient funds for exchange");     } } I have tried several approaches to resolve these issues but have not been successful. I would greatly appreciate it if someone could help me identify what I might be doing wrong or suggest any fixes.  Thank you very much for your time and assistance.

Development: #include "imports/stdlib.fc"; #include "imports/messages.fc"; #include "imports/op_codes.fc";  global slice ctx_owner; global int exchange_rate; global int required_amount;  const int DEFAULT_EXCHANGE_RATE = 100000000;   const int DEFAULT_TON_REQUIRED = 500000000;     () init() impure {     ctx_owner = get_sender();      exchange_rate = DEFAULT_EXCHANGE_RATE;     required_amount = DEFAULT_TON_REQUIRED;     store_data();   }  () load_data() impure {     var ds = get_data().begin_parse();      ctx_owner = ds~load_msg_addr();     exchange_rate = ds~load_uint(64);     required_amount = ds~load_coins();      ds.end_parse(); }  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);      if (flags & 1) {          return ();     }      slice sender_addr = cs~load_msg_addr();     load_data();      if (equal_slice_bits(sender_addr, ctx_owner) & (in_msg_body.slice_empty?())) {         int op = in_msg_body~load_uint(32);          if (op == op_update_data) {             set_data(in_msg_body~load_ref());         } else if (op == op_update_code) {             set_code(in_msg_body~load_ref());         } else if (op == op_topup) {             return();         }         return();     }      if (msg_value >= required_amount) {         send_next(sender_addr, exchange_rate);       } else {         send_money_back(sender_addr, msg_value, "Insufficient funds for exchange");     } }  () send_next(slice recipient, int amount) impure inline {     var payload = begin_cell()         .store_uint(op::ft::transfer, 32)         .store_uint(0, 64)         .store_coins(amount)         .store_slice(recipient)         .end_cell();      var msg = begin_cell()         .store_uint(0x10, 6)         .store_slice(recipient)         .store_coins(1000000000)           .store_ref(payload)         .end_cell();      send_raw_message(msg.end_cell(), 64); }    () send_money_back(slice recipient, int amount, slice reason) impure inline {     var msg = begin_cell()         .store_slice(recipient)         .store_coins(amount)         .store_slice(reason)         .end_cell();      send_raw_message(msg, 64); }  () set_exchange_rate(int new_rate) impure {     if (equal_slice_bits(get_sender(), ctx_owner)) {          exchange_rate = new_rate;         store_data();     } }  () set_required_amount(int new_amount) impure {     if (equal_slice_bits(get_sender(), ctx_owner)) {          required_amount = new_amount;         store_data();     } }  () store_data() impure {     var cs = begin_cell();     cs = cs~store_slice(ctx_owner);     cs = cs~store_uint(exchange_rate, 64);     cs = cs~store_coins(required_amount);     set_data(cs.end_cell()); }  int get_exchange_rate() method_id {     load_data();     return exchange_rate; }  int get_required_amount() method_id {     load_data();     return required_amount; }  slice owner() method_id {     load_data();     return ctx_owner; }  cell config() method_id {     return get_data(); } (reply to 94884)

— 2024-08-15 —

0xtitn: is there any ton dapp developer here?

0xtitn: how can I deploy smart contract on the testnet?

Sol: Yes (reply to 94886)

User<7483137682>: it is possible (reply to 94886)

Development: I really hope that you can help me, because I can’t cope on my own for the third day

Prince: How can we help you?

SACGRO: Yes it's possible 100% (reply to 94595)

Development: #include "imports/stdlib.fc"; #include "imports/messages.fc"; #include "imports/op_codes.fc";  global slice ctx_owner; global int exchange_rate; global int required_amount;  const int DEFAULT_EXCHANGE_RATE = 100000000;   const int DEFAULT_TON_REQUIRED = 500000000;     () init() impure {     ctx_owner = get_sender();      exchange_rate = DEFAULT_EXCHANGE_RATE;     required_amount = DEFAULT_TON_REQUIRED;     store_data();   }  () load_data() impure {     var ds = get_data().begin_parse();      ctx_owner = ds~load_msg_addr();     exchange_rate = ds~load_uint(64);     required_amount = ds~load_coins();      ds.end_parse(); }  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);      if (flags & 1) {          return ();     }      slice sender_addr = cs~load_msg_addr();     load_data();      if (equal_slice_bits(sender_addr, ctx_owner) & (in_msg_body.slice_empty?())) {         int op = in_msg_body~load_uint(32);          if (op == op_update_data) {             set_data(in_msg_body~load_ref());         } else if (op == op_update_code) {             set_code(in_msg_body~load_ref());         } else if (op == op_topup) {             return();         }         return();     }      if (msg_value >= required_amount) {         send_next(sender_addr, exchange_rate);       } else {         send_money_back(sender_addr, msg_value, "Insufficient funds for exchange");     } }  () send_next(slice recipient, int amount) impure inline {     var payload = begin_cell()         .store_uint(op::ft::transfer, 32)         .store_uint(0, 64)         .store_coins(amount)         .store_slice(recipient)         .end_cell();      var msg = begin_cell()         .store_uint(0x10, 6)         .store_slice(recipient)         .store_coins(1000000000)           .store_ref(payload)         .end_cell();      send_raw_message(msg.end_cell(), 64); }    () send_money_back(slice recipient, int amount, slice reason) impure inline {     var msg = begin_cell()         .store_slice(recipient)         .store_coins(amount)         .store_slice(reason)         .end_cell();      send_raw_message(msg, 64); }  () set_exchange_rate(int new_rate) impure {     if (equal_slice_bits(get_sender(), ctx_owner)) {          exchange_rate = new_rate;         store_data();     } }  () set_required_amount(int new_amount) impure {     if (equal_slice_bits(get_sender(), ctx_owner)) {          required_amount = new_amount;         store_data();     } }  () store_data() impure {     var cs = begin_cell();     cs = cs~store_slice(ctx_owner);     cs = cs~store_uint(exchange_rate, 64);     cs = cs~store_coins(required_amount);     set_data(cs.end_cell()); }  int get_exchange_rate() method_id {     load_data();     return exchange_rate; }  int get_required_amount() method_id {     load_data();     return required_amount; }  slice owner() method_id {     load_data();     return ctx_owner; }  cell config() method_id {     return get_data(); } (reply to 94896)

Development: Hello everyone,  I have been working on a smart contract using FunC for selling tokens. The goal is to accept 0.5 TON and issue 1 "next" token in return. I started by using code from the Disintar sale-dapp repository as a base, but I keep running into several issues during compilation.  Here is a summary of the problems I am facing:  Undefined Function store_data: The compiler throws an error saying that the function store_data is undefined. I have defined it in my contract, but it still isn't recognized during compilation.  Undefined Function msg_sender: Similarly, the function msg_sender is also reported as undefined. I attempted to replace it with get_sender, but the errors persist.  Issues with equal_slice_bits: The compiler also fails when applying the equal_slice_bits function, indicating a type mismatch between the slices I am comparing.  Here is a snippet of the code where the issues are occurring:  func (reply to 94896)

0xtitn: who knows tact?

Development: Thank you for your response, but unfortunately, it didn’t help solve my issue. I’m looking for more specific information to address a particular error/question. Could you please provide a more detailed instruction or point me to the exact section in the documentation or course where I can find the solution? (reply to 94905)

Dylan: Anyone here will come to Token2049 SG?

Sixone: hi

Sixone: is there a way to covert public key to address (with js code) ?  many thank

Haint: Hi everyone, if there's anyone having experience in upgrading ton contracts I'd really appreciate if you can help me with this  it looks like there's a problem with the call to an impure method_id function after calling set_c3(new_code.begin_parse().bless()) In that function if I call set_data, it will throw an exit code 7 However if I dont call the method_id function to upgrade data, but instead moving the set_data call to right after set_code and delete the set_c3, it worked perfectly... (reply to 94823)

Haint: But that's what I want to do: calling the new function in the new code, because I need to add another variable to the storage (reply to 94935)

pepper: When an Active wallet receives a TON, the recipient pays a small "Gas fee". Can this be pre-calculated and sent with the remittance? We are currently using the tonnconnect sdk. Thank you.

Haint: yes, that's basically what I'm doing, based on this:  https://github.com/HipoFinance/contract/blob/91291c5bfc5da61467d065c6ccd121f0308490e4/contracts/treasury.fc#L1683-L1719  in the upgrade_data function, if I use set_data there, it will throw exit code 7. But if the same set_data code is moved after set_code and I dont call set_c3, then it works (reply to 94943)

&rey: Gas fee can be precalculated; after all, it is constant for wallet version. *Storage* fee is harder. (reply to 94941)

Linh: hi everyone. I'm newbie with this platform. Nice to meet you guy

0xbera: smart contract interactions are asynchronous on TON chain, so, can we end up in a situation where wallet w1 sends an internal message with a transfer to another wallet w2 in block B1 but w2 processes the transfer message 2 blocks later (B3) .. if yes, when do the balances for w1 and w2 change?

Milad: Why this bot not working? @testgiver_ton_bot I need som ton in test net

&rey: Balance for w1 changes during its transaction in B1. Balance for w2 changes in B3.  Undelivered messages also hold some TON, not only contracts' balances. (reply to 94948)

Root: I'm using tonkeeper extension. 2 hours ago, without any operation on my part, my ton address configured a contract and transferred all my 19 tons. Is this normal?

&rey: It could've migrated assets to a newer wallet. If private keys (mnemonic) was leaked, your funds could be taken. (reply to 94951)

Root: How can I take these assets back (reply to 94952)

Root: Do you mean this is tonkeeper’s measure to protect my assets?

Haint: yes inside I call set_data, but with the structure of the new data (including a new variable) (reply to 94957)

Alexander: What's the reason my question related to dApp was deleted?

Alexander: What to do if editing menu button neither disabling it doesnt work to start mini App? It persists the same, it's been days and nothing changed, tried multiple devices.

&rey: You cannot do so if they were transferred to an attacker. (reply to 94955)

&rey: Because it is offtop for this chat; please use @devs. (also refers to @wsaox ) (reply to 94959)

Alexander: Thank you (reply to 94964)

Haint: yes, for example old data is  begin_cell().store_uint(version, 8).end_cell()  new data has this structure:  begin_cell().store_uint(version, 8).store_uint(new_variable, 16).end_cell() (reply to 94963)

Haint: this code works if you use it directly after set_code, but after set_c3 and in the upgrade_data it wont work

Root: 😭That's very fuck!!!  I have no idea what went wrong. Thank you very much (reply to 94962)

pepper: Thanks for the reply! For example, if I calculate gas_fee with an empty Cell, as in the js code below, the gas_fee will be 0, which is not the actual gas price paid by the recipient. How can I calculate the gas_fee correctly?  const endpoint = await getHttpEndpoint({ network: "testnet" }); const client = new TonClient({ endpoint });  const cell = beginCell().endCell();  const estimatedFee: any = await client.estimateExternalMessageFee(   Address.parse(address),   {     body: cell,     initCode: null,     initData: null,     ignoreSignature: true,   } ); (reply to 94946)

Jupiter: I'm going (reply to 94918)

eg: Hey guys! Trying to get my map from contract using TonClient, but mapping is empty (though I know it's not):  contract in Tact:  struct Fight {     owner:                  Address;     createTime:             Int;     finishTime:             Int;     baseAmount:             Int as coins;     amountPerRound:         Int as coins;     rounds:                 Int;     maxPlayersAmount:       Int;     players:                map<Int, Address>;     playersCurrentLength:   Int;     playersClaimed:         map<Address, Bool>; } ... currentFights: map<Int, Fight>; ... get fun currentFights(): map<Int, Fight> {     return self.currentFights; }  js: (async () => {     let { stack } = await client.runMethod(       contractAddress,        'currentFights'     );          let result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), {         serialize: function () {             return         },         parse: function () {             return {}         },     }, stack.readCellOpt())     console.log(result) })().catch(e => console.error(e));  result: Dictionary {   _key: {     bits: 257,     serialize: [Function: serialize],     parse: [Function: parse]   },   _value: { serialize: [Function: serialize], parse: [Function: parse] },   _map: Map(1) { 'b:0' => {} } }

Haint: it's exactly like the link I posted above, just that in the upgrade_data I call set_data in it thank you anyway, for now I changed my approach, I added the temp variable to the storage in the first deploy so later I dont have to change the storage layout (reply to 94974)

AB: hello everyone  I am experiencing an issue with a smart contract I’ve developed on the TON blockchain. Specifically, I’m having trouble with a token transfer function within my lottery contract. The token transfer is not occurring as expected, and I am unable to determine the cause of the problem.   message TransferRequest{     amount : Int; }  contract AB with Deployable{  contractJettonWallet : Address;  init(addrss : Address){     self.contractJettonWallet = addrss; }   receive(msg : TransferRequest) {          let init: StateInit = initOf JettonDefaultWallet(self.contractJettonWallet,context().sender);           let walletAddress: Address = contractAddress(init);      send(SendParameters{     to: walletAddress,     value: ton("0.001"),     mode: (SendRemainingValue + SendIgnoreErrors),     bounce: false,     body: TokenTransfer{         queryId: now(),         amount: msg.amount,         destination: context().sender,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.000001"),         forward_payload: beginCell().storeUint(0,1).endCell().asSlice() }.toCell() }) }  }

&rey: You need to send message to contract's jetton wallet, not to sender's one. (reply to 94978)

the_renovatio: hello, is there any way without tonapi to get all tokens which are held by an address? like the /v2/accounts/{account_id}/jettons endpoint of tonapi. just purely via pytoniq?

sunyoki: What does this symbol mean

TON Bounty Bridge: ​Vue.js UI Components Library for Telegram Mini Apps  🏷 Developer Tool  Summary:Introduction:While there are existing UI component libraries built on React for Telegram Mini Apps, ...  Created by flexscss

sunyoki: hi

Prince: what is this? (reply to 94996)

Ali: my text get ignore by bot here

Jacob: In my opinion, 'jetton_wallet' : This is the standard and more feature-rich implementation of a Jetton wallet. It supports advanced functionalities such as complex operations, interactions with smart contracts, and potentially more security features.    'jetton_wallet_simple' : As the name suggests, this is a simpler version of the Jetton wallet. It is designed for basic operations, with fewer features and possibly less complexity in terms of code and functionalities. It is typically used for straightforward use cases where advanced features are not necessary.

Ali: i want to know difference between jetton _wallet and jetton_wallet_simple (reply to 94996)

Ali: and wallet_v4r2 (reply to 95006)

Jacob: jetton_wallet_simple is a lighter, more basic implementation compared to the more comprehensive jetton_wallet.

Ali: It is strange why there should be so many different types and not one unified thing like other blockchains (reply to 95005)

Prince: That is ton's attractive, I think

Prince: everything is contract on Ton chain

User<7106205946>: Jettwon wallet is the full contract for managing jettons(TON tokens). And also it supports sending, receiving, burning, and other operations on jettons. At this stage, each jetton type has its own unique jetton wallet contract instance. And then it requires a small amount of TON for deployment and gas fees. (reply to 95006)

User<7106205946>: But in other wise, jetton wallet simple can be called as the  lightweight and simplified version. it supports basic send and receive operations for jettons and the shared contract instance can handle multiple jetton types.

Prince: Rather than asking here, I think you should read whitepaper.

Prince: oops. link is not allowed here?

Prince: docs.ton.org/learn/docs

User<7106205946>: If you need full control and flexibility over jetton management, including advanced functionalities such as burning, allowances, it's good to choose jetton wallet. (reply to 95006)

User<7106205946>: and if you only need the basic send and receive functionality and want to minimize gas fee and deployment complexity, jetton wallet simple will be more suitable. (reply to 95006)

Prince: Have you heard about Dogs scammer?

User<7106205946>: No, never. What's this? 😊 (reply to 95021)

Prince: we know about famous dog mini app

Prince: and with that, one guy created the pool on stonfi and dedust. people bought it and REMOVED! that guy owned more than 50K

User<7106205946>: Wow... incredible. (reply to 95024)

User<7106205946>: anyway, I'm sure that jetton wallet supports the stronger security and other features. (reply to 95006)

Prince: Unlike solana, Ethereum, even Ton has verify site but almost contracts aren't verifed...

Prince: it's really dangerous I think

Prince: How can people trust Ton chain if this continues?

User<7106205946>: wallet v4 supports the improvements over the standard version, likely including better user experience, additional functionalities, and optimizations for performance. (reply to 95007)

White 🐾: I have the problem when add liquidity to stonfi. I can not use dex v2 api

White 🐾: Can anyone know how to use it?

David: How can I build a ref system for my mini app like dogs. Users receive others' ref link and start the mini app. I cannot still get the ref param. I'm currently using telegraph, grammy

HunWu: Anyone know where can I find the implement of testnet indexer api? I only see older version of mainnet indexer api, which is on github.

&rey: You should ask in appropriate chat, @twa_dev. (reply to 95038)

David: thanks buddy (reply to 95040)

0xbera: I have a ton full node up and running -- how do I connect to it as a liteserver?

Arthur: Admin please  why did you ban my other account . @leaderarthur1.   Please i am not a spammer or doing anything bad . Just wanted to ask a question about  lost dogs of which i was planning to build a bot so   that i can use the bot for vote analysis .   You should have tell me if that question wasn't allowed here . But you banned me which might affect my telegram account aslo .   I am a supporter in ton society chat (you can check for yourself) and i can't spam here because i am also helping to build the ecosystem (reply to 95040)

0xbera: found it here: https://docs.ton.org/participate/run-nodes/enable-liteserver-node#installation-of-liteserver (reply to 95043)

Dung: hi, Anyone transfer USDT from wallet to wallet using python or JS?

Harry: Hi, may i ask a question?  We generate TON wallet for our users. If the user does not deposit $TON tokens into the wallet for a long time, will the wallet be invalidated on chain due to the lack of $TON tokens to pay for on-chain storage fees, resulting in the wallet being permanently unavailable?

Harry: i just saw the wallet contract 'valid' definition in the doc, so a little confusing

JT: Im not sure my understanding is correct. First, wallet can be inactive. And Owner still can reactivate by attaching an amount of TON to pay storage fee (upto that time) + tx fee (reply to 95055)

JT: As I also read, Validator can free-up the storage data but keeping the hash of last state. So when owner needs to reactivate, must submit its wallet data to verify the ownership

JT: Thats what I understand. Need someone else confirm it

TON Bounty Bridge: ​Expanding Geti SDK: Empowering Secure Smart Contract Audits for the TON Blockchain  🏷 Developer Tool  Summary:The Geti SDK is a developer tool designed to streamline the auditing process for smart contracts wit...  Rewards: • Estimated Suggested Reward: $15,000 USD  Created by doyeninnit

Harry: Thank you so much bro for clarifying this for me. Let's still wait and see how the official guys reply for this. (reply to 95058)

Prince: why do you ask here?

Prince: @devs

Makis: Does anyone know the difference or tradeoffs with using SSE vs websockets to get live blockchain data? For example I see examples on github with SSE that don't require a TON console key. Do they have limits? Anyone know

Makis: also lets say I manage to use on of these and get live swap transaction hashes. When using an indexer it seems like it takes a while for it to be able to return the tx data. If I miidiately query it it returns null. Is there a way around this. So to stream the swap data and not just the tx_hash?

nooptr 🌊 Wave: Help me!!!  first, i deposit usdt from binance to wallet address in ton space. And i received usdt.  Then to join wallet earn i need to have usdt in wallet. I transferred usdt from ton space to wallet. When transferring there are 2 options: telegram or external wallet. I chose telegram. Then i transferred 4997 usdt. But i still haven't received usdt.  What should i do?

nooptr 🌊 Wave: in wallet, it show this

&rey: How is issue of a custodial service related to development on TON?

Tn: Hm

Haint: hey man, how to decode a raw body of a message taken from tonviewer? I've tried Cell.fromBase64 but it gives Error: Invalid magic for this data  b5ee9c7201010201005d0001ab19c2b3810000000000000000801fb0366ae9156281d8b766f00485f96ee5cf96f50560125662949b14890922c1800000003e4e6b080a493789fe9d27091e230411979c91542c742b7be74e90077e014df3cc9c16b5380100040000 (reply to 95099)

Alfred: I am not quite sure about the detail. But I think it should be external message, which is sent to the contract and the contract pay the gas (reply to 95095)

Alfred: Then I think it can be a master contract there and child contract for each user. You can ask the user to create the signature and then you can use your protocol wallet to send the transaction carrying the signature and required info to the master contract and forward it to the child contract. Verify and execute.

Alfred: If you wanna sponsor the gas, then the transaction has to be created by your wallet, carrying enough data to verify and execute later.

Lucas: When TON domains are bought or when fragment.com username assets are bought for the first time... the burning of the TON.... does it happen instantly?  does somebody know?

Prince: all possible, I think (reply to 95132)

Prince: Even exists, you should mint jetton and deploy jetton contract for your own idea (reply to 95132)

Prince: But we should consider it. (reply to 95132)

TON Bounty Bridge: ​Ceo  🏷 Developer Tool  Summary:Ton  Created by Jerry071097

&rey: For transferring is very much easier. (reply to 95132)

Mikhail: Hello everyone, I started studying tonconnect/ui-react and I had a problem with the TonConnectButton, namely the wallet connection. The button works technically, the ui changes, the address is displayed, but when logging the wallet data, undefined is always displayed in the console. Please help (  const App = () => {   const tonConnectUI = useTonConnectUI();    const handleLogWalletInfo = () => {     const currentWallet = tonConnectUI.wallet;     const currentWalletInfo = tonConnectUI.walletInfo;      console.log('Current Wallet:', currentWallet);     console.log('Current Wallet Info:', currentWalletInfo);   };    return (     <div>       <TonConnectButton />       <button onClick={handleLogWalletInfo}>         Log Wallet Info       </button>     </div>   ); };

Эльдар: What's difference between load_int and preload_int?

&rey: Latter does not remove loaded integer from slice. (reply to 95149)

Goodbye: Somebody knows how to fix blueprint on Windows?

sheh: Please explain, I’m creating an address on the TON test network, and these are the formats:  1 — return address -> kQDJOLE4NL9QPjN5RaE8GCPkplMw6Hua-gILnOWLIYYBgeB3 2 - non-disabled address -> 0QDJOLE4NL9QPjN5RaE8GCPkplMw6Hua-gILnOWLIYYBgb2y 3 - EQDJOLE4NL9QPjN5RaE8GCPkplMw6Hua-gILnOWLIYYBgVv9  What is this 3rd format? what should i call it anyway?   Which of these addresses should I give the user so that he sends TON on a regular basis? each wallet displays different formats, and I’m kind of confused

&rey: user-friendly, bounceable, mainnet-suitable. (reply to 95171)

Development: Please tell me if a smart contract can store tokens? or are they on the jetonn wallet?

sheh: saw on https://ton.org/address/  but it's not clear to me, why it shows it on the main network if it's testnet? (reply to 95172)

&rey: All TON are inside blockchain on smart contracts; a bit similarly, all jettons of given kind are within jetton wallets system. Smart contracts can own jettons, but those are stored in a separate contract = jetton wallet. (reply to 95173)

🐸🐍🦒🍅♥️ 🧠🦁️ Meksud🐾✌️Yescoiner 🦆📦 Bums: Hey

Ƥυrу: i created a wallet with python i want to connect this wallet to a conncetor  (dApp) with ton_proof signature is it possible ?

Mars: hey guys new to the ton eco system i have not habbits about to get started  any pro cons with tact vs func

— 2024-08-16 —

.: Hi, I downloaded all of the transactions from the Fragment wallet to do some data research. I want to find what username was sold for the most ammount (USD value at the time). I filtered the customers.csv file from the ton console for all rows containing "Auction proceeds for XZY minus conversion fee and royalties.". But ALL of them have a ton_value of 4. Why?!

Ƥυrу: yes im reaching  i read tonkeeper wallet source and writing it for python 😂 (reply to 95217)

sangmin: How do I use the tonweb library to wallet init?

sangmin: I sent it using tonWallet.methods.transfer, but it was bounced.

sangmin: Destination address is nonexist status. I just created a new on (reply to 95222)

Jenya: Is there an example of how to put metadata into the jetton init? I saw some on the old js library “ton”, is there something new? Because the new one doesn't have beginDict

sangmin: Can you tell me how to do it? (reply to 95226)

sangmin: i sent 1 .. my tx https://tonviewer.com/transaction/97db81a6387bc611728043e56fa93baa6aa032d915cf8c2ec746e7311640cf9e (reply to 95230)

sangmin: At the destination address, I received 1TON and returned it immediately. So, the destination address does not have TON. (reply to 95233)

Ƥυrу: how to create StateInit for my wallet ?

sangmin: Yes, I used the tonweb library. (reply to 95236)

peter: Hi guys, anyone know where i can see the Gram coin Giver's source code?

sangmin: https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/README.md  Do I have to do all the Deploys here? (reply to 95243)

PtcBink: Hi

smartestdummy: Gm guys. I can't seem to switch to testnet mode on my tonkeeper, any tips guys?

smartestdummy: Found it.. thanks (reply to 95249)

Daniel: hmm i read this but dont understand how it pertains to my use case  1. TON cells have a maximum capacity of 1023 bits of data. 2. When dealing with large data structures that span multiple cells, we need a way to compute a single hash that represents the entire data structure.  how can we do 2 in func? for e.g. if i have a payload that's like 3069 bits and its passed into a function as a forward-linked chain (cell 1 (first 1023 bits) -> ref cell 2 (next 1023 bits) -> ref cell 3 (last 1023 bits), how can i run keccak256 on this payload as if it was one big data structure? (reply to 94644)

PtcBink: Can you share a minimized example that can still reproduce the same error message? (reply to 94739)

Matthew: greetings my fellow indians

Brian ☀️: hi

Joe: Hi，I want to know how to build a validator on the Ton test network, how many test coins are needed, and how to get the test coins. Thanks!

gavin: Hey, this question is a bit difficult to explain. My usage is as follows: I may need to verify the signature of a complex Cell. First, I will use code outside the chain to write a complex Cell to do hash() (in TypeScript, you can directly use the hash method in Celll) and then sign this hash. In the FunC contract, I only need to calculate the hash once for this complex Cell (slice_hash method), and then check_signature is enough. (reply to 95251)

Joel: Does this exit code explanation make sense? Is it supposed to be written as "too little TON"?

PtcBink: Can you DM me? (reply to 94587)

PtcBink: This is Bink from SFO team, I can help you. DM me. (reply to 94508)

PtcBink: I can help you, DM me (reply to 94495)

Zum: Newbie here. I am trying to connect localhost http protocol to my bot but it doesn’t allow. Still asking for https. My account is already test account.

Zum: I tried with ngrok. It works but according to doc if your test environment is setup properly http protocol should work properly

.: Hello, new TON dev here. I’ve been looking at the documentation for a few days and already started to write my own contracts and reviewing contracts available in GitHub.  Although there’s something that I still don’t understand and I don’t know where to search the meaningful documentation for that topic.   I’ve seen this pattern:   ``` begin_cell()         .store_uint(2, 2) ;; addr_std$10     .store_uint(0, 1) ;; anycast:(Maybe Anycast)     .store_uint(0, 8) ;; workchain_id:int8     .store_uint(cell_hash(state_init), 256) ;; address:bits256 .end_cell() ```  From .store_uint(2, 2) what does 2 and 2 mean? How do I know which values to put there?   That snippet comes from the FunC cookbook to calculate the contract address, but I have seen some other contracts where some of those magic numbers are different for a similar purpose. I was expecting more consistency on them but looks like I’m missing something.  Can somebody direct me to the documentation about it?

User<6984952426>: Hellio, guys.  I want to make TMA game. Right after app is started, I want to verify the user. I already tested get user's info(username, user_id, first_name, last_name).  Additionally, I want to get the information like when the user made their account, and how often they use telegram. Is it possible?

Paul: for your case, this variable can save max 2^2 = 4. and the stored value is 2 (reply to 95271)

.: But how do I know which values to set? It feels arbitrary but I also feel I’m missing something important.  How do I get to know which values to put there?  ``` () calc_address(cell state_init) {   var future_address = begin_cell()      .store_uint(2, 2) ;; addr_std$10     .store_uint(0, 1) ;; anycast:(Maybe Anycast)     .store_uint(0, 8) ;; workchain_id:int8     .store_uint(cell_hash(state_init), 256) ;; address:bits256     .end_cell(); } ```  This is documented in the cookbook that you can calculate the contract address with that. But why is that different when trying to calculate the contract address for a jetton wallet?   Note both are similar but jetton uses 4, 3 why? (reply to 95275)

Joel: actually just to make it clear. The max is 3 and min is 0 (reply to 95275)

Joel: you need to understand how TL-B schemes work. Basically it describes the structure of any cells. (reply to 95276)

Joel: Here's the definition of addr_std: https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/block.tlb#L105-L108

Joel: addr_std$10 anycast:(Maybe Anycast)     workchain_id:int8 address:bits256  = MsgAddressInt;

Joel: You are basically defining this in cell terms

.: And how do I now that it means (2, 2) and not (4, 3) (reply to 95281)

.: I know workchain_id is always equal to 0, so it will be (0, 8)  And address bits is (cell_hash(init), 256)  But the first argument is what I don’t understand.

Joel: store_uint(4, 3) = 0b100 store_uint(2, 2).store_uint(0, 1) = 0b100 (reply to 95285)

Joel: it's the same thing. store_uint(4, 3) is a shorter version of store_uint(2, 2).store_uint(0, 1)

Joel: basic binary stuff

Joel: store_uint(2, 2) stores 0b10 store_uint(0, 1) stores 0b0 joined together, it gives 0b100

Resha: For Angular app, I am trying to send transaction for native and jettons also i have a provider but transaction is not happening. it's throwing error, Error: Connect wallet to send a transaction. at TonConnectUI.    const tx = await this.provider.sendTransaction({     messages: [       {         address: to, // destination address         amount: amount * (10 ** token.token_decimals) //Toncoin in nanotons       }     ]   });   const body = beginCell() .storeUint(0xf8a7ea5, 32) .storeUint(0, 64) .storeCoins(amountInMinimalUnits) .storeAddress(Address.parse(to)) .storeAddress(Address.parse(this.activeWallet)) .storeUint(0, 1) .storeCoins(toNano('0.01')) .storeUint(0, 1) .endCell();  const tx = await this.provider.sendTransaction({       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [         {           address: this.activeWallet,             amount: toNano('0.05').toString(),            payload: body.toBoc().toString('base64')         }       ]     });  The provider here is basically from TonConnectUI instance by passing manifest url

Joel: how are you defining your provider (reply to 95292)

.: Oh wait, I believe I got it.  So addr_std$10 = 2 binary 10 = 2 that’s an external address. (2, 2).  While addr_std$11 = 3 binary 11=3 for internal address (4, 3).  Is that right? (reply to 95291)

Resha: new TonConnectUI({ manifestUrl: url here }); (reply to 95295)

Resha: actually with this provider only connector.connectWallet(); is opening the popup, while using TonConnect popup is now shown and modal functions were not working

Joel: no. you are not using addr_std$11. You are using addr_std$10 for both cases. 0b10 is for the constructor prefix code $10 and the last 0b0 is for saying "there is nothing" for anycast:(Maybe Anycast) which is the next element in the TL-B scheme of addr_std$10. Revisit the TL-B scheme. (reply to 95296)

.: Understood, I appreciate your help. (reply to 95299)

.: I feel so dumb hahaha I can’t unsee it now 😅

Joel: its ok. one by one. (reply to 95301)

.: Hello everyone, does anyone know how to get an investment in the project, if you know, who can help me

L: hello everyone， Why can I only see very little token transfer information on the ton browser? Where can I view more information?

.: I’m new here but I believe the easiest way is by participating in contests and hackathons. But if you get more information about please share 😉 (reply to 95309)

.: I need minimal investment. It's an investment in the server, so I don't know who to write to (reply to 95311)

.: I need a server that can withstand more than 50 million people, the rental of such a server is $4,300 per month (reply to 95311)

sangmin: Thank you for your time, I'll look for more! (reply to 95318)

L: I cant find a token‘s  full tx by ton explorer (reply to 95320)

[+_-]: Much appreciated for your enthusiasm, I have already solved this issue - the problem was in shared imports between projects unfortunately, and also, as I figured out - limit of global variables is 30-31🪑 (reply to 95252)

L: yes (reply to 95327)

L: let me see thank you

L: thank you (reply to 95333)

ehwangah: yes!

ehwangah: Let me shill mine hehe   Soft launching t.me/partona_ai ; an AI fantasy companion app showcasing captivating AI characters & fantasies, imagined by the community. Except beyond chats, your roleplay can be visualised into a manga... and people love it!  This has been a hit on our web2 side and we knew we had to bring it on Telegram, for context:  1.⁠ ⁠We've been having 3.5x WoW user acq. growth 2.⁠ ⁠Most users come back daily for a whole week - D7 retention ~30% 3.⁠ ⁠Users enjoy roleplaying - avg session time 12min w/ 46 msgs sent per day

Brian ☀️: Please any help me how to get exactly transaction info.   I sendTransaction and now I wanna know How to get exactly this transaction info to verify and check status transaction (to make sure it's complete transfer done)

User<6218334417>: Hello, does anyone know why my telegram mini app cannot get my clipboard? The data is always null.  Is it because it doesn't have access? If so, how to get access?

Brian ☀️: I've resolved this pain by using this package. Try it.  https://www.npmjs.com/package/copy-to-clipboard (reply to 95347)

Russia: I want to swap usdt to ton using stonfi's getSwapTonToJettonTxParams function, is it possible?

TKAINU: Hello, can I add logic to the stable-coin contract without losing its standards?

Development: hello,Tell me, is it possible to create a jack token so that the smart contract can be an owner and manage funds from the jack token?

Russia: I want to swap usdt to ton using stonfi's getSwapTonToJettonTxParams function, is it possible? @pcrafter

&rey: You'll probably have to use another function, "jetton to TON". (reply to 95369)

Russia: but i want to swap tether usd to jetton token, i use stonfi library, is that possible.  I want to swap this pair (reply to 95370)

TKAINU: Hello, I created an additional callMinter file to add logic and call JettonMinter functions, but I have to deploy 2 smart contracts, right? Is there a way that I only need to deploy 1 contract to add logic but still ensure jetton_master standard of jetton ko

TKAINU: @pcrafter please help me

&rey: You can change existing files as well. Make sure to comply to TEP-74, that's all. (reply to 95372)

Nerses: Is it possible on the TON blockchain for one wallet to sign a message or transaction, and then have another wallet publish it, similar to how it's done in Ethereum? If so, how would this be implemented?

&rey: No, but w5 allows for equivalent effect. (reply to 95377)

Nerses: is there any docs or material where i can read about it in details. I am mainly interested in similiarities and disimliarites with Ethereum,and how in TON is achieved equivalent effect (reply to 95379)

Russia: but failed (reply to 95370)

&rey: Have you made up your mind on what you want to swap to what? (reply to 95382)

Russia: I am planning to swap Tether usd to ton, I use getSwapTonToJettonTxParams function of stonfi library (reply to 95383)

Russia: const txArgs = {                 offerAmount: toNano("0.5"),                 askJettonAddress:                     "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",                 // "EQC47093oX5Xhb0xuk2lCr2RhS8rj-vul61u4W2UH5ORmG_O",                 minAskAmount: toNano("0.1"),                 proxyTon: new pTON.v1(),                 userWalletAddress: wallet.address.toString(),             };

&rey: You know that you need getSwapJettonToTonTxParams, right? (reply to 95384)

Russia: yes i am using that function to swap ton to tether usd of stonfi (reply to 95386)

&rey: Have you read function name carefully? (reply to 95388)

Russia: I have read carefully and tried the functions of stonfi. However, if I have tether usd, I cannot swap, and I can swap all jettons in ton, but if I have tether usd, I cannot, but I want to swap to it, I don't know how to solve it. (reply to 95389)

Ali: How much is the TON fee per transaction?  I paid 1$ for a 7$ swap its super high

Nerses: could you please provide more detailed info or any material ? i have read this blog post but nothing was mentioned about it https://blog.ton.org/introducing-the-w5-smart-wallet-evolving-transactions-on-ton-blockchain (reply to 95379)

&rey: One swap involves around 6-10 transactions. (reply to 95394)

Kapil: Can we store jetton token in the contract

Aldric: of course, you can store the Jetton token code in a contract with the type cell. (reply to 95399)

&rey: Contract can own tokens and transfer the owned ones. (reply to 95399)

Aldric: Are you looking for a contract like factory? one sign transaction, and one publish contract? (reply to 95377)

&rey: Wallet v5 can receive a signed order-to-send-something in an internal message, that is, from another wallet. It still checks owner's signature so this is safe. (reply to 95396)

Nightfall: Hey everybody, do you know why this cell is only 96 bits, it should have been 160 bits (32 op, 64 query, two 32 bit uints)  const rawBody = 'b5ee9c720101020100190001182c8110b5000000000000000001001086c7413600001964'; const cell = Cell.fromBase64(Buffer.from(rawBody, 'hex').toString('base64')); console.log(cell.bits.length);

Kapil: I am creating the staking contract and I want to transfer the token from wallet to stacking contract. I have created a stacking contract I have send the request from the wallet to the jetton wallet contract which is deploying the stacking contract and I have used the dictionary to map the address and the amount of the jetton transferee from the wallet to the stacking contract. Now I am trying to do the transaction there is no exit code error in the transaction but it is showing me the transaction failed . Can anyone help me as soon as possible.

Aldric: because it only query and two 32 bit uints, opcode is not in body (reply to 95404)

Kapil: 00c16b5eb0cab704b978eeb91a0c70c5a30ec559c8ef97e4c2a2fa653038f0dd this is the tnx id (reply to 95406)

Nightfall: but the opcode is in that particular data if you are right then it also should have been 64 + 32 + 32 = 128 bits, but the above code prints 96 bits (reply to 95407)

Nightfall: sorry, my schema was actually incorrect, the cell has another ref that contains 2 uints. But the opcode and query id is in the body (reply to 95410)

Aldric: Do you try to modify contract jetton? (reply to 95406)

Kapil: Yup (reply to 95413)

Kapil: Check the tnx you will understand easily what I have done (reply to 95408)

Nerses: is there any code implementation ? (reply to 95403)

Nerses: i am not familiar with contract factory.I just need one wallet sign a transaction, and another publish it (reply to 95402)

Aldric: first of all, you shouldn't try to modify the contract jetton. You can send jetton to vault. (reply to 95414)

Aldric: You should deploy Staking contract first, and send jetton or TON in staking contract.

Kapil: Can you elaborate it more (reply to 95419)

Mikhail: Hello everyone, I started studying tonconnect/ui-react and I had a problem with the TonConnectButton, namely the wallet connection. The button works technically, the ui changes, the address is displayed, but when logging the wallet data, undefined is always displayed in the console. Please help (  const App = () => {   const tonConnectUI = useTonConnectUI();    const handleLogWalletInfo = () => {     const currentWallet = tonConnectUI.wallet;     const currentWalletInfo = tonConnectUI.walletInfo;      console.log('Current Wallet:', currentWallet);     console.log('Current Wallet Info:', currentWalletInfo);   };    return (     <div>       <TonConnectButton />       <button onClick={handleLogWalletInfo}>         Log Wallet Info       </button>     </div>   ); };

Heydar: can we upload files by user in mini apps to it's savemessage or another ids? (user give grants)

Shadow: hello! is there ston-fi dex v2 in open source? I can't find it

Kapil: What is vault (reply to 95418)

.: Yes (reply to 95319)

Aldric: I mean staking contract, just a vault store coin. deploy your staking contract first and send jetton (reply to 95425)

Kapil: Is there any issue if we modify the jetton contract

Catid: hellow  how much time usually to look change a seqno ?

Nerses: @pcrafter does this function makes possible to process previously mentioned order-to-send-something  message ?https://github.com/tonkeeper/w5/blob/main/contracts/wallet_v5.fc#L164C1-L164C22

Vincent: Is there any Ton ecosystem projects chat available? I would like to connect with other projects for synergies

Thea: Sure connect me (reply to 95436)

Vincent: Added you to my contacts, please send me a message, thank you! (reply to 95437)

Prince: pls be careful about scam (reply to 95438)

Prince: almost avatar is Ton, they are scammers

Vincent: Thanks for the warning, much appreciated 🙏🏻 (reply to 95440)

Miner87-Yetel062 ☀️ 🐦‍⬛️SparkChain AI🛒TAPX🦉Tearline: I don't have bad word in my message (reply to 95445)

&rey: That is highly likely scam. (reply to 95446)

Cube: Can someone pls share resource with onchain nft collection or item metadata serialization

Nerses: how message signing is handled by wallets in the TON blockchain. Specifically, I'm interested in how this can be done programmatically, ideally with a code example. Additionally, does the process of signing a message depend on the version of the wallet being used?

Lamborghini: Hello, Version Details react-native: 0.75.1 "@ton/core": "^0.56.3", "@ton/crypto": "^3.3.0", "@ton/ton": "^14.0.0",  When i just import the @ton/ton package, I am facing this error "TypeError: (0, paddedBits_1.bitsToPaddedBuffer)(bits).copy is not a function (it is undefined" after updating the react-native version. 0.72.7 to 0.75.1.  Previously it was working fine in older version of RN. On the below line this is the crash https://github.com/ton-org/ton-core/blob/b5aa9381ae266185492f0c769056224d8b99d788/src/boc/cell/descriptor.ts#L35 I also attach the screenshot of the error

T🐦SUI | Drops💧: Hello developers, does anyone know of a multicoin-address-validator that the TON network has enabled?

Prince: can you tell us in detail?

User<7387667050>: hey guys, I use tonconnect sdk js as it is in official documentation, but for some reason when i try to connect my wallet from browser extension it says that there is no such an extension, even though it is.   But connection from app works

Nathan: I had this problem, I had to change the manifest

User<6134444887>: I have good experience in figma, frontend and smart contract, and web3 integration for meme, tg miniapp & dApps. Who needs?

User<7387667050>: what did you changed in it? (reply to 95465)

Nathan: I remember changing the url and the place where my manifest was hosted (reply to 95468)

User<7387667050>: atm its on mine IP(local host) (reply to 95469)

Bojack: Hey, everyone, I’d like to know the best way to monitor jetton transfers—should I monitor the jetton transfer operation or the notification operation?

Goodbye: Gradoally goes opensource, hope you find something usefull. Greetings to community. 🙌 https://github.com/gradoally  Searching for clients, investors and contributors.

Joel: Whats ur purpose of doing so? I think it depends on what you are tryna achieve (reply to 95475)

Joel: If you want to respond programmatically on another smart contract, you gotta make use of transfer notification (reply to 95475)

Bojack: It's a wallet that receives user payments (reply to 95482)

Joel: Yeah then you can make use of transfer notification (reply to 95485)

Joel: But you gotta make sure end users pay forward amount and specify forward payload

Bojack: Thanks, bud! I'm just curious—are transfer notifications used only for this purpose? (reply to 95488)

&rey: For automatic onchain processing (like swaps or liquidity adding) only. (reply to 95489)

Alexey: hey guys,  I am trying to write a wrapper that requests a transfer of X tokens (other than TONs, e.g. - WTONs) from the user's wallet, but I don't understand how to request it. I can request TONs just fine, but how do I specify token code? Can anyone help?

Vladyslav: Hello everyone,  I am trying to launch TonAPI node, is this chat a correct place to request assitance ?  Because I have some questions )

&rey: You need user's wallet to send transfer order to user jetton's wallet. See message schemes. (reply to 95493)

Alexey: Thanks. Would I need to send external message to the user's wallet? (reply to 95497)

&rey: TON Connect 2 takes care of that. (reply to 95499)

Alexey: Do you mind if I drop you a personal follow-up message? (reply to 95500)

Vladyslav: Okay, so, I have already started Full Ton node, and it is working, when I execute “status” via mytonctrl, it says it is synced. I did setup with help of sh scripts provided on the official website.  Now I want to launch opentonapi, so I will be able to interact with the node through http.  From what I understend, the opentonapi needs to connect to liteserver, the opentonapi represented as docker image.  So locally, when I execute lite-client, it is able to conect to the liteserver. But when I start the docker image for the opentonapi I get the error  failed to create liteapi client error all liteservers are unavailable  I suspect that it could be related to the public-key which should be passed to opentonapi. But I am not sure how to get it, the one I am using, is just from "id" field under "liteservers" in the global config. I also have this one liteserver_pub, but not sure how to decode it, it seems to be in binary format.  Could someone please assit me ?

Makis: Have you managed to solve this? I want to do the exact same thing 😅 (reply to 90839)

Kunaal | Hire AI Agents |: Can anyone explain how can I launch my own SBT tokens for my telegram channel and community? Is it even possible?

Kunaal | Hire AI Agents |: How can I do that? Can you please share any documentation? Is there official documentation available? (reply to 95513)

Lajcik007: hey, I'm in a bit of a pickle... Im trying to create onChain metadata inside contract. Righ now it is not working, and thats as far as I got... this is my nft_collection.fc recv_internal() where mint is done... Does anybody know where I went wrong?

&rey: What works, actually? (reply to 95522)

Lajcik007: nft item deploys but metadata looks like that (reply to 95527)

Mujahid: I am looking for telegram bot developer urgent

Mujahid: trading

Fardin: Hello I'm in a emergency situation

Fardin: The ton connect sdk returning a boc after each send transaction

Fardin: How could i fetch it's data? Datas like the value of transaction, to address and etc

TON Bounty Bridge: ​GameFi SDK for Unity  🏷 Developer Tool  Summary:My goal is to develop an SDK for the Unity game engine that will allow wallets to be connected via t...  Rewards: • 1150 USD in TON equivalent  Created by MrVeit

TKAINU: I deploy but Error: Too many references, please help me

TKAINU: (int, slice, slice, cell, cell, cell, cell, cell) load_data() inline {     slice ds = get_data().begin_parse();     return (         ds~load_coins(),      ;; total_supply         ds~load_msg_addr(),   ;; admin_address         ds~load_msg_addr(),   ;; next_admin_address         ds~load_ref(),        ;; jetton_wallet_code         ds~load_ref(),        ;; metadata_uri         ds~load_ref(),        ;; pool_cell         ds~load_ref(),        ;; price_cell         ds~load_ref()         ;; status_limit_cell     ); }

TKAINU: const minter = provider.open(JettonMinter.createFromConfig({         admin: adminAddress.address,         wallet_code: jettonWalletCode,         jetton_content: { uri: jettonMetadataUri },         pool_cell: poolCell,         price_cell: priceCell,         status_limit_cell: statusLimitCell,     },         await compile('JettonMinter')));      await minter.sendDeploy(provider.sender(), toNano("1.5"));

Aleks: Any good RPC providers you guys would recommend? I am currently using  TON Center free api key (10 requests/s). I need to upgrade

The Pather: Hello friends, I am a business administration student at a university in the Colombian Amazon and I want to create a voting system for student elections, and I also want to give To introduce Ton's blockchain, what do you recommend?

&rey: I'd suggest not to mix those two systems unless you have a clear idea on how to do that. (reply to 95562)

The Pather: 😔

Ali: Hi i want order a tg mini app to a developer   Would like to know how much budget need for it?  5-6 page and also i provide UI/UX designs by my self (reply to 95568)

Дмитрий: From $500 (reply to 95573)

Ali: But on Fiver i saw offerd from 100$ (reply to 95574)

&rey: DM offers can claim even as low as $20, would that make it legit? (reply to 95575)

Ali: Legit? You mean is logical? (reply to 95576)

&rey: I mean "someone will actually create TMA conforming to your criteria in given budget" and imply that offers might be scam. (reply to 95577)

Ali: Im not pay even 1 dollar before they deviler work . (reply to 95578)

D_d: for the budget you listed 300-500 you can find only like newbies who are enthusiastic and ready work for cheap. its not bad at all but it can cause you a lot of problem when you want to scale and I do not mention about secutiry (reply to 95573)

Ali: The mini app have ownership?  Shuld i ask to transfer it to me? (reply to 95580)

D_d: At this point what I saw about xRide you should find a technical cofounder

User<6008048161>: Hi, there! I have rich exp in building dApps, meme coins, TMAs and TG bots. Plz let me know if you need my help

Dev: DM (reply to 95573)

Apple: Hi, I have rich experience with telegram trading bot development Which trading bot do you want? Sniper, Sandwich, Volume, Copy Trading? Let me know what you want. (reply to 95535)

Lajcik007: solved (reply to 95529)

Fardin: How to convert this boc to a human understandable version?   https://docs.ton.org/develop/dapps/ton-connect/transactions

Fardin: Same boc as document but not working ...

— 2024-08-17 —

Joel: You can only store 4 references in one cell. You got too many references. (reply to 95554)

Lajcik007: Hey does anybody know how to structure attributes array for NFT?

Chaincode: You can store them to metacontent off chain (reply to 95621)

Lajcik007: yaeh but I want to do it onChain (reply to 95624)

Lajcik007: but dont know how to structure cells for it (reply to 95629)

Chaincode: TEPs/text/0064-token-data-standard.md at master · ton-blockchain/TEPs · GitHub https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

Thanh: I have a question. Is this a good way to check transaction for purchase some item? I tried to find something like emit event when smart contract receive a transaction in Solidity but no luck. I would appreciate any ideas, thanks.

Joel: There is a way to write logs on ton. (reply to 95632)

Adam: Hi guys, I have a question, I see all of bot show number of monthly users like this, but when I create a bot, it only show ‘bot’. How to show number of monthy users on my bot? Thanks

Aldric: how do you do it mate? (reply to 95594)

Root 🟥: Can we do transaction in ipfs from tma

sir_pump: Hello friends If anyone needs a full stack developer, I have experience in dApps, defi, custom telegram bots and mini apps, smart contract and wallet integration, website development and more. Kindly dm me for discussion

Chaincode: Great👍 (reply to 95670)

Ehsan: Same boc as document but not working ...

Degen: https://docs.ton.org/participate/run-nodes/fullnode#enable-liteserver-mode

Degen: This link is not open

WG: Hello team, nice to meet you. I am trying to call another smart contract from smart contract with the payload. But it seems to be failed.Could anyone please help me?  cell payload = begin_cell()   .store_uint(op::registerCustomer, 32)   .store_uint(0, 64)   .end_cell();  cell msg = begin_cell()   .store_uint(0x10, 6) ;; Internal message header, no bounce   .store_slice(loyalty_ledger) ;; Storing recipient address   .store_grams(100000000) ;; Value in nanotons (0.5 TON)   .store_ref(payload) ;; Payload cell .end_cell();  send_raw_message(msg, 64);

Chaincode: DM me (reply to 95695)

Mehdi: I need a pack of TON emojis. Who has some emojis?

Chaincode: 🤑Click this (reply to 95705)

User<7387667050>: guys, how to use TL_B, whats that?

Ankit j: Which navigation steps to follow to setup webhook in Bot father ? (reply to 22046)

Vladyslav: Toninco. What is this?

Joel: It is a syntax that describes the structure of binary data. The documentation on ton website should help already (reply to 95715)

Kowser |: I want to use w5, which pkg need to use

Bryce: do anyone know why highload take more fee then regular wallet to send internal messages?

Bryce: in typescript you can read the boc with Cell object in @ton/ton library (reply to 95599)

Bryce: const message = Cell.fromBoc(Buffer.from(transaction.boc, "base64"))[0] message.beginParse().loadAddress()   something like this

Makis: Anyone know why the streaming api keeps missing transactions? I am using the Lite plan and I still miss some StonfiSwaps.

Makis: I also tried multiple types of filters, tried using no filters, tried filtering all transactions of a pair, etc but it always just keeps missing swaps

Oren: I'm getting this error LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state when trying to send the first transaction from a V4 wallet using @ton/ton WalletContractV4 and createTransfer

Bryce: did you deploy the wallet contract? (reply to 95739)

Oren: Nope I expected this first transaction to deploy it

WG: Hello team, currently, I am going to call another smart contract in a smart contract with some payload. But I am not sure how to do it. I have used this code, but it doesn't work correctly. Could anyone help please?  cell payload = begin_cell()   .store_uint(op::registerCustomer, 32)   .store_uint(0, 64)   .end_cell();  cell msg = begin_cell()   .store_uint(0x10, 6) ;; Internal message header, no bounce   .store_slice(loyalty_ledger) ;; Storing recipient address   .store_grams(100000000) ;; Value in nanotons (0.5 TON)   .store_ref(payload) ;; Payload cell .end_cell();  send_raw_message(msg, 64);

Bryce: Then you should set init property on your message (reply to 95743)

Bryce: MessageRelaxed: {     body: Cell;     info: CommonMessageInfoRelaxed;     init?: Maybe<StateInit>; }

Bryce: Check if seqno is 0 set the init property to walletcontract.init

Bryce: Let me grab the code that you need for this

Oren: And if I'm sending more than one message in the first transaction, do I need to only set it on the first one? (reply to 95748)

Bryce: Not the internal message (reply to 95752)

Bryce: Wait a moment

Bryce: createExternalMessage(contract: OpenedContract<WalletContractV5R1>, seqno: number, cell: Cell) {         return beginCell()             .storeWritable(                 storeMessage(                     external({                         to: contract.address,                         init: seqno === 0 ? contract.init : undefined,                         body:                             cell,                     }),                 ),             )             .endCell();     }

Bryce: const externalMessage = createExternalMessage(walletcontract, seqno, message)

Bryce: I hope you understand, i just copy pasted the code from my project , you connect it together (reply to 95752)

Fardin: Cool thanks (reply to 95732)

Akachi: https://testnet.tonviewer.com/transaction/605e4c913ceb0ecf3497a9d7a8f665e71688e9901413d6a7b02c6f6443604e07 Can anyone check why this tx is failed?

Akachi: I deployed the same contract using blueprint When I deployed using mnomonics, it has the error. But when I tried with deep link it works.

Akachi: https://testnet.tonviewer.com/kQCwhWtfDa4IzVoeBJhuPYY-ghIJatRiB9VY8vRB0-S--IIF The same contract but works in this case.

WG: Hello, when should we use ref? instead of what? is there any benefits of using ref? (reply to 95784)

Bryce: There's a limit i recommend you to read the docs https://docs.ton.org/develop/data-formats/cell-boc (reply to 95788)

Bryce: Cells are able to store up to 1023 bits and possess up to 4 references to other cells.

𝕄𝕒𝕣𝕤ℕ𝕖𝕒𝕣𝕓𝕪: HI. Is it possible to display apps connected to the wallet in the Tonkeeper desktop app?

Lajcik007: hey how are attributes saved onChain insisde NFT item is it dirctionary or BoC?

N ARI AVKAN: which blockchain network do you use? (reply to 95254)

&rey: BOC is only a format of cell representation. Nodes' and clients' choice of cell representation is invisible to contracts. (reply to 95799)

Lajcik007: okey then what is a proper order or format of data to save attributes in way understandable for contract readers in NFTstandard? (reply to 95805)

&rey: Spec: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#content-representation. (reply to 95806)

&rey: Or you mean additional attributes? Those are not specified; try JSON string, but if that does not work then onchain+attributes is impossible.

Lajcik007: yeah I meant additional attributes other I got to work (reply to 95808)

Lajcik007: json string like that?  '{"attributes":[{"trait_type":"trait_name","value":"trait_value"}]}'

Lajcik007: if it is in fact impossible then thats stupid XD (reply to 95808)

&rey: You should claim that to authors of explorers and APIs, actually) (reply to 95811)

Lajcik007: i guess (reply to 95812)

Lajcik007: well thats deadend (reply to 95808)

Lajcik007: worst of it is that nowhere is to be found any instruction on what is proper structure for this

&rey: Have you also tried {"trait_name": "trait_value"} [{"trait_type":"trait_name","value":"trait_value"}] ?

Lajcik007: nope will try in a moment

Lajcik007: [{"trait_type":"trait_name","value":"trait_value"}] this one i did

Lajcik007: by the look of this nft metadata is completly on chain so I guess it should be possible https://tonviewer.com/EQBnUh01MW6mQx5gWrBU7HoFf5aZKxhS0kkhxONyZS-272Gs?section=nft

Lucas: I like what you get in Tonkeeper as a result ...  if you bulk-deploy  a negative amount of NFTs

Sammy: Hello guys, i need blockchain developer for my TapGame mini-app bot. Please contact me with ur portfolio. Thanks

User<6242359642>: Well, what do y’all think about this ?   Ref-to-earn mini-app promising nft stickers utility = memecoin ?

Lucas: https://docs.ton.org/develop/dapps/asset-processing/bridge.ton.org   Coming from https://docs.ton.org/develop/dapps/asset-processing/usdt#tether  btw.  I know why this is a 404  a true developer will know.  Someone with access to the TON docs should fix that

Bryce: if you can create a pull request (reply to 95834)

Lucas: oh right (reply to 95835)

Lucas: forgot about that option

User<6576297005>: I am proficient with AI/ML, UX/UI, frontend, telegram bot,miniapp and smart contract writing and integration. If you are in need ofdev, let me know.

Maple: https://www.linkedin.com/pulse/welcome-speedy-world-ton-blockchain-thats-ready-race-ethan-chan-jx79c

Maple: https://www.linkedin.com/pulse/great-blockchain-showdown-ton-vs-bitcoin-ethereum-ethan-chan-n65kc

— 2024-08-18 —

Caelestis: Hi all! Is there a way or is it possible to create a deeplink to transaction from app to wallet using BoC from created transaction or creating a deeplink during transaction creation, which I can use to redirect user to his wallet and open created transaction?

Anton: https://t.me/tondev_news/145

Asaki: Dose anyone has some advices about the hardware requirement on running a full node?

Asaki: right now, I run a fullnode on m6i.8xlarge with gp3 (16K iops) ;

Asaki: I notice that the official doc recommend that we should ready a 64K iops but I notice that the iops usage is low on my node

Aleks: Morning!   Who wants to meet on a small party on photostudio tonight in Mumbai?   Is any TON devs here in Mumbai? I’m searching for a partner.

Aleks: This is where party will take place  A P Studio ,   15/123 , Upper Floor , Near Hathway cable office , Off. M G Road ,  Goregaon ( West ) , Mumbai - 400 104. (reply to 95896)

Alexander: Wtf anyone would do in Mumbai, get infected and dead by just breathing in this kind of junk (reply to 95896)

Aleks: Actually we are living in Goa, Mandrem and I came here for few days to solve exit permit problem. And meet new people as well) (reply to 95898)

Asaki: @AntonTrunov Sir, could u offer some helps here (reply to 95886)

Zack: Any admin here I need help

Sammy: Надо людей для разработка децентрализованных приложений (dApps). Жду портфолио в ЛС

J🐾: Any mods on

jaq₿ek.eth: Look like reverted since tx hasnt been completed (reply to 95950)

Асхаб: And we are looking for a person in the team who is ready to help in writing the API for the new DEX

raulmacias-dev: Hello, every one

raulmacias-dev: exists a @tondev_esp ??

SACGRO: What's your budget? (reply to 95943)

MZ: How can I check that transaction on blockchain has been succesfully completed using response:   const response = await tonConnectUI.sendTransaction(myTransaction);   ?

raulmacias-dev: Is there a tap to earn project that I can participate in?

Rimo (XTR) 🐾: I reached out to some devs i know, if there’s anyone that can get it done, I’ll recommend them to you (reply to 95977)

Rimo (XTR) 🐾: If that’s fine by you anyways

Samy: Thanks

Amjad: I have few apps and games running on tg and on browsers too (reply to 94804)

Amjad: I would love to be a speaker (reply to 94806)

Amjad: I can develop it (reply to 95977)

Amjad: Yes I have a tap game ready (reply to 95978)

raulmacias-dev: I could participate because I am very interested in that model, and I am a developer. (reply to 95986)

Alex 🦉: Hello Community, i have a little question about telegram miniapp.  Can i invoke a "Close MiniApp Window" on React/Nextjs?

SACGRO: Yes, you can by calling telegram.WebApp.close() (reply to 95990)

Alex 🦉: i tried but i can't make this work

Alex 🦉: i imported on layout the script

SACGRO: That's the only way.

SACGRO: Are you getting webapp object?

SACGRO: You may have to debug your implementation

Alex 🦉: Fixed, was a typo error thanks (reply to 95996)

SACGRO: Great (reply to 95999)

White 🐾: Hi friend, I am interest with this (reply to 95968)

Mike: Hi guys, any one knows where we could find coding examples for blacklist/whitelist of jetton? Thanks a lot

White 🐾: Hi guys, why I got the message Failed? When I try to swap NOME token into TON?

Mike: anyone (reply to 96017)

Sammy: UI/UX designers please contact me.

User<7387667050>: if in case there is no vault for the jetton, is the sdk gonna create a new one?

User<7387667050>: and what is the Root variable?

Apple: Hi, I'm very interested in you. (reply to 95968)

Bryce: No i don't think so (reply to 96024)

User<7387667050>: Then am I connecting to their vaults?

&rey: I call you on promise to track whether you've already sent the message. (reply to 96032)

&rey: Understood. Have you tried applying in @tonhunt? (reply to 96034)

&rey: Pretty likely. (Though note that vault address is deterministic, depending on jetton address). (reply to 96024)

jaq₿ek.eth: Is there known any place for smart contract devs building on TON? I struggle with building one.

&rey: You're exactly there) (reply to 96040)

jaq₿ek.eth: I've builded race game and want to store multiple addresses with their elapsed time. But I can't set initialization data. All I am able to do is to store only one address with its time. Can someone pls help

User<6670085319>: I can do figma design, frontend development and able to write smart contracts on several blockchain ecosystems. Feel free to reach out if you are in need of.

Mars: Guys thoughts on building a smaller dev community of people Actively building we can swap questions and ideas

&rey: Is this chat too uncomfortable? If so please share ideas... (reply to 96046)

L2L2🎒: is there any prefered place to host miniapps  iam hosting on vercel and its very slow

Mars: Heroku (reply to 96050)

Aslam: Is there any optimisations on heroku ? (reply to 96051)

:D: anyone having issues with telegram wallet's *back to yourapp.com* button not actually popping up your apps windows after the user makes a transaction?

:D: im hosting mine just as I would a standard webapp, on a cloud vps hosted in SG (reply to 96050)

Aslam: yeah facing the same problems  the main reason for me is the routing are so slow  and it takes a lot of time to switch to other pages  it is a simple app btw (reply to 96054)

jaq₿ek.eth: I used ton community twa repo and it deploys on github pages. For me it's fast enough. Not sure what's your needs (reply to 96050)

:D: routing within the app? (reply to 96058)

Aslam: yes (reply to 96060)

:D: routing within the app is no problem for me, I'm using vite + react router

Aslam: I am using nextjs

:D: its just that one issue with wallet not being able to route the user back to my app haha

:D: ill let you know if I find the root cause of the problem, will do some debugging soon haha

Aslam: eg: I have connected the wallet now the app needs to route to home  takes some time  also the switching pages in navbar buttons (reply to 96064)

Aslam: great (reply to 96067)

:D: Hm (reply to 96068)

:D: That sounds like a webpage in general kinda problem, not really a telegram problem

Arjun: Hello frens, can anyone tell me how to get the transaction hash after native TON transfer ?

Arjun: I figured it out. Once the sequenceNo. gets updated, the below code will give the transaction hash. const state = await client.getContractState(address);  const { hash } = state.lastTransaction;

&rey: (You know that an incoming transfer — for instance, from scammers — might arrive in the same block?) (reply to 96097)

Arjun: That's right. Can you suggest any solution ? (reply to 96104)

&rey: I have written one previously, in a proprietary manner. (reply to 96105)

Arjun: Care to share please ? I am new to TON. Coming from EVM ecosystem.. (reply to 96106)

&rey: I can only share base idea: scanning transactions to find outgoing, then match outgoing transactions to the sent request. (reply to 96110)

Arjun: Got it. But what do you match it against ? The value or recipient can be the same. One thing that can be done is to have a custom message that can be checked (reply to 96111)

&rey: My script treats two requests to send X TON to address A as same and, if executed twice in parallel, will only send once. (reply to 96112)

&rey: (Conversely, for an arbitrary number of different transfers requested in parallel, all of them will eventually be done, each once exactly.)

Arjun: But it can be at different points of time that you send the same value transaction to the same recipient.  How do you check that transaction and get the hash ? (reply to 96114)

&rey: I have to scan all transactions, actually. If at a certain request K there is no overlap with txs from K-1, script loads more txs from past. (reply to 96115)

Aleks: Hey guys. What is the best way of dealing with race conditions on nft items minting? Imagine bulk minting where lots of processes are pulling the nextItemIndex and trying to mint, I assume bunch of such transactions would fail. Anyone has been dealing with that?

&rey: Avoid specifying nextItemIndex in mint message. (reply to 96119)

&rey: After all, those messages will be synchronized (sequentially-consistent) on collection contract.

Aleks: Ah interesting. So the chain would handle batch calls gracefully 🤔 What’s the advantage then of specifying the nextItemIndex in a mint message. I see this practice in bunch of the documentation out there

— 2024-08-19 —

Aliyu: I converted my coins to a voucher about 4months ago, but I still haven't received my voucher

Aliyu: There is no one to help me

Resha: Hey, i am trying ti integrate ton connect wallet in angular app where,  TonConnecorUi. ConnectWallet() opens popup with tonkeeper and fethes wallet details correctly but while sending transaction wallet is not is connected mode. Throwing error connect wallet to send transaction

Maple: please identify the wallet is properly connected before attempting to send a transaction.   const isConnected = await tonConnector.isConnected(); if (!isConnected) {     console.error("Wallet is not connected.");     return; }  async function connectWallet() {     try {         await tonConnector.connectWallet();         console.log("Wallet connected successfully!");     } catch (error) {         console.error("Failed to connect wallet:", error);     } } (reply to 96138)

Maple: If you want to know more, please DM me. I'll help u. (reply to 96138)

MyatHtetKaung: That is scam ? (reply to 96143)

User<6984952426>: hello guys!  I'm trying to use tdlib in python. When I try to use tdjson.dll file on the other directory on window folder, the "Could not find module 'C:\Users\User\td\tdlib\bin\tdjson.dll' (or one of its dependencies). Try using the full path with constructor syntax." error occur.  I'm using pycharm, python 3.10.  How can I fix it?

Andre: Hey guys, im looking for someone who can help me customize a contract for new jetton

0xtitn: hi guys. I'm a new in ton blockchain. who knows this https://github.com/howardpen9/staking-in-tact?

Maple: This is a scammer. He's good at hacking. Be careful of this hacker. (reply to 96148)

0xtitn: wdym? (reply to 96150)

0xtitn: hey i didn't meet you. pls proof (reply to 96152)

0xtitn: pls proof (reply to 96155)

0xtitn: why you don't proof? (reply to 96157)

0xtitn: lol

0xtitn: https://github.com/howardpen9/staking-in-tact is this scam project?

0xtitn: are you a ton dev?

0xtitn: how do you know?

0xtitn: I have one project to implement staking part

0xtitn: so I researched this project :https://github.com/howardpen9/staking-in-tact

0xtitn: hey

Vage: 🐝

0xtitn: you already block me

0xtitn: i can't send message

0xtitn: pls send message

0xtitn: I didn't receive

Joel: Lol ungrounded accusations are as bad as scamming.

0xtitn: lol

0xtitn: do you have discord acc? (reply to 96188)

Joel: idk why people blatantly say someones a scammer without being able to prove anything. This needs to stop. Block and kick out once the fraudulent behavior is found.

0xtitn: are you a ton dev? (reply to 96190)

0xtitn: lol (reply to 96192)

0xtitn: why do you think so? (reply to 96192)

Joel: Ye (reply to 96191)

0xtitn: https://github.com/howardpen9/staking-in-tact is this scam project?

Joel: How so? I wanna listen (reply to 96192)

0xtitn: I wanna implement staking part in my project

Joel: Dude this project is maintained by ton asia devrel person who is a friend of my friend in hk (reply to 96198)

Aliyu: There is no one to help me

0xtitn: so i researched this github

Joel: How can this be a scam? (reply to 96201)

0xtitn: I can't understand Luminary!!!

Joel: If u think its a scam bring me the part of the code that is scammy or harmful

Joel: And please i wanna stop this kind of useless convo in this group chat. This is exactly the reason people hate ton dev chat on telegram.

0xtitn: hey admin. pls block Luminary

0xtitn: Joel. can you help me?

Joel: Lol i aint no admin but i second u

0xtitn: pls dm me

Joel: I will bro only if u tell me why…? (reply to 96213)

0xtitn: pls proof (reply to 96213)

Yagermeister: Guys, who can help? TypeError: Cannot read properties of undefined (reading 'slice')

Joel: your slice is undefined. as the error says. (reply to 96217)

Yagermeister: Thx! But Which slice? (reply to 96218)

Joel: bro lol i can't know without the code (reply to 96219)

Yagermeister: It’s in contract code or deploy script? (reply to 96220)

Joel: bruh you gotta learn how to ask a proper qs first. (reply to 96221)

N ARI AVKAN: dm. i can help you (reply to 96147)

harry: how can i remove popup-footer by default ? popup header body footer is from telegram

Rolan: Hello! I want to deploy, mint and change the token admin in one transaction def create_mint_change_admin_body(         self,         destination: Address,         jetton_amount: int,         amount: int = 50000000,         query_id: int = 0,     ) -> Cell:         body = Cell()         body.bits.write_uint(21, 32)  # OP mint         body.bits.write_uint(query_id, 64)         body.bits.write_address(destination)         body.bits.write_grams(amount)          transfer_body = Cell()  # internal transfer         transfer_body.bits.write_uint(0x178D4519, 32)  # OP transfer         transfer_body.bits.write_uint(query_id, 64)    # query_id         transfer_body.bits.write_grams(jetton_amount)  # jetton amount         transfer_body.bits.write_address(None)  # from_address         transfer_body.bits.write_address(None)  # response_address         transfer_body.bits.write_grams(0)  # forward amount         transfer_body.bits.write_bit(             0         )  # forward_payload in this slice, not separate cell          admin_body = Cell()         admin_body.bits.write_uint(3, 32)  # OP         admin_body.bits.write_uint(query_id, 64)  # query_id         admin_body.bits.write_address(Address(OWNER_ADDRESS))          body.refs.append(transfer_body)         body.refs.append(admin_body)         return body In this implementation, only the deploy and mint of the token are obtained.  I pass the sender's wallet address to the destination parameter. If you conduct transactions separately, the token admin changes. What could be the problem?

Thanh: Have a good day everyone, I have a question, Does TON smart contract know who is its owner? In "stdlib.fc" have my_address(), which is contract's address, I don't find anything return it's owner address. If smart contract doesn't know its owner, should we save it manual in storage to get it later (to check balance,  condition, ...)? Anyone have an example? Thanks.

~: Where the best resources to learn TON for web2 develepor want to migrate to web3?

jessepinkman: Has anyone build an open source ton txn indexer?   I want to know how to get the txn op_code using tonutils-go

Development: hello/ i need example tests of smart contract funC

Matthew: Greetings my fellow indians

ᴅʏᴜᴛɪ ᴅɪᴘᴛᴀ: Here I have to paste my wallet addresses or the secret phrases?

ᴅʏᴜᴛɪ ᴅɪᴘᴛᴀ: If anyone can help please reply (reply to 96251)

H: Hi i wanna put nft to sale do i need for every nft one sale contract ? And if i deploy marketplace contract and use its address can i see the nft on getgems?

User<7106205946>: Hi, when you configure the application for the TON chain, you should paste your wallet addresses into the MAINNET_WALLET and TESTNET_WALLET fields.   At this time, you shouldn't paste your private keys in these fields.  You should save the private keys more securely. (reply to 96252)

Thanh: https://github.com/ton-community/tutorials/tree/main/02-contract/test You can read simple Counter contract here (reply to 96247)

User<7106205946>: In TON, smart contracts don't inherently know their owner. The stdlib.fc file, which is part of the standard library for TON smart contracts, includes functions like my_address() that return the contract's address, but it doesn't provide a built-in mechanism to retrieve the owner's address. (reply to 96231)

elon: When calling GetTransaction, "lite server error, code -400: requested account id is not contained in the shard of the specified block" is returned. How to solve it?

&rey: (to elaborate: most contracts, like wallets, don't even have an owner contract) (reply to 96259)

Aaron Fowler 🦴: hy guys, which module on python to connect wallet with pytonconnect?

Thanh: In some case If I need to check some condition for extenal message, and just accept message from specific address like contract’s owner address, how can i do that? Can I save owner address at first deploy in storage, and get it to use later, any risk? (reply to 96261)

Thanh: I think we should have this mechanism in smart contract 😁️️ (reply to 96263)

&rey: You mean, internal message from contract's owner? Better to store address in StateInit before deploying. (reply to 96263)

User<7106205946>: in TON, you can save the owner's address during the initial deployment of a smart contract and use it later to validate incoming external messages. (reply to 96263)

&rey: How do you validate external messages, given they come from outside of blockchain by definition? (reply to 96268)

Thanh: I mean external message, with owner signed, but some condition may has to check the same to internal message also “)) (reply to 96266)

User<7106205946>: the each external message may include 256bit signature.  When an external message is received, verify this signature against the sender's public key to ensure authenticity. (reply to 96269)

&rey: The default option is "process messages from owner wallet, authenticate by chain-provided sender address". (reply to 96270)

User<7106205946>: during contract deployment or initialization, we should save the owner's address in persistent storage. and then when an external message is received, we need to use the get_sender_address() function to retrieve the sender's address from the message context. (reply to 96276)

An: Hi, I want to check ton_proof on the server side, is there any java example?

sheh: hi all, i would like to install this lib = https://pypi.org/project/tonpy/  but i got this: pip install --upgrade pip root@4ecc1dbb12a2:/# pip install tonpy==0.0.0.1.2b0 ERROR: Could not find a version that satisfies the requirement tonpy==0.0.0.1.2b0 (from versions: 0.0.0.0.5a0, 0.0.0.0.5b0, 0.0.0.0.6a0, 0.0.0.0.6b0, 0.0.0.0.7a0, 0.0.0.0.7b0, 0.0.0.0.8a0, 0.0.0.0.8b0, 0.0.0.0.8rc0, 0.0.0.0.9a0) ERROR: No matching distribution found for tonpy==0.0.0.1.2b0  i using docker,  python:3.11.9  whats wrong?

ᴅʏᴜᴛɪ ᴅɪᴘᴛᴀ: Thanks (reply to 96257)

Nguyễn Linh: Hey, is the TX fee based on the sending amount or not? I see the estimated fee on in_fwd_fee is different when changing the sending value.

&rey: It is based on message size. It increases a bit with logarithm of sent amount. (reply to 96288)

Gavin Wood: HI folks, is there a way to get a full list of all highload wallets?

&rey: Full? I doubt about that, at least because someone might deploy one after you get a list. (reply to 96345)

&rey: Are you trying to solve another problem by listing all highloads, by any chance?

Gavin Wood: look for a list of centralised exchange wallets, hence the interest 🙂 (reply to 96348)

Gavin Wood: Thanks for replying!

Tuan: Hello

Tuan: I'm running ton indexer by docker compose but i had this error

Tuan: [ 0][t 3][2024-08-19 09:09:44.524675599][Status.h:571][!statedb][&status_.is_ok()]      [Error : 0 : IO error: No such file or directory: While mkdir if missing: /tondb/state//secondary: No such file or directory]

Tuan: Oh cannot submit image

MZ: @pcrafter are you able to help me with it? (reply to 95975)

&rey: You need to scan transactions on source address, matching their incoming external message with response BOC. (reply to 96357)

Joel: Is there a strict definition of impure keyword somewhere? I know it means the function is supposed to run some side effects, but it is not clear to me which exact operations would need the impure label.   I've searched on TON docs here: https://docs.ton.org/develop/func/functions#impure-specifier but it only says "we should put impure specifier if the function can modify contract storage, send messages, or throw an exception when some data is invalid and the function is intended to validate this data."  Is this the complete definition of impure? Or is there something else?

Joel: For ex. what about 'reading' from contract storage? (reply to 96360)

&rey: Call to non-impure function can be skipped by compiler if returned value is proved irrelevant to further computation. (reply to 96360)

Joel: Thanks for the answer. But that is not really what I asked. I'm asking which things need to have their enclosing function as an impure function.  In other words, the documentation lists three examples: 1. modify contract storage 2. send message 3. throw an exception Is this everything? (reply to 96363)

&rey: My answer implies: Whatever instructions you don't want to be skipped, you must mark with impure. (reply to 96364)

Nguyễn Linh: Hey, is there anyway to get the locked token amount of an wallet user? For example, the token amount used for staking,... Or are there any other types of locked balances of a wallet that we can track?

دی دی پرایم: Is there a TON Browser for web-3 pages as said in the roadmap? (Other than telegram in-app browser)

Mirodil O: on what purpose counter is used ?  What is actually counter, do we need it ?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 52 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 27  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

&rey: Where have you met it? Contracts in general don't need any counters. (reply to 96372)

Mirodil O: from this tutorial. Counter logic Our local storage structure is going to be as following:  * counter_value - integer * sender_address - slice, the address of the wallet that sent increment command most recently In our recv_internal function we suppose that the local storage already has this data stored, so we just read it. We don't need to read the previous most recent sender, because when we save values back to storage - we are already going to use the new value for this - the sender_address of the current message. Once we get the counter value, we want to increment it... (reply to 96375)

&rey: It's just an example contract. (reply to 96379)

Vincent: Hi everyone, Is there a simulation/dryrun function to simulate if a certain tx will succeed/failed without actual execute it?

Akachi: What do you mean by owner?  Deployer of the contract or the owner of the contract like ERC20? (reply to 96231)

Vincent: no I mean a caller. for example, I want to know if I send 200ton to another user will succeed. if in my wallet there are only 100ton, it will return false and give me some messages. if I have 300ton, it will give me a message of success. (reply to 96384)

Vincent: Just like a simulation and I will decide if I will do that with the infomation returned.

MZ: I use code from the screen that I found here: https://medium.com/coinmonks/understanding-ton-transactions-how-to-track-transaction-results-and-utilize-tonclient-b992336eb3a3  The problem is that boc returned during sending transaction is really long, while the function from the screen returns short hash like: 4fLUfuHzde7xxo2wYwhQV7ZddILIjut9q1V3ZnuiF9I=.  What do I need to do, to compare them? Should I extract boc somehow? Do you have any working example? (reply to 96359)

&rey: You need to compare msgCell against boc. The best way is to convert both into hashes, indeed.

&rey: The send will succeed if and only if THE CONTRACT has 200 TON on its balance. (upd: got mixed up in replies) (reply to 96385)

Vincent: yup, this is an example. what I really want to know is can I know the result of the tx without actual execute it? let's take another example, in the code there requires sender = self.master. if the master send the tx, it will simulate true, and let the user know the execution will probably succeed. but if another user also simulates and it will return false, which tell the user it will probably not succeed. (reply to 96392)

&rey: tonapi's /v2/events/emulate with ignore_signature_check=true

Jari: Hi, does someone know why address filter option does not seems to work in this /v3/jetton/transfers query? I have tested Jetton master filter, and that seems to work normally. I have tested that in toncenter testnet site so I would expect that using address as filter should work.

Freddy | metafields.xyz: cool , hello guys another builder for TON

Nxrix: can someone help me how I must mathematically turn seed phrase and wallet version into address?

Kapil: https://testnet.tonviewer.com/transaction/a649faee024affdd9f3400a78d8bb03ddf5944f6fc4bb173437a81f4825b8874?section=trace

Kapil: kindly tell the error in the above tnx if possible

L2L2🎒: There isnt any (reply to 96232)

Bryce: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {          ;; just receive ton coins     if(in_msg_body.slice_empty?()){         return ();     }      slice cs = in_msg_full.begin_parse();      ;; just receive ton coins from bounce message      int flags = cs~load_uint(4);     if(flags & 1){         return ();     }         slice sender_address = cs~load_msg_addr();     int op = in_msg_body~load_uint(32);     int query_id = in_msg_body~load_uint(64);               if (op == op::jetton_notify) {         ~dump(1337);         ~dump(sender_address);     }  } is there any wait to read the sender_address as human readable address in sandbox?

Apple: I'm very interested in you, What is your requirement? (reply to 96147)

H: hi , how do i check the res is equal the actual code of the desire contract , is there any other way to obtain the contract code from address and check it ?  const client_response = await client.getContractState(Address.parse(contractAddress))  const res =Cell.fromBoc(client_response.code)

lGe: hey guys, i am trying to make a simple ton app that has connect ton wallet, payments with ton and claiming reward from the game which will aslo be ton

lGe: is it hard to make and do you guys have any resources for that specific?

WG: Hello, could you help me with this issue?  cell payload = begin_cell()       .store_uint(op::registerCustomer, 32)       .store_uint(0, 64)       .end_cell();      cell msg = begin_cell()       .store_uint(0x10, 6) ;; Internal message header, no bounce       .store_slice(loyalty_ledger) ;; Storing recipient address       .store_grams(100000000) ;; Value in nanotons (0.5 TON)       .store_ref(payload) ;; Payload cell     .end_cell();      send_raw_message(msg, 64);  This is the Smart Contract code for calling another smart contract , but it fails. plz help me to figure out the issue. (reply to 96395)

&rey: You've forgotten a bit of flags between value and payload; namely, .store_uint(1, 107). (reply to 96444)

&rey: Do you even use query ID for something? In most cases, it is useless... (reply to 96444)

WG: So you recommend this? cell payload = begin_cell()   .store_uint(op::registerCustomer, 32)   .end_cell();  cell msg = begin_cell()   .store_uint(0x10, 6) ;; Internal message header, no bounce   .store_slice(loyalty_ledger) ;; Storing recipient address   .store_grams(100000000) ;; Value in nanotons (0.5 TON)   .store_uint(1, 107) ;; flags   .store_ref(payload) ;; Payload cell .end_cell();  send_raw_message(msg, 64); (reply to 96447)

WG: Am I correct with  .store_uint(0x10, 6) ;; Internal message header, no bounce  send_raw_message(msg, 64);  ? (reply to 96447)

&rey: Yes. (reply to 96448)

WG: Thanks, let me check it out (reply to 96452)

WG: https://testnet.tonviewer.com/transaction/c69a0efc174a62e5cad39a3bf5f79b228135c3fdb7cba4de35143791a103318a  Please check this, it failed (reply to 96452)

Ruslan: Hey, could you help me to properly parse this format of data? The goal is to extract the jetton amount from transactions I've received from dton.io   {     "in_msg_body": "te6ccuEBAgEAcQC04gGtF41FGQAAAAAAAAAAQB/la+gAkMLZVbts3oYt6sRpdMRQad2A7mVw3A1YbDBMCLvRvTsAEhhbKrdtm9DFvViNLpiKDTuwHcyuG4GrDYYJgRd6N6dMPQkDAQAqAAAAAFRva2V0cmFuc2ZlciBwdWZmJZCs/g==" }   I tried this code below using Python, but the numbers are wrong

Astro: OK let me check that (reply to 96454)

WG: I think you are checking wrong tx (reply to 96459)

Jari: About this one I have tested this in testnet web page and from command line, if using address as filter parameter, it does not work. It just return all jetton related transactions. (reply to 96396)

Lynqoid: Has anyone got any example code of adding NFTs to an existing collection? Been following the MintyTON tutorial, but I'd like to add some after creating the collection

WG: This is what I see (reply to 96459)

WG: This is wrong link (reply to 96462)

WG: Ohh I see. Then what is wrong in this code? Could you please check?  cell payload = begin_cell()       .store_uint(op::registerCustomer, 32)       .end_cell();      cell msg = begin_cell()       .store_uint(0x10, 6) ;; Internal message header, no bounce       .store_slice(loyalty_ledger) ;; Storing recipient address       .store_grams(100000000) ;; Value in nanotons (0.5 TON)       .store_uint(1, 107) ;; flags       .store_ref(payload) ;; Payload cell     .end_cell();      send_raw_message(msg, 64); (reply to 96474)

&rey: Mode 64 tries to send all incoming TON. You could replace it with mode 1. (reply to 96477)

0xtitn: Error: sources\jetton.tact:64:13: Incompatible types "Address" and "<null>" for binary operator "!=" Line 64, col 13:   63 |         self.total_supply = self.total_supply - msg.amount; // Update supply > 64 |         if (msg.response_destination != null) { // Cashback                    ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   65 |             send(SendParameters{  who can help me?

Mikhail: Hello everyone! Can anyone suggest the most efficient way to parse transactions using toncenter? Jetton Notify hash comes in, but there is not much information about the transaction in it

Mithra: What happened with the testnet?

Razak: please send Dm (reply to 96147)

/B4ckSl4sh\: Testnet tonapi is down for now (reply to 96504)

Mithra: When will it be up? (reply to 96508)

/B4ckSl4sh\: Unfortunately I don't know (reply to 96509)

Эльдар: confirmed, so sad :( (reply to 96508)

Development: 0QA1xpyYSdK_VV_RrKvMjOclSzpVqs2vJOlGGzGDHh_yiHuF gift me test ton please

Эльдар: testnet tonapi works now

Nathan: . (reply to 96517)

Sammy: Есть опытных разработчиков? Для нашего проекта Tap2Earn требовались разработчики Blockchain и Frontend.

Prince: Do you want smart contract for game? (reply to 96519)

Big Chiano: hi guys, is there a way to mimic the compile() function from blueprint but on a react frontend dapp?

Big Chiano: when i try using the function on react frontend it throws error

&rey: Hm, it should work. What's the specific error? (reply to 96526)

Big Chiano: this is the error i get (reply to 96531)

Chris ◇: Dear Founders,  I’ve developed a full app and am looking for partners to help it reach a wider audience. In exchange for your promotion of my app to your users, I’m offering tech support. If there’s a bug you’ve been struggling with, I’d be glad to assist.  Let’s collaborate and make a difference together. I’d love to connect if you’re interested!  Best,  Chris

🐾 Meshchain.Ai Forex Gra-Gra: Ton has blocked me from access to my wallet after already place a withdrawal of $Dog

kelvium: what (reply to 96537)

itay: Hi guys, the instructions to download the blockchain dump on the official TON docs tell you to contact a scam bot:  https://docs.ton.org/participate/run-nodes/archive-node#download-the-dump

J: I'm trying to better understand the serialization of a raw message. It looks like you can build a raw message to specify a source address, but i am also reading elsewhere that TON will automatically assign the source address to be the true source of the message.   Is this the case? And if so, in what phase does the source address get overwritten? Also, any resources that you can share that may better explain this would be greatly appreciated

Deniel: Hello there! I have this error in console while trying to use beginCell method in code:  import { Address, beginCell, toNano } from "@ton/ton";  const body = beginCell()     .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code     .storeUint(0, 64)                         // query_id:uint64     .storeCoins(1000000)                      // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)     .storeAddress(Address.parse(""))          // destination:MsgAddress     .storeAddress(Address.parse(""))          // response_destination:MsgAddress     .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)     .storeCoins(toNano(0.05))                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message     .storeUint(0,1)                           // forward_payload:(Either Cell ^Cell)     .endCell();    const createTransaction = async (recepientAddress: string, amount: number) => {     await tonConnectUI.sendTransaction({       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [         {           address: recepientAddress,           amount: toNano(amount).toString(),           payload: body.toBoc().toString('base64'),         }       ]     }, {       notifications: ['before', 'success', 'error']     });   };   P.S. When I remove beginCell – application works correctly without any errors

itay: It gets worse (please dont ban me) here are the two mentions in the ton docs where this was approved: https://github.com/search?q=repo%3Aton-community%2Fton-docs%20TONBaseChatEn%20&type=code (reply to 96542)

itay: The --user <usr> --password <pwd> is completely redundant too, you can download the archive without it. It seems this was sneaked into some merge at some point.

/B4ckSl4sh\: As said in docs:  If a message is sent from the smart contract, some of those fields will be rewritten to the correct values. In particular, validator will rewrite bounced, src, ihr_fee, fwd_fee, created_lt and created_at. That means two things: first, another smart-contract during handling message may trust those fields (sender may not forge source address, bounced flag, etc); and second, that during serialization we may put to those fields any valid values (anyway those values will be overwritten).  So incorrect data will re rewritten by the validator when processing your outgoing messages (action phase) (reply to 96544)

Development: Hello. Please write to me. I am ready to help you promote (reply to 96535)

Nathan: yo, do you know how I can make a test transaction?

J: I appreciate you 🙏 (reply to 96551)

— 2024-08-20 —

Nathan: . (reply to 96557)

Thea: Hey send me DM (reply to 96535)

User<7424117540>: /stat@combot

prometheusoo: Does the mini app not support saving images to the system album?

prometheusoo: Hello brother, is there a solution to this problem? I also encountered it (reply to 94360)

TKAINU: Hello, i call fucntion smart contract using mnemonic with TonClient: const mnemonics = [];     const keyPair = await mnemonicToPrivateKey(mnemonics);     const workchain = 0;      const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });     const contract = client.open(wallet);     const maxRedeemLimit = 1000000;      const queryId = Date.now();     const body = beginCell()       .storeUint(0x1e22f3a4b, 32)        .storeUint(queryId, 64)        .storeUint(maxRedeemLimit, 32)        .endCell();     const seqno = await contract.getSeqno();     const transfer = await contract.createTransfer({       seqno,       secretKey: keyPair.secretKey,       messages: [         internal({           value: toNano("0.5"),            to: Address.parse("EQCD39VS5jcptHL8vMjEXrzGa1cCVYto7HUn4bpAOg8xqB2N"),           body,         }),       ],     });      await contract.send(transfer);  But i receive err: Error: AxiosError: Request failed with status code 500, data: {       ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by account 6D68A164FED5BE9C2EF10A967EF95292FF73B7B80883ECE1A4F619D76D9E01D2 before smart-contract execution',       code: 500     }

TKAINU: Please help me

Nguyễn Linh: Do anyone know the meaning of queryId? Can I always set it to 0?

Vladimir: QueryID doesn't manage anything. It can be used to optimize indexers implementations, looking up all transactions downstream of a specified one. You can always set it to 0. (reply to 96584)

Tuan: can someone help me with this (reply to 96355)

Tuan: error when run indexer worker

Vladimir: Two slashes, fix the path (reply to 96588)

Tuan: I used default config, which env need to be fixed? (reply to 96589)

TKAINU: what err?

Danil: Is there anyone here who can help write a Python script to connect to a site via ton Connect with keypair? Paid

jessepinkman: Is there a 0x protocol alternative for the ton network?  Thank you

Danil: I will explain in more detail what needs to be done  There is a demo version of the site with ton connect (demo-dapp-with-react-ui in github)  I have a pair of keys for a tone wallet. I need to connect to the demo site through a python function using a key pair

User<6797464936>: Hi, I'll help you, please DM me. (reply to 96606)

User<7351092364>: Any update going on

127.0.0.1: how to confirm trx using python SDK

127.0.0.1: +is there SDK for Rust?

&rey: You want to TON-Connect your Python application (as wallet) to a dApp (site)? (reply to 96613)

127.0.0.1: when i request sell nft from fragment it send confirmation to my wallet, i wanna confirm such requests that came from fragment (reply to 96618)

&rey: How'd you verify that transaction request coming from Fragment is authentic and valid? (reply to 96619)

127.0.0.1: i can impl some kind of id and hash for each trx (reply to 96620)

&rey: Say, your application received a request to transfer 99 TON + a username NFT to a certain contract. What must your app do then? (reply to 96624)

127.0.0.1: i will make sure it accept only trx came from fragment address (reply to 96625)

&rey: But until a message is sent from user's wallet, it has no source address... TON Connect 2 channel is encrypted, but it doesn't have anti-MitM measures to my knowledge. (reply to 96626)

127.0.0.1: hmmmmm, u just saved my life (reply to 96627)

127.0.0.1: so do u know how to deal with such case?

127.0.0.1: i wanna but all my nfts on auction doing it manually will take days

&rey: You should reimplement Fragment's logic — what specific contract it uses for sale, for instance. (Or Getgems' instead of Fragment's, as that platform also supports selling NFTs.)

127.0.0.1: thanks (reply to 96631)

Danil: yes (reply to 96618)

Danil: I'm increasingly inclined to think that I'll have to write a tonkeeper python implementation

Danil: It is impossible to do this in any other way

&rey: You will have to do that, yes. You can use TC2 implementations of dApp side (pytonconnect) as guide. (reply to 96634)

127.0.0.1: can this be done using py SDK (reply to 96631)

&rey: With pytoniq, certainly. With other libraries — probably yes as well.

TKAINU: i deploy and receive err: 65535 Can I ask what error this is?

!van: Hi all! Maybe somewho knows, how to get jetton wallet address or jetton master from toncenter v2?

!van: Really important issue

Monika: Finally found the ton dev chat, if I'd been here it'd have saved me 2weeks of straight pain in the ass coding marathon ....lol

Matthew: Greetings my fellow indians

Sixone: Hi I am following https://docs.ton.org/participate/run-nodes/full-node to run a full node.  but keep seeing this error. "error: externally-managed-environment" Can anyone help?

Biduero: Hello, can anyone comment this? as I understand it’s not enough trusted data to build some logic on top of it comparing with Etherium events? for example checking deposits or withdrawals

Biduero: It’s tonapi docs (reply to 96661)

eg: UPD: fixed like this, hope this will help to somebody function loadFight(slice) {     try {         let sc = slice.loadRef().beginParse()         let _owner = sc.loadAddress();         let _createTime = sc.loadIntBig(257);         let _finishTime = sc.loadIntBig(257);         let _baseAmount = sc.loadCoins();          let sc_1 = sc.loadRef().beginParse();         let _amountPerRound = sc_1.loadCoins();         let _rounds = sc_1.loadIntBig(257);         let _maxPlayersAmount = sc_1.loadIntBig(257);          let _players = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_1);          return {             owner: _owner,             createTime: _createTime,             finishTime: _finishTime,             baseAmount: _baseAmount,             amountPerRound: _amountPerRound,             rounds: _rounds,             maxPlayersAmount: _maxPlayersAmount,             players: _players         };     } catch (error) {         console.error('Error parsing Fight:', error);         throw error;     } }  function dictionaryToObject(dictionary) {     let result = [];     dictionary._map.forEach((value, key) => {         let parsedValue = value;         if (parsedValue.players) {             parsedValue.players = dictionaryToObject(parsedValue.players)         }         result.push(parsedValue)     });      return result; }  (async () => {     try {         let { stack } = await client.runMethod(contractAddress, 'currentFights');         let cellOpt = stack.readCellOpt();          if (cellOpt) {             let dict = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), {                 serialize: function () {},                 parse: function (cs) {                     return loadFight(cs);                   },             }, cellOpt);              const dictObj = dictionaryToObject(dict)             console.log(dictObj)         } else {             console.error("No cell returned from stack.");         }     } catch (e) {         console.error(e);     } })(); (reply to 94975)

&rey: Events in TON are not useful, same results can be achieved with monitoring transactions (on specific addresses, though; TON does not aggregate log messages from different shardchains). (reply to 96661)

&rey: (It also must be noted that different projects have different notion of "events". Blockchain itself defines log messages, no events.)

SH: Hi! can I ask some question? Is it possible to use mainnet address in test net? and what about vice versa?  When I check my address in ton testnet explorer, Im seeing my address is converted into mainnet bounceable address though I'm searching on the testnet explorer.

&rey: 1. yes, 2. it should be impossible, but depends on specific project (reply to 96673)

SH: 2. it happened on tonscan testnet and does it mean it's not reliable? (reply to 96674)

Soon Guan: I have a related question, if I want to observe all transfers or a specific token, do I look at transactions or messages ? (reply to 96671)

Soon Guan: In  EVM equivalent terms, that will be just looking at logs and filtering by topic0

TKAINU: What error is this?

&rey: That's hard and usually involves either using API or indexing whole blockchain. (reply to 96678)

Soon Guan: I have the entire chain indexed on a db 😄 (reply to 96684)

Soon Guan: I am figuring out how to fetch the transfers

302_____badshah: Please don de do

Gavin Wood: Is there a way for me to get TON aggregate transfers? eg. how much address X has received in terms of total TON

Monika: Can you join me to work on a "tonconnect button" on my Dapp ? I will be eternally grateful 🙏

User<6797464936>: you can utilize the APIs provided by various services, such as the Toncenter API or Bitquery.  The Toncenter API allows you to access transaction data, including the total amount of TON received by a specific address. (reply to 96692)

!van: how do I get jetton master address? I need to check if I've been gotten the correct token (reply to 96641)

Jake: Master is the account deploying and creating the jetton account/contract (reply to 96701)

!van: ok, thanks. but how can I get a jetton address after I got transactions list for my wallet? (reply to 96703)

!van: to verify

Jake: Did you deploy the contract yourself or someone else? You should be able to trace the tx back to the original deployment just off one mint or transfer of jetton (reply to 96704)

Jake: When i deploy, it gives me the master and jetton address. Master is always the account I'm using via mnemonic

Jake: Look in to ton center api (reply to 96686)

&rey: Jetton wallet is account which sent you transfer notification. (reply to 96641)

Soon Guan: Hey Jake, I'm looking to parse or create transfers from raw transactions / messages data, rather than fetching from the API again (reply to 96709)

!van: I want to use toncenter v2 to find out about USDT (or different jetton) transfer to my wallet address (reply to 96707)

Lynqoid: When you make a NFT... you create a collection contract, marketplace contract, nft contract? Do you have to initialize (send ton) to each of the contracts you've made? I'm trying to put NFTs up for sell (just testnet) and they always fail to transfer. But I can put them up for sell via the getgems interface.

Kapil: Can anyone tell me how to call the jetton transfer contract call in the another contract

Victor: Hi everyone!  There’s been a frequent question: "How do I use a script to put my GetGems NFTs up for sale?" Also, it’s worth mentioning that the documentation for TON includes outdated code. I’ve already made the necessary corrections, but the commit is still being reviewed.  I decided to write my own code and share it with you. If possible, I plan on adding support for Go, Python, and TON Connect. I’d appreciate it if anyone would like to make a Pull Request .  Here’s the link to the repository: SaleGetgemsNft.  If you have any questions, feel free to ask! I’ll do my best to help.

Lynqoid: Will check this out, thanks! (reply to 96724)

!van: I'll repeat the question again. How do I get the token address using toncenter v2? Please help me

Walter: Is testnet down for anyone else??

Walter: Even here caution data may be out of date lol (reply to 96734)

User<6976132603>: Hi, there! I have rich exp in building dApps, DeFi protocol, NFTs, TMAs and TG bots. Plz let me know if you need my help

Kapil: How to send the multiple transaction in the contract

Granit /: Hey guys If you need Telegram Mini Game let me know   Ready to use in 30 minutes

H: Hii , do you think i only need one sale and one marketplace contract for all my users , to be able put their NFT for sale and other options? I don't get it properly

TOP: Hello, folks. I deployed jetton but there is unverified badge. How can I remove or verify my jetton?

.: Guys, help me find investors for my project, or how to get investments, I will be extremely grateful to you

H: You can verify it on test net and main net , .5ton for contract (reply to 96780)

H: I send the link as I reach the PC (reply to 96780)

Bryce: Please send it in the chat (reply to 96784)

TOP: Contract was verified but it shows unverified token on tonkeeper wallet. (reply to 96783)

H: https://verifier.ton.org/?testnet= (reply to 96788)

TOP: Jetton contract was verified.

Guillaume: Is it possible to get the public key from a private key ?

Alex: Hi everyone. Could anybody help me please?  I have a tonClient, like this  new TonClient({             endpoint: 'https://toncenter.com/api/v2/jsonRPC',             apiKey: process.env.TON_API_KEY,         }) But it seems apiKey is not used - I'm getting the 429 (Too many requests).  Also I cannot see the X-API-Key in the request.   How I can pass the api key properly?

Ruslan: Which library do you use? I suppose there should be “config: {..}”. Also check if apiKey parameter has a different name. (reply to 96796)

Alex: @ton/ton (reply to 96798)

SACGRO: Make sure this code is not executing multiple times (reply to 96796)

Ruslan: Okay, I’ve seen such error once, but I cannot reproduce it after that. Make sure that env variable is set properly. (reply to 96799)

Alex: ok thanks, I will try (reply to 96803)

Apple: As a senior blockchain developer on TON, I'm very interested in your project (reply to 96606)

Danil: what do you think about this? (reply to 96808)

Apple: I think it is possible (reply to 96813)

DEM: Hello, need help.   The firewall set and specified access rules, namely the ban on connecting to ports 5672 and 5432, and included 3 IP addresses as an exception, but I can still connect from others  I'll send in some coins for your help

User<6797464936>: plz ensure that the firewall rules are correctly configured. the firewall rules are often processed in order. if a more permissive rule is placed before your blocking rule, it could allow connections that you intended to block. and also recheck the exception rules for the specific ip addresses you have allowed. (reply to 96821)

Luis: Hello, anyone here can explain me how ton’s storage cost works?

&rey: At each transaction at a contract, some TON (proportional to elapsed time and contract size) are deducted from contract's balance. (reply to 96829)

User<6797464936>: it's determined by several factors related to the smart contracts and the data they store. - the validator collects storage fees from smart contracts. - storage fee is calculated with this. number of cells used by contract total number of bits stored in those ceslls (reply to 96829)

User<6797464936>: storage fee = cell_count*cell_price+bit_price (reply to 96829)

Nathan: Hi, I need some help. How can I get the transaction ID? When using the sendTransactions method, it only returns a boc, but I wanted to get the ID to test in testnet.tonscan.

Nathan: I'm using TonConnectSDK (reply to 96835)

Oren: is ston.fi v2 being used or still under developement?

Monika: Hi, here again. I need someone to help with the tonconnect button UI integration on my site. I will send some TONs for appreciate. 💯🤝🏻

Yhwach: Hello, can anyone let me know whats happening to tron energies? I had 26M energy now it became 13 suddenly.

🦉: Hello, i have a question, when i send a transaction in react with         const tx = await tonConnectUI.sendTransaction(myTransaction);  i don't get any information about the status, either id of the tx

Yhwach: I mean its half of energy for that amount of staking.I had 23M energy yesterday for 300K usd stake. (reply to 96845)

@Bored 🐵: Hello, I can help you (reply to 96840)

TON Bounty Bridge: ​Stonfi DEX Data Collection Module (Python)  Summary:To build an asyncio-based Python client for parsing and interacting with Stonfi DEX's API.  Rewards: • SBT Bounty Reward • 500 USD in TON  Created by seriybeliy11

Alpaca ΞTH: Hey, can someone tell me how I can implement that people automatically are signed in with their TG account when opening a bot?

Alpaca ΞTH: Telegram login widget, tnx (reply to 96852)

&rey: This is chat for another blockchain, TON. (reply to 96843)

Денис: Hello everyone. Please tell me how to calculate the amount of money to pay for the storage of the contract? How much does it cost per year to store 1 96-bit long cell and two links to other cells?

jaq₿ek.eth: hello. how should i change code to store multiple addresses with their corresponding time.  (int, cell) load_data() inline {   var ds = get_data().begin_parse();   var time = ds~load_uint(64);   var address = ds~load_ref();   return (time, address); }  () save_data(int time, cell address) impure inline {   set_data(begin_cell()     .store_uint(time, 64)     .store_ref(address)     .end_cell()); }  all i can do is this (store only one address with its time), and all my trys mainly end on initialization data error.

Big Chiano: how do you guys run transactions on frontend? blueprint seem to be an headache on frontend.

Yash: Hi are you aware of a common shared channel for all TON validator operators?

EDITOR FRED: Dear Admin, I would like to introduce a new opportunity and request your permission to share the details in DM or anywhere.  May I have your consent to proceed? Thank you.

&rey: Channel? @tonstatus. (reply to 96885)

&rey: Why would we do that? (reply to 96873)

Yash: But I can't seem to be able to post questions there (reply to 96895)

Lynqoid: Is testnet or gems testnet stuff down/not working right now?

Luis: I read something about periodically cost based on storage size (reply to 96831)

Pablo: Officially joining the ranks. Looking to add value in the near future.

— 2024-08-21 —

I'm: Hi everyone, I have learn highload wallet and test to use it. I can transfer TON and Jetton to multiple addresses. I want to use highload to get TON and Jetton balance from multiple wallet. But I cannot  find and docs which give the example. Currently, I use API from tonapi to get TON balance in multiple addresses (no API for get Jetton balance in multiple address). So if you have funC code and it's example in Js/TS , please share it to me. Thank bro so much.

Joe: I would like to ask a question, how much bandwidth is required to run a ton validator node? I read in the document that it is 1Gbps, but the recommended bandwidth is 10Gbps. Thanks！ https://docs.ton.org/participate/run-nodes/full-node

Haint: Hey everyone, do you know how tonscan generate this hash for the internal (out) message coming out from a transaction?  I mean the data is not there in the transaction object, how can they link that particular hash with this specific message?

Haint: tonviewer also does something similar, they can link the transaction and its outgoing/internal messages. How can we achieve this?

Haint: this is basically all the data we have for the internal messages, which I dont think has enough information to do something like that

I'm: Hi, Can we earn money when build a node? (reply to 96927)

vata | DSRV: Is there anyone from the TON team who could help verify why the output values from the TON indexer are different?  https://github.com/toncenter/ton-indexer/issues/76

Daniel: hi all, im trying to use a try catch syntax in func and my compiler is complaining missing ; statement when its actually the right statement, anyone faced the same issue? im using vscode and using the FunC Language Support extension version 1.1.7

Kapil: I am currently creating the stacking contract while withdrawal process I have to send two tnx one to jetton master contract to mint the reward and another tnx to the jetton wallet contract to withdraw the amount from the jetton stacking contract wallet to the stacker jetton wallet address but I am not able to send the both the tnx at the same time .only one tnx is being processed in the stacking.how I can solve this issue.

Gavin Wood: Trying my luck again, anyone knows a way to get TON transfers in aggregate / historical TON holdings?

UwU•JJ: Hi, anyone tried transfering Jetton using Rust?  I sometimes encounter this error from ton client (testnet)  Tonlib error (Method: RawSendMessageReturnHash, code: 500, message: LITE_SERVER_NETWORK)   I have no idea how to debug nor finding source to understand this error. Would be much appreciate if someone can explain why this happened to me. Thanks in advance!

UwU•JJ: btw, I'm using tonlib-rs from stonfi

Sina: Are there any plans to decrease the block confirmation time in upcoming blockchain core updates? Currently, it stands at about 6 seconds—has there been any consideration given to shortening it?

!van: Hi everyone. Still haven't found a solution. Please help 🙏 (reply to 96732)

(⁠✷⁠‿⁠✷⁠): If someone is interested in MINTING own NFT coinage on their website, write to me in person, I will show examples

Gavin Wood: how does logical time work for a wallet?  Is it just happening in +1 increments for a wallet?

Sina: @opensource (reply to 96971)

Gavin Wood: Hmm, Toncenter seems promising, but I'm having trouble understanding how to use created lt and hash to filter for specific transactions I want (reply to 96699)

TKAINU: hello. im using endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' but receive error: AxiosError: Request failed with status code 500 please help me

Alex 🦉: Good morning, little question, how can i extract info about a transaction made in TON?  sendTransaction return a "boc"     const tx = await tonConnectUI.sendTransaction(myTransaction);          const boc = tx.boc;         const code_cell = Cell.fromBoc(Buffer.from(boc, 'base64'))?.[0]         const txI = loadTransaction(code_cell.beginParse());  but this raise an error saying invalid data

Kenny: Hi guys. I'm wondering if we can generate a safe random number in TON? The developer doc says something about random number generation here https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation . It says it's safer to skip a block (by sending message to master chain) before the random number generation.  But I don't think this is any safer. Since the malicious validator can send an external message earlier, so that when master chain sends back the message to the lottery contract, the transaction is exactly being processed in the validator's block. And the validator could change the block seed as he/she wishes. Is my understanding correct?

Milad: can someone please explain what is Something happened but we don't understand what does it mean  address: https://tonviewer.com/UQCkEQXerZZvw5-7DjKINUhkkgSOJT8Z5opi81W1HtS472eV

Yash: Is there such a channel? 🙏🏽 (reply to 96885)

:D: Are we allowed to show off our projects here?

Acr: topics = [         {           triggerName = "block" // block trigger, the value can't be modified           enable = true           topic = "block" // plugin topic, the value could be modified  I set this in the config file of my lite full node, but I don't see any event in the Subscriber on port 5555, do I miss something ?

Resha: Hey, I am using below code for Native transaction, could anyone please tell me what modifications or code i need for non native transaction. Usin tonconnect-ui deps.  let tx: any;      const transaction: ITransaction = {       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [         {           address: to,           amount: toNano(amount).toString(),         }       ]     }      if (memo) {       const body = beginCell()         .storeUint(0, 32)         .storeStringTail(memo)         .endCell();        transaction.messages[0]['payload'] = body.toBoc().toString("base64");       tx = await this.provider.sendTransaction(transaction);     } else {       console.log(amount * (10 ** token.token_decimals));       tx = await this.provider.sendTransaction(transaction);     }

SMI: hello guys! I am working on a telegram mini app and i would like to know if there is a way to know when a user joined telegram

Prince: impossible. all they do is just predict (reply to 97018)

Prince: with their own script

SMI: i saw that DOGS Comunity have something like this

Prince: yeah.

Sina: @slavafomin (reply to 96971)

wikig: Hello guys , any of you guys use the telegram Oauth 2.0 before ?  I meet some issues during the developing using telegram Oauth 2.0 inside the telegram miniapp

Nathan: guys, is it possible to get the transaction data? like the transaction id and hash. good morning

Nathan: how can i do that?

Slava: In my experience it's more like 4-5 seconds.  I haven't heard about any initiatives to decrease this time. Also, I believe this time is very reasonable for most applications.  And if you want quicker transfers you can always use payment channels. (reply to 97025)

Roland: Is there any videos tutorial to learn smart contracts (reply to 97030)

Slava: Of course. (reply to 97035)

Roland: Please where can I find it (reply to 97036)

Slava: Have you tried openning the official website? :) (reply to 97037)

Roland: Yes, I opened the docs (reply to 97038)

Sina: But i guess we can not use payment channel for calling contracts ! right ? can i use payment channel for transfer jetton ? (reply to 97030)

Slava: You can, in theory. I'm not sure if this is yet implemented by someone. (reply to 97044)

Sina: Okay i will check it more Thanks (reply to 97045)

Andy: Why would you want that? (reply to 96971)

Cube: If someone faced problems with onchain nft collection metadata serialization, you can check out this repo  https://github.com/dExNight/Onchain-Nft-Collection

Fardin: I already saw an error like that when used OKX wallet for sending transaction. (reply to 97004)

Fardin: You need to extract the transaction hash from the boc Then you need to fetch it's data via extracted hash (reply to 96999)

Fardin: Try to get an api key from @tonapibot (reply to 96997)

Tom - Bushi: is there a function to estimate how much gas has to be sent for the full transaction to complete? along with any TON left for storage fees? preferrably in tact

Fardin: You could do it with TonWeb easily (reply to 96966)

Roland: Great community

Fardin: I'm working on that either buddy The Ton fee calculation isn't like EVM coins  We have several factors may affect on the fee  Storage Fees + Computation Fees + In Forward Fees + Action Fees + Out Forward Fees (reply to 97060)

Tom - Bushi: yeah I get it, just wondering if there is a way to estimate it without having all these hardcoded in a frontend somewhere to know how much should actually be sent.   On the other side of that, how can I tell if a transaction ran out of gas halfway through processing? It cant be as simple as seeing if any gas was returned, since some contract might just not send it back, or one might send some back while a further message failed (reply to 97064)

Fardin: That's right  Maybe we could do a research on the projects like tonkeeper (reply to 97067)

Tom - Bushi: Im still very early on in learning, not sure I could be of any help 😅 (reply to 97069)

Alex 🦉: you have an example? i don’t have any idea of how donit (reply to 97057)

&rey: Hardcoding is easier and produces less load both on frontend and on liteservers/whatever you'd task with estimating fees. (reply to 97067)

&rey: (Estimating fees costs at least those fees, from node owners perspective.)

Development: Bulding testing for deploing testnet problem?

Fardin: Here is what you need: const { Cell } = require("@ton/ton");  function exportHashFromBOC(boc) {     return Cell.fromBase64(boc).hash().toString('hex'); } (reply to 97077)

&rey: Are you sure? (reply to 97090)

Fardin: Yep its working for me (reply to 97091)

Big Chiano: bro can you send me some links please? (reply to 97043)

&rey: Well, it returns message hash instead of transaction hash... though explorers might process those in the same way, I guess. (reply to 97092)

Fardin: Yep When you try to use TonConnect send transaction will return a boc which we could export hash with that function (reply to 97094)

.: Guys, maybe you know who can invest in a project on the Ton blockchain

Roland: Can you use smart contracts to interact with dedust and ston to perform swap on the backend (reply to 97095)

Kratoste: Hello (reply to 95832)

Kratoste: I have experience with telegram mini app on telegram bot. (reply to 95832)

Kratoste: plz dm me and discuss further

Apple: I'm very interested in your job (reply to 95832)

Apple: Yeah, I'll do (reply to 97097)

&rey: Why do you need both backend and smart contracts? (reply to 97097)

IIIIIIIIlllllIIIIIIlll: Hello looking for a few motivated Developers to start building a project. Kindly message if interested

&rey: Perhaps you'd have more interest if you named project or its area at least. (reply to 97117)

&rey: (I'd also be grateful if you didn't ask for DMs, actually, but that seems less important.)

IIIIIIIIlllllIIIIIIlll: I want to build more than one project. I have no experience in codes. Many years of experience in the Crypto world (Since 2017) & slowly making connections inside TON Foundation. (reply to 97118)

IIIIIIIIlllllIIIIIIlll: That’s as much as I’m willing to say for now ;)

N ARI AVKAN: DM, i can help you (reply to 97121)

Lukasz: Hey guys is here anybody who can help me add new function to smart contract from GitHub “minter contract” ? I try do it alone but always get errors when try compiling :/

Alex 🦉: yeah but how can i extract transaction info with this hash? (reply to 97090)

Asher: Hi guys! TLB scheme is one of the most difficult to understand concepts in TON blockchain. We prepared a lecture on this topic on our channel and I want to get your feedback - is it necessary or not. Thank you!

Development: at NetworkProviderImpl.waitForDeploy (C:\Users\legal\ruben\node_modules\@ton\blueprint\dist\network\createNetworkProvider.js:157:15)     at async Object.run (C:\Users\legal\ruben\scripts\deployRuben.ts:10:5)     at async run (C:\Users\legal\ruben\node_modules\@ton\blueprint\dist\cli\run.js:25:5)     at async main (C:\Users\legal\ruben\node_modules\@ton\blueprint\dist\cli\cli.js:91:5)     Hello, can you tell me what the problem is?

︎dotdotx: 🆒  what lead to the issue, i feel i can help out (reply to 97143)

Fardin: Any explorer api could support this hash Like tonviewer (reply to 97130)

Fardin: Shouldn't be difficult What's the issue? (reply to 97097)

Alex 🦉: so there’s no native way to do this right?  The thing with this api is the api quota (reply to 97145)

Fardin: You could do it natively either but need more data which i wasn't eligible to extract from the BOC (reply to 97147)

Alex 🦉: yeah maybe is not posible right now? (reply to 97149)

Alex 🦉: i tried a bunch of things but i don’t figure out how to do it

Alex 🦉: i even tried the loadTransaction and nothing

Fardin: Maybe (reply to 97150)

Alex 🦉: someone know how to do this? could help a lot

Development: go dm (reply to 97144)

Development: // MAYBE TIME OUT?  20000 миллисекунд) await provider.waitForDeploy(ruben.address, { timeout: 20000 }); ??? (reply to 97143)

&rey: You have to load blockchain data, the thing returned from wallet is generated BEFORE transaction is recorded finally (therefore, transaction might even be lost). (reply to 97147)

Development: help please man

Alex 🦉: you have example of this? (reply to 97165)

yycz: hi, is there any test function in ton like vm.prank(address) in foundry?

— 2024-08-22 —

0xtitn: Who knows how to generate a function ID in TACT?

Roland: It's more faster in terms of swapping token (reply to 97112)

Roland: Nothing but I want to be using for an opportunity, the contract should buy on dedust and sell on ston (reply to 97146)

TKAINU: Hello, I want to sendmessage the functions in the contract, which library can I use ton, or tonweb?

Thanh: Check the init of your “client”: provide endpoint and apiKey (reply to 96582)

TKAINU: i using (reply to 97198)

TKAINU: But when i call, AxiosError: Request failed with status code 500

Gavin Wood: Is anyone good at using dton? I'm trying to get a list of TON transfers - using raw_transactions but can't seemt o get transfer value

Gavin Wood: Is it possible for 2 logical time to be the same?

wikig: Hello guys , anyone know the font-end UI toolkit for next.js/react of teelgram webapp style or TON style  ?

XMR: With Sandbox you have printTransactionFees  https://github.com/ton-org/sandbox/tree/main/src/utils  Might help (reply to 97067)

XMR: If you run out of gas you will see exitcode 14 (reply to 97067)

[+_-]: Good morning guys; hope everyone having a great day!  I'm running into an issue while deploying a contract—I'm getting exit code 7. According to the TVM Exit codes, it means: Type check error. An argument to a primitive is of an incorrect value type. If you encounter this exception in a func contract, it likely indicates a type error in the asm declarations. As far as I understand, this refers to functions that act as wrappers around opcodes. I only have one such function in my contract, and it’s related to a dictionary: (cell, (slice, int)) ~dict_delete_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDELGET" "NULLSWAPIFNOT"; However, I can't seem to spot any mistakes in it, and all the other asm declarations are from the stablecoin-contract. In the wrapper, I'm defining the type as damnProblematicDict: Maybe<Dictionary<Address, Slice>>, but I don’t think that's the issue since I'm loading null/1-bit length 0 uint into it during deployment. If anyone has dealt with similar problems or knows how to troubleshoot them in the sandbox with more detailed logs (         blockchain.verbosity = {             print: true,             blockchainLogs: true,             vmLogs: "vm_logs_full",             debugLogs: true,         }; ), I’d really appreciate any insights ☀️

Milad: Can someone explain? (reply to 97004)

LemonT: Why is this the case?

LemonT: I just updated my app

Razak: sure (reply to 97204)

wikig: Oh , where can we find it  ? (reply to 97243)

Creator: Hello everyone. Does anyone know why I can't import a mnemonic phrase from TONKeeper or Telegram wallet into TrustWallet for example, or other applications with classic blockchains?

&rey: Because they derive keys from mnemonic in a different way. (reply to 97247)

I'm: Hi everyone, if I build a Ton Node, can I earn money from the node?how much profit in node? Thank for answer

&rey: Unless you become validator or provide some API, you will earn zero. (reply to 97250)

Bob: 📣 Join a top web3 dex startup as a ton developer  + Rich ton dev experience + Part-time/full-time both variable + Fluent English as a working language + Remote   ✊ If you're passionate about shaping the future of web3 and want to join an innovative team, please send a direct message to explore this opportunity.  DM @bobluo168

Creator: Thanks)  So does this mean I can't use mnemonics from classic blockchains in TON? I mean I have an app with multiple blockchains and web3 history is managed by one seed phrase in different blockchains (reply to 97249)

Development: ? (reply to 97166)

Andrei: Hi, anyone need a hand with their projects? I've got some spare time and would love to be involved in an ambitious startup. I've got both PM and technical experience, if interested please DM me, will share my LinkedIn account

Khim: Hello i woner that how do we define mapping like solidity does Example: Mapping (uint256 => bool)

unreadyplayer: Hi Andrei, we might be interested. Let's chat! (reply to 97262)

Jeb: Hello, I want to call my contract method 'report(param1, param2)' using Node.js with wallet version v4r2. I have already retrieved my wallet mnemonic. How can I achieve this goal? Could someone help with an example? I have spent lots of time on it~❤️

K.: To call a contract method, you don't actually need to use your wallet directly. If you are using Blueprint for writing your contract, just create a Get method function and provide the parameters there. As an example, here's how you can call the get_wallet_address method on the Jetton Minter contract, whilst providing the target wallet address: https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/wrappers/JettonMinter.ts#L134. (Name of the method and the parameter types, of course, depend on your contract.) (reply to 97279)

Jeb: @Durov_Guru Thank you, K. However, I want to call an impure contract method, which requires first sending an external message to my wallet contract. After that, my wallet contract would send an internal message to the target method. I'm currently stuck at the first step; I don't know how to send an external message to my wallet contract using the existing libraries (if there are any available).

Baever: Hello guys. I am a totally fresh graduate from university(software engineering) and i got the basic knowledge. I want to learn more and start creating apps for TON and web3. Where should i start?

.: Write pm (reply to 97288)

Jeb: I found this should be an example code, and trying it~

User<7453272423>: Hello, I wanna ask. How I can catch code referral in my mini app?. I dont know methods work.

EG: Does anyone know why I keep encountering server errors when trying to fetch data via RPC?

EG: Thanks in advance for any tips who can give me.

User<7111028604>: 👋🏻hi~here for listing cooperation~who should i reach out to?

I'm: Hi everyone. How to check address is v4 or v5? Thank bro

Оля: Hello 👋 Is there any default token jettons utils for local tests? I want to test my contract which is supposed to handle msg with transfer notifications from some token jettons. So i need to have any token deployed in my local cluster during tests (in mean simple jest tests) - so the solution is to deploy some token code during tests, but may be there are shorter way? For example some default token sandbox contract just to work with it in tests and avoid deployment and other stuff?

Anton: Hi! Please advise me any browser based IDEs for TON 😊

127.0.0.1: counter example dosnt work for me +not familler with TypeScript anybody know how to solve?

TKAINU: hello, how to get event logs from Ton contract, i want receive event when interact with function on contract, same emit, event on solidity

Urban: Hey hey.. Is there an SDK that supports v5 wallets? Use case: I need to transfer jettons programatically from a v5 wallet

Swi: We are TGem, a pioneering Gem Mining Game on Telegram, and we're reaching out to explore a potential partnership with your project. As a team dedicated to building and enhancing the TON ecosystem, we’ve found your work highly impressive and aligned with our vision. We would love to discuss a collaboration that could benefit both of our communities.

&rey: 1. What will you do if it is neither? 2. You shall not change accessible functionality of dApp based on that. If person connects v3r2 wallet and pretends to have v4, they have reason to do so. 3. Get address state (from Toncenter, for instance) and match code hash against known ones. (reply to 97311)

&rey: You can write script like this: const endpoint = await getHttpEndpoint(); const tc = new TonClient({endpoint}); const MNEMONIC = ...; const wallet = tc.open(new WalletContractV3R2(...)); const contract = tc.open(YourContract.fromAddress(...)); await contract.sendReport(wallet.sender()); (reply to 97288)

&rey: Yes. (reply to 97324)

&rey: IIRC (more precisely: if TON Connect uses send mode +1) forward fee will be subtracted from sender's balance. It's worth noting that storage fee of destination contract will come from balance of destination contract anyway. (reply to 97345)

&rey: This is jetton: non-native fungible token on TON blockchain. User's balance in each token is stored in a separate contract, called jetton wallet. You may read TON Cookbook for examples of interaction with jetton wallets. (reply to 97347)

&rey: Works for me. Maybe some TMA problem? If so, @devs is appropriate chat. (reply to 97351)

Goodbye: New version of ton-nft-dapp: https://github.com/gradoally/ton-nft-dapp

127.0.0.1: @pcrafter do you know what the issue (reply to 97318)

yarik: Hello, does anyone know how to send an NFT via a smart contract? I want to send an NFT to someone else, however sending it requires 1 TON, and sending an NFT through a smart contract only requires 0.5 TON, so for our system doing it through smart contracts is really the best way. How can I do this?

Ali: Hiring Teaser Clip Editor  Description: We are seeking a professional editor to create a cinematic one-minute teaser clip. The idea scenario and music are ready; we need an experienced editor to bring it to life.  Budget: $80 to $100   Delivery time:one week  If interested, please send your portfolio to my telegram ID @xride_ceo

Marc: Hello, I am seeking a mentor who could answer my questions about TON. Is anyone willing to help me?

🆙 UXUY Hfxonline: Pm me your questions (reply to 97367)

yarik: @mind35653 is privately dming people trying to scam them

yarik: probably doing the same thing (reply to 97368)

🆙 UXUY Hfxonline: I’m not Fren  I’m trying to know what questions he wants to ask (reply to 97373)

Gereon: Hi Everyone,  I am having some questions about the exact behaviour of set_gas_limit, commit and accept_message for external messages in recv_external. Unfortunately the docs are not super clear and even contradictory at times.   1. What happens if there is a commit before accept_message, and a revert from throw_unless inbetween? 2. Who pays for the gas if set_gas_limit is called and the gas_credit (10k) of external messages is exceeded before accept_message? If it's possible to arbitrarily increase gas limit without paying execution fees, wouldn't that be an issue for TON overall?  The docs state > If gas_credit is reached or computation is finished, and accept_message is not called, the message will be completely discarded (as if it never existed at all). During spending those credit, contract should call accept_message to set_gas_limit indicate that it is ready to pay fees for message processing.  > commit Commits the current state such that the current execution is considered “successful” with the saved values even if an exception is thrown later.  Thank you!

MM: Hello, everyoneI'm writing a simple script to send NFT on ton network. It was working well but suddenly the transaction gets failed.There is no error in my code. It works well on the other pc or vps, but only doesn't work on my computer. I tried to run other sample codes but the same error occurs. I think, I can't send any internal message from my computer. Does anyone have the same issue? If so, please help. Thank you

MM: This is my code snippet (reply to 97379)

&rey: It does not. Try decreasing forward amount (preferably to zero) and total amount in the message. (reply to 97360)

&rey: Function doesn't guarantee that, though major wallet apps do best effort to ensure that message is included in blockchain. You have to track... presumably final effects, since that's often what you want to achieve. (reply to 97353)

J: What are the implications of a message sent that has a flag assigned to be non-bounceable, yet, has a message mode that is specified to bounce on action fail?

H: The fee for mint is around .07 ton (reply to 97360)

yarik: But is there any way to answer the original question. Is it possible to send an NFT via a smart contract? (reply to 97383)

H: With the client you use , get the state of your contract to maybe is frozen or not active (reply to 97380)

H: Yes transfer the ownership of nft (reply to 97390)

yarik: Is there any resources for how this can be done? (reply to 97392)

H: Did you write it's related wrapper for collection contract? (reply to 97393)

yarik: No (reply to 97394)

H: First write the wrapper, i think it's a good approach to use any contract to work with contract, first learn how to write wrapper, then you can use transfer or any functionality related to contract (reply to 97395)

yarik: okay thank you (reply to 97396)

oflens: hey guys, is there any way to get all transaction data for TON from beginning to latest? without setting up a node

&rey: In what database do you want to store all that data? Node handles pretty much that. (reply to 97408)

oflens: in bigquery or postgres

&rey: Please contact authors of indexers, perhaps they could help you. (Also, have you considered SQLite instead of Postgres?)

oflens: yes any database is okay. I just wanted a record of all transactions just like a node stores. in a database file or any method from i can get that data.  thanks BTW

Kushagra: https://t.me/TONSocietyIndia/120611

&rey: Here you are: https://github.com/pyAndr3w/ton-preprocessed-wallet-v2. (reply to 97417)

J: which has more precedence? the flags contained in a message, or the mode in which the message was sent? for example, what if i am sending a raw message that sets the flag to be non bounceable, but I specify the message mode to bounce on action fail?

&rey: Should be tested. (reply to 97422)

User<7106205946>: Oh, poorer scammer. (reply to 97427)

User<7106205946>: because u don't know about blockchain- not only TON. go away (reply to 97430)

User<7106205946>: Everyone, be careful, Tomas is scammer...poorest..

Asher: Hi guys! This is a video on our channel that discusses one of the most difficult topics to understand - TLB. Please give me feedback whether such a video is needed or not. Thank you! https://www.youtube.com/watch?v=2qPTsey459E  TimeCodes  00:00:00 - Start. What is TLB 00:01:49 - Example of TLB work 00:04:10 - More complex types of schemes 00:06:30 - Binary examples 00:06:58 - Hex tags 00:12:28 - Built-in types 00:17:45 - TLB schemes, closer to practice 00:19:59 - Asset 00:23:53 - Writing a deposit 00:31:21 - And a few more schemes 00:36:10 - Transfer from FunC to TLB 00:46:10 - Homework

I'm: Omg. So hard (reply to 97437)

Lukasz: can somebody help? i try add new function in minter contract

Artyom: Can someone explain me, is it legal to use TON economic transactions in TMA?

&rey: I don't know. (reply to 97449)

H: https://docs.ton.org/develop/func/literals_identifiers (reply to 97447)

H: TVM doesn't have a built-in type bool; bools are represented by integers: 0 is false and -1 is true) (reply to 97447)

I'm: Ive read it on Tonkeeper. If wallet V5 can send 255 transfers in one request. Is it the same highload-v3? And we don't need a highload anymore. Thank for your answer

/B4ckSl4sh\: Highload can receive multiple requests in small amount of time (is is not seqno based). So it is more like highload v1 (reply to 97478)

I'm: Hi bro. It means wallet V5 will does the transfer sequence. The first transfer done and we get new 'seqno' for the second  transfer. (reply to 97481)

Fardin: Is the contract open source? (reply to 97478)

I'm: You can search tonkeeper wallet v5 (reply to 97485)

Nikita: Two pizza plz (reply to 97492)

Nikita: Big like storage in my smart contract 💪 (reply to 97500)

— 2024-08-23 —

who's this ?🩰: Sup, I can write smart contracts for you, dm if interested

xRampageGG: on Ethereum, you can lookup the wallet address of a ens name,  can you lookup the wallet address of fragment usernames?

Swi: Is there any project party involved with the TON mini-program within the Telegram ecosystem? We are also planning to launch a game and are mainly hoping to cooperate and promote each other in terms of operations. Let's benefit mutually.

lw: hi, why the tx  https://tonviewer.com/transaction/73ae9be35218a8bdb452a2849017d08de640f4bf30ed24576b0ae61d3ae029ab  is SUSPICIOUS transaction?

Laisky: After some time of study, in my current understanding, the SendRemainingValue mode is quite risky and must be used with extreme caution. If there are other pieces of code that generate fees during the action phase, using SendRemainingValue could result in the actual fees exceeding the remaining value of the input message. Essentially, this means that the total fees could surpass what the sender has initially paid, ultimately draining the contract's balance.  The core problem is that there appears to be no way to dynamically determine how much money remains in the input value within the current context. The SendRemainingValue captures a static amount at the moment the action phrase is initiated. Therefore, if you forward twice consecutively, you will end up spending double the amount.

User<5657418771>: Hello 👋 I run promotions on my YouTube channel at very affordable prices. Interested persons can send a message in private. Thanks.

Nikita: And what a problem? (reply to 97546)

Laisky: When a contract want to sending multiple messages, it struggles to manage its balance effectively. If the sender provides sufficient funds, there will likely be some leftover balance remaining in the contract. If an intermediary contract aims to avoid capturing excess funds, then it cannot send multiple messages.  If a contract intends to forward a message to two or more other contracts upon receiving it, without intercepting any balance, it is impossible to achieve that. (reply to 97549)

Nikita: Yes. You need use remaining balance for another cases. I will explain. (reply to 97550)

Haint: just send an action to reserve the balance of the contract first (reply to 97546)

Laisky: I am working on creating a contract that functions as a SaaS. My goal is for the user (sender) to pay all fees without tapping into the balance of my own contract. While there is a way to accomplish this, it will be somewhat complicated. (reply to 97552)

Haint: you need to have your user to pay the rent fee anyway (reply to 97553)

TKAINU: how to decode Cell using javascript

Nikita: If you want to send a request for a contract, and then send all the remaining money to another contract, then use the transfer of all remaining money with the 64 bit flag  If you want to make several transactions, and then send the remaining balance somewhere, then use the raw_reserve and send last transaction with 128 bit flag (reply to 97550)

Laisky: It isn't the total balance of the contract, but the remaining balance of the input within the current context. It would be ideal if we could dynamically access the remaining amount of context values at any moment. (reply to 97556)

Laisky: Users would certainly prefer to pay a fixed fee instead of having the entire remaining balance deducted as a charge each time. (reply to 97554)

Nikita: I do not undestand you. But if you show me example, I show you how need to do (reply to 97559)

Laisky: My current solution is to send multiple messages through the user's wallet contract when needed. This way, any remaining balance remains with the user, allowing them to withdraw it later. Additionally, my master contract is designed to send only single messages, ensuring that all input values are forwarded without imposing extra fees on the users. (reply to 97553)

Development: How does the Jetton Wallet FunC code calculate the address of the Jeton wallet? Where in the smart contract code is the logic that is responsible for creating and managing the Jeton wallet defined?

Haint: you can certainly send the rent fee to your contract yourself, so users doesn't have to pay rent fees (reply to 97559)

Nikita: Example 1. User send from Wallet to Contract 1 TON 2. You send 2 TON to Contract 3. Contract contain 3 TON. 4. Contract send 1 TON transaction to Contract2 5. Contract spend 0.1 TON fee. 6. Contract lock 1 TON and send all remaining balance (0.9 TON) to user Wallet (reply to 97561)

Nikita: Are there any objections to this decision?

Laisky: Imagine a pub/sub contract scenario where users send messages to a master contract. The master contract publishes these messages using the emit function. Many off-chain workers subscribe to these messages to process them further. Once the messages are emitted, the contract needs to reply to the user with any remaining funds.  The problem is that an emit call also needs fees, while replying to the user will deplete the master contract's balance.  This contract is designed to serve multiple users at the same time. It does not keep an internal ledger for users; rather, it aims for all expenses incurred during each call to be covered by the user's input value. (reply to 97560)

Haint: just measure the emit function gas fees (reply to 97566)

Haint: does that function come from another contract?

Haint: why my messages keep getting deleted?

Haint: I dont understand this. The gas fees for the emit function can certainly come from the msg value the user provided (reply to 97566)

Laisky: If you execute the emit and forward functions at the same time, you'll notice that the total cost exceeds the input value. (reply to 97572)

Nikita: Man show simple example. Look here. Your descriptions are too general. I have no same picture in my head like you. (reply to 97566)

Haint: which mode do you use for the emit function? (reply to 97574)

Haint: you certainly cant use mode 64 for multiple messages

Haint: just use mode 0 for the emit, and hardcoded an exact value

Haint: the last action you can use mode 64 or mode 128

Nikita: It looks like you made some system. Stumbled upon difficulties. And now you share these difficulties with us, instead of asking for a solution.

Haint: if you use mode 128 make sure you reserve enough balance for your contract first, or it will drain all of the contract balance

Laisky: I have recently been learning about tact, and it seems that it doesn't mention that emit can set the mode. (reply to 97576)

Laisky: Please forgive me; I haven't been studying ton for very long. The only way I can find solutions is by sharing my problems. (reply to 97580)

Laisky: If you utilize mode 64 with multiple messages, it may lead to costs exceeding the initial input value. This occurs because the remain value determined by mode 64 is based on the value at the time it enters the action phrase, rather than being a dynamic figure. (reply to 97577)

Nikita: Okay, I read it twice and understood as I suppose  Example 1. Master contract 1 TON 2. User send 2 TON from Wallet to Master 3. You raw_reserve 1 TON on Master contract 4. Master emin message with fixed price 1 TON using 0 mode 5. All remaining balance 0.96 TON send to user Wallet using 128 mode  Result On Master still 1 TON New emited message with 1 TON - fee User Wallet get 0.96 - fee (reply to 97566)

Haint: if you dont want leftovers then just reserve the exact balance your contract needs then send the rest to the user via mode 128 (reply to 97582)

Haint: I said you cant (reply to 97584)

Laisky: yep, my fault (reply to 97587)

Laisky: There are two main concerns. First, using 1 TON for emitting is prohibitively expensive. Second, we cannot use 128 since this master contract is shared by multiple users. (reply to 97585)

Nikita: prohibitively expensive No problem. Calculate what You need  Second, we cannot use 128 since this master contract is shared by multiple users. Why? You can (reply to 97589)

Haint: ton isnt like other blockchains, you have to manage your contract balance so it's sufficient to pay rent fees I know it's tedious but it is what it is just define a appropriate balance that the contract needs for storage (e.g 1 TON) then each user transaction will pay the rent fees if any, the rest you send back as mode 128  if you use ton, stonfi have a good package named funcbox, it has many helper functions to manage the balance

Haint: mode 128 has nothing to do with multiple users (reply to 97589)

Haint: if you properly reserve the balance then it's fine

Laisky: The balance in the contract is used to pay the rent fee. I hope that all the fees incurred by the user are paid using their input value. Using 128 will cause the balance to be misappropriated. (reply to 97590)

Haint: do you know about raw_reserve? (reply to 97594)

Laisky: The issue is not about keeping some money; the fundamental problem is that the balance is my money, not the user's. Users are only allowed to spend the amount of their own input value. (reply to 97595)

Haint: what's stopping you then? (reply to 97597)

Haint: if your contract needs the balance of 1 TON to function, you call raw_reserve(1 ton)

Nikita: Yes. You can reserve some ton on balance. 128 mode spend all ton EXCEPT RESERVED (reply to 97599)

Haint: I dont know why it's so hard to understand. You dont want leftovers, you define how much you want to keep, then send the rest back

Nikita: You can reserve as many tons as you need

User<7187641065>: Is there any fee to deploy Telegram mini app?

Nikita: No if you use own VPS (reply to 97603)

User<7187641065>: thanks

Laisky: I really didn't know that raw_reserve could be used with 128. Thank you for your help. (reply to 97602)

Hung: if I can create a pre-generated hash on Tact ?

Kavi🐾: hello i want make a webapp which have TonConnect, i readed docs but cant find where to get started is there any developer portal something

Kavi🐾: like mining app (reply to 97615)

lw: anyone? (reply to 97543)

Laisky: I tried it, but the problem remains unsolved. I still cannot return all the remaining input value to the sender while executing the emit function.  While mode 128 does exclude RESERVED, it does not exclude EMIT. I guess this is because the cost associated with EMIT is calculated during the action phrase stage. Therefore, it seems is impossible to use reserve, mode 128, and EMIT at the same time.  Is there a way to precisely control the fees of EMIT?  I would appreciate your help in identifying the issue with this implementation: (tx: https://testnet.tonviewer.com/kQD8DNPGNaxU9aGSUxvLbeZSDP5BzAPa0wSVedscrjEj1AHs)  receive(msg: RegisterBot){     let walletInit: StateInit = self.getWalletInit(sender());     let walletAddr: Address = contractAddress(walletInit);      nativeReserve(myBalance() - context().value, ReserveExact);      // emit("hello");  // this line will let the transaction failed      send(SendParameters{             to: walletAddr,             value: ton("0.03"),             bounce: false,             body: SetWalletManifest{                 manifestUrl: msg.manifestUrl             }.toCell(),             code: walletInit.code,             data: walletInit.data         }     );      send(SendParameters{             to: sender(),             value: ton("0.03"),             bounce: false,             body: "hello".asComment(),         }     );      send(SendParameters{             to: sender(),             value: ton("0"),             bounce: false,             mode: SendRemainingBalance,             body: "word".asComment(),         }     ); } (reply to 97600)

Sina: where can i find lite servers list ?

closeeyebiddor: /stat@combot

Philip: Hi , I try to setup a Ton RPC server in our k8s env, I am using ghcr.io/ton-blockchain/ton:v2024.08 image, and open the UDP port only, the node still not sync up with error failed to download archive slice: [Error : 651 : no nodes] Is there anything I can do to speed up the process?

Small: If a large number of spam messages with value 0 are sent to the ton contract, will it exhaust the ton contract's balance and how can this attack be prevented?

Marcus: Hello. I have contract written in TACT deployed on testnet.how can I use nodejs to call smart contract receive message? any example?

&rey: No. Same storage fee will be exacted no matter count of messages. (reply to 97640)

Laisky: Users should never be allowed to spend your balance; they should only be able to use their own input value. (reply to 97640)

meomeocoj | Mike: Hi folks, i'm using TonSandbox to test our contract, then i want to config the gasPrice the same the current mainnet. How can i do that ?

Creator: Hey people. Anybody know, how TrustWallet can import TON wallet by 12 words mnemonic phrase ? And how I can generate the same wallet on Python?   I tried to do with pytoniq or tonsdk, but there is 24 words validation and even if I mock result, I got another wallet address

User<7187641065>: Hello guys,   Is there anyone knows that how Dogs validate user like Image?

Dan: hello, I am developing contracts using Tact. I have a few questions about Ton contract. I wonder if you can make a revert while sending a transaction from contract to contract. Since Ton is asynchronous system with message based, I don’t think it’s possible. If there’s more information I need to know about it, please help!

Dev: GM, I’m getting this response anytime I try to open Ton docs website. Or is the link changed/updated?

User<7387667050>: guys, how can i get tesnet tokens?

User<7387667050>: scale for example

Pavel: hi everyone, I was wondering if anyone knows of a method in JSON RPC that allows you to retrieve all token holders, or if there is a library that provides such a method.

Vladimir: https://tonapi.io/api-v2 -> /v2/jettons/{account_id}/holders (reply to 97663)

&rey: https://docs.ton.org is actual link. (reply to 97657)

Small: but The contract also consumes a certain amount of gas before it receives a message, determines the user's VALUE and rejects it (reply to 97643)

I'm: Hi everyone, I use Tonkeeper. I create a testnet wallet and send to it some assets such as: 1 TON and 10000 Jetton coin ( I created it) . Currently, the wallet is inactive, I transfer 1000 jetton coin to other wallet and the wallet will be active and the jetton also send. In Typescript, I can tranfer jetton with active-wallet, but I stuck when to send jetton coin if it is inactive. Do you have the code that can do that? Thank for your answer.

Pavel: thank you for the suggestion! I'm aware of tonapi, but since it requires an API key and is a paid service, I was wondering if there are any other methods or alternatives to retrieve token holders, or if tonapi is the only option available ? (reply to 97665)

&rey: What's the problem with inactive wallet? It should work fine as well. (reply to 97669)

Vladimir: So if you aware you should create your own indexer realization based on lightserver and sifting all the data by yourself (reply to 97670)

I'm: hi bro, it works when we use the app like Tonkeeper. With the app, we can send jetton coin when the wallet is inactive, the app will active our wallet and send the jetton coin in the first transfer we do. I want to ask the code Typescript to to it. When I transfer jetton by TS, if wallet is inactive it will throw error.  DO you have the code? (reply to 97671)

&rey: It shouldn't. What error does it throw? (reply to 97674)

I'm: AxiosError: Request failed with status code 500  ...many detail... I get the main error:     data: {       ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction A02878D969A0A858C89156A1744F94AD462E3C316C947AED5075152F49365A81:\n' +         'exitcode=0, steps=0, gas_used=0',       code: 500     } (reply to 97675)

&rey: Please check if you use testnet RPC.

I'm: yes I do it on Testnet. My code works fine when I transfer jetton with active wallet. (reply to 97679)

I'm: Thank everyone. After 5 hours, I fix it already

Ihor: Hi guys! Does anyone know if min_stake value for nominator pool can be changed over time and if yes, is there a way to check this value as of specific date? Thanks

Rohan: Hlo

Rohan: How I make toncoin

Амир: Buy (reply to 97692)

Rohan: Then

Rohan: Where's my profit

&rey: Possible paths: Participate in contests. Do footsteps or other paid tasks in the ecosystem. Work in a project paying out in TON. (reply to 97692)

&rey: Please note that no one can guarantee you that TON will be worth over certain amount in future. This makes buying it a risky activity, while other paths I suggested take your effort instead of money. (reply to 97697)

Gabriel: Hi all, I'm also interested in this. For example, anyone knows how I could get USDT on my testnet wallet? (reply to 97659)

Alexander🐾: Hi everybody! I am passing ton development course on Stepik know and I have come across a Invalid address error while creating a contract. The code of error:  caught (in promise) Error: Invalid address     at openContract (ton.js?v=c2809e45:17733:15)     at TonClient.open (ton.js?v=c2809e45:24614:44)     at useMainContract.ts:22:19     at useAsyncInitialize.ts:10:22     at useAsyncInitialize.ts:11:5     at commitHookEffectListMount (react-dom_client.js?v=c2809e45:23793:34)     at commitPassiveMountOnFiber (react-dom_client.js?v=c2809e45:25034:19)     at commitPassiveMountEffects_complete (react-dom_client.js?v=c2809e45:25007:17)     at commitPassiveMountEffects_begin (react-dom_client.js?v=c2809e45:24997:15)     at commitPassiveMountEffects (react-dom_client.js?v=c2809e45:24987:11) . How can I fix it? I am initializing contract this way:  const mainContract = useAsyncInitialize(async () => {     if (!client) return;     const contract = new MainContract(address("EQAx3HzbicOriUdT-KInz9fqzHntlfwZCLn9OiybAL1rdNHW"));     return client.open(contract) as OpenedContract<MainContract>;   }, [client]);

&rey: Are your packages up-to-date (no ton, ton-core or ton-crypto, among others)? (reply to 97706)

Development: Hello,  I hope you’re doing well. I have a task that I could use some guidance on. I need to send a command to a wallet to transfer a specific amount of tokens, and for this, I require the wallet’s address. Could you please advise me on how to achieve this?  Thank you in advance for your help!

User<6552923794>: I want to get first name of user through miniapp   const Webapp = JSON.stringify(window.Telegram.WebApp JSON.stringify(window.Telegram.WebApp.initData.user); This give me user information but  JSON.stringify(window.Telegram.WebApp.initData.user.first_name) This not give me first name

Adarsh: Hi guys, we are looking for TON/Telegram app developers for a tap to earn game. This involves a freelance position and will involve good pay scale. Kindly DM for more details.

Prince: you can use API (reply to 97708)

Prince: tap2earn game? (reply to 97711)

Alexander🐾: Yes I guess, I ran yarn upgrade and still get an error (reply to 97707)

Alexander🐾: I have these imports: import { useEffect, useState } from "react"; import { MainContract } from "../contracts/MainContract"; import { useTonClient } from "./useTonClient"; import { useAsyncInitialize } from "./useAsyncInitialize"; import { Address, address, OpenedContract } from "@ton/core";

&rey: What TON-related packages are in package.json? (reply to 97718)

Alexander🐾:   "dependencies": {     "@orbs-network/ton-access": "^2.3.3",     "@ton/blueprint": "^0.22.0",     "@ton/core": "^0.57.0",     "@ton/crypto": "^3.3.0",     "@ton/ton": "^15.0.0",     "@tonconnect/ui-react": "^2.0.9",     "react": "^18.3.1",     "react-dom": "^18.3.1",     "ton": "^13.9.0",     "ton-core": "^0.53.0",     "ton-crypto": "^3.2.0",     "vite-plugin-node-polyfills": "^0.22.0"   },   "devDependencies": {     "@eslint/js": "^9.9.0",     "@types/react": "^18.3.3",     "@types/react-dom": "^18.3.0",     "@vitejs/plugin-react": "^4.3.1",     "eslint": "^9.9.0",     "eslint-plugin-react-hooks": "^5.1.0-rc.0",     "eslint-plugin-react-refresh": "^0.4.9",     "globals": "^15.9.0",     "typescript": "^5.5.3",     "typescript-eslint": "^8.0.1",     "vite": "^5.4.1"   } (reply to 97719)

Development: which? (reply to 97712)

&rey: Yeah, you should delete ton, ton-core and ton-crypto. Usually this is done by deleting all of them and reinstalling needed ones. (reply to 97720)

Fong 🇻🇳: Hi everyone, I want to deploy a TON archive node. Should I install mytonctrl to deploy the archive node as shown in this tutorial: https://docs.ton.org/participate/run-nodes/archive-node#hardware-requirements, or should I use Docker to deploy it as described in this tutorial: https://github.com/ton-blockchain/ton/tree/140320b0dbe0bdd9fd954b6633a3677acc75a8e6/docker?"

Alexander🐾: Big thanks already, but there appeared another one:  TypeError: client.open is not a function     at useMainContract.ts:22:19     at useAsyncInitialize.ts:10:22     at useAsyncInitialize.ts:11:5  Where can I find TonClient object documentation, because before it was imported from "ton", which I removed (reply to 97722)

&rey: It should be imported from @ton/ton now. (reply to 97725)

Joel: Hey guys. Any recommendations on audit firms for func contracts?

Big Chiano: Have anyone experienced an error like this? i am using "ton" npm package

Big Chiano: when i force the parameter by using config type as any i get error invalid address

Big Chiano: ok seen, thanks (reply to 52065)

Ivan: 👋 everyone  I’ve set up a small but useful chat for everyone heading to TON Gateway in Dubai  Join in @tongateway2024  I think it’ll really come alive as the event gets closer! 🙂

thebatclaudio: Hello! I'm trying to deploy an nft collection on testnet, but on tonscan I see that "Contract Type" is "Unknown". I think that I'm writing the offchain content url in a wrong way, but I don't know how to debug.  So I'm asking: - Do you know how can I debug a deployed contract to read the content? (in this case, I need to check if my content url is the right one) - Do you have any other suggestions to debug deployed contracts?   Thank you!

Костя: What happens if the user bought the nft that is on the pinata, and the one who deposited it stopped paying after some time for the pinata, the one who bought it, the nft disappears? Does the person who bought the nft need to add the cid / link to it to his pinata, so that it would not disappear if such a situation happens?  What happens to the paid pinata account from which you made a deposit if you don't pay for it? Will it be cleared? Or?

&rey: NFT will not disappear anyway but might have its image gone. Or not gone, because indexers have a presumably infinite cache. (reply to 97774)

Костя: Thx

Костя: Or maybe there are some free ways to store a large number?

Nathan: can you get a transaction by id?

Nathan: I was trying to use the lib tonweb, but it's not very useful

C: hello is there anyone know about how getgems or tonviever reading metadata of nft. when i check from contract method get_nft_data individual_content is ipfs link and its true but metadata is unavailable tonviewer and getgems .İ couldt understand the logic .And the other question is ton nft concept can i create custom nft collection for example collection will add new nftItem data there will not be user sending the content like on ethereum. if i create custom nft contract how it will seem on tonscan ,tokenviever etc.

Insomnia: Hello there

Insomnia: I am designing a smart contract with FunC and can you give me some information on how to download libraries other than the standard library?

meomeocoj | Mike: What project are u in ? (reply to 97790)

Insomnia: I'm building a mechanism where people can stake tokens with clicks and a few power-ups. (reply to 97791)

&rey: Asking for DMs is not allowed in this chat. (reply to 97795)

DeeSigner | Thrive Protocol: Apologies. (reply to 97801)

User<7453272423>: Hey, Iam obvious about smart contract.

&rey: You just copy-paste those into project. (reply to 97790)

&rey: IPFS is sometimes used. (reply to 97777)

Insomnia: oh thank you (reply to 97805)

User<7453272423>: Hahaha maybe scammer like that (reply to 97805)

&rey: Well, obviously you shouldn't copy unknown code into your smart contract — it will end up as part of contract (even if it defines only get-methods, it might be dangerous!) (reply to 97808)

Костя: That is, it is advisable for me to leave everything on ips so as not to be a scam? (reply to 97806)

Костя: and so that everything is fine with metadata and pictures (reply to 97810)

Костя: yeah? (reply to 97811)

User<7453272423>: I usually deploy on eVM using hardhat. But I dont know for TON what standard library for deploy jetton. (reply to 97809)

Crypto: 👋Hello, is there any video or tutorial to help me how I develop mini app on bubble io (no code platform)??? Thx

J: Hello Devs! We are looking to develop on TON, a quick question for now. We need unique user registration filtering process for onboarding on our platform, if we use dApps, user can connect 'n' number of non-custodial wallets which we can not serve. We can not treat every new wallet as a new user. Telegram 'wallet' is interesting, we could work with 'Basic' identification level. How do think we can build on Ton and TMA? We need unique identification number for individual users as well as information of country of origin would help us to deal with regulators. Any suggestions?

Dom: Yo anyone can help with set up litenode? I have problems with sync since 4 days

Marcus: Hello. is there anyone who use tonconnect to accept and send transaction to  smart contract?

Fong 🇻🇳: Hi everyone, I'm running an archive node. After extracting the snapshot file, I got a db folder. Is there any documentation that explains the purpose of the folders: adnl, catchains, error, keyring, state, archive, celldb, files, overlays, tmp inside the db folder?"

H: ston.fi and dedust api (reply to 25278)

H: hi , i get confused , can i store dictionary in ()  save_data ??

cubby: Hello. Is anyone looking for a blockchain engineer?

Santiago: Hi.  I want to ask this here because it seems not many know about this in the community chat:  Could a smart contract steal my funds anytime after interacting with it?  Thanks

Adam: Nop (reply to 97870)

Adam: If you interact with it using ton connect

Adam: It cant steal for you , you still have to approve the transactions on the wallet

Santiago: Thanks.  Ok, so, the only way to lose my funds is with some evil transaction; i.e. when completed, it either steals you or it doesn't, right?  I mean, there isn't anything like in Ethereum with which I could give full access to my tokens to a smart contract forever, right? (reply to 97874)

Adam: Yeah the only way to steal from you (reply to 97876)

Adam: Is to accept that evil transaction yourself.

Santiago: Great.  Thank you. (reply to 97878)

Doug: Somebody know API of back end of firebase of data real time ?

Davis: Hi, why such important things like tonconnect have errors that are not clear how to correct and which are ignored? (https://github.com/ton-connect/sdk/issues?q=Decryption+error, chat history in EN and RU chats)  In chat history or issues no one has answered how to solve this, there're only ideas about the domain relationship, but no comments from the developers.

H: Hii , how do I state dictionary in wrapper to be able deploy it ?? And how to i initialize dictionary to fill save_data on deploy?? I tried a lot of possibility but i get exit code 7.

— 2024-08-24 —

Sammy: Hello everyone! ❤️  We’re on the lookout for talented Frontend and Backend Developers to bring our Telegram Tap2Earn game mini-app to life! We have a sleek interface design ready in Figma, and now we need your expertise to turn it into a fully functioning app.  If you’re passionate about coding and excited about creating something awesome, we’d love to hear from you!

Sunil | Aerius Labs: Any body aware of why getJettonData function on JettonMaster in not working ?

Snow Lee: It doesnt work on Testnet (reply to 97903)

Snow Lee: As stupid as that may seems...

Laisky: This doesn't match my understanding. I believe that a contract doesn't need to pay any fees to receive messages. Even a contract with a balance of 0 can receive messages. (reply to 97667)

Adam: ? (reply to 97893)

Hung: Hi guys, I have an I have a question: can I create a transaction hash on the backend before posting to onchain like EVM can do?  and after the transaction is confirmed, the tx hash on the onchain is the same as the tx hash I created before

Hung: I searched many documents in TON document but did not find any mention. If anyone has experience, could you help me answer this?

Adam: I dont think so in TVM It’s not possible (reply to 97914)

User<6242359642>: . @wallet has been hacked stays safe

Adam: You can get a hash of the payload that is not exactly tje same as the hash of the transaction but can identify it

User<6242359642>: On twitter too

Adam: Wtf

Adam: Unbelievable

Hung: noted, thank you 🙏 (reply to 97920)

Santiago: Are you sure it is not a fake account with the same name? (reply to 97919)

User<6242359642>: Official t witter too (reply to 97925)

Cyril M |: anyone knows how to reproduce 1000^0.2 in func?

Cyril M |: since floating point is not supported in func

Adam: Math.pow(1000,0,2)

Cyril M |: in func? (reply to 97932)

ABC: Hello dear’s!  Looking a team for building! Learn new technologies quickly. Just need to know the goal.  Wanna building, wanna growing  Front+Back end a bit.  My first miniApp-game ever can send dm to you.  Thx and have a nice day 🦾 P.S. not games only

User<7187641065>: Hello, guys...  I'd like to know about how the "Dogs" validate user like image.  They check the account age, user's activity level, telegram premium, OG(Original Gangster).  I can get the user is using telegram Premium or not by "window.Telegram.WebApp.initDataUnsafe.user". But I can't check the other part of user. Any help?

Degen: When I use tonweb to call call to get the dict type, how to parse it? ?

Degen: The cell contains a dict type, how to parse it? ?

Dom: logs :  tail -f ~/.local/share/mytoncore/mytoncore.log [debug]   22.08.2024, 03:59:21.402 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   22.08.2024, 03:59:21.402 (UTC)  <MainThread>  start GetLocalWallet function [debug]   22.08.2024, 03:59:21.402 (UTC)  <MainThread>  start GetWalletFromFile function [debug]   22.08.2024, 03:59:21.403 (UTC)  <MainThread>  start WalletVersion2Wallet function [debug]   22.08.2024, 03:59:21.403 (UTC)  <MainThread>  start GetDbSize function [debug]   22.08.2024, 03:59:46.438 (UTC)  <ScanLiteServers>start GetValidatorStatus function [warning] 22.08.2024, 03:59:46.448 (UTC)  <ScanLiteServers>GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType' [debug]   22.08.2024, 03:59:53.429 (UTC)  <OverlayTelemetry>start GetOverlaysStats function [debug]   22.08.2024, 03:59:58.500 (UTC)  <ScanLiteServers>start GetValidatorStatus function [warning] 22.08.2024, 03:59:58.511 (UTC)  <ScanLiteServers>GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType' [debug]   22.08.2024, 04:00:33.718 (UTC)  <Telemetry>   start GetValidatorStatus function [warning] 22.08.2024, 04:00:33.732 (UTC)  <Telemetry>   GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType' [debug]   22.08.2024, 04:00:35.836 (UTC)  <custom_overlays>start GetConfig34 function [debug]   22.08.2024, 04:00:36.625 (UTC)  <custom_overlays>start GetConfig36 function [debug]   22.08.2024, 04:00:37.236 (UTC)  <custom_overlays>Node has no adnl address required for custom overlay default_elid1724272392   ----  mytonctrl [info]    22.08.2024, 04:07:22.713 (UTC)  <MainThread>  Start program /home/testnode/mytonctrl.py Welcome to the console. Enter 'help' to display the help menu. [debug]   22.08.2024, 04:07:23.250 (UTC)  <MainThread>  start GetValidatorStatus function [warning] 22.08.2024, 04:07:23.264 (UTC)  <MainThread>  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType' ============================================================================================ Node is out of sync. The displayed status is incomplete. ============================================================================================ MyTonCtrl> status [debug]   22.08.2024, 04:07:28.831 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   22.08.2024, 04:07:28.831 (UTC)  <MainThread>  start GetLocalWallet function [debug]   22.08.2024, 04:07:28.831 (UTC)  <MainThread>  start GetWalletFromFile function [debug]   22.08.2024, 04:07:28.832 (UTC)  <MainThread>  start WalletVersion2Wallet function [debug]   22.08.2024, 04:07:28.832 (UTC)  <MainThread>  start GetDbSize function ===[ Local validator status ]=== Validator index: n/a Validator efficiency: n/a ADNL address of local validator: B4949BB37CE5770FAE520557BD953F8F89EB289D62E89B5F6DDB8D2F7E76 Public ADNL address of node: 2BEB107797BD28C786A7B8D153F0FD3296FFC5328BAD6167EB0F6F53BA039 Local validator wallet address: Ef9LrBcwCHp3Uy6Yj_V3Jra-YI-CTOazOIeCBsstXOhSnR Local validator wallet balance: Load average[12]: 1.16, 1.29, 1.26 Network load average (Mbit/s): 14.15, 16.24, 17.73 Memory load: ram:[20.61 Gb, 65.6%], swap:[0.05 Gb, 9.1%] Disks load average (MB/s): vda:[0.32, 0.74%] Mytoncore status: working, 3 days Local validator status: working, 33 minutes Local validator out of sync: n/a Local validator last state serialization: None blocks ago Local validator database size: 0.05 Gb, 2.9% Version mytonctrl: 7e90e26 (master) Version validator: 140320b (master) (reply to 97846)

MA: Hello guys,    I am using Tongo SDK for fetching shards full transactions.  func (t *Trace) getBlockTransaction(block *ton.BlockIDExt, after  *liteclient.LiteServerTransactionId3C) (*liteclient.LiteServerBlockTransactionsExtC, error) {      blockTransaction, err := tonNode.LiteClient.LiteServerListBlockTransactionsExt(ctx,     liteclient.LiteServerListBlockTransactionsExtRequest{       Id: liteclient.TonNodeBlockIdExtC{         Workchain: uint32(block.Workchain),         Seqno:     block.Seqno,         Shard:     block.Shard,         RootHash:  tl.Int256(block.RootHash),         FileHash:  tl.Int256(block.FileHash),       },       Mode:  7,       Count: 256,       After: after,     })   if err != nil {     log.Println(err)     return nil, err   }    return &blockTransaction, nil } this my function but the pagination is not working what  am i doing wrong ?

MA: and also for liteclient.LiteServerTransactionId3C   I should use LT  and AccountAddr of the transaction. is it correct?

wxyz: yo guys whats up

wxyz: does anyone has some brand new projects ?

wxyz: launching or launched in telegram?

卡: I don't understand this code, where can I get more explanation const op::increase = "op::increase"c;

MA: I found the answer. mode number should be set at least 128 (reply to 97950)

Chaincode: Dm (reply to 97938)

Sammy: Hello everyone! ❤️  We’re on the lookout for talented Frontend and Backend Developers to bring our Telegram Tap2Earn game mini-app to life! We have a sleek interface design ready in Figma, and now we need your expertise to turn it into a fully functioning app.  If you’re passionate about coding and excited about creating something awesome, we’d love to hear from you!

Finch: How to batch transfer NFTs ?

Hulk: Hi guys what will be the best way to get all dat transactions for buybot for many dfifferents adreses? I will not use apis it is full limiteds

User<6623141573>: Bossses.  I was hoping to learn Tact.  Amy advices?

User<6623141573>: Is there any course available from the basic?

Rich: Did the chain get faster? I remember swap transactions taking like 1-5minutes to clear. I did a few dex swaps and it happened super fast, in like 20 seconds

Jérôme: Hello 👋

Jérôme: Any good framework to deploy smart contract from react?

Jérôme: I found this library but not sure it's used

Jérôme: https://foton.sh/docs/guides/tutorial

TON Bounty Bridge: ​Криптовалюта  🏷 Developer Tool  Summary:Здравствуйте дорогие друзья. Сразу скажу вам я простой энтузиаст со своими идеями. Не судите строго ...  Created by TimVozovski

I'm: Hi everyone, do you know what  different between highlload v3 and wallet V5? I've tested both them for transfer. The both wallet work the same with maximum 255 address send at once and the fee is also similar.

Амир: new is well forgotten old (reply to 97996)

ᴜʟᴛʀᴀ ɪɴꜱᴛɪɴᴄᴛ ᴍᴀʀᴋᴇᴛɪɴɢ®️ 🦴: Legit @ admins? (reply to 97995)

ᴜʟᴛʀᴀ ɪɴꜱᴛɪɴᴄᴛ ᴍᴀʀᴋᴇᴛɪɴɢ®️ 🦴: Does any dev needs help in professional branding performance and consulting? I know a good guy ive worked with several times and always huge satisfied.. dm me if any dev needs help in their project ill share the contact. ❤️

&rey: Highload wallet can process several distinct requests with 255 addresses in same block. (reply to 97996)

&rey: (Wallet v5 shouldn't be used for the sole purpose of sending 255 transactions at once, there is a significantly cheaper version!)

Hulk: Guys any idea? (reply to 97967)

meomeocoj | Mike: hi folks, what is the representation of null in TL-B Language ?

Vladimir: Maybe (reply to 98009)

Alexander: There’s no such thing as null in TL-B, but you can define an optional field using Maybe, then the “null” value would be a zero bit (reply to 98009)

Daniil: How to get private and public keys for Tonkeeper wallet?

&rey: Do you have a preferred programming language? (Presumably you have since otherwise keypair would be useless for you.) (reply to 98015)

Daniil: C# (reply to 98018)

&rey: First of all, you have to define what is success: all desired effects complete or something other... (reply to 98014)

&rey: TonSdk.NET? If so, it doesn't have support for signing messages. (reply to 98019)

ㅤ: guys help me plz  where I can find API of token PUNK (punkcity)

ㅤ: Please help me I can't find it about 1 month (reply to 98023)

&rey: When await tonConnect.sendTransaction returns, it doesn't mean that any transactions happened already; actually, their recording in blockchain is provided on best-effort basis (which so far seems to be around 100%).  You have to track transaction on source wallet and match its incoming message to hash returned by TC; when it's found, the funds... were sent. They are guaranteed to arrive eventually, but receiver cannot use them yet. (reply to 98021)

&rey: TonLib.NET supports mnemonics directly: https://github.com/justdmitry/TonLib.NET/blob/b8cdb3d5d223ee3925d243c70f241db4fdf75a50/TonLibDotNet.Demo/Program.cs#L13. (reply to 98019)

Aleks: Anyone knows how long getgems takes before clearing cache on the collection metadata?

Lynqoid: I found the metadata itself doesn't take too long, but the image inside the metadata was set for 1 year, so I ended up having to rename the image. (reply to 98053)

Aleks: Thanks for the info. I changed the name of the image and it indeed got updated now 🫡 (reply to 98061)

Lynqoid: Great, glad it worked for you! (^_^) (reply to 98065)

Ak: Hi Guys, looking for experienced senior developers for our telegram game. We already have the game live and working on Multiplayer Feature. If you are looking for a job DM me

EDITOR FRED: Check inbox 📥 (reply to 98100)

EDITOR FRED: #freedurov Telegram has been a game-changer for many talented individuals, including myself. It has provided us with opportunities that our governments have failed to offer. Let's show our support for @durov, the founder, who has made this possible!  #FREEDUROV

Taufik: Can someone help me about bridge here

Taufik: what do I need to fill in here so that I receive my tokens that I bridged from ton to eth ?

Taufik: i used it

Taufik: but  i accidentally close the website and i can't continue my bridge

Taufik: usually there is a last confirm tx for my to receive my token but i accidentally close the website

Taufik: and is how website look and i cant make a new tx to receive my token

tukino: I am trying to get the transactions of my wallet via API. I can only retrieve a maximum of 100 transactions from the most recent, what should I do if I want to retrieve the 101st transaction onwards?

tukino: Thank you, I will give it a try. I'm new to using the API, so it's hard because there are so many things I don't understand. (reply to 98126)

— 2024-08-25 —

tukino: Thank you very much! (reply to 98130)

661XRATED666: You're welcome!

Kira: Hello everyone, my name is Kira.  We currently have a very strong full-stack team, and we can take on outsourcing for all types of projects related to web3, blockchain, tools, tele mini apps, and more. We guarantee fast delivery and high-quality results.  Especially, we commit to offering the most competitive prices in the market.  I would be very happy to have the opportunity to collaborate with you

User<7012417474>: The API transaction v3 indexer for the testnet Ton Center is currently suspended?

User<7012417474>: It not response new transaction :(

User<7012417474>: Does anyone know what's going on?

Maple: Users have reported issues with the API, particularly with requests failing or returning errors such as "Service Unavailable" or "Bad Request." The API is not processing new transactions, which may be due to maintenance or technical issues on the server side. (reply to 98151)

User<7012417474>: Thank u for your support (reply to 98154)

User<7012417474>: I see the issue only occurs with the testnet indexer v3, not with v2. And it seems like it just started happening today.

Maple: Please search via Google. The Ton Center API indexer v3 for the testnet appears to have been suspended as of Aug 24, 2024, causing issues with processing new transactions (reply to 98157)

Fong 🇻🇳: please check my DM 🙏 (reply to 97854)

S: Is anyone facing issues with the official ton bridge ?

arvindpunk: When using the Telegram Wallet (the self custodial one), how do we identify incoming transactions coming from it, if it doesn't allow additional comments/payload to the transaction? The same works with every other non- custodial wallet.

unreadyplayer: hey guys, how do I get these buttons under the bot description?

F: @devs (reply to 98199)

Kirill: Can’t get free ton on the testnet more, than 1 hour.  The  @testgiver_ton_bot  is stuck, any workaround or any other way to get testnet TONs?

Cube: i can share, send ur wallet address (reply to 98221)

Костя: No, only it (reply to 98221)

Kirill: Cool, should I share my testned addr vi DM ? (reply to 98222)

Cube: dm or here (reply to 98224)

Kirill: Got it, you the King ) (reply to 98222)

Insomnia: hello there

Insomnia: Can you help me with this?

&rey: Have you installed FunC binaries? (reply to 98235)

Insomnia: I split the functions of main.fc into libraries and need to compile them

Insomnia: which one (reply to 98236)

Insomnia: pls help

&rey: From https://docs.ton.org/develop/smart-contracts/environment/installation. (reply to 98238)

Insomnia: thanks (reply to 98241)

Ruslan: I’ll check, thanks for a report (reply to 98151)

Jeremy: Is there any method that can be used to get all latest transactions from a ston.fi pool? Or get transactions from all pools and I filter based on my pool myself? (reply to 97665)

Jeremy: Were you able to find any solution to this? (reply to 93892)

Dom: Ok (reply to 98167)

nookhunter: any good tron bot links

User<5912793884>: dm me (reply to 98255)

Makis: No (reply to 98249)

nookhunter: queit here

Thanh: Hello everyone, Can we import wallet v5 contract to use as normal wallet? I use 24 nmemonic phase create keypair and deployed a walletv5 contract (https://github.com/ton-blockchain/wallet-contract-v5) to testnet chain, but I can’t import it when input these nmemonic phases in toon keeper (show different wallet version v5r1 - by default I think), Is it possible to import wallet contract like this, or somehow?

Thanh: I found some different version between contract v5 and wallet v5r1 (by default in toon keeper), Is it the reason? (reply to 98270)

Thanh: Also in document to deploy wallet https://docs.ton.org/develop/smart-contracts/tutorials/wallet#sending-an-external-transaction, the smart contract deployed address mark Contract Type as Unknown, it different with the wallet create by https://wallet.ton.org or ton keeper. Am I misunderstanding something here? (reply to 98271)

Fanny: I want to do a token mint, how do I do it? I am new to the TON network.

Chi: Just tried the bot and got 5 TON, seems recovered (reply to 98221)

Костя: Are there any contracts that will deploy several NFTs in one turn?

Prince: highload wallet possible

Костя: What if I have an API subscription? (reply to 98290)

Костя: Ok

luis: any testnet usdt faucet on ton?

NPA120: It is very simple.  you can mint your own token by clicking one button (reply to 98276)

Chi: you can mint your own test USDT using https://minter.ton.org/?testnet=true (reply to 98295)

Hossein: hello everybody , i want request user get phone number using javascript

wahyu: hello, how to configure wallet W5 version, i just want to create ton/smartcontract sender with tonweb library. but why the wallet detect always V3R1 addresses

&rey: This is not related to TON and explained in variety of sources. (reply to 98307)

Maple: import { TonWeb, WalletV5 } from 'tonweb';  You can use this module. and also pls create a TonWeb instance and specify the network endpoint. and then create a wallet v5 contract using "WalletV5" class.  why the wallet is detecting v3r1 addresses even when using the v5 contract is that the address generation depends on the wallet contract version used. Each version has a different initial data and code, resulting in different addresses for the same public key. (reply to 98308)

Shakil | GenesisLab.com | DND: Hi Everyone, We have Telegram bot and Botfather is giving us notification of Telegram API rate limit. How can we solve our bot/game rate limit. I will appreciate your help and support.

TON Bounty Bridge: ​Haxe-Func : A Powerful Haxe Toolset for TON Smart Contract Development  🏷 Developer Tool  Summary:Haxe-Func is a powerful toolset built on top of Haxe, making it easy for developers to create smart ...  Rewards: • 10.000 USD in TON  Created by kayx86

&rey: This is offtop. On an unrelated note, you are misinterpreting the message as it mentions issue with your bot code. (reply to 98324)

I'm: Hi everyone, I dont understand why the dev from toncenter build this API with "GET" method.They build this API to checking max 1024 wallets status in one request. But they use "Get" method and then it throw the error when the url is too long. I think it have to "Post" method.

I'm: https://testnet.toncenter.com/api/v3/walletStates?address=UQDPr-g0V_n-1ZvsIWqW1yqhoESL8FJwj_zzs-MmHmBvf8EI&address=UQB4pF5CCzsaitTnsPFXBYbqE1BniYnj9kS9uQ5KrOc3_tle&address=UQDEIr5iEqpN4iiObXI4OQW4srvdJ9d5IOIWuQuQxJNe4ePx&address=UQATzldHjoCjQU81OFONuRjRDOsCN7flim4FLfGe6F1u_TfN&address=UQB2thAP5gUrHruHPIW3aISJRzYqnfaiyD55xKdZLgowFZDC : this is URL to check only 5 wallets state. very long. I've try with 100 wallets, it throws error

Ruslan: Could you please provide an example of the request for 100 wallets? (reply to 98329)

Ruslan: Ah, okay. I see the problem. We'll add your report to backlog. (reply to 98328)

I'm: Here is error: {"error":"internal server error: Request Header Fields Too Large"} . If you need a URL for 100 wallets , I will send to your message. (reply to 98331)

Ruslan: Yes, please send it to dm (reply to 98333)

User<6908616126>: hello everyone, please tell me the library for python to work with highload v3 wallets

H: hi i need help 😅, this is my funC code i wanna save dictionary in code , but i get exit code 7 that refers to initializing  variables in save data , it worked before i add dictionary so the problem is dictionary but i don't know how to initialize it i approximately try 30 different ways but i still get the same error

H: this is my wrraper

H: and this is my deploy script

Shapeshift77: Im not sure where to start but I'm wanting to know about scams on telegram. More specifically how to get back money lost in scams

Dom: @SwiftAdviser can you check pls dm

Danil: Hey, guys! I know there is ability to emit events in tact, to parse them offchain.   emit(StakeEvent{amount: ton("0.007")}.toCell());  But how to do similar in func? Thanks!

Rookie: There’s any plan to support any other language than func for contracts ?

&rey: Actually, the only language contracts support is TVM assembly. FunC is compiled into it. Tact is (via FunC) also compiled into it. Anyone is free to create their own language... although doing optimizations is hard, and studied as a separate field of programming. (reply to 98376)

Rookie: Thnx

&rey: I have also heard of ton-solidity or something like that; it is tuned for another fork of TON but certain features might work here as well.

Rookie: It would be cool to see rust as an option

&rey: Rust exactly won't ever be an option since it heavily refers on pointers, and guess what: TVM does not have any pointers, + all of its types are Copy! (reply to 98381)

&rey: So, &T would need to mean same as T, and &mut T would need to refer to specific place in stack. That already stops you from reimplementing even core, as much as alloc or std.

Rookie: Got it

&rey: Though, I have thought about that idea. 1. FunC's syntax sugar var~change() could be kept instead of mutable references; 2. Lifetimes... lifetimes could refer to validity of values received in messages! Like, contract's jetton wallet address would have lifetime 'forever, while its balance requested in a message would be 'once — value which is possibly invalid even at time of arrival.

Dom: Guys anyone can help set up litenode ?

H: this is my funC code i wanna save dictionary in code , but i get exit code 7 that refers to initializing  variables in save data , it worked before i add dictionary so the problem is dictionary but i don't know how to initialize it i approximately try 30 different ways but i still get the same error

H: my wrraper

H: deploy script

Catid: Did u try test net? (reply to 98394)

H: yes i use test net (reply to 98395)

Catid: How to get faucer / ton in test net brother

H: https://t.me/testgiver_ton_bot (reply to 98397)

Catid: Thank you

User<7453272423>: What diferent between func and tact. Can we use both for deploy token?.

Adam: Yeah they can be both used (reply to 98401)

User<7453272423>: Which better? (reply to 98402)

Adam: The one you used too

Adam: Func can be easier if you used to js

thebatclaudio: Hey! I created a TON Dapp Vue Template to create Telegram Mini Apps, if you want you can use the code or contribute on github: https://github.com/thebatclaudio/ton-dapp-vue-template

User<7453272423>: Good sir, but you know how we can throw parameter to twa?. (reply to 98409)

User<7453272423>: Like this twa h ttps: // t.me*dogshouse_bot/join?startapp=Kxrunx9_ScSgj56cDP6hvQ  How I can catch parameter "startapp" in twa?

— 2024-08-26 —

who's this ?🩰: Sup, everyone, I'm a dev and I happy to receive your offers in my dms

wahyu: can i upgrade the wallet contract version?, from V3R1 to V5?. (reply to 98320)

midcurve: Does anyone know if theres a good dashboard that tracks TON unstaking ?

the_renovatio: good morning, what could it be that a transaction is not send to the blockchain even all internal messages are send without error? the status of the raw_send_message(pytoniq) is 1

midcurve: Is there an API call I can make for example to check the amount of TON that is pending to be withdrawn?

DevExpert: Hello everyone. I am building an app using Ston.Fi SDK. I got an error:  "node_modules\@ton\core\dist\boc\BitBuilder.js:64             src.copy(this._buffer, this._length / 8);                 ^ TypeError: src.copy is not a function" Does anyone know how to fix this error? Please let me know it. Thanks in advance

TKAINU: Hello, I want the user to call contract A to transfer jettons from contract B to A. Is this correct? Thank you very much.

TKAINU: I want to create a smartcontract for deposit jetton token, withdraw jetton token, simply the user calls deposit, will transfer jetton from jetton wallet to contract, and withdraw will transfer jetton from contract to user wallet, if send_jetton doesn't work, is there any way or function to use? Thank you very much

Paul: Hi all, how can i generate a address token as NOTT , EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT.

&rey: Contract A cannot pull jettons from any other one. (reply to 98445)

&rey: To check what, sorry? Are you referring to scam of kind "you can get ??? tokens"? (reply to 98429)

Ankit j: I get error on local environment as given in image, can anyone pls help ?

Ankit j: This error I get when I navigate to other tabs on my app in local..

TKAINU: As you said, when I want to transfer jetton from contract jetton B to contract deposit A, I will call jetton send from contract B and not through contract A, do I understand that right? (reply to 98459)

Louis X: I want to ask if there is a way to connect to the BSC system

Thanh: @devs does anyone have any solution for this case? 😅😅 (reply to 98270)

Serg: Me also, BSC to TON, roughly 30hrs now and not a single oracle confirmation (reply to 98161)

thebatclaudio: you need to get parameters from querystring (reply to 98416)

yash: looking for someone who can write smart contracts on funcc, please dm, it's a paid gig

User<7453272423>: I hope there a tools converter for solidity to func 😂

Amanda: I will write contracts using Tact. (reply to 98484)

Sen: Hi, is there any testnet facuet? We want to run a testnet nominator pool before running a mainnet pool.

Khing: Ok (reply to 98492)

Aaron Fowler 🦴: hy guys, what module i used to try to connect wallet with pytonconnect with wallet from my own phrase?

Tanya: Hello,can we chat now? (reply to 98421)

Alex 🦉: Hello, how can i send USDT? I receive contract call error:       const forwardPayload = beginCell()     .storeUint(0, 32)     .storeStringTail(description)     .endCell();      const recipientWalletAddressParsed = Address.parse(recipientWalletAddress);     if(process.env.NEXT_PUBLIC_USDT_JETTON_ADDRESS === undefined) { return;}     const usdtJettonAddress = Address.parse(process.env.NEXT_PUBLIC_USDT_JETTON_ADDRESS);     console.log(usdtJettonAddress)     const body = beginCell()     .storeUint(0xf8a7ea5, 32)     .storeUint(0, 64)      .storeCoins(toNano(amount))      .storeAddress(recipientWalletAddressParsed)      .storeAddress(recipientWalletAddressParsed)     .storeBit(0)      .storeCoins(toNano(0.02))     .storeBit(1)      .storeRef(forwardPayload)      .endCell();          const myTransaction = {       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [           {               address: usdtJettonAddress.toString(),                amount: toNano(0.1).toString(),                payload: body.toBoc().toString("base64")            }       ]     };

Mr.K: hi, how can i get the txn hash from BOC string with @ton/core ?

Mr.K: any help ?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 52 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 30  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Chi: There's a Telegram bot called "Testgiver TON Bot" (reply to 98492)

Sagara: Can someone please point me a document on how to Prune a Ton Full node? Is it possible?

Sen: Thanks! I just checked it. However It seems 5 TON once which appears not enough for a validator node. (reply to 98522)

Kratoste: I am interested in you. DM me (reply to 97818)

User<7453272423>: Hello, I wanna ask about telegram mini apps. How it can get my detail account like username. Thank you

Faithful1ofall: Please I know this is kinda off topic but I'm stuck with congestion in transactions from exchange so who will like to do OTC with me USDT for TON

Danial N: I am using the wallet wallet_highload_v2 and processing transactions for an exchange. Out of every 10 transactions, almost half fail to send and result in a "Failed" status. Additionally, a 404 page is displayed on Tonviewer.  What could be the issue?  @pcrafter

Nerses: How can I pass a signature as an argument to a function in a TON blockchain smart contract and verify it within the function to conditionally allow certain operations based on the validity of the signature?

Nikita: Hi everyone, did some use this plugin for blueprint?  https://github.com/1IxI1/blueprint-scaffold  I get next errors in console after build and run, perhaps someone faced with same issue

Diosnel: greetings to all  I have mytonwallet I am sending ton to an address in "EQ..." format but the address is not active  That is the error message that the wallet shows me  What solution do you recommend? Thank you

Nerses: does signing of message depend on wallet version ?

Ali: 👀👀👀👀  Ton network

sheh: i have a BOC, it is response of transaction, i would like to get transaction hash from this BOC, i using this example of code:   node import TonWeb from "tonweb";  const msg = {   boc: "te6cckEBAgEAhwABnLHqLd415H7Msn5DhBayDlj1pt1W8IbSCnx6BdoSqU83A6455TQgy9Bqz1ysJ06DVMtQuwlndeFFi0qSXHyCngApqaMXZsx4MQAAACoAAwEAaEIAQL76ZvSNJtrk2OSaW4SP2kcbUorOKQGax8kqu1JoOFGgL68IAAAAAAAAAAAAAAAAAABfZTq6" };          const msgBody = TonWeb.utils.base64ToBytes(msg.boc); const cell = TonWeb.boc.Cell.oneFromBoc(msgBody);  const slice = cell.beginParse();  async function getTransactionHash() {     const hash = await cell.hash();     console.log('Transaction Hash:', TonWeb.utils.bytesToHex(hash)); }  getTransactionHash();  it returns - 78fd462ae4c1217a9b8bfcd5dc140859df3c681d8c095cc5cfc9f9892e0ebb19   but i can't find it on testnet.toncenter.com, whats wrong?

0xtitn: is there any dex source using tact?

sheh: Is there a way to get exactly the hash I need? Or do I need to additionally check the address for transactions? (reply to 98561)

Nerses: is there any example of differnces with code ? as term message format in this context is high level,i need sometyhing more detailed (reply to 98557)

Ƥυrу: can anyone please help me how to send tons using python

Lilkon: Where do I start from?

User<6753518952>: is there anyone looking for blockchain developer?

Lilkon: I'll here to makes money

User<6753518952>: what's your job? (reply to 98572)

Nerses: thnx a lot (reply to 98570)

Lilkon: Still a student (reply to 98573)

User<6753518952>: oh I see

User<6753518952>: I have a good idea

User<6753518952>: I need investor for my idea

User<6753518952>: Is there anyone help me?

Nerses: is there any code snippet what lib to use or how to sign message off chain ?

Andrew: How to send nft to another address? Does anybody knows? (reply to 98520)

Thanh: It been a day, seems like this is a new case, or nobody in this situation? Last try last call 🥲🥲 (reply to 98270)

XMR: Hey guys, is there a specific TonConnect group somewhere?   I‘m facing an issue where the modal is not closing after the transaction is being processed and i can‘t find out why.

Adam: What are you using (reply to 98598)

Adam: Use the UI model it’s more complete

XMR: Using that. Should close with tonConnectUI.closeModal(); but somehow it doesn‘t. (reply to 98601)

Adam: Can you show me the snnipet you use

Big Chiano: Guys, how can i get testnet usdt?

Ƥυrу: need claim code for tokenTable_bot blockchain developer dm me fast

XMR: I sent you a DM (reply to 98603)

Glenn: Hello, I have sent an ammount of TON to an address and it appears as confirmed in my address info on Tonscan, but when I look at the receiver address info its status appears as failed. What can I do? Those TON are not in my wallet now

David: Hi guys! Need some help! There is some way to call contract get  method from fontend?  Thank you for help!

Chi: What is your address? (reply to 98609)

Glenn: I'll send you a PM (reply to 98619)

User<5118440784>: hi , i have my ton wallet private key but i dont know how should i restore that

ㅤㅤㅤ ㅤㅤㅤmamad: Beware of fraudsters who ask you for money

ㅤㅤㅤ ㅤㅤㅤmamad: Did you guys pick up🐶 TokenDogs which is a subset of your big 🤑ton ecosystem?

Ƥυrу: whats your problem ? 😂 (reply to 98634)

TON Bounty Bridge: ​Actions & Blinks SDK for Wallet extension and Telegram Bot  🏷 Developer Tool  Summary:SDK aims to create a comprehensive set of APIs and tools that integrate TON blockchain transactions ...  Rewards: • 3500 USD in TON  Created by kayx86

w: Why does the contract suspend the processing of pending messages when there is a large number of internal messages

Suhara: Hello guys, let me ask a little bit, can I do transaction like transfer token, nft using toncenter api? Thanks everyone

User<7207320521>: Hi

ㅤㅤㅤ ㅤㅤㅤmamad: Yes, you can use the Toncenter API to perform transactions such as transferring tokens and NFTs. The API provides various endpoints that allow you to interact with the TON blockchain, including sending tokens and managing NFTs. You'll need to review the specific API documentation for details on how to make these transactions, including any required parameters and authentication methods. If you have any further questions or need assistance with specific examples feel free to ask! (reply to 98645)

ㅤㅤㅤ ㅤㅤㅤmamad: The contract suspends the processing of pending messages when there is a large number of internal messages to prevent system overload and ensure stability. By pausing message processing, the system can manage resources more effectively, avoid potential bottlenecks, and maintain a smooth operation. This approach also helps to ensure that messages are processed in a reliable manner without losing important data or causing delays in critical functions. (reply to 98639)

0xtitn: hi guys. who knows tact dex?

Suhara: Hi i need use endpoint sendBoc , right? (reply to 98649)

Suhara: I can't find examples of endpoints, where can I find them? 🥲

ㅤㅤㅤ ㅤㅤㅤmamad: Yes, if you need to send a BOC (Binary Obfuscation Code) message, you would typically use the sendBoc endpoint. Make sure to check the documentation for the specific API or service you are using to confirm the endpoint's exact usage, parameters required, and any necessary authentication or headers. (reply to 98651)

w: Where is the specific code for this mechanism (reply to 98649)

Suhara: if i want to send ton or other jetton which endpoint i need to use? do you have demo of it? Thank you (reply to 98654)

ㅤㅤㅤ ㅤㅤㅤmamad: As for the specific code for this mechanism, it would typically be found in the contract's source code or the implementation of the messaging architecture. You would need to refer to the specific blockchain or smart contract documentation, or review the contract code on a platform like GitHub, to locate the part of the code that handles this suspension logic. If you have the actual contract in question, you may want to look for functions related to message handling or queuing. (reply to 98655)

ㅤㅤㅤ ㅤㅤㅤmamad: To send TON (The Open Network) or other jettons (tokens on the TON blockchain), you would typically interact with the TON APIs. Below are the general steps and an example of how to send TON or jettons:  ### Step 1: Connect to the TON Network You would need to connect to a node of the TON blockchain. This can be done through a public TON RPC endpoint or by running your own node.  ### Step 2: Prepare the Transaction You'll need to prepare the transaction details such as: - Sender's wallet address - Recipient's wallet address - Amount to send - Optional: Message or other transaction parameters  ### Step 3: Sign the Transaction You need to sign the transaction using the private key of the sender’s wallet.  ### Step 4: Send the Transaction Submit the signed transaction to the network using a specific endpoint.  ### Example using a hypothetical API endpoint  Here's a pseudo-code example to demonstrate the process:  import requests import json  # Defining constants rpc_endpoint = "https://tonapi.io/v1/transfer"  # Example endpoint api_key = "YOUR_API_KEY"  # Replace with your API key  # Transaction details transaction = {     "to": "RECIPIENT_ADDRESS",     "amount": "10",  # Amount to send in TON     "jetton": "JETTON_CONTRACT_ADDRESS",  # If sending a jetton }  # Headers including authentication headers = {     "Content-Type": "application/json",     "Authorization": f"Bearer {api_key}", }  # Sending the transaction response = requests.post(rpc_endpoint, headers=headers, json=transaction)  # Print the response print(response.json())   ### Note: - Replace YOUR_API_KEY, RECIPIENT_ADDRESS, and JETTON_CONTRACT_ADDRESS with actual values. - Ensure that the API endpoint is valid and supports the actions you want to perform. - You might need additional libraries or setup depending on your development environment.  ### Additional Resources For detailed documentation, you would usually check the official TON API documentation or the documentation of the library you are using. If you need more specific demos or examples, please specify the platform or library you're using, and I can help with more targeted information. (reply to 98656)

w: 0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f

w: The contract was suspended for a few hours (reply to 98660)

Suhara: no have endpoint v1 (reply to 98659)

w: Now there seems to be a pause (reply to 98657)

w: 0:306cf19a0860b02ecb4079142f34c59a602dabfbcdee122ea31917152314bcb1   The same thing happened with this contract (reply to 98657)

ㅤㅤㅤ ㅤㅤㅤmamad: Yes, I checked that the servers are busy  Please be patient for the payments to be processed. We sincerely appreciate your patience (reply to 98661)

So Serious: https://t.me/blum/app?startapp=tribe_dogs_community-ref_H7VmtHE1tq  Hey there! 🌟 Join DOGS Community, challenge other tribes, and earn epic rewards! 🎉🔥

ㅤㅤㅤ ㅤㅤㅤmamad: You will find the endpoints! (reply to 98662)

w: I think the situation should not arise in any mature public chain (reply to 98665)

ㅤㅤㅤ ㅤㅤㅤmamad: You're right that in a mature public blockchain ecosystem, sending tokens, including native cryptocurrencies like TON or jettons, should be a well-defined and straightforward process. Mature public blockchains typically provide:  1. Well-documented APIs: Clear and comprehensive documentation that makes it easy for developers to understand how to interact with the blockchain.  2. Standardized Protocols: The protocols for token transfers, smart contracts, and other operations are standardized, making it easier for wallets, exchanges, and applications to implement them.  3. Robust Developer Tools: Libraries and SDKs that simplify interactions with the blockchain, enabling developers to focus on building applications rather than dealing with complex low-level details.  4. Testing Environments: Public blockchains often provide testnets where developers can experiment without risking real assets.  5. Community Support: A strong community and ecosystem of developers that can help resolve issues, share knowledge, and contribute to improvements.  If issues arise, they may be due to factors such as network congestion, user errors, or unexpected bugs. As the blockchain ecosystem matures, the community and developers work together to address these issues, implement improvements, and provide better tools and resources for users and developers alike.  If you have specific concerns or scenarios in mind regarding the TON blockchain or any public blockchain platform, feel free to share, and I can provide more targeted insights or suggestions! (reply to 98669)

w: This is just a large number of users sending transactions on dex, and the number of users is only about a few thousand (reply to 98671)

ㅤㅤㅤ ㅤㅤㅤmamad: It sounds like you're referring to a scenario where a decentralized exchange (DEX) built on the TON blockchain experiences high transaction volumes despite a relatively small user base. This can happen for a variety of reasons, including:  1. High Activity per User: Even with a modest number of users, if each user is actively trading or sending transactions frequently, it can lead to a large total number of transactions.  2. Automated Trading Bots: Many DEXs are targeted by automated trading bots, which can generate a significant number of transactions in a short time. These bots might be programmed to execute trades based on specific strategies, increasing the overall network activity.  3. Liquidity Pool Interactions: Users might frequently add or remove liquidity from pools, perform swaps, or claim rewards, all of which generate multiple transactions.  4. Promotions or Incentives: If the DEX is running promotions or liquidity mining programs, users may be incentivized to transact more often, leading to increased transaction volume.  5. Network Effects: As more users start interacting with a DEX, even a small base of active users can lead to a cascading effect, where more transactions occur due to increased trading activity and interactions.  6. User Interface Design: A user-friendly interface that encourages frequent trading can also contribute to higher transaction volumes.  ### Managing High Transaction Volumes  If you are involved in developing or managing a DEX, you'll want to ensure that your infrastructure can handle high transaction volumes efficiently. Here are some considerations:  - Scalability: Ensure that your backend infrastructure can scale to handle bursts in transaction volume without significant delays or failures.  - User Experience: Optimize the application to provide a smooth experience and minimize transaction times.  - Monitoring and Analytics: Implement monitoring tools to keep track of transaction volumes, network performance, and user behavior. This data can help improve the platform.  - Communication with Users: Keep users informed about possible delays or issues, especially during peak times.  If you have specific questions or need advice on managing a DEX or handling transaction volumes, feel free to ask! (reply to 98672)

w: You are AI? (reply to 98673)

ㅤㅤㅤ ㅤㅤㅤmamad: No I'm human (reply to 98675)

w: So how do we know when contract overload is suspended? Can you check it from the node? (reply to 98676)

User<7207320521>: Please I don't understand this app

ㅤㅤㅤ ㅤㅤㅤmamad: Sure! To find out if a contract overload is suspended, you can check the status of the contract from a node on the TON blockchain. Typically, this involves querying the smart contract using a specific RPC call. Here’s a general approach to how you might do it:  1. Connect to a Ton Node: Make sure you're connected to a TON node (either your own or a public one).  2. Query the Contract: Use the appropriate RPC method to get the current status of the contract. This could include checking specific variables or states that indicate whether the overload is active or suspended.  3. Look for Indicators: Typically, contracts have certain state variables that can tell you if they are overloaded or suspended. You’ll want to look for flags or error states.  ### Example of How to Query a Contract  Here's a simplified pseudo-code example of how to check the contract status:  import requests  # Your node endpoint node_endpoint = "https://tonapi.io/v1/contract"  # Contract address to check contract_address = "YOUR_CONTRACT_ADDRESS"  # Making a query to get the contract's state response = requests.get(f"{node_endpoint}/{contract_address}")  # Check the response if response.status_code == 200:     contract_state = response.json()     # Assuming the contract state includes an 'overloadStatus' field     overload_status = contract_state.get('overloadStatus')     if overload_status == "suspended":         print("The contract is suspended due to overload.")     else:         print("The contract is active.") else:     print("Failed to fetch the contract status.")   ### Important Notes: - Replace YOUR_CONTRACT_ADDRESS with the actual address of the contract you want to check. - The way you query the contract will depend on the specific node implementation and the API used. - Make sure to handle errors properly in production-level code to deal with network issues or unexpected responses.  If you have access to the node's logs or additional monitoring tools, you might also check there for more detailed information on overloads. If you need further details or examples based on a specific library or framework, feel free to ask! (reply to 98677)

w: This seems to be an error. How do I query it through Lite Server (reply to 98680)

Gold: @malev , would you please tell me how can I get the current block number in the TON smart contract?

ㅤㅤㅤ ㅤㅤㅤmamad: Be patient the problem will be solved soon   The problem is global and the congestion of servers is due to people's warm welcome to Ton's network and large ecosystem (reply to 98682)

Gold: Would you please tell me how can I get the current block number in the TON smart contract? (reply to 98686)

ㅤㅤㅤ ㅤㅤㅤmamad: To get the current block number in a TON smart contract, you’ll typically use the built-in functions available in the TON smart contract development framework, such as FunC or Solidity. Here’s a general approach on how to retrieve the current block number in both FunC (the native language for TON smart contracts) and Solidity (if you are using the TON-compatible version).  ### 1. Using FunC  In FunC, you can access the current block number through the now global variable, which returns the current time in nanoseconds, and then use the internal methods to derive the block information.  Here’s a basic example:  main() {     // Get the current block number     block_number := slice2int64(get_block_number());          // Continue with your logic     // ... }    ### 2. Using Solidity  If you’re working with Solidity (which can also be used for TON-compatible contracts), you can use the block.number property, which contains the current block number. However, as of my last knowledge update, Solidity isn't natively supported on TON, so you would typically use a compatible framework.  Here’s an example in Ethereum-style Solidity:  pragma solidity ^0.8.0;  contract MyContract {          function getCurrentBlockNumber() public view returns (uint256) {         // Simple method to get the current block number         return block.number;     } }   ### Deploying and Testing  After you write your smart contract, you can deploy it on the TON blockchain. Once deployed, you can call the method to retrieve the current block number.  ### Accessing from a Node or Client  If you want to get the current block number from outside the smart contract (say from a client application or a script), you would typically query the node using an RPC call. You'd use an endpoint to get the blockchain state, and request the latest block number.  ### Example RPC Call to Get Block Number  Here’s a pseudo-example of how to do it:  import requests  # Your node endpoint node_endpoint = "https://tonapi.io/v1/getblock"  # Making a query to get the current block response = requests.get(node_endpoint)  # Check the response if response.status_code == 200:     block_data = response.json()     current_block_number = block_data.get('block_id')     print(f"The current block number is: {current_block_number}") else:     print("Failed to fetch the current block number.")   In this case, you would replace node_endpoint with the actual endpoint of your Ton node.  Feel free to reach out if you need additional information or examples! (reply to 98687)

Gold: Would you please tell me how can I convert the Ethereum solidity smart contract to TON contract?

Gold: I'm a beginner in the TON blockchain

Gold: I'm familiar to build the smart contract with Solidity

Nerses: I'm working on a smart contract that involves verifying a signed message on-chain. The contract receives a message with several fields, including signature, data, and a few others. The contract first checks the validity of the signature before proceeding with any further logic.  I've implemented the off-chain message signing using ton-crypto and passed the signed message to the contract, but the signature verification fails on-chain. I'm not sure if I'm missing something in the signing process or if there's an issue with how the contract verifies the signature.  Could someone help me figure out what might be going wrong? I've provided the relevant parts of the code in this GitHub Gist. Any insights would be greatly appreciated!

Sammy: We're revamping our Tap2Earn game and need developers to transition from PHP to a new coding language.   Work with our Figma designs to enhance performance and smoothness: @TapMBoys_Bot  Requirements:  Proficient in Nodejs, func, typescript, python  Game development experience  Strong problem-solving skills  Help us bring our project to the next level! It's PAID!

Nerses: What is the analog of storeStringRefTail in C# ton sdk ?

S: Where can I read about application rules? As I understand it, the point is that there are several platforms within the tone that provide access to applications. They obviously have to have rules right?

Vanya: Hey everyone! Is it possible to implement group minting? (like on ETH) And if yes, is there any examples? Thanks 🙏🏻

Big Chiano: Guys, does reentrancy attack exists on ton func contracts?

Gold: Would you please tell me where I can find the block number of transaction? (reply to 98707)

Gold: I meant how I can find the block number in the TON chain (reply to 98724)

&rey: Reentrancy exactly – no (since there are no sync cross-contract calls), but one can make a mistake with when to deduct user's balance or so – EVM's reentrancy pretty much maps to this. (reply to 98715)

Big Chiano: oh, nice. thanks  one more question please  how do you guys debug on TON? for me it's so difficult to understand the error codes etc from the tonviewer (reply to 98737)

cubby: Hello. Is anyone looking for a blockchain engineer?

Gulolio: Hi there guys, one question here. In ADNL protocol, two of the fields of adnl.packetContents TL-object are rand1 and rand2. Both of these fields are supposed to be random bytes buffers. Looking at the implementation of AdnlPacket::initRandom(), I noticed that could be of size *7* or size *15*. I want to understand what is the rational behind it, I mean: 1. Why we need to pass 2 random bytes? 2. Why the size needs to be 7 or 15?  If anyone knows, would be helpful.

H: hi , can i store dictionary in save_data??

Dmitriy: yes, you can   note that it can be stored as a reference to cell (reply to 98746)

H: is it true? (reply to 98747)

Амир: yes, it will be stored as Maybe Cell as I know (reply to 98748)

H: but in the wrapper and deploy script i cant initialize it , keep get exit code 7 i try over 40 time different ways but I'm getting lost my mind (reply to 98749)

H: wrapper

H: deploy script (reply to 98749)

mx: Does anyone know if there is an explorer for TON with these interaction functions?

mx: Where can I find open-source code on interactions with smart contracts using JS TonWeb?

H: if i want to use cell_hash as a key in dictionary of funC , to initializing save_data with empty dictionary should i use Buffer ??

&rey: Normally, such code is written in @ton/ton and comes within contract's Git repository. (reply to 98755)

H: this is wrapper to store empty dict , but i get exit code 7. what did i wrong??

User<5160722955>: i want to send usdt using python can somebody give me example code ?

Arena: Pls tell me too if you find any method (reply to 98771)

Ƥυrу: need example code for transfer jetton

Alexander: Hello guys! Maybe someone knows how the Total fee is calculated? I mean when I sum Fwd. fee, Gas fee, Storage fee, Action fee it does not equals the Total fee value. There is always  about 300000 nanotons that tonviewer does not display

Gabriel: hi, anyone knows more about parsing jetton metadata and can give some pointers on this? https://answers.ton.org/question/1739058912897798144/how-to-read-jetton-metadata-using-tonclient4

Gabriel: I see I have to wait for the post to be approved so I'll follow up after that as the question is not visible yet

Gabriel: the gist of it is that I'm following the documentation and trying to use ParseChunkDict() to parse the jettonData.content Cell but the result is always empty https://docs.ton.org/develop/dapps/asset-processing/metadata#chunked-encoding

Gabriel: thank you, I'll try to understand that (reply to 98787)

— 2024-08-27 —

ㅤㅤㅤ ㅤㅤㅤmamad: ⚠️ Warning, do not start this robot, it is a scam and will empty your wallet. This robot directs you to a mini-app similar to Dogs and asks you to connect your wallet to it. By connecting Volt, a fraudulent transaction of approximately 1 million Dogs appears in the transaction history. This transaction is not real and has no value. The goal is to empty your wallet. Also, entering any type of NFT into Volt that promises you Doggs and Natcoin tokens is a fraud..!

Rich: why does it cost so much to do a tx ;-; i dont have enough ton in my wallet to do one and i cant withdraw from a cex

Rich: how can i get like 0.05 ton

Jacob: Hello, everyone. Nice to meet you.I'm a full stack blockchain developer. If you have some problems or want me, contact me anytime.Thx.

william: anyone need dev

Vincent: Anyone knows what is the exit code of 47 in jetton-wallet means?  https://tonviewer.com/transaction/796f62c7269a8e808102d33546067e01fb969e48d8b55f582e543be299273a05

Thanh: Can we import a wallet contract to use as normal wallet, in my case I want to import contract to TonKeeper?  I used 24 phase nmemonic create keyPair and deployed walletV5 (source: https://github.com/tonkeeper/w5) to testnet, it has fund and the status already Active. Now i want to import this contract to TonKeeper, but when I input nmemonic phase above to TonKeeper testnet, I can’t find my contract, it just show 2 wallet v3r2 and v5r1. I don't know that it is because TonKeeper is not working properly or we cannot import contract like that? From my understanding it should work thanks to the subwallet mechanism (reply to 98785)

SH: hello In Jetton transfer, how does recipient assume if correct value has given with internal_transfer?

SH: but sending notification is happening after saving data isnt it? (reply to 98843)

SH: uhhh I'm just curious while reading jetton contract.  i understand sender calls send_tokens(), which calls receive_tokens() on destination contract  but what if malicious user tries to call receive_tokens function outside contract?  does this method protect from it? calculate_user_jetton_wallet_address

TKAINU: As I understand, when transferring jetton, it actually means calling your own smart contract jetton wallet, transferring to another smart contract jetton wallet, right? So, can we go through an intermediary contract to send a message to our contract jetton wallet requesting transfer? ? Thanks

TKAINU: So for smart contracts like swap and staking, how do users deposit jetton into the contract? Like ethereum, users will call transfer tokens through contract swap and deposit. (reply to 98853)

TKAINU: I have a smart contract jetton A, how can A know when the user transfers jetton token to jetton wallet A (pool jetton wallet) so that A mints the user LP token as collateral? (reply to 98857)

Chi: when user transferer jettons into pool jetton wallet, it will send TRANSFER_NOTIFICATION msg to your pool contract, then you can mints the LP token (reply to 98858)

Dannel: do you have example on tact program ? (reply to 98864)

N ARI AVKAN: DM, i am a func/ts dev (reply to 97711)

Chi: I don't have tact code example, but this is a example transaction of STON.fi: https://tonviewer.com/transaction/51a260e19eb0111e69c51e013037362704fde622a836692ffccd6b2d5aa6200c (reply to 98865)

Chi: you can see user A transfered REDO jetton into STON.fi contract (D), then D swaps TON and send it back to A

TON Bounty Bridge: ​add-on: IMG converter and NFC minter  🏷 Developer Tool  Summary:аддон для программ и приложений кошелька, с возможностью конвертирования изображения в код настолько...  Created by u1tran

Dannel: Yes, i clearly this, but i get bug when implement on tact (reply to 98868)

Chi: I implemented a simple swap in FunC and it works fine, the LP contract just handle the Jetton TRANSFER_NOTIFICATION msg from its jetton wallet

User<6753518952>: Is there anyone looking for dev?

Chi: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     if (in_msg_body.slice_empty?()) { ;; ignore empty messages         return ();     }      var cs = in_msg_full.begin_parse();     var flags = cs~load_uint(4);          if (flags & 1) { ;; ignore bounced messages         return ();     }          slice sender_address = cs~load_msg_addr();     cs~load_msg_addr(); ;; skip dst     cs~load_coins(); ;; skip value     cs~skip_bits(1); ;; skip extracurrency collection     cs~load_coins(); ;; skip ihr_fee     int fwd_fee = cs~load_coins();      load_data();      (int op, int query_id) = (in_msg_body~load_uint(32), in_msg_body~load_uint(64));       ;; Swap Jetton -> Toncoin   OR   Add liquidity     ;; the message routes are:      ;;      user X's TonKeeper wallet -> X's Jetton wallet (Transfer)      ;;      X's Jetton wallet -> WOOFi_TON's Jetton wallet (Internal Transfer)     ;;      WOOFi_TON's Jetton wallet -> this contract (Transfer notification)     if (op == OP_TRANSFER_NOTIFICATION) {         int jetton_amount = in_msg_body~load_coins();         slice jetton_sender = in_msg_body~load_msg_addr();          cell ref_cs = in_msg_body~load_ref();          slice ref_ds = ref_cs.begin_parse();         int sub_op = ref_ds~load_uint(32);          if (sub_op == OP_SWAP_TOKEN) {             throw_if(ERROR::STALE_PRICE, store::price == 0);             int ton_amount = get_swap_ton_amount(jetton_amount, store::price);              ;; Insufficient amount of ton, sending back the tokens             if (ton_amount > store::ton_reserves) {                 transfer_token(query_id, jetton_sender, jetton_amount, msg_value);                 return ();             }              store::token_reserves += jetton_amount;             store::ton_reserves -= ton_amount;              ;; remaining gas to tranfer the ton             int transfer_ton_gas = msg_value - WOOFI_GAS_CONSUMPTION;             throw_unless(ERROR::SWAP_TON_NO_GAS, transfer_ton_gas > fwd_fee);             transfer_toncoin(jetton_sender, transfer_ton_gas + ton_amount);              save_data();             return ();         }     }

Dannel: Can you convert to tact program ? (reply to 98874)

Chi: I don't know tact, maybe you can use ChatGPT to convert it?

Dannel: Thank you (reply to 98876)

TOP: /me

skytner: Hi everyone, can anyone share a working code for sending token transactions to @ton/ton?  I got to the client.sendFile stage, but I encounter error 0, although with a slight movement of my hands I can turn it into error 36 (exit_code), I don’t understand at all what’s going on, I’ve dug through the documentation several times, but I’m still confused, because the docs are a jumble of @ton/ton, @ton/core and tonCoonect  Here is the error itself LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction A77163E397E34F215029F911F1A21D2158E409724064DE9591A24844B7AC1AEF: exitcode=0, steps=0, gas_used=0   And here is the general code try {         const { contract, keyPair, address, wallet, neededInit, client }             = await getWalletContract(mnemonic)         await validateAddresses(recipientAddress, tokenAddress, address)          await wait(2000)          const jettonWalletAddress = await getJettonWalletAddress(address, tokenAddress)          await wait(2000)          const messageBodyParams = { recipientAddress, tokenAmount, jettonWalletAddress }         const messageBody = await createMessageBodyFn(messageBodyParams)          await wait(2000)          const internalMessageParams = { jettonWalletAddress, tokenAmount, messageBody }         const internalMessage = createInternalMessage(internalMessageParams)                 // start of unused code         const internalMessageCell = beginCell()             .store(storeMessageRelaxed(internalMessage))             .endCell();        // end of unused code           const seqno = await contract.getSeqno()         const secretKey = keyPair.secretKey          const transferParams = { wallet, seqno, internalMessage, secretKey }         const transfer = createTransfer(transferParams)          const externalMessageParams = { recipientAddress, neededInit, transfer }         const externalMessage = createExternalMessage(externalMessageParams)         const externalMessageCell = createExternalMessageCell(externalMessage)          await wait(2000)         const sendedTransfer = await sendTransfer(externalMessageCell, client)

Buggy: Hi everyone, i need help with how user deposit TON token to my protocol. For Jetton, we can use transfer notification, but how for TON transfer in?

Buggy: doing this is enough to ensure it's TON coins depositing? ref: https://github.com/toncenter/examples/blob/main/deposits.js

Thanh: Is this setting “Active address” in TonKeeper? My step: 1. Open Dev mode in TonKeeper 2. Back to home -> Select wallet -> Add wallet -> Select Testnet Account 3. Input nmemonic. This is what I got: There is no wallet v5 and it’s address here. (reply to 98842)

Thanh: How to check If a contract is deployed correctly, this is my v5 contract’s address. https://testnet.tonviewer.com/kQB93rQqnUgJrf9SyP6__zxaLCWGaPD7fMicp8-AJr9LTvMy?section=code (reply to 98842)

Thanh: Yeah, I've seen that already lol, but it good to confirm that we can import contract and use in wallet apps, althought not for today 😆😆 Thank you so much for your time 🥰🥰🥰

『🔎𝐓𝐆🔍』 买卖『🔎𝐓𝐆🔍』: What it problem

final: receive_internal (reply to 98885)

Buggy: that's the contract level right, i mean how can i know off-chain if tx I got is the TON tranfer only. Is a provided picture correct enough?

TKAINU: Hello, As I understand it, when the contract address receives any jetton, it will receive a message: op::transfer_notification() containing the sender address (jetton wallet address). So how do we know what type of jetton this address contains?

Chi: Good question, actually I was wondering as well, like I want to differentiate if it is an USDT or NOTcoin

Dmitry | backend4you.ton: this notification comes from your jetton wallet. you should "know"(store) your jetton wallet address (because anybody can send you fake notification), and if you need to know something more - store this data too (reply to 98904)

TKAINU: Yes, I mean, how can I distinguish between the real address of the jetton I want and the fake one? (reply to 98908)

Dmitry | backend4you.ton: store real ones in your contract (reply to 98909)

Nobody: You can either store the real one or call the get_wallet_address method from your desired jetton master (the input is your wallet address) to get the real jetton address (reply to 98909)

Dmitry | backend4you.ton: he can't call get-method of other contract in his contract (reply to 98911)

▪️ 🍅 TOMATO 📦 Bums 🐾: How can i open ton wallet?

H: What is the problem in initializing storedict ?? (reply to 98763)

Nobody: Well store the real one he goes

TKAINU: My problem is that I want to determine which jetton master the message sent comes from. If it matches the requested jetton master, I will perform the next logic (reply to 98916)

Over: When I deploy the contract, I get an ‘Invalid address’ error. Does anyone know the reason? This is my code.

Fong 🇻🇳: Hi everyone, I'm deploying a TON full node with Docker, but I'm facing this issue. I also tried referencing the troubleshooting guide here  https://github.com/ton-blockchain/ton/tree/master/docker#troubleshooting  but it wasn't successful. If anyone has fixed it, please help me with a solution. 🙏 my docker-compose file:  services: ton-node:    image: ghcr.io/ton-blockchain/ton:v2024.08     ports:   - 43678:43678/tcp   - 43678:43678   - 43679:43679/tcp   - 43679:$43679   - 43677:43677/udp   - 43677:43677 volumes:   - /mnt/data/db:/var/ton-work/db environment:   GLOBAL_CONFIG_URL: https://ton.org/global-config.json   PUBLIC_IP: MY_PUBLIC_IP   CONSOLE_PORT: 43678   DUMP_URL: https://dump.ton.org/dumps/latest.tar.lz   STATE_TTL: 315360000   ARCHIVE_TTL: 315360000   THREADS: 14   VERBOSITY: 3    LITESERVER: true   LITE_PORT: 43679   VALIDATOR_PORT: 43677

TKAINU: try: Address.parse(“”) (reply to 98920)

Dmitry | backend4you.ton: you should store dict jetton_wallet -> jetton_master with all jettons you want to accept. (reply to 98919)

Over: yeah,it works now,thank you (reply to 98922)

Over: do you know what the difference between ton-core and ton/core

Chi: Do you have a sample code implemented this dict? (reply to 98924)

Over: it seems that address() in ton-core and Address.parse() in @ton/core

Dmitry | backend4you.ton: not for this particular one (reply to 98927)

TKAINU: I have stored the real jetton master, now what I want is how to know which jetton master the message is sent from, because there are a lot of transfer jetton messages sent, I want to filter the messages sent from the real jetton, for example the following code (reply to 98924)

Dmitry | backend4you.ton: replace jetton master with jetton wallet (one that corresponds to YOUR jetton wallet for this master), and compare sender (reply to 98931)

TKAINU: The case I want is to identify all senders, not just a few fixed ones (reply to 98932)

Dmitry | backend4you.ton: sender of notification is not real user, but your jetton wallet - only one for this jetton for all users

&rey: Former is deprecated and must not be used. (reply to 98926)

TKAINU: I have tried and different sender (reply to 98934)

Joan: You can use GetBlock TON RPC provider and in case you need additional requests to test it, you can reach out, we’ll add them manually (reply to 95556)

Falcon | KMC | Mine AI: Hi Guys. I am New Here. I am looking for someone who can assist us in creating TON Mini games or use them for our new token project. If someone interested here please let me know

Dmitry | backend4you.ton: sender in body is user. sender of message itself is jetton wallet, check TEP 74 (reply to 98943)

Ƥυrу: can anybody help me with sending ton to another wallet ? i create transfer and send it to blockchain but sometimes its disappear. it doesn't create final transaction

Aleks: Thanks! I'll try it out (reply to 95556)

TKAINU: I understand, thank you (reply to 98948)

Nerses: can anyone provide materials where I can see implemenataion of check_signature and check_data_signature ?

TKAINU: I created a new smart contract, added a message transfer_notifications listener in recv_internal, but when I send a jetton from Tonkeeper to this contract, the data is not updated, please help me. (reply to 98948)

Chi: did you set forward_ton_amount > 0 when sending Jettons?

TKAINU: I use Ton keeper, maybe forward_ton_amount default = 0, let me try again (reply to 98963)

Chi: Jetton wallet will only send transfer_notification when forward_ton_amount > 0: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L127

Dannel: how to send forwardPayload with address on ton ?

Nerses: i tried to sign and verify message off chain using ton-crypto but if fails. Can anyone give a hint wha is wrong with this code ? const hashlock = BigInt("86063709575516430416322238016776016577783477821483564045133774829893108097467"); const timelock = BigInt(Math.floor(Date.now() / 1000) + 3600);    const dataCell: Cell = beginCell()       .storeInt(hashlock, 257)       .storeInt(timelock, 255)       .endCell();  const hashlockBuffer = Buffer.from(hashlock.toString(16), 'hex');  const timelockBuffer = Buffer.from(timelock.toString(16), 'hex');  const combinedBuffer = Buffer.concat([hashlockBuffer, timelockBuffer]);  const signatureBuffer = sign(dataCell.hash(), key.secretKey);  console.log(signVerify(combinedBuffer,signatureBuffer,key.publicKey));

Nerses: thanks a lot.It was the problem,now solved (reply to 98970)

Nerses: this on chain verification is likely to fail ? message LockCommitmentSig{     data: LockCommitmentSigData; }  struct LockCommitmentSigData{     commitId: Int;     data: Slice;      signature: Slice;     publicKey: Int; }  checkDataSignature(msg.data.data,msg.data.signature,msg.data.publicKey) as first input parametrs should be hashed ? (reply to 98969)

Nerses: I meant returning true of checkDataSignature (reply to 98975)

Nerses: i tried to create signiture off cahin and send it via messages and verify it on chain. I sign message with previous code snippet (reply to 98980)

Nerses: got it. I will change the code and test (reply to 98985)

Maksim: Hello! Could you please help me in finding an answer? =) I just tried to find any info about the order of internal messages processing.  For example, my external message to highload wallet is first in a block (after shuffling and etc.). Does it mean, that internal message from highload wallet to jetton wallet processed faster than others in the block? In practice I see (in tonviewer), that order of internal message doesn't depend on order or external message.  So the question, what does the internal messages order in a block depend on?  I tried to find the answer in the blockchain code on github, but it's complicated for me. May be you can share some details. Thank you! (reply to 48600)

Ankit j: My bot response time is very slow, I deployed it on vercel, can anyone let me know is there any option on vercel to increase its response time for quicker response...?

Cat: Hello! Could you please tell me if it is possible to update the smart contract code after its deployment?

Hankson: Hi guys. I'm transferring 0.001 TON to an address, but the explorer shows the transaction as a SUSPICIOUS transaction, and the receiver doesn't receive any TON

Nerses: https://testnet.tonviewer.com/transaction/47b97c4008b9057b7a954cea131ef4feded5bc113942cc96a0bbd3291bda84ef     in this tx although I send 1 ton it fails in action phase with exit code 37(not enough TON). what can cause this,as 1 TON is pretty much I think ?

Hankson: https://tonviewer.com/UQCcKJDQ8ebu9Ml1vAjVyODLqCXU8rvRRVXl-tKOH0gtiXDX?section=transactions (reply to 98996)

Nerses: data: LockCommitmentSigData; }  struct LockCommitmentSigData{     commitId: Int;     data: Slice;      signature: Slice;     publicKey: Int; }      receive(msg: LockCommitmentSig){         require(self.commitExists(msg.data.commitId),"Commitment does not exist");         require(checkSignature(msg.data.data.hash(),msg.data.signature,msg.data.publicKey),"Invalid signature");         let hashlock: Int = msg.data.data.loadInt(257);         let timelock: Int = msg.data.data.loadInt(255);         let lockCommitmentMessage: LockCommitment = LockCommitment{             data: LockCommitmentData{                 commitId: msg.data.commitId,                 hashlock: hashlock,                 timelock: timelock             }         };         self.lockCommitment(lockCommitmentMessage,context());     }  are hashlock  and timelock loaded correctly   in receive ?

Kapil: Can anyone tell me the flow of the nft auction

Ankit j: Anyone ? (reply to 98991)

Tanya: are u developer? (reply to 99006)

Ankit j: yes, just beginning ton. (reply to 99007)

Vincent: a very common exit code is 706. just like this. https://tonviewer.com/transaction/4860f9a64a1420b188b8b3d5b8d6ad56c520d361b2a28bbdadcbcee113516a7e could anyone explain why this tx will fail with the 706 exit code?

Jacob: Hello, everyone. Nice to meet you.I'm a full stack blockchain developer. If you have some problems or want me, contact me anytime.Thx.

Abdulaziz: does this feature available in chrome extension too ? (reply to 7789)

Abdulaziz: if i click on version, it says app version copied.. (reply to 7789)

Санчо Пансо: Hello, I've a task to get user jetton address offline, I've have custom minter contract that use Dictionary, that's why I need to perform .store_dict(JETTON_WALLET_CODE) that slice in func to storeDict() in TS. Is there any way to do that? any code will return zero size map?  I tried Dictionary.empty() or  Dictionary.load() nothing helped

-𝑯𝒆𝒓𝒏𝒊: 5 Taps (reply to 99018)

Abdulaziz: I did (reply to 99024)

Abdulaziz: i think, i am able to use tonkeeper testnet in mobile, not chrome extension (reply to 99024)

-𝑯𝒆𝒓𝒏𝒊: It’s also available on the web version. Just keep clicking on logo, and you should be able to see the developer options. (reply to 99026)

Abdulaziz: oh, thx

Abdulaziz: do you know where I can get testnet coins ? (reply to 99029)

Санчо Пансо: @testgiver_ton_bot (reply to 99032)

Abdulaziz: thx (reply to 99034)

H:   const dictKey = sha256_sync("4") // console.log("hash res1",dictKey); //  const collectionContentDict =  Dictionary.empty(); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())     // .set( dictKey , beginCell().storeUint(1024, 256).endCell())   //   .set(  BigInt('0x' + dictKey.toString('hex')) , beginCell().storeUint(1024, 256).endCell())   //  collectionContentDict.set( dictKey , beginCell().storeUint(0, 256).endCell())     //    collectionContentDict.set( BigInt('0x' + sha256_sync("1").toString('hex')) , beginCell().storeUint(0, 256).endCell()) //  const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.BigUint(256));  // const collectionContentDict =  ( Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()) ;  //  const collectionContentDict =  Dictionary.empty() ;  //BigInt('0x' + sha256_sync(s).toString('hex'))  BigInt(0)  //  //   key_value_content: beginCell().endCell() //      const collectionContentDict =  Dictionary.empty<Buffer, Cell>()  let collectionContentDict =Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())  collectionContentDict.set(dictKey , beginCell().storeUint(1024, 256).endCell())    // const collectionContentDict = Dictionary.empty<Buffer, Cell>(Dictionary.Keys.Buffer(32));  export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {     return beginCell()         .storeAddress(config.ownerAddress)         .storeUint(config.nextItemIndex, 64)         .storeRef(config.collectionContent)         .storeRef(config.nftItemCode)    .storeRef(             beginCell()                 .storeUint(config.royaltyParams.royaltyFactor, 16)                 .storeUint(config.royaltyParams.royaltyBase, 16)                 .storeAddress(config.royaltyParams.royaltyAddress)                 .endCell() )                  .storeDict(collectionContentDict)                 //  .storeDict(config.key_value_content,Dictionary.Keys.BigInt(256),Dictionary.Values.Cell())                 //   .storeDict( config.key_value_content ,Dictionary.Keys.Buffer(32) ,Dictionary.Values.Cell())                //  .storeDict(config.key_value_content, Dictionary.Keys.Buffer(32) , Dictionary.Values.Cell())               //    .storeDict(Dictionary.empty<Buffer, Cell>(), Dictionary.Keys.Buffer(32) , Dictionary.Values.Cell())                 //   .storeDict(Dictionary.empty<Buffer, Cell>() )                //    .storeDict(null)                 .endCell(); //, Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell( ) Dictionary.Keys.Buffer(255), Dictionary.Values.Cell( )  storeDictDirect //.storeRef(config.key_value_content)  //.storeDict(config.key_value_content , Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell( ))         //   .storeDict(Dictionary< Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell() > )        //  //      .storeRef(config.key_value_content) beginCell().endCell()      //       }

H: how do i initialize dictionary?? (reply to 99037)

H: i keep geting exit code 7

User<6134444887>: Who's looking for a developer & designer?

Rich: WTF i just did a swap and i got no money in return!!!! it's been 2 hours

Rich: WTF WTF STON FI STOLE MY MONEY AGAIN. I JUST DID 2 TRANSACTIONS

Nerses: in my receive  when i get message I want after processing it to send back remaiined ton.Is this correct code to include in receive  ?                     send(SendParameters{to: ctx.sender,                                         bounce: true,                                         value: ctx.value,                                         mode: 64});

Nerses: In case i send message to contract I want to inbound enough ton for message processing but not more than that,is it possible or the contract should return remining amount of ton ?

🐾 Dammy: Hello, is there a way for me to get 1000 TON testnet tokens?

Abdulaziz: How to Get All Jettons Owned by an Address ?  I will need name, contract address, amount and usd value of each jetton...

&rey: Check out tonapi. (reply to 99057)

S: Is the casino placement prohibited or not? In the rules, I only heard about avoiding casino promotion.

Andrey: Hello everyone!  A question has arisen regarding the @ton/crypto library When using these two methods on React Native  const mnemonics = await mnemonicNew(24); const isValid = await mnemonicValidate(mnemonic);  Both give the error [TypeError: Cannot read property 'derive' of null]  What could be the problem? Strangely, everything works fine in React Js)

ㅤㅤㅤ ㅤㅤㅤmamad: The error you're encountering (TypeError: Cannot read property 'derive' of null) when using the @ton/crypto library in React Native can often be attributed to the differences in the JavaScript environment between React Native and web browsers. Here are a few potential issues and solutions to consider:  ### 1. Dependency Issues The @ton/crypto library might depend on certain Node.js built-in modules or browser-specific APIs that are not available in React Native. You could check if @ton/crypto has any dependencies that need to be polyfilled for the React Native environment.  ### 2. Polyfills You may need to manually polyfill certain features. For instance, React Native might be missing some of these modules:  - Install relevant polyfills. You can try using libraries like react-native-crypto:  npm install react-native-crypto   - You may need to add additional polyfills/configurations depending on which specific modules are required by @ton/crypto.  ### 3. React Native Environment Make sure your React Native environment is correctly set up. Some libraries may not work out-of-the-box without proper configuration. Double-check your Metro bundler setup or any other configuration if you are using any special setups.  ### 4. Async Issues Make sure you are handling the asynchronous calls correctly. Since you are using await, ensure that you are in an async function, and consider error handling (try-catch) around your await calls to capture any other potential issues.  ### 5. Library Version Verify the version of the @ton/crypto library you’re using. Sometimes, libraries have bugs or incompatibilities with certain environments. Check their documentation or GitHub issues to see if there are known issues related to React Native.  ### Example with Catch  Here’s a sample setup that includes error handling:  import { mnemonicNew, mnemonicValidate } from '@ton/crypto';  const generateAndValidateMnemonic = async () => {   try {     const mnemonics = await mnemonicNew(24);     console.log('Generated mnemonics:', mnemonics);      const isValid = await mnemonicValidate(mnemonics);     console.log('Are the mnemonics valid?', isValid);        } catch (error) {     console.error('Error during mnemonic generation or validation:', error);   } };  // Call the function generateAndValidateMnemonic();   ### Conclusion The exact solution may depend on the specific context of your project and which dependencies you have installed. If the problem persists, consider checking the library's GitHub repository for any open issues or reaching out to the maintainers for assistance. Additionally, you may want to explore other alternatives for mnemonic generation and validation that are known to work with React Native. (reply to 99076)

P: Hello! Can someone help I'm trying to send ton, but transaction seems not trigger jetton notify first is mine tx 34a8b9f1efe3c24e2c04c4842e47b4196eef2c5375c31d702f8cf9fa053d8cea second one is okx successful tx ce1a8d2ce7ff1b336629c23b280ef1d8d2828b26150283e1d114bae5ed48a267  my wallet UQAbO03z8Ze6U0kN_Dq1KdlVQCJNw6oGBXT9ggEHSQ3KO6ve

Andrey: Alas, none of the above helps. Buffer is installed, expo-crypto, the necessary polyphiles, none of this helps, I ran into this error and have been with it for the third day (my async function, there are also try/catch event handlers, and judging by the documentation, @ton/crypto should work in a React Native environment, but it does not It works( (reply to 99081)

Tammy 🍅 🐐 🐸: My transaction have been on pending for almost 7hours now I sent out usdt from my telegram wallet to my bybit wallet for almost 7hours now it’s still pending

Tammy 🍅 🐐 🐸: Please how can this be resolve

&rey: crypto.subtle must be accessible in context. (reply to 99076)

Gourav: Same here pending from 6ht (reply to 99090)

Tammy 🍅 🐐 🐸: Can I see send your screenshot (reply to 99095)

Gourav: What to do (reply to 99096)

Tammy 🍅 🐐 🐸: I’m confused I swear for six hours now it’s been on pending (reply to 99101)

Gourav: So what wr can do next (reply to 99102)

Gourav: ?? (reply to 99102)

Tammy 🍅 🐐 🐸: That’s why I came here to know what to do and the transaction can’t be cancelled do you have any idea what we should do (reply to 99103)

Gourav: all transactions of bybit are pending (reply to 99105)

Tammy 🍅 🐐 🐸: What can we do about this do anyone have an idea

Tammy 🍅 🐐 🐸: This should be problem or network glitch from bybit I guess 😭 (reply to 99106)

Gourav: Its bybit problem i think we need to wait more or contact bybit costumer care (reply to 99107)

Tammy 🍅 🐐 🐸: Ok let’s go to bybit then n disturb them (reply to 99109)

Gourav: 😂 ok lets go (reply to 99110)

Andrey: Could you please tell me more? What is crypto.subtle? (reply to 99092)

Dannel: how to get address from forwardPayload has store address on tact program ?

Tammy 🍅 🐐 🐸: I’m there now (reply to 99111)

Nerses: I use @ton/ton.How i can specify sending message mode here await contractProvider.send(walletSender, { value: amount,bounce: true }, lockCommitmentMessage);

Dayjo | TonTombola 🎟️: Anyone tried using the TonKeeper messages on TonConsole? I’ve set everything up but am just getting the following error when trying to send a single push message; {"error":"there are not enough funds on the balance","code”:0}. There’s 2 Ton on the account. Do I also need to be subscribed to a payment plan?

0xluck: Have done ton back-end authentication big guy, ask some questions

&rey: It is browser-provided module for doing cryptography involving secrets. Unavailable in insecure contexts like HTTP, for instance. (reply to 99112)

Andrey: Is it possible to install it in a React Native environment? Could you drop a link to this module? Please, I'm already tired of solving this problem( (reply to 99123)

TON Bounty Bridge: ​Tonutils - Python SDK for TON  🏷 Developer Tool  Summary:The TON blockchain ecosystem is rapidly expanding, but it still lacks comprehensive development tool...  Rewards: • SBT Bounty Reward • 4000 USD in TON equivalent  Created by nessshon

jaq₿ek.eth: Hey. I got game on https. When i launch it as app (botfather) it opens full screen. When its bot( not app, not game) its opening in half window mode. I got disableswipes and its not able to swipe up window to full screen. But i alsa have isExpanded(true) and got stuck. What am i doing wrong?

jaq₿ek.eth: window.onload = function () {     console.log("Script loaded and running");      var isTelegramWebApp = typeof Telegram !== 'undefined' && Telegram.WebApp;      if (isTelegramWebApp) {         console.log("Running in Telegram Web App");         window.Telegram.WebApp.disableVerticalSwipes();         window.Telegram.WebApp.isExpanded(true);         Telegram.WebApp.ready();

David: hi

David: whi know how to pass parametr to method?

User<6753518952>: Is there anyone looking for FUNC and TACT developer?

pfeffunit: hello! is anyone aware of a service on TON that offers webhooks based off TON TXs?

pfeffunit: Like Tenderly on EVM?

^_^: Hi,  I'm a TON blockchain developer,  I can develop the telegram bot, mini app game and smart contract.  If you are looking for a developer, can we work together?

Michał: /stat@combot

Falcon | KMC | Mine AI: DM Me (reply to 99142)

^_^: Messaged you. (reply to 99154)

ㅤㅤㅤ ㅤㅤㅤmamad: ⚠Also, be careful of fraudulent people, they try to ask you for money, be sure to report to the admin and block the fraudulent user.

cubby: Hello. Is anyone looking for a blockchain engineer?

Rodolfo Azevedo: Hey folks, how much time a contract takes to be deployed in TON network?

&rey: Exactly time which any other transaction takes to be arrived to its address. (reply to 99161)

H: // console.log("hash res1",dictKey); //  const collectionContentDict =  Dictionary.empty(); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())     // .set( dictKey , beginCell().storeUint(1024, 256).endCell())   //   .set(  BigInt('0x' + dictKey.toString('hex')) , beginCell().storeUint(1024, 256).endCell())   //  collectionContentDict.set( dictKey , beginCell().storeUint(0, 256).endCell())     //    collectionContentDict.set( BigInt('0x' + sha256_sync("1").toString('hex')) , beginCell().storeUint(0, 256).endCell()) //  const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.BigUint(256));  // const collectionContentDict =  ( Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()) ;  //  const collectionContentDict =  Dictionary.empty() ;  //BigInt('0x' + sha256_sync(s).toString('hex'))  BigInt(0)  //  //   key_value_content: beginCell().endCell() //      const collectionContentDict =  Dictionary.empty<Buffer, Cell>()  let collectionContentDict =Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())  collectionContentDict.set(dictKey , beginCell().storeUint(1024, 256).endCell())    // const collectionContentDict = Dictionary.empty<Buffer, Cell>(Dictionary.Keys.Buffer(32));  export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {     return beginCell()         .storeAddress(config.ownerAddress)         .storeUint(config.nextItemIndex, 64)         .storeRef(config.collectionContent)         .storeRef(config.nftItemCode)    .storeRef(             beginCell()                 .storeUint(config.royaltyParams.royaltyFactor, 16)                 .storeUint(config.royaltyParams.royaltyBase, 16)                 .storeAddress(config.royaltyParams.royaltyAddress)                 .endCell() )                  .storeDict(collectionContentDict)                 //  .storeDict(config.key_value_content,Dictionary.Keys.BigInt(256),Dictionary.Values.Cell())                 //   .storeDict( config.key_value_content ,Dictionary.Keys.Buffer(32) ,Dictionary.Values.Cell())                //  .storeDict(config.key_value_content, Dictionary.Keys.Buffer(32) , Dictionary.Values.Cell())               //    .storeDict(Dictionary.empty<Buffer, Cell>(), Dictionary.Keys.Buffer(32) , Dictionary.Values.Cell())                 //   .storeDict(Dictionary.empty<Buffer, Cell>() )                //    .storeDict(null)                 .endCell(); //, Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell( ) Dictionary.Keys.Buffer(255), Dictionary.Values.Cell( )  storeDictDirect //.storeRef(config.key_value_content)  //.storeDict(config.key_value_content , Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell( ))         //   .storeDict(Dictionary< Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell() > )        //  //      .storeRef(config.key_value_content) beginCell().endCell()      //       }

H: How do I initialize storedict?? (reply to 99174)

H: I get exit code 7

Attah 🍖 🍅 🐾🧑🏻‍💻🌱🌱SEED: How can I handle my failed transaction on ton

&rey: The main way is to send messages such that transactions in the tree cannot fail. (reply to 99180)

Attah 🍖 🍅 🐾🧑🏻‍💻🌱🌱SEED: How (reply to 99183)

Kaspars: Hmm, everything ok with TON chain? https://tonscan.org/blocks last block 14min ago?

Sarah: hmmm.. chain halt??

TON Bounty Bridge: ​Telegram Intelligence Marketplace first DeI system  🏷 Resource  Summary:Today, when it is not clear of the legislative pressure on centralized parties, to create a safe int...  Created by DunaSpice

Kaspars: Starting to see first reports on X/Twitter as well, so it is not just us and tonscan, but seems some global issue with the chain (reply to 99188)

Greg: yeah something is fucked, validator nodes are cycling

Greg: not synching... Local validator out of sync: 2426 s just grows.. tried updating to latest, doesnt help

Kaspars: same here, two full nodes stuck, one on latest version, one on previous. all public explorers stuck too, all on same block number, can't be just us. Some serious issue.

Gold: @malev would you please tell me how can I build the message body with long buffer size?

Gold: I know TON chain constraints the message body as 1023 bytes

???: Hello everyone, I need to implement a ton donation button, which is what I actually did using ton-connect-ui, but I encountered some errors, not all wallets can send transactions, for example using the main one, or the tonkeeper wallet simply cancels the transaction after its initialization, if you connect to the tonhub page, then the transaction can be completed, but everything takes a very long time.  What exactly could be the problem?  I also noticed that my site in tonhub is initialized as an extension, although in fact it should be in applications, because it does not depend on tonhub in any way

Greg: any core devs here? could help us debug this ton validator node problem?

Abuhafs: Hey guys, please I need your help, I made a mistake of sending Tron(trx) to my telegram wallet instead of USDT(Tron), and I can't find the tron(trx) in the wallet expect when I check the wallet on tron blockchain explorer.

shi: chain halt?

shi: the latest blocknumber is 39,987,353, and never increased

shi: for an hour

shi: https://tonscan.org/stats

Greg: seems that way (reply to 99205)

Vudi: Down. Chill

Greg: no offense but this is not a "chill" moment. its a critical problem on the ton network and its scary there is radio silence on this issue right now (reply to 99210)

Laisky: Its 39,987,437 now (reply to 99206)

— 2024-08-28 —

Moein: Brother falls asleep (reply to 99215)

Greg: yeah most are in ru TZ I imagine, or are ignore this chat and freaking out in a warroom private chat... 😉 (reply to 99224)

Егор: libraries: https://docs.ton.org/develop/dapps/apis/sdk  for example using "ton" library https://ton-community.github.io/ton/classes/JettonWallet.html (reply to 99204)

𝙰𝚁𝙸𝙾: Ton is dead  Pv: Ton has the best developers. Lol 🤣  Ton developers = 💩

Greg: I disagree. TOn is cool tech. cool heads will prevail. we dont know what is causing this problem yet. maybe too many validators cashed out. maybe something else. (reply to 99237)

I16000: How is it possible that 300+ validators down

Olya Nemo: Не все, конечно. Многие валидаторы, к  сожалению, выбирают одни и те же дата-центры. Возможно проблемы там. Еще до остановки пытались достучаться до ряда крупных валидаторов, те по неизвестной  причине перестали запускать машины (валидировать сеть). (reply to 99241)

I16000: Видимо придется пересмотреть порядок становления валидатором

Steven: Is the ton mainnet shutdown ?

Steven: they haven't produced any block since two hours ago

I16000: Who is administration of this group,in fact this is huge centralization point of controlling all validators,they advising to vote for changes and etc (reply to 99255)

User<7453272423>: Do know why blockchain or ecosystem on chain nothing use PHP ?

sangmin: Mytonctrl's node sync has slowed down a lot. Anyone else?

sangmin: out of sync 9500s .. !!

Olya Nemo: Это де-сеть., не интернет W2. Только сами валидаторы отключают свои машины. Не переживайте, ваши средства в безопасности. Команды работают. Скоро восстановят (reply to 99258)

sangmin: Aha... it wasn't creating blocks

Ryo: Shouldn't there be an announcement or something?

Greg: or something 😉 (reply to 99268)

Greg: where is that from? (reply to 99273)

ابو: I transferred ton from Binance to Telegram wallet 19 hours ago, it did not reach my wallet, even though the explorer shows that the transaction has completed

Оскар: https://t.me/tonstatus/125 (reply to 99277)

Vincent: Anyone know what cause the 706 error? Thanks, I love you. (reply to 99010)

Gold: how to scan the saved data of smart contract in TON scan?

Gold: How can I get the saved data of smart contract in TON scan? (reply to 98686)

Trevor King: Looks to still be down (reply to 99208)

Greg: I have about 4-7 nodes (not paid validator) on the ton network. I would appreciate if someone could instruct me on what I need to do to help with this process to correct the validator issue

Marc: Based on the update, they all need to be restarted at around the same time. (reply to 99291)

Greg: just restarted? can you provide more details?

Vahid: https://t.me/tonstatus/125 (reply to 99293)

User<6753518952>: While PHP excels in web development, it's not well-suited for blockchain or on-chain ecosystems due to performance, concurrency, security, and lack of native blockchain support. This has led to the adoption of other languages better aligned with blockchain needs. (reply to 99259)

I16000: I think you don't need do anything,just validators should (reply to 99291)

User<6753518952>: The 706 error is a contract execution error, often related to gas issues or invalid operations. By examining the transaction details and reviewing the smart contract code, you can usually pinpoint and resolve the cause. If you're consistently encountering this error, revisiting the smart contract's logic or adjusting gas fees may be necessary. (reply to 99283)

Laisky: TON has encountered issues with validator failures in the past, and it appears that many users have reported frequent validator crashes on GitHub issues this year, but no responses received.

Chaincode: Isn't TON a sharded, high-performance blockchain network? Why was it brought down by a DOGS? I lost a lot.

Laisky: IMHO, If there were infinite validators, and each one was infinitely powerful, then TON's performance could also reach infinite strength. However, the reality is that validators have limited performance, and there are bugs in the software. As a result, performance peaks will still exist for a certain period (though this peak is currently the strongest among all chains). (reply to 99308)

▪️ 🍅 TOMATO 📦 Bums 🐾: Why blacklisted?

&rey: Is that related to development on TON? (reply to 99313)

User<6753518952>: I can help you. (reply to 99204)

Karthi: My dogs withdrawal transaction failed what to do please help

&rey: You mean, it will fail? (see "pending" notice) (reply to 99322)

BOI - DxPool: Does TON have a open delegator application program open?

User<6753518952>: Oh, it's you (reply to 99113)

Dannel: yeah (reply to 99326)

User<6753518952>: Use a paid domain. (reply to 98991)

julian: does ton was crashed ?

julian: it have been 5 h for latest blcok

&rey: Yes. Response action, as it needs synchronous actions, has been scheduled in @tonstatus. (reply to 99331)

Karthi: but transfer token failed whether it will resume (reply to 99324)

User<6753518952>: I can help you. (reply to 98949)

User<6753518952>: good (reply to 98945)

User<6753518952>: plz DM me

Ryo: Is this the correct flags?   ExecStart = /usr/bin/ton/validator-engine/validator-engine --threads 15 --daemonize --global-config /usr/bin/ton/global.config.json --db /var/ton-work/db/ --logname /var/ton-work/log -F 39987437:600844:7 -F 39987437:600845:7 --state-ttl 86400 --block-ttl 86400 --archive-ttl 86400 --verbosity 1

E: @opensource @f_closer (reply to 99344)

sangmin: I use tonweb library, how do I activate the to address when I send TON?

▪️ 🍅 TOMATO 📦 Bums 🐾: Yes (reply to 99317)

▪️ 🍅 TOMATO 📦 Bums 🐾: Is i need to change?

Small: what happend?why no transaction on ton for 6 hours

kj: can i transact usdt in ton network is this possiable

&rey: Well, you need to wait when TON gets back online, then you most certainly can. (reply to 99352)

kj: is there is any reference to do it in python (reply to 99352)

kj: can you send some referece links

Laisky: how to calculate the opcode for the receive function in Tact?

&rey: There is, https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment. (reply to 99356)

Laisky: There is an issue with https://testnet.tonviewer.com/   When I click on these nodes, the details do not update.

M.eb: Problem solved. New blocks are created

🌱SEEDMeshchain.Ai🆙 UXUY: Dear Telegram Wallet Support,  I am writing to urgently address an issue with my Telegram Wallet. Recently, my wallet has been restricted from conducting any transactions. I am unable to send or receive funds, which is causing significant inconvenience and financial loss.  I am currently in the process of making a withdrawal and I have purchased dogs from different sellers who are now seeking their payments. This situation is critical, and I am eager to resolve it as soon as possible to avoid further complications.  Please look into this matter urgently and restore my wallet's functionality immediately. Your prompt attention to this issue would be greatly appreciated.  Thank you for your quick resolution.  Best regards,

&rey: No one except @wallet support can help you if you have problems with @wallet.  We simply don't hold appropriate private keys. (reply to 99369)

🌱SEEDMeshchain.Ai🆙 UXUY: They are not responding

Cümi...: Contact the wallet group chat (reply to 99369)

Cümi...: There is a responsive admin there (reply to 99371)

🌱SEEDMeshchain.Ai🆙 UXUY: Please can you help me with the Link of the group

Cümi...: Wallet_news_en_chat (reply to 99375)

TKAINU: Hello, I am receiving messages from transfer jettons, but I want to ask where this sender address is generated from, thank you.

Andrey: Hello everyone Has anyone encountered the error [TypeError: Cannot read property 'derive' of null] in the React Native environment when trying to validate a mnemonic phrase or create a mnemonic phrase?  Library @ton/crypto

Samiha: Hey guys, wanted to ask is there an API providing the latest basechain (workchain 0) block info or one that returns the shard number for a specific block number in basechain?

Ankit j: You mean, Paid plan buying on vercel ? (reply to 99330)

User<6753518952>: yh sure (reply to 99394)

User<6753518952>: or can use other service. (reply to 99394)

Ankit j: Thanks, also could you also advise if any video or guide available for Cloudflare- real time database integration? (reply to 99396)

Ankit j: I mean, db creation at cloudflare workers and config files to use on local..

J: I heard that if deposit to an account that is in "Uninit" status, bounce is it true?   If this is true, how can I know when it will be bounced to the address that TON sent it to? Or is there a way to speed up the bounce date?

J: here is my transaction hash :  UQBhif6hFZiwYn9OOUWkhl0MruyX87IT4wE372-hR7ddZF2V

J: I lost my $TON .. please help me 😭

User<6753518952>: plz DM me (reply to 99400)

TON Bounty Bridge: ​Upgrade the current wallet guide with the addition of highload wallet v3.  🏷 Education  Summary:Keeping the TON wallet guide updated with the latest highload wallet version is essential to ensure ...  Rewards: • 1000 USD in TON eqivalent  Created by reveloper

Armin: it will init and active when you send a transaction from it. don't worry (reply to 99403)

K.: Uninit means that "address doesn't have any smart contract code/persistent data yet" (source). Because of that, the transaction will not bounce.  But, if the address you sent to is your wallet, just send any transaction from it and it will become active. (reply to 99403)

J: i don't have the account

Armin: it won't bounced, when the transaction complete. (reply to 99410)

User<6753518952>: https://developers.cloudflare.com/d1/ Please refer to this. (reply to 99400)

Abdulaziz: i am not able to copy text to clipboard from telegram mini web app, anyone know solution ?

Abdulaziz: for example this address i copied but can not paste in my chrome browser in my Telegram Desktop

Abdulaziz: is it possible to send multiple assets in single transaction ?

Chaincode: Unfortunately, it was really lost 😥 (reply to 99403)

Nerses: If I parse all incoming messages to a smart contract, how can I determine whether the operation triggered by a specific message was successful?

J: thank you for reply.. (reply to 99420)

Laisky: https://ario.laisky.com/alias/ton-converter share a simple conversion tool that may help with debugging

User<6031319387>: Is there a group where I can sell usernames?

Haint: only way is to compare the before and after states (reply to 99425)

Nerses: How it can be done ? (reply to 99432)

Soon Guan: did the master chain block numbers sequence got messed up after the outage?

Soon Guan: context - I'm polling all the raw entities of Ton and indexing it on a db - one of the checks that I perform is  checking whether the masterchain blocks are in sequence (i assumed that they will be continuous)

Haint: you save the old state, execute the transaction, then get the new state and compare with the old state (reply to 99433)

Haint: otherwise you have to have some mechanism inside the contract that signify the result of the operation

Haint: one way is to have the contract returns the exit code to the user as the last message in the chain

Haint: I'm personally doing so

Haint: if the operation fails, I send back the remaining fund and attach an exit code if the operation succeeds, I will emit an event

Nerses: i just cant understand what means compare,as it can change the state but not like i expected,how should i be sure ? (reply to 99436)

Haint: you dont know which state would change if the operation succeeds ? (reply to 99441)

Nerses: Yeah I know (reply to 99442)

Nerses: So I just need to see state changes

Haint: for example sending jettons, you save the recipient's balance before sending the tx

Haint: but it doesn't work if you are trying to build an indexer. If you control the contract, you should use some kind of mechanism to indicate if a particular tx is sucessful or not, like I mentioned above

🦊Bisoye ⏳️🐸: Hello

Matthew: if something fails does ton revert the state

🦊Bisoye ⏳️🐸: Please I need help on this issue

Confidential: How to Activate Inactive Ton Address, I Have Sent Some Funds To The Address, But It Is Still Not Activated

🦊Bisoye ⏳️🐸: Please can someone help me on this, it's almost 24 hours now

TON Bounty Bridge: ​Издание книги с названием: Деньги на криптовалюте (Пошаговое руководство по извлечению выгоды из криптовалют на блокчейне Ton)  🏷 Education  Summary:Написание печатной книги, в которой будет:  Created by kristianakila

Confidential: How to Activate TON Address "uninit"

Abdulaziz: I got questions about sending multiple jettons, nfts, username/phone numbers in single transaction... if you can help, i will give you 600$ worth of username...  if interested, dm me.

Prince: phone numbers? what do you mean? jetton, nft I got it, but... (reply to 99458)

Abdulaziz: ah, actually they are nfts too, is not it / (reply to 99460)

Prince: oh, I see (reply to 99461)

Prince: pls post detailed.

&rey: Why DM? Are there problems with tools you found, or you found no tools? (reply to 99458)

&rey: 1. why do so? it should work fine anyways 2. send StateInit (in most cases, during outgoing transfer) (reply to 99457)

&rey: Revert? Only the transaction which fails. Please mind that one transaction changes state of one contract. (reply to 99449)

H: // console.log("hash res1",dictKey); //  const collectionContentDict =  Dictionary.empty(); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())     // .set( dictKey , beginCell().storeUint(1024, 256).endCell())   //   .set(  BigInt('0x' + dictKey.toString('hex')) , beginCell().storeUint(1024, 256).endCell())   //  collectionContentDict.set( dictKey , beginCell().storeUint(0, 256).endCell())     //    collectionContentDict.set( BigInt('0x' + sha256_sync("1").toString('hex')) , beginCell().storeUint(0, 256).endCell()) //  const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.BigUint(256));  // const collectionContentDict =  ( Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()) ;  //  const collectionContentDict =  Dictionary.empty() ;  //BigInt('0x' + sha256_sync(s).toString('hex'))  BigInt(0)  //  //   key_value_content: beginCell().endCell() //      const collectionContentDict =  Dictionary.empty<Buffer, Cell>()  let collectionContentDict =Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())  collectionContentDict.set(dictKey , beginCell().storeUint(1024, 256).endCell())    // const collectionContentDict = Dictionary.empty<Buffer, Cell>(Dictionary.Keys.Buffer(32));  export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {     return beginCell()         .storeAddress(config.ownerAddress)         .storeUint(config.nextItemIndex, 64)         .storeRef(config.collectionContent)         .storeRef(config.nftItemCode)    .storeRef(             beginCell()                 .storeUint(config.royaltyParams.royaltyFactor, 16)                 .storeUint(config.royaltyParams.royaltyBase, 16)                 .storeAddress(config.royaltyParams.royaltyAddress)                 .endCell() )                  .storeDict(collectionContentDict)                 //  .storeDict(config.key_value_content,Dictionary.Keys.BigInt(256),Dictionary.Values.Cell())                 //   .storeDict( config.key_value_content ,Dictionary.Keys.Buffer(32) ,Dictionary.Values.Cell())                //  .storeDict(config.key_value_content, Dictionary.Keys.Buffer(32) , Dictionary.Values.Cell())               //    .storeDict(Dictionary.empty<Buffer, Cell>(), Dictionary.Keys.Buffer(32) , Dictionary.Values.Cell())                 //   .storeDict(Dictionary.empty<Buffer, Cell>() )                //    .storeDict(null)                 .endCell(); //, Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell( ) Dictionary.Keys.Buffer(255), Dictionary.Values.Cell( )  storeDictDirect //.storeRef(config.key_value_content)  //.storeDict(config.key_value_content , Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell( ))         //   .storeDict(Dictionary< Dictionary.Keys.BigInt(256) , Dictionary.Values.Cell() > )        //  //      .storeRef(config.key_value_content) beginCell().endCell()      //       }

&rey: Exit code 7 is not in your code, it seems. (reply to 99469)

H: how do i initialize stordict??? (reply to 99469)

H: when i deploy it show it (reply to 99470)

H: (slice, int, cell, cell, cell, cell) load_data() inline {   var ds = get_data().begin_parse();   return      (ds~load_msg_addr(), ;; owner_address      ds~load_uint(64), ;; next_item_index      ds~load_ref(), ;; content      ds~load_ref(), ;; nft_item_code      ds~load_ref(), ;; royalty_params       ds~load_dict()  ;; key_value_content      ); } () save_data(slice owner_address, int next_item_index, cell content, cell nft_item_code , cell royalty_params, cell key_value_content) impure inline {    set_data(begin_cell()     .store_slice(owner_address)     .store_uint(next_item_index, 64)     .store_ref(content)     .store_ref(nft_item_code)     .store_ref(royalty_params)      .store_dict(key_value_content)      .end_cell()); }

Confidential: I Want To Transfer Balance From Another Wallet Address To NC Wallet, When The Delivery Status Is Completed The Funds Did Not Enter The Wallet, So I Checked The Address And Saw The Wallet Status "inactive" (reply to 99467)

H: can i store dict in Save_data?? (reply to 99473)

H: so how could i store it to not get exit code 7 ?? till  now i tryied over 50 diffrent possibilty (reply to 99470)

Nerses: How can I design a smart contract on the TON blockchain that allows users to send exactly the required amount of TON for a transaction to process, ensuring that any excess amount is returned to the user?

H: Dose anyone know about how to store dictionary in savedata??

H: So that's the cause of exit code 7? (reply to 99482)

Confidential: how much fee gas activate TON Contract ?

&rey: 0.02 TON is well over the line. (reply to 99484)

H: Ok cool , (slice, int, cell, cell, cell, cell) load_data() inline {   var ds = get_data().begin_parse();   return      (ds~load_msg_addr(), ;; owner_address      ds~load_uint(64), ;; next_item_index      ds~load_ref(), ;; content      ds~load_ref(), ;; nft_item_code      ds~load_ref(), ;; royalty_params       ds~load_dict()  ;; key_value_content      ); } () save_data(slice owner_address, int next_item_index, cell content, cell nft_item_code , cell royalty_params, cell key_value_content) impure inline {    set_data(begin_cell()     .store_slice(owner_address)     .store_uint(next_item_index, 64)     .store_ref(content)     .store_ref(nft_item_code)     .store_ref(royalty_params)      .store_dict(key_value_content)      .end_cell()); } (reply to 99486)

H: This is part of func code (reply to 99488)

H: My code will compile but on deploy get exit code 7

H: This is the wrapper i use to deploy (reply to 99469)

H: If you alow i send you the file of codes (reply to 99486)

User<7236462253>: Hello i already withdraw TON from Quick bot from 10 hour ago but my wallet not yet have TON come , Who can help me ?

Confidential: Help me activate it, when the address is activated, I will return 0.5 TON  UQBK66ZreqHk9F7OUH35heeBWyHCHJKLcNrzhzj91HRW3xrc (reply to 99487)

Confidential: Same Problem, Telegram Wallet Not Responding, I Have Moved Funds To Ton Space But Status Still Pending Until Now (reply to 99493)

User<7236462253>: Yes , i transfered  from trust to binance is same 😂

H: Dose anyone know about how to store dictionary ??

Kapil: https://testnet.tonviewer.com/transaction/237f5f730bebf03f49a48a29f3337de0915476355b93b06e1b4dc7766ae66d9c

Kapil: can anyone help me with this tnx

Confidential: Does This Have Anything To Do With Telegram's CEO, That Fund Delivery Status Is Delayed

Nerses: https://tact-by-example.org/04-maps (reply to 99498)

H: here? (reply to 99504)

H: import {      Address,      beginCell,      Cell,      Contract,      contractAddress,      ContractProvider,      Sender,      SendMode,     TupleItemInt,      TupleItemCell,     toNano, Dictionary,     address  } from '@ton/core';   import { //     Address,  //     beginCell,  //     Cell,  //     Contract,  //     contractAddress,  //     ContractProvider,  //     Sender,  //     SendMode, //     TupleItemInt,  //     TupleItemCell, //     toNano, //     address ,Dictionary   } from 'ton-core';    import { Op } from './NftConstants'; import { Uint } from 'web3';  //  import { Slice,Dictionary, } from 'ton-core'; import { sha256_sync,  sha256  } from '@ton/crypto'   export type NftCollectionMinterContent  = {     type:0|1,     uri:string };  export type NftCollectionMinterContent_1 = {     type:0|1,     itemOwnerAddress:Address,     uri:string }; // export type JettonMinterConfig = {total_supply:bigint;admin: Address; content: Cell; wallet_code: Cell};  //<>     key_content : Buffer ;     value_content:Cell; Dictionary<bigint, Cell>   //Maybe<Dictionary<K, V>>   // key_value_content: Cell ;    //   null    // Dictionary<bigint, bigint>   // key_value_content:  Maybe<Dictionary<bigint, bigint>> ;  let itemAddress: Address  export type RoyaltyParams = {     royaltyFactor: number;     royaltyBase: number;     royaltyAddress: Address; };  export type NftCollectionConfig = {     ownerAddress: Address;     nextItemIndex: number;     collectionContent: Cell;     nftItemCode: Cell;      royaltyParams: RoyaltyParams;    // key_value_content: Dictionary<bigint, Cell> ; };  export function nftCollectionContentToCell(content:NftCollectionMinterContent) {     return beginCell()                       .storeUint(content.type, 8)                       .storeStringTail(content.uri) //Snake logic under the hood            .endCell(); }     const dictKey = sha256_sync("4") // console.log("hash res1",dictKey); //  const collectionContentDict =  Dictionary.empty(); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()); // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())     // .set( dictKey , beginCell().storeUint(1024, 256).endCell())   //   .set(  BigInt('0x' + dictKey.toString('hex')) , beginCell().storeUint(1024, 256).endCell())   //  collectionContentDict.set( dictKey , beginCell().storeUint(0, 256).endCell())     //    collectionContentDict.set( BigInt('0x' + sha256_sync("1").toString('hex')) , beginCell().storeUint(0, 256).endCell()) //  const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.BigUint(256));  // const collectionContentDict =  ( Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()) ;  //  const collectionContentDict =  Dictionary.empty() ;  //BigInt('0x' + sha256_sync(s).toString('hex'))  BigInt(0)  //  //   key_value_content: beginCell().endCell() //      const collectionContentDict =  Dictionary.empty<Buffer, Cell>()  let collectionContentDict =Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())

H:   //     return beginCell().storeUint(Op.mint_nft, 32).storeUint(query_id, 64) // op, queryId //     .storeUint(itemIndex,64) //     .storeCoins(amount) //     .storeRef(nftMsg) //     .endCell(); // } // async sendMintNft(provider: ContractProvider, via: Sender,_ownerAddress:Address,value: bigint, //          amount: bigint  // to send with nft itemOwnerAddress: Address,,itemOwnerAddress //       , itemIndex: bigint, itemContent: Cell ,query_id: number | bigint //   ) {  //     await provider.internal(via, { //         sendMode: SendMode.PAY_GAS_SEPARATELY, //         body: NftCollection.nftMessage(_ownerAddress ,amount,itemIndex,itemContent,query_id), //         value:value+toNano('0.015'), //     }); // }     //////////  async sendMintNft(provider: ContractProvider, via: Sender,     opts: {         value: bigint;         queryId: number;         amount: bigint;  // to send with nft         itemIndex: number;         itemOwnerAddress: Address;         itemContent: Cell;             }     ) {         const nftMessage = beginCell();         nftMessage.storeAddress(opts.itemOwnerAddress)         nftMessage.storeRef(opts.itemContent)         await provider.internal(via, {             value: opts.value,             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: beginCell()                 .storeUint(1,32)  // operation                 .storeUint(opts.queryId,64)                 .storeUint(opts.itemIndex,64)                 .storeCoins(opts.amount)                 .storeRef(nftMessage)  // body             .endCell()         })     }  static changeAdminMessage(newOwner: Address) {         return beginCell().storeUint(Op.change_admin, 32).storeUint(0, 64) // op, queryId                           .storeAddress(newOwner)                .endCell();     }      async sendChangeAdmin(provider: ContractProvider, via: Sender, newOwner: Address) {         await provider.internal(via, {             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: NftCollection.changeAdminMessage(newOwner),             value: toNano("0.05"),         });     }     static withdrawalMessage(withdraw_amount: bigint) {         return beginCell().storeUint(Op.withdraw, 32).storeUint(0, 64) // op, queryId                           .storeCoins(withdraw_amount)                .endCell();     }      async sendwithdrawal(provider: ContractProvider, via: Sender, withdraw_amount: bigint) {         await provider.internal(via, {             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: NftCollection.withdrawalMessage(withdraw_amount),             value: toNano("0.05"),         });     }     static addValidNFTMessage(withdraw_amount: bigint , new_key_value_content:Cell) {         return beginCell().storeUint(Op.withdraw, 32).storeUint(0, 64) // op, queryId                           .storeCoins(withdraw_amount)                           .storeRef(new_key_value_content)                .endCell();     }      async addValidNFT(provider: ContractProvider, via: Sender, content_price: bigint, new_key_value_content:Cell) {         await provider.internal(via, {             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: NftCollection.addValidNFTMessage(content_price , new_key_value_content),             value: toNano("0.05"),         });     }     static deleteValidNFTMessage( new_key_value_content:Cell) {         return beginCell().storeUint(Op.delete_valid_nft, 32).storeUint(0, 64) // op, queryId                           .storeRef(new_key_value_content)                .endCell();     }

Confidential: Sending funds from Telegram Wallet There is a problem, just waiting for Telegram news. Reason for the transaction being pending

H: this is wrapper

H:   import { address, beginCell, toNano ,Dictionary} from '@ton/core';  import { NftCollection } from '../wrappers/NftCollection'; import { compile, NetworkProvider, UIProvider} from '@ton/blueprint'; import { promptAddress, promptBool, promptUrl } from '../wrappers/ui-utils'; import { setItemContentCell,buildCollectionContentCell } from '../scripts/nftContent/onChain'; //import { Cell } from 'ton-core'; import { sha256_sync,  sha256  } from '@ton/crypto' // import {  //   Address,  //   beginCell,  //   Cell,  //   Contract,  //   contractAddress,  //   ContractProvider,  //   Sender,  //   SendMode, //   TupleItemInt,  //   TupleItemCell, //   toNano, //   address ,Dictionary // } from 'ton-core';  //const urlPrompt =require('../wrappers/url.json'); //import urlPrompt from "../wrappers/url.json";   /// i wanna use off chain and onchain meta data to test posiible senario   // the goal is to be able see the off chain meta data on ton testnet scan   // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  //   sixth  try   workeddddddddddddddddddddd   // tonhub for mobile will have error to loged in  // the goal is to be able deploy with onchain data  // meta data i must wait till i interact with contarct to see my symbol  // const formatUrl = "https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain";     const urlPrompt = {             "name": "fluxudio testq nft",             "description": "Sample of test nft",             "image": "https://thumb2.jobinjacdn.com/1EaFE0hAfH04vU4YRQrTMHA9JBQ=/fit-in/200x200/filters:strip_exif():fill(white):quality(100)/https://mstorage2.jobinjacdn.com/other/files/uploads/images/775db869-786e-4d85-988a-7a7d2ab2e239/main.jpg"         }            //const urlPrompt = 'https://ipfs.io/ipfs/QmVHcYKZfny2Z8F3h1XhCj47k6o72rorjFSCUEs6Kk2mYu';  // "image": "https://thumb2.jobinjacdn.com/1EaFE0hAfH04vU4YRQrTMHA9JBQ=/fit-in/200x200/filters:strip_exif():fill(white):quality(100)/https://mstorage2.jobinjacdn.com/other/files/uploads/images/775db869-786e-4d85-988a-7a7d2ab2e239/main.jpg"  export async function run(provider: NetworkProvider) {   //   const ui       = provider.ui();   //  const sender   = provider.sender(); const adminPrompt = `0QCf2sQa4x16VhW4gsK57qP3AehozWO-vT-mVYrYNb_AyS7d`;       // ui.write(`Jetton deployer\nCurrent deployer onli supports off-chain format:${urlPrompt}`);      //   let admin      = await promptAddress(adminPrompt, ui, sender.address);     // ui.write(`Admin address:${admin}\n`);     // let contentUrl = await promptUrl(urlPrompt, ui);     // ui.write(`Jetton content url:${contentUrl}`);      // let dataCorrect = false;     // do {     //     ui.write("Please verify data:\n")     //     ui.write(`Admin:${admin}\n\n`);     //     ui.write('Metadata url:' + contentUrl);     //     dataCorrect = await promptBool('Is everything ok?(y/n)', ['y','n'], ui);     //     if(!dataCorrect) {     //         const upd = await ui.choose('What do you want to update?', ['Admin', 'Url'], (c) => c);      //         if(upd == 'Admin') {     //             admin = await promptAddress(adminPrompt, ui, address("0QCf2sQa4x16VhW4gsK57qP3AehozWO-vT-mVYrYNb_AyS7d"));     //         }     //         else {     //             contentUrl = await promptUrl(urlPrompt, ui);     //         }     //     }      // } while(!dataCorrect);

H: deploy script (reply to 99514)

ㅤㅤㅤ ㅤㅤㅤmamad: Dear friends, because your transfers in the Telegram wallet are in trouble, we are sorry for the release of several billion dollars of capital from the large pool of our servers. Please be patient until the problem is resolved.

H: // the goal is to turn below code to snakeformat dataa to be stored on chain    // const content = jettonContentToCell({type:0,uri:urlPrompt});  // i use the nft scrpt to do that i made my change      //  const dictKey = await sha256("2")   // console.log("hash res1",dictKey);      //  const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());   // const collectionContentDict =  Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())       // .set( dictKey , beginCell().storeUint(1024, 256).endCell())     //   .set(  BigInt('0x' + dictKey.toString('hex')) , beginCell().storeUint(1024, 256).endCell())     //  collectionContentDict.set( dictKey , beginCell().storeUint(0, 256).endCell())       //    collectionContentDict.set( BigInt('0x' + sha256_sync("1").toString('hex')) , beginCell().storeUint(0, 256).endCell())   //  const collectionContentDict =  Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.BigUint(256));    // const collectionContentDict =  ( Dictionary.Keys.BigUint(256), Dictionary.Values.Cell()) ;    //  const collectionContentDict =  Dictionary.empty() ;    //BigInt('0x' + sha256_sync(s).toString('hex'))  BigInt(0)    //  //   key_value_content: beginCell().endCell() //      const collectionContentDict =  Dictionary.empty<Buffer, Cell>()    //  collectionContentDict.set( BigInt('0x' + sha256_sync("1").toString('hex')) , beginCell().storeUint(1024, 256).endCell())      // const collectionContentDict = Dictionary.empty<Buffer, Cell>(Dictionary.Keys.Buffer(32));   //    console.log("hash res2",dictKey);  //    console.log("collectionContentDict collectionContentDict",collectionContentDict);     const content=setItemContentCell(urlPrompt)  ;      const NftItem_code = await compile('NftItem');      const minter  = NftCollection.createFromConfig(   {       ownerAddress: address(adminPrompt),       nextItemIndex: 0,       collectionContent: content,       nftItemCode: NftItem_code,       royaltyParams: {           royaltyFactor: 0,           royaltyBase: 1,           royaltyAddress: address(adminPrompt),       },     //  key_value_content: collectionContentDict    }    ,                                                          await compile('NftCollection'));           const openedContract = provider.open(minter);      //   console.log("openedContract--->",openedContract);                openedContract.sendDeploy(provider.sender(), toNano("0.3"));                  await provider.waitForDeploy(minter.address); }    // await provider.deploy(minter, toNano('0.05'));  is depricated so i added these i learn it from stepik

H: the rest of deploy script (reply to 99518)

George: Hello, I encountered a problem today for several times: A create_transfer request was made via toncenter, and everything was ok, no errors, but in fact the transfer itself was not created at all, neither in tonviewer nor in tonscan is it anywhere, not “created and not completed”, not “created and completed with some error” or something, but in general it is nowhere to be found. Has anyone else come across this?

ㅤㅤㅤ ㅤㅤㅤmamad: No, due to the release of several billion dollars of capital from the large pool and the addition of several million people to the ton transfer ecosystem, the servers have slowed down a bit, and the technical team is investigating and fixing the problem. (reply to 99501)

H: Ok 😅, i erase the comments and then send it again 😅 (reply to 99520)

&rey: You can't make such demands in chat (I would decline in private as well, though).  Blockchain is slow now; also, I'd need a public key for deploy instead of address. (reply to 99494)

Fereshte: Yeah I've sent many successfull transactions today but just two of them are now on explorers! (reply to 99521)

&rey: Indeed. You need to retry until transfer is sent – that might take up to several hours currently, I guess. When seqno of your wallet changes, something finally got sent. (reply to 99521)

George: So I should for future problems with TON add a check of seqno changes? If smth is wrong it won't change? But how exactly can I be sure not to create multiple transactions insteadof 1 in this case? (reply to 99526)

&rey: (I have once written a proprietary send-certainly script in Python, taking ~300 LoC IIRC) (reply to 99526)

H: import {      Address,      beginCell,      Cell,      Contract,      contractAddress,      ContractProvider,      Sender,      SendMode,     TupleItemInt,      TupleItemCell,     toNano, Dictionary,     address  } from '@ton/core';    import { Op } from './NftConstants'; import { Uint } from 'web3';  //  import { Slice,Dictionary, } from 'ton-core'; import { sha256_sync,  sha256  } from '@ton/crypto'   export type NftCollectionMinterContent  = {     type:0|1,     uri:string };  export type NftCollectionMinterContent_1 = {     type:0|1,     itemOwnerAddress:Address,     uri:string };   let itemAddress: Address  export type RoyaltyParams = {     royaltyFactor: number;     royaltyBase: number;     royaltyAddress: Address; };  export type NftCollectionConfig = {     ownerAddress: Address;     nextItemIndex: number;     collectionContent: Cell;     nftItemCode: Cell;      royaltyParams: RoyaltyParams;    // key_value_content: Dictionary<bigint, Cell> ; };  export function nftCollectionContentToCell(content:NftCollectionMinterContent) {     return beginCell()                       .storeUint(content.type, 8)                       .storeStringTail(content.uri) //Snake logic under the hood            .endCell(); }     const dictKey = sha256_sync("4")   let collectionContentDict =Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())  collectionContentDict.set(dictKey , beginCell().storeUint(1024, 256).endCell())    // const collectionContentDict = Dictionary.empty<Buffer, Cell>(Dictionary.Keys.Buffer(32));  export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {     return beginCell()         .storeAddress(config.ownerAddress)         .storeUint(config.nextItemIndex, 64)         .storeRef(config.collectionContent)         .storeRef(config.nftItemCode)    .storeRef(             beginCell()                 .storeUint(config.royaltyParams.royaltyFactor, 16)                 .storeUint(config.royaltyParams.royaltyBase, 16)                 .storeAddress(config.royaltyParams.royaltyAddress)                 .endCell() )                  .storeDict(collectionContentDict)                  .endCell();     } export class NftCollection implements Contract {     constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}      static createFromAddress(address: Address) {         return new NftCollection(address);     }                 static createFromConfig(config: NftCollectionConfig, code: Cell, workchain = 0) {         const data = nftCollectionConfigToCell(config);         const init = { code, data };         return new NftCollection(contractAddress(workchain, init), init);     }      async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {         await provider.internal(via, {             value,             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: beginCell().endCell(),         });     }        } (reply to 99520)

H: wrapper (reply to 99530)

H: import { address, beginCell, toNano ,Dictionary} from '@ton/core';  import { NftCollection } from '../wrappers/NftCollection'; import { compile, NetworkProvider, UIProvider} from '@ton/blueprint'; import { promptAddress, promptBool, promptUrl } from '../wrappers/ui-utils'; import { setItemContentCell,buildCollectionContentCell } from '../scripts/nftContent/onChain'; //import { Cell } from 'ton-core'; import { sha256_sync,  sha256  } from '@ton/crypto'     const urlPrompt = {             "name": "test test ",             "description": "Sample of test nft",             "image": "https://thumb2.jobinjacdn.com/1EaFE0hAfH04vU4YRQrTMHA9JBQ=/fit-in/200x200/filters:strip_exif():fill(white):quality(100)/https://mstorage2.jobinjacdn.com/other/files/uploads/images/775db869-786e-4d85-988a-7a7d2ab2e239/main.jpg"         }            //const urlPrompt = 'https://ipfs.io/ipfs/QmVHcYKZfny2Z8F3h1XhCj47k6o72rorjFSCUEs6Kk2mYu';  export async function run(provider: NetworkProvider) {   //   const ui       = provider.ui();   //  const sender   = provider.sender(); const adminPrompt = `0QCf2sQa4x16VhW4gsK57qP3AehozWO-vT-mVYrYNb_AyS7d`;       const content=setItemContentCell(urlPrompt)  ;      const NftItem_code = await compile('NftItem');      const minter  = NftCollection.createFromConfig(   {       ownerAddress: address(adminPrompt),       nextItemIndex: 0,       collectionContent: content,       nftItemCode: NftItem_code,       royaltyParams: {           royaltyFactor: 0,           royaltyBase: 1,           royaltyAddress: address(adminPrompt),       },     //  key_value_content: collectionContentDict    }    ,                                                          await compile('NftCollection'));           const openedContract = provider.open(minter);                 openedContract.sendDeploy(provider.sender(), toNano("0.3"));                  await provider.waitForDeploy(minter.address); } (reply to 99520)

H: deploy script (reply to 99535)

&rey: This is an architecture piece of your problem. For reference, my interface had the following signature:  def send_certainly(   provider: pytoniq.LiteClient,   source: pytoniq.WalletContract,   order: list,   handle_timeout: typing.Callable[[], bool],   handle_replaced: typing.Callable[[pytoniq.Transaction], bool]) -> typing.Optional[pytoniq.Transaction] (reply to 99528)

Nerses: I use ton/ton how i can specify sending message mode here  await contractProvider.send(walletSender, { value: amount, bounce: true }, lockCommitmentSigMessage);   ?

George: Indeed it is. The thing is, how can I know what timeout is for the seqno change, and how probable it is to change while such overloads in blockchain, and probably also a separate possible timeout in toncenter. I feel like such problems should be handled manually unless it is a transfer between your own wallets. Or well, maybe I just lack knowledge (reply to 99537)

Cat: Hello. Could you please tell me how long does it take on average to process a transaction in TON? For some reason, this transaction is taking too long to process... https://tonscan.org/tx/83lN7sUaOJhvQBzl7IvNXf0zlN3d29r+fL4WLqQ7vWE=

Testarudo: 5 to 10 secs (reply to 99540)

Testarudo: Is anyone using flutter and dart for the client code of a ton dapp?

&rey: If block utime is larger than valid-until of wallet order, old transaction will not be recorded. (reply to 99539)

Tamagoshi: Hey guys, a question: What is "OBJ" Tag on payload transactions?

Aram: Hey guys I am trying to parse ForwardPayload from token transfer message. and isForwardPayload is false. Do you notice something obviously wrong here?

Leo: this bit indicates whether the forward payload is stored in the same cell or as a ref; not whether or not a forward payload exists (reply to 99558)

Эльдар: I think isForwardPayload = slice.loadBit() is unnecessary here, isForwardPayload must check if still any data persist in slice and if it persist then it true, else false. but i can mistake (reply to 99558)

Tamagoshi: Anyone can help on this? (reply to 99554)

Tamagoshi: I sent a transaction for my cex with memo and there's a tag "OBJ" on my biggest transaction

Tamagoshi: i did same process on all transactions and the deposit arrived

Aram: hah...makes sense! thank you! (reply to 99561)

dazzler: Hi guys, i am integrating this ton network in my project

dazzler: can anyone tell me what is the length of private key, i am getting 128 characters length private key

Tamagoshi: Tonviewer, Alongside my memo have a tag "OBJ" (reply to 99567)

Tamagoshi: Dm (reply to 99574)

Abdulaziz: import { useTonConnectUI } from '@tonconnect/ui-react'; import { toNano } from '@ton/ton'  const myTransaction = {     validUntil: Math.floor(Date.now() / 1000) + 360,     messages: [         {             address: jettonWalletContract, // sender jetton wallet             amount: toNano("0.05").toString(), // for commission fees, excess will be returned             payload: body.toBoc().toString("base64") // payload with jetton transfer body         }     ] }  export const Settings = () => {     const [tonConnectUI, setOptions] = useTonConnectUI();      return (         <div>             <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>                 Send transaction             </button>         </div>     ); };  jettonWalletContract is jetton contract address ?

Dom: Yo I'm looking for ton developers ... I have some jobs to do, pls send me DM of anyone interested

Aram: still something off, can't get to actual payload

Aram: but for example forward ton amount is correct

Steve: Hi guys. Stupid question: if you get wallet seqNo, then make a transaction (e.g. send another wallet some TON), and then want to immediately make another transactions, you would need the seqno to be incremented by 1, however the getSeqno() method of walletContract still gives the old seqno…  Does that mean you can not send new transactions until previous seqNo has been incremented?

Ryo: I have a question. Only about 190 validators participated in this election, why is that?  https://tonwhales.com/staking/stats

Deny: Yes, you can only wait current seqno incremented to make another transaction (reply to 99583)

George: Thanks a lot, as I understand valid-until is smth from tonconnect, but I searched more info based on your answers and now I realize that in my case seqno that I actually already specify in the message solves the problem, I just need to refactor code a little bit now that I understand the purpose of seqno better. (reply to 99552)

Abdulaziz: how to send like this transaction ?

Steve: thanks for the help! isn’t this a bit… weird? let’s say you are using node.js to send funds to another wallet. if the node.js process dies, then you loose the knowledge of the latest seqNo you sent? so you would have to fetch that from some presistant off-chain storage to understand if you can proceed with new txses… or am I getting something wrong? (reply to 99590)

dazzler: hi (reply to 99577)

Deny: Check this my question a few months ago https://t.me/tondev_eng/53055 (reply to 99599)

Steve: Wow, thanks a lot!

Moein: Hello everyone We have launched a game a month ago and 2 weeks ago we added the feature for users to connect their ton wallet The feature worked until some days ago and it suddenly stopped working We are using ton-connect sdk (vue). The code works fine on other domains and many suggest doing that but I’m not sure if it has to do anything with domain being faulty but rather maybe it’s been blocked for some reason? If someone could confirm there is no such a thing as banning the domain we will simply change our domain Thanks

david: Hey, does ton is preferrable than using stars ? cause stars take a lot of fee ?

Jacob: Yes, a domain can be blocked or banned for various reasons, including security concerns, suspicious activities, or violations of service policies by platforms or wallet providers. (reply to 99609)

Moein: Thanks for the answer If it’s an automated process I believe our domain has been blocked by mistake Can we request a review? (reply to 99612)

Jacob: Security Warnings or Misconfigurations: If the domain has been flagged for security issues (e.g., SSL problems, phishing warnings), it could be blocked by the TON wallet or related services. Cross-Origin Resource Sharing (CORS) Issues: Misconfigured CORS policies on your server can prevent the TON wallet connection from working properly. Domain Reputation or Blacklisting: If the domain is associated with harmful or malicious activities, it might be blacklisted by certain services. API Rate Limits or Restrictions: If the domain exceeds API rate limits or violates terms of use, access may be restricted.

Jacob: If there's no direct banning policy confirmed, it might be best to test with another domain to see if the problem persists. I think so....

Moein: We know with another domain it works fine It’s just we don’t see a point in changing if there is a chance that the automated process block our new domain again 😭

Jacob: Check this.  To prevent future blocks, Check your domain’s reputation: Ensure it's not flagged or blacklisted. Review CORS and security configurations: Correct any misconfigurations. Monitor traffic and API usage: Avoid triggering rate limits or suspicious patterns. If issues persist without clear reasons, changing domains might be necessary, but maintaining good domain hygiene will reduce the risk of recurrence.

User<6218334417>: Does anyone know how to customize font-family (--tgui--font-family) when using @telegram-apps/telegram-ui in a mini app?

Mirodil O: Hi everyone,  I am looking for a mentor who can guide me through hands-on projects and help me gain practical experience, if you’re open to mentoring I would greatly appreciate the opportunity to connect. Thanks.

TG: Hey, if anyone needs any ready made telegram Mini apps let me know :)

david: Hey (reply to 99624)

david: do you know if telegram take fee on $TON ?

david: compare to stars ?

david: Also I heard that ton integration does not work on the US is it true ?

Adam: Lmao deploy it by sending a transaction from it (reply to 99457)

Костя: Hello everyone, I'm trying to deploy the nft collection on the testnet, but at the moment he just writes to me "Error deploying NFT at index 112: Error: Request failed with status code 500" and this is not the first time, everything is OK with the Internet, but the contract in the tonkipper simply does not work, although everything is OK, here it is transaction https://testnet.tonviewer.com/transaction/c260d3159e878417d1c358fa41eaccc235098884be77e3509db65fef313816b8. Here is one of the transactions that went through https://testnet.tonviewer.com/transaction/765f67560e4d891aeb3d813e6af727160ffebdfa9915e8921c92da788023a9e4 which has passed. I will be extremely grateful for your help

Sadman: I always got  {"connected":false,"error_code":"invalid_signature"}  anyone know the method to generate signature?

Sarah: chain halt.. again??

Wasiq: Hello what's up with TON again it's slow again

Sarah: last block was 17 minutes ago..

Sam: Hello  How can i generate signature? Pls help me

💰: Hi, when blockchain will go back up?

Wasiq: Ah shit not again.. (reply to 99645)

Wasiq: i thought my internet went down

HeeMo | BBY TradeOS: hmm the MAU display is gone?

💰: Yes it’s gone for me too (reply to 99656)

&rey: Telegram cannot, since TON is blockchain on its own. Only TON validators take network fees there. (reply to 99627)

Ryo: Is it a chain down again?...

User<6466037155>: I'm a blockchain developer. If you need any help or want me, please contact me at anytime. Thanks. (reply to 99669)

User<6466037155>: Pls DM me. Let's discuss. (reply to 99672)

‌‌ ‌‌‌Mohammad: Hey folks, I'm encountering an issue with my TON smart contract update. Whenever I change any variables or structures in my code and try to publish it, it results in a new contract address. Is this expected behavior on TON, or could there be a problem with my code?

&rey: Indeed, and it should be so; whenever you change rules (even be they variables in rules), you create a separate contract. (reply to 99681)

Wilson Gomes: Hey team

Wilson Gomes: I would like to talk with the team or foundation regarding support on TON ecosystem, is there anyone that could help me?

&rey: As I watch, most projects turn out not needing help of TON Foundation; could you perhaps name scope of your project? (reply to 99685)

Wilson Gomes: I believe, can i send you a DM please? (reply to 99687)

Greg: yup. (reply to 99668)

Pablo: Looking to learn about tokenomics for a rewards based game. I’ll share app in time.

Pablo: I love idle games, would be great to play one through telegram and provide rewards

TKAINU: Hello, how can I withdraw jetton from smart contract to my wallet, I am the owner

TKAINU: I want to build functionality in my code, can I do it like this?

User<7127693727>:   builder msg = begin_cell()     .store_uint(0x10, 6)      .store_slice(jetton_wallet_address)     .store_coins(0)     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1)     .store_uint(1, 1)     .store_ref(       begin_cell()         .store_uint(0xf8a7ea5, 32)         .store_uint(0, 64)         .store_coins(jetton_value)         .store_slice(from_address)         .store_slice(response_address)         .store_uint(0, 1)         .store_coins(1)         .store_uint(0, 1)         .store_uint(0, 32)         .store_slice("Hello")       .end_cell()     );

Abdulaziz: what I will need to write to response_destination ?

Abdulaziz: and destination is the address, that I am sending tokens "TO" ? (reply to 99714)

&rey: Whoever should get any TON not used up as gas fees or forward amount. (reply to 99714)

Abdulaziz: so, it should be FROM address ? (reply to 99716)

Abdulaziz: you don't answer in DMs ? (reply to 99716)

&rey: Please imagine situation from my side. (for reference, I have main dev chats ~pinned) (reply to 99718)

Abdulaziz: yeah, i got u broo, sorry (reply to 99721)

Fyz: Hi, any tips how i can promote my TMA to get early adopter or user to get quickly feedback?

Rohan: hey guys starting to build in the ecosystem- put together a bot that can take content and metadata from instagram links and forward to a shared meme channel.  Would love for yall to try it out and give me some feedback- can share the github as well if interested.  @MindVirus_Bot

&rey: That's offtop for this chat. I'd recommend searching @devs; your question seems not well-suited to that chat either, though mods there might have another opinion. (reply to 99725)

Fyz: Ok thanks (reply to 99727)

TKAINU: I created an interface for users to interact with smart contracts, so how can I estimate the most accurate amount of gas fees to save users, thank you.

I'm: Hi bro, I call api from localhost and get error about "cors" . Can you help me? Thank you so much

Testarudo: try to add the allow cross origin header to your request (reply to 99733)

Moein: We just switched to a whole new domain and ton connect was working and after 2-3 hours it stopped working 🙁 We have no clear indication of why we are being blocked constantly

Moein: I understand Ton wants to protect the users but it’s hurting legitimate apps by these automated blocks

Moein: Our app is t.me/DropeeBot/play

Nguyễn: Who can explain me TON stands for ?

&rey: Sharing the underlying TMA link or logs would be more helpful for debugging. Also, I'm not sure your app is blocked. (reply to 99740)

Greg: the TON network is stopped, probably why (reply to 99740)

User<5947668013>: Are tonplay DOWN ?

I'm: hi, it is not work bro (reply to 99734)

Greg: anyone have any updates on the stoppage? last update was 14:10 for validator action, and seems it didnt work

Greg: if there is a channel/warroom for this effort please invite me

Adapt: Network has just restored. It will take some time to recover I guess but transactions should be minted finally 🤞  To see the network status you can check https://tonscan.org/blocks. If new blocks are created then network is up and running even if transactions are slow. (reply to 99760)

Greg: Local validator out of sync: 7 s confirmed! woooo

Greg: is stable_testnet expected to fix the root cause of slow blocks? (reply to 99762)

Novikov Kirill: guys, who has a guid, how to deploy a site on ton dns?

User<7453272423>: What do you mean?? (reply to 99767)

Novikov Kirill: how do I deploy a website with a .ton domain (reply to 99769)

User<7453272423>: I never heard that .ton domain (reply to 99771)

User<7453272423>: Maybe your mean is telegram mini app

Novikov Kirill: I think I got it right...

User<7453272423>: Give me link info (reply to 99774)

Novikov Kirill: dns.ton.org (reply to 99776)

User<7453272423>: that's the use for crypto wallets, not websites. (reply to 99777)

Novikov Kirill: https://docs.ton.org/develop/dapps/tutorials/how-to-run-ton-site (reply to 99778)

Novikov Kirill: isn't that it?

— 2024-08-29 —

yarik: Hello @Gosha

???: your site with .ton domain can't be opened from browser,for  .ton domains sites need a ton proxy,also u can't open .ton site from telegram web app,but i think it is just a time problem,soon Durov do this Currently,u can connect ton proxy to your website or telegram,but it is not used many. (reply to 99771)

igna🍅: Hello toonkeper im have 50 hours and no give my tons, i buy in app, incredible man are frustated.

Metalgear: Anyone knows about TON Bonus bot in telegram?

pid | ton: u can open website without proxy, use ton search engine https://ton.run (reply to 99797)

Metalgear: I mean, https://t.me/TonClaimbonus_bot

TKAINU: I created an interface for users to interact with smart contracts, so how can I estimate the most accurate amount of gas fees to save users, thank you.

Metalgear: Is it a scammer bot? (reply to 99810)

ㅤㅤㅤ ㅤㅤㅤmamad: Yes the bot is scammer never go to those bots (reply to 99812)

Metalgear: Btw, which TON wallet is the best for use? (reply to 99816)

Vincent: hi there, I found we can use user-address and jetton-master address to query user-jetton-address with      async getWalletAddress(provider: ContractProvider, owner: Address) {         let res = await provider.get('get_wallet_address', [{ type: 'slice', cell: beginCell().storeAddress(owner).endCell() }]);         return res.stack.readAddress();     }  but can I do it offline? Is it possible to calculate by initcode of the jetton-master and the user-address? is this jetton-wallet pre-determined? Thank you my bosses.

ㅤㅤㅤ ㅤㅤㅤmamad: Tonkeeper  Bingx  Trustwallet  Telegram wallet (reply to 99817)

ㅤㅤㅤ ㅤㅤㅤmamad: The best wallet Ton (reply to 99819)

Alver: Hello, im totally new developing for telegram, i would like to create mini apps using the TON network, what do you recommend me to learn first? do you have any link to start with?

arvindpunk: How can we add an account name in tonviewer? (my apologies if this the wrong place to ask)

User<6576297005>: I am proficient with AI/ML, UX/UI, frontend, telegram bot,miniapp and smart contract writing and integration. If you are in need ofdev, let me know.

Nxrix: those names are only for tonviewer and other websites that are similar and is used to show important addresses to avoid confusion (reply to 99826)

Nxrix: mostly used for exchanges (reply to 99828)

Nxrix: if you really need to have one you can ask the tonviewer support I think there was a page for that

arvindpunk: makes sense, I noticed that it also uses a telegram username/domain name if that address has the relevant nft for it - I'll check in with their support, thanks! (reply to 99830)

Alver: for the moment i will go to sleep, i will ask you some things tomorrow, thank you (reply to 99827)

Hung: Hello guys, I have a question is it possible for me to get the latest transaction hash of the current contract using tact?

TON Bounty Bridge: ​Upgrade Misti with Advanced Tact Detectors  🏷 Developer Tool  Summary:EnhanceMistiwith more powerful Tact detectors to promote security best practices in the ecosystem.  Rewards: • 10,000 USD in TON equivalent.  Created by jubnzv

Fanny: hi guys is there anyone who have token minting, pool adding, and first buying script?

User<7236462253>: Transfer funding from yesterday but now still pending 😭😭

White R: Hi everyone, I completed the course but still haven't received the SBT. It's been 4 days already, has anyone encountered this problem? How long should I wait, approximately?

Chaincode: Does TON jetton have the permit function of ERC20?

Joel: No (reply to 99848)

Andy: https://docs.ton.org/develop/data-formats/block-layout  Does anyone know what the key block in the TON block layout means, and does anyone know how to find out which parent shardchain of a specific shard ?

Moein: Thanks for answering! The domain is webapp.game.dropee.xyz We are almost sure it’s blocked cause we had the same error with the previous domain, we switched to a new domain and tested with 3 different mobile and it was working. Then after 2 3 hours we tested again with our phones and couldn’t connect anymore (we did no change in that 2 3 hours) The error is exactly as described in this issue: https://github.com/ton-connect/sdk/issues/226 (reply to 99745)

Chaincode: if I permit user to claim some jetton on contract, how do I do? (reply to 99850)

S.P.Pandiarajan: Hi

S.P.Pandiarajan: testnet toncenter /api/v3. This request shows 503 service not available

zhuohong: Hi, I have a question about developing a contract. A user sends 1 TON to my contract, but the total value of the TX will be slightly greater, say 1.1 TON, to cover the gas fee. I can’t determine the actual gas used in advance. If the gas fee ends up being 0.01 TON, how can I return the remaining 0.09 TON to the user?

&rey: send_raw_message(<to user with value 0>, 64) Though if you want message to cover storage fee as well then task is harder. (reply to 99864)

zhuohong: I want to keep 1 TON in the contract. If I use send_raw_message with mode=64, all 1.09 TON will be sent back to the user (reply to 99865)

Prince: @pcrafter , should @zhuohong know about bounce and unbounce? (reply to 99865)

&rey: Then raw_reserve is for you. (reply to 99867)

&rey: — Receives 1.1 TON — raw_reserve(1 TON, 4) — send_raw_message(0, mode = 128)

G: Hey, I have a question, I got a boc string after sendTransaction. is it possible that convert the boc string to inMessage object? like this  {   info: {     type: 'internal',     ihrDisabled: true,     bounce: true,     bounced: false,     src: EQAr_cIGwK2RGijcP9Iv1nmPag0NWS16FIPIDlero8VuvnVE,     dest: EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7,     value: { coins: 100000000n },     ihrFee: 0n,     forwardFee: 266669n,     createdLt: 48543702000002n,     createdAt: 1724033771   },   init: null,   body: x{} }

S.P.Pandiarajan: Hi, does anyone know why testnet toncenter api/v3 service not available ?

&rey: Well, that's outMessage... do you know user's wallet version? (reply to 99873)

G: wallet_v4r2 (reply to 99875)

Hoàng: Hi . Can i ask a question ? can be a message was sent success but seqno not increase after wait infinity ? How can i catch this issue ?

&rey: Well, external messages (to your wallet) do not have guarantee of delivery.  You should retry sending with the same seqno (once per 10s is fine); when you receive error resulting from invalid seqno, you know that something has been sent. (You may also check whether it was the order you wanted.) (reply to 99879)

Hoàng: thanks sir , im writing a script to send TON like this code , but i think if validator miss my message , this loop wait seqno increase will be infinite . Now i just send another same message instead of waiting ?      const walletContract = client.open(wallet);       const seqno = await walletContract.getSeqno();       console.log(seqno);         await walletContract.sendTransfer({           secretKey: key.secretKey,           seqno: seqno,           messages: [             internal({               to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",               value: "0.09", // 0.05 TON               body: "Hello", // optional comment               bounce: false,             }),           ],         });         let currentSeqno = seqno;         while (currentSeqno == seqno) {           console.log("waiting for transaction to confirm...");           await sleep(1500);           currentSeqno = await walletContract.getSeqno();         }         console.log("transaction confirmed!"); (reply to 99880)

Kapil: How to verify jetton token

Gunnar: you call the get_wallet_address on the jetton-master contract, passing in the owner, and check that this corresponds to the owner the wallet reports through get_jetton_data method (reply to 99888)

Fong 🇻🇳: Hi everyone, I am deploying a TON full node and using TON-HTTP-API to communicate with it. However, my full node is not yet synchronized with the latest block on the TON network. Can I use TON-HTTP-API to retrieve data from the syncing full node immediately, or do I need to wait for the full node to fully synchronize with the latest block on the TON network before retrieving the data?

Fong 🇻🇳: Thank you very much for your response 🙏, currently, i am facing this problem when i try connect TON-HTTP-API to my TON full node (not yet synchronized with the latest block). Do you have information about this error? (reply to 99894)

Saint: Why is token table saying it's still busy. ?

&rey: It is: https://tonscan.org/blocks — last block I seen is at 11:29:50. (reply to 99901)

Hyipto: Hello everyone

Hyipto: I'm new

澀谷工程師: you could monitor the dest address , will it receive the transfer notification (jetton notify) (reply to 99888)

&rey: Welcome to development on TON Blockchain! (reply to 99911)

Hyipto: Nice

Hyipto: I have some question about TON Token

Hyipto: Who are freely for answer me?

Fazzi: Hey bro news urgent help (reply to 99914)

Hyipto: 😕

&rey: The formulation of question already seems strange... well, let's go. (reply to 99916)

Razak: Hi

Fazzi: 7d242c90208e4900d38ced184efdcacaf5b81e0beb947555a91ba1fc64eeccfd   I claim my dogs token on 27th August but still didn't receive here is my txn hash @pcrafter (reply to 99922)

Razak: I am an Ai and blockchain developer and looking for new position

Hyipto: https://minter. Ton. org/

Hyipto: This also use for create token?

&rey: There was some error in message you sent. I'm not familiar with claim process, actually. (reply to 99927)

Hyipto: But coding and that way are same result?

Fazzi: So who can help me (reply to 99932)

Fazzi: 48 hour gone bro i claim my dogs token my ton also cut but didn't receive my dogs token

&rey: Coding new jetton yourself might be error-prone (though not necessarily, it's quite easy!) but more friendly in terms of fees than default ones. (reply to 99933)

Nerses: what is the best approach to track transaction sucess ? Lets suppose I have smart contract and every time it receives message is done some operation based on that message,or fails if something is wrong in message.I dont emmit any event(as in TON it is useless).I cant figure out the flow how I should track the succesffull messages and be sure that for certain message the needed operation is done

Fazzi: So they will not give me my ton or claim token ?? (reply to 99938)

&rey: Watch exit code of computation+action phase. (reply to 99937)

Hyipto: so i have 1 question, now i create that token on minter .ton .org website and continue to develop it in code is that ok? (reply to 99936)

Laisky: I've noticed that sometimes Tonkeeper indicates a transaction will fail, but when I go ahead and approve it, the transaction ends up succeeding.

Hyipto: I want starting simple (reply to 99942)

Fazzi: Who can help me bro can you tell me after 48 hour still waiting for my token (reply to 99941)

&rey: Your transaction tree has failed; it won't result in DOGS being claimed anymore. I'm not certain if you can retry claim using the TON already locked. (reply to 99935)

Moein: Can anyone please point me to the right place to for a review? 🙁 (reply to 99852)

Fazzi: How much time it will take ? (reply to 99947)

Nerses: for example in this tx https://testnet.tonviewer.com/transaction/d4777a90088fc85dcd8e205391b3c54fbfe098c3db53f1c50b59050ce85e961c .Where I am A which ones phases success I should check ? as my needed operation is done when party D receives D. More detailed should I check strating from tx A all its childs succes and after it reach to D or there is shorter way ? (reply to 99941)

&rey: Please cease saying false information. TON already works, actually. (reply to 99951)

Fazzi: But network working fine currently I guess (reply to 99951)

Fazzi: Who can help me any idea ? (reply to 99952)

Fazzi: Yeah I saw on tonscan their team is not replying how can they avoid users issue (reply to 99955)

&rey: (The contract indicated B on the scheme seems like it supports claiming again! I'm not sure what message should be used, though.) (reply to 99946)

Fazzi: I claim 3 times bro same issue happened on other wallet (reply to 99958)

Fazzi: Just tell me who can help me

Fazzi: All txn are confirmed but same thing happened didn't receive my dogs idk what's going on in ton blockchain

Fazzi: These all are dogs txn bro (reply to 99968)

&rey: Idk what the hell was the app where you attempted to receive DOGS doing. (reply to 99967)

Fazzi: It's ton keeper bro (reply to 99972)

Hyipto: @pcrafter (reply to 99942)

Laisky: 😳

&rey: You shouldn't do so. You'll eventually get two distinct jetton systems and will ask "how to convert one jetton into another". (reply to 99942)

Hyipto: Ohh so coding and do on web are two system different right? (reply to 99977)

Hyipto: Okay thanks

Hyipto: So which software use for develop token?

&rey: Notepad++ or like? Excalidraw or something that can show message chains, as well.

Hyipto: Program for deploy

&rey: Anything you'd like? toncli, @ton/blueprint, even web-based deploy (Nujan supports that IIRC). (reply to 99983)

Vincent: cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {   return begin_cell()           .store_uint(0, 2)           .store_dict(jetton_wallet_code)           .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))           .store_uint(0, 1)          .end_cell(); } in funC, the store_dict only contains one param. but I think a dict at least contains two params which are key and value. Am I right? in local, I found in ton-sdk the store_dick contains at least two params.

Hyipto: How to add ton testnet on tonkeeper wallet (reply to 99984)

&rey: Get from faucet https://t.me/testgiver_ton_bot. (reply to 99989)

Hyipto: Mean me where it showw

Hyipto: On wallet

&rey: Go to dev menu. Exit dev menu. Add new testnet wallet with DIFFERENT mnemonic from mainnet. (reply to 99991)

Hyipto: Dev menu where sir

Hyipto: Ahh i seen thanks

澀谷工程師: the params type Dict include (k, v) in the data structure, so you don’t need  two params for key and value in the lib @ton/core i see the line      storeDict<K extends DictionaryKeyTypes, V>(dict?: Maybe<Dictionary<K, V>>, key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): this; so you just need to inject params dict (reply to 99988)

Joel: Theres no way to do it using the standard jetton spec. You need to create your own fork of the jetton contract to do that (reply to 99854)

Fazzi: Any other ton dev or blockchain expert who can help me? (reply to 99994)

Joel: @pcrafter is the best one I know 🤔 (reply to 100000)

Joel: he answers all qs in this channel lol if youve been around here for some time

Fazzi: He was not friendly for dogs claim (reply to 100001)

Nerses: How i can get public key from address on chain using TACT ?

Joel: lol bruh what dis dev chat. you gotta ask somewhere else if you wanna talk how to deal with your meme coin matters (reply to 100004)

Joel: You mean public address or public key? (reply to 100005)

Fazzi: They said ask ton dev or ton comment support (reply to 100006)

Nerses: public key, which will be used to verify signature (reply to 100007)

Razak: I am an Ai and blockchain developer and looking for new position

Nerses: the purpose of it is to be sure that signture belongs to certain address. so i wanted to get pub key from that address and pas it as parameter to checkSignature. I guess there will be other approaches as well to directly do that check (reply to 100007)

Razak: I m proficient in dex, wallet development, real estate tokenization, DAO, NFT marketplace, GameFi, uniswap forking, meme coin launching, coin sniper bot, arbitrage trading bot, sandwitch bot, flash loan, telegram and discord bot, liquidity management system, pool tracker, staking, farming and Pump.fun forking.

Prince: so? what do you mean? (reply to 100012)

&rey: I attempt to stand for reality. If reality allows you to put an expired domain to auction, I can help with that. If it indicates that buying tokens failed in a way I don't understand, I can only state so much. (reply to 100004)

Nerses: is it possible to check if signature belongs to certain address ?

TON Bounty Bridge: ​Python library for automated trading on Stonfi DEX  Summary:Develop a Python library for performing automated trading operations on Stonfi DEX  Rewards: • SBT Bounty Reward • 2000 USD in TON  Created by seriybeliy11

Kapil: function builder_null? undefined how to remove this error

Dario: define builder_null? function (reply to 100026)

Kapil: Is it not present in stdlib (reply to 100029)

Hyipto: I can deploy token on testnet?

31dzairy: Hey guys! Rookie question. Sended memetokens from ton space to the core wallet that only show ton btc etc. adress shows the tokens but I can’t send them via wallet. What can I do? Sorry for disturbing

31dzairy: Ai support bot brought me here ✌️

Dario: https://github.com/ston-fi/funcbox  its in funcbox int builder_null?(builder b) asm "ISNULL"; (reply to 100030)

Nerses: how to get address from publickey in TACT ?

Sami: Hello, I have created a smart contract for an NFT collection, and yesterday, when there was an issue with the blockchain network, I made several transactions. These transactions were not successful, and the TONs used in these transactions for minting NFTs have not been received in either the collection owner's wallet or the buyer's wallet, and no new NFTs have been minted. How can this issue be resolved? Is there any way to recover these funds? If they can be recovered, what is the solution?

Fazzi: Their admin saying contact to ton team , ton team saying contact to dev that's I am really frustrated 😐 (reply to 100022)

Nathan: does the telegram wallet have testnet?

Pandemoniuz: Is anyone else experiencing troubles with tonlib failing with this? [ 0][t128][2024-08-29 11:29:28.713652567][ThreadLocalStorage.h:62][!LastBlock]  Check `0 <= thread_id && static_cast<size_t>(thread_id) < nodes_.size()` failed  Haven't changed binaries for several weeks (since last august release), and a few hours ago this started to happen

unreadyplayer: Guys any ideas.   We submitted our app through and just got a msg saying it had been rejected. No feedback, nothing.   How do we find out why it was rejected?

Kapil: After deploy a new auction for a specific nft . When I am trying to change the owner to nft sale auction .the data is not able to save to the blockchain .

Nerses: is it possible to check that signiture belongs to certain adress ? or any function that can return from address public key or reverse ?

User<6753518952>: Is there anyone looking for func and tact dev?

Leonid: Hello guys, I'm building mini app with backend on Kotlin. And have a question: where do you usually deploy backend written in JVM language?

J.: Hello all I am looking for help and some good examples of a reshare program built into a dapp on ton.   Anyone have one they can recommend or show me?

Prince: no good opensource on ton, sorry (reply to 100059)

User<7127693727>: hi, how to parse op, and how i can store slice in variable?

User<6753518952>: yh sure (reply to 100063)

User<7127693727>: like slice addr = "address"a? (reply to 100062)

User<6753518952>: how can I help you? (reply to 100063)

Kapil: https://testnet.tonviewer.com/transaction/3207b116d10741175c441095006993bb1a3a2d72f4c545214f0ccf14b2ab4a15

Kapil: how to resolve the error in above tnx

Nerses: how can  be implemented such function in TACT function recoverSignerFromSignature(uint8 v, bytes32 r, bytes32 s, bytes32 hash) external {     address signer = ecrecover(hash, v, r, s);     require(signer != address(0), "ECDSA: invalid signature"); }   or is it even possible ?

Kapil: I know that but how i can resolve it (reply to 100069)

Nerses: Is it possible to verify on-chain that a signature was made by a specific address on the TON blockchain? If so, how can it be done?

Andrey: Hello everyone Has anyone encountered a Property error 'Buffer' doesn't exist. using the @ton/ton library in new versions of React Native?  This error occurs even when global.Buffer = Buffer is set;

Prince: yeah, it seems webpack problem and I solved (reply to 100074)

Dmitry: It's possible using asm "ECRECOVER". Note that v should be 0...3. ethers.js use 27+ rec_id, you need to skip that 27 prefix (means "uncompresed signature") (reply to 100070)

Dmitry: Then you get a public key and it's possible to derive a 20 bytes evm address from it to make a comparison (reply to 100076)

Andrey: Oh, would it be difficult for you to tell me the solution? Please, as I understand it, the library will not be updated soon( (reply to 100075)

Nerses: is there such analog for TON blockchain ? (reply to 100076)

Nerses: to be sure that signature belongs to certain address ?

Dmitry: I just told you 😅 Google "TVM instructions list". There's a low level TVM call for this. It's not in the stdlib of FunC

Nerses: https://docs.ton.org/learn/tvm-instructions/instructions#:~:text=F912-,ECRECOVER,-hash%20v%20r  i found it (reply to 100081)

Nerses: could you please share any material where I can see how fift is used in TACT lang ? (reply to 100081)

Sami: 🙄 (reply to 100038)

Sami: transaction/ad24e5fdd30566544f3439dab225c502cfec43ac79869b38a6e16364e228d04c (reply to 100038)

Nerses: is this correct func code to use tvm instruction ecrecover (int, int, int) ecrecover?(cell hash, int v, int r, int s) asm(hash s r v) "ECRECOVER";  ?

Nerses: from signiture publicKey can be derived using TVM instruction call ECRECOVER .Has anyone such experience using it in TACT ?

Nick: Can some one tell me which should be used. I creating Jettons that will be listed on exchanges, should they be on or off chain for this?

Санчо Пансо: Hello, does anyone know how convert Cell into Dictionary correclty with @ton/ton and TS?

D: Yes, I know (reply to 100114)

D: in @ton/ton, there is Dictionary and DictionaryValue

.: Hi  Can I deploy smart contract on wallet in Ton? For example deploy my smart contract on my wallet with seed phrase ?

.: Or every smart contract need have address with "hash" of code ?

Санчо Пансо: Yeap, I tried to write the fc  .store_dict(jetton_wallet_code)   as       const dict = Dictionary.empty(Dictionary.Keys.Int(2), Dictionary.Values.Cell());     dict.set(1, JETTON_WALLET_CODE); (reply to 100115)

&rey: Your wallet is already a smart contract, you cannot deploy another one over it (unless you know how to invoke SETCODE, but then you'll be unable to use it as wallet).

Санчо Пансо: but I have that, seems that I'm doing something wrong with key, but I tried everything (reply to 100115)

&rey: Well, looks right. (reply to 100122)

.: A okay  Another situation  I have seed phrase and address  I never do any transactions  I don't have smart contract of wallet v4 or v5  Can I deploy other smart contract ? (reply to 100121)

&rey: This pretty much implies that you have wallet of some kind. Yes, you can deploy anything. (reply to 100124)

Санчо Пансо: yeap, but overall hashes differs because of a key, C_ vs 66_  I tried 1 as written on store_dict documentation, but it's not helped (reply to 100123)

&rey: const fc = beginCell().storeMaybeRef(dict).endCell() (reply to 100119)

Санчо Пансо: thanks, it works now! But, how do you know that I should use storeMaybeRef? (reply to 100128)

&rey: .storeMaybeRef == .store_maybe_ref in FunC == .store_dict exactly. (reply to 100129)

Санчо Пансо: Are there any docs where I can read more about it? Would be very grateful (reply to 100130)

Nerses: but can actually this be used for ton signatures ? (reply to 100076)

Shon: Released an update for the python libraries pytonapi and tonutils.  Added a wallet v5r1 and an example of the implementation of gasless transactions.

Martin_devTeam: nano-TONTAX na pełne jednostki TTAX                      const tontaxBalanceInUnits = parseFloat(TonWeb.utils.fromNano(tontaxBalance));                        tontaxBalanceResult.textContent = Saldo TONTAX: ${tontaxBalanceInUnits.toFixed(1)} TONTAX;                  } else {                      tontaxBalanceResult.textContent = 'Nie udało się uzyskać salda TONTAX.';                  }                } catch (error) {                  console.error('Błąd podczas odczytywania sald:', error);                  tonBalanceResult.textContent = Wystąpił błąd podczas sprawdzania salda TON: ${error.message};                  tontaxBalanceResult.textContent = Wystąpił błąd podczas sprawdzania salda TONTAX: ${error.message};              }          }      </script>  </body>  </html>

Martin_devTeam: Can you help me figure out what to fix so that the code correctly reads the TONTAX value? My code correctly returns the TON value for an address, but it doesn't return the TONTAX value. Thank you in advance!

Martin_devTeam: body>      <div class="container">          <h1>Sprawdź saldo TON i TONTAX</h1>          <label for="tonAddress">Podaj adres TON:</label>          <input type="text" id="tonAddress" placeholder="Wpisz adres TON">          <button onclick="checkBalances()">Sprawdź saldo</button>            <h2>Wynik:</h2>          <p id="tonBalanceResult">Saldo TON zostanie wyświetlone tutaj</p>          <p id="tontaxBalanceResult">Saldo TONTAX zostanie wyświetlone tutaj</p>      </div>

Nerses: as TVM instruction ECRECOVER returns 4 Int from which first 3 are parts of address,should I store them in Cell and then read all at once as Address ?

Martin_devTeam: I'm checking it now... I'll get back to you if something doesn't work. (reply to 100152)

▪️ 🍅 TOMATO 📦 Bums 🐾: 5 PUSHINT, s0 s4 XCHG). Stack registers are denoted by s0, s1, ..., s15. Other stack registers (up to 255) are denoted by i s() (e.g. 100 s()). Control registers are denoted by c0, c1, ..., c15.

Nerses: thanks a lot (reply to 100156)

&rey: Please note that you can get public key at most, not address. (reply to 100152)

Martin_devTeam: DM... ? (reply to 100152)

Carter🧹: Was there a TON node update recently? My indexer is failing many blocks after 39939170. Deserializing InMsgs on BlockExtra

Razak: I am an ai and blockchain developer and looking for new position

Nerses: yup.much more comfortable will be (reply to 100162)

Martin_devTeam: ok DM (reply to 100167)

Nerses: isnt there any other way ? as i want it to just verify that signiture belongs to certain person from my list whose only addresses I have (reply to 100160)

&rey: You could ask them to pass their index in your list somewhere along, so you could load appropriate... public key, of course, not address! and then validate signature. (reply to 100169)

▪️ 🍅 TOMATO 📦 Bums 🐾: Nice to see

Nerses: let me give more context.In my architecture user do first transaction for second one that should be done from his side LP gets its signiture and do insetad of him.so i need to verify on chain that it is the user who did first tx and i have onbly addres of him (reply to 100170)

Carter🧹: Does anyone know when msg_envelope_v2#5 was added to the chain?

&rey: Probably git blame is the fastest way to check. (reply to 100173)

Carter🧹: Okay 27th June it was commited to the TLB, is there a location where I can subscribe to proposed/planned changes to the blocks structure?

Carter🧹: Luckily I updated my node before this change was switched on

&rey: Critical updates to nodes are published in https://t.me/tonstatus — as validators need to use the same structures. (reply to 100177)

Carter🧹: How have they changed the type of OutMsgQueueInfo? Surely previous blocks will fail to deserialize as they change what used to be a HashmapE into a HashMapAugE.

127.0.0.1: (.venv) PS C:\Users\localhost\Desktop\about tele\ton-dev> toncli start wallet INFO: 🥰 First time run - i'll create config folder 4you and save some stuff there INFO: 🤖 Check all executables are installed... WARNING: 🤖 Can't find executable for func, please specify it, e.g.: /usr/bin/func Path:  anybody know how to solve?

127.0.0.1: thanks,  i will try to use WSL & docker (reply to 100187)

User<908006178>: What are the addresses for Mainnet?

User<908006178>: yes (reply to 100193)

User<908006178>: thanks (reply to 100197)

Tomi: I’m in need of a dev who can work with me on a project.   Please contact me in DM if you want to work together. Thank you

𝑅𝑒𝑧𝑎: Dome dm (reply to 100199)

Andrey: https://dton.io/api/address/<ADDRESS> https://dton.io/api/address/EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT  Also good (reply to 100197)

Micheal: Hey Anyone know how can i generate signature?

yato: that is different depending on networks (reply to 100205)

Micheal: Ton 🧐 (reply to 100206)

KingHippo|CryptoGuns: Does anyone know if there's a channel for teams looking for devs? My team has fallen apart as it happens, but I am enjoying making tg games and apps and would like to stay in the ecosystem

Micheal: Pls help me (reply to 100205)

yato: pls dm me (reply to 100208)

Tomi: Send a dm (reply to 100208)

Санчо Пансо: Hey, sorry to ping you again, but I'm stuck while calculate_jetton_wallet_address offline  slice calculate_jetton_wallet_address(cell state_init) inline {   return begin_cell().store_uint(4, 3)                      .store_int(CUR_WORKCHAIN, 8)                      .store_uint(cell_hash(state_init), 256)                      .end_cell()                      .begin_parse(); }   I check CUR_WORKCHAIN === 0, cell_hash(state_init) the same as a TS code, the only thing - I haven't .begin_parse(), but the addresses are different, it seems that there are no difference in code, what might be the problem? (reply to 100130)

Jenya: const context = beginCell()     .storeUint(0, 1)     .storeUint(2147483409, 31)     .endCell().beginParse().loadInt(32);  let data = beginCell()     .storeUint(1, 1) // is signature auth allowed     .storeUint(0, 32) // Seqno     .storeInt(BigInt(-239) ^ BigInt(context), 32) // Wallet id     .storeBuffer(keyPair.publicKey, 32)     .storeBit(0) // Empty plugins dict     .endCell();  const stateInit = { code, data }  const rawTransfer = walletContract.createTransfer({     seqno: seqno,     secretKey: keyPair.secretKey,     messages: [internal({         to: destinationAddress,         value: amount,         init: storeStateInit(stateInit)     })] });  const externalMessage = beginCell()     .store(storeMessage(external({ to: destinationAddress, body: rawTransfer })))     .endCell().toBoc().toString('base64');  How to deploy w5 wallet? I keep trying with stateInit, but it still throws error 406 Not Acceptable

Saurabh ∎: Hi I'm facing a problem with the overflow scroll in react next app, it works on any browser outside the telegram mini app environment

User<6753518952>: is there anyone looking for blockchain dev?

Andrey: Has anyone encountered a Property error 'Buffer' doesn't exist. using the @ton/ton library in new versions of React Native?  This error occurs even when global.Buffer = Buffer is set;

User<6753518952>: If you need my help,plz DM me (reply to 100231)

&rey: Please try accessing Buffer in browser console. (reply to 100231)

Andrey: It works in the console. the thing is that the buffer is defined as global.buffer and it seems that this library does not want to see it in new versions of React Native( (reply to 100233)

Đu đỉnh quen rồi🌱: can anyone help me?

luis: i send a transaction and i get a bocCell then i get bocCell.hash and i do bytesToHex.. How can i find this hex on the ton scan?

Anton: Can somebody explain why TON has 0.10$ fee for token transfer? What a joke... How I can decrease that price

Anton: Total: 0.013204259 TON

Anton: if I will send 4-10 messages by one transaction it better or difference isn't huge?

Nikita: Hi all, is it possible to store NFT Item attributes onchain? If so, how is it possible to collect them? I tried with the standard method from the example, but it doesn't work. I'm trying to shove an object into it like this

Nerkrkririei I Think I Need A It's A: why do I get a lot of these exceptions on clientside:  [TON_CONNECT_SDK_ERROR] cH\nTransaction was not sent sometimes it works, sometimes it doesn't

Jb: Hello is there any encoding/decoding methos available in tact?

User<7127693727>: hello, how to change contract code?

User<7127693727>: hello, how to store address in slice?

— 2024-08-30 —

Lisa: It’s not bad (reply to 100253)

jojo: how to get events from a deployed contract. Which js sdk method I can use?

Jenya: const code = walletContract.init.code; const data = walletContract.init.data;  const stateInit = beginCell()     .store(storeStateInit({ code, data }))     .endCell().toBoc().toString("base64");  const rawTransfer = walletContract.createTransfer({     seqno: 0,     secretKey: keyPair.secretKey,     sendMode: 3,     messages: [internal({         to: walletContract.address,         value: toNano('0.1')     })] });  const externalMessage = beginCell()     .store(storeMessage(external({ to: walletContract.address, init: stateInit, body: rawTransfer })))     .endCell().toBoc()  Error: cannot apply external message to current state : External message was not accepted

JT: Hey all,  I have a question regarding the Payment Handler. In EVM, one contract can be implemented a logic to handle as Payment Handler: receive a payment, split payment then transfer to multiple accounts. Once success, contract can call another contract to mint the NFT ticket. As I researched, TON has a different mechanism and architecture. Fungible and Non-Fungible Token consists of two contracts: Jetton Minter and Jetton Wallet. In transfer between wallets, identity will be validated by checking original_sender + jetton_wallet_code + jetton_master === sender_address. Therefore, sending a transfer logic from Payment Handler will likely fail.  Please tell me the pattern to achieve the same things as EVM in TON  Many thanks

TKAINU: Hello, I consulted some smart contracts, and in the code to receive notifications, there is a paragraph:          (int transferred_op, slice token_wallet1) = (ref_ds~load_uint(32), ref_ds~load_msg_addr());  But I checked in the submitted code that the wallet contract does not have the transferred_op data added, so where does this transferred op come from?

lv: err  reason is：aut of gas。 (reply to 100067)

Kapil: How to resolve it (reply to 100308)

JT: Anyone can answer? (reply to 100302)

Haint: you only need a destination wallet address to transfer jettons (reply to 100302)

JT: EVM Payment Handler can resolve split payments, then call to mint NFT in one single call (a.k.a transaction). I just want to know whether I could do the same thing in TON (reply to 100311)

Haint: No, each transfer is a separate transaction (reply to 100314)

Haint: You can have a contract that interact with other contracts but each operation is still a separate transaction. It does not work like any other blockchain.

Alfred: What do you mean by split payments? (reply to 100314)

Alfred: If it's similar to addLiquidity, which the user needs to provide one token and then another, I think it's can be implemented.

JT: Partial failure handling is a problem. I can write script that ask users to sign 3 txs and transfer jetton tokens to 3 destination addresses. Once receiving 3 confirmations, off-chain client can send a transaction to mint NFT. However, how to handle when 2nd/3rd jetton transfers are failed? (reply to 100315)

JT: here's a detail description: (reply to 100317)

Haint: Read stonfi contract. They implement a similar function to add liquidity (user needs to transfer 2 assets in 2 transactions) (reply to 100319)

Alfred: Yeap. Check stonfi, you need to contract to record which is transferred.

JT: It's pretty common to split one payment into multiple destinations in EVM. Buyer purchases the NFT and make a payment. Partial of the payment go straight to the Seller, whereas a fee will be transferred to the Exchange. Once done, NFT can be minted or transferred to Buyer

Haint: You'll have to make sure all the transfers will success before executing on your contract. I admit sometimes it's a difficult problem but there's no other way, since you cant revert the state after you send the jettons (reply to 100323)

Haint: For example in stonfi at the last stage of swapping (transfer the tokens to the user) they just ignore the result of the transfer, because you cant do anything at that point.

sangmin: If synchronization suddenly doesn't work, what should I suspect??

Đu đỉnh quen rồi🌱: ? team dev Ton (reply to 100240)

Санчо Пансо: Hello, I have calculate_user_jetton_wallet_address and I try to get address offline, I've check every argument, the stateInit hash is the same, but result address from contract and calculated offline are different, what might be a problem?

Санчо Пансо: const JETTON_WALLET_CODE = Cell.fromBoc(         Buffer.from(             'THERE IS ACTUAL HEX CODE',             'hex',         ),     )[0];      const JETTON_MASTER_ADDRESS = Address.parse(contractAddressString);     const USER_ADDRESS = Address.parse(userAddressString);      const USER_ADDRESS_CELL = beginCell().storeAddress(USER_ADDRESS).endCell();     const JETTON_MASTER_ADDRESS_CELL = beginCell().storeAddress(JETTON_MASTER_ADDRESS).endCell();      const userJettonWalletData = beginCell()         .storeSlice(USER_ADDRESS_CELL.asSlice())         .storeUint(0, 8)         .storeUint(0, 64)         .storeSlice(JETTON_MASTER_ADDRESS_CELL.asSlice())         .storeRef(JETTON_WALLET_CODE)         .endCell();     const jettonWalletStateInit = beginCell()         .storeUint(0, 2)         .storeMaybeRef(JETTON_WALLET_CODE)         .storeMaybeRef(userJettonWalletData)         .storeUint(0, 1)         .endCell();     const resultAddress = beginCell()         .storeUint(4, 3)         .storeInt(0, 8)         .storeUint(BigInt('0x' + jettonWalletStateInit.hash().toString('hex')), 256)         .endCell();  const address = new Address(0, resultAddress.hash()) (reply to 100330)

Санчо Пансо: oh, okay, and how I should correctly transform Cell format into Address? UPD: resultAddress.beginParse().loadAddress(); working fine, thank you a lot! (reply to 100330)

Санчо Пансо: thank you, also works! (reply to 100334)

sangmin: Is it possible to block my node from public node?

sangmin: My node is out of sync.....

&rey: from user, presumably (in forward payload) (reply to 100303)

Денис: Please help me, I have uploaded the contract to the test network. Am I writing a script for online testing and I can't connect to the contract to call the get method?  const client = new TonClient4({ endpoint }); const addressContract = Address.parse("EQBgwr_PtCc0oTo9ARdXbnWd5wXixybtDJYnQ3nshp47N2o-") const lastBlock = client.getLastBlock() const matrix = client.openAt(lastBlock.last.seqno, await Matrix.fromAddress(addressContract))

&rey: That's pretty much fair price for transfer at current gas prices. Actually, disregarding whether price is fair, you cannot reduce it except possibly by setting forward amount = 0. (reply to 100254)

Rashi: Hi (reply to 100254)

Kapil: Can anyone share the guidelines for the fee deduction on the ton blockchain

Champer Wu: I observe your contract on tonviewer I see the deployment was failed https://testnet.tonviewer.com/transaction/929a984ea8472cfa71c5e37981d1be0f292fd72bcc4bcdb811c3d6f43e98e8fb (reply to 100340)

Champer Wu: Maybe You should figure out that your boc is correct

Hyipto: Why deploy is errror sir

Hyipto: @pcrafter

🇦🇲RUBEN: Hello, tell me, please. Is there a chat for the CIS?

Dmitry: Есть тон дев чат на русском https://t.me/tondev (reply to 100358)

🇦🇲RUBEN: Thanks (reply to 100359)

nif: Hi Im TON, MiniAPP developer and I am running a tone-based mini app. There is an issue. I implemented wallet connection with TonConnect and it was working fine for a long time, but it has not been working since yesterday.  Now that I have assigned a new domain, it is possible. What should I do if this issue occurs again?

.: Hello Is there a Func logo?

User<7453272423>: Hello, I wanna create a project telegram mini app using vite for frontend. And I want you recomend me technology for backend. I have option: laravel, python, express js.

User<7453272423>: Give me your opinion.

Champer Wu: it depends on your application scale for and the technics you have. (reply to 100369)

Champer Wu: you need to provide context for debugging (reply to 100366)

User<7453272423>: But if I use laravel, can I get the good experience? (reply to 100371)

TKAINU: I tried but received error: Exit code: 9 (Cell underflow) (reply to 100339)

Champer Wu: Will your server interact with TON blockchain? (reply to 100375)

User<7453272423>: yes, but in the future. because I'm still building a startup. (reply to 100384)

Champer Wu: golang or nodejs would be better, the eco-system on these two programming language has rich resources

User<7453272423>: Okay, thank you (reply to 100386)

unreadyplayer: Who can I reach out to about ton.app listing?  Our listing keeps getting rejected even though we've provided all the info.

Ankit j: Once project with bot code is deployed on vercel, do the bot's response works fine ? Or do we really buying the domain from vercel?

User<7453272423>: Maybe you need pay for listing. (reply to 100388)

Champer Wu: I assume the contract you are reading is Jetton contract  the op_code was defined in the op-codes.fc https://github.com/ton-blockchain/minter-contract/blob/main/contracts/imports/op-codes.fc (reply to 100303)

TKAINU: Yes, I want to send a custom payload when calling transfer jetton. The contract that receives the jetton will read the custom payload and process the logic. (reply to 100391)

Champer Wu: Okay, I see So what’s the issue you encountered? (reply to 100393)

TKAINU: i want to send variable transferred_op when sending jetton to my smartcontract, my smartcontract will read transferred_op and make next requests However, when sending the jetton to the smart contract, the transfered_op reading step has an error: Cell underflow (reply to 100394)

TKAINU: my msg transfer:

TKAINU: my logic smartcontract when received jetton:

Champer Wu: let me figur it out

Nikolaj: Hello, is it possible to send messages of arbitrary format to a smart contract and parse those messages as data structures? And what language is most suitable for that purpose, if that is even possible? Thanks.

Sina: after building TON i run ctest but i got an error ! what is this error ? (reply to 100362)

Ankit j: Anyone pls ? (reply to 100389)

Laisky: How can I set the metadata for an NFT? As I understand it, I can retrieve individualContent using the NFT item's get_nft_data method. Then, I can obtain the URL for the NFT metadata through the collection's get_nft_content method.  But it seems not work.  I would appreciate any assistance in clarifying this.  source code: https://github.com/Laisky/HelloWorld/blob/master/blockchain/ton/contracts/nft/contracts/nft.tact  tonviewer: https://testnet.tonviewer.com/kQBq2q2vne2Rl1N18RecCu3Y8RVGsyFAOVPxrNjq43YBaOII?section=nft

Timur: Guys, how can i collect external message to my wallet address  in order to send transfer nft?)  using @ton/core js

Milos: please DM me (reply to 100369)

Nerses: In my smart contract on the TON blockchain, the protocol requires a user to complete two transactions for successful execution. To streamline the process, I've removed the need for the user to perform the second transaction themselves. Instead, during the first transaction, the user provides their signature, which allows an LP (Liquidity Provider) to execute the second transaction on their behalf.  I need to ensure that during the second transaction, I can verify that the provided signature indeed belongs to the user, using only the information available within the smart contract. Although one approach is to store the user's public key during the first transaction, I would prefer a more secure and efficient method, such as leveraging the TVM instruction ecrecover or other techniques to verify the signature's ownership without explicit key storage. What would be the best approach to achieve this?

Nerses: can you explain why the approach of using signature verification might degrade UX by preventing non-wallet smart contracts from interacting with my system? Specifically, why would only wallet smart contracts be able to send transactions in this context? (reply to 100413)

Champer Wu: the Error message: Cell underflow  would be cuased by loading wrong bit , I think it is your loading code make it error, maybe you could check it first. You can preload it and check the value is expected (reply to 100399)

Ankit j: Contact me, if you need a mini webapp complete source code..

Денис: I get a Tuple type response from the contract. How can I process it with the TON library?   {   type: 'tuple',   items: [     { type: 'int', value: 1n },     { type: 'int', value: 11111n },     { type: 'int', value: 1n },     {       type: 'slice',       cell: x{80009154B227BD06D93E7C92821C9716496CA11E8EFC1A8A8381AF4FA8593AE6723_}     },     { type: 'int', value: 20n },     { type: 'int', value: 9n },     {       type: 'cell',       cell: x{CFD}        x{2_}         x{2_}          x{2_}           x{00000000000000000000000000000000000000000000000000000000000000003_}           x{00000000000000000000000000000000000000000000000000000000000000003_}          x{2_}           x{00000000000000000000000000000000000000000000000000000000000000003_}           x{00000000000000000000000000000000000000000000000000000000000000003_}         x{2_}          x{2_}           x{00000000000000000000000000000000000000000000000000000000000000003_}           x{00000000000000000000000000000000000000000000000000000000000000003_}          x{2_}           x{00000000000000000000000000000000000000000000000000000000000000003_}           x{00000000000000000000000000000000000000000000000000000000000000003_}        x{D4_}         x{00000000000000000000000000000000000000000000000000000000000000003_}         x{00000000000000000000000000000000000000000000000000000000000000003_}     },     {       type: 'cell',       cell: x{CFD}        x{2_}         x{2_}          x{2_}           x{2_}            x{}           x{2_}            x{}          x{2_}            x{}           x{2_}            x{}         x{2_}          x{2_}           x{2_}            x{}           x{2_}            x{}          x{2_}           x{2_}            x{}           x{2_}            x{}        x{D4_}         x{2_}          x{}         x{2_}          x{}     }   ] }

WG: You can use its own methods from stack. (reply to 100421)

Nerses: thanks for detailed explanation,really learned a lot from your answers. so the best approach would be to store public key (reply to 100419)

Денис: Error (reply to 100422)

WG: what error do you see? can you share code? (reply to 100425)

Денис: Can I get more details? (reply to 100423)

Champer Wu: The meta data was assembled by collectionContent and item. These two parts are stored in Collection Contract and item contract. Collection contract would store the root path like ipfs://some-hash, and item contract would store the file name item.json. So it would be combined as ipfs://some-hash/item.json You need to check the location of your item.json was uploaded sucessfully to your web storage (reply to 100409)

WG: From this, you can use the methods for the same data type in order. stack.readNumber() stack.readNumber() stack.readNumber() stack.readString() stack.readNumber() stack.readNumber() ... (reply to 100421)

Денис: Property 'items' does not exist on type 'TupleItem'.   Property 'items' does not exist on type 'TupleItemNull'. (reply to 100426)

WG: I mean, source code for retrieving data after you get response from smart contract (reply to 100430)

Денис: Where do I get steak from? I do this  const user = await client.runMethod(lastBlock.last.seqno, addressContract, "getDataUser", [{type: "int", value: 1n}]) (reply to 100429)

WG: I use @ton/core library, seems like you use another one. (reply to 100433)

Денис: ton (reply to 100434)

Laisky: I am indeed did just that, and my get_nft_content interface is capable of returning a cell that consists of a string(URL). However, I am unsure why the metadata and images are still not visible on tonviewer.  the return is: https://s3.laisky.com/public/nft/ton-demo/0.json   https://github.com/Laisky/HelloWorld/blob/72b85855c617fb61ab4840d9edb33eae5b45096e/blockchain/ton/contracts/nft/contracts/nft.tact#L131-L135 (reply to 100428)

Anton: In other l2 blockchains that less than1 cent. I'm very disappointed (reply to 100345)

Денис: Can I have a sample code with ton/core to get data from a contract? (reply to 100434)

Nerses: the purpose is to reduce count of transactions,thats why signitures come to the game (reply to 100431)

Champer Wu: I try to parse your nft  individual_content by get_nft_data https://testnet.tonviewer.com/kQBq2q2vne2Rl1N18RecCu3Y8RVGsyFAOVPxrNjq43YBaOII?section=method   Exit code: 0 init: true index: "0" collection_address: "0:e0a4a30b11ed8da3b3698f1fa01e242c96b0ec813b308220e717b64d8983d4f8" owner_address: "0:119ddb824a3ca623dd6eadf1c4fe35e59d31eb9abd1ee3268fb9bb4f424832e7" individual_content: "b5ee9c7201010101000300000230"    And I got the string “0”    function main() {   const cell = Cell.fromBoc(     Buffer.from(       "b5ee9c7201010101000300000230",       "hex"     )   );   const message = cell[0].beginParse().loadStringTail();   console.log(message); }   I think your meta data wase wrong when you deploy the item (reply to 100436)

Sina: is there chat group for Core Developer ? (reply to 100362)

Nerses: smart contract doesnt have private key can it have public key in that case ?

Nerses: as public key is derived from private key (g^priv_key = pub_key)

Champer Wu: the data for deploying would be       const mintParams = {       queryId,       itemOwnerAddress,       itemIndex: parseInt(Item.index),       amount: toNano("0.03"),       commonContentUrl: `item.json`,       authorityAddress,     } as mintParams;      const seqno = await Item.deploy(       wallet,       mintParams,       nftCollectionAddress     );  and individual_content will return the value as item.json it should not be 0 (reply to 100436)

Laisky: Your suggestion is that instead of returning 0, it should return 0.json?   As I understanding, according to the TEP-62, when the collection exists, the format of individual_content is not restricted. The complete metadata URL should be provided by the collection contract's get_nft_content interface.  https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#get-methods (reply to 100449)

Champer Wu: As your understanding the url would be provided by collection like    const collectionData = {     ownerAddress: wallet.contract.address,     royaltyPercent: 0.05, // 0.05 = 5%     royaltyAddress: wallet.contract.address,  //sbt-only     nextItemIndex: 1,     collectionContentUrl: `https://cf-ipfs.com/ipfs/${metadataIpfsHash}/collection.json`,     commonContentUrl: `https://cf-ipfs.com/ipfs/${metadataIpfsHash}/`,   };   and the item contract would store the data as       const mintParams = {       queryId,       itemOwnerAddress,       itemIndex: parseInt(index),       amount: toNano("0.03"),       commonContentUrl: `item.json`,       authorityAddress, //sbt-only     } as mintParams;    you can see that the full url was assembled by `collectionData.commonContentUrl`+`mintParams.commonContentUrl` the example will be like https://cf-ipfs.com/ipfs/${metadataIpfsHash}/item.json  the item contract should store the file name on ipfs and collection contract should store the ipfs absolute location and combine two of them together. as https://cf-ipfs.com/ipfs/${metadataIpfsHash}/item.json (reply to 100450)

Laisky: I gave it a try and I don't think that's the issue. The nft_item is now able to return 0.json, but it still cannot read the metadata.  https://testnet.tonviewer.com/kQD2IWbvrV9My7oSJ_uGccWA_gY73wSIhcTCuRyMr3GYS-5g?section=method  const result = await masterContract.getGetNftContent(        BigInt("0"),         beginCell().storeStringTail("0.json").endCell()    )     console.log(result.toBoc().toString());     // ��rA2`https://s3.laisky.com/public/nft/ton-demo/0.jsonh��  I'm sorry, it seems that Telegram has a serious bug that always causes it to lose part of the messages I send. (reply to 100452)

Nerses: can smart contract(not wallet contract) in TON sign transaction as it doesnt have private key ?  and also does it have public key ?

Champer Wu: and the metadata should store the image url  {   "attributes": [     {       "trait_type": "Edition",       "value": “hahaha”     }   ],   "content_url": “ifps://some”-hash/cool-duck.png,   "description": “duck on the road“,   "name": “hahaha” duck,   "image": “ipfs://some-hash/preview.png" } you need to check the meta include image and the path is correct (reply to 100453)

Wilson Gomes: Hey Devs, is it possible to promote audit related stuff here as well?

Laisky: https://s3.laisky.com/public/nft/ton-demo/0.json   The current issue is unable to read the metadata file, rather than the content within it. Furthermore, the content of the metadata seems to be fine. (reply to 100457)

Kapil: Someone has done compound protocol

stereo: GM⚡️GN  stereoiii6 is in the TVM  Let's bucking fuild fe thuture & fon't dorget 2 keep it 420%   #OpenNetworks #OpenMinds  #FreeSpeechMaxi #TON #TVM   Get's bucking fooooooooo !

stereo: im dev wanna read my source code

stereo: im still learning tact  and ill bother you with my questions soon enough

Денис: Please tell me how to use Slice.loadDict() from the ton-core library? I have a number key, a Cell value

Urban: I have a fairly interesting question. In TokenNotification message the from: Address should be from the Jetton wallet right? However I am gettign the address of the users wallet. Is this correct? Testing transfers on testnet USDT

&rey: Please check the difference between message headers and payload. (reply to 100479)

Cypt0: Hi, I urgently need 1000 coins on testnet, who can I contact?

Aram: Hey guys, anyone from toncenter here?

Aram: `curl -X 'GET' \   'https://testnet.toncenter.com/api/v3/events?account=EQBCCZc8Rpjv0I0NdCVl4ysfeNyc0FDYLd81aLQ6UHOxzQ0M&start_utime=1625025626&end_utime=1725025626&limit=999&sort=desc' \   -H 'accept: application/json'`  This call is returning 500

&rey: (mind message rate limit)

Aram: it's not message limit, this is the error:   {   "error": "ERROR: SELECT DISTINCT ON expressions must match initial ORDER BY expressions (SQLSTATE 42P10)" }

Vladimir: what library did you use? the old one https://github.com/ton-core/ton-core ? (reply to 100521)

Vladimir: so just migrate to the new version ) (reply to 100525)

Micheal: Hey Anyone know how can i generate signature? ( For ton )  Pls help me

Vladimir: `"@ton/core": "^0.57.0" in package.json? It's already new 🙁 (reply to 100530)

&rey: Here is an example in JS: https://github.com/toncenter/tonweb/blob/76dfd0701714c0a316aee503c2962840acaf74ef/src/contract/wallet/WalletContract.js#L129. (reply to 100531)

&rey: "ton", "ton-core" and "ton-crypto" are deprecated. (reply to 100537)

&rey: They were migrated to @ton/ton, @ton/core and @ton/crypto respectively. Something with npm's organizations. (reply to 100538)

Sina: Do you know what is the problem in this test ? (reply to 100362)

Alver: Hello im following this tutorial http://tonhelloworld.com/02-contract/ , everything worked well except when npx blueprint run i get this error  TypeError: Cannot read properties of undefined (reading 'slice')     at /home/desarrollo-alver/Proyectos/blockchain/ton-helloworld/Counter/node_modules/@ton/blueprint/dist/utils/selection.utils.js:50:47     at Array.map (<anonymous>)     at findScripts (/home/desarrollo-alver/Proyectos/blockchain/ton-helloworld/Counter/node_modules/@ton/blueprint/dist/utils/selection.utils.js:49:10)     at async run (/home/desarrollo-alver/Proyectos/blockchain/ton-helloworld/Counter/node_modules/@ton/blueprint/dist/cli/run.js:17:59)     at async main (/home/desarrollo-alver/Proyectos/blockchain/ton-helloworld/Counter/node_modules/@ton/blueprint/dist/cli/cli.js:91:5)

J.: Hello I am looking to add a revshare of a transaction to my ton dapp does anyone have examples of this on TON? tons of example on other chains but have not seen any on TON

who's this ?🩰: Sup, everyone, I'm a dev and I happy to receive your offers in my dms

User<7127693727>: 💪🏿 (reply to 100574)

User<7127693727>: go to Zavod

Đu đỉnh quen rồi🌱: ??? Pls dev ton? (reply to 100240)

TG: @Tapstarking_bot  I just made this, probably the best source code available right now, then you can build your whole app and new skin on top of that app :)

Alver: In case somebody is having the same issue, it seems to be related with the version 0.22.0, so running 0.21.0 will work.  link: https://github.com/ton-org/blueprint/issues/139 (reply to 100561)

UncleRooks: Hello

UncleRooks: yarn add @ton/blueprint —dev Is not working for me

&rey: It is fine and usable already. (reply to 100601)

luis: how to validate a transaccion usdt?

Micheal: Anyone can write code for generate signature, I can pay

Nikolaj: Hello, how can I send tact 'messages' from ton keeper to smart contract ?

Aram: Guys, any idea, why there is this difference, beetwin Bits and underlying _bits?

Aram: I am trying to parse this data te6cckEBAQEAZwAAyVzdQdlp1y+Iu94oe2FXsEA6XU4DYjE28JhEaliZGbpwpwhfF7BlpmNYMOBAEBGQP/Ubg0WTvNt8PFQeaqVIcNAYHlgogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzaQzZQYsAiww== with C# SDK

Aram: I am thinking that it is probably a C# sdk bug, because the same data can be parsed easly with typescript sdk (ton core)

User<6835191855>: I can build DApps, Telegram mini apps and Telegram bots on EVM chain, Solana and Ton Network. Who needs my help?

Aram: are messages encrypted somehow? should I decrypt them before reading as a Cell?

&rey: _bits has a lot of data, and _bits_st to _bits_en are just bits of the current cell. (reply to 100654)

Prince: you have feedback about Ton? (reply to 100676)

Nathan: hello guys

Nathan: 🫡

User<5435924052>: Who needs developer?

— 2024-08-31 —

Maple: 0xJETH is a scammer!  His id is @AGhe84. He asks to develop the DEX using TACT. He doesn't pay to other developers. be careful.  AFter receiving my message, this scammer deleted the scamming post message. 😅😅😅😅 Poorer Scammer! Go away, scammer, 0xJETH. (reply to 100686)

Joel: Hi all, is there a canonical way to store tuple type in persistent cell storage? because we don't have store_tuple. Is the only way to do it to serialize it into cell format and deserialize it when we want to use it?

Laisky: 👆👆👆The issue of being unable to read NFT metadata still hasn't been resolved. Can anyone help me take a look at it?🙏  NFT item: https://testnet.tonviewer.com/kQD2IWbvrV9My7oSJ_uGccWA_gY73wSIhcTCuRyMr3GYS-5g?section=nft  NFT contract: https://github.com/Laisky/HelloWorld/blob/master/blockchain/ton/contracts/nft/contracts/nft.tact (reply to 100436)

rem2: hi marek did you ever figure this out? I'm not sure how to generate the signature with SignData through a request to the user's wallet (reply to 91081)

WanKi: I checked the official documentation to install a full node, but it seems that the network settings and latest updates are not available. Can anyone give me some information regarding this?

&rey: I don't think signing arbitrary data by user's wallet app is possible. (reply to 100700)

rem2: interesting. How are we supposed to generate the signature for this then to verify a user? docs ton org/develop/dapps/ton-connect/sign (reply to 100712)

rem2: also github com/ton-blockchain/ton-connect/blob/main/requests-responses md  lists:  Available operations:      sendTransaction     *signData*     disconnect

&rey: I haven't seen wallet supporting it. (Signature upon connection is a whole different thing. It is requestable and it works!) (reply to 100717)

Ankit j: startPaylaod is deprecated showing,,Anyone faced similar issue? How to fix it?

&rey: This is offtop for this chat. (reply to 100720)

Ankit j: Sorry, didn't get,.I am still awaiting for my query resolution, if anyone can help.. (reply to 100722)

Aram: Btw guys, if you are looking for some tricky/advanced TON contracts, our team developed PHTLC standard in Tact. Happy to explore if you have any feedback. Also huge thanks to this chat for helping us out, especially @pcrafter !!  https://github.com/layerswap/layerswap-atomic-bridge

Aram: Also I think there is still bug in toncenter indexer v3. Check this out:

Aleš: Hi, I'm working on a mini app game and would like to give rewards when people join our channel and group. Is there an example code how to check if the user is in the group to verify that the user has joined to give reward?

Micheal: Telegram api -> getChatMember method (reply to 100744)

Aleš: thanks, found the documentation in telegraf 🙌 (reply to 100750)

Mike: Did the blockchain roll back or something ? I converted a bunch of usdt to ton the other day.    The day durov was let out.  Now my wallet has USDT on it again and not much TON

Mike: Not really complaining cause the price crashed but really weird

Anton: Can somebody explain what TONs were returned ?  https://tonviewer.com/transaction/877c559615cdcf7a9d66fca00783429733e8bdc643036edf4ecca996432f4e59

&rey: Some transactions were not even sent. Perhaps you watched swap via tonviewer and didn't notice "pending transaction" notice. (reply to 100766)

未对: 0:0320309e395bb010473f4a3b50f8c4d330abc72d2130b3774c3edcb1c54a1769 How can I use the mnemonic to get the address in this format? Can someone tell me the python or ts code?

meomeocoj | Mike: where do u get this address ? (reply to 100782)

Micheal: Get this address to the script, right? (reply to 100782)

meomeocoj | Mike: there are plenty of wallets on TON, so u should try import for each type to find your address. (reply to 100782)

Mike: Hm.  No .  They were confirmed and the  balancea also showed in ton keeper.   Really odd not sure what happened here (reply to 100775)

meomeocoj | Mike: https://docs.ton.org/participate/wallets/contracts Some types have been attached in official docs.

meomeocoj | Mike: Weird, there is no official anoutment about rollback. Could u give me your wallet address ? (reply to 100790)

.: how to send tether usdt in TMA? I use tonconnectui (js+html). I tried using tether usdt contract address on Ton official website and using usdt ABI, but still TON is sent. How can I implement this?

未对: I am learning ton-connect. This is the content of the data packet sent by tonkeeper to dapp when linking dapp. (reply to 100786)

未对: This is very confusing. The publickey is consistent with the data package, but the address obtained by my ts script is inconsistent with the data package.

未对: Thank you, I solved this problem after changing to V5R1 (reply to 100789)

Nguyễn Văn Tâm: /

S: Hello how I can get testnet jetton token?

S: . (reply to 100830)

Prince: you should mint your jetton on testnet (reply to 100833)

.: Guys imagine put destination wallet instead of   ton Receiver Wallet you put dogs jetton receiver wallet (in token transfer)  and transaction will be successful  how can i access to my transferred dogs?  and dogs doesn't exists on token assets in tonkeeper wallet instead, you should goto dogs jetton of normal wallet and you can see dogs under tokens section   Ton Wallet -> Dogs Jetton Wallet  -> Dogs Jetton Wallet -> Dogs Jetton Wallet [HERE IS DOGS]

CodeCop🐵: Wallet is not deployed Hi everyone. I'm new to TON smart contract development.  I wrote a simple counter contract and trying to deploy it to testnet. I connected my Tonkeeper wallet. It has balance in testnet account. (>40TON). It is active  But still getting this wallet is not deployed msg.  Can someone help me with this please.  Thanks in advance.

CodeCop🐵: u mean.. u having address in the string format?

CodeCop🐵: i hope this could work: let addr = Address.parse(base64_string); // or Address.parseHex(hex_string);

&rey: Inaccessible probably. (reply to 100843)

Prince: contract is opensource? (reply to 100868)

Prince: pls share it. we have to analyze whether there is risky

???: Hello everyone, is it possible to withdraw usdt from the contract? And one more question, why I linked a dns tone to my wallet, but when transferring from another wallet it says that this dns tone was not found.

&rey: Former is impossible in general, as those funds are not yours to control. (reply to 100881)

Danial N: Hello, I want to start working as a validator on the network. The documentation explains that we can borrow the required amount (300,000 TON) from a Nominator.  How can I borrow it?  We are an exchange with a high volume of transactions on the TON network. If we successfully set up the validator, we are capable of creating many more. I just need guidance to provide a comprehensive report.  How long do I need to stay connected to the network with my equipment to be recognized as a validator? And can I borrow the entire 300,000 TON? Do I need to have a specific amount of balance?  Thank you.   @pcrafter

&rey: No need to do so in advance (though it's better to run for 12 hours to test if your hardware and network work fine). (reply to 100889)

&rey: Normal nominator contracts require validator to have at least 10'000 TON. I don't remember how they are created — presumably in mytonctrl.

researcher: from your users / community. You create pool, put there your own 10k and Invite nominators to deposit into your pool.  more info https://docs.ton.org/participate/network-maintenance/nominators setup docs https://docs.ton.org/participate/network-maintenance/nominator-pool (reply to 100889)

researcher: there is also liquid staking, probably it's more convenient way for users to stake their funds.  https://ton-ls-protocol.gitbook.io/ton-liquid-staking-protocol https://github.com/ton-blockchain/liquid-staking-contract?tab=readme-ov-file (reply to 100889)

Danial N: Thank you 🙏 (reply to 100903)

recovery: Ton web mini app cannot be used well on mobile phones. WalletConnect/web3modal: What are the good solutions for components?

Nikita: anyone know how to get account id from TonConnectButton of @tonconnect/ui-react

&rey: tonConnectUI.account.address, maybe? (reply to 100942)

Nikita: not it sadly (reply to 100943)

User<7127693727>: wallet address after connect? (reply to 100942)

&rey: Might IDE help you? I've seen tonConnectUI.account.account.address somewhere else.

Nikita: i need to do this https://gist.github.com/mois-ilya/f00114baec5f44be2a365bee14c88280

Nikita: get value of coin after connected wallet

Nikita: with this address, i get some insane value for the token (reply to 100943)

Nikita: it should be ~1200

Nikita: or i guess it tries get the value of the entire token

&rey: It's in indivisible units. Divide amount by 10^decimals. (reply to 100950)

Nikita: thanks 🖤      const balanceInTON = Number(balance.balance) / 1_000_000_000    console.log(balanceInTON)   does the thing (reply to 100954)

Nikita: do you by chance have code how to make the transaction of tokens

&rey: Dividing by Math.pow(10, balance.jetton.decimals) is more universal. (reply to 100955)

&rey: Only for @ton/ton; in TON Cookbook. (reply to 100956)

TON Bounty Bridge: ​Adding new dashboards to the TON Stat service  🏷 Resource  Summary:There is a great service for visualization and analytics of key metrics on our blockchain:https://to...  Rewards: • 1700-3000 USD (solid price after agreement)  Created by seriybeliy11

Nikita: the thing I don't get though  say I run this code on server     const http = new TonApiClient({    baseUrl: "https://tonapi.io",   })   const api = new Api(http)   async function fetchAccountJettonBalance() {    const accountId = Address.parse(     "0:accefbbbe2c6d55944109aa5bcf68a60d25d04952952c069cb9e9295704d6a62"    )    // pepe coin jetton id: https://tonviewer.com/EQCXzO7HhoK5fDQuCONE43l8-Qsreq5zq89ZVNhEna24eK-h    const jettonId = Address.parse(     "EQCXzO7HhoK5fDQuCONE43l8-Qsreq5zq89ZVNhEna24eK-h"    )    const balance = await api.accounts.getAccountJettonBalance(     accountId,     jettonId    )    const balanceOfPepeCoins =     Number(balance.balance) / Math.pow(10, balance.jetton.decimals)    console.log(balanceOfPepeCoins)   }   fetchAccountJettonBalance()   this returns the balance of tokens to client (mini app in my case)  then user enters a number, say 100  i then send this number to server too? and somehow run the code with ton/ton lib? or can i do this on client somehow, i mean i have the wallet connected already there

Nikita: i thought i could get balance and sending of transactions purely on the client

THE CRYPTO BOSS (Never DM u first): Hi every body😎💵

&rey: @ton/ton is fine for client. (reply to 100961)

артем: can you help me? i want to generate a link for ton connect page with python

User<7127693727>: hello, how can i store comment for jetton, using ton/ton

Gabriel: hi, anyone knows if the TON 24 words seed is compatible to be used for an ethereum wallet?

Prince: begineparse(). ... endparse()

Nikita: where can I see how to use TON Connect React to send transaction of jeton to an address?

Nikita: I already know the jeton id I want to send and have connected wallet too

Nikita: found ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html#usetonconnectui  but I don't see how to pass jeton id

— 2024-09-01 —

Jedidiah Chiemerie 🌱SEED: Hello everyone. Can someone help me with how to display a connected address after click on the "Connect Wallet" button. I've been testing mine. Whenever I select "Tonkeeper ", it takes me to page to download "Tonkeeper" meanwhile I have it already installed.

Kapil: Can we store the jetton token on the any contract other then jetton wallet contract

Fereshte: Hello..Is there any api for jetton transaction history of an account?   https://tonapi.io/v2/accounts/{account_id}/jettons/{jetton_id}/history  I found this one but it doesn't show the fee of the transaction

SAJAHAN: S A

Prince: there it is (reply to 101058)

Fereshte: Sorry what? (reply to 101060)

Prince: you can get event id from that

Prince: then you have to analyze transaction. ofc you have to call API twice

Fereshte: do you know any api for this? tonapi event detail just shows the same result (reply to 101063)

Prince: TonAPI can do everything. ;) (reply to 101064)

Timur: Guys. How can I indicate comment as NFT here you know?

Timur: Like this, you know)

Nikita: does @ton-api/client no longer export HttpClient?

Nikita: trying to make this work https://github.com/siandreev/tonconnect-demo-dapp/blob/master/src/tonapi.ts

Санчо Пансо: Nope, shouldn’t do resultAddress.hash()  ResultAddress is actual address (reply to 101073)

Dom: @SwiftAdviser Can you check dm ? You are the official contact support from ton docs website, also please check pm ...I'm waiting almost one week for that

Nikita: I don't get why sending jetons is so hard in ton, did someone write a nice library that takes like 4 arguments and thats it   sender addres, receiver address, jetton id, valueInJetonTokens

User<6912843672>: Hello. I am a web developer . I'd like to share my experience my technical issue and its solution during casino site .

User<6912843672>: During the casino site development, I faced challenges like ensuring a scalable backend, integrating secure payment gateways, and implementing fair play through reliable RNG. The initial backend struggled with high traffic, so I adopted a microservices architecture and load balancing to enhance scalability. For payments, I implemented SSL/TLS encryption and integrated PCI-compliant gateways to handle multiple currencies securely. To ensure fair play, I integrated a certified third-party RNG and added monitoring tools. Additionally, I optimized the user interface for mobile devices using React Native, and ensured compliance with KYC and AML regulations through advanced verification systems.

User<6912843672>: I hope this help you

Kushagra: I am trying the jetton transfer in FunC, but keep on gettin 705 exit code while transfer. Any idea on what i might be missing?

0xBeastBillion𖤍: I can't access the ton website anymore i got blocked by cloudfare  please what is the possible solution i need help, thank you

Dmitry: Hey guys! How to send sufiicient amount of TON to another contract to pay for gas and nothing more?

Dmitry | backend4you.ton: For gas for sending, or for some future processing? (reply to 101096)

Dmitry | backend4you.ton: Find TEP 74 (Jetton standard), you’ll see link to Jetton reference implementation, open it. Open Jetton wallet contract and look for 705. (reply to 101094)

Dmitry: For sending, I want to have a 0 balance on the target contract after txn (it has 0 balance initially )

Carter🧹: You have to calculate how much back rent you owe the chain for storing the contract

Dmitry | backend4you.ton: Send 0 and use sendmode 1. (reply to 101104)

Dmitry: SendPayGasSeparately? (reply to 101107)

Dmitry: Thx!

Jedidiah Chiemerie 🌱SEED: Hello everyone. Can someone help me with how to display a connected address after click on the "Connect Wallet" button. I've been testing mine. Whenever I select "Tonkeeper ", it takes me to page to download "Tonkeeper" meanwhile I have it already installed.  Please I really need assistance on how to go about this

‌‌ ‌‌‌Mohammad: So it's no possible to have a constant smart contract address to set in web app or mini app? What would happens to the assets we have in the previous smart contract? (reply to 99682)

researcher: https://docs.ton.org/develop/func/cookbook#how-to-update-the-smart-contract-logic But you should use it very carefully because an incorrect update can cause your contract to brick. The standard approach is to develop a new contract and migrate the tokens. Usually, contracts are quite stable. (reply to 101118)

Cryptskii: Building this on TON anyone that feels they are wanting something like this and can contribute Im just now considering a few co-founders and core team , this will allow ton to have Instant horizontal scalability on private transactions off chain without compromise high, censorship resistance, higher than any other Blockchain can offer that way to my knowledge. The paper is very technical, so be prepared for a bit of a read. Serious inquiries only if you're looking to learn new stuff and push your skills this isn't the project for you I'm sorry to say if you don't already know everything I'm talking about in The proposal to good amount of certainty then of course you're welcome to contribute on the open source code when released but for the key roles I mentioned above you'll need a high degree of understanding and experience with the technologies mentioned: https://ethresear.ch/t/1st-completely-trustless-blockchain-using-pure-math-and-zk-snarks-for-validation-high-censorship-resistance/19756

Cryptskii: Originally when I published this it was anchored to ethereum but obviously I'm posting here because I think ton is the better choice or at least my preference and is where I plan to initially implement this on

researcher: have you read about payment channels in ton? (reply to 101125)

Cryptskii: I have

Cryptskii: This only settles occasionally with a global Merkle root for consistent on chain storage so that should cover anything you were about to warn me about I’m guessing

Cryptskii: Just thought I’d say that right away, so would likely just be its own version of payment channels

Gabriel: got a thumbs down, anyone can explain a bit why the seeds would not be compatible? I've seen eth wallets that can take 24 words too, not just 12 words 🤔 (reply to 100986)

researcher: I meant most of the things are already there (or will be soon) and you can just build on top it. Like Chain money transfers (5.2.4 https://docs.ton.org/ton.pdf) proof checks can be done by zk (reply to 101129)

Cryptskii: I don't know why it gave me a warning researcher but anyway, I sent you a DM

Cryptskii: The key difference here is that there's no need for global consensus to confirm and process transactions. Unlike traditional consensus methods like POS or POW, this approach is beneficial as it enhances guarantees against gaming and censorship. You don't have to worry about your transaction being censored by specific validators.  This method is simpler than alternatives like homomorphic encryption with blind validators, which adds significant overhead. As a self-taught researcher and coder, I've realized the importance of making connections, so I welcome anyone interested in collaborating.  I'm working on a project that focuses on local verification, maintaining critical functionalities while ensuring privacy, decentralization, and trustlessness. I plan to make the repository public for feedback from interested parties.  At this point, if we can achieve what I propose, I believe it could be a turning point in our efforts to establish this technology as a standard, integrated and shipped by default with hardware devices. This, in my opinion, would define real mass adoption—not through speculation but through utility. If this technology can perform everything existing solutions do, but better across the board, we will see true integration and acceptance.  In summary, integrating this with Telegram could lead to mass adoption, marking the beginning of the next generation of blockchain technology. Those invested in Layer 2 solutions like rollups might want to reconsider their investments, as this represents a leap forward—similar to moving from VHS to Blu-ray.  Achieving this first will establish a foundational layer for Web3 and likely be integrated into hardware for massive adoption, providing the highest level of censorship resistance. This is why this initiative is so important. Thank you.

&rey: Because they don't use same algorithm for key derivation. (reply to 101134)

Jedidiah Chiemerie 🌱SEED: So sorry. I honestly didn't know. I'm building web app. I want to be able to be able to connect my Tonkeeper or ton supported wallet and it redirects back to the app displaying the wallet address. (reply to 101116)

Barry.Lee: Anyone who can advise?  1. I recently purchased Dogs Scam. (stored in TON Space) 2. Zeroed out to eliminate dog fraud. (Go to TON Space->Wallet) 3. I purchased a real dog through Binance. 4. Dogs were sent from Binance to TON Space. 5. Currently, real Dogs and Dogs Scam conflict, so transfer or exchange is not possible.

Freed: Why do they conflict? (reply to 101159)

&rey: Your story seems confused. In particular, any two tokens on wallet do not interact in any way; even if you transfer A and it turns out to be malicious, it cannot steal funds or token B. (reply to 101159)

Barry.Lee: ton space - This is the swap page.  When the user makes a selection, only one must be selected, but currently both Scam and Real are selected.  Perhaps because of this, a bug occurs on the front end when withdrawing coin.

Barry.Lee: The image doesn't upload.

&rey: You should try another wallet app (from https://ton.org/wallets) at the same mnemonic/contract. (reply to 101163)

Gabriel: thanks for answering! and why would this be a problem if the starting point is the seed? won't ton key derivation always result in the same key1 and eth key derivation always result in key2? is there a danger of losing control of the keys? (reply to 101150)

&rey: Well, not all mnemonics are valid in TON, not all are valid in ETH, and those sets differ. Mnemonics are converted into seeds in different way as well. (reply to 101168)

Gabriel: I see, thank you for clarifying 🙌 (reply to 101169)

Barry.Lee: I don't know how to thank you because my English is bad.  I just solved it through a plugin.  Thank you very much. (reply to 101166)

User<7012417474>: How can I extract a transaction hash from a hash generated using tx.boc? Any assistance would be greatly appreciated.

&rey: Do you need transaction hash, or message's one would be sufficient? (reply to 101179)

0xtitn: Do not work with @hurricane50823 he said he made this project https://github.com/jeevan8888/SwapOnDEX_Tact but he only clone the project https://github.com/topsecretagent007/Ton-Project/ lol

User<7012417474>: when i send a transaction it return tx.boc, i convert it to hash    const bocCell = TonWeb.boc.Cell.oneFromBoc(         TonWeb.utils.base64ToBytes(txBoc),       );        const hash = TonWeb.utils.bytesToBase64(await bocCell.hash());  from this hash i need transaction hash (reply to 101180)

0xtitn: https://github.com/jeevan8888 this github was created in 1/8/2023

0xtitn: Everything is fake

Maestro 731: He's a scammer. Everyone, Be careful! He gives every developers an existing github repository. And after work, he doesn't pay properly. (reply to 101182)

Champer Wu: Okay let’s figure it out (reply to 100697)

Champer Wu: I watch your item contract, it still not read metadata yet

Champer Wu: The meta should be printed on the scaner (reply to 101192)

Prince: If you care about contract, then know the reason why always upload metadata failed (reply to 101192)

Prince: In the past, me neither.

Maestro 731: Admin, pls kick off 0xJETH! There are so many scammers like 0xJETH. (reply to 101185)

Champer Wu: I tried to parse his metadata by method get_nft_data and the individual_content b5ee9c720101010100120000206974656d5f6c65676163792e6a736f6e is parsed as 1.json (reply to 101196)

Champer Wu: your metadata content  is 0.json (reply to 100436)

Maestro 731: https://t.me/AGhe84  How poorer scammer!  This dirty scammer who insult developers for revealing their projects with non-existent Github repositories doesn't need to be here.

Champer Wu: I think the path will not point to the correct location of the file, or you just modify it ? (reply to 100697)

Champer Wu: what do you mean? (reply to 101197)

Ken: Who's a scammer

Testarudo: Is anyone using a ton library for flutter?

Khashayar: Hey 👋   I configured TON Connect for my mini app  Weirdly Ton keeper works great But MyTonWallet just doesn’t wanna connect   Anyone with same issue ?

Mr Radikali: When you tap on open wallet and select tonkeeper it doesnt show transaction I tested default code and last day worked but now its not working whats problem?

Mr Radikali: Please find solution (reply to 101250)

luis: I have a question... after sending a transaction of a jetton coin like USDT and obtaining its hash, how can I verify that the transaction is correct? I’ve noticed that there are transactions that are confirmed, but what actually happens is that the user sends TON and it is returned to them. For example, this transaction: https://tonviewer.com/transaction/1e6fccace09f28735c518536688ad30db87aebfd4b3aa6a4441ce2972700cb9f

Rahul: Experience TON Developer here. Open to work.

— 2024-09-02 —

技术的: 😏

D: Who can help me to parse BOC (bag of cell) in Nodejs ?

Geek: The recipient address is not exist (reply to 101258)

Laisky: I can confirm that the issue isn't with get_nft_data. I've tried multiple times; I've tried return only individualContent or the entire metadata URL, and there’s no difference.  Metadata should be retrieved using the collection's get_nft_content method, and it is not directly related to the nft item's get_nft_data method.  Moreover, The image displaying correctly on Tonscan shows the metadata can be read properly. (reply to 101202)

Vincent: https://tonviewer.com/transaction/b5abfef1d386fbc5306bdc581bc0e4100966ffc2c81dfa1083f143367efd6c69 what does this error possibly be?

Vincent: It shows nothing about the reason of the error

Laisky: I have finally resolved this issue. It turns out that the implementation of nft-template-in-tact was incorrect, and the description of TEP-062 is also lacking important information.  ref: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#content-representation  TEP-064 actually describes that offchain and onchain metadata have different serialization prefixes. (reply to 100697)

Champer Wu: Good to heard that! So the root cause is collection contract in tact was incorrect right? (reply to 101296)

Laisky: The collection's get_nft_content method should return a uint8 to indicates if metadata is off-chain or on-chain. check the PR for details. (reply to 101299)

Laisky: here is the full code: https://github.com/Laisky/HelloWorld/blob/ac5c067cd6e0a96dfd778f17f214aefe38f4c0e8/blockchain/ton/contracts/nft/contracts/nft.tact#L159-L167 (reply to 101300)

Champer Wu: I was implementing the contract by the getgems example. Accroding to this implementation, the NFT would be deployed sucessfully I’m als interested in the implementation with tact. Could you share the correct version to me ? ref: https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-collection.fc (reply to 101300)

Champer Wu: Oh! Thank you , it very useful! (reply to 101301)

Champer Wu: Do you write the collection contract and item contract in the same file?

Laisky: yep  BTW, This is an experimental project—correctness isn't guaranteed, and changes will happen often (reply to 101304)

Champer Wu: In funC, the contract deployment of collection and items would be individual file If the implementation in the same file, the blueprint would output two different hex ? Or I need to divide it by myself? (reply to 101301)

Laisky: All you need is to run:  npm i npx blueprint build npx blueprint run --testnet --tonconnect mint (reply to 101306)

Champer Wu: Okay I would try it, thanks for sharing (reply to 101307)

Arjun: Hello folks, are there any APIs to get the asset (jetton) holdings of a wallet ?

Fahim: Hello good morning,  i use vanilla js for my mini app and added wallet connect feature. Actually it works but doesnot give me standard address format, it give raw.  is it possible to get standard address directly or converting with vanilla js?  i use tonconnect ui min js

Mr Radikali: But last day is ok I try with single and multi message but its not ok (reply to 101256)

Cryptskii: 1. Channel Structure:    - Proposed: Unilateral (one-way) channels    - Traditional: Typically bilateral channels    - Advantage: Simplifies state management, enables massive parallel processing  2. Fund Management:    - Proposed: Unified liquidity pool, no fragmentation; 50% spending rule    - Traditional: Fragmented liquidity across individual locked channels    - Advantage: Significantly more efficient use of capital, flexible fund usage  3. Privacy:    - Proposed: zk-SNARKs for all state updates    - Traditional: Often relies on hash-based approaches    - Advantage: Stronger privacy guarantees, complex state transitions provable  4. Scalability Approach:    - Proposed: Hierarchical structure (wallet, intermediate, root contracts), partitioned storage    - Traditional: Typically flat structure, relies on off-chain transactions    - Advantage: More efficient aggregation of transactions, potentially "infinite" scalability  5. On-chain Operations:    - Proposed: Minimized, mainly for periodic state commitments    - Traditional: Required for channel opening/closing, disputes, rebalancing    - Advantage: Reduced blockchain congestion, lower fees  6. Mathematical Foundations:    - Proposed: Balance Consistency Theorem proved by induction    - Traditional: Varies, often not explicitly emphasized    - Advantage: Strong mathematical basis for system integrity  7. Dispute Resolution:    - Proposed: Uses zk-SNARKs, less on-chain data required    - Traditional: Often requires submitting channel states on-chain    - Advantage: More private, potentially more efficient dispute resolution  8. Network Topology:    - Proposed: Flexible, easier multi-hop transactions    - Traditional: Often requires direct channels between parties    - Advantage: More efficient routing, better network liquidity  9. Consensus:    - Proposed: No global consensus needed for transactions    - Traditional: Also typically doesn't require global consensus for each transaction    - Similarity: Both avoid global bottlenecks for individual transactions  10. Implementation Complexity:     - Proposed: More complex due to zk-SNARKs, hierarchical structure     - Traditional: Generally simpler implementation     - Trade-off: Increased complexity for improved features  11. Cryptographic Basis:     - Proposed: Heavy reliance on zk-SNARKs     - Traditional: Often uses simpler cryptographic primitives     - Advantage: Enhanced privacy and expressiveness in state transitions  12. Mass Adoption Potential:     - Proposed: Higher, due to unified liquidity and flexible fund usage     - Traditional: Lower, hindered by fragmented liquidity     - Key factor: Solving "fragmented liquidity" issue  13. User Experience:     - Proposed: Simplified, funds usable across network without pre-locking     - Traditional: Complex, requires active channel management     - Advantage: More intuitive for average users, closer to traditional banking experience  14. Capital Efficiency:     - Proposed: High, funds readily available across the network     - Traditional: Lower, funds siloed in specific channels     - Advantage: Better utilization of user funds, potentially attracting more capital to the system (reply to 101135)

Cryptskii: Privacy:  Proposed System: - Uses zk-SNARKs for all transactions - Transaction details (amount, sender, receiver) are hidden from everyone except the parties involved - Even the network operators can't see transaction details - Provides "selective disclosure" - users can prove specific facts about their financial history without revealing everything  Traditional Banking: - Banks have full visibility of all transactions - Limited privacy from government and other authorized entities - Transaction details often visible to multiple parties in the payment chain  Security:  Proposed System: - Cryptographically secure - relies on mathematical proofs rather than trust - No central point of failure - distributed system - Funds aren't "locked" with specific counterparties, reducing risk - 50% spending rule limits potential losses from compromised accounts  Traditional Banking: - Relies heavily on centralized security measures - Vulnerable to large-scale hacks and insider threats - Often requires trusting multiple intermediaries  Visibility and Control:  Proposed System: - Users have full control and visibility of their funds at all times - Real-time settlement and balance updates - Ability to prove account state without revealing all information - Transparent system rules enforced by code, not policies  Traditional Banking: - Limited visibility into transaction processing - Delays in settlement and balance updates - Opaque system rules and processes - Limited control over how personal financial data is used  Why People Might Say "This Does Everything My Bank Does, But Better":  1. Instant Transactions: No more waiting days for settlements.  2. Enhanced Privacy: Conduct business without exposing financial details.  3. Lower Costs: Reduced overhead could mean lower fees for users.  4. Global Access: Seamless cross-border transactions without extra fees or complications.  5. 24/7 Availability: No bank holidays or off-hours.  6. Self-Custody: Full control over funds without relying on a third party.  7. Programmable Money: Ability to set complex conditions for transactions.  8. Transparency: Clear, immutable record of all activities.  9. Inclusive: Potentially accessible to anyone with a smartphone, regardless of traditional banking status.  10. Future-Proof: Designed to scale with technological advancements.  Nothing is Harder: - Basic transactions are as simple as using a mobile banking app - Complex operations (like multi-party contracts) are possible but optional - User-friendly interfaces can abstract the underlying complexity  By addressing privacy concerns, providing robust security, and offering unprecedented control and visibility, the proposed system indeed has the potential to outperform traditional banking in many aspects. Its design aligns well with growing demands for financial privacy, security, and user empowerment, positioning it as a strong candidate for wide-scale adoption.

Cryptskii: Privacy: - TON Payment Channels:    * Transactions within channels are private between participants   * Channel balances and settlements are visible on-chain   * Less private than proposed system, but more than traditional banking  - Proposed System:   * Uses zk-SNARKs for all transactions, offering stronger privacy   * Even aggregate data is cryptographically obscured  Security: - TON Payment Channels:   * Cryptographically secure within channels   * Funds locked in channels, potentially limiting flexibility   * Relies on on-chain settlements for ultimate security  - Proposed System:   * Cryptographically secure for all transactions   * No fund locking, potentially more flexible and efficient   * Constant off-chain security with periodic on-chain commitments  Visibility and Control: - TON Payment Channels:   * Full visibility within channels   * Limited visibility across the network   * Requires active channel management  - Proposed System:   * Full network-wide visibility while maintaining privacy   * Less user management required due to unified liquidity  Ease of Use: - TON Payment Channels:   * Requires understanding of channel opening, closing, and rebalancing   * May be complex for average users  - Proposed System:   * Aims for user experience similar to traditional banking   * Potentially simpler due to unified liquidity management  Scalability: - TON Payment Channels:   * Good scalability, but limited by channel capacity and network topology   * May require frequent on-chain operations for channel management  - Proposed System:   * Potentially higher scalability due to hierarchical structure   * Fewer on-chain operations required  You're correct to point out that TON payment channels do offer improvements over traditional banking in many of these areas. However, the proposed system aims to take these improvements further, particularly in terms of privacy, liquidity management, and ease of use.   The key differences lie in: 1. The use of zk-SNARKs for enhanced privacy 2. The unified liquidity pool vs. fragmented channel liquidity 3. The hierarchical structure for improved scalability

Cryptskii: As you can see if we were to implement my payment channels on TON or just upgrade it to mine as the new standard, we actually have something now that is practical for mass adoption. Mass adoption only happens when you can replace one with the other well not affecting the user experience and the negative way or sacrificing anything people are used to and would have a problem sacrificing nothing in crypto can actually achieve this yet that is this would be the first time.

SMI: Hello guys! Any ideas how tonkeeper is doing to know when a transaction is done?

Kapil: Has anyone tried to make the governace contract in ton

Joel: Hey ton builders. We have some tg group for serious builders on TON. We just share useful info in that group. Hit me up if u wanna join

&rey: There are various implementations. 1. What decisions will that contract make? (reply to 101337)

Kapil: For any proposal which is being proposed (reply to 101346)

&rey: 2. Is proposal about onchain or offchain actions? (reply to 101347)

Kapil: Onchain action (reply to 101348)

&rey: Please check out if multisig wallet suits you. (reply to 101349)

Kapil: No (reply to 101350)

Lich King: hey, does anyone know a testnet dex for getting jettons?

Aram: Hey guys, anyone from toncenter team? /v3/events endpoint is not working with start_utime filter

Dmitry | backend4you.ton: if you need any jettons for tests, create your own in https://minter.ton.org/?testnet=true (reply to 101360)

Dmitry | backend4you.ton: yep, it operates both networks

Денис: Hello everyone, are there any developers here? If there is, please tell me, I wrote a contract for Tact, uploaded it to the test network, I write onchain tests, I use the ton library so, when trying to create an instance of the contract class  const contract = Matrix.fromAddress(Address.parse("EQBSSV0P8K68JQBkhMqPEhoH44kgqsuaGW2SU_fjilZcyx7E"))  return client.open(contract) as OpenedContract<Matrix>  An error is formed  Argument of type 'Matrix' is not assignable to parameter of type 'Contract'.   Types of property 'init' are incompatible.     Type '{ code: Cell; data: Cell; } | undefined' is not assignable to type 'Maybe<{ code: Cell; data: Cell; }>'.       Type '{ code: Cell; data: Cell; }' is not assignable to type 'Maybe<{ code: Cell; data: Cell; }>'.         The types of 'code.bits' are incompatible between these types.           Type 'import("c:/Users/Admin/Documents/repos/NotApCoin/node_modules/@ton/core/dist/boc/BitString").BitString' is not assignable to type 'import("c:/Users/Admin/Documents/repos/NotApCoin/lesson10/node_modules/ton-core/dist/boc/BitString").BitString'.             Types have separate declarations of a private property '_offset'.ts(2345)  I exported everything for sure. I used Blueprint to compile the contract, thanks in advance. I've been racking my head for the second day already...

Root: How to estimate fee before send tx? How to set gas to build a transfer tx? I can send a transfer tx.But I‘m not sure where to set gas to a tx. Estimate api returns a result that is much different from the actual result.   curl -X 'POST' \   'https://testnet.toncenter.com/api/v2/estimateFee' \   -H 'accept: application/json' \   -H 'Content-Type: application/json' \   -d '{   "address": "EQBVbC7Hu-g3htYXzst8L5ucV76NMzeBK3URJKebN2Y1k55Q",   "body": "te6ccgEBBAEAwwABRYgAqthdj3fQbw2sL52W+F83OK99GmZvAlbqIklPNm7MayYMAQGcJRnEjp8cFJEdHYEy0LKHHYzifhXgDjogvM4i1RhNr6JL5bGaLxFWgLvL/9Q5K9CsRfVakAbG1JfXmJjD+54vAimpoxdm1XNnAAAAEwADAgFkQgA0XvoMzOTI+7LhqhMUCzQfZ6f1jWBzDLBT90cgmTz0fBE4gAAAAAAAAAAAAAAAAAEDACoAAAAAdGhpcyBpcyBhIHRlc3QgdHg=",      "ignore_chksig": false }'

Root: It returns   {"ok":true,"result":{"@type":"query.fees","source_fees":{"@type":"fees","in_fwd_fee":996800,"storage_fee":1905,"gas_fee":0,"fwd_fee":0},"destination_fees":[],"@extra":"1725269763.338662:5:0.15490142875163082"}}  The tx's actual fee is about 0.00228ton

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 53 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 38  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

TON Bounty Bridge: ​Make a cNFT repository with complete documentation  🏷 Developer Tool  Summary:Now cNFT is described here:  Created by sraibaby

Lucas: Wait what did I say?

Lucas: Alright this word seems banned... gonna try with emoji instead  🆓 Testnet Coins are mentioned in the docs. @test_giver_ton_bot ... but the bot seems offline, is ther an alternative?

Lisa: Ok I’ve built a telegram mini app

Lisa: Any tips on marketing ?

Nerses: is it okay that contract processing this message fails when  it receieves first time and in balance is 0 TON but after having some amount of TON it process susccessfully ?  receive(msg: Lock){          let ctx: Context = context();         require(self.lockExists(msg.data.hashlock) == false,"Lock Already Exists");          require(now() <= msg.data.timelock ,"Not Future Timelock");         require(ctx.value != 0,"Funds Not Sent");          self.locks.set(msg.data.hashlock,  HTLC  {                                                         dstAddress: msg.data.dstAddress,                                                         dstChain: msg.data.dstChain,                                                         dstAsset: msg.data.dstAsset,                                                         srcAsset: msg.data.srcAsset,                                                         sender: sender(),                                                         srcReceiver: msg.data.srcReceiver,                                                         hashlock: msg.data.hashlock,                                                         secret: 0x0,                                                         amount: ctx.value,                                                         timelock: msg.data.timelock,                                                         redeemed: false,                                                         unlocked: false                                                         });          if(msg.data.commitId != null){             let id: Int = msg.data.commitId!!;             self.commitIdToLockId.set(id,msg.data.hashlock);         }          if(msg.data.messenger != null && msg.data.commitId != null){             // notify messenger             // value:0 (as we dont send TON) mode:1 (fees will be payed separetly)             send(SendParameters{to: msg.data.messenger!!,                                 bounce: true,                                 value: 20000000,                                 mode: 0,                                 body: Notify {data: Notification {                                                                             commitId: msg.data.commitId!!,                                                                             hashlock: msg.data.hashlock,                                                                             dstChain: msg.data.dstChain,                                                                             dstAsset: msg.data.dstAsset,                                                                             dstAddress: msg.data.dstAddress,                                                                             srcAsset: msg.data.srcAsset,                                                                             sender: sender(),                                                                             srcReceiver: msg.data.srcReceiver,                                                                             amount: ctx.value,                                                                             timelock: msg.data.timelock,                                                                         }}.toCell()});           }          // mode:64 will be sent tx sender remaining amount after msg processing         send(SendParameters{to: sender(),                             bounce: true,                             value: 0,                             mode: 64});          emit(TokenLocked{                 hashlock: msg.data.hashlock,                 dstChain: msg.data.dstChain,                 dstAddress: msg.data.dstAddress,                 dstAsset: msg.data.dstAsset,                 sender: sender(),                 srcReceiver: msg.data.srcReceiver,                 srcAsset: msg.data.srcAsset,                 amount: ctx.value,                 timelock: msg.data.timelock,                 messenger: msg.data.messenger,                 commitId: msg.data.commitId             }.toCell());     }

Vera: Hey guys! Does anyone know if it’s possible to distinguish custodial wallets created from @wallet from general non-custodial wallets?

Nerses: it fails because of sending Notify  message,Initially I set its parameters value:0 mode:1  but it failed as well (reply to 101408)

Dmitriy: Hey!  Does TON Contract Verifier have the API to download the contract sources without using their UI?

nikita: Hello guys, how can I up my transaction gas limit by potoniq?

Vasanth: Hi their, is there any fee for receiving ton amount. When i deposit from wallet. I recieved less amount than what it said. What might be the reason.

Nerses: In my TACT smart contract, I have receivers that accept messages but don't require TON for processing. How should users specify the exact amount of TON to send with the message to avoid the transaction being reverted? Alternatively, should the contract automatically send back any excess TON?

sangmin: hi~ Which ttl value of mytonctrl do you use?

S.P.Pandiarajan: I am using testnet wallet. I deposit 1 ton from a faucet, in ton wallet I received less amount. Like I received 0.99072  Is there any fee for receiving transactions ?

&rey: Probably storage fee, though I'd expect your balance to be 0.99972. (reply to 101443)

S.P.Pandiarajan: I checked in explorer it shows gas fee and storage fee. (reply to 101450)

Fanny: hi guys looking for a dev to mint new token, add liquidity pool on dedust.io, and swap script on dedust.io

Fanny: I need a script (reply to 101460)

Alan | Torch: Here is a comprehensive study in Ston.fi v1 and v2 provided by Torch Finance research team, share with you guys:  https://blog.torch.finance/ston-fi-a-pioneer-in-the-ton-ecosystem-4a4cfb29bf4f?source=friends_link&sk=e570056d5393bf8c481054df0621c7fb  STON.fi, the first DEX on the TON blockchain, introduces its V2 update to address liquidity fragmentation and enhance trading efficiency with features like cross-swaps and a referral program.

Alan | Torch: We would like to contact lending protocol (such as EVAA) developers if you are here, for discussion the potential cooperation (and maybe risk) of the boosted pool and share liquidity from our stableswap pools.  #BuildOnTON

Aram: is there faucet for this testnet token?  https://testnet.tonviewer.com/kQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_ntm

Fahim: Hello good morning,  i use vanilla js for my mini app and added wallet connect feature. Actually it works but doesnot give me standard address format, it give raw.  is it possible to get standard address directly or converting with vanilla js?  i use tonconnect ui min js

Евгений: Hi there! Is it possible to use TWA bot with Ton domain?

Mr_____E̸͕̻̣ͅr̛̟̫ͨ҉rͦͫ̈́̋or̟: Hello

Lovely: Yes, it's possible to use a TWA (Trusted Web Activity) bot with a TON (The Open Network) domain. (reply to 101469)

Евгений: Sorry! By TWA I meant telegram web app (reply to 101475)

Lovely: ah, of course that too. (reply to 101476)

Евгений: Could you help me to get essential docs, Google didn't help :( (reply to 101477)

Lovely: The TON (The Open Network) blockchain was originally developed by the team behind Telegram, and it is true that it has significant integration with Telegram, allowing users to interact with TON services through the app. However, TON is not limited to use only within Telegram

&rey: Nothing on docs.ton.org? (reply to 101479)

Евгений: So I can use *.ton domain with bot and configure menu button with *.ton domain?

Lovely: Plz see "TWA Bot with TON Domain Learning Course" (reply to 101482)

Евгений: Thank you! 🔥 (reply to 101483)

Lovely: no need to say thank you to me. I guess it's our pleasure to help eachother. (reply to 101484)

Амир: No need to say thank you, unless there are some tons attached to ur message (reply to 101485)

Arjun: Hello folks, are there any APIs to get the asset (jetton) holdings of a wallet ?

&rey: In most cases, you don't even need to change anything in backend. (reply to 101492)

Hans: Hello, I am gonna to develop yescoin. Is there any referencible open source in Github ?  - tap to earn - launch token on TON network

DeFi: That already exists. (reply to 101512)

Hans: Where is it ? (reply to 101513)

DeFi: Just Google "yescoin on Ton" (reply to 101514)

Rodolfo Azevedo: Hello folks, who know how to get a transaction using this library, tonweb? https://github.com/toncenter/tonweb/

L.: /stat@combot

luis: and how can I prevent that from happening? (reply to 101286)

— 2024-09-03 —

bitmark✌️: Hi, Everyone How can I create new token?

DeFi: The same way you do on any other chain, or you can use the minter on ton's website (reply to 101549)

bitmark✌️: Can I sell it?

DeFi: do you not understand how DeFi works? (reply to 101551)

bitmark✌️: https://keep-trust.onrender.com/ this is crypto drainer. be careful

Laisky: Is the testnet down? Can't send any transactions!

Hans: Hello, I gonna to develop NOTCOIN project. (I am a developer) I think there is 2 NOTCOIN. Game-in coin and coin on blockchain.  Is this right ?

Laisky: The testnet seems to have been down for a while (reply to 101559)

Laisky: https://testnet.tonviewer.com/stats/transactions  With the testnet down, where's the transaction data here coming from? (reply to 101562)

wadaxiwa: I've got the same problem. (reply to 101559)

Laisky: So that means tonkeeper/tonviewer is down.  But @testgiver_ton_bot also seems to be down; it hasn’t sent me any TON coins for a while. (reply to 101566)

Hong Kyun: Hey guys! can I get some help regarding Telegram Mini Apps here?

Hong Kyun: We're testing TMA through dev version, is there a way to make the screen orientation Horizontal for our Mini App web ui?

Hong Kyun: Landscape* screen orientation (reply to 101577)

Gavin Wood: Anyone know who this address belongs to?  EQBFMtW837BdMnXL8lW8kcNjXNSNY7cZRBWBxVQqR1D99S1Q

BEKMUROD: do you have tonkeeper passphrase dictionary

Maestro 731: I'll help you. (reply to 101578)

Hong Kyun: :D ! (reply to 101582)

Hong Kyun: It work naturally on a mobile device but not on the PC version on default setting

BEKMUROD: who can help me (reply to 101581)

Hong Kyun: Sent you a message already (reply to 101588)

Drake: hi i'm finding way to get jetton wallet address from my wallet address. running runGetMethod(https://toncenter.com/api/v3/index.html#/api%2Fv2/api_v3_post_v2_rungetmethod) with next request body but had error. anyone know what's wrong with this?  {   "address": "EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS(jetton master)",   "method": "get_wallet_address",   "stack": [     {       "type": "slice",       "value": "EQD-jRlnmcyODjG7ogB3-oQP4-vdySwDtPNCO9G1heDlGYeT(my wallet address)"     }   ] }

$X 🦴 Iván: ? 🤔 (reply to 101597)

Влад | Нейросети | ИИ Автоматизация: Hi! My name is Vladislav and I represent the guestibot project (a Telegram bot for daily rentals). We are looking for an expert in the field of Telegram Mini Apps, who can conduct a hackathon on TON or TMA, or give valuable advice on this direction. If you have experience and willingness to help, write in a private message. We will be glad to cooperate!

Chaincode: It's mine (reply to 101580)

Degen: How to parse exotic cells in tact

Degen: (slice cs, int exotic?) = proof_cell.begin_parse_exotic(); Similar to func, how to parse in tact?

picard: is testnet down?

SH: is testnet down?

Alan | Torch: broken... (reply to 101639)

Akachi: testnet tonviewer is down now, it has alerts to say that the Data may be out of date

SH: ye i thought whole testnet si down ton.cx seems like the working on atm

Denisa: Hello 👋

Denisa: I have a question regarding smart contracts

Denisa: Can smart contracts have v5 wallets?

Denisa: And if so, how exactly do i specify the wallet type?

User<5895306823>: Hello i need to ask a question. It is possible with python and secret seed send ton from address to other address?

Dmitry | backend4you.ton: every wallet (v3, v4, v5) is a smartcontract itself  so your question looks like "can smartcontract have smartcontract" rephrase it plz (reply to 101651)

Maestro 731: In TON, every wallet works as it's self smart contract. (reply to 101651)

User<5895306823>: ? (reply to 101653)

Laisky: Tonkeeper has also been down for the whole day, and Testgiver is down too. (reply to 101643)

Akachi: I think tonscan is working (reply to 101657)

Laisky: The search on the Tonscan homepage has been down for many days, but the internal links are still working. (reply to 101660)

Rayan: Hi guys, What is that trace id in top the transaction series page in tonscan? how can we get that from liteserver methods?  for example: https://tonscan.org/tx/e98d9fe0a87c7efad251afbd02f36286d0362f2deb5f14a54a48c1198d77267e

Kapil: How to get the block number with in the contract

User<7347362344>: Hello, Who need dev write me in dm. Im searching interesting projects

Denisa: Okay, let me rephrase it: How can i specify which wallet type i can work with when it comes to a custom made smart contract? I would like to be able to send gassless transctions to and from it. (reply to 101654)

Dmitry | backend4you.ton: contracts interact using messages, so typically you define structure of expected message (TL-B) and should not care what contract (not even wallet sometimes) sent it to you. (reply to 101694)

Dmitry | backend4you.ton: gasless transactions is a message too (surprise) so it has its own TL-B so you have to read about them to understand how to send/receive them. IIRC, gasless transactions are made by ask some service (tonapi for example) to send your "payload" from their service contract, and you "guarantee" to refund gas they spend for this tx by some other way. for example with "battery" subscription or with additional tokens (you send 101: 100 to destination, 1 to tonapi as gas refund)

Dmitry | backend4you.ton: if my opinion is correct, then you can't send gasless transaction from contract, because contracts interact with messages which require gas.  real usage of gasless transaction for users, so they do not required to buy TON for gas to send not/dogs/... - they can "give" same jettons as gas refund to tonapi/other serivce who really pays for gas for their tx (reply to 101696)

Denisa: i am guessing it's the same for fees in usdt? (reply to 101699)

Mr. Liam | Iceteasoftware | COO: t.me/seed_coin_bot/app?startapp=871424106  SEED App - where every SEED is the genesis of everything. Join now with me as an early bird — SEED just launched with huge potential! Plant-to-earn from thousands of Web3 projects in SEED ecosystem with me. 🥳 Get Welcome Gift Pack including in-game items and SEED 💲Earn 20% cashback from frens

Bahar: ⭕️⭕️⚠️⚠️ Hello TON Community,  I’ve successfully installed a TON liteserver node using the MyTonCtrl tool following the official TON documentation <https://docs.ton.org/participate/run-nodes/enable-liteserver-node> and the GitHub repository <https://github.com/ton-blockchain/mytonctrl>. I also allowed the udp ports of the node after installation.  After completing the installation, I ran the status command to check my node's status. However, the output only displays the <Local validator status> section. The other expected sections, such as <TON network status>, <TON network configuration>, and <TON timestamps>, are missing.  I’ve reviewed the setup process and believe all steps were followed correctly. Has anyone else encountered this issue? Could it be related to configuration files, node synchronization, or something I might have missed during installation? Any advice or troubleshooting steps would be greatly appreciated!  Thanks in advance for your help.

Dmitry | backend4you.ton: yes, afaik (reply to 101702)

Cyril M |: hi guys, where can I find documentation for muldivr?

Hyipto: Why it fail

Hyipto: When i pay the contract

starzkeeper: which Python library can I use to make it asynchronous?

‌‌ ‌‌‌Mohammad: Hi folks,   We have a starknet soluition (DeFi), and looking for solutions like onchain message bridging or so To enable our users to do the stuff on TON too, to make our platform one step forward to cross-chain.  Any thoughts on it? Any solution maybe?

Chaincode: bro,I can recommend a project for you to work on. (reply to 101737)

User<5895306823>: some admin could help me? @admin

&rey: Probably because of error in contract or in message you send it. (reply to 101710)

User<5895306823>: Hello i need to ask a question. It is possible with python and secret seed send ton from address to other address? (reply to 101751)

Dmitry | backend4you.ton: yes (reply to 101760)

User<5895306823>: How? (reply to 101766)

Dmitry | backend4you.ton: https://docs.ton.org/ , DApps  or, Google python send ton (reply to 101773)

User<5895306823>: Python send Ton suggest with mnemonic not with pkey (reply to 101776)

Dmitry | backend4you.ton: Hmm, you said “seed” so I thought about mnemonic. Check your python ton lib docs for mnemonic to key conversion. When you send with mnemonic - it is being converted to pub/private keys first, and then private used for signing. You need to skip first step (reply to 101779)

User<6753518952>: As a skilled blockchain developer, I am seeking a project where I can leverage my expertise in decentralized applications, smart contracts, and blockchain integration to drive innovative solutions and contribute to your success.

Andr: Any idea how tonviewer detects belonging tx to certain jetton master? For example https://tonviewer.com/transaction/1cea6a670bd3dbbd98df5e2acf71567fb400d92057abd732054776dd1328cb6c - tonviewer shows it as DOGS

Dmitriy: Better to ask in https://t.me/tonapitech but I suppose that they have a list of popular jetton contract addresses, and in this case it’s enough to just call get_wallet_address and check if any of them matches (reply to 101832)

Fabien: I made a telegram game using nextjs which works but routing and page loading is so slow, ive done everything to optimise but ive come to the conclusion that it might just be a nextjs thing. For telegram games using react and a database, is Nextjs the right option or is something like vite better?

Faheem: GM everyone,  I am Faheem, founder of MEGLAND. We are in the middle of developing our mini-app MEGBattle, as well as the overall MEGLAND project, and we are looking for a motivated developer to join our team.  I want to be transparent: there is no immediate compensation in stablecoins. What we are offering is a unique opportunity to join a growing project, with percentages of tokens allocated under a vesting plan. This structure is designed to align the interests of our team over the long term, by rewarding commitment and contribution to the success of MEGLAND.  We are not just looking for a developer, but a true member of our core team, someone who shares our vision and is willing to invest with us until the launch of our token. This launch has been awaited by our community for four years, and we are finally getting closer to this crucial moment.  MEGLAND is currently based at Station F, where we were selected in the most selective batch in their history. We are also members of the TON Nest group level 2, and we are preparing to join level 3. We are at a key moment in our adventure, and this is an opportunity for someone to join us to be part of this story.  If you are interested or know someone who might be, I would be happy to discuss it in more detail. We are based in Paris, so if you speak both French and English, it would be ideal to ensure smooth communication within the team.  Thank you all and see you soon!

Waxpaca | WaxOnEdge: Hi

Waxpaca | WaxOnEdge: On ton website if i click on build then documentation i get error code: 502

TON Bounty Bridge: ​I'm applying for the August reward according to my [user report](https://docs.google.com/spreadsheets/d/1KAu5S1AAjB9FA5BQqvA8KYMfhxReuP-LXhuV8jHNqMc/edit?usp=sharing)  Created by Superindus

— 2024-09-04 —

pfeffunit: hey what extensions is anyone using in vs code for FunC? i see a couple but i don't want to install some kind of scam plugin

researcher: https://github.com/ton-community/vscode-func https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode (reply to 101856)

pfeffunit: thanks!

Nguyen: Hi everyone! I am sending nft item. Here is my code:  const body = beginCell()       .storeUint(0x5fcc3d14, 32) // NFT transfer op code 0x5fcc3d14       .storeUint(0, 64) // queryid:uint64       .storeAddress(Address.parse(targetAddress)) // newowner:MsgAddress       .storeAddress(Address.parse(fromAddress)) // responsedestination:MsgAddress       .storeUint(0, 1) // custompayload:(Maybe ^Cell)       .storeCoins(toNano('0.5')) // forwardamount:(VarUInteger 16)       .storeUint(0, 1) // forwardpayload:(Either Cell ^Cell)       .endCell()      const { boc } = await tonConnectUI.sendTransaction({       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [         {           address: Address.parse(nft_item),           amount: toNano('0.5').toString(),           payload: body.toBoc().toString('base64'),         },       ],     }). Why it show failed to calculate fee and can not send it?

Shakib Islam: UQBfjFTnXKm6m-BjYpZqbk1qOtcxhioKMHq1c8IM_icueDr6

jb (bull): hey guys - how long does the TON -> ETH bridge take when bridging native TON to TON ERC-20?

jb (bull): also if this is the wrong chat, where should I ask?

Jehldan: Hi

&: I think you have mistake on transferring ton amount. You should send enough ton (reply to 101859)

JT: I have a question regarding writting a test script of FunC smart contract:  - How to retrieve public_key of one wallet contract via using @ton/sandbox? - How to sign a cell?

TKAINU: Custom payload is sent when transferring jetton token, will the final recipient receive it?

|| PGJ || 🦴: Its possible to collaborate with TON resolving issues for newbies?

JT: @ton/sandbox not support to retrieve publicKey nor privateKey. Therefore, I have to use @ton/crypto on testing. By the way, thanks for your rep (reply to 101877)

TKAINU: I want to read transfer_op from custom payload via transfer_notification when sending jetton, how to do that? (reply to 101879)

TKAINU: I tried but err

Johnny Le: hi, is there any tool so I can generate wallet both v4r2 and w5 from words phrase ?

TKAINU: Currently I'm sending up a fixed amount of tons as a fee, is there any way to estimate the approximate fee so as not to waste user input?

~: If we want to focus only on frontend development, where can we find a smart contract example to integrate with the frontend?

&rey: Doesn't reproduce. (reply to 101848)

Eren: Hello, how can I issue my own token through the ton network?

Siqi@InfStones: Hey guys could anyone kindly help with some questions regarding staking pool:  1. Are the rewards linear with the staking? For instance would I get the  same rewards if I stake 1,000,000 in one pool and split those tokens to 2  pools with 500,000 tokens each? 2. What does One validator node may use up to 600k TON (in this example) in two rounds (half in odd rounds, half in even rounds) mean? Saw this in the official doc and got a little bit confused

Eren: Isn't there anyone who will answer? (reply to 101899)

&rey: The simplest way is to use minter.ton.org. (If you can't use TON itself instead.) (reply to 101899)

Waxpaca | WaxOnEdge: I just figured out i was on ton dot tg. Using ton dot org it works fine  edit: fyi i use qwant and by searching "ton blockchain" only the tg domain comes up. On google i get the org one. (reply to 101898)

C.: Hey there. Is there any reason why ston.fi requires 1001 Jettons to be sent to null address for pool initialization?

Dmitry | backend4you.ton: minter.ton.org (reply to 101899)

Eren: Thx (reply to 101914)

User<7012417474>: Ton keeper is not working ?

User<7012417474>: Can not send any transaction

Eren: Try again buddy maybe it's just a small mistake

User<7012417474>: I try on mobile and pc it same issue

Eren: Sorry, I have no idea. 🤷🏻

User<7012417474>: You can try send a tx, i think it have same issue (reply to 101922)

User<7012417474>: Like testnet error yesterday

Eren: Maybe

Sagara: Did you managed to resolve this issue? My node also increasing the out of sync duration since last 2 days. (reply to 93986)

Dananjaye: Can I connect with an official from Ton ? Regarding a project where we want to use ton as the main chain.

0x0liver: how to handle jetton bounce message?

jun_song: How to pass the parameters of sendTransfer method of jetton token contract when ts calls it?

C.: REQUIRED_MIN_LIQUIDITY uses it to calculate lp out amount. I am adding this if any other developer has a problem related to this. (reply to 101913)

User<6846674164>: Hiii

Nguyen: Hi I am facing with the issue when use ton/core ReferenceError: Buffer is not defined     at ./node_modules/@ton/core/dist/boc/BitString.js. My CRA react-app broken. Anybody can solve it?

C.: You need to add node.js specific stuff to your web app. On vite I solve it using nodePolyfill but I am not sure about CRA. (reply to 101952)

Champer Wu: set internal message and store first 4 bits  as       .store_uint(0, 1) ;; tag     .store_uint(1, 1) ;; ihr_disabled     .store_uint(1, 1) ;; allow bounces     .store_uint(0, 1) ;; not bounced itself  it would be trigger on_bounce method in contract  https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/contracts/jetton-wallet.fc#L217  remember that When a condition is checked, every non-zero integer is considered a true value. https://docs.ton.org/develop/func/types#absence-of-boolean-type (reply to 101939)

0x0liver: should i pass op code for bounce messsage? (reply to 101961)

jun_song: Where is the official documentation here? (reply to 101943)

jun_song: The params for transfer were not found

Champer Wu: you mean pass params into sendTransfer method? you could follow the way to assemble the cell of transferBody  https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/test/lib/jetton-wallet.ts#L16 (reply to 101942)

Champer Wu: bounce flag was store in front of op, so it doesn’t depend on op (reply to 101962)

Lee: .

Lee: Hi, can someone explain to me how to parse token transactions in each record? I'm using tonutils-go.

Champer Wu: basic token or jetton ? (reply to 101973)

Lee: any jetton

jun_song: thanks (reply to 101966)

TKAINU: How do I calculate the transaction fee when calling a function from the client?

JT: try it out https://github.com/ton-org/sandbox (reply to 101978)

Champer Wu: you can parse msg boc from the transactions as following the jetton contract  https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/contracts/jetton-wallet.fc (reply to 101975)

Champer Wu: just use the api estimateFee which was provided by toncenter https://toncenter.com/api/v2/#/send/estimate_fee_estimateFee_post (reply to 101978)

Nick: Hi all, need help Anyone know is it possible to listen events on testnet using ton console websockets?

User<6753518952>: yh sure. (reply to 101988)

Laisky: https://blog.laisky.com/p/ton-tact/ Just wrote an article for TON Tact newbies on Jetton & NFT development. Feedback and discussions are welcome!

Lee: Always failing at line 219. Any suggestions?

Champer Wu: the pic doesn’t show the line (reply to 101993)

Nick: I have a try but nothing work (reply to 101989)

Nick: No any events received

Lee: Sorry, line 219 is the one with the comment. (reply to 101994)

Lee: Body.LoadBigCoins (reply to 101997)

SMI: Is there anyone who deployed from the frontend to a SC (Smart Contract) from the config on ton?

Ankit j: Hi fam, is there any guide or url to follow for cloudflare hosting ?

SMI: pls help (reply to 101999)

jun_song: Error in line 58

jun_song: How can I modify the parameters of line 58? (reply to 101966)

Champer Wu: https://rainboltz.github.io/awesome-ton-toolkit/ try this tool (reply to 101998)

Champer Wu: copy full internal msg and parse it as following the pic

Champer Wu: could you show me the instance of MyJettonWallet? (reply to 102006)

N ARI AVKAN: what's the problem? (reply to 102004)

Vova: What is Contract Decimal

SMI: i try to make an deploy to a sc, but i have this error

SMI: Status: nonexist → nonexist

jun_song: import { MyJettonWallet } from "./lib/jetton-wallet";

jun_song: The MyJettonWallet applied like this (reply to 102012)

SMI: If i deploy the contract with blueprint is working

jun_song: How to modify it please? (reply to 102012)

Mohit Madan: Guys, does anyone have a guide on deploying a .fc / .cell contract on testnet?

Mohit Madan: @malev (reply to 102030)

Vova: 12. Contract Decimal : 9 19. Fully Diluted Market Cap : idk 20. Total Circulation Supply :idk 21. Circulation Market Cap :idk 30. Quote Symbol : idk 33. Base Decimal : 9  34. Quote Decimal : 9  Where I can find this information about my coin

std::maxime: Get this from a Dex explorer(recommended) or write your own solution (reply to 102049)

Vova: Ok thx (reply to 102057)

Vova: Can you give me some short example (reply to 102057)

std::maxime: Dexscreener, gecko terminal and many more.  They have generous API you can query (reply to 102060)

Vova: Ok I get idea (reply to 102063)

Vova: Fully Diluted Market Cap  https://www.geckoterminal.com/ton/pools/EQBV38YxnJDCYzzjIbchRdiP5GYA0K4rIjYqS0uzilU4kKs3 (reply to 102063)

Vova: For example Fully Diluted Market Cap where I should look it four (reply to 102066)

std::maxime: Fdv (reply to 102066)

Vova: Ok thanks (reply to 102068)

Vova: Sorry can you help me recognize all other as well   Total Circulation Supply :idk 21. Circulation Market Cap :idk 30. Quote Symbol : idk (reply to 102068)

Rahim: Do you know programming? I'm stuck on the programming event of the last episode The code is correct but gives an error Please help me

Ihor: Hi! It looks like the latests zfs snapshot available for the TON node is from 17 June. Is this expected? https://archival-dump.ton.org/dumps/

Jonathan: Which mode I should choose when installing MyTonCtrl if I want to run a Full node or a Archive node? I'm guessing validator mode but it's a bit unclear to me.

jb (bull): hey all just wanted to ask this again, i sent the ton to the ETH Toncoin bridge contract via: https://tonscan.org/tx/db92f60b5a03c4c4bb1ee251b14d724a053259c2d327de9a5c7f7e17cab3df43 (reply to 101869)

jb (bull): i didnt recieve the wrapped TON on eth, is there something else i need to do?

jb (bull): i was able to bridge from ETH to TON with no issue

S: Hello guys I have question it's possible to get hash(txid) after transfer?

FAB: hello @maslovok can you check DM?

S: Thanks you (reply to 102088)

DarkMatterDev: Hello everyone,  Im getting the Failed to unpack account state no matter what i try on testnet, things ive tried: creating wallet then sending small amount into it before deploy (on deploy and transfer i will get the error)  ive tried all day, i am no  closer.   Any ideas? im using tonweb

User: who can guess how much is this one ? this is crazy

User: why one should pay such an amount for a dns

Yepikaiei: Hey guys, The open url function works well on unity and on the web but wouldn’t work on mu telegram webapp, Does anybody knows how to solve this?

Eren: Hello, I have a question: How can I create my own telegram game and put it in the telegram bot?

&rey: Irrelevant to this chat. I believe it was explained in @devs; please try searching in that chat before asking. (reply to 102121)

N: Hi , anyone deploy launchpad contract on Ton ?

Eren: thank you, sorry (reply to 102122)

S: hello guys, can some one ehelp me with a weird problem with pool creation in STONfi?  I created pool 1TON : 100000 Tokens  But received bad ratio, and can't add liquidity to the pool

&: use Blueprint (reply to 102030)

&: Your tx might not have contract deploying structure.  Blueprint make tx automatically and you should keep this rule. Visit docs.ton.org to get details (reply to 102025)

Ahab: Hello, developers. How are you doing? I have problems in transfer jetton token from wallet1 to wallet2 using node.js Can anybody help me? I can pay you. Thank you 🙏

User<7464188086>: okay.

🔥 R A H U L™🔥: Yo anyone from usa or canada?

D_d: why?

Lucky: Hello developers, i know everyone here is a dev but one or two persons here must've worked with KOLs or Influencers  Please kindly DM if you have any connections with KOLs or  Influencers or Contributors.   Thanks

.: Hi, How can I create v3 highload wallet ?

— 2024-09-05 —

Harpreet: I was planning to have a leaderboard in my Mini App but I am unable to find an API to get PFP Url and FIrst Name of the user from their Username.  Thanks

Razak: why? (reply to 102143)

Mr Shelby: Does anyone here know how to transfer Jetton tokens to another wallet using React Native?

Gigen: Excuse me, I enabled web H5 in TG. When the user clicks to connect to the wallet, my original screen will be closed and the wallet will be opened. I hope not to close the original screen. How should I make it? I've tried openInNewWindow: true and returnStrategy: 'none', both of which are useless. How should I set them?

DarkMatterDev: Hello. i need to create wallets under same keypair with different subwallet id but when created they are inactive, how to programattically deploy them with zero balance? or even transfer to them if they are not "deployed"?

DarkMatterDev: my usecase is like an exchange where i want 100 wallets ready to assign to users

Ankit j: I want to know how we r managing local environment (connected to firestore DB) vs live (connected to vercel)..if using different branch (firebase), then vercel deployed app & bot won't work..and on local, vercel deployed app won't work on local..anyone pls suggest how you managed in such cases ?

sangmin: hi~ What response value will I get if nonce is wrong in sendmessage??

DarkMatterDev: Is there an official place to get support for this project?   I am still getting failed to unpack errors. I have searched chat and tried all suggestions.   What could possibly be wrong with my message here   const mnemonic: string[] = await mnemonicNew();         const mnemonicString: string = mnemonic.join(" ");         const keyPair: KeyPair = await mnemonicToPrivateKey(mnemonicString.split(" "));          const wallet: WalletContractV4 = WalletContractV4.create({           publicKey: keyPair.publicKey,           workchain: 0         });          const address: Address = wallet.address;         console.log(`Wallet ${i + 1} address: ${address.toString()}`);          const isDeployed: boolean = await client.isContractDeployed(address);          if (!isDeployed) {           console.log(`Deploying wallet ${i + 1}...`);            const funderKeyPair = await walletController.getFunderWalletKeypair()           console.log("Deployer pubkey: " + funderKeyPair.publicKey);           const deployer: WalletContractV4 = WalletContractV4.create({             publicKey: funderKeyPair.publicKey,             workchain: 0           });           console.log("Deployer: " + deployer);            // Get the StateInit for the new wallet           const walletContract = client.open(deployer)           const stateInit: StateInit = wallet.init;           console.log("wc: " + walletContract);            // Prepare the deployment message           const seqno: number = await walletContract.getSeqno();           console.log("seqno: " + seqno);           const transfer = deployer.createTransfer({             secretKey: funderKeyPair.secretKey,             seqno: seqno,             messages: [               internal({                 to: address,                 value: toNano("0.05"),                 init: stateInit,                 body: beginCell().endCell(),               })             ],             sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,           });            await client.sendExternalMessage(deployer, transfer);

N: Hi devs,  Anyone have worked on vesting contract,   I have vesting contract in tact,  I am trying to integrate it with reactjs ,  I am not able to deploy new contract from frontend.

Sigrid: Hi all,  I'm interested in analyzing usage on some TON games. How would you recommend me doing it?

Alexander Burakhin: Are you sure you're okay with posting your secret key here? (reply to 102274)

Laisky: Is there a way to show transfered Jetton information on the Tonkeeper transaction confirmation screen?

Moein: Hmm Never thought that would be my secret key Why would the ton connect library expose the secret key of my wallet? 🤔 (reply to 102277)

Moein: If that’s the case then that’s even a horrible bug on ton connect side

N: https://verifier.ton.org/EQABm5gvsAX2XRVdgwe0pkxj0VluS_lWiY5TJrJbcdcLFAhG?testnet=

N: Can anyone help me to deploy same contract from frontend reactjs

Alexander Burakhin: Well, it was explicitly written "secretkey" down below ) I'm not entirely sure what was dumped there, though. (reply to 102280)

🔥 R A H U L™🔥: Have a deal (reply to 102231)

&rey: It's only ephemeral browser's keypair for encrypting TC2 exchange. (reply to 102280)

Moein: Ah great to know Thanks (reply to 102287)

Moein: Any idea who can resolve the blocking? (reply to 102287)

Small: Hi all, I have a question, will ton's message end up being executed? Or is it possible that the message was sent but it was not executed due to timeout or loss of the message in the network and it did not reach the destination contract?

Joe: Hi, I would like to ask about the ton validator node. Is there any relevant API that can easily check the node status, whether it is running normally, whether it is online. And how to check the status of the nominator pool. Is there any relevant API or document link? Thank you very much!

User<6898193927>: Is there an interface to get the telegram user registration time?

TKAINU: please help me, i using nestjs to update data to smartcontract, but error: AxiosError: Request failed with status code 500

C.: Yeah there is a bounce functionality. If a message fails it returns assets back to owner (reply to 102292)

C.: That is why we have bounce field on messages. Refer to FunC documentation

Daniel: Can I put state_init in forward_payload to deploy contract with transferring nft?

Kapil: How to store the tuple in the blockchain

Leo: you cannot bcoz the forward payload is wrapped inside a ownership-assigned message (reply to 102306)

SH: Hi, how do I gather all related transactions within if i know one of them?

Stalooshu: Any update on prometheus metrics?

Sandip: Hi Dev Community, i am new member, here to learn more about TON development and its ecosystem

𝐿𝓊𝒸𝒶𝓈: I am also new member. Hope to learn TON development.

jaq₿ek.eth: Hey. I have simple html game. When i open it in mobile browser it looks different when opened from bot in telegram

ᅠ: What do you mean? Check the sizes: for example, 16px in browser are not the same with the 16px in your mobile phone (reply to 102319)

User<6134444887>: Anyone seeking a dev or designer?

Roykay: Why my smart contract transaction marked as a SUSPICIOUS?

jaq₿ek.eth: Its like this in tg

jaq₿ek.eth: And like this in browser

jaq₿ek.eth: All previous games didnt had this issue with different appear

k: Text AMA dedicated to building on TON!   🗓Date: September 6th, 2PM UTC  💬 Venue: @RestakingModularity  🎙️ Speakers from EVAA Protocol, Gleam Rewards, TOCD Studio etc.   The AMA will discuss key trends in the TON network, focusing on recent and upcoming developments. Join us to explore innovations and tools shaping the future of the TON blockchain.

Nerses: can only just receiving scam nft transfer some amount from my wallet(no action is done just recieved). I know that it cant be as for tx I should sign it and havent done anything,but after receiving wallets balance is reduced in tonkeeper

Ishwar: Great TON 👛

C.: Is there a valid proxy ton implementation apart from ston.fi's stuff?

Hiroto: this is a scammer

Tanya: scammer? india?

NPA120: How he scammed you?

Kapil: How to store the tuple in ton blockchain

[+_-]: Hey everyone!  I've been looking into sending external-out messages for logging purposes, but I haven't come across any code examples demonstrating this. I also couldn't find any information about the associated fees (who pays - us or validators?) and other related details - I'd found only TL-B schemes. If any of you have experience using these messages for their intended purpose, I'd be really grateful for any information you could share🍪🍪

Hiroto: I had a video call before start to work (reply to 102354)

Hiroto: He said me that he wanted bi weekly payment

Hiroto: I agreed with that and I worked on his job for 2 weeks and finished the project

Hiroto: after that, he removed me in git repo and he remove all histories

gavin: Hey brother, regarding parsing message data, I just made a cell parser tool today, it is open source and you can try it out https://ton-cell-parser.vercel.app/ (reply to 102357)

Luis: Hello, has anyone made or know an implementation of keccak256 in tact?

Dmtri: is theres a neovim/vim plugin for funC?

Ton: Anyone knows the bd of the telegram ads? The review is too slow..

Ton: Please share the bd to me. Thx

Tanya: bd?

Ton: the person who is responsible for the review of the ads

DeFi: There is no way to speed up the process. Plan accordingly. (reply to 102378)

Minimal ☄️: How can I know which word is not allowed?

Tugged: Guys i want to get started with TON and i am a web2 guy. Please tell some resources i can understand about it.

&: Why don't you create your repo and let him to push yours? (reply to 102362)

Sagara: Did you manage to resolve this issue ? I faced the same issue after syncing a while. (reply to 97948)

Dom: No and no anyone can help ...official support = no answer 2 weeks ... (reply to 102410)

Nush: hello

TON Bounty Bridge: ​Deploy System and CDN for Applications Based on Telegram Mini Apps  🏷 Developer Tool  Summary:Development of this grant consists of the following set of steps:  Created by heyqbnk

Alver: have somebody done the https://society.ton.org/ton-blockchain-course?  I have a problem doing a test, this is what i get    29 |     // });   30 | > 31 |     expect(sentMessageResult.transactions).toHaveTransaction({      |                                            ^   32 |       from: senderWallet.address,   33 |       to: myContract.address,   34 |       success: true,    at Object.<anonymous> (tests/main.spec.ts:31:44)  and this is my code:  import { Cell, toNano } from '@ton/core'; import { hex } from '../build/main.compiled.json'; import { Blockchain } from '@ton/sandbox'; import { MainContract } from '../wrappers/MainContract'; import '@ton/test-utils';  describe('main.fc contract tests', () => {   it('should get the proper most recent sender address', async () => {     const blockchain = await Blockchain.create();     const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];      const myContract = blockchain.openContract(       MainContract.createFromConfig({}, codeCell)     );      const senderWallet = await blockchain.treasury('sender');      const sentMessageResult = await myContract.sendInternalMessage(       senderWallet.getSender(),        toNano('0.05')     );      expect(sentMessageResult.transactions).toHaveTransaction({       from: senderWallet.address,       to: myContract.address,       success: true,     });     .     .     .   }); })  I made a modification of the main.fc contract to sum an integer, and MainContract.ts sends the number when calling it, but im not really sure what im missing

Alver: Expected [       {         lt: 2000000n,         now: 1725571823,         outMessagesCount: 1,         oldStatus: 'active',         endStatus: 'active',         totalFees: 2189462n,         from: undefined,         to: EQBPABJHLy9WThhpL5UIiDIrUHWzz6Mjhq96hPP4TuMkGPsk,         on: EQBPABJHLy9WThhpL5UIiDIrUHWzz6Mjhq96hPP4TuMkGPsk,         value: undefined,         body: x{D7D5EC75238C3FF305820DF4CFEF921919F46FEFEC5EA4F73FA31775D14BD1DEC_}          x{D001}           x{620051CBE29CC36DEFEF1911DFFC8E31C5C9D011961722FC09A0F04014490478C93F2017D78400000000000000000000000000023000000006_}            x{FF00F4A413F4BCF2C80B}             x{62_}              x{D032D0D30331FA403001D31FD31F3001A0C858CF16CB1FC9ED54}              x{4}               x{BA4D9ED44D0FA4030}               x{B88EDED44D0FA40D31F30}            x{},         inMessageBounced: undefined,         inMessageBounceable: undefined,         op: 3621121141,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: false,         destroyed: false,         exitCode: 0,         actionResultCode: 0,         success: true       },       {         lt: 3000000n,         now: 1725571823,         outMessagesCount: 1,         oldStatus: 'uninitialized',         endStatus: 'active',         totalFees: 385331n,         from: EQBPABJHLy9WThhpL5UIiDIrUHWzz6Mjhq96hPP4TuMkGPsk,         to: EQCjl8U5htvf3jIjv_kcY4uToCMsLkX4E0HggCiSCPGSfkYc,         on: EQCjl8U5htvf3jIjv_kcY4uToCMsLkX4E0HggCiSCPGSfkYc,         value: 50000000n,         body: x{00000001},         inMessageBounced: false,         inMessageBounceable: true,         op: 1,         initData: x{},         initCode: x{FF00F4A413F4BCF2C80B}          x{62_}           x{D032D0D30331FA403001D31FD31F3001A0C858CF16CB1FC9ED54}           x{4}            x{BA4D9ED44D0FA4030}            x{B88EDED44D0FA40D31F30},         deploy: true,         aborted: true,         destroyed: false,         exitCode: 9,         actionResultCode: undefined,         success: false       },       {         lt: 4000000n,         now: 1725571823,         outMessagesCount: 0,         oldStatus: 'active',         endStatus: 'active',         totalFees: 123600n,         from: EQCjl8U5htvf3jIjv_kcY4uToCMsLkX4E0HggCiSCPGSfkYc,         to: EQBPABJHLy9WThhpL5UIiDIrUHWzz6Mjhq96hPP4TuMkGPsk,         on: EQBPABJHLy9WThhpL5UIiDIrUHWzz6Mjhq96hPP4TuMkGPsk,         value: 49348000n,         body: x{FFFFFFFF00000001},         inMessageBounced: true,         inMessageBounceable: false,         op: 4294967295,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: false,         destroyed: false,         exitCode: 0,         actionResultCode: 0,         success: true       }     ] to contain a transaction that matches pattern {       from: EQBPABJHLy9WThhpL5UIiDIrUHWzz6Mjhq96hPP4TuMkGPsk,       to: EQCjl8U5htvf3jIjv_kcY4uToCMsLkX4E0HggCiSCPGSfkYc,       success: true     }  My apologies if this is too much info, i just dont see the problem

Big Chiano: Yea, i need TON Maxi (reply to 91417)

Big Chiano: Hi everyone, dev here. anyone needs to partner on a project can dm with details. (please must have funds for marketing or at least grants from the TON team so we don't waste our time)

Maiwand: What should i do

Tiqan: How do i tell tonviewer what the contract type is?

— 2024-09-06 —

Soon Guan: given that ton is async, how long can it be before a transfers triggers an internal transfers (e.g. for a simple transfer of jetton token on the network?)

Soon Guan: similarly, does a transfers needs to be "ack" within N hours before it is dropped?

JT: Let's break it down the procedures. Unlike Ethereum, transactions, in TON, are called message. When you interact with TON, you basically send external_message to your Jetton Wallet then it triggers the internal_message

SH: then how do i know which transactions are connected and they are all confirmed? (reply to 102482)

JT: Contract -> contract: internal_message. Once is sent, your contract respond to you what if an error occurs. However, the outcome of the internal_message won't be guaranteed (reply to 102483)

Haint: there's a validUntil config when sending transaction. As for messages initiated from a contract I dont think there's a time constraint, but they will eventually be included (reply to 102481)

SH: so even if it's a internal transaction between another contracts, it will notice back to me. did i understand correctly? (reply to 102484)

Soon Guan: oh my gosh - so the upper limit seems to be... limitless? (reply to 102485)

JT: I can give you an example as follows: - User A makes a payment to User B - User B receives a payment and update balance, then make transfer_notification to Notification (custom) contract that would issue a receipt - Assuming there might be some errors that Notification handles the transfer_notification op and revert, outcome on User won't be reverted

Haint: looks like it, the tvm guarantees all internal messages from contract to be delivered but I dont think they make any promise on how long it will take (reply to 102487)

SH: ah gotchu thanks

JT: true. It takes from 0 -> infinity. No guarantee (reply to 102489)

JT: you won't achieve what so call atomicity in TON, so must have a proper design or solution, and also be aware and well-prepare for possible failures (including partial ones)

Soon Guan: i see, this is helpful thanks! and everyone who replied (reply to 102489)

dann: hi, is there a way for me to get 1000 TON testnet tokens?

Haint: yes you can get 5 TON every 1 hour, so it will take 200 hours to get 1000 TON (reply to 102496)

dann: is there another way or someone i can contact to purchase / get 1000 testnet TON straight? we are running an app on TON and need a ton of gas 😅 (reply to 102497)

Haint: why do you possibly need 1000 TON for gas? it's dirt cheap (reply to 102499)

dann: sybils.. 😂 (reply to 102500)

Roykay: Help me, we are running a Smart Contract.  Transfer amount is 1U, the Gas is 0.05 Toncoin (~0.25 U). How can I reduce the gas fee?

Fong 🇻🇳: Hi everyone, I am looking into Cell & Bag of Cells (BoC). Can anyone explain why [0x8_] = 1[8_], [0x0AAAAA] = 24[0AAAAA], and [0xFE] = 7[FE]? What do 1, 24, and 7 represent, and how are they generated?"

kj: hi

Leo: the left side of the equation you wrote is just the hex representation of cell data while the right side is (hex repr + length), which contains more information than left side so they are not equal - e.g. [0x8_] maybe the hex repr of 1[8_], 2[8_], 3[8_], 4[8_] (reply to 102507)

Lee: I initiated a transaction and used the API to query it, but the API only returned the final message (D). Can someone tell me how to retrieve the previous messages A, B, and C? The transaction ID is 5aa36f8db0b509a01e2111c760912d393f5e97af35838b26c474b61ca3bc60eb.

Daniel: hey guys how do you emit events on func just like on solidity

Laisky: Use trace api (reply to 102515)

&rey: The next question will be "how to get emitted events", right? Just skip both of those and track transactions on your contract. (reply to 102518)

Daniel: Just skip both of those and track transactions on your contract.  do you mind expanding on this? (reply to 102520)

Lee: What is  trace API? Is it a specific API from a node? (reply to 102519)

Soon Guan: are all hex addresses on Ton len 66? (e.g. `0:EE87D1CDA0977F041950A6905774908C49C5E1FF78CAEE8D5E0C09441444A777`)

&rey: Repeatedly poll, or subscribe to, transactions on your contract (each transaction corresponds to one internal message). Then you can check exit code and message data. (reply to 102521)

Daniel: so there’s no way to do this? (reply to 102518)

&rey: There is but external-out/log/emitted messages are useless. (reply to 102527)

Daniel: why is it useless? (reply to 102528)

🐸🌱SEED Blessing 👾 BITS🍅🐐Ⓜ️ MEMES: My Ton website is blocked

&rey: Why exactly — depends on your intended usage, but for any idea to date there have been better solutions. (reply to 102529)

Soon Guan: @pcrafter thanks! - i'm trying to figure out the jetton masters in all transfer messages - i noticed that the messages don't include the jetton masters and Im using initstates to figure out (which has owner, jetton master and the jetton address) (reply to 102524)

Fong 🇻🇳: I see, thank you very much 🙏 (reply to 102510)

&rey: Hex part is 64-char. Workchain is currently either 0 or -1. (reply to 102524)

Cryptskii: Just reading back through this chat andI'm noticing here that I'm not the only one that has an early start up and is so early that the early hires need to be OK with equity because we are still building our court team or trying to find a good cofounder so still ahead of funding.   Q: Is there anyway we can have an exclusive channel specifically catering to this? This way it is made crystal clear to everyone that any openings listed are going to be based on this and not I paid salary as many seem to be requesting. It would be awesome to have this IMO

Michaell: Guys, I got a question  telegram miniapp  How to connect to third party API (telegram, x, instagram, youtube, discord, playstore) on Quest List  Thank you for your answer 🙏

Kunal: We recently integrated with zealy following these docs: https://zealy.io/docs/tasks/api. You will need to create an API on your backend and link that API with zealy to fetch task status. (reply to 102543)

Gavin Wood: Does anyone use tonalytica? My queries are not running - wondering if data is wrong? or too big?

Michaell: Alright, thank you fam. I'll try it 🙌 (reply to 102544)

Sagara: I see these error logs in /var/ton-work/logs*  It seems due to some reason db inconsistent. Is there any way to recover this?  [ 1][t 4][2024-09-05 15:42:51.241524245][manager.cpp:2548][!manager]    STATUS: last_masterchain_block_ago=453781.2s last_known_key_block_ago=492146.2s shard_client_ago=454142.2s [ 2][t 4][2024-09-05 15:55:53.640051935][validator-engine.cpp:1200][!mem-stat]  JEMALLOC_STATS : [ timestamp=1725551753 allocated=4845512 active=5132288 metadata=7066424 resident=12042240 ] [ 1][t 4][2024-09-05 16:09:57.992690017][manager-init.cpp:326][!starter]        db inconsistent: last state ( [ w=-1 s=9223372036854775808 seq=40048248 dxgkCuxJ++zzzzzzzzzzzzzzz+xxxxxxxxxxxxxxxxxxx= baRMntpDGbQ02r+pppppppppppppppppppppppppp= ] ) not received [ 1][t 4][2024-09-05 16:31:10.798796230][manager-init.cpp:326][!starter]        db inconsistent: last state ( [ w=-1 s=9223372036854775808 seq=40048248 dxgkCuxJ++zzzzzzzzzzzzzzz+xxxxxxxxxxxxxxxxxxx= baRMntpDGbQ02r+pppppppppppppppppppppppppp= ] ) not received

Champer Wu: it’s also help me ! (reply to 102544)

JT: Quick question: is there any solution to transfer Jetton tokens to a batch of users?

User<7464188086>: maybe. (reply to 102554)

Sagara: In My case it shows in /var/ton-work/logs* that  "db inconsistent: last state" (reply to 102417)

Champer Wu: High load wallet (reply to 102554)

JT: Thanks. Does it save cost? (reply to 102557)

Champer Wu: if the number of your txs are large, it could save cost , because you can save the external message fee.

Carter🧹: I'm looking to get the actual wallet code to compare Jetton Wallet Code across many Jettons.  I can pull the Cell from get_jetton_data, and I assumed it would just  be a long string of cells containing data bytes. It looks like this is not the case.  Does anyone know of more documentation on how this data is stored, and how I can extract the actual bytecode of the Jetton Wallet Code?

Screens: Hi Guys is USDT the only native stable coin on TON network?

Mohit Madan: Seems like it (reply to 102563)

Champer Wu: Yes, ton blockchain doesn’t exist other stable coin including Non-Collateralized Stablecoins right now (reply to 102563)

&rey: (Claiming that something does not exist is so adorable! Though, in this case other non-bridged stablecoins probably do not exist, so alright.)

Champer Wu: haven’t existed yet 🙃 (reply to 102567)

Kryptonite: how can i generate TL-B schema for my func smart contract ?

Carter🧹: Is there any info on deserializing the 'code' from a Cell? Are these codepages?

Alex: Hi guys, Im developing a wallet for ton network. But I cannot find any ton project on ton testnet to test it :(((, can anyone please help me?

exito95: Someone interested in a partnership for developing an app for the ton blockchain?

Alexander Burakhin: I have several questions about the printTransactionFees function from the @ton/core library:  1) totalFees — This already includes fees for the compute phase, action phase, and storage phase. Correct?  2) outForwardFee — This is part of the action phase. Correct?  3) inForwardFee — Is this deducted from the sender or the receiver of the message? Which phase does it belong to?

Razak: I can do it, please send Dm (reply to 102581)

Sagara: Someone from Ton Dev team Please verify that is this something we can recover? (reply to 102552)

Ayor: Wtf

Ayor: Bots are annoying, didn't copy paste my msg, seriously...

k: 🔴 Text AMA dedicated to building on TON is LIVE!    💬 Venue: @RestakingModularity  🎙️ Speakers from EVAA Protocol, Gleam Rewards, TOCD Studio etc.   The AMA will discuss key trends in the TON network, focusing on recent and upcoming developments. Join us to explore innovations and tools shaping the future of the TON blockchain.

Ayor: Can someone turn off this bot please

Ayor: I don't even know which word is making him crazy

Sagara: Hi TonDevTeam @TrueCarry  Please let me know is this something we can recover or not. (reply to 102552)

Ayor: Y_o guys, I'm thin_king about buil_ding my dA_pp on TO_N but it includes micro-paiem_ent, which is not compat_ible with TO_N 0,_3do_llars fe_es.  Do you kn_ow if it's possi_ble to make the paiem_ents via W_allet a_pp (so fee_s are fre_e) in_stead of an o_n-ch_ain clas_sic t_x (wh_ich is 0_,3doll_ars fee_s) plea_se?

Ayor: Here what I'm forced to do in order to post my msg 🤢

Амир: Only if you implement specific functionality with message signing as in general ton wallet (reply to 102617)

&rey: Wallet doesn't solve zero-fees problem for you; it is also by far not the best choice for users. (reply to 102615)

&rey: You should consider payment channels... ah, those are not available in most wallet apps, sorry.

Ayor: Ok sad, I was very hyped by this.  I have to wait a L2 on TON (reply to 102619)

Ayor: Thanks !

&rey: To send an internal message to jetton wallet, you need something converting external=>internal. Wallet contract is exactly that. (reply to 102624)

&rey: You can choose such wallets that they are in same shard as specific jetton's wallets. That's (now) 4 bits of unlikelihood per jetton. (reply to 102626)

&rey: Shards are deterministic and may only split or merge at predefined points. While max split depth is 4, then all workchain accounts with same 4-bit prefix of hash part will always be in the same shard. (reply to 102630)

Амир: You can implement same logic as in v4r2 with external msg processing (reply to 102624)

&rey: Yes. If you decode base64, first two bytes are tag and workchain, and the third byte starts hash part. (reply to 102634)

Minimal ☄️: Guys, can I accept TON as a currency in my game when one wants to play it or I must use stars? I see the applications mostly using NOT, nobody uses TON, why is that?  does this mean I must use stars?

Ihor: Hi! It looks like the latests zfs snapshot available for the TON node is from 17 June. Is this expected? https://archival-dump.ton.org/dumps/

User: can be social network on web3 or gambling among friends

User<5762094943>: Hi everybody i hope all things going good,  I have a question, How can I decrease fee of transfer token to be very low  for exp normal fee of transfer tome os 0.026$ right but i want sent transaction with very low fee like 0.00000014$  is that possible cause i saw that before i will share screenshot to check see it

User<5762094943>: so let me know if that possible

&rey: Fees are not variable; they depend on computations used up in each transaction of a tree, message count and size, etc.

User<5762094943>: so its depend on message bits? that what i understand from you (reply to 102665)

Kiarash_SM: /stat@combot

User<5762094943>: like here (reply to 69146)

Fereshte: The fee that the api was showing was not correct.. The real fee was much higher (reply to 102671)

&rey: It doesn't take transaction tree into account, yes. (reply to 102681)

User<5762094943>: but i recive trasaction when i check the fee i find thos very low fee (reply to 102663)

Mark: Hello 👋  Does anyone have the source code for a non-custodial wallet? On the ton blockchain. If anyone has, please unsubscribe in private messages.

H: hi hru all , i have this problem on calling get method on funC , below is my funC code   (int, int ) get_content_price(cell content_nft) method_id {       (_, _, _, _, _, cell key_value_content) = load_data();   (cell actual_price_slice ,int found) = key_value_content.udict_get_ref?(256, cell_hash(content_nft));       throw_unless(300, found == -1);       slice pd = actual_price_slice.begin_parse();       int actual_price_ds = pd~load_coins();     return (found , actual_price_ds ); }  And this is my wrapper code     async getContentPrice(provider: ContractProvider,content_nft:TupleItemCell ){           let res = await provider.get('get_content_price', [content_nft] );          let found = res.stack.readBigNumber();         let actual_price_ds = res.stack.readBigNumber();           return {             found,             actual_price_ds         };     }  When im calling getContentPrice function I get this error: Error: Unsupported stack item type: -1

Sadman: is there any easy way to tranasfer tokens from ton wallet without ton coin in the wallet?

DeFi: No, of course not. You need TON for gas. (reply to 102696)

Sadman: like useing smart contract?  paying gas fees from a main wallet? not possible? (reply to 102697)

Sadman: i just want to avoid topup ton in sender wallet. can use gas fees useing any others way?

AIRFORCE 🐶🦴🐾 🆙 UXUY: hi i made a mistake with the tag memo of my transaction to BINANCE yet BINANCE resent money on my telegram wallet however i do not see it please help me to take the money . this is the refund transaction ID sent by BINANCE .Help me please

AIRFORCE 🐶🦴🐾 🆙 UXUY: Who can help me when I do news dogs transaction I receive it on my wallet yet my others 27100dogs that I can see on ton explorer do not show me on my telegram wallet

User<5762094943>: Guys, I need TON DOCS guide of deploy cNFT all steps

User<5762094943>: BTW Im using thos contract: https://github.com/yungwine/compressed-nft-contract

User<5762094943>: ANY HELP

&rey: That's unfortunate, as they refunded money to Telegram's common wallet, not yours. (reply to 102702)

AIRFORCE 🐶🦴🐾 🆙 UXUY: Yo can you help me please ? (reply to 102710)

AIRFORCE 🐶🦴🐾 🆙 UXUY: What do you meed ??

T.E.I 🇨🇦Tooncinator 🌱SEED FLIES 🪰🍑$WIFE: Hello does anyone know why I keep getting automatically banned from chats?  Not even  sharing links

FakeName: Hey can i get any docs or previous soulbound NFT contract in tact ?

✨ Uni: hello, how to understand transaction is with usdt using get transactions by address at tonapi?

— 2024-09-07 —

Vladimir: See readme here https://github.com/cube-worlds/compressed-nft-api (reply to 102709)

User<7453272423>: Can you recomend me, if I want to deploy on TON what library can I use??

🐸🌱SEED Blessing 👾 BITS🍅🐐Ⓜ️ MEMES: Hi. I have been blocked from accessing Ton.org

⁪⁬⁮⁮⁮⁮️️: guys what will happen if i send a transaction request with a empty messages field?

No shit: Hello, it was my mistake I wasn't paying attention as wellm but how this could happen? I sent Ton to my TON SPACE.but it turned out not to be mine. Like someone's been added or smth. So I sent 59 TON but as soon as I did smn took and sent the money to another account from this wallet; meaning he has acccess to it. And I checked the history of the wallet and the history isn't mine as well; I have used this Ton Space on this account but now history is completely different and smb has access to it. In the end I lost 59 TON. Anyone can explain how could thing like this happen?

Enrich studio: Hello @everyone  Contact me if you need Blockchain developer

Willie: Hello if you need dev write me, first time i can work for interested idea

Willie: send me txid plz i wanna to check (reply to 102685)

st.et: i am facing this issue over transferring dogs coin. when i confirm and send it says insufficient balance. any solution to this ?

Bruce Lee: I got this error when I try to compile my FunC contracts

User<6835191855>: we're hiring senior rust developer. if you're interesting, dm me

Monika: Anyone has Google play console ? I'm buying

Keyslatam: It doesnt seem to load for me (reply to 102813)

[+_-]: Hey everyone, happy Saturday!  I've been running a sandbox with a mainnet mock, and it's performing terribly: only about one in ten runs succeeds, with most failing due to timeouts (despite increasing all timeout limits, including for requests) or throwing random errors that disappear on the next iteration. I've tried both the tonhubapi link and getHttpV4Endpoint({ network: "mainnet" }). If anyone has extensive experience with the mainnet-sandbox, I'd really appreciate any tips on how to improve this situation. Thanks!

Alex: Hi guys, do you know the best way to find a transaction by transaction hash?

Ramin: Hi, in this repository: https://github.com/xssnick/tonutils-go   how can I use ValidUntil?

&rey: You should have its address and lt as well, to find faster. (reply to 102827)

Alex: Ok, could you give me some advice please… I use the ton connect library for the frontend. The result of send transaction method is BOC. I managed to convert this boc to hash, but I don’t understand how to find this transaction on the backend side, because there’s no such method in toncenter… (reply to 102836)

Alex: Is there a way to take the transaction address from that BOC? (reply to 102836)

&rey: 'course: it is user's address. (reply to 102838)

Alex: What do you mean? (reply to 102839)

User<7347362344>: Hello, i can dev for good idea, if you are insterstring write me in dm

Kael | Miracle | Never DM first 🐦 SUI: Hello. I am trying to code a Jetton token transfer from address A to B. I have tried using tonweb, but npm doesn't support W5. Does anyone have a code example to transfer Jetton tokens using npm ton/ton?

&rey: Btw that hash is not transaction hash, and it doesn't guarantee transaction being recorded. (reply to 102837)

Alex: Ok, what do I need to do with this kind of result? How I can use it to identify the transfer or some transfer details? (reply to 102845)

&rey: wait, transfer details? You have sent the transfer via TON Connect so you probably should already have full order? (reply to 102846)

Alex: I mean any useful data. I have order details, but I don’t have any blockchain info: address, hash, etc (reply to 102847)

&rey: Address? You have both source one (user's) and destination (in order). Hash? You have to listen to blockchain, yeah, because TC2 response doesn't guarantee it. (reply to 102848)

Alex: Transaction address…. Ok, now I’m lost. Could you explain please what’s the answer from the ton connect’s response. It is a BOC which represents what? (reply to 102849)

&rey: That BOC = serialized external message to user's wallet. (reply to 102850)

thebatclaudio: Hello! Can I create an NFT collection and allow other users to Mint NFT?

&rey: Yes, but it's nontrivial. Please try searching.

Alex: Thank you. What is surprising, that I’ve converted that BOC to hash and I am able to search by this hash in ton scan, so I was thinking that I actually can use this hash to find the transaction in blockchain. Do you know a possible way to do so? (reply to 102854)

&rey: Explorers are quite smart so they can look up message hashes as well. (reply to 102859)

Rudolf: Hi guys, do someone know how to get the contract type (interface, like it shows tonviewer), but without using tonapi or some other api service. Thank you

&rey: Well, you need something classifying contract by their code or code cell hash. Also, you need to load contract state somehow; I assume you can do so through liteservers, which are not API. (reply to 102868)

Lucifet🍅: Help what should I do

&rey: This is scam. Not returnable actually. (reply to 102872)

Willie: sad (reply to 102872)

Lucifet🍅: What should I do 😭😭 (reply to 102873)

&rey: Not repeat that experience, probably. (reply to 102876)

Willie: crypto dont have admin, you cant return your money

Willie: you saw your transaction, you lost your tons its not our problem. You need be careful

Lucifet🍅: Why not when you got stolen and you know where address of the scamer is (reply to 102883)

&rey: I acknowledge; blockchain by design is IMMUTABLE storage of transaction.

&rey: (You have better chance to convince scammer to return money than doing something onchain.)

Lucifet🍅: And why then ton support just contact me now

&rey: More scam? Watch out, they'll say "just send a bit more money". (reply to 102903)

&rey: Blockchain is an automatic system. Can you prove to computer that you intended to do something? You can't, so it won't be possible to pull money out.  After all, from chain perspective the situation is equivalent to you being a scammer, sending a payment for something and revoking it afterwards. (reply to 102885)

&rey: I can't recommend using blockchain or automatic systems when you don't distinguish between your assumptions and what will really happen. (reply to 102914)

Lucifet🍅: That 7$ is not much for you but for me it is

DeFi: It's gone. You can't get it back. (reply to 102922)

Willie: sometimes bank cant return your money

Willie: and you wanna return your money in automatic system

Willie: where you cant cancel transactions or change data of it

Руслан: hi to everyone, can anybody explain is that possible to get nft collection address by nft-item address onchain?

Руслан: @pcrafter wtf man? stupid question?

&rey: That is impossible, I meant. (reply to 102939)

Руслан: dig it, have some ideas to find a solution for my case (reply to 102946)

Fai: Hii

Sumaya: Hi

Vetle: Hi, in apps like Notcoin. Does the mini-app communicate with a backend or how is the data stored? In other apps, we usually do have a dual setup with RPC and a backend, However since telegram has the account already, i’m not sure how much we need to store?

Gold: Would you please tell me how can I send the jetton from wallet to contract?

User<6576297005>: I am proficient in UX/UI, front-end, and creating AI-driven TG bots/mini apps/web/mobile apps,smart contract writing and integration on multi chains.

— 2024-09-08 —

final: Yes (reply to 102964)

Thea: Hey a question please can I deploy NFTs using Metadata on TON

Çağatay: Hey guys I am having a bit trouble here

Çağatay: https://tonviewer.com/transaction/336e3140a5e3d1f8b5e81a0db660082006cb381cf28f21f38bcd5d4fd44e33da?section=trace  https://tonviewer.com/transaction/e905a9ec90b125f56cec641da37ecde50fcab9d19621c6e741dcaca9926bac50  These 2 transactions are both passing the USDT transfer checks I made

Çağatay: I am checking for both Op Code and destination with value but both of these checks and only one of them sends USDT

Çağatay: How can I make sure that the user only transfers USDT?

User<7012417474>: How to get tx.boc after use transfer function of wallet in tonweb, somebody can help me

Lukasz: Hey guys I try add new function in custom smart contract- token minter. This function is like freeze account but I have all the time some problems. Can somebody tell me it’s possible add function like this? please DM

Lukasz: Yes I try do this, always get some errors when try build project. Can I ask you some question on DM? (reply to 103050)

Mohammad: How to create this button for my website? Anyone have a example code for this?

User<7347362344>: use tonconnect (reply to 103055)

User<7347362344>: https://www.npmjs.com/package/@tonconnect/ui

𝙁𝙇𝙊𝙊𝙊𝙒: Hello! I have this NFT on my wallet, please tell me what its functionality is?

Mahdi: It seems Some servers in Europe cannot connect to TON minter and TON viewer servers, and we get 503 for most of functionallity.  Any one knows something about this? (reply to 103052)

Mahdi: Is this related to the new European  sanctions against TON chain?

&rey: 503 exit code is "503 Service Unavailable" — probably something went down. You should check out what, in "Network" panel. (reply to 103070)

jun_song: /bin/sh: 1: /root/tondemo/minter-contract/node_modules/ton-compiler/bin/macos/func: Exec format error  FATAL ERROR: 'func' with version >= 0.2.0 executable is not found, is it installed and in path?   How should I deal with this problem?

Mahdi: it's work in some another countries

jun_song: If I use the func project created by npx create-ton@latest, it can run npx blueprint build normally

&rey: or, perhaps, at another time? (reply to 103075)

Mahdi: Our marketplace have too much problem  to connect TON minter and TON viewer Servers after sep 4, We did not change anything from our side (reply to 103077)

Mohammad: Are you have example for this I do not understand this (reply to 103060)

Mahdi: for example it's work here:

Daniil: Hi guys!  Tact question.  Does anybody know how to calculate a hash of the struct?  I receive internal msg with struct Item: struct Item {     prop1: String;     prop2: String;     prop3: String;     prop4: String; } and I wanna save its hash with price in a small map like a catalog. If I use  sha256(msg.item.toCell().asSlice())  it returns the same hash for all incoming items (probably because it hashes only ref cell). So what is be the best approach of hasing a stuct with string fields (taking into account, that sha256 is relatively havy hash func and I can stand with lighter hashing)?

Mahdi: You don't have problem like this?  where is your server? (reply to 103077)

&rey: I don't have a server running lately (what would it even mean to connect it to Tonviewer, by the way?) but suspect that problem is in the services, not due to some block. (reply to 103084)

User<7012417474>: I dont know how to get a boc of a transaction after send like sendTransaction of ton connect ui coding in js, pls help me :(

User<7012417474>: sendTransfer only return void

31dzairy: Help Needed with Stolen Assets Stored on Username NFTs  Hello team,  I’ve lost over $20,000 in assets through an exploit, and I’ve traced them to a DNS associated with a username on the TON blockchain. The scammers used the Fragment platform and stole my anonymous "888" blockchain numbers. I’ve uncovered disturbing details about the accounts involved, including strange usernames and likely photos of one of the individuals.  Who is responsible for handling cases of stolen assets being stored on username domains, and can anyone assist with tracking or recovering them?  Thank you

&rey: No one can move assets on blockchain back. (reply to 103094)

31dzairy: i klicked something wrong. but anyway is there a way to freeze stolen assets

&rey: Nope. Blockchain thinks of those assets as "lawfully" transferred (according to rules of signature verification and gas payment), and doing anything else than processing NFTs as usual would be consensus violation. (reply to 103096)

Denis: Hi, when using app tonkeeper links, which exact cells should I put to bin and init params to deploy contract? empty cell boc as base64-url for bin and code+init cell boc as base64-url for init doesn't work

&rey: Well, it should work for FunC contracts. Do you also set value = 1 nanoTON? (reply to 103100)

JC: Hello everyone, I use the typescript Ton client, I want to know how to confirm whether the transaction is successful or failed? If it fails, I hope to get the VM Exit Code

JC: I may have missed the method mentioned in the document, but I really didn't find the best practice. .

JC: Because I found that the send method has no return value (I think this may be due to asynchronous reasons), but usually a send method will generate multiple transactions (such as Jetton transfers). I hope to get whether a specific call (such as Jetton notification) is successful. Is there any good way? (reply to 103102)

Denis: Yes, I tried 1 nanoTON, and 0.1 TON also Any option to get full error text? it just says error (reply to 103101)

&rey: Tonkeeper's debug menu might help. (reply to 103115)

Centix ・ Kronos Bot: did this resolve? (reply to 95269)

Sofia: Looking for a sticker designer please DM portfolio

Vgo: a Main contract (parent) have many User contract (children)

Vgo: how to know all the children addresses ?

Vgo: in ethereum, as far as i know, Main contract is a long list and contains all children data including addresses in TON, how to know all the children addresses ?

User<7543285525>: Guys,who WONna see my project?

Alan | Torch: I have a question a about tonstakers, there are two mode to choose - one is optimistic and another is pessimistic. What is the difference between them?

&rey: What for? You can deterministically derive them instead. (reply to 103138)

C.: Every address is created in deterministic fashion so you don't have to hold information regarding to child addresses. If you want to query the jetton wallet address of a EOA you just send a get query to the minter contract and it will return you the jetton wallet address.   https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc  In this implementation at line 147 it shows the reference implementation of the get query for example. (reply to 103140)

Cobra xAI • wizmo: Hey everyone

H: hi can i filter transactions by recipient address with tonapi ?? i didnt find such a  param in getAccountEvents😕 const httpClient = new HttpClient({     baseUrl: 'https://testnet.tonapi.io',     baseApiParams: {         headers: {              'Content-type': 'application/json'         }     } }); // Initialize the API client const client = new Api(httpClient);   // Fetch a typed array of account events const events = await client.accounts.getAccountEvents(address, {limit: 100, initiator: true });

Boss: const httpClient = new HttpClient({     baseUrl: 'https://testnet.tonapi.io',     baseApiParams: {         headers: {              'Content-type': 'application/json'         }     } }); // Initialize the API client const client = new Api(httpClient);  // Fetch a typed array of account events const events = await client.accounts.getAccountEvents(address, {limit: 100, initiator: true });

Boss: /stat@combot

Optimus: hi guys,  my ton wallet extension in chrome is not opening when I click it, any idea what I can do to fix it?

Optimus: ?

Atsushi: Hello, fellow developers! I am also a TON app developer, but I've run into a problem that I can't solve on my own, so I would like to ask for your wisdom and experience.

Atsushi: About a week ago, I developed a Telegram mini app game and submitted a review request to have it listed on the "TON App" site, but it was rejected. However, I have no idea why it was rejected. When I contacted support, they only replied with "Reviews have been published," and I couldn't figure out where to check the details. Has anyone experienced something similar and managed to resolve it? If so, could you please share how you resolved it? (reply to 103190)

— 2024-09-09 —

Gold: Who can explain how can I mint the test jetton for TON testnet? I need to mint 2 jettons for testing in the TON testnet

Haint: when will the FunC language support extension for vscode be updated? The try catch syntax has been broken for a long time now but it looks like it's not getting fixed...

Tung: Hi guys,   I was wondering if there's any ton game publisher right now? We have a few games made for telegram, but we don't have the experience or the capital to take our games to market. If there's anyone who knows of any decent TON game publisher, please let me know. Much appreciated

User<7012417474>: const cell = await deployer_wallet_contract.createTransfer({     seqno,     secretKey,     messages,     sendMode: 1,   } as any);    await deployer_wallet_contract.send(cell);    const hash = TonWeb.utils.bytesToHex(await cell.hash());  somebody know why when i gen a hash from cell it cannot search in tonviewer

Justin1: Hi, is it possible to calculate the exact gas consumption when contract handle a message?

Dmitry | backend4you.ton: https://minter.ton.org/?testnet=true (reply to 103197)

&rey: To answer that, you need to ask "who will provide value, if any" first. That implies that one of these must happen: — someone must buy out those NFTs at no profit to themselves, — someone must add utility like access to a closed community, — someone must reward NFT holders. (reply to 103219)

lan: does anyone know how to debugging in import file

Bruce Lee: Hey guys I want to ask a question

Bruce Lee: when I deployed an NFT on ton Network

Bruce Lee: How to set the nft attributes

Bruce Lee: Yeah

Bruce Lee: I think there is some problem when I attributes's config

Bruce Lee: I can set name description and image values only

H: hi can i filter transactions by recipient address with tonapi ?? i didnt find such a  param in getAccountEvents😕     baseUrl: 'https://testnet.tonapi.io',     baseApiParams: {         headers: {              'Content-type': 'application/json'         }     } }); // Initialize the API client const client = new Api(httpClient);  // Fetch a typed array of account events const events = await client.accounts.getAccountEvents(address, {limit: 100, initiator: true });

Sufiyan: does any know how to interact with deployed nft contract on testnet

Kapil: Can we store tuple on the blockchain

Dmitry | backend4you.ton: yes and no. You need to "serialize" it to cell manually, you can do it by storing members "one-by-one" only. Later you'll read them back (from slice), one-by-one again (reply to 103252)

SH: decode msg body from the event (reply to 103249)

Kapil: How we can Store (reply to 103254)

Dmitry: Hi everybody! We made an educational TON based wargame https://www.hacktheton.com/ it will be helpful for beginners and everybody who want to learn more about how TVM works and how to develop safe TON smart contracts

Dmitry | backend4you.ton: get values one-by-one and use correct version of store_... https://docs.ton.org/develop/func/stdlib#builder-primitives (reply to 103258)

Kapil: Can we store directly just as of the dictionary (reply to 103262)

Dmitry | backend4you.ton: no (reply to 103263)

Atsushi: Hello! We also provided all the necessary information, but our listing on TON App was rejected. We contacted support as well, but the only reply we received was "Reviews have been published." We responded with "I'm sorry, but I'm not sure where I can find the published review. Could you please let me know where I can check it?" and sent several follow-up messages, but we haven’t received any further replies from support, which is quite frustrating. Have you had any progress on your side? (reply to 100049)

Josh: Anybody know where/how I can download transactions data of a ton wallet to a csv? I don't see an option on Tonscan or Tonviewer

unreadyplayer: Nope. Last 'feedback' we received was that our app looked unfinished, even though it is.   Very broken process and I guess it comes down to the whim of whoever is looking over the application at that time. (reply to 103265)

Vgo: Thank you so much! i am going to try it (reply to 103152)

Atsushi: Thank you for sharing that.  Based on that feedback, it seems like the review criteria might be whether the features expected by TON App are implemented. 🤔 That being said, I can only hope they tell us what exactly looks unfinished...  > Very broken process and I guess it comes down to the whim of whoever is looking over the application at that time. I completely agree. Haha. (reply to 103269)

the_renovatio: hey, is there a way that a transaction is 100% deployed to the blockchain? right now i am using tonapi to send the boc, but sometimes the transaction does not change the seqno of the wallet, so transaction is not processed by validators. do you know a solution?

Carter🧹: liteServer.getAccountState is giving me back pruned state, starting with a merkle proof.  How can I get it to give me the complete state for the account? I want to get the code for the account.

Carter🧹: Ah I didn't see there was two, but I'm definitely calling the non-pruned version. (reply to 103283)

Carter🧹: Maybe it's my deserialization, though I thought I would have found all bugs in this as I can deserialize full Block structures

Carter🧹: Could be something has gone wrong in my deserialization of this message, looks like I have zero length Proof so maybe I skipped this field 👀

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 54 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 40  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

User<6753518952>: Is there are anyone looking for dev?

Carter🧹: My TL ReadBytes was not aligning to 4 bytes, leading me to read the Proof into the State field. Thanks for your time. (reply to 103287)

Champer Wu: I don’t know my understanding for your question is correct or not. the source code about it would help you? https://github.com/tonkeeper/tonapi-js/blob/39a75cbd5f795ccd143ffd7309ee3f2de41ac4de/packages/client/src/client.ts#L6283 (reply to 103249)

Rayan: Hi guys, is there any open source indexer project for ton?

Champer Wu: {   "content_url": “string”,   "description": “string”,   "name": “string”,   "image": “string”,   "attributes": [] }  meta data reference about nft item (reply to 103245)

Champer Wu: set it like that https://tonviewer.com/EQDcGA3X02JsnGvfG-OSEP3vEm-h-rcRNsVo_wYSu5lioGCV?section=nft (reply to 103245)

Bruce Lee: Yes

Bruce Lee: yes , just like this (reply to 103296)

Champer Wu: did any problem occur? (reply to 103298)

Sina: Hi. Hope you're doing well.  I'm minting a new token and getting this error message: {     "ok": false,     "error": "No working liteservers with ls_index=None, archival=None",     "code": 503 }  Any ideas what caused this?

Gold: When I send the jetton from wallet to contract, I got the Cell underflow issue

ᴅʏᴜᴛɪ ᴅɪᴘᴛᴀ: Custom Telegram Bots & Mini Apps, Built for You  Need a Telegram bot or mini app that’s tailored to your business? I specialize in creating efficient, feature-packed solutions designed to meet your specific needs.   I can build anything on your requirement     Why choose me?    - Advanced features, fully customized   - Mini apps to streamline your tasks   - Regular updates and clear communication   - Fast, reliable delivery  Let’s bring your ideas to life. Contact @DyutiVertex today!

User<7091391048>: Is there anyone need blockchain and telegram mini app developer?

Soon Guan: I have a follow up question - so is internal transfers or is transfers alone the ground true for the transfers of jettons on ton? (reply to 102617)

Soon Guan: I.e. can I effectively find the universe of all jetton transfers from transfers or internal transfers or a combination of both?  The current dilemma is whether to need to index them (reply to 102617)

Nerses: Hi everyone, I'm using the ton/ton SDK, and when I call the master contract's public getter to retrieve the jetton wallet address, I get exit code -13. Could anyone help me understand what might be causing this error?

Wiz: Hey!  I've been wanting to be here for a long time now!  Years!    I created a mini app for our game and the bot and web page and python call is all polling and working well BUT the button isn't showing up so that we can pin it in the community etc.  Can I have someone check this out with me?

Wiz: Did you find them yet? We’re working on the same thing now. (reply to 103329)

Bruce Lee: I wrote the package metadata function like this    export function setItemContentCell(content: itemContent): Cell {     const itemContentDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())         .set(toSha256('name'), toTextCell(content.name))         .set(toSha256('image'), toTextCell(content.image))         .set(toSha256('attributes'), toTextCell(content.attributes))         .set(toSha256('description'), toTextCell(content.description))     ;     return beginCell()         .storeUint(0, 😍         .storeDict(itemContentDict)         .endCell(); } (reply to 103299)

Bruce Lee: But the attributes cannot be displayed (reply to 103339)

Mark: Hello 👋  Does anyone have the source code for a non-custodial wallet? On the ton blockchain. If anyone has, please unsubscribe in private messages.

Wiz: Play not triggering the button

Wiz: And in group this button not available

Optimus: hi guys,  my ton wallet extension in chrome is not opening when I click it, any idea what I can do to fix it? (reply to 103184)

Minimal ☄️: Hello everyone, it's nice to be here!  I have one question that I have not understood completely from TON's announcement when it comes to use of the stars/TON in the mini apps.  I am developing a game which would use a TON as a in-game currency (people would essentially bet using TON), but I saw that Telegram said that it developers MUST use STARS as a currency and not a TON coins, is that true or did I misunderstand that?

Santosh: Hi guys, I've been getting timeout error when deploying a counter contract. I'm using npx blueprint run to deploy the contract. The contract was autogenerated by blueprint.  Awaiting contract deployment... [Attempt 1/10]AxiosError: timeout of 5000ms exceeded     at RedirectableRequest.handleRequestTimeout (/Users/santoshshirahatti/playco-workspace/counter/node_modules/axios/lib/adapters/http.js:657:16)     at RedirectableRequest.emit (node:events:527:28)     at RedirectableRequest.emit (node:domain:475:12)     at Timeout.<anonymous> (/Users/santoshshirahatti/playco-workspace/counter/node_modules/follow-redirects/index.js:221:12)     at listOnTimeout (node:internal/timers:559:17)     at processTimers (node:internal/timers:502:7)     at Axios.request (/Users/santoshshirahatti/playco-workspace/counter/node_modules/axios/lib/core/Axios.js:45:41)     at async TonClient4.getAccountLite (/Users/santoshshirahatti/playco-workspace/counter/node_modules/@ton/ton/dist/client/TonClient4.js:109:19)     at async TonClient4.isContractDeployed (/Users/santoshshirahatti/playco-workspace/counter/node_modules/@ton/ton/dist/client/TonClient4.js:122:23)     at async NetworkProviderImpl.waitForDeploy (/Users/santoshshirahatti/playco-workspace/counter/node_modules/@ton/blueprint/dist/network/createNetworkProvider.js:147:32)     at async Object.run (/Users/santoshshirahatti/playco-workspace/counter/scripts/deployCounter.ts:22:5)     at async run (/Users/santoshshirahatti/playco-workspace/counter/node_modules/@ton/blueprint/dist/cli/run.js:20:5)     at async main (/Users/santoshshirahatti/playco-workspace/counter/node_modules/@ton/blueprint/dist/cli/cli.js:100:5) {   code: 'ECONNABORTED',

Steve: hi. does anybody have experience with dedust SDK?  i am looking at their docs to swap jettons to TON, but it doesn’t make much sense tbh: https://docs.dedust.io/docs/swaps

NPA120: You can use this link:https://docs.ton.org/develop/dapps/cookbook#how-to-send-a-swap-message-to-dex-dedust (reply to 103397)

Steve: To swap TON to JETTON, sendSwap method is used of tonVault.  However, when I am following the docs to swap JETTON to TON, scaleWallet.sendTransfer is used.  When I look at the typescript code, – const scaleWallet = tonClient.open(await scaleRoot.getWallet(sender.address); – scaleWallet does not have .sendTransfer method…  Maybe I am missing something…  Also can’t find from the docs what sendTransfer ultimately is:   await scaleWallet.sendTransfer(sender, toNano("0.3"), {   amount: amountIn,   destination: scaleVault.address,   responseAddress: sender.address, // return gas to user   forwardAmount: toNano("0.25"),   forwardPayload: VaultJetton.createSwapPayload({ poolAddress }), });   for example, what is the second argument of toNano(“0.3) ?

Testarudo: Im building a mobile dapp and trying to use ton connect to connect to a wallet and perform transactions however the Dart library is not really working and the react one crashes on the mobile builds (react native). Is anyone building mobile apps on ton? which stack are you using?

Maestro 731: Hey, that’s awesome that you’re building a mobile dApp on TON! I understand the challenges you’re facing with the Dart library and React Native. TON’s ecosystem is still evolving, so mobile support can be tricky. I'll help you. (reply to 103402)

Wiz: I’m building our game out on TON.  It’s always nice to meet other builders.  Our game is working but I can’t get the button show up in the Group channel.  Have you figured that out? (reply to 103402)

Jmacdev: you mean the inline menu button? (reply to 103435)

Wiz: Yes! (reply to 103436)

Jmacdev: maybe i can help

Wiz: That would be amazing! (reply to 103438)

Jmacdev: dms open (reply to 103441)

Testarudo: What stack are you using? I (reply to 103435)

Testarudo: I would love to hire flutter dev or react native that can help me with my dapp

Wiz: Focusing on AI integration and python and telegram mini app building (reply to 103443)

Wiz: Got it. Let me know how I can help. (reply to 103457)

Testarudo: Nice! I could help you with your project (reply to 103456)

Testarudo: I can help! And I'm also looking for one (reply to 103457)

Wiz: ?? (reply to 103462)

User<7464188086>: okay, I hope to work with you. (reply to 103457)

Jmacdev: dm open bro (reply to 103465)

— 2024-09-10 —

Optimus: hey man, unfortunately clearing cookies of the whole history hasn't helped any.  I still can't open the extention  I don't have the private key backed up 😢 (reply to 103382)

Milos: hey mate, what do you want? (reply to 103397)

Vincent: hello guys, is there a way to get the current smart contract address just like address(this) in solidity?

Carlos 🐈‍⬛: hey guys i made a coin on gas pump how can i burn tokens?

User<6563347363>: Hey, I just started playing on TON recently. Is there anyone who can show me around?

Vincent: And another question is : how to get the token address from TokenNofitication ?

Arjun: Hello, can anyone explain how to sign utf8 messages using Private key and verify the same ?

Arjun: or send link to any doc for the same ? (reply to 103507)

&rey: my_address() (reply to 103498)

Carlos 🐈‍⬛: hey people

Carlos 🐈‍⬛: do u guys now how can i burn some tokens from a coin i create on gaspump?

&rey: Get sender of TokenNotification; that's your jetton wallet. You can query master address from it if you need so, or match offchain. (reply to 103506)

&rey: Are you aware that TON doesn't have transactions on multiple contracts, so payment for all of gas must be sent from initial wallet at the beginning?  Those 0.3 TON are used for fees, message delivery and forwarding 0.25 TON to DEX. (reply to 103399)

&rey: scaleWallet.sendTransfer is some function sending jettons. It might be alternatively written as sender.sendTransfer(..., destination: scaleWallet.address, ...)

Kapil: Can we use the keccak 256 in the ton

IMe: Any ton dev dm me. Need a project to be done. Will be paid

Slava: Probably https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07 (reply to 103521)

Davis: Does the lack of domain check in TON Proof affect security?

Peng: has anyone face this issue with ton-index-worker-1 before?

[+_-]: Hey everyone! I stumbled upon this tonhubapi phenomenon and noticed it can be used in TonClient4 and self-hosted. However, I can't find any detailed description of this API, its limits, or best use cases. If I implement it in the backend, what should I expect? If anyone has experience with this, I'd appreciate any info, including where to find more details. Thanks🍪🍪

Орельан [NEVER DM FIRST]: Better to describe what you need to be done here, so that people can know more about the project (reply to 103523)

TKAINU: Hello, i using NestJS to call smartcontract, but err error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by account 6D68A164FED5BE9C2EF10A967EF95292FF73B7B80883ECE1A4F619D76D9E01D2 before smart-contract execution',       code: 500

Champer Wu: smart contract couldn’t accpet external message you should call your wallet by external message and send internal message to the contract via your wallet. (reply to 103542)

TKAINU: I understand, thank you (reply to 103543)

Vincent: Thank you, my dear. but how to use my_address() in tact? (reply to 103509)

Vincent: gotcha, using myAddress() in tact lol

G: Hey guys, I have a problem about getting the comment text from in_msg body The thing is, I got a unreadable string from loadStringTail(). Pls if anyone can help me, thanks..         const body = txn.in_msg.message_content.body;       console.log(Cell.fromBase64(body).beginParse().loadStringTail());

G: like this?  Cell.fromBase64(body).beginParse().skip(32).loadStringTail()   it seems that still have unreadable string. (reply to 103550)

G: but less than before  �n�_�=�N!�,aF%E����0�z�                        i�ϫ�(p�~]ud{I;O�a6y/���9�ky)��f�0                                                         B;�;KѲ�i��ځ�&�>z$�����r���~�^�!��P3bb8d6b6_plan_0 (reply to 103552)

G: btw I got the opcode: 0x8d90f14c in my in_msg, is this effect anything? cause I saw the example said if it's a simple message with comment, the opcode is 0 (reply to 103547)

G: I got this body from ton indexer api transactionsByMessage (reply to 103555)

G: but in the ton viewer the opcode is 0.

TKAINU: hi, I updated the code but still the same error (reply to 103543)

Champer Wu: https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages#simple-message-with-comment (reply to 103557)

TKAINU: my body: (reply to 103559)

Champer Wu: what’s the error message you see?

TKAINU: my msg: (reply to 103562)

Champer Wu: const seqno = await wallet.contract.getSeqno();       await wallet.contract.sendTransfer({         seqno,         secretKey: wallet.keyPair.secretKey,         messages: [           internal({             value: "0.03",             to: contractAddr,             body: body,           }),         ],         sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,       });       return seqno;  try this way ? (reply to 103563)

Steve: TypeError: Cannot read properties of undefined (reading 'v2-mainnet’)  Anyone else having this when trying to init TonClient ( this.client = new TonClient({ endpoint: await getHttpEndpoint({ network: 'mainnet' }) }); ) ?

Champer Wu: try to skip query_id (`skip(64)`)? (reply to 103557)

Champer Wu: skip(32).skip(64).loadStringTail()

TKAINU: same  TypeError: Cannot read properties of undefined (reading 'v2-testnet') (reply to 103569)

Steve: I think some service is down :S

kj: /stat@combot

TKAINU: i try but same err: (reply to 103568)

Vincent: When I am trying to deploy, I met the error:  TypeError: Cannot read properties of undefined (reading 'v4-mainnet')

Vincent: Is there anybody meet the same issue

Steve: i have similar issue

Steve: Cannot read properties of undefined (reading 'v2-mainnet’)

Steve: i have tried to init TonClient with different urls as well, but no luck

TKAINU: I was successful, the solution is to switch from WalletContractV4 to WalletContractV3R2 (reply to 103568)

Mark: Hi I built my game on Godot, how can I integrate it to the TON Wallet?

Steve: does anybody know of a good (detailed) tutorial that teaches how to send Jettons to another wallet? (node.js)

Setmax: Hey guys, Is there any way to partially sign a transaction? I want to send Jettons to another wallet and have the receiver pay the transaction fee.

&rey: That's not possible except with wallet v5. (reply to 103618)

Setmax: Are you sure? (reply to 103646)

Setmax: do you have any sample code for this purpose with W5? (reply to 103646)

C.: I am confused about parsing onchain jetton metadata. Can anyone give any tips?

C.: After calling get_jetton_data how do I parse the content part

User<7453272423>: Lol, whats wrong with f r e e

&rey: Recording data in blockchain costs something, compiling a contract on a few dedicated nodes also takes resources, so you have to spend those 0.5 TON in verifier.ton.org.

Camel: Hey mate, I want to message people who use my Telegram web app using the Telegram Bot API. How can we collect the chat_id to message them? I'm looking into the data returned from useInitData (@telegram-apps/sdk-react), which already has an interface for chat, but I cannot retrieve this information. Is there another way to private message a user with data obtained from TWA? Ty

Kratoste: I can help you (reply to 103698)

Nerses: is there any example howe to use ton/ton sdk runMethod ?

Bit: HI，I use python. I find out that in case of private chats between user and bot ,the chat_id is equal  to user_id. May be it could help you. (reply to 103698)

Anonicz: A node has fallen and one function needs to be enabled.  The server is powerful, I will provide the data.  Whoever fixes it, I'll pay.

User<7458131604>: Chess and cards here.

&: This happens due to bad parameters or function name Check get function's parameters carefully on smart contract (reply to 103716)

&: You can test your params and funtion's name via tonviewer.com (reply to 103717)

&: save the user's chat_id to send message to him. (reply to 103698)

Steve: This is for ton, not jettons, right? (reply to 103715)

&: const keyPair = await mnemonicToWalletKey(mnemonic.split(','));      const wallet = tonClient.open(         WalletContractV4.create({             workchain: 0,             publicKey: keyPair.publicKey         })     );     let sender = await wallet.sender(keyPair.secretKey);      const jettonRoot = tonClient.open(JettonRoot.createFromAddress(jettonAddress));     let jettonWallet: OpenedContract<JettonWallet>;     jettonWallet = tonClient.open(await jettonRoot.getWallet(senderAddress));      const forwardPayload = beginCell()         .storeUint(0, 32) // 0 opcode means we have a comment         .storeStringTail('Hello, TON!')         .endCell();      const messageBody = beginCell()         .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer         .storeUint(0, 64) // query id         .storeCoins(amount) // jetton amount, amount * 10^9         .storeAddress(targetAddress)         .storeAddress(targetAddress) // response destination         .storeBit(0) // no custom payload         .storeCoins(toNano('0.02')) // forward amount - if >0, will send notification message         .storeBit(1) // we store forwardPayload as a reference         .storeRef(forwardPayload)         .endCell();      const provider = tonClient.provider(jettonWallet.address);     provider.internal(sender, {         value: toNano(0.1),         bounce: true,         body: messageBody     }); (reply to 103722)

Steve: Why

Raya: LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by account B1A84CEC0AD79956457F141B6971E15E743C1511B03D81BEBD6664424A64F066 before smart-contract execution'   Why this happens?

Raya: await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [     internal({       to: "UQA61-XKQI5lX0eNxPJA6klwJxiTE7ZNUFrLLQ9esnCWuKR_",       value: "0.01", // 0.05 TON       body: "H", // optional comment       bounce: false,     })     ]   });  Code, it worked before

G`OLD NULL: check seqno is valid.  if seqno is valid your address not have a enough ton for transaction (reply to 103728)

&: Check smart contract code, and your wallet balance (reply to 103728)

Raya: Thanks, I will double check it all

Gleb: Hi all, I'm pretty new with TON. What if I need to store potentially big amount of data for my app? It is not recommended to store it in  the contract storage, but how can I store it than?

Shapeshift77: Along with coding we need to learn how to stop the fake opportunities

&rey: That's... an architecture question with an easy answer: you probably need a backend. Btw quickly-changing items also require backend. (reply to 103733)

Gleb: You mean a simple web 2.0 backend? And using ton only for  payments? (reply to 103736)

&rey: Exactly that. Backend might sign data with Ed25519 keys for some validation in contracts, if needed. (reply to 103738)

Gleb: Make sense. Another question than. Is it possible to call backend from contract to get data? Or send data from contract to backend? (reply to 103739)

&rey: It's only possible from backend side to poll whatever happens with contract. (reply to 103740)

Gleb: Got it. Thank you (reply to 103741)

User<5762094943>: BTW, let me Know  this is contract, in your mind how can I add metadata here any idea or guide,  https://github.com/ton-community/compressed-nft-contract

Jonathan: Hey there, I was digging around in the con-connect documentation and I see references to signData, but connection only has sendTransaction  Is there a way to sign data without sending it?

Shadow: Hello! Can someone help me? I can't send liquidity to my pool. I think, problem is that i sent jettons with wrong rate, but how i can get the good rate for adding liquidity?

User<7464188086>: Hello, everyone. I am a student and I wanna study BlockChain. If good idea, pls let me know. How can I study this?

— 2024-09-11 —

Laisky: I have a thought that I’m uncertain about: the TON protocol does not have built-in defenses against message replay attacks. This means that an attacker could replay historical messages, and contracts must implement their own defense against replay attacks using a nonce. Is that correct?

Laisky: I found this in the white paper that suggests only external messages need to consider replay attacks. (reply to 103798)

shakil🦴💼: ok

Kapil: I am getting cell overflow (exit code 8) error while storing data at the blockchain.

Daniel: Cell overflow. Writing to builder is not possible since after operation there would be more than 1023 bits or 4 references.  https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 103805)

Kapil: I know that but I am asking who I can Store the data without getting this error (reply to 103806)

Daniel: You are writing a lot of data in one cell. The possible solution is to put some data in new cells and store as a ref. If 4 refs is not enough, then to create refs in refs. (reply to 103807)

Daniel: how do you calculate the amount of gas needed for the tx? (reply to 103516)

Kapil: Okk (reply to 103812)

Timyil: How do I fix this error

Timyil: I just received a call from technical support but it was not clear how do I call back

&rey: Please be aware that TON Foundation doesn't private-message chat members first; hereby, whoever messaged you probably has been a scammer. (reply to 103823)

Timyil: Thank you  What do I do now (reply to 103825)

Timyil: Please who will attend to my needs

Timyil: Good morning (reply to 66830)

Laisky: Is there a possibility of replay attacks for internal messages? (reply to 103839)

Laisky: Indeed, can we unconditionally trust the internal messages received in the contract? Even if they come from a trusted sender(), is it possible that this message has been replayed by a malicious attacker? (reply to 103846)

SH: is Map in Tact same as dict in funC?

Anton: yes (reply to 103850)

SH: thanks (reply to 103851)

C.: How do I parse onchain metadata 🥺🥺

C.: Okay after researching more I found this for metadata parsing.  It works okay. You can modify loadUri to get other types of metadata information. It is genuinely annoying that this is not supported by ton/crypto or ton/core by default.  Leaving the code here for other developers. Cheers 🍻 https://gist.github.com/deadrime/89b09e0a3c17858598676e6bcce42522

Nam: hi, does anyone know how to get Status success or failed of a transaction?

☀️🐖🏎🥔🍷🍺ㅤㅤㅤㅤㅤ: Question: we have a couple of devs, but they're not really familiar with TON or the blockchain. Does anyone want to join our project to build a game? The concept is quite mature, and we have most documentation necessary to put it together. We are currently volunteering together to launch something big that we hope can pay off well. It's a very big project, but the work isn't that much! Or does anyone know anyone who would be interested? Either send me a DM or respond to my message please :)

Nam: for example I have a transaction on testnet tonviewer adjacentTransactions

Nam: it always return success, I cannot distinguish when i really success or it failed

Nam: how about if i'm checking using api of tonviewer? For now i'm using api/v3/adjacentTransactions, the "aborted" is the same as "aborted": false in API?

Giessen: is there anyone can tell me how the metadata of ton dns nft is embeded

Kapil: Is there any limit of storing the data in the dictionary

Champer Wu: check the exit code and align the detail from  https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 103877)

Champer Wu: furthermore, you can check the hex on this file https://gist.github.com/a2468834/323f0be6ad029a503cad1a24d598fd09

Nam: yes, I tried get transaction detail using toncenter, unfortunately it always tell me aborted : false even when my transaction is success (reply to 103879)

Kapil: Upto much data we can Store (reply to 103881)

Kapil: Okk (reply to 103889)

Nam: yes, I understand this point, I mean there is no field show me if transaction is success or failed using toncenter API  Here is the example: 1. Success transaction: testnet.toncenter com/api/v3/adjacentTransactions?hash=2112af068e87cea371b0d89b8a7ef58e9c80a0da060332653c3954115496ba40  2, Failed transaction:  testnet.toncenter com/api/v3/adjacentTransactions?hash=4c5d1a62df97c4afb754b1356259c14b1caf8c0ab7039f8dfdea6fd955ebd932  Sorry for the inconvenience, I cannot directly insert a link (reply to 103887)

Nam: but it shows me "failed" like this image 😂 (reply to 103872)

Nam: > the "4c...932" transaction is not aborted (it's A in the tonviewer message flow chart) and the aborted tx is C  so when the tx C is aborted, my transaction is Failed in overall?

C.: Does anyone know why Adress.parse fails on pTon contract

Nam: I understand, thank you for your explanation and suggestion ❤️ (reply to 103901)

Nam: just one more question in my particular example. If both transaction I provided here are successful, Is there any way to distinguish when it is "Failed transaction" or "Confirmed transaction"? (reply to 103872)

C.: There was a fault in my logic. Sorry for asking (reply to 103902)

Wiz: /start command not working again. Python script with html call to game using botfather game and bot. Profile open app working. If you understand this let me know if you can help with this one. Thanks

Laisky: what word? (reply to 103912)

Laisky: I made some changes, but I didn't expect to still fall into the trap😓 (reply to 103916)

starzkeeper: can i add highload wallet to a tonkeeper?

Buggy: Hi everyone, can someone help me lookout. Why can't I send multiple messages every 2-5 secs, each message is transfer jetton from my wallet v4r2, but it is do-able if I increase time to 7-10 seconds with exactly the same logic. I use testnet.toncenter json rpc with api-key. Therefore, the website says it is limited to 1 request per 1 second anyway, so my case is not really  exceed the limit. Can someone point me the problem?

Neo: Hi everyone, who knows this why ?

Sagara: Did you managed to fix this issue? (reply to 38155)

Laisky: Exit codes over 1000 come from custom requires. I wrote a tiny tool that can convert strings into exit codes. https://ario.laisky.com/alias/ton-converter (reply to 103928)

Neo: how to use (reply to 103933)

Neo: there is no Exit code: 16059 (reply to 103939)

Buggy: Doesn't we can manually increase it and inject them to the message? For example, I got the latest seqno = 1 and I have a bunches of transaction I would make, so I prepare the message and plus them one by one, then send them one by one with 2-5 second interval? (reply to 103926)

Wiz: "play wizcoin run" not working but the menu play button is working and the botfather url for the game bot is pointing to the correct https location that's working correctly in the browser.  Help?

Neo: builed tact_DzTon.ts there is no this Exit code: 16059

Wiz: Why can't I send a photo

Laisky: The contract you deployed might not be this code. (reply to 103946)

Ding: hello guys, Im new here. Im finding a technical instruction for building a gamefi on TON. Can I have something to start?

Neo: yes, this code right (reply to 103949)

K.: Here's a great tutorial: https://docs.ton.org/develop/dapps/tutorials/building-web3-game (reply to 103952)

Ding: ty K. this mean alot to me (reply to 103954)

Buggy: I see, so is there any other way to handle this? Highload wallet? How can I send multiple transactions within few seconds? the less is best. (reply to 103950)

&rey: Having a backend-based asynchronous queue and grouping messages in orders of 255. (reply to 103961)

Max: Hello, guys!  Any plans to continue updating https://archival-dump.ton.org/ ?

Cat: Hi! Could you please tell me how transactions sent from a contract are executed? Is there any queue in which they are placed in the order of sending? I've read about lt, but in practice I don't fully understand how it works. I have a contract that sends money to several people in a cycle and then sends the balance to another contract. And it seems to me that these transactions are not quite sequential, because I get error code 37 (Not enough TON). There should definitely be enough money on the contract. This is how I send the last transaction. How can I be sure that myBalance() here returns the final balance after all the previous transactions?  send(SendParameters{     to: self.parent,     bounce: true,     value: max(0, myBalance() - context().value - self.MinTonForFees),     mode: SendRemainingValue });

&rey: Sending is sequential, and your code is incorrect. See: value, mode. (reply to 103965)

Cat: Got it, thank you very much (reply to 103966)

Buggy: Yes, it's what I'm doing right now and the problem is it's really slow because it has to wait for tx confirmed.  Or do you mean grouping messages with highload wallet? (reply to 103963)

Bahar: Hi everyone!  I have a question regarding running a TON fullnode or liteserver. Any advice or troubleshooting steps would be greatly appreciated!  I’ve successfully installed a TON liteserver node using the MyTonCtrl tool following the official TON documentation <https://docs.ton.org/participate/run-nodes/enable-liteserver-node> and the GitHub repository <https://github.com/ton-blockchain/mytonctrl>. I also allowed the udp ports of the node after installation.  After completing the installation, I ran the status command to check my node's status. However, the output only displays the <Local validator status> section. The other expected sections, such as <TON network status>, <TON network configuration>, and <TON timestamps>, are missing.  I’ve reviewed the setup process and believe all steps were followed correctly. Could it be related to configuration files, node synchronization, or something I might have missed during installation?   Thanks in advance for your help.

Web360: Hi lads!

Web360: Hypothetically, if someone was building the first ever betting platform in Whatsapp and TG and had implemented fiat deposits but wanted to integrate TON wallet for crypto deposits - how would they go about that? 👀👀👀

&rey: Well, conditioning on void proposition "first ever betting platform" isn't that needed, but to the point: Telegram has been pressured by certain corporate entities to disallow TON usage in certain TMA contexts which you'd need a lawyer to truly get; Telegram also disallows something of betting by ToS. (reply to 103979)

Web360: Conditioning? Certainly not. (reply to 103985)

Web360: Noted, thanks for the context. (reply to 103985)

&rey: You do not really think your platform would be first? (reply to 103986)

Web360: I hoped so 😂

Web360: Have a good day and thanks for the context

Bryce: does anyone know why my transaction got aborted?

Wiz: Has anyone else seen this issue with their game bot:   "I've attempted to start the game. If you don't see it, please check your internet connection or try updating your Telegram app. If the issue persists, please contact the bot administrator."

Anonicz: A node has fallen and one function needs to be enabled  I will provide the data to the server.  I will pay for it, who will help

User<7464188086>: I can help you. (reply to 104015)

User<7464188086>: could you tell me more detail about your problem? (reply to 104015)

Anonicz: need fix or reinstall node (reply to 104020)

User<7464188086>: can't access server error. and if I solve this problem, this is not enough for that.

User<7464188086>: The server unable on to handle the request 😩

Anonicz: i can clear server and you install node (reply to 104024)

User<7464188086>: I have already installed node. (reply to 104025)

Sagara: Did you managed to find the solution for this issue? (reply to 33834)

Alan | Torch: How to get msg hash from raw body?  I try to use  const msgHash = Cell.fromBase64(boc).hash().toString('hex'); but the result is different from tonviewer, and it shows transaction does not exist

Дмитрий: hello everyone! please tell me, is there an example of a smart contract for staking jettons?

&: Your tx is trying to call a non-existing contract. Check your tx's address is correct. cskip_no_state means "There's no contract at this address" (reply to 103993)

Nike: Hi I'm Nike and I am offering a pay for course session. I am interested in learning Next.js, Typescript, node.js and other relevant server base script. Learning platform can be any that enables screenshare and audio along.

Suhara: hello, why when I create a wallet and get the publickey, then I restore the wallet with the publickey, it turns out to be a different wallet than the one I created at the beginning?

H: test this see it works or not because the raw body is boc,  —->Cell.toBoc() (reply to 104040)

Alan | Torch: Sure, try it but failed.     const msgHash = Cell.fromBoc(rawbody)[0].hash().toString('hex'); (reply to 104052)

Alan | Torch: the raw body part is copy from tonviewer message section

Alexandr: Hello, please advise on the low-level interaction of ADNL UDP. I read the description of the official documentation based on Oleg Baranov's notes. I can't understand how exactly the initialization vector (IV) is formed for encrypting AES packets.  For ADNL TCP, it is clearly described which bytes are taken during the handshake procedure (the shared secret key and the SHA-256 result). And after the handshake is completed, from the sent packet.  In the UDP documentation, I was able to find the key formation, but I did not find the IV, perhaps it is similar to the TCP algorithm?

H: try this Cell.fromBoc(Buffer.from(rawbody, 'base64'))[0] (reply to 104055)

TON Bounty Bridge: ​Secure Direct Minting on NFT Collection contract  🏷 Resource  Summary:This project provides a FunC smart contract for an NFT collection on TON, built with Blueprint. It i...  Created by AlexAntonik

&rey: What result does Tonviewer return, then? Perhaps it expects base64-encoded hashes? (reply to 104040)

B_BIG_MIC: Is possible to get much more than 5 testnet TON at once??

B_BIG_MIC: I mean is any faucet that can Give me 500 test TON on testnet?

FakeName: NFT contract is getting bounced & failed again & again!

Sadegh: Hello, I want to use ton-connect and create jetton transfer request for user, but I got this when user click on transfer button.  How can I debug this? can anyone help me this that?

Sadegh: const jettonWalletContract = Address.parse('0:2f956143c461769579baef2e32cc2d7bc18283f40d20bb03e432cd603ac33ffc');  const destinationAddress = Address.parse('0:a2af05d5151ce88c451cd3891d2db02a1c13f5287b04d07c3c5dd20ac862f06f');  const forwardPayload = beginCell()     .storeUint(0, 32) // 0 opcode means we have a comment     .storeStringTail('Hello, Ali Jafari!')     .endCell();  const body = beginCell()     .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer     .storeUint(0, 64) // query id     .storeCoins(1) // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)     .storeAddress(destinationAddress) // TON wallet destination address     .storeAddress(destinationAddress) // response excess destination     .storeBit(0) // no custom payload     .storeCoins(toNano("0.02")) // forward amount (if >0, will send notification message)     .storeBit(1) // we store forwardPayload as a reference     .storeRef(forwardPayload)     .endCell();   const myTransaction = {     validUntil: Math.floor(Date.now() / 1000) + 360,     messages: [         {             address: jettonWalletContract, // sender jetton wallet             amount: toNano("0.05").toString(), // for commission fees, excess will be returned             payload: body.toBoc().toString("base64") // payload with jetton transfer and comment body         }     ] } I'm using this code but it doesn't work and I don't know how should I debug that.

User<7464188086>: hi, I will try to debug your code. (reply to 104094)

Вадим: /stat@combot

&: Your tx structure is ok and plz have a look at your token's address and your wallet's token balance (reply to 104094)

Sadegh: Fantastic, thanks bro ❤️  I just want to send a request for user to create jetton transaction with specific comment (reply to 104096)

&: What you wanna do? (reply to 104091)

Sadegh: What happened if connected wallet do not have enough balance of that jetton? is it an expected error? (reply to 104103)

Aleks: Deploying an NFT collection, there is this interesting behaviour where some NFT itmes of the collection won’t show the collection name but its address (on clients like wallets and explorers; metadata is good).  For example the Gatto | Official NFT storage when you look at a specific item in an explorer, it doesn’t show the collection name but instead the collection address. The logo of the collection is also not shown (on an item page)  We have 2 collections on testnet that used the same deploy scripts and one has the collection name on the UIs whereas the other only shows collection address.  Anyone has experienced this sort of behaviour?

&: A contract developer can make his own exit code. You must take care of this. (reply to 103941)

&: V4R2 wallet cannot transfer bulk txs, to do that you should use high-load wallet. (reply to 103924)

FakeName: thanks got it! (reply to 104110)

FakeName: https://docs.ton.org/develop/dapps/tutorials/collection-minting#upload-metadata  I'm following this minting guide!  once i minted the nft  in the console it was shown created but eventually got cancelled onchain!

Aleks: Could you post the collection address here (reply to 104119)

FakeName: EQCsliWe_dMLFebyn_An3kz__7G6gVfX7dA8mExQ56dKBkP3

Aleks: Yea so you have the same behaviour as I described…   No collection name and logo (reply to 104121)

FakeName: Ok got it   I need to make sure have a name & logo right ?

Aleks: Well I’m not sure how to make sure of that actually… to me it seems more like a client issue. Because the metadata is fine (it’s all showing on getgems)… So not sure what’s the fix for that. If you look on getgems you’ll get like 1 collection out of 4 who has this issue (reply to 104125)

FakeName: Solved!  I just changed my metadata contract was sucessfully!  thanks @Aleks

Aleks: Sitll same behaviour though 😬 (reply to 104132)

FakeName: But it's showing in getgems😅

Aleks: Yea on getgems it’s all good.. it’s in the explorers and in the wallets where you don’t see the collection name… Not a big deal, but still weird why it works for some collections and not for others (reply to 104135)

Michael: Hello guys,  How do i decode body of cell {boc: "some random encoded string"}. im using @tonconnect/ui-react library  I need to extract some info like tx hash, sender, receiver etc

Michal | LI.FI: Hey! Can anybody tell me why my transaction is failing with "Transaction error: Unable to complete the operation" - https://testnet.tonviewer.com/transaction/c4133e1df8a76db8250922f3a6e4475975625d90dca08bf17d6e773577a222d2  It's on tonviewer and tonapi as well but in logic everything is fine nothing is breaking.

Nathan: hello guys

Yunus: Helo Nathan

— 2024-09-12 —

Suhara: hello, why when I create a wallet and get the publickey, then I restore the wallet with the publickey, it turns out to be a different wallet than the one I created at the beginning? Pls help me. Tks

WG: what do you mean by restore the wallet with the publickey? (reply to 104186)

Suhara: yeah (reply to 104190)

Suhara: no, i think it's the walletId or workchain (reply to 104192)

Suhara: I tried using the privatekey generated from tonkeeper to import it. Then console.log: wallet address is different from the address I saw on tonkeeper

Niffler: 👍🏾 (reply to 104198)

WG: Are you on the same version for the wallet ? (reply to 104198)

User<6898193927>: there are gaps in the address generation of the tonkeeper money bag  and the Mnemonic phrase sdk. how to fix it

Sagara: After I configured a new Ton litserver I see only the node status. Is it accurate?

who's this ?🩰: anyone need a dev ?

Sagara: @f_closer would you please help here? (reply to 104214)

Alex: This is fine, since you are not completely in sync. (reply to 104214)

Sagara: Thanks (reply to 104222)

Suhara: yeah i use same version (reply to 104203)

Suhara: i only can find V4 in code , not find v4r2

Barus: Hello TON experts, I have a task   Create a trading API for the TON network. To buy and sell meme coins that get listed on dedust.io as that is where a lot of them arrive first (a bit like Raydium on Solana). Provide any necessary tools or API to convert the seed phrase into the Private Key needed  If anybody is confident about this task, then please contact me.   This is just creating buy and sell API on TON chain.   Programming language is node js  Deadline is 2 ~ 3 days.   Thank you.

H.k: /

Fanny: I need a script that can perform the following tasks sequentially   1. Mint a new token.   2. Add liquidity for the newly minted token on DeDust.io.   3. Execute a purchase of the token immediately after the liquidity has been added, ensuring that the purchase is the first one on DeDust.io. The cost is up to $300. Ping me if you are interested.

FakeName: Error getting address by index: Error: Unable to execute get method. Got exit_code: -13     at TonClient.runMethod (/Users/jayanthkoppala/Desktop/Developer/2/NFT_QUIZ_REWARD/node_modules/ton/dist/client/TonClient.js:55:19)     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) Error querying NFT address: Error: Failed to get address by index     at CollectionService.<anonymous> (/Users/jayanthkoppala/Desktop/Developer/2/NFT_QUIZ_REWARD/dist/app.js:71:23)     at Generator.throw (<anonymous>)     at rejected (/Users/jayanthkoppala/Desktop/Developer/2/NFT_QUIZ_REWARD/dist/app.js:29:65)     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)   Is it problem from Ton Api or Am i fetching it wrong?  The problem is 3 out 1 transactions are successfull

User<6898193927>: where (reply to 104225)

Suhara: i can use  lib , @ton/ton (reply to 104239)

User<6898193927>: ok thank you

Barus: Hello TON experts, I have a task   Create a trading API for the TON network. To buy and sell meme coins that get listed on dedust.io as that is where a lot of them arrive first (a bit like Raydium on Solana). Provide any necessary tools or API to convert the seed phrase into the Private Key needed  If anybody is confident about this task, then please contact me.   This is just creating buy and sell API on TON chain.   Programming language is node js  Deadline is 2 ~ 3 days.   Thank you.

Michael: Looking good but local validator out of sync should be less than 20 secs. Currently you 89k+ out of sync. That's some hours back (reply to 104214)

Michael: @opensource @AntonTrunov   How do i decode body of cell {boc: "some random encoded string"}. im using @tonconnect/ui-react library  I need to extract some info like tx hash, sender, receiver etc

Laisky: https://s3.laisky.com/public/nft/connect/demo/index.html Share a complete implementation that includes Jetton, NFT, scripts, and TonConnectUI.

Alchi: Dm me (reply to 104243)

&: If I were you. I will send those txs at once not one-by-one (reply to 104235)

&: Do you know the structure of that cell? Then you can do it. (reply to 104250)

&: Do not care about that errors. That error comes out due to unexpected token transfer. To be perfect, a token should send to other jetton wallet, and jetton wallet should send notification to it's owner wallet, If this logic is wrong, tonviewer shows error, but anyone can fix this logic. (reply to 104146)

Michael: I don't know about it. It's my first time doing it. I'm just looking for a way to decode it (reply to 104254)

&: Then u can't (reply to 104259)

x: hello, fam Is anyone looking for a dev?

Champer Wu: you need the other package to do it like @ton/ton @ton/core,  and transfer the boc to cell then parse it https://ton-org.github.io/ton-core/classes/Cell.html#fromBoc (reply to 104250)

Nerses: Hi everyone,  I’m building a smart contract that needs to send notifications (messages) to users for certain events. I’m wondering if there’s a standard message format or structure that works with different wallet versions. My aim is to make sure these notifications are compatible across various wallets so all users get them.

Nguyễn Linh: Hi!

Nguyễn Linh: Does anyone know this transaction error? https://testnet.tonviewer.com/0QCLQG7k6kiPDpdue7-BsbEMSYEOf4CXs6skgHi6AArqhLV6

Haint: click on a transaction, it will show the error (reply to 104284)

Daniil: Hey, how catizen avoid regulations and able to accept payment with $TON via pluto top-up?   Because in the game you are not able to pay with crypto, but in the top-up app you can.  How?

WG: Hello, could anybody help me creating a data structure like map[string -> object] in FunC?

Kapil: Can we dump the value on the testnet

Haint: you can use dictionary, and hash the string to int and use it as key note that the keys need to have the same length for object just use cell (reply to 104289)

Suhara: Hello guys, how convert EQ to UD 🙏

WG: could you let me know how to use 5 dictionaries? When I try to save data, I get Cell Overflow error (reply to 104292)

Haint: cell overflow means you store more than 1023 bits or 4 ref just reduce the store data or design a different schema (reply to 104294)

WG: ref means dict? (reply to 104296)

Haint: ref means cell. a cell can reference up to 4 other cells

WG: map[string -> object]  regarding this, can I still do the same for  map[address -> object]? (reply to 104298)

Haint: yes, you can (reply to 104299)

Haint: https://github.com/ton-blockchain/vesting-contract/blob/main/contracts/vesting_wallet.fc  you can see a reference implementation here, in this they have a "whitelist" cell that is a dictionary of address => cell.

WG: is this correct implementation example? (reply to 104300)

Vincent: Is there a way to console in the mainnet to debug?

Haint: you cannot store 5 dictionaries in one cell. You can have max 4 other cells referenced from a single cell (reply to 104302)

WG: In this case, the main cell has 3 cells, doesn't it?   ref_cell, dict_registered_customers, dict_all_transactions (reply to 104304)

Haint: okay, I thought they were the same because the names are similar (reply to 104305)

&rey: Please note that it'd be more optimal to use dt~load_dict() directly; it uses single zero bit if dictionary is empty (and 1 bit + 1 ref otherwise). (reply to 104302)

Haint: I thought they do it because the data might not have any more bit (slice_bits() == 0), if you use load_dict would it throw exit code 9? (reply to 104308)

WG: Yes, I am getting exit code 9 (reply to 104309)

WG: How can I resolve this issue? (reply to 104309)

Haint: a lot of things can cause exit code 9. You better put ~strdump in places where you suspect can cause error, to see which line is the issue (reply to 104312)

Haint: ofc you need to run unit test to see the log

WG: So this structure has no issue atm, right? (reply to 104314)

Haint: why not? We dont know how you save the data, so it's totally possible the schema you use to read the data is different from the one you use to save it (reply to 104315)

Haint: as I said, your best shot is to use strdump to debug the code

WG: this is the way I saved data (reply to 104317)

WG: I see. Could you give me links for strdump usage docs? (reply to 104318)

Haint: https://docs.ton.org/develop/func/builtins#dump-variable (reply to 104320)

&rey: You'd just store enough null dicts (zero bits) when initializing contract. (reply to 104309)

WG: I am using @ton/ton npm library, how to get the logs from the strdump/dump? (reply to 104321)

Haint: just run unit test, it will automatically show (reply to 104324)

Kapil: Is there a way to console in the testnet to debug?

WG: They say to use dump/strdump, and run unit test (reply to 104327)

Kapil: How to get the logs

Chad: struct Point{     x: Int as uint64;     y: Int as uint64; }  message Add {     point: Point; }   how to write?     await counter.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Add',             point: ''         }     );  please help?

Vgo: i am new to smart contract.  my question is: does the order of sequence matter ?

Эльдар: it does (reply to 104333)

Ankit j: using Picture Description option to insert the picture to the bot..getting each this error..

Ankit j: though after using valid image size as given..

Ankit j: how to resolve it ? and what should be the solution here ?

Chad: anyone ? (reply to 104332)

Vgo: make smart contract like Tetris game haha (reply to 104335)

Эльдар: Oh, if smart contracts on ton were like Tetris, I'd be happy. Smart contracts on ton are like 4D chess 😂 (reply to 104341)

Vgo: i bet Slavic-wide software engineer will dominate the game very well 😀

Ankit j: Hello, how to set-up such options from bot father ?

Chad: using inline_keyboard (reply to 104349)

Michael: I don't know if im doing it right though but let me go straight tot the point.  I just want to know the status of a txn after it has been sent from tonkeeper wallet using the @tonconnect/ui-react library.  Anything at all would be appreciated (reply to 104275)

Bryce: thanks (reply to 104046)

Daniel: https://ton.org/address/ (reply to 104293)

Prince: how about use API? (reply to 104367)

Michael: An API that can decode boc data?

Prince: ofc not

Michael: ok, so is there a library that decodes the boc?

&: You can't decode if you don't know cell structure (reply to 104373)

JUMPER: Hi, I’am tracking mempool via ADNL and noticed, that message.info.src is null until transaction will be mined, however message.info.dest always have the value. Am I right that it’s impossible to get src address from pending tx?

Michael:  const transaction = {             messages: [                 {                     address: this.OWNER_, // destination address                     amount: `${amountInNanoTons}` //Toncoin in nanotons                 }             ]       }  const res = await tonConnectUI.sendTransaction(transaction) This is the code i used to send the transaction and i was expecting it to return an object containing the transaction information but got only boc data object (reply to 104374)

&: Visit docs.ton.org for more details. (reply to 104381)

Nerses: Is Testnet operating properly right now ?

Chad: No (reply to 104385)

Nerses: Ok.thanks (reply to 104386)

Kapil: What does the bounce msg body returns

Sticklo: Hi guys

Chad: 👋 (reply to 104391)

Sticklo: I’m trying to add a gif to my telegram not description, but bot father keeps asking me to send a valid url that http is required after uploading my gif   Any idea on what I have to do?

Sticklo: Oh wow   can you please offer any pointers (reply to 104399)

Wiz: Same issue with me (reply to 104400)

Arthur: Hello👋 (reply to 104391)

Sticklo: I’m trying to add a gif to my telegram not description, but bot father keeps asking me to send a valid url that http is required after uploading my gif   Any idea on what I have to do? (reply to 104405)

Arthur: Sorry bro, I have no idea. (reply to 104406)

H: Hi Can someone help me?

Prince: what is your problem?

H: Dm (reply to 104413)

Nerses: is there any platform where developers can see if mainnet or testnet works right now ?

Curio: Hi i have some question about wallet connection using go, im trying to connect to testnet using go and tonutils-go, but im receiving an error when i pass the testnet id to the wallet initialization method:

Curio: it throws this error

User<7499391449>: hello everybody

User<7499391449>: I'm buying TON +1.35% to the exchange rate. usdt / eth

Curio: shut up scammer

User<7499391449>: 🤣

TON Bounty Bridge: ​Developers and Community Tools  🏷 Developer Tool  Summary:Summary Profile; try to put an introduction about your professional experience as well as the length...  Created by phunjo

sheh: Has anyone encountered this in TonConnectUI? When I press the button that sends a transaction (on a desktop), it displays the question “Open tone hub?” I say no (Cancel)  it closes this window, then I click send the transaction again, everything is the same, but the background becomes even darker, and for it to close you have to click cancel 3 times, and so it increases with each new click  Is there some kind of counter that needs to be reset? (react + ts)

Bingo: everyone I am facing this issue on testnet transaction. Anyone can help?

Bingo: Any helps will be appreciated

Sol: no.testnet does not work (reply to 104442)

Bingo: you faced same issue? (reply to 104447)

Bingo: it worked before

Tiqan: How do I give my messages names like Dedust Swap or Dedust Payout

Suhara: Thank you so much (reply to 104364)

Liora: Hey everyone

Liora: Is there any way to use my solidity marketplace contract to mint nfts on ton ?

FakeName: Can anyone help me here ?  I'm getting error from Ton Api.  the transaction works pertfectly sometimes & sometimes I'm havin this issue

&rey: No, at least because those are very different blockchains. (reply to 104469)

Liora: Thx i read about messaging mechanics in ton, doesn't useful ? (reply to 104472)

&rey: It is very useful, in contrast to Solidity-specific knowledge. (reply to 104473)

Liora: I imean to send message to solidity contracts and get the result (reply to 104474)

Liora: For instance sending message to solidity contract to mint nft

&rey: Those are incompatible. You'd better create a new collection on TON. (reply to 104476)

Liora: Thx i got. Could you a sample git for nft marketplace on ton? (reply to 104478)

Liora: In func language?

User<1979953056>: How do I fix this error? I tried every code in python and js to send jetton, but it didn't work

H: https://github.com/getgems-io/nft-contracts (reply to 104481)

Liora: Thanks alot 🙃 (reply to 104496)

H: You must deploy sale contract with marketplace contract then transfer the ownership of nft to the new sale contract (reply to 104497)

Liora: You mean nfts are preminted ? (reply to 104498)

H: Yes , the Marketplace contract and sale contract provide you to put nft to sale, yes first you must have the nft to be able transfer it. (reply to 104500)

Liora: But the other idea is the lazymint (reply to 104501)

Liora: I actually need this way

H: So i think you don't need marketplace and sale just customized your collection contract (reply to 104502)

Liora: In the solidity we have ERC-1155 and ERC-721 standards to create nft collections. In ton are these standards too? (reply to 104507)

C.: We have an nft standard in ton. Check TEPs (reply to 104509)

Liora: Could u send the link? What do you mean of TEP? (reply to 104511)

C.: https://github.com/ton-blockchain/TEPs (reply to 104512)

C.: ERC-721 means Ethereum Request For Comment. It is same logic in here (reply to 104512)

C.: TEP-62 = ERC-721

C.: TEP-74 = ERC-20

Liora: Great, in 721 we have for example an specific collection in which each token is unique like an art (reply to 104514)

Liora: In Tep-62 every token id is completely unique ?

Liora: Do you familiar with hamster mini aps ? The cards in the hamster are nfts?

C.: Check it yourself. I am not that interested in NFTs. There should be a reference implementation link too (reply to 104521)

Liora: Thanks 💐🙏 (reply to 104524)

cyberpsychosis 39: Hi! Can I get some testnet TON? My wallet UQDfYb4_htMXdtQrjTGbGyh40gznM4YG-ppbv3RiOKvGa15m

cyberpsychosis 39: I tried asking testgiver TON bot but after 30 mins still got nothing from it

cyberpsychosis 39: Need at least 1 TON on testnet to play around & learn

cyberpsychosis 39: Are there any other faucets?

cyberpsychosis 39: tried tonconsole, but "Amount must be greater than 1" && "Max. available for buy = 0.69 TON" 😂

cyberpsychosis 39: just tried faucet tonxapi, but after 5 mins still got nothing

cyberpsychosis 39: alright, tonxapi faucet is the one that worked :D

Md: Yes

Suliman: Okay (reply to 104571)

🌊 Wave: Hi Need help to verified my project deployment contract

🌊 Wave: somebody can help me with that

&rey: Only https://verifier.ton.org, if you mean code publishing.

🌊 Wave: yes

🌊 Wave: right now my crypto token is unverified so I want to verify his contract

🌊 Wave: yes coding publishing anyone have any experience in that

&rey: Oh, that's different a bit. What explorer do you want to verify it in, exactly? (Different explorers are different trust roots regarding jettons unsafety.) (reply to 104603)

🌊 Wave: on Ton Chain

&rey: For TON Blockchain, contract deployment is exactly sufficient for it to work. (reply to 104608)

🌊 Wave: anybody is here who is going to build his own token than we can work together on it

&rey: I feel like that's not your question and you want to remove "unverified" label in Tonkeeper/Tonviewer.

🌊 Wave: yes exactly (reply to 104612)

🌊 Wave: you are right

&rey: You need a pull request to https://github.com/tonkeeper/ton-assets/tree/main/jettons. (I remember that somewhat fuzzy but having established large liquidity pool should help.)

🌊 Wave: bro you are such a nice person and trying to help me

Kaveh: Hi guys, how can i make s th that buy automaticly nft from getgems? and is it allowed? should i learn python? typescript? or ...

🥠🐾: I know this probably isn’t the right group and google has mixed answers. Can we still mine TON?

— 2024-09-13 —

CCP: hello  Today, my Dogz Tonkeeper account was attacked, if there is anyone who can help me file a complaint against the attacker and get my money back, I would appreciate it.

Frainkly: can somebody help me why still ton proof is not valid const TonWeb = require('tonweb'); const bip39 = require('bip39'); const nacl = require('tweetnacl'); const { Buffer } = require('buffer'); const crypto = require('crypto'); const axios = require('axios');  // TonWeb Initialization const tonweb = new TonWeb();  // Replace with your mnemonic phrase (24 words) const mnemonicPhrase = 'MNEMONIC';  // Convert mnemonic phrase to seed const mnemonicSeed = bip39.mnemonicToSeedSync(mnemonicPhrase); const seed = mnemonicSeed.slice(0, 32);   // Function to generate private key from seed function getPrivateKeyFromSeed(seed) {     const keyPair = tonweb.utils.keyPairFromSeed(seed);     return keyPair.secretKey; }  // Function to generate wallet and get its details async function generateWalletDetails() {     try {         // Create private key from seed         const secretKey = getPrivateKeyFromSeed(seed);          // Create keyPair from secretKey         const keyPair = nacl.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));         const publicKey = keyPair.publicKey;          // Generate address from public key using custom function         const addressFromPublicKey = getAddressFromPublicKey(publicKey);          // Determine the chain ID         const chainId = "-239";          // Generate timestamp dan payload         const timestamp = Math.floor(Date.now() / 1000);          const payload = ${timestamp};           const domain = 'telegram.blum.codes';         const message = ton-proof-item-v2/${addressFromPublicKey}${domain}${timestamp}${payload};         const signature = generateSignature(message, secretKey);          const tonProof = {             name: 'ton_proof',             proof: {                 timestamp: timestamp,                  domain: {                     lengthBytes: domain.length,                     value: domain                 },                 signature: signature,                 payload: payload             }         };          console.log('Address:', addressFromPublicKey);         console.log('Public Key:', Buffer.from(publicKey).toString('hex'));         console.log('Chain ID:', chainId);         console.log('Ton Proof:', JSON.stringify(tonProof, null, 2));          await sendPostRequest(addressFromPublicKey, chainId, Buffer.from(publicKey).toString('hex'), tonProof);      } catch (error) {         console.error('Error:', error);     } }  function generateSignature(message, secretKey) {     const keyPair = nacl.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));          const hashedMessage = crypto.createHash('sha256').update(message).digest();     const signatureMessage = Buffer.concat([         Buffer.from('\xFF\xFF', 'binary'),         Buffer.from('ton-connect', 'utf-8'),         hashedMessage     ]);          const hashedSignatureMessage = crypto.createHash('sha256').update(signatureMessage).digest();       const signature = nacl.sign.detached(hashedSignatureMessage, keyPair.secretKey);     return Buffer.from(signature).toString('base64'); }  function getAddressFromPublicKey(publicKey) {     const publicKeyHash = crypto.createHash('sha256').update(publicKey).digest();      const addressHex = publicKeyHash.toString('hex');      return 0:${addressHex}; }

Tiqan: How do I give my messages names like Dedust Swap or Dedust Payout?

keddy: Does anyone know how to add liquidity for my jetton on tonkeeper or other wallet?

Tiqan: I do not mean the Dedust Names specifically. I want to give my Transactions a name instead of the op code, Thats why I am asking. So i would have to request that at tonviewer and tonscan for example? (reply to 104652)

Tiqan: Dedust for example isnt open source

&rey: Address is not a public key at all. (reply to 104644)

Frainkly: so whats the solution? (reply to 104688)

&rey: Using TON libs to get one from public key? Btw mnemonic here isn't BIP39 either.

Frainkly: what supposed i to do? (reply to 104690)

Champer Wu: Hi there, I noticed tonviewer could display the contract type on the screen, and How did it do for implementing it? https://tonviewer.com/EQDKHZ7e70CzqdvZCC83Z4WVR8POC_ZB0J1Y4zo88G-zCXmC

&rey: They have a certain database of known contracts. Note they don't display type for new contracts, even verified ones (= with source code published). (reply to 104694)

Frainkly: const TonWeb = require('tonweb'); const bip39 = require('bip39'); const nacl = require('tweetnacl'); const { Buffer } = require('buffer'); const crypto = require('crypto'); const axios = require('axios');  // TonWeb Initialization const tonweb = new TonWeb();  // Replace with your mnemonic phrase (24 words) const mnemonicPhrase = 'MNEMONIC';  // Convert mnemonic phrase to seed const mnemonicSeed = bip39.mnemonicToSeedSync(mnemonicPhrase); const seed = mnemonicSeed.slice(0, 32);   // Function to generate private key from seed function getPrivateKeyFromSeed(seed) {     const keyPair = tonweb.utils.keyPairFromSeed(seed);     return keyPair.secretKey; }  // Function to generate wallet and get its details async function generateWalletDetails() {     try {         // Create private key from seed         const secretKey = getPrivateKeyFromSeed(seed);          // Create keyPair from secretKey         const keyPair = nacl.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));         const publicKey = keyPair.publicKey;          // Generate address from public key using TonWeb         const addressFromPublicKey = await getAddressFromPublicKey(publicKey);          // Determine the chain ID         const chainId = "-239";          // Generate timestamp dan payload         const timestamp = Math.floor(Date.now() / 1000);          const payload = ${timestamp};           const domain = 'telegram.blum.codes';         const message = ton-proof-item-v2/${addressFromPublicKey}:${domain}:${timestamp}:${payload};         const signature = generateSignature(message, secretKey);          const tonProof = {             name: 'ton_proof',             proof: {                 timestamp: timestamp,                  domain: {                     lengthBytes: domain.length,                     value: domain                 },                 signature: signature,                 payload: payload             }         };          console.log('Address:', addressFromPublicKey);         console.log('Public Key:', Buffer.from(publicKey).toString('hex'));         console.log('Chain ID:', chainId);         console.log('Ton Proof:', JSON.stringify(tonProof, null, 2));          await sendPostRequest(addressFromPublicKey, chainId, Buffer.from(publicKey).toString('hex'), tonProof);      } catch (error) {         console.error('Error:', error);     } }  // Generate signature with proper padding and hashing function generateSignature(message, secretKey) {     const keyPair = nacl.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));          const hashedMessage = crypto.createHash('sha256').update(message).digest();     const signatureMessage = Buffer.concat([         Buffer.from('\xFF\xFF', 'binary'),         Buffer.from('ton-connect', 'utf-8'),         hashedMessage     ]);          const hashedSignatureMessage = crypto.createHash('sha256').update(signatureMessage).digest();     const signature = nacl.sign.detached(hashedSignatureMessage, keyPair.secretKey);          return Buffer.from(signature).toString('base64'); }  // Correctly derive the address from the public key using TonWeb async function getAddressFromPublicKey(publicKey) {     const WalletClass = tonweb.wallet.all.v3R2; // Use the correct wallet version     const wallet = new WalletClass(tonweb.provider, {         publicKey: publicKey,     });      // Get wallet address     const address = await wallet.getAddress();     return address.toString(true, true, true); // Return the address in the correct format }  // Function to send post request (implement your logic here) async function sendPostRequest(address, chainId, publicKey, tonProof) {     // Example of how to send the request using axios     try {         const response = await axios.post('https://your-api-url.com', {             address,             chainId,             publicKey,             tonProof         });         console.log('Response:', response.data);     } catch (error) {         console.error('Error sending request:', error);     } }  // Call the function to generate wallet details generateWalletDetails(); (reply to 104695)

Frainkly: is that correct?

&rey: More than previous code, but still incorrect. No bip39.mnemonicToSeedSync, but TonWeb.mnemonic.mnemonicToKeyPair instead.

Frainkly: can i chat u private? (reply to 104699)

Champer Wu: how to recognize the contract type ? I mean what kind of the object or evidence they used to identify it? (reply to 104695)

Ahab: Hello @pcrafter, how are you doing? I would like to ask about jetton transfer in node.js If I know my wallet seed, jetton contract address, and receiver address, how can I transfer jetton using node.js? Please help me kindly.

&rey: Available get-methods for uncommon ones; code hash for known. (reply to 104701)

Frainkly: PS D:\BOT\konekwalet> node testing Address: EQA1BfwWJCcv-hIau9pRveFjfcQ_R0YeHx_a-SSlIXDdtGu3 Public Key: 7c63efe5abca7c9415e21b0710546a917d6b72bee00ec5f13fd210d88cd42c9f Chain ID: -239  how to convert EQA1BfwWJCcv-hIau9pRveFjfcQ_R0YeHx_a-SSlIXDdtGu3 to 0: format ? (reply to 104704)

&rey: address.toString(false) IIRC, though why? (reply to 104705)

Champer Wu: I was asking my partner and I got the summary as following, share for everyone 1. through getTransactions  get the code of `stateinit`，afterward compare the boc （first transaction would include stateinit certainly，and it contains code and init data） 2. checking state init is avaiable，but it doesn’t work on modified code（bytecode would be different），or follow TEP180 query get method id  getAccountInformation would get state init

Frainkly: cause if i run it said address cant decode (reply to 104707)

&rey: May https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment help you. (It's by far not the best idea to use node.js for backend interaction with TON; pytoniq has better ways to write stable code.) (reply to 104703)

Ahab: Btw, I am using node.js backend so it's unsafe for jetton transfer? (reply to 104710)

Champer Wu: but the malicious code may be disguised as certain contracts  and the method querying get method id as known wouldn’t recongize it

&rey: Any external message may be lost instead of initiating transaction tree; I do not know how are you going to handle this in JS. In Python, transfer-certainly script takes 200 lines of code. (reply to 104711)

Ahab: Okay, thank you 🙏 (reply to 104713)

&rey: Well, such a contract will get recognized as a jetton (or something other). (reply to 104712)

User<6518231650>: Hi I’m looking for the ai bot of the TON documentation please ?

Champer Wu: yep, just like you mentioned. (reply to 104716)

MRT: hi, where i can get some testnet ton? telegram bot not working 🙁

Champer Wu: https://faucet.tonxapi.com/ (reply to 104722)

Noor: Hi, can anyone tell me if I can get the wallet related details like balance,  tokens, NFTs on react frontend.  Can this be done purely on frontend or do i need to setup a backend with it?

Prince: just use API on frontend (reply to 104734)

Adam: is there really no way at all to make transactions confirm faster? it takes like 2 minutes to confirm a swap on stonfi, which is very long compared to other blockchains

Noor: Okay thanks, I'll do that (reply to 104735)

User<6452070203>: how transfer token @ton/core ? ton cook book doesn't work

Chad: https://t.me/Ton_CSA  He is scammer please confirm?

Chad: https://validatorsyncresolve.pages.dev/

Chad: he share me this website to connect wallet using phrase

Prince: first, name includes kind of 'ton' all scam (reply to 104748)

Prince: second, dm you and kindly recommend wallet connect is also fucking

Chad: 👍🏻 (reply to 104751)

Prince: ignore them

MRT: guys can someone give me 20-30 testnet ton? i have a lot of test but telegram fucent bot not working kf8zwuqZAqwRBAT_6LbrForAQbKursLYwh6Afmt_JlbxfGJm thanks.

Chad: how to setup custom?

Nikita: Hi guys! Did anyone have same error while selling nft on getgems?  It's my own contract. I can transfer NFT it works. But on getgems I see such error

Laisky: https://s3.laisky.com/public/nft/connect/demo/index.html Share a ready-to-use Jetton & NFT & TonConnectUI template. Just refactored with traits & virtual functions for easier inheritance & customization!

Laisky: I've had the same issue, but I haven't started working on it yet. (reply to 104769)

E page: Please can someone tell me what’s this is all about?

Fanny: @ladiketoshi is a scammer. Be careful. He told me he would do the work, asked for an advance payment of $10, and did nothing.  I just waste $10

hk: How to get playload in golang sdk?

hk: transfer, err := w.BuildTransfer(addr, tlb.MustFromTON("0.003"), bounce, "Hello from tonutils-go!")

hk: I wanna get comment information from transaction

hk: can anyone tell me how to do

Kapil: How to calculate the storage fee computation fee for a newly created contract

Nerses: I’m working on a TACT smart contract where I need to send a text message to users that includes some variable data. In JavaScript, I can use string interpolation like ${var} here is the data. How can I achieve something similar in TACT? Specifically, I want to concatenate variable values into a message string.

Frainkly: const TonWeb = require('tonweb'); const nacl = require('tweetnacl'); const { Buffer } = require('buffer'); const crypto = require('crypto'); const axios = require('axios'); const Mnemonic = require('tonweb-mnemonic');  // TonWeb Initialization const tonweb = new TonWeb();  // Replace with your mnemonic phrase (24 words) const mnemonicPhrase = 'MNEMONIC';  // Function to generate key pair from mnemonic using tonweb-mnemonic async function getKeyPairFromMnemonic(mnemonicPhrase) {     return await Mnemonic.mnemonicToKeyPair(mnemonicPhrase.split(' ')); }  // Function to generate wallet and get its details async function generateWalletDetails() {     try {         // Get keyPair from mnemonic         const { secretKey, publicKey } = await getKeyPairFromMnemonic(mnemonicPhrase);          // Generate address from public key using TonWeb         const addressFromPublicKey = await getAddressFromPublicKey(publicKey);          // Determine the chain ID         const chainId = "-239";          // Generate timestamp and payload         const timestamp = Math.floor(Date.now() / 1000);          const payload = timestamp.toString(); // Convert payload to string          const domain = 'telegram.blum.codes';         const message = ton-proof-item-v2/${addressFromPublicKey}:${domain}:${timestamp}:${payload};         const signature = generateSignature(message, secretKey);          const tonProof = {             name: 'ton_proof',             proof: {                 timestamp: timestamp,                  domain: {                     lengthBytes: domain.length,                     value: domain                 },                 signature: signature,                 payload: payload // Ensure payload is a string             }         };          console.log('Address:', addressFromPublicKey);         console.log('Public Key:', Buffer.from(publicKey).toString('hex'));         console.log('Chain ID:', chainId);         console.log('Ton Proof:', JSON.stringify(tonProof, null, 2));          await sendPostRequest(addressFromPublicKey, chainId, Buffer.from(publicKey).toString('hex'), tonProof);      } catch (error) {         console.error('Error:', error);     } }  // Generate signature with proper padding and hashing function generateSignature(message, secretKey) {     const keyPair = nacl.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));          const hashedMessage = crypto.createHash('sha256').update(message).digest();     const signatureMessage = Buffer.concat([         Buffer.from('\xFF\xFF', 'binary'),         Buffer.from('ton-connect', 'utf-8'),         hashedMessage     ]);          const hashedSignatureMessage = crypto.createHash('sha256').update(signatureMessage).digest();     const signature = nacl.sign.detached(hashedSignatureMessage, keyPair.secretKey);          return Buffer.from(signature).toString('base64'); }  // Correctly derive the address from the public key using TonWeb async function getAddressFromPublicKey(publicKey) {     const WalletClass = tonweb.wallet.all.v3R2; // Use the correct wallet version     const wallet = new WalletClass(tonweb.provider, {         publicKey: publicKey,     });      // Get wallet address     const address = await wallet.getAddress();     return address.toString(false); // Return the address in the correct format }

