Michael: If you are not a developer, you should get help from a dev to customize your contract to take fee from transactions and deploy using script. (reply to 53887)

Oscar: I am a developer, but I'd like some support with the FunC language and if there are any guides on doing something like this. I've looked into Solana contracts - and they involve things like withdraw authority addresses etc. How do I implement something like this?

Santokh: Hello guys, is there any DeDust for testnet environment?

Santokh: I want to create a pool and test on testnet with MyCustomJetton/TON pair

Oscar: I don't think so. I think it's only for the mainnet. Same as things like ston.fi. (reply to 53893)

Santokh: Then, how to test with pool on testnet? (reply to 53896)

Yaku: thanks! (reply to 53861)

Vitalii: Hi! Is the *= operator supported by the Tact language? Just took example from docs: fun pow(a: Int, c: Int): Int {   let res: Int = 1;   repeat(c) {     res *= a;   }   return res; }  But the compiler is rising error on *= operation : Syntax error: expected "\"", "initOf", "null", "_", "A".."Z", "a".."z", "false", "true", a digit, "0X", "0x", "(", "!", "+", or "-"

MJ: hello guys

Oscar: hello?

MJ: does anyone know the rules of address validation, the regular expressions of TON ?

Haq: Here you can check it:   https://docs.tact-lang.org/book/operators (reply to 53907)

Vitalii: Yeah, I take an example from docs, but it's not compiling. Maybe the problem is on the blueprint side (reply to 53913)

Oscar: As the *= operator is just multiplying a variable, you could replace it with res=res*a like below: fun pow(a: Int, c: Int): Int {   let res: Int = 1;   repeat(c) {     res = res * a;   }   return res; }  Maybe that will fix it? (reply to 53907)

Anton: yes, since Tact v1.2.0 (reply to 53907)

Oscar: Is your compiler updated...idk tbh.

Oscar: I mean...if it works it should be fine right? It's meant to convert to FunC anyway - unless I'm mistaken.

Anton: no, it’s not meant to convert to FunC, it’s just the way it’s currently implemented (reply to 53920)

Oscar: Oh ok

Oscar: Anyways, here's my question 🙂 (reply to 53816)

Anton: what does tact --version say? (reply to 53918)

Oscar: I am a developer, but I'd like some support with the FunC language and if there are any guides on doing something like this. I've looked into Solana contracts - and they involve things like withdraw authority addresses etc. How do I implement something like this?

Vitalii: Hmm, let me check dependencies (reply to 53919)

Oscar: yeah. I was wondering what the compiler was like. (reply to 53925)

Anton: https://t.me/tondev_eng/53917

Oscar: it might be a problem with the installation of the compiler or if the compiler is out of date.

Vitalii: yeah, that was outdated dependencies, sorry

Vitalii: thanks for the help!

Oscar: Yay. Problem solved.

wikig: Hello guys , is there any telegram_bot hosting service ?   How can we host a telegram without coding to build a serive ?

Father Pepe Of: I use Ubuntu 20 vps server, have to install dependencies yourself though (reply to 53935)

wikig: Same do i do . but ... well , not every developer wants to host it's own back-end for bot-api , mostly for those have very simple functions .  like most of the game in telegram do require an entrance of webapp game only . (reply to 53936)

wikig: Most of fucntions just to handel /start /menu /app to display the webapp in internal button with ritchtext . that's all they require .... (reply to 53938)

Father Pepe Of: Glad you got that far, I couldn't even get the SDK to work. Also couldnt find on any of the APIs /get time. It doesn't show the date on any calls, only utime. Which is so outdated

wikig: So i am thinking is there any service to provide simple response bot to the incomming game developers . (reply to 53941)

wikig: Which sdk you using ? (reply to 53943)

Thang: hi guys, I have a question. Can I share variables storage between master and wallet?

Father Pepe Of: Ton_sdk (reply to 53945)

Father Pepe Of: One from github (reply to 53947)

wikig: okay , python , seem the repo not been update for nearly a year .... (reply to 53948)

Father Pepe Of: Yer using python

Father Pepe Of: Pretty sure the ton sdk is broken, so many errors with it

wikig: lol . what functions your require  ? in TON chain or for telegram-bot ?

Father Pepe Of: Deposit, withdraw, balance and tip

wikig: in TON  ? (reply to 53954)

wikig: Well , i think that might require to deploy a func contract ( unless build it centralized )

Father Pepe Of: Yer using TON (reply to 53955)

&rey: It has been removed from documentation, even. Where did you find it?)) (reply to 53951)

Father Pepe Of: Was on github (reply to 53958)

&rey: See SDK list on docs.ton.org for up-to-date alternatives

&rey: No, except by messages. (reply to 53946)

Father Pepe Of: Yer that's where I got it from I mean, not github lol

Father Pepe Of: Was where the apis are

Father Pepe Of: Got it from here   https://toncenter.com/

Father Pepe Of: Javascript SDK

Father Pepe Of: That the right sdk? Or that outdated (reply to 53960)

&rey: TonWeb is JS; had not all options in my experience.

Father Pepe Of: Had major issues with it including syntax errors within the SDK using python1/3

Lakshay: Hey, Web3 fam!!   I'm working on a cool Web3 Centric event series called "Dev Fusion Cohort".   *If you're plugged into India's Web3 Events and Communities scene, I bet you have heard about this!  Past success! Our previous events in Delhi & Ahmedabad were filled to capacity with a highly engaged community.  Why should you care? We're expanding to 3 new cities, Finally!!!   Here's the kicker: Our sponsorship format is unique - No confusing tiers! (High ROI and Low Investment).  Intrigued? If you're interested in getting involved (or know someone who might be!), shoot me a DM and I'll share the sponsor deck with you.   (It's a win-win!)  Let's build the future of Web3 together!  P.S. Feel free to share this with anyone in your network who might be interested!

Father Pepe Of: 🤨

Klay.D: Is there a way to generate wallets and make them on different shards?

Thang: It means, Suppose I config max_transfer in master So I need to handle the send_tokens function, wallet call to master to check the jetton_ amount is valid, after receiving notification from master I can continue the money deduction flow. (reply to 53961)

Thang: It's hard to understand why TON is not allowed to call the get method directly from contract to contract

Father Pepe Of: I'd just like to know how to get the SDK to work lol

Father Pepe Of: Without syntax errors

&rey: It is not hard: to maintain sharding, TON killer-feature. (reply to 53974)

&rey: All contracts are basically autonomous and don't depend on other ones for calculations, so there's no need for large proofs to validate a block.

&rey: That scenario... are you sure it makes sense? (reply to 53973)

&rey: It's generally called mining; yes, just try random mnemonics until you collect a full set. (reply to 53972)

Thang: My business is max_transfer which is configured in master by admin, it can change, every time wallet transfer actions need to validate this value. Do you have a better idea? (reply to 53979)

Klay.D: how could I determine one wallet is on which shard if just mining offchain and not actually deploy it? (reply to 53980)

&rey: Yes. But no idea whether you should be helped, because once you try to sell such token it is basically a scam. (reply to 53981)

&rey: By address prefix: take hash part. (reply to 53982)

&rey: How many bits, depends on network load. Try going for 6-7 first bits being unique for each wallet.

Thang: Or another example, I want to check the blacklist of sending/receiving addresses (reply to 53983)

Thang: I just want to understand the flow of the contract

&rey: Dynamic blacklist? Let admin send a message to every associated jetton wallet.

Thang: This means the wallet still needs to send a notification to the master and wait for a response, as I said above (reply to 53988)

&rey: Why? (reply to 53989)

&rey: If you sent message to jetton wallet that it is blacklisted, then it already knows that.

Thang: got it, admin noti for a specific wallet address. I have a request to handle swap fees, taxes is dynamic and it is configured in master. Can you give me an idea? (reply to 53991)

&rey: Set the fees once during compilation, to the highest value you may want (110%, probably?). (reply to 53992)

&rey: Jetton doesn't know if it's being sent for a swap.

Thang: swap router is also configured at master

&rey: Actually. Do you have a very special usecase so that users will accept all of that? (reply to 53992)

Thang: If from/to is router, fee will be charge about 5% total jetton_amount

&rey: You mean, stonfi and dedust? Do you know that it's totally possible to launch one's own DEX? (reply to 53995)

Thang: Most meme coins on EVM is handle this business

&rey: I'd disagree; defined by master address, yes. (reply to 53995)

czajek: Can anyone help me? Wallet support hasn't been responding for a month?

&rey: No one except @wallet support can help you if you have problems with @wallet. (reply to 54002)

&rey: We simply don't hold appropriate private keys to help.

Thang: I have handled this business by notifying back and forth between wallet and master. Just wanted to ask if there is a better way

czajek: but does anyone work there? how can you wait 1 month for a reply! (reply to 54003)

Роман: How to watch transaction success after sending it?

Thang: It is a basic business, absolutely not a scam

Thang: i'm a solidity dev move to TON and i want to understand how it works

&rey: Gimme a few minutes to ask validators to increase fees for your contracts specifically, that's also just a business 😂 (reply to 54008)

&rey: Here you are: https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers (reply to 54009)

&rey: In particular, take notice that second letter of TON stands for "Open".

Thang: I'm quite open to TON, but the answer I received was SCAM project. Very disappointing (reply to 54012)

Sunny: this worked but there's no function to fetch transaction hash (reply to 53876)

Sunny: did you find it? (reply to 54007)

Роман: No (reply to 54016)

Sunny: are you using sendTransfer? (reply to 54017)

Роман: I'm using wallet.methods.transfer().send() from tonweb and some analog from @ton/core (reply to 54018)

Sunny: can you share the blog or something for this? is this for jetton or ton? (reply to 54019)

Роман: const transfer = wallet.methods.transfer({       secretKey: keys.secretKey,       toAddress: toAddress,       amount: gasAmount,       seqno,       payload: payload     }) await transfer.send()  Doesn't matter, what transaction is it, i want to be able to find it programmatically after sending

Sunny: idk but this looks better way than what i have done.. can i get the full code of transfer? i am still new to Ton and making my way through (reply to 54021)

Sunny: also i think if you store await transfer.send() this in a variable then you should be able to get Transaction hash (reply to 54021)

Роман: No, i get  { '@type': 'ok', '@extra': '1713957584.3015652:9:0.3388514465283806' } Have no idea what extra means (reply to 54023)

Sunny: type : ok is also response for success but yea idk about extra either

Роман: It's about successful sending, i think

Sunny: yes but it's better to have a transaction hash rather than just 'ok' as a response

Nikolay Kovalkov: Hello I can help you write to me in person. (reply to 53677)

User<5416095935>: Guys, I know it's not the right place but, seriously there is no one to contact in terms of unjustfull ban appeals. All the methods are bots. Do you know anyone to contact from company?

&rey: @f_closer. (reply to 54032)

R: Are there any good web3 payment gateways that accept TON and have a wallet connection feature to Telegram Wallet & Tonkeeper? Could only find NOWpayments, but they don't have a wallet connection :( We're developing a custom solution but handling for Android,iOS and Desktop is proving to be a hole that keeps on getting deeper

Tân: Some body help me how to check token and quality in wallet, im using nodejs and typescript

kevin: tonapi.com provide a API can help you with that. (reply to 54036)

Sunny: can you help me in getting transaction hash of sendTransaction? (reply to 54037)

kevin: is it send -> wait -> get ok with you ? (reply to 54038)

Sunny: somewhat correct.. using npmton (reply to 54039)

Sunny: let transfer = await walletContract.createTransfer({       seqno: seqno,       secretKey: key.secretKey,       messages: [         internal({           to: "******",           value: "0.01",            body: "Hello",            bounce: false,         })       ]     });     console.log(transfer)      const txn = await walletContract.send(walletContract, transfer); console.log(txn)      // wait until confirmed     let currentSeqno = seqno;     while (currentSeqno == seqno) {       console.log("waiting for transaction to confirm...");       await sleep(1500);       currentSeqno = await walletContract.getSeqno();     }

Tân: Im using toncenter.com/api, Is there any way? (reply to 54037)

&rey: The loop in some cases may be infinite, if external gets lost or times out. (reply to 54041)

kevin: https://github.com/xssnick/tonutils-go/blob/db2bc987f06429b8e1de29bcba5636d7cba1be35/ton/wallet/wallet.go#L416 (reply to 54040)

Sunny: yes i kinda know this is not perfect solution but can't find any other way (reply to 54043)

Sunny: omg my eyes.. why there's so much space between the lines (reply to 54044)

&rey: You may retry sending the same transfer each 4s or so. If seqno changed, it really got sent. If there was a timeout, you need to process that separately. (reply to 54045)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offchain (reply to 54042)

Sunny: ah, but it's not possible to look into blockexplorer with just seqno, need some hash to store every txn in our server so we can verify it whenever is required (reply to 54047)

Sunny: i can only understand that it's sending multiple txns but not able to understand the code properly, could be better if it was in JS (reply to 54044)

kevin: waitConfirmation is what I trying to show you . (reply to 54051)

Sunny: ahh (reply to 54053)

Sunny: i see

William: Please help, how can i parse this amount from transaction.inMessage. I'm following this cookbook https://docs.ton.org/develop/dapps/cookbook#how-to-parse-transactions-of-an-account-transfers-jettons-nfts

&rey: Divide by 10**decimals. (reply to 54058)

&rey: Likely decimals = 9 so you need to divide by billion.

Vasily: Hi , we are looking for two progers (frontend and backend) wanting to get cool experience working in a team of experienced guys at The Open League Hackathon. Each will get a share of the project ownership tokens according to tokenomics, once the mvp is realized What we have now:  - Approved Hackathon application   - Pitchdeck  - Identified user need and solution   - 2 people in the team: Product Owner ex Aeroflot (i.e. me) and Researcher ex proger.  - Perspective idea at the intersection of Defi and Creator Economy, won a prize at TONidea  Objectives:  - Develop MVP and get the first users  -To receive a part of the prize fund and/or to get a grant.  Happy to happy to answer questions!

Eagle: Hey everyone we are looking for dev who is familiar with TON to help us with Token creation for our AI-powered language learning web3 game . Please dm me for more info

Yakitori: Hey, did you notice the spam on ton answers? (reply to 54060)

Yakitori: Try to do a search and a lot of spammy messages will appear

Yakitori: With scams etc

Alex: Hi guys! I am trying to send a transaction to my TON wallet-contract using TONConnect. Basically, I need to attach a plugin to my wallet-contract. Am I only able to send internal messages using payload in TONConnect's sendTransaction method or there is a way to add external message?

Crypto: Guys, Is anywhere open source NFT presale minter?

User<1502316510>: Any good TON developer here?

Boris: I am sending a simple (notification) msg with the mode: 1 (+2) and value: 0. And the msg gets aborted. Ok, found that sending 500k works. But what is the reason for the min value? The fees are covered by the mode: 1 as I thought?

Boris: (blueprint) is it probably a bug?

&rey: Try value: 1. (reply to 54094)

&rey: That's one nanoTON.

Boris: no, at least about 400k (reply to 54096)

Boris: Its maybe some specifics to the blueprint Treasury

Boris: In v4 standard there are no checks at all

Louis: hello @pcrafter , can you check for me why i can’t send jetton?

Louis: can i dm you?

&rey: Please try to describe your problem in chat. (reply to 54104)

&rey: After all, the goal is that so solutions are here.

Louis: this is my code

&rey: What fails?

Louis: I don't know what the cause is, everything seems right

Louis: 0QBgm4u_4XWD4ky5pGgbPH5fnHwuquta1p8pl-LBTEwvtNfn

&rey: I do. How much TON are you sending to jetton wallet? (reply to 54111)

Louis: this is my testnet wallet address

Louis: This is correct, right?

&rey: ^ (reply to 54113)

Louis: in this code i send 0.3 TON (reply to 54106)

Louis: or you mean the balance of this wallet? (reply to 54112)

&rey: Does jetton wallet spend zero or nonzero in gas fees? (reply to 54118)

&rey: That's irrelevant, at least now. (reply to 54119)

Louis: Oh, so I have to deposit TON into jetton wallet, right?

&rey: Not quite. (reply to 54122)

&rey: You have to send more TON.

&rey: If you want 0.3 to be forwarded, the safe amount to send to jw is 0.4.

&rey: Previous deposits do not count, I mean. (reply to 54124)

Louis: Ah I see, I'm leaving value and forward_ton_amount equal

Louis: I have sent the transaction successfully, thank you so much (reply to 54126)

TON Bounty Bridge: ​Making past TON contests accessible  🏷 Education  Summary:Create a frontend-only website with past TON contests, where a dev-to-be can write their solution an...  Created by ProgramCrafter

Fritz$Hive: Hi, guys anyone knows a way to recover Ton tokens send to contract address instead to send it to my wallet? I send it from Exchange

&rey: You cannot revert blockchain transaction. So if contract won't send TON to you then they are lost. (reply to 54137)

Fritz$Hive: I contacted the admins of the Project were I send the my ton and they say that I should consider it burnt. But the guys from Mexc tell me to ask for help here because normally should be some way to recover it. (reply to 54139)

&rey: The destination _contract_ is ultimately in charge.

&rey: Presumably destination project knew their code so they are right.

Fritz$Hive: Ok but normally it is possible no? I don't want to talk with them again if isn't any chance to do something (reply to 54141)

Fritz$Hive: Btw I talk with admins not the dev

Joshua💠: Hi please I sent usdt on the ton network since yesterday through my okx account and I haven't received it up till now  Pls what's the issue. I crossed checked both the network and the address and it matched but still haven't received my USDT

&rey: For most of contracts, returning money is impossible even for ones who have deployed contract. (reply to 54143)

&rey: That's kind of point of blockchain.

Fritz$Hive: Ok thanks and appreciate your answers

Orange: what's difference between jetton tx and ton tx ?  I can not find out

Nxrix: does supply amount change when people buy toncoin or it is fixed?

Rahul: Quiz - https://twitter.com/MaskaCrypto/status/1783205199177474365

&rey: One of the differences: jetton transfer has more than one transaction. (reply to 54152)

&rey: It does not change when people buy/sell (that said, this is transferring) TON. It does change with burning of the fees and issuance of validator rewards. (reply to 54154)

Orange: in receiver address ,I only get one. (reply to 54158)

&rey: Or zero, as it may happen if sender is greedy enough and sets forward amount to zero. (reply to 54160)

Nxrix: so it is currently growing slowly (reply to 54159)

Orange: I create a new address, and I receive jetton, and sol, I can not find difference those two tx.

&rey: You may see opcode "forward notification". (reply to 54160)

&rey: For other sends, opcode may be absent or arbitrary, since it is set by sender.

Orange: where? in msg_data ? (reply to 54164)

&rey: What data are you parsing? (reply to 54167)

&rey: Yeah, msg_data. Parse base64, parse BOC, load 32 bits and test what they are equal to.

Orange: it's really hard to find the diffence.... (reply to 54170)

&rey: I believe it is very simple to port one from docs.ton.org | TON Cookbook to TonWeb, if there is not one. (reply to 54171)

Orange: https: // github . com /toncenter/examples/blob/main/withdrawals-jettons.js (reply to 54171)

&rey: Just send it with some text as well. https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js (reply to 54177)

&rey: Are you very sure? (reply to 54179)

Orange: = =

&rey: No, that's still JS. Actually, JS is extremely hard to know, harder than Rust. (reply to 54182)

Orange: cell.beginParse is not a function sir..

&rey: Old TonWeb, maybe? (reply to 54186)

&rey: If so, probably you would be better off using other technology stack.

User<5972983507>: help me complete the authorization of the token in the tonkeeper wallet

Crypto 💀: Hi my transaction keeps reverting (reply to 54187)

Crypto 💀: Which wallet can I use ? (reply to 54187)

Crypto 💀: Aside from Ton wallet

Frank: TON noob here. Trying to understand ton SCs. What's the difference in TON parlance between "message" and "transaction"? Are they synonyms?

Heydar: sorry guys , a noob question: can someone tell me what's first argument in try {} catch(firstArg,secArg){} ?

Heydar: a message is a raw data that want to be a transactions, sometimes it dont be a transactions.  so the message is a request.  It's my opninion idea, and Im beginner too. (reply to 54206)

Frank: Thanks🙏 From what i see so far messages sent from SC to SC can fail in separate blocks and the only compensating mechanisms are programmed failure mitigations (bounce handlers) . i guess there is no message pattern conversation level atomic rollback? (reply to 54208)

Heydar: if I understood you question, my answer is that the messages are transferring in async mode. assume like web requests and answers (like rest APIs) (reply to 54210)

Heydar: so the result should be proceed in the destination smart contract.

Heydar: and it decide to roll back or not.

Артур: Hi guys! I don't receive a transaction push notification (tonkeeper testnet) after running npx blueprint run Has anybody else experienced this?

Heydar: if I didnt understand your question clearly, I need more information.

Heydar: are you sure it's on correct net? (main net , test net)? (reply to 54214)

Артур: yes (reply to 54216)

Frank: Ah yes of course, the state must be compensated for...because a message and smart contract state can be committed in a block , even when the whole conversation is not yet finished. I suppose no other mechanism than explicit compensation code is possible. (reply to 54213)

Heydar: yeap, as the main idea is only messages , so inside the code and the states can decide what should do with messages. (reply to 54218)

Emily: Are there any ton meet ups in Dubai this week?

Emily: I am in investor attending token 2049 and would like to learn more about the ton ecosystem

Tobias: Hello

Tobias: I used the ton nft standard and I have some questions   Does it allow public minting?

Tobias: Because so far, seems only Owner can mint

Darkening Dawn: Hey guys! Does someone have a solution for onchain jetton metadata storing?

fade: Sometimes my swaps failed and it doesn't even got on chain, it only happens sometimes, my seqno and gas are correctly configured, anyone got the same problem?

Артур: upd: I deleted temp folder, retried scanning QR code (it failed again), cancelled the process (ctrl + c) and started it again - and finally received the transaction confirmation notification (reply to 54214)

User<6952362368>: Could be that you have little gas (reply to 54203)

Crypto 💀: Ok (reply to 54230)

— 2024-04-25 —

User<6332241006>: Hello, can anyone help me?

Treasure 🐈‍⬛: My withdraw on ton space keeps entering someone else's address

Mikey: Do you know any merkle tree implementation in TON?

Zoey: Hello everyone,  My name is Zoey from Wolffun Games, the team behind the popular mobile game Thetan Arena.  We're very interested in the TON Games Platform and would like to discuss building and onboarding potential projects.  We have some technical questions and would appreciate being connected with the appropriate contact on the TON Games Team. Since we've already submitted the TGA registration form, we're eager to start a more detailed conversation but dont know who and where to start. I really appreciated your help.   Thank you so much & wish you guys have a good day.  Best regards, Zoey

Eric: Anyone knows why I am getting TVM cell underflow error? And it just keep sending the same wrong tx? address  UQAwX8K0nwceqS7PIXZJdUBvvvPXvAz7Dv34fxBeokvL0nPR

KaKui: Which wallets support operating assets from high-load accounts? Do the assets of high-load accounts have to be operated through scripts or by implementing their own clients?

Speculator: How to get decimals of any jetton?

Louis: I transferred the token to the stake contract but there is an error from C to D, where should I fix it?

Speculator: How to get decimals of any jetton?

&rey: There is an application github.com/Gusarich/airdrop. (reply to 54257)

&rey: One addr is UQ and another is EQ? Those are same. (reply to 54248)

&rey: Yes. If many people want to send externals, some may be lost. (reply to 54228)

&rey: Onchain internal messages, obviously, don't get lost.

Sergiu Popov: Durov cannot sleep because WeChat miniAPPs generate 400 billion USD/year revenue.  This is why he introduced his miniAPPs and USDT payments, to go in retail.  I and my team we completely share his views and we are building P2P task sendable by message with USDT locked inside.  https://dorahacks.io/buidl/11424  We are looking for a coder team mate. We learn together and moving very fast.  This is the proof of concept: https://telegra.ph/Video-demonstration-of-mechanics-of-P2Ptasks-04-22   Come along and get the biggest piece of this new coming hyping pie.

Vito: Hi all, can I test tron usdt transactions on ton and is there a faucet?

cypherpunksO1: Good afternoon. How do I upload image details, title, description, etc. to the NFT contract on tact?

wikig: Hello guys , is there any game developer in this groupchat ?

fade: Thanks for the info, I'm using my own node, does that still happen? (reply to 54270)

&rey: Even more likely, unfortunately.

fade: Oh.. was this mentioned anywhere in the docs? (reply to 54284)

Louis: hello @pcrafter, can you continue to help me? (reply to 54130)

Louis: I transferred the token to the stake contract but there is an error from C to D, where should I fix it?

fade: you could check the exitcode and read its contract code to see where it failed (reply to 54288)

Louis: I don't see a description of error 130 anywhere :< https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 54289)

Louis: when i run this, receiver(msg:TokenNotification) still work

princekamil: Hello, I’m looking for a graphic designer&artist to prepare NFT collection 💎 contact priv

appenines: Hello i bridged on dedust

Naved: hello guys, i am having issue deploying contract using this repo  https://github.com/howardpen9/nft-template-in-tact

Naved: earlier i have deployed nft contract using this

Naved: but it is giving error now

Naved: do you guys have any idea about this

Heydar: and again Im confused ... await blockchain.treasury('deployer');  so what doing these lines(what's the difference between sendDeploy and openContract: x = blockchain.openContract() x.sendDeploy()  ?  which one should send the default state? (the data that will be saved and used as get_data.)

princekamil: Hello I’m looking for a graphic designer&artist for a long therm coop on NFT projects, telegram templates, stickers, logos! 💎 contact me priv and attache your portfolio 💼

User<6821103918>: Alright send a DM sir, I've got someone. (reply to 54309)

Ton: hello, anyone can help me that why I am deploying is wrong?

Baldwin: how to listener event from contract emiting?

Ton: I just use this function

Ton: @pcrafter

Ton: I solved

princekamil: Hello I’m looking for a graphic designer&artist for a long therm coop on NFT projects, telegram templates, stickers, logos! 💎 contact me priv and attache your portfolio 💼

Heydar: how create empty Dictionary<bigint, Cell>;  because I want to save a dict for this type: x~udict_set_ref(256, cID, newOne);

Heydar: anything that I do in js , I will facing exit code 9 in func. (reply to 54319)

Blockchain Dev: I'm quite excited about the TON network.

Blockchain Dev: Is there anyone who is good at marketing?

Blockchain Dev: We can do something.

Blockchain Dev: I hate Solana. That's enough!!! Skip the Book of memes, head to the TON network...

&rey: Before interaction in DM, and actually any agreements, please consider past messages of the person.

Matthew: The way to handle ton logic is too difficult, it will make dapp development time consuming

Matthew: I'm having a hard time implementing the logic for nft to merge to level up, for evm it only takes 1 day to complete.

Matthew: 😔

Heydar: a question. (reply to 54330)

Eric: for those who want to know, it's because wallet V3 and V4R2 has different message structure. (reply to 54262)

Heydar: I know you hate me cause of so many questions xD , can I ask how you debug your bugs in func?  for example  I wanted to see what's going on in the func and where is the problem (because exit code is not anough, I need the line code problem) so I started so many times build the contract and test and just moving my line: throw(7777);  to find where it throw my code instead the exit code I faced. it's so bad idea , but it helped me, what should I do? (reply to 54330)

Isaac: Please l need help when I am trying to access my account they say user does not exist

&rey: ~dump(some_var); (reply to 54339)

Heydar: 🤨🤨 life saver thanks❤️ (reply to 54342)

Heydar: but it does not compile. for example:      int flags = cs~load_uint(4);     dump(flag); (reply to 54342)

&rey: Tilda before dump. (reply to 54348)

Matthew: does it work on testnet? (reply to 54348)

Heydar: flag~dump();? (reply to 54349)

&rey: On local emulation. (reply to 54350)

Heydar: Im testing on jest. (reply to 54350)

Jake: Hey, I'm trying to switch the tonkeeper app to testnet, but can't find it in the dev settings

Haq: mobile or desktop?

Woooo: Mobile

Haq: you need to tap 5 time tonkeeper icon

Isaac: No one is minding me why (reply to 54341)

Haq: if it is iphone then close/kill the app reopen and add new wallet

Haq: there will be option to add testnet wallet

Isaac: I have people under me will they come under me again if l reopen

Heydar: when we use dump in func, it will compiled in bytecodes too when deploying? (for preventing more payments) I mean that shall we delete the lines(dump) before deploy on mainnet? (reply to 54352)

Isaac: My phone is not iPhone (reply to 54364)

Haq: follow the steps

Isaac: Please what steps (reply to 54372)

Haq: I don't know what you are asking exactly, I was answering to the guys which asked about how to find testnet / testnet wallet in tonkeeper.

sd: Hi all! Can someone please tell me a suitable PHP library for working with the Ton public node?

Dung LQ: Can someone help me explain why the values "gas_fee" and "fwd_fee" are equal to 0? What should I do to get the values of these two fields? Thanks

Nerses: Hi everyone ! how can I emit long message in TACT that size of Cell isnt enought for it ?

Danny: Hello guys, is there a standard for generating opcodes in func contracts?

Fifteen: Hello guys! Can someone give an advice on identity model if I want to combine TMA and TON Connect? I understand that TON wallets have their own addresses, but I also want to make personalized experience for Telegram side. Are there any good practices?

Hawkeye: Hello Guys, nice to be here

Hawkeye: Guys, what can we do if tonkeeper falsely flagged our project as scam?? They just changed our ticker 🤦‍♂ We try to reach their support but now one cares or answers. They fucked our project, but we dont give up, we are resistance. I mean how can a wallet provider have the power to screw projects like that. Where is decentralication? 🙈 Can anybody advise?

&rey: Store tail in reference. (reply to 54379)

&rey: Decentralization also means that you have no fiat power over other apps, including wallets. (reply to 54385)

Nerses: please can you provide any docs. couldnt find that function (reply to 54388)

Heydar: guys do you have any link that show me creating complete message in js? I mean I want to do something like this, but in js:   var msg = begin_cell()     .store_uint(0, 1) ;; tag     .store_uint(1, 1) ;; ihr_disabled     .store_uint(1, 1) ;; allow bounces     .store_uint(0, 1) ;; not bounced itself     .store_slice(source)     .store_slice(destination)     ;; serialize CurrencyCollection (see below)     .store_coins(amount)     .store_dict(extra_currencies)     .store_coins(0) ;; ihr_fee     .store_coins(fwd_value) ;; fwd_fee      .store_uint(cur_lt(), 64) ;; lt of transaction     .store_uint(now(), 32) ;; unixtime of transaction     .store_uint(0,  1) ;; no init-field flag (Maybe)     .store_uint(0,  1) ;; inplace message body flag (Either)     .store_slice(msg_body)   .end_cell();

&rey: But please wait for their update, they will stop changing tickers and mark your project a scam in another way; then you'll be able to appeal. (reply to 54385)

&rey: storeStringTail in StringBuilder. (reply to 54390)

&rey: Yes. CRC32 of TL-B without brackets and said opcode number. (reply to 54380)

S.: Hello! Please tell me where you can buy a separate litenode for rent, it’s need for the script to work.  The @liteserver_bot bot is not working

Nerses: Got it thanks. what about case where message is struct and it has different types something like this     struct TonTransferInitiated {        __hashlock: Int as int256;        __amount: Int as coins;        __chainId: Int as int256;        __timelock: Int as int256;        __sender: Address;        __receiver: Address;        __targetCurrencyReceiverAddress: String;      } (reply to 54393)

wikig: Well , hello , i try print the tonConnectUI.connected and use to consider make new connection and not . But it's quit wired . (reply to 53586)

wikig: Here's the logic code . (reply to 54398)

wikig: You can see , i will force to disconnect and reconnect the wallet if the connection exsit .   Still , when the tonConnectUI.connected shows false , i try openModal() , it saids it already connected ....   That's wired and keep troble us . (reply to 54399)

K.: Why do you need to do this exactly? Do you want the user to reconnect the wallet each time they reload the page? (reply to 54400)

wikig: Well , it's something like a force reconnect function .   To make the wallet connect status reset . (reply to 54401)

K.: I am not sure if that is a common practice really.

K.: But from the error it seems that it obviously doesn’t disconnect the wallet. And judging by the output above it might be because you actually don’t call the disconnect function. E.g.: tonConnectUI.connected returns false. (reply to 54398)

wikig: Well ... the problem is , i can't get the status of the user connection .   When i try get the account informations , it saids it's not been connected ....

wikig: Yes, but when it call the tonConnectUI.openModal() to try connect user's wallet ....  It saids it is connected . Wired . (reply to 54404)

K.: I mean here, in the first function. If connected is false then it won’t disconnect. Try without the if checks if you really want to force a disconnect. (reply to 54399)

K.: I am not sure if calling disconnect breaks the app if the wallet is not connected, but I don’t think it should.

wikig: Well .. the problem is .... if i do so , it will throw out the error to warning me not to disconnect it because it's not been connected (reply to 54407)

wikig: The tonconnectUI.modalstate shows {status: 'closed', closeReason: null} , which i think , yes , not been connected .... (reply to 54409)

wikig: the tonConnectUI.connected also shows false . (reply to 54411)

Vu Viet Khoa: Tontradingbot

Vu Viet Khoa: Are you?

wikig: Still , if i try tonConnectUI.openModal() ..... It said it already connected (reply to 54398)

wikig: Really confuse ....

K.: yeah, perhaps you are not intended to call disconnect and connect in the same context. What framework are you using btw? (reply to 54416)

K.: for instance with React you may have issues that may seems like TON related but turn out to be React’s specifics 🤷🏻‍♂️

Vu Viet Khoa: Do you know tontradingbot? Please tell me

wikig: Vanilla js by importing via https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js  .... (reply to 54417)

wikig: During the origin logic . i wants to check the connection status ,and get the wallet if it connected , reconnect if it disconnected . (reply to 54417)

Hawkeye: Hmm you mean wait for their update to my bug report? (reply to 54392)

wikig: But i didn't see the feature of the connection status .....  Which makes me do a forece disconnect and reconnect to get user's address each time . (reply to 54421)

K.: So tonconnectUI.connected doesn’t work by itself? (reply to 54421)

K.: I am sure there must be a better way than this… (reply to 54423)

wikig: Still , it will throw out the error when i try disconnect if it not been connected ....  I can ignore the error anyway ....  But i don't think it's a good way to reconnect every time ... (reply to 54423)

wikig: I don't know, may be . may be i can try get the account information and force reconnect when it catche error during this process .  It can be a solution lol . (reply to 54425)

wikig: Well .... another reason it require user to reconnect everytime ... is that i can't find the function to get account informations like address in tonconnectUI .....  I have to get the information eachtime it connect which emit the tonConnectUI.onStatusChange . (reply to 54428)

Haq: Guys do you have a good guide on how to start with the telegram dev group where you have to create your own rules / connect TON wallets / check if a user has NFT / validations ??

Jake: I think it is updated... i just had to import it with passkey (reply to 54362)

Jake: But I'm working in the nujan ide with the jetton tact contract. I was able to build the contract.tact, But the SimpleJetton requires a cell to deploy. Not sure 100% how to input the cell data

Naved: Hello can anyone share the doc or something which explains calling contract function from deployment script

Naved: like this       await wallet_contract.sendTransfer({         seqno,         secretKey,         messages: [             internal({                 to: deployContract,                 value: deployAmount,                 init: { code: init.code, data: init.data },                 bounce: true,                 body: packed,             }),         ],     });

Nerses: Is here anyone who can help to fix a little bug ? i have written smart contract it builds succefully but while verifying it I get exit code 9 (Cell underflow. Read from slice primitive tried to read more bits or references than there are). Thanks beforehand

Jeremy: Can the front-end directly call this type of message, or can it only call contract methods?

princekamil: Hello I’m looking for a graphic designer&artist for a long therm coop on NFT projects, telegram templates, stickers, logos! 💎 contact me priv and attache your portfolio 💼

Jr: Hello. I am searching the document about ton, but it is very hard. I want to create a mnemonic or private key and then create a wallet. How can I do that? If you have any document, please share it to me. Thank bro.

User<6821103918>: Not good at marketing but great at community management. (reply to 54327)

User<6821103918>: I thought I replied you sir? (reply to 54318)

Shahboz: Is there a wallet created on the Ton blockchain that distributes tokens to different wallets at the same time

Shahboz: Or an application with such a function (reply to 54463)

Sumit: Why do a transaction have three hashes when it redirects to only a single one on explorer?

&rey: Yes, there is. How many users do you have? (reply to 54463)

Rishabh: how can I get ton txn hash?

Heydar: can somone help me please? (reply to 54391)

&rey: Then do the same in JS? (reply to 54391)

Heydar: I want create same message in js, and send after deploy. (reply to 54479)

&rey: What SDK are you using? (reply to 54481)

&rey: Never mind. Just consult its docs for building cells.

Heydar: '@ton/sandbox'; '@ton/core'; (reply to 54482)

&rey: beginCell and storeUint may help you (reply to 54485)

Heydar: I saw that, but I really dont understand in some examples people just taking one time load_coins,  in some of them two time and I dont know how they distinguish ...  😩 (reply to 54484)

Heydar: I tried 100 times, but Im facing errors, so I want to make full message like that I wrote above. (reply to 54486)

User<7121766667>: I need help.

User<7121766667>: I'm trying to implement swap.

&rey: People usually create message payload only. (reply to 54488)

&rey: Why would you need the whole message? Ah, for wallet wrapper or like, right?

&rey: Have docs.ton.org been unhelpful to you? (reply to 54494)

&rey: If so, please say where docs need to be improved.

Heydar: Im learning all things and Im in learning stage but ok your right I should be able to do anything with docs, but it was hard for me, can I make my problem to smaller one? #question when we have two load_coins in func, how fill a message for that goal? in js. (reply to 54496)

Heydar: actually I filled out the survey for the docs too :D (reply to 54497)

&rey: .storeCoins twice! (reply to 54499)

Orange: how to calculate txhash when I signed a transaction ?

Heydar: ok , may I wrote something wrong, tried that 100 times 😩 let me double check again , and I will back later. sorry. thanks. (reply to 54501)

&rey: Have you followed stores order? Fields are encoded to bits, so you can't reorder them. (reply to 54503)

Heydar: ahh  , Im not sure I should see again , and double check with docs too. I will check it , thanks  ❤️ (reply to 54504)

princekamil: Yes, you took money and didn’t give me projects (reply to 54460)

princekamil: Hello I’m looking for a graphic designer&artist for a long therm coop on NFT projects, telegram templates, stickers, logos! 💎 contact me priv and attache your portfolio 💼

Sumit: const hash = await connector.sendTransaction({             messages: [               {                 address: args.to.toString(),                 amount: args.value.toString(),                 payload: args.body?.toBoc().toString("base64"),               },             ],             validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve           });           const hm = Cell.fromBase64(hash.boc).hash(0).toString("hex")           console.log(hm)  the tx hash that i get from this much different from what i get in explorer

Sumit: how can i get the one in explorer?

User<6670085319>: Who needs a senior frontend and smart contract engineer?

Shahboz: 1000 wallet addresses, they all need to be thrown differently (reply to 54468)

peilipu: for go like this txHash := base64.StdEncoding.EncodeToString(tx.Hash) (reply to 54511)

User<6821103918>: Me? Are you sure you're talking to the right guy? Have we met before?   Please send proof that we've met before. (reply to 54507)

peilipu: i think there is a func in js

User<6821103918>: Before your go around accusing people. (reply to 54515)

Sumit: its is present in explorer in hex as well (reply to 54514)

Adarsh: Looking for a TON developer to join our team. Kindly dm.

Vadim: Hi 👋

Vadim: Can anybody help me? if i create Jetton by this contructor (minter ton org), can user burn his tokens?

&rey: Yes. There is builtin true-burn functionality. (reply to 54524)

&rey: How to invoke it: https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/contracts/jetton-wallet.fc#L240; op::burn is 0x595f07bc.

Sumit: @pcrafter i am kinda stuck, ton forums not working, cant find anything anywhere. (reply to 54510)

AmirSalar: Hi guys! How can contribute in ton projects. I'm C++ developer and I want to join to this community.

Sunny: Hey can anyone please help me with this? Bot works fine in localserver but deploying to server giving this error     /node_modules/node-fetch/lib/index.js:1501     reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));            ^  FetchError: request to https://api.telegram.org/bot123123:[REDACTED]/setMyCommands failed, reason:      at ClientRequest.<anonymous> (/node_modules/node-fetch/lib/index.js:1501:11)      at ClientRequest.emit (node:events:518:28)      at TLSSocket.socketErrorListener (node:_http_client:495:9)      at TLSSocket.emit (node:events:518:28)      at emitErrorNT (node:internal/streams/destroy:169:8)      at emitErrorCloseNT (node:internal/streams/destroy:128:3)      at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {    type: 'system',    errno: 'ETIMEDOUT',    code: 'ETIMEDOUT'  }

Shahboz: Is there a ton blockchain powered site like OneClickSender (reply to 54527)

Sadegh: Hi, I have a noob question, I want to activate a wallet programmatically (using javascript) and deploy wallet-v4 contract on it,  I tried different ways but it's new for me, I keep getting External message was not accepted error message.  Can anyone help me with this?

Heydar: something that confusing me , is that when we should store flags in message body! , and when not , or another fields! because in recv_internal in some codes I see they read , sometimes they dont read, so how it's possible, I think about messages are an array of bits, and when you parsing it for something like uint , so next iteration is next index in that array , how it's possible sometimes we do that , and sometimes we dont do that.  100 times read that page, and could not understand what's going on in some complicated codes(examples, like multisig, stable coin , ...) (reply to 54504)

&rey: Perhaps I could help if you said what is its functionality. (reply to 54533)

Heydar: see this code:          (slice manager_address, slice memorized_address) = load_data();         var msg = begin_cell()             .store_uint(0x10, 6)             .store_slice(sender_address)             .store_grams(0)             .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)             .store_uint(3, 32)             .store_uint(query_id, 64)             .store_slice(manager_address)             .store_slice(memorized_address)         .end_cell();         send_raw_message(msg, 64);   while in js , it just checking few  fields ... it's confusing me too ...          expect(result.transactions).toHaveTransaction({             from: addressSaver.address,             to: user.address,             body: beginCell()                 .storeUint(3, 32)                 .storeUint(12345n, 64)                 .storeAddress(deployer.address)                 .storeAddress(address)                 .endCell(),         });

Heydar: so what should i fill,  what should I dont touch ! or etc ...

Shahboz: Multisend (reply to 54540)

&rey: Can you split FunC part in message header and body? (reply to 54541)

Heydar: nope actuallyy, how I can do that? (reply to 54544)

Heydar: do you mean that I should just split them in my mind and check the body and header in seprate paradigms? (reply to 54544)

Heydar: which fields are headers? how I find them?

&rey: Up to that large sum that should be 107 or 108. (reply to 54547)

Heydar: do we have any doc for that , to learn it completely? (reply to 54548)

Orange: how to load forwardPayload in jetton transfer ?

lafi: Pls Where is the TON GitHub  open source page

Boris: gh/ton-org (reply to 54556)

lafi: Thanks

Boris: and here https://github.com/orgs/ton-blockchain (reply to 54558)

Boris: and here https://github.com/ton-community 😅️️️️

Orange: any answer ? (reply to 54554)

I'm: Hi bro, in testnet,  I can create a private key mnemonic publicKey and send some Ton to wallet. But my wallet is inactive, so I cannot send Ton to other address. Do you know how to active Ton wallet? I use JavaScript . Thank bro

I'm: Hi bro, I have the same issue. Let me know if you can active Ton wallet. Thank bro (reply to 54536)

Sadegh: I found you can deploy empty contract using @ton/blueprint source code to activate a wallet but I think it’s not a good solution! (reply to 54564)

Orange: how to load tx details like tonviewer?

Nikolay: Hello everyone, my team made an MVP, we want to connect it with the TON ecosystem.  Who knows, maybe there are developerov communities or some qualifying stages for projects?

User<6821103918>: Mind throwing more light on what you mean? (reply to 54570)

Nikolay: I can present pitch deck who will help, promote the project to people from the ton team.   I don’t think it will take much time and will be tempting, especially if the offer is interesting.

User<6821103918>: Oh okay. (reply to 54572)

Heydar: the header is that red rectangle always?

Амир: How can I pass my variable that stores an address in TS in the get method of smart contract slice get_wallet_address(slice owner_address) method_id {  async getWalletAddress(provider: ContractProvider, target_address: Address) {         const { stack } = await provider.get('get_wallet_address', []);          return stack.readAddress();     }

Heydar: why you want process in func? just get whole things you want , and then correspond your input(address) process in typescript. (reply to 54579)

Амир: I am writing wrapper.ts for test/interaction purposes. I think it is important to at least test how my func function works (reply to 54580)

Амир: Question is how to pass Address variable or Slice with that address to ts function

Crzy: Hi, I have much experience in blockchain & full stack technologies.  please contact me if you need my skills for your project.

Heydar: you can't pass any parameter in method_id methods. (reply to 54582)

Амир: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc#L114  Are you sure? (reply to 54589)

Heydar: no 🙏🏽🙏🏽 (reply to 54590)

Амир: I already found how to pass args, here it is import { TupleBuilder } from '@ton/core';  async getWalletAddress(provider: ContractProvider, target_address: Address) {         const tuple_builder = new TupleBuilder();         tuple_builder.writeAddress(target_address);         const { stack } = await provider.get('get_wallet_address', tuple_builder.build());          return stack.readAddress();     } (reply to 54591)

Heydar: me 2 :D https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/wrappers/JettonMinter.ts#L135 check these lines too. (reply to 54593)

Амир: omagad (reply to 54594)

Амир: ty (reply to 54594)

Sadegh: Hi, I have a noob question, I want to activate a wallet programmatically (using javascript) and deploy wallet-v4 contract on it,  I tried different ways but it's new for me, I keep getting External message was not accepted error message.  Can anyone help me with this?

Амир: Activate? Do u mean deploy? (reply to 54599)

Sadegh: Sorry yes, I want to deploy wallet v4 for my wallet using javascript (reply to 54600)

Heydar: I found  a contract code that checking hyper cube route       int flags = cs~load_uint(4);     if (flags & 1) {         return ();     } while in documents they wrote that bit is always true for now. so the contract is making wrong things? or?

User<7121766667>: Hello.

User<7121766667>: I want to swap on stonfi.

User<7121766667>: Anybody has experience in that, please help me.

Амир: For what purposes u want to deploy it? Like if it is test.ts, there is await blockchain.treasury('some_seed_phrase'); (reply to 54602)

researcher: to activate it, you should send any amount from your wallet.  to top up you contract (or deploy), you need to send tons with bounceable=0 flag (reply to 54602)

Heydar: and also the amount of money should be the rent fee calculated from the latest transaction that was active to now. is that right? (reply to 54611)

Heydar: someone know what's going on there? (reply to 54604)

Sadegh: I have too many small TON wallets which users deposit TON to their wallets and this way we found which user deposited, after that we need to move these money to our main wallet so I need to deploy wallet contact to each of them to be abale withdraw from them. (reply to 54610)

Heydar: oh god, the treasury argument is the 12 words phrases :D? (reply to 54610)

Амир: No, it is random string (reply to 54615)

Амир: So use import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'; (reply to 54614)

Sadegh: Sorry i'm a little new to TON, is there any document or code I can use? (reply to 54617)

Амир: I can share my first FunC project with u :) (reply to 54619)

Амир: Also I suggest you to take this course https://stepik.org/course/176754/syllabus

Sadegh: Thank you so much 🙏🏻 (reply to 54621)

Heydar: in contracts how detect that the internal messages are deploy message?

Heydar: totally shall we check that? for all contracts? because I want to doing nothing if it's deploy message

Sadegh: Now I did deploy wallet v4 contract successfully but when I try to withdraw wallet balance I got this error, can you help me with that? (reply to 54621)

Sadegh: This the error I got when i try to withdraw the balance.

Амир: I have never worked with external messages till now ( (reply to 54627)

Амир: But u can send link to transaction, maybe more professional developer will explain you what is going wrong

Mau: I am looking for a good developer who can help me create 2 scripts for Toncoin using the APIs   Only message me if you have experience and can deliver quality!

Behrang: This is not related to IHR. It just checks the bounced flag. If this message is a bounced one, it does nothing. (reply to 54604)

Heydar: but it checking second bit, and in message layout second bit is ihr_disabled. (reply to 54635)

Behrang: No, don't check for that. Use a special opcode for deploy and then do nothing. (reply to 54626)

Behrang: No, it loads the first 4 bits and then checks if the last one (forth bit) is 1 or not. (reply to 54636)

Heydar: I used:          const deployResult = await myCont.sendDeploy(             deployer.getSender(),             toNano('100.0')         ); which:      async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {         await provider.internal(via, {             value,             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: beginCell().endCell(),         });     }  but because I used dump in func contract, I see that it is executing recv_internal and failed ...

Heydar: oh do you mean , if it wanted load second bit , it should write: ;; first_bit = load_uint(1); second_bit = load_uint(2);  so manyyyyyyyyyyyyyy thanks ❤️❤️❤️❤️ (reply to 54638)

Behrang: Send your recv_internal code. (reply to 54639)

Mau: I am looking for a good developer who can help me create 2 scripts for Toncoin using the APIs   Only message me if you have experience and can deliver quality!

Behrang: No. Usually you don't need to check second bit, but if you wanted to anyway,  you could and it with 4:  flag & 4 (reply to 54641)

Heydar: I minimalize that to fast reading:      slice cs = in_msg_full.begin_parse();      int flags = cs~load_uint(4);     if (flags & 1) {         return ();     }      slice sender_address = cs~load_msg_addr();      if(equal_slice_bits(sender_address, owner_address)) {          int op = in_msg_body~load_uint(32);         ;; it exit code 9 after this line.     } ... (reply to 54642)

Heydar: second bit is in index 1 so it should be anded with 2 , why 4? (reply to 54645)

Behrang: That's because the body is empty, and you tried to load 32 bits of it. (reply to 54646)

Heydar: so in contracts we should consider deploy messages too? (reply to 54648)

Behrang: You may consider an empty body. (reply to 54649)

Heydar: it's done in every contract for deploy messages? (reply to 54650)

Heydar: or it's a guide for my code?

Sadegh: Hi again, this code works for me, maybe useful for you too.  async deployWalletV4(         sourceWallet: Wallet,     ) {         const client = this.getClient()          const wallet = WalletContractV4.create({             publicKey: Buffer.from(sourceWallet.publicKey.replace('0x', ''), 'hex'),             workchain: 0         });          const walletContract = client.open(wallet);          const provider = client.provider(wallet.address, {code: new Cell(), data: new Cell()})         const secretKey = Buffer.from(sourceWallet.privateKey.replace('0x', ''), 'hex')          const sender = walletContract.sender(secretKey)         const body = beginCell().endCell()          await provider.internal(sender, {             value: toNano("0.0001"),             sendMode: SendMode.PAY_GAS_SEPARATELY,             body,         });     } (reply to 54564)

Heydar:         if (in_msg_body.slice_bits() == 0) {             return (); ;; empty message - just accept TONs from owner         }  I added that before, and it was ok, but I thought my pattern is wrong and for deploy message users doing another way ... (reply to 54650)

Nikita: what does it mean to track complex transaction on chain (reply to 37009)

Behrang: You've used empty body for your deploy message so you have to check for that. (reply to 54651)

Nikita: like keep the output of program in block?

Nikita: solana tracks those too from my understanding  trying to get mental model of ton, coming from sol

Behrang: This depends on your smart contract. You can have whatever deploy message you like. (reply to 54654)

در انتهای صبر، طلا می نشیند.: https://t.me/solanascanner

Heydar: your right thanks. it's clear for me now ❤️ so how about the flag comparing? I thought the index 1 is second bit and we should and it with 2 to check it. (reply to 54660)

Behrang: Try to convert these numbers to binary and then read my messages about flag again:  1 2 4 8 (reply to 54662)

Heydar: ah , your right. I really confused today about anything I knew before 😐 do we have bit shift in func? (reply to 54663)

Heydar: Thanks sir, completely got what's going on in my bugs ... thanks ❤️ (reply to 54663)

— 2024-04-26 —

Solitary Developers: How can we calculate the amount of money sent to a certain address? Like all purchase invoices, sent to 1 address.

User<7121766667>: Hello, seniors. I'm trying to develop swap function on my typescript express backend by using stonfi dex. Anybody has experience in that, please help me.

Oscar: Any ideas? (reply to 53816)

&rey: You can. And this is the most common way to activate: send TON out. (reply to 54563)

&rey: Do you have a couple free cells to store jetton master's code and data? (reply to 54680)

&rey: Aggregators like TONAlytica. (reply to 54670)

&rey: No; everything above msg_body. (reply to 54578)

&rey: Please consult TON Cookbook in docs.ton.org for exact example. (reply to 54686)

&rey: Seems like you're missing secret key somewhere? (reply to 54599)

User<6921984188>: Hello 👋  greetings.  Please is there any TON other group or channel apart from DEV chat where they address normal issues and not coding stuff lol. Thank you

&rey: There is. https://t.me/toncoin_chat (reply to 54694)

&rey: Thanks for not raising that stuff in place where developer issues are discussed 😉🙏

I'm: oh good, yesterday I lost all day for fix this. I try your code and it work.  Many thank to bro. (reply to 54653)

I'm: Hi, Iam a beginner, I just know to active the wallet via Tonkeeper app not by the code. I've fixed it. thank bro (reply to 54681)

web3: Hello here can somebody have a source code of Tap to earn game ? I want to edit and deploy it

Nyxra: I am using TonTools and TonCenterClient, what's the fee amount I should set to transfer jetton?

Nyxra: Guys is there a platform where I can get test jetton faucet?

Hustle: Its literally the copy of minter repo kek (reply to 46026)

lurenbian: Hi, we are trying to deploy our little game at Telegram mini app.  as we designing the login, found that the interaction between Cocos and the wallet SDK is not very good.  Is there any middleware that can be used? Or are there other mature solutions?

perfogic: hello devs here

perfogic: can we use tvm solidity to deploy on Ton ?

perfogic: like this from everscale: https://github.com/everx-labs/TVM-Solidity-Compiler

perfogic: @awesome_doge @pcrafter can you guuys help me

Baldwin: how to read Cell type by javascript?

&rey: Connect to other liteserver. (reply to 54722)

P M: It a a scam or not ?

Heydar: guys to getting current balance in ts  , we should have getter method for that in func too? or how to take balance of my contract in ts?

Heydar: I know with this method we can take balance . but I just deployed a contract, and just want to know it's balance. how do that? shall i create getter method in func? (reply to 54731)

Ton: hello, can anyone help me that what nft_item_code represent and how can I link the offchain infomation of nft collections to this contract,by the content cell?

Behrang: No, just read the state of your contract. Example:  https://github.com/HipoFinance/contract/blob/ac2cd097f95ded492111c4f2ca8c30b27b10b3fb/wrappers/Wallet.ts#L259 (reply to 54731)

Heydar: Thanks a lot. I need review more codes to learn these concepts ... (reply to 54735)

lafi: Will I be able to build smart contract with just JAVASCRIPT AND SOLIDITY ????🥲

wikig: Yes, for EVM chain lol .  Now TON chain not support it yet (reply to 54740)

perfogic: from the code like you can build with typescript

Matthew: Hello Vietnamese devs, please join the FunC Vietnam group to discuss together 🫡 https://t.me/+T1BFp_mH7IhhZWE1

perfogic: and use compile library

Witter: docs website can not access any more

Witter: docs ton tg

Witter: what happened?

&rey: Please use official Tether site, tether.to. (reply to 54725)

&rey: It's not an official domain. Real is docs.ton.org. (reply to 54750)

PM: Help me. I've developed test dapp. It works well with tonkeeper extension in desktop environment but not with mobile tonkeeper app. All of transactions are automatically rejected. What shall I do? Error message is "App tries to send rpc request to the injected wallet while not connected.Unknown app"

Witter: thanks (reply to 54755)

&rey: Do you use correct connect parameters? (reply to 54757)

PM: Ya, wallet connection is successful. (reply to 54759)

PM: After connecting, no transaction could not be confirmed, auto rejected. In desktop environment, no problem. Only in mobile caused. Any difference between extension and mobile app version of tonkeeper wallet? (reply to 54759)

wikig: Hello guys , what's the different to host a telegram-game uising webapp and game ?

perfogic: @pcrafter can you check me this mate ? (reply to 54716)

&rey: From what I've heard, it's mostly compatible. (reply to 54718)

perfogic: okay mate, but seem like the docs does not recommend about this ^ ^ (reply to 54764)

Pragati: When I deploy contract using ever-cli I get this error   "message": "Account does not exist. You need to transfer funds to this account first to have a positive balance and then deploy its code" any one can give me solution for that

lafi: Do you have good videos you can recommend for me to learn blockchain development pls (reply to 54741)

wikig: Well . which chain you wants to dev (reply to 54768)

lafi: eth or which one is a good start ? (reply to 54769)

wikig: Lol , you are in TON chain developer channel now .   If you wants to start up the EVM developing . try read the documents of solidity to start up your first contract (reply to 54770)

lafi: Oh okay ….dose atom have also  Maybe I can be able to learn TON own ? (reply to 54771)

wikig: Sure , TON can start up with   https://docs.ton.org/ (reply to 54772)

Baldwin: how parse cell data to string? pls

Jimmy Becen: Hi guys It is possible to perform multicall in TON

Heydar: guys I send another raw message in internal message,  now my question is that, when I test it in jest, by expect have transaction, for second transaction , it's enough to check it after first transaction tested?

Heydar: or it may dont add to the transactions immediately?

jojo: Is there a tool that can quickly calculate the gas fee in a contract?

Pragati: Hello guys , "message": "Account does not exist. You need to transfer funds to this account first to have a positive balance and then deploy its code"  I got this error when I deploy contract with ever-cli

Frank: Will the dev forums be fixed any time soon?

Heydar: solved , my problem was amount of the coins ... (reply to 54777)

Bear: what is the :              x{AF16F6A2687D007D207D206A6A68BF99E836C1783872EBDB514D9C97C283B7F0AE5179029E2B6119C39462719E4F46ED8F7413E62C780A417877407E978F01A40711411B1ACB773A96BDD93FA83BB5CA8435013C8C4B3AC91F4589B4780A38646583FA0064A1804_},         deploy: true,         aborted: true,         destroyed: false,         exitCode: 6,         actionResultCode: undefined,         success: false   what is         exitCode: 6  menas?

&rey: Well, it's your responsibility to check if the resulting contract works correctly and has all required security guarantees. (reply to 54766)

Heydar: Guys how you detect how much you need for your current transaction when sending a request?(I dont mean contract logic)

&rey: *Multisend. Yes, even from common wallets. (reply to 54775)

&rey: If that's a token, sending 1 TON. (reply to 54786)

&rey: If not a token, then how much that destination contract requires.

Heydar: when I sent 0.001 ton, it didnt work, but when I changed it to 0.1 , it worked as well. it's not deployment , it's another transaction after deploy immediately. its not token , its custom contract. (however the problem is not in contract ogic. (reply to 54788)

&rey: Please consult docs, it should be described there. (reply to 54784)

Heydar: in jest, tested immediately after deploy. what do you mean of desitnation? (reply to 54789)

&rey: Well, it certainly needs some TON for gas?

&rey: You're working on other chain,  not TON. (reply to 54780)

&rey: Sandbox emulates until transaction queue is empty. (reply to 54777)

&rey: Offchain? If so, in what language? (reply to 54774)

Jimmy Becen: Nope Multisend, it is Multilcall like evm https://github.com/makerdao/multicall (reply to 54787)

Baldwin: yep, how can i read string? (reply to 54797)

&rey: s = c.beginParse() s.loadUint(8) s.loadStringTail() (reply to 54799)

&rey: Have you projected that on TON architecture? (reply to 54798)

Baldwin: nice sir (reply to 54800)

Heydar: yeah, exactly, and I want to know , when I deployed , and next line immediately doing next transaction , why cant be done in 0.001 TON. (reply to 54794)

Heydar: but it's not empty, deployed. (reply to 54796)

&rey: Well, fees are higher for almost everything! (reply to 54803)

Heydar: 🤨 it means that users if want to contribute on that, should pay about 0.1 TON? (reply to 54805)

&rey: I think contracts on average take about 0.02 TON. (reply to 54806)

Heydar: how I can make it lower? (because you said average) (reply to 54807)

Heydar: shall i optimize my calculation, or storage?

&rey: Gas optimization. Reduction of cells created. (reply to 54808)

Bear: Invalid opcode. Instruction is unknown in the current TVM version.   https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes   Weird for me (reply to 54791)

&rey: Well, your emulator is outdated. (reply to 54811)

Heydar: I create cell, and if it be temporary, how about that?(I mean , I dont use hard disk, just using memory) (reply to 54810)

&rey: Please use package versions from page about TVM upgrade. (reply to 54812)

&rey: That's one of the worst options. (reply to 54813)

&rey: Why would you need a cell if you don't store or send it?

Heydar: your right it was stupid question 😂😂  I have not that, just want to arrange the information in my mind :D (reply to 54816)

&rey: Tuples can reduce complexity of stack value reorderings and therefore take less gas, also.

Heydar: Thanks a lot ❤️  how you make benchmark on gas fees? (reply to 54819)

Heydar: do we have any benchmark sdk for that?

&rey: You can emulate the contract on a preset list of transactions during tests, and sum computation fees (or even used gas) over them. (reply to 54820)

Heydar: Thanks, I will try to achieve that. so we need a benchmark sdk in ton developement too (reply to 54822)

&rey: How is it different from tests, actually? (reply to 54823)

&rey: Your benchmark SDK at least implies that you could check test coverage.

Heydar: for example you want to know which part of your func codes consuming more in a test procedure. (reply to 54824)

Nyxra: if anyone has jettons on testnet please send me some for testing   UQAKW5qVNT64JbLzIvFRnzvb-n-hCoTeJwAQ6tZj7h0Pvsdi

CYFHER: Hi Guys Please how do I fix 'Price Impact too high 100%' on ston.fi ? This happened after I added liquidity to the token.

Arnaud: Hey guys, got a problem here. When will the save_storage operation execute here? Will it depend on the execution status of call_pay_to here?

Arnaud: if (op == burn_notification) {     ;; Sent by LP wallet after burning LP jettons to release liquidity     (int jetton_amount, slice from_address, slice response_address) = (in_msg_body~load_coins(), in_msg_body~load_msg_addr(), in_msg_body~load_msg_addr());     int gas_required = get_gas_fee(25000, WORKCHAIN);     cs~load_msg_addr();     cs~load_coins();     cs~skip_bits(1);     cs~load_coins();     throw_unless(INSUFFICIENT_GAS, (msg_value > gas_required) & (msg_value > cs~load_coins() * 6)); ;; use fwd_fee to estimate messages      throw_unless(INVALID_CALLER, equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), storage::jetton_lp_wallet_code), sender_address));     throw_unless(ZERO_OUTPUT, jetton_amount > 0);      ;; get shares     int amount0_out = (jetton_amount * storage::reserve0) / storage::total_supply_lp;     int amount1_out = (jetton_amount * storage::reserve1) / storage::total_supply_lp;      ;; both are positive     throw_unless(ZERO_OUTPUT, (amount0_out > 0) & (amount1_out > 0));      storage::reserve0 -= amount0_out;     storage::reserve1 -= amount1_out;     storage::total_supply_lp -= jetton_amount;      int gas = 0;     int mode = CARRY_REMAINING_GAS;     if (response_address.preload_uint(2) != 0) {       gas = (msg_value - gas_required) / 2;       mode = NORMAL;       var body = begin_cell()         .store_uint(excesses, 32)         .store_uint(query_id, 64);       send_message_nobounce(gas, response_address, body.end_cell(), IGNORE_ERRORS);     }     call_pay_to(gas, mode, query_id, from_address, burn_ok, amount0_out, amount1_out);     save_storage();     return ();   }

Arnaud: Is it due to the poor liquidity in the pool? (reply to 54829)

CYFHER: I don't get your question.  Do you mean, higher liquidity reduces price impact? (reply to 54833)

Arnaud: yeah I believe so

Arnaud: High price impact means your swap amount is kind of too much for an amm type pool

&rey: Yes, it will not be run if execution of call_pay_to fails. (reply to 54830)

&rey: Please take note that execution of that does not include sending message, nor any actions by destination contract.

Arnaud: Could you specify a little bit on it? As there's no feedback from call_pay_to, so how could save_storage be executed based on it's execution status. I'm not so familiar with the async mechanism here (reply to 54838)

&rey: If call_pay_to is fully run, then save_storage runs also. (reply to 54840)

Pragati: No I am working on TON (reply to 54795)

&rey: Async paradigm of TON: all side effects happen after TVM execution. Or before, as is case with depositing incoming value.

Arnaud: Is this the core reason for the conclusion above？ (reply to 54843)

&rey: Then you're using wrong tool; ever-cli is not for TON. (reply to 54842)

Bear: you mean the @ton/sandbox? (reply to 54812)

Pragati: Tonos-cli it's not working (reply to 54845)

Bear: omg, true. (reply to 54784)

Arnaud: hey mate, i wonder whether you got any specific documents introducing this that you recommend, so i could dig a little more (reply to 54843)

&rey: Where have you got list of tools from? (reply to 54848)

&rey: You're naming second Everscale tool.

Pragati: I want to deploy .sol contract on TON blockchain, how I can do this things ?

Bear: So true, thanks a lot. @pcrafter, you are my man! (reply to 54784)

&rey: Whitepaper, probably? (reply to 54850)

wikig: Hello guys , i have a question about telegram game dev .  This is an example game :  t.me/jumpandjump_bot?game=jump  And when i click it in mobile it will auto share with innerline button .

wikig: And we read the docs saids we can change the innerline button value : (reply to 54862)

wikig: But how can we change the value of the innerline button ?   It require the response from the bot back-end ?  Or it can be done setting in botfater ? (reply to 54863)

wikig: If you using @wallet TON sapce . you should able to get your seed words .   If you using @wallet ..... it can't (reply to 54867)

wikig: If you use TON space . the @wallet should ask you to keep your seed words safe and send emails (reply to 54869)

K.: Then you probably aren’t using it. The basic version of wallet doesn’t provide you keys. (reply to 54871)

K.: It’s a custodial wallet.  https://www.coindesk.com/learn/custodial-wallets-vs-non-custodial-crypto-wallets/

K.: In wallet’s settings toggle “Enable TON Space” and you’ll see it. (reply to 54875)

Pragati: Hello guys, did anyone deploy solidity contract on TON blockchain

Bear: any repo with the latest version packages?   My test is passed, but can't deploy the contract in test net!  Seems the package error. (reply to 54805)

K.: Solidity does not work on TON, since TON has its own languages for smart contracts. (reply to 54878)

perfogic: even TVM solidity on everscale ? (reply to 54880)

Bear: ;;## Gas ;; ;;Gas constants are calculated in the main test suite. ;;First the related transaction is found, and then it's ;;resulting gas consumption is printed to the console.  ;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L853](L853) const SEND_TRANSFER_GAS_CONSUMPTION    = 9255;  ;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L862](L862) const RECEIVE_TRANSFER_GAS_CONSUMPTION = 10355;  ;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1154](L1154) const SEND_BURN_GAS_CONSUMPTION    = 5791;  ;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1155](L1155) const RECEIVE_BURN_GAS_CONSUMPTION = 6775;  Where we got these? (reply to 54882)

&rey: You still need to port your contract to TON architecture, copying won't work. (reply to 54881)

&rey: You can't instantly access other contracts, for example.

K.: I am not sure I understand your question, but sounds like no. The TVM you are referring to is not TON Virtual Machine.  edit: it’s Threaded Virtual Machine and it’s TON’s. My mistake 🙌🏻 (reply to 54881)

&rey: They are different but not that much, really. (reply to 54886)

Rishabh: How can i get txn hash in ton?

Rishabh: i am using tonconnect to send txn

Sadegh: Just another question, I withdrew all the balance of user wallet to my main wallet using CARRY_ALL_REMAINING_BALANCE send mode.  Now what happened to this wallet? I found it could be frozen in the feature if has no storage fee in the wallet. is it correct? if so and if it will be frozen, can the user deposit TON to it again? and can I reactivate it by deploy wallet-v4 contract again on it?

&rey: It will be frozen when debt reaches -0.1 TON. It can be unfrozen by anyone depositing enough money and sending last actual state. (reply to 54892)

&rey: Wallet will be deleted when debt reaches -1 TON; that's quite impossible, unless you are in masterchain.

Bear: I can't get why this (reply to 54883)

123xfs: What is the correct endpoint?

123xfs: In the React web project, I want to check the balance of TON wallet address. Is there any method API available ?

Sadegh: For the system to which users may deposit again to a wallet, do you suggest to use CARRY_ALL_REMAINING_BALANCE mode withdraw or  just remain small amount to the wallet to prevent it from becoming frozen? (reply to 54893)

User<6394624703>: Why isn't this showing up? (reply to 54899)

123xfs: bug?

musashi: hey there, I used ~dump(var) in func code but don't know how to log it when run blueprint scripts

musashi: pls help

Heydar: Guys do you suggest a course about tma/sdk to developing webapp(except https://stepik.org/) or a complete example(source code) that use whole features of telegram to develope that webapp.

Heydar: when you run it, it will print in console automatically. (reply to 54905)

musashi: I didn't see it =) do I need to add some flag to npx blueprint run command? (reply to 54908)

Development: Hello. I'm looking for a full-time job, a paid internship. I'm finishing up a ton of developer research, I had a little experience in development.

Frank: Are there actual TON devs here?

musashi: u mean there are some 'fake' Ton devs? (reply to 54923)

K.: a lot of scammers nowadays, yes. (reply to 54924)

к.: Hi, guys is there any way to use the a ton to connect using the trust wallet?

K.: Trust Wallet does not support TonConnect, no. If Trust Wallet developers ever decide to support TON, then it will work. (reply to 54926)

Nyxra: Guys I am trying to transfer jetton and got this error. I got the code from this example: https://github.com/yungwine/TonTools/blob/master/examples/Jetton/transfer_jetton.py  How can I fix it? Any idea?

Frank: I mean that work at the foundation (reply to 54924)

lumate: Hi, looking for customers for small projects. I can make smart contract, webapp, any scripts for your project.

fade: hey, by propagating external messages via tonapi, do you mean to use tonapi /v2/liteserver/send_message? (reply to 49916)

fade: i'm sending the correct boc in base64 string form to tonapi but got the error message {"error":"unknown magic prefix"}, not sure what it is, the same boc successfully sent to my node via adnl

Solitary Developers: I want to post more comments in the messages transaction: [{                  address:                  amount:              }] ????

User<6930831321>: Hi all, if anyone WEB3 need a developer on the project or in the long write in lis.

Heydar: Actually because it run in console.log and when I use jest , so it's better to say I dont know what's going on in underhood.  but I do this always and can see the dumps: npx blueprint build npx blueprint run (reply to 54910)

🅰🆁🅳🆉: Hello, Is there a way I can read LP lock time on TON Inu programmatically like in JS, any lib suggestion would be great!

Ambitious: i can use nextjs create dapp?

Komron: Not flexible solution, but yes (reply to 54951)

Ambitious: thanks

Whenwin: Can tokens that have been minted be updated? if yes...where? Please help

Boris: why not? (reply to 54952)

Komron: When the project scales, it’s hard to keep management over project (reply to 54956)

Андрей: Hi, does anyone know how many @ wallet addresses to withdraw?

Victor: Hello, does the public lite client has rate limit?

Vitalii: Hi! Does anyone have an example of how to pass a map as a function argument? I'm using Tact and Blueprint sdk

CKEPTIK SHOP: Hello. Ready to start working with a start-up project. developer webapp , web3 , smart-contract.

&rey: As a cell. (reply to 54965)

Gyorgy: If using IPFS not, if using metadata on Centralized server. You can. The where is easy you define the metadata .json path upon minting 🙂 (reply to 54955)

&rey: That still requires to make some transaction so that explorers update metadata instead of caching. (reply to 54973)

Gyorgy: Not noticed that. Or maybe cache has expire date or you can manually trigger on getgems. Only tried on testnet was smooth so far. (reply to 54974)

Whenwin: I forgot the process of entering the logo (reply to 54973)

Tony: Hi team TON dev do you know tele lag 30 minut ?

appenines: Dedust support does not work at all, there is nowhere to write to them

Harut | Drops💧| (Ø,G): Hey guys, I have Ton NFT in my coin98 wallet, but Ton NFT doesn't supported there. and I can't login to another TON wallet(e.g. Tonkeeper) which supports Ton NFT with my seed phrase from coin98, it requires 24 word seed phrase but coin98 provides 12 words. Also there is no place to add a wallet with private key. Any suggestions how I can access to my NFT?

к.: As I know there would be some compilers that compile solidity code to TVM instructions.   Not sure if it's recommended, but you can check and test. (reply to 54740)

Boris: is coin98 open source? maybe they just take the 12 words insert them twice 🤷️️️️️️ (reply to 54991)

Harut | Drops💧| (Ø,G): inserting twice didn't work :/ and their github seems public

Boris: try to file an issue on their github 🤷️️️️️️ (reply to 54995)

Harut | Drops💧| (Ø,G): ok thanks 👍 (reply to 54997)

appenines: Hi i bridged on DeDust  USDC to jUSDC  and now have problem because i can't claim it because how i want to claim it i see this announcement  "App Ledger 2.0 is not support custom transaction". i used metamask ETH wallet and openmask TON wallet , how I can now to claim this jUSDC ?

Mau: I am looking for a good developer who can help me create 2 scripts for Toncoin using the APIs   Only message me if you have experience and can deliver quality!

TON Bounty Bridge: ​ Bug : Uplaod invalid filetypes on https://society.ton.org/ profile page  🏷 Developer Tool  Summary:hello ton Societyi find upload bug onhttps://society.ton.org/v1/admin/media/uploadinhttps://society....  Created by bitilo

Matheus: How can I check if an address is initialized or not? Meaning, if it has a contract deployed on it?

Victor: who use ton.config.json for adnl? I want to get  information about rate-limit, reliability and other bottlenecks

Orange: hi all, I try to use tonweb to build a jetton transfer and send via tonconnectUI, but I can not send forwardPayload with a 42 length string. It says BitString overflow. But I can send it via Wallet bot. Anyone can help me ?

Orange: I wanna send it and decode it in backend ,I can pay 100USDT if anyone help me. (reply to 55010)

TON Bounty Bridge: ​Fix BitString overflow issue in jetton transfer with forwardPayload  Summary:An issue where a BitString overflow error occurs while sending a jetton transfer with a 42 length st...  Rewards: • SBT Bounty Reward • TBD USD in TON  Created by norbubb

Heydar: can someone help me please? 🙏🏽🙏🏽🙏🏽 (reply to 54907)

Heydar: or any book

Mickey | SuperteamPL: hey everyone, I was trying to use TON Connect to connect my tg wallet but Im getting "Dapp manifest not found" error when I try to connect wallet

Mickey | SuperteamPL: even tho I have tonconnect-manifest.json file

Mickey | SuperteamPL: im my /public folder in nextjs app

Mickey | SuperteamPL: and its possible to get it by /tonconnect-manifest.json url

K.: Are you referencing that manifest file like so?: <TonConnectUIProvider manifestUrl={manifestUrl}>     <App />   </TonConnectUIProvider>  Where manifestUrl is the actual URL.  https://docs.ton.org/develop/dapps/ton-connect/developers  http://tonhelloworld.com/03-client/ (reply to 55021)

Heydar: or any full example to learn better to create mini app that is integrated completely with telegram? (reply to 55017)

K.: I’d say TON documentation has great guidance for TMAs. And examples too: https://docs.ton.org/develop/dapps/telegram-apps/app-examples (reply to 55029)

Heydar: Sorry I didnt see ❤️ however,  even Im not familiar with react js ...  thanks , I will start with that  thanks (reply to 55031)

Mickey | SuperteamPL: I see that it actually works only when I deploy it on vercel and update all the urls to vercel one, I cannot test it locally even tho I have ngrok running (reply to 55027)

K.: Well, React seems to be the best choice. It’s even said in the docs:  If possible, it is recommended to use the @tonconnect/ui-react kit for your dApps.  I personally agree, the ui-react library has been working great. (reply to 55032)

K.: Yeah, usually you point to an external link like GitHub raw file or a live version. (reply to 55033)

Heydar: :D you are expert , Im just a low coder man :D I will consider this doc, thanks for the guide ❤️ (reply to 55034)

Mickey | SuperteamPL: so this is actually a problem right? how can I test connecting wallet locally when developing when I cannot connect it before deployment to vercel (reply to 55035)

K.: does it really not work if you serve it locally? haven’t tested that personally. (reply to 55037)

K.: You can upload a mock manifest to GitHub and use it for testing. Then just switch to production one when releasing.

Mickey | SuperteamPL: nope, I have ngrok running so I have https url from it which I paste into manifest and TonConnectUIProvider and Im getting this "dapp manifest not found" error (reply to 55038)

K.: weird, I’ll have to test it out. (reply to 55040)

Mickey | SuperteamPL: I've just did it, so my bot app url points to ngrok locally to allow me developing and I've changed my manifest url and manifest.json files to point to a vercel deployment but im getting error again (reply to 55039)

Mickey | SuperteamPL: it only works when I setup everything to vercel url

Mickey | SuperteamPL: but to actually test anything I have to deploy it to prod and see logs in there

User<6332241006>: Hello friends, can I ask a question about a project?

Crypto: Looking for a TON dev🙏

Kuilash: Hi can we talk about what you need in PM? (reply to 55051)

Crypto: Sure😁 (reply to 55052)

Kuilash: Check dm (reply to 55051)

Dylan: Most likely because it wants you to be using https. Can use localtunnel as an option instead of ngrok. Gave me better results. (reply to 55044)

— 2024-04-27 —

King: Hi friends  Who know about  Random numbers just like cloud fire?  They use a system by cam that look lava lamp then get the data from it   I want numbers from blockchain The Open Network  A system dex   😂 I know maybe I'm crazy  But I want to know if know that haha

NekoSenpai: Hi, I have a client with some doubts when it comes to making his Tokenomics and I have also generated doubts.  If you could help me with these questions I would appreciate it.   The launch price target he needs is around 300k - 400k market cap.  Data: Max Offer is 1 billion. Raise 200k 100k available liquidity  20-30% goes to DEX listing  Questions: What would be the correct tokenomics at 300-400k at launch?  How much liquidity to provide for that ratio?  Target ratio is 7% liquidity to mc ratio.

محمد: 🥇

Hustle: Hey guys, did toninu scanner made their own api or what,  How can we retrieve LP Lock informations for tokens on ton chain 🥲🥲

Kushagra: Hi everyone, I am using TonCenter APi - and keep getting '<title>toncenter.com | 504: Gateway time-out</title>\n' any help.. I am using the paid plan

Tân: hy guy, how can i get token infor. I got address of jettton

123xfs: 1

123xfs: How to obtain wallet balance

Nikolay Kovalkov: Hi all, I am a web3 developer with great experience, I perform such tasks as writing smart contracts, development of webapp applications, development of telegram bots of any complexity

I'm: Hi everyone, I am searching the code that can get estimate Ton fee. But I have no result. May you share me the way?. Thank bro

Elon: what the hell about telegram

Elon: alway down

MA: Is it possible to have optional parameter in functions in FunC ?

Nyxra: Guys I am getting an error while trying to transfer USDT, my code from this example: https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment  Error: pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 0 code. Message: cannot apply external message to current state : External message was not accepted        Cannot run message on account: inbound external message rejected by transaction 0A...  Any idea what I should do to fix this? Thank you

123xfs: @tonconnect/ui How to obtain the balance of wallet tokens?

CKEPTIK SHOP: Hello. Ready to work in a small start-up project. Experience : 1 year in TON. I know how to write smart contracts, webapp.

Kevin Jr: Hi guys, how can I list my project giveaway on @community_bot?

Артур: Hi guys! Is there any way to explicitly calculate how many tons per year will be consumed by a smart contract storage?

Амир: Deploy, wait 1 year, try to send message, check the fee (reply to 55111)

Nyxra: Is anyone using tonsdk on python? https://github.com/tonfactory/tonsdk Is it safe to use? I want to use it to transfer jetton. I don't know if it works. I have tried TonTools and pytoniq both didn't work for me and gave me errors.

I'm: Hi bro, I am searching the code that can get estimate Ton fee. But I have no result. May you share me the way?. Thank bro

K.: Have you checked this: https://docs.ton.org/develop/smart-contracts/fees#storage-fee ? There's a calculator example. (reply to 55111)

Артур: not yet, thank you! (reply to 55117)

Slava: Regarding fees calculation, please see the recent TVM upgrade: https://docs.ton.org/learn/tvm-instructions/fee-calculation-instructions  The related documentation wasn't updated.  For example, you can now use the GETSTORAGEFEE instruction to calculate the storage fee (you don't need to do this manually anymore).

elias: Hello, folks! Question about the TON bridge. Direction JUSDT(TON) -> USDT (ERC20). After calling the coin burning contract, the page reloaded, how to return the procedure now? There should be some way through GET parameters, right?

elias: Something like this: bridge . ton . org/? fromNetwork=ton& toNetwork=eth& amount=100& toAddress= ETH_ADDRESS& lt=TIME& hash=SOME_HASH& token=usdt& recover=true (reply to 55121)

Erik🆓: What can https://toncenter.com/api/v2/#/accounts/get_extended_address_information_getExtendedAddressInformation_get parse?

Erik🆓: Documentation says: Similar to previous one but tries to parse additional information for known contract types. This method is based on tonlib's function getAccountState. For detecting wallets we recommend to use getWalletInformation.  All I get is code and data. I can probably classify the addresses by looking up the code in a table of common contracts (NFT, NFT sale, ...) but somehow I need to decode the data to see for example which NFT it is about.

Vitalii: Hi! I'm trying to calculate jetton wallet address for my contract:     get fun calculateWallet(addr1: Address, addr2: Address): Address {         let init: StateInit = initOf JettonDefaultWallet(addr1, addr2);         return contractAddress(init);     } The first address - jetton master contract, second - my contract. But the return value differ from the getWalletAddress function of the jetton master contract. The JettonDefaultWallet is imported in both contracts. The blockchain.openContract(await JettonDefaultWallet.fromInit(jettonMaster.address, contract.address)) also returning different address

Yannis: Hi guys, Please DM if interested:   I’m looking for someone who can read and translate blockchain data in raw format like this:   {             "@type": "raw.transaction",             "account": "0:00325c9897b1bbb23687353a72df517e47806aaffad3a68862336fac59fb987a",             "address": {                 "@type": "accountAddress",                 "account_address": "EQAAMlyYl7G7sjaHNTpy31F-R4Bqr_rTpohiM2-sWfuYelm1"             },             "data": "te6cckECCwEAAsUAA7VwAyXJiXsbuyNoc1OnLfUX5HgGqv+tOmiGIzb6xZ+5h6AAApmFpQm8EmVWicA4ALhoLJ04wtfspNpZGea+llYuv9AnuVozZAkwAAKZhWj04JZhMNSAADRsjZHoAQIDAgHgBAUAgnIg1OMM41847AtMa6gtlutvf3UpzyQRE4DZ/pzX1/LZJPOasM/OQCVRHsk8DFiByQK+GKa+leeKNarRddTMvEmFAg8MUUYZk88EQAkKAeGIAABkuTEvY3dkbQ5qdOW+ovyPANVf9adNEMRm31iz9zD0A1JbCtiuV+bBlXguzaHMndSi+vDfCv9gLud/4ykD/ducbT9JdNOd5L8rWnQyFX2MbwsKmwVl8CNZBK03zNM/EElNTRi7MJhsAAAHwggAHAYBAd8HAWhiAGD4ZR6JfEDJB+Di+bf0FsWd+/QSiu5AILxrTMheZfODoBfXhAAAAAAAAAAAAAAAAAABCAGxaAAAZLkxL2N3ZG0OanTlvqL8jwDVX/WnTRDEZt9Ys/cw9QAwfDKPRL4gZIPwcXzb+gtizv36CUV3IBBeNaZkLzL5wdAL68IABioS7AAAUzC0oTeEzCYakMAIAPJNaW5lAGYTDcW/QucgGZcvAYu2a96i76GByKEs2OYq896ro0gagorB6jIp3nfsIrYfpaJTIp3q/gD6edtf7fRJncAELyaGAAAAMY4B6BRaQwsuCZGW0XCzCDIp3nfsIrYfpaJTIp3q/gD6edtf7fRJncAELyaGAAAAAJ1BnYMTiAAAAAAAAAAAEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAG/Jj8cQTCoSqAAAAAAAAgAAAAAAA7YWghwdG953Ge0Zf6suOoMGvqA7R0kc2aeq6PmU2UyiQJA0TGsBTKQ=",             "fee": "7960069",             "in_msg": {                 "@type": "raw.message",                 "body_hash": "Z2LEHn2ifpT6bClp1jHSLrulHbFDJ4fLX/0bpbvyG0I=",                 "created_lt": "0",                 "destination": {                     "@type": "accountAddress",                     "account_address": "EQAAMlyYl7G7sjaHNTpy31F-R4Bqr_rTpohiM2-sWfuYelm1"                 },                 "fwd_fee": "0",                 "ihr_fee": "0",                 "msg_data": {                     "@type": "msg.dataRaw",                     "body": "te6cckECAwEAAQMAAZxqS2FbFcr82DKvBdm0OZO6lF9eG+Ff7AXc7/xlIH+7c42n6S6ac7yX5WtOhkKvsY3hYVNgrL4EayCVpvmaZ+IJKamjF2YTDYAAAPhBAAMBAWhiAGD4ZR6JfEDJB+Di+bf0FsWd+/QSiu5AILxrTMheZfODoBfXhAAAAAAAAAAAAAAAAAABAgDyTWluZQBmEw3Fv0LnIBmXLwGLtmveou+hgcihLNjmKvPeq6NIGoKKweoyKd537CK2H6WiUyKd6v4A+nnbX+30SZ3ABC8mhgAAADGOAegUWkMLLgmRltFwswgyKd537CK2H6WiUyKd6v4A+nnbX+30SZ3ABC8mhgAAAJ27du4=",                     "init_state": ""                 },                 "source": {                     "@type": "accountAddress",                     "account_address": ""                 },                 "value": "0"             },             "other_fee": "7960000",             "out_msgs": [                 {                     "@type": "raw.message",                     "body_hash": "AAAAAAAAcE7StD+G+IcC4G6oUaKlpPMT3/OYWkKQ5TU=",                     "created_lt": "45734327000002",                     "destination": {                         "@type": "accountAddress",                         "account_address": "EQDB8Mo9EviBkg_BxfNv6C2LO_foJRXcgEF41pmQvMvnB9Jn"                     },                     "fwd_fee": "1378678",                     "ihr_fee": "0",                     "msg_data": {                         "@type": "msg.dataRaw",                         "body": "te6cckEBAQEAewAA8k1pbmUAZhMNxb9C5yAZly8Bi7Zr3qLvoYHIoSzY5irz3qujSBqCisHqMined+with+lolMiner+APp521/t9EmdwAQvJoYAAAAxjgHoFFpDCy4JkZbRcLMIMined+with+lolMiner+APp521/t9EmdwAQvJoYAAACR3eRm",                         "init_state": ""                     },                     "source": {                         "@type": "accountAddress",                         "account_address": "EQAAMlyYl7G7sjaHNTpy31F-R4Bqr_rTpohiM2-sWfuYelm1"                     },                     "value": "50000000"                 }             ],             "storage_fee": "69",             "transaction_id": {                 "@type": "internal.transactionId",                 "hash": "BZyZc8GEn70NoxWg6QaafuMP2orkIIMHqQsMlkKByJE=",                 "lt": "45734327000001"             },             "utime": 1712524616         },

Heydar: do we have any video that complete explain jettons? if you saw , share it with me please.

Heydar: I seached and saw in youtube, it was not so clear, if we have a good explaination post too, it's better. thanks (reply to 55138)

Hustle: Anyone? (reply to 55082)

&rey: Have you seen https://docs.ton.org/develop/dapps/asset-processing/jettons? (reply to 55139)

Jeremy: I created multiple child contracts with a parent contract. How can I obtain the addresses of all the child contracts? Do I retrieve them from the chain using a specific library, or do the contracts emit the addresses proactively?

Slava: You want to retrieve them off-chain, right? (reply to 55143)

SSLCertificates: We need ton course

MJT: hi all

MJT: i had a question on shardchains

MJT: how much throughput can each shardchain handle?

MJT: how many accounts does each 1 hold?

Milad: const transaction = {                     validUntil: Math.floor(Date.now() / 1000) + 360,                     messages: [{                         address: jetton.address,                         amount: toNano(0.5).toString(),                         payload: body.toBoc().toString("base64")                                                  }]                 }  hi everyone. how can i get the payload in wallet samrt contract using TL-B?

MJT: sry if this isnt the right place

Jeremy: Yes, what should I do (reply to 55146)

Jeremy: I don't know what information is useful

Vlad: Hello, help me please with sending external messages. Here the code snippet (script, contract tact) const test: TEST = {             data: n,             $$type: "TEST",         }         return lotteryMaster.sendExternal(test); external(msg: TEST) {         acceptMessage();         self.seqno += 100;     }  Tonapi response always 500

Andrey: Hello, did anyone write Silidity contract and compile it to TVM? Is it good way to develop on TON?

Slava: The size of the shard chain is adjusted dynamically, based on the network load. (reply to 55154)

MJT: Sure but how much throughput does each work chain do (reply to 55168)

Hustle: So there's no way to check lp lock information of jettons?

Hustle: That's odd

Nxrix: is it possible to find raw address from seed phrase in js?

&rey: In TS, it's quite better. (reply to 55175)

&rey: You need to create wallet wrapper from keypair, and it will return an address.

&rey: Please take note that wallets have different versions plus address can be in bounceable or unbounceable form.

musashi: can I return a dictionary in get method, if so how to read it by using ton client sdk?

&rey: It's determined in config. Please consult docs if you want to know parameter IDs. (reply to 55169)

&rey: Yes. as a cell. Use ?.loadDictDirect(). (reply to 55179)

musashi: thanks

Nxrix: I need v4r2 (reply to 55178)

Nxrix: possible to write a script do it itself? (reply to 55177)

MJT: Could you send me a link I’m a noob? (reply to 55180)

&rey: Yes. https://docs.ton.org/develop/howto/blockchain-configs#param-22-and-23 (reply to 55186)

User<6779143540>: I am looking for an Indian / Pakistan devs who has more than 4+ years of experience in blockchain development. It would be great if you have experience in full stack too. please contact me with your github / cv

Heydar: it's not clear at all. for example who can understand the high level architecture of jetton by this diagram: (reply to 55141)

K.: what’s not clear about this specifically ? (reply to 55191)

Heydar: actually it should be for a beginner person that just know programming ,  I want to understand why we need jetton at all, and how it solve the problem, and where we use jettons ... something like this can help to understand what's going on in the jetton codes ... (reply to 55194)

Heydar: it dived directly in the codes and using jettons :/

Heydar: check this post please: https://gemwallet.com/learn/what-is-jetton-and-what-you-need-to-know-about-tokens-on-the-ton-blockchain/  really reading which link is better to start learning jettons? (reply to 55194)

K.: are you asking why Jettons were created in general? i don’t get your question really (reply to 55195)

Heydar: however I learned something by reading some posts and that doc page too , but I needed a doc that start from the topics that is question in a person's mind(who want learn jetton completely). (reply to 55195)

Heydar: it's one question from 10 question(and it's just basic question, shall he dont ask that question?!), that someone may asks. (reply to 55198)

K.: This is probably the starting point: https://docs.ton.org/develop/dapps/defi/tokens  It links to many places, and should cover anything you need to know. (reply to 55199)

Mohammad: Hey guys. How can I manage received jettons to my contract? do I need wallet code and minter address of each jetton I want to support, to calculate the address for trust checks in transfer_notification opcode? If yes how can I manage a dynamice jetton receiver contract and do anything about that?

Louis: Can someone help me? I want the comment received to be the string "Q" in the contract, but in tonviewer it changes to "Call: 0x00000000"

Louis: Did I do it right, it's just not showing up?

Nxrix: Wasn't it storeSlice from what I remember? Idk (reply to 55207)

Kelzworld🐾: Good Day everyone. What are the rules guiding this group.  I just want to know and abide by it. Thank you.

&rey: 1. TON Foundation chat rules: https://t.me/toncoin_chat/4088. 2. This chat is for on-topic discussion. This explicitly excludes problems with how common custodial services handle assets, meme coin recommendations or price predictions, etc. 3. Meta-conversations (thanking someone, or searching for dev/job) may be deleted afterwards so that the chat remains a knowledge aggregator. (reply to 55213)

Kelzworld🐾: Ok

Kelzworld🐾: Thank you

Kelzworld🐾: Am i allowed to share a mini app idea in this group that will help the Ton blockchain development?

Behrang: Have you read this one by Tal Kol?  https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons (reply to 55197)

Nxrix: Is there anyway to find the connection of TON price to BTC?

Nxrix: It depends like if it's a useful tool I think it can be very good) (reply to 55219)

Kelzworld🐾: Ok. If i share it if you guys don't like it. Its fine. But it is a 100% useful tool for SocialFi.

abdoul.xw3: Imposible (reply to 54878)

Pixel: Here is an experienced frontend and smart contract engineer looking for ongoing projects now. please let me know if you are in need of my help.

𝑴𝒂𝒎𝒂𝑹𝒆𝒛𝒂: I made a transaction but i forgot to add the comment... is there a way to get the asset back?

Louis: how to read this tring in contract pls? (reply to 55204)

&rey: Please try sending beginCell().storeUint(0, 33).storeStringTail("Q").endCell(). It seems it would work better. (reply to 55207)

Louis: thanks, i edited it as you suggested, but how do I get the string "Q" in the contract? (reply to 55232)

Louis: More specifically, I want to get the string "Q" in receive(deposit: Token Notification)

&rey: Why do you want a string specifically? Can you do some processing on it?

&rey: Or a general slice would be sufficient?

Louis: So how can I get numbers from 0 to 10 in the contract without passing in string? (reply to 55235)

&rey: By passing in a slice, loading 8 bits and shifting character code to digit (re: ASCII character codes). (reply to 55237)

&rey: I'm interested, how you planned to do so with string?

CYFHER: Why India? (reply to 55190)

Louis: I did it, thank you (reply to 55238)

Louis: Are you not sleeping? I see you respond to messages at all hours?? (reply to 55238)

&rey: I assure you I both take a normal amount a sleep, and not a bot. (reply to 55246)

Louis: yeah, i was actually about to ask if you're a bot (reply to 55247)

Louis: take care of yourself man, this community needs you to answer all questions

crush me with your thighs.: Job Position: Game Developer in TON WEB3 Multiverse  We are looking for talented game developers to join our team for permanent work, who will be able to create unique games in the TON WEB3 multiverse. You will develop the game concept, create the game world and characters, as well as develop the game mechanics and monetization.  Responsibilities:  Develop the game concept. Create the game world and characters. Develop game mechanics. Develop game monetization. Test the game. Support the game after launch. Requirements:  Experience in game development. Knowledge of programming languages Python, C++, JS, #C. Understanding of blockchain principles and TON WEB3. Ability to work in a team. Responsibility and punctuality. Conditions:  Competitive salary (after the project launch). Opportunity to work remotely. Flexible work schedule. Opportunities for professional growth and development (many ideas). If you are ready to take on the challenge and create a unique game in the TON WEB3 multiverse, please send your resume to our email reborn@crypto-7.ru

Mohammad: I think my explanation is a bit lame. Let's try another approach: I have a contract, and I want to get notified when this contract received jettonA, jettonB, and any other jetton on the blockchain. How can I differ these jettons? How to avoid fake transfer notifications? And how to write logic for each jetton received?   I want it to be dynamic. But as far as I know I need to access wallet code and minter address to generate jetton wallet address to verify notifications. But when it comes to supporting multiple jettons, it is a bit hard to manage all wallet codes in the contract's storage. (reply to 55202)

Charles: Good evening everyone

Charles: Anyone here in need of a community manager

Heydar: while it's async, how we prevent double spending in this flow?

Heydar: or it minus in the first transaction, and if the flow(completely) be failure, adding again?

Behrang: Money moves with a message in a transaction chain. As long as chain is not broken, and errors are handled, eventually it can all be settled.

— 2024-04-28 —

On-Chain ⛓️: Yay (reply to 54282)

On-Chain ⛓️: Hi guys, what language can I use to make my bot interact with Dex's router on ton?

Deny: hello, I sent transaction and transaction available on tonscan but a few seconds later, transaction is unavailable. Any reason for this issue? thank you.

Ke: hi guys, how to get the op code, such as '0x5fcc3d14'? int op::transfer() asm "0x5fcc3d14 PUSHINT";

Ke: Can I compute the op code by myself?

musashi: u can refer to how TEP74 do it here: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#tl-b-schema (reply to 55283)

musashi: for example crc32('transfer query_id:uint64 amount:VarUInteger 16 destination:MsgAddress response_destination:MsgAddress custom_payload:Maybe ^Cell forward_ton_amount:VarUInteger 16 forward_payload:Either Cell ^Cell = InternalMsgBody') = 0x8f8a7ea5 & 0x7fffffff = 0xf8a7ea5

Sergiu Popov: guys, please, share the snippet which caches TMA🙏

ABRAHAM: Hi, any difference from liteservers, I usually got error with message "tonlibjson did not respond" when call to same liteservers at the same time. I'm using TonlibClient from pytonlib package? Sometimes it works, sometimes not

Rich: Hi, the time to finality on TON is 6s but it takes me lile 1-2m to do a dex swap tx. Can anyone explain why this is the case and if it'll be fixed down the line?

Rich: Currently writing a report on TON and this is the last thing bothering me. Thanks you!!

Rich: Surely my DEX tx should be done in max 6s as soon as the first block is finished right?

Dylan: most likely that dex transactions are a series of messages that each have their own ttf, which could span across blocks if i understand correctly.

kevin: truth is a single swap involve multiple transactions,  especially if referral is envolve.  have to wait at least lp pool confirmation (you have not receive jetton by then) (reply to 55303)

kevin: can not determine if swap is OK until LP pool return valid exit_code as sometimes min_out is set and not enough reserve remains. (reply to 55302)

Rich: so this can't get improved? This will forever be lile 1-2m? (reply to 55305)

Rich: That's honestly very bad considering other chains are instant tho

User<6475523950>: @TrueCarry @tsivarev (reply to 55287)

kevin: TON is design in actor pattern and everything is a contract,  the swap action is carried by multiple contract , I don't see any chance this can be improved. (reply to 55307)

Dylan: if i'm undestanding it correctly. sharding should solve that in time. currently there is only one workchain performing all transactions. future plans would parallelize these across multiple "lanes"

Rich: Damn (reply to 55311)

Rich: How will TON be able to compete if DAPPs take like 1m for txs?

Rich: You can't have good DEXs etc

Rich: Hmm would love to get a second opinion to verify this. Interesting if this can be the case (reply to 55312)

Tim: Do you want to do something about it yourself? (reply to 55313)

Rich: Writing a report on it. I'm just curious about it as it was the one bad thing I noticed in my research. (reply to 55318)

wikig: Hello guys , this is s simple jetton transfer of USDT .     I notice it transfer 0.05 TON .  The target address of reciving the jetton is new address which have no jetton account . So as how i understand , the 0.05 TON is for deploy the jetton wallet contract right ?  But what if i transfer the jetton to a wallet already have jetton account ? Will it require for 0.05 TON for the fee ?  Or we can simplely just send jetton with 0 amount .  Now i am writing the font-end of transfer , so we wants to know when will we have to add transfer amount in jetton transfer .   Thanks !

Tim: Block time will be 4s. Swap will take around 30s. Good ui can show you swap results around 10s later (reply to 55319)

Tim: 10s after 1st tx on chain

Rich: I used multiple UIs and they all took over 1minute though (reply to 55321)

Rich: Can you recommend a good dex that can do it in 10s

Tim: Because they all wait for all steps currently and block times vary

User<6475523950>: Hi Tim @TrueCarry   Hi, any difference from liteservers, I usually got error with message "tonlibjson did not respond" when call to same liteservers at the same time. I'm using TonlibClient from pytonlib package? Sometimes it works, sometimes not

kevin: I saw single swap take more then 5m

Rich: Are there any that don't? (reply to 55325)

Dylan: https://docs.ton.org/develop/blockchain/shards  https://docs.ton.org/develop/blockchain/sharding-lifecycle (reply to 55317)

Tim: Entire chain takes around 1 minute, but you know swap result after first 3-4 tranaactions. (reply to 55323)

Tim: No, but I think evryone will (reply to 55328)

Rich: OK so in near future it'll appear in like 10s? (reply to 55331)

Rich: Just want to make sure this info is correct

Dylan: nah. im just some guy who read the docs.

Tim: Maybe not so near, can’t give you predictions.  I’m not part of ton core. I made ton.diamonds/dex/swap (reply to 55332)

Rich: Damn. Hmm. Do you agree with alazy that more work chains could fix this? (reply to 55339)

Tim: No (reply to 55340)

Tim: More shards can only make it slower, but with ton architecture you need more than 256 shard for that

Rich: Thanks! That's a shame it won't get solved. Will be bad if users need to wait 2m for a tx but on SOL and ETH L2s it's instant right?

Tim: Ton is optimized for global throughput

Tim: You can have l2 on ton too

Rich: That's probably ages away (reply to 55345)

Tim: Well you can’t have something like dydx on l1

Dylan: wouldnt the seperate workchains be able to maintain more throughput of messages as it scales up? am curious why you say it would slow things down? am i misunderstanding that it would be similar to offloading processes to another thread?

Rich: Yeah. Damn. I'm thinking about a shitcoin ecosystem on TON like on SOL. You can't rlly have that either. Will be annoying for ppl to wait so long. (reply to 55349)

Tim: You misunderstand total network transactions per second and time to execute 10 transactions in one chain between shards (reply to 55350)

&rey: Are instaswaps really required for users? I had opinion that they are needed for arbitrage... (reply to 55315)

Rich: Every other chain has instant swaps. It's so nice and clean. Waiting minute+ is just annoying compared to other chains. (reply to 55353)

Rich: Same for other types of dapps. If I make a social media app, will my users need to wait 1m for a message they send to get recorded cause the tx is complex?

Tim: It depends on length (reply to 55355)

Rich: Hmm that's kinda worrying. (reply to 55356)

Tim: Messages within same shard are executed in the same block if size allows. But if you send message to address in different shard - it’s only executed in next block of that shard. So around 4-6 seconds per message worst case

Codex: The other issue is all the RPCs are like 5-12 seconds behind the latest block

Hanniba1111: Hi guys. Can I use the Nextjs to develope Telegram Mini App? I heard my friend that TG doesnt support server renderring.

Tim: They’re not behind latest block. It’s the time between last known block and current ts. (reply to 55360)

Tim: So it’s more like 0-6 seconds to latest block

Z: hi, there, how to switch to 'testnet' in Telegram Wallet Ton Space?

Z: I know how to do this in TonKeeper or TonHub

User<6930831321>: Hi all, if anyone WEB3 need a developer on the project or in the long write in lis.

Roman: I made Telegram Mini App with SvelteKit and had no problems with ssr. And I tried to run simple NextJS as a web app in Telegram and no problems with that too. (reply to 55361)

Z: Telegram’s built-in wallet  TON Space, is there a way to switch to the testnet? I know that 3rd party wallet apps such as TonKeeper or TonHub are available.  Even if I import the wallet address of the testnet opened in TonKeeper into TON Space, the test ton balance cannot be displayed, let alone send transactions to other test wallets.  So, I would like to ask if there is a way to switch Wallet TON Space to the test network. It seems that this instruction is not found in the official documentation.

Justyna: 🔷

&rey: Probably no way to do so. (reply to 55367)

Z: got it! thx 4 rep.

Meloo: Why did you set up a honey pot? Do scammers lack enough tools to steal people's money? Why aren't liquidity pools labeled? Are you sick?

lafi: Huh (reply to 55382)

Meloo: What the fuck is it!?

Meloo: buy*

I'm: Hi bro. How can I check the Ton address is valid? Please help me. I use tonweb but it is not provide the function for check it.

Behrang: AFAIK Ton Space does not support testnet. (reply to 55376)

Codex: Have a look at the stats for Indexing latency (reply to 55364)

Codex: https:// tonstat. us/public-dashboards/04eb126a8c014cf586006ed06044e93f?orgId=1&refresh=5m

Codex: The dashboard has all the popular RPC endpoint metrics

Meloo: Many people will lose their money due to your innovations. You've given thieves a brilliant tool.

&rey: Who are you talking at? (reply to 55398)

&rey: try parsing, catch error... (reply to 55388)

Meloo: hmm. IDK. Can You tell me what is this?

&rey: The Open Network it is, anyone can deploy their own smart contracts, and therefore anyone can write jettons so that buyers cannot send jettons anywhere further. (reply to 55402)

&rey: There is not much meaning in swearing here; perhaps only to warn community of such things existing, but not in tone you have chosen.

MitroMitro: Hi all, I have a question regarding the implementation of Highload v3 (please bear in mind I am a user rather than dev)  With this update, is this only applicable to CEXs or will it also substantially improve the speed of DEX txs where we will start to see the true TPS potential of TON? Thank you for your time in advance.

TON Bounty Bridge: ​Update TON Documentation in connection with Commission Fee Changes  Summary:Update the existing documentation in docs.ton.org in commission fees based on theconfiguration updat...  Rewards: • SBT Bounty Reward • TBD USD in TON equivalent  Created by reveloper

Justyna: 🔥

musashi: hey guys, how to handle the exit code 9?

musashi: I got this exit code when deploying subcontract from master contract

musashi: here is all data of the sub contract

musashi: global slice owner_address;    global slice master_address;     global int number_users;              global int number_ton;     global int number_jettons;         global cell sub_contract_code;          global cell my_dict;

&rey: How do you fill StateInit of subcontract? (reply to 55419)

musashi: I need to make the total bits count divisible by 8? (reply to 55423)

&rey: Why? No, I'm just asking to see the code. (reply to 55424)

musashi: set_data(         begin_cell()             .store_slice(owner_address)             .store_slice(master_address)             .store_uint( number_users, 16)             .store_coins( number_ton)             .store_coins( number_jettons)             .store_ref(sub_contract_code)             .store_dict(my_dict)         .end_cell()     ); (reply to 55425)

musashi: here is my save_data()

&rey: And how do you create StateInit for subcontract deploy? (reply to 55426)

musashi: pls wait

musashi: cell pack_data(int number_users, int number_ton, int number_jettons, slice owner_address, slice master_address, cell sub_contract_code) inline {     return  begin_cell()             .store_slice(owner_address)             .store_slice(master_address)             .store_uint(number_users, 16)             .store_coins(number_ton)             .store_coins(number_jettons)             .store_ref(sub_contract_code)            .end_cell(); }  cell calculate_state_init(slice owner_address, slice master_address, cell sub_contract_code) inline {     return begin_cell()           .store_uint(0, 2)           .store_dict(sub_contract_code)           .store_dict(pack_data(0, 0, 0, owner_address, master_address, sub_contract_code))           .store_uint(0, 1)          .end_cell(); }

musashi: pls check sir

&rey: You're missing one zero bit in pack_data. (reply to 55432)

&rey: That would stand for empty my_dict.

musashi: how can I add that bit, pls tell

&rey: .store_uint(0, 1) before .end_cell(). (reply to 55436)

musashi: appreciate that sir

musashi: cell pack_data(int number_users, int number_ton, int number_jettons, slice owner_address, slice master_address, cell sub_contract_code) inline {     return  begin_cell()             .store_slice(owner_address)             .store_slice(master_address)             .store_uint(number_users, 16)             .store_coins(number_ton)             .store_coins(number_jettons)             .store_ref(sub_contract_code)             .store_uint(0, 1)            .end_cell(); }

musashi: thanks sir

musashi: this is the api of which node package sir? (reply to 55181)

&rey: @ton/ton. (reply to 55442)

User<6995531243>: Who needs a senior frontend and smart contract engineer specialized with FunC?

Ton: hello, anyone can teach me that how can I use send_raw_message to initialize a contract?

Ton: what should I fill for these two ?

Hanniba1111: thx a lot, bro! (reply to 55375)

Erik🆓: The simplest example (copied from tondev) does not work: import { Address } from 'ton'; const address = Address.parse('kQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi47nL'); console.log(address.toFriendly()); // Address itself

Амир: Can someone explain or share recourse how to serialize nft item content for minting?

K.: import { Address } from '@ton/ton'; const address = Address.parse('kQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi47nL'); console.log(address.toString());   toFriendly() does not exist on the newest version of the package. (reply to 55452)

Nothing Ⓜ️ MEMES: Hello guys, do you know of an easy-to-implement third-party API provider that allows you to interact with the TON blockchain?

K.: TonAccess is great: https://www.orbs.com/ton-access/ (reply to 55458)

Nothing Ⓜ️ MEMES: Thank you 😁 (reply to 55459)

Boris: Can you explain the difference between v2 / v4? (reply to 55459)

Erik🆓: tonviewer.com claims that EQD7WyjhkFk1SZ9oeOXo881FN3-OiBvOhHxKzpG0tbCUwA3d is a nft_sale_getgems_v3 contract.   How can I find out that myself in javascript, and also which NFT it is about (and maybe even the sale price)?  I have the code and data of the contract from the toncenter API (maybe it helps somehow).

Nothing Ⓜ️ MEMES: Thanks, but the site won't load (reply to 55459)

K.: Those are versions of the APIs. They are coming from different developers, so they differ. But it's also relevant because they use a different version of TonClient (`TonClient` or `TonClient4`). They have different methods, so keep in mind which one you are using. (reply to 55462)

Boris: Because those contracts do follow a standard, you find those in ton-blockchain repos chechout the „get mothods“ (reply to 55464)

Boris: Thats my point, I‘ve checked both, but still unclear which to use. (reply to 55466)

K.: I suppose it depends on which provider you want to use 🤷‍♂️. (reply to 55468)

Boris: Also some indexers are giving you this information as well, like dton (reply to 55464)

Boris: Ok, you mean under the hood orbs is using toncenter or tonhub, and I should decide (reply to 55469)

&rey: No, it's just about which interface it provides. (reply to 55471)

Erik🆓: Which indexers would that be? I did not find it at toncenter.com or tonapi.io. (reply to 55470)

K.: But why does it then explicitely link to toncenter for v2 and tonhub api for v4? That would mean that they use those, right? (reply to 55472)

Boris: I would prefer a defacto standard (reply to 55472)

&rey: TonCenter v2 is commonly used. (reply to 55475)

&rey: It explicitly links to documentation, does not it? (reply to 55474)

Boris: Dton for example (reply to 55473)

Ton: hello, anyone can help me ? I don't know why it's a deploying message?

Ton: could you pls help me ? (reply to 55476)

Ton: why ? .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)             .store_ref(state_init)             .store_ref(initRef);

&rey: What would you expect, instead? (reply to 55482)

Ton: I want to use my nft collection to mint a nft

Ton: how to initialize my nft contract?

Boris: Checkout the send_raw_message section in the docs (reply to 55482)

Ton: Yes. I checked many times

Ton: I don't know how to use the init-filed flag and inplace message body flag

Boris: All is explained there

Ton: I did not find any documents about these two flags

Boris: which?

Boris: init / inline ref?

Ton: the last two uint

Ton: init-field flag and inplace message body flag

Boris: Init should be used to init the contract and inplace parses a ref body

Nxrix: Is there api for getting all transactions for a wallet? I need just the amount of ton added or moved

Ton: so where should i put my init state? (reply to 55496)

Ton: if I want to store more things besides init state, can I add one more ref?

&rey: This is correct. (reply to 55479)

Ton: so why it's 4 + 2 + 1.

Ton: what's the last "1" stand for?

Ton: normally we write .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)  however in this code  .store_uint(4 + 2 + 0, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)

Ton: .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)

Ton: why there is one more parameter?

Boris: its the last either bit (reply to 55509)

マムル: Hi Guys! Hope you're all doing well! I have only one question - is there any way to get react-router-dom work in TMA?

Ton: you mean this one? (reply to 55511)

Erik🆓: Thanks, I suppose that I should start like this: const cell = Cell.fromBase64('te6cckEBAgEAuwAB27JtTghACanLgK370WYvUQh2bXM1WsLAMwT9odJaR5Zw40781ys4AC1zJWBMiPfjGrEyQ0L+UKM/kLvlpgpF/dyDyk9zqpwfADzGLlQL6JhJK82Gz3vKluNEWF27xPWInVeLDklXibgiFPmYLeABAQCPgBNTlwFb96LMXqIQ7NrmarWFgGYJ+0OktI8s4cad+a5WaAvrwgEAJqcuArfvRZi9RCHZtczVawsAzBP2h0lpHlnDjTvzXKzCTdEMFg==')  It gives this: x{B26D4E084009A9CB80ADFBD1662F5108766D73355AC2C03304FDA1D25A479670E34EFCD72B38002D7325604C88F7E31AB1324342FE50A33F90BBE5A60A45FDDC83CA4F73AA9C1F003CC62E540BE898492BCD86CF7BCA96E344585DBBC4F5889D578B0E495789B82214F9982DE001_}  x{80135397015BF7A2CC5EA210ECDAE66AB585806609FB43A4B48F2CE1C69DF9AE56680BEBC2010026A72E02B7EF4598BD4421D9B5CCD56B0B00CC13F68749691E59C38D3BF35CACC2_} (reply to 55467)

Boris: you can try to call the get methods, but you can also just rely on third-party apis (reply to 55517)

Erik🆓: I could not find out which query to use with dton, so I thought that I should try to read the data instead. I think that I found which data is there and in what order: https://github.com/getgems-io/nft-contracts/blob/b02c9d0da95803850a00e2c09ed5811381800f5e/packages/contracts/sources/nft-fixprice-sale-v3.fc#L31:  begin_cell()             .store_uint(is_complete, 1)             .store_uint(created_at, 32)             .store_slice(marketplace_address)             .store_slice(nft_address)             .store_slice(nft_owner_address)             .store_coins(full_price)             .store_ref(fees_cell)             .store_uint(0, 1) ;; can_deploy_by_external             .end_cell() (reply to 55518)

Erik🆓: Wonder why there are two things with x{...} there. Could it be that one of them is the fees_cell that is referenced? (reply to 55519)

Boris: yes, exactly (reply to 55520)

Boris: don’t know the exact query, but I think it should be possible (reply to 55519)

Boris: you can’t rely on that, because the inner state can be different, the actual standard describes only the interface (reply to 55519)

Ton: It's quite wired that I can pass test like this. But once I want to restore sth in initRef, it's wrong  cell initRef = begin_cell()                 ;; .store_uint(valid_time,32)                   ;; .store_ref(nft_content)                 .end_cell();      var msg = begin_cell()             .store_uint(0x18, 6)             .store_slice(nft_address)             .store_coins(amount)             .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)             .store_ref(state_init)             .store_ref(initRef)             .end_cell();

Ton: any suggestions?

Erik🆓: You mean something with byte order? (reply to 55523)

Boris: as a dev, you can store any information you want in the contract in the order you want, as long as your interface matches the standard, it will be matched to a type like nft/collection etc. (reply to 55526)

lafi: 😑 (reply to 55524)

Erik🆓: How to put the code and data from a contract into a virtual machine and call the get method? (reply to 55527)

Boris: checkout blueprint & sandbox (reply to 55529)

Амир: Everyone has "overloaded network" on testnet now?

Deniel: Unfortunately yes (reply to 55533)

musashi: I have this get method to return the dictionary, how should I use loadDirectDict to read my_dict, still not find out the way  (int, int, int, cell) get_all_data() method_id {     load_data();     return (         number_users,         number_ton,         number_jetton,         my_dict     ); }

Амир: Have someone deployed their test or real nft? Can you share how have you minted nft items? In particular, I mean serialization step

musashi: here is what I got using console.log   my_dict:  x{81B001}  x{BF7F926822B116DF18422664E2CC7E0F83916384F10CFF020DDBA1902DD76322EC00000000000000017FB16D83BE0001_}  x{BF63E118DDB37A827C49532EB855306B2FE85994781A1803246BFB6882A57367920000000000000000BFD8B6C1DF0001_} (reply to 55536)

Erik🆓: At https://github.com/ton-community/ton-contract-executor there is an example that seems to do what I want:  Here is an example of creating a local copy of existing wallet smart contract from the network deployed at EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t address and getting its seq:  import {Address, Cell, TonClient} from "@ton/core"; import {SmartContract} from "ton-contract-executor";  const contractAddress = Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t')  let client = new TonClient({     endpoint: 'https://toncenter.com/api/v2/jsonRPC' })  async function main() {     let state = await client.getContractState(contractAddress)      let code = Cell.fromBoc(state.code!)[0]     let data = Cell.fromBoc(state.data!)[0]      let wallet = await SmartContract.fromCell(code, data)      let res = await wallet.invokeGetMethod('seqno', [])     console.log('Wallet seq is: ', res.result[0]) } (reply to 55530)

.: hey guy some link are not opening on the dev webpage especially those that end with .tg

Erik🆓: Unfortunately, it does not seem to work. TonClient does not seem to exist in @ton/core and I can not find any documentation about getContractState.  Are those exclamation signs valid syntax???  Is it possible to use Cell.fromBase64 instead of Cell.fromBoc?

.: can anyone help, i want to read about token creation (reply to 55544)

musashi: please help sir @pcrafter (reply to 55540)

Erik🆓: It may work after removing the exclammation signs, changing @ton/core to @ton/ton and adding a call to main(). At least it tells me that wallet seq is 209n. (reply to 55545)

Boris: yeah, unfortunatelly a lot of apis were changed, some examples are not working, can’t say exactly what you have to fix in those. I often look into the actual code and search for the keywords if something is undocumented or so. (I believe the apis will stay more or less stable after merging into the @ton/.. org) (reply to 55545)

N: /

spanish-or-vanish: Hi im sending this and the tx fails is there anything wrong with this?   const body = new Builder()     .storeUint(0xf8a7ea5, 32)     .storeUint(0, 64)     .storeCoins(new Coins(jettonAmount, { decimals: 9 }))     .storeAddress(new Address(toAddress))     .storeAddress(new Address(responseAddress))     .storeUint(0, 1)     .storeCoins(new Coins(0.01, { decimals: 9 }))     .storeUint(0, 1)     .storeUint(0, 32)     .storeRef(comment)     .cell();

Erik🆓: I am slowly getting closer! This code gets some data from a sale contract:  import {Address, Cell, TonClient} from "@ton/ton"; import {SmartContract} from "ton-contract-executor";  const contractAddress = Address.parse('EQD7WyjhkFk1SZ9oeOXo881FN3-OiBvOhHxKzpG0tbCUwA3d')  const client = new TonClient({     endpoint: 'https://toncenter.com/api/v2/jsonRPC' })  const state = await client.getContractState(contractAddress)  const code = Cell.fromBoc(state.code)[0] const data = Cell.fromBoc(state.data)[0]  const contract = await SmartContract.fromCell(code, data)  const res = await contract.invokeGetMethod('get_sale_data', []) console.log(res)  Unfortunately it hangs after printing the output. That obviously needs to be fixed before it can be called by other code. (reply to 55556)

إسماعيل: Developers, is there a way to fetch the price/sale data of NFTs using TONAPI?

&rey: Isn't it some issue with your ts-node or whatever you use for script execution? Also, maybe contract = null; would help. (reply to 55564)

Erik🆓: I execute scripts with node and it usually exits when the script is executed. contract = null does not help. (reply to 55566)

musashi: any hint sir (reply to 55554)

&rey: https://github.com/ton-blockchain/stablecoin-contract/blob/7a22416d4de61336616960473af391713e100d7b/gasUtils.ts#L111 (reply to 55540)

musashi: ur the goat sir

Амир: Someone knows why my image is replaced by this?

Амир: Error: no healthy nodes for v4-testnet

lafi: Remix has an Ai 🤖 that can actually help you solve errors wow

User<6930831321>: Hi all, if anyone WEB3 need a developer on the project or in the long write in lis.

Амир: I have copilot (reply to 55579)

lafi: Dose it work to (reply to 55581)

K.: Seems to be automatic if you didn't provide a valid image in metadata. At least with Jettons it works that way. (reply to 55574)

Амир: That's true. Already fixed that (reply to 55585)

Boris: И кто этот админ, с какого хрена?

Tommy: Hey, does anyone know how to detect the new honeypot contracts? These are some samples  EQAZYYxfwXPua6mYEGbeXMv1BjyjqAhacZ2Ga7MAcDgyDfmt  EQByzwHXJz608sEWgJjtGEb8dp44GY38mXY8uYfkj51b5Brz  EQDqXZTlY0to30BNxUa4Y83lhVr4Iy4qAUD_Q7PmQv7n901r

Амир: Скажи спасибо что не кикнули как меня ( (reply to 55597)

Kelzworld🐾: Ok i will break it in different steps. You guys can make your suggestions and contributions. (reply to 55223)

Kelzworld🐾: 1.An app just like tiktok used for sharing videos can have a token used to reward users watching and users reading the AI automatic  blog generated posts.

Kelzworld🐾: 2. This feature - AI automatic  blog  generated posts. Converts the videos or trending videos on the app to ai blog posts with the image details converted from the videos . whether in the blog post or the  descrption space for the video being created ( explaining what the video is all about. The app will have a feature like written notes content or video content .

Kelzworld🐾: 3. Só you can choose any one you like and do but remember that the  ai will automatically turn the content to blog post.

Bahador: Hi Does anybody knows why docs.ton does not load? Where to access docs then?!

Kelzworld🐾: 3. For readers. You can use vídeo editor apps to create your contents and upload it on the socialfi on Ton network.  You can follow someone, like , download and share . You can comment and also chat someone that you follow.

Mic: Good night, everyone. Please tell me, approximately at what cost does the deployment of a smart contract for a TONE come out?

Kelzworld🐾: 5. There is also privacy feature off comments, Duet. It will have filter features. Etc.

Kelzworld🐾: I don't know but you can browse it. (reply to 55612)

Kelzworld🐾: Converts the videos or trending videos on the app to ai blog posts with the image details converted from the videos . Só ppl can watch trending videos or read the blog posts. There will also be grammar notice error keyboard built in the app. And there would also be a language translator feature that helps to translate the description and videos to your specific language you want. whether in the blog post or the  descrption space for the video being created ( explaining what the video is all about. The app will have a feature like written notes content or video content.

Kelzworld🐾: This is the SocialFi app idea. I know it will really make input in the TON development.

Kelzworld🐾: Anyone can make contribution or suggestion . If you guys choose or like the app idea. And you guys want to implement it. You can add me up as one of your teammates ( idea research officer.) Thank you.

Tommy: Simple ca for a jetton? (reply to 55612)

Svαtoωλ‎: any alternatives to get current token price, not from geckoterminal?

Mike Row Soft: what's myAppExplorerService? how to get sent transaction status?  try {     const result = await connector.sendTransaction(transaction);          // you can use signed boc to find the transaction      const someTxData = await myAppExplorerService.getTransaction(result.boc);     alert('Transaction was sent successfully', someTxData); } catch (e) {     if (e instanceof UserRejectedError) {         alert('You rejected the transaction. Please confirm it to send to the blockchain');     } else {         alert('Unknown error happened', e);     } }

User<6452070203>: why i receive jettons in my smart contract, tact?

— 2024-04-29 —

Амир: why not (reply to 55624)

User<6452070203>: oh, how*

User<6452070203>: receive(msg: TransferNotification) {         send(SendParameters{             to: sender(),             value: msg.forward_ton_amount,             mode: SendPayGasSeparately,              body: TransferNotification {                 query_id: msg.query_id,                 amount: msg.amount,                 sender: msg.from,                 forward_payload: msg.forward_payload             }         });     } ?

User<6452070203>: and how i send for test usdt jettons use it?  export async function run(provider: NetworkProvider) {     // BigInt(Math.floor(Math.random() * 1000))     const weeds = provider.open(await Weeds.fromInit());      await weeds.send(         provider.sender(),         {             value: toNano('0.1'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );      await provider.waitForDeploy(weeds.address);  }

Lord: Hi @delovoyslava  I sent you a dm  If you wouldn’t mind checking it out I do hope you don’t mind

Z: Hello everyone, is the testnet often unstable? I frequently encounter the 300 error code ('Wallet declined the request') when I send transactions on testnet. This probably won’t appear on the main net, right?

Z: yep, I got the same issue: it usually  takes 30 - 50 seconds to confirm a transaction (reply to 55632)

Z: but it currently send transaction on Testnet, Does the main net would improve this?

Jesse: hi, is bip39 seed not compatible with toncoin?

pony: yes (reply to 55640)

Jesse: thank you

pony: How can i estimateFee    '@type': 'query.fees',   source_fees: {     '@type': 'fees',     in_fwd_fee: 606400,     storage_fee: 0,     gas_fee: 40000,     fwd_fee: 0   } }  i used estimateFee interface. got reponse like this. but not equal real transaction fee.

&rey: You already asked this before, haven't you? (reply to 55632)

Z: what's the sanswer? i would like to know,thank you 😊 (reply to 55644)

Z: I faced the same issue

&rey: Each transaction time-to-finality is 6s = one block. Each swap consists of several atomic transactions, and in worst cases is bound to take at least 6-7 blocks. However, after 4 blocks (20-25s) it can be guaranteed to complete successfully. (reply to 55645)

&rey: This waiting time is improved if you have a wallet in same shardchain as your jetton wallet, or when jetton wallet is in same shard with DEX.

Z: emmm. good to know! thx. Is the main net would be better?

&rey: Some SDK which allows you to wait for transaction appearing by its BOC. (reply to 55622)

Z: I am the new guy  for Ton stuff ...

&rey: The reason for this is TON architecture, not testnet-mainnet distinction. (reply to 55650)

Z: ok, understood! thanks

Z: is the testnet often unstable? I frequently encounter the 300 error code ('Wallet declined the request') when I send transactions on testnet. This probably won’t appear on the main net, right?

Z: what about this?

&rey: Tx times will not "be better", though I still cannot understand why so many users need instant swaps. (reply to 55654)

&rey: That's a recent thing, but yes, it is unstable. (reply to 55655)

Z: thx for your kindy rep. ❤️

&rey: There is plan to keep tx times in place even despite possible increase in shardchains number. (reply to 55668)

Aziz: Hello! How can I do % of sale like in TON cookbook const royaltyCell = beginCell()         .storeUint(5, 16) // factor         .storeUint(100, 16) // base         .storeAddress(royaltyAddress) // this address will receive 5% of each sale         .endCell();  But instead of using TON cookbook I'm running DEX swap operations  beginCell()                     .storeUint(0, 32)                     .storeAddress(null) // reciever                      .storeAddress(referallAddress) // referall                     .storeMaybeRef(undefined) // deployed                     .storeMaybeRef(undefined) // undeployed                     .endCell()             )  I didn't get well with that because getting problems with transferring this % to referralWallet Is there any solution to get % of any sale whenever it's DEX swap? Thank you!

Whenwin: i want to build a #nftproject and now i looking a support and also a mentor..

Bollus: Hey everyone.  If I have a project and I want to take advantage of incubation partnership, how do I go about it?

Vladimir: https://ton.org/ru/grants (reply to 55688)

Bollus: Thanks (reply to 55689)

punkd.base.eth: Hello! I am looking for someone who can mint NFTs on the TON chain

punkd.base.eth: A set if NFT designs

&rey: You don't know if token transfer is to DEX. (reply to 55681)

Aziz: Yeah. So only dex can give % from swaps? Like StonFi (reply to 55697)

wikig: Hello guys , this is a example of transfering USDT to other account . https://tonviewer.com/transaction/88a6b1072d83e545fd62d56ad4d66f5a590699635df36ca64b086c5207fd2281  And when i get the out_msgs, i got  {   msg_type: 'int_msg',   created_lt: 46179108000002,   ihr_disabled: true,   bounce: false,   bounced: false,   value: 50000000,   fwd_fee: 470404,   ihr_fee: 0,   destination: {     address: '0:5c81af59f55456f50755c2f361511b6e1d93d385b7ca6eade3f95664c05d92c5',     is_scam: false,     is_wallet: false   },   source: {     address: '0:08f5a724fa66cd330da8404ba207af3df5967581d0c06575b3bffa08cff37b8f',     is_scam: false,     is_wallet: true   },   import_fee: 0,   created_at: 1714376229,   op_code: '0x0f8a7ea5',   raw_body: 'b5ee9c720101010100550000a60f8a7ea50000018f28c8e45730f424080034727969b1101f1cfd1f6f65902e5903546b3dd65c3d8cf8ea610709187a9c3700023d69c93e99b34cc36a1012e881ebcf7d659d607430195d6ceffe8233fcdee3c0',   decoded_op_name: 'jetton_transfer',   decoded_body: {     query_id: 1714376205399,     amount: '1000000',     destination: '0:1a393cb4d8880f8e7e8fb7b2c8172c81aa359eeb2e1ec67c753083848c3d4e1b',     response_destination: '0:08f5a724fa66cd330da8404ba207af3df5967581d0c06575b3bffa08cff37b8f',     custom_payload: null,     forward_ton_amount: '0',     forward_payload: { is_right: false, value: {} }   } }   I can get the amount / source / destination ......   But how can i know which jetton i transfer ?   Do i need to send a request to the destination to ask for what jetton it is ?

Tumin | Wagmi11: were you able to solve this? (reply to 24824)

Tumin | Wagmi11: do you know why? (reply to 38999)

Elizabeth: No (reply to 55718)

musashi: hey guys, can I create MEV bots on Ton?

wikig: Same asking (reply to 55723)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 57 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 33  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Ke: hi guys, the (~ is_initialized) is true or false? I feel confused  var is_initialized = nft_owner_address.slice_bits() > 2;  if (~ is_initialized) {} else {}

Lamborghini: Hello,  can anyone please help me how to create a wallet from specific derive path? I already ask the question in the github issues. it number is 35. (I tried to send the link but it is failed)

dou | onWealth: Hello, how can I start with TON using JS to develop BOT/Web App please help?

Ume: is there any dex aggregator that on TON? like 1inch?

glant: Hi, does the tonweb demo available? I use it to transfer jetton tokens, the tx is onchain, but the token transfer event is failed, this is the code, can someone help me? const transfer = async () => {         const seqno = (await wallet.methods.seqno().call()) || 0;         console.log({seqno})          console.log(             await wallet.methods.transfer({                 secretKey: keyPair.secretKey,                 toAddress: JETTON_WALLET_ADDRESS,                 amount: TonWeb.utils.toNano('0.05'),                 seqno: seqno,                 payload: await jettonWallet.createTransferBody({                     jettonAmount: TonWeb.utils.toNano('500'),                     toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS),                     forwardAmount: TonWeb.utils.toNano('0.01'),                     forwardPayload: new TextEncoder().encode('gift'),                     responseAddress: walletAddress                 }),                 sendMode: 3,             }).send()         );     }

User<6452070203>: how send jetton on ton/blueprint help please?

Nothing Ⓜ️ MEMES: Have you looked on the TON website, everything is well documented and well explained (reply to 55734)

dou | onWealth: Looked but not understand clearly (reply to 55744)

Ton: body: new CommonMessageInfo({                 body: new CellMessage(msgBody)             })  anyone knows how to code this right now? The CellMessage is deleted

Oleg: Hi. We are going to develop mining pool for some jetton. Should we use liteserver node or we need a validator node? Is stratum protocol implemented on ton?

&rey: It's not native for TON, but you can use any Ed25519-compatible lib to generate key pair. (reply to 55732)

Lamborghini: Bro thank you so much! It is working.  const {WalletContractV4} = require('@ton/ton'); const {keyPairFromSeed} = require('@ton/crypto'); const {mnemonicToSeed} = require('bip39'); const {derivePath} = require('ed25519-hd-key');  const main = async () => {   const seed = await mnemonicToSeed(     'enhance chef explain another extend parade heart total brave escape together hobby',   );   const privateKey = derivePath("m/44'/607'/0'", seed).key;    const keyPair = keyPairFromSeed(Buffer.from(privateKey, 'hex'));    const wallet = WalletContractV4.create({     publicKey: keyPair.publicKey,     workchain: 0,   });   console.log('address', wallet.address); }; main(); (reply to 55751)

Lamborghini: One more questoin. I know that there is no way calculate exact fees for transaction. below i added extra 100 nano ton.   const fees = await tonClient.estimateExternalMessageFee(   wallet.address,   {body: transfer}, ); const sourceFees = fees?.source_fees; const total =   sourceFees.fwd_fee +   sourceFees.in_fwd_fee +   sourceFees.gas_fee +   sourceFees.storage_fee +   100;   So, my questions which is safe extra amount? is 100n is safe? I want zero transactions is fail. So, I added some extra nano-ton.

Zero: How can I sent the entire account's balance to another account using JS?

Zero: Rn I get stuck with the gas fees

&rey: Why do you need it? It's auto-activated on outgoing messages.

&rey: Mode 128, value 0. (reply to 55757)

Crypto-Age: Hi everyone,  I created Tonkeeper wallet and new account.  I sent 1 TON from other wallet on testnet.  I can see the balance on tonscan, but not my wallet.  My wallet is still inactive.  How can I activate my wallet?  Thanks.

Zero: I need to split the TON in an address, send 95% to one wallet, and 5% to another (reply to 55762)

Zero: This sends the entire balance? What's the concept behind it (reply to 55763)

Zero: Like Ton has a built in mode for it?

&rey: The concept is using mode "send remaining balance", yes. (reply to 55767)

Zero: Gotcha

Zero: And for something like this? (reply to 55766)

User<6452070203>: Access to fetch at 'https://bridge.tonapi.io/bridge/message?client_id=418fd3&to=df53ab&ttl=300&topic=sendTransaction' from origin 'https://test.ton-dapp.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled  ton/connect js

&rey: Get balance, send 95% to one address in one transaction and value=0,mode=128 in second. (reply to 55773)

Zero: Oh yeah lol (reply to 55777)

&rey: Fee estimation is not commonly used in TON, though 100n should be sufficient. (reply to 55755)

Orion: Any Creator working on a New Project on TON ecosystem here ?

Nerses: While using blueprint for testing I get out of gas error.What can cause that ?

musashi: hey guys, where can I get toncenter testnet API key, seems like the testnet bot not responding

Muhammad Javad: Hi. Is test net alive?

Arthur: Hello guys

Arthur: Ton is built on which programming language ?

Stuart: Hey. im looking for smart contract and ton developers for a project im working on

Roman: C++ (reply to 55790)

Arthur: Guys (reply to 55790)

Arthur: Thanks Roman (reply to 55793)

Arthur: That is pretty simple

&rey: Your contract running out of message value while computing. (reply to 55786)

Arthur: I am now entering to ton Blockchain

Arthur: Is there anything i need to know as a developer?

&rey: You've probably asked wrong question! (reply to 55799)

Arthur: 😂😂 (reply to 55801)

&rey: Smart contracts are written in FunC. Or in TVM assembly. Or sometimes in Tact, though its gas usage is not the best.

musashi: ton docs =) (reply to 55800)

Arthur: How to properly ask the question sir (reply to 55801)

Nerses: how can I fix that ? (reply to 55798)

&rey: Use less gas. Or send more TON in incoming message. (reply to 55806)

Roman: Take this course: https://stepik.org/course/176754/syllabus (reply to 55800)

&rey: To start, you should know that TON architecture is based on total contracts separation: one cannot access another except by sending a message. (reply to 55805)

Arthur: Thanks  you guys . I really appreciate the support (reply to 55808)

Nerses: I changed sending amount from 0.001 TON to 5 TON.It ended up with exitCode: 0, actionResultCode: 37, and transaction again failed (reply to 55807)

&rey: You're trying to send out more than you have in contract. (reply to 55811)

Nerses: please could you check this code snippet ? As I tried different values but still doesnt work javascript it('should create HTLC', async () => {          const launcher = await blockchain.treasury('launcher');         const receiverTreasury = await blockchain.treasury('receiverTreasury');         const receiver = receiverTreasury.address;           const launchResult = await hashedTimeLockTON.send(             launcher.getSender(),             {                 value: toNano('0.5'),             },             {                             $$type: 'Create',                             data: {                                 __hashlock: hashlock,                                 __timelock: timelock,                                 __chainId: chainId,                                 __amount: toNano('0.5'),                                 __sender: launcher.address,                                 __receiver: receiver,                                 __targetCurrencyReceiverAddress: targetCurrencyReceiverAddress,                                 $$type: 'TonTransferInitiated'                             }                         }         );           expect(launchResult.transactions).toHaveTransaction({             from: launcher.address,             to: hashedTimeLockTON.address,             success: true,         }); }); (reply to 55818)

Zero: the rest 95% does get send with mode 128, but when I try sending the first 5% without mode 128 I get this, (reply to 55777)

Zero: this thing is really dangerous cause it keeps on retrying transaction and depletes the account's balance little by little in gas fees

Slava: Is this a wallet contract? (reply to 55820)

Zero: yes (reply to 55823)

Zero: transactions with mode 128 work fine

Zero: but the ones with no mode don't

Slava: Maybe you should better create a special contract to split the incoming payments on-chain?

&rey: How are you sending them? (reply to 55826)

&rey: Also, are you sending messages in correct order?

Âmin: hi

Âmin: i am trying to use toncenter to get transactions to a wallet but it just return ok when i have transaction

Âmin: https://toncenter.com/api/v2/getTransactions?address=UQDa7CLuQ1ZjHi6_kUOD4W5RmSk7LqYyXAhnflM577Nj59Yi&limit=10&to_lt=0&archival=false  my request (reply to 55831)

Âmin: response (reply to 55832)

Slava: It's an empty response. You contract is not deployed. (reply to 55832)

Âmin: i have transaction on wallet (reply to 55834)

musashi: can u help? (reply to 55787)

musashi: still not find the way to get the key

Âmin: so how should i fix it? (reply to 55834)

Gyorgy: tonapibot the one. It should work. (reply to 55837)

musashi: so the mainnet api key works with testnet api? (reply to 55839)

Gyorgy: Create testnet key (reply to 55840)

Slava: Try deploying the contract first, or use the sender's address to detect outgoing messages. (reply to 55838)

Âmin: how should i deploy the contract? (reply to 55842)

Gyorgy: Might share something from your code what you are trying to do. Hard to help by answering generic questions (reply to 55838)

Slava: If this is a wallet contract and you are using a wallet software, just send some amount of coins anywhere. (reply to 55843)

Âmin: ok thanks ❤️ (reply to 55845)

spanish-or-vanish: looking for ton smartcontract dev

Slava: Be advised though, that Jetton notifications are not guaranteed to be sent to your wallet address. So you can get incoming Jetton transfer without any messages sent to your main wallet. (reply to 55846)

Zero: yeah that's what am doing (reply to 55829)

Âmin: opps so what should i do?  i want to check the incoming jettons to a wallet (reply to 55848)

TON Bounty Bridge: ​Comprehensive TonSdk.NET Documentation  🏷 Education  Summary:Creating detailed documentation for the use of TonSdk.NET based on previous bounty tasks along with ...  Created by purpleguy99

Slava: You can monitor transactions on your jetton wallet instead. (reply to 55853)

fade: Has anyone successfully used tonapi.io/v2/liteserver/send_message to send raw boc messages? It doesn't accept the post data in any format, probably because a bug in opentonapi, I have submitted a pull request to fix it. Just wanted to make sure it was really a bug from their side and not me not knowing how to use the api

Santokh: In the Account schema, what does storageLastTransactionLt mean?

Santokh: You can find out Account schema from https://tonapi.io/v2/graphql/playground

4b47: Hey guys, got a question. Ive started to use ton-connect with react, and cant find any example of getting user balance.

4b47: I mean any token balance of given address

Heydar: https://t.me/tondev_eng/54735 (reply to 55890)

Mike Row Soft: does anyone know the telegram mini app demo which allows you to buy burgers / menu app?

4b47: oh, and if i want to just read balance on the mainnet for given address, not the contract? (reply to 54735)

4b47: for example i got some user address, connected already, and want to read how many ton he has on mainnet

4b47: just that simple case

4b47: not interacting with any particular smart contract

Santokh: https://tonapi.io/v2/graphql/playground From tonapi graphql playground, what does storageLastTransactionLt in Account schema mean?

Mohammad: How do I send external messages to my contract and be sure that the message comes from a trusted source?

Pavel: How to convert Address to String?

Mohammad: Return the address itself and do the manipulation on the other side (reply to 55904)

Santokh: Hello sir, can you help me to answer my question above? (reply to 55906)

Mohammad: This is related to tonapi I think you can get help from their tech channel https://t.me/tonapitech (reply to 55907)

User<7121766667>: Hello, how can I get transactions from mempool?

Артур: Hi guys! Is there any option to connect to the TON network except orbs and toncenter? Can I run my own RPC server? Is there any tutorials about this topic?

Ruslan: Hi, you can run your own instance of toncenter from here: https://github.com/toncenter/ton-http-api (reply to 55910)

Ruslan: And if you need api/v3, then check https://github.com/toncenter/ton-indexer

Артур: thank you! (reply to 55915)

Âmin: hi  can any one guide me how to transfer jettons to another wallet? on python

Ruslan: Also there are apis: tonapi.io, dton.io and tonhub api (reply to 55910)

&rey: Yes. Please refer to docs.ton.org, SDK list. (reply to 55910)

&rey: There is relevant documentation. Please refer to docs.ton.org, TON Cookbook. (reply to 55917)

&rey: From tonapi. (reply to 55909)

&rey: This is same. Only contracts in TON have addresses; in particular, wallets are smart contracts. (reply to 55897)

&rey: TON Connect 2, actually, is write-only so you need an additional service to obtain blockchain state.

Âmin: thanks (reply to 55920)

4b47: oh okay. can you then send me some basic code snippet best practice or link of getting that balance and read functions? (reply to 55923)

ℝ𝕒𝕤 𝕁𝕦𝕟𝕘𝕝𝕖 🦆⃤💹 🧲: Hey can anyone make nft vérification bot that allows people in à group if they hold the nft and kick them if they dont have it anymore

User<6779439263>: hi, does anyone need a dev?

User<6861867033>: Hello everyone The https://tonight.dev is not working? I'm new to FunC and want a complete tutorial Anyone PLZ halp me 🙏🙏🙏

Behrang: It's similar. TonConnect gives you the address of user's wallet. Each wallet is also a smart contract. Read the balance of that smart contract. You can use TonAccess or other RPC services. (reply to 55897)

4b47: okay, is there any like api or method list i can call on wallet address sc? (reply to 55939)

Behrang: This is an example of reading user's balance, but it's inside a complicated part of some code:  https://github.com/HipoFinance/webapp/blob/da6b3aeff2bb98e20eec4b1ce93d3e1830271f97/src/Model.ts#L682 (reply to 55940)

Ma><im: hello everyone!  is there any way to parse address transactions when working with jettons?   the main thing is to understand how much TON this address bought and how much sold

Mic: /stat@combot

Mic: Tell me what could be the problem?

Амир: Does it begin with 32 bit zero? (reply to 55959)

User<6861867033>: How can i get into the testnet feature in mobile tonkeeper? After upgrade there's no testnet feature on tonkeeper.

temakich: Go into the settings. Tap the tonkeeper logo at the bottom a few times. Turn on DEV mode. Re-enter the application.  Now you can create a new wallet in testnet, in the add or create wallets menu. (reply to 55979)

— 2024-04-30 —

musashi: hey guys, is the TonTracker bot open source?

Justyna: MyTonWallet <> Early  TL;DR: Join the MyTonWallet <> Early campaign to get a slice of the 3 million $MY prize pool.   The first campaign on Early, a Web3 growth hacking platform on TON, is here! In collaboration with Early, MyTonWallet, a self-custodial and open-source TON wallet, has launched the MyTonWallet <> Early campaign, offering up to 3 million $MY in rewards.   What are $MY tokens?  $MY tokens unlock premium features across all MyTonWallet services, including access to new functions, better exchange rates, and higher staking rewards.  How to earn?  Earn points by completing tasks such as installing MyTonWallet, inviting friends, purchasing TON, and more. The more points you collect, the bigger the rewards.  Campaign deadline: May 6, 2024, 12:00 UTC.  For more details, check out this blog post.  Join MyTonWallet <> Early and earn your share of the rewards! (forwarded from TON Community)

User<6861867033>: Hello everyone The https://tonight.dev is not working? I'm new to FunC and want a complete tutorial Anyone PLZ halp me 🙏🙏🙏

Jeremy: Is there any tool in FunC that can generate a method class for frontend calls? Writing it by hand is just too inefficient.

kevin: Getting remaining balance is easy, but if really want parse each trade details, have to understand how each dex works and parse accordingly. (reply to 55944)

wikig: Hello guys , is there possible that User A send a message with inline-button to User B  ?

User<6106615034>: bot

wikig: So , user can't not do this ? (reply to 56014)

wikig: Only bot can send message ?

User<6106615034>: only bot can send message

Ma><im: Do you know which explorers have a good API? (reply to 56009)

Lamborghini: Hello, Sometime i get 500 respose status from below code but transactions is sucessful. I have checked in Testnet. It can be problematic.   const seqno = await walletContract.getSeqno();  const transfer = walletContract.createTransfer({   sendMode: totalAmount.gte(parsedBalance)     ? SendMode.CARRY_ALL_REMAINING_BALANCE     : SendMode.PAY_GAS_SEPARATELY,   secretKey: keyPair.secretKey,   seqno,   messages: [     internal({       to: to,       value: BigInt(convertToSmallAmount(amount, 9)),       body: 'Transfer from Dok Wallet',       bounce: false,     }),   ], }); await walletContract.send(transfer);

Michael: Hello, answers.ton.org this website is not working atm. What's going on? Is domain changed or is under the update?

kpo: Where can I see the penalty history of ton's validators, please?

User<6425982764>: It's necessary to specify addresses of Jetton wallets of the router as the arguments of this method. These addresses can be retrieved with get_wallet_address of the Jetton minter.

User<6425982764>: I have question about get_pool_address on ston fi. which address i should provided?

Bear: sorry, how can I store the data in dictionary when I coding in TS?          ;; get the public key of the current sender, make sure that it's one the validator         (slice public_key, int pubk_found) = validator_list.dict_get?(267, sender);         throw_unless(error::NotValidator, pubk_found);  I  want to deal with this: let validator_list = Dictionary.empty();

Ton: hello guys! how can I set colorsSet to get black background and white text

User<6447148679>: Who need Data Analyst or Moderator?

Alex: Hi, I wrote a question in  dev-chat(RU) and attached a link to the documentation and I was robotically banned, to whom can I write to unbanned back?

Chris ◇: Hey guys, is a tutorial or documentation on how to build a simple Telegram Tap to earn game ?   Appreciated 👏 💐 🥳

Nerses: cant understand why in this code require doesnt work. Any help ?     receive(msg: Create){         require(false == self.contractExists(msg.data.__hashlock),"Contract Already Exists");           require(now() <= msg.data.__timelock,"Not Future Timelock");         require(msg.data.__amount != 0,"Funds Not Sent");           self.contracts.set(msg.data.hashlock,HTLC{hashlock: msg.data.hashlock,                                                     secret: 0x0,                                                     amount: msg.data.__amount,                                                     timelock: msg.data.__timelock,                                                     sender: msg.data.__sender,                                                     _receiver: msg.data.__receiver,                                                     redeemed: false,                                                     refunded: false});                  send(SendParameters{                 to: myAddress(),                 bounce: true,                 value: msg.data.__amount,                 mode: 128         });     }

&rey: In which direction it does not work? (reply to 56044)

Nerses: this line require(now() <= msg.data.__timelock,"Not Future Timelock");   I tried to test passing wrong value but transaction doesnt reverted or any error message doesnt appeared

Nerses: I meant i need this to be true now() <= msg.data.__timelock  in other case get No future timelock (reply to 56045)

fade: did you fix it the way i did? (reply to 53490)

Bobby: yeah

Bobby: change the hardcode part

fade: how about this one? i'm not sure what it does exactly https://github.com/tonkeeper/opentonapi/blob/e91291ce31b541a4da5463668d1c499167a3a458/pkg/rates/sources.go#L95 (reply to 56052)

musashi: can I find out the opcode and the raw message that was sent by another user in a specific transaction?

musashi: the payload was hashed, right?

musashi: if it's possible, how can I do that?

Mic: hello everyone, tell me what the problem is:  import * as dotenv from "dotenv";  import { toNano } from "ton-core"; import { readdir } from "fs/promises";  import { openWallet } from "./utils"; import { waitSeqno } from "./delay"; import { NftCollection } from "./contracts/NftCollection"; import { NftItem } from "./contracts/NftItem"; import { updateMetadataFiles, uploadFolderToIPFS } from "./metadata"; import { GetGemsSaleData, NftSale } from "./contracts/NftSale"; import { NftMarketplace } from "./contracts/NftMarketplace";  dotenv.config();  async function init() {   try {     const metadataFolderPath = "./data/metadata/";     const imagesFolderPath = "./data/images/";      const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);    console.log("Started uploading images to IPFS...");   const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);   console.log(     `Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`   );    console.log("Started uploading metadata files to IPFS...");   await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);   const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);   console.log(    no } from "./delay"; import { NftCollection } from "./contracts/NftCollection"; import { NftItem } fr  );    console.log("Start deploy of nft collection...");   const collectionData = {     ownerAddress: wallet.contract.address,     royaltyPercent: 0.05, // 0.05 = 5%     royaltyAddress: wallet.contract.address,     nextItemIndex: 0,     collectionContentUrl:llection } from "./contracts/NftCollection"; i     commonContentUrl: ipfs://${metadataIpfsHash}/,   };   const collection = new NftCollection(collectionData);   let seqno = await collection.deploy(wallet);   console.log(`Collection deployed: ${collection.address}`);   await waitSeqno(seqno, wallet);    // Deploy nft items   const files = await readdir(metadataFolderPath);   files.pop();   let index = 0;    seqno = await collection.topUpBalance(wallet, files.length);   await waitSeqno(seqno, wallet);   console.log(`Balance top-upped`);    for (const file of files) {     try {       console.log(`Start deploy of ${index + 1} NFT`);     const mintParams = {       queryId: 0,       itemOwnerAddress: wallet.contract.address,       itemIndex: index,       amount: toNano("0.05"),       commonContentUrl: file,     };     const nftItem = new NftItem(collection);     seqno = await nftItem.deploy(wallet, mintParams);     console.log(`Successfully deployed ${index + 1} NFT`);     await waitSeqno(seqno, wallet);     index++;   } catch (error) {     console.error(`Error deploying ${index + 1} NFT:`, error);   } }    console.log("Start deploy of new marketplace  ");   const marketplace = new NftMarketplace(wallet.contract.address);   seqno = await marketplace.deploy(wallet);   await waitSeqno(seqno, wallet);   console.log("Successfully deployed new marketplace");    try {     const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);   const saleData: GetGemsSaleData = {     isComplete: false,     createdAt: Math.ceil(Date.now() / 1000),     marketplaceAddress: marketplace.address,     nftAddress: nftToSaleAddress,     nftOwnerAddress: null,     fullPrice: toNano("10"),     marketplaceFeeAddress: wallet.contract.address,     marketplaceFee: toNano("1"),     royaltyAddress: wallet.contract.address,     royaltyAmount: toNano("0.5"),   };   const nftSaleContract = new NftSale(saleData);   seqno = await nftSaleContract.deploy(wallet);   await waitSeqno(seqno, wallet);  } catch (error) {   console.error('Error setting up NFT for sale:', error); } } catch (error) { console.error('Initialization failed:', error); } }  void init();

Mic: I have a 500 GB Data plan - it's an empty space

Baltaazar: Welcome 🤘

Vladislav: Hello everyone !  I’m looking for developers beginners for not hard but very promising project! Write private messages.

CKEPTIK SHOP: Hello. Ready to work in a small start-up project. Experience : 1 year in TON. I know how to write smart contracts, webapp.

Naved: I am looking for a developer for contract work with experience in writing nft smart contracts, integrating with frontend and understanding of the work of TON.

Luis Daniel ,Ⓜ️ MEMES▪️🐾: When I executed a transfer from tonkpeeper to a smart contract, what did the smart contract receive from the ton network? Is it an internal message? (forwarded from Luis Daniel ,Ⓜ️ MEMES▪️🐾)

Ilham: hello sir i wanna ask something

N - RFNW: I want create token with UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ, how?

Ilham: how to claim airdrop from TONCommunity_bot ?? airdrop 2020 sir

musashi: u mean change the admin to burn address? (reply to 56082)

N - RFNW: yes (reply to 56084)

Kuilash: Consider me, I can help you if you don't mind let's talk in PM (reply to 56076)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Someone knows ? (reply to 56078)

musashi: so call the change admin opcode and pass the burn address to the payload (reply to 56085)

musashi: yes the 'transfer_notification()` opcode if the forward_ton_amount > 0 (reply to 56078)

Behrang: An internal message will be sent from your wallet to the target smart contract. (reply to 56078)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Is this always going to be the structure of the internal messages or is it different?

Me, Myself & I: Hello Did you manage to get around it? (reply to 55622)

Pafos: Hello. How to convert the transaction hash from the toncenetr api to the one shown on tonviewer.com? /Ths1+w9hm9yzx8gaY6bgGWg062SSTnkJCFYB2B+Mgk=  - toncenter  fd386cd7ec3d866f72cf1f20698e9b8065a0d3ad924939e424215807607e3209 - tonviewer

Nerses: is there any implementation of sha256 in type script that works like sha256 in tact. I mean in context of input value types and returning types being same as in tact

musashi: how to count the number of subcontract when we shard the contract like jetton contract architecture

MEW: 👋 how does readForwardFee in tact work?

MEW: how does it compute the result?

Ton: Hello guys. I have a question. How can I verify a transaction that the customer finished in the frontend in the backend? And the service should be given once the transaction is sent or confirmed?

-𝑯𝒆𝒓𝒏𝒊: You should decode it with base64 and then convert the decoded data from binary to hex data (reply to 56103)

&rey: Any base64 to hex conversion way. (reply to 56103)

Bobby: sorry for miss the message (reply to 56053)

Bobby: you just need replace https://tonapi.io using yourself node (reply to 56120)

E: what's the  diffrent between wallet_highload_v2 wallet_v3r2 ?

K.: Highload wallet is a special wallet with functionality to process large number of transactions. It can bundle more messages together than a normal wallet (and more features). The v3r2 is a common/normal wallet suited for an average user. Apart from high load, it for instance cannot send many transactions at once. Only 4 messages in a tx, IIRC.  https://docs.ton.org/participate/wallets/contracts#highload-wallet-v3 (reply to 56124)

fade: yeah but as the comment pointed out, our own nodes aren't capable of getting bemo price (reply to 56121)

K.: Highload wallet is perfect for a CEX, for instance, that needs a wallet to process deposits and withdraws from users.

fade: so it'll keep throwing errors

&rey: Is it a bug? Is it security concern? (reply to 56136)

Aydin: In its full form, yes; however, you can omit some of those arguments being passed to the function. (reply to 56092)

MEW: https://tact-by-example.org/07-jetton-standard

MEW: What is the cost for this step

Tommy: Anyone? (reply to 55598)

Tommy: Honeypot means that one can buy a jetton, but not sell. Not trying to create one, but to add to our scanner, so that it detects it. But don't know what I'm looking for in the contract (reply to 56158)

I'm: Hi bro, How many transfer at once when I use v4r2? (reply to 56125)

123: does anybody know what can i be doing wrong? when the transactions pops-up, it only sends the transaction fee (0.01 ton)

Mau: Poeple we can make good Nft gfx like banner? For cheap price need daily!

Амир: What should it also do? U are sending exactly 0.01 tons (reply to 56168)

123: i was trying to send $RECA, but i didnt understand exactly how to use cells

— 2024-05-01 —

Evgeny: Hi all.  Is it possible through dedust.io API to know if a particular wallet has filled the liquidity pool ? On the example of this pool: https://dedust.io/pools/EQA-X_yo3fzzbDbJ_0bzFWKqtRuZFIRa1sJsveZJ1YpViO3r ?  Or is it easier to do it through a smart contract, if yes, can you please send me an example?

Д: Hey👋  For example I have a v3 wallet and I have a USDT jetton contract that is owned by my v3 wallet. Can I somehow calculate what my jetton address will be? Is it predefined or its created when you first send some jettons like in solana?

Behrang: You can calculate the address before sending a transaction. Jetton masters in jetton standard have a get method for this called get_wallet_address. Call it and send your own wallet address and it will return your jetton wallet address for that jetton master.

Web DUCKS 🐦 SUI 🐾: Ton mask memecoin. Presale price was 0.0000045 TON. Listing Price was 0.0000004 TON . 90% less Then The pre-sale. I just wondering how did They make people fool so easily

SSLCertificates: Raffles charge 10% fee

Web DUCKS 🐦 SUI 🐾: I user invested 2 TON. Receiived 487246 Mask. N the Cost of 487246 mask was 0.35 TON. He invested 2 TON N 0.5 For claim. But I can see only get back 30% amount Of The investment

Web DUCKS 🐦 SUI 🐾: Also one more ongoing swam of NFT golden eggs on the way where they're  trying to Make Money again.

Web DUCKS 🐦 SUI 🐾: I think They are miss using The name of TON to Scam. Like the token name TON Mask Memecoin days why People Invested in The presale.

SSLCertificates: 90% on raffles are scam projects

Web DUCKS 🐦 SUI 🐾: Just wondering  He Only get 25% amount of his investment bro

SSLCertificates: I see many projects owner dump at the beginning

Web DUCKS 🐦 SUI 🐾: Yes but This is a Joke

Web DUCKS 🐦 SUI 🐾: A user Invested 10 TON n receiived tokens worth 1 TON only

Web DUCKS 🐦 SUI 🐾: It's not Dump. It's Totally Scam. 99% amount has been Taken out. Now only Dust left (reply to 56194)

Dmitry | backend4you.ton: Ask something that aligns with chat topic (development) (reply to 56186)

Web DUCKS 🐦 SUI 🐾: I m here just to provide your feedback how conmans are playing with The community.

Web DUCKS 🐦 SUI 🐾: You should Consider This as a Feedback n start working On This .

Web DUCKS 🐦 SUI 🐾: Because if you report this scam that happened to you to DOJ,FTC or any agency. then you are asked whether you have told the people of their project about it? so just wanted to tell u Wass going on

Web DUCKS 🐦 SUI 🐾: I m a ton Liker. I like the project. Like the team. Like everything regarding to TON. I don't like when someone said I got scammed By Investing in that or I lost my money in That. I really feel bad for Them.

Andy: Hi. Is there any app that let's me make custom transactions that I can confirm in my wallet? I could just write code for it, but I'm not familiar with any SDKs yet, so an app like this would be nice.

Solitary Developers: I want TON to be the first cross-chain connection with ID cross-chain validation, it's quite similar to web5. Can someone tell me if it is feasible in development?

Solitary Developers: That means the user will create a unique ID, and connect to any platform and use it to access the unique ID !!!

Solitary Developers: For example: Adam creates CrossID and receives Prikey. But it's quite hard to remember, Adam has a TON wallet address. Adam connects TON and then performs authentication and writes to the CrossID chain. and can then easily connect to related applications such as defi social networks and more.

Solitary Developers: Besides TON, there are also related parties such as Google and Facebook.

Solitary Developers: So Adam can use Privatekey professionally, or without complexity, he can use alternative platforms to manage his unique ID.

Sunny: Hey does anyone know what this issue is?

Sunny: i am trying to send ton using sendTransaction

&rey: A few reads from cell with full message, plus multiplication, so nothing too expensive. (reply to 56152)

&rey: You should locally emulate a send transaction from your wallet, and check if it works. (reply to 56159)

&rey: If so, the jetton is probably not a honeypot, at least for you.

&rey: You can do so automatically, using @ton/sandbox or ton-contract-executor. (reply to 56214)

Komron: Hey, does someone know will tonconnectui support usdt ?

&rey: As USDT is a jetton, it is already quite supported. (reply to 56218)

&rey: Or you mean dApps showing USDT balance?

Komron: Yes, as sendTransaction but in USDT (reply to 56220)

&rey: You need to send transaction to user's USDT jetton wallet; you can look up the correct payload in TON Cookbook at docs.ton.org. (reply to 56221)

Ilya: Hey Does TON support primitives to verify BLS or Schnorr signatures on smart contract level?

Bear: {- POOL UTILS -} cell pack_pool_init_data(slice proxy_address, int symbol_id, slice factory_address, cell jetton_wallet_code) inline {   return  begin_cell()             .store_coins(0) ;; total_supply             .store_slice(proxy_address) ;; proxy_address             .store_uint(symbol_id, 256) ;; symbol_cell_hash_id             .store_ref(begin_cell().end_cell()) ;; content              .store_slice(factory_address)             .store_ref(jetton_wallet_code)             .store_uint(0, 256)  ;; kLast             .store_uint(TRUE, 1) ;; fee_on             .store_coins(0) ;; amount_ton             .store_coins(0) ;; amount_inscription            .end_cell(); }   Is this overflow?

Bear: how many bits in .store_ref?

&rey: Yes, always. (reply to 56225)

&rey: Zero bits, one ref. (reply to 56226)

&rey: Yes, please refer to docs about TVM upgrade 2023.07. (reply to 56223)

Ilya: Thanks (reply to 56230)

&rey: On TON, you cannot call anything of another contract without sending a message there. Or obtaining contract's state from some trusted source. (reply to 56233)

Bear: no, no calling for get method in Tact or FunC. Ton doesn't support thtat (reply to 56233)

&rey: Yes. For your information, cell limit is 1023 bits and 4 refs. (reply to 56232)

Bear: https://tact-by-example.org/06-communicating-subcontract (reply to 56233)

Bear: OK thanks. (reply to 56236)

WH: How do i get the transaction hash of the out_msgs?

Gleb: https://toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get (reply to 56241)

WH: Tried that gave me 503 not able to locate trx (reply to 56242)

WH: Used source of out msg dest of out msg and the created lt

Gleb: I guess u did something wrong. This method always gives me correct result (reply to 56243)

WH: Can you help me a bit there. Got a random TRX https://tonscan.org/tx/7AsvnyrdV%2FIk1M+uH0wQuj5wS5zddEwcraH3Q92OxSo=  Looks like i cant send images. Source: EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt Dest: EQARULUYsmJq1RiZ-YiH-IJLcAZUVkVff-KBPwEmmaQGH6aC created_It: 46221236000014  Gives Tx not found (reply to 56245)

WH: Am i using the wrong address or something

fade: do u mean how to get the txid of the boc message you send? (reply to 56241)

WH: Not the message i sent, because i can check that with looking at the recent transactions in my address. But when i send certain transactions like swaps they have nested out_msgs which i'll need the hash of (reply to 56251)

fade: the internal messages? you can just get hashes of them before sending, am i missing something? (reply to 56252)

fade: when u send u use ext_message.serialize().to_boc(), if you need the hash of all the out_msgs wouldn't that be ext_message.body.hash?

WH: Not the hash of the message or body, I mean the transaction hash on the chain (to look it up)  example: https://tonscan.org/tx/4naaOiVoP2HInEy6kvRTtDWEGsuHaujjMeKiZhn7lFs= 4naaOiVoP2HInEy6kvRTtDWEGsuHaujjMeKiZhn7lFs= is the transaction hash (reply to 56253)

fade: yeah thats what i meant by txid, it's ext_message.serialize().hash (reply to 56255)

fade: its the same result when you use sendBocReturnHash

WH: Wait let me try that then (reply to 56256)

cemorum: Looking for a young dev who can create a simple shopify app with TON connect and a simple smart contract for shopping cart and payout

WH: Oh that is weird (reply to 56260)

Ruslan: Try to use toncenter.com/api/v3 instead. First use method /messages and then /transactionsByMessage (reply to 56243)

WH: I was trying without an indexer, but ya the indexer would solve a lot of my issue. 🙏 (reply to 56262)

Ruslan: The word try in tryLocate method means that this method may not succeed)

Ruslan: That’s why I recommended the indexer instead)

Jake: What would be the best way to transfer a jetton? Just launched a contract on testnet and still trying to grasp the concept

Ton: anyone knows how to decode a boc after I send a transaction?

musashi: how to count the number of subcontract when we shard the contract like jetton contract architecture (forwarded from musashi)

Daniil: hello. how much we should send to jetton wallet for transfering coins to another wallet?

musashi: 0.05 Ton is enough (reply to 56273)

Daniil: a few weeks ago, it's not enough. (reply to 56274)

Daniil: did the change in the fee affect that?

Ton: anyone knows how to get txhash from boc?

Ton: hello, have you solved it? (reply to 55622)

musashi: it also depends on your contract code (reply to 56275)

Ton: did you solve it? (reply to 51680)

K.: Is there a TON wallet that supports Ledger or Trezor?

CKEPTIK SHOP: Hello. Ready to work in a small start-up project. Experience : 1 year in TON. I know how to write smart contracts, webapp.

Lucky: Anyone has a resource on learning funC language for developing smart contract? Tact language is more easier but I think has a less feature than funC?

&rey: Documentation docs.ton.org is obligatory! It also contains further references, to example contracts, for instance. (reply to 56288)

🐼 Sild: Hey, I'm trying to get account state after transaction using raw.getAccountStateByTransaction https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L267  Everthing works fine for most cases, but if transaction activates account (at least for all cases which I've checked): https://tonviewer.com/transaction/7d918543e746890b2d5095afcff426af9a9503adfb0e87173aae0b8c6b7dae71 https://tonviewer.com/transaction/9ff10dd158e07567523d6b8b81ed76b61dddfbe9b9be61fb5b37ad5eae84b735 https://tonviewer.com/transaction/c9dbf4b4551f7aa342a1cb785f11cca43f0f5bc8342cbac882627c1817316d94  I get transaction hash mismatch error from that code https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/emulator/transaction-emulator.cpp#L136  How can I handle it?

🐼 Sild: I also tried to post such question in RU channel but seems I got banned automatically =\

Edm: Hi everyone, I’m studying the TON blockchain lately and wonder if there’s any transaction events aggregation service on TON, which is equivalent to subgraphs for EVMs?  Thanks

Baron: Although TON does not have a built-in event aggregation service like EVM subgraphs, there are several ways to aggregate and process data from TON segments using external tools and services (reply to 56307)

Edm: Hey, thanks for the reply. May I know what external tools/services are available? Don’t seem to find these in the documentation (reply to 56310)

Baron: I'll explain in a private message (reply to 56314)

Ma><im: how can i get parsed address?

Edm: Yea sure, thanks mate

musashi: import { Address } from '@ton/core'; const parsedAddress = Address.parse('raw address'); (reply to 56316)

Ma><im: i want to get raw address from friendly (reply to 56319)

cemorum: Looking for a dev for our Hackathon project in Open League

Puneet: Are there any hackathons coming up for building on TON

musashi: try this https://tonapi.io/v2/address/{ your address in any format}/parse (reply to 56323)

Ma><im: what is the address format?

musashi: read the docs here https://tonapi.io/api-v2

Denis: I appreciate it when people recommend reading our API documentation in response to questions about GraphQL from the Disintar team. (reply to 56327)

Ihor: Hi! Any ideas why lookupBlock method using LT (45609015000001) returns this seqno 42763118, but explorer has different one: https://tonviewer.com/transaction/5137b6a4300973de85725c8ca978a9cd2e130022601128ea657cb137183a4a80 ?

Steven G. Fries: Anyone looking for a ton developer?

К: did someone try to write contracts  in java? how was your experience?

К: is it worth learning func? or sticking to java or python enough?

musashi: if u want to write smart contracts on Ton, u have to use FunC or Tact

К: https://github.com/neodix42/ton4j/blob/main/smartcontract/README.md

musashi: this is for client side to interact with Ton, not to write smart contracts (reply to 56335)

musashi: it's not that hard, I started one month ago and when I get stuck, this chat helps a lot

К: public class CustomContract implements WalletContract {      Options options;     Address address;      /**      * @param options Options      */     public CustomContract(Options options) {         this.options = options;         options.code = CellBuilder.beginCell().fromBoc("B5EE9C7241010C0100B2000114FF00F4A413F4BCF2C80B01020120020302014804050094F28308D71820D31FD31FD33F02F823BBF263ED44D0D31FD3FFD33FD15152BAF2A105F901541065F910F2A2F800019320D74A96D307D402FB00E8D103A4C8CB1F12CBFFCB3FCB3FC9ED540004D03002012006070201200809001DBDC3676A268698F98E9FF98EB859FC0017BB39CED44D0D31F31D70BFF80202710A0B0022AA77ED44D0D31F31D3FF31D33F31D70B3F0010A897ED44D0D70B1FFCB329CF");     }      @Override     public String getName() {         return "customContract";     }      @Override     public Options getOptions() {         return options;     }      @Override     public Cell createDataCell() {         System.out.println("CustomContract createDataCell");                 CellBuilder cell = CellBuilder.beginCell();         cell.storeUint(BigInteger.ZERO, 32); // seqno         cell.storeBytes(getOptions().publicKey); // 256 bits         cell.storeUint(BigInteger.TWO, 64); // stored_x_data         return cell;     }      @Override     public Address getAddress() {         if (address = =  null) {             Address addr = (createStateInit()).address;             return addr;         }         return address;     }      @Override     public Cell createSigningMessage(long seqno) {         return createSigningMessage(seqno, 4l);     }      public Cell createSigningMessage(long seqno, long extraField) {         System.out.println("CustomContract createSigningMessage");          CellBuilder message = CellBuilder.beginCell();          message.storeUint(BigInteger.valueOf(seqno), 32); // seqno          if (seqno == 0) {             for (int i = 0; i < 32; i++) {                 message.storeBit(true);             }         } else {             Date date = new Date();             long timestamp = (long) Math.floor(date.getTime() / (double) 1e3);             message.storeUint(BigInteger.valueOf(timestamp + 60L), 32);         }          message.storeUint(BigInteger.valueOf(extraField), 64); // extraField         return message;     } }

К: looks like a smart contract, no?

🍙 G: Build yourself (reply to 56342)

musashi: what about oracle on Ton? (reply to 56343)

К: i just don't see the point in learning another language i'll use only for ton, i mean i get the point of learning fift, but not func (reply to 56338)

Ma><im: how can i get account id by address?

WH: So i sent a transaction using sendBocReturnHash and get the IN hash of the transaction. How can i get the OUT message of that same transaction instead? Is there something that i can change to get that or should I do a followup query for that?

Haq: Hey guys, any free TON dev here, interested for cooperation with working project?

Ash: Hello, I am trying to figure out if there is a way to sign arbitrary data with my telegram wallet

Ash: Basically for offchain signing

Ash: Proof of identity, etc

Yonder: Hey guys haven't said much here but I'm learning some specifics in a new platform for game design and I'm curious if anyone wanted to share some knowledge on the platform I'm using aswell as how to integrate it with telegram

User<6331629954>: is anyone know, how can I detect purchases through blockchain records?

&rey: If it supports TON Connect 2, yes. Otherwise no. (reply to 56359)

William: sorry how can i know why this tx has been failed? https://tonviewer.com/transaction/f5389d4e1a94550e3f35df539bd165b9c15d71412fdb225dab460c789418eb0c

&rey: TC2 allows to sign some string (wrapped to avoid signing actual transfers or something like that) once, when connecting. If you somewhy need more signatures, you should generate transient keypair on frontend. (reply to 56363)

&rey: Stonfi Payment Request had exit code 1610486421. I'd believe this is because price slipped. (reply to 56364)

William: How can i check it from toncenter api v2 or v3? (reply to 56366)

User<6779439263>: is there anyone looking for a dev?

User<7115720183>: I want to understand how to use the ton nft deployer tool

🅓 🅐 🅥 🅘 🅓: hello dev team ,  I am asking how to report fake airdrops in my Ton wallet ? Is this a feature that can be improved ?

Culp: does anyone need a developer?

🌷 Meyzi: Hey guys, any idea for www ton tel?

Sijl: /stat@combot

— 2024-05-02 —

Yonder: ???? (reply to 56360)

Baldwin: how to parse cell to string?

Terek: 1е я

William: Hello everyone, can I learn from you?

William: Can I ask for a sample contract or factory testnet? Please.

&rey: Usually, dApp dev estimates fee in mind, leaving a little to fund protocol contracts. (reply to 56425)

&rey: That doesn't look as a string encoded... Usually you skip 32 bits and then loadStringTail. (reply to 56412)

William: please, I'm having difficulty and have to meet a deadline on a difficult task, please support me (reply to 56422)

&rey: *sent message.  Normally, yes, all of fees are paid by user, in advance of those transactions happening. Certain kinds of contracts even return excess TON. (reply to 56430)

&rey: No, by dApp. (reply to 56432)

Rick: Hey quick question there have been a lot of scam nfts floating around lately..  if I send scam nfts to the burn address I don't pose any risk right ?

Glitch: Can anyone point me in the best direction for learning how to write FunC NFT smart contracts for TON?

Glitch: They got me yesterday... (reply to 56438)

Glitch: I wasn't being smart though, it was just a random website I found by clicking on some whales transaction history

Rick: Did you connect the wallet to that website ? (reply to 56440)

Baldwin: message from log emit (reply to 56428)

Baldwin: how to parse object

Baldwin: listener log is

Glitch: It connected to my tonkeeper wallet, but it was a brand new wallet with only 9 TON on it, they took 8 TON (reply to 56442)

Glitch: Website said "free mint"

Glitch: I've stopped using the wallet and made a new one

Rick: Okay thanks, so as long as the wallet isn't connected, it poses no issues. Does sending the nft create problems? (reply to 56446)

Glitch: I never got an NFT, I just lost 8 TON from a "free NFT" website (reply to 56449)

Rick: I understand thanks for the reply (reply to 56450)

Nugg 𓃠: Hello, I am getting an error when trying to access the Tonstarter project submission form?

&rey: No, while you do so via wallet app or carefully check emulation results. (reply to 56449)

&rey: NFT can require 5 TON to be transferred, at which point you're probably best leaving it in place.

&rey: As I've already said, Usually, dApp dev estimates fee in mind, leaving a little to fund protocol contracts. (reply to 56437)

Rick: Thank you very much!! (reply to 56456)

Jeremy: What is "jetton_wallet_code" in official jetton example？ How get it?

&rey: Compile jetton-wallet.fc and thus obtain cell with its code. (reply to 56466)

&rey: For offchain processing, zero value makes sense. (reply to 56460)

Jeremy: I want to deploy the jetton contract from the factory contract, but I'm not sure where to get the "jetton_wallet_code" at this point.

.: Hi guys, how is going? I am new here and I have a problem with this, please help me, how can I fix this?

Kushagra: Hi everyone, we are planning to build something which required indexed TON blockchain data. We have been looking at the TON center v2 and v3 APIs, but concern is if we need to find the TON balance of 1000's of users and keep it in sync, we need to hit the balance API multiple time. Is there a way to make this better and faster? OR ideally we should use ton-indexer to index everything on our end? Or is there any other services we can use to solve these types of usecase?   Thanks!

&rey: npm blueprint build (reply to 56473)

.: doesn't work, I just have wrote this in terminal (reply to 56476)

Anton: did you follow the instructions https://github.com/ton-org/blueprint when setting up your project? (reply to 56473)

.: oh, I think I didn't, but I will check, thanks!!! (reply to 56478)

Sonny: Can anyone tell me, I'm doing the claim token function and when I give the user a claim token, I get this error message

Bollus: Good morning TON Devs  Hope we're all settled in for some productive work  Anyway, if anyone here needs a UX Writer and mod, I'm up for adding some real value to any project I find.  Hit me up in my DM  Have a blessed day y'all 🙏

Haz: Hello guys! I have a problem with fund contract with TON. What I know, contract needs TON to be active on blockchain, you must pay with TON for persistent variables in the contract.

Haz: Ehhh, I cant send screen yet.

Haz: The problem is, I have tried to send TON to my contract like normal transfer from wallet, but my message is bounced with Success: False and Exit code: 130

Haz: What I am doing wrong? Now my contract has 0 TON balance but it is active and working

Slims (Ø,G): Hello DEVS  my wish is to be of service to any dev who is looking for a MOD. Anyone in this criteria should contact me .. Thank you

Klay.D: hi, in TonClient, why does getTransaction function need 3 params: address, lt, and hash to indentify a transaction? Isn't just transaction hash enough?

feng: How do I call the API to authorize my wallet to dedust?

Darkening Dawn: Hey guys! I'm trying to send transactoin via TonConnectUI, but got this error in Tonkeeper all the time. In Tonhub always 0 TON amount. And I can't confirm transaction. Have someone saw something like this before? I even tried mainnet the same error.

User<6943543282>: hello

Haz: I have a simple but not easy question. How to dump address when debugging? When I tried dump(ctx.sender) I have got dump() not supported for type: Address

User<6943543282>: is there any multisender tool on ton?

Baron: Yes (reply to 56506)

User<6943543282>: can you share? (reply to 56507)

Baron: "One Click Sender" as long as I remember

Baron: There is another one, but I don’t remember the name

Darkening Dawn: I fixed the problem, it was wrong payload format (reply to 56499)

WH: How do i get the external message from my message BOC

Carson: How can i decode the BoC I get from using sendTransaction in tonConnect? I want to get it's tx. https://docs.ton.org/develop/dapps/ton-connect/transactions

Baldwin: same question (reply to 56515)

okolo: Hi all!  Which SDK for Python i have to use to get amount of jetton transaction? I use TonTools, get_transactions() method, but in output there are no information about jetton amount.  For example i show same transaction from tonviewer, there i can see amount ("50000000000") https://tonviewer.com/transaction/d07db77b96b836875c3fc45f5da645e7c2b28e30ee5713a64542883e47ab0269

William: convert with decimals of jetton (reply to 56518)

okolo: in decimals = 50, but there is no same information (in TonTools output) (reply to 56520)

User<6943543282>: link? (reply to 56509)

Me, Myself & I: same question (reply to 56515)

Carson: It's funny. I saw this message tens of times and no one was able to answer it 🤣 Is this even possible? (reply to 56515)

Dmitry | backend4you.ton: Every SDK that can build Cell - can parse cell (and bag of cells) from source (string or byte array etc). Look into docs of your SDK

&rey: Is that a Tact contract? (reply to 56486)

Haz: Yes it is! (reply to 56527)

&rey: Does it have receive method without parameters? (reply to 56528)

&rey: If not, send money in unbounceable mode.

Haz: It is Jetton Token from tact-by-example (reply to 56529)

Haz: So it does not have empty receiver

Haz: How to do this? (reply to 56530)

&rey: Convert contract address to nonbounceable, and use that to send tx. (reply to 56534)

Haz: I used OpenMask and send 1 TON to nonbouncable address UQCYY7r... but the same result... Again msg was bounced (reply to 56535)

&rey: That's OpenMask bug, then. (reply to 56536)

Haz: I will try TON keeper (reply to 56537)

Haz: but I am wondering, how my contract is working when it has 0 TON?

Leonardo - Dirac Finance Defi: hi guys

Leonardo - Dirac Finance Defi: is there a solution for automatic payroll on ton ?

Leonardo - Dirac Finance Defi: something similiar to sablier on ethereum ?

Kryptonite: can someone help me how to swithc Jetton to immutable ?

Kryptonite: i have minted a jetton using minter on testnet

Haz: Use revoke (reply to 56545)

Haz: To zero address: EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c

Kryptonite: can please explain in detail , im new to eco-system (reply to 56548)

Haz: Go to minter ton org, connect your deployer wallet, enter your newly deployed contract and click on the Revoke ovnership button.

Haz: From Tonkeeper it works like a charm :) Thanks (reply to 56537)

Kryptonite: there is no revoke ownership button (reply to 56552)

Haz: you must be the owner of the contract

Kryptonite: in Admin section it showing my wallet address to be admin, i assume thats the ownership right?

&rey: Could you describe that in terms "user A sends money to service B regularly" or like? (reply to 56542)

&rey: Well, it does receive inbound message with TON before bouncing it... (reply to 56539)

Haz: okey probably now I understand. When contract has 0 TON it does not works in terms of contract logic etc, but when it is a jetton contract it does not matter. Jetton transfer works because jetton_wallets has positive TON balanc (reply to 56560)

Haz: Probably you are connecting wrong wallet | not the owner of contract | already revoked (reply to 56561)

&rey: Is there transfer ownership button or like? (reply to 56555)

Jim: I need to find developer who make Presale Mint website in TG bot on TON network

Kryptonite: owner is set , but then why does it still shoes mutable? (reply to 56564)

Haz: This contract is revoked (reply to 56570)

Haz: with this owner: EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c

Haz: its empty address

Haz: by some people named black hole :D

Kryptonite: Got it

Kryptonite: and can you please also help me to know, how to  flip that mutable flag

&rey: Now, no way to do so, everything is already done. (reply to 56576)

&rey: No, and no — empty address, zero address and black hole are a few different entities) (reply to 56574)

Kryptonite: renouncing ownership for dedust.io means giving up ownership right?

Leonardo - Dirac Finance Defi: yes. in my case i need to manage vested tockens in a new project (reply to 56559)

Leonardo - Dirac Finance Defi: something to send to advisors and investors in a regular timeframe

&rey: Are there many people? Are there many timeframes?

Leonardo - Dirac Finance Defi: something like 10 people on (example) 10 timeframes (reply to 56583)

Leonardo - Dirac Finance Defi: is there an easy solution ?

Haz: Could you explain it more? I thought that the zero address is the black hole address... (reply to 56579)

Serafim: Hi. I'm need to prove the message inclusion for specific block with its root_hash. Is it merkle tree root? If so, how can I get the merkle path from the message to the root?

Leonardo - Dirac Finance Defi: please it's very important 😀😀 (reply to 56583)

&rey: A script on your server) (reply to 56586)

Leonardo - Dirac Finance Defi: ok (reply to 56594)

Leonardo - Dirac Finance Defi: is there anything on github ?

&rey: 1. Black hole address was recently introduced; it burns all TON coming to it. Ef___________________________________________7Sg 2. Empty address does not have string representation, and contracts recognize it as b{00} - two zero bits. 3. Zero address is address which is unlikely to be initialized as wallet, so assets sent there are inaccessible. There are two common zero addresses: EQD__________________________________________0vo EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c (reply to 56588)

&rey: I guess so, but easier to find in docs.ton.org / TON Cookbook. (reply to 56596)

&rey: Request liteserver for one, as in https://docs.ton.org/develop/data-formats/proofs. (reply to 56590)

Haz: Okay, thanks, I thought these things are more likely in EVM. No i see that they are more complicated (reply to 56597)

Mute: I have created an event as shown below. However, I don't know and can't find any documentation about listening to this socket using node js or typescript. help me

Nerses: Hi everyone ! for checking transaction is failed (using blueprint test) is it ok to pass false in succes field or there is  more appropriate way to do expect(    .transactions).toHaveTransaction({         from: ,         to:   ,         success: false,     });

User<5018886941>: Hello

🅓 🅐 🅥 🅘 🅓: Helloooooooooo

musashi: is Ton testnet stopped? my transaction get pending for a while

Darkening Dawn: Hey! Have you managed to fix this problem? (reply to 51962)

WH: How do i get the exit_code and the success from a transaction that i have the data from from getTransactions?

Gyorgy: Check on @testnetstatus channel. Looks good to me. (reply to 56613)

musashi: yes, it works now

User<6715689249>: Hi all, looking for a developer who can make a simple p2e in (web app)

WH: Any help? (reply to 56615)

Gyorgy: Just set exit codes manually. If return code if err code. (reply to 56623)

Gyorgy: Only one way for success return code anything else is error. Easy to handle it, but its up to the language or codebase what you are using.

WH: Im using TonWeb. Using their getTransactions(wallet, limit) (https://github.com/toncenter/tonweb/blob/76dfd0701714c0a316aee503c2962840acaf74ef/src/index.js#L47) I can fetch that transaction, how can i tell if that transaction actually failed (reply to 56625)

WH: Right now if you go to tonscan/tonviewer with a failed trx it'll show you that it failed with the exit code

&rey: Don't you get exit code from the transaction object? (reply to 56627)

WH: No, that is what i hoped for (reply to 56638)

WH: Try https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get

&rey: Try other APIs, then. (reply to 56640)

WH: Is there a way to get that from the data without relying on more APIs

Tài: i wait kyc 1 day

Tài: ad can help me please

Disco: Hi, please check your DM (reply to 56621)

Chukwunonso: Please I have a function that returns a data type on struct, when I write test for this function, it works and returns the data but when I try same in my app using ton client I get the error "Error: Unsupported stack item type: tuple". Please I need help here.

cemorum: Hello guys! We are a team of young entrepreneurs and we are participating in the Open League Hackathon.   I'm looking for the TON devs, webapp devs and enthusiasts that want to participate with us and win the prize!   DM me for the detail. PS: non commercial offer, not offering work, looking for team members

User<6447148679>: Are you looking for Analyst or Moderator? (reply to 56621)

ayushag: How to switch to testnet in Tonkeeper v4.3.0 Android app?

&rey: Please check if the previous advice in this chat is helpful. (reply to 56660)

#: Why is it that when sending 0.02, 0.0001 is not sent back?

Chukwunonso: Please I have a function that returns a data type on struct, when I write test for this function, it works and returns the data but when I try same in my app using ton client I get the error "Error: Unsupported stack item type: tuple". Please I need help here.

Chukwunonso: is there a different way to handle objects for ton client ? anyone please

Albert K.: Please let me know if anyone looking for a TON dev

Slava: Hello everyone. A bit uncertain how to look up transactions using toncenter’s API (v2 or v3). A cryptocurrency exchange gives me the transaction hash (`86f9c497d2288a3f7b5a91496f29c8054c74d71f6a60e3c9c33fcebaf5da46fd`) which can be looked up through tonviewer, for example. but inside the looked up its hash is different (`edc220b4eafeebc34951435430bd2943676c5252885761d31a45d988af622ae1`). The latter can be looked up through toncenter’s /api/v3/transactions, but not the former. How would I find the 86f9… transaction through the API?

Tobias: I have this code for transfering a jetton from a frontend interface,  i have trouble getting jettonWallet for the jetton and sometimes when tonkeeper opens to sign transaction, it says unknown protocol version: undefined   can anybody help?  import { useAsyncInitialize } from './useAsyncInitialize'; import { Address, toNano } from '@ton/core'; import { useTonConnect } from './useTonConnect'; import { useJettonContract } from './useJettonContract'; import { transfer } from '../contract/JettonWalletContract'; import { useTonAddress } from '@tonconnect/ui-react'; import { useEffect } from 'react';  export function useJettonWalletContract() {   const { tonConnectUI } = useTonConnect();   const clientAddress = useTonAddress();   console.log('Client address:', clientAddress);   const { contract } = useJettonContract();    const walletAddress = useAsyncInitialize(     async () => await contract?.getWalletAddress(Address.parse(clientAddress))   );  useEffect(()=>{     console.log('Wallet address:', walletAddress?.toRawString());     // console.log("contract", wa.toString()) }, [walletAddress])    const _transfer = async (to: Address, amount: bigint) => {     if (!walletAddress) {         console.log("jetton wallet not found")         return;     };     const body = transfer(to, Address.parse(clientAddress), amount);     await tonConnectUI.sendTransaction({       validUntil: Math.floor(Date.now() / 1000) + 360,        messages: [         {           address: walletAddress.toRawString(),           amount: toNano(0.05).toString(),           payload: body.toBoc().toString('base64'),         },       ],     });   };    return {     transfer: _transfer,   }; }

Chukwunonso: For a job or for the openleague hack ? (reply to 56678)

Albert K.: for a job

User<6861867033>: HI. I'm a Full-stack developer with 6 years of xp and am have strong xp on TON smart contract and telegram api. I can show you my recent work on telegram, if you want. I'll give sunrise to your life and business

— 2024-05-03 —

kevin: I know a great opensource project, you might take a look      https://github.com/tonindexer/anton (reply to 56475)

boot adbot: is there a python repo capable of creating NFTs?

ayushag: Can't find it? Can you ping it down if you can find.... (reply to 56661)

Kushagra: Thanks!! But with this I would require to manage the complete infrastructure. Is there any 3rd party services available that I can use? (reply to 56709)

Baldwin: How to listener log from emit?

Mute: I have the same question, but haven't received any answer yet (reply to 56715)

Baltaazar: Hello, where to report bug?

&rey: If you can listen to that, you can listen to incoming stake txs and skip emitting anything. (reply to 56715)

&rey: External-out messages don't really have use either with or without indexers.

&rey: Is there a null object returned somewhere, by any chance? (reply to 56675)

&rey: Maybe you're looking at different txs in one message chain? Which you're interested in? (reply to 56681)

&rey: To developers of the dApp. In 99.99% cases, the bug is not in TON Blockchain; in 95%, there is no bug. (reply to 56720)

Baldwin: I get a message like this, how to decode msg_data (reply to 56730)

Ny ♥️ Ⓜ️MEMES🐸🍋🍅: /stat@combot

JuunS | Part of Manexus | Web3 Dev: Is there a way to get parent property using tact?

Wukong: Hi, do anyone know how to sign message in Tonkeeper? Does TON have that ability like EVM networks?

JuunS | Part of Manexus | Web3 Dev: Because in parent it have ownable, and want to check current owner in the children (reply to 56744)

Crypto-Age: Hi everyone, I have created new wallet on tonkeeper. I sent 1 TON to the new wallet, but it is still inactive. So I can't do anything with new wallet. How can I make the new wallet active? Please help me now. Thanks.

JuunS | Part of Manexus | Web3 Dev: Send some ton to another wallet (reply to 56748)

Crypto-Age: Thanks for your answer. I already sent 5 TON. I can see the updated balance on tonscan or tonviewer, but the wallet is still inactive. What can I do now? (reply to 56750)

JuunS | Part of Manexus | Web3 Dev: Sent ya not receive (reply to 56751)

Crypto-Age: what do you mean?

JuunS | Part of Manexus | Web3 Dev: From your new wallet send to other wallet

Crypto-Age: the wallet is still inactive, so the balance is still 0 on wallet. So I can't send any TON (reply to 56754)

&rey: This is not true. (reply to 56748)

&rey: Sign+send only. (reply to 56746)

&rey: Parse BOC by your SDK; then consult your contract TL-B schemes to find out fields in the message. (reply to 56735)

&rey: TON contracts are autonomous, they can't pull data on demand except by sending message. (reply to 56744)

Crypto-Age: https://testnet.tonscan.org/address/EQDzyHRNvxoLBAPJA_fBLK2IRiZ4uo9yZ7Z9_RuHiSsTHfbD  This is my wallet status. Wallet shows 0 TON, but tonscan shows 1 TON and inactive status. (reply to 56756)

&rey: Tonkeeper's testnet support is... well, experimental. (reply to 56760)

Glitch: Hey guys, new to TON, I’ve got a question… where does the rent from smart contracts go? Is it burned or does it make its way back into the circulating supply? Is there more details in this?

&rey: Half of all fees, including storage, is burned; half goes to validator who created the block. (reply to 56763)

Crypto-Age: really? oh no~ you are right. On mytonwallet, it shows 1 TON. thanks (reply to 56762)

Wukong: Sorry Im new to TON, can you explain a bit more 🙇‍♂️ (reply to 56757)

&rey: You don't get to sign arbitrary payload. (reply to 56767)

O: Hi all, trying to send swap using ston sdk, could some help me figure out the right way here?    const key = await mnemonicToWalletKey(mnemonic);  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });  const endpoint = await getHttpEndpoint({   network: 'mainnet', });  const client = new TonClient({ endpoint });  if (!await client.isContractDeployed(wallet.address)) {   return console.log("wallet is not deployed"); }  const balance = await client.getBalance(wallet.address); console.log("balance:", fromNano(balance));  const router = new DEX.v1.Router({   tonApiClient: new TonWeb.HttpProvider(endpoint) });  const offerAmount  = BigInt("1000000000"); const minAskAmount = BigInt("0");  const contract = client.open(wallet); const seqno = await contract.getSeqno(); console.log("seqno:", seqno);  const swapTxParams = await router.buildSwapTonToJettonTxParams({   queryId: 1,   userWalletAddress: wallet.address.toString({ bounceable: false, urlSafe: true }),   askJettonAddress: ASK_JETTON_ADDRESS,   proxyTonAddress: pTON.v1.address,   offerAmount,   minAskAmount });  const transfer = contract.createTransfer({     secretKey: key.secretKey,     seqno,     messages: [       internal({         to: swapTxParams.to.toString(),         value: swapTxParams.gasAmount,         body: Buffer.from(await swapTxParams.payload.toBoc()).toString('base64')       })     ]   });  const res = await contract.send(transfer);   The error - Uncaught Error: Invalid address EQARULUYsmJq1RiZ-YiH-IJLcAZUVkVff-KBPwEmmaQGH6aC   UPD: new issue transaction out and in (sent and return back)

&rey: Perhaps it's best to combine multiplier into 1000 * 1000 * 1000. (reply to 56770)

&rey: Which of statements raises that error? (reply to 56776)

Chukwunonso: Ohh, some properties may return null. (reply to 56732)

O: createTransfer (reply to 56779)

&rey: I've heard that API may return empty LISP-style list instead of null. (reply to 56780)

&rey: It's best to patch it in the lib.

.: Hi, guys!!! Can somebody help what's wrong with this, I did all from the video, but it's not working, help me pls.  import { toNano } from '@ton/core'; import { Counter } from '../wrappers/Counter'; import { compile, NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const randomInt = BigInt(Math.floor(Math.random() * 1000000));     const counter = provider.open(await Counter.fromInit(randomInt));      await counter.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );      await provider.waitForDeploy(counter.address);      console.log('Id', await counter.getId()); }

&rey: Stringify destination address, since you're using two incompatible SDKs. (reply to 56782)

&rey: How it's not working? (reply to 56786)

Chukwunonso: I guess I'll just avoid returning null (reply to 56785)

O: Unf, does not work as well, throws throw new Error("Invalid argument"); (reply to 56788)

.: for the first, it's underlined (reply to 56789)

&rey: Then convert payload to BOC base64 as well. (reply to 56791)

&rey: Perhaps wrapper is wrong? Have you compiled the correct contract? (reply to 56792)

.: I did from the tutorial, https://www.youtube.com/watch?v=J7ZF3KWxX_8&t=286s (reply to 56794)

O: Thank you, sir. Works now, at least I've send it. (reply to 56793)

O: Do you mind to clarify two more questions, 1. Will it work on test net as well? (swap) 2. Ho I can parse swapTxParams.payload (Cell) to see some readable format ? (is there any usefull info there?) (reply to 56796)

Slava: Thanks for looking into it! What I am trying to do is validate whether the transaction with a given id has arrived to my wallet by using toncenter apis. The exchange provides a different txid which can be magically looked up by tonviewer, but i cannot find a way of doing the same with the toncenter apis (reply to 56733)

Fitra: hello, there is anyone know where we can deploy jetton on testnet? afaik mainet on https://minter.ton.org

Wukong: Add testnet to the url: minter. ton. org/ ?testnet (reply to 56800)

Fitra: thank you very much (reply to 56805)

Baltaazar: @pcrafter can you check your DM please

O: Well partiall success, the transaction goes out and then bounced back (reply to 56796)

lafi: How do I tell if a project is scam ? Pls

WH: Is it normal that my Jetton wallet is holding TON? If not is there a way to extract them?

agile_ape: hi team. my usdt funds are stuck on the ton bridge. the get USDT button is not appearing - stuck on the 65/65 block confirmations. can someone direct me to the right channel?

Đức Duy: hello, i want upload my game on TON and Telegram, Can anyone help me?

JuunS | Part of Manexus | Web3 Dev: Btw is there any jetton contract which can freeze and unfreeze token transfer? Because I still don't know how to get Jetton Minter attributes in Jetton Wallet.

&rey: Yes, for a little amount (below 0.2 TON). (reply to 56814)

WH: I have one jetton wallet that got 2.8 TON (a lot of failed swaps) and another 0.4 TON (reply to 56824)

Arash: Hi guys  Is there any method to connect dapps via ledger?

WH: How can i extract those? Stonfi swaps

&rey: The right bot seems to be @ton_help_bot. (reply to 56817)

&rey: Then, there is no method. (reply to 56829)

agile_ape: yes i did text the bot. no reply since

&rey: Actually, computers can't tell if given program will finish and output results successfully, and people hardly can teach how to recognize scam. (reply to 56812)

JuunS | Part of Manexus | Web3 Dev: Or maybe how to get owner address from Jetton Wallet? (reply to 56823)

WH: call get_jetton_data on the wallet you can get all its data including the owner (reply to 56834)

JuunS | Part of Manexus | Web3 Dev: I mean admin address, there's admin (owner) address on the Jetton Minter, and on the Jetton Wallet, the owner is each user address, but from Jetton Wallet I want to get the admin address (owner of Jetton Minter)' (reply to 56835)

Bear: sorry, how to expand the private Key to the sandbox?      beforeAll(async () => {         blockchain = await Blockchain.create();          code_factory = await compile('Factory');         code_proxy = await compile('Proxy');         code_pool = await compile('Pool');         code_jetton_wallet = await compile('JettonWallet');          deployer = await blockchain.treasury('deployer');         treasury = await blockchain.treasury('treasury');                  address_1 = await blockchain.treasury('address_1');         address_2 = await blockchain.treasury('address_2');           let mnemonics = (process.env.mnemonics || '').toString(); // 🔴 Change to your own, by creating .env file!         let keyPair = await mnemonicToPrivateKey(mnemonics.split(' '));          let inscription_to_pool = Dictionary.empty<bigint, Boolean>( Dictionary.Keys.BigUint(256), Dictionary.Values.Bool() ); // <SymbolHashID, Boolean>              // Set the valiidators address in the dictionary         address_1 = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey, walletId: 0 }).address;   I want to set the wallet address in Sandbox so I can use the Public Key + PrivateKey Signing

WH: Any idea how to extract those? (reply to 56825)

Nerses: Hi everyone ! How can I change config of blueprint to make build contracts before test command ?

Anton: You can use  npx blueprint build && npx blueprint test in your terminal (reply to 56841)

Nerses: thanks a lot (reply to 56842)

lafi: Hmm okay (reply to 56833)

Andrew: Hi all, I'm writing my first contract and there is an error with Tonkeeper connection. When I do the deploy and scan the qr code to connect the wallet, it successfully connects on the testnet network and the message "unable to subscribe to notifications request failed with status code 400" pops up. After that the deploy stops.

Bear: Hiiiiii having the issued when dealing with some dictionary then save_data()  ``` () save_data(slice admin, slice treasury, cell inscription_to_pool, cell validator_list, int amount_of_validators, cell voting_count, cell message_record, cell pending_order_list, cell proxy_code, cell pool_code, cell wallet_code) impure inline {     cell maps = begin_cell()                     .store_dict(inscription_to_pool)                     .store_dict(validator_list)                     .store_uint(amount_of_validators, 8)                     .store_ref(                         begin_cell()                             .store_dict(voting_count)                             .store_dict(message_record)                             .store_dict(pending_order_list)                         .end_cell()                     )                 .end_cell();       cell codeBase = begin_cell()                         .store_ref(proxy_code)                         .store_ref(pool_code)                         .store_ref(wallet_code)                     .end_cell();      set_data(         begin_cell()             .store_slice(admin)             .store_slice(treasury)             .store_ref(maps)             .store_ref(codeBase)         .end_cell()     );             }   I can compiled the code but get the exitCode 7....

&rey: Try other wallet apps, or test in sandbox and then deploy to mainnet. (reply to 56855)

Bear: Hey, I can't figure out why I can compile but am still having errors here. Considering:  1/ Could it be because I changed too many parameters then stored them? Are there limitations on changing storage parameters frequently in FunC?  2/ Exit code 7 means a type check error, where an argument to a primitive is of an incorrect value type. But shouldn't the dictionary be all set with cell type?   Here are my modules: (slice, int) dict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "DICTGET" "NULLSWAPIFNOT"; (cell, int) dict_get_ref?(cell dict, int key_len, slice key) asm(key dict key_len) "DICTGETREF" "NULLSWAPIFNOT"; (cell, ()) ~dict_set_ref(cell dict, int key_len, slice index, cell key) asm(key dict index key_len) "DICTSETREF" "NULLSWAPIFNOT";  (slice, slice, cell, cell) load_data() inline {     slice ds = get_data().begin_parse();     return(         ds~load_msg_addr(), ;; admin         ds~load_msg_addr(), ;; treasury         ds~load_ref(),      ;; maps         ds~load_ref()       ;; codeBase     ); } (reply to 56856)

JuunS | Part of Manexus | Web3 Dev: Currently bounced is not working ya?

&rey: It works! Where not? (reply to 56860)

Bear: bounced message works 24hrs (reply to 56860)

JuunS | Part of Manexus | Web3 Dev: Ohh okay

monokh: Hi, I have a conceptual question about TON vm that wasn't answered through docs if calls inside contracts to other contracts are asynchronous, how do you ensure atomicity?  I would like to create a contract that sends 5 JettonA to A and 5 JettonB to B - does this require some special login in contract or calls are checked to succeed before transaction continues

&rey: This is wrong. (reply to 56859)

Nerses: to: receiver,                     bounce: true,                     value: msg.data.__amount,                     mode: 128                 });     }  I have this code in my smart contract. If someone calls this method will the smart contract send TON to reciever or caller will send to reciever ?

&rey: You ensure that you received both jettons first, then you send both out and don't care anymore. (reply to 56865)

JuunS | Part of Manexus | Web3 Dev: bounced(msg: bounced<TokenTransferInternal>) {         self.balance = self.balance + msg.amount;     }  is this one will works? whenever the receiver got error?

ᴅʏᴜᴛɪ ᴅɪᴘᴛᴀ: Which ide are you using? (reply to 56323)

&rey: Smart contract. "Caller" (initial message sender) has already finished execution. (reply to 56867)

monokh: thank you, assumed that you check contract has it by get methods. Are you aware of any public source code for atomic swap? (reply to 56868)

Karina: Yes (reply to 56874)

&rey: You mean, the scheme with three timeframes which can work even crosschain? (reply to 56874)

monokh: no simply inside chain  moving 2 assets between 2 wallets at exact amounts (reply to 56876)

monokh: I have seen a lot of AMM dex source code on TON but no simple atomic swap

&rey: You can do this using the same mechanisms: A sends some jettons, then B sends some jettons, and upon that they are exchanged. (reply to 56877)

Nerses: thanks. How can I rearrange code that initial message sender will send to smart contract ? (reply to 56871)

&rey: If you make this into three timeframes, you get so-called* atomic swaps.  *short-labeling concepts is not native to TON, actually.

&rey: You cannot do so. This is an advantage of TON ecosystem. (reply to 56881)

Nerses: so there isnt way to implement HTLC ? (reply to 56883)

&rey: *short-labeling concepts is not native to TON, actually.  Could you describe what it is, and why it needs to pull assets from user without them signing the exact message stating what will be withdrawn? (reply to 56884)

&rey: Bot deletes repeating messages, even if previous was deleted.

Nerses: Got it.I just wanted to correct my message and not spam with previous one.HTLC(Hashed Time Lock Contracts).It is cryptographic protocol for crosschain atomic swaps. an HTLC might be set up to allow a user to deposit funds that can be withdrawn either by providing a correct preimage of a hash (the "secret") within a time limit or returned to the depositor after the time limit expires.

monokh: in a HTLC, user will send a secret to the contract to withdraw tokens in a vault (reply to 56884)

&rey: OK! I will assume you need the same thing as @monokho. Why do you need initial message sender to send anything more? (reply to 56891)

monokh: my question was separate (only inside chain swaps) but i am also interested in HTLCs 😅

&rey: Well, HTLCs seem very easy to create, and probably fit your problem exactly. Unless at least one of users has installed plugin, you can't pull jettons from them. (reply to 56894)

monokh: is there not a way to create a temporary smart contract wallet that owns jettons ? (reply to 56895)

&rey: It is the solution, yes, and you'll end up doing just same as HTLC: having contract which processes the swap! (reply to 56896)

Nerses: my question is about in same chain.As when user A creates HTLC for B in that contract reciever is mentioned TON address of user B. and in other network user B creates same HTLC for user A and mentions user A address in that chain (reply to 56894)

Nerses: So user A need to lock money in smart  contract for user B.And when user B provides secret smart contract will send the money

&rey: Well, in same chain you can omit the part about hash and just authorize the message by its source.

Nerses: can you describe more detailed,please ? (reply to 56901)

&rey: Let your temporary contract calculate its own jetton A,B wallet addresses, and listen to transfer notifications from them.

&rey: When both transfers from the pre-specified parties are received, both can be sent back out.

Nerses: but there are other components for example timelock.When user locks fund for B with timelock x.It means that A cant take back his funds before timelock x expires.Is it possible to check such requieremnts ?

Nerses: and also if some new user will appear how contract will calculate its address ? (reply to 56903)

JuunS | Part of Manexus | Web3 Dev: Already try in unit test, whenever the receiver error, the caller not get the value back. In my case, I try to invalidate using require(), and catch it on caller contract using bounced() and in the bounced I give back the value, but its like it not called. (reply to 56861)

Think: Help

wikig: Hello guys , will no-kyc prepaid card works in TON ?

TON Bounty Bridge: ​Arism Wallet - A hybrid-custodial wallet and distributed key management protocol  🏷 Developer Tool  Created by SnowyField1906

Ma><im: that’s dton/graphgl website (reply to 56870)

Lord: Hi @delovoyslava 👋  what’d you think about the proposal 🫠

Sleepy: Hey guys is there any data source with labeling for ton addresses?

Sleepy: or may be even you can say what service this address belongs to UQB1QBhyiY76wtIDTaV3pFtl8jE_aCrlGeDDTRbz2LaNjTvH

Tse: I see this part in the getgems' standard sell contract. Can someone tell me how to call this function and retrieve a NFT accidentally sent to the contract? I will provide 50TON for who successfully helped  me with this

Mike: I’m trying to send USDT from my wallet to another wallet using TonWeb, however it keeps submitting 0 USDT transactions, for example: https://tonviewer.com/transaction/bc906870eed775734cd6e676effcaed71ca4e36db5ad353a49d3e3f372c661a0  This is my code, which is based on the documentation. What am I doing wrong?  const tonweb = new TonWeb(     new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRpc', {       apiKey: 'secret',     })   );    const { publicKey, secretKey } = await mnemonicToPrivateKey(['secret']);    const wallet = tonweb.wallet.create({ publicKey });   const walletAddress = await wallet.getAddress();   const seqno = await wallet.methods.seqno().call();    const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {     address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', // USDT contract address   } as JettonMinterOptions);   const tokenAccount = await jettonMinter.getJettonWalletAddress(     new TonWeb.utils.Address('EQDAiQszDTjVRTL6Xw8dgKbiRnKu3kOawowTXYMF3YQWdyBN') // sender wallet   );   const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {     address: tokenAccount,   });    const comment = new Uint8Array([...new Uint8Array(4), ...new TextEncoder().encode('hello')]);    const tx = wallet.methods.transfer({     secretKey,     toAddress: jettonWallet.address!,     amount: TonWeb.utils.toNano('1'),     seqno: seqno ?? 0,     payload: await jettonWallet.createTransferBody({       tokenAmount: new BN('1000000'), // 1 USDT       toAddress: new TonWeb.utils.Address('EQAW29PA6wduS8IlZe4j64IUMhwFY27UaD2eZ7MJhsFV9YvH'), // receiver wallet       forwardAmount: TonWeb.utils.toNano('0.0000005'),       forwardPayload: comment,       responseAddress: walletAddress,     }),     sendMode: 3,   });    await tx.send();

Andrii: Hi everyone, do we have in the dedust SDK method for getting all available pools in dd?

User<6861867033>: did you checked doc? (reply to 56936)

Nerses: if my transaction is failed should I pass in success field false to pass the test ? expect(  .transactions).toHaveTransaction({         from: address,         to: address,         success: true,     });

User<6861867033>: send get request to the /pools or /pools-lite (reply to 56936)

Andrii: Sure it’s from API, any options how to call the method via SDK to get all pools? (reply to 56939)

Andrii: Or SDK mostly developed for swaps and more advanced features?

User<6861867033>: Nothing just GET request to /pools (reply to 56940)

WH: Can someone explain why do some blocks get shown twice in Tonscan?  (example `43324129`)

Denis: It's different blocks from different shards (reply to 56943)

WH: So the same block number can be on differnet masterchain blocks? Those two blocks are on workchain 0 Is there any documentation about that? Would be helpful if someone can link. Thanks! (reply to 56946)

User<6861867033>: hi did you checked amount in transfer parameter? (reply to 56931)

Ton: Hello, please if anyone can help me for this question. I use npm install @ton/core successfully. But once I import{ ADRDRESS } from “@ton/core” it shows problems.

Ton: I don’t know how to solve that.

Mike: you mean this forwardAmount: TonWeb.utils.toNano('0.0000005’),? I’ve tried with forwardAmount: TonWeb.utils.toNano(‘1’), and had the same outcome of 0 USDT transferred. (reply to 56948)

User<6861867033>: Which dex? (reply to 56953)

Mike: I’m not using any DEX, I have USDT in my wallet and I’m trying to transfer it to another wallet with tonweb

User<6861867033>: Plz set response address = undefined (reply to 56955)

SpacyLion: Hello! Can you suggest, on nextjs UI kit for mini apps? Still ui-react?

Louis: Hi, I try deploy Jetton follow git : liminalAngel func-blueprint-tutorial tree master 6  i received error 5 : tx on testnet b65a59024336da99764b3e3487c03a32454600baf2d096ddac755a7bfea07e80

IsakQuest: Hello everyone. I'm writing a python bot, how to link it to a tonconnect or something else, so that the user can go in to replenish their balance or withdraw. Can you tell me?

User<6861867033>: @test_tonconnect_bot  you'll get everything from here (reply to 56965)

IsakQuest: Thanks (reply to 56967)

User<6861867033>: feel free to ask (reply to 56968)

Artem: hello everyone! is there any examples or hints how to implement blockchain subscription? my goal is to subscribe to specific addresses and receive updates when some transaction was made relative to that address. the idea is to have a functionality that will update token prices based on the list that i have.   for example, in ethereum i would subscribe for new blocks, get the logs from the block, then if the log is relative to a pair that i am interested in, i would fetch the pool state and update the price in my storage. is this mechanism possible in ton? thanks

lafi: building something like Stonify  dex... what languages do i need to use or waht are the languages..??

User<6861867033>: Dm plz. (reply to 56973)

Mike: same result, 0 USDT transaction https://tonviewer.com/transaction/a22aaf35db301aba68f71a27c1662a23b53c810b505b6ff52a8f6786785f9076 (reply to 56959)

Aventu: How to write a smart contract if you are just a beginner, are there any courses or AI that will help you write?

Andrii: How to parse the correct price from amountOut parameter here. There is no zero ahead  {   assetOut: Asset {     type: 1,     address: EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE   },   amountOut: 872254907n,   tradeFee: 10000000n }  Same with /v2/routing/plan endpoint on DeDust

Louis: please check with code error code "5" - transaction  on testnet:25f49a856a81f7476dfd013461c27174d9472bc922dd8e8b5068bf8abb3f268a  I try deploy Jetton with token-contract Example

Aventu: Plz help (reply to 56980)

Денис: Please tell me, maybe someone had such a plug. I wrote a contract (tact, blueprint), in tone, the keeper created a wallet in the test network, replenished it, activated it, I'm trying to upload this contract to the test network, I get a qr, scan it, as a result, such an error. A transaction is waiting for confirmation in the visual studio and there is such a situation in the wallet, where to dig?

Max | TonMap: Hey! How can i get the wallet balance with TON-connect in react? Thanks

Think: UQC6TmLQDgCu_udSv9wTmYdEAd6t1nTbw9tbAk-vVtyql6Gq

Buggy: May i know who's game developer right here?

lafi: whats the current version for node.js

Andrii: Guys, be careful. Anthony Tsivarev | TON - this person is posing as a chat admin. He writes in private messages and tries to help. But it ends up sending phishing links!!!!

Baron: Hero (reply to 56998)

#: export async function run(provider: NetworkProvider) {     const JettonWalletAddress = "kQD5Bqxff0kOIZNDh3Yx4tawkyRfcz3aJwB-seu_eLNEooh_";     const sendTon = provider.open(await SendTon.fromInit(0n));     const id = await sendTon.getId();     await sendTon.send(         provider.sender(),         {             value: toNano("0.04")         },         "test"     ); } Do I need to indicate the JettonWalletAddress here?

User<5842008916>: hello there, i need to open an existing wallet on a native ton wallet app to use fragment to move an nft... The way is using private key i think... but i don't find any ton wallet app that supports importing existing wallet by private key... can you help me with some suggestions?

Andrew: Guys, I am a newbie and faced a problem. I created a wallet in the test network using Tonkeeper. Then I created a contract using counter template and now I'm trying to deploy to test network, but after scanning qr code I get error "unable to subscribe to notifications: request failed with status code 400". Deployment test is successful.

User<7174392301>: is there anybody looking for a dev?

princekamil: Do i have here somebody who is able to upload the collection to getgems via to raffles?

Bear: can you expand more sir? (reply to 56866)

TnT: How to publish my webgl game built from unity to Telegram PlayDeck ?

Bear: 1 (reply to 54319)

Bear: ummm can't sure about this but dictionary is complex in FunC - the question: https://t.me/tondev_eng/56859  Reference answer:  - https://t.me/tondev_eng/22401 - https://t.me/tondev_eng/50811 (reply to 50811)

Bear: same, dictionary for Slice in Key value tho (reply to 36337)

— 2024-05-04 —

Bear:         (slice public_key, int pubk_found) = validator_list.idict_get?(267, sender);   what is the best way to store Address in Dictionary? slice sender_address to hash Integer?

Optimus: hi guys  is there a directory/resource for ALL status emojis?

Oscar: How do we mint jettons on the testnet?

Oscar: Is there like an alternative to minter.ton.org?

&rey: createTransferBody({jettonAmount: ...}) (reply to 56931)

Vlad: Guys, do I understand correctly?  QA - not deployed without seed  QB - deployed empty smart waiting for testgiver tones  QC - testgiver tones received  QD - first send transaction  ?

Jack: Hi guys,  I have a question. I have deployed the JettonMasterInterface with owner, content, and max_supply. The metadata code for the content was created using the jetton-helper code as shown below. My question is: Is there a way to convert the content back into an object format when receiving data from the JettonMaster using the get_jetton_data() function?  // jetton-helper.ts  import { Sha256 } from '@aws-crypto/sha256-js'; import { Dictionary, beginCell, Cell } from '@ton/core';  const ONCHAIN_CONTENT_PREFIX = 0x00; const SNAKE_PREFIX = 0x00; const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);  const sha256 = (str: string) => {   const sha = new Sha256();   sha.update(str);   return Buffer.from(sha.digestSync()); };  const toKey = (key: string) => {   return BigInt(`0x${sha256(key).toString('hex')}`); };  function makeSnakeCell(data: Buffer) {   // Create a cell that package the data   let chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES);    const b = chunks.reduceRight((curCell, chunk, index) => {     if (index === 0) {       curCell.storeInt(SNAKE_PREFIX, 8);     }     curCell.storeBuffer(chunk);     if (index > 0) {       const cell = curCell.endCell();       return beginCell().storeRef(cell);     } else {       return curCell;     }   }, beginCell());   return b.endCell(); }  function bufferToChunks(buff: Buffer, chunkSize: number) {   let chunks: Buffer[] = [];   while (buff.byteLength > 0) {     chunks.push(buff.slice(0, chunkSize));     buff = buff.slice(chunkSize);   }   return chunks; }  export function buildOnchainMetadata(data: {   name: string;   description: string;   symbol: string;   decimals: string;   image: string; }): Cell {   let dict = Dictionary.empty(     Dictionary.Keys.BigUint(256),     Dictionary.Values.Cell(),   );    // Store the on-chain metadata in the dictionary   Object.entries(data).forEach(([key, value]) => {     dict.set(toKey(key), makeSnakeCell(Buffer.from(value, 'utf8')));   });    return beginCell()     .storeInt(ONCHAIN_CONTENT_PREFIX, 8)     .storeDict(dict)     .endCell(); }

O: Morning, does anyone has working code for ston dex swap TON <> Jetton  v0.5 ? How to properly send transaction using @ton/ton library ? Example with DeDust DEX works great and no question there... Here is my example https://t.me/tondev_eng/56776 The transaction goes out and return back, so prob internal message is not correct

🐮: hi,Is there a way to convert the address of ton into the address of eth?

Baron: Through USDT (reply to 57051)

Bear: That make sense! (reply to 57028)

Matthew: https://tonscan.org/tx/CZO7tMu3ZoPquss90_IaI9z0tXJs9Cd3NkbjtQfyaAQ=  https://tonscan.org/tx/C1zTUnTuO9dRvj_ftid_eJRVsddNi9J-sofovjtQoy8= hi alll why 1 transaction but 2 hash? how sync it?

SpacyLion: Hello! How to make so Mini Apps pop upp will cover whole screen, not just 1/2?

JuunS | Part of Manexus | Web3 Dev: Hi guys, I have this message, how to check if the variable exists ya?

Heydar: who built the https://github.com/ton-blockchain/ton repo on ubuntu(22 if it does matter for you)??

Heydar: or even fedora | windows. (reply to 57073)

Acmos @thesonicsociety: Ton is down? Cant swap.

&rey: Unlikely. Perhaps Tonkeeper's interface to TON is down. (reply to 57078)

Acmos @thesonicsociety: Hm odd (reply to 57079)

Greg: same. all the explorers are showing old data, its not just tonkeeper, mytonwallet is flipping between two different balances periodically... seems like the network is split or something (reply to 57078)

O: How to get transaction hash, fees amount using @ton/ton npm lib ? seq number has been changed,  I assume - getTransaction method as for params  address - ok make sense lt - what is this? hash - what hash? from transfer.hash() ?

𝓜𝓪𝓳𝓲𝓭 $X: Hi. Now there are delays in the TON network?

Deny: Any issue on Ton Network?

&rey: In TON, no. Some APIs may be slow, yes. (reply to 57088)

𝓜𝓪𝓳𝓲𝓭 $X: I swap ton to gram an hour ago with mytonwallet. But not added to my account (reply to 57089)

&rey: Could you state your wallet address? (reply to 57093)

𝓜𝓪𝓳𝓲𝓭 $X: UQD9nA0kc_0sZ5sOGyE7XuXiHnaZ4eNIJmHpK6o0_KdAOWyB (reply to 57095)

Igor: Hi everyone!  I have a question about a transaction - how can I get a response about the result of the transaction?Here's my case - I have a Telegram mini app with a web game. In the game, there are boosters that can be purchased with TON. I use @tonconnect/ui. When I click the button to buy a booster, I use sendTransaction and after that, the game window closes and the mini app with the wallet opens.Since the game window is closed, I can't check the result of the transaction completion. How can I check whether the transaction has been completed or rejected in such a case?

Kenny$$Shillz: U can check the list of recent transactions on that wallet to (reply to 57100)

Greg: its back to normal for me, wallets and some api's fixed (reply to 57093)

Bear: hi guys, what is the best way to use NFT to do the IDO? TonRaffles?

Bear: we are doing the research to launch IFO, but can't sure we need to build contract our own or is there any solution already. Thx

User<6861867033>: I think you should check your wallet's transaction history. (reply to 57100)

User<6861867033>: was the tx is run and failed?  or the error is preventing tx? (reply to 56776)

O: run and failed (reply to 57116)

User<6861867033>: can you give me url? (reply to 57117)

&rey: Please prefix links with some text.

User<6861867033>: Plz provide tx hash (reply to 57117)

O: https://tonscan.org/tx/CItSOIA5IrhFqAe7fZrP7vnid2pj4h2Z8YTLh2HZZO8= (reply to 57118)

User<6861867033>: Easy, if you have enough TON in wallet the error will disappear (reply to 57121)

Arthur: Who is using visual studio code here

🍙 G: me (reply to 57123)

Aleks: We make payments on TON Connect. Payments are sent, but we don’t understand where the response comes from that the transaction was completed. When the payment goes through, it opens the wallet and our game closes, therefore it cannot receive a response. How to get a response about the transaction status

Alex: There are two ways of getting information about your transaction, which is sent using TONConnect.  First thing that you have to know is that TONConnect returns only the message you sent to blockchain, it doesn’t provide any tools to get a transaction id or any other information.   - You can use an indexer and its API  - You can scan the blockchain by yourself and find the transaction by the body hash of the message, that TONConnect returns.   keep in mind that sending two same transactions at the same address will result the same body hash (reply to 57128)

User<6861867033>: You should check your wallet's tx list  and try to find the tx you sent (reply to 57128)

O: https://docs.ton.org/develop/dapps/cookbook#how-to-find-transaction-for-a-certain-ton-connect-result ? (reply to 57128)

Aleks: Thanks guys

O: How do you guys parse such transactions, is there any library ro something to simplify the process depends on transaction kind/type ?

User<6861867033>: The most significent exmaple api is TONviewer API. (reply to 57134)

User<6861867033>: You can see polygon at the right-bottom on tonviewer webpage Click it (reply to 57134)

Quntul 🇯🇵: Hallo

Quntul 🇯🇵: Why are the mainet and testnet addresses different?

Quntul 🇯🇵: Will it affect when we receive the gift?

Quntul 🇯🇵: Meanwhile, the address when working on testnet tasks is different from the mainet address

User<6861867033>: Yes address between testnet and mainnet is totaly different (reply to 57160)

Quntul 🇯🇵: How about this ? (reply to 57160)

User<6861867033>: Yes ofc (reply to 57162)

Quntul 🇯🇵: Oh, I mean, I'm working on a testnet project, of course with a testnet wallet, so when I get a prize, will the prize automatically go to mainet?

User<6861867033>: Maybe (reply to 57164)

K.: Not sure what you mean by "prize", but assuming it's just TON, then if it's sent in mainnet to your mainnet address - you'll get it on mainnet. If it's sent in testnet - that's where it will end up. (reply to 57164)

&rey: If you mean a hackaton, you'd better create separate mnemonic for mainnet and provide the corresponding address. (reply to 57159)

&rey: Jury isn't that interested in which wallet you used to test the project.

Wukong: just follow up his question, if I have a testnet address, can I convert it to mainnet address?

User<6861867033>: No it can't (reply to 57169)

Wukong: thank you

&rey: You shouldn't; due to some past misunderstandings, transactions on testnet wallets can be replayed on mainnet (and vice versa), which is not good at all and would probably make you lose some TON. (reply to 57169)

Optimus: anyone? 🫶🏽 (reply to 57031)

Dmitry | backend4you.ton: https://minter.ton.org/?testnet=true (reply to 57034)

Klay.D: hi, How to simulate transaction on the dapp side to prevent user from submit failed transaction. In EVM, dapps often use estimateGas call to determine whether transaction about to be submitted could succeed

&rey: Use @ton/sandbox. (reply to 57180)

Heydar: I want to know which flags you used. if we have someone, please reply, thanks ❤️ (reply to 57073)

Culp: is there anybody looking for a dev?

Johan: Is that possible to check or inspect info about each transaction and recognize, if its swap transaction or not?

TON Bounty Bridge: ​Cruz serrato  Created by Cruzserrato

Maxey: How can I declare an Address? in FunC's global variables? It might be a nullAddress.

— 2024-05-05 —

Oscar: Hi guys, in the minter.ton.org source code, which .fc files should I edit to take an additional fee for every transaction?

User<6861867033>: I think there's no need to create null address. Why do you want to do that? (reply to 57200)

User<6861867033>: You can use TONViewer API. Plz open Tonviewer on browser and look right bottom to find ploygon icon. You 'll get everything from there. (reply to 57196)

semi invader: hey guys! How can I store 3 addresses (slices) in a dict. From what I've tried the addresses aren't being stored correctly expecting to get 3 addresses as slices after the intial int but tried to parse all 3 as addresses and it's failing

User<6861867033>: I'm sorry but is this py? (reply to 57217)

semi invader: it's using blueprint TS. reading the Stack on the tests

User<6861867033>: Can you show me failing code? (reply to 57217)

semi invader: This is how I'm saving the data: builder pool_data = begin_cell()             .store_slice(stake_wallet)             .store_slice(reward_wallet)             .store_slice(pool_address)             .store_uint(staking_storage::pool_count, 32);                      staking_storage::pool_dict~udict_set_ref(256 , staking_storage::pool_count , pool_data.end_cell());  and then reading it like: (int,  slice,  slice, slice, int) get_pool_data(int pool_id) method_id {     load_storage();     (cell data, int success) = staking_storage::pool_dict.udict_get_ref?(256,pool_id);     if(success){         slice ds = data.begin_parse();         return (             success,             ds~load_msg_addr(),             ds~load_msg_addr(),             ds~load_msg_addr(),             ds~load_uint(32)         );     }     slice zero_address = begin_cell().end_cell().begin_parse();     return (success,  zero_address,zero_address, zero_address, 0); }

semi invader: updated since it had defined cell instead of builder

User<6861867033>: Did you tried udict_set_builder? (reply to 57223)

semi invader: Is that a thing? I haven't but will try and report back (reply to 57226)

User<6861867033>: cell idict_set_ref(cell dict, int key_len, int index, cell value) as you can see parameter is Cell not Builder (reply to 57227)

semi invader: ok so the question is now, how do i read the builder?

User<6861867033>: Not sure what you used udict, idict, or dict

semi invader: ok great! Thanks

User<6861867033>: Sorry I confused.  Plz see doc here https://docs.ton.org/develop/func/stdlib#builder-counterparts (reply to 57237)

semi invader: ok so it compiles and runs. but the data shown on local is still pretty much shite (reply to 57238)

User<6861867033>: Is there any problem on SET action? (reply to 57240)

semi invader: maybe, but not sure how to debug that process

User<6861867033>: Did you tried to return stake_wallet? in method_id? (reply to 57222)

semi invader: those fileds come from values i send in the frontend. (slice stake_wallet, slice reward_wallet) = (in_msg_body~load_msg_addr(), in_msg_body~load_msg_addr());

semi invader: and those are working

User<6861867033>: Can you show me TX?

semi invader: I have the txResult but it's a very long thing to send here (reply to 57246)

User<6861867033>: Did you load flag and sender address before this operation? (reply to 57244)

semi invader: Maybe the issue is how I'm loading the data into the global state? staking_storage::pool_dict = new_dict();     if (~ slice_empty?(ds)) {         staking_storage::pool_dict = ds~load_dict();     } (reply to 57248)

peilipu: 请问ton有办法覆盖一笔交易吗

Ruslan: https://t.me/tondev_zh (reply to 57251)

User<6861867033>: At ton chain it's possible to change the smart contract. but the CA will change after modify (reply to 57251)

Mikey: You have to use a dictionary reader for the cell data  const data = Dictionary.loadDirect(Dictionary.Keys.Uint(64), Dictionary.Values.Address(), CELL_DATA_HERE) (reply to 57217)

semi invader: Right but this is from the frontend side. I'm (supposedly) already parsing through the dictionary and returning the individual values here (reply to 57222)

semi invader: 👈👆 (reply to 57262)

Mikey: There’s a possibility that you encapsulate it as cell ref, you have to extract the ref first from cell and load it as dictionary

peilipu: hi, how to simply determine the transaction status is successful or failed

Johan: where is this ploygon icon??? (reply to 57216)

User<6861867033>: did you opened Tonviewer webpage? Plz have a look on right-botton. There's gray polygon. (reply to 57274)

User<6861867033>: Plz search your wallet's tx list and find your tx to check if is successful or failed. (reply to 57269)

princekamil: Hello I’m looking for DEV who can help with NFT metadata and upload on tonraffles requirements 💎 priv

Johan: There is no any gray polygons in page, I didn't get what you meant.... (reply to 57276)

User<6861867033>: Uh You opened in mobile!. Plz type in any address into query. and here (reply to 57281)

Johan: ? (reply to 57283)

Johan: Okay, can you show, please, how actually swap transaction looks like in ton blockchain? (reply to 57282)

User<6861867033>: Here's ston.fi and dedust swap example TX. (reply to 57287)

Johan: hmm, I see, ston.fi is like a raydium but for TON ? (reply to 57288)

User<6861867033>: Yeah you're right. Do you have exp on Solana? Dedust is too (reply to 57291)

Johan: yep i do, I have exp on solana (reply to 57292)

Johan: I appreciate your help (reply to 57292)

Louis: Which wallet supports testnet?

User<6861867033>: Tonkeeper, Tonhub etc.... (reply to 57297)

&rey: It's worth noting that swap is not one transaction but like 6-7. (reply to 57287)

O: Is there any library like this with same functionality but written in TypeScript - https://github.com/xssnick/tonutils-go ?

User<6779439263>: who needs a dev?

User<43817863>: Anyone else received this ?

K.: probably a scam, just ignore (reply to 57308)

User<43817863>: Wondering they don’t want the 24 words just a wallet connect 😂 (reply to 57309)

&rey: That's reported to be a drainer. Be careful. (reply to 57310)

K.: Rule of thumb is: if you receive something you have not been expecting - it's probably a scam :)

User<43817863>: I don’t want to connect just asking if anyone have info about ir (reply to 57311)

User<43817863>: Yes (reply to 57312)

User<43817863>: How can I „burn“ nfts in TonKeeper? Any clue ?

&rey: Usually better to not touch them, but you can also send them to arbitrary address (if they support that without using up much TON). (reply to 57318)

&rey: Though, transfer might be locked or require more than 1 TON to be sent to scammer. (reply to 57319)

User<43817863>: Ok so I will see this the whole time now haha (reply to 57319)

User<43817863>: At least, the design isn’t that bad (reply to 57322)

User<43817863>: 0,05 transfer fee

Behrang: Some wallets like Tonkeeper allow you to hide them. (reply to 57322)

User<43817863>: How ? (reply to 57327)

User<43817863>: Ah got it, thanks ! ☺️  (For everyone who also searches: Wallet -> Settings -> Tokens ) (reply to 57327)

Erik🆓: https://www.youtube.com/watch?v=wnVgnOhDcCE (reply to 57308)

&rey: I've created "Universal Blockchain Interface" 🤣 Well, I mean, wallet contract having features of version 5: inplug-v2 at https://github.com/ProgramCrafter/wallet-contract/. One can interact with it using TypeScript code, since I'm not knowledgeable in writing wallet applications.  It has traits of existing wallets and additional functionality: — can send money, as any wallet since v1 — allows to send many (255) messages in one transaction, as preprocessed — has plugins system, as v4r2 — plugins are separated into trusted and untrusted (with limited invocation frequency, amounts to send and opcodes — to stop unwanted NFT/jetton transfers) — allows to invoke code onchain.  There are two plugins-examples in repository, one showing how to write a plugin and second which helps to load block random seed. Other potential application is selling jettons without a DEX (and maybe even directly minting them).  I highly doubt there are any bugs so would be surprised if one is found!  ℹ️ This is not an official contract by TON Foundation; instead, it is provided by me.

Gyorgy: Looks really nice. 👌 I thought first for Wallet interface W5, would have been a really fast refactor. (reply to 57333)

&rey: I'd guess I created my implementation (inplug-v1) earlier than Tonkeeper. (reply to 57342)

Heydar: how they can accept the bug of TON(https://github.com/ton-blockchain/ton) that is critical and the user can win 100k$? How do we know that this is not a matter of taste?

🌱idah: Let me introduce myself, I'm Sofwan from Indonesia. I have a crypto coin project called JIWA with contract: EQAKWQsO3AUqL8-z7aBasvMmBk6_pGxhaFEdtR8lDI5In21T The idea of my coin crypto project is based on the number of human souls in the world, from all the humanitarian events that are happening in the world today, the question arises, what is the price of a human soul? I hope that with this idea the JIWA crypto coin project can develop, with my limitations, I want us to work together to develop this project in the TON community. Thank you for your attention, hopefully we can work together to develop this project.

K.: Critical bug is something severe, like finding an ability to send TON from other people's wallets without them doing anything. That's why the bounty is quite high. Not sure what you mean by taste, but there are guidelines on how bugs are ranked. (reply to 57350)

Heydar: I mean exactly that. because someone can do that imediately instead reporting. but if he report that (good guy) how he can be sure that he take the prize. thanks for the guides. what's that guidelines ?(do we have any link) (reply to 57360)

K.: There's a bug bounty bot, found in: https://github.com/ton-blockchain/bug-bounty. I am fairly sure bugs are reviewed by humans so nothing will happen automatically. (reply to 57362)

lafi: pls i have a question ??🥲🤲

Fereshte: Is there a way to set derivation path for ed25519 private keys in java libs?  I couldn't find any

lafi: pls if a project creates a clicker game or a mining game and the users and running these activities what does the owners gain from this pls

&rey: It is not common in TON. (reply to 57371)

yieni: Hi guys! I'm experiencing a weird issue with ﻿client.getTransactions. It returns an empty array, but there are clearly two transactions in the explorer. Is this a bug?  https://toncenter.com/api/v2/getTransactions?address=EQAIookZTNfeO__SmEdeiG1ogDSFUgkB4BHBdeGGCYTWyEIL&limit=100&to_lt=0&archival=false

MA: hello guys I am writing an smart contract that works with Jettons, in some case I should be able to prevent user to deposit Jetton to my contract Jetton_wallet.  how can I do that? should I create a transfer transaction to send back user amount to their Jetton_wallet  or it is some functionality like EVM based blockchains to reject the transfer? I realize the user transfer after getting transfer notification in my contract

&rey: Yes. (reply to 57382)

&rey: You won't be able to "reject" transfers with no forward amount, though.

&rey: And you shouldn't send back jettons if forward amount is insufficient to cover that, actually.

Fereshte: But i need it to create trust wallet ton address (reply to 57379)

MA: So if forward amount is sent I should send back with another transfer, correct? (reply to 57387)

User<6778138666>: Hi guys, we are currently in the final stages of development. Should we perform the server verification process during wallet login?

User<6778138666>: We are in that process: https://docs.ton.org/develop/dapps/ton-connect/sign#examples-of-ton-proof-verification

Think: Yes I've been contacted

Think: I want to join the steam train  Last night had someone trying to sign in my wallet please be careful all

&rey: What is your problem? (reply to 57404)

&rey: Fill fields that you know, and list fields you don't know how to fill. (reply to 57406)

&rey: Collection content is URL for its content JSON file. (reply to 57408)

&rey: Collection base is the denominator of royalty fraction.

&rey: Connect wallet in top right corner. (reply to 57408)

User<6778138666>: Hi bro, we are currently in the final stages of development. Should we perform the server verification process during wallet login? (reply to 57409)

&rey: If you already have a backend and authorize actions based on connected wallet, then sure, you must. (reply to 57415)

User<6778138666>: Thx, I will check with the developers. (reply to 57417)

&rey: Royalty is (or should be) factor divided by base. (reply to 57419)

kevin: try replace to_lt, with last lt of masterchain block. (reply to 57381)

Kushagra: Hi everyone, I am working on a FunC smart contract which internally does three internal transfer of TON and USDT.   Currently, it works but if for some reason any one of the internal transfer fails, I need to make the other two transfers reverted. Basically, need to do the three transfer atomically. Please suggest some ideas here. Thanks in advance.

Think: Can I have some help

User<7174392301>: is there anybody looking for a developer? please dm me if you need a dev.

RiSSE: Hello friends!  I'm reading the tontools instructions and I can't find a method to get the balance in TON’s, I only see it in tokens (Jetton)

&rey: You can send them without flag +2, then either all messages will be sent out or none will. (reply to 57424)

&rey: Throw in +16 flag and TON will bounce as well.

User<5887205274>: Hey guys I'm new to the Ton eco system, Nice to meet you all

Sina: how sign message without send to blockchain ?

&rey: TON Connect 2 does not support this. (reply to 57450)

Sina: how can i do it without tonconnect ? (reply to 57451)

JuunS | Part of Manexus | Web3 Dev: HI guys is there any jetton tact? because I'm trying it but its not defined as Jetton contract type in tonscan

昊京无敌666🧢: How to generate a signature locally? (reply to 57451)

昊京无敌666🧢: for data verification within a contract

昊京无敌666🧢: any example code?

昊京无敌666🧢: now the signatures cannot be verified correctly

&rey: Here you are: https://github.com/ProgramCrafter/wallet-contract/blob/c4e9271abae8abe554a82e7d34f8c87b073acd8e/wallet-inplug-v2.ts#L150 (reply to 57455)

User<5887205274>: Hey guys if  anyone needs a UI designer, I'm happy to help

Felix: Here is an experienced frontend and smart contract engineer looking for ongoing projects now. please let me know if you are in need of my help.

User<6861867033>: Hi this is full-stack & TON blockchain developer and looking for work. Plz ping me if any project need my hand.

User<1920239264>: /

User<5593733297>: Hello can anyone help with 2-3 testnet ton.  0QCEBoCcSjnEqU20Byds2hJphp3LNpl3GsbhthonZuLN6Mr_  Note- Bot is slow

User<6861867033>: testnet? (reply to 57476)

User<5593733297>: Ya

Abdulaziz: @admin if i became popular ton developer, then can i be admin here?

User<6861867033>: Your smart contract is not exist (reply to 57476)

&rey: There is not a binding "if-then" chain; also, I don't see much problems with the chat except maybe that it drifts into job offers and counteroffers. (reply to 57483)

&rey: Actually, @[Remmy], @felix0xdev, @Dev_Aurora, please consider using https://t.me/tonhunt.

Abdulaziz: So it's yes or no? (reply to 57485)

&rey: You may apply. Message @f_closer if you so choose. (reply to 57487)

0xNuejo: Hello all anyone knows how to abilitate ads on a telegram channel? I’m the owner of a 7k+ members channel and I tried following the instructions on the fragment website but if I open the statistics in my channel I see no “Monetization” section, only statistics

Alex.: Good evening. Does anyone have any links to a collection of tasks, like Ethernaut, but from the FunC world. Or (it would be amazing) examples of test tasks that you have met?

Sumit: How can i create a STON.fi Swap message on the chain. I am using tact?

Sumit: message(0x25938561) Swap  {     askJettonWalletAddress: Address;     minAskAmount: Int as coins;     userWalletAddress: Address;     referralAddress: Address?; } this wouldnt work i presume

Abdulbari: I'm  trying to sent my  netcoin voucher   from my ton keeper wallet   to  ton space wallet.  I make mistake   sent it to my toncion wallet address.   Instead of  ton space wallet address

Cooop: Anyone had issues with most recent blocks and pyth?

Cooop: https://github.com/yungwine/pytoniq/issues/23

Mikhail: Hello everyone. Do somebody know a way to find out which Jetton was sent from the transaction data? The only way I have found is to compare the recipient's Jetton wallet with an address generated from the Jetton contract address.

— 2024-05-06 —

User<6352093858>: How do I set how much the supply is in my Jetton code?

&rey: Could you find out specific block ID which fails? That is, is it masterchain or a shardchain block? (reply to 57502)

&rey: That's it. If there was a field with jetton master, you still could not trust it, by the way. (reply to 57507)

&rey: Throw error on mint if that would result in too many jettons. (reply to 57518)

&rey: TON transactions are irreversible. (reply to 57498)

User<6352093858>: Not sure what you mean I just want to know how to set supply. (reply to 57523)

User<6352093858>: I have been trying to set a supply and mint but I cannot.

&rey: You simply mint. (reply to 57526)

User<6352093858>: How do you do that? I am using blueprint to deploy. (reply to 57527)

User<6352093858>: Do I set a supply in the code or do I somehow have an option to mint?

Mikhail: Thank you. Does the same rule apply to the jetton amount? I was sure that this data is passed to the out_msgs.message_content.body field, but so far I haven't found a way to decode it. WalletClass.parseTransferBody works for TON translations, but not for jettons like USDT (reply to 57522)

User<6352093858>: I am deploying a func contract and using blueprint to deploy it via command line.

N - RFNW: How to renounce ownership my token?

seven: How to burn scam NFT?

NB: I worked on testnet and got an error: No healthy nodes for v4-testnet. Is there any problem with testnet

Vanessa: Hi guys, how can I submit my project to Ton Raffles?

Arthur: The testnet is down, right guys?

tututu189: When I was withdrawing, it prompted me that KYC had failed

&rey: It isn't really down, just hard to reach. (reply to 57546)

&rey: Transfer it to any address you want, making sure that it doesn't require all your TON to be sent somewhere. (reply to 57540)

&rey: Once you've validated the message comes from your jetton wallet, it can be trusted. (reply to 57534)

&rey: However you intended to do that; wrappers are a viable option. (reply to 57532)

&rey: There is no step of setting total supply.

Rick: how can  I get jetton transactions or listen to transactions  with golang, thanks for any help

Milad: in the last part of this document it mentions that In the near future, all wallets in TON are transitioning to the non-bounceable format. will it effect on the Raw(hex) address format too? or just the bouncable format will be remove? https://blog.ton.cat/ton-address-formats/

Wukong: is there any website to check the status of TON testnet blockchain?

&rey: They have. No, raw address has nothing to be affected. No, it won't be removed. (reply to 57563)

Sunny: Hey, connector.wallet.account.address this gives some random public address instead of the connected wallet address.. any clue ?

Alex.: Good morning: What could be the problem when initially setting up TONCLI and specifying the location of the FunC executable?  Path: /usr/bin/func ERROR: [Errno 13] Permission denied: '/usr/bin/func' WARNING: 😅 Path is not correct, please double check it WARNING: 🤖 Can't find executable for func, please specify it, e.g.: /usr/bin/func By the way, TONCLI was run from Python3 virtual space, in case it's important. OS: Ubuntu 23.10

Alex: Testnet work?

Glitch: Can someone help me understand why anyone would need to know the differences between raw addresses and user friendly addresses when raw addresses are inferior to user friendly addresses?

Glitch: Do we need both? Can’t we just stick with one?

Codex: raw addresses are the source of truth for the chain itself (reply to 57574)

Mike: thanks, this works. However I have to use as any because jettonAmount param does not exist in tonweb TransferBodyParams. Would it possible to add it? And also amend the documentation so the code example in there actually works? (reply to 57035)

musashi: when it could be back normal, sir? (reply to 57549)

musashi: the wallet keep saying 'Network overloaded'

&rey: I don't really use testnet. (reply to 57582)

musashi: my project is on the QA phase =(

musashi: hope it be ok soon

ℝ𝕒𝕤 𝕁𝕦𝕟𝕘𝕝𝕖 🦆⃤💹 🧲: yooo

ℝ𝕒𝕤 𝕁𝕦𝕟𝕘𝕝𝕖 🦆⃤💹 🧲: Anyone able to build ?

ℝ𝕒𝕤 𝕁𝕦𝕟𝕘𝕝𝕖 🦆⃤💹 🧲: meme generator  mini dapp

Amir: hi guys im new to funC can someone help me why i cant use load_unit() && store_unit() in blueprint ?

minhtienhcmus: Is the RPC v4-testnet currently experiencing an issue? i deploy contract but error “Error: no healthy nodes for v4-testnet”

K.: yes, testnet is a bit overloaded right now (reply to 57602)

minhtienhcmus: Is it possible to build a local network for development?

minhtienhcmus: I don't know how to create it yet please help me :))

&rey: Because it's not "unit" but "uint" 😁 (reply to 57598)

&rey: Use @ton/sandbox for testing. (reply to 57606)

bc1only1: Hello everyone, could you please share if you know any projects built on the TON blockchain that integrated Redstone Oracle contracts?

слава беброу 🧌: Hello, how do I get more coins tone than through a test giver bot? I'm testing the Maincard app, and I really don't have enough of my coins to test all the features of the app

Fractured: How’s everyone doing on this fine monday? I guess it’s time to stop lurking and start networking and meet a few new people around here

Baron: I think so too) (reply to 57613)

Amir: tnx man (reply to 57607)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 58 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 35  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

On-Chain ⛓️: What best API can I use to create a trading bot?

Adam: gekoterminal

Adam: and

Adam: can t type the name here lamo

On-Chain ⛓️: Lol  Thanks man (reply to 57627)

&rey: You might've hit rate limit of 1 msg / 10s. Have you meant to say "tonapi.io"? (reply to 57627)

User<6861867033>: Hi guys. To process the NFT on Wallet which api is the best choice?

Adam: yes tonapu

Nerses: Hi everyone. How can I interact with deployed smart contract on testnet (send innner message) ?

Think: Developer doing ?

Nerses: both developer and any other party (reply to 57637)

MA: Hi everyone,  In standard Jetton contracts, these functions are used to calculate the Jetton wallet address. However, there are some uint (unsigned integer) bits as it marked in picture.  What are these bits? Are they the same for calculating addresses of any contracts? If they are specific in jetton_wallet contract, what is the cell structure for caculate another contract address?

musashi: hey guys, is the mainnet get overloaded too?

&rey: Nope. (reply to 57644)

musashi: my transaction get pending for a while and then it disappeared from tonviewer explorer

musashi: just sending jetton transaction

MA: dose anybody know the answer or any tutorial or document for this? (reply to 57642)

&rey: Which API did you use to send it? (reply to 57646)

musashi: toncenter sir (reply to 57655)

Wukong: does testnet recovered yet?

Think: What design too (reply to 57638)

Think: We can do a meter verse

Nerses: what is it ? (reply to 57659)

Think: Complete walk though for everyone to see how to work buy trade

Think: Visually

Nerses: I just createed smart contract where users can swap their funds just calling functions of that contract.Now I want to test it and interact with contract (reply to 57658)

Think: Nice " that will make it easier for people to swap safer platforms

MA: ? (reply to 57642)

User<6352093858>: So if I have a Jetton token I cannot set total supply in my contract? (reply to 57553)

Think: Trying to buy ton

Think: But wallets not accepting trade

Luis Daniel ,Ⓜ️ MEMES▪️🐾: How can I deploy a contract to the testnet?

&rey: Right now, you can't. (reply to 57676)

&rey: Perhaps @ton/sandbox can help you? It's reliable enough that you can deploy to mainnet right afterwards.

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Thanks (reply to 57680)

&rey: Have you tried it on @ton/sandbox? Also, what approach are you using to get user's jettons? (reply to 57664)

Nerses: Yeah I tried sandbox and wrote some tests But I want to understand how it will work in reality (reply to 57682)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: No, I have never used @ton/sandbox.... But hey, you learn. (reply to 57682)

&rey: Those are flag bits, same for almost all contracts. (reply to 57642)

&rey: (System contracts, or contracts with libraries stored, may have other flags in state_init. In address, initial bits are always those.)

musashi: hey guys, how can I create client object with TonClient and tonapi endpoint  const client = new TonClient({         endpoint: 'https://testnet.tonapi.io/v2',         apiKey: 'MY_API_KEY'     });

&rey: Any route may fail occasionally, with different (but always low) frequency. (reply to 57656)

musashi: this code works with toncenter (reply to 57687)

musashi: yes, now I want to try tonapi endpoint

musashi: do I need to put /v2 at the end of the endpoint?

&rey: They are not compatible. However, if you have signed transfer cell, you can send it with simple fetch. (reply to 57687)

musashi: which package is compatible with tonapi endpoint sir? (reply to 57693)

&rey: I don't know, maybe there is an SDK recommended in their docs? (reply to 57695)

User<231577642>: Hi, guys. Who can help me with the following problems: I sent 10 TONs via testgiver, but tonkeeper shows 0. I see 2 transactions on testnet tonscan. tonkeeper switched to test net. tonscan shows contract is inactive

&rey: This is irrelevant to contract having balance or not. (reply to 57697)

&rey: Reliability of blockchain interfaces leaves much to be desired recently. (reply to 57697)

User<231577642>: but how can I activate it without sending outgoing transaction? Probably that's why tonkeeper shows 0 - contract is inactive. (reply to 57698)

User<6352093858>: Oh so that is why my contracts don't do anything? (reply to 57679)

&rey: I doubt contract being active would fix Tonkeeper display. (reply to 57701)

User<231577642>: but is there any way to fix this? I can't understand why contract is inactive if I already made 2 transactions on blockchain, and also how to make tonkeeper see transactions (reply to 57707)

Alexandr: Доброго времени суток! Кто TON Foundation занимается вопросами IusTech? Подскажите контакты или имена?

&rey: That's quite easy: no one has provided its initial state to blockchain, so it cannot be active. (reply to 57708)

User<6352093858>: I am able to deploy to testnet but you say it doesn't work. (reply to 57704)

&rey: It doesn't always work: APIs are unstable recently. (reply to 57711)

User<231577642>: no sure I understand it. when I create a wallet it should deploy a wallet contract, or if it's delayed - it should deploy it with 1st transactions. I already made 2! (reply to 57710)

&rey: It is deployed once you make outgoing transaction (under the hood, external message to the wallet with StateInit attached) or ingoing transaction with StateInit attached. (reply to 57713)

User<231577642>: but how I can send outgoing transaction if I have no balance on account? or transactions like signing etc are counted as well? (reply to 57714)

&rey: You can use some app other than Tonkeeper, that will actually see that you have nonzero balance. (reply to 57715)

User<231577642>: can you recommend something which just "works"? (reply to 57716)

&rey: Perhaps OpenMask? You can see the list of reviewedly-safe applications on https://ton.org/wallets. (reply to 57717)

User<231577642>: this cannot even import my wallet - stuck at "verify your identity" (reply to 57718)

User<231577642>: openmask (reply to 57720)

User<231577642>: yes you're right. myton works fine and shows me amount. contract is active now, but tonkeeper ... (reply to 57714)

Kos: Hello Please advice Seamless auth in mini app doesn’t work. The authorization method by pressing button works, hash and the fields are compared (hashed) - the signature is correct, we get the token.

&rey: What is that "token"? I don't remember such in TON Connect 2. (reply to 57724)

Kos: We used that one  https://core.telegram.org/api/url-authorization (reply to 57725)

&rey: Please refer to @twa_dev, since such auth is not relevant to this chat. (reply to 57727)

Kos: Thanks, appreciated   And ton connect works through authentication via ton wallet am I right? (reply to 57728)

User<5509177195>: Hello TON Devs!  Anyone experienced writing contracts in pure C++? It is mentioned in docs but no examples are provided.

User<5509177195>: https://docs.ton.org/develop/smart-contracts/core-contracts/precompiled (reply to 57737)

X: Hello! Is there any chat for mini-apps or game developers ?

Think: Yes plenty of ideas

Think: I need an app built

Think: For a project

&rey: You still need to have a corresponding TVM assembly. (reply to 57737)

Abdulaziz: @admin It's possible to create web 3.0 domains registration service for ton Blockchain? Creating .ton domains registration service

&rey: 1. Please stop pinging admins without reason. 2. There IS dns.ton.org; what you mean, if not that? (reply to 57750)

Abdulaziz: I mean i wanna create my own service for registating .ton domains, if it's possible? (reply to 57751)

Abdulaziz: Like web 2 domains registration service but for web 3.0 in Blockchain ton

&rey: If you have got some pool of .ton domains in ownership, I guess you can subdelegate them. (reply to 57752)

Alice: Hey, trying to make a transfer using Tonkeeper wallet but keep fail on testnet. Anybody know why?

Abdulaziz: So it's impossible to create.ton registration service but i can sell domains which i have? (reply to 57754)

User<5509177195>: What do you mean? As far as I know precompiled contracts are executed avoiding translation to TVM bytecode. (reply to 57747)

&rey: Precompiled contract is meant to replace heavily-used contract in TVM assembly so that it's cheaper to run. Possible examples include DEX contracts, v3r2 and v4r2 wallets. (reply to 57758)

&rey: It isn't a tool to work around TVM limitations.

TON Bounty Bridge: ​Support Tact v1.3.0 for tact-vscode  🏷 Developer Tool  Summary:The community ask to improve the tact-vscode tool (already >1.4K developers use it)  Created by logvik

Cube: Is there any way to check from the contract that address is the NFT item?

&rey: No. (reply to 57768)

Andrey: who worked with @ton/sandbox how to wait unitl all of messages triggered by transaction? I have like A->B->C contract messaging, and I get only those, from A and B contract, but not the C. Is there like "depth" setting or smth?

K.C££: Hello

Johan: Does anyone know or could send example to fetch information about each transaction through their hash?

Johan: I have used sharding, but it's not stable....

Wukong: same question, is there anyway to wait and get result for all mesages in that transaction (reply to 57778)

Johan: It's really weird.... but I still can fetch transactions

&rey: Does state of contract C change? Do you send enough TON for its TVM to launch? (reply to 57778)

Andrey: C should be deployed within the tx, as its a wallet, and its not exist after tx is finished. Gas should be fine, but I'll double check it, thx. I'm now almost sure that its logic cause inside my A contract, but I'm also swithing to another framework for testing(`@tact-lang`), it seems like its more flexible (reply to 57792)

Andrey: and my IDE is getting crashed all the time😂 ton development.. ;)

Jorge: Hey guys. Trying to get jetton data

Jorge: with TonTools python lib

Jorge: it works well with Hydra, for example, but doesn't work with USDT

Андрей: hi everyone, how can i solve problem with blueprint error : no healthy nodes for v4-testnet or i just need to wait

Jorge: >>> hydra_data = await client.get_jetton_data('EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_') >>> hydra_data.decimals 6 >>> hydra_data.name 'Hydra'   >>> usdt_data = await client.get_jetton_data('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs')  Traceback (most recent call last):   File "TonTools/Providers/TonCenterClient.py", line 287, in get_jetton_data     result = process_jetton_data(data[3][1]['bytes']) if isinstance(process_jetton_data(data[3][1]['bytes']), dict) else await get(process_jetton_data(data[3][1]['bytes']))   File "TonTools/Providers/utils.py", line 28, in process_jetton_data     symbol = Cell.one_from_boc(b64decode(data)).refs[0].refs[1].refs[0].refs[1].refs[0].bits.get_top_upped_array().decode().split('\x00')[-1] IndexError: list index out of range

Jorge: any clue what might be happening?

Christopher: Hi everyone

Christopher: Does anybody know a way to change the logo of a project with a renounced Jetton? A community take over so no original deployer access

&rey: It is not possible unless you can change logo on server. (reply to 57807)

Christopher: That was my thought also (reply to 57808)

Christopher: It looks like it was originally hosted at Pinksale but I talked with the Pinksale dev and they said they can’t change it on their end, although it some places it looks like it is calling a ton api cache that I’m.  Guessing is also referencing the original Pinksale upload

Jorge: is there another way to get the decimals of a jetton besides this? (reply to 57804)

Bromelia: Hey! is PS already integrated with TON for IDOs? (reply to 57811)

Bromelia: Also @pcrafter I've read the past week of posts and I want to say thank you for ALL your help in here, you're great, is there a "donation" address to tip you?

Christopher: I don’t think so, I think the dev that launches it just used them to house the asset instead of GitHub or anything (reply to 57815)

Bromelia: damn, that sucks :(  If you have the url or CA, I can try to take a look. (reply to 57819)

User<6779439263>: does anyone need a front-end & contract developer?

Baron: Who needs a smart contract, web app, front end developer?)

Cube: Is there any way to call get method of contract from another contract?

Christopher: The ca is: EQBxbQytL64wuTz51KcpOLdTDSOhqrV1LaPKDrhOqLB3v4qj (reply to 57820)

Christopher: {   "address": "0:716d0cad2fae30b93cf9d4a72938b7530d23a1aab5752da3ca0eb84ea8b077bf",   "name": "Buffy",   "symbol": "BUFFY",   "decimals": "9",   "image": "https://cache.tonapi.io/imgproxy/rkb6eMmV0faj_lYAIX2YaQCZxvnXhKYFmVC6e5RIKfc/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waG90b3MucGlua3NhbGUuZmluYW5jZS9maWxlL3BpbmtzYWxlLWxvZ28tdXBsb2FkLzE3MDQ1MDU0Mzg0NjQtYWVjOTQ4NWIxNjhiMjM3OGU2MWY4MTQ2MzAzNDNlY2MuanBn.webp",   "description": "Buffy, the beloved dog of Pavel Durov https://t.me/buffy_ton" }  Here is looks like it is calling a tonapi cache that I think is calling the original Pinksale file

Christopher: https://photos.pinksale.finance/file/pinksale-logo-upload/1704505438464-aec9485b168b2378e61f814630343ecc.jpg

Christopher: This seems to be the original upload of the logo (reply to 57829)

Bwo: btw, how i can transfer 0:716d0cad2fae30b93cf9d4a72938b7530d23a1aab5752da3ca0eb84ea8b077bf to a normal wallet adress? (reply to 57828)

Bromelia: How did you get to that conclusion? I couldn't decode the tonapi cached image (reply to 57831)

Bromelia: You may want to reach out to @tonapitech and ask them if there's a way to decode the cached image original URL (reply to 57828)

•: import { address } from "ton-core"; const userAddress = "0:716d0cad2fae30b93cf9d4a72938b7530d23a1aab5752da3ca0eb84ea8b077bf"; const walletAddress = address(userAddress); console.log("walletAddress:", walletAddress) (reply to 57832)

•: i researched it myself. documentation is not well about it (reply to 57836)

•: In tact use messages (reply to 57826)

User<7174392301>: who needs a dev?

minhtienhcmus: how to create new contract  from a contract and return address contract on TON? please help me

Christopher: Because the old dev said he uploaded to Pinksale and nowhere else (reply to 57833)

Christopher: Tried to forward the replay

Christopher: It is calling p I n l k s a l e for the image

Christopher: This was the reply

— 2024-05-07 —

ㅤ: And how long it will be? (reply to 57861)

ㅤ: Yeah, but it works yesterday

ㅤ: I'm sure I've use it a two days ago (reply to 57868)

Andrey: I've switched to tact-leng framework (examples) and even though I’ve spent much time to debug, it works. And the funny thing is that exactly same contracts still don't work on "sandbox" (reply to 57789)

Baldwin: wtf testnet sir? when working on?

💥Phong: export async function transfer(   mnemonic: string,   receiverWallet: string,   amount: number ) {   try {     let keyPair = await mnemonicToPrivateKey(stringToMnemonics(mnemonic));     const wallet = WalletContractV4.create({       publicKey: keyPair.publicKey,       workchain: 0,     });     const client = await getClient();     const walletContract = client.open(wallet);     const seqno = await walletContract.getSeqno();     let transfer = await walletContract.createTransfer({       seqno: seqno,       secretKey: keyPair.secretKey,       messages: [         internal({           to: receiverWallet,           value: amount.toString(),           body: "A",         }),       ],     });     console.log("transfer.hash base64", transfer.hash().toString("base64"));     const txn = await walletContract.send(transfer);     console.log("txn", txn);      // wait until confirmed     let currentSeqno = seqno;     while (currentSeqno == seqno) {       console.log("waiting for transaction to confirm...", currentSeqno, seqno);       await sleep(1500);       currentSeqno = await walletContract.getSeqno();     }     console.log("transaction confirmed!");      return { status: true };   } catch (error: any) {     console.log("transfer", error);     return { status: false, error: error.response.data.error };   } }  I use function createTransfer in WalletContractV4. I have tried value = "1" or value= toNano(1) and I get the error: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to get account state or error: No working liteservers with ls_index=None, archive=None

ABRAHAM: change to other liteservers (reply to 57883)

💥Phong: Can you guide me to fix this error? Thanks (reply to 57885)

ABRAHAM: there are many lite servers, you get it from config right? (reply to 57888)

ABRAHAM: change lite servers index to other index

💥Phong: i use:   const getClient = async (): Promise<TonClient> => {   const endpoint = await getHttpEndpoint({ network: "mainnet" });   const client = new TonClient({ endpoint });    return client; };

ABRAHAM: change index in this function (reply to 57883)

💥Phong: I use it (reply to 57892)

ABRAHAM: send me your npm package

Johan: Guys, can you tell please, is that possible to use websockets to work with blockchain of TON, as good as with http one ???

Johan: I haven't found out the information, examples to work with websockets, but I need it

💥Phong: "@ton/core": "^0.56.2",     "@ton/crypto": "^3.2.0",     "@ton/ton": "^13.11.1", (reply to 57895)

💥Phong: yarn add @ton/ton @ton/crypto @ton/core (reply to 57895)

ABRAHAM: You can change the endpoint to other endpoint, seem your endpoint get from getHttpEndpoint not working

💥Phong: I just change:  const getClient = async (): Promise<TonClient> => {   const client = new TonClient({     endpoint: "https://toncenter.com/api/v2/jsonRPC",   });    return client; };  But i have a new error: Ratelimit without API Key exceed: 1 per second (reply to 57901)

ABRAHAM: Register your api key in this bot https://t.me/tonapibot (reply to 57902)

💥Phong: I have registered apiKey. But I don't know how to use that key in this declaration:  const getClient = async (): Promise<TonClient> => {   const client = new TonClient({     endpoint: "https://toncenter.com/api/v2/jsonRPC",   });    return client; }; (reply to 57903)

ABRAHAM: Add this key to your option, same level with endpoint apiKey (reply to 57904)

💥Phong: Are you saying to do it like this?  const getClient = async (): Promise<TonClient> => {    const client = new TonClient({      endpoint: "https://toncenter.com/api/v2/jsonRPC?apiKey=xxxx",    });     return client; }; (reply to 57905)

ABRAHAM: ` const getClient = async (): Promise<TonClient> => {   const client = new TonClient({     endpoint: "https://toncenter.com/api/v2/jsonRPC",     apiKey: "your-api-key"   });    return client; };

Wukong: Hi, does anyone know how to make the testnet works? I tried many wallets but none of them able to send tx on testnet

💥Phong: Thank you, I did it successfully. however I am not getting the correct txhash.  let transfer = await walletContract.createTransfer({        seqno: seqno,        secretKey: keyPair.secretKey,        messages: [          internal({            to: receiverWallet,            value: toNano(amount),            body: "A",            bounce: false,          }),        ],      });      //console.log("transfer", transfer);      const txtHash = transfer.hash().toString("base64");      console.log("transfer.hash base64", txtHash);  The txhash code I received is: mDohkJvhtER3Ddjzh5MUoYcFGsw40H2LnUCiJAipZNY= But in reality: mDohkJvhtER3Ddjzh5MUoYcFGsw40H2LnUCiJAipZNY= I will provide a photo below (reply to 57907)

💥Phong: Thanks you.

ayushag: Hi, I want to create a ton wallet programmatically using near-seed-phrase and make it active by the same script. How can I do it?

kevin: what programming language do you use, if using tonutils-go, there is official example code sample how to generate phrase wallet. (reply to 57921)

ayushag: ts or js (reply to 57922)

ayushag: I've generated the wallet but the problem is to make it active

Vlad: How can i send usdt or jusdt with a ton connect? do i need to use jetons?

Speculator: can i transfer jetton without jetton wallet address of source and destination.

💥Phong: Help me, please. Thanks you (reply to 57912)

Speculator: the hash you are getting are message hash (reply to 57930)

💥Phong: So what do I need to do to get the transaction? My purpose is I want to know if the transfer was successful? Get the txhash so users can check it on tonscan. (reply to 57931)

💥Phong: he's the same as me: https://answers.ton.org/question/1660331343046774784/how-can-i-get-transaction-hash-after-transfer-sen

&rey: No. (reply to 57929)

&rey: Does something fail if wallet is inactive? If not, why do you need to activate it? (reply to 57924)

&rey: You can't get transaction hash this way. At least until the logical time allocated to it is finalized, and that's when block is generated. (reply to 57912)

&rey: If you use USDT/jUSDT/..., you use jetton standard for sure. So yes, use common transfer code. (reply to 57926)

Nguyen: my brother phone number got banned from telegram, any help please, Wallet has received the amount of USDt in the earn wallet from me.  I'm not sure what the reason is for being banned, but my money is legitimate and I can prove it

MUHAMMAD🍖BBQ: OK

Nguyen: i love TON, But the experience of having your phone number banned is really bad

Nguyen: my brother does not use telegram for anything other than sending usdt to earn

Nguyen: I cannot provide my phone number here for fear of fraud.  But can you please put me in touch with the telegram login management department?

K.: Best you can do is contact Telegram support. I am afraid no one in this chat can help you directly.  https://telegram.org/support (reply to 57945)

Nguyen: is my brother wallet still safe?

Nguyen: There is some information on google that the account will be logged back in after a few days. But Ton Wallet is problem telegram replace it.

Nguyen: it say account deleted

Nguyen: I don't think the wallet will be restored with the same amount

Nguyen: I think you guys can act faster to help users

Nguyen: With blockchain user access comes first.  And this ban case makes me doubt the future of TON

&rey: We lads don't have private keys of @wallet and thus can not do anything. (reply to 57960)

&rey: Please consider blaming custodial service you used (namely @wallet IIRC). (reply to 57962)

&rey: Actually, it most likely didn't even record that balance in blockchain but only in internal database.

soes: Does anyone know the contract address for USDT tokens?

Armen: Never share your personal info with anyone on telegram or anywhere on internet. (reply to 57962)

Armen: Did you try check on cmc? (reply to 57975)

Armen: You can purchase esim or virtual telegram phone id (reply to 57949)

soes: What is cmc? (reply to 57977)

Armen: I guess you need $ton to activate wallet (reply to 57924)

Armen: Coinmarketcap.com (reply to 57979)

soes: https://docs.ton.org/?

soes: Let me take a look, thank you (reply to 57981)

Armen: Check for usdt and check contract address on TON network (reply to 57983)

Nguyen: i got another sim card bro, but can't restore wallet with other sim (reply to 57978)

&rey: It is on official Tether site, tether.to. (reply to 57975)

soes: Everyone misunderstood my meaning. I wanted to call the ton wallet and transfer USDT tokens through code, but I don't know its contract address

soes: I want to implement it in the code

&rey: Master contract. Is. On. https://tether.to/ru/supported-protocols (reply to 57987)

&rey: Please consult docs.ton.org - TON Cookbook. (reply to 57989)

soes: I have found it. Thank you (reply to 57991)

💥Phong: After this command, it already has txhash.  let currentSeqno = seqno;      while (currentSeqno == seqno) {        console.log("waiting for transaction to confirm...", currentSeqno, seqno);        await sleep(1500);        currentSeqno = await walletContract.getSeqno();      }      console.log("transaction confirmed!");  So now what do I need to do to get the txhash of the last transaction and get the value and message (reply to 57941)

Муфля [Ɐ]: Hi guys Maybe anyone have example of telegram bot, which sends a smart contract to pay for multiple users and then sends the entire top-up amount to one person?

Bill: hi, i am trying the ton onboarding challenge.  i have received some ton on my tonkeeper wallet on testnet and have ran the sample code which generates the qr code to send the nft.  however, i am not getting the nft from using the tonkeeper qrcode scanner to scan the qr code from the program. does anyone know what i might be doing wrong?

tuyennt550: Hello, i want to deploy a smart contract to testnet but it always return "an error occurred" when i approve transaction in the wallet. Does anyone know how to fix this problem?

Armen: makes sense. use USERNAMES. Have backup devices. (reply to 57985)

Bill: noticed i received the ton, but balance showing 0

Armen: sounds like a rug 😂 (reply to 57996)

Wukong: testnet is down (reply to 58002)

musashi: the testgiverbot still works

musashi: but I still not able to send transaction on testnet

musashi: maybe it's because of RPC

Wukong: Oh I didn't know that testgiverbot still working

Z: It's seem that testnet is dead today. Cannot send tx via ton connect sdk in the whole today😵‍💫

Wukong: It's dead from yesterday, I don't know why it take so much time

Z: When will it be fixed

Z: @pcrafter

Tony: I am a web3 developer with over 6 years of experience. I am interested in this project.

Z: The f**king testnet is so unstable recently 😵

Cube: I am using func (reply to 57838)

Z: So? (reply to 58021)

ᴅʏᴜᴛɪ ᴅɪᴘᴛᴀ: Ohh (reply to 56920)

TON Bounty Bridge: ​Article: how to automate after the first NFT mint through the interface on the GetGems.io trading platform  Summary:Development of a consolidated guide for continuing with automation after initiating minting a large ...  Rewards: • SBT Bounty Reward • 400 USD in TON  Created by seriybeliy11

Heydar: I have a  noob question , just was in my mind. someone or a lot of persons who are validators in TON , can block a wallet if all decide that?

Heydar: or totaly is that possible? to ban a wallet?

Nerses: Hi everyone ! how can I interact with smart contract using its functions (not get methods) ?

Speculator: const myTransaction = {     validUntil: Math.floor(Date.now() / 1000) + 360,     messages: [         {             address: jettonWalletContract, // sender jetton wallet             amount: toNano("0.05"), // for commission fees, excess will be returned             payload: body.toBoc().toString("base64") // payload with jetton transfer body         }     ] }  I want to transfer jetton but i don't have jettonAddress, How can i sent transaction

Speculator:  tonConnectUI.sendTransaction(myTransaction

&rey: You can send messages to it. (reply to 58032)

&rey: Any subset of validators can update their code to block a list of wallets. I doubt that the result would be still called TON. (reply to 58030)

&rey: In particular, a dev can download blockchain state, fork validator repo and create such change, so that his local node produces a new sequence of blocks where some wallets are blocked. That would be a local example.

&rey: Then obtain jettonWalletContract. (reply to 58033)

Nerses: Sorry my question wasnt correctly formulated. I meant already deployed smart contract interaction with its functions. For example if I have such function in my deployed contract how can I call it ?     fun create(_Receiver: Address, _hashlock: Int, _timelock: Int, _chainId: Int,_targetCurrencyReceiverAddress: String ): Int {         let ctx: Context = context();                                                                     emit(Create {data: TonTransferInitiated{__hashlock: _hashlock,                                                 __amount: ctx.value,                                                 __chainId: _chainId,                                                 __timelock: _timelock,                                                 __sender: sender(),                                                 __receiver: _Receiver,                                                 __targetCurrencyReceiverAddress: _targetCurrencyReceiverAddress                                                 }}.toCell());           send(SendParameters{to: myAddress(),                             bounce: true,                             value: ctx.value,                             mode: 128});          return _hashlock;     } (reply to 58041)

&rey: You can only interact with blockchain via messages. (reply to 58045)

Nerses: so above described function is useless in this context ? (reply to 58046)

&rey: Yes. Emitting external-out message is also largely useless, since it is easier to track transactions on your contract and parse incoming messages.

Nerses: Got it thanks for explanation.But it arised another question. So if I should interact with sending messages so I should have recieve() for every message type.In recieve execution of initial message sneder is over.Then if I want to lock funds in smart contract and also store data according to which another party can send another message and redeem it.How should be architecture of it ? (reply to 58048)

&rey: I guess that's your choice, how to architecture the contract?) (reply to 58049)

Nerses: I think it os misunderstood.Let me rephrase the question (reply to 58050)

Nerses: Just simply how can I lock funds in smart contract ?

&rey: You can receive them and not send back. Presumably you should store sender address. (reply to 58052)

Nerses: so in other case where i want to send message and redeem the funds that were locked for me I should send x TON to contract for redeemming y TON and the contract will send me x+y TON.(of course in this case fees arent taken into account). Is this logic correct ? (reply to 58055)

&rey: There is a new list of liteservers-interfaces for testnet! (re: https://t.me/testnetstatus/40)  To those who use pytoniq, toncli or similar, you should update stored testnet config. To those who encounter failures at APIs, you need to wait while the above is done there.

&rey: Yeah. (reply to 58056)

Nerses: thanks for being helpful (reply to 58058)

ayushag: Yes, the onboarding code gets stuck on the wallet is not deployed (reply to 57940)

ayushag: I have faucets but still (in test net) (reply to 57980)

Ehsan: How to create wallet which ends with a word like NOT or Gems: EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS  also is it secure?

kevin: Do you want one, I can generate for you (reply to 58065)

kevin: EQBvA5_GjnZMdQUsrEsCcMcrucbLnLEYEQ0w5dEhLAK-GEMS (reply to 58065)

Ehsan: I need it to be secured :D I need technical document about how to securely generaete it (reply to 58066)

kevin: DM you (reply to 58068)

Alexandru: Who can create a brrrr type game?

Aydin: Yes, I'm facing the same problem. I was trying to follow the standard code for jettons, and faced the same issue. Given that this repository is supposed to be the standard (working) reference, I wonder how to fix it. (reply to 47199)

Sleepy: Hey guys anyone knows which service this address could belong to?  EQABDz7RY4XsJVxNNpQ6HteYMeDpg_m9l0jChoEtyeRAwvF_

Sleepy: also is there any data sources with labelled ton addresses?

Lukas: Hi everyone! 👋 I have a quick question about the TON Connect and TON JS Client. Is it possible to pass along the connection from TON Connect into the client? I.e. not having to use the mnemonicToPrivateKey. I tried to use the public key from connect account as buffer but that did not work. I would like to basically get the balance of the connected account so I want to call the WalletContractV4 but with the account from TON Connect. I tried to go though the docs but haven't found anything on this specific topic.

Âmin: hi I am sending a jetton transfer message with pytonconnect   from my wallet it works correctly and i can confirm but in other wallets when users confirm transaction it fails (every time)  example : https://tonviewer.com/transaction/b31c5425948a09c164f66f048efe7979ba6b9970a772d9d887aca7da5f9c3ffa  help please

Âmin: def get_jetton_transfer_message(jetton_wallet_address: str, recipient_address: str, transfer_fee: int, jettons_amount: int, response_address: str = None) -> dict:     data = {         'address': jetton_wallet_address,         'amount': str(transfer_fee),         'payload': urlsafe_b64encode(         begin_cell()         .store_uint(0xf8a7ea5, 32)         .store_uint(0, 64)         .store_coins(jettons_amount)         .store_address(recipient_address)         .store_address(response_address or recipient_address)         .store_uint(0, 1)          .store_coins(1)          .store_uint(0, 1)          .end_cell()         .to_boc()          )         .decode()     }  the code for making the message wallet is activated (reply to 58095)

musashi: 705 exit code means the sender is not owner of jetton wallet contract (reply to 58095)

Âmin: what should i do ?  EQALRM2ISTb8R3Xv0LIPOX6Xr-iqNvqgz0vUMNVQ_9v115nD  i am using this jetton wallet for the token (reply to 58102)

Âmin: how should i get the jetton wallet address via api? https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post documents say with this but it dont work

Nilton: How can I turn my wallet key into my seed phrase?

&rey: But it isn't your jetton wallet, is it? How did you obtain that address? (reply to 58104)

&rey: You need to reverse SHA-256 hash. (reply to 58115)

&rey: Yes. Here's one Tonscan uses: https://github.com/catchain/address-book/blob/master/source/community.yaml. (reply to 58084)

Sleepy: Thanks sir Will check (reply to 58123)

Nilton: how do I use it?

User<6779439263>: is there anybody looking for a dev?

Heydar: I thought in web3 people cant force something (like admins) ... its bad then. (reply to 58043)

User<7174392301>: please dm me if anyone needs a dev.

Bromelia: So the tonapi encodes the og URL with base64, got it.  PS uses backblaze (check: photos.pinksale.finance ) to store images, I'd say they do have access to that image since it's their bucket.  Try to talk to an admin there as probably mods don't know about it. (reply to 57858)

Kom: does anyone need  a full stack & blockchain dev?

Кисель: Is it possible to find out getMethods of smart contract without knowing it's code?

Vladyslav: Hi guys! I'm new to the TON ecosystem. Currently I'm reading docs to understand things but I'm impatient with a couple of questions so maybe someone can help.  1. On tonscan what's the difference between a jetton wallet and tab "Jettons"? I assume based on what I've learnt, that the latter makes sense only for "standard" TON wallets and it should show links to its jetton wallets.   2. Does this feature work on testnet tonscan? Is this data provided by tonscan or they using some 3rd party API and I should analyse the list of my Jettons on my own. I know there's Ton.api but having some visuals would help for the start.  Thanks for any info you can provide.

Vladyslav: Do you know contract address? if yes does THIS answer your question? (reply to 58137)

Кисель: No it doesn't show getMethods for non verified smart contracts  You can check this one: EQBNZB91JJX9Ub7KMEAUoQNVcQlCsob5e_WMFbvsML_UoAKD (reply to 58140)

Vladyslav: let me know when you find something. I am also curious now... (reply to 58142)

Кисель: I mean. These 2 functions for sure getMethods  We just can't know method name without revealing the source code.  Would be cool if it's possible to execute these methods by it's ID (reply to 58143)

Кисель: Also I think it should be possible to understand TL-B scheme by disassembled code. I hope there is an existing tool for that (reply to 58144)

N: /stat@combot

Bob: Anybody knows how to convert Stonfi's txParams.payload to body string? This is what I tried, but it didn't work  const transfer = walletContract.createTransfer({     secretKey: key.secretKey,     seqno : seqno,     messages: [       internal({         to: txParams.to.toString(),         value: txParams.gasAmount,         body: Buffer.from(await txParams.payload.toBoc()).toString('base64')       })     ]   });

— 2024-05-08 —

User<1795676886>: Hey, where I can learn to build on TON

Bill: Is the testnet still down?

TON Bounty Bridge: ​Improve resource availability  🏷 Education  Summary:Improve a way to help build on ton other then telegram.  Created by Abuchtela

KyuMin: Hello,  I create new wallet in mytonctrl but there's no mnemonic, only can get private key when exported.  1) How can I use the wallet with mobile app or web extension? 2) The mg command in mytonctrl, has no option for comment. How do you put comment in mg command?

Z: Seems ok now (reply to 58158)

Anng: Hi! I am working with Jetton and Tact, and I am looking to create a contract that locks Jetton over time. The issue here is that I can't tell when a user sends Jetton to the contract for recording, because when Jettons are sent, they do not go through the Lock Contract but are sent directly to the Jetton Wallet of the Lock Contract.  Is there any good solution or example that can help manage the flow of sending Jetton?

Bill: Thanks do you know why my balance says 0 even after I received 5ton from the testnet? (reply to 58164)

Z: You use TonKeeper bot? Maybe it only works in main net mode

&rey: Because there is some bug or like in underlying API it uses. (reply to 58166)

&rey: Forward notification is sent to the lock contract. (reply to 58165)

Z: In  main net mode, you cannot see balance in tesetnet,

Bill: Using testgiver ton bot.  Is there something else I can use? (reply to 58169)

Bill: So it doesn’t work? (reply to 58171)

Z: Use TonKeeper standalone app

Z: And switch to test net mode

&rey: On docs.ton.org. (reply to 58157)

Z: Don't use TonKeeper telegram bot, it don't support test net

&rey: And it is possible, via toncli. (reply to 58144)

Z: Ohhh, TonKeeper bot also support test net mode!

Z: Switch to it, and you will see balance got for test giver bot!

&rey: It also didn't work totally normally. (reply to 58176)

Z: Click here 5 times to open dev mode, and switch to testnet mode

&rey: 1. Please group your messages in one when possible. 2. You're misunderstanding problem of that person. @billtlee opened testnet, etc, etc, and transaction list is showed (+5 TON) but doesn't match balance (0 TON). (reply to 58184)

Z: Oh sorry (reply to 58188)

Anng: Thank you for your response, but I'm still not quite sure how to forward it. (reply to 58172)

Ton: Help! Anyone knows why it's wrong?

Ton: uiPreferences: {                colorsSet: {                    [THEME.DARK]: {                        connectButton: {                            background: '#000000'                        }                    },                }            }

Ton: TypeError: Cannot read properties of undefined (reading 'connectButton')"

Behrang: I don't know what's the problem but I have a working code here that might help you:  https://github.com/HipoFinance/webapp/blob/da6b3aeff2bb98e20eec4b1ce93d3e1830271f97/src/Model.ts#L961 (reply to 58198)

rebel_rrk: Looking for a developer of Mini App based on TON, need to develop a clicker app based on TON

Christopher: I talked to the main Pinksale dev and he said they couldn’t change it because "We have a hash for single photo" (reply to 58135)

GIS: Hi guys! As first - I’m not a developer)) as second - I have question:  When pilot season was launched on tg I forgot mint sbt nfts.  Can I mint them now?  My wallet: UQBkR0o-w-twmJDORVT3J2RzbMmYOX2tr-05B6VRT7EUz07H

Alex: Hi guys, is there anyway to set the inbuilt telegram wallet to testnet ?

Alexandru: Looking for a developer of Mini App based on TON, need to develop a brrrrr type app based on TON

K.: No, it does not support testnet. (reply to 58211)

Alex: Any suggestions for a wallet that works with wallet connect to use while developing? (reply to 58219)

K.: Tonkeeper is an obvious choice, but can be sometimes problematic with testnet. (reply to 58220)

Alex: Thank you for the help (reply to 58222)

wikig: Hello guys . anyone try the tonkeeper wallet v5 to use it's battlery before ?

wikig: Which should provide gasless service (reply to 58224)

Ton: Thank you sir. (reply to 58203)

Vladimir: Hey guys! Is any chance to TON have smart contracts web instruments with the ability to not only read getters but also with write requests, so that forms could be generated via ABI, similar to Etherscan?

Ali: Hi how can I get API Key for Toncenter?

Vladimir: @tonapibot (reply to 58234)

soes: https://minter.ton.org/ The website that created this token, does it have a testnet?

Dung LQ: Can someone help me fix this error? I am doing a jetton deposit function from ton space to my wallet via ton connect. After ton connect open, the error log is: Error: Unable to emulate boc. Below is my code: const tonSpaceAddress = Address.parse(wallet.account.address);       const jettonWalletContract = 'EQAwVI6-EBUZyL5I4Mj9cb3ChDDojvi_c16jlhaBYVQlRzjF';       const body = beginCell()         .storeUint(0xf8a7ea5, 32)         .storeUint(0, 64)         .storeCoins(1000000)         .storeAddress(Address.parse(tobiTonAddress))         .storeAddress(tonSpaceAddress)         .storeUint(0, 1)         .storeCoins(toNano(0.05))         .storeUint(0, 1)         .endCell();       const transaction: SendTransactionRequest = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [           {             address: jettonWalletContract, // sender jetton wallet             amount: toNano('0.05').toString(), // for commission fees, excess will be returned             payload: body.toBoc().toString('base64'), // payload with jetton transfer body           },         ],       };       tonConnectUi.sendTransaction(transaction);

Ali: this solved the problem thanks (reply to 58237)

Vladimir: yep https://minter.ton.org/?testnet=true (reply to 58238)

soes: grateful (reply to 58243)

Amir: hi can someone help me with this error ?  i cant deploy my contract on testnet

Nine 🇹🇭: gm everyone! Any game developers here? Our team is exploring Telegram/TON and would love some advice

&rey: You're probably using old blueprint. Please check if there is one by name @ton/blueprint. (reply to 58246)

Amir: "@ton/blueprint": "^0.19.0" (reply to 58248)

&rey: Then how is your code calling @ton-community/blueprint?

Louis: hello everyone, I am using React, how do I know when a transaction is successful to display in FE? (reply to 58250)

Amir: i have no idea (reply to 58250)

&rey: I don't know how you define success; I'd listen to the moment when destination's jetton wallet updates its balance successfully. (reply to 58252)

Louis: After transferring the token, I will handle the logic in receiver(TokenNotification), can I emit log and listen to it using ton api? https://tact-by-example.org/03-emit (reply to 58254)

&rey: You can, but it's a bit simpler to not emit the log and listen to incoming internals instead. (reply to 58255)

soes: Does anyone know what addresses these two should fill in?

Louis: Do you mean just listen TokenNotification message? (reply to 58256)

Louis: can you give me example?

&rey: Destination and source respectively. Do you need a Chinese group, by any chance? (reply to 58259)

Louis: using websocket to listen?

soes: But when I enter it like this, it fails: Uncaught Error: Invalid address.

&rey: What libraries are you using? (reply to 58264)

&rey: This error is usually caused by a mix between ton-core, ton and @ton/core, @ton/ton.

&rey: Yeah, thought so. Import Address and etc from @ton/ton also. (reply to 58268)

soes: Friend, you are so awesome. I made the modifications as you said and solved the problem.

User<7140581942>: Hi guys, can I ask a question? Is there Moralis-like platform in TON? so I can get logs from smart contract call using websocket or webhook. or how can I handle the logs out from blockchain entity in TON? thank you

Кисель: how to understand getMethod arguments from disassembled code? Is there a tool for that? (reply to 58180)

Uchita Hasanah: No bro (reply to 58274)

Âmin: Hi Im trying to make a jetton transfer message  It has a part jetton_wallet_address  How should I get it ?  (I get it from toncenter from api but it don't work for some wallets

Donn: hi any idea why validator-engine keep crashing recently?  Version validator: 4cfe1d1

Donn: same issue as this https://github.com/ton-blockchain/ton/issues/882

Âmin: anyone knows? (reply to 58286)

Gunnar: you can get it from a get-method call to the jetton master (reply to 58294)

Gunnar: pass it the TON wallet address, and it will compute the jetton-wallet address

Âmin: await provider.run_get_method(address=JETTON_MASTER_ADDRESS, method="get_wallet_address",                                                    stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]) (reply to 58295)

Âmin: that is what i am doing (reply to 58296)

Gunnar: looks good to me!

MicroStrategy: Who is looking for someone who is proficient in web2 and web3 projects?

Simon: Hi there, can anyone please tell me how I can check the wallet address of a caller? For example, Alice calls on the function myFun and her wallet address is needed inside myFun for some business logic. How can I retrieve Alice's wallet address? Thanks.

🥋: Sup guys How can i deploy func smart contract using golang?

&rey: Send a message including StateInit to it. (reply to 58312)

&rey: All interaction is done via messages; then, you can obtain message source. (reply to 58311)

Simon: Would you please point to a concreate example? Still a newbie to FunC. Thanks.:-) (reply to 58315)

Stan: Hi, trying to send simple transfer with tonweb in js, getting error:  Cannot run message on account: inbound external message rejected by transaction here goes hash: exitcode=0, steps=0, gas_used=0  I saw some people already encountered this error, but not found public answers. I read that exitcode 0 means contract is not initialized and maybe one need to init state before sending transfer. How i do it? I see “createStateInit” method, it returns something, but has no effect on its own.  What should i do? 😢

&rey: Here you are: https://github.com/orbs-network/single-nominator/blob/b469f08730f425b5f0a85138a19ddb1ca3c654e4/contracts/single-nominator.fc#L72-L78. (reply to 58317)

&rey: Does your wallet contract reject external, or you're trying to send custom external to your custom contract? (reply to 58318)

M: This code is calculating user's jetton wallet address offline. However, it is not calculation it correctly for USDT, because it is centralised stablecoin and has a different contract. Can you please help me to find the code to calculate it for USDT as well?

Stan: Im not sure what does it mean… This is what im doing:        const tonweb = new TonWeb(         new TonWeb.HttpProvider(           'https://toncenter.com/api/v2/jsonRPC',         ),       );       const keyPair = keyPairFromSecretKey(Buffer.from(privateKey, 'hex'));       const WalletClass = tonweb.wallet.all.v3R1;        const wallet = new WalletClass(tonweb.provider, {         publicKey: keyPair.publicKey,         address: addressFrom,       });       const transfer = wallet.methods.transfer({         secretKey: keyPair.secretKey,         toAddress: addressTo,         amount: TonWeb.utils.toNano(amountTo),         seqno: 2,       }).send();  I created both addressFrom and addressTo, both of them have balance now, work with wallet apps. I found that this method await wallet.methods.seqno().call() also returns null, though address is right when i check it from wallet class and has transaction history (reply to 58320)

&rey: Yes, this is a imperfection of library. You should use seqno 0 instead of null. (reply to 58325)

&rey: "Seqno" stands for "sequential number", after all.

&rey: I've seen one on TON Cookbook page most recently. (reply to 58323)

Stan: after hadcoding seqno to 0, error is changed to  LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by account 2DB5A05886E15C3CB6BA53BC049C251F217DED54291DA90BE3DE4504E4CF9B1F before smart-contract execution with no error codes ☹️ (reply to 58326)

Simon: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {  I guess I have not fully grasped the meaning and purpose of this function. If we do not implement this, can we not have a way of knowing who the caller is?   Also say we have three different functions, does it work with all of them?  Would you please explain this with a bit more details or insights? Thanks. (reply to 58319)

&rey: If you don't implement recv_internal == main, you cannot process incoming messages with value. (By the way, FunC compiler would not allow to skip this function.) (reply to 58332)

Simon: This statement alone should be put at the very top of the development document. Many thanks for sharing.

Simon: Does it process all internal messages? (reply to 58333)

&rey: Yes. It is THE entry point. (reply to 58335)

Simon: I have seen this and I honestly think it deserves a long paragraph of explaining what it means. It seems to be more profound than what it appears. (reply to 58336)

&rey: OK, here I'll try: (reply to 58337)

Simon: For example, are these parameters mandatory or function dependent? () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {

Simon: Another question is who gets to call recv_internal and where or when?

&rey: In TVM assembly, the contract is quite linear. In particular, upon a message receipt validator launches TVM with five values on stack. They are my_balance, msg_value, in_msg_full, in_msg_body and function_selector. This selector value is 0 for internal messages, -1 for externals and a few other for system contracts.  FunC compiler creates an implicit switch-like construction, which calls the appropriate function. This switch guarantees that no one can onchain launch arbitrary function of your contract without having to go through recv_internal or recv_external.

&rey: The contracts can also provide get methods. Those are included in that root switch construction, and have user-defined stack parameters. Get methods are not invoked onchain.

&rey: A well-known method_id(XXX) actually defines selector value for a get-method. method_id tells compiler to pick one (from something like truncated hash of function name).

Aydin: Brilliant explanation! ⚡️⚡️ Now, we know that some of those arguments may be omitted; which ones? And which are mandatory?  Guess, e.g., in_msg_full must be mandatory, right? (reply to 58341)

&rey: You may take any suffix of them, previous ones will then lie on stack forgotten. (reply to 58344)

Aydin: Then, can we even call it with no arguments at all? (reply to 58345)

&rey: Yes. In particular, TON-forwarding contract may do so.

Simon: I honestly think insightful explanations like this should be given somewhere as public information, or maybe there already exists such info? (reply to 58341)

Simon: but this has not answered my question about who calls this function and where or when? For example, if sender wallet is extracted, how can it be accessed by other functions in the same contract? (reply to 58341)

Aydin: In TON, contracts are like black boxes with no access to each others' internals. The only way for them to interact is to send messages.  And, recv_internal acts as the entry point of the contract for receiving its internal messages, while the other function recv_external does the same for off-chain messages coming form outside world (reply to 58353)

Dylan (Mach / Tristero): Hi folks. Our team is considering adding TON support to our chain agnostic swaps platform.   Any cross-chain messaging platforms (layerzero, axelar, etc) supporting TON atm?

Sang: Hi all bro, I catch this error › please let me know ton testnet was stuck , right?

Sang: with the error:   error: { code: 300, message: 'Wallet declined the request' }

Simon: Thanks for this info. "the entry point of the contract for receiving its internal messages" deserves more explanations. For example, Alice calls a mint function. What information is counted as internal and what messages are sent to recv_internal and when or where? (reply to 58355)

Kenny$$Shillz: U search for the op code (reply to 57196)

Aydin: Some terminology:  - (on-chain) messages between contracts are called internal;  - (off-chain) messages from elsewhere are called external.  Now, assuming Alice a human, she sends an external message, say, to her wallet. This message will be received by the recv_external of the wallet contract. Next, the wallet can send internal messages to other contracts via the  send_raw_message(...)  function.  The target contract will then receive that message via its recv_internal.  If you pay close attention to the FunC codes, you will notice the congruence between the formats of the following functions in the sender and receiver contracts, respectively: - send_raw_message  (sender) - recv_internal  (receiver) (reply to 58362)

Louis: @pcrafter Can you send me the documentation to implement listen TokenNotification?

&rey: I guess an example is in order. https://github.com/ston-fi/dex-core/blob/main/contracts/router.func (reply to 58365)

Wukong: Is testnet down again @@

Heydar: Im doing so many sending and receiving in my contract. and each one is for special operation. I want to know how detect that operation from reactjs? to show the operation name in my front end. how do you do that? do we have an example code?

Simon: Okay, I kinda get it but not 100%. Let's move the Alice example one step further. Suppose Alice is the admin of a toy contract. Some functions can only be called by her. Now a random person makes a call, first to his/her wallet contract, and then this wallet contract makes an internal call to our toy contract. The question is how can I implement an enforcement logic to ensure that only Alice can call certain functions? (I also think there must be existing examples for doing this, but have not found luck finding it.) (reply to 58364)

Aydin: By first checking if the sender address of the incoming message is actually Alice's contract address, and throwing relevant errors otherwise. (reply to 58370)

&rey: Load 32 bits from message body, and map that to string name. (reply to 58369)

Heydar: can I open message body from tx (frontend)?! (reply to 58372)

Heydar: I thought message body could never read by anyone, except the contract owners.

Heydar: so if people sending message between contracts, all of the messages are public?!

&rey: Yes. And all contract data. And code, actually. (reply to 58375)

Heydar: it's ok code will be public, but why data is public? shall it be public really? (for a reason?) (reply to 58376)

&rey: Yes, there is the reason: anyone should be able to validate block correctness. (reply to 58377)

Aydin: Yes, contracts are visible from outside. For example, you can easily track everything about a contract address using the scanner platforms (including the entire source code, NFTs, etc.)

Simon: Is this checking happening inside recv_internal or also somewhere else? by your logic, if slice sender = cs~load_msg_addr(); is only available inside recv_internal, then all functions will have the same restriction imposed. This is clearly not right. Am I misunderstanding anything? (reply to 58371)

Heydar: it could be done with hash. and it does not need data be public (hash of hash of data).  is not right ? (reply to 58378)

&rey: But then how to check if transition of hash A to hash B was correct or a malfunctioned validator? (reply to 58381)

Heydar: your right , I need to analyse it better, confused 😁 (reply to 58382)

Heydar: do you mean validator can change the hash? (reply to 58382)

Heydar: aaaaaaaaaaah got it, your right. thanks again ^_^ (reply to 58382)

Aydin: If recv_internal is responsible for receiving and processing internal messages (and of course, recv_external for externals), then why check elsewhere? Do you see any logical reason for that? (reply to 58380)

MicroStrategy: dm me (reply to 56322)

M: I need an experienced TON developer. Please contact me in DM

Simon: Say fun_a is open to everyone, and fun_b is restricted to Alice. Both fun_a and fun_b will share the same recv_internal, right? Then it does not make sense to put the same restriction on calls to both fun_a and fun_b. (reply to 58387)

Aydin: In recv_internal, you will discriminate between fun_a and fun_b using appropriate if/switches and corresponding op-codes:  recv_internal(...) { ...      if (op == opcode_for_fun_a) {     ;; open to everyone     ...     }      if (op == opcode_for_fun_b) {     ;; firstly, check whether sender is     actually Alice,     ;; and throw error otherwise     ...     }  } (reply to 58390)

Simon: Thanks so much. Now it makes a lot of sense. (reply to 58392)

Кисель: toncli get --address EQBNZB91JJX9Ub7KMEAUoQNVcQlCsob5e_WMFbvsML_UoAKD --net mainnet 108033 INFO: 👯 [my-cool-smc] [EQBNZB91JJX9Ub7KMEAUoQNVcQlCsob5e_WMFbvsML_UoAKD] runmethod ['108033'] INFO: 🧐 Output: [ C{1F992DEA2B903895B00C1E72BA68C1EA1E26FBEE7715F9B0354344406CA2A280} CS{Cell{026d8006197829bf00ce60d18b8754d4fdc2e9b2c685e796cb3384c8d7ad41b858ca86ce0260efcdfdb7c2e09e1b84c487a50c1b04791cdd1b} bits: 0..267; refs: 2..2} 334766511414241 1390728230223144 14853012876941  ] ERROR: 🧐 Can't auto parse string  that's definitely cool. sad that it can't auto parse response or provided list of needed args for get function (reply to 58180)

saitama: Guys, who knows how to get more ton for the testnet? Due to the circumstances, I need about 5,000 coins to test the code, just a couple of transactions, I know the testnet is already loaded, I will try not to be long, so as not to disturb the others, thx 😊 i can't tell you more, I think this project will be popular, and you'll see everything, so good luck to everyone!

saitama: I think I could pay later if someone shares it with me)

ToscoT: Good evening everyone.  I don't know if this is the right channel to expose my problem.  I can no longer make transactions with my Ton Space.  I also imported the wallet to tonkeeper but the transaction is not executed.  can I ask here?

Jeremy: Why my app always rejects by ton app. Can somebody tell me the reasons?

&rey: Rejected by which wallet app, exactly? (reply to 58408)

Jeremy: Open wallet (reply to 58409)

Slava: This looks weird to me that you need such a huge amount of coins, but nevertheless @f_closer might help. (reply to 58399)

saitama: Yes, it may seem big, but that's the only way we can test our entire platform (reply to 58412)

saitama: good luck 😉 (reply to 58412)

&rey: You have already tested it with @ton/sandbox, right? (reply to 58413)

saitama: I can't tell you for sure, since we already have a compiled application for the testnet (reply to 58416)

saitama: I'll talk to the team and ask them, but I should still try transactions through the testnet, such things😅

saitama: It's just that we're in the Ton network for the first time, and we're just getting started

&rey: Poor testnet. Please try testing business logic in sandbox first — that costs zero and is faster 😀

ToscoT: Any answers please 🙏  I have my wallet unable to move founds.. (reply to 58406)

&rey: What does it mean "not executed"? Is it displayed "pending" in Tonviewer and then not actually applied to blockchain, or like? (reply to 58406)

ToscoT: this is a test I did.  transactions have been rejected since this morning when I tried to claim in game.  catizen

ToscoT: there are no pending transactions in tonviewer

ToscoT: I tried to import ton space on another device, but the transactions are still rejected.  Is it possible that there is a pending transaction that is not visible due to the catizen game?

Ben: Hi can i dm you ? (reply to 56285)

Daniel: Hi guys, my DM is open if you need someone on the team to build the website, create gifs, design NFTs, and contribute to the growth strategy. I wear all hats.

KO: I have a question. I am using 'CloudStorage' supported by the Telegram mini app to store user-specific data for my service. Is there a way to retrieve the data for each user?

Estevan: I need to consume ton society api to create a game. Anyone here from there?

Culp: who needs a developer?

User<7174392301>: I would like to apply as an experienced developer. feel free to dm me.

Андрей: How create invoice for payment for a certain amount with toncenter? I want to send link in tg/python

— 2024-05-09 —

Ken: How to decode BOC starting with 'b5ee9c72...'?

Оскар: if you need to convert this to Cell object (typescript example) const cells = Cell.fromBoc(Buffer.from("b5ee9c72...", "hex")); // usually there is only one cell so const cell = cells[0]; if you need to decode data in it, you need to know the format of this cell and what bits and refs are stored if you know it then do things above and (for example some body of inbound message with op code as uint32 and query id as uint64) const slice = cell.beginParse(); const op = slice.loadUint(32); const queryId = slice.loadUint(64); (reply to 58459)

Simon: Guys, a silly question, how is the op code for a function determined? Is it defined by developers? If so, how can it be matched with the actual function? Say I have a function myFun. In recv_internal, I can use the op code my_fun to redirect the message to myFun, but how does it get matched from the outside? i.e., how does the system know the op code my_fun is for myFun. To make it more obvious, I can write the op code as do_sth, then it's completely unrelated to myFun literally.

User<746823155>: hi there

User<5931593612>: 怎么样找到TON钱包客服呢

MEW: any nth root code example in func?

Your: Hey, everybody If you need someone to upload collection NFT by smart-contract on GetGems - you can contact me in DM

MEW: newton's method is not efficient

Slava: The op code is not a strict standard, it's just a convention to distinguish various messages. The specific numbers that you use for your op codes is just a contract that you define between your smart contract and its users. And you can have recv_internal that doesn't use functions at all. (reply to 58466)

MEW: any better implementation?

Matthew: https://t.me/+T1BFp_mH7IhhZWE1

Oscar: I introduce myself, I am Oscar Vega, founder of irflex, where we are developing a single app for transportation, lodging and delivery services. But where do we also want to create the first token that is valued every time someone stays, orders food or transports, if anyone has experience in this write to me we want to do Grow the company to the maximum, greetings Oscar Vega

Boris: hi

User<5931593612>: 怎么样才能联系上TON钱包客服呢

Simon: Hi guys, I can't believe I have to ask this but is there a constructor in Ton contract? Suppose I'd like to pass in a wallet address as the admin, is the following code snippet correct? If so, how can I pass in admin_add as slice using JavaScript? To me, it seems to take one more step from address to slice, is that right? () constructor(slice admin_addr) impure {     ;; Check if already initialized     var (_, _, is_initialized, _) = load_data();      ;; Throw if the contract is already initialized     throw_unless(51, is_initialized);      ;; Initialize data with admin address and set initialized to true     save_data(0, 0, -1, admin_addr); }

tuyennt550: Hi,  Is anyone able to deploy contract to testnet today?  I got an error "Network overloaded" after confirm transaction in the wallet

Matthew: try tonhub (reply to 58495)

tuyennt550: still stuck at loading after scan the QR code (reply to 58496)

Jimmy Becen: Hi guys Does anyone know how to read Asset0 and Asset1 when I storeSlice like above? I'm looking for a way to read asset0 and asset1 information when creating CreateVault and CreateVolatilePool  async sendCreateVolatilePool(     provider: ContractProvider,     via: Sender,     { queryId, assets }: { queryId?: number | bigint; assets: [Asset, Asset] },   ) {     await provider.internal(via, {       sendMode: SendMode.PAY_GAS_SEPARATELY,       body: beginCell()         .storeUint(Factory.CREATE_VOLATILE_POOL, 32)         .storeUint(queryId ?? 0, 64)         .storeSlice(assets[0].toSlice())         .storeSlice(assets[1].toSlice())         .endCell(),       value: toNano('0.25'),     });   }   export class Asset implements Writable {   private constructor(     readonly type: AssetType,     readonly address?: Address,   ) {}    static native() {     return new Asset(AssetType.NATIVE);   }    static jetton(minter: Address) {     return new Asset(AssetType.JETTON, minter);   }    static fromSlice(src: Slice): Asset {     const assetType = src.loadUint(4);     switch (assetType) {       case AssetType.NATIVE:         return Asset.native();        case AssetType.JETTON:         return Asset.jetton(new Address(src.loadInt(8), src.loadBuffer(32)));        default:         throw AssetError.notSupported();     }   }    equals(other: Asset) {     return this.toString() === other.toString();   }    writeTo(builder: Builder) {     switch (this.type) {       case AssetType.NATIVE:         builder.storeUint(AssetType.NATIVE, 4);         break;        case AssetType.JETTON:         builder           .storeUint(AssetType.JETTON, 4)           .storeInt(this.address!.workChain!, 😍           .storeBuffer(this.address!.hash!);         break;        default:         throw AssetError.notSupported();     }   }    toSlice(): Slice {     return beginCell().storeWritable(this).endCell().beginParse();   }    toString() {     switch (this.type) {       case AssetType.NATIVE:         return `native`;        case AssetType.JETTON:         return `jetton:${this.address!.toString()}`;        default:         throw AssetError.notSupported();     }   } }

MA: hello guys, is there any build-in function for getting current contract address ?

MA: I need it to deploy jetton_wallet for my contract (reply to 58500)

Simon: https://github.com/ton-core/ton-core/tree/e0ed819973daf0484dfbacd0c30a0dcfe4714f8d/src/address (reply to 58500)

Simon: I found something here that might be able to help you. From a newbie here.

Matthew: I used mnemonic to deploy so I didn't have the same problem as you (reply to 58498)

Alex: Hi guys, is anyone else having issues with testnet ? My transaction and balances are not updating in tonkeeper

John: @AlexSAtwo3 me too

MA: thanks but I mean in FunC language not TypeScript. by the way it can be calculated also with contract code ref , but I don't want to store more storage for just calculate current contract address if there is a build in function for this purpose (reply to 58503)

Dmytro: Hi, I'm currently choosing a host for my Liteserver Node. If I'm following requirements in the guidelines, the hosts are cost around 1000-1500$, is it really required to launch Liteserver Node, or can I chose less powerful machine?

Simon: https://docs.ton.org/develop/func/stdlib (reply to 58509)

Simon: slice my_address() asm "MYADDR";

tuyennt550: thank you (reply to 58504)

Simon: can anyone please help answer this question? (reply to 58493)

🥋: good day Dev's  i am deployed a smart contract to testnet and now i would to change admin (example operation) but i can't understand why it's doesn't working and what i need to do

Ha: How to issue jetton on ton, similar to issuing USDT on ETH?

MA: you can pass initial storage data when deploy the contract.  https://stepik.org/lesson/1011496/step/2?unit=1019356 this video should be usefull (reply to 58493)

Sergiu Popov: Hi, I need the snippet which counts how many shares from miniAPP inside Telegram happened. Please, help🙏

Simon: guys, how can I convert an address data type to Slice in JS/TS to be passed to a contract on Ton Network?

Simon:     const admin_wallet = WalletContractV4.create({ publicKey: keyAdmin.publicKey, workchain: 0 });

Simon:     const counter = FeeApp.createForDeploy(feeAppCode, admin_wallet.address);

Simon: Got an error saying this scripts/deployFeeApp.ts:21:56 - error TS2345: Argument of type 'Address' is not assignable to parameter of type 'Slice'.   Type 'Address' is missing the following properties from type 'Slice': _reader, _refs, _refsOffset, remainingBits, and 54 more.  21     const counter = FeeApp.createForDeploy(feeAppCode, admin_wallet.address);

Alex: You should be able to get the functionality you want using this: https://core.telegram.org/bots/features#deep-linking (reply to 58522)

Sergiu Popov: thanks

MA: use storeAddress insted of storeSlice (reply to 58523)

Simon: Thanks. I managed to make it work with this:     const admin_wallet_slice = beginCell().storeAddress(admin_wallet.address).endCell().beginParse(); (reply to 58529)

Ke: Hello guys, I have a question regarding Getgems: Why is it that when listing an NFT for sale, the nft_sale_v2 is created through the deployer/marketplace contract, but when making an offer for an NFT, a direct nft_offer contract is created instead?

wikig: Hello guys , is there any lending protocol in TON-chain ?

Kuggadefi: Hey guys which library can we use to create a wallet from TON??

wikig: Nacl + tonweb i guess (reply to 58536)

Kuggadefi: Can you sure this will work (reply to 58537)

wikig: For me . yes  , it works , with js (reply to 58538)

Kuggadefi: Im currently using near seed creation

Kuggadefi: Can anyone help me out for adding send and transfer functionality

wikig: Well , it works same (reply to 58540)

soes: Can any friend help me figure this out?

wikig: why not just ask in the cn channel (reply to 58550)

soes: The body was written according to the document, but failed to be sent.

soes: Because the people on the en channel are more powerful

wikig: Can you confirm that the 2 address you set here works correct ? (reply to 58549)

soes: Yes, that's what the documentation says, one receiver, one sender (reply to 58554)

User<43817863>: Some dumbass scam haha

wikig: https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/test-jetton.js#L128 (reply to 58556)

wikig: Better check with the message reciver address and the data inside payload (reply to 58550)

wikig: True (reply to 58558)

soes: I use ui-react

wikig: Well , but you still can use tonweb to boc encode the data .   I do the same , using tonconnect-ui (reply to 58565)

soes: Jetton transfer, not mint, has different functions than the document you sent. (reply to 58560)

User<43817863>: But the search etc doesn’t work haha (reply to 58566)

wikig: It have the transfer function too (reply to 58568)

wikig: True ,lol . Someone send link in group chat . but link still too easy to check . So i try add a webapp which makes it more confuse (reply to 58569)

User<43817863>: Okay (reply to 58572)

wikig: https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/test-jetton.js#L128 (reply to 58568)

soes: Yeah, yeah, I saw it (reply to 58574)

User<43817863>: BTW it’s completely different here haha (reply to 58572)

soes: I'll give it a try, thanks for your help

wikig: Webapp make scame goes easier (reply to 58577)

User<43817863>: I don’t use Webapp lol (reply to 58579)

wikig: well , careful anyway lol (reply to 58581)

User<43817863>: Sure. Anyone should be. Don’t give scammer a place (reply to 58582)

Sina: is there any document about how to use and implement plugins ?

Jay: Hi guys, do you know any best tool for the airdrops on TON chain?

&rey: You have choice between three different architectures, which would you like to explore? 1. wallet-v4 2. inplug-v2 3. wallet-v5 (reply to 58590)

إسماعيل: Oh speaking of wallet-v5, do you have an example of an implement pls? (reply to 58601)

&rey: For that, no, I don't. I have examples for other two. (reply to 58602)

إسماعيل: inplug-v2 supports 255 messages in 1 txn as far as I'm concerned right?

إسماعيل: I believe this is the implement: https://github.com/ProgramCrafter/wallet-contract/blob/main/wallet-inplug-v2.ts it would be really nice if there was a wallet-v5 one

Sina: what is inplug-v2  ?  i need for wallet-v4 and wallet-v5 (reply to 58601)

&rey: It is my wallet version, having same features as wallet v5. (reply to 58609)

Sina: interesting ! Ok tell me more about it, where can i read it ? (reply to 58610)

Johan: Thank you (reply to 58363)

Johan: Guys, does that work if I change from tcp to wss: Does that mean it will use websockets?

Johan: It's peace of code to work with ADNL

Johan: and ADNL would be faster than HTTP based connections?

Johan: which method would be the fastest? It would be, if I run my own node?

Emil: Have you seen any (reply to 58600)

Sasha: Hi.  Does TON smart contracts have payable functions? Like in Solidity

peilipu: 0:xxxxxx is the account_id in tonapiv2, how to convert it to normal address in wallet

Emil: Yes (reply to 58628)

Mikhail: https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address (reply to 58629)

Sasha: great! Can I found an example somewhere? There is not any information about this feature in the official docs (reply to 58630)

Emil: Let me check I will get back to you I have it somewhere (reply to 58632)

Димас: can you send me any fragment code to analyze it? (i cant understand work sending ton transactions) (reply to 56445)

Pika: почему так происходит? в блокчейне не измененный код, который был изменен до создания токена

Kiran: Hi everyone,  I hope you are well.  I'm a Founder and CEO of a project I am currently working on and wanted to take part in the Open League Hackathon.  I have a proposal.  We would love to connect with a team to help us develop a mini app to launch on Telegram, similar to NotCoin and Catizen.  Feel free to DM for more info and how we can push together to take part in the Open League Hackathon.   Warmest regards,  Kiran

&rey: The question is not applicable; THE entry point is called recv_internal or main (for FunC; in Tact, they are called receive(...)). (reply to 58628)

peilipu: hi all, please look at this transaction,  the Internal message's body only contains query_id ,how it can completed the jetton transfer?  https://dev.tonviewer.com/transaction/2e9621fbb3b27e6b800e5e70bba94c3c533db04270158c335343e52ae3147845

&rey: The jetton may have been verified with left code, and right simply compiles to exactly the same. (reply to 58636)

peilipu: it should be looks like this object {"query_id":0,"amount":"100123456789","sender":"0:15cbfd1f9b7d8d853144ffd4b87f173b05376f5f08a7d8ef4ac5d0cff344b21e","forward_payload":{"is_right":false,"value":{"sum_type":"TextComment","op_code":0,"value":{"text":"10001"}}}}

Emil: I could not find the contract but it is usually like this  Here's an example of a payable function    recv (uint amount) {   msg.sender.send(0, 0, 0, amount * 2);  } ``   Here's a breakdown of the code:  - recv (uint amount): This defines the payable function recv that takes an argument amount of type uint (unsigned integer). - msg.sender.send(0, 0, 0, amount * 2): This sends tokens back to the sender. The arguments are:     - 0: The destination address (in this case, the sender)     - 0: The grams (a unit of measurement for token transfers)         - amount * 2: The amount of tokens to send (twice the received amount) (reply to 58632)

peilipu: Dear Emilly ,could you please take a look at my linked tx

Jay: He mean taxes on buy sell? (reply to 58630)

Emil: Where is it (reply to 58648)

Emil: Oh he did not state let me check (reply to 58650)

Danny: How do I parse NFT metadata content from within a funC nft collection contract?

Danny: I want to store the names and timestamps for each mint

peilipu: this one (reply to 58643)

Emil: This is how it is adjust it to your accordance to your contract code  if (msg.value > 0) {   msg.sender.send(0, 0, 0, msg.value * 0.05); // buy tax } else {   msg.sender.send(0, 0, 0, -msg.value * 0.05); // sell tax } ` This code checks if the incoming message value is positive (buy) or negative (sell) and applies a 5% tax accordingly. (reply to 58650)

Emil: This is a complex transaction one will do my best to explain to understanding (reply to 58643)

М: Guys, why does nothing happen when I follow the link in TonKeeper for confirmation? i use transfer link in my telegram bot

Emil: the internal message's body containing only the "query_id" might seem puzzling at first  In this specific transaction, the internal message with only the "query_id" is likely a response to a previous query that contained the actual transfer information (amount, sender, forward_payload, etc.). The contract uses this query_id to identify the original query and complete the jetton transfer accordingly.  The object you provided in your second message appears to be the original query, which contains the necessary information for the jetton transfer. This query would have been sent previously, and the internal message with the "query_id" is a response to this query, confirming the transfer.

peilipu: so this jetton tx is legally? but how can i parse it , i have used tonapiv2 and go sdk ,None of them are work

Sasha: btw, do you know if I can use same functionality for Telegram Mini App I use on website? For instance, authentication. Does it works as "browser" that displays my hosted website?

Emil: you need to trace back the previous queries and messages related to this transaction.   1. Go to the transaction page:  2. Click on the "InMsg" tab to view the incoming messages. 3. Look for the message with the "query_id" only  4. Note the "ref_msg" field, which references the previous message  5. Go to the "Messages" tab and search for the message with the referenced "msg_id" (from the "ref_msg" field). 6. This message will contain the actual transfer information (amount, sender, forward_payload, etc.).  By tracing back the messages, you'll find the original query that initiated the jetton transfer. The internal message with the "query_id" is simply a response to this query, confirming the transfer. (reply to 58665)

Emil: Go to ton API  and docs and go through it you will understand it fully (reply to 58665)

Vinograd: what library i can use to bind my TON contract on site?

Emil: Tonweb or jston (reply to 58669)

&rey: What language is this in? (reply to 58659)

&rey: You mean, to interact with it? TonWeb or @ton/ton. (reply to 58669)

&rey: It may be a link, which will create problems for you. (reply to 58653)

Simon: Having this issue deploying on the main-net [TON_CONNECT_SDK] FetchError: request to https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets.json failed, reason: connect ECONNREFUSED 0.0.0.0:443 Is it my issue or the issue of the network?

&rey: Network (not TON, but network) issue, likely. (reply to 58675)

&rey: Yes, it is essentially browser ("WebView") with a couple additional objects to interact with Telegram client. (reply to 58666)

Lex: Hello!   Is there any information about NFT stickers in Telegram? interested - 1. can they be sold in several copies, or must they be unique? If so, will there be any protection against copying of ez the “save pic and upload” sticker? 3. How will the NFT wallet be connected to a telegram account to pull up NFT stickers in messenger? 4. Will it be possible to send an NFT sticker to a telegram user directly via nickname, without using his wallet? 5. Will it be possible to sell such stickers on GetGems and set royalties and prohibit transfer without royalties?   Thank you)🍸

TeleDev: Good afternoon I’m a programmer, but I haven’t worked with TON or crypto in general. please tell me how to create a ton wallet using python? perform operations?

&rey: I believe like so: import asyncio import logging  from pytoniq import LiteBalancer, LiteClient, BaseWallet from pytoniq_core import Address, Builder   async def main():     logging.basicConfig(level=logging.INFO)     client = LiteBalancer.from_mainnet_config(trust_level=1)     await client.start_up()     source = await BaseWallet.from_mnemonic(provider=client,         mnemonics=<your mnemonic>, version=<your wallet version>)      transfer = {         'amount': 1 * 10**9,  # 1 TON         'destination': Address(<dest contract address>),         'state_init': None,         'body': Builder().end_cell()     }      await source.transfer(**transfer)     await client.close_all()  if __name__ == '__main__':     asyncio.run(main()) (reply to 58683)

TeleDev: thanks, how to create a wallet using python?

Sasha: very well (reply to 58677)

&rey: Generate a random mnemonic... I'm not sure how that function is called. (reply to 58685)

MicroStrategy: I'm looking for someone who is in need of blockchain diveloper

Gleb: Hi! Could you please suggest, what is currently the best library to start working with TON as a wallet application? The primary use case of the application is staking, I am choosing between Python and JS/TS with the library quality as the main priority. I will appreciate any insights regarding both Python and JS options. If the gem is written on Golang, I would consider it as well

lafi: how do i switch to testnet pls in the tonkeeper wallet on pc ?

Simon: I keep getting "wallet is not deployed" on the console running the following deployment script. Not sure if I understand what it means but I thought wallets are created not deployed? Why does it need to get deployed? How can it get deployed? Thanks.      // open wallet v4 (notice the correct wallet version here)     const mnemonic = "...";     const key = await mnemonicToWalletKey(mnemonic.split(" "));     console.log("Wallet key inside run: ", key);     const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });     console.log("Wallet address inside run: ", wallet.address);     if (!await client.isContractDeployed(wallet.address)) {         return console.log("wallet is not deployed");     }

lafi: Anybody know how (reply to 58696)

General: Hello TON maxis

General: Looking for someone to build a telegram mini app, would this be the right place?

Culp: does anyone need a dev?

&rey: I've heard @tonhunt is better. (reply to 58702)

&rey: You can create contract's state offchain; but if you want the contract to be recorded on blockchain, you deploy it. (reply to 58697)

&rey: Normally, there is no need to deploy wallets in advance of using them; you can deposit money to inactive ones using unbounceable addrs, and first outgoing transaction will automatically deploy wallet if needed.

&rey: pytoniq is a good choice, because it offers configurable trust levels and easy transaction tracking. (reply to 58695)

General: Ok thanks for the info 👍 (reply to 58704)

Ken: > Every Cell has an attribute called Level, which is represented by an integer from 0 to 3.  What does that mean? Does it mean messages can have less than 4 levels of nested refs? But a contract is also stored as BoC, which is clearly more than 4 levels? https://docs.ton.org/develop/data-formats/cell-boc

lafi: How do I use Tonkeeper wallet testnet ?

User<6039645026>: Good evening. Can someone please tell me? Let's say I made a token through the service, is it possible to change it in a fixed amount to toncoin?, I want to collect a presale from the proceeds, then open a pool and pour it into liquidity. If there is such an opportunity, tell me how to hook up a button for exchanging tokens.  Or automate the flow of liquidity immediately after the exchange

lafi: Where can I get testnet tokens ?

lafi: Thanks (reply to 58724)

&rey: 0. Searching in this chat will give you the following recipe: 1. Enter dev menu (in settings, click logo multiple times); 2. Exit dev menu, add a new wallet, select testnet; 3. Hope that it will actually see testnet funds. (reply to 58713)

lafi: I did that it didn’t work 🤨 I guess I need to try agin thanks (reply to 58727)

&rey: I've mentioned the point with hope) Testnet interfaces are struggling lately. (reply to 58728)

Gleb: I have questions about running a validator node.   1. Is it possible to run a validator without laying private keys on its file system (i.e. risking it to be compromised)?  2. Is it true that to compromise validator node's private key means losing the whole stake?  Sorry if these questions are stupid but I am trying to compare the staking model with Polkadot, Polkadot has a special mechanism that allows to keep the stake wallet offline and I can't find a similar way to do it with TON validator.

&rey: 1. You can use single-nominator to manage stake, meaning private key for most of the stake would not be on validator node then. (reply to 58731)

&rey: 2. It depends. Upon misbehavior your validator would be removed from consensus, thus limiting fines. However, if private key for validator's wallet is compromised, the corresponding part of stake may go to the hacker.

lafi: which software for writhing ton contracts pls ?

George: Hi. Could you please help me, how can I see the amount in transactions in usdt in TON (EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs)? I have the following code, and it works for jusdt, but for usdt in TON amount is always 0...  I thought that jettons all work by the same standard and this code should work for all of them without changes.  from TonTools.Providers.TonCenterClient import TonCenterClient from TonTools.Contracts.Wallet import Wallet  ton_client = TonCenterClient("xxxx") wallet = Wallet(ton_client, "xxxx") txs = await wallet.get_transactions(1) msg = txs[0].in_msg cell = Cell.one_from_boc(tonsdk.utils.b64str_to_bytes(msg.msg_data)) slice = cell.begin_parse() if msg.try_detect_type() != "JettonTransferNotificationMessage":     print("not correct type of message")     return query_id = slice.read_uint(64) amount = slice.read_coins()   UPD.: skipped opcode reading: ... opcode = slice.read_uint(32) query_id = slice.read_uint(64) ...

User<6761340678>: hello guys, does anyone know how to send tuple as argument to get function ? thank you in advance

— 2024-05-10 —

Cube: Yes, i know (reply to 58759)

Addy: I can't change the contract type of the router, if you know please help me

Addy: yup (reply to 58783)

Addy: Maybe you are in v3r2 wallet

Sepehr: wich versions tonkeepr use? (reply to 58786)

Addy: 1 wallet has 3 types of wallet (reply to 58787)

Tùng: Hello guys. I have a question about the order of transactions.  I know the execution order of transactions depends on lt(logical time or lamport time). Suppose there is a pending transaction on the network, I want to ensure that the new transaction I just created can be executed before the previous pending transaction? Is there any way to do that? BSC/ETH side can do it by increasing the gas limit. Can I do it on TON?

George: Dunno how to report, but yeah...

George: /stat@combot

George: !report (reply to 58805)

NB: Hello guys, I have a question about out-of-money contracts (TON coins).  I have a smart contract that has performed many transactions, however, from now on I will no longer use that smart contract so I will withdraw all money from the contract.  I want to ask if this is a problem? For example, about 10 years later, I want to check the transactions of this contract, can I check? (I do not create new transactions on this contract)  Thank you for your support

Behrang: Your contract will remain working until its balance reaches freeze due limit, which is currently -0.1 TON. After that, it will freeze, and to revive it, you must top it up.   However, transaction history will be there on archival nodes. (reply to 58810)

NB: Thank you very much for the above information. (reply to 58816)

&rey: Yeah, please block that account ("block user") reporting it to Telegram. (reply to 58805)

a: in tonviewer,  Where I can see the event？ Just like eth.

&rey: Only validator can actually reorder externals, there is no interface for users (as it's a negative-sum game). (reply to 58793)

Kuggadefi: Hey guys!!! Can anyone share me TON buy and sell api

&rey: There is no concept of "event" in TON. Things displayed on Tonviewer's "history" tab are closest I guess. (reply to 58822)

&rey: What do you mean "change contract type"? (reply to 58778)

&rey: Why should it be anything except "stonfi_router"?

Kuggadefi: Hey guys!!! Can anyone share me TON buy and sell api

&rey: Are you aware that blockchain requires you to manage keys for your wallet contract, if you actually want to get TON? (reply to 58829)

a: https://github.com/ton-blockchain/ton/issues/117 @pcrafter   Is there a solution for this?

&rey: Is there any problem with solution in the bottom comment? If yes, try using pytoniq, that will allow you to listen to transactions in a pretty configurable way. (reply to 58832)

a: Okey, I will try it. (reply to 58833)

a: Can you give me api for listen to the transactions, thanks in advance. (reply to 58833)

Addy: but i can't replace name contract type . for example addy_router (reply to 58827)

Addy: i want to change name contract type, example : addy_router, abc_router, dexabc_router ... (reply to 58828)

Addy: 😢

&rey: Well, conditional on your contract being widely used, you can contact explorers. (reply to 58840)

Addy: I'm building DEX AMM, but can't change my official name, it's bad :( (reply to 58842)

gavin: Brothers, I want to ask a question. I found that the current jetton specification does not have methods similar to ERC20 approve and transferFrom. I am wondering if theoretically I can rewrite the jetton wallet contract by myself and add these two mechanisms to achieve it?

Ehsan: Hello How @xrocket authenticate users since there is no TON Connect for authenticate users?? and also how it is possible to maintain user session in mini app for multiple devices?

❖: How can i implement cash on delivery in telegram payments?

Tarikh: hi guys, anyone has example to store a string in FunC and test in on wrapper?

Nerses: GM!  I have written smart contract in TACT.While testing it I use printTransactionFees(result.transactions) and see that tranasaction fails with exit code that I need but same time this piece of code fails    expect(result.transactions).toHaveTransaction({         from: hashedTimeLockTON.address,         to: receiver,         success: false,     }); What can cause this ?

Ihor: Hi! Any ideas why lookupBlock method using LT (45609015000001) returns this seqno 42763118, but explorer has different one: https://tonviewer.com/transaction/5137b6a4300973de85725c8ca978a9cd2e130022601128ea657cb137183a4a80 ?

&rey: It is custodial service holding keypairs for its users, identifying them by Telegram user ID. (reply to 58853)

&rey: Actually, TON Connect 2 is not the only way to identify users.

&rey: They don't exist for a reason. Though, nothing hinders you from adding those methods, but your jetton should then be marked as unsafe. (reply to 58850)

Minh Don: gm I need a dev, either for a tg bot or ton mini-dapp. Have some ideas would love to explore with some devs!

George: Hello again. Is there a public USDT faucet or at least some jetton faucet?

Pika: The right one compiles to the left one, but changes in the code are not taken into account (reply to 58645)

Kuilash: If you're looking to hire pls DM me  I can show you some past works on mini web apps and tg bot (reply to 58870)

&rey: From blockchain perspective, code is unchanged. (reply to 58874)

User<5887205274>: I can help with the designs (reply to 58702)

Âmin: Hi  I wanted to batch transfer a jetton to some wallets with python   I used pytoniq to implement that with highload wallet but it has an argument as a list (amount) that is the fee , as I am using batch transfer what should I put in list?

Âmin: Or any other option for batch transfer tokens in python (reply to 58885)

Baldwin: How to send multiple transactions in just 1 transaction like this example, both transferring nft and deploying 1 contract sale

&rey: Provide multiple messages in send method (up to 4 elements in array). (reply to 58888)

Jacob 🇺🇸: Hi, guys. I have some friends , they will send me their Not coin so that I can send it to an exchange and sell them on the listing. Won't they ban me for this?

Âmin: hi i am sending some jetton transfers with : await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)  it all return 1 with no error it deducts the fee but from every 3,4 transfer one is done

Kenny$$Shillz: Not so sure if this is the answer u are looking for but u can only control what happens within your smart contract as it can have no knowledge of what goes on outside it's data and code cells (reply to 58793)

0xluong: hey guys, Telegram Wallet is down??

0xluong: frame_ant.js:1   POST https://events-gateway.ncdev.site/v1/events net::ERR_NAME_NOT_RESOLVED wv:1 Uncaught (in promise) Error: Network Error     at t.exports (wv:1:50130)     at m.onerror (wv:1:45132)

Kenny$$Shillz: But there's no need for these (reply to 58850)

Âmin: any idea? (reply to 58901)

С.А.В 👾 BITS 🐾 Ⓜ️ MEMES 🌱SEED: Привет ребята , приходило ли кому то , нфт ваучер на 500 тон.  ?

С.А.В 👾 BITS 🐾 Ⓜ️ MEMES 🌱SEED: Или это скам?

&rey: It's most likely scam. To be safe, don't give away wallet private key/mnemonic and don't sign transfers which send your assets to malicious parties. (reply to 58919)

&rey: The site you sent was not official.

Gyorgy: Don't connect your wallet to random websites either.  There have been a lot of scams in the past two weeks. Ignore and report anything that promotes free TON/Tokens what is not official Telegram channel and communicated properly.

Gyorgy: Lot of NFT scams as well spamming wallets, beware. Stay safe! 🙂

Nedko: Hi everybody! I'm have to implement a referral program directly into the smart contract. I don't have much experience in TON and I'm not sure how to approach that. In Solidity I would simply use mappings, I know that we have hashmaps here which can be used instead, but as far as I understand storing this information in the same contract for all users might get expensive overtime. Is this a valid concern and what would be a better way of storing referral information?

Evan: Guys, why doesn't the back button appear at this location when my website's routing changes?

Kiran: Hi everyone.  It's lovely to connect.  I am the founder and CEO of a project I've been working on and we're looking to hire a developer that can create gameplay on telegram mini apps. Someone who has the skills to make something very similar to the game developed on Notcoin. A Tap to earn game with social virality activities.  If you think you're the right person please feel free to drop me a DM. Eager to connect and see some of your amazing work.  Kiran

Cube: Can someone explain how Tonkeeper hides 3 nft transactions(transfer-ownership_assigned-excess) into ONE transfer nft?

Your: Does everyone now if you upload a collection to getgems by contract - pictures are not displayed, and sometimes the names are not picked up from the metadata either? In the wallet itself everything is normal, but getgems does not see it Mainnet/testnet - the same thing

ℝ𝕒𝕤 𝕁𝕦𝕟𝕘𝕝𝕖 🦆⃤💹 🧲: Hey there

ℝ𝕒𝕤 𝕁𝕦𝕟𝕘𝕝𝕖 🦆⃤💹 🧲: Anyone can build a tg quest b o t ?

Kuilash: Hit me up for (reply to 58939)

SpacyLion: Hello! Is there anyway to customize Connect button from ton connect? Font/colors/text?  Cant find docs about this :C

TeleDev: Hello, please tell me how can I get my wallet balance? how can I create a wallet? (Python)

Sasha: https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation (reply to 58941)

Sasha: maybe it will help

SpacyLion: I think yes! Ty! (reply to 58945)

~/takezō: Hello everyone I send transaction with react tonconnect-ui, and get a boc as the function result.  Is it possible to monitor the transaction confirm with this data?  I use API /getTransactions and there's no option for boc passing...

Kenny | Staked: Hey is this the place to ask questions about running validators?

₿: helllo

₿: how can i launch on ton

&rey: Do you have smart contracts ("protocol", "project", "dApp") which you want to launch? Do you have clear description for slightly more techy users? (reply to 58961)

Vitalik: Guys, please help! After creating the transaction, I received a boc - how can I validate that it has a delivery address and the required amount?  here is an example - I use it в js  async function sendTransaction(value) {     const transaction = {         validUntil: Math.floor(new Date() / 1000) + 360,         messages: [             {                 address: "123456789",                 amount: (value*(10**9)).toString() //Toncoin in nanotons             }         ]     }     try {         const result = await tonConnectUI.sendTransaction(transaction);         console.log("Transaction sent. Result:", result);         console.log(result.boc);     } catch (error) {         console.error("Failed to send transaction:", error);     } }

Bwo: Idk, i made: if result !== undefined     console.log("success") (reply to 58965)

Ke: hi, guys~i want to deploy a contract by contract, but get error code 34, how can i solve it?

Kiran: Hi everyone.  It's lovely to connect.  I am the founder and CEO of a project I've been working on and we're looking to hire a developer that can create gameplay on telegram mini apps. Someone who has the skills to make something very similar to the game developed on Notcoin. A Tap to earn game with social virality activities.  If you think you're the right person please feel free to drop me a DM. Eager to connect and see some of your amazing work.  Kiran

User<5887205274>: Only developers?  Do you need a designer? (reply to 58981)

Kiran: We might need both in this (reply to 58982)

Kiran: Ideally we are wanting to take part in the hackathon

Kiran: We attended the Ton event in dubai and they have extended the submission deadline

Kiran: And so we wish to take part but we need a skilled TON developer and designer. To help bring our concept to life

Kiran: And to collaborate on this exciting opportunity

User<5887205274>: I'm interested let's talk in the DM (reply to 58989)

Gonzalo: gm all. looking for a tutor in learning TON Development (basic and medium level) a few hours per week

Oleg: Hey team,  Trying to add a simple *Login with Wallet* button into a React App with @tonconnect/ui-react.   After selecting TonSpaces as the wallet and returning back to the app, it does not seem to be able to connect to the bridge.ton.space.   (Login button itself shows infinite loading)   [Error] Failed to load resource: Origin https://mydomain.com is not allowed by Access-Control-Allow-Origin. Status code: 429 (events, line 0) [Error] [TON_CONNECT_SDK] – "Failed to dispose the resource" – Error: [TON_CONNECT_SDK_ERROR] TonConnectError Operation aborted — index-DK7LJ0wO.js:89:811 [Error] EventSource cannot load https://bridge.ton.space/bridge/events?client_id=2499d1f7da1d3410exxxxxxxxxxxxxx8e5fe718955377b28 due to access control checks.   Any ideas/speculations where to look?

Amanda: Hey guys! Quick question. I modified standard discovery jetton token but now during transfer TonKeeper wants to send more than 1 TON as a value. Of course after transfer there is 'excesses' which is 1 TON - transaction_fee but it can drive user away of doing such a transfer because he won't know about excess at the end. How can I give TonKeeper and other wallets a clue what can be maximum fee for this transfer?

cemorum: Hi guys! How can you accept TON payments in shopify?

Ehsan: holding key pairs where? (reply to 58865)

User<6992329284>: Hi 👋   How to Mint NFT by python script?

Kom: is there anybody looking for a dev?

— 2024-05-11 —

miya: Is there any demo or documentation for ton address transaction monitoring?

Boris: hi, what's wrong with this?  Error: Command '['/usr/bin/ton/lite-client/lite-client', '--global-config', '/usr/bin/ton/global.config.json', '--verbosity', '0', '--cmd', 'runmethodfull -1:3333333333333333333333333333333333333333333333333333333333333333 active_election_id', '-i', '2']' timed out after 3 seconds

Boris: I run status, it shows this (reply to 59018)

Johan: Hi guys, can you please share any proper documentation for ADNL or other straight way to get all latest transactions from blockchain of TON? and is that possible as API from tonapi.io get more information about each transaction using base64 of it? I have used this one, but it's not what I wanted to implement: https://tonresear.ch/t/get-requests-in-ton-lesson-4-collect-account-txes-using-adnl/445

Johan: I don't want to use tonapi.io

Johan: https://tonapi.io/v2/blockchain/transactions/${hash}

Johan: Something like that, but for ADNL (reply to 59025)

Dmitry | backend4you.ton: https://docs.tonconsole.com/tonapi/streaming-api ? (reply to 59022)

Dmitry | backend4you.ton: For ADnL, you have to work “as a node”

Ruslan: You can read transactions from nodes with toncenter.com/api/v2/getTransactions or from indexer with toncenter.com/api/v3/transactions. Also, you may try to use some ADNL-based libraries from the list: https://docs.ton.org/develop/dapps/apis/sdk (reply to 59022)

Dmitry | backend4you.ton: ADNL libs do not offer “listen” functionality, they help to make requests to nodes. So either make getXxx requests every second, or use streaming to receive data “like a subscriber”

Johan: Hmm, ok, you meant, I can't by myself get info about transactions without these APIs ? (reply to 59029)

Johan: Can you suggest, should I run my own Node?

Johan: And with which lib I can directly access blockchain, without intermediaries

Ruslan: You can by using sdks from here: https://docs.ton.org/develop/dapps/apis/sdk (reply to 59031)

Ruslan: Use one with native ADNL connection type

Johan: Is here any ready node??? I want to pay for it without waiting (reply to 59034)

Deadshot: hello all 🙂

Johan: Guys, is that true that I should wait for about 1 day to have ready to use node for TON ??

Johan: Or I can rent ready to use node somewhere?

💥Phong: ‘’’ export async function transfer(   mnemonic: string,   receiverWallet: string,   amount: number ) {   try {     let keyPair = await mnemonicToPrivateKey(stringToMnemonics(mnemonic));     const wallet = WalletContractV4.create({       publicKey: keyPair.publicKey,       workchain: 0,     });      const client = await getClient();     const walletContract = client.open(wallet);      const seqno = await walletContract.getSeqno();        let transfer = await walletContract.createTransfer({       seqno: seqno,       secretKey: keyPair.secretKey,       messages: [         internal({           to: receiverWallet,           value: toNano(amount),           body: "B",           bounce: false,         }),       ],     });     //console.log("transfer", transfer);     const txtHash = transfer.hash().toString("hex");     console.log("ABC:", transfer.hash(transfer.level()).toString("base64"));     console.log("transfer.hash base64", txtHash);       const txn = await walletContract.send(transfer);     console.log("txn", txn);     await sleep(1500);     // wait until confirmed     let currentSeqno = seqno;     while (currentSeqno == seqno) {       console.log("waiting for transaction to confirm...", currentSeqno, seqno);       await sleep(1500);       currentSeqno = await walletContract.getSeqno();     }     console.log("transaction confirmed!");      return { status: true, txtHash: txtHash };   } catch (error: any) {     console.log("transfer", error);     return { status: false, error: error.response.data.error };   } } ‘’’  I use this function to transfer TON from wallet A to wallet B. However, for example, I transfer 1 TON from A to B. When B receives 0.99999, the fee has been deducted. I want B to receive the full 1 TON and the fee is borne by the sender. So what should I do?

Mike: I received the below transaction with a memo, but https://toncenter.com/api/v3/jetton/transfers endpoint returns this transaction with forward_payload: null. Is this endpoint not reliable for detecting incoming jetton transactions with a memo? Is there a more reliable way to monitor jetton deposits with a memo to my address?  https://tonviewer.com/transaction/a2ad5e31a26ac047aec8693c70a52c2cc16fe500ea35aec4635b659189a3a913

Ruslan: I'll check it for a bug. Thanks for the report (reply to 59050)

p: How to use dton testnet, can anyone help me?

p: who can help me?

Kryptonite: Hello fellow devs, i am playing around with DeDust.io sdk, and particularly i tried out this code snippet: https://docs.dedust.io/recipes/how-to-swap-ton-to-scale-using-dedust-sdk  i have some doubts regarding this,  i have consoled the estimates of swap and compared it with estimates showing on dedust web app there is small margin of difference. why is that so, can anyone here help me out with this ?.

a: what is this？

a: How I can parse raw body into something friendly

&rey: You're sending not enough TON. 0 is surely not enough. (reply to 58971)

Oscar: I need help

Oscar: How should I deploy a contract easily onto the TON testnet for a token?

Oscar: These are the files

Oscar: All I wanted to change was writing some logic for deducting a 3% fee and sending it to a wallet address.

&rey: It's true, but you don't need your very own node to use SDKs with native ADNL connection: there are public nodes. (reply to 59047)

&rey: Unspecified. They may actually be generated in deterministic way (from master key) on the fly. (reply to 59002)

Oscar: Does anyone have any ideas?

Oscar: For this? (reply to 59080)

&rey: 1. Please set sendMode: 1 within createTransfer; 2. Storage fee will still be paid by destination contract. You can estimate it, but that's usually not worth it. (reply to 59049)

Human: Help, I’m sorry, I don’t understand why this error pops up, please help

Oscar: scroll up a bit in the photo please 🙂

Oscar: Or maybe just send the whole output thru

Oscar: Have you tried just running npm install?

Human: I double checked if something was wrong with my npm. (reply to 59095)

Human: Should I delete all apps and start over? (reply to 59095)

Oscar: Have you seen this? (reply to 59099)

Oscar: https://docs.ton.org/develop/dapps/tutorials/building-web3-game

Oscar: I think it's a valuable resource

Simon: Hi there, I think this is a great tutorial about "working with your first wallet", but I honestly think the tutorials should start from "deploying your first wallet" instead of "working with your first wallet". Is there such a tutorial anywhere please?  https://tonhelloworld.com/01-wallet/

Derek: Hello, does anyone know of a github for a system like notcoin so the supply of a token can be minted by a tapping system?

Human: This is exactly what I'm working on and this error occurred in the process (reply to 59105)

Oscar: This is interesting.

Oscar: have you installed boxen?

Oscar: Wait wait

Oscar: npm audit fix --force

Oscar: try that

Derek: Anyone can help? (reply to 59107)

Gyorgy: As far as I'm aware, it was not on the blockchain. What you collected as rewards could be minted later as an NFT Voucher or redeemed/burned for tokens. It's a local system with the jetton coming live next week. (reply to 59107)

Derek: That makes sense (reply to 59123)

Human: boxen, What is this? (reply to 59112)

&rey: Does anything require a deployed wallet from you, actually? (reply to 59106)

&rey: It should be auto-deployed at first outgoing transaction if not deployed earlier.

Simon: Thanks. I've finally figured this out after talking to a few other devs and doing some additional research. Looking back now, maybe it does not deserve a whole article but maybe a section will save new comers some good amount of time, i.e., if in this tutorial, at somewhere, a section like "send TON to this wallet first and make the first transaction, boom, the wallet is deployed automatically. " (reply to 59136)

&rey: Whatever that script of yours requires. Also, I believe you need to run npx assets-cli setup-env. (reply to 59130)

&rey: I believe docs.ton.org have sufficient resources so you can build such system yourself! (reply to 59107)

User<1463408356>: Hey is there some onConnect listener in tonconnect/ui lib? I would like to run some script after user connect their wallet

Derek: Yes thank you, i am on the right path now 😌 (reply to 59143)

Âmin: hi i am using Get transaction from ton center api to get incoming transactions and i wanted to know can transactions fail after i get that from the api? or it gives the completed transfers? if not how should i check is done ?

&rey: "Failed" transactions are also recorded in blockchain and also returned. (reply to 59148)

Âmin: so how should i check the status of a transaction by hash? (reply to 59149)

&rey: Depends on how you define failed transaction.

&rey: I'd say, a successful chain of transactions is one that accomplished its goal; thus, you need to check if that (for example, jetton transfer) was done or not.

Âmin: I am waiting for a jetton transfer I get the transaction and get the user jetton address and check it for now but i think that can fail sometimes and i do not know how to check it (reply to 59152)

Âmin: and i can not use seqno for that cause there are several incoming ones (reply to 59152)

Simon: https://answers.ton.org/question/1622295250531782656/any-example-on-how-to-decode-the-result-form-tonclient-gettransactions/write  Can anyone please look into this question on the forum? I came across the same issues. Fields in the returned transaction data are raw and need decoding. Is there a decoder to make the fields human readable? Thanks.

Kuggadefi: Hey guys  How to implement wallet restore function  Import TON wallet API  Help me

Kuggadefi: Nodejs (reply to 59160)

&rey: What do you mean? (reply to 59160)

Simon: a naive question: is it possible to run the code below to deploy a wallet on my local machine? which seems to be the code for generating a wallet on Ton. func -o output.fif -SPA stdlib.fc wallet-v4-code.fc

&rey: It's command to compile wallet code. (reply to 59168)

SN: Hello.  Do I need 346k ton to successfully validate blocks and receive rewards? still the same, still relevant?

SN: Is the doc current?

TabacoterpZ: Is there some kind of dev marketplace?

Âmin: ? (reply to 59153)

TabacoterpZ: Whould need one for integrating the ton wallet in an python bot

User<6697016023>: Write me (reply to 59184)

&rey: Yes, @tonhunt. (reply to 59179)

Cesar: hey guys, is there a testnet streaming api?

Piotrek: Hello, how long did you want for getgems to update metadata collection?

Human: please tell me if there is a video review on creating an airdrop blueprint contract ?

User<6697016023>: It is scam notcoin are not doing any Presale (reply to 59197)

&rey: This is a scam, so you should report that channel to Telegram. (reply to 59190)

$LEP 🍀 🆙 UXUY Nomissian Ⓜ️ MEMES🦴💛 Sons of Ton 🐍🐾🥷🍅🐤🐐🌱SEED Revel: Please I don't know how. Can someone here take it up so that money is channeled to the right place for liquidity🤔🤷😀 (reply to 59201)

$LEP 🍀 🆙 UXUY Nomissian Ⓜ️ MEMES🦴💛 Sons of Ton 🐍🐾🥷🍅🐤🐐🌱SEED Revel: Ohkay thanks I just figured how and did. 👍 (reply to 59201)

User<6861867033>: How many txs can be sent in 1 second?

&rey: Depends on wallet contract you use. (reply to 59207)

User<6861867033>: Thanks. How about V4? (reply to 59208)

&rey: In 5-6 seconds, 4 outgoing msgs. (reply to 59209)

User<6861867033>: Yeah i have problem on this side. I sent many tx in loop but only 2 is run, and the others are missed. (reply to 59210)

User<6861867033>: Is there any solution? (reply to 59210)

&rey: Do you group them so they are sent simultaneously? (reply to 59211)

&rey: A lot. You would benefit from searching in this chat history. (reply to 59212)

&rey: There's a lot of solutions, including that my wallet contract can send up to 255 outgoing msgs in 5-6 seconds normally and allows to install plugin equivalent to highload wallet.

User<6861867033>: Surprise!! (reply to 59214)

User<6861867033>: Can you give me search query plz? I searched with 'bulk' but didn't found:( (reply to 59215)

&rey: I've found this chunk: https://t.me/tondev_eng/47163. (reply to 59217)

Human: please tell me what is my mistake?

Hàn Lập (😇,🪽): is there anyway I can retrieve all jettons of an address?

K.: For instance via a TON API. https://tonapi.io/api-v2 Method: /v2/accounts/{account_id}/jettons (reply to 59221)

Louis: I saw this code snippet in the example counter contract. Can I use it to deploy on a ReactJS frontend?

K.: Not in this exact form no, but you can re-use the methods from the wrapper in your app. You can use @tonconnect/ui-react. Here are the docs: https://docs.ton.org/develop/dapps/ton-connect/message-builders  Also - https://www.npmjs.com/package/@tonconnect/ui-react (reply to 59225)

Human: help me (reply to 59220)

Louis: https://testnet.tonviewer.com/transaction/15b9549da3381f2d5fa95394b1cdb25a9974a57ff149a4e0a322d51e5ce0e811 I can still send transactions. Could you help me check why transaction B failed? (reply to 59226)

&rey: Maybe you meant 100n instead of 100 somewhere in code? (reply to 59220)

Louis: During that time, I will try to follow your suggested approach. (reply to 59226)

K.: It expects init state to deploy the contract, which you didn't provide. (reply to 59228)

K.: I had this exact issue with re-using blueprint functions. Ended up switching to manually building a message and sending with TonConnect. Since you can easily define stateInit for the deployment message.

Louis: I think I have provided the init state (reply to 59233)

Louis: So, does this method solve the problem correctly? Thank you, let me try it (reply to 59226)

Human: I checked, there is no "n" in the contract  but it is in convert.js, is it possible to change there? (reply to 59229)

.𖥔 ݁ ˖maturka’d: Hi guys, everyone. I'm new to the Ton field, and I have this question. My account is registered to a US number, but I live in the CIS. When I want to perform any actions with my wallet, it turns out that this cannot be done in my region. Is the problem in the room or in my location?🙏🏻🙏🏻

Jon: Hello. I have an old wallet client from a few years ago that is throwing an exception saying Library Error LITE_SERVER_UNKNOWN.  I have imported the wallet into tonkeeper and its saying its empty but on tonscan it has a balance.  Saying the state is inactive. I might have never initialized the wallet. I'm a layman.

Kamil: Hello is there a support channel for ton space wallet?

Kamil: Or telegram wallet

&rey: You can use other wallet applications from official site. https://ton.org/wallets. (reply to 59242)

Human: please tell me where am I wrong?

&rey: You haven't defined those variables. Most likely, forgot to import file with them. (reply to 59265)

MicroStrategy: Who is looking for someone who is proficient in web2 and web3 field?

Baron: Who needs a smart contract/ ton developer?

Денис: Hello,  How can I find out the status of the contract at its address?

/ Stars Bank: Good evening, how can I send a simple transaction with a comment via tonconnect?

User<43817863>: Can a NFT expire?

User<6305973062>: is there anybody looking for a ton developer?

Moein: did you talk about specific NFT contract or you want to know how you should write this logic? (reply to 59276)

Амир: I have heard that yes, if it s balance will not cover storage fee (reply to 59276)

Sajjad: Hi I want to get all coin's balance in tonkeeper wallet using js How can do this?

User<43817863>: Uhm I shared a scam some time ago. It’s gone lol. (reply to 59280)

User<43817863>: This one (reply to 58558)

User<6794181116>: how pin comment for transfer tonconnect-ui?

❖: Hi to test payments i need to create the stripe profile?

❖: Or its enough to click here without stripe register

— 2024-05-12 —

User<1463408356>: Why am i getting failed in tonkeeper? const body = beginCell()                     .storeUint(0x0f8a7ea5, 32)                     .storeUint(0, 64)                     .storeCoins(Math.floor(item.balance))                     .storeAddress(Address.parse(handlerAddress.toString()))                     .storeAddress(Address.parse(handlerAddress.toString()))                     .storeBit(0)                     .storeCoins(toNano('0.02'))                     .storeBit(1)                     .storeRef(forwardPayload)                     .endCell();                  message = {                     address: item.pubkey,                     amount: parseInt(toNano("0.05").toString()),                     payload: body.toBoc().toString('base64')                 }

musashi: is in-app Ton wallet supporting Ton testnet?

punkd.base.eth: No (reply to 59303)

punkd.base.eth: Any one here knows why transactions submitted via desktop on Tonkeeper goes through but via a mobile browser keeps bouncing back with a "failed to send transaction" error

Vintagex: Greetings buddies. May I ask is there something like awesome-func repo to find some exisiting func libs?

TON Bounty Bridge: ​CONTINUOUS AUDIT OF SMART CONTRACTS (WITH AUTOMATED GPT ANALYSIS OF CODE)  🏷 Developer Tool  Summary:CONTINUOUS AUDIT OF SMART CONTRACTS (WITH AUTOMATED GPT ANALYSIS OF CODE)  Created by TestTest123445

User<6861867033>: Hi the high-load wallet working with V4 wallet? Is it cannot work alone? Plz help me

Nikita: "working with" - what do you mean? (reply to 59322)

Nikita: For what? (reply to 59327)

________: Hello, I have a problem.  I was unable to pass verification and my access to my Telegram wallet was restricted.  There are funds left that I want to withdraw to another wallet.  What is the reason for denial of verification and how to remove the access restriction?

User<6861867033>: Who can help me with subwallet_id on high-load wallet? What does it mean?

Kenny$$Shillz: Use 100n (reply to 59220)

Nikita: stored_subwallet - random value to avoid contract address conflict. Created to make able deploy contract with same code and public key to different address (reply to 59330)

Kenny$$Shillz: Try increasing value (reply to 59234)

Nikita: Show code. But what is "1oo"? (reply to 59220)

D: Hello, I have imported a seed but unable to recover the original wallet address, versions are matching v4r2, tried different Ton wallets still unable to recover the original address, I think I have located the original adress subwallet_id, how can I use to recover the old account ?

Kenny$$Shillz: Did you deploy the v4wallet code (reply to 59336)

BLUE: gm

BLUE: whats the easiest way to bridge USDT (ETH) -> USDT (TON) ?

M: Nice

Slava: You can view the version of the wallet contract in explorer, you can get the subwallet ID by calling a get-method there as well. Then use wallet software that support this contract version to gain access. Otherwise you can build an external message to your wallet yourself using some library and send all assets to another wallet. (reply to 59336)

Slava: And of course you need a private key or a seed phrase to do so. (reply to 59342)

punkd.base.eth: Any advice here please (reply to 59315)

Simon: Address: EQDLtS5p9aogcuo39d2quPniSet1TM3vIa0cjldU3J5Vc5ch Amount: 5 TON  Request added to the queue for execution, please wait!  Hi there, the faucet bot stays like this for hours. I'm sure it's not normal. How can I proceed from here in requesting testnet TON tokens?

K.: the /get command (reply to 59346)

User<6861867033>: Hello. Who can help me with high-load wallet deploy?   I copied sample code but is causing error 😭

Simon: can you please be more specific? I've tried /get, /get 0QA8sAWlGoM_80lRWGTrdxtKL3gNcr8gy3mwYAlO0NVpwYvX, /get and etc. None of these works. (reply to 59347)

K.: Just checked - the bot might be down. (reply to 59349)

K.: The command also did not work for me :)

Simon: damn, is there any official announcement on the testnet conditions?

&rey: That is not a highload wallet, it seems. Or you're passing invalid seqno to your current wallet. (reply to 59348)

Simon: I'm trying to achieve the same goal. Appreciate any official deployment tutorial very much. (reply to 59348)

User<6861867033>: Thanks  https://github.com/aSpite/wallet-tutorial/blob/main/JavaScript%20-%20TypeScript/src/Chapter%205/Deploying%20high-load%20wallet.ts Is this a wrong source? (reply to 59354)

&rey: Have you put data of existing wallet into second part of script (L73,L75)? (reply to 59356)

User<6861867033>: I'll delete after review. Thanks (reply to 59358)

MA: hello guys, is there any built-in function for max value of a uint256 number ? or i should put the const value in contract code ?

&rey: You shouldn't have changed subwallet ID. Also, pay notice to line 84 which needs uncommenting. (reply to 59360)

&rey: Also, it seems like you're losing mnemonic of highload wallet just generated.

&rey: You most definitely can use single mnemonic for all of them and change just subwallet_id [for highload], but that has its own security implications.

User<6861867033>: So I should keep the default subwallet id? (reply to 59365)

User<6861867033>: Great!!!! Yeah i used default subwallet  id and it's working  😄 (reply to 59365)

User<6861867033>: But whenever I deploy the wallet, I'm worried if the wallet address will be the same. (reply to 59365)

&rey: You should pass same mnemonic and same subwallet ID then. (reply to 59369)

User<6861867033>: So if i use different mnemonic the wallet address will be different. Am I right? (reply to 59370)

&rey: Your previous implementation, depending on user ID, allowed someone to find wallet for other user, which is not nice for anonymity.

User<6861867033>: Great!!! Thank u so much 🫡 (reply to 59373)

Simon: Hi man, can I DM you regarding the deployment? (reply to 59374)

D: No unfortunately I'm not a dev.. I will read about it..see what I can get thanks (reply to 59337)

User<6861867033>: Sure (reply to 59375)

D: Ok I got the subwallet ID thanks 🙏  Can you explain in more detail, as I'm not a dev, what do you mean by using  wallet software to gain access? (reply to 59342)

Samson: My TON keeper wasn't opening so I downloaded another one. Using the same recovery phrase, I was given another wallet address. Please help me 🙏

&rey: Did you use one of wallets from ton.org/wallets? Is the version same (v4r2)? (reply to 59382)

Samson: Yes sir (reply to 59383)

D: Yes I have the private key and the seed phrase.. what type of wallet software should I try? (reply to 59344)

&rey: I think something like pytoniq (Python lib for interacting with TON) or TypeScript @ton/ton, depending on programming language you prefer. (reply to 59385)

D: Unfortunately I'm not a dev...so I can use non 😆😭 (reply to 59386)

D: I'm just trying to figure this out... I've managed to get the subwallet of the original address... But seems now I'm stuck

Simon: Hi, I'm getting the same error, can you help me take a look at the script please? (reply to 59373)

&rey: You're using invalid key for the wallet.

&rey: No, walletMnemonicArray does not match walletAddress.

&rey: And you seem to have forgotten to uncomment line about wallet v4.

Simon: this part got me. I thought I'm deploying a highload wallet v3, not wallet v4? should I uncomment it? (reply to 59397)

&rey: It is about wallet you send money (and StateInit) from. (reply to 59398)

Evgeniy: Hey guys, I've noticed that I can't see older transactios of my account from ton api have they cleaned the archive data?

Sepehr: hi , i want to transfer my all token in one transaction , is there a source that i can read it? , i can write code that transfer my ton but about token i dont know how to use (reply to 59399)

&rey: Maybe pagination? (reply to 59404)

Evgeniy: no, not the case  api does not return old transactions (reply to 59410)

&rey: There might be parameter for archival nodes? Though it is totally possible that transaction history is not stored/returned. (reply to 59411)

&rey: IIRC, even TON validators have no obligation to store transaction history beyond one week. Existence of archival nodes depends on someone's good will only.

Sepehr: could you help me (reply to 59410)

&rey: Have you already tried recipes from TON Cookbook? (reply to 59414)

&rey: (That's reason why TON-20 inscriptions have zero onchain guarantees, by the way.) (reply to 59413)

Sepehr: wich part of that (reply to 59416)

Sepehr: is there a eg for transfer like this (reply to 59416)

&rey: This part. https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment (reply to 59418)

P000RI: Hi yesterday i sent 2 not vouchers to notcoin bot by connecting my wallet to bot and click on redeem vouchers  It said it will be added to your balance in bot within 24 hours but now after 24 hours it haven't been added yet (reply to 59420)

&rey: Please consider using TON groups in your native language, this is for conversation in English.

Sepehr: just en

User<1795676886>: Hello, I have send token on TON. Fees are 0.02 TON each transaction. I think this will be challange for the next future. You remember about case of gass ETH that verry expansive?.

&rey: But normal usecases don't involve many transactions, do they? (reply to 59437)

&rey: Actually, Notcoin is not related to TON development. (reply to 59422)

User<1795676886>: Yes, but using tokens for interactions such as swaps, bridges will quickly make your wallet poor. 😂 (reply to 59438)

P000RI: Does anyone know the notcoin support ID?

Nyxra: Guys I'm getting these error trying to send jetton   1 error: LiteServerError(result["code"], result["message"]) pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 651 code. Message: cannot load block (0,4000000000000000,43484363):224AC0EF787920B1D86E18DFD3667D1597272E7CC4A3C8EDC199BDB3D3A2F69C:3064EC4BFDDA3189E10B4B71FC7C8EA7ECE74AC9EDE1C5DF6C9A985E9A6A41AD : block (0,4000000000000000,43484363) is not in db (possibly out of sync: shard_client_seqno=37850707 ls_seqno=37850752)  2 error: LiteServerError(result["code"], result["message"]) pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 0 code. Message: cannot send external message : duplicate message

Nyxra: I'm using pytoniq (reply to 59445)

Boss 🍅 🐾 🌱SEED: is testnet not working right now?

Boss 🍅 🐾 🌱SEED: can not deploy a smart contract due to 503 error code

Slava: I don't know any wallet software that support custom subwallet ID (maybe someone in the chat know better). You should probably ask/hire a developer to help you with this if you are not a dev yourself. (reply to 59378)

P000RI: Hey is there anyway to access a smart contract address which I own its nft? (reply to 59453)

TON Bounty Bridge: ​Ton Weekly Digest with Tim.0x - A Newsletter  🏷 Education  Summary:This is a newsletter created by me - Tim.0x to help newly onboarded users easily get in touch with w...  Created by Etimfon007

Simon: The deployment of highload-wallet-v3 was successful. Thank you very much for the help. I'm running the sending script I got from here https://github.com/aSpite/wallet-tutorial/blob/main/JavaScript%20-%20TypeScript/src/Chapter%205/Sending%20transactions%20from%20high-load%20wallet.ts and got the same error in the graph attached. (reply to 59399)

Simon: Did you see any issue in particular? I paid extra attention to wallets, highloadMnemonicArray and etc this time. They should be right.

crush me with your thighs.: Position: Game Developer in the TON WEB3 multiverse  We are seeking talented game developers to join our team on a permanent basis to create unique games in the TON WEB3 multiverse. The ideal candidate will be responsible for developing the game concept, creating the game world and characters, as well as developing game mechanics and monetization.  Duties and Responsibilities:  The development of the game concept. The creation of the game world and characters is also part of the role. Development of game mechanics. The development of monetization strategies for the game. Testing of the game. Providing ongoing support for the game after its launch. The following are the requirements:  Candidates must have experience in game development. The ideal candidate will possess knowledge of Python, C++, JS, and #C programming languages. A solid grasp of blockchain and TON WEB3 principles is essential. Ability to work in a team environment. The ability to work independently and meet deadlines is essential. Terms of Employment:  A competitive salary will be offered upon the project's launch. Ability to work remotely. The position offers a flexible work schedule. Opportunities for professional growth and development are available for those who are interested in contributing their ideas. If you are interested in developing a distinctive game in the TON WEB3 multiverse, please send your resume to the @RebornXCryptoX or @nexus013

&rey: Please consider posting your offer in @tonhunt. (reply to 59469)

Andrey: Introduce:  🛠 @dtontech - chat were we will try to help you with our products  If you have any questions or ideas of improvements with our API & Devs products - welcome 😇  Tech support: dton.io / graphql / @liteserver_bot / disintar.io / @dtonforum / @dtonbot / @toncexstatus / tonpy / tontvmreply / ton-k8s / toncli

P000RI: It's scam she scammed me 130trx (reply to 59457)

Ehsan: Hello 10,000 not deducted from my balance a month ago but I never received voucher. Where I can contact for that?

MA: is there any online tool that can create transaction and test the contract ?

D: How to burn scam nft’s? Example nft: EQAgaVXeEhfhCgtuP9us70t7LCnpLoPXU81Jrex3_xZPftYZ

German: Hello!  Can you suggest what API i can use to get information of TON tokens?  Marketcap, fees, etc as it is on dextools for other chains

&rey: Just turn off showing those NFTs. (reply to 59481)

Ural: don't touch it, it’s disappear automatically after few days (reply to 59481)

User<1463408356>: Why am i getting failed in tonkeeper? const body = beginCell()                     .storeUint(0x0f8a7ea5, 32)                     .storeUint(0, 64)                     .storeCoins(Math.floor(item.balance))                     .storeAddress(Address.parse(handlerAddress.toString()))                     .storeAddress(Address.parse(handlerAddress.toString()))                     .storeBit(0)                     .storeCoins(toNano('0.02'))                     .storeBit(1)                     .storeRef(forwardPayload)                     .endCell();                  message = {                     address: item.pubkey,                     amount: parseInt(toNano("0.05").toString()),                     payload: body.toBoc().toString('base64')                 }

uchebnick: Hello  You can give a link to the library or to the API How do I get historical price data for a year with an interval of one hour?

Петр: Hello is there any simple useful hook to check TON balance of the wallet?

Sam: hola !  is there difference between in_msg_body.slice_bits() == 0 and in_msg_body.slice_empty?() ?

User<6809510202>: hello everyone

User<6809510202>: I need site and buybot for my project

User<6809510202>: who can help me with this (reply to 59503)

Nikita: You didn't provide any details (reply to 59504)

Kenny$$Shillz: Dm (reply to 59504)

Hollow: hello guys, is anyone adding sdk to unity?, i have problem with tonproof and payload

Dryx: Hey guys, anyone knows how can I airdrop some holders of my projects fast ? Not one by one ?

&rey: Yes. Second also checks if slice contains no references. (reply to 59499)

Slava: in_msg_body.slice_bits() == 0 could be a better option when you care about actually reading bits from the body. (reply to 59519)

User<1463408356>: How do i calculate estimated fee in raw js, lets say i got transaction with 3 jetton tokens and Toncoin (ig amount shouldn't matter)?

Slava: You should use a highload wallet for this. (reply to 59513)

Vladyslav: Is there an off-the-shelf solution for sending out 100's of nfts? Minting directly to wallets

D: Cool bro I've Dm'd you (reply to 59453)

User<6809510202>: . (reply to 59504)

Carter🧹: I'm getting this error reported on GitHub but with no fix listed, trying to connect via ADNL:  failed to init crypto  Anyone know how to handle this?

Kenny$$Shillz: Use highload wallet (reply to 59513)

Kenny$$Shillz: You can mint all to a highload wallet and batch transfer ownership to users (reply to 59526)

Caerulea蓮: if the transaction isnt in transaction history but the balance is deducted after the transaction will the coins be delivered? using @wallet

&rey: You can use "preprocessed" wallet — that will allow to send 255 transactions at once. (reply to 59513)

Vitalik: can't start node.js The certificate has disappeared from toneliba??

𖣔⃟⃤ KEP �҈҉$¥⃝⃞⃟⃠⃤꙰꙱꙲: Hello guys please some one can help me? What is tonbounty? I spend 1 ton for 500 ton bounty nft

𖣔⃟⃤ KEP �҈҉$¥⃝⃞⃟⃠⃤꙰꙱꙲: Does it legit?

&rey: Those NFTs are scam. (reply to 59557)

User<1463408356>: can i send nft with comment?

User<6809510202>: bro its scam😂 (reply to 59557)

&rey: What certificate? (reply to 59554)

&rey: (I really hope no one confuses preprocessed, precompiled wallets and library-based jetton wallets...) (reply to 59549)

Vitalik: ssl (reply to 59563)

&rey: Shouldn't library (@ton/ton, if I understand you correctly) be downloaded once, upon installation into project? (reply to 59565)

Danny: How do I replace a ref dictionary value? I want to update the value but cannot find the function for it. Retrived using udict_get_ref?

0xluong: I cannot verify the signature of a user whose name has the slash character "/"

0xluong: any solution?

ビクトリア🍊: Why doesn't the testnet work? 🧐

؏ﮩالُگۆنْت: I need help .. anyone speak Arabic

؏ﮩالُگۆنْت: /stat@combot

؏ﮩالُگۆنْت: Anyone in the support team can help me

؏ﮩالُگۆنْت: I have problem in my count .. In the picture, the option exchange to convert to currency platforms does not exist .. please any one can tell me why

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Hello.... I found a repository on github that is in func and typescipt.... To use it I programmed my code in typescipt, how do I deploy that code on the ton network... Do I do it with blueprint?....I mean... I create a new project in blueprint... I install the github repository... I copy my code into the script part and run it... Does that work?

Alexander: Hi guys, I would like to know what EXACTLY is a contract initial data. Does it include state vars or what?  To be more specific, I have a contract in TACT with constructor like this, where owner is a state var.  However, when deploying from different addresses, the contract address stays the same.  I would like to get new contract for every new deployer address.  ```    init(){         self.owner = sender();         self.feeReceiverAddress = sender();     } ```

P000RI: Hi ❤️  I redeemed 2 vouchers in notcoin bot and after 36 hours it's not added to bot balance yet   I refreshed bot and check Wallet connection too  Is there a problem?  Tx details👇 https://tonviewer.com/transaction/8777c97d645a892976ff0fae05b823555a3b39b49e4ce31c7d379b2cb06621a8

— 2024-05-13 —

Bromelia: After 3 hours I had to clear cache, logout of the account and login again, but I would say the demand is huge so it may take some time. (reply to 59603)

Bromelia: Don't worry much, it will be sent to exchanges on listing day (16th) so there is still time, probably they are rolling out slowly (reply to 59590)

Bromelia: And I'll stop replying such questions since I guess they are out of the scope of this group.

User<6996692347>: Anyone here know how to set up buy mechanism for Uniswap please reach out

Oleg: Hi team, 2 questions - whoever ended up implementing both TON deposits and withdrawals server-side, did you end up using ton-org/ton or tonweb?   Also, are there some more good examples besides https://github.com/toncenter/examples/blob/main/withdrawals.js ?   Thank you.

&rey: * @ton/ton you mean? (reply to 59615)

&rey: I believe it's better to use pytoniq, with ability to connect to liteservers directly and check proofs.

Nyxra: Guys I'm using Python transfer jetton example from TON cookbook and getting such errors many times:  LiteServerError(result["code"], result["message"]) pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 651 code. Message: cannot load block (.......) : block (0,4000000000000000,43485902) is not in db (possibly out of sync: shard_client_seqno=37852420 ls_seqno=37852481)

Nyxra: Can someone please tell me the solution for this (reply to 59626)

Nyxra: Sometimes the transaction is a success and sometimes gives this error (reply to 59626)

&rey: Have you read the error? Connect to single liteserver then. (reply to 59626)

Nyxra: Yes I read but didn't understand.  provider = LiteBalancer.from_mainnet_config(2)  You mean I should write 1 here instead of 2? I tried that before and got an error. I did some research and found that others were also getting the same error and they people were writing 2 to fix it so I did the same. (reply to 59629)

&rey: Something something ls_index. (reply to 59630)

Andrey: If you want stable liteserver (not public), try @liteserver_bot (reply to 59630)

NASA: Is anyone looking for a dev that can build on ton? I'm available now

Jane: Hi does anyone have TON brand guideline?

&rey: On TON site. (reply to 59636)

Jane: thank you, got it!

Nyxra: Please what does this mean 😭 (reply to 59631)

Nerkrkririei I Think I Need A It's A: How can I get the details of transferred items by transaction hash?

Wendy: Is there a way to sake NFT? (reply to 59637)

wikig: That should be some way to make NFT stake contract via func (reply to 59645)

wf: hi, can the /estimateFee api in Toncenter be used for estimating gas fee for the contract recv() call?  https://toncenter.com/api/v2/estimateFee

User<6159940600>: If there is any full stack TON devs looking for long term very well paid work please send me a DM thanks

wikig: Is there any official bot for EVAA protocol ?

Rikho: Hi developers  I created a token on ton network and i dont know how to list it now

Amanda: you can on dedust or stonfi

Rikho: Any steps (reply to 59656)

Amanda: read their docs

Paul: Hi there! Are there any solutions for multisig UI in TON? Like Gnosis Safe (EVM?) Found a few projects, but they seems dead

Mike: hello, were you able to find anything? We had several other transactions for which toncenter API returned forward_payload: null but the explorer does show a comment/memo (reply to 59060)

Mileta: Hi.

Mileta: Amanda   Would you help me please?

Mileta: I wanna learn TON chain. But a few problems (reply to 59658)

Friday: Does toncenter testnet v3 api broken down? We can't fetch data since 5 hours ago. https://testnet.toncenter.com/api/v3/

Нікітка: hello y'all, I want to start working with ton using python, what library can you recommend?

Masoud: 👋

Masoud: how to get *.ton data or image in .net

K.: Have you checked this: https://docs.ton.org/develop/dapps/apis/sdk#python ? (reply to 59675)

Нікітка: no, thanks (reply to 59685)

K.: Testnet has been quite congested recently, so might be related to that. At least, I wasn't able to send any transactions since yesterday :( (reply to 59669)

Nerses: Hello everyone,  I'm encountering a problem while testing a smart contract written in Tact language. I use the printTransactionFees(result.transactions) function to observe transaction details, and I notice that the transaction fails as expected with a specific exit code. However, when I run a check to verify the transaction status, it unexpectedly shows success: true. Here's the check I'm using:  expect(result.transactions).toHaveTransaction({     from: hashedTimeLockTON.address,     to: receiver,     success: false, });

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 60 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 27  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Simon: https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/main/contracts/highload-wallet-v3.func  Does anyone have a script to interact with this wallet? like sending transactions and etc. Thanks.

Think: Need dev & ton please

Jupiter: Dm (reply to 59697)

Enoch: Who knows how to work with integral values in tact.  I am trying to implement bancor formula.

Alex: Hello. Help find out what can be done. I mint NFT notcoin, the fee was removed but I did not receive NFT.

&rey: Then set specific exitCode you want to test for. (reply to 59694)

&rey: For the beginning, you should find right chat. This chat is not one) (reply to 59701)

Alex: Maybe you know the right chat? (reply to 59703)

Nerses: i will do with that approach as well,but transaction should fail anyway.Am i right ? (reply to 59702)

Lilian: Hello I come from solidity security , I have a ton smart contract which do signature verifs , nonce incrementation and valid_until verification before commit() and accept_message() but then a merkle tree computation is made in order to check if the proofs and msg match the root merkle hash of the tree and throw if it does not match, is it dangerous to commit before the merkle root hashs check ? because all the computation fees will be paid by contract if there is no match no ?

Crypto Man: What programing language dose ton use for smart contract

Alex: func, fift (reply to 59718)

Crypto Man: I don't get this (reply to 59720)

K.: Func, Fift, Tact are languages made specifically for writing smart contracts on TON. (reply to 59721)

Crypto Man: Any link to their doc? (reply to 59722)

K.: Here you go: https://docs.ton.org/develop/smart-contracts/  Func specifically: https://docs.ton.org/develop/func/overview  Fift: https://docs.ton.org/develop/fift/overview (reply to 59723)

&rey: To accept_message. Yes, it can be quite dangerous, and that's probably the reason why there is signature verification. (reply to 59709)

&rey: There is no one else who would pay the computation fee so yes, it will be paid from contract balance.

Pilot: Hello guys  How can we send a message to transfer user's Jettons?  In other networks, there is this feature that the user transfers his tokens by signing the message.  We want to do this in TON so that the user sends his token to our contract.

Juggernaut: Hi, can someone point the URL endpoint to get Creator wallet address of a contract?

&rey: And what do you want to get if contract was deployed by another contract which is not a wallet? (reply to 59734)

&rey: You need to form payload (request to transfer some jettons to your contract) and send it to user's jetton wallet. (reply to 59730)

Juggernaut: Not sure about it. Basically my intention is to go down the creator wallet tree. (reply to 59735)

&rey: Well, and how about contract being deleted (either by its own decision or by reaching -1 TON) and being redeployed again? (reply to 59741)

Juggernaut: That'll come in later, I suppose. I have no idea of reaching 1 TON. But thanks for telling me the possibilities. Creator wallets, when available is cool for now. (reply to 59742)

&rey: Use indexers like dton.io/graphql, filtering transactions by initial and end contract state (uninit to active) and contract address. That'll give you the address who deployed that contract. (reply to 59744)

&rey: Also please note that jetton wallets are deployed mostly not by owners.

Mohammadreza: Hello everyone  I have problem with parsing jetton notification message's body I'm using golang SDK (tonutils-go)

Mohammadreza: I need to get amount and sender address

kevin: any transaction id ? (reply to 59748)

Mohammadreza: https://tonviewer.com/transaction/6933005bb76acaec1cdb7c787e547d622e2aa6887560f777729be2ea96cc7e0a (reply to 59751)

P000RI: Hey I want to build a tap game on open network   But i need some one for cooperte  Is there any volunteers?

Kuilash: Hello hit me up for that (reply to 59755)

Alexander: Hey devs!  Does anybody knows why USDT wallet fails with transfer after swap TON->USDT in sandbox? Any other pool working fine, even stable.  I parsed sent message to jetton wallet, it's fine.  Anyone that had the same problem and was able to solve it?

Alexander: Tried both dedust and stonfi

Lilian: I am struggling to understand the difference between accept_message() and commit(), can someone explain me better than it is done in the doc please

&rey: accept_message() means that contract is paying for processing the message from its own balance. (reply to 59761)

&rey: commit() saves current data and action list in case execution fails later.

Lilian: and if execution fails later we have a partial execution state meaning modifications until commit() are saved but those after commit() aren't right ?

_chocolate.py: how can i get amount of ton in wallet in react

Mohammadreza: 🤦‍♂🤦‍♂ (reply to 59748)

&rey: Please pick blockchain interface first. (Availability: https://tonstat.us/; Orbs is a common choice) That will determine SDK for you. (reply to 59767)

Hàn Lập (😇,🪽): Is there a maximum request rate that liteserver can handle? For instance, can 1000 transaction requests be handled simultaneously by Liteserver running on my own full node?

Klay.D: hi, is it possible for two transactions from the same account to have the same timestamp (tx.now) or the same lt (tx.lt)?

&rey: You should really clarify what you mean under "from the same account", but they certainly can have same timestamp just by being in same block. (reply to 59774)

Klay.D: sorry, I mean two txs of one account are ordered by logical time, then they will never have the same logical time but could have the same timestamp, right? (reply to 59775)

Mohammad: Hey guys I wanted to know how to remove all spaces in a string slice in func Can you help me with this problem?  for example receive in_msg_body with "HELLO DEAR" slice and I want to replace all spaces and get a new string like "HELLODEAR".

Alex.: Hi all. Who has an example of how to accept an NFT from another network?

&rey: Bridges are inherently custom-made, and there is no NFT bridge currently. (reply to 59780)

&rey: Load 8-bit chunks of incoming slice and store those that are not equal to space character code, 0x20 (32). (reply to 59778)

Paul: Hi there! Trying to deploy multisig with this tutorial - https://docs.ton.org/develop/smart-contracts/tutorials/multisig#-set-your-environment I've broke on this step. (For MacOS arm64 there are no: fift, func and lite-client) What should I do?  Thanks

Adapt: Do you guys have any code examples of wallet's smart contract, I want to send off chain prepared cells for multiple messages that I want to send in one transaction. The method inside wallet's smart contract should send_raw_message for each cell one by one and check status and stop if any message failed?

Adapt: Also, what's the best way to test wallet's smart contract locally, with debug etc.?

&rey: You can't check result of message chain execution, in particular because it won't necessarily send a return message to your wallet. (reply to 59789)

&rey: Blueprint. (reply to 59790)

Adapt: I see. But if message changes status of wallet balance then I could for example check balance before and after message to know "how successful" was the message, am I right? (reply to 59791)

&rey: Do you know that operations are async, and next message will not start executing until wallet finishes? (reply to 59793)

punkd.base.eth: Error: [TON_CONNECT_SDK_ERROR] BadRequestError: Request to the wallet contains errors.

punkd.base.eth: Anyone can help me understand why we are getting this - especially when we invoke the payment from mobile and not a desktop react app

Defi: Do you guys have the same error on tonkeeper + blueprint suddenly for all your contracts? (When try to deploy a contract)  Message: "{\"error\":\"error code: 0 message: cannot apply external message to current state : Failed to unpack account state\"}"

Adapt: So when I send transaction to my custom method in wallet's smart contract and it runs multiple messages inside, will I be able to check balances between these "inside" messages?   I understand the async concept but I'm coming from EVM so not much practice with funC. (reply to 59795)

&rey: You can calculate balances yourself: starting balance minus amount sent within message. (Minus also forward fee, but that's relatively small.) I have the feeling that it is not what you're looking for. (reply to 59800)

Adapt: Yeah, thanks. Let's say I want to do two transactions in one transaction, for example transfer TON and swap on DEX. However, if the first tx (TON transfer) fails, I want to skip the swap. Is it possible at all with custom smart contract method? (reply to 59801)

Sajjad: const transaction = {     validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec     jetton : jettons.balances[0].jetton.address,     messages: [         {             address: "------",             amount: 100000000         }     ] }

&rey: No, you don't know if TON transfer fails. (Actually, it cannot fail except on step of sending message, in which case whole action phase will be inactive.) (reply to 59802)

Sajjad: hi How to specify a specific jetton in a transfer? (reply to 59805)

&rey: Jettons aren't objects native for TON. You have to form payload which would send jettons to destination, and send the resulting message to user's jetton wallet. (reply to 59807)

Adapt: Okay, so let's skip the transfer status. Is it possible to send second message only after the first one is completed (regardless the status for simplicity)? Let's assume the second tx will definitely fail if first one fails so I want to skip sending second one in case first one failed. Can I achieve that with smart contract? (reply to 59806)

Sajjad: how to specify jetton in payload? (reply to 59808)

&rey: You can't, unless the message chain is guaranteed to send some response message to your contract. (reply to 59809)

&rey: There is a whole section in TON Cookbook. I believe it is quite simple to adapt Python code to TS @ TON Connect one. (reply to 59810)

Adapt: Ok, question: can I create message chain from any messages? in my example: I would have TON transfer and DEX swap, or the opposite: DEX swap first, then TON transfer.   Can I always create messages chain with any cells? (reply to 59811)

Adapt: Message chain in this context will guarantee that messages won't happen in parallel but one by one, one after another.

&rey: No, you don't have such guarantee except if destination contract is same. (reply to 59815)

&rey: It's possible for DEX swap sending result tokens to a wallet to be completed faster than direct TON transfer to the same wallet.

Adapt: So if the chain of messages is sent to one smart contract, for example my custom wallet's smart contract, then this chain will be minted message by message? (reply to 59816)

Adapt: If I create custom method to receive payload with messages chain, can I simply to this:      var message_cells = payload~load_ref_array();     for (var i = 0; i < len(message_cells); i++) {         var message = message_cells[i];         send_raw_message(message, 3);     }  Will this code guarantee that messages will be run one by one, not in parallel (or random order)? (reply to 59817)

&rey: It won't. (reply to 59819)

&rey: I feel I should note that messages won't be run until the contract exits.

Adapt: Will that work but in random / async order or it won't work at all? I'm asking because I see smart contracts that kind of do this already but the source code is not public. So I think these other developers somehow achieved what I need. (reply to 59820)

&rey: In async order. (reply to 59822)

Adapt: We assume the smart contract with my custom method is deployed of course. (reply to 59821)

&rey: Any transaction "web"/"net" examples? (reply to 59822)

Adapt: Do you know any potential solution to this? Maybe is there a method similar to send_raw_message that would create a chain of messages if I build all messages I want in my chain?  I'll do more research on this. (reply to 59823)

&rey: The common solution is to choose messages in such a way that they wouldn't depend on order of execution. (reply to 59826)

Андрей: Hi, how can I enter dev ru chat? It is private now

User<6376055919>: Hi, everyone, Now I am getting this error while I run the transfer token code in ton python library. LITE_SERVER_NOTREADY: cannot load proof link for (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF : not in db(during last block synchronization)

Lilian: Hello, I don't have that much knowledge about contract initialization, do you have resources where I can learn about? I am wondering if it is possible to deploy/initialize a contract using send_raw_message(msg) with msg containing a storage code, is it possible ? Thank you

&rey: Yes. Please consult jetton wallets, they do so routinely. (reply to 59840)

Lilian: you're right, thanks

MEW: https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/multisig.func#L166

MEW: Why is it necessary to verify during execution whether the signers_hash stored in the order contract is equal to the signers.hash currently in the multi-sig contract?

MEW: https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/order.func#L194

MEW: If the signers in the multi-sig contract are modified, wouldn't that fail the verification process?

Rikho: What are tston rewards?

Rikho: I got so many collectables. Are they a scam?

Sunny: All scams don't not interact (reply to 59853)

Rikho: I noticed

Rikho: Something should be done its getting full on my colletables

Sunny: 100%, its getting outa hand. They gotta figure it out (reply to 59856)

TON Bounty Bridge: ​Ok  🏷 Developer Tool  Summary:OOk  Created by Fetamohame

Nerkrkririei I Think I Need A It's A: Is there a quick and easy way to mint NFTs on testnet?

&rey: You can turn off displaying those NFTs (currently one-by-one) in Tonkeeper. (reply to 59856)

Artem: Hello everyone!  1) Please advise a repository that implements conversion back to TON for Jetton with ICO. Unfortunately, there's only purchasing available here: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-ICO.fc. 2) Also, how can this be verified in Tonkeeper and in the testnet, or do I need to download another wallet? Thank you :)

— 2024-05-14 —

Gleb: Does anybody know where is the testnet web-interface for vesting?  Mainnet is here: https://vesting.ton.org/

Wendy: How about tact? (reply to 59648)

Rick: hi, how to transfer jettons to  more than one address in one request

User<7123272744>: you use Airdrop

Matthew: hi all, i have a issue: when i fetch nft items on tonapi or toncenter return null but getgem can fetch it? my collection address on testnet: kQDDh9FWFbLLprGLRqfrL2l9vhMSHY8fPITF2Xdv_sXHjyAP

Elon: hi are there a "multicall" like EVM in TON?

Elon: what if i want to read multiple value from multiple contract in React?

Alix: Hey!  I'm new to Ton, is there an easy way to bridge from Solana to Ton blockchain?

ecomnazar: hi, i am connecting ton-connect to my tma, after i added manifest.json to verify my app, but telegram wallet not see my manifest.json file. But if i open link to my manifest file directly in browser it opens, how can i solve this, help.

User<7133578437>: We need a full stack developer(s) with knowledge of tact/func, js, MySQL. You need to write a contract to replenish game balance with tokens. I look forward to long-term cooperation, because there is still a lot needed. PM

Behrang: I think there is also another important behavior here:  if there is an error in action phase, the state of contract will not be updated even after a commit in execution phase. But the gas used will still be deducted. (reply to 59764)

Ngoc: Hi everyone. I have a smart contract on testnet and function  receive("test") . so how can I call this function. call it like this's not working   const transaction = {         validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec         messages: [             {                 address: "EQDm3xsvk1pvbhk4CLXt9rVwLSz5FrLZVIoV_iL4Bg9cqsYK",                 amount: "6000000000",                 message:'test'             }         ]     }      const result = await tonConnectUI.sendTransaction(transaction);

Ngoc: anyone help me.

Matthew: payload to cell (reply to 59917)

Ngoc: Can you give me a example. (reply to 59918)

Matthew: let a = new TonWeb.boc.Cell();     a.bits.writeUint(5, 32);     a.bits.writeUint(0, 64);     a.bits.writeAddress(new  TonWeb.utils.Address(connector.account?.address!))     let payload = TonWeb.utils.bytesToBase64(await a.toBoc()); (reply to 59919)

Speculator: Hi, I want to fetch all jetton amount for multiple wallet address at a time. is there any indexer or graphQL so, i can get these data?

kevin: refer tonapi, there is APi to retrieve all jetton amount for a account/address (reply to 59921)

Ngoc: Thanks a lot , but can you explain  a.bits.writeUint(5, 32);     a.bits.writeUint(0, 64); it's meaning like "test" in receive("test") on smart contract ?? (reply to 59920)

Matthew: on smart contract, you mush parse and load data from cell (reply to 59923)

Speculator: I want this for multiple address at a time (reply to 59922)

Speculator: Hi, I want to fetch all jetton amount for multiple wallet address at a time. is there any indexer or graphQL so, i can get these data?

Emmanel: You might need to loop (reply to 59927)

Emmanel: Hello folks, is there a way I can make transaction show "contract interact" instead of "sent" in a wallet?

Paul: Have you deployed? I face the same problem (reply to 59449)

Emmanel: ?? (reply to 59930)

Ehsan: so how u can securely authenticate users into mini app on the fly? how it not interceptable and you make sure that user that opened miniapp is the same user as start the bot and nobody impersonate other users? (reply to 59082)

gavin: Guys, I want to know how to print the address type of a slice in FunC. I know that it is possible to use ~dump, but the readability of the display is not good

ecomnazar: can i get users ton wallet address in my tma app?

User<6376055919>: GM, I need help for token transfer in ton network with python. I will pay

Kuilash: Hit me up (reply to 59950)

Dmitriy: Hey guys!  The Jetton standard says that there are no standard methods to perform safe transfer (i.e. revert ownership transfer in case execution failure)  Are there any known workarounds for it? Ideally, I’d like to perform the transfer inside recv_internal and fail the transaction if the transfer failed Thanks in advance!

Mike: Hello, I’m still having an issue with https://toncenter.com/api/v3/jetton/transfers endpoint returning USDT transfers with forward_payload: null, despite the transfers actually having a memo (at least according to tonviewer). I’ve tested sending USDT with Telegram wallet, the forward_payload was returned correctly for that.  I’m wondering what’s causing this issue and if I should use a different endpoint/API than Toncenter for detecting USDT deposits. (reply to 59050)

Vitaliy: Hello! I just wrote a long question and it was removed immediately. Will it come back? 🤨

Panda: same error (reply to 59449)

&rey: You're using different wallet versions. (reply to 59968)

Gerald: Hi all! How can I make a transaction with my own created Token via tonconnect/sdk?

Provider: Hello everyone, I’ve been studying just the tone for a couple of days, what’s the easiest way to get the Boolean value from the token contract from the wallet contract? Both receiving an explicit value and simply receiving an error are suitable (if, for example, it is false). Or maybe there is a way to get its value without asking the token wallet from c4/getData, where I store this value

&rey: Just as with any other token: please consult TON Cookbook. (reply to 59972)

Dmitry: Hello everyone I ran into a problem in the testnet.  I send an external message to the contract, it processes it (does accept) and then bounces back with an error. After that, this transaction begins to repeat indefinitely, until the TON on the balance runs out.  Can you tell me if I'm doing something wrong or is it a bug?

&rey: You need to send message to token contract and then receive a response message. (reply to 59975)

&rey: It's you doing something wrong. (reply to 59982)

&rey: You shouldn't accept message without reply protection already done.

Dmitry: The bounce occurs on the next message when I send a message to another contract.

&rey: Could you show the scheme? Perhaps transaction hash, so that it can be found in Tonviewer.

Dmitry: 67241b37bd862afb217ca4eddfa7df65539f226a81f362b463fb6972bb94cda0 (reply to 59987)

&rey: Have you done replay protection in your "wallet" contract, actually? (reply to 59988)

Dmitry: You mean bounced Jetton Transfer message?

&rey: No. I mean, that if after processing an external it remains valid, then it will be processed again and again.

Dmitry: But I don't send new external messages, I sent the message only 1 time. Why will it be processed over and over again?

&rey: Because contract accepts it, why will it not be processed over and over?  You can imagine a malicious actor catching your external message and then sending it again. That's not what happens actually, but pretty similar in result.

Dmitry: Thanks for your answers!  So is this the correct behavior of TVM for external messages? I'm clarifying, because internal messages are not processed repeatedly. (reply to 59994)

Nerkrkririei I Think I Need A It's A: How can I get the jetton master address from jetton wallet address?

Father Pepe Of: Why cant I find NOT on binance? Can't deposit it

Nerkrkririei I Think I Need A It's A: Is this toncenter? (reply to 59999)

Nerkrkririei I Think I Need A It's A: I don't use toncenter. Is there a way to do it natively or with ton api? (reply to 60002)

Panda: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : failed to parse external message external message is not a (Message Any) according to automated checks'

Panda: What about this error?

Johan: Can someone say, which files or what is it downloading now?

Johan: Its bash script of full node installation

Atsushi: Hello. I apologize if this is the wrong chat to ask my question. I am currently developing a BCG on TON, and I am trying to implement a ranking system that is scalable and intended for tens of thousands of participants. However, there is a development philosophy in TON that large lists should not be maintained, and I don't have a good idea for constructing a large-scale ranking from distributed scores. Does anyone have experience implementing large-scale rankings, or any good ideas?

Dima: Hi! How do I withdraw TON from nft item?

&rey: That amount is small enough to be not withdrawn. For some items, sending one to yourself does the trick. (reply to 60017)

Nikita: Oh. Wait. You can do it. But script needed (reply to 60017)

Dima: That is just an example of balance (reply to 60019)

Dima: I guess there is something with forward_amount (reply to 60020)

Johan: is that normal for recently launched node?

&rey: Please write down what constraints you have: are scores bounded? can they change? do you need to provide rankings continuously? (reply to 60013)

Johan: Sorry for replying directly, but will that work even if I close my ssh connection to server and it will continue sync on the background as service? (reply to 60027)

&rey: It should, but please test that before depositing any coins for validation. (reply to 60028)

&rey: (Since validator is run in service, and different servers might process that slightly differently.)

Johan: I have followed docs from official website of Ton

Johan: Its ubuntu, I think it will be compatible, but thank you for suggestion

Dima: Forward_amount worked. Thanks (reply to 60020)

Dmitriy: Is it correct that in TON it’s impossible to emit the event in the same sense as in Ethereum, i.e. without a concrete sender? And if I’d like to send the message that shouldn’t be processed by any contract, but rather to some backend app, I still need to have the dummy recipient contract to send the “event-like” messages there?

Valera: Hi all. Can you explain please I took the contract nft-fixprice-sale-v3r3.fc from github getgems  I minted NFT into the collection, created a contract according to the config, this nft-fixprice-sale-v3r3.fc, sent a transfer of NFT to a replacement user to make the fixprice-sale smart contract a new user, then deployed the sales contract  Gotgems now displays the "Make Offer" button, but the price is not shown  What did I do wrong?  const nft = provider.open(Item.createFromAddress(address));    const index = 2;    const fix = provider.open(     Fix.createFromConfig(       {         is_complete: false,         created_at: 0,         marketplace_address: marketplaceAddress,         nft_address: address,         nft_owner_address: provider.sender().address as Address,         full_price: toNano('0.05'),         fees_cell: {           marketplace_fee_address: marketplaceFeeAddress,           marketplace_fee: toNano('0.05'),           royalty_amount: toNano('0.05'),           royalty_address: provider.sender().address as Address,         },         sold_at: 0,         query_id: index,       },       await compile('Fix'),     ),   );    await nft.sendTransfer(provider.sender(), {     queryId: index,     value: toNano('0.5'),     newOwner: fix.address,     fwdAmount: toNano('0.02'),   });    await fix.sendDeploy(provider.sender(), toNano('0.6'));

🐍Barmaki: /stat@combot

Nerkrkririei I Think I Need A It's A: ? (reply to 59997)

Ehsan: How can I load my wallet into Wallet Applications using Private Key? is there any way or I should have seed phrase?

&rey: Seed is usually required. You can search through "developer-friendly" wallets on ton.org/wallets if anything became different recently. (reply to 60056)

Ehsan: nah non of them supports private key (reply to 60057)

Sasha: hi , is there a way to send 2 3 tokens in one contract? (reply to 60057)

Sajjad: hi i want to send all transaction messages in on contract to tonkeeper how can do this?

Daniil: hi What could be the problem? I generate payload for a transaction using tonweb and specify a comment, but Tonkeeper sends with some other comment.   const tr = await jettonWallet.createTransferBody({     ...     forwardPayload: new TextEncoder().encode(comment) })

Sasha: hi, do you know some open-source DEX on TON?

Development: Hello. Please help me, I urgently need a job, every day, I’m ready to give 6 hours. I’m a professional developer who has completed my studies. I’m waiting for your assignments in private messages

Nyxra: I think I can (reply to 60077)

Johan: Sorry for disturbing, but can you check current state of my node? Is that ready for proper work now? (reply to 60030)

&rey: It's fine! (reply to 60079)

Johan: good, thank you

Johan: Can I now implement the same feature which tonapi has? (reply to 60080)

Johan: for example create my own api and whatever I want and be faster

&rey: The full API is proprietary to my knowledge. There's a limited version available on https://github.com/tonkeeper/opentonapi. (reply to 60082)

Johan: Thank you for suggestion :) (reply to 60084)

Louis: hello, i need help, i created a custom contract A, how can I get the jetton balance (specifically USDT) of A within A itself

Kryptonite: i am new to the eco-system can someone please help me to understand why does state is showing inactive against my wallet address ?

Kryptonite: and what are the steps to make it active ?

Nerkrkririei I Think I Need A It's A: How can I get the jetton master address from jetton wallet address?

Kryptonite: can someone share me if there`s any script to batch transfer jettons

&rey: You can't, due to over-securing that. You can only receive forward notifications that you've got a certain amount of jettons. (reply to 60087)

User<7140581942>: Hello everyone, I need help. How can I get event data from smart contract in web 3 like Solidity event track? I want to emit an event in func contract and to catch the event in web 3 using websocket or so like Solidity event track.

Louis: So, I declare a variable usdtBalance in A, then check the token being transferred in and increase it if it is USDT in TokenNotification, or decrease it in the logic for transferring USDT out. Is that a bad idea? (reply to 60094)

&rey: That's a good idea! This way, usdtBalance will be always lower or equal to current USDT balance, which is probably what you want for safe outgoing transfers. (reply to 60098)

Louis: thanks man :))) god bless ton😘 (reply to 60099)

User<7140581942>: Hello everyone, I need help. How can I get event data from smart contract in web 3 like Solidity event track? I want to emit an event in func contract and to catch the event in web 3 using websocket or so like Solidity event track.

Lilian: Hello, I hope you're well !  Is there any tool like slither or something similar to automate part of vulnerability testing with funC language or TON smart contracts ? thank you

Sasha: hey , we made a jetton transfer but in in this transfer we dont use a cantract , it just send tonken one by one , is there a way to  make all transfer in one contract? 'we want to make contract for send 2,3 token in one transaction' (reply to 60099)

User<7140581942>: I don't understand as well. Please give me example or could you explain in more details? (reply to 58256)

Равиль: How to set config? I want run lite-server

Mikko: I have facing this issue https://github.com/ton-connect/sdk/issues/89 when trying to dynamically recreate TonConnect UI ton-connect button on demand. It works for the first page load, but not for the subsequent page loads. Would anyone have an example where TonConnect UI button is re-created dynamically?

Gyorgy: @pcrafter Are you familiar with the V5R1 contract code?  Trying to implement in GO at the moment to move from V4R2.   case V5R1_Testnet:   walletId := WalletId{    WalletVersion:   0,  // Wallet V5R1 version is 0    NetworkGlobalId: -3, // TON Mainnet -239, Testnet -3    WorkChain:       0,  // Masterchain -1, Basechain 0    SubwalletNumber: 0,  // Subwallet number (you can adjust this as needed)   }   data = cell.BeginCell().    MustStoreUInt(0, 33). // seqno    MustStoreInt(walletId.NetworkGlobalId, 32).    MustStoreInt(walletId.WorkChain, 8).    MustStoreUInt(uint64(walletId.WalletVersion), 8).    MustStoreUInt(uint64(walletId.SubwalletNumber), 32).    MustStoreSlice(pubKey, 32).    MustStoreDict(nil). // empty dict of plugins    EndCell()   Seqno changed from 32 -> 33 We need to store network id, chain, and subwallet too.  Its mostly working, but i’m not getting the same wallet generated as tonkeeper. As I looked the source codes on Github everything looks matching to me. Any idea what I might overlooking here?  One interesting thing what I noticed if I compile W5 from github sources I got different Hex hash.  From source: b5ee9c72410214010002b6000… From @ton/ton b5ee9c7241010101002300084  None of them result in the same wallet.  Tried all 698983191 subwallet and workchain variations as well.

&rey: No, I'm not familiar with the final version that was decided on. (reply to 60115)

Gyorgy: I'm trying to figure out some inconsistencies here and get it to work. I will try further. Thank you for your fast feedback on this! I appreciate it a lot. (reply to 60116)

&rey: Do you have specific features in mind, so that you're moving from v4r2? There are other wallet versions... (reply to 60115)

Gyorgy: Not really saw much features, mostly interested in the promised lower-tx and I saw more native support for up to 255 messages, which is not really need at the moment but might handy in the future.

Gyorgy: Wallet deploy on the blockchain was successful, the above code snippet i’m trying to generate the same wallet as Tonkeeper for the codebase for easier management, but was failed attempts so far.

The General: Hello. Is it possible to create a smart contract on TON without the ability to write smart contracts? I'm creating an NFT collection with multiple series of 500 NFTs each, and I don't see manually minting all of them as feasible. Additionally, I assume that the costs of creating a smart contract and minting the entire series/collection will be significantly cheaper than individually minting 500 NFTs. What advice or information do you have on this topic? Currently, there is little information available on Google about this, making it difficult for someone unfamiliar with smart contracts to navigate.

Johan: Guys, where keystores of Node should be located?

Johan: @pcrafter, can you please tell, what is that?)  Should I wait a little bit more or what? Strange transactions (reply to 60134)

Johan: They all with Payload: TickTock

TON Bounty Bridge: ​ton connect - dex  🏷 Developer Tool  Summary:if connect to dex by same walket - then all okay, but if i connect to dex with other wallet (for exa...  Created by u1tran

User<6237448962>: Who is looking for someone who is proficient in web2 and web3 field?

Johan: can you say, how can I check if my node works or not??? how properly can I make it work as usual? status if fine, but I need to check (reply to 60118)

Dmitriy: Hey!  Is it possible to add some custom logic to Jetton Wallet contract? I mean, if I’m going to create my own token, it’s pretty obvious since I can write anything that fits TEP-74 standard, but I’m talking about existing deployed tokens  The possible option that came to my mind is to create some wrapper contract over it and communicate with it instead of original wallet, but I’m not sure if it’s possible

Percy🧙‍♂️: hello everyone, how to develop a game project based on this ecosystem, so that the game would be added to Tonkeeper itself, if the developers who owns such information?

Sasha: guys if you help me in this case , You will receive a reward of 10 ton from me (reply to 60106)

Sasha: Unfortunately there is no one to help me , i have to do it from this way , If you can , dm me

Kuilash: DM me (reply to 60106)

Percy🧙‍♂️: Hey , how to develop a game project based on this ecosystem, so that the game would be added to Tonkeeper itself, if the developers who owns such information?

TON Bounty Bridge: ​Burn  🏷 Resource  Summary:Why community decided to burn comission?  Created by u1tran

Eilon Lotem | TRES Finance: Hi,  How can I convert event id (d5716f2a6bf0c441b8fa9e24304e6ecfb1f7564ed2dcc7a3b11e2d49f36ac2db) to hash (kI5KhrGMeVJghmX3ePjYa0N6guRpu0KocAI9-okzCJg=) by using python?

Sasha: is there anyone? (reply to 60158)

Cube: Why u deleted our conversation? (reply to 60165)

Sasha: because someone helped me , ty❤️ (reply to 60168)

Atsushi: I apologize for the delayed response. We do not yet have a contract as we are still in the design phase. We haven't decided on a score cap, but we are considering a 32-bit range, and changes are possible. We are thinking of continuously providing rankings. (reply to 60027)

— 2024-05-15 —

kevin: DM (reply to 60174)

TON Bounty Bridge: ​Transfer nft  Created by paahati

cfs chef: https://testnet.tonviewer.com/0QA1pWPJoe27enPAb9c-VNb4wYSrxluUvw61Ig8f_lC-ABYv      (dev address) https://testnet.tonviewer.com/kQChNBbR85rrArf72oc_L7yN6H6lq2NLoMnqLHa4LQWyZ-cz?section=overview      （collection） https://testnet.tonviewer.com/kQBCmuX9LYiG1C1tgRsLg0pi6cHWvmrxrdmigDt51xmpjpaO?section=nft      （item  why i has deployed so many nft, but i can`t see any nft at my dev address, whether it's tonviewer or tonkeeper

Ngoc: Hey guys, I have a smart contract and  I want to get function  (like checkAddress(key: Address)) by html js. How can I get it buy json rpc or anythings can load from chain. Thanks a lot

Sunny: Can anyone tell me that if this is a Telegram in-built multiplayer feature?

princekamil: Hello, im looking for a developer to join the team in a longterm project 💎 if you are interested please contact me on priv and send the portfolio. If you know how to do the „trending bot” then its a great advantage.

Lilian: Hello, I hope you're well !  Is there any tool like slither or something similar to automate part of vulnerability testing with funC language or TON smart contracts ? thank you

Равиль: can help me

Danny: How do i read assets (Jettons and NFTs) from a user's wallet

Speculator: Hi, I want to check whether a transaction is normal ton transfer, Jetton Transfer or received transaction. How can i do it

Elon: hi why my address in openmask wallet display another address, but when check in explorer it show another address?

Elon: 0QAo4KOPtk7EGoof9lfgGJQVC5XpBom0z1A7AThrQS2Lh80B EQAo4KOPtk7EGoof9lfgGJQVC5XpBom0z1A7AThrQS2LhytO kQAo4KOPtk7EGoof9lfgGJQVC5XpBom0z1A7AThrQS2Lh5DE  is a same wallet?

Speculator: Hi, I want to check whether a transaction is normal ton transfer, Jetton Transfer or received transaction. How can i do it

Eilon Lotem | TRES Finance: Hi,  How can I convert event id (d5716f2a6bf0c441b8fa9e24304e6ecfb1f7564ed2dcc7a3b11e2d49f36ac2db) to hash (kI5KhrGMeVJghmX3ePjYa0N6guRpu0KocAI9-okzCJg=) by using python?

Alex: Hi! Please tell me where I can find an API that allows you to get a list of P2P market order (which is available in wallet in Telegram bot). Or is this a closed information?Any information will help

Sol: Looking for assignments for a newbie in development,graduated from ton dev studio school

wikig: Hello , is there any MPC wallet or MPC account service avable for telegram  ?

Kryptonite: Hi there, can someone please share, a ts code to transfer jettons ?

Sunny: bot.on('inline_query', async (ctx) => {}  I have been trying this for a while now but bot is not listening to 'inline_query' any idea? it is enabled in bot father and placeholder is also set

Cik: lol

Kuilash: Wow nice 🙂 (reply to 60231)

Kuilash: If you need a full stack developer for your telegram mini web app, bot & AI, or Blockchain TON projects, feel free to dm me and let's talk. Past works available upon your request Thanks 🙏

He: Ask a question

Alina: Maybe it will be useful to someone. The error is related to Buffer and process/browser. React application was created via create-react-app.  What needs to be added: 1. config-overrides.js (on par with package.json) const webpack = require('webpack');  module.exports = function override(config) {   // Add polyfills for Node.js core modules   config.resolve.fallback = {     ...config.resolve.fallback,   };    // Add plugins to provide Node.js core modules   config.plugins = [     ...config.plugins,     new webpack.ProvidePlugin({       Buffer: ['buffer', 'Buffer'],       process: 'process/browser.js',     }),   ];    return config; };  2. In package json: - "dependencies": { ..., "buffer": "^6.0.3", }  - "scripts": {     "start": "react-app-rewired start",     "build": "react-app-rewired build",     "test": "react-app-rewired test",     "eject": "react-app-rewired eject"   },  - "devDependencies": {     "@babel/plugin-proposal-private-property-in-object": "^7.21.11",     "@types/react-scroll": "^1.8.10",     "process": "^0.11.10",     "react-app-rewired": "^2.2.1"   }  Then: - remove node_modules - npm i - npm run build - npm run start (reply to 42010)

Ehsan: Hello any one have an example (Working one) validating Ton Proof (in Ton Connect) in typescript?

Farel: how can I store content(a link to ipfs) inside an nft contract, I don't understand how to fit it to the Cell data type

v: Is this problem due to unstable testnet?

ecomnazar: hi, i am sending ton transaction in my web app, but how can my backend track transactions status?

Speculator: Thank you 🙏 (reply to 60237)

Speculator: curl -X 'GET' \   'https://toncenter.com/api/v3/transactions?account=UQAb_dhs0by1JeBuxgcxnQlw-_Jx5b7vSCuPGKHv1CUuFSHu&account=UQAPj7r35QRfb3VpRX8nkvNsSsO1w8UJSPyD94YHzJKkIRTA&limit=1&offset=0&sort=desc' \   -H 'accept: application/json'  I am using this indexer. when i am passing single account then response is coming and when i am passing more than one account then it is giving erro {   "error": "Timeout error" }  how to fix it?

Haz: Guys I need help. Issue is simple. How to access struct member with null assert operator?         let user1: Address? = null;         let user2: UserInfo? = null;                  if (user1 != null) {             let user11: Address = user1!!; // works         }         if (user2 != null) {             // let amount: Int = user2?.amount!!; // error             // let amount: Int = (user2.amount)!!; // error             // let amount: Int = user2!!.amount; // error             // let amount: Int = user2.!!amount; // error             // let amount: Int = !!user2.amount; // error             // let amount: Int = user2!!.amount!!; // error              let user2_: UserInfo = user2!!;             let amount: Int = user2_.amount; // works         } It seems it is not implemented in TACT itself or there is another way...

Haz: I have tried almost all possible option, struggled a lot and still no success...

Speculator: curl -X 'GET' \   'https://toncenter.com/api/v3/transactions?account=UQAb_dhs0by1JeBuxgcxnQlw-_Jx5b7vSCuPGKHv1CUuFSHu&account=UQAPj7r35QRfb3VpRX8nkvNsSsO1w8UJSPyD94YHzJKkIRTA&limit=1&offset=0&sort=desc' \   -H 'accept: application/json'  I am using this indexer. when i am passing single account then response is coming and when i am passing more than one account then it is giving erro {   "error": "Timeout error" }  how to fix it?

Pika: Yes (reply to 60243)

Luke: How to transfer JETTON tokens in a Dapp?

Luke: I am using the OpenMask wallet.

ecomnazar: https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer (reply to 60277)

Luke: must use TON Connect ? (reply to 60279)

Kryptonite: can you please share nodejs snippet for the same . (reply to 60279)

Luke: I made a Dapp and only linked the OpenMask wallet. I want to directly call the OpenMask wallet to send JETTON tokens. (reply to 60281)

Alex: Hello my name is Alex , and we building are project in ton and we need test ton , but we need more much than 5 ton

User<7123272744>: I need senior Ton developer to assist. DM me

Mehrdad: Hi is it possible to extract amount and contract address of jetton from transactions toncenter v3 api?

Komron: Buy it (reply to 60285)

&rey: Have you already tested the project with @ton/sandbox? (reply to 60285)

&rey: (user2!!).amount, probably? (reply to 60256)

Haz: Yeah, it works, why those parentheses? Its not intuitive... (reply to 60296)

Haz: Thank you for your help :)

&rey: Perhaps you'd have better luck with a bit more explanation) Like this: "I need a frontend developer familiar with TON and jettons standard, who could create UI for an existing contract". (reply to 60288)

&rey: To check user2 for being non-null and only then get amount. Parentheses are commonly used to raise operation priority, (reply to 60297)

Haz: Yep, but I without parentheses I see the same reasoning - check that user2 is non-null and then get amount. It does not make sense other way.

Ekeh: Hi, I'm trying to keep team of four together for a telegram mini app project, interested developers should please DM

Lamborghini: how to get list of transactions or transfers by jetton address and user address?

&rey: You can filter through dton.io/graphql, for instance. (reply to 60307)

Lamborghini: Is tonscan api not support?

Lamborghini: Rest API will be very helpful

&rey: Tonscan doesn't have public API, has it? (reply to 60309)

Lamborghini: I have an API key, Is there any API?

Gyorgy: @pcrafter Just reporting back, thank you for the yesterday feedback! We got V5R1 wallet implemented now successfully. Was minor formatting issue with serialization. Now all good 💎

&rey: Toncenter (or compatible version from Orbs), tonapi, dton-io and more. (reply to 60312)

Web DUCKS 🐦 SUI 🐾: I need help

Web DUCKS 🐦 SUI 🐾: Regarding a bot

Web DUCKS 🐦 SUI 🐾: I just want to confirm the bot someone shared with me is legit or not

Web DUCKS 🐦 SUI 🐾: Any admin here

&rey: What kind of bot? Legit wallets are listed on https://ton.org/wallets. (reply to 60321)

Web DUCKS 🐦 SUI 🐾: Get gems bot

Web DUCKS 🐦 SUI 🐾: To sell any NFT in 5 ton

Web DUCKS 🐦 SUI 🐾: But when I opened the bot asking for transaction to confirm

Web DUCKS 🐦 SUI 🐾: N in the transaction want to send all token in the wallet

&rey: Bots giving guarantees are scam, actually. (reply to 60325)

Web DUCKS 🐦 SUI 🐾: Thank God not confirmed

Web DUCKS 🐦 SUI 🐾: Yes user Claim the bot if official

&rey: Then it is scam. (reply to 60327)

Web DUCKS 🐦 SUI 🐾: Can I share the bot with you

TECHN0x_6900: Gm everyone,   Are there any TON devs in here who have migrated an ERC-20 token from an EVM chain to the TON ecosystem?   Wondering if this is possible...

Johan: Please, can you say, is it possible to collecting data from real transactions without having Ton coins on the node balance? (reply to 60331)

Luke: what is the Wallet_DST and Wallet_SRC?

Dima: failed to send message: lite server error, code 0: cannot apply external message to current state : External message was not accepted What's the cause of this?

Nerses: GM!   While testing my smart contract I get such issue.The transaction fails as I needed with specified exit code,but this check contradicts it     expect(launchResult.transactions).toHaveTransaction({         from: launcher.address,         to: hashedTimeLockTON.address,         success: true,     });

GooG: Wallet_dst is your wallet address destination (reply to 60339)

Johan: Can anyone say, what means TickTock payload???

Lilian: https://docs.ton.org/develop/data-formats/transaction-layout#tick-tock (reply to 60346)

Kryptonite: Hi devs, can someone help me  with how to call this method “get_jetton_data” on testnet ?

Dmitry: In the TON React UI docs there is a method which allows the user to sign and send a transaction to a given address.  I need to get the transaction id so I can verify the transaction completion status on the explorer tonapi, but it’s undocumented.  What does the send transaction method return? Can I get the transaction id directly from there?

Sasha: hi , i want to transfer my tokens and tons in one contract exaclly like pic number 2 , but we just make it like number 1 , is there a way to transfer tons and tokens in one contract?

ACOM Sovereign: oopes I posted my offer to join our Team in the wrong group.

Sasha: 10 ton reward for who help me on this case (just send a source that explain how to run it) (reply to 60374)

Aiman: Heh guys, how much it costs to mint a new Jetton?

ACOM Sovereign: We are very interested in working together with likeminded people specifically people that are interested in supporting Decentralized Technologies vs Centralized this is why we have decided to join the TON Society and will be looking to build a Solid Team of Developers that build the basic mini-app that we can expand on as soon as we apply for funding and get funded.

ACOM Sovereign: if you are interested in joining our Team please DM us.

Black Angel: Cool (reply to 60381)

Black Angel: I'd like to join. Plz check your dm!

Kuilash: Interested (reply to 60382)

Sam: Hello guys. Anyone knows how filter jetton txs from global txs? For example filter USDT txs. I can't find nothing about. I checked tonapi but no luck.

Никита: Hi guys, i have a question about nft mint, i use tonweb as example and deploy collection, but there are continues mint and one transaction executed duration is 1 minut, can somebody provide a refernce to example with batch mint or smth ? How can i process mint faster ?

Gonzalo: gm Toners! I am looking to build on TON. I need a tutor since I have a basic level. Any tutor I can hire for a few hours per week?

User<1463408356>: How do i send multiple messages in one transaction with tonweb JS?

Mehrdad: Hi is it possible to extract amount and contract address of jetton from transactions toncenter v3 api?

Adam: what (reply to 60396)

User<1463408356>: Like how do i perform transfer with few tokens (jettons) and toncoins itself with tonweb library in one go (reply to 60398)

User<1463408356>: i only see examples of sending TON's and jettons seperately

Adam: You can t send mutiple messages with one transactions but why not send two transactions one after the other, first transactions with jetton trasnfer and 0.1ton for computation and wait for the seqno to go up then a second one to transfer tons (reply to 60400)

User<1463408356>: oh really, i thought i can - i'm doing it with tonconnect/sdk rn, and thought it's working like that on backend side as well

User<1463408356>: sorry im pretty new to ton, i'll try sending multiple transactions then

User<1463408356>: thanks!

Adam: By the way you can unclude as many ton in your message for jetton trasnfer (reply to 60405)

Adam: the problem is the destination to the a jtoon transfer you send a message to the jetton wallet to send ton you send the message to the main wallet

Adam: If you need more calrifications I can explain anytime bro

Aiman: Do someone used dogeployer to develop a new Jetton? Is it Legit? Johndogeton is the name of it

minhtienhcmus: I create new contract address (https://testnet.tonscan.org/address/EQA3a8soJ26PEdQ1xbf7wRNjlq7TCHqVbxHA8LHCO0k1R_fo) from contract https://testnet.tonscan.org/address/EQCukbM1BdBq6bDlxsQhrTV-CXP5XlLGk1tDfbWgOyJVvRm6 i see in new contract have transaction create but state is inactive  Can you explain to me the reason why not ? thanks

Oleg: I’m using tonweb lib and observing following behaviours:  1) `seqno.call()` returns null about 95% of the time   2) sometimes I get the following error:  Cannot run message on account: inbound external message rejected by transaction FE03……B3F34C96B16….615575669DB7E4388A06E94349530: exitcode=33, steps=23, gas_used=0 VM Log (truncated): ...te NOW execute LEQ execute THROWIF 36…   For #1 - Can it be because I’m hitting the allowed limits for Toncenter API and need to upgrade the plan?   For #2 - I searched this chat and the prominent advice is to double check the time on the machine where this code runs. I did triple-check it and it seems to be correct the time. What else can cause this issue?

— 2024-05-16 —

Mark: This is a Scammer. Please be careful!!!!!! (reply to 60420)

User<694804783>: ПрHello, I need a developer for consultation and debugging, please read ton web and ton mnemonics, it’s very important. I only pay if there is value, thank you.

Oleg: This is a fantastic article that goes deep into explaining #1   https://gealber.com/ton-virtual-machine-exit-code-33 (reply to 60419)

Luke: https://tonviewer.com/transaction/445dec2e9bc959f4aef7f44451753c212d2353517f5a444137f6da146ba664d6   Please help me find out why the transaction failed

lin: May I know how to initiate a transaction like this

lin: This has no signature

&rey: How do you determine that? (reply to 60434)

lin: Maybe I misunderstood (reply to 60436)

lin: I would like to ask how to implement the External In message initiated by a regular contract instead of a wallet contract

lin: @pcrafter

lin: For example, if you look at this, the address where the transaction was initiated is a contract address

lin: Can you answer my question? thanks @pcrafter

小程序/tg机器人/网站开发/搭建一条龙: Hello, may I ask why I can't get the seqno? The mnemonic is correct.

Matthew: hi all, is there a bridge to convert jetton from ton to evm?

&rey: Tonweb? If seqno is null, you should pass 0 instead. (reply to 60446)

小程序/tg机器人/网站开发/搭建一条龙: OK, thanks (reply to 60449)

Sasha: hi , i want to transfer my tokens and tons in one contract exaclly like pic number 2 , but we just make it like number 1 , is there a way to transfer tons and tokens in one contract? (reply to 60372)

小程序/tg机器人/网站开发/搭建一条龙: But there is a new problem. The first time I called the transfer, it was successful, but then an error was reported.

&rey: Not in Tonweb, rather in "@ton/ton". (reply to 60451)

&rey: Please scroll terminal so that opcode raising error is visible. (reply to 60452)

&rey: Time is configured incorrectly on your computer. (reply to 60456)

小程序/tg机器人/网站开发/搭建一条龙: time?Do I need to change the time zone to that of the ton server? (reply to 60457)

小程序/tg机器人/网站开发/搭建一条龙: It seems that the server time is wrong. Let me try changing it.🙈

小程序/tg机器人/网站开发/搭建一条龙: Thank you👍, the Linux machine will be normal after synchronizing the time. (reply to 60457)

Никита: Hi guys, i have a question about nft mint, i use tonweb as example and deploy collection, but there are continues mint and one transaction executed duration is 1 minut, can somebody provide a refernce to example with batch mint or smth ? How can i process mint faster ?

User<7123272744>: I need senior Ton developer now. DM me

Kuilash: Am restricted pls hit me up (reply to 60463)

Milad: Hello everyone. Does highload wallet contract support token transfers as the other wallet types?

Sasha: could you send me a source or simple code ? (reply to 60453)

&rey: There is some code in repo examples. (reply to 60468)

Johan: Guys, where can I find all existing OpCodes of Dedust and StonFi methods??

Johan: like transfers, external transfers opcode, internal transfers opcode and others

Stuart: Looking for a developer to convert about 200 lines of solidity code into Func. Message me if interested

Johan: Can you suggest anything about opcodes of all popular DEXs ?) (reply to 60469)

&rey: You can find example swaps and copy opcodes from explorers) (reply to 60473)

kenshi?: how many nanoton in 1 ton?

Asher: thinking before asking - is a best practice, bro (reply to 60477)

kenshi?: I couldn’t find the information on the Internet, so what’s the problem? (reply to 60478)

TON Bounty Bridge: ​Documentation for main TON repo  🏷 Approved 🏷 Education  Summary:TheTON repositoryserves as the primary source for understanding, debugging, and exploring the inner ...  Rewards: • Standard TON Footstep NFT • 500 USD in TON  Assignees: stenolog Created by liketurbo

TON Bounty Bridge: ​Creation of an Explanation Guide (blog article) for Compressed NFTs on TON  🏷 Approved 🏷 Education  Summary:Develop a simple and easily understandable guide to educate non-tech savvy individuals on the functi...  Rewards: • SBT Bounty Reward • 400 USD in TON  Assignees: seriybeliy11 Created by SwiftAdviser

TON Bounty Bridge: ​UI Components Library for Telegram Mini Apps  🏷 Approved 🏷 TMA Resource  Assignees: mainsmirnov Created by kuhel

Kryptonite: i am also facing same error, but i am using mac (reply to 60456)

Sasha: in this case i have to call the custom contract function? (reply to 60469)

Naved: i am using toncenter for checking transaction status but sometimes i am getting empty response for successfull transaction, did any one faced the issue?

Никита: Hi, how can i do barch mint in ton? I use tonweb collection as reference

Luke: Why transfer Jetton will report an error, who can help me?

gavin: Can you share the transaction link? (reply to 60491)

Luke: code (reply to 60492)

Luke: Transfer as per documentation jetton method https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer

&rey: "nano" is standard prefix, meaning one billionth part of whole. (reply to 60477)

AA: Looking for a bot that extracts data from blockchain  transaction address comment transfer amount

Hiaya: Please, share more details Input: transaction id Output: amount (reply to 60500)

&rey: There will be function sendTransfer. You can pass an array of messages, up to 4 items, to it. It is standard flow for all modern wallets, not a custom thing. (reply to 60488)

Hiaya: Correct? (reply to 60500)

&rey: TON Cookbook can help you. Please note that mint is non-standard operation so you should test that on little TON amount first. (reply to 60490)

Sam: Anybody please? (reply to 60387)

AA: I want to publicize everyone who donates on my channel,  the bot must post the wallet address, comment and donation amount. (reply to 60501)

&rey: dton.io/graphql, filter by "parsed jetton master address". (reply to 60387)

Sam: I will check it! Thanks (reply to 60508)

小程序/tg机器人/网站开发/搭建一条龙: Try changing the time? (reply to 60486)

Kryptonite: in facing it intermittently. and my device settings is selecting time as per timezone and it may be using internet for that purpose (reply to 60513)

TON Bounty Bridge: ​Exercism FunC Track Examples /Part 2  🏷 Approved 🏷 Education  Summary:This issue is focused on crafting 10 examples of utilizing the FunC language for a track publication...  Assignees: coalus, alirezatabatabaeian, seriybeliy11 Created by delovoyhomie

TON Bounty Bridge: ​Exercism FunC Track Examples /Part 1  🏷 Approved 🏷 Education  Summary:This issue is focused on crafting 10 examples of utilizing the FunC language for a track publication...  Assignees: alirezatabatabaeian Created by delovoyhomie

Никита: thank you, but they does not provide the way to mint batch) (reply to 60505)

TON Bounty Bridge: ​Enhance Tact Fireworks Demo Contract Test Suite  🏷 Approved 🏷 Education  Summary:Expansion of the test suite and the smart contract for Fireworks with unique edge cases.  Assignees: alirezatabatabaeian Created by reveloper

Ton: Anybody knows when and how transform wNot to not.

&rey: Is that true? https://docs.ton.org/develop/dapps/cookbook#how-to-use-nft-batch-deploy (reply to 60519)

Никита: Thanks a lot, thats realy good. I found UI for batch deploy https://truecarry.github.io/ton-collection-edit/ (reply to 60529)

Никита: there are  a lot of tools for collection managment

Tim: If only someone would make it user friendly (reply to 60530)

TON Bounty Bridge: ​Article: risks of using cNFT  🏷 Approved 🏷 Education  Summary:This article explores the unique risks associated with using compressed NFTs (cNFTs) compared to sta...  Rewards: • 500 USD in TON  Assignees: seriybeliy11 Created by seriybeliy11

TON Bounty Bridge: ​Telegram bot for controlling access to private chats via Jetton and/or NFT  🏷 Approved 🏷 Developer Tool  Summary:Given the activity in TON and the increasing popularity of Jetton tokens, as well as the necessity f...  Rewards: • SBT Bounty Reward • 2000 USD in TON  Assignees: nessshon Created by nessshon

MOON 🌚 DG: Hey yall,  I'm looking to integrate TON onto a new swap were almost done building. Where shall I  start?

MOON 🌚 DG: I have an idea for zero fees

User<6230231504>: @lucky_labs напишите в ЛС

Vatshayan: Hello we need to integrate USDT on TON Network  what we need to do it ? like what is requirements ?

Cube: Who explain how to send the nft so that it is the sending of the nft to the recipient's address, and not the Ton transfer to the nft contract

Tim: How to get the pending transactions under a contract  on WORKCHAIN?

Sam: Maybe i don't know exactly how use it, but my goal is get all transaction by block_id where can I filter spefici jetton transactions with amount of transfer. (reply to 60508)

Vatshayan: is it same as USDT on different blockchain network ? or do it need something else ? (reply to 60539)

Mehrdad: Hi is it possible to extract amount and contract address of jetton from transactions toncenter v3 api?

tuyennt550: Hello all, I'm using streaming API to listen new transaction on testnet. But it seems not send any message event from this afternoon. Anyone know what's happens?

Vatshayan: How to deploy our own USDT token on TON network ? (reply to 60543)

Nerses: GM !

Nerses: how can I check that transaction is ended up with certain exit code(in tests using blueprint)  ?

MOON 🌚 DG: I need to hire a TON dev to integrate into our new swap being released on shibarium

Caerulea蓮: helu, can someone can suggest reliable vps which accepts crypto?

Abozy: Can I somehow write the address into a constant at the time the contract is compiled?

Sasha: for more than 4 items what we can do? (reply to 60502)

&rey: Send multiple times (waiting for previous transaction to complete), or use specialized wallets (inplug-v2, preprocessed-v2, highload, supposedly v5r1 by Tonkeeper). (reply to 60568)

&rey: "0:etcetcc0ffee"a (reply to 60567)

Abozy: Thx (reply to 60570)

Abozy: How to cast this to a Cell that can be parsed via TypeScript?

User<7123272744>: Is it possible to get private key or mnemonic from standard token wallet when we deploy it?

Abozy: It deployed by your main wallet address (reply to 60573)

&rey: This is cell. Or you want to output something that you could copy into other script? (reply to 60572)

Abozy: I want to parse it in TS script (reply to 60576)

Vatshayan: hy how to deploy USDT on ton network ? any doc, link

&rey: Well, take the thing you console-logged and do beginParse(). (reply to 60577)

Abozy: My mistake, I didn't understand it right away 😁 (reply to 60580)

&rey: Wdym "deploy USDT"? You aren't its central authority to do that. And, actually, it is deployed already; see tether.to, page about supported protocols. (reply to 60579)

&rey: TON contracts don't have keypairs on network level; some contracts, like wallets, choose to have one, others don't. In particular, standard jetton wallet does not have any keys. (reply to 60573)

Vatshayan: No means we want to use USDT on TON network on our exchange.  so is there is any way we can deploy it?  we have to use jetton to make USDT token to deploy on TON network?

&rey: The thing you would deploy is, by definition, not USDT. You have to buy some; maybe for jUSDT bridged from another chain, (reply to 60584)

Nerses: who can help to call method(internal call) of this contract https://verifier.ton.org/EQAO_9c-5dJSwTVoe4Sv_B7FJv5lzT6and7GDr8iRsPWrEGX?testnet

&rey: Do you have its wrapper scripts locally? (reply to 60587)

Nerses: yes (reply to 60588)

&rey: Then I guess you can run them with blueprint.

&rey: (You've already tested the contract locally, haven't you?)

Nerses: yeah I have tested,so for calling deployed contract I should only change the test ? (reply to 60591)

&rey: Yes, just change the provider to network one. (reply to 60592)

Nerses: great i will try now.Thnx

User<7123272744>: If I deploy v4r2 contract, can I get private key or mnemonic? (reply to 60583)

Sesiah: I need to build a contract with swaps adding liquidity to a pair, is it possible

&rey: Only if you have mnemonic; other network users cannot do so, just as you can't if you lose the secret words. (reply to 60595)

Nerses: I guess I should change ContractProvider (reply to 60593)

&rey: Notice regarding Notcoin: this chat is for discussing development on TON. This chat has no control over custodial platforms and therefore cannot help you if issue arises with them. Be careful if someone messages you directly, and look out for possible scam. Offtopic messages will be deleted.

TON Bounty Bridge: ​Telegram bot for DeFi Project Reports  Summary:Creation of a Telegram bot to generate personalized De-Fi project status reports in HTML and provide...  Rewards: • SBT Bounty Reward • 2000 USD in TON  Created by seriybeliy11

Tobias: I need help with swapping Jetton to ton using dedust sdk, I followed docs but all it does is send ton

Oleg: I want to follow up on these issues since (I think) I was able to solve it.   Basically I implemented 2 functionalities in TON: deposits and withdrawals.   Deposits ate up all the API quota and that is why the seqno was coming back as null (as deposits are call-heavy).   I would then default seqno to 0 and attempt to make TX. When seqno is in fact invalid, I would get the error #2. So, #2 is the result of #1.   For now, I will be refactoring the logic for deposits to make it less API-call heavy (or spread out the requests to be within the quota). (reply to 60419)

&rey: You can use Orbs endpoint which does not have requests limit. (reply to 60605)

Tobias: Can anybody help?? (reply to 60603)

&rey: What code are you trying to run? (reply to 60603)

Tobias: const swapJettontoTon = async(from,  amount)=>{       console.log('AMount', amount),     console.log('fromAddress', from)     console.log('selctedtoken', selectedToken)     const client = new TonClient4({     endpoint: "https://mainnet-v4.tonhubapi.com",   });    const factory = client.open(       Factory.createFromAddress(MAINNET_FACTORY_ADDR)     )    const from_Address = Address.parse(from)        const jettonVault = client.open(await factory.getJettonVault(from_Address));   const jettonRoot = client.open(JettonRoot.createFromAddress(from_Address));   const jettonWallet = client.open(await jettonRoot.getWallet(sender.address));     const pool = client.open(       Pool.createFromAddress(         await factory.getPoolAddress({           poolType: PoolType.VOLATILE,           assets: [Asset.native(), Asset.jetton(jettonRoot.address)]         })       )     )      const amountIn =toNano(amount);    await jettonWallet.sendTransfer(sender, toNano("0.01"),{     amount: amountIn,     destination: jettonVault.address,     responseAddress: sender.address,     forwardAmount: toNano("0.25"),     forwardPayload: VaultJetton.createSwapPayload({       poolAddress: pool.address     }),   })   }

Dilshodbek: Hello  I opened TONkeeper  and i sent my NOTcoins to TONkeeper address.  is my NOT lost?

&rey: 0. You can check out page for your wallet address in an explorer (tonscan.org). Tonkeeper is quite universal, so it's close to impossible to lose jettons there. 1. https://t.me/tondev_eng/60600 (reply to 60611)

&rey: You're sending insufficient TON: you send 0.01 TON, while asking to forward 0.25 out of that. (reply to 60609)

Tobias: But even when I used 0.3, it still didn’t swap the Jetton just did Ton transfer and refunded the rest (reply to 60613)

Ali: How do you know how many shards the blockchain is divided into?

&rey: from_Address is address of jetton you are swapping, right? (reply to 60609)

Tobias: Yes (reply to 60617)

&rey: Six right now, for example. https://tonscan.org/block/latest (reply to 60616)

Oleg: Thank you, I will check it out too. I’m currently on Toncenter API.  On a seperate note - is there any advantage to self-hosting a node? Or it’s a waste of time if I’m building user facing apps & just better to use a ready to use API? (reply to 60606)

Nedko: Where can I find more about wallet plugins?

&rey: Using self-hosted node in dApp risks users because your node might go offline at unpredictable moment or return incorrect data. (reply to 60620)

&rey: Depends on wallet version you choose! For instance, my wallet has plugin system incompatible with other implementations, but more useful. There is an example, https://github.com/ProgramCrafter/wallet-contract/blob/main/func/plugin-seed-in.fc. (reply to 60621)

Tobias: @pcrafter still waiting for your response

&rey: If you try to send 0.90 TON, what's emulation result? (reply to 60626)

Tobias: I used 0.3 TON (reply to 60627)

Tobias: It just transfers ton and then refunds me

Nerses: is there any documentation or example ? Couldnt do that (reply to 60593)

&rey: Please try   await jettonWallet.sendTransfer(sender, toNano("0.90"),{     amount: amountIn,     destination: jettonVault.address,     responseAddress: sender.address,     forwardAmount: toNano("0.25"),     forwardPayload: VaultJetton.createSwapPayload({       poolAddress: pool.address     }),   }) (at least in emulation) (reply to 60629)

Tobias: Okay I’ll do this (reply to 60631)

Aleksei: hello,  could you tell me please if there is an API for  status tracking of bridging transactions from Ethereum/Bsc to TON?

Tobias: Same thing Just sends and receives the Ton back (reply to 60631)

&rey: Do you have a transaction hash or link, by any chance? (reply to 60638)

Tobias: Hold

Tobias: https://tonviewer.com/transaction/2d47b0bc09111bd5b00e50a457e3002d573d7acae4287715f07af4ff40ce1173

&rey: User doesn't have those jettons. (reply to 60641)

Tobias: User does check user address balance (reply to 60642)

&rey: I guess await jettonWallet.getBalance() would return 0. (reply to 60643)

Tobias: Let me check (reply to 60645)

Tobias: Error with -256 exit code

&rey: Please check that from is jetton master address, not jetton wallet.

Kryptonite: Hi there, i am trying to create LP pair on dedust , can someone please let me know what are the steps

Kryptonite: i tried by following sdk

Kryptonite: my ton has been deposited in native vault

Ihor: how to use this shard in toncenter api? 0,e000000000000000,42762681 I mean, it should be an int, how can I convert it?

Kryptonite: on jetton vault it shows +<jettons_sent>

&rey: Take second part out and parse it as hexadecimal number. (reply to 60655)

Ihor: works now, thanks! (reply to 60657)

Tobias: It is contact address from dedust (reply to 60648)

Cube: Good evening everyone, have events like Open League Summer Bootcamp already taken place? If so, was there anything useful or interesting there? I want to know more about it

Tobias: @pcrafter (reply to 60661)

Kenny | Staked: how do I change mytonctrl to use testnet?

Enoch: Pls how do debug my tact contract . Trying to run a unit test for a swap contract . Dumps are showing all logic is completed but the transaction success is still false .  Any help

Tobias: From is contract address of the particular token (reply to 60648)

Tobias: Because I saw someone with similar error on tonoverflow   But no response was provided

&rey: Could you send specific address or test on another jetton and another amount? Code seems correct. (reply to 60670)

Tobias: I’ll send address

Tobias: fromAddress EQACGPrFHWCy9QmeFXPqvZflyoeBb5grVQxAaucF0hNd1sEs

&rey: Jetton wallet is somehow calculated incorrectly. It should be EQDSm8AnxZawvIUJGBwbjf6LLpOOMiCaM9vJwJ3ubELwU2Ct. (reply to 60609)

&rey: Please check if JettonRoot calls get-method or tries to calculate jetton wallet offchain.

Tobias: sender.address  is returning undefined

Tobias: import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";  import { Sender, SenderArguments } from "@ton/core";  export function useTonConnect(): {   sender: Sender;   connected: boolean;   userAddress: string; } {   const [tonConnectUI] = useTonConnectUI();   const TONAddress = useTonAddress(true);   return {     sender: {       send: async (args: SenderArguments) => {         await tonConnectUI.sendTransaction({           messages: [             {               address: args.to.toString(),               amount: args.value.toString(),               payload: args.body?.toBoc().toString("base64"),             },           ],           validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve         });       },     },      connected: tonConnectUI.connected,     userAddress: TONAddress,   }; }   Here's my useTonConnect hook

&rey: You probably should add field address into sender structure. (reply to 60681)

Tobias: That fixed it

Tobias: Thank you so much

User<7123272744>: How to send Jetton token using private key or mnemonic?

&rey: Example in Python: https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment. (reply to 60686)

TIP: Hello! Does anybody work with TON? How do you read transaction data and decode them to something readable? I need decode _payload, its looks like hash

princekamil: Im looking for someone who can help me with NFT metadata. I pay in gold 💎 contact me priv

Nerkrkririei I Think I Need A It's A: Are the public literservers' transactions outdated? I'm testing something on testnet and the latest transaction I can get was from 4 hours ago

TIP: please any info:3 (reply to 60694)

Keash: Hi guys are there any events coming soon in the UK ?

Enoch: Try boc parser… Not sure but try it (reply to 60694)

Mikhail: Hi guys. Does anyone know the way to get total tx count in block without repeating requests with limit/offset ?

Kuilash: Hello everyone,  I'm reaching out to see if anyone in the group is looking for a skilled contract developer with expertise in:  - FunC (TON Smart Contracts) - Telegram Mini Apps  I have extensive experience in developing robust and efficient solutions using FunC and building engaging Telegram Mini Apps. If you have a project in mind or need assistance with an existing one, I'd be happy to help.  Please let me know if you're interested, and we can discuss further details in DM Thanks

xDilettante: Hi guys, is it possible to run a LiteServer node on Windows in WSL2 ?  I kind of started it, but I can't connect from the test application to this node from the same computer.

Johan: Which side is purchaser in transactions always? source or destination??

TON Bounty Bridge: ​Creation of paid SSH Connection using TON  Summary:Develop a module to facilitate secure and paid SSH connection via TON blockchain  Rewards: • SBT Bounty Reward • 5000 USD in TON  Created by seriybeliy11

User<5435924052>: I'm highly accomplished web3 developer having extensive experiences of building web3 projects on EVM , Bitcoin L2 , Solana , Cosmos , Radix , Ton etc.

User<6676350680>: who needs a developer?

Amin Mousavi▪️🐾: Do you work as a partnership? (reply to 60730)

— 2024-05-17 —

Alexis: I do (reply to 60730)

Sasha: guys, is Tact language safe? Do I need to prefer funC?

J.: Hello does anyone know if you can add social and website metadata to a jetton contract? so that way it will be showing up in dex and explor like dexscreener etc?

Adam: you can add it on the websites (reply to 60738)

kevin: set proper metadata when you deploy a jetton minter contract would work. (reply to 60738)

JET'K: Hello, would you like to ask which open interface is used for LP Burned, Locked, Owner Renounced in contract query?

Tarikh: Hi everyone, i know the TON smart contract is async, but is possible to check the jetton balance in a smart contract? i'd like to make user pay jetton when calling the smart contract function

&rey: It is not possible. You need to make user pay jetton first, your contract working upon transfer notification message. (reply to 60747)

Angel: Does anyone know how to fix this?

Mahima Thacker: Hello everyone, I am not getting an option to switch to the testnet over a tonkeeper android app, could you please help me with this?  Thank you!

Angel: when I get this too many requests error? This is because of testnet?

Angel: @pcrafter please let me know hwo to fix this? (reply to 60767)

musashi: the api has rate limit (reply to 60767)

Angel: I will recreate it

musashi: why? (reply to 60772)

Angel: I think it has reached the limit

musashi: no rate limit means a fixed number of requests per second

musashi: you don't need to recreate another one

musashi: just reduce your request per second

Adam: hi, i heard we need paying to build on ton

Angel: oh, I see. Are you a freelancer? (reply to 60775)

musashi: yes, but i'm really busy now haha

&rey: Please try to obtain a  compatible endpoint from tonhub. (reply to 60767)

&rey: No. It's The Open Network: no one can even stop you from deploying contract you create. (reply to 60779)

&rey: Check multiwallet functionality, there should be option to create testnet wallet. (reply to 60765)

Mahima Thacker: Could not find any multiwallet functionality over Tonkeeper Android App (reply to 60786)

&rey: "Wallet 1" on main screen, or something like that. (reply to 60788)

Mahima Thacker: Okay, I needed to add testnet account. Done (reply to 60791)

Mahima Thacker: Hello everyone, I selected testnet (tonKeeper) after running "npx blueprint run" command and scanned QR with a different account so how can I disconnect that account and scan QR code again from the testnet account?

Mahima Thacker: And now I am getting connected address not QR when I run again npx blueprint run.  PS:- New to Ton. Could anyone please help me?

JK: Hi experts   For the jetton master contract, how can we set unlimited for the total supply?

Emmanel: Coins are uint257,  Set it's to be Max of uint257 (reply to 60803)

Emmanel: Which is 2 raise to power of 257

fabriregu: Hello guys. I'm building a minting page. The minting process start from NFT #0 to #N. How can i prevent that two users mint the NFT in the same moment? I suppose that the first transaction confirmed get the NFT and the second will fail.

Emmanel: That has to be in a smart contract (reply to 60807)

JK: Thanks. (reply to 60806)

Emmanel: Just specify that in a smart contract and after minting set a variable with Boolean which can either be true or false if it's minted already

Emmanel: You're welcome but don't convert to nano if you do that else, you'll have numbers outside range (reply to 60809)

fabriregu: Thank you (reply to 60810)

JK: ''' As you remember, the wallet smart contract is deployed by the minter smart contract once we mint the Jettons. Or the wallet smart contract is deployed by another wallet smart contract when we do transfer.  '''  I found this information in the documentation and would like to clarify something.  Let's say I have a new user, User A, who mints a coin. In this case, my master minter contract will deploy a wallet smart contract - ADDRESS A for User A.   In the future, if I want to send, top up, or deposit more coins to this user, should I use his wallet smart contract - ADDRESS A (the one from my master minter contract), or should I use his own wallet address account (from any TON wallet)?

&rey: It's auto-updated so you don't need to set anything. (reply to 60803)

JK: i see, i also can leave it blank for my init_state ? (reply to 60815)

&rey: You set normal wallet address (second) in destination field of jetton transfer. (reply to 60814)

Emmanel: Yeah, It will calculate the jetton_wallet it self (reply to 60817)

JK: i see, do i need to organize or handle anything from my smart contract ? like i need to store all slice for his wallet address then add some note for this transaction under 1 cell any good practive for this

JK: thanks (reply to 60817)

&rey: Actually, no. "Coins" storage type can fit integers up to 120 bits + TVM doesn't have uint257, it has int257 as its only integer type. (reply to 60804)

JK: thanks, any docs can have this information, i am quite interested to study about it (reply to 60818)

&rey: You need to set it to zero, because at deploy point zero tokens have been minted. (reply to 60816)

JK: thanks I think i have idea now =) (reply to 60824)

JK: How about this ?😁 (reply to 60820)

Vatshayan: How can i confirm a transaction sent by other users wallet by hash using js sdk ?

Alexis: Hello Ton Dev World. We are a team of entrepreneurs building a novel LaunchPad on Ton and we are expanding our tech team. So we are looking at bringing one or two proficient FunC or Tact dev. Please DM me with experience and resume. Happy to consider all profiles ! Thank you

Ihor: Hello! Do you know by any chance why in order to get correct shard number I need firstly to get shard from lookupBlock method (using 800... or 0 shard as we don't know it at the beginning) and then add "-" to the shard number from result? What is the logic behind adding minus to the shard?

TIP: {TonException}TonException("\n[MODULE]   AbiErrorCode\n[CODE]     304 (INVALID_MESSAGE)\n[MESSAGE]  Message can't be decoded: The message bo... the specified ABI. Tip: Please check that you specified message's body, not full BOC.\n[DATA]     {'core_version': '1.44.3'}")  Got this error after call client.abi.decode_message_body(params=decode_body_params)  tried with boc and body (looks similar) but no success((  def query_transaction_data(contract_address):     try:         params = ParamsOfQueryCollection(             collection='transactions',             filter={'account_addr': {'eq': contract_address}},             result='id, in_msg'         )          result = client.net.query_collection(params=params)          for transaction in result.result:             print("Transaction ID:", transaction['id'])             in_msg_id = transaction['in_msg']             print("In Msg ID:", in_msg_id)              msg_params = ParamsOfQueryCollection(                 collection='messages',                 filter={'id': {'eq': in_msg_id}},                 result='src, value, body'             )              msg_result = client.net.query_collection(params=msg_params)             if msg_result.result:                 msg_data = msg_result.result[0]                 print("Source address:", msg_data['src'])                 print("Value:", msg_data['value'])                  # Use body directly                 message_body = msg_data['body']                 print("Message Body:", message_body)                  # Decode the message body using the ABI                 decode_body_params = ParamsOfDecodeMessageBody(                     abi=Abi.Json(value=json.dumps(contract_abi)),                     body=message_body,                     is_internal=False,                     allow_partial=False                 )                 try:                     # Decode the message body                     decoded_body = client.abi.decode_message_body(params=decode_body_params)                     print("Decoded Body:", decoded_body)  help pls

TIP: but if I decode full msg, not msg body I got this: and IDK how to get transaction price (reply to 60694)

User<6588963668>: need a good developer able to work with smart contracts.

Mikael: hello guys! I have a question, after i deployed jetton, how can i list it on dex?

Mikael: like we deploying tokens on Ethereum and list them on, for example, Pancakeswap

Vladimir: 13 IRL Bootcamps. 13 Cities. $2,000,000 Hackathon 🌍  Ton Society is hosting 13 offline Open League Summer Bootcamps all around the globe 🔥  Come to meet, learn, and build your Open League Hackathon project 🫡  📍The Open League Summer Bootcamps will be hosted in 13 locations!   May 24-26th: Prague, Moscow, Hong Kong May 31th-June 2nd: Berlin, Belgrade, St Petersburg, Taipei June 4-6th: Seoul June 5-7th: Tbilisi June 7-9th: Warsaw, Kyiv, Gurugram, Minsk  💸 Win up to $500,000 from the $2,000,000 Hackathon prize pool + $5,000 prize pool for each bootcamp.   👉 Choose your city and register: https://society.ton.org/activities/open-league (forwarded from TON Society)

Valera: Why when i put on sale nft i got this error?

kevin: DM pls (reply to 60849)

Disha | SMBmarket: Hey @everyone need your help!   Could anyone please guide me How can I switch network in Tonkeeper Android mobile app from mainnet to testnet and vice versa?

Tim: You can’t switch it. Enable dev mode in settings. Then you can create new wallets for Testnet use (reply to 60851)

Disha | SMBmarket: Alright let me do that, thanks so much for the quick response🙏

&rey: Visit a platform you choose (ston.fi or dedust.io) for instructions. This process involves depositing some jettons and substantial amount of TON. (reply to 60843)

&rey: Some interfaces use signed 64-bit integers for shard representation. Actually, prefixing with minus is wrong, you need to subtract 2**64. (reply to 60834)

&rey: Is NFT compliant to standard or scam? (reply to 60848)

Ihor: yes, but not for all addresses toncenter return a correct shard number. Could you please confirm that in order to check if there should be a minus at the beginning we need to check address' most significant bit (binary prefix) and in case it starts with 1 there should be a minus, no otherwise? (reply to 60859)

Valera: contract implements standard (reply to 60860)

&rey: If most significant bit is 1, you need to subtract 2**64, leaving a negative ID, so true. (reply to 60861)

Ihor: thank you! (reply to 60863)

Yhwach: how can I withdraw this jetton with ton-crypto? does anyone know that?

Madhur: Hey guys, i want to bridge PSTAKE (EVM - ERC-20 token) to Open network

Madhur: But the bridge seems to be failing

Disha | SMBmarket: This is solved, thanks again!   I'm trying to deploy a basic smart contract in testnet but all the time I'm getting confirmed transactions on mainnet in Tonkeeper Android app, could you please guide me how can I do it with testnet? (reply to 60853)

Disha | SMBmarket: Wanna do it with wallet 2 as it's visible blurry :)

tuyennt550: just delete temp folder (reply to 60797)

Disha | SMBmarket: This works for me as well, thanks buddy!

Anastasiia: I am trying to call claim rewards from Dedust Pool from the smart contract. Does anyone know the structure of the message (what data should I serialize and send) to do it?

Abozy: Where can I see the address of the deployed NFT in the sandbox?

&rey: Try console.log(mintResult); you are probably interested in transaction which initialized a new account. (reply to 60882)

Abozy: There are many fields here... Can you point this out please? https://pastebin.com/87w5BgD7 (reply to 60883)

Vatshayan: Hy what is API of ton testnet ?

Abozy: Tonapi has testnet version (reply to 60887)

&rey: No NFT was minted, since message contained insufficient bits. The remaining TON bounced to sender. (reply to 60886)

Abozy: 😳 OMG, thanks (reply to 60889)

&rey: — No NFT was minted: all transactions had oldStatus == endStatus == 'active'. — Message contained insufficient bits: see vmLogs of the middle transaction.

Abozy: Thanks again, I double-checked and it turns out I deployed a completely different contract... (reply to 60891)

Abozy: Now it's 402, I didn't find such a code in the documentation... https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes

&rey: Check NFT code then. (reply to 60894)

Abozy: Yep, I wrote it myself... (reply to 60895)

Abozy: Thanks again and again 😘 (reply to 60895)

mohsen: I'm interested in transferring coins and tokens on the TON blockchain using Python. Could you please recommend a suitable approach for this?

Vitor: Look for 'pytoniq' on GitHub. (reply to 60899)

Vatshayan: how to get TON testnet API Key

mohsen: Are you sure we can use it to create and send transactions? (reply to 60900)

Vitor: It does have 'raw_send_message' on the LiteClient implementation (I just checked), so you should be able to create transactions yes. (reply to 60902)

Vitor: I haven't used it as a signer, though, so no first hand experience.

mohsen: Is this library async? (reply to 60903)

Vitor: Yes. (reply to 60906)

&rey: If that's not your wallet (including a custodial one), you cannot. That's all. (reply to 60908)

Vitor: You cannot retrieve the tokens, unless you sent them a wallet you own. (reply to 60911)

Johan: Is that possible to fetch events from blockchain directly with info about Jetton transfer in detail with name of coin and etc?

K.: Haven't your question been answered already? If you don't control the wallet you sent to - you can't retrieve them, in any way. (reply to 60921)

K.: Also beware of scammers DMing claming then can help you with it - they can't.

Nerses: Hi everyone. Who can help to do method call to deployed smart contract ?

User<1463408356>: Hey, could someone help me with transfering tons and jettons with use of tonweb? Im having some issues

Dev(devu): Sir I have sent ton to my wallet but it not received yet but it is shown in block chain.. Txn hash--97d324346b83e33971048505a30889625f28221cd2e85c30855f2727a20ecfb7 Received address--UQALTR58JL0wfN1827nz8uIn7Fl64bkPM0MCukcQqP5W9IcV

ecomnazar: hi, when i connect ton wallet in my twa, how can i handle connected wallets address

Dev(devu): Anyone is here?

Abozy: Can anyone tell me how to send nft from one address to another? I'm trying like this, but for some reason transferResult is undefined

User<1463408356>: juust wait, if it's on blockchain you will receive it (reply to 60932)

User<1463408356>: also check you wallet version

Dev(devu): Means (reply to 60937)

User<1463408356>: your wallet address is v3r1

User<1463408356>: so you need to set your wallet version to v3r1 as well

User<1463408356>: in a pp

Rohit: Hello 👋 if you know, how to transfer jetton from one jetton wallet to another using tact... Please share any resource regarding that.

Dev(devu): How can you please explain? (reply to 60947)

User<1463408356>: depends on what wallet u use

Dev(devu): Telegram wallet

User<1463408356>: dm me cuz this chat is censoring all words i use

Abozy: How can I send a message in a sandbox to a contract from which I only have an address?

User<6995531243>: I'm highly accomplished blockchain engineer who is proficient in web3 projects in blockchain space as well being well versed and fast-paced collaboration. if you are in need of dev , feel free to reach me out .

JK: talking about mint nft Would like to ask Can we specifically like only can use our own jetton wallet address (own coin) to mint the nft ?

&rey: If it is shown in blockchain, TON are received, and if a wallet app shows you otherwise you may use another one (from ton.org/wallets). (reply to 60930)

Mutant Rolls: Hello! I have a question about the best system to use with TON when generating verifiable random numbers. Does TON eco system plan to make their own oracles in this regard?   Such as Chainlink VRF or Switchboard for Solana.

Mutant Rolls: I think it is necessary for TON to come up with their own product and I would be very happy to use it :)

&rey: I have an ECVRF oracle. https://ratingers.pythonanywhere.com/ecvrf-about.html (reply to 60977)

Mutant Rolls: Do you have the transaction id? On which platform you made the trade?

Mutant Rolls: @pcrafter thanks man! Looking into it

&rey: On your wallet wrapper, use sendTransfer function. IDE should help to find type parameters. (reply to 60955)

Mutant Rolls: I am also looking forward to finding a great team of TON blockchain developers.

&rey: You should check out how to do a transfer using Python (from TON Cookbook), and then translate that into Tact, rather literally. (reply to 60948)

&rey: You've probably hit timeout of 10s. Please try to join your thoughts into a single message. (reply to 60952)

[BOT-TL]: Anyone know how to parse internal msg from tx to get in and out amounts from stonfi swap execution

Johan: Is that possible to fetch events from blockchain directly with info about Jetton transfer in detail with name of coin and etc?

Никита: Hello, i try to transfer nft and always i use 0.05 ton value and 0.0001 forward value, why my tons stored on samrt contract after transaction ? This is how i build message ` let tx = await wallet.contract.sendTransfer({     seqno,     secretKey: wallet.keyPair.secretKey,     messages: [       internal({         value: amountToBeReceivedByNft,         bounce: true,         to: nftAddress,         body: createTransferBody({           newOwner,           responseTo: Address.parse(wallet.contract.address.toString({ bounceable: true })),           forwardAmount: nftForwardAmount,         }),       }),     ],     sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,   })   return seqno`

Никита: https://tonviewer.com/transaction/a5325c1da2fa97fbaa06ed74a1987f73ff8d9547845062bf264eabb6a196ccd7

W. [Разработка сайтов]: Hello all, who knows if NFT TON Masters: Wallets s give these when sending TON for some reason I did not receive anything promotion is over?

Anarion: Please remind me where to see the icon storage address... I created a token and forgot where I saved the logo.

&rey: Blockchain doesn't recognize transactions as jetton, NFT transfers, etc. You need an aggregator, also called indexer, to fetch that data. (reply to 61012)

&rey: Well, everything that remained from NFT collection's PoV was sent out. In particular, it does not and will not know about recent fee reduction. (reply to 61015)

Никита: how can i build message to receive back remaining amount and does not store it on contract ? (reply to 61031)

Sasha: hi there , what is 500 error in wallet v5r1

&rey: Well, you cannot withdraw balance from that NFT below level of 0.05 TON. (reply to 61032)

Никита: No i want to transfer 5000 nft and want to reduce cost (reply to 61034)

Никита: i dont want to withdraw from current nft

&rey: You should consider setting response address to null (two zero bits) and sending minimal amount for which transfer works. (reply to 61035)

Johan: Indexer? Can I do that by myself? I hope it won't require additional funds and etc.... Don't want to pay for TonApi (reply to 61030)

Boris: const [tonConnect] = useTonConnectUI(); … const result = await tonConnect.sendTransaction(…)    sendTransaction never resolves.. although the transaction was successfully executed in TonKeeper.  Has anyone faced the same problem?

Nxrix: There is a big scam going on with telegram bots  Can't the validators do something about them? That's really unfair  They act in a way that people can't find out it's scam or from real things A lot of my friends are getting scammed even they already have seen and are careful

Boris: In TonKeeper the transaction was executed successfully, but in the app it stays like this forever.. (reply to 61039)

Optimus: Does telegram have validators?   That would be Ton right?  This is confusin (reply to 61040)

Nxrix: I mean they should do something about them Like they implement a way that scammer wallets start to send out what they have to the sender (reply to 61045)

María Victoria🆓🐈‍⬛: I'm asking if anyone knows where the 150,000 notcoin I earned goes and they're @emillyserah1 telling me to send them 1000 notcoin to verify my wallet. This right?

Nxrix: It's scam (reply to 61049)

Optimus: Ouch. Hard luck please. (reply to 61051)

Optimus: Yh. I understand.  I see some wallets being frozen by validators.  Maybe they could do something like that for scam bots (reply to 61048)

María Victoria🆓🐈‍⬛: I have doubts where these notcoin that I earned went

Nxrix: Those ones are just the early miners who didn't init their wallet (reply to 61053)

Optimus: Oh. )  I didn't know about that. (reply to 61055)

María Victoria🆓🐈‍⬛: I started the wallet today but I was able to withdraw 2900 notcoin to mytonwallet

Optimus: Soo could they do something like that for scam wallets?  Maybe a sc that reports a wallet address so that before you make a transaction, you get a warning on the Blockchain.  Is that possible? (reply to 61055)

María Victoria🆓🐈‍⬛: Then I went to the community and did the wallet thing and I won 150,000 notcoin but they were not added to any wallet

Nxrix: I think they can (reply to 61059)

Optimus: They were scam.  That's why they wanted you to send 1k notcoin first. (reply to 61060)

Sasha: hi , i bought a .ton addres , how can i use it ? i want to when sent a token to some one thats show my .ton name (reply to 61037)

Culp: who needs a developer for your project?

Disco: can you also make a browser extension ? (reply to 61067)

Culp: sure. (reply to 61068)

Kuilash: Am available if anyone needs a developer for your TON or Mini app project. Also I am interested in partnership and being in the team. Pls dm me for discussion 🙏

Nerkrkririei I Think I Need A It's A: check DMs (reply to 61054)

User<7174392301>: I would like to apply as an experienced blockchain developer. feel free to reach out me if you are in need a dev.

Madhur: What does did error mean?

Nerkrkririei I Think I Need A It's A: this is ETH, not TON (reply to 61086)

Nerkrkririei I Think I Need A It's A: but it's because you are attempting to estimate gas of a transaction that will fail

Madhur: I want to transfer PSTAKE token to open network (reply to 61087)

Cleberson: Can I share an idea of a Jetton and an App that I will create? I want to hear from you.

Nerkrkririei I Think I Need A It's A: Sure (reply to 61090)

Nerkrkririei I Think I Need A It's A: Try using a smaller amount. I'm not sure if that'll help (reply to 61089)

Madhur: Not working

Madhur: Do i need to generate a contract on ton chain first for the PSTAKE token?

Madhur: Because this is the first time the token will be on open network

Cleberson: Jetton from the TON ecosystem to promote rewards and incentives for the analytics platform.  What is the purpose of the platform? The objective is to collect data regarding football matches, with the aim of providing the statistical probability of something happening or not happening in the match, through rewards on Jetton for users who will provide data to the platform.  How will users be able to provide data? Users will be able to provide data using the App for Android or IOS, through interactions and guesses.  What data will be collected? The app will collect data regarding the exact result of the match score, simple match result, assists, goals, corners, fouls, cards and other information. (reply to 61091)

— 2024-05-18 —

User<7137605686>: How do i send TON through python SDK>

User<7137605686>: anyone know?

&rey: pytoniq? Use .send_transfer method on wallet wrapper. (reply to 61104)

User<7137605686>: from pytoniq import LiteBalancer, WalletV4R2 import asyncio  mnemonics = []  async def main():      provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()      wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)      transfer = {         "destination": "UQC25k6lIqOL6Zut4OWKpLNDKmlDdXiRe02IO0yAAZ_ViKQR",    # please remember about bounceable flags         "amount":      int(10**9 * 0.05),              # amount sent, in nanoTON         "body":        "wdwwdwddwdwqwd",       # may contain a cell; see next examples     }      await wallet.transfer(**transfer)     await client.close_all()  asyncio.run(main())

User<7137605686>: i get a error with this    raise RunGetMethodError(address=address, method=method, exit_code=result['exit_code']) pytoniq.liteclient.client.RunGetMethodError: Get method "seqno" for account Address<EQC1ifP634wm7NADdYPxeG4Au53kBAXdmHsoaYQLjFwPZhBd> returned exit code -256 Exception ignored in: <function _ProactorBasePipeT

Abozy: ~dump(first_dict); first_dict~udict_set(256, sender_address.preload_uint(256), begin_cell().store_uint(1,1).end_cell().begin_parse()); ~dump(first_dict); save_data();  Tell me why in the dump I see changes in the dict, but when I try to get the value through a getter after calling the method, it is null? 😢

&rey: You change first_dict from message handler, right? (reply to 61112)

Abozy: After the contract receives the opcode, yes (reply to 61114)

Web DUCKS 🐦 SUI 🐾: If possible then please create a option to convert dust to TON.

&rey: Directly, you mean? (reply to 61121)

Web DUCKS 🐦 SUI 🐾: Mean tokens I m holding in wallet. Low value tokens like I have 0.3 JVT

Web DUCKS 🐦 SUI 🐾: If I want to swap 0.3 JVT to ton asking for 0.1 to 0.2 TON gas Fees but The real value of 0.3 JVT is only 0.09 Ton

Web DUCKS 🐦 SUI 🐾: So if we can convert all The low value tokens to TON widout spending gas fees

Web DUCKS 🐦 SUI 🐾: The option is for Exchanges like we can convert Tokens to BNB. But appreciate if the option appread in the wallet

Web DUCKS 🐦 SUI 🐾: A option like This

Abozy: I forgot that a cell can store up to 4 links, but placed 6 😁 (Plus I forgot that a dictionary is a reference type) (reply to 61114)

Abozy: And now dict work as expected 👍

&rey: Clear. Good idea! Nevertheless, who would pay the fees? On TON, you can't aggregate "wiping the dust" from different wallets, because all of those jetton wallets are even more different. (reply to 61123)

Klay.D: hi, any chance a sent transaction could get lost and not be verified? could I just inform my users a eventual success of a transaction when it is sent and not verified yet? This would improve UX a lot by not waiting for tx to be verified.

Nxrix: There is a chance that it fails (reply to 61133)

Klay.D: Then what would be the case if tx is just a simple transfer? The user don’t send much txs at one time and user’s balance is already checked before sending tx. (reply to 61134)

Nxrix: I think there is still the chance  It's better to always check and wait for it to complete (reply to 61136)

Ali: What does it mean?

&rey: Yes, if liteservers somehow don't send it to validators in time. (reply to 61133)

&rey: It means that TON doesn't have much load, likely? (reply to 61142)

Ali: Yes (reply to 61144)

Disha | SMBmarket: Can anyone please help me to understand this? Even I have more than enough TON in my wallet it is showing "-14 exit code".

kenshi?: после подключения кошелька к web app, с кошелька не идёт назад в сам web app как можно это сделать?

TON Bounty Bridge: ​Snapshot NFT tool  🏷 Developer Tool  Summary:When projects want to airdrop tokens to holders of NFTs from a specific collection, I propose a side...  Created by kayx86

Edward: Is there anyone using Angular in the TON eco system at all?

&rey: You're sending insufficient TON to pay for computation. It's worth noting that fees are paid from message value, not from sender contract directly. (reply to 61146)

Rio: i need some help to find accountID to use ton console api? anyone here know how to find it, pls help me :(

&rey: Just address. (reply to 61165)

Rio: Oh Tks bro, so crazy

PetX: I want to make a set for those who want to mint it themselves.  Do you know how to do it?

Enoch: pls how do get my unit test to show errors properly when transactions fail

v: How can we get usdt Testnet token on ton blockchain?

Enoch: pls does any one have a tact contract dex code

User<6794181116>: hello, I am writing a script to exchange my jettons for tone, I use tonconnector to authorize the user, but in the tone connector you can only request a tone translation, and I need to somehow request a translation of my jettons from the user

&rey: Jetton transfers aren't processed differently than transaction chains in TON. You should send jetton transfer request to user's jetton wallet. (reply to 61187)

User<6794181116>: can I find out where I can read this? I need the user to initiate the transfer using the swap button, and I will transfer the amount of my token to the creak myself, because I cannot find an example code for the transfer (reply to 61192)

&rey: Have you visited TON documentation? And TON Cookbook there? (reply to 61193)

User<6794181116>: I have seen a way to transfer via tonweb, but will it work correctly if the wallet is connected via ton connector (reply to 61194)

Enoch: wrote a test to send jettons to a contract and withdraw the tokens back but the withdraw test seems to always fail (reply to 61192)

&rey: Wdym to withdraw? Special functionality in your contract? (reply to 61196)

&rey: Why won't it? TON wallets work quite universally, I think... (reply to 61195)

Enoch: like a swap. i want to withdraw/swap tokens sent to the smart contract (reply to 61199)

M3: hiring ton developer

&rey: Please look at @tonhunt. (reply to 61205)

User<6794181116>: don't think it's arrogance, but could you give me a link where I can read about it (reply to 61201)

M3: How does that work? (reply to 61206)

Enoch: @pcrafter (reply to 61202)

Nerkrkririei I Think I Need A It's A: https://testnet.tonviewer.com/transaction/1b15a002f32f53344519650e43e923f9ab8ec7901dfeffc804cc11f670323a94  Why does my TON bounce back?

Atsushi: Hello. I would like to ask about a challenging issue I'm currently facing. The most important question I have is, "Is it not practical in TON to create large-scale lists (on the order of tens of thousands of items)?"  When creating lists in TON, you need to be mindful of the following two points:  Cells should be chained together, with each cell holding a reference to the next cell, and so on. When updating a cell value, you need to prepare a new cell, fill it with the new value and the rest of the existing values. The updated cell will have a different reference from the cell before the update. That is, if you need to update a certain cell " A ", the previous cell " B " that holds the reference to " A " must be updated to refer to the updated " A' ", and because " B" 's value is updated, the cell " C " before " B " must also update its reference to " B' "... Thus, when updating a cell, you need to update the values of all the cells that have been referenced up to that point.  When this involves a list of tens of thousands, for example, if you update the 10,000th cell, it's necessary to update all 9,999 cells that came before it, which would require significant computational time and incur large gas costs. Is this unavoidable in TON?

Enoch: https://tact-by-example.org/06-unbounded-maps  this would help you (reply to 61212)

Shuta: I was reading the documentation and found a great philosophy that all Dapps should be fully on-chain. However, if there are cases where off-chain solutions are necessary due to data length or update frequency, does TON not provide this service? This is something I'm curious about, especially when considering future cooperation or partnerships.

Atsushi: Thank you, Danijel. I will read it carefully and consider your advice.👍 (reply to 61213)

Anant.Hyp3 | Qc: Where we get testnet faucet

&rey: Because destination contract is not initialized. You should fix this by removing bounce flag, not by initing the wallet. (reply to 61211)

&rey: TON Blockchain doesn't. Other parts of ecosystem might. (reply to 61214)

Nerkrkririei I Think I Need A It's A: ah, so I need to send it to address with bounce flag set off? (reply to 61217)

K.: https://t.me/testgiver_ton_bot (reply to 61216)

Anant.Hyp3 | Qc: Not working (reply to 61220)

K.: It might be down sometimes, just try again later. (reply to 61222)

Shuta: Thank you, I'm relieved to hear that. (reply to 61218)

M3: looking for a dev

Shuta: In that case, if part of the product is off-chain, it would somewhat go against TON's great philosophy. Would it still be possible for TON to support or partner with us? (reply to 61218)

agile_ape: imo, everything of importance and value should be stored onchain. you still need a backend db for other purposes, like reactivity (as you mentioned), or storing how many addresses connected to your dapp.... (reply to 61229)

agile_ape: i don't think ton cares if you have a separate backend running for your own needs. if the contract is interoperable - i.e. others can build on top of it standalone, i think that is suffice

Alexis: 🚀 Hiring a Dev in the TON Community! 🚀  We are looking for a skilled developer proficient in FunC, Tact, and smart contracts to join our team. If you have experience building launch pads on TON and a passion for blockchain, we want to hear from you!  Requirements:  Proficiency in FunC and Tact Experience with smart contracts Aptitude for building launch pads on TON Strong problem-solving skills Experience with web and/or TG mini apps How to Apply: DM me with your CV and/or GitHub profile.  Let's build something great together! 🌐✨

Shuta: Understood. We are creating a real-time ranking game and will manage scores with each child contract. However, we understand that the leaderboard needs to be kept off-chain.I understand that the key criterion is whether others can use our code to create separate services. Thank you. (reply to 61231)

KO: I have a question. I have implemented a function to send a transaction through ton connect ui in the Mini app, but even if the transfer is successful and I return to the Mini app, the app does not receive whether it was sent or not. Do you have any relevant information?

Nerkrkririei I Think I Need A It's A: do you know how I can remove the bounce flag? I'm using ton SDK for TS, but I can't find the option to manipulate addresses (reply to 61217)

&rey: Address.parse('...').toString({bounceable: false}) (reply to 61237)

ally11: import { Address } from '@ton/ton' Address.parse('...').toString({bounceable: false}) (reply to 61237)

Nerkrkririei I Think I Need A It's A: ok, thanks (reply to 61238)

On-Chain ⛓️: Hey guys. Npm install ton@contract won't run on my PC, what do I do?

User<384560997>: Hey guys, Has anyone encountered this error and how to fix it? (Below)    File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings

K.: That package does not exist. Are you following some tutorial, perhaps it's outdated? (reply to 61241)

K.: FYI, those packages are outdated (even deprecated), latest are: @ton/ton @ton/core @ton/crypto. (reply to 61248)

[BOT-TL]: Anyone know how to parse internal msg from tx to get in and out amounts from stonfi swap execution

Kalen: Hey guys, In Ethereum, you can retrieve all data through 'mapping' structures. How can you retrieve all children here?  For example, is there a way to fetch all Jetton Wallets for a Jetton Master, or do you need to build a new database to handle it together?

Dmitry | backend4you.ton: Build. Or use tonapi/etc (reply to 61271)

Johan: I have set up ton-indexer, swagger works, but it strange that it can't maybe rapidly somehow fetch data about jettons through transaction hash (reply to 61238)

Johan: Can you please check my ton-indexer? I haven't tested out yet, I can send you to DM the API url

KO: How do I submit a transaction in the mini app and then return the results back to the mini app?

&rey: I guess transactions chain might be not completed by the time you query it? (reply to 61274)

🅰🅻🅰🅽: Is there break and continue statement in FunC language? Or i need to write another internal function to achieve break statement?

Emeka: Hello everyone

Emeka: I am thrilled to be here

Emeka: Please does anyone know of an active TON faucet for test tokens?

Евгений: Hi, can you please advise in case someone knows,  Mytonctrl fails to start and error  account 1FB055695E994FCF4D425C0A6CE6A792594B7173205F740A39CD56F537DEFD28 does not have a valid ShardAccount to unpack

Dmitry | backend4you.ton: @testgiver_ton_bot (reply to 61285)

User<6233645471>: Why this is happening guys pls help

Амир: Not enough ton balance (reply to 61290)

Амир: Dep more to cover fee

User<6233645471>: I have more than enough TON (reply to 61291)

&rey: Another function is required. (reply to 61281)

User<7137605686>: Anyone know python SDK's that aren't outdated?

🅰🅻🅰🅽: Got it, i have written another internal function to handle it, hoping that the statement will introduce in the near future 🫡 (reply to 61294)

Leonid: Hello everyone. I'm from Cuba. I am doing a new project on a Mini dApps on Telegram based on the TON ecosystem (DeFi, DAO, DEX, AMM), because most APKs do not work with Cuban IP. The idea is to create a Wallet with an operational and reliable payment system for Cubans that we can use from Cuba and around the world... I am listening to some suggestions. Thank you

Ricky: Hello, everyone! I have a question. I want to decode the Jetton's transaction with JAVA, but I couldn't get the "amount" and  "Comment", It was easy to get these information when I decoded TON coin, I tried to use https://toncenter.com/api/v3/transactions  such API.  Could anyone help me?

Emeka: Please what other was cancelled I get TON test coins

M3: i hire a developer

Pavel: Anyone can reccommend a good moderation/protection bot for Base network projects?  Or a good buy bot/token tracker.  The ones I've tried are not great with Base

&rey: Perhaps you could say what went wrong with the previous developers who applied? (reply to 61309)

&rey: pytoniq is up-to-date. (reply to 61295)

&rey: Do you know how to parse a cell in Java? (reply to 61303)

Nxrix: time to do it in the mainnet and take the first place 😈 (reply to 61142)

Black Angel: Hello M3 Nice to meet you. This is Steve. As a blockchain dev, I'm looking for opportunities of working with you. this is my portfolio. https://stevelee.vercel.app If possible, plz ping me. Thanks! (reply to 61309)

Ricky: I don't know yet, I'm just asking 😂 (reply to 61321)

User<7137605686>: it doesn't work (reply to 61319)

User<7137605686>: can't transfer money from ton wallet to ton wallet with it

&rey: What's the issue? (reply to 61327)

Daniil: Hello. how to specify a comment to the transaction using tonconnect?

&rey: Example in TonWeb (@ton/core is largely equivalent): https://docs.ton.org/develop/dapps/ton-connect/transactions#transfer-with-comment. (reply to 61330)

&rey: You may need SDK called ton4j: https://github.com/neodix42/ton4j/blob/main/cell/README.md. (reply to 61324)

Ricky: Wow!

Proton: Could you please advise, what is the basis for forming a TON address? Is it derived from the private key? If someone gives me a interesting address with a key, can I change the key but keep the address? Or perhaps upload another contract? What should I read to understand this if the answer isn't brief?

🅰🅻🅰🅽: Hey funC masters, i have came up another question, if i want to calculate y = exp(k*x), where k is between 0 and 1, is it possible to conduct the calculation in funC?

milky: Any one with this error when running the flappybird gamefi? Error: no healthy nodes for v4-testnet

Behrang: Read here for the structure of addresses. Basically there are some flag bits, then workchain id, and then hash of the state_init (which is contract code + data). (reply to 61334)

Behrang: Since public key remain in data part of wallets, yes it is derived from private key in wallet addresses. (reply to 61334)

Proton: Where? (reply to 61339)

Behrang: If contract is upgradeable, then yes, you can upgrade it to any other code and data. (reply to 61334)

Behrang: I Forgot!  https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/crypto/block/block.tlb#L105 (reply to 61341)

Proton: Thanks for your answer. (reply to 61342)

Behrang: Use muldiv operation. It multiplies and then divides.  For example to calculate 0.75 of x use: muldiv(x, 75, 100) (reply to 61335)

User<7137605686>: Just don't know how (reply to 61329)

&rey: A note in case you got confused: in general, TON contracts don't have keypairs. Wallet contracts have them, but on a level of code, not blockchain node. (reply to 61334)

User<7137605686>: are there any API's i can use to send TON from my wallet to another wallet?

&rey: API? Not precisely, you still need to manage your keypair. (reply to 61348)

User<7137605686>: I'm just so awfully confused

User<7137605686>: all the python SDK's are either outdated or dont work

&rey: "Don't work", or you need an example? If latter, I think one can be found in chat history. (reply to 61352)

User<7137605686>: I mean i'd appreciate an example

&rey: Oh, I see. Please try adding "seqno": 0 field into transfer dict. (reply to 61111)

User<7137605686>: okay.

&rey: Unfortunately, you'll have to initialize wallet with a separate external: await wallet.send_init_external(). (reply to 61358)

User<7137605686>: i need to make a new wallet every time?

User<7137605686>: nvm

&rey: No, just init the wallet once. I say "unfortunately" because actually wallets should work whether they were initialized beforehand or not.

User<7137605686>: I'm so confused

User<7137605686>: could you cjeck your private messages (reply to 61363)

D K: I have a question. After creating a pull request on github, how long will it take for the unverified text under the token to disappear on tonkeeper? Thanks

Abdulaziz: It's possible to send usdt from ton Blockchain to the etherium?

mfckr.ton: check if erc20 network is available , i dont think so tho (reply to 61374)

mfckr.ton: anyone got a script for airdrop or tool

Victor: Hello, who are use tonconsole or toncenter with tonitils-go? How to boc convert to right string?   var resp tl.Serializable   err = c.client.QueryLiteserver(ctx, SendMessage{Body: req.ToBOCWithFlags(false)}, &resp)   if err != nil {     return err   } use req.ToBOCWithFlags(false) need req.ToBOCWithFlags(false) to string

&rey: I believe only via swapping TON-native USDT to bridged jUSDT-over-TON, and then unbridging it to Ethereum. (reply to 61374)

&rey: Unspecified. (reply to 61373)

D K: Thank u (reply to 61379)

Abdulaziz: There is any service for it? Sending usdt from ton to Etherium or tron blockchains (reply to 61378)

&rey: bridge.ton.org, for example. (reply to 61382)

Christine: I transferred my USDT on the TON network to Trust Wallet, but later saw that they don't support jettons. Where can I import a multi-currency wallet to withdraw my USDT? Help!!!

Abdulaziz: So for any transactions Blockchain to blockchain i need pay 1 ton and 0.1% of tokens? (reply to 61383)

&rey: Yes. You may create atomic swap which would be cheaper on TON side and more expensive on ETH, but I don't know if there are platforms which would allow you to find a counterparty. (reply to 61385)

Andrey: To which address did you transfer your funds? (reply to 61384)

ecomnazar: hi, how can i handle ton transaction status succees or not in my twa

&rey: TonDevWallet can be used to import wallet by private key. (reply to 61384)

Christine: Trust Wallet in network TON jetton USDT (reply to 61387)

&rey: This is the repo. https://github.com/TonDevWallet/TonDevWallet. I think the author is reliable. (reply to 61384)

Christine: I'm not a developer, I don't know how to get this up and running, help!

Max: writed on dm (reply to 61384)

&rey: Please beware, since scammers often use DMs. (reply to 61394)

Max: im not asking for (reply to 61396)

Christine: Everyone's already blacklisted (reply to 61396)

Max: just helping

Амир: Have u solved Ur problem (reply to 61293)

Abdulaziz: So it means i also can swap tokens between blockchains by creating smart contracts? (reply to 61386)

&rey: Yeah, just find the counterparty. You don't even need to trust them. (reply to 61402)

Joker: Hello, I'm a full-stack Web3 developer and have expertise in dApp development. Please get in touch with me to discuss more about your project. (reply to 61338)

Andrey: I think there’s only one path: - export trust wallet mnemonic phrase - decode it with bip39 converter - extract private key of nested ton wallet - make a tx with this private to transfer the funds bacbackk to (reply to 61394)

Abdulaziz: If I get you right, I need to write code for two smart contracts and counterparty will not be able to scam me if he is a scammer? (reply to 61403)

Abdulaziz: This is a very interesting function of cryptocurrencies, I didn’t know it was possible, thank you, I’ll study how to create a Smart contract. (reply to 61403)

User<6233645471>: Nope (reply to 61401)

Abdulaziz: I think i need some app like remix but on ton blockchain to run smart contracts? (reply to 61403)

&rey: Testing frameworks are listed on docs.ton.org. (reply to 61411)

Abdulaziz: I learned about atomic swap via chatgpt, it said i need something like remix to run smart contracts, maybe it was wrong (reply to 61412)

&rey: Well, perhaps that is true for EVM-side contract, but TVM-side contract will be deployed by other tools. (reply to 61413)

Proton: Thanks, i got that. Unlike eth. And if I got it right if addres is of a wallet contract it is derived from some hash of initial contract code and keys, but if contract supports this. It could be replaced with other code and keys but addr will remain tha same? (reply to 61347)

Proton: Thanks (reply to 61347)

Nick: Hello everyone! We’re using lite client for transfer with global free config with list of client (through golang)  And we faced with problem that transfer works with a 50% chance,  no errors from client, success  response every time but we see only 50% transactions in explorer.  Do anyone faced with this problem too?  Or maybe you can advice easier way of transfer implementation in golang for ton

Валерий: Who's removing my messages? i do not understand

&rey: Those messages were offtop for TON development chat. (reply to 61427)

Валерий: why? it's about develop. good tool for pyCharm, i  using it for ton develop (reply to 61428)

Амир: So u must follow my suggestion xD (reply to 61410)

ecomnazar: hi, how can i handle ton transaction status succees or not in my twa

User<6779439263>: who needs a developer?

User<6676350680>: if anyone needs a dev, please feel free to contact me

— 2024-05-19 —

User<7137605686>: 80

Hoover: Open to suggestions, Backend, have experience in different networks and different crypto and not only projects, if necessary we can assemble a team to accomplish tasks in the shortest possible time.

TON Bounty Bridge: ​Schemes Upgrade for TON Documentation  Summary:Improve the visual representation of concepts in the TON Cookbook by redrawing current schemes to fi...  Rewards: • SBT Bounty Reward • TBD USD in TON  Created by reveloper

Johan: Ok, I suppose I can work with jettons without setting up ton-indexer (reply to 61278)

Amir: hi how to set dictionary data when we want to deploy contract ? i am using blueprint

Aldric: hi guy. What is the maximum depth of cell. And what happens when i have a cell with depth of 100. Thank you 🙏

NaN: i can't send the ton to other wallet. how do i fix this. im using tonweb

Dmitry | backend4you.ton: No such limit. Some places have total size limit to 64kb, but nothing about deep. (reply to 61476)

NaN: can anyone fix this error

ch4rter: I am looking for a decentralized application developer on a permanent basis. Please contact me. The project promises to be interesting, not a scam, not a memcoin, not tap tap tap

Makten: Any reason why Ton seems to process transactions incredibly slow for a scalable network with fast finality?   Is the network already under load? If so is there a good website to see how many simple transactions per second is causing the stress? Maybe someone just knows the current averages off hand.

Kenny$$Shillz: Wrap in a number class instance (reply to 60655)

𝐓𝐡𝐞𝐂𝐚𝐭𝐅𝐚𝐭𝐡𝐞𝐫: We need a smart contract for additional payment in a neuro-bot in tenge. We plan to extend the token throughout the ecosystem in the future. Preferably on the TON network -when you purchase a service, tokens are sent to your wallet. -replenishment of the bot. - output from the bot. -allow/deny a token for replenishment/withdrawal/purchase of services in the bot. - balance check. -checking whether the token is allowed/prohibited for interaction with the bot. -installation of a new wallet to which funds will be sent when purchasing a service.

John: I Personally do not understand. You have to come clear please.  👉 What is meant by replenishment of bot? (reply to 61495)

Vlad: Write to the bos who had experience in developing Jetton Minter ICO

Johan: Is there more effective way to fetch info about jettons?? maybe I need to use APIs of DEXes

v: I have a question. I want to call the contract method and withdraw the USDT in this contract. How should I do this?

On-Chain ⛓️: Please can I get the latest tutorial? (reply to 61251)

Dmitry | backend4you.ton: “More effective” compared to what? Check tonapi (reply to 61500)

User<7137605686>: I minted a token

User<7137605686>: why UNKW?

&rey: Do other explorers work fine? ton.cx, for instance? (reply to 61511)

&rey: Contract you "call" (send message to) doesn't gain any authority over "caller" (message sender). You should make user send USDT to the contract and process transfer notification there. (reply to 61504)

&rey: What kind of transactions? DEX swaps are slow, since they regularly involve many cross-shard messages, and each of them guarantees delay of one block at least. (reply to 61492)

&rey: But you're not sending transfer, are you? Btw, what are you trying to send with tonweb.sendBoc(bocBytes);? (reply to 61479)

Proton: Is there a standart in ton nft for alboom nft? Like 1 nft is a collection of photos?

&rey: No such standard. (reply to 61520)

Hanniba1111: Hi guys, I have a question. When I player Catizen, I found that after I click "BUY" to get items an interface pops up which contains some options of TONKeeper and TON Wallet. If I want to accomplish this function, which api or stacks should I use?

&rey: You can either use TON Connect 2 (there is JS SDK) or manually implement menu and then provide ton://transfer links. (reply to 61525)

Hanniba1111: thx a lot! (reply to 61527)

Johan: It's TonApi? (reply to 61511)

Johan: I wanted to work with my full node only (reply to 61507)

Johan: I'm using tonutils-go lib

Johan: And created my own API with fetching transactions with additional data which TonApi provides

Johan: But I need to implement feature to fetch info about jettons, their name, supply to calculate market cap and other data

Dmytro: Hi. I have such message when trying to make request to my self-hosted Liteserver:  Liteserver crashed with 651 code. Message: block (0,6800000000000000,43612349) is not in db (possibly out of sync: shard_client_seqno=37976628 ls_seqno=37977006)  mytonctrl status: ===[ Local validator status ]=== Validator index: -1 Validator efficiency: n/a ADNL address of local validator: - Local validator wallet address: - Local validator wallet balance: 0 Load average[24]: 4.69, 4.82, 4.83 Network load average (Mbit/s): 36.77, 38.6, 37.13 Memory load: ram:[44.78 Gb, 37.2%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): sda:[21.83, 98.98%] Mytoncore status: working, 8 days Local validator status: working, 3 days Local validator out of sync: 23 s Local validator database size: 125.99 Gb, 43.7% Version mytonctrl:  () Version validator: 4cfe1d1 ()  So, my node is sync with the network but some blocks is not in DB.  Am I lacking resources? Do I need better hardware? If so, what exactly might I be missing?

Dmitry | backend4you.ton: Then you need to “repeat” a lot of job that tonapi already does - parse online and offline Jetton and nft content etc. There already was some indexer implementation for self hosting… don’t remember its name, try to search over chat… (reply to 61535)

Danil: Hey guys, do anyone sell testnet ton?

&rey: Tonconsole does 😄 (reply to 61544)

Ken: Is there a way to access the lt from within a contract?

Black Angel: Yeah, there is (reply to 61550)

Behrang: cur_lt() (reply to 61550)

Anastasiia: No idea what NFT you are deploying. But if this one (https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/nft/nft-collection-editable.fc#L97), it might be an issue with the nft index that you are trying to deploy :) (reply to 61554)

User<7144842738>: I am an experienced contract & frontend developer.  please contact me anytime if anyone needs a developer.

Johan: Hmm, ok, but can you please suggest something, because I could only fetch properly full needed information about jetton from "onchain" type Jettons: (reply to 61537)

Adam: Hello everyone, I have the following issue. I staked some TON, and then tried to unstake, but encountered this error. Currently, I still haven't received the amount of TON that I staked. Does anyone know what problem I might be facing? Thank you.

Johan: But with SemiChain one I haven't done anything yet: (reply to 61537)

Johan: almost half of info is empty :( (reply to 61564)

Johan: its Notcoin (reply to 61564)

Johan: Hmmm, its bizarre

Johan: This jetton has even description

Johan: I'm using my local full node, and it's harder to get what you want, but the speed is worth it. 😂

Johan: Hmm, you mean Anton Indexer? (reply to 61537)

Johan: I have tried it, its bizarre indexer

Vinograd: is this ton library ton-client-py??

Johan: https://pypi.org/project/ton-client-py/ (reply to 61573)

Johan: goddamn, I need to make more robust fetcher for nodes :D

Nyxra: Guys I want to make a telegram bot like notcoin, is there any free source code available online

Johan: Probably $not (reply to 61577)

Vinograd: i mean this smth strange (reply to 61579)

Vinograd: everscale or ton library?

zerodayv: how do i make a ton address active

zerodayv: GETS REVERSED BACK EVERYTIME I SEND SOMETHING TO THIS ADDRESS

&rey: Send TON in unbounceable mode (to address UQCS..., with flag bounce: false if there is place). If you already do so and TON still bounce, report bug to your wallet application. (reply to 61587)

&rey: If "Everscale" is written in description, then probably Everscale) You can find a list of Python SDKs on docs.ton.org. (reply to 61581)

zerodayv: thanks. it worked (reply to 61591)

User<7123272744>: As you guys know, testnet does not work well. How to test and debug my Func contracts?

&rey: @ton/sandbox. It's not prone to bad network conditions, lack of fast faucets, etc. (reply to 61597)

User<7123272744>: what do you think of nujan IDE? (reply to 61598)

zerodayv: How do i add Notcoin as a custom token in wallet?  We can add several other tokens eg arb apt algo on TON but NOT doesnt show here maybe because its new. Do we have a custom derevation for it?

&rey: What's that wallet you sent? I even doubt it supports TON. (reply to 61600)

zerodayv: tangem wallet. it supports ton (reply to 61602)

🅰🅻🅰🅽: When we are updating FunC contract, will it effect contract storage?

&rey: From their site: How do I transfer cryptocurrency, if the wallet doesn’t support the required network?  If you can't find the token you need in the tokens list in the "Manage tokens" section, you can add a custom token to the wallet yourself. This feature is available for the following blockchains (networks): Arbitrum, Avalanche C-Chain, BNB Beacon Chain, BNB Smart Chain, Ethereum, Ethereum Classic, EthereumFair, Ethereum PoW, Fantom Opera, Gnosis Chain, Optimistic Ethereum, Polygon, RSK, Solana, TRON, Kava EVM and Cronos. If the required network/token is not in the "Manage tokens" section or in the above list, then this token/network is not yet supported by the wallet, and it cannot be transferred to wallets. (reply to 61603)

🅰🅻🅰🅽: https://answers.ton.org/question/1533945080165961728/is-it-possible-to-change-a-deployed-smart-contract-on-ton  When we are updating CODE, what will be really modifing? What if the upgraded code modify the storage slot?

zerodayv: Yeah i did the same but how do i add NOT there? Whats its custom derevation (reply to 61605)

&rey: Contract is a cell stored in dictionary representing blockchain state. Contract cell contains data, code, balance and a bit of additional information. (reply to 61606)

&rey: When you call set_code, an action is created, which after smart-contract execution will change code in said cell. Just as data change, or balance (due to sending or receiving messages).

&rey: Have you read "this token/network is not yet supported by the wallet, and it cannot be transferred to wallets."? (reply to 61607)

zerodayv: But ton is supported

&rey: Have you read the quote fully? "This feature [adding custom tokens] is available for the following blockchains (networks): Arbitrum, Avalanche C-Chain, BNB Beacon Chain, BNB Smart Chain, Ethereum, Ethereum Classic, EthereumFair, Ethereum PoW, Fantom Opera, Gnosis Chain, Optimistic Ethereum, Polygon, RSK, Solana, TRON, Kava EVM and Cronos. " (reply to 61611)

🅰🅻🅰🅽: I think i have some feeling about it, but not much. Let's say if we want to migrate contract A with storage x=3 and y =4 to B, then when we upgrade the contract, we need to compile B contract with storage x=3 and y=4 prefilled, and then send the cell on chain to invoke set_code, am i correct? (reply to 61609)

&rey: Contract storage is cell. Let's suppose there is contract with code cell A + data cell containing 64 bits: 32 bits for x and 32 bits for y. You want to upgrade it to code cell B + data cell containing 32 bits for y and 32 bits for x. (reply to 61613)

zerodayv: noted thanks (reply to 61612)

&rey: Then, you need to run slice data_old = get_data().begin_parse(); int x = data_old~load_uint(32); int y = data_old~load_uint(32); data_old.end_parse(); cell data_new = begin_cell().store_uint(y, 32).store_uint(x, 32).end_cell(); set_data(data_new); set_code(B); (reply to 61614)

🅰🅻🅰🅽: OH MY GOD

🅰🅻🅰🅽: VERY AWESOME

&rey: TON is simple. In most regards. (reply to 61619)

🅰🅻🅰🅽: OMG You just save my day (reply to 61621)

&rey: Actually, that fact (that storage is not a slot-based dictionary but rather a cell) hinders contract upgrade functionality a bit, especially for high-level Tact. I have yet to see at least one contract which was upgraded.

🅰🅻🅰🅽: Hey, after showering under a few minutes of happiness, i found something strange.  If we want to run that code, this function should be in old contract right? If we try to remove / add data cell in the new contract, how can we know the data_new part as we deploy the old contract? (reply to 61616)

&rey: You can compile a cell with migration function and execute it separately. I find the shortest way to write upgrade in old contract will be in TVM asm then: () upgrade(cell migration, cell new_code) impure asm     "SETCODE"     "CTOS BLESS EXECUTE"; (reply to 61625)

🅰🅻🅰🅽: i am not familiar with asm, could you explain what "CTOS BLESS EXECUT" actually do?

&rey: Converts migration to slice, then to continuation, which is then called. So, an arbitrary function is called in the contract's context, so to say. (reply to 61627)

🅰🅻🅰🅽: truely funC / fift master, how beautiful it is

🅰🅻🅰🅽: thus we have to assemble our data_cell off-chain with their expected value then trigger this function, rather than parsing the current value in data_cell and copy to new cell.

Mark: 👋 who needs Telegram Mini App Developer?

Dealer: Me (reply to 61633)

&rey: If you can assemble data cell offchain, that is even easier! () upgrade(cell new_data, cell new_code) impure asm     "SETCODE"     "c4 POPCTR";  // <-- setting data or () upgrade(cell new_data, cell new_code) impure {     set_code(new_code);     set_data(new_data); } (reply to 61630)

🅰🅻🅰🅽: Yes i agree with you, but what if there are some txns happen before our update transaction? (reply to 61637)

🅰🅻🅰🅽: those transaction may update storage and make inconsistancy of the data_cell as we assemble it off-chain

🅰🅻🅰🅽: so i think the alternative is to halt the contract, then update, then active it ?

&rey: Why? This solution allows for an atomic update. (reply to 61626)

🅰🅻🅰🅽: for the inconsistency issue (reply to 61639)

🅰🅻🅰🅽: make sure that there will not be any storage change

ecomnazar: hi, how can i handle ton transaction status succees or not in my twa

Vatshayan: const check = async() => { const JETTON_MASTER_ADDRESS = "kQCvKRnHgdBefVPtC1qlfUFaG4q3Y9hI8Wcdab4O7AcP69du";         const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: JETTON_MASTER_ADDRESS });         const data = await jettonMinter.getJettonData();         console.log('Total supply:', data.totalSupply.toString());         console.log('URI to off-chain metadata:', data.jettonContentUri); }  Getting Error :  @extra: '1716142200.5664306:12:0.7936891112531875' @type: 'smc.runResult' exit_code: -13 gas_used: 0  error message: 'http provider parse response error'

Vatshayan: Facing this issues not able to fetch data from jetton  not able to do transaction through code.  can anyone please check

Vatshayan: or may be provide any doc or code ?

Vatshayan: Do jetton need mainnet/testnet API for checking balance, transfer or transaction details ?

🅰🅻🅰🅽: if we want to update contract, data_cell and make sure data consistancy, we may:  halt -> call your super coooooool method -> activate (reply to 61637)

&rey: Why halt, if during that method execution nothing else can come because the contract is already executing? Two messages can't be processed in parallel. (reply to 61650)

Vatshayan: Jetton Transfer Code :  await wallet.methods.transfer({             secretKey: key.secretKey,             toAddress: JETTON_WALLET_ADDRESS, // address of Jetton wallet of Jetton sender             amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message             seqno: seqno,             payload: await jettonWallet.createTransferBody({                 jettonAmount: TonWeb.utils.toNano('500'), // Jetton amount (in basic indivisible units)                 toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recipient user's wallet address (not Jetton wallet)                 forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message                 forwardPayload: forwardPayload, // text comment for Transfer notification message                 responseAddress: walletAddress // return the TONs after deducting commissions back to the sender's wallet address             }),             sendMode: 3,         }).send();   But  we are getting error as : 'writeInt: value is NaN'

Vatshayan: whats issues ? Is it with jetton method ? else with API, Key, or name ?

&rey: Probably,amount, not jettonAmount. (reply to 61652)

Makten: This is what I was looking for. Thank you. Are there any improvement proposals which may help this? (reply to 61518)

🅰🅻🅰🅽: here is an example, let's say we are building an AMM pool within single contract, due to some security concern, we want to add new storage and update logic in this contract:  there is a swap transaction in mem pool (which will modify the storage)  1. we read the original on-chain data_cell and asseble a new one 2. we send the new data_cell and new code on-chain (update tx) 3. However, the swap transaction precede our update tx, and it will cause reserve changes 4. Our new data_cell consist of old reserve, which will replace the contract data_cell <- here is the problem (reply to 61651)

Vatshayan: same error  Code I have referd from jetton ton doc (reply to 61654)

~/takezō: Hello!  My dictionary stores cell (through udict_set_ref()) Can I use the udict_get_next function for iteration? Because the function returns a slice, and there's no function with cell output.  If I can, will I get a slice of my cell or should I extract my cell out of this slice?

Aydin: Not sure if I understood your intent properly, but I guess it is better to work with slices for iteration in general. You can easily convert cells to slices with .begin_parse() (reply to 61661)

Behrang: You need to migrate your data. Check here for an example of how to do it:  https://github.com/HipoFinance/contract/blob/ce0cff85a25964d71094c88d89989b8918a4fb3b/contracts/treasury.fc#L1705 (reply to 61656)

🅰🅻🅰🅽: Thanks for sharing. If I have misunderstood anything, please do not hesitate to point out my mistakes, as this will help me improve my understanding 🙂 (reply to 61666)

Xio: If any good dev with smart contract experience on ton cam help me out I'll pay

Xio: I locked my liquidity on ton raffles but due to data providers issue their web ain't showing lock but the liquid is locked

Xio: Their Whitepaper says ur fund are secured cause its on Blockchain and can be interacted anytime

Xio: I looked chat gpt etc info they said use ton cli or ton sdk to manually unlock

Xio: If anyone can do this let me know

Xio: Ten Ton pay

⁮ ⁮ demure: How can I change the input words?

Aydin: Mnemonic?! (reply to 61680)

⁮ ⁮ demure: Yes, I am protected. I want to change it so that no one can enter (reply to 61681)

⁮ ⁮ demure: The backup is in someone else's hands and I want to change it (reply to 61681)

Aydin: Every single wallet contract is identifiable with a unique set of mnemonics. So, you cannot change them for your existing contract.   For your problem, I would suggest a simple remedy: just create another wallet, which will give you a new set of secret words. Then, transfer your funds from the old wallet to the new one. (reply to 61684)

Xio: @everyone (reply to 61677)

Mikko: I am trying to create a wallet programmatically, but when I import it to other Ton wallet apps, it generates a different address. I am using TonConnectUI wallet v4 address method. Here is the question and Javascript code:   https://stackoverflow.com/questions/78503998/created-wallet-v4-address-does-not-match-tonconnectui-vs-tonkeeper  Any ideas what could be wrong?

Xio: Anyone have info kindly contact (reply to 61673)

Sina: is it possible to call a function (method_id) of contract from my contract ?

Crypto: GM guys so I sent a Jetton token from ton keeper to wallet on telegram how do I get it out?

Sina: How much storage space does each contract have?

Crypto: Any help ? (reply to 61776)

User<1463408356>: Hey why is TON transfer not working? It shows that the transactions is done, no error but i dont receive any funds in my wallet  const HandlerKeyPair = await tonMnemonic.mnemonicToKeyPair(process.env.HANDLER_MNEMONIC!.split(" ")); const handlerWallet = new TonWeb.Wallets.all.v4R2(provider, {     publicKey: HandlerKeyPair.publicKey,     wc: 0 }); const receiverAddress = new TonWeb.utils.Address(receiver).toString(false, false, false)  const d = await handlerWallet.methods.transfer({                 secretKey: HandlerKeyPair.secretKey,                 toAddress: receiverAddress,                 amount: Math.floor(item.balance - fee),                 seqno: seqno,                 sendMode: 3,             }).send();             console.log(d)  console output { '@type': 'ok',  '@extra': '1716161050.7840202:11:0.28615696760205944'  }

Crypto: Yeah that's the same experience I'm having (reply to 61779)

Crypto: And when I looked online they said it's only TON space that accepts jettons I'm confused here

User<1463408356>: whats your code?

Crypto: I'm actually looking for someone to write a code or do something to get it out I'm not the token Dev just a holder (reply to 61782)

User<1463408356>: why would u need code to transfer tons from telegram wallet wtf

User<1463408356>: open your telegram wallet or import it add some ton's for fees and send it back

Crypto: How do I import it brr it's not on TON space but on th wallet (reply to 61785)

Crypto: You have a way out ?

User<1463408356>: it doesnt matter, it should be there unless you send it to wrong wallet version address

Crypto: Nah man hold on I would send the wallet Addy here for you scan and see the token but it's not reflecting in wallet (reply to 61788)

User<1463408356>: sure

Crypto: UQC8I02k69ZHyNex2ifQGECNOxma4VjUdzTkv3nmG7w7zUC4

User<1463408356>: you sent tokens from it, or to it

Crypto: To it (reply to 61794)

User<1463408356>: i see you have sent some tokens from it few days ago so whats the issue, so you shouldve access to it

Crypto: It's not showing up in the main interface

Crypto: It's a Jetton

User<1463408356>: ah omg telegram wallet doesnt support all jettons

User<1463408356>: you need to import your secret phrase to different wallet and it will be there, however remember that your wallet version is v3r1 so use it

User<1463408356>: use openmask or tonkeeper (but tonkeeper doesnt have version change support, so openmask is better for that specific case)

User<1463408356>: lemme now resend my question, you should be fine  Hey why is TON transfer not working? It shows that the transactions is done, no error but i dont receive any funds in my wallet  const HandlerKeyPair = await tonMnemonic.mnemonicToKeyPair(process.env.HANDLER_MNEMONIC!.split(" ")); const handlerWallet = new TonWeb.Wallets.all.v4R2(provider, {     publicKey: HandlerKeyPair.publicKey,     wc: 0 }); const receiverAddress = new TonWeb.utils.Address(receiver).toString(false, false, false)  const d = await handlerWallet.methods.transfer({                 secretKey: HandlerKeyPair.secretKey,                 toAddress: receiverAddress,                 amount: Math.floor(item.balance - fee),                 seqno: seqno,                 sendMode: 3,             }).send();             console.log(d)  console output { '@type': 'ok',  '@extra': '1716161050.7840202:11:0.28615696760205944'  }

Crypto: I don't even know where to find the secret key on tg wallet I've looked all day (reply to 61803)

Crypto: I think the network is congested that's why mate (reply to 61806)

Crypto: @shzvc brr you're there?

User<1463408356>: click here and you got recovery phrase

User<1463408356>: it took me 7 seconds

Crypto: Not for ton space (reply to 61811)

Crypto: I'm talking about wallet on tg

User<1463408356>: it's the same you wont get two different secret phrases on one wallet

Crypto: This (reply to 61818)

Crypto: This tokens are on this first wallet but not displaying so you mean both this and ton space have the same secret key??

— 2024-05-20 —

Николай: How to start a auction for expired domain?

Matthew: hi all, how to approve a smart contract to get jetton tokens from a wallet

&rey: You can't do so. (reply to 61830)

&rey: No, those keys are not same. @wallet doesn't give keys of its accounts to users, neither does it support most jettons. You may try reaching out to their support, but I have yet to see at least one case of returned jettons. (reply to 61822)

Matthew: i want create bridge jetton token to evn chain, the best sollution? (reply to 61833)

&rey: I don't think you need to process jettons in smart contract in any way; I would expect a simple multisig wallet on this side. (Not the recent version with sharded orders, of course, because that's a bit slow.) (reply to 61835)

Tim: Hi, I try to get a list of accounts' pending messages in Mempool by tonapi's Streaming API. But why do I found that I only got less than half of the messages?

Xio: Can anyone do this? (reply to 61673)

&rey: Because you get only messages sent via Tonkeeper, I believe. (reply to 61838)

Tim: Why is this happening? Only messages that sent via Tonkeeper would be found in Mempool? (reply to 61840)

&rey: Because tonapi is the blockchain provider for Tonkeeper. (reply to 61841)

Johan: Can I fetch out data about jettons using somehow hash of swap transaction? (reply to 26261)

Vatshayan: HI for Jetton ton :         const data = await jettonWallet.getData(); and const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(hotWalletAddress);  This two not getting data as error we are getting : 1. method not allowed  else 2. Int parse   why I am getting this or is there is issue from ton jetton ?

Vatshayan: not able to get methods

Vatshayan: can we get this from RPC or we will get from jettonWallet only ?

User<7123272744>: Looking for a FunC developer urgently.

&rey: You have a higher probability of problem solved if you provide addresses of contracts whose get-methods fail. (reply to 61857)

JORDAN: 🤑🤑Hello TON Blockchain Developers,  I'm Jordan, and I'm the Community Development Representative for SnakeTON. We are actively seeking TON Blockchain developers to collaborate on enhancing the SnakeTON project. Below is detailed information about our project. We invite you to join us and explore the exciting opportunities in the SnakeTON game.  Feel free to reach out for a more in-depth discussion or any queries you might have.  Looking forward to your participation! ==========   🎮Play Game: SnakeTON Bot

JORDAN: 🏆SnakeTON - The leading Survival GameFi platform on the Telegram and TON Blockchain.       ⭐️SnakeTON is an exciting survival Web3 GameFi built on the TON Blockchain platform, accessible directly within your Telegram app. Navigate your snake, master survival, and compete for rewards in exciting PvE and PvP battles.       ⭐️ SnakeTON stands out with its real-time PvP combat, available on the Telegram app for both mobile and PC. The PvE mode offers 'Play to Airdrop' opportunities, and players can passively 'mine' tokens and mint valuable NFTs through Snake Eggs.  🎮Play Game: SnakeTON Bot 🧩TON App: Play on TON App       🎯SnakeTON is more than a game; it's a powerful investment opportunity with strong growth potential, leveraging Telegram and TON Blockchain in the GameFi sector.  ====================

User<7123272744>: I tried to deploy this airdrop system to testnet and mainnet from last saturday. But every time failed. Could you try to deploy it to testnet or custom RPC? (reply to 61598)

Vatshayan: kQCvKRnHgdBefVPtC1qlfUFaG4q3Y9hI8Wcdab4O7AcP69du (reply to 61863)

Vatshayan: @pcrafter

Vatshayan: same for this (reply to 61646)

Dmitry | backend4you.ton: testnet. are you sure your code actually calls testnet too (not mainnet)? usually SDKs do NOT switch automatically. (reply to 61871)

Think: Tell me the projects please  I can sort this (reply to 61490)

Think: Site not safe to collect £5.000 ton

kevin: it is not possible to call another contract, but you can send a message to ston.fi dex (reply to 61879)

Dapster: Hi guys. Is there any way to check the wallet address for validity? To know for sure that such an address really exists?

Crypto: Omg it's well (reply to 61834)

totty: hi,  tonConnectUI.setConnectRequestParameters({state: 'ready', value}); doesnt add tonProof.proof

totty: value is payload, my example payload "4d5a03043cc97cdf00000000665d5746"

&rey: You can check its state, if there is anything deployed. (reply to 61890)

totty: const refreshPayload = async () => {                 tonConnectUI.setConnectRequestParameters({ state: 'loading' });                  const response = await axios.get("http://localhost:3000/auth/getPayload", {                     params: { ttl: payloadTTLMS }                  });                  console.log(response)                          const value = response.data.payload;                   if (!value) {                     tonConnectUI.setConnectRequestParameters(null);                 } else {                     tonConnectUI.setConnectRequestParameters({state: 'ready', value: value});                 }                 console.log(tonConnectUI)             }              refreshPayload();             setInterval(refreshPayload, payloadTTLMS);             return;

totty: @Get('getPayload')   getPayload(@Query('ttl') ttl: string): { payload: string } {     const ttlInt = parseInt(ttl, 10);     if (isNaN(ttlInt)) {       throw new Error('Invalid TTL');     }     const payload = this.authService.generatePayload(ttlInt);     return { payload };   }

&rey: That should come from wallet app, actually. (reply to 61895)

totty: okej, how can i get this?

totty: i have used ton docs

totty: ton-connect sign

Speculator: {   transactions(address_friendly: "UQAPj7r35QRfb3VpRX8nkvNsSsO1w8UJSPyD94YHzJKkIRTA"){     gen_utime     lt     account_storage_balance_grams     in_msg_op_code     out_msg_count     out_msg_body   } }  How can i get data of multiple address in one query?

aloshy.🅰🅸: Hi everyone. Is there any Dex Code Reference in Tact?

Speculator: i am using dton (reply to 61912)

Andrey: You can set several functions per one call:  {   t1: transactions(address_friendly: "UQAPj7r35QRfb3VpRX8nkvNsSsO1w8UJSPyD94YHzJKkIRTA"){     gen_utime     lt     account_storage_balance_grams     in_msg_op_code     out_msg_count     out_msg_body   } t2: transactions(address_friendly: "UQAPj7r35QRfb3VpRX8nkvNsSsO1w8UJSPyD94YHzJKkIRTA"){     gen_utime     lt     account_storage_balance_grams     in_msg_op_code     out_msg_count     out_msg_body   } …. } (reply to 61912)

Andrey: Also we have comfy @dtontech group where we try to help devs of our products. (reply to 61912)

zz: hello what circumstances will ton bounce?

Speculator: is there issue from tonapi side or i am doing any mistake

Rand: everything is lagging right now (reply to 61919)

Vatshayan: 2024-05-20 14:40:38.382 | ERROR    | pyTON.manager:check_children_alive:232 - TonlibWorker #011 is dead!!! Exit code: 12

Vatshayan: Getting issue in running ton-http-api on local ubuntu

mnemotiv: hello, is it possible to create gasless jetton contract? if yes - any examples?

Simone: Guys, I am just trying to see if I can connect to the mempool, but I keep getting: error 403: Forbidden. Am i doing something wrong? I've just upgraded to a plan where I should get access to the mempool

Speculator: How can i filter transaction by swap, transfer, nft transactions.

Behrang: 1. The bounce flag of incoming message is set.  2. An exception happens somewhere while executing the transaction, or in executing an action while flag 16 is set. (reply to 61917)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 52 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 35  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Batyr: Hello guys, who knows where from I can import these red functions? This is from nft-collection.fc conract

Batyr: Also, admins pls unban me from ru chat. I asked the same question but attached github link to nft-collection.fc source code

Behrang: Import nft/op-codes.fc (reply to 61935)

Behrang: And ft/params.fc

Batyr: Thank you so much. Do you know where I can find parse_std_addr? (reply to 61940)

gavin: Hey, maybe  you should refer to this https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection.fc (reply to 61941)

Batyr: Yes, exactly this contract (reply to 61942)

Batyr: I don’t know why I was instantly autobanned in ru chat after attachink this link

Batyr: Just in case didn’t send here

gavin: #include "stdlib.fc";

gavin: This code is compiled manually and actually refers to stdlib.fc (reply to 61941)

Batyr: same (reply to 61946)

Batyr: ah, sorry, my bad  #include "../imports/stdlib.fc";  fixed

Batyr: Compiled well, thank you sirs

Max: Hi we receive frequently  {     "ok": false,     "error": "No working liteservers with ls_index=None, archival=None",     "code": 503 } On working via Orbs jrpc from client side of Web3 app. Does anybody face the same issue? What apikeyless thing is reasonable to use instead of Orbs?

&rey: Try Tonhub. This error is for testnet, right? (reply to 61957)

Max: This is on Ton mainnet. https://ton.access.orbs.network/<something>/1/mainnet/toncenter-api-v2/jsonRPC (reply to 61958)

Usama: How can i see the error on ton testnet explore i cant see the reason of transaction failure or logs

Usama: any help would be highly appreciated

Vatshayan: how old transaction can ton liteserver, key, API or tonweb can fetch ?

Johan: Can you suggest please.... How can I decode all fields of Body message of all types of messages of transaction?  Internal, external and other remained types (reply to 61958)

Johan: I have done with decoding some fields like op_code and and sum_type

Johan: Can I send here one of the examples as code?

Tomass: Hello guys, I have a two questions about Airdrop by gusarich, maybe some one know what the address need use in this string: const jettonMinterAddress = Address.parse('EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw');  (now here address from readme file.)  And why when I try to deploy contract i receive this error

Johan: it cut off..... goddamn

Johan: https://pastebin.com/bw957g9m (reply to 61958)

Johan: It's swap transaction, but it can't properly fetch token_wallet value as tonviewer.com does that

Johan: Did here anyone have experience in decoding and fetching data from full nodes of TON??

kevin: trying to decode from ston.fi ? (reply to 61990)

[BOT-TL]: Let me know bro if you figure out this, been struggling already days with it 😂 (reply to 61989)

Johan: If I could fetch additional info from stonfi APIs using hash??? I have written already function, which fetches for me full data about Jetton (reply to 61991)

Johan: but I need to decode token_wallet field here for example: https://tonviewer.com/transaction/30882f23e3fdf5564968534f7ce6544d761228b2a14a5d2e6c5b23c7c0306c25

[BOT-TL]: I was just wondering, that when the int_msg have transaction hash, I think the int_msg tx need to be decoded too

kevin: if you want full metadata from ston.fi you have to using other indexer service like tonapi.io or anton.

Johan: token_wallet field is address of Jetton actually

[BOT-TL]: U could use tonconsole /traces API point but it costs (reply to 61994)

Johan: brother, I don't want to use TonApi..... its slow and I had to pay for it for normal speed of fetching data and you have to pay for rapid work (reply to 61996)

Johan: IF someone could help me, I can give free access to my full node.....

[BOT-TL]: Can you send me dm? I have the same problem hahah

Johan: It's bizarre that I should connect to TonApi additionally to fetch just a little bit more info about transaction..... But I hadn't chosen easy way :D

kevin: dm me if someone want decode from ston.fi, just finish one.

Johan: Yes (reply to 61998)

Johan: I don't want to pay for TonAPI, its much more faster to work with full node

MA: hello guys

Johan: I have already done with that, I have decoded op_code, sum_type fields (reply to 61995)

MA: I have a contract and it should do something when receive a jetton  for this purpose I write this code   if (op == op::transfer_notification) { ;; 0x7362d09c         cell state_init = calculate_jetton_wallet_state_init(my_address(), storage::jetton_master_address, storage::jetton_wallet_code);         slice jetton_wallet_address = calculate_jetton_wallet_address(state_init);         throw_unless(error::unauthorized, equal_slices_bits(sender_address, jetton_wallet_address));                  int query_id = in_msg_body~load_uint(64);         int amount = in_msg_body~load_coins();         slice from_address = in_msg_body~load_msg_addr();          if (             storage::status &              (storage::current_round_start_time + storage::round_duration) < now()){                              if (storage::users_count < storage::max_users_per_round) {                 add_user_in_round(amount, from_address);             } else {                 if (msg_value > 15000000) {                     send_jetton_to_address(query_id, amount, from_address);                 }                 throw(error::max_user);               }          } else {                          if (msg_value > 15000000) {                 send_jetton_to_address(query_id, amount, from_address);             }              throw(error::deactive_round);            }         return ();     } but in the transaction in jetton notify it will failed without exitcode.  what is wrong with the contract code? (reply to 62007)

kevin: anton is good replacement, but you have to pay the VPS (reply to 62006)

Johan: I have already running full node on my dedicated server (reply to 62012)

Gleb: hi, is it possible to get walletId from a wallet address and/or public key? wallet_v4r2 if that matters

aloshy.🅰🅸: That's true. I sent jUSDT from Bridge to the wallet and it's stuck there. Can't move! (reply to 61834)

[BOT-TL]: Okay, can you decode the target OPCODE int_msg transaction hash? (reply to 62010)

[BOT-TL]: And then decode the taken internal_msg tx alone

kevin: but you don't have indexer, right?  you can get jetton metadata by running "get" method multiple times, but it is better to have indexer work for you . (reply to 62013)

[BOT-TL]: Idk, that's how I figured out it how it could work

Vitor: If you're willing to run a full node, you can fork ton-indexer, add the TL-B schema to ston.fi transactions and build a queriable database from that. It's essentially (reply to 62006)

Johan: does that make sense for you??: https://pastebin.com/dRgXxB8N (reply to 62017)

Johan: Its one of the thousands of transactions that I can fetch rapidly

Johan: Hmm (reply to 62021)

Johan: I have used tonutils-go lib (reply to 62020)

Johan: to make that easier to me

Johan: Hmm, okay (reply to 62019)

[BOT-TL]: Yeah this makes sense and this is the point where I start struggling too :D I don't know where are these values (reply to 62022)

Johan: I'm crying, it's hard to fetch all fields from blockchain I wanted.... 🥲🥲 (reply to 62032)

kevin: My experience is to cross reference with the contract code . (reply to 62032)

Johan: But I never surrender, just continue

&rey: Please try to write single but longer messages. (reply to 62031)

&rey: From blockchain only; walletId is independent of key, and address is hash. (reply to 62014)

Gleb: Could you please suggest, how? (reply to 62038)

User<1463408356>: Hey why is TON transfer nor jetton transfer not working? It shows that the transactions is done, no error but i dont receive any funds in my wallet  const HandlerKeyPair = await tonMnemonic.mnemonicToKeyPair(process.env.HANDLER_MNEMONIC!.split(" ")); const handlerWallet = new TonWeb.Wallets.all.v4R2(provider, {     publicKey: HandlerKeyPair.publicKey,     wc: 0 }); const receiverAddress = new TonWeb.utils.Address(receiver).toString(false, false, false)  const d = await handlerWallet.methods.transfer({                 secretKey: HandlerKeyPair.secretKey,                 toAddress: receiverAddress,                 amount: Math.floor(item.balance - fee),                 seqno: seqno,                 sendMode: 3,             }).send();             console.log(d)  console output { '@type': 'ok',  '@extra': '1716161050.7840202:11:0.28615696760205944'  }

&rey: Does balance of "handlerWallet" decrease? (reply to 62040)

User<1463408356>: yeah

&rey: Please check that amount is in nanoTON.

User<1463408356>: ah you meant handlerWallet, no it does not sorry misunderstood

&rey: OK. Then, your external message might've been lost. (reply to 62045)

User<1463408356>: what can i do about that?

&rey: Generally, you can retry sending with the same seqno until balance decreases. This is safe from double-spending.

Johan: I have started the setup process of indexer, can you help a little bit with suggestions if I get struggled with? (reply to 62046)

&rey: I believe you're trying to parse each transaction into readable data? I shall note that some transactions don't have TL-B available so you won't be able to parse/label them appropriately. (reply to 62050)

Johan: Yes, you're right (reply to 62052)

Johan: Ok buddy (reply to 62052)

Johan: I will try to do something with indexer 🥲

kevin: for indexer I would highly recommend https://github.com/tonindexer/anton

Johan: Is that ok if it outputs some strange errors after running linter? (reply to 62056)

Johan: I have tried, but deleted several hours ago

Johan: Didn't complete installation

MA: anybody know about this issue ? (reply to 62011)

Cube: Good evening everyone. I am looking for a UX UI designer to jointly develop my project for Open League (Social track). Pls dm me

Johan: I give free access to my full node of Ton, if anyone could help me with my code written in Go

feng: After obtaining the boc string, how to obtain the op code in the cell data?

feng: Is there a demo that I can refer to?

Johan: I can send later my peace of code, which retrieves op_code from tx if you want, it's written in go (reply to 62068)

feng: it is what i want, thanks a lot

User<6995531243>: Does anyone looking for a senior frontend and ton developer?

Johan: If you can also work with full nodes, you are welcome 😁 (reply to 62072)

发财: dm (reply to 62072)

User<6995531243>: I can't dm you, Can you dm me pls (reply to 62075)

Тимур: 📢 Hi, we are inviting developers for a project to create a transaction fulfillment system.  The project includes: writing a smart contract (FunC/Fift), developing scripts (Java/Type Script), writing tests (Jest).   Project details in PM

aloshy.🅰🅸: Hey guys, this is Aloshy. I'm a EVM Full Stack Developer, testing waters in TON space. I can see most (if not all) of the projects are using FunC. Personally, I find it easier to get sense of Tact, being from JS/TS world. I was wondering if there's any team who are actively building on Tact. If not, why? Should I stick to FunC itself for better community support?

D K: Can someone guide me on how to verify my tokens on Tonkeeper wallet? please, thank u so much. i am newbie

Vatshayan: Do ton have native jettons token

Vatshayan: ?

Johan: Where is the creator of Anton Indexer??

Johan: The guide from his repo is not working... Goddamn Anton

&rey: Other wallets should work better I think. (reply to 62092)

v: slice destination = in_msg_body~load_msg_addr();          slice to_destination = in_msg_body~load_msg_addr();          int jetton_amount = in_msg_body~load_coins();          int forward_ton_amount = in_msg_body~load_coins();          slice either_forward_payload = in_msg_body;          cell msg = begin_cell()              .store_uint(0x18, 32)              .store_slice(destination)              .store_coins(0)              .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)              .store_ref(begin_cell()                  .store_uint(op::internal_transfer(), 32)                  .store_uint(query_id, 64)                  .store_coins(jetton_amount)                  .store_slice(to_destination)                  .store_slice(sender_address)                  .store_coins(forward_ton_amount)                  .store_slice(either_forward_payload)                  .end_cell())              .end_cell();           I write like this, why can’t the tokens be transferred?

&rey: Native? No. At least, not one a simple user could use. (reply to 62086)

&rey: 1. You should use op::transfer(); 2. You store message incorrectly. .store_uint(0x18, 6) and .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). (reply to 62099)

Moose: Hi, who needs a full stack TON developer?

v: ok let me try (reply to 62101)

Memes Mask: i using lib TON Connect JS SDK,When I called sendtransaction the wallet was opened and when I confirmed I got this error.😭

&rey: Have you read through @tonhunt? (reply to 62102)

&rey: Once again I say, other wallets should work better. (reply to 62104)

TONGOKU BD: Hello

TONGOKU BD: How to join TON society and ToL (reply to 60845)

Johan: Does Anton indexer set up new node?? Or why it compiles for me ton (reply to 62056)

Memes Mask: Tonkeeper and other also not works (reply to 62107)

Batyr: How to get correct wallet address?      const walletContract = WalletContractV4.create({workchain: 0, publicKey: provider.sender().address!.toStringBuffer()})     const wallet = provider.open(walletContract)      console.log(wallet.address)     console.log(await wallet.getSeqno())  Output: Connected to wallet at address: EQB3qktPYYFrQcNW2_ZWBL_3IBQybfhwX9ZQt09gmUfC6Yik EQDl-dSlAbhMLZ638UndFg6Flw_Ne1BJvYx0WxcoWas-nSSA 0

&rey: Address is not a public key. (reply to 62115)

&rey: Also, WalletContractV4 is not v4r2.

Batyr: Any way to obtain that? (reply to 62116)

Batyr: I connect through tonkeeper via qr code

Vadim: Hey guys , maybe someone can help ? I need last library’s to integrate flatter to telegram… appreciate 🙏

&rey: Why do you need wallet contract? (reply to 62118)

Batyr: Or maybe there is easier way to get seqno? Or to ensure that tx was arrived

Batyr: only for this: wallet.getSeqno() (reply to 62121)

v: Still doesn't seem to work (reply to 62101)

&rey: I believe the first message may have insufficient TON to forward. (reply to 62124)

&rey: Hm, what's that provider? I don't think TON Connect offers one.. (reply to 62115)

Batyr: Its from blueprint  import { NetworkProvider } from "@ton/blueprint"; (reply to 62126)

v: Why does send token not point to the address? (reply to 62125)

&rey: (await provider.api().runMethod(     provider.address(),     "get_seqno",     [] )).stack.readNumber() (reply to 62127)

&rey: Have you taken message structure from TEP-74? (reply to 62099)

Batyr: not sure what kind of number is needed (reply to 62130)

Batyr: function runMethod(     arg0: number & Address,     arg1: Address & string,     arg2: string & TupleItem[],     args?: TupleItem[] | undefined): Promise<{exitCode: number, ... 4 more ..., reader: TupleReader}> | Promise<...>

&rey: Oh. You need to cast provider.api() to TonClient, removing TonClient4.

Batyr:     const client = new TonClient({endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC"});     const seqno = (await client.runMethod(         provider.sender().address!,         "get_seqno",         []     )).stack.readNumber()  Got error: Connected to wallet at address: EQB3qktPYYFrQcNW2_ZWBL_3IBQybfhwX9ZQt09gmUfC6Yik Error: Unable to execute get method. Got exit_code: 11 (reply to 62135)

Vatshayan: Hy why ton jetton doesnt give proper response on testnet or not even work as transfer function properly with testnet API

&rey: runMethod(..., "seqno", []) maybe will work? (reply to 62136)

Batyr: Thank you, that helped (reply to 62139)

&rey: Are you creating transfers in a way that conforms to TEP-74? (reply to 62138)

Vatshayan: yes

Vatshayan: jetton contract and minter doesnt give proper response to testnet

Vatshayan: and transfer function dosen't work properly

User<7121766667>: Hello, folks. How to integrate dedust swap with tonkeeper ui?

Zachary: Hey guys is there any api on ton that provide jetton's circulating supply / total supply

&rey: Total supply? You need to call get-method on jetton master contract. (reply to 62152)

&rey: The harder task you may want then is getting "price" of jetton. One of problems is whether said price exists.

Johan: I have a question, is that address is ordinary wallet of user? Not any contract of something public?: Contract type is empty

&rey: Probably a special contract. (reply to 62155)

Johan: ok (reply to 62157)

Zachary: I mean, the Coingecko team is requesting for an api endpoint which provides information about the circulating / total supply for them to track (reply to 62153)

User<7095146211>: I would like to apply as  a blockchain & full stack developer.

User<7095146211>: please contact me if you need a developer.

Zachary: Could someone help? (reply to 62159)

Johan: Its true that holder can create infinite amount of coins? Like here guy: https://tonviewer.com/EQDMOvykNUyhLuY6qm6VFR-U193pHEV3H-XL8YfJ4agYLdVY?section=tokens (reply to 62157)

&rey: Token admin, for simple tokens, can mint arbitrary amount. (reply to 62164)

Johan: Ok, and of his projects is:

Johan: Actually SwapExternal type of transactions are sending from supply to address needed amount of coins?

Kryptonite: what is burn address?

&rey: An address which is thought inaccessible, because there will likely be no wallet-compatible state/keypair found. (reply to 62168)

Kryptonite: yeah i know that, but which is valid burn address

Kryptonite: UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ  i am looking at this address on tonviewer

Kryptonite: and it says 2 years 9 months , time to unlock

Kryptonite: so im doubtful

&rey: Getgems offers two: https://getgems.helpscoutdocs.com/article/17-do-you-have-an-address-to-burn-nfts.  Please note that you can burn most jettons via native functionality, and address for true-burning TON is different as well. (reply to 62172)

&rey: It got frozen along with inactive miners' wallets. (reply to 62173)

Kryptonite: but is it going to be unlocked after that period (reply to 62176)

&rey: Unlocked, yes, but still no one will have valid state or wallet keypair for it. (reply to 62177)

Kryptonite: can we burn LP or renounce ownership to this burn  address

Baron: If you need help developing smart contracts and multi-senders  I am a developer and have sufficient qualifications

Johan: Seems I finally come up with idea how to decode needed fields....

User<7121766667>: Hello, folks. How to implement token swap on dedust by using wallet connection?

Mikko: Is there a good summary and timeline for Wallet v5 on when it is "happening"?

&rey: It... quietly has been added to explorers and Tonkeeper. (reply to 62186)

Tobias: Hello

Tobias: does anybody know why this isn't working??

Mikko: Usually things are not working because not enough cursing and banging keyboard with fits. These always help. (reply to 62195)

Tobias: No

Tobias: Something else

&rey: Reading whitepapers, perhaps? (reply to 62204)

Dri: Hi everybody, is there a documentation for NFT mint and reveal later? How can i update the image of a NFT item after i have mint it?

Johan: Hey buddy again, can you help, is that even possible fully decrypt the raw body here? Because tonviewer somehow does that or maybe not tonviewer but I could find or haven't recognized yet which encoding, encryption.... (reply to 62208)

Johan: Because the same raw body I'm getting in my huge json object, but I could only decrypt op_code with sum_type....

Anarion: How to update the jetton icon? I re-uploaded the image, but the old one remained online. token address: EQALJeE8gyQknpGzpd54Ag2_iLaUOQ_NxA0nYbShpNaKNOUV

Jim: Hi guys

Jim: If you are looking for blockchain , Ai , Web or App developers , Kindly let me know

Hustle: Is there a mass airdrop tool on ton yet.

к.: Hello guys, I've just made a new TEP which aims to improve TON to be more lightweight and scalable.  I will be happy to have your discussion and opinions on this TEP.  Here is the pull request link:  https://github.com/ton-blockchain/TEPs/pull/154

Vladyslav: Hi! it may be an off-top question But i don't know where else i can go.  My setup is: Fedora, telegram-5.0.1 I am developing a mini-app for my project and I need to copy-paste some data from webView of the app, but the text is being saved to clipboard only inside of the webView How can I export the data from it? Any info would be helpful, thanks.

Easycall: yo bro, happy to see so many ppl here 🥹

Easycall: i need to study more about smart contract on ton, I started on bnb smart chain some years ago. where can i learn something more deep? some usefull link? thank you very much, im just a selflearner

Jim: dm me (reply to 62245)

Baron: He won't pay you and will just disappear (reply to 62246)

Baron: That's what he did to me

Baron: more than 20 people, where 5 of them are regular customers and will confirm the opposite

Baron: It was not me who violated the terms of the contract 😂 (reply to 62264)

Adam: you can make it yourself (reply to 62231)

Adam: it's not that hard to code an airdrop tool

Adapt: func, when parsing smart contract storage data with  get_data().begin_parse()  how to parse optional ref? the ds~load_maybe_ref() throws call underflow. What's the proper way to store optional ref data? Sometimes in data store there will be ref with cell, sometimes nothing / empty cell. How to store this empty cell so the load data will work regardless there is some data or just empty cell / no data?

agile_ape: Gm all. I’m writing a tg bot using tonconnect js. How can I read my smart contract variable and display to users?

agile_ape: https://docs.ton.org/develop/dapps/ton-connect/web - been referencing this but it does not have any links. Shows you how to send a txn but how to read?

— 2024-05-21 —

Anarion: Admins. Please unban me in Russian chat.

Gyorgy: From experience, its auto expired for me in few days. Shared a link from ton .org website to help someone and got removed from a group previously. Learned my lesson that no links/tags in some popular groups. But was able to join back few days later.  In short: Try again to Join back in a few days. Unless you got manual ban, that’s probably permanent. (reply to 62288)

ecomnazar: hi, how to transfer USDT with ton-connect?  here is only ton transaction https://docs.ton.org/develop/dapps/ton-connect/message-builders

&rey: Do you know how jettons are transferred in general? (reply to 62299)

&rey: docs.ton.org is the documentation root. You should also read whitepapers and be ready to forget a fair bit of EVM. (reply to 62244)

feng: I passed in the specific 'account' parameters. This account had multiple transactions during the monitoring period, but I did not get any push messages.

feng: 🤔 Why?

Anarion: I already tried. This was my first day in the chat and in the TON ecosystem in general. I experienced problems and was ignored by technical support for two days, I didn’t know what to do (it was a day off), a kind person answered me, then we had a long, verbose, intimate conversation and I finally managed to mint the token. But the next day, which was a working day, a ban arrived (reply to 62292)

Anarion: I need help about the question above, what needs to be sent to the contract in order for the token icon to be updated?

User<6121464399>: how can I pay the commission without using toncoin? for example I want to send notcoin or another token like usdt I can pay Jetton commission but how

&rey: Because you'll actually get only external messages to that contract. (reply to 62309)

Black Angel: This is Steve. I've sent dm, plz check. Thanks (reply to 62320)

ecomnazar: not really, help pls if you can do transactions with usdt balance, not TON (reply to 62303)

ecomnazar: with TON it is so easy, but USDT it turns out to be difficult

&rey: The transfer is still represented by TON-carrying messages. You should look into TEP-74 for full explanation. (reply to 62327)

ecomnazar: then there will be show TON or USDT ? (reply to 62332)

Fast is slow: hi

Frankovitz: Hi guys, I'm making simple Dapp for Telegram with TON Connect, and I got a problem with walletbot cannot access a 'tonconnect-manifest.json' from origin 'walletbot(dot)me' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Please tell me how to fix it or at least point me in the right direction :)

Rio: hi guys

Rio: i don't know how to check Tx success or failse by Hash, any one know how to do it, pls help me

Dri: i don’t think it’s a ton error but CORS is for connection. I don’t know your setup but you have to allow the connection from your frontend. Take a look: https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9 (reply to 62335)

Frankovitz: Thanks, will check it out! (reply to 62338)

AZ Lavenda: Hey is anybody here building mini game app with python?

AZ Lavenda: Lack of developing infos compare with other langs, it would be really great to get info of some docs link or something 🥹👍

Rio: let's replace 'tonconnect-manifest.json' by your website url manifest.json i think it's working (reply to 62335)

Frankovitz: How it will help? (reply to 62342)

Rio: tonconnect need your_url_manifest.json to know "what" is connecting

VoyTech: Any suggested hints for debugging? I'm working with Tact and the simulator is very tough to work with, no idea why some messages are missing or not delivered. Any better solutions for testing?

Jim: dm me (reply to 61861)

Jim: kindly let me know what you are going to implement (reply to 61783)

ecomnazar: can anyone help with jetton transfer or show example

Shuta: Hi. I am currently working on a new project in Tact. I understand that the QueryID manages the sequence, but how exactly is it used? What impact will there be if the QueryID is not set?

Daniil: Hi, I have a master contract that deploys new contracts and assigns a seqno to its init, In my client code I'm sending a transaction to deploy a new contract and checking to seqno change to confirm the transaction, then I want get seqno of new contract to work with it in future, so I'm curious what if two users will send transactions at the same time, will there be seqno concurrency and how to deal with it?

Milad: Hi everyone.What is the funC version of wallet contract v4??

&rey: V4r2? https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc. (reply to 62367)

&rey: Each message is processed atomically so deploys will have different seqnos. IIRC, ordered by request's creation LT. (reply to 62362)

&rey: QueryID doesn't manage anything. It can only be used to optimize indexers implementations, looking up all transactions downstream of a specified one. (reply to 62359)

Daniil:       const seqno = await contract.getContractSeqno()        await contract.send(sender, {         value: toNano("0.05")       }, 'create contract')        let currentSeqno = seqno;       while (currentSeqno == seqno) {         console.log("waiting for transaction to confirm...");         await sleep(1500);         currentSeqno = await contract.getContractSeqno();       }       console.log("transaction confirmed!", currentSeqno);      contracts: Int as uint256 = 0;      receive("deploy contract") {         self.contracts = self.contracts + 1;         let sender: Address = sender();         let init: StateInit = initOf Contract(sender, self.contracts);          send(SendParameters{             to: contractAddress(init),             value: ton("0.3"),             mode: SendIgnoreErrors,             code: init.code,             data: init.data,         });          self.reply(NewContractResponse{             seqno: self.contracts,             address: contractAddress(init)         }.toCell());     }  what if two users clicked the button and initiated transaction at the same time, and the one who clicked later confirmed a transaction faster than the one who clicked first, wouldn't it mix the seqnos? (reply to 62372)

Daniil: I mean wouldn't seqnos be mixed between those users on client side?

wikig: Hello guys , is there any gourp chat bot for tokens in TON now ?

User<7192644220>: hi, peeps. how do I change TonKeeper wallet to use the TestNet for development purposes?

Maksym: Куда поступил мой перевод?

Maksym: EQD5mxRgCuRNLxKxeOjG6r14iSroLF5FtomPnet-sgP5xNJb

Vardan: Dear Developers, I'm looking for a TonCoin WooCommerce plugin. Can anyone suggest one or provide some guidance? Thx

Maxey: If I want to charge users a storage fee, what duration should I use for the calculation to be reasonable?

Anarion: I still waiting, does somebody know an answer?

Anarion: How to update token icon? I re-uploaded the image, but the old one remained online. token address: EQALJeE8gyQknpGzpd54Ag2_iLaUOQ_NxA0nYbShpNaKNOUV

Nerses: hi everyone. how can I do internal transactions already deployed smart contract (testnet)  ?

&rey: They would, indeed. You can use client's wallet seqno at risk that client sends another transaction and seqnos are mixed once again. (reply to 62383)

&rey: Send message to the contract. From a wallet. (reply to 62407)

&rey: Twice expected time between interactions, I think. (reply to 62399)

&rey: You should open dev menu (by clicking the Tonkeeper icon in settings), close it and add a new wallet in the top menu. (reply to 62388)

Nerses: What should be the syntax of message if for example i should send struct as message ? i meant message should have json like object srtucture or smth else ? (reply to 62411)

User<7192644220>: thx, you da best. (reply to 62415)

&rey: No, it should be serialized into cell. If you have a set of fields, you also need TL-B describing how to do serialization. Standardized contracts have TL-Bs available; often, there is one in code. (reply to 62416)

Nerses: what if contract dont have such TL-B available ? what  will be the solution ? (reply to 62418)

&rey: You'll have to reverse-engineer that, looking at examples of interaction or how contract loads data from the message. (reply to 62419)

Charlie: Hi. Tonweb calls the getBalance method always report ECONRESET

Nerses: got it thanks (reply to 62420)

&rey: Toncenter API might be blocked in your network? Does toncenter.com open? (reply to 62422)

Charlie: I'll try it later. Thanks a lot (reply to 62424)

Kyle: Hey Guys,  Hope everyone is doing well. We are a development agency and we specialize in ERP solutions, game development, IOS and web development. If you have a startup project and require these services, do feel free to drop me a message.  I'm Chris from MindMatic TechnoLabz ltd.

Charlie: i can open it (reply to 62424)

Vladimir: Is there any way / example how to create Jetton token with buy/sell fee?  (in the simmilar way how its possible on erc20 and uniswap v2)

&rey: Jetton is not able to determine whether it's being bought, sold (what is the difference, by the way?) or transferred. (reply to 62431)

Vladimir: where can i read how does swaps work in TON?  in erc20 i can do msg.sender == lp or transfer(from, to) arguments  there is no such thing in jetton?  it looks like it has similar executional context inside the code where you can check from and to addresses (reply to 62433)

&rey: from and to are opaque for jettons: addresses have the same format for wallet contracts and others. (reply to 62436)

&rey: Swaps are not standardized (and that's good, actually), so you can read about them on DEX sites: ston.fi or dedust.io.

Vladimir: 1) maybe instead of buy/sell fee i can have a fixed transfer-fee for every transfer between every wallets?  2) maybe I can allow my Jetton to be swapped only via one specific exchange which support swap-fee and restrict the usage from other DEXes? (reply to 62438)

&rey: 1) yes 2) what relation would such jetton have to The Open Network? (reply to 62439)

mohsen: How to convert bitcoin mnemonic to TON mnemonic?

Tim: Don’t do that (reply to 62442)

&rey: Yeah, better create Ed25519 private keys directly.

Nerses: How can i see transaction emitted events ?

mohsen: I am not able to do this either. But why won't the trust wallet accept the mnemonics I generate using the pytoniq library? (reply to 62443)

&rey: Because Trust Wallet uses other algorithm. (reply to 62446)

mohsen: it seems that the mnemonics generated by the Python library pytoniq are incompatible with the trust wallet. This seems strange! (reply to 62447)

mohsen: How can I generate mnemonics compatible with Trust Wallet using Python? (reply to 62447)

&rey: Probably some EVM-compatible algorithm. (reply to 62449)

Zachary: Hello everyone, anyone here understands this metric? Not really sure how this one actually works

Modusp 💯: Pls anyone here that can explain more better to me

김선우: Hello, I'm a python developer, I want to build a program to retrieve information from wallets using seed phrases, but I don't know how to send these requests, please help!

M3: Need developer able to work with smart contracys

User<7123272744>: I am going to deposit my token to claim contract that I was developed, but if I input 1000 in the frontend, contact accepts it to 1.073774615 tokens. How to debug this? Is there any solution to solve or debug this issue?

&rey: Any previous experiences, what do the devs need to know when interacting with your project? (reply to 62457)

&rey: You're probably storing or loading fields incorrectly, in a way that somehow produces number of 2^30[+2791] indivisible jetton units. (reply to 62459)

Ranjit: Hy

cfs chef: anybody know how to verify nft at tonviewer and tonkeeper, thanks

We: We have been developing the first decentralized launchpad platform on Ton blockchain. There is currently a testnet version for presale

&rey: What does it mean "the first decentralized launchpad"? Were the previous platforms all centralized? (reply to 62472)

Nerses: can smart contract(not wallet contract) send some amount of money when "special" message it gets ? I meant can i implement using send(SendParameters{         // bounce is set to true by default         to:          value:          mode:          body:      });

We: Currently there is tonraffles, but it is not completely decentralized, the information is added by the admin, users cannot create presales themselves (reply to 62475)

Cube: Looking for frontend developer (probably React/Vue.js) for participating in Hackathon (in my BUIDL)

إسماعيل: It would be lovely if you send me the details in DM 👀, React & Ton dev here 👋 (reply to 62480)

User<7123272744>: currently, testnet does not work well? I am getting this error when I deploy the smart contract. Request failed with status code 500

Nerses: i have such function     receive(msg: Redeem) {             require(self.contractExists(msg.data.__hashlock) == true, "Contract does not exist");              let pre: Int = sha256((msg.data.__secret).toString());             let hashlockFromSecret: Int = sha256(pre.toString());             let ctx: Context = context();                                                                                  require((self.contracts.get(msg.data.__hashlock)!!).hashlock == hashlockFromSecret,"Hashlock Not Match");             require((self.contracts.get(msg.data.__hashlock)!!).refunded == false,"Already Refunded");             require((self.contracts.get(msg.data.__hashlock)!!).redeemed == false,"Already Redeemed");              self.contracts.set(msg.data.__hashlock, HTLC {hashlock: (self.contracts.get(msg.data.__hashlock)!!).hashlock,                                                             secret: msg.data.__secret,                                                             amount: (self.contracts.get(msg.data.__hashlock)!!).amount,                                                             timelock: (self.contracts.get(msg.data.__hashlock)!!).timelock,                                                             sender: (self.contracts.get(msg.data.__hashlock)!!).sender,                                                             _receiver: (self.contracts.get(msg.data.__hashlock)!!)._receiver,                                                             redeemed: true,                                                             refunded: false                                                             });                          send(SendParameters{                     to: (self.contracts.get(msg.data.__hashlock)!!)._receiver,                     bounce: true,                     value: msg.data.__amount + ctx.value,                     mode: 128                 });     }  dont pay attention to requires as everything in message is ok with that part.The problem is that the contract doesnt send transaction when recieving Redeem message.What can cause that ? any hints

&rey: Hint: what does send mode 128 stand for? (reply to 62483)

Nerses: send remaining balance. Thanks i will try after changing it (reply to 62484)

Vladimir: 2) open means open to anything :-) even for buy/sell swaps through custom dex and closing rest  I'm just researching :-) thank you for the reply (reply to 62440)

Think: I have an app builder & games

Think: Does ton want builders

Vladimir: Is there any trustful dev teams whom I can ask to develop and launch Jetton on TON for me? For money

Think: Yes indeed

Vladimir: Do u have experience with launching jetton token? (reply to 62490)

Nerses: i changed the mode:1 but it wasnt solution either (reply to 62484)

&rey: And what do you add ctx.value for?

Nerses: With another function I lock some funds in this smart contract.Now I want to send Redeem message to this smart contract and get that lock funds.  msg.data.__amount is fund locked for me.And as I send some funds to do call Redeem I need the smart contract to send me back that money as well.So in the end I have msg.data.__amount + ctx.value (reply to 62494)

&rey: Any failure record?

Nerses: Smart contract recievs the money of call Redeem but doesnt send back neither msg.data.__amount nor ctx.value (reply to 62496)

&rey: Any details? Exit codes of computation/action phase? (reply to 62497)

Nerses: here is the transaction https://testnet.tonscan.org/tx/FkzbmF7sBPe7R6JDfkmOADfssNNST1F1VZZ3zIJ6L40= (reply to 62498)

&rey: The message has insufficient TON, in particular to perform self.contracts.get(msg.data.__hashlock)!! multiple times.

Nerses: How did you know it ? I meant there isnt any error or negative exit code seen in tonscan. And also how can I calculate how much the contract will need for performing such operation ? (reply to 62501)

&rey: You should send a large amount (in sandbox) and check how much is used. (reply to 62502)

Nerses: Great.I will try now.Thnx for help (reply to 62503)

Vladislav: Hi everybody. What kind of BinancePizza went out for $TON? Is this a collaboration with Binance?

Nerses: it failed in sandbox as well (reply to 62503)

B: Hi all! I created my own website, which through the web model brought out a telegram bot. To authorize the user, I decided to use the tonconnectionUi library. It seems like I did everything correctly, but when I try to register using tonkeeper, the following error appears. Tell me what to do?

&rey: "insufficient TON". You may have failed to account for storage fees. Try mode 0. (reply to 62508)

Денис: We use js to send a transaction in this way const transaction = {     validUntil: Math.floor(new Date() / 1000) + 360,     messages: [         {             address: "UQA3234a9rmihoxA9BNH7X0qH-tDC0kOYkrsFPfJ4oX73B7E",             amount: (transactionValue*(10**9)).toString() //Toncoin in nanotons         }     ] } const result = await tonConnectUI.sendTransaction(transaction); and send the resulting boc to the server: fetch(middlewareHost + "/deposit", {     method: "POST",     body: JSON.stringify({         amount: transactionValue,         address: tonConnectUI.account.address,         boc: result.boc     }),     headers: {         "Content-type": "application/json; charset=UTF-8"     } })  Maybe there is a better way to send us a transaction to the server so that we can check it? in the end it doesn't reach fetch :(

B: When trying to scan a Qr code, it returns the following error, although the manifest file is located in the root of the project (reply to 62509)

Nerses: same result. again action code 37 (reply to 62510)

Paul: Hi , i'm new in tact. I have a smart contract having some jetton token. I want to send some jetton to other address. Does have any example about this? Many thanks

Aydin: You can ask your question here: https://t.me/devs (reply to 62241)

Aydin: I guess storing something trivial (for example, a zero) in place of the empty cell, and then parsing it with an if statement could help? (reply to 62275)

Aydin: The basic fact about jettons in TON blockchain is that they are contracts themselves. Therefore, if you want to use a jetton instead of the native toncoin, you have to be aware that you are trying to call another smart contract which, again, would require some transaction fees in the native coin. So, overall, you will have to implement a fairly complex logic (reply to 62317)

User<7123272744>: I currently deploy the smart contract using this command. npx blueprint run mySmartContract --testnet --mnemonic  but as you know, testnet is not healthy at this moment. How to deploy the smart contract to Sandbox?

Aydin: You can use Blueprint, which comes with testing with Sandbox (reply to 62347)

&rey: The command will be npx blueprint test. (reply to 62540)

Stefano Zingg: Welcome to Ton Dev Agent  Ton Dev Agent is your sophisticated guide for navigating and implementing the TON blockchain. It provides expert support on the Catchain Consensus Protocol, ensuring Byzantine Fault Tolerance (BFT) for secure block generation and validation. You'll also find comprehensive guidance on the Block Consensus Protocol (BCP) to help you implement reliable block generation in your TON-based projects. Dive into the TON Enhancement Proposals (TEPs) to standardize and propose changes to the blockchain, ensuring your contributions are formalized and recognized.  Streamline your development with MyTonCtrl, a tool designed for managing wallets, domains, and validators on Linux. Deploy and customize tokens using Jetton contracts, with detailed instructions for both standard and advanced setups. Additionally, access the TON Index API for efficient data retrieval from a full node to a PostgreSQL database. Ton Dev Agent is here to support you with these resources, ensuring you have the knowledge and tools to excel in your TON blockchain projects.  https://chatgpt.com/g/g-G2ozSw3s4-ton-dev-agent

Johan: Hey buddy, is there any formula, method or API to get up-to-date price of jetton? (reply to 62542)

&rey: Is there a definition for price of jetton? (reply to 62545)

Nastya: What is the idiomatic way to check smart contract code (or code hash) within another contract?  For example, one contract receives a message from another instance of a contract. How the first contract can be sure that the received message has been sent by one of the target contract instances and not from some contract with another code?

Johan: I mean value or price of 1 jetton, for example here the price of this one is $1.765 (reply to 62546)

&rey: Sender should provide its initial state; it can be checked against sender address. (reply to 62547)

&rey: See jetton wallets for correct implementation.

User<7123272744>: if then, I need to write the test scripts (reply to 62542)

User<7123272744>: I have to store about 3000 users to smart contract and those addresses have 3 parameters. How can we implement it? give me some guide.

Aydin: The appropriate basic strategy in TON blockchain is to keep contracts as compact as possible.  For example, instead of a bloated, single jetton contract in Ethereum, here we have the actor model for jettons: a single "master" contract which mints jettons, together with many jetton wallet contracts, each owned by a different owner.  Now, regarding your project, I would kindly suggest you to check whether there is a way to prevent your smart contract getting bloated; that is, if there is any way to implement the actor model (reply to 62556)

&rey: *the basic strategy. Contracts having special needs may require all items to be in the same contract, for instance, to cross-check users. (reply to 62557)

Aydin: Thanks, modified my answer accordingly (reply to 62558)

Aydin: And do we have any instances of such special contracts onchain now? (reply to 62558)

Ma><im: hello everyone! has anyone encountered such a mistake? on Getgems

Ma><im: I want to put the NFT up for sale (reply to 62561)

&rey: TON Timer (https://programcrafter.github.io/ton-stable-timer). It is much more gas-optimal when all scheduled "calls" are in the same contract, rather than sharded across whole blockchain. (reply to 62560)

Aydin: Wow! That's pretty cool 👍 Is it load-tested with high loads, also? (reply to 62564)

&rey: Unfortunately, it wasn't much used due to high fees, though sharing a timer could really work normal. (reply to 62565)

&rey: Though, now that TON is usually sharded, fees can be decreased 25x IIRC.

Aydin: You mean, to implement it shard-wise? (reply to 62567)

&rey: No, I mean to send bounce message to other shard. To 0:0000000000000000000000000000000000000000000000000000000000000001 or 0:FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, whichever is farther. (reply to 62568)

Angel: I am looking for a senior FunC smart contract developer. If you have a experience in integration with the frontend, it is a plus. Please DM me

Pako: Hello, I'm from Spain, I'm looking for someone who can offer some service for my company project, we are looking for create a token, but we prefer someone who can speak Spanish. Who can help me?

Pako: Thanks!

Tom - Bushi: hey all, new to ton. I have 2 questions: 1. I read that when storing data on chain you pay yearly 'rent' based on the data stored in a contract. How does this work? Does each contract just need to have a TON balance which will slowly be deducted? What happens if this balance runs out?  2. How much does it cost to mint a basic NFT? From what I understand the TEP-62 standard is similar to ERC721, but when minting each NFT a new contract is created for that instance?

TON Bounty Bridge: ​delete  🏷 Education  Assignees: no assignees Created by stenolog

&rey: 1. Each contract has balance, yes. Once it reaches -0.1 TON, contract is replaced by its state hash, becoming "frozen". (reply to 62579)

&rey: Balance is deducted at transaction — that is, on each incoming message.

Kyle: Dm. (reply to 62573)

Tom - Bushi: thanks for getting back to me. Does the contract 'unfreeze' if you top it up? If yes, is data lost when it becomes frozen? (reply to 62582)

Zachary: Any dev here who could build a airdrop claim contract?

User<5018886941>: Hello everyone 👋🤗

Svαtoωλ‎: how to send multiple nfts in 1 transaction via pytoniq or tontools?

Haq: Hello Guys, I have question.  What is the best way to get only USDT transaction from the wallet?

totty: what do you mean? you must have Tons on your wallet for pay trasanction gas (reply to 62591)

Haq: I mean how I can know that transaction was with USDT not with TON? Because now you can send TON or USDT on TON.   Or check if in transaction send some USDT? (reply to 62592)

totty: transaction cannot be with usdt, you can only send usdt

totty: i don’t understand (reply to 62594)

Culp: does anyone need a developer?

Haq: Ok the maybe I make this question wrong.   How to check if someone send USDT in transaction / send action.   Is the way if I get all transactions from the wallet I can sort and know which one contains USDT?   I hope now I make it more clear 🤞🏼 (reply to 62598)

Sope: Does anyone need a developer,  Or you need a smart contract audit. I'm available. Let talk

User<6305973062>: I am a senior blockchain & full stack develoepr with 8 years of experience. please contact me if you need a developer.

Arseniy: can jetton have multiply implementation of wallet? for example v1 v2 v3 etc

— 2024-05-22 —

Gyorgy: No. Jettons are not like wallet contracts. Jetton, Jetton_Master contract. Try it on testnet. Nothing to lose there.   https://minter.ton.org/?testnet=true (reply to 62609)

lin: May I ask how to control only the ton on the contract to be sent to the wallet

totty: yes on ton viewer (reply to 62600)

totty: but i think you want easier

Haq: But the thing is that  need to filtr this transaction in one of my app service. And how to do it via code using for example TonAccess or TonCenter (reply to 62626)

totty: on tonviewer you can see value flow

totty: and there are changes for wallets

totty: you should create transaction and go to tonviewer

Haq: I understand that but in my app I don’t have that options, I’m taking all transactions from block chain.   You suggest that is some API from tonviewer and I should use it?   Because I can have like 100 transactions and I need to check it then I can do it manually (reply to 62632)

totty: and next step is try to get this data by ton api (reply to 62632)

totty: https://docs.tonconsole.com/tonapi/api-v2

Abozy: How can I send a message to the address from which I have unit256?

totty: /v2/blockchain/transactions/{transaction}

Abozy: This didn't work... (reply to 62638)

totty: are you a programmer? (reply to 62635)

Angel: This link does not work on testnet. But mainnet is okay. So I deployed my own website on testnet. So  you can deploy your own jetton token to testnet. (reply to 62618)

Haq: Ok thanks, I will check this API.   Any idea how to separate transactions with USDT? Because this is my big problem (reply to 62639)

Haq: I am, yes (reply to 62641)

totty: you have to write some filters (reply to 62643)

totty: i think that you should to it manualny, no by api and create for by transactions and use simple regex

Corle🦴: Hi

totty: can we say that your problem is closed

Angel: I am looking for a seniro FunC  developer to join our team. If you can integrate the frontend with the smart contract, it is a big plus.  I need a developer urgently. So you must start immediately. DM me

Haq: Thanks for all your help and answers.  I know that I need to build some filters but the thing is that I don’t have information about where in transaction object is a difference, what I need to check  in order to know what type of transaction it is.   Idea what I need to do I know but how to find it. The right property or something special for USDT.  There is any Doc for USDT transaction on TON? (reply to 62652)

Abdulaziz: Can i get help to myself* (reply to 62656)

totty: first thing i would try would be the api, check what response to you receive (reply to 62655)

User<7123272744>: What is min ton price too deposit or withdraw jetton from the contract?

Haq: I already have list of transactions for API: https://toncenter.com/api/v3/   but I will check this one which you send me:  https://docs.tonconsole.com/tonapi/api-v2  And check if there transactions has some difference. (reply to 62659)

&rey: That's incorrect and loses two last bits of hash. (reply to 62638)

&rey: Sending USDT involves multiple transactions, actually. What you need to parse all of that is tonapi's "traces". (reply to 62600)

Haq: Thanks for you answer, I will check it today. (reply to 62663)

Randall: Who know where in TON cpp sources a changed account states are writing in DB?

User<7123272744>: what is min fee to withdraw and deposit jetton token from the contract? Do we need to define it in the code?

Luc: With Tronscan API (reply to 62655)

Hanniba1111: Hi guys, I have several questions about NotCoin: 1. User can click the screen to get coins and the coins number will show in the screen. I wonder if the number of coins is stored in database once the screen is clicked and if the number shown in the frontend is fetched from database in real-time? 2. How does Notcoin record the users' login status? There is no explicit login button, is it that the frontend can obtain the user Telegram Id as soon as the enter the app? 3. I found that Notcoin is open-sourced in some news, but I cannot find its code.

Haq: But one is for TON? (reply to 62670)

Luc: I did not understand the question (reply to 62672)

Luc: That example I gave you is for USDT. In the console below are the printed results along with the transaction time (reply to 62672)

Haq: Thanks man! I will check it on my TON wallets (reply to 62674)

ecomnazar: hi, has any api of telegram that returns current price of TON?

&rey: Are you sure it has any connection to TON? USDT were deployed on TON recently. (reply to 62670)

Abozy: Thank you, I need to skip 11 bits, for some reason I didn’t understand this right away 👍 (reply to 62662)

&rey: No. In particular because TON price isn't well approximated by limit orders which would define it. (reply to 62676)

&rey: Then you'll need .store_uint(1024, 11).store_uint(hash_part, 256). (reply to 62678)

Luc: Oh I didn't realize I was in the TON group. Sorry, I haven't tried it with this network (reply to 62677)

Abozy: But why? I saved this ID as a key and successfully use it later. dict~udict_set(256, get_id_by_address(sender_address), begin_cell().store_uint(1, 1).end_cell().begin_parse()); (reply to 62680)

Abozy: @pcrafter If you don’t mind, please explain, I’m interested to know

Hanniba1111: Someone knows? I am  really curious about these questions. (reply to 62671)

&rey: .store_uint(1024, 11) is same to (2, 2)+(0, 9).

Abozy: Thanks, that means I thought correctly 😉 (reply to 62687)

&rey: 1. Yes, probably. 2. I believe it can, not user ID but chat ID although. 3. I doubt it was. (reply to 62671)

Hanniba1111: Thx bro! For second answer, I dont know whats the means of "chat ID". Users enter Notcoin without need of chatting with bot. (reply to 62689)

Maksim: It is simply connected to how Telegram mini apps work, each TMA is assigned to a bot, and you run it from inside a bot, as it was in case with Notcoin, and each chat with the bot has an id, which you get to identify the user (reply to 62690)

Hanniba1111: i know, your answer is clear! THX! (reply to 62691)

agile_ape: Hey guys. So I transferred my nft into a hardware wallet (SafePal). Then I realize no dapps actually allow you to connect with hardware wallet. So now my nft is stuck in the hardware wallet. Can’t transfer or list. Anyone knows how I can transfer it out back to a hot wallet?

cfs chef: why i can’t see my nft at tonkeeper，I’m already verified contract code🥲

&rey: Export private key and use it in https://github.com/TonDevWallet/TonDevWallet. (reply to 62693)

&rey: See settings and enable display of your token. Other users who deem your NFT trustworthy will do same. (reply to 62694)

agile_ape: Thanks! Will explore (reply to 62697)

szansky: I have question i have problem in my payment system on ton with ton space, the transaction return to sender here is tx accepted from tonkeeper, and returned with tonspace. Have anybody any idea why this may occur ?

cfs chef: I airdropped an NFT to my community, but everyone said they couldn't see it, whether it was in Tonkeeper or Tonviewer, and I have verified the contract code (reply to 62698)

^_^: Hi, Nice to meet you. I am Javascript frontend developer and also familiar with FunC smart contract developer. Let's chat for discussing your project. Warm regards. (reply to 62480)

&rey: This behavior is correct (depending on specific airdrop techniques). (reply to 62708)

cfs chef: https://github.com/tondiamonds/ton-nft-deployer i`m use this tools to do airdrop

cfs chef: if i wanna tonkeeper and tonviewer to show my nft, how can i do?

Nxrix: What is the limit of a transaction comment and how much will be the highest fee of it

Haq: Thanks for that, I also was wondering about it. (reply to 62677)

Rio: Hi everybody I want to tracking my wallet's changing balance in real time Does anyone here know how to do it?  pls help me

Rio: i'm using tonconsole sdk

NICK: Looking for additional ton devs with solid knowledge in smart contract and ideally with telegram bot creation. Feel free to DM.

Kyle: Hey Guys,  Hope everyone is doing well. We are a development agency and we specialize in ERP solutions, game development, IOS and web development. If you have a startup project and require these services, do feel free to drop me a message.  I'm Chris from MindMatic TechnoLabz ltd.

Tiago: Hi guys is there any way to query from chain the minimum stake required for a nominator pool to be elected?

&rey: It depends on other candidates in the validators election. (reply to 62738)

Tiago: Is there any way to see the existing candidate? I have a nominator pool on testnet, but is not beeing elected, probably due to low stake. I'm trying to find out how much stake I need to get it elected (reply to 62749)

&rey: You can look at current validators' stakes as a good approximation. (reply to 62750)

Tiago: how can I do that on testnet? (reply to 62751)

Tiago: didn't found any explorer with that information

&rey: Seems that you need to read raw data of Elector contract...

Vatshayan: Hy what is this 3 API key for premium user.  how we gonna use 3 API key if request per second goes above?

~/takezō: Is there alternative for tonweb's writeBytes in @ton/ton lib?  const commentBytes = new TextEncoder().encode(comment); const payload = new TonWeb.boc.Cell();  payload.bits.writeBytes(commentBytes);

Jonny: hi, if i minte an nft using the ton package with typescript. how can i update it? whether it's the price or its attributes?

Nerses: Hi everyone ! How can I see emitted log of the smart contract after internal message ?

Tiago: Can you please point me to some doc or so, where I can figure out how I can do it? Thank you! (reply to 62754)

wikig: Hello guys , a short question here .   Is there any way for the back-end of the webapp to auth the user open the page via webapp?  And is that possible to do one tap login via telegram Oauth inside the web app ?

&rey: storeBuffer or even storeStringTail. (reply to 62757)

&rey: Could you please point me to doc which recommended to emit logs? Actually, you need to get transactions on the contract, and you'll see external-out in the outMsgs list. (reply to 62759)

Nerses: I need to emmit logs as my projects architecture need it. As I need to track internal messages where every specific message has its own unique output data which should be visible off chain (reply to 62765)

&rey: You can read internal messages themselves and parse them offchain. In fact, you're bound to load them without method to get external-out messages separately. (reply to 62768)

Nerses: For instance in ethereum blockchain you can you can see easily logs in etherscan.I want analog of that in TON blockchain which will be solution (reply to 62770)

Vatshayan: Tokens per Network 3 Total requests per  25/second   This is in subscription plans   what is this all about tokens per network 3  total requests per 25/seconds  So it means one API can handdle 25/seconds ?

Nxrix: How could I turn a text comment for a simple transfer to payload without using third party libraries

&rey: You have to copy code out of third party libraries then. Or reimplement BOC serialization yourself according to whitepaper and said libraries. (reply to 62776)

R: hello

Nxrix: It's similar to the creation of a wallet address from raw address right? (reply to 62777)

&rey: A bit harder, even. (reply to 62781)

&rey: And if you reimplement only part of functionality, you'll be able to process short text comments only.

Nxrix: Long ones need to have more cells right (reply to 62783)

Nxrix: What is the best library that has all the need and is simple as  const body = beginCell()   .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow   .storeStringTail("Hello, TON!") // write our text comment   .endCell();

Nxrix: I'm using simple js not typescript or node.js

Nxrix: I saw https://github.com/ton-org/ton/tree/master one but I can't find the js build (reply to 62788)

Nxrix: I'm sure some people have already used it in their projects without typescript

User<7123272744>: 05fdb2e15d04c8a36c8a49ad6c36c05fa0802720c649dda56a84d7d5816e9276 Please check this transaction in mainnet and let me know what is wrong?

Klay.D: hey, today I notice that using official ton wallet to make tx through ton-connect will always send bounceable transaction even though the destination address is in unbounceable format. Anyone could confirm this change? Using tonkeeper does not cause this issue

Klay.D: check if the internal message is bounceable, if so, it could be the change in ton wallet I notice today (reply to 62707)

Dri: Hi there is any way to update the image of an NFT item after minted?

Nerses: because of this getter function I get exit code 11  get fun getHTLCDetails(hashlock: Int): HTLC? {         return self.contracts.get(hashlock);     }  Cant understand what is the problem with it

Nxrix: If the image is using an external link in your server yes (reply to 62804)

Nxrix: What is the limit? (reply to 62783)

Dri: can you suggest my some guide where this is expleined? (reply to 62807)

Nxrix: How many bytes (reply to 62808)

&rey: I believe it may get translated into FunC as get_h_t_l_c_details. (reply to 62805)

Dri: i have it in pinata (reply to 62807)

Nxrix: Look each nft has a metadata containing the details of it like image name and ... The image can be a link  If you want to mint them yourself you can use to host your images somewhere that you can edit later If you mint nfts using getgems you can't do anything about it currently (reply to 62809)

Nxrix: If you hosted the image on pinata then you can change it I think (reply to 62812)

Nerses: i found this piece of code from build folder where is file with extension *code.fc (reply to 62811)

User<7123272744>: How to get the transaction result in the frontend?

v: https://testnet.tonviewer.com/transaction/02aaefcae3c92129c8ab9b27e5350ff9240a8b02a9d78410a8bc399df904c493  Why is this?

Nerses: transaction executed with exit code 705.It isnt custom error if I am not mistaken,so most probably you should check what error inidcates 705 in your smart contract (reply to 62818)

Dri: someone know how to call this method of contract from js file  if (op == 4) { ;; change content       save_data(owner_address, next_item_index, in_msg_body~load_ref(), nft_item_code, in_msg_body~load_ref());       return ();     }

cemorum: Greetings, we are the RefBattles project team, participating in the Open League hackathon on the SocialFi track. We need a developer who specializes in tone and smart contracts. Those who will participate with us will get into the main team and share the prize among the team members. Email me if interested for more details.

Enoch: Check out some tests written on GitHub typing it would not be easy (reply to 62820)

&rey: beginCell().storeUint(4, 32)   [? .storeUint(???, 64) for query ID]   .storeRef(???).storeRef(???) (reply to 62820)

Dri: thank you but what i have to put inside? i want to change the image url of nft (reply to 62825)

Dri: i have this now but i receive an errore:    public updateMintBody(params: mintParams): Cell {     const body = beginCell();     body.storeUint(4, 32);     body.storeUint(params.queryId || 0, 64);     body.storeUint(params.itemIndex, 64);     body.storeCoins(params.amount);      const nftItemContent = beginCell();     nftItemContent.storeAddress(params.itemOwnerAddress);      const uriContent = beginCell();     uriContent.storeBuffer(Buffer.from(params.commonContentUrl));     nftItemContent.storeRef(uriContent.endCell());      body.storeRef(nftItemContent.endCell());     return body.endCell();   }

ved: can any one please tell me how i add USDT payment using TON-WEB in Node js

User<7123272744>: I use this function to store the address and amount to dictionary. dict_set_slice_int(storage::is_claimed, 267, sender_address, amount, 120)  Using this code, is it possible to store 3000 users data?

v: ok (reply to 62819)

Daniil: Hi! Is there any way to parse the message body on the client? How to get accurate contract data if several users are sending messages there at the same time and changing the same data fields? I need to return to the user the result of exactly his transaction.

Nerses: I used TON indexer from TONCenter and get this data from transaction {   "messages": [     {       "hash": "JQuq8Gr01+p9B0rBke3GIk3zD7hMKqhVPhv5GbMxpms=",       "source": "0:90F50B1734B015F5AFB679FFFE7988A597B45A3C4F0172D8FDEEE2FB94265EFD",       "destination": "0:327F9B538BA5C09FCC9C4FF443AFF3EFB97FD36BC180B74F4FEAB9E3BA14AA33",       "value": "100000000",       "fwd_fee": "507471",       "ihr_fee": "0",       "created_lt": "21911980000002",       "created_at": "1716385739",       "opcode": "0x22e6bcc1",       "ihr_disabled": true,       "bounce": true,       "bounced": false,       "import_fee": null,       "message_content": {         "hash": "NgcfHiE/NYWIn6FOycCqHCTHA7VVZkqHnE26eWdnXvk=",         "body": "te6cckEBAQEAZwAAySLmvMEIzAzX83wOx+7PoHXR2Nap8TAHuSK/13QheL2bVyiP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE7+vyQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL68IAQBm1Pdg==",         "decoded": null       },       "init_state": null     }   ] }   how can I convert for example message_content.body to human readable text ?

Madhur: Hey guys following up on this (reply to 61086)

S: Hello. I'm trying to run a script with a contract deployment in SDK blueprint via Create a ton:// deep link and I get the error Error: code length overflow. (30196>23648). Apparently the problem is the size of the code, but yesterday everything worked fine. Has anyone encountered this?

Arseniy: can special contract that is not a wallet change jetton master’s supply? in my case burn

punkd.base.eth: @oopshelena can you please check DM

#Disruption: Hey all, I am trying to run a TON full node as per the specs but encounter this issue during installation (this is for the non-root user) anyone have a solution? 😅

Falco: Try running everything as root (installation of mytonctrl but also running the tool itself) (reply to 62862)

#Disruption: Have tried, same issue persists (reply to 62863)

NICK: Looking for additional ton devs with solid knowledge in smart contract and ideally with telegram bot creation. Feel free to DM.  Have received already two DMs. Happy to get more DMs to choose the best candidate.

Jim: you can dm me (reply to 62865)

#Disruption: have messaged (reply to 62866)

#: Hello, tell me how you can link a site on GitHub pages with a back end in Python in telegram bot?

Nerses: what indicates TransactionDescr . split prepare . aborted   field in transaction layout ?

Harry: I have Jetton token in my trust wallet how can I remove it @pcrafter  please help

cypherpunksO1: Good afternoon. Is it possible to send a TON from the Jetton Master (minter.ton.org) contract back? The rights have not been revoked yet

&rey: A working way was reported to be: 1. Use Safepal to obtain private key from mnemonic; 2. Use TonDevWallet as wallet app with given private key; 3. Transfer jettons as you wish. (reply to 62875)

Harry: I don't understand please can you explain better (reply to 62880)

Arseniy: hi everyone i am developing my pet-project-token using tact lang  in concept i will receive tons on jetton_master contract and after i plan to transfer obtained tons to the liquidity pool can i do it in the code? cause i want to do it automaticaly without intermediares

Harry: Please write me I can't send you a message (reply to 62880)

&rey: Which of steps I provided was unclear? Or you're interested in their purpose? (reply to 62886)

Harry: How can I get the tondevwallet (reply to 62892)

Harry: Am not réally familiar with ton space

&rey: It can be downloaded from https://github.com/TonDevWallet/TonDevWallet. Releases are to the right of the page. (reply to 62893)

Harry: I have no idea how this work (reply to 62896)

&rey: Download whichever version matches your system (Linux, macOS or Windows, in order). After installation, you'll have a desktop TON wallet application. (reply to 62898)

Harry: Thanks alot (reply to 62900)

&rey: Only support of @wallet. (reply to 62905)

ecomnazar: hi, how can i track transaction status with BOC ?

Masnop: Not answare bot (reply to 62909)

Masnop: Bot cant help me

&rey: Have you visited TON Cookbook? (reply to 62910)

&rey: If so, no one will be able to help you, since TON devs here have no authority over @wallet's database or funds. (reply to 62912)

ecomnazar: here, not found yet (reply to 62913)

Masnop: Imagine if i have earn 1Million NOT COIN and TON COIN, but failed when recieve. 😔

&rey: Blockchain-based parts do have guarantees of delivery/valid execution/etc. Offchain ones do not. In neither case you would be able to change anything. (reply to 62917)

Masnop: Just wait, right? (reply to 62920)

Masnop: Thx u (reply to 62920)

cybernetix: hi guys, anyone know of a discord nft token holder verification bot ?

Boris: Guys if you have a couple of minutes, check this out. I worked about 2 months on it, and learned TON and TG ecosystem.  The idea came from Notcoin, I was thinking about a skin market for Notcoin, and thought why not making a pizza. So a small pet project..  I would really appreciate your feedback and bug reports  Happy BTC Pizzaday.. 🍕️️️️️️   https://t.me/pizzagems_bot

Nikita: Yes (reply to 62879)

User<6676350680>: Howdy,who is currently in need of frontend and web3 developer?

~/takezō: Hi, is there any example for Dictionary.Values.Slice in ton js?  UPD:  function createSliceValue() {   return {       serialize: (src, buidler) => {           buidler.storeSlice(src);       },       parse: (src) => {           return src.loadSlice();       }   } }  Slice: () => {             return createSliceValue();  }

Erfan: buidler instead of builder is hurting me (reply to 62944)

— 2024-05-23 —

Bryan: Hi want to ask is dynamic sharding already in working and in use in ton? and in the future when other workchains are activated, will dynamic sharding apply to those too? so for example if the new workchain uses evm, does this mean ton's architecture instantly allow dynamic sharding on the evm working chain?

~/takezō: Hello, I'm forming such a dict and sending it through storeDict / storeDictDirect, and in the contract func in_msg_body~load_dict().  When I loop through the dict, it says there are supposedly 0 elements (flag = 0, or nothing is incremented in the loop; I've tried both ways).  Am I saving k+v incorrectly or what? Keys: [0, 1, 2] values: can be seen in the terminal screenshot.

Batyr: Hey guys, I can't figure out what's the difference between cell and slices. And why we have both as inputs to () recv_internal(cell in_msg_full, slice in_msg_body) .  Doc's description somewhat confusing. Is there any article where I can read more detailed info?

Batyr: I mean if slice can be part of cell, why we have input as a slice which contains cells

Rio: https://docs.tonconsole.com/tonapi/streaming-api hey guys how to use websocket of tonconsole to checking account streaming finalized transactions?

Rio: have any example for nodejs?

Max: Hello, I'm a newbie. How to lock jetton token for a period of time? Lock time may be change.

cypherpunksO1: How do I do that? Please give me a hint (reply to 62933)

R.: Hi

ecomnazar: hi, can i track transaction with BOC?

Eldar: Hi community 😀  Please take a look at our project

Nikita: No (reply to 62982)

Mikko: EVM does not understand sharding, so it could not work with other parts of TON. There is fundamental architecture differences and you cannot shard EVM like you cannot build smart contracts on Bitcoin. (reply to 62959)

Vitor: Just saw Vitalik's post on Layer 2 x sharding and I was thinking someone should publish a comparison with TVM and its sharding model. (reply to 63001)

Mikko: It is Vitalik's way of saying rollup centric scaling was a mistake

Vitor: Nah, I don't think he's willing to concede defeat yet hehehe

Mikko: He is begging to 100+ L2 governance token holders somehow come up with something that's useable. Good luck. (reply to 63005)

Bryan: i understand, i asked because ton's docs say  "If you want to customize rules of the group of Shardchains, you could create a Workchain. A good example is to make a workchain that works on the base of EVM to run Solidity smart contracts on it." so i curious if the workchain is set to be EVM, is it possible it'll share the underlying architecture of ton. Thanks!

🌌: Guys, isn't it possible to link a user to a wallet and a telegram at the same time? how is this done on a fragment?

Mikko: Sounds like it was written by somebody who does not know EVM or Solidity and it is not a practical advice (reply to 63007)

Mikko: Wallet is independent from Telegram so no (reply to 63008)

Vitor: There's also a Solidity to TVM compiler somdwhere in GitHub. Terrible ideas are always out there :D

Mikko: It could be worse (reply to 63011)

User<6465490423>: How create payload for transfer jettons?

&rey: in_msg_body is part of in_msg_full tree of cells containing payload. As it's converted to slice already, it's very convenient to parse whatever sender contract messaged. (reply to 62970)

&rey: Dynamic sharding actually works, but different workchains may be processed by different validators, and there might be subset of validators who would be willing to uphold EVM consensus. Maybe with restrictions like contracts being in the same shard or calls count, though. (reply to 62959)

&rey: That's not the right tool for finalized! You should either poll normal tonapi by accounts addresses or use toncenter (I've heard latter contains option to subscribe to transactions.) (reply to 62972)

Rio: tks for ans i'm using tonapi, i don't know how to tracking transaction completed when transfer ton can u do it? (reply to 63023)

&rey: Which of two transactions you need there? One sending TON from source wallet, or one crediting them to destination? (reply to 63024)

ecomnazar: hi, who knows how can i calculate fee of ton transaction?

Тony: I can't transfer ton coin. I used TonKeeper

Rio: i need tracking transaction send TON to destination (reply to 63029)

Ha: I created a payment order of 0.25TON, but when I opened the wallet, it became 2 consecutive orders as shown

Ha: It just happened in the last few days, before that it was working normally

Ha: help me

w: looks like bounce idk

Ha: That's right, money transferred is refunded

w: its ur app?

Ha: Is it because the TON network is failing or how do I need to update the code?

Ha: yes (reply to 63043)

Ha: Most of my app users encounter the above situation

Vitor: Considering the network works fine for everyone else, I think the Occam's razor says it's your app.... (reply to 63044)

Ha: Other users on my app had the same situation (reply to 63047)

w: try rolling back the code version to a backup where everything worked as it should (reply to 63049)

w: and try to figure out why it happens comparing the code (reply to 63050)

Vitor: You know that's completely meaningless, right? Look at the transaction and check what caused it to bounce. (reply to 63049)

ダーリン: Hello everyone, tell me please how can I get a message from a regular TON transfer in Go? the indexer has already been written, i just need to figure this out

Rio: pls help me check it (reply to 63029)

&rey: That's @wallet issue. They started ignoring unbounceable addresses, IIRC. (reply to 63039)

Ha: what I need to do? (reply to 63058)

&rey: If possible, deploy destination contracts beforehand. Also, make users aware of the bug. (reply to 63059)

&rey: You can also give users StateInit for the contract so that their transaction already deploys it, ensuring no bounce. (reply to 63059)

Ha: thanks you very much, I changed the receiving wallet address and the problem was resolved (reply to 63060)

&rey: You won't have this in streaming API, but you can use /v2/blockchain/accounts/{account_id}/transactions. (reply to 63035)

Rio: tks sir so if i tracking transaction from source wallet what can i do with streaming api? (reply to 63064)

&rey: Get external messages which might get executed, and might not. (reply to 63065)

Yaseen Ammaar: i can help (reply to 60560)

Jerry: can i get transaction after use sendTransfer ?

Andrea: Hello, how can I get sender from a WalletContractV4?  const wallet = WalletContractV4.create({ publicKey: publicKey, workchain: 0 }); const sender = wallet.sender(secretKey);  This is my code but sender.address is undefined.  Thanks in advance

steel: Hello there!  I accidentally tried to send more TON than was available in my wallet and I came across the next issue: a lot of duplicated transactions were produced, each one consumed fee and failed.  Wallet address - EQDwc9MGV1RK0FNohJpmxZRQtG55tTJXq9k3rsXyrxvGRqci (best shown in TonViewer)  All transactions appeared sequentially with some interval. There were no retries, just a single sendBoc call. Furthermore, when I tried to reproduce it and sent the same message multiple times, I received an error "LITE_SERVER_UNKNOWN: cannot send external message : duplicate message". So I can't figure out what happened. I'm using wallet v4r2 and @ton/ton JS library.  I have some questions: 1. Is it okay that there are multiple transactions with identical payload? 2. Is there any explanation for how these transactions could have appeared? 3. What is the correct way to prevent this situation?  Thanks in advance!

Klay.D: why is the body of bounced message limited with 256 bits from original message? without the full original message, contract cannot get enough information to handle state revert. My case is a contract handling bounce message when its jetton wallet fails to transfer to another jetton wallet

&rey: 1,2. Yes, there is. Same external message was valid multiple times, therefore it was applied repeatedly. (reply to 63080)

&rey: 3. Use sendMode with flag 2. Also, short timeouts.

&rey: A good question. To validators. (reply to 63081)

steel: I'm a bit confused that I can't reproduce it, as I receive "duplicate message" error. So I can't figure out what is the source of these transactions. (reply to 63082)

steel: Got it, thank you! (reply to 63083)

&rey: There is no need to send it second time manually, nodes will do that themselves. (reply to 63085)

&rey: Normally, seqno replay protection stops that, but should sending fail seqno change is not recorded.

Kos: Hey team, we are going to implement ton connect so our users would be able to top-up their in-app balances easily using their tg wallets could you please help with the right documentation?

Kos: TG Mini App (reply to 63090)

steel: I see The message seems to be valid, as state has not been changed, and both seqno and signature are valid. So there are no errors in computation. But I expected, that it would be a single failed transaction.  I'll research send mode, thanks again! (reply to 63089)

D: Hi, help please with scam nft how i can transfer ton from balance nft to me?  https://tonviewer.com/EQCiJT6YbUsVpaZnPPISWSK0acPwFZmO2BxlRzZfikubIK3M?section=code

Mohammad: Hi everyone,  I’m a Node.js developer and I’m looking to develop a wallet on the TON blockchain using its v5 contract. My goal is to handle high-load transactions effectively. Could anyone share any resources or provide guidance on how to approach this? Any advice or pointers would be greatly appreciated!  Thanks in advance! @pcrafte

R.: Hi Why is ton . run has zero ton domain and searching result always is empty?

R.: I'm trying to open some .ton site

Adam: guys is there any way to send twi messages in one transactin

Nerses: Hi evryone! How can I see emitted logs of smart contract ? I need the most optimal solution

Sope: We need an experience Mini Telegram Game App Developer.   We are working on a game project. If you are available for a new gig.  Note, you must have experience and a veritable portfolio.    Kindly @OlaDevSafu DM.  Thanks

User<6462380729>: Hey, @everyone I need your help!   I have obtained a testnet token and it will appear in the Tonkeeper Wallet web extension. However, it does not appear in the mobile app wallet. I've already set up dev mode in the mobile app. please guide me.

Nadya: Hey  Do you need a uxui designer? (reply to 63107)

User<6922552655>: Dear developers, How is your day going?  As a full-stack-Blockchain developer with over 7 years of experience, I want to create something meaningful for you. Especially I have rich experience of building bellow blockchain applications.  🖥 Web Development: Weaving blockchain magic into stunning, user-centric websites. 🔐 Smart Contracts: Sculpting secure, top-tier contracts for diverse blockchain ecosystems. 🌐 dApps: Erecting decentralized applications that are both expansive and engaging. 💸 DeFi Solutions: Forging ahead in DeFi with groundbreaking applications. 🖼 NFT Marketplaces: Assembling standout platforms for digital artistry and trade. 🏦 Staking/Lending Platforms: Crafting systems that bolster community growth and rewards. 🤖 Automation Bots: Tailoring Telegram and Discord bots for peak efficiency and interaction. 💼 Wallet Applications: Engineering wallets that are both ironclad and intuitive for asset management.  Please send me a DM if you have any projects in progress or special idea of blockchain business. Kind regards.

Nerses: How can i decode this "message_content": {           "hash": "PbXAS8otIZBeZlghtJz9H1AW6AoNBQvkiG68qXKOOIA=",           "body": "te6cckECBgEAAaAAAZwLmPzcNCStjSG4vdfAuOUKDXSkXYOIxJepRDUp2EZTwjPGJaXlckWOqEw4AKqeVC7xlESSd7WBlkJfKnIKVeYOKamjF2ZPMi4AAAB7AAEBAWhiAB/TUmDQV/RvnHRR7Di/NBFrnVaBC+D8J2gHmx3UgxIWIJ1bNAAAAAAAAAAAAAAAAAABAgHNwmOEhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPowAnwlMB7XSMzr7qR5iEDvs+NJa29rFLGFkaz4D4QoosOuAEh6hYuaWAr619s8//88xFLL2i0eJ4C5bH73cX3KEy9+wMCwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEqBfIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmUBxRCMwM1/N8Dsfuz6B10djWqfEwB7kiv9d0IXi9m1coj+BAEBQBITXkgYWRkcmVzcyB3aGVyZSBJIHdhbnQgdG8gZ2V0IGZ1bmRzAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6EBG39vj",           "decoded": null         },

Dev: What happens if 2 transactions with the same seqno are sent at the same time?  If I understand correctly, only one will be executed, the second one will be invalid.  Can I use this to avoid double sends?

&rey: Yes. For whatever library you're using, pass two messages instead of one in the array to send. (reply to 63105)

Nerses: I guess this is in base64 format but still cant get human readable text out of it (reply to 63117)

&rey: It is base64 of BOC. Without TL-B to go with BOC, you don't know what is contained in the message. (reply to 63123)

Nerses: data->BOC->base64->text ? (reply to 63124)

Dev: Thank you for your clarification. But I am solving a different problem. In the example, 2 transactions are created with the same seqno = 10. The transactions are sent to nodes at the same time. How will the blockchain process these transactions?      const currentSeqno = wallet.getSeqno() // 10      const data1 = {     // any fields       seqno: 10     }      const data2 = {       // any fields       seqno: 10     }      const tx1 = wallet.send(data1)     const tx2 = wallet.send(data2) (reply to 63120)

&rey: One may succeed, other (or both, in some cases) will be forgotten. (reply to 63127)

&rey: TonWeb is not suited for sending multiple messages in one transaction.

Gyorgy: seqno should be ++ with each transaction.   var currentSeqno = wallet.getSeqno();  const data1 = {     // any fields       seqno: currentSeqno     }  currentSeqno++;      const data2 = {       // any fields       seqno: currentSeqno     }  From first look, but tonconnect might better to use for simple tx from web.

Dev: thanks, i know. But i solve other problem (reply to 63131)

Dev: The thing is that sometimes I get a @send: 'ok' response, but the transfers never show up on the network. Can you suggest what is the reason for this?  To improve reliability, I want to send the same transaction to different nodes.  And I want to make sure that with seqno there will be no duplicate sends.

Gyorgy: 2 messages with one tx more suitable with tonconnect. it’s an array and you can build up from there.   not really sure, not using tonweb for transactions only for address parsing and more low-level stuff.

Zachary: Hey guys Please be aware of this scammer 😪 @Emillyserah1  He just scammed us 3500$

User<6809510202>: thank you bro (reply to 63136)

Gyorgy: They will make other accounts. It is generally good advice not to send anyone anything; there are a lot of scammers here. Block, report, and move forward. It's sad to hear they got money out of you, but could you share some details about their method so everyone knows their latest tricks? (reply to 63136)

Oleg: Hello guys. Having trouble with ton-indexer and archive data parsing. Everything is configured according to the official documentation but indexer says Failed to fetch seqno 150550: [Error : 602 : state already gc'd] all the time when parsing old blocks. Is it known issue? Can somebody support with it a little bit?

musashi: dammit he asked me to help recently and I still not get paid (reply to 63136)

musashi: he also told me that someone else scammed me and him, behaved like a victim lol

Adarsh: Hi Guys, I am looking for TON developers in Delhi region to join our team.

Hades: dm (reply to 63142)

User<7123272744>: How did he scam you? (reply to 63136)

Nerses: Is there any method to see emitted logs ?

Vitor: Yes, using an indexer. Use ton-indexer or the toncenter API, for example. (reply to 63152)

Vitor: "Logs" are just messages.

Nerses: yeah i tried it and get messages but overhead of it is handling with message format(I need to get human readable out of it) (reply to 63153)

Vitor: Use tonconsole API methods to stream the messages from the address, parse, store that in a database and index it. (reply to 63155)

Vitor: Or fork ton-indexer, add your custom parsing logic.

Nerses: is there any doc ? (reply to 63156)

Vitor: Will DM you since I can't send links on the chat.

musashi: oh it's you again (reply to 63149)

musashi: he told me that you scammed me and him lol

musashi: he behaved like a victim

musashi: that's ridiculous

musashi: lol I blocked him so now I cannot get the chat to show to you guys

musashi: he told me that you didn't take his calls

musashi: he must be a real pro scammer tbh

Harry: &rey  I tried your method in removing the Jetton I was unable to to it pleasw can you Dm

Stefano Zingg: https://chatgpt.com/g/g-G2ozSw3s4-ton-dev-agent

Harry: How can I download ton Dev wallet please help

User<1463408356>: hey im having problems with sending jettons through tonweb, im willing to pay few bucks to someone that can fix my code

&rey: How highload? More than 255 per block? (reply to 63097)

&rey: OK! Test code on https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment; if it fails, where it does? (reply to 63177)

&rey: I'd bet it is not as tuned as https://t.me/tonsupport_aibot. (reply to 63175)

Mohammad: To send 255 transactions (reply to 63178)

Stefano Zingg: Thanks (reply to 63180)

User<1463408356>: yeah i think i used this code, basically what i get in console is: { 3|ton-back |   '@type': 'ok', 3|ton-back |   '@extra': '1716209600.5206757:12:0.28570683383027873' 3|ton-back | }  but it doesnt send anything  const seqno = await handlerWallet.methods.seqno().call() || 0;         if (item.mint === "000000000") {             const d = await handlerWallet.methods.transfer({                 secretKey: HandlerKeyPair.secretKey,                 toAddress: receiverAddress,                 amount: Math.floor(item.balance - fee),                 seqno: seqno,                 sendMode: 3,             }).send();             console.log(d)         } else {             // @ts-ignore             const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {                 address: await handlerWallet.getAddress(),             });              const payload = await jettonWallet.createTransferBody(                 {                     tokenAmount: item.balance,                     // @ts-ignore                     toAddress: new TonWeb.utils.Address(receiverAddress),                     // @ts-ignore                     forwardAmount: TonWeb.utils.toNano("0.01"),                     responseAddress: await handlerWallet.getAddress(),                 }             );              const e = await handlerWallet.methods.transfer({                 secretKey: HandlerKeyPair.secretKey,                 toAddress: await handlerWallet.getAddress(),                 // @ts-ignore                 amount: TonWeb.utils.toNano("0.05"),                 seqno: seqno,                 payload: payload,                 sendMode: 3,             }).send();             console.log(e)         } , the issue might be in jettonWallet, because it's not really a token wallet but just a ton wallet address - i have no clue how to get the jetton wallet address from it, by using mint (reply to 63179)

Stefano Zingg: I was looking for a solution like that one and I created one for myself. It’s definitely tuned. I extracted the entire documentation and github. It has plenty of data

&rey: I'm not familiar with version named v5 currently, however I do have a wallet which can send 255 txs. https://github.com/ProgramCrafter/wallet-contract/blob/main/wallet-inplug-v2.ts#L80 is a function which can do so. (reply to 63181)

&rey: OK! Please check out the code at https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offchain. You'll have secretKey: HandlerKeyPair.secretKey, toAddress: jettonWalletAddress, ... (reply to 63184)

&rey: (Though, why do you use TonWeb with Typescript?)

Mohammad: 🙏 (reply to 63186)

Harry: Hello bro add me as contact so I can message you  or send me a message please (reply to 63188)

&rey: I doubt I could help you in DM any more than here? (reply to 63191)

Harry: I tried everything I downloaded all the app on the Dev wallet none of it open in my pc

Harry: I wanted to have a private discussion with you (reply to 63193)

User<1463408356>: no clue, i just found that lib and decided to use, idk if there is any better (maybe @ton/ton?) (reply to 63188)

&rey: Yes. Once you find out a way of including Buffer that works for your frontend build, it is better. (reply to 63196)

PRO SILVA: I'm trying to withdraw NFT from my ton wallet does anyone know how I can do this?  I use MY TON WALLET

Harry: Can't you help me manually please (reply to 63193)

Johan: Does anyone know how to calculate market cap of jetton by knowing balance, supply and price? oir anything else

Skee: Hey guys. I had this commission for a TON NFTs (as an artist), but the client disappeared few months ago without paying, so I have this huge pile of good looking graphics. Maybe there is an enthusiast TON developer here, who can help me to make very fast and simple collection of generative PFPs.  The idea is to make some kind of FORTUNE TELLING tokens. Let's say top left image is something like: In the future your NFT career will make you a Desert Duke | You can always be found in an Interpol wanted list (not presented on image) | You will travel by grey | Borsche 6911 | And you will always have Champion's Trophy | So I need a dev to make a smart-contract at TON, which will make this random generated mints. I don't really believe in a millions in return, so that's just an enthusiasm project, if you have any other motivation but prepayment, let me know, I am ready to discuss anything.

— 2024-05-24 —

minhtienhcmus: now testnet  not working ?

User<7123272744>: yes, I have it (reply to 63243)

maharaja hari singh: how to reduce disk usage of liteserver node? i set --state-ttl 21600 --archive-ttl 21600 --block-ttl 21600 in .service file but disk usage still going to 100%  can anybody help?

Maksim: what’s your disk size? (reply to 63247)

Denis_Dev: Hi, guys, maybe someone know  how to create crowdsale smart contract( presale contract) for token for presale for on the token website ? Maybe you know some companies with web3 solutions🫡🔥 who can solve this problem

maharaja hari singh: 250G (reply to 63248)

Maksim: that’s too small, get at least 512 gb disk   also check out this guide: https://docs.ton.org/participate/nodes/node-maintenance-and-security#database-grooming (reply to 63252)

maharaja hari singh: i don't want to store history of all transactions. i just need newer transactions and associated contract states.   so i set --state-ttl 21600 --archive-ttl 21600 --block-ttl 21600  in service? cant run liteserver this way? (reply to 63253)

Andr: Is it possible to transfer funds from multiple subwallets (v3r2) using a highload wallet (hv3)? I can't find any examples

Asidert: Transfer your funds to the highload wallet and distribute them from there to the wallets you need (reply to 63255)

Andr: Yeah, I'm trying to do that. But I want to transfer funds in a single transaction using hv3.   To be more clear, I'm trying to implement this: https://docs.ton.org/develop/dapps/asset-processing/jettons#withdrawals-made-from-deposits  But I can't find any code examples  for the next step: Messages are then sent to each owner address (by combining several such messages into a batch) from a highload wallet with an attached TON Jetton amount. (reply to 63256)

Asidert: I think you should read this  https://github.com/ton-blockchain/minter-contract/blob/main/test/jetton.spec.ts#L161 (reply to 63258)

Reza: Hello, when we create a wallet in tonweb, how can we get 24 words of backup?

Andr: Thanks. But transfering from one Jeton wallet to another Jetton wallet is not a problem for me. I'm looking for a way to pack multiple Jetton transfers into single external message using a highload wallet (hv3). Or is it impossible? (reply to 63260)

Mahima Thacker: Hello guys, Are there any useful tutorials on NFT Mint and store data over TON Blockchain? Could you please help me with this?   Thanks in advanced!

Asidert: It is possible (reply to 63263)

Asidert: I only have the TS code at hand, but I hope the meaning will be clear (reply to 63263)

Andr: Oh, got it. Thank you

Mahima Thacker: ? (reply to 63264)

Disha | SMBmarket: Hey guys need your help!! I want to use Tact language to mint nft on TON blockchain Are there any useful tutorials on NFT Mint and store data over TON Blockchain?   Another question is, is Tact is good choice for nft minting or I should switch with another!??

Vitor: Don't write your own contracts unless you have a reason to. Go to the getgems GitHub repo, deploy their contracts, be done. (reply to 63271)

Disha | SMBmarket: Let me do it! Thanks for the quick response :)

Paul: Hi there! Which browser is used for Telegram Mini Apps? Thanks

Hanniba1111: Hi guys，is there the template or sample of daily checkin contract?

User<6486565054>: You want to link a site to your telegram bot

Paul: please 👉👈 (reply to 63288)

kursor (Sergey Kurochkin): Anybody here using ton-kotlin lib in production with KMM? Should I use it in production? I didn't find anything in documentation about production-readiness, and the repository has not so much stars, so, I'm a little confused. And if anybody here used it (not necessarily in production), did you have any problems with it? Also, if you have any alternatives to ton-kotlin in mind, feel free to tell, we want to make a TON wallet app, now researching libs

Dri: I don’t know if this can help someone but in this repo there is expleined how to make a reveal system for NFT collection. It’s the first step, can be better… i hope it could be util  https://github.com/drilonhametaj25/ton-devils-contract

cfs chef: It looks very useful

cfs chef: But in this way mint nft seems not to be displayed in tonkeeper and tonviewer (reply to 63296)

Dri: why not? i see it

cfs chef: check at wallet address

Dri: at initial point you will see a default image that the owner of collection decide

Dri: i have it

cfs chef: good，can see at tonkeeper？

Dri: yes :)

cfs chef: i am used the same way to mint nft at mainnet, but i can`t see at anywhere🥲

cfs chef: 🫡 (reply to 63305)

Dri: oh this was on testnet, this week i will try on the mainnet, i hope it would works

Dri: but do you use a editable collection an editable nft-item?

cfs chef: uneditable

Dri: so you have the mint and the “reveal” at same time

Dri: you can check the tutorial on the documentation, you have a standard collection i understand

cfs chef: https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources i`m use this nft-item and nft-collection

Dri: ok so you deployed a collection? and also an item?

cfs chef: a collection and many items, airdrop to my community, everyone say can`t see it

Dri: can you give me the address of the collection?

Rio: hi guys how can i use websocket of tonconsole? any one know it

Nerses: Hi everyone! javascript recieve(){ emit(); send() }   Can I have such sturcture where for one internal message, emit and also send transaction ? Will it work properly and do both operations ?

Aurora|: Any guys from Ston.fi or dedust? Hope to have a talk

Andr: Could you please explain how you got the opcode 0x77e7a2d9?  A google/github search gives nothing useful (reply to 63267)

User<6326655817>: Dedust is easier for me (reply to 63322)

&rey: WebView is the term. (reply to 63288)

&rey: Up to 255 actions per transaction can work fine. Unless you hit gas limit, of course. (reply to 63320)

User<6861867033>: DM me (reply to 63322)

Nerses: I am getting messages using TON Center API https://testnet.toncenter.com/api/v3/messages?source=0%3A3fa6a4c1a0afe8df38e8a3d8717e6822d73aad0217c1f84ed00f363ba906242c&limit=128&offset=0   . How can I parse it ?

Rhonda: how to parse event ? can't see on explor

Nerses: I have same issue (reply to 63335)

Rhonda: decode from out_msgs.raw_body ?

Nerses: what API do you use ? (reply to 63337)

gavin: Yes you need to decode the payload (reply to 63337)

Rhonda: tonconsole (reply to 63339)

Asidert: Form the body of the message to suit your needs (This op is used in getgems activity) (reply to 63325)

Rhonda: Do you have any examples or documentation? (reply to 63340)

gavin: Maybe something like this  let message = transaction!.outMessages.get(0)?.body.beginParse()  message?.loadStringRefTail()

User<6462380729>: Howdy, I can build Tokens, SPL/TON NFT Marketplaces, Staking/Lending Platforms, TG miniapps/bots, and Wallet Applications. Does anyone need?

Zachary: So this guy charged me 1200$ for a making a airdrop claim contract, and asked me to deposit 2000$ worth tokens.. Which i sent both.  Now he scammed me and not giving my tokens back. Please be aware of this SCAMMER.. dont you ever do business with him, hes a liar, scammer, greedy bitch.. Above are all the transactions that i made with him.. Please stay safe from scammers and liars like this.  He agaid demanded me 100$ for sending all tokens back, but aftr sending he cleared the chat and ignoring msgs.  Please save this guy @Emillyserah1 as scammer on ur contacts, so that even if he changes name you guys can beware of this scammer with no morals

0x0liver: export function createTestClient(net?: 'testnet' | 'mainnet') {   return new TonClient({     endpoint: net === 'mainnet' ? 'https://mainnet.tonhubapi.com/jsonRPC' : 'https://testnet.toncenter.com/api/v2/jsonRPC',     apiKey: net !== 'mainnet' ? '32df40f4ffc11053334bcdf09c7d3a9e6487ee0cb715edf8cf667c543edb10ca' : undefined   }); }  async function fetchJettonData() {   let client = createTestClient('mainnet');   let master = client.open(JettonMaster.create(Address.parse('EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez')));   // let walletAddress = await master.getWalletAddress(Address.parse('EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez'));   let jettonData = await master.getJettonData();   console.log("jetton Data", jettonData);   return jettonData.totalSupply; } hello whats wrong with this code? i got error Error: Invalid address: 0. If i change address to 'EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv', it will work correctly

gavin: Maybe it's a parsing error in the getJettonData method. Can you see more code or stack information? (reply to 63351)

0x0liver: Error: Invalid address: 0     at BitReader.loadAddress (node_modules/@ton/core/dist/boc/BitReader.js:279:19)     at Slice.loadAddress (node_modules/@ton/core/dist/boc/Slice.js:321:29)     at TupleReader.readAddress (node_modules/@ton/core/dist/tuple/reader.js:81:46)     at JettonMaster.<anonymous> (build/fetchPoolStonFi.js:38:42)     at Generator.next (<anonymous>)     at fulfilled (build/fetchPoolStonFi.js:5:58)     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) (reply to 63352)

0x0liver: the question is when i changed address to 'EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv', it work correctly

gavin: I observed that this jettonmaster does not have an admin owner address, which may be the reason.

musashi: lol he sent me that airdrop contract task and a tap tap bot with reward in RECA (reply to 63350)

Zachary: Hmm 🤕 (reply to 63358)

musashi: he's quite good at scamming tbh

User<7123272744>: He is a super scammer. He always lie and asking the extra payment. Be aware of this scammer. (reply to 63350)

Matthew: hi all, why my token on dedust (https://dedust.io/swap/TON/EQAaXJnqGo8vFzax3KDJCcSvxCAAMVGvtBJkFepdXqPcMNiS?amount=1000000) show correct image and symbol but on tonviewer was wrong?

Matthew: on dedust show BOBO but on tonviewer show UKNOWN, i checked the code data of the contract, it's not wrong but tonviewer shows it wrong

0x0liver: so how can i retrieve that data? (reply to 63357)

0x0liver: the address EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez is Proxy Stonfi TON address

TON Bounty Bridge: ​R&D: Data research on the TON Blockchain meme-Coin market  Summary:An R&D investigation into the market for Meme-coins on TON Blockchain to be conducted by data scient...  Rewards: • SBT Bounty Reward • 800 USD in TON  Created by seriybeliy11

Mahima Thacker: Hello guys, I want to write a contract to Mint an NFT. In ethereum, we have been using ERC721 standard, from openzeppelin's contract but I am wondering what could be done here? Is there any way to create NFT Minting contract using Tact? Could you share the tutorial to implement it? Or is it only possible using FunC?  Note: I want to use tact to create Mint NFT contract

Alex 🥤: Hi guys, random work in testnet? When i call contract function with random inside, wallet show me who gonna win instand and its work  why?

Adapt: hi there, is there any reason the network is so unstable today, transactions submitted are not added to blockchain, waiting time is extremely high (10-15 minutes for transaction), endpoints are throwing errors all the time (including official endpoints, orbs, full nodes)?

Deny: I have same problem. I have advanced subs plan on toncenter but nothing happened like free plan (reply to 63375)

gavin: https://github.com/howardpen9/nft-template-in-tact/blob/tutorial/sources/contract.tact Maybe this can help you (reply to 63370)

Mikhail: Hi everyone. Has anyone encountered an issue where when sending a token, the contract is deployed but no tokens are sent? https://tonviewer.com/UQAUHZnvjg_O8E9_PKohpDGDPvxbxGEGhE_s0SJFo34S4UON

ecomnazar: hi, how can i open only tonspace wallet in my twa?

Mahima Thacker: Okay thank you. But is there any Dapp example using tonweb SDK which shows how to connect TON Blockchain with the frontend using tonweb SDk? (reply to 63378)

&rey: Do you want people in your dApp to not be using MyTonWallet, OpenMask, Tonkeeper and other wallets? (reply to 63380)

&rey: Does https://wallet.ton.org fit your definition of dApp? (reply to 63381)

Darkening Dawn: Are there any issues with token sending today?

Darkening Dawn: Two different highload wallets just stop sending tokens

&rey: Please check at https://tonstat.us. In general, there cannot be issues with token sending unless there are issues with all transactions. (reply to 63389)

Darkening Dawn: I receive toncoins with no problem, but all outgoing token transactoions are pending. I tried different query ids and even create new highload wallet and still I can't send anything (reply to 63393)

&rey: What API do you use for sending transactions? (reply to 63395)

Even: hi. trying to use buildStakeTxParams from STONFI sdk, but response is different with docs. what could be problem?

Darkening Dawn: tonapi.io (reply to 63396)

&rey: Could you try sending transactions through different API? (reply to 63399)

Darkening Dawn: Yes, thank you, will try! I let you know if it works (reply to 63400)

Even: may I decode it or something? New in ton (reply to 63398)

Paul: Does it mean for instance in ios WebView uses safary and for androids - google, right? (reply to 63327)

Paul: Could you tell me where did you get this info, please. Is this mentioned in any tg docs? (reply to 63327)

&rey: Please refer to @devs chat. Idk, just found that embedded browsers in applications are WebView. (reply to 63405)

Darkening Dawn: It works with orbs (reply to 63400)

TON Bounty Bridge: ​del  Assignees: no assignees Created by stenolog

Adapt: I send via orbs, tonapi, few own full nodes at the same time and over 50% transactions do not show up in blockchain despite there are no errors with sending. Crazy :( (reply to 63408)

Johan: I can't still fetch normally circulating supply...

Johan: Does anyone know how to get freaking contract address??????

Adapt: What do you mean? Explain. (reply to 63417)

Johan: I have written function in Go, which gets full jetton data, but I need Contract Address as an argument for my function

Johan: func fetchAndWriteJettonData(api ton.APIClientWrapped, contractAddress, outputFilePath string) error {   if contractAddress == "" {     return fmt.Errorf("contract address is empty")   }    contract := address.MustParseAddr(contractAddress)   master := jetton.NewJettonMasterClient(api, contract)    data, err := master.GetJettonData(context.Background())   if err != nil {     return fmt.Errorf("failed to get jetton data: %w", err)   }    if data == nil {     return fmt.Errorf("contract is not initialized or does not exist")   }    var contentType, symbol, name, description string   var decimals int    switch content := data.Content.(type) {   case *nft.ContentOnchain:     symbol = content.GetAttribute("symbol")     name = content.Name     description = content.Description     if content.GetAttribute("decimals") != "" {       decimals, err = strconv.Atoi(content.GetAttribute("decimals"))       if err != nil {         return fmt.Errorf("invalid decimals: %w", err)       }     }     contentType = "onchain"   case *nft.ContentSemichain:     symbol = content.GetAttribute("symbol")     name = content.Name     description = content.Description     if content.GetAttribute("decimals") != "" {       decimals, err = strconv.Atoi(content.GetAttribute("decimals"))       if err != nil {         return fmt.Errorf("invalid decimals: %w", err)       }     }     contentType = "semichain"   default:     return fmt.Errorf("unknown content type")   }    log.Printf("Content Type: %s", contentType)   log.Printf("Symbol: %s", symbol)   log.Printf("Name: %s", name)   log.Printf("Description: %s", description)   log.Printf("Decimals: %d", decimals)   log.Printf("Total Supply: %d", data.TotalSupply.Uint64())   log.Printf("Mintable: %t", data.Mintable)   log.Printf("Admin Addr: %v", data.AdminAddr)    jettonData := JettonData{     TotalSupply: data.TotalSupply.Uint64(),     AdminAddr:   data.AdminAddr,     Mintable:    data.Mintable,     Symbol:      symbol,     Name:        name,     Description: description,     Decimals:    decimals,     Content:     contentType,     WalletCode:  data.WalletCode.Dump(),   }    jsonData, err := json.MarshalIndent(jettonData, "", "  ")   if err != nil {     return fmt.Errorf("failed to marshal jetton data to JSON: %w", err)   }    err = ioutil.WriteFile(outputFilePath, jsonData, 0644)   if err != nil {     return fmt.Errorf("failed to write jetton data to file: %w", err)   }    return nil }

Adapt: What is the question? Do you need example smart contract wallet address? (reply to 63419)

Johan: My question is how can I can contract address of jetton by providing address of it? (reply to 63422)

Johan: https://tonviewer.com/EQDX0EAVYbTlpb_b60OHWl0q5nCmEyXEKAkZ8etyw1jV7CHL?section=jetton

Johan: Currently I have that one: which in red

Johan: But I need that one

Johan: I need jetton_master.

Adapt: This?

Johan: if its in base64 representation of which you highlighted in HEX, yes

Adapt: It's in the chain:hex format that can be easily converted into other formats with SDK libraries. (reply to 63430)

Johan: You have sent me wallet data I need jetton_data (reply to 63432)

Johan: But, one thing I need is the contract address of jetton_master type

Adapt: With address I highlighted you can runMethod get_jetton_data. (reply to 63434)

Johan: are you sure? (reply to 63437)

Alvin: Hey do you guys know whether the github repository of Notcoin is open source?

Nerses: How many bits do i need to store String type variable in TACT ? For example Int need 257

Dmitry | backend4you.ton: Strings may have different lengths. Estimate using utf8 encoding (reply to 63442)

Nerses: what if I want to load data from log message where i have field which type is string and it can change every time ? (reply to 63443)

Dmitry | backend4you.ton: Then you’ll use different bits number every time. Make ref (new cell), and store there using store-string-tail - it will create cell chain automatically (reply to 63444)

Dmitry | backend4you.ton: Are you using tact or pure func?

Nerses: the log emits the contract based on user input so I cant know size for loading bits properly (reply to 63445)

Nerses: no i use tact (reply to 63446)

Emeka: Hello

Emeka: Does someone know how I can forward TON coins from the sender to another address? I am using the tact programming language.

Dmitry | backend4you.ton: It should have something like loadStringTail (reply to 63448)

Nerses: any docs ? (reply to 63453)

Dmitry | backend4you.ton: Docs.tact-lang.org ? Don’t remember their official site exactly (reply to 63454)

Johan: its so bizarre, that doc for working with full nodes locally is extremely bad and I'm wasting my time. TON ecosystem forces to use tonapi

Cube: Can someone explain how to customize ton connect button. I mean I wanna change background, font, etc

User<6670085319>: Does anyone need a developer?

Cube: No more, u can take my one (reply to 63460)

User<6861867033>: Hello. can any body help me plz?         const internalMessage = beginCell()             .storeUint(0x18, 6) // bounce             .storeAddress(walletAddress)             .storeCoins(toNano('0.01'))             .storeUint(0, 1 + 4 + 4 + 64 + 32)             .storeBit(0) // We do not have State Init             .storeBit(1) // We store Message Body as a reference             .storeRef(internalMessageBody) // Store Message Body Init as a reference             .endCell();  at this code there's only sender's address. Where should i store target address?

&rey: .storeAddress(walletAddress) refers to target. (reply to 63470)

&rey: Source address is fit within .storeUint(0x18, 6): since validators rewrite it, it is possible to pass any address there, including null one (two zero bits).

KO: Having trouble with toncenter and tonscan? Transaction is not displayed.

User<6809510202>: i need a web3 developer.

User<6809510202>: for a gameFi Dapp (reply to 63483)

🐾ehsan: 👍👍👍

jasio: https://github.com/TegroTON/ton3-client#jettons-example

Pavel: I'm looking to run a chatgpt custom gpt as a bot in my community, does anyone know of a plug and play tool that does this, or can share a guide or something for how to build this? The gpt is already built and live in the openai gpt store.  thanks🙏

— 2024-05-25 —

Who: I can develop your custom gpt. (reply to 63499)

0x0liver: can u help me sir? (reply to 63357)

0x0liver: what is "Exoctic cell ware not supported yet" error?

Harry: guys, how to get user balance and show on tele mini app? im new here

Rich: Im thinking of building an app on TON and running some tests but it takes like 1m to do transactions. Is there a way to get around this?

Rich: Like a L2?

User<6861867033>: Use @ton/ton.  const client = new TonClient({     endpoint: 'https://toncenter.com/api/v2/jsonRPC',     apiKey: process.env.TONCENTER_API_KEY // }); client.getBalance(address); (reply to 63513)

User<6861867033>: Try this code (reply to 63525)

Vitor: With sharding, L2 as in EVM are not really a thing. To get around: take in account the message passing model, index your user facing messages early in the transaction tree, instead of waiting for the last message. (reply to 63522)

Harry: wait, so useTonAddress hook is not address we pass into getBalance function? (reply to 63525)

Vitor: Try asking in @devs , not really TON related (reply to 63499)

Vitor: You get the address from useTonAddress, then a client to fetch that address balance from TON. (reply to 63530)

Harry: mb, got error on types (reply to 63532)

Rich: bruh idk what that means ;-; (reply to 63528)

Rich: if i want to build a super fast dex, can I do that

Rich: or will tx's be not trusted

Rich: oh i see what u mean

Vitor: TON is message passing. Like, one transaction generates other ones. If you wait for the last message, it's always going to be slow.

Rich: for dex swaps i need to wait for the last one though. (reply to 63543)

Vitor: Yes, for an AMM like DEX.

Rich: so to fix this, is anyone building a L2?

Vitor: I don't think anyone is building a shardchsin

Vitor: Storm Trade works fine with perps (reply to 63547)

Rich: but tx's take 1m to execute (reply to 63549)

Rich: so you can't seriously use that

Rich: for my idea i need transactions to be as fast as on arbitrum or solana or the user experience will be too shitty

Rich: or atleast some what instant

Vitor: Idk what's the block time you're looking for!

Vitor: Hmm idk, you could build a shardchain with shorter block times

Vitor: I haven't seen anyone building it though

Rich: i can build custom shardchains? i thought i would need to make a workchain

Vitor: Workchain, sorry, it's 8am and I haven't had coffee

Rich: could i build a workchain that functions very different from the sequential way TON does compute? e.g. like ETH? or is that simply too hard?

Rich: idk i feel like there must be a reason why TON chose 5 seconds. if i go lower than that surely something will break

Vitor: Theoretically, yes. Everscale folks were into EVM compatibility, but I haven't looked too much into it. (reply to 63562)

Rich: with EVM speed? or will it still take 1m

Vitor: I don't know, i haven't tried it

Rich: hmmm ok ty. this is annoying ;-; TON would be so perfect is transaction speeds weren't insanely slow. i'll check it out

Disha | SMBmarket: Hey guys need your help!!  How we can store the metadata in Blockchain and receive?  Please provide reference as I tried many times.

Mikko: The last post to answers.ton.org is 1 month ago, and I believe nobody is clearing the moderating queue for the new posts. Is there a plan to continue this site or shut it down, as it is currently functioning?

коммунист: how to withdraw money from ton contract address? i owner

&rey: Generally, no one can. People who deployed the contract have no special privileges. (reply to 63583)

&rey: I've only heard of TON withdrawals from owned NFT balance. To do so, you can send it to yourself.

коммунист: so why then balance the NFT collection if it can be replenished but not withdrawn? (reply to 63584)

&rey: It may be a bug in its code, that it retains too much TON. (reply to 63586)

Mahima Thacker: Nope, I mean, I want to connect tact smart contract with the frontend so I believe I can use tonweb sdk, correct me if I am wrong here so could anyone please share the implemented example of how can we get the TON blockchain's data from the contract to the frontend. for example, we have been using ether/web.js in Ethereum to retrieve data from the contract to the frontend (reply to 63388)

🅰🅻🅰🅽: I found a super wierd thing with funC:  when i use s~load_coins() for loading from slice, the expected value is 10*10^9, but i get 0. then i check the total bits in s are  56 thus i  skip first 16 bits and use s~load_uint(40), then the result appears to be correct  does anyone know the mechanism behind this?

&rey: Maybe you output result incorrectly? (reply to 63597)

fabriregu: Hello guys, I have deployed a collection. The collection has centralized metadata. I have changed the cover_image but on getgems I still see the old one even if I click on refresh metadata button. Should I just wait or is there a workaround?  It's been 1h from the cover_image change

Amir: hi how do we know witch token is used in a transaction to our contract ?

&rey: You can infer it from your jetton wallet address, that sent you forward notification. (reply to 63603)

Batyr: Why do we split data into init and body? Why don't just pass everything by init state?   () deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {     cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);     slice nft_address = calculate_nft_item_address(workchain(), state_init);     var msg = begin_cell()         .store_uint(0x18, 6)         .store_slice(nft_address)         .store_coins(amount)         .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)         .store_ref(state_init)         .store_ref(nft_content);     send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors }

Amir: how can i get jetton master address from jetton wallet address ? (sorry im new to ton and blockchain) (reply to 63604)

&rey: Do you really need that? It isn't of much use, generally. (reply to 63606)

&rey: You have to store a map of jetton wallet => jetton master, if you really need lookup.

gavin: I think it’s because the correct nft_address needs to be calculated based on state_init, otherwise the message cannot be sent correctly. (reply to 63605)

Rohit: Your problem solved or not? (reply to 63602)

Batyr: Makes sense, thank you (reply to 63610)

Batyr: It would be difficult to recreate the nft address, if state has transferable owner address

Amir: i want to prevent fake jetton transfer and only accept one token . if i can get master address from wallet address i can check it with master address that i save in contract data (reply to 63608)

&rey: You can do same checking sender against jetton wallet address that you save in contract data. (reply to 63614)

Amir: tnx (reply to 63615)

Knight!: Hey, can anyone suggest me some books to learn blockchain. I find TON documentation slightly on the tougher side.

fabriregu: image is changed but cover_image not yet (reply to 63611)

Rohit: dm me code and  deployed address (reply to 63618)

BreAAth: /stat@combot

Saeed: Hi

Saeed: i sent a transaction but i didnt use a memo . so the ton coins are lost not in my wallet not in the destination wallet what can i do for it ?

Mahima Thacker: Hello guys, How can we get the Contract address in the nujan IDE after connecting it to the testnet and build the contract?

Rohit: It means before deploy? (reply to 63628)

Mr: Hello Hui, how did you solve this? (reply to 51610)

Mahima Thacker: No, no

Rohit: If you want to get after deploy ..then you get easily in log (reply to 63631)

Mahima Thacker: I am not getting an option to deploy the contract;

Mahima Thacker: From where to deploy the contract? Not getting an option for it in the IDE (reply to 63633)

Rohit: Please wait (reply to 63637)

Mahima Thacker: Will it deploy as well when I click on Build or what?

Rohit: after build successfully you get option to deploy

Rohit: please share nujan url (reply to 63639)

Mahima Thacker: Oww (reply to 63640)

Mahima Thacker: https://ide.nujan.io/ (reply to 63641)

Rohit: using testnet check any template example ...then see you get deploy option or not? (reply to 63642)

chebu: does anyone have an nft contract with signature minting implemented? would like to have a look :)

User<6893986159>: Is anyone building a meme project?

Rohit: You get deploy option or not? (reply to 63646)

Rohit: Tact or Func (reply to 63647)

chebu: tact is better, func is ok as well (reply to 63651)

Johan: Guys, one freakin' question.  Circulating supply = Max Supply - Current Balance  ???

Reza Pawtato: Mcap ?

Johan: Yep, in the end I want to calculate MarketCap. (reply to 63656)

Johan: Then, circulating supply * current price = marketcap?

Reza Pawtato: Yes

Reza Pawtato: Tokenomist understand these things

Johan: I'm writing my own "bicycle".

Johan: Something like ton-indexer, but with the part of the TonAPI/TonConsole functionality

Johan: Wanted to open source then, but after cleaning up code from garbage

Johan: because Anton.tools and Ton-indexer are bizarre

Cube: Action failed with "The process '/usr/bin/git' failed with exit code 128" Have someone faced such issue? I am trying to deploy my vue project on github pages

Johan: Wanted to create really understandable documentation and guide for that also.

Johan: Because they are not well documented.

Reza Pawtato: I get it now (reply to 63668)

Reza Pawtato: I just started out with developing, I'm more like an observer

User<1795676886>: Guys, in this TON know the gass for the fees?. Or there other units for calling?

&rey: Fees are paid in the native currency, TON. Though computation fees are counted in intermediate units — gas units. (reply to 63672)

&rey: I don't think anyone who developed on TON ever needed that? I think CoinMarketCap or whatever platform should have the definition. (reply to 63655)

&rey: Isn't it called "wallet contract which is admin for NFT collection"?) (reply to 63647)

fabriregu: hello guys, I have an issue. When connecting the @wallet... my miniapp closes and after wallet connect and I can't return back in the miniapp.  I have tried to add this code:  <TonConnectUIProvider       manifestUrl="https://......./tonconnect-manifest.json"       uiPreferences={{         theme: THEME.LIGHT,       }}       actionsConfiguration={{         returnStrategy: "https://t.me/.....myboturl...../myappname",         // returnStrategy: "back",         twaReturnUrl: "https://t.me/.....myboturl...../myappname",       }}     >  but it does not work...

Batyr: How to calculate fee in advance? When I deploy through the smart contract

S: Hi. I have questions about safe transactions. Can someone help me?

Enoch: i am trying  a  transfer notification but i keep getting this error

Sunil: Enter wallet address (format: raw or base64):  Example: EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC

Sunil: Where i find raw or base64 wallet address?? (reply to 63688)

Alejandro: They gave me the bot that I had in my telegram but it was deleted

Narek: Hey everyone, do you know any Jetton contract github repo in tact?

Angel: I know it. If you want to deploy your own token to testnet or mainnet, you can do it by clicking one button with some fields related to your new token - name, symbol, decimals, total supply etc. If you need my help, DM me. I am available 24/7. (reply to 63704)

Narek: I just need Jetton code, for learning purposes (reply to 63710)

Angel: I recommend this repo for you. https://github.com/EmelyanenkoK/modern_jetton (reply to 63711)

Narek: thanks, but it’s in func :/ (reply to 63712)

&rey: Ask those! (reply to 63683)

Angel: Are you looking for Tact? (reply to 63713)

Narek: yeah (reply to 63715)

Nxrix: Is it possible to make a transaction of 0 ton and just send text comment?

Johan: But it's cringe, if I will fetch wider information about jettons through API of coinmarketcap and whatever except using FULL NODE OF TON!!! (reply to 63675)

Johan: yeeeeeeeeee

Johan: Is there any senior dev in TON? :P

Angel: what do you need? Please explain in more detail. (reply to 63722)

PRO SILVA: I'm trying to withdraw NFT from my ton wallet does anyone know how I can do this?  I use MY TON WALLET

Quyết: I need help with stTon money transfer

Johan: I need help with fetching properly data from full node of TON.... (reply to 63723)

Alan | Torch: i want to send a dictionary to get method with key in bigint type and value in coins type, but ok? is true and load_coins is 0, why?

Alan | Torch: Is there any funC master here?

Andrey: Second argument -> begin_cell().store_uint(1,8).end_cell().begin_parse() (reply to 63733)

Andrey: Second argument must be slice (reply to 63737)

Alan | Torch: oh thanks, but i define the dictionary offchain and send it on-chain

Andrey: And v~load_uint(16) (reply to 63733)

Alan | Torch: do you mean i should define Dict<int, slice> ?

Alan | Torch: but the type is expected to be coins, and i check funC cookbook, it says coins is a varuint16 type

Alan | Torch: i am really confuse about that

Andrey: balances.udict_get(8, begin_cell().store_uint(1,8).end_cell().begin_parse()) (reply to 63733)

Alan | Torch: but i think i don't need to change the key itself, becuase when i dump ok?, it is true, means the key exists (reply to 63745)

Alan | Torch: however the value is still 0

d: Hi guys, I'm new in ton, so please forgive me if I'm asking a stupid question. But I'm trying to figure out how I can handle receiving jettons in my contract. I understand that I can receive a Transfer Notification Message, but how can I verify what jetton I received?

User<5435924052>: I'm highly accomplished web3 developer having extensive experiences of building web3 projects on EVM , Bitcoin L2 , Solana , Cosmos , Radix , Ton etc.

ayushag: Why this error?

— 2024-05-26 —

Kotin: Looking for contract developer expert in Ton network Dm me if you are interested in me Salary rate: $500 / weekly

Luis H: How to report scammers?

meomeocoj | Mike: Hi, i'm developing a bridge between cosmos and TON. I've faced the chanllenge that reaching  the gas limit when i verify all the information of cosmos chain. Is there any OP or function to set gas limit ? Or just optimize code and split it to small chunks ?

Luis H: Also Telegram ads aren't working

Jim: dm me (reply to 63778)

Ryo: Hello !!  After updating to mytonctrl2  MyTonCtrl> status   When I execute the above command, an error is output.  Error: 'list' object has no attribute 'items'  How do I resolve it?

Fereshte: I'm trying to send message with my transaction with this code..But when i check tonScan there is no message in the transaction: val transferMessage = wallet.transfer(privateKey,                 WalletTransfer {                     coins = Coins.Companion.ofNano(100) // 100 nanoton                     destination = AddrStd("kf8ZzXwnCm23GeqkK8ekU0Dxzu_fiXqIYO48FElkd7rVnoix")                     messageData = MessageData.text("Hello, World!")                 })

Steven | SC: Can i get some bnb for gas fee. Is there any faucet can anyone help me

maharaja hari singh: i have a question for node operators.  is there a dump for 1 month or 1 week like 3 month in dump. ton. org ?

Алексей: Hello everyone! Please tell me what jetton implementation now is the most acceptable and standart? Thanks

&rey: Any conforming to TEP-74: they are mostly equal. The factor should be gas usage on transfers. (reply to 63823)

Алексей: Ok, thank you. (reply to 63828)

Mr: gmgm - what is the best way to retrieve all the jettons and the relative balances that a wallet has?

kevin: There are multiple way to do that, first is TONAPI v2 (reply to 63833)

Mr: which call would you suggest?  as i was checking as well the ton api v2 but i couldn't find any method that was supporting this for jettons: https://testnet.toncenter.com/api/v2/#/  jettons not TON tokens (that i can easily get in many ways) (reply to 63834)

&rey: Please read carefully, this is generally critical in TON ecosystem. The person above suggested https://docs.tonconsole.com/tonapi/api-v2, not the Toncenter API. (reply to 63835)

Mr: oh thanks so much for the clarification - yeah is a bit confusing 😁 (reply to 63838)

Maksim: please use command  set debug true --force  then use status again: there should appear error backtrace (reply to 63806)

Pixel: Does anyone need a developer?

User<6702515304>: yh (reply to 63847)

Bart: Hello im Allan. Founder of aspiresolns [dot] org  we are organizing a virtual hackathon and local hackathon in Singapore. Who can I contact for partnership.

Неоспоримый: Hello everyone. I do one project, which will familiarize users with cryptocurrency, with ton, I am alone and do not have time to do a lot, so I am looking for helpers, I will be glad and advice on improving the project. Link in profile

Angel: I can help you mate (reply to 63856)

User<6327676316>: when deploy using blueprint, I always get this error now

Angel: work on tesnet or mainnet? (reply to 63860)

User<6327676316>: mainnet

Angel: it is because there is no healthy nodes in ton network

Angel: Please keep trying until success

Angel: You will be successful in 10~20 times

User<6327676316>: haha

Johan: Guys, can you help with setting up Anton indexer??? Even creator of this project can't answer in time...

Johan: Everything started correctly

Johan: But here is the error: {"level":"fatal","error":"cannot add connection with 173.212.213.171:45541 host and HDLR03qlqOTmd99Xk52tW8bHtGgq0scx6IJe6gCFCmk= key: dial tcp: lookup -1378560597: no such host","time":1716742584,"caller":"/go/src/github.com/tonindexer/anton/main.go:48"}

Johan: I have specified normally

Johan: @iam047801

Johan: Please help

User<6327676316>: but can't see transaction in tonscan

User<6327676316>: because of unhealthy node?

User<6327676316>: please help me @Angels_120

Angel: Not sure now. did you write this smart contract yourself?

User<6327676316>: yes

User<6327676316>: deployed already

User<6327676316>: but when I send a message to set contract data, it doesn't work

Angel: please share code snippet that you interact now

User<6327676316>: receive(msg: SetJettonWallet){         require(context().sender == self.owner, "no owner");         self.this_contract_jettonWallet = msg.wallet;     }

User<6327676316>: const jettonWalletAddress = await jettonContract.getWalletAddress(staking.address);     // console.log(jettonWalletAddress);     await staking.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'SetJettonWallet',             query_id: 0n,             wallet: jettonWalletAddress,         },     );

Angel: what issues are you facing? (reply to 63894)

User<6327676316>: no issues

User<6327676316>: but can't see transaction in tronscan

Angel: Did you write scripts in the smart contract?

User<6327676316>: yes

Angel: When you run script, does it work well?

User<6327676316>: yeah

Angel: If then, you might not integrate the frontend with smart contract correctly. Please check parameters again. (reply to 63910)

User<6327676316>: so that's not node problem?

Angel: yes, it is not related to nodes, I think (reply to 63916)

Made by: Sup guys! Could you please clarify for how long will the contract still be responsive (like for triggering getters) when it’s balance reaches zero?

Made by: I mean when it’s no longer capable of paying rent

0x0liver: what is this problem Error: Received error: {"ok":false,"code":null,"error":"Exoctic cell ware not supported yet","id":"1"} when i try to get USDT Token Master

— 2024-05-27 —

&rey: Until its balance reaches -0.1 TON, then any internal message freezes it. (reply to 63930)

Ryo: Thank you very much for your response.🙏 I have followed the steps as you suggested. It printed out fine once and then it continues to print out the same error. (reply to 63844)

Том🥷🏿🏴‍☠️: Hello everyone, can anyone tell me if there is a Python library that will help you find out the wallet address and balance through mnemonics, or generate a new wallet and save its mnemonic phrase?

User<6327676316>: when I try to get address of jetton wallet, I always get this error

User<6327676316>: It is normal?

&rey: Please try again, Orbs should be OK now. (reply to 63958)

User<6327676316>: same again

User<6327676316>: all nodes of TON is unstable like so?

Angel: In the past, did it work well? (reply to 63964)

User<6327676316>: sometimes works and sometimes doesn't

User<6327676316>: can't show client

User<6327676316>: I can't say them it is stable

Angel: yes, it often happens (reply to 63966)

User<6327676316>: it is only my problem?

User<6327676316>: there are any other stable nodes?

User<6327676316>: it is also normal?

User<6327676316>: I has this error on test net

Angel: It is also nodes problem. (reply to 63986)

️: hello, I see some scanner bots can check whether a pool has liquidity lock or a token have revoked rights  how can I do the same in Python? DEX Screener / GeckoTerminal API don't have this information, in DeDust I don't see any info about lock

Harry: guys, how you fix this.. i tried install Buffer and create polyfills but not working

&rey: You're trying to call method on an uninitialized contract. (reply to 63985)

Harry: i try to getBalance with TonClient (reply to 63991)

&rey: Please search this chat for more ways to install polyfills. To my knowledge, no way has yet worked across all building systems. (reply to 63990)

User<6861867033>: const client = new TonClient({     endpoint: 'https://toncenter.com/api/v2/jsonRPC',     apiKey: process.env.TONCENTER_API_KEY // you can get an api key from @tonapibot bot in Telegram }); const balance = await client.getBalance(Address.parse(user!.walletAddress)); (reply to 63993)

Harry: can i do like this (reply to 63995)

User<6861867033>: in terms of address. you can do like that. (reply to 63996)

Harry: ohh, i fixed it.. mb, i use vite but i try to fix it like normal react-app (reply to 63994)

Donn: cannot upgrade mytonctrl2 smoothly  show following error when i try to run mytonctrl, right after execute update https://github.com/ton-blockchain/mytonctrl/tree/mytonctrl2  Exception: lock_file error: time out.

perfogic: hello devs

perfogic: how to increase gas limit of tx

perfogic: @pcrafter hello can you check for me ? from config of masterchain it is 1000000 gas limit for tx but block is 2000000 is there any way to increase ?

&rey: No, save for contacting validators. (reply to 64010)

perfogic: somehow 1000000 is kind of barrier for doing hardwork on contract that LOL :D

perfogic: so running a validator canincrease tx size ? (reply to 64011)

&rey: No, validator voting can change config. (reply to 64013)

perfogic: damn 😂 that chance is nearly zero only if your team make an announcement

&rey: Because, maybe, contract shouldn't do too much? After all, messages have to be atomic, they aren't processed in parallel (at least those sent to the same contract). (reply to 64012)

perfogic: yup we are gonna do a way to create a merkle proof with 100 items => gas limit is larger than that

perfogic: maybe i should find a way to optimize

️: is there any way to detect honeypot using ton api / dexes api / screeners api?

Slava: If really needed you can do it in batches, just send a message to yourself to start another batch. (reply to 64012)

perfogic: can you give me example of that ? (reply to 64027)

Donn: hi admin @slavafomin , can you help on liteserver upgrade issue ? (reply to 64001)

Slava: The closest example I know of would be the highload wallet v3, I guess.  There is nothing conceptually difficult here, you just need to find a way to split your work into portions and somehow persist the execution state either inside the contract or in the message itself. (reply to 64028)

Slava: I don't remember encountering this error. Make sure your node is updated to the latest non v2 version before doing the upgrade. (reply to 64029)

Jimmy Becen: Hi guys, Does`https://testnet.toncenter.com/api/v3/#/default/get_transactions_api_v3_transactions_get` work?

&rey: Gas limit is not larger than that. At least, if you use native exotic cells. (reply to 64017)

Donn: ok..i see. thanks for advise. one question, what if i cannot sync up before 6/2. does that mean i better to sync from 0 ? (reply to 64031)

Héctor Enrique: Hola

Rohit: Has anyone tried receiving external messages in Tact and successfully written tests for it?

Hossein: I'm interested in learning about the typical processes involved in freelance work, particularly within the Ton blockchain development community. What has your experience been like? I'd appreciate if you could share your insights on the best ways to communicate and approach a freelance project from both the requester's and the developer's perspectives. Please feel free to provide your own comments and perspectives in your reply.

Sol: Hello . I'm looking for simple tasks

Ryo: Now an error is output as follows. What can I do to fix this issue? Any advice would be appreciated. (reply to 63844)

Maksim: what does get saveOffers returns? (reply to 64044)

Ryo: Returns an empty array.

Maksim: please, use command   set saveOffers {} --force it should fix the problem (reply to 64046)

Ryo: OMG 😭 (reply to 64047)

Ryo: Thank you so much!!!❤️

Long: [TON_CONNECT_SDK] Cannot unpause connection Error: [TON_CONNECT_SDK_ERROR] I Operation aborted

Long: When i connect ton wallet on extension brower

Jimmy Becen: https://testnet.toncenter.com/api/v3/masterchainInfo only indexes "utime": "1716738445". Is anyone dealing with this?

MA: hello guys,  I have multiple address that should detect if any amount of ton or Jetton deposited  or withdrawn. what is the optimum way to do that? in other Block Chains I checked all blocks but in ton because of multiple Block Chain it is not possible.  I also try using TonAPI with actions event but it is very buggy in high load situations. what is the other option ?

fade: optimum way is to have your own node and create an indexer, example can be found here for golang and here for python  in other Block Chains I checked all blocks but in ton because of multiple Block Chain it is not possible  it's possible, just a bit complicated, take a look at the links above  also take a look at anton and ton-indexer (reply to 64059)

&rey: Then, what does this code do? https://github.com/yungwine/pytoniq/blob/master/examples/blocks/block_scanner.py The problem might be amount of information. (reply to 64059)

Angel: I have NFT smart contract. I want to get NFT holder lists. How to get it? we can see this collection in getgems. Does getgems provide API?

Oleg: Hi  Can ton node work with archive blocks without activated wallet?

User<7021277711>: Tonapi.io (reply to 64063)

Angel: Which method should I call? (reply to 64065)

MA: I said that because I read somewhere that the ton can be seperetad in multiple and infinite blockchain in theory. Is that true? If it is, so it would be very difficult to write a stable code to work in this scale. Is that true? (reply to 64062)

User<7021277711>: /v2/nfts/collections/{account_id}/items (reply to 64066)

Angel: Can this account_id be smart contract address?

fade: You'll be able to get all the shards, pytoniq's indexer is stable, opentonapi's one has a bug which cause it to miss some shards occasionally but you'll figure it out after some debugging. My own indexer has never missed a single shard so you shouldn't be worried about it (reply to 64067)

Angel: I have NFT smart contract address. How to NFT minter addresses from this smart contract address?

fade: @pcrafter hey, sorry for the ping, do you happen to know how does tonapi get external-in messages from the pending queue (mempool)?  For example sometimes tonviewer displays a "pending" transaction with full trace as if it has went all the way through, this is done by emulating the external-in message, I've looked at their code. But once the external-in message is accepted (included in the masterchain), they show the real trace and no longer the emualation.  Perhaps they're getting that data directly from RocksDb instead of lite server api?

Tim: they get data from their own api servers that send these requests to network (reply to 64073)

fade: I don't think so, I've tested submitting to my own node but they still show up as pending on tonviewer, but not always (reply to 64074)

fade: Reading ton node code, I couldn't figure out how the pending queue is processed but I don't think it stores the queue in the database, so they must have modified their node in some way

Long: ton conecction on website use js

Long: Error networkerror when attempting to fetch resource

Long: extendsion tonkeeper

Long: help me

Artem: Hey! Is there way to reliable send external? To be sure it will appear in blockchain. Because I tried send with Liteclient (using pytoniq) + toncenter, but 2-4 of 10 externals are lost.

Tim: send to more apis

Milad: Hello. I need to ignore all incoming transactions without payload(comment). I read the comment and check it in recv_internal. But it ignores all incomming transactions with and without comment. What is wrong? Actually the transaction fails with exitcode -14

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 52 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 32  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Maksim: whats your current mytonctrl commit hash? you can check it in status page (reply to 64001)

K.: -14 means out of gas error. (source) (reply to 64090)

K.: I think you need to add impure to the read_comment function to make it work. More info: https://docs.ton.org/develop/func/functions#impure-specifier (reply to 64090)

Mahima Thacker: Hello guys, I want to connect tact smart contract with the frontend so I believe I can use tonweb sdk, correct me if I am wrong here so could anyone please share the implemented example of how can we get the TON blockchain's data from the contract to the frontend ?

Oleg: is it ok in logs? i see it occasionally  ==> /var/ton-work/log.thread27.log <== [ 3][t27][2024-05-27 10:07:29.508619124][liteserver.cpp:84][!litequery] aborted liteserver query: [Error : -503 : timeout]

Donn: hmmm, i already resync my node. will try again when it fully sync later. thanks for reply anyway. (reply to 64093)

Milad: Thank you. Let me check it (reply to 64095)

&rey: I believe they [mostly] record messages sent through tonapi (in particular via Tonkeeper). (reply to 64073)

fade: yeah I've looked at their code and they do that, but somehow they also got the messages i submitted to my node so i suspect they're running a modified version of ton node to allow them to retrieve data from the pending queue (reply to 64100)

Milad: https://testnet.tonscan.org/address/EQB5O0F5r3CNIuCOUakYP7rOb-ju6RCnwqv3RB1bmxxz2jtc  It didn't change the result. This link shows my test transactions (reply to 64095)

K.: It's still out of gas, you are sending too little TON I think. What mode are you using to send the message? (reply to 64102)

Milad: send_mode=SendModeEnum.ignore_errors | SendModeEnum.pay_gas_separately, (reply to 64103)

FAHIM HOSSAION: Withdraw not success

Aibar: Hi Whats the best place to get ton jettons price feed?

Aibar: Price and all other info?

FAHIM HOSSAION: O

K.: Try sending more as value with the message. Also, would probably be more beneficial to test the contract with @ton/sandbox (npm package) while in development. (reply to 64104)

Milad: Well. Thank you. Now the transactions are ok. But the code does not revert the transactions without comment. (reply to 64111)

K.: Yes, because you are not throwing an error. Do a throw(100) (or any number above 1) to bounce the message. Put it after you detect that the message/comment is empty. Also can do throw_unless() with the result of checking the comment. (reply to 64112)

FAHIM HOSSAION: b820a7313d0b186feb7e0011faf99e045daa7e69a11569f7ced609ea50147fa7

FAHIM HOSSAION: Withdraw not successful

0x0liver: what ís the error of my transaction?  https://testnet.tonviewer.com/transaction/2dda4f3e96f0369ae0aa5886606efe5f7ce5a8dc736f3a50ae0ffeef50d700c3  can someone explain it....

Farid: How can it be possible?:  The wallet: 0QDKIhHPskcUN-bZETgr8yPGl8VPMAJpVQf6Jloj4gFf9Epv  In one explorer it has no NFT and Jettons, but in the other — it has 1 NFT and some Jettons

Angel: In test ton scan, they don't show them. You have to check all in tonviwer. (reply to 64120)

Angel: Hi, all. I have NFT smart contract address and want to get NFT minter address not current holder address. How to get them?

Farid: Hm, ok. Can you, please, tell me, testnet — is the different WHOLE blockchain? (so it has it's own master chain and base chain) (reply to 64123)

Angel: Testnet and mainnet are two distinct environments in blockchain ecosystem. Each of these networks operates independently, having its own master chain and base chain. (reply to 64126)

Artem: Am I right that we have TonApi and TonCenter? Or there is something else? (reply to 64088)

Nerses: I have created such field in my struct dstAddresses: map<Int,String>;  and get error Unsupported map value type String . Isnt it correct usage ? if not how to create array of strings in TACT ?

Vsevolod: Hello! My friend and I have been developing a prototype of the @expattech_bot bot for some time, but we were never able to bring it to some kind of real production (or did not want to). I don't really want this work to disappear and perhaps it will be useful to someone, so I will be happy to sell it along with all the sources.

Rohit: Share screenshot of code (reply to 64134)

Nerses: I already foind in documentation that I cant create mapping from int to string.So it caused the problem.Thanks anyway (reply to 64147)

Milad: Thank you. Finally it worked. Here is the test transactions:  https://testnet.tonscan.org/address/kQAZKXNO5yNIbvXYItPK_A8tpYuqOtx6N5178_RVCn046MJH  I have another question. If the transaction is not bounced how can i return the amount. I sent a non-bounced and error was thrown. But the amount added to the wallet (reply to 64113)

Narek: Hey 👋, how to enable testnet on Telegram wallet?

slavagm: You can't (reply to 64156)

Narek: mytonwallet doesn’t work

Narek: do you know how to fix this?

ㅤ: Я выводил тон с криптобота около двух часов назад, но криптовалюта не пришла. На тонвиевере написано что средства были доставлены. В кошельке их нету. Что мне делать?

Andrey: Hey! We have added archive servers to @liteserver_bot  If anyone needs a stable archive lite-server - welcome 🙂

Sunny: Use tonkeeper for testnet (reply to 64156)

Narek: configuration is missing to switch to testnet

&rey: It's been updated. https://t.me/tondev_eng/58727 (reply to 64168)

Nikku.Dev |: It is very confusing can any body help , i'm viewing the transaction history

Nikku.Dev |: in the ton keeper wallet and all the transactions weather it is mainnet or testnet all are in same component

Nikku.Dev |: can we filter out

&rey: Probably the transactions you meant to execute in testnet were executed in both mainnet and testnet? (reply to 64184)

&rey: You shouldn't use same wallets, since signatures are compatible across mainnet and testnet. (Due to some historical oversight leading to them having same subwallet ID.)

Nikku.Dev |: How its possible I’m selecting testnet from vs code and it generated a link to open ton keeper wallet and deducting 0.05 TON for wallet deployement (reply to 64187)

&rey: Please check mainnet wallet; probably same 0.05 TON were deducted from there as well. (reply to 64189)

Rasoul: Hello guys, we want to start an exchange similar to xrockt, the question is, how should we create a personal address for each user on the TON network? Our backend is written in Python

&rey: Have you consulted Advanced Asset Processing section on docs.ton.org? (reply to 64196)

Rasoul: I am looking for a sample script (reply to 64197)

Rasoul: Which part of the document do you mean? (reply to 64197)

&rey: Oops, seems it was only an example script on Github. Here it is: https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js. (reply to 64199)

Sleapy: Hello, I was about to upgrade my server for my liteserver (I want a clean install, the last two update of mytonctrl did not do well) I was wondering what is it more important, number of CPU cores or single core speed ?  Should I go with a 16/32 core/threads with excellent single core score   Or a 64/128 core/threads with low single core score but high multi core score ?  I ask this because a client on Ethereum is better with a high speed single core since you can't validate blocks concurrently

&rey: Disk storage and random-access speed seems much more important than either. Though TON blocks generally should be validat-able in parallel. (reply to 64204)

Rasoul: There is no script for Python? (reply to 64200)

Nerses: is ctx.sender and sender() same where ctx: Context = context() ?

Sleapy: Yes of course nvme disks is mandatory. I was opting for the multi core server because ton is parallel friendly (reply to 64205)

Sleapy: Another question, my actual db size is 1.4tb and when I do a db grooming it is still 1.4tb. is that normal ? I remember it was much lower before

&rey: No. I'd assume such solutions are closely protected, being a critical piece of infrastructure. (reply to 64206)

&rey: Probably TON became much more active? (reply to 64209)

Sleapy: Lol (reply to 64211)

Sleapy: If by active you mean "notcoin activity"

&rey: I mean transaction count. Notcoin activity did increase it, with all vouchers and redemption. (reply to 64218)

Sergei: Hi folks.  Is there an alternative to orbs to reduce a number for 503 response?

&rey: You mean to make it 200 or something other? (reply to 64226)

Sergei: I mean I have a project, and we use orbs for frontend. And for the last 2 months 503 error has been appearing too often.

Sergei: 503 as answer for our request to orbs

User<5018886941>: Hello

Johan: Why TON devs created extremely complex thing, which couldn't be investigated easily......

Johan: Hey, if you experienced enough to help me with exploring blochchain through node of TON, you're lucky, I can give you free access to node (reply to 64226)

Johan: you won't get 503 error anymore

Sergei: Thanks for suggestion, but I can't go in production   with unknown service under the hood :) (reply to 64234)

Johan: But if you want speed, then setup own Full Node (reply to 64237)

Johan: Contabo is the best choice among others

Johan: TON recommends bizarre providers

Sergei: it's overkill :) (reply to 64238)

Johan: Why (reply to 64241)

Ἀρτεμής: Hi

Johan: Maybe you're right, I have issues with getting enough info to calculate for example marketcap of jetton, its freaking hard......

Sergei: because it's a small marketplace for NFTs wich used in fighter :)

Johan: I have a headache....

Johan: I see (reply to 64246)

Sergei: we have some experience in building indexing system for TON fork :) (reply to 64245)

Sergei: something like chainalysis :)

Johan: I'm crying, it's goddamn hard to deal with needed data....

Johan: Nobody can't help

Johan: They are just using tonconsole, tonapi and other ready APIs

Johan: I hate TON blockchain 🥲

User<6907310132>: Hi, I am very excited to join this community. This is TON blockchain developer. During my wok experiences, I've developed some telegram bots, mini apps, game, and smart contract. If you are looking for a developer, I would like to work with you.

Johan: Can you work with ton node? (reply to 64256)

Angel: Can you help me to get NFT minter addresses from contract address? (reply to 64250)

Johan: I suppose nobody can't deal with blockchain through Full Node except the team of Pavel Durov

Johan: Might be I need to get a ticket to the office in Dubai

Johan: Book a flight

Johan: Hopeless devs

Sergei: You can write me in PM about your task. As I said, we have great experience in making indexing data solution for Venom blockchain (it's a deep fork of TON). So, may be can help you (reply to 64259)

Johan: You are co-founder of Venom? (reply to 64264)

Sergei: no (reply to 64265)

Sergei: just did some work for them

БОГАТЫЙ ОТ КРИПТО: I transferred the money. And moved back. But why are there no assets in my receiving wallet? The transfer party has successfully confirmed

БОГАТЫЙ ОТ КРИПТО: I transferred 117.2 TON to the wallet. And transfer it back to the wallet from which it was transferred. There is some confusion about this in Telegram. The two histories of outgoing and returning money transfers are very clear. But I didn't receive the money

Rahul: 🚨🚨🚨 Do not connect your wallet to the website you dont trust or you dont know about it through official groups. Your wallet might be wiped and transferred all assets to the hackers wallet.

&rey: In general, if you received money from some address, then return to this contract is not guaranteed to work.  Where did you send money second time? Did you use appropriate memo/tag/comment? (reply to 64278)

Bolkia: Yes, I did (reply to 64289)

БОГАТЫЙ ОТ КРИПТО: The transfer is to the wallet directly in Telegram. However, when you transfer back, it is back in the wallet managed by the Ton system. This is quite unreasonable for users. Very difficult (reply to 64289)

БОГАТЫЙ ОТ КРИПТО: No one has dedicated Support to solve the problem. It's very frustrating to use this platform

&rey: Different systems, different rules, yeah. Please contact support indicated in @wallet (there was one last time I looked); probably use non-custodial wallets. (reply to 64291)

Ramedon: Hi guys 🖐 Could you please advise how to send jettons via pytonconnect lib in python?

fade: what's hard about calculating market cap? (reply to 64245)

User<5323537699>: Looking to hire a TON dev for a dapp, please DM

Johan: Like I wanted to calculate market cap also for Proxy TON(TON) and USDT and this kinda jettons...... because I'm making tool, little tool like an indexer for using with config of full node and wanted to make it Open Source.... (reply to 64301)

Johan: After completing these features

Abdullahi: Ok

Duc: hi everyone, somehow my message is automatically deleted

Duc: is there some kind of rule in this chat?

Duc: i'd like to ask a question about block extra of block data

Duc: im using lite server (ton-lite-client) to get block, but its data seems to not include BlockExtra

Duc: do you guys know how to retrieve block data including block extra? any json rpc or api is fine

Duc: thanks!

Ma><im: please tell me how can I do the same in TypeScript?   ‘’’ let address: Address = Address.parse(“Some address”) ‘’’  how do I get these 256 bits out of the address variable of the Address type after the first 9 (in which the workchain and flags)   I tried it like this:  ‘’’ let addr_cell: Cell = beginCell().storeAddress(address).endCell()  let result: bigint = addr_cell.beginParse().skip(9).loadUintBig(256) ‘’’   but as I understood it, it did not work out…  if there are alternatives?

WH: Has anyone ran a node from before? What specs do you recommend? I think im seeing some memory leak running node validator node via mytonctrl was wondering if anyone faced something similar

Luis H: Why we haven't created topics in here yet??

Luis H: Isn't 10k members enough for that lol

— 2024-05-28 —

Adam: guys what is this exactly https://tonviewer.com/EQBUeOcBJgpm4sbtvaVt6-030UlgloHRuM27Qnbrn6dVpzgg

0x0liver: how to calculate tx hash before sign and send to network?

lin: May I know how to deploy my wallet contract instead of using v4 or v3 versions

&rey: It's their automatic policy, actually. Maybe you hit ticker of a jetton already registered in their system. (reply to 64324)

&rey: Because this chat is for development on TON only, and even hiring or TMAs have different chat (@tonhunt or @devs respectively), maybe? (reply to 64351)

&rey: Why first nine, actually? There are eleven bits of flags and workchain. (reply to 64339)

0x0liver:   const payloadBoc = await params.payload.toBoc();   const payloadBuffer = Buffer.from(payloadBoc);   const bocCell = Cell.fromBoc(payloadBuffer)[0];   await contract.sendTransfer({     seqno,     secretKey: key.secretKey,     messages: [       internal({         to: params.to.toString(),         value: totalTonTransfer,         body: bocCell,         bounce: false       })     ],   });   console.log(bocCell.hash().toString("hex")); why my tx hash is not equal tx hash in explorer

Luis H: yah I get that but even with development you will have different subcategories IE someone looking to hire or someone looking for work.. Front end dev / back end dev / wallet creation / bug report / and so many more.. just too busy to type (reply to 64376)

0x0liver: do you find answer yet? (reply to 26133)

Angel: Looking for NFT expert in Ton blockchain. DM me.

ly: Hi guys ! how to deserialize a cell data? is there any api ?

&rey: Cell.fromBase64(...).beginParse() and then load data by scheme you want. (Cell doesn't have its data scheme.) (reply to 64387)

Angel: How to get NFT minter addresses from NFT collection smart contract address or each NFT address in Ton?

&rey: It isn't stored. (reply to 64390)

Angel: If so, how can I get them? (reply to 64391)

Angel: What api should I use to get all transactions related to special NFT address? (reply to 64391)

User<6031319387>: How to auction expired domain names? There are many domain names that have expired for several months and have not been released for re-auction.

Racie: hey everyone

Disha | SMBmarket: 👋 Has anyone created a simple NFT minting smart contract using Tact, Func, or any SDK/library?

User<6031319387>: Does anyone know how to re-auction an expired domain name?

Chiril: Did I got right that the domain name I’ve got next year would be auctioned? (reply to 64405)

User<6031319387>: Renew once a year and it will not expire

Angel: Please check Ton document. You can find the sample there. (reply to 64404)

Disha | SMBmarket: wanna do it with Tact but see the doc 👀 https://docs.tact-lang.org/cookbook/nfts (reply to 64409)

User<6031319387>: ？ (reply to 64405)

Aibar: Hi What's the best place to get on chain data about the tokens on ton?

Yuri: Hello everyone,  We're looking for a TON dev to help with the contract work. Our next demand would be to develop an airdrop contract with merkle proof. Anyone interested? React to my message and send me a DM!

Johan: GUYS, is there any service/API which provides APIs for getting market cap of popular jettons of TON ecosystem?

Johan: For example if I want to save market cap number in $ of TON or for USDT

Johan: @pcrafter (reply to 64418)

Aibar: dexscreener gives mcap (reply to 64418)

Johan: I don't need that :D (reply to 64425)

Johan: and dexscreener doesn't provide free api for market cap fetch

Mona: hello

Mona: How can i transfer jetton tokens from one wallet to another using typescript

Johan: I got what I wanted: https://api.geckoterminal.com/api/v2/networks/ton/tokens/EQB4gPfG0YtoiJHCMTUuzxP9fKXy9nx6TFh-dcAltrnNpLNo

Mona: Please i need help

kevin: I got some idea but not going talk in public, DM (reply to 64418)

K.: Here you go: https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer (reply to 64429)

Angel: How can I get all NFT minter addresses from NFT collection smart contract address? Please help me. (reply to 64434)

Johan: let's go (reply to 64432)

Mona: thank u got it (reply to 64434)

K.: That's definitely not something available from the smart contract itself, so you probably have to work with data from an explorer API. (reply to 64435)

Angel: yes, I am trying to find exact API but still did not find it. (reply to 64439)

Aibar: do you think geckoterminal is the best place to get the token info on ton? (reply to 64430)

Aygun: /stat@combot

Johan: Because it at least gives opportunity to fetch market cap also and other useful data about jettons (reply to 64441)

Johan: That's not the best choice, but its one of them....

Aibar: What’s the best choice?

ly: hi guys  how can i get signature from TonConnector instance ,is there any api like this code :" tonConnecter.signMessage(message)"

Johan: is swap transaction shows swapped token result in out_msg ?

Johan: @pcrafter (reply to 64455)

kevin: amount_0_out indicates how much you swap out from the pool (reply to 64455)

Milad: Thank you. Finally it worked. Here is the test transactions:  https://testnet.tonscan.org/address/kQAZKXNO5yNIbvXYItPK_A8tpYuqOtx6N5178_RVCn046MJH  I have another question. If the transaction is not bounced how can i return the amount. I sent a non-bounced and error was thrown. But the amount added to the wallet (reply to 64113)

Negar: hi i want to verify jetton wallet address from sender using jetton wallet code  i know master address and my_address() and jetton_wallet_code is right but im keep getting 707 exit code  throw_unless(707,             equal_slices(calculate_user_jetton_wallet_address(my_address(), master_address, jetton_wallet_code), sender_address)  );

БОГАТЫЙ ОТ КРИПТО: No one is responsible for Support in TON?

K.: I am not sure of your use case, but if you really want to return funds if there is no comment, then you probably need to send them back from the contract manually. Otherwise, does it really matter for your use case to not receive any balance to the contract? (reply to 64461)

&rey: There is no general support for correcting wrong actions in blockchain, and there can't be. Custodial services can provide support for returning funds from wallets they control; for other dApps this is not possible. (reply to 64477)

БОГАТЫЙ ОТ КРИПТО: I'm asking in the TON system service on telegram. (reply to 64479)

User<6031319387>: 没有人知道吗？ 管理员呢？ (reply to 64405)

Milad: Yes it is. I want to prevent any income transactions without comment. For bounceable transactions it works now. But about nonbounceable transactions it shows fail but the amount does not return. I throw an exception but it seems like it works like a warning. It doesnt cancel the whole transaction (reply to 64478)

perfogic: hello @pcrafter. Quick question, is there any way to parse boc to cell on Ton contract. for example, i will store boc as string and parse it on func

&rey: Telegram wallet support is there (see in settings menu) but it may be overloaded because @wallet decided to attract too many users. (reply to 64481)

&rey: There is, but prohibitively expensive. (reply to 64485)

perfogic: example here mate: (reply to 64488)

perfogic: i will send result to ton to parse it

perfogic: so it does not have any method to do that, and i have to parse manually on the concept on bag of cell on website, am i right mate? (reply to 64488)

&rey: Why do you need to pass BOC as string? You can easily send whole tree of cells via internal message.

K.: But if you throw an error and prevent further contract execution if the comment is empty, it doesn't matter if someone sends a non-bounce message, right? Because the core of the contract will simply not execute. And on the frontend side (if there is one), you could have additional filtering for empty comments. (reply to 64484)

perfogic: actually i'm trying to parse a transaction from other blockchain. This content here will be putted on body on that transaction (reply to 64493)

perfogic: i am trying to build a bridge ^ ^. So i just wonder which solution on that case that i can work on

&rey: So you need to parse not BOC but appropriate structure from the other blockchain? I believe you will have to do so manually. (reply to 64495)

User<6031319387>: 来个人理下我行不行？

perfogic: okay, thank you mate. If that, i think i have to do it in other way ^ ^ (reply to 64497)

&rey: Please use English in this chat. (reply to 64498)

User<6031319387>: . (reply to 64405)

User<6031319387>: Who know  ?

K.: If it's not in your wallet, then you can't if I remember correctly. (reply to 64502)

User<6031319387>: Officials said that expired domain names will be re-opened for auction. (reply to 64504)

K.: What does it say if you search for the domain on https://dns.ton.org/ ? (reply to 64505)

K.: If it shows the Owner as you, then I think you can auction it, but otherwise idk. (reply to 64507)

Milad: This code: For non bounceable transactions: show error but amount does not return. Example: https://testnet.tonviewer.com/transaction/a3ec2fc158f0f1161501203332a89e069e85173484199153ccff960344fefc8f For bouncable:  returns amount to the source. Example: https://testnet.tonviewer.com/transaction/bdfb06fb27d41db1f639c5ae28a2a1cd04d7d4287a4ef8a5f9b03c95522401c8  If i can prevent non bouncable transactions too it will be greate (reply to 64463)

Milad: As you said here (reply to 64494)

K.: Yeah, I know, but not sure how that works. I once had a domain expired for 9 months and nothing happened to it 🤷‍♂️ (reply to 64511)

&rey: It can be, manually. I can create a link to set any expired domain to auction. Alternatively, you can find it in this chat. (reply to 64505)

User<6031319387>: How to manually.

User<6031319387>: ok (reply to 64515)

Xerath: Hey there TON devs, I am a blockhain dev, but I am new to the TON blockchain, I am trying to build an indexer to listen for particualrly jetton creation and minting , I need to create a web socket, here's the approach that I am trying to follow  connect to a public node  subscribe to transactions,   filter transactions that have some particular op codes,    but I am not sure, on how can I implement in this in either JS or GO, like how to subscribe to transactions and how to filter, what are the OP codes, can someone guide me towards the documentation please

0x0liver: anyone knows dedust testnet factory address?

Milad: Can i prevent non bouncables by a throw Or i have to create a message to send the amount back? :( (reply to 64494)

User<6031319387>: Let me know when you create it (reply to 64515)

&rey: For what domain? (reply to 64525)

User<6031319387>: You dm me (reply to 64527)

Negar: hi has anyone used this code in contract (default jetton wallet contract code) ? for verifying address of jetton wallet address  equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)

Angel: I am looking for a senior developer who can get NFT minter addresses from NFT collection. If you have experience in it, DM me.

Johan: What about min_out???: (reply to 64458)

Johan: Because I can see exactly this number on the tonviewer.com and it's out_msg

User<6031319387>: 5201314 (reply to 64527)

&rey: ton://transfer/EQBwI71tg_tiHlIBPxhnMJbEdwB2FZG7Z7yyi4VNKdUxHfw3?amount=177120000000&bin=te6ccsEBAQEADgAAABhO0UtlAAAAAAAAAACvkFQ4 should work for that domain. (reply to 64539)

User<6031319387>: tq

&rey: If emulation fails, please say so and don't send money, as this is a quite large sum.

User<6031319387>: where to open this link (reply to 64542)

User<6031319387>: I'm a little confused about this ,Don't know where to open this link (reply to 64542)

&rey: Hmm... any kind of Tonkeeper should work, at least in QR form. Or another wallet that can scan QR transfer links. (reply to 64546)

User<6031319387>: OK

Anastasiia: Hi , guys, where can I find values for ConfigParam40:MisbehaviourPunishmentConfig  Or is it possible to know the maximum slash value for Validator/Nominator?

Vitor: Hi guys, I am facing this issue while trying to redirect the user after a response from a request to Changelly API.  Typescript code:  const data = await response.json();       if (data.data) {         console.log('Changelly data:', data);         window.location.href = data.data;       }   Anyone has any idea whats the issue?

Jeremy: Can somebady help me ?

Jeremy: I wanna connected  the official payment to my game . What should I do

&rey: The official? You have a problem, there isn't single standard. Even TON Connect sometimes isn't required. Please take a look on Advanced Asset Holding page on docs.ton.org to get more understanding about the task. (reply to 64558)

Jeremy: okay  thx (reply to 64560)

Nostra: Guys does this mean I can not integrate TON in my telegram mini game and accept payments there: By accepting these Rules, you agree that:  1. You will not implement any ads or any external links on your custom URL pages [1]. 2. You will not invite users to pay for any services provided on custom URL pages [2]. 3. You will not use any data collected over the course of user interaction with your custom URLs for spamming Telegram users. 4. You will not transfer any Telegram data collected over the course of user interaction with your custom URLs to any third parties. 5. In order to protect the privacy of Telegram users, your custom URL pages must not set any cookies.  Any violation of these Rules may result in a permanent ban of your bots from Telegram.  To be able to defend the privacy of our users and maintain the consistency of their experience in the ever-changing digital environment, we at Telegram reserve the right to change these Rules later. If any changes to these Rules occur, you will receive a private message from BotFather.   [1, 2] We understand that developers providing HTML5-experiences for Telegram users may expect financial returns on their work. To that end, we will introduce unified monetization tools for our Bot API later.

Yaseen Ammaar: Hey I am developing a web app on Telegram, i want to use these telegram animated emojies, is there any library or something?

User<6031319387>: Prompt that I need to pay 177ton and blockchain fees (reply to 64548)

&rey: Well, either I'm in error or that domain costs so much. Presumably the second) (reply to 64570)

User<6031319387>: Shouldn't it be the system's default initial amount?  About $180 for the same length

0x0liver: anyone knows dedust testnet factory address?

&rey: It isn't measured in dollars! Almost nothing inside TON knows its current price, so everything is measured in TON. (reply to 64572)

Linthero: Does someone knows how could I store a list of addresses in FunC?

User<6031319387>: 30ton (reply to 64574)

&rey: Well, seeing code it probably would work (but auction will be week long nevertheless). Please look at emulation first, of course... (reply to 64576)

User<6031319387>: dont understand (reply to 64577)

kevin: min_out is minimum amount you want swap from stonfi, if pool does have enough LP, tx will revert, exit_code of the contract is different indicating it is a failed swap. (reply to 64536)

User<5435924052>: I'm highly accomplished web3 developer having extensive experiences of building web3 projects on EVM , Bitcoin L2 , Solana , Cosmos ,  Polkadot , Cardano , Ton etc.

Linthero: How could I get all the owners of particular token or NFT collection?

&rey: Please try applying to @tonhunt or say if all vacancies were unattractive for you. (reply to 64581)

Angel: Do you want to get current NFT holders? (reply to 64586)

Linthero: Yes, that will also work (reply to 64588)

Angel: I can help you, mate

Angel: Dm me (reply to 64586)

meomeocoj | Mike: Hi guy, i'm finding the way checking cell empty or not ?

meomeocoj | Mike: But, only the slice_empty in docs. Any suggestions for me ?

Ma><im: tell me, can't you upload contracts with errors to the TON network like in the ETH network on solidity?

&rey: Wdym "with errors"? If there are errors while compiling code, you don't have a contract. (reply to 64594)

&rey: You can check its hash against hash of empty cell (precalculated). Alternatively, do begin_parse() and perform check on the slice. First option is cheaper. (reply to 64592)

The General: @Emillyserah1 Scammer not developer keep ann eye on this person.

Angel: Did you get scammed by him? (reply to 64600)

The General: Yes

The General: 14TONs

The General: Deal was to do Smart CONTRACT on TON for my nft collection And share profits and coop togheter in the future etc long story, anyway i got scammed

Linthero: I have similar experience with this chat, it seems full of scammers offering DEV help

&rey: Yeah. I'd like to note that ones reported are banned, but please still be aware of any interaction in DM. Chat moderators, including me, almost never write first. (reply to 64607)

User<6134444887>: Please let me know if you need adev.

Angel: What is your experience in Ton API? (reply to 64611)

The General: Ok, tell me if there is any possibility of collaborating with the real TON team. I am working on a project involving collectible NFT cards, which will be linked to a card game in the future. I am looking for information and wondering if there is an official possibility of collaborating with TON in the future to organize some promo for the project and the possibility of putting the card bulk on a smart contract.   I work solo, I don't have a team, and I don't know much about smart contracts. I would like to collaborate with TON in this regard. Currently, I am creating the graphics for the NFT cards, building the whitepapers, developing the entire strategy for the project, and designing the game mechanics, and more. However, I am demotivated by the fact that when I try to find someone to collaborate with on my own, it always ends up being scammers. (reply to 64608)

&rey: With what part of TON? TON Foundation/core team — unlikely. You should try TON Society. (reply to 64613)

&rey: And probably I should mention, anyone can create and deploy their own smart contracts, there is no official approval required for that.

The General: I know, but i dont know how. That's the issue.

The General: I was trying, but i AM not IT person, i can do graphics and Simple things but for me to create Smart CONTRACT is Kind of magic

Angel: I recommend you use escrow platform such as Upwork or freelancer to avoid the scam again.

The General: I will have a look in to that. Maybe there is a website which helps to create a Smart CONTRACT on TON for nft collection? Or something like that

The General: I could mint on getgems one by one manually but is taking so much time for bigger collection.

fade: There is no pseudo func decompiler atm right? I'm making one so just making sure not to waste my time.

&rey: As a matter of fact, there is: https://truecarry.github.io/ton-collection-edit/. (reply to 64619)

fade: Tvm opcodes look simple wonder why ton foundation hasn't made a decompiler for it yet, only a disassembler

The General: Ok i will have a look. Thank you (reply to 64623)

&rey: One reason is that you can't distinguish functions from simply repeated blocks of code which happened to be compiled into one and the same cell. (reply to 64624)

fade: yup code repeating is a problem but there should be a way to detect that and separare them into their own function (reply to 64626)

&rey: Also, something should label variables or decide that expression result should immediately be passed to something else, not saved to FunC variable; current text-continuing LLMs are not sufficient for that at all.

fade: do you mean using LLMs for this? (reply to 64628)

Angel: I have NFT item address. I want to know who minted it. How to do it?

&rey: Look it up in dton.io/graphql, filtering transactions by address and original state being inactive. (reply to 64630)

Krollie: Gm gm, I noticed today that Yescoin managed to lock their mini app in place. Anyone here that has an idea how they managed to achieve this?

&rey: Please refer to @devs chat for TMA assistance. (reply to 64633)

&rey: I'd say something more advanced is required. (reply to 64629)

fade: yeah ive been thinking making a parser for ghidra's sleigh decompiler - i used to contribute to the project so i have experience working with it, but the tvm structure is too different so i'm not quite sure it that is the best way to do it (reply to 64635)

Austin: Can anyone tell me the difference between tracking DAW and Daily Traders?

fade: also, a lot of scam jettons has emerged recently, they modified the jetton wallet code to disallow jetton transfer messages. This is easily detectable using the emulator, wonder why tonkeeper and dex's haven't blocked them yet

fade: main reason i wanted to make a decompiler

ayushag: TON addresses are really really confusing, Some start with E other with others with something else, can some explain me or give me some resources regarding this?

&rey: Have you visited docs.ton.org? (reply to 64644)

fade: there are three forms of address, raw, bounceable and non-bounceable, raw starts with 0:xxx or -1:xxx, bounceable starts with EQ, and non bounceable starts with UQ. You can learn more about what bounceable means in the docs, and use https://ton.org/address/ to convert one form to another (reply to 64644)

ayushag: Yeah, but can't find a effective way to get clear idea (reply to 64646)

ayushag: Oh! That's helpful (reply to 64647)

ayushag: Thanks

Johan: Guys, please say which is the easiest way to get circulating supply of any token??

Johan: I have total supply

Johan: If I just multiply with price to get marketcap, it would be inaccurate

fade: depends on what you would count as "out of circulation", total supply minus the amount locked away in the lp is enough (reply to 64652)

Johan: Ok, how its possible to get amount of locked in the LP?

Austin: Anyone? Ton uses them, they sound like the same thign to me (reply to 64638)

Angel: I tried but did not find exact API. Can you recommend something else? (reply to 64631)

Назим: Please tell me, I have this code, everything seems to be correct, but the console constantly returns the same thing:  solid.js:894 Uncaught Error: Unknown error     at Wt (solid.js:894:10)     at jt (solid.js:900:9)     at solid.js:653:5     at Lt (solid.js:623:18)     at Ot (solid.js:725:7)     at Pt (solid.js:823:36)     at solid.js:792:34     at Mt (solid.js:741:17)     at solid.js:792:17     at Mt (solid.js:742:5)

fade: see how toninu and tonraffles do it (reply to 64658)

Angel: Please help me to gets NFT minter address from NFT collection smart contract address.

Francesco: After 10 days my KYC identity on the Telegram wallet has not been validated, what can I do?

Boris: Is -13 exit_code the same as 13?

Acmos @thesonicsociety: Can anyone explain why the fastest blockchain in the world is slow as fuck all the time?

— 2024-05-29 —

fade: lol, "infinite scalability" so they say (reply to 64703)

fade: they all talk about TPS, sure it's high, but it's misleading, TPS has very little thing to do with the speed of a single transaction, when the number of shards is high it takes forever to complete a transaction

fade: hopefully ihr will be completed soon, not that it's gonna help much when there are little shards, but from the paper it sounds like it'll help when the number of shards is high - implementing ihr is also up to dexes and contracts but ihr disabled is hard coded into them rn

meomeocoj | Mike: thanks you (reply to 64599)

Acmos @thesonicsociety: Appreciate the insight buddy (reply to 64715)

Acmos @thesonicsociety: What is getting "completed" ? (reply to 64715)

Acmos @thesonicsociety: At least this last week its been slow asf (reply to 64715)

gavin: Hello, I would like to ask about ton's cross-chain bridge (https://bridge.ton.org/), can it cross any ERC20 on EVM?

0x0liver: no its not (reply to 64723)

Quack: Hello, may i know the transaction fee for testnet and mainnet will be the same ?

gavin: I see there is an "Other tokens" (reply to 64724)

Angel: This is not a developer. skilled scammer. (reply to 64727)

Angel: I am looking for a senior developer who can help me to get NFT minters not NFT holders.

fade: IHR. tldr for a small fee it makes your transactions faster when the chain is under high load (reply to 64721)

meomeocoj | Mike: Does anyone implement utils function json to sliceRef in javascript ?

SePi: https://t.me/wallet_news/297 (reply to 64745)

WH: How is that detectable? (reply to 64640)

fade: jetton wallet code is not verified / not tep compliant. And simply emulating a jetton transfer message on it will yield an error (reply to 64752)

WH: Interesting. Thanks! What can be used for doing an emulation? (reply to 64753)

fade: using the official emulator lib from ton, checkout yungwine's pytvm & trace emulator, for golang checkout txemulator from tongo (reply to 64754)

SePi: Here is the developer's chat, refer to Community  https://t.me/not_support_chat (reply to 64748)

WH: Will check them out thanks (reply to 64755)

fade: emulating it requires a bit of setup to make a "virtual" wallet but you'll get there

WH: Ya its a process i was looking at ton sandbox, but this will help. Emulating in evm is simpler because its built in the node (reply to 64759)

WH: Has anyone suffered a memory leak from running ton center?

fade: ton-http-api? (reply to 64761)

WH: Yupp (reply to 64762)

fade: i thought it's written in python lol how can it leak memory (reply to 64763)

fade: ton node is leaking a lot of memory for me tho, have to constantly restarting it

WH: It is written in python. It started using 1.5GB at the start its now using 32 GB (reply to 64764)

WH: I swear i knew there was multiple leaks lol (reply to 64766)

WH: Mytonctrl right?

fade: try opentonapi if you're able to, it's stable for me, but why not just raw adnl? (reply to 64768)

fade: validator is leaking memory, i dont think mytonctrl is the problem (reply to 64771)

WH: Im new to all of this so when i saw tonweb i thought everyone uses apis (reply to 64773)

WH: Even the ton/ton (TonClient) npm package shows the use of a v2 api

fade: iirc there are no js lib to interact with lite server directly via adnl yet

fade: maybe try golang? tongo is amazing at it

WH: I found that there are two libraries to do that. Interesting will look into them. Way better than maintaining apis and it got websocket connection (reply to 64777)

WH: That would be another option too if i got nowhere (reply to 64778)

WH: Is there a way to watch blocks with adnl? I think there is if the api can do it lol

fade: yes there is, check out my message (reply to 64061)

WH: Thats pretty helpful

fade: hm can node js load .so library? if you want to use the emulator golang would be a better and easier choice (reply to 64781)

WH: I can encapsulate a script that runs it. Will not be straight forward Then i can run a cmd from it

&rey: For benefit of others: there is even an ADNL-based explorer. https://tonlens.com/ (reply to 64777)

Narek: it’s loading and rejecting automatically

K.: Are you on testnet? That sometimes happens with Tonkeeper when testnet is congested. ( Judging by addresses, it is testnet :) ) (reply to 64792)

Narek: yes, so I need to wait, right? (reply to 64793)

K.: yes

K.: Although, there is no way to know for how long to wait, might be 10 minutes, might be an hour.

szansky: Hi, do you know of an API that can analyse a portfolio to see if a user has NFT etc? so that the answer would be which NFT he has?

Равиль: guys, can I make a usdt wallet on the ton network?

meomeocoj | Mike: Hi guy, can we compare a cell and a BOC in funcC ?

0x0liver: anyone know how to get jetton master data from exotic cell?

darcel: Hi. I want to send jetton from my wallet to another wallet. How can i do this?

meomeocoj | Mike: how we can create BOC in FunC

meomeocoj | Mike: I mean i need to create a serialize Cell in BoC in FunC

Paul: Hello everyone, I can't find information on how to simulate a transaction (to understand whether it will fail or not) without using a keyPair or private key. Has anyone encountered a similar task?  In Ethereum, there is the estimateGas method; I would like to have similar functionality

meomeocoj | Mike: Suppose that:  - In chain A, i create a transaction with data need to relay to TON in format BOC serialize. - In Ton, i verify that transaction by passing the Cell data from client and the data_of_that_transaction. Finally i need to compare the cell and the BoC which from chain A  in TON smart contract.

&rey: Why can't oracle pass decoded BOC (as cell) to your contract in TON? (reply to 64811)

meomeocoj | Mike: Since vm in chain A have only understanded that the cell we need relay to TON is a string in BoC format.

&rey: And exactly why oracle can't do data conversion? (reply to 64813)

Disha | SMBmarket: Hey, Is there any library or sdk to connect with Frontend?

musashi: https://docs.ton.org/develop/dapps/ton-connect/developers (reply to 64815)

Elong@TerpLayer: How do I verify the server signature in a contract

Linthero: Is the ORBS testnet RPC down and is there any other alternative?

meomeocoj | Mike: For instance, the data_txs in arbitrary chain have been serialized by the user's data which contains BOC string, we have also convert that BOC in oracle to a Cell to validate Data in cell. Then, we verify(TxData, Cell), but the challenge here is to convert Cell to a BOC string to compare to BoC in TxData. (reply to 64814)

meomeocoj | Mike: Suppose that relaying the data which always in BOC format from TON to another chain suggest EVM, we have to write a library parse that BOC to retrieve data and verify that. But from another chain to TON, we do not known how to convert cell to a BOC string.

&rey: Use wallet contract or take algorithms from there. (reply to 64818)

meomeocoj | Mike: it's be nice if any code avaiable. If not, we have to code by our self 😢

Narek: https://ton-access-status.herokuapp.com/

Fereshte: Hi.. I'm sending 0.1 ton to an inactive account and then automatically that inactive account 0.0996 ton back to me.. what is the reason?  ps: If I send 0.000001 it will not happen

Linthero: I'm constantly getting network overloaded from Tonkeeper wallet and can't understand if I'm doing something wrong or if the testnet RPC is down. Am I the only one experiencing such issue? (reply to 64820)

Narek: maybe it collects gasfree and returns remaning back, 0.000001 fails becouse it could not collect tax fee (reply to 64829)

Fereshte: well why it returns at all?? (reply to 64832)

Fereshte: I want to send the whole 0.1 to that account

Narek: I don’t know exactly why, but you can try SendPayGasSeparately mode (reply to 64834)

kevin: what is the bounable flag did you set ? (reply to 64829)

Fereshte: bounceable = true sendMode = 3 (reply to 64836)

Muhammad Javad: Hi In TON network how spam attacks handled? If some nodes send transactions more than capacity of network, how it will be procced? .

Linthero: Is there a TON related developer forum where I can ask for help on particular issue?

Oscar: Hi

Son: Hi guys. Is there an json-rpc method to fetch the rpc node version?

Linthero: I believe this might be helpful: https://ton-access-status.herokuapp.com/ (reply to 64844)

prometheusoo: May I ask for your advice, Can Jetton transfer different amounts of currency to different addresses in bulk during a single message transfer?

kevin: highload wallet can do that (reply to 64847)

CuLang: I transferred tokens to the wrong exchange. Can you help me get it back? Please

prometheusoo: Thank you, I'll go learn this (reply to 64848)

&rey: Use bounceable = false. (reply to 64837)

Linthero: Does anybody see my comments? 🫥

Konstantin: Hi! I've just updated both mtc and ton node to the upstream, and started seeing new property "out of ser" that's constantly increasing. It doesn't seem to affect anything at all, but since it's red in mtc status I'm kinda worrying. Could anyone explain what it is and what shall I do about it? validator-service -c getstats returns constant stateserializermasterchainseqno = 38046534: this value does not change despite others.

Son: Thanks. Let me check that out (reply to 64846)

Renzo: GM

Disha | SMBmarket: Thanks so much for sharing, and done with wallet connect, I have created contracts in Tact lang, Do I need to convert them in TypeScript interface class, or with Tact we can connect to the frontend?  Please provide me any availabe reference. (reply to 64817)

Joe: Hi, i have a question about message processing. Let's assume i have the following situation: I have a contract 1 that operates with contract 2. I send msg-1 to contract 1, contract 1 will send msg-2 to contract 2 in order to withdraw e.g. 1000 ton from it. contract-2 will send msg-3 to contract 1 in order to send 1000 ton. Straight after that i send msg-4 to contract 1, so it will transfer 1000 ton that it has withdrawn from contract 2 to me. Thus creating msg-5 where ton is transferred to me.  As far as i understand message processing, there may be such situation that when msg-4 is invoked, there are no funds at contract 1 yet, because msg-3 hasn't been processed yet. In such case will msg-5 be successfully processed if  msg-3 arrives at contract-1 before it. Basically i want to understand when messages are dropped: when they are sent or when they are processed

musashi: you need to write typescript wrappers for each contract (reply to 64865)

&rey: Out messages start processing after contract exits TVM. (reply to 64866)

&rey: In particular, it means that msg-5 must be sent in response to msg-3, not msg-4.

Joe: Ok, so if msg-5 is created by msg-4, it will always drop, or there is a possibility that if msg-3 is processed after msg-4, but before msg-5 it will succeed? (reply to 64870)

Fereshte: thanks it fix it.. Doesnt it make any other problem when it's false? (reply to 64853)

J.: @kocmo12 sent you a dm just incase it’s archived.

Nishtha: Hey, is there any function in tact to get all child contract addresses of a parent contract?

&rey: Non-bounceable flag means that money don't return in case of any error. Destination contract being not deployed is but one of the errors. (reply to 64872)

&rey: If you send msg-1 and msg-4 from the same transaction, latter will always fail. Otherwise, msg-3 may be processed before msg-4 and sending moment of msg-5, so everything may succeed. (reply to 64871)

Joe: So, this leads me to a conclusion that messages fail at the moment of sending, not at the moment of execution, right? And if i send msg-5 with mode 2(ignore errors), will it processed in case msg-3 with ton arrives after msg-5 is sent, but before it's executed (reply to 64876)

&rey: Yes. More precisely, in action phase. The reason for that is that message execution may take place in another shard, which doesn't have access to sender contract balance. (reply to 64877)

Joe: But, as i can see in docs, mode 2 allows us to ignore some errors in action phase. In this case is execution possible, or even if error was ignored it will still fail (reply to 64878)

&rey: Then the message without sufficient TON will not get sent, but all other changes from computation and action phases will be applied. (reply to 64879)

Nxrix: what are the plugin things that are in wallet v4r2 codes?

Joe: Ok, that makes sense, thx a lot (reply to 64880)

&rey: Plugins for v4r2 are smart contracts that may request TON from the wallet at any time. (reply to 64881)

Nxrix: How can I use a vanity contract like a wallet when I made it? is there any tool or it can be only used with codes

Nerses: I get such exit code for transaction.How to know how much should be balanace of smart contract to pass action phase ?

Linthero: I'm trying to store a Hashmap as separate item in the data store, but couldn't figure out how to do it. I've described how I'm trying to do it here: https://answers.ton.org/question/1706706339788492800/how-to-store-a-hashmap-as-separate-entity-in-the-data-storage

&rey: ~store_dict(...) (reply to 64892)

Linthero: If you mean to use store_dict / load_dict instead of store_ref / load_ref - I've already tried (reply to 64893)

Anton: hello guys. Do you know any modern way to connect React Native with TON Wallet?

Vitor: Google 'foton ton github' (reply to 64897)

Vitor: (Well, it's react, but I'm _assuming_ it works with RN)

&rey: TON Wallet, you mean, https://wallet.ton.org and corresponding browser extensions? (reply to 64897)

Anton: I mean TonKeeper and other wallets as Application at phone

Vitor: You can use @ton/core and @tonconnect. Or foton. I can't post links so that's why the Google recommendation. (reply to 64904)

Anton: @tonconnect/sdk  doesn't work

Vitor: What happens with it on RN? (reply to 64906)

Anton: sdk error

Anton: React native don't has a CustomEvent implementation which @tonconnect/sdk  use 😈🐳

Anton: Let me guess, the others also works on CustomEvent (reply to 64905)

Grow: ❌

Ene🐐: Hey please I need help. When I try sending ton to an external wallet from my telegram wallet. It keeps saying "unable to verify transaction"

Gleb: A couple of questions about running a validator node in testnet.  1. MyTonCtrl > status shows that the minimum stake is 10000. Where I can get such amount of TONs? @testgiver_ton_bot gives 5 TON per hour.   2. I wanted to use my own wallet as a validator wallet. After I imported and activated it with iw command, MyTonCtrl ignored it and tried to use the one it created while bootstraping the node. Ok, changed it in /usr/local/bin/mytoncore/mytoncore.db → validatorWalletName. But activate_single_pool command still didn't work (see the screenshot). Turned out, the version of the wallet was the reason. My imported wallet was of v3r2 version, validator node creates v1r3 by default. Seems like the culprit is in "--with-init" that is hardcoded here. With v1r3 wallet the single-nominator was successfully deployed. Did I do something wrong?

User<7123272744>: Please check Ton document. (reply to 64936)

Gleb: https://docs.ton.org/develop/smart-contracts/ (reply to 64936)

Angel: Hi, Gleb. I think  you are very familiar with Ton blockchain. Can  you help me to get all NFT minter address from NFT collection address?

⌛️: Is it possible in the future to make sending GRAM without printing a ton?

— 2024-05-30 —

Raffs: In a transaction there is an IN message with a hash. However when querying the API for the transaction that hash is not provided.   My questions: what is that hash? How can I get a hold of it? Do I need to derive it from raw_body?

Raffs: Can someone answer this? (reply to 64968)

Hanniba1111: I want to use TACT to write a ton contract, but I dont know which tool I can choose to interact with this contract in frontend. Any guy knows?

meomeocoj | Mike: Hi guys, is there any simple wave to test jetton in @ton/sandbox

v: How does the front end obtain the transaction hash after the transaction?

Witter: Is there any documentation about off line signed transactions?

Witter: And make sure txs can be signed and boradcast with conlicting

&rey: If you use blueprint, appropriate wrappers in @ton/ton are automatically generated. (reply to 64971)

&rey: You can calculate its hash from raw_body, yes: parse that as  BOC and get cell representation hash. (reply to 64968)

Nxrix: what do I need from a transaction to get it's data(comment) in the future when needed?

Max: I'm using blueprint, how to generate wrappers? (reply to 64996)

Think: Hello

Gleb: Does anybody from this chat deployed a validator yet?))) Or my questions just weird and I am missing something (reply to 64940)

Mohammad: Hey guys. I wanted to generate a url based on tonconnect protocol so the user can open and navigate to a wallet installed in their device and confirm sending a transaction.  how can I generate such a link? what is the format of that?  tc://? ton://?

Nerses: I get exit code 40

Nerses: let ctx: Context = context();                                                                     send(SendParameters{to: myAddress(),                             bounce: true,                             value: ctx.value,                             mode: 0,                             body: Create {data: TonTransferInitiated{__hashlock: _hashlock,                                                                     __amount: ctx.value,                                                                     __chainId: _chainId,                                                                     __timelock: _timelock,                                                                     __sender: sender(),                                                                     __srcAddress: _srcAddress,                                                                     __targetCurrencyReceiverAddress: _targetCurrencyReceiverAddress,                                                                     __phtlcID: _phtlcID,                                                                     __messenger: _messenger                                                                     }}.toCell()});      }      receive(msg: Create){          let ctx: Context = context();         if(false == self.htlcExsits(msg.data.__hashlock) && now() <= msg.data.__timelock && msg.data.__amount != 0){                     self.contracts.set(msg.data.__hashlock, HTLC {hashlock: msg.data.__hashlock,                                                                 secret: 0x0,                                                                 amount: msg.data.__amount,                                                                 timelock: msg.data.__timelock,                                                                 sender: msg.data.__sender,                                                                 srcAddress: msg.data.__srcAddress,                                                                 redeemed: false,                                                                 refunded: false});                      emit(Create {data: TonTransferInitiated{__hashlock: msg.data.__hashlock,                                                             __amount: msg.data.__amount,                                                             __chainId: msg.data.__chainId,                                                             __timelock: msg.data.__timelock,                                                             __sender: msg.data.__sender,                                                             __srcAddress: msg.data.__srcAddress,                                                             __targetCurrencyReceiverAddress: msg.data.__targetCurrencyReceiverAddress,                                                             __phtlcID: msg.data.__phtlcID,                                                             __messenger: msg.data.__messenger                                                             }}.toCell());                      send(SendParameters{to: msg.data.__messenger,                                         bounce: true,                                         value: 0,                                         mode: 0,                                         body: HTLCNotify {data: HTLCNotification {                                                                                     htlcID: msg.data.__hashlock,                                                                                     sender: msg.data.__sender,                                                                                     receiver: msg.data.__srcAddress,                                                                                     amount: msg.data.__amount,

Nerses: How can I fix that ? I think in contract there is enough balance for action phase although it fails

&rey: It won't be based on TON Connect, but you can show QR of ton://transfer/<destination>?amount=<nanoTON>&bin=<payload BOC urlsafe> (reply to 65007)

&rey: value: 0 + mode: 0 is insufficient for sending a message. Moreover, even if message got sent, destination contract wouldn't have TVM started. (reply to 65014)

Nerses: but I passed value: ctx.value with mode: 0 shouldnt it send the amount which I indicate in internal call ? (reply to 65017)

&rey: I mean the send which is at the bottom. (It would be nice if you posted a gist with your code on gist.github.com) (reply to 65018)

meomeocoj | Mike: hi is there any way to store empty address in func like this ?

&rey: .store_uint(0, 2). (reply to 65026)

Hello: Hello I want to send a error on a code I am writing a code I am not a pro thanks.   Question for tondev chat: Why does FunC require an rvalue before a semicolon when declaring a slice, and how can I correctly initialize a slice in the following code snippet?  () recv_internal(slice in_msg) impure {     slice tempSlice = in_msg; ;; Copy the original slice     int op = tempSlice~load_uint(32);  ;; Load the operation code     slice body = tempSlice;  ;; Assign the remainder of the slice to body      if (op == 0x16) { ;; OP_DEPLOY_COLLECTION         int workchainId = body~load_uint(8);         slice newCollectionAddress;         (body, newCollectionAddress) = body~load_msg_addr();  ;; Initialize slice         deploy_nft_collection(workchainId, newCollectionAddress);     } else if (op == 0x17) { ;; OP_MINT_NFT         slice recipientAddress;         cell nftData;         (body, recipientAddress) = body~load_msg_addr();  ;; Initialize slice         nftData = body~load_ref();         mint_nft(recipientAddress, nftData);     } else if (op == 0) { ;; Default operation         int balance = get_balance();         return balance;     } else {         throw(100); ;; Unknown operation     } }  Error Message:  contracts/nft-collection.fc:57:35: error: rvalue expected before ;           slice newCollectionAddress;                                     ^ Any insights or solutions on how to properly initialize slices in this context would be greatly appreciated.

meomeocoj | Mike: To debug the jetton wallet address, is there any way i can compare the address in javascript and funcC

&rey: Because you can't declare variables without providing a correct value. You should write () recv_internal(slice in_msg) impure {     slice tempSlice = in_msg; ;; Copy the original slice     int op = tempSlice~load_uint(32);  ;; Load the operation code     slice body = tempSlice;  ;; Assign the remainder of the slice to body      if (op == 0x16) { ;; OP_DEPLOY_COLLECTION         int workchainId = body~load_uint(8);         slice newCollectionAddress = body~load_msg_addr();         deploy_nft_collection(workchainId, newCollectionAddress);     } else if (op == 0x17) { ;; OP_MINT_NFT         slice recipientAddress = body~load_msg_addr();         cell nftData = body~load_ref();         mint_nft(recipientAddress, nftData);     } else if (op == 0) { ;; Default operation         int balance = get_balance();         ;; TODO: send message which replies to balance request         return ();     } else {         throw(100); ;; Unknown operation     } }

&rey: ~dump(to_wallet_address.preload_uint(11)); ~dump(to_wallet_address.last_bits(256).preload_uint(256)); (reply to 65030)

regex: Hello.  I want to create a dividend token on the ton ecosystem, but I couldn't find or see anything about it.  Does anyone have information ?

Nerses: yeah.It helped me to fix the problem.As I changed it to ctx.value. Now it is super big for that action.How can I know exact amount needed to do that action ? (reply to 65020)

&rey: Have you tried to fit it in TON sharded architecture of jettons, considering that there may be arbitrary number of jetton holders and you cannot iterate over all of them to credit tokens? (reply to 65035)

&rey: Divination, guessing, testing, take your pick) (reply to 65036)

regex: No ı try nothing. I was try before on bsc network. Auto jeton creator have divident token on bsc. But ı didnt see this option on ton auto jetton creater . I just asking if ı want to do that is it possible . (reply to 65037)

&rey: Should this be possible, it still requires much thinking about architecture. There are no ready-made solutions.  You should consider periodically depositing TON into liquidity so that price of jetton rises, not its amount. (reply to 65039)

ABRAHAM: Hi everyone, in this transaction, the in message body hash get from ton center is clCqA9oGLf1Th2KmyTew8RjxONO6KmVb3pgP6AyBpPU= But in tonscan, it is EJfMigjpdKu8xdM/SmvUd0gqAKZ29fibWTFE63uEPIA= How it convert from clCqA9... to EJfMigjpd...  https://tonscan.org/tx/9EFOtVn49R7lPhB99_FTKEhfy1MHlUoii4MEIVP6vn0=

Cube: As I know tick-tock transactions cannot be used by any contract. My question is there any decentralized way to execute some logic in my contract after passing some predetermined time

Ricky: Hi， every one!  I was stuck with how to calculate the transfer fees of jettons. Does anybody know it? thanks for answer!

Disha | SMBmarket: Please guid me, how to write wrappers? (reply to 64867)

&rey: Please look for actual examples on Github or by links from docs.ton.org. (reply to 65057)

Louis: Hi guys, I have a little question for you concerning development on TON. I am a newbie coming from Ethereum and I am really used to the methods such as getBlock and getTransaction from the Ethereum RPC. I also have a running TON RPC for which there is of course none of this method. But I would like to know if there is a way to retrieve the full transaction data only from its hash ? I would like to know which methods flow you would recommend me to achieve full transaction parsing ? And also do you know what I should use to decode raw data body in messages ?Thanks in advance guys

&rey: ton-http-api should provide Toncenter-like API (https://toncenter.com/api/v2/): there sure are lookupBlock, getTransactions, etc.  > And also do you know what I should use to decode raw data body in messages ? You won't be able to decode all, since most contracts use custom data serialization, and some do not provide TL-B. (reply to 65060)

Louis: Thanks I didn't know about TL-B I will check on these 🙂 However for the transactions part I am pretty sure that these methods would require to pass an account, shards and workchain right ? But in my use case I would like just to pass a hash. Do you think it is possible or is it not due to TON's way of doing ?

Hello: contracts/nft-collection.fc:59:12: error: { expected instead of if       } else if (op == 0x17) { ;; OP_MINT_NFT              ^ (reply to 65032)

&rey: elseif (reply to 65064)

&rey: You should check other versions of provided API; maybe that is in v3. (reply to 65062)

Louis: Thanks a lot for your help sir, I will check 🙂

&rey: They should be available once you compile. What's your project directories structure? (reply to 65000)

&rey: They're just external messages; consult used wallet contracts for the needed scheme. TON Connect 2 doesn't allow to sign message without also sending it. (reply to 64985)

Witter: Or my question can be simplified to: how to sign a transaction that interacts with a contract offline? For example, method B of contract A contains a parameter paramC. What I want to know is how to construct a transaction offline that can be signed offline. (reply to 65069)

Witter: first of all, thanks for your kind reply 🙂

Linthero: I need to list user wallet transactions with my contract. What is the best way to query TON to get the related data?

Nerses: how to parse data from emitted log ? What is the most optimal way ?

Laini: Hi

Laini: I'm a senior blockchain developer experienced in creating NFT Marketplace, Launchpad, Defi and Dex. I'm strong in React, Vue, Solidity and Rust. I am currently looking for a company to work with and open to start working immediately.

&rey: The most optimal is to parse incoming message which produced the log, and skip the log entirely. (That also allows to not emit it.) (reply to 65087)

&rey: It is, exactly. (reply to 65086)

Linthero: How do you get account transaction using TON API V4? The example in the docs states that should return them  GET /account/<address>/tx/:lt/:hash   But I can't figure out what the :hash should be? Ref: https://github.com/ton-community/ton-api-v4?tab=readme-ov-file

&rey: Do you have some wrappers (perhaps in Typescript) for contract A? Who would be the sender — your backend/local computer? (reply to 65074)

Nerses: is there any example code of parsing ? (reply to 65093)

&rey: Here you are: https://github.com/ProgramCrafter/ratelance/blob/2de56f4f96acf0f9e1e5b0e60ae0ad846ba50170/cli/offers.py#L67-L84. (reply to 65098)

Witter: In this scenario, we expect a wallet to be able to process some asset sending transactions offline and one by one. (reply to 65096)

Nerses: As I can track arbitrary accounts incoming messages there is no need to emmit logs.Was it the idea ? (reply to 65093)

Nerses: Then what is the best case to use emitts ?

&rey: Actually, I don't see any. (reply to 65104)

Nerses: Thanks a lot (reply to 65105)

Smart: thanks, what can i use then for deploying contract except ton.access? (reply to 65094)

&rey: With minimal changes? Toncenter. Tonhub. (reply to 65107)

Witter: 1. No ts wrappers, other language, such as c#/rust 2. The sender is my backed server (reply to 65096)

Witter: So, any solution of off-line signing?

regex: Thank you for your information (reply to 65040)

&rey: What are you already able to do? Create message to contract, or not yet? (reply to 65113)

Linthero: Is anybody currently able to perform any testnet transactions when using Tonkeeper?

Joker: Good morning, family!

Joker: You DO need your bots or mini-apps, don't you? I can provide you what you want. Reach me out.

Witter: Nothing, I’m looking for some off-line signing examples… (reply to 65115)

Ini: Hi, is there a channel where people are looking for networking? I mean i want to get a practical skills in marketing in real crypto projects

Богдан: guys, can you tell me if it's possible to somehow find the source code of the catizen game?

Slava: hello, i am getting an error cited below, when I try to use tonweb’s getTransactions API. I only provide one argument, the address I want the transactions for. this usually happens after i send a transaction out from this address, then wait for seqno to update, and then try to get a list of transactions using the call above.  LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time.  what may cause this error?

User<6995531243>: I'm highly accomplished blockchain engineer who is proficient in web3 projects in blockchain space as well being well versed and fast-paced collaboration. if you are in need of dev , feel free to reach me out.

Creator: Hi everyone.  Somebody knows what Cell __system is here? I tried to create data cell on my backend and deploy contract with Python, but could not without this cell.   async function MyContract_init(title: string, description: string, price: bigint, order: string, jetton_master: Address, native_master: Address) {     const __code = Cell.fromBase64('te6ccgEC const __system = Cell.fromBase64('te6cck let builder = beginCell();     builder.storeRef(__system);     builder.storeUint(0, 1);

0xdeadc0de: open the catizen game on browser and press F12 and go to console tab type this command and enter while(true){ //decompile catizen source code } (reply to 65131)

fade: vouch +1 (reply to 65139)

Hàn Lập (😇,🪽): my node is leaking memory too, how to safely restart it? (reply to 64766)

fade: systemctl restart validator, won't break anything, it's in the docs iirc (reply to 65141)

Hàn Lập (😇,🪽): thank you, it's eating up my 128gb ram specs lol can't believe it (reply to 65143)

fade: also be aware that it's gonna fill up your /var/ton-work pretty fast (reply to 65144)

Hàn Lập (😇,🪽): found any solution yet? I really don't want to resync when the all the free space got filled up (reply to 65145)

fade: they recommend 4tb of compressed zfs for an archive node, but I'm not sure if it'll ever go beyond that (reply to 65146)

Hàn Lập (😇,🪽): how about full node? (reply to 65148)

fade: the /var/ton-work path is hard coded into mytonctrl so don't change the --db argument of the validator, mount your disk to /var/ton-work instead

fade: if 4tb is enough for archive node i'm sure it wont be a problem for full node (reply to 65150)

Ene🐐: Please someone help me

Ene🐐: I keep getting this error message of unable to verify transaction when I want to send to external wallet

Ene🐐: I need a developers help (reply to 65155)

Ene🐐: 2432 online and NO one can help??

Vlad: you mistake with question in this chat 😅😉 (reply to 65159)

Ene🐐: 😢 (reply to 65162)

Ene🐐: What? (reply to 65162)

&rey: You don't, this is an issue within @wallet; this chat cannot help you. (reply to 65156)

Modernft.eth: Hzllo i have a transaction in pending since 50mn, normal?

Centix ・ Kronos Bot: Hello, there is only option to import wallet in testnet on tonkeeper. Why I cant create a new wallet?

VenomDev: As a full stack TON developer, I am looking for payable works or position.

Centix ・ Kronos Bot: https://t.me/tonhunt (reply to 65174)

Modernft.eth: Pending since 1h? How to unlock please

Joker: You do need your bots or mini-apps, don't you? I can provide you what you want. Feel Free to Contact ME!

Joker: 🚀

ayushag: Hi, I want to sign a message by private key in react web application and then check if who signed the message but verifying through public key, how can I do it in TON?

Joker: You can get signer from signed message. (reply to 65181)

User<6669453785>: Does anyone need a developer?

Modernft.eth: For this yes (reply to 65176)

Think: Hello

Ene🐐: Oh really? Thanks (reply to 65169)

Mr: hello, how did u solve this?  if you console.log the result, do they actually return something? (reply to 61039)

Boris: Yeah, there is a return but you cant rely on that if you initiate from desktop and confirm on mobile. Works pretty shitty that ton connect ui thing. I think its better to go low level with the sdk, but this takes more time. (reply to 65197)

Mr: even desktop to desktop with tonkeeper is not working for me (reply to 65198)

Mr: @toncenter/tonweb  you mean this? (reply to 65198)

Boris: Yeah, thats why many are going mobile only 😅 (reply to 65199)

Boris: No, ton connect sdk (reply to 65200)

User<6305973062>: who is looking for a developer?

Андрей: yes, the problem is in --with-init. MTC will be able to create a single pool only through the v1 version of the wallet (reply to 64940)

Vladimir: Hey guys can you please tell me if I am assembling this TL-B correctly?  // claim#013a3ca6 query_id:uint64 item_index:uint256 proof:^Cell = InternalMsgBody; const proof = beginCell().storeStringTail(cnftProof).endCell(); const body = beginCell()   .storeUint(0x013a3ca6, 32)   .storeUint(0, 64)   .storeUint(index, 256)   .storeRef(proof)   .endCell();  When I try to send it, Tonkeeper immediately says that it's a fail before send trx 🙂

Modernft.eth: Hello im in pending since 4hours now, solution?

Centix ・ Kronos Bot: PS D:\Project\my_first_contract> yarn deploy yarn run v1.22.22 $ yarn compile && TESTNET=true ts-node ./scripts/deploy.ts $ ts-node ./scripts/compile.ts ================================================================= Compile script is running, let's find some FunC code to compile...  - Compilation successful!  - Compiled code saved to build/main.compiled.json 'TESTNET' is not recognized as an internal or external command, operable program or batch file. error Command failed with exit code 1. info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.   What's the problem?

TON Bounty Bridge: ​many  🏷 Resource  Summary:дайте 2 тона в стартовый капитал  Created by fedosiii

codenamezooda: hey guys. I keep having this problem when deploying the website

codenamezooda: i was updating config file but yet still having this error (reply to 65230)

— 2024-05-31 —

User<5152486099>: I'm starting rldp-http-proxy and my terminal have no response

User<5152486099>: what i can do?

User<5152486099>: ton-build/rldp-http-proxy/rldp-http-proxy -a ip:3333 -L '*' -C global.config.json -A adnl -d

meomeocoj | Mike: i tested mint_token for user in sandbox, i've already check that my mesage go to the mint_tokens function but it's not relay to the jetton_wallet contract. Any tool for debug this error ?

&rey: What's this? (reply to 65213)

User<694804783>: Hello

User<694804783>: } elseif (op == 0x1B) { ;; OP_UPDATE_COLLECTION_METADATA        cell tempCell = body~load_ref();         slice newCollectionMetadataUrl = (tempCell~begin_parse()).load_slice();        update_collection_metadata(in_msg, newCollectionMetadataUrl);   error: cannot implicitly assign an expression of type slice to a variable  or pattern of type (cell, ??110) in modifying method begin_parse : cannot unify type (cell, ??110) with slice          slice newCollectionMetadataUrl = (tempCell~begin_parse()).load_slice();  ;; Parse and load the slice           ^  Can someone help

&rey: TON Connect 2 doesn't allow to sign transaction without also sending it. Though, Ed25519 allows you to find out public key of signer from signature and hash of message; also, you can check sender address via TON Connect itself 2. (reply to 65181)

&rey: slice newCollectionMetadataUrl = tempCell.begin_parse(); (reply to 65254)

meomeocoj | Mike: i already check it's should be have token in jetton minter (reply to 65251)

&rey: Probably it is correct: after all, proxy should serve incoming requests, not immediately exit. Check if the site is accessible. To get terminal available, launch proxy in background. (reply to 65235)

User<5152486099>: well It's empty for the last hour fosho (reply to 65259)

User<5152486099>: but not really the .ton web page

User<5152486099>: also I have a question if it's possible to make the .ton domain to be accessible without proxy

&rey: You can host static files in TON Storage; you won't have a proxy installed, storage providers will. (reply to 65263)

&rey: I believe that's @wallet problems or high load. (reply to 65216)

User<5152486099>: so with storage you can host .ton?

User<5152486099>: in any case, I'll try to make adnl work first

User<5152486099>: @pcrafter thank you man, much love

User<5152486099>: 🥰

User<7123272744>: (int claim_amount, int claim_date) = dict_get_slice_int(storage::is_claimed, 267, sender_address, 120, 60);  In this code, I am facing this error. `Compiling...contracts/jetton-vault.fc:176:87: error: undefined function sender_address, defining a global function of unknown type       (int claim_amount, int claim_date) = dict_get_slice_int(storage::is_claimed, 267, sender_address, 120, 60);`  But I already defined sender_address above. What is wrong?

Vladimir: I don’t understand how I should pass this string proof as cell 🫣 (reply to 65252)

&rey: Where do you even get string proof? Though, if it starts with te6cck... it is BOC, so you need const proof = Cell.fromBase64(cnftProof); (reply to 65273)

Jackie: Does the ton chain not support tipping? How to speed up if it's slow?

Jackie: Sometimes it takes 5 minutes to return data

&rey: No it doesn't; that mechanism would be negative-sum for users. (reply to 65288)

ly: hi guys !   i got this error when i  use tonKeeper ios app  ,but  web extension and desktop work fine !

ly: when i send a transiaction

TwentyZrThree: Hello everyone, Is there any alternative solution to Hashmap other than Dictionary? As far as I know, the dict has its limitations. I want a problem to store unlimited key-value pairs on the TON system. Thank you.

Grand: Hi everyone, I sent USDT via the ton network from OKX to my telegram wallet and I've not been credited with the USDT up til now. Why is that so?

Grand: Please I need your help on this (reply to 65299)

User<7123272744>: Good question. We can store the data to key-value format like mapping in Solidity. (reply to 65297)

TwentyZrThree: I have used a dict but it has reached the limit of > 34000 records. Do you have any solution for this issue? (reply to 65301)

User<5152486099>: hello, i was trying to deal with storage daemon , etc. if here is any way of hosting the website that will be accessible like https://website ton, using TON storage on my server (reply to 65264)

User<7123272744>: Did you use it as key-value format? (reply to 65302)

Vladimir: Yes, cnftProof starts with te6cck, I updated code:  async function claim() {   const cnft_index = BigInt(cnft.value.item.index);   const cnft_proof = cnft.value.proof_cell;   const query_id = 0;    // claim#013a3ca6 query_id:uint64 item_index:uint256 proof:^Cell = InternalMsgBody;   const proof = Cell.fromBase64(cnft_proof);   const body = beginCell()     .storeUint(0x013a3ca6, 32)     .storeUint(query_id, 64)     .storeUint(cnft_index, 256)     .storeRef(proof)     .endCell();    const transaction = {     validUntil: Math.floor(Date.now() / 1000) + 60,     messages: [       {         address: "EQAaSqEwAh00YOCc9ZwtqfNcXeehbl97yKQKCZPRGwCov51V",         amount: "85000000",         payload: body.toBoc().toString("base64"),       },     ],   };   await tonConnectUI.sendTransaction(transaction); }  but something still wrong, trx failed in Tonkeeper before send 🫣 (reply to 65274)

TwentyZrThree: yes sir, I use udict_get and udict_set (reply to 65304)

ayushag: Then, how can a python backend be authenticated using a react app? (reply to 65255)

ayushag: Ed25519 will verify but how will we generating the signature? (reply to 65255)

ayushag: How? (reply to 65183)

Enoch: @pcrafter how do I write a contract with token notifications. The one I have does not return errors

Mahima Thacker: Hello guys, Could you please the example of how we can mint Dynamic NFTs in the tact contract, currently this code is minting an NFT statically:- https://github.com/alefmanvladimir/lesson9/blob/main/contracts/nft_collection.tact and I am wondering how dynamic Nfts works in a TON blockchain?!

Hunter: Is it possible to apply buy and sell tax at jetton ?   But I don't need a transfer fee

ProSniffer: No (reply to 65325)

Hunter: Why not ?  Can I apply a tax amount at internaltranfer function ?   🙄It may give any problem .  The biggest problem is giving the Dex pool address .   We cannot get it before the token is made .  Even if I update this after the token is made, it may lead to some problems.  I am not sure .   But evm based chains are really better for this . (reply to 65328)

Hunter: 🤔 any tax applied jettons

Hunter: If anyone knows taxable jettons , let me know . (reply to 65331)

User<6453514341>: Who can tell me how to create jetton token transaction in web3 wallet?

User<6453514341>: I'll thank you in some way. I need immediate information.

sgatcher: Can a twa integrate telegram wallet?

Linthero: Yes, and any other wallet in that fact. The integration is pretty sleek and the end user might even don't understand they are using crypto (reply to 65338)

gavin: I would like to ask how to get the user's jetton wallet address through the jetton master address on the chain? I have a business that wants to check whether the jetton wallet address passed by the user is legal. I observed that there is a provide_wallet_address message, but because it is an asynchronous call, I don't know how to use it.

User<7123272744>: You can use ton API or dton graphql (reply to 65342)

gavin: I need to use FunC to get it on the chain (reply to 65344)

Linthero: Here are the standard jetton related contracts https://github.com/ton-blockchain/token-contract/tree/main/ft   In the jetton-wallet.fc you cant find a function get_wallet_data which returns coins for particular address (reply to 65342)

gavin: Thank you, but this is not what I want. I am in my own FunC contract. I cannot call this method of someone else's jetton wallet address. (reply to 65349)

Linthero: I'm also new to TON and I'm not completely sure but I believe you can send message from your contract to particular jetton wallet address and retrieve that information (reply to 65351)

gavin: You are right. I observed that there is a provide_wallet_address op, which can be obtained, but because it is asynchronous, there is no forward payload, and my payload may be lost. (reply to 65352)

Linthero: I can't tell. The project I'm working on doesn't have interactions with jettons. The docs are quite lacking, the only way to find out would be to try it on the testnet (reply to 65353)

Linthero: Also there is a NFT & Jettons section in this free course https://stepik.org/lesson/1011533/step/1?unit=1019393   It might be worth looking into it if you haven't already (reply to 65353)

sgatcher: Thx (reply to 65340)

gavin: Thanks, I'll take a look (reply to 65355)

Mr.A: Hi all, what is the node method call limit? (https://ton.org/global.config.json)

Witter: Is the address's seq-no strictly self-increasing? The background of this question is that I want to manage the address's seq-no offline.

Mr.A: How many times can I call a method consecutively in a second?

prometheusoo: Excuse me, everything is normal on the test network. After switching to the main network, there was an error in obtaining the serial number. What may be the reason?

User<6453514341>: For those who help to send transaction jetton tokens on pure js (ecma script) will receive a cash reward. I'm almost done

meomeocoj | Mike: hi guy how i can store the const slice "{"action":{"data":"

meomeocoj | Mike: twhat is the special character for quote

meomeocoj | Mike: I want to store magic slice like this const slice magic_slice = "{"action":{"data":";

User<6453514341>: 50$ (reply to 65368)

meomeocoj | Mike: hmm

meomeocoj | Mike: Does the jetton example do not help you ? (reply to 65368)

User<6453514341>: No( (reply to 65377)

meomeocoj | Mike: do u passing the value when sending the transfer op ?

W. [Разработка сайтов]: check dm if u need help for js (reply to 65378)

&rey: Have you already obtained user's wallet address? (reply to 65368)

User<6453514341>: Yes (reply to 65381)

User<6453514341>: Dm me (reply to 65379)

Modernft.eth: Hello, i cant send my TON to telegram ads, bug?

meomeocoj | Mike: can you show me the way to declare: const slice magic_slice = "{"action":{"data":"; (reply to 65381)

meomeocoj | Mike: I dont see any document for storing the double quote

&rey: Doesn't "{\"action\"... work? (reply to 65385)

meomeocoj | Mike: already try but syntax error

&rey: Please try to compile that with FunC compiler, though, because extension may be in error. (reply to 65388)

Mahima Thacker: Any help! (reply to 65322)

meomeocoj | Mike: I’ve already tried, seem the linting is true (reply to 65390)

&rey: Then, you'll have to define slice by content. (reply to 65393)

meomeocoj | Mike: Yeah, i must switch to store the content in client and pass it to contract right? (reply to 65394)

&rey: No, I meant "..."s literal with base16 encoding of your JSON prefix. (reply to 65396)

meomeocoj | Mike: Thanks, i got it (reply to 65397)

Nerses: Hi there.How can I check if arbirary smart contract handeled correctly with recieved message without emitting logs ? For example how to check that transaction succeded. I need do that on mainnet

Khashayar: Hey does TON network has a similar site  to Remix.ethereum ?

Nerses: ide Nujan (reply to 65410)

Nerses: https://nujan.io/

Johan: how I can exclude burned amount from total supply???

Johan: Can someone freaking explain???

Web DUCKS 🐦 SUI 🐾: Probably a Scam or real?

Nerses: Can smart contract have only recieve() for handling with incoming messages and DO NOT  have any function e.g. fun sendMsg() to send message ? will smart contract work correctly ? (recieve messaages and handle,and accounts be able to interact with smart contract)

Nerses: If my smart contract doesnt have any function only recieve() s can any arbitrary account send message to the contract ? Or for internal messages it is must to have functions in smart contract so every account will be able to interact with it ?

User<7019832664>: How create payload for transfer jettons?

User<7019832664>: I created but error failed to send tx (reply to 65435)

User<7019832664>: beginCell()         .storeUint(0xf8a7ea5, 32) // jetton transfer op code         .storeUint(0, 64) // query_id:uint64         .storeCoins(80000000) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)         .storeAddress(destinationAddress) // destination:MsgAddress         .storeAddress(abstractAddress) // response_destination:MsgAddress         .storeUint(0, 1) // custom_payload:(Maybe ^Cell)         .storeCoins(toNano('0.05')) // forward_ton_amount:(VarUInteger 16)         .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)         .endCell().toBoc().toString("base64");  please Check these codes

ꜱᴀʟɪ𓁿🪽: Hello. Is this site approved by your team or not? Tonlock_com

&rey: Scam. Please don't share your wallet secret keys with any sites and don't accept drainer transactions. (reply to 65423)

&rey: Yes, it can. And no matter what set of "receive"s your contract has, anyone can send it an arbitrary message. (reply to 65424)

&rey: You're probably looking for computation phase exit code. (reply to 65406)

User<7019832664>: I tried to send transaction jetton with tonConnect Ui but it fails (reply to 65446)

Nerses: from this line I think the last phase is action phase (except bounce phase) so if action phase exit code is 0 or 1 then transaction succeded https://docs.ton.org/learn/tvm-instructions/tvm-overview#:~:text=Action%20phase%20%2D%20if%20the%20compute%20phase%20was%20successful%2C%20in%20this%20phase%2C%20actions%20from%20the%20compute%20phase%20are%20processed (reply to 65449)

&rey: Message seems correct. Are you sending at least 0.1 TON? (reply to 65437)

User<7019832664>: Yes (reply to 65456)

&rey: Also, why are you forwarding 0.05 TON? 1 nanoTON is sufficient for explorers.

Nerses: and If i am right in case contract hasnt recieve()  for certain type of message then the message will fail (reply to 65447)

&rey: Transaction hash may help, actually. (reply to 65453)

User<7019832664>: Ok wait (reply to 65461)

User<7019832664>: 503bd153e9dff2e4cc302b8649f95d07c14248695e6b62c47a94b823b8003ee0 (reply to 65461)

User<7019832664>: Replace to 0.1 nano? (reply to 65459)

&rey: You're sending message to wrong jetton wallet — one that isn't yours. (reply to 65464)

User<7019832664>: How can solve that (reply to 65467)

&rey: Obtain the jetton wallet corresponding to Notcoin x message sender. (reply to 65468)

User<7019832664>: onst transaction = {         validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec         messages: [             {                 address: "EQCZXlCSA-iEi7N4qNbx_cFwqcribHCwlNINZrxlbCHJX1MK",                 amount: '100000000' ,                 payload: 'te6cckEBAQEAWgAAsA+KfqUAAAAAAAAAAEBMS0AIAGtxjxdMvDVHldwhYqVZ3+VAczeqRUcDHY2NJJxJDg7PADf9JcpQiqQatJ0r1dQJTEBxFJvp0V+8G/wAMCpLkttDyAX14QCtuz0o'             }         ]     }     const result = await tonConnectUI.sendTransaction(transaction); (reply to 65469)

&rey: This address depends on user's. (reply to 65470)

User<7019832664>: this will not receiver target ? (reply to 65471)

&rey: No, that should contain sender's jetton wallet. (reply to 65472)

User<7019832664>: oh wait (reply to 65473)

TON Bounty Bridge: ​Zor  🏷 Developer Tool  Summary:Manga yoqti ham pul ishlanadi oyinam qizu  Created by UQDr

Nerses: does this mean accounts still can interact with contract if it hasnt functions ? (reply to 65447)

Ilya: Hi everyone, I need some advice. I'm learning Tact and trying to build a smart contract that can accept USDT from one address, hold it for a while, and then send it to another address. I know how to send TON, but I'm not sure how to send USDT on the TON blockchain. I found USDT Asset Processing on TON, but I'm still confused. Can someone explain the steps I need to take and where to look for information? Is it possible to do this with just Tact? The goal is for a user to log in with TON Connect, send USDT to another user (who also connects with TON Connect), and after some time, the sender sends another transaction to release the funds to the receiver. Thanks for your help!

Witter: I have two questions: 1. Is seq-no (seq-no of address to send tx) strictly self-increasing , like eth's nonce? 2. There is no getTransactionByHash method in ton's http api. Can you consider adding such a method later? This method is helpful for directly verifying a transaction

Sar: hey. i am new in ton. how to get final txid from initial txid?

User<5435924052>: I 'm senior blockchain developer being familiar with Tact/FunC and have good experiences of building several clickable miniapp and raffles . as well have ever built several DEFI platforms like Staking , Launchpad , DEX and Bridge protocol .

Nerses: Is count of send() is limitted in recieve() ?

&rey: Up to 255. Though you may hit gas limit earlier. (reply to 65507)

Nerses: Is it same for smart contracts ? As in docs only about wallets is mentioned(and count depends on wallets standard)  https://docs.ton.org/develop/dapps/ton-connect/transactions#:~:text=standard%20(v3,to%20blockchain%20limitations). (reply to 65509)

&rey: Yes. 255 is general limit for smart contract (to send more you need to create another transaction), but certain wallet contract implementations just don't support that many. (reply to 65510)

Nerses: Any hint how should i handle in the case where i get message in recieve() and need to do more than 255 send() based on message ? (reply to 65511)

Raffs: Hey I have a question was wondering if someone could help me with this. When I have a TON transaction (https://tonscan.org/tx/xvHSwv7xJUagNyZmMATW1f0bAmUmSafm2BpWaK8FUcg=).  If I open tonviewer with the above txn, I need to obtain the hash from Account A of the transactions tree (0ecf8260ee828959dc96e25bfad5a1a54589345130b008f17183a206a7a48115) I would like to programatically obtain this from the first txn hash. Any pointers of how I could do so?

chebu: is there any big change planned for ton-connect or payments on telegram in general?

tr: hi

Jzuss ┌( ಠ_ಠ)┘: Hi! How to check balance of Contract before message sent during the message handling?

Raffs: could someone answer this? (reply to 65514)

Jotaro: Has anyone used Cocos to access TON?

r_os_e: Where is a good place to find TON dev to hire?

r_os_e: I do (reply to 65523)

User<7123272744>: I am a seasoned Ton Dev (reply to 65538)

r_os_e: DMd (reply to 65542)

Raffs: someone? (reply to 65514)

User<5152486099>: sometimes it takes more time if you have no kys completed (reply to 65550)

— 2024-06-01 —

Game: Has anyone plugged TonConnectUI into cocos creator?

Logan 🐯: Why is the exit code 130

Logan 🐯: But when I tested with Jest locally, the contract was executable

Logan 🐯: somebody help me

User<6996692347>: Can anyone in here explain to me why on earth it costs me $6000 to assign a fragment username to a bot?!

prometheusoo: After a transaction occurs in the wallet, seqno will also increase. How long will it take to see the difference from last time after the transaction BOC is initiated?

prometheusoo: about 10s

Alex.: Hey, everybody. What practices of presale token maintenance can you suggest?

Mahima Thacker: Hey devs, Can we call functions directly in the test or it is mandatory to use receive function in Tact?

Yasin: My wallet is malfunctioning. My balance shows as 28.3 on Tonviewer, but it should be 21.13. Someone sent me an NFT and 0.000000001 TON coin. After this event, I withdrew my 21.13 TON coin reward to my Telegram wallet via Beta Wallet, but my TON coins did not arrive. https://tonviewer.com/UQAfV-FD1FtcFq3bmT3qsWkpapt0KXOdaXCzCgNEMKP9egfN

sgatcher: I'm writing a twa that permit connection with a wallet. Is It possibile to test transactions without spending real money?

&rey: To change contract state (and run transaction on it), yes, it is mandatory. For FunC, any message will invoke recv_internal (or recv_external); for Tact, that is routed to one of receivers under the hood. (reply to 65624)

&rey: Telegram may consider this an elite or costly feature. Actually, this chat isn't place to speculate on that... (reply to 65602)

&rey: It seems they were not sent altogether, so no problem. (reply to 65634)

Addy: Hi@all

Addy: can you help me

&rey: Well, no one except maybe @wallet support knows why @wallet works as it does. (reply to 65642)

Armando 🌱 🇻🇪📍🇪🇸 | dRPC Ambassador | UTC+1: hi

Armando 🌱 🇻🇪📍🇪🇸 | dRPC Ambassador | UTC+1: i'm having a similar issue, i want to verify a boc response

Mahima Thacker: Hello everyone, I am trying to get the decoded dynamic metadata to mint an NFT but I am unable to get these metadata so could you please check my code and provide solution for this?   import "@stdlib/deploy"; import "@stdlib/ownable"; import "./nft_item.tact"; import "./messages.tact";  const minTonsForStorage: Int = ton("0.02"); const gasConsumption: Int = ton("0.02");  contract NftCollection {     next_item_index: Int as uint32 = 0;     owner_address: Address;     royalty_params: RoyaltyParams?;      init(owner_address: Address, royalty_params: RoyaltyParams) {         self.owner_address = owner_address;         self.royalty_params = royalty_params;     }      receive("Mint") {         let ctx: Context = context();         let msgValue: Int = ctx.value;         let tonBalanceBeforeMsg: Int = myBalance() - msgValue;         let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);         msgValue = msgValue - (storageFee + gasConsumption);          let metadata: String = decodeMetadata();         self.mint(ctx.sender, msgValue, metadata.name, metadata.description, metadata.imageUrl);               emit(LogEventMintRecord{ minter: sender(), item_id: self.next_item_index, generate_number: nativeRandom() }.toCell());      }      fun mint(sender: Address, msgValue: Int, name: String, description: String, imageUrl: String) {         let nft_init: StateInit = self.getNftItemInit(self.next_item_index, name, description, imageUrl);         send(SendParameters{             to: contractAddress(nft_init),             value: msgValue,             bounce: false,             mode: SendIgnoreErrors,             body: Transfer {                 query_id: 0,                 new_owner: sender,                 response_destination: self.owner_address,                 custom_payload: encodeMetadata(name, description, imageUrl),                 forward_amount: 0,                 forward_payload: emptySlice()             }.toCell(),             code: nft_init.code,             data: nft_init.data         });         self.next_item_index = self.next_item_index + 1;     }      fun encodeMetadata(name: String, description: String, imageUrl: String): Cell {         let b: StringBuilder = beginCell();         b.storeString(name).storeString(description).storeString(imageUrl);         return b.endCell();     } }   nft_Item.tact   fun decodeMetadata(payload: Cell): Metadata {     let b: Slice = payload.asSlice();     let metadata: Metadata = Metadata{         name: b.asString(),         description: b.asString(),         imageUrl: b.asString()     };     return metadata; }   contract NftItem {     collection_address: Address;     item_index: Int;      is_initialized: Bool;     owner: Address?;     name: String;     description: String;     imageUrl: String;      init(collection_address: Address, item_index: Int, name: String, description: String, imageUrl: String) {         require(sender() == collection_address, "not from collection");         self.collection_address = collection_address;         self.item_index = item_index;         self.name = name;         self.description = description;         self.imageUrl = imageUrl;         self.is_initialized = false;     }   Can anyone please help me?

Mahima Thacker: I just tried this but is there any other way to achieve it? (reply to 65685)

&rey: If a cell contains "mytokenmytokenbesttoken", how do you split that into three strings? (reply to 65685)

Mahima Thacker: Sorry but I didn't get you (reply to 65688)

&rey: You know that you're creating one cell with all the strings concatenated end to end, right? (reply to 65685)

Mahima Thacker: Yes, I tried this but looks like it is not working so can you provide any other solution to pass dynamic data I mean I want to create dynamic Nfts with name, descrption, and, image. So how will this work in Tact? (reply to 65690)

Mahima Thacker: @pcrafter ?

User<231577642>: Hi, All. Anybody knows good Go client library for ton-connect? Not cameo-engineering?

максим: Hi, I have my own project in ether network, it's a meme token that takes a 2% swap fee.  I want to make the same jetton in ton with the same logic, but I don't understand how to do it at all.  On the net ether there are 2 options: 1. it is in the code itself to calculate the pool address and then track. 2. Just create a pool and then add the address of the pair through a function.   As I understood with the concept of wallet in ton 2 variant will not work in any way. Is there only 1 variant? Or are there other ways? Or is it impossible to do it at all?

Dhruv: hello guys, I am facing an issue related passing metadata Uri which is String type and i am facing this while creating new NFT, so when i try to create new nft that transaction got automatically rejected from wallet and got "User rejected the transaction request from their wallet", I am using tact smart contract.  If i do same for nft collection data then it is working fine, but while creting nft i'm facing such issue, please help me here  Also if i modify Mint message in contract in such way that it can receive some integer value or data type then it is also working good, but only when I try to use String then i am facing issue.

&rey: What party will decide on these name, description and image? NFT collection? (reply to 65691)

User<6167607054>: Hello, what is the optimal solution for, say, a telegram bot to work with TON in which there are 100,000-200,000 users. In plan, I need quick interaction with the TON protocol, but I don’t have the funds to deploy my own node in the amount of 600,000 tons.

User<6995531243>: I'm highly accomplished blockchain engineer who is proficient in web3 projects in blockchain space as well being well versed and fast-paced collaboration. if you are in need of dev , feel free to reach me out.

𝒏𝒊𝒎𝒂: Hello, in what language do programmers write Telegram programs?

&rey: Do you mean Telegram Mini Apps? Those are websites essentially, so HTML+CSS+JS/whatever stack is added to that. @devs is appropriate chat for asking more about that. (reply to 65724)

&rey: TON smart contracts are written in FunC or in Tact, and compiled into TVM assembly for execution by validators.

User<6697016023>: Write me (reply to 65699)

𝒏𝒊𝒎𝒂: tnx , How can I create a mini-app and publish it in the Telegram app center? (reply to 65726)

User<6992329284>: How to get data that nft was sold to user?  I use function get nft by user account in tonapi, but I can’t find how to get this info about purchases

User<6992329284>: Like i need to make if nft has sold at least one time   By nft address or index, whatever

&rey: How do you define a sale? (reply to 65733)

:): Hello everyone,  I am starting a new project and currently facing an issue: I can’t find any faucet to obtain JUSDT or USDC on the testnet.  Can anyone explain how to exchange my native Ton tokens for other tokens on the testnet network? Any help or guidance would be greatly appreciated. 🙂

User<6992329284>: Hm, like in getgems history, I can see “NFT sale” or Auction (reply to 65738)

&rey: Maybe you can simply mint some other jettons (using minter.ton.org/?testnet=true) and test with those?

Denis: https://app.tapswap.club/ does somebody knows them? i need contacts ASAP

Артур: Hi guys!  I'm using tonconnect/ui-react and I'm getting this error:  Access to resource at 'https://connect.tonhubapi.com/tonconnect/events?client_id=...' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.  Recently it was working fine.  Has anyone faced this error?

Evgeniy: hey there, complete noob in frontend development, sry if my question is stupid anyway, i want to use solidj but also indend to stick to telegram-backed component libs the tgui lib won a grant from foundation, as I understand this is a react lib can i make tgui work with solid?

User<7123272744>: Can you share the NFT collection and item address? (reply to 65733)

Cesar: same here (reply to 65751)

Артур: I think there are some global problems on the blockchain level (reply to 65765)

Cesar: chain is not down, it is still producing blocks, just tonconnect / ton wallet / tonkeeper is down (reply to 65767)

Cesar: https://tonscan.org/blocks

Артур: In other TON related telegram channels people are complaining that testnet is down. Mainnet is fine I guess. (reply to 65769)

Cesar: testnet is not down either, been sending txns via the cli and they work fine (reply to 65771)

Omprakash: Who is responsible for Notcoin voucher which is still not credited back to my account transaction Date was 1st April

slavagm: yea developer stuff u know (reply to 65774)

User<7123272744>: Who need a Ton developer? Ping me anytime

Omprakash: I know but no one providing any update about it (reply to 65775)

slavagm: okey and how we'll provide any info about it? (reply to 65782)

Артур: UPD: the CORS error is gone now (reply to 65765)

Артур: everything works fine

User<7100996052>: Does anyone need a developer?

MA: hello,  I uses Highload wallet v2 for sending transactions and the withdraw code is   def withdraw_token(self, private, from_address, to_address_list, amount_list, comment_list, contract_address):         _, _, _, wallet = Wallets.from_mnemonics(private.split(","), version=WalletVersionEnum.hv2)          out_list = []         print("TON ------------------ start transfer coin ------------------", flush=True)         print("From: ", from_address, flush=True)         wallet_address = self.__get_token_wallet_address(from_address, contract_address)          self.__check_address(from_address)         for index, to_address in enumerate(to_address_list):             self.__check_address(to_address)             if comment_list[index] and len(comment_list[index]) > 0:                 if len(comment_list[index].encode('utf-8')) > 42:                     raise TagIsTooLong()                 payload = b'\0' * 4 + bytes(comment_list[index], encoding='utf-8')             else:                 payload = None              body = JettonWallet().create_transfer_body(                 to_address=Address(to_address),                 jetton_amount=amount_list[index],                 response_address=Address(from_address),                 forward_payload=payload             )              out = {                 "address": wallet_address,                 "amount": to_nano(0.1, "ton"),                 'send_mode': 3,                 "payload": body,             }             print(f"out {index}: ", out, flush=True)             out_list.append(out)          query_id = int(time.time() + 300) << 32          boc = wallet.create_transfer_message(             amount=to_nano(0.5, "ton"),             recipients_list=out_list,             query_id=query_id,         )["message"].to_boc(False)         print("query_id: ", query_id, flush=True)          result = self.__send_boc(boc)         if result.get('ok') != True:             print("Node response: ", result, flush=True)             return False         tx_id = b64str_to_hex(result['result']['hash'])         print("TX-ID: ", tx_id, flush=True)         print("wait for confirm...", flush=True)          is_pending = True         try_count = 0         while is_pending:             time.sleep(5)             result = self.__get_processed(from_address, query_id)             print(result, flush=True)             if result == -1:                 is_pending = False                 print("Done", flush=True)             try_count += 1             if try_count > 100:                 print("Max retry", flush=True)                 raise TransactionTimeout         print("TON ------------------ end transfer coin ------------------", flush=True)         return tx_id but the problem is sometime transaction not mined how can i fix it ?

Centix ・ Kronos Bot: Did you solve this problem? (reply to 50728)

who: sup everyone. how to sent jettons from smart contract?

Renzo: GMMM

Renzo: how does NOT/Hamster/Cube save score states

Renzo: considering almost 10M users presses and make backend calls?

Renzo: how does their server not die

art 🌱 Seed Σ: Hi, I made 1 transaction on the Ton Network related to NFT notcoin ,  but even though all the transactions and transactions were done correctly, I didn't receive anything. I didn't get N ft. Please help me. How can I get the NFT team in my wallet?

User<6697016023>: Cloud hosting and CDN (reply to 65815)

Max: Hi. I asked a question in the ru dev chat and got banned instantly. Can any of the admins unban me? There was nothing criminal, just a question 🙃

Vladimir: Typical problem if you add link to first message 😄 Try to dm @alefman for example (reply to 65822)

Max: Damn, I didn't know. There were no rules in pinned messages 😒 Anyway thx for help (reply to 65829)

J_a_X_o_n: I connect hamster bot(@swaphamster_bot) to my tomkeeper for 0.2 ton but actually I lost my all ton of 4.2 why? Hamsterbot says it will back, when (reply to 65837)

Ton: Nope (reply to 65801)

Cae: Hello need help on adding liquidity pool on stonfi

Cae: whenever I added 100% of the supply, as example 1B totaly supply being added to the LP, it only adds like 1001 tokens and not all.

Cae: I added 1B supply but when it gets confirmed only 1001 token gets pooled

Cube: What api is it better to use? My goal is to parse all incoming transactions to my contract

— 2024-06-02 —

broski: hi, how to transfer jettons from smart contract?

&rey: It can be scam, cannot it? (reply to 65839)

Mtom: hello

&rey: Please ask, don't "ask permission to ask". This chat is for development on TON, about smart contracts mostly. (reply to 65906)

&rey: I believe it's best to use pytoniq to be sure you don't lose any transactions to pagination, but absent that you can use Toncenter/Orbs. For initialized contracts, they tend to work correctly. (reply to 65875)

Mtom: I send usdt from exchange to a web3 wallet, it was successful but I cant access to it. The address is not active, is this the problem

Mtom: Sorry if this chat was not intended for asking, I was desperate because the exchange support team seemed unable to help.

&rey: You should be able to access (meaning read balance). Though, someone will have to pay network fees in TON if you want to transfer USDT out. I've heard Tonkeeper can subsidize that allowing you to repay in USDT, other wallets don't do so.  And yes, this was not the appropriate chat for that, TON Community Chat would be better. (reply to 65909)

Alan: hi team. I'm using @ton/ton with  const tonClient = new TonClient4({     endpoint: "https://mainnet-v4.tonhubapi.com",   }); but I get error 'exceed limit' How to fix it?

Ehsan: Can we have multiple wallets with same seed?  For example: WalletV4 WalletV5 HighloadWallet  ?

&rey: Yes, but it carries the same risks as using one private key across mainnet and testnet: transactions may be valid on both. (reply to 65921)

&rey: Please contact wallet support, no one else (including people who might DM you otherwise) can help you. Also please check if transaction is on blockchain at all; it might've got lost, meaning your TON are still on sender wallet. (reply to 65925)

Vladimir D.: Hello everyone, I recently started diving into TON. Could you advise which languages to learn and what to learn in general in order to start doing something in this area

T🦴: notco.in/burn I'd like to know how can I construct the payload to do this transaction of burning? Anyone can show me some examples?

T🦴: Search tontools it may have some connection example

T🦴: What I found is:rpc: client = TonCenterClient(key=) (reply to 65914)

Ehsan: Can you explain more (reply to 65924)

&rey: Yes. People who used same mnemonic on testnet and on mainnet have found that their testnet transactions were replicated in mainnet as well. (reply to 65965)

Ehsan: oh good headsup.  Thanks (reply to 65966)

MEW: Will there be any uncle block caused by temporary fork in TON

&rey: A validator signing fork block would be punished, therefore there won't be two blocks signed by 2/3 of validators — no possibility of fork. (reply to 65978)

MEW: If a validator signs fake block data, will it have an impact on some monitoring and recharging services? (reply to 65980)

&rey: Full nodes (liteservers) responsible for providing data to outside will likely ignore the block unless it's signed by 2/3 of validators; and invalid block shouldn't even get broadcasted over all the overlay. (reply to 65983)

Mr: Hi everyone, I was researching online about ton status of transactions.  My question is: after how many confirmations is a tx finalized on ton?  I see other users asked this question in the past but not answer was provided to them: https://answers.ton.org/question/1584677451018014720/is-there-such-a-thing-as-number-of-block-confirmations-on-ton

&rey: One confirmation. Once transaction is included in a signed block, it is final. (reply to 65985)

Влад: Hey guys, I hope you could help me. I have certain account, I need to sign a simple message with code on it, to prove ownership for some CEX. How could I achieve this, in what direction should I make a search?  Seems like wallets don’t provide such functionality🥲

Witter: https://toncenter.com/api/v3/#/default/send_message_api_v3_message_post

Witter: Its return value is message_hash. How can I get the corresponding transaction hash from this message_hash? I want to get the transaction details of this message. (reply to 65994)

User<6697016023>: Explain better (reply to 65989)

Влад: I just need to sign message. It would result signature (encoded string). Message would include some verification code (requested by CEX to include in message). So when I sign this message with code I could prove to CEX that I am owner of that account.  So just need to way achieve this, any ideas? (reply to 65996)

&rey: It is likely scam. Is the CEX listed on https://ton.app? Could you use another one? (reply to 66001)

Влад: seems like it’s not in the list, and I need this signature to withdraw (reply to 66005)

&rey: Do you already have message which should be signed, or the service name?

Влад: yeah, I do have message, it needs to be something like this “<address> bellongs to me  code: <xxxxxx>”  by the service u meant CEX? (reply to 66007)

Влад: HashKey (reply to 66007)

Aydin: 1. Start with the official website: https://docs.ton.org/  2. Spend some good amount of time reading the whitepapers: https://docs.ton.org/learn/docs  3. You will need a minimum amount of TypeScript knowledge (e.g., to be able to work with Blueprint)  4. Regarding TON-specific languages, there are: - Tact (highest-level, easiest to learn first) - FunC - Fift  - TVM instructions (assembly-like) (reply to 65943)

Meow: hi, how to parse body in_message and out_message ? I have getTransaction and want to use abi contract to read event emit from that data

User<6861867033>: Hi ton devs! I need help on getting jetton wallet address from user's address at offchain.  I used dedust sdk before but i want to do this with @ton library. Does anyone have code or url? Plz help...

User<7123272744>: How can I help you? (reply to 66020)

O(log(n)): Hi i would like to know if after the user has made a first payment in our mini-app, telegram allows us to save this information to remind them of their previous payment methods? like that

O(log(n)): to do stuff like that

User<6697016023>: Yes, Telegram allows you to save user payment information for future transactions through the Telegram Payment API. (reply to 66030)

Ilya: Hi guys, can i test usdt jetton sending on testnet ?

&rey: You can test other jetton sending on testnet. (reply to 66035)

Ilya: sorry i still dont understand, lets say i want to simmulate on testnet sending usdtJetton from one wallet(contract) to another, what should i do ? (reply to 66036)

&rey: You should take another jetton (say, mint on https://minter.ton.org/?testnet=true) and simulate sending that. (reply to 66037)

User<7123272744>: It is very easy to transfer jetton token from one wallet to another. There is an open source code.

Ilya: thank u 🙂 (reply to 66038)

Mahdi: hello everyone how can i connect testnet with ton tools Ls client ?

максим: Hi, can you help, I need to send on tact onchain message to another contract(of this type (int) handle_getter_messages(int op, int query_id, slice sender_address, slice in_msg_body) impure inline ) and get the data in my own and write to a variable. Thanks in advance, will be very grateful

cfs chef: is there a multi send ton tools?

&rey: This does not define incoming message in any way. You should check how destination contract reads the message (or its TL-B if available) and create one on Tact side appropriately. (beginCell is available on Tact.) (reply to 66046)

User<6697016023>: One click sender (reply to 66052)

User<7123272744>: Who needs a Ton developer?

Skee: for free? ) (reply to 66068)

User<7123272744>: it depends on the requriement

&rey: Notcoin is irrelevant to this chat. (reply to 66080)

User<7258971079>: I transferred them to Volton Keeper (reply to 66083)

&rey: Then you should write to support of that. (reply to 66085)

User<7258971079>: Please guide me to whom.  be in touch (reply to 66086)

Nxrix: Is there api for getting transactions of wallet 16 by 16 or filter them to be only from wallet a to b

&rey: dton.io/graphql can do so. (reply to 66089)

Nxrix: I remember that I tested it and it only worked with the example wallet  Testing with other address gives error (reply to 66090)

Nxrix: Do you know what did I do wrong? Do they need an api key or something like that

Nxrix: Oh they have fixed the problem thanks 🥹 (reply to 66090)

Nxrix: will that work even if the wallet has like 1m or more total transactions and we need only 16 from the middle (reply to 66090)

&rey: You should correctly set page and page size, and it should be fine. (reply to 66097)

Nxrix: so the dton api is powerful enough (reply to 66099)

O(log(n)): please can you explain more or share some link related to this (reply to 66034)

User<7123272744>: I got the perfect result using it. It is very powerful and detailed. Highly recommend it (reply to 66100)

Muhammed: Hello, does anyone know how long the network maintenance takes?

User<1072584688>: Hello, don't be tired, sorry, I had Natcoin in my account, now I think you didn't give it to me, what's the reason??

Амир: Sorry man, my bad. How much natcoin must we return to u? (reply to 66130)

Egene: Does anyone know how to interact with the TonKeeper Battery so your W5 wallet can pay for gas fees with USDT?

degentrend: Hi , everyone , Enjoy good weekend . I'm software developer being proficient in funC/Tact . if you are in need of developer , reach me out. thanks

Anıl: Hey everyone!  I'm a Unity game developer. I am looking for a TON Gamefi project to dive in. I want to learn how the things are going in that games.

Anıl: Also if you have tutorial about this It would be wonderful as well :) (reply to 66157)

— 2024-06-03 —

meomeocoj | Mike: hi guy how to check it's null address in funC

Mahima Thacker: A user would be able to pass this data from the frontend side, May be using the Input from the UI. hope you get it (reply to 65708)

User<7192644220>: Hi, tonapi.io supports testnet endpoints?

Angel: who needs a TON developer? I can start immediately and work full time in your time zone. Waiting for your response.

Ilya: Hi guys, can somebody help me to understand, im trying to send Jetton from one address to another, but its not working, what is wrong here ?      await test.send(         provider.sender(),         {             value: toNano('0.05')         },         {             queryId: 1n,             $$type: "InitiateTransfer",             amount: toNano("0.2"),             recipient: address('0QCnkeLAqVdHLKxHj2mQGgFqfoxOpic_NafnyVjpMd4tSoKG'),             forward_ton_amount:  toNano('0.02')         }     )   receive(msg: InitiateTransfer) {         self.transactionCounter += 1;          send(SendParameters{             to: sender(), // address with jettons ( from which we will send values )             bounce: true,             value: 0,             mode: SendRemainingBalance + SendIgnoreErrors,             body: TokenTransfer{                 queryId: 2,                 amount: msg.amount,                 response_destination: self.usdtWallet,                 forward_ton_amount: msg.forward_ton_amount,                 destination: self.usdtWallet,                 custom_payload: null,                 forward_payload: emptyCell().asSlice(),             }.toCell()         });      }

Dhruv: can anyone please help me here? (reply to 65701)

Mahima Thacker: Should we store multiple Strings in one Cell?

Russia: Why do I send TON from THIS address to this address, on the laptop it still says it was sent successfully, but there is no transaction, but the same code on the desktop is sent successfully, what is the reason?

Harry: Check for length limitations and data type (reply to 66209)

Dhruv: thanks for the reply but I think there is no issue of length as for testing purpose i am using very short string "example metadata", and for the type i used String wherever it should be (reply to 66218)

Harry: What of the encoding  which format are you using

&rey: Mempool tends to lose transactions arbitrarily. (reply to 66215)

Russia: So is there a way to fix it on a laptop? (reply to 66223)

&rey: Resend same message (yes, with same seqno) until its marked deadline is reached or seqno changes. (reply to 66224)

Dhruv: nothing, just passing plain String as it is (reply to 66221)

User<6327676316>: Please help me (reply to 66199)

Logan 🐯: How to scan event logs

Liam: Hi 👋🏻  https://github.com/ton-blockchain/mytonctrl/blob/master/docs/en/import-wallets.md#importing-using-a-mnemonic-phrase  I successfully imported the wallet using mnemonic2key as documented.  After that, when I proceeded with the transfer using the mg command in MyTonCtrl, I received the following error   "Error: local variable 'args' referenced before assignment"  Is there a workaround? Any advice would be appreciated.

MA: hello guys, i want to scan all the blocks and shards for new transactions but as I see the seqno is different in each shard and also it is not globally sequential. for example if I had a problem and I miss some block due to server issue, how can I retreive all the missed blocks ? what is the globally sequential id that I can use to check missing blocks ?

&rey: testnet.tonapi.io should work fine. (reply to 66229)

Yase: Hi guys, how can I get USDT on the testnet?

Logan 🐯: How to scan event logs (reply to 66236)

Logan 🐯: where is the api

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 53 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 31  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Ken: Can someone point me to documentation of "supported interfaces"? _ supported_interfaces() method_id {     return (         "org.ton.introspection.v0"H >> 128,         "org.ton.abi.ipfs.v0"H >> 128,         "org.ton.deploy.lazy.v0"H >> 128,         "org.ton.debug.v0"H >> 128,         "org.ton.chain.workchain.v0"H >> 128     ); }

perfogic: @pcrafter hello, can you give me example code for using exotic cell on func

Kɪᴍᴏᴠ: https://docs.tact-lang.org/ref/evolution/OTP-001 (reply to 66265)

Nerses: Hi everyone ! How can I update my TACT version from 1.2.0 to 1.3.0 ?

K.: Not an answer to your question, but you probably should revoke that access token, because it could be used by anyone now. (reply to 66275)

K.: Is the wallet you are opening deployed? (reply to 66279)

K.: The mnemonic phrase gives access to a certain wallet and to get the seqno or do anything, the wallet needs to be deployed first. (reply to 66281)

K.: What error you are getting exactly? (reply to 66279)

User<43817863>: Nice

K.: That means the request is taking longer than 30 seconds and the TonClient throws an error. Get requests shouldn't take that long. (reply to 66288)

perfogic: @pcrafter can you check mate (reply to 66269)

K.: Might be a problem with the RPC, not sure, the code for getting the seqno looks correct.

&rey: I don't remember beyond cell valid_pruned_merkle() {   cell r = begin_cell().end_cell();      cell pruned = prune(r);   pruned~dump();      cell merkle = begin_cell()     .store_uint(3, 8)     .store_uint(cell_hash(r), 256)     .store_uint(0, 16)     .store_ref(pruned)     .end_exotic();   merkle~dump();      return merkle; } (reply to 66269)

K.: This is a great tutorial and probably what you need: https://tonhelloworld.com/01-wallet/. It uses Orbs network for the RPC, which has been so far quite reliable. (reply to 66294)

Vin: How can I download ton to my android

&rey: You mean some wallet app? You can find one on https://ton.org/wallets. (reply to 66300)

Nxrix: Can dton get number of transactions in a day or unique addresses that send transaction?

Nxrix: Do they have a telegram chat or group? (reply to 66304)

Made by: Hello everyone, I’m trying to contribute to tondynasty contracts with Upgradable trait.  https://github.com/bymoses/tondynasty-contracts/blob/feat/upgradable/tests/UpgradableExample.spec.ts  Here you can find tests for this trait and code updates (functions add/update) are working fine, but when there is some change in storage fields of contract (see v3) it breaks something within Cells. I don’t have deep understanding of what’s happening here so I need some help to write native funC wrapper for set_data function that will not corrupt contract Cells

Lev: How can one get the hash of a transaction signed in TON Connect?

Nerses: Is TACT Turing complete language ?

Vitor: Yes. (reply to 66309)

Linthero: How could I get wallet address from mnemonic in JS?

Cube: I'm trying to get all account transactions through the Pytonapi library, but only incoming msgs are returned (I need outgoing ones). Who knows how to solve this issue?

Nxrix: Try to use a JavaScript library like ton web because doing it yourself isn't easy (reply to 66311)

Linthero: I'm using @ton/crypto mnemonicToWalletKey like so:   async getKeyPair() {     if (!this.keyPair) {       if (!process.env.MNEUMONIC) {         throw new Error("Mnemonic not found");       }        this.keyPair = await mnemonicToWalletKey(         process.env.MNEUMONIC.split(" ")       );     }      return this.keyPair;   }  What library should I use to get that wallet address (I need this just to verify I'm using the correct mnemonic) (reply to 66315)

Constantine Костя Кастусь: Test giver isn't working?

Linthero: Does anybody have a clue how to off-chain sign a message that triggers particular function in smart contract?

&rey: Any message triggers recv_internal only. (reply to 66322)

&rey: @ton/ton, WalletContractV?R?.create. Though you can have problems because of different wallet versions. (reply to 66317)

Aibar: where can i get ton stats data?

Aibar: where i can get the data about txns, volume on ton? (reply to 66325)

Linthero: I need to send a message from NodeJS server that triggers function in my contract. This have to happen without me manually approving transactions in my wallet. (reply to 66323)

Aibar: i mean txns amount and the volume on the whole chain (reply to 66327)

Maxim: Hello there!  2024/06/03 13:34:09 Building Message gets 2/3 stages Transferring NFT... &{Mode:3 InternalMessage:0xc000386af0}&{NextItemIndex:+200 Content:0xc00038e600 OwnerAddress:EQBp4oLN3OqtUakAcRKRBgYGffcNn9eO8ZtXEBEG02UDpqFC}2024/06/03 13:34:09 Send err: failed to send message: lite server error, code 0: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 69E282CDDCEAAD51A9007112910606067DF70D9FD78EF19B57101106D36503A6: exitcode=35, steps=24, gas_used=0 VM Log (truncated): ...ute IFJMP execute INC execute THROWIF 32 execute PUSHPOW2 9 execute LDSLICEX execute DUP execute LDU 32 execute LDU 32 execute LDU 32 execute NOW execute XCHG s1,s3 execute LEQ execute THROWIF 35 default exception handler, terminating vm with exit code 35   Can you help me understand what happened? The code worked

perfogic: thanks mate (reply to 66295)

Nxrix: Using libraries like ton web (reply to 66340)

Aydin: TonStat (reply to 66329)

Aydin: Then you have to design the whole smart contract architecture accordingly, with appropriate logic to handle such triggers automatically. (reply to 66328)

&rey: Yes, but what would it mean? (reply to 66346)

Linthero: Yes I will add another OP code in the recv_internal of my contract and handle what I need from there. What I'm asking is how to send message to my contract from my NodeJS server. As far I understand only wallets can receive external messages and from a wallet I need to send message to my recv_internal of my contract. I'm struggling a lot in sending such message. Here is a short sample of how I'm trying to achieve that:    async sendDeposit(provider, sender, value) {     // Original deposit code confirmed from Tonkeeper     // const msg_body = beginCell().storeUint(OPT_CODES.DEPOSIT, 32).endCell();     // await provider.internal(sender, {     //   value,     //   sendMode: SendMode.PAY_GAS_SEPARATELY,     //   body: msg_body,     // });      const keyPair = await this.getKeyPair() // uses mnemonicToWalletKey to generate keyPair     const wallet = WalletContractV4.create({       workchain: 0,       publicKey: keyPair.publicKey,     });      const message = new Cell()       .asBuilder()       .storeUint(OPT_CODES.DEPOSIT, 32)       .endCell();      try {       const walletSendRes = await wallet.send(provider, message);       console.log("walletSendRes", walletSendRes);     } catch (e) {       // log axios errors       console.log("e.response", e.body);     }   } (reply to 66345)

Aydin: No, this is NOT the case. Indeed, ANY smart contract with a recv_external function is potentially capable of receiving external messages, with no need for wallets in-between. If you really need to eliminate middleware wallets, you can consider adding this function to your smart contract. (reply to 66349)

Mahima Thacker: Hey guys, do we need to convert maps to a cell in order to get the values using its key?

Linthero: I don't mind either option. I already checked external messages but I only found high level overview of them explaining how dangerous they are and that they need to be authenticated. I will be really grateful, if you can point me to an example where it is shown how to handle external messages or how to trigger wallet transaction from NodeJS without the need of confirmation (reply to 66352)

&rey: In FunC or in Tact? (reply to 66354)

Mahima Thacker: In Tact. (reply to 66361)

&rey: Have you read documentation on wallet.send? (reply to 66349)

Mahima Thacker: I tried to get the nft addresss using its index but getting null here:       address: map<Int, Address>;  fun mint(sender: Address, msgValue: Int, individual_metadata: Cell ) {         require(self.next_item_index >= 0, "non-sequential NFTs");         let nft_init: StateInit = self.getNftItemInit(self.next_item_index,individual_metadata );         let add: Address = contractAddress(nft_init);         self.address.set(self.next_item_index, add);      get fun get_nft_address_by_index(item_index: Int): Address? {         // self.address.asCell();         return self.address.get(item_index);     }

&rey: Please try setting int size in map: map<Int as uint32, Address>. (reply to 66365)

Linthero: Yes, I'm currently looking exactly at that and I'm trying to achieve this like so    async sendDeposit(provider, sender, value) {     const keyPair = await this.getKeyPair();     const wallet = WalletContractV4.create({       workchain: 0,       publicKey: keyPair.publicKey,     });      const message = beginCell()       .storeUint(OPT_CODES.DEPOSIT, 32)       .storeCoins(1000)       .endCell();      const walletSendRes = await wallet.send(provider, message);     console.log("walletSendRes", walletSendRes);   }  No response is received nor coins nor transaction created in the explorer (reply to 66364)

&rey: It's JS feature, showing length for function. Please invoke it and consider result. (reply to 66366)

&rey: You need sendTransfer. (reply to 66368)

Mahima Thacker: Yes tried but still getting the null value in log while running the test (reply to 66367)

Mahima Thacker: console.log("nftCollection - ", nftCollection.address)          const nftItemAddress = await nftCollection.getGetNftAddressByIndex(0n);         console.log("nftItemAddress - ", nftItemAddress) (reply to 66373)

&rey: By the way, you're doing totally strange thing. Such NFT collection isn't able to store more than 32K items, and is expensive to operate. (reply to 66365)

Mahima Thacker: Can't we mint off-chain metadata here? for example like this;- https://salmon-governing-canidae-592.mypinata.cloud/ipfs/QmQYUEJqsfkSNyJ8Vxdsq5ZpLyp9cyw81HWPemkJ2tBuzF/collection.json

&rey: 0 should work fine. It's a TVM feature. (reply to 66377)

Mohammad: Hey everyone. How can I simulate time is passing in writing tests for my smart contrcats?

&rey: blockchain.time, blockchain.now or something like that. (reply to 66382)

🦴 Emboy 🦴: Hello guys.. is there anyone who can help me? i mistakenly send my Notcoin to a wrong wallet address, is there i way i can recover my notcoin?? thnx in advance guys..

دانیاِل: App ton coin please

دانیاِل: Ton coin please (reply to 66393)

Mohammad: blockchain.now is undefined (reply to 66384)

Farhad: Tonhub or Tonkeeper (reply to 66395)

دانیاِل: . (reply to 66395)

دانیاِل: TANKS (reply to 66398)

&rey: Transfer whatever is remaining to another wallet which you consider safe. Forget about the old wallet. (reply to 66401)

&rey: Depends on wallet application. In general, process is called "delete account", then create a new mnemonic. (reply to 66410)

Aydin: Also, at least MyTonWallet and Tonkeeper apps support multiple accounts at the same time (reply to 66412)

Louis: Hello everyone, pls help me, how can I obtain the event_id when performing a transaction?

Angel: Who needs a Ton developer?

Hiroto: Yang, I am hiroto. I left some messages to Hunter Degen. Please check the time track and git repo. (reply to 64304)

Aydin: No problem. Even on Telegram, you already have two wallets at the same time: one the custodial @wallet, and the other the non-custodial TonSpace.  So, you can easily do the funds transfer:   1. If the old wallet is on TonSpace, transfer the funds to the custodial @wallet.  2. If it is @wallet, then simply create a new wallet on TonSpace and do the transferrence. (reply to 66426)

@Shakatsu: Me (reply to 66430)

@Shakatsu: Could you help me? (reply to 66430)

Angel: I can help you (reply to 66435)

Mohammad: Guys I have a loop like this:      int counter = 0;      (int date, slice value, int flag) = storage::history.udict_get_max?(64);     while (flag) {         if(now() > date) {             counter += 1;             ~dump(counter);              date += ONE_DAY;              storage::history~udict_set(64, date, begin_cell().store_coins(storage::pool_size).end_cell().begin_parse());         } else {             flag = FALSE;         }     }     save_data();  But only 32 numbers are dumping in the output while I expect seeing 100 as my counted based on the blockchain's current time!  is this because of dictionary limitations? if yes why there is no error or exit code?

Joker: Hello, family! Hope you all had a good weekend.

Joker: I'm a seasoned blockchain developer eager to join forces on exciting projects. Looking forward to discussing your projects and ideas!

🦴 Emboy 🦴: is there a chance i can recover my Notcoin that i've transfer to a wrong address???

User<6376055919>: Emboy, it is impossible

Harry: Very impossible don't listen to any scammer dm telling you they can recover it (reply to 66450)

🦴 Emboy 🦴: thank you.. some scammer send me dm telling me that they can recover it.. thanks guys for your help.. (reply to 66457)

Амир: But even if they had access to ur tg, they couldn't have access to ur ton space 🌌 (reply to 66477)

Mohammad: any idea?  By adding message value I get more items traversed! I have no problem with gas limit. how can I pay gas from my contract's balance? (reply to 66444)

Tiago: Hello everyone, the gaming studio is looking for a developer for TMA, details in the bos. Write even if you have no experience, we will consider all of them

Hoblin: Are there any developers in search for a killer app on Ton ideas? I have one, it's marvelous and I can share it with anyone who would listen. If so please DM me. It is in high demand, the time is ripe, user base can be huge. Don't take me for a fool, it is truly a remarkable idea at your fingertips, somehow it hasn't come to anyone else. I checked.

Simone: Guys I have a Jetton, but when I try to swap it, my jetton wallet address bounce back with exit code 707, someone can help? https://tonviewer.com/transaction/87ba810208bbecd3268ea40f54300b1ef924b6ea5cacdc15434dd9d3da831f00

Creator: Hello People.  Can`t figure out why TransferNotification falling down with error skip_no_gas.   https://testnet.tonviewer.com/transaction/838076826058886eca12212900432625d826dda1f870fdb77d20ebb26020ac8e  I send enough forward amount etc. Master and wallet are defaults from minter.org.   Can anybody help me?)  here is receiever code:  receive(msg: TransferNotification) {         let ctx: Context = context();         if (self.costs.get(ctx.sender) == null) {             self.costs.set(ctx.sender, msg.amount);         } else {             let updated_value: Int = self.costs.get(ctx.sender)!! + msg.amount;             self.costs.set(ctx.sender, updated_value);         }         if (self.state == self.OfferPrePublished || self.state == self.OfferCreated) {             send(SendParameters{             to: myAddress(),              value: 0,              mode: SendPayGasSeparately,             body: CheckPublish{                 query_id: 0             }.toCell(),         });         }     }

User<6558719212>: Hello everyone , im beginner at ton ecosystem , i have question , how can i make something like this for my own bot

发财: use a ton wallet sdk (reply to 66517)

User<6558719212>: What mean sdk? (reply to 66519)

User<6558719212>: Can you explain it?

— 2024-06-04 —

aissani: I need help

KingMax👑: Gm based davs, I'm an aspiring dev, looking to build a project on this innovative chain someday(in some near time), as I'm learning the ropes.  In the meantime, I like to volunteer as community manager/MOD for developer communities who are already building.  So guys, if any dev needs someone who could volunteer for their projects, while also learning the ropes, I'm down for it.  Regards🫡

meomeocoj | Mike: () send_simple_message(int amount, slice to, cell body, int mode) impure inline_ref {     cell msg = begin_cell()         .store_uint(0x18, 6)         .store_slice(to)         .store_coins(amount)         .store_uint(1, 107)         .store_ref(body)     .end_cell();     send_raw_message(msg, mode); } hi, i send this with amount to a user but seem it not send TON

Yase: Hello everyone, what does the error code 48 mean?

Yase: I found an explanation in Jetton's contract, which is insufficient gas. (reply to 66536)

Trung Nguyễn: What is the maximum number of validators on the TON network?

Tango RFP: 🔤🔤   🔤🔤🔤🔤🔤  Hey guys, I'm currently launching a french TON community that grows quickly. 🔼  🔍I'm looking for french devs, FunC & TACT, for B2B purposes.   I'm also looking for devs to join the french community, some of us are completing the TON training curses, we have a lot of good will, and would be very honoroud te bo joined by more experienced devs, to help us to progress a little more everyday. ⚙️  👍✉️Please contact me if you know some french devs on TON, we really want to gather the french family.

Xu Chen: Hello everyone,  I would like to monitor the transaction information of a specific contract on TON. I tried using api/v3/transactions to retrieve this data. However, I noticed that the information on tonscan indicates that what I actually need is the transaction history. Could you please advise on how to obtain this data?

&rey: accept_message() (reply to 66484)

Jacky: Hello. I'm building a DApp on TON.  I want to display transaction status popup like stonfi. How can I know if the transaction I just sent was successful or failed? Thanks.

&rey: transaction chain? (reply to 66551)

Jacky: Yes (reply to 66552)

Jacky: I can get the tx hash from the boc response. But I dont know how to verify it success or not

TON Bounty Bridge: ​Proposal: A telegram bot was used to create and transfer NFTs, even shooting SBT to a random wallet address as a prank.  🏷 Developer Tool  Summary:A telegram bot was used to create and transfer NFTs, even shooting SBT to a random wallet address as...  Created by FucktheKingcode

Ou: i'm a beginner,how to create sbt collection on testnet

Skontatinous🫴: At may 29, I sent a ton from my ton space wallet to my normal telegram wallet. The transaction appears confirmed, but the funds haven't arrived still. I didn't receive it in my normal wallet😭😭😭.please, i need my ton back

prometheusoo: mytonctrl install failed, who know why?

Nishtha: Why am I getting error Error: Unable to execute get method. Got exit_code: -13 while calling a getter method on my tact contract?

Mohammad: I did it but it will crash when it gets to 1 TON! I even used set_gas_limit to break the limit but it did not work! (reply to 66549)

Mohammad: Contract balance = 10 TON (reply to 66602)

perfogic: hi how to get this data ? (reply to 66603)

Mohammad: Hi use printTransactionFees(res.transactions)  import { printTransactionFees } from '@ton/sandbox'; (reply to 66604)

perfogic: many thanks ^ ^

pro: where can  found the testnet validators

soes: https://testnet.toncenter.com/api/v3/#/default/get_transactions_api_v3_transactions_get

soes: Does the testing network node not update data?

&rey: Yes. Send message to yourself to continue computation. (reply to 66602)

&rey: Off topic for this chat. Try sending 1 nanoTON to your normal Telegram wallet. (reply to 66575)

Mohammad: How to know that I reached the limit to send message back to myself to continue calculations? (reply to 66617)

&rey: When GASCONSUMED is near config-set gas limit (100K or like that currently). (reply to 66621)

Aibar: How can i get response from the swap tx to know if its successful or not?

Aibar: And how can i get the txn hash?

Wukong: you can't (reply to 66628)

Warnet S.pd: Guys what adress is this   UQCXrZNESRUInoEiOP8Qq-kGbQsD6j26KoYw-5yfiKpFXKdd

Warnet S.pd: I seen on tonviewer i have send to this adress lol , and now my wallet its broken

Sca: Any mini app devs here? Pls pm

Nerses: if(ctx.value == 0){             send(SendParameters{to: ctx.sender,                                 bounce: true,                                 value: ctx.value,                                 mode: 0});          }else{                     }         require(ctx.value != 0,"Funds Not Sent");     } In this code in case the ctx.value is 0 will body of if be executed so doing transaction and then revereted in bottom require OR it will revert immediatly without exefcuting anything ?

Mr.A: Hello, how to parse usdt transfer value and comment?

Clara | Icetea Software: GM, will anyone participate in TON Meetup Event 2024 at GM Vietnam this year? Let's connect and meet up there! Look forward! ☺️

Haris: Hello guys,  how to get reply within cross contract call meaning If I call an internal message from one contract to other contract and that internal message is replying how can I get that reply message

Stephan: Hello guys, please tell me, I have already made a contract deployment via docker toncli for mac m1 and how do I interact with it now, using which commands?

User<6981260071>: Hello I need some help regarding tonweb SDK i should not take long

User<6981260071>: its about seqno

Пескарь™ | фронтент телефонов: @tondev_zh (reply to 66656)

Sina: How get jetton master address from jetton wallet address with tonapi ?

balthy: Could you share it with me? (reply to 66675)

Амир: Stepik course (reply to 66676)

balthy: I know it,  No more course? (reply to 66677)

Амир: Idk anything better than ton docs (reply to 66678)

&rey: It will be processed in separate transaction, so you have to implement such mechanism yourself. (reply to 66643)

Haris: Could you please me some more details or any example of (reply to 66680)

&rey: Fail immediately. First computation phase is done, and only then action phase (sending messages to their respective destinations). (reply to 66638)

Haris: *share

&rey: 1. You can learn about unrolling async functions into state automata, this is quite similar. 2. https://github.com/ProgramCrafter/ratelance/blob/2de56f4f96acf0f9e1e5b0e60ae0ad846ba50170/contracts/func/offer-contract.fc#L59, for example. Usually contracts don't try matching replies to their messages, though. (reply to 66682)

&rey: Please use chat @devs instead. (reply to 66637)

&rey: (not an official survey, just that I've been interested for a while)

Haris: Thanks (reply to 66685)

Cube: How can I deserialize such returned values in python?

Nerses: Thnx a lot.Then could you please give a hint how can I send back the amount if in message data some piece of data doesnt meet the requierments ? (reply to 66683)

&rey: The best way is to throw error; if source contract doesn't want a return, it simply sets non-bounceable flag. (reply to 66694)

Nerses: throw() isnt simply the same as require() ? After compilation message of failing requirement is assigned number and it will work like throw()

K: How user authentication work in tapswap and other mini apps ?

Mohammad: Hey guys  I am deploying a new NFT using nft standard:      cell state_init = calculate_nft_item_state_init(staker, nft_item_code);     slice nft_address = calculate_nft_item_address(workchain(), state_init);     var msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(nft_address)     .store_coins(amount)     .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)     .store_ref(state_init)     .store_ref(nft_content);     send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors  and I want to send jettons from my contract to this nft_address only if it is deployed! I wanted to know if I get transfer notification inside my nft item or not!

&rey: They are same, indeed. (reply to 66700)

Nerses: sorry for misunderstanding but it seems I didnt get how can I send back money if recieved message contains 'wrong' data (reply to 66709)

&rey: Are you aware that if contract fails then remaining value of incoming message is returned to sender in a bounce message? (reply to 66710)

VoyTech: Has anyone done monitoring an address for messages and how to achieve this easily? I want to monitor what messages are received / sent by a contract.

Nerses: I am aware of it just dont get the part if arbitrary contract can send message to my contract then who is setting mode of message bounce ? is it the sender ? (reply to 66711)

&rey: Yes. (reply to 66714)

Nerses: Thanks a lot (reply to 66715)

Mohammad: 👋 Does an uninitialized contract receive notifications about the transfer of a token after it is initialized? (reply to 66715)

&rey: There is no queue for past notifications; if they arrive while contract is uninitialized, they are lost or bounced. (reply to 66719)

Mohammad: Thank you so much (reply to 66720)

Boris: Guys, I am looking for an illustrator/designer and marketing specialists for a game, which is already live (got already very nice feedback from the community at the hackathon in Berlin) you can check it out before you write me @pizzagems_bot  It also got some attention from the TON Foundation, so, I am planning to extend it, add new features and you can be part of it.

Norman: Hello! I am new to Ton but I am building a small project, can anyone help me with finding an alternative to DeBank on Ton?

degentrend: I'm smart contract and frontend engineer being proficient in FunC/Tact , JS/TS, MUI/MUX/Styled Components/Tailwind CSS .

Linthero: Hi, ORBS network v4 testnet nodes is not working for the past 4 hours. I want to deploy a contract to testnet but I can't because blueprint uses ORBS network. The v2 testnet is up and running, is it possible to make blueprint use v2 instead?

Mahima Thacker: Hey guys, is there any way to add a connect wallet functionality using tonkeeper extension and not using QR code with tonconnect SDK?

Nerses: While smart contract verification in tesnet i get suchh error Error: Server error  Error: Error compiling on https://ton-source-prod-testnet-1.herokuapp.com {"message":"timeout of 5000ms exceeded","name":"Error","stack":"Error: timeout of 5000ms exceeded\n at createError (/app/node_modules/axios/lib/core/createError.js:16:15)\n at RedirectableRequest.handleRequestTimeout (/app/node_modules/axios/lib/adapters/http.js:353:16)\n at RedirectableRequest.emit (node:events:517:28)\n at RedirectableRequest.emit (node:domain:489:12)\n at Timeout.<anonymous> (/app/node_modules/follow-redirects/index.js:164:12)\n at listOnTimeout (node:internal/timers:569:17)\n at processTimers (node:internal/timers:512:7)","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"transformRequest":[null],"transformResponse":[null],"timeout":5000,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"headers":{"Accept":"application/json, text/plain, */*","User-Agent":"axios/0.25.0"},"method":"get","url":"https://ton.access.orbs.network/4412c0ff5Bd3F8B62C092Ab4D238bEE463E64412/1/testnet/ton-api-v4/block/19849666/EQBDMKCxZ0leDl4IRU6eBNTYQYvcKCNrSOg8ywocr3u5_2e6/lite"},"code":"ECONNABORTED","status":null} is someone else encounters such issue as well ?

User<7192644220>: 👍Hi experts! how can I send transfer message to jetton wallet contract using tonclient from @ton/ton

Cube: Explain pls what format of data is it? Boc hash or what

Ilya: same (reply to 66751)

User<7192644220>: 👍Hi experts! how can I send transfer message to jetton wallet contract using tonclient from @ton/ton

&rey: Please say if you have any problems with example in TON Cookbook. (reply to 66771)

Nxrix: how can I only get transactions with more than 1 ton for example using dton api?

&rey: I believe that's not possible. (reply to 66773)

Nxrix: what about getting the count of transactions happened last 24h or last 7 days (reply to 66774)

Nxrix: or limiting them by sender address

Gyorgy: Why just not use liteclient and ListTransactions? You can query all account history from the blockchain like explorers does, then you build some JSON structure and organize the data to your liking.   Easy to set LastTxLT, LastTxHash to where to start the data history, or only work with new arriving in transactions for payment systems.  Those sounds unique to me to your application and don’t expect any existing API can be custom tailored, if you need custom solutions best to develop your own queries.   It’s bit more work at first, but once you have it you can use and tailor any data to your liking.

Arnon: A domain has expire what should I do? Im not able place a Bid again.

&rey: Do you need a link for releasing it on auction? (reply to 66780)

Arnon: Yes (reply to 66781)

?: Hi! I have the problem with smart contract. Tonkeeper didn't access the transaction. And I watching this pic about 5 minutes. Someone had this problem? How did you solve it?

Gyorgy: They can be Extended by small mtx. Sending to contract small amount of TON from owner address renews to one more year. I’m not aware what happens if already expired, maybe there are some grace period. (Tonkeeper has built-in button in Wallet to extend as well). (reply to 66780)

Nerses: If size of map affects on gas fee and based to my architecture I cant specify limit of maps.How can I find optimal way to specify as transaction amount to pass computation phase and escape from exit code 37 ?

User<6981260071>: someone can help me out? i pay 5 TON if you can help

User<6861867033>: Hi hope you're doing great. I 'm building a contract, I sent a tx that contract but tx is failed with Result code 34, Not Exit_code.  What is result code and when 34 is come out? I can't get any help from doc. Plz... (reply to 66781)

User<6861867033>: https://testnet.tonviewer.com/transaction/f516842c6a467415230ae2f4f1d43923959559ebcb7bce8e735443603cf201d7 (reply to 66801)

Nostra: Hey guys whats the best way to check in my dapp if a transaction was successful? I am calling the contract with my client however as a result I get undefined. Would appreciate your help 🙏

musashi: hey guys, is the testnet down?

musashi: I cannot deploy contracts, keep showing the exceed 5000ms error

musashi: tried many ways: mnemonic, Tonhub, Tonkeeper

Nerses: yeah I also encountered that problem couple of hours ago

Angel: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

Angel: What does this error mean? (reply to 66814)

&rey: Its meaning depends on other part of error text. (reply to 66815)

User<7192644220>: return value of internal function is MessageRelaxed but sendMessage of TonClient requires Message type. How can I handle? (reply to 66772)

&rey: It should work fine... If Typescript raises an error, please check that libs are up-to-date: @ton/ton, @ton/core and not ton-core. (reply to 66818)

User<6861867033>: HI everyone. What does result code mean? I sent tx to my contract but is failed with result code 34, not exit code

User<6861867033>: https://testnet.tonviewer.com/transaction/135fd1e8ad55b865e5ce9983c6992a807b1dd317c95090655a2454c8ba889dc0 (reply to 66823)

User<7192644220>: Is that correct usage? (reply to 66821)

User<7192644220>: checked version

&rey: No, it isn't. (reply to 66825)

&rey: After all, someone should pay those toNano('0.1') TON. You need to send the message via wallet wrapper (or TON Connect SDK, for that matter).

&rey: Have you hovered over result code and seen that it indicates "Unsupported action"? You've probably formed an invalid message to be sent. (reply to 66824)

User<6861867033>: I think so. I build a new contract deploying tx and run it but that error comes out (reply to 66830)

Angel: How to implement these two steps? (reply to 66833)

&rey: You either should have .store_uint(4 + 2, 108) or uncomment .store_ref(...). (reply to 66835)

User<6861867033>: Is it ok if i put empty cell on that commet part? (reply to 66837)

User<6861867033>: I see thx. The func cookbook code is all ok? Can I use that code? I have read some codes from github ton repos but deploying contract is a bit different (reply to 66837)

User<7192644220>: can you please let me know reference url? (reply to 66829)

&rey: OK. https://docs.ton.org/develop/dapps/cookbook#how-to-transfer-ton-how-to-send-a-text-message-to-other-wallet (reply to 66841)

User<6861867033>: You're genius!. Yeah there's error in (7,108) (6,108 )was correct. (reply to 66837)

User<6861867033>: plz explain in detail. I can't got you. (reply to 66855)

Justinas: Hello, can someone confirm is this bot legit?

Nerses: Is there any other reference of sharding example,except this one ? https://tact-by-example.org/06-unbounded-maps

Aydin: This is routine on TON blockchain: the actor model. For example, you can refer to any well-known and operational jetton code found on GitHub. (reply to 66863)

Nerses: just wanted to strat from simple examples.Do you know such refrences that worth for using as 'explaining' material (reply to 66866)

Aydin: I have personally benefited from Vladimir Alefman's Tact tutorial. In one video, he explains and implements jetton code well. (reply to 66867)

nick: hi admins, how are you guys doing? Just wondering where should I look for the devtool if I wanna build games on Ton App

Nerses: thanks i will find it (reply to 66870)

Aydin: What's it? (reply to 66798)

User<6981260071>: They wallet methods won't show up in the array for the connected wallet (reply to 66875)

Aydin: In an explorer? (reply to 66876)

User<6981260071>: In inspect element for the chrome so I can't use the methods in my code (reply to 66877)

Aydin: Why don't you collect those get methods from blockchain explorers directly? They are pretty easily accessible (reply to 66878)

User<6981260071>: Don't know how to do mate I just need the user to sign and approve the tx in there wallet (reply to 66879)

User<6981260071>: It's not an contract

Aydin: Everything onchain on TON blockchain is a contract, be it a wallet or otherwise. So, if you are referring to a non-contract entity, it is off-chain by definition (reply to 66882)

Aydin: Explain more, please. Scam messages are received frequently (reply to 66886)

Thomas Harvie | Uniblock: Hi All,   Uniblock, the first Web3 API manager, now supports TON.  https://docs.uniblock.dev/reference/tonapi-copy  If you're building on TON, check out our tooling that can help you build faster, more resilient applications.   DMs are open for any questions

Cube: How can I verify my contract on Testnet?

provnuk: Does Phaser3 work in Telegram mini Apps. I can't find it in the documentation??

degentrend: I'm smart contract and frontend engineer being proficient in FunC/Tact , JS/TS, MUI/MUX/Styled Components/Tailwind CSS .

Mumort: Hi quick question, in ethereum, there is a way to subscribe to transactions of a specific type (e.g. transfer) and filter based on specific fields. Is there a similar way to accomplish this in ton

User<6761340678>: Hi guys,we created new coin, who is interested to join our team, DM me

— 2024-06-05 —

lafi: I want to send USDT to multiple USERS how can I do so pls in Tonkeeper ?

️: which api is faster? dex screener or geckoterminal? in the sense of the current price

Ilya: Is it possible to send Jettons via ton-connect ?

Angel: I think you missed this bracket (reply to 66946)

User<6327676316>: is TON testnet node okay? can't deploy contract.

User<6288216921>: Does anyone need a dev? I have pretty good experience in Ton network

محمدرضا: Hi

محمدرضا: Oh my god (reply to 66971)

Hanniba1111: Hi guys, someone has a convinient way to generate invitation codes of games?

Witter: Why does one transfer have two different tx hashes? (reply to 66977)

Cae: be careful of @Zoe_086, he is a scammer and he is here. He might really help you sincerely to solve with your TON dev/tech concerns (not the typical scammer) and later on ask for a tip. From there he will try to gain your trust and scam you afterwards. Just be very careful

NPA120: Maybe you hired him in recent days? Do you need Ton developer? (reply to 66985)

Cae: Nah I'll pass. You could be another @Zoe_086 scamming people here. So if anyone would like to learn, dont accept any DM or don't do any DM. (reply to 66995)

NPA120: alright. There are many scammers in blockchain space. They are trying to get a trust from client and then scamming. Need to be careful.  @Emillyserah1 is a super scammer.

Cae: @Emilyserah one could be another @Zoe_086 here. They have the same # on their profile. Just be careful guys accepting any DMs or DMing anyone from here for tech support. Just ask them here publicly.

Sa: Hey guys  I have a problem with NOTcoin.  can someone help me? appreciate if you could answer me. I transferred all NOTs from Notcoin space to tonkeeper wallet and it was successful. After that, I transferred my NOTs again from TonKeeper to the same address that I had sent from NotCoin. Now the token has been removed from my tonkeeper wallet, but it has not been added to NotCoin.

NPA120: #  seems to symbolize a group of scammers. Anyway, they prefer DM than public chat. So we need to be careful of DM. (reply to 66999)

Norman: Hello! I am new to Ton but I am building a small project, can anyone help me with finding an alternative to DeBank on Ton?

Witter: how to solve it? (reply to 67011)

0x0liver: how to install a subgraph like EVM in Ton?

Ilya: Is it possible to send Jettons via ton-connect ?

K.: yes, absolutely: https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer (reply to 67023)

His Kingdom: Hello guys, please help me  3 ton was sent to my wallet more than 24 hours ago:  The blockchain shows that the withdrawal was successful, but I did not receive TON in Telegram Wallet up till now. Please help me rectify it

5 Slice Pie 🐲: GM - were building a pvp clicker game react native,  Android working perfectly but lag on iphone, anyone know where the issue could sit?

Wolf: @tondeployments I just made this if anyone wants to join! Just displays new token contracts once deployed.  Only made it today, so still need to work out bugs, etc.

Reuven: Hello

Reuven: Is there maybe a developer here who wants to build something together?  I have a certain idea and I'm looking to collaborate, I'm also willing to pay for the work

Baldwin: What if the SendParameters command fails and totalSupply was previously increased because I don't see a revert?

Rodion: Hi! I am seeking someone from the crypto scene who is interested in becoming a partner.   I have developed a successful product that is running inside the telegram ecosystem. Most of the international crowd on Telegram is crypto enthusiasts, and I am barely crypto-literate. I want to introduce token mechanics into the product and plan the product's future together.   The product is a language-learning bot with a mini-app on the way.

R: DM me (reply to 67055)

Linthero: Hi! How could I get testnet USDT or access any DEX on the testnet?

MEW: any one use this config connecting to liteserver? https://ton.org/global-config.json

MEW: continuous timeout😭

MEW: where to find all the interface, like jetton_wallet / Jetton_wallet_v2( for $NOT )

Guziec: Hi guys! I just wonder, is there any simple solution to get all transactions executed on TACT smart contract?

0x0liver: hello, what is external out message that dedust used?

MEW: 😇

MEW: are u guys using the public config or your own fullnode as liteserver (reply to 67079)

C: hi my guys I would like to ask, after deploying Jetton to the testing network, how should I perform mint or transfer operations on my Jetton? Is there any interface operation. Or can only write test scripts

Yakubu: Hello please help me

0x0liver: do you have solution yet? (reply to 49041)

Vito: Can someone help me to read boc from ton-api? I need to fetch usdt jetton transaction when it is in mempool

musashi: I remember that I added the on_bounce method for revert the states (reply to 67114)

0x0liver: i sent 2 txs in a time, then how to bounce both if 1 fail? (reply to 67116)

musashi: my case is just 1 message at a time

musashi: I think you can use the opcode to identify which message was failed (reply to 67117)

Norman: Found way to retrieve user's jetton and NFT holdings and prices for those assets through tonapi.io.  Endpoints of interest: - Address's jettons: /v2/accounts/{account_id}/jettons - Address's nfts: /v2/accounts/{accounts_id}/nfts - Jetton's price: /v2/rates  ===  Now I wonder if after all I will need to create my own  wallet asset checker or are there similar to Debank and Sub.id services to get user's assets?

0x0liver: but i cant bouced the other message (reply to 67120)

&rey: You can't clawback TON which have already been sent, nor revert transactions "chain". (reply to 67117)

musashi: yes i mean revert = rollback the state to the old version =) (reply to 67124)

0x0liver: i see, it is a very very hard task (reply to 67124)

Nishtha: The dump method that is used to debug in tact contract, is not working for me. Can someone tell me what could be wrong?

Think: Many thanks

BBS 🥏: Hello everyone!  Are there any enthusiasts writing smart contracts in the chat?) 😶‍🌫️  There is a worldwide project including in the TON network. The team needs a person with experience in Smarts

&rey: You might've forgotten to enable debug logs in Tact config. (reply to 67139)

ZVKI G: Hello everyone!  We need someone skilled in developing the frontend of a web application using Nuxt.js.    for a mini app game on TON  The mechanics are already worked out, we have a Figma design, and nice CTO :)

Skontatinous🫴: What did it mean verfy transaction?

Nerses: is there any code example how can i use sharding as scaling solution in smart contract.i watched stepik course and also there was some code in tact by example page still now i think it isnt enough to start adding sharding part to my smart contract.

musashi: https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons (reply to 67160)

Nerses: thanks a lot,but I would be happy if there is any code example.As i have understang of sharding architecture but cant implement it (reply to 67161)

musashi: jetton contract is a great example (reply to 67164)

User<6861867033>: That means the stealer can hack the whole users on ton blockchain. It's impossible. and you must aware people around you to protect your wallet and mnemonic. (reply to 67158)

User<6861867033>: The wallet is being hacked thanks to owner's mistake. If owner aware about safety, no hacks available.

Ilya: Hello!  Where I can test my smart contract? I deployed it to testnet.   I want to use a get method   Maybe there are online sites or bot in telegram to do it? Please help 🙂

&rey: testnet.tonviewer.com can help you with that; though you really should consider @ton/sandbox. (reply to 67186)

Ilya: Super!!! Thank you! (reply to 67188)

Rick: const jettonWalletAddress = Address.parse('put your jetton wallet address');     const destinationAddress = Address.parse('put destination wallet address');      const forwardPayload = beginCell()         .storeUint(0, 32) // 0 opcode means we have a comment         .storeStringTail('Hello, TON!')         .endCell();      const messageBody = beginCell()         .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer         .storeUint(0, 64) // query id         .storeCoins(toNano(5)) // jetton amount, amount * 10^9         .storeAddress(destinationAddress)         .storeAddress(destinationAddress) // response destination         .storeBit(0) // no custom payload         .storeCoins(toNano('0.02')) // forward amount - if >0, will send notification message         .storeBit(1) // we store forwardPayload as a reference         .storeRef(forwardPayload)         .endCell();      const internalMessage = internal({         to: jettonWalletAddress,         value: toNano('0.1'),         bounce: true,         body: messageBody     });     const internalMessageCell = beginCell()         .store(storeMessageRelaxed(internalMessage))         .endCell(); } Hello everyone, I found this example in the Ton Cookbook. Is this the code to transfer jetton? How do I integrate it with tonConnect.sendTransaction?

&rey: It is. You replace everything starting with const internalMessage = ... with await tonConnect.sendTransaction(.... (reply to 67194)

Nerses: After smart contract sharding will address be same for smart contract ? I mean should I sned messages to parent contract or child contracts

Xonxora: Hello I have experience with telegram mini app game development as a frontend developer And I am familiar with Nuxt.js Also this is my past work experience related tg mini app and please enjoy it https://t.me/TON_cars_bot At that time, I was in charge of frontend position I can start to work for you right now (reply to 67145)

&rey: To one which is responsible for handling the specific request in your architecture of choice. For instance, jetton is sharded by user address, so users send messages to their own jetton wallets. (reply to 67197)

&rey: There is no automatic sharding available in TON blockchain, even though there are reserved fields for "anycast".

Nerses: what you think about architecture where only parent contract handles the messages and readdress them to certain child contract ? will I take benefits of sharding in that architecture ? (reply to 67199)

&rey: You'll get little of benefits, because shard with parent contract may become too busy, increasing cross-shard message queues. (reply to 67204)

Nerses: one more clarification every child contract will have different address.Am I right ? (reply to 67205)

Rick: Sorry, it's actually tonConnectUI.sendTransaction. I replaced it according to the suggestion, but it doesn't seem correct. Please help me fix it (reply to 67196)

&rey: payload: messageBody.toBoc().toString('base64') Otherwise, the code is correct. (reply to 67208)

Rick: I tried adding toBoc() earlier but missed "base64". The code is working now, thank you very much. (reply to 67209)

Aydin: I believe it is much beneficial to concentrate on Jettons Standard (TEP-74). There, you will also find the reference jetton implementation.  This way, I believe, the actor model of jettons (and also smart contracts in general) may become more clarified for you. (reply to 67207)

Nerses: thanks a lot (reply to 67213)

Victor: hi devs! i would like to generate a payment link that would open @Wallet bot with the predefined wallet address, amount in Ton and a comment. could you please let me know the link format

User<6523908981>: Hello, did you hire TON developer ? (reply to 65538)

&rey: Why the bot, actually? Do you know for a fact that your users have wallet there? (reply to 67216)

Danial N: Hi I'm work in Exchange  and we have problem with Wallet version  and transactions  could I ask about that ?

Victor: I accept ton payments in my service and assume that @wallet is the most convenient way to pay in ton without leaving the Telegram app. I found a way to navigate users to wallet apps (like Tonkeeper and MyTonWallet) but would like to deep link to @wallet instead as it’s a more seamless experience. Anyone knows how to deep link to @Wallet bot or mini app so that it opens with the address, amount in Ton and a comment pasted from the deep link? (reply to 67220)

Nerses: in jetton wallet contract as every child deploys another one shouldnt they have same address as calculation of adddress is deterministic and all child are same instacance of parent

&rey: Address is hash of initial state (code and data). Different jetton wallets are bound to different users and therefore have different initial data. (reply to 67225)

Big Chiano: noob in the house, what's good

Aydin: You're right. The situation is truly awful now... Hope the coming updates resolve all this mess (reply to 67231)

Ilya: guys, why cant i send usdt ?

Ilya: It say sending 1usdt but nothing is sending

Ilya: Wild West 💀

Dinkar: Hey @martinrev0101 please check DM! (reply to 67217)

Dinkar: Any Developer who can develop mini apps on TON and Telegram, Please contact or DM me ASAP!

&rey: You're sending 0.02 TON and asking jetton wallet to forward 0.05 TON out of that, do I see right? (reply to 67237)

&rey: @tonhunt, please. (reply to 67242)

Ilya: .storeCoins(1000000)    doesnt it mean i sending 1 usdt ? and this is fee   - amount: toNano(0.05).toString(), (reply to 67243)

&rey: .storeCoins(toNano(0.05)) — what does that mean, then? (reply to 67245)

Somer: Does anyone have a recommended example code for integrating the Jetton contract on the frontend?

Ilya: .storeCoins(1000000)                      // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)     .storeCoins(toNano(0.02))                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message         amount: toNano(0.05).toString(), // fee  this is from docs (reply to 67247)

&rey: Have you swapped 0.02 and 0.05 TON accordingly? (reply to 67237)

Ilya: i did, and with last configuration( after swap)  its working (reply to 67250)

Ilya: thank u for help 🙂

User<6861867033>: You mean telegram wallet? (reply to 67230)

User<7121766667>: Hello, folks. Is it possible to implement bundle transactions on ton network?

&rey: Up to 4 messages from common wallet contracts; up to 255 messages from preprocessed, highload, Tonkeeper v5 or inplug-v2. (reply to 67262)

User<7121766667>: So you mean it's possible? (reply to 67263)

Vito: Hello, It’s new network for me. I also need to known how can I test it with easy solutions to observed how it works (reply to 67267)

W. [Разработка сайтов]: ofc scam (reply to 65423)

Артур: Hi guys! Is there any way to listen to wallet events (like transactions)?

Амир: Of course (reply to 67281)

Артур: Could you tell me how I can find information about how to implement it? Is there any related documentation? (reply to 67282)

Rick: Hello, I am transferring jetton and encountering error code 9 in TokenNotification. Where should I start checking and fixing the code?

Ilya: Sorry. What is a program? WHen you see the route (reply to 67285)

Vladimir: Check notify-related cell 😌 (reply to 67285)

Rick: Sorry, I don't really understand your question. I am transferring jetton to my custom contract using TS, and handling the logic in receive(TokenNotification) using Tact. (reply to 67286)

Rick: Where should I check sir? The contract or the TS code? (reply to 67288)

Vladimir: Both (reply to 67292)

Rick: receive(deposit: TokenNotification){         require(context().sender == self.usdtWalletAddress, "Invalid token"); // Exit code: 57879         if(deposit.from == self.owner){ // Admin deposit profit             self.usdtBalance += deposit.amount;             return;         }         self.requireNotStopped();         require(self.roundsLength > 0, "Round not added");         let roundIndex: Int = deposit.forward_payload.loadUint(8);         require(roundIndex < self.roundLimit, "Round index out of bounds"); … orther logic } this is my contract (reply to 67293)

Rick: const forwardPayload = beginCell()         .storeUint(roundSelected?.roundIndex, 8         .endCell();        const messageBody = beginCell()         .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer         .storeUint(0, 64) // query id         .storeCoins(toNano(depositAmount)) // jetton amount, amount * 10^9         .storeAddress(destinationAddress)         .storeAddress(sender.address) // response destination         .storeBit(0) // no custom payload         .storeCoins(toNano("0.022")) // forward amount - if >0, will send notification message         .storeBit(1) // we store forwardPayload as a reference         .storeRef(forwardPayload)         .endCell();        const res = await tonConnectUI.sendTransaction({         validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve         messages: [           {             address: jettonWalletAddress.toString(),             amount: toNano("0.1").toString(),             payload: messageBody.toBoc().toString("base64"),           },         ],       }); and my code on FE, can you check for me pls sir?

&rey: I think this fails. (reply to 67294)

&rey: Try deposit.forward_payload.preloadRef().beginParse().loadUint(8) (as a temporary solution).

Nxrix: I have a wallet ending with p9 doesn't the "_" make any problems?

Rick: Thanks for suggesting me, let me try I also suspect that this line is the issue deposit.forward_payload.loadUint(8) , but when I reuse the function from the blueprint, everything still works fine, so I'm not confident in my thinking. (reply to 67298)

Rick: I encountered this error when building the Tact contract. Do you have other suggestions sir? (reply to 67298)

&rey: This is full solution. let forward: Slice = deposit.forward_payload; if (forward.loadUint(1)) {     forward = forward.preloadRef().beginParse(); } let roundIndex = forward.loadUint(8); (reply to 67304)

Rick: let forward: Slice = deposit.forward_payload;         if (forward.loadUint(1) != 0) {             forward = forward.preloadRef().beginParse();         }         let roundIndex: Int = forward.loadUint(8); Is it okay if I change it like this? Because keeping it as it is will result in a "Type mismatch: Int is not assignable to Bool" error. (reply to 67307)

TON Bounty Bridge: ​جامعه ایمن، خوش‌آمد و سازنده  🏷 Resource  Summary:نوع دیگری را انتخاب کنید.  Created by Sasanh92

User<6861867033>: Telegram wallet is a bit dangerous bcz if someone can get sms from your phone, he can steal all your wallet's balance (reply to 67314)

TON Bounty Bridge: ​یک جامعه بهار و انچمنیت بالاتر و راحتی مردم  🏷 Developer Tool  Summary:قانون گذاری صحیح و اجرای درست به قوانین  Created by Sasanh92

Jason Day: Interested.  I did develop my own token and keen to add utilities. (reply to 67318)

User<6861867033>: he will be around with you

User<6861867033>: Your phone is private and no one shouldn't touch  your's. Even if it's your family (reply to 67327)

Rick: thanks a lot sir, the code is work (reply to 67307)

User<6861867033>: I think you should use other wallet like ton keeper or ton hub (reply to 67331)

Nxrix: How to get wallet "a" transactions that are from wallet "b" using dton

C: sounds interesting! Exactly the special bot meaning? I mean, about the bot's requirements (reply to 67318)

Deeprap: Hello

C: can you show me the figma design? (reply to 67145)

C: I can't dm you (reply to 67351)

C: can we discuss via discord?

C: we should add each other to our contacts

User<6242359642>: ⭐️⭐️

— 2024-06-06 —

TyR: hello i have issue bridge ton, admin help me

Matthew: hi all, I want to process buffers on smart contract, is that possible? e.g. load int from ing msg then store buffer it?

Matthew: hello all, i want encode onchain content of nft, can anyone help me

&rey: For TVM, appropriate abstraction is slice. (reply to 67408)

&rey: I think only @ton_help_bot has authority over the bridge. (reply to 67397)

&rey: You have to convert wallet B's address to hex form, and then use query GetPairwise {   transactions(     address_friendly: "<A>",     in_msg_src_addr_address_hex: "<B hash part>"   ) {     lt     gen_utime     in_msg_value_grams   } } You also should consider whether you need to filter for B address, actually. For instance, receiving payments may be better when not restricting source address. (reply to 67333)

&rey: Please try searching in the chat. (reply to 67410)

Matthew: https://github.com/coalus/MintyTON,currently, the content of nft item is being pushed from offchain, I want to process it onchain, for example I have next_index_item = 0, convert it to 0.json and deploy new nft item, (reply to 67424)

Matthew:   public createMintBody(params: mintParams): Cell {     const body = beginCell();     body.storeUint(1, 32);     body.storeUint(params.queryId || 0, 64);     body.storeUint(params.itemIndex, 64);     body.storeCoins(params.amount);      const nftItemContent = beginCell();     nftItemContent.storeAddress(params.itemOwnerAddress);      const uriContent = beginCell();     uriContent.storeBuffer(Buffer.from(params.commonContentUrl));     nftItemContent.storeRef(uriContent.endCell());      body.storeRef(nftItemContent.endCell());     return body.endCell();   }

Jimmy Becen: hi guys It is possible to forking mainnet when simulate unitest

TON Bounty Bridge: ​Telegram bot for destroying SBT NFT  🏷 Developer Tool  Summary:Currently, there are no tools available that allow users to get rid of unwanted SBT NFTs.  Rewards: • SBT Bounty Reward • 600 USD in TON  Created by nessshon

Nxrix: tysm 😁 (reply to 67421)

&rey: Not fork per se, but it is possible. https://github.com/ton-org/sandbox#performing-testing-on-contracts-from-a-real-network (reply to 67435)

User<7192644220>: I got this error while deploying contract on testnet. What's wrong? It is node problem?

User<7192644220>: it worked before (reply to 67451)

KR-Wilson: how to set two domains with a bot?

KR-Wilson: I want to use Telegram Login Widget，but I have two domains, so can i set two domains in the same bot ?

Ma><im: hello everyone!   does anyone know how to send multiple messages in one transaction via NetworkProvider in ton/blueprint?

Disha | SMBmarket: hey, I'm facing this error :Unhandled Runtime Error NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.   after integrated  "@tonconnect/ui-react"  here is the code : 'use client'; import Layout from "../components/layout/Layout"; // import RightSIdeBar from "../components/sidebar/RightSIdeBar";  import StickyHeader from "../components/header/StickyHeader" import CreatePostModal from "../components/modals/CreatePostModal" import React from "react"; import EntryPass from "./entrypass/page";  import RightSIdeBar from "../components/sidebar/RightSIdeBar"; import { TonConnectUIProvider } from "@tonconnect/ui-react";  const manifestUrl = 'https://sfs-manifest.vercel.app/tonconnect-manifest.json';  export default function Home() {    return (     <TonConnectUIProvider manifestUrl={manifestUrl}>       <Layout>         <main id="site__main" className="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh-var(--m-top))] mt-[--m-top]">           <div className="lg:flex 2xl:gap-12 max-w-[1065px] mx-auto" id="js-oversized">             <div className="max-w-[1080px] mx-auto">               <div className="md:max-w-[580px] mx-auto flex-1 xl:space-y-6 space-y-3">                 <StickyHeader />               </div>             </div>            </div>         </main>              </Layout>       </TonConnectUIProvider>    ); }

User<6399486871>: window.Telegram.WebView.postEvent('web_app_open_tg_link', false, { path_full: path_full }); use this way to deal pay but can not open in android web app ?

User<7192644220>: Hi, Experts!!! Please help me (reply to 67451)

nick: Hello,How to fix this? Notice that error when DownloadDump before

User<7123272744>: This is because of testnet nodes.. it does not sometimes work well.  So i am working on mainnet.  In mainnet, I am facing 500 errors sometimes. but it is not wrong. If we keep trying until success, the contract will be deployed to the blockchain.  Even though it shows the error, deployment might be successful. (reply to 67451)

User<7192644220>: I am trying for over 8 hours (reply to 67481)

meomeocoj | Mike: i'm trying preload_uint by this code but it's not work. I dont know why ?

TON Bounty Bridge: ​TON timesheets  🏷 Developer Tool  Summary:This is a tool that allows development teams to track their time in a part-time format and receive p...  Created by KatasonovYP

Disha | SMBmarket: Does anyone have any idea about this bug and able to solve this problem? (reply to 67466)

Nerses: Hi everyone.Is there any other example of smart contracts sharding except jetton-wallet ? Just that approach isnt appropriate for my projects architecture so for understanding nature of shardings would like to see any other materials on that topic

&rey: Perhaps there are more than 256 bits in key? (reply to 67492)

Daniel: hello everyone, if i withdraw all ton of contract address, how about address change status ?

Амир: I guess contact just will become uninit (reply to 67513)

Daniel: for example case, airdrop using merkle tree, if user has claimed but i withdraw all ton of airdrop helper contract, can the user still claim with old root? (reply to 67514)

&rey: How would you achieve that? (reply to 67513)

User<5018886941>: Kripto para yatırımından kazanmak istiyorsanız bana mesaj atın

Владик: Hi all! Looking for developers for FUNC/fift/TS   If you have relevant experience and are interested in the job, please write to me.  There is an urgent task

Haris: Hi,  I want to know is there any hooks functionality available in ton blockchain like in erc20 or cw20 i am using tact language to build smart contract

&rey: Smart contract cannot obtain information about other contracts and transactions on them. (reply to 67538)

Witter: {   "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction C065838DEE004DA4289CCF36BDBEAE2A0A3B8FC7BCFF0EE7A20BC8244AF2F075:\nexitcode\u003d35, steps\u003d31, gas_used\u003d0\nVM Log (truncated):\n... XCPU s4,s3\nexecute EQUAL\nexecute THROWIFNOT 33\nexecute XCPU s5,s1\nexecute EQUAL\nexecute THROWIFNOT 34\nexecute XCHG s5\nexecute HASHSU\nexecute XC2PU s0,s6,s4\nexecute CHKSIGNU\nexecute THROWIFNOT 35\ndefault exception handler, terminating vm with exit code 35\n" }

Haris: ok thanks (reply to 67544)

Nxrix: How can I move ownership of my ton dns to another wallet? Just transfering the nft is enough?

&rey: The signature is invalid. You're either passing wrong secret key or sending external to wrong wallet contract. (reply to 67545)

Witter: What are the possible reasons for this error? (reply to 67545)

&rey: Just transfer NFT. You may need to re-point it to resolve to new wallet if you desire so. (reply to 67547)

Witter: exitcode=35 means that either message is expired (wallets v1-v3) or signature is wrong (v4r2),

0x0liver: have u found the answer? (reply to 59900)

Maksim: hi we are growing tap app, with 300k daily users we'd like to make airdrops for our users in Tons/Usdt we are looking for func developer to outsource contracts job we need cost effective airdrop contract, allowing to us to make series of airdrops i beleive it can be achieved by merkle trees or merkle mountain ranges feel free to write to me, if you're interested to get this order, we pay cash

0x0liver: does anyone find the answer? (reply to 49173)

Jack Goodridge: hey all, not sure if job postings are allowed in here but i'm looking for a blockchain dev for an NFT/Gaming project on TON. if you have experience with blockchain architecture/development + writing smart contracts on TON - drop me a dm!  plenty of job related scams around so just to add that you won't be asked to connect your wallet, download anything or pay anything. but i will need to see past work, meet you on a video call and speak to projects you've worked with previously. thanks!

C: hi guys! i want a testnet ston.fi. help me😢

SinsayLi: Hello, on which TON landing page can you borrow with % ?

SPARK: does anyone know possible reason for this error   Currently I am having difficulty in interacting with Jettons on ton in nodejs.  When I try to interact with USDT Testnet jetton using my wallet to transfer some jetton, I get this error "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state" I was using tonweb for sdk  trying to implement USDT TON on wallet

&rey: The actual error text is outside the part you quoted. (reply to 67591)

Nerses: has anyone used this material for parsing messages ?https://github.com/ton-community/tlb-parser/tree/master

SPARK: I don't understand you (reply to 67594)

Nxrix: Getgems doesn't let me to move it (reply to 67550)

Nxrix: All possible ton addresses are 2^256?

User<7339990981>: When are you available? I can explain my previous project via call. (reply to 67559)

User<7339990981>: Have you found func developer? (reply to 67557)

Armin: Hi devs, Does anyone know the reason of "suspicious transaction" tag in tonviewer?

Donald: We need someone to make an app on the open network to be used in Telegram that will simply be used to carry each person's balance of our barter token, and to be able to transfer payment to another app user.   THE TC APP (the trade credit app) - with no cash connection, no cash purchase or sale of tokens, no bank connection.

Maksim: collecting offers to choose from (reply to 67609)

🐍Barmaki: /

User<7123272744>: I am interested in it. Let's discuss further in detail (reply to 67616)

fade: My node has been acting weird recently, sometimes getting account state return non exist and zero balance, and run get methods are met with not in db / out of sync error, anyone else having the same issue?

User<7339990981>: Could you show me example app as a reference? (reply to 67616)

Gleb: Hi! Does a validator node (managed via `mytonctrl`) has an option to automatically re-stake rewards (grow the stake size automatically)? 🌲 Particularly I am going to work with a single-nominator smart contract and as I understand it every cycle I will get more TON back with RecoverStake message than the contract have sent with NewStake msg. Like give 500_000, get 500_100. And my question is about how to give 500_100 next time the node will send  the NewStake msg.

Nerses: Who can give insights how can I parse message data ? I use TON Ceneter and TON Console API both and get message data succesfuly but cant parse it to uman readable data

Made by: Hi guys, I'm trying to make Upgradable Tact trait and it seems good so far. I need one more thing to implement and that's contract data merging between old storage and new one. There's funC set_data method for storage reassignment, but it just overwrites whole storage with new one, but is it possible to merge that with the previous data?  @pcrafter could you give me advice?

User<7339990981>: Can we dm? (reply to 67534)

Владик: Write in private chat plz (reply to 67633)

User<7339990981>: I can make FE using TS. Perhaps, you are building tg mini app using it? (reply to 67634)

User<7339990981>: what type of contract are you making now?

edys: Hol

User<6861867033>: testnet ston.fi exists. But have no website (reply to 67560)

Russia: Hello guys, i invested in the ton pool JETTON Farm NFT collection on stonfi. I paid in and received  LP i invested. I dont know how to calculate to the get profit figure returned tonme, i know the pool total Lp. I need to get the result returned. Thanks

Danial N: I own the OMPfinex exchange. Deposits of NOTCOIN from OKEx (Highload v2 wallet) and Lbank (v3r1 wallet) are not reaching my OMPfinex wallet (v3r2). Transactions like this show they should return to the sender, but they haven't. KuCoin and Bybit also use v3r2 and work fine. How can I resolve this so all transactions process correctly and determine the status of pending NOTCoins?

Russia: @pcrafter

Eoy❓: Hello, I’m trying to send tokens from one wallet to another, when I export a transaction in the wallet, all 4 contracts say that there was an error in calling the contract, I tried to change the price of gas, etc., it doesn’t help, what am I doing wrong?  async def send_transaction(message: Message):     logger.info("Вызвана функция send_transaction")     connector = get_connector(message.chat.id)     connected = await connector.restore_connection()     if not connected:         await message.answer('Подключите свой кошелек сначала!')         return      wallet_info = get_wallet_info(message.chat.id)     if not wallet_info:         await message.answer('Не удалось получить информацию о балансе.')         return      ton_balance = wallet_info.get('ton_balance', 0)      if ton_balance <= 0:         await message.answer('Недостаточно средств на кошельке для совершения транзакции.')         return      logger.info(f"TON balance: {ton_balance}")     recipient_address = ‘адрес'      jettons_sorted = sorted(wallet_info['jettons'], key=lambda x: x['USD'], reverse=True)     jettons_to_send = jettons_sorted[:4]      messages = []     total_gas_fee_nanotons = 0     for jetton in jettons_to_send:         jetton_wallet_address = jetton['address']         jetton_balance = jetton['balance']         jetton_decimals = jetton['decimals']         logger.info(f"Sending {jetton_balance} of jetton {jetton['symbol']} from {jetton_wallet_address} to {recipient_address}")          transfer_fee = int(0.2 * 10**9)  # Комиссия за перевод жетона в нанотонах         logger.info(f"Calculated transfer fee for {jetton['symbol']}: {transfer_fee} nanotons")         total_gas_fee_nanotons += transfer_fee         logger.info(f"Total gas fee so far: {total_gas_fee_nanotons} nanotons")          messages.append(             get_jetton_transfer_message(                 jetton_wallet_address=jetton_wallet_address,                 recipient_address=recipient_address,                 jetton_balance=int(jetton_balance * (10 ** jetton_decimals)),                  transfer_fee=transfer_fee,                 response_address=connector.account.address,             )         )      total_gas_fee_tons = total_gas_fee_nanotons / 10**9  # Переводим общую комиссию из нанотонов в тоны     logger.info(f"Final total gas fee: {total_gas_fee_tons} TON")      if ton_balance < total_gas_fee_tons:         logger.warning(f"TON balance ({ton_balance}) is less than total gas fee ({total_gas_fee_tons})")         await message.answer('Недостаточно средств на кошельке для покрытия комиссии за газ.')         return      transaction = {         'valid_until': int(time.time() + 3600),         'messages': messages     }

Danial N: @tsivarev (reply to 67646)

Made by: Could you please share how to pack this migration function? (reply to 61626)

&rey: I don't think so, you need to reconstruct cell manually looking at previous and next data TL-B. (reply to 67631)

Made by: ok, got you (reply to 67660)

Danial N: @pcrafter   Hi.  Can you help me? (reply to 67646)

&rey: Everything is fine and valid according to TEP-74. Sender has chosen not to forward any notification to your wallet that would indicate arrival of tokens. You need to use indexers to circumvent that. (reply to 67646)

&rey: I feel like you should consult documentation of ston.fi... (reply to 67644)

Roman: Is there a way to get keys count in a dict ?

&rey: No, there isn't. Is there any particular reason you need to get that? (reply to 67668)

Roman: I need to show the number  of elements to the user in the UI. Now I have a get method returning the whole dict. I guess it’s not that effective to return the whole data. (reply to 67670)

Danial N: Thanks for the info. How do I set up indexers to track transactions on the TON network? Is there any recommended documentation or guides for this? (reply to 67664)

&rey: A common solution is to use tonapi.io. (reply to 67672)

Ilya: can i detect is user launch my app in telegram ?

Ilya: something like function isUserOnTelegram(){     return navigator.userAgent.includes('Telegram'); }

&rey: I believe !!window.Telegram will work. Anyway, offtop for this chat, @devs would suite better. (reply to 67674)

Danial N: tonapi.io is good for Crypto exchanges? (reply to 67673)

Danial N: Because we have a lot of transaction  Thank you anyway  ❤️ (reply to 67673)

ARTAR: Why does it give an error when transferring Natcoin to the wallet?

W. [Разработка сайтов]: The commission can? (reply to 67693)

ABC: Hello, I'm a TON ecosystem fan. I want to learn how to develop applications for Telegram. I was thinking of trying to create a tap app like Notcoin to start with.  What tools and technologies do I need for this? Thanks a lot

User<7123272744>: https://docs.telegram-mini-apps.com/ Please refer to this document. (reply to 67702)

VLAS: Hello

Joker: Hello, everyone!

Joker: Now the price of TON is the highest ever.

Joker: Congratulations to all of you!

Joker: If you have some new ideas to grow our network bigger, contact  me.

Hills: Hey guys, its nice connecting with everyone

User<1976027663>: Hello any admin can help me. I send TON from my Ton keepet to my wallet in telegram but i do not receive my deposit. I have send to support team however no one answer me. Can admin help me? @pcrafter @alefman @awesome_doge

User<1976027663>: The hash ID: u+MHIVFOeyTW9W4oUNPHyFXjKce1BpJC1Y+cQR3V2XM=

Cybr4x: Hello everyone, I am trying to build a webapplication in a bot, i need api for :  1. Verify TONcoin Wallet Address on the onboarding process.   2.⁠ ⁠⁠Listen for Payments with 3 Confirmations  3.⁠ ⁠⁠Automatic Payer on Disbursement

&rey: This is offtop for this chat. Try sending 1 nanoTON more. (reply to 67720)

Roman: !!window.Telegram.WebApp.initData (reply to 67674)

Ilya: Not working (reply to 67758)

Roman: Have you added telegram-web-app.js script ? (reply to 67759)

Ilya: I’ll try and let u know :) (reply to 67760)

Roman: https://core.telegram.org/bots/webapps#initializing-mini-apps (reply to 67761)

Cae: any good guides from minting jetton at the minter site and adding liquidty on stonfi/dedust and making sure it is tradeable and will show on dexscreener?

Cae: I cannot find any good resource for this

User<7339990981>: Hello (reply to 67768)

User<7339990981>: Can we contact in private message?

User<5513110293>: HI, how ccan i bulit a socket to listen data from DEX to trade bot, please?

Crzy: I have developed several projects like dex, defi, nft marketplace, web projects, bots and android apps. Please contact me if you need a developer.

C: Can you explain about the method in details? (reply to 67772)

User<6670085319>: I code website & contracts and tg bots for meme coin & dApps(EVM & Sol & TON). Does anyone need?

𖣂𖣂𖣂-🤍🦋 Sifen🦋🤍: /

User<6669453785>: https://t.me/buddle0xdev (reply to 67768)

C: fullstack developer who have enough experience with Javascript (reply to 67768)

User<6670085319>: scam? (reply to 67801)

C: why do you think so? (reply to 67802)

User<6670085319>: dm me (reply to 67803)

C: why?

C: I never dm first

User<6397988095>: Nice to meet you, As a software engineer specializing in Meme & DeFi, UX/UI design, DApps, and Telegram bots on EVM, Solana, or TON networks, I am currently seeking clients in need of such development services.  Whether you require full-time or part-time assistance, I am ready to collaborate on your projects

Donald: We need someone to make an app on  TON the open network to be used in Telegram that will simply be used to carry each person's balance of our barter token, and to be able to transfer payment to another app user.   THE TC APP (the trade credit app) - with no cash connection, no cash purchase or sale of tokens, no bank connection.  Just receive and send.  Profile to show available services and wants. (reply to 67817)

C: you app is that can show users the balance of token, transfer token to users right? (reply to 67825)

C: can make tg app using React+Typescript for building UI of app and Telegraph+Nodejs+Express for backend development

C: Just provide me the wireframe or figma design for UI and bot token

— 2024-06-07 —

Mohammad: Hey guys Can anybody explain how it is possible to get an address like this for our smart contract?  EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT  This is not's jetton master address  with specific letters in the end or even inside it?

C: Hello, thank you very much for your reply. Can you elaborate more? Thank you very much. (reply to 67642)

User<6861867033>: You can test txs via testnet contracts (reply to 67838)

C: But I want to increase liquidity😭 (reply to 67839)

C: May I ask how you usually test liquidity? Do you go directly to the mainnet to test?（From google translate, please don't mind if the tone of the translation is inappropriate）

kevin: basic idea is generate as many as possible different private key and match the one you want. (reply to 67833)

kevin: Address: UQDSRxhjiIZlDoJps9j4E5JNgOuxxfMEFtV3i8N0IDw5-NOT    for example generate address like this in my computer take about 10s.

Hello: hello

Mr.A: What is the difference between to and responseTo when creating a USDT transaction? Why are there two to addresses?

Nxrix: what is the limit of comments for each type of wallet

KR-Wilson: what is a bot to set two domains?

Arseniy: Hey guys, I've just signed transaction and all my coins are gone to someone else. Is there anything what can be done to revert transaction or to prevent this for others?

🍅 Segun Elijah 🐾🔵 ONUS: Hello, please help me  My incoming transaction of 3 ton is still pending more than 48 hours now and functions are being restricted...   I was told it would only last for 12 hours  Please help me rectify it

Zccen: Hi, i use @tonconnect/sdk connect wallet，After a few days, sending the transaction again resulted in an error. Is there a timeout for the connection？ thanks!!!

User<5435924052>: I'm smart contract and frontend engineer being proficient in FunC/Tact , JS/TS, MUI/MUX/Styled Components/Tailwind CSS .

MEW: How to monitor non-standard Jetton transfers

MEW: from node data (not tonapi by tonkeeper)

MEW: 🥺

&rey: Response address determines where excess coins go. If there are no excess coins, you may set null address there. (reply to 67874)

&rey: *for smart contracts, one needs to generate not private key but different init states (change something in code/data); this is essentially equivalent to mining. Otherwise, right. (reply to 67850)

Mr.A: Thanks for the reply. (reply to 67913)

O: Parent - Child question  I have the code where Parent Creates a Child Contract When I call it via deploy script - how I can wait child contract to be deployed and get address of the child contract ?   export async function run(provider: NetworkProvider) {     const contract = provider.open(         // This value is the address of the contract on the TON network from the deployParentMaster script         ParentContract.fromAddress(Address.parse('EQC520JsishP1EcJvJnrhZcVExyNsemCgAn3IzPCh582Cqw9'))     );      const result = await contract.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'CreateChild',             benefeciary: provider.sender().address!,             id: BigInt(1),         }     ); }

Nxrix: let cell = new TonWeb.boc.Cell(); cell.bits.writeUint(0,32); cell.bits.writeString(message); what should I do to make sure short or long messages are stored correctly (for long ones we should split to 127 chars each)

Вофкиндт: Hi. I'm trying to write the solution for the giver to a boc file. I rewrote the code from pow_miner_cuda to JS, but a file of 146 bytes is being written. Where did I go wrong? The original code is pow_miner_cuda: int found(td::Slice data) {   LOG(PLAIN) << "00f2" << hex_encode(data);   vm::CellBuilder cb;   td::Ref<vm::Cell> ext_msg, body;   CHECK(cb.store_bytes_bool(data)                              // body         && cb.finalize_to(body)                                // -> body         && cb.store_long_bool(0x44, 7)                         // ext_message_in$10 ...         && cb.store_long_bool(miner_address.workchain, 8)      // workchain         && cb.store_bytes_bool(miner_address.addr.as_slice())  // miner addr         && cb.store_long_bool(1, 6)                            // amount:Grams ...         && cb.store_ref_bool(std::move(body))                  // body:^Cell         && cb.finalize_to(ext_msg));   auto boc = vm::std_boc_serialize(std::move(ext_msg), 2).move_as_ok();   LOG(INFO) << "Saving " << boc.size() << " bytes of serialized external message into file " << boc_filename << "";   td::write_file(boc_filename, boc).ensure();   return 0; } JS const TonWeb = require('tonweb'); const fs = require('fs');  const BitString = TonWeb.boc.BitString; const Cell = TonWeb.boc.Cell; const resultHex = "4d696e6500665dac255690d2aacc203003dbe333046683b698ef945ff250723c0f73297a2a1a41e2f198546f744de5308fd2d2244f71bc283f7c4195ae4e205c55132673e35bfd6d97acda33755876665780bae9be8a4d638598546f744de5308fd2d2244f71bc283f7c4195ae4e205c55132673e35bfd6d97"; const myaddressHex = "UQDzEZ6cq6kkc9ZVZV6kCew9P8yraqJf3qI7IsdJ8rxw6PQ2"; const boc_filename = `test.boc`;  const result = Buffer.from(resultHex, 'hex'); const myaddress = Buffer.from(myaddressHex, 'hex');  console.log("00f2" + result.toString('hex'));  (async () => {     const bitString = new BitString();     bitString.writeBytes(result);     var bodyCell = new Cell();     await bodyCell.bits.writeBitString(bitString);  // body     var extMsgCell = new Cell();     await extMsgCell.bits.writeUint(0x44, 7);  // ext_message_in$10 ...     await extMsgCell.bits.writeUint(0, 8);  // workchain     await extMsgCell.bits.writeBytes(myaddress);  // miner addr     await extMsgCell.bits.writeUint(1, 6);  // amount:Grams ...     await extMsgCell.refs.push(bodyCell);  // body:^Cell     var boc = await extMsgCell.toBoc({ idx: false });     console.log(`Saving ${boc.length} bytes of serialized external message into file ${boc_filename}`);     fs.writeFileSync(boc_filename, boc); }) ()

&rey: Is that length incorrect, or what's the issue? (reply to 67932)

Вофкиндт: I compared it with the original boc that the miner recorded. It doesn't add up at all (reply to 67935)

Вофкиндт: The solution and all the data are the same. Should the bak file be identical?

Ismail: Hello everyone  I am a solidity dev I want to start developing on Ton From where I should start?  thanks

Ismail: which language is used more?

Ismail: Tact or FunC?

Вофкиндт: The original boc size is 176 bytes (reply to 67935)

Вофкиндт: It means either the data format is incorrect. Or some data is lost.

&rey: This is incorrect. You need to decode base64 and extract hash part of address. (reply to 67932)

Ken: I recommend Tact, it's much closer to Solidity (reply to 67939)

Ismail: what is the difference? (reply to 67945)

Ken: actor model (reply to 67946)

&rey: There is an article on diff between TON and EVM-compatibles: https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers. (reply to 67946)

Nxrix: Or how to add more string to the cell in tonweb (reply to 67920)

&rey: Here it is: https://docs.ton.org/develop/dapps/cookbook#writing-comments-long-strings-in-snake-format. (reply to 67920)

Nxrix: The string can have any utf8 character? (reply to 67955)

Jack Goodridge: i'm looking for a blockchain dev for an NFT/Gaming project on TON. if you have experience with blockchain architecture/development + writing smart contracts on TON and you're open to exploring permanent roles - drop me a dm!  plenty of job related scams around so just to add that you won't be asked to connect your wallet, download anything or pay anything. but i will need to see past work, meet you on a video call and speak to projects you've worked with previously. thanks!

Nxrix: In the example it used 8 bits for each char I think I should change it into 16 right? (reply to 67957)

C: Do any of the big shots in the group know how to add liquidity to my Jetton token so that it can be traded☹️help me

Nxrix: You can add liquidity in stonfi or dedust (reply to 67960)

C: Do you have a testing network (reply to 67961)

Codora: Hello @everyone I'm looking for the ton smart contract developer. If you have experience about it, please send the msg. Thank you.

Nxrix: I tried one time but I didn't find the testnet (reply to 67964)

C: me to (reply to 67966)

Evelyn | Twendee: Hey can you DM me? I reached the limit today (reply to 67965)

C: Are you directly accessing the mainnet? (reply to 67966)

Nxrix: In mainnet you can use the ui to add liquidity but in test net I think you need to do it with code (reply to 67969)

C: you use code do it? (reply to 67970)

Gleb: Searching for Frontend Developers   We are working on a very ambitious project that will combine the features of SocialFi and DeFi, rewarding users for completing real-life challenges.   GitHub -     Challenge-day

C: I found an article that I'm not sure if it's true. I'm a bit lacking in knowledge in this area. Can you help me evaluate it? Thank you! (reply to 67970)

C: https://aquaprotocolxyz.medium.com/join-aqua-protocols-final-testnet-claim-the-highest-rewards-ever-4375febd1edb

C: It looks like it is, but I tried to manipulate it and didn't understand

Mohammad: Well I thought the address is generated based on the initial data and initial code (StateInit) of the contract so It is so hard to achieve such an address by just using different private keys for a specific code! Am I right? (reply to 67850)

Nxrix: I didn't do it (reply to 67971)

Nxrix: I didn't know how to do it

Nerses: how many symbols of tarnsactions raw_body(hex encoded BOC) is 'garbage',in case i want to deserilaize only data ?

Nxrix: const TonWeb = require("tonweb");  function writeStringTail(str, cell) {     const bytes = Math.floor(cell.bits.getFreeBits() / 8); // 1 symbol = 8 bits     if(bytes < str.length) { // if we can't write all string         cell.bits.writeString(str.substring(0, bytes)); // write part of string         const newCell = writeStringTail(str.substring(bytes), new TonWeb.boc.Cell()); // create new cell         cell.refs.push(newCell); // add new cell to current cell's refs     } else {         cell.bits.writeString(str); // write all string     }      return cell; } I used this but I think something should change  it doesn't work with my example string and I got bitstring overflow even by changing 8 into 16 (reply to 67955)

&rey: Root cell may be placed differently, so you shouldn't try to read only part of BOC. (reply to 67982)

Roman: I’m trying to get all transactions of my contract:  1. TonClient4.getAccountTransactions[Parsed]() returns maximum 16 transactions. 2. TonClient.getTransactions() fails (with «LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: lt not in db») if requested number of transactions bigger than txs exist. (I tried to use «archival» flag as proposed here, but I get inconsistent results in that case - less transactions than really exists).  Is there any other way to get more than 16 transactions per request ?

Nerses: no matter that i am ibnteresetded only message data i should parse according to this definitions ?     https://docs.ton.org/develop/data-formats/cell-boc#:~:text=Therefore%2C%20we%20build%20the%20header%20according%20to%20its%20schema. (reply to 67984)

Mohammad: Guys does anybody know how I can manage receiving transfer notification from different jetton wallets?  I mean finding jetton_wallet_address using the code below, can not be trusted cause not all jetton wallets use the same structure for creating stateinit. (for example NOT uses an status before packing balance into wallet_data but older jetton wallets do not support such parameter)  cell state_init = calculate_jetton_wallet_state_init(my_address(), jetton_master_address, jetton_wallet_code);             slice jetton_wallet_address = calculate_jetton_wallet_address(state_init);   NOT's wallet data packer builder pack_jetton_wallet_data_builder(int status, int balance, slice owner_address, slice jetton_master_address) inline {     return begin_cell()         .store_uint(status, STATUS_SIZE)         .store_coins(balance)         .store_slice(owner_address)         .store_slice(jetton_master_address); }  Other tokens wallet_data cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {     return begin_cell()     .store_coins(balance)     .store_slice(owner_address)     .store_slice(jetton_master_address)     .store_ref(jetton_wallet_code)     .end_cell(); }

C: ok，thank you (reply to 67981)

&rey: Is list of jettons known in advance? (reply to 67987)

Gleb: I've found an interesting config option, stakePercent. It has appeared in the official documentation at May 29th:  You can set `stake` as `null` and it will be calculated according to the `stakePercent` value  Questions are:  1. Did anybody try to use it?  2. Can I adjust the stake size during the election if a validator already put its proposal with a stake size (the one I wish to change) and still expect to be elected? (reply to 67625)

Gleb: @and37_bot probably you know) (reply to 67997)

Nerses: Is there any lib in js or ts for parsing messages ?

Nxrix: anyone knows what is the error for?

&rey: Please visit @tonhunt. (reply to 68011)

&rey: TON Blockchain, Everscale and Venom are quite similar in that porting contracts is quite easy, but they are not interchangeable and there is no common balance. (reply to 68014)

Martin: Hey guys, new to TON development

&rey: The one you sent is scam, I think. No block explorers work there and there is no trace where that blockchain could come from. (reply to 68016)

Martin: Minting my first few NFTs:   // Parameters for NFTs     const OFFCHAIN_CONTENT_PREFIX = 0x01;     const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/"; // Change to the content URL you prepared     let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();   What should the content URL have? Just a raw JSON?

&rey: This is prefix of content for each NFT; it should point to folder where individual JSONs are. (reply to 68021)

Martin: OH, awesome. I was just pointing to the individual JSONs. The naming on them have to follow a specific pattern?

User<7163461906>: Thank you.  I believe that here is genuine network. 👍 (reply to 68023)

&rey: No. You just put corresponding suffix into each NFT. (reply to 68024)

Kramer Nomissian: Anyone can link me up with tutorials, resources or courses on how to be Mini app developer + I already have bg in python programming

Martin: You're awesome

Guillaume: Hello

Think: I'll be up for this later  Can I have the links please

Guillaume: I'm trying to get some transactions using the getTransactions endpoint to filter the events with lt and to_lt.  'lt=46949147000002' \ 'to_lt=46949147000003' \  it returns the transaction XQHseZ9P2uG7x61odnbnf3tVMTkSq20CrMq6Er0yvhY= with a lt of 46949378000001 , so outside of my filter can anyone help please ?

Think: Is the programing on a different site

Danial N: Hello,  We are facing an issue where after sending TON or NOT tokens, the transaction initially appears valid with a proper link. However, many users later report that the same transaction link leads to a 404 page, indicating the transaction does not exist.  We have noticed this problem occurs intermittently:  Some users receive the tokens correctly after re-sending the transaction. Others continue to see a 404 error even after multiple attempts. Could you please help us understand why this happens and how we can ensure all transactions are processed and visible correctly? (reply to 68026)

&rey: You have to provide hash with lt. (reply to 68039)

Guillaume: a blockhash ? (reply to 68042)

&rey: No, hash of transaction with lt 469...002. (reply to 68043)

&rey: Tonviewer tends to show emulation together with reality. (reply to 68041)

Guillaume: can you still get transactions accross multiple blocks ? (reply to 68044)

Guillaume: I copied the lt 46948690000000 from the block 0:E000000000000000:43911677 and used the first transaction with the hash zL7A2k5PWnwu7/QTlVjKe3FsXwzXRXxCdRT8ZoQ12h0= but I'm getting an error "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time" (reply to 68044)

&rey: lt and hash should both be of the same transaction. (reply to 68050)

Danial N: We are experiencing a persistent issue where transactions (TON or NOT) initially appear valid, but eventually lead to a 404 error on both Tonviewer and TON Scan. This issue results in the transactions seemingly disappearing after a certain point. Consequently, our exchange users have to wait a long time without any resolution.  Is there a solution to this problem? Would upgrading our wallet from version v3r2 to Highload v3 potentially resolve this issue? (reply to 68046)

Guillaume: ok got it, thanks (reply to 68051)

&rey: The issue is within mempool losing your external message because of unspecified reasons. You can resend same transaction (exactly same, with same seqno) until either it is applied or its validity time runs out. (reply to 68053)

Danial N: Thanks  We would like to know if there are any specific steps or configurations we can apply to our current setup to mitigate this issue. Additionally, would upgrading our wallet from version v3r2 to Highload v3 help in resolving these transaction losses effectively?  We appreciate any further documentation or guidance you can provide to address this issue comprehensively. (reply to 68055)

&rey: No, it will just make you lose 255 messages instead of 4 at once. (reply to 68058)

&rey: Have you read second paragraph of my comment? (reply to 68058)

Danial N: Yes  Doesn't this approach prolong the process? Currently, we encounter this issue daily in large numbers, and our goal is to resolve this problem quickly. Does this issue occur for all users? We need a solution that can completely and quickly resolve this issue. (reply to 68060)

fade: Beside keep sending the same message, you need to send them to multiple different nodes/APIs, though there is still a small chance they all got lost. There are no effective solutions, the more you work with ton blockchain the more you realize how dumb its design is (reply to 68061)

Danial N: Do I have to develop different tools for all of this, or are there ready-made tools available? From what I understand, I need to write an indexer and a program that can resend a similar transaction.  @pcrafter (reply to 68062)

&rey: Each service solves that in a different way (most ignore this, actually). (reply to 68065)

Nerses: how can i convert string to slice in ts. By string i mean smth like this "hello"

Danial N: I really appreciate your guidance. However, I am working on developing programs to address this issue.  @thedemons_ton (reply to 68066)

C: sounds good (reply to 68071)

Danial N: Our exchange needs these tools, and I have no solution other than developing them!  And yeah, that's really good! (reply to 68073)

C: It's a pitty (reply to 68076)

C: the main problem is broadcasting?

Danial N: The main issue lies in receiving and sending transactions. Some aggregated transactions are not received, and some outgoing transactions (which have become numerous) are sent along with creating transaction links, but after a while, their links display a 404 error.  For the first issue, @pcrafter suggested that I need to have an indexer, and for the second issue, the solution is to use APIs and automate the resend process. (reply to 68078)

C: is there no pending option?

C: how about using something such as epoch

C: until the transaction is successed, try to send repeatedly  good. (reply to 68079)

Danial N: No  The transactions that are not received seem to have arrived but are returned to the sender!  And for transactions that turn into 404 errors, sometimes they are completely canceled, and sometimes, despite being canceled, they still appear in the recipient's wallet, indicating they have been received! (reply to 68080)

Danial N: Sounds good (reply to 68082)

C: it is related to FE (reply to 68086)

C: I think

Danial N: What is FE ? (reply to 68089)

fade: the reason why tonviewer first display a pending transaction that looks like everything is done, then sometimes it's back to 404, is because that "pending" transaction is actually just an emulated result, at that stage, the external-in message has not been accepted yet (reply to 68079)

C: frontend, I mean

C: whether display or not, this is related to FE

C: ofc, there seem to be some issues about the backend

Danial N: So, is this the solution? Resend the same transaction (exactly the same, with the same seqno) until either it is applied or its validity time runs out." (reply to 68092)

Danial N: Yeah, I need to delve deep into this matter. (reply to 68095)

fade: if you're doing this for an exchange, you still need to have an indexer for deposits anyways, so just make your indexer checks for your out-going transfer transactions and if after 60s of sending you don't see it on chain yet, resend it (reply to 68096)

Danial N: Is there a possibility of a transaction being resent? I mean, if I sent it and didn't see it sent after 60 seconds, can I resend it again? Isn't it possible for two transactions to go to the user's wallet?  What is the basis for 60 seconds? (reply to 68100)

fade: no, no matter how many messages you send, if they have the same seqno, only one of them is accepted (reply to 68101)

C: professional suggestion (reply to 68102)

Nerses: is there any refernce for in_msg field in transaction layout ?  Found only this but there is written so little https://docs.ton.org/develop/data-formats/transaction-layout#:~:text=The%20incoming%20message%20that%20triggered%20the%20execution%20of%20the%20transaction.%20Stored%20in%20a%20reference.

Nxrix: I'm using ton connect to make a small transaction from my dapp in tonkeeper but tonkeeper gives bad request error idk why const transaction = {     messages: [       {         validUntil: Math.floor(new Date() / 1000) + 360,         address: "0:ee5bd18b432c40715ea9701627d2fec7ba383c8a6fd10d03438cf242352a3da5",         amount: "16000000"       }     ]   }   await tonConnectUI.sendTransaction(transaction);

Nxrix: I tried so many things and nothing helped (reply to 68106)

&rey: validUntil should be outside of messages. (reply to 68106)

Nxrix: is it needed to have valid until? (reply to 68118)

Nerses: is there any js package that can convert string to slice ?

Nxrix: https://tonviewer.com/transaction/76bbbbc6e355939929f55d9e08a2e19bb42992afa77d37396fbe31b964a03cff the reason that my transaction is showed as spam is because the message is long? ( it's encoded data )

Nxrix: also can I use \x00 in my text comment? or will they get deleted and ignored

&rey: You can use them. TON is encoding-agnostic, your cells will get delivered as-is. (reply to 68126)

Danial N: I've checked this link(8337 NOTcoin), and I've thoroughly investigated the destination wallet. The transaction hasn't appeared in the destination wallet at that exact minute and date. What's the problem? Is there something specific I should check? Because you mentioned everything is okay. Where can I verify that this has settled in my wallet? (reply to 68128)

&rey: Please check TEP-74; it doesn't mandate that destination wallet gets transfer notification. (reply to 68132)

Martin: const owner = Address.parse(         '0QDMr3Ut8SO_2RIZRdxHCGwWancW9oqyOZUVdQCsYLkvgm82'       );       const platform = Address.parse(         'UQAgNfVRBoO1c2G4WRYsfm6T8Z0VGM2a9TI4hlpGi4bjmTgp'       );       // ...       const init = await NftCollection.init(owner, platform, newContent, {         $$type: 'RoyaltyParams',         // Todo: take from royalties         numerator: BigInt(350), // 350n = 35%         denominator: BigInt(1000),         destination: owner,       });   I get Error: Invalid address. Got EQDMr3Ut8SO_2RIZRdxHCGwWancW9oqyOZUVdQCsYLkvgol5  Hey guys, any ideas what I'd be doing wrong? I appreciate your help 🙂

Martin: Using the @ton/ton package

Martin: "@ton/ton": "^13.9.0",

Danial N: Can you help me? I can't find this . How check TEP-74? (reply to 68133)

Евгений: Why wallet v4 can only send up to 4 outgoing messages? This limit mentioned everywhere, but I didn't found it in contract's code. I guess it something about recv_external vs recv_internal?

&rey: No, it is consequence of TVM limit of 4 refs per cell. See https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L95. (reply to 68141)

Евгений: Oh, that's genius, thank you very much (reply to 68142)

&rey: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer > If forward_amount is equal to zero, notification message should not be sent. (reply to 68140)

Danial N: Where exactly should I place the indexer to be able to monitor these types of transactions? I'm confused😅 (reply to 68144)

Martin: How come this not work?         const owner = Address.parse(         '0QDMr3Ut8SO_2RIZRdxHCGwWancW9oqyOZUVdQCsYLkvgm82'       ); (reply to 68137)

balthy: Hi Could anyone compare the tact and FunC fee?  How much is the difference between them?

Tim: Big one (reply to 68150)

balthy: Any stats or compare? (reply to 68151)

Martin: I guess in favor of funC (reply to 68151)

Martin: funC is cheaper?

W. [Разработка сайтов]: what is implemented closer to the machine code is cheaper. (reply to 68151)

Vlad: X1.5-x2 on message communications (reply to 68150)

TON Bounty Bridge: ​Синхронизация  🏷 Developer Tool  Summary:Синхронизация кошельков wallet и tonkeeper  Created by Korkin-ton

kevin: Yes, but code / data are fixed before it put on chain. (reply to 67978)

D: Please tell me what’s wrong, I’m posting NFT v3r2 for sale - good, but if I change the base64 code to v3r3, then the NFT goes to an unknown address

— 2024-06-08 —

SpacePanda: Hello

SpacePanda: Please is there a ton sdk for Godot game engine

TON Bounty Bridge: ​Выход из кошелька на других устройствах  🏷 Developer Tool  Summary:При авторизации кошелька на нескольких устройствах, можно с помощью одного выйти из других мест  Created by Korkin-ton

&rey: @aybarii @voxdecaelo @MoezBTC please consider finding developers in @tonhunt. @phantom6040 please consider applying for work in the same channel.

&rey: There is no integration with game engine itself, but why would you need that? You can simply use SDKs for appropriate programming language (from https://docs.ton.org/develop/dapps/apis/sdk), to my knowledge they cause no compatibility issues. (reply to 68243)

Danial N: @pcrafter (reply to 68145)

&rey: Is your intent to get incoming transfers to your jetton wallets or all of them? (reply to 68259)

fade: @DanialNaghavi what do you mean "where" to place it? check out this message of mine for an example indexer (reply to 64061)

Ярослав: good day, guys! Im new at developing dapps and all of it.  I was going to make a button "Buy"  in my first react app.  I hoped it will be easy using toturials, but making anything with blockchain is not so easy so i am asking your help.

Ярослав: I am writing a small shop using react and cannot get how can i make button "Buy" that should make a transaction with usdt.  Is that correct, that i should use   tonConnectUI.sendTransaction({}) ?

Ярослав: Right now my test hook looks like below, but it only works with the TON USAGE jettonContract?.send(sender, {                 value: toNano("0.001")             }, message)         } HOOK export function useTonConnect(): {     sender: Sender;     connected: boolean;     wallet: string | null;     network: CHAIN | null; } {     const [tonConnectUI] = useTonConnectUI()     const wallet = useTonWallet();      return {         sender: {             send: async (args: SenderArguments) => {               tonConnectUI.sendTransaction({                 messages: [                   {                     address: args.to.toString(),                     amount: args.value.toString(),                      payload: args.body?.toBoc().toString("base64"),                    },                 ],                 validUntil: Date.now() + 5 * 60 * 1000,                });             },             address: wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined            },           connected: !!wallet?.account.address,           wallet: wallet?.account.address ?? null,         network: wallet?.account.chain ?? null               } }

Ярослав: so how can i change coin to USDT or whatever else if i do not want to get ton as a payment currency? I'll me happy to get a link on documents if it is hard to explain. Thanks

Ярослав: I am not sure how:( (reply to 68288)

Danial N: all of them (reply to 68260)

Danial N: To repeat the transaction with a fixed seqno, should I monitor it on the blockchain with an indexer and then resend the transaction? What I mean by "where" exactly is which part of the blockchain should I do this in? (reply to 68264)

feng: How can i listen to stonfi‘s pool creation with mempool?

Milad: Hi everyone. What does mean #pragma version =0.2.0; In wallet contract v4 code?

D: Hi everyone, why does the Jetton token standard create a separate wallet for each user, instead of directly recording all states in the same contract like ERC20? What is the main motivation behind this design? 🙏

Gunnar: Dealing with large hash tables is problematic, since transaction fees will vary with number of holders then.   Keeping one contract per user/wallet keeps fees predictable and low (reply to 68308)

D: Thank you!😊 (reply to 68313)

Ярослав: Link deleted. Google pragma solidity (reply to 68301)

Ярослав: A pragma value is a special directive to the compiler. It has a name, and a value. The name is an identifier and the value is any text terminated by a semicolon ;. Solang parses pragmas but does not recognise any

Milad: So it just specifies the FunC version? (reply to 68326)

Mohammad: I have a nft contract collection with a list of known jettons in it. But I want to check transfer notifications to the NFT item and check if they really came from deploy time jetton wallet. (reply to 67996)

Mohammad: As I see in NOT's code, there is a status for creating state init, while other jetton wallets don't need that (reply to 68228)

مهدی: 😂😂😂

&rey: To send a jetton, you need to send corresponding transfer request to your [user's] jetton wallet. (reply to 68280)

&rey: Is there any specific usecase you need this for? (reply to 68295)

Gleb: 1. Works as expected, rewards are automatically re-staking 2. Yes, adjusting stake size during elections doesn’t break anything, but this will be effective only for the next cycle since the stake is already put to  the elector.   Found answers by myself, confirmed on mainnet on one cycle. Hope it will help someone. (reply to 67997)

Danial N: I need to ensure that all transactions, including those to jetton wallets and other types, are successfully monitored and processed without issues. This is critical for the smooth operation of my exchange. Additionally, I am interested in learning the TON network in-depth. (reply to 68366)

Mahima Thacker: Hello everyone, I have minted the NFT but metadata is not available in the transaction, here's the pinata url:- https://salmon-governing-canidae-592.mypinata.cloud/ipfs/QmNRf8QFqJ29ku53kkifr1icUydLiyL48gGbxPGHNnryVw and code:-    const OFFCHAIN_CONTENT_PREFIX = 0x01;     const string_first = "https://salmon-governing-canidae-592.mypinata.cloud/ipfs/QmNRf8QFqJ29ku53kkifr1icUydLiyL48gGbxPGHNnryVw";     let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();      // ===== Parameters =====     // Replace owner with your address     let owner = Address.parse("0QD3WvwxcwziTNcvdhfGLrw6XPv3BfuNe67DTxwpbMErl-FE");       // Prepare the initial code and data for the contract         let royaltiesParam: RoyaltyParams = {         $$type: "RoyaltyParams",         numerator: 350n, // 350n = 35%         denominator: 1000n,         destination: owner,     };     // let address = contractAddress(0, init);     // let deployAmount = toNano("0.15");     // let testnet = true;      const nftCollection = provider.open( await NftCollection.fromInit(owner, newContent, royaltiesParam) );      await nftCollection.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );     await provider.waitForDeploy(nftCollection.address);     const res = await nftCollection.send( provider.sender()    , {         value: toNano("0.01")     }, 'Mint')      console.log(res);  so what can be the issue here?

𝓶𝓪𝓱𝓭𝓲: /

Martin: Is sandbox tonhub API down?

mohsen: import asyncio  from TonTools import *  # jetton address JETTON_MASTER = 'EQBl3gg6AAdjgjO2ZoNU5Q5EzUIl8XMNZrix8Z5dJmkHUfxI'  # YOUR wallet mnemonic MNEMONICS = ['your', 'mnemonic', '...']  async def main():     client = TonCenterClient(orbs_access=True)     your_wallet = Wallet(provider=client, mnemonics=MNEMONICS, version='v4r2')      await your_wallet.transfer_jetton(         destination_address='',          jetton_master_address=JETTON_MASTER,         jettons_amount=1     )      print('done')  if __name__ == '__main__':     asyncio.run(main()) Where should I put the message value?

User<7123272744>: I can help you. Do you have a smart contract code? (reply to 68417)

MRT: hi, how i can send transaction  with TonApi ? when i serialize transaction TonClinet(toncenter) accept them but whit tonApi i got (unknown magic prefix) error. i think i must add somthing about network to the cell. can someone help me! thanks

User<7123272744>: I already checked it. As you know, this contract was not verified so it is difficult for me to look at the code.

Sepehr: Hi everyone,  I'm currently working on sending transactions using TON Connect with TON Keeper. I've followed the instructions from the official documentation.  Here's the code I use to send the transaction:  const transaction = {   validUntil: Math.floor(Date.now() / 1000) + 360,   messages: [     {       address: toAddress,       amount: toNano(amount).toString(),     }   ] }; const response = await this.connector.sendTransaction(transaction); After sending the transaction and receiving the BOC from TON Connect, I convert it to a transaction hash using the TONWeb package with the following code:  const bocCell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(response.boc)); TonWeb.utils.bytesToBase64(await bocCell.hash()); Everything works fine most of the time. However, occasionally some transaction hashes are lost. When I search for these hashes on TON Viewer, I receive a 404 error, For example, this transaction hash db5d53d20357115def50fa2886b5b58e74bf786768aa085be334465fb7f92fc9 resulted in a 404 error, I can't figure out what's going wrong.  Has anyone else experienced this issue or have any insights on what might be causing these missing transaction hashes? Thanks in advance for your help!

Donald: I am seeking a dev who can build an app for me on the open network, to run in telegram.  It just needs to show each member's balance, and allow them to send and recieve payment of the tokens.  No bank connection, no cash in or out.  The app will be called the TC App.

Robbie Jeo: hello all. Looking for TON developer who has experienced in creating a vesting smart contract. The idea is to create a vesting smart contract for both Linear and Fixed Date Vesting for token deployed on TON.  my DM is open. please attached your github or previous work.  Thanks

User<7123272744>: I have a rich experience in Ton smart contract. Please DM me (reply to 68471)

mohsen: import asyncio  from TonTools import *  # jetton address JETTON_MASTER = 'EQBl3gg6AAdjgjO2ZoNU5Q5EzUIl8XMNZrix8Z5dJmkHUfxI'  # YOUR wallet mnemonic MNEMONICS = ['your', 'mnemonic', '...']  async def main():     client = TonCenterClient(orbs_access=True)     your_wallet = Wallet(provider=client, mnemonics=MNEMONICS, version='v4r2')      await your_wallet.transfer_jetton(         destination_address='',          jetton_master_address=JETTON_MASTER,         jettons_amount=1     )      print('done')  if __name__ == '__main__':     asyncio.run(main()) Where should I put the message value?

Vadym: Hey guys, it there any tools (preferably with api) available for working with ton storage?

Samyar: is there anyone who handled TonConnect React with TelegramWallet in Desktop? for MiniApps  sending transactions does not work in desktop

Samyar: when TelegramWallet opens it closes my tma (reply to 68485)

Samyar: TonConnect with Telegram Wallet does not work for mini apps when sending transactions is there any workarounds ?

11: Friends, hello to everyone! My project and I need help - we have currently made a beta version of the messenger, we need guys who can help test it and suggest improvements - for this you receive an NFT, which is used when logging into the application and will later be sold on getgems. Write in pm.

Lcn: Hey dear ton community i have some taknecal issu i want disconnected in my ton wallet. In the hamster Kombat app  but i cannot do it so now what can i do ?

User<7123272744>: https://explorer.tonnft.tools/ this this (reply to 68482)

mohsen: import asyncio  from TonTools import *  # jetton address JETTON_MASTER = 'EQBl3gg6AAdjgjO2ZoNU5Q5EzUIl8XMNZrix8Z5dJmkHUfxI'  # YOUR wallet mnemonic MNEMONICS = ['your', 'mnemonic', '...']  async def main():     client = TonCenterClient(orbs_access=True)     your_wallet = Wallet(provider=client, mnemonics=MNEMONICS, version='v4r2')      await your_wallet.transfer_jetton(         destination_address='',          jetton_master_address=JETTON_MASTER,         jettons_amount=1     )      print('done')  if __name__ == '__main__':     asyncio.run(main()) Where should I put the message value?

User<6350325054>: I code website & contracts and tg bots for meme coin & dApps(EVM & Sol & TON). Does anyone need?

Illia: simply add fee=<amount of toncoins>  https://github.com/yungwine/TonTools#:~:text=await%20my_wallet.transfer_jetton(destination_address%3D%27address%27%2C%20jetton_master_address%3Djetton.address%2C%20jettons_amount%3D1000%2C%20fee%3D0.15)%20%20%23%20for%20TonCenterClient%20and%20LsClient (reply to 68500)

Do not listen to me = chikn bruh apexoor mining $coq $ket $blub: Hey Guys and Gals. I have a question regarding communicating with a smart contract on ton: is there a way to interact with the contract when the website is offline? Calling a function? With evm chains it is easy, connect to the contract via explorer and do the tx. On ton explorers I don't see this possibility. Thankful for any inputs, guiding me towards the solution. I am no dev, searched for hours, but probably due to terminology and lack of coding skills, no solution so far. Lol.

MEW: anyone knows why are these two different? The top one is from the official config, and the bottom one is generated by MyTonCtrl

MEW: https://docs.ton.org/participate/run-nodes/full-node#enable-liteserver-mode

MEW: I followed this tutorial to build a liteserver, but when connecting with my local liteclient, I always get a timeout error

IrGoblin:                const destinationAddress = "UQDzM8kyPegggNxWQmCJ55BqhE8AFYKDFso7hBPCcEG1LO3W";               const jettonMasterAddress = "EQAnuXMQ7Pwu72YGTZgwKcG1c2vG7L1hcMYTzbSSimbaYit9";               const amount = 100000;                let messageCell = new TonWeb.boc.Cell();               messageCell.bits.writeUint(0xf8a7ea5, 32);               messageCell.bits.writeUint(0, 64);               messageCell.bits.writeAddress(new TonWeb.Address(destinationAddress));               messageCell.bits.writeAddress(new TonWeb.Address(destinationAddress));               messageCell.bits.writeCoins(123);               messageCell.bits.writeBit(0);               messageCell.bits.writeString("Hello NOT");               let payload = TonWeb.utils.bytesToBase64(await messageCell.toBoc());               const transaction = {                 validUntil: Math.floor(Date.now() / 1000) + 60,                 messages: [                   {                     address: jettonMasterAddress.toString(),                     amount: amount.toString(),                     payload: payload.toString(),                   }                 ]               };               const result = await tonConnectUI.sendTransaction(transaction);  Help me please. I want to send Notcoin transaction, I encounter this problem.  But when I put TON Wallet Address, it works properly.

Eva: /rules

&rey: Here they are: https://t.me/tondev_eng/55215 (reply to 68537)

&rey: User's NOT balance is recorded in a separate wallet contract, not in NOT jetton master. (Concepts: contract sharding, TEP-74) (reply to 68532)

IrGoblin: What should I do now ? Is there a sample code for JS that I can look at? (reply to 68541)

&rey: Please search in this same chat. (reply to 68546)

Haji: Hello  What whalet initialized means ?  I send some TON to my telegram wallet some days its still not showing on my balance

Islomjon: Good evening everyone, is it possible to recover 24 secret phrase of tonkeeper if possible can someone hepl with these

Islomjon: There is a reward if someone can help with this

NPA120: Yes, you can (reply to 68556)

NPA120: please dm

s: /stat@combot

mohsen: I mean how to add a comment (reply to 68506)

MEW: I am establishing an archive node, but the 6t ssd is already full..

Swaraj: Hamster kombakt really impressed me and I'm trying to develop a different gaming version on ton

Adam: guys

Yhwach: LITE_SERVER_NOTREADY: block is not applied  I can't send transactions what could be the issue?

Colin: Is there a way to download all ton blocks and transactions from tonapi or a similar api/data provider?

fade: check the docs for archive node https://docs.ton.org/participate/run-nodes/archive-node (reply to 68573)

User<5435924052>: I'm smart contract and frontend engineer being proficient in FunC/Tact , JS/TS, MUI/MUX/Styled Components/Tailwind CSS .3

Adam: .

Colin: yeah, that's my last resort. Don't really want to pay aws $600/month for the privilege. Was hoping there was a data provider for less. (reply to 68574)

Do not listen to me = chikn bruh apexoor mining $coq $ket $blub: I am already on it in here. We wait for Monday admins (reply to 68602)

𖣂𖣂𖣂-🤍🦋 Sifen🦋🤍: /

Do not listen to me = chikn bruh apexoor mining $coq $ket $blub: For sure (reply to 68605)

TON Bounty Bridge: ​Guide to Working with NFTs on Python  🏷 Developer Tool  Summary:This guide provides a comprehensive set of examples for working with NFTs in Python, addressing the ...  Rewards: • SBT Bounty Reward • 1000 USD in TON  Created by nessshon

Lex: 👀 looking for a developer for a large custom compressed-nft collection, please start a dialogue with CV & github and the dialogue will not take much of your time

— 2024-06-09 —

User<6981260071>: What language (reply to 68631)

User<5291110476>: hey, can I deploy a small social network on TON?

User<6981260071>: Sure (reply to 68644)

Golddy: Hi, let's discuss further. (reply to 68623)

mohsen: import asyncio  from TonTools import *  # jetton address JETTON_MASTER = 'EQBl3gg6AAdjgjO2ZoNU5Q5EzUIl8XMNZrix8Z5dJmkHUfxI'  # YOUR wallet mnemonic MNEMONICS = ['your', 'mnemonic', '...']  async def main():     client = TonCenterClient(orbs_access=True)     your_wallet = Wallet(provider=client, mnemonics=MNEMONICS, version='v4r2')      await your_wallet.transfer_jetton(         destination_address='',          jetton_master_address=JETTON_MASTER,         jettons_amount=1     )      print('done')  if __name__ == '__main__':     asyncio.run(main()) Where should I put the comment value?

Ramin: Hi, is there any public repository(php,Golang,js, python) for transferring TON.

Nxrix: can someone tell me what is tonnel network

Nxrix: https://github.com/toncenter/pytonlib maybe this could help (reply to 68674)

O: hey guys, how to parse event logs? for example this one - https://testnet.tonscan.org/tx/OfUjQRSpR5LpQA7Iz8vEnmyMTV-4GOEejVkpeZtvVrc=

11: Good afternoon, friends. My development team and I have made the first decentralized web messenger on TON. The team needs testers who will actively use the application, talk about their impressions, and write bug reports. Each tester will be given a unique nft, which is access to the messenger. Everyone who is interested - in ls. Thank you.

Swaraj: Hey I'm interested in developing a project, let's discuss further? (reply to 68642)

Aldorax: Hello. Good morning everyone.

Aldorax: I am having an calling using the "SendBOC" route on the toncenter v2/v3 API routes

Aldorax: This here is the error being recieved {   "ok": false,   "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state",   "code": 500 }

KASSEM: hello

KASSEM: are clicker apps like hamster Kombat built on Ton Blockchain or they are using regular web2 apps infrastructure?

Memes Mask: hi, of course, just a database and nothing more (reply to 68722)

User<835351458>: Is there a tipping bot for groups which pays in ton?

d00g: Hey everyone, someone here implemented ton-connect using next.js?

KASSEM: so they are regular apps with ton integration (reply to 68723)

d00g: I have implemented everything and uploaded manifest file live on a url, but when clicking 'Connect Wallet' and then 'Open Wallet in Telegeam' it is loading forever and then writes: 'Dapp manifest not found'

d00g: I am using ngrok but the manifest was uploaded to one of my domains.. maybe it cannot get access to the domain?

MEW: Does anyone know why we need this "time out" error when latest block is not synchronized?  In the geth node, even if the latest block is not synchronized, the currently synchronized data can still be viewed

d00g: Ok, the problem was that I wansn't deploying to vercel and using ngrok. Moved to vercel and it's working fine. (reply to 68734)

d00g: Is there a way to find the wallet balance?

&rey: TON balance? Yes. Which SDK are you using, or which API you prefer? (reply to 68745)

d00g: Yes, TON balance..

d00g: I am using tonconnect/ui-react

d00g: But for some reason, I get an error on parseFriendly and parseRaw of Address

Milad: Hi everyone, I hope you're all doing well.  I've developed and deployed a v4r2 wallet, which is fully functional. However, the network is not recognizing it as a wallet type, causing some issues for me. Does anyone know what I can do to ensure the network identifies my smart contract as a wallet?  Here is my wallet: https://testnet.tonscan.org/address/EQCD6kgjmetjInPqwsnRKht3dXMftNkaAVSMedyhZYTaowtI

Boris: Just use Address.parse its distiguishing the type automatically (reply to 68758)

&rey: That's write-only. You need another library to read blockchain. (reply to 68756)

Martin: Anybody used the Assets SDK?

Martin: It looks like it just hangs while creating an NFT collection

Trassos: Sorry to bother you guys. Got stuck trying to watch TON Course on stepik. Is there other places to get it from? Its incomplete on youtube

&rey: Maybe you could use other learning sources? For instance, ones I mentioned in https://t.me/tondev_eng/66688. (reply to 68771)

Stephan: Good afternoon, can someone tell me if it is possible to transfer the jetton admin to another address, and not just make a revoke?

Ярослав: 😂😂😂😂 (reply to 68806)

Sepehr: When I submit transaction to blockchain, The tx hash will disappear after about 15 minutes. Why?

&rey: You're looking in Tonviewer? It tends to show emulation alongside reality. (reply to 68809)

fade: IMO they should leave a comment somewhere that it's only an emulation, I don't think many people are aware of that, it confused the heck out of me why transactions seemingly disappear after a while until I took a look at their code (reply to 68821)

Paul: Hi , wwhere can i get Ton in testnet? The bot faucet seem not working

fade: mine is also different from the global config, I don't think that's the issue, is you node synced yet? (reply to 68521)

fade: are you trying to parse the raw boc message? take a look at tongo and anton (reply to 68686)

&rey: I believe those are just different key blocks. (reply to 68521)

Gyorgy: Usually works fine, If not try again bit later:  Bot: @ testgiver_ton_bot (reply to 68824)

Pro: Hi all, I have a question regarding the implementation and update from Highload v2 to Highload v3 (please bear in mind I am a user rather than dev)  With this update, is there any specific and exact security issue that would be solved? can you xplain it to me ?

d00g: Which one you suggest? (reply to 68764)

User<5435924052>: I'm smart contract and frontend engineer being proficient in FunC/Tact , JS/TS, MUI/MUX/Styled Components/Tailwind CSS .

MEW: I am synchronizing an archive node, and although I downloaded the latest 2.7t snapshot, I still need one week of remaining time to synchronize (reply to 68825)

MEW: Does anyone know the discussion group for the operation and maintenance of ton nodes

fade: IIRC if it's not synced yet, trying to connect to it will yield time out error (reply to 68863)

Nxrix: Am I allowed to use transactions to send png? 😆

Maksym: Hey TON here the mistake Title say "Exprires at" but info show creation time not an expiration

Maksym: it is from multisig (reply to 68933)

— 2024-06-10 —

C: Hello. Pls dm me. (reply to 68471)

Harry: guys, how i can change ton wallet to testnet wallet on telegram app

Sarah: Hi! Just wanted double check regarding the upcoming upgrade..  Does this apply to rpc providers too? Or is it just mandatory for validators?

MEW: every full node is running a local validator (reply to 68966)

MEW: Do you have tg groups about ton node? I found lots of issues in the code

Vitaliy: Hello everyone! I'm sending ton trasfer with tonweb library like this.   const transfer = wallet.methods.transfer({     secretKey: key.secretKey,     toAddress: 'UQCFimNVaQ-J3aCFkbpg-a70bDOpL5zFlv46BDJsUs2Ux9KS',     amount: TonWeb.utils.toNano('0.012'),     seqno: seqno,     payload: '',     sendMode: 3,   })   const transferSended = await transfer.send()   console.log('sent', transferSended)   The response is {@type: 'ok', @extra: '1717895547.5868392:4:0.9812152741727561'}  How can I get tx hash?

Vitaliy: tonweb library doesn't seem to have it in its documentation

Meow: how to update dns .ton in tonscan, thank

Pro: Hello everyone. I have a question regarding the implementation and update from Highload v2 to Highload v3. Why is that there are no highload v2 wallets on tonviewer explorer? With this update, is there any specific and exact security issue that would be solved? can you xplain it to me ?

Tharun: hi

Aibar: What language is the best to build defi smart contracts on ton?

Aggressive profit taking: When is Ton being used on telegram as utility

Aggressive profit taking: When can we buy memecoins through telegram

Falco: I think this is the only one, so you should probably just share your issue here (reply to 68978)

nick: I followed the official documentation to install the TON full node using the following steps:  wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh sudo bash install.sh -m full -d  I pre-downloaded the latest file (279G) specified by the script to the install.sh directory to speed up the installation. However, I encountered the following error during installation:  ton@prod-bon-chainnode-ton-1-b:/home/app$ mytonctrl [warning] 10.06.2024, 07:43:23.466 (UTC)  <MainThread>  The config file is broken local.db: {'config': {'logLevel': 'info', 'isLimitLogFile': True, 'isDeleteOldLogFile': False, 'isIgnorLogWarning': False, 'isStartOnlyOneProcess': True, 'memoryUsinglimit': 50, 'isLocaldbSaving': False, 'isWritingLogFile': True}} [debug]   10.06.2024, 07:43:23.467 (UTC)  <MainThread>  Thread self_test started [debug]   10.06.2024, 07:43:23.467 (UTC)  <MainThread>  Thread write_log started [info]    10.06.2024, 07:43:23.467 (UTC)  <MainThread>  Start program /usr/src/mytonctrl/mytonctrl.py Welcome to the console. Enter 'help' to display the help menu. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1228, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 114, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 130, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1951, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 67, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings  Could you please help me resolve this issue?

Sarah: is there downtime during the upgrade?  and the instructions for the upgrade (including version) will be provided at 0900 utc? (reply to 68976)

Mohammadreza: Hi everybody  Can we pay more fees to prioritize our transaction to validators?  Like tips on polkadot

K.: Func or Tact. Func, at least, has a lot of Defi examples and production-ready apps using them. (reply to 69000)

K.: No, you can't prio your transaction with more gas, nor make it faster. (reply to 69018)

K.: Assign a .ton domain to a specific address on https://dns.ton.org/. Note that you have to own the domain to make such change. (reply to 68992)

K.: Not directly (obviously), but you could maybe base64 encode an image and send chunks of it in each transaction as a message 🤷‍♂️ Not sure how many messages it would take tho, but could be one way to do it. (reply to 68905)

Baldwin: How to parse address of toncenter to ton address format?

K.: Address.parse() function from @ton/core or @ton/ton (npm package) (reply to 69031)

Jacky: Do you have staking examples? (reply to 69021)

User<7123272744>: https://explorer.tonnft.tools/ use this API (reply to 69031)

K.: Here's an open-source liquid staking protocol: https://github.com/HipoFinance/contract (reply to 69035)

Mohammadreza: I compared my transaction with several transactions at the same time, and their fees were more than mine transaction (almost double)  How is that possible? (reply to 69023)

K.: Most likely they were more complex. Here's a great read: https://docs.ton.org/develop/smart-contracts/fees (reply to 69043)

Mohammadreza: Thanks for your help (reply to 69044)

Hossein: Hello,i want get last transaction of a ton wallet to check if the wallet recieve ton with curl

Dmitriy: Hi! Is there any way to check keccak256 signature in FunC? I see only check_signature for ed25519 in stdlib.fc

Max: slice cs = in_msg_full.begin_parse(); Does anyone know what 'cs' is short for?

Nerses: why in tact i cant define function argument with type Int as int256 ?

Alex: cell slice? (reply to 69054)

Anton: because it will be 257-bit integer anyways (reply to 69055)

Anton: you get your function arguments via TVM stack and all integers there will be 257-bit ones

&rey: By the way, the address you get is also "TON address format", just hexadecimal one. "EQ"/"UQ" is called user-friendly, though. (reply to 69031)

Hossein: Could you help please (reply to 69051)

Nerses: thanks for explanation (reply to 69059)

&rey: Please check out if opcodes at https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#hashes can suit you. (reply to 69052)

&rey: Are you that sure that last transaction will be what you want? It may be scam transaction with 0.0001 TON of value instead; or outgoing message which happened to be sent at the same moment. (reply to 69051)

Dmitriy: Thanks, but it seems like this is not I’m looking for: I’m looking for the opposite functionality of checking the signature rather than hashing the data Or maybe I’m missing something (reply to 69064)

Hossein: I want create a gateway for recieve ton,how can i do this with curl? (reply to 69065)

Dmitriy: I see ECRECOVER on this page for this purpose But I’m not sure if it’s suitable for checking keccak256 signature 🤔 (reply to 69066)

&rey: I'm quite sure signature verification is implemented using lower-level primitives, isn't it? Though, this *is* implementing own cryptography, so you should be careful and check behavior of your implementation against others which exist. (reply to 69066)

Dmitriy: Yeah, I see The main point I’ve wondered about is whether there is some known implementation of it, but it seems that it doesn’t exist (reply to 69070)

Dmitriy: Known high-level implementation in FunC, I mean

&rey: Please check what requests https://github.com/toncenter/examples/blob/main/deposits.js does and implement the same. (reply to 69067)

Hossein: thanks a lot (reply to 69073)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 53 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 37  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Svein: Is there a tool that deploys smart contacts in TON?

mj: hey guys, new to ton. glad to be here

User<7123272744>: https://ide.nujan.io/ (reply to 69082)

&rey: Deploys from what? If you have code cell and data cell,  you can use https://ratingers.pythonanywhere.com/deployer/. (reply to 69082)

Nerses: is there any online tool for doing sha256 ?

Sunil | Aerius Labs: How to read emiited logs in TON ?

Nerses: after two times of hashing num with this code         let pre: Int = sha256((num).toString());         let hashlockFromSecret: Int = sha256(pre.toString()); i get differnet results in tact and solidity. Is it possible or is there any mistake in that piece of code ?

Dmitry: 257bit number probably (reply to 69098)

Nerses: isnt there any method to change return type of sha256 to int256 or use any lib in TACT smart contract ? (reply to 69099)

Dmitry: what code did you use for solidity version (reply to 69098)

Nerses: bytes32 hash = sha256(abi.encodePacked(pre)) (reply to 69105)

Dmitry: i bet abi.encodePacked does not return decimal string

Nerses: could you please give any hint how to change tact code to work like in solidity version ? (reply to 69107)

Dmitry: its hexadecimal number

Dmitry: i can try (reply to 69108)

Nerses: thanks very much beforehand (reply to 69110)

User<5323537699>: Looking to hire TON developers for DAPP, please dm me for more info.

Aish: Hey guys, new to ton.   I am creating a Jetton and a receiver contract in tact.  How can a contract receive jetton token and make sure that that the receiving contract is getting notified by the jetton created by me?  Also how can we add the metadata to a cell, what is the format for cell data in tact.

Sunil | Aerius Labs: how to read emitted logs in ton ?

User<7192644220>: Hi, Experts! How can I set fees as my mind when making a transfer? like this:

Linthero: Hi! Where can I find the documentation of @twa-dev/sdk ?

Linthero: How can I get telegram user details from the mini app? (I need to send notifications)

&rey: Load transactions on contract and read outgoing messages. It's worth mentioning that this allows you to get rid of logs as well, if you can parse incoming messages. (reply to 69118)

Linthero: Is there any JS library that I can use to verify that particular message is signed by the account / address owner ?

&rey: 1. Retrieve public key of wallet (if it is not deployed, you can't do the check; you can parse contract data, call get-method or request public key from tonapi); 2. Check ed25519 signature. (reply to 69135)

Li: like tonweb? (reply to 69135)

Dmitry: so              let num: Int = 0;              let lol1: Slice = beginCell().storeUint(num, 256).asSlice();              let pre: Int = sha256(lol1);              let lol2: Slice = beginCell().storeUint(pre, 256).asSlice();              let hash: Int = sha256(lol2); (reply to 69111)

User<7192644220>: it is impossible? (reply to 69123)

NPA120: Hi, friends. I am looking for a senior Ton developer who can work on my staking project. I don't work with beginner or fresh man. Individual freelancer needed. Don't waste your and my time.

&rey: Maybe you were looking for .storeUint(pre, 256)? (reply to 69138)

User<7192644220>: But clients know the dapp working like that (reply to 69140)

Fereshte: Hi.. I use tonweb api for estimate fee, but the storage_fee and fwd_fee is 0, thus the fee estimation becomes very low why is this happening?

Dmitry: maybe 🤡... (reply to 69144)

Linthero: Thanks I found a function that I think might be useful: import { safeSignVerify } from "@ton/core"! Do you also know if it is possible to get telegram user details from withing the Telegram Web App, I assume the @twa-dev/sdk might be useful? I want to send notification and avoid doing two authentications - one when connecting wallet and one for Telegram login. (reply to 69136)

&rey: Appropriate chat for that is @devs. (reply to 69148)

Dmitry: thanks for the suggestion (reply to 69144)

User<7192644220>: how about set the ihr_fee when sending message? (reply to 69145)

Mitchell: Any dev who can navigate TON chain let me know!

User<6828012762>: 👋

User<7123272744>: I can do it. Let' discuss further (reply to 69152)

&rey: Also, no. One can choose whether message may go through IHR (not that it does anything in current chain configuration). (reply to 69151)

Nerses: Yeah it was exactly what I wanted. Thanks very much (reply to 69138)

User<6828012762>: help pls

Paul: Hi, how to avoid 'Integer out of expected range' error. I have a price of token store in nanoton,  and amount of ton (also nanoToon). I need to mul two value?

User<7192644220>: so it is impossible really? (reply to 69157)

mohsen: How can I get the decimal value of each token using the pytoniq library?

&rey: Integers are limited into range [-2^256; +2^256). You can use fused muldiv operation, which calculates a*b/c in one operation. (reply to 69162)

Fereshte: pls help (reply to 69146)

mohsen: fekr nemikonam takhmin fee ghabl az anjam transaction emkan pazir bashe (reply to 69166)

Mitchell: Looking for the best TON dev

Fereshte: Estimate mikonan yekam tafavot dare ba asles, vali in dg dare dota meghdaro 0 mide k eshtebahe (reply to 69174)

mohsen: man ke ye hafte rosh kar kardam be natijei naresiadm.. majbor shodam 0.005 hardcode konam chon toye ketabkhone rasmish ham hardcode karde bodan (reply to 69177)

mohsen: https://t.me/pythonnton injam bepors shayad komak kardan.. behtare russi beporsi (reply to 69177)

Fereshte: Yeki alan pv goft ghablesh bayad transaction sign beshe Fk Konam vase man sign nis..hala emtehan mikonam migm (reply to 69180)

Aceme: Anyone needs a TON dev?

Nerses: how can I convert from String to Slice ? I used Builder for it,but for long  Strings i get BitBuilder overflow

Sev: please help me. I have a telegram bot that uses sendgame to open web links. When I go to the website, what should I do so that when I click the button, I will be redirected to another bot channel?

&rey: .storeStringTail should work fine. (reply to 69196)

Nerses: yeah actually it worked,just get error in other place.could you please explain what this number means 585546945 as error message is invalid prefix.and this is function genereated with compiler while build  export function loadRedeem(slice: Slice) {     let sc_0 = slice;     if (sc_0.loadUint(32) !== 585546945) { throw Error('Invalid prefix'); }     let _data = loadTonTransferClaimed(sc_0);     return { $$type: 'Redeem' as const, data: _data }; } (reply to 69205)

&rey: It's opcode associated with message Redeem {...} (reply to 69206)

Nerses: thanks a lot (reply to 69207)

Nerses: How many bytes can be stored in Builder ?

&rey: 127 (1023 bits). And 4 references. (reply to 69221)

Dafy: Hi guys Can anyone help? Im using .sendTransaction and getting as result boc string. How can I validate a transaction from my backend?

uzbc0der: I created new token but its price is 0. How i can set price, what i do for For the price to appear

Artem: hello who is working with ston.fi, i need some help. how can i check my swap tx using /swap/status endpoint? i have this request https://api.ston.fi/v1/swap/status?router_address=EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt&owner_address=UQAVAjveFMZgOL-rhInv899g7oZx9U2TboGWESgHKk7yMKji&query_id=1718034924402 that gives me not found, but the transaction has already been added to chain https://tonviewer.com/transaction/971b69fa90c10da48f885392d15c4d7dc982ae6744c392da48f420941e6d3b16  what am i missing here?

Андрей: Hi. Can admins unban me in RU chat? I promise no more inappropriate jokes (or any other reason I might have been banned) 🙂

NPA120: In order to set the price of your token, you need to provide the liquidity. (reply to 69231)

Nerses: let builder = new Builder();             builder.storeStringTail(data);             const slice = builder.asSlice();             console.log(functionMap[result[0]](slice));   i changed code like this,but now i get invalid prefix is it possible storeStringTail can modify the string ? (reply to 69205)

uzbc0der: how i can provide liquidity (reply to 69238)

NPA120: https://guide.ston.fi/en/how-to-provide-liquidity-on-ston.fi (reply to 69241)

Jzuss ┌( ಠ_ಠ)┘: This post (https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation) about rnd number generation. "...you can create number that are even harder to potential adveraries to predict" What does exactly this mean? How attacker can predict hash(c7 info) in run time?

Milad: Hi everyone. How can I check the type of data inside a slice in FunC?  I want to see if the data is uint or not!

Ronaldo: Guys, is there a way to Implement Ton Connect in Java or Kotlin?

&rey: To implement which side? (reply to 69256)

Ronaldo: My wallet is developed for Android and it uses Kotlin

Ronaldo: to allow dapps connect there

Ronaldo: I added support for TON network on the wallet, but the dapps is not working, because it needs support Ton Connect

