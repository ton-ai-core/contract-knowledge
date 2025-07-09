E: Thanks for your time and feedback. Pls find my answers below. I also made some updates to the proposal text to make things more clear. 1. It is unclear do we really need a standard for this? Isn't it just internal implementation details of jetton-DAO system. - Because this scheme does not fit the DAO case only. It fits any staking based scheme which fits the constraints. Token issuer tightening/staking similar to what FED is doing right now is a great example, or other governance forms like we see in web3 gaming. But the most important part is that this scheme does not need consensus. Therefore, it is much cheaper (almost free), faster, and more secure. It is the ONLY scheme/standard in web3 that does NOT need consensus to achieve the same result in such use cases. Let me explain how fundamental it is with one more evidence: It adds the lock() function to fungible token standards, to the list of transfer, mint, burn. Adding something to such a short and fundamental list sounds fundamental. And it adds fundamental functionality. It removes the need to approve a third party contract to transfer money on owners behalf. On the other hand, it is not applicable to all DeFi schemes but to those with the same constraints. Please read here for another use case which is financial: https://web3-4.gitbook.io/daoton/buidl/lockable-tokens-standard/financial-use-case 2. Indeed, to forbid double voting you need to be able to lock jettons from transfers. But also you need to prevent voting from the same wallet twice somehow. It is unclear how you do that. - Thanks for this question to remind me that i need to put some text there. The proposal contract's vote function saves who voted right after commiting the vote; or it can check the app_id field of the voting jetton-wallet's lock state. I explained it at the app_id for exclusivity use case. A consumer app is responsible for its own bookkeeping since it knows its own logic. Some apps may be happy with double voting in return for some actions for example. The backend just provides data, the consumer app decides and implements logic and bookkeeping. 3. Nikita Kuznetsov from OpenMask well thought out this concept of DAO, I made my own half-baked implementation here (https://github.com/EmelyanenkoK/jetton_dao), not ready for production but can be used as proof-of-concept. - Thanks will check them out. By the way I updated proposal text after getting your questions to make things more clear. You may read it at: https://web3-4.gitbook.io/daoton/buidl/lockable-tokens-standard/introduction (reply to 25407)

Kate: Hi everyone from TON community in Lisbon!   If you are in Lisbon – don’t miss our event tomorrow🚀

Kate: Bom dia, TON Lisbon Hub сommunity!   This Wednesday! We’ve prepared a burning topic for everyone – "How to Raise Funds in Web3: Insights from Investors and Developers”💸  Get insider tips and insights from experienced investors and successful developers on how to navigate the world of Web3 fundraising and turn your crypto project dreams into a reality  Program of the event: 18.00 – Welcome drinks and aperitives 19.00 – Speaker’s presentation “Web3 Fundraising Journey: Essential Methods, Tools, and Key Players”. Valeriy Bukharkov, CBDO of Tonstarter, ex. DAO Maker 19.30 – Speakers presentation "5 most common mistakes developers make when attracting investments". Rupert Barksfield, СEO of Amulet.org, DeFi insurance and advisor/investor in web3/2  And than…🎙️Open mic for presentation of your web2/web3 projects and lively networking session!  Wednesday, March 22 📍ROVE Lisbon | 18.00   🏷️RESERVE A FREE TICKET: via Eventbrite link (forwarded from TON Society Europe: Lisbon🇵🇹)

Zyxep: 💎 You can check the price of The Open Network (TON) jettons in different DEXs with Jetton Pro bot   jettonprobot

Alex: Hello everyone! I'm an absolute beginner in programming, but I understand system administration, and I have a question: I have 70 terabytes of disk space on an Ubuntu server, and I want to try becoming a TON storage provider, but I can't figure out how to do it. I have compiled and installed everything that is available on the website https://ton.org/docs/develop/howto/compile, but I don't understand where to go from here.

Tim: At the current stage you will need to do more than just launch your storage daemon. You'll also need to make some interface for users to access it. Probably some proxy for outside world too (reply to 25441)

Alex: Problem is I even can't lunch storage daemon.

Vadim: Seems you removed  storage-db/keyring folder (reply to 25443)

Alex: No, it's there

Vadim: It's empty?

Alex: Yes

Vadim: Looks like you started storage successfully, then removed files from this folder.   You can try: Remove storage-db folder, then run storage again. It should generate new files for everything in storage-db. But you will lose all your bags if you have ones

Oğuzhan: I created project with npm create ton@latest and select counter contract, when i build have not a error but i created new contract with npm blueprint create in react project have a SyntaxError: Unexpected token 'export' error

Alex: Yey, it's works (reply to 25448)

Kimmo: Hey, are there any full ton node archive dumps available anywhere? https://dump.ton.org/ seem to include dumps only for full nodes, not archival nodes (which is understandable 😁)

Daniil: archival-dump.ton.org (reply to 25451)

Kimmo: Thanks! (reply to 25452)

Daniil: But it requires password for downloading

Marlee: Is it recorded or live streamed? (reply to 25439)

Kate: Hi! This is ofline meetup for local community in Lisbon (reply to 25456)

Roman: 🚀 Upgrade your TON development with Docster AI! 🤖💬  Docster AI is a bot created to answer tech-related questions about TON Blockchain directly in Telegram (@docster_bot)  🎉 I'm excited to announce the update v0.2 for Docster AI! 🎉  🔍 No more fake links. With this new update, you can rest easy knowing that Docster AI has eliminated all fake links, providing you with only the most reliable information. 🚫🔗  📝 Knowledge base from TON Answers. I also added ALL questions and answers from the TON Answers platform. This means that you can now access even more comprehensive information and get your questions answered faster than ever before. 🤩💡   However, it's only alpha-test of a ChatGPT assistant with fresh knowledge from The Open Network. Stay tuned, help with feedback and join development on GitHub repo here! You're welcome 😎  👉 Play with @docster_bot now

Eugene: Wow, looks interesting!   A small bug report: I've tried to test it using questions from answers.ton.org, and to one of them this came up (reply to 25458)

Roman: interesting. Thank you! I try to check every link for 404 (truly no fakes), and it looks like a bug. I will fix it soon (reply to 25459)

Steve: I actually tried to use ChatGPT to rewrite some code from original node to make it readable

Steve: it worked really well

Andrey: gigachad (reply to 25461)

&rey: I think ton.js somewhy had been considered a link – maybe because of weird Telegram processing, just like ton.py is highlighted. (reply to 25459)

Andrew: well... (reply to 25464)

&rey: Could you train it on TVM assembly to describe what the code does and maybe decompile it to FunC + then maybe add ability to download contract code from blockchain? (reply to 25458)

Daniil: I'm not sure that publicly available gpt fine-tuning is that powerful (reply to 25466)

vsnation 🟣: Who knows how to define type of transaction? TON/Jetton/NFT? Do I need to decode message?  "value": "0",         "fwd_fee": "0",         "ihr_fee": "0",         "created_lt": "0",         "body_hash": "6fv0/FVieAkowpB3dZBY9nhzLid1rtPCf0df8XtixrQ=",         "msg_data": {           "@type": "msg.dataRaw",           "body": "te6cckEBAgEAuwABnNqHysX1BCH1xPDT7kjgfq0hDH1De4yztOqT7O1EbpcwqJBpePtT4fWVwqCp+NMTaVvE0ZWcaBSGLBgS2QMa7wopqaMXZBiEBgAAAC4AAwEA0GIAf++Qed2xjPLv860d4Xz43Uf8FaSVXY7+ISzFPBe6Z2qh3NZQAAAAAAAAAAAAAAAAAAAAAAAAR2FtZTogMDsgVGVhbUlEOiAwO1R5cGU6IGJ1eV9hdHRhY2s7VHlwZVZhbHVlOiAyx9TQbQ==",           "init_state": ""         },         "message": "2ofKxfUEIfXE8NPuSOB+rSEMfUN7jLO06pPs7URulzCokGl4+1Ph9ZXCoKn40xNpW8TRlZxoFIYs\nGBLZAxrvCimpoxdkGIQGAAAALgAD\n"

— 2023-03-22 —

ЛЁЛИК💗: /

ЛЁЛИК💗: /w

ЛЁЛИК💗: OlgaDyra33@

popcat: Is there ton connect developers here? https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json Please return universal_url to tonhub wallet. Ton-connect widgets not working now.

순범: me too (reply to 25477)

Andrew: they are already investigating

popcat: It’s affect all of the widgets on every site (reply to 25478)

Nikita: Hello  I added Ledger Hardware Wallet support to OpenMask browser extension https://t.me/openproduct/37  I would be glad for a feedback!

Hotwheels: Hi, any admin of community chat that I can talk to?  Being restricted for no reason on 2 community chat doesnt feel nice.  While I support ton by using toncoin on trades, nft, etc.  Please lead me to the right direction if this cannel is not the correct way for raising this issue.  Thank you in advance.

Tim: They do its on github 🤦‍♂️🤦‍♂️🤦‍♂️ (reply to 25488)

Coalus: https://github.com/getgems-io/nft-contracts/ (reply to 25488)

User<6247944943>: Yes, but those are the TS files that are called on the website. The error occurred because of the NFT Item contract I am using, right?  This means that I need to implement the correct 'Offer contracts' calling to my NFT in the smart contract level, correct? (reply to 25491)

Tim: Why can't you just look carefully. Everything is there func too (reply to 25492)

Coalus: https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources (reply to 25492)

User<6247944943>: oh, thanks.  I think I just had a moment of confusion (reply to 25494)

Pranjal: Can i also invest in ton

Eugene: You surely can, but this is not the right chat for it, it's about development   Try visiting the official ton.org website (reply to 25496)

Dario: Hi, I tryied but doesnt seems to work 😢 Stuck at "Unlock Ledger and Open TON App" page, refreshing the page worked (reply to 25484)

Pranjal: EQBIi2tkvKLmQ-S7IibXspR1b-0EDU6zjv_Jc-3ZfV6vBxCn

User<6247944943>: thanks. PM for a question (reply to 25494)

Danielle: Hi! Is there a way to request for more testnest TONs without having to wait every hour from the testgiver ton bot?

Андрей: Running own testnet locally (reply to 25502)

Андрей: https://blog.trailofbits.com/2023/03/22/codex-and-gpt4-cant-beat-humans-on-smart-contract-audits/ ha-ha

noringood: 😦

Berke: I was using local toncli on my old intel macbook as I couldnt setup the docker image on my m2 mac. I know how docker image works etc but seems like Im getting random errors, and cant use local toncli(which is for intel actually) with the image one(even instruction code giving error of "No contracts [None] are founded in project.yaml" while its just example repo with contracts linked in yaml file).  It says docker image is m1 compatible, m1 means m2 compatible too afaik but now Im not so sure now, is there anyone getting successfull with toncli with their m2 mac?

Berke: Or is there anyone running toncli docker build for func?

User<6204515314>: this seems to be very good

Vladimir: Seems to me related to the optimizations of ton tools for some processor features.  If you run func or fift do you get an error like Illegal Instruction? (reply to 25507)

A: Hey guys! I minted images in testnet, deleted them phisiclly and updated with new ones. (Same URLs used) Then I minted them on mainnet. Getgems shows new images as needed, but if you go to see them via tonapi.... They are from testnet! How is is possible at all?

&rey: Probably. tonapi's cache is not updated. (reply to 25510)

A: The wallet shows old image too (reply to 25511)

A: It is not about webcache... (reply to 25511)

Alex: Hello mates. Trying to install Ton storage provider on my ubuntu server. I compiled and installed everything, started storage-daemon and storage-daemon-cli, run "deploy provider", it asked to send 1 ton to some address. Can I send it from my personal wallet? Or I should make new one for server? Also, storage-daemon started to spam with this error: "[ 3][t 6][2023-03-22 20:54:47.163250674][storage-daemon.cpp:618][!tonlibclient]  Deploying storage contract: [Error : 500 : LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state]"

Alex: Also, where I can find IP address and port for adnl

— 2023-03-23 —

User<6247944943>: I still can't solve this issue since the NFT I deployed can set a fixed price and auction sell on getgems.io, but it doesn't work properly for others to make an offer on this NFT item. It's very weird.  It seems that there is a limitation on the amount that can be forwarded, I guess? (reply to 25482)

Alexey: hi, TonConnectButton ui-react is reflected only 1 time on the react page. why is this happening and how to fix it

User<6247944943>: Since I checked again and again, I still can't get why my NFT got that error tho. Since no other place will need forward_fee except with Transfer (reply to 25494)

Rahul: I had a same issue. I'll try to debug it and current version is not stable enough for production where code in written in such a way that it is looking for a button id and sometimes it doesn't render and gives blank space.   For now you can create a custom component to connect and disconnect wallet instead of using default button option.  You will have to check if user is already connected or not based on that you can display connect or disconnect button. (reply to 25523)

Morris: Hi can anyone help me ? I have this transaction  https://testnet.tonscan.org/tx/by-msg-hash/3e4xhTFQE6L9VZWrToeuxmKVlw9IitwsZmgbuhkc2AI= and how can I get 3e4xhTFQE6L9VZWrToeuxmKVlw9IitwsZmgbuhkc2AI= with sdk, thanks

Uur: You can use the toncenter indexer api. https://toncenter.com/api/index/ specifically /getTransactionByInMessageHash endpoint

Morris: I got that, but it's can get from tonutils-go?

Step: how to estimate fee ton lib?

User<6247944943>: which part of fee? minimum fees for Tx? (reply to 25532)

User<6247944943>: Usually, a premium number and mode: 64 are used on the smart contract side, I think.

Daniil: what transaction are you trying to send? (reply to 25532)

Nikita: The examples:  https://github.com/tonkeeper/tonkeeper-web/blob/1e1e65c02be18635b534b8c09bafa185d96e3f8c/packages/core/src/service/transfer/tonService.ts#L43 (reply to 25532)

Step: normally sending ton without any body/payload. (reply to 25535)

Step: can we do it with TonClient,TonClient4 ? (reply to 25537)

Nikita: https://github.com/OpenProduct/openmask-extension/blob/ef583a2bf65d64ff0e424bbbecf6661e4b30f632/src/view/screen/home/wallet/send/api.ts#L85 (reply to 25539)

Step: in estimateExternalMessageFee address must be own? not destination? (reply to 25540)

Nikita: Yes, it’s external fee for your wallet (reply to 25541)

— 2023-03-24 —

Celinho: Good evening, I saw that Ton's wallet supports pix via p2p. But could have direct pix support between contacts. The central bank in Brazil releases the pix api to implement. You could take a look to have an extra function in the bot other than just buying cryptocurrencies, it would be more viable if noix in Brazil could send PIX to contacts via wallet on Telegram.

Thiago: Furthermore, translating the bot into Brazilian Portuguese would help to popularize @wallet in our country.  #suggestion (reply to 25546)

Krugo D: https://tonapi.io/account/EQB-ajMyi5-WKIgOHnbOGApfckUGbl6tDk3Qt8PKmb-xLAvp  TONAPI says this contract source code is “verified” but it doesn’t show any source code. When I look at the contract in tonscan.org it says it’s unverified. Seems like a pretty significant project. Is it normal for a TON project this size to not have their contracts verified? Seems risky

Celinho: Well, your question that gave me a doubt here, I have a polygon blockchain token, but I don't have much knowledge, I wanted to do multi chain and how do I verify the contract on the Ton network? (reply to 25548)

Howard: oh nice. (reply to 25537)

&rey: Maybe, this contract is verified in testnet? (reply to 25548)

Feliciss: OpenAI’s chatGPT can get information from the web now.  Use http://webarchive.ton or https://webarchive.ton.run to get your website into the dark ton network!  .ton.run support will be added after the Hack-a-TON-x hackathon. Start building your private web today!

Feliciss: https://tech.slashdot.org/story/23/03/23/1834229/openai-is-massively-expanding-chatgpts-capabilities-to-let-it-browse-the-web?utm_source=rss1.0mainlinkanon&utm_medium=feed

Howard: I can't sure whether I should click these links. Looks like spam. (reply to 25552)

Feliciss: It’s not. You can check this: https://waybackmachine.ton.run/ED9270525F2225793C31FA8C3EDFCB33588A1065A26F6D940D6A30DB038224EC/.  It’s working. (reply to 25554)

Feliciss: And the source code collection here: https://0xacab.org/feliciss/tonwebarchiveproject

Howard: Hi, I am checking the FunC code more deeply to learn more. Since there is a line of code that says ;; skip extracurrency collection. What does that mean?   ChatGPT gave me: This line of code is used to skip one bit in the slice cs. The comment mentions that this bit represents the "extracurrency collection." In the context of this smart contract, this bit is not needed, so it's skipped to continue reading the subsequent data from the slice.   https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/sources/nft-item-editable-DRAFT.fc#L144

Andrew: TON has extra currencies (native currencies in addition to the main native token - toncoin) https://docs.ton.org/develop/research-and-development/minter-flow (reply to 25557)

Howard: gotcha. Interesting, seems it's not related to jetton token. (reply to 25558)

Andrew: correct (reply to 25559)

Rahul: For mainnet: https://verifier.ton.org/  Testnet: https://verifier.ton.org/?testnet= (reply to 25549)

User<6247944943>: does https://t.me/wallet have test-net version?

Андрей: Click five times on version of tonkeeper in its settings Use @testgiver_ton_bot to get test coins (reply to 25562)

User<6247944943>: no, I mean the bot itself. I am not asking for testTON.

Alex: Try to ask your question here: https://t.me/wallet_supportbot. As I know, they have no public testnet environment currently. (reply to 25562)

User<6247944943>: I just reviewed the NFT Item code and I can't figure out how getgems.io is interacting with it.  - Which opcode are they using to interact with NFT Item? - How are they parsing the message from the bidder? (I tried to make an offer for an NFT and got an error.) - From end to end, if I make an offer, which receive functions will be triggered by the NFT Item? Or is it just a front-end error check? (reply to 25482)

User<6247944943>: basically it's:   me ->  Calling to Offer contract -> Calling to NFT Item with Offer messages?

Celinho: Do you also know how I do the Cross chain? Like a token on the polygon blockchain and the Ton change value at the same time? I'm grateful. (reply to 25561)

Maksim: Hi, is there some way to deserialize cells from messages body with typescript?

User<5063217108>: Hi

Howard: same same (reply to 25566)

Howard: you need use Bridge service.   You can get TON Price fron OKEX / Huobi API I think. (reply to 25568)

Celinho: So if you create a token on the Ton blockchain and put it in Cross chain on the huobi api, they have the same price and Marketicap? (reply to 25573)

Howard: maybe here are some examples: https://github.com/howardpen9/jetton-implementation-in-tact/blob/new_/sources/output/SampleJetton_JettonDefaultWallet.ts (reply to 25569)

Howard: If you're referring to the price on-chain at the smart contract level, then no. This is information about the Oracle price. Since your token on Polygon is a standard ERC20 token, it is not related to any Jetton token you have. (reply to 25574)

Celinho: Like, Ton exists on erc20, how do they have the same price and Marketicap? Only Bridget and Ton priority to convert Ton erc20 and Ton bep20 into Toncoin. Wish I had that on my Token. There is a website From third parties that multi-chain Tokens, but do not have Ton's blockchain. (reply to 25576)

Roman: 🎉 Yo, TON Community! 🎉   👀 Have you checked out our updated TON Documentation yet? It's 🔥  We've got a whole new domain docs.ton.org to improve security, a slick new navigation bar, and some fresh new visuals.  📚 But wait, there's more! We've also added TWO new sections on Data Formats and Network Protocols, so you can get even more in-depth with your TON knowledge.  👨‍💻 So what are you waiting for? Head over to our new and improved TON Documentation and level up your knowledge! 💪  P. S. Search is fixed! 😁

User<1460963135>: Yohohoh I'm sorry but can't stop 💎 sharing my pet logo as emoji

User<5277567113>: My email is aslimfitakintunde@gmail.com phone number is 234+8146485713

User<5277567113>: We have great news to share with all of you. A new feature has been added to TON’s largest noncustodial wallet, Tonkeeper!  Now you can buy and sell TON through the built-in Mercuryo widget — in just two clicks. This option is available either by tapping the “Buy” button or in the new Tonkeeper browser design under “Exchanges”.  In light of this update, we are announcing a contest.  How to participate:  - Buy or sell TON via Mercuryo from Jan. 23 to Feb. 7 for at least 50$. - Make a post with the tags #TON, #Tonkeeper, and #Mercuryo on any social media network. - Send the link to your post and your TON wallet’s address to the contest support service to the Telegram account @tonrostislav.  10 participants with the largest exchange volume of TON via Mercuryo during the competition period will receive 10 unique “.ton” addresses, which will allow you to assign a beautiful and short domain to your TON wallet or your own Web3 site.  Tonkeeper and Mercuryo welcome everyone to the internet of the future! (forwarded from Tonkeeper News)

Nick: Hi, everyone! Does anybody know is there a template contract in the TON ecosystem that allows after recieving toncoin  to this contract to momentarily spread it equally between multiple addresses (e.g personal walllets, predefined in that contract)?  Thank you

User<6247944943>: Has anyone else received an error message when trying to 'Make an Offer' on testnet.getgems.io?  I think the error is related to the interaction between the NFT and their Offer.fc contract. The problem is, I can't understand where the failure point is or why it failed when the Offer.fc contract sends or checks the content of the NFT.   https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-offer/NftOffer.spec.ts#L25

User<1460963135>: Any template will suitable (reply to 25583)

User<1460963135>: Start from deploying it tostnet as is and dive in; cause second question is too dump to answer

User<1460963135>: Sir I'm not sure but don't they have own chat for suchlike? (reply to 25584)

User<6247944943>: We do test on test-net right now (reply to 25592)

User<1460963135>: Sorry bit inattentive. I answered cause saw this or similar and first tip: back in few hours after trying again. Because it was only reason few times. But can't guarantee just calming down with friend advice ☺️. But you referring to their SMC test spec as location of code. How you get picture from code you linking on?

User<1460963135>: Hey you still here? 😂 Remove your poo I'm ready to answer 🤣 (reply to 25583)

Sonika: Guys, what's the best way to buy Ton for Ton wallet,  essentially wanted to buy some telegram handles at https://fragment.com/numbers but unable to figure how to do the same

User<1460963135>: p2p @cryptobot see /market choose fiat currency there too @wallet (buy I guess button) for toncoin they have low fees (comparing to other chains) fortunately

Андрей: I recommend @wallet (p2p, because it's only option available to me :P) (reply to 25599)

User<1460963135>: Petsonally me prefer @cryptobot for me more usable mb longer experience

Андрей: Will the foundation and ecosystem developers do something about scam spam fake tokens?  Or there'll be even more of it in the future? possible soul-bound on-chain nfts with personal nudes

Daniil: what can they do? (reply to 25604)

Daniil: wallets & dapps should protect users from spam/scam

Artem: Will the foundation and ecosystem developers do something if US regulators require transactions to be censored?

User<1460963135>: Require who?

ＡλＩ: Hi How can I get real-time update of my wallet's transactions? instead of requesting and checking new transactions. Any tutorials on setting up something like webhooks?

Andrew: tonapi.io/swagger-ui SSE (reply to 25610)

User<1460963135>: Only one thing: there will be just checking for new transactions and their requesting behind any kind of "solutions" Plusing @tonapiio. There is "v4" http api it has websocket. It can be deployed at your owns while apiio is not open source. may be useful to "keep connect" with bc.its pushing new seqno or seqno with accounts was affected this block. This is enough to implement any logic requesting more info interested by yourself (reply to 25610)

User<6039057287>: I Need help

User<6039057287>: I want to know how to get money

User<6039057287>: Lol🤔

— 2023-03-25 —

User<6247944943>: Using OKEx, MXC exchange I guess (reply to 25599)

User<1460963135>: this options may require first buy some other crypto somewhere somehow, kyc, ur wife's nudes etc – its not the best nuff said. (reply to 25618)

A: Hey guys, question.  To get an image of NFT on-chain, it got to be in json as base64"...", right? If, so, what is the limit to the image size?

User<1460963135>: No, man. Look. AFAIK for body data format there is flag to switch this option. offchain variant loads body as string and libs fetching data from url it's referring to (it may be IPFS url too). onchain variants loads data as cell and cell can reffer to 4 other and each of them and it's enough to save any bytes. But there is no any standard about that data except mb some proposals or recommendation. 1Y ago everybody used only offchain. Marketplaces support only it. There were no finally accepted standards. Dunno mb already did. Personally for me onchain looks more simple. But dev didn't used brain when used these technologies. So. as I said even marketplaces didn't sup this. MAYBE CAUSE THERE ARE STORAGE FEE AND DATA WILL BE LOST AFTER SOME TIME (in theory) the problem is decision doing service providers (public nodes and api hosts) not users (devs) fetching N requests to load N items of collection.... requests from IPFS.... to load METADATA...... now Y more erquests to load img and thumbs... and yes we need it only to show list. every time you loading it.........  WOW SUCH A PROGRESSIVE  (pls don't tell me how to handle all of this, repeat it to every nft-web3-twitter-influencer asking how to load NFT trades history using lite client)

User<1460963135>: so first you should read all cells and referred and parse it as your specs suppose. There is header which may signal body can be parsed as Message or any binary data. (reply to 25622)

A: Sounds complicated :-( I will try IPFS then... (reply to 25624)

User<1460963135>: ok I'm bit wrong. so data should be parsed as dict

User<1460963135>: loading data - https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md  metadata used by defbaz: https://github.com/getgems-io/nft-contracts/blob/main/docs/metadata.md

User<1460963135>: let's simplify mine: 1) read all docs and specs from ton 2) from default service providers like getgems 3) from default libs authors (reply to 25625)

A: Getgems uses off-chain storage, only one collection , Meridian, is on-chain... Info from the support. (reply to 25629)

User<1460963135>: I need to suggest you to read docs and that raw text files on github too not only rendered vanilla docs website to onboard newbies. tips and standard proposals. code of main libs. docs from marketplaces.

User<1460963135>: here we can consider that data and uri are interpreted as different attrs of entity. loading data returns you contentCell and/or contentUri. and in you client code you should decide how to use it. when you need nft metadata you check contentCell and may parse it as dict after check uri and fetch it's content and it may by json may be another binary data to load somehow. if you doing smth like marketplace or grocery store (lol) you also need to decide what to do with exotic schemas like ipfs:// (run local instance expose http to nginx replace such urls to your gateway). there was one more thing I can't remember. Something with img loading too.  now try to use nft collection as storage and nft items as player stats container. as some ppl here believe it's ok and they need EDITABLE_NFT.  I'm sure you can't resale NFT minted outside marketplaces on them. Not cause they can't they just do not want to list item from competitor platforms.  NFT market is just MYSQL rows at CENTRALISED websites. even if they using some SMC to dust in the eyes)) (reply to 25630)

A: Thank you for the explanation! (reply to 25633)

User<1460963135>: My answers are bit extended just cause I remember that pain. I was prototyping NFT marketplace over 1Y ago but archived project was lost the race with Disintar & GetGems. You may ask me any time in private order)). Will help if possible. (reply to 25634)

A: Thx! (reply to 25635)

Aristocrat: Hi i have technical problem. I wsnt to withdraw ton from okx to my wallet but he said required memo

User<6247944943>: Tag is for internal tagging. you can put tag whatever you want.

User<6247944943>: You will still receive the funds to your wallet since the tx with comment as well.

Aristocrat: You mean i can write anything in memo box?

User<1460963135>: what wallet u use?

Aristocrat: Toonkeeper

Aristocrat: I can write anything to agree withdraw (reply to 25639)

Mohamed: Hello i have 1000$ in skrill i want to exchange wiyh ton 900$

User<6247944943>: Yea (reply to 25644)

User<1460963135>: I did it yesterday to bot' and okx dont ask anything

Aristocrat: ❤️🙏 (reply to 25646)

User<1460963135>: it seems it recognizes it as publicly registered in some lists

User<1460963135>: but if u sure

Mohamed: Hello

Mohamed: Please url of wallet

User<1460963135>: OR MAYBE ALL TX IN UR WALLET HAVE COMMENTS HMMM

Aristocrat: I couldn’t

Aristocrat: Valid !!!?

Mohamed: Send to hhhhh me

Oleg: Hello guys! I’m developing my first contracts and I’m wondering if there is any way to check that received message is from the owner of contract?

Aristocrat: Have done ☑️

Aristocrat: Tnx

User<5823302235>: Hello

User<1460963135>: yes, what lang u use (reply to 25659)

Oleg: Func (reply to 25663)

User<1460963135>: throw_unless(666, equal_slices(sender_address, admin_address));

Oleg: Thanks 😊

•••••: Hi everyone, I am developing a ton wallet using react native and can't generate mnemonic, but when debugging with browser it works perfect, can you help me out?

Uur: If you're developing for the https://t.me/toncontests/111 TON Wallet Challenge, React Native is not allowed https://github.com/ton-community/wallet-contest#technical-requirements

•••••: Not for contest)

•••••: просто шансую, понравился чейн

•••••: isn't hermes (react native js engine) supported?

Uur: Oh, well in that case, are you getting any error? how are you trying to generate a new mnemonic?

Uur: You should be able to use the mnemonicNew function of ton-crypto package https://www.npmjs.com/package/ton-crypto

Uur: no, react native is a js framework

Uur: it is used for hybrid mobile application development

Uur: Dude, i'm a react native developer for 4 years, chill https://github.com/ugur-eren/

Uur: he can use the ton-crypto library

Uur: :D?

Uur: https://github.com/tonwhales/ton-crypto-primitives/tree/master/src/native

Uur: even the internal ton-crypto-primitives supports the react native out of the box

Uur: 🤦‍♂️

Uur: clearly you missed some lessons about commenting on things you clearly have no idea of

Uur: react native uses hermes js engine, yes you can't use browser apis like document or window, but as you can see ton-crypto doesnt uses those apis

Uur: You can even use v8 in react native if you want to https://github.com/Kudo/react-native-v8

•••••: sorry bro, this package requires expo random, but I don't want to install expo

•••••: because it would increase the bundle size

•••••: do you have a workaround?

Uur: You can use expo modules in bare react native workflows

Uur: https://docs.expo.dev/bare/installing-expo-modules/

Uur: I have never used the expo random, you may even just install the expo random without these extra steps, but i'm not sure (reply to 25714)

•••••: unfortunately not working without it, have already tried. The doc states to install expo modules(

•••••: thanks anyway

Uur: You can still use this documentation to install expo-random, it doesnt install the whole expo modules (reply to 25714)

Uur: https://blog.expo.dev/embracing-expo-modules-in-your-react-native-projects-cd8ed4cbec3 The expo package is lightweight, increasing only about ~0.2MB for app download size and ~0.45MB app install size on iOS.

Step: how tonlib differ from liteclient? are they same?

isoscele 💎: hey i'm having trouble configuring pytonlib on ubuntu 20.04. It starts well but this happens and crashes :( Intel CPU

User<1054831578>: Mb ram not enough. Try switch to testnet branch and built it. So u really need to build it? There are binaries. Even with wrapper libs. (reply to 25723)

User<1054831578>: so why @commonbabylightmyfire was banned? somebody personally @gusarich ask someone to do this just to shut up? for truth? native not running in browser or word "autist"? good luck.

isoscele 💎: where are binaries (reply to 25724)

Daniil: I just asked him not to be aggressive in this chat. Nothing else. (reply to 25725)

Dilek Yıldız☀️: Türkçe bilen var mı bunu bir anlatabilir misiniz nasıl

Uur: Merhaba, neyi anlatabilir miyiz?

Uur: https://t.me/toncoin_tur_chat

talkol: Want to learn how contract sharding in TON works? It is much easier to understand with Tact. And Tact is much easier to understand with https://tact-by-example.org  Check out the latest lessons in https://tact-by-example.org/all that explain everything about contract sharding and parent-child relationships with easy to understand examples you can play with (forwarded from talkol)

Steve: i think normal array-like structure could be a good example

talkol: There’s a todo list example :) (reply to 25732)

talkol: And a simplified token that shows a map of balances

Steve: I am about in-contract one, no scalable

— 2023-03-26 —

Dicov: Good evening, I have a question... How likely would be the implementation of the new AI technology in the blockchain or rather, in The Open Network? And if it were to be done... What would be the benefits according to you, both for users and developers?

Howard: with the largest exchange volume of TON via Mercuryo 🙈 (reply to 25582)

HASHISH: Hi, I can’t receive my test tokens (

User: It translates as: "Something went wrong, please contact with administration", so the best way to solve problem is contact with administration of the bot. (reply to 25741)

HASHISH: But how I can find this admin? (reply to 25742)

User: Did you check description in the bot? (reply to 25743)

HASHISH: Yes (reply to 25744)

User: Or you can try to write your address again, maybe it'll work. (reply to 25742)

Rahul: Now I am also getting same error. Before that it was working perfectly fine.

HASHISH: This person is trying to scam me and pretending to be an administrator in your chat, which he is not, please take action because he is asking me to enter my private key from my metamask on an incomprehensible site https://www.coinlinker.org/

HASHISH: I understand what you mean but you are safe and 100% secured  Am not just a random person trying to help you and trust me I won’t ever do anything to hurt you am just here to help you and put you through (forwarded from User<5957713999>)

HASHISH: Ok I will try thanks (reply to 25746)

HASHISH: Maybe because testnet start in 1 April ? (reply to 25747)

User: I got this error too, so we can just wait, maybe there are some problems with api or smth like this. (reply to 25750)

HASHISH: Scammer 💩 (reply to 25749)

HASHISH: Ok ✅ (reply to 25752)

User<6247944943>: hi, how can we track the URL based Tx since the users might click it on Telegram?   For example:  https://app.tonkeeper.com/transfer/EQdddddddddddddddd?amount=850000000  how do I know someone had click it and preparing to send the TON?

Kirill: There is a spike in activity of scammers.  Admins will never DM you first, ask for private keys or money.

HASHISH: Thanks very much 🤝 (reply to 25756)

User<1054831578>: https://github.com/ton-blockchain/ton/releases (reply to 25726)

Rahul: What is the alternate testnet explorer? https://testnet.tonscan.org seems to be down due to https://testnet.toncenter.com/

Step: testnet.tonapi.io (reply to 25759)

User<6247944943>: hi seems https://testnet.explorer.tonnft.tools/nft is down.

Andrey: testnet.dton.io 🙂 (reply to 25759)

Step: is there any js/ts port of pytonlib available?

User<1054831578>: okay but nobody appeared to explain. and why u asked for that? (reply to 25727)

User<1054831578>: @ton-core/ton at GitHub (reply to 25763)

User<6247944943>: if I set a forward_fee with 0.015 TON, is that too high? Since it's dynamic changed rioght

Step: no i mean something which uses libtonlib.so (reply to 25765)

User<1054831578>: @labraburn/node-tonlib (reply to 25767)

User<1054831578>: in @tactlang its reading from income. but you may want to check https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc (reply to 25766)

User<6247944943>: Where you got this info on tact (reply to 25769)

&rey: You don't set forward fee by yourself, it's rewritten by validators while your contract is sending message. (reply to 25766)

ＡλＩ: Hi In this tutorial why the author used body_hash & not the actual unique hash to verify the transaction? the hash is accessible from the blockchain while the body_hash is not. Why we should check the transaction with body_hash instead of hash? Should I store both of them on my database?  Ok I think that was a mistake from the author, storing only body_hash makes no sense.

màtín: ✋ hi I have been serching for full source code of NFT Collection that contains func and front-end? do you have any source?

Howard: hi, anyone want to answer this question about set_code in FunC?   https://answers.ton.org/question/1550688752387493888/how-can-set-code-be-implemented-or-used-in-func   If you can give more example or insights about this will be also helpful!

User<5906393387>: Hey! How to make smart contract pay for itself when it receives internal message?

&rey: accept_message() (reply to 25783)

Андрей: Is ton really "environmentally friendly"?

‍ ‌‌‌‌ ‌‌‌‌ ‌Amir.: ton is good coin but with cheaters as support. 1285 usdt bsc peg has been sent by mistake to ton bsc peg contract address. They not resonding my emails and i bot chat they first told that contract address not belong them and then told belong them but can not access . an finally they told they can not help because it is my mistake .0x228c5d8bcd272bcb3e430fcc91fcaf3efe83bd5cfd0e6f63ef2e846a0fd43c70     please help me for revert that transactoin

Saratonin: Hi! I would like to know the contract source code of TON coin on binance peg. How can I get access to that? (The contract code itself)

Humeyra: Hi there,  Im trying to  deploy my  contract in Ton network,  but iam  struggling  with error "Error: no healthy nodes for v2-testnet" ,  i  dont know  if the problem  from me or from the network. if any one can helpe me . Thank you  in advance.

‍ ‌‌‌‌ ‌‌‌‌ ‌Amir.: think nobody to response

fesal | Patara 🐢: Does TVM support parallel execution?

Spite: A great tutorial that takes a detailed look at wallets from the point of view of the TON blockchain, creating transactions and working with them without pre-cooked library methods, as well as getting acquainted with many details of the blockchain. It should be very useful for those who start their journey in TON.  The tutorial is now completely ready, but there was no full-fledged review, so it's still in the Draft state.  Any critique would be helpful: https://github.com/ton-community/ton-docs/pull/209 Sources: https://github.com/aSpite/wallet-tutorial

User<6098419128>: oh ok cool well are you in York Pennsylvania USA or not really

— 2023-03-27 —

Rahul: Great article. This is something useful resource for people are starting on TON. (reply to 25799)

jssjjf: Great source thanks 😊 (reply to 25799)

Daniil: No (reply to 25795)

Daniil: Why do you need it btw?

fesal | Patara 🐢: Asking because i am preparing a cohort video series for TON (reply to 25806)

fesal | Patara 🐢: Thank you for your answer 🐱 (reply to 25806)

Howard: Tact is easy to learn and deploy contracts. Check this out: https://github.com/howardpen9/nft-standard-in-ton (reply to 25786)

Austin: Please I have a question

Austin: Can you receive toncoin under Ethereum (Erc20) on to keeper?

Austin: Tonkeeper

Andrew: you need to use the bridge (reply to 25813)

Austin: Okay thanks

Saratonin: Hi! I would like to know the contract source code of TON coin on binance peg. How can I get access to that? (The contract code itself)

‍ ‌‌‌‌ ‌‌‌‌ ‌Amir.: You should not only see their beautiful words. I only request to study the source code of bsc peg ton contract and they are not ready to provide it.

Calvin | Impossible: hey, wanted to ask if it is possible to generate the same public key for both testnet and mainnet?

Calvin | Impossible: it seems like the wallets that are generated on mainnet and testnet are different from the same seed phrase

Andrew: yes (reply to 25819)

Howard: maybe @Gusarich can help to confirm with this 🙏 (reply to 25819)

Andrew: the wallet contract version might be different (reply to 25820)

Daniil: Why do you think so? (reply to 25820)

Calvin | Impossible: I am currently using tonkeeper

‍ ‌‌‌‌ ‌‌‌‌ ‌Amir.: 1285 usdt bsc peg coin has been sent to ton coin bsc peg ton contract by mistake. they told me that they have not access to revert contract . i asked them to release sourse code of that contract address bot no answer from them.  a asked the comunity to help me to see source code or revert the transaction You should not only see their beautiful words. I only request to study the source code of bsc peg ton contract and they are not ready to provide it.

Daniil: Did you import the same seed phrase or clicked "create new wallet"? (reply to 25825)

Calvin | Impossible: the wallet which is labeled as v4R2 is not the same for me in my tonkeeper (reply to 25824)

Calvin | Impossible: v4r2 on mainnet is E<something for me> v4r2 on testnnet is k<differentpubkey>

Calvin | Impossible: this is true for all 4 of my active addresses I have in this wallet

Daniil: Ah, it's just a flag for user-friendly form of address (reply to 25829)

Calvin | Impossible: I do have a recovery phrase inside the tonkeeper

Daniil: You can try checking these addresses here: https://ton.org/address/

Calvin | Impossible: no but my point being that the two pub keys are not the same for me (reply to 25831)

Daniil: How did you know that (reply to 25834)

Calvin | Impossible: i am checking by switching between testnet and mainnet

Calvin | Impossible: like the 4 addresses I have attached to this seed are not the same 4 addresses

Calvin | Impossible: expected behavior is: E<abcdefg> k<abcdefg>

Calvin | Impossible: for mainnet vs. testnnet

Calvin | Impossible: but i do not have the same public keys when i check different networks

Calvin | Impossible: the abcdefg is not the same

Daniil: Can you share these addresses please?

Calvin | Impossible: oh i see (reply to 25827)

Calvin | Impossible: so it looks like the seed i have in tonkeeper for the two different networks is different

Calvin | Impossible: i think that's the reason 👍

Calvin | Impossible: thanks Daniil for the help on this!

Daniil: Probably tonkeeper generates it this way (reply to 25844)

Calvin | Impossible: yeah seems weird but probably safe/better to have separate seed phrases here (reply to 25847)

&rey: Different subwallet_id. (reply to 25820)

User<5908372443>: .

User<5908372443>: I am the owner of my group and I get unwanted reports from new members what can i do I got tired

Daniil: Wrong chat for such questions (reply to 25851)

User<5908372443>: what I did not understand (reply to 25852)

Daniil: Your question isn't related to ton development at all. (reply to 25853)

User<5908372443>: I know, well, I had a question, I don't know what to do? (reply to 25854)

Howard: is this API from TonCenter for checking the exit code message?

Steve: You better use sandbox or something like this to check possible outcome

Howard: Try to use in production and set different notifications tab for the users.   （if they failed or out of balance in wallet (reply to 25857)

Андрей: I can add/remove/modify files from bag?

Saratonin: I would like to know the contract source code of TON coin on binance peg. How can I get access to that? (The contract code itself)   Is there anyone providing people with information here? Is this a support group? I was directed here from the community chat.

Dario: https://github.com/ton-blockchain/bridge-solidity/tree/master/contracts (reply to 25861)

Oğuzhan: my counter.fc contract has #include "imports/stdlib.fc"; code on line 1 but i am getting this error counter.fc:1:1: error: Cannot find source file `imports/stdlib.fc

Oleg: you should put https://raw.githubusercontent.com/ton-community/blueprint/aa9d045e359e7f23ea69708fdd12478628d39851/example/contracts/imports/stdlib.fc to folder imports (reply to 25864)

Oleg: and then try to compile again

Oğuzhan: earlier i putted in import folder (reply to 25865)

Oleg: can you pls provide tree of folders and command which ur trying to execute (reply to 25867)

Oleg: npx blueprint run ?

Oğuzhan: and i trying use compileFunc() function on typescript project

Oğuzhan: ts-node project.ts

leo: Hey guys! How to parse the returned boc from the sendTransaction method in the @tonconnect/sdk library?

— 2023-03-28 —

TON Answers Bot (not AI): Besides of `Merkle Proof`, what is other example we can store in BOCs (Cells)? from Howard   There are a few we haven't cover in docs.  *0x01: PrunnedBranch *0x02: Library 0x03: MerkleProof *0x04: MerkleUpdate *     - Source: https://docs.ton.org/develop/data-formats/cell-boc#merkle-proof  🔗 Answer on TON Overflow

Howard: spam attack (reply to 25877)

TON Answers Bot (not AI): How is '(slice -> int) cast_to_S2I(cont c) asm "NOP";' works? from Howard  hi all, I am trying to read more example in FunC:  since the template for payment channel here has these two lines I can't figure out - how it works - why we need it here    (slice -> int) cast_to_S2I(cont c) asm "NOP"; ;; (slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16"; ;; builder store_coins(builder b, int x) asm "STVARINT16"; forall X, Y, Z -> tuple t_triple(X x, Y y, Z z) asm "TRIPLE";  https://github.com/ton-blockchain/payment-channels/blob/e605580c3fb1feb22d80be9a0cddfcd05671c347/func/async-channel.func#L30   Can anyone answer this? and explaind those 2 for?  🔗 Answer on TON Overflow

순범: Hi guys, I have some question about tonconnect. To request multiple transactions, I made code like this. It works well in web environment, but rarely works in mobile environment (telegram web app) I tried it with three phones and only one works. I don’t know difference between them

Cooop: Hi guys! We released our Beta games: @Whalegames_bot  Would like to hear thoughts for improvements 👀

순범: In the other two phones, they move to tonkeeper but not showing the transaction request

User<6247944943>: do you have testnet version (reply to 25888)

Cooop: Nope :/ (reply to 25890)

Jake: failed to asynchronously prepare wasm: CompileError: WebAssembly.instantiate(): Compiling function #406 failed: Invalid opcode (enable with --experimental-wasm-threads) @+113464 Aborted(CompileError: WebAssembly.instantiate(): Compiling function #406 failed: Invalid opcode (enable with --experimental-wasm-threads) @+113464)  <- can someone help me with this error

Jake: trying to run the func compile .fn to the .cell

Max: what's your node version (reply to 25892)

Jake: 16.19.1

Max: what's the library you're trying to use?

Jake: im just trying to run the counter tutorial contract to my testnet account (reply to 25896)

Jake: npx func-js stdlib.fc counter.fc --boc counter.cell <- guessing thats standard

Max: do you mind trying it on node version 18?

Jake: yup yup. let me just update (reply to 25899)

Jake: ok that did allow me to compile. but the tutorial .fn is producing alot of undefined functions

Jake: counter.fc:4:12: error: undefined function get_data, defining a global function of unknown type     var ds = get_data().begin_parse();              ^ counter.fc:4:22: error: undefined function .begin_parse, defining a global function of unknown type     var ds = get_data().begin_parse();                        ^ counter.fc:9:3: error: undefined function set_data, defining a global function of unknown type     set_data(begin_cell()     ^ counter.fc:9:12: error: undefined function begin_cell, defining a global function of unknown type     set_data(begin_cell()              ^ counter.fc:11:5: error: undefined function .end_cell, defining a global function of unknown type       .end_cell());       ^ counter.fc:17:18: error: undefined function .slice_empty?, defining a global function of unknown type     if (in_msg_body.slice_empty?()) {

veer: Account sale in Fragment is not happening, does anyone have a solution? ￼

veer: Username??

Jake: nevermind, forgot to include lib in cli, thank you for your help (reply to 25902)

Daniil: wrong chat for such questions, but anyway: just read what does this alert says. (reply to 25906)

Murat: Bune

Jake: Hey, there i had issue with the qr scan on the webapp tutorial. Any ideas could help. :) tried both tonkeeper and tonhub

Jake: https://ton-community.github.io/tutorials/03-client/  part 5

— 2023-03-29 —

Андрей: This is ton dev chat, not ai startup marketplace.

Howard: any project is like https://web3auth.io?

Rahul: I am doing research on it. How we can we use existing web3auth and can create web wallet on top of it for TON. (reply to 25914)

Gajesh: what is an ton-core alternative for SmartContract in ton-contract-executor?

Step: can anybody explain what is the use of this https://github.com/ton-blockchain/ton/blob/master/dht-server ?

TON Answers Bot (not AI): Alternative for `Smart Contract` from `ton-contract-executor` from Gajesh Naik  what is an ton-core alternative for SmartContract in ton-contract-executor?  for example: let contract = await SmartContract.fromCell(code.cell, data)    🔗 Answer on TON Overflow

Rahchaar: TON Contests Bot: Incorrect TON Wallet repo link entered!  Send the link to your TON Wallet repo: Help

TON Answers Bot (not AI): Этой мой заголовок для теста from D2D4  Этой мой вопрос для теста  🔗 Answer on TON Overflow

TON Answers Bot (not AI): It's just a title to check how main page works. from D2D4  It's just a description of question to check how order works.  🔗 Answer on TON Overflow

Delta: what's Ton wallet should I use on iOS?

Howard: that would be great if you already has this feature. (reply to 25915)

User<6215628577>: Good job

Dan: Tonkeeper, TonHub (reply to 25926)

Dan: Hi Guys! We are currently testing Compete2Earn project on TON. Who want to try an alpha version, please dm

User<6247944943>: How much data can we store in a Cell? For example, in the contract from getgems.io, it stores a state_int_hash with 256 bits.  Then it puts it in a store_slice. Why does it put .store_uint(4, 3).store_slice(dest_address) together in the same line?   Is it because it's trying to keep the data size in the same slots?

Spite: A new informative tutorial has appeared in the TON documentation. It is ideal for new users who are just getting started with TON, as it includes the following:  • Detailed analysis of wallet smart contracts • Working with internal and external transactions • Instructions for building transactions from scratch • A complete guide to working with high-load wallets • Many nuances of the TON blockchain, which are rarely disclosed or disclosed in a form that is difficult for a beginner and, at the same time, give a strong boost to learning  Also, here you can find code examples in two programming languages - JavaScript and Golang. Each example in the new chapter is provided as independent code that you can run immediately.  Separate repository for all examples: https://github.com/aSpite/wallet-tutorial Tutorial: https://docs.ton.org/develop/smart-contracts/tutorials/wallet  Open to criticism, which will lead to an improvement in the quality of the material

Артём: Hello everyone  TON have a python SDK maybe?

Maksim: github.com/tonfactory/tonsdk (reply to 25935)

Maksim: or https://github.com/devdaoteam/tonsdk

Артём: Nice one, thank you 🙂 (reply to 25936)

Rahul: We have build this open source tool (TON web IDE - Nujan) for our dev community.  Those who think we were fair participants with complete transparency.  This is your tool. Please support us through community voting.   These votes will count in as judgment points :-   DoraHack profile - https://dorahacks.io/buidl/4473  You can vote here -- https://ton.vote/  Team Nujan

HuaDong: Can the sol language build ton smart contracts?

Rahul: No. Only func and Tact language is supported which is developed  for TON. (reply to 25944)

HuaDong: Can I add you as a friend and chat privately?

Tim: It even works 👍 (reply to 25942)

Dario: literally the best project of the contest imho (reply to 25942)

Артём: Can i write you in DM? (reply to 25936)

Maksim: yes (reply to 25949)

talkol: https://ton.vote is hosted on Github Pages and there's currently an outage on Github Pages - https://www.githubstatus.com/  We changed hosting to Netlify: https://ton-vote.netlify.app  You can use it to vote until Github Pages fixes the issue

talkol: I'm following the vote closely and currently the deployed rule is 1 token 1 vote. I think that in this case (where we divide prize money), this is unfair and open to whale manipulation. I have submitted a request to TF to change the tallying mode to 1 wallet 1 vote. I think this is much more fair and will not allow whales to sway the entire vote. The vote is locked on a historic snapshot, so people cannot divide their wallets today to smaller wallets to manipulate.

màtín: hello guys Do you know open source nft games(web3 game) or nft collection project? I want to practice and more familiar with func and tonweb

Justin: Let's go ahead with change to 1 wallet 1 vote. (reply to 25952)

Pablo: If I have a conditional startup,  Can i raise a simple smart contract for the distribution of tokens ..   and then when the distribution is over   Hire a developer with the money raised and implement all the complex usability interactions I need in terms of tokenomics in the new smart contract?   And exchange old tokens from a simple smart contract for new 1to1 as if nothing had happened

talkol: Github Pages is still out. We gave up waiting for them to fix and moved https://ton.vote to host from Netlify. I aplologize for the downtime, ton.vote is now working as before.

Nikita: Hello how to store null address to cell in func?

Steve: check tact or ton-core sources, i think it is two zero bits

Nikita: begin_cell() .store_uint(0, 2)  ;; from_address, addr_none$00 .end_cell();

Amin: begin_cell().store_uint(0, 2).end_cell() or more optimized, if you need the slice slice zero_address() asm "b{00} PUSHSLICE"; (reply to 25959)

Nikita: Thanks!

Jake: If anyone can help me here. Trying to finish the smart contract tutorial so i can move to contract and telegram bot development (reply to 25909)

— 2023-03-30 —

màtín: how can I get nft balance of an address?

Jake: You'll need to pull the cell of the address of each (reply to 25968)

Jake: There might be an api system for getgems somewhere

Jake: I love the structure. But the cell need parse to read fully

màtín: Is it free to read it? (reply to 25969)

màtín: need gas fee?

Jake: Everything is open source info here (reply to 25972)

Jake: All transfers require gas in ton (reply to 25973)

Jake: But data pull is not a transfer... remember to use testnet.

màtín: thank you

Jake: @testgiver_ton_bot for test ton (reply to 25977)

Jake: https://docs.ton.org/develop/onboarding-challenge

A: How to edit metadata? The announcement was made more than a year ago for the collections. How about collection items?  https://mobile.twitter.com/getgemsdotio/status/1584534031978201089

Shashank: Support 🙏🙏🔥🔥🙏🙏 (reply to 25942)

Clément | omniscia.io: Hi everyone! Who should I contact for an audit proposal at TON? Thanks 🙂

màtín: are functions with method_id type free ? (reply to 25976)

Vlad: 🚀 TON Fam! We're in Hack-a-TONx's Top 10! 🎉  🤖 @EvaaProtocol, TON's 1st lending protocol, built at @hackatonx DoraHacks!  🏁 Help us to win 110k for funding launch on the mainnet!  💪 Support EVAA on ton.vote & enjoy perks for EVAA voters: 🎁 Airdrop & sale whitelist 🤝 Private chat 🌟 Unique features  🔧 Test v1 app: app.evaa.finance or @EvaaAppBot  🔥 Go to TON.Vote & spread TON DeFi Love! 💙

Maks: Our team, re:doubt, have prepared a dashboards to see voting results with some vis in our open-source tool - TONalytica:  First version of counting: https://tonalytica.redoubt.online/public/dashboards/O4D1XKsZLdl3yqwv3l6j8aXSYtBe3GtRgGUN6Hgv?org_slug=default  Second version of counting: https://tonalytica.redoubt.online/public/dashboards/ixaMpmMJ8jgbRm04x54tHqUlZBhzK6RT7ZznyNtK?org_slug=default   🔥 Go to TON.Vote (alternatively to: https://one-wallet-one-vote.netlify.app/ ) & spread TON DeFi Love! 💙

User<2080539747>: https://toncenter.com/api/index/getTransactionByHash?tx_hash=AxlCQ8KcISeAskh4LcN7YB/uzfEg73SiDrYTpysBOdg=&include_msg_body=false Which field represents success？

User<2080539747>: https://ton.cx/tx/36395991000003:l3QAOOC+vMvUwAugMt1jl/F2clwJRLZsnrhlCVtto9c=:EQBX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7sxi

Mike: hey! Can I use tonweb-mnemonic package to manage multiple key pairs with a single mnemonic using a derivation path?  So for example would this work? mnemonicToSeed(mnemonic, `m/44'/607'/${index}’/0’/0’`)  I see mnemonicToSeed has a password parameter. Is that the derivation path?

User<6110186685>: Give 1 TON

Saeed: Hello, can anyone tell me what the problem is? returned non-zero exit status 7

Saeed: please,I was stuck for two days

Nikita: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 25991)

Saeed: Returned non-zero exit status 7 (reply to 25993)

Saeed: I think everything is related to lite-client or testnet.json

Shashank: This is the last time appeal from the TON community, all those who think we participated fairly and solving the most imp problems I.e. easy onboarding of developers on TON which is the most essential right bow.  Like many others, we don't have a community right now. So, you are our community. 😇😇  Please vote for us and support us - 🙏🙏🙏🙏   http://ton.vote  We will build a marketplace in the future on a TON. So that the developers can earn too while building on TON.   🔥🔥🔥🔥  We don't know about the final result but the overwhelming we got from the community is itself an award for us. We make at least 10 project partners with the community members.  🖖🖖  Please support us if you still have a chance. 🙏🙏🙏🙏  Thank you  Team Nujan  Shashank

Samyar: is there a way to write an app to buy telegram premium using ton ? or it's exclusive to fragment platform

User<6247944943>: ❤️

Jake: The only cost is during a transfer of some sort. Pulling data is not a transfer (reply to 25983)

User<6110186685>: What do you need to earn TON basics?

talkol: After reviewing the results and the strong effect of a couple of large accounts on the result, TF accepted my suggestion to switch to one wallet one vote. The changes will soon be reflected in ton.vote

Steve: Nice

Tim: I think giving user 5 choices out of 10 it too much, because of that differences between top and bottom results are very small (reply to 26002)

talkol: Agree, but I don’t think we can change that now (reply to 26004)

Tim: yeah, just for future

talkol: Definitely! We learned so much from this vote. Quite a ride!

Makar: I think it's better filter some voters like that https://tonscan.org/address/EQCgzJo5xJAyJyLwaS2RI23864hW0ZKAWLoIcpWf9S-rl6yU  With sponsor like that) https://tonscan.org/address/EQC7ilFJrgJTK-JBQEngWbeZR0Zvu-xfm3MmdghHVAFy28OF#transactions (reply to 26002)

talkol: It looks like this account is new, the balances are taken from a day before the vote started so these votes are filtered out

talkol: Some people brought to my attention another manipulation attempt. To address it, I suggested to TF that we filter out every voter with balance lower than 0.25 TON.  Apparently somebody had old bot wallets with some dust in them and used all of them to vote.

J (notsick): will tehre be an airdrop for ton?

talkol: TF approved filtering wallets lower than 0.25 TON from the vote. This will be reflected soon in ton.vote. This changed slightly but not enough to alter who won.

talkol: Almost 100 votes were removed due to this

Makar: these had more than 0.25 https://tonscan.org/address/EQB22mGoYrPenwbLCZZiK2IfsGmjNutGPGoIarpGRE_Equ2K#transactions (reply to 26017)

talkol: The ones I sampled had 0.01 balanxe

Makar: it's wrong... sorry (reply to 26020)

— 2023-03-31 —

Bob: Hello Admin! Is there any public node with unlimited speed that can be used?  https://ton.app/explorers https://ton.sh/

12: I found a bug in Tonhub. How can I report it?

Dan: getblock.io (unlimited but you have to pay) (reply to 26024)

Step: may be here https://github.com/tonwhales/wallet/issues (reply to 26026)

Bob: Hello! @DanKamilov  I'm Eden from HOTBIT, we have other questions to consult, can you help us (reply to 26027)

Dan: I am not from getblock team. I am from Stepogram.com team. But if you have some common questions you can write in dm (reply to 26029)

Bob: Ok, Thanks!

Ali: Hi, I just joined this group. Can someone explain what this group is about?

talkol: Due to requests, I wrote a new introductory post that defines lots of the terminology we use like “smart contract” and “gas”. It also has a very simple definition of “what is blockchain”:  https://blog.ton.org/what_is_blockchain

Alexander: Hi everyone! I'm about to make a tg bot what will be able to allow users to pay ton to other users for some service on a smart contract base - the payer should approve that service is provisioned and service provider will receive ton on a wallet. Could anyone recommend me any existing solutions or libraries to make that happen? Maybe there's built-in capabilities of TON payments for tg bots? Sorry for silly question, I feel I'm bit out of context

Andrew: is your bot written in js? (reply to 26034)

Alexander: I'm about to make it on kotlin around the java lib, but now I'm playing with bots on hello world level and research capabilities, so, the tech scope can be changed (reply to 26035)

Andrew: I think you're trying to implement what @pcrafter did with his ratelance

Alexander: Yeah, seems like it's very similar, just another domain model around the payment itself

Alexander: Is there some platform or api that I can re-use?

Joey: What's wrong with it?

User<6247944943>: ohohoho?

عُبّوِدِيْ 350𝒌 | ✨🇮🇶: Peace be upon you, I have a toon wallet, and I accidentally logged out of it, and I forgot its character codes. Can I retrieve the wallet?

Igor: You need the seed phrase to recover your wallet. (reply to 26047)

عُبّوِدِيْ 350𝒌 | ✨🇮🇶: How do you mean? (reply to 26048)

Igor: The 24 words that were shown to you during the creation process. (reply to 26049)

عُبّوِدِيْ 350𝒌 | ✨🇮🇶: Yesterday I formatted my iPhone and all the pictures are gone along with the pictures of the letters (reply to 26050)

&rey: Don't you have a cloud backup? Without those "letters", you can't restore the wallet. Blockchain doesn't know you — it states "coins belong to anyone who has the mnemonic words". (reply to 26052)

عُبّوِدِيْ 350𝒌 | ✨🇮🇶: I did not make an icloud backup on the iPhone and all the photos were deleted yesterday 😔😔 (reply to 26053)

عُبّوِدِيْ 350𝒌 | ✨🇮🇶: I know the access code to the wallet, and I know the identifiers and numbers inside it, so does this suffice, or do I need the letters to enter the platform (reply to 26053)

Daniil: Without these words you can't recover the wallet. (reply to 26055)

&rey: Access code is only used for mnemonic words encryption (so that they aren't stored in cleartext in phone's memory). By identifiers, do you mean wallet address? (reply to 26055)

&rey: Sorry for your coins, then. If you remember at least some of the words, write them down — maybe they could help you in future. However, now restoring access to wallet is equivalent to mining. (reply to 26054)

عُبّوِدِيْ 350𝒌 | ✨🇮🇶: All right, thank you (reply to 26058)

— 2023-04-01 —

màtín: can we use TonConnect in react js app?

Andrew: yes (reply to 26063)

User<6247944943>: ❤️❤️❤️

màtín: Have TonAPI testnet?

Andrew: testnet.tonapi.io (reply to 26066)

Andrew: but indexer can be down sometimes

Nikita: https://testnet.tonapi.io (reply to 26066)

Nikita: https://testnet.toncenter.com (reply to 26066)

màtín: Thank you @nKuznetsov5

Andrey: BTW you can also have a look into https://testnet.dton.io/graphql/  https://docs.dton.io/dton/find-needed-account (reply to 26071)

Howard: oh man! I didn't know you have docs for APIs. Nice!!!! (reply to 26072)

Andrey: Thanks for the nice words. Unfortunately it's not full-covered yet. We hope to add more information soon 🙂 (reply to 26073)

1435: Anybody tell me how to use ton for transactions

User<6247944943>: This si not dev question (reply to 26077)

— 2023-04-02 —

Nik: has anybody built ton wallet for ios succesfully?  i have these errors:  ERROR: /private/var/tmp/_bazel_root/a0de8830bdf69a4315204412fa99b0b5/external/local_config_cc/BUILD:48:19: in cc_toolchain_suite rule @local_config_cc//:toolchain: cc_toolchain_suite '@local_config_cc//:toolchain' does not contain a toolchain for cpu 'ios_arm64' ERROR: Analysis of target '//Wallet:Wallet' failed; build aborted: Analysis of target '@local_config_cc//:toolchain' failed

Дмитрий: Guys, what do I need to install to work with funC and fift? I downloaded the plugin in WebStorm, what else will I need?

2988: Правдо что можно купить ононим за 4 TON?

User<5692723515>: Can someone please explain how often rewards are paid out to the validators? I noticed that the smart contract for the validators mentioned "3 validator sets". What is considered a validator set?

Jake: https://ton-community.github.io/tutorials/02-contract/ (reply to 26085)

Jake: I recommend node.v18 at least

Дмитрий: Thank you very much! (reply to 26088)

— 2023-04-03 —

Bodrul: What is a ton network

Step: When an external message contains more than one internal message All the internal message processed by same validator or distributed to other validators?

Daniil: External messages doesn't necessarily create internal messages. But if they do, they're sent by a single validator. And these sent internal messages can be processed by other validators (reply to 26094)

Samyar: Hello friends We've developed a TON-based competitive challenge. We need some volunteers as our early adaptors to test everything. If you have Tonkeeper or tonhub wallet and willing to participate in this test and have some fun please DM me so I can send you the links of the test group and also the link of the Bot.

Howard: test the product? (reply to 26098)

User<6247944943>: looks great. (reply to 26098)

Samyar: Yes we need some volunteers to test it  It's a quiz game, and each player needs needs 0.01 ton to join (reply to 26099)

Mike: Hello! Could any body help, I need to parse ton contract's events, what lib is better to use for TypeScript? Thanks

Salandra: ✋ (reply to 26098)

Samyar: Please dm me (reply to 26103)

Roman: ⭐️ Attention TON developers! The TON Documentation just received an update that you won't want to miss! 🤩  🔍 Say goodbye to the days of endless searching and say hello to the new TVM instructions search feature! With the ability to search using opcodes or Fift methods, you'll be able to find what you need with ease! 🤖  A massive shoutout to @krau5 for development and @thekiba for validating this release and ensuring it's top-notch! 🙌  Don't wait any longer, check out our updated TVM search:  👉 https://docs.ton.org/learn/tvm-instructions/instructions#quick-search

Behrang: Awesome 👍  Just wanted to ask for a feature to search by stack input and output, and notices that it already supports it. (reply to 26107)

— 2023-04-04 —

محمد: Hi, I am an Iranian using Telegram how to use the free domain

Hartmann D.: Hi! This is a tech chat. It should be better to ask your question here - @toncoin_fa_chat (reply to 26115)

User<2080539747>: use  tonweb

&rey: You need to invoke method on jetton root. (reply to 26117)

Howard: Jetton Wallet is the wallet address own by you, and represent your balance for "this jetton token".  Each Jetton token you get will generate different jetton wallet, and all managed by youself. (reply to 26117)

Howard: 中文 in here https://t.me/tondev_zh (reply to 26117)

User<2080539747>: 谢谢 (reply to 26120)

Christophe: Hello, how can we know which version of contract a wallet is using? coming from another chain and testing the wallets options on ton.org/en/wallets it's quite confusing that same seed dont give same address depending of which wallet you use 🤗

Howard: you can check with it in any block explorer sir ton.cx tonscan.org https://testnet.dton.io/ (reply to 26126)

Christophe: Yes but let's say i installed tonkeeper and it give me a v4 address and i want also use a desktop wallet with the same account, how i know which one use v4? i tried mytonwallet in chrome but give me different address

Howard: Basically, you can export your mnemonics from TonKeeper and then replicate the same address in any client-side application or wallet.

Howard: different in mytonwallet? Should be a place you can set.   Sorry, I don't use MyTonwallet tho (reply to 26129)

Christophe: Ok thank you, i will keep digging into it :)

Mike: hello  How can I get the status of a transaction using tonweb?  getTransactions(address) returns the most recent transactions to/from an address, but the response doesn’t contain whether or not a tx was actually successful

John: is it possible to use HD wallets to create ton wallets with https://github.com/paulmillr/scure-bip32 to create wallets from derivation paths: root.derive(`m/44'/607’/0’/0/0`) root.derive(`m/44'/607’/0’/0/1`)

Steve: yes, but they would be compatible with ledger/safepal only

John: yep i noticed that different wallets create different addresses from the same mnemonic atomicwallet !== safepal

Christophe: I noticed that in mytonwallet i get the same address for testnet and mainnet but with js lib using WalletContractV4, printing address with testOnly: true/false it give me different addresses, is there something specific to do to use same addresses on both network?

Howard: That is a parameters help you generate the type of address in Test-net.   More specifically, EQ.... prefix are the addresses in Mainnet, flip side are prefix with kQ.....

Howard: can take reference here: https://github.com/ton-community/tutorials/blob/77818adadc279ed9c69b178b3c8525dc50071b49/01-wallet/test/tonweb/step7.ts#L18  and here https://ton-community.github.io/tutorials/01-wallet/ (reply to 26140)

Mike: How can I get the exit_code of a transaction in Javascript using the tx hash?

Christophe: Ok thank you, what confused me is mytonwallet give me the same ecq address in mainnet and testnet. (reply to 26141)

Alex: @f_closer, could you help with the following question?  We were trying to make the indexer read specific blocks, and specified the earliest and latest blocks for it to read And the earliest block that we specified was 28492058, but the indexer still started reading from an old block that the node doesn't have (24018323), and crashed. Why does this happen?  Here are the actual settings we used:  TON_INDEXER_START_SEQNO=28492058 TON_INDEXER_BOTTOM_SEQNO=28471088  And here's the error we get:  Masterchain block 28492432 failed to index interfaces. Exception of type BlockNotFound occured: LITE_SERVER_NOTREADY: cannot load proof for (-1,8000000000000000,24018323):A5284F1E083A3834D1E1F6BCE99989D6CD5F41154BBE632A525583EB40F59B1D:770864907DD52D5584AF819182E1F69DBABC4A4EDA3636440A80F5B98F65579F : not in db(during last block synchronization)

F: It would be better to ask this question on github. Maybe there is some bug. https://github.com/toncenter/ton-indexer/issues (reply to 26147)

Ruslan: This problem may cause, if init_block section in global-config.json contains old block. To solve this you need to update config file. (reply to 26147)

TON Answers Bot (not AI): Перевод Тон в Метамаск from No Name  Что мне делать? Если у меня случилась проблема, связанная с тем, что когда я захотел перевести тон в метамаск вёл количество и адрес, то меня попросили установить метамаск, хотя он у меня установлен.  🔗 Answer on TON Overflow

— 2023-04-05 —

changmyeong: Admin, send_raw_message will work asynchronus? How can I rollback if send_raw_message is failed?

changmyeong: I'm worried that the message sent with send_raw_message will work as a separate transaction.

changmyeong: What if the state is changed during rollback, making it impossible to rollback? (reply to 26154)

&rey: If *sending message* fails, transaction will have no effect. If *processing previously sent message* fails, there will be a bounce message, and you have to process it to rollback contract state. (reply to 26153)

&rey: It will always be new transaction. Due to sharding, no transaction can involve more than one contract. So, each transaction is either tick-tock (for fundamental contracts) or processing of a single external message. (reply to 26154)

Frisco: Anyone here who is interested in discussing the recent TON network upgrade with  tontelegraph.com? Kindly DM. Thanks.

màtín: Uncaught (in promise) Error: [TON_CONNECT_SDK_ERROR] h0: Request to the wallet contains errors. In @tonconnect I get this error when I connect tonkeeper, Do you have any guid?

🏸: Hi , Which programming language does the open network blockchain support?

Andrew: FunC & Fift (reply to 26166)

Howard: Tact is more easy to learn btw ❤️ (reply to 26166)

Vintagex: any guide to build a workchain?

&rey: Currently, TON has no custom workchains, and creating new ones isn't going to be done soon. (reply to 26169)

Howard: Hi guys, I wanted to follow up on this question about Oracle: https://answers.ton.org/question/1534642599359418368/what-does-the-trust-in-oracles-rely-on-in-ton.   I don't think we have a project specifically designed to solve the oracle price issue, do we?

User<6089685064>: https://tonlink.xyz  github.com/ton-link (reply to 26174)

User<6089685064>: We already got 3 grants from TON Foundation (reply to 26175)

Howard: DM you (reply to 26176)

User<6099320140>: wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh su root -c 'bash install.sh -m full'

Pavel: Hello, is it 100% safe to send funds to uninitialized / inactive wallet?

Pavel: As far as I understood, the only risk to lock funds later is to deploy an invalid smart contract to that address (reply to 26182)

— 2023-04-06 —

TON Answers Bot (not AI): Should we be concerned about Memory usage when we code in FunC or Tact? from Howard  In the Solidity programming language on the EVM, we need to be mindful of gas usage for each line of code.  For now, the difference in gas cost in TON is still not that significant.  My question is whether we have any memory limitations in the TVM?      🔗 Answer on TON Overflow

&rey: You will be unable to do so, as address is determined as hash of initial code and data. (reply to 26183)

TON Answers Bot (not AI): What is the reason for different workchains to use account identifiers that are shorter or longer than the "standard" 256 bits used in the masterchain? from Howard  What is the reason for different workchains to use account identifiers that may be shorter or longer than the standard 256 bits used in the masterchain?   2.1.1. Account addresses. The source address and destination address are always present in any message. Normally, they are (full) account addresses. A full account address consists of a workchain_id (a signed 32-bit big-endian integer defining a workchain), followed by a (usually) 256-bit internal address or account identifier account_id (which may also be interpreted as an un- signed big-endian integer) defining the account within the chosen workchain.   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to use storage provider? from Anon  Hello! I'm trying to upload file to storage, using storage provider, but I can't understand, what to do with a file generated with command of the storage-daemon-cli new-contract-message <BagID> <file> --query-id 0 --provider <address> Can someone explain how should I use this file for message body?  🔗 Answer on TON Overflow

Mina: 🤚

🩵: Hi all! This is Sarah from TF. TON Foundation has a position we’d like to open call for.   ⚙️ Job Title: Technical Support Manager ⚙️  We are seeking a highly skilled Technical Support Specialist to join TON team to support the integration of TON Blockchain in chat for our potential partners (SaaS, exchanges, node providers, games, etc).  DM @sc_sy88 if you have extensive knowledge and experience with TON Blockchain (FunC/TACT/both!).  Responsibilities: - Provide technical support to potential partners who are integrating TON Blockchain in chats - Monitor and respond to support requests in a timely manner, ensuring that all inquiries are resolved within 12 hours - Troubleshoot and resolve any technical issues related to the integration of TON Blockchain - Work closely with the development team to identify and resolve any technical issues - Provide guidance and advice to potential partners on best practices for integrating TON Blockchain in chat  Requirements: - Extensive knowledge and experience working with TON Blockchain - Strong technical and problem-solving skills - Excellent communication and customer service skills - Strong attention to detail - Experience providing technical support to customers or clients is a plus   👨‍💻Type of job: Full-time (40h per week) 💰: to be discussed after interview rounds

Jimmy: Is there other channels to see non-tech positions for the TON foundation? (reply to 26192)

🩵: Hello Joshua! You may refer to our jobs page  https://jobs.ton.org/jobs

vsnation 🟣: Hello everyone!  I'm Viacheslav(the founder), we were working long time to provide Play to Earn game - The Old Castle Defense on 🪙 TON chain and we made it. Thanks everyone for the support! Check our game - https://theoldcastle.xyz/ Our whitepaper - https://docs.theoldcastle.xyz/  We have our first community round in live https://theoldcastle.xyz/#/game/3 and total treasury pool reached 🪙40 TON(~$100).  I'm not asking to participate, I'm asking to open url, check what we done, read our documentation and decide.   Our philosophy is to airdrop 50% of total NFTs to our active community.

Daniil: /report (reply to 26202)

Inga: Hi everyone! We are newbies in TON ecosystem and to discover it we've started from Hack-a-TON with Diesel Attack game. Play (web only): https://play.dieselattack.com/  Github: https://github.com/ceo777/diesel-attack-ton-nft  But the main idea is to build web3 marketing toolkit for community engagement. Maybe some suggestions or recommendations? (channels, events, meeting etc) It will help us a lot!

User<6247944943>: Is there the multi-sig wallet standard code in FunC?

Alex: https://github.com/ton-blockchain/multisig-contract  here - https://github.com/ton-blockchain/multisig-contract/blob/master/multisig-code.fc (reply to 26208)

User<6247944943>: Yes. I read this, but is the FunC file plus the fif file import required? I can't compile the multisig-code.fc separately. (reply to 26209)

TON Answers Bot (not AI): Why the `recv_internal` / `recv_external` are the same here in payment-channels example here? from Howard  For example, if you examine the code in detail here: https://github.com/ton-blockchain/payment-channels/blob/e605580c3fb1feb22d80be9a0cddfcd05671c347/func/async-channel.func#L583  You will see that the code is the same for both external and internal receive functions:  () recv_internal (int contract_balance, int _, cell _, slice in_msg) {   return recv_any(contract_balance, in_msg); }  () recv_external (int contract_balance, int _, cell _, slice in_msg) {   ;; Note that only cooperative_close and cooperative_commit   ;; will be accepted   return recv_any(contract_balance, in_msg); }   My question is: What is the difference between these functions in FunC, and why does it occur?  🔗 Answer on TON Overflow

Alex: Did you read this? Maybe helpful for your issue. (reply to 26210)

Alex: I also checked few month ago this version of tutorial for native multisig contract - it worked for me.

Daniil: Errors look like you forgot to include stdlib (reply to 26211)

Arsen: Hi guys.     Are there any documentation how to   1) Create Wallet  2) Deploy wallet  3) Create Transaction  4) Sign Transaction  5) Send transaction   Using ton-kotlin libraary by Andrey Pfau ?

User<6247944943>: stdlib looks into a lot of details. What is the process for defining it? (reply to 26216)

Coalus: #include "stdlib.fc"  Stdlib.fc(link) (reply to 26219)

User<6247944943>: Yes, it works. I mean, who defines the primitives and grammar syntax of the stdlib.fc?

Daniil: It's defined in file itself (reply to 26221)

Howard: Kotlin? I can't answer this. (reply to 26217)

Yuri: Hey guys, just found the cli here, not the storage-daemon itself: https://github.com/ton-blockchain/ton/releases/tag/v2023.03

TON Answers Bot (not AI): How to compile the fift file in general? from Howard  Since I am looking into the multisig project in detail, how can I use the command line in GitHub (https://github.com/akifoq/multisig) using the following command:  fift -s <script-name> <args>.   Can you provide some general guidance on this?"   🔗 Answer on TON Overflow

Crypto: Hello everybody! I'm trying to upload file to storage, using storage provider, but I can't understand, what to do with a file generated with command of the storage-daemon-cli  new-contract-message <BagID> <file> --query-id 0 --provider <address>  The documentation says to send a message with this file as the body. But I can’t understand how to convert file contents to the message body.  Can someone explain how should I use this file for message body?

Arsen: Ideal case - Java  Kotlin is almoat ideal too.   Worst case it can be node js too. Thaks @howard_peng (reply to 26223)

— 2023-04-07 —

PifBetter: Is the only way to activate the wallet to make a deposit on CEX?

datboi: you can activate the wallet by making any transaction (reply to 26241)

User<5356271823>: Hello everyone

PifBetter: Thanks. Then, What is easiest making transaction? 😅 (reply to 26242)

User<1054831578>: gm everybody! wanna to demonstrate our very early TON Price Native Sticker prototype project. It is not ready for public but really works, it needs to be optimized for mass-usage and before be published there will be added group-chat mode and inline mode to use in any dialogs. We looking for any possible funding (any donates). If U r interested or want to check it real or any — please DM me I'll show. Thanks for reading. have a nice day.

User<6247944943>: anyone know the error like this from getgems.io? didn't have this before

John: Who knows why after transfer with sendMode: 128 + 32 described in this example https://github.com/toncenter/examples/blob/main/deposits-multi-wallet.js It just keep withdrawing this deposit wallet without new calls of transfer.send()

Howard: https://docs.ton.org/develop/func/stdlib/#send_raw_message   maybe can take reference here (reply to 26252)

Traffy ⚜️: I'm planning to develop an app on the TON chain. Is there any benefit provided to developers by the TON team?

Andrew: https://ton.org/en/grants (reply to 26254)

Howard: for the telegram number, do we have testnet version to mint?  - https://fragment.com/ - https://testnet.getgems.io/collection/EQAkbtP0GVVU_9thj0dJLwRCzSop4UoUWG03xdIy7CuUOmfH - https://github.com/TelegramMessenger/telemint

Andrew: https://t.me/TelemintTestnetBot (reply to 26256)

Andrew: not official

datboi: 📣 Announcing Tonindexer  We're thrilled to introduce Tonindexer, an open-source indexing and analytics tool for The Open Network. Our current release includes core functionalities such as indexing historic account states, transactions and messages; and support for NFT, Jettons and Telemint (Fragment) standard smart-contracts. With our easy-to-use JSON API, you can already access explorer functionality and some blockchain statistics and metrics.  Our future plans involve creating a flexible system for defining smart-contract interfaces that will enable seamless integration of both open-source contracts and custom contracts developed by others. We will also focus on usability improvements, such as a flexible configuration system, optimized scanning process, partial blockchain scans and a GraphQL API.  We aim to make Tonindexer a widely adopted tool for developers and data analysts who need to collect TON data without building their own database or debugging block scanners and contract parsers.  We are eager to collect feedback from developers to help shape the future of Tonindexer. Your input will be invaluable as we work towards achieving our goals and making Tonindexer a comprehensive and user-friendly tool.  Join us and contribute to Tonindexer, as we work together to make TON blockchain data more accessible for everyone! Check out our website or GitHub repository to get started. (forwarded from anton.tools)

Howard: cool (reply to 26259)

datboi: Any feedback on this project is really valuable, any reviews and any criticism, any tests! We would be really glad if you at least start it up or do some API testing. Or you can support the project by giving it a star on GitHub 🙂 (reply to 26259)

Step: do you not have explorer like tonapi.io ? (reply to 26261)

datboi: unfortunately, tonapi have no analytical functionality (reply to 26262)

datboi: and you cannot make an API for your own contracts there

Step: hmm

Step: just asking if you have built any explorer using tonindexer?

Step: currently tonapi does not show all transactions and does not show in right order.

datboi: do you mean UI? at the moment, no, just an API

Step: yes UI (reply to 26268)

datboi: but you can query transactions here: anton.tools/api/v0/swagger

datboi: right now, it does not have full blockchain data, just the latest 4-5 months

datboi: well it is a kind of UI 🙂 but without cool design and frontend (reply to 26270)

Step: if my wallet receive transaction and confirmed, within a second if i query your api , the data will  be available? or it has delay? (reply to 26272)

datboi: yep, it will be available

datboi: and examples of using it here: https://github.com/tonindexer/anton/blob/main/docs/API.md (reply to 26270)

datboi: but unfortunately, it’s not guaranteed right now, the API is more like PoC right now (reply to 26274)

datboi: on the other hand, it is stable for a few weeks

Step: what is the endpoint to fetch all nft of an account?

Step: with ability to filter by collection address? (reply to 26278)

datboi: for a given example, here is a query:  https://anton.tools/api/v0/accounts?latest=true&interface=nft_item&owner_address=EQDYo6otRICNYyM2SAcS1mzTUvm1dsN5LCteE7DjeYfKgA4C&minter_address=EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N&order=DESC&limit=10  onwer — …KgA4C collection — telegram numbers

Step: for me it shows total 744

Step: value is accurate?

Step: in fragment.com it shows 675

Step: looks like bug?

datboi: after connecting wallet? (reply to 26283)

Step: yea (reply to 26285)

datboi: maybe you have some items on auctions?

datboi: cause even after starting auction, you are still the owner of nft

Step: 🤔

Step: yes  may be 5 but the count is still incorrect (reply to 26289)

datboi: yep, getgems shows the same number. I do not know, where is the bug, so thank you for the feedback, I will check it out (reply to 26287)

Howard: where you got this API? (reply to 26280)

datboi: well… i made it

Steve: i suppose you are disassembling get methods list?

datboi: well yeah, firstly we disasm get-methods hashes, then match them to the known contracts (reply to 26296)

datboi: after the match with a known contract, we try to parse messages going from and to those contracts

Steve: How hard would it be to support? https://docs.tact-lang.org/evolution/OTP-001 https://docs.tact-lang.org/evolution/OTP-002

TECH-WORLDINFO: Hello

Coalus: /report (reply to 26308)

Senior Research Officer: about first link: IFAIK it was already implemented but moved to experimental lib: https://github.com/ton-community/ton-experimental/blob/main/src/interfaces/parseSupportedMessage.ts I've used this in mine custom SMC analyzer and successfully implemented indexing of parsed known ifaces data not only base64 cell as every ton-indexer doing. this is very important info for end-user but I thinks it is APP LEVEL LOGIC and APP DEV should decide how to use. What is this question about and do tact need such functionality personally me not sure 'cause Is I see it's database-cache-watcher stuff.. (reply to 26303)

Steve: I was talking about indexer

Senior Research Officer: sorry seems I didn't get the point)) nevermind

— 2023-04-08 —

Dais: hi everyone

Dais: guys how i can buy TON by fiat?

Howard: not dev related but I think you can use @CryptoBot / @wallet if you are in certain area tho.  Or major Crypto Exchange you can find on CoinMarketcap (reply to 26321)

Dais: Thank you

Andrew: https://ton.org/buy-toncoin (reply to 26321)

Dais: I wanna buy it by ngn

Dais: How can ı do ıt?

Andrew: ask in @toncoin_chat please (reply to 26326)

Dais: Thanks

changmyeong: What is the byte size of a smart contract that can be deployed on TON?

Daniil: Almost unlimited. But note that you'll need to pay for the storage. (reply to 26332)

changmyeong: I see. however, There are limited if need to store code in cells for shard. right? (reply to 26333)

Daniil: What do you mean? (reply to 26334)

changmyeong: Token contracts are deloyed to each user's wallet for shard. To do this, we need to store the wallet contract in our code (using a cell). (reply to 26335)

Daniil: Yes, and what's the problem with that? (reply to 26336)

changmyeong: No problem. just want to know for sure. thanks! (reply to 26337)

Ssi: Hi! Is there a way to obtain data (e.g. shards and txs) of a certain block? I saw the only getMasterchainInfo (here https://docs.ton.org/develop/network/adnl-tcp#getmasterchaininfo) which returns the last block only though (if I'm getting it right)?

— 2023-04-09 —

User<689845327>: Hi all, I have 2 tasks: 1. Use Telegram bot to display user’s TON-NFT. 2. Use Telegram bot to sign a contract or a string then return this result.  For the task 2, I want to allow other users to use their wallet(e.g. TON-Keeper or TON Telegram Wallet) instead of building a wallet on my bot.  How to start these 2 tasks?  I’m a designer, and these are what I conducted.  - I built a web app with Vue to connect wallet. (So i know @tonconnect/ui, but don’t know how to user @tonconnect/SDK or react) - I built a bot with python-telegram-bot. (So i know the fundamental telegram bot and how to run it on other server.)  Based on my limited knowledge, please share more details. Thanks.

aaa: Hi, all , Does the ton address support tag form, similar to xrp with a tag to identify the specified user ？

Howard: https://answers.ton.org/question/1555820646674468864/what-is-the-byte-size-of-a-smart-contract-that-can-be-deployed-on-ton/write (reply to 26334)

datboi: i’ve found the bug and fixed it already, thank you for the report. the problem was in total results count, when used with owner address: it also counted items you owned previously. (reply to 26291)

Step: UI is required for explorer then everybody will start using anton tool.  tonapi sites goes down very frequently these days and does not report all transactions.  i think many people looking for tonapi alternative like me. (reply to 26349)

doni: https://github.com/xssnick/tonutils-go/tree/master/example (reply to 26339)

doni: If you prefer to use JS you can also use npm lite-client .

doni: these are raw API that use ADNL

Howard: Share with you guys that you can use online IDE tho: https://answers.ton.org/question/1534299702986543104/is-there-an-ethereum-remix-alternative-in-the-ton-ecosystem#write-post

User<689845327>: If I want to send a request to a wallet for a transaction, I can use the following format to prompt a TON wallet to transfer tokens to a specific address: “ton://transfer/TON_ADDRESS”  However, using "transfer" means that my users have to pay a transaction fee. Instead, I only want to verify the user's identity by having them sign a specific string and then recovering their address from the signed message. Is there a way to prompt a wallet to sign a string without initiating a transfer, just for the purpose of address verification? (reply to 26344)

Oleg: Hello. Does tonlib (C++) support wallets V4? I see WalletV3InitialState only. And when I call 'guessAccounts' I get V3 wallets only.

Andrew: tonhub uses only v4 (reply to 26365)

Seitaro: TON Awards ceremony will be held online in text format in this chat at 15:00 UTC (in three hours).  Closer to this event, the posting will be slowed down.  See you soon!

Daniil: 👀

changmyeong: Why? (reply to 26371)

Andrey: It's infinity-shardralized (reply to 26371)

Desert: c'est la vie))) (reply to 26374)

User<6089685064>: Sharding != decentralisation (reply to 26373)

Andrey: Could you elaborate how it's connected to decentralization? (reply to 26374)

Daniil: That's democracy (reply to 26374)

CAT — TON Validator, Apps and News: Decentralized blocked. (reply to 26374)

Step: Who is getting ton awards today?

Nick: Ton

NDA: 🌚🌚🌚

User<6089685064>: Moreover, Toncoin staked is that small, that even TON Foundation can take >2/3 of the all network. So, he is right, that TON is not that decentralized. (reply to 26376)

Ιωαναθάν: We want this group to be open minded

Andrey: Looks like chat gpt. Also, AFAIR (not sure, will do my own research) TON moved from proof of work to proof of stake, so it only makes sense that validators are in charge.

User<6089685064>: TON never had a POW consensus. (reply to 26390)

Tolya: https://www.youtube.com/watch?v=EB9e7EhLQqo  Turn on background

Andrey: Then why the term "miners"? (reply to 26391)

User<6089685064>: Basically, that’s a wrong term. (reply to 26393)

Brave: 15 02 utc, where my money?

Seitaro: TON Awards 2022  In 2022 TON Ecosystem has continues an explosive growth started in 2021. Dozens of teams started their commercial and non-commercial projects, created and shared tools and know-hows.  Community grew so big that it became impossible to track all peoples and all projects. Some projects could fall out of sight and did not receive the well-deserved support and promotion.  That is why, in this year we decided to conduct TON Awards: to highlight and encourage the coolest projects in the industry.   In 2022, ecosystem growth outpaced the creation of tools for new projects endorse, but today we have caught up and strongly recommend that new projects to participate in TON Footsteps, TON Grants, TVL Incentivization program, Support for community projects as well as hackatons and dedicated challenges. With this tools we believe funding is much more predictable and transparent, and the need for post factum promotion of research projects will disappear.  Meanwhile, today we honor the daredevils who stepped headlong into the unknown, and relying only on their own strength, laid the foundations of the TON revolution.  Fair rewarding is a difficult task. Our decision was based on the following criteria:  • pioneering: to do something that no one has done before you and there are no examples is incredibly difficult, but our winners did it  • complexity and volume of work: in the end, diligence rules in the long run  • the breadth of the circle of users for whom the project solves the problem  • leveling out: some projects have already received funding in one way or another and we encourage projects that support programs have not reached before  • non-commerciality: some projects are built to generate income while others, for instance libraries, being very important are hard to be made a product. Thus the latter need more support.  Note, that in TON Award announcements below "Total Awards" is a sum of all support received from TON Foundation in one or another form (including today's reward).  #tonawards2022

Tolya: https://www.youtube.com/watch?v=VM-2OVNt-eQ

Artem: What projects are we talking about? TF does not communicate with new projects (reply to 26396)

Daniil: https://github.com/ton-blockchain/ton-awards-2022 (reply to 26399)

Tolya: ton-kotlin  Kotlin/Multiplatform SDK for The Open Network.  This is a development by Andrey Pfau before he was invited to the TON core team.  Award: 20 000 TON (~$44 800)  #tonawards2022

Seitaro: ton3.js & ton-adnl  TON Blockchain low-level API implementation written in TypeScript. ADNL protocol TypeScript implementation for Node.js and Browser context.  Today's Award: 10 000 TON.  10 000 TON was sent earlier in 2022.  Total Award: 20 000 TON (~$44 800)  #tonawards2022

Tolya: tonutils-go  Library for work with TON in Golang, focused to be user-friendly, performant and functional in the same time.  Implemented interraction with blockchain and all major TON network protocols, such as: ADNL (TCP+UDP), RLDP, DHT, DNS, RLDP-HTTP, Proxy.  Today's Award: 10 000 TON.  10 000 TON was sent earlier in 2022.  Total Award: 20 000 TON (~$44 800)  #tonawards2022

qpwethinks //: Thanks for your work @xssnik 🚀 (reply to 26404)

Seitaro: TON Proxy Client & TON Reverse Proxy  Cross-playform user-friendly proxy software, implemented natively in Golang, that allows to access TON Sites with end2end encryption without specific knowledge, just run and click 1 button.  Award: 5000 TON (~$11 200)  #tonawards2022

Brave: 👍 (reply to 26404)

Tolya: More from Oleg Baranov:  Documentation with examples about TON internals and protocols: BoC, Merkle Proofs, ADNL (TCP+UDP), DHT, RLDP and other protocols.  Usefull, especially for those who wants to develop their own libraries or low level products in TON.  Will be translated and added to docs.ton.org.  #tonawards2022

Tolya: Bonus Award  Oleg studied the TON at the lowest level (for example, the implementation of transport protocols or cell Merkle proofs) and created a number of working products.  Oleg Baranov won our hearts and received 17 000 TON (~$38 080) from the personal funds of one of the members of the TON core team.  #tonawards2022

qpwethinks //: 👏🏼 (reply to 26409)

Seitaro: Multisig dApp  dApp to interact with Multi-Signature wallets on TON.  Award: 550 TON (~$1232) was sent earlier in 2022.  #tonawards2022

Tolya: WebDeployer  Simple web page for deploying contracts quickly with QR codes.  Award: 100 TON (~$224)  #tonawards2022

NDA: spoiler

Slava: Congratulations! @Gusarich @Miandic_n (reply to 26411)

Doctor Delpy: 🤓

Seitaro: OpenMask browser extension  MetaMask analog, a Browser Extension Wallet with features: Multi-accounts, Multi-network, NFT, Jettons, DNS, dApp auth, Proxy, TC 2.0, Biometric authentication, Developers Documentation.  Award: 4481 TON (~$10 000) was sent earlier in 2022.  #tonawards2022

Tolya: Open Contracts & WTON  A collection of open source, standalone FunC contracts/snippets for the TON blockchain.  First Wrapped TONCOIN Jetton in TON Network.  Award: 1500 TON (~$3360)  Subsequently, we ordered the development of a jetton-stablecoin FunC smart contract from Dario.  #tonawards2022

Seitaro: ton4j  Java/Multiplatform libraries for interacting with TON blockchain. The strong side of the library is the examples of almost all use cases.  Made by a member of the TON core team.  #tonawards2022

Dan: By the way, where is Tact? 🤔

Tolya: MyLocalTon  Multiplatform wrapper of TON validator. Java GUI application allows user to run up to 7 validators locally on his PC. Contains blocks', transactions' and messages' explorer with the search engine. Creation of various wallets, ton nodes with a single click. Visual representation of TON elections.  Made by a member of the TON core team.  #tonawards2022

Seitaro: TON Domains Bot  Will help you win the auction and become the owner of the TON domain without sitting up all night bidding. Also the first user-friendly interface for TON DNS in Telegram.  Award: 2000 TON (~$4480)  #tonawards2022

Tolya: Python TON Connect library  A script that implements TON Connect (v1) in Python.  Award: 200 TON (~$448)  #tonawards2022

Seitaro: re:doubt  A powerful tool for TON blockchain research, complete with all the tools you need to discover, explore, and visualize vast amounts of blockchain data. <Dune Analytics for TON>  Award: 5000 USD was sent earlier in 2022.  #tonawards2022

Tolya: Port of TON Tools to adJ  adJ is a distribution of the secure operating system OpenBSD.  Award: 200 TON (~$448)  #tonawards2022

Coalus: broken link (reply to 26429)

Seitaro: XTON browser extentension  TON crypto wallet browser extension.  Award: 1000 TON (~$2240)  #tonawards2022

Dario: Missed this project, happy to see that *bsd is used nowadays (reply to 26429)

Tolya: Ton inspector  Ton inspector is a js code that contains useful functions to proceed ton payments.  Award: 100 TON (~$224)  #tonawards2022

Seitaro: JUSTON iOS wallet  Features: multi-accounts, mainnet & testnet support, TON DNS support (browser & wallet routing), dApp Authentication, TON Proxy, Biometric Authentication.  Award: 6000 TON (~$13 440)  Special thanks for the very first .ton sites support in the dapp browser.  #tonawards2022

Tolya: from HUETON LLC (reply to 26434)

Tolya: Definitely decentralized warriors

Tolya: SwiftyTON  Written with new Swift concurrency manner around Objective-C wrapper that wraps C++ tonlib API.  Award: 2000 TON (~$4480)  #tonawards2022

Marlee: Does Ton foundation wants to develop there own smart contract ? (reply to 26420)

Seitaro: MyTonWallet  The most feature-rich web wallet and browser extension for TON Network – with support of multi-accounts, tokens (jettons), NFT, TON DNS, TON Sites, TON Proxy, and TON Magic.  Award: 4500 TON (~$10 000)  #tonawards2022

Steve: Never forget:  https://habr.com/ru/articles/727278/

Seitaro: We are fully endorse efforts of TON DeFi leaders to build common implementation. (reply to 26439)

Yang: My favorite wallet (reply to 26441)

Tolya: Best HR departament in the world (reply to 26441)

Tolya: TON Minter by Orbs  An open-source tool to launch jettons on the TON network.  #tonawards2022

Tolya: TON Verifier by Orbs  An open-source application to publish verified source code for on-chain contracts on the TON chain.  #tonawards2022

Tolya: TON Access by Orbs  A decentralized RPC provider created specifically for TON dapps making HTTP queries to blockchain state from the browser.  #tonawards2022

Doctor Delpy: And my❤️❤️ (reply to 26444)

Tolya: single-nominator by Orbs  A new TON smart contract that enables secure validation for TON blockchain via an air gapped cold wallet.  #tonawards2022

Tolya: Orbs   Orbs Network are our great friends!   Tal Kol the co-founder of Orbs is one of the TON evangelists.  A number of important open source TON products have been developed by Orbs team in the past year.  minter.ton.org -  a useful dapp for creating jetton in one click was hosted on ton.org.  verifier.ton.org - the contract verification system was also hosted on ton.org and integrated into the tonscan.org and tonapi.io explorers.  Single-nominator smart contract will be reviewed by core team and added to the mytonctrl.  And quite recently, the TON Access was launched, placing some TON lite server on the Orbs Network nodes.  We hope you find our bonus helpful.  Total Award: 25 000 TON (~$56 000)  #tonawards2022

Seitaro: ton-contract-executor  Library that enables TVM execution in JavaScript environment, this allows to run contract's locally and allows to write test's for them.  Award: 5000 TON (~$11 200)  #tonawards2022

Steve: impossibly important tool

Tolya: Blueprint  A development environment for writing, testing, and deploying TON smart contracts.  This award accounts that Sandbox and Blueprint development was funded through TonTech department.  Award: 3000 TON (~$6720)  #tonawards2022

User<6089685064>: My favourite one. (reply to 26454)

Seitaro: Sandbox  JS library to locally emulate arbitrary TON smart contracts and whole transaction chains.  This award accounts that Sandbox and Blueprint development was funded through TonTech department.  Award: 4000 TON (~$9000)  #tonawards2022

Marlee: I sent you a PM (reply to 26443)

Victor: Love it 🤩 (reply to 26454)

Tolya: Rift  Rift allows developers to develop, test and deploy TON contracts with pure Python.  Award: $22,000 was sent earlier in 2022.  #tonawards2022

Andrew: isn't blueprint built in 2023? (reply to 26454)

Seitaro: TONHouse  TON Network monitor.  Award: 3000 TON (~$6720) was sent earlier in 2022.  #tonawards2022

Tolya: Tonscan+ browser extension  Google Chrome extension dedicated to providing a better user experience on tonscan.org. Users can add custom names to TON adresses locally as well as contribute to user-driven adress database.  Award: 200 TON (~$448)  #tonawards2022

Tokmach: wow👏 (reply to 26457)

Seitaro: Tact  Development of a new alternative programming language for TON smart contracts.  Award: 17 000 TON (~$38 000)  #tonawards2022

Yang: Tact is here

Tolya: ton.js  TON typescript libraries.  Award: 20 000 TON (~$44 800)  #tonawards2022

Seitaro: Tonhub wallet  Mobile wallet for iOS and Android.  Award: 6000 TON (~$13 440)  #tonawards2022

Tolya: NFT contract in Tact  Please keep in mind that we have not tested this smart contract for full compatibility with the NFT standard.  Award: 200 TON (~$448)  #tonawards2022

Seitaro: Scaleton jetton wallet dapp  The very first jetton wallet dapp.  Today's Award: 500 TON.  250 TON was sent earlier in 2022.  Total Award: 750 TON (~$1680)  #tonawards2022

Tolya: Bicycle  Microservice for payment processing (TONs and Jettons) in TON blockchain.  Award: 10 000 TON (~$22400) was sent earlier in 2022 from Anatoly and Kirill  #tonawards2022

Seitaro: TonTools  High-level OOP Python library for work with TON; create, deploy and scan wallets; Scan NFT Collections, Items, Sale contracts; Scan Jettons, Jetton Wallets; Transfer Tons, Jettons, NFTs and so on.  Award: 2000 TON (~$4480)  #tonawards2022

Tolya: Personal award by Anatoly Makosov  $100 000 from my own funds to the tonscan.org team.   Source code https://github.com/catchain/tonscan.  Many of us use tonscan.org explorer on a daily basis.   It works great, and in my opinion is an example of excellent UI / UX of TON explorer, while tonapi.io excelled significantly in the backend and indexing, and dton.io in statistics and some other features.  It is also worth noting that tonscan team were among the first to implement new TON releases (such as TON DNS or TON Nominators) and are ready to work together on some features.  I wish the tonscan team further develop the service and invent new approaches in blockchain user interfaces.  #tonawards2022

Seitaro: Personal award by Anatoly Makosov and Kirill Emelyanenko  $100 000 from our own funds to the Disintar team.  The well-known team of strong developers, which developed the popular toncli development tool, the ton-k8s tools for running a private TON testnet, the first GraphQL TON API and the dton.io explorer based on it.  We can also mention the disintar.io marketplace which is part of the TON NFT ecosystem.  We hope to see new hardcore developments from them this year.  #tonawards2022

qpwethinks //: 👏🏼 (reply to 26479)

Tolya: 6 submissions did not meet the conditions of TON Awards, we will comment these pull requests in the github.

Tolya: Distributed 301 920 TON (676 300 $).  The Open Network is a community-driven project, each of us contributing to building a more decentralized and freer world.  TON Foundation team is glad to work together with strong developers from all over the world and invite new developers and teams to join this collective work.  #tonawards2022

Shashank: Thank you 🙏  Team Nujan (reply to 26362)

qpwethinks //: A new era for TON has begun. Thank you for the support of community developers ❤️ (reply to 26483)

Tolya: TONs will be sent today to the wallets specified in the projects github repo.  Check that the wallet address is specified in the project repo (README.MD).

Daniil: Thanks to the TON Foundation team for supporting the developers so much!  I believe that in 2023 there will be many times more open-source developments in the TON ecosystem.

User<804363179>: This is exactly how future it society should sound like. (reply to 26483)

Step: is it possible to get v3r2 address from v4r2 address of a wallet?

Mr. John: You can calculate it from public key, as I remember (reply to 26489)

Rouholah: ❤️ ton

Stanislav: Amazingly 🙈 congratulations to all winners 🎉

Vladimir: Sorry. The recent links are https://gitlab.com/pasosdeJesus/adJ/-/tree/main/arboldes/usr/ports/mystuff/net/ton and https://gitlab.com/pasosdeJesus/adJ/-/tree/main/arboldes/usr/ports/mystuff/net/ton-toncli (reply to 26430)

Step: public key available only in get method ? (reply to 26490)

&rey: 1. Get-method; 2. Reading from contract persistent data (depends on wallet version and code); 3. Emulating receiving an external message and checking what key will be used for signature verification. (reply to 26495)

KHUMOYUN: What is ton wallet repo? Who know it

Dmitry | backend4you.ton: Hi, I need help to understand BOC. I'm trying to decode "raw data" from https://tonapi.io/account/EQAiIsvar4OYBn8BGBf9flfin6tl5poBx4MgJe4CQJYasy51  Read data-formats/cell-boc from docs, manually broken hex to bytes (lines 1..8) and cells (10..20). Lines 24-28 are parsed cells shown in explorer (both tonapi and tonscan checked) to compare with.  I can't understand why first (longest) cell has '_' at last position in explorers. This cell must have D5=213 4-bit groups, thats 107 bytes and line afbe...49f5 is 214 chars in length. And trailing '_' is 215's - it seems extra. And source hex data has no any '0' here - after '4915' follows '0102' as links-and-length of next cell. Why that '_' is there?

Max: it has to do with the way bitstrings are serialized in ton bitstrings in ton may contain number of bits that is not divisible by 8 or 4, and when that happens you must add padding like this: append the bit "1" and then as many bits "0" as needed to fill the required length (there may be no "0" bits if only 1 bit was missing to reach length divisibility) when that padding is added, a _ is added to string representation to signify that it was (note that this is only true for this particular format of bitstrings, x{...}; other formats may employ padding always e.g. by appending a 0x80 byte even to strings the length of which is divisible by 8) if there is no _, that means that the 4-bit groups should be treated as is and there is no padding (again, only true for this particular format)

Max: in this case your string ends with 5_, 5 is 0b0101, so your bitstring actually ends with 010 and not with 0101

Max: you can read more about it here https://ton-blockchain.github.io/docs/tvm.pdf section 1.0

Dmitry | backend4you.ton: so '_' in first and second (x{00C_}) cells have different "meaning":  for first cell that has 213 "full" groups (...49F) and incomplete last ('5') the '_' "notifies" me that last digit means incomplete  while in x{00C_} cell length 03 is same as length of '00C' data, and '_' after 'C' is just "placeholder" and does not mean that I should perform "de-padding" of 'C' from 0b1100 to 0x1 ?

User<5990739462>: parttyyÿÿÿÿÿÿÿ

Max: the byte before the data (0x03 in case of the 00c cell) is the d2 descriptor byte, and is equal to ceil(b/8)+floor(b/8), where b is the number of bits in the cell so this cell is padded too, it has 9 bits, which gives ceil(1.125)+floor(1.125)=3 (reply to 26502)

Dmitry | backend4you.ton: hmmm why? cell data are`0103 00c0 03` (in raw hex data). According to https://docs.ton.org/develop/data-formats/cell-boc#cell-serialization: 01 is "5 flag bits and 3 link count bits" (so, only 1 link) 03 must be "the length of the full 4-bit groups" that's exactly length of "00c" one more '0' (after 'c') - I thought it is to align to bytes and 03 is cell ref (reply to 26504)

Max: kind of feels that the doc you provided is wrong...

Max: this is the way it's done in the serializers and if you do the calculations for your other cells it checks out (reply to 26504)

User<5637716200>: Hello

Arsen: Hi guys. Is there any TON related application which gives ability to use passphrase with mnemonic seed ? Why i am asking cause all available libraries give ability to generate seed with passphrase but  not applications like Tonkeeper or Tonhub, don't give ability to add passphrase to mnemonic seed. Does that mean if i develop a wallet at the moment with possibility to generate wallet with seed + passphrase then they won't be able to restore their wallets in Tonkeeper or Tonhub  ?

Steve: Yes

Arsen: thanks for the answer (reply to 26510)

User<5717357750>: Hello my friends

User<6247944943>: can anyone share with me the difference for https://github.com/tonkite/ton3-core  versus the Ton-core SDK we use usually?

User<5637716200>: Hello friends am new for this group  I know to shillings job and reading

— 2023-04-10 —

User<5753422939>: Hik

Vladimir: I received 200TON from tolya.ton. Thanks for the generosity to @tolyayanot  @rulon   Kirill Emelyanenko.  God bless you. (Interesting for me that in christian faith today is remembered the resurrection of Christ and you guys gave this awards today, I rejoice). (reply to 26429)

Vladimir: I see a huge division in Ton Foundation with you guys showing the good, and the organizers of the Hack-a-Ton showing the wrong way by changing the rules of the contest.   Tolya and the transparent guys, keep the good job that will attract developers and users.   I hope the organizers of the Hack-a-Ton will realize and change because they are rejecting developers and users from TON Foundation and TON blockchain with their wrongdoings.  Hope to find some time to write an article about it.

Aqua: Hello everyone, does anyone know where I can read about the new messaging feature through TON wallet?

User<5637716200>: Yes I know

Aqua: can you share the link?

User<5637716200>: Is not for free

Aqua: ahahhaahahh)

User<5637716200>: Yes

User<6247944943>: 🙈 hello (reply to 26513)

Howard: Plus one. I do share some content for implementation for NFT in https://t.me/tactlang   Thanks a lot 🙇 (reply to 26516)

qpwethinks //: Congratz 🥳 (reply to 26530)

𝙹𝚄𝙱𝙰𝚁𝙰𝚉: @tolyayanot Check DM

User<6247944943>: any experts in: - https://railway.app/ - https://render.com/ - https://fly.io/   Which one is best and why?

Aristocrat: Hi , I transfer my nft username to another wallet but not happened yet. Why? Can sb help me?

Aristocrat: What should I do

GoJohnny: It means that "not enough funds". Try to replenish the balance of the NFT smart contract so that there is more than 💎1 (reply to 26534)

Aristocrat: Thanks (reply to 26540)

Dmitry | backend4you.ton: Sorry for off topic, but are any admins of RU https://t.me/tondev here? I had been put to read-only mode yesterday and I don’t understand why.

Shashank: I have a very strange thought in the morning today. Please reply if you all agree to it   Question: Suppose you are an excellent Func developer and don't want to start your own startup but want to work on TON. Is there any way you can find work? and what you think should be the solution.  You can DM me too. 🙏🙏🙏🙏  Thank you  Team Nujan

Coalus: jobs.ton.org (reply to 26559)

Maksim: No funC jobs there and anywhere else ) (reply to 26560)

Shashank: Thank you, John, but these are full-time role, and what if i want it as side gig right now? also, the opportunities are very limited. they are only 12 in total. (reply to 26560)

Coalus: As far as I know, @pcrafter rn working on freelance platform on TON (reply to 26562)

Shashank: oh.. thanks for the insight.

User<5907367767>: If you can‘t get the pen, who will deal with it?

User<5907367767>: May I ask if there is a boss selling currency?

Aqua: https://docs.ton.org/develop/dapps/ton-connect/transactions Is this the only way to communicate through the tone wallet?

Coalus: Yes, smart contract in TON can communicate with each other only with internal messages (reply to 26567)

Howard: 👍🏿👍🏿👍🏿 (reply to 26559)

Howard: I think will have more and more if we keep building (reply to 26561)

Daniil: It's actually not that hard to find a job for FunC devs right now.  Just check this chat sometimes ;) (and @tondev if you speak Russian) (reply to 26561)

User<1418229103>: Can we transferFrom Jettons at contract? How to do this?

Dario: There is no allowance in jettons (reply to 26573)

Shashank: Thank you @Gusarich and @howard_peng , actually, we are developing a marketplace for blockchain developers where they can come and find work on hourly and project bases and the founder can easily access the talent pool.  we will integrate it with our IDE for seamless onboarding and retention. Team Nujan (reply to 26572)

User<1418229103>: So, how can I transfer users' Jettons in at contract? (reply to 26574)

Dario: In FE just call transfer method, the user will sign the transaction and thats it (reply to 26576)

User<1418229103>: For example, swap Jetton A to Jetton B in contract, the user should transfer A in and contract transfer B out, how to implement these at one transaction?

User<1418229103>: The jetton wallet contract would send message to owner address with op::transfer_notification and transfer amount. If owner is contract, the contract could handle this message after receive Jetton. So the invoke chain is: User > Users' JettonWallet.send_tokens -> Receiver JettonWallet.receive_tokens -> Receiver Contract.handle_transfer_notification.  Does the process is correct?

Dario: Using transfer_notification, you can trigger another contract   Check docs.ston.fi (reply to 26578)

User<689845327>: But is it possible to use private key to sign a string without TX? (reply to 26568)

Daniil: Yes. (reply to 26581)

Step: @datboi420 like royalty_factor , royalty_base for nft address, is it possible show seqno for wallet address ?

datboi: yes, it is possible for some wallets, v4r2 for example (reply to 26586)

User<5907367767>: Sellusdt

Step: when can you add that? (reply to 26587)

datboi: do you need it for historic data or only for the new account states? if you do not want me to re-index old states, then it is fast to implement (reply to 26589)

Step: new account state fine

Step: is it better to have separate endpoint? like /getwalletinformation like we have in toncenter ?

datboi: okay got it, in a few days i will update it (reply to 26591)

datboi: i’m trying to keep API minimal and with only generic endpoints. for seq no of wallets, it will be easy to get it from account data field on /accounts endpoint. if you have any useful suggestions for account states filter, let’s implement it (reply to 26592)

Tim: I think best would be to not hardcode anything

Tim: we already have verifier

Tim: you can use get methods list from there

User<5637716200>: /getwalletinformation

User<5637716200>: Good day my people,please can someone tell me about this group please

Mr. John: "ton-core SDK" that you usually use was inspired by that library 😄 they have different API at least (reply to 26513)

User<689845327>: But how to ask wallet to use his private to sign a string? (reply to 26583)

Step: parse first 4 bytes as int? (reply to 26594)

datboi: oh, sorry for the misleading. i meant that seqno will appear in state_data structure of wallets accounts, not data field (reply to 26604)

User<6247944943>: oh nice. Thanks. (reply to 26600)

Steve: 🔪 (reply to 26600)

Seitaro: anyway, everybody knows that tonweb is a standard actually

Steve: tonweb is a java of ton

Mr. John: both were inspired by tonweb (reply to 26608)

&rey: It already works 😊 https://github.com/ProgramCrafter/ratelance/ (reply to 26563)

Daniil: hoping to see the web interface too (reply to 26611)

Coalus: Is there a web version? (reply to 26611)

&rey: Sadly, no. I haven't decided how to integrate it with keyring yet. (reply to 26613)

Amin: 🏴 Introducing Rift's first step-by-step tutorial on TON Blog! 👛🎉  Get ready to dive into a fantastic learning experience with our easy-to-follow tutorial, where we'll create a simple storage contract that can be updated by an admin and used to retrieve information. This is just the beginning of our "Step-by-Step with Rift" series, where we'll explore the fundamental concepts of Rift. 🛠🌟  🔗 Don't miss out! Check it out here.  ✨If you're new to Rift, no worries! 😊 You can learn all about it from our introduction post here. Also, feel free to join our channel to stay updated on all things Rift.  But wait, there's more! 😃 We're putting the finishing touches on Rift's stable release and can't wait to share it with you very soon. We've got big plans for creating a wealth of examples and implementations using Rift, which will expand its standard library and example collection! 📚  💎 Join us on this exciting journey and let's make Rift even better, together! 👛 (forwarded from Skyring)

Y̷A̷M̷I̷: Hi guys, I need some help writing my token on ton.

— 2023-04-11 —

Ssi: yeah, thanx. I've seen that, but it has the same problem. How can one to receive a certain block, not the last one? (reply to 26352)

Howard: how this work? It's a bot that I post / read the job & hiring? (reply to 26611)

&rey: It is standalone desktop application, written in Python. (reply to 26687)

Howard: Is WalletV4 or WalletV3r2 using BIP32, allowing us to use the same mnemonic we have in Ethereum for TON/TVM in theory? (reply to 26490)

doni: you can use the same pk file to create all this different wallets   plus you have another paramter called subwalletId which lets you create multiple wallets of the same version and the same public_key

doni: mnemonic -> pk_file  stateInit(code_hash, storage(public_key, subwallet_id, seqno=0)

Howard: will like to see the aggregation data like in daily / weekly basis. - Daily Active Wallet Address - Daily Transactions .... (reply to 26464)

Nha: https://m3talab.io/reports/ton-telegram-open-network (reply to 26692)

Nha: they actually pull entire txs history to  measure those metrics.

Howard: wow this is looks perfect! Awesome, Thank you. (reply to 26693)

Nha: Thank you for your kind words. We’re working on updating the dashboard in real time.

User<5906393387>: Is dictionary stored in derived cell if there are some items, and stored in current cell if there is no items? Am I correct?

&rey: No items – dict representation is null – bit 0 is stored. Some items – there is bit 1 and ref to hashmap itself. (reply to 26699)

Dmitry | backend4you.ton: Where can I read details about BOC flags, including CRC ?

Max: the best source is probably the source code (reply to 26701)

Dmitry | backend4you.ton: indeed, but sourcecode is usually written according to some spec which is a bit easier to read. but can't find in tvm.pdf :( (reply to 26702)

Max: I'm 99% sure that BOC is not actually standardized (at least, not fully) in any whitepaper and so the implementation that exists is the best reference you can get

Andrey: https://github.com/ton-blockchain/ton/blob/master/crypto/vm/boc.cpp#L485 check out here (reply to 26703)

&rey: Some TON whitepapers. Maybe, that's tblckh.pdf or tvm.pdf. (reply to 26701)

Alex: https://docs.ton.org/develop/data-formats/cell-boc (reply to 26701)

Mr. John: keep in mind, that whitepaper is outdated in some parts

Dmitry | backend4you.ton: Checked earlier, "in our case the flags are all 0" :( (reply to 26707)

Dmitry | backend4you.ton: thank you, I found it makes writer.get_crc32() so last thing is to guess CRC32 "subtype", which is "CRC-32C" according to https://crccalc.com/ and actual data from explorer (reply to 26705)

Mr. John: yes, also bytes are in little endian order (reply to 26711)

Andrey: np (reply to 26711)

Dmitry | backend4you.ton: After 5min searching for this link at docs.ton.org website I switched to github doc repo and found it in a second 😁 , with 4 other PDFs.  Unfortunately, this doc does not says anything about BOC serialization or flags. tblkcj.pdf seems better - it contains "5.3 Serialization of a bag of cells" section. (reply to 26712)

Hi: U

&rey: /report (reply to 26717)

Dvredin: /report (reply to 26717)

mania: 一对一私信

Dvredin: /report  ) (reply to 26720)

亦云: Where is the official API? how can i not find it

Alex: https://docs.ton.org/develop/dapps/apis (reply to 26722)

Dmitry | backend4you.ton: Does anybody have link/address/sample of BOC larger than ~32KB (255Kbits) of data?  Both testnet or mainnet are Ok. This size seems to be BOC size soft-limit to me, but I’m not sure

Seitaro: There are a few contracts in the wild with bigger states: ETH bridge collector ~509KB BSC bridge collector ~460KB Tonwhales staking contract state is ~180KB (reply to 26724)

Inga: Hi! Is there any SDK for fiat payments integration? In development or ready to use

Andrew: if you need on/off-ramp, try mercuryo (reply to 26726)

Inga: Thank you! (reply to 26727)

— 2023-04-12 —

User<689845327>: I built a telegram bot that can  - conduct all features like ton_connect_example_bot  But when I’m blocked by sending a request to ask user sign a string to verify. Does Ton Connect telegram support that? Or simply I didn’t make it with the right API? Or Ton Keeper doesn’t support? (reply to 26581)

Howard: wdym "But when I’m blocked by sending a request to ask user sign a string to verify. " (reply to 26729)

User<689845327>: Thanks for replying 🙌 Sorry. Typo. I want to build a deeplink to ask user to sign a string with private key and Ton Keeper. Not sure how to start.  This is my sign.js:  const { bot } = require('../bot'); const { getConnector } = require('../ton-connect/connector'); const { getUserWalletAddress } = require('../utils/userData');  const config = require('../config');  const handleSignCommand = async (msg) => {  const chatId = msg.chat.id;  const connector = getConnector(chatId);   // Fetch the user's wallet address  const walletAddress = await getUserWalletAddress(chatId);   if (!walletAddress) {   await bot.sendMessage(    chatId,    'Your wallet is not connected. Please connect your wallet first.'   );   return;  }   const dataToSign = '878lkjdadaf.';   // Create a TON Connect deep link for signing  const signRequest = `https://ton-connect.github.io/open-tc?sign=${encodeURIComponent(   dataToSign  )}&address=${walletAddress}&client_id=${   config.clientId  }&manifest=${encodeURIComponent(config.MANIFEST_URL)}&state=${chatId}`;   await bot.sendMessage(chatId, Please sign this data with TON-Keeper:, {   reply_markup: {    inline_keyboard: [     [      {       text: 'Open Wallet',       url: signRequest,      },     ],    ],   },  }); };  module.exports = { handleSignCommand }; (reply to 26731)

S.s.M.: Hello, my name is Said muzamel from Afghanistan, can you guide me in this part

User<1418229103>: how to read block.timestamp or block.height at FunC ?

Max: timestamp is now() (reply to 26734)

User<1418229103>: thank you

Stefano: Good morning, I am writing to you from Italy. He asks if there is anyone who can give me support for a project concerning the application of soulbound tokens in the publishing field. I would like to develop a digital book lending service on Ton.

Saman: Hello everyone

Saman: What is Send the link to your TON Wallet repo:

Saman: I dont undrestand

Sally: Guys we are launching web app and some users faced the issue that given they are in the web app page to show the assets collected to the wallet, when they want to check their assets, the page is blank.

♞♞♞: Hello

Alex: Link to repository with your TON Wallet project. For example, this link for Tonkeeper wallet: https://github.com/tonkeeper/wallet (reply to 26742)

♞♞♞: 各位你们好

Howard: 中文在這兒 https://t.me/tondev_zh (reply to 26747)

Stefano: Does anyone deal with soulbound tokens?

Howard: If you can read in FunC code, then can take reference here: https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/sbt-item.fc (reply to 26750)

qpwe: 👨🏼‍💻 What is a smart contract?  In the new Shorts, we explained how smart contracts work and what they are used for in less than a minute.  I'd appreciate your support and suggestions on how to make it better ❤️  » Link

Stefano: Thank you! I'm not a computer scientist unfortunately and I can't read the code. I need assistance to find out if my idea can be implemented on Ton, i.e. create a book store in which to distribute books not only for sale but also for loan. (reply to 26751)

User<5907367767>: Can the top-up ton currency be refunded because there is no note?

User<689845327>: I found there’s a signData feature in @tonconnectSDK SignDataFeature: {      name: "SignData";  } Defined in packages/protocol/lib/types/index.d.ts:210  But I cannot call signData() successfully just like sendTransaction().  How to use this? (signData)

User<689845327>: The BD at TON Keeper Team responded to me that Ton Keeper doesn’t yet support signing data. (reply to 26758)

TON Answers Bot (not AI): How to sign a string and get the result through @tonconnectSDK? from Jerry Lin  I’m working on signing a string with private key through connecting Ton Keeper. And I’m building this feature on telegram bot. based on demo-telegram-bot   I found there’s a signData feature in @tonconnectSDK SignDataFeature: { name: "SignData"; } Defined in packages/protocol/lib/types/index.d.ts:210   But I cannot call signData() successfully just like sendTransaction().  Is it possible to sign a string through @tonconnectSDK?  Thanks.  🔗 Answer on TON Overflow

Howard: Yes, just read and get more knowledge about CRC32 now.  https://docs.ton.org/develop/data-formats/crc32#overview (reply to 26715)

Howard: I want to confirm whether most of the explorers are unable to decode the forward_payload(or custom_payload) in Jetton at the moment.   For instance, suppose I want JettonWalletA to add a comment prefix "1234 or EEEE" to JettonWalletB (the new owner).  Currently, it seems that ton.cx, dton.io, and tonscan.org do not decode this and show it on the frontend.   Is this correct?

Andrey: we will do it in next update (reply to 26762)

Dario: Yeah no explorer parse it, for now (reply to 26762)

datboi: i guess that is because usually contracts do not have forward payload in messages and explorers skip decoding it to not fail (reply to 26762)

TON Answers Bot (not AI): Storage provider. Error: 1009 from Anon  Hello everyone! I'm trying to send file to storage provider  First I generated file, using storage-daemon-cli. Command like this: new-contract-message <BagID> <file> --query-id 0 --provider <address>   Then trying to send file, using ton-core JS SDK const tempFilePath = './storage/tempFile' // tempFile - file generated by daemon-cli  const payload = await fsPromise.readFile(tempFilePath, {encoding: 'base64'});  const payloadBase64 = Cell.fromBase64(payload)  const messageBody = beginCell()   .storeUint(0x107c49ef, 32)   .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)   .storeSlice(payloadBase64.beginParse())   .endCell();  await provider.internal(via, {   value: "0.5",   body: messageBody });   But then execution smart contract crashes with 1009 error const error::provider_params_changed = 1009;   Smart contract code on GitHub  Can anybody explain how to make right message body?  Thank you all in advance!  🔗 Answer on TON Overflow

Crypto: Guys if someone know what the problem, please write the answer  I can’t understand how to form correct message body (reply to 26766)

TON Answers Bot (not AI): Нода не участвует в цикле, она простаивает или работает как коллатор? from God's Eater  если нода валидатора не участвует в цикле(не хватило средств для участия в выборах) она простаивает или работает как коллатор? В конце года обещают разделить ноды валидаторов и коллаторов в отдельные ноды,коллатора и тоже нужен будет огромный стей toncoin для генерации блоков?  🔗 Answer on TON Overflow

Inga: Hi! Can you suggest any solution for smart contracts analytics? Like Tenderly or Pagoda for other chains

— 2023-04-13 —

datboi: do you need it? i can add functionality to show forward payload BoC in anton.tools for new messages (reply to 26762)

Howard: I think it's necessary, especially for CEXs service that will need that when people deposit or withdraw the Jetton tokens. (reply to 26775)

datboi: CEXs can determine which user deposited jettons by making a separate wallet for each user

Howard: but that is based on WalletV4 address, not jetton wallet right? (reply to 26777)

datboi: well, CEX can have a v4r2 wallet for each user, and this wallet will own jetton wallet, which will send transfer notification to v4r2, when jetton tokens are received (reply to 26778)

datboi: so CEX can only look for transfer notifications to its wallets

Songer: Hello, a got a issue with trying 2 (send_raw_messeage) from 1 function to 1 adrress wallet and 1 adrress contract, it's possible send more of 1 infernal message ? Anyone can help me ?

User<5380295617>: Hello @everyone! We’re find a web developer as a member in a group to dev our new interesting start-up based on The Open Network, who will want  to know more: write to @mirl1xUAE

승재: Hi. I want to call the nominator inside the contract now. I want to use the deposit and withdrawal functions, but I'm not sure what data to put in. Can I get a document shared for people who want to write an application contract using the nominator? And I want to save the deposit information about the user in the control, but when several users say they use this product, is there a general storage method like using Map data type in Solidity? I'd like to ask if I can share some example code links for me if there is.

승재: ah. i use FunC language

Seitaro: Sometimes ton.cx is able to show comment like here https://ton.cx/address/EQASuZSJjY4r1vAoVbDoPYI-EsKW2E41GI4-QWWgiut05U3E but looks like sometimes it doesn't work (reply to 26762)

Alex: I'm not sure I got your issue correctly, but maybe these references will be helpful:  The description and source code of the Nominator contract is placed in its GitHub repository -  https://github.com/ton-blockchain/nominator-pool  MyTonWallet staking UI  implementation - https://github.com/mytonwalletorg/mytonwallet/tree/master/src/components/staking (reply to 26790)

User<1418229103>: why does this BitBuilder overflow?

🏸: Hi guys, can anyone here write smart contract ?  I want to integrate my site with the open network blockchain How should I do it? Is it difficult?  What do I need to do?

User<5734383819>: Hi, everyone)))

User<1418229103>: how to handle this error? (reply to 26794)

Max: addresses are usually 267 bits when serialized, you are storing 3 addresses and 256 more bits of uints which is 1057 bits, while cell bit size limit is 1023, so you need to store some of your stuff in a reference instead (reply to 26797)

User<1418229103>: thx

User<5905339297>: Hlw sir

AK第三方定制号商: @rulon 你好管理员我充值了币没有输入comment怎么办

AK第三方定制号商: @Rulon Hello, administrator, what should I do if I recharged the coin and didn't enter the comment?

AK第三方定制号商: @Rulon Hola, administrador, recargué la moneda y no ingresé el comentario. ¿Qué debo hacer?

AK第三方定制号商: 😭😭

AK第三方定制号商: Will any relevant personnel solve this problem? Please teach me. Thank you very much.

Andrey: You should contact with OKX support (reply to 26803)

AK第三方定制号商: Thank you for your advice. (reply to 26808)

Kloy: Did anyone else get an error msg after the recent upgrade on mytonctrl?  — Configuring incomplete, errors occurred! See also "/usr/bin/ton/CMakeFiles/CMakeOutput.log". See also "/usr/bin/ton/CMakeFiles/CMakeError.log". Upgrade - Error

Kloy: Not sure if it’s a coincidence but now my validator index shows -1 and having trouble joining the election (reply to 26811)

Mark Okhman on TON: Hey Fam ❤️ [Important message]  You’ve probably noticed that I’m not posting much recently.   Long story short - I’ve been to Dubai talking a lot with TON Foundation and other chains.   It’s interesting how we as builders are longing to get a proper governance from above, sometimes it happens, sometimes it doesn’t 🤷‍♂️ this is why crypto is the true democracy.   There is something I really want to  ask you - do your homework right. Study. Figure tokenomics out. Talk to people. Keep in mind - everyone wants to f**k you over. Don’t let it happen Fam! Be smart!  I strongly believe in Telegram. It’s the best messenger, period 🤷‍♂️ Is TON the best crypto currency? Not sure. Is it even crypto? That’s your homework. (forwarded from Mark Okhman on TON)

veer: Plz mujhe koi ton k bare m smjha skta h kya ki yehh kya hai or isme work kesy krte hai

Coalus: will we all die? (reply to 26814)

Mark Okhman on TON: 100%

pemulis: hey all, just starting working on a ton project. at the very beginning of getting familiar w/ the dev environment.  seems like there are two typescript libraries: toncenter/TonWeb and ton-community/ton  the former looks a bit nicer but also has a shit ton of vulnerable dependencies that look really annoying to fix, and the latter looks like it's been depreciated, or at least marked read-only on github.   does anyone have any advice? is there kind of a consensus around which to use?

Howard: Hi, how can we decode the message here we got from TonCenterAPI to convert to exit_code?

Mr. John: Use loadTransaction method I think

Howard: you can use non depreciated one tho (reply to 26818)

Mr. John: From “ton”

pemulis: OK. the tutorial uses the one that *looks* depreciated. You're saying that yes, it really is depricated and I should instead use TonWeb? (reply to 26822)

Andrew: use ton-core (reply to 26818)

Max: latter one has been moved to the ton-core github org (reply to 26818)

Andrey: Why you just not grep this information from dton graphql? (reply to 26819)

Howard: yes, b/c I am using google Script that can't import SDK easily😂 But maybe I will try out deploy my script locally.

pemulis: ok this is hugely helpful tysm (reply to 26826)

Dario: Base64 decode, parse cell at [0], loadUint(32) (reply to 26820)

pemulis: does anyone know how to use https://toncenter.com/api/v2/#/ to get a txn hash?  i'm calling getTransactions on the api linked above, but none of the responses have plain old "hash" fields, transaction N gives you the hash of the n-1 transaction, but not current... which is problematic for grabbing lastest hash

pemulis: using the JS lib https://github.com/orbs-network/ton-access btw

User<6101555747>: hey ever one i am waiting members in my team  to create first on the market project! Who want to know more about this write hom @mirl1xUAE  Vacation which we need: Web Developer NFT artist TON developer    We’re waiting a message from you 24/7! Thank you for attention

Ekaterina: Try like this  https://docs.evercloud.dev/samples/graphql-samples/transactions#get-transaction-info-by-hash  For ton use ton-mainnet.evercloud.dev/your-project-id/graphql endpoint (reply to 26833)

— 2023-04-14 —

doni: Isnt that everscale ? (reply to 26841)

Marcelo: Hi

Oleg: Hey! i'm building a react app and wondering if there is any way to handle error from contract using tonconnect

Howard: Maybe you can get the latest Transaction hash by tracking the Address you sent with? (reply to 26833)

Oleg: or maybe there is way to see status code of transaction using this rest api? do u know? (reply to 26848)

Howard: I believe that TonCenter has an API that can return the result of the data you prepare to send to the smart contract. It works similarly to TonKeeper, where it displays the result of your transaction before submitting it to the blockchain.  You can use the /tryLocateResultTx API, but I have not personally used it before. (reply to 26847)

Oleg: thanks (reply to 26851)

Howard: Once you get the exit code, you can pivot the issued based on the smart contract code to fine out.

Oleg: So, if others encounter the same problem as me, here is the solution: 1. Get the transaction hash from https://testnet.toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get 2. Use this API, somehow not listed in their docs, to get exit codes https://testnet.toncenter.com/api/index/getTransactionByHash?tx_hash=ZexL39jdgYx0YHwEhemtrH2dWpbMEPoj4sWc7Lfdu5g=&include_msg_body=true

Oleg: tonscan uses this api (reply to 26854)

Oleg: is there any way to match wallet address in tonkeeper with the one obtained by tonconnect ui?

Ekaterina: We have TON also (reply to 26843)

User<1418229103>: what is logic OR char in FunC ?

Daniil: | (reply to 26860)

User<1418229103>: thx

Max: be aware that it does not shortcut unlike in many other languages, so if you write a | b and a is true, b will still get evaluated

Max: same with &

Tim: To be fair | is bitwise OR, and behaves similar to other languages, what we miss is ||

User<1418229103>: 👌thank you

Danial: ton://transfer/EQB99S224R7ACO1Mzbo9m_6obEGt6C2tTKu_BJLmXLm3TqeF

Farhad: Why do I sometimes get an "unknown lite server" error when using toncenter web api @slavafomin (reply to 26851)

Farhad: How can I avoid this error? (reply to 26868)

Farhad: It is interesting that the toncenter interface 'try it' also sometimes gets this error.

Slava: @ruslixag (reply to 26868)

Dima: True (reply to 26872)

User<5101913003>: i like your funny words magic people

Kate: Hi everyone, Kate from NOWPayments here - a crypto payment gateway that supports TON and makes it available for businesses to integrate!  Sharing our recent news: https://nowpayments.io/blog/custody-as-a-service-with-ton  Gaming projects, software providers, marketplaces, social media and more can use our solution to create deposit accounts for their players/users where they can deposit $TON, pay with it and send it to each other  Please, let me know if you have any feedback!

pid | ton: Hi all, I have a problem running some commands on Debian GNU/Linux 11 (bullseye) x86_64. When I run the command "fift -V && func -V && lite-client -V", I get an error message saying "Illegal instruction".  I want to know if this is a problem with the operating system or if there is something wrong with my device configuration. Do you have any solutions or suggestions for fixing this issue?

Alex: Hi, where did you get the binaries from? (reply to 26884)

pid | ton: from here sir https://github.com/ton-defi-org/ton-binaries (reply to 26885)

Alex: Please, try official ones https://github.com/ton-blockchain/ton/releases/tag/v2023.04 (reply to 26886)

pid | ton: Thanks alot sir. (reply to 26887)

Crypto: Hello everyone! I faced with a problem with storage provider  I ran it with: ./storage-daemon -v 3 -C testnet-global.config.json -I 127.0.0.1:3333 -p 5555 -D storage-db  Created a bag with: create -d "Description" -- -filename.txt  But when I’m trying to download torrent from another machine, using: add-by-hash <hash> or get <hash>  It can’t see a torrent from another machine  I can’t understand what I’m doing wrong. Can somebody help me with it?

Ian: Hey everyone!   We collaborated with TON Foundation and prepared a manual on how to build a dApp on TON 🤓  It may look very complicated, but we included only essential details. Browse the pics and dive into the process!   We also included some useful links you would need to use while developing an app:  TON Blueprint: https://docs.ton.org/develop/smart-contracts/sdk/javascript Ton Virtual Machine: https://docs.ton.org/learn/tvm-instructions/instructions TON Full Node: https://nownodes.io/nodes/toncoin

— 2023-04-15 —

Che: I need help

Che: I’m new to this

Юрий: Lol (reply to 26901)

Kloy: Who can help with question regarding mytonctrl? The support bot is irresponsive 😞

Alexander: Hello! To regenerate the wallet from the seed-words-list (saved securely) it needs to: - get indexes of each word in special English-words-list - compose those indexes into secret key of the wallet right?

Alex: Please, specify your problem with some details here. Once relative to mytoncrtl persons could answer, they will. (reply to 26908)

&rey: No. As far as I remember, you need to concatenate words with spaces between and take SHA-256 of that. (reply to 26909)

Alexander: words are mnemonics. right? I don't think so. is there any ref.? there is wallet key, sha-256 of that key. then concat key+the hash, then split into 11 bits groups 2^11=2048 (english words) then map each 11-bits groups into the words from that vocabulary. that's how mnemonics generated, and reverse flow is to restore original wallet key. right?

Alexander: it looks like standard BIP-39 english words list used in ton-crypto npm package.

Alexander: but in NFT Hall of TONight game is another english.txt words list...

Alexander: sorry, my bad. the bug was in my code. hex, binary, number math/transforms were not accurate. I fixed it, now it's ok.

User<132183512>: hey, guys!

User<132183512>: I'm looking for a way to call sha256 in story task

User<132183512>: Can you tell how can I  load it?

User<132183512>: oh, looks like I can just import node's crypto

⇝కᎿҿҿł ℛȺ₮⇜: Hi everione, i got question about NFT Hall of TONight game. In discord no one answered for this. Link for english.txt is broken. How to fix this trouble?

— 2023-04-16 —

User<5393474371>: Hello.👋 I am a blockchain developer 🧑‍💻and currently looking for someone who has got outsourcing projects for me. I have 3 years of experience in this field. Please let me know if you are interested.🙏

ㅤ: I have too. (reply to 26921)

Daniil: how much experience do you have in TON? (reply to 26922)

User<132183512>: This is a standard word list from bip39 (reply to 26924)

ㅤ: Link is not working (reply to 26926)

User<132183512>: This is what I mean, you can take it from bip39 github (reply to 26928)

Il Tala: Good morning everybody

Il Tala: Sorry to disturb

Il Tala: I'm tryina to introduce myself into the crypto world but i'm starting from scratch Anybody knows where i can start from? Thanks

User<132183512>: What are your short term goals?  Do you want to start building? Or collecting your crypto portfolio? (reply to 26934)

Il Tala: Not knowing the field at all i'm just tryina own the topic (reply to 26935)

Il Tala: So later i will know what to do with the knowledge

Il Tala: I'm fascinated by everything that is rising lately around crypto

User<5393474371>: Hello, nice to meet you. I have some experience in TON. (reply to 26925)

User<5393474371>: Do you need a TON developer? (reply to 26925)

⇝కᎿҿҿł ℛȺ₮⇜: Hey) i broked my brain in story mode: entropy in task: 278f0c9f473ddca628240ac41bfab9fec90612a929ad2d7b sha256 in task: cfbcfa3acb82419ab6a6456baa45bfde3137bafbf69c726618a552f3e36d4ea3 But when i hashing sha256 is a74110218edff0c24e0baad6ab1bb0d0d62226d0fee0bb0cf35c8ac41157492c in second case same situation. What am I doing wrong?

⇝కᎿҿҿł ℛȺ₮⇜: Explain me plz 👉🏻👈🏻 (reply to 26958)

Daniil: How much experience (reply to 26951)

Asher: https://www.youtube.com/@WikiMar (reply to 26934)

Il Tala: I don't speak russian 😳 (reply to 26975)

Asher: 🥲 (reply to 26976)

Il Tala: 🥺 (reply to 26977)

User<5904208802>: 500@andreypfau (reply to 26367)

Alex: https://blog.ton.org/what-is-blockchain (reply to 26934)

Ian: one of the best articles on this topic tbh, have read several of them and this stands out! (reply to 26981)

Il Tala: Thank!

Il Tala: Gonna hit it as soon as i get home

Lichtkunst🐾: Hello Guys, need some TON Faucet to start with my pooling! Testgiver Bot isnt working. Can you help? Adress is EQDBfl5m7h_GXA2nhOmQ8ioNb1TYunVUYcw_xG4BkgGTirec

Lichtkunst🐾: EQDBfl5m7h_GXA2nhOmQ8ioNb1TYunVUYcw_xG4BkgGTirec

Lichtkunst🐾: will pay it back once i swapped some ton

User<5321317577>: Fellow TON devs

⇝కᎿҿҿł ℛȺ₮⇜: ?? (reply to 26958)

ㅤ: what is entropy and where can i learn about it? (reply to 26958)

⇝కᎿҿҿł ℛȺ₮⇜: In ton.plearnyx.com/game last task Recently resolve this problem, i wrote on php, and it’s need use hex2bin before use hash() function to get needed sha256

⇝కᎿҿҿł ℛȺ₮⇜: I hope i’ll not be banned for link

ㅤ: im using java

⇝కᎿҿҿł ℛȺ₮⇜: I’m think problem resolving by same method

ㅤ: i'll try your method

ㅤ: it is too hard, I WANT TO GET TONS)

⇝కᎿҿҿł ℛȺ₮⇜: Yes, the whole world is against my finishing this task, first the english.txt problem, then the sha256 problem... 😂😂

Lichtkunst🐾: please help guys, need some faucet! Will pay it back!

Alex: @testgiver_ton_bot (reply to 27002)

Lichtkunst🐾: tried it two times, its not working for me. (reply to 27004)

Alex: I checked just recently and got test Toncoins. What is wallet you use(app and address)? Have you switched on Testnet?   Tonkeeper, Sandbox, Openmask works fine for me.  https://docs.ton.org/participate/wallets/apps (reply to 27005)

ㅤ: how to clear the task? I very need it

— 2023-04-17 —

순범: in func, is cell params of functions deep copy or shallow copy? I mean, if I send cell 'params' to function that operate 'params~load_uint(8)' and then do 'params~load_uint(8)' out of the function, will the values be same?

Morris: Hello, I would like to ask about the difference between the "full" and "lite" modes in MyTonCtrl. Does "lite" mode not have a node/validator? Are the response speeds of the two modes the same, or is the response speed of "lite" mode slower? Thank you.

Habib: Is fragment having issues with connecting to telegram? Is there a technical support team for fragment?

Lichtkunst🐾: how to switch to testnet? I use telegram @wallet and  tonkeeper (reply to 27006)

Lichtkunst🐾: and if i get the tokens on Testnet, can i use it on mainnet?

Dmitry | backend4you.ton: Wallet - no way TonKeeper - go to settings, scroll down and tap logo 5-7 times (reply to 27020)

Lichtkunst🐾: do i have to set up a new walket on Testnet and can i tranfere funds from Testnet to mainnet? (reply to 27022)

Lichtkunst🐾: How does testgiver bot know, if its a testnet or mainnet adress?

Andrew: you can use your mainnet seed, it doesn't matter (reply to 27023)

Andrew: it doesn't have to know, it just sends in testnet (reply to 27024)

&rey: No, testnet coins cost "nothing" and mainnet TON is 1 TON. The networks aren't connected. (reply to 27023)

Lichtkunst🐾: then it makes no sense. I transfered matic from polygon to ton via orbit bridge. Now i want to pool it in megaton, but i cant move the matic without paying the fees in ton. (reply to 27027)

Daniil: You can't interact with blockchain without paying fees. It works this way everywhere, not just in TON (reply to 27028)

Lichtkunst🐾: yes you are right, except hive and proton works without fees. So i need the  faucet. Will pay it back. (reply to 27029)

Asher: https://www.youtube.com/watch?v=y5XcaQAwxIQ (reply to 26978)

User<6247944943>: hi excuse me, why there has an 0x10? I know the 6 means leave 6 bits for the storage then(the space for 01000)

Alex: You have (0 1 0 0) flags and  (00) src null address(addr_none$00).  In summary 010000 - 6 bits in binary form.  010000 in bin equals 10 as hex(0x10). (reply to 27032)

Spite: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#internal-transaction-creation (reply to 27032)

Y̷A̷M̷I̷: Hi guys, I'm looking for a developer who can give me some advice on how to create a rebase token on ton, thanks in advance

Lichtkunst🐾: what is the Testnet Faucet for? (reply to 27029)

Daniil: For developers to test their smart contracts without spending real coins. (reply to 27038)

Alex: @f_closer

Andrew: @f_closer add combot to this chat please

Lichtkunst🐾: Dont want to do KYC cause we have a crazy goverment here in Germany 🇩🇪 who will prosecute crypto investors (reply to 27053)

ohmygoodness: hello hello everyone! I have a quick question about TON domains, I hope this specific chat is relevant to ask a one: how to renew a domain? will it happen automatically or I have to approve something, can't find details about that

Step: just go to dns.ton.org (reply to 27055)

User<5062827846>: Good afternoon! If we are talking specifically about ton dns, then yes, the domain must be renewed every six months. The price will be based on the features of your domain. (reply to 27055)

Daniil: every 12 months** (reply to 27057)

ohmygoodness: is there any way to calc the price? (reply to 27057)

ohmygoodness: I've been there, there's only expiration date and that's it, no more instructions about renewal (reply to 27056)

Hommes: Ok but I'll get to it as soon as possible

User<5062827846>: It used to be six months, wasn't it? ok (reply to 27058)

Step: Once per year, the domain’s owner will have to send a nanoton to the domain’s smart contract to extend the domain for a year. If the owner fails to extend their domain, it will go up for auction. Such is to prevent losing a domain forever in the event its owner loses access. from - https://dns.ton.org/about.html (reply to 27060)

Step: 1 nanoton =  0.000000001 TON ? (reply to 27063)

ohmygoodness: oooh, that's more clear now

ohmygoodness: definitely worth to spend some time to make this more visible

ohmygoodness: completely not transparent about the way to maintain the domain

ohmygoodness: thanks!

liminal: First EN FunC & Blueprint lesson's out! https://www.youtube.com/watch?v=y5XcaQAwxIQ

— 2023-04-18 —

User<1418229103>: how to construct init cell from code cell and data cell?

User<1418229103>: Is this correct? `let initCell = beginCell().storeBuffer(Buffer.from([0,0,1,1,0])) .storeRef(codeCell).storeRef(dataCell).endCell();`

User<5882534450>: Which wallet should I use on TON network?

Dmitry | backend4you.ton: Have you seen the wallet list on official website? (reply to 27079)

User<5882534450>: I have seen several wallets but I don't know which one is proper for the developers.

Andrew: Tonkeeper & mytonwallet imho (reply to 27081)

User<6139379130>: I'm looking for a open position in the blockchain industry. I have experience in developing and securing decentralized systems using programming languages such as Solidity and Func etc Any leads or suggestions would be greatly appreciated!

Alex: You can try one of the following:  - https://t.me/tondev_eng/26192 - https://jobs.ton.org/jobs - https://github.com/ton-society/ton-footsteps (reply to 27083)

Timo - 0D: Hi, we're Trooper, an ecosystem for gamers.  We're currently looking for a Co-founder developer to join our team.   Trooper is an ecosystem for gamers, gamers will build up profiles with reputation and track record, similar to how it happens in Linkedin.  At the same time these gamers will join a job market, ready to be hired or sponsored by guilds, brands, or other industries, similar to Fiverr or Upwork, a full ecosystem to make gaming a living.  The Co-founder developer will be responsible for developing the platform and managing the technical aspects of the ecosystem.   If you're passionate about gaming and have experience in software development, we'd love to hear from you!   DM for more info.

Christophe: Was pretty nice, thanks, hope more is coming soon :) (reply to 27070)

Kate: Ребята, привет! Если вдруг кто-то из вас сейчас в Португалии - приглашаем на воркшоп от нашего хаба в Лиссабоне. Ждем! Расписание и билеты ниже:

Kate: 🔔LET'‎S GO! Calling all Web3 builders and crypto enthusiasts  This weekend, the TONnovation Bootcamp will take place – a two-day crash course to kickstart your journey in TON Blockchain ecosystem💎  - workshops - speaker sessions - case studies on building projects on TON - coding sessions  🔗Full program and tickets available at the link: https://www.meetup.com/ton-lisbon-hub/events/292970576/  Don't forget to register, seats are limited and tickets will be checked (forwarded from TON Society Europe: Lisbon🇵🇹)

User<132183512>: Hey, Guys! I've a question about game. It shows that I have two SBT's but I can only see one of them in my wallet. How so?

Daniil: about which game? can you also share your wallet address please? (reply to 27112)

User<132183512>: ok, should I DM it to you?

Daniil: no

Anthony: It will be better to reach the game support directly (reply to 27112)

User<132183512>: oh, how can I reach them? (reply to 27116)

Y̷A̷M̷I̷: I remember that when there was the GRAM token, the commissions were really of a nanosecond. (reply to 27064)

Coalus: We don't know which game you are talking about (reply to 27117)

User<132183512>: https://ton.plearnyx.com/game

User<132183512>: this one ^^^

Андрей: first time I see (reply to 27120)

Андрей: where did you find the game here you are unlikely to find something about the game - this chat is for development (reply to 27117)

&rey: Nanoton would not work. As far as I remember, you need to send at least 0.0001 TON in order for TVM to be launched so that domain contract is renewed. (reply to 27063)

Anthony: https://discord.com/invite/vrcCwar9jm (reply to 27117)

Tolya: Sepolia testnet coins  Friends, we have made interesting developments of cross-chain between TVM and EVM, but we cannot publish them, because we do not have enough Sepolia testnet coins 😅  If you have, please send to 0x9cc993114D07f5B70a18D4C65e75c91B94a63848.

Yang: Let me be the first contributor. (reply to 27126)

Yang: Done. I have sent all my funds to this wallet. (reply to 27126)

Daniil: 😁

Amin: Done!✅ (reply to 27126)

Lichtkunst🐾: what is this coin for? (reply to 27126)

Mahdi: Hello I've tried to buy premium for one of my friends who dont have TON wallet via fragment.  I've got this error message: You can't gift Telegram Premium to this account at this moment.  Does anybody knows a method to buy premium for other accounts?

— 2023-04-19 —

Henry: Hi, given a block height (seqNo). is there anyway to fetch all transactions in that block?

Step: https://toncenter.com/api/v2/#/blocks/get_block_transactions_getBlockTransactions_get (reply to 27142)

ILYAR: https://github.com/toncenter/tonweb-mnemonic/issues/13#issuecomment-1514136521

&rey: However, no TON standard says that mnemonic generation is going to use BIP39. (reply to 27144)

Farhad: what is lt (local time) in transactions?

Farhad: what is utime?

Max: it's logical time, not local time I believe the main rule is that all txs on one account must have monotonically increasing lts, but I'm not sure (reply to 27146)

Max: unix timestamp (reply to 27147)

Andrey: Yep, this is true. Example   {   transactions(     address: "3333333333333333333333333333333333333333333333333333333333333333"   ) {     lt     gen_utime        } } (reply to 27148)

ILYAR: Indeed, adhering to industry standards, such as BIP39, will greatly facilitate integration with other ecosystems and applications. In contrast, if these standards are not followed, the process of adding support for TON or other blockchain networks will likely be more complex and time-consuming. By ensuring compatibility with well-established standards, you will enhance the usability and interoperability of your system, which will ultimately benefit users and developers alike.  The key takeaway in this situation is that the cause of the incompatibility is now understood, although the motivation behind the current implementation remains a mystery. It is unclear why and who decided to implement it in this particular way. Fortunately, there is a clear vision for a solution that will be backward-compatible, but it will require some effort to implement.  It is essential to reach a consensus on the direction of the solution before starting any work on it. Therefore, it is important to obtain feedback and comments from the core development team. By involving them in the discussion and decision-making process, you can ensure that the proposed changes align with the project's goals and that everyone is on the same page. This will help prevent potential issues and make the overall process more efficient and productive. (reply to 27144)

Seitaro: Why we need entropy recovery? (reply to 27152)

Seitaro: So the only reason to be compatible with standard in other networks? (reply to 27154)

Steve: It is clear, using this scheme you can split your mnemonics and compromising part of it is much much harder to do. (reply to 27152)

ILYAR: Yes, but this is not enough, already now application developers need to add special logic for working with TON mnemonics, because standard libraries for cryptography will not work with it (reply to 27155)

Steve: Meanwhile classical wallets can derive keys the way they want similar to ledger and safepal

&rey: What about different way of deriving contract addresses? (reply to 27157)

ILYAR: deriving contract addresses is not the main goal; the problem is found before using PBKDF2, and obtaining additional addresses from one mnemonic can be done according to the standard and now using the current mnemonic algorithm, but this can only make it worse. will create even more incompatibility problems (reply to 27159)

Vinayak Dubey: Greetings! I am trying to run a smart contract and require some testnet tokens for that. the faucet does not seem to be working for me. Can anyone help me out? I just need around 5 TON testnet tokens.

Andrew: what's your address (reply to 27161)

Farhad: yes ... my mistake. logical time. is it just some increasing number? (reply to 27148)

Vinayak Dubey: 0QAS4q_1bIwMJ32dqvYoBmnI_V8lw5GjjuQ4LQEHWjbwbcyC (reply to 27162)

Max: well it has some rules to how it is formed, but in general you should only depend on the fact that if tx 1 on some account happened before tx 2 on that same account, then tx1.lt < tx2.lt (reply to 27163)

Andrey: It can be diffrent transactions with same lt in diffrent accounts (reply to 27165)

Max: yeah, that's why I specified "on that same account"

Andrey: Ah, you mention it, sorry

Andrey: )

Max: all good

Farhad: i pass lt and hash of one my transactions as parameters of getTransactions and i expect to retrieve only transactions i have after the specified transaction. but toncenter returns all of my transactions (txs before the passed lt). how is that?

Farhad: let me ask you my main question. i want to check the transactions but i do not want to re-check them. for this, i would like to get transactions which have been created since my last poll. how can i do that?

&rey: Could you give an example? (reply to 27171)

Max: normally it goes like this - you get the latest transactions using getTransactions without specifying hash and lt and go through them, then if you need more you call again but specifying hash and lt of the earliest tx known to you. after that, you can call getTransactions every few seconds and check every tx that is unknown to you by comparing their hash and lt to the ones that you know (reply to 27171)

Max: or if you have to specify hash and lt then you query the account state using some other API call and specify the latest ones

Farhad: i am doing as you said. for the first time, i poll the transactions check the payments. some time later, i send the lt and hash of the last transaction which i checked and expect to get just the new transactions. but it does not work and returns all 10 latest transactions (even the txs before lt). (reply to 27174)

Max: yes, because to get new transactions you need to call getTransactions without lt and hash, then you go through the list and try to locate your last known tx, and if you can't find it, you need to call getTransactions again and again until you locate your last known tx

Tim: can you even get txes without lt and hash? I thought you need to pass lastTx from account state (reply to 27177)

Max: or that yeah

Max: well anyway, what I mean is that you can't use known hash and lt to get new transactions

アレクシオス: TON blockchain allow us to send erc20 tokens already? Someone are storing them in toonkeeper?

Farhad: there is no need to pass lt and hash. (reply to 27178)

Farhad: no, actually getTransactions returns the latest transactions. so i always know the latest lt too. (reply to 27177)

Farhad: another questions, in the result of the response, i see some transactions which do not have any value or destination address fields. what are these?

Farhad: i actually wanted to know if i have had any transaction since my last tx poll. (reply to 27183)

Alexey: hi, how to find out the amount of TON on a wallet using the @tonconnect/ui-react ?

Andrew: you need to use ton APIs for that (reply to 27186)

LibertéZ: Hello guys

LibertéZ: What are the requisites to Validate on TON? Any guides?

Alex: https://docs.ton.org/participate/run-nodes/full-node https://ton.org/en/validator (reply to 27189)

Alexey: does it need a mnemonic key? (reply to 27187)

Andrew: no (reply to 27191)

Alexey: could you send a link to the documentation you are talking about? (reply to 27192)

Andrew: tonapi.io for example (reply to 27193)

Alexey: I got a call in a telegram, the name of the caller was TON Community team, the man said he wanted to help me. Who's calling? could it be a hoax? I was asked to throw off the screenshots of the connection to the wallet. It seemed strange to me. Do you have an opinion on this?

Andrew: it's a scam (reply to 27195)

Alexey: what do they want to achieve, and most importantly in what way? Do they want to know my secret key? One day I got a call from one of the admins, Hartmann D.  I had a night out and I couldn't talk. So I thought that now they might also want to help. (reply to 27196)

Andrew: all scammers want your money, in any way possible. Stay safe (reply to 27197)

Alexey: thank you very much. I have nothing to steal except rubles and test TON (reply to 27198)

Alexey: and a few gettokens for a couple of dollars

Max: if it has no value and no source field then it's likely an external message transaction if there is no value and no destination then this is weird and idk what that is (reply to 27184)

Farhad: i just learned how it is. there are an in_msg and an out_msg fields in the transaction. if the wallet has send money, the out_msg has the value but if wallet has received money, the in_msg has the correct value. (reply to 27201)

Tse: Hi, I'm wondering is it possible to turn signature, public key, and signed message into a QR code and let others scan the QR code and verifies it?   I spent 10 hours but still can't figure out how to correctly do it.  Currently my QR code contains the signature(raw bytes I suppose) directly , but I don't know how to make a device read the QR code but keep the content in bytes instead of turning them into string.  Maybe I should decode the signature before put it into a QR code? But I can't figure out how to properly do that either

Dmitry | backend4you.ton: I don't think you really should try to keep QR content in raw bytes 0..255, because many different apps can "try" to read all QRs they see and I suppose you don't want to crash user's device due to bad QR reader app he/she use :)  But explain please, how do you want to _verify_ signature? Something should split QR data to sig/key/msg and perform some cryptographic operations on it. You want to make special app for that? (reply to 27203)

Tse: I wrote a simple python script to perform the necessary cryptographic operations to verify the sig/key/msg. I use my phone to scan the QR code and manually send the content to my python script via input().  However that’s where I’m stuck on. The python script will consider the input as string instead of bytes. (reply to 27204)

Tse: How do I properly decode the signature(raw bytes),  put it into QR code, and then encode it from string?

&rey: Encode the data into base64 format. (reply to 27203)

Alexander: Hello! I am trying to parse interval in blockchain by incremental moving among the blocks in masterchain. All examples below are for the shard 8000000000000000, I am using toncenter.com API. for -1 chain, 18276434 block /shards function returns me 0 chain, 23311858 block for -1 chain, 18276435 block /shards function returns me the same 0 chain, 23311858 block for -1 chain, 18276436 block /shards function returns me 0 chain, 23311860 block So my question why is 23311859 block disappeared from results, why is 23311858 block returned twice and what is the correct way to parse missing transactions of block 23311859. I thought that linear search with shards querying is enough, but it seems it is not.

— 2023-04-20 —

Tse: encode sig and make it a QR code, use other device to retrieve the data as string and decode it will work? (reply to 27207)

&rey: Multiple shardchain blocks can be confirmed by one masterchain block. You need to iterate over unseen block heights. (reply to 27208)

Christophe: Hello, do we have something like Solidity subscribe events, to receive live message about every interactions on a smart contract?

순범: hi, I have some question about nft-fixprice-sale standard from getgems. in this code, the nft_msg cell has more than 1024 bits so that I think it should throw error code 8 (overflow error) why is it possible?

Howard: It seems like you will get an error saying value is out of range for ${bits} bits. Got ${value}  if you are using ton": "13.3".    If you encounter this issue, change the version of ton to "^13.3.0" and reinstall it.

Howard: You got exit code 8 and you are asking why? (reply to 27219)

순범: when I tested nft-fixprice-sale code, no error was caused. but when I tested another code, which contains such a code (transfer nft), it throws error code 8 and the error part is that. (reply to 27222)

순범: so I changed my code like this, but I don't want to make wasted extra cell.

Tse: When I try to decode the data, my script returns error"'str' object has no attribute 'decode'." Do i misunderstand something? (reply to 27207)

Tse: maybe there's  other process needed before decoding?

Daniil: - Query shards for the highest masterchain block that you need;  - iterate over all shardchain blocks and also get their parents  - iterate over their parents and repeat step 2 until you reach the lowest block you need (reply to 27208)

&rey: base64.b64decode (reply to 27227)

User<6101555747>: hey ever one i am waiting members in my team  to create first on the market project! Who want to know more about this write hom @mirl1xUAE  Vacation which we need: Web Developer NFT artist MAtic|ton developer    We’re waiting a message from you 24/7! Thank you for attention

Daniil: It's not chat about polygon. (reply to 27231)

User<6101555747>: I forgot write about ton (reply to 27232)

User<6101555747>: sorr

Kloy: Hello!  What version of the wallet on mytonctrl are we supposed to have?  For example, if the version shows as v1 or None, do I need to fix it?

Light: Is there any difference between the helper words of the TON network and the helper words of the ETH network?  Since there is no SDK provided for my programming language, I generated 24 words using the ETH network sdk, but they don't work properly in the Ton network

Christophe: Any idea about that one please?? (reply to 27218)

Andrew: tonapi.io has SSE for accounts (reply to 27218)

Christophe: SSR? Like SSE?

Christophe: Is it like we have to regularly pull block range or more like socket/grpc, once connected we receive events live?

Andrew: yes, sorry, made a typo (reply to 27239)

Christophe: Thanks, i will test that.

Jimmy: Hi, I come into this problem when I am trying wallet tutorial, can anyone tell me how to fix it? (reply to 27245)

DreamDevFast: Hi, Everyone  I am a senior blockchain engineer and full stack developer with rich experience in web2 and web3 space.  What I have done so far in web3 space includes web3 product engineering like Defi project architecture design and implementation like dex, trading, bonding and also NFT marketplaces. I also have experience of onchain and offchain system design and implementation for the video games. My major strength in web3 space includes smart contract development using solidity language for the EVM compatible chains like Ethereum, BSC etc and also for other ecosystems like Solana, Terra, Near, EOS etc. I have good knowledge in blockchain technology and cryptography.  Here is my recently developed NFT dashboards: https://infinity8.io/ https://staging.ediiie.com/mozart-blockchain/ https://nft.mrmint.io/ http://market-place.ediiie.com/ https://nft.iloop.us/  https://vsbdigital.in/  I hope to contribute my strong skill sets to your community. Thank you.

Tse: Thanks for the help. Could you provide a little more detail, my route now is   sig -> nacl.encoding.RawEncoder (the singing function in SDK use this encoder by default) -> base64.b64encode() -> QR code -> base64.b64decode() -> check it w/ verify_sign function in SDK   however it returns an error saying the length of signature is not right (reply to 27229)

Vladislav: Guys, I wonder how are such videos created. For example these ones from the ton.org website. Does anybody know?  Is the original running application used on the actual phone or is it just created from design files?

Anthony: I think it was created by design files (reply to 27250)

Dmitry | backend4you.ton: Can somebody help me plz with storing coins in cells.  tblkch.pdf in 3.1.5 says that The original total supply of Grams is fixed at five billion (i.e., 5 · 10^18 < 2^63 nanograms), and is expected to grow very slowly. Therefore, all the amounts of Grams encountered in practice will fit in unsigned or even signed 64-bit integers.  But https://docs.ton.org/develop/func/stdlib#store_grams "Stores (serializes) an integer x in the range 0..2^120 − 1"  So my question is: as 64 bits is enough for storing any TON (nanoton = grams) amount - then why 120bit numbers are storable in FunC?

Dario: current TON supply is 5bln coins, which fits in 64 bits. Anyway, internally, its rapresented as Grams, or Coins which is a flexible type (use less bits if small) in range 0..2^120-1   and serialization will take at most 124 bits for type Coins (or Grams or VarUint 16) (reply to 27252)

Dmitry | backend4you.ton: so, 120 bits are "available" just because  "nearest lower" value means 3 bits instead of 4 for 'length', and this gives 7*8=56 bits for 'value', which is not enough for 5bln?  good explanation, thank you

— 2023-04-21 —

User<6091644102>: Can I use ston.fi sdk on test net?

CHIRI Robot Factory: Will my comment be returned due to incorrect input?

Slavik: Potentially, you can, but we don't have our contracts in testnet (reply to 27263)

Dario: You can, but you need to change and use testnet version of the router contract: EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt  Also keep in mind that mainnet pools are not available here so bring your own jettons and make your own pool to test stuff. Contracts are equivalents but metadata for pools wont load (you wont see LP STUFF-SMT like here)  A guide to use custom addresses: https://docs.ston.fi/docs/developer-section/dev-guide/revision (reply to 27263)

Vinayak Dubey: hi guys we are trying to setup a smart contract on ton. we need some testnet tokens for that can someone help us out? the address is EQCMSp14JPeflVXURHS24LaOJ2HV8WjwsBofCPOKvR4HEx5T  thanks a lot

Andrew: @testgiver_ton_bot (reply to 27273)

Vinayak Dubey: that is not working i tried also i need more than 2 tokens around 10-20

NoobCoder: Hi guys, How can I get my private key of the ton wallet of the testnet ?

Andrew: it works, just tried (reply to 27275)

Andrew: (captcha is case-sensitive btw)

NoobCoder: Hey Can you help me out with my issue ? (reply to 27277)

Andrew: which issue? Testnet tokens?

NoobCoder: No no

NoobCoder: How to get the private key of a ton wallet ?

Andrew: oh

NoobCoder: of the testnet

NoobCoder: I am trying to deploy the nominator pool contract, so I need to put the private and public keys of the account having sufficient ton for sending a transaction into the transaction

NoobCoder: So I need the private key of my testnet account

Andrew: just use your seed phrase

NoobCoder: And can I private DM you with my queries regarding the nominator pool contract deployment ?

Andrew: no, I don't have any experience in nominator pools (reply to 27288)

NoobCoder: Should I just concatenate all the 24 words  and use it ? (reply to 27287)

NoobCoder: okay cool thanks (reply to 27289)

Andrew: no (reply to 27290)

Andrew: try searching this chat, docs.ton.org or answers.ton.org

NoobCoder: okay thanks

&rey: If you have TonWeb (for example, in browser console on wallet.ton.org), then you could output (await TonWeb.mnemonic.mnemonicToKeyPair('a b c ...'.split())).secretKey (approximate code, have not written anything with TonWeb for a while) (reply to 27290)

NoobCoder: Thanks man (reply to 27295)

Narek: TON tooling roadmap 🔥  Hey guys! We have launched a discussion about some features that could be implemented into the tools that we have developed.  Please come see them and participate here. (forwarded from TonTech)

Narek: Hey guys! Join us in discussion of future of TonTech tooling

Florian: Hey guys ! I am looking to have a chat with an experienced TON developer. I am looking to identify missing tools/sdk/libs or even apps. Would anyone be ok to discuss ?

User<6195705025>: Friends, do you also want to know about TON?

M: Sure

Gilbert Meshchain.Ai: Hello team, I have a code in Python for the creation of a bot, all that remains is to add the blockchain to make it a smart crotract. I need to work with a developer to achieve this. If you are interested contact me privately.

User<6195705025>: That would be perfect, my friend.

User<5882534450>: How can I build and deploy token contract to the test net?

Trassos: Guys, I know this is no t the place and everything but can I expose myself to TON value by buying ton on by bit or other exchange?

Алексей: Hi everyone! Which python library is a good one to be as a basis for my project in TON? I see those ones: https://github.com/disintar/toncli https://github.com/psylopunk/pytonlib https://github.com/yungwine/TonTools (found in this chat)  Most of them require some compiled libs which just have DLLs or something which doesn't look great 🤔  I would need to: parse blockchain and transactions Have a way to match blockchain data to invoices database (in btc it is unique addresses, in eth no such way exists hence workarounds, in xmr they have a payment identifier, what about ton?) Send regular ton payments Send contract payments and some basic interaction with them Estimate fee of a transfer before doing it And some more  If I have an app doing all this in eth, how hard would it be to port it to ton?

TON Answers Bot (not AI): Are there any smart contract analytics services on TON? from Evgeniy Trifonov  On other blockchains there are projects like Tenderly and Pagoda that help with tasks such as smart contract analytics. Are there any alternatives to them in the TON ecosystem?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/120109   🔗 Answer on TON Overflow

— 2023-04-22 —

Brave: Oh shit

User<5844807196>: How are you guys earning

Alexander: Hello! Is there any way to parse transaction status and error code by toncenter.com  API similar to the one I get when looking at the transaction using tonscan.org? https://tonscan.org/tx/5ceLv_jbABgq1TPvSg9fLJewGTJXd8BcAboQo76RSnU=

User<5677571362>: How to use API to trade tons

阿凯: anyone can introduce me the nft api of TON address? THX

Howard: Maybe you can try out this way to get ExitCode. https://t.me/tondev_eng/26854 (reply to 27312)

Howard: what do you need? (reply to 27314)

User<6247944943>: anyone know why my TonClient from ton library suddenly got this?

V L Λ G Λ: Не

User<5677571362>: Do you have a transaction payment API (reply to 27315)

Howard: maybe can take a look in https://t.me/TheTonpay (reply to 27319)

Tse: Hi I'm currently using tonapi letting my Telegram bot to listen to account events.  And the get method "/v2/account/{account_id}/events" requires a parameter called "limit" which limits the number of the events it can get  However, if the event of certain account exceed the "limit", the api response starts from the very first events of the account to the "limit"th event.   Considering the max for limit is 1000, if an account has more than a 1000 events, how do I get the latest events ?

Howard: Using now() / Logical Time(LT) to filter out duplicate messages, generally, do you only want to query data from an hour, or 15mins ago?  Just an example on JS (reply to 27322)

Tse: In tonapi this getmethod only has a  before_lt parameter, but for this instance I think I need something more like "after_lt" (reply to 27324)

Tse: It also has start_date and end_date parameter, but I haven't figure out how do these two work

User<5677571362>: Is there a Tonkeeper transfer API present

Victor: Check https://github.com/ton-connect (reply to 27328)

Farhad: is it possible in toncoin network to send from one source address to two or more destination addresses in a single transaction?

Daniil: Yes (reply to 27330)

Farhad: how can i make a link for this type of transaction? e.g.  ton://transfer/Address1?amount1=xxx how can i alter it for this purpose? (reply to 27330)

Spite: https://github.com/tonkeeper/wallet-api  You need to build this transaction, get BOC and use ton://transfer/<address>?bin=<url-encoded-base64-boc>  Check this tutorial: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#sending-multiple-messages-simultaneously (reply to 27332)

Spite: No, it's a BOC for a single address

Farhad: so i can't make such a link. right? (reply to 27334)

Spite: Check this: https://github.com/tonkeeper/wallet-api#signrawpayload (reply to 27335)

Farhad: what is boc? i did not realize how to construct the link.

Farhad: could you give an example. suppose i would like to ask user to send amount1 to address1 and amount2 to address2.

Farhad: for one destination address, the link is clear and i know how to make it.

Mc Gandhi: I am a beginner in web 3, how to upskill myself and get a job. Please guide me

— 2023-04-23 —

User<5677571362>: Can I complete ton transfer transactions using an HTTP API like tron

User<5677571362>: All I see is generating links and then waking up the wallet for payment

User<5677571362>: I hope to request payment through the HTTP API, but I don't seem to have noticed that ton has a private key

Andrew: if you use ton connect, you won't have to provide links (reply to 27344)

User<5677571362>: seed ？

User<5677571362>: They all use app payment transactions, but I haven't seen the documentation on how to use API transactions

Andrew: transaction can only be done by the user's wallet (reply to 27347)

User<5677571362>: 🥲

User<5677571362>: https://testnet.toncenter.com/api/v2/#/send/send_boc_sendBoc_post Isn't this an API transfer？

Равилька: throw a tone of coins

Andrew: this endpoint sends an external message, not internal one (reply to 27350)

User<5677571362>: I know someone gives away Telegram VIP and automatically uses ton to complete the payment

User<5677571362>: So I'm looking for API payment methods

Andrew: fragment.com/premium (reply to 27353)

User<5677571362>: I know this is a manual operation, and I need to achieve automation (reply to 27355)

Andrey🐾🐍: Hello. Is there a code or site for NFT deployment (100 pieces)?

&rey: Check out https://gist.github.com/ProgramCrafter/704886244271f004319951a5e8eaa241 (fully onchain NFTs) (reply to 27357)

Andrey🐾🐍: Is it with metadata? (reply to 27358)

&rey: No. I haven't found out how to add metadata. Probably, info on how to add it is in TEPs. (reply to 27359)

Andrey🐾🐍: Thanks (reply to 27360)

User<5480925235>: Can I use ton as a gateway for my website to customers pay for products?

— 2023-04-24 —

User<6123789878>: I am looking for a ton dev with rich experience of integrating UI and smart contracts.

Morris: Hi, recently when running mytonctrl on mainnet, I received the following error log. Does anyone know why this is happening?  [error]   24.04.2023, 02:35:00.480 (UTC)  <Elections>   Elections error: Command '['/usr/bin/ton/lite-client/lite-client', '--global-config', '/usr/bin/ton/global.config.json', '--verbosity', '0', '--cmd', 'runmethodfull -1:3333333333333333333333333333333333333333333333333333333333333333 compute_returned_stake 0x017d752d3eaea12672513e88111ff60da85f84a02a6155a983edfb7946727f04', '-i', '3']' timed out after 3 seconds

Андрей: for some reason the global servers are being used and not your local one. global servers are less stable due to their personal load and may sometimes fail to respond. if you do not use a local server, then after a few attempts the command should work. (reply to 27365)

Morris: If want use our local one, it's need run mytonctrl -m full ? (reply to 27366)

Андрей: you need to install mytonctrl in full mode initially: install.sh -m full https://github.com/ton-blockchain/mytonctrl (reply to 27367)

Morris: thanks I will try

User<6194487905>: Hello, I am a junior TON developer.

User<6194487905>: I need your help

User<6194487905>: Hello, is anyone using Ston-fi to implement swap?

Daniil: Can you specify the question? What do you want to ask? (reply to 27373)

User<6194487905>: I use ston-fi to implement swap.

User<6194487905>: so first I implement a method to add liquidity pool.

User<6194487905>: then I try to swap jettons.

User<6194487905>: but it doesn't work.

User<6194487905>: please let me know what is wrong

User<6194487905>: @Gusarich

User<6194487905>: thx for your kind reply. (reply to 27374)

Dario: What doesn't work? (reply to 27378)

Dario: Are you using sdk?

User<6194487905>: there is no errors.

Dario: Share the code you are using, at least

User<6194487905>: yes, but I couldn't swap any my tokens.

F: @MooseTyler express your thoughts in one message. no need to divide it into several messages

User<6194487905>: or does anyone have swap project using ston-fi sdk?

User<6194487905>: please help me. (reply to 27385)

User<6194487905>: please help me (reply to 27374)

Developer: hello everyone

Developer: How to get TransactionHash after SendQuery？

Developer: When I use the ethereum sdk, I always get the transaction hash before I send the transaction

Developer: The same when using tron sdk

Daniil: You can get the hash here too. Which API do you use?

Developer: But in ton network I don't know how to do

Daniil: Which API or library do you use? (reply to 27392)

Developer: TON ADNL API (reply to 27397)

Developer: Ton network's documentation is frustrating😭

Daniil: Well, for this one, looks like it doesn't return the transaction hash. (reply to 27399)

Daniil: Do you really need the raw ADNL api btw? You can try using others from this page:  - https://docs.ton.org/develop/dapps/apis/

Developer: thanks (reply to 27402)

Dmitry | backend4you.ton: because TX hash is not known at moment of sending. you should "wait" for your tx to appear is account history (reply to 27401)

Daniil: it's possible to know the hash of the external message that you're sending (reply to 27404)

Dmitry | backend4you.ton: not in tonlib ( (reply to 27405)

Dmitry | backend4you.ton: or, you mean that I can get hash of my msg before I send it? hmm.... thanks, will dig that direction

Tim: You can get hash of message body.

Tim: Transaction hash includes params set by validator, so you can't know it in advance, but in most cases you can check inMessage of the transaction to be yours.

Oleg: New version of tonutils-go 💎  v1.7.0 has been released!  💥 Added transparent ton wrapper which allows natively keep execution flow in correct block order, even between different nodes.  Example:      tx, block, err = w.SendWaitTransaction(context.Background(), transfer)      api.WaitForBlock(block.SeqNo).GetAccount(ctx, block, addr)  🚀 DHT was adapted for unstable systems with weak connection, now it will work faster and more stable.   😘 Added mapping of whole transaction data to struct fields, now you can get fees and all phases info just by reading struct fields.  And other cool features.  Changelog: 1. Transaction description data mapped to struct fields 2. Block wait wrapper for ton methods (gives strict control of states even between diff nodes) 3. Added SendWaitTransaction method, which returns transaction object and block where it is applied. 4. DHT Stability and performance improvements 5. Parallel DHT key Store implementation 6. RLDP-HTTP Proxy get capabilities support 7. Better (compact) dictionary serialization 8. StoreVarUint methods for cell building 9. VarUint [de]serialization support for TLB struct mappings 10. Fixed DHT race condition (by @iam047801) 11. Removed unneded zero bit for empty wallet message (by @aspite)  💎 https://github.com/xssnick/tonutils-go

Dmitry | backend4you.ton: "...check inMessage of the transactions" - but only after waiting it to appear in account history, right? Not "during sending".  So checking inMessage can help me distinguish "my" vs "others" tx (some kind of replacement of putting some nonce into comment) (reply to 27409)

User<5677571362>: Does ton have a payment and transfer API similar to tron

Tim: Hi everybody! Can anyone help with Repo https://github.com/tonlabs/evernode-ds ?  It was not possible to assemble a working node from current repo because of the conflict of libs versions.

User<6194487905>: hello

User<6194487905>: nice to meet you all

User<6194487905>: Could anyone explain the method of creating a new pool using ston-fi sdk?

Oleg: 💎 Tonutils Reverse Proxy v0.2.0 Released!  Tool to host your own TON Site easily  Main changes: * Significant DHT improvements, Store now works much better, even with unstable connection. * RLDP-HTTP GetCapabilities request support (allows c++ clients to use RLDP2) * Tonutils-go core updated to v1.7.0

ㅤ: This is a developer chat. And those prices are ridiculous 🤣 (reply to 27421)

рома: too cheap i agree (reply to 27422)

— 2023-04-25 —

Alexander: Hi guys! I'm trying to send message using kotlin wrapper and get Failed to unpack account state message from liteAPi. I feel the problem is with data that I use - could anyone advice me what exactly can be wrong? I'm kinda stuck with that. Please contact me if someone seen something similar

Vash: hello! Trying to check current validator penalty list getconfig 40 - returns null Does anybody know where i can check current negative incentives list?

User<6194487905>: Hello, could anyone help me about ston-fi sdk?

liminal: https://youtu.be/0-A2IuK3KcA

Lisa OOO: Hey devs!  We need your brutally honest thoughts on ton.org website. Do you find it easy to use or do you have any suggestions to make it better?  Please do us a solid and fill out our feedback form. You'll be done with the form quicker than you can say "supercalifragilisticexpialidocious"!  Your input is incredibly valuable to us, and we are grateful for any help you can give us.  Thanks a TON ❤️

Aina: Hey guys! I want to share some news on behalf of TON Play:  TON Play has released the Unity SDK + payment management for games!  TON Play, a toolkit for developers, has introduced Pay-in, Mass payout, and On-demand payout methods that are easy to incorporate into a product.  The payment solution allows you to: 💸 get paid by Telegram users in TON 💸 add mass payouts in TON to games with cash prizes 💸 automate payouts on user demand  But that’s not all! TON Play has simplified interaction with the TON blockchain and WebApps on Telegram by releasing SDKs, allowing projects to manage assets and in-game marketplace. SDKs are written in Unity, Python, and Typescript.  What do you have to do to connect all these solutions? ✔️ subscribe to TON Play Insider ✔️ take SDK and payment solutions ✔️ in case of questions, write to @tonplay_devs or gamedevs@tonplay.io.

Seitaro: In absence of 40 config parameter, default misbehavior fine is 101 TON (reply to 27426)

Vash: Thank you! (reply to 27432)

Tim: Hey guys! We are still stuck on this problem (  Can anyone help with it? (reply to 27413)

Andrew: that repo is for the different blockchain (reply to 27434)

Jerry: Hey guys

Jerry: I have a few questions regards the Ton blockchain.

Jerry: 1. How usually the blockchain distribute node reward. 2. How long it usually takes for unstake the token?

User<6091644102>: I changed router contract address to "EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt". and implement provide liquidity in ston-fi docs to add liquidity pool. finally I implement Swapp in ston-fi docs to swap my tokens.  is there anything wrong? (reply to 27272)

User<6091644102>: yeah. (reply to 27300)

Vinayak Dubey: Hi guys I see all validators offline in mytonctrl status of my *testnet* node. can anyone verify if this is a network issue or an issue with my node?

User<6293792753>: Does anyone need to develop blockchain or build an exchange

Daniil: ❔ (reply to 27448)

Seitaro: Testnet is under attack, it generally works, but not very smooth. Some issues like the one you mentioned is expected. (reply to 27447)

Vinayak Dubey: oh okay thanks for the update I am trying to set up a validator 50k tokens should be enough to enter the active set right? also can you tell me by when the network is expected to be back online?

Seitaro: 50k per round should be enough probably it is expedient to postpone validator tests till tomorrow (reply to 27451)

Vinayak Dubey: thanks a lot

Ilya 🥷: Hi guys. Can you please tell me how I can get mnemonics through privateKey or SecretKey?

Asher: No way ((( (reply to 27454)

&rey: It's impossible – key is essentially hash of mnemonic. (reply to 27454)

Ekaterina: Hello, you want to deploy it in ton network? Please join this group https://t.me/evernode_ds (reply to 27413)

Ilya 🥷: thank (reply to 27456)

Ilya 🥷: thank (reply to 27455)

Ekaterina: You can get the transaction hash by filtering transactions by external inbound message hash you have on your hands before you send it to the network. https://docs.evercloud.dev/reference/graphql-api/query_language#filtration use “in_msg:{eq:”message-id”}” filter for transactions collection   LIke this: https://docs.evercloud.dev/samples/graphql-samples/transactions#get-transaction-by-inbound-message-hash (reply to 27393)

Ekaterina: Same way you can subscribe to it

Developer: thanks (reply to 27460)

Ekaterina: Register at evercloud.dev and you will see TON endpoint in the dashboard, you can play in the playground first (playground button will be in the dashboard)

Ekaterina: We will deploy testnet endpoint this week as well

yasha: Hey guys, How do I switch to testnet in the Tonkeeper ios app?

Victor: 5 taps on icon in settings tab (reply to 27465)

yasha: Thx a lot, that is unexpected UX 🤪 (reply to 27466)

Victor: Not everyone needs testnet (reply to 27467)

&rey: /report (reply to 27471)

Mike: anyone seeing [Error : 652 : adnl query timeout] accompanied by  failed to download archive slice: [Error : 651 : no nodes] ?

— 2023-04-26 —

User<6102427180>: I'm looking for a open position in the blockchain industry. I have experience in developing and securing decentralized systems using programming languages such as Solidity, Rust and Func etc Any leads or suggestions would be greatly appreciated!

ʍ: hi there, thanks for your time.  i’m working in a wallet, using nodejs, that will store >10000 TON address of all users and i want to notify when someone receive a new transaction.  the first try to solve that is request the balance 1 time per second over all ton address (100k)  what do you think?

Mahdi: Hi fellas We've developed a platform named @Challenquizbot  Its our first experience with Blockchain and TON.  We want to spend some funds in order to attract users to use our system so we can get feedback and improve it.  It's a knowledge assessment challenge, which anyone who has an uncustodial ton wallet can join. Users join by paying a participation fee and enter the challenge. Challenge consist of 4 answered questions. The winner is the one with highest correct answers and lowest time. The winner will get 99% of the funds and get listed as the winner.   So I think of spending about 50 Tons and pay 100 people each 0.5 ton to participate and create momentum. Could anyone guide me on how I can do that?

Chacha: I have a question about TON network, does TON support 12 words mnemonic?

***: Is it fixed? (reply to 27450)

Seitaro: Not yet (reply to 27483)

Yang: Sounds interesting (reply to 27478)

Mahdi: Thanks dear Yang  We would be happy to develop it as a DAO  I would be happy to have your involvement of any type.   And other friends as well.  Please fill free to DM me if you have any kind of proposition or inquiry. (reply to 27485)

Chacha: Can I use 12 words mnemonic to generate a TON address?

Victor: You can go with one word, if You want. No matter what to use to generate a keypair (reply to 27487)

&rey: Most apps don't support that, but you can. (reply to 27487)

&rey: TonWeb allows to create keypair, for example.

Chacha: So that means I can use a 12 words mnemonic to generate a TON address? But I saw many ton wallets just only support 24 words mnemonic, if we create an account with 12 words mnemonic, we cannot use it in any TON wallet.

&rey: Yes, you'll be unable to use any convenient interface. (reply to 27491)

Tomer: Hey everyone!  Introducing ProphecyPulse [https://prophecypulse.xyz/] the first ever decentralized social wagering experience on TON - seamlessly place wagers with friends on Telegram!  Until now there was no way to ensure bettors will honor their commitments, our solution, a decentralized social wagering platform - will transform this for ever.   Our platform addresses these challenges by offering a unique solution that combines the power of AI and smart contracts.  1. Effortless betting with AI: Our AI bot transforms group messages into smart contract-backed wagers, making betting as simple as chatting with friends. 2. Blockchain and smart contracts: We built the platform on TON, leveraging the power of smart contracts for decentralized user-created markets, enhanced transparency, and instant on and off-ramping. 3. Direct integration with Telegram: Being directly integrated into Telegram, the platform allows users to create wagers without ever leaving their favorite messaging app.  We'd love to hear your thoughts and feedback! With many exciting announcements and new features on the horizon, we can't wait to work together.. please ping me and we will get cracking!  Check us out: -prophecypulse.xyz , follow (https://twitter.com/ProphecyPulse)  for updates

Oleg: /report (reply to 27500)

James Truong: Hi everyOne

James Truong: I'm having an issue where after creating a new Ton wallet, on the first transfer, I have to check the active state of the wallet and make sure the state is uninitialized. Then, I will call the command await currentWallet.deploy(keyPair.secretKey).send() to activate the address. However, even after this command is executed, the state is still not updated to active. And when the transfer function is called for the first time, it will throw an error, but it will be successful from the second time onwards.

James Truong: I dont know how to update state address after await currentWallet.deploy(keyPair.secretKey).send() run success

ʍ: do you have funds in this wallet? share the address (reply to 27503)

Vladislav: Builders, hello! 👋🏻 Is there anyone in Bangkok right now with projects on Ton?   I'd be happy to meet and talk!🤝

James Truong: Yes I have (reply to 27505)

James Truong: I have 0.015 Ton per wallet

James Truong: I transfer each time to test 0.002 Ton

James Truong: is it too little?

ʍ: you need 0.05, i think

James Truong: Ok I will try it

Yang: Why do I need to log in to Google instead of Telegram? (reply to 27493)

Егор: ✌️

Stefano: Hi, I've heard of TONLend. Is this a project under construction or can it be accessed somehow?

BØØBlick: Hi guys

— 2023-04-27 —

ʍ: anyone knows how is the efficient way to do this check? thanks!

ʍ: hi there, thanks for your time.  i’m working in a wallet, using nodejs, that will store >10000 TON address of all users and i want to notify when someone receive a new transaction.  the first try to solve that is request the balance 1 time per second over all ton address (100k)  what do you think? (forwarded from ʍ)

Andrew: you need to scan all new blocks for transactions from/to your addresses (reply to 27522)

TON Answers Bot (not AI): Approach to adopt when coming from chain supporting dApp to dApp calls/communications? from Chris  Hello,  I'm considering to move my projects from another blockchain to TON but i still don't understand how to handle the asynchrone part. One of my project is a NFT marketplace with 4 dApps, artsits, primary market, secondary market and gateway.  Each dApps depends on data query to each others and some do dApp to dApp calls that changes states on each side.  With TON being non atomic, without dApp to dApp calls since they would be asynchrone, i struggle to understand how developpers tackle this? Does it mean the best approach is to gather all dApps in one? Is there some other options i can study?  🔗 Answer on TON Overflow

Howard: Same question!   How long can we keep a contract in an inactive state if it's in zero balance mode (i.e. after we use SendRemainingBalance) with a mode value of 128? (reply to 19510)

Butcher: what language are smart contracts using here

Andrew: Fift, FunC, Tact (reply to 27527)

Alex: https://docs.ton.org/develop/smart-contracts/#programming-languages

Howard: Tact is more easy to learn tho in my opinion. (reply to 27527)

승재: hello guys. i want deploy func contract at myLocalTon. how can i deploy? so where can i see example? this is my code. "     const client = new TonClient({ endpoint: 'https://127.0.0.1:4443' });      const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0];     const initialCounterValue = Date.now();     const counter = Counter.createForDeploy(counterCode, initialCounterValue);      console.log("contract address:", counter.address.toString());     if (await client.isContractDeployed(counter.address)) {         return console.log("Counter already deployed");     } "

TON Answers Bot (not AI): Whales pool from stalfed  I have a balance on the Whales  pool. Can you take it out?  🔗 Answer on TON Overflow

vrotherford: Hello everyone!  I've faced a weird problem, and really appreciate if somebody help me.  How is it possible that transaction marked as "Success" (https://testnet.tonscan.org/tx/rAUH83HeEoOiCOgUpnUTDN1VWAAvkeGRiecYILiPkFI=). But on the destination address there is no transaction at all? dest wallet: https://testnet.tonscan.org/address/EQCk1NPVs_YsUrVG9Oo33OJMSz4UJIEnpeWPq4YJquUEIW7Z

Daniil: testnet is under a stress test currently, so there are some delays. (reply to 27533)

vrotherford: Got it! Thanks for an answer! (reply to 27534)

Ekaterina: 🔥 Evercloud support for TON testnet  We are glad to announce that Evercloud now supports endpoints for the TON testnet. It is not yet visible in the Evercloud dashboard - that will be in the next release. But you can already use it - it has the same authorization credentials as all other networks.  ☁️ Check out the new TON testnet endpoints: - You can find the new endpoints here. - Your authorization credentials are available in your project settings on the Evercloud dashboard. - Explore detailed API documentation here.

Neo: Hey guys… is there another way to get anonymous numbers other than auctioning through fragment? Like, where did the person first buy the number?

Max: they were sold on fragment initially but now they're only available on auctions

Neo: Got it. Thank you

Oleh: TONCOIN TESTNET ADDED  https://everspace.center (forwarded from Oleh)

Neo: How can you set up a new telegram account with a fragment number ? The first question is country code

&rey: +888 (reply to 27542)

Farhad: node.js vs python ... which one do you prefer to work with ton network?

Beybut: Both of them is good (reply to 27544)

Beybut: Because of count of libraries

Adrian: I prefer python, it is the one that has worked the most (reply to 27544)

Abolfazl: This chat GPT answer for the question of which one is better for developing Web 3 APP on TON network ❓  📌As an AI language model, I cannot provide a definitive answer as to which language is better for developing web3 apps in the TON network. However, here are some factors to consider:  Node.js is a popular choice for building web applications, and it has several benefits. It is fast, efficient, and scalable. Node.js is also well-suited for building real-time applications, such as chat apps, gaming apps, and streaming apps. Additionally, Node.js has a large community of developers who contribute to its development and provide support.  Python is another popular language for web development. It is known for its simplicity and ease of use. Python is also highly versatile and can be used for a wide range of applications, including web development, data analysis, machine learning, and scientific computing. Python also has a large community of developers who contribute to its development and provide support.  Ultimately, the choice between Node.js and Python will depend on your specific needs and preferences. Both languages have their strengths and weaknesses, and the best choice will depend on the specific requirements of your project. (reply to 27544)

Howard: I would say to choose the language you feel more comfortable with when learning. In general, both languages have a similar learning curve compared to Rust.   Just like I choose @tactlang then FunC when I build the smart contract in TON. Because it's easy to get with. (reply to 27544)

— 2023-04-28 —

Nima: What is meaning? Send the link to your TON Wallet repo: How can find it?

Senior Research Officer: only things you "building" is copy-paste, stop shitposting everywhere pretending U r developer. I understand U getting paid for this shit but man how annoying U r.... /exit (reply to 27549)

Farhad: I have decided to use node.js Thanks (reply to 27548)

Butcher: let me try to learn (reply to 27530)

Sergey: Hi guys! I'm currently preparing for a technical interview next week. And thinking of taking some project on TON to practice. If there's either a DEX or NFT marketplace that for some reason doesn't have an automated tester, I can offer to cover some of the functionality without paying for it by Wednesday. I was into it for getgems, but I'm honestly bored just writing tests for myself. I use Playwright & TypeScript, and of course Page Object Model.  Here's a dirty version of how I do it: https://github.com/shoomakov/nft-marketplace-automation-research/blob/master/tests/testnet.getgems.io/flow.spec.ts  Thanks!

— 2023-04-29 —

Oleg: Hello guys) Is there anyone who used this guide? https://docs.ton.org/develop/smart-contracts/learn/deployment

Oleg: because it has missing commands for TONOS CLI but it would be really helpful

Yang: https://t.me/testgiver_ton_bot  something went wrong

Alex: It's not a guide, it's a hidden draft🙈 for an explanation of the deployment process. I'm sorry for this page, but how did you find this? Did you use a search box?  For your question should be useful: https://docs.ton.org/develop/smart-contracts/compile/ detailed guide here: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#compiling-our-wallet-code  And, if you want to learn from video, perhaps, this will be helpful - https://www.youtube.com/watch?v=y5XcaQAwxIQ&list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg (reply to 27562)

Oleg: Wow, thanks a lot) I used a search bar at docs (reply to 27565)

See: Write to me in person who has their own NFT collections on TON.

Nick: Hello, community! Does anybody know is there a tool or bot in TON ecosystem, that allows to offer Telegram private channel access by NFT?

— 2023-04-30 —

Yang: There are a lot of bots like this  https://t.me/ton_frogs_guard_bot (reply to 27570)

Howard: TonicLounge I remember, in Hackathon (reply to 27570)

User<456620184>: Is it possible to create my own  defi/cex exchanges on the Ton network?

Daniil: yes (reply to 27573)

&rey: Yes. Though it requires careful system design. (reply to 27573)

Tomer: referring to sign in? (reply to 27513)

User<6247944943>: 👍🏿

Ilya 🥷: Hello, how can I develop pagination in transactions, maybe someone has an example?

User<5877820224>: hello, do you need a blockchain developer?

User<5877820224>: feel free to contact me

User<5877820224>: It's my pleasure having an opportunity to talk 👋 with you.  Are you interested in blockchain developement or full stack? I am a  engineer with rich experience in crypto space and front-end. I am looking for projects or outsourcing projects to help your projects. Dm me anytime you want if you need me.

User<1901563343>: why toncoin wallet doesn't work

User<1901563343>: I want to send toncoin but it is not sent

User<1901563343>: why toncoin wallet doesn't work

Andy: What doesn't work (reply to 27585)

Andrey🐾🐍: Hi all. Should the id.json file start with 0 or 1? Thank you in advance.

Andrey🐾🐍: And what is the difference between deployer and minter?

— 2023-05-01 —

Thảo: Invalid token. Please try again.  Token looks like this: '12345678:ABCDEfgHIDUROVjkLmNOPQRSTUvw-cdEfgHI'  ..or /cancel

User<6247944943>: what is the route here means in Jetton Wallet?

Andrew: which jetton wallet is that? (reply to 27591)

User<6247944943>: https://tonscan.org/address/EQBIp6Peg0E95xpEkRdIZJhLHk3uMgzdxWA8s5GUTFF1ZkzE#transactions (reply to 27592)

Andrew: well it was a regular jetton transfer, not sure why tonscan labels it with "route" (reply to 27594)

User<5698653231>: It's my pleasure having an opportunity to talk 👋 with you.  Are you interested in blockchain developement or full stack? I am a  engineer with rich experience in crypto space and front-end. I am looking for projects or outsourcing projects to help your projects. Dm me anytime you want if you need me.

Vinayak Dubey: Hi can anyone confirm if the testnet is down?

Vinayak Dubey: mytonctrl shows it to be down

Андрей: https://testnet.dton.io/ (reply to 27598)

Vinayak Dubey: strange. mytonctrl shows it to be down also my transaction from web wallet isnt going through for around the past 4-5 min

Андрей: mytonctrl does not show network status. Only the state of the local validator. (reply to 27601)

Vinayak Dubey: the validator list says no validators are online and the efficiency is also none. from what i understood that might be a sign for network downtime

EB: Hello everyone. great to be here.  I am a solidity developer looking to migrate to the ton blockchain .  Could anyone reply to me with a link to resources to get started with escrow smart contracts on ton?  any assistance would be much appreciated ✊

Anthony: https://docs.ton.org/develop/getting-started (reply to 27606)

Chak: Maybe we could help to move your project to TON tonstarter.com/hi (reply to 27606)

Iliya: Hi   I was trying to create hd wallet using python, but no luck up to this point. Is there anyone here to help me with this ?

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg (reply to 27606)

Zyxep: for now not exist enough resources for funC and fif programming language (reply to 27606)

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsB47mqzF4Z9K8k6HYqPv6Px (reply to 27612)

&rey: Why not tonsdk? (reply to 27614)

Oleg: I guess I just missed that) (reply to 27615)

Milad: hi everyone. i use tonsdk in python to send transaction.  i get this error: {'ok': False, 'error': 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 904A29077D27B144985F1F986E295A3D56DAD504B17F696CFE6B09E5FD236216:\nexitcode=9, steps=20, gas_used=0\nVM Log (truncated):\n...DU 32\nexecute XCHG s2\nexecute NOW\nexecute LEQ\nexecute THROWIF 36\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute LDDICT\nhandling exception code 9: cell underflow\ndefault exception handler, terminating vm with exit code 9\n', 'code': 500}  what may cause this error?

&rey: Your wallet is probably deployed incorrectly (contains invalid data cell). If it is so, funds on it cannot be accessed. Do you have link to transaction? (reply to 27617)

Daniil: Not necessary (reply to 27618)

Daniil: Maybe the library builds invalid cell for message body.  upd: not in this case (didn't notice c4 PUSH at first)

Milad: No. Actually i'm able to send transactions if i create a wallet using tonsdk.  But if i try to create hdwallet using ed25519 and assign privatekey and pubkey to walletcontractv4r2 and then send transaction i face this error (reply to 27618)

Milad: Any idea? Is it wrong to do something like that? So how should I create hdwallet? (reply to 27621)

Milad: https://testnet.tonscan.org/address/EQCQSikHfSexRJhfH5huKVo9VtrVBLF_aWz-awnl_SNiFqcQ Here is a sample child wallet i created.

Aleksandr: Hi! Who could tell, please Is it possible to use TON Connect to webapp? And can I use any webapp constructor like bubble etc. to use it then as TG bot?

Andrew: yes and yes (reply to 27624)

Aleksandr: Thank you!  But now I saw your app! And as I understand I can to use it too? (reply to 27625)

Andrew: yep, you can dm me if you want to learn a bit more (reply to 27626)

— 2023-05-02 —

Vinayak Dubey: Hi can anyone link me to a doc that explains the validator reward mechanism? anyway i can calculate how much profit per month i will be making if i run a validator? thanks

Milad: Hi everyone. Is it correct to create ton wallets using ed25519? And how about hdwallet?  So do i need to deploy contract for each wallet i create using hdwallet?

Em: Hello everyone!. Has anyone faced a problem like this?  https://answers.ton.org/question/1564199555296137216/retrieving-unordered-nft-collection-items-from-ton-blockchain-any-experiences

User<6247944943>: where / how we can fetch the floor price of NFTs on Fragment.com ? Any API for it?

liminal: https://www.youtube.com/watch?v=vHTMZYIHE1M&list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg&index=3

Howard: awesome (reply to 27634)

User<6247944943>: what is the NFT Code of https://fragment.com/numbers?   NftItemNoDns + NftItemNoDns? (reply to 26256)

Howard: Yes, looks like that! (reply to 27636)

Christophe: Thank you 🤗 (reply to 27634)

yakuza: hi

yakuza: IDK how to start with ton-solidity

yakuza: there is no tutorial link neither

yakuza: any one has any resource to learn that except the docs API ?

yakuza: im not undersanding any thing from them too

— 2023-05-03 —

User<6247944943>: Sorry, why 2 bits for src_address? (reply to 27034)

Andrew: because it's an empty address (reply to 27653)

User<6247944943>: more context here? It's like ihr_disabled that haven't able to execute?

Andrew: src_address can be anything because it's set by validators (thus can't be faked), so it's acceptable to set an empty address there (reply to 27655)

Spite: I explained this in tutorial (reply to 27653)

Spite: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#commonmsginfo

Howard: https://answers.ton.org/question/1555046484724944896/what-does-int-msg-info-means-in-this-func (reply to 27653)

Howard: oh good. Yeh, the new docs looks perfect right now. (reply to 27659)

TON Answers Bot (not AI): Understanding the Purpose of the "force_chain" Function in Ston.fi's Core Contract from Howard Peng  In the Ston.fi core contract GitHub repository (https://github.com/ston-fi/dex-core), there is a line of FunC code as shown below:  force_chain(WORKCHAIN, sender_address, WRONG_WORKCHAIN);   Why is this function used to restrict the WORKCHAIN?       🔗 Answer on TON Overflow

Alireza: Hi, I have a question about validators and their performance, and would appreciate it very much if somebody answers.  I realized that in some validation round, the efficency of our validator node stuck to %0.0. Meanwhile, running 'vl' command showed that our server's online-status was 'false'.    What may cause such a condition for our validator?

Rasoul: Hi  gays  how to call  function from smart contract func  in pyhton?

John: https://pypi.org/project/tonsdk/ this should help (reply to 27664)

Roman: 💎 Survey for TON developers  Hey, TON devs! You can improve TON with your experience right now! Especially if you have experience with TON Documentation. Your experience could help us improve it! 💪  The TON Onboarding team aims to create a next-generation onboarding experience for everyone: beginners and experienced developers. We can do that together.  That’s why we’ve created a feedback form. We kindly ask all community members to share their experience with development with TON through the survey.  A survey consists of 10 questions and will take no more than 5 minutes.  Share your experience here: 👉 https://tondocs-survey.paperform.co/

Howard: yeh (reply to 27666)

nonam3e: can smartcontract send a message to itself?

Coalus: yep (reply to 27668)

Rasoul: how to get Bid history a username?(similar fragment.com) I want to  send request to smart contract

User<5815496042>: Thanks Salman Khan ke gane filmi gane chalu karo

Rasoul: help please :( (reply to 27670)

nonam3e: how can I calculate the gas price for get/set operations to HashmapE? https://docs.ton.org/learn/tvm-instructions/instructions for these operations the gas price isn't written

Daniil: It's dynamic and depends on the size of your dictionary. (reply to 27673)

nonam3e: it is clear, but is there a formula to count it? (reply to 27674)

Daniil: No exact formula, but I got something like 600*log2(SIZE) recently in tests (reply to 27675)

nonam3e: is it in gas value? I mean 10^-6 ton (reply to 27676)

Daniil: Yes (reply to 27677)

ʍ: hi there, Does anyone know how to link a domain purchased in fragments to a bot?

Victor: Very strange formula) Dictionaries are patricia trees, so you can have 100 semi-identical values on one branch and they'll weigh little more than 1 value (reply to 27676)

Daniil: Well, I'm probably wrong. Anyway it's better to test them with your values (reply to 27680)

Kate: Hi TON Dev Chat! Is anybody in Lisbon now? Happy to invite you on our new meetup by TON Lisbon Hub!  Join us for a fun and laid-back dinner this Friday at 18.00 PM  Special AMA-guest: Eugene Anisei, a tech entrepreneur and DevRel, co-founder of Tonana DAO and Laaabs   Welcome drink on us🥂  Grab your ticket here – spots are limited🔗 https://www.eventbrite.com/e/ton-dinner-talks-networking-for-web3-builders-tickets-629291276147

— 2023-05-04 —

User<6247944943>: would like to know how to get the price of Number now on Fragment.com (aka, the orders) (reply to 27679)

User<6247944943>: gm, but you can try out https://t.me/testgiver_ton_bot (reply to 27684)

Howard: Does anyone know where we can find the trading volume for Getgems.io for the anonymous phone number?   I checked Getgems.io, but we only found the graph without csv file that can download

Dmitry | backend4you.ton: inspect "developer console" in browser and you'll find this data as json (reply to 27687)

Tse: Is there a easy way to deploy and interact with "highload-wallet"?

User<6002397481>: Nice to meet you 🙋‍♀️🙋‍♀️

Alex: I'm not sure about easy way, but here is an example of the  @aspite guide:  https://docs.ton.org/develop/smart-contracts/tutorials/wallet#deploying-high-load-wallet (reply to 27689)

Ekaterina: 🔥 We are happy to announce that we have launched the ton.live explorer for the TON mainnet!  It's a convenient and multilingual blockchain explorer where you can explore blocks, accounts, messages and transactions in TON, monitor validators and validator elections, and see the general network status and account type statistics overview.  🌐 Check out our TON network explorer on ton.live.

Yang: The site appears to be unfinished and many features are not yet available.  Also...it's always Loading. (reply to 27692)

Yang: But a lot of information is still useful.

Ekaterina: This is the goal (reply to 27694)

Ekaterina: Some pages are loading because they are not preprocessed and are aggregated from real-time data (reply to 27693)

Tse: I'm curious how do you calculate the collected fees for each block? When I manually calculate it by adding up the total fees of each transaction in a block, the number is always exactly 1 toncoin lower than the number shows on your page (reply to 27692)

Seitaro: Probably they account for validator reward subsidy that is 1 TON per basechain block and 1.7 per masterchain block. So it is more like "what validators get", not "what users spend" (reply to 27697)

Arsen: Hello Everyone. I go a question. I am trying to send some ton from my deployed wallet to one wallet which contract is not deployed yet. But somehow money gets back. Can you explain me why.   I am using tonweb.js  library    First screenshot is the scanner , second one code that sends.   Is it the sendMode ? and what that values does.

Howard: the TON will return back since the receiver(contract) is not activate successfully.  more specific will be, the contract probably set with "bounced" if the message you sent to is not the right message format tho. (reply to 27699)

Arsen: but i need some tons on that inactive account to activate it right ?

Howard: In your situation, you didn't initialize it successfully. What is your FunC  or Tact code for it?   The WalletV3, V4 standard code will be activate once your send the TON to it without any further message formate etc. (reply to 27703)

Max: you need to send an unbounceable message but idk how to do that it tonweb (reply to 27703)

Arsen: as i can udnerstand i need to send a non_bounce transaction. but can't find how to do that with tonweb , it had something with sendMode parameter

Max: no sendMode is not it

Arsen: it's simple v4R2 wallet ( at least it had to be when it has some tons to activate the contract) (reply to 27704)

Arsen: i found the issue thanks @krigga and @howard_peng. I did mistake and was trying to send to the bounceable address instead of nonbounaceble . Thanks for the response.

Артём: Hi all. I have one question. I really need to write a smart contract on solidity for deploying nft collection to getgems?

Артём: I just asked chat gpt and he talks that i need to write a smart contract for deploying my nft collection

Daniil: Chatgpt has very limited knowledge about TON

Артём: And also one question. I'm created ipfs node, and my nfts and metadata was uploaded to my ipfs node.  So, metadata loadded with status "success", but images not founded

Артём: Has any limitations by size for deploying NFT's on TON? (reply to 27713)

Daniil: Size of what exactly? (reply to 27715)

Артём: Weight of my nfts is 30mb (reply to 27716)

Артём: it's ok?

Артём: 1 nft = 30mb

Артём: All collection == 160gb

Daniil: Do you want to store it on-chain? (reply to 27717)

Артём: nono, ipfs node (reply to 27721)

Daniil: Then it doesn't matter (reply to 27722)

Артём: ok thx (reply to 27723)

Mr. Alexander: sorry for the stupid question, but where can I see the minimum bid tone to become a validator?

Alex: Short answer: a different value is required(~400 000 Toncoin) for each Validation Cycle.  Detailed answer: > To get a reward Validator should:     1) Win Validator election of the validation cycle     For winning the election, the Validator should:             a) Successfully submit election - requires 10k TON min             b) Win the election with a minimum of 400k(sometimes people write 300k+) TON, and also don’t be excluded because maximum validator qty on election reached. These 300-400k values mean you need to win the election after all.         2) Successfully validate blocks the whole Validation Cycle.  The following links may be useful: - https://ton.org/en/validator - https://docs.ton.org/participate/network-maintenance/staking-incentives#positive-incentives - https://docs.ton.org/participate/run-nodes/full-node (reply to 27725)

Arsen: I have one more question about TonWeb js library.   Is it safe to use ? I mean does it handle signing process on my machine or it does remotely ? are my keys safe while using tonweb.

Max: it does signing locally on your machine

Tim: Tonweb uses tweetnacl for signing

Arsen: thank you very much

Arsen: I need help to understand 1 thing in TON. In other blockchains , let's say for example Bitcoin. Each transaction has 1 transactions ID (hash).   if i send from A to B some BTC , then query both addresses i will get same transaction id for both account.   But as i can understand it's not the same for TON.   I send from A to B some Ton coins. When i query A addrress i got X transaction id, when i query B address i got Y transaction id. So it looks like my one action ( sending ton from A to B ) created 2 tx ids. From sender side it has 1 IN 1 OUT messages, and from receiver side it has 1 IN message.    Is there any doc why it works like that and if somoene knows the answer will be happy to hear.

— 2023-05-05 —

User<5437246449>: Hello every one here

E: Hello

Daniil: Contracts in TON interact using messages. When contract receive message, the transaction is created on its account.  For your example with simple transfer of Toncoins, here's what happens:  1. You send external message to your wallet contract A  2. Contract A receives that message and transaction TX1 is created. Contract A sends a message to contract B while processing TX1  3. Contract B receives that message from A and transaction TX2 is created. Contract B does nothing on receiving these Toncoins, so no more messages are created in this case (reply to 27731)

Arsen: Is there any hash or identifier that connect those three actions ? Because in reality 2nd and 3rd actions happen because of 1st ( my external message ) action. (reply to 27734)

Daniil: You can get the output messages list for any transaction. Just find the required method in API you use (reply to 27735)

&rey: Blockchain itself does not track full causality chain, and by the way reality also does not. (reply to 27735)

meibing: hello, I want to  sign a transaction offline and send it online,  is there any demo codes or docs?

Daniil: well, it always happens that way. what library do you use for interactions with TON? (reply to 27738)

meibing: ton ton-crypto ton-core buffer

meibing: I use node.js

Daniil: in this example from README.md, they create transfer object which is already signed and can be sent later via send method of wallet. (reply to 27740)

meibing: ok, I will try it, thank you

Chacha: Can I use tonweb-mnemonic in react-native?

Chacha: I got an error like this ' error:  [TypeError: Cannot read property 'importKey' of undefined]' when trying to use this method mnemonicToSeed.

Amir: Thank you to all who contributed to the creation of the Tact language. I love Tact, and now I understand what's happening with Ton. 😬

liminal: https://www.youtube.com/watch?v=l_Vl1XHQ36k

Christophe: Thank you :) (reply to 27748)

Delta: anyone can use tonview?

Delta: no tx history now

Zyxep: Is there a learn2earn project on ton blockchain?

Zyxep: Earn tokens by learning blockchain (reply to 27753)

Denis: Hello!  We are building a Telegram bot to automate scheduled transfers between TON wallets using the library from npm called 'tonweb'. We've encountered an issue with executing simple transfers. Can someone please help us understand which specific API functions we need to use in order for our bot to perform automated transfers from our wallet to any other TON wallets?  As a side note, we've tried using the method minter.getJettonWalletAddress(my_wallet_address) and encountered an error in the parseBocHeader method: "Cannot read properties of undefined (reading 'length')". Unfortunately, this is just the initial stage, and we haven't even reached the wallet access and sending part yet.  Any guidance or examples would be greatly appreciated. Thank you!

Dmitry | backend4you.ton: Is there any working ton site hosted in ton storage?  * I have a storage node & bag there, this bag can be obtained from network by other nodes - so ports etc are Ok * I set "site" dns entry to bagId (with checkbox 'hosten in ton storage')  But site doesn't open via public ton proxies, and I can't make it working via rldp-http-proxy (it generates too many logs and I can't find anything there)

Tim: Try tonutils proxy

John: Standard proxy doesn't work with ton storage sites. Tonutils proxy do, but mostly it can't download bag with your site (reply to 27756)

Dmitry | backend4you.ton: that was one of my ideas and I tried to run storage daemon on my desktop and it successfully added/downloaded bag from my remote server... installing tonutil proxy now.... (reply to 27758)

John: It's common problem. Many people hope that this will be fixed soon

Dmitry | backend4you.ton: i have vps with public ipv4, i opened 333 port on firewall, then i run second storage on my win laptop and asked it to get my bag and it succeeded (reply to 27761)

Dmitry | backend4you.ton: 🎆 it works via tonutils ! thank you!!! (reply to 27757)

Javad: where can i get history of transaction of contract ?

— 2023-05-06 —

meibing: hello, why it returns  500 error when I send a transaction in testnet rpc https://testnet.toncenter.com/api/v2/jsonRPC

Milad: hi everyone? how can i calculate fee for transaction in ton blockchhain? and does ton blockchain has refund?

Nikita: Example:  https://github.com/tonkeeper/tonkeeper-web/blob/b22bbd7d7e4bdd852467fd69bbb52b539e509590/packages/core/src/service/transfer/tonService.ts#L92 (reply to 27775)

Milad: Thanks. How about python? :)  And if i set much fee for a transaction will the extra amount come back to my wallet? (reply to 27776)

Nikita: In ton transaction fee amount is fixed, and charge automatically when you send transaction. You can’t set much fee (reply to 27777)

Nikita: In case you would like to handle  income amount in target smart contract, you should develop it on a smart contract level, in func or tact languages (reply to 27777)

Nikita: For example NFT contract  https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/nft/nft-item.fc#L91 (reply to 27777)

Milad: Actually i try to send all the balance of a wallet to another(to empty the wallet). So i should calculate the fee to send the rest of the balance. I mean: Balance = Fee amount + transfer amount If i send all the balance the transaction will not be successful and if i don't set the fee truly there will be a small amount remaining in the wallet (reply to 27779)

Milad: In my use case there is no NFT or smart contracts. It is a simple wallet that has toncoin

Andrew: use send mode 128 to send all remaining balance (reply to 27781)

Howard: anyone know where can get the TradingVol from https://fragment.com/?

Milad: Thank you. This solved the problem 👍 (reply to 27783)

Howard: Since the vol on getgem.io is not include the vol on Fragment.com right? (reply to 27784)

Milad: https://testnet.tonscan.org/address/EQATHECZlczqHatAyjAwZLStuJtdaXnha1rKaYZ72gqAlTV6  Look at this wallet.in the last transaction I got 2 tons as faucet. But the wallet balance is less than 2. What happened?  Before faucet the balance was zero.

Daniil: Fee (reply to 27787)

Milad: It is an incoming transaction. How can it be fee? (reply to 27788)

Daniil: storage fee + gas fee (reply to 27789)

Rasoul: Why can't you see the source code of NFT? https://tonscan.org/address/EQBExp5WMzlyMr8Z1Q7dYq0tJ2M-RDOhrlBleEzMaAk3Bkxw#source

Daniil: You can (reply to 27791)

Rasoul: how !! (reply to 27792)

Andrew: https://github.com/TelegramMessenger/telemint/blob/main/func/nft-item.fc (reply to 27793)

Rasoul: How did you find out that this source is related to this NFT? (reply to 27794)

Tim: just verify it yourself with verification tool

Daniil: You can try uploading it into verifier on tonscan (reply to 27796)

Daniil: And after that everybody else will also see that code is verified. I wonder why nobody did it before

Rasoul: I did not understand exactly where the problem is, can you help me? (reply to 27799)

Daniil: There are more files used to compile that contract than just "nft-item.fc". (reply to 27800)

Rasoul: Does that mean if I upload the whole project, will it be verified? (reply to 27801)

&rey: Within verifier, you verify code of a single contract; for that, you need to provide all files used during its compilation. (reply to 27802)

Chacha: Hi, how can I get ton testnet coin?

Alex: https://t.me/testgiver_ton_bot (reply to 27804)

Rasoul: Hello friends How can I get the whole list of NFT telegram numbers?

John: Hi!  https://tonapi.io/v2/nfts/collections/0%3A0e41dc1dc3c9067ed24248580e12b3359818d83dee0304fabcf80845eafafdb2/items?limit=10&offset=0 (reply to 27808)

Y̷A̷M̷I̷: Guys how can I create a website in my ton domain?

David: Wait a little bit, video out soon😊 (reply to 27810)

Y̷A̷M̷I̷: Thank you 🩵 (reply to 27811)

Y̷A̷M̷I̷: I hope ton is also working for a platform building for sites domains😂👍

Arsen: How can i get all possible send modes and their meanings ? (reply to 27783)

Alex: https://docs.ton.org/develop/func/stdlib/#send_raw_message (reply to 27814)

Arsen: Thanks 🥳 (reply to 27815)

— 2023-05-07 —

Developer: How can I use V4R2 address transfer TON in my code? I only see examples for V3 address

Andy: Why are swap fees so big on TON DEXes? Basically on any DEX it costs a little over 0.1 Toncoin (or even more on some) to make a swap. On other chains like Osmosis it really costs fractions of cents to make a swap.

&rey: It's really hard to do anything with less than 0.1 TON. In particular, as far as I know, DEX swap involves sending two jetton bunches, and each jetton transfer involves 3 messages (main account —> jetton wallet —> recipient's jetton wallet —> returning excess TON to main account). So, there are at least 6 messages, that is, 0.017 TON per message. (reply to 27827)

Daniil: What do you mean? (reply to 27825)

Daniil: Yeah, you can just click on it to switch to this version in tonkeeper. (reply to 27830)

Developer: I mean to use V4R2 address by code (reply to 27831)

Daniil: You want to send coins to it? (reply to 27832)

Developer: No

Developer: I want to transfer coins from it to other address

Daniil: Which library do you use? (reply to 27835)

Developer: https://github.com/ton-blockchain/ton/blob/e6f2205dbf5c1b8e4e7320feebadb979838327f1/tl/generate/scheme/tonlib_api.tl#L63 (reply to 27836)

Developer: Not V4

Developer: Only v3 can be found here

Andy: What would the ecosystem do if Toncoin were to grow, for example, to 10$? Surely it'd be hard to achieve the mass adoption goal when a simple swap would be more than a dollar... If I remember correctly, there's a gas price in the network config, could that be lowered in that case? 🤔 (reply to 27828)

&rey: 1. Yes, gas price could be lowered, or 2. Gas providers will probably be created, which would allow to do jetton operations at lower costs, or 3. Jetton operations will be optimized. By the way, do common users do so much swaps that $1 is really significant? (reply to 27840)

Andy: What's a gas provider? haven't heard of that before.  And yeah, I think it'd be quite significant for common users, as their sums wouldn't be that high. E.g. if someone is exploring the ecosystem with 10$, it'd really be weird to spend 10% of their balance only on the gas fees per swap. (reply to 27840)

&rey: Jetton providers allow users to do operations on their jettons with external messages (without sending TON from their wallet) for a little fee. (reply to 27842)

Andy: Looked up that post again. Yeah, that's a great idea. Thank you for the talk. (reply to 27843)

— 2023-05-08 —

meibing: hello, I make a ton transaction on testnet, but why send it failed?

Tom: incase you need bnb testenet i have that just pm

Gulolio: Hi guys one question here, is FunC sensitive to spaces? Let me explain better, following TON Hello contract tutorial, here, when I try to compile the code in this line: save_data(counter + 1);  If write this line without spaces like this:  save_data(counter+1);  I receive compilation error like in this screenshot. Then if a place the spaces, it compiles without issues

Max: yeah, in general if you want to apply an operator to some sort of expression, put spaces between the operator and the operands, and also it's a good practice to surround stuff with brackets if it's not already surrounded by them (reply to 27850)

Max: func allows a lot of characters in the names of variables that other languages do not normally allow

Andrew: I suggest reading "Identifiers" section here - https://docs.ton.org/develop/func/literals_identifiers (reply to 27850)

Gulolio: Thanks man (reply to 27851)

Gulolio: Super helpful this stuffs (reply to 27853)

pid | ton: I'm a beginner, and please advise me, I should start from FunC or Tact?

Howard: Both (reply to 27856)

Tim: Both (reply to 27856)

pid | ton: I feel like there are two camps, and maybe that's just my feeling. (reply to 27856)

Tim: You can't write tact without understanding func (reply to 27859)

Max: well I guess you could, but writing in tact without having some general knowledge of ton and/or func could lead to unexpected things and undesired results

Asher: https://www.youtube.com/watch?v=y5XcaQAwxIQ (reply to 27856)

Vinayak Dubey: hello! can anyone tell me or refer me to any doc that i can use to calculate how much my validator will be earning in rewards? is thr any rewards calculator available for ton validators?

муха: Can anyone give link to chat, where talks about usdt and trc20?

Gkiokan: Guys quick trouble and I am really lost and can't get it. It's a method in a vue component and I am using @tonclient/core package to resolve the wallets.   For a configuration I need to get a list of all avaiable supported Wallet Types but this doesn't resolve me anything at all. What I am missing?

Gkiokan: It does work actually on my node instance for the TG bot, but not in my SPA? Makes no sense and I can't debug it down as it does nothing

Ignat: Guys hi! Does anyone know if there is an analog of a constructor in FunC like in Solidity. I’ve tried to declare a main function btw, but got an error «main is already declared»

Gkiokan: Ask chatGPT and paste your code it can fix it probably asap. (reply to 27867)

Ignat: but I just want to know, I thought that it is the most basic stuff in FunC and u guys could help me

Coalus: It's a bad idea to use ChatGPT while coding for TON, because he don't know much information about TON   in this case, you are using outdated library (reply to 27865)

Gkiokan: Yea agree on that. I am sorry I never touched Solidity but tried to give you a hint what I would look at before you wait for an answer of someone who knows the answer.

Ignat: and chatgpt is not familiar with FunC btw🥲

Gkiokan: yea just checked the git repo and the ton client is archived state, didn't got any notice about that. But the ton lib is actually in my Node TG Bot implemented for internal payment split process (custom shop system) however it does still work? Should I be worried? oO (reply to 27871)

Gkiokan: `AllWalletContractTypes.toString()` btw, this does work on node instance but can't get the buffer running on the browser variant -.-"

Ignat: Guys, does anyone know how to define a couple cells in the storage of my smart contract?

Ignat: How to store a second cell in «data»

Daniil: You can use storeRef() (reply to 27877)

Ignat: thx bro

Ignat: up to 4 Ref I can store?

Daniil: You can use references to store any amount of cells. (reply to 27880)

Daniil: For one cell - 4 refs is a limit

Ignat: kk got u

Daniil: But you can store refs in these cells too

— 2023-05-09 —

meibing: It returns a 500 status code error with this demo code, do you know how to solve it? (reply to 27742)

TEAM_Psi_2: guys how to estimate gas fee when sending ton using tonweb..

doni: one way to solve it , is to make sure the contract is returing change … (reply to 27886)

doni: see jetton architecture … and jetton wallet

doni: specially

Behrang: Is there any changelog for history of config params in main net?

Reza◭: What this problem?

Daniil: Why are you asking that here? Also, just read the text. (reply to 27893)

Reza◭: 😂😁 (reply to 27894)

Daniil: ? (reply to 27895)

Beybut: /report (reply to 27897)

Chacha: How to get ton coin price by Ton API

Chacha: ?

John: Coinmarketcap's API. But it's limited, maybe there's a better way (reply to 27900)

Andrew: https://tonapi.io/v2/rates?tokens=ton&currencies=usd (reply to 27900)

Oleg: Hey guys! Is the advertisement of my own project launch here is appropriate? It’s connected to TON

Chacha: ok, thanks，let me try it.

PlanL: Huh?!! Venom network is using FunC? 😐😂

Andrew: venom is tvm chain (reply to 27906)

PlanL: So "Threaded Virtual Machine" and "TON Virtual Machine" are the same? (reply to 27907)

Daniil: Mostly, yes. (reply to 27908)

Andy: Venom seems to have a lot of similarities to TON... I wonder how Venom will affect TON and Everscale. Regardless, having another asynchronous blockchain will surely be interesting 🥳  Edit: huh, after looking at their github, it appears as if Venom is just an Everscale fork? Weird ... (reply to 27906)

— 2023-05-10 —

meibing: hi,guys, do you know how to calculate the hash of a transaction? I try to call the method Cell.hash()  but it's incorrect

Howard: anyone got this error before?   ...c/BitBuilder.js:36             throw new Error("BitBuilder overflow");                   ^ Error: BitBuilder overflow  Thinking that I should update ton-core?

Dario: if you are writing a buffer, be sure to not exceed 1023 bits (reply to 27916)

Howard: 64 bits + address store, not exceed right? But I think this is not a good way to implement since it's offchain data.  But thanks, let me check more in `buffer` data type tho.

Dario: No, shouldn't exceed. Addresses are 267 bits long, error is somewhere else

nonam3e: Your question is more related to another chat https://t.me/toncoin_chat (reply to 27924)

J.S ARAUJO CONSTRUÇOES E RESTAURAÇOES: Oq eu ganho com isso

Henry: Hi, I have exitcode=36 when sending a transaction. what does it mean?  there is no 36 in the list. https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes. THis is the full error: {   "ok": false,   "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction C584BD01F135335152E0E675DD0910262FC25EE609953798C2AD65A6D40FE22B:\nexitcode=36, steps=13, gas_used=0\nVM Log (truncated):\n...CTPUSHCONST 19 (xC_,1)\nexecute DICTIGETJMPZ\nexecute PUSHPOW2 9\nexecute LDSLICEX\nexecute DUP\nexecute LDU 32\nexecute LDU 32\nexecute LDU 32\nexecute XCHG s2\nexecute NOW\nexecute LEQ\nexecute THROWIF 36\ndefault exception handler, terminating vm with exit code 36\n",   "code": 500 }

Victor: Your transaction has expired. Try again. It's usually valid for 60 seconds. (reply to 27927)

Javad: is it possible to use TON Network for socket connection with my backend service ? i have client-server service witch client connect to server with socket and i wanna know is it possible i use TON Network for connection my client to my server

— 2023-05-11 —

meibing: hi, guys,

meibing: I sent a ton transaction on the testing network. When the amount sent is less than the sender's balance, the transaction will not succeed, and the sender's balance will continue to decrease. Why is this?

Howard: do we have similar website like https://minter.ton.org/ in test net?

Andrew: https://minter.ton.org/?testnet=true (reply to 27933)

Howard: oh, TonKeeper didn't support with Alt-jetton. It's hard for people transfer the funs easily (reply to 27934)

Andrew: enable your token in the Tonkeeper settings (reply to 27935)

Howard: oh wow, didn't notice they have this feature now

Howard: Finally👍🏿

Doctor Delpy: Does tonapi allow 1 request per second without authorization for the new version API? I want to query a list of NFTs belonging to a user on the frontend, as I don't have the budget for a paid api.

Andrew: 1 per 4s (reply to 27939)

Doctor Delpy: Thank you! Hope they don't change that anytime soon (reply to 27940)

Dario: Hi guys! The FunC compiler has a bad behavior and I think its time to find a solution for it. When you define a function, and you dont use it in your code, the compiler doesnt actually removes it from output asm, and this make boc size bigger (and since in ton we pay storage fee, its bad). Now, I think it can be solved by a Fift script, that hiterate over asm output and removes unused functions (by checking code of recv_(internal/external) and ticktock bodies). But fift is hard. Has any1 worked on something like this or has some good experience with Fift language?

nonam3e: I think it's easier to check it while compiling to fift (reply to 27942)

Dario: but the compiler (currently) doesnt support it. No warnings or anything like that. Maybe you mean by making a tool that analyze code? Imho can be done, but you need to write a grammar for func.. and write all stuff. Probably a fift script is easier (reply to 27943)

Andrey: https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif#L1378 AFAIK this is exactly for that (reply to 27942)

Dario: but.. its not enabled (?) since the boc is clearly big bydefault. there is clearly no warnings even running from cli (reply to 27945)

Dario: maybe tools (func-js) ships with an old or custom version of it?

Behrang: I tested a sample and the redundant function was removed. Are you sure your function doesn't have method_id?

qpwe: 👋 Hello everyone,  We've created a 60-second video on how to buy a ton. Your support and suggestions for improvement are highly appreciated 🤝  📹 Click

Dario: Did you checked asm? (reply to 27948)

Behrang: No, just checked the BOC output size.

Behrang: I used func to compile and looked at fift output. Unused functions are there.  In my previous test I used blueprint and checked the output size. I don't know how but it looks like blueprint output removes redundant code. (reply to 27950)

Andrey: Fift optimizations works on boc compile level, so you don’t need to check ton asm generated by func compiler. Output boc after running fift must be fine (reply to 27950)

Chak: Does anyone knows how to connect different wallet in https://github.com/ton-community/blueprint for deploy?

YVN 💹🧲: Hi all. Who writes swift  here ? Already tried to call functions from smart contract via mobile app? Faced with difficulties, can't find example how to check balance and call functions from specific smart contract via EverscaleClientSwift library. Who can help me with this? It would be very much appreciated!

TEAM_Psi_2: Hi all.. I'm new in ton blockchain and I'm using ton web how can I get the tx hash after sending ton using tonweb.?

Max: different than what you already connected? if so, rm -r temp (reply to 27954)

Henry: Hi is it possible to calculate input and output message hash before sending it. For example, this is my transaction https://testnet.tonscan.org/tx/op5iqZD9X7zsYGFRc0g9R8w2hLiM8Kt3Af10-VZr0Vg= I would like to get jhibs80fCur+fC1q9fgOjjvl43F8ZbcjLfljtzAXYzE= and +lNc/MYo+/G5HGLke13XNgmwvi4W55fc7hGTN1uV6ks= before sending. is that possible?

Cpperg: Hello guys this is my startup  TONBanking Bug Bounty Program  PHASE I 💎🪲  Developers and security experts, we invite you to participate and assist us. Jump in our devs community: https://t.me/+kTPumj6vMwQ3NmIy  After this 💰 TONBanking agent will contact you to transfer the test tokens to your wallet.  Scope, rewards, duration:   • Scope: Website, API, Web app, Smart contracts, Backend systems  • Severity levels: Low, Medium, High  • Bounty range: $30-$2000 (TONB equivalent)  • Duration of Phase I: 2 weeks  Step-by-step mechanics:   1. Research the scope of the bug bounty program.  2. Find a vulnerability using ethical hacking techniques.  3. Document the vulnerability details.  4. Submit the vulnerability report through the bot @tonbanking_bot using /bug_report command,  visual evidence (screenshots or video) is required.  5. Wait for a response from the TONBanking tech team.  6. Provide any additional information or assistance needed to validate the vulnerability.  7. Receive the reward based on the severity of the vulnerability after the project launch.  8. Keep the vulnerability confidential until TONBanking confirms it and releases a patch.  Key Links for TONBanking Bug Bounty Program:  1. Join devs community TONBanking CORE:  https://t.me/+kTPumj6vMwQ3NmIy  2. Report a bug: @tonbanking_bot   For the complete TONBanking Bug Bounty Program rules, please visit the following link:  https://telegra.ph/TONBanking-Bug-Bounty-Program-04-27

Chak: yeah, that works, thank you 🙏 (reply to 27957)

User<5897177820>: @CryptoBot

𝐴𝑅𝐸𝐹 𝑆𝑆: https://t.me/TelePayCash/94 🥲

Andrew: time to switch to Tonpay (reply to 27962)

𝐴𝑅𝐸𝐹 𝑆𝑆: Tonpay? (reply to 27963)

Arsen: Hi guys, which libraries are good to use for Ton Connect 2.0 in web ?

Andrew: https://github.com/ton-connect/sdk (reply to 27965)

Arsen: thanks (reply to 27966)

Javad: where can i read more about TON Network ? i read doc of website and whitepaper but i need more data and how can i work with it

Daniil: Documentation (reply to 27968)

Javad: where ? (reply to 27969)

Daniil: docs.ton.org (reply to 27970)

Javad: can i use TON Network as middleware for my socket program ?

Javad: forexample i have chat program. can i use TON Network for my chat program ?

Javad: @Gusarich

Daniil: Read more about ADNL in whitepaper (reply to 27973)

Javad: Can i ? if yes then i go to read about it (reply to 27975)

Daniil: Theoretically yes, you can build a chat app that will work through ADNL. (reply to 27976)

Javad: i already run a proxy and it's work for my http website, but till now i do not success to connect socket

Javad: with ADNL or RLDP ? (reply to 27977)

Javad: is there any sample code for socket connection over TON Network ? (reply to 27977)

— 2023-05-12 —

User<6102427180>: Hello, community! 👋  I am a  blockchain & full stack engineer with 5+ years of experience. I am confident in contract development, dapp, cex projects, nft token , nft marketplace and web3js integration. I am also good at front-end development.🎉 I will do my best for you if you offer me any tasks or outsourcing project. Please dm me, if you need me.

YVN 💹🧲: Hi guys! Are there any IOS developers here? We could share knowledge and our progress would go faster!

deFRAG: Hello TON Devs!  We have exciting news to share — 💰 TONBanking's testnet is officially live!   In our pursuit of secure and innovative crypto payments, we're launching a Bug Bounty Program Phase I with a prize pool of $5,000.   We invite all developers and security experts to participate and assist us.  Join the Program in our private chat of TONBanking bug bounty program:  https://t.me/+Ep0m-qJmA5xkNmQy  After this TONBanking agent will contact you to transfer the test tokens to your wallet.  You can read the full rules here:   https://telegra.ph/TONBanking-Bug-Bounty-Program-04-27  [this message is pre-approved by chat admins]

Oleg: Are there any developers who have any experience working with USDT transfers and wallet creation from python or golang? If so please contact me

Клецка: hi, people! can somebody share me a code of simple echo* smart contract (in func)? *when it receives ton, it sends them back to sender

Alireza(AR4): Hey guys, any body know how to call Ton smart contract in node.js ? Or sample video or file

&rey: https://ton-community.github.io/tutorials/01-wallet/ Working with wallet starts on step 6. (reply to 27993)

Alireza(AR4): Tnx 👍 (reply to 27994)

Alex: I'm not sure about echo example. You can learn something useful from the Proxy contract source. There are TSC#1 task 2 solutions: - https://github.com/nns2009/TON-FunC-contest-1/blob/main/func/2.fc - https://github.com/ton-blockchain/func-contest1-solutions/blob/main/2.fc - https://github.com/crazyministr/TonContest-FunC/blob/master/func-contest1/2.fc (reply to 27992)

Клецка: it looks like one i need. thank you! (reply to 27997)

Nick: Hi, guys, I got a little question about SBTs Is there a SBT collection(for managing SBT Item) smart contract open source?  Or NFT collection can be used for that?

Coalus: nft collection can be used for that (just store correct code for sbt item, when u will mint your collection) (reply to 28000)

Nick: Thank you

Brave: Can someone help? toncli bitstring error...

&rey: https://t.me/tondev_eng/21510 pip install bitstring==3.1.9 Searching in chat can help. (reply to 28010)

Brave: thank's, already did it - helped. (reply to 28011)

— 2023-05-13 —

Javad: How getgems create wallet address witch end with GEMS ?  EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS

&rey: Bruteforce by something similar to https://github.com/ton-community/vanity-contract (reply to 28013)

TEAM_Psi_2: guys can you help me I'm using the ton library in python but get this kind of error..

&rey: Do you have libcrypto.so.1.1 installed? (reply to 28015)

TEAM_Psi_2: I don't .. how to install that..?

TEAM_Psi_2: btw I'm using windows..

Howard: How can we fetch this data which we define in emit from API? (reply to 22413)

Dmitry | backend4you.ton: https://github.com/ton-blockchain/ton/releases/tag/v2023.04 , tonlibjson.dll (reply to 28017)

Dmitry | backend4you.ton: and I guess you'll need openssl library (libcrypto-1_1-x64.dll  from it) (reply to 28020)

User<6002397481>: Hello, Nice to meet you 🙋‍♀️🙋‍♀️

User<6253596971>: I am a senior full stack engineer with rich experience of blockchain. I can build NFT marketplace, locking, swap, staking, farming, bridge, compounding, bonding, NFT staking etc on several chains such as EVM, Solana, EOSIO, TON, Sui plz let me know if you have any works I can do for you

Daniil: Have you ever built anything on TON? (reply to 28023)

User<6253596971>: ofc (reply to 28024)

Daniil: Can you show something? (reply to 28025)

User<6253596971>: ofc, do you need a developer? I know you are a developer of this group (reply to 28026)

Daniil: I don't need a developer. Just want to make sure you're not lying. Your tg account is fresh and I never saw you here before. (reply to 28027)

Daniil: Can you share your GitHub profile?

User<6253596971>: can I DM? (reply to 28029)

Brave: He's not developer of this group. 😂 (reply to 28027)

User<6253596971>: then, why does he want to check my github?

Daniil: You don't have GitHub? (reply to 28032)

User<6253596971>: I have, but I don't feel need to show you

Brave: Someone knows somethink about func lsp for neovim (vim)?  Syntax-highlighting for func: https://github.com/amaanq/tree-sitter-func Lsp for func: ???

Victor: No lsp (reply to 28036)

Brave: Build it plz))) (reply to 28037)

Victor: GitHub copilot helps well (works very strange for my code since recently, but only for mine) (reply to 28038)

Gulolio: Hi guys is there a tool to take disassembled contract code, like the one here, and to generate the funC one?

Victor: it would be useless, because the code will not have any variables and will look very very bad. (reply to 28040)

Gulolio: Mmm ok understood, so there's no way in this specific case, to know the reason why  a transaction to a contract that doesn't have the funC source code failed. Like in this transaction for example.

The hacker: How to play mind game

Victor: https://github.com/TelegramMessenger/telemint/blob/main/func/nft-item.fc There's the source code, I think. There just was no verification (reply to 28042)

Gulolio: Thanks man (reply to 28047)

— 2023-05-14 —

富豪: How to get the public key in TON Connect?

富豪: on frontend (react)

doni: once you have the wallet address   you can call the wallets getter via toncenter api  and recive the public key

doni: 👍 (reply to 28051)

David: Hi all! I run rldp-http-proxy to bring the site up, but I give this:  [ 2][t 1][2023-05-14 04:09:38.749294875][TonlibClient.cpp:2716][!tonlibclient][&!config->ignore_cache_] Unknown LastBlockState: [Error : 0 : Unknown key]  What could be causing this? But it is written in yellow, not red. What could be the reason? Ubuntu 22.04.01 LTS system.

Howard: Anyone where can fetch the data from Fragment.com / getgems.io?   Want to analyze the trend of the Anonymous number in both platform. (reply to 27633)

&rey: 1. You can parse the sites themselves (Python — requests, beautifulsoup4, maybe Selenium); 2. To obtain this information in a better way, you could deploy own blockchain-indexing node. (reply to 28057)

Nati: I've made a utility for PyTONLib (PyTONLib-Telemint) that can fetch some data, maybe this can help you 💎 (reply to 28057)

Rasoul: Hello friends, see this link https://tonapi.io/v2/nfts/collections/0%3A80d78a35f955a14b679faa887ff4cd5bfc0f43b4a4eea2a7e6927f3701b273c2/items?limit=5&offset=0  By using this link, he gets the list of items of a collection. Here is my question  How does it do this? That is, which transactions should be checked to get the total list

Rasoul: Is it a difficult question? (reply to 28062)

Rasoul: there is no one

&rey: 1. To get list of NFT addresses, you need to download the state of collection contract and invoke get-method that returns item address by index. 2. To get NFT owners, you need to invoke corresponding get-method on each contract from step 1. (reply to 28062)

Rasoul: how to  download the state of collection contract 😢 (reply to 28067)

&rey: Probably you should go through the tutorials first. https://docs.ton.org/develop/onboarding-challenge (reply to 28068)

Rasoul: https://tonscan.org/address/EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi#source  in this contract not have method to get items list (reply to 28067)

Rasoul: method: list : get_nft_content dnsresolve get_nft_address_by_index get_full_domain get_collection_data (reply to 28069)

&rey: get_nft_address_by_index is it. (reply to 28071)

Rasoul: I want to get all the list (reply to 28072)

&rey: You need to invoke the method repeatedly increasing index until you reach non-existent contract. (reply to 28073)

Rasoul: It does not seem like a logical method (reply to 28074)

Rasoul: Thank you anyway

&rey: That's why indexing NFTs is expensive. (reply to 28075)

Gulolio: Guys one question here related to Fragment. I put on sale an anonymous number, the price was 199, but I only received 189. Does fragment charge a fee of 10 tons?

Queen 🥚: where i can see ton diamonds contracts?

Queen 🥚: or any other nft marketplace contracts

Gulolio: Yep there's a 5% fee for each sell (reply to 28078)

— 2023-05-15 —

Howard: Only getgems.io open source the code I remember (reply to 28080)

Tim: you can just have v3r2 or highload wallet as your marketplace

Howard: I think you can implement the get method in the smart contract to retrieve the entire list if you build a mapping to store it. However, it's not necessary.  You can pass an Int index to the method and retrieve the corresponding "address". Then, you can check if the address is active or not using an API.  It's better to invest more effort in this off-chain approach rather than storing all the NFT addresses on-chain. (reply to 28075)

Howard: Good question! I don't think it is possible to calculate the input and output message hash before sending a transaction.  The reason for this is that you cannot predict whether there have been any previous transactions that may have altered the contract's data. The state of the contract can change dynamically due to the actions of other transactions. (reply to 27958)

&rey: Sometimes that prediction is possible, however it may produce results differing from actual transaction result. You need to know import_fee (that you can calculate based on message size), and you can emulate the transaction on local blockchain to get output messages list. (reply to 27958)

Danya: Hello. Has someone experienced deploying subdomains for a site on the Ton network?

meibing: hello, do you know how to calculate the hash of a ton transaction in nodejs?

meibing: if in nodejs, it will return a Cell object after signing and call the hash() method of the Cell object to get the hash of in_msg. But I want to find a way to get the hash of the entire transaction (reply to 28086)

Dima: Hey, folks! If I deploy an NFT contract on TON can I pass the ownership of the contract to another account?  Do TON marketplaces check the contract owner to edit the collection properties?

Andrew: yes, you can transfer ownership and it'll be reflected on the marketplaces (reply to 28091)

Dima: Is there a manual how to pass ownership? Is it done via CLI? (reply to 28092)

Andrew: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md (reply to 28093)

Andrew: study "transfer" handler from the nft standard

Milad: hello everyone. i use tonsdk in python to send ton. but if the destination address be Inactive the amount sends back to source address. for example: https://testnet.tonscan.org/tx/by-msg-hash/sMn6VsMGjdG1ucxoyGzsfqKnzr5ntnb_lm7dO9-uTok= how should i solve that?

Andrew: send to non-bounceable address (reply to 28096)

Milad: How can i find or produce this address? (reply to 28097)

Milad: For a simple address that should be the destination

Andrew: ton.org/address (reply to 28098)

Andrew: or use raw address and convert it to friendly form with tonsdk

Milad: Thank you. This solved the problem👍 (reply to 28101)

Doctor Delpy: Did anyone disassemble the payload when putting the Fragment number up for sale? TONAPI provides deserialized information, I would like information on serialization, because it takes a long time to guess the data

Tim: Read contract (reply to 28103)

Doctor Delpy: WTF. Fragment contracts is open-source? (reply to 28104)

Tim: Yes it's called telemint

Doctor Delpy: Thanks (reply to 28106)

Milad: there is another problem with sending the transaction. i use TONCENTER and sendBocReturnHash api to send the transaction.  so i get hash of the transaction. but this hash is for input of the transaction. not for the transaction. for example:  i got hash="1jB29o5zqO2Rz7F5yBvAk8fm1qWUJHaNurI33z52TV0=" from sendBocReturnHash.  but when i open the transaction in the explorer: https://testnet.tonscan.org/tx/by-msg-hash/1jB29o5zqO2Rz7F5yBvAk8fm1qWUJHaNurI33z52TV0=  transaction is "vuyKeoni0Bz19JzNs9znYgREBn51ByGDjy6d7++sh74=". what's wrong? how get this hash?

Tim: Tx hash is hash of transaction cell (reply to 28108)

Tim: Tonconnect hash is hash of transaction inMessage

Milad: So? Is the result correct? Should i do anything?

Milad: Could you explain more plz? What hash should I save as the transaction hash?

Gulolio: Guys I saw that at some point, no idea when I think 2022, there was a contest on smart contracts using funC. In this link, contest. Here there's a list of winners, I would like to know if the solutions for this contest are public. So I can study them and maybe learn something from their solution.

Arsen: Hi Guys. I have a question. Which field of transaction indicates that transaction is jetton not TON using TronWeb js SDK ?

Howard: what is the purpose for this external message use? (reply to 28106)

Alex: https://docs.ton.org/develop/func/overview#contests (reply to 28113)

&rey: It allows to end auction with external message. (reply to 28115)

Arsen: I can't find how to filter jetton transactions from  tonweb.getTransactions(address,limit). Does anyone worked on this part and know how to filter Ton only transactions ? (reply to 28114)

Andrew: use tonapi (reply to 28118)

Marat: https://t.me/tonblockchain/192 (reply to 28118)

Marat: sendBocReturnHash returns hash of the message you sent. With that hash you can find the triggered transaction (and it's hash) at tonscan or using index API: https://toncenter.com/api/index/#/default/get_transaction_by_in_message_hash_v1_getTransactionsByInMessageHash_get (reply to 28112)

Arsen: This examples show how to process specific coins by checking their balances. My issue is that i don't want to accept any kind of jettons at the momet / only toncoins accepted /  when i am getting all transactions using tonweb ( toncenter api provider ) i don't see any fields that will tell me that the transfer is jetton.    Maybe i really have to switch to tonapi. But don't know if tonweb supports tonapi. (reply to 28120)

Andrew: try Tonpay SDK then. You'll be able to enforce the currency of the invoice, and only TON (in your case) will be accepted (reply to 28122)

Arsen: not the case for me. It's another payment system so it won't be accepted by my employers. (reply to 28123)

Andrew: it'll save you (and your employers) a lot of time, but the choice is yours 🍊 (reply to 28124)

Gulolio: Guys what is the difference between load_uint and preload_uint? As I see in the standard library, both of these functions are implemented on compilator level. But when should be used one and the other not, and if they equivalent, why to have two of them, and not just the most optimal?

Marat: load* functions move slice reading pointer after reading, so the next read would read further data. preload* don't modify slice and reading pointer stays where it was (reply to 28126)

Gulolio: I see, so is it correct to assume, that if I don't need to read further data, then I could use preload* and be more optimal right?

Marat: I guess they consume equal amount of gas, so it doesn't matter (reply to 28128)

— 2023-05-16 —

TON Answers Bot (not AI): What are the advantages of an asynchronous blockchain like TON? from Jeremy  One of the primary differentiators of TON is the fact that it is an asynchronous block chain. This introduces concepts such as lamport time and crazy ordering schemes that ultimately affect complexity of smart contracts and can open smart contracts to new types of attacks that we don't see on any other chain.   Given these complexities, what are the benefits to developers that work on TON?  🔗 Answer on TON Overflow

Jeff: Hello, are there any teams currently working on lending protocol?

meibing: hello, can we manually specify the fee for ton transactions?

&rey: Yes, see the recent Hack-a-TONx. (reply to 28134)

&rey: No, it's calculated by validators based on transaction messages and config parameters. (reply to 28135)

meibing: thank you. and we can't specify the upper limit of the fee? Set maximum fee? (reply to 28137)

Vatshayan: Hello Team, what is function to deposit amount from one account to another account in javascript ?

Vatshayan: can someone please tell ton method or function name in javscript for transfer amount from one account to another account ?

Vatshayan: Its Important please

Arsen: import TonWeb from "tonweb"; import {generateMnemonic, mnemonicToKeyPair} from "tonweb-mnemonic";   const key = await mnemonicToKeyPair(mnemonic.split(" ")); const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: 'YOUR_API_KEY'})); const WalletClass = tonweb.wallet.all["v4R2"]; const wallet = new WalletClass(tonweb.provider, {publicKey: key.publicKey}); const seqno = await wallet.methods.seqno().call() || 0; await wallet.methods.transfer({     secretKey: key.secretKey,     toAddress: to,     amount: nano, //string amount in nanos     seqno: seqno,     payload: message,     sendMode: 3, }).send(); let currentSeqno = seqno; while (currentSeqno == seqno) { //checks  if transaction is finalized     await sleep(500);     currentSeqno = await wallet.methods.seqno().call() || 0; } (reply to 28142)

Vatshayan: please share function to validate address too

Whizzie🐾: hello Ton dev, I am just learning func, coming from ethereum. I am hoping to build an NFT ecosystem once I am done with my tutorials. But I am just wondering, Is there any form of subgraph for ton??

Arsen: import TonWeb from "tonweb"; const Address = TonWeb.utils.Address;  Address.isValid("your address") (reply to 28144)

Chacha: Hi, where can I get a test nft?

Whizzie🐾: Deploy and mint a collection on testnet😑😑😑 (reply to 28147)

User<1237546490>: Made a new development. Sharing with you for free, open source for the TON community  TON Jetton — Rest API  This development was the result of a long unsuccessful process of finding a workable solution for interfacing with the TON Network and servicing balances, payments and transactions of TON coins and tokens. This solution allows you to easily set up wallet creation, balance checking, payment sending, and transaction statistics output in PHP.  https://github.com/TGRTON/TON-token-Rest-API

Alex: You can find some of them via testnet.getgems.io (reply to 28147)

Freed: Is anyone using fift on arm macos? I'm trying to use it but I'm getting this error. I've installed every dependency listed on docs

Freed: Probably something is wrong with precompiled lib. I recompiled and now it works Thanks everyone (reply to 28153)

— 2023-05-17 —

Chacha: I accessed this website, but it requires testnet, how to use testnet in tonkeepr? (reply to 28152)

Andrew: tap logo 5 times in settings (reply to 28155)

Chacha: ok, thanks

User<6247944943>: for the mainnet api from TonHub, the URL should change?   endpoint: "https://sandbox-v4.tonhubapi.com",

Howard: sorry, why will I get this error when I using TonClient (TonClient4 is fine)   node_modules/ton/dist/client/TonClient.js:289             throw Error('Unsupported stack item type: ' + s[0]);                   ^ Error: Unsupported stack item type: list

meibing: hello, how to restore a boc to a clear string? like this url  https://testnet.toncenter.com/api/index/v1/getMessagesByHash?msg_hash=vWjxItUmX5RA3ROVo6NT%2BzW2%2Fzv0EobGgG%2BIGm020kE%3D&include_msg_body=true

Arsen: HI everyone, This question is not directly connected with development, but as many of you have passed it i will be glad to get an answer here.   I am trying to submit app to ton.app , but there is one field that i don't know what to put ;   Name is CATALOG URL. What's that where i can get valid catalog url.    Thanks in advance.

Gulolio: Contact @pewpells, he helped me with this when I faced the same problem. I think you have to put it in lowercase, for example: tonstarter. (reply to 28162)

Arsen: Thanks. I contacted him. (reply to 28163)

User<5847386827>: I want to make a contract that every time it receives some toncoin it sends the same amount as a jetton to sender address. Just to learn how to work with jettons. How can I send a jetton in FunC?

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg (reply to 28165)

User<5847386827>: interesting (reply to 28166)

&rey: Toncenter and ton-access seem to have a bug. I'm trying to load transactions of address Ef8gIwUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASB6 and only get empty list, while the explorers confirm that there has been one transaction. https://ton.access.orbs.network/44A2c0ff5Bd3F8B62C092Ab4D238bEE463E644A2/1/mainnet/toncenter-api-v2/getTransactions?address=Ef8gIwUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASB6&limit=100&archival=true

Tim: It's not a bug if account was deleted with +32 (reply to 28168)

&rey: The account does not exist at all. Is it the reason why I can't load its transactions? (reply to 28169)

Tim: EQAJ5O7M2mmubR5ZY6AQ4uFgWcpnkH2ZJC7yUZP_07Qt6fO_

Tim: this address also returns empty list, probably really bug

Alireza(AR4): Hey guys . Any body have course ? For , how to create smart contract in Ton network. I don't want ton tutorial

Dmitry | backend4you.ton: creating TON contract without reading docs is very easy - you should buy some TON on any exchange and post your tech.requirements here and somebody will make contract for you (reply to 28174)

Alireza(AR4): good opinion but i want to learn (reply to 28175)

Alex: Here introduced some basics and wallets:  - https://docs.ton.org/develop/onboarding-challenge - https://ton-community.github.io/tutorials/01-wallet/  Detailed guide about wallet smart contract: - https://docs.ton.org/develop/smart-contracts/tutorials/wallet  YouTube: - https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg (reply to 28174)

— 2023-05-18 —

User<6247944943>: is there any dev in Getgems can help?

User<6247944943>: Our collection can't shows properly as the test-net shows

User<6247944943>: already verify here: https://explorer.tonnft.tools/

Alex: Perhaps, you should try to reach them with contacts provided on their site: (reply to 28179)

Gulolio: Guys in nft-item.fc I've found the use of this op::get_royalty_params, what means this :: operator?

Max: it isn't an operator func allows a lot of chars in names of identifiers that other langs do not, such as ':? and so :: is part of the name however, I guess it could be inspired by the C++ namespace delimiter ::

Gulolio: Aaaa so op::get_royalty_params is just a variable? Where :: is part of the name

Max: yeah

Gulolio: Is kind of confusing, but well is what we got. Thanks man

Max: yeah you might also find vars such as found? or ok? or cs' or functions like slice_empty?() don't get confused

Василий: Hello everyone. Please tell me how I can programmatically verify the correctness of the TON address ?

Dmitry | backend4you.ton: what language you want sdk for ? (reply to 28189)

Василий: C# please (reply to 28190)

Василий: If it is possible

Dmitry | backend4you.ton: https://github.com/justdmitry/TonLib.NET/blob/master/TonLibDotNet/Utils/AddressValidator.cs (reply to 28191)

Василий: Thank you 🙏 (reply to 28193)

zzss: How do you think. Will Telegram sell new telegram numbers on the Fragment platform?

User<6002397481>: Hello, Nice to meet you 🙋‍♀️🙋‍♀️

User<6258201532>: Hello . I'm senior blockchain developer have full experience of NFT/DEFI/WEB3 projects on Ethereum , Solana, Aptos, Near, ZkSync, Arbitrum, Sui network

User<6258201532>: if there maybe some works I can be of any help for you , please dm me freely . thanks

— 2023-05-19 —

meibing: hello, how to set a short name with a ton address? like okx

Howard: One example over here, can use Cell.fromBase64 for the string of BOC you got from API! (reply to 28160)

Howard: I think this is a TAG that tagging by the tonscan.org team! (reply to 28203)

순범: can I implement the contract that execute get_method and get the information of other contract or execute a 'call' function like ethereum?

Fortress Calls: hello brothers

Fortress Calls: need help to building a bridge!

Daniil: you cannot execute get-methods of other contracts inside of your one (reply to 28208)

순범: and even calling function of other contract is impossible? I mean call function of ethereum (reply to 28211)

Daniil: you can send a message (like a request) to any contract, but you won't get the result of it in the same transaction. (reply to 28212)

순범: ah, I got it. thank you for kind explaination (reply to 28213)

Daniil: you can read a bit more about messages in documentation:  - https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-message  and also there's a good article explaining differences between Ethereum and TON:  - https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers (reply to 28214)

meibing: thank u very much (reply to 28206)

Maksim: hey guys! we decided to make a course about programming in TON using Python  First lesson: General Python TON libraries review; simple wallet creation, import and deployment; creation of internal messages; simple counter contract deployment and interaction with it  Link - https://www.youtube.com/watch?v=LJqam4eBqyE  Repo - https://github.com/TonDevStudy/pyton-lessons-eng

Vatshayan: How to get API Key in below code ?

Vatshayan: . (reply to 28143)

Vatshayan: import TonWeb from "tonweb"; import {generateMnemonic, mnemonicToKeyPair} from "tonweb-mnemonic";   const key = await mnemonicToKeyPair(mnemonic.split(" ")); const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: 'YOUR_API_KEY'})); const WalletClass = tonweb.wallet.all["v4R2"]; const wallet = new WalletClass(tonweb.provider, {publicKey: key.publicKey}); const seqno = await wallet.methods.seqno().call() || 0; await wallet.methods.transfer({     secretKey: key.secretKey,     toAddress: to,     amount: nano, //string amount in nanos     seqno: seqno,     payload: message,     sendMode: 3, }).send(); let currentSeqno = seqno; while (currentSeqno == seqno) { //checks  if transaction is finalized     await sleep(500);     currentSeqno = await wallet.methods.seqno().call() || 0; }

Vatshayan: From where to get API key ?  Please help !

Arsen: @tonapibot (reply to 28223)

Ruslan: Visit toncenter.com and create api key in bot. (reply to 28220)

Henry: Hi, I am developing a library to interact with smart contract. is there a dex in testnet that I can use to test?

Vatshayan: how to resolve this issue LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

Dmitry | backend4you.ton: every wallet is a smartcontract, you may interact with wallet. (reply to 28226)

Henry: I am basically developing a wallet (reply to 28228)

Dmitry | backend4you.ton: sorry, my bad english - every address in network is a smartcontract. open any address in explorer and if its state is 'active' - you can interact with it (reply to 28229)

101: Hi all, I’m getting an error after attempting a recent update on mytonctrl and can’t access it.  /usr/bin/python3: can't open file '/usr/src/mytonctrl/mytonctrl.py': [Errno 2] No such file or directory  Can anyone help me how to troubleshoot this?

Henry: my point is to interact with it on browser like metamask in Ethereum rather than using explorer (reply to 28230)

Arsen: is it permanent issue or gives sometimes ? (reply to 28227)

Dario: ye, ston.fi has a testnet version of the dex  https://testnet.tonscan.org/address/EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt (reply to 28226)

Dmitry | backend4you.ton: i understand. I mean you dont need "any DEX" smartcontract to test your library with, you may test your library with regular address smartcontract too (reply to 28232)

Henry: The reason I want a dex testnet is because dex may implement Ton Web Wallet provider to interact with browser smartcontract. so it is easier to test in my case. explorer like tonscan does not have it. I want to test ability to interact with smart contract by provider rather than manually calling it from explorer (reply to 28235)

Dmitry | backend4you.ton: got it. sorry, I thought you are making new wallet to interact with blockchain "directly"

Henry: for example, https://app.ston.fi/swap?ft=TON&fa=1 it can read wallet address, balance and call smart contract by interact with UI. I believe it use TonProvider behind the UI.

Henry: I want to develop something like that, but it is hard to do stuff on mainnet. so I wonder if there is a site like app.ston.fi but in testnet

&rey: You can use tx emulation in mainnet (for example, via Tonkeeper) in order to check the library. (reply to 28239)

Vatshayan: My Code :  const transfer = async () => {     try {         const WalletClass = tonweb.wallet.all['v4R2'];         const wallet = new WalletClass(tonweb.provider, {             publicKey: HOT_WALLET_ADDRESS,             wc: 0         });         // const seqno = await wallet.methods.seqno().call() || 0;         let string_private_key = JSON.parse(HOT_WALLET_PRIVATE_KEY)          const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSecretKey(Buffer.from(string_private_key), "hex");         let amountsToTransfer = TonWeb.utils.toNano('0.01');         console.log(amountsToTransfer);         // Create transfer         const transfer = await wallet.methods.transfer({             secretKey: keyPair.secretKey,             toAddress: 'EQDQfus9g97M88HUtU8JHDPHk_YKGo8u7Zs6yrhOHbqXvImS',             amount: amountsToTransfer, // 0.01 TON             seqno: 0,             payload: 'The aim of this text is to provide a brief',         });         // get estimate fee of transfer         const transferFee = await transfer.estimateFee();         console.log(transferFee);         // send transfer query to blockchain         const transferSended = await transfer.send();         console.log(transferSended);          const query = await transfer.getQuery();         console.log(query);          // const boc = TonWeb.utils.bytesToBase64(await query.toBoc(false)); // serialized query         // // await tonweb.provider.sendBoc(boc); // send query to network          // // Parse query          // try {         //     const parsed = WalletClass.parseTransferQuery(TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(boc)));          //     parsed.value = parsed.value.toString();         //     parsed.fromAddress = parsed.fromAddress.toString(true, true, true);         //     parsed.toAddress = parsed.toAddress.toString(true, true, true);         //     console.log(parsed);         // } catch (e) {         //     console.error(e); // not valid wallet transfer query         // }     } catch (error) {         console.log('catch error => ', error)     } } transfer(); Getting Issue after running ton transfer method is :  BN { negative: 0, words: [ 10000000 ], length: 1, red: null } catch error => Error: Invalid character at assert (/home/charvik/codes/tests/ton/node_modules/bn.js/lib/bn.js:6:21) at parseBase (/home/charvik/codes/tests/ton/node_modules/bn.js/lib/bn.js:269:7) at BN._parseBase (/home/charvik/codes/tests/ton/node_modules/bn.js/lib/bn.js:305:14) at BN.init [as _init] (/home/charvik/codes/tests/ton/node_modules/bn.js/lib/bn.js:99:12) at new BN (/home/charvik/codes/tests/ton/node_modules/bn.js/lib/bn.js:39:12) at BitString.writeUint (/home/charvik/codes/tests/ton/node_modules/tonweb/src/boc/BitString.js:118:18) at BitString.writeUint8 (/home/charvik/codes/tests/ton/node_modules/tonweb/src/boc/BitString.js:167:14) at BitString.writeBytes (/home/charvik/codes/tests/ton/node_modules/tonweb/src/boc/BitString.js:176:18) at WalletV4ContractR2.createDataCell (/home/charvik/codes/tests/ton/node_modules/tonweb/src/contract/wallet/WalletContractV4R2.js:66:19) at WalletV4ContractR2.createStateInit (/home/charvik/codes/tests/ton/node_modules/tonweb/src/contract/index.js:51:31)

Vatshayan: Ton Network Blockchain transfer method is not working #2

Vatshayan: https://github.com/toncenter/examples/issues/2

Vatshayan: Hello Team please help

Arsen: publicKey: HOT_WALLET_ADDRESS,             wc: 0         });   i don't have laptop to run the code now , but looking at this code  i can see that publicKey is not the HOT_WALLET_ADDRESS  is not a public Key. Don't know if there is anything else  worng in code or no.   I send you a working example why you are not using it ? (reply to 28244)

Arsen: Use mnemonic string to generate a keypair, instead of keeping hex private key.

Vatshayan: written new code for this   but again same errors       const words = await tonMnemonic.generateMnemonic();     const seed = await tonMnemonic.mnemonicToSeed(words);     const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);     const WalletClass = tonweb.wallet.all["v4R2"];     const wallet = new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey });     const seqno = await wallet.methods.seqno().call()  0;     const to = "EQDQfus9g97M88HUtU8JHDPHk_YKGo8u7Zs6yrhOHbqXvImS";     await wallet.methods.transfer({         secretKey: keyPair.secretKey,         toAddress: to,         amount: TonWeb.utils.toNano('0.01'), //string amount in nanos         seqno: seqno,         payload: "message",         sendMode: 3,     }).send();     let currentSeqno = seqno;     while (currentSeqno == seqno) {         //checks  if transaction is finalized         await sleep(500);         currentSeqno = await wallet.methods.seqno().call()  0;     }

Vatshayan: All other methods are working but transfer is not working

Arsen: now you are generating a new address;  and want to send ton coin from it. It has no contract deployed and it has no ton coin on it. so method MUST give an error. (reply to 28251)

Arsen: let me send full example with comments

Vatshayan: ya please

Vatshayan: we want to integrate ton thats why need ton deposit as transfer method working

Vatshayan: its important

Arsen: https://gist.github.com/sench93/09b127901e4bdd455f08886d7b46b4d1 (reply to 28257)

Arsen: of course error handling is not included in this gist, because various logical and node error can happen which you have to handle yourself. (reply to 28258)

RAM Kumar: Hi

RAM Kumar: Hello

Arsen: Hi.

Gulolio: Hi guys, anyone knows how would be the APY for a nominator in https://tonvalidators.org/??

Cecevl: Hello guys, I have a question, is it possible to give access to a server, via TON, to another wallet with a certain fee of course.

Cecevl: Or is it a token question? (reply to 28264)

— 2023-05-20 —

Songülen: Hello

Tse: V4 wallet supports add-ons/pluggins allowing 3rd party to interact with other peoples wallet within the rule pre set by the wallet contract. Maybe this is what you are looking for/ (reply to 28264)

Konstantin: Hi friends! Please help me, i want to make software which will make transfers from my ton wallet to others, could you help me to find documentation about it. python

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsC-7xbn8b8noZh9a1Xkg42W (reply to 28270)

Konstantin: Thank you!

Nikita: Overall staking about 6.5% APY, by rules nominators keep 40% (reply to 28263)

Nikita: So you APY would be about ~3.8-3.9%  For example in Tonkeeper via Tonwhales poll you may get better conditions (reply to 28263)

Gulolio: Yeap, I was actually thinking that.

Howard: Is there the API we can call to fetch the log-in code we got here:  https://fragment.com/number/....numbers......./code

Gulolio: Guys is there a VSCode to navigate through reference of methods in funC?

Gulolio: This one FunC Language Support doesn't supported, only Syntax highlighting

Chacha: Why can't I send a transaction successfully?

Chacha: I have transactions

&rey: Is destination contract initialized? If not, you need to convert its address to unbounceable form (see https://ton.org/address/). (reply to 28279)

Behrang: What is the max number of out-messages per transaction?  I think it's 255, however, where can I find a reference for it?

𝓢𝓪𝓶𝓾𝓮𝓵: Hello people, I currently have some problems with the DNS domain, and I wanted to stop by to ask, if you can help me with it.  It turns out that after renewing the domain, I can no longer set up the domain as before. I leave you a video so you can check it out!

𝓢𝓪𝓶𝓾𝓮𝓵: I connected the wallet to the DNS website, with confirmation from mobile, and the link is fine. It goes according to the address I use for this confirmation. But for some reason I can't open the settings for it anymore.

— 2023-05-21 —

Chacha: How to fetch user's nft list? I tried this api, but didn't work right. https://tonapi.io

Andrew: tonapi fetches nfts correctly (reply to 28308)

Guafar: maybe your nfts are on mainnet but you are looking for them on testnet. Just simply change the url from testnet.tonapi.io to tonapi.io (reply to 28308)

Chacha: I'm using testnet for nft transfering.

순범: I have some question about nft fixed price sale. what I know is that if user send two transactions, one to his own nft and the other to the marketplace contract, the tx to nft occur ownership transfer to nft_sale_contract, and the tx to marketplace occur the deployment of nft_sale_contract.  but how can I be sure that deployment of nft_sale_contract precedes? I know that in TON we can't predict which tx will arrive first, and ths nft_sale_contract will occur an error if the nft ownership assignment precedes the deployment.  how the getgems or other marketplace control such a condition?

&rey: Here is transaction with 255 out messages: https://tonscan.org/tx/pYkW5auOgMUILpn1obQ0fxWQUFXG5-xIcrHpN_hJMdY= (reply to 28284)

Behrang: Thanks 🙏 (reply to 28314)

Milad: Hi everyone. I send a transaction to testnet using tonsdk and this is the result:  {'ok': True, 'result': {'@type': 'raw.extMessageInfo', 'hash': 'TQlo5aoQgdNMTxnbjJs2Q7cpRajB5Q4B/+mv/fHpiEw=', '@extra': '1684660836.6978266:4:0.5563136092008995'}}  And fee is paid. But the transaction does not happen in chain.  I don't see the transaction and it does not appear in the wallet transactions.  Today it happens.  It was work two days ago. What is wrong?

Milad: Is there a problem with the testnet?

Dmitry | backend4you.ton: Or with explorer? Check in deferent explorers (reply to 28317)

Milad: You were right. thanks :)) (reply to 28319)

Gulolio: Hi guys, I'm reading ton-nominators smart contract, from tonwhales, and have a doubt about what this number means. I'll share the link to the line here:  https://github.com/tonwhales/ton-nominators/blob/0553e1b6ddfc5c0b60505957505ce58d01bec3e7/sources/modules/utils.fc#L195  The code is like this, in the parse_text_command function we have the different checks for the messages, and for example in the check for Deposit, there is this check with a magic number.  throw_unless(error::unknown_text_command(), in_msg~load_uint(48) == 111533580577140); ;; eposit  I imagine the idea is to check if the message is Deposit right? and they are checking for the eposit part here. My doubt is how is that this magic number 111533580577140 translate into eposit.

Dmitry | backend4you.ton: Convert this magic value to Hex and check every byte against ASCII table for “eposit” letters. I guess it should match… (reply to 28321)

Gulolio: Yep, that number translate into eposit in that way. Thanks (reply to 28322)

Milad: What is query_id in highload wallets. How can i generate it? I use tonsdk in python to send transaction

Maksim: in tonsdk you can just specify 0 and library will generate it automatically (reply to 28327)

Maksim: query_id is a timestamp until your message is valid.   in highload wallet you can use it in get method to get “status” of transaction

Chacha: I can get transaction data from this api method wallet.methods.transfer, but actually the nft transfer was not successful, what's going wrong with this?

Chacha: I'm in testnet env

Milad: I get this error when i broadcast the transaction: {'ok': False, 'error': 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 463B682553EFE7C864ACD1BD64D2B0E5E278017A4CCEF0262A3A586D91D1AEE5:\nexitcode=0, steps=0, gas_used=0', 'code': 500}  The wallet is new and i just got a faucet for it. Do you know what's wrong? (reply to 28329)

순범: Do anyone know about it? (reply to 28313)

Maksim: have you deployed your highload wallet? (reply to 28332)

Maksim: btw you can check the example i've made, it can be useful (reply to 28334)

Milad: How should i do that?  I sent transactions using v4r2 wallets. The wallet was deployed in the first transaction by tonsdk.  Should i deploy the highload wallet by myself?

Maksim: you should deploy it by external message if you didn't do it by internal.  is the state of your highload active on tonscan? (reply to 28336)

Milad: No.it is not. (reply to 28337)

Milad: In this example i see the base64_boc  variable. It is not used (reply to 28335)

Maksim: alright, so first  query = wallet.create_init_external_message() base64_boc = bytes_to_b64str(query["message"].to_boc(False)) send this base64_boc to the blockchain and your wallet will deployed (reply to 28338)

Milad: Let me check please. Is it needed to pay fee for deploy the wallet? (reply to 28340)

Maksim: of course, but you said you got faucet (reply to 28341)

Milad: How can i deploy it using an internal message? Is it possible for highload wallet?  Using create_transfer_message i deployed v4r2 wallets. But i didn't succeed in highload wallet

Maksim: state_init = new_wallet.create_state_init()['state_init']  wallet.create_transfer_message(to_addr=new_wallet.address.to_string(), state_init=state_init, ...)  you can check out this video i've explained how to internal deploy contracts (reply to 28343)

Milad: Thank you so much. I'll check and let you know 🙏

Milad: It worked. Thanks a lot (reply to 28344)

Dmitry | backend4you.ton: Hmm… are you sure “query_id” works as “timeout”??? (reply to 28329)

Alexander: query_id in highload wallet isn’t just expiration timestamp. It’s added with hash of the current payload cell (reply to 28329)

Alexander: *32 bits part of the hash

pid | ton: query_id is it like Nonce in BNB chain?

Alexander: seqno (as in wallet v3) is like nonce in evm chains (reply to 28353)

Alexander: query_id like seqno, but disorderly

Milad: I have a question. There is no seqno for highload wallets. How should i handle this one to not send specific transactions twice or more? I know that i can set query_id for that. But how can i do double spends or other works we do with nonce in other blockchains? (reply to 28344)

Maksim: your query_id stores in contract until it become invalid, so other messages with existing query_id will be blocked (reply to 28356)

Maksim: i think best practice is to remember query_id and run get method processed? to check if query_id processed by contract

User<5847386827>: I've watched all 4 videos. There was nothing about how to send a jetton. I want to know what message structure should be like for transferring a jetton. (reply to 28166)

Asher: You can ask author (reply to 28360)

Maksim: so if you send several messages with different query_ids they all will be processed and stored in contract also every time you send  message contract checks if there are expired query_ids and if true, deletes them (reply to 28359)

Andrew: https://github.com/TheTonpay/tonpay-core/blob/main/src/contracts/jettonWallet/messages.ts#L4 (reply to 28360)

Andrew: also make sure to read jetton tep  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 28360)

Milad: How about python? :)) (reply to 28358)

Maksim: create_transfer_message for highloads returns query_id  then you can run get method with pytonlib or tontools (reply to 28366)

Maksim: stack should be like  [[“num”, query_id]]  if you use toncenter or pytonlib

Milad: I'll chek and let you know. Thank you👍 (reply to 28367)

— 2023-05-22 —

User<6247944943>: what is the dead wallet can put here to transfer become the owner of Jetton minter in mainnet (reply to 27934)

Andrew: you need this button if you want to change ownership to zero address (reply to 28375)

Eggplant: Hello, I am the product manager at chainide. Recently, we are interested in integrating with TON and providing customized functionality. I have a few technical questions:  Is TON Storage a public node? Can users directly upload content to that node without starting their own node?   Is there any developer documentation available for TON Domain? For example, can we use an SDK to swap addresses and domain names?   I noticed that venom uses the Ton-solidity language https://github.com/tonlabs/TON-Solidity-Compiler , but TON itself does not use Ton-Solidity. What is the relationship between them?

Andrew: ton-solidity is a compiler created by another TVM-based blockchain team - Everscale. It compiles solidity code to Fift (TVM assembly basically)  TON Storage allows to run your own node, as well as use others' nodes to store your files, similar to torrents  TON DNS is just a standard, you can interact with dns contracts by sending correct messages to them (reply to 28377)

Eggplant: Thank you for your response, But I  still have two more questions. 1. Are these public TON Storage nodes where user can store data?  2. Is there any relevant SDK documentation available to support direct transfer to TON DOMAIN  names? (reply to 28378)

Andrew: 1. afaik no, but people are starting to provide their storage on marketplaces such as https://market.tonbyte.com 2. to support transfer by ton dns, you can resolve domains using apis such as https://tonapi.io (https://tonapi.io/v2/dns/foundation/resolve for example) and take the address for transfer this way (Tonpay uses this for customer input in invoices, as an example) (reply to 28379)

Eggplant: Thank you so much for your response. (reply to 28380)

发财888: 泡泡

阿凯: Balance not enough (reply to 28382)

Vatshayan: Hi This is not working Can you please provide this code in js (reply to 28258)

Vatshayan: https://github.com/toncenter/examples/issues/2

Vatshayan: we are getting errors as :    BN { negative: 0, words: [ 10000000 ], length: 1, red: null }

Vatshayan: Please check

Arsen: Do you provide this 3 constants ?   const MNEMONIC_OF_EXISTING_WALLET = "" const DESTINATION_ADDRESS = "" const API_KEY = ""; (reply to 28386)

&rey: Do you actually need to pass tonweb.provider into new WalletClass? As far as I remember, it's provided automatically. (reply to 28387)

Arsen: The gist i provided is TypeScript and it works as it should, i ran with my own mnemonic and it works. Moreover this code with error handling works on live product i own. So kinldy check what are you doing wrong.

Iman: could anyone describe Creation LT in bulk transfers pls?

ъуъ: Hello, can you help me please? When I try to send boc message with this config  ``` from ton import TonlibClient client = TonlibClient(         config=https://ton.org/global.config.json,         ls_index=2 ) ```  Everything works just fine. But whenever I try to use testnet  ``` from ton import TonlibClient client = TonlibClient(         config=https://ton.org/testnet-global.config.json,         ls_index=2 ) ```   I get this error: ton.tonlibjson.TonlibError: INVALID_CONFIG: hardforks differs from embedded hardforks

Dmitry | backend4you.ton: check  your libtonjson.dll/.so library - I guess its too old (reply to 28395)

ъуъ: oh, thanks! (reply to 28396)

User<6002397481>: Smart people never need investment to make money.

Ruslan: You can download correct version here: https://github.com/toncenter/pytonlib/tree/main/pytonlib/distlib (reply to 28395)

ъуъ: thank you so much!

Olimpio⚡⋈: What happens? (reply to 28400)

ъуъ: but how can i deploy a contract if it's deploying by sending a transaction? And the wallet can't send transactions if it's not deployed (reply to 21871)

Dmitry | backend4you.ton: Deployment data can be sent with transaction (reply to 28407)

ъуъ: oh, thank you again!! I'm so sorry if i'm asking dumb questions, it's just so hard to google something about Ton

Oleg: Hello guys! Is there a way to create BoC and calculate contract address in python?

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsC-7xbn8b8noZh9a1Xkg42W (reply to 28411)

Oleg: thanks

ekt: Hi,  I am trying to run project that uses ton connect and am getting the following error:  ./node_modules/@tonconnect/sdk/lib/esm/index.mjs Can't import the named export 'Base64' from non EcmaScript module (only default export is available)  Do you know what could be causing it/ any workaround? Thanks :)

— 2023-05-23 —

Fortress Calls: hello guyz

Fortress Calls: how i listing my token on tonchain?

Dmitry | backend4you.ton: minter.ton.org (reply to 28439)

User<5916040818>: how do i monitor tonchain movement

Tim: dton.io (reply to 28443)

Avinit | DollarPe: Is there any Regular Expression to validate TON wallet addresses???

Tim: ton address contains crc hash of it's content, you should verify it, not only regex

Vatshayan: const key = await mnemonicToKeyPair(mnemonic.split(" "));     This is not working !!  Even after declaring mnemonic too its not working (reply to 28258)

Vatshayan: please check once in js

Avinit | DollarPe: Thanks can you explain more? (reply to 28446)

Tim: look at your lang libs examples (reply to 28449)

Dmitry | backend4you.ton: https://docs.ton.org/learn/overviews/addresses#user-friendly-address (reply to 28449)

User<6247944943>: 👁👄👁

Andrew: /report (reply to 28454)

Hartmann D.: Thank you (reply to 28455)

Vatshayan: const mnemonicPhrase = mnemonicArray.join(' ');                                        ^  TypeError: mnemonicArray.join is not a function (reply to 28258)

Vatshayan: Getting error from this Code

Vatshayan: Please check once

Vatshayan: waiting for replyt

Vatshayan: ?

Vatshayan: We need to integrate ton coin asap All methods and functions are working only transfer is not working  Please check and guide

Andrew: this is the basics of JS. mnemonicsArray must be an Array (reply to 28457)

Arsen: besides, where do you find mnemonicArray in the gist i provided ? @Vatshayan1 (reply to 28463)

Andrew: exactly

Vatshayan: /ton/node_modules/tonweb-mnemonic/dist/node/index.js:99   const mnemonicPhrase = mnemonicArray.join(' ');                                        ^  TypeError: mnemonicArray.join is not a function

Vatshayan: this we are getting from node modules

Arsen: Then give from which line of code error happens from the gist. (reply to 28466)

Arsen: or at least paste whole stack trace

Vatshayan: Hi Now I have   Created wallet Deploy wallet  and then trying sendTon  but I am getting errors

Vatshayan: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 5A7F0851CB1FC0F48916319B53B709D37FF724ED399B453DE9E7AC574D517A4C:\nexitcode=33, steps=23, gas_used=0\nVM Log (truncated):\n...te NOW\nexecute LEQ\nexecute THROWIF 36\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute LDDICT\nexecute ENDS\nexecute XCPU s4,s3\nexecute EQUAL\nexecute THROWIFNOT 33\ndefault exception handler, terminating vm with exit code 33\n'

Vatshayan: I am using testnet api rpc and testnet ton faucat for the address

Vatshayan: for testing as of now

User<6247944943>: any test-net API can fetch the Jetton Wallet Address for a given address?     const client = new TonClient4({         endpoint: "https://sandbox-v4.tonhubapi.com",     });

&rey: It seems that seqno is wrong. (reply to 28472)

Arsen: i feel hired for free 🙂 (reply to 28475)

Arsen: can you share the account from which you are trying to send TON ? (reply to 28472)

Arsen: as it's testnet sharing mnemonic will be good too if test coins on it are not much .

&rey: Actually, that won't help, as failed external messages are not recorded as transactions. (reply to 28479)

Arsen: I want to check at least if deployemnt and funding are really done

User<6247944943>: Like this part: any api or modules we can use to get any Wallet's Jetton Wallet easily to get? (reply to 28476)

Vatshayan: EQBafwhRyx_A9IkWMZtTtwnTf_ck7TmbRT3p56xXTVF6TMGg (reply to 28479)

Vatshayan: I have checked on testnet ton scan  There is 2 ton on it as of now

Alex: If you need Jetton Wallet Contract address owned by a regular Wallet Contract, for a paricular Token Master Contract it is always should be calculated locally, because this is predictible value. Jetton Wallet Contract = f(Wallet Contract Address, Token Master Contract)  That’s why it’s bad idea to solve this with API method.  As I know, tonapi.io has method for fetching data about all owned Jetton Wallet by owner’s Wallet address:   https://tonapi.io/v2/accounts/{wallet address}/jettons (reply to 28483)

&rey: The same API as for mainnet. This is an example for TonWeb. async function get_token_wallet_for_user(user_addr, master_addr) {   const user_addr_cell = new tonweb.boc.Cell();   user_addr_cell.bits.writeAddress(user_addr);   const user_addr_slice = tonweb.utils.bytesToBase64(await user_addr_cell.toBoc(false));      const jw_addr_stack = await schedule(tonweb_call,     [master_addr, 'get_wallet_address', [['tvm.Slice', user_addr_slice]]]);      const jw_addr_slice = jw_addr_stack.stack[0][1].object.data.b64;      const jw_cell_addr = new tonweb.boc.Cell();   jw_cell_addr.bits.writeBytes(tonweb.utils.base64ToBytes(jw_addr_slice));   return jw_cell_addr.beginParse().loadAddress(); } (reply to 28476)

User<6247944943>: I noticed a big issued here is the initial code of Jetton wallet generated by Tact code is different than the FunC we got from minter.ton.org (reply to 28487)

&rey: The code above handles this by calling get-method get_wallet_address on jetton master contract, which always returns correct address. (reply to 28488)

User<6247944943>: 🥰 (reply to 28489)

Henry: Hi, where can I find jetton address for USDT and USDC?

Alex: https://tonscan.org/jetton/EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA  https://tonscan.org/jetton/EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728

Javad: i have question about Anonymous Telegram Numbers  this is a number contract and it's main contract  1- how can i find all number contracts ? 2- how can verify witch the number contract is correct ? for example if i create contract like number contract and deploy it, can i sell my number ? ( i know it's not possible but i don't know how can know the contract is correct )

— 2023-05-24 —

User<6247944943>: basically you can input an integer for the get function to fetch all the "pontential" Address by Index (reply to 28493)

User<6247944943>: However, the challenge lies in needing to send the obtained address to an API to verify its activity. This process differs slightly from our experiences with Ethereum.  Therefore, the NFT Collection in TON adheres to this process. You can check the TEP62 standard for more information (https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md). (reply to 28494)

Maksim: hey guys! our second Ton - Python lesson just came out!  lesson themes: Cell creation, Slice parsing; work with liteservers, looking for archive ls from public ls list; transactions parsing from blocks; listening for new transactions in the blockchain  youtube - https://www.youtube.com/watch?v=ipFDBjJFLCw  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_2  course repo - https://github.com/TonDevStudy/pyton-lessons-eng

Вв: Foxtails (reply to 28499)

Вв: On this platform u can start auctions with any end date (reply to 28501)

Вв: Yes Foxtails.io (reply to 28503)

Henry: does anyone have problem with tonscan.org on testnet? it seems it was not indexing new transactions in the last few days

Andrey: testnet.dton.io (reply to 28507)

Javad: how can i find all number contract ? (reply to 28494)

Henry: the main reason I use tonscan is because I can search tx by msg hash for example https://testnet.tonscan.org/tx/by-msg-hash/Mn8fW2iml_XdwjPv7mt2sTuOCCezQC-Ih6B0AiPL_xM= (reply to 28508)

User<6247944943>: DM 🙏 (reply to 28487)

Marat: Yes, it is addressed. Will be fixed soon. (reply to 28507)

Freed: https://toncenter.com/api/index/ can do it too

Andrey: dton graphql endpoint also can find messages by hex, but it’s not user-friendly like in-url parametrs (reply to 28513)

User<6247944943>: yeh, dton is qualified legit (reply to 28514)

Vatshayan: EQBafwhRyx_A9IkWMZtTtwnTf_ck7TmbRT3p56xXTVF6TMGg (reply to 28479)

Vatshayan: I have checked on testnet ton scan  There is 2 ton on it as of now

Arsen: tell me your mainnet addres i will send you 1 ton. do your testings on mainnet. I don't count testnet reliable to work on ! And don't have time to check testnet results. I can donate you 1 ton  , which is more than enough for testing purposes.

Rajkumar: I am getting this error

Rajkumar: `'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 5A7F0851CB1FC0F48916319B53B709D37FF724ED399B453DE9E7AC574D517A4C:\nexitcode=33, steps=23, gas_used=0\nVM Log (truncated):\n...te NOW\nexecute LEQ\nexecute THROWIF 36\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute LDDICT\nexecute ENDS\nexecute XCPU s4,s3\nexecute EQUAL\nexecute THROWIFNOT 33\ndefault exception handler, terminating vm with exit code 33\n'`

&rey: The seqno is invalid. (reply to 28520)

Rajkumar: I have tried 0-5 as integer in seq no, it is not working, this is my first transaction

DA: Hi! How can a jetton be reissueable while keeping the same address? Thanks

Andrew: it won't change the address after mint (reply to 28523)

DA: So is it possible to mint x amount of a jetton and then add y amount to the same jetton? Which procedure in FunC must be followed, can I have a link? Thank you (reply to 28524)

&rey: The same minting procedure is used. At the beginning, jetton wallet is empty, so its StateInit is calculated based on zero balance. And only then the balance is increased by message from master contract. (reply to 28525)

DA: Can this increase be done later in time even after having distributed many tokens or will it no longer be possible after closing the administrator role? Thank you

&rey: Tokens minting is possible until you revoke administrator role. (reply to 28527)

DA: The ton guides recommend closing the role after minting for security reasons, i.e. if the token is distributed with the administrator role open, is there a risk?

&rey: The main reason is trust: if you don't close the role, people can't be sure that you won't suddenly double the amount of jettons, sending the price towards zero. (reply to 28529)

DA: Thank you for your comprehensive answer, in this case every person in the community will know that the jetton will be reissued and may undergo changes.

Arsen: Why jetton owner will do such thing if he is most probably the largest holder of jettons ? Question has 0 sarcasm. Just curious in which cases jetton owner will make price go lower. (reply to 28530)

DA: price will be made stable

&rey: The question is out of scope for this chat. However: jetton owner can probably receive investments and then sell additional jettons at the initial price, raising even more money. (reply to 28532)

Arsen: thanks for the answer ) (reply to 28534)

DA: Thank you

Rajkumar: how can i solve the seqno issue (reply to 28521)

&rey: If you are using TonWeb and your wallet object is wallet, you can use wallet.methods.seqno().call() to retrieve the valid number. (reply to 28537)

Rajkumar: I am using the same, the value it gives is 0. But that does not work, so I tried incrementing and trying the transfer (reply to 28538)

Oleg: Hey guys! Is there any good guide on how to deploy contract using external message in js?

D: hello guys, i hope all doing good.

D: i transfer nft from one account to other and its not tranfering and giving error (exit code. 9 - Cell underflow. Read from slice primitive tried to read more bits or references than there are.)

D: All other collections that TON FROGS are working fine.

D: Ton frogs collection nfts are not transfering, anybody can help me with this, thanks

D: https://ton.diamonds/collection/ton-frogs/gro-ton-frogs-caviar-799 Only this collection creating issue.

&rey: Could you send link to failed transaction? (reply to 28544)

D: https://tonscan.org/tx/by-msg-hash/vJmyjlqfj93TFtYbwob7_cbKpsKHRLXTh_boCmLnGqk=

&rey: Haven't you transferred the NFT with transaction https://tonscan.org/tx/FW7Bpk8Gjw5XAyIcrjzHemyU9efYGrbmsmp6DYkQLjI=? (reply to 28544)

D: i didnt understand

D: i transfered from code

D: from wallet to wallet its working. (reply to 28548)

&rey: You put forward_payload in a reference, so you need cell.bits.writeBit(true); (reply to 28550)

D: like this ?

D: it will work now ?

User<6258201532>: I'm web3 full stack engineer with full experience of building smart contracts on several networks especially Ethereum , Solana , Ton, Sui , ZkSync Era networks.

User<6258201532>: if there maybe some works I can be of some help for you , please reach me out. thanks

Coalus: Ur github? Any project that you already build on TON? (reply to 28555)

User<6258201532>: I have ongoing Ton swap project (reply to 28557)

User<6258201532>: could you dm me ? (reply to 28557)

Yang: I have some questions:  1. The update code  was requested on 5/17, and after all nodes signed it on 5/23, so the sharding of the work chain was successful? 2. The split of the work chain is 2 to the Nth power, so logically speaking, shouldn’t it be split into 2 to the 2nd power, four chains?

&rey: 2. Suppose there are 2 shardchains. It's possible to split only one of them, so there will be three shards afterwards (1/4 + 1/4 + 1/2). (reply to 28560)

승재: When sending a transaction by executing sendInternalMessage through the javascript sdk, how do I exclude the gas fee required for the transaction and return the remaining funds to my wallet?

Oleg: is there anyone who knows why this error occurrs? LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted

&rey: In order to debug such errors, you should post the whole error, or, better, the code that caused it and the contract address. (reply to 28563)

Oleg: can i dm you? (reply to 28564)

&rey: Please try searching in this chat, most cases of "external message was not accepted" already have explanation here. If you don't find one, DM is OK. (reply to 28565)

Oleg: thanks

Oleg: the problem is that i don’t get any error, it seems that the transaction itself is not starting to be processed     data: {       ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction B0321F614671C655D7F958F199B30DEB39C4FA511637373B1898F63E89BE1A56:\n' +         'exitcode=0, steps=0, gas_used=0',       code: 500     } (reply to 28566)

&rey: Is the contract deployed? steps=0 suggests that it isn't. (reply to 28568)

Oleg: so i sent money to it and would like to deploy it with this transaction

Oleg: or i’m missing smth

&rey: You have to send StateInit in the transaction to deploy the contract.

Kaique: Oi

Gulolio: Guys, curious question here. Reading the White Paper is mentioned that the TVM have Support for Weil pairings on some elliptic curves, useful for fast implementation of zk-SNARKs. Is there a plan in the future or maybe a project, to provide that on ton blockchain? I mean to have completely anonymous transactions, like for example in Zcash or Monero. Not trying to compare projects, is just that it would be quite useful stuff. If anyone knows about a project on TON ecosystem focus on that, share me the github link, I'll be interested on learning about it.

— 2023-05-25 —

User<6247944943>: Does anyone know what is schedule means here? (reply to 28487)

User<6247944943>: I'm struggling to understand why we can't predict the JettonWallet address. Given that the Master Jetton Wallet (Minter) is fixed, and the only parameter we are sending is the "Wallet V4 address to which we want to send the Jetton Token", I'm not sure why this is an issue.  Before we send the Jetton to generate the wallet, we should be able to obtain the address that can be used for the response_destination parameter of the Transfer(0xf8a7ea5) TL-B, correct? (reply to 28486)

Howard: why will get  throw Error("BitString overflow");? when I using TonWeb?

&rey: Either you are writing too many bits into builder/cell or reading too many bits from slice. (reply to 28578)

User<6247944943>: Thanks god. ton-core is good. I just took 2 hours in tonweb... and get lots of error.  lmao.   Here is the example if you just want to get "The Jetton Wallet of any Address in any Jetton Token". (reply to 28577)

Dmitry | backend4you.ton: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#jetton-master-contract reading docs can save your time (reply to 28581)

D: hello, how can i check what arguments are sent to the function of the contract on tonscan.org transaction?

D: can i convert the msg_data body to readable form?

Vatshayan: Hello Can I get transfer code from one ton account to another code ? On github transfer code in javascript is not clear and with errors

D: u mean exit codes? (reply to 28597)

D: transfer opcode is 0x5fcc3d14

D: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes

승재: how can i convert - "op::transfer"c; - to hex like  - "0xf8a7ea5"

Tim: crc32(op:transfer) (reply to 28601)

승재: oh thanks (reply to 28602)

승재: umm... there is a crc32c function in the latest ton-core, and is "op:deposit"c the same as "crc32c" ("deposit"), crc32c ("op:deposit") or crc32c ("op:deposit")? (reply to 28602)

User<6247944943>: crc32

Anthony: Hi all! TON participates in the Developer Report from Electric Capital https://www.developerreport.com/  We are constantly updating the GitHub repositories associated with TON in their tracker. But if you find that your repositories have been skipped, feel free to mention it in the comments on this PR: https://github.com/electric-capital/crypto-ecosystems/pull/511

Vatshayan: Hello Can I get transfer Send code from one ton account to another code ? On github transfer code in javascript is not clear and with errors  Sending ton from one account to another account

Henry: Hi, is it possible to specify expected fee in createTransfer message?

Daniil: Why would you do that? (reply to 28610)

Milad: I think for double spend maybe. Is it possible to set a fee for a transaction? I use tonsdk. (reply to 28611)

D: hello, can i verify nft ownership in contract code ?

Daniil: You can't edit the transaction fee. The gas, storage and forward fees are specified in Blockchain config (reply to 28612)

Daniil: Is it a regular NFT or SBT? (reply to 28613)

D: NFT

Milad: Thanks. How about double spending a transaction? Is it possible in ton? I think not. Because there is no option to set fee. Especially in highload wallets. Am i wrong?

Daniil: Then it's not possible without user actually sending the NFT to your contract (reply to 28616)

Daniil: What kind of "double spend" do you mean and how is it related to the fees? (reply to 28617)

D: how to check token is NFT or SBT in tonWeb sdk ? (reply to 28618)

Milad: It's in my mind like other blockchains. For example in ethereum blockchain if you want to cancel a transaction or set a higher fee for your transaction you can send a transaction by the same nonce. (reply to 28619)

&rey: Attempt calling get_authority_address(), if the method fails then token is not SBT. (reply to 28620)

Daniil: You can't specify the wanted fee, but you can, in some cases, replace the first sent transaction with a different one with the same seqno. It's only possible if the external message that you sent to the wallet wasn't yet processed by validators, and the new one will be processed faster. (reply to 28621)

Milad: How about highload wallets? There is no seqno for highload wallets? (reply to 28623)

Milad: Should i use query_id for that porpose?

Daniil: Yes, there's no seqno, but they use another way of preventing double processing of same transactions (reply to 28624)

Daniil: Yes (reply to 28625)

Milad: I got it. May i ask another question?  In what cases can it take time to validate a transaction by validators? In this case, we will need double spending. What are these cases? (reply to 28626)

Daniil: It can happen if the API that you use had some error or a big delay.  But there won't be any double spending. (reply to 28628)

Milad: I think it will be resending :) (reply to 28629)

Milad: Not double spending

Henry: I want to know the exact outgoing + fee amount for reporting purpose (reply to 28611)

D: can u plz tell me where to find this function ? (reply to 28622)

Daniil: In case if that "delay" happens, you can just send the transaction again as you do it already in your code (reply to 28630)

&rey: The exact fee value depends on the exact timestamp where the external message arrives, because storage fee depends on time. (reply to 28632)

Daniil: There's "estimateFee" function in some APIs and libraries. But I'm not sure if you really need it for regular transfers. And anyway, it won't give the exact result, as @pcrafter said above (reply to 28632)

&rey: TonWeb has some methods to call get-methods on contracts. As far as I remember, that's tonweb.provider.call(<address>, <method>, <stack>). (reply to 28633)

Henry: yes I am using estimate but it slightly different a few nano ton time to time, that caused our report a bit off (reply to 28636)

Daniil: It's because of the storage fees usually.  Can you tell some more context, why do you need to know the exact fees in your program? (reply to 28638)

Henry: we have one wallet that store fund for all customers. when we withdraw fund for a customer, we would like to have exact amount + fee for that customer transaction. at the moment, the fee is unpredictable, so it is a bit hard to keep track out going amount (reply to 28639)

Daniil: You can just query the whole balance sometimes. Or why do you need it, I still don't understand? (reply to 28640)

Daniil: Do you think these few nanoTons of storage fee will make a difference in your case?

&rey: AFAIK, the estimated fee usually has precision of 10 nanoTON. That isn't going to influence anything unless you have hundreds of thousands of clients. (reply to 28640)

Henry: yes, I can do that, but at the end, our report does not make sense because some funds was not tracked in our system correctly. we may have to rely on querying from blockchain that require change in our system design. (reply to 28641)

D: Thanks. (reply to 28637)

&rey: Actually, you have to track transactions, because they may get lost in "mempool" so that funds are not transferred to customer but are recorded as transferred in your reports. (reply to 28644)

Daniil: You can send the transaction and then query its result from Blockchain to get the exact data (reply to 28644)

D: user sending the nft to my contract, how can i check if its arrived or not in contract code? (reply to 28618)

Daniil: The NFT itself will send a ownership_assigned message to your contract after the successful transfer, so you can handle it (reply to 28648)

Daniil: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md

D: alright (reply to 28649)

D: its sending the msg to the contract but not nft (reply to 28649)

D: only TON FROGS making issue else other nfts working fine,

Daniil: The contract of NFT sends a message to the new owner's address automatically (reply to 28652)

D: i am saying that  Transfer nft to my contract failed, but ownership_assigned message come to the contract.

D: nft stays in the user wallet.

D: all other nfts except this collection working fine. (reply to 28653)

D: https://getgems.io/collection/EQDahyr_gPkHBPbhyrvjoHGVFGGj8vXXtL7w14AV3S2JvpTF

User<6247944943>: tx? Maybe you leave the forward amount of Nano TON is not enough (reply to 28655)

D: https://tonscan.org/tx/by-msg-hash/83rDIDIafhTP5bDdf8q5sNoyYGDa3bcFIB6dq5ovJQ0= (reply to 28659)

User<6247944943>: how you send the NFT? Did you use Transfer method on getgems.io? I think no. (reply to 28660)

User<6247944943>: The forward fee seems too low for me.

Seitaro: forward fee is ok for bounce (reply to 28662)

D: calling transfer method of nft contract from js sdk. (reply to 28661)

D: this is the error on tonscan 9 - Cell underflow. Read from slice primitive tried to read more bits or references than there are.

D: exitcode - 9

Nikita: Hello, could not find the information neither in Google  nor in chat history :(  Does Smart Contract run on every node of TON Blockchain?  Or is there a way for some nodes to validate without actually executing the contract?

&rey: Smart contract is program written in Turing-full language, so there is no way to validate it without actually launching TVM. So, all validators need to execute the contract. (reply to 28669)

Nikita: Thank you! I asked, because I saw about ethereum on Quora that there’s a way around (reply to 28670)

Seitaro: Actually, TON uses sharding, that means that network can split to a few shards, each of which is validated by some group of validators (and not by all validators), all other validators apply state updates to their state without necessity to run every transaction itself (reply to 28670)

&rey: Moreover, if TON becomes even more widely adopted, the validators could possibly add short-circuit computations for wallets' external messages (don't launch TVM if the signature, seqno, etc is correct and there are enough funds) based on code hash.

Henry: Hi, there is something that I don't quite understand. I have this transaction https://test-explorer.toncoin.org/block?workchain=0&shard=a800000000000000&seqno=11151991&roothash=B19523425A0D29821EA144EAEA6407F9D26B0334C892451B722399164128CC2C&filehash=6763099B56ED0B4E41F0C2B4BBE78BA215B46289B8D72B006E96D2CEB296BDD7 I think it was mined in master block 9789025, but I look up this master block -> find all shards in the master block 9789025, but I could not find the transaction. Did I do something wrong?

Tim: it's complicated. real block in which shard block is located can be further in the chain

Tim: in your example that shard has blocks 990 and 992 in master chain, 991 is not included, because it was not at the top of the shardchain when master block was created

Henry: is there anyway to scan all shards to get transcations. My goal is to read all transactions each block and find the one that meet specific condition in my app (reply to 28678)

Tim: You read shart at the current block. Shard at prev block. Then you scan everything on between

Tim: ton-lite-client has method get Full Block. Check it out

Henry: thanks. I will look

Henry: is it possible to do that with https://testnet.toncenter.com/api/v2/? (reply to 28680)

Marat: There's method getTransactionsByMasterchainSeqno at https://testnet.toncenter.com/api/index/ which does what you need. (reply to 28683)

— 2023-05-26 —

Chacha: Hey, I have a question that, what do I generate a different address with the same mnemonic when using Tonweb utils?

Chacha: I used the same wallet version but it generated a different address with Tonkeeper

&rey: In testnet, subwallet_id may differ leading to different addresses. TonWeb may be unaware of being in testnet. (reply to 28688)

Doctor Delpy: I can't build the test branch ton-blockchain/ton, I get an error Could NOT find Secp256k1 (missing: SECP256K1_INCLUDE_DIR SECP256K1_LIBRARY)  Does anyone know how to fix it?

Vatshayan: Hi which contract version we should use from v2, v3 types  For transfer sendton method

Chacha: I used V4 contract

Chacha: Hey, we used mainnet, but it still generate a different address. (reply to 28690)

D: help (reply to 28665)

Daniil: Depends on what do you need. Usually V3 is enough.  - https://docs.ton.org/participate/wallets/contracts (reply to 28692)

Andrew: try to use the latest one (V4) (reply to 28692)

&rey: v3r2 is one of the most common wallet types. The feature introduced by v4r2 is plugins: contracts that can withdraw money from the wallet (for example, to pay for a subscription). Fees for v4r2 are higher because of that (for example, messages with value 0.001 TON will not increase wallet balance even by a single nanoTON). (reply to 28692)

D: how to check arguments of the transaction on tonscan or sdk ?

F: https://t.me/testnetstatus/24 https://github.com/ton-blockchain/mytonctrl/blob/master/scripts/toninstaller.sh#L87 libsecp256k1-dev libsodium-dev (reply to 28691)

Doctor Delpy: Thanks 🥰 (reply to 28702)

Ignat: guys, I want to extract multiple variables via my load_data but got an error, do u know whats the problem?

Vatshayan: Getting Method not found error   Trying Mainnet API and ton coin for deposit but now getting in catch error as  "Method not found"  I think getBalance method  is not fetching (reply to 28258)

Devon: Does anyone know of good documentation about the meaning of metadata fields in transaction data? (like in_msg, out_msgs)

&rey: It works for me at TonWeb 0.0.58. (reply to 28705)

Daniil: Which error do you get? (reply to 28704)

Ignat: Unable to execute get method (reply to 28708)

Daniil: Are you sure your "load_data" function is a get method?  Does it have "method_id" modifier? (reply to 28709)

Ignat: oh nope (reply to 28711)

Ignat: i’ll try to add method_id

Ignat: yeah it works:)

&rey: https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages (in_msg corresponds to the message that caused the transaction and out_msgs are messages sent outwards) https://docs.ton.org/learn/tvm-instructions/tvm-overview (reply to 28706)

Chacha: Does anyone have this issue? (reply to 28688)

Konstantin: Hello. I'm trying to make a bot with user balances using the example from here (https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-2#gettransactions-method). The problem is that when a user is registered/added to the database, his id is in the form of a number. But when I follow the documentation and get information about the transactions of the specified wallet, then there is no user id that made the transaction. In addition, in the transaction data, I do not find the amount that the user sent (in this case, 0.1 TON). Can anyone tell me how to correctly identify the user by transaction and amount, so that you can replenish the user's balance in the bot's database? The wallet for the bot was created on TON play.

User<6247944943>: @f_closer please add me to the contact or can you DM me?

Andrew: "user ids" don't make transactions. You should associate users and their wallets internally (reply to 28717)

Jake: Depends... you can attach uid to wallet string. We do it on wax blockchain chain all the time. The beauty of ton is using telegram to integrate to ton to link user id to wallet string more effectively.  So basically, if you can write in a wallet connect to bot the database the user id to the connect pull you should be able to reference it later on drops (reply to 28720)

Andrew: well, you can try to generate wallet using tg user id as subwallet_id (reply to 28721)

Jake: Im talking a direct connection to tonhub or tonkeeper (reply to 28722)

Jake: If you were to create an evm to tvm you do the same thing via smart contract. Attach the eth address to the ton address string

Jake: If i understood funC like i understood antelopeio i could explain it in contracting form using the telegram api structure

Al: Hi guys, just checking if Ton node still can't work behind NAT? Had anyone configured it to work behind NAT?

Konstantin: Thank you. But how can I know that a wallet from a transaction belongs to a specific user? Ask the user for his wallet number or are there other ways to find out? (reply to 28720)

Andrew: require them to attach a comment that you generate internally and check the comment (reply to 28727)

— 2023-05-27 —

User<6247944943>: Does getgems.io testnet dead that unable loading? https://testnet.getgems.io

Alex: Works fine for me. (reply to 28730)

Kik: 中文

Andrew: https://t.me/tondev_zh (reply to 28733)

Noam: Hey guys, does anyone know how many validators currently active ?

Nobody: tonmon.xyz (reply to 28737)

Ignat: guys, how to create a dictionary that stores the mapping of addresses as the keys?

Behrang: Use a slice dict, for example this function from stdlib:  cell dict_set(cell dict, int key_len, slice index, slice value) (reply to 28739)

Ignat: Yeah, but how to get a value from this dict? All the get-functions from stdlib r using int keys (reply to 28740)

Behrang: Add a definition like this:  (slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT"; (reply to 28741)

Behrang: I haven't tested it but I think it should work. (reply to 28742)

Ignat: Ok I’ll try, thx:)

Maksim: hi there! our third Ton - Python lesson just came out!  lesson themes: Transactions data parsing; check transactions statuses (exit codes in different phases); messages parsing; check transactions types via op code (like Jetton transfer) and these transactions parsing  youtube - https://www.youtube.com/watch?v=f3u0g84dFhY  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_3  course repo - https://github.com/TonDevStudy/pyton-lessons-eng

— 2023-05-28 —

Howard: anyone got exit_code 708 before in Jetton?

Daniil: https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/ft/jetton-wallet.fc#L66 (reply to 28748)

Tony 10am-7pm: Anyone know how I can only allow tonkeeper login in tonconnect/ui-react

Tony 10am-7pm: I want to hide other wallet auth

Tim: Pass your own wallet list (reply to 28752)

Howard: yeh, seems the forward_load has to have the data there! (reply to 28750)

&rey: Actually, forward_payload has form of Either Any ^Any, so there must be at least one bit indicating whether payload is stored in the reference. (reply to 28754)

Howard: true. That is the reason why we using remaining I guess. Then what data you usually put in there? @pcrafter (reply to 28756)

&rey: Sometimes you send jettons to DEX, and with that message you can specify what jetton you want to get in exchange. (However I don't know if current DEXes work this way) (reply to 28758)

&rey: Alternatively, you can put a text comment there, just like in common TON transfers. This way you can transfer both jettons and TON to a single recipient with one message.

Pavan: Hi (reply to 28762)

&rey: A tool to find .ton domain contracts Recently, it was very hard to find domain contracts not linked to wallets (try stabletimer.ton, for example; Tonscan says that domain is misconfigured or does not exist, so you need to go on searching in transaction history).  But now there is an easier way: put stabletimer.ton.resolve-contract.ton into search/transfer destination field, and you'll get to the page of domain contract! .t.me domains are also supported. This can be useful to top-up the domain not linked to the wallet.

User<6247944943>: is combot by TON team?

Andrew: no (reply to 28768)

User<6247944943>: I click the Combot page and got this

User<6247944943>: ok. Thanks (reply to 28769)

dijor: hey, guys! what does SendMode.PAY_GAS_SEPARATELY mean in ton-core? Is there any way to make sure I transfer enough money to a contract taking into account storage and gas fee?

Dmitry | backend4you.ton: For example you send 1 ton.  Without this flag your balance will decrease for 1 ton, but receiver will receive less.  With this flag, receiver will receive same 1 ton (minus his own storage fees), but your balance will decrease a bit more. (reply to 28772)

dijor: I also understood it this way, but with this flag my balance somehow does not decrease more (reply to 28773)

liminal: We began a new chapter of ton development series! https://www.youtube.com/watch?v=3mXo-xD12Uc

dijor: I send 0.1 TON with the flag SendMode.PAY_GAS_SEPARATELY, my balance decreases by 0.1 TON. Then I withdraw money from the contract with send_raw_message(msg, 128) and get only 0.09 TON. No other transactions occur. (reply to 28773)

Gulolio: Some times I think developers make it hard on purpose, this is unreadable. Line(big line from ton nominator smart contract)

Андрей: Looks readable to me. Perhaps you have bad development tools, you should think about improving them (reply to 28778)

Ankit: https://ton-community.github.io/tutorials/03-client/  Hi, I'm learning Ton development. Has anyone done this tutorial? When I publish the website on github pages, I get blank screen. Did anyone get the same error?

— 2023-05-29 —

Howard: 🔥🔥🔥 (reply to 28776)

Noam: Hello dev chat 👋, i’ve asked on the other chat and been referred here,  I’ve searched in the docs but I couldn’t find any information about voting process and how to be involved (which is disappointing for those who want to be involved), only validators can vote currently?, and the bigger the node the bigger the vote power?

Андрей: Yes (reply to 28784)

Noam: Any doc to read more? (reply to 28785)

Vatshayan: const WalletClass = tonweb.wallet.all["v4R2"]; I am using v4R2 contract version    But getting method not found   Is this contract version is correct ?

Vatshayan: Please share working ton transfer javascript code for sending ton from one account to another account.

Андрей: If mytonctrl is used, then everything works through one command ve, information on voting here: https://t.me/tonstatus If you vote manually, then here is the instruction: https://docs.ton.org/develop/howto/config-params#4-voting-for-configuration-proposals (reply to 28786)

D: Hello guys

D: how can i identify on which line of smart contract code error is coming ?

Andrew: afaik v4 wallet is not present in tonweb (reply to 28787)

D: and also how can i check which arguments are sent to a specific transaction.

Vatshayan: Then which one is present can you please share ? (reply to 28793)

Andrew: V3 is there for sure (reply to 28795)

Vatshayan: v3R2 ?

Andrew: yes

Vatshayan: Thank you wallet is deployed now  Even Getting deploy address too :)

Vatshayan: But now for sendTon getting errors as  "Error Method now allowed"  await wallet.methods.transfer({             secretKey: key.secretKey,             toAddress: to,             amount: nano,             seqno: seqno,             payload: message,             sendMode: 3,         }).send();

Vatshayan: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not acceptedCannot run message on account: inbound external message rejected by transaction CECF07AC31F2C52504B4373175FDC6D5DF1019BBB540FDFC2B6F01FA66B66208:exitcode=33, steps=33, gas_used=0VM Log (truncated):...OWexecute XCHG s1,s3execute LEQexecute THROWIF 35execute PUSH c4execute CTOSexecute LDU 32execute LDU 32execute LDU 256execute ENDSexecute XCPU s3,s2execute EQUALexecute THROWIFNOT 33default exception handler, terminating vm with exit code 33'

Vatshayan: Any solutions for this Error ?

Tim: wrong signature

&rey: Probably seqno is wrong. You see EQUAL + THROWIFNOT as the last commands. This means that either seqno or subwallet_id is wrong. Subwallet_id is managed by TonWeb, so that means you get invalid seqno. (reply to 28801)

Vatshayan: Before running again I got wallet is deployed amnd even got deploy address too But now getting this :  'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not acceptedCannot run message on account: inbound external message rejected by transaction CECF07AC31F2C52504B4373175FDC6D5DF1019BBB540FDFC2B6F01FA66B66208:exitcode=33, steps=33, gas_used=0VM Log (truncated):...OWexecute XCHG s1,s3execute LEQexecute THROWIF 35execute PUSH c4execute CTOSexecute LDU 32execute LDU 32execute LDU 256execute ENDSexecute XCPU s3,s2execute EQUALexecute THROWIFNOT 33default exception handler, terminating vm with exit code 33'

Vatshayan: Seqno is correct

&rey: Could you try to output it? Actually, I've heard of some problems with await wallet.methods.seqno().call(). (reply to 28806)

D: hello

D: i am deploying collection from toncli and smartcontract code

D: on getCollectionData is am getting error

D: it means collection is no initialized?

D: i am adding mnemonic to the ton keeper and its saying wrong phrase?

D: in Ton wallet its working

&rey: Generally, that does not happen. Are all the words correct? Also, do other wallets like OpenMask accept the mnemonic? (reply to 28813)

D: can u give me the extension url of this wallet?

&rey: I'm sorry for mixing up the applications... I've meant OpenMask. It's present in the list at https://ton.app/wallets. (reply to 28816)

D: its on the mobile

D: i am using chrome extension

D: on mobile its working

dijor: is there any way to get all the information about all different fees of a transaction? Tonscan has "total", "storage", "forward", and "other". The majority of the fee in my case stems from "other". Is this "other" fee entirely "computation_fee", or could it be something else?

Andrey: {   transactions {     bounce_ph_msg_fees     bounce_ph_fwd_fees     compute_ph_gas_fees     in_msg_ihr_fee_grams     in_msg_fwd_fee_grams     bounce_ph_req_fwd_fees     action_ph_total_fwd_fees     storage_ph_storage_fees_due     out_msg_fwd_fee_grams     out_msg_ihr_fee_grams   } }  click  Also: https://docs.ton.org/develop/smart-contracts/fees (reply to 28822)

dijor: Thanks a lot, that helps! (reply to 28823)

🏸: Hi guys, is there anyone here who can write a smart contract, please DM me

— 2023-05-30 —

D: can i get transactions of specific operation from top api ?

Andrey: {   transactions(in_msg_op_code_hex: "0xd53276db") {     address     workchain     in_msg_type   } }   dton graphql example (reply to 28828)

D: and for the specific address?

Andrey: Add address_friendly filter:   {   transactions(     address_friendly: "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"   ) {     address     workchain     in_msg_type     in_msg_op_code   } } (reply to 28830)

D: address should be converted?

Andrey: No, in any form

D: Thanks man

Rustam: Is exist API to telegram p2p market?

D: is ton smart contract is upgradeable ?

Tim: If you make it so (reply to 28836)

D: how can i check if contract is upgradable ?

D: can someone tell me what the problem in this code ? its giving error  8 - Cell overflow. Writing to builder is not possible since after operation there would be more than 1023 bits or 4 references.

Tim: Too much data, split it into 2 cells

D: can u show me how ?

D: like this ?

Tim: Look at Getgems nft sale

D: i didnt understand this message

Tim: Getgems has nft sale contract on github (reply to 28844)

D: ok

Max: Arguments for function call are stored inside one cell, and cell size is 1023 bits max. So that means that we can call contract using at most 1023 bits for arguments?

&rey: Cell can contain up to 4 references to other cells. (reply to 28847)

&rey: Those cells can contain other references as well.

1da3e121ee6492a6eae63b77ee18b5ff: Hi guys what is the difference between image and content in nft metadata?

Max: Is it possible to return value from recv_internal ? or everything non-void should be accessed through get_ functions?

Tse: Hi, I'm trying to transfer NFTs via python tonsdk,  I followed the example. The result is part of the 0.05 ton goes to the tx fee and the rest goes to the receiver, I'm wondering if there's a way for tx sender to keep the remaining TON:  body = NFTItem().create_transfer_body(     Address("New Owner Address") ) query = wallet.create_transfer_message(     "NFT Item Address",     to_nano(0.05, "ton"),     0,  # owner wallet seqno     payload=body ) nft_boc = bytes_to_b64str(query["message"].to_boc(False))

— 2023-05-31 —

&rey: Everything non-void should be accessed through get_ functions. recv_internal may "return" value by sending outgoing messages, just like it is invoked in the first place. (reply to 28853)

&rey: There should be a parameter in create_transfer_body indicating where excess TONs go (something like response_destination). (reply to 28856)

Gulolio: Hi guys, is it possible to request a getter function, let's say get_nft_data() from telemint contract, from my smart contract in FunC? And if it's possible, is there any example you may have at hand that can show me how to do this? Or maybe doesn't makes any sense

User<6247944943>: you can't. get method is for off-chain fetch data use (reply to 28864)

User<6247944943>: Unless they had prepared a TL-B based get method like here in STON.fi:   https://docs.ston.fi/docs/developer-section/api-reference/pool (reply to 28864)

Gulolio: Thanks man (reply to 28865)

Jhunie Ray: LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction EACC36100495FE002982E7D41093FEE0250E44B634DE3BB08B8D0F0E47F9158B:\nexitcode=35, steps=31, gas_used=0\nVM Log (truncated):\n... XCPU s4,s3\nexecute EQUAL\nexecute THROWIFNOT 33\nexecute XCPU s5,s1\nexecute EQUAL\nexecute THROWIFNOT 34\nexecute XCHG s5\nexecute HASHSU\nexecute XC2PU s0,s6,s4\nexecute CHKSIGNU\nexecute THROWIFNOT 35\ndefault exception handler, terminating vm with exit code 35\n

D: hello guys, hope u all doing good.

D: what is the meaning of this error ? 65535

&rey: Usually "unknown opcode". (reply to 28870)

&rey: Invalid signature. Look for command just before THROWIFNOT. (reply to 28868)

Jhunie Ray: meaning wrong secret? (reply to 28872)

Jhunie Ray: i am transferring nft from my wallet to other wallet, but i cant sendTransfer because of that error, also cant get secretKey.

D: can u tell me what is this upper cell means? and what is meant by .store_uint(0x18, 6)

Dmitry | backend4you.ton: https://docs.ton.org/develop/smart-contracts/messages check this to know more about message cells  .store_uint(0x18, 6) stores 6 bits from value 0x18 (0x18 is binary 0001 1000, and 6 bits that stored are 01 1000) (reply to 28878)

User<6247944943>: there has similar content here: https://answers.ton.org/question/1555046484724944896/what-does-int-msg-info-means-in-this-func (reply to 28878)

D: i am sending nft from contract and if i use one cell begin_cell()         .store_uint(0x18, 6)          .store_slice(nft_item_address)         .store_coins(50000000)         .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);         .store_uint(op::transfer(), 32)         .store_uint(0, 64)         .store_slice(to) ;; new_owner_address         .store_slice(to) ;; response_address         .store_int(0, 1) ;; empty custom_payload         .store_coins(0) ;; forward amount to new_owner_address         .store_int(0, 1) ;; empty forward_payload         .end_cell(); like this  it says  cell overflow error and if spllit into two then its saying unknow opcode or cell undeflow.

D: what should i do ?

Tim: example from getgems (reply to 28881)

D: isn't it the same thing that i did?

Tim: 1 here

Tim: forward amount should be 0.01

D: fine now ?

Tim: can you try first?

Tim: i can't compile code in my brain

D: alright, i am checking.

승재: How can I get the value by calling the getter method of another contract inside FunC contract?

D: Thanks man its working now, thank u very much. (reply to 28889)

Dima: Watsup D D (reply to 28893)

D: All good thanks to Tim.

Vatshayan: Need to validate address in ton using nodejs  In documentation there is no clear information about this

Vatshayan: Even checked API doc too

Oleg: I don’t think it’s possible due to asynchronous origin of TON (reply to 28892)

승재: what...

Vatshayan: Need to validate address in ton   That this address is ton blockchain address or any other blockchain token address

Vatshayan: any method ? any function  code

Vatshayan: in js

&rey: There is no way to do so. TON contracts interact only by sending messages. (reply to 28892)

Y̷A̷M̷I̷: What do I have to enter here to create my site?  Is there an English tutorial online?  I'm not a developer, but I'd like to create my Landing Page in ton.

Y̷A̷M̷I̷: 🥲🥲🥲help

&rey: There is a documentation page, which may help you: https://docs.ton.org/develop/dapps/tutorials/how-to-run-ton-site (reply to 28904)

Y̷A̷M̷I̷: Sounds complicated but I'll try.🫠 (reply to 28906)

Andrew: https://telegra.ph/Host-static-TON-site-in-TON-Storage-03-19 (reply to 28907)

Javad: i just get masterchain info from tonapi and toncenter they are response different  shard value !  tonapi shard is : "8000000000000000"  and ton center shard : "-9223372036854775808"  why ? what exactly is shard ?

Marat: Shard is 64 bit integer. tonapi returns shard as hex value, while toncenter returns it as dec value. (reply to 28909)

Javad: Aha ! Thanks what is seqno ? it's like block number ? or transaction number ? (reply to 28910)

Marat: block number (reply to 28911)

Javad: i get transactions of block and every time i change the block number it's response 3 transactions with same data !  what are Elector Contract and Config Contract ? (reply to 28912)

Tim: Docs.ton.org

Javad: which page ? (reply to 28914)

Tim: Based on your questions - read everything

&rey: Actually, that can fail if documentation is written faster than read) And that certainly could be the case, as there are many people contributing to docs))) (reply to 28916)

Javad: my questions are about block and transactions.  i read doc before more than 2 times and i create some contract ! so please tell me which part of document related to my question (reply to 28916)

Javad: OK Thank you but my main question is as i worked with EVM and every block has some transactions  so for a reason i need to track 30K contracts and i decide to real all transaction to track them so i get transactions of some block, and every time i get 3 transactions !  how can i get all transactions ? (reply to 28919)

Tim: You need to also get all shard blocks

Tim: But those 3 txes are just regular ones, you'll get more if there will be more

Javad: first i get masterchain info and read seqno then i get blocks with seqno and every time i get 3 txes !  Ok let me try with more seqno (reply to 28922)

Javad: Ok i did it ! ( with your help ! ) first i get masterchain then i get shard and then i get transaction of that shard (reply to 28921)

— 2023-06-01 —

Vatshayan: Hello   Need to do validation of ton address   can anyone please share code/ repo / method to validate address using ton api or ton sdk or nacl

Vatshayan: In simple need to validate address that is this address is of ton or not

Arsen: . (reply to 28146)

ninja: Hello everyone,  I am facing issues with TonConnectButton from @tonconnect/ui-react  When I use it with hooks with conditional rendering, it fails to render after the state is changed or component re-renders

ninja: I'm new here, is this the way issues are solved?

ninja: haha he disappeared

Andrew: lol (reply to 28932)

Andrew: try opening an issue in the tonconnect repo (reply to 28931)

D: hello, anybody know how i can convert BNB to TON ?

D: the one i found not connecting the metamask.

Alex: Since this seems like a connection issue, try to use a different network provider, VPN. You can ask for help in the @ton_help_bot. (reply to 28938)

D: ok

Sergey: hi, as I understand we can use libraries from the masterchain or incoming state-init, how should such functions  be defined in func?

Sergey: and how to prepare a lib and deploy it to the masterchain?

Sergey: can't find anything related in the docs

Noam: I understood that the max token supply is 5b, but the total supply is higher, how is that possible?

Andrew: 0.6% yearly inflation (reply to 28944)

Noam: I still dont get it, can you please elaborate? 🙏🏼 (reply to 28945)

Andrew: new tokens are minted as part of the validators' reward, with a fixed rate of 0.6% per year (reply to 28946)

Noam: So isnt the max supply should be higher? Or the total supply will just continue growing?

Andrew: total supply will continue, yes, but the new deflation mechanism will be proposed in the coming days (reply to 28948)

Noam: Thanks! (reply to 28949)

Vatshayan: Thanks it worked  Thank you !! (reply to 28930)

D: i am deloying contract and its keep giving me the same address

D: i want to deploy same contract with new address

D: what should i do ?

Tim: add some param to data and change it

User<6247944943>: ❤️❤️❤️❤️

sz: https://www.theblock.co/post/232879/ton-foundation-proposes-burning-50-of-validator-rewards is Really?

pdzeng: hello, I have a question here.  how can i calculate my total tx gas fees?  https://test-explorer.toncoin.org/transaction?account=0:1d898cd7f90ae860760cb577cd59084721292a81d14c5fe31bc2bbb531bdd6c4&lt=11898016000001&hash=54c5df44a7c812d9808879b76eb4ef85290089d1350a48115bc4500556ab26d4 (forwarded from pdzeng)

เจตต์ธนาพงษ์: ton://transfer/EQBmZbQ3VH2-RrQVhM_gE88fb3uLRLXBk3u1sBgqHAuB9btj

Victor: I suggest you use dton.io for checking your fees (reply to 28959)

TON Answers Bot (not AI): How does the TON foundation generate income? from hadrian  Is there anywhere that I can read about how many tokens were allocated to the TON foundation or similar entities in the initial release? Does the TON foundation only make money from transaction fees?  🔗 Answer on TON Overflow

— 2023-06-02 —

Maksim: hey guys! the fourth Ton - Python lesson just came out!  lesson themes: NFT collection creation and deployment; NFT (batch) minting; NFT transfer  youtube - https://www.youtube.com/watch?v=mBDSZnqpDbo  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_4  course repo - https://github.com/TonDevStudy/pyton-lessons-eng

pdzeng: I want to ask how can i estimate gas fees. I think dton.io not work on me. (reply to 28961)

pdzeng: 😭😭😭

Maksim: The fifth Ton - Python lesson is just came out!  lesson themes: NFT collection parsing via get methods; single NFT items parsing; NFT sale (auction) contracts parsing; get all NFT items by collection address  youtube - https://www.youtube.com/watch?v=XPL97vlmfts  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_5  course repo - https://github.com/TonDevStudy/pyton-lessons-eng (reply to 28964)

gary: Do you have any learning materials for JavaScript-SDK?

Alex: Doesn't full list, but useful for the beginning. - https://docs.ton.org/develop/get-started-with-ton - https://docs.ton.org/develop/smart-contracts/tutorials/wallet - https://ton-community.github.io/tutorials/01-wallet/ - https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg  Full list - https://github.com/ton-community/awesome-ton#-education (reply to 28968)

J: What's the staking APR of TON?

J: Is there any liquid staking service at TON?

Andrew: bemo.finance (reply to 28973)

Andrew: https://tontech.io/stats/ (reply to 28972)

Kate: Hi, community! Is there anyone in Portugal now?  Don’t miss our offline meetup for devs in Lisbon TODAY at 7.00 pm📆:   FAQ of crypto taxation in Portugal by Thomas Maas (founder of "Сrypto and Taxes Portugal") followed by Q&A session  See you in AFI Network hub located in the heart of Lisbon  Drinks and snacks are on us 🆓Reserve your spot HERE

Vatshayan: Do we have block number or block height for ton blockchain

Vatshayan: because I cant see on ton explorer  I can see only from, to, fee, timestamp

Vatshayan: Also how can we establish connection in ton and check that we are connected with ton

Vatshayan: Need to monitoring of ton transcation  Block number is used in other blockchain tokens So, in ton what we check ? like block number or header

J: Thanks for your information (reply to 28976)

— 2023-06-03 —

Maksim: The sixth Ton - Python lesson is just came out!  lesson themes: Jetton minter deployment; Jettons mint, transfer and burn  youtube - https://www.youtube.com/watch?v=cT9M54Y3uc8  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_6  course repo - https://github.com/TonDevStudy/pyton-lessons-eng

Maksim: And the seventh Ton - Python lesson is just came out!  lesson themes: Jetton content parsing (onchain and offchain); Hashmaps introduction; Jetton wallet parsing  youtube - https://www.youtube.com/watch?v=7WhF15NA5P8  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_7  course repo - https://github.com/TonDevStudy/pyton-lessons-eng (reply to 28992)

Javad: How much is APY of validators ?

Alex: https://ton.org/en/validator  It's a dynamic value. Read more in the Reward section. (reply to 28994)

Javad: As i understaned, average 120 TON per day  And if i stake 300K Ton the APY is about 14% Right ? (reply to 28995)

Anthony: https://tontech.io/stats/ (reply to 28996)

Javad: Past elections ? (reply to 28997)

Anthony: The Staking APY section

Javad: Thanks  it's says the annual percent is 6.2%, it's mean if i run validator i can make 6.2% in a year  Isn't it too little ? I thought it was at least 20% (reply to 28999)

澀谷工程師: Did any one use tonuntils-go lib to develop?

澀谷工程師: I encounter a problem of parse data

澀谷工程師: https://stackoverflow.com/questions/76395739/how-to-pass-the-data-value-from-any-type-into-a-grpc-protobuf-struct-in-golang

澀谷工程師: this is my question

Anthony: It depends on the number of validators in the network. It was about 16% APY, but now we have a lot of new validators (reply to 29000)

澀谷工程師: does any one can help me 😭?

Javad: doesn't this make validators to quit or prevent them from doing this?  doesn't this  prevent blockchain's progress ?  For example, if the number of validators is doubled, it will definitely give reward for a much smaller amount percentage (reply to 29005)

&rey: However bigger APY would lead to inflation and constant reward rate maintains the TON price. (reply to 29007)

Javad: I think I read somewhere that validators are rewarded in two ways. 1- transactions fee 2- new coin generated  The sum of these two is 6.2% ? (reply to 29008)

User<6247944943>: It’s centralized way right. (reply to 28975)

User<6247944943>: I think so. But usually monitoring Logical Time only. Since TON is asynchronized blockchain. (reply to 28979)

Alex: Try to address your question here (reply to 29001)

Gajesh: is it possible to build data inside a smart contract? (func)  for example:  - i wana deploy nft collection from a smart contract.  - code is constant - how can i build the data?

&rey: Yes, it's possible. The code will be very similar to JS/TS wrapper for the same collection.  cell data = beginCell()   .store...   .store...   .storeRef(...)   .endCell(); (reply to 29013)

Gajesh: gotcha (reply to 29014)

Gajesh: thanks!

Diako: seqno is similar of block number in evm (reply to 28983)

— 2023-06-04 —

eric: hello

User<2085820373>: Hi! Can anyone, please, explain how can I build a website on TON blockchain and how much will it cost me?

Dmitry | backend4you.ton: 1) use adnl proxy in front of your webserver to get your “usual” site also accessible via something.ton address. Cost: usual site costs + hosting adnl proxy (VPS costs?)  2) ton storage: static files only, no backend/serverside     . Cost: keeping your own ton storage instance (VPS costs) or paying other nodes to store your files (every storage can set own fees, e.g. tonbytes offers 1ton/month for 4gb package) (reply to 29021)

User<2085820373>: Thank You! 🙏 (reply to 29022)

Shebby: hi everybody, what suffixes are the different nets? eg. I pressed the tonkeeper button (on desktop) 5 times and I'm my net has a suffix of -3, the other one is -239. Which one is which

&rey: from @tonconnect/sdk: export declare enum CHAIN {     MAINNET = "-239",     TESTNET = "-3" } (reply to 29024)

Shebby: Awesome, thanks

Catarina: No inglês

Danila: Hi, how to create the Slice with Ton-Core which stores sender address?  export type Config = {   owner: Slice; };  export function configToCell(config: Config): Cell {   return beginCell().     storeSlice(config.owner).     endCell(); }  configToCell({ owner: ??? });

Daniil: depends on who's the sender 🙂 can you give some more context please? where are you calling these functions? (reply to 29030)

Andrew: .storeAddress() (reply to 29030)

Danila: I want to deploy the contract using blueprint. The init data should contain the address of deployer. (reply to 29031)

Daniil: you can usually get the .address property of sender (in this case, blockchain treasury owner created before) (reply to 29033)

Daniil: If you need the sender's address in deployment script, here's another example.

Danila: Thank you guys, I will try both variants

— 2023-06-05 —

Gulolio: Hi there, does anyone has an example for testing external messages handler with blueprint? The only example I found in the doc is related to internal message handler. This one https://github.com/ton-community/blueprint/blob/main/example/tests/Counter.spec.ts

Alex: There some examples for the Sandbox: https://github.com/ton-community/sandbox/blob/0f91333ad34428e911729b58df3649b7bc96880c/src/blockchain/Blockchain.spec.ts#L219C65-L233 https://github.com/ton-community/sandbox/blob/0f91333ad34428e911729b58df3649b7bc96880c/src/blockchain/Blockchain.spec.ts#L443-L483  Treasury.send - sending of the external message (reply to 29041)

Gulolio: Thanks 👊 (reply to 29042)

Vatshayan: How we write a method to get all transcation using timestamp in ton blockchain ?

gary: hello, How ton Jetton uses 'typescript' for transfer and event monitoring ？Are there any examples?

Alex: Examples here

Alex: Best practices for processing deposits and withdrawals in Toncoin and Jettons  When integrating Toncoin and Jettons to your exchange/bot/payment system, please refer to the JS examples:  Toncoin  — Processing deposits  — Processing withdrawals  — Detailed info  Jettons  — Processing deposits  — Processing withdrawals  — Detailed info (forwarded from The Open Network)

gary: ok,thanks

Vatshayan: Need to get all transcation from ton address using timestamp  please let me know with any method in JS

Dan: Hi guys!   How to burn an NFT on Ton?

Andrew: send it to zero address (reply to 29050)

Andrew: 0:0000000000000000000000000000000000000000000000000000000000000000

Dan: What is zero address? Just 0?

Dan: Ah ok, thanks

User<6203593029>: Hello everyone! As a Full-stack Blockchain developer specializing in FunC, I'm currently seeking new TON-related projects. I'm ready for anything from small tasks to long-term partnerships. If anyone is in need of a skilled developer or knows someone who is, feel free to get in touch. I'm open to any questions!

D: hello, hope u r all doing good.

D: how to get nft item royalty information if nft item has no collection? in tonWeb sdk.

Vatshayan: Hello Can I get transcation method in js for getting information for al transcation

Vatshayan: as we need to do monitor ton transcation

Andrew: there are plenty of APIs and explorers (reply to 29060)

&rey: Do you need to monitor all of them or a particular kind? (reply to 29061)

Vatshayan: we need to monitor all the transcations. kindly provide me how to call the getTranscation method.  As I am using getTranscation but it is not fetching

&rey: Actually, you can get the transactions list for block and iterate by block height. However, for some tasks the algorithm can be more efficient. What are you intending to do with transactions list? (reply to 29064)

Vatshayan: How to call the method ? by which method from api list ?

&rey: lookupBlock (reply to 29066)

Vatshayan: but by using timestamp

Vatshayan: we need to check by giving timestamp

Ignat: guys, when I send a transaction via Tonkeeper for example, my transaction will always processed by a recv_internal function. But where are things like comments contained?

Ignat: When I try to load an address from my transactions comment, it doesnt work

&rey: in_msg_body (last argument of recv_internal). (reply to 29078)

&rey: Do you pass the address as text? (reply to 29079)

&rey: If so, you need to parse it in order to convert it into 267-bit TON representation.

Ignat: I guess when I put a comment doing transaction in Tonkeeper comments are always represented as strings (reply to 29081)

Ignat: ok i’ll try thx (reply to 29082)

&rey: Do you know how to parse the address in FunC? (reply to 29084)

Ignat: load_msg_addr?

&rey: No, it only loads 267-bit TON representation.

&rey: You now need to load 32 bits from in_msg_body (these will be 0, indicating text transfer) and then use the following function: (slice, builder) decode_base64_address_to(slice readable, builder target) inline {   builder addr_with_flags = begin_cell();   repeat(48) {     int char = readable~load_uint(8);     if (char >= "a"u) {       addr_with_flags~store_uint(char - "a"u + 26, 6);     } elseif ((char == "_"u) | (char == "/"u)) {       addr_with_flags~store_uint(63, 6);     } elseif (char >= "A"u) {       addr_with_flags~store_uint(char - "A"u, 6);     } elseif (char >= "0"u) {       addr_with_flags~store_uint(char - "0"u + 52, 6);     } else {       addr_with_flags~store_uint(62, 6);     }   }      slice addr_with_flags = addr_with_flags.end_cell().begin_parse();   addr_with_flags~skip_bits(8);   addr_with_flags~skip_last_bits(16);   target~store_uint(4, 3);   target~store_slice(addr_with_flags);   return (readable, target); } slice decode_base64_address(slice readable) method_id {   (slice _remaining, builder addr) = decode_base64_address_to(readable, begin_cell());   return addr.end_cell().begin_parse(); }

&rey: () recv_internal(...) {   ...   if (in_msg_body~load_uint(32) != 0) { return (); }   slice address = in_msg_body.decode_base64_address(); }

Ignat: bro thank you very much:) Will try it right now

Ignat: u r the best

خالد: هاي

G: How can I get history of mints and transfers of a jetton?   For exmaple I want to know the history of jUSDC that was minted or transferred to my wallet.

Ignat: Bro, if I send a simple transfer message with comment, where sender’s address is stored? In msg_body? (reply to 29089)

&rey: in_msg_body, yes. After 32 zero bits. (reply to 29095)

Ignat: kk thx

Macy: Hello all, anyone who can help me for creating stake contract with func ?

— 2023-06-06 —

Maksim: The eighth Ton - Python lesson is just came out!  lesson themes: Highload wallets: deployment, transfer; HashMaps reading; Blockchain config parsing; youtube - https://youtu.be/GLGGk_akkJk  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_8  course repo - https://github.com/TonDevStudy/pyton-lessons-eng

Yuri: Hey guys, is it allowed to use tick tock transactions on the BaseChain? Based on my understanding, It won't be needed for me to send external messages to execute a certain operation periodically.

Yuri: I.e., no need for a keeper

&rey: Sadly, there is no such option. You may use timer: https://programcrafter.github.io/ton-stable-timer (it is in development yet, but there are no known bugs at the moment). (reply to 29117)

Yuri: Gotcha... Subscriptions would work much cooler hehe

Yuri: Is it a possibility for the future?

User<2085820373>: Trading means speculating. And that's how inflation is created. (reply to 29122)

D: hello guys

D: can i use "packAddress" in the tonWeb sdk ?

Vatshayan: getTransactions method will work for getting transcation from ton address ?

Клецка: can somebody explain what does force_chain function does in smart contract? i can not find it's definition in docs

Andrew: it ensures that execution will continue only if the address it accepts as an argument doesn't reside in the masterchain (reply to 29130)

Dario: Its not a standard function, thats why its not in docs (reply to 29130)

Клецка: dankon! (reply to 29132)

Клецка: where does this function comes from then? (reply to 29132)

Dario: you should find it in source codes of the contract, like utils.fc or file like it

Dario: which contract are you reviewing?

Клецка: this smart contract. but i can't fing this function https://tonviewer.com/EQB32bnYd8yl57TPQqG4OF7rNtAAoZz_jemQRveLO0Z4TVf0?section=Source+code (reply to 29136)

Клецка: oh. i'm just blind. i found it.....

Dario: https://github.com/ton-blockchain/token-contract/blob/main/nft/params.fc#L3 (reply to 29137)

Клецка: sorry

User<2085820373>: Can TON crew, please, build an app, if it's not already built, that could be used for identification purposes. Basically, an alternative to passports and/or other types of IDs...

User<2085820373>: My idea is not to create a digital ID for online shopping. We need it to be useful in airports, docks, etc. (reply to 29141)

Dmitry | backend4you.ton: https://telegram.org/blog/passport ? (reply to 29141)

User<2085820373>: Thank You! But the question remains - will these date be useful in airports, and I will be able to travel even to Atlantis without any passports? (reply to 29144)

Dmitry | backend4you.ton: This question is not for this chat. You should ask it to your government and airport authorities. (reply to 29145)

User<2085820373>: Nice! Thank You! (reply to 29146)

D: 38 - Not enough extra-currencies.

D: what is the meaning of this error? (reply to 29148)

Yuri: Hmm, how does it work? (reply to 29119)

&rey: It keeps sending message to itself (or, more correctly, to masterchain and waiting for bounce) until the specified time is reached. (reply to 29151)

Dario: How much does it cost per day? (reply to 29152)

&rey: 260 TON/day. That's cost imposed by blockchain itself. (reply to 29153)

Dario: I see

Daniil: But it can be split between many users of the same contract. (reply to 29154)

Yuri: Is it possible to keep sending messages between 2 contracts on the BaseChain? (reply to 29152)

Daniil: Yes, but it's costly (reply to 29157)

Tim: Бесплатные экстерналы - 😂 Платить 260 тон в день за таймер - 👍

Yuri: It's not costly because it's masterchain?

&rey: Yes. However, if they are in the same shardchain, then there will be as many messages in block as can fit, so there are >20 messages per block. This turns out to be more expensive than sending messages to masterchain and back. (reply to 29157)

Yuri: I see, gotcha! (reply to 29161)

User<1771193913>: 👍

— 2023-06-07 —

gary: How to get the message here?

gary: use ts

gary: What does it mean here?

Tumin | Wagmi11: hello folk I have a doubt regarding setting up a local testing env for my Telegram Web App (TWA)  can you guide me/provide resources which I can follow to do it?  whenever I try to attach a localhost url as a reply from my bot, it fails I proxied it forcefully over ssl to get https but the testing env does not allow me to test over the same network so I am unable to test the feature on my phone  if anyone has a work around, or guide, any help would be appreciated thank you

Howard: - https://t.me/tsunami_trade_bot - https://t.me/EvaaAppBot (reply to 29169)

Tumin | Wagmi11: on it thank you

Tumin | Wagmi11: I understand a lot of TWAs exist,  Despite following all the steps here  https://core.telegram.org/bots/webapps#testing-web-apps  I was not able to test my TWA on phone  so my workaround to that was using ssl   https://t.me/tondev_eng/29169

Howard: this is also quite good:  https://ton-community.github.io/tutorials/03-client/ (reply to 29172)

TON Answers Bot (not AI): Error 500 when using endpoint from Orbs from Sergei Krivochenko  He everyone  I use API v4. In the docs there is example of getting block by unix time: https://mainnet-v4.tonhubapi.com/block/utime/1680031682. Here everything is clear. But if I try to use endpoint from @orbs-network/ton-access request https://ton.access.orbs.network/44A1c0ff5Bd3F8B62C092Ab4D238bEE463E644A1/1/mainnet/ton-api-v4/block/utime/1680031682 returns 500 error.   Are there any restrictions when use endpoints from Orbs?    🔗 Answer on TON Overflow

اسرارالله: Hi

Maksim: The ninth Ton - Python lesson is just came out!  lesson themes: Multisig wallets creation; off-chain and on-chain signatures; reading contracts data youtube - https://www.youtube.com/watch?v=1pM3mPYZGtQ  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_9  course repo - https://github.com/TonDevStudy/pyton-lessons-eng

Rahul: I am building TON web IDE(Nujan). For testing I would require some func contract example with script file for  getter/contract interaction.  The more examples we will have, better IDE will be.

Rahul: If anyone could help us. Would be great.

Oleg: try ngrok (reply to 29169)

D: hey, can anybody explain the meaning of this error ? "38 - Not enough extra-currencies."

gary: hello， how to get comments？i have a problem here

Yuri: Hey guys, If I do something like this. Reply is send_raw_message (mode 64). So, if the contract doesn't have MIN_TON_STORAGE it's gonna take the difference from msg_value and send the remaining on reply back to the user. If the contract has MIN_TON_RESERVE on it's balance, it's gonna send all remaining msg_value back, correct?

User<5985733780>: So does it mean its not easy to view ur site? (reply to 22723)

Tse: If you think connecting to a 3rd party / self-host ton proxy is not easy, then the answer is yes. (reply to 29183)

Andrew: it's easy via gateways such as ton.run, ton.ski, ton.website (reply to 29183)

Vatshayan: How to get confirmation of ton trasfer or transcation ? Is there is any method or function in JS to do

Andrew: if you need it for processing payments, you can use ready-made SDK for js - https://tonpay.gitbook.io/tonpay-sdk/ (reply to 29186)

Vatshayan: how to get transcation by hash in ton blockchain using js

Vatshayan: through tonweb package

Vatshayan: https://toncenter.com/api/v2/#/

Vatshayan: IS there is  method from above ?

Puria: hey guys how can I pass a comment during transaction creation using ton-connect?

Daniil: https://docs.ton.org/develop/dapps/ton-connect/transactions#transfer-with-comment-contract-deployment (reply to 29193)

Cocomastoras: Hello is there anyone I can talk to about contract testing ?  Whenever I use invoke method my test fails with error code 2 , even the tutorial tests

Vardan: Dear community, I would like to ask, which platform support withdrawal/sell toncoin ?

Freed: You can buy usdt with ton using wallet bot and withdraw it to tron blockchain (reply to 29196)

Андрей: and this is not about development and does not apply to the subject of this chat (reply to 29197)

Cocomastoras: Anyone managed to test a smart contract function with toncil?

Cocomastoras: I am just trying to run the https://github.com/romanovichim/TonFunClessons_Eng/blob/main/11lesson/11lesson.md

Cocomastoras: Shouldn’t the examples just run correctly ?

Zyxep: anyone can help me to autopayment in getgems by python?

&rey: If you have an environment set up correctly, this should work. Toncli tests support executing any contract function, not just recv_internal/recv_external. (reply to 29203)

Cocomastoras: Nope I got error code 2 on all of them (reply to 29208)

&rey: Do you have Asm.fif and similar files matching your toncli and binaries versions? (reply to 29209)

&rey: I have toncli v0.0.43, Fift+FunC+lite-server v0.4.4 (toncli-local branch, commit 8ddfb0eadd5fa0401fa0eb560bae940e5a941b1b). (reply to 29211)

&rey: pip show toncli fift -V

Cocomastoras: Toncil v0.0.43  ift build information: [ Commit: 8537dd60e6341474967f8e9d04a7b7f6a060ec36, Date: 2022-06-13 20:02:32 +0300] FunC semantic version: v0.2.0 Build information: [ Commit: 8537dd60e6341474967f8e9d04a7b7f6a060ec36, Date: 2022-06-13 20:02:32 +0300] lite-client build information: [ Commit: 8537dd60e6341474967f8e9d04a7b7f6a060ec36, Date: 2022-06-13 20:02:32 +0300] (reply to 29210)

&rey: Probably you have to upgrade the binaries. (reply to 29214)

Cocomastoras: Any pip comment for upgrade ? Or have to manually ?

&rey: Manually. See https://github.com/disintar/toncli/blob/master/INSTALLATION.md. (reply to 29216)

&rey: And here are the Fift libs working with that version of binaries.

Cocomastoras: The binaries are expired I can’t download them https://github.com/SpyCheese/ton/actions/runs/4055187491

Cocomastoras: I find it in another commit let me try it

Alireza [Fi]: 🫣👋

Good: I run TON Storage locally, prepare test light-weight bag (~71KB), send upload bag into TON mainnet, but nothing happens. Tell me please what else needs to be done?

TON Answers Bot (not AI): TON node not syncing from Semyon Zhulikov  Please, could you help me to understand why my TON node cant sync  Load average8: 1.34, 1.26, 1.29 Network load average (Mbit/s): 9.44, 8.71, 48.85 Memory load: ram:16.06 Gb, 50.3%, swap:0.0 Gb, 0.0% Disks load average (MB/s): sda:4.14, 0.82%, sdb:0.05, 1.22% Mytoncore status: working, 1 hours Local validator status: working, 12 minutes Local validator out of sync: 1686148396 s Local validator database size: 0.04 Gb, 43.3%  And out of sync time raising every check  Could you please give me any advise how to fix this?  🔗 Answer on TON Overflow

Cocomastoras: Updated the binaries still failing

&rey: The strangest thing is that code gets actually executed, as you may see in "total gas used". Could you try to replace invoke_method(fn, [a, b, ...]) with fn(a, b, ...)? (reply to 29211)

Cocomastoras: Let me try

&rey: Also, you may use build.py script to get a bit nicer logs.

Cocomastoras: Yeah that doesn’t compile (reply to 29225)

Cocomastoras: Fift build information: [ Commit: 89c6e5216136549eea3093aeb3917eb804ecf015, Date: 2023-06-07 14:01:23 +0300] FunC semantic version: v0.4.4 Build information: [ Commit: 89c6e5216136549eea3093aeb3917eb804ecf015, Date: 2023-06-07 14:01:23 +0300] lite-client build information: [ Commit: 89c6e5216136549eea3093aeb3917eb804ecf015, Date: 2023-06-07 14:01:23 +0300]

&rey: Have you loaded binaries from branch toncli-local? Other branches don't support opcodes like RESETLOADEDCELLS and some others, and those opcodes are used by testing utilities. (reply to 29230)

Gajesh: hi guys! looking for folks to give feedback on the nft sdk’s (by tontech) first version   hit me up

Cocomastoras: You are a legend I was getting from wrong branch (reply to 29231)

&rey: Does everything work now? (reply to 29233)

Cocomastoras: Yes

Cocomastoras: Thanks

&rey: To authors of TVM upgrade It seems that currently TVM does not support Merkle proof cells at the level needed for proving blocks/transactions. In particular, it is only possible to get cell hash of infinite level (cell and hash levels: https://ton.org/tvm.pdf#Hfootnote.12) via TVM instructions, and it seems that in order to check Merkle proof one needs to get some lower-level hash of cell.

Tumin | Wagmi11: thank you for your help, will try it out 👍 (reply to 29179)

Narek: 🚀 Join TonTech and shape the future of TON blockchain development!   We're hiring developers to build cutting-edge tools and SDKs. Work with the latest blockchain technology, collaborate in a dynamic environment, and access empowering resources. Make an impact on the TON community.   Contact us: @Narek (forwarded from TonTech)

Maksim: The tenth Ton - Python lesson is just came out!  lesson themes: TON Node types; launching Liteserver using mytonctrl; Launching local toncenter; interaction with your own Liteserver using Python youtube - https://www.youtube.com/watch?v=x4rG-aFOqNo  lesson folder - https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_10  course repo - https://github.com/TonDevStudy/pyton-lessons-eng

Tumin | Wagmi11: I understand that ton is very different from solidity,  on EVM we have events which we can listen to off chain, and provide consistency over our on chain, and off chain data  what should be approach to solve the same problem here?  Calling getters methods on chain ensure can ensure data, but do we have a way for listening to events? or transactions?

Tumin | Wagmi11: thank you  I did the same, but I used blueprint to setup my project  here the issue which I faced was that I didn't want to deploy every single change  one of solutions which the community provided was to use ngrok, I will use that to test it (reply to 29173)

Andrew: external messages sent by smart contracts are similar to logs on evm (reply to 29241)

Tumin | Wagmi11: I'll look into external messages 🙂 Thank you (reply to 29243)

Andrew: https://ton.org/ton.pdf#subsubsection.2.4.7  https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L139-L140 (reply to 29244)

Artem: Hey guys! Are there any developer who needs a func contract job? Budget is 500 ton

Alireza [Fi]: Hi guys my friend has a bug that she can't join new channels or groups and it tells her she only can have 500 But her channels and groups barely reach 10

Alireza [Fi]: Can any big guys look into it and help her?

— 2023-06-08 —

&rey: This chat is about development on TON, not Telegram. (reply to 29248)

&rey: To authors of TVM upgrade  Currently, multisig wallets based on BLS12-381 curve are hard to create because of external message gas credit, which is only 10'000 gas (signature checking requires at least 61'424 gas). Can this issue be addressed somehow? (reply to 29237)

Alireza [Fi]: Oh okay is there a chat that can help me with telegram? (reply to 29250)

Tim: You can sign message with regular signature and check it first? Then accept and do expensive check (reply to 29251)

&rey: Alright, then I have an interesting idea of multisig wallet v5) (reply to 29253)

Yuri: Can I use Ton Connect on TWAPs?

Andrew: multisig is better to create separately from versioning simple wallets (reply to 29254)

Lisa OOO: Join our livestream about FunC ❤️

Lisa OOO: Join us tomorrow for an epic workshop hosted by none other than Mark Okhman — the DevRel Manager at TON Foundation! Mark will be diving into the world of FunC smart programming, and it's going to be mind-blowing.  Make sure to set a reminder because Mark's workshop kicks off tomorrow at 16:00 GMT+4.  Just click on the link below to hop in and be part of this awesome experience!   Link to workshop 👈  Save the date. See you there, folks! (forwarded from TON Society)

Дмитрий: Why might this error occur? What did I do wrong? I'm running an example code Jetton TonTools

Дмитрий: Resolved (reply to 29260)

Tony 10am-7pm: Anyone know how I can only allow tonkeeper login in tonconnect/ui by passing my own wallet list? Tried searching on the docs but don't see anything regarding this

Tumin | Wagmi11: I this there is a way to provide wallet list I will try to look into it, if I find any solution will put it here (reply to 29262)

Iman: Hello everyone  Is there anyway or api to get transaction hash from in msg hash ?

Tony 10am-7pm: Thank you! (reply to 29263)

Yuri: Hmm, I haven't seen much in the documentation about sending external messages, just receiving it. What should be the external_address? https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L100-L102 (reply to 29245)

کتابخانه دیجیتال: https://t.me/tonsociety?livestream

Andrew: custom bits, may be some queryId or uuid (reply to 29266)

Andrew: or addr_none)

&rey: Example: https://tonscan.org/address/EQA-dgYSkIiw2J-MJ-0shgp1pzcmnoWo_vfd_240X7VDKuhf#source (reply to 29266)

&rey: b{01} b{001101000} |+ x{0000000052414E443A53454544} |+ 01 is external address tag, 001101000 is the length in bits. and the remaining part is the address encoding.

&rey: {   transactions(in_msg_hash: "F673FAD51524483A3FF022B56F6135804774A48B2FE4DAD3F7F1EDFE69EDA094") {     address     workchain     // etc   } }  Via dton.io/graphql (reply to 29264)

Iman: I want to make api call in my code Im using python and requests Is there endpoint for it? (reply to 29272)

&rey: https://docs.dton.io/dton/how-to-use/python-tontools or https://docs.dton.io/dton/how-to-use#python-requests (reply to 29273)

Iman: Is it work for testnet transactions? (reply to 29272)

&rey: https://testnet.dton.io/graphql (reply to 29275)

Iman: Why it returns empy list with in_msg_hash?  But the tx is succesfull in testnet and shown in toncenter explorer 🤔 (reply to 29276)

Andrey: For tick tock transactions there will be null in msg, so empty in_msg_hash (reply to 29277)

Step: what is tiktok transaction in ton? (reply to 29278)

Andrey: https://docs.ton.org/develop/data-formats/transaction-layout#tick-tock (reply to 29279)

Ignat: guys, when I try to iterate my dictionary, i keep getting an error 9. Am I doing the iteration right?

— 2023-06-09 —

Seitaro: something wrong with condition users_event == event: if it is not true, while cycle will try to load from value again and again and eventually will throw Cell underflow. Probably you need to add flag = users_event == event somewhere (reply to 29283)

elix1er: w8 is this solidity ? no ? (reply to 29283)

elix1er: hello all just joined

&rey: This language is called FunC. (reply to 29288)

elix1er: running in what kind of VM ?

elix1er: FunC o_O

Daniil: TVM — ton virtual machine (reply to 29291)

Daniil: https://docs.ton.org/develop/func/overview (reply to 29292)

elix1er: is it some kind of wasm bytecode maybe?

Daniil: No. (reply to 29295)

elix1er: kk, so some solidity kind of opcode stuff custom engineered?

elix1er: noice

elix1er: i guess more performant than sol

elix1er: rite

Daniil: It's not like solidity at all. (reply to 29297)

Daniil: Completely different architecture in both language and the blockchain itself.

elix1er: its not LLVM right, any transpiler possibilities?

elix1er: will check compiler source, but thx !

Daniil: This is useful to read if you're coming into TON from EVM chains: https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers

elix1er: coming from cosmwasm

elix1er: evm ages ago

Daniil: Anyway I recommend reading this article (reply to 29305)

Daniil: There are builds of ton binaries into wasm to be used from JS. But the FunC contracts themselves don't compile into wasm (reply to 29309)

elix1er: lit, so theres some online playground chain simulator ?

Daniil: I haven't seen anything like this (reply to 29311)

elix1er: got experience in building such

elix1er: im wasm freak

elix1er: once compiled rustc compiler to wasm >,< to compile wasm contracts inside v8 chrome wasm interpreter running rustc

elix1er: luv such wtf stuff

Daniil: These wasm builds are primarily used by tools like sandbox:  * https://docs.ton.org/develop/smart-contracts/testing/tonstarter#sandbox (reply to 29310)

Daniil: Sandbox is a powerful js framework for testing ton smart contracts

elix1er: yeaaaah i helped to build xact this type of toolin’ for cw

elix1er: cosmwasm contracts

elix1er: simulator

elix1er: in browser

elix1er: ehhe

elix1er: nice 2 see, so ehm… im hard new in t0n so forgive me. TON is not TRON rite?

elix1er: how is telegram related with this // how long this thing is in mainnet o_o

Daniil: Telegram originally started the development of TON, but SEC forced them to stop. After that, open-source devs continued the development. (reply to 29325)

elix1er: legends god bless le devs (reply to 29326)

elix1er: its not a generic geth fork it seems

elix1er: not so often to be seen tho.

Daniil: You can read the history and future roadmap here: https://ton.org/en/roadmap

elix1er: ty, rest i guess i find in the docs n git

Daniil: TON is not a fork of anything (reply to 29328)

Daniil: And several whitepapers, if you want to dive deep into tech here (reply to 29331)

elix1er: A+, okay, last Qs: block finalty times ~ /sec ?  and consensus is .. bft or .. dPoS? (reply to 29332)

Daniil: Finality is around 6 seconds. (reply to 29334)

Daniil: BFT (reply to 29334)

elix1er: do you need nodes ?

elix1er: securin the network

elix1er: ( i mean more, i could spin some up )

Daniil: Yes, there are validators (reply to 29337)

elix1er: just out of principle as i like this thing

Daniil: Validators will be split into several parts this/next year. So you'll be able to secure the network without staking millions. (reply to 29340)

elix1er: oke so theres staking kk

elix1er: im topkek R&D dev but not trader

elix1er: so would be great

elix1er: cosmos atom is like cartel mafia with their XX million staked vali set

Seitaro: I believe that https://ton-ide-nujan.vercel.app/ aimed in this direction, not sure how it is going though (reply to 29311)

elix1er: would be great to prevent such stuff on ton, just a suggestion ^^^^

&rey: I'd recommend GitHub Codespaces. (reply to 29311)

Seitaro: Still requires TON Connect from the start for some reason (reply to 29347)

elix1er: source on git ? (reply to 29347)

Seitaro: https://github.com/nujan-io/nujan-ide (reply to 29351)

elix1er: if u got wasm compiler, nothing speaks against web playground

elix1er: amazing, when im done fiatmining 😴 ill have some closer look and might PR some stuff in maybe !

elix1er: ive read the word dao somewhere

elix1er: cant wait to read that stuff up ^^

Daniil: Maybe here? ton.vote (reply to 29355)

elix1er: looks like snapshot fork

Daniil: Not a fork, but analogue (reply to 29358)

elix1er: ive worked with // on enterprise.money and daodao.zone in past, so very familiar with that stuff and keen to see what ton got here

elix1er: no shill tho, idgaf bout the projects personally

elix1er: just community random dev guy

Daniil: TON is still in early phase in many aspects like defi or dao. But there are more and more teams and projects coming here (reply to 29360)

elix1er: thats brilliant

elix1er: ok really last Q: the telegram ton smashdown happened, i was super sad. its quite longer ago - how long ago aprooox did this ton by community accellerated revive like it does right now

elix1er: sry not native eng

Daniil: I think you can read about in in the roadmap I sent above. If you scroll down, there are some historical events about it. (reply to 29365)

elix1er: thanks, that helps, and keep grinding fam

Habib: Is ton dying?

Habib: Seems it be on a downward trend

User<6162960822>: How do I download

&rey: TON is not meant to be just coin for short-term investments. Also, this chat is for discussion of development of TON. (reply to 29372)

Habib: Ohh oops sorry for the confusion. The admins of ton community barred me for a week for asking this question... so thought maybe the devs would have a clearly open minded view 9n the topic (reply to 29374)

Henry: Hi, does anyone know why https://minter.ton.org/ is not working with TON Wallet (Chrome extension) any more? There is no option to connect. It used to work for me a couple weeks ago

Andrew: because ton wallet doesn't support tonconnect (reply to 29376)

Henry: It strange that it was working a couple weeks ago and I minted token with the wallet (reply to 29377)

Andrew: minter was migrated to support tonconnect 2.0 standard (reply to 29378)

Henry: that makes sense. thank you.

C_F_O: Hi We r looking for devs who's expertise exceed in Games Industry

C_F_O: any takers?

ъуъ: does gambling count? (reply to 29381)

Sergiu: in what you look for exactly (reply to 29381)

Andrew: what's your GitHub? (reply to 29384)

C_F_O: Yes (reply to 29385)

C_F_O: da

C_F_O: ok (reply to 29392)

C_F_O: bro

C_F_O: Can see you bro 😎 (reply to 29392)

C_F_O: can't

Kirill: hello everyone, I have a ton wallet how do I generate(C#) unique links to this wallet for users and what are they called ? invoice ?

Dmitry | backend4you.ton: you want many links to one wallet and to have "unique id" in transaction parameter/comment? Use ton://transfer/{address}?amount={amount_in_nanoton}&text={invoice_id} template  Or you want many different wallets (one unique per each customer)? You need something more that links, you need to deploy all that wallets. google "tonpay" (reply to 29399)

— 2023-06-10 —

Milad: Hi everyone. Please look at this address: https://tonscan.org/address/EQB1-n4oEQ56Bc_sggJPa0DaGwCgicSmSQrt9f1mfhSFYI0D  I created this address using tonsdk. The version is v4r2. I sent a transaction to this wallet but the amount was sent back to the source.  What is wrong?

Andrew: you haven't deployed the wallet contract (reply to 29404)

Milad: How should i deploy it without the amount in it? It needs to pay a fee for deploying.  And also i didn't have this issue in the testnet

Andrew: send funds to its non-bounceable address first (reply to 29406)

Milad: i got it. Let me try and i'll let you know. Thanks

Milad: 🙏

User<6223603138>: Lonely is very bad it's like cancer, I haven't strength to face that

&rey: Have you tried finding a team for participating in TON contests (https://t.me/hackatonx, https://t.me/toncontests)? (reply to 29410)

Yuri: Hey guys, can't transfer USDT using TON Bridge, clicked the transfer button but the spinner keeps on and metamask doesn't open:

Seitaro: Most probably there are conflicting plugins, anyway ask in https://t.me/ton_help_bot (reply to 29412)

User<6249656205>: hi guys, i wanted to buy some TONs, i was looking for the safest setup, do i need to get my own full node to get 100% privacy on my txs?  and I saw that requirements for full node are very high, will it work on a 16gb ram laptop with a lower connection? (max 500MB/s)

Rami: Hi 👋. How can I sign data using Tonkeeper? I'm trying the demo from ton-connect/demo-dapp that uses the @tonconnect/sdk, but it doesn't seem to have an out-of-the-box method for that.

Daniil: No possibility to sign custom data yet. (reply to 29419)

Rami: What is ton-connect/bridge#JS bridge? Is it something that has not been implemented yet, or is it something that is only available in Node.js?

Dmitry | backend4you.ton: All transactions are open , it’s blockchain. What do you want to achieve? (reply to 29418)

User<6249656205>: in other blockchains(bitcoin, monero) when i send a tx the node i'm connected to stores my ip, so having a full node gives you privacy by not leaking ip to third parties, does the same happen on ton blockchain? (reply to 29422)

Dmitry | backend4you.ton: Look for “lite server” node. It doesn’t store full blockchain data, and has low HW req. (reply to 29423)

User<6249656205>: ok thanks a lot (reply to 29425)

— 2023-06-11 —

Whizzie🐾: Any admin here»> (reply to 29429)

Whizzie🐾: /report (reply to 29429)

Rami: Does TON use Curve25519 to sign data?

User<6253317069>: Ok Thanks

&rey: TVM supports Ed25519, and secp256r1 and BLS12-381 support is in testnet. (reply to 29439)

Rami: But when I'm signing a transaction/data with Tonkeeper or another TON wallet, which one am I using? (reply to 29443)

&rey: Ed25519. (reply to 29444)

TON Answers Bot (not AI): TON node from No Name  Could you help me a bit?  root@hz-ton:~# sudo docker-compose up + Running 1/1  ⠿ Container root-ton-node-1  Recreated                                                                                                                                                                                  0.2s Attaching to root-ton-node-1 root-ton-node-1  | = No global config provided, downloading default. root-ton-node-1  | + Using provided IP: 167.235.65.98:43678 root-ton-node-1  |  3t 12023-06-11 22:39:02.462337246validator-engine.cpp:1304!validator-engine found init block  w=-1 s=9223372036854775808 seq=27747086 YRkrcmZMvLBvjanwKCyL3w4oceGPtFfgx8ym1QKCK/4= N42xzPnJjDlE3hxPXOb+pNzXomgRtpX5AZzMPnIA41s=  root-ton-node-1  |  1t 12023-06-11 22:39:02.462621529validator-engine.cpp:3504!validator-engine failed to parse config: Error : 0 : failed to parse json: Opening '"' expected root-ton-node-1  | = Found existing server certificate, skipping root-ton-node-1  | = Found existing client certificate, skipping root-ton-node-1  | = Liteserver disabled root-ton-node-1  | + Running validator-engine root-ton-node-1  |  3t 12023-06-11 22:39:02.486787564validator-engine.cpp:1304!validator-engine found init block  w=-1 s=9223372036854775808 seq=27747086 YRkrcmZMvLBvjanwKCyL3w4oceGPtFfgx8ym1QKCK/4= N42xzPnJjDlE3hxPXOb+pNzXomgRtpX5AZzMPnIA41s=  root-ton-node-1  |  1t 12023-06-11 22:39:02.487007476validator-engine.cpp:3504!validator-engine failed to parse config: Error : 0 : failed to parse json: Opening '"' expected root-ton-node-1 exited with code 2  So, I'm running init.sh in my docker container, which is creating config.json, but it falling with error above How to fix this?  🔗 Answer on TON Overflow

User<6039057287>: Whats îs FOR to help i dont understand YOU

— 2023-06-12 —

User<6144147603>: Hello 👋

User<6144147603>: Scammer claiming to be help desk from Ton

User<5841048263>: Hi

User<5841048263>: Helo gey

User<6144147603>: Thanks

User<6144147603>: Another scammer

User<6144147603>: Wanted to click a link

User<6144147603>: to get my personal info

brian: Hi guys  I'm writing a dapp using the func language.  I have a question.  What type should I normally use for data written as an array: tuple?  Or a tensor? https://docs.ton.org/ko/develop/func/types#tensor-types

Oleg: Hey! Probably tuple https://docs.ton.org/develop/func/cookbook#how-to-determine-if-lisp-style-list-is-empty (reply to 29467)

brian: Thanks, do you know what the main difference of tuple vs tensor? cause, it seems very similar so I'm confused about what to use. (reply to 29469)

Oleg: A special case of the tensor type is the unit type (). It is usually used to represent the fact that a function doesn't return any value or has no arguments. (reply to 29470)

Oleg: so it’s not an array rather an absence of a value

brian: thanks (reply to 29471)

Chacha: How to get jettons price? Is there an API to request prices?

Andrew: tonapi.io / tonapi.io/v2/rates (reply to 29475)

Chacha: Do you support batch requests?

Chacha: How many tokens does it support? (reply to 29476)

Andrew: not sure, you can ask in their support chat - https://t.me/tonapitech (reply to 29478)

Chacha: I'm trying to get jUSDT price, but it doesn't support.

Andrew: jUSDT price is 1 usd

Chacha: How about WTON?

Chacha: How to convert this address 0:729c13b6df2c07cbf0a06ab63d34af454f3d320ec1bcd8fb5c6d24d0806a17c2 to normal address?

Chacha: I'm really confused about this type of address.

Andrew: 1. what's your programming language 2. read https://docs.ton.org/learn/overviews/addresses (reply to 29483)

Andrew: it equals to 1 ton (reply to 29482)

D: hello everyone, how to get other version of address in tonweb sdk?

D: i mean explorer address is different from the deployed one.

frlyh: hello. I want to parse nft transaction data, how to identify nft operations?

frlyh: How to parse message and data information, the TL-B document looks too confusing, is there an example?..

Клецка: i think that you should look at message. all data which was sent to contract should be represented there (reply to 29494)

Cocomastoras: I am trying to run the standard tests when creating a new nft_collection project via toncil Error interpreting file /var/folders/hq/v3pwxlcd4csb84_960phw2b00000gn/T/tmpra46tzqq.fif: nft-data.fif:7: include:cannot locate file OwnerAddr.fif

Cocomastoras: I used the toncil start nft_collection

Клецка: maybe path to file is invalid (reply to 29498)

Клецка: look at place where file was imported

Клецка: and try to find a file

Cocomastoras: How come ? I haven’t change anything , directory builded via toncli start nft_collection

Клецка: it could be some bug. you can open an issue on their github

Cocomastoras: Great

Клецка: you can call me in Discord. i have nothing to do now and can try to help you (reply to 29498)

deFRAG: TONBanking Bug Bounty Program  PHASE II 💎  We are glad to announce our Smart Contracts Bug Bounty program and invite developers and security experts to participate and assist us.   Scope, rewards, duration:   • Scope: Smart contracts  • Severity levels: Low, Medium, High  • Phase II Prize pool: $10, 000 (TONB equivalent)  • Duration of Phase II: 2 weeks  How to participate:  1. Register in the TONBanking Core chat in Telegram.  2. Get access to Smart Contracts in GitHub.  3. Select the smart contract(s) you wish to test from the list.  4. Review the code.  5. Report bugs via @tonbanking_bot.  6. Receive a reward once the bug is confirmed. 🙌   Key Links for TONBanking Bug Bounty Program:  1. Join devs community TONBanking CORE:  https://t.me/+Ep0m-qJmA5xkNmQy  2. Report a bug: @tonbanking_bot   For the complete TONBanking Bug Bounty Program rules, please visit the following link:  https://telegra.ph/TONBanking-SC-Bounty-Program-05-29 (forwarded from Polina)

deFRAG: Yeah! The First phase is Done , thank you the international TON DEVS! Feel free to join the Smart Contract testing in main net

Клецка: hi! how can i return exit code from recv_internal?

Javad: Blueprint or toncli ? Witch is better ?

— 2023-06-13 —

Behrang: Use the throw function. 0 and 1 means success, other codes mean a failure. (reply to 29511)

D: hi anybody help me with this error  [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 15F2D1F6583B96614EF3026909988C0FF0F87FB880B8CC1A893487CA81151441: exitcode=-14, steps=27, gas_used=0 VM Log (truncated): ...te THROWIF 32 execute PUSHPOW2 9 execute LDSLICEX execute DUP execute LDU 32 execute LDU 32 execute LDU 32 execute NOW execute XCHG s1,s3 execute LEQ execute THROWIF 35 execute PUSH c4 execute CTOS unhandled out-of-gas exception: gas consumed=658, limit=0 ".] {   code: 'ERR_UNHANDLED_REJECTION' } error Command failed with exit code 1.

D: weird, restarted the pc and its working now, don't know how but works. (reply to 29516)

Oleg: 💎 New project!  💾 Tonutils-Storage v0.1.0 has been released!   This is blazing fast TON Storage implementation based on tonutils-go, aimed for performance&usability. It is also has HTTP API, so you can easily integrate it to your projects.  You can run it on any hardware and any OS, it has no dependencies, just a single executable.  🚀 Download (forwarded from Oleg)

Liza: Hey guys! We are excited to announce that we are about to release the first complete video course on TON Blockchain development for which we received a grant on.   So, we have launched the channel TON Insights for future course learners and anyone interested in advancing their skills in blockchain and exploring TON's opportunities.  Join our channel to be the first to know about the publishing of our new TON Blockchain course. The channel will cover fundamental concepts, the history of the technology, developer tools, interesting articles, and the latest news.  https://t.me/ton_insights

Javad: I use dton graphql, What does account_states means ?  what is this means ?  account_states.account_state_state_init_code_method

Andrey: Account states is the current state of all accounts in the network. This method typically used to filter all NFTs, collections or other unique smart contracts over the network.  account_state_state_init_code_method is filter for smart contract specific method, for example you can filter all NFTs (by get_nft_data which is `102351`)   {   account_states(account_state_state_init_code_method: 102351) {     parsed_nft_index   } }   Alternative for known methods you can use account_state_state_init_code_has_*   {   account_states(account_state_state_init_code_has_get_nft_data: 1) {     parsed_nft_index   } } (reply to 29520)

无名: is there a node in rust?

Chacha: Hey, I want to know which address is jettonWalletAddress when transfer jetton?

Andrew: well, it's a jetton wallet address. Are you familiar with jetton standard in TON? If not, please take a look at it here (reply to 29523)

Chacha: Does it mean Jetton's contract address?

Andrew: there are 2 contracts for any jetton - master and wallet

Andrew: it's described in the standard (reply to 29524)

Chacha: Sorry I'm still a little confused about this part after reading this standard😢

Andrew: each user has a separate jetton wallet per jetton. Its address is calculated based on the jetton wallet code, jetton master address and user wallet address (reply to 29528)

Andrew: here's an example in js - https://github.com/TheTonpay/tonpay-js-sdk/blob/main/src/invoice/invoice.ts#L166 (reply to 29528)

Andrew: jetton wallet wrapper - https://github.com/TheTonpay/tonpay-core/blob/main/src/contracts/jettonWallet/wrapper.ts (reply to 29530)

Chacha: So jetton wallet address is equal to this token address?

Andrew: yes. Keep in mind that there's no single "token address". There's always jetton master and one or more jetton wallets (reply to 29533)

nonam3e: We're currently developing lite-client node. https://github.com/tonstack/lite-client (reply to 29522)

Javad: Thank you so much (reply to 29521)

Javad: how the code method generate ? (reply to 29521)

Cocomastoras: So I have this msg for initialization of a marketplace according to https://github.com/romanovichim/TonFunClessons_Eng/blob/main/17lesson/nftsale_eng.md   can someone explain to me why after the store grams , we store length 108 instead of 107 and value of 7 instead of 0?   var msg = begin_cell()         .store_uint(0x18, 6)         .store_uint(4, 3).store_slice(dest_address)         .store_grams(amount)         .store_uint(4+2+1, 1+4+4+64+32+1+1+1)         .store_ref(state_init)         .store_ref(body)         .end_cell();

Cocomastoras: Also is there any difference between store_grams and store_coins ?

Andrew: no (reply to 29544)

Andrey: td::crc16(method_name); const unsigned method_id = (crc & 0xffff) | 0x10000;  But in dton you can also use account_state_state_init_code_method_name filter, like this:  {   account_states(account_state_state_init_code_method_name: "get_nft_data") {     parsed_nft_index   } } (reply to 29541)

Javad: how dton know the method name ? most of contract are not open source, how dton detect method name and method id ? (reply to 29546)

Андрей: No, ton storage is designed to store data, not process it (reply to 29547)

Diako: Due to the fact that TON is still at the beginning of it's path, there is a lack of tools and information, which make many projects and even those who tend to join TON, to be unable to progress quickly.  For this purpose, We created this website to be a help to 5 categories of users.  1- Programmers: By adding the projects contract addresses, it helps programmers to read and learn the source code of those projects, and we will also post educational articles related to programmers.  2- Investors: It helps investors to make better decisions, since they can have a better view by checking the statistics of projects and viewing the market and projects.   3- Marketers: It helps them by giving them easier access to projects, find them easily and make contacts with them. Also a section will be added that can identify important and active people in TON  more easily.   4- TON Newbies: It will also be a great help to ordinary users to enter the world of TON ( multilingual) trainings. And Newbies have the chance to get familiar new projects.   5- Project Owners: By getting listed, writing articles and news about the projects, and presenting analytical statistics, we introduce them to the community, which can make the projects spotted and known.   Website name is Tonradar  and with this address:   https://tonradar.app   Feel free to write a comment

Jeff: In the contract storage schema, cell refs must be at the end of the data storage?  Is there any related documents?

Tony 10am-7pm: Has anyone noticed that in tonkeeper v3.2 the update today, all previous nft and ton are not showing in testnet anymore. But on tonscan it's still there

Tony 10am-7pm: Weird

Клецка: maybe it is new address. try to change address in Tonkeeper options (reply to 29552)

Andrew: no, there's a bug in the new update where it fetches data for mainnet even in testnet mode (reply to 29554)

Клецка: lmao (reply to 29555)

Клецка: How can i divide int to int and get float value ( 1/2 = 0.5f ) ?

Клецка: and how to store it?

Tim: you can't

Клецка: ok. thank you(

Eugene: You can't, so it might be a good idea to use some multiplication constant for storing such things  Like instead of 0.5 ton we use 500000000 nanotons (which is basically the same, but you don't have to deal with floats) (reply to 29557)

Daniil: Another approach is to store such numbers as fractions (base and factor). Like royalty params in nft. (reply to 29561)

Клецка: how can i load slice from cell parser?

Javad: How filter with more than 1 method name ? for example i want to get a contract which have these method "a" and "b" and "c" (reply to 29546)

Amin: 💎 Hello, Skyring Community!  We're overjoyed to announce a considerable leap towards our next major milestone - the launch of the release candidate for Rift's stable version! 🎉  In this vital release, we're introducing a host of robust enhancements:  ✅ A vigilant Sentry Module providing a safety net against hazardous operations ✅ Complete Dictionary Implementation for Fift, enriching your programming flexibility ✅ Improved Type Management for optimal precision and minimized error risks ✅ Expanded Test Sets covering an extensive array of scenarios to affirm Rift's stability  The excitement doesn't end here! Our vision for the future sees a Rift that's community-driven. We're laying down the tracks for your active participation and valuable contributions to shape Rift's evolution:  🚀 Propose dynamic enhancements via Rift Advancement Proposals (RAPs) 🚀 Plunge into the depths of our Comprehensive Documentation 🚀 Learn through our Extensive Example Sets 🚀 Test your projects in our safe and reliable Sandbox Integration  In our pursuit to maximize community engagement, we're thrilled to introduce that we will be defining TON Footsteps for Rift's development - to encourage, recognize, and reward your contributions. Stay tuned for the upcoming announcements!  Join us on this exhilarating journey and contribute to shaping the future of Rift, milestone by milestone! 🔥  For more details about the release, visit Rift's Github 🏴 (forwarded from Skyring)

Samyar: Im using tonconnect-react-ui in my nextjs project  when i click at the button nothing changes in ui   i can not connect my wallet to it

Samyar: also no erros  it just sends two get requests (reply to 29566)

— 2023-06-14 —

pdzeng: hello guys, I have a question   How to deploy a contract on TON Blockchain with init balance = 0  , and how to validate tx.

User<6232442049>: P

Asher: English version of the Ton Dev Study channel now moved to - https://www.youtube.com/@TONDevStudy

Andrey: This is not supported yet, but you can iterate over result and filter with your backend (reply to 29564)

Javad: with account_state_state_init_code_methods param i can get list of methods and then i can iterate it, right ? (reply to 29579)

Javad: how you extract the method ids ? how can i find method ids of a contract without dton ? (I would like to know out of curiosity) (reply to 29579)

Asher: We are looking for a Golang developer to join our team. If interested - PM please

Andrew: open contract's source code and get the method ids. They're pretty easy to spot (reply to 29581)

Cocomastoras: Can you store a string in a tuple or slice ?

Cocomastoras: Also could someone explain me :             .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1) On msg body why we store 7 and length 108 on both the nft and ft messages after the store coins b

Cocomastoras: ?

Cocomastoras: Instead of 0 and length 107

Asher: we're making educational videos - https://www.youtube.com/@TONDevStudy (reply to 29585)

Cocomastoras: Is it the standard when handling extra currencies ? (reply to 29586)

Cocomastoras: On Jettons a new jetton-wallet is deployed automatically when a new address receives a token or the jetton-wallet needs to be deployed first ?

Daniil: It happens automatically (reply to 29592)

Cocomastoras: This happens where exactly on the Jetton-wallet.fc?

Cocomastoras: Are there any server side checks that need to happen ?

Daniil: What do you want to do? (reply to 29595)

Cocomastoras: Take the logic from jetton-wallet and store user based info in a dedicated contract that my core contract uses

Daniil: 7 is 111 in binary. Check the block.tlb scheme (Message type). It means that there will be stateinit in a reference and body in a reference.  0 means that there won't be any stateinit and the body will be right the same cell (not a reference). (reply to 29586)

Daniil: Extra currencies aren't used currently. NFTs and jettons are just regular smart contracts. (reply to 29591)

Daniil: This happens in the message sent to the destination jetton-wallet. Attached stateinit initiates its deployment. (reply to 29594)

Cocomastoras: So in order to stateinit I need to pass 7 in msg body correct ? (reply to 29600)

Cocomastoras: Legend

Daniil: https://docs.ton.org/develop/smart-contracts/messages#message-layout

辛巴TRX兑换（机器人专家）: Hi,all,i have a question to ask.i want to set up a BOT that can buy a Telegram Premium subscription for those who send his ID to this BOT,is there any API i can connect ,please help me

Cocomastoras: @Gusarich  on the jetton-minter example , how do you parse the jetton-wallet code as a cell?

Cocomastoras: On toncli

User: You can make it using userbot as i know, but about fragment i am not sure, how to automate it, without selenium (reply to 29605)

辛巴TRX兑换（机器人专家）: userbot? (reply to 29608)

Freed: For example Python Pyrogram module can create a client for user session for automation (reply to 29609)

辛巴TRX兑换（机器人专家）: is it possible use JAVA which is i focus on (reply to 29610)

User: https://github.com/tdlight-team/tdlight-java  Here what i found (reply to 29611)

辛巴TRX兑换（机器人专家）: thanks for ur help, I appreciate it (reply to 29613)

辛巴TRX兑换（机器人专家）: I will take a look

— 2023-06-15 —

Howard: how did you solve this ExitCode5 in ComputePhase? (reply to 19742)

Tumin | Wagmi11: Is anyone facing difficulties with blueprint? I am trying to deploy a new contract on test net, but it deploys on the same address or the transactions bounces back

brian: Can I use 'TLEN' asm for the length of tuple? like int tuple_length( tuple t ) asm "TLEN";

SHAMSHOD: I had no such problems (reply to 29617)

Tumin | Wagmi11: thank you I will try to deploy again (reply to 29620)

SHAMSHOD: https://ton-community.github.io/tutorials/02-contract/ (reply to 29621)

Tumin | Wagmi11: here it uses func-js to do the whole deployment, I wanted to use blueprint to achieve the same, although I was able to deploy the boiler plate counter contract  But I am not able to deploy the contract which I wrote

doni: does anyone klnow how I can cast   /var/ton-work/keys/liteserver.pub  to a proper base64 ?

Андрей: mytonctrl> installer> plsc (reply to 29625)

doni: cool

doni: chatgpt told me just to   base64 file

Daniil: Do you have any experience in TON development? (reply to 29629)

Cocomastoras: So my bytecode is this :   x{FF00F4A413F4BCF2C80B}  x{2_}   x{4}    x{D06C2220C700915BE001D0D3033071B09130E0D31F30C00130}    x{A13653B679_}     x{ED44D0FA40FA40D31FD307D4D430}   x{F230}  In order to use it on toncli should I just create a cell and store a slice of its x{}?

Step: I don't remember but Exitcode 5 means - Integer out of expected range. Check integer value that is sent to contract. (reply to 29616)

Cocomastoras: Is it possible to test 2 contracts under 1 test using toncli ?

Cocomastoras: How the project yaml would look like

Cocomastoras: How can I parse an address e.g EQAM6pbZ70aKU7sC2Y9u-6aTfY9LUBNYJltUc7tlMHj7sJuB as a slice ?

Cocomastoras: In typescript

elix1er: do i read typescript

elix1er: mmmm

elix1er: same here (reply to 29629)

elix1er: bullish AF on TON aping into the docs atm

elix1er: sick of cosmos

elix1er: does ton need community contrib devs

elix1er: if yes are there resources

elix1er: thx

User<2060215631>: Investor 29,

elix1er: TON play unity SDK ? kidding me ?

elix1er: jeez

elix1er: just read

Cocomastoras: const addr = beginCell().storeStringTail('EQAM6pbZ70aKU7sC2Y9u-6aTfY9LUBNYJltUc7tlMHj7sJuB').asSlice();  Is this correct? (reply to 29636)

Andrew: https://github.com/ton-society/ton-footsteps/issues (reply to 29643)

Cocomastoras: On typescript ton-core how do I parse an integer into a tuple item to hit a get method ?

Daniil: { type: 'int', value: 12345n } (reply to 29652)

Cocomastoras: Legend

Max: 12345n (reply to 29653)

Daniil: yes, because it requires bigint type.

Cocomastoras: That raises error Type 'bigint' is not assignable to type 'TupleItem'. (reply to 29655)

Daniil: { type: 'int', value: 12345n } (reply to 29657)

Daniil: not just 12345n

Cocomastoras: Yy

Daniil: this whole object is a TupleItem (reply to 29658)

Cocomastoras: Any docs ? (reply to 29661)

Daniil: What kind of docs?   Usually you can just check what types does some function require from you right in the IDE. (reply to 29662)

Cocomastoras: On tupleItems constructions  Eg how to parse a slice (reply to 29663)

Cocomastoras: Never mind found it

Cocomastoras: @Gusarich is this valid ? (reply to 29650)

Daniil: No, it's not.  const addr = beginCell().storeAddress(Address.parse('EQAM6pbZ70aKU7sC2Y9u-6aTfY9LUBNYJltUc7tlMHj7sJuB')).asSlice(); (reply to 29666)

Cocomastoras: I need to pass an address a slice  I load the address in my contract through the load_msg_addr

Abdi: How today

Tumin | Wagmi11: I suppose you can use fift for testing it  https://github.com/romanovichim/TonFunClessons_Eng/blob/main/1lesson/firstlesson.md#testing-the-contract  Hope this helps (reply to 29634)

Tumin | Wagmi11: var cs = in_msg_full.begin_parse(); slice sender_address = cs~load_msg_addr();  begin_cell().store_slice(sender_address).end_cell(); (reply to 29668)

Andrew: https://github.com/ton-society/ton-footsteps/issues (reply to 29673)

Andrew: you can help here :) (reply to 29674)

Tumin | Wagmi11: which developer? (reply to 29675)

Tumin | Wagmi11: no I meant I can see there are 34 contributors in the repo are you the developer who is helping?

Ignat: I guess he is just looking for a job, and for some reason in this chat (reply to 29680)

Tumin | Wagmi11: ah ok thanks for clarification (reply to 29681)

User<5857898639>: hello, everyone

User<5857898639>: anyone to need a dev???  please let me know if you need~~~

User<5857898639>: 😉

Cocomastoras: Any resources for typescript Ton testing , I am running in A lot of Error without knowing why

Daniil: github.com/ton-community/sandbox (reply to 29686)

Alex: Also, you can find helpful this video, relates to tests with Sandbox -  https://www.youtube.com/watch?v=5Y0yslEm94Y&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa&index=4 (reply to 29686)

Клецка: Hi, Community! Is it possible to deploy smart contract from another smart contract? If it is possible, then how?

Andrew: yes, it is, it's done the same way as deploying a separate contract (reply to 29689)

Клецка: thanks! (reply to 29690)

Клецка: does anyone has an example of FunC code to do this?

Daniil: You need to send a message (send_raw_message function) to the contract that you're trying to deploy and attach the StateInit to this message.  You can find all the required information in documentation (reply to 29692)

— 2023-06-16 —

Grubmont: Hi All, I am following this toncli tutorial where in step 1 it is asking me to download prebuild files. It takes me https://github.com/SpyCheese/ton/actions/runs/4055187490 but I don't know what I should be downloading there. Could you please help?

Nguyễn Gia Huy: hi i'm a beginner, i want to ask how can my wallet get NFT after mining? My wallet shows the status as State: Inactive

Tumin | Wagmi11: https://answers.ton.org/question/1538715235714600960/how-can-i-activate-my-wallet (reply to 29695)

Tumin | Wagmi11: can you specific which machine are you setting it up on? (reply to 29694)

Tumin | Wagmi11: https://github.com/disintar/toncli/blob/master/INSTALLATION.md  I hope this helps (reply to 29694)

Grubmont: I am on Linux (ubuntu).  The thing that confused me was the wording and what I think is the incorrect url. In tutorial, it said: Download needed special pre-builds (from SpyCheese repo) for Linux : here, for Mac : here You need to be logged-in to GitHub to download pre-builds I then navigated by following the link for Linux which took me to the "Actions" page in github and this is where I got stuck since I don't see any files to download there. Is the idea to fork the repo and build it locally? I am missing something basic, probably here. Thanks! (reply to 29697)

Tumin | Wagmi11: https://github.com/SpyCheese/ton/suites/13324545262/artifacts/728105124 (reply to 29699)

Nguyễn Gia Huy: after i put in 2 TON it's still active (reply to 29696)

jessez: you must send TON from this wallet to make it active (reply to 29702)

Nguyễn Gia Huy: oh thank man (reply to 29703)

frlyh: hello.The key obtained from the robot  @tonapi_bot is not the required key for toncenter.com/api/v2, It's for https://tonapi.io/ ,how to get key for toncenter.com/api/v2 ?

Alikhan: Hello! How is the ton web app inside telegram work? I'm currently researching about it but couldn't get any overall idea how all this works from devs perspective. Is it just as any web app or does it have some limits, like page size, etc. Can I for example implement youtube there (theoretically)

Alex: You can ask here and seek information in the TWA community documentation. (reply to 29711)

ninja: Yes, you can link youtube(any url) to the telegram web app  If you already own a website you can easily link that. What TWA offers on top of it is the telegram bot apis, you can use pgs, send messages to the users in telegram, access device states, it's all written in documentation (reply to 29711)

Himanshu: Hello there,   I'm facing problems in setting up TWA for my bot, i request experienced devs to please take a look at it  https://stackoverflow.com/questions/76486463/is-there-any-way-to-pass-parameter-to-the-telegram-web-app-direct-link

Denis: Hey guys. Is there a way to do gasless calls (i.e. someone else is paying for gas for a caller?)

Denis: Like a meta-tx in ETH?

Javad: Do you know when Questbook will fix ? it's a week they not working  i want to submit project for grant but Questbook does't work !

Nguyễn Gia Huy: When i try to run the npm run build command, i always get this error, i don't know if anyone has a way to fix it

Клецка: have you installed FunC compiler? (reply to 29719)

Nguyễn Gia Huy: yes, i have do it

Клецка: thats strange (reply to 29721)

Клецка: check PATH variable

Nguyễn Gia Huy: https://docs.ton.org/develop/smart-contracts/environment/installation   I follow the instructions of this site

Alex: It's preferable to work with a blueprint and sandbox. https://docs.ton.org/develop/smart-contracts/sdk/javascript (reply to 29719)

Nguyễn Gia Huy: ok let me try (reply to 29725)

Клецка: guys! i've created a discord server for ton smart contract development developers. i think it would be nice to have a voice chat for this purpose. but i don't know is it legal to send an invite link here. if admins won't be against, i'll send it

Cocomastoras: What is the best way to get the bytecode of a sc in b64?

Клецка: if contract is deployed - you can see bytecode in any explorer

Cocomastoras: Nvm

Клецка: how to load string into slice in Sandbox?

Cocomastoras: beginCell().storeStringTail('….').asSlice();  I guess?

Клецка: thanks! (reply to 29732)

Nguyễn Gia Huy: I have deployed successfully, thank you. Can you guide me to change deploy wallet address. No, I couldn't find any documentation on how to do that (reply to 29725)

Клецка: btw. you can use nujan-ide-dev.vercel.app it is an IDE which can do all deployment for you (reply to 29734)

Клецка: can somebody explain me this error? idk what i'm doing wrong error: cannot assign an expression of type Forall (A) () -> A to a variable or pattern of type slice: cannot unify type slice with () -> ??41           slice replacement_grade_address = null;

Nguyễn Gia Huy: this is great, but is there a way to manipulate the other deploy file. I think if you use the app, it will be quite confusing when testing or deploying many contracts (reply to 29735)

Клецка: earlier it was available, but this functional was removed by some reason. i will report your issue to the team (reply to 29737)

Клецка: or you can open an issue on their github (reply to 29737)

Клецка: just a minute

Клецка: https://github.com/nujan-io/nujan-ide/

Nguyễn Gia Huy: Is there a way to edit the code so that it deploys to my wallet? (reply to 29734)

Клецка: you can select deployment type in "Build & deploy" section (reply to 29742)

Nguyễn Gia Huy: oke let my try it (reply to 29743)

Клецка: i think that a conversation will be more productive under a github issue. just open one and developers will answer you soon (reply to 29737)

Alex: You can not change address of the deployed wallet.  - Learn more about wallets from this guide https://docs.ton.org/develop/smart-contracts/tutorials/wallet - You can learn details with these videos: https://www.youtube.com/playlist?list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa (reply to 29734)

Nguyễn Gia Huy: thank you (reply to 29746)

Клецка: is it legal to store int in 8 bits?

Клецка: i mean: .store_uint( value, 8 )

Tonnel Network: You can check out Tonnel Network, it’s fully open-source. With the latest TVM update on testnet we were able to verify the proofs with less than 0.2 TON in Func. (reply to 28575)

Gulolio: I will check it for sure (reply to 29750)

NMI: Yeah, maybe something else is needed? 🌚 (reply to 29752)

Tim: Supply of coins needed)) (reply to 29753)

NMI: Hehe (reply to 29755)

Poc: 📢 We invite all builders to Hack-a-TON x DWF!  If you want to join but don't have a team or idea yet, don't worry.  Contact me and let's collaborate and build something amazing with the @evaaprotocol team, one of the finalists of the latest @hackatonx.   Also don't forget to enter our #BugBounty, #Testnet and #TwitterWaveContests to participate in airdrop 🌊 more info on our channel @evaaprotocol

Cocomastoras: I am trying to deploy a contract through a contract but for some reason it’s not deployed , I am following the standard of nft collection/ item with some changes , can I provide some code to someone and let me know ?

Cocomastoras: Can I somehow track the inner messages from my contract ?

elix1er: ooooooooh boys here we gooo (reply to 29710)

elix1er: what is eva, sir ? checking in - lending nice (reply to 29757)

Eugene: @tonapibot (without the underscore). Yes, it's confusing 🙂 (reply to 29710)

Rasoul: Hello friends, how can I see the latest transactions that are being registered on the network?

Dario: https://explorer.toncoin.org/last (reply to 29763)

Henry: Hi, I received this transaction. the amount is smaller than fee. So in that case, I lost TON when receive this transaction. how to prevent that? https://testnet.ton.cx/tx/12274928000007:F3eZhmppdQucpw63vQ4fhOF28IiL1gempSmBTPdW58w=:EQAVVmOPeEo6QE_mp_1Zbnns0MITjrspNrWo0s_T53smbIQf

Arsen: Hi everyone. Does anybody know which field indicates if transactions  is successfull or failed in Toncenter API of getTransactions call.

Javad: Do you have any news ? (reply to 29717)

Nguyễn Gia Huy: hey, i downloaded all the files according to the instructions but don't know the commands to put it in the FIFTPATH, i always get the error like this 'FATAL ERROR: 'func' with version >= 0.2.0 executable is not found, is it installed and in path?' can someone guide me

— 2023-06-17 —

Grubmont: Hello, I am going through the tutorial on how to send some ton  - https://ton-community.github.io/tutorials/01-wallet/. However they don't mention how to actually deploy the wallet. In the step before, they forced deployment by sending some ton using the wallet but the wallet i used (Ton Wallet extension in browser) didn't have an option to change the network to test network. So I couldn't perform this step.  So my question is how do I deploy a wallet in code?

Howard: Is there any document that explains why we need to let the 'Wallet Contract' send a transaction to activate itself?  I encountered an issue where I needed to send a higher amount of TONcoin to the wallet to activate it.   If I was in a situation where I was using a brand new wallet to receive NFTs, it would fail. (reply to 29703)

Behrang: Yes you can, however, the value must fit in 8 bits or an error is thrown. (reply to 29748)

Grubmont: I found this Javascript SDK where I could deploy a wallet using something like this: await wallet.deploy(secretKey).send(). What is the difference between the npm Ton library which the tutorial uses and the JS SDK? Which one should we be using? (reply to 29770)

Alikhan: Open terminal, type ‘echo $PATH’, press enter and see if the ouput contains the needed directory (reply to 29768)

Alex: You could use both of them. Tonweb created by TF developers, ton-js created by TON community.  Detailed review of the deployment could be found in the next lesson-2 or in this guide https://docs.ton.org/develop/smart-contracts/tutorials/wallet (reply to 29773)

Tse: Is tonscan live rn? Can't find latest tx on it while those tx can be found via APIs and other explorers

NekoSenpai: hello. does anyone know if to use Ton Payments in a web application I need to deploy a smart contract or can it be used without it?

Eugene: Tutorial you refer to uses both of those libraries: there is a switch in the upper right corner of the page that lets you choose a library and provides code for the chosen one (reply to 29773)

Andrew: do you want to use offchain payment channels? (reply to 29777)

NekoSenpai: no. it would be for payments for a web video game. the idea would be to reduce recurring costs. (reply to 29779)

NekoSenpai: although now that I think about it, that would be equivalent to offchain.😆

Andrew: yes, most likely you want to use payment channels

Andrew: you need to deploy a smart-contract for your user and you (the game) then

Andrew: or you can create custodial wallets for users and deposit funds to them to make "instant" payments

NekoSenpai: The second one seems to be an easier idea to execute. The first one, this smart contract would be valid for all users? I suppose it is necessary to deploy it to configure it to my wallet? (reply to 29784)

Andrew: for payment channel to be opened you need to deploy a smart-contract that both parties will deposit, and then exchange offchain transfers. This contrac tis only valid for 2 parties, and for the different pair of them you need to deploy a new one

Andrew: there's a detailed description in ton github and in docs

Andrew: can you tell me more about your case in dm, please?

NekoSenpai: I understand you now. it is a contract for each connection between different partners, the documentation mentions that a smart contract needs to be deployed but makes no reference or assumes a lot of things and lacks details on that part. (reply to 29786)

Tumin | Wagmi11: If you plan to use fift, also download fiftlib.zip, open the zip in some directory on your machine (like /usr/local/lib/fiftlib) and set the environment variable FIFTPATH to point to this directory.  export FIFTPATH="/usr/local/lib/fiftlib" echo $FIFTPATH (reply to 29768)

Tumin | Wagmi11: WOWOOWOWOOWOOWWOWOOWO (reply to 29735)

Tumin | Wagmi11: yes (reply to 29776)

Oleg: Basically, you have to send an external message to the contract in order to activate it. In my experience it has to have at least 0.02 TON in order to successfully activate. All the wallet apps just send this external message when you have money on your wallet (reply to 29771)

Tumin | Wagmi11: https://docs.ton.org/develop/dapps/defi/ton-payments (reply to 29777)

Kimmo: I noticed the same and for some reason my own TON node also went out of sync (reply to 29776)

Tse: yup it's a bit wired everywhere. I found out those missing tx can be found via hash on tonscan but can't be found via address. And openmask's RPC cannot send tx properly sometimes. and fragment is listing sold numbers in the for sale section (reply to 29796)

Rasoul: Hello guys, I have a question How to get the last network transaction?

Daniil: You can get the last transaction for each of the shardchains separately. (reply to 29799)

Diako: How can i post an article in blog.ton.org ?

Howard: Looking for talent people to answer this question about Payment Channel in FunC tho: https://answers.ton.org/question/1554838717422637056/why-the-recv-internal-recv-external-are-the-same-here-in-payment-channels-example-here

Клецка: cannot call a method through recv_internal in my smart contract. i'm using a Blueprint for testing.  calling method by sending an internal message with this code: async sendRemove( provider: ContractProvider, via: Sender, value: bigint )     {         await provider.internal(via, {             value,             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: beginCell()                 .storeUint( 0x1234, 32 )                 .storeUint( 0, 64 )             .endCell(),         });     }  but contract does not seems to do something with it. Here is a sources on github: https://github.com/Hid-K/TONStudy-grade/tree/dev

Samyar: hey guys  have you encountered this problem ? idk know why but i cant deploy my jetton

Клецка: how can i get smart contract's code from itself for further deploy?

Howard: where is your code tho? Can't find (reply to 29804)

Howard: I think you use the wrong way in my first thought.   sendMode: SendMode.PAY_GAS_SEPARATELY is used in FunC level, not in TS file level.

Клецка: i've already fixed this. sorry for interrupting (reply to 29807)

Gulolio: Guys is there any link of the smart contracts for https://dedust.io/swap? Is it open sourced?

Howard: I think they don't. (reply to 29810)

Howard: For Dexs I think you can checked ston.fi (reply to 29810)

Gulolio: I'll take a look at it (reply to 29812)

Andrew: it'll be opensource soon-ish (reply to 29810)

Gulolio: Would be cool

Behrang: Current TVM doesn't have this feature, and you have to store smart contract's code as a cell inside data part. The upcoming new TVM has this feature under instruction MYCODE. (reply to 29806)

Клецка: cool! when does this version will be available? (reply to 29816)

Tonnel Network: Just a feedback from our experience in ZK development on TON.

Tonnel Network: Technical Note🧑‍💻  ❓Why is the deposit transaction being sent in two parts and the why is circuit +1GB?  ℹ️ This was something that could be easily avoided if the TON core team added a ZK efficient hashing in TVM. But unfortunately(not sure why) they didn’t do that, and the closest one to efficient is SHA256, which We use in the merkle proof contract and circuit.   For example, if TVM had MiMcSponge hash implemented( we already implemented it on Func, but it’s too expensive to be used), the deposit would be done way cheaper( at least 10X) and also the withdraw calculation on client and the circuit size would have been 10X optimized.  PS: An efficient hash is needed for almost any ZK implementation and obviously Sha256 is not the most efficient one. So if anyone has any access to the TVM core team please forward this to them. (forwarded from Tonnel Network)

User<2060215631>: Ton keeper account trading,,please,,

User<2060215631>: transaction

SHAMSHOD: Is it possible to create a constantly updating table in TVM?

Клецка: also, how can i get an address of deployed contract through send_raw_message? (reply to 29816)

Daniil: Calculate it as a hash of stateinit. (reply to 29824)

Клецка: thanks! (reply to 29825)

Behrang: On the roadmap, it's scheduled for Q2. So I think it might be released in 2 weeks. (reply to 29817)

— 2023-06-18 —

Gulolio: Guys what happens if someone acquire an anonymous number, and then this person misbehave in Telegram. His account is blocked, I mean the account associated with this number. But then he sell this number in Fragment, will this number be useful for the other part that bought it? Because I think it should lose value, if you are not able to use it again. The problem is that when you buy a number, you don't know if this number is blocked or not in Telegram.

Howard: You can re-set the account if you can't log-in this Annoy based TG account. (reply to 29828)

Gulolio: If that's the case, then any anonymous number can be re used again right? I wasn't aware of that 👍

Howard: anyone know what is SDK for TonKeeper Wallet Signing?

Клецка: this? https://github.com/tonkeeper/wallet-api (reply to 29831)

Клецка: what is a maximum length of string stored in slice?

Mzp_: I have no idea

Andrew: cells can contain 127 chars, but you can build snake strings (reply to 29833)

Howard: yeh,  but I remember TonKeeper enable to pop-up the window to ask people sign the message. (to proof the wallet owner want to log-in etc (reply to 29832)

Клецка: i had not an experience developing this kind of apps, sorry (reply to 29836)

Yuri: Hey guys, are these price data correct? https://toncap.net/

Клецка: does FunC supports some kind of arrays? i need to store collection of cells in smart contract's storage

Alex: FunC supports Tuples - https://docs.ton.org/develop/func/types#tuples-types You must pack your data into a cell (a tree of cells) in order to store it in storage. You will not be able to write a Tuple in the Contract Storage. (reply to 29840)

Клецка: thanks (reply to 29841)

— 2023-06-19 —

frlyh: I have a question about the nft deal. The content of a transaction hash can contain multiple NTFT interactions and multiple interactions containing one nft?

frlyh: And 2. The interaction behavior of NFT, I through the body, in analytic in_message matching op_code [https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab 212c53143f71f5476/ft/op-codes.fc], used to judge the behavior of nft

Nguyễn Gia Huy: this is my code: https://github.com/Huy-8bit/tokenWithTON

Nguyễn Gia Huy: Hello everyone, I have some code files related to minting Token with TON using bluePrint. I don't understand what parameter I need to pass into createFromConfig{} on this line: const minter = provider.open(Minter.createFromConfig({}, await compile('Minter')));

Andrew: it's right in the error message (reply to 29857)

Клецка: you meed to pass config, described as json (reply to 29857)

Asher: https://www.youtube.com/playlist?list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa (reply to 29857)

Chacha: Why did I get a different wallet address when using the same mnemonic?

Chacha: I'm using the mainnet.

Andrew: address depends on the wallet code version

Nguyễn Gia Huy: I already see my mistake, thank you bro

TonRadar: 🔗 Exploring Nominators and Validators difference ⚡️  Read more on our blog.📖  Website : https://tonradar.app Blog : https://tonradar.app/blog Twitter  : https://twitter.com/tonradarapp (forwarded from TonRadar)

Cocomastoras: So I want to create a dynamic cell but the code doesn’t seem to work , am I missing something ? builder initial = begin_cell(); repeat (num_of_outcomes + 1) {     initial.store_uint(0, 64); } cell initial_positions = initial.end_cell(); return initial_positions;

Cocomastoras: The final cell is an empty cell

Dario: initial = initial.store... (reply to 29867)

Dario: Or initial~store_...

Cocomastoras: Legend

brian: I want to parse data with 'builder' type.  can I use cs.loadRef?

Saha: Hello! tell me how many maximum possible supply tokens the project can have, or is the limit only 100M?

Daniil: Which project? (reply to 29873)

Saha: in general, it is interesting, I want to create tokenomics, so I need to know as much as possible, I heard that the maximum is 100M (reply to 29874)

Daniil: You can set any max supply (reply to 29875)

User<5847386827>: Where are the English videos of this channel?

Asher: https://www.youtube.com/@TONDevStudy (reply to 29877)

Eugene: Kinda confusing when there are two channels with identical titles and avatars (but different content), maybe add "EN"/"RU" to the titles or something like that? (reply to 29878)

Asher: in process ))) (reply to 29879)

Клецка: how can i get storage data of contract from another contract?

Oleg: No way (reply to 29881)

Клецка: okay....

Клецка: thanks

Sksaidul: Welcome

Cocomastoras: Any good documentation of the jetton wallet code ?

Dmitry | backend4you.ton: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md ? (reply to 29886)

User<1519288770>: When is the new drag and drog code writer coming to the open network

User<1519288770>: Drop*

Hamidreza: Any idea what can cause such error? is there a limit on the number of global variables? Error: main.fif:105:    GETGLOB:Out of range

Habib: Ok ton community chat keeps banning me for asking questions related to TON. Can an admin here give me an explanation? Isnt it where these topics are discussed?

— 2023-06-20 —

Vahid: Drawing conclusions from TON Hack Challenge - DEV Community https://gealber.com/bank-smart-contract-ton-part-ii

Pablo: Hi devs! some project or tutorial to study blueprint + TACT + jetton{jettonFather, jettonChild} ?? Thanks!

Asher: @expectfun   @howard_peng  )) (reply to 29905)

Cocomastoras: I have a contract that deploys another contract and after the deployment it called the contract but it is not initiated , how do I resolve this.?

Cocomastoras: Should I do something like init in nfts ?

Cocomastoras: I keep getting exit code 9

brian: I have question of func language. How can I swap value in tuple with index? in pseudo code,  swap(tuple t, int i, int j) {        var temp  = t[i];        t[i] = t[j];        t[j] = temp; }  Should I always push and pop all the values in tuple?

Cocomastoras: When reading the state of the contract externally then it’s initiated but when I interact with the contract then I can’t load_data() (reply to 29909)

אלזא אים י: I know this we should be all doing this together ❤️❤️❤️

Cocomastoras: And exit code 9 (reply to 29911)

Tim: 9 - cell underflow Youe're reading more than you have in data cell (reply to 29911)

Cocomastoras: Any idea how to read a contracts balance ?

Cocomastoras: Externally

Pablo: get fun balance(): String {         return myBalance().toCoinsString();     }

Cocomastoras: Any Sdk ? The code that you provided doesn’t make any sense (reply to 29927)

Pablo: oh sorry I use TACT

Pablo: https://tact-by-example.org/03-send-coins

liminal: https://www.youtube.com/watch?v=3XIpKZ6wNcg

Gulolio: Guys is there any extension to highlight .tlb files in vscode? It's kind of hard to read it in this way. If anyone knows one let me know

Alexander: You can use this plugin in Jetbrains IDE https://plugins.jetbrains.com/plugin/18541-ton-development (reply to 29932)

Gulolio: I was looking at this one, unfortunately I only use vscode (reply to 29933)

Alexander: Hmm. You can install any plugin for TL (there are many for vscode), since tl-b is similar to tl in syntax it helped me a little. But I haven't seen full-fledged and fresh VSCode plugin for TL-B (reply to 29934)

Gulolio: Let me see if that works for me, thanks 👍 (reply to 29935)

Shashank: Hey, We want to announce to all the builders on TON that our browser-based Nujan IDE https://ide.nujan.io/ is ready(beta) to write a smart contract. Write your smart contract with us or bring existing code to our platform. Our motto is the ease the process of writing smart contracts on TON. We are working on a lot of features to make the process of writing smart contracts easy and fun.  With the current IDE, you will be able to do: 1. Write a func contract from a template or can import your existing local contract. 2. Build and Deploy to multiple environments - sandbox, testnet, mainnet. 3. To ease the process of interacting with the contract we have implemented a Getter and Setter in the UI itself. You don't have to write a time-consuming script for that. 4. We have created an onboarding wizard to help you get started with the platform.   Future Roadmap: 1. Unit testing 2. Log window in IDE of all activity. 3. Syntax Highlighter, Code auto-completion. 4. To make it easier we are going to create a cell builder in which users just need to select the type and enter data in the text box. We will take care of the rest to build a cell behind the scene.  Follow us on:   Nujan Linkedln- https://www.linkedin.com/company/nujan-io Nujan twitter- https://twitter.com/nujan_io Shashank- https://www.linkedin.com/in/shasha1709/ Rahul- https://www.linkedin.com/in/rahul2773/   We are open to feedback. Kindly dm us.  Regards Team Nujan

— 2023-06-21 —

Santosh | Wagmi11: @Shashank_chauhan1709 LIT 🔥 💎

Shashank: Have you tried this? (reply to 29938)

Santosh | Wagmi11: playing around.

NekoSenpai: very necessary XD. (reply to 29932)

Gulolio: High guys reading the whitepaper and the doc I found this description of the c5 register:  c5 — Contains the output actions. It is also a Cell initialized by a reference to an empty cell, but its final value is considered one of the smart contract outputs. For instance, the SENDMSG primitive, specific for the TON Blockchain, simply inserts the message into a list stored in the output actions.  My question is about, what are output actions? Also reading Result of TVM Execution from the official doc, they point out that there's a limitation on the number of output actions in one transaction which is 255. How can that be reached? I mean that limit in one transaction. That's why I'm trying to understand what are output actions?

Dario: if you build an highload wallet or a contract and from a single transaction you try to send more than 254 transactions, the execution will results in an error. these actions are: sendrawmsgs, rawreserve, setpublib, setcode etc (reply to 29942)

Andrew: *more than 255 (reply to 29943)

Dario: if i remember correctly, the limit is 254, but i might be wrong (reply to 29944)

Dario: nvm, its 255

Andrew: I'm sure, the limit is 255 :) (reply to 29945)

Gulolio: Thanks 👍 (reply to 29943)

Andrew: an interesting contract that uses c5 in an unusual way) https://github.com/pyAndr3w/ton-preprocessed-wallet-v2 (reply to 29942)

Jeff: Hello, How many coins can a cell hold? and how can I pack an arbitrary number of N coins into a cell?

Rami: What's a good way to store a string in a contract?  I want to store it in 32 bytes, in UTF-8, which equals the same amount of characters.  However, in JavaScript, it's a bit of a hassle due to the maximum of 53 bits for a number.  Is there a more straightforward way to do this?  Or perhaps there's already an out-of-the-box utility in the "ton-core" package?

Daniil: You can use Buffer which is basically an array of bytes (reply to 29951)

Daniil: There are also functions like .storeStringRefTail in Builder objects that are used to store strings in cells (ton-core)

Tim: Magic. Wonder who could've made it (reply to 29949)

Andrey: In my opinion, a very dangerous wallet, because you can change wallet code 🤭 (reply to 29954)

Daniil: some user-friendly wallet app that uses this contract can simply refuse to send such actions (reply to 29955)

Andrey: Onchain protection was invented for a reason. Otherwise you could just write the results of transactions directly into the blockchain and not make 1000 opcodes (reply to 29956)

Cocomastoras: Any ideas why Block_lt() on a sandbox blockchain starts at time stamp 562949959656336?

Cocomastoras: And any idea if I can change it to the actual time stamp ?

Daniil: Lt is not a unix timestamp. It's logical time. You can read more in docs: https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time (reply to 29958)

Daniil: there's ``now`` parameter which is actually a unix timestamp.

Клецка: what is a difference between lt and timestamp? (reply to 29961)

Daniil: You can read about it in documentation. I just sent a link above. (reply to 29962)

Vladimir: Hi friends, 👋  Many of us here are trying to figure out Tact and want to be able to create our own smart contracts. So, I decided to share with you my free course on developing smart contracts in Tact!  The goal is to make entering into the tone of development friendly.  In this course, I've tried to make it as easy as possible to explain all the intricacies I know. We'll start with the basics, from creating and testing a smart contract.   Lesson Titles:   Video 1: Introduction to TON  Video 2: Installing and setting up the development environment, the first smart contract  Video 3: Syntax and data types in Tact  Video 4: Messages between contracts, Throwing Errors  Video 5: TON coin sending, working with gas  Video 6: Syntax and data types in Tact 2  Video 7: Traits.  Video 8: From ERC20 to Jetton.  Video 9: The nft collection contract  Video 10: The first dapp on TON integrated with Telegram  Two lessons have been done so far. And please don't forget to forward this message to friends who also want to start developing on TON. We'll make our community stronger together!  Link to the first video 👇  https://www.youtube.com/watch?v=Vf3Fx7qgL6k  P.S. Keywords: "Where to Start Learning Tact", "Smart Contracts from Zero", "Practical Lessons in Tact", "Tutorials"

Poc: Hello, we have already won TON hackathons and smart contract contexts multiple times.    We are building next product team to take the prize again.    Interested? DM!

Rami: How can I extract data from a contract using the method_id when the data I passed is a 64-byte buffer?  In the example contract, there are only showcases for int, unfortunately for me 😔 (reply to 29952)

PlanL: What is op::transfer() in jetton wallet smart contract? It gives me an error when I want to send this kind of op.

Alexander: More information is needed to understand what your problem is. What kind of error? What other data are you sending? Also see the standard https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 29967)

PlanL: I want to send a jetton to some address in my smart contract so I shoud send a message to contract's jetton wallet with a transfer operation. Like this: store_uint(op::transfer(), 32) But Blueprint says undefined function 'op::transfer' (reply to 29968)

Daniil: That's because op::transfer() is just not defined in your code. Copy it from op-codes.fc file from token-contract repo (reply to 29969)

PlanL: BTW that picture was useful for me can you send it again. (reply to 29971)

Daniil: https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/ft/op-codes.fc#LL1

Daniil: Which picture? (reply to 29972)

PlanL: It has just deleted. It says after operation what should we put in our msg cell. (reply to 29974)

Alexander: This is a screenshot from TEP74 🙂 https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 29975)

Язон: how much will it cost to store the text in the contract? Perhaps someone knows without longread, like a year for 1000 characters

Dmitry | backend4you.ton: I remember “6 ton per MB per year” thing… (reply to 29977)

Клецка: hi! how can i store Uint8Array in cell?

Язон: thanks! If you are right, then that much of lorem ipsum will cost 0.25 ton per 100 year. approx. (reply to 29978)

— 2023-06-22 —

Tony 10am-7pm: Hello, if i'm understanding the math corrrectly. Values taken from https://docs.ton.org/develop/smart-contracts/fees#cost-of-minting-nfts  cost to mint an NFT  0.08 TON per mint 0.0055 TON  transaction fee  So 1 mint = 0.0855 TON If i want to mint 10,000 nfts i need 855 TON

Tony 10am-7pm: Is there anyway i can cut down on the cost? I looked up batch minting but it seems it's just minting in a loop...

Daniil: You can try attaching less coins to mint NFT (not 0.08) (reply to 29988)

Tony 10am-7pm: Right, i see it's average 0.08 on ton docs. So i can send a smaller amount to mint instead of 0.08 in mainnet and testnet?

Daniil: It's recommended to use something around 0.08 but it's possible with smaller amounts too (reply to 29990)

Howard: Which API can better fetch all the data for an NFT collection, though?  I'm thinking about how we can fetch all the NFT items with certain values for their attributes. (forwarded from Howard)

Daniil: maybe dton.io/graphql will work as you want, but I'm not sure (reply to 29992)

Язон: Why doyou need to mint 10000 NFT? Better make your users method for minting NFTs themselves (reply to 29987)

Tony 10am-7pm: Thinking of minting them all into my wallet then sending it to my customers

Rami: Can you retrieve any other data types data besides int using the get_method function from the contract?

Daniil: You can return any types (reply to 29996)

Rami: How about slice? (reply to 29997)

Rami: Is there any chance that you have a repo with some contract that has different get methods, which I can use as a showcase? (reply to 29998)

Daniil: https://docs.ton.org/develop/smart-contracts/guidelines/get-methods#most-common-get-methods (reply to 29999)

Rami: What's the difference between load and preload? For example, in load_bits and preload_bits.

Dmitry | backend4you.ton: preload does not "move forward"  for example if you stored 3 ints, the read() 3 times will give you all 3 values, but 3 preloads will give you same first value all three times (reply to 30001)

Vatshayan: Hi we need to confirm transcation and check transcation has been done or NOT Is there is any function/method where we can get transcation after sending ton

Vatshayan: Any method / function for getTranscation after successfully sending ton in javscript

Rami: How has that string been converted to an integer? func const op::increase = "op::increase"c; ;; create an opcode from string using the "c" prefix, this results in 0x7e8764ef opcode in this case

Daniil: https://docs.ton.org/develop/func/literals_identifiers#string-literals (reply to 30005)

Rami: Today you're on fire 👍 (reply to 30006)

TonRadar: Find your answers on Fragments, Usernames, TON DNS in our blog on We have covered anything you need to know to participate.   Read the full article here. 📖  Website : https://tonradar.app Blog : https://tonradar.app/blog Twitter  : https://twitter.com/tonradarapp (forwarded from TonRadar)

Javad: In EVMs erc20 token transactions is seen in explorers.  How can  a jetton transaction be seen In ton?

User<6258201532>: ##tondev here senior blockchain full stack engineer with experience of building DAPPS on EVM,Solana,Ton,Sui networks.if there maybe some works I can be of any help for you , please reach me out.tnx

Andrew: what's your GitHub? (reply to 30010)

Rami: In recv_internal, how can I retrieve the "from address"?

Daniil: slice cs = in_msg_full.begin_parse(); cs~skip_bits(4); slice from_addr = cs~load_msg_addr(); (reply to 30012)

Rami: How can I hash a slice using Keccak256?

nonam3e: Keccak256 is implemented only in testnet right now. This is HASHEXT_KECCAK256 opcode (reply to 30014)

Rami: How can I compile a contract that uses new opcodes?

Daniil: What do you mean? (reply to 30016)

Alexander: Define new opcode in asm function, and use it in your FunC code. Don't forget to declare it in Fift ASM if you haven't already done so (reply to 30016)

Rami: In my contract, I have a function: int keccak256(slice data) asm "HASHEXT_KECCAK256";  However, blueprint, which uses func-js, refuses to compile and shows the following error: Error: main.fif:50:     HASHEXT_KECCAK256:-? (reply to 30017)

Daniil: Read this: https://t.me/thetontech/56 (reply to 30019)

Nacho: Hey! Good afternoon TON community.... I wanted to ask you if anyone knows where I can find information to develop a smart contract to launch a small collection of NFTs in TON (mint)... or link it directly to a BOT...  The information I have found so far, serves for me to make the mint (the creator of the collection) the nfts, but what I want is that people mint directly their own nft of the collection ....  Thanks and greetings!

Клецка: you can use get items, like with this NFT https://getgems.io/nft/EQB32bnYd8yl57TPQqG4OF7rNtAAoZz_jemQRveLO0Z4TVf0 (reply to 30021)

Nacho: I'm sorry, but I didn't understand what you meant. (reply to 30023)

Клецка: you can create a single NFT or collection on this site and deploy it's smart contract to the network (reply to 30024)

Nacho: I want to create an entire Collection (reply to 30025)

Клецка: it is possible on this site (reply to 30026)

Nacho: Does Get gems have a Launchpad for public use? (reply to 30027)

Клецка: it has a constructor. if i remember right you need to connect your wallet first. then you will be able to create a collection

Nacho: Ok, I get what you mean. The case is the following: I want the public be the one to mint the NFT, not me... that's why I wanted to set up the mint site in a web page or at most in a telegram bot... Do you have any idea of any help? (reply to 30029)

— 2023-06-23 —

Vatshayan: hello getTranscation method is not working  I am using Ton mainnet API

Vatshayan: can someone send me code in js for this

Vatshayan: for geeting transcation after sending ton

Vatshayan: https://toncenter.com/api/v2/

Howard: Do we have any Reentry cases we need to notice when we build the protocol on TON?

Ruslan: Please, try to set parameter archival=true (reply to 30031)

Daniil: External messages can be sent any amount of times by anybody. So be careful with them (reply to 30035)

Rami: How can you concatenate strings?  For example, slice msg = "Hello from " + from_addr;

Max: begin_cell().store_slice(s1).store_slice(s2).end_cell().begin_parse()

Max: however cells can only store 1023 bits so up to 127 bytes

Max: there's a snake format in which you store successive parts in references

Vatshayan: we need single getTranscation information form given hash   I am using getTranscation  But it is giving all the hash done on one account address

Vatshayan: How to get information of single transcation from hash

Vatshayan: I am using getTranscation method from ton API swaggers

Rami: Does this asm function return a uint256 value? int keccak256(slice data) asm "HASHEXT_KECCAK256";

nonam3e: If [A] is not enabled, the result of hashing will be returned as an unsigned integer if fits 256 bits or tuple of ints otherwise. (reply to 30046)

Rami: Is there any way I can see what the asm function returned? I'm trying to store the result in c4 and retrieve it using a get method, but all I get is exit_code: 9. (reply to 30047)

nonam3e: 9 - Cell underflow. Read from slice primitive tried to read more bits or references than there are. Maybe the sum of bits in the input slice isn't divisible by 8 (reply to 30048)

Oleg: 💎 Tonutils Proxy v1.2.1 Released!  Added support for resuming files and watching videos located in TON Storage from any moment without full download.   You can create your own decentralized Youtube or Netflix in TON Network, where videos located in TON Storage (content makers can host them using Tonutils-Storage for example) and users can watch them using Tonutils Proxy, true web3 ❤️‍🔥  Changelog: * Integrated with tonutils-storage for ton storage sites usage * Ranged bag files downloading support * Faster and more stable DHT * Added optional --no-http flag to not allow ordinary http requests proxying  🚀 Download

Howard: Raise this question again, since what if I want the same NFT have more than 2 owners?   (proof of owning, proof of shares...etc) But want this token enable listing on Getgems.io, not Jetton Token that can trade on DEXs. (reply to 24757)

Howard: cc @TrueCarry, @Arterialist, @Gusarich (reply to 30053)

Andrew: multisig wallet as an owner? (reply to 30053)

Rami: Okay, I think I've tried everything: adding up to 8 bits to the slice, changing the number of arguments from 1 to 8 (since HASHEXT_KECCAK256 can take n slices as input). I think I'm done. That opcode is unbeatable. 😅 (reply to 30049)

Rami: I wonder, has anyone ever been able to make the HASHEXT_KECCAK256 opcode work? Maybe there's a working showcase available 🤔

Howard: nah, I mean we might need to think ERC1155 implementation in TON.    Since some NFTs might need multiple owners. (reply to 30055)

Neo: Need Website with ability to later have a dapp to work with ton and MM.  Can you point me in the right direction?

Howard: ton.app (reply to 30059)

— 2023-06-24 —

🏸: Hi, can someone write a smart contract for my site? I want to integrate my site with the open network blockchain

Dmitry | backend4you.ton: What kind of integration you need? Give more details please (reply to 30061)

Gulolio: Guys in case anyone is had faced the TVM exit code 33 while sending a transaction, I wrote this article explaining my thoughts on it. Gonna leave it here in case someones needs it in the future, could save you debugging time.  https://gealber.com/ton-virtual-machine-exit-code-33

Mirzakomil: #question Goodafternoon all, my name is Mirzakomil, and I am Mobile Developer (I know Android - Java and Kotlin programming languages, and CrossPlatform - Dart programming language and Flutter framework but have no experience), how can I take an internship from TON community?

Max: github.com/ton-society/ton-footsteps

Sepehr.A: Hi everyone   does anyone know if ton supports smart contract? And if it does, where is the best source to learn on how to make smart contract?

Andrew: it does there's no best source but you can start with official docs (reply to 30069)

Sepehr.A: Thanks (reply to 30070)

Premiumswagツ‽ᛒ #Ⱥ𝚇𝚈𝚉𝟽𝟽: Hello

User<2060215631>: Hello

User<6295290266>: I want to publish a holiday lottery based on a NFT ticket system on the TON blockchain.   I need a developer who want to be part as a CTO

🌽 Jason: how about salary? (reply to 30074)

🌽 Jason: here (reply to 30075)

Клецка: hi! can someone explain how does slices work on a data structure level? like, i have a code, that returns a slice, containing a "Hello world" string, but i'm getting base64 data which seems to contain some other data but an initial string: te6cckEBAQEADQAAFkhlbGxvIHdvcmxkrgE9NA==

Alexander: This base64 encoded string isn’t slice, it’s some representation of BOC (Bag of Cells). BOC is a way to serialize TOC (tree of cells).   You see the data in this format because the slice type can only exist on the TVM stack, but can easily stored in a cell and the serialized to BOC (reply to 30078)

Клецка: thank you! (reply to 30079)

Клецка: does get methods spend gas?

Andrew: no, they're executed locally (reply to 30081)

Andrew: anyone can download the code and data and emulate the method

Клецка: but, if i'm calling get method it throws -4( out of gas ). what does that mean? (reply to 30082)

Alexander: Remote lite-servers usually have gas limit so that you can't run an infinite cycle, for example. You can download code and data of your smart contract and execute get method locally, to bypass these restrictions (reply to 30084)

Клецка: okay! (reply to 30085)

Клецка: thanks!

NekoSenpai: how do I set up to use the testnet in ton-connect-ui-react?

Nikita: It’s settings in the wallet, not in ton connect,  For example in the OpenMask you may find testnet switch in the header (reply to 30089)

— 2023-06-25 —

NekoSenpai: how to solve this . [TON_CONNECT_SDK] Connected wallet didn't provide information about max allowed messages in the SendTransaction request. Request may be rejected by the wallet.

Клецка: can i get sender address from a simple transfer message?

Клецка: @pcrafter

&rey: Convert in_msg_full to slice, skip/process 4 bits of flags, then use load_msg_addr. (reply to 30092)

Клецка: but, i'm getting an error: "Error, exit code 0" this contract: https://testnet.tonscan.org/address/EQDnxP4VSX6_VaFrceVWpb4MZZATHSu1U5bRojy_5UhhHjbe this code: #include "stdlib.fc";  () send_payment(int amount, slice address) impure inline {     var msg = begin_cell()         .store_uint(0x10, 6) ;; nobounce         .store_slice(address)         .store_grams(amount)         .end_cell();      send_raw_message(msg, 64); }  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     var cs = in_msg_full.begin_parse();     var flags = cs~load_uint(4);  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool     if (flags & 1)     {         ;; ignore all bounced messages         return ();     }     slice s_addr = cs~load_msg_addr();     send_payment( 100000000, s_addr );     return ();     return (); } (reply to 30096)

&rey: You are sending outgoing message incorrectly. (reply to 30099)

&rey: You have to put 107 zero bits after the msg value.

Клецка: like that: var msg = begin_cell()         .store_uint(0x10, 6) ;; nobounce         .store_slice(address)         .store_grams(amount)         .store_uint(0, 107)         .end_cell(); ? (reply to 30101)

Daniil: Yes (reply to 30102)

Клецка: i've got the same error and no transaction appeared in Tonscan (reply to 30103)

Andrew: check TVM phases on dton.io (reply to 30104)

Клецка: thank you so much! i've found an issue! (reply to 30105)

Nazar: hello, i think i found minor bug in https://wallet.ton.org/

Nazar: I need consultation with someone

Dmitry | backend4you.ton: https://github.com/ton-blockchain/bug-bounty (reply to 30107)

Samyar: how can i convert ton to nanoton ?

Mr. John: Multiply by 1e9 if it’s native coin (reply to 30111)

Samyar: when i want to send transaction via ton connect sdk i get the bellow error :  userWallet.connector?.sendTransaction( {"messages": [ { "address":"0:28c33c2eab67fa99b41ac2177d1993e4c8d7c717f09f51d2a15b3f2b62665b32", "amount":"300000000" } ], "validUntil":1000000} )  index.mjs:284  Uncaught (in promise) Error: [TON_CONNECT_SDK_ERROR] BadRequestError: Request to the wallet contains errors. Request timed out  and as shown in the image i get 200 success bridge/message too

&rey: validUntil is invalid. It must contain UNIX timestamp when the request becomes outdated. (reply to 30113)

Samyar: oh thanks i thought i should pass milliseconds (reply to 30114)

&rey: You now pass the timeout from 'now', but you have to pass the time. (reply to 30115)

🌷 Meyzi: how we can check total burn amount?there is an error. (forwarded from 🌷 Meyzi)

🌷 Meyzi: https://blog.ton.org/ton-holders-and-validators-vote-in-favor-of-implementing-the-toncoin-real-time-burn-mechanism ?? 😐 (reply to 30118)

TON Answers Bot (not AI): Is it hypothetically possible to brute force access to other people's wallets? from Evgeniy Trifonov  On TON (and other blockchains that I know of) word mnemonic is like both login and password at the same time. So if I get it right, technically nothing stops a malicious person from trying different combinations in hopes to get hold of other people's wallets, but there are just too many combinations so these attempts are probably useless.  Indeed, the words are taken from a 2048-word dictionary, so a number of possible 24-words combinations is insane (2048 to the power of 24, I guess?), and the chances of colliding are extremely small. So I understand that it's probably nothing to worry about in a practical sense. But I would like to understand everything theoretically, so I want to know:  1. Do I get it right that new wallet mnemonics are generated in a (pseudo-)random way, so purely hypothetically they could collide? Could someone try creating a new wallet with Tonkeeper and get the access to my wallet? I understand that it would probably happen to no one in a million years, but does the possibility exist?  2. If someone tried to brute force (try as much random mnemonics as possible) to get hold of existing wallets, what is the number of mnemonic per second they could check using a powerful server? And would adding a second server double that speed? Is there some limit on the possible brute forcing speed and how high it is?  3. Do I get it right that there is no other form of protection? If you own a hardware wallet for Toncoins and it's locked in a physical safe, but someone brute forced different mnemonics and found yours, they would still be able to withdraw your funds?    🔗 Answer on TON Overflow

— 2023-06-26 —

Howard: How long will a contract keep there if it just deployed but only with zero balance?

Alexander: Until someone sends a message that causes a storage fee charge. You can try it, by sending zero value internal message to this contact (reply to 30124)

&rey: -0.1 TON will cause it freezing, and upon reaching -1 TON the contract will be destroyed. (reply to 30124)

Howard: interesting (reply to 30126)

Клецка: what does "contract destroyed" mean? (reply to 30126)

&rey: Contract is no longer recorded in blockchain, its code and data are deleted and the address is freed for deploying the identical contract once it's needed. (reply to 30128)

Клецка: so, you can delete data from blockchain? (reply to 30129)

Клецка: that's something new😅

&rey: Yes if it's not paid in time, otherwise someone could store several hundreds GB of data and all validators would have to store that data. (reply to 30130)

User<6247944943>: 👍🏿👍🏿👍🏿 (reply to 29042)

pid | ton: is this the official Rust SDK for ton? https://lib.rs/crates/tonlib

Язон: How do I use my Tonkeeper wallet using tonweb or ton? This code gives me wrong address

&rey: Is your Tonkeeper wallet v3 or v4? (reply to 30135)

Язон: in app it says v4r2

&rey: Also, the address can differ if it is in testnet.

&rey: Or, you can check the mnemonic, maybe there is some typo and the public key is different from actual one.

Rami: + (reply to 30134)

Язон: Thanks, network is OK, i'm using my api instance looking at mainnet.  So the addr depends on wallet_code, network, and keys ?

Язон: Does Tonkeeper use standart v4r2 wallet?

Danila: by default, yes. But you can select any version in the settings (reply to 30142)

Amin: Hi admin please help me , My another account has been kicked out from this group. Why?

Cocomastoras: 4294967282 any idea what exit code is this ?

Cpperg: Any dev here with great knowledge of algorithmic trading and making bots on metatrader?

&rey: Are you using C++? This is exit code -14, that is actually code 13 (out of gas) but inverted to indicate that it can be trusted and was not thrown by the contract. (reply to 30145)

&rey: This is offtop. (reply to 30146)

Florina: Hey all!

Язон: Can someone give me anadvice?  How to use Tonkeeper wallet v4R2 from JS. I'm confused. What do I need to use tonweb or ton js

Клецка: TonWeb has a example of using this in a Readme on GitHub (reply to 30151)

Клецка: https://github.com/toncenter/tonweb

Danila: Do you want to interact with the tonkeeper? Check Blueprint (reply to 30151)

pid | ton: https://github.com/ton-community/blueprint

Eugene: > tonweb or ton js  You can use any of those two libraries. Here is a tutorial for both: https://ton-community.github.io/tutorials/01-wallet/ (reply to 30151)

Язон: No, I mean interact with wallet created in Tonkeeper (reply to 30154)

Язон: Thanks everyone

Язон: it's working with my old wallet v3r2 using wallet = ton.WalletContractV3R2.create(...) But with my newer wallet v4r2 it does not work, i'm getting wrong address. Is it posible that wallet = ton.WalletContractV4.create() is wrong contract? v4 not v4r2 (reply to 30157)

&rey: Have you tried ton.WalletContractV4R2.create()? (reply to 30160)

&rey: As far as I remember, WalletContractV4 is base class that shouldn't be constructible at all.

Язон: There is no v4r2  am I using outdated version of ton js? (reply to 30161)

Язон: hello (reply to 30164)

&rey: Hm, there is no v4r2 in the repository as well. You can try to extend the WalletContractV4 class rewriting its constructor so that it would set the wallet code correctly. (reply to 30163)

Язон: Ok, thanks, i'll try to find contract v4r2 that tonkeeper is using... (reply to 30166)

&rey: You can see your own wallet in Tonscan and copy the code from there. (reply to 30167)

Язон: ou! thanks (reply to 30169)

NMI: it's v4r2 (reply to 30166)

Cocomastoras: Can a bounced message send another message ?

Daniil: contract that receives some message may check if it's bounced or not and do something (reply to 30174)

Cocomastoras: For some reason I can’t initiate a new message in the on bounce body

Cocomastoras: I get cell underflow error which is strange cause if a just comment out the message then the exit code is 0

Cocomastoras: And I don’t read anything in the msg body

Клецка: can you share a code? (reply to 30178)

Cocomastoras: This is the bounced messages body : store_ref(begin_cell().store_uint(1, 32).store_uint(12345, 64).store_uint(amount, 64).store_uint(amount - fees, 64).store_uint(outcome, 8).store_slice(to_wallet_address).end_cell());  This is the new message sent when on_bounce()  var msg = begin_cell()         .store_uint(0x10, 6)         .store_slice(to_address)         .store_coins(pre_fee_amount)         .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)         .end_cell(); send_raw_message(msg, 1);   to_address is the last slice of the body , when I use that value I get exit code 9  If a use another address (a storaged one) then the messages is sent successfully

Cocomastoras: The to_wallet_address is a valid address

Cocomastoras: x{FFFFFFFF0000000100000000000030390000000737BE76000000000725443C800180128B} The response of bounced message body

Cocomastoras: Hmm the problem seems to be that there can only be 256 bits of the body

Cocomastoras: I ll work around it

Henry: Hi, when my TON wallet receives a jetton, I have to pay a small fee for notification from jetton wallet sent to main TON wallet, is there a way to not paying this fee, for example, let jetton wallet covers all the fee instead?

X4: Hi together, is there a project fund for companies building on TON? Who do I contact for that?   X4, Co-founder,  Phantom Network & Gm.co

Клецка: /report (reply to 30187)

Cocomastoras: Is it possible to know the balance of a contract that sends a message in the func code ?

Cocomastoras: TON balance

Cocomastoras: Is get_balance valid ?

Tim: you can only know balance of (current) contract that receives(handles) message

Nacho: Hello! Me here again... 🤖  We are in search of a community manager (CM) to power our project. You should have experience developing strong communities on TON blockchain. 🧑‍💻  If you feel identified or know someone, do not hesitate to send me DM....  Greetings TON family 💙🫶🏼

TON Answers Bot (not AI): Can I make VS Code autocomplete load_uint and store_uint? from Evgeniy Trifonov  I use Visual Studio Code with the "FunC Language Support" extension by Whales Corp. This setup is convenient and often helps with the autocompletion in FunC. But for some reason when I type load_uint() or store_uint() the autocomplete suggests all kinds of things from load_coins to load_ref, but not the one I need, even though it's a popular function.   It's not the end of the world, I can type the whole thing manually, but it feels very weird to me. Maybe I don't understand something and the support for load_uint() can be turned on somehow?   !(https://i.imgur.com/9P5XAiI.png)     🔗 Answer on TON Overflow

🌷 Meyzi: how we can check total burn amount? there is an error. (reply to 30119)

— 2023-06-27 —

Jeff: Hello, Is there any fixed point math library in TON?

Язон: Hello!  Why does ton-http-api goes like this?

Язон: 'No working liteservers with ls_index=None, archival=None',

NekoSenpai: hello. i use ton-connect-ui-react for make a transaction. now I get boc . how for get the hash of the trasaction?

Клецка: sha256? (reply to 30203)

NekoSenpai: I only get the boc as a response. do you mean convert to sha256 or ? (reply to 30204)

Клецка: it should have a "hash" method (reply to 30206)

talkol: I would like to announce that we’ve officially launched https://ton.vote  - It’s a free no-code DAO governance platform for TON  - If your dapp project has a jetton or NFT you can create a new space for it  - Your token holders will be able to vote on proposals based on amount of tokens they hold  - To create a new space: https://t.me/TONVoteSupportGroup/82  - You can see examples of some cool past votes by TON Foundation in TF’s official space

NekoSenpai: in the documentation that same boc is sent to some explorer. although I have not found an explorer that supports the sending of a boc. (reply to 30207)

NekoSenpai: myAppExplorerService dont have an example .

frlyh: Is there any way to use opcode to determine what method function to execute?

frlyh: These opcode and function correspondences are contract customizations or underlying fixed specifications

Umar: Hi

Огурчік: hello everyone, is there a way to automatically receive commission for transfers (from API)? I want to automatically transfer everything from my wallet to another wallet, now I just get the account balance, subtract 0.01 from it and transfer what happened to another account, something like this (tonlib)  wallet.transfer(<dest wallet>, amount=<result of: balance-0.01>, comment='comment, send_mode=128)  but I think this is a bad way, how to do it right?

Andrew: you need to set amount 0 and send mode 128 (reply to 30215)

Yuri: Hey guys, anyone know if I can use tonconnect with TWAPs? Someone have a working example of it?

Огурчік: I'll try now, thanks (reply to 30216)

Andrew: and it would be better if you create special proxy smc (reply to 30218)

Andrew: yes, t.me/durgerking2bot/menu (reply to 30217)

Yuri: Can I do it directly in the chat bot? (reply to 30220)

Andrew: yes (reply to 30222)

Андрей: Can ton work without connection to the global internet?

Клецка: well.... you can create your own network for your offline TON (reply to 30248)

Клецка: just setup a validator node for it with a proprietary configuration

Андрей: Yeah but... Will they be completely incompatible then? (reply to 30249)

Клецка: yes. but it will be a separate network. coins that are exist in your network won't be available in a mainnet or even a testnet (reply to 30251)

Огурчік: When I transfer funds through the TON API, the following is returned to me:  {     "@type": "ok",     "@extra": "some number" }  what data is included in "extra", what is it? where i can read the docs about this? thanks.

.: Hello

Tim: Nothing useful (reply to 30253)

.: Hi gas

User<6195967334>: Hello I want to know if this link is for scamming ? Someone send me that . https://app.tonkeeper.com/ton-connect?v=2&id=13bf5a1f69f5193bbe1c086fd314f9f0f869d681bdb11b985eec3449bd7c6302&r=%7B%22manifestUrl%22%3A+%22https%3A%2F%2Fnftton.org%2Fmanifest%22%2C+%22items%22%3A+%5B%7B%22name%22%3A+%22ton_addr%22%7D%5D%7D

Клецка: it looks like this link connects your wallet to some service (reply to 30261)

Клецка: yup. to ton.org (reply to 30262)

User<6195967334>: Yes but I don't know if I can be scammed with this type of link (reply to 30262)

Клецка: i suppose, they can not do anything, until you confirm an action in a Tonkeeper. but i don't recommend to test this (reply to 30264)

User<6195967334>: Yes I think so (reply to 30265)

Клецка: but i wanna test it😂 (reply to 30261)

Клецка: and i will

User<6195967334>: Yes I would try just for see whats happen but I don't want to try with wallet with amounts (reply to 30268)

Клецка: well....

Клецка: it doesn't do anything, but connecting you to ton.org

User<6195967334>: Weiiird (reply to 30271)

User<6195967334>: Maybe they can do something after (reply to 30272)

&rey: Please edit the message to put the link inside backquotes `: https://app... (reply to 30261)

Клецка: nice idea, btw (reply to 30274)

User<6195967334>: Done ! Yes nobody can click on it cool (reply to 30274)

User<6195967334>: So what do you think? Because I'm sure its a scammer. He wanted to buy me username 30 TON but refuse to pay commission of 0.01 TON (reply to 30275)

Клецка: i'm not really sure about my competence about scam. it can be, but i can't say more (reply to 30277)

&rey: Probably he attempts to find out your IP. That link does not seem to do any harm however it's certainly scam because the connection manifest is located on nftton.org. (reply to 30277)

Клецка: i don't think that he would get any other information, but your city of living, from an IP address (reply to 30279)

Клецка: btw. as we've tuned on to scam  topic. i have a two questions: 1. Wallet contract has only a 256 bits of a public key. isn't it too short? i think that it could be easily brootforced. 2. Does recieving an external message burns gas? If it so - i can just bomb a contract with external messages to just burn it's balance

User<6195967334>: Ok so he will see Im drinking cocktails at Bahamas 😂 (reply to 30279)

Yuri: Hey guys, about sending ext_out_msgs, is there some standard, how do I catch such logs in the application?

&rey: No, external out messages remain in the shardchain where they are sent so you need to monitor the blockchain. A better way is to send internal unbounceable messages of minimal value to a predefined address. (reply to 30283)

Yuri: Sounds good, thanks!

&rey: Also, you can use any address for that as the destination contract need not exist. See https://tonscan.org/address/EQA__RATELANCE_______________________________JvN for example.

Yuri: This address is largely used for that? (reply to 30286)

&rey: That's address my platform uses for new job notifications. (reply to 30287)

Yuri: I see hehe, gonna choose one then (reply to 30288)

Yuri: Thanks

Umar: Hi

raianotmani@gmail.com: Hi

TON Answers Bot (not AI): Is it technically possible to create a EVM-powered TON workchain? from Evgeniy Trifonov  Currently TON blockchain consists of only one workchain and the masterchain. All the smart-contract code in masterchain and basic workchain is executed by TVM (Ton Virtual Machine). But TON provides the opportunity to create more workchains in the future. And the whitepaper by Nikolai Durov mentions that those hypothetical future blockchains could use different virtual machines:  > Different workchains may have different rules, meaning different formats of account addresses, different formats of transactions, different virtual machines (VMs) for smart contracts, different basic cryptocurrencies and so on.  So I'm trying to understand: do those "different virtual machines" have to be TVM-like, or could they be very different, like EVM? Could someone hypothetically create a TON workchain where code would be executed by EVM instead of TVM, so code written for EVM would be reusable on TON?  🔗 Answer on TON Overflow

raianotmani@gmail.com: No

— 2023-06-28 —

pid | ton: technically means shards can have their own consensus, is that true?

순범: If the balance of the nft be 0, is it gonna be unable to get the data of nft?

Клецка: it should not be able to get data from a removed contract (reply to 30298)

&rey: At -0.1 TON, the contract becomes frozen: its data and code are replaced by hashes, so that NFT data will not be available onchain. (reply to 30298)

&rey: However, there are archival nodes that allow anyone to retrieve any specific state of contract, even when it's frozen.

순범: Then even if there’s just 1 nanoTon, the nft data is accessible and alive?

&rey: Yes. (reply to 30302)

Daniil: Even if 0 (reply to 30302)

Daniil: https://tonviewer.com/EQCTcDrOKuOjAT5WV2tv6JPTBlXSlWbvhixCGM_4jRSIeSf5

Клецка: can you share some of archival nodes with public API? (reply to 30301)

&rey: For example, https://toncenter.com/api/v2/ with parameter archival=True. (reply to 30306)

Rami: Does TON use BIP-39 to generate a key pair from a seed phrase?

&rey: No, it hashes the seed phrase. See https://github.com/toncenter/tonweb-mnemonic/blob/master/src/functions/mnemonic-to-seed.ts for reference. (reply to 30311)

Rami: As I understood, that function returns a 32-byte private key, but how do I derive the public key from it? (reply to 30312)

&rey: There is mnemonicToKeyPair function in a file nearby. (reply to 30313)

Yuri: Hello, do we have tonconnect2.0 for python?

Daniil: https://github.com/XaBbl4/pytonconnect (reply to 30316)

Yuri: Any example how I could use it with telegram bot? Without using TWA? I'm currently using `python-telegram-bot`sdk (reply to 30317)

Daniil: you can generate a QR code and send it to user in bot (reply to 30318)

Andrew: or create a link (reply to 30319)

Yuri: After that can I trigger the next bot action with the response when the user signs up? I'd like to make the QR code disappear then (reply to 30319)

Daniil: Yes, you can do it (reply to 30321)

Андрей: At the moment, TON DHT can only contain torrents and IPs? or does it already support all kinds of content?

Santosh | Wagmi11: anyone using tonkeeper browser extension?

Santosh | Wagmi11: how do you switch to testnet network on tonkeeper browser extension ?

Santosh | Wagmi11: resolved: It's same as on mobile devices: setting => click logo 5 times and select -3 for network (reply to 30325)

Cocomastoras: When deleting a smart contract do I get a refund of the rent fee ?

&rey: No. It's storage fee that is paid for actual data storage. (reply to 30327)

&rey: But your contract doesn't pay a single nanoTON ahead of time, of course.

Cocomastoras: Let’s say I have a contract of 1230bytes and haven’t interacted with it for 90 days , then the rent that I need to pay is 9.6ton , if the action is to delete the contract do I get the refund or should I just let the contract be and never interact with it again ?

&rey: 1. The rent is much smaller, 2. When you attempt to send message to the contract, first of all storage fee is paid. If contract balance is insufficient (reaches -1 TON), the contract is destroyed immediately, even before it could process your command "destroy". (reply to 30330)

&rey: Also, it's worth mentioning that you can't delete smart contract if it has sufficient balance and has no support for destruction command. One who deployed the contract has no special control over it.

Cocomastoras: Referring to have a message with mode 128+32 (reply to 30332)

Cocomastoras: With mode 64 and enough fees to cover all costs I guess there shouldn’t be a problem right ! (reply to 30331)

Cocomastoras: ?

Cocomastoras: When sending inner messages

Cocomastoras: And if something goes wrong a funding txn will revert the “destroy” and the state of the contract will be exactly as before correct ?

Cocomastoras: If the balance becomes negative

Cocomastoras: Yeah my math were way off (reply to 30331)

Cocomastoras: Used mb instead of kb

Tim: Don't use 32 if you don't absolutely need it

Cocomastoras: Yeah I only use it to “close out” the account it’s part of the flow (reply to 30341)

&rey: As far as I remember, 1. Storage fee is paid. 2. If the balance reaches -0.1 TON, contract's code and data are replaced by hashes to be restored with StateInit. Messages w/o StateInit are then unable to interact with the contract. 3. If the balance reaches -1 TON, contract is destroyed. 4. Incoming message value is given to the contract. 5. If the balance is less than some nanoTONs, TVM is not launched (also there are insufficient funds to bounce). 6. Otherwise, TVM is launched. If it executes unsuccessfully, the transaction attempts to bounce. 7. If TVM executes successfully and actions are valid, then the transaction succeeds. (reply to 30338)

Cocomastoras: If after each interaction with the contract I keep a predefined safe storage fee inside then I guess there will not be any case of negative ton balance

&rey: Yes, that's how jetton wallets and NFTs do. (reply to 30344)

Cocomastoras: Yeah that’s where I got the idea of storage_fee

Язон: How is the wallet magically deployed? 1. I had calculated the address locally from contract code (wallet 4v2) and publicKey. 2. I funded this address 3. I made a transaction from this wallet and it went active. So where under the hood wallet was deployed and where wallet code is comming from? I did not send it to chain.. Using ton js

Язон: Answer in form of URL is also good anwer

&rey: At the moment you sent transaction from the wallet. (reply to 30347)

&rey: ton library detected that the wallet is not initialized (while reading seqno) and automatically added StateInit to external message.

Язон: Ok, thanks. (reply to 30350)

User<6195967334>: Is it possible to hide Cryptos and collectibles on tonviewer

Огурчік: still I'm wondering what @extra means in the answer, what can I use this data for? (reply to 30253)

Огурчік: i think no (reply to 30352)

Огурчік: I just want to track the transaction somehow without using comments to make sure that it was successful, will this data help me to do this? (reply to 30353)

User<6195967334>: And subadresss? (reply to 30354)

Andrew: do you need it for payments? (reply to 30355)

Огурчік: yes, I have an account from which I automatically transfer TON, I want to somehow make sure that TON has come, and find exactly that transaction (reply to 30357)

Огурчік: who can tell what that means?   {'@type': 'error', ' code': 500, 'message': 'LITE_SERVER_UNKNOWN: timeout(during last block synchronization)', '@extra': '<code>'})>

&rey: There has been an internal liteserver error (probably it could not download the last block). (reply to 30359)

&rey: You would probably want to retry the request (if that's transfer from wallet, not changing the seqno).

Огурчік: I understood this 😆 is it possible somehow on the client side to ensure that there is no such error? (reply to 30360)

&rey: Probably no, as all liteservers need to download blocks. You could try to choose one where the errors are less frequent. (reply to 30362)

Огурчік: ok, thanks a lot 🙏 (reply to 30363)

Dmitry | backend4you.ton: Spin up own lite server (reply to 30362)

Огурчік: maybe this is a really good idea 😁 (reply to 30365)

&rey: Just a reminder: that includes running own full node. Though, this can allow both to send and to check transactions easier. (reply to 30366)

sdw: hello, Is there a way to decode stack cell data coming from node using /runGetMethod? Thank you in advance

Andrew: https://github.com/toncenter/tonweb/blob/master/src/providers/HttpProviderUtils.js#L31 (reply to 30368)

— 2023-06-29 —

Yuri: Morning, anyway know what's wrong with this QR code?

Yuri: WALLET_CONNECT_SOURCE = {     'universal_link': 'https://app.tonkeeper.com/ton-connect',     'bridge_url': 'https://bridge.tonapi.io/bridge' }

순범: isn't it allow to use 'null()' inside '.store_ref()' in func? I got error code 7 and if I put 'begin_cell().end_cell()', It doesn't make error.  I read that null() can be used for all the atomic types. isn't it?

Andrew: u can use .store_dict() with null() (reply to 30373)

순범: but It occurs error code 9 when I load_ref (reply to 30374)

Daniil: because you need to do load_dict (reply to 30375)

Daniil: store_dict:  - if you provided Cell, it stores one bit True and your cell as reference  - if you provided Null, it stores one bit False  load_dict loads one bit at first  - if this bit is True, it loads the reference and returns it (Cell)  - if this bit is False, it returns Null

Daniil: basically it can be used to store nullable cells. just what you need

순범: then, is it like maybecell? (reply to 30378)

Daniil: yes (reply to 30379)

Daniil: Null can be used as value for variables during the execution. But storing Null in data doesn't make sense. That's why you need to explicitly note that the next value in slice is null (exactly what store_dict and load_dict do) (reply to 30373)

순범: then, what is difference between store_dict and store_maybe_ref? (reply to 30380)

Daniil: no difference  https://docs.ton.org/develop/func/stdlib/#store_maybe_ref (reply to 30382)

순범: ah, thx a lot! (reply to 30383)

순범: can I ask one more question? What is the difference between 'new Cell()' of ton-core and 'null()' or 'begin_cell().end_cell()' in func? (reply to 30383)

Daniil: new Cell() in ton-core will create an empty cell (Cell.EMPTY is a better way). Basically no difference from begin_cell().end_cell() in func. But null() in func won't actually create a cell. instead it will create a Null value.  btw, you can do beginCell().endCell() in ton-core too. (reply to 30385)

🏸: I need to connect wallet  on my website Anyone can do it, I will pay for it Ton connect = login

D.Hiroki: Is there such a thing as "number of block confirmations" on TON?

D.Hiroki: I would like to know how many blocks to finality.

Daniil: No. In TON, as soon as transaction appears in block, it can be considered confirmed. (reply to 30389)

D.Hiroki: this mean 1block/

D.Hiroki: ?

Daniil: Yes (reply to 30392)

D.Hiroki: Are there any special features of TON's address generation method?

D.Hiroki: I would like to know about address generation method.

&rey: https://docs.ton.org/learn/overviews/addresses (reply to 30396)

Андрей: Is onion encryption being worked on?

&rey: Smc address is hash of its StateInit — initial code and data. This allows to validate that incoming message comes from the contract that can be trusted + allows to calculate new contract address both onchain and offchain. (reply to 30395)

D.Hiroki: Is it necessary to deploy a smart contract for every address generation? (reply to 30399)

Daniil: No (reply to 30400)

D.Hiroki: So it's a personal choice to include smart contracts in address generation.Right？ (reply to 30401)

Daniil: Wallets in TON are also smart contracts. Their addresses are generated the same way — as a hash of code and data.  But you don't need to deploy it in order to get the address. (reply to 30402)

D.Hiroki: Please tell me how multiple nodes will be able to keep the same recorded data on a regular basis.

Arsen: Hello guys i have some problem which i don't clearly understand how it happens.    https://tonscan.org/tx/fKyiPbI-J9wcv_-BgrjTZSKlXF5gQ_NHhpvTPGNW9-k=  https://tonscan.org/tx/EcEM9dkHpl9I-_ns2K18AW7lMpkc0qF4qqVKiIUmj2w=    Here are 2 hahses of transaction.   Second one is the transaction of output from wallet bot.  First one is the transaction of input to my wallet created with tonweb lib. Standard v4r2 wallet,      I wrote to wallet bot support they told me that the transaction is successfully sent from their side and rest is to be discussedd with "My Wallet Provider" . As the wallet is created by me, and i am the provider , i need to uderstand how such things can happen, and why the money is lost.  Is there someone who understands how this works and give me hints what can i do to avoid such things later.

&rey: The "money" (0.001 TON, really) is lost on gas computation fees, as v4 wallet tries to process incoming messages to test if they are sent by plugins. (reply to 30405)

&rey: How to avoid that: use larger sums. 0.1-1 TON is already fine.

&rey: Do you mean validators? Blockchain state is changed by new blocks. Those blocks are generated and distributed to all nodes, then the catchain protocol commits that block so it becomes final. (reply to 30404)

Samyar: how can i inject wallets ?  i only know how to connect remote wallets (tonkeeper and tonhub)   [TON_CONNECT_SDK_ERROR] WalletNotInjectedError: There is an attempt to connect to the injected wallet while it is not exists in the webpage.

sdw: is there a way to get from wallet its contract hash?

&rey: Convert the wallet address into hex format, remove workchain (0:) — the remaining part is hash of StateInit. (reply to 30410)

&rey: Or, you can 1. download the wallet bytecode and data, 2. in data cell, replace seqno with 0 and plugins dict with empty dict (if present), 3. create StateInit (beginCell().storeUint(6, 5).storeRef(code).storeRef(data)), 4. hash StateInit. The results should be identical.

&rey: 1. Are you working on localhost page? Most extensions don't work there. 2. Are you trying to connect the correct wallet? Is that Tonkeeper's browser or some wallet extension on desktop? (reply to 30409)

D.Hiroki: It is the mechanism from block generation to recording on the TON blockchain, which is recognized by the BFT as being recorded upon approval of 2/3 or more. Is the amount of staking involved in this process? (reply to 30408)

&rey: Yes, consensus is checked by sum of stakes of validators who signed the block. (reply to 30414)

D.Hiroki: If one individual holds more than 2/3 of the TON, can only that person approve the transaction? (reply to 30415)

D.Hiroki: Or 2/3 of the staked quantity?

&rey: Theoretically, yes. Actually, there are some problems with such centralization. (reply to 30417)

&rey: In particular, the Elector smart contract ensures that there are at least several (10) validators whose decision matters.

&rey: Otherwise, new validator set would not be installed.

D.Hiroki: OK. Thank you so much!

D.Hiroki: With their 2/3 approval the transaction will be recorded? (reply to 30419)

D.Hiroki: They are 10 Validators, randomly selected by ballot, who are responsible for block generation and recording. Correct? (reply to 30419)

&rey: No. They are >=10 programs (validators), selected by Elector smart contract by maximal stake sent, who are responsible for block generation, distribution and recording. (reply to 30423)

&rey: New elections take place every 12 hours.

&rey: The election validity, as it's smart contract execution result, is asserted by the previous group of validators.

User<6247944943>: 🔥🔥🔥

User<6247944943>: Any website we can check the data for elector and staked TON etc? (reply to 30424)

Yuri: up (reply to 30370)

Cocomastoras: Are there any multigwallets you can suggest?

&rey: There is an official multisig https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc.  Also, I've come across new multisig wallet based on new TVM opcodes: https://github.com/alirezatabatabaeian/FrosTON. Currently it works only in testnet. (reply to 30430)

Arsen: Thank you very much. So the only issue here is fee right ? the amount was just for the testing purposes and lesser than 1 ton won't be accepted later. (reply to 30406)

TON Answers Bot (not AI): Are different wallet versions fully compatible for sending/receiving Toncoins? from Evgeniy Trifonov  There are several different wallet contract versions on TON, with the latest wallet contract version currently being v4r2. They have different abilities and they even produce different wallet addresses with the same mnemonic. So I'd like to check: are they fully compatible in sending and receiving Toncoins? Is it fully safe to send money from a wallet with one version to a wallet with another?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/127543     🔗 Answer on TON Overflow

Eugene: (accidentally posted that from my account instead of a technical one, fixed it now and the link to the question changed: https://answers.ton.org/question/1585283961360224256/are-different-wallet-versions-fully-compatible-for-sending-ton ) (reply to 30433)

Yuri: It's generating this link:  tc:?v=2&id=97e9fc2ce93ae07b583df3e14f12ca65f28f469b5695f87f70ecc8f72d5b3c12&r=%7B%22manifestUrl%22%3A+%22https%3A%2F%2Fraw.githubusercontent.com%2FXaBbl4%2Fpytonconnect%2Fmain%2Fpytonconnect-manifest.json%22%2C+%22items%22%3A+%5B%7B%22name%22%3A+%22ton_addr%22%7D%5D%7D (reply to 30429)

Yuri: substituted the WALLET_CONNECT_SOURCE by the wallet address and it worked (reply to 30436)

Oleg: 💎 Tonutils Proxy v1.3.0 has been released!  ⚡️Native libraries for Android and iOS have been included. You can now seamlessly integrate the local Tonutils Proxy into your mobile app, enabling you to use TON Sites and TON Storage with true end-to-end encryption directly from your phone!  ⚡️Furthermore, we have optimized the TON DNS lookup process by implementing parallelized requests to multiple nodes. This enhancement ensures faster response times, as certain nodes may occasionally be slower to respond.  Changelog: * Native libraries for Android and IOS * Faster DNS Resolve of domain from chain  🚀 Download

D.Hiroki: I would like to ask you a question about the TON address generation method. I heard that a different smart computer is involved when generating addresses.

Язон: Addresses are generated from contract code and init data (reply to 30439)

Язон: Here https://docs.ton.org/learn/overviews/addresses (reply to 30439)

🏸: I need to connect wallet  on my website Anyone can do it, I will pay for it Ton connect = login

Daniil: You can do it yourself  https://docs.ton.org/develop/dapps/ton-connect/integration (reply to 30442)

D.Hiroki: Is it mandatory to deploy the smart contract code?

&rey: This is not very hard. Also, probably you should post this in more appropriate places, like @Ratelance freelance platform. (reply to 30442)

&rey: Depending on what you want, but generally yes: if it's smart contract code, unless someone deploys it, there are no instances of smc to interact with so your code is useless. (reply to 30444)

sdw: Does anybody know how can I get the Code Hash using just contract address?

&rey: You have to use tonapi/toncenter to download contract state, take code out from there and hash it. (reply to 30447)

sdw: Thank you for the reply. Which method is best to download contract though? (reply to 30448)

&rey: TON Access by Orbs claims to be the best method as it has no rate limits and is geo-distributed. (reply to 30449)

Dmitry | backend4you.ton: Or smc.getData in tonlib… depends on your tech stack

sdw: thank you again. You have mentioned toncenter which is the one I am currently using. is there a way there to get contract code? (reply to 30450)

&rey: You need the /getAddressInformation method. By the way, TON Access is fully compatible with Toncenter (and they have the same bugs). (reply to 30452)

sdw: Thank you all

Tim: use getAddressInformation,  people like to call bot commands (reply to 30453)

Daniil: What bugs are you talking about? (reply to 30453)

&rey: They can't retrieve transactions at some uninit addresses. I've ran into that while creating TON Timer UI. (reply to 30458)

— 2023-06-30 —

aaa: Hello group administrator, I am a cex developer, we have encountered a lot of fake recharges due to logic loopholes, and the loss of funds is quite large, I want to seek your help, can someone reply me?

&rey: I'd recommend you to conduct formal verification of platform. (reply to 30461)

&rey: There are two options: 1. Request an existing company, like Certik, to do so. Formal description will not be reusable by others; 2. Request me or another developer to do the verification. The cost will probably include reimplementing TVM if low-level verification is desired. Verification materials can be published at your discretion (publishing them supports open source). (reply to 30462)

F: Ask directly in this chat. Perhaps this information will be useful to you: (reply to 30461)

F: So we need to pay attention to the field compute_exit_code If it is equal to 0 or 1, then the transaction is successful. Read more about compute_exit_code (tvm exit codes) here: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes  Also compute_exit_code can be null - means there was no Computation Phase. There are two situations where it is possible: 1) incoming message has no money to start Computation Phase 2) Receiver address has no code. In the last case there can be bounce (depending on the incoming message bounce flag).  I assume that you are trying to detect whether deposit or withdrawal was successful. In this case I propose in case compute_exit_code = null check whether transaction has outgoing message. If there is no outgoing message - operation is successful. If there is outgoing message - bounce message - operation is failed. (forwarded from F)

F: An example of an unsuccessful balance transfer: https://tonscan.org/tx/HaX-6QaytaRmGq6RKR7hcivHSYXtUYsHW6czsuL5byg= https://toncenter.com/api/index/v1/getTransactionByHash?tx_hash=1da5fee906b2b5a4661aae91291ee1722bc74985ed518b075ba733b2e2f96f28&include_msg_body=false&include_block=false (forwarded from F)

Florina: Hello all,  This is Andreas from Cyberscope - a high-quality blockchain security company with a portfolio of 1500+ audited projects.  We are connecting with dev communities to meet skilled individuals and help them navigate through blockchain security.  If you are an early stage or even a launched project and would like to get a free quote for a high-quality audit feel free to message me and I will be glad to connect and meet every one of you!

&rey: You'd probably want to be listed at https://docs.ton.org/develop/companies/auditors. By the way, do you have public cases with TON? (reply to 30467)

Florina: Awesome, thank you for providing this. I'll go ahead and apply to be added now.   No, we haven't had any so far but we're more than happy to support projects building on TON! (reply to 30468)

sdw: Hello, Is there a way to hash the code from /getAddressInformation using ton core library? (reply to 30447)

Henry: Hi I bridge some TON from TON to ETH in testnet/goerli. How long does it take normally and what is TONCOIN address in goerli testnet?

Henry: I'm checking bridges from here https://testnet.ton.cx/address/Ef-56ZiqKUbtp_Ax2Qg4Vwh7yXXJCO8cNJAb229J6XXe4-aC I do not see anyone from there receive TON token on ETH after bridge.

Cocomastoras: Is there a testnet wallet bot for in telegram transactions ?

Cocomastoras: Like @wallet

F: @CryptoTestnetBot @testgiver_ton_bot (reply to 30473)

liminal: https://www.youtube.com/watch?v=0-EUkkhD4Mw

Barış: hi everyone

Barış: i wanna ask a question about asm declerations like int op::report_royalty_params() asm "0xa8cb00ad PUSHINT";  can i give whatever value what i want or all off them are predefined?

Клецка: you can use any value (reply to 30484)

Клецка: it is just a variable

Barış: thank you so much

Клецка: but, it is some consensus about them: they calculated as op's of get methods (reply to 30487)

Barış: i wanna use them as enums checking operations

Daniil: By the way, in modern versions of FunC you can declare constants like:  const int op::report_royalty_params = 0xa8cb00ad; (reply to 30484)

Barış: hımmm thank you

Barış: nft example a bit old i see

Henry: Hi, I deposited into bridge but not received on ETH side. It was more than an hour ago.

User<6215912408>: hi guy, can we be friends

Henry: I think It needs claim on ETH side too. Is there any UI on ton bridge to claim bridged TON on ETH blockchain?

Alex: Please, ask help in the @ton_help_bot (reply to 30497)

Клецка: what is a KIGNY token? someone sent me one

Rami: What's Anycast? I've found TL-B scheme for it, but what's by definition?

— 2023-07-01 —

Yuri: Hello, how can I get the StateInit of an already deployed wallet? I have the wallet address and I need the public key to verify the tonproof signature in the backend.

&rey: You can invoke get-method get_public_key.  To get StateInit exactly, you need to find the transaction that deployed the account (probably via dton.io) and retrieve StateInit from that transaction. (reply to 30526)

Yuri: Hmm, I see, think the get method will suffice. Which lib would you recommend in Python to do that? (reply to 30527)

&rey: Doing a request to TON Access by Orbs is the easiest way, or you can use tonlib if you already use it for some other purposes. (reply to 30528)

Yuri: Nice, thanks! I'll give it a try (reply to 30529)

&rey: It is a non-implemented feature, that rewrites address prefix with the current shard identifier. It was intended to route messages to the nearest instance of contract if the contract sharded itself along with the workchain. (reply to 30504)

User<5930122672>: rldp-http-proxy -a <global-ip>:3333 -L example.ton -C ton-global.config.json    Runs a local RLDP->HTTP proxy on UDP port <global-ip>:3333 that forwards all queries for http://example.ton to HTTP server at localhost:80  how i can run  RLDP->HTTP on different port Instead of  localhost:80 for example localhost:2626 ?  also  what is the best way to keep it always run on Linux ?

Yuri: Is @orbs-network/ton-access available for python? (reply to 30529)

&rey: Probably no, but its API is Toncenter-compatible and I believe it's not too hard to get the nodes list. (reply to 30533)

Yuri: Saw that toncenter is limited to 1 request/ sec without API key

&rey: Yes, and that's the reason ton-access is better. (reply to 30535)

Daniil: https://ton.access.orbs.network/nodes (reply to 30534)

Yuri: Is it like this? I'm using pytonlib:

Yuri: Getting: pytonlib.tonlibjson.TonlibNoResponse: tonlibjson did not respond

Maksim: try another liteserver or increase timeout (reply to 30539)

Andrew: yes, I've implemented it for my SDK, you can just extract the necessary code https://github.com/TheTonpay/tonpay-python-sdk/tree/main/tonpay%2Futils%2Fton_access (reply to 30533)

Andrew: usage is the same as with js package

Rae: Hello, does anyone know if there are plans to add NFTs to the official TG wallet?

Yuri: Correct? (reply to 30542)

Andrew: should be, yes (reply to 30544)

Yuri: It's printing: {'args': ['https://ton.access.orbs.network/44A2c0ff5Bd3F8B62C092Ab4D238bEE463E644A2/1/mainnet/ton-api-v4/runGetMethod'],  'func': <bound method ToncenterClient.__post_request of <tonsdk.provider._toncenter._client.ToncenterClient object at 0x000002BCA26A21D0>>,  'kwargs': {'data': {'address': 'EQC42TWuPKdUKy2yelqDInLUx7atyap9s7cPIV5LZ82XzKXd',                      'method': 'get_public_key',                      'stack': []}}}

Yuri: Which step am I missing?

Andrew: depends on what you need

Andrew: the return data is in the "stack"

Yuri: Hm, it seems it didn't even send

Andrew: maybe your wallet is v3r1

Yuri: it's v4r2

Andrew: shouldn't you await the raw_run_method? (reply to 30547)

Yuri: I tried it, but I got an error saying I can't await a dict (reply to 30555)

Andrew: try to use TonTools to interact with contracts

Yuri: Where can I find it? (reply to 30557)

Yuri: It has the client there also?

Andrew: https://github.com/yungwine/TonTools (reply to 30558)

Yuri: Getting a TonTools.Providers.TonCenterClient.TonCenterClientError: TonCenter failed with error: Not Found error

Yuri: from typing import Awaitable from TonTools import TonCenterClient from ton_access import get_http_v4_endpoint  async def get_toncenter_client() -> Awaitable[TonCenterClient]:     ton_access_endpoint = await get_http_v4_endpoint()     client = TonCenterClient(         base_url=ton_access_endpoint,         key=''     )     return client

Trassos: Brazilian TON group, anyone? (reply to 25546)

Maksim: can you send me the ton_access_endpoint url?  also i think you should remove “key” argument from TonCenterClient constructor (reply to 30561)

Yuri: Here it's: https://ton.access.orbs.network/55B1c0ff5Bd3F8B62C092Ab4D238bEE463E655B1/1/mainnet/ton-api-v4/ (reply to 30564)

Yuri: Removed key

Maksim: oh v4 is an tonhub api, you cannot use it in TonCenterClient. you better use v2 api (reply to 30565)

Yuri: Gotcha, I was thinking I saw something like it somewhere, but couldn't find again hehe (reply to 30567)

Yuri: Still getting the error though, new url: https://ton.access.orbs.network/44A2c0ff5Bd3F8B62C092Ab4D238bEE463E644A2/1/mainnet/toncenter-api-v2/jsonRPC

Maksim: just import get_http_endpoint instead of  get_http_v4_endpoint and it should work (reply to 30568)

Maksim: remove jsonRPC in the end (reply to 30569)

Yuri: Worked

Yuri: Now getting this: TonTools.Providers.TonCenterClient.GetMethodError: get method get_public_key() for address EQC42TWuPKdUKy2yelqDInLUx7atyap9s7cPIV5LZ82XzKXd exit code is 11

Yuri: I checked the address on tonscan and it has the get_public_key method

Yuri: Ah okay, my mistake

Yuri: It worked like a charm now, thanks guys!

Yuri: I was requesting 'get_public_key()' not 'get_public_key'

fei: Is there a test network in ton?

fei: I can not find it In the Internet

Rami: What's difference between addr_std and addr_var by definition?

&rey: testnet.tonscan.org (reply to 30578)

&rey: addr_std has 8-bit workchain and 256-bit hash part; addr_var may have shortened or extended hash part, that may be useful for other workchains. (reply to 30580)

fei: Does this matter？

Клецка: yes (reply to 30584)

Клецка: this is a different network scanner

Клецка: it is logically seporated from mainnet

fei: How to change to test network?

Клецка: so messages from main net would not be available here

Клецка: to the settings (reply to 30588)

Клецка: click many times on a logo with version

fei: ha, it is really strange 😂

fei: where can I receive the test tokens?

&rey: https://t.me/testgiver_ton_bot (reply to 30593)

fei: Thank you , it works 👍 (reply to 30594)

Maksim: for convenience i just published an update with built-in orbs access. you can find initializing example here (just provide orbs_access=True in TonCenterClient). to update lib run pip install tontools --upgrade  P.s actually this part was done by @Arterialist so thanks to him (reply to 30576)

Barış: hi, i wanna implement pool system like amazon and hepsiburada. I wanna hold tons from customer and when customer acceps transaction send money to other side. if customer cancels payment give fee to customer again

Barış: but i dont know how to hold fee as tons in cell. I write boc which holds sender,receiver addresses and fee but i dont know how to transfer it

User<5648419420>: I can help you.

Barış: thank you

Barış: i found only one transfer example it is below

Barış: await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",         value: "0.05", // 0.05 TON         body: "Hello", // optional comment         bounce: false,       })     ]   });

&rey: Please check out https://github.com/gobicycle/bicycle. (reply to 30599)

Barış: ok thank you i am checking now

Barakuda03: Привет (reply to 30606)

Barış: hi (reply to 30607)

&rey: Russian chat is @tondev. (reply to 30607)

Barış: btw mylocalton's last version doesnt run without problem on my mac (corei7 model). i tried other version it run perfectly bu that version has v3 wallet types not v4.

Клецка: @pcrafter (reply to 30611)

Daniil: This is not an investing chat (reply to 30618)

F: Read the chat description (reply to 30620)

А: From Russia (reply to 30624)

Alex: Check the latest version (reply to 30610)

Barış: Hi alex i checked v73 and have same error

Barış: You can see in github issues

Rami: Can I get the source code of this: @burgerking2bot?

Rami: * @durgerking2bot (reply to 30631)

Andrew: https://github.com/TheTonpay/Durger-King-2.0 (reply to 30631)

عُبّوِدِيْ 350𝒌 | ✨🇮🇶: Hello, I forgot my toon wallet code, can I get it back?

Андрей: @ton_help_bot (reply to 30634)

Alex: try again with v76 please (reply to 30629)

Barış: still no way (reply to 30638)

Клецка: it is impossible to restore your wallet in any way. you can only pray for it's finding (reply to 30634)

Alex: Thanks, got it. Need to update binaries. Will do it tomorrow. (reply to 30639)

Barış: Ok no problem i pleasure to me

Shinji: Hi, I'm trying to sign a transaction using tonconnect/sdk. According to the document, the boc must be returned after the transaction is signed. But I get a simple string "ok". I tested MytonWallet and Tonkeeper. Both have the same problem. Anyone have any ideas?

— 2023-07-02 —

&rey: Write down every word you remember, as that can ease up your wallet mining if you ever choose to bruteforce mnemonics to it. (reply to 30634)

Alex: MyLocalTon TON binaries were updated to v2023.06. Now it should work for you. (reply to 30642)

Андрей: Can ton sites' dht work as a network balancer if the same keys are being used by different IPs?

&rey: Probably you will be unable to start proxy on second server, or it will overwrite IP in DHT so all requests are directed to a single server. (not sure, though). (reply to 30646)

Vladimir: Hi guys! Lesson3 on the development of smart contracts on Tact is ready 🔥 Next topic - Messages Between Contracts, Throwing Errors

Puria: Hey guys How can I calculate my transaction gas fee?

Клецка: @pcrafter

Клецка: btw. What's happening with this chat? why is it so many spam came?

— 2023-07-03 —

Jeff: You can use printTransactionFees. (reply to 30650)

Jeff: btw, it's really useful, but not mentioned in the sandbox docs.

User<5862381782>: 😇

brian: I know that I can use dump for int value, ~dump(3); .  How can I use this for other type?  when I use ~dump("hi") It show weird logs  #DEBUG#: s0 = CS{Cell{04fe8d0867f9999999999999999999999999999999999999999999999999999999999999999cfe20308d0867f9999999999999999999999999999999999999999999999999999999999999999cfe2030f842fe20308b268698fe2030f84289c705b3f2e1a2708040f84282103c7be6f7f843f84df85010671056db3c70f8438ae4} bits: 676..692; refs: 0..0}

Yuri: Hey guys, question about ton-core in JS/TS: When I use provider.internal to send internal messages via my wallet. Does it always send an external message with op = 0 to the wallet contract? Can I change this op to 1 or 2, or will I need to use provider.external and build this logic myself?

Jeff: You can use ~strdump https://docs.ton.org/develop/func/builtins#dump-string (reply to 30660)

Dmitry | backend4you.ton: Internal messages can be sent only by contracts “inside” blockchain. To initiate such action “externally” you should send external message to your wallet with required internal message in reference. Your wallet receives external, verifies sig and seqno and then extracts reference and sends it (reply to 30661)

Dmitry | backend4you.ton: Usually wallets do not care about op code in external message, but better inspect source code for your wallet version

Yuri: WalletV4 matters, op code 0 is just to forward the payload, from 1 begins the plugin logic

Yuri: Thanks!

Behrang: Why totalFees doesn't match the sum of other fees? (reply to 30657)

Behrang: Also I think one missing column is storage fees.

Daniil: why do you need it? (reply to 30668)

Barış: hi, i have 2 questions. 1. can i create wallet from func and can i send money from func?

Dmitry | backend4you.ton: Both “yes” (reply to 30670)

&rey: By "from FunC", do you mean "from smart-contract"? (reply to 30670)

Barış: i mean i want to create wallet and get fee from customer. if user complete process send that fee from that wallet to other wallet, if user cancels process send that fee to customers wallet

&rey: That's usually done with plugins. (reply to 30673)

Barış: i create nodejs server it handles that but when i use it there is no chance to use func, i wanna use func so thats why i asked that question

&rey: It seems that you do not need to create regular wallets from FunC for that task. (reply to 30673)

Barış: yep

Barış: hımm

Barış: so how can achive task with func

Barış: any examples?

&rey: I highly recommend you to use Tact, as it's more suitable for beginners. (reply to 30679)

Barış: someone sent bicycle example i think it uses same outside server solution

Barış: ok i will dig into tact

Barış: thank you

&rey: See https://github.com/ton-core/tact/blob/main/stdlib/libs/jetton/master.tact for example. (reply to 30683)

Daniil: Are you sure that it is a problem for you? (reply to 30682)

Barış: no it is not, i wanna learn func deeply

Barış: thats why i asked

Barış: i think tact is also like ts/js

Barış: i achieve this with them

&rey: By mastering this example in Tact, you will both achieve understanding on logical level and be able to see the generated FunC code.

Behrang: I thought maybe totalFees is including storageFee.   Also, I think the three sections of fees in TON are compute fees, forward fees, and storage fees. So a table may include all 3 parts to be complete. (reply to 30669)

Daniil: Storage fees are so small, especially in case with tests, when everything happens in a matter of seconds.  Also they won't be stable from one run to another. It's much more important to look at compute fees and forward fees. (reply to 30692)

Behrang: Ok, I agree. What about totalFees? (reply to 30693)

Behrang: About storageFees I think they're still useful in some cases. For example if I simulate a long time passes, then storage fees become more significant. In this case if they are accessible through some method, that'd be useful. (reply to 30693)

frlyh: -1:3333333333333333333333333333333333333333333333333333333333333333 Similar to this kind of address, it looks like a very special address, what is it, I see all the time to send and receive messages. Is it a public chain or an official address?

&rey: It is the fundamental smart contract. As far as I remember, that's Elector — smart contract that elects TON validators. (reply to 30696)

frlyh: ok

TON Answers Bot (not AI): Linux Command-Line CLI Wallet from Michael  Hi there, I am looking for a linux command-line wallet for Toncoin. Is there already such a project or is the there an SDK/Whitepapper to implement it myself. I am looking for limited functionality. Similair to the tpay wallet (where did this wallet go) but for the CLI. I like the to drive the wallet with script/bash and/or external apps. Electrum (BTC & LTC) cli wallet opened up a lot of functionality this way.   This call for action comes after experience today with MyTonWallet. MyTonWallet does not have a verified release on Github, not does it provide hashes and worse, it updates its own AppImage without asking the user. Atomic Wallet got hacked the same way. Seems no lessons learned from the Electrum exploit.   I am anal on security, have some time, commited to Ton, but please, lets provide a high security (cold) wallet that is driven by an external app.  🔗 Answer on TON Overflow

mrworks: hey Dev Team help please i need install my own rpc-node with endpint tonapi

Behrang: As stated on https://docs.ton.org/develop/howto/fees-low-level :  in_fwd_fees—fees for importing to blockchain incoming message (it is only relevant for messages which were not previously on-chain, that is, external messages. For ordinary messages from contract to contract this fee is not applicable)  So inForwardFee might be wrong in this table because the first row must be a positive value, and the next 2 must be empty. (reply to 30657)

Afo: Pls add service dex jetton price site or app. i cant see price chart jetton on ton???

Afo: If they can't see the movement of the coins, the buyers won't trade any more.  This causes decentralized exchanges and their liquidity providers to earn less.  Please can someone take a serious look at this issue?

— 2023-07-04 —

Marcos: Hello team, i would like to become a noderunner validaror, i'm new and i'm looking for a docker compose updated and I would like to know in which region my node should run to avoid latency

Howard: Hey, why https://tonscan.org/address/EQDFwpsaP8qV8MuaLcBy2NZA4IgorGGah6DyDvx_PeEDS2al#transactions this address has 1000+ .ton NFT without any Txs before?

User<1345361895>: Xxxxxx

&rey: Because NFTs can be sent without forward_ton_amount and thus without any notification to receiver. (reply to 30705)

&rey: — Do you know that the required stake is at least 300'000 TON? — https://docs.ton.org/participate/run-nodes/full-node — You can use any region, actually: try to choose one where the validators count is insufficient to improve decentralization. (reply to 30704)

Javad: There are 3 methods in wallet contract seqno, wallet_id, get_public_key what are these for ?

Daniil: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#get-methods-in-wallet-v3-and-wallet-v4 (reply to 30710)

Yuri: Hey guys, I'm using raw_reserve (mode 0) before send_raw_message (mode 64). It's returning error code 37 (Not enough TON) because send_raw_message (mode 64) is picking up the balance before raw_reserve (mode 0) occurs. Any recommended workaround?

Andrew: U can use reserve(mode 0) and send message with mode 128 (reply to 30712)

Yuri: Reserved balance doesn't count as remaining balance? (reply to 30714)

Andrew: 👌 (reply to 30715)

User<2060215631>: It's coding? (reply to 30712)

Dev: What percentage of devs are using tact vs. func language now?

Daniil: Most of the devs use FunC, but there were a lot of new Tact projects recently (reply to 30720)

&rey: I use FunC, because Tact has a couple of problems (no native way to iterate over map where keys are Addresses; extremely bad documentation meaning that Tact has a lot of undocumented but existing features; parsing slices into structs with % has gone somewhere). (reply to 30720)

Dev: Ok, for defi projects that need extensive testing I am thinking Func is maybe more mature? If a lot of testing of the project is required?

Daniil: Also FunC allows you to control the way smart contract works on the low level.  But Tact can be a great choice for new devs because it has more common syntax and simplifies many things. (reply to 30722)

Dev: Can code written in Func invoke Tact library or visa versa?

Daniil: You can import FunC functions into Tact (reply to 30725)

&rey: Tact is more suitable for formal verification, though it's transpiled into FunC and cannot have stronger security guarantees. (reply to 30723)

Cocomastoras: What the best practice to store strings via js sdk , i uses storeStringTail but when I want to read the values , all different tails are concated

&rey: Do you need to store several strings in a message? (reply to 30728)

Cocomastoras: beginCell().storeStringTail('This is a title').storeStringTail('This is a subtitle').storeRef(outcome_finals).endCell()

Daniil: You can:  - store them in separate cells as refs  - first store the length of the string and then the string itself (reply to 30728)

Cocomastoras: Do I just store a uint before each the string tail? (reply to 30731)

Cocomastoras: Legend

Cocomastoras: Does it matter the bit length of the uint ?

&rey: The strings are unlikely to be more than 65536 chars length, so you may use 16-bit uint. (reply to 30734)

Art: Hi. Who is not sorry, please transfer some coins to testnet wallet. I'm working on an NFT project and I need about 200 TON for a test mint  kQB9GP68EyHW_ryrqwjmdtbFyjbux-31224eFmKDBC2T-gNw

Клецка: but this is inactive contract (reply to 30736)

Art: I'm sorry, already active (reply to 30737)

Art: @Jab1ch thank you very much. 170 left

nonam3e: Maybe could you make the mint price lower for testnet contract? (reply to 30739)

Art: I'm sorry, I didn't know this could be done (reply to 30740)

nonam3e: You may redeploy it and run tests using the new one (reply to 30741)

Клецка: is it possible to send an external message FROM one contract to another?

Maksim: no (reply to 30743)

Клецка: okay. thanks (reply to 30744)

Maksim: messages between contracts are only internals

Daniil: but you can send an outgoing external message for logs

Cocomastoras: Can telegram wallets connect to apps ?

Cocomastoras: Or should I use tonkeeper?

&rey: As far as I know, no; they are maintained by separate entity, not you. (reply to 30748)

fei: can the bot use telegram wallet to transfer tons to out wallet? (reply to 30748)

Howard: interesting. I thought every NFT should followed the TEP62 that have the Excess for notification (reply to 30708)

&rey: If I remember correctly, excess is usually returned to sender. (reply to 30752)

Cocomastoras: Can I check somehow if an address is active ?

&rey: Offchain? Do an API request. Onchain — there is no way to get the contract state other than try to interact with it, maybe by sending an unbounceable message and noticing its value upon return. (reply to 30754)

Cocomastoras: Offchain

&rey: As far as I know, all major APIs support getting address state (active + balance + code+data).

User<1770742498>: Como faço para começar?

Howard: Hey I think I found a username is listing on Fragment.com but already register

Nick: I've had a bug like that lost username

Nick: Bounced in a wallet with a wrong contract into oblivion unrecoverable

Grubmont: This may not be the best place to ask but are the transaction values visible on Ton chain? I’m guess yes, and if so, what was the rationale behind it?

— 2023-07-05 —

Daniil: That's how almost any non-ZK-based blockchain works. Everything is transparent and verifiable (reply to 30764)

Yuri: Hey guys, getting this when trying to deploy another contract from a master one:

&rey: The message is saying there are insufficient funds. (reply to 30766)

Yuri: Increased to 100 TON, now getting exit 34 (reply to 30767)

Daniil: Can you show the part of code that does the deploy? (reply to 30768)

&rey: "action is invalid or not supported" Is the message serialization valid? (reply to 30768)

Yuri: Might be mistaking something here hehe:

Daniil: the message looks correct. Can you show how do you get state_init? (reply to 30771)

Daniil: and with which sendMode do you send the message?

Yuri: 64 (reply to 30774)

Клецка: try 0 (reply to 30775)

Daniil: 🤔

Yuri: Hmm, think it'll fail no? No ton to pay for gas

̶̛̜̻͒̓͒͋̀̚🇳​​🇪​​🇹​​🇷​​🇺​​🇳​​🇳​​🇪​​🇷​🐉: Hello friends, can some one explain that:   1. If i did deploy the Tact contract from the wallet1  2. Then change the global variables that defined before init( ) using specific recieve method after deploy  3. Then re-deploy the contract from another wallet2 using the same contract code so getting the same contract adress as result  4. Does that affect that global variables by reseting them to deploy values, ot those variables is a part of initial state so the won't be affected after re-deploy from wallet2?

Yuri: exit 37 (reply to 30776)

Daniil: on the second attempt of the deployment, stateInit will be just ignored. Nothing will change. (reply to 30779)

User<5988059446>: EQCXrxjQK8Vx0UWV87MU_Cz5CtN3IBvK5Rg_fx5FiWQ53wld

̶̛̜̻͒̓͒͋̀̚🇳​​🇪​​🇹​​🇷​​🇺​​🇳​​🇳​​🇪​​🇷​🐉: But those variables is defined before init(), are they a part of initialstate anyway? (reply to 30781)

Daniil: the thing is that any "deployment" attempt won't change anything if the contract is already active. (reply to 30783)

Клецка: did you tried to deploy contract with Sandbox or Nujan IDE? Maybe an issue is in the code itself (reply to 30780)

Yuri: It compiles successfully (reply to 30785)

Клецка: does it being deployed successfully and can you communicate with it? (reply to 30786)

Yuri: Let me check (reply to 30787)

̶̛̜̻͒̓͒͋̀̚🇳​​🇪​​🇹​​🇷​​🇺​​🇳​​🇳​​🇪​​🇷​🐉: Thanks! (reply to 30784)

Yuri: I could deploy it and initialize successfully (reply to 30787)

&rey: You have skipped 1 bits here. (reply to 30773)

&rey: The simplest way is begin_cell().store_uint(0, 2).store_dict(code).store_dict(data).store_uint(0, 1).end_cell() Or begin_cell().store_uint(6, 5).store_ref(code).store_ref(data).end_cell().

Yuri: I see! let me try (reply to 30793)

Yuri: still error: (reply to 30793)

Yuri: I think it's weird that number after "need"

&rey: Is the address calculation correct?

&rey: The workchain is 8 bits. (reply to 30799)

Yuri: Nice

Yuri: let me check

&rey: And it is signed int.

Yuri: Like this? (reply to 30803)

Yuri: Worked, thanks!

Dima: Hi, folks, maybe you can help us solve a little problem:   Here is the function of our contract: https://github.com/XP-NETWORK/xp-the-open-network/blob/main/func/bridge.func#L262-L294  It adds a contract to the whitelist (trusted contracts to interact with)  This contract was successfully whitelisted: EQDdHcT8TmBXKwXWCxr4ukut_q8Kq7sh_W_VAEApSCYZ2-7J  However, whitelisting of this one FAILS: EQAG2BH0JlmFkbMrLEnyn2bIITaOSssd4WdisE4BdFMkZbir  What are we doing wrong?

User<5903536486>: and,  a vesting wallet toolkit has been developed, which will be useful for working teams. i also want to know more about this.

Jeff: Hello, how can I load or store coins in dict?

K: Hey guys, does you all think if it’s possible to have a IoT System connect to the TON network?  The IoT system will be used to collect data as an input and calculate the respective reward should be given to the user?

K: The idea is have a IoT Smart Recycle Bin,  user will bring their segregated waste and throw into the bin, then the smart bin is equip with a weighing system that connected to TON Networks.

Dmitry | backend4you.ton: And this bin pays to user depending on amount of waste? Cool! Tell me where first bin will reside and i'll put some dumbbells into plastic section :) (reply to 30811)

Dmitry | backend4you.ton: /report (reply to 30812)

&rey: Yes, it's possible. You will probably need some microcontroller like Raspberry Pi connected to Internet; cryptography and interaction with TON is not too hard for it. (reply to 30810)

&rey: For storing, you can use dict~???dict_set_builder(key_len, key, begin_cell().store_coins(a)); For loading, just load the slice at key and ~load_coins from there. (reply to 30809)

Steven: hello

Steven: I want to build a Ton test network node, is there any tutorial?

K: Thanks for your feedback. That sounds good. So each of the facilities (IoT Smart Bin) will equip with one microcontroller and it’s program to have a interaction with TON. (reply to 30816)

K: I intend to make the IoT Smart Bin as a NFT. The idea is tied up the Physical Asset (IoT Bin) with Digital Asset (NFT). So user can own the NFT as an investment. And all the waste that collected through the IoT Smart Bin will be generate income, then the NFT owner will able to get revenue through the Bin.

Steven: I want to contribute to the Ton ecosystem and launch a dapp, but I need to know how to build it now, and I haven't seen the corresponding testnet node documentation

K: Just read your message carefully. LOL That’s the problem that I need to solve for this idea. People can easily cheat the system. (reply to 30814)

Steven: hello

Steven: This place is missing the file objectsdb.conf, and I downloaded arm64, why do these two cries need x86——64h

Steven: So，who can give me a answer？

Steven: 。。。。。

max💵: Redefined

Alex: It looks like you are running arm64 version on x86-64, or vice versa. Please check. (reply to 30827)

Barakuda03: Ou (reply to 30833)

Alex: What linux do you have, architecture, kernel? (reply to 30830)

Eugene: Hi all We are looking for a FunC developer for our project If you are interested write to @mitagmio

— 2023-07-06 —

Steven: I downloaded it through the link, and all kinds of wen jian are missing (reply to 30833)

Jeff: Worked. Thnaks! (reply to 30817)

User<6145871916>: How make deterministic wallet from 24 words in python?

&rey: tonsdk.contract.wallet.Wallets['v?r?'].from_mnemonic (reply to 30844)

Javad: Hello i read document about wallet contracts, there is seqno which every time it's increase and user must send seqno and we have valid_until to prevent send old transaction i know both seqno and valid_until is useful but can you explain more practical ? i want to know seqno and valid_until in other scenarios which can help me to understand better

User<6145871916>: Where input 24 words? (reply to 30845)

User<5818417486>: Oye

&rey: Please read the documentation. (reply to 30847)

User<6145871916>: Link please (reply to 30849)

Alex: This course should be helpful https://www.youtube.com/playlist?list=PLtUBO1QNEKws7aIXxVjhE8y2gJEPlIiwJ.  + https://github.com/tonfactory/tonsdk - tonsdk docs (reply to 30850)

Sina: A general overview of  🔠🔠🔠   1️⃣0️⃣  🔠🅰️🔠🔠🔠 ❗️   Give it a view!  Website | Blog  | Twitter (forwarded from TonRadar)

Tim: Looks like spam, chill your emojis (reply to 30852)

Yuri: Hey guys, does the implementation of TreasuryContract on @ton-community/sandbox support plugins?

Daniil: No it doesn't. TreasuryContract isn't just a regular WalletV4. Instead, it is contract optimised for many transfers in Sandbox. (reply to 30854)

Язон: can I change owner in wallet v4 contract.  I want to buy one address (words), can I secure it afterwords?

Daniil: No you can't. What's the point of buying a wallet, by the way? (reply to 30856)

Язон: it has ...-ton on the end =) (reply to 30857)

Daniil: you can generate such address in a matter of seconds using this tool: https://github.com/ton-community/vanity-contract (reply to 30858)

Daniil: But note that Address reform will happen soon and the addresses will probably change.

Язон: o? i'l try, thanks (reply to 30859)

Yuri: What would you suggest? Maybe write deploy a WalletV4 (copy code from somewhere) and write the WalletV4 wrapper (using provider.external)? (reply to 30855)

Daniil: There is a wrapper for walletv4 already in ton library. But I'm not sure if it supports plugins out of the box. (reply to 30862)

User<6145871916>: how to create a child wallet? like bip44

Dmitry | backend4you.ton: It's a bit unclear - is price decreasing (as chart says) or increasing (as Price 7d says)? (reply to 15839)

&rey: The cryptography required for that is not currently supported. (reply to 30864)

Dynamic: Hey guys, i have this steps counting bot and i wanna use TON to reward them, never used it before, if sm1 can give me a roadmap on how to do so (i use python) Thanks

— 2023-07-07 —

ninja: You can get data from watch APIs or fitness apps (reply to 30868)

&rey: 0. You need to invent an unexploitable scheme that will not allow user to get TON for free (by wearing several smart watches, for example). There are two alternatives: a. (using CryptoBot) a.1. You need to create a Telegram bot that has chat with user. a.2. When you receive step counting data, your bot creates a CryptoBot check via API and sends it to the user. b. (non-custodial way) b.1. You need to get user's TON address if he has one. b.2. You need to create a wallet for your bot. b.3. When you receive step counting data, you write it in the database. b.4. When the reward amount exceeds 0.5 TON, your bot loads the wallet mnemonic, converts it into keys, retrieves wallet seqno and sends the transaction. (reply to 30868)

Tony 10am-7pm: Hello, how to interact with smart contract from laravel for sending jettons and minting nft

Diako: I was thinking about how can create a mechanism to create private transactions which no one can't find your wallet address like Monero and zcash What do you think ? How can it possible ?

&rey: There are four ZK-SNARK implementations for TON (https://telegra.ph/TVM-Challenge-Projects-06-29) + ring-signature-based pools (https://cleanton.org/whitepaper.pdf). (reply to 30873)

Dario: There is also another way: blind signatures. Cheap, works fine and should work even now on TON mainnet. But not trustless (reply to 30874)

&rey: https://github.com/olifanton/ton/blob/main/examples/jettons/mint.php (reply to 30872)

User<6145871916>: Hierarchical key generation. It is possible?

&rey: As far as I know, it requires non-ed25519 cryptography so it's currently possible in testnet only. (reply to 30877)

Tim: https://github.com/ton-core/ton-crypto/blob/master/src/hd/ed25519.ts

Tim: HD keys are just private keys, its just no wallet apps support it

Yuri: Hey guys, can I advance the blockchain time in sandbox?

brian: Hi. what does raw_reserve() do?  I read docs and examples, but I cant understand  https://github.com/EmelyanenkoK/modern_jetton/blob/master/contracts/jetton-wallet.func#L149

Dynamic: I only have the step counting scheme, i already developed it, only the ton part is confusing to me (reply to 30871)

Dynamic: See this is whats confusing b.4. When the reward amount exceeds 0.5 TON, your bot loads the wallet mnemonic, converts it into keys, retrieves wallet seqno and sends the transaction. (reply to 30871)

Javad: How the TON coin transfer works ? i read about jetton and wallet contract but i want to more know about how the native coin transfer and where store the balance of contracts ? as i know contracts are the smallest peace of TON, but how the ton coin works ?

&rey: https://docs.ton.org/learn/docs (reply to 30886)

Javad: Thank you I am looking for what is happening logically, What part of the document should I read? (reply to 30887)

&rey: The full "TON Whitepaper" document. (reply to 30888)

Javad: And I think it is not a good question to ask which part of the white paper should I read ? 😅 My English is not very good, it's a little difficult for the same white paper (reply to 30889)

Javad: Okay, i going to read Whitepaper

Javad: 👍

&rey: You can skip sections 2 and 5, all other ones contain important or interesting information. (reply to 30890)

Daniil: I talked with this person @HoserVinne in DM and he's not senior (or even not developer at all). He wasn't able to answer simple questions about TON, was hiding his GitHub and main Telegram account for some reason.  I just blocked him in this chat. If anybody needs some proofs (screenshots of our dialogue and some forwarded messages), you can write me in DM.

User<6152668783>: @everyone, I have a question. Is there any api to show the historical price chart on TON network?

Язон: You can use API of any exchange TON is trading on. Or you can use CMC API https://coinmarketcap.com/api/documentation/v1/ (reply to 30899)

Язон: precise https://coinmarketcap.com/api/documentation/v1/#operation/getV1ExchangeQuotesHistorical

User<6152668783>: thanks, could you share me the source code to draw the price chart? (reply to 30905)

Язон: I don't have one. You can use https://echarts.apache.org/examples/en/editor.html?c=candlestick-simple (reply to 30906)

User<6152668783>: thank you, bro (reply to 30907)

Язон: you are wellcome

Dynamic: Hey, sm1 knows how do i deposite free TON on CryptoTestBot, thanks

— 2023-07-08 —

User<6288860111>: Me equivoqué por favor eliminar bloqueado (reply to 26379)

Yuri: Up (reply to 30881)

Javad: according to white paper :  1- "New cryptocurrencies can be added by special transactions in the masterchain", what does special transactions mean ?   2- "Each workchain has a basic cryptocurrency, and can have several additional cryptocurrencies.", can you explain more about "additional cryptocurrencies" ?

Daniil: https://docs.ton.org/develop/dapps/defi/coins#extra-currencies (reply to 30918)

Javad: He gave a very brief explanation (reply to 30919)

Daniil: 1. To create an extra currency, validators will need to vote for its addition into Blockchain config. 2. You can read about it on the docs page I sent above (reply to 30918)

Yuri: Hey guys, I'm trying to deploy a contract on testnet using mobile tonkeeper and blueprint

Yuri: The thing is, I scanned the QR code

Yuri: But closed the transaction approved by mistake

Yuri: After I try the process again, the QR code doesn't appear anymore, since it says my wallet is connected

Yuri: But the transaction for me to approve doesn't appear again in tonkeeper

Yuri: Hey, could disconnect by deleting the app on ton keeper browser.

Jérôme: Hello guys. I'm trying to make an nft mint on TON.

Dev: how about naming of this basic cryptocurrency of the workchain?  is this configurable? (reply to 30918)

Barakuda03: Hello guys. I'm trying to make an nft mint on TON. (reply to 30923)

Jérôme: :) (reply to 30933)

Jérôme: Any guidance/ existing repository to recommend? (reply to 30930)

Jakaria: Introducing TonStat – a new tool for analyzing TON Blockchain.  The First Stage Labs team has launched TonStat, an analytical service that allows users to easily monitor key metrics on The Open Network (TON).  TonStat tracks various indicators, including the number of registered network addresses and wallets, the volume of Toncoin burned or staked, the number of NFTs issued, the amount of validators and several other important metrics.  The project will be continuously developed and updated with new charts. First Stage Labs aims to provide a comprehensive description of all the processes taking place on the blockchain, enabling users to independently assess the development dynamics of each ecosystem segment.  The TonStat website is able to display timely and accurate data thanks to the efforts of the TonAPI team. (forwarded from TON Community)

Огурчік: Hi, how can i get transaction by hash and wallet using API? i need something like filter?  because if i use: curl -X 'GET' 'https://toncenter.com/api/v2/getTransactions?address=<wallet>&limit=1&hash=rNgWORJxIHLqZq9PPeA/Sj8bll54bu2Lni44y4BaESg='  this does not work

— 2023-07-09 —

Ahmet Said: how can i reach author of the bridge contract deployed on ethereum main net ? https://etherscan.io/token/0x582d872a1b094fc48f5de31d3b73f2d9be47def1#readContract

Клецка: i don't really know much about etherium. but you can try to look at the first transaction which deployed contract and see the sender (reply to 30943)

Anton: Hi, TON Testnet API Bot is not working?

Howard: you mean API or test-net token BOT (reply to 30946)

Anton: API bot (reply to 30947)

Howard: I am ok from my code

Howard: const client = new TonClient4({         // endpoint: "https://mainnet-v4.tonhubapi.com",         endpoint: "https://sandbox-v4.tonhubapi.com",     }); (reply to 30949)

Anton: thanks (reply to 30951)

Уладзіслаў: How do I check if the user is the owner of the ton wallet on a centralized server? Do I correctly understand the algorithm, that I should give the user some data, he will encrypt them with his private key, send them to me and if I could decrypt them with his public key, then the user is the owner?

Tony 10am-7pm: Hi looking to hire a TON developer for a project

Tony 10am-7pm: Is there a specific directory i can find for developers or just posting here is enough?

Daniil: You can try applying your company on jobs.ton.org to hire people, but I'm not sure about their requirements.  There are also some third-party freelance platforms on TON (like ratelance) but they aren't very popular currently.  Usually people just write here. (reply to 30955)

Rami: You can find more information about EdDSA at this link: https://en.wikipedia.org/wiki/EdDSA.  Additionally, for further details on public-key cryptography, you can visit this page: https://en.wikipedia.org/wiki/Public-key_cryptography.  To sign and verify messages in TON, you can utilize Tonhub: https://developers.tonhub.com/docs/tonhub-local-connector. (reply to 30953)

Уладзіслаў: thanks! (reply to 30957)

User<6288860111>: Recibí (reply to 30957)

Howard: will it possbile to see the code of this? https://t.me/toncoin_chat/116953

— 2023-07-10 —

Tony 10am-7pm: Thank you (reply to 30956)

Tony 10am-7pm: Hi looking to hire a TON developer for a project.  1. NFT minting contract  (lazy mint with my own jetton instead of TON) 2. NFT staking contract  ( stake nft into project wallet address)  i want to do an NFT project  it will have a website where user pay the smart contract my JETTONS coin. Then he will be able to mint one NFT after the button is clicked.  Then another button for user to stake the NFT back to my ownership, then a button to unstake.  Language i'm not sure if you can use ton-solidity or FunC or TS  Looking for someone with loads of experience shipping in TON network

&rey: Please describe the project (at least its kind: DEX? marketplace? etc), language (FunC/Tact/Rift/ton-solidity/TVM assembly) and the level of developers you need. (reply to 30964)

Tony 10am-7pm: Edited, thank you (reply to 30965)

Doctor Delpy: Why does this address show up as unknown in tonscan? All necessary Get-methods are present in the contract and other explorers display the collection correctly. This is NFT Collection TEP-62  EQBPBVRXgHcmtcl7PUMCIbXUDVhaYxbwsk1HW4GQScuITsmy

TON Answers Bot (not AI): Bitwise operation does not work as expected from No Name  I found a strange behavior in func bitwise operation. I don't understand why.  slice slice0 = begin_cell().store_coins(123).end_cell().begin_parse();  int result0 = 0 == 1; ~dump(result0); ;; this is 0  int result1 = equal_slices(slice0, slice0); ~dump(result1); ;; this is -1  ~dump(result0 | result1); ;; this is -1, as expected   In above code, OR operation is working as expected. However, it does not in below code.  ~dump(0 == 1); ;; this is 0 ~dump(equal_slices(slice0, slice0)); ;; this is -1 ~dump(0 == 1 | equal_slices(slice0, slice0)); ;; this is 0. Why?     🔗 Answer on TON Overflow

User<6121458565>: 17c37ce9d8ea464a9433083592dacd8f (reply to 30968)

Daniil: because of priorities of operations. (reply to 30968)

User<5620173894>: good evening🫥🫥

Andrew: TonSdk.NET: A new SDK for TON Blockchain  We're thrilled to introduce TonSdk.NET - our significant addition to the tooling ecosystem of TON Blockchain.  🎯 TonSdk.Core: TonSdk.Core provides a native implementation Bag of Cells for .NET, handy classes for dealing with addresses and tokens, and support for popular structures in TON.  🔌 TonSdk.Client: TonSdk.Client is a wrapper for the JRPC TonCenter API, enabling data fetching and interaction with TON Blockchain.  📝 TonSdk.Contracts: TonSdk.Contracts provides interfaces for interacting with wallet and token contracts, along with TON DNS management functionalities.  What's more, TonSdk.NET can be successfully used in Unity development, making it an even more versatile tool. (forwarded from Continuation Team)

— 2023-07-11 —

Rami: Is a pubkey the same as an address?

Dario: No (reply to 30980)

Rami: Then can I derive a public key from an address? (reply to 30981)

&rey: No, unless the contract is deployed. (reply to 30982)

&rey: Contract address is hash of StateInit; for wallets StateInit contains the public key as one of the parts.

&rey: The hash function is not reversible.

Yuri: Hey guys, do we have a updated documentation for TON Storage and TON Sites?

Rami: How exactly can I extract the pubkey from StateInit? Are there specific bytes or a particular algorithm that I need to use? (reply to 30984)

&rey: Invoke get_public_key get-method on contract, because different wallets have pubkey in different places. (reply to 30987)

Dima: Hello there, what is the best way to check the submitted trx status from web-app without infinite loops and seqno/trx hash comparisons?

Andrew: if you need it for handling payments, use a ready-made solution - https://github.com/TheTonpay/tonpay-js-sdk (reply to 30989)

Dima: Ty, yes, it is for handling payments.   Do you know how to integrate that invoice abstraction and isPaid() status check with TONConnect ui? (reply to 30990)

Andrew: I can help you with the integration in dm (reply to 30991)

Dima: kk

User<6247944943>: https://github.com/a16z/halmos   What do you think about this? Do we need more test modules in TON? (forwarded from User<6247944943>)

sdw: Hello I am trying to use runMethod method for a smart contract method with the following format _ get_member_balance(slice address) method_id {  I am not quite  sure how to convert to slice and how actually call that method. Anyone could guide me?

Dmitry | backend4you.ton: your SDK should have something like CellBuilder and some method like StoreAddr or SaveAddresStd (reply to 30995)

sdw: That is correct something like beginCell().storeAddress and how can you construct the following:   TonClient.runMethod(Address), 'method', TupleItem); (reply to 30996)

Victor: Hello guys! I was looking over the whitepaper and came across this part. Only workchain 0 can run smart contracts?

nonam3e: No, also you may init them using masterchain. But the gas costs more in the masterchain (reply to 30999)

Victor: So i init them in masterchain and then can use them jn basechain?

&rey: The contract functions once it's deployed. You can deploy contracts in any existing workchain — that is, currently in basic workchain (0) and masterchain (-1), both of which use TVM (TON Virtual Machine).

&rey: To deploy the contract, you send it a message containing StateInit — initial code and data. The message may be internal (from other contract, e.g. wallet) or external (from outside of blockchain; in this case the contract address needs to have some money first).

Brave: Somebody knows why int index there?  My idea: it's somehow from 3rd https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#get-methods-1

Alireza: the highlighted part is actually for get_nft_data() but I guess it works here too (reply to 31004)

Yoyo: I am using tonkeeper deeplinks and I want it to automatically  quit after confirming the transaction, I couldn't find any information in the docs but I saw getGems did it, how can I do it?

sdw: Hello I am trying to use runMethod method for a smart contract method with the following format _ get_member_balance(slice address) method_id {  I am not quite  sure how to convert to slice and how actually call that method using typescript. Anyone could guide me?

jessez: which ton lib are u using? (reply to 31009)

— 2023-07-12 —

User<6247944943>: This is the function that help fetch specific NFT item content based on IndexID, aka ID in Ethereum.    You should check the question in answers.ton.org as well. (reply to 31004)

Hakiem: i think you have to store the input params as a TupleItem then call client.runMethod(contract_address, "get_member_balance", inputParamsTupleItem)  not sure how to convert address to slice tho (reply to 31009)

Howard: Great question! I assume you're asking about the code in FunC and also the way to fetch SmartContract data through this FunC code in TypeScript. If that's the case, here is the solution:  1/ Make sure it's a get method. Notice that methods in the interface class that call getters must start with the word get. This prefix is a requirement of the TON TypeScript library.  The slice you're referring to in _ get_member_balance(slice address) method_id { is a data format used at the FunC level.   2/ To read this get_method function in FunC with TypeScript code, you just need to provide an Address data type for it.   You can check the tutorial here: https://ton-community.github.io/tutorials/02-contract/ (reply to 31009)

Brave: But index not used in it. If I’m not mistaken (reply to 31011)

Daniil: It may not be required in this exact implementation of NFT. But anyway, you need invididual_content, so you won't be able to call that get-method without knowing the index of NFT. (reply to 31014)

ninja: is there any way to install telegram in simulator? The ipa in the github releases is not being installed.

Swaroop: Hello there, I have a question that How can I get TON chain details? I'm trying to add TON into thirdweb sdk same as typical EVM chain. I need props like these:   export declare const Ethereum: {   readonly name: 'The Open Network'   readonly chain: 'TON'   readonly icon: {     readonly url: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png?1670498136'     readonly height: 512     readonly width: 512     readonly format: 'png'   }   readonly rpc: readonly [     'https://ethereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}',     'https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}',     'https://mainnet.infura.io/v3/${INFURA_API_KEY}',     'wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}',     'https://api.mycryptoapi.com/eth',     'https://cloudflare-eth.com',     'https://ethereum.publicnode.com'   ]   readonly features: readonly [     {       readonly name: 'EIP1559'     },     {       readonly name: 'EIP155'     }   ]   readonly faucets: readonly []   readonly nativeCurrency: {     readonly name: 'Ether'     readonly symbol: 'ETH'     readonly decimals: 18   }   readonly infoURL: 'https://ethereum.org'   readonly shortName: 'eth'   readonly chainId: 1   readonly networkId: 1   readonly slip44: 60   readonly ens: {     readonly registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'   }   readonly explorers: readonly [     {       readonly name: 'etherscan'       readonly url: 'https://etherscan.io'       readonly standard: 'EIP3091'     }   ]   readonly testnet: false   readonly slug: 'ethereum' }

Daniil: TON is not a EVM chain. (reply to 31017)

Swaroop: Yes I know that, I'm thinking of mapping similiar kind of values, like a server url although if it's not a rpc one

Swaroop: I mean where do I just get whole of props or things to know about the TON blockchain part.

Rami: Try to set the ret parameter to none https://github.com/ton-blockchain/ton-connect/blob/main/bridge.md#universal-link (reply to 31006)

sdw: Hi there does anyone know if there is a testnet support with the Ton Validators https://tonvalidators.org/? thanks in advance

Yoyo: Hi guys! ✋ I am currently building a payment gateway for Crypto, and my first supported coin is TON 🥳  I am currently at a stage where the system can accept payments, and I would like to get feedback from its future users (you) about the checkout process.  It's just 0.01 TON to check it out, and I'll refund the TON to the people who try and make a payment.  Unfortunately, the Telegram wallet (@wallet) is not supported yet, but it works with every other wallet. Please try and send me your opinion; it means the world to me.  https://notrix.yoyoserver.win/public/payment/c19cc42a-b9a9-4d85-a334-c8c9b6bc28b7?userId=tondevs

VIKTOR: It's work

Andrew: check business.thetonpay.app 😁 (reply to 31026)

Yoyo: https://notrix.yoyoserver.win/landing/

&rey: Do you need any help with development? If not, please don't offtop.

Mamtech: hello when i want to run step 8 and 9 in tutorials/01-wallet/ i receive this error:Error: exception in fetch(https://ton.access.orbs.network/mngr/nodes?npm_version=2.3.3): FetchError: request to https://ton.access.orbs.network/mngr/nodes?npm_version=2.3.3 failed, reason: read ECONNRESET     at Nodes.<anonymous> (C:\Users\Mamtech\Newfolder\node_modules\@orbs-network\ton-access\src\nodes.ts:54:13)     at Generator.throw (<anonymous>)     at rejected (C:\Users\Mamtech\Newfolder\node_modules\@orbs-network\ton-access\lib\nodes.js:6:65) what's the problem?

Mamtech: i mean this page step 8 and 9 : https://ton-community.github.io/tutorials/01-wallet/ (reply to 31037)

&rey: ton.access.orbs.network domain is blocked by something, probably your firewall. (reply to 31037)

Rami: Or maybe you're attempting to use a non-existent version, wild guess 😊 (reply to 31039)

Mamtech: i check wallet version. is ok (reply to 31040)

talkol: If you come to the conclusion there’s an issue for you for accessing TonAccess, please contact support here https://t.me/TONAccessSupport

Rami: I just ran step 8, and it seems to be working fine.  Need to install the following packages:   ts-node@10.9.1 Ok to proceed? (y) y balance: 154.281850592 seqno: 21 (reply to 31041)

Rami: node v18.14.1 npm 9.7.1 (reply to 31043)

Rami: Check your internet connection, use a VPN, recreate the step, ... restart your machine 😊 (reply to 31044)

Sukh: I just tried step 8 and it worked fine for me too (reply to 31037)

F: @ton_help_bot (reply to 31024)

amir: Hi

amir: Is there anyone who can make smart contract for an NFT collection to mint it on Getgems?

amir: The collection has 2000 NFTs

Yoyo: Can someone direct me to the TON address checksum function? I want a function to verify if an address is valid.

Daniil: https://docs.ton.org/learn/overviews/addresses#armored-base64-representations  last 2 bytes are crc32 hash of previous 34 bytes (reply to 31051)

Daniil: it's only correct for user-friendly form of addresses

Yoyo: thanks (reply to 31053)

Yoyo: that is a friendly address? (UQDPB7nNWXJ3hNkFy4o9_gPsGqaI0OQjWk2TLM2j3E01okgO) (reply to 31053)

Daniil: yes (reply to 31055)

Yoyo: function makeCRCTable(): number[] {     let c: number;     const crcTable: number[] = [];      for (let n = 0; n < 256; n++) {         c = n;         for (let k = 0; k < 8; k++) {             c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;         }         crcTable[n] = c;     }      return crcTable; }  function crc32(text: string): number {     const crcTable = makeCRCTable();     let crc = 0 ^ -1;      for (let i = 0; i < text.length; i++) {         crc = (crc >>> 8) ^ crcTable[(crc ^ text.charCodeAt(i)) & 0xff];     }      return (crc ^ -1) >>> 0; }  function isAddressValid(address: string): boolean {     const addressChecksum = parseInt(address.slice(-2), 16);     const addressWithoutChecksum = address.slice(0, -2);     const calculatedChecksum = crc32(addressWithoutChecksum);        return calculatedChecksum === addressChecksum;   }  Can you take a look, the crc32 is ok but it still returns false for valid address (reply to 31056)

Daniil: You can just use a library like ton-core that does all checks for you (reply to 31057)

Daniil: there's a function Address.parse('your_address_here')

Yoyo: I want to be light as possible I dont need all of the extra funcunality (reply to 31059)

Yoyo: I'll just read the source code thanks!

Yoyo: turns out its crc16 (reply to 31059)

Daniil: Oh yes, sorry for misinformation. Crc32 is used for opcodes calculation. (reply to 31063)

— 2023-07-13 —

User<6145871916>: *ss*

amir: Hi We're looking for someone who can make a smart contract for minting NFT collection of 2K NFTs on Getgems, you'll be paid well.

Be the Future of Web3: Hi amir, can I dm. We are working on bilding a platform for NFT launchers on TON

Dynamic: Does anyone have CryptoBot API documentation somewhere, their website is down

amir: Hi sure, I'll dm you (reply to 31071)

L.C: hi， i'm look for TON address regular expression ，can someone help？

L.C: EQAxf77X6ud38C0y7Hgwn2xV5mhqNaBv_4QlmJzTcDZyUKW2 ，like this

Daniil: it is base64, but you also should check the last 2 bytes to match crc16 hash of previous 34 bytes. it's not just a simple regex.  use some library like ton-core for JS or pytonlib for python to parse the address. (reply to 31075)

L.C: is there Java SDK？

Victor: Is there any plans for a sql or sql-like (with a decent query API) database? Or is there someone that’s trying to implement such a thing?

Rami: ^[A-Za-z0-9_-]{48}$ (reply to 31075)

Daniil: it doesn't guarantee the correctness of an address (reply to 31081)

&rey: Your service should support TON DNS (with subdomains) as well as base64 ("user-friendly") and hex ("raw") addresses. (reply to 31075)

Behrang: Does anyone know when new TVM will go live on mainnet?

— 2023-07-14 —

Even: hi, how to transfer USDT to TON?

Even: use SDKs

Krugo D: Is there a way to deploy my Jettons contract without having to use CLI?

Dmitry | backend4you.ton: Minter.ton.org (reply to 31089)

Krugo D: Yeah checked that one out but I dont think that one lets you deploy a specific func file. Only preset tokens (reply to 31090)

Dmitry | backend4you.ton: Oh sorry, missed that you want customized one. Try this online IDE https://t.me/tondev_eng/29937 (reply to 31091)

Andrey: We are glad to announce that our PR with TLB language documentation has been accepted. We tried to describe all dark corners of TLB and make it a bit more accessible for all developers.  If anyone has any thoughts on the updated documentation or on our suggestions for improving TLB I'm happy to discuss!  You can read the documentation here:  https://docs.ton.org/develop/data-formats/tl-b-language

Krugo D: Awesome! Checking this one out now thanks (reply to 31092)

User<1519288770>: Does anyone have a legit TON python pip

User<1519288770>: The one on python isn’t working

User<1519288770>: It was made by a guy named ended with punk

nonam3e: Try this pip install git+https://github.com/nonam3e/pytonlib (reply to 31097)

— 2023-07-15 —

Mehran: hi i have a Question

Mehran: What is the number of the main shard of the ton network?

User<1519288770>: any bots for fift programming? around thanks

Mehran: ? (reply to 31103)

Behrang: If you mean "master chain", its id is "-1". (reply to 31103)

Mehran: thanks🌹 (reply to 31106)

Mehran: Should I use the tonweb3 library? (reply to 31106)

Behrang: I don't know tonweb3!  Either of tonweb or ton-core are great choices. (reply to 31108)

Doctor Delpy: Hi all. In blueprint is there already a function to move unix time in the blockchain when testing?

Yoyo: Is there a python lib for managing a TON wallet (singing transactions and issuing them)

&rey: You can sign transactions using tonsdk. (reply to 31121)

&rey: Afterwards, they can be sent using any API — toncenter, ton-access (by Orbs) or tonapi.

TON Answers Bot (not AI): 24 secret words not forward compatible - lost assets! from Michael  In 80%(!) of the cases the 24 secret words generated with the tpay1 wallet generate a different(!) address in newer wallets and dont(!) show wallets assets. In effect lossing access to your wallet! The 24 secret words are NOT a safe & secure way to maintain access to future access to your assets. This has seriously rocked my confidence in the Toncoin and staking. If the 24 secret words are not rock solid, what about the smart contracts?  Is public/private keys that the Atomic Wallet use a more future proof way of storing assets in Toncoin? If there is a safe way, Please point me to technical documents.   🔗 Answer on TON Overflow

TON Answers Bot (not AI): 24 secret words are not forward compatible - lost assets from Michael  Of 80% of 24 secret words generated with tpay wallet can not be used to gain access to your assets when imported in newer wallets. In effect losing access to your assets. (This the second time I post this question. First got deleted. I will expand if this message also does not get deleted)  🔗 Answer on TON Overflow

— 2023-07-16 —

Emilia: I have a question about the burning mechanism. It seems that the Elector smart contract does not send half of network fees to black hole address. Indeed, the burn address supposedly dedicated to burning contains only 321 TON, far from the 12750 burned coins reported by tonstat. The .ton DNS address, which is supposed to contain the frozen TON resulting from the domain purchase contains 5.15 M, again different from the 6.09 M reported by tonstat. I wonder where tonstat (tonapi) gets its data from. Moreover, according to the network config the parameter 5 is the black hole address, however it is not present in the documentation, probably because it is outdated (26/05/23). How it is possible that TON statistics are always mysterious and unreliable?

&rey: Those fees are not actually sent to blackhole address as described in blog article, they are burned in-place. See https://github.com/ton-blockchain/ton/blob/master/validator/impl/collator.cpp#L1402 for reference. (reply to 31129)

Emilia: After the launch of the deflation mechanism, the Elector will send only half of the transaction fees to the validators. Elector will send the remaining 50% to a black hole address, removing the coins from circulation. Are you saying that the article is wrong? I am not familiar with the code, but according to the commit that introduced the burning mechanism, some files have been changed. In particular, a burning address is used at least here and here. Could someone clarify my previous questions about the inconsistency of values? (reply to 31130)

&rey: The article seems wrong in that claim. (reply to 31131)

hello: anyone here uses pytonconnect?

hello: I was trying to connect my script but I am having difficulty getting updates through connector.on_status_change

Yuri: Hey guys, how jetton decimals work/How can I set it?

Yuri: got it

User<6247944943>: is there has TonViewer API group chat we can join to ask questions?

User<6247944943>: https://tonapi.io/ (reply to 31138)

User<6247944943>: looks good, tonapi + TonViewer

User<5641498222>: Hello

User<5641498222>: Who can I contact for a quote?

User<5641498222>: @tolyayanot I sent you a message, could you please read it? you make me very happy

Handsome: BuidL on toN campaign

Клецка: @pcrafter

— 2023-07-17 —

d: Hi @everyone. I am new to TON DEV community. Please let me know if TON Testnet API Bot is working now

Yuri: Hello guys, I'm getting an error while trying to use run_get_method (using TonTools) with a non-empty stack. TonTools.Providers.TonCenterClient.TonCenterClientError: TonCenter failed with error: Validation error: 1 validation error for Request body -> stack -> 0   value is not a valid list (type=type_error.list)

Yuri: Know what it might be?

Howard: heyyy anyone try nft-transfer before on TonKeeper?  To customized the parameters of NFT transfer. 🧐   I think it's can't works.

Howard: I tried this but either my local TonKeeper and mobile can't work

Gunnar: Is it possible to use toncli and/or the python ton module against a network I run locally with mylocalton?   It seems kinda fiddly ... Is this not something people do?

Daniil: Why do you need mylocalton? (reply to 31156)

Gunnar: To play around on my own testnet?

Gunnar: But maybe I don't

Howard: ok, I fixed (reply to 31154)

Howard: There are two types requests. 1) simple like ton://transfer/<destination>?<what you want to transfer> but it doesn't supports NFTs. there is an examplet in documentation but in code implemented only TON and jettons. 2) https://app.tonkeeper.com/v1/txrequest-url/<url to json containing request like https://yourapp.com/request100500.json>  and this json can contains nft-transfer (forwarded from Denis)

Howard: 1) we are going to fix in the future but not very critical task for us (forwarded from Denis)

Howard: 1) you steel can use ton://transfer/<nft-address>?amount=100000000&bin=<boc with transfer message> (forwarded from Denis)

Emilia: I checked the config here and, according to the documentation, I found some strange-looking values: Param 0->The Config->ok Param 1->The Elector->ok Param 2->-1:hex_address->System and 0:hex_address->Burn address->Why? It should only be the System. Param 4->Root DNS->ok Param 5->-1:hex_address->wallet1 and 0:hex_address->wallet2->Why? I cannot understand. Should not it be the burning address? (reply to 31132)

Язон: If 50% of fees are burned, doesn't that mean that all TON will someday burn and net will halt?

Daniil: No, there is also an inflation of around 0.6% for validators (reply to 31166)

Andrew: inflation is way higher than those laughable fee amounts, don't worry (reply to 31166)

Emilia: Validators to maintain the PoS consensus, secure the network and offer additional functions must be rewarded in some way. The possibilities are commissions or inflation. TON has one of the lowest inflations among blockchains at 0.6% or about 30 M coins per year (considering a total supply of 5 G Toncoin). According to the data stated by the message and those of tontech.io, we have respectively 700-800 Toncoins of commissions and 180-200 k transactions per day equal to (800/200 k)=4*10^-3= 4 m Toncoins/transaction. So the breakeven point between issuing and burning at 50% would be reached with 2*30 M/(4 m)=15 G transactions per year or 41.09 M per day or 475.57 transactions per second. By reaching such a level of network usage, which is very low given the prospects of the project, TON tokenomics would become deflationary despite 0.6% inflation and at the same time fully reward validators. (reply to 31166)

sajib: Interview With Narek Abovyan, Head of TonTech at FSL  The TON & Company YouTube channel has released a fresh interview with TonTech team member and TON ecosystem contributor Narek Abovyan.  Narek talked about his fascinating journey in the blockchain industry, his role in Getgems, and his contribution to the creation of TON NFT standards (in particular, the Soulbound standard).   He also talked about the Getgems launch, TonTech’s plans, a collaboration with TON Play, and more.  We recommend watching the interview — it’s available on YouTube. (forwarded from TON Community)

Howard: dude, you had forward this to everywhere (reply to 31170)

— 2023-07-18 —

VIKTOR: this is a promotion bot 😅 (reply to 31171)

Santosh | Wagmi11: gm fam, how do we validate given address is valid TON address or not?

Yuri: up (reply to 31151)

Daniil: Which programming language do you use? (reply to 31173)

botmother: hello guys, is it possible to get a transaction's hash? I'm using tonConnectUI.sendTransaction

botmother: in tonconnect/ui docs they have this code, does anyone know where you can find the myAppExplorerService?  const someTxData = await myAppExplorerService.getTransaction(result.boc);

Howard: https://testnet.toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get (reply to 31173)

Howard: @sedov Hey Dani, there's a tricky question on Answers.ton.org that you should take a look at 😰  https://answers.ton.org/question/1591214158001475584/24-secret-words-not-forward-compatible-lost-assets

nonam3e: It's okay that different wallet versions have different addresses with the same public key. I don't know anything about "future proof" he's talking about, but ecdsa that is used in wallets is infeasible to corrupt right now. It's a problem of wallet apps that they don't provide an option to choose the version of the wallet (reply to 31179)

Howard: How can I check the balance for all the addresses associated with a specific mnemonic?   I've had an experience in the past where I couldn't use the mnemonic I'd written down to restore the original wallet after deleting the TonKeeper wallet. (reply to 31180)

nonam3e: You may try to generate all types of wallet with your public key and check assets for each of computed addresses (reply to 31181)

Daniil: It's @sedov by the way 😅 (reply to 31179)

Howard: 👍🏿😅 (reply to 31183)

Rami: What are you trying to achieve? (reply to 31135)

hello: Nevermind I solved the problem (reply to 31185)

hello: I had not waited for connection

User<6051052285>: Hey guys is there going to be a feature where the commands of bots also change to English?

User<6051052285>: Because that's a huge issue

User<6051052285>: For example the text will translate but I have no idea what my choices are

&rey: This is offtop for this chat. You need to communicate with Telegram or the bot creator. (reply to 31188)

User<6247944943>: Is there any off-chain method that allows me to interact with my TonKeeper wallet without disclosing the private key phrases?  For instance, I want to use a TonKeeper wallet as a vault to store funds while maintaining the flexibility to enable the wallet to transfer funds, such as Jetton, as well as NFTs.  The issue is, if I want to deploy a script that sends transactions, I have to export the private key and incorporate it into the script if I want to manage the wallet automatically.

User<5730850611>: Deneme bonusu alabilir miyim mumkunse

Dmitry | backend4you.ton: Something like TON Connect, where your script/app will request your TonKeeper to sign prepared transaction? (reply to 31193)

User<6247944943>: oh, ok. Is it possible? B/c I think TonKeeper WalletV4 not support with Signing and send the NFT out.

Łukasz: Hi 🙂  I have ```() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     slice address = "any_address"a;      ~dump(address);      send_message(102, address, begin_cell().store_uint(444, 256)); }```  and the   ```() send_message(   int op_number,   slice to_addr,   builder content ) impure {     parse_work_addr(to_addr);    var body = begin_cell()       .store_uint(op_number, 32)       .store_uint(0, 64)       .store_builder(content)   .end_cell();    var msg = begin_cell()     .store_uint(0x10, 6)     .store_slice(to_addr)     .store_coins(100000)     .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_ref(body)   .end_cell();    send_raw_message(msg, send_mode::default()); }```   but after receiving the message nothing happens - the contract doesn't send it to another contract  and also doesn't fail or an exception is thrown.   Do you maybe know why?

Daniil: What's your send_mode::default()  If it equals 0, the problem is in too low value (100000 nanoton = 0.00001 ton which isn't enough to send a message) (reply to 31197)

Daniil: And why is it a function? Consider using constants, for example:  const int send_mode::default = 1;

User<6247944943>: ? (reply to 31196)

Łukasz: I have 0, indeed

&rey: Tonkeeper supports transferring NFTs. (reply to 31196)

Łukasz: I took it from the https://github.com/Gealber/blog_recipes/blob/main/bank_contract/contracts/consts.fc    thanks for the advice - I'll change it (reply to 31200)

User<6247944943>: yes, but how to trigger that (reply to 31203)

Łukasz: thanks, that's it!  but is there any way to debug it, to have returned "insufficient balance" or "fee to low"? (reply to 31199)

Daniil: you can check the full logs of the transaction in some specialized explorer like https://explorer.toncoin.org/  this error occurs in the "action phase". the error code 37 means "not enough ton" (reply to 31206)

Łukasz: ugh 😉

Daniil: exit codes 32-38 are for action phase: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes

Łukasz: thanks!

&rey: Build message body for transferring NFT then do common transfer with that body specified. (reply to 31205)

Rami: To check my account balance, do I need to iterate through transactions from the last block to the origin until I find the one involving my account and extract the corresponding value?

Daniil: No, just check your account balance :) (reply to 31213)

Rami: Where is it stored? (reply to 31214)

Daniil: In the account state. Which tool/library/api do you use to work with TON? (reply to 31215)

Rami: I was looking at some code samples from ton-connect/demo-dapp-backend and came across the following function:  func GetAccountInfo(ctx context.Context, address tongo.AccountID, net *liteapi.Client) (*datatype.AccountInfo, error) {   account, err := net.GetAccountState(ctx, address)   if err != nil {     return nil, err   }   accountInfo := datatype.AccountInfo{     Balance: int64(account.Account.Account.Storage.Balance.Grams),     Status:  string(account.Account.Status()),   }   accountInfo.Address.Raw = address.ToRaw()   accountInfo.Address.Bounceable = address.ToHuman(true, false)   accountInfo.Address.NonBounceable = address.ToHuman(false, false)    return &accountInfo, nil }  And I started wondering where the *liteapi.Client obtains its data from 🤔 (reply to 31216)

Daniil: From the lite servers (basically full nodes) (reply to 31217)

Rami: So, does the lite server keep some kind of hash map with the state of each account? (reply to 31218)

Slava: If you've ever found yourself in a situation where you needed to resolve a newly created promise from the outside and had to do some nasty hacking, then this EcmaScript proposal (proposal-promise-with-resolvers) will definitely make your life happier.  The proposal has reached a Stage 3 last week, this means that the API should be stable and is ready for a real-life testing and evaluation.  The implementation is already in core-js so you can give it a try. (forwarded from JavaScript Best Practices)

Daniil: full nodes do (reply to 31219)

User<5897383164>: Hello everyone

Rami: What is tonlibjson? How is it different from lite-client?

Anak: EQAfyNx78r7c8eNjuHflibLok_BZECaXn7v69U17IwmGp5f1

Alireza: Hi everyone,  I have a problem with importing this: import { getAdnlProxyEndpoint } from "@orbs-network/ton-access";  i checked the package itself, it seems they commented it out. anybody have ideas reagrding this?

SX: Hi there  I have one quetion and that is when Tonkeeper support Hardwallet?

SX: Is there anyway that i can store $TON in my HW?

Tim: mytonwallet supports ledger i think

SX: So can i Transfer my BC Number and NFT from Tonkeeper to Mytonwallet? (reply to 31231)

Tim: you can transfer anything, but that's not what this chat is about

SX: OOO my bad only you can help me thank you in advance (reply to 31233)

SX: didn't find any good well educated ppl for TON except here

SX: Thanks a lot for answering though

— 2023-07-19 —

eric: 有中国的吗

WhiteTEA: https://t.me/tondev_zh (reply to 31237)

Yuri: Hello guys, is there a way to get the contract init code without storing the init code in the contract's storage? I remember a feature of some sort had launch for FunC that made it possible, if I'm not mistaken.

Daniil: what do you mean by "get the contract init code"? (reply to 31239)

Yuri: The one I used to deploy the contract (reply to 31240)

Yuri: If it's upgradeable

Daniil: and where do you need to "get it"? (reply to 31241)

Yuri: wallet contract (reply to 31243)

Yuri: Currently using get_c3

Daniil: and why do you need some other solution? (reply to 31245)

Yuri: In case it's upgradeable, but think it may suffice for now

Daniil: c3 contains the current code of the contract. if you change it after the deployment, c3 will change too. (reply to 31247)

Yuri: I see... I thought I had seem a different solution for that, might be mistaken (reply to 31248)

Yuri: It's fine I think, probably not gonna make it upgradeable hehe

Behrang: I think you're talking about the new TVM instruction called MYCODE:  https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#opcodes-to-work-with-new-c7-values (reply to 31250)

User<6247944943>: Sorry, you mean "Build message body" and send it to the TonKeeper Wallet by external message? (reply to 31211)

&rey: No, I mean either "build message body, create ton://transfer link and show it to user as QR" or "build message body and request Tonkeeper application on user's device to send it, using TON Connect 2". (reply to 31253)

&rey: Generally, you don't send external messages to user's wallet contract because you don't have a way to obtain valid signature.

&rey: Supporting both ways is preferable, because some users may wish not to disclose the wallet app they use, and some will value convenience more. (reply to 31254)

Dmitry | backend4you.ton: Does any "standard" exist for ton/transfer links? I see https://docs.ton.org/develop/get-started-with-ton sample with only two params, and found https://developers.tonhub.com/docs/transfer-link with 5 params with detailed description, but how many wallets beside Tonhub support them? (reply to 31254)

&rey: Almost all wallets I know support that links. (reply to 31257)

&rey: Tonkeeper does.

Dmitry | backend4you.ton: I mean not links itself, but all 5 params (including init and jetton) (reply to 31258)

&rey: I don't know about jetton parameter at all. init is supported everywhere just as well as bin.

Rami: Does td in the main repository stand for telegram datatypes?

Roman: 😎 Calling all brave TON developers! 😎  RPG MODE: ON  Attention, adventurers of the TON realm! Your expertise is needed to enhance the power of TON! This is especially important if you're a new developer. By sharing your development experiences, you can help us make TON even more accessible and mighty! 💪  Starting a project in one evening is a real goal. The TON Onboarding team is on a quest to create a legendary onboarding experience for everyone, whether you're a beginner or a seasoned hero of coding. Together, we can achieve it!  If you have something to share, it's the perfect time! We humbly request all community members to share their development adventures with TON through this survey.  Prepare yourself for an exciting journey through 4 topics, a mere 5-8 minutes of your time!  Ready to embark on this heroic quest? Share your legendary experiences here: 👉 https://agkcv6ne.paperform.co/

Łukasz: Is the https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07 upgrade really available on testnet?  I'm trying to use ECRECOVER but it returns exit status 6 (6 - Invalid opcode. Instruction is unknown in the current TVM version).

Łukasz: and should I define it as:  (int, int, int, int) ecrecover(int hash, int v, int r, int s) asm "ECRECOVER";  ?

Behrang: Hi, I get a very weird error in testnet. Can anyone help me please?  If I use lite-client to connect to testnet, and do getconfig 18 I can see a valid storage prices config similar to mainnet.  But when I use config_param(18) in my get method in a smart contract, it returns null!  Here is the super simple smart contract:  #include "imports/stdlib.fc";  () recv_internal() impure { }  cell get_fees() method_id {     return config_param(18); }

F: lite-client cannot take data from the network config inside contracts tonlibjson can (reply to 31266)

Abolfazl: send me

Behrang: I don't understand. Can you elaborate a little more?  lite-client shows me the config for param 15 which is different from mainnet. (reply to 31267)

F: TVM inside the lite-client is not able to get data from the network configuration. Accordingly, when starting a smart contract, a local TVM is launched and gives an error. If you call a separate command in lite-client (getconfig), then TVM does not start (reply to 31269)

User<6247944943>: great question. But I don't there has the standard for this.   It's a build-in feature for TonKeeper I think. (reply to 31257)

sdw: Hello, my question has mostly to do with TonWhales  Is it possible to withdraw a specific amount from a staking pool making a transaction from your own wallet without Tonhub or TonWhales website. For example for the entire amount you need to send 0.2 TON with a memo 'Withdraw'. Can I do the same and unstake a specific amount?

Behrang: Thank you very much for answering, however, I still don't understand. I may miss something obvious here.  Let me explain the problem.  I wrote this simple code: #include "imports/stdlib.fc";  () recv_internal() impure { }  cell get_fees() method_id {     return config_param(18); }  Which I think should return the storage prices config in testnet. When I deploy it using Blueprint, the get_fees method returns null.   I first thought that the config param 18 is null in testnet. Then I used lite-client to connect to testnet and query the config param. It returned a value similar to mainnet. I checked config param 15 and it returned a different value. So I concluded that config params 15 and 18 are available in testnet.  But now I wonder why the simple code that I presented is not working. (reply to 31270)

User<722988600>: Hello

User<6247944943>: for the (0x05138d91) OwnershipAssigned type of the message:   Why Telegram Username put it as 0.000000001 TON only.

User<722988600>: I want to sell how buy ?

xen: need more tons to pay gas i guess (reply to 31276)

User<6247944943>: How can we alter which wallet is called upon when we use a "ton://,,," link?   Currently, it only triggers MyTonWallet after I install it.   However, I would prefer to use TonKeeper.

Behrang: I deployed the simple code on testnet:  kf-aagBGHVPNYqVDVs2srnj1A-YqkB32XqEhblRpdxd2rLQ6  Then if I run this command in lite-client: runmethod kf-aagBGHVPNYqVDVs2srnj1A-YqkB32XqEhblRpdxd2rLQ6 get_fees  returns this: arguments:  [ 67344 ] result:  [ () ]   and running: getconfig 18  returns this: ConfigParam(18) = (   (hm_edge     label:(hml_same v:0 n:32)     node:(hmn_leaf       value:( utime_since:0 bit_price_ps:1 cell_price_ps:500 mc_bit_price_ps:1000 mc_cell_price_ps:500000))))  x{D06600000000000000000000000080000000000000FA00000000000001F4000000000003D0904_} (reply to 31273)

TON Answers Bot (not AI): ECRECOVER from Łukasz Kalbarczyk  Is the https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07 upgrade really available on testnet?  I'm trying to use ECRECOVER but it returns exit status 6 (6 - Invalid opcode. Instruction is unknown in the current TVM version).  and should I define it as:  (int, int, int, int) ecrecover(int hash, int v, int r, int s) asm "ECRECOVER";  ?  🔗 Answer on TON Overflow

Behrang: I think I got your point.   I used testnet.ton.cx and the get methods there worked correctly.  So it seems that Blueprint is also using lite-client (right?), which is unable to access network configs in TVM.  So everything is correct and this weird behavior is from lite-client. (reply to 31270)

Cocomastoras: Any Python sdks for deploying contracts and interacting with them ?

Maksim: you can check this   https://youtube.com/playlist?list=PLtUBO1QNEKws7aIXxVjhE8y2gJEPlIiwJ (reply to 31282)

Alireza: Search for Rift (reply to 31282)

User<722988600>: Yes i know my sister can you help me i need 0.30 ton😊 (reply to 31277)

xen: sent (reply to 31286)

Hunter: hello, I am a frontend developer looking for an open position now

Hunter: Feel free to dm me if you are interested in me.

User<722988600>: Thank you 😊💚🌺🌺🌺🌺🌺 (reply to 31287)

Behrang: I also tested with tonlib and it worked. Thanks. (reply to 31267)

&rey: As far as I know, you can only unstake the whole sum (because unstaking maintains a queue if there are insufficient funds). (reply to 31272)

&rey: The upgrade is available on testnet. Could you share the contract address, please? If you haven't deployed the contract and are testing it offchain (via Blueprint/something similar), you need a specific version supporting new opcodes. (reply to 31264)

&rey: Not quite. There are two possible results: a b c -1 or 0. You need to create three null`s in the latter case. This is `asm "ECRECOVER NULLSWAPIFNOT NULLSWAPIFNOT2". (reply to 31265)

Gulolio: As a personal advice given that I was the one who wrote this 🙂, take everything on my blog with a grain of salt. For the simple reason that I write my blog to learn, so code that you find there for sure is not high quality. (reply to 31204)

Gulolio: One question guys, reading the doc for generating random numbers, this specific article, I see there's a note that says as follows:  Please note that this method of generating random numbers isn't safe.  TODO: add link to an article about generating random numbers  My question here, anyone knows about what link is been referred here? Or a "safe" way to generate random numbers?

Daniil: https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation (reply to 31296)

Gulolio: Thanks man👍, you are faster than Flash (reply to 31297)

Daniil: Basically, by only doing randomize_lt(), your random generation can be abused by validators. (reply to 31296)

Frosiva: How can I convert the address starting with "EQ" to the same address that starts with "UQ"? I mean the unbounceable form.

Frosiva: I remember there was a sub domain for ton.org that shows different forms of addresses.

Daniil: ton.org/address

Frosiva: Oh. Thanks. (reply to 31302)

Łukasz: EQC5Jy-mewmkiv69PM-0w9lXoHH5fIbDQDlKqtm4VTNRffAB (reply to 31293)

Łukasz: (int, int, int, int) ecrecover(int hash, int v, int r, int s) asm "ECRECOVER NULLSWAPIFNOT NULLSWAPIFNOT2";  Or the third should I add too :)? (reply to 31294)

User<5818417486>: UQBcyDXou-nNdshTDokrhudNYl9VJCdP4VFCzNoI36u3kmFW

Łukasz: Yes, that's also my Proof of Concept 😉 (reply to 31295)

User: error: undefined function `get_message_number`, defining a global function of unknown type int user_count = get_message_number(in_msg_body);  What can this mistake mean. Function get_message_number stay in the same file.

Max: is it above or below the call site? (reply to 31310)

User: It shows me after I clicked on compile button. (reply to 31311)

User: Here you can see the full error log

Max: is the function below the place where you use it?

User: yes (reply to 31314)

Max: you need to put it above

User: ok, I will try it now, thanks.

User: It work, thank you a lot.

Abolfazl: send

— 2023-07-20 —

Umar: Send me

Sksaidul: Br

Howard: I recommend that you uninstall myTonWallet to restore TonKeeper as your default local wallet.   I encountered a similar issue. If I installed the TonHub wallet after the TonKeeper wallet, the "ton://...." link would only trigger the wallet that I last installed. (reply to 31278)

&rey: You need to do so in your system or browser settings. Probably the item is called "deeplinks". (reply to 31278)

Łukasz: @pcrafter, any idea what's wrong? In the code compiled there are strange symbols ;/ (reply to 31306)

&rey: Do you have latest Asm.fif? (reply to 31324)

Łukasz: good question 🙂 (reply to 31325)

Łukasz: I'm using func-js 0.6.3-tvmbeta.1, maybe that's the reason (but 0.6.2 doesn't compile that)... maybe should I try any command line compiler

&rey: x{F9126FA16FA56C31} seems like incorrectly defined opcode.

&rey: Please don't spam in the chat. (reply to 31334)

Łukasz: for func code compiler i get  `recover PROC:<{   10090803140203886091563240426283255598005902732368756496576720469156907155070 PUSHINT   47520574234967277554402655190042416396654055806875102599635844528129557311962 PUSHINT   7936653582824629768649442058906672831216504652965602974872621088664590375610 PUSHINT   27 PUSHINT   -ROT   ECRECOVER NULLSWAPIFNOT NULLSWAPIFNOT2   3 1 BLKDROP2 }>`  that seems to be ok, but I cannot generate boc, wrr unknown-location: error: Realpath failed for "-W"

Jazil: Does anyone know why TON is avoiding the US market? I feel like for us Devs that is a critical market to win

Jazil: If we want TON to succeed

Inal: Why you think TON avoids us market? (reply to 31339)

Inal: I mean what makes you think TON avoids any markets and what does it mean to “not avoid” in your understanding?

Jazil: Personally it is just harder to buy Toncoin in the US and the wallet feature isn't available (reply to 31341)

Jazil: Ik Telegram has had lawsuit before. So I understand that there is a delay. But I see potential in the TON project so I do think there is a plus to attract US Devs

Howard: 🤔 (reply to 31132)

Howard: Can anyone else check this as well?  @emilia32, your question is, "Why does the burn address (https://tonscan.org/address/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c#transactions), which is supposedly dedicated to burning, only contain 321 TON, far from the 12,750 burned coins as reported by tonstat?" Is that correct?  I think the burn address for each block is not the same as the address you've pasted here. That might be the reason. (reply to 31131)

&rey: 1. this is not dev topic, 2. it seems that there are too strict KYC requirements. (reply to 31339)

Łukasz: I can't compile the proper fift. I even have built the fift and func compilers from source and have taken the crypto/fift/lib but still,   [ 1][t 0][2023-07-20 10:43:32.421392][Fift.cpp:67] top: <continuation 0x60000132d800> level 1: <continuation 0x60000132d830> level 2: <text interpreter continuation> [ 1][t 0][2023-07-20 10:43:32.421412][fift-main.cpp:204] Error interpreting file `adapter.fif`: adapter.fif:212: ECRECOVER:-?   So sth is wrong. And also Howard did answer:  Nah, the update haven't implement in test-net.  So idk, how to make it working ;/ (reply to 31331)

Łukasz: did someone achieve that ECRECOVER working ;)?

Tim: yes (reply to 31350)

Tim: @sepezho has example i think (reply to 31350)

Łukasz: could you send me ;)?

sepezho: github.com/evaafi/redstone-price-verify (reply to 31353)

Łukasz: Thanks a lot!

sepezho: u r welcome

Łukasz: but, you're using blueprint, yes?

Łukasz: not testnet ;/

sepezho: You mean the testing? (reply to 31357)

Łukasz: no, deploying to tesnet

sepezho: well, if you need to, you can deploy it

sepezho: but this contract is actually quite simple - it just checks the signature from EVM

Łukasz: yes, I know, but after deploying it, the code contains strange symbols, not asms:  https://testnet.tonviewer.com/kQC5Jy-mewmkiv69PM-0w9lXoHH5fIbDQDlKqtm4VTNRfUuL?section=Source+code

sepezho: because this code has been compiled from FunC func -> fift -> bytecode  you can find disassembled btn on the site to se fift code

Łukasz: I'll try to deploy your clean contract

Łukasz: and there are  ...  27 PUSHINT     ROTREV     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31} ...   instead of ECRECOVER ... (reply to 31364)

sepezho: try to rebuild & redeploy contract  npx blueprint build

Łukasz: same as in my example: Error: Unable to execute get method. Got exit_code: 6

Łukasz: (on testnet)

Barakuda03: ...  27 PUSHINT     ROTREV     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31}     x{F9126FA16FA56C31} ... (reply to 31366)

Seitaro: where did you get this error from? If lite-client - it is ok: lite-client doesn't use network config yet and thus ecrecover opcode there won't be active If you are using tonlib - please rebuild from testnet branch (reply to 31368)

Cocomastoras: Is there something wrong when parsing address with Python ton sdk?

Cocomastoras: When using  print(wallet.address.to_string(is_user_friendly=True, is_test_only=True))

Cocomastoras: I don’t get the expected address

Cocomastoras: Fixed

Arti: How I can find bot for chat user activity score?

Łukasz: Thx, I’ll check it soon (reply to 31371)

Cocomastoras: When using TonlibClient on Python how can I connect to testnet

User<6358903550>: Hello everyone

Maksim: provide a testnet config https://docs.ton.org/develop/howto/network-configs (reply to 31378)

Łukasz: at TonClient.runMethod (/node_modules/ton/dist/client/TonClient.js:55:19) (reply to 31371)

Seitaro: it looks like js wrapper around tonlib. In this case you need update libtonlibjson.so from testnet branch (reply to 31382)

Łukasz: I'll check, thx 😉 (reply to 31383)

User<5897383164>: Hello everyone

Rami: Okay, from what I found, tonlibjson seems to be a library for serializing JSON into liteserver queries and vice versa. Can someone confirm this?

Rami: + ADNL client for sending and receiving these queries. (reply to 31387)

Zyxep: Friends, does anyone know about a technique called black magic? About a way to listen to approved transactions from the side of validators, as a trigger

Dmitry | backend4you.ton: you are right. it has its own set of objects/functions (reply to 31387)

Dmitry | backend4you.ton: to be exact - tonlib is a library to talk with liteserver, and tonlibjson is a json wrapper around tonlib

Łukasz: I can't build the testnet branch 😕   Undefined symbols for architecture arm64:   "src::lexem_is_special(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>)", referenced from:       src::Lexem::classify() in lexer.cpp.o   "sym::compute_symbol_subclass(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>)", referenced from:       std::__1::__unique_if<sym::Symbol>::__unique_single std::__1::make_unique[abi:v160004]<sym::Symbol, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>&, int>(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>&, int&&) in symtable.cpp.o ld: symbol(s) not found for architecture arm64

Łukasz: maybe blst should be upgraded 😕

Łukasz: like rocksdb

&rey: https://github.com/ProgramCrafter/ton-validator-modifications, build worked well for me. (reply to 31392)

&rey: (This is unofficial version combining new opcodes and toncli local opcodes.)

Łukasz: checking 😉

Łukasz: same as above 🙁 🙁 (reply to 31396)

Alex: Yes, some libraries became inconsistent, the fix is on away. As a workaround you can build external libraries manually. Like this (adjust the paths if necessary):  brew install automake autogen autoconf libtool texinfo  mkdir tools; cd tools  —— secp256k1  git clone https://github.com/bitcoin-core/secp256k1.git cd secp256k1 git checkout v0.3.2 mkdir build && cd build cmake .. -DSECP256K1_ENABLE_MODULE_RECOVERY=ON make cd ../..  —— libsodium  export LIBSODIUM_FULL_BUILD=1 git clone https://github.com/jedisct1/libsodium.git cd libsodium git checkout 1.0.18 ./autogen.sh ./configure make cd ..  —— openssl  git clone https://github.com/openssl/openssl openssl_1_1_1 cd openssl_1_1_1 git checkout OpenSSL_1_1_1-stable ./Configure --prefix=/usr/local/macos darwin64-arm64-cc no-asm -static -mmacosx-version-min=10.15 make build_libs -j4  cd ton/build  cmake .. -DCMAKE_BUILD_TYPE=Release -DTON_ARCH= -Wno-dev -GNinja -DSODIUM_INCLUDE_DIR=/Users/administrator/tools/libsodium/src/libsodium/include -DSODIUM_LIBRARY_RELEASE=/Users/administrator/tools/libsodium/src/libsodium/.libs/libsodium.dylib -DSECP256K1_LIBRARY=/Users/administrator/tools/secp256k1/build/src/libsecp256k1.dylib -DSECP256K1_INCLUDE_DIR=/Users/administrator/tools/secp256k1/include -DOPENSSL_FOUND=1 -DOPENSSL_INCLUDE_DIR=/Users/administrator/tools/openssl_1_1_1/include -DOPENSSL_CRYPTO_LIBRARY=/Users/administrator/tools/openssl_1_1_1/libcrypto.a (reply to 31393)

Łukasz: kind of magic, now I have func&fift for testnet... still, I'm trying to find where to replace the lib for json (or that's compiled inside :() (reply to 31401)

Łukasz: I'd need to replace funcfiftlib.js funcfiftlib.wasm + funcfiftlib.wasm.js  but how to build it?

Tomite: If you're have a project that needs funding, kindly send a DM.  First 3 requirements for possible funding. - The project solves a real problem. - Has potential to do well in the space. - More than 1 founder.

— 2023-07-21 —

User<6247944943>: which DEXs on TON has lowest trading fee and gas cost?

Hakiem: Hi i'm trying to deploy a contract on testnet but after opening the deploy link tonkeeper just keeps loading and doesnt show the transaction for me to send. anyone face a similar problem before?

Łukasz: Emscripten? (reply to 31403)

JESSIE_CEO: is anyone on here good with smart contracts?

JESSIE_CEO: Details: err: max fee per gas less than block base fee: address 0x, maxFeePerGas: 150000000 baseFee: 16995425957 (supplied gas 15010499) Version: viem@1.2.12

Daniil: is it about ethereum? this chat is TON related. (reply to 31413)

JESSIE_CEO: eth yeah

Daniil: find some Ethereum related chat then.

JESSIE_CEO: ok

Seitaro: Maybe you can use ready ones https://github.com/ton-org/sandbox/tree/tvm-beta/src/executor https://github.com/ton-community/func-js-bin/tree/main/src ? (reply to 31410)

Łukasz: I use these ones from func-js-bin but it doesn't work

Łukasz: the every contract generated and deployed has the strange symbols x{....} instead of asm commands

Łukasz: and the command fails with exit code 6

&rey: Could you use x{E912} @addop instead of ECRECOVER in asm? (reply to 31420)

Łukasz: I'll try

Łukasz: but with SWAPIFNULLs?

Łukasz: F912 is better 🙂 (x{F912} @Defop ECRECOVER)

&rey: Yes, E was a typo. Does it work now? (reply to 31425)

Łukasz: did generate     x{F9126FA16FA56C31A602}     x{F9126FA16FA56C31A602} ... 20 times or more ;/

Tim: are you sure you use correct func compiler?

Tim: have you tried sepezho repo?

Łukasz: but it seems to be started with x{F912 (reply to 31427)

Seitaro: exit code 6 means unknown opcode. So probably bytecode is generated correctly but run on old emulator or in emulator without correct config.

Łukasz: I use testnet

Łukasz: https://testnet.tonviewer.com/kQBu0StuEmr7sa8DU8uU0Z92iIhl-ZqYI-K8F38F4p27wi7Z?section=Source+code

Seitaro: From where you get code 6? (reply to 31432)

Łukasz: Error: Unable to execute get method. Got exit_code: 6     at TonClient.runMethod (.../node_modules/ton/dist/client/TonClient.js:55:19)

Łukasz: `

Łukasz: "@ton-community/func-js-bin": "0.4.5-tvmbeta.1", "@ton-community/func-js": "0.6.3-tvmbeta.1"

Łukasz: which one? (reply to 31429)

Tim: One he linked yesterday (reply to 31438)

Tim: Use local executor from sandbox (reply to 31435)

Łukasz: this one I've used, the same effect (reply to 31354)

Tim: Download state from blockchain and Call emulator. Tdlib on remote server could be outdated

Seitaro: Oh, it is not local, it is call to remote http api (reply to 31435)

Seitaro: What provider do you use? (reply to 31435)

Seitaro: Looks like I mislead you here (reply to 31383)

Łukasz: you mean "mnemonic" etc? so for my repo i use mnemonic, but for sepzho I was using tonkeeper (reply to 31444)

Tim: Http api endpoint (reply to 31446)

Seitaro: No, probably it is ton-access/toncenter/your own http-ton-api endpoint? what exactly? (reply to 31446)

Łukasz: ```const endpoint = await getHttpEndpoint({ network: "testnet" });```

Łukasz: https://ton.access.orbs.network/55B1c0ff5Bd3F8B62C092Ab4D238bEE463E655B1/1/testnet/toncenter-api-v2/jsonRPC

Seitaro: try this one const client = new TonClient({  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', }); (reply to 31450)

Łukasz: ok, that one returns a value

Seitaro: to increase ratelimit get apikey here @tonapibot  const client = new TonClient({  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', apikey:'your apikey'}); (reply to 31454)

Łukasz: ok I'll check

Seitaro: Nice, we will ask orbs to update their ton-access enpoints, thank you for testing (reply to 31454)

Łukasz: great:) thanks once again  so, the x{F912xyztv} means nothing wrong, yes?

Seitaro: yeah, it is some bytecode (reply to 31458)

Yoyo: """to internal deploy""" query = my_wallet.create_transfer_message(to_addr=new_wallet.address.to_string(),                                   amount=to_nano(0.02, 'ton'),                                   state_init=new_wallet.create_state_init()['state_init'],                                   seqno=int('wallet seqno'))  Where do I get the wallet seqno? (what is a wallet seqno)

Daniil: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#replay-protection---seqno (reply to 31460)

Yoyo: Couldn't understand how I create it, do I just take any random number that wasn't used before for a transaction on this wallet? (reply to 31461)

Daniil: You can retrieve the next seqno from "seqno()" get method of your wallet.  Usually, there's some method like .get_seqno() in libraries (reply to 31462)

Yoyo: Hi I am getting this error when trying to send init external message of a new wallet: "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state",  using toncenter api

Yoyo: I have also sent it 0.02 ton and I dont see it on its balance

Shravan: Hey I'm working with TSOL, I'm struggling with deploying contract from a contract. Here's my code

Shravan: That event is not emitting & I don't know if that new contract is deployed or not

Guille: Hi guys, I'm trying to run a webgl app on my telegram bot without success, is supporting webgl on telegram apps?

Guille: Any solution or other motor 3d render supported ?

Boris: https://t.me/twa_dev (reply to 31468)

Rami: I think you're in the wrong chat. You're probably looking for the developer chat of Everscale's implementation of TON. (reply to 31466)

Tumin | Wagmi11: Hello do we have something like a web socket listener to track all the transactions/messages?

Rami: I've heard that https://dton.io/ has something similar to what you're looking for, but I personally never checked it out. (reply to 31472)

Tumin | Wagmi11: Thank you I will check it out (reply to 31473)

sdw: Hey guys is there a way to get more funds from faucet on testnet rather than 2 per hour?

Sukh: I honestly haven't found any better one than:https://t.me/testgiver_ton_bot  I tried this one: https://t.me/faucetton_bot but funds never appeared in my wallet, so I guess it's not working (reply to 31475)

— 2023-07-22 —

Yuri: Hey guys, how could I sign an external message to be sent to my personal wallet using tonconnect SDK (TS)? The external message needs to be op != 0.

User<6247944943>: op=0 means text message I think

User<722988600>: EQASOwmPj4WTm_GzSP8xS7sfaGiM4xza_Yi3AI4heuljFQmG (reply to 31075)

Yuri: Hey, for wallet external message it means a simple send (reply to 31479)

Alvaro El Rey de React.js: 👀

Yuri: Can I sign a cell with ton-connect?

Daniil: ton connect doesn't support signing of arbitrary data yet for security reasons (reply to 31483)

Yuri: Is there a way to install plugins? (reply to 31484)

Rami: Try Tonhub (reply to 31483)

BBB: Or pornhub

ᴺᴼ ᴺᴬᴹᴱ : Оу (reply to 31487)

BBB: Ау

BBB: 🥴 (reply to 31488)

ᴺᴼ ᴺᴬᴹᴱ : 😁 (reply to 31490)

Yuri: Nice, gonna take a look, thanks (reply to 31486)

&rey: I request user's mnemonic words to get the secret key itself. (reply to 31485)

Yuri: hmm, I'm afraid the user get scared with that hehe. Is it the only way for now? (reply to 31493)

VIKTOR: create your wallet app with fork wallet connect) (reply to 31494)

Degen: Please which explorer  view Jetton?

Estevan: Hey guys!! 👋 Does anyone know how to get an invoice-id in TonKeeper? https://github.com/tonkeeper/wallet-api#subscriptions

&rey: yes, and contribute it. (reply to 31495)

Tumin | Wagmi11: has anybody implemented Jetton Minter, Wallet using blueprint?

Asher: https://www.youtube.com/playlist?list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa (reply to 31499)

Tumin | Wagmi11: I watched this, if you come across with code of it do ping thanks (reply to 31500)

Alex: References placed in the description - https://github.com/liminalAngel/func-blueprint-tutorial/tree/master/6 (reply to 31501)

&rey: Isn't that deprecated API? (reply to 31497)

&rey: By the way, subscriptions are subject to rework so you should not depend on them for a while. (For example, my wallet v5 has other, incompatible plugins implementation.)

VIKTOR: I wait when wallets implement Your v5☺️ (reply to 31505)

&rey: You can see the reference implementation at https://github.com/ProgramCrafter/wallet-contract. (reply to 31506)

Yoyo: Hi I am getting this error when trying to send init external message of a new wallet: "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state",  using toncenter api

— 2023-07-23 —

VIKTOR: Everything is right!  but there are no wallet applications yet.  We are waiting for support for wallet applications. (reply to 31507)

Maksim: you should first top up it if you want to deploy it by external msg (reply to 31509)

botmother: hi anyone knows how i can send testnet Jettons? i'm successfully sending to the receiver's jettons wallet, but it's sending TON 😂

X: Hello everyone, I would like to ask. Is there any documentation for integration with a @wallet bot? I want to use it in my bot.

Tans: I think u should ask them directly via support bot🧐 (reply to 31514)

X: Oh okey2 (reply to 31515)

Diana: Wonderful weekend

酷玖TG实验室: Good morning, everyone. I have a question about APIs. For example, when I enter https://tonapi.io/v2/accounts/search?name=mask in the browser, the response is '{"addresses":[{"address":"0:d5cd205bc9930f4d1681ecf10c0ce4dbc0acdbf490966a53850261eef8a0bf90","name":"collection: Mask"}"]}. However, I would like the returned address to be the original address, starting with EQ. Which API should I use for that? Thank you!

富豪: you can conver it (reply to 31518)

酷玖TG实验室: 😭😭😭

酷玖TG实验室: I still don't know how to convert, I am a code beginner, and I am using JavaScript

富豪: toString(true, true, false)

botmother: you can use this   https://ton.org/address/ (reply to 31522)

Azizbek: Hi guys, I'm the NFT creator. I have my own collection's metadata files, I'm gonna publish my collection in getgems, but I can't publish it via Getgem's "Create button", because it's a massive collection. Who can help me to write a Smart contract and other stuff like that this?

Azizbek: Or anyone knows about creating smart contrasts via templates? I need help please, it would be a great help if you YouTube videos about this. (reply to 31529)

John: You can mint big collections on tonbyte.com/tools or use https://github.com/tondiamonds/ton-nft-deployer/tree/main (reply to 31529)

John: Dm if you need help with tonbyte (reply to 31530)

Oleg: unfortunately (reply to 31532)

John: Google says it's on your side. Try reload, clean cache or open in private window (reply to 31534)

Oleg: Interesting.. Your firewall might have banned me or my ISP might have banned you (reply to 31536)

John: Can dm? (reply to 31538)

Oleg: Sure (reply to 31539)

Azizbek: Hi, thanks a lot. I appreciate it (reply to 31532)

Yoyo: Do you know an API that provide live TON to USD conversion rate?

&rey: I know two of them: https://help.crypt.bot/crypto-pay-api and CoinGecko. (reply to 31542)

— 2023-07-24 —

Yuri: Hey guys, I'm getting an error when trying to send an external message using provider.external. I'm using TonClient4 with ton-access:  createError.js:16 Uncaught (in promise) Error: timeout of 5000ms exceeded     at createError (createError.js:16:15)     at XMLHttpRequest.handleTimeout (xhr.js:130:14)

Yuri: Anyone know what's the problem?

Howard: where you got this code that and what the signing message in there? External Messaging? (reply to 31483)

Yuri: Yes, I need to sign the hash of the body before sending to the user wallet through external message. (op = 2) (reply to 31546)

Howard: maybe can try that increase the timeout to 10s? (reply to 31544)

Yuri: Hmm, tried it already via curl (reply to 31548)

User<5903536486>: hi, this is the demo of ton storage that i have found,  where can i find mainnnet ?

John: probably this is what you looking for go https://github.com/xssnick/tonutils-storage https://github.com/xssnick/TON-Torrent c++ https://github.com/ton-blockchain/ton (reply to 31550)

User<5903536486>: thnx, imma check it (reply to 31552)

User<5903536486>: im actually looking for an official gui ton storage for ton foundation

Andrew: good luck (reply to 31554)

Gokhan: Hi, we have integrated this library (https://github.com/olifanton/ton) to initiate the payment process with PHP with TON Keeper but it is not working and we are unable to initiate the payment. Which library are you using for this?  Our main question: How can we transfer TON in PHP?

Howard: one stupid question but what is the different for xxx.t.me vs xxx.ton (reply to 31552)

Daniil: .t.me are telegram usernames, while .ton are TON DNS domains (reply to 31557)

Yoyo: what does bounceable address mean?

Step: When you send ton to a bounce able address, In case of any error in contract execution your ton will come back to you.    If you send to Non bounce able address, ton will not come back. (reply to 31559)

Step: ton.org/address

Yoyo: I have sent TON to an uninitialized wallet and I can't see the TON I have sent. Please help

Dmitry | backend4you.ton: can you see your outbound (sending) transaction from your wallet in explorer ? (reply to 31562)

Yoyo: I have the source wallet address, how can I find it?

Dmitry | backend4you.ton: tonscan.org for example

Yoyo: https://tonscan.org/address/EQCUEcXQj0_uNRaQhex45H_nX1kObj7LA9rbOvL_p8EJyveR Here is my inactive wallet, how do I activate it?

Yoyo: It shows in transaction why is the balance 0?

Dmitry | backend4you.ton: to activate a wallet, you need to make outbound (sending) tx from there. but to make it - you need to have some coins

Dmitry | backend4you.ton: because coins you sent were returned back because wallet not initialized (reply to 31567)

Dmitry | backend4you.ton: https://ton.org/address/ - paste your address (destination) and compare bouncable and unbounceable values

Yoyo: when I try to initialize the wallet with init_external_message I get this error: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state (reply to 31569)

Dmitry | backend4you.ton: because balance is 0 (reply to 31571)

Dmitry | backend4you.ton: send coins to unbounceable form of address. they will not return back. after that, you'll be able to initialize your new wallet (reply to 31570)

Dmitry | backend4you.ton: "bounceable" literally means that  "if the destination smart contract does not exist, or if it throws an unhandled exception while processing this message, the message will be "bounced" back" https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages

Yoyo: will the status change automatically after the transfer to the unbounsable address? (reply to 31573)

Yoyo: Can I break the transfer to 0.01 to unbounsable and then the rest to the bounsable address without waiting for the recipient to init his wallet?

Dmitry | backend4you.ton: when you send coins to unbounceable form of destination address - its status will remain "inactive", but balance increase (and you'll see incoming tx in history, without return one).  then you should make outbound tx from new wallet (to somewhere, or even to itself) and it will change state to Active. But your tx should including init_state (wallet apps will add it automaticatlly, if you use some SDK - you need to read about "deployment" in docs of your sdk) (reply to 31575)

Dmitry | backend4you.ton: bounceable and unbounceable form are two forms of same! address. choosing one of two you just tell blockchain what you want it to do if "something goes wrong" (reply to 31576)

Dmitry | backend4you.ton: if you understand now why answer is "no" - you understood everything correct. (reply to 31576)

Yoyo: thank you, I will make sure to read the docs and design my wallet accordingly. (reply to 31579)

User<5903536486>: To my opinion, many questions are not aroused out of stupidity,  theyre actually essentials. We may think that we know them, though theyre not even answered or known. (reply to 31557)

Erik🆓: How to sell a package of NFTs that are useful together? (A buyer does not want to buy them separately because of the risk of paying for some but not getting all.)

&rey: The easiest way would be to create a contract that can be bought just as NFT, but allows owner to claim its own tokens. (reply to 31586)

xen: the fastest way is to find a guarantor, if the time is important :) (reply to 31586)

&rey: An even faster way is to transfer NFTs to a temporary wallet and sell its private key. (reply to 31588)

Erik🆓: No hurry. (reply to 31588)

Erik🆓: Sounds like a solution that someone will implement eventually. I might be able to learn enough FunC to do it, but how do I advertise my package and how can people trust the contract that I made without a significant effort to understand it? (reply to 31587)

Erik🆓: Can that be done trustless on some marketplace? (reply to 31589)

&rey: I think that I can create that contract in a day if there are enough users who wish to use it. (reply to 31591)

&rey: As far as I remember, @CryptoBot can do that: you create an invoice and add message that will be automatically sent upon payment. (reply to 31592)

Erik🆓: Interesting, but that is not trustless, right? The buyer has no guarantee that the private key will work. (reply to 31594)

Erik🆓: I would put a package of NFTs for sale on getgems if it was possible. (reply to 31593)

酷玖TG实验室: Excuse me! Which API can I use to obtain the address "0:f3c89339597b021f7832cb0d80e6c17dc73f288a26561b1adb3f248770701629" shown in the image above? The current API I am using can only retrieve the address of "collection: Mask," but I would like to obtain the owner's address

— 2023-07-25 —

pid | ton: for the ton.app developer, I get an error when accessing https://ton.app/social and https://ton.app/categories.  Application error: a client-side exception has occurred

Howard: can we got xxx.tg if we have xxxx.t.me / @xxxx username (reply to 31558)

Dmitry | backend4you.ton: What is xxx.tg? (reply to 31602)

Dmitry | backend4you.ton: No. Seller still has privkey (can’t proof he “forget” it) so he is able to steal some NFT from that wallet next second after receiving payment. (reply to 31589)

Dmitry | backend4you.ton: Who can guarantee that this message will be executed? If seller is a “bad guy” this message can do something different. Or, even if this message is actually a NFT transfer - NFT can fail to process it because it’s already owned by different account (reply to 31594)

Howard: wallet.tg (reply to 31603)

Dmitry | backend4you.ton: Oh. .tg is TLD for Togo, so you can buy it as usual domain. ClouDNS asks $40/year (reply to 31606)

Jeff: Hello, which one is the universial WTON? Is there any deployed WTON contract?   https://github.com/ton-community/wton-contract   https://github.com/TonoxDeFi/WTON

Yuri: Hello guys, how can I configure blueprint to use the latest version of TVM, mainly the compiler?

Kate: Hello everyone! Good news for all web3 developers in Portugal: The Big TON GameFi guide and workshop happening this Friday in Lisbon💎  Don't miss 4 hours of insights on how to successfully launch your game on TON Blockchain, useful workshop by TON GameFi lead and lively networking for Web3 builders with DJ and refreshments🌟  The event will kick off with a panel discussion featuring an inspiring lineup of speakers:  📢«Blockchain gaming: The hype is gone, how is it on the plateau of productivity?»  Speakers:  •Pedro Cabaco, Сo-founder & CEO of Volt Games •Inal Kardan, GameFi lead at TON Foundation •Pedro Aguiar, CEO of Mhaya Brands •Andreas Kobal, СTO and co-founder of AILAND  🎤Moderator: Melanie Dow, Content Manager at Blockchain Game Alliance  The full event program and free tickets are available here. Secure your spot right now🎫  Location: grow.inc SPACES Date: 28.07, 18.00-22.00  TON Lisbon Hub in Twitter | LinkedIn | Telegram

&rey: Both are valid TON wrappers. The second one is deployed,  the first is probably deployed too but the address is not mentioned anywhere. (reply to 31608)

Dmitry | backend4you.ton: whats the point of wrapping ton in same network? sending wton still requires some ton. to get wton person need to give out some ton. why wton is better than just using ton?

Daniil: same as wrapping ETH in Ethereum or BNB in BNB Chain. It's made for easier interactions in smart contracts that are working with custom tokens by default (so that developers won't need to split most of the code in two parts to handle tokens/coins in different ways). (reply to 31612)

&rey: It's impossible to accidentally spend WTON on gas/storage fees. (reply to 31612)

Salih: Selam

Dmitry | backend4you.ton: But its possible accidentally spend TON "dust" on fees and be unable to convert wton back to ton due to lack of gas ton :)

Azizbek: Hi guys, I'm dropping my collection in getgems but metadata is not being fetched. What is the problem? Metadata is stored in ipfs and used before to drop in OpenSea. ( I think it's not the problem of re-use)

Gulolio: Hi guys, how can I sign a Cell with ton-crypto, or ton-core or in someway, that later can be correctly verified by check_signature or check_data_signature from stdlib.fc in FunC?

Daniil: sign(yourCell.hash(), keypair.secretKey);  and in contract, check like this: check_signature(cell_hash(your_cell), signature, public_key) (reply to 31621)

Gulolio: Thanks man, appreciated

Agrim: https://www.linkedin.com/posts/agrimnagrani_terrificton-web3-blockchainofblockchains-activity-7089550019942395904-c8aV?utm_source=share&utm_medium=member_android  Guys just starting my content creator journey.  It would mean a lot if you could have a look, share your valuable feedback and engage with the post! ✨🙏🏻

Behrang: Hey guys!  We'd like to share with you the open-source (MIT) release of our liquid staking protocol, called Hipo.  Hipo is decentralized and permission-less and hTON is the liquid staking token. Contrary to most other liquid staking protocols (on TON, Ethereum, etc), anyone can request a loan. There is no central party deciding on loans.  The repository has 23 graphs to show the flow of messages and of course the smart contract code is in FunC, and it's readable and clean.  There are other components to the project, for example a webapp for interacting with the protocol, an external driver for driving the protocol forward, and a borrower to help validators request loans from the protocol. They're all available on our github organization.  As a token of our appreciation for your support, we're offering NFTs to those who lend a helping hand. These NFTs play a crucial role in shaping the future of our governance token, and we'd love to have you be a part of it. You may like to follow us @Hipo on Telegram.

Muaz: we are reading :) (reply to 31626)

Gokhan: Hi, how to open BOC (Bag of Cell) data returned as a result of sendTransaction method?  Anyone know about this?

nonam3e: You may deserialize it using some library. Usually there's Cell.fromBoc() method or something like it (reply to 31628)

Cristina: Haiii brother, something similar happened to me with a woman called Eli a few days ago. She was just fishing for my information and I blocked her too. (reply to 30898)

Gardener: Hi everyone! I was recommended this space by a friend and am hoping for some help. I'm looking for some basic resource recommendations for leading a team of ton devs. Doesn't need to be specific to Ton, just whatever you think is helpful. I won't be doing the devwork myself but will be relying on partners or contractors but I want to do it right.  Thanks in advanced!

sdw: Hello, how can I decode boc ? is there a way using ton lib in node?

Daniil: use https://github.com/ton-org/ton (reply to 31632)

Step: this is 4th time they changed repo url ? (reply to 31633)

Daniil: yes, it's the migration to @ton npm organization. you can now install it like this: npm i @ton/ton (reply to 31634)

&rey: As far as I remember, @ton/ton does not have version with new testnet opcodes and @ton-community/ton does.

— 2023-07-26 —

Anthony: Hi all! TF needs help! We are working on a new batch with updates about GitHub repositories of TON projects for developerreport.com. If we missed your project, please leave a comment on the PR.  Check out the latest Developer Report – developerreport.com/blog/newsletter-20230706. We are gaining good traction in terms of developer activity.   Please help us learn more about new projects. Let's make TON even more fantastic together!  PR: https://github.com/electric-capital/crypto-ecosystems/pull/559 List: https://github.com/electric-capital/crypto-ecosystems/pull/559/files#diff-b49896530814c5f1f290f3a1c8111f03b7d37779a726ad42fdc802844ae6f051

Moshe: Questions Regarding Pools:  1. When depositing to a pool, how long can the cooldown period last?  2. Once adding Toncoin to a pool, before the next cycle begins, how can one remove/withdraw the Pending-Deposit? (ie: if the cooldown period doesn’t end, and the validator pool stops operating, and next cycle never begins, the Pending Deposit Toncoins are effectively being held hostage).

User<6247944943>: WTFFFFFFFF

User<6247944943>: Super cool

sdw: Hello,  after trying the following to convert boc to text still returns me some nonsense. is the following correct way to decode using https://github.com/ton-org/ton   Thank you in advance.      const yourCell = beginCell().storeBuffer(Buffer.from('te6ccsEBAgEAbgA1bgFjAAAAFQAD2cwEZqhMgBgTG0Vw0e3Wt+W2DNgKcxbCj6N3uhnv7VHkUByq/wZeCBfXhAEBAG0XjUUZAAAAAAAAAABejUpRAAIAYExtFcNHt1rfltgzYCnMWwo+jd7oZ7+1R5FAcqv8GXgYehICvQSefg==', 'base64')).endCell().asSlice();     const x = yourCell.loadBuffer(yourCell.remainingBits/8).toString();

Daniil: const yourCell = Cell.fromBase64('te...') (reply to 31643)

Spongebob: Hy Helo

Gardener: The last time she asked y'all just made fun of her. Slow Wednesday? Lol

MR PROTON: hi all)

Behrang: Are you asking this about Hipo liquid staking? (reply to 31640)

Moshe: No.   Rangers Pool #1 And Rangers Pool #2

Moshe: Effectively, since there is no withdraw ability during the cooldown period, the deposited TONCoin is stuck (held hostage by the contract). (reply to 31650)

Behrang: I read the source code a few months ago, but I think anyone could send the pool some messages to drive it forward. This ways the Nominator pool will eventually release the deposits. (reply to 31652)

Moshe: You mean the validator will kickstart upon the next message/transaction is receives? (reply to 31653)

Behrang: The validator is not important, since it might decide to not send any message at all.  But in that case, anyone (most likely one of the depositors) can send a message to the pool. It will check current election round, and if enough time has passed, will request the release of funds from Elector. (reply to 31654)

Moshe: Ok. Thank you. Will check.

Moshe: I tried sending a couple of transactions to the contract. It just keeps sending it back. (reply to 31655)

Behrang: If I remember correctly, it was expecting op-codes 1 to 10 or something like that. Which op code did you send? (reply to 31657)

Moshe: You mean in the message? (reply to 31658)

Moshe: (I’m not sure what an op code is)

Behrang: It's an advanced topic. Normal messages are not accepted. Special messages must be created and sent to the pool.

Moshe: Thank you. (reply to 31661)

Behrang: Looked up the nominator pool here:  https://tonscan.org/address/Ef_1qwsc5P_pxid2MH8gnaRvRJAa1kmRy86eq0JC6XWXaBg-

Behrang: It looks like that the controlling smart contract is out of funds and can't send messages to the pool:  https://tonscan.org/pool/Ef_1qwsc5P_pxid2MH8gnaRvRJAa1kmRy86eq0JC6XWXaBg-  https://tonscan.org/address/Ef8kpA4Tb3SfIKlzGRU-HdrQ28mZbjeXr6Cb96Qkankfyv22 (reply to 31651)

Moshe: 🤷‍♂️

Behrang: Either you have to find the owner and bring it to their attention, or you may send a few tons to it, so that it might continue operation and then you can withdraw your funds.

Moshe: So - like I said. TONCoin is now held hostage in the contract.   Th am you for the help.

Behrang: This is the controlling wallet and it's empty. Last transaction was 6 days ago:  https://tonscan.org/address/Ef8kpA4Tb3SfIKlzGRU-HdrQ28mZbjeXr6Cb96Qkankfyv22

Behrang: It's not held hostage. You have few options to withdraw it. (reply to 31669)

Moshe: 1. I contacted their Telegram chat. No answer. (reply to 31668)

Moshe: How - please. (reply to 31671)

Moshe: I will send some ton to the controlling wallet now. Let’s see what happens.

Behrang: You may want to send 3 TON to the controlling wallet. (reply to 31670)

Moshe: Sent. (reply to 31675)

Behrang: Looks like it's working. Now send a message with the comment: w to the original address where you sent the message with the comment: d

— 2023-07-27 —

Moshe: I can see now that “w” kicked off the “Update validator set” mechanism.   Let’s see if it works…🤞  Thank you for your help. (reply to 31677)

Behrang: With w you just said that you want to withdraw.  There was not enough TON to drive the pool, and sending that 3 TON let it continue its process.  I think your funds will be released 9 hours later.  You're welcome.

Андрей: @ton_help_bot (reply to 31673)

Howard: trying to test and check your metadata or the content you assigned in your contract  https://testnet.explorer.tonnft.tools/nft   make sure the Content is the correct string URL once you read from Contract (reply to 31620)

John: Check that ipfs folder accessible from other device (reply to 31620)

ᴺᴼ ᴺᴬᴹᴱ : Good morning everyone, how can I connect  tonkeeper to the site for mint nft?

Admin: hello everyone, how to listen realtime change amount using react/next js . thanks so much

&rey: Balance? tonconsole.com (reply to 31686)

Admin: yub,listen when change  balance(amount) or listen transfer

Behrang: I have a problem when using validator-console.  Whenever I execute a command using the --cmd argument, it only sees the first command word, and not the rest of the arguments.  For example, running: validator-console --cmd 'help' workes and prints full help.  However, running: validator-console --cmd 'help gettime' doesn't work and still prints full help.  Inside the validator-console, commands work as expected.  Does anyone know what I'm missing?

Vladimir: Hi everyone!

Vladimir: Have anyone tried so far something like:  Is there some sort of the API from telegram to create DAO or some automation tool that will allow me to grant token based on certain conditions?  Lets say I will integrate my product API with telegram Bot and based on the fact that the user made some actions I will grant him or her the apropriate TON or better USDT.

&rey: I also had similar problems when working with toncli. (reply to 31689)

Behrang: Any workarounds?

&rey: You don't need any special API from Telegram to do that: since the messages are processed on your server, you can send tokens from the processing functions. (reply to 31691)

Andrew: ton != telegram (reply to 31691)

Vladimir: Yeah, but than I will have to connect users external wallets. I want to use contacts and somehow use this info, I can use any other blockchain if I will have to connect telegram Bot to the external network. (reply to 31695)

Andrew: yes, you have to connect them (reply to 31697)

Andrew: blockchain choice doesn't matter here

Vladimir: I would like to avoid this part: using web3 client to trigger transactions if possible

Vladimir: Got it, than I can use Solana. (reply to 31699)

Vladimir: I thought that there is some sort of the telegram Wallet integration that allows to use contacts as pubkeys.

Vladimir: So it looks like the only benefit of using telegram Wallet and TON or USDT is to be able to manually transfer tokens and that's it.

Andrew: exactly (reply to 31703)

Vladimir: Got it. Thanks for the info!

&rey: You can be a custodial, creating key pairs (or mnemonics) from user IDs and secret salt.

Admin: sorry how can i get account id (like this: 0:da6b1b6663a0e4d18cc8.....) from account address (like this: EQDROU9C8Ag73oX3T_PV......) . thanks so much

Sksaidul: Br

Admin: sorry what you mean

Daniil: These are different forms of address. First one is "raw" and second one is "user friendly".  You can transform it manually at ton.org/address or programmatically by using a library that supports work with TON types (reply to 31707)

Behrang: I found a workaround in case anyone were wondering.  It looks like that validator-console is a script that runs validator-engine-console as a child process and exits after running it.  If I execute the main executable (validator-engine-console) then there is no problem. (reply to 31689)

sdw: Hello,   is there a way to read Operation 0xda803efd from a contract in order to find out what was that operation constructed? thanks in advance

Tumin | Wagmi11: I don't think you can read it like it  getters are only for method_id please correct me if I am wrong (reply to 31712)

Tumin | Wagmi11: I am facing difficulties with understanding usage of dict in func do you have any resources for it, expect for the documentation? thanks in advance

Dmitry | backend4you.ton: dict is "dictionary", or {key} -> {value} storage - other languages usually have similar structures

Tumin | Wagmi11: here the key is always supposed to be in int type, can we have other variation to it?

&rey: Slice. (reply to 31716)

Tumin | Wagmi11: will study that, thank you (reply to 31717)

Vladimir: cool idea (reply to 31706)

botmother: anyone knows what sdk does getgems.io use for their wallet connect?

Daniil: Ton connect (reply to 31720)

Frosiva: Error: exception in fetch(https://ton.access.orbs.network/mngr/nodes?npm_version=2.3.3): TypeError: fetch failed     at Nodes.<anonymous> (X:\TON\first\node_modules\@orbs-network\ton-access\src\nodes.ts:54:13)     at Generator.throw (<anonymous>)     at rejected (X:\TON\first\node_modules\@orbs-network\ton-access\lib\nodes.js:6:65)

Frosiva: I get this error when running this command: npx blueprint run (reply to 31723)

Daniil: maybe something is wrong with your internet connection? (reply to 31723)

Daniil: try to open that link from error. does it work on your machine?

Frosiva: Yeah I've opened the link in a browser and it worked. Internet connection is OK. And I have this problem with new version of Blueprint. (reply to 31735)

— 2023-07-28 —

Vladimir: Hi guys! Lesson4 on the development of smart contracts on Tact is ready 🔥 Topic - Messages Between Contracts, Throwing Errors

tf: We are a team of security researchers, and try to run Ton validator locally. When we run  validator engine in a container built under ton/docker/dockerfile, we always report the error  "[manager init. cpp: 86] [! Downloadproofreq] failed to download proof link: [Error: 651: no  nodes]" Has anyone encountered this problem? Please help

tf: I located this line by gdb. But I don't know how to solve it.

Anthony: Try @mytonctrl_support_bot (reply to 31742)

F: error no nodes occurs when a node cannot connect to other nodes. Check the availability of the UDP port of the node from the outside. Also check that the server has a public IP address, and this address is specified in the node configuration (/var/ton-work/db/config.json), and not the internal address of the container. (reply to 31741)

tf: I try in host machine which is ubuntu2204. The operation as follow: ============================================================================ 20230728 ---------------------------------------- cd ~/codehub/ton/build/validator-engine wget https://ton.org/global.config.json cp global.config.json ton-global.config.json mkdir tonDB ./validator-engine -C ton-global.config.json --db tonDB/ --ip 127.0.0.1:666 ../utils/generate-random-id -m keys -n server 1B00E62B25BF165BA3BB9B1E4844F26CFA9055186A4DBEDAC3AB9980E570D029 GwDmKyW/Fluju5seSETybPqQVRhqTb7aw6uZgOVw0Ck= mv server tonDB/keyring/1B00E62B25BF165BA3BB9B1E4844F26CFA9055186A4DBEDAC3AB9980E570D029  cd ~/codehub/ton/build/validator-engine-console ../utils/generate-random-id -m keys -n client E0038C222E8213850BA8CBB3478985DB9408E170C418AC9666B699855CBEE8DD 4AOMIi6CE4ULqMuzR4mF25QI4XDEGKyWZraZhVy+6N0=  cd ~/codehub/ton/build/validator-engine vim tonDB/config.json "control" : [   { "id" : "GwDmKyW/Fluju5seSETybPqQVRhqTb7aw6uZgOVw0Ck=",     "port" : 666,     "allowed" : [       { "id" : "4AOMIi6CE4ULqMuzR4mF25QI4XDEGKyWZraZhVy+6N0=",         "permissions" : 15       }     ]   } ],  ./validator-engine --db tonDB -C ton-global.config.json -l log/log  cd ~/codehub/ton/build/validator-engine-console ./validator-engine-console -k client -p ../validator-engine/server.pub -a 127.0.0.1:666  ---------------------------------------- but the same error 'no nodes' occurs too. (reply to 31744)

User<5324347017>: Hi

User<5324347017>: How to run node, easily. Or how to rent a node?

User<5324347017>: Sorry bad english

Łukasz: HI 🙂 is there any perspective of having supported Tuples in in/out parameters of contracts with the typescript SDK?

Daniil: https://docs.ton.org/participate/nodes/node-types (reply to 31748)

Daniil: What do you mean exactly? (reply to 31750)

User<5324347017>: I see, but i dont have public ip. Can i run it on vps? (reply to 31751)

Daniil: Yes, why not? (reply to 31753)

User<5324347017>: Nice, no staking?

Daniil: Running a node doesn’t require staking. But if you want to become validator to earn from it - you need to stake a large amount of Toncoins. (reply to 31755)

User<5324347017>: Okay

Łukasz: or better to say: on real chains 😉 (reply to 31752)

Łukasz: "Tuple-parameters are not supported yet on real chains"

Daniil: Where did you read that? I want to understand the context (reply to 31759)

Łukasz: I get "Error: Unsupported stack item type: tuple" (reply to 31760)

Max: are you using TonClient from the sdk?

Łukasz: yes I think 😉 but maybe not? (reply to 31762)

Łukasz: " at serializeStack"

Max: well if you don't know what you're using I don't think anyone can help you

Max: you can try switching to TonClient4

Max: otherwise I can't help you

Łukasz: /ton/dist/client/TonClient.js

Łukasz: /ton/dist/client/api/HttpApi.js

Łukasz: seems to be official

Max: I told you the solution

Frosiva: How can I use an old version of Blueprint? (reply to 31736)

Łukasz: thanks (reply to 31771)

Max: well you can downgrade the npm package (reply to 31772)

Vladimir: Hi guys! Lesson5 on the development of smart contracts on Tact is ready 🔥 Topic - Sending TON Coins | Calculate Contract Address

D∆RIU$H: Hello, does anyone know about buying and selling Telegram usernames?

Nhân: Hello all

Nhân: i have issue when building the wallet my own

Nhân: Do i have something wrong ?

Nhân: No

Daniil: is you wallet active? check in tonscan.org (reply to 31779)

Nhân: I use the contract v4

Nhân: it on testnet

Nhân: my address here EQDLSOyjvs3p59nTGN8aB3oAwMs9ZtJkipGmCSUql20VeC45

Łukasz: Now I'm getting 404 on  /api/v2/jsonRPC/block/latest for  testnet.toncenter.com  but I don't call it in my code (reply to 31771)

Max: you need to change your api endpoint because it's a different api

Max: here https://github.com/ton-community/ton-api-v4 or use ton access from orbs

Nhân: oh let me try

Nhân: thank you much

Max: I'm sorry my messages weren't meant for you (reply to 31790)

Max: does your wallet have coins on it? (reply to 31779)

Nhân: yeb i have

Nhân: Do you have any ideal ? (reply to 31792)

Nhân: that we could check ?

Łukasz: /block/11529216/[address]/run/[my method]/[params]  sandbox-v4.tonhubapi.com 404 🙁   I had problems with orbs-endpoints (these were not upgraded to support ECRECOVER as we were investigating it last week) (reply to 31789)

Rami: How is the hash calculated for a cell that, in addition to data, holds reference(s) to other cell(s)?

Daniil: 3.1.4 - 3.1.5 https://ton.org/tvm.pdf (reply to 31798)

Maksim: also here you can find a hash calculation example https://docs.ton.org/develop/data-formats/cell-boc#cell-hash because whitepaper doesn’t say anything about references depths (reply to 31798)

Synth: Hello guys

Synth: I am a developer and testing something things in tonkeeper

Synth: Any idea how I can open the config tab in it? After it is created

SOPHORN: How is the hash calculated for a cell that, in addition to data, holds reference(s) to other cell(s)?

Dmitrii: Hi there. I ve got a question: I am connecting to the ton node using LiteClient. Is there a simple way do distinguish the type of node (whether is archive or not) which i am connected to. Maybe some function of parameter in lite_tl.api or tonlib_api.tl?  Tried to parse liteServer.Info capabilities param , but looks like it is not the one

Alex: Good day!

Lichtkunst🐾: Hello Tegro Finance seems to be down, their Telegram group disappeared! Scam?

Andrew: scam (reply to 31807)

Lichtkunst🐾: How can i get back my tgr/ton lp?

Lichtkunst🐾: bad! (reply to 31808)

Lichtkunst🐾: it is still shown im my tonkeeper wallet, can you help? (reply to 31809)

Andrew: ask in @toncoin_chat, they promoted this scam 🤷‍♂️ (reply to 31811)

&rey: https://docs.ton.org/develop/data-formats/cell-boc#standard-cell-representation-hash-calculation (reply to 31804)

Rami: Am I crazy, or is this literally the same question I asked a couple of hours ago? Or is my tg client behaving funny 😄 (reply to 31814)

Daniil: It is same, yes (reply to 31815)

Gardener: Should be no surprise. When the founder and head of the company posts stuff like this maybe don't use their products/services   https://twitter.com/GusevLife/status/1665728881100193793?s=20  **Clarification- this is officially the community manager, they may have other roles, but someone has suspected it is the founder (reply to 31808)

Gardener: Them dumping all of the Ton explains the dropping price over the last few days. (reply to 31807)

Vladimir: Hi guys! Lesson6 on the development of smart contracts on Tact is ready 🔥 Topic - Syntax and Data Types #2

Lichtkunst🐾: This guy is the founder of tegro? (reply to 31817)

Gardener: https://twitter.com/tegrodex?lang=en  My bad it's the community manager. (reply to 31820)

Gardener: I still stand by my snide remark haha.

Andrew: no, the price is dumped by miners (reply to 31818)

Andrew: he's a founder (reply to 31821)

Rami: What a shame. Their product is even being used in the TON QA contest, and people from Tegra have/had association with the grants program, according to the activity in https://github.com/ton-society/grants-program. (reply to 31808)

Lichtkunst🐾: Inactive since january (reply to 31821)

Lichtkunst🐾: Such stupid scammers! (reply to 31824)

Gardener: https://defillama.com/protocol/tegro-finance  Looks like the writing on the wall for a while that Tegro is a turd.

Andrew: just a regular day here 😁 (reply to 31825)

Gardener: Just like real government grants- gonna have a lot of fraud. (reply to 31825)

Gardener: What do you all think of Tonstarter? The recent partnership with Mantle (which is Eth layer 2) seems like a huge red flag to me.

Rami: So, there will be no retribution for scammers and no reparation for the victims from the TON Foundation? (reply to 31829)

Rami: How can I be sure, for example, that STON.fi DEX won't do the same, being another DEX product endorsed by TON? (reply to 31832)

Gardener: Honestly you don't. You need to do your own research unfortunately. Does Ton even have someone to audit these companies and projects before they endorse them? (reply to 31833)

Gardener: The way they promoted DaoLama was inappropriate IMO. Their post on it was a total puff piece and did not include information that should have been included on an introduction to a lending platform (you know like the interest rate). I used to work in asset management and financial planning and no real advisor would be able to get away with crap like that. They need higher standards. Tegro is evidence of that. The DaoLama dude seems okay though, I sure as heck wouldn't want to run an NFT pawnshop which is basically what it is. He said that they were working on P2P NFT lending which would be really cool. I have more problems with how the community chat folks promoted it.

Narek: Hey everyone!  Last month, we dedicated our efforts to researching large collections on TON, and we have some exciting developments to share with you.  Let's start with some context: TON's asynchronous architecture naturally leads developers to use sharded architectures for their smart contracts. This also holds true for the current NFT standard in TON, where each NFT is represented as a separate smart contract. While this approach helps distribute the load on smart contracts, it presents some challenges for developers:  1. Deployment of an NFT collection with 1 million items results in the deployment of 1 million + 1 contracts. 2. Managing multi-NFT operations becomes a significant challenge.  However, we didn't let these challenges deter us. Our team has worked hard to find an innovative solution that allows for the deployment of extremely large collections of NFTs at a very affordable cost. While doing it entirely on-chain proved impractical, we found an excellent compromise by combining on-chain and off-chain storage of data.  Here's the basic idea: we introduce a new state for NFTs, which we call "virtual NFTs." The data for these virtual NFTs, including ownership and metadata, is stored off-chain, while on-chain, we keep a Merkle tree root containing all the NFTs in the collection. When the first transfer of a virtual NFT occurs, it gets minted on-chain, and from that point forward, it becomes indistinguishable from classical NFTs.  This approach offers numerous benefits:  1. Creation of truly massive collections, even up to 1 billion items. 2. Collection deployment comes at a fixed price, independent of its size. 3. Collection deployment costs are incredibly low, akin to deploying a normal empty collection (almost free). 4. The "claiming" of virtual NFTs is very affordable, comparable to a standard transfer. 5. Full compatibility with the existing NFT standard and mechanics. 6. The implementation on marketplace platforms is relatively straightforward.  We are thrilled to announce that today we have published this new approach as the Compressed NFT Standard. Alongside this, we have released reference contract implementations and an off-chain storage server. We eagerly await your feedback and comments on our standard draft.  Thank you for your continuous support, and let's work together to shape the future of NFTs on TON! (forwarded from TonTech)

Gardener: Is there really demand for NFTs in a collection that has a million+ items? I thought scarcity was the attractive part of NFTs lol (reply to 31836)

Andrew: especially when there's still no user-friendly tool to create a collection (reply to 31837)

Gardener: If it means lower cost and access to the same market though, that sounds interesting. I just got together with a local conservation group and we might be looking into making an NFT collection to raise funds for the watershed.

Narek: We had the pleasure of collaborating with the talented team at GetGems to develop this groundbreaking standard, and our confidence in its potential remains unwavering. We firmly believe that there is a significant demand for this innovation, one that holds the power to unlock a plethora of exciting opportunities. But even if, by some chance, our initial assumptions were proven wrong, the elimination of technical barriers for such collections heralds a new era of possibilities for product development. It paves the way for the creation of previously unimaginable and remarkable offerings.

Anthony: 100% need this in NFT-based GameFi projects (reply to 31837)

&rey: If the creator loses the Merkle tree somehow (accidentally deletes, for example), does the collection become impossible to change? (reply to 31836)

Dario: What's the current state of art of gamefi in TON? aside tonight, is there any other project ? (reply to 31841)

Narek: Inviting @krigga to answer your question! (reply to 31842)

Dario: Nvm, there is a section in ton.app (reply to 31843)

Anthony: For example: https://t.me/fanton_nft_en https://t.me/TONPunksENG  + Infra: https://tonplay.io/ https://engine.8xr.io/#web3 (reply to 31843)

Dario: Tks! Will check them out (reply to 31846)

Narek: We are also working on TypeScript gamefi sdk for TON, which will make it easier to work with jettons, accept payments in jettons, etc. You can take a look at alpha version here: http://github.com/ton-community/gamefi-sdk (reply to 31843)

Max: in the reference implementation, the merkle tree is stored by the API if it is lost, the API stops working completely, rendering claiming and updating the collection impossible (reply to 31842)

Tim: Sounds crazy, will check later (reply to 31836)

&rey: Actually, that seems like a good usecase for TON Storage to let users claim NFTs themselves. (reply to 31849)

Max: it could be - but there's a problem of hashing 1 million items to claim one item by each user

Max: the API pre-hashes everything on setup so generating proofs is fast

&rey: Prehashed results can also be stored on TON Storage — storing all nodes increases the data amount by 2x only. (reply to 31852)

Max: that's correct

Max: TON Storage approach is possible, but we chose to go with the centralized API approach this time because it's easier to make and use

Andrey: I understand correctly that there is no difference between nft items and I can use SBT?  What is the difference between collection / collection_new in a repository?  The backend part I somehow really don't like, very difficult to customise and own example is not easy to make. But the contract/idea part is cool. (reply to 31856)

Max: yes, any kind of item can be used  collection_new is well, a newer variant, and the old one is not used the new one has fees much lower than the old one, especially for updates  what exactly are you looking to customize in the backend? maybe I can help (reply to 31857)

Tim: @Narek how much money needed to mint 1 million nfts?

Max: deploy cost is constant no matter the number of items (reply to 31859)

Max: 0.05 will be enough

Andrey: I'll be cool to have dockerfile with dockercompose that will work with one docker-compose up command 😅 (reply to 31858)

Tim: What if I want to mint 100k more (reply to 31860)

Max: updating is more expensive, but a worst case update with 2^30 items is about 0.13

Max: oh sure I'll make one soon (reply to 31862)

Tim: Can I also transfer nft without minting them?

Max: no, not in the current version at least however, this would not be hard to add, although the standard draft would need to be changed (reply to 31866)

Andrey: As I understand all this operations is just update of merkle root hash for tree  One big problem here is to get support of all products for this standard, so if I want to mint such NFT I could do this in tonkeeper (reply to 31866)

Tim: Maybe instead of 1 contact per collection we can create contract that stores all nfts

Max: that was considered, but this breaks compatibility with the existing standard (reply to 31869)

Tim: I think opportunities outweigh pros of having compatibility, we can just have nftsv2

Max: well not exactly, the claim operation creates a normal nft item which can then be interacted with as with the old ones (reply to 31868)

Tim: We need to update products to support it anyway

Andrey: It's cool to give free off-chain NFT via proof over wallets :) (reply to 31872)

Max: current products can work with the new items exactly as they have before, only the claim op will not be available (reply to 31873)

Andrey: Like when I create wallet it's not deployed, I only have address for it. But with first operation I'll be deployed

Tim: I don't think so. (reply to 31875)

Tim: My current indexer needs nft address to work

Maksim: It is possible to decrease the costs even further by utilizing TVM-native special/exotic merkle proof Cells, but this was decided against during the creation of reference implementations for this standard because most modern wallets do not support sending special/exotic Cells.  Have you tried sending exotic cells with modern wallets? They actually dont support that?

Tim: And it needs code and data to exist on that address

Max: well the code of the item is completely unchanged (other than a few syntactic differences) (reply to 31877)

Tim: But item doesn't exist for some part of its life (reply to 31881)

Max: well of course the current products wouldn't be able to interact with unclaimed items

Max: but after claim, there's full compatibility

Tim: But there's no point in that

Tim: We can make claimable nfts with current contracts

Max: yeah, tonweb is broken, and tonkeeper uses tonweb (reply to 31879)

Tim: If we add indexing of not minted nfts it opens a lot more opportunities

Andrey: Even via sign method? (reply to 31887)

Max: but that's the point - there is no standard and AFAIK no implementations for claimable items (reply to 31886)

Max: well the API allows indexing, that's why it's there (reply to 31888)

Max: exotic cells get corrupted by tonweb (reply to 31889)

Max: and fixing this is somewhat non trivial

Tim: I think we need to further improve this idea. So we create nftsv2 that will never be minted to real chain

Tim: Something like L2 for nfts

Max: the problem is that such nfts will also require a bunch of new contracts for all regular operations like sales etc

Tim: We probably can support it

Max: I think I get your idea - it's like solana's compressed nfts (they are mentioned in the draft) - but then we get a whole new standard and not just a relatively small extension

Max: I'm not against it but everything needs to be considered carefully

&rey: Then that's like returning to Ethereum but replacing NFTs dict with Merkle tree root. (reply to 31894)

Max: it's not necessarily bad, it's just a whole new thing (reply to 31900)

Tim: Not exactly. You can pack many updates in 1 tx (reply to 31900)

fraffo: hello, does tonscan let me see the dns names owned by a wallet?

&rey: Yes, see NFT section. (reply to 31904)

fraffo: thx, and if I want to renovate the ownership i have to send a message with some ton?

&rey: 0.001 TON to let contract (more precisely, TVM) launch and update the state. (reply to 31906)

fraffo: thxss

Mohammad: سلام دامنه های که با پسوند تون خریدیم را چگونه میشه روی هست ست کرد؟  Hello, how to set the domains we bought with your extension to existing?

Parallax: هاست هست، Host * (reply to 31909)

— 2023-07-29 —

M.A: hey how we can use .ton for our website?

Dmitry | backend4you.ton: https://t.me/tondev_eng/29022 (reply to 31912)

Nhân: Hi guy, i need a bit explain for this transaction type format

Nhân: what is the address means ?  https://ton-community.github.io/ton/types/Transaction.html

Nhân: how can i get the hash of that transaction ?

&rey: Isn't it a typo? I think address should be of type Address... (reply to 31916)

Nhân: @pcrafter  yub i just read the docs, address is still address, let ignore that . Do you know which field is hash ?

&rey: Is there an example of transaction object? I think hash could be found there.

Nhân: const client = new TonClient({ endpoint: endpoint });     const ownerAddress = Address.parse("EQCU8CX7TMYn4NKRbA8jNszDjLDBJSm0OL5pQdMpmZjiij80")      const transaction = await client.getTransaction(ownerAddress, "13491102000003", "78484921215708432113293380364502526512940444056427294783562610568123788734820")

Nhân: i will need to call getTransaction as a string hash

Nhân: {     address: 67366607025516933148238065058948680498871620750589896091182208512852588290698n,     lt: 13516951000001n,     prevTransactionHash: 78484921215708432113293380364502526512940444056427294783562610568123788734820n,     prevTransactionLt: 13491102000003n,     now: 1690534587,     outMessagesCount: 1,     oldStatus: 'active',     endStatus: 'active',     inMessage: {       info: [Object],       init: null,       body: x{63134E56CBB6AEEE90CB969D4BC2AD59F2C0EFFC4BEFC65D7F7CFF729E2440192E1757EE24DA3C555392B9FFA178DFCC196BC15967DE55700EB02A20B408450A29A9A31764C382F40000000203}        x{420065A47651DF66F4F3ECE98C6F8D03BD0060659EB369324548D30492954BB68ABC20EE6B280000000000000000000000000000}     },     outMessages: Dictionary { _key: [Object], _value: [Object], _map: [Map] },     totalFees: { coins: 4846666n },     stateUpdate: {       oldHash: <Buffer c7 4e a2 d8 bd 2b 19 6b 56 2b cc 3a 40 bc 24 63 d9 6f a8 cc a3 fe 3b 34 e7 22 2c 42 d2 b6 42 3b>,       newHash: <Buffer 9f fb ae 98 d3 45 73 bd 54 7f fc 23 e4 17 f3 8e 6d 11 89 5d 2b 4d 90 31 67 96 03 9f 04 dc 9a 99>     },     description: {       type: 'generic',       creditFirst: true,       storagePhase: [Object],       creditPhase: undefined,       computePhase: [Object],       actionPhase: [Object],       bouncePhase: undefined,       aborted: false,       destroyed: false     }   },

Nhân: But the transaction hash like field is just the BigInt type ?

Nhân: i trying to convert to hex but when i retrive it show invalid.

Nhân: do you know to to convert it back to string ?

&rey: transaction.address is the contract address without workchain.

&rey: Probably you don't have transaction hash in the returned object at all. (reply to 31924)

Nhân: bad @@ :<

Nhân: i use this @ton/ton library in Nodejs

Nhân: How to do the same thing -> get list transaction in range of lt and it  contain hash ?

Web3: Hi guys, maybe somebody looking for Quality Twitter promo, please dm me. Have a good day!

fraffo: Ok, I did it, the "Last Activity" field was updatet, but the transaction failed with exit code -14, it is all right? (reply to 31907)

&rey: No, transaction shouldn't have failed... (reply to 31933)

fraffo: hum what it could be? First, i sent 0.001 and the transaction aborted with Exit Code: -14, then i tried sending 0.1 TON and it failed with 406, bouncing back 0.09 TON

fraffo: what is happening, can you give me a reference for those error codes?

fraffo: k now i sent 1 nanoton and it was succsessful

John: -14 means "Out of gas error." (reply to 31935)

John: 406 is error from contract code. Probably some data invalid

&rey: just because TVM was not launched. (reply to 31937)

fraffo: So this isn't a thing anymore?  https://telegra.ph/TON-DNS-auction-rules-07-21

&rey: Section "extending the domain name" contains a small mistake — 1 nanoTON is insufficient. (reply to 31941)

fraffo: maybe i'm sending them with an old wallet desktop app? (reply to 31939)

fraffo: I see this in the smart-contract code:             throw_unless(406, equal_slices(sender_address, owner_address)); ;; only owner can fill-up balance, prevent coins lost right after the auction but i'm the owner! (reply to 31939)

Daniil: you're not the owner then. (reply to 31945)

fraffo: I own the nfts, they are listed in the NFT section of my wallet in tonscan. Maybe after winning the bid i should have taken some more step?

Howard: hey guys, how do we implement ERC1155 in getgems again? if we put the same NFT ID that people can hold, what will happen in Getgems?

Andrey: sup, Brave browser can resolve web3 domains. Would be cool to see TON partner them to handle ton.dns

Ahmed: Anyone knows what happened on June 14? Marketcap doubled in one day and price wasnt increased, was this an unlocking date?

— 2023-07-30 —

User<1824825864>: Hi

User<1824825864>: Dear TON blockchain community,  I am Serge Kodjeu, a young Cameroonian entrepreneur who has been involved in cryptocurrency investments for the past five years. I am currently seeking financial partners to launch an application based on the TON blockchain.  The purpose of this application is to facilitate the easy buying and selling of cryptocurrencies for Africans, even those without credit cards. I firmly believe in the power of blockchain technology to address the financial challenges that many Africans face, especially when it comes to investing in cryptocurrencies.  Additionally, this application would also benefit African nationals living in Russia, enabling them to easily carry out transactions between Russia and Africa, and vice versa.  I have developed a strong vision for this application and I am actively looking for financial partners to bring it to fruition. I strongly believe that by working together, we can help Africans easily access the opportunities offered by cryptocurrencies, as well as facilitate exchanges with Russia.  If you or anyone you know is interested in this opportunity, whether they be developers, investors, or individuals who share my vision, please feel free to contact me. I would be delighted to provide further information or arrange a meeting to discuss this potential partnership.  Thank you for your attention and consideration.  Sincerely,  Serge Kodjeu

dio: do you really mean TRON? (reply to 31953)

User<1824825864>: TON sorry (reply to 31954)

User<1824825864>: Are you interrested to work with me ? (reply to 31954)

Gardener: Lol

Howard: Hi Devs, how does the query_id work in a smart contract that can handle simultaneous transactions?   I'm designing a contract that allows "everyone" to send transactions in.  This is why I recall we defined the query_id in the TEP standard. However, the problem is that "the current use case for NFT Transfer or Jetton Transfer" doesn't involve high-load use cases!  In my contract, there might be 10 transactions, or perhaps more than 20 transactions in a single LT. What will happen in this case? And how should users select a query_id?   Should they just randomly pick a number? What happens if two third parties pick the same query_id?

&rey: Currently pretty often, users pick query_id = 0 so that should not be used for distinguishing transactions. A bit less frequently, they use current time or random number.  Most of the time, you do not need to store query_id and past requests in your contract: if you can process them on the fly, you just set query_id in outgoing messages equal to incoming one. Otherwise, the problem involves only optimizing message processing and does not depend on query_id much. (reply to 31959)

Daniil: Coinmarketcap was showing wrong data before that day. (reply to 31950)

Ahmed: thanks, but exchanges as well showed same number, all were using coinmarketcap? (reply to 31964)

Ahmed: no new supply was unlocked?

Daniil: Correct (reply to 31966)

Ahmed: any reliable sources of information for the supply of TON?

Daniil: What do you mean by “doesn’t involve high load use cases”? (reply to 31959)

Daniil: https://www.tonstat.com (reply to 31968)

Isaac: https://tonscan.org/stats (reply to 31968)

Ahmed: brilliant, thanks (reply to 31971)

Ahmed: the remaining supply is for mining rewards only? (reply to 31971)

&rey: (total supply) - (circulation) is frozen TON coins, that were mined but never claimed afterwards. (reply to 31973)

&rey: Total supply constantly increases due to validators receiving rewards for their work. Simultaneously, 1/2 of network fees is burnt (this is a deflation mechanism).

User<1824825864>: Dear TON blockchain community,  I am Serge Kodjeu, a young Cameroonian entrepreneur who has been involved in cryptocurrency investments for the past five years. I am currently seeking financial partners to launch an application based on the TON blockchain.  The purpose of this application is to facilitate the easy buying and selling of cryptocurrencies for Africans, even those without credit cards. I firmly believe in the power of blockchain technology to address the financial challenges that many Africans face, especially when it comes to investing in cryptocurrencies.  Additionally, this application would also benefit African nationals living in Russia, enabling them to easily carry out transactions between Russia and Africa, and vice versa.  I have developed a strong vision for this application and I am actively looking for financial partners to bring it to fruition. I strongly believe that by working together, we can help Africans easily access the opportunities offered by cryptocurrencies, as well as facilitate exchanges with Russia.  If you or anyone you know is interested in this opportunity, whether they be developers, investors, or individuals who share my vision, please feel free to contact me. I would be delighted to provide further information or arrange a meeting to discuss this potential partnership.  Thank you for your attention and consideration.  Sincerely,  Serge Kodjeu

&rey: — Please don't repeat the message too often. — This does not seem to be focused on developers so you may be interested in community chat. — You may be interested in Russian chat @toncoin_rus_chat. (reply to 31976)

Ahmed: i think this is not precise, the non circulating supply is around 1.5B TONs, what i read is that the frozen tokens are 200M (reply to 31974)

User<1824825864>: Ok thanks Sir (reply to 31977)

&rey: https://blog.ton.org/freezing-inactive-accounts-of-the-first-miners (reply to 31978)

Ahmed: My bad, thanks Sir! (reply to 31980)

Howard: I believe these contexts could be optimized to be more easily understood. But I get your point. Yes, it seems that even using random numbers can still lead to unclear results. (reply to 31963)

Vladimir: Hi guys! Lesson7 on the development of smart contracts on Tact is ready 🔥 Topic - Inheritance

Jason I BitsLab: Hello, Builders, can someone kindly give me some docs of building a local TON netwrok? I'm a newbie of TON. I'm trying to build a local network on my computer, but have some problems.

Anthony: https://docs.ton.org/participate/run-nodes/local-ton (reply to 31985)

Daniil: Why do you need it? (reply to 31985)

Anthony: Try to use the search box on docs.ton.org. It works very well

Jason I BitsLab: Thanks, I haven't tried this, will try it. (reply to 31988)

Jason I BitsLab: [ 3][t 1][2023-07-28 05:15:02.231266945][validator-engine.cpp:1304][!validator-engine]  found init block [ w=-1 s=9223372036854775808 seq=27747086 YRkrcmZMvLBvjanwKCyL3w4oceGPtFfgx8ym1QKCK/4= N42xzPnJjDlE3hxPXOb+pNzXomgRtpX5AZzMPnIA41s= ] [ 3][t 3][2023-07-28 05:15:02.265003436][manager-init.cpp:35][!reiniter]        init_block_id=[ w=-1 s=9223372036854775808 seq=27747086 YRkrcmZMvLBvjanwKCyL3w4oceGPtFfgx8ym1QKCK/4= N42xzPnJjDlE3hxPXOb+pNzXomgRtpX5AZzMPnIA41s= ] [ 2][t 3][2023-07-28 05:15:02.265609678][manager-init.cpp:86][!downloadproofreq]        failed to download proof link: [Error : 651 : no nodes] [ 2][t 2][2023-07-28 05:15:03.266656105][manager-init.cpp:86][!downloadproofreq]        failed to download proof link: [Error : 651 : no nodes]

Jason I BitsLab: I met these errors when runing a full node

Daniil: If you need it for testing smart contracts, consider using sandbox (reply to 31985)

Jason I BitsLab: I am not to test smart contracts, I'm learning TON's source code, and want to setup a local network from source

Jason I BitsLab: do you have any suggetions?

Daniil: ^ this is the correct suggestion then (reply to 31986)

Tim: You need open ports to run it

Tim: If you want to join public network

Tim: For full local install you can try ton-k8s

Behrang: I've a question about transaction identifier.  Is it enough to store transaction hash?  I see that in explorer.toncoin.org urls, 1)account,  2) logical time, and 3) hash are present to show a transaction.  Other explorers like tonscan.org and tonviewer.org use only transaction hash.  So why is it like this? Was it a performance reason in toncoin.org?

Jason I BitsLab: thanks, will try it. do you have any suggestions on running local from source? (reply to 31998)

Tim: Haven't tried it. But I think it takes few nodes to run chain (reply to 32002)

Jason I BitsLab: Thanks, I've looked this project, it's helpful and I'll try it. But still wanna get some suggestions on how to run local full from source codes? (reply to 31995)

Jason I BitsLab: Which nodes(liteserver, full node, validator)? Do you have an architecture of the ton network? (reply to 32003)

&rey: I've heard that you need to create something like hardfork specifying your validator address, key, initial network state, etc then convert it to network config json (not sure though). (reply to 32004)

Anthony: Is it a valid link? toncoin.org (reply to 31999)

Daniil: https://explorer.toncoin.org (reply to 32007)

Daniil: To identify different transactions it’s enough to store their hashes (reply to 31999)

Jason I BitsLab: No, I'm learning the source codes, and build the binary programs, I want to setup a local TON network with them. It's some like building geth from source codes, and then setup a ETH local network. (reply to 32006)

Jason I BitsLab: While I'm trying to setup the local network, I met these errors (reply to 31990)

&rey: Your node attempts to connect to other validators. (reply to 32011)

Andrey: Other explorers optimize hash (including dton.io) search by creating shorter version column of hash and search for 2 versions: 128bit / 256bit (for example). Search for uint256 is too slow/ (reply to 31999)

&rey: The full node code contains check that the network descends from specific init block. (reply to 32010)

Jason I BitsLab: how to setup the init block?

&rey: create-state executable seems like the needed tool. (reply to 32015)

Jason I BitsLab: ok, thanks! do you have some tutors for how to run a local TON network?

Andrey: https://github.com/disintar/ton-k8s/blob/master/ton-full-node/scripts/hllib/genesis.py#L31 this may help  It’s starting genesis for initial setup of local TON network. If you good at Docker you can adapt those images for own needs (reply to 32017)

Jason I BitsLab: thanks!

Behrang: Oh, I meant explorer.toncoin.org. Updated my message. (reply to 32007)

Behrang: Thanks (reply to 32009)

Behrang: Thanks (reply to 32013)

Tesla: why i need to deploy wallet to blockchain? why is generating keypair is not anought ?

Daniil: Because wallet in TON is also a smart contract. (reply to 32023)

Gardener: Are there any plans for TON related webhosting options for folks with Ton domains? I'd like to keep my websites within the ecosystem if possible rather than just have redirects to WordPress pages.

Nick: Arweave could dot the job!

Nick: Tonweave would be cool :p

Gardener: Thank you for putting that on my radar! I will look into it later (reply to 32027)

Nick: yep! take a look at ardrive very well made

— 2023-07-31 —

Igor: We've got some thrilling news for you all!   FairJournal has just rolled out the alpha version of an incredible new feature: a decentralized, uncensored file system on top of TON Storage! Now, you can share and store data without a hint of censorship - true online freedom!  This file system is more than just storage; it's a whole new way of managing your data. With it, you can create your own public file system, store different types of content like video, photos, text, and have full control over your data. Plus, it's all super secure with cryptographic signatures for each update.  And the best part? We're bringing this feature to FairJournal in the coming weeks! Get ready to experience an uncensored world of data sharing and storage, right here on our platform. Check out the details on the file system here: https://github.com/FairJournal/file-system.  Stay tuned, it's going to be game-changing! (forwarded from FairJournal)

Igor: @Healingcrystals We are moving in this direction to enable people to publish content and update personal sites on TON Storage. Sites and content can be accessed through various gateways.

&rey: Are micro-files (say, < 4 KB) stored in blockchain directly? (reply to 32035)

Igor: Everything is stored in TON Storage. The data is packed into our own mutable equivalent of Bag, and only the hash of this bag is stored on the blockchain. 1 hash can point to thousands of sites/filesystems. But in order to extract 1 site from this hash, you do not need to download all the sites, you just need to correctly extract information from the root hash. (reply to 32037)

Tomite: If you're working for or building a project that needs funding, send a DM.  First 3 requirements for possible funding. - The project solves a real problem. - Has potential to do well in the space. - More than 1 founder.

Aydin: Great! Will there be any maximum storage size limit? (reply to 32035)

Igor: Everything depends on TON Storage and its restrictions on storing a single file and the maximum number of files. At this point, we haven't conducted such tests. Nevertheless, the file system itself could be optimized to store many terabytes of data by dividing large files into blocks and using other tricks. (reply to 32041)

— 2023-08-01 —

𝚗𝚎𝚡𝚝 ✨: Anyone know how we can connect mytonwallet to fragment.

𝚗𝚎𝚡𝚝 ✨: I don't like tonkepper:/

𝚗𝚎𝚡𝚝 ✨: I mean how to handle that ton:// link (reply to 32044)

steadylearner: I am searching for more freelance jobs.  I offer my expertise in building website frontends, backends, and bots.   You can find evidence of my skills on my GitHub profile https://github.com/steadylearner.  For additional proof of my capabilities, I maintain a blog with insightful posts at https://www.steadylearner.com.  You can see some of my recent blog posts.  1. How to Create Ethereum Wallets Programmatically with JavaScript  https://www.steadylearner.com/blog/how-to-create-ethereum-wallets-programmatically-with-javascr  2. How to make a Solana wallet programatically with TypeScript  https://www.steadylearner.com/blog/how-to-make-a-solana-wallet-programatically-with-typescript  My experience spans various areas, including frontend and backend development, payment systems, and blockchain technologies, such as Bitcoin, Ethereum, Solana, and TON blockchain from Telegram, specifically for NFTs, tokens, and bridges.  I have successfully developed Telegram bots for various clients. If you're interested, I'm also open to building bots for Discord or other social media platforms.

Abhishek|: Hey guys anyone building contracts on ton? need some help

Hoang (Elliot): do you guys have jetton in testnet? i just want to test. this is my testnet wallet: EQDZVBBwz607K1YBZt7l-2WlWz38Iix0lW-LdMKOKqdXlxzz thanks 🙏

User<5324347017>: Is there any graph to see staked toncoin?

User<5324347017>: Like hashrate graph in bitcoin

Sina: Are you tired of being limited to just one blockchain network❓   Wrapped Toncoin (WTON) is here to change that. It is a type of cryptocurrency that allows Toncoin holders to transfer their assets between different blockchain networks such as Ethereum and BNB Chain.   Read our comprehensive article on WTON ❗️    Website | Blog  | Twitter (forwarded from TonRadar)

Adrian: hello

Adrian: how are you?

Łukasz: Hi:) any ideas why I'm getting 404 error for  calls to 'https://ton.access.orbs.network/ using TonClient4?

Łukasz: and for all other endpoints found too ;(

Łukasz: like https://testnet.toncenter.com/api/v2/jsonRPC

Łukasz: and https://testnet-v4.tonhubapi.com 🙁

VIKTOR: probably because you need to look at the specification https://www.orbs.com/Orbs-Announces-the-TON-Access-Public-Launch/ (reply to 32056)

Łukasz: I did. /block/latest works fine, but get calls with parameters return 404

Vladimir: Hey guys!!! I'm happy to announce that I've just published the latest videos on the Tact course🥳  Lesson8 - From ERC20 to Jetton Lesson9 - NFT Collection Contract Lesson10 - Telegram dapp  Now the first steps for beginner ton-developers have become much easier. Thanks to everyone who supports the project🙏

Вадим: Hi, guys! What are the options in ton for getting investment? I mean, which funds do we have?

Daniil: For general questions: @toncoin_chat (reply to 32070)

Andrew: good luck (reply to 32070)

Вадим: I think this question is related more to dev chat🤔 (reply to 32071)

Daniil: Do you want to invest in TON? (reply to 32073)

Вадим: No, I have some product for ton ecosystem

Daniil: Oh, you want to get funding for your project. Check out this page:  https://ton.org/en/grants (reply to 32075)

Вадим: Thank you!🔥 (reply to 32076)

Benji: Hey guys, when I try to run toncli run_tests I get the error .config/toncli/test-libs/message_helpers.func:85:36: error: undefined function `generate_internal_address, defining a global function of unknown type` Any ideas how to solve it? thanks

— 2023-08-02 —

Step: Does anybody know boc payload schema for setting address to .t.me DNS?

&rey: Smart contracts cannot do that directly. You may refer to the doc article about subdomains mentioning resolve-contract.ton. (reply to 32079)

Step: I am asking about telemint nft example xxxx.t.me

&rey: It's possible to calculate address of .t.me NFT onchain, but not to retrieve the linked wallet. (reply to 32081)

&rey: Actually, you can send money to the NFT so that user takes it, but I wouldn't recommend that.

Dmitry | backend4you.ton: It must be same as for .ton, isn’t it? They both should conform tep-81 about dns… (reply to 32079)

&rey: It. Is. Impossible onchain. To send money to the owner of username (.t.me NFT) knowing only the username (xxxx.t.me). (reply to 32084)

&rey: dnsresolve is a get-method, domains and usernames don't support invoking it by internal messages (that is, from other contacts).

Dmitry | backend4you.ton: Sorry, missed that he wanted resolution on-chain.

&rey: And to complete the answer: to send money to xxxx.t.me offchain, you need to resolve the address and then send message there. (reply to 32079)

Gardener: Are you free now to show me that website again where I can mine USDT for 4% per day? We didn't quite get the wallet working last time. (reply to 32089)

— 2023-08-03 —

Howard: Hi community, can we implement ERC1155 feature in TON?   I asked few times before in here: https://t.me/tondev_eng/24760 https://t.me/tondev_eng/31948   There has some beneficial to do so, as the person deficated in NFT project in TON that deploed in production. I want build something that using ERC1155.   The difference for 721 vs 1155 is obvious:  1/ 1155 feature token don't need LP in DEXs.  2/ 1155 Trading still will charge the Royalties Fee 3/ 1155 can easily support with NFT Marketplace like we saw in OpenSea. But in out case, getgems.io need have new type of listing NFT Sale contract for sure.    Please give feedback @narek , @Arterialist, @Gusarich

Erik🆓: I think what you are asking for is called jetton. See also the new TONNEL Relayer NFTs, which have a reputation that is supposed to work like a quantity. (reply to 32092)

Humpy: Hello Guys  I want to know that can we get the transaction hash on the testnet by using the ton SDK?

Daniil: why do you need something like erc1155 on TON when you have both Jettons and NFTs? (reply to 32092)

Daniil: they created this standard in Ethereum just to be able to manage multiple tokens (either erc20 or erc721) in a single smart contract. there's no such need in TON at all. It's even better here to SPLIT your architecture between multiple smart contracts instead of placing everything in a single one

talkol: https://t.me/TONAccessSupport  If you have any issues with TonAccess please bring it up here to sort it out (reply to 32063)

Humpy: Hello community Which library we use to convert cell that is coming from the createTransfer function of the ton sdk into the hash so that we can see the transaction status in the explorer?

antiquetoy: Hy guys! Can you help please? I am looking for TON wallet, working with test network, except Tonkeeper. I have tried to get Development wallet, but it seems that there is no more Android version in market, only main from this developer.

&rey: You can try to use wallet.ton.org (as far as I remember, it supports testnet) or other wallets from ton.org/wallets. (reply to 32101)

User<6247944943>: What is the exact process to generate a wallet address based on an private key?  I know I can get wallet V4 address through SDK.

User<6247944943>: But i want to generate and using the Wallet contract I wrote by myself. (reply to 32104)

&rey: https://github.com/ProgramCrafter/wallet-contract/blob/main/wallet-v5.ts (reply to 32105)

User<6247944943>: I see. Very happy to implement this in my project (reply to 32106)

Howard: hey man! This is so powerful! I have the idea for this after checking the Account Abstraction content on ETHcc. (reply to 32106)

Howard: We can build something huge based on this feature in TON. Customized Wallet logic with External message is the briliant idea.

Daniil: Look how it is implemented in @ton/ton library and do the same for your custom contract:  https://github.com/ton-org/ton/blob/master/src/wallets/WalletContractV4.ts (reply to 32105)

Daniil: Actually, the address of ANY smart contract on TON is calculated deterministically from its code and data (StateInit object). You can use contractAddress() function in JS from @ton/core library. (reply to 32104)

Daniil: In terms of wallet contracts, the data usually consists of some service values like seqno, and also the Public key of the owner to validate their signatures. From private key you can calculate the public key (it usually happens automatically when you create Keypair object), so you just need to build a Cell that contains all that data. If you wrote the smart contract, you should know how the data is stored in it. (reply to 32112)

Łukasz: Hi. Do you know why my contract doesn't have the "Deploy contract" transaction phase?  I'm creating it from code compiled and saved to a file and it has non-empty data read as a Cell when is created.  I'm using TonClient4 wrapped by blueprint (for `TonClient it worked properly, but for TonClient4 it does, even when it's not wrapped).  The contract address is:  kQBbK1-74xUiXZ9bE7ArTwXcxGoTa4HQtzNJIGk6OsD3PGAL and it has no data 🙁   I use it as  ```provider.internal(this.networkProvider.sender(), {   value: `${coins}`,   bounce: false,   sendMode: SendMode.PAY_GAS_SEPARATELY, }); ```

Łukasz: missing "Contract" conformance (reply to 32114)

Howard: What is the status of your contract on Explorer?   You contract already in there, you just need pass initial code to activate it. (reply to 32114)

Łukasz: But it seems the 404 route errors occur for bigger data like our payloads. I’ve asked about it on the ton-access channels. Worth to have mentioned that for apiv2/tonclient v2 it worked properly, but we needed to switch to v4. So it is probably a bug.

Łukasz: Thanks:) I know it, but the data were constructed during the contract-creation, but missed later (reply to 32116)

Abhishek|: hey guys! we are building something cool on ton and looking for some help with contract dev ... can someone please reachout me ?

Coinvent: Check DM, please (reply to 32119)

Gardener: Are there any good guides on self launching NFT projects? I want to get an idea for how complex it will be before making a proposal. I recall someone complaining before about there being no user friendly process.

Howard: Good question, but you can take reference here that easily deploy your NFT in Tact-lang https://github.com/howardpen9/nft-template-in-tact (reply to 32121)

Gardener: Thank you I'll check that out later. Saves (reply to 32123)

&rey: Do you need a proposal, actually? TON supports NFT minting for anyone without any specific approval; there are many platforms (getgems, for instance) and scripts to do so. (reply to 32121)

Gardener: Its for the organization that I'd be partnering with.

Gardener: I want it to be an official project on their website and all that jazz (reply to 32125)

&rey: It seems that the project proposal does not depend much on blockchain choice. If you want your project to be on the cutting edge of technology, you can look at Compressed NFT standard (https://t.me/tondev_eng/31836). (reply to 32127)

Gardener: Would it be more efficient to use the old tech? I prefer layer 1 for everything. Wasn't the new one mostly for high volumes or am I thinking of something else? (reply to 32128)

Gardener: Ultimately my biggest consideration for what tech to use is energy efficiency, then second to that is accessibility.

G: 👍

&rey: The old tech seems a bit more user-accessible since it doesn't use centralized server or calculate Merkle proofs on client. (reply to 32130)

Gardener: And I'd assume there are more resources and support for it too (reply to 32133)

Daniil: I don’t think it’s correct to split these standards to “old” and “new”. Both TEP62 and TEP126 will be used widely for their use cases. (reply to 32133)

John: Also check this two: https://docs.tonbyte.com/docs/Tools/nft_structure/ https://docs.tonbyte.com/docs/Tools/create_collection (reply to 32121)

John: There are good support))

Gardener: Thank you as well! (reply to 32137)

Gardener: When you use codes like 62 vs 126 and the same base its hard not to see one as clearly newer and superior. (reply to 32135)

Daniil: That standard is newer, yes. But it won’t *replace* the tep62 (reply to 32139)

&rey: They shouldn't be compared) TEP-74 vs TEP-81... the former is Jetton and the latter is DNS standard. (reply to 32139)

— 2023-08-04 —

User<5839256817>: how do i deploy a contract to  my local ton node?

Daniil: Why do you need to? (reply to 32144)

Andrey: Hey everyone. For the last two months I've been developing a tonpy library to cover all the features of the original TON monorepo in python.    Now I'm moving on to high-level stuff like abstractions over smart contracts for deployment and testing via emulation, interact with get-methods, etc.  If you're a Python developer, or you've been actively working with a sandbox emulator, please write either to me in PM or here what you think are the most important features in deployment, testing and interfacing with smart contracts. This will help me to put them into the library architecture.  At the moment, the root most important differences for usability that I see :  1. Using python TLB gen to describe data structure and messages. This allows you to use your tlb descriptions and python objects on top of them in abstractions. 2. Detailed TLB steps when running emulation and get methods. Currently, tonpy dumps the entire stack as python objects for each step (including complex structures like tuples and continuation) and adds to this with information about the current OP code and gas consumed. I'm also thinking add commited flag and commitment state for eseally debugging, cell offset for detecting Func line of executing.  If you have any ideas what else can be added, or you know super important and cool sandbox features - please let me know 🙂

Hoang (Elliot): any example to develop a jetton smart contract with func and blueprint guys?

Alex: https://www.youtube.com/watch?v=RU6ZYrJ2Vqs&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa&index=5&ab_channel=TONDevStudy%5BEN%5D (reply to 32147)

Daniil: what's TL-B? (forwarded from Daniil)

Daniil: It's Tensor Language B By using TL-B, we can write high-level tensor operations (forwarded from Rolo)

Daniil: 😄

Daniil: 😄 This guy (banned him already) sent me an exact same link of his "project" and also struggles to answer simple questions about TVM as did the guy from that old message: https://t.me/tondev_eng/30898

Maksim: the right answer: A TLB is called a tractor loader backhoe or digger. It is a heavy equipment vehicle with a shovel/bucket on the front and a backhoe on the back. (reply to 32153)

Łukasz: Does there exist toncenter API but in V4, not V2?  I need to use ECRECOVER by using V4. The only endpoint supporting it for V3 was the one served by toncenter. Orbs and tonhub don't support it.

User<6247944943>: I love the test cases part. I need those tips (reply to 32148)

User<6247944943>: 👍 (reply to 32146)

Coinvent: We are a team of experienced blockchain (mostly TON) developers who are looking for more projects to work on. Feel free to contact us if you have an idea of a blockchain project.

Step: i set wallet dns record to xxxx.t.me nft but it is not showing in fragment nor tonviewer why? but resolving correctly on tonscan/tonviewer search.

Gardener: Would it be possible to require an NFT holder to pay a set monthly amount in order to hold the NFT? Essentially creating a subscription.

Daniil: For subscriptions, consider using wallet plugins. But yes, it’s possible to implement it through nft (reply to 32173)

Gardener: Would tying the wallet plugin to the NFT make it easier than baking it into the NFT?

Dmitry | backend4you.ton: DNS contract is a good sample of such NFT - holder lose it after a year of non-payment.

Dmitry | backend4you.ton: with wallet plugins, wallet owner can remove this plugin (and stop payment), so you need to have a way to "take back" his nft (in code of nft / collection)

Gardener: Oh this is a great analogy. I think annual would be more appropriate too thank you

&rey: Baking is probably better since it involves shorter (therefore easier) message chains. (reply to 32175)

&rey: However you should consider the probability that the plugin standard changes. If my wallet v5 standard is adopted, this is guaranteed to happen.

Gardener: What is the average going rate for Ton Devs to charge for their time? Feel free to DM me if you don't want to put it publicly. I am applying for a Ton Grant and all the numbers I can get will help/

Kramer Nomissian: bro what about Func seems too imortant at this moment… i’m have python background which should i take? (reply to 32065)

— 2023-08-05 —

User<6247944943>: Tact, it's easy to learn https://tact-by-example.org/all (reply to 32186)

Daniil: As for any other job, it all depends on the skills of the developer. Highly qualified specialists charge more than those who just learned how to code.  At the other hand, these skilled coders can solve same problems much faster. (reply to 32185)

Daniil: I think it’s better to just ask several devs how much will they charge for the whole project.

Samyar: https://blog.ton.org/func-journey  hi is this documentation is expired ? the part witch says you have to install toncli and all the ton binaries ? because right now i found something called blueprint witch handles it all so i dont have to use toncli  i mean it seems like a matter a matter of choice witch one you prefer but this article only talks about toncli

Daniil: Right now you can just use blueprint (reply to 32191)

Daniil: The article is quite old

Eugene: This old article is currently being updated to use Blueprint: https://github.com/ton-society/ton-footsteps/issues/235 (reply to 32191)

Daniil: Not this article :) (reply to 32194)

Samyar: just took a look at the issue   is the English version ready ? (reply to 32195)

Daniil: Almost! (reply to 32196)

Daniil: Russian one is merged already

Samyar: well i guess for now i will use the forked repo in your github (reply to 32198)

Daniil: I strongly recommend you to wait until I finish the translation completely (reply to 32199)

Samyar: well if you say so than i will wait 👍 (reply to 32200)

Alex: not as exclusive, but in addition you can learn Blueprint through this course. (reply to 32201)

Samyar: yes i tried it but it was too slow and boring honestly i couldn't learn from it   tho i might get back to it after i learned a bit myself (reply to 32202)

Santosh | Wagmi11: play around, get hold of c4 registery concept. (reply to 32203)

Don: Hi I am sending ton from trust wallet to telegram wallet but i am facing error

Po 🐈‍⬛: 🧐 make sure use same network (reply to 32205)

Don: I am using same network TON (reply to 32206)

Daniil: Ask in @toncoin_chat (reply to 32205)

Rey: Good morning to all in this community 👍  A friend told me that I could get some help here I want to do some tests in the tenest of the Blockchain but I need the test tokens I have already requested in the bot that was enabled for that but it tells me that I must wait and it has been more than a week and nothing 😔 Where else can you get the tokens to test in the Blockchain 🤞🍀🙏

Daniil: Send your testnet address (reply to 32209)

Rey: kQCnnqgIq0lchW-HYONuhp1AJCH_eIrO5sOk4P59sDLus6B7 (reply to 32210)

Channel<1706757363>: you have to send it to the bot (reply to 32211)

Channel<1706757363>: @testgiver_ton_bot

Rey: I already made the submission to the bot but they still haven't given me anything more than 1 week ago the request 😔😞. (reply to 32212)

Alex: you have 4 TON on yout address in the testnet, what is problem? (reply to 32214)

Channel<1706757363>: i just checked, you are sending the bot your main wallet...you need to activate the testnet line on toonkeeper (reply to 32215)

Channel<1706757363>: that's why you don't receive anything, because you are sending wrong wallet address

Channel<1706757363>: this is your main wallet, you have to send the other one

Alex: Our research report reveals a suitable solution by TONTech to revolutionize NFT deployment on the TON blockchain.     check out the article discussing it.   Website | Blog  | Twitter (forwarded from TonRadar)

Rey: But I don't see them in my wallet, so why do I get zero? (reply to 32216)

Alex: well, then you should switch your wallet to the testnet network, as mentioned here (reply to 32218)

Rami: In the places I've worked, we usually set a fixed hourly rate, like $30/hr, and then we estimate the time required for each module in hours. That gave us an idea of cost for the project.  For the hourly rate, try to start from some figure (let's say $50/hr) and adjust that number to make the total project reasonable, that you comfortable to work with. (reply to 32185)

User<6247944943>: One question for Library WalletV4 modules:  Where / which initial code they use? It's pure WalletV4 standard cell data right?

User<6247944943>: ok, never mind. Let me check here: https://github.com/ton-core/ton (reply to 32225)

🥠X$FASIA: Good luck

User<5900011396>: Good night

ba5defghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl: Are there any TON APIs? I would like to do that when someone sends me money they send me a webhook request

User: You can use tonapi or toncenters api's (reply to 32229)

ba5defghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl: Link? (reply to 32230)

Tim: https://tonpay.gitbook.io/tonpay-sdk/

ba5defghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl: There's not like when I receive money the thing send me the webhooks request (reply to 32232)

ba5defghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl: I prefer don't self host haha

Tim: 🤦‍♂️

ba5defghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl: I don't have much time, I'm asking for that (reply to 32235)

User<5767246014>: Hi, I'm Sylvia

User<5767246014>: I'm new here and will be needing a little guide

&rey: Hello! You may be interested in TON documentation and tutorials (https://docs.ton.org/). Please don't hesitate to ask any arising questions here. (reply to 32238)

— 2023-08-06 —

Step: Any help? (reply to 32170)

Front: How to sign a meesage by ton wallet ?

Maxey: How is composability of TON smart contract?

Motherfuckin’ D: Hello everyone

User<5767246014>: Hi

User<5767246014>: I really need a guide pls 😏

Step: guide to skam? (reply to 32253)

Step: No guide no help no reply. (reply to 32170)

&rey: What page are you referring to? Your wallet address or the domain NFT address? (reply to 32170)

Step: In fragment, owner/bidder address. in tonviewer , wallet address;Usually shown under account name. (reply to 32256)

&rey: Does the address resolve when you enter it in search bar? when you attempt to send some TONs there? (reply to 32257)

Step: In search bar yes , not attempted to send ton. (reply to 32258)

Step: I can send more info in pm if you do not mind 🤪

&rey: Does Tonviewer show your other NFTs? If so, the domain NFT may have got collapsed.

sb: Hi, guys! I have a similar question.    ` const [tonConnectUI, setOptions] = useTonConnectUI();     const transaction = async () => {         const tx = await tonConnectUI.sendTransaction({             validUntil: 999999999, // just for tests             messages: [                 {                     address,                     amount,                     stateInit: beginCell().storeUint(0, 4).endCell().toBoc().toString("base64"),                  },             ]         });          console.log(tx);     }`  I use this code to make transactions on not initialized wallets, but every transaction returns to a sender. I tried to specify bounce flag, but I think I did wrong.

— 2023-08-07 —

Daniil: You should set bounce = false (reply to 32262)

Blackout: Good afternoon, can you please suggest crypto groups, TON projects or English segment channels ?

Daniil: @toncoin_chat (reply to 32266)

Santosh | Wagmi11: not accessible 😕 (reply to 32267)

Dmitry | backend4you.ton: Recheck. It is active and available, there are 12k users total and 1.5k active right now (reply to 32268)

Daniil: This is not related to TON at all (reply to 32270)

Benji: Does anyone know if the ton wallet can sign a plain text message offchain?

&rey: Probably it cannot (you may have a look at API if there is some). (reply to 32274)

Ivan: Hi everybody! Where can I find tutorials for a complete beginner in TON development?

Jose: Cool

&rey: On docs.ton.org. (reply to 32276)

Arsen: Hi guys. Is there an API call or node js sdk, that gives access to get transaction info by transaction HASH, not by account.

Santosh | Wagmi11: It says it a private group (reply to 32269)

&rey: It's possible that you got blocked there. (reply to 32280)

Santosh | Wagmi11: Never been part of that group

Tumin | Wagmi11: tonhub? (reply to 32101)

Wladislav: You can use regular Tonhub wallet for android, to switch to testnet network you have to go to settings -> tap 7 times on version -> on the developer menu click network to switch from mainnet (reply to 32101)

User<5753715237>: Ton smart challenge I have registered in the bot, what should I do now?

Tumin | Wagmi11: wait (reply to 32285)

— 2023-08-08 —

play of the game: Considering a BoC... Is it necessarily a DAG?(cell references being edges) or is it possible to contain cycles?

Daniil: It is DAG (reply to 32287)

Daniil: https://docs.ton.org/learn/overviews/cells

Павел: Is it difficult to win TON smart challenge? How many people will participate?

&rey: I guess around 200? (reply to 32290)

Павел: Can it be a team instead of one person?

&rey: No, it cannot.

&rey: Also, wdym by "win"? Achieving 1st place is going to be hard, though it's not rewarded separately from top 15%. (reply to 32290)

&rey: Though, the tasks themselves are going to be rather easy.

Павел: Hm… what about premious results?

Павел: So, each from 15% earn approximate 1000 TON?

&rey: I guess that's 333 TON at most, if there are 200 participants. (reply to 32297)

Alex: Are you facing difficulties due to limited liquidity while engaging in large coin/token exchanges? Or do you have problems exchanging less-known tokens?  Overcome limited liquidity issues in trading large coins/tokens with DEX Aggregators!   Discover this solution in our comprehensive article.  Website | Blog  | Twitter (forwarded from TonRadar)

Hakiem: anybody facing issues with TonClient? I get this when i do runMethodWithError(): Error: Provided config url is not valid  but was working fine yesterday (forwarded from Hakiem)

Hoang (Elliot): I need some advice from you guys. I want to program smart contract on TON, but still confused between FunC and Tact. I have experience with EVM, which language should I choose?

&rey: Tact is a bit more similar to Solidity but it's really bad at manipulating dictionaries, and there are no special list types. (reply to 32301)

Hoang (Elliot): Yes, it's quite similar to Js, Rust and Swift (reply to 32302)

Hoang (Elliot): I just want to develop a Jetton smart contract, and some special transfer functions. Is tact suitable for that?

&rey: Yes, I think it'd be easier to use Tact for that. (reply to 32304)

Hoang (Elliot): thank you for your replies 🙏 (reply to 32305)

A: How to working together?

Workholic: guys I am new to this ton smart challenge can you explain me what exactly needs to be done

A: Same (reply to 32308)

mustafa: guys whats the challenge? can anyone tel me

mustafa: tell

Frosiva: I'm running toncli for the first time on Windows. How can I fix this?

Hoang (Elliot): does tact has any type similar to array? (reply to 32305)

&rey: map<Int as uint?, ?> + length indicator is most commonly used, I think. (reply to 32314)

&rey: https://t.me/tondev_eng/21510 pip install bitstring==3.1.9 Searching in chat can help. (reply to 32313)

Hoang (Elliot): so, an array of address will be like this: map<Int as uint, address> right? (reply to 32315)

&rey: map<Int as uint16, Address>, the general concept is correct. (reply to 32317)

Hoang (Elliot): thank you (reply to 32318)

Makan: Hi guys I develop ton transaction manager with python when i want transfer_ton get this error at my code : get method seqno for address   EQA2rJK4z2L4mJdJlMpMF6yg0uCzUkCYQQoB4N1pkrO5ff0Q exit code is -13  I would be grateful if you could help me if you have experience in this field.

&rey: Is the contract uninitialized? If so, you use seqno 0. (reply to 32320)

Makan: is a wallet address (reply to 32323)

&rey: In TON, wallets are also smart contracts. (reply to 32324)

Makan: it's my code

Daniil: EVM experience won’t really help you here 😅 (reply to 32301)

Hoang (Elliot): how about MoveVM :D I developed 4 dApps with Aptos/Sui lmao (reply to 32327)

Hoang (Elliot): when start researching about TON, lots of new concepts that different from those

decot: qq

Hoang (Elliot): i'm importing like this, but get this error

Hoang (Elliot): tried import "./messages"; but still the same

Hoang (Elliot): can somebody help me please?

Daniil: As far as I remember you don’t need to include the extension in imports (reply to 32331)

Daniil: Then IDK. You can try to ask in tact chat (reply to 32335)

Hoang (Elliot): i think, i should group them all to one file, then no need to import -> no error :D

User<6247944943>: how to use run method on https://toncenter.com/api/v2?

Howard: Hey Tact learner, you can check this line of code: https://github.com/nonam3e/tact-lessons/blob/26ea3981e5524a5e3a0d5675bc3e2cbedf8eb481/lesson5/sources/wallet.tact#L1   And you can ask Tact questions here: https://t.me/tactlang (reply to 32333)

Daniil: Just fill in the values and run (reply to 32343)

Hoang (Elliot): tried but still the same sir (reply to 32344)

Hoang (Elliot): nevermind, i just merged all files into one and built successfully

Behrang: Hey guys 👋  I have a question regarding Jettons.  Is there any best practice for the amount sent in Jetton Transfer Notification?  I checked TonKeeper, and it uses 1 nanoTON which always fails, but maybe this is enough for the wallets to be notified about the transfer, even though the transaction has failed.  Any ideas?

&rey: If you need to trigger DEX, 1 nanoTON would be too low. If the recipient contract is not to be bothered, then 1 nanoTON is OK, since that just make transaction tracing easier. (reply to 32359)

۲: @hanipotbot

۲: Music founder (reply to 32361)

Behrang: Great, thanks 👍 (reply to 32360)

Ahmet Said: New Ton challenges have been announced yet ? any github link for them ?

Daniil: There’s a separate chat related to ton contests (reply to 32364)

Ahmet Said: can ı have the link ? (reply to 32365)

Daniil: There’s “Discuss” button in channel menu, but okay: https://t.me/toncontests_chat (reply to 32366)

Ahmet Said: thanks ı joined (reply to 32367)

ezji: who knows how to catch transaction refusal using ton-connect/ui-react?

ezji: would appreciate a lot))

Olaf: hi guys. i've discovered bug in the telegram bot. my github name is @olaf-ideas with the dash and its probably causing some issues. the problem is i can't show my profile if my github have a dash

Frosiva: Is it possible to calculate the address of a contract for using it inside the contract?

Dmitry | backend4you.ton: my_address() ? (reply to 32383)

Rich: Hi everyone, does anyone have $ton in the testnet? I will be grateful  kQCor7vG6ginBTVBzR8wGBmae5nUX7NXHQZkIcVfME2OR7Qp

Gewöhnt: Hello 👋🏻 is it possible to use my token inside the game with the ability to convert from TON to my token and vice versa?

Inal: Hey!  Your token is Jetton, right? (reply to 32388)

Gewöhnt: Yes (reply to 32389)

nonam3e: Yeap you just need a special jetton master smart contract, that will return toncoins after token burning (reply to 32388)

Inal: The short answer is yes. There are several ways to do it - you can make swap contract in your game or have a pool on one of existing exchanges (megaton is very gamefi friendly for example) and make swaps using theirs contracts. (reply to 32388)

Inal: What is your game about? (reply to 32388)

Gewöhnt: That's great, I'll understand. Are there already games with the corresponding technique in telegram pay? (reply to 32391)

Gewöhnt: simulate collect coins (reply to 32393)

Gewöhnt: thanks for the answer 👍🏻 (reply to 32392)

KrishnaMani: hey everybody , so from where we are going to solve problems ??

KrishnaMani: can anybody let me knnow

Inal: You mean wallet pay? (reply to 32394)

Handsome: Use testgiver ton bot to get it (reply to 32385)

Zyxep: u can search about it in ton . app website and game category (reply to 32394)

ST4RM14🍅: How to claim my github Coin because i win smart ton challenge

Naysha: I am totally new in this , someone giving  coaching?

Naysha: I can exchange it for Ayahuasca retreats 🥰in europe

Павел: Bot doesn’t respond me with token. How to receive token?

Arash Nemat Zadeh: Tap on my profile glass button in the bot (reply to 32405)

&rey: And it doesn't work. (reply to 32406)

Arash Nemat Zadeh: It gave me in a message like this (reply to 32407)

Olaf: Got this message on github actions: "Error message: Solutions submitted from GitHub account different from registered account associated with the user. " I've set my username correctly and github with the @ at the beggining. Checked for misspeling but nothing there

Павел: It doesn’t work ((( Nothing happen. Loadding in progress, but after that no token, no even profile shown… (reply to 32406)

𓂀 𝑵𝒂𝒔𝒊𝒎 𓂀: Hi

Byte: Hi, everyone

— 2023-08-09 —

🏖️: Why this scammer is promoting this fake site in a ton devs group? (reply to 32413)

Handsome: Admin needs to ban him (reply to 32415)

🏖️: And that's weird promoting such scam where there are self aware Blockchain community devs that already know how that works, that's no sense

Howard: 1/ If you want to get "the current smart contract" you are calling with, using my_address()  2/ If you want to measure the correct address inside the smart contract code: follow how NFT collection contract generate the NFT Item contract. https://github.com/howardpen9/nft-template-in-tact/blob/c82f3dcded42e924f8d4f7caeac62b8d484b5592/sources/contract.tact#L92 (reply to 32383)

Hoang (Elliot): hi. can I ask you some question about tact? (reply to 32418)

Howard: yes, and you can go to for more Tact focus content: https://t.me/tactlang (reply to 32419)

Hoang (Elliot): can I DM you? (reply to 32420)

Luke: how do i get the size of and index a tuple

𝕊𝔸𝕀𝕂𝕆𝕆: in python you may convert it to list then do the calculations you want (reply to 32422)

Luke: sry, i meant FunC (reply to 32423)

𝕊𝔸𝕀𝕂𝕆𝕆: i am new here , what is funC 😅 (reply to 32424)

Luke: the high-level language for TON

𝕊𝔸𝕀𝕂𝕆𝕆: ok, thanks do you know from where can i learn it ? (reply to 32426)

Luke: https://docs.ton.org/develop/func/overview (reply to 32427)

𝕊𝔸𝕀𝕂𝕆𝕆: thnks bro ❤️ (reply to 32428)

𝕊𝔸𝕀𝕂𝕆𝕆: then should i learn tact or func 😕? (reply to 32431)

Daniil: contracts written on func are more efficient but tact is a little bit easier in terms of syntax (reply to 32432)

𝕊𝔸𝕀𝕂𝕆𝕆: oh ok , but i see that i can compile tact to func,  then i can use tact, am i right ?😅 (reply to 32433)

Daniil: you can if you want (reply to 32434)

𝕊𝔸𝕀𝕂𝕆𝕆: thanks ❤️ (reply to 32435)

无名: hi.. can I use ton to send crypto in telegram directly?

Anton: you mean like wallet bot, without having user's wallet Id?

无名: I have a telegram user id

无名: I want to send TON to that userid

无名: via a service I create.. or decentralised. both for TON and ETH

Santosh | Wagmi11: @wallet

TEAM_Psi_2: Guys what library should I use in order to check tx in ton blockchain

TEAM_Psi_2: Using python

无名: thanks but no ETH (reply to 32442)

无名: I want to do this in my own app with python

Daniil: where did you found that? (reply to 32448)

Daniil: i see this. it looks not like on your screenshot.  and the link works (reply to 32452)

Alex: link updated, we had 2 links there (linux/macos and windows). (reply to 32453)

Gulolio: Hi there guys, how can I convert the hash that I get from a cell in TypeScript, like this, my_cell.hash() which is a buffer, to an bigint? In a way that later in the contract if I make cell_hash(my_cell) these two numbers will be equals? I'm trying to do something like this in my typescript code: let hash: bigint = my_cell.hash().readBigInt64BE()  And then sending this, but the numbers differs by far. Any suggestion

Daniil: BigInt(“0x” + hash.toString(“hex”)) (reply to 32455)

Gulolio: Let me try this stuff, thanks in advance man

Dholakpur Knight: I am new into this challenge, where are the tasks?

Dholakpur Knight: I am a complete newbie

DrDigital: Hi TON Devs, I was wondering which projects build upon TON? is there an overview you can share?

krau5: Hi! As I see, there is no decimals in FunC, so it can raise some kind of an error if I’ll try to store 1 / 2 in the int variable, right?

Daniil: No, it will just store 0. It’s rounding the result down (reply to 32461)

Hoang (Elliot): even 0.99 is rounded to 0. the same as EVM, MoveVM, etc... (reply to 32462)

Łukasz: does there exist another way of getting TONs but telegram testgiver ;)? I've given it to the sender and cannot receive it to my wallet for 1hr 😉

Łukasz: my addr: EQDS23mtTZzPotx70f-SvOBgNNQhex7Q19KXxtX5ZsIAJrJY

Oleh: Hi guys, just registered for tonsmartchallenge4, where can I find the tasks?

Kai: https://github.com/ton-community/tsc4 (reply to 32466)

Oleh: Thank you! Can I submit same task multiple times? (reply to 32467)

Dmitry | backend4you.ton: yes, every push to repo laucnes github action that re-validates your code (reply to 32468)

Behrang: Is your wallet on testnet? Maybe you're still looking at your address on mainnet. (reply to 32465)

Łukasz: that's ok for now, enough time elapsed ;p (reply to 32471)

Andy: Why is TPOP not in the stdlib.fc 🤔

Alexander: FunC have a built in .at() method (reply to 32473)

Andy: It doesn't remove the element from the tuple. (reply to 32474)

N ! M A: Hi there  I'm wondering how we can buy a domain that expired  I know you have to buy it from auction again but you should activate the auction though?

&rey: ton://transfer/<your domain NFT address>?bin=te6ccsEBAQEADgAAABhO0UtlAAAAAAAAAACvkFQ4&amount=<first bid TON * 1 billion> (reply to 32476)

Павел: Hi there. Ca I somehow simplify such kind of code in funC?  ``` tuple r0 = empty_tuple(); tuple r1 = empty_tuple(); tuple r2 = empty_tuple(); ```

Daniil: Why would you need to (reply to 32478)

Павел: I need it to swap nested tuples

Павел: I know, that it must be simplest solution, but could not get it yet

Павел: Oh, can I get any index from tuple? For example, I need this one:  (tuple) get_nested_tuple_by_idx (tuple t, int idx) {   return t[idx]; }

Павел: As I understand, I can just pop last element from tuple and could not get any sequence element...

Daniil: There’s at() function (reply to 32483)

Павел: like this:   (tuple) get_nested_tuple_by_idx (tuple t, int idx) {   return t.at(idx); }   ???

krau5: Lol, tsc gh actions are running successfully once in a blue moon. First time - everything is fine, second time - unknown github user, third time - status code 502 + useless error message and I didn’t even change the code. What is going on? 😄

daedriner: Guys im totally new to this field. came here as a beginner what should I do to start with this and submit in contest

Adam: Hi people! I've just registered and cannot get access to tasks/repo are they no longer available?

Dmitry | backend4you.ton: https://github.com/ton-community/tsc4 IS available (reply to 32490)

— 2023-08-10 —

Luke: what does this mean

Luke: Error: Func compilation error: fatal: cannot compile lvalue expression with unknown constructor

CodeJogot: I'm new here. I want to solve problems on Ton Smart Challenge 4. Would you please help me to give me some resources where I can get proper guidelines and tutorials for this language and how to solve them?

play of the game: What is time complexity of tuple.at()?

play of the game: Does this return true? cell_null?(begin_cell().end_cell())  Edit: tested, it doesn't.

User<6247944943>: For coding habits, can we place the code here, adjacent to end_parse(), or not, as shown in the next screenshot?    What is the difference? Is it related to the Gas Cost?   The compiled Hex Code for contract was different!

User<6247944943>: (Both cases can compile, the msg part) (reply to 32504)

User<6247944943>: MsgAddress, 267 bits (2 bit tag, 1 bit anycast, 8 bit workchain, 256 bit address part), (reply to 6087)

Dmitry | backend4you.ton: https://docs.ton.org/develop/func/overview (reply to 32499)

User<6247944943>: ? (reply to 32502)

&rey: O(1). (reply to 32500)

play of the game: It returns false (reply to 32508)

Sean: is there a leaderboard during the contest?

Gulolio: Hi there guys, how can I modify an specific element of a tuple? I imagine this won't work right: my_tuple.at(index) = 1 for example. Is it possible?

Dmitry | backend4you.ton: yes, "Leaderboard" button in bot (reply to 32511)

Sean: thx

User<5417708468>: How does one go about creating  a marketplace like the silk road ..2. N 3 lol .agora. marketplace,dream marketplace...all now gone. To once again exist. Perhaps not identical but a user would feel comfortable with reviews/feedback s. The option of escrow but can turn it off once they trust there new seller . Express and airmail only and for starters North America and Canada must always be included aha .using bitcoin

&rey: This is TON, not BTC chat. (reply to 32515)

User<5417708468>: Tell me where it'd be appropriate to send that

User<5417708468>: Then please

User<5417708468>: N thank you

&rey: You can use the following function: forall X -> (tuple, ()) set_at(tuple t, X value, int index) asm "SETINDEXVAR"; my_tuple~set_at(1, index); (reply to 32512)

User<5417708468>: Please im no Hecker modder ext

User<5417708468>: Barely understand how to work this half of the time

SadeQ▪️: Does anyone know how I can participate in the TON Smart Challenge?   I sent my gitHub account for the bot, but nothing happened

ГУБЕРНАТОР | GOVERNOR: Hi everyone! what project is shown here? (website/app)  https://github.com/ton-blockchain/ton

Daniil: TON (reply to 32524)

ГУБЕРНАТОР | GOVERNOR: App? (reply to 32525)

&rey: Blockchain. (reply to 32526)

ГУБЕРНАТОР | GOVERNOR: Cool (reply to 32527)

&rey: Here's its overview: https://docs.ton.org/learn/introduction (reply to 32528)

ГУБЕРНАТОР | GOVERNOR: Thank you!) (reply to 32529)

play of the game: If I store more than 1023 bits into a builder, does it throw an exception or just create a new cell, reference it and continue writing?

Andrey: Throw an exception (reply to 32531)

Andrey: Cell overflow

play of the game: How am I able to create a tree of cells? For example storing a very long string in a tree(or linked list) of cells?

&rey: beginCell().<store something>.storeRef(beginCell().<store something next>.endCell()).endCell() (reply to 32534)

play of the game: One idea is to create a tuple of builders and write all the data, then iterate from right to left and on each element, store the reference of it's neighbour and close the cell. Any better ideas?

play of the game: Nice (reply to 32535)

&rey: That's correct. (reply to 32536)

play of the game: Basically the same though I guess (reply to 32536)

gary: How to transfer NFT and monitor the transfer using Node.js? Do you have any sample code?

Sean: so where can we get these function api info? I don't find them in the official documents (reply to 32520)

&rey: This is assembler intrinsic for https://docs.ton.org/learn/tvm-instructions/instructions. (reply to 32543)

Sean: Oh, it is in the TVM instructinos, not FunC cookbook. Thanks a lot.

gary: I haven't written any contract code. I minted the NFTs using the example on the official website, but I need to transfer and monitor them. (reply to 32540)

Step: Check tep standard for nft (reply to 32546)

Step: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md

gary: thanks, but do you have any relevant example code for Node.js? (reply to 32548)

Andy: Do you mean that you registered with the bot? Anyway, the tasks and additional instructions are here: https://github.com/ton-community/tsc4 (reply to 32523)

Step: Check tonweb source code (reply to 32549)

gary: OK，thanks

play of the game: Where can I read about the differences of load_int and load_uint?

&rey: load_int loads signed two's complement number. (reply to 32553)

Frosiva: Why there isn't any function for getting values from dict with slice index?

Daniil: There are (reply to 32555)

Daniil: But they aren’t stated in docs

Frosiva: (slice, int) dict_get?(cell dict, int key_len, slice index)

SadeQ▪️: Yes  Thanks 🙏 (reply to 32550)

play of the game: And in case of positive integer they're the same? (reply to 32554)

&rey: If the cell contains x{FF}, then load_int(8) will load -1 and load_uint(8) will load 255. (reply to 32561)

play of the game: Thank you very much (reply to 32562)

Tumin | Wagmi11: can I store bigint value in int type in func?

Andy: You can see all information on the Github: https://github.com/ton-community/tsc4/tree/main (reply to 32568)

Nikita: 👋 Hi everybody!  We would like you have a chance to visit a free Online Web3 roundtable with speakers from TON, Polkadot 1INCH and more!   Our upcoming event Venture Catalysts: Discussing VC's Role in Ecosystem Expansion and Profit  promises to delve deeper into the intertwining roles of venture capital and ecosystem growth.  🗓 Date – Aug 16th ⏰ Time: 12:00 CET  Engage with speakers, ask your questions, and contribute to the conversation!   Hope to se y'all there!   Register now to get in touch with the leaders of the Web3 march!   🔗  https://hopin.com/events/venture-catalysts-discussing-vc-s-role-in-ecosystem-expansion-and-profit?code=O1xcI3RFFt9CiUXNOZwdsk6W2

Tengo: Hi everybody!  There is an idea to create a guarantor service for secure transactions with payment in TON and other cryptocurrencies in the form of a telegram bot. I am looking for interested people and partners who may be interested in the implementation of this idea and who are ready to participate in this. I think this service could help many people.

ezji: https://app.tonkeeper.com/ton-connect?v=2&id=7e76f3b4b32db8f7987bfcdc3b7d648dced716a6bde116396e703bd91f84845d&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fdedust.io%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D   hi guys, who knows how to generate such link, which data should i plug in?

Tim: Tonconnect sdk does it for you

mohamed: where to find tasks?

— 2023-08-11 —

User<6195967334>: Hi

User<6195967334>: How to many TON testnet ?

User<6195967334>: I have tried tongiver Bot and ton.run but its really low

Arash Nemat Zadeh: I use .tuple_length() to get size of tuple but it doesn't work. Anybody knows why?

Arash Nemat Zadeh: Solved, never mind😄 (reply to 32583)

ezji: yeah, recently noticed, thx (reply to 32576)

TON technical overview: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 32586)

Adham: what language is used to solve the tasks and where can I find the documentation for it

Andy: FunC, you can find the documentation here: https://docs.ton.org/develop/func/overview (reply to 32599)

Adham: thank you so much (reply to 32600)

Danel: What is the burning address?

Клецка: burning address is an address used by no-one, where coins is being sent to burn (reply to 32602)

User<6195967334>: ? (reply to 32581)

War: Yes, kim dotcom youtuber 😁 (reply to 32581)

nonam3e: You may buy it in tonconsole (reply to 32581)

War: Hehehe

User<6195967334>: 7.81  for 9.9 per month ? Racketeering ? (reply to 32606)

User<6195967334>: How do you know I'm youtuber ? (reply to 32605)

War: Just guess (reply to 32609)

Frosiva: How can I Deploy contracts on testnet masterchain?

Михаил: I join the question, I am learning how to write the first smart contract and I get the wallet is not deployed error. There are coins on the wallet in the testnet (reply to 32611)

Alex: Have you ever come across the term "Sweep the Floor? It may seem to be a silly term but! If you are one of those people who are hunters of cheap and promising NFTs who have a long-term view of collecting NFTs, this article will definitely be useful for you. 🎟   Read the complete text here. 📰   Website | Blog  | Twitter (forwarded from TonRadar)

Lorenzo: In order to get some clarifications about tasks descriptions of tsc4, who can I ask to?

Tim: Ask in contest chat

Lorenzo: where can I find that? (reply to 32616)

Dmitry | backend4you.ton: https://t.me/toncontests_chat (reply to 32617)

Marius: Hey, is there any documentation on how to decode the data that comes back from "toncenter.com/api/v2/getConfigParam" ?

Lorenzo: Thanks! (reply to 32618)

Dmitry | backend4you.ton: blocks.tlb- search for ConfigParam (reply to 32621)

Вячеслав: Hi everybody  I have a function, which takes argument t as follows:  [int, int, int, int] t  Then untuple data like this:  (int a, int b, int c, int d) = untuple4(t)  And I want to calc this expression later:  int r = a * b + c * d;  But looks like the compiler does not undestand types here for some reasons: error: cannot apply function _+_ : (int, int) -> int to arguments of type (??20 -> ??21, ??22 -> ??23): cannot unify type ??20 -> ??21 with int  What's wrong and how to use tuple4/untuple4 properly?  UPD. Fixed. I've missed a space in the code near multiplication op

uɒɹɥəɯ: Hi guys, Is there any way to put a new bid on an existing auction on fragment in some programming language like csharp or javascript?

Dmitry | backend4you.ton: You need just send enough ton in “usual” transaction if I remember correctly… (reply to 32625)

uɒɹɥəɯ: If you're THE Dimigry, I'm using your C# library, TonLib :) any sample code available for sending such transaction? (reply to 32626)

Dmitry | backend4you.ton: TonLib.net is mine, yes, but I’m not DimiGry :) There is SendTon in samples, but before - it’s better to check Telemint contracts on GitHub to verify required body content.  I’m away from PC now, you can find link in Recipes/Telemint (reply to 32627)

uɒɹɥəɯ: :)) Sorry for the typo. Thanks I'll check them out. (reply to 32628)

User<5827654427>: Hello, here is a senior frontend developer looking for a developer position now.

User<5827654427>: Feel free to contact me if you need a dev.

User<5827654427>: am sure I could deliver perfect result with my front-end skills.

Tumin | Wagmi11: I have a slice message="message" stored in func  begin_cell() .store_slice(message) .end_cell()   I am using blueprint to decode the cell, I parsed it to slice how can I load string value?  export function decodeConfig(cell: Cell): MainConfig {     let slice = cell.beginParse()      return {           message: slice.load???(),     } }   I referring to earlier references to discussions made w.r.t to storing string in cells, and builder, and string ref so far I am overwhelmed, what is the write way to do it?  I have 3 string and 1 int value which I want to store it should I copule it all together as a cell, and send it to contract? how will it work with an op code? and where will it store it? because I want to save the data on c4  sorry for the confusion, I am confused myself

— 2023-08-12 —

TON Answers Bot (not AI): How does the MasterChain sync the finalty? from Howard  > There is a necessity for the synchronization of message routing and transaction execution. In other words, nodes in the network need a way to fix some 'point' in a multichain state and reach a consensus about that state. In TON, a special chain called MasterChain is used for that purpose.   > Blocks of masterchain contain additional information (latest block hashes) about all other chains in the system, thus any observer unambiguously determines the state of all multichain systems at a single masterchain block.   my question is how did it work in practice? Since L2s OP-stack also has tons of issued to do it.  🔗 Answer on TON Overflow

BruceWayne: 🇬🇧 @LibermallBot: The first open-source cryptocurrency wallet in Telegram on the TON platform!  We are proud to announce that the @Libermall bot has become the first cryptocurrency wallet on the TON platform in Telegram, the source code of which is available in open-source! This is a big step forward in terms of transparency and community trust.  🔗 Check out the source code on GitHub: https://github.com/Libermall/Telegram-Cryptocurrency-Wallet-Libermall  Use on health. Based on it, you can create your own CryptoBot.

BruceWayne: The bot is written in .php  The functionality is quite extensive, the code is open (and quite simple to implement). You only need to put Docker on the server (reply to 32648)

Howard: Can't find the way convert to English menu (reply to 32648)

Sasha: Hi, I have a simple function int Sum(int a, int b) {     return a + b; } how do I debug it Main.spec.ts?

nonam3e: you may put it in get method or dump the result value

King Favour: Hello everyone

King Favour: GM

King Favour: We would like to help TON gain quick adoption through a large web3 dev and design academy in Africa

King Favour: Who do we talk to?

King Favour: Does anyone know?

Anthony: Hi! You can talk with me (reply to 32657)

King Favour: I've sent you a dm @tsivarev

User<6393327852>: Hello everyone

Anton: Hello. Could someone share a valid testcase for #3? 0/20, I definitely misunderstand the task:(

Sasha: In task 5 my local tests are working fine, but i have only 1/30 tests passed in submition. Does anybody have any idea why could this happen?

Arash Nemat Zadeh: Hello guys  In task 4: how to get the text from a cell? Should we load_bits() ? And when we did, how to access a character of this string by its index?

Anton: At least advice If I have 10101 and rule 101->111 Should I have 11101, 11111 or 10111 ? (reply to 32663)

Daniil: 11101 (reply to 32666)

Arash Nemat Zadeh: does anybody get this error: CompilationError: Compilation error logging temporarily disabled ?

Anton: Try commenting all ~dump and dump_stack (reply to 32668)

Handsome: The first thing that would have come out of this is flag for different languages (reply to 32648)

Leon: Can someone help me with piggyback term of this part of doc ... Thank you 🙏 (forwarded from Leon)

Клецка: send message back to sender. if i remember properly (reply to 32672)

Leon: Thanks , also appreciate more explanation

Клецка: there is a thing called a bounced message. it is a message that's been send back to sender if some error happens or it can be manually generated via message config bits (reply to 32674)

Клецка: only internal messages can be bounced (reply to 32675)

ROADTONE: Hello devs.

ROADTONE: Can someone send me a bit of ton testnet please?  kQDAwBwdM_Nx7YOlwp6KhoMg2Hh7xffXTw2mkMGT-xvgGX5L

Adie Baron: Anyone please help give me litle some sTon tesnet  kQAXPNBhUgvYfwSvmM--BQcYhwzZnL-AslMYOxJ--xbSQxXH

Arsen: @testgiver_ton_bot (reply to 32678)

Arsen: @testgiver_ton_bot (reply to 32680)

Adie Baron: BOT not respon sir (reply to 32682)

WFN: send 1 TON 🙂 (reply to 32678)

ROADTONE: Thankyou my friend (reply to 32684)

&rey: I believe a testnet-TON-asking spam is going on. (reply to 32680)

Petra: Hola

Adie Baron: What (reply to 32688)

Клецка: and... what it's purpose?.... (reply to 32688)

Ky: Someone can you send me ton testnet ?

Ky: kQCfXGuHGOOWY-VuJuAaJKXZvoao9o9lss3e9D3h8M4oc4FS

Handsome: Guys where can I get 100 test tons?

Handsome: Testgiver bot is just 2 tons per hour, not fair

Handsome: We should have a chance for more

User<6442321292>: Please give me test ton 🙏  kQADIqq37M27EmUvlbp9JODSHjB6vMk7LNZTdoetJsjyBjfW

User<6442321292>: Faucet bot not active

User<6442321292>: Thanks (reply to 32701)

Arsen: That's all what i got on testnet 🙂 enjoy.   I personnaly don't understand why you use testnet, when fees on mainnet are extremely low , and you can test whatever you want with few dollars. I wrote a payment gateway , did thousands of tests. and i spend around 10-20$.

🐤Gorge 🆓🌱SEED: Hello can i get Ton testnet please Bot not active  kQCr9V0mjQ-WJptFjP7_L8WmbvbMX93V-027sxKxQjj1XdO2  Thanks

Arash Nemat Zadeh: In task 4 do we have only one cell? Or text is long and stored in multiple cells?

Ky: Bot not working please help me i need some ton sir  kQCfXGuHGOOWY-VuJuAaJKXZvoao9o9lss3e9D3h8M4oc4FS

Handsome: Bro I don't live in your country. Test tons is easier for me (reply to 32704)

Вячеслав: is there any native way to calc sha256 for data over 1023 bits? i don't see anything except https://docs.ton.org/develop/func/stdlib#string_hash

Hilman Σ: Please give me ton testnet   kQBxpSoMvl3rImZns63PyA9to4Aq4891Q2sUdIMkzfK7_WzY 🙏🙏🙏

Percy: can anyone help me to give some ton to perform test tasks

ADI 🆙 UXUY 🌱SEED 🐦SUI ▪️ 🐾 🍋 | Drops💧(Ø,G): Please Give me Ton Testnet  kQBNs2emVg670oVfZy0_6tGai3EBEigXT5tvpCzz313JhDQZ

— 2023-08-13 —

Roche: kQBmj7KsJkxnFv7QeNnARrFUFMJQdSlp5Sx13Lx6YSsf-dTU

Roche: Give ton tesnet

User<6392716793>: Claim tesnet kQB1QiPc7frFgIKWe_ORou6sEcL7ygl31cfiNSfrlUxOQHFe

Arash Nemat Zadeh: How can we mine TON on testnet for ourselves without thirdparties like telegram bots?

WhiteTEA: @testgiver_ton_bot here you can get testton (reply to 32710)

Hilman Σ: Still not rcv (reply to 32717)

Ares: Read when Request added to queue for execution please wait (reply to 32718)

DREAM THE IMPOSSIBLE🐾$VROG: Help. i need tons of testnet  kQAehHOzWVKMtFgxJbfNIwYjLejFr6SUaZVJfdYmTrsrsGOR

sdasd: Do you know any promoters in Indonesia

Maksim: why there are so many people asking for testnet tons?

Rf: please ton token testnet   kQBmJYA1eBxUs-LKI8C_-BqUuW3OVO4w3s8hsNpL-c4qZ2cO (reply to 32688)

Handsome: Dude there's a competition for 30,000 tons haven't you heard? (reply to 32723)

F: To get test coins, use bot @testgiver_ton_bot. At the moment the bot is heavily loaded (everyone wants test coins) - the waiting time for the withdrawal queue can be up to 5 hours: https://testnet.tonscan.org/address/EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC You can also use checks in the bot (however, at the time of writing this text, this bot also has some withdrawal problems): http://t.me/CryptoTestnetBot?start=CQPlopmSgyTQ We sent test coins to all the addresses that we saw in the chat. You can also write to me in a personal to receive test coins (response time can also reach several hours) We have received your wishes to improve the @testgiver_ton_bot and will improve it.

Maksim: share the link pls (reply to 32725)

Romie🦴 Σ: Ton faucet testnet no work sir

Romie🦴 Σ: kQDyfSeKJMSs6nO5bQ-h9Kt9rsoMjSrfnubxzJQc7Ril18kC

Maksim: or you mean tsc4? then i still don’t get why people need testnet toncoins if they can test contracts locally (reply to 32725)

User<6247944943>: what is the one means here in the test library?

User<6392716793>: who needs Ton test exchange with 0.2 matic / 1 ton

User<6392716793>: DM me

Андрей: https://t.me/toncontests_chat/19889 https://t.me/toncontests_chat/20520 (reply to 32727)

Handsome: Message doesn't exist (reply to 32738)

Maksim: yeah but why do they need test coins if there is blueprint and sandbox (reply to 32738)

TON Answers Bot (not AI): How to bring `op-code` to Hex? from Howard  In Blueprint, we will need to write the Wrapper functions ourselves.  More importantly, when we code the op code in our FunC code, we need to decode the string into a Hex op-code and then convert it to the uint and hex data types.   For example:  const op::increase = "op::increase"c;  ;; create an opcode from a string using the "c" prefix; this results in the 0x7e8764ef opcode in this case.    My question is, how can we generalize the process to convert a String into uint and hex data normally?  🔗 Answer on TON Overflow

Howard: maybe https://emn178.github.io/online-tools/sha256.html (reply to 32709)

Andy: Multiple cells, anything over 1016 bits is stored in one reference cell, and so on (reply to 32706)

Andy: For cells/slices that store additional data in references you can use cell_hash or slice_hash - they'll account for references too. (reply to 32709)

Вячеслав: cell_hash is not about sha hash only according to this: https://docs.ton.org/develop/data-formats/cell-boc#standard-cell-representation-hash-calculation (reply to 32744)

Andy: Just read that article and it doesn't seem to mention any hashing algorithm besides sha256 (reply to 32745)

max mix 🐾 Σ: Hi  I wanted to buy a dns name that belongs to someone else, that expired two days ago. The details showed that it should be available for auction again but that doesnt happed and just says its expired on 11.08.2023 How much we should wait to be on auction again?! Or what should I do?

Вячеслав: I think I know the content pretty well, but the question was not about it :)  I didn't ask how to find a cell hash. I want to calc hash of custom binary data exceeding 1023 bits. It means that I can't store my data into a single slice, so string_hash is not applicable.   On the other hand, cell_hash is not only about sha256 hashing, it's rather TVM-specific way to represent some cell using sha256. (reply to 32746)

Andy: How are you going to store that data? (reply to 32748)

User<6247944943>: what is polymorphic null? built-in means here in FunC standard lib?

Daniil: it means that you can do: if (null?(my_value)) { something } (reply to 32750)

User<6247944943>: Except with description: 1/ What should we noticed else? 2/ What is the gas cost different with dict_empty?()?   https://docs.ton.org/develop/func/cookbook#how-to-determine-if-dict-is-empty (reply to 32750)

.: hello, I'm having trouble getting tons of testnet, can anyone help me? thank You  kQAf11PStuT3n3NHzF-o5sYypWnkfNTC_v6e_6scrOwTPTgm

Donny: i request Ton faucet many time, but not sent yet till now.   kQAU6rk1gMG4Ib6xVJcmwjQvnPF2zRA2fZsWD9ZkhL7CDIGQ

User<6247944943>: Since I am checking in Telemint FunC Code:  Why it can use like this that with same if status shows multiple times.... (reply to 32751)

ᯓᥲᥣᎥ ƙɦᥲꪀ: کسی هست واسه شرکت توی چالش کمکم کنه ؟

Leon: I need an explanation about toBoc and fromBoc Or link to some guide, thanks

Leon: Bag of cells, found it 😇 (reply to 32757)

0xRemoved: Help i need tons of testnet  kQBX1hRVUNzqRUPg4F44JAbdy-JKBiIuiMeljnAVbufjvWBp

User<5916175317>: hey guys

User<5916175317>: I have deployed a nft contract to testnet this is the contract https://testnet.tonscan.org/address/EQDTnCO1FjcGdv1dNesfo-6N3HOTOBywt_5DAvH8unTpY6dX  how can I know this is deployed correctly and working?

max mix 🐾 Σ: Any helps? 🙏🏻 (reply to 32747)

Andy: just try opening the link below on your phone (reply to 32763)

Samyar: Try the vscode terminal too   It displays it just fine there (reply to 32763)

Олег: Your contract is labeled as “Unknown”, but should be “NFT Item”. I recommend you to test it with tonviewer.  NFT item should have get_nft_data method.  https://testnet.tonviewer.com/kQDTnCO1FjcGdv1dNesfo-6N3HOTOBywt_5DAvH8unTpYxzd (reply to 32761)

Sorna: Hi

User<5916175317>: Thanks bro But do you know how can I interact with that contract and call for example mint function? Is there anything like etherscan here? (reply to 32768)

Олег: There is a little bit different model of minting NFT than in ethereum. You have 2 contract: 'NFT Collection' to minting NFT and 'NFT Item' itself. There is no centralized smart-contract for storing ownership in TON blockchain.  You can read more info there: https://docs.ton.org/develop/dapps/asset-processing/nfts  https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md (reply to 32772)

Fallen: Yo

User<5916175317>: Can I deploy only 1 nft item without nft collection? (reply to 32773)

Fallen: Ummm, I'm new here and clueless at somethings. So.....

Fallen: Can anyone send me a document for this project

Fallen: I'm a fast learner

Олег: Sure you can, just specify empty address of collection_address field (2 first bits equal to zero) (reply to 32775)

User<5916175317>: And I have one another question. In ton how nft marketplace contract works? I think for any listing contract have to update or user create a new contract. Am I right?

User<5916175317>: 👆👆 (reply to 32779)

Олег: They just read all user's transactions and try to find an NFT contract, as I know. Btw, if you deploy your own nft in testnet, you can find it in testnet.getgems.io (reply to 32780)

Fallen: Could you please send a code snippet for this project just a small version for it, I will try my best to analyze and comprehend it

User<5916175317>: Do you have any working nft marketplace contract code? I wanna write nft marketplace contract for myself (reply to 32782)

Олег: I will provide you an example of working contract, try to explore how does it work by yourself:  https://testnet.tonviewer.com/kQByDqUjb1orPTfqjPpxRro2lBmsZTSQSp7BCXVwiTMn491k  https://testnet.getgems.io/nft/EQByDqUjb1orPTfqjPpxRro2lBmsZTSQSp7BCXVwiTMn42bu (reply to 32784)

User<5916175317>: Thanks bro I will do it (reply to 32785)

User<5916175317>: And what about marketplace (as like as getgems) I wanna write my own marketplace contract to sell nft in fixed price Does it exists something like this on GitHub?

Олег: Note that this is semi-chain contract and metadata is stored in blockchain. But you can also create an offchain contract with metadata stored in the internet (reply to 32786)

Олег: https://github.com/getgems-io/nft-contracts (reply to 32787)

User<5916175317>: I am familiar with this bro I am ethereum developer and just new in ton (reply to 32788)

Lorenzo: in funC What is tuple time complexity when adding n elements? I mean at every add it does something like reallocate the whole "array"?

&rey: Yes, it does. TVM objects are immutable. (reply to 32791)

Daniil: Gas cost for TPUSH is 26+(resulting length of tuple) (reply to 32791)

Lorenzo: Thank you. and what is the best way to initialize a tuple with a specific length?

Lorenzo: wait, nothing (reply to 32794)

&rey: TUPLE or TUPLEVAR asm instruction, I guess. (reply to 32794)

Lorenzo: Thank you but I realized that then I can't modify it (reply to 32796)

&rey: SETINDEX/SETINDEXVAR. (reply to 32797)

Daniil: You can (reply to 32797)

Lorenzo: . (reply to 32792)

Lorenzo: ?

Lorenzo: Im confused xd

&rey: SETINDEX Computes Tuple t' that differs from t only at position t'_{k+1}, which is set to x. (reply to 32800)

Daniil: Integers in python are also immutable, but you still are allowed to do “x += 1”. These operations just create new tuple and replace the old one (reply to 32800)

Lorenzo: It seems a very unusual strategy (reply to 32804)

Daniil: Why? (reply to 32805)

&rey: It is used to disallow creating circular cell references. (reply to 32805)

Lorenzo: Based on what I understood, If I want to modify an element in a n-uple I have to recreate the whole new n-uple with the modification (reply to 32806)

Daniil: Well, yes, but the TVM does it for you when you call SETINDEX (reply to 32808)

Lorenzo: ok, but isn't  inefficient? (reply to 32809)

&rey: I guess that could be implemented as copy-on-write. (reply to 32810)

Lorenzo: mhm. And a simple sort? It should be O(n*n*lgn)? (reply to 32811)

&rey: You can do it on TVM stack with O(n*log n) complexity, I guess.

Svαtoωλ‎: Received event id (=23) must be greater than stored last wallet event id (=813)  i'm using pytonconnect, and when 1 from 10 users scans QR code, i got this error. What to do with it?

0xHadi: Hello everyone please give me TON testnet, faucet not working.  kQCDy9QWLhXKpMKpFlrZJlhrQ7Kza-YdPNmjDc9uIlSIO9a3

Howard: https://t.me/testgiver_ton_bot   and just sent 10 testTON to you. (reply to 32815)

TON Answers Bot (not AI): Telemint / Fragment.com NFT  from Howard  Has anyone ever written test cases for Telemint (also known as the Telegram anonymous phone number)?  GitHub Link to Telemint  The code is quite complex. I hope someone can share insights and test cases.  🔗 Answer on TON Overflow

Illia: Hello, I have a strange error, this code throws runtime error:  "Error: Unable to execute get method. Got exit_code: 7"  But if I comment this loop and iterate manually L147-151 - no errors are thrown

&rey: Maybe you use i somewhere lower? (reply to 32818)

Illia: Naah, here is a full version of this program  (tuple) write_bit(tuple lisp, int bit) {   if (lisp.is_null()) | (lisp.car().builder_bits() == 1023) {     lisp~push_back(begin_cell());   }    builder b = lisp~pop_back();    b~store_int(bit, 1);    lisp~push_back(b);    return lisp; }  ;; testable (cell) find_and_replace(int flag, int value, cell linked_list) method_id {   tuple lisp = null();    int i = 0;  ;;   while i < 5 { ;;     lisp = write_bit(lisp, 1); ;; ;;     i += 1; ;;   }    lisp = write_bit(lisp, 1);   lisp = write_bit(lisp, 1);   lisp = write_bit(lisp, 1);   lisp = write_bit(lisp, 1);   lisp = write_bit(lisp, 1);    return begin_cell().end_cell(); } (reply to 32819)

Illia: And this on top:  forall X -> int is_null (X x) asm "ISNULL"; forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS"; forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS"; forall X -> X car(tuple list) asm "CAR";  () recv_internal() { } (reply to 32820)

Howard: can you post the full question on answers.ton.org? And give more context here, so people can more easily answer this question maybe 🤙🏿 (reply to 32820)

&rey: With the manual loop unrolling, lisp is totally optimized away and does not create errors. (reply to 32820)

&rey: write_bit has some errors in it.

Anton: May be someone can advice with #4?  all my tests pass perfectly. still 0/133. abcd, shift 1 encodes to bcde. abcd, shift 2 decodes to yzab. encode(abcd, 1) -> bcde 00000000 00000000 00000000 00000000 01100001 01100010 01100011 01100100 00000000 00000000 00000000 00000000 01100010 01100011 01100100 01100101  decode(abcd, 2) -> yzab 00000000 00000000 00000000 00000000 01100001 01100010 01100011 01100100 00000000 00000000 00000000 00000000 01111001 01111010 01100001 01100010  What am I doing wrong?(

&rey: encode(1, abcd)? Does it handle multi-cell strings? (reply to 32825)

Anton: it did in previous versions, but then I found out they are not in test case... Not a problem to return them back, I just began cutting off everything that could cause problems (reply to 32826)

&rey: It seems like testing stops at the first failed test, so you are failing test 1. To my knowledge, it is multi-cell. (reply to 32825)

Coalus: No, tests doesn't stop at the first failed test (reply to 32828)

Anton: It... wasn't obvious... Thank you.  BTW it would be great to include at least 1 test case in future contests. It worth nothing, having all the Blueprint infrastructure in repo... (reply to 32828)

&rey: Then the system does not report true number of passed tests, as discussed in FUNC GANG. (reply to 32829)

Gulolio: Hi there guys, how can I make an in place replacement of the bytes in a cell? For example, if I have a cell like, begin_cell().store_uint(val, 8).end_cell(), is it possible to change the cell? Like to change those 8 bytes for another one, without creating a new cell, like an inplace replacement. Is it possible at all? Maybe with in a slice.

Gulolio: I haven't found a way, so I'm thinking that maybe is not possible and made on that way on purpose. Let me know if I'm wrong in any case. Thanks in advance

Ńúri Ýe Arsii Lij: Thanks (reply to 32838)

x: Thanks to tonbyte.com, we can drop any collection on Getgems without worrying about technical stuff. The site has tools like Create Collection, Mint and also other things. They are getting improved day by day. Magic will happen 🏗 ✈️ Check and create your bulk-size collection! ✈️ @TONBEANZ (forwarded from TON BEANZ)

&rey: No, the cells are immutable, partially because you can cheaply calculate the cell hash. (reply to 32837)

Seth: Help. i need tons of testnet❤️  kQCXOYWkZ2tDK7lPliSg7xdlwBlQTpHWr63rudhl7cMET6t0

ba5defghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl: Use that @testgiver_ton_bot (reply to 32851)

&rey: Faucet is a bit overloaded, please wait when your coins arrive. https://testnet.tonscan.org/address/EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC. (reply to 32850)

Seth: I've done it but I don't get it (reply to 32853)

&rey: You can use https://tonconsole.com/faucet to buy testnet coins (🤣) faster.

Seth: Help. i need tons of testnet❤️  kQCXOYWkZ2tDK7lPliSg7xdlwBlQTpHWr63rudhl7cMET6t0

NDA: Check your test wallets, the testgiver issue should be resolved 🌚 Should deposited 5 TON per wallet!

ËL PÏČªS BRØ: Cómo es esto Bros soy mew

ËL PÏČªS BRØ: Digo nuevo

max mix 🐾 Σ: Need help 😕 (reply to 32747)

Howard: 1 TON : 0.05 testTON!! 🥵🥵🥵 (reply to 32856)

Alex: Hi

Alex: When will the TVM update be ?

— 2023-08-14 —

Seth: Help. i need tons of testnet❤️  kQCXOYWkZ2tDK7lPliSg7xdlwBlQTpHWr63rudhl7cMET6t0

Ahmed: 😱

Андрей: I think it is possible to ban messages with the request for test coins after the @testgiver_ton_bot was upgraded to a high-speed wallet and the issuance of coins was increased to 5 at a time

Dmitry | backend4you.ton: Upgraded to non-working state? :)

Dmitry | backend4you.ton: I cancelled captcha (because it was unclear) to get new one, but after that bots ignores all my commands

NDA: try again (reply to 32877)

Dmitry | backend4you.ton: it worked again, thanks!

Akande: I don't understand anything here

User<5916175317>: Hey guys Is there any way to sell my anonymous number nft without %5 commission?

User<5916175317>: How can I write a contract for sell it with 0 commission?

User<5916175317>: How this sell works on getgems and fragment? Is there a way to call startAuction function with custom fee?

Dmitry | backend4you.ton: Make a contract that sends “transfer” message to number contract as soon as it receives internal tx with enough ton. Deploy it, transfer NFT from your wallet to that contract and wait. (reply to 32884)

User<5916175317>: Do you have a code like this contract? I am new in ton contract development (reply to 32886)

Dmitry | backend4you.ton: It’s better for you to use existing tools and services - safer and cheaper ) (reply to 32887)

User<5916175317>: In ton everything is different from ehtereum For example getgem deploys a contract for every single sale

User<5916175317>: It is not cheaper bro cuz they give %5 for sale (reply to 32888)

Dmitry | backend4you.ton: Usual numbers costs below 200 on fragment, I don’t know what is your desired price but don’t think you’ll get custom smartcontract for 10 usd (reply to 32890)

User<5916175317>: I just wanna know is ot possible to do that? Cuz fragment uses number's smart contract to sell it and I think they have their own function inside code (reply to 32891)

Dmitry | backend4you.ton: But they understand “transfer” operation and can change their owner by command from current owner. No matter why current owner decided to perform that transfer

gary: hello, Can I determine whether I am receiving an NFT or a jetton by using in_msg.body.type of this API?

gary: I don't know how to distinguish between transaction types.

Ігор: Good day everybody. I wanted to ask how to find substring in string? Do I have to use slices or it is better to covert them into integers?

Andy: Depends on your implementation really

Ігор: I am thinking on the way to iterate along slices. I do not know were it is easier to do

Ігор: Like I can compare string and substring by symbol, but it can be too complicated in terms of optmization

Marius: What comes back from querying the lite-server for the validators via "getconfig 34" looks like this:   public_key:(ed25519_pubkey pubkey:x617ACBDB702A27C6C77A1015FC533845A180CD83263E74D1720EAC3B642B4E9E) weight:1910386703467452 adnl_addr:xD54F83E3CC253FD4A097DCD962DFA9AE29A33E4B21634820D042E5D77FCA955A)))  How can I "convert" this to an address i can put into tonscan.org?

Tumin | Wagmi11: how can I load this data? (reply to 32535)

&rey: slice ds = your_cell.begin_parse(); process(ds~load_bits(ds.slice_bits())); ds = ds.preload_ref().begin_parse(); process(ds~load_bits(ds.slice_bits())); ... (reply to 32904)

Alex: It says "This update is expected to be released on the test network by the end of May and on the main network by the end of June"   https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07  Who knows when it will be released to the main network???? Can I DM you? I'd appreciate it.

farhat: Bonsoir

farhat: Why did you delete my account

farhat: Brkgold !!!!

farhat: Will you answer my question

User<6393327852>: Hello everyone

User<6247944943>: Did anyone know who build this? (reply to 26257)

User<6247944943>: Or give a way that can test Telegram annoy number in testnet?

.: i want to ask, can i request ton test token more?

Howard: https://t.me/testgiver_ton_bot works fine for me (reply to 32917)

Gulolio: Hi there guys, maybe a silly question here, is it possible to pass a function as an argument of another function in FunC? Like a callback function, an equivalent in C would be something like this: char *example_function(char *val, void *fc_cb(char *))  Where fc_cb would be the callback function passed as an argument in the definition.

&rey: Yes. The type is called cont, or (int -> slice). (reply to 32919)

Gulolio: Nice, I started hating the language, now I'm kind of loving it a bit😂😂. Thanks btw (reply to 32920)

Vb: Guys I'm new to this TON and codeforces. Can you explain me what is that I need to do..

Arash Nemat Zadeh: Can we edit an item inside tuple by having its index? Or we can just push to and pop from tuple?

— 2023-08-15 —

Yang: Dear all, I have a question for you:  This is the Ton Status  Trading Volume (blue line) & Trading Volume Sum (bar) for the past month. What is the reason for the spike in trading volume every 2-3 days? (The only thing I can think of is the election)  The daily volume is shown as 500M

Yang: This is the analytic chart of Ton Scan , the total transaction volume is about 25M, why is there such a big difference between the two sides of the data?

Akande: DM me (reply to 32926)

Kate: Hi everyone!  For those who will be in Lisbon this Thursday, August 17th, TON Society Europe is kicking off its journey with an exciting offline event🚀  We’ll be happy to see you there:

Kate: Just 2 days left until the meetup in Lisbon!🔜📢 How can routine legal matters bring joy to Web3 teams? And why was the decision made to integrate a legal tech startup into Telegram? We met with a speaker and recorded a short interview:   🎙Artem Afian, CEO of Delegate Bot, is a first-wave crypto lawyer and a legal tech entrepreneur. He is a well-recognized lawyer practising in Ukraine and a member of the World IT Lawyers Association.  What are the top 3 main mistakes/stereotypes of web3 teams regarding legal aspects? Thinking that legal is unimportant and can wait. I can say that legal matters are as important as choosing a tech layer. In fact, companies and projects should pay attention to legal issues from day 1.  Why was the decision to create a bot specifically on Telegram and on TON?  First of all, because of its technological capabilities. Cool web apps are an interesting part of the ecosystem. The ecosystem is still developing, and the most interesting part involves trying to build something inside a super app. That’s the main challenge because we don’t want to create a separate ecosystem; we want to be integrated into something significant. That’s why TON.  Contracts: where does the pain end and the pleasure of using begin? The main pain of contracts is that nobody understands them. All this works as an ancient ritual. We take obligations by carwing them on pieces of wood with signs we do not understand. All of this can be reimagined.  Will it be possible to test one of these contracts directly at the meetup 17.08? Of course, we can sign it during the event. I'll show how it works, and I hope everybody will have fun. Let's see how legal can bring joy:)  📅17.08 ⌚19.00 📍grow.inc SPACES  Don'‎t forget to reserve your tickets and check the agenda HERE.   See you at the TON Society Europe meetup💎

Benji: Hey guys, does TON guarantee single threaded execution within one round? Concretely, if I send two messages to the same contract they're never executed in parallel?

&rey: Yes. One transaction is processing one incoming message, and transactions are combined in chain. In fact, probably no messages in single shardchain are executed in parallel at all. (reply to 32932)

DREAM THE IMPOSSIBLE🐾$VROG: hi sir can i have ton testnet i really need it thank you   kQAehHOzWVKMtFgxJbfNIwYjLejFr6SUaZVJfdYmTrsrsGOR

Benji: How to convert from Address to Int in tact?

Олег: Hello, have you got any problems with deploying today? I can't deploy my contract about 5 hours 🤔

Gunnar: I've been trying to get some info about the current validation cycle and active validator - but calling get methods on the elector doesn't seem to work?   active_election_id is always 0 and participant_list is always [] :(  Have I misunderstood something, shouldn't this work?

Behrang: Try to call them between the election start and end time.

sdw: Hello,   is there any verification for off chain message signing on TON. Like Ethereum or Solana? Thank you

Benji: I don't think wallets on ton support that

Howard: we have external message that you can pass to the smart contract then execute. That is more like the traditional signing as we did on Ethereum.   Other way is just let the owner of the private_key(Wallet Owner) send the transaction to the smart contract.   https://docs.tact-lang.org/language/guides/external https://docs.ton.org/develop/smart-contracts/guidelines/external-messages (reply to 32939)

Alex: Website | Blog  | Twitter   TOP 1️⃣0️⃣ #Dapps by #weekly users ❗️ (forwarded from TonRadar)

DREAM THE IMPOSSIBLE🐾$VROG: hi sir can i have ton testnet i really need it thank you   kQAehHOzWVKMtFgxJbfNIwYjLejFr6SUaZVJfdYmTrsrsGOR

Yang: @testgiver_ton_bot (reply to 32944)

Benji: But both of these methods use gas (reply to 32942)

Клецка: btw. does external messages use gas? (reply to 32946)

Клецка: so, it means, anyone can just spam my wallet contract and leave me without coins?

&rey: If contract accepts them. (reply to 32947)

&rey: There is a little gas credit, within which contract makes the decision to accept message.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: how to use fift function in func? is there any useful link please?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: for example II have a number generator in generator.fif named :generator which has one number as input and returns a hashed number  how I can call it in the my FunC method (reply to 32952)

&rey: Fift is executed during compilation, so you can't. (reply to 32955)

&rey: https://docs.ton.org/develop/fift/fift-and-tvm-assembly (reply to 32952)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what? 😂 I want to ask about translating my fift code (1 line) to asm 😂 (reply to 32958)

&rey: You may as well ask here, I think. (reply to 32959)

&rey: If you're asking about private code, you can create some public example.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you right, sorry.  I want to translate it as asm to reduce gas usage of my FunC code { 0 1 rot { 2dup + } swap times } : generator (reply to 32961)

&rey: I understand that you're trying to solve task 5 😀 So I will mention only part of asm code: "REPEAT:<{ 2DUP ADD }>".

Asher: https://www.youtube.com/playlist?list=PLtUBO1QNEKwttRsAs9eacL2oCMOhWaOZs (reply to 32955)

Gulolio: Guys one question about the Ton Smart contract contest, I received this notification about an update on task 3. But the update talks about basically task 5 but instead of n+k <= 370, now 371. So my question is, is task 3 still the one related to replace binary substring or really changed to this.

nonam3e: it's about the 5th task, 3rd task hasn't changed (reply to 32966)

— 2023-08-16 —

Luke: i have a question regards asm functions

Luke: how do the outputs work

Luke: like if u have 3 outputs, does it just take the top 3 numbers on the stack?

Luke: same for input like if i have () f(int a, int b) asm "CMD",     is the stack just "... a, b" and it calls CMD

Maksim: you need 34 config parameter: it returnes public keys of current validators. If you need their ip you can get them via DHT (reply to 32937)

Maksim: active_election_id == 0 means that there are no elections rn. You can also call get method past_elections_list to get info about previous elections (reply to 32937)

TON Answers Bot (not AI): Expand the case of `commit()` phases? from Howard  According to the documentation, we find the commit() FunC code described as follows:  Commits the current state of registers c4 (“persistent data”) and c5 (“actions”) so that the current execution is considered “successful” with the saved values, even if an exception is thrown later.  https://docs.ton.org/develop/func/stdlib#commit  The description may be confusing. Here are some questions to clarify:  - What will we receive in terms of an exception or error if we have already committed the code to the smart contract? - Why do we need to commit the data or status to the smart contract code even if it will result in an error in the end? - What will be the consequence if the smart contract receives an "unknown error status"?  🔗 Answer on TON Overflow

User<5916175317>: hey guys  throw_unless(501, op == op::ownership_assigned());  what op have to be to pass this?

mohamed: can someone please send link to TSC4 tasks repo

Step: What contract is this? (reply to 32977)

User<5916175317>: a nft sale contract  here is complete functon  if (~ is_initialized) {                  if (equal_slices(sender_address, marketplace_address)) {                         return (); ;; just accept coins on deploy                 }                  throw_unless(500, equal_slices(sender_address, nft_address));                 throw_unless(501, op == op::ownership_assigned());                 slice prev_owner_address = in_msg_body~load_msg_addr();                  save_data(                         is_complete,                         created_at,                         marketplace_address,                         nft_address,                         prev_owner_address,                         full_price,                         fees_cell                 );                  return ();         } (reply to 32979)

Step: Oh getgems contract

Step: This contract is deployed through a deployer contract

Step: Check deployer.fc

User<5916175317>: I wanna deploy it manually is there problem with that? (reply to 32983)

User<5916175317>: here in deployer.fc exists this  op == op::ownership_assigned() what op have to be?

User<5916175317>: anyone can help me with deploying this contract?

Luke: is there a way to discard the stack except the top few values

Luke: in tvm

Step: ownership assigned is like callback/notification happens when you transfer nft to deployer/any address. (reply to 32985)

Step: https://github.com/TelegramMessenger/telemint/blob/main/func/nft-item.fc#L117

Step: you need to transfer nft with forward_amount and forward payload(which contains sales config)

Howard: precisely, it cost the gas from the contract itself(which receive the External Message), aka. your walletV4 contract. (reply to 32947)

User<5916175317>: bro can I send you a private message? (reply to 32991)

Samyar: what this means ?   Func compilation error: contracts/3.fc:35:22: error: cannot apply function ~push_back : (tuple, cell) -> (tuple, ??9) to arguments of type (tuple, int): cannot unify type int with cell  here is the code : tuple find_and_replace(int flag, int value, cell linked_list) method_id {   slice s = linked_list.begin_parse();      tuple stack = null();   stack~push_back(linked_list);    tuple res = empty_tuple();   while (~ stack.is_null()) {     slice cs = stack~pop_back().begin_parse();     int ci = cs~load_uint(8);      res~push_back(ci);      repeat (current_slice.slice_refs()) {       stack~push_back(current_slice~load_ref());     }   }

Leon: what is DAG ? ty 🙏🏼 💫

Daniil: Directed acyclic graph (reply to 32995)

Leon: im more thankful for more links and refrences to read 🙏🏼 (if there is any specificly written for TON ecosystem) (reply to 32996)

N: Hi

Howard: Looks like you put int into the place should be the Cell data type. (reply to 32994)

Howard: I see, you should add these line of code I think: forall X -> int is_null (X x) asm "ISNULL"; forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS"; forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS"; (reply to 32994)

gary: hello How to use TonKeeper to sign messages?

gary: does anyone know? I need to verify my wallet.

User<6146784622>: https://en.wikipedia.org/wiki/Directed_acyclic_graph (reply to 32997)

Leon: one simple question :  is this a 2*3 matrix or 3*2  implemented by tuple?  [[1,2], [3,4] ,[5,6]]  Eddited : I've been told its 3*2  Let me know if you are sure its not.

Samyar: oh yes thank you i forgot about 🙏 (reply to 33000)

Sasha: Problem #3: Compiled: true Passed Tests: false 16/20 Tests Passed Guys, any idea how to fix this?))

Anurag: How can we return null in first task?

nonam3e: begin_cell().end_cell() (reply to 33008)

Anurag: Ok cool (reply to 33009)

krau5: If I write something like   my_tuple.at(index) = ololo;  will it eventually change the value hold at this index?

Coalus: no (reply to 33012)

krau5: And if I perform any kind of an operation using my_tuple.at(index).store_ref(…), there will be no result as well, right? (reply to 33013)

Anurag: I am using the correct token Can anyone help please

Anton: I had the same problem when i wrote my github login in case-insensitive.   You can update the profile and insert it exactly as you see it in github profile (reply to 33016)

Anton: (please be careful, there are scammers that have name "Customer Service" that try to convince you to click phishing link, they watch this chat)

UTKARSH: hey there i am new to ton. Ton Library (npm) I am unable to get state (balance,seqno, etc) of wallet, given just the public key of the wallet  It needs creating  a WalletContractV4, which apparently needs publicKey (a buffer object)  i tried using node buffer, but it gives a different wallet object in tutorials a publicKey buffer is created using  mnemonicToWalletKey

&rey: You need to put the token into Actions secrets, not Codespaces. (reply to 33016)

Anurag: He texted me too (reply to 33019)

&rey: If your wallet is v3, you need to create WalletContractV3. (reply to 33020)

UTKARSH: Thanks for the reply Its actually  wallet v4 r2  i can create WalletContractV4 object easily and correctly, if I am using the secret Key (mnemonic)  but i want to know, how to do it , if i dont have secret key,  as WalletContractV4 needs (Buffer: publicKey,.....)

&rey: 1. It seems that you need WalletContractV4R2, if that class exists, 2. Does constructor really require public key? If so, you can extract it from contract state (tonapi.io offers such a method). (reply to 33024)

Anurag: Thanks for helping out (reply to 33021)

krau5: What if the test says it does not see the caesar_cipher_encrypt method while using blockchain.runGetMethod? Should I use something else instead of runGetMethod?

&rey: Did you accidentaly leave out method_id? (reply to 33028)

krau5: Nope, it stays still, I’ve already checked, both decrypt and encrypt methods have the method_id (reply to 33029)

krau5: Okay, I got some progress now. It sees the method, but it says something about the type check error

User<6461782270>: just to let everyone know im done with fift, func, and this ecosystem. there's just an info bubble and zero tech nor community behind it. i'll still track the rate of ton in @CoinCrackerBot as a holder, but gosh solidity is so much more universal (reply to 32186)

Daniil: Is it just an advertisement of your bot? (reply to 33032)

User<6461782270>: 🙅‍♂️nope (reply to 33033)

Leon: Actually i found the opposite (reply to 33034)

User<6461782270>: and i found a better chain (reply to 33035)

Daniil: I don’t think so (reply to 33036)

Leon: And its getting more interesting as i walk through pages of FunC docs

User<6461782270>: yep, totally (reply to 33037)

Leon: And such a brilliant and helpful community, im grateful to be around (reply to 33038)

User<6461782270>: walk through pages of fs labs legal docs and you might look at a different chain as wel (reply to 33038)

Tolya: TON dapps developers  The old method of communication between dapp and browser extension (window.ton) is completely deprecated. Please replace it with TON Connect if you haven't already.  Browser extensions will stop providing the window.ton interface in a month at September 15.  Please use the unified TON Connect UI SDK and guidelines to provide the best possible experience for The Open Network users. (forwarded from TON Status)

Oleg: 💎 Tonutils-go v1.8.0 Released!  ❤️‍🔥 Added liteserver's proofs verification, including chain of master blocks.  Encrypted transfers, subscription on account transactions, request retrier wrapper, payment channels, and even more user friendly improvements and optimizations.  💥 Now it is safe to use even in untrusted environment, when full proof verification mode is set!  Changelog:     * Liteserver proofs verification, including chains of master blocks     * Encrypted transfers support and transfer decryption     * Added proof check policy to choose proof validation security level     * Added SubscribeOnTransactions method     * Added Retrier wrapper for liteclient (to autofailover nodes when 651 or -400 error code)     * Added decimals to tlb.Coins to use with tokens     * Added support for multi-root BoC serialization     * Accept payments on single address example     * Optimized index building and sorting for cell to BoC serializer     * Block shards loading improvements by iam047801     * Added GetConfigFromFile by zloylos     * Added StickyContextNextNode method to switch to next node for retry request     * Added arbitrary struct loading/serializing ability to TL-B loader     * Added checks for tlb.Coins for max bits size     * Added predefined TL-B types for validator, catchain and consensus configs     * Added payment channels predefined structs and deploy     * Added support for additional revisions of wallets (V3R1, V4R1, HighloadV2Verified)     * Added GetPublicKey method to wallet package     * Added ability to replace default query id and seqno fetcher for wallets to user defined     * Added 'cell' loading to TL loader     * Basic messages send mode changed to 1 + 2 from 1     * Jetton GetBalance return type changed to *big.Int     * Jetton transfer example     * DHT optimizations and improvements     * New examples

max mix 🐾 Σ: Neeed help plzzzz (reply to 32747)

yakuza: hi all in here the inputs and outputs of the opcode is determined like this : s - n : "s" is input and "n" is output but in some cases like this the input and outputs are not determined CF18 — STREFQ (c b – c b −1 or b′ 0

yakuza: what exactly is the in/output ? (reply to 33046)

Dmitry | backend4you.ton: you provide c and b as input instruction do one of: * leave c and b intact, adds -1 on top (I guess when failed) * removes c and b and adds b' (updated builder) and 0 ("success")  so you first read -1 / 0 and then decide what next  have no idea how to use in FunC (reply to 33046)

yakuza: thanks ! not going to use it func, please tell me if the following explanation  is correct about in/outputs of the stacks as represented in the ton white paper: all of the inputs and outputs of the stack is determined by the first dash ?  like values before the first dash are the inputs of the stack and the values after the first dash are the outputs ? (reply to 33048)

Dmitry | backend4you.ton: yep. and "second" is some other "dash", you may use tvm.pdf to have a bit better visibility (reply to 33049)

yakuza: thanks alot (reply to 33050)

Estevan: How can I integrate my AI service with the TonKeeper Wallet Subscription? I'm a developer seeking assistance for this integration. Can someone guide me through the process?

Gulolio: Guys what could be the reason that when using slice_compute_data_size(s, 2) I receive an error like this handling exception code 8: scanned too many cells     default exception handler, terminating vm with exit code 8  But when I make the same call with slice_compute_data_size(s, 512) the second argument a little bit higher I don't get this error. With same slice.

Dmitry | backend4you.ton: what is "slice_compute_data_size" ?

Gulolio: `;;; Similar to [compute_data_size?], but accepting a slice [s] instead of a cell. ;;; The returned value of x does not take into account the cell that contains the slice [s] itself; ;;; however, the data bits and the cell references of [s] are accounted for in y and z. (int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE"; ` (reply to 33054)

Gulolio: From the stdlib

Dmitry | backend4you.ton: https://docs.ton.org/learn/tvm-instructions/instructions , quick search for "SDATASIZE", it says "Similar to CDATASIZEQ", search for CDATASIZE and you'll find your answer (reply to 33055)

Erik🆓: Just asking if there happens to exist a standard contract for jetton sale to holders of a specific NFT?  The contract is initialized by sending an amount of some kind of jetton with a message defining the exchange rate (how many jettons are worth a TON), which NFT is required and which attribute it must have, minimum and maximum amounts that a participant can buy. Now (or at a given time) the contract checks which wallets have a matching NFT and saves their addresses. After this point, holders could sell the NFT and still participate in the sale, but not the buyer.  Now that the contract is initialized, TON can be sent to it. If the sender is not a participant, the TON is bounced. Else, the amount is added to the participant's balance. If the balance is below the minimum, it is bounced. If the balance is above the maximum, the surplus is bounced.  After a week (or so), the jettons are allocated to the participants and sent to them, together with any surplus TON that was not used to buy jettons (because there was not enough to buy). Any unsold jettons are sent back where they came from, together with the TON that was paid for jettons.  After this, the sale is completed and anything sent to the contract is bounced.

User<5392264629>: why is submission taking such a long time, been waiting 10 minutes

User<5392264629>: it usually finished in 30 secs

Gulolio: Guys one question here related to the TSC4 challenge, in the problem 4, about Caesar Cipher, should I expect any of the 256 ASCII characters, or only latin letters and digits?

鎽 dev: A-Z, a-z (reply to 33062)

Gulolio: Okay 👍

Luke: wait so there are only letters, no symbols? (reply to 33063)

鎽 dev: no, there are symbols, but just ignore them (reply to 33065)

— 2023-08-17 —

User<6191500817>: Does ton pay sdk not have a PHP version?

Gulolio: Another question here guys related to the Caesar Cipher problem, the text returned should also be preceded with the 32bit 00000000 prefix flag? Or just literally

Andy: yes you need to have the prefix in your output (reply to 33068)

TON technical overview: TEP-126 dedicated to extending the NFT standard was published. This extension allows NFT items to be displayed in wallets/explorers before they are actually deployed on-chain, and the deployment itself to be made right before the first transfer. Integrity and ownership control is ensured by checking the Merkle-proof during the deployment process. We invite you to take part in the discussion of this and other proposals.  Read more in TonTech post

Illia: Hello, how to do s[DEPTH-1] PUSH in asm?

Anton: try DEPTH DEC PICK (reply to 33072)

yakuza: Nice (reply to 33057)

Howard: Does anyone got ExitCode 40 before in Action Phase?  It doesn't in my list tho. Very very wired.

Frosiva: Anybody knows how to get a contracts jetton wallet inside its func code?

sdw: hello, hope you are all well. I want to get the walletStateInit of an address can somebody help me with that?

krau5: I am trying to fill the lisp-style tuple with builders, but the return type of ~pop_back is a slice. Will I be able to perform .end_cell() on a slice ( which is a popped builder from the tuple )? Code example   slice popped_builder = all_builders~pop_back(); popped_builder.end_cell();   I am getting exit_code 7, so I began checking types and that is the first question I’ve spotted

&rey: > the return type of ~pop_back is a slice How? It should look like forall X -> (tuple, X) ~pop_back(tuple) asm "TPOP";.  FunC won't let you run end_cell() on something that is slice in its opinion. You need to apply a function like forall X, Y -> X unsafe::transmute(Y) asm "NOP";. (reply to 33079)

Anton: in UNCONS s1 is slice and s0 is the rest of "list" as pop_back doesn't reverse output, try this: (builder popped_builder, all_builders) = pop_back(all_builders);  and yes, probably you wanted to store builder to end_cell() it (reply to 33079)

krau5: Yes, it looks like you’ve specified, but I suppose it returns a slice as there are no examples in documentation, where the pop operation returns something that is not a slice.  Mb I’ll try this “transmutation” (reply to 33080)

Anton: it returns whatever you've put in tuple (reply to 33082)

Howard: Here are the code to calculate(or get) the Jetton Wallet Address inside the smart contract level.   FunC Example - https://github.com/EmelyanenkoK/modern_jetton/blob/13a898ddfdf5c37860e9ddd261f11eadf8963682/contracts/jetton-minter.func#L38  Tact Example - https://github.com/ipromise2324/Tact-Token-Contract/blob/83cbcd3d30de67392e3ffa7bdd76932d83dc9509/contracts/token.tact#L51 (reply to 33075)

Howard: Never saw this Error Code tho (reply to 33075)

Vlad: Trying to deploy a contrct using blueprint, get this error:  Error: timeout of 5000ms exceeded #blueprint

krau5: Lol, I was wondering why I am getting the exit_code 14 and I started debugging. Eventually, I found out, that only one string can mess the things up.  slice msg = text.begin_parse(); msg~skip_bits(32); builder my_builder = begin_cell();  while (~ msg.slice_empty?()) {     if (msg.slice_data_empty?()) {       msg = msg~load_ref().begin_parse();     }     int char = msg~load_uint(8);     int decrypted_char = shift_char(char, shift);      my_builder~store_uint(decrypted_char, 8); ;; <— here }  Does anyone know why does it happen? I thought I made a mistake in shift_char but it does not throw any errors if I won’t add the string with storing integers in builder

Howard: do you have full module of your code? Can't find my_builder in your code then. (reply to 33087)

krau5: I’ve made an update. That is just an empty builder, so I decided not to mention it in the code at first (reply to 33088)

Howard: Might be helpful with full code — Using https://ton-ide-nujan.vercel.app/ (reply to 33087)

krau5: Unfortunately, that is the full code and the line with store_uint causes the TVM to throw out of gas error 😕 (reply to 33090)

TON technical overview: Check https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes Exit code -14 (check the sign by the way) means "not enough gas". It is possible that without ~store_uint code in while has no side effects and fully optimized out. You can check this hypothesis by commenting ~store_uint but adding decrypted_char~impure_touch(): if there will be -14 code that would mean issues with gas indeed (reply to 33087)

Howard: do you know the Exit Code 40 tho?  It became ExitCode 0 in TonViewer  https://t.me/tondev_eng/33076 https://t.me/tactlang/3891 (reply to 33085)

krau5: Tested it out and decrypted_char~impure_touch() causes out of gas exception as well. What should I do if so? (reply to 33092)

TON technical overview: How do you test your code? Is it possible that you emulate sending message with very low amount of TON (like 0.01?) (reply to 33094)

krau5: it(‘should ololo', async () => {     const text = beginCell();     text.storeUint(0, 32);     text.storeStringTail(<test string>);      let res = await blockchain.runGetMethod(       task4.address,       'caesar_cipher_decrypt',       [{type: 'int', value: 3n}, {type: 'cell', cell: text.endCell()}]     );      console.log(res.gasUsed);     expect(res.stackReader.readString().slice(4)).toEqual(<test string>) }) (reply to 33095)

TON technical overview: Looks like this issue https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.cpp#L1644  Contract tries to send too large message (reply to 33093)

𓀦: Is there any tvm-instruction for dropping ith stack element?

krau5: I am not sure that I fully understand what do you mean by mentioning about the message with very low amount of TON. For me it looks like a pure magic, where the out-of-gas is caused by a line which cannot cause such an exception🤷‍♀️ (reply to 33095)

Svαtoωλ‎: who can give some python libraries for sending tons from one wallet to another, in easy way, and which will work on windows and linux

TON technical overview: try something like  let res = await blockchain.runGetMethod(       task4.address,       'caesar_cipher_decrypt',       [{type: 'int', value: 3n}, {type: 'cell', cell: text.endCell()}],       {gasLimit:1000000000n}     );  See runGetMethod and GetMethodParams (reply to 33096)

TON technical overview: Well, you are not trying to run code in message-caused transaction, so "message" part is irrelevant. Still get-methods has some default gas limit too (for instance to catch infinite loops). Looks like your code consumes more than default limit and you need explicitly set higher gaslimit (reply to 33099)

krau5: I’ve already tried this approach before, but it returns something like Error: thrown: 7350800 (reply to 33101)

krau5: Why does it consume so much gas if there is a side-effect inside that loop? What is the reason? I haven’t heard before about such… situations 🤔

TON technical overview: Check https://docs.ton.org/learn/tvm-instructions/instructions [search for opcode] field Probably BLKDROP2 can do what you want. (reply to 33098)

TON technical overview: If there is no side-effect in some case funC just drop whole while statement.   Usually issues like you indicate infinite loop, but I don't see one here. So there is something inside while that consume too much gas, maybe shift_char is quite heavy? (reply to 33104)

TON technical overview: by the way, check if you try to store more than 1023 bits into builder (reply to 33103)

Anton: Hello Can I have both modifiers - method_id and asm in 1 method? Thanks!

krau5: Unfortunately, double-check, whether I am not trying to store more than it can hold, gives nothing as a result (reply to 33108)

sdw: hello, hope you are all well. I want to get the walletStateInit of an address can somebody help me with that? Can you find it by using https://testnet.toncenter.com/api/v2/#/accounts/get_extended_address_information_getExtendedAddressInformation_get under account state?

sdw: Please be aware of some Help Desk calls you might receive pretending they are trying to help you. ⚠

Ali: what is diffrence of ton and jetton wallet?

Howard: Your Wallet will bind with token wallet once you received the new token, once you receive the USDT@TON network, you will have your personal USDT Jetton Wallet Address.   More detail: https://docs.tact-lang.org/learn/jetton/jetton-3 (reply to 33116)

Ali: so like every jetons has special wallet but they are connected mine main ton wallet? (reply to 33117)

Howard: You can put "Your wallet is the only owner for that Jetton Wallet Address"

Ali: ok got it now i think its wrong what i heard. so everythink is like ethereum or another blockchains. (reply to 33119)

Howard: it's just more like AA + Isolated wallet

Ali: like i am asking bec. last MOVE blockchains (like APTOS/SUI) you cannot receive any token if you are not registered with your wallet.

Ali: i am trying to know, can i send jettons randomly with another ton wallets

Ali: without any permission for receiver

Howard: So, there is no signing attack like the one we've heard about in Ethereum, since your asset balance is isolated from your balance in any liquidity pool (LP) in my opinion.

Ali: got it

Ali: thanks

Ali: so let me ask this. TACT is kind familiar with me so thats why i want to learn that. I look few docs but i cant saw anythink about sending ton coins or jettons with contract. Is there a any example about this? (reply to 33125)

Leon: Is this a typo ? "❓".... Set_data() is the correct one i believe.

TON Answers Bot (not AI): Is there a way to lock NFT for staking? from Rahul Dabhi  I am looking for NFT staking tutorial but couldn't found.  Like other blockchain i want to create a staking platform for my client and they have collection of NFT on TON network. I search everyware in the docs but can't see the tutorial of staking. If anyone know that how to lock NFT in TON network then tell me please. I found that there is multisign wallet and wallet is also contract and NFT also contract, so can we have to create wallet and multisign with user and our key and store NFT for staking. I want that user have NFT after staking but user can not transfer or stake, inshort NFT will be freez for some time. Is that possible in TON blockchain?  🔗 Answer on TON Overflow

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: how to pass n to asm for example REPEAT n times

Tim: Pushint 5 Repeat

𓀦: Is there any tvm-instruction for dropping all stack elements?

Md Alam: Gm

Jo: is there any egyptian here?

sdw: Can you get stateInit of wallet using tonWeb?

— 2023-08-18 —

Luke: how do you store a global builder

Luke: it gives errors when i try to run the test for it

Luke: saying {type: "unknown"}

Ares: Please use chat gpt for simple questions, it can guide You. (reply to 33142)

Luke: no its tvm specific, Error: Unknown TVM stack entry{"type":"unknown"} (reply to 33143)

Luke: it happens in the vm when you try to store a global builder

Howard: https://github.com/ipromise2324/Tact-Token-Contract  More detail in Tact Example: https://tact-by-example.org/all https://github.com/tact-lang/awesome-tact (reply to 33128)

WhiteTEA: 1TON=50testTON Paid for it 🪨🪨 (reply to 33147)

TEAM_Psi_2: https://t.me/testgiver_ton_bot (reply to 33147)

Daniil: @lacoste2024 please don’t mention all the admins in the message.

max mix 🐾 Σ: Thanks because I ask the questions many times and no one answered me 😑 (reply to 33151)

Jzuss ┌( ಠ_ಠ)┘: how to get builder from dict? I see set method only in stdlib

Łukasz: is it sth wrong with the APIs? I'm getting 300 for get-methods...

TON technical overview: Which one? There are quite a few (reply to 33155)

Łukasz: right, I thought it's for all of these, but I'm using toncenter.com with an apiKey / TonClient v2 (https://testnet.toncenter.com/api/v2/jsonRPC) (reply to 33157)

Łukasz: yesterday all was working properly ;p

Łukasz: but that's probably sth wrong with my configuration (reply to 33158)

Crypto: А как ваши нфт получить

LimonPay: Привет это офисалная группа ТГ?

LimonPay: Есть кто не буд из админов?

&rey: TON, not Telegram. Russian chat: @tondev (reply to 33163)

&rey: It's impossible; you may start new builder and put the slice there. (reply to 33153)

&rey: Russian chat: @tondev What NFTs do you mean? (reply to 33162)

&rey: ZERO ONLYTOPX. (reply to 33133)

&rey: Have you initialized it? By default, all global variables carry null() value. (reply to 33140)

sdw: hello,   I need your help. Does anybody know how to get stateINit for a wallet? how to build it or get it using ton web or https://testnet.toncenter.com/

&rey: The easiest way: retrieve current wallet state, parse data, clear seqno and plugins list, build StateInit. Another way: find the first outgoing message of wallet (testnet.dton.io/graphql may help with that) and get StateInit from there. (reply to 33170)

Andrey: BTW you can operate statuses in transactions, so it’s quite easy:   {   transactions(     address: "D1E9C251EDC4D6B5814AD18365C5E78EEC0E8ADA499C60D7F752858B45AA38CB"     orig_status: "uninit"     end_status: "active"   ) {     orig_status     end_status     address     account_state_state_init_code     account_state_state_init_data   } } (reply to 33171)

Anu: Hi I am new to this group

Anu: Can anyone say where to submit solutions

Anu: Where will be the questions available

Anton: https://github.com/ton-community/tsc4/blob/main/Readme.md everything is there (reply to 33176)

Anu: Thank u

Leon: i need help with tsc4 task 4, i passed 51 test and have no idea what cases i didnt handle :(

Leon: can anyone expert give me a code review or tip on my code?

Gulolio: Guys in the problem 3 of the challenge, flags and value can be of different lengths? Or they will be always of equal lengths

Anton: may be different (reply to 33181)

Anton: Did you check long strings? Did you check all ASCII characters? (reply to 33179)

Leon: yes... im checkin long strings, and im checking a-z A-Z (reply to 33183)

Leon: may i private message you with more details in case you can help me (reply to 33183)

Samyar: this code gives me a exit code 7   int v = stack~pop_back();   like why ?  stack is a global var for tuple   global tuple stack;  and i initiate it like this in the root function    stack = empty_tuple();

Samyar: the pop_back works in another place (reply to 33186)

Anton: Leon, that may help you, it's from ru-chat

Anton: Как посмотреть вывод моей программы? (forwarded from Mr. H.)

Leon: actually cant get the help from this ... and im still in 51/133 (reply to 33189)

Leon: and it look likes some other folks are also stucked in this state at task4 like me before.... if anyone can give me any tip  ,will be greatful

Leon: is it \n or something that i missed?

Anton: it may be any character up to 4-bytes UTF8 can be there but only a-z A-Z should be shifted. You can also try shift %= 26 (reply to 33192)

Daniil: 8 bits, not 4 bytes (reply to 33193)

Leon: so as i understand any combination of :  "\"+ "any-char" should be written as is

Leon: which takes 2bytes

Anton: but it works fine with 4-byte emojis. 1 of my testcases for example 🎅 - F09F8E85 - is not converted and can appear in a message according to doc But it doesn't change anything actually, these 4 bytes can be processed separately. (reply to 33194)

Leon: how can i have a complete list of these characters needed to be considered?

Leon: i mean the tricky ones

User<6279916501>: Hii me aapke subscriber hun

Ahmet Said: Is there bridge exist for ton in polygon chain?

Samyar: hey guys please help this one i think i found the problem  so why i can't assign value 0 to type int ?  i get an exit code 7 (forwarded from Samyar)

Samyar: ok so at least anyone knows how can i check the type of a value ? (reply to 33202)

yakuza: hey , does anyone have any resources about the ton precompiled contracts ?

Protagonist: Hi Does anyone know how i can send my answer to ton smart challeng 4?

Dmitry | backend4you.ton: https://github.com/ton-community/tsc4/blob/main/Readme.md#-solution-submission-guide-and-terms (reply to 33205)

Protagonist: Thank u (reply to 33206)

Anton: I think, problem is with ~uncons (reply to 33202)

Anton: check this (reply to 33081)

Samyar: oh yes i cant use it   i can only use tpop but not uncons or pop_back what is the equivalent for uncons in non lisp style i guess to pop the first one (reply to 33208)

Anton: Indexvar (reply to 33210)

Samyar: omg it never ends  i did it but when i want to store it as a 1 bit value in the base it again gives me the error code 7 (reply to 33211)

Anton: try using tpop_back not with ~, but like (int v, stack) = tpopback(stack) (reply to 33213)

Samyar: i do this 😂 because tpop_back causes 7:         tuple shift = reverse_tuple(stack);       int v = shift~tpop();       base~store_uint(v, 1);        stack = reverse_tuple(shift);   but this causes -14 (reply to 33216)

Vahid: Hey guy I have a problem 😐 . I register for tsc-4 but I got this error during build on github ? Failed to submit TON Smart Challenge solution. Status code: 500 Error message: No registered user found for this token.

Anton: Did you put a secret in secrets - actions config?  https://github.com/_your_repo_path_/settings/secrets/actions There should be 1 secret (reply to 33221)

Vahid: yes (reply to 33222)

Anton: Github login is case-sensitive pls check your profile settings, it should match exactly what you see on GitHub (reply to 33223)

Anton: no, not codespaces secret Action secrets (reply to 33225)

Andy: This is codespace secrets - you need to put it in Actions secrets (reply to 33225)

Anton: and it should be named "USER_TOKEN", just like on my scrshot

Vahid: Ok Thank you guys I will check it :) (reply to 33228)

User<1907895509>: Hey guys,who can help me with testnet tons for testing one thing

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: (int, int) get_n(int n) asm "NIL OVER 0 EQINT 0 PUSHINT s0 s4 XCHG REPEAT:<{ s3 PUSH ADD s0 s3 }> NIP"; Error: main.fif:17:  }>:not a cell builder I just start learning asm  help me please to understand what's wrong with this code, Thank you (reply to 32962)

Vahid: unfortunately  not work

&rey: ADD s0 s3 does not mean anything. (reply to 33231)

Gulolio: The name of the variable should be USER_TOKEN (reply to 33232)

Gulolio: I had the same issue, try that

Vahid: let me check it ;) thank you for your answ (reply to 33236)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: ADD s0 s3 XCHG does? (reply to 33234)

Andrey: BTW if you’re Python developer and want to learn asm, you can use Jupyter with tonpy:  https://github.com/disintar/tonpy/blob/main/src/tonpy/tests/test_tvm.py#L128

Vahid: Thank you @Gulolio and @AndyRusso and @Ant16. problem is resolve. but for latest question do you have any problem in Submission like above image ?

Asher: https://www.youtube.com/playlist?list=PLtUBO1QNEKwttRsAs9eacL2oCMOhWaOZs (reply to 33233)

Anton: Hmm, I didn't, but the most important step is "problem testing results"  Open that and check your score (reply to 33241)

Leon: I really enjoyed tsc4. ✨ 🙏 thanks to its creators now i want to know more and more about ton smart contracts and FunC

‌M.Y.J: It is a really good project, please provide more information

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: how to return a stack from asm ? (int, int) get_n(int n) asm "NIL OVER 0 PUSHINT 1 PUSHINT s0 s4 XCHG REPEAT:<{ s3 PUSH ADD s0 s3 XCHG }> NIP"; s2 is returning which is array. I used document sample codes so I can not fully understand I'm trying to understand what's going on and why I have a tuple in my s0~s4 args (reply to 33234)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: n:7 it's returns  #DEBUG#: s0 = [] #DEBUG#: s0 = 13 which should be  #DEBUG#: s0 = 21 #DEBUG#: s0 = 13  and the stacks dump is  #DEBUG#: s0 = 13 #DEBUG#: s1 = 7 #DEBUG#: s2 = [] #DEBUG#: s3 = 21 #DEBUG#: s4 = 1 (reply to 33246)

Kazuar: There will be writeups about this? (reply to 33244)

&rey: No, it's soulbound — can't be transferred. (reply to 33250)

&rey: SBT is something like certificate of achievement. (reply to 33253)

&rey: Also to prove your [un]reliability to some service, for example, when borrowing TON/jettons. (reply to 33255)

User<1907895509>: Guys who can help me with testnet toncoins,or do you know where can i buy it?

— 2023-08-19 —

&rey: Is https://tonconsole.com/faucet working? Is @testgiver_ton_bot working? Is it possible to do the testing locally, in sandbox? (reply to 33258)

Gulolio: Hi guys, how can I know the amount of gas spent on my smart contract. Is there a way to log that with blueprint?

Anton: + I also wanted to know. The only way I do know for now is to limit gas consumption for blueprint, that way you can guarantee that testcase consumes no more than a certain amount (reply to 33266)

Anton: Here is an example (reply to 33101)

&rey: It is almost certainly possible. Check how to turn on blockchain logs. (reply to 33266)

sdw: anybody could know about  loginTonConnect error trying to connect in Dapps UnnexpectedError ? is there a way to find what could be causing this?

Sαƙιɳ ╰‿╯: https://twitter.com/heynarayan/status/1692905105853456818?t=CB_3VYENnN6PasHZVkvFFg&s=19  A tweet about today's event "Namaste TON" in India by Ankit Jaiswal and team

Four: ton is good

Four: i have finished task

Gulolio: Following this suggestion, I found that we can specify to log information about gas on the tests like this:  await blockchain.setVerbosityForAddress(task5.address, {             print: true,             blockchainLogs: true,             vmLogs: 'vm_logs_gas',             debugLogs: false,         })  Now the doubt that I have, is that I received logs like this one:       code cell hash: 5663FF9219FDD6BDE13F1580C711426F51548B4409DCA47F085BF13A3A940CB9 offset: 0       execute SETCP 0       gas remaining: 9999974       code cell hash: 5663FF9219FDD6BDE13F1580C711426F51548B4409DCA47F085BF13A3A940CB9 offset: 16       execute DICTPUSHCONST 19 (xC_,1)       gas remaining: 9999940  Which I assume is the gas remaining after each instruction. My question is, if I'm right, remaining from how much? I don't see information in the logs about it. My intuition tells me that maybe is from the limit, that appears in this log:        [ 4][t 0][2023-08-19 15:09:18.254000][transaction.cpp:1093]       starting VM       [ 4][t 0][2023-08-19 15:09:18.255000][transaction.cpp:1098]       VM terminated with exit code 0       [ 3][t 0][2023-08-19 15:09:18.255000][transaction.cpp:1111]       steps: 4 gas: used=291, max=50000, limit=50000, credit=0       [ 3][t 0][2023-08-19 15:09:18.255000][transaction.cpp:1113]       out_of_gas=false, accepted=true, success=true, time=0.000365s       [ 4][t 0][2023-08-19 15:09:18.255000][transaction.cpp:1145]       gas fees: 291000 = 65536000 * 291 /2^16 ; price=65536000; flat rate=[100000 for 100]; rem aining balance=49709000ng       [ 4][t 0][2023-08-19 15:09:18.256000][transaction.cpp:2470]       setting address rewriting info for newly-activated account F7B44BE93AC2861E1860C51FFDF3A7 AB1553A50CC3ACE572D7DA909A08F16139 with split_depth=0, orig_addr_rewrite=  But this doesn't seems to be true, otherwise I would be spending: 50000 - 9955191 = -9905191, negative gas😅 obviously this assumption it's wrong. If anyone knows, from which quantity is this "reamining gas", let me know. (reply to 33269)

Rahul: Is there a way to lock nft for staking... I couldn't found. Please tell me if anyone knows.

Rahul: Is there a way to lock nft... i want create staking platform for my collection. I check everything I couldn't found (reply to 27429)

User: https://pastebin.com/HdAj5tXh  Someone catch this error while setup liteserver?

— 2023-08-20 —

Jangju: hello? Has anyone upgraded the nft purchased from fragment to a bot?

Jangju: 6 hours ago apparently the upgrade cost was 5TON and I sent it to tx but it didn't work. But now the cost is 5,000 TON, is this correct?

sd: it never cost 5 ton (reply to 33284)

Jangju: Holly..

Jangju: It was early morning in Korean time and I was tired so I guess I misread it.

Jangju: was it originally 5,000 TON?

Jangju: Okay thanks..

Jangju: so expensive 😅

Jangju: I have one more question. Can I get a blue badge if I pay 5,000 TON to upgrade? (reply to 33285)

sd: https://telegram.org/verify (reply to 33291)

Jangju: cool! thx bro (reply to 33292)

User<5900011396>: have a nice day

Howard: You are trying to store Emojis into the Cell String? Interesting. (reply to 33197)

Jacurutu: hey guys, i'm working with pytonlib and try to decode some transactions. I end up with raw transactions like this : [{'@type': 'raw.transaction', 'utime': 1691689283, 'data': 'te6cckECCgEAAl8AA7V0q/eXtcwchHuRd2SPBHVX0F8VwMwMMgrNy8utZtWPUNAAAkY22150FXFEXCN7JoyebyKx2zT6on5I1wrseLypQD0N7GRdkSGAAAJFdju7KHZNUhQwADRqFfdoAQIDAgHgBAUAgnLYBBPczqNf3MRBwLMloXJsIxhVeB1s4smElKywBZAzYFU4J1iy/uUxufl8TEVKS/Uq/fd+y+Y51y5DFPpI4VYTAhEMqYrGGZPPBEAICQHhiACVfvL2uYOQj3Iu7JHgjqr6C+K4GYGGQVm5eXWs2rHqGgXPod3EjT0MbtPtyVkvv8ICmfX95SrtuMdcurzAjfn0iGQ9isteJiAY2pjPt+dc+/70wwU+U9ayXlzWmOl6EAARTU0YuyapC8gAAApAABwGAQHfBwB+YgAr9bogOwJQz78CACmK97hXW9s68yqMu6wzq3tdeJCS9y4pqRKwAAAAAAAAAAAAAAAAAAAAAAAAMTEzNzA1AMdoAJV+8va5g5CPci7skeCOqvoL4rgZgYZBWbl5dazaseobABX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7lxTUiVgABhRYYAAASMbba86EyapChgAAAAAYmJmbmBrAAJ1BnYMTiAAAAAAAAAAAEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAG/Jh6EgTBRYQAAAAAAAAgAAAAAAAk8jZVam768dXnTT4wme6gAeZQmf/2gHfbjVIksShSrGQFAYzOUF/PQ=', 'transaction_id': {'@type': 'internal.transactionId', 'lt': '40009461000001', 'hash': 'Md0f4eY/lcMGqpcs/K1brEKA/YNZLkiH3dKr5FDqaK4='}, 'fee': '5954539', 'storage_fee': '42539', 'other_fee': '5912000', 'in_msg': {'@type': 'raw.message', 'source': '', 'destination': 'EQBKv3l7XMHIR7kXdkjwR1V9BfFcDMDDIKzcvLrWbVj1DaUP', 'value': '0', 'fwd_fee': '0', 'ihr_fee': '0', 'created_lt': '0', 'body_hash': 'zFPiwSl7o6aemuCE1obba6SzQyIh4KcqFWIZ2bf1vKQ=', 'msg_data': {'@type': 'msg.dataRaw', 'body': 'te6cckEBAgEAkgABnLn0O7iRp6GN2n25KyX3+EBTPr+8pV23GOuXV5gRvz6RDIexWWvExAMbUxn2/Ouff96YYKfKetZLy5rTHS9CAAIpqaMXZNUheQAAAUgAAwEAfmIAK/W6IDsCUM+/AgApive4V1vbOvMqjLusM6t7XXiQkvcuKakSsAAAAAAAAAAAAAAAAAAAAAAAADExMzcwNVZM+BQ=', 'init_state': ''}, 'message': 'ufQ7uJGnoY3afbkrJff4QFM+v7ylXbcY65dXmBG/PpEMh7FZa8TEAxtTGfb8659/3phgp8p61kvL\nmtMdL0IAAimpoxdk1SF5AAABSAAD\n'}, 'out_msgs': [{'@type': 'raw.message', 'source': 'EQBKv3l7XMHIR7kXdkjwR1V9BfFcDMDDIKzcvLrWbVj1DaUP', 'destination': 'EQBX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7sxi', 'value': '847000000000', 'fwd_fee': '666672', 'ihr_fee': '0', 'created_lt': '40009461000002', 'body_hash': 'tjXAZSoLPELylE9ayVae8nMgY1boX+/Rd2HX2QDM994=', 'msg_data': {'@type': 'msg.dataText', 'text': 'MTEzNzA1'}, 'message': '113705'}]}]

Jacurutu: Is there any ressources that explain how to decode such a raw transactions (i have found nothing so far)? Thanks

Anton: Why not? Messages support utf8, so I could) (reply to 33295)

Maksim: if you want to parse message data you need to convert it from boc to slice and parse. Every ton library can do this (reply to 33297)

Maksim: you can try pytoniq or tonsdk. also there is a youtube course

Jacurutu: i think it's what i want, i will check the youtube video thanks (reply to 33300)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: How to calculate the gas usage using blueprint? is there any document available?

Gulolio: @hitasp I don't know how to do that but I tried this. The issue is that I cannot know from which quantity this is the "remaining gas". Read it, maybe helps you in some way (reply to 33274)

testertesterov: Tuple using cast_to_cell can be sent back to Cell and it will return from the function to Tuple. Perhaps the current version will someday work. (reply to 33295)

testertesterov: (cell) ... ... return cast_to_cell([[1,32],[2,64]]);

Dmitry | backend4you.ton: Hmm you are trying to “shadow” convert tuple to cell without builder???? What?

testertesterov: It's a breakthrough types bro (reply to 33307)

AJ: Hey guys. Trivial question newbie here. Is there a way to derive addresses using a derivation path like in BIP39? I did not happen to find anything like that on the ton wallet

sdw: Hello,  I am assuming stateInit can be build using ton-core library as below. How can you convert this in boc string starting with 'te'  const stateInit = beginCell().storeUint(6,5)        .storeRef(Cell.fromBoc(Buffer.from({data}, 'base64'))[0])         .storeRef(Cell.fromBoc(Buffer.from({code}, 'base64'))[0])        .endCell();  Could you please help.   thanks in advance

— 2023-08-21 —

Synth: Hello guys

Synth: Is there any hybrid DLT project in ton where they utilize the distributed ledger on TON and connect it to a private DB so they can implement more info utilizing the transaction or mint id

nonam3e: stateInit.toBoc().toString('base64url') (reply to 33313)

AJ: How to generate or derive receive addresses on a wallet?

&rey: One wallet has one address. mnemonic —> key pair —> public key —> wallet data —> wallet StateInit —> address (reply to 33319)

&rey: You may also be interested in https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers. (reply to 33319)

blacktyg3r: Hey everyone, is @wallet an open source app and I could see it's code?

User: No, but you can inspect it html code through webapp. (reply to 33322)

blacktyg3r: Hm, could you help me how? I know that this bot is a web app, but not sure how to see its html. (reply to 33323)

blacktyg3r: And in fact I'm interested in the front-end, would like to build something similar to my tipbot :)

&rey: Telegram — advanced settings — experimental — enable webview inspecting. (reply to 33324)

blacktyg3r: Thanks! (reply to 33326)

&rey: Make sure that you won't violate copyright, as otherwise you may have problems) (reply to 33325)

blacktyg3r: Absolutely, just looking for an inspiration. (reply to 33328)

blacktyg3r: Side question, do you think I could ask for support (https://ton.org/grants) if I'd like to integrate TON to my @EpicTipBot (btlabs.tech/tipbot) - privacy coin tipbot on telegram? 😁

Daniil: You can try applying for a TON Footstep: https://github.com/ton-society/ton-footsteps (reply to 33330)

sd: first, fix it 🧛‍♂️ (reply to 33330)

blacktyg3r: Hehe, yeah I'm during a lot of changes now, I was trying to get my hands dirty with the web-app but I'm not a too savvy with a front-end, seeing @wallet I thought that is really cool and worth to learn lol. (reply to 33332)

gary: How do I know if my transaction is successful?

sdw: Thank you (reply to 33318)

sdw: Hi All,   I am trying to use tonProof to connect with dApp.  The problem at the moment is that I get rejection when I am trying to connect with a very generic error. I believe the problem is walletStateInit that I am building. is the below correct way to build the walletStateInit  const stateInit = beginCell().storeUint(6,5)        .storeRef(Cell.fromBoc(Buffer.from({data}, 'base64'))[0])         .storeRef(Cell.fromBoc(Buffer.from({code}, 'base64'))[0])        .endCell(); stateInit.toBoc().toString('base64url')  Thank you in advance

&rey: You've swapped code with data. (reply to 33336)

sdw: Also the code and data are taken from the api request  https://testnet.toncenter.com/api/v2/getAddressInformation?address=${address}  some wallets do not contain the data and code. reason is because they are unitialised. however they can connect using myTonWallet. how is this possible to generate walletStateInit without having an initialised wallet. For instance this one EQA6tBubkCHHrJxIEs1eNX_qa_iaeMctWH2dJc_m4RSJqq-T (reply to 33337)

Tumin | Wagmi11: how can I restrict the user to only user to only use testnet on TWA using @tonconnect/ui-react?

&rey: Wallet application has code and data so it can calculate StateInit and wallet address even without initializing it in blockchain. If you're not given public key, you are unable to verify ton proof. (reply to 33338)

sdw: I have given public key correctly. I still think the walletStateInit passing is not correct. as mentioned above I have tried generating the walletStateInit using a walletContractV4.   const stateInit = beginCell().storeUint(6,5)                 .storeRef(Cell.fromBoc(Buffer.from({code}, 'base64'))[0])  .storeRef(Cell.fromBoc(Buffer.from({data}, 'base64'))[0])    .endCell(); stateInit.toBoc().toString('base64url')  Still getting unexpected error and I am not sure how I could find what is actually wrong with the request. any way to debug or check what could be wrong? (reply to 33340)

&rey: Buffer.from(data, 'base64') instead of Buffer.from({data}, 'base64')? (reply to 33341)

&rey: Also, what do you do with StateInit afterwards?

sdw: yeah I used {data} as placeholder I get the data from this api https://testnet.toncenter.com/api/v2/getAddressInformation?address=${address} (reply to 33342)

sdw: Just passing it into the dApp for validation. including public key, signature, something like below:  {     "id": 1,     "event": "connect",     "payload": {         "items": [             {                 "name": "ton_addr",                 "address": "0:c098da2b868f6eb5bf2db066c05398b6147d1bbdd0cf7f6a8f2280e557f832f0",                 "network": "-3",                 "walletStateInit": "te6ccgECFAEAAtQAART/APSkE/S88sgLAQIBIAIDAgFIBAUE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcCASAICQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAKCwBZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEAgFYDA0AEbjJftRNDXCx+AA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA4PABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVA=="             },             {                 "name": "ton_proof",                 "proof": {                     "timestamp": 1692361654,                     "domain": {                         "lengthBytes": 18,                         "value": "testnet.getgems.io"                     },                     "signature": "signature",                     "payload": "gems"                 }             }         ],         "device": {             "platform": "mac",             "appName": "AA",             "appVersion": "1.0",             "maxProtocolVersion": 2,             "features": [                 "SendTransaction",                 {                     "name": "SendTransaction",                     "maxMessages": 4                 }             ]         }     } } (reply to 33343)

Rahul: Can i get collection nft with tonconnector react package?

Rahul: Can i create test nft collection in ton? For dev testing

John: testnet.getgems.io (reply to 33347)

Rahul: Hi and is there a tonkeeper test wallet and faucet (reply to 33348)

Rahul: ?

John: Hi. yep (reply to 33349)

Rahul: Can you tell me so i can setup whole test environment

Rahul: I didn't fond sandbox or testnet option in tonkeeper wallet.. and trying to find faucet also so i can het some test Ton coin

John: https://t.me/testgiver_ton_bot (reply to 33353)

Rahul: Ok thanks ☺️

Rahul: There is no way to lock or freeze NFT for staking right? (reply to 33355)

Rahul: In this ton network

Rahul: Like solana and etherium

Rahul: I found staking for only native coin TON

Howard: can you check a bit for the question you ask on answers.ton.org? https://answers.ton.org/question/1603114375764250624/is-there-a-way-to-lock-nft-for-staking  I tried to give some ideas there. (reply to 33357)

&rey: There are different proposals, however it's currently totally unclear what "staking NFT" should mean. (reply to 33357)

&rey: "Staking TON" means "lend TON to a validator so that it can participate in running blockchain and it shares rewards".

Jake: In the antelopeio staking contracts it means to lock an nft in a contract with delegation be to your account. So if you create a contract that can store your wallet and all of the need metadata to store and transfer said nft. You should be able to build and unstake action the reverse the input and transfers the asset back to owner. We also use "soft stake" which is a contract viewing an other contract in order to reward a user (reply to 33362)

Jake: I'm not to sure about funC / getgems contracting yet but my guess is to start with a builder cell system you should be able to make a cell for each new input to the contract that represents under the wallet. Those cells would represent each nft stored under that. Though im not sure if that how the cell structure works here

Jake: But at the end of the day an nft lock should only be used to secure an asset in a central wallet for gameplay or reward systems through the contract it's being used for. And that contract better be fool proof

&rey: It's totally possible here! TON NFT collections, items and wallets are separate smart contracts, and NFT holders for staking may be their own contracts too. (reply to 33364)

&rey: Though, what's the reason for locking NFT? It's possible to make NFT notify central contract about its transfer so that it sends part of reward to the current owner. (reply to 33366)

Jake: Timestamping locks to stop p2p transfers (reply to 33368)

Jake: It happens alot with those that run multiple accounts to game. They will transfer asset from account to account in order to gain reward benefits. If you lock assets for a time period in an account you now can delegate based on said account with out fear of abusive players

Jake: But as i said before a "soft stake" only requires the asset contract and a wallet check to confirm if they have it. If not then remove cell

Aleksandr: Anybody used tonapi? Wtf is that? 😕 all logs consist of this...

aleksej: Did you obtain a token ? (reply to 33372)

Aleksandr: Yeap (reply to 33373)

Aleksandr: Worked correctly for a week (reply to 33374)

aleksej: Can you get another token and retry?

Aleksandr: I think I could But this not normal ... 🤷‍♂️ (reply to 33376)

Howard: network: -3 is test-net btw (reply to 33345)

sdw: yes, I am trying to connect with a dApp in testnet (reply to 33378)

— 2023-08-22 —

TON Answers Bot (not AI): What is the "atomic event" in the TON Blockchain? (Whitepaper) from Howard  The following content appears in this whitepaper (https://docs.ton.org/tblkch.pdf):  > For instance, each outbound message created in a transaction is assigned its logical creation time; for this purpose, the creation of an outbound message is considered an atomic event.  This statement appears seven times. After checking in detail, I found that it's related to Logical Time (LT).  My question now is, what does "atomic event" mean, and how is it generated and defined? Can we say it represents the idea of a continuous and unbroken chain, meaning that the transaction is a series of effects from end to end?  🔗 Answer on TON Overflow

Tony 10am-7pm: Hi all, does anyone know if there's some boilerplate / starter func code resources for a nft minter?

Alex: https://docs.ton.org/develop/dapps/tutorials/collection-minting (reply to 33382)

Rahul: Hey, I am using @ton/ton package for preparing body for NFT transfer. There is buffer required.  So i add require buffer into top of using import library of ton. Then eslint give me error that i can not put require before any import. So i disable eslint for src folder. But still getting error. Buffer is not defined.   I am using react js and also @tonconnect/ui-react and @ton/ton

Rahul: React js with typescript template (reply to 33384)

Rahul: Is there other way to prepare payload body for NFT transfer? Because @ton/ton giving me buffer error even if i add required buffer.

Rahul: Invalid address. Got "0:6bd8533e023bbb96a3ac9eb26f4c6c9eed7dae619a0bdc69fe3868317c2947d5";

Rahul: This address i am using from useTonWallet but what i am missing? (reply to 33387)

Rahul: beginCell() .storeUint(0x5fcc3d14, 32) .storeUint(0, 64) .storeAddress("EQAkWqG9_sfywsxi9nVuxMyiji-JYO3RKi8N2krqOQlxxXoc") .storeAddress(wallet.account.address) .storeUint(0, 1) .storeCoins(toNano('0.000000001')) .storeUint(0,1) .endCell();

Rahul: Invalid address. Got kQBr2FM-Aju7lqOsnrJvTGye7X2uYZoL3Gn-OGgxfClH1Yqp

Rahul: Can anyone tell me please which type of address we have to send here.. its rejecting. I am using both testnet tonkeeper wallet

Alex: In our quest for ownership in the digital age, NFTs have taken center stage. These unique assets, powered by blockchain technology, provide creators with innovative ways to monetize their work.   But! as the NFT market expands, so do the challenges.   Introducing NFT Swapping - Your Path to Diversification and Collaboration! 💎  In this article, we have discussed the concept of swapping, a term in the NFT market. 📰  Website | Blog  | Twitter (forwarded from TonRadar)

&rey: And where is the description how to do the swap, instead of abstract words of how it's useful? (reply to 33392)

Rahul: Someone help me please 😢 (reply to 33389)

&rey: .storeAddress(new Address('EQA...Xoc')) .storeAddress(new Address(wallet.account.address)) (reply to 33389)

Rahul: Thanks 🥹 (reply to 33395)

Rahul: Not working   .storeAddress(new Address(process.env.REACT_APP_WALLET))          .storeAddress(new Address(wallet.account.address))  Cannot convert kQBr2FM-Aju7lqOsnrJvTGye7X2uYZoL3Gn-OGgxfClH1Yqp to a BigInt

Daniil: Address.parse(''), not new Address('') (reply to 33395)

Rahul: Thanks working

Rahul: Can i get this docs link.. i mean where can i get all this stuff?

Rahul: I am doing the same thing which is mention in Ton docs to transfer nft but its keep getting error like this..  Now another error....  [TON_CONNECT_SDK_ERROR] TonConnectUIError Unhandled error:TypeError: Do not know how to serialize a BigInt   tonConnectUI.sendTransaction({     validUntil: Math.floor(Date.now() / 1000) + 360,     messages: [         {             address: Address.parse(address), // NFT Item address             amount: toNano("0.05"),             payload: body.toBoc().toString("base64")         }     ] });

Rahul: Its payload error i think but why... this is how mention in docs

Rahul: Is there any advance docs for this?

Rahul: Hey do you know this error? My app launch today and i am stuck into this. (reply to 33398)

TON Answers Bot (not AI): TypeError: Do not know how to serialize a BigInt from Rahul Dabhi  Hey, i am getting this error while trasnfer NFT. I can't find this error anywhere. i have used as ton metion in their docs. please help me why i am geeting this error and how can i solved this?  USING : React js with typescript template, @ton/ton, @tonconnect/ui-react  ERROR: TypeError: Do not know how to serialize a BigInt  const body = beginCell()     .storeUint(0x5fcc3d14, 32)               // NFT transfer op code 0x5fcc3d14     .storeUint(0, 64)                        // queryid:uint64     .storeAddress(Address.parse(toAddress))  // newowner:MsgAddress     .storeAddress(Address.parse(fromAddress)) // responsedestination:MsgAddress     .storeUint(0, 1)                         // custompayload:(Maybe ^Cell)     .storeCoins(toNano('0.000000001'))       // forwardamount:(VarUInteger 16)     .storeUint(0,1)                          // forwardpayload:(Either Cell ^Cell)     .endCell();  const transaction = {    validUntil: Math.floor(Date.now() / 1000) + 360,    messages:       {        address: Address.parse(nft_address), // NFT Item address, which will be transferred        amount: toNano("0.05"),  // for commission fees, excess will be returned        payload: body.toBoc().toString("base64")  // payload with a NFT transfer body      }      }  const result = await tonConnectUI.sendTransaction(transaction);  🔗 Answer on TON Overflow

Alex: sorry for that (reply to 33409)

Jacurutu: i have an issue with pytonlib and can't figure it out. 1) i query a seqno with client.lookup_block(workchain=0, shard=8000000000000000, unixtime=ts) 2) then i query the block transactions with client.get_block_transactions(workchain=0,shard=8000000000000000,seqno=seqno,count=count) 3) then for each transaction in the block i query the raw transaction client.get_transactions(account=account,from_transaction_hash=txHash,limit=1) the adress is in the form 0:4abf797b5cc1c847b9177648f047557d05f15c0cc0c320acdcbcbad66d58f50d os on basechain. I end up with a different hash and utime between step two and three. I have found similar messages and the issue was always querying the masterchain instead of the basechain. But here i'm on the basechain always. Can someone help me? BTW it make no sense to me that i need the hash AND the account adress to query for a transaction. On all other blockchains, the hash is enough. Can someone explain me?

Rahul: How to decode boc response.. And is nft sent or not they will always give me success response..  how can i check the NFT is transfer or not? Any idea?

&rey: Check NFT owner by calling /runGetMethod. (reply to 33415)

Rahul: This is only way? 😅 (reply to 33416)

&rey: This is the easiest way to check that chain of transaction succeeded: check whether the desired result (NFT transfer) was achieved. (reply to 33417)

Rahul: Ok is this method i can use in @tonconncet/ui-react (reply to 33416)

Rahul: ?

&rey: You need to call external API anyway, probably TON Access by Orbs. (reply to 33419)

Rahul: Ok I understand

Rahul: And how can i decode boc response? Any idea?

Rahul: Transaction response in boc format. I want to decode it

Marius: Hey, is there a way to find out when the next election is starting? I need to know in order to call a method on the elector contract at the correct time. Thanks!

&rey: It is either transaction or body of signed external message, not sure. (reply to 33423)

Rahul: Ok thanks

&rey: Doesn't the elector contain corresponding get-method? (reply to 33425)

Marius: Not that I know (reply to 33428)

Tumin | Wagmi11: has anyone use blueprint as an extension of another code? I want to automate the deployment of contract and I wanted to use mnemonic to interact and deploy my contract

TON Answers Bot (not AI): How to confirm success transaction for NFT? from Rahul Dabhi  I am using : React js @tonconnect/ui-react @ton/ton  Environment : Testnet   send transaction with : tonConnectUI.sendTransaction()  #### transaction response with web extension :  ----------------------------------------------------- {boc:"x{B92CC224AD7A1546F9974E8ACD9B4D7305D90A21A75A24C9732DB161B7D034A0D78239814924A11BAED572D69782624216DE00BCEE93A99090469BFEE2477D0029A9A31764E4EA950000000503}\n x{620019F5CCE72C6549AE5B6A58A2B80A5E02FD23B696B24A5EDCD3C6E47A671D3AECA017D7840000000000000000000000000001}\n x{5FCC3D140000000000000000801DC05C9F00471C18F28FB322BE12D4FE504AE6C28DCE7493DB17433AE4959A0CF001AF614CF808EEEE5A8EB27AC9BD31B27BB5F6B986682F71A7F8E1A0C5F0A51F54202}"}   #### transaction response with mobile wallet :  ----------------------------------------------------- {boc: 'te6cckEBAwEA/gAB4YgB3AXJ8ARxwY8o+zIr4S1P5QSubCjc50…T4Ajjgx5R9mRXwlqfyglc2FG5zpJ7YuhnXJKzQZwgKMscEHI='}  =============================================================  so i am getting different type of response with mobile wallet and web extenstion. i dont know how to confirm that success transaction. and every time they show me transaction success even nft was not transfered for some reason.  So i try to get nft owner by NFT address after getting transaction response but still got old owner its not updating after transaction i think its takes time.  So idecided to decode response and get Trasaction hash and the check data with this hash from api.  But i dont know how to get transaction hash.  Can anyone help to solve this problem in any way? i just need to confirm that NFT received in x wallet.  Thanks   🔗 Answer on TON Overflow

Jacurutu: anyone can explain me why we need an transaction and an account to query for a transaction instead of the a hash like most of the other blockchain?

&rey: web extension returns something strange... (reply to 33432)

&rey: Account indicates what shard to look through. Actually, you can load transaction by hash only via indexer such as https://dton.io/graphql. (reply to 33433)

Behrang: Read config 34.   It has the start time of the current round, and the end of the current round (start of the next round). (reply to 33425)

Behrang: If you use lite-client, you can run: getconfig 34

Roman: I want to make something on TON sites. Let's be realistic, TON sites are essentially a darknet. And it will be of interest primarily to those who need privacy and various organizations and persons under sanctions. But who needs another darknet, which moreover is not yet functional and only launched static sites, when there is the same Tor. But then how to make a statement about TON sites, so that somebody would want to use and develop them, so that everyone would want  to integrate TON coin, so that finally someone will do a TON mixer like tornado, and so that the TON browser will be integrated into telegram? I want move onion to ton. Onion.ton belongs to me, ton sites support subdomains. It'll be like web2tor - [site].onion.ton . Yes, I want to put darknet in darknet so you can use darknet when you're on darknet. And yes, we need to go deeper. Definitely, this will be the best web2tor solution - convenient, private and confidential. I'd like to go further,  and instead of standard nodes, find another solution, if tvm and smartcontract can allow it avoid external nodes, or something close in type to Yggdrasil.  In any case, even a distribution of standard nodes would be enough that anyone could put in to maintain network,  or by fundraising at the onion.ton address to create them. If anyone has interesting solutions, smartcontracts and any necessary code for any of these actions or has interesting ideas and thoughts,  feel free to DM me @romanbogdanoff  The next step after will be spreading the word about this via tweeter, reddit, telegram community and channels, and we can easily handle that. This could be a real chance to attract audience and developers to ton sites, get ahead of ENS and others, and make a move to the whole ton ecosystem.

— 2023-08-23 —

Павел: What I think about .ton sites:  1. It must be easy to host site data using ton storage 2. It could be a great opportunity to show data from chain dirrectly using ton domain. For example, by default, we could show on site text wich we could store at the same cell where domain hosted (for example we could implement getter in related contract, which return site content, which could be shown by default). Thus, it will be possible to use TON domains, at least, to display data inside the contract. These ideas can be developed endlessly...  3. Right now many applications contain nested browser, it is importatn to add ability to show TON domains through this browsers. Such way, seems like it must be implemented browser version for easy integration in existing mobile applications  I am interested in developing TON DNS and with pleasure would help to develop it

Павел: 4. This service https://dns.ton.org/#foundation show show me site data as well. Or, at least, link to site to be able open it in the browser…

Jacurutu: Thanks. But when we want to find the shards, we need the masterchain sequence number not the account? (https://toncenter.com/api/v2/shards?seqno=32116634) (reply to 33435)

Клецка: it would be much easier to make some proxy which will resolve .ton domains (reply to 33439)

Samyar: how can  i find a transaction using boc? or it'd be better to say how to confirm a transaction in ton using boc

Samyar: what explorer service ?

&rey: Actually, it seems like only https://dton.io/graphql can do that. It's easier to confirm intended effects of your transaction than to check that TON was sent successfully. (reply to 33452)

brian: How many keys can a dictionary have at most?

&rey: 32767, since account has limit of 65535 unique cells in storage. (reply to 33454)

brian: then why 32767?  not 65535?

Samyar: oh well i guess i will handle it using a random comment  because i want to confirm the transaction in another place than i have sent the transaction (reply to 33453)

&rey: Because dictionary is binary tree and has at least 2 unique cells per key—value pair. (reply to 33456)

brian: oh thanks,  I have an additional question. Is there documentation on how the dictionary is stored using the cell structure? The dictionary supports operations to obtain max, min, and next keys. Is it internally implemented using a heap? Should I refer to the TVM docs?

&rey: There is TL-B structure, and possibly a description in some PDF. (reply to 33459)

Dmitry | backend4you.ton: https://docs.ton.org/develop/data-formats/tl-b-types#hashmap-parsing-example (reply to 33459)

brian: Thanks. I'll look at it

Rahul: I also want to confirm that success transaction, if you find a way please let me know ok thanks (reply to 33457)

Samyar: The docs say you can use boc with an explorer service to confirm it  But there is no explorer service that does that  It really is a lack of documentation    Or at least I expected the success result to have the hash of the transaction... (reply to 33465)

Sea💎✈️: Hello, admin. What is the relationship between the address of the testnet and the address of the mainnet. I added the address of my testnet with a wallet tracker, however, when my mainnet address makes a transfer, the bot can track the activity of my mainnet address and send me a message, why? hope you can reply me

Yoyo: Is there a way to listen on an address and get all of the transactions in and out Is there a service or a library that does that?

Rasoul: ss

Tumin | Wagmi11: what wallet tracker are you using? (reply to 33467)

Tumin | Wagmi11: https://docs.tonconsole.com/tonapi/streaming-api#subscribe_account-method  Try this out (reply to 33469)

Rahul: Can you confirm admin is he real from your customer care?

Rahul: He says you need to sync wallet by connecting his link after i am able to use boc

Rahul: But he's not gonna tell me howw.. 😒

Tim: It's scam

Arsen: This is  developer chat, i am here a year, never seen a "customer care".  Because we are not customers :)   also an advice , never seen any real customer care to refer to clients as "sir" or "madame" )))   So this is scam.

Rahul: Ok thanks

Tumin | Wagmi11: if you find testnet support for it  please confirm I am looking for websocket solution for testnet  this works find for mainnet (reply to 33472)

Rahul: Oh i need this too.. is this working for testnet?  For confirm transactions which socket i have to use? mempool ? (reply to 33472)

User<5324347017>: Hi, just asking. Is ton storage can used right now, is it the same thing like filecoin?

&rey: Yes, it's available. (reply to 33482)

Rahul: Hey we can use this for testnet?

Rahul: Hey urgent question here... please answer me if you know... How we can get getgems nft rarity rank for our collection? Is there a api that we can fetch rarity rank of our nft?

— 2023-08-24 —

Fast is slow: dear ton team, can i have some testnet tokens

Fast is slow: the giverbot is not working

Fast is slow: kQCvhOSb_De_OXagJAa_zOLxm4BB3bCJ6YQAFsnx-fcWX1ob

Fast is slow: thanks heaps

Dmitry | backend4you.ton: @testgiver_ton_bot is working, checked just now (reply to 33488)

Fast is slow: not working on desktop version

Fast is slow: working on my phone

Dmitry | backend4you.ton: It’s telegram bot, you have broken telegram app is bot is not working on desktop )

Dmitry | backend4you.ton: So use it on phone. Just three messages needed (reply to 33493)

Fast is slow: what will be the choice of lang?

Fast is slow: func or fift?

Fast is slow: or tact?

Fast is slow: tact is much nicer

Daniil: Tact may be easier to begin with (reply to 33499)

Howard: - https://tact-by-example.org/all - https://github.com/tact-lang/awesome-tact (reply to 33496)

Handsome: Guys. Please why is my   @testgiver_ton_bot not working?  Last time I checked, I cancelled a transaction and it has not been responsive ever since.  I need answers please

Howard: it's works for me atm (reply to 33502)

User<5482816310>: 67975

Handsome: But it doesn't work for me, so what do I need to do to make it work? (reply to 33503)

Howard: I think you can cancel or re type /start

Handsome: Thanks for your reply.  This is what happened, I clicked on "get ton testnet "  Then a captcha came out. I clicked at the captcha to get it then decided to type on keyboard and mistakenly touched cancel  Please I really need to test out something (reply to 33506)

Handsome: Ever since then no reply

Handsome: I've tried clearing cache

Handsome: Hello, how long do I wait, am I being banned or blacklisted or something? Should just let me know

Benji: Hey guys, what's jetton transfer error 708? https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/contracts/jetton-wallet.fc#L68

Behrang: How about sending 6 characters? Maybe it's still waiting for the captcha. (reply to 33507)

Pavel: incorrect message layout. according TEP-74 you have to provide forward_payload:(Either Cell ^Cell) (reply to 33511)

Howard: PM me your address plz. (reply to 33510)

Fast is slow: is it possible to build a meme token on ton now?

Fast is slow: obviously need swap

Fast is slow: do we have uniswap or sth popular swap on ton?

Daniil: minter.ton.org (reply to 33515)

Daniil: https://ton.app/dex (reply to 33517)

Fast is slow: what's jetton

Hoang (Elliot): Go to ton document mate. They write everything about ton there (reply to 33520)

Hoang (Elliot): https://docs.ton.org

Fast is slow: is it possible to use tact to build jetton token?

Hoang (Elliot): Yes. Using blueprint framework (reply to 33523)

Fast is slow: what's the most popular framework in ton

Fast is slow: similar to hardhat or foundry in evm

Hoang (Elliot): blueprint (reply to 33525)

Hoang (Elliot): https://www.youtube.com/watch?v=MYSQMq-NaVM

Fast is slow: nice

Hoang (Elliot): this guy use Tact and blueprint

Fast is slow: whats the current state of ton? can you build a tax token?

Fast is slow: i mean build sth complex

Daniil: Yes (reply to 33532)

Handsome: I've tried the 6 numbers. (reply to 33512)

Handsome: Just sent you a PM (reply to 33514)

Artem: Hi. Do you know where I can see all methods of toncenter jsonRPC call's? Any docs maybe?

Howard: https://toncenter.com/api/v2 (reply to 33536)

Artem: I mean request body of post /jsonRPC Parameter 'method' (reply to 33538)

Howard: haven't try that, but good to ask on answers.ton.org. And I think someone can answer that later. (reply to 33542)

Artem: Ok, thanks (reply to 33546)

VIKTOR: This methods support in jsonRPC Example /jsonRPC  {   "method": "getAddressInformation",   "params": {"address": "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"},   "id": 1,   "jsonrpc": "2.0" } (reply to 33542)

Artem: Is there any others methods, which we don't have in openApi doc? For example, in tonweb sdk for js, we can call (reply to 33550)

Artem: Tonweb.wallet.create method. Can I interact with wallet, for example?

Artem: Maybe I am wrong and there is no rpc call under the hood

Rahul: Hey

Rahul: I have boc base64. I have try with boc base64 string. Convert boc to cell.hash its giving me bite8array i have also try with that..  Which type of transaction hash we have to send here?

Rahul: Its giving me invalid hash

Rahul: What sendBoc do? What is use of sendBoc?

&rey: Send external message to a contract. (reply to 33558)

Rahul: You know this? (reply to 33556)

Rahul: How to decode getTransaction raw message?

Maksim: you need convert this boc to cell (slice). what language do you use? (reply to 33562)

Rahul: React js

Rahul: JavaScript

Rahul: How to deserialise boc?

&rey: Cell.oneFromBoc(...) (reply to 33568)

TON Answers Bot (not AI): Efficiently storing Up to 4 million bits in a TON smart contract from Jeff  I'm working on a TON smart contract that may need to store up to 4 million bits. I understand from the TON documentation that this isn't typically recommended, but I'm exploring the possibility for extreme cases.  Given that a cell can hold up to 1023 bits, I'd need roughly 4 million / 1023 ≈ 4000 cells to store all the bits.  My initial idea is to employ a data structure that uses a dictionary. This dictionary would have up to 4,000 keys, with each key mapping to a cell containing 1023 bits.  Another approach I'm considering is leveraging the fact that a cell can reference up to four other cells. So, starting with four reference cells in my contract, I could keep expanding the depth of each cell hierarchy to store the full 4 million bits.  In most scenarios, my contract will likely use no more than 10,000 bits. But I want to be prepared for cases where it could expand to the full 4 million bits. Considering that, once stored, the data will mostly be accessed for reading (rather than frequent updates), what would be the most efficient way to structure the storage?    🔗 Answer on TON Overflow

Rahul: Hey 😅 Is there a way to get raw address of wallet in node js.  I am using tonweb..  I am getting raw address from nft metadata but i have my wallet address as user friendly

Rahul: Look i have check tonweb file but there is no function or method to convert it to raw address.

&rey: .toString(false) (reply to 33572)

Rahul: Oh yes how can I forget 😱... I think m too tired 😅

Rahul: Thanks (reply to 33573)

Rahul: Row address of nft : 0:d172c148c256899337fec64960b0b6e928f6069336735d0834f984d3023faefb ------------- User friendly address of NFT : kQDRcsFIwlaJkzf-xklgsLbpKPYGkzZzXQg0-YTTAj-u-9-t ------------- Row address convert with toString(true) : UQDRcsFIwlaJkzf+xklgsLbpKPYGkzZzXQg0+YTTAj+u+zni  Why why why  😰😰😰😰😰  Help me please 🙏🏻

Samyar: hey did u find a way for this ? (reply to 33465)

&rey: There are some flags for testnet, something like .toString(true, true, true, true). (reply to 33576)

&rey: You could also try .toString({userFriendly: true, testnet: true})

Marius: What exactly is a Gram in the ton terminology? And how do I get from Grams to a human readable TON value?   https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L116

Eugene: "Grams" is mostly an outdated terminology from the times when the whole cryptocurrency was supposed to be called Gram  I guess most of the times you can just perceive "Gram" as "Toncoin" and "nanogram" as 1 / 1000 000 000 of Toncoin, the smallest unit of measurement (reply to 33582)

Howard: yes, you can also using toNano from ton SDK. (reply to 33582)

— 2023-08-25 —

Bean: Hello you guys! Do we have any DEX on the testnet?

User<1633983160>: 😀

Dario: STON.fi has one, here you can find address https://github.com/ston-fi/dex-core (reply to 33585)

User<857683111>: https://app.tonkeeper.com/v1/txrequest-url/fragment.com/tonkeeper/rawRequest?id=Bsb-wb9ZPNlG1ZCT5-YAxfLy   how to use this to pay ?

&rey: Open the link on device with installed Tonkeeper. (reply to 33589)

User<857683111>: iwanh to use the api (reply to 33590)

&rey: Then you need to open the part after txrequest-url/ and do the transfer according to parameters there.

Tumin | Wagmi11: I am using blueprint on my backend side to interact with my contract, how can I make sure that the tx went through, and it has no error in it? the sequence no check might fail because I could have multiple tx happening at a given time, aslo if the tx is bounced back with error sequence no is still incrementing how to resolve this?

Fotex: How can I get the last block and its information in 0 workchain? And is it possible to get the transactions of the last block with one query?

Howard: Check the Toncenter/TON API. I remember there are a couple of ways to preview the Tx result, or to check the error code if there is one. (reply to 33593)

Cypto: Dear All, Am installing toncli : admins@admins-Vostro-3490:~/toncli_projects/toncli$ toncli INFO: 🥰 First time run - i'll create config folder 4you and save some stuff there INFO: 🤖 Check all executables are installed... WARNING: 🤖 Can't find executable for func, please specify it, e.g.: /usr/bin/func Path:

Tumin | Wagmi11: thank you on it! (reply to 33595)

Язон: why tonkeeper disapered from google playstore? I also remember that it was some kind of official wallet in there and I also can]t find it.

Миха: Really 😱 (reply to 33600)

Язон: what is official wallet for TON? that will not steal my keys

Anton: https://ton.org/en/wallets?filters[wallet_devices][slug][$in]=mobile&pagination[limit]=-1  Tonhub, probably (reply to 33602)

Anton: or get the APK of TonKeeper (reply to 33603)

Tony 10am-7pm: Anyone has any NFT minting smart contract in TON for sale?

Rahul: Hey how can i load my wallet from backend... without using ui?

Rahul: What information required to load wallet from backend?

Alexander: What does "Integer out of expected range" mean? Is it something like if I try to store in uint8 a larger value?

— 2023-08-26 —

Luke: when u called store_uint(x, n),  x was >= 2^n or x was negative (reply to 33608)

Gardener: 😭 damn you're right its gone wtf (reply to 33600)

Gardener: I spent a while writing a review for it on the like a month ago too lol

Alexander: Oh i see, thanks! (reply to 33609)

Jhunie Ray: what's exit code 709?

Frosiva: I get this error when installing tonsdk

Frosiva: And also pytonlib

순범: is default send mode of wallet 1?

순범: paying fee separately

Maksim: 3 ignore errors + pay fee separately (reply to 33626)

순범: thx (reply to 33628)

Rahul: Hello, is there tonapi.io call limit?

nonam3e: https://tonconsole.com/ (reply to 33630)

Jo: Hi, would you guys listen to me on a very delicate matter?

Jo: I don't know what TON is

Jo: But I want to warn you about a member of this community

— 2023-08-27 —

Yan: we're tryin to integrate jetton price indexing into @CoinCrackerBot, is there a way/api to get the relevant list of tokens and their prices? ideally a dex supporting such toolkit

User: You can directly get prices from dedust v2 smart contract using method get_reserves (reply to 33636)

Yan: a bit more info please (reply to 33637)

User: i dm you (reply to 33638)

Handsome: Tact vs FunC which one is better. Where can I learn?  Or can anyone explain the difference. Should I learn tact or funC or java

Rahul: How to buy this plans? (reply to 33631)

nonam3e: you may buy a plan on https://tonconsole.com/ (reply to 33643)

nonam3e: Tact is easy-to-learn, but isn't gas effective as func, which is harder to understand if you don't have enough experience in programming (reply to 33641)

nonam3e: also tact doesn't support many things from func right now, because it's currently in development

Mehran: Is Tact Best for Long-Term and How Many Years Learning?

Andrew: No difference between Tact and Func, if you don't know how work tvm and ton

Handsome: Guys when is the ton masters program starting? (reply to 33646)

Cypto: where to go for .ton domains

User: You can use special ton proxy extensions for browser to surf .ton domains. For buying https://dns.ton.org/ (reply to 33650)

Cypto: Where do we see auction domains which is on auction means onging to participate?

Handsome: Good question. (reply to 33652)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: hi there.  I'm trying to convert a simple FunC code to Tact but I didn't find any docs about how to store dict & udict in Tact. Is there any useful documents to share please? Is it true by using as key? P.S: the type of orders is cell orders: Cell as dict;  is it same as  .store_dict(orders);

— 2023-08-28 —

Behrang: Have you deployed your contract? (reply to 33655)

Клецка: you need to send an about 0.5 TON to contract as soon as it was deployed (reply to 33655)

Alexander: Hi guys, I have troubles deploying smart contract via Blueprint scripts with Orbs API inside. I get HTTP error 500 internal server error, however get-method scripts work fine.  I wonder if it could be too big request body?   _contentLength: 9930,  Any ideas?

Marius: Calling the list_nominators method on a validator contract returns a list of the nominators. The response has 4 fields address, amount, pending_deposit_amount, withdraw_requested. Is the address  field the address of the wallet of the nominator?

Marius: The value of the address field looks like this `3334383834393438303838313931303938343136373434363930313630383435353239303030333632363535393233353530393531323931303434343638343533303434363338393034393338`

nonam3e: https://github.com/ton-blockchain/nominator-pool/tree/main (reply to 33665)

Robert: Hi guys! I'm currently studying the TON network for a project I'm working on, and I have some questions about sharding and other aspects.  If a shard can be created after the network load, then the seqno of the two shards will be incremented independently. This creates a problem for me as I want to run a Cron task that tracks the transfer of addresses stored in the database, and there can be a large number of them. I need to show all wallet transactions. However, I cannot track them using seqno (similar to how I did it on the Ethereum network where it was called blocknumber) because it can change and parsing blocks might lead to bugs. The Masterchain is also sharded, so that option is not viable either. As a result, I am out of ideas.  I hope this clarifies my question. Thank you!

— 2023-08-29 —

Brooklyn 🥃: Hello, good day, how can you add the Ton payment gateway to your Telegram bot? And is there such a port at all similar to Bitcoin and other cryptocurrencies? Thank you for sending me the related documents. «I don't want it connected to @wallet because it's not decentralized»

Faker: RuntimeError: Error in tonlibjson.__del__: 'TonLib' object has no attribute '_tonlib_json_client_destroy' what this error meas?

Faker: when I init the client(TonlibClient)

Faker: when I use macos it's working, but when I use the ubuntu it doesn't work

&rey: Most commonly, OpenSSL 1.1.1 is not installed. (reply to 33674)

&rey: > how can you add the Ton payment gateway to your Telegram bot? https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot (reply to 33668)

&rey: Contract is not deployed, meaning that incoming bounceable messages do bounce to their senders. Sending an unbounceable message won't deploy the contract; you need to send StateInit with the message. (reply to 33672)

&rey: 1. TON masterchain is not sharded. 2. The correct approach is to take last masterchain block and parse all blocks accessible from it by references (that is, previous masterchain blocks, shardchain blocks, previous shardchain blocks and so on). (reply to 33667)

&rey: Normally, your SDK allows to pass StateInit together with the destination address and message value. (reply to 33684)

Faker: thank you I will try it now (reply to 33680)

&rey: Oh, then I misunderstood that a bit... (reply to 33686)

&rey: Please try to deploy the contract in mainnet, since testnet has worse debugging tools. (reply to 33691)

&rey: Is collection working as needed? In particular, does get_nft_address_by_index(0x61e17f0162b8a18359ed420ef030306405c9df6adbea8f0297309e85d35251df) return EQAIeGNHznmOW0OGrwl0Jz4sXbg_Sx2twGq2REYO3FwJHo9w?

&rey: Actually, pair collection+NFT is NOT working correctly. (reply to 33697)

&rey: Your NFT returns individual_content = null().

&rey: Then, collection get-method get_nft_content(your_nft_index, null()) returns content = null.

&rey: So your contract cannot be showed as NFT.

&rey: Individual content is pretty anything, that is needed for metadata calculation in get_nft_content. In most cases, it is metadata itself. (reply to 33704)

Faker: name: /usr/local/lib/python3.10/dist-packages/pytonlib/distlib/linux/libtonlibjson.x86_64.so Traceback (most recent call last):   File "/home/ubuntu/wallet.py", line 100, in <module>     asyncio.get_event_loop().run_until_complete(main())   File "/usr/lib/python3.10/asyncio/base_events.py", line 649, in run_until_complete     return future.result()   File "/home/ubuntu/wallet.py", line 66, in main     seqno = await get_seqno(client, 'EQBH5fyRXV3O6kzLMkIQum8c5kSDgnFujgn0DtXWAA0X9OcC')   File "/home/ubuntu/wallet.py", line 46, in get_seqno     data = await client.raw_run_method(method='seqno', stack_data=[], address=address)   File "/usr/local/lib/python3.10/dist-packages/pytonlib/client.py", line 244, in raw_run_method     contract_id = await self._load_contract(address)   File "/usr/local/lib/python3.10/dist-packages/pytonlib/client.py", line 212, in _load_contract     result = await self.tonlib_wrapper.execute(request, timeout=self.tonlib_timeout) pytonlib.tonlibjson.BlockNotFound: LITE_SERVER_NOTREADY: cannot load proof for (-1,8000000000000000,5176746):6E8A200DF183356CC29EDCAF4AD261E179664092FC12B5BB524E6A633AB11DD8:CB025E3514846F903D7068EC5D007674051D5397CD54E0FFF9889B959BB6C089 : not in db(during last block synchronization)

Faker: what this means?

Faker: who can help me ...

Maksim: you can try https://github.com/yungwine/pytoniq (reply to 33706)

Faker: the ton chain confused me .... thank you (reply to 33709)

Faker: hardforks differs from embedded hardforks another error .... this is an examples

Faker: what happens? I can't sync the block always

Dmitry | backend4you.ton: it seems lite-server you connecting to is not working. or connection issues with your internet and you fails to get answer (reply to 33720)

Faker: what can I do?

Dmitry | backend4you.ton: if you connect to your own lite-server - check it. if you use some "other" (public) lite-server  - try to choose other one

Faker: do you know how much about the own lite-server (reply to 33723)

Dmitry | backend4you.ton: its the server that you interact with when you want to interact with ton blockchain. there is a bunch of them available publicly, but some (all?) of them are not guaranteed to 100% uptime work. (reply to 33724)

Dmitry | backend4you.ton: so either you need to spin-up your own, or just randomly(?) reconnect trying to find working one. reconnects works for me, but I use other language sdk

裸裸: how to GetConfirmedBlockNum via  https://tonapi.io/  apis.

裸裸: I can only implement this: func (t *Ton) GetBlockNum() (int64, *cerror.CError) {  var res MasterChainHeadResp  resp, err := chttp.NewHttp().SetRetryCount(3).   SetRetryWaitTime(time.Second * 3).   R().   SetResult(&res).   Get(t.rpc + "/v2/blockchain/masterchain-head")

裸裸: can not implement this: func (t *Ton) GetConfirmedBlockNum() (int64, *cerror.CError) {  //TODO implement me  panic("implement me") }

&rey: TON blocks cannot be unconfirmed. (reply to 33727)

&rey: Once they are generated and signed by 2/3 of validators, they are final. And they don't show up in any API until then.

Muskan: how can i get the api-key for sign the transaction over the network??

User<5841544362>: Hello I am a full stack blockchain engineer I am looking for full time position

Robert: How does the seqno shard behave in the workchain? If a new shard is created, what iteration of seqno will be in this shard? What iteration of seqno is in each shard? Is there any documentation with an example? (reply to 33683)

Daniil: you have already asked that in Russian @tondev chat and received an answer  What is your question exactly? (reply to 33734)

Benji: I wrote a receive handler for jetton TransferNotification in my smart contract, however when I try to transfer jetton tokens to it, the first two steps(Transfer, Transfer Internal) succeed, but the notification fails with error code -14. What does this error code mean?

&rey: Insufficient gas. (reply to 33736)

Robert: I got the wrong answer twice (in Russian chat I received an answer that the masterchain can be sharded, is it oke?) (reply to 33735)

Daniil: As I see, you only received correct answers there.  Masterchain doesn’t split to shards (reply to 33738)

Robert: yes, but not in Russian chat (reply to 33739)

Robert: so, I would like to get answers here - en chat

Daniil: Then ask the question :) (reply to 33741)

Benji: How to call accept_message() in tact?

nonam3e: acceptMessage() (reply to 33743)

Benji: Thanks! (reply to 33744)

Robert: this question is actual, please help me understand the behavior🙏 (reply to 33734)

Daniil: Suppose that there was a shard with latest seqno 1000. It splits into two shards and each of 2 new blocks in these shards has the seqno 1001. (reply to 33734)

Robert: seqno in new shard started with 1001 (from example?) not with 0 (or 1)? (reply to 33747)

Robert: in masterchain im see array with 2 shards with different seqno? (reply to 33747)

Robert: how i check if shards  > 1? I need check it before parsing messages in shards

Daniil: 1001 (reply to 33748)

Daniil: Yes, because after splitting, shards can grow in height with different speed (reply to 33749)

&rey: 1. Seqno in new shard will start with 1001 in the example. 2. Yes, masterchain will have a binary tree with two shards, and they're not guaranteed to have same seqno. 3. If you have the block cell, you need to look at ShardHashes object (https://github.com/ton-blockchain/ton/blob/e1197b13d43a082a48402bdbdeadab472087ad09/crypto/block/block.tlb#L522). Otherwise, you may just look on the list of shards. (reply to 33750)

Robert: so, and what happens after merger for example? Before in Sh1 (shard 1) have last seqno is 1030 Before in Sh2 (shard 2) have last seqno is 1050 (from 1001)  After Sh1 seqno equals: last seqno in Sh1 is 1030 + 49 (1050 - 1001).   Is right?

Robert: and can i see with what seqno iteration began

&rey: {Sh1: 1030, Sh2: 1050} —> {Sh12: 1051} (reply to 33754)

Robert: 🤔, if Sh2 start with seqno 1001 then difference will be 49 (1050 - 1001). These blocks must into parent shard. (reply to 33756)

&rey: Doesn't it just take maximum of merging shards' seqno? (reply to 33757)

&rey: And it does. https://github.com/ton-blockchain/ton/blob/e1197b13d43a082a48402bdbdeadab472087ad09/crypto/block/block.cpp#L996

Faizuan: Color usernames exist

Robert: Is it because the merge is at AccountChains level? What rule AccountChains distributed if they were in different secno? (reply to 33759)

Daniil: accounts are distributed between shardchains depending on the first bits of account address hash (reply to 33762)

Daniil: seqno don't affect the distribution

Robert: thanks guys for helping me 🙏

Tim: How to estimate transaction fee cost when sending max/full amount from wallet to wallet?

Rahul: Hello, which sdk we can use for full wallet access from backend.. i have own wallet and want to do auto transactions.   Is that possible?

— 2023-08-30 —

Yan: we've managed to support jettons on @CoinCrackerBot -thanks to all who supported with dev questions  tl;dr, stonfi seems to feature the most suitable piece of api. namely, it provides exact rates in USD recalculation (even tho we had to cut the decimals output cuz it's like 16 digits after the dot lol)

Faker: this sdk has problem?

Michele: try store_uint(var, 32) (reply to 33771)

Faker: lol, 32 is not working, 64 is good

Michele: because size your number, i think

testertesterov: Has anyone managed to unlock themselves in The Open Network tsc4 contest?

User<416073756>: hello at. all !! can. you telle me if somes dapp are in Python ?

User<416073756>: all ok thank'you !! (reply to 33776)

Official: No (reply to 33283)

D.Hiroki: Where can I find out about the current total number of TON DNS issues? And what are the costs of acquiring and maintaining a domain name?

&rey: Cost of acquiring: depends on length of domain name. Cost of maintaining: a small fee each year, both to continue storing domain contract and to indicate to it that you're active. (reply to 33781)

D.Hiroki: Thank you! How mush is the minimum amount? (reply to 33784)

&rey: 2.6 TON, though all domains get acquired through an auction. (reply to 33785)

D.Hiroki: Thank you.  Is the total number of DNS issues 32K correct? (reply to 33786)

D.Hiroki: https://blog.ton.org/ton-holders-and-validators-vote-in-favor-of-implementing-the-toncoin-real-time-burn-mechanism  Can you give me a query to check the TON that has been burnt? I have followed the official procedure, but I don't get any results.

Kon: deep links for tonkeeper has stopped to be working because some issue with google, right? just can't login via tonkeeper from TWA, from qr on desktop - ok, but tonconnect can't see that app is installed. Does anybody face the same case?

D.Hiroki: If anyone knows the total burn quantity, please let me know. (reply to 33788)

Kon: https://github.com/logvik/ton-ico-on-func - if somebody will want to use for own projects funding through ICO...

Sam: Anyone know if you are able to run multiple nominator pools on a single validator node?

Faker: god damn it who can solve the python sdk problem?  pytonlib.tonlibjson.TonlibNoResponse: tonlibjson did not respond, why always raise the foolish error?

User<1768522456>: Are Venom and Everscale compatible with native Ton chain? (At least with token transfers)

&rey: Apart from even-odd pools, I guess no; however, it should be possible to start second validator on the same server. (reply to 33796)

User<1768522456>: @pcrafter? (reply to 33798)

&rey: I don't know that. (reply to 33801)

User<1768522456>: If I will fork current state of ton blockchain and will change, let's say, only token name, will it be possible to exchange tokens between ton network and newly created ton based chain?

Андрей: try it and then tell us what happens) (reply to 33798)

User<1768522456>: No one tried that before?

Dmitry | backend4you.ton: many can guess the answer/result. but its only a guess so you need to check yourself to be 100% sure

&rey: You will need a cross-chain bridge, based either on oracles or on contracts that will validate blocks. However, validator is implemented in C++ and not in FunC, so you'll need to recreate a bunch of stuff. (reply to 33803)

User<1768522456>: So there is no such thing as IBC (Cosmos network) protocol to exchange tokens between sovereign chains?

&rey: There is no such mechanism integrated on blockchain level. (reply to 33810)

User<1768522456>: Thank you!

addlyy: Does anyone know if there are any services providing websocket subscriptions to new blocks on ton network?

&rey: Check https://tonapi.io. (reply to 33813)

addlyy: i only see rest api option there (reply to 33814)

addlyy: nvm found it

Yoyo: what are the suspended accounts in the blockchain config mean?

Isaac: https://tonscan.org/suspended (reply to 33817)

Alex: Toncoin has been increasing in price consistently for the last 10 days, even though big investors (whales) haven't been very active.  This suggests that regular people are driving the price up.  Furthermore Discussions about TON on social media has been increased in the past month.   The open network has done really well compared to other top cryptocurrencies in the past week.  It's gained 11.55% in value, making it the top gainer among the top 100 cryptocurrencies. In the last 24 hours, it has gone up by 2.9%   Currently, the entire value of TON is estimated to be around $5.17 billion. This value represents the combined worth of all existing TON coins.   Website | Blog  | Twitter (forwarded from TonRadar)

Andy: Contract based bridge sounds interesting. Do you have any resources about those please? (reply to 33807)

Ilja: Hi is there any documentation for anonymous telegram numbers? would like to find if it has any on-chain functions

— 2023-08-31 —

&rey: This is scam. Please be careful and report the chat. (reply to 33824)

Brooklyn 🥃: 🚫 (reply to 33824)

Dmitry | backend4you.ton: https://github.com/TelegramMessenger/telemint (reply to 33822)

&rey: You can look whether there are such functions in the code. Just see the contract in explorer. (reply to 33822)

연형: Hi! I wanna get some help running a full node. I followed the instructions in https://docs.ton.org/participate/nodes/full-node to setup a node and network infra. After some time I managed to launch a node, but validator-engine outputs a log message "Error : 651 : no nodes". I ran a tcpdump and saw the packets sent and received from/to my designated udp port. It seems not a network or communication problem. I used a official global.config.json for the mainnet, and the local config.json was generated by the validator-engine binary. I was not able to locate the problem. What can I do to figure out the problem?

연형: An update: occasionally (not frequently) the node output a log message: "Error : 652 : adnl query timeout". Most of the time, it just outputs Error 651.

Ilja: Thanks (reply to 33831)

Андрей: how long has the node been running and giving this error? Usually nodes need knocks to find other nodes and synchronize. (reply to 33833)

연형: Several hours now. 4 or 5 hours maybe.

연형: And I stopped the node and juggle the conf and ran again from time to time. Current run lasts about an hour or more.

연형: Is there any way to see the current neighbor list?

Channel<1911665390>: is there any api to get ton address by telegram username?

Клецка: which platform you use? (reply to 33840)

Клецка: Fragment, maybe. But usernames are not always mapped to accounts

Channel<1911665390>: fragment response with html code

Channel<1911665390>: i mean except spider way

Channel<1911665390>: is there any api can get result directly?

Клецка: i dont know about such apis, sorry

Channel<1911665390>: Thanks buddy

Malte: Hi! I need to iterate through *all* TON transactions in order to build some indexes and statistics. I have an archive node running locally and use toncenter/ton-indexer (Python/libton) to crawl that but it's pretty slow (processes about 3500 blocks per hour) with the liteserver connection throwing a lot of errors (timeouts mostly). My server appears I/O bound (maxes out at about 300MB/sec). Any ideas to improve that? What would be the fastest way to iterate over all txns from Python? Also, is there a list of public archive nodes so that I could distribute the queries?

Yan: @tonsider published a huge post about the new tact lang, real excited about all the web3 devs that it could attract

— 2023-09-01 —

Synth: Hey guys are there any projects that are using ledger technology in TON?

Ilja: I can't see any function for telegram numbers to get the verification code on chain. It's only possible manually through fragment? (reply to 33831)

&rey: Yes, verification codes are created by Telegram+Fragment and don't use blockchain neither for generation nor for storing. (reply to 33854)

Ilja: Thanks mate. I had a thought to use numbers in a contract to borrow numbers to other users but as long I have to get the verification code manually, it wouldn't work (reply to 33855)

&rey: Yes. Though, it's possible to base other services on such numbers — just without using Telegram verification codes. (reply to 33856)

Anton: Has anyone received a reward for TSC4?

testertesterov: Has anyone received a response from tsc4 moderator if solutions were banned by mistake?

Dmitry: Hi everyone! Can anyone point me to good resources for finding a job in crypto as a software dev? I already know about TON Jobs, but there's not a lot there... I apologize if this is too off topic btw

Ivan: Hi all! Gusarich and I updated the TON tutorials from toncli to Blueprint:  https://github.com/romanovichim/TonFunClessons_Eng  There were also tutorials on ADNL (how to take data from the blockchain without an intermediary, to put it bluntly), Ton Connect React UI (how to assemble it with wrappers for contracts from blueprint) and so on.  I hope this will be useful and I will be grateful to your stars on the repository.

Gunnar: The TON DNS contract is a NFT collection - but it's non-sequential - i.e. the IDs of the items are the sha sums of the domain. That's nice - but give me no way to list all known DNS entries - how do people like https://getgems.io/collection/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz do this?   "Just" go through all transactions for that contract? 😭

Rahul: this subwallet id is fixed or it will changed wallet-wise?  storeUint(698983191, 32). // subwallet_id

Tee: check your DM (reply to 33852)

Bean: Hello you guys, how can I set max supply for Jetton token? In the example contract, I can mint any amount of token, and the tottle supply is just sum them together

JS_: Hey GM!

JS_: decided to join the telegram community :P

JS_: I'm currently workng on interactive ai:  https://youtube.com/@mequavis/live (use !eve in live chat to prompt)   Hoping to find a web3 ecosystem partner and grants program that can help accelerate our development

Official: Hello 👋 Guys (reply to 33848)

Official: Nice (reply to 33868)

Official: How? (reply to 33863)

Rahul: with signature and seqno we can send NFT without wallet confirmation right?   how we can add signature and seqno to this NFT transaction body   const transferNftBody = beginCell().    storeUint(0x5fcc3d14, 32). // Opcode for NFT transfer    storeUint(0, 64). // query_id    storeAddress(destinationAddress). // new_owner    storeAddress(walletAddress). // response_destination for excesses    storeBit(0). // we do not have custom_payload    storeCoins(toNano("0.01")). // forward_amount    storeBit(1). // we store forward_payload as a reference    storeRef(forwardPayload). // store forward_payload as a reference    endCell();

Rahul: Hey anyone know that we can tranfer ft and nft with signature?

Rahul: Without Wallet permission

Rahul: I want to distribute tokens automatically to the users from my own wallet. Is there any way to do that?

&rey: Yes, there is. (reply to 33875)

&rey: Please take a look on SDKs like @ton/ton that provide interfaces for wallet contracts. (reply to 33872)

Rahul: Can we send FT and NFT in one transaction?

User: Can you help me, is that possible to send from contract to address in slice, what type of address i need to store there? (user friendly or raw)

&rey: Yes, you can send up to 4 transactions each of which can trigger certain actions such as sending tokens. (reply to 33878)

Bean: Hello guys! From my understanding, when we attempt to transfer a quantity of Jetton tokens to a user, we have the option to request a notification that includes attaching a "forward_ton_amount" to send to a specified wallet. If we set the message (msg) amount to be less than the "forward_ton_amount," and the user's Jetton wallet contains enough TON, it will utilize these funds to send to the intended destination wallet.  For instance, let's consider a scenario where I'm minting Jetton tokens for a user who possesses a suitable Jetton wallet containing 11 TON:  -I specify a msg amount of 0.5 (indicating that I've attached 0.5 TON for covering gas fees). -I set the "forward_ton_amount" to 10 TON. -The user's Jetton wallet contains 11 TON.  The outcome is that 10 TON will be refunded to me. In essence, this implies that I've effectively obtained 10 TON from another source.

Bean: For example https://testnet.tonviewer.com/kQAbgM4LfbuhRpKUXA1eaB3X_az7oiEBV-NNdTtIja85lEFf/transaction/46d6f1d713a3dba397893941dd6fdf849972b7a3df8b49a65c45e4998351ce56 I send 0.5 but receive 0.7 TON

— 2023-09-02 —

Official: Hmm (reply to 33881)

Official: Well it’s you choice

Official: Yes (reply to 33875)

Official: Yes that’s how it goes (reply to 33872)

Official: Ok (reply to 33868)

Official: I you have an idea for proposal,

Erik🆓: I look at a transaction but different fees are shown on the sending and receiving sides:  https://ton.cx/tx/40120036000001:igyNIlF6S7U1O1Xxxnmpf1AWZRlZV5Q8hhX6sCOfIRQ=:EQDzGLlQL6JhJK82Gz3vKluNEWF27xPWInVeLDklXibgiOJq  https://ton.cx/tx/40120036000003:UnGLamyldhsh/Fh5CFrhQ++OrawV2h0gB/ELo6u3sug=:EQDSIa05tKGrm3hI9JistDeF09Rf0BHDesyu7Akzkk7JCQma  I was told that only the sender pays fee. Does the sender pay both 0.005832726 and 0.010725706?

User<6247944943>: hi, what is run_ticktock for? https://docs.ton.org/develop/func/functions#function-name

Dmitry | backend4you.ton: You expected to remove yourself from admin (set it to zero) when you minted “enough”, and currently minted amount (Sum of all mints) will be fixed forever.   If you want to set max limit before minting all of them - you need modified/custom contract. (reply to 33865)

TON Answers Bot (not AI): Using Continuation (cont) in functions from Evgeny K.  Let func "call" such as: int call((int -> int) f, int x) {     return f(x); }  But I need to store "f" on smc deployment stage, as initial state. How can I store "f"? I see "bless" func to parse slice to cont, but how to create slice of "f"?  🔗 Answer on TON Overflow

Rahul: Is there way to let user withdraw jetton or nft from our wallet without permission?  I want to let user to withdraw their nft and jetton reward when staking period over.  Please let me know if its possible i am using node ja and react js.

Rahul: And it is necessary to include destination address in external message because i have already added destination, src ans nft address in internal msg body?   Its like everywhere is address 😅

Rahul: I try with src wallet address as external msg address and its still working.

Rahul: I didn't understand what is the point of external message address when we transfer tokens.

Rahul: Or we can remove destination or src address from nft internal msg body? And use when create external msg body.

TON Answers Bot (not AI): Transaction body for jetton and NFT from Rahul Dabhi  i want to know which address is optional because i have define main wallet address many time. this is working example. i want to short this method if possible. This method is long and i have doubt that i added unnecessary code or method into this. so anyone know that what is unnecessary code here that i have to remove or how we can short this method?   walletAddress : main owner wallet address  toAddress : destination address (transfer to) nftAddress : NFT address  Using : react js and node js   const forwardPayload = beginCell().         storeUint(0, 32).         storeStringTail("UNSTAKED").         endCell();     const transferNftBody = beginCell().         storeUint(0x5fcc3d14, 32). // Opcode for NFT transfer         storeUint(0, 64). // query_id         storeAddress(Address.parse(toAddress)). // new_owner         storeAddress(walletAddress). // response_destination for excesses         storeBit(0). // we do not have custom_payload         storeCoins(toNano("0.01")). // forward_amount         storeBit(1). // we store forward_payload as a reference         storeRef(forwardPayload). // store forward_payload as a reference         endCell();     const internalMessage = beginCell().         storeUint(0x18, 6). // bounce         storeAddress(Address.parse(nftAddress)).         storeCoins(toNano("0.05")).         storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference         storeRef(transferNftBody).         endCell();       let toSign = beginCell().         storeUint(698983191, 32). // subwallet_id | We consider this further         storeUint(Math.floor(Date.now() / 1e3) + 60, 32). // Transaction expiration time, +60 = 1 minute         storeUint(seqno, 32). // store seqno         storeUint(0, 8).         storeUint(3, 8). // store mode of our internal transaction         storeRef(internalMessage); // store our internalMessage as a reference      let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature      let body = beginCell().         storeBuffer(signature). // store signature         storeBuilder(toSign). // store our message         endCell();     let externalMessage = beginCell().         storeUint(0b10, 2). // ext_in_msg_info$10         storeUint(0, 2). // src -> addr_none         storeAddress(walletAddress). // Destination address         storeCoins(0). // Import Fee         storeBit(0). // No State Init         storeBit(1). // We store Message Body as a reference         storeRef(body). // Store Message Body as a reference         endCell();        const result = client.sendFile(externalMessage.toBoc());   🔗 Answer on TON Overflow

Rahul: Guys this is my code take a look please and let me know if you know something ok Thanks (reply to 33902)

Rahul: An also users staked lots of nft so i have to transfer many nft and jetton as reward at a time and here is 4 transactions limit in single sendFile transaction right.. so if you have idea how i can do this because there is api call limit also.. and i have many users who will unstaked their nft at a time so..

Santosh | Wagmi11: How do we concatinate 2 strings in func?

blacktyg3r: In python? (reply to 33905)

Santosh | Wagmi11: FunC contract  slice concat_message = "hello" +"wold";

Daniil: Compose a cell with these slices (reply to 33905)

&rey: Well, jetton wallet usually checks whether the incoming value is sufficient for forwarding. (reply to 33881)

&rey: Highload wallet, or design contract so that users can unlock their NFTs themselves. (reply to 33904)

&rey: Plugins on wallet v5 (https://github.com/ProgramCrafter/wallet-contract) or a special contract in place of your wallet. (reply to 33897)

Rahul: hey is there any platform that we can create test jetton TOKEN (FT)?

Rahul: like testnet.getgems where we can create test NFT.

&rey: minter.ton.org/?testnet=true (reply to 33912)

Howard: any better options then TonHub's API? It's not stable in main-net:         endpoint: "https://mainnet-v4.tonhubapi.com",

Anthony: https://www.orbs.com/ton-access/#get-started (reply to 33916)

Rahul: hello,

Rahul: In tonweb js sdk, they load wallet from base64 so where i can get this base64 of my wallet ? const seed = TonWeb.utils.base64ToBytes('vt58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY=');

Rahul: or can i get seed from mnemonic ? using tonweb

John: This works for me:         const words = "govno zalupa penis her davalka..."         const tonweb = isTestnet ? new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'))             : new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));          const key = await mnemonicToKeyPair(words)          var wallet: any = undefined;         if (walletType === 'v4R1') {             wallet = new tonweb.wallet.all.v4R1(tonweb.provider, {publicKey: key.publicKey, wc: 0});         } else if (walletType === 'v3R2') {             wallet = new tonweb.wallet.all.v3R2(tonweb.provider, {publicKey: key.publicKey, wc: 0});         } else if (walletType === 'v3R1') {             wallet = new tonweb.wallet.all.v3R1(tonweb.provider, {publicKey: key.publicKey, wc: 0});         } else {    // v4R2             wallet = new tonweb.wallet.all.v4R2(tonweb.provider, {publicKey: key.publicKey, wc: 0});         }          const address = await wallet.getAddress(); (reply to 33920)

Rahul: you mention mnemonicToKeyPair, where did you get from? i mean is that from tonweb? i didnt find this.

&rey: tonweb-mnemonic module. (reply to 33924)

John: "tonweb-mnemonic": "^1.0.1",  import { mnemonicToKeyPair } from 'tonweb-mnemonic'

Rahul: ok thanks but can i use this in node js because i am creating this from backend

Rahul: ok let me check

Rahul: we can use this for test wallet words? (reply to 33926)

Rahul: because its not working

Rahul: const tonwebMnemonic = require('tonweb-mnemonic'); const mnemonic = "word1 word2 word3" const key = await tonwebMnemonic.mnemonicToKeyPair(mnemonic)

Rahul: giving me error like this  mnemonicArray.join is not a function

Rahul: i think i need to pass array right

Rahul: its working now 😁

Rahul: Hello,  jetton transfer giving me exit_code: 11. any idea what this is about?

Dmitry | backend4you.ton: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 33935)

fj: hi! I am new to ton and would like to know wich is the best python library or sdk ot interaction with the blockchain, thanks

Rahul: Exit code: 65535 OpCode: Jetton Transfer  am i missing somthing?   const jettonWallet = new JettonWallet(tonweb.provider, {      address: new Address(jetton token address) }); const bank = new WalletClass(tonweb.provider, {          publicKey: keyPair.publicKey,             wc: 0      });  const seqno = (await bank.methods.seqno().call()) || 0;  const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('gift')]);      const address = await bank.getAddress();      const transaction = await bank.methods.transfer({          secretKey: keyPair.secretKey,          toAddress: new Address(jetton token address),          amount: TonWeb.utils.toNano('0.05'),          seqno: seqno,          payload: await jettonWallet.createTransferBody({              jettonAmount: TonWeb.utils.toNano('10'),              toAddress: toWallet,              forwardAmount: TonWeb.utils.toNano('0.01'),              forwardPayload: comment,              responseAddress: address          }),          sendMode: 3,      }).send()

researcher: https://docs.ton.org/develop/dapps/apis/sdk it's hard to say which is the best one (reply to 33937)

Rahul: can i create second testnet wallet in tonkeeper?

Step: go to settings » tap version number 5 times. (reply to 33941)

Rahul: and then? (reply to 33942)

— 2023-09-03 —

Step: then you will be asked to select mainnet or testnet (reply to 33943)

Faker: async def get_seqno(client: TonlibClient, address: str):     res = await client.raw_run_method(         address=address,         method='seqno',         stack_data=[]     )     print(res)     seq = int(res['stack'][0][1], 16)     print(seq)     return seq mainnet, query the seqno but got the exit_code -13

Faker: {'@type': 'smc.runResult', 'gas_used': 0, 'stack': [['num', '0x14c97']], 'exit_code': -13, '@extra': '1693717833.227085:11:0.7723829592602006'}

&rey: Is the wallet at address deployed? If not, the correct seqno to use is 0. (reply to 33948)

Faker: thank you, I fix the bug, the wallet's version that I recovered from mnemonics is v3r2 but I used the v4r2 method🤯 (reply to 33950)

Rahul: I have one already i know this process. I want second test wallet of v4r2 (reply to 33947)

&rey: You can use other wallet app or log out of current wallet in Tonkeeper and create new one. (reply to 33952)

Rahul: Hey do you know this... I am trying to transfer Token but they giving me error.. i am using v4r2 wallet and i have created Tokens using this wallet. I am trying to transfer from this v4r2 wallet to v3 wallet. (reply to 33938)

&rey: You need to send transfer request to your jetton wallet, not to jetton master contract. (reply to 33938)

Rahul: Jetton wallet means the wallet which use to create tokens? Or admin?

Rahul: I have 3 address token address, token admin address and wallet address which i used to create token?

&rey: Token address is jetton master?

&rey: You need to call jetton master to get address of jetton wallet corresponding to bank.

Rahul: Oh ok let me check

Rahul: I didn't use jetton master let me use that

Rahul: what is minter address? is that token address?

&rey: Example: Token (master) address: EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv (WTON) Jetton wallet address: EQDHa6jyCSpYx9PiJ1EvM8FID3W6U1bfnrX8Z5R4YzdT-Hn0 Wallet address: EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7 (reply to 33962)

Rahul: i have this

&rey: Token (master) address: EQBAplc...KLP Your wallet address: kQDuAuT... Jetton wallet address: can be found via testnet.tonscan.org, for example. (reply to 33964)

Rahul: so token master address is token address. I need to send jetton wallet address and i can get from using jetton master. with tonweb can i get jetton master? there is two option jetton minter and jetton wallet

Rahul: this is wallet address?

&rey: EQAwj-...w4 is, though it's not for that wallet... (reply to 33967)

Rahul: but i have 1000 tokens they show me 10 tokens only

&rey: Have you sent some jettons to the master contract itself?

Rahul: yes i think 10 token

&rey: Your jetton wallet will be shown when you open kQDuAuT... (reply to 33969)

Rahul: so i have to send this when i transfer right? need to replace this address to JETTON_WALLET_ADDRESS right? await bank.methods.transfer({              secretKey: keyPair.secretKey,              toAddress: JETTON_WALLET_ADDRESS,              amount: TonWeb.utils.toNano('0.05'),              seqno: seqno,              payload: cell,              sendMode: 3,          }).send() (reply to 33972)

Rahul: ok

Rahul: oh you edit this message now i am more confuse 😄 (reply to 33972)

&rey: Open kQDuAuT... in testnet explorer and go to jettons tab. (reply to 33975)

Rahul: ok

Rahul: is it ok when i search my wallet address and address will be different?

Rahul: so this EQDuAuT4Ajjgx5R9mRXwlqfyglc2FG5zpJ7YuhnXJKzQZwQn is my wallet contract address and this kQDuAuT4Ajjgx5R9mRXwlqfyglc2FG5zpJ7YuhnXJKzQZ7-t is my wallet address right that why its diff?

&rey: kQ has testnet tag and EQ hasn't, that's normal. The characters at end are checksum and thus are also different. You can check the middle part of address. (reply to 33979)

&rey: So, your jetton wallet address is EQA5Lf...s4. (reply to 33978)

Rahul: let me try with this now

Rahul: exitcode=33, steps=23, gas_used=0  Now i can relief i think now at least my setup is right 😁

Rahul: there is no 33 code in this page 😳 https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes  LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not acceptedCannot run message on account: inbound external message rejected by transaction EE02E4F80238E0C7947D9915F096A7F2825736146E73A49ED8BA19D724ACD067: exitcode=33, steps=23, gas_used=0

SELECTRAX: Hi i want to work some projects .

SELECTRAX: For free

&rey: You have to look in jetton wallet code. (reply to 33983)

Rahul: const mainWalletAddress = new Address('kQDuAuT4Ajjgx5R9mRXwlqfyglc2FG5zpJ7YuhnXJKzQZ7-t');  const mnemonic = mainWalletAddress mnemonic  const JETTON_WALLET_ADDRESS = 'EQA5LfYBwjM5pJQ8QcOfqYs-MDKgpwZSDlNuV1_EfNNt4Xs4';  const toWallet = new Address('kQBr2FM-Aju7lqOsnrJvTGye7X2uYZoL3Gn-OGgxfClH1Yqp');    const jettonWallet = new JettonWallet(tonweb.provider, {      address: JETTON_WALLET_ADDRESS  });    const keyPair = await tonwebMnemonic.mnemonicToKeyPair(mnemonic.split(" "))  const WalletClass = tonweb.wallet.all['v4R2'];  const bank = new WalletClass(tonweb.provider, {     publicKey: keyPair.publicKey,        wc: 0  });    const seqno = (await bank.methods.seqno().call()) || 0;  const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('gift')]);    const transaction = await bank.methods.transfer({      secretKey: keyPair.secretKey,      toAddress: JETTON_WALLET_ADDRESS,      amount: TonWeb.utils.toNano('0.05'),      seqno: seqno,      payload: await jettonWallet.createTransferBody({          jettonAmount: TonWeb.utils.toNano('10'),          toAddress: toWallet,          forwardAmount: TonWeb.utils.toNano('0.01'),          forwardPayload: comment,          responseAddress: mainWalletAddress      }),      sendMode: 3,  }).send()

Rahul: is this right setup now? (reply to 33989)

&rey: Does bank key pair correspond to kQDuAuT4Ajjgx5R9mRXwlqfyglc2FG5zpJ7YuhnXJKzQZ7-t?

Rahul: Yes

&rey: It seems that amount of TON you send is insufficient. Could you try the same with 0.35 TON?

&rey: Or, since your token has 0 decimals, maybe you need to set jettonAmount: 10n (because toNano multiplies input value by 10^9).

Rahul: Let me try

رهرو...: Are these facilities also available for Iran where Telegram is filtered?

&rey: I haven't heard of problems with using TON in Iran. (reply to 33996)

Rahul: oh god, thank @pcrafter now its working fine 👍 😍

User<6399953433>: good morning

Rahul: can we increase the limit of toncenter.com/api/v2 ?

Rahul: https://tonapi.io/v2 https://toncenter.com/api/v2  both are same or different?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Is there any rate limit available in TON? why the project like this https://github.com/AntonMeep/vaniton is exists Generate millions of addresses just for a specific address?

&rey: Wdym by rate limit? Mnemonic —> address conversion is done on client and does not involve blockchain in any way. (reply to 34002)

&rey: Though, attempt to use millions of addresses (given that user has enough TON to cover fees) won't slow down TON too, as it will be sharded.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I see, thank you

Rahul: @pcrafter ? (reply to 34001)

&rey: Different. (reply to 34001)

&rey: Use Orbs ton-access. (reply to 34000)

Rahul: means? what is Orbs ton-access and how can i access? (reply to 34008)

&rey: https://t.me/tondev_eng/33917 (reply to 34009)

Faker: the get method also cost gas>

&rey: No, it doesn't. It is run offchain, and sometimes even on client side. (reply to 34011)

Uvix🌐: ton-acess to ton-blockchain is what infura is to EVM. its an npm package and a network of nodes giving devs access to the ton blockchain mainnet and testnet using v2 and v4 protocols (reply to 34010)

Uvix🌐: https://www.npmjs.com/package/@orbs-network/ton-access

Uvix🌐: https://t.me/TONAccessSupport

Behrang: Has anyone faced this error?  lite server error, code 651: too big masterchain block seqno

User<6469521367>: Noob here, are there any wallets that generate private keys and show them to the user, instead of just the seed phrase?

&rey: Not sure about that, but you can use TonWeb (JS) or tonsdk (Python). (reply to 34017)

&rey: Also, there are no wallets that accept private keys instead of mnemonic as input.

User<6469521367>: Trust wallet can (reply to 34019)

User<6469521367>: Have you used these before (reply to 34018)

&rey: Both. >>> import tonsdk.crypto >>> tonsdk.crypto.mnemonic_to_wallet_key('a b c'.split()) (b'\xe3\xb4=oP\xb7\xdeF\x80\xe2\x1e^/Cdm<~GL\xd7\x80\xa6\xc74v\x0c\x97\x13\xd3\xec\xf1', b'\x19\xaat\xc3\x88\xb9\xd4\x03\x95\xca\xf8\xfb#i\xc7Q\x96\x98\xfc\xa0&7f\x16v\x95\x83\x06\xad\x13\x0bi\xe3\xb4=oP\xb7\xdeF\x80\xe2\x1e^/Cdm<~GL\xd7\x80\xa6\xc74v\x0c\x97\x13\xd3\xec\xf1') (reply to 34021)

Rahul: hello, How to write 10n dynamicly ?

&rey: Probably new BigInt(amount) (reply to 34023)

User<6469521367>: so its not possible to generate a ton private key without downloading these programs? (reply to 34022)

&rey: It's possible to generate private key (not sure if it needs specific bits cleared, but the following code always worked), though without nacl you will be unable to get the corresponding public key, and without tonsdk it's hard to get the wallet address: >>> import secrets >>> secrets.token_bytes(32) b'\x00N\xe4\xb3\xb2\xabRj\xf7\xa2\xf2St\x95\xcdD\x94\x18\x03S\xf3\x86\xdc\x9a\xf2\xed\xfb\x8d\x08\xcaa(' (reply to 34025)

User<6469521367>: idk what any of that means lol

&rey: Then you probably shouldn't generate private key directly because of security implications. You may also have a look at TonWeb's algorithm for key generation: https://github.com/toncenter/tonweb-mnemonic/tree/master/src/functions (reply to 34027)

Howard: Error: Request failed with status code 500  Does anyone get this as well?

User<6469521367>: so there are no web wallets where i can run the githubs you sent, online? do I have to run it myself? (reply to 34028)

Howard: never mind, I am testing the External Messages and seems this error b/c no balance in my contract (reply to 34029)

&rey: You shouldn't give any remote servers access to your wallet secret key. You can open dev console on https://wallet.ton.org and calculate everything locally in your browser (TonWeb is available in that environment). (reply to 34030)

User<6469521367>: okay thanks

User<6469521367>: so i loaded up a new wallet in wallet.ton.org and opened the console, what would i paste in to get my privkey of the newly generated wallet, and how can i generate dozens quickly? https://i.imgur.com/IfnGMp4.png

&rey: (await TonWeb.mnemonic.mnemonicToKeyPair('your mnemonic words'.split(' '))).secretKey.toString() (reply to 34034)

&rey: And await TonWeb.mnemonic.generateMnemonic() to generate new mnemonics.

User<6469521367>: Having trouble formatting it, if my 24 word phrase is "this is my phrase" would it be:  (await TonWeb.mnemonic.mnemonicToKeyPair('this is my phrase'.split(' '))).secretKey.toString()  or what should it look like

User<6469521367>: Thanks for your patience btw

Rahul: hello @pcrafter , seqnumber getting same during multiple transaction is there any solution for that?

&rey: Old transfers could be in external messages pool and not be processed yet, if I understand your problem correctly. The fix is to wait for the previous transfer to be sent (usually 30 seconds are enough). (reply to 34039)

User<6469521367>: it gives me this result, which doesnt look like a private key, or is it?  '243,37,51,57,90,202,87,116,24,192,24,112,255,170,72,73,191,214,147,32,189,171,195,58,98,87,207,253,49,33,9,60,97,184,128,40,60,41,132,18,96,112,143,63,105,66,41,195,42,33,195,214,55,174,68,43,158,62,110,0,108,135,67,119'  (btw the address is not funded and will not be funded, so its ok if it leaks the key to this chat) (reply to 34037)

&rey: This is private key, where each byte is not encoded as HEX but rather output as number (since I don't remember how to encode it properly). (reply to 34041)

Rahul: i think yes you are right so i can add by 1 right. but another problem is when multiple user requesting same time that time it will be problem

&rey: I've looked it up: TonWeb.utils.bytesToHex((await TonWeb.mnemonic.mnemonicToKeyPair('your mnemonic words'.split(' '))).secretKey) That returns 32 bytes of private key + 32 bytes of public key in HEX format. (reply to 34042)

&rey: You have to do some synchronization. Also you can send up to 4 messages from usual wallet at a time. (reply to 34043)

User<6469521367>: Thanks so much

User<6469521367>: Assuming my device/network is not compromised and never will be, is it safe to generate keys with this method?

&rey: Assuming that browser doesn't send console logs as telemetry, the method is safe. (reply to 34047)

Rahul: let me give you scenario,  suppose 20 user requesting in 5 second. so we have to transfer tokens and nft both so two request call per user. but its backend so per user we can create  synchronization but for multiple users i dont think its possible  so what do you think its still possible?

&rey: 1. you can use highload wallet (higher gas usage though no synchronization required at all) 2. you can put all the requests in one queue. Once there is a request, wait for 2-5 seconds for other possible requests, then form the transaction and send it. (reply to 34049)

User<6469521367>: how do i send an nft that is held by my ton address, through tonweb commands

&rey: ... that's complicated to explain. You can search for examples on Github, and here's the required method: https://github.com/toncenter/tonweb/blob/-/src/contract/token/nft/NftItem.js#L65 (reply to 34051)

User<6469521367>: Oh okay

User<6469521367>: Basically i have ~40 telegram username NFTs and i want to put them in different ton addresses and be able to access them easily, thats why i was asking how to generate private keys and how to send nfts from them. Is what i'm asking too complicated for a beginner and there is no simple way?

&rey: It is a bit hard. (reply to 34054)

Rahul: can i convert current wallet to highload wallet? 😄

Dmitry | backend4you.ton: No. You need to create new wallet (with same mnemonic if you want).

Gardener: Someone tried to convince me that TRON was better than TON. All I needed to do for due diligence was check their telegram dev channel and their dev discord. Roughly one to three messages per day.

Rahul: hey can i use below method to transfer NFT and jetton at time with one seqno? await wallet.methods.transfer([{nftbody},{jettonbBody}]);

Rahul: i think we can not modified the seqno, when i try to add 1 to seqno its giving me error during transaction.

— 2023-09-04 —

User<6469521367>: Is foxtails.io 100% legitimate and trusted?

Official: Okay (reply to 33070)

Official: Can’t find my asset in my wallet account (reply to 27430)

Su: hey Im new to Ton, any hackathon going on for the moment?

Thilak: I require some answers on below, kindly check on it  1. Require tact IDE url link for tact smart contract development

Dmitry | backend4you.ton: https://docs.tact-lang.org/tools/vs (reply to 34067)

Thilak: Thanks

Rahul: How @pcrafter , because seqno in token's body. (reply to 34061)

Rahul: And when I modified seqno by plus 1 then they giving me error.

Official: Yes (reply to 34066)

Su: any links? (reply to 34072)

sikia: Knp gak masuk ya penarikan

Official: Alright (reply to 33070)

HT: this is a fraud... is this not? Is the group valid?

Anthony: fraud

Fazel 🌱SEED: Hey guys i have a question If i want to mint a collection of 1000 using minty ton, how can i set price to all nfts without deploying new sale contract and under the getgems sale contract?

Fazel 🌱SEED: Also is it possible to deploy a collection and have user mint from website to their wallet? I'm working on a mint to build project where users can build their nft and mint it

Kantemir: Hi all! Can anyone tell me where you can find a developer for your crypto project inside telegram?

Rahul: in this method seqno required or optional?  await wallet.methods.transfer

&rey: Actually, I would (and probably will) use Telegram stories for that) Just make sure to describe your project. (reply to 34080)

MR Bum: I hope you are well Are you investor in Forex if any person want earn good profits Daily and if your account is running loss you don't take tension we recover account investor password is available

John: You can use tonbyte.github.io/ton-nft-mass-sale But read about limitations (reply to 34078)

Step: seqno is must in all standard wallets. (reply to 34081)

Rahul: Then how to send multiple transactions. Need to send NFT and JETTON at a time. (reply to 34086)

Svαtoωλ‎: seqno = get_stack(wallet_address, "seqno", toncenter_key)[0]  why it is not working? exitcode -13, and whenever 0  code of get_stack -> https://pastebin.com/cXmiSUAh

Kramer Nomissian: Anyone verify this bot is safe to connect with @tonlombard_bot

Step: You can send 4 messages? (reply to 34087)

Rahul: No because seqno issue. Seqno change reflect after 10-15 second and we need to pass with every transaction body... so i have 2 transactions body in one transfer then it will be a problem with seqno. (reply to 34090)

Rahul: Any idea how to do this

Rahul: Have you any example of multiple transactions with tonweb?

Rahul: Hey, i have to send back nft to user and reward also as token.... can i do this automatically without mnemonic because it's confidential and of course client dont like this process. 😅

Kramer Nomissian: @tonlombard_bot be careful about this bot. It’s a wallet drainer that drains all your asset when you connect. The owner is walking around offering to rent your username but you’ll have to connect to the bot for payment

saul: Is there a way to check the TXID of the transaction that occurred using mytonctrl?

saul: Is there any way to import the addresses generated by mytonctrl into a wallet like tonkeeper or tonhub?

— 2023-09-05 —

&rey: Check the address on some explorer. (reply to 34098)

saul: thank you!  Is this not possible with mytonctrl? (reply to 34100)

&rey: If mytonctrl supplies a mnemonic, then it should be possible. (reply to 34099)

Mark: how to use ton to buy telegram premium using nodejs?

Rahul: Hey guys is there any way to control wallet without mnemonics?

Rahul: Actually client does not want to give me 24 words and they want automatic transfer... is there any way to do this?

Andrew: U can use deep link for tonkeeper (reply to 34106)

Rahul: How i can get that and can i use that in ton web

Rahul: What is deeplink and how can i get that any tutorial? And how can i use that with tonweb sdk

&rey: No automated way I guess, unless Fragment creates API for that. (reply to 34103)

&rey: Plugins, but they are not much different. (reply to 34104)

Rahul: I have check that it really work? Cause there is simple url and pass param and our address and transactions happen as per docs (reply to 34111)

Rahul: anyone help me please, how can i get this base64 ?  const seed = TonWeb.utils.base64ToBytes('vt58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY=');

Rahul: @pcrafter

User<6310880065>: Hi, I am a highly accomplished Full Stack Web and Blockchain Engineer with a diverse skill set and extensive experience in the industry. My expertise spans both front-end and back-end, smart contract development. Please let me know if you are seeking a skilled and experienced Full Stack Web and Blockchain Developer.

&rey: Convert existing seed to base64) (reply to 34113)

Rahul: How can i get seeds? 😅 i am thinking to get seeds from base64 😅 (reply to 34117)

Rahul: Is there any way to get base64 from connected wallet?

Bean: Hey guys, do you know this error when using https://github.com/ton-blockchain/tonlib-go  # github.com/mercuryoio/tonlib-go vendor/github.com/mercuryoio/tonlib-go/client.go:8:10: fatal error: './lib/tonlib_client_json.h' file not found #include <./lib/tonlib_client_json.h>          ^~~~~~~~~~~~~~~~~~~~~~~~~~~~ 1 error generated.

&rey: No, connection does not share private key. (Except fake airdrops with fake connection methods.) (reply to 34120)

&rey: And yes, the seed = private key.

Makan: Hello I wanted to know how to get a transaction into the network earlier, I have a problem when I send a money transfer request in the network, it is registered in the network after 7 seconds, but I want this time to be less than one second.

&rey: The blocks are generated each 5-7 seconds, and it's not technically possible to record the transaction faster than that. Faster block generation is also impossible because validators are distributed all over the Earth, and the speed of light comes into play since they need to build consensus. (reply to 34128)

Makan: I can't make this process faster for myself by setting up a node? (reply to 34131)

Pedram: #question I want to sell the products in my website with Ton, Tether and TRX.  Is it possible to use Ton wallet APIs for all three currencies?

&rey: No. 1. There are no "TON wallet APIs". 2. TON and TRON are different blockchains and have no shared tools. (reply to 34133)

Pedram: I wanna withdrawal my Tons in tonkeeper. Why i get error?

zz: hello, how can i fix this

zz: [ 2][t 9][2023-09-05 13:22:07.684667801][manager-init.cpp:86][!downloadproofreq] failed to download proof link: [Error : 651 : no nodes]  [ 0][t15][2023-09-05 13:22:08.631018469][dht.cpp:545][!localid] Check node.addr_list().size() > 0 failed

&rey: Your full node failed to connect to others. Check that appropriate ports are open. (reply to 34137)

Rahul: how to parse the response boc? is that posible with @tonconnect/ui-react, ton, or tonweb ?

Rahul: or can i get hash from response boc?

Rahul: when i send toNano('0.06'), request show me send 0.003 ton in wallet... why?

Rahul: When i send toNano(0.06)  Anyone know how we can calculate and send exactly 0.06 ton ?

nonam3e: you should send it with sendMode = 1 (reply to 34143)

User<6399953433>: hy

Павел: What is the safe method of storing mnemonic phrase to deploy contract?

Rahul: What is send mode 1 ? (reply to 34144)

nonam3e: https://docs.ton.org/develop/smart-contracts/messages#message-modes (reply to 34147)

User<6269988295>: who need some Ton test can join @Tongenetic and paste address

Rahul: can we add mode in @tonconnect/ui-react ?

Rahul: @nonam3e

Rahul: i just check docs there was not mentioned mode

Rahul: I just want to send ton with react ui sdk... anyone help me please?

User<6257179834>: Okay (reply to 34149)

F: the second error is related to a corrupted node config, most likely due to some installation error (reply to 34137)

Rahul: https://testnet.toncenter.com/api/index/getTransactionByInMessageHash  this api not available in v2 and in this there us rate limit. i have multiple user and i am using react js ui for ton. any suggessions ?

&rey: https://testnet.dton.io/graphql (reply to 34161)

Alexander: Hi guys, Are there any python libs that create contract wrappers like Blueprint does for TS?

Andrey: We've shutdown testnet for a while 🥲 (reply to 34162)

Michele: how long?

Makan: Hi guys  how can i decode this part of transaction with python  value:(raw@Any        x{026094F8DA81903A79901159FA5480BE9BCCDEE0914D7F2A6DCE176E2D3B1B0FCEE8056C17F8FB0CD1D180AF0EF772F5B2075B9A73AE7A94FFB654D149E1280029A9A31764F76968000000DB0003}        x{62001E9D111F32AC499246DBC2867052CDBC9D826078219896C999C2AAA3377F4C8DA20C85580000000000000000000000000001}         x{5FCC3D140000000000000000800102DD3805A221CF21EFB664636775625999F8AD6A8D8787CA60D096952AF148700211120827151197B39A98B34E45BC161390559862828CA74CFC0221F6EB51B9BC87735940001FC1DBD_}          x{34_}           x{FF00F4A413F4BCF2C80B}            x{2_}             x{4}              x{CD}               x{D00E8698180B8D8492F82707D201876A2686980698FFD207D207D207D006A69801818382984E38060004A9884E98F856F10E1804A1804E99FC708C5B31B0B731B2B6415E382C939996F280571156000C92F86F0126BA4E10115C08115DD1560009159D8D829DC6382D84E8EAF86EA18686983EA1800FD807014E000C_}                x{F2D194B38E42313339395352C705925F09E05151C705F2E1F4821005138D9116BAF2E1F503FA403046501034597007C8CB0016CB1F5004CF1658CF1601CF1601FA02CCCB00C9ED54E0303728C003E30228C0009C36371038476514433070F005E008C00298554410241023F005E05F0A840FF2F0}                 x{383982103B9ACA0018BEF2E1C95346C7055152C70515B1F2E1CA702082105FCC3D14218010C8CB0528CF1621FA02CB6ACB1F15CB3F27CF1627CF1614CA0023FA0213CA00C98306FB007150664515047007C8CB0016CB1F5004CF1658CF1601CF1601FA02CCCB00C9ED54}               x{660840EE6B280149828148C2FBCB87089343E903E803E903E800C14E4A848685421E845A814A41C20043232C15400F3C5807E80B2DAB25C7EC00970800975D27080AC2385D4115C20043232C15400F3C5807E80B2DAB25C7EC00408E48D0D38969C20043232C15400F3C5807E80B2DAB25C7EC01C08208417F30F452_}                x{C8CB1F13CB3F23CF165003CF16CA008209C9C380FA02CA00C9718018C8CB0526CF1670FA02CB6ACCC98306FB007155507007C8CB0016CB1F5004CF1658CF1601CF1601FA02CCCB00C9ED54}              x{A03859DA89A1A601A63FF481F481F481F401A9A6006061A1F481F401F481F4006104208C92B0A0158002AB01_}             x{F230ED44D0D300D31FFA40FA40FA40FA00D4D30030C0018E1DF8007007C8CB0016CB1F5004CF1658CF1601CF1601FA02CCCB00C9ED54E05F078200FFFEF2F0}           x{327BB48AC009A9CB80ADFBD1662F5108766D73355AC2C03304FDA1D25A479670E34EFCD72B38007A74447CCAB126491B6F0A19C14B36F2760981E086625B26670AAA8CDDFD323700211120827151197B39A98B34E45BC161390559862828CA74CFC0221F6EB51B9BD422757CC801_}            x{80135397015BF7A2CC5EA210ECDAE66AB585806609FB43A4B48F2CE1C69DF9AE56680BEBC2010026A72E02B7EF4598BD4421D9B5CCD56B0B00CC13F68749691E59C38D3BF35CACC2_}          x{000000010000000000000000}       )))

Yan: 🏦 A Bank of Opportunities  As we mentioned in the post above, Telegram is to focus on the growth of tApps ✈️ – the native web app platform that lets you run simple interactive experiences straight in the messenger.  It didn't take long for TON 💎 to follow up on the trend – the Foundation just announced a new grant program titled 'Telegram Web3 Grants', clearly indicating the interest in TON's solid integration into the app.  The grant guidelines do not strictly encourage the usage of tApps, however the narrative for bringing TON-based experiences or the ones utilizing toncoin is visibly preferred 👀  The grantmakers are ready to distribute up to 💵 $10,000 in toncoin, depending on the scale and complexity of development milestones. Not less interestingly, there's a potential allocation of between 20,000 and 50,000 $TON per project who features an established product with a community 🫂, that hasn't been to TON yet.  The last option is an even braver shot 🔫 at bringing the web3 communities over to The Open Network. Since the vast amount of people in crypto have found their ecosystem of choice by now, they're not as active at exploring alternative playgrounds 🗺  Still, the inhabitants of places like Solana are frequently unsatisfied with a range of things. So perhaps such a move at encouraging teams to switch to multichain (or even all-in on TON) could boost the network's popularity in the western regions 🇺🇸  Last fact not to miss, we've finally been shared 👁 some numbers about the TON grants – about $1.2M has been distributed to assist the devs in 2022. With about 400 grant submissions, over 100 have been satisfied (25%), making your chances to catch extra funding not as low as they are on other chains 💡  @tonsider (forwarded from Tonsider 💎)

Yan: useful stuff for anyone developing on tg rn, don't ignore grants

Andrey: Can we make .ton websites to open in Telegram from the search? So website would act like TWA (web app) and if Telegram proxy changes must be done to open it, such changes could be done on opening or within using TWA.

— 2023-09-06 —

zz: Do I need to open ports 30001-30006, or other ports? (reply to 34138)

zz: The node built a long time ago is not open and can be synchronized normally. Has this been changed recently?

TON Answers Bot (not AI): How we generate a Transaction Hash in the TON Blockchain? from Howard   As mentioned in this question: "3) Poll for the latest transactions from the Blockchain using your wallet account ID and match the transaction using the pre-generated hash" (source).  My question is, how is the transaction hash generated or calculated in general? I understand that we have a public key for signing.    🔗 Answer on TON Overflow

Mark: how to get tx hash?

Mark: how to get tx hash?  Why can’t I even get the hash of the transaction in the sample code? I’ve tried many methods but can’t get it correctly.  If I finish sending the transaction and call tonweb.getTransactions, the latest transaction obtained is not the transaction I just sent, and there is a delay here. And what I return after sending the transaction is not the meaning of the api design of the transaction hash. (reply to 34173)

Cooop: Hi guys! We are having issues with our TonCenter, anyone here who could comment - Leads paid in TON ;)

Anthony: What kind of issues do you have? (reply to 34179)

Rahul: Mainnet? (reply to 34164)

Andrey: Mainnet: dton.io works (reply to 34181)

Rahul: your question answered (reply to 34178)

Rahul: what is the issue? (reply to 34179)

User<857683111>: Tonweb how to get keypair from mnemonic ?

User<857683111>: why the transfer show is digest ?

User<857683111>: but I  generator it

&rey: You are running script in insecure context (no HTTPS and no localhost) so browser does not provide crypto functions. (reply to 34187)

User<857683111>: yes  ，now  is localhost (reply to 34192)

&rey: By the way, cell serialization seems to use crypto functions (namely, hashing) as well.

User<857683111>: good deal (reply to 34192)

User<857683111>: Tonweb how to get keypair from mnemonic ? (reply to 34194)

User<857683111>: bcz I only found it

&rey: TonWeb.mnemonic.mnemonicToKeyPair from module tonweb-mnemonic (reply to 34196)

Rahul: const tonwebMnemonic = require('tonweb-mnemonic'); const keyPair = await tonwebMnemonic.mnemonicToKeyPair(mnemonic.split(" "))

Rahul: i think you can't send direct "Hello" string to payload 🤔 (reply to 34186)

User<857683111>: maybe  I will tried later (reply to 34200)

User<857683111>: sorry I dont fount the  require('tonweb-mnemonic'); (reply to 34199)

Rahul: you have to install package  tonweb-mnemonic

User<857683111>: but I use the web  tonweb

Rahul: its a different package you have to install it first

Rahul: this package working with client and server both

User<857683111>: I need to try first

User<857683111>: thks

User<857683111>: I use the html ,just     require the tonweb-mnemonic ?

User<857683111>: now is  inactive

User<857683111>: soloved (reply to 34209)

User<857683111>: how to change to active ? (reply to 34210)

User<857683111>: deploy but have one  error ERR_UNHANDLED_REJECTION

&rey: Do you need that? Wallet is auto-deployed by TonWeb at first (UPD: outgoing) transaction. (reply to 34212)

User<857683111>: I already transfered  in one (reply to 34210)

&rey: In this case, insufficient TON. 0.009 TON is a bit little. (reply to 34213)

&rey: *at first outgoing transaction. (reply to 34215)

User<857683111>: get it (reply to 34218)

User<857683111>: so  now  I need transfer myself ? (reply to 34218)

User<857683111>: transfer is show seqno need >=0.

User<857683111>: now transfe with 0.1 ton  but is error for ERR_UNHANDLED_REJECTION

User<857683111>: tried  is it (reply to 34224)

User<857683111>: next problem  the blockchain is not success

&rey: Do you have sufficient TON to send?

User<857683111>: yes

User<857683111>: just sent 0.01

User<857683111>: but the hash is from to destination same address

&rey: Explorer shows incoming external message (empty)—>(your wallet). (reply to 34232)

User<857683111>: yes  ，but the balance is decre (reply to 34233)

User<857683111>: just use it (reply to 34231)

&rey: There are small gas fees. (reply to 34234)

User<857683111>: I know gas (reply to 34236)

&rey: Also, correct sendMode is not "3" but rather 3.

User<857683111>: 3 is error (reply to 34238)

User<857683111>: use the await the 3 is correct  but is same (reply to 34238)

&rey: What is the problem at the moment? I understand that the message is not being sent to destination wallet though I could have missed something.

User<857683111>: FROM https://tonscan.org/address/EQDvVzROo3HGv5BWWab9ICMb40ICx5hBUDlrCc7ni4fAHlO6  TO https://tonscan.org/address/EQAXSCOCPPNeJlj9bkcooZXJ9J8E98ACv_p_9xissvkL3myk  BUT THE reciver is not get the blance

&rey: Please check     toAddress: new Address(to_address),

&rey: let wallet = new tonweb.Wallets.all['v4R2']({address: from_address});

&rey: Also, please consider switching the mnemonic since you showed this one publicly (blurring also reveals mnemonic, it would be better to draw white rectangle on top of it).

User<857683111>: thks  just test it (reply to 34249)

&rey: let wallet = new TonWeb.Wallets.all['v4R2'](tonweb, {address: from_address}); (reply to 34247)

&rey: In transfer,     seqno: seqno ?? 0, though that shouldn't be the case.

User<857683111>: address ir coreect

User<857683111>: the seqno already to 6 (reply to 34254)

&rey: This seems like TonWeb issue.

User<857683111>: const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: 'f89cd17ffe8a592dfd1e2da770523616d3f4a5436be33c89b1f570337656ecca'}));

User<857683111>: I use this jsonRPC

&rey: let wallet = new TonWeb.Wallets.all['v4R2'](tonweb.provider, {address: from_address}); (reply to 34251)

User<857683111>: let wallet = tonweb.wallet.create({address: from_address}); // if your know only address at this moment    Tthis is right ?

User<857683111>: I see this is publickey

&rey: No, it attempts to handle your wallet as v3r2 one. (reply to 34265)

User<857683111>: good deal (reply to 34264)

User<857683111>: thks lots (reply to 34267)

Bean: Hi guys, I want to set admin wallet for Ton contract (similar to ownership in solidity), how can I implement it? I guess I must store owner address in the contract and it only be updated by message come from exact itself to transfer owner, right?

&rey: > I must store owner address in the contract: right > and it only be updated by message come from exact itself to transfer owner: by message from current owner is right; not by message from the contract itself. (reply to 34271)

Bean: thank you

Bean: why do we need to ignore all bounced messages in the custom contract ?

&rey: Usually there's not much to do if you receive bounced message, since it originally came from the contract itself. (reply to 34274)

Bean: Ah I got it

&rey: Jetton wallets handle such messages, though, to ensure that jettons are not lost when transfer fails.

Rahul: Open transaction modal failed  guys you are facing this issue right now when request to wallet? its just working fine 10 min ago, now when they send popup app will be blank and reject the transaction

Rahul: code: 0  message: "Open transaction modal failed  Bridge error {"isTrusted":true}

Rahul: [Violation] Forced reflow while executing JavaScript took 82ms

Rahul: is anyone facing the issue right now

Rahul: ?

Abduvaliyev Muhammad Amin 🇵🇸: Hello 👋   Bro, are you making a web app or mobile using js (reply to 34279)

Rahul: i have web app and i am connecting my mobile wallet  using qrcode

Abduvaliyev Muhammad Amin 🇵🇸: That is good 👍   If you are alone we can bee team together! (reply to 34284)

Abduvaliyev Muhammad Amin 🇵🇸: I just wan to help and improve my skills if let me to be a team with you? (reply to 34284)

Rahul: const transaction = {              validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec              network: "-239",              messages: [                  {                      address: process.env.REACT_APP_WALLET,                      amount: TonWeb.utils.toNano("0.00001")                  },              ],          }

Rahul: Literally its wallet issue

Rahul: Sometime its work sometime its not

Rahul: With the same request

Maxey: How to calculate the amount of Gas currently spent on a specific line of code in ton smart contract?

TON Answers Bot (not AI): How can I get the current gas used as a variable for some operations in FunC ? from Yu Lun Hsu    🔗 Answer on TON Overflow

User<6492108171>: How to convert Mnemonic phrase to wallet addresses instantly with tonweb?

User<6492108171>: Without the address being deployed

Tumin: https://docs.ton.org/develop/smart-contracts/fees#how-to-calculate-fees (reply to 34291)

— 2023-09-07 —

D.Hiroki: Is there a website where I can check the country dispersion of TON validators?

&rey: https://status.toncenter.com/d/SxowRJ14k/validators-map?orgId=1&refresh=10s (reply to 34298)

Yang: Cool (reply to 34301)

Andrew: Introducing TonSdk.Connect for .NET & TonConnect 2.0 SDK for Unity: Unlock the Gaming Potential on TON Blockchain  🚀🎮 We are beyond excited to announce the launch of two groundbreaking tools: TonSdk.Connect for .NET and TonConnect 2.0 SDK for Unity. These innovations open up a plethora of opportunities, especially for game developers!  🔗🛠 TonSdk.Connect for .NET is your go-to toolkit for working with the TonConnect 2.0 protocol on .NET platforms. It enables seamless wallet connectivity and interactions with TON Blockchain in your applications and backend solutions.  🕹🌐 And here comes the really exciting part: TonConnect 2.0 SDK for Unity. Imagine a gaming experience enriched by blockchain technology: from sign in via your TON wallet to trading NFTs, earning decentralized rewards, and even participating in blockchain-based multiplayer competitions. The TonConnect 2.0 SDK for Unity makes all this not just possible but also incredibly convenient.  🌍🔌 With the TonConnect 2.0 protocol, your Unity game can interact effortlessly with TON wallets, letting players manage their assets securely without leaving the gaming environment. The SDK not only enhances the gaming experience but also builds a bridge between traditional gaming and blockchain communities.  📚🔍 For further details, have a look at resources:  TonSdk.Connect: [github] [nuget] Unity Asset: [github] Video Tutorial [RU]: [youtube]  🏗🌟Your involvement and enthusiasm are essential for taking these technologies to the next level. We can't wait to see what you'll create! (forwarded from Continuation Team)

Pixel ^_^: Hello guys,  Good day!

Pixel ^_^: We're currently in the process of developing a crypto casino featuring a variety of exciting gambling games. Our launch date is approaching rapidly, and we're eager to explore the potential benefits of the TON ecosystem in helping us gain traction for our project.

Bean: Hello guys, I can't see decoded value here

Bean: how can I make it show like this

Tim: You need to verify contract

Bean: How can I verify it @TrueCarry

Tim: Verifier.ton.org

Cocomastoras: Google App Engine Standard Environment Python 3 New 11:47 When we try to initialise the client, we get the following error:      await client.init()   File "/layers/google.python.pip/pip/lib/python3.11/site-packages/pytonlib/client.py", line 68, in init     wrapper = TonLib(event_loop, self.ls_index, self.cdll_path, self.verbosity_level)               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "/layers/google.python.pip/pip/lib/python3.11/site-packages/pytonlib/tonlibjson.py", line 81, in init     tonlib = CDLL(cdll_path)              ^^^^^^^^^^^^^^^   File "/layers/google.python.runtime/python/lib/python3.11/ctypes/__init__.py", line 376, in init     self._handle = _dlopen(self._name, mode)                    ^^^^^^^^^^^^^^^^^^^^^^^^^ OSError: libcrypto.so.1.1: cannot open shared object file: No such file or directory

Marius: Is there a reason why the "participant_list_extended" method of the elector contract returns duplicates that share the same address and stake ?

Marius: Is there something like double nominator staking? I've done some research on this but I couldn't find anything.

Behrang: Hi,  When I try to call get methods using lite-client, if they use network configs, I'll get an error, because these configs are not available in get method execution using lite-client.   However, if I run the same method using tonlib-cli, it works.  On server environments, I can fallback to tonlib-cli to pass this limitation. But in client apps, when using ton-access, it looks like that servers are lite-client instances and they have the same problem.  1- Is there any plan to fix this in lite-client?  2- Is there any workaround for now for calling get methods in client web apps using ton-access?

TECHN0x_6900: gm

TECHN0x_6900: we have built a TG bot for farming airdrops

TECHN0x_6900: https://t.me/ZKitty_DAO_Bot

TECHN0x_6900: we're looking to expand our team

TECHN0x_6900: Role:  Integrating interactions with Solidity smart contracts into Telegram bots using Ether.js.  Requirements:  Well-rounded knowledge and experience in JavaScript development & hands-on experience with ethersJS. Demonstrable experience with blockchain development, specifically in interacting with smart contracts using ethers.js library. Must know and understand how well known protocols work. (Must know or be able to independently find what function to use for swapping assets on Curve or Uniswap and other known crypto protocols) Knowledge in developing Telegram bots is highly recommended. Basic experience is required!

TECHN0x_6900: if anyone is interested plz tap 👍 emoji and i will dm you

Bean: Hi guys! When developing a contract 1. How can I get balance of ton of current contract? 2. How can I get balance of a jetton token of current contract by jetton minter address?

I V: hi! has anyone tried to send ton to a wallet created via “Wallet” in telegram? my transaction is executed but the money hasn’t appeared in the wallet

Dmitry | backend4you.ton: 1: get_balance() https://docs.ton.org/develop/func/stdlib#get_balance  2. you can't. jettons are stored on separate contract for each user, and one contracts can't read info of other contracts. you can send msg, but response (if any) you'll process much later (reply to 34323)

Dmitry | backend4you.ton: 2* The only place where you can get balance of some jetton of some user is inside of contract for that jetton for that user. It's in get_data(), check jetton source code for more details.

Bean: asume that I write a contract and deploy it to the TON network, I use my account to send a Jetton to this contract -> Q1: Is it work?  If aswer of Q1 is "work", Q2: do we have any way for me to develop the contract to give it ability to transfer Jetton of this contract to another wallet?   Cmiiw

Cocomastoras: https://github.com/tonfactory/tonsdk  Anyone managed to get the client running with base url and api key?

Dmitry | backend4you.ton: It seems you have some gaps in jetton knowledge... imagine this contracts: JM - Jetton Master (Minter) - special contract JA - Jetton Admin (who deployed JM) - regular wallet contract JU - Jetton User (person who have some jettons) - regular wallet contract JUW - Jetton (User) Wallet - special contract that "holds" jetton owned by some user. This contract is "tied" to JU. Every JU have his own JUW.  Initially JA deploys JM. There are no jettons in circulation (yet).  Then JA "mints" some jettons to some JU (including himself), sending special msg to JM. JM "creates" specified number of jettons, creates JUW (linked to JU) and transfers jettons to this JUW.  JUW "known" who is his JU and how many jettons he has. Only JUW have "true knowledge" about amount of jettons that JU has.  When JU wants to give some of his jettons to other user (JU2) - he sends from his JU message to his JUW with instruction to transfer some jettons to JU2. JUW(1) deploys JUW2 and transfers jettons.  Now JUW1 knows JU1 and amount of his jettons, and JUW2 known JU2 and his amount of jettons.  JM knowns only total amount of jettons it minted, but doesn't know what JUWs are holding them. (reply to 34327)

Dmitry | backend4you.ton: If above does not answer your question - please re-ask them :)

Bean: thank you so much, very transparent, I got the answer for my question

Rahul: Hey i am waiting 20 seconds after each transaction to get right seqno but sometime its failed. Any idea?

Rahul: @pcrafter (reply to 34332)

nonam3e: api sometimes crashes (reply to 34332)

Ceren: Hello, May I ask if the Open Network is compatible with any ZkEVM chain? Can TON support crosschain operability, or collab with any EVM-compatible zkevm blockchains?

nonam3e: No, it isn't compatible with zkevm and evm. Mainnet update that implements operations for zk is planned (reply to 34338)

nonam3e: zkTVM 😁

Roman: Hey Devs! 👋  We've recently made significant updates to the TON Connect documentation.  If you've been working on integrating TON Connect in the last 3 weeks, chances are you've been using the new version of the documentation.  We want to gather feedback and improve areas where there may be flaws or inaccuracies.  ⭐️ If you've faced any challenges during TON Connect integration, please DM.   Your experience will be invaluable in improving the documentation! 💎  Thank you!

Gunnar: is anyone aware of an example of an NTF collection (or a collection-free item) with onchain data?

Cocomastoras: '@extra': '1694093523.241291:0:0.22208907221629115'  Can someone explain to me what the @extra is in the response of send_raw_message ?

&rey: It looks like UNIX timestamp and lt, though there is something else. (reply to 34343)

Cocomastoras: Any idea how to Get the block num where the txn minted using pythonsdk?

Tim: You can try searching Masterchain blocks by utime and then check if your tx present in children of that block

Alex: 🎉Big Announcment🎊  TON has been placed on top of the best currencies With its 11.27% growth.📈  These days we hear lots of hit and hot news about TON Network;   An Important news regarding the remarkable growth of the Ton currency is, ُAccording to the statistics published by CMC, the Ton currency has shone brightly compared to its competitors with its significant rise.  TON Coin, the native currency of Telegram's open network, has performed very well in the last few days.  The upward growth, has made it the 23rd most powerful currency in the world and is known as one of the most influential currencies.  The increasing development of TON is one of the things that has excited the blockchain community.  Stay with us for more news!   Website | Blog  | Twitter (forwarded from TonRadar)

botmother: anyone know how i can get jetton balance in my wallet with tonweb? I'm using tonweb to get balance of TON like this  await tonWeb.getBalance(new TonWeb.utils.Address(owner));

TECHN0x_6900: Hi Roman, was wondering if you have a job board? we're looking for a new developer to join our team:) (reply to 34341)

Eugene: http://jobs.ton.org/ (reply to 34349)

Gardener: Oooh I like the new group logo! It's cool. Thanks to the artist! 😊

TECHN0x_6900: ty (reply to 34350)

Rahul: can we create transaction with $ instead of TON?

Rahul: @pcrafter

&rey: No, TON is the native blockchain token and is needed for gas fees. Though, it's possible to create a service that could provide TON for gas in exchange for a small fee in other jettons. (reply to 34353)

&rey: Please don't ping members of this chat unless you need an urgent response or want someone to elaborate on some topic. (reply to 34354)

Rahul: ok and yes its urgent thats why, i have left some hours in launching thats why. sorry for that.

&rey: Well, good luck with that! Any chance that you can describe idea of your project in one sentence? (reply to 34357)

Rahul: presale of token

— 2023-09-08 —

Yan: 🎮 Just Playing With TON  Gaming is the key factor in the mass adoption of blockchain platforms. The amount of money going through the microtransactions 🛒 alone – inside of an average mobile game – is beyond what some decentralized exchanges can reproduce in trading volume.  Chains clash for every game developer there is ⚔️, frequently focusing on the game industry exclusively. Imagine the amount of transactions CS:GO 🔫 could generate if its item marketplace ran on The Open Network, and the items would have a price tag in toncoin or a TON-based stablecoin.  Some dream about it 🦄, and some make it possible. The team of Continuation has released the 1.0 version of TonConnect SDK for developers on C# and Unity. A developer toolkit to let game builders integrate with TON wallets 👝, right inside of the game application.  As someone building a game, devs no longer need to worry about the credit cards 💳 hassle or game store fees – basing the entire in-game economy on TON sets you free from the countless financial roadblocks, and grants access to the global community of 💎 toncoin fans eager to beat the sh*t out of some zombies (or whatever the gameplay is about).  > GitHub repository; > YouTube demo & tutorial (RU).  @tonsider (forwarded from Tonsider 💎)

Bean: Hello guys, I have an issue with jetton When I try transfering using Tonkepeer, I got message Send Token

Bean: But when I using JS to send transfer, it is mark as Call contract instead of Send Token

Bean: But the token is actually transferred under the hood

Bean: One more question, how can I get list all jetton wallet of an address without call to each jetton master?

Maxey: Has anyone tried receiving external messages in Tact and successfully written tests for it?

Kate: 📢TON breakfast in Milan!🇮🇹  Be ready to learn more about TON Blockchain, designed by Telegram Messenger to onboard billions of users💎  Let’s start this Italian weekend with networking, discussing the latest trends, sharing insights, and brainstorming on potential collaborations!   🗓️9 September 🕐12.00 (GMT+2) 📍The Dome Rooftop  DETAILS AND REGISTRATION – HERE🔗

Kate: Hi all! Would be so nice to gather in Milan. Looking forward to seeing you there🔗  TON Society Europe team🙌

Roman: also we have https://t.me/tonhunt to share your vacancy across 20k+ subs (reply to 34352)

Dmitry | backend4you.ton: 1) call some service (tonapi, tonconsole, ...) which has already made this calls 2) scan acc tx history for incoming transfer_notification#7362d09c (but some transfers may exclude such notifications, putting forward_amount=0 into original msg (reply to 34370)

Puria: Hi all, I'm Puria, a software engineer with a decade in the field and recent expertise in TON blockchain and TACT. I'm eager to collaborate on TON-related projects. If you know of opportunities or teams needing TACT expertise, I'd appreciate it if you could direct me. Excited to be part of this community and contribute! Cheers!

&rey: Hi! Please have a look at channel mentioned two messages above, in particular https://t.me/tonhunt/26. (reply to 34376)

Cocomastoras: Is there a way to get the txn hash using the provider = ToncenterClient(base_url=TONCENTER_BASE_URL, api_key=TONCENTER_API_KEY) of tonsdk in Python

&rey: Maybe this message should be pinned? (reply to 34374)

TON technical overview: Integration of Blueprint and IntelliJ IDEA  Blueprint and TON plugin for IntelliJ IDEA, two great tools for developing TON smart contracts are now integrated into each other.  Create a new TON project in one click, use the code editor with everything you need, run tests and compile the contract with a hotkey or with a click on the toolbar, deploy the contract just by scanning the QR code.  Try it now »  Thanks to Andrey Pfau for this brilliant release! (forwarded from TonTech)

Erik🆓: Does anyone understand what tonscan shows about transactions, particularly fees?

— 2023-09-09 —

Creature: Hello.

Creature: I want to send ton to users using @wallet

Creature: How can I send programically?

Creature: Using telethon library or some other library else.

Anthony: Can you explain your case? (reply to 34390)

Creature: Telegram wallet.

Creature: @wallet.

Creature: I want to use this wallet to send ton.

Creature: But I want to do it programmically.

Creature: I tried to use telethon library..but I couldn't.

Ares: why tho (reply to 34397)

Creature: I want to send to winners.

Anthony: Do you want to send TON using TG usernames or wallet addresses?

Creature: TG users.

Creature: I hope I can see the @wallet source code so that I can make a proper request.

Anthony: This API will be available in the future. At this moment, we have a beta version of self-custodial wallet (TON Space) where you can authorize users @wallet with TON Connect and collect addresses. (reply to 34402)

Maksim: telethon is a library to emulate user in telegram. so i guess he wants to use @wallet custodial wallet programmically.   The @wallet doesn’t support it and as i know emulating is forbidden by telegram rules.  So i recommend to use non-custodial wallet to send ton (reply to 34401)

Anthony: got it, thx (reply to 34405)

Creature: Thanks everyone.

GD@0606: hello, help me out  i need to send (ton) to another account for testnet network  provide any Javascript library as a reference

糍粑: 怎么把这个ID换成这种 (forwarded from 糍粑)

糍粑: 有没有人知道

&rey: Please ask Telegram support. 请询问 Telegram 支持 (reply to 34414)

糍粑: 谁 (reply to 34415)

糍粑: 我不知道

&rey: Also, this is English chat. There is Chinese chat at @toncoin_cn_chat.

gabrielll: I want to switch to testnet in Tonkeper and it shows this? any bugs?

&rey: In my experience, Tonkeeper did label networks "mainnet" and "testnet". You may need a newer or, maybe, older version of Tonkeeper. (reply to 34419)

nonam3e: web version shows it (reply to 34420)

Ceren: Please select -3 (reply to 34419)

gabrielll: thanks 😂 (reply to 34422)

Martin: I changed router contract address to "EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt". and implement provide liquidity in ston-fi docs to add liquidity pool. finally I implement Swapp in ston-fi docs to swap my tokens.  is there anything wrong? (forwarded from Deleted Account)

— 2023-09-10 —

Dan: Hi! Do you have some API for swapping TON - USDT ? Like in @Wallet ? (reply to 34406)

Anthony: Like this? https://docs.ston.fi/docs/developer-section/dev-guide/swap (reply to 34427)

Dan: Nope. TONcoin to USDT trc20 like in @wallet (reply to 34428)

Андрей: https://help.crypt.bot/crypto-pay-api (reply to 34429)

Anthony: Understood. You can use jUSDT, a bridged token (bridge.ton.org) of USDT from the Eth network. However, we are working to simplify processes and support the Tron network. (reply to 34429)

Dan: Yeap. It will be very helpful if you give us an API to swap ton to usdt and reverse. For example for games. (reply to 34431)

Anton: TSC4 rewards were distributed 🎉

Dmitry | backend4you.ton: Hmm no. Is it still in process? Can you give source wallet address please? (reply to 34433)

Anton: https://tonscan.org/address/EQAiJx-OHkAlAMphNAPE4UDzs_riYSpl5nEMHYcyRmZdA6Zs  Looks like 3rd pool is still in progress (reply to 34434)

Cypto: Telegram Desktop Open side menu; Expand the menu item, where current username is specified; Hold Shift + Alt and press right mouse button on Add Account button; Select Test Server; Link the account created in the test environment. How to go test environment if it says error? 🖕

Mahdi: Hello friends We (@Challenquiz team) have recently get listed among TWA contest top ten and won a prize. we need a tech advisor to help us to improve the design of our tech architecture. I would be happy to have you onboarded if you're interested in helping us by sharing your knowledge and expertise.   Please send me a DM if you're willing to help us🙏🙏

— 2023-09-11 —

Arash Nemat Zadeh: I got this in my tonkeeper What does it mean? Can it be harmful? What should I do? Accept or decline?

&rey: It's a NFT minted by someone in attempt to defraud users who think that it's real anonymous number. It has no harm other than thinking that you own a real NFT, though it's easier to decline it. (reply to 34440)

Rey: SCAM 😞 (reply to 34440)

Bean: Hi guys, I want to implement a method to transfer all amount of a Jetton of the contract to another wallet   global slice centralize_wallet  transfer_jetton(slice jetton_master) {     transfer jetton of this.contract to centralzie_wallet }  How can I get jetton wallet and jetton amount of current contract inside FunC code? As I know we can't call get method of another contract inside current contract.

Howard: You can't do it directly. TON is only possible through message passing and is triggered by the internal{...} area. (reply to 34443)

Bean: you mean In my Dapp, I must specify contract_jetton_wallet, target_jetton_wallet, amount and send them to the contract to execute function transfer_jetton, right? so this function must be transfer_jetton(slice source, slice target, int amount)

naoer: Buddies, can ton support tracking and positioning? I am working on a project similar to stepn.

Eugene: I'm not sure what would 'supporting tracking by ton' look like  Most blockchains by themselves are just distributed ledgers and don't have built-in functions specifically for tracking and positioning  But if you want to create something like stepn, I guess you could use a system made for tracking and feed the data you get from it into ton for rewards and stuff like that, so it's possible to create a stepn-like project using ton  I guess stepn itself works that way (reply to 34446)

naoer: get , thank you! (reply to 34447)

s: hi i want create secret key and address and deploy and send transaction by node js please help me when i use this code showing me error wallet.deploy is not a function   const { getHttpEndpoint }=require("@orbs-network/ton-access") const { mnemonicToWalletKey }= require( "ton-crypto") const { TonClient, WalletContractV4, internal } =require("ton")  async function main() {   // open wallet v4 (notice the correct wallet version here)   const mnemonic = "direct draft victory insane daring train fog advice mail metal movie more diary because brick second trophy screen seat solar valid orient tiger news"; // your 24 secret words (replace ... with the rest of the words)   const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });    // initialize ton rpc client on testnet   const endpoint = await getHttpEndpoint({ network: "mainnet" });   const client = new TonClient({ endpoint });   await wallet.deploy(key.secretKey).send(); // deploy wallet to blockchain    // make sure wallet is deployed   if (!await client.isContractDeployed(wallet.address)) {     return console.log("wallet is not deployed");   }    // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e   const walletContract = client.open(wallet);   const seqno = await walletContract.getSeqno();   await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",         value: "0.05", // 0.05 TON         body: "Hello", // optional comment         bounce: false,       })     ]   });    // wait until confirmed   let currentSeqno = seqno;   while (currentSeqno == seqno) {     console.log("waiting for transaction to confirm...");         currentSeqno = await walletContract.getSeqno();   }   console.log("transaction confirmed!"); }  main();

Nikolay: How can I listen this "overlay broadcasts"? Any libs, examples or TON repo source code references to dig? (reply to 23423)

Łukasz: Is there any way to get an identifier of the transaction sent by internal(...) method?

Łukasz: or any last transaction id (not confirmed, being processed/waiting to be processed) for the account

GD@0606: anyone had done with transaction by sending some test ton from one account to another ?? please provide any reference ?? I am struct with transaction part ??

Alex: Ever Wondered How Different Blockchains Connect?  We are living in a world of connections and interactions, and with their lack, today's world will be meaningless. In the space of cryptocurrencies, numerous blockchains coexist and interact, each with its own set of rules and protocols.   But how do these independent networks manage to communicate and work together?   The solution lies in blockchain bridges. A blockchain bridge is a set of rules and mechanisms that establish a connection between two separate blockchains, allowing them to communicate and engage with each other.  learn and read more about it comprehensively in our, Blockchain Bridge Explained , article.   Website | Blog  | Twitter (forwarded from TonRadar)

Bean: Hi guys, under the hood, what aspects does TON outperform both EVM and SOLANA?

researcher: https://ton.org/en/analysis (reply to 34455)

Jzuss ┌( ಠ_ಠ)┘: Q. about address calculation: What are these bits? For ex., in nft contract we store (4, 3)

&rey: This is same but split into two `.store_uint`s. Both options store 0b100. (reply to 34457)

Jzuss ┌( ಠ_ಠ)┘: And what could be wrong with smc deploy if I have: exitCode: 0 actionResultCode: 34 I have correct init_data...

&rey: Have you set the flag that message contains StateInit? that is, .store_uint(6, 108), if I remember correctly. (reply to 34459)

Jzuss ┌( ಠ_ಠ)┘: I tried but failed (reply to 34460)

&rey: Please show how do you form the message flags. (reply to 34461)

Maxey: Has anyone use emit() in tact  and something going wrong?

Jzuss ┌( ಠ_ಠ)┘: I use nft template to deployment, maybe problem with contract I deploy? (reply to 34462)

&rey: You can't send zero coins + gas; you need to send at least 1 additional coin (and NFT collection has to send more if NFT is to be initialized). (reply to 34463)

Jzuss ┌( ಠ_ಠ)┘: the same error( (reply to 34466)

&rey: Is your StateInit valid? begin_cell().store_uint(6, 5).store_ref(code).store_ref(data).end_cell()

Tim: i think there's big chance something is wrong here, try to rewrite it as different sentences and then optimize when it's working

Tim: are you even sure what flags you setting to 1?

Jzuss ┌( ಠ_ಠ)┘: yes! (reply to 34468)

Jzuss ┌( ಠ_ಠ)┘: ye, your advice helped! thnx @pcrafter @TrueCarry (reply to 34469)

хд: goodbye

— 2023-09-12 —

Thilak: Hi, Does Nujan IDE support Tact smartcontract compile and deployment??

Howard: 1/ Better security manage for on-chain assets compared with EVM. No signing attack or approval attack.  2/ The fundamentally AA design(wallet smart contract) architecture.   3/ More, the off-chain integration like Telegram (reply to 34455)

Howard: can take reference here: https://answers.ton.org/question/1555046484724944896/what-does-int-msg-info-means-in-this-func  And maybe ask in Answers.ton.org more tho. 🙂🙂🙂 (reply to 34457)

Yan: 🎤 Audio Stickers  Stickers are Telegram's 🔑 feature for the youth coming to the messenger. It's been four years since the team introduced animated stickers, bringing the level of how we communicate above; one more time.  So what's next? 🎁  Audio stickers started to gain in popularity early this year, coming from the underground devs in the eastern audiences 🛩  Due to the complexity of implementation 💀, people needed to build a bot on their own – to host the sticker pack, which was never a nearly smooth experience, and made the creation of audio stickers impossible for the regular users 🏃🏻‍♂️  Several hours ago, @AudioCreatorBot was released – and it changed quite a few things about it ♟  @AudioCreatorBot is first to let anyone easily create and manage audio stickers 🎤. Much like the good ol' Controller Bot, the Audio Stickers Creator connects with a bot owned by a user, and turns it into a sticker pack 🪄  In just a few steps one can start uploading their 💿 audio stickers – designed in a fairly simple and straightforward way, just like the @Stickers.  ▪️ The audio sticker packs will look like @KanyeAudioBot or @BogdanoffAudioBot (both created via @AudioCreatorBot by testers).  Once a user has the bot with audio stickers started, they will be suggested in any chat when typing the bot username 💬. After typing it once, the audio stickers will become accessible in one tap as Telegram remembers the corresponding bot ✔️  Enjoy some good news this Sunday 🥂 (forwarded from Tonsider 💎)

Yan: thoughts on the audio sticker implementation?

Eugene: The implementation feels "not native" for me,   but I'm not sure audio stickers are TON-related in any way so it might be offtop for this chat (reply to 34484)

Kramer Nomissian: Hello here can I talk to any developer here I have an idea to create something on telegram apps

Kramer Nomissian: Pls write to me

Yan: i wish it was that simple hahah (reply to 34486)

Kramer Nomissian: Not hard either (reply to 34488)

TON Answers Bot (not AI): Zerom amount jettons in transaction from Alex Defental  I'm trying to send jettons from one wallet to another. For this I use the library tonweb. Whenever i send transaction, i get a zero amount of tokens. Why is this and how can i fix it?  My code looks like:  import Env from "@ioc:Adonis/Core/Env"; import TonWeb from "tonweb"; import {mnemonicToWalletKey} from "@ton/crypto";  const mnemonic = Env.get('TON_MNEMONIC');  const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: 'e................4fef9'}));  export const SendTokens = async () => {   const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));    const WalletClass = tonweb.wallet.all.v4R2;    const wallet = new WalletClass(tonweb.provider, {     publicKey: keyPair.publicKey   });    const address = await wallet.getAddress();    console.log("my address", address.toString());    const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {     adminAddress: address,     jettonContentUri: "",     jettonWalletCodeHex: "GEM",     address: "0:e609c3e241e054e3f078a974e7cd46ea49bcb3e3d8ac4d48c658d27970edb072"});    const data = await jettonMinter.getJettonData();    console.log('Total supply:', data.totalSupply.toString());   console.log('URI to off-chain metadata:', data.jettonContentUri);   //console.log('Owner address:', data.adminAddress(true, true, true));    const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(address);    console.log("jetton wallet address", jettonWalletAddress.toString())    const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {     address: jettonWalletAddress   });    const jettonData = await jettonWallet.getData();    console.log("minter address", jettonData.jettonMinterAddress.toString());   console.log('Jetton wallet address:', address.toString(true, true, true));    const seqno = (await wallet.methods.seqno().call()) || 0;    console.log('Secno:', seqno);    const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('transfer GEM 3')]);    await wallet.methods.transfer({     secretKey: keyPair.secretKey,     toAddress: jettonWalletAddress, // address of Jetton wallet of Jetton sender     amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message     seqno: seqno,     payload: await jettonWallet.createTransferBody({       queryId: seqno,       tokenAmount: TonWeb.utils.toNano('0.05'), // Jetton amount (in basic indivisible units)       toAddress: new TonWeb.utils.Address("0:19b46402e5e4c173ea84d8125345f67fe0a07f113588ab897408231d482044b1"), // recepient user's wallet address (not Jetton wallet)       forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message       forwardPayload: comment, // text comment for Transfer notification message       responseAddress: address // return the TONs after deducting commissions back to the sender's wallet address     }),     sendMode: 3,   }).send() }    zero transactions in viewer https://tonviewer.com/EQAxLtVoJedFWnlIw0Z35Bjmw3HSY8D9fg-mAxwj5AJ3Us-/jetton/EQDmCcPiQeBU4B4qXTnzUbqSbyz49isTUjGWNJ5cO2wcs5s  🔗 Answer on TON Overflow

— 2023-09-13 —

Aleksandr: Good afternoon!  Who can advise on authorization via Telegram connect How to use it with django?  There is a Telegram registration widget that redirects the user after successful registration  The redirect link and POST request contain all the data received from Telegram, namely: first name, last name, username, photo_url, auth_date (unix time) and hash.  The question is: how to process this data so that it is used for user registration and authentication, that is, how to make a model, how to use views, and so on.

Main: ask for resume in pm please 💡

blacktyg3r: Literally Google it, or chatgpt (reply to 34492)

dean: is it possible to make a smart contract to send an address an NFT and it's returned to your wallet after x days without trusting them? (automatic)

К-app: nothing is impossible (reply to 34495)

dean: okayy but how lol

Daniil: there are two ways of scheduling something in blockchain:  * rely on external messages (very cheap, but not that reliable), example: https://github.com/Gusarich/external-scheduler  * rely on internal messages (very expensive, but reliable), example: https://github.com/ProgramCrafter/ton-stable-timer (reply to 34495)

Dmitry | backend4you.ton: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md says that NFT must have "transfer" operation so owner can send it to other user. But it doesn't prevent it from having, say "come_back" operation that will check that sender is your (original owner) fixed wallet and self-transfer itself back to you.

&rey: This requires a special NFT or not actually transferring to new owner you specify (but rather having explorers display it there). (reply to 34495)

Daniil: oh, seems like you meant something else. I misunderstood. (reply to 34498)

dean: ok im confused

&rey: Though, scheduling is needed there. (reply to 34501)

dean: Telegram username nft (reply to 34500)

ɴᴜʀs²: Hello! Can someone help with connecting to the wallet through a browser extension? Do you have examples of connecting to React? (opening an extension, etc.)

&rey: Not actually possible. These NFTs are made so that only current owner can transfer ownership, so to make sure NFT can return to you you need to not transfer it somewhere else in the first place. (reply to 34504)

dean: oh ok ty

&rey: You'd rather want person to ton-connect to temporary wallet holding only that username.

Daniil: https://docs.ton.org/develop/dapps/ton-connect/integration (reply to 34505)

&rey: This can be done without giving person access to funds on wallet, by the way. (reply to 34508)

dean: oh okay

dean: what about with TON itself? instead of NFTs

Daniil: why would you lend Toncoin like this? (reply to 34512)

Dmitry | backend4you.ton: ton-connect user to wallet? I thought ton-connect exists to connect user's wallet to some app. (reply to 34508)

&rey: Unless receiver wallet has installed plugin (and doesn't uninstall it nor sends funds anywhere else), TON can't be guaranteed to be returned as well.

dean: Thanks

Daniil: what if the person you lended Toncoin to will spend them on something? (reply to 34513)

&rey: ton-connect Fragment on user's device to the temporary wallet but in such way that user doesn't get private key of wallet. (reply to 34514)

Dmitry | backend4you.ton: but if second user has "control" of browser - he can open developer console and manually prepare and send custom transaction that moves that NFT to other wallet, isn't he? (reply to 34518)

Dmitry | backend4you.ton: Yes, this user also need access to connected wallet to "confirm" his transaction. It's unclear what usecases must and what must not be supportted in original question.

&rey: Private key doesn't ever need to enter user's device, I guess? (reply to 34519)

&rey: If there is another site that will provide data (actually, ton-proof) for ton-connect auth.

Sea💎✈️: hello, how to use WalletContractV4 send a messge to a Contract? have demo?

Daniil: which language do you use? which library? (reply to 34523)

Sea💎✈️: TS and import { TonClient, WalletContractV4, internal, fromNano } from "ton"; (reply to 34524)

Sea💎✈️: the doc have not demo

Daniil: https://github.com/ton-org/ton#usage (reply to 34526)

Sea💎✈️: I know, but no WalletContractV4.send demo, I don't know how to use it (reply to 34527)

Pritesh: Any tutorial for ton solidity?

Nate: What’s the main dex

Yan: ✨ TOKEN2049  Highlights from the joint presentation 🎤 of TON Foundation × Telegram Core:  ◾️ a goal to onboard 1/3 of all Telegram users into the @wallet or TON by 2025 🗓 (which would mean around 400M active web3 users by that time); ◾️ perks and benefits for TON-based projects when promoted via the Telegram ads platform 📣; ◾️ complete focus 👁 on the mass adoption and real-world utilities; ◾️ tApps to build on top of TON 🏗, and TON as a layer for web apps on Telegram; ◾️ @wallet turning into a non-custodial app to let users connect with dApps and sign transactions ✒️  That was a hot one – $TON grew by 10% in a matter of hours 🟢. More insights incoming...  @tonsider (forwarded from Tonsider 💎)

Henok Kebede: Hello

&rey: They're listed on https://ton.app/dex. (reply to 34530)

Evgeny: Hey mates! Where to find @wallet docs?

Evgeny: This? (reply to 34509)

Yan: no it's for browsers

Yan: smth should be up on wallet.tg but idk

Evgeny: ty

Yan: 💎 Wallet Connect  We've obtained the very first footage 📼 of how the @wallet connect would work in tApps – akin to the way dApps connect with MetaMask in browsers, tApps have been made possible to connect with your Telegram-native wallet 👝  The formula 💻 for the next generation of web3 apps can be described as follows: if dApps = tApps, and browsers = Telegram, then MetaMask = @Wallet. —This ain't exactly a formula and isn't quite about math, but the directions are clear 🎢  Worth reminding: none of the tApp functionality or getting tApps support on the quick access panel are exclusive to the apps under the spotlight 🔦. Rather the opposite – they're utilizing Telegram's newest features first, to demonstrate the messenger's capabilities as a new web3 platform ✨  @tonsider (forwarded from Tonsider 💎)

ARTEM: how to switch to a testnet in chrome extension wallet? (reply to 7789)

— 2023-09-14 —

Howard: Is it possible to add the "Swap" and "Add Liquidity" features to the Jetton Wallet Standard?  I believe this could reduce gas fees and make the current DEXs more flexible.  By using myBalance * Jetton Balance of the current Jetton Wallet, we can implement the UniV1 constant AMM from day one.  References: https://hackmd.io/@HaydenAdams/HJ9jLsfTz#Creating-Exchanges

Daniil: What’s the point? (reply to 34543)

Howard: all the current DEX can became more sufficient in Gas?

Howard: since you don't need create new LP address to manage the parameters

Howard: Although this may sound unrealistic given the many DEXs we have now, the idea is theoretically sound, right? I've been thinking about this for a while.

Howard: Since Ston.fi uses the UniswapV2 methodology, which requires two tokens simultaneously,  And since UniV1 allows for swapping between ETH and ERC20 tokens (but not ERC20 to ERC20),  Just a potential idea can implement, since gas will definitely cost less.

Daniil: As I understood, you basically want to move the functionality of DEX right into the Jetton wallet contract. It will probably decrease the forward fees for DEXs but also add the unnecessary fees to all regular users (reply to 34545)

Daniil: And almost every DEX has some unique features that are implemented in their custom contracts. You can’t force them to use only the one simple swap function that will be included in Jetton wallet. They will likely ignore that change and continue to use their contracts (same for all new coming DEXs)

Jzuss ┌( ಠ_ಠ)┘: What does the last bit mean in deploy nft func? Following docs wee se only 1 + 4 + 4 + 64 + 32 + 1 + 1 bits

Jzuss ┌( ಠ_ಠ)┘: this bit? (nft-item code)

&rey: Second-to-last bit is added, it is only present if StateInit is and indicates whether it's inlined in root message cell or stored in a separate reference (100% of existing contracts use separate reference). (reply to 34553)

User<6310880065>: Can you check the DM, please? (reply to 17388)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Ton was sent,but premium didn't  get ,what should I do ?

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: help me please

Howard: Tx ID? You (reply to 34557)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: where can I find my tx ID ? (reply to 34559)

Dmitry | backend4you.ton: You sent ton from your ton wallet. Your ton wallet has address (like EQ…). Copy paste it to tonscan.org and check that it shows your outgoing tx. (reply to 34560)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: No problem ,thanks ,just a few seconds (reply to 34561)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Is it correct ? (reply to 34561)

Dmitry | backend4you.ton: you have two transactions with 1min interval. for same TG account or for different? second account received premium? (reply to 34563)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Different account (reply to 34564)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Neither ,but the second on shows the picture

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: The first one shows nothing

Dmitry | backend4you.ton: I tried to open fragment.com to check for any support links, but it opening very sloooow for me. maybe they just have some tech problems...

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: No support at all........ (reply to 34569)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: This is the third times .....

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: So, next time I have to use visa to get premium not Ton ,is it ?

Jzuss ┌( ಠ_ಠ)┘: Has anybody caught exit code = 7 on set_data call? ("Type check error. An argument to a primitive is of an incorrect value type")

Roman: Hey Devs! 👋  If you've missed any concepts, tutorials, or examples for TON development (with any language!), now you can create a request with just one click. 🪄  Hack-TON-berfest is coming up, and soon many people will be actively searching for tasks to enhance TON. 💎  With the TON Docs Wizard Bot, you can effortlessly create tasks for any topic you're interested in with just one click! 😉  Let's rock!

— 2023-09-15 —

Howard: that is good!!! (reply to 34576)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Is it possible  to return Ton if didn't get premium after 24 hours (reply to 34578)

Howard: which API / URL you bought your Premium? (reply to 34579)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Fragment (reply to 34580)

Howard: then should be fine. Maybe better to check your on-chain Tx (reply to 34581)

&rey: Please contact Telegram support (reply to 34579)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Via email or telegram account? (reply to 34586)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Who to contact ,where get support

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Happened again just now...

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: Why

&rey: Settings — Ask a Question (reply to 34587)

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: GqUWywWNpFxqIoEswKoDRYq631Qd2oqNiXSaOXlq8Tw=

G: Hey, is there a telegram wallet bot where I can access testnet?

Egor: Hey guys! Any job offers for junoir tester?

Oleh: Hi! As part of footstep program for developers, a library for Ruby was created, here are the links. Have a nice day everyone who is in TON  https://github.com/nerzh/ton-sdk-ruby https://github.com/nerzh/ton-sdk-ruby-smc

— 2023-09-16 —

Andrei: Hello, how is it possible to get the commission cost before shipping? using xssnick/tonutils-go

Ellar: Hi all, how to get notifications of incoming transactions to wallets?

Mark: I'm trying to get full node in sync, but I'm getting following warning:   [ 3][t 2][2023-09-16 13:38:21.542837241][adnl-peer.cpp:570][!peerpair][&ADNL_WARNING] [peerpair 7/NFJt0F6T5PRSDRymPbJ5/AZDLUP7ARYchcKHwt2VA=-TqL3xi24fgkml+PVrXw4ZKmfQhBVyr6rzHC5mWW3jUM=]: dropping too big huge message: size=35440  [ 2][t 3][2023-09-16 13:38:22.528219544][manager-init.cpp:86][!downloadproofreq] failed to download proof link: [Error : 651 : no nodes]

Mark: There are bunch of warnings about "too big huge messages", proof link downloading message error appears every second for about 2 minutes and then it starts again from dropping messages

Javad: Where can i find archive node ?

Musa: Hello, what is the easiest way to list jetton.live token in Dex?

&rey: It depends on DEX, please do your own research to apply. (reply to 34614)

Musa: Which dex can jetton list (reply to 34617)

&rey: Among public liteservers there are several archive ones. You can find them by querying the first TON block. (reply to 34613)

Musa: I want to generate liquidity for my token and bid for price

Daniil: You can do it on any DEX (reply to 34620)

Musa: Example? (reply to 34621)

User<5985733780>: What's the min withdrawal of wallet app

User<5985733780>: U mean @wallet ? (reply to 34593)

Daniil: Dedust , stonfi (reply to 34622)

BBB: Всем привет) Подскажите, с чего начать разработку смарт контрактов для TON. Возможно ли заниматься разработкой с помощью Python ?

&rey: @tondev is Russian chat. (reply to 34626)

Daniil: Begin by checking out docs.ton.org (reply to 34626)

BBB: Thank you

Javad: What do you means by "quering the first TON block" ? (reply to 34619)

&rey: Get transactions of the masterchain block with seqno 1. (reply to 34635)

Dmitry | backend4you.ton: Or with seqno = 3. I remember there were some problems with #1, and using #3 was the easiest solution.

abdallah: is there is any admin here i can speak to regarding TSC4 prize's?

Syed Mahdi | Salvation: Hi there, we have made an MMORTS game which has developed on Telos(eosio) blockchain. I wonder if someone can guide me where to start to convert to TON

🎗: What projects are currently active on the ton network in the test net phase (reply to 34617)

Daniil: docs.ton.org (reply to 34641)

— 2023-09-17 —

Howard: hi, I'm looking for the way like Etherscan that can track the address balance in a daily basis. Any tooling can do that yet?

محمد: can you please explain workchain to me ?

Puria: If you have experience with EVM type blockchains, you may notice that each has its own distinct chainId. In the case of TON, it operates using Workchains, which are semi-independent blockchains that can establish their own regulations and verify their own transactions. However, they remain connected to the larger TON network, as they are not completely isolated. To facilitate communication between workchains, TON has established a mechanism that allows for the transfer of tokens and information across these semi-independent blockchains. (reply to 34646)

Puria: https://docs.ton.org/learn/overviews/ton-blockchain

User<5040233438>: Hi 👋  Is there any software for TON like Electrum?  I want to sign transactions on an offline device and broadcast it via an online one.  I know there is:  https://github.com/ton-defi-org/ton-offline-transaction  But maybe there is a tool with a more user-friendly experience :)

Andrew: I do use Tonkeeper and I am good but I do not know if there is a wallet like Electrum for TON (reply to 34649)

Yurii: Is TON Space Wallet only for TON chain or other EVMs will be available as well?

&rey: Note: TON Blockchain is not based on EVM. (reply to 34653)

Yurii: my bad (reply to 34654)

&rey: I don't know whether TON Space plans supporting EVM chains (probably not), but here is a list of wallets that do: https://ton.org/wallets?locale=en&filters[wallet_features][slug][$in]=multi-chain&pagination[limit]=-1 (reply to 34655)

Yurii: ty Ser

Howard: Exit_Code 40 might be cause when you use Integer Operation! Be careful. (reply to 33093)

— 2023-09-18 —

User<6374517035>: does anyone have an example of a jetton based smart contract with taxes that redistribute x amount of funds sent/received to any particular wallet?   i hope i phrased that right ^^

&rey: Actually it's hard to redistribute anything because jetton master doesn't have a list of all wallets, and even if it had, that would be prohibitively expensive. Some coins could be burned on transfer instead (such amount that would maintain proportions between wallets). (reply to 34661)

User<6374517035>: Thanks for the detailed answer. I'm just learning about all of TON today :)   A burn could be interesting. Are there any examples of live contracts that have this sort of logic? (reply to 34664)

&rey: Almost all jetton contracts support burn on user's request; you may have a look at https://tonscan.org/address/EQA2X7JAllNhcyPov1LoI8f5qMFbd9clN9vsbd28UwSvElKv#source.

User<6374517035>: Thanks again brother

&rey: I think you should read through some tutorials on https://docs.ton.org/ to capture TON basics and common patterns. (reply to 34665)

User<6374517035>: I will.

裸裸: how to transfer ton without use any wallet.

裸裸: just use private key and http api.

&rey: https://github.com/toncenter/examples/blob/main/withdrawals.js (reply to 34670)

裸裸: thank you. but. do you have examples of golang ?

&rey: https://docs.ton.org/develop/dapps/#language-specific-guides (reply to 34673)

裸裸: I see jetton-transfer , but what is jetton?

裸裸: I mean if I want transfer ton, not other coin. use jetton or not?

&rey: Jettons are fungible tokens. (reply to 34675)

&rey: No, TON transfer is simpler than jetton one. (reply to 34676)

裸裸: simpler means, the the jetton transfer contains the ton transfer?

裸裸: or not contains. can not use jetton to transfer ton?

User<6374517035>: from reading around, it looks like creating a workchain seems to be the optimal path to take for capitalizing on time spent being early in the ecosystem

&rey: Yes, it contains transfer TON to jetton wallet contract (you can change that to intended recipient) with some message body (that you can remove). (reply to 34679)

&rey: There are currently two workchains, masterchain (-1) and basechain (0), and they were there since the beginning. (reply to 34681)

User<6374517035>: Im still reading around but how difficult would it be infrastructure wise for a group/individual to create their/his own workchain (reply to 34683)

&rey: It would probably need to refactor the existing validator code, which actually should be done but is not now. (reply to 34684)

Vladimirovich40440: Hello developers! Could you provide answer, are there any available solution for the import of token's holders from the net?

Howard: Does TonViewer has own group or something?  Notice the detail for the different icon here!!   Why JettonNotification(0x7362d09c) might still in "!" mark, but no exit code?

aleksej: Yep, you can post your suggestion or question there https://t.me/tonapitech (reply to 34692)

Denis: Can you give me the link?

moono: How to swap toncoin(ton) -> toncoin(erc20) ?

moono: is that possible?

Anton: https://bridge.ton.org/ (reply to 34698)

moono: thx (reply to 34700)

Andrew: I am looking for a developer/group to make a TON based web app like @wallet inside of Telegram. If you have a suggestion who can help me or anything useful it would be very appreciated

Howard: it's called TWA(Telegram Web App). Reference here: https://docs.twa.dev/docs/libraries/twa-js-sdk-react (reply to 34702)

moono: I send ton using that bridge, but receiver said he can’t received..

moono: What’s wrong with this?! where is my TON :(

moono: somebody helpme

Anton: what is 0xeB342..... is it a valid TON address? can't find it (reply to 34705)

moono: It’s ethereum

moono: address

&rey: Doesn't wallet need some ETH to pull wrapped TON out of bridge?

moono: then, the receiver needs to withdraw himself?

&rey: I don't actually know but this looks plausible. Or the transaction might not go through yet; if it's not working for 30 more minutes, you can write to https://t.me/ton_help_bot.

moono: thx

