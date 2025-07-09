+888: As demonstrated by the lastest Ton hack chalenge. It’s not only possible to have but to trigger parallel execution of a same smart contract using wallet v2/v3. And in a way that each line of code is executed at the same time (for example having line #313 being processed at the same time in 2 message) (reply to 148684)

&rey: That was not the case. (reply to 148685)

+888: Why can’t I post a link to the challange ? Or post any hyperlink in general ? (reply to 148686)

+888: As a way to implement mutexes. Please see questions/79625124/how-to-safely-decrease-a-variable-on-a-system-without-any-concurrency-control on StackOverflow. (reply to 148681)

&rey: OP of that thread is saying literally false things. (reply to 148690)

&rey: The chain acts as-if in each shard there is at most one transaction executed simultaneously.

&rey: Circled are the transactions (atomic units).

+888: So what about this webpage coming from the Ton validator’s developpers themselves ? (reply to 148691)

&rey: Well does it say anything about *single* transaction? (reply to 148696)

+888: Yes send two close requests for withdrawal: the easiest way is to send two messages in one transaction via wallet-v2/v3 (it supports sending up to 4 messages in one tx, however some manual scripting is required) (reply to 148698)

&rey: It must be disappointing but the whole tree had 63 transactions, not one. (reply to 148699)

&rey: It was a mess of terminology, which is nowadays more accurately said "to send two messages with one order to wallet-v3/v4".

&rey: This is a part of actual tree. And those circles were indeed executed in order, from top to down.

+888: What matters to me is the statement from the official developpers who design validator nodes that’s it’s possible to have the same line of code being run at the same time. I do care little in how it’s done (just that it’s possible to trigger it). (reply to 148700)

&rey: It is not possible to have the same line of code run multithreaded. Actually. Name two transactions (hashes, or lt+address) which interfered with storage or each other's variables.  You're welcome to hash of "better bank"'s final tree: 2c415141ea7042907dc44e0aefe806483bbf05a833657f8371582cf7970aa831. (reply to 148703)

+888: Of course since according to them it was exploited differently without using race condition. There’s no examples as a result on the blockchain. But I do notice the challenge was within a single smart contract /ton-blockchain/hack-challenge-1/tree/master/7.%20better_bank (reply to 148704)

&rey: A single smart contract — yes. A single transaction — no. Storage or variables interference — no.  It's just that a bunch of transactions left contract in "unintended" state. (reply to 148705)

+888: How are race conditions within a smart contract address supposed to happen without storage interference ? (reply to 148706)

&rey: Running this code in parallel threads in C++ is also race condition: {    lock.acquire(); *p = 1; lock.release();    } {    lock.acquire(); *p = 2; lock.release();    } since you cannot determine if p will point to 1 or 2. (reply to 148708)

+888: But this code doesn’t check balances and send funds. To me only failure to not check balances concurently allows to withdraw money as a race condition (at least within the same smart contract address) (reply to 148709)

&rey: What in fact happened, simplified:  Contract had (balance=5000.10, total_held=5000, A=0, B=5000). A deposited. (balance=5010.04, total_held=5010, A=10, B=5000). A withdrew. (balance=0, total_held=5000, A=0, B=5000), msg1(to=oneself, value=4999.96), msg2(to=A, value=10). msg1 arrived. (balance=4999.95, total_held=5000, A=0, B=5000). A deposited. (balance=5009.89, total_held=5010, A=10, B=5000). A withdrew. (balance=0, total_held=5000, A=0, B=5000), msg1 failed silently due to flags, msg2(to=A, value=5009.83). (reply to 148708)

&rey: @mojulie56 it is in fact important to explain correctly. If a person cannot tell data race from race condition, their claims need to be disproved.

+888: Do you mean for the hashmap. BEcause the race condition never hapenned/exploited ? And the writeup indeed talks about 2 withdrawals (so without a deposit between) (reply to 148712)

Mojisola🍅 🍅: there is supposed to be one after the other computing right?  check, subtract balance before transfer. the next check again right? just like we have in ethereum (reply to 148710)

Mojisola🍅 🍅: I see (reply to 148713)

&rey: Do you know if your solution is correct? If it is, why? If it is not, why? How would you tell?  That's why you were muted the first time by the way. (reply to 148715)

+888: The ᴏꜱ will ensure p will be updated not concurrently (serialization happens at processor 0 at least on Linux). What happens after might be a problem (reply to 148715)

&rey: I took explanation of what happened from actual blockchain tree and "aftermath" section. Would you like an explanation for first option, expected by task authors? (reply to 148714)

+888: The race condition is explained before the Aftermath section. I’m interested in the race condition not the hashmap bug (which acutally how the contract was exploited instead of triggering the race condition). (reply to 148719)

+888: The blockchain data is no indication about the race condition besides storing the vulnerable code. (reply to 148719)

&rey: Contract had (balance=5000, total_held=5000, A=0, B=5000). A deposited. (balance=5010, total_held=5010, A=10, B=5000). A half-withdrew. (balance=0, total_held=5005, A=5, B=5000), msg1(to=oneself, value=5000), msg2(to=A, value=5). msg1 did not arrive yet. A half-withdrew. (balance=0, no storage), msg3(to=A, value=5). msg1 arrived. (balance=5000, no storage). Contract deployed in initial state. (balance=5000, total_held=0). A deposited. (balance=5010, total_held=10, A=10). A withdrew. (balance=0, total_held=0, A=0), msg4(to=oneself, value=0), msg5(to=A, value=5010). (reply to 148720)

Mojisola🍅 🍅: this post should be explained. may be it clarify the scenario (reply to 148696)

+888: Which doesn’t match executing 2 message at the same time per the bug description (but match explorer data). A part of it should be : * withdrawal send. * message arrive * other withdrawal sent * message arrive while the previous one is still running. (reply to 148723)

&rey: Your message doesn't match statement "So if withdraw request will reach bank while all money is on the fly, bank will be insolvent during request processing", while my expansion does. (reply to 148725)

+888: Yep with a time diagram /ton-blockchain/hack-challenge-1/issues/2 (on GitHub) (reply to 148724)

&rey: For the record, do you think my explanation is correct? (reply to 148728)

+888: Not exactly.  But you did give me doubt. I understand the withdrawal requests. But the bug description definitely implies executing withdrawal requests concurently. (reply to 148729)

+888: Which isn’t what you’re talking about.

Dmitry | backend4you.ton: Sorry for breaking in into your thread, but it seems you are talking about different race condition levels.  TON blockchain transaction is a “converting” by contract one incoming message into 0..N outgoing messages and modifications of contract storage data. It is atomic. Ton blockchains guarantees that two incoming messages for one contract will never be processed in parallel. No race condition is possible. That’s pcrafer says.   Problem with bank appears to exist because bank “business” transaction includes several blockchain transactions. So blockchain can’t guarantee atomicity of them all together. Contract design/logic should deal with it.

+888: No problem. But the race condition is described to happen within a single transaction… (reply to 148732)

+888: The race condition is in how withdrawal request work. The other request are required but unrelated to the bug. (reply to 148732)

Mojisola🍅 🍅: if we all agree with your post, then the question of poster is effectively solved. if two different message is sent to a contract, it get processed one after the other and never parallel. (reply to 148732)

Mojisola🍅 🍅: this is what I normally expected.   why will two different message be even processed in parallel in the first place

Torit: How do I contact a technician?

Daniel: Wdym? (reply to 148742)

NPA120: What can I help you? (reply to 148742)

+888: One way I think of is requesting the contract execution from a different shard : message would be run on the next block. (reply to 148737)

+888: I don’t known what Wallet v2/V3 is. (reply to 148737)

Mojisola🍅 🍅: you should be satisfied by now that message get processed one after the other. okay?  v2, v3 or v4 v5 etc are ton wallet versions... (reply to 148752)

Torit: There is a domain that I want to buy to my address, but it is already bought, but it has expired, the owner of it for a very long time does not prodolevayut, but I still can not buy it, support @ton_help_bot said to write to a technician that he would help to buy this domain to my address (reply to 148747)

NPA120: can you let me know that domain? (reply to 148757)

Torit: Can I write in private messages? (reply to 148758)

NPA120: sure, NP

— 2025-05-18 —

Adios Le Pobre: Hi, i’m having an issue with V2 getTransactions API on Toncenter. When there was only a single transaction, the result with the single transaction was returned. But when I sent another transaction to the address, the API returned empty result.

IntegrityFarm: Why my token still has " непро веренный токен " I've created it in October 2024

•: Need sent to Tonkeeper with text:  “Dear Tonkeeper, вы че там уху ели? С октября токен лежит и не проверен. Проверьте мой токен, Cheers, IntegrityFarm” (reply to 148785)

— 2025-05-19 —

&rey: Maybe it's time to check what message you are trying to send? (reply to 148813)

Michaelzy: Hello guys i want to know if its possible to create a proxy contract using tact that uses a seperate contract for logic execution

Lirâ: GM from Turkey :)

&rey: It is quite complex. Why? TON has SETCODE for changing logic in-place. (reply to 148821)

Michaelzy: how does setcode work? can't find it in the docs  the reason i want to use proxy is because my logic may change in the future after an audit or changes in design (reply to 148826)

&rey: 1. Replaces contract's code cell with provided one; upon any subsequent transaction, new one will be used. 2. https://docs.ton.org/v3/documentation/smart-contracts/func/docs/stdlib/#set_code 3. Please don't expose users to unverified logic which you expect to change. (reply to 148828)

Michaelzy: it seems its not available in tact? (reply to 148829)

&rey: Well you should consider what happens to contract's data. (reply to 148830)

Michaelzy: true i'll make sure to audit first (reply to 148829)

Michaelzy: contract data doesn't change only logic will (reply to 148831)

&rey: Different compilations might expect data to be laid out in different order. (reply to 148833)

Michaelzy: okay but does this mean i cant change logic in tact directly? (reply to 148834)

Michaelzy: so i have to go ahead with proxy

&rey: Proxy doesn't seem to help in the slightest. How would it inherit data of previous contract? (reply to 148836)

Michaelzy: data and logic contracts would be seperate. when i make changes (upgrade) the logic contract, i would pass the address of the new logic contract into the data contract and then the data contract calls the methods of the new logic contract during execution (reply to 148837)

&rey: > the data contract calls the methods of the new logic contract during execution  You do remember that each cross-contract interaction is mediated by a message, changing transaction context too? (reply to 148838)

&rey: It is possible to create pseudo-proxy using dy libraries, but it would make for very unidiomatic Tact — such that any audit would reject it.

Michaelzy: don't get what you mean by changing transaction context (reply to 148839)

Michaelzy: that shouldnt affect the logic execution

&rey: Well your data contract got a message, and that started a transaction. It sends outgoing message to logic contract, and then its transaction ends.  It might be important in some cases. (reply to 148842)

Michaelzy: for an nft collection proxy, i'd simply create a logic contract that handles minting of the new nft-items

Michaelzy: ok i understand  but as long as i'm passing the require fields from the incoming message to the outgoing message it should be good? (reply to 148844)

&rey: And then how would items know to trust your logic contract? Presumably they don't know its address in advance. (reply to 148845)

&rey: Also, you cannot delegate get-methods (since there is no ability to wait for a message), which means your contract system will not be an NFT collection. Bingo.

Michaelzy: in the nft-item contract, i would have an address-type variable that stores address of the logic contract. and have a message receiver to update the address of this variable then when fucntions in the item contract are called, i'd simply run a check to make sure sender is logic contract (reply to 148847)

Michaelzy: the get methods return data from the data contract so i wouldn't need to delegate such (reply to 148848)

&rey: And any update to logic contract address would run through how many, potentially hundreds of thousands of NFTs? (reply to 148850)

Michaelzy: for instance the variables in this get function are all stored in the data contract and don't depend on the logic contract get fun get_collection_data(): CollectionData {         return CollectionData{             next_item_index: self.next_item_index,             collection_content: self.collection_content,             owner_address: self.owner         };     } (reply to 148851)

Michaelzy: ok this seems like a good concern (reply to 148852)

Michaelzy: having to send messages to each nft item to upgrade the logic contract

Michaelzy: but consider the fact that upgrades won't happen as often and most times upgrades aren't ever done

&rey: And will NFT item address be independent of logic contract? If so, what logic is there to change? (reply to 148853)

Michaelzy: it's primarily just a safe measure in case there's a bug that wasn't detected earlier (reply to 148856)

Michaelzy: yes it will be independent (reply to 148857)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 16 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 54  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Ali: Hello guys. I need some help with HighloadWalletV3, for batch jetton transfers. Can anybody help?

Y.E🐾 🌱SEED: Hello, how is my money stolen from my account? How do I stop it? Please tell me.

&rey: If your mnemonic (or private key) became available to someone else, you should generate a new, safer, account and move whatever remained into it.  Make sure that wallet app you use is in fact secure: https://ton.org/wallets  Mind the topic of this chat, though. (reply to 148891)

— 2025-05-20 —

TON Bounty Bridge: ​Herramientas y guía educativa para evitar pérdida de recompensas y fraudes en integración de wallets TON/Telegram/Donkeyper  Created by loboardiente1975

ISMA&COIN: Hello, who can I talk to about receiving grants for the development of the TON ecosystem?

Alireza: Hi I have a question: with one MNEMONIC we could have multiple wallets on Tonkeeper for example,  then, How can I say programmatically which one to choose for some operations?  which part of the following should be changed? should we assign walletid for it? if so then how can I find my wallets' Id?  const mnemonicWords = config.MNEMONICS.split(' ');   const keyPair = await mnemonicToPrivateKey(mnemonicWords);   const wallet = WalletContractV4.create({     workchain: config.WORKCHAIN,     publicKey: keyPair.publicKey,   });

mohsen: Hello devs, can anyone please introduce me the best Ton faucet available?

Combot: Total messages: 148925

&rey: Changing this will return different wallets which Tonkeeper supports. (reply to 148922)

Alireza: How to get existing wallets? (reply to 148927)

&rey: Check their onchain state, presumably. (reply to 148928)

&rey: If you have a clear explanation how these testnet TON will be used, please contact @f_closer. (reply to 148923)

&rey: If you don't (e.g. very secret project) but still need a large amount, then tonconsole.com offers to... ahem... Ρurchase some.

&rey: And the traditional faucet is @testgiver_ton_bot.

mohsen: thank you (reply to 148930)

Michaelzy: good morning guys Tact dev here i currently have this transaction payload in my script that sends message to my contract and it executes successfully.  const message = beginCell()     .storeUint(2016634319, 32)     .storeUint(0, 64)     .storeStringRefTail(trackData.tun3zTitle)     .storeStringRefTail(trackData.coverImage)     .endCell();  this is the message in my contract message Mint{     query_id: Int as uint64;        name: String;     image: String; }  But i want to make the name and string values optional in my contract like this  message Mint{     query_id: Int as uint64;        name: String?;     image: String?; }  how can i modify my payload to match this new message struct because old one wont work

ISMA&COIN: Hello, we applied for grants, we would like to clarify whether it is possible to receive feedback?

Andy: https://docs.tact-lang.org/book/func/#convert-serialization  > All optional types are serialized as Maybe in TL-B, except for Address.  https://docs.ton.org/v3/documentation/data-formats/tlb/tl-b-types#maybe  To read more about what TL-B is, check this page: https://docs.ton.org/v3/documentation/data-formats/tlb/tl-b-language It's a little overwhelming at first, but once you begin grasping TL-B - you'll significantly level up as a TON developer, no matter the language (Func, Tact, Tolk, maybe even Fift), since it just defines how things are serialized to cells.  Specifically for your example, it's as simple as adding .storeUint(1, 1) before every .storeStringRefTail and simply .storeUint(0, 1) when there isn't a string.  You could also change to something like storeMaybeStringRefTail that'd work like `storeMaybeRef` (reply to 148935)

Zaid: This Chat is for developers , Visit ton . Org For grants information. (reply to 148921)

Daniel: why my message was deleted ??

&rey: Because stars are not relevant to this chat in any way. (reply to 148947)

Daniel: Where can I ask this question then ? (reply to 148949)

&rey: Probably @twa_dev. Make sure to look at chat history – it might be faster than waiting for a new answer (reply to 148950)

Daniel: thanks

Combot: Combot has warned 籍望慕 (1/3) Reason: 1 reports (reply to 148954)

— 2025-05-21 —

AGT: Sir,How do I transfer money to someone using my address and my custom avatar is displayed here?

Devon: hi guys, we just launched an open source community project tonmcp.xyz for interacting with Ton blockchain using natural language, pin me if you have questions install it or want to collaborate on PRs 😆

No: I call api to get information on smartcontract but got this error: 500 Internal Server Error: "{"ok":false,"error":"VALIDATE_ACCOUNT_STATEFailed to unpack Account","code":500}". Can anyone help me?

Dmitry | backend4you.ton: yesterday I saw this in some private API which used outdated tonlibjson library. updated to last one and problem disappeared (reply to 148993)

Andrew: Hi, my RPC Endpoint mainnet-v4.tonhubapi.com is not working, it cannot send boc on chain.So I need try some paid endpoint.However quicknode is not work. So do you have any to recommend. I just want to replace the url

Andrew: I used tonclientV4

No: You mean to update the toblibs, for example on windows it is tonlibjson.dll, linux it is tonlibjson-linux-x86_64.so, .. (reply to 148994)

&: Try toncenter. (reply to 148996)

Andy: What does message mode flag +32 actually do?  As far as I understand, destroying the account sets it to uninit state, so it can be redeployed and of course such a contract stops acquiring storage fee debt.  But why would a contract that'll never be used again destroy itself? Is it just a best practice? Does it reduce blockchain storage size or something else that makes it beneficial in the long run?  Are there any use cases for redeploying a destroyed contract (except the TON Hack "use case", that is more of a vulnerability really)? Does redeploying the same account use less storage or cause any similar beneficial metrics?  Do libraries of a destroyed contract get removed?

&rey: Well if a routine (withdrawal from a complicated staking perhaps?) is complete, the contract managing it has no reason to be up. (reply to 149013)

&rey: That way, contract existence indicates that routine is still running and should not be invoked again.

Leo: And if not destroyed explicitly, the contract will owe storage fees and get destroyed sometime in the future, after which it can also be redeployed. So it's not about security.

Hobbs: Gmgm

Danik: Hi  I’m a full-stack developer with strong experience in building Telegram Mini Apps (TMA).  Stack: TS, React, NextJS/Tanstack Start, tRPC, Hono/Express, TON integration, payments, Grammy and more.  I can handle projects of any complexity — from MVPs to full-scale production apps.

Michaelzy: gm guys i am calling a get method from my script to my contract using clien.runMethod (toncenter endpoint0 but i keep getting this error: node:internal/process/promises:394     triggerUncaughtException(err, true /* fromPromise */);     ^ AxiosError: Request failed with status code 503 . . . data: { ok: false, error: '', code: 503 }   },   status: 503  crazy thing is i am calling other get methods from my contract and they all work fine but when i call this paryticular one  const resultt = await client.runMethod(contractAddress, "get_jetton_address_by_params", [         {type: 'int', value: index},         {type: 'int', value: fractionCount},         {type: 'slice', cell: nameCell},         {type: 'builder', cell: addressCell},     ]) any help will be appreciated (reply to 148944)

Bohdan: also have this error from yesterday (reply to 148993)

Sent Σ: I want  you  to work on ton smart contract  that helps  users to send ton and ton Jetton  tokens to  our wallet after making  purchases  on our mini app

TON Bounty Bridge: ​Number1  🏷 Developer Tool  Summary:#1043  Created by Akbarsohbatloo1

Sent Σ: Anyone? (reply to 149045)

&rey: This doesn't call for any smart contract beyond your wallet. You're most probably looking for https://github.com/gobicycle/bicycle? (reply to 149045)

Sent Σ: Isn't this in it's  test phase (reply to 149048)

Sent Σ: Isn't  this too much risk

&rey: Not a single failure was recorded in half a year, to my knowledge. (reply to 149049)

— 2025-05-22 —

Albert: Ping me (reply to 149045)

Alex: TON Studio is looking for a technical specialist to moderate and support developer chats, such as TON Dev EN and TON Dev RU, chat contest, chat hackathon.  Main tasks: - Help developers find answers to their questions in the documentation, and formalize and systematize questions that are not covered in the documentation for further development. - Help integrate and support a public chatbot helper that is trained in documentation and can answer some questions. We want to closely monitor such a bot and prevent meaningless spam from it. - Improve the experience of people communicating, improve the quality of catching real spam messages, keep safe regular users from unfair bans.

Willy: I have been banned in RU chat:( Totally unfair, done nothing wrong (reply to 149064)

Alexander | Hubz: Sent you a DM (reply to 149064)

Lasha: Hi, this is a TON transfer's in_msg msg_data. I want to parse the message body. Do you have any suggestions on how I can parse it? The type is dataRaw.    'msg_data': {'@type': 'msg.dataRaw', 'body': 'te6cckEBAQEAAgAAAEysuc0=', 'init_state': ''}}

Mahdi: Hello friends. Anyone can help with this?

Mahdi: Hi  I've put my NFT on sale with tonutils library. you can see that the sale address is for getgems sales https://tonapi.io/v2/nfts/EQC4dwQ9pj613YHd37r1JMo0yO4Z8hz2CG3tJFajRU4MbmmS   but Getgems UI does not show my NFT as on sale. it shows it "Not for sale"  Why?

Stark: hey i am looking to deploy bridge on ton for smooth transactions with evm chain, any idea which repo i should fork and any previous deployments available?

Justice: I can help (reply to 149092)

Marous: Hello guys, I'm new to TON network. i'm trying to udnerstand how gas fees are sent/paid when sending  a transaction.             await wallet.methods.transfer({                 secretKey: keyPair.secretKey,                 toAddress: JETTON_WALLET_ADDRESS,                 amount: TonWeb.utils.toNano('0.05'),                 seqno: seqno,                 payload: await jettonWallet.createTransferBody({                     jettonAmount: TonWeb.utils.toNano('500'),                     toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS),                     forwardAmount: TonWeb.utils.toNano('0.01'),                     forwardPayload: comment,                     responseAddress: walletAddress                 }),                 sendMode: 3,             }).send()         );     }  amount: TonWeb.utils.toNano('0.05'). Is this the gas fees paid ? Or the amount sent to JETTON_WALLET_ADDRESS or both ? And is there a refund ? How would that work

Slava: Gas fees are deducted from the contract's balance after it's execution, based on the amount of gas units actually used (but no more than the amount of the incoming message by default).  However, besides the gas fees there are other types of fees.  Actually, fee management is one of the most nastiest problems in TON. You should study the docs very careful and try everything for yourself. (reply to 149108)

&rey: Both, and part of that amount is forwarded to destination contract too.  Jetton wallet, in its kindness, refunds some TON to responseAddress. (reply to 149108)

Marous: If it is deducted from the contracts balance I can just put amount: 0 then ? (reply to 149110)

Slava: You are missing this part. (reply to 149110)

Slava: See this.

Marous: Got it. It won't work, I have to atleast specify the exact amount of gas fees in the amount section minimum or else the tx will revert (reply to 149114)

Slava: You should provide enough extra coins to cover all the fees for the execution of the entire transaction chain to be more precise.

&rey: "will revert" – why do you think so? (reply to 149116)

Marous: because gas fees is deducted from amount and it is 0 so th tx wont work so it will revert (reply to 149118)

&rey: The last step is faulty. (reply to 149119)

&rey: That transaction will end abruptly with out-of-gas error, no actions will be applied, and handling stops at that.

&rey: No reverting changes of prior transactions of the tree.

&rey: If other tree branches had sent some messages, those will be handled as usual – this tx has no influence on them.

Evgenii: Hello there! I am using @ton/ton library to call my contract's GET method. It used to work fine until couple of days ago. Since then I'm getting errors "failed to unpack account state".  bluepring client works just fine. tonClient4 also doesn't lead to any errors. It's only tonClient + apiKey.   All of the above is relevant for the testnet only.  Does anybody have any idea why?

— 2025-05-23 —

Tom | OrevaApp: Hello there!   Senior TON dev needed for equity in my project with worthy compensation (UI ready, over 5K community). If interested, DM!

Bohdan: I have this error too. It's the third day of this error. I asked this question in all chats, even in orbs support but no answer yet. Will hope they fix it soon (reply to 149128)

Evgenii: In my case tonclient replacement with its 4th version saved the day. (reply to 149151)

Bohdan: Unfortunately didn't help. It's more like server side issue on orbs side. (reply to 149152)

Bohdan: The funny thing is that if I deploy some simple contract like e.g. counter and call function from this contract, it works. Weird)

XI: Hi everyone! Could you please recommend the best and up-to-date materials to learn how to write smart contracts for TON? I’m looking for practical guides, GitHub repositories, or video tutorials — anything that helped you personally to get started or go deeper. Thanks in advance!

Anton: hey, please check out  https://docs.tact-lang.org — Tact documentation  https://github.com/tact-lang/defi-cookbook — practical DeFi recipes (just Jettons for the moment, will be updated with more materials)  https://github.com/tact-lang/awesome-tact — you can find the tools and video courses there (reply to 149162)

TON Bounty Bridge: ​Feature] Add wallet connection history to TON ID mini app  🏷 Developer Tool  Summary:Add a feature to display a connection history of previously used TON wallets in the TON ID mini app.  Rewards: • 150 – 250 USD • (Depends on implementation complexity and UX quality.)  Created by stennnly

Evgenii: old client also stopped worked for others methods. 😠 (reply to 149159)

&rey: Testnet interfaces can be quite unstable.

Bohdan: Yeah. But at least they could notify that today we have a problem, so we don't waste our time on unnecessary debugging (reply to 149168)

Bohdan: what alternatives are there except orbs?

&rey: The main Toncenter perhaps? testnet.toncenter.com

Bohdan: thank you very much. I connected toncenter to TonClient and it works. (reply to 149173)

Evgenii: I also switched to https://testnet.toncenter.com/api/v2/jsonRPC - works fine

Eugene: https://chainstack.com/build-better-with-ton/ (reply to 149172)

Combot: Combot has warned Draco (1/3) Reason: Word **** is not allowed

Stark: Hi can anyone share resources on connecting smart contract with oracle to trigger functions on contracts for Ton blockchain?

Andrei: Hi! Can someone please point to the example where smart contract is deployed from the wallet with pre-defined mnemonics. JS example would be perfect  To give a little more details.  I want to convert this (smart contract deployment from connected wallet) await tonConnectUI.sendTransaction({                     validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes                     network: tonConnectUI.account?.chain,                     messages: [                         {                             address: address.toRawString(),                             amount: toNano('0.02').toString(),                             stateInit: stateInit.toBoc().toString('base64'),                             payload: body.toBoc().toString('base64'),                         },                     ],                 } Into the deployment from mnemonics?

Slava: https://github.com/ton-org/ton?tab=readme-ov-file#usage (reply to 149216)

Andrei: Thanks. What method from client should I use though? client.sendMessage()? (reply to 149218)

Slava: Just put your deploy message inside the messages array.

— 2025-05-24 —

橘柚香: 才抢8.88u 手气有点差 (reply to 6)

橘柚香: 才抢8.88u 手气有点差 (reply to 6)

它是: Hey guys. The NFT transfer on Telegram to Fragments takes about 14 days for the mint process, is it maintained on the contract of the NFTs or it is off-chain process?

Combot: Combot has warned Umar Aminu (1/3) Reason: 1 reports (reply to 149256)

— 2025-05-25 —

Specter MM ⚝: Hello everyone. Does anyone have a working example of processing a transaction after receiving it from the toncenter? I need to make payment acceptance in ton, but I don't really understand how to process transactions to exclude fake transfers, etc.

Slava: Just read the docs, it has a dedicated section for this. (reply to 149322)

Nxrix: How I must create transaction for renewing a ton dns with ton connect in my web app

Nxrix: Also how can I find out the time left until the dns access will be lost

&rey: IIRC any message with sufficient TON to complete compute phase suffices. (reply to 149394)

&rey: Use get-method. (reply to 149395)

Nxrix: how much? (reply to 149396)

&rey: 0.01 or less. (reply to 149398)

Denis: https://tonviewer.com/EQAKzoH3bMazEpZbXxUQ_xE-7jvcTt-rUE6eV8WzPF7OIx62?section=method (reply to 149397)

Nxrix: Is it possible to make bulk transactions for ton connect?

Nxrix: must be from owner address or any (reply to 149396)

&rey: From owner, yes. (reply to 149403)

&rey: No one in this chat has control over Fragment. Actually there are three options: a) Fragment glitch, b) scam, c) you misunderstood the terms. (reply to 149410)

— 2025-05-26 —

Mike: Yeah its all good. Ive only made rarible nfts and it was my mistake.

TON Bounty Bridge: ​I do not consider specific details.  🏷 Developer Tool  Summary:B  Created by Hesami0084

小小怪同学: 好吃不如饺子 好玩还是得是嫂子 (reply to 29)

Random️: Hey guys, is testnet having any issues now? Seems pending for quite a long time for several of my transactions

Mojisola🍅 🍅: possible ur transaction is having issue (reply to 149430)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 16 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 60  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Ricardo: are there TON API and TON CENTER mocking utilities for testing purposes?

&rey: I don't think so. In particular, different mocks may require different capabilities, up to having a backing testnet chain. (reply to 149439)

Nxrix: what was url for ton domains in testnet?

TON Bounty Bridge: ​Viva  🏷 Developer Tool  Created by beneraindustries

Agustin: Hey guys, do you have any working example on how to create and send wallet v5r1 ton transactions using js? My flow is Transaction creation -> get the signature hash -> sign it -> create the external message with the signatures -> broadcast

Nerses: Why is there such caution around the checkSignature and checkDataSignature functions? What technical limitation necessitates it?

&rey: Ed25519 is not known for being a cheap computational operation. (reply to 149457)

Nerses: Actually I was wondering what changes after 11th call,that it consumes more gas (reply to 149459)

&rey: TVM internal counter does. (reply to 149460)

TON Bounty Bridge: ​Begin Start NFT  🏷 Developer Tool  Summary:I’m interested to NFTs.  Created by calvin-bitcoin

@WK: Hello everyone, the cryptocurrency I created on the T O N blockchain has never successfully passed the approval to remove the verification token.

Selcuk: Hey guys, we're building a chat-based UI for our AI discovery module as a Telegram Mini App, but facing an iOS issue that breaks our input field’s UX. It works fine in Safari and Android, but not in the iOS Mini App. We think this is a common problem for chat-style Mini Apps on iOS. Who would be the right person for this issue? I can provide more details. Thx.

&rey: @devs chat would be right, not this one. I believe they might have answered that one btw – please check chat history. (reply to 149472)

Selcuk: thx! will do. (reply to 149483)

Mehmet Ankara: Question to the TON Dev Community: Hi everyone 👋  I'm analyzing the wallet contract structure for Wallet V5, particularly the part where the wallet state is initialized using the following structure:  ts Kopyala Düzenle beginCell()   .storeBit(config.signatureAllowed)   .storeUint(config.seqno, 32)   .storeUint(config.walletId, 32)   .storeBuffer(config.publicKey, 32)   .storeDict(config.extensions, Dictionary.Keys.BigUint(256), Dictionary.Values.BigInt(1))   .endCell(); I have a question regarding the config.walletId value.  🧠 What exactly is walletId (also referred to as subwallet_id) supposed to represent in this context?  And more specifically:  👉 What value does the official Telegram Wallet (W5) use for walletId when deploying user wallets?  Is it always the same hardcoded value for all users, or is it dynamically derived per user or key?  Any clarification or pointers to where this is defined (FunC or deployment logic) would be much appreciated 🙏  Thanks in advance!

Slava: Having unpredictable walletId will make your wallet (seed phrase) incompatible with other wallet software. (reply to 149486)

Slava: What's that? (reply to 149486)

Mehmet Ankara: So how can I import a wallet with the same address as the memoric list? (reply to 149487)

Slava: You can call the get_subwallet_id on the deployed wallet contract to determine the ID used.

Mehmet Ankara: thank you i will try (reply to 149491)

IMe: Is there a way to check pnl of ton wallets ?

— 2025-05-27 —

它是: Any replies? (reply to 149250)

HeKnow: hello good morning guys please need help   Firstly I am the individual_content (from TEP64 standard in my init like this init(         owner: Address,         collection_address: Address,         item_index: Int,         individual_content: Cell?,         metadata: Metadata?     ) {         self.owner = owner;         self.collection_address = collection_address;         self.item_index = item_index;         self.is_initialized = false;         self.metadata = metadata;         let dict: map<Int as uint256, Cell> = emptyMap();         let attribute  = "[{ }]";         dict.set(sha256("name"), beginTailString().concat("Michaelzy #1").toCell());         dict.set(sha256("description"), beginTailString().concat("Michaelzy test nft").toCell());         dict.set(sha256("image"), beginTailString().concat("image link here").toCell());         dict.set(sha256("content_url"), beginTailString().concat("empty url").toCell());         dict.set(sha256("attributes"), beginTailString().concat(attribute).toCell());                   self.individual_content = beginCell()             .storeUint(0, 8)             .storeMaybeRef(dict.asCell()!!)             .endCell();     }  then i implemented the getter as so: get fun get_nft_data(): GetNftData {         return GetNftData{             is_initialized: self.is_initialized,             index: self.item_index,             collection_address: self.collection_address,             owner_address: self.owner,             individual_content: self.individual_content!!,         };     }  the tonviewer link shows the owner address and collection address but the content metadata is empty. I'd appreciate your help pls

HeKnow: Posted this in tact dev group but was banned for some reeason

/B4ckSl4sh\: I guess this link may help you  https://docs.tact-lang.org/cookbook/nfts/#on-chain-metadata-creation (reply to 149566)

Keshav: Hi Team I'm getting this Error   While deploying through command   npx blueprint run  TypeError: Cannot read properties of undefined (reading 'slice')     at /home/lenovo/Desktop/Work/POC/Lottry/node_modules/@ton/blueprint/dist/utils/selection.utils.js:77:47     at Array.map (<anonymous>)     at findScripts (/home/lenovo/Desktop/Work/POC/Lottry/node_modules/@ton/blueprint/dist/utils/selection.utils.js:76:10)     at async run (/home/lenovo/Desktop/Work/POC/Lottry/node_modules/@ton/blueprint/dist/cli/run.js:18:59)     at async main (/home/lenovo/Desktop/Work/POC/Lottry/node_modules/@ton/blueprint/dist/cli/cli.js:112:5)    I was just following the documentation  and made a tact boilerplate through this command   npm create ton@latest

Fardin: Hello my friends

Fardin: We are working on a dapp on ton which has a login with wallet address  Is the response of ton connect ( wallet address) secure enough for using as a fast login method?

&rey: If the login is for frontend only, it is. If it is for server, ask for tonProof too. (reply to 149606)

Fardin: It's for the backend and could make critical security issues (reply to 149607)

Fardin: Is tonProof something like the sign data in evm network?

&rey: Then tonProof proves that the connected user really owns the wallet they name. Yes, it signs a specific wallet-and-dApp-generated blob of data. (reply to 149608)

Fardin: Great, thanks buddy (reply to 149610)

— 2025-05-28 —

Evgenii: Btw regarding ton connect - is there a way to identify whether a connected wallet belongs to testnet or mainnet in case a wallet is not initialized yet?

Mojisola🍅 🍅: it is ur front-end, you can enforce what you want.  you can set testnet or mainnet (reply to 149622)

Evgenii: It won't help - I check the resulting ton proof in the backend. (reply to 149625)

Mojisola🍅 🍅: maybe you are not doing it correctly.

&rey: What do you mean though? If a proof succeeds, then the person owns wallet with that address in either network. (reply to 149622)

&rey: The network currently chosen in wallet app is .account.chain, where -239 stands for mainnet and -3 for testnet.

Mehmet Ankara: Hello again I am interested in importing wallet I am using ton_dart library via flutter and https://github.com/mrtnetwork/ton_dart/blob/8ba497819a04aeac7a67cdbba727d043d88dbfb7/lib/src/contracts/wallet_contracts/types/models/v5_client_id.dart#L43 what should I write to this number while importing subwalletNumber so that I can import my wallet or other wallet in telegram

Torit: Can you tell me if there is a telegram bot that can track my transactions in my TON wallet? So that when I replenish my wallet, I get a notification about it in the telegram bot?

Mojisola🍅 🍅: what is subwallet. thought it isnt needed when importing wallet (reply to 149667)

Mehmet Ankara: My problem is that I import with a memoric key, for example WalletV5, but it gives a different wallet address. (reply to 149670)

Mojisola🍅 🍅: this is exactly my experience too. different wallet address.  somebody should provide answer to this.

Slava: When instantiating a wallet contract's wrapper you need to provide exactly the same init data (considering the same code is used) that was used for deploying the existing wallet's smart contract. Otherwise you will get a different address.

Mojisola🍅 🍅: v5 for example gives different address in script (reply to 149681)

Mojisola🍅 🍅: and different address in tonkeeper even though I used same phrase

Slava: Seed phrase is only a part of the init data. You need to provide all the other details exactly the same as well.

Slava: By the way, why don't you use the createFromAddress method for instantiating the wallet? Considering the wallet is already deployed…

.kodgen: Your wallets were not accidentally created in 2019?

Mojisola🍅 🍅: I am surprised at this response.  If I use js to create wallet, it gives different address and when I import into tonkeeper, it gives different address (reply to 149685)

Mojisola🍅 🍅: I thought this issue is popular

Nxrix: what is the fastest api for getting ton price usd for my web app

Philipp: Good day,  I'm trying to understand the algorythm of the bidding on getgems. When I big a contract is being deployed and the amout is being send to the new contract. When I want to find the nft adress in this contract I use the method "get_offer_data"  Then I get some random output, I could convert the hex to decimal and then from unix to utc time or the the amout of the transaction. But I cant convert the "cell" to the apropriate adress.  Can someone please explain to me how to do this?    Thanks in advance!!

Slava: Hello. Why are you trying to reverse-engineer it when the contracts seems to be officially published on GitHub? (reply to 149703)

Slava: By the way, the NFT address is parameter No. 6.

Philipp: Just for my interest I would like to get the adres from this string

Philipp: is the an option to decode it?

Slava: See the link above.

— 2025-05-29 —

TON Bounty Bridge: ​Release 0.4.0  Created by MazepaDeni

零纪年〃微蓝一抹淡笑: 才抢了8.8u，手气真差 (reply to 15)

零纪年〃微蓝一抹淡笑: 才抢了8.8u，手气真差 (reply to 15)

楠笙几梦: 才抢了8.8u，手气真差 (reply to 15)

喊我女王万万岁: 才抢了8.8u，手气真差 (reply to 15)

零纪年〃微蓝一抹淡笑: 才抢了8.8u，手气真差 (reply to 15)

Makis: Hello everyone! Does anyone know the tradeoffs between using v2 vs v3 api? From what I understand v3 is indexed? Also less providers support it presumably?

Tharun Tej: Is there any api which gives metadata of telegram Collectibles?

&: const cellData = Cell.fromBoc(          Buffer.from(              'b5ee9c72010101010024000043800d8d14f7e5aad1d5630a7c7f5cb1af485023e32a71135f9534c5a163fe74720b70',             'hex'         )      ); console.log(cellData[0]?.beginParse().loadAddress().toString()); (reply to 149703)

🎩: Hello, We are developing TON based gaming project that's going to be accessible in telegram and our app. We want and advice how to move forward with the project. Our company is registered in Dubai, is there any possibility to meet someone from TON for possible cooperation

&: What's your problem? (reply to 149752)

🎩: Lack of experience in this field, we have experience in developing apps and operate them, but since we want to make our app and gaming hub as utility for our future token, we want to know how to move forward. 0 experience in launching projects in telegram (reply to 149753)

&: DM me (reply to 149754)

&rey: I somewhat doubt TON Foundation can help everyone so I'd suggest not to waste time.  Experience can be gained at looking at existing applications and deconstructing them, going through tutorials (docs.ton.org for TON, somewhere else for TMA), trying, reading chat history and communicating on new issues. (reply to 149754)

&rey: Also, warning in advance that place to discuss Telegram miniapps is not here. It is @devs instead.

🎩: Thank you very much

S: hey, I have bunch of experience in this tg field, ton smart contract dev and tg miniapp and tg bot devlopment. just dm me or send msg here (reply to 149754)

Zerox: Hi I have exp developing some ton mini apps on TG, if you need developers, let's connect. (reply to 149752)

Slava: Cell.fromHex('b5ee…') (reply to 149751)

Tharun Tej: ? (reply to 149743)

Vetch: Hi everyone

Vetch: Could someone please tell why my USDT transfer is failed? What should I do to make a successful transfer? This is my failed transaction  hash 6eee5ee0c0f2303c0a6b576a75341f05d3ce482438090cca8db0c4fe10a6c09e

&rey: nothing, it is complete. (reply to 149781)

Combot: Combot has warned Zohirbek (1/3) Reason: Word **** is not allowed

🇵🇸: retracer.ton.org and verifier.ton.org are showing different opcodes for same contract which one could be closest to real one? i have unknown contract that i want to understand how it works. could someone help me?

Petr: You can also try this one: https://txtracer.ton.org (reply to 149801)

Andrei: Hey! Is there a chance someone can help me crafting contract deploy transaction?              // Prepare TON smart contract transaction             const __system = Cell.fromBase64(CONTRACT_STATE_INIT_DATA);             const data = beginCell().storeRef(__system)                 .storeUint(0, 1)                 .storeInt(id, 257)                 .storeInt(toNano(parseFloat(amount)), 257)                 .endCell();              const body = beginCell()                 .storeUint(0, 32)                 .storeStringTail(`Create contract: ${text} with ${amount} TONs`)                 .endCell();              const init = {                 code: Cell.fromBase64(CONTRACT_CODE),                 data: data,             } satisfies StateInit;              const stateInit = beginCell()                 .store(storeStateInit(init))                 .endCell();              const address = contractAddress(0, init);             const address_string = address.toString();              try {                 // Perform TON wallet transaction                 const transaction = await tonConnectUI.sendTransaction({                     validUntil: Date.now() + 5 * 60 * 1000,                     messages: [                         {                             address: address.toRawString(),                             amount: toNano('0.02').toString(),                             stateInit: stateInit.toBoc().toString('base64'),                             payload: body.toBoc().toString('base64'),                         },                     ],                 });  Init parameters are quite simple on a contract level.  message Init {     id: Int as uint32;     amount: Int as coins; }  When I'm trying to deploy the contract, I'm having an error. Exit code 130 (invalid incoming message)  What am I doing wrong?

🇵🇸: can you please summarize what this contract does: https://txtracer.ton.org/?tx=52b7ef34c7c43cbc9bea88a481c46e80219bf89b54ed8bb249c87c0e6038c36b (reply to 149802)

&: you have input contract code but not intial state cell (reply to 149803)

— 2025-05-30 —

Vetch: But why the final notification is failed? I couldn't figure it out (reply to 149782)

кравлер kernel: Hi guys! Help me please, where can I get a testnet +888 number?

Mojisola🍅 🍅: have you checked fragment platform? (reply to 149815)

кравлер kernel: Yea (reply to 149816)

кравлер kernel: but i need testnet number +888

кравлер kernel: where can i get it?

Mojisola🍅 🍅: sorry, why not use mainnet

Mojisola🍅 🍅: own. I think the target is mainnet not testnet

&rey: Why do you think they exist? What would they even mean, in context of Telegram? (reply to 149820)

кравлер kernel: So +888 testnet doesn't exist?

Nxrix: nope (reply to 149829)

Denis S: Hey! Friends. Please help me. How to get jetton deply date and time from TON API. I tried so many options and still can't get it properly. Thanks

Denis S: I have found solution.

Combot: Combot has warned l1ttps (2/3) Reason: Word **** is not allowed

Zerox: Hello everyone, Anyone have plan to build perp swap platform like GMX in TON? If yes, would love to contribute as a developer.

MikeWeb3Mighty: Hello everyone! Tell me examples of smart contracts with a referral system on USDT(Ton).

Andrei: Hey! Can someone help with crafting deploy transaction?  ```             // Prepare TON smart contract transaction             const __system = Cell.fromBase64(CONTRACT_STATE_INIT_DATA);             const data = beginCell().storeRef(__system)                 .storeUint(0, 1)                 .storeInt(id, 257)                 .storeInt(toNano(parseFloat(amount)), 257)                 .endCell();              const body = beginCell()                 .storeUint(0, 32)                 .storeStringTail(`Create contract: ${text} with ${amount} TONs`)                 .endCell();              const init = {                 code: Cell.fromBase64(CONTRACT_CODE),                 data: data,             } satisfies StateInit;              const stateInit = beginCell()                 .store(storeStateInit(init))                 .endCell();              const address = contractAddress(0, init);             const address_string = address.toString();              try {                 // Perform TON wallet transaction                 const transaction = await tonConnectUI.sendTransaction({                     validUntil: Date.now() + 5 * 60 * 1000,                     messages: [                         {                             address: address.toRawString(),                             amount: toNano('0.02').toString(),                             stateInit: stateInit.toBoc().toString('base64'),                             payload: body.toBoc().toString('base64'),                         },                     ],                 });  Contract with Deployable {     id: Int;     amount: Int as coins;     ———      init(id: Int, amount: Int) {         self.id = id;         self.amount = amount;     ———     } ```  I'm having an error upon deployment. 130 invalid incoming message

AutoShield: Hello 👋 I have an idea for an advanced AI-powered Web3 wallet that can integrate with TON and Telegram (via Mini Apps). Is there someone from the core team I could share a quick update or pitch with? I’d appreciate any direction. Thank you

Zerox: Hey, I am looking for new projects now, if you need more developers in your team, would love to discuss with you. (reply to 149887)

Zerox: Do you plan to develop project with the idea? If yes, would love to discuss further. One thing I wanna say first,  I am not a TON core team member (reply to 149889)

AutoShield: Thank you for the idea, it is strong to subscribe but contact the team

TON Bounty Bridge: ​money  Created by Polyanov

angel: Hi there,  Thanks for sharing your vision — it sounds like an exciting project! I have hands-on experience developing games and apps on the TON blockchain, including Telegram-integrated games, smart contract logic, and onboarding user flows. I can definitely help guide you on how to move forward — from setting up your TON wallet & token infrastructure, to game logic integration, Mini App deployment, and even launch strategies inside Telegram.  I’d be happy to:   - Set up Telegram Mini App or bot integration  - Handle smart contract development and in-app transactions (e.g., NFT rewards, game economy)  Is there any opportunity I can work with you? (reply to 149752)

— 2025-05-31 —

番茄你个白薯: 发了18888u (reply to 15)

此籹子不需要谁来怜惜: 发了18888u (reply to 15)

此籹子不需要谁来怜惜: 发了18888u (reply to 15)

灬夏恋海边: 发了18888u (reply to 15)

此籹子不需要谁来怜惜: 发了18888u (reply to 15)

灬夏恋海边: 发了18888u (reply to 15)

Zerox: Hey Andrei. That 130 invalid incoming message error usually means your contract isn’t handling the incoming init message correctly. Make sure you’ve implemented recv_internal() and try increasing the sent amount (e.g., 0.05 TON) to cover deploy costs.  Could also help to simulate the tx in TON Sandbox for better debugging. (reply to 149887)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: Here anyone knows how can I get in touch with the official TON network support?

Андрей: @ton_help_bot (reply to 149947)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: No one answers. (reply to 149951)

Андрей: then you didn't wait long enough for an answer (reply to 149954)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: No, it's been a while since I sent a message to this bot asking for help. (reply to 149955)

&rey: What was the class of issue? Did it involve any service beyond TON Blockchain? (reply to 149954)

Slava: I want to share some important information about using TON HTTP API keys. Below are the best practices discussed with my friends at toncenter.com:  1. RPS (Requests Per Second) Limits: Each toncenter account has a limit on the number of requests. Higher tariff plans allow for more requests, enabling more users to access the application simultaneously.  2. Limiting RPS by IP Address: There is an option to limit RPS based on IP addresses. If your Web3 application exposes the API key on the client side, we strongly recommend enabling this setting. Without it, your service is vulnerable to denial-of-service (DOS) attacks from a single IP address.  3. Domain Name Restrictions (CORS): Implementing restrictions based on domain names is advisable, particularly for Web3 apps. While this measure is not foolproof, it can help prevent unauthorized use of your API key in other web applications.  4. Utilizing a Reverse Proxy: Because the above protective measures can potentially be bypassed, it's recommended not to expose your API key directly. Instead, consider setting up a reverse proxy. This will hide the key and provide you with additional ways to defend against attacks if you have the necessary resources.  5. Full Backend Solution: The most reliable solution, though not ideal for Web3 applications, is to have a complete backend setup that includes caching, request limitation, and authentication.  6. Current Challenges for Web3 Applications: For a full-fledged Web3 applications, the situation is still quite challenging. By enabling domain binding and IP-based RPS restrictions, you can potentially maintain service under normal conditions. However, in the event of a DDoS attack, there is a high likelihood of service disruption, particularly for small projects on lower tariff plans with limited RPS. This remains true even with the presence of a Web Application Firewall (WAF) to protect against common attacks.  At this point, the only reliable solution I see for decentralized finance (DeFi) is to allow users to input their own endpoints and API keys within your Web3 application. Although this may negatively impact the user experience, it promotes decentralization, which comes with its own costs.

Combot: Combot has warned Bohdan (1/3) Reason: Word **** is not allowed (reply to 149963)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: yes, username transfer on TON Blockchain - fragment frozen commissions fee and TON assets during this process (reply to 149962)

&rey: So it did involve non-blockchain service, namely Fragment. Please refer to them. (reply to 149966)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: and fragment support are exhibiting suspicious behavior (reply to 149967)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: I can't find their official support. (reply to 149967)

&rey: TON Community Chat's moderators say it is help@fragment.com .  As for any service you learn about — if you do see something suspicious, you should not use it or learn more. It's one of the basic rules for protecting from scam as well. Anyways, TON is The Open Network, many things can be run here. (reply to 149969)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: Can you please look into a transaction related to the commission that I was asked to make and tell me the details? (reply to 149970)

&rey: No one in this chat, including me, has influence over what private services do. (reply to 149971)

Alireza⁪⁬⁮⁮⁮⁮⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮: No, help me explain the sections in the tonviewer transaction link please. (reply to 149972)

AGT: Gentlemen, is there any way to destroy the tokens transferred to the black hole address?

Jimmy: Unfortunately, tokens that end up in a "black hole" address (i.e. an address that cannot be controlled or from which funds can be extracted) cannot be destroyed or returned. A black hole in the blockchain is simply an address that does not belong to anyone, and funds sent there are lost forever. (reply to 149980)

&rey: That's quite imprecise; the TON black hole -1:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff also disposes of any native currency sent to it (IIRC half those TON are distributed by validators and half are destroyed reducing the total stat). (reply to 149982)

AGT: But the total circulation on the chain includes this part of the tokens, right? (reply to 149982)

&rey: That's the point; it does NOT. Just like half of transaction fees are destroyed, meaning that those TON are no more. You can see that the black hole address (whose alternative spelling is Uf___________________________________________-ll) contains zero TON despite being sent some. (reply to 149987)

Jimmy: No (reply to 149987)

AGT: UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ This is the address I transferred to. (reply to 149988)

&rey: No. The tоkens are owned by this address, but no one will ever deploy a contract there, so no one will be able to do anything with tоkens. (reply to 149992)

AGT: Is this address a black hole address? (reply to 149993)

Jimmy: Stop deleting my information to that dude pls. (reply to 149993)

&rey: No. It is just unusable (unless SHA-256 preimage is found for all-zeros, which is harder than mining). (reply to 149994)

AGT: My tokens were issued 190,000,000 before, I transferred 1010,000,000 here, but tonscan shows that there are still 190,000,000 tokens in circulation

AGT: It seems that I was wrong, this is an irreversible mistake (reply to 149996)

&rey: Please note that black hole does not do anything to non-native tokens either (and TEP-74 jettons are fungible tokens).  TEP-74 has a special facility, burn message, which allows to permanently remove some jettons you own.

AGT: 👌🏿

Dmitry | backend4you.ton: Yes. The fact that you don’t know seed (private key) from some contract that owns your jettons doesn’t mean that these jettons do not exist. The fact that nobody knows (and has no chance to know) means the same. To “destroy” some jettons you need to send them back to jettons master with “burn” command. Jetton master will decrease total amount (reply to 149997)

AGT: OK, I understand.

shealtielanz: Hello, How can i submit a bug in a very used standard and get rewarded for it?

shealtielanz: ? (reply to 150005)

&rey: A bug, or improvement opportunity? Please submit latter to https://github.com/ton-society/grants-and-bounties/. (reply to 150005)

shealtielanz: this isn't what I'm looking for, i'll do my own research (reply to 150008)

ming: is this true ?

&rey: No. Please do not use any links/buttons from that message. You can open Fragment on your own to check what is real. (reply to 150011)

ming: Someone asked me to follow the instructions in the video. The video seemed very realistic and I almost fell for it.

&rey: Then, just ignore them. The video itself does not belong in this chat. (reply to 150014)

&rey: Please see chat name for its primary topic though! Any questions on how to develop on TON are welcome.

— 2025-06-01 —

Combot: Combot has warned 巴黎铁塔上盛开的繁华* (1/3) Reason: 1 reports (reply to 150060)

Александр 🫶: anyone else has trouble with transactions that were proceed when blockchain was down? lost tether

&rey: Do you have the hash of transaction which has been executed and its followup in the tx tree has not? (reply to 150114)

&rey: If not, then jettons simply lie in sender's wallet, untouched.

Александр 🫶: msg deleted

&rey: Contact their support.

Александр 🫶: their wallet is not deployed, have hashes on my jetton address but no info about the wallet to i have sent

Александр 🫶: jetton addr only show my addr

Александр 🫶: may be that is why cannot see money on their wallet (reply to 150122)

&rey: Well, that is common for custodial services. If their processing went down with block generation, it might handle everything upon next transaction (1 microUSDT). (reply to 150122)

Александр 🫶: thx

— 2025-06-02 —

CHINA: It's real?

CHINA: True info?

isik: Hello 👋, does anyone used okx web3 API before it shut down. I was using okx web3 API a few months ago and it worked perfect, but when I try to make API calls now it takes almost 1 minute to get the quotes response from the API. Do I need to create a new API key or something else. Any help appreciated

🇵🇸: can anybody help me to parse this dict?  x{C_}    x{2_}     x{7BA_}      x{AD9A741281DCD6539DC_}      x{2_}       x{2_}        x{A852184A07735943F9_}        x{A83A604A0773594241_}       x{AA11542503B9ACA1DD}     x{2_}      x{2_}       x{2_}        x{4}         x{AD9A741281DCD650B24_}         x{2_}          x{2_}           x{A852184A077359487D_}           x{A83A604A07735940BD_}          x{AA11542503B9ACA116}        x{4}         x{AD9A741281DCD68D28C_}         x{2_}          x{2_}           x{A852184A07735941F3_}           x{A83A604A0773594195_}          x{AA11542503B9ACA78E}       x{2_}        x{4}         x{AD9A741281DCD652CEC_}         x{2_}          x{2_}           x{A852184A07735940BF_}           x{A83A604A077359413D_}          x{AA11542503B9ACA36C}        x{4}         x{AD9A741281DCD6510BC_}         x{2_}          x{2_}           x{A852184A0773594811_}           x{A83A604A0773594839_}          x{AA11542503B9ACBC31}      x{70}       x{AD9A741281DCD650B2C_}       x{2_}        x{2_}         x{A852184A07735940C1_}         x{A83A604A0773594FAB_}        x{AA11542503B9ACA351}

Dmitry | backend4you.ton: What you expect by “parse”? Do you know what are key length and value type? (reply to 150145)

🇵🇸: i dont know keys and values  😢 probably some integers. may be this can provide some hint https://txtracer.ton.org/?tx=57bc2c5e3b66bab77cc43fcf384a139dfb0575ffd2cbc3e4f2b3d18131da5990 (reply to 150146)

&rey: 64-bit keys, empty values. (reply to 150146)

🇵🇸: loadDict(Dictionary.Keys.Uint(64),Dictionary.Values.Cell()) producing no more reference error

&rey: Because the contained value is not a cell, it is empty. (reply to 150151)

🇵🇸: how to set empty value in loadDict() ?

Dmitry | backend4you.ton: Slice? (Didn’t tried, just guess) (reply to 150153)

🇵🇸: my code is like this.   {         u: ref_s.loadUintBig(256),         uu: ref_s.loadUint(34),         uuu: ref_s.loadUint(8),         uuuu: ref_s.loadDict(Dictionary.Keys.BigUint(64),Dictionary.Values.Cell()),     }

🇵🇸: just loadDict has problem

Combot: Combot has warned 海上花 (1/3) Reason: 1 reports (reply to 150161)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 16 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 65  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

🇵🇸: only the dict stored in state data seems to be having this structure. (reply to 150150)

🇵🇸: i need to parse dict that is sent in external message

&rey: Just checking: you already tried Dictionary.Values.BitString(0)? (reply to 150170)

🇵🇸: yes but it is able to parse only dict stored in state data ,  i want the dict sent in this transaction https://txtracer.ton.org/?tx=57bc2c5e3b66bab77cc43fcf384a139dfb0575ffd2cbc3e4f2b3d18131da5990 (reply to 150173)

🇵🇸: this contract loads state data( line #54)  may be you mistaken it as what i want.

🇵🇸: i want this dict in line number 106

&rey: It might have key len 28. (reply to 150176)

Happyful: Gm every one.  Is it possible to connect with the TON team/DevRel or anyone from TON?  We’ve a product that lets users to shop retail/e-commerce (think Amazon) using crypto.  And we would love to bring this to TON and Telegram.   Would appreciate a lead.

&rey: If you want to connect to TON Foundation, that's partnership@ton.org (reply to 150178)

&rey: Depends on what you mean by "succeed" in fact. (reply to 150192)

kidogb: I mean how can I check the status of a transfer. I can see in the traces, there are 3 transactions.

kidogb: And one was failed. I tried to get the trace but too many fields, make me confusing

kidogb: How can I check the status same as the tonviewer

&rey: See its bottom right menu. (reply to 150198)

kidogb: thanks, any chance to check it from the toncenter api v3?

&rey: I don't think anything shares Tonviewer's definition precisely. (reply to 150200)

Aleksander: Hello everyone!  Guys, please tell me if there is an API in the Tonnel market? I have a cool idea, I want to try to implement it!   thanks

Tom: 706 is a “common” error for not enough jetton. (reply to 150196)

— 2025-06-03 —

Soon Guan: Hi! what's the TON Balance in the Elector Contract supposed to represent? :O  1. Is it the total stake of TON on the network?  2. Are the rewards that it receives from the system = to universe of staking rewards distributed

TON Bounty Bridge: ​TON Ecosystem  🏷 Developer Tool  Summary:Ton  Created by calvin-bitcoin

Combot: Combot has warned Devameer•ton 💙 (1/3) Reason: 1 reports (reply to 150237)

TON Bounty Bridge: ​Ton  Created by Red03Red03547

Soon Guan: Can nominator pool submit 2 different stake elector contract o_o?  https://tonviewer.com/Ef9SgTB0x_36riLHzxje_7Sz5e803iBsuU20QnP6EyTLKLBG

🇵🇸: can anybody explain this code like how dictionary key is constructed ?  PUSHCONT {                         NOW                         LTIME                         PUSH s4                         ADD                         XCHG_0 s4                         INC                         SWAP                         PUSHINT_8 15                         AND                         LSHIFT_1 24                         XCHG_0 s4                         PUSHPOW2DEC 24                         AND                         XCHG_3 s1 s4                         ADD                         PUSH s2                         PUSHINT_8 28                         DICTUGET                         NULLSWAPIFNOT                         PUSHCONT_SHORT {                             LDGRAMS                             SWAP                             SETGLOB 1                             ENDS                         }                         PUSHCONT_SHORT {                             DROP                         }                         IFELSE                     }

Zerox: I think Tonnel doesnt support external API but if you want, I can get all the data using Dune-Tonnel TG Gift Marketplace or other ways, so what's your cool idea? (reply to 150207)

🇵🇸: i have dict like this key is 28 bits value is coins. can anybody tell me on what logic the contract picks a specific item from the dict?    'n:130261058' => 5000000093n,       'n:131261058' => 5000001577n,       'n:132261058' => 5000001659n,       'n:147038274' => 5000000866n,       'n:148038274' => 5000002036n,       'n:149038274' => 5000000074n,       'n:150038274' => 5000000846n,       'n:163815490' => 5000000849n,       'n:164815490' => 5000000845n,       'n:165815490' => 5000000160n,       'n:166815490' => 5000000256n,       'n:180592706' => 5000018709n,       'n:181592706' => 5000000040n,       'n:182592706' => 5000000054n,       'n:183592706' => 5000000299n,       'n:197369922' => 5000000299n,       'n:198369922' => 5000000231n,       'n:199369922' => 5000000269n,       'n:200369922' => 5000000204n,       'n:214147138' => 5000000769n,       'n:215147138' => 5000002971n,       'n:216147138' => 5000001212n,       'n:217147138' => 5000000181n (reply to 150253)

TON Bounty Bridge: ​TON Security Enhancement via Google OSS-Fuzz Integration  🏷 Developer Tool  Summary:Integrate TON blockchain components into Google OSS-Fuzz for continuous automated security testing t...  Created by vah13

🇵🇸: ?🥹 (reply to 150267)

pL: Hi, I have a question, can I retrieve tx with it’s hash and LT, are there any ways to do this?

&rey: (address,LT,hash) is the native tuple for retrieving; indexers can do so from (hash) alone. (reply to 150277)

🇵🇸: how to compute dict key like 131261058 from this code? (reply to 150253)

pL: Thank you! (reply to 150278)

Aleksander: I aim create a collective purchase system for expensive gifts 🎁 and something else (reply to 150255)

— 2025-06-04 —

Alula: Hello TON Dev community — I’m with Covalent, and we’re exploring partnership and indexing opportunities on TON. Could someone point me to the right person or team to speak with?

Soon Guan: Hi all! I'm interested in understanding staking rewards per ton account  Is it possible to do the following with transactions and messages data?   1. Fetch stake/unstake movement of TON from nominators and validators  2. Identify rewards accrued for each staker (nomin/validator) after each election   3. Identify rewards of all validators in each election cycle?   Basically I want to input address X and find how much staking rewards it has received for accounting purpose

Alula: That’s a real challenge — I found some block explorers and APIs that sort of let you pull this info, but it’s patchy at best.  That’s actually why I think a TON x Covalent partnership could be powerful.  I can get 100+ EVM wallet balances instantly with Covalent — why not TON? Structured access to staking data, validator rewards, and onchain movements would open up a ton of use cases for devs, auditors, and infra teams. (reply to 150308)

Andrei: I think I sorted it out Thanks though (reply to 150314)

&rey: You could start with the Elector contract / reading network parameter which holds current stakes. (reply to 150308)

&rey: In Tonapi, there is /v2/accounts/_bulk already, so you're just mistaken on this. (reply to 150309)

🇵🇸: help me friends whoever helps to solve this puzzle i will surprise with gifts. (reply to 150280)

&rey: Stack had: ... c b a Key is: ((now()%16) << 24) + (lt+c)%(1<<24) (reply to 150253)

Soon Guan: Interesting! is th historical stake and election data also found in the elector contract as wlel? (reply to 150327)

🇵🇸: this is 16 or 15 i don't see 16 in the code ? (reply to 150333)

🇵🇸: is https://txtracer.ton.org/?tx=57bc2c5e3b66bab77cc43fcf384a139dfb0575ffd2cbc3e4f2b3d18131da5990 reliable to analyse a transaction? i see some block of code showing as "not executed" but i don't think so.

&rey: &15 or %16 is the same – taking four smallest bits. (reply to 150338)

.: Hello, can someone help me integrate the system to buy project tokens with tons in the mini app or transfer existing tokens to the project or withdraw project tokens in the mini app to crypto wallets?

&rey: It is called a DEX; if you use popular AMM-based ones (that is, ston.fi or dedust.io), you can look at their SDKs. (reply to 150345)

&rey: If I understand right, github.com/gobicycle/bicycle is suitable. (reply to 150345)

.: I understand, I looked at ston.fi, but I'm new to blockchain software and programming, so I don't know much. Are there any resources that give examples of how to do it step by step? I'll learn, and thank you very much for your help. (reply to 150348)

.: Thank you (reply to 150349)

&rey: You're looking for https://docs.ston.fi/developer-section/quickstart/swap (reply to 150350)

.: Thank you (reply to 150352)

Justice: I can (reply to 150345)

.: Can I write to you privately? (reply to 150352)

mikail: After buying telegram stars on fragment.com i need to confirm transaction in my wallet (e.g. Tonkeeper). So I want to automate this process and make a script doing that(transaction confirming). So could you please tell me how can i do it because i didn't find any point in documentation about transaction confirming.

&rey: Tonkeeper does not have functionality for automatically confirming transactions as it would be harmful to common users. You need a specific TC2-compatible wallet, perhaps writing your own. (reply to 150359)

mikail: what python library can i use to do this? (reply to 150360)

&rey: That's kind of complex. You will need something like tonutils/pytoniq, requests and some more. Implementing your own wallet's side for TON Connect 2 is not documented well in fact. (reply to 150361)

mikail: Okay, thank you (reply to 150362)

🇵🇸: how can we compute LT from unix timestamp? like we see here  https://explorer.toncoin.org/last is there any formula?

Denis: there is not any direct connection between lt and unixtimestamp (reply to 150364)

Alex: Hi everyone

Alex: How can I validate my issued token? So that when I transfer it, the wallet does not display the message "This token is not verified. Buy only tokens that you trust" ?

Daniel: you should make a pull request to tonkeeper’s repository on github (reply to 150370)

Alex: Thnx Daniel (reply to 150371)

Daniel: https://github.com/tonkeeper/ton-assets (reply to 150372)

🇵🇸: so where these values are coming from?  lt  57930295000000 .. 57930295000004 (reply to 150366)

Denis: https://en.wikipedia.org/wiki/Lamport_timestamp (reply to 150376)

🇵🇸: hard to understand.   i see i can get these values using your api https://tonapi.io/v2/blockchain/masterchain-head does it change every second or every block? (reply to 150378)

Denis: every block

🇵🇸: How do I compute an internal message hash? What are the required parameters?

&rey: You should format it as block.tlb does, and hash the resulting cell. (reply to 150387)

🇵🇸: you mean this?  https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L126 (reply to 150388)

&rey: Yes, followed by possibly StateInit, followed by payload. (reply to 150389)

Juster: Hello, which TON indexers you use for real-time data. It is not always convenient to send data via API, do you write your own scanners?

Juster: Hello. if some one from this asset list will be scammed in future, he will be removed from this list? (reply to 150373)

pL: Hello, is there any way to unmarshall smart-contract response from message body?

&rey: It is defined by TL-B which often comes within contract's source code, or in standard (TEP-62 for NFTs, TEP-74 for jettons). (reply to 150408)

pL: Thank you (reply to 150409)

— 2025-06-05 —

MAGIC | Blockchain🙏: Has anyone tried developing multi-contract defi on ton. Jettons token transfer fee is almost 30 times higher than on Binance chain. I can't afford if an order of 30 USDT but it costs almost $3 in transaction fee with 15 contracts launched

MAGIC | Blockchain🙏: It's too expensive to build defi on TON. I wonder if there's a better way? Hope to hear from you.

🇵🇸: const cell = beginCell() .storeBit(0) .storeBit(1) .storeBit(1) .storeBit(0) .storeAddress(Address.parse(src)) .storeAddress(Address.parse(dest)) .storeCoins(value) .storeDict(null) // Extra currencies (null if none) .storeCoins(0n) .storeCoins(fwd_fee) .storeUint(created_lt, 64) .storeUint(created_at, 32) .storeBit(false) .storeBit(true) .storeRef(payload) .endCell(); is this correct approach? this is working if there is no payload, or the payload contains no ref.  if the payload contains ref then the cell giving wrong hash.  any idea how to fix? (reply to 150390)

🇵🇸: exact code here https://pastebin.com/raw/RyJNELAP (reply to 150428)

&rey: Though what do you use internal message hash for? Also, doesn't your API return the whole message cell?

🇵🇸: i need to precompute hash to compete in a race.  can you check pastebin link please? (reply to 150431)

&rey: Then how an internal message helps you? Presumably you'd meant to optimize hash of external one? (reply to 150432)

Nxrix: how many bits is the storage of a contract

🇵🇸: i think its internal only. i saw some guys influencing internal message orders to take some advantage (reply to 150433)

&rey: Well up to 67043328, see at https://docs.ton.org/ru/v3/documentation/smart-contracts/limits#message-and-transaction-limits (reply to 150434)

🇵🇸: ? (reply to 150430)

🇵🇸: can anybody check this code and tell me why the hash is not same? (reply to 150430)

pL: Hi, i have a question about msg parsing: while transforming msg payload to slice a receive next struct:   556[...] -> {   267[...],   56[...] }  Doing slice.LoadRef() I receive only 267[] and losing 56[] is there a way to get 56[]?

&rey: So you do LoadRef once more. (reply to 150447)

Slava: Are you saying that you have 25 jetton transfers in your transactions chain? Are you sure your architecture is optimal? (reply to 150425)

pL: It says there is no any refs and after first LoadRef it shows only 267[] part (reply to 150448)

&rey: On which of the slices do you call second LoadRef? (reply to 150451)

О.К: Hi, I need help with a smart contract. Is there a recommended way to issue a custom asset in TON in 2025?

pL: I solved it, the problem was in not referring from raw message body, thanks (reply to 150454)

Always Polite: Hi Ton token contract is written in solidity?

Always Polite: We want to launch our token on TON Mainet  Where i can get other things? Examples , testnet tokens etc.

Daniel: Smart contracts are written in FunC, TACT or TOLK (reply to 150463)

Daniel: You can read about token standard (Jetton) here: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 150463)

&rey: No, that would be impossible since EVM languages do not work on TON. (reply to 150462)

Nikhil: Is there any way i can compile and execute smart contracts locally using python?

&rey: Compile – not particularly.  Execute – yes; see pytvm. (reply to 150468)

Dh dh: Is this scam?

&rey: That is. Please don't engage with it. (reply to 150475)

&: Why not use Ts? (reply to 150468)

Алина: I get this annyoing bug - when i send money to my highload wallet, wait for the transaction to finalize and then create a transfer from that wallet, the order of transactions gets somehow mixed up and the transfer fails because there were no money at the moment.  Could that be related to the createdAt parameter in the highload ext in msg?

&rey: Did you wait for the arrival transaction to happen, or just for the sending one? (reply to 150480)

Алина: I did wait until the money comes sort of speak (reply to 150481)

&rey: Well I should remind that TON transfer consists of two transactions, not one; and if you wait for the second one, then highload transfers do succeed.

Алина: Oh, that could be the culprit! Thanks (reply to 150483)

— 2025-06-06 —

TON Bounty Bridge: ​Wallet  Created by delaram7

TON Bounty Bridge: ​Wallet et 😁 pour la fin  Created by delaram7

TON Bounty Bridge: ​Vaule  Created by delaram7
