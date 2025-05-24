Anton: Looks like you have to interact with toncoin contract (op: "Vote for minting").  I've checked the previous transfer transaction https://etherscan.io/tx/0x44b63ae1e34055275dcb4f156f715da7426a0acd8f2771612fc7f9db8d78bb86  https://tonscan.org/tx/RGhqaBLK4onUlyRi07R1GScmU8qkQxd9S73nV-ktUyo= (reply to 34713)

moono: Ah ok thank you!!! :) (reply to 34716)

Andrew: Can someone suggest me an individual/company? (reply to 34702)

Tim: many users get scammed, be carefull (reply to 34721)

Coinvent: Can you please write us in DM with more details about your project? (reply to 34702)

AYMEN: Isn't https://github.com/ton-blockchain/ton/ is the tonlib repo with json interface or it's moved elsewhere?

TON Answers Bot (not AI): Error while mytonctrl install from Philip Trofimov  Hi. I have Ubuntu 20.04  wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh - ok sudo bash install.sh -m lite - [6/6] TON software installation complete ~$ mytonctrl:  Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings    What should i do now?    🔗 Answer on TON Overflow

— 2023-09-19 —

TON Answers Bot (not AI): How to switch mainnet/testnet in tg wallet bot? from Alvan  I wanna build a ton dapp on tg bot, but I cant find the way to switch net work in the official wallet bot. This is the code I forked. https://github.com/ton-connect/demo-telegram-bot  🔗 Answer on TON Overflow

Howard: quick answer, there is no test-net environment for @wallet at this moment. (reply to 34728)

Anton: looks like it was processed  did you do something or it was resolved automatically? Thanks! (reply to 34706)

moono: I connected the metamask that I connected at the time of sending to the TON bridge, and the confirmation button was activated and click that, processed! Thank you so much your help! (reply to 34730)

Tony: Dear i am a blockchain dev, i am happy to join

Gunnar: does anyone know of an address with a highload wallet with transactions with many messages?

Anton: https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz  dns.ton  may be it's not a high load... it's 10/hour (reply to 34733)

Gunnar: I was hoping for many messages in one TX ... I am sure i've seen one with like 200 out messages ...

Andrew: 255 максимум (reply to 34735)

Gunnar: I know - I am just looking for an example where this actually happened

Howard: Hi, I am delving into the forward_payload for Jetton Transfer and NFT Transfer. I noticed that TonViewer helps us decode the Cell data.   However, I have some questions: I followed the TLB core repository (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) and noticed differences in "is_right" and "is_left." When and how does this matter?

Denis: https://hackage.haskell.org/package/category-extras-0.53.5/docs/Control-Monad-Either.html (forwarded from Denis)

Denis: ok. on pseudo code:  transferCell = newCell() transferCell.write(transfer_op_code) ... blah-blah-blah amount and destionation ... if i_want_to_store_forsward_payload_in_same_cell {     transferCell.writeBit(0) //Either left   transferCell.writeUint32(0) //text op_code 0x00000000   transferCell.writeBytes(utf8("Hi Howard"))  } else {  transferCell.writeBit(1)  subCell = newCell()  subCell.writeUint32(0) //text op_code 0x00000000  subCell.writeBytes(utf8("Hi Howard"))   transferCell.writeRef(subCell) } (forwarded from Denis)

Denis: > The Either type represents values with two possibilities: a value of type Either a b is either Left a or Right b.

Denis: forward_payload:(Either Cell ^Cell) https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md

Denis: 🤷‍♂️

TON Answers Bot (not AI): LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: lt not in db from No Name  Hi I'm just trying to get transactions for the address and getting this error from time to time (few times I got successfull response)   request:   curl -X 'GET' 'https://toncenter.com/api/v2/getTransactions?address=EQBnvfmXYL_z7n4WriIEVrBNKVQBolTD5bx-syCe5B5EtqOy' -H 'accept: application/json'   error: {"ok":false,"error":"LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: lt not in db","code":500}    1. Why I'm getting this error periodically? 2. Do I need in my own Lite node to avoid this error? What is the reason to use own Lite node?  Thanks.  🔗 Answer on TON Overflow

Gojo Sensei!!!: Is anyone up for giving a session on blockchain and decentralisation at a clg???

Tumin | Wagmi11: but the sliceStr is not of type Slice, how to use thing along with .storeSlice? (reply to 24321)

Shadeov: Hello! I've noticed that Telegram doesn't support TON DNS within the Web App. Did I do something wrong, or is there still no support for domains like .ton within TWA (Telegram Web App)?

Tim: there's no indications that it should do so

Daniil: Do you have any experience in TON? (reply to 34747)

Shadeov: But for the Russian user, this is very important. In Russia, providers can monitor all the websites users visit. I would like to implement all of this within the TON ecosystem and ensure a high level of privacy for users. (reply to 34751)

patrick.algo: is docs.ton.tg blocked for anyone/everyone? I'm in US and it doesn't resolve at all.

Anton: https://docs.ton.org/ (reply to 34754)

patrick.algo: ALL the links on the website point to docs.ton.tg

patrick.algo: ton.tg website - then docs/etc all point to docs.ton.tg which doesn't exist.

patrick.algo: seems like ton.tg should just redirect to new ton.org site?

— 2023-09-20 —

dean: Link to docs with instructions on how to make my own nft collection?

User<6669040442>: Hello guys , How to make the bot know whether the user has made a transaction and how much he has sent through the ton keeper embedded in the bot

User<6669040442>: just parse my wallet, and if a ton came there, then compare the user pressing the button and the time when the TON came to me?

dean: mandatory comment field (reply to 34763)

User<6669040442>: I want to make an automated bot so that the functions are available immediately after payment

Anthony: ton.org is the official web site (reply to 34754)

patrick.algo: you guys need to update ton.tg to redirect to ton.org then - when I did a search for 'ton blockchain' I got sent to ton.tg - which has bad links. it should instead redirect to ton.org (reply to 34768)

Anthony: ton.tg is not our website. Someone created a mirror (reply to 34769)

Po 🐈‍⬛: African scammer site?

Po 🐈‍⬛: Im confused

Po 🐈‍⬛: Is that domain addresses telegram or togo

Po 🐈‍⬛: Google said its togo

Po 🐈‍⬛: 🧐

patrick.algo: https://duckduckgo.com/?q=ton+blockchain

patrick.algo: first hit is ton.tg. 🙁

Клецка: + (reply to 34777)

Anthony: thx for the report. We will fix it (reply to 34777)

patrick.algo: it's particularly sneaky because of the pre-exisitng telegram 'tg' connection.

Cooop: Hi! Anyone used these https://github.com/ton-blockchain/ledger-app-ton ?

Anthony: JFYI, we are passing Ledger's audit at this moment with this version: https://github.com/ton-blockchain/ledger-app-ton/tree/develop (reply to 34781)

fomo: Hello there, I would like to know if there is any tutorial for Solidity developers to enter the TON space?

Anthony: Not a tutorial, but a quite useful article – https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers (reply to 34783)

Dorma | Spot On Chain | Never DM First: Hi, I am reaching out on behalf of Spot On Chain (https://spotonchain.ai/), the first AI-powered on-chain analytics platform that helps traders to make decision with confidence by providing onchain signal that they can act on immediately. The AI engine tracks Whale, VC, Smart Traders, Visualize multichain token flow and more, available on mobile devices with multichain wallet integration.  I would like to discuss collaboration so that TON community can use the platform to easily monitor important movements of the token with minimal effort and trade efficiently.  Appreciate connecting me with admin or team member in charge

fomo: Read this, but thank you (reply to 34784)

Anthony: Hi! You can ping me (reply to 34785)

Cooop: Does it mean official support is on its way 👀 (reply to 34782)

Anthony: Yes (reply to 34788)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hi, I'm using same wrapper for the front and the bot. in front everything works as well but I receive Error: Invalid address  at openContract ... in bot. how you can handle this? the Address in bot's log is my testnet wallet address, but in the front log it is address of created new contract which we expect. wrappers are same without any char change. the contract is init of a nft collection

Howard: - What makes the difference when the forward_payload is in the same cell or not?  - In Jetton Transfer using TonKeeper, the data is stored on the left (meaning is_right is true). Why does that matter?  - How can we store the Comment message in forward_payload if we want the comment message to be displayed on the Explorer? (The same way we did it in the TonKeeper wallet) (reply to 34741)

Howard: OK, Solved. Although I can' get why we need this different way left and right when dealing with forward_payload. But both methods are fine in here, if you want to get Comment message when transferring the Jetton Tokens. (reply to 34791)

Howard: When using TonKeeper, it always with is_right = true. (reply to 34794)

Tim: You can't always store everything you want on left (reply to 34794)

Tim: It has limit of 1023 and half already used

Kate: Hi everyone! Is anyone planning to be in Prague this weekend?🇨🇿  We’ve preparing so cool opportunity to have an easy kickstart in the TON Ecosystem⬇️

Kate: Calling all builders in Prague!   TON-based GameDev Weekend [featuring Telegram] starts in just 3 days🔜  💎🔥Boost your skills and win a prize of 5000 USDT!🔥💎  2 days of game development and free experiments with Telegram bots:   ⁃ FunC and TACT workshops  ⁃ Building sessions  ⁃ Lunch & networking  ⁃ All about TON grants  •23.09-24.09, start at 11.00 •HubHub Palàc ARA  🎫Reserve your free spot HERE (forwarded from TON Society Europe)

Saul: Hi all, can someone please confirm if I set up my own TON validator what the minimum and maximum native TON amount that can be staked per validator is?

Saul: looking to spin up a validator

Howard: 300k I remember (reply to 34800)

Saul: thanks and the maximum?

fomo: Hello Howard (reply to 34802)

Saul: also if the validator needs to self delegate?

Saul: Or can the full amount come from 1 delegator

&rey: 900k, as far as I remember. (reply to 34803)

&rey: Validator is able to run in single-nominator mode (so that owner of node owns all money) or be attached to nominator pool.

Saul: https://explorer.toncoin.org/config#configparam15  but this says 10m TON as the max?

&rey: Yes. The problem is that if validator tries to stake too much, the stake factor limits how much it actually stakes (maximal ratio of own stake / min validator stake). (reply to 34809)

Matan: Does that mean the 900k is variable depending on the stake of the smallest validator in the active set and the value used for stake factor? The config parameter set the max stake factor to 196608

Matan: Surely 196608*’the min stake in the set’ is significantly larger than 900k? (reply to 34811)

&rey: The factor is multiplied by 65536 to allow for granularity; effective factor is 196608/65536 = 3.

Matan: Ok so 900k being the max assuming the value of the minimum validator in the set is 300k?

Matan: If the smallest validator were to be 400k then the max effectiveness stake would be 1200k?

Matan: Also where is the 65536 value stored?

&rey: Elector's source code (https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF#source), line 224. (reply to 34816)

Matan: Ok thanks so much for your help!

Matan: One more question: Given that the stake must be split so as to be active in both the odd and even pools, does the minimum/ maximum stake apply per validator or per pool? In ither words, to be active in both odd and even pools, must the stake in each pool be >300k and <900k?

CryptoTara: What function is used when someone nominates a stake to a validator ?

&rey: process_new_stake (invoked by message with opcode 0x4e73744b). (reply to 34820)

&rey: Per pool. (reply to 34819)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: is there any suggestion how can I debug this? (reply to 34790)

&rey: By the way, do you know that TON contracts are separate and cannot invoke each other's functions directly, the only interaction is via sending messages? (The question felt like referring to EVM concepts.) (reply to 34820)

Απόλλων: Please tell me, in order for a validator to participate in the rounds, he must have 350 K TON on his balance. Pools can be created for nominators.. The documentation creates 2 pools, for even and odd rounds. Question: each pool must have 350K TON in total?? so that the validator can participate in the rounds or at least one of the two??

&rey: Each pool must have 350K in total (node owner + nominators). It's also possible to participate in half of validation rounds, using only one pool. (reply to 34825)

Justin: Hi All, is this the best place to get in touch with someone from the Developer relations team at TON?

Matan: Where does 350k come from? I thought the minimum is 300k in total including 10k from the validator operator if operating a nominator pool? (reply to 34826)

&rey: Actually, 300K doesn't guarantee that election chooses you as validator, 350K gives better chances. To get up to date information, you'd need to look at dashboard with list of validators [I don't remember its address]. (reply to 34829)

— 2023-09-21 —

Jangju: hello! We are operating an influencer advertising platform on Klaytn Network. Is there any service related to ton network with klaytn? Otherwise it's very interesting.

محمد: How connect to the browser wallet with  js

Tumin | Wagmi11: try this https://github.com/ton-connect/sdk (reply to 34840)

Matan: Why does this page suggest that the minimum validator stake for each pool should be set to >=1k TON when the minimum validator self stake is defined as 10 k in the second link?  https://github.com/ton-blockchain/mytonctrl/blob/master/docs/en/nominator-pool.md  https://telegra.ph/TON-Nominators-requirements-05-28

Javad: How connect to browser waller ?

Howard: depends one which wallet you mentioned here. We have Extension Wallet and Mobile Wallet in TonKeeper.  Go Tonkeeper.com (reply to 34853)

Resha X 🦉 🦆: Can I connect wallet using browser because I can't setup app at old version android (reply to 34854)

Dannie: Hello guys! 😃 The Space with TON network team is going!! Welcome everyone to join and ask questions for TON team! 🙌🙌   https://twitter.com/i/spaces/1PlKQDvgrRqxE?s=20

Dannie: https://x.com/nftscan_com/status/1704108030672220443?s=20

Dannie: https://x.com/nftscan_com/status/1704827559744348372?s=20

Tumin | Wagmi11: I am making a tx to a contract using ton-connect transactions how can I add additional comments to the tx so that it is also visible on the explorer? anybody has any idea about that?  I tried storing a slice on the message body but that doesn't work

Daniil: begin the body with 32 zero-bits and then the comment as UTF-8 string.  also if I remember correctly, in TON Connect you can simply pass a string to the body parameter instead of a cell. (reply to 34861)

Daniil: https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages#simple-message-with-comment

Tumin | Wagmi11: But I also have extra information in the tx,  I have to make a certain op code tx  if I have 32 zerobits it would converts the op to 0 (reply to 34862)

Daniil: then why do you need some comment in it if it's a service message to the contract? (reply to 34864)

Daniil: you can also try changing the logic of the contract to handle these text comments instead of opcodes, but it's not recommended way. (reply to 34864)

Tumin | Wagmi11: it would nice to see a comment on the explorer as well not required for the logical part

Matan: Any thoughts on this? (reply to 34842)

Андрей: because the second article states the conditions for inclusion in the tonvalidators.org list (reply to 34842)

Matan: They both seem to be defining the min stake for validator to be in the active set🤔 (reply to 34869)

Андрей: No, the minimum stake to create a pool is 1k coins. https://github.com/ton-blockchain/nominator-pool/blob/main/func/new-pool.fif#L22 (reply to 34870)

Matan: Ok so if one were to create a pool with 1k it would work but would not be elected as the validator must stake 10k and the total nominated stake must exceed 300k?

Matan: Similarly if the total nominated stake were to be 500k but the validators only self staked 5k then it would not be eligible for election?

Андрей: The elector doesn’t care what the validator’s stake is inside the pool. It is important for the elector what stake the pool sends to participate in the elections, and this value should be more than 300k coins (preferably 350k) It doesn’t matter how the pool collected coins - that the validator added 50k coins and the nominators 300k, that the validator added 1k and the nominators 349k

Matan: Ah ok so there is no requirement for a validator to selfstake?

‌Javad: Friends, I am a designer. If you have an order, I will be happy to do it. 🤝

fomo: Hello guys, I don't quite understand how the contract storage work, why I can just store the value in the contract using set_data without specifiying the name of the variable, what if I have more than 1 varibles need to store in the contract storage? Also, when I am sening messageBody with cell data, can I just append unlimited number of storeUint in the cell?  Last but not least, is that anyway to kwon gas fee and ask users to pay for the transaction, cos unlike Ethereum, if users didn't pay enough gas, the transaction won't be done. But here on TON, the contract will pay the gas for computing.

&rey: 1. Contract storage is cell. 2. Cell stores 0-1023 bits and 0-4 references to other cells. 3. When you use several store_uint-s, you fill the cell, and once there's no more space, writing will fail.  4. Gas fees are usually calculated approximately and offchain. Also, a common practice is to send more TONs and return the excess. (reply to 34877)

User<5660798371>: It's good to have an updated avatar.

User<6004648244>: Guys need help  I'm just starting to work with smart-contracts and TACT and don't fully understand the principles yet. Working in Ubuntu.  When I try to create a contract using create ton@latest it throws this. Npm and node.js are the lastest versions and works without errors.  What is this connected with?

User<5660798371>: capitalize it (reply to 34880)

User<5660798371>: test_contract -> TestContract

User<6004648244>: Really

User<6004648244>: Now it's works  Thank you very much for the quick response

— 2023-09-22 —

lw: Hi, is 'toncenter.com bot' worked now?

&rey: You can use https://www.orbs.com/ton-access/, that is compatible with Toncenter but doesn't require any API keys. (reply to 34887)

fomo: thank you sir, please allow me to ask a follow up question, for example, I would like to store a list of registered addresses in the smart contract and the deposited balance of each of them, shd make a list of cells with each cell store the address and their balance and store the list using save_data? What if I need to store the list together with the total deposited balance, what should I do? (reply to 34878)

&rey: > store a list of registered addresses in the smart contract and the deposited balance of each of them If there are more than 500 addresses, you should consider sharding the contract further. Otherwise, you can use dict.  begin_cell().store_dict(users).store_coins(total_balance).end_cell().set_data(); (reply to 34889)

fomo: thank you so much

fomo: in this case, what if I have to dictionaries, so I will call store_dict tiwce, and it will follow the "last in first out" order when I need to get it back using get_data()? (reply to 34890)

&rey: *First in, first out. Slices allow reading from the beginning of the cell.

fomo: I see, may I know more about how to shard a contract. I am not able to find any related information on doc.ton.org. (reply to 34893)

&rey: https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons (reply to 34894)

fomo: one more thing, why I should use store_dict() instead of just making a global dict or any kind of variables?

&rey: Because global variables are not saved across contract calls. (reply to 34896)

fomo: got it (reply to 34897)

fomo: thank you so much

lw: Thanks (reply to 34888)

dean: Link to docs with instructions on how to make my own nfts?

Fly: Hi guys, I am looking for freelance developer to write a smart contract on TON, I have 2 projects that need help right now

moono: @testgiver_ton_bot is dead

User<5660798371>: all the telegram bots are dead (reply to 34903)

Jake: Its only the ones on public servers. Private tg servers aren't being attacked (reply to 34905)

User<5660798371>: wow, its good news

moono: thx

moono: now, is alive

Javad: chrome extension (reply to 34854)

Howard: For now, will be fine if they use TonConnect. If not, they you can't access your Extension Wallet. For example, Fragment.com (reply to 34910)

Kirill: wow, such a nice avatar

User<5660798371>: + (reply to 34912)

Tumin: https://www.npmjs.com/package/@tonconnect/ui-react (reply to 34505)

00: Where can I check daily tx amount on ton network?

Andrew: I am looking for a telegram bot web app developer. Where can I ask?

Alfredo: Hello, I am new here. What is the best way to get all transactions from a wallet? And save them?

User<5660798371>: download tonkeeper, import the seed phrase and see the transaction history (reply to 34918)

Alfredo: No, I would like to see the history of a given wallet and save it. (reply to 34919)

User<5660798371>: export history? (reply to 34920)

Alfredo: History of a wallet transactions. (reply to 34921)

User<5660798371>: in what format? (reply to 34922)

Alfredo: CSV, JSON, HTML (reply to 34923)

User<5660798371>: you can get in json format the transactions of the wallet, if it has less than 100 transactions, at https://toncenter.com/api/v2/getTransactions?address=<WalletAddress>&limit=100&to_lt=0 (reply to 34924)

Alfredo: Thank you. It seems nice, I think it is not possible to go over 100 with a free tier. Right? (reply to 34925)

User<5660798371>: you can change the to_lt digit from 0 to 100, etc., but you can't get more than 100 at a time. (reply to 34926)

&rey: *lt is not the index of transaction and needs to be changed according to last seen lt. (reply to 34927)

User<5660798371>: ah, yes. it should be possible to view the last digit of lt (reply to 34928)

Alfredo: If this is the only way with big limit, why does the explorers do not allow to export the data? (reply to 34927)

&rey: Because it's not common request. (reply to 34930)

Alfredo: What is the best place to ask for this feature? (reply to 34931)

&rey: You should post this at https://github.com/ton-society/grants-and-bounties/issues. (reply to 34932)

User<5660798371>: why? (reply to 34933)

&rey: Because this looks as a worthwhile footstep. (reply to 34934)

idkravitz: Gm, is there any better way to ensure tx has been mined (included in block) than polling getTransactions? If no, is there a way to get hash of tx on sendXXX methods? I don't get why there are Promise<void>'s on every send method while at least it could return the tx's Cell hash

— 2023-09-23 —

6Sensei: It kind of sucks US residents can't get the TON wallet..👎

6Sensei: Is there a way around it...I tried VPN, but it didn't work.

Dmitry | backend4you.ton: Browser plugin wallets? (reply to 34938)

User<6004648244>: need help again  I'm trying to build a TACT contract using the npx blueprint build and am getting npm ERR! could not determine the executable file to run  What is the reason for this and how to fix it? I use Ubuntu for work

User<5660798371>: go to the project directory (cd YOUR_DIRECTORY) (reply to 34943)

Meta: hi how can I deploy a token

Daniil: minter.ton.org (reply to 34945)

Meta: how can I deploy with different code (reply to 34946)

Daniil: change the code and deploy using Blueprint SDK, for example (reply to 34947)

Mr. Coder: HelIo everyone!  Does anyone have a ready script for checking tonProof on PHP after authorization using Ton Connect?

&rey: I don't. You can reimplement algorithm from Python (https://docs.ton.org/develop/dapps/ton-connect/integration#connection-using-tonproof). (reply to 34949)

idkravitz: sup, can someone tell me on how to watch tx lifecycle. I mostly interested in "sent", "complete" and "failed" states

&rey: Please note that TON transactions are entirely different from Ethereum ones. In TON, transaction happens in response to incoming internal or external messages (except for system contracts), and may include changing contract state or/and sending outgoing messages. (reply to 34951)

idkravitz: No, I mean the ones user sent from thier walletcontracts (reply to 34952)

idkravitz: I saw in tutorials a workaround with seqno, but it's unreliable in case of multiple txs

idkravitz: ok, but can I somehow determine that the message I sent was complete, failed or still pending? (reply to 34952)

&rey: You can lookup transaction by the incoming message. https://toncenter.com/api/v2/#/transactions/get_try_locate_tx_tryLocateTx_get (reply to 34954)

&rey: By the way, in most cases you can locally emulate transaction to check whether it will fail or succeed.

&rey: (I'd recommend using https://www.orbs.com/ton-access/ interface for downloading contracts data then.)

idkravitz: yeah, but lets imagine I do a swap with fixed slippage, when I emulate it its fine, but by the time my message reaches the contract someone can frontrun me and my message/tx may fail

&rey: Then it's insufficient to check user's wallet and you should check if the desired action is complete. (reply to 34960)

idkravitz: in case of Ethereum I would see it in receipt. What can I do in TON besides calling the toncenter API?

idkravitz: thats right, how can I check that my action is complete for instance in ton/ton-core js libs (reply to 34961)

Denis: https://tonapi.io/api-v2 i think you should try this api (reply to 34962)

&rey: These libraries don't provide a way to interact with blockchain; you still need some API to query it, and there are several options including toncenter, dton, tonapi and some API (in development) implementing liteclient-in-browser. (reply to 34963)

idkravitz: k, but I saw some dapps that somehow show action/transaction lifecycle awareness in UI, for instance in ston.fi. How do they achieve it? They rely on 3rd party API? (reply to 34965)

&rey: Yes, they most probably do. Or they can route the queries through their backend. (reply to 34966)

idkravitz: so technically they aren't dapps :) (reply to 34967)

&rey: Are there dApps in Ethereum, or they still use some HTTP interface to interact with blockchain? (reply to 34968)

idkravitz: the simple ones, like, "mint my useless NFT" are pure dapps, they depend only on injected provider (reply to 34969)

idkravitz: anyway, thanks a lot, I thought I was really bad at googling the docs (reply to 34967)

&rey: That is, they rely on wallet application providing blockchain interface? I guess this can be done in TON as well, and can be a #HackTONberfest_idea. (reply to 34970)

idkravitz: oh, and the last one - is tact ready enough to write something like uniswap on ton?

idkravitz: because I really tempted to drop the learning of FunC due to how messy the contracts endup looking with it

idkravitz: sweet, I'll give it a shot

&rey: The problem with Tact is that it's really bad at working with maps. Uniswap doesn't need any, to my knowledge, so should work great.

idkravitz: yeah but basically the wallet application provides the same API as any public RPC node in a network, in other words any enpoint in ethereum. Thats a high degree of self-sufficiency, and one should use 3rd party indexers (like the Graph) only when he needs some kind of complex history aggregation. In most common cases endpoints API is enough. I hope the TON would adapt the same richness of endpoints API (reply to 34972)

&rey: Actually, that's not quite good because dApps ought to be usable without connecting wallet whenever possible. Also, if mobile wallet app is connected, it has to be always online to provide information from blockchain.

idkravitz: some dapps use a fallback provider when wallet isn't connected, its just a random endpoint of free known public endpoints (reply to 34978)

&rey: Orbs ton-access does exactly this, but these endpoints are also in ORBS DAO and punishable for misbehaviour. (reply to 34979)

&rey: I could agree with the idea that Telegram application should provide access to TON for internal webviews, though.

idkravitz: or its a dedicated endpoint of the respective company that runs dapp, which yet again can be classified as backend and render dapp to be a non dapp)

idkravitz: so in a case when company shutdowns their endpoint their dapp may become unusable, the same may happen if toncenter decide to shutdown their API or restrict it by political views or other policies

idkravitz: and being Russian I can totally relate to that)

Resha X 🦉 🦆: l support  $TON From Egypt too

&rey: There is @tondev — Russian chat, by the way) (reply to 34984)

Alex: TOP 🔟 #Dapps by #weekly users !   Website | Blog  | Twitter (forwarded from TonRadar)

Coalus: Are there any TON UI kit?

Maxey: In the TON contract address, there may be two different addresses, one starting with 'E' and the other starting with 'k,' but they both point to the same contract address. Is the 'k' prefix indicating that the 'isTestOnly' flag is set to true for this contract?

&rey: Yes. And first letter being U indicates that isBounceable flag is changed. (reply to 34989)

Maxey: Thank you for answering！

User<6461782270>: ⭐️ Join the team of builders on TON × Telegram!  We're a small team of amateur devs, writers, and designers who've been building on TON and Telegram for two years. With bots like @CoinCrackerBot and @AudioCreatorBot live, we look forward to deliver even more amazing new things.  Who we're looking for:  ▪️Backend devs for Telegram bots and tApps, min. requirement: knowledge of Python or Go, databases, as well as some experience with Telegram-related development tools like the bot platform.  ▪️Frontend devs for tApps, min. requirement: knowledge of HTML/CSS, JS, and experience with frontend frameworks.  ▪️Smart contract devs on Tact, min. requirement: knowledge of Solidity or Python, understanding the key principles of / studying software engineering.  ▪️Writers for a media about TON, min. requirement: experience in crafting engaging texts, understanding the key principles of TON and DeFi.  Submit your GitHub or copywriting references to the project manager, and let's make this Autumn the hottest 🍁 (forwarded from Tonsider 💎)

&rey: Are you going to opt-in to Hack-TON-berfest? (reply to 34993)

Mr. Coder: i did it with chat gpt help 🙌 I fed him  phyton code and "go" code example and asked him to write an analogue of php It took a lot of time, but I did it Thanks! (reply to 34950)

— 2023-09-24 —

Ali: Hi guys. I'm building a game in Unity using tonplay SDK and when I'm running my tests inside Unity editor, everything works fine. But when I export the game to WebGL, it stops working and throws CORS error. Do you have any workaround to bypass this issue?

Tonex: Hi, everyone. There is a vacancy. We need a backend developer who has experience working with tone. It is desirable to have a portfolio. Official employment (contractual work). Write in person. Let's discuss the issues. There is a lot of work, the work is interesting. )

Coalus: backup -> backend (reply to 34997)

Tonex: Translator) (reply to 34998)

Ct guy: hello may i ask if there's a tonscan or something like that for ton?

&rey: https://ton.app/explorers (reply to 35000)

Ct guy: ohh thank you!

User<6028248863>: hello, does the test environment of telegram bots work ?

User<6028248863>: i can't log in following this https://docs.ton.org/develop/dapps/telegram-apps/testing-apps

P A R S A: is there any group for bot developers and not cryptocurrency developers? or here it is mixed of both?

Petr 🇷🇺: Not bots, only ton crypto (reply to 35006)

Dmitry | backend4you.ton: @twa_dev (reply to 35006)

Эдик: Can anyone help me understand the tokenomics of the project?

— 2023-09-25 —

&rey: https://ton.org/mining has overview. (reply to 35010)

Howard: let's have a API tutorials? (reply to 34965)

Απόλλων: HI, how i can convert Address or hex of Address  to bigint in JS ??

Daniil: Be careful with @andrew83xmr 👀 (reply to 34916)

Ceren: May I have a suggestion for a tool to check contracts on TON against honeypot and other risks? (I do not know if there already exists such tool).

Chak: Some contracts add their sources to https://verifier.ton.org/  Same time https://tonviewer.com/ might provide source code of the contract (reply to 35015)

Ceren: I meant a tool for average users, not developers. Average investor may need to check creatibility of a Token, or else. There is a recent incident which involves tegro finance. The platform is unavailable now, and ppl lost their funds. (reply to 35016)

Chak: I am not aware about any contract explorer which might be friendly and clear enough for regular (non-tech) user.  It may be more userful to follow unbiased researchers or follow project ratings to help in DYOR. For instance there was a review for Tegro (reply to 35017)

Borys: Hey Guys! Do you know how I could get 10 000 test TON to run a validator on testnet?

Thilak: {     "image": "https://gold-exact-termite-826.mypinata.cloud/ipfs/QmXrSEAXam3nLangGFputyUMNEt8piEjao2zdz7fbhQuc8",     "name" : "My Certificates",     "description" : "My Certificate collections",     "social_links" : ["https://github.com/iamrakki/Tact-NFT-Lesson7.git"],     "marketplace" : "getgems.io" }   this is my NFTcollection file   how to import the NFT's

John: Can we make a bot to connect to the built-in Telegram wallet and send transactions? I am reading the tutorials, they only show how to connect to Tonkeeper and use a QR image to scan to connect.

Howard: tonscan.com ? (reply to 35017)

Ceren: It is a great tool, thank you. But what I have in mind is something similar to the one in the image (reply to 35022)

Tasteam: Hey guys! Looking for a smart contract developer for Staking NFT. Write me please. Thanks!

0xSynon: Hi there 👋I’m new here, what resources would you recommend to a developer to start prototyping apps on The Open Network ?

&rey: https://docs.ton.org and tutorials there. (reply to 35030)

researcher: https://ton.org/en/mining (reply to 35026)

User<5841544362>: I am a Japanese remote full stack developer working as a freelancer for Switzerland's company. Now I am looking for new opportunity for remote full time job. Who need a full stack developer?

Mila: Hello comrades. Can you tell me what is the best marketing to use for TON?

User<5841544362>: Of course, I have experience about Ton chain (reply to 35042)

Behrang: Won't be enough. You'll need at least 50,000. (reply to 35019)

— 2023-09-26 —

Maxwell: Hi, guys,  FunC and Tact, which is suggested in long term view?

Anthony: Only this https://www.tonnel.network/ (reply to 35047)

Anthony: Tact is a new language focused on simplicity. Tact is in Release Candidate stage at this moment.  FunC is a language for deep dive into TON development. It is ready to production. (reply to 35048)

Jamie: hello there, want to ask what should I do to receive the emitted message from the smart contract in my test case?

Anthony: https://ton.org/dev?filterBy=developSmartContract https://blog.ton.org/func-journey (reply to 35052)

محمد: How to make a jeton ??

User<6004648244>: https://minter.ton.org/ (reply to 35055)

裸裸: hello sir?

裸裸: I run the tongo demo but the transcation is failed.

裸裸: https://testnet.tonviewer.com/transaction/6cbfc57c078fc3bff0b4c59a955c7f5edfb5f38ef6e3b2f809ac674aa2584d60?hash=3a42c77ddc268d93dba2eaae85b8cc3a51b22e6ecc4f35c159cd313465e6802e

裸裸: why it is failed? do you know?

裸裸: this is also failed. https://testnet.tonviewer.com/transaction/0e3a11d8a04c470cf53d59f68f533b0bb3e99161a2ee73a68b680d84bfcaf9e0?hash=30b1933a41e167ba595197fcabaedf68856f578f90a2420ca723f4709dee3840 but why? what means  Status: uninit → uninit.

BeAaRay 🦴: any open source code reference with nft minting like we see on evm before?  although i see on ton official docs its getting me confused and need another reference. thank you 🙏

james: hey everyone 👋.  looking for some ppl to join promote the nft project that i develop in x and telegram. we have some prizes in NFT & whitelist spot and other stuff.  please contact me if you're interested

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hello friends, I have a web application in dotnet core, which is microservice and mult-itenant. I want to add the ability to login with TON wallet. Its authentication system is openiddict outh 2. Is there an educational article on this topic?

&rey: Here's an example how TON login is implemented: https://docs.ton.org/develop/dapps/ton-connect/integration (reply to 35066)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I want to authenticate the user and set the permissions based on the database in the token returned from the server. So I need something unique like the public key of the wallet. Maybe I'm wrong. What unique information is available after the user's login to enable server-side authentication? My application consists of several microservices and is SaaS (multi-tenant). This token, which is generated after login, must contain the necessary information about whole system (reply to 35067)

&rey: User's public key, wallet address, his signature on TonProof. (reply to 35068)

&rey: The manual shows how to check that TonProof is valid (on server side, of course).

&rey: Also, you should note that other servers can potentially get user's TonProof for your site if they use your manifest and user isn't careful enough to check that domain he connects the wallet to is incorrect.

Timоthy: Hi devs. I'm just starting my web3 dev journey with TON. I've used Telegram for a long time but never really looked at TON.  I'm a fullstack but i've written smart contracts only with solidity this will be my first time using func. My idea is to have a smart contract handling this process: someone sends TON to my wallet and in exchange receives another TON based token. The amount is calucated with a use of a specific algorithm. Is there any example that implements something like this in the docs that i can learn from? Thanks a lot. And one more question is there an example that shows how to connect the ton space beta wallet using ton connect in a telegram web app?

— 2023-09-27 —

ETON: hello

ETON: Hi all, can Tonkeeper link to the Ton test network and where do I switch networks?

sd: go to settings, swipe down then tap 3+ times on ton crystal it will open dev menu (reply to 35075)

ETON: Thanks! (reply to 35076)

Dev: Can you clarify what you mean by another TON based token?  What sort of token? (reply to 35073)

&rey: *that is, jetton or NFT? (reply to 35078)

&rey: If you want jetton-TON swap, you may have a look at WTON (wrapped TON) and DEXes.

&rey: If you want NFT-TON swap, the contract is called NFT sale contract.

Timоthy: Basically a token I've minted on TON. So Jetton. (reply to 35078)

Max: Hello everyone! I'm late to the party but only just discovered TON and would like to learn to build on it. But I have a question, I've tried to access the TON docs at https://docs.ton.tg but my browser gives me a "Server Not Found" error. Is the server temporarily down?

Coalus: docs.ton.org - original TON documentation (reply to 35084)

Max: Oh, thank you! But in that case the links at ton.tg are all pointing to the wrong URL 😅 (reply to 35085)

Андрей: https://t.me/tondev_eng/34770 (reply to 35086)

Max: 😱 (reply to 35087)

Matan: Is it possible for a validator to create more than 2 pools? For example lets say a validator has 2.7M TON staked. Can he create 3 pool of 0.9M each (max stake per election) so that he can ensure all the stake is being productive? Also what is the benefit of having a large or small max factor? Thanks

&rey: You'll have to use an additional machine with second validator node. (reply to 35089)

Matan: It seems that TON whales seems to have 6.5M ton in one pool and are sending lots of 350k ton txs to the elector contract which all are being accepted and are active. I am just wondering how this is possible.

Javad: Where was this tutorial published ? (reply to 16520)

User: Is that possible to send long message from smart-contract?  p.s. it isn't static, i need to create long messages dynamically, for example from for loop.

&rey: Yes, you just need to create chain of cells. (reply to 35094)

Javad: Do you know the link of storm trade twa bot ?

User: How I can pack it into for-loop?  In official docs we have this example of realization:  cell body = begin_cell()     .store_uint(0, 32) ;; zero opcode - simple message with comment     .store_slice("long long long message...")     .store_ref(begin_cell()         .store_slice(" you can store string of almost any length here.")         .store_ref(begin_cell()             .store_slice(" just don't forget about the 127 chars limit for each slice")         .end_cell())     .end_cell()) .end_cell();  But I couldn't understood how I can add new cell in ref in cell which inside another cell by loop. (reply to 35095)

&rey: You can see an example in https://github.com/ProgramCrafter/tsc4/blob/main/contracts/4.fc or in TSC4 solutions generally. (reply to 35097)

User: Thank you (reply to 35098)

ARS: В каких эксплорерах можно собственный гет метод вызвать?

Slava: tonviewer (reply to 35100)

Jack 🥕: is there an easy way to create a new wallet which lives on my filesystem for development

&rey: Yes! For instance, you may generate new mnemonic (with TonWeb), save it to file and use in scripts. (reply to 35102)

Mikhail: Hello everyone, does anyone have example of calling estimateExternalMessageFee method? i dont really understand what i should pass in initCode and initData fields

&rey: If you aren't initializing contract, likely null. (reply to 35106)

Mikhail: dont really understand how its works:  body: beginCell().storeUint(653058771, 32).storeUint(111n, 32).storeUint(0,32).endCell()  calculated: 0.000083852  body: beginCell().storeUint(653058771, 32).storeUint(111n, 8).storeUint(0,8).endCell()  calculated: 0.000083852  Why does it costs the same amount of money, if i am writing different amount of data? (reply to 35107)

Mikhail: Moreover, when i am really calling this method on-chain, it takes much more gas to pay

&rey: Do you call it by internal message? If so, you need to estimate fees in different way — likely with sandbox. (reply to 35109)

Mikhail: like just running tests in sandbox and watching the amount of ton i spent?

Mikhail: but what will happend if gasprice will be bigger?

Mikhail: just trying like that, is that means internal msg? (reply to 35111)

&rey: sandbox can use actual configuration values. (reply to 35113)

Mikhail: Yep, thanks just checking in sandbox and it's basically almost the same value as it's required in mainnet. TY ❤️ (reply to 35111)

&rey: How do you send the message to the contract when not-testing? (reply to 35114)

Mikhail: using wrapper from generated tact code and tonConnect. basically we didn't know how much value we need to send, so we we're trying to use almost any value. now i know how much i need to send, but for safe purposes i'll send a bit more. like 0.001 TON more than i get from tests (reply to 35117)

Falco: Hi guys, is there any prometheus exporter that can be used with a TON node? (validator)   I am trying to add monitoring to my validator node. I've seen this one: https://github.com/tonwhales/validator-monitoring but it's quite lacking in terms of metrics being exposed.

lavenjer: hi, everyone

Calvin | Impossible: gm!

User<6237448962>: Hi , everyone . I'm motivated and result oriented software developer with rich hands-on experience of web app development and blockchain ,AI field. I have experience of building DEX,CEX,Bridge,Lending/Borrowing,Staking,Farming etc on various chains . if there maybe some works i can be of any help for you , pls reach me out .ty

FreesolGames: Hey guys where looking into games with ton,any suggestions on where we should look to get some info regarding that ?

— 2023-09-28 —

Another: Does someone know why this error can occur in blueprint tests?  bitLength is too small for a value 1695861546978. Got 32

Michele: change length of created_at to 64bits

Another: It doesn't help( (reply to 35126)

ETON: Hi,all， who pays the rent of the Jetton wallet contract?

&rey: Anyone who interacts with it (incoming jetton transfers / user's operations). (reply to 35129)

ETON: Is it directly transferred to Jetton wallet via value in an external message transaction, if wallet 1 transfers 10 Jetton Token A to wallet 2 while only transferring one day's rent to wallet 2's Jetton A Wallet contract, after one day has passed, is wallet 2's Jetton Wallet contract deleted, and are the 10 Jetton Token's destroyed? (reply to 35130)

&rey: Actually, storage fees are small enough + contract needs to reach -0.1 TON to be frozen or -1 TON to be deleted. If jetton wallet gets to -1 TON, yes, corresponding jettons are lost. (reply to 35131)

&rey: As far as I remember, that would take at least a few months.

&rey: And a small correction: each message is its own transaction, so "external message transaction" doesn't carry any value. (reply to 35131)

ETON: Can “internal message transaction” carry some  value

Tim: Yes (reply to 35135)

Daniil: Many years*  Don’t forget that when the contract is frozen, it’s whole state is replaced with a single 256-bit hash (reply to 35133)

Daniil: Your cell becomes too large. There’s a limit of 1023 bits per cell, so you should probably add a new ref to the cell with the data that doesn’t fit (reply to 35128)

G: Привет , Тебе не подсказали ? (reply to 34146)

Павел: Привет. Посоветовали обычный текстовый файл, который в гитигноре лежит (reply to 35139)

G: Как считаешь хранение бэкап ключа от кошелька в фразе из 24 слов это вообще гарант безопасности ? (reply to 35140)

Daniil: This is an English chat. Russian TON Dev: @tondev

Gunnar: What happened to the editable NFT TEP ?   it's linked in the old repo, but the PR isn't in the new repo

Magomed: Hi everyone! What is the best way to aggregate on-chain data in TON? Is there something like thegraph? Lets say I have big smart-contract and I need to collect all events and do some math on top of them.

Daniil: It’s a very complex and general question and the answer mostly depends on the exact use case (reply to 35144)

Magomed: I can give you more precise example. Lets image I have lending protocol or perp. I need to collect all users positions/debt and store them offchain, so I can effectively do some math on top of them and be able to liquidate them in time. Lets say all events that I need are emitted in 1 contracts, so I just need to monitor 1 contract

Daniil: You want to parse some data from smart contracts using offchain tools? (reply to 35146)

Magomed: Yes. If you need details - I need to store all ext out msgs (of my smart) in my db (reply to 35149)

Daniil: Just process all transactions of that smart contract (reply to 35150)

Magomed: Thats pretty common case actually, I am sure there are some tools for that

Magomed: Soooo, just SDK ? (reply to 35151)

Daniil: I’m not sure if there are ready-to-use tools for that. (reply to 35153)

Magomed: Ok, I ll look in SDK docs, thx for help

Magomed: @Gusarich 1 more question - is there any preferred SDK lib here ? https://docs.ton.org/develop/dapps/apis/sdk maybe some are outdated?

Daniil: For js/ts I’d recommend using @ton/ton (github.com/ton-org/ton) (reply to 35156)

Fly: Hello there, is there any way to get the transaction result from blockchain using type script

N: Hello Devs,  is there any possibility to change the metadata url after creating the nft ??  thank you

&rey: Yes, for editable NFTs/collections. (reply to 35163)

N: thanks for replying, do you recommend a tool to edit the url metadata ? (reply to 35164)

&rey: Actually, I haven't worked with any. (reply to 35165)

N: thank you

— 2023-09-29 —

Jhunie Ray: Hello,why does tonconnect.sendTransaction doesn’t show Jetton amount in tonkeeper?

Maxwell: When would be possible to sign tx within TG?

Qwerty: How to delete an account in tonkeeper?

Daniil: what do you mean by that? (reply to 35170)

Qwerty: I just want to delete my account in the tonkeeper wallet, tell me how do I do it? (reply to 35171)

Daniil: you mean log out from it? (reply to 35172)

Qwerty: Not to exit but to delete (reply to 35173)

Daniil: Why would you want to do it?  Anyway, Tonkeeper don’t have such functionality. (reply to 35174)

Ashish: What you call a “tonkeeper account” is a blockchain wallet. You can't delete it. No way. All you can do is press the logout button and forget about its existence (reply to 35172)

Daniil: Well, you can delete it by sending a message with mode 160 (reply to 35176)

Qwerty: I suspect that an outsider has login details, please tell me what I can do to keep me safe (reply to 35175)

Daniil: Create a new wallet and send all the funds and collectibles there (reply to 35178)

Qwerty: I understand you, thank you very much (reply to 35179)

Ashish: I haven't worked with blockchain as a developer, so please answer the question.  Does the tone blockchain allow you to clear the entire history of working with a wallet with one command send_raw_message? I doubt. I assume that it blocks the address or resets it. This is not equivalent to deleting your account. (reply to 35177)

Slava: Actually you can delete your wallet in tonkeeper settings (reply to 35172)

Daniil: Send mode 160 sends the whole balance and deletes all the data of a blockchain account. History may remain visible in explorers. (reply to 35181)

Ashish: That's what I'm talking about. What you call deletion is, in fact, not such. This is simply resetting the address while preserving the entire history of actions🤷‍♂️ (reply to 35184)

Daniil: And how is this not deletion? (reply to 35185)

&rey: History isn't guaranteed to be saved for more than one week. Though, there are archive nodes which keep the full history of blockchain. (reply to 35185)

Ashish: All data associated with your wallet remains on the ton network. You simply lose the opportunity to use it. Almost the same thing as throwing out the seed phrase (reply to 35186)

Qwerty: Great, thanks (reply to 35183)

Daniil: The data is being deleted. The history may remain on the historical nodes. In case with regular wallet smart contracts -> you'll still be able to use it by simply activating the wallet once again. And for custom contract, it'll lose the code and data. (reply to 35189)

Ashish: We dont talk about custom smart contracts) I will try to convey my idea as simply as possible. I have a database. I select the entry. I enter the DELETE command. This entry no longer exists. At all. This is called deletion. I have a blockchain. I choose an address. I am sending a command send_raw_message from it. The wallet continues to exist. This is not called deletion. (reply to 35191)

Daniil: Wallet doesn't continue to exist after sending a message with mode 160. Until someone deploys it again. (reply to 35192)

Aydin: And now I have a question: does this "Delete account" option in Tonkeeper do the same thing as sending a message with mode 160, as @Gusarich explains? (reply to 35183)

Slava: As far as I know, yes, it sends msg with 128 + 32 mode (reply to 35195)

Tim: No??? (reply to 35196)

Slava: No? (reply to 35197)

Tim: Where does it send money then?

Aydin: Crucial question! (reply to 35199)

Tim: It's really not

Slava: Well, think someone should check it in testnet

Tim: It just doesn't delete anything on blockchain

Aydin: As this menu shows, seems that it actually deletes money? (reply to 35202)

Anton: money is on the blockchain, it's not deleted.  It's like you're just throwing the key from your safe into a volcano. Valuables are still in safe but no one can open it  [P.S. looks like I'm wrong] (reply to 35204)

Daniil: you can (reply to 35205)

Daniil: ^ (reply to 35191)

Tim: You are asking about that for hour already. Creating new account and testing takes 10 minutes

Aydin: Oh sorry for that 🙈 (reply to 35210)

Tim: You don't need to be sorry. It's just ineffective and we already answered question

Mateusz | Nethermind: How could I generate the restricted-wallet via https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/README.md? Do I have to create it's .js implementation?

User<5727115339>: Is the username still popular for sale, guys?

Roman: 🚀 Hey Devs!  We've rolled out the TON Cookbook - a collection of hands-on examples on blockchain coding across various languages and SDKs (ton-js, tonweb, tonutils-go, TonTools Python). 👨‍💻👩‍💻  🤔 Think there's something missing? Spotted an error? Or maybe you have a cool idea? Let's make the cookbook even better together!  👉 Reach out directly to @SwiftAdviser or simply create an issue with just a click using the TON Docs Wizard bot.  And if you're up for some deep dives into contributing and want to join the discussions, hop into the TON Docs Club!

Falco: I'm trying "runmethod" but I keep getting an error:   Unexpected Status [Error : 0 : Option 1 was unrecognized]  I am trying different calls but they are all the same. (this is on testnet)   What am I missing? This is one of the calls I'm trying:   lite-client --addr 127.0.0.1:43503 --pub /var/ton-work/keys/liteserver.pub -c "runmethod :-1:3333333333333333333333333333333333333333333333333333333333333333 active_election_id"  I also tried without -1 but then it says the address is invalid.

Liza: 🎉 After putting a great deal of effort into the course, we have finally reached its completion! Enjoy! </>  TON Blockchain course  This course is dedicated to development on The Open Network (TON) blockchain. We've designed it to be highly practical, allowing those who complete it to work on their own projects on the TON blockchain or find employment with existing startups and funds.  The course is created with the support of partners such as:  — Certik – leading security-focused ranking platform to analyze and monitor blockchain protocols and DeFi projects. — TON Apps – leading commercial infrastructure company for TON. With Tonkeeper and TonAPI we are offering unmatched integrated experience for businesses and consumers. — TON Foundation – non-commercial organization empowering builders and serving the needs of TON community. — LANDAO – Web3 studio that provides blockchain development, technical and investment analytics, launches educational projects and events. We assist crypto projects and ecosystems to develop and shape the new future. — Souldev Network – one-stop access to decentralized recruitment and personal development.  Course: https://stepik.org/course/176754  Learn. Create. Share with others.  Subscribe to our channel: @ton_insights  If you want to become a contributor in preparing posts for the channel, write to: @Vin_Danila  #TON #Course #Certik #LANDAO #Tonkeeper (forwarded from TON Insights)

Justin: How are keys stored at rest through TON?

Daniil: What do you mean? (reply to 35218)

Aydin: I just tried to verify your point. Not to flood here, but to clarify things for other newcomers like myself:  🟡  I created a wallet on testnet and put some coins in it. Then, tried to delete the account on Tonkeeper Web. Also, imported the wallet on the mobile app and tried to delete the account there. And during the whole process, controlled the status via tonscan. Even when both wallets were deleted, I was able to send some amount to that address successfully, and the transaction was visible in tonscan.  ➡️  Result: In all cases, the wallet was deleted APPARENTLY ONLY FROM THE LOCAL DEVICE. No change was observed on the blockchain (via tonscan).  ➡️  Conclusion.  Actually, I couldn't distinguish (with certainty) between this behavior of the "delete account" option in Tonkeeper and that of "sending a message with mode 160," which, as @Gusarich explained, modifies the data on-chain (which is still vague for me as I haven't experimented it yet).  Perhaps I had to wait for, say, more than 1 week to observe different results? Most notable of all was the ability to send money to the wallet even after deletion which is an indicative of the active state of the wallet.  PS: To get a clearer picture, I tried to search any kind of delete command within ton-blockchain.github.io/docs, but I couldn't spot the relevant material unfortunately. Also, looked at https://docs.ton.org/develop/smart-contracts/messages#message-modes which describes mode 160. Here, it seems that mode 160 must be something different from "delete account" in Tonkeeper. (reply to 35197)

Anthony: Nope. As I know it was Apple’s request to have a “delete account” button 🤦‍♂️ (reply to 35195)

Daniil: Trust wallet doesn’t have such option 🤔 (reply to 35222)

Eugene: 🤔  Not sure how does that work (reply to 35223)

Aydin: Now, after my experiment with Tonkeeper, I guess this too, must operate on the local device only? (reply to 35224)

Aydin: A reasonable suggestion for wallet makers could be to change the text of their "Delete account" buttons to something like "Delete account on this device" to avoid confusion

— 2023-09-30 —

Yashar: Or "forget account"

محمد: i want to get connected to a contract with react, how can i do that ?

Daniil: https://docs.ton.org/develop/dapps/ton-connect/react (reply to 35232)

Slava: hi! maybe someone here have experience how to modify wallet connection modal in @tonconnect/ui-react library? What is the best approach to add some custom button to this modal?

&rey: I think the best way is to add the files with modal to your project and fix them there. (reply to 35234)

Ray: Hi which library is the best for smart contracts in ton python?

Tumin | Wagmi11: https://github.com/psylopunk/pytonlib https://github.com/XaBbl4/pytonconnect  I suggest this (reply to 35236)

Maxwell: Suppose my message call order is like External World -> Contract A -> Contract B -> Contract C: 1. Would the messages be build into one block or possiblely into multiple blocks? 2. what if the last message call(B->C) failed, how could the state of Contract A and B be reverted?  Can anyone explain it to me? Still confused about the messaging mechanism in TON.

Tumin | Wagmi11: https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees  hope this helps (reply to 35238)

Daniil: 1. They can possibly be split into several blocks (especially if the contracts are in different shards)  2. When a transaction fails, it bounces a message back to the sender, so that smart contract can handle the error case (reply to 35238)

Tumin | Wagmi11: https://t.me/tontech/80 (reply to 35236)

Maxwell: So it's not quite feasible to build latency/state sensitive cross-contract applications in TON, right? Like DeFi?

Daniil: It’s all possible, just can be a little bit harder to architect (reply to 35242)

Daniil: I think the only thing we can’t have here are flash loans

Maxwell: For case 2, the bounced message might get back to contract A a few blocks later, which leads to my contract A state inconsistent for short period?  Put it in another way, the exception handle logic would guarantee TON blockchain to achieve eventual consitency. (reply to 35240)

Maxwell: Yes, quite tricky to reason about the logic for me now. (reply to 35243)

Daniil: State may change by other transactions while the bounced one travels back. Same for the regular messages that contracts send to each other. (reply to 35245)

&rey: Generally, you need reentrancy consistency guarantees. Eth contracts also require them, but sometimes developers just use workarounds like a lock. (reply to 35245)

&rey: So, the state of your contract should be consistent at any time.

Maxwell: Not expect flashloan magic in TON, but would like to build complex DeFi Lego upon it, so it leads me to above questions. (reply to 35244)

Maxwell: Take  jetton tranfer as a example, Jetton-wallet-A reduced by 10 jettons at logic time n, while Jetton-wallet-B failed for some wired reason(Like blacklisting A), but before the bounced message be handled at logic time n+3(3 blocks later) and revert A's balance. Between logic time n to n+2, the state of A is not quite consistent right? (reply to 35248)

&rey: The state is consistent, as it doesn't allow to do any unexpected operation. Until transfer "fully failed", including that jettons returned, user shouldn't be able to use those sent jettons for anything else. (reply to 35251)

Maxwell: I get it.  Before A get the response message from B, contract A is locked preventing from further state operation, right?

&rey: You can do that, but it's not a best practice. (reply to 35253)

&rey: Jetton wallet, for instance, allows to send any jettons remaining on balance (in particular because it doesn't expect response on successful transfer).

&rey: And bounced message with K jettons just adds K jettons to balance.

Maxwell: Yes, but if some other contract try to read the my Jetton-wallet-A between logic time n, n+1, n+2, it would get the wrong balance, doesn't it? Only after n+3, the reverted operation would correct the A's balance.

&rey: That's why there is no way to call get-methods of other contracts. (reply to 35257)

&rey: This pattern is called "value-carrying messages": some part of jettons are stored not inside contracts but inside messages between them.

Daniil: https://docs.ton.org/develop/smart-contracts/guidelines/get-methods#invoking-get-methods-from-other-contracts

Maxwell: It's like two POSTs between contracts instead of one GET to exchange state info.  Still not quite clear about the implication of async feature for complicated multi-contract applications, but very appreciate for your help. Gonna dive deeper. (reply to 35259)

Mahdi: Hello guys. I was wondering we have any ERC20 tokens in Ton network?

Daniil: Yes, but you usually don’t need such actions (reply to 35261)

Daniil: Jettons (TEP-74 standard) (reply to 35262)

Ray: Could anyone please explain these different addresses? print(new_wallet.address.to_string(True, True))     print(new_wallet.address.to_string(True, True, True))     UQBbvk1HrODbRggHD2B6uMTq8hCWsXcN-rW-h31E5bks1ydI EQBbvk1HrODbRggHD2B6uMTq8hCWsXcN-rW-h31E5bks13qN

Maxwell: Could be usual in DeFi apps? Read states from different contract on chain. (reply to 35263)

Daniil: Bounceable & non-bounceable addresses  https://docs.ton.org/learn/overviews/addresses#bounceable-vs-non-bounceable-addresses (reply to 35266)

Ivan: Hello there! Have Somebody issues with NextJs 13+ (AppRouter) when update language option via setOption hook from tonconnect ui?

Daniil: What kind of states do you need to read from your smart contract?  Here you usually need to spend some time designing architecture of smart contracts so that they will work efficiently in asynchronous and distributed environment of TON blockchain. It’s harder than on synchronous chains, but it allows TON to scale almost infinitely (reply to 35267)

r4mze5: Hello guys, why don't I get different addresses when importing the wallet that created the TON SDK? Tried all versions

Mahdi: Thanks Daniil (reply to 35264)

Maxwell: I get the tradeoff. (reply to 35270)

Maxwell: Gonna read codes from open sourced FunC project.

Daniil: This may help: https://docs.ton.org/develop/smart-contracts/examples  You can also check some of my repositories, like “airdrop”, “fundraiser” or “jetton-migration”: https://github.com/Gusarich?tab=repositories (reply to 35274)

Maxwell: thx!

User: https://pastebin.com/kJb0JXya  Hello. I have a trouble in cell with long message. I using this contract as sample for creating mine: https://github.com/ProgramCrafter/tsc4/blob/main/contracts/4.fc  In sample contract it already receive full message which set in tuple and then using var text it set headers in tuple. In my case, I have dynamic text which creating using loop, how i can put headers there, if I don't know full message in the beginning?   p.s. Maybe it's possible to convert tuple to message and then use it.

Daniil: https://t.me/hack_ton_berfest_2023 (reply to 35279)

Ray: Is it possible to get wallet balance from address in TON python? If so, how do I do that? Thanks.

User: You can do it using api services like tonapi or toncenter (reply to 35283)

Mujahid: import { TonClient, WalletContractV4, internal } from "ton"; import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";  // Create Client const client = new TonClient({   endpoint: 'https://toncenter.com/api/v2/jsonRPC', });  // Generate new key let mnemonics = await mnemonicNew(); let keyPair = await mnemonicToPrivateKey(mnemonics);  // Create wallet contract let workchain = 0; // Usually you need a workchain 0 let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey }); let contract = client.open(wallet);  // Get balance let balance: bigint = await contract.getBalance();  // Create a transfer let seqno: number = await contract.getSeqno(); let transfer = await contract.createTransfer({   seqno,   messages: [internal({     value: '1.5',     dest: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',     body: 'Hello world'   })] });

Mujahid: can some one guide me is this script is correct for sending tokens to multiple  addresses in only one transaction (reply to 35285)

Mateusz | Nethermind: In the docs it says: If you are running a validator in the "mainnet", it is a good idea to use more sophisticated wallet smart contracts (e.g., a multi-signature wallet).  Are there any known validators using msg? Seen only v3 wallets being used as per MyTonCtrl defaults.

Another: Helped) (reply to 35138)

— 2023-10-01 —

User<6247944943>: how do we pop the emit log in test?  using @ton-community/sandbox"

Tim: It's wrong argument. We can't use get methods not because they're useless. There are a lot of cases, when such calls can greatly reduce contract complexity. But it's not possible in ton because of sharding architecture.  To call get method on contract A from contract B, validator needs to know exact state of both of them and acquire lock. But it's not always possible, because contract A can be on different shard from contract B and validator of contract A may not even know state of contract B, let alone acquire any locks. It's a tradeoff that allows scalability, but changes way you interact between contra ts. @bitrocks01 (reply to 35270)

User<5101913003>: tf is goin on here

User<5101913003>: evernode is shit

User: Someone have Error code: 400? I couldn't find it in tvm errors.  https://tonviewer.com/EQDd-kzvoSyZIGQR5WeyPEjDqV2CFn8njY3_q-VrNN_nOuD7/transaction/baac4e525ff8f4388ca9a94aa37d9042e4c7966c7bbe462821c9f825bb24d534?hash=4b86e115336d9aed016e000ba2733f2c1d2381ee4c3a804a5f0658f610783157

Dmitry | backend4you.ton: It is thrown by contract code itself. It checked something and didn’t like it, so threw error. (reply to 35294)

Ray: Hi what does the wallet status mean? I created a new wallet address from Wallets.create(WalletVersionEnum.v3r2, workchain=0) and deposited some TON into it but still the status is inactive on tonscan

Andrew: to "activate" (initialize in fact) your wallet - you need to send outgoing transaction (reply to 35297)

0xHowe: Hi guys, why I can't switch testnet when I click the version of Tonkeeper 5 times fastly. Does it still work?

Ray: What is state_init? Can't really understand it. Could anyone please explain what it does here? Thanks in advance.     new_wallet = create_wallet()      state_init = new_wallet.create_state_init()['state_init']      wallet = import_wallet(my_mnemonics)      boc = wallet.create_transfer_message(         to_addr=new_wallet.address.to_string(),         amount=to_nano(0.05, 'ton'),         seqno=1,         state_init=state_init     )['message'].to_boc(False)

Daniil: StateInit contains code and data of smart contract, it is required for the deployment (reply to 35300)

Ray: What if I just want to send money from one wallet to another? Do I still need it?

Daniil: No, you don’t (reply to 35302)

0xHowe: Can anyone rely me, I just want to switch into testnet (reply to 35299)

🅰🅻🅰🅽: It’s still working! Maybe you can restart your application and try it again. (reply to 35304)

0xHowe: I find the problem, it should click the logo, not the version.

Ray: Hi I'm getting the error 'TonLib' object has no attribute '_tonlib_json_client_destroy' The code is pretty basic. Does anyone know how to fix this? Thanks. from ton import TonlibClient import asyncio  client = TonlibClient() TonlibClient.enable_unaudited_binaries()  async def main():     await client.init_tonlib()     wallet = client.create_wallet()     print('Wallet address:', wallet.address)     print('Seed:', wallet.export())  if __name__ == '__main__':     asyncio.run(main())

&rey: Is OpenSSL 1.1.1 installed? If this doesn't help, please use search in the chat. (reply to 35307)

Nikolay: Hello all! Anybody have any example of using tonutils-go library to create an ADNL server send getRandomPeers query, connect to peers and listen all broadcasted messages?

小影《各种业务》: Hello everyone, I’m new here and don’t know anything. Please learn more.

&rey: You may start here: https://docs.ton.org/learn/introduction (reply to 35313)

User<1250942880>: Hey guys!  I want create NFT item and have option of "NFT will have Multi Owner", any idea or guide

&rey: Maybe just put common NFT item in a multisig wallet? (reply to 35315)

&rey: Here's an example how to create data cell for collectionless NFTs, which you've also asked: https://gist.github.com/ProgramCrafter/704886244271f004319951a5e8eaa241 (reply to 35315)

User<1250942880>: Okay I'm looking on that now (reply to 35317)

User<1250942880>: can you give me enough idea how can  run this code because there are variables like NFT data, TON SDK ... (reply to 35317)

&rey: tonsdk is a Python module; code also requires a file that contains NFT image at line 81. (reply to 35319)

&rey: Line 91 specifies NFT name and 92 is its description.

&rey: After that, you need to put the data in some deployer like https://ratingers.pythonanywhere.com/deployer/. Code can be taken from some onchain NFT (https://tonscan.org/address/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW#source — "bytecode").

User<1250942880>: I got you now, Than you bro

Ray: I've searched but didn't really find a fix, have installed OpenSSL 1.1.1 (reply to 35311)

&rey: What is the full error message? If it's long, you can post it via gist.github.com. (reply to 35324)

Mujahid: how to create script to send tokens to multiple addresses in one transaction kindly guide me

&rey: Put several internal({...}) messages in the list. (reply to 35285)

Mujahid: is this script is correct (reply to 35327)

Ray: $ python example.py  Traceback (most recent call last):   File "C:\Users\Rey\tonTest\example.py", line 14, in <module>     asyncio.run(main())   File "C:\Users\Rey\AppData\Local\Programs\Python\Python39\lib\asyncio\runners.py", line 44, in run     return loop.run_until_complete(main)   File "C:\Users\Rey\AppData\Local\Programs\Python\Python39\lib\asyncio\base_events.py", line 647, in run_until_complete     return future.result()   File "C:\Users\Rey\tonTest\example.py", line 8, in main     await client.init_tonlib()   File "C:\Users\Rey\tonTest\venv\lib\site-packages\ton\client\tonlib_methods.py", line 67, in init_tonlib     wrapper = TonLib(self.loop, self.ls_index, cdll_path, self.verbosity_level, default_timeout=self.default_timeout)   File "C:\Users\Rey\tonTest\venv\lib\site-packages\ton\tonlibjson.py", line 92, in __init__     tonlib = CDLL(cdll_path)   File "C:\Users\Rey\AppData\Local\Programs\Python\Python39\lib\ctypes\__init__.py", line 374, in __init__     self._handle = _dlopen(self._name, mode) FileNotFoundError: Could not find module 'C:\Users\Rey\tonTest\venv\lib\site-packages\ton\distlib\windows\tonlibjson.amd64.dll' (or one of its dependencies). Try using the full path with constructor syntax. Exception in tonlibjson.__del__: Traceback (most recent call last):   File "C:\Users\Rey\tonTest\venv\lib\site-packages\ton\tonlibjson.py", line 133, in __del__     self._tonlib_json_client_destroy(self._client) AttributeError: 'TonLib' object has no attribute '_tonlib_json_client_destroy'  Exception ignored in: <function TonLib.__del__ at 0x000001C3E1AC9E50> Traceback (most recent call last):   File "C:\Users\Rey\tonTest\venv\lib\site-packages\ton\tonlibjson.py", line 136, in __del__ RuntimeError: Error in tonlibjson.__del__: 'TonLib' object has no attribute '_tonlib_json_client_destroy' (reply to 35325)

Mujahid: and how to deploy or run this script

&rey: Probably you have to use WalletContractV4R2 instead of WalletContractV4, and I don't see any other errors. (reply to 35328)

&rey: Could you restart the console and/or launch the program from Windows-native console (cmd/Powershell)? (reply to 35329)

Ray: Have tried that multiple times, still the same error

Ray: Do I have to add something to path after installing?

&rey: It should've added itself, I guess. (reply to 35334)

Mujahid: can you guide me how can i run this script to execute functionality (reply to 35330)

Ray: Will try to restart and see

&rey: You need Node.js and execute ts-node <your-script>.ts (IIRC) in console. (reply to 35336)

Ray: Still not working :( (reply to 35337)

Mujahid: is it necessary some other things that i include to run this script or just run and how i get access to token because my token is deployed on Ton network

Nikolay: Do you have any example of using your library to create an ADNL server send getRandomPeers query, connect to peers and listen all broadcasted messages? (reply to 23841)

Ray: Do you know any alternatives for TonLibClient? (reply to 35339)

&rey: I use ton-access/tonapi/dton APIs in Python programs, whatever is less buggy or more convenient to do certain request. (reply to 35342)

Oleg: You can find example of adnl server with overlays in tonutils-storage, it is a bit diff case, but if you understand the process you could adapt the usage   https://github.com/xssnick/tonutils-storage/blob/master/storage/server.go (reply to 35341)

Nikolay: Ok. I will try. Thanks a lot! (reply to 35344)

Ray: I think this is because of the fact that the library only works on intel CPUs :( Do you know how to do something similar to this in tonapi/other libraries?  boc = wallet.create_transfer_message(         to_addr=new_wallet.address.to_string(),         amount=to_nano(0.05, 'ton'),         seqno=1,         state_init=state_init     )['message'].to_boc(False)      client = await get_client()      await client.raw_send_message(boc)      await client.close() (reply to 35343)

&rey:   boc = wallet.create_transfer_message(         to_addr=new_wallet.address.to_string(),         amount=to_nano(0.05, 'ton'),         seqno=1,                                         # TODO: load actual seqno         state_init=state_init     )['message'].to_boc(False)  # using tonsdk   requests.post('https://toncenter.com/api/v2/sendBoc',  # TODO: replace with ton-access     json={'boc': base64.b64encode(boc).decode('ascii')}) (reply to 35347)

Ray: Thanks a lot!

&rey: The question is unclear... (reply to 35340)

Mujahid: how to deploy this script to be able to transfer tokens to multiple addresses

Mujahid: how can i access my token because my token is deployed on ton blockchain

Mujahid: is i include my token address in this script or not

Mujahid: or private key etc like these things

&rey: 1. Private key instead of await mnemonicNew(). 2. No need to include your own address.

&rey: 3. messages: [     internal({    value: '0.5',    dest: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',    body: 'Testing'  }),     internal({    value: '1.0',    dest: 'EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7',    body: 'Multi-message works'  }) ] (reply to 35352)

Ray: Could you please explain what is seqnum? (reply to 35348)

&rey: In a nutshell — number of outgoing transactions that the wallet has done. Used so that single request to send money out is not applied multiple times. (reply to 35358)

Ray: Got it, so each time I mention the number of outgoing transactions there?

Adam: Hi guys! Quick question. What's the recommended solution to receive TON payments in telegram bot? Is there any way to integrate with @wallet or TON keeper? I'm looking to collect payments in my mini app.

&rey: https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot (reply to 35361)

AYMEN: Does TON has child address?

Daniil: What do you mean? (reply to 35363)

Vasilii: I think he means the very first address. But that's just a guess (reply to 35364)

AYMEN: This: https://answers.ton.org/question/1490342895759134720/does-ton-blockchain-support-hd-wallets (reply to 35364)

AYMEN: But i didn't get a clear answer.

Ray: Does workchain mean testnet/mainnet?

&rey: No, it means basechain (0) / masterchain (-1). (reply to 35368)

&rey: I don't remember whether HD keys are just not implemented or have a technical problem, but you may use subwallet ids. (reply to 35366)

AYMEN: Thank you. (reply to 35370)

User<1250942880>: Why option of connect wallet not active (reply to 35322)

&rey: It's not implemented. Actually, it's HackTONberfest-eligible issue https://github.com/ProgramCrafter/ton-qr-deployer/issues/3. (reply to 35372)

User<1250942880>: Oh Okay but how can I connect wallet or use default wallet or else solution (reply to 35373)

&rey: You can use the first option and scan QR via Tonkeeper. (reply to 35374)

User<1250942880>: okay Thank (reply to 35375)

User<1250942880>: yes after scan qr and send balance to that wallet what is next step (reply to 35375)

User<1250942880>: https://testnet.tonscan.org/address/Ef-tMet2LmiPwbohV11DWbD5xIc4r2U-FmojMwC9xrKa6Q_C#transactions

Ken: Is there a semi-fungible Jetton standard ?

&rey: Your contract is deployed! (reply to 35378)

User<1250942880>: https://testnet.tonscan.org/address/Ef-tMet2LmiPwbohV11DWbD5xIc4r2U-FmojMwC9xrKa6Q_C#source

User<1250942880>: There is no any smart contact deployed as I saw (reply to 35380)

&rey: the state is "active"... (reply to 35381)

User<1250942880>: but it only an address not smart contract deployed based on my knowledge if you can explain the login  cause I have short knowledge on TON net (reply to 35383)

&rey: wdym? In TON any account is smart contract (including wallets). (reply to 35384)

&rey: If you mean that tonscan doesn't show code and data, that's a display problem (existing for a long time, though).

User<1250942880>: oh Okay Okay (reply to 35385)

&rey: https://docs.ton.org/learn/overviews/addresses (reply to 35384)

User<1250942880>: just now my problem now is deploy that contact of single NFT use that codes of py and WebDeployer (reply to 35386)

&rey: It seems that you've put the data in field for code. I'd recommend you to read through the documentation first to acquire a better understanding how to work with TON. (reply to 35372)

User<1250942880>: the prob is after deploy by qr code I see on scan it recieved TON TEST but code not deployed as contact and there is no any thing happen on console "in back"

User<1250942880>: To understand what i did,  I take edit on multinft.py "title, description and image and address will receive single NFT" after i run py to generate base64 code after that i past that on WebDeployer on first case then click on deploy with ton:// link and get QR code then I send Test TON but not thing happen and that code not deploy any contact  That why asking bro also thnak you for your helping (reply to 35390)

Andrey: Hello everyone, I am a developer of smart contracts, now I am actively looking for new projects to work on, write to the DM if you need my services

— 2023-10-02 —

Niel: hi @tsivarev admin, how to collab with ton, we r game platform

Inal: DM me and send your platform details (reply to 35396)

Mineverse: Hi all. I use tonconnect on the website, transactions are not initialized in tonkeeper, what could be the problem?

Sky: Hi! I’m having an error related to validator engine console. Is it possible to just re-install this part rather than uninstalling/reinstalling mytonctrl?

Daniil: you can try posting your ideas here (reply to 35400)

Anton: so you want to mint a username NFT for locked usernames, but what if the username is ALREADY an NFT? How can you revoke it?  By the way, may be it would be reasonable to mint every username and give it to @wallet addresses assigned to user? because now I dont "own" my username and I have to sell it to myself (reply to 35402)

裸裸: how to use 24 seed words to get private key?

裸裸: my produre only accept the param of private key. while when i create my wallet I only get the 24 seed words.

裸裸: so how to convert it ?

裸裸: is there any way to get the private key?

裸裸: what is this mean~

Daniil: https://docs.ton.org/participate/wallets/contracts (reply to 35411)

裸裸: ok~thank you～

裸裸: want get balance but get "error code: 651 message: block is not applied"

裸裸: what is uninit ?

裸裸: how to change it?

裸裸: how to change the status from uninit to active?

&rey: Deploy (include StateInit in message). (reply to 35421)

&rey: Temporary error, needs retrying. (reply to 35416)

Capitaine: Hello everyone, I'm looking for the community of developers for the French version. Is there one? Thank you!

Niel: cant DM need add contact (reply to 35397)

Fly: any example on connecting a TON smart contract using purely javascript at the frontend

Daniil: https://docs.ton.org/develop/dapps/ton-connect/web (reply to 35426)

Fly: It doesnt have any smart contract related things (reply to 35427)

Inal: Done (reply to 35425)

Daniil: Ton connect is a protocol for sending messages to blockchain through user’s wallet (reply to 35428)

User<1250942880>: Any Idea to solve that problem pls @Gusarich (reply to 35393)

Fly: I have the following code in my nodejs backend for my Telegram bot, I am looking for the similar things at the frontend side using purely javascript and HTML like I was using ETHER.js                  let contractAddress = await Address.parse("address");                 let tonTesting = await TonTesting.fromAddress(contractAddress);                 const tonTestingInstant = client.open(tonTesting);                 let balance = await tonTestingInstant.getContractBalance(); (reply to 35430)

Daniil: You can do the same on front end (reply to 35432)

Fly: for example, how to get Address? Is there a CDN for ton-core js library? (reply to 35433)

&rey: You can use some build system (rollup?), for example. (reply to 35435)

Fly: so there is no way I can use it like web3.js? (reply to 35436)

&rey: CDN also exists: https://unpkg.com/browse/ton-core@0.52.0/ (reply to 35435)

Fly: thank you I will try that out

Fly: Does anyone know if there is any example of myAppExplorerService?

Fly: I am actually looking for a way to check the status of my transaction, my smart contract will emit a log and I would like to read the logged message. But I have no idea how to make that happen and I cannot find any related documentation

&rey: You may have a look at an example that loads contracts interacting with certain address, checks their code and loads data: https://github.com/ProgramCrafter/ton-stable-timer/blob/master/web-interface/src/lib/load_timers.ts (reply to 35441)

Fly: thank you I will check that out (reply to 35442)

Fly: is toncenter official? (reply to 35442)

&rey: Yes, but you should use @orbs-network/ton-access because it doesn't have rate limits. (reply to 35444)

Fly: so TonWeb and Tonconnect serve the same purpose?

&rey: TonWeb+tonweb-mnemonic is similar to ton-core+ton. (reply to 35446)

Fly: I see, and TonWeb is under Toncenter so it is also official, am I correct?

User<1250942880>: I'm looking create smart contact here and deploy that here  is webdeployer: https://ide.nujan.io/ I want deploy smart contract  https://tonscan.org/address/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW#source how can i do it, any idea can help me to do that

Falco: I am trying to run "getaccount" in lite-client using -c flag but I am only getting errors.  If I run lite-client manually and run it from there it works, it just won't work if I specify the getaccount using -c.   I am getting: [Error : -1 : cannot parse account address]

Falco: My command is:   lite-client --addr 127.0.0.1:43503 --pub /var/ton-work/keys/liteserver.pub -c "getaccount ADDRESSHERE"

&rey: Do you use hex address? (reply to 35451)

Falco: I am using an address from https://testnet.tonscan.org/ I tried different addresses but it doesn't work. How do I get the hex address? (reply to 35452)

&rey: There is a converter at https://ton.org/address. (reply to 35453)

User<1250942880>: are you can help me? :) (reply to 35452)

Falco: [ 0][t 0][2023-10-02 13:59:45.975206620][Status.h:273]  Unexpected Status [Error : 0 : Option 1 was unrecognized] in file /usr/src/ton/lite-client/lite-client.cpp at line 4316 Mmm, not sure what I'm doing wrong... (reply to 35454)

User<1250942880>: I have problem to deploy that smart contact of yesterday (reply to 35393)

&rey: 1. If you want code to be unchanged from EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW, copy it from https://tonscan.org/address/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW#source — bytecode — base64 and paste into the top field of deployer. 2. If you have specific data output by multinft.py, copy it into the bottom (second) field of deployer. 3. Then, press the button to deploy and scan the QR in Tonkeeper/some wallet (testnet should also work, but not sure). (reply to 35449)

User<1250942880>: I did all that after scan QR code what is next step it required to send balance of test TON then after I send balance no thing happen that the problem (reply to 35458)

&rey: Afterwards, your contract is deployed... can you send the address of wallet from which you send the deploy message? (reply to 35459)

&rey: Could you post that via pastebin.com / gist.github.com? (reply to 35459)

User<5762094943>: ok wait (reply to 35469)

Falco: Any other idea? 🙏🏻 @pcrafter I must be doing something wrong 😬 (reply to 35456)

&rey: This seems like issue with parsing command line arguments. I don't remember how I worked around that. (reply to 35480)

Falco: Opening lite-client and doing the command there works.  Running lite-client with the -c flag for the getaccount doesn't work :(

&rey: Wait. The other chat suggests using the full path /usr/bin/ton/lite-client/lite-client. (reply to 35451)

Falco: Let me try that :)

Falco: Same thing unfortunately

Falco: Oh I got it now I think

Falco: Full path, hex address and "getaccount ADDRESS" in quotes

User<5762094943>: https://gist.github.com/Elmahfoud-Oul/94d07a2663a57621b3f6350e1aa5069e pls check that (reply to 35469)

&rey: Have you entered the code from https://tonscan.org/address/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW#source into the FIRST field and data output by script into the SECOND one or vice versa? (reply to 35488)

User<5762094943>: I put base code on 1st field and second field i say that empty as you saw on pic is that not true form tell me the correct form (reply to 35372)

User<5762094943>: are you mean put based was generated by PY script on 1st field and 2st field what will put there ??? (reply to 35489)

&rey: though, there is some problem with data, and I'm not sure on which side (Python or JS). (reply to 35491)

User<5762094943>: I got you know (reply to 35492)

User<5762094943>: but I'm not sure that won't work on test net,  you know why cause that based code of smart contact is published on main net only

User<5762094943>: maybe

&rey: Actually, the contract IS deployed on testnet, and you can see it at https://testnet.tonviewer.com/kf-tMet2LmiPwbohV11DWbD5xIc4r2U-FmojMwC9xrKa6bRI. (reply to 35494)

User<5762094943>: oh okay the reason the address not received NFTitem cause code not correct (reply to 35496)

User<5762094943>: I was deployed yesterday

User<5762094943>: okay I understand idea clear thank you so much

User<5762094943>: as you said i don't know where the prob exactly but I'm think py code is correct but I got error "Error: Incorrect TopUppedArray" I trying use different code but same prob (reply to 35492)

User<5762094943>: The smart contract deployed, https://testnet.tonviewer.com/EQA20AZYxj8nmwWzJ3PGCHRu_zgpckDqLErNGZcih0JlBYSm But problem on Contract Data BOC, I put the code was generated by PY but prob is show "Error: Incorrect TopUppedArray" I don't know why  Any idea to solution that

User<5762094943>: If some one have ready basecode contract BOC just for test that am I will get  "Error: Incorrect TopUppedArray" or will be successful to check where the source of prob

&rey: Should be successful. (reply to 35503)

&rey: Does it fail with the same error if you use a smaller image? (reply to 35502)

User<5762094943>: I'm use img width: 350px &hieght: 623px is that must be like 100x100 PX (reply to 35505)

User<5762094943>: let me try use different size

Απόλλων: Hello, how i can get transaction hash  from Boc ??? For exapmle:  te6cckEBAgEArQAB34gAiKcaiDmUyEiywZV84IdHciBsbf5CDKMVw9tw/GunluYEkbz4FXRJopd4z56FLsG2N19btjLVKdivARPJT4/TFLZ8zdOhAaJB/L9zLuFibHqKceVPu8tVRfGBLdvY49jQGU1NGLso18UwAAAAUBwBAHBiAD9ArEqy48PMicaFJFIkCDZIquPQB2NfNxqppryOgS6mmHoSAAAAAAAAAAAAAAAAAAAAAAAAV/dkloA=  I got this boc…

&rey: Cell.fromBase64('te6cck...oA=').hash() (reply to 35508)

User<5762094943>: Done Bro it deployed, Thank you so much PRO (reply to 35505)

User<5762094943>: Hey! I have question, Why This NFT Item not Showed image, title and description when i click on that it not show data as you see on pic but before click, it showed mm really some thing different  NFT address: https://testnet.tonscan.org/nft/EQCNaJ001ZTT94FB7lU8Y7XsLnQib7LSYiCmnXzehMj6uMv9  Contract Address: https://testnet.tonscan.org/address/EQCNaJ001ZTT94FB7lU8Y7XsLnQib7LSYiCmnXzehMj6uMv9 NFT owner: https://testnet.tonscan.org/address/EQCQi3Vw9fpSveAww19dxK0r11rVG-KNOA4tjgmMd19xtyZj#nfts

User<5762094943>: I know it uploaded on chain, and i'm sure it uploaded correct but not showed when click on that and not showed on my wallet (reply to 35509)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: may you have errors on get item data (reply to 35511)

User<5762094943>: But if we imagine I have error on get item data where this nft item got the data to show name and img and description ??? (reply to 35511)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm sure this is related to your getters, however, if it's a public repo, share your repository I'll check (reply to 35515)

User<1194900032>: Hi Guys, I'm following this tutorial https://ton-community.github.io/tutorials/01-wallet/ I sent ton to my address, arrived, the status is active. But when executing the code, it says that the wallet is not deployed. What could be the problem?

User<5762094943>: okay but what mean that (reply to 35516)

Tumin | Wagmi11: send more info about this (reply to 35517)

User<1194900032>: My wallet address kQD6CAJnxzhIRNyzQyolwZBgEkhCLvAgLuXP0SUQUNN7V7nW on the testnet network I have 4.97854322 TON Use Tonkeeper wallet idk what to say more about this (reply to 35519)

Tumin | Wagmi11: so you are facing issue with Step 7: Get the wallet address programmatically? (reply to 35520)

— 2023-10-03 —

脚本开发: May I ask how walletContract.sendTransfer determines whether the transaction was successful, as there is no return value or transaction ID

Javad: Do you mean this link ?  https://tonapi.io/v2/blockchain/blocks/(-1,8000000000000000,1)/transactions (reply to 34636)

&rey: The same but sent to a liteserver to be tested. (reply to 35523)

Javad: But the problem is how find the servers ? (reply to 35524)

&rey: Do you have a way of enumerating nodes? (reply to 34613)

&rey: The method I suggested allows to find archival ones among them.

Javad: No, idk how can i do that (reply to 35526)

&rey: There is network config JSON https://ton.org/global.config.json (reply to 35528)

Javad: Okay And how request them to get first transaction of masterchain ? (reply to 35529)

Javad: Cause they don't have tipical ip

Dmitry | backend4you.ton: they also don't have typical http. you need ADNL client and I think it will have required connection options

Thilak: https://minter.ton.org/  Does it allows to create testnet tokens on ton??

Daniil: Yes (reply to 35534)

Thilak: Can u tell me the procedure ? (reply to 35535)

Andy: minter.ton.org/?testnet=true (reply to 35536)

Thilak: Thanks

Robert: Hello, how to get tx send mode from toncenter api?

Robert: i need calculate total value in tx

Mahdi: Hi everybody. It seems telegram wallet in linux mode provide for gnome users. And it needs webkitGTK to run. I have kde and I should install it. Do you know where should ask this problem or solve it by myself?

User<1194900032>: step 9 is more suitable) on line /make sure wallet is deployed I always get wallet is not deployed message  what steps must be taken to ensure that the wallet is deployed? As I understand it, you just need to send any transfer, and the wallet status will become active, I sent the transfer from my wallet to my wallet, and the wallet status became active (reply to 35521)

User<5762094943>: Hey! any help Pro @pcrafter (reply to 35511)

&rey: Tonscan doesn't really work well on testnet. (reply to 35512)

AYMEN: Is performing blocks.LookupBlock with seqno 3 enough to mark a node as an archive node?

Handsome: Which one do I learn, Tact or FunC? (reply to 35529)

Handsome: I also saw a YouTube video of a man teaching tact or funC, can you recommend me to it.

&rey: For serious contracts, you need FunC. Though, in ten days there will be TON Tact Challenge. (reply to 35546)

Handsome: Nice so where do I start? (reply to 35548)

— 2023-10-04 —

d1ce: hi guys, newbie here, which wallet is best in this chain? Tonkeeper?

Soulincloud: Just and only) (reply to 35552)

d1ce: the difference with others? (reply to 35553)

Soulincloud: Welcome on board 🛹 (reply to 35552)

Soulincloud: Secure, ultra fast, scalable, can be adopted for every task that you can imagine 😊

Soulincloud: Aww also i forgot about main component. People. Our Power it is our true, ideas, and community, together, we can fix the world 🌎 (reply to 35554)

&rey: Tonkeeper is probably the most functional. List of wallets and their features: https://ton.org/wallets (reply to 35552)

&rey: On docs https://docs.ton.org. (reply to 35551)

Fly: I am using tonweb and toncore js library to read my own smart contract, do I need to include the wrapper js file?

Fly: Want to see if there is any example on how to connect to a custom smart contract using purely JS and html

Fly: like just using ABI.json and contract address together with web3.js. Can I find something similar on tonweb.js?

Mahdi: maybe this can help you https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/sources/contract.read.ts (reply to 35566)

Fly: any pure frontend js example? (reply to 35567)

Mahdi: sorry I hadn't (reply to 35568)

Fly: I couldn't find any either

&rey: I remember that I had one, currently trying to find. (reply to 35568)

User<5700875629>: Is there a site where I can see the number of active users on Ton dapp?

&rey: https://github.com/ProgramCrafter/ton-qr-deployer/blob/feffa25bff67f9a9a901585a4f7970a0fcc24671/index.html (reply to 35568)

Fly: is it the same thing, I am looking for a pure frontend js connecting with custom smart contract. This one seems to be a contract deployer? (reply to 35573)

Fly: Or I should ask what is the way to load the ABI at the frontend side using javascript

Fly: I guess shd be something like this, but it is lacking examples: https://github.com/toncenter/tonweb/blob/master/src/contract/README.md#implement-your-custom-contract

&rey: There is no automated ABI for smart contacts at all. (reply to 35575)

&rey: Btw, it's known as TL-B.

Fly: so I have to write the wrapper class all by myself if I want to use tonweb.contract at the frontend side? (reply to 35577)

&rey: Yes. (reply to 35579)

Fly: oh that's not good 🙈

Fly: export class MyContract extends Contract {     constructor(provider, options) {         options.code = hexToBytes('abcd..');         super(provider, options);          this.method.myMethod = ...     }      // @override     createDataCell() {     } }  can the team at least provide an example of this? (reply to 35581)

&rey: You can use blueprint with Tact, it generates [non-tonweb] wrappers. (reply to 35581)

Fly: yes but I cannot use it at the frontend side (reply to 35583)

&rey: You can, just pack them with rollup. (reply to 35584)

&rey: https://github.com/ProgramCrafter/ton-stable-timer/blob/master/timer.ts (reply to 35582)

Fly: I know how to do it using typescript, but I am not good at typescript and I want to connect to the smart contract using simple JS

Fly: let me check, I dont know how to do the rollup (reply to 35585)

Fly: thank you for your help

User<6513722579>: How to add to Metamask?

Fly: but this is ton-core, I am looking tonweb, are they the same? (reply to 35586)

Fly: and where can I find the base64 code? I have build my tact file (reply to 35586)

Fly: 😮‍💨

&rey: EVM isn't TON-compatible. (reply to 35590)

Fly: Btw anyone tried this tutorial? https://ton-community.github.io/tutorials/03-client/

Fly: it doesnt work starting form Step 6: Read the counter value from the chain

Fly: I dont what the problem is, but everything doesn't work once I have useTonClient in my code

Fly: but there is no error at all

Alex: We have a simple Tao, where voting via sbt token is implemented, we already have a contract, we just need to deploy it on the oasis network, and finalize the logic of authorization and voting on the frontend, who can help write to me dm

&rey: This is chat of TON blockchain, not oasis. (reply to 35599)

&rey: Either build/ directory or the result of invoking compilator contains all the artifacts, including the code cell which you can encode in base64. Though, you don't necessarily need one to write a wrapper for a contract. (reply to 35592)

&rey: They are approximately same, yes. (reply to 35591)

User<5762094943>: Hey Guys! I want smart contract have function of SFT "semi-fungible-token" it mean one NFT  can have multi owner like, 1 nft owned by 10 owners  I want smart contract can do it ??? cause I have now NFT item but that had not possibility to have multi owner in same time

Santosh | Wagmi11: interesting, when you say multiple owner for 1 nft, do you consider weightage/share of ownership? (reply to 35603)

User<5762094943>: that right, share of ownership  same logic of ETH network, there some NFT collections have only 1 NFT item and this one piece of NFT owned by multi owner (reply to 35604)

&rey: In TON, they're based on fungible tokens (jettons). (reply to 35603)

User<5762094943>: okay are there smart contract of create jetton "fungible-token" (reply to 35607)

xiaohuo: hi

xiaohuo: I am trying to call lite_server_get_block on public light node

xiaohuo: but seems some of them ECONNRESET some of them ECONNREFUSED my connection

&rey: Yes. You may refer to existing jettons and in particular https://minter.ton.org. (reply to 35610)

&rey: They might have geo-block, I guess. (reply to 35613)

xiaohuo: ah i see

xiaohuo: so in this case, i need run one myself?

xiaohuo: any other public one i can use?

&rey: At least one from config should work, I think. (reply to 35618)

xiaohuo: i did a simple script scanning all the server... none of them works for me hmm (reply to 35619)

&rey: Also, some of nodes can be offline if the config is too old. (reply to 35613)

xiaohuo: okie.. (reply to 35621)

xiaohuo: can you suggest one? (reply to 35619)

&rey: Wait, the nodes aren't accessible via HTTP. (reply to 35622)

&rey: Their protocol is ADNL.

xiaohuo: ohh

xiaohuo: so here the liteApiUrl is not light node api?

xiaohuo: this is relayer code

&rey: You won't be able to access liteservers from browser JS, by the way. You need either ADNL-websocket proxy (IIRC, @TrueCarry's tonlens.com uses that) or an API. (reply to 35628)

xiaohuo: https://github.com/RSquad/ton-trustless-bridge-relayer/blob/master/src/modules/ton-reader/services/ton-api/ton-api.service.ts#L72

xiaohuo: checking this one atm

xiaohuo: so what should i set up api url for this if you happen to know?

Tim: Tonapiv4 creates http api for node (reply to 35634)

xiaohuo: https://github.com/ton-community/ton-api-v4 this one right? (reply to 35635)

xiaohuo: okie thanks alot

User<5762094943>: it graphic creation,  But there is open source code https://github.com/ton-blockchain/minter-contract#protect-yourself-and-your-users (reply to 35614)

xiaohuo: hmm unfortunately, i checked this one, there is no api called lite_server_get_block (reply to 35636)

xiaohuo: no idea where it comes from

xiaohuo: but the relayer does call it

Fly: What is the file extension? (reply to 35601)

CryptoTara: Is there any native redelegation mechanisms for a delegator or would you need to wait for the current round to end and then undelegate from the current pool and redelegate to the new one?

&rey: You need to wait while the validation round ends and unlocks the money and send them into other nomination pool manually afterwards. (reply to 35646)

&rey: Actually, nominators don't often change pools.

User<5762094943>: are you have some idea, build token"jetton" use smart toke I will use WebDeployer

— 2023-10-05 —

Official: Hello 👋

Ceren: Will the new wallet address update work without problems for something like TONex since our accounts are based around the addresses

Fly: "descriptor.js:31 Uncaught TypeError: (0 , paddedBits_1.bitsToPaddedBuffer)(...).copy is not a function"  This is an error from the tutorial part 3 at step 6, after adding the tonclient code, anyone know how to fix?

Fly: Seems people are having the same issue https://github.com/ton-community/tutorials/issues/40

Thilak: Hi, does TON support integration with js or only typescript?

Fly: It has JS, but there is no tutorial on connecting with custom smart contract (reply to 35658)

Fly: but you are only looking for Tonconnect and TONweb to send transaction, check balance, you can do it with pure JS

Matan: Is there an id associated to periods of validating so that one can attribute block to validation periods?

&rey: Yes, it's [start?] UNIX timestamp. (reply to 35663)

xiaohuo: @pcrafter Hi is this the right place to ask something about https://bridge.ton.org/? I just tried bridging some USDT and it worked very smoothly, I also checked two contract repo:  EVM side: https://github.com/ton-blockchain/token-bridge-solidity Ton side: https://github.com/ton-blockchain/token-bridge-func  But seems i could not find out oracle/relayer part, by any chance you know where it is or who can share some info with me?

Magomed: Hi! What is the best SDK for building web applications? Is there any guide for classic dapp maybe?

Magomed: Something like web3-react idk

TON Answers Bot (not AI): Import wallet by private key from mhpba  Hi there,  I've been using the Atomic wallet to store my TON tokens. Unfortunately, I've encountered an issue where it won't allow me to send my assets and displays an error message stating, "Block explorer is currently unavailable." I've tried various methods and even reached out to their support team for assistance, but my problem persists.  As you may know, you have access to your private key in your atomic wallet. However, the private key for TON wallet on Atomic wallet is a lengthy 128-character base, while most wallets that support private key imports typically use a 64-character base, such as Trust Wallet and Safepal.  My question is, are there any wallets that support the import of a wallet using a 128-character private key? Or do you have any suggestions to help me resolve this issue?  I appreciate your assistance in advance.  🔗 Answer on TON Overflow

IdirIdo: Hello! Is it possible to bridge messages from Ethereum to Ton network?

Javad: Toncenter has rate limit for json-rpc  How use api key for JSON-RPC in toncenter ?

Dan: apikey in header (reply to 35670)

User<5762094943>: are there any website make jetton token must have possibility upload metadata.json via IPFS and be in off-chain URL (a JSON file hosted somewhere). I know there is https://minter.ton.org/  But that had not possibility to upload metadata.json file

User<5762094943>: this is https://minter.ton.org/  open source code: https://github.com/ton-blockchain/minter/blob/main/README.md I'm looking where will put the metadata .json then run that I mean which file respo for metadata input

Fantasy: Hello ✌️ I'm a smart contract & frontend design & developer. I can build up token contract and marketing site by my self and also I can do smart contracts for DeFi and NFT projects. Please let me know if you have any ideas to build your own project. Thank you.

User<5754825052>: Yes, it is possible to connect messages from Ethereum to the Ton network, but you need to use a special bridge that allows the exchange of tokens between the two chains. One of the most reliable and easy to use bridges is the official Ton bridge, which supports the transfer of WETH, USDT, DAI and WBTC from Ethereum to Ton. To use this bridge, you just have to follow these steps:  - Navigate to the official Ton bridge website and connect your blockchain wallet. - Click on the 'Bridge' section to access the Ton bridge interface. - Choose 'TON' as your destination chain and select the asset you want to move. - Enter the amount you want to transfer and click on 'Approve' to initiate the transaction. - Enter your Ton wallet address as the recipient, then finalize the process to complete the bridging of your assets to the Ton network.  Please note that this bridge may have costs associated with Ethereum gas fees, which can be high depending on the time. You should also make sure you have a Ton-compatible wallet to receive your tokens. (reply to 35669)

— 2023-10-06 —

Goldy: Hello! I am a professional developer on Ton Blockchain. I am actively looking for a job now. Please DM me.

Max: Can we see your github? (reply to 35680)

User<6247944943>: what is int aa = action means here in FunC?

Fly: Any tutorial on how connect custom smart contract with vanilla JS at the frontend side. Like what we can do with web3.js

Fantasy: Hello ✌️ I'm a smart contract & frontend design & developer. I can build up token contract and marketing site by my self and also I can do smart contracts for DeFi and NFT projects. Please let me know if you have any ideas to build your own project. Thank you.

IdirIdo: Hi! Thanks for your answer :)) Please, can you send me the address of the contract deployed on mainnet and testnet? (reply to 35677)

Jeff: Hello everyone, are there any documents about TVM library and 'SETLIBCODE'? I saw this code but have no idea about this code.  https://github.com/ton-blockchain/liquid-staking-contract/blob/main/contracts/librarian.func

Jeff: Is it like external library in solidity(EVM)?

&rey: Libs published in masterchain are available for all contracts. Here's an example how to work with them: https://github.com/ProgramCrafter/wallet-contract/blob/main/func/registry.fc (reply to 35691)

User<5762094943>: Hey man!  https://github.com/ton-blockchain/minter-contract/blob/main/build/jetton-minter.deploy.ts is here only where can edit the metadata (reply to 35693)

Jeff: Oh thanks! I'll take a look (reply to 35693)

Maxwell: Any explorer can show the contract code now?

&rey: tonscan.org, tonviewer.com (reply to 35696)

Maxwell: Seems lots contract have not been verified, so we actually have no idea about the code underhood?

&rey: We almost always have bytecode, though. (reply to 35698)

Maxwell: I get that.

F: Hello everyone! Im trying to understand how to create highload wallet, maybe someone can help? I’ve tried to make it programmable but all I get is V3 wallet…

Yellowdish (aka Lando): Hi, we are trying to integrate ton react sdk into our react native app and getting this error. Who can help us?

Magomed: Hi everyone! Does anyone know is there anything like web3-react, but for ton?

Magomed: How my app should connect to wallet?

Yellowdish (aka Lando): @pcrafter could you advise on our issue. Thank you. (reply to 35715)

&rey: Are you importing '@tonconnect/ui'? (reply to 35715)

Mike: Hey guys, how can I get private key from wallet seed phrase?

&rey: TonWeb.mnemonic.mnemonicToKeyPair from tonweb-mnemonic module. (reply to 35720)

Mike: thanx broo🔥 (reply to 35721)

Yellowdish (aka Lando): We are importing @tonconnect/ui-react 2.0.0-beta.2 only  Do we also need to import @tonconnect/ui ? (reply to 35719)

— 2023-10-07 —

Vahid: Hello I'm using tonweb with toncenter jsonRPC but the toncenter has limitation on request per second  do you have jsonRPC with higher request per second limit or without limit ?

Santosh | Wagmi11: +1 any better or robust way to get real time data stream ? (reply to 35726)

Vahid: I don't want real time data, i want to read data from contracts (reply to 35727)

Vahid: For getting real time data you can use tonapi service (reply to 35727)

Santosh | Wagmi11: will try it out. ty ser (reply to 35729)

Flex: Hi, all, for the wallet address can I consider the user-friendly address and bounceable address to be equivalent when used?

Dmitry | backend4you.ton: user-friendly means "not raw", and user-friendly may be in bounceable and unbounceable format. if [destination] wallet is deployed then no matter which one you use, but for not-yet-deployed wallet you would like to use unbounceable one (reply to 35731)

Flex: Thanks, but what about the address copied from tonkeeper wallet when press received? (reply to 35732)

Budy: Hello

Dmitry | backend4you.ton: I guess it will be in non-bounceable form (UQ...) Check all forms of your  address at https://ton.org/address/ (reply to 35733)

Dmitry | backend4you.ton: "bounceable" mean that when you have incoming transfer, but your wallet is not deployed - transfer will return back to sender. If your wallet is deployed - no matter which form (bounc on non-bounc) you use, incoming transfer will stay on your adderss

Flex: Still confused about the output of ton.org/address vs https://testnet.toncenter.com/api/v2/#/accounts/detect_address_detectAddress_get  for this address kQCcKi3Ilvz1NfEJfeZepTnF4VfDa1E9P2989EQvR8-XHs5k  ton.org/address said it is a bounceable address, but detect_address api give its bounceable is EQCcKi3Ilvz1NfEJfeZepTnF4VfDa1E9P2989EQvR8-XHnXu (reply to 35736)

Dmitry | backend4you.ton: kQ… is testnet address. When making user friendly from raw, two “variables” are used: testnet and bounceable. (reply to 35737)

Flex: so ton.org/address only support mainnet address? (reply to 35740)

Dmitry | backend4you.ton: It SHOWs you mainnet. Because usual users should not care about testnet.   Internally blockchain uses raw, and does not care about user friendly. Wallets and other soft should care about preventing users from using testnet in mainnet etc (reply to 35741)

&rey: @orbs-network/ton-access, and it has identical API. You'd better use tonapi if you need some of its special features, so as to prevent price raise. (reply to 35726)

Howard: this is good.   One expanding question is "how the logical time exactly be generated? (reply to 32013)

Vahid: I use http requset of tonapi  is tonapi has jsonRPC ? or is it possible to call contract functions with tonapi ? (reply to 35743)

B: Hi guys. I joined this group a while back without exactly knowing what it is. I am really interested in the blockchain related field.   I am basically a professional in civil engineering, but have self taught myself programming and have developed apps and websites and also use programming in automating and developing tools for my work. Could somebody point me towards some relevant materials like documentation or videos where I can get started on this technology. Any help is appreciated. Thanks

Flex: For the basic concepts, https://docs.ton.org/learn/introduction  For contract development, https://www.youtube.com/@AlefmanVladimirEN-xb4pq/videos (reply to 35746)

B: I'll go through this. Thanks !

KaLL1mat0RR: What the hell?

KaLL1mat0RR: My massage

&rey: Yeah, unrelated and "hello" messages are deleted so that this chat remains a good collection of answers for developers' questions. (reply to 35750)

KaLL1mat0RR: I understand, thank you 🙏 (reply to 35752)

KaLL1mat0RR: What is this channel for?

&rey: Asking questions how to implement something on TON (https://docs.ton.org/learn/introduction) and why something doesn't work if so. (reply to 35754)

KaLL1mat0RR: Ок

KaLL1mat0RR: Spam!

&rey: There is Russian chat @tondev. (reply to 35757)

KaLL1mat0RR: Thank you, but I’m learning English at the same time) (reply to 35759)

KaLL1mat0RR: I just really like your language and I want to master it faster so that I can use it in the future without a translator (reply to 35759)

KaLL1mat0RR: Because...

KaLL1mat0RR: Friend, please tell me what programming language they use to match the blockchain?

&rey: I think that documentation https://docs.ton.org will be helpful for you. As well, on Youtube there are video lessons in different languages. (reply to 35764)

KaLL1mat0RR: thanks

KaLL1mat0RR: I'll take a look

takeuxp: Hi everyone! I represent a studio specializing in NFT game development. We are currently looking for people for the position of game chat administrator. Salary is fixed, payments every week, no fines or penalties. If you are interested, we will start a dialog! Have a good day everyone!

— 2023-10-08 —

User<6247944943>: can we say this is a cell that references the other 2 cells?   Then does this have the maximum size we can store combine in a cell?

&rey: Yes, we can. One cell can contain up to 1023 bits and 4 references, DAG of cells can have unlimited size. though too big ones cannot be saved to contract data because of 65535 cells limit. (reply to 35769)

ETON: hello,all. If there are more and more data in the ton contract, will the rent also go up?

&rey: Yes. https://docs.ton.org/develop/smart-contracts/fees#calculator-example (reply to 35771)

Ken: Where is this 65535 cell limit documented? (reply to 35770)

&rey: https://docs.ton.org/develop/howto/blockchain-configs#param-43 (reply to 35773)

Ken: Do I understand correctly it's the limit per message? So it's limited to 65535 cells at init, but I can later send transactions to add more cells (for example create cells and store them in a map) beyond this limit? (reply to 35774)

&rey: No, per-message limit is 8191 cells, and per-storage one is 65535. (reply to 35775)

Ken: I see, thanks!

User<5875183137>: Does anyone have the source code address to open a membership? Please share it.

Ken: What is the bit width of store_coins?

狗蛋(喝丢一只鞋): Me too (reply to 29605)

&rey: It has variable length, up to 120 bits. (reply to 35779)

狗蛋(喝丢一只鞋): Do you have the source code? (reply to 29610)

狗蛋(喝丢一只鞋): I want buy

狗蛋(喝丢一只鞋): Who have this source code.  PM pls (reply to 29605)

User<5875183137>: Hi everyone, I have a question to ask. I want to build a BOT that can buy Telegram Premium subscription for those who send their ID to this BOT, is there any API that I can connect to, please help me find a development demo for java

&rey: There are no ready tools for that. I believe you need to find a web-browser emulator for Java and find a way to TON-connect Fragment automatically; an LLM may help you with that. (reply to 35785)

&rey: Also, why don't you send users directly to Fragment? (reply to 29605)

User<6480796894>: Give me 50+ ton for Testnet  0QA8WlUqtd3VsbbpxAOQOowwQ-WfhFV6x0GydIMu3DM2xxpU

🅰🅻🅰🅽: Does anyone know how to import tact file from the parent directory / node_modules ?

Howard: no .tact in the end

🅰🅻🅰🅽: Sure! But how can I import from relative path “../” ?

🅰🅻🅰🅽: It seems that import from parent does not work as expected

🅰🅻🅰🅽: import tact from node_module is not available, either.

Howard: can check the config file and maybe join the Tact group chat @tactlang (reply to 35794)

Howard: One question expand with BOC (Bags Of Cells):  Is there any better way to parsing & decoding those data?    https://t.me/tondev_eng/15458 https://t.me/tondev_eng/24321  https://docs.ton.org/develop/data-formats/cell-boc#bag-of-cells https://docs.ton.org/develop/research-and-development/boc  https://explorer.toncoin.org/account?account=Ef8U8XeSb5hTz5TjWrO9Y0oFHDUsu0qcmi2hg6r_tADNScU_ (reply to 17547)

User<6247944943>: Why it's need to ask the load_data() when calling the _get_amount_to_withdraw ?

Slava: seems like load_data() loads global variables from contract's storage (reply to 35799)

&rey: Please use English in this chat. (reply to 35801)

Behrang: Hey 👋 Is there any standard for assigning names to transaction op-codes, to be displayed in TON explorers?

Behrang: I think a get-method in each contract can help here.

User<6059051896>: Hello,I'm actively looking for a project   Version control system  -Git Programming and markup language  -C#,JS,TS,Python,fullstack  Development Environments -Visual Code,Visual Studio  Framework and Libraries  -Reacts.Js -Vue.Js -Asp.net -WPF -Windows Forms  Auxiliary tools -Figma -Trello  API -Rest/JSON

&rey: Hello! There is, defined by TL-B standard https://docs.ton.org/develop/data-formats/tl-b-language#constructors. > If a tag is not explicitly provided, the TL-B parser must compute a default 32-bit constructor tag by hashing with CRC32 algorithm the text of the “equation” with | 0x80000000 defining this constructor in a certain fashion. (reply to 35804)

Behrang: I didn't phrase it correctly. Here I try once more:  In explorers, in front of each tx, an op code is displayed, which is 8 hex digits. This is not readable.   Specific opcodes like jetton or nft show the operation name instead. This makes them more readable.   I want to define these names for my smart contract, so that when anyone visits the explorer and opens one of these contracts, views readable operation names instead of opcodes. (reply to 35807)

&rey: You need to reach out to explorers' authors for that. (reply to 35808)

Behrang: I thought devs of multiple explorers might be here and have an idea on that.

Andrey: We need to develop ABI for smart contracts, which will do that.   But it's not quite easy task, and there's no active discussion currently (reply to 35810)

Luke: how do i send arbitrary messages to a contract

— 2023-10-09 —

&rey: The interface for that is called "wallet". (reply to 35815)

Behrang: You're the expert here, but to keep the discussion active, how about this:  Currently explorers show the Jetton balance of an smart contract if it is TEP74. And it looks like they update the balance quite frequently.  - Another TEP could decide on the standard.  - (1) One idea is that this get method is named, for example, get_opcode_names and returns a dictionary mapping 32bit op codes to short strings. It also might have a limit of at most, let's say, 100 entries.  - (2) Another idea is that this get method is named, for example, get_opcode_name and returns a short string when given an opcode as argument.  - (3) The next idea is that each smart contract can send a message to a specific address with a specific opcode. In the message body, there can be a dictionary mapping these opcodes to short string names. Explorers can look for the last message from this smart contract to that specific address and use those names for opcodes. This way, smart contract developers can send that message, whenever they want to update the opcode names.  - In the options above, there is the problem of caching. For how long should they be cached? When and how should they be invalidated and what if a name changes?  - The next step after showing opcode names, is showing values for other parameters in the message along with their name. How about just returning a TLB scheme instead of a short name string, so that explorers can also show other parameters, for example, in details of each transaction. (reply to 35811)

Behrang: The option (3) has the problem that child smart contracts must also send a message to the address, which makes it unfeasible. In the case of child smart contracts, op-codes can be looked up from parent smart contract.  For example, jetton wallets have get_wallet_data which identifies their parent. In this case, op-code names can be delegated to parent, i.e. jetton master. (reply to 35817)

Thilak: hi,   Is the tonweb node module compatible only with node js or its allowed with react js too?

Thilak: Could someone help me on this?

Behrang: It's a JS library and works in any JS environment, including node.js and browser. (reply to 35819)

Maxwell: It seems inconsistent responding to whether the tx would be revert. 1. https://docs.tact-lang.org/language/guides/lifecycle 2. https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases

Daniil: "it depends on the mode of the actions" (reply to 35827)

R: hi, I want to know can I get transaction list of an addrss by toncenter api through ton-access?

Maxwell: which tact docs not mentioned? maybe someone from Tact team would clarify? (reply to 35828)

Fly: any example on reading the LOG emitted from a smart contract?

Daniil: why would you need to? (reply to 35831)

Fly: I want to display that on the frontend

Fly: also I am using this code: myContract?.send(sender, {                 value: toNano(snedAmt)  }, message);  But it I cannot use await to wait for the transaction result. I want to check the transaction hash and know the result of the transaction

Sleapy: Hi, I'm new here and I am struggling with decoding/encoding a TLB scheme: https://docs.dedust.io/reference/tlb-schemes#asset this one.  native$0000 = Asset; jetton$0001 workchain_id:int8 address:uint256 = Asset; extra_currency$0010 currency_id:int32 = Asset;  I'm trying to encode Asset and use it to query methods from the DeDust smart contracts for testing purposes. For example: 'get_vault_address' in the factory contract: https://docs.dedust.io/reference/factory who take a 'slice' of Asset.  I don't really know how to encode this properly. if I understand, for Native coin (TON) I just have to encode 4 bits ("0000") and that'is. If I want to encode a Jetton, I store 4 bits ("0001") then I store a int8 (0 for the workchain) then a uint256 (so I guess the uint256 representation of the hexadecimal address ?  But everything I try does not work. I am sure I am missing a simple piece of the puzzle but I don't know what right now

Sleapy: If I try to query it through tonapi.io or TonViewer I have exit code : 7 most of the time (reply to 35835)

Budy: Hallo kak

&rey: What get method are you calling? Also, get methods don't usually require encoding inputs. (reply to 35835)

Sleapy: 'get_vault_address' (reply to 35838)

Sleapy: but since it requires a "slice" type i thought it would be the encoded Asset type

&rey: You can see an example at https://github.com/ProgramCrafter/wallet-contract/blob/main/basic-interaction-wallet-inplug-v1.ts. (reply to 35842)

5: Why can’t I send the transaction?

5: I want to transfer a transaction. Do I need to perform any other operations after executing the code?

&rey: The most probable reason is invalid seqno, the second one is too low value (you need to set sendMode = 3 to pay for gas from sender's wallet). (reply to 35844)

&rey: await wallet.methods.transfer(...).send(); (reply to 35844)

5: Where is sendMode actually set?

Howard: you can get the emit log data as the String looks like this from API(eg. TonAPI).  Then decoded it based on your message formate you set before. (reply to 35831)

&rey:   seqno: 0,   sendMode: 3,   ... (reply to 35850)

5: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

&rey: Could you show the full error log? Opcodes (THROWIFNOT) are the most important part. (reply to 35853)

5: Thank you, brother, for your trouble.

User<5660798371>: give me your wallet address (reply to 35857)

5: EQCDZIhtot8I872NstQQCliZ2TZ7UktBoJrNFtjGx2qhPpBr

User<5660798371>: you have to make a wallet deploy

&rey: You're connecting to testnet, but the funds are in mainnet. (reply to 35856)

&rey: Russian chat is at @tondev. Also, I don't recommend asking null-meaning questions. (reply to 35861)

5: soga

User<5660798371>: he's got an inactive wallet (reply to 35862)

User<5660798371>: you must execute this code before sending the first transaction. (reply to 35856)

&rey: Not needed, I think. TonWeb should deploy wallet automatically when seqno is 0. (reply to 35872)

5: Sent, thank you very much (reply to 35873)

&rey: 1. You need to add 1 to seqno each time an outgoing transaction is sent. 2. You've sent invalid payload; the correct one would be payload: TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes("te6cc...")). 3. Smart contracts can't process incoming messages with 1 nanoTON of value. (reply to 35874)

5: Thank you for helping me solve the problem too (reply to 35872)

5: Where is the document requesting key settings?

Sleapy: So do you know the answer ? I already tried to simply put the token address, it give me a cell but if I deserialize it the vault address is incorrect. (reply to 35838)

Fly: Thanks (reply to 35851)

Fly: Anyone know the solution of this? I cannot wait till the send is done even though I put an “await” in front of it (reply to 35834)

&rey: Maybe myContract?. causes the problem? Can you make it always non-null? (reply to 35834)

Fly: I tried to remove the ? and added an if(myContract) before calling that (reply to 35882)

Fly: But the await still doesn’t work

Fly: The code run the next line regardless of the myContract.send

&rey: Ah, you want to wait until transactions are complete. Actually, meaning of this highly depends on context and thus waiting isn't implemented in libraries; await only waits until the external message is sent to wallet. (reply to 35886)

Fly: do u have any example on how to get the string using API? (reply to 35851)

Fly: Like what should I input to get the corresponding data

Howard: can't understand tho (reply to 35890)

Howard: what kind of string you  want?

Fly: "you can get the emit log data as the String looks like this from API(eg. TonAPI)."  Any example on how to get the "log dat as the String" (reply to 35893)

sdw: Hello, quick question when I run method from TonClient :  client.runMethod(address, 'this-method')  I get for a specific method into validators contract https://tonscan.org/pool/Ef-8i71cS7pz9fuzQCxRNOIx31EzaTPpmsNluGbzJC6cVGHp#source  the following error:  Unsupported stack item type: list  What do I have to add into stacks in order to fetch data from that method?

Fly: getTransaction(address: Address, lt: string, hash: string): Promise<null | {     address: bigint;     description: TransactionDescription;     endStatus: AccountStatus;     inMessage: undefined | Message;     lt: bigint;     now: number;     oldStatus: AccountStatus;     outMessages: Dictionary<number, Message>;     outMessagesCount: number;     prevTransactionHash: bigint;     prevTransactionLt: bigint;     stateUpdate: HashUpdate;     totalFees: CurrencyCollection; }>  Anyone know how to convert the bigint to address?

Fly: this is from https://ton-community.github.io/ton/classes/TonClient.html#getTransactions (reply to 35898)

TON Answers Bot (not AI): any example on how to decode the result form tonClient.getTransactions()? from Doubleweb3  https://ton-community.github.io/ton/classes/TonClient.html#getTransaction  it returns a list of transactions: Returns Promise<null | {     address: bigint;     description: TransactionDescription;     endStatus: AccountStatus;     inMessage: undefined | Message;     lt: bigint;     now: number;     oldStatus: AccountStatus;     outMessages: Dictionary<number, Message>;     outMessagesCount: number;     prevTransactionHash: bigint;     prevTransactionLt: bigint;     stateUpdate: HashUpdate;     totalFees: CurrencyCollection; }>  I want to know how to decode the outMessage, inMessage and address from bigint to string address. Please help!  🔗 Answer on TON Overflow

Mahdi: Hello guys. When we create a game or anything in Defi, we have something like mintPercent or burnPercent or rewardPercent to users or APY for stakers.   I want to know is there any group or article or solution about calculation of these kind of variables in different situation?

&rey: I believe you need to consult economic papers on that topic. I think you may start searching either from Google (more results) or LessWrong (higher quality but likely specialized articles). (reply to 35901)

Fly: Anyone who can help? (reply to 35900)

Mahdi: You right. I should do that. Thanks again and again for your help 🙏 (reply to 35902)

— 2023-10-10 —

fomo: convert the bigint to hex then convert it to string and add "0:" at the beginning. Then you can user Address.prase and get your address (reply to 35898)

Metas: How to determine whether a wallet address belongs to ton network

User<6059051896>: Hello,I'm actively looking for a project   Version control system  -Git Programming and markup language  -C#,JS,TS,Python,fullstack Development Environments -Visual Code,Visual Studio Framework and Libraries  -Reacts.Js -Vue.Js -Asp.net -WPF -Windows Forms Auxiliary tools -Figma -Trello API: -Rest/JSON

عمر: هلا

User<6247944943>: Hi I am checking the Telemint NFT code:

User<6247944943>: My question is how & why we got this 0x.... numer here in TonViewer? https://tonviewer.com/EQDEbePUEWU3vC4KmqMboTYa61j6fj0tVfxmoCpv80l0KdiQ?section=method (reply to 35912)

User<6247944943>: I am afraid that it's the uint256 Integer, right?

Rose Quan: NFTScan NFT APIs for TON is officially launched! Welcome all developers access to the ultimate NFT database on TON network. https://docs.nftscan.com/reference/ton/model/asset-model  DM for product testing 🚀

frlyh: 这个是16进制字符串 (reply to 35914)

frlyh: 相当于EVM的token_id.0x和10进制两种格式而已哈

frlyh: This is a hexadecimal string It is equivalent to the tokenID.0x and decimal format of EVM

frlyh: 👏 (reply to 35915)

Maxwell: How does the short form resolved and recovered back to the full form?

Daniil: They’re identical. The “short form” just stores most fields with default values in a single function call. (reply to 35921)

Maxwell: Yeah, but I'm still confused about how it works in bits level.  Eg.  A = store_uint(0,1).store_uint(1,1).store_uint(1,1).store_uint(0,1)  B = store_uint(0x18, 6)  A has 4 bits, but B has 6 bits? A appends 0110 B apends 0x18 = 01'1000  Right? How A is the same as B?

匿名科技-小虫虫虫虫虫虫虫虫虫虫虫虫>: Is it possible to activate telegram premium through a smart contract of ton?

Daniil: no (reply to 35925)

Behrang: In A, there must also be a .store_slice(source) which when source is null, will store 00. (reply to 35924)

Maxwell: I missed the addr_none$00!

Daniil: @twa_dev (reply to 35929)

Fly: It works, thank so much (reply to 35908)

Maxey: Has anyone encountered exit code 9 when sending a tx?"

User<6247944943>: What is the item_code here is?   Anyone know it?   https://github.com/TelegramMessenger/telemint/tree/main/func (reply to 35912)

&rey: It's code of NFT item contract. (reply to 35933)

&rey: The data you sent is truncated (cell underflow). (reply to 35932)

5: Does anyone know how the payload parameter of the TG membership API is converted

&rey: It's BOC. (reply to 35936)

User<6247944943>: more specifically, it's the initial code for the smart contract right? (reply to 35934)

User<6247944943>: then it will changed on each NFT item even in the same Collection contract or no?

&rey: Initial code for all NFT items is same, initial data is different. (reply to 35941)

5: te6ccgEBAgEANQABTgAAAABUZWxlZ3JhbSBQcmVtaXVtIGZvciAzIG1vbnRocyAKClJlZgEAEiNrenJHVVQzVw (reply to 35939)

&rey: https://docs.ton.org/develop/data-formats/cell-boc https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages#simple-message-with-comment (reply to 35943)

Howard: how possible? Since every NFT item has different parameters name and code? (reply to 35942)

&rey: Code is the same, parameters and name are in data (if even on blockchain, since some NFTs have offchain metadata). (reply to 35951)

sdw: Hello, How's it possible to convert this string  0xfff8c85d781878280d6bcac270e2f65783cea44ed8ed6ca3d42c6e4c578ec681 to address in ts. I have taken it from the contract as info and is coming as "num". thank you

Freed: is this mainnet? (reply to 35953)

sdw: yes

Freed: do you know which address should it convert to? I have tried converting, and this is what I got: EQCBxo5XTG4s1KNs7dhOpM6DV_bicMLKaw0oeBh4Xcj4_zDT (reply to 35955)

sdw: I think is this one

sdw: what did you use to convert

5: May I ask how to change a string to another line in Payload

Андрей: ton.org/address (reply to 35958)

sdw: for javascript/typescript? (reply to 35960)

sdw: replace x with : and then use Address.parseRaw....... (reply to 35953)

Mert: Hi all, the grant system confusing me. Ton Grants in Questbook and Ton Telegram Web3 Grants in Questbook still active?

Mert: What about Ton grants-and-bounties Github repo (https://github.com/ton-society/grants-and-bounties?tab=readme-ov-file) Does it related to questbook?

Dmitry | backend4you.ton: It says "On our Questbook page..." right in the readme (reply to 35968)

Mert: I have seen it already. it says, 'well we have submission on questbook too' and nothing else. As I have understood right, grants are on questbook, bounties on that repo. Some people also referenced their questbook proposal in Github issue proposal. And questbook redirects some people to Github. It is where this becomes confusing.

Ruslan: Hi guys sorry for a silly question, it is coorect that TON smart contract programming language is TACT?

Coalus: You can use fift, func, rift, Tact, ton-solidity to create smart contracts on TON (reply to 35973)

Ruslan: OMG, 4 languages, and which language i used in the ton wallet to send transactions, maybe you now ? (reply to 35974)

Denis: Really only funC :) (reply to 35975)

Ruslan: But then why other languages are needed, very unusual 1 blockchain 4 languages...?

Denis: Fift - is very native for ton but not friendly for developers who doesn't have experience with esoteric languages. First ton language. Tact - very friendly and perspective but creates too expensive code now. Maybe in the future. Solidity - alternative made by everscale team. It compatible with ton, but nobody uses it. Maybe few marginal developers

Ruslan: thanks Denis, maybe you now where to find docs and materials about Fift?

Coalus: This should help:  https://docs.ton.org/develop/fift/overview  https://docs.ton.org/fiftbase.pdf (reply to 35979)

Ruslan: Thanks  ))

— 2023-10-11 —

Jeff: Hello! I posted a question about address in TON answer. Does anyone know about it?? Thanks!   https://answers.ton.org/question/1622597223172804608/inconsistent-bit-slice-start-when-calling-my-address-in-different-contexts#post-1622597223172804608

User<6339466220>: Hey TON DEV, is ok ask for LinkedIn here ?

User<6339466220>: mean can developers sharing LinkedIn in public chat ?

User<6339466220>: ⚠️ Well.. Who think he is tiger in TON Developing — send me ur LinkedIn in msgs please

&rey: This chat is about technical/engineering questions. Better if you described the project first. (reply to 35983)

&rey: > Therefore, when calculating a child contract address using my_address, it yields different results depending on the context in which it's called. These slices shouldn't have any difference. They totally don't have it in calculating subcontract address, since jettons do work, meaning that problem is in your code. (reply to 35982)

Behrang: Answered there. (reply to 35982)

Jeff: Oh ok. I'll check again. (reply to 35987)

Jeff: Thanks!! I'll check again (reply to 35988)

Falco: What's the easiest way to obtain the  user-friendly address from a wallet file generated by mytoncore/mytonctrl using Python?

eg: Hi! I have a blockchain game written in Solidity, with a JavaScript interface and a Node backend.js  I want to add my game to the TON blockchain and Telegram bot.  What steps should I take? Should I first write smart contracts in Tact language and then add wallet support to the website?

Daniil: Generally speaking, yes, just rewrite smart contracts on some TVM language and adapt the front end. But It sounds easier than it is. (reply to 35992)

JozzyF: Hello, i am trying to setup a full node but "Local Validator Status" does not show up when i call mytonctrl status

Amir: hi is there any expiration time for api key that generated by @tonapibot ?

&rey: There shouldn't be, though you always can migrate to ton-access by Orbs. (reply to 35995)

Falco: Do you happen to have any idea @pcrafter 🙏🏻?   I also tried find_wallet function from pytonlib but it doesn't seem to work on the wallet.😞 (reply to 35991)

Adam: Hi! Do you know how can I find example fift/func code to research? Ideally git repos or something.

Daniil: https://docs.ton.org/develop/smart-contracts/examples (reply to 35998)

Maxey: Can anyone provide guidance on using Tact to handle TON Metadata Parsing, as described in the documentation here: https://docs.ton.org/develop/dapps/asset-processing/metadata?  I'm trying to develop a function akin to makeSnakeCell() to ensure Jetton token information is accurately displayed in the TON viewer. Currently, if the metadata is not parsed correctly, the token is shown as an unknown token. Any assistance or insights would be greatly appreciated.

Maxey: I am currently writing code to deploy a Jetton Master within a contract, but the content can't be parsed by the TON viewer at the moment, resulting in it being displayed as an unknown token.

Dmitry: yo guys! does anybody know an example how to transfer jettons with this lib https://www.npmjs.com/package/ton  transfer did work fine with TON but have no idea how to make it work with other tokens, thanks in advance ✌️

Maxey: Has anyone know how to storeDict() in Tact? For now, I use StoreRefs(dict_variable.toCell()) to store, but it seems like it’s different than using storeDict() in Typescript

&rey: .storeUint(1, 1).storeRef(d.toCell()) (reply to 36003)

Maxey: Why have to storeUint(1,1) first?

Daniil: Because dict is basically a MaybeRef structure. So you first store one bit indicating whether the dict is empty or not, and then if it’s not, the dict itself in a reference (reply to 36005)

Alexander: Hi guys, is there any caching service for TON to quickly pull data into frontend? I realize that just calling contract getters via SDK would be ineffective for page load time, and backend caching is also a compromise.

Maxey: However, i will get error code 5 (Integer out of expected range) when i execute testing   Reference tx: https://testnet.tonviewer.com/kQAlWOcArecooF3NOiKjz18zdLM19ivvs3dA3LawsI6TlCIm/transaction/a089be76ba4845b283f68cec92676d44a766efe3e83d14afc98d2879cf4423f7 (reply to 36006)

Daniil: You should do storeUint(1, 1). Not int. (reply to 36008)

Daniil: Or you can use storeInt(-1, 1) for the same effect

Maxey: I would like to ask for further help. There is still difference between tact Cell and typescript Cell.

Slava: 🚀 Hey devs!  😎 You have a unique opportunity to choose interesting tasks from our flash grants list:  • Gas management in smart contracts • Creating authorized controllable tokens • Creating a FunC track on Exercism.org • Tutorial on converting FunC language to Tact language in smart contracts  👨‍💻 Select a task that interests you and join the project.  This is a chance to make your contribution and expand your experience. More detailed information is available through the links. Good luck!

Tasteam: Greetings! Looking for CTO to Ton project. A big and interesting project. With relevant experience in running and developing blockchain/NFT products and utilities. Send me cases and portfolios.

Dmitry: yo guys, what's the logic to convert user input amount from let's say 0.2 to 6 decimals for jUSD for example

&rey: Multiply 0.2 by 10^6 (1 000 000). (reply to 36016)

Dmitry: thanks!

123.Fuxked: Is anybody here launching any project anytime soon?

— 2023-10-12 —

Alex: Hello!  We are looking for a strong STO (Chief Technology Officer) for our startup that specializes in liquid TON coin staking on Telegram and beyond.  We offer a unique opportunity to join our team and make a significant contribution to the development of the project. At the moment the startup is in its infancy and is awaiting a grant from Ton Foundation.  Requirements:  - Experience in blockchain technologies, especially in coin-stacking. - Deep knowledge of Telegram and its capabilities. - Experience in project and team management. - Ability to analyze the market and propose innovative solutions. - Desire and ability to work in a team and achieve goals.  Responsibilities:  - Development and implementation of TON coin steaking strategy in Telegram. - Managing the technical aspects of the project. - Working with the development team and other project participants. - Analyzing the market and searching for new opportunities for project development. - Risk assessment and minimization.  We offer:  - Participation in a unique startup with great growth potential. - The opportunity to make a significant contribution to the development of the project. - Work in a team of professionals and experienced specialists.  If you are interested and meet the requirements, please send your resume and a short letter about your experience and motivation to personal messages: @voichak_dev, @SoulCompany_D  We will be happy to consider your candidacy and discuss opportunities for cooperation.  Sincerely, SoulCompany

R: Hi, guys. I want to know how can I convert transaction hash from base64 to hex, like this

&rey: Python: base64.b16encode(base64.b64decode(b'nqn...')) (reply to 36021)

&rey: Just a quick question re "unique startup": do you know that there already are several liquid staking projects and one is already recognized by TON Foundation (https://t.me/toncoin/879)? (reply to 36020)

Alex: There we know for sure that we can be very good competitors (reply to 36023)

R: So another question is how do I convert a bigint to hex?

R: My questions might be a bit silly because I'm a newbie😹

brian: hello Can I ask question about TWA?

Alex: Hello! Sure, you can ask TWA related here. (reply to 36027)

brian: It seems that there is no 'done' button in the mobile input window of the TWA app. Is that correct?

Lukas: on https://core.telegram.org/bots/payments I can not find wallet as payment Methode. why is that this way?

&rey: They haven't yet added it. (reply to 36030)

Lukas: Ok but they will?

BLUE: Hi. I am a newbie of TON. Currently I don't know how to connect the smart contract to the interface. Can you guys help me, and it would be great if you could give me specific examples

Daniil: https://docs.ton.org/develop/dapps/ton-connect/overview (reply to 36033)

HoZ_LaSagesse 🍋 🐾SEED 🌱 No DM u First !: I'm new to programming, and I'd like to learn how to design a mini-application on Telegram and also create an NFT collection on TON. How do I do this and where do I start?

Daniil: docs.ton.org (reply to 36035)

Alex: TMA - https://docs.ton.org/develop/dapps/telegram-apps/   NFTs - https://docs.ton.org/develop/dapps/tutorials/collection-minting https://docs.ton.org/develop/dapps/asset-processing/nfts (reply to 36035)

BLUE: For the backend of a web2, I will have to write an API to connect to the fontend. In web3, I learn and use blueprint to write and deploy a smart contract, but then I don't know how to call it from the frontend.

&rey: You can get started at https://docs.ton.org/develop/smart-contracts/tutorials/multisig-js and https://docs.ton.org/develop/dapps/. (reply to 36038)

Roman: try this  https://docs.ton.org/develop/dapps/ton-connect/message-builders (reply to 36038)

Lukas: Gibt es den source code für @PineAppleDemoWPStoreBot some where or the documentation on how they implemented  the payment feature ?

Oleksandr: https://pay.wallet.tg/ https://docs.wallet.tg/pay/ (reply to 36041)

Lukas: Thank you 🙏

KaLL1mat0RR: What's the bot in your a stories? (reply to 36042)

Vardan: Hi guys, do you know any team member or business development manager from this wallet? (reply to 36042)

Arelkench: Hi! Was signing on the tact challenge, setted up a wallet, but bot continues to ask for a valid address. Both adress formats don't work, commands also. On tonscan adress is active, What should i do?

— 2023-10-13 —

H: What does it mean to be unable to simulate trading?

User<6247944943>: how much bits we load for load_msg_addr?

User<6247944943>: 256 bits always? No matter which workchain etc?

Behrang: Depends on the first two bits:  addr_none$00 = MsgAddressExt; addr_extern$01 len:(## 9) external_address:(bits len)               = MsgAddressExt; anycast_info$_ depth:(#<= 30) { depth >= 1 }    rewrite_pfx:(bits depth) = Anycast; addr_std$10 anycast:(Maybe Anycast)     workchain_id:int8 address:bits256  = MsgAddressInt; addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)     workchain_id:int32 address:(bits addr_len) = MsgAddressInt; _ _:MsgAddressInt = MsgAddress; _ _:MsgAddressExt = MsgAddress;

Behrang: And also some other flags and variables.

Lillac🦴: hello, i was trying to deploy dapp on vercel but the toncenter was forbidden when deploying

Lillac🦴: any suggest?

Marius: Is there a reason why the compute_returned_stake method of the elector contract only returns a stake>0 for like 5 validators?

Marius: Shouldn't pretty much every validator that participates in the election get a reward?

User<6657272040>: Hello everyone, I just joined😜

Lillac🦴: no answer for this q? (reply to 36052)

&rey: Proportional to number of generated blocks. (reply to 36057)

&rey: Maybe you've called this method just after election start? (reply to 36056)

🐰SAMUEL GIFT🍅: Hello guys, Felix Vaughn here, I'll like to speak with the admin.

🐰SAMUEL GIFT🍅: Happy to be here

Yogi lian: Hai

User: How to check if element already inside a tuple? Func.

💎 Alireza 💎🥠 🐈‍⬛🐾: I have been using Telegram for several years and I am hopeful about its progress and future. But Telegram can still make a lot of progress. Toncoin and Telegram Wallet have become very useful, so Telegram can have apps like Instagram and Twitter. If such a possibility exists, definitely many people will migrate from Instagram and Twitter apps to Telegram. Do you have such an idea for the development of Telegram?

💎 Alireza 💎🥠 🐈‍⬛🐾: ?? (reply to 36068)

ⓌⒷ Rosé 🇺🇦: just state your concern. they’ll reply once they’re available. it also avoids getting ras-ed (reply to 36062)

💎 Alireza 💎🥠 🐈‍⬛🐾: details?? (reply to 36068)

💎 Alireza 💎🥠 🐈‍⬛🐾: Please explain about the project! (reply to 36071)

🐰SAMUEL GIFT🍅: Alright (reply to 36070)

— 2023-10-14 —

Howard: where can we check more details in Block generations and the consensys principles?

Howard: And by the way https://tonight.dev/game seems down.

Luke: does anyone know if there are libraries that include jetton and nft contracts for testing, like the Treasury contract in blueprint

Daniil: https://docs.ton.org/catchain.pdf (reply to 36076)

Arti: Hi, TON Builders, we're looking for a top-notch specialist to join the Evaa Protocol team! 🔍  📌 Requirements: - Tech education - Experience in FunC - Ready for full-time commitment   If you have any direct recommendations, send them our way! Will definitely reach out. 👨‍💻🔥

Mahdi: Hello guys. I want to know, do we have something like ERC-1155?

&rey: Fungible tokens? They are called jettons here. (reply to 36082)

Mahdi: It's combination of erc20(jetton) and erc721(nft).  You can have several token with several balance. (reply to 36083)

Howard: currently, no. (reply to 36082)

Denis: Also interesting. Tonplay wanted to make new standard for SFT but it was very bad. And really they just wanted to change display style for tokens.

Denis: But we can make in ton erc-1155 analogue. Mostly like current jetton implementation but with few assets inside one jetton wallet and jetton master. It can't be adopted for NFTs, but for jettons can work.

Howard: I think we need ERC1155 feature.    This solution need Getgems.io or NFT Marketplace support (reply to 36087)

Denis: I don't see any sense in merging jettons and NFTs in one contract.  And how do you see it for NFTs?

Denis: For jettons it easy. Just a map with few jettons inside. It will not have constant gas price for transfer, but it can't grow unlimited because number of available jettons limited by master contract.

Denis: For NFTs I think better to add analogue of erc721enumerable for storing all items in one collection.

Denis: This solution doesn't have unlimited scalability but 99% of NFTs doesn't need it

Howard: I think I will put SFT like multiple-Jetton Token contracts structure, but having the a different Field

SKALEZ: Gm Gm guys

Jangju: ton We are trying to detect and change the network account address (hex). Has anyone applied it in a similar way? Or is there a problem?

Mert: Hi, is there anyone from the grant team that I can contact to? We are a team of couple people and developing a protocol aggregator tool called Flowana. It has detailed statics of all projects in protocol, as well as overall development statics, its forum, developer activities, and more. Currently more than 4 protocols have supported us.

Jangju: i want to recognize and identify the ton's hex address based on evm.

&rey: Bounced messages cannot bounce again. (reply to 36099)

&rey: > If the receiver is unable to parse the received message and terminates with a non-zero exit code (for example, because of an unhandled cell deserialization exception), the message will be automatically "bounced" back to its sender, with the "bounce" flag cleared and the "bounced" flag set. https://docs.ton.org/develop/smart-contracts/guidelines/processing (reply to 36101)

Javad: Is there an api to get price of jetton ?

Denis: https://dev.tonapi.io/v2/rates?tokens=0:cd872fa7c5816052acdf5332260443faec9aacc8c21cca4d92e7f47034d11892&currencies=ton,usd

— 2023-10-15 —

metadisk: GM

Howard: is there anyone same as me that need the dot-tree-graph for Txs messages when testing?  I know sandBox can print the Fee / ForwardFee for one Tx.   But the problem I need is checking "how message jump in each addresses"

Howard: I need more like this, to check how the end-to-end messages is addressed. (reply to 36106)

Maxey: Does this meet your need?

Xander: import { prettyLogTransactions } from '@ton-community/sandbox';

yophy: Hello

yophy: when I send message to contract, can I input any number for queryId?

play of the game: So is the only way of finding out the incoming ton from a message to subtract old balance from new balance?

&rey: No, it's provided as msg_value (context().value in Tact). (reply to 36112)

Luke: does nativeReserve reserve from the contract balance or the message value?

&rey: From the contract balance after adding incoming message value. (reply to 36114)

Luke: do you know how that would affect SendRemainingValue? (reply to 36115)

&rey: Probably it won't and contract will try to send whatever incoming message value was. (reply to 36116)

Luke: k thx

Howard: yeh, what is this? (reply to 36108)

Maxey: prettyLogTransactions(tx.transactions) (reply to 36109)

Xander: import { prettyLogTransactions } from '@ton-community/sandbox'; (reply to 36119)

Howard: got it. Nice.

play of the game: Thanks, Also is context sender the same as sender? (reply to 36113)

Howard: 1/ awesome, but don't you think it would be great if we can add the op_code to find out the input, or the FeeCost...etc?   2/ Or showing the address in Tag value that we claim previously, like we did earlier in the test code: admin = await blockchain.treasury("admin");   For now, you need spending more time in counting the addresses. (reply to 36108)

Howard: Yeh, better than the tables we printed previously. It's better to understand the tx records now. Thanks.   #@ton-community/sandbox #sandbox

🅰🅻🅰🅽: I also agree to include the op_code (as well as the message name) in the testing tool, as it will indeed make testing more convenient. (reply to 36124)

Maksim: How is a validator pubkey related to nominator pool address ? For example I have the following list of pubkeys retrieved from an API service:  [ {'public_key': '92a6d8a78afb98bb2c9e6f437e9b4f91bf8fbd1846ea13b135b03a5803449167'}, {'public_key': '976275284468adc04ee96dfa6c148840984f35d436223e0634721942bef8e7c4'}, {'public_key': '8df51bf9b1ba2826d96d5a7344eb463e19c3221ed7952d8bda9d081381750f12’} ]   How can I now map them to a nominator/validtor pool on TON ?

Maksim: The question is basically how can i translate these pubkeys to nominator pool addresses ? (screenshot from https://tonapi.io/api-v2)

&rey: You need some indexer to do that — probably dton.io/graphql. (reply to 36129)

Maksim: Is there no way to simply get the active set of validators on TON using an API ? (reply to 36130)

Maksim: I would be very surprised since this is a pretty common query

Maksim: This query returns “not implemented” 😅

&rey: Probably it's possible to query the Elector to get addresses of nominator pools. (reply to 36131)

&rey: This is a highly uncommon query, actually. (reply to 36132)

Maksim: That is what I thought too, but get methods only seem to return election information :  https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc (reply to 36134)

Maksim: https://github.com/ton-blockchain/ton/blob/65d22c46d9955041baad11a5dbd9a2c8c21beaf9/crypto/smartcont/elector-code.fc#L1033

&rey: https://github.com/ton-blockchain/ton/blob/65d22c46d9955041baad11a5dbd9a2c8c21beaf9/crypto/smartcont/elector-code.fc#L267 (reply to 36136)

&rey: You may also download contract data using toncenter/tonapi/whatever else.

Maksim: …. 😅 (reply to 36139)

Maksim: Not sure what you mean by this though ? Would have to back engineer the validatro set’s information in the contract storage  ? (reply to 36139)

User<5921117343>: Are nft standards mature on TON ? Point me to repo please

&rey: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md (reply to 36142)

Ken: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md (reply to 36142)

Handsome: Please where can I see DNS to bid on? Someone just took my DNS, something that I took time to conceive in my mind. So I want to know how the person saw it.

yophy: anyone know how I get jetton balance by ton sdk (nodejs)?

yophy: I can get Ton balance. but I don't know about jetton balance

Erik🆓: It could maybe be the NFT TONificator bot: (reply to 36145)

Erik🆓: Click Channels.

Erik🆓: My subscription just expired, but after subscribing, it might be possible to click TON DNS Domains and then subscribe to Mint events. When I subscribe again, I will test and let you know if it works.

Erik🆓: I heard before about someone trying to create a domain and someone else bidding over. That is a problem if you want a particular good but long (and therefore cheap) name. There are 2 strategies to avoid it: 1. Find a good short name. It will be too expensive for someone else to bid over just for speculation. 2. Find a few similar names that look just as good, and mint them first. If someone is trying to steal them, they can have them. When they run out of money or interest to steal your names, mint the name that you really want. (reply to 36145)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Follow the transaction, incomes and outcomes, may you find an tg linked wallet and ... (reply to 36145)

Matin: Hi, can someone give me a link about how to work with nfts in tact?

Pedram: #question  I have some Ton Coins in my @wallet.  I'm from Iran and my country is under US sanctions. I've repeatedly heard that Iranians shouldn't use @wallet with a Telegram account that is logged in with an Iranian phone number.  Now I fear losing my Ton Coins. Please tell me what will happen if I have some coins in my @wallet on a Telegram account that is verified with an Iranian phone number.  Should I withdraw all of my coins as soon as possible?

Denis: We can't give you recommendations to do anything ASAP, but you should understand what only noncustodial wallets give you full control of your money. (reply to 36154)

Denis: But noncustodial wallets also gave you full responsibility and if you lost you seed phrase or gave it to a hacker you lost your money

Behrang: How about reading config 34? (reply to 36131)

Mark: Start

Mark: /.start

Dipanshu ( Normie.Tech ): Hey I am looking for some gig work in ton, would be happy to take payment in Ton or any other crypto...  I do full stack development with Typescript and also Func

A: The article "Introduction to Fift" isn't formatted correctly in mobile view, it seem to be the only article with this problem.

— 2023-10-16 —

cloud: hey, can anyone run a archive node? Or is it permissioned from the TON Foundation?

Tim: anyone can (reply to 36162)

Tim: you just need to get dump from somewhere to start

User<5660798371>: report this problem to @ton_help_bot. (reply to 36161)

cloud: thanks Tim (reply to 36164)

Sean: GM

Daniil: There's a full guide: https://docs.ton.org/participate/run-nodes/archive-node (reply to 36162)

Pathfinder: what are Fift and FunC?

&rey: Programming languages for TON. See more at docs.ton.org. (reply to 36169)

Pathfinder: Tact compiles to FunC that compiles to Fift, which makes makes Tact very abstracted and high level. is my understanding correct

doni: Hi Im looking for a tool that simulate a transaction

doni: i want to simulate a transaction from wallet x with payload y   and the tool will result the out put …

doni: it also would be nice the opcode will skip the op code of siganture matching

doni: so i can simulate any transaction from any wallet

doni: ( i remeber there was a tool like that in the early days of ton )

&rey: toncli run_transaction npm blueprint sandbox (reply to 36172)

doni: ok i know   i hoped for an onlinextool

doni: there was something in the past

Alex: Hello everyone, I'm working on a startup and we need help or advice on UI in webApp , let’s DM)

Fantasy: Hi, please dm me for the more details (reply to 36180)

User<6587894089>: This is amazing.  Feel me to send a DM, mate. (reply to 36180)

Pathfinder: how to get the balance of wallet address with @ton/sandbox?

Igor: Hi Everyone! Will the future, fully-approved/audited TON ledger app maintain backwards compatibility with the current TON ledger app in ledger live (only accesible in developer mode)? i.e. will addresses derived with the current ledger app match those derived by the new release assuming the same mnemonic and derivation path is used? Thanks!

— 2023-10-17 —

User<5762094943>: hey anyone can help me I have build smart Contract and I want web deploy of TON Net because it hard to install all that requirements

Mikhail: try to do it with gitpod (reply to 36187)

&rey: You can use Github Codespaces or https://ide.nujan.io/. (reply to 36187)

liminal: Hello, I'm actively looking for a gig or full-time job. Skills: Blockchain(EVM & TVM compatible), Typescript, FunC, Fift, Solidity, Docker, REST API.

Jamie: Hello there, is the total supply of anonymous number fixed?

Howard: Hello, Pro-Devs in TVM and FunC:  - Is it possible to decompile my Smart Contract based on the initial code and the subsequent state changes in my contract?    - What do you think is the major risk for Tact projects?  - Is FunC already secure enough? Could it experience the same issues as the Vyper Compiler in Curve.fi? https://cointelegraph.com/news/curve-vyper-exploit-whole-story-so-far

Daniil: You can decompile the code Cell to the set of TVM opcodes, which is already enough to decompose the logic (reply to 36200)

Howard: then next question, I don't see any tool yet like evm.codes, or evm.storage?   even the Sandbox is hard to understand / show contract data now? (reply to 36201)

Daniil: well, for the first one - we have a page in docs: https://docs.ton.org/learn/tvm-instructions/instructions (reply to 36202)

Jamie: Hello there, is the total supply of anonymous number fixed?

&rey: 1. It is possible. Even if your contract erases itself from blockchain. 2. Insufficient gas. 3. TVM already forces developers to think about reentrancy, so bug is less likely to occur in the first place. (reply to 36200)

&rey: Telegram has authority to mint new numbers if they decide so. (reply to 36204)

Howard: (Have you ..... noticed that the table doesn't scale..... when you change the zoom size of the webpage? It's a pain for me for some reason.)  Yes, but perhaps a better user experience could be provided to help people like me who are learning the details understand the instructions better. (reply to 36203)

Anton: Is anyone here with Tact knowledge? How should I cast optional type to a classic one? addr: Address?; ... let a = (Address)addr; let a2 = addr as Address; let a3: Address = addr; none of those worked. Can't find a valid way...

Shyaamal | TON: Hey devs, India's Largest Student Run Hackathon hackCBS is here again with its sixth edition.  This time we have TON foundation supporting us as a Title sponsor for our event. So all the folks who are building on TON or who are looking forward to build something amazing on it, do register for the event.  Website: hackcbs.tech Dates: 4th - 5th November, 2023 Venue: Shaheed Sukhdev College of Business Studies, Rohini, University of Delhi

II: Hi, about work We already have a successful project called "Bobster payments» https://bobster.org/ which is a platform for money transfers and cryptocurrency exchange. We actively collaborate with p2p traders and cryptocurrency exchangers from different parts of the world. Currently, our system is partially automated, but we aim for full automation.  To achieve this goal, we are considering the possibility of integrating with the TON Network, seeing it as a solution that will help us enhance the efficiency and reliability of our services. At present, we are actively searching for experienced professionals capable of developing the concept and ensuring its successful implementation. The terms of cooperation are ready to be discussed individually with the specialist or team.

Songer: How works api price of a X jetton ? if i provide liquidity en X dex it's automatically or i need to do somenthing else ?, please anyone can help me :D

Alex: Hello everyone, I have developed a smart contract and want to deploy it to a test network where I can take 240 tons for deployment?

123.Fuxked: Check Dm (reply to 36180)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://tonconsole.com/ (reply to 36216)

— 2023-10-18 —

Danil: Hello! I'm getting wallet transactions by method /gettransactions at toncenter API.  1) How to get transactions block seqno/hash? 2) How to understand if transactions successfull or failed?

Javad: how convert wallet address with start EQD...  to raw format 0:.... with ton library ?

Alex: check dm (reply to 36223)

Ruslan: Hello,  1) unfortunately there is no block seqno in transactions in /api/v2. You may find block_ref in indexer api (method /transactions) 2) check description field of /transactions response. (reply to 36222)

Danil: Thank you! What is the difference between /v2 and /index API? The index api is outdated? Also, can be a case when block seqno for transaction would be changed? (Read about this in chat, but I have no idea how it can work) (reply to 36226)

TON Answers Bot (not AI): Quiz 6 from FaizanM  What makes TON a game changer in competition with numerous Layer 1 competitors is its synergy with Telegram. ?  This is because it is tailored to . One of the biggest concerns in the crypto industry is public penetration, that is, making blockchain-based services penetrate the public's daily lives.  🔗 Answer on TON Overflow

Ruslan: /api/v2 service (called ton-http-api) wraps tonlib c++ library: each request goes directly to LiteServer (or sometimes executes inside tonlib)  /api/index service indexes whole blockchain in traditional databases  (sql in our case) and querying data from this database instead of blockchain.  Indexer has more data aggregating and filtering features and could response faster than ton-http-api service, meanwhile it is more difficult to setup and maintain.  From the other side, ton-http-api takes data directly from blockchain and checks proofs. Therefore it is more reliable than indexer service. (reply to 36227)

Danil: Thank you! (reply to 36230)

BugsTON: Hello. Why liteservers 12, 13, 16, 17 - error connection refused? When will update global.config.json? (reply to 36233)

Erik🆓: I am subscribed ton NFT TONificator again and jonined the channel for TON DNS Domains. I can see that someone started the auction for boys-flush-royal.ton and I have 32 minutes to bid over.

Erik🆓: 📦 boys-flush-royal.ton Mint  Owner: UQ...mjcd Min. bid: 2.241031244 TON Ends in: 59m      #Mint #NFTboysflushroyalton 💬 @nfttonificator_chat (forwarded from TON DNS Domains | Marketapp)

User<5762094943>: To setup your local machine for development, please make sure you have the following:  -A modern version of Node.js (version 16.15.0 or later)  -The func CLI tool (FunC compiler)  -The fift CLI tool  -A IDE with FunC and TypeScript support (reply to 36206)

User<5762094943>: I had problem when install |func CLI tool| it problem of version ubuntu  I want solution I want an alternative solution like an online environment can install and deploy smart contract (reply to 36238)

— 2023-10-19 —

Sarv: gm gm

Sarv: currently building porfo.gitbook.io

Sarv: Would really want to connect with someone from the Ton ecosystem. Really want to go all in here with tele!!

Peter BıƖƖıơŋs: What’s the building process on TON blockchain  And what’s the adaptiveness for builders like?

frlyh: This collection EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo - MRDN do not check getTokenData information through RPC interface. Return 503. Is this a bug? https://toncenter.com/api/v2/#/accounts/get_token_data_getTokenData_get

Howard: it's not in the Jetton Standard interface I think.   The contract code not followed TEP standard. (reply to 36254)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: This is not really fair to those who started the development in TON with TACT. I worked hard to finish the tasks, but now my position is the same as the people who completed 4 tasks. Because people by abusing their knowledge are at the top of the table by using nativeSendMessage. So this is not the challenge of the new language, it is the challenge of bypassing the limitations of the new language.

Tim: I don't think many people at the top use native message

frlyh: getgems can be marked normally. (reply to 36255)

frlyh: And the nft_item under the collection is recognized by RPC as normal

frlyh: RPC should be able to tag this collection, or provide another way to tag it

ritchie: Holy shit, look what you said, what you need is private key not mnemonic ? do you know what problem does the hd wallet appear to solve? (reply to 215)

ritchie: The emergence of standards is for compatibility. Why does TON have to be unconventional ? (reply to 232)

freedom: Can you give me a ton, a demo of generating private keys and addresses based on 12 mnemonics and derivation paths?

freedom: The official golang sdk can only generate private keys and addresses for 24 mnemonic phrases. I want to know what standards the trust wallet is based on. Our wallet currently wants to be connected to the ton chain.

freedom: Are there any technicians in this group? Can you give me an answer?

Dmitry | backend4you.ton: All official TON SKDs are able use only 24-word mnemonic, AFAIK. Source C++ code uses 24 words.

freedom: trust wallet supports 12 mnemonic words

Dmitry | backend4you.ton: I believe it's better to ask in their chat how their 12-word mnemonic may be used to restore TON account in other 24-word wallet, but maybe somebody here knows too... Always worked with 24, sorry.

freedom: Who can help me？, I urgently need it, thank you very much

freedom: No official answer?

Master: Hi, what do you need? (reply to 36274)

&rey: There is no well-defined standard for that. (reply to 36263)

Slava: 🚀 Hey devs!   😎 Among all our tasks, there's one that's especially hot, awaiting its champions!  Should you choose to accept this mission, it's to create a FunC language track for Exercism: an open-source platform that already supports 62 programming languages. Let's make FunC the 63rd!  👉 Exercism FunC Track Examples [1] [2]  Looking for more opportunities to contribute?  🍭 42 Active bounties →  👷‍♂️ 9 Approved bounties. Actively searching for an assignee →   💬 12 bounties under suggestions. Share your opinion →

Narek: Hey! Trust wallet has their own algorithm for that and their mnemonics are not compatible with well-known TON wallets. So there is no standard for 12 word mnemonics in ton. (reply to 36273)

sdw: Hello, do you know if there is any way to track staking rewards? \

User<5762094943>: To setup your local machine for development, please make sure you have the following:  -A modern version of Node.js (version 16.15.0 or later)  -The func CLI tool (FunC compiler)  -The fift CLI tool  -A IDE with FunC and TypeScript support  I had problem when install |func CLI tool| it problem of version ubuntu   I want solution I want an alternative solution like an online environment can install and deploy smart contract  Because i want deploy jetton smart contract on TON  PLS any help!!!

Daniil: just do "npm create ton@latest" anywhere to create a Blueprint project with everything installed (reply to 36280)

User<5762094943>: https://github.com/ton-defi-org/tonstarter-contracts/#dependencies-and-requirements check that to understand what I try to make (reply to 36281)

Daniil: This repository has been archived by the owner on Feb 1, 2023. (reply to 36282)

Daniil: Use modern tools (reply to 36282)

Иван: Hello!

User<5762094943>: this command "npm create ton@latest" enough, because it will install all libraries will need and I won't need install that manually (reply to 36284)

Danil: Is workchain index/shard (-1 / 8000000000000000) the constant values and not will be changed?

Ruslan: This is shard of masterchain. In masterchain could be only one shard, so it is constant for masterchain. But in workchain 0 there could be many shards (reply to 36287)

Sam: Anyone have any clue why a validator would be minting blocks on the shardchain but not the masterchain? val #17: pubkey A0796421C3F24229B3B4420CF60960747B5440E4C22E86A113F4463BC14CA5AD, blocks created (0,39), expected (100.666667,36.098338), probabilities 0.000000 and 0.500000 [ 1][t 1][2023-10-19 14:33:54.822216196][lite-client.cpp:3671][!testnode]       validator #17 with pubkey A0796421C3F24229B3B4420CF60960747B5440E4C22E86A113F4463BC14CA5AD : serious misbehavior detected: created less than 90% of the expected amount of blocks with probability 99.999% : created (0,39), expected (100.666667,36.098338) masterchain/shardchain blocks

Mahdi: I got this from TON App Bot. Do you know where we can fix this one? ton app team?

User<5101913003>: breh (reply to 36291)

&rey: It may consider masterchain block invalid thus not creating further blocks there (and not upsigning the absolute validity of blockchain), while signing basechain blocks asserts only their relative validity. (reply to 36290)

&rey: I think this may be a synchronization issue.

BugsTON: 4 shards on basechain (reply to 36287)

Danil: error in my message, I meant masterchain (reply to 36295)

Rahul: const contract = new StakingMaster(        Address.parse('contract address') // replace with your address from tutorial 2 step 8    );   client.open(contract) as OpenedContract<StakingMaster>;  Error  Argument of type 'StakingMaster' is not assignable to parameter of type 'Contract'  Any idea why my contract not open by this method? I am using react and react ton package

Rahul: i am using testnet and contract deployed on testnet also. and getting this error when run =  Uncaught (in promise) Error: Invalid address     at openContract (openContract.js:18:15)     at TonClient.open (TonClient.js:250:31) (reply to 36297)

Kev: Hello everyone, we're looking to launch games on Ton chain.  Can we please get in touch with ecosystem manager?

&rey: Please elaborate a bit: are you looking for future promotion, help with development, available ideas or something other? (reply to 36299)

Kev: We will like guidance and support for our launch. (reply to 36300)

Kev: We have 1 of 5 games ready

Kev: for Ton chain

Kev: We'll like to connect with wallet partners and collaborate with other teams in Ton ecosystem as well to make our launch effective.

Kon: @tonplay_devs (reply to 36299)

Sam: Do you have any tips on checking and ensuring a node is synchronized properly (reply to 36294)

&rey: I have only one idea: check logs. (reply to 36306)

Rahul: https://ton-community.github.io/tutorials/03-client/  i think this tutorial has a mistake please solve 😒

— 2023-10-20 —

Jamie: Hello there, I am setting up a TON site. If I am having multiple “.com” domains on the same server, how do I tell my “.ton” domain the correct redirection?

Jamie: One more thing, I am trying to access ton site via mytonwallet’s ton proxy, but it doesn’t work on chrom at all. Any non Russian support for that?

Jamie: I got this, there is a switch on the setting page (reply to 36310)

Jamie: 2023/10/20 03:42:02 DHT ADNL address record for TON Site was refreshed successfully on 5 nodes to ip xxx.xxx.xxx with port 80  My Ton site should be available but I cannot access it via my TNS (reply to 36309)

Jamie: The IP is an existing web server

trouble_breaker_hari: Hello! Please provide instructions on connecting my API node in code and retrieving the RPC endpoint Port number. Additionally, I would appreciate a sample code for reference.

Kevin.p: hello , guys, where can I find the network config like ConfigParam40:MisbehaviourPunishmentConfig mentioned in doc  https://docs.ton.org/participate/network-maintenance/staking-incentives?

Sam: The status log shows that last masterchain block is roughly 3000-5000ms ago (reply to 36307)

Jamie: Anyone have successfully deployed a TON site? (reply to 36313)

Howard: +2, "Ignore any errors arising while processing this message during the action phase"  In Send Raw message, we have this specific sending method (+2), what is the general Errors will we get during the processing messages during the "auction phase"?

Speculator: How to run TON node in local machine for testing and deploy contract just like ganache in ethereum?

Daniil: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 36319)

Daniil: https://docs.ton.org/develop/smart-contracts/sdk/javascript (reply to 36320)

Howard: I know there has ExitCode like this. But does that mean the exit code will pop-up "always" if I didn't add the "+2" method?  The description there is not clear I mean. (reply to 36321)

Daniil: I’d you don’t add +2 to the mode AND the action phase fails, your transaction will be reverted. (reply to 36323)

Speculator: I am not able to find any command to fork blockchain in local. Anyone help (reply to 36322)

Daniil: Why would you need to? (reply to 36325)

Daniil: Consider using testing tools provided by Blueprint SDK.

Speculator: is there any docs for Blueprint sdk

Speculator: I need it for testing (reply to 36326)

Daniil: https://docs.ton.org/develop/smart-contracts/testing/overview (reply to 36328)

Speculator: and is there any library similar to web3 in ethereum to get the basis data like getBlock, subscribe block header etc

Grit: Heya TON folks! I'm participating in Tact Challenge currently, and now grinding for gas optimization.  So what I kindly ask is who can answer me is it allowed to use  Tact std library method   nativeSendMessage?

Alexander: Senior Software Engineer #OPENTOWORK  Hello! I'm Alexander. And I'm actively searching for job opportunities as a Senior Software Engineer with expertise in blockchain. If you have any positions or know of any opportunities that align with my expertise, please feel free to contact me. I'm excited to contribute to innovative projects and teams in the tech industry.  Location: USA/Remote  Resume: https://agapak.dev Telegram: @agapak  Github: https://github.com/cryshado Linkedin: https://www.linkedin.com/in/agapak/

User<5009066984>: Hello

Łukasz: Is there any way to create slice (to be saved in dictionary) without beginning new cell and using begin_parse? I dlike to store an uint in udict directly.

Kirill: Hello, guys, can someone tell me what's difference between "types Adress" and "Adress?" ?

Dmitry | backend4you.ton: Address? can be null (reply to 36339)

Kirill: if I try to compare "Adress?" and "Adress" by "==", will it work correctly?

Dmitry | backend4you.ton: Yes But if you will try to assign address? to variable of type address - you need to check it for null first, or add !! after value (if you sure it’s not null)

Kirill: thanks

User<5438430949>: Hello please why can't I transfer cryptos from my wallet it's showing not enough gas?

— 2023-10-21 —

昊京无敌666🧢: anyone running a validator node?

昊京无敌666🧢: need some help

Artem: Hello everyone, I have the following question. If I need to send money to the EQDyEO6tdLW5y2Z9vCURhKjbAFg6N6qbsLfGViIErMndc2eV wallet in the amount of 2 TON and when paying I need another comment: account26 then the payment link will be like this https://app.tonkeeper.com/transfer/EQDyEO6tdLW5y2Z9vCURhKjbAFg6N6qbsLfGViIErMndc 2eV?amount=2&text=account26 what will be the link for TonSpace? (wallet in the cart which is @wallet)

john: hi guys, how can i transfer ton domain to another account? where i can read this kind of information

Daniil: just transfer the NFT of the domain (reply to 36359)

Maxey: https://www.youtube.com/watch?v=CG3GALNvx60 This link will take you to Ton Dynasty's instructional videos for the Tact Challenge Task1 and Task2. 🎉  Developers who are interested can come and take a look. 👀 We will be uploading videos for Task 3, Task 4, and Task 5 shortly. If you have any questions, please feel free to discuss them with us! 🙌

Falco: Share your question, I'm sure someone can help (reply to 36345)

sd: /report (reply to 36365)

john: and what wallet can you recommend me, like metamask for erc20? (reply to 36360)

&rey: Tonkeeper broadcasts all transactions to everyone who is ready to pay a subscription fee, so it's not the best idea to participate in auctions from this. Other than that, you can use any non-custodial wallet from ton.org/wallets. (reply to 36370)

TON Answers Bot (not AI): Error migrating wallet from Vladimir124  I haven't used the TonHub Wallet for quite some time. Now, when I open the app, it prompts me for a migration process. However, upon clicking the migration button, I encounter an error while trying to migrate my wallet. I tryed restoring my wallet on a different phone using my seed phrase, but it gives me a different wallet address and my balance shows as 0TON. But when I checked my wallet address on tonscan.org, my balance is still there, but it shows as an inactive state. Any help?  🔗 Answer on TON Overflow

Artem: How to implement a transition in the Tonkeeper when sending a transaction from the webapp and back after confirmation?  I'm using a @tonconnect/ui js sdk and sending transactions as stated in the documentation:   const result = await app.tonConnectUI.sendTransaction(transaction, {           modals: ['before', 'success', 'error'],           notifications: ['before', 'success', 'error']         });

User<5762094943>: Hey! I want last update of smart contract jetton I will use blueprint I want docs with smart contract

User<5762094943>: any help pls???

Maxey: You can try this link: https://github.com/Ton-Dynasty/tondynasty-contracts.  In this repository, there is an implementation of jetton by Tact, and the environment is in Blueprint.

User<5762094943>: that contract had not all options (reply to 36376)

Maxey: What kind of options you are looking for

User<5762094943>: it standard

User<5762094943>: jetton

User<5762094943>: https://docs.ton.org/develop/dapps/asset-processing/metadata (reply to 36378)

User<5762094943>: jetton metadata attributes

User<5762094943>: it good & easy contract but it have standard options (reply to 36376)

User<5762094943>: Like this contract, https://github.com/ton-defi-org/tonstarter-contracts/#dependencies-and-requirements

john: is it normal that when i search my address via tonscan.org, it open me completely another adress

john: adresess was made from OpenMask

&rey: What address do you enter and what is shown? (reply to 36385)

john: moment

john: UQBjBk8Q1DOTi7cq1ro-bRuOQ4bYNOkIC_dgApAutMyMw5dT (reply to 36387)

john: inputted

john: EQBjBk8Q1DOTi7cq1ro-bRuOQ4bYNOkIC_dgApAutMyMw8qW shown

&rey: It's correct, they decode to the same raw address. The former is user-friendly non-bounceable form and the latter is bounceable.

&rey: https://docs.ton.org/learn/overviews/addresses

john: ty

&rey: You may check that U in the beginning became E and next characters except last three remained the same.

&rey: Last three are checksum.

Artem: Hi all!  Who use this: tonConnectUI.uiOptions = {         twaReturnUrl: 'https://t.me/durov'     };   ?  how its working?  I set my back url, but after connect wallet, telegram return me to website

Artem: Help me plz!! (reply to 36397)

Howard: Is there better .gif or image that can show how TON's message passing in multiple contracts?   (I am making the PPT)

User<5762094943>: I get prob when run "npx blueprint test" the build command successful but test get that problem I'm use blueprint and Ton-Dynasty smart contract (reply to 36378)

User<5762094943>: I think prob on importing packages from node modules, need install that manual ?? or what any help (reply to 36399)

Maxey: After you git clone this repo:  yarn yarn build yarn test

小马: Does TON support multiple signatures?

Anthony: Simple dApp (design in progress) – https://ton-blockchain.github.io/multisig-dapp/ Contract – https://github.com/ton-blockchain/multisig-contract

🅰🅻🅰🅽: Yeah! And here is another you can refer to   https://github.com/deNULL/ton-multisig

小马: OK thank you

Peter BıƖƖıơŋs: If you need a skilled community manager or a project advisory for your project do send a DM. I'm here to work with you 😊

Peter BıƖƖıơŋs: And if you're building a GameFi project as well I'm available to work with you. I'm affiliated with a big IGO.

Max: Hi guys, iam using toncenter api and ton sdk lib c#, how can i get transaction with external tx hash? Anyone can help me?

小马: Do ton nominators have the right to modify hash parameters?

Артём: Guys can you help, I am trying to generate public address for trust wallet, but it differs from what I am actually got in wallet (reply to 9723)

— 2023-10-22 —

TON Answers Bot (not AI): Can`t generate Trust Wallet address from Artem  I am trying to generate address from mnemonic, it works for tonkeeper but not working in Trust Wallet, can you help me, I tried all possible parameters from tutorial.  🔗 Answer on TON Overflow

User<5762094943>: I have evarmment file .env, there two variable WALLET_MNEMONIC is for phrase code and WALLET_VERSION is maybe "v3R1, v2R2 &V4R2"  .env file  WALLET_MNEMONIC="fly country ....." WALLET_VERSION="v4R2" and  I try use also  WALLET_MNEMONIC="fly country ....." WALLET_VERSION=v4R2 but i got same problem

yophy: hello I'm using nodejs ton sdk How can I get txHash when I send externalMessage? there is no return value anyone help?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm not sure if node sdk has same strategy, but in dotnet sdk there is no async response and we need to get TX manually, read the related part in the documents at github (reply to 36418)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if you are using ton sdk (not tonweb): export const getTxHash = (   tx: SendTransactionResponse,   encoding: BufferEncoding = 'base64', ): string => {   return Cell.fromBoc(Buffer.from(tx.boc, 'base64'))[0].hash().toString(encoding); };  usage: const tx = await connector.sendTransaction({ your transaction body });  const txHash = getTxHash(tx); (reply to 36418)

David: To k ba k ổn (reply to 36052)

User<5762094943>: Guys Any help pls (reply to 36417)

User<5762094943>: @pcrafter @Gusarich 👍 (reply to 36420)

User<5762094943>: any help, I use that contract of yesterday (reply to 36402)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I haven't run that template before, let me trying it and then I will guide you (& myself) ASAP (reply to 36424)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: It's a blueprint template, where you seen needs for dotenv and this configs? As I see in your output, you are trying to deploy using blueprint framework you must choice which contract you want to deploy next you should select chain/wallet then pay deploy fee (reply to 36417)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: is blueprint builder/deployer is configurable with dotenv? this can be useful for CI build 🤔🧐

A: hi guys   last week someone sent me 2500 usdt to my wallet (telegram wallet) , but the transaction stayed on hold because of security check not passes , i have messaged multiple times to wallet support team , their team only answare onece every 3-4 days and i can't withdraw my holded funds , the tron blockchain transaction approved and is succesful , they said in support to send a wallet address to get back the funds , so on i have sent them the wallet address but they said i should send in in dialogus form , i can't find the form anywhere not in support not in wallet , anyone here to help me ?

Maxey: Since we have only tested deployment on Ton keeper directly, let me check if mnemonic works well (reply to 36417)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: How to deploy directly on (using) tonkeeper? Is there any article available so I can learn about it? (reply to 36433)

🅰🅻🅰🅽: Blueprint provides an option to deploy by TonKeeper (reply to 36434)

🅰🅻🅰🅽: So you can simply choose TonKeeper in the dropdown menu from deploy script and there should pop up an QR code

🅰🅻🅰🅽: Scan the QRCode with Ton Keeper then blueprint will handle the remaining process for you

&rey: If you already have code and data cells, you can use https://ratingers.pythonanywhere.com/deployer. (reply to 36434)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I know that, I figured there was a way to do it directly using tonkeeper as default deploy settings

🅰🅻🅰🅽: Wow sooo cool, but i cannot open it in my browser. (reply to 36438)

Xander: me too (reply to 36440)

&rey: I'll investigate why it doesn't open in mobile. (reply to 36440)

🅰🅻🅰🅽: I am trying to open it by Chrome on windows OS, but it seems to be a blank page (reply to 36442)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: pc too

Xander: I use Microsoft Edge on Windows 10

🅰🅻🅰🅽: Do you mean deploy directly from TonKeeper App? (reply to 36439)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: ok, lets explain from first,  our groupmate has a try for deploying your contract directly by a config file, then he/she asked for guide about deployment you said we haven't tried with MNEMONIC but TONKEEPER So, I figured there was a way to do it directly by a config file, I know how to deploy contract easily by blueprint (reply to 36417)

🅰🅻🅰🅽: Yeah it is possible to deploy it by setting .env. But it requires some setting for deploy script.

🅰🅻🅰🅽: In this case, we deploy a contract by loading mnemonic and wallet version from .env.test

🅰🅻🅰🅽: `.env.test` looks like WALLET_MNEMONIC=... WALLET_VERSION=v4

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: nice, I just start reading your repo, thanks for sharing, I had same idea about reusable trait as package for tact in hack-ton-berfest, however this bounty matches my skills, let me know if you needs help (reply to 36450)

🅰🅻🅰🅽: I think the first issue (as I comment in README): tact import system seems not supporting importing from node_modules. I have opened issues but there is no any further discussion.

🅰🅻🅰🅽: reusable trait truely shines when we can easily download other's trait by npm install or yarn

🅰🅻🅰🅽: Like Openzepplin does on Ethereum

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm sure if you complete the lib, the blueprint team will investigate how to define a space for such libraries, keep continuing your useful package 🙏 (reply to 36452)

🅰🅻🅰🅽: Thank you for your support! If any of you have any new ideas or would like to help with implementing TEP code that has not been implemented yet, we would be happy to engage in discussions!  https://github.com/Ton-Dynasty/tondynasty-contracts

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: The easiest option that comes to my mind is to download the binary from the address when adding imports before compile

🅰🅻🅰🅽: Is the address an uri or something else?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If it is URI, it helps a lot to develop the library from community and update the clients but it can be a local path from modules folder by configuring compiler file for imports  "imports" : [     "@traits" : "path/to/node_modules/traits/package" ] (reply to 36458)

🅰🅻🅰🅽: Wow, it looks quite simple!

🅰🅻🅰🅽: So we only need to modify the resolve path right?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if tact compiler adds support for it, you can open an issue for it in tact repo (reply to 36461)

🅰🅻🅰🅽: It will open the next era for tact

🅰🅻🅰🅽: Thanks dude

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Thank you and your team for developing useful products (reply to 36464)

Rahul: this not waiting for the result and this is a smart contract transaction. i am using react tonconnectUi. Any suggestion?   await item.sendTransfer(              sender,              toNano('0.1'),              contractAddress,              beginCell().storeUint(0x429c67c7, 32).storeUint(days, 8).endCell(),              toNano('0.1')            );

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: In this code, your sender has transaction response, where you get this sender/provider? If it's a hook, export the transaction response from sender too (reply to 36466)

Rahul: yes this is hook. const { sender } = useTonConnect();  and the hook look like this:    import { useTonConnectUI } from '@tonconnect/ui-react';  import { Sender, SenderArguments } from '@ton/core';    export function useTonConnect(): { sender: Sender; connected: boolean } {    const [tonConnectUI] = useTonConnectUI();      return {      sender: {        send: async (args: SenderArguments) => {          tonConnectUI.sendTransaction({            messages: [              {                address: args.to.toString(),                amount: args.value.toString(),                payload: args.body?.toBoc().toString('base64'),              },            ],            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve          },{              modals: ['before', 'success', 'error'],              notifications: ['before', 'success', 'error']          });        },      },      connected: tonConnectUI.connected,    };  }

Rahul: @hitasp do you know how can i export transaction reponse from this?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm on phone, send it again via code style or a screen shot please

Rahul: ok

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 'tonConnectUI.sendTransaction' returns transactionResponse as promise

Rahul: so you mean i need to wait from sender? or need to change the hook?

Rahul: but it returns tonuiconnect transaction response right. i want to wait for the smart contract response.  await item.sendTransfer(               sender,               toNano('0.1'),               contractAddress,               beginCell().storeUint(0x429c67c7, 32).storeUint(days, 8).endCell(),               toNano('0.1')             );

🅰🅻🅰🅽: Oh I think you should use setInterval in js to query it

🅰🅻🅰🅽: I'm not 100% sure

Rahul: query to smart contract? i am using setInterval for smart contract response result but it return undefined before i accept or decline the transaction

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: it's depend on your need, if you need tx you should export sender as separated method  const sendAndGetTx .... then return it via  tx: await sendAndGetTx(transactionBody) sorry I'm on phone to share full code

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: but you must implement sender.send to work with tonConnect as a provider

Rahul: how can i implement both for one transaction?  🤔

Rahul: what if i need only a smart contract response? (reply to 36479)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what you mean? e.x get a value from a counter? (reply to 36482)

Rahul: Yes like that... actually this method is for staking nft and will return response code. But its not waiting for response. 😅

Rahul: And i can identify with the code that what happened. Like if 708 thats mean you can't stake. If its 200 then staking success like that

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: var value = await counterContract.getValue(); 🥸 without need to track transaction response (reply to 36484)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: var nftAddress = await nftCollectionContract.getNftAddressByIndex(nftIndex);

Rahul: Okk.. and i need to use for other method too like claim rewards... like transactions success but if nft not claimable then we can not identify the result of this method.   So the smart contract method does not provide response?

Rahul: Can you send full code of hook to get transactions response whenever you free... actually I didn't understand how to implement both for one transaction.  I have launching at morning. (reply to 36479)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I didn't understand why you need to implement both for one transaction☹️ sender.send inside this hook uses to simplify your send when you call contract.send, we haven't any receiver with response because you are send messages to chain.  you can create and then send transaction without using connectUI hooks and get tx whenever you need tx: const tx = await tonConnectUI.sendTransaction({ your transaction body }); (reply to 36489)

&rey: You can't get this response via tonConnectUI and need a separate API provider/lite client/lite server for that. (reply to 36475)

&rey: Since generally there can be any number of response messages and who knows which one you need.

Rahul: so i am sending a message using contract.send so i can't received the response from tonconnectUI right. then how can get the transaction response or wait for response with contract.send? because i am using setTimeout to get response but its never return a reponse

&rey: This is (or should be) explained at docs.ton.org. (reply to 36494)

Rahul: if i get boc or any type of response i will find the solution but its does not return anything.

Rahul: in any smart contract if we do transactions then normally how we can manage transaction?

Rahul: or we can't and just do the transaction?

&rey: You can search transactions by user's wallet address and payload. I believe you need something like this: https://github.com/toncenter/examples/blob/main/deposits-jettons-single-wallet.js (reply to 36497)

&rey: A translator, if you use one, doesn't seem to work well. (reply to 36499)

Rahul: you mean need to use AccountSubscription ?

&rey: Either that or polling account state with setInterval and checking whether the transaction appeared. (reply to 36502)

Rahul: and one more thing, you know we transaction failed or succeed then ton SDK print console log like this

Rahul: how can we get this and watch on this ton sdk to get this type of result

Rahul: TON SDK print this every time when transaction failed and succeed. how can we access this?

&rey: Use @tonconnect/sdk instead of @tonconnect/ui. Examples at https://docs.ton.org/develop/dapps/ton-connect/integration#logging-in-with-tonkeeper-1. (reply to 36506)

Rahul: thanks

Yellowdish (aka Lando): We have been trying to integrate ton connect into our react native app for a while now and facing road block. Can we use this sdk for react native instead of tonconnect react? (reply to 36507)

Yellowdish (aka Lando): I have asked before and was told to use @tonconnect/ui but we are facing the same issue.

Yellowdish (aka Lando): Can you simply guide us how to integrate to react native?

Yellowdish (aka Lando): We are asking for help.

&rey: I'd say "not use React", since it seems significantly heavier than, for instance, Svelte. (reply to 36513)

Yellowdish (aka Lando): So what can we use instead? (reply to 36515)

&rey: Svelte with @tonconnect/sdk library. The only thing you'd need to do manually is create connect popup. (reply to 36517)

Yellowdish (aka Lando): Ok thank you will check it. (reply to 36518)

Alex: Hello. May I ask? After disk problems and successful  (as I thought) recovery I have the Validator that see the network but don't stake. The single clue is mytonctrl warning message ParseAddrB64 warning: testnet flag do not match. Addr: True, Network: False What does it means?

ekt: Hello, I am trying to implement a connectWallet function and saw this kind of implementation: const ton = window.ton; if (ton) { const accounts = await ton.send("ton_requestWallets");  setTONwalletKey(accounts[0].address); } may I ask how does it work ? the example that I am looking at seems to be missing .ton and isn't connecting at the moment

— 2023-10-23 —

User<5762094943>: How can I edit this this jetton metadata to add some new attributes, metadata attributes: https://docs.ton.org/develop/dapps/asset-processing/metadata#jetton-metadata-attributes jetton deploy script: https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/scripts/deployJetton.ts jetton contract: https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/contracts/jetton_example.tact Am I need only edit that on Deploy Jetton.ts only or need edit other files

Shashank: You can take advantage of 'Nujan,' a web-based IDE that offers support for the FunC programming language. To explore its features and capabilities, visit their website at https://ide.nujan.io/. (reply to 36280)

Tim: Is svelte native a thing?) (reply to 36515)

&rey: I think it can be embedded into WebView just as well? (reply to 36525)

Tim: react native is not react webview (reply to 36526)

yophy: Thanks a lot!! (reply to 36420)

Goldy: Hello, I am an Experienced Blockchain Developer with 7 years of experience. But I am new to Ton chain. So I would like to join any Ton project as a intern. Could you let me work with you? Please DM me.

TON Answers Bot (not AI): shortkey in blueprint from No Name  what is the shortcut key for building project on blueprint  🔗 Answer on TON Overflow

Charles: Whats the differences between FunC and Tact？

Charles: Which one is better for dev？

Asdf: Hello, I created gift cards. These gift cards will have a code for 1 ton of coins each. I wonder if Ton Coin has such an application? When the gift card holder enters the code, 1 ton of coins will come to his wallet.

Daniil: I think you want the cheques (or coupons) functionality. You can create them in telegram via bots like @cryptobot or @wallet, or, if you prefer decentralisation and on-chain projects — take a look at https://t.me/delabtonbot/dewa (reply to 36535)

MI: tact (reply to 36534)

Charles: 👌

GOATS: How to use TON wallet with other tokens

Asdf: Checks are created with the @wallet command. However, what I want will be a gift code in the gift coupon. When we activate this code with @wallet, tons of coins will come to the wallet, just like with checks. In other words, a code entry field can be added to the @wallet checks section. So I can share the gift codes I want with my friends. Otherwise, if I add checks to the channel, users I don't know can receive the checks.

yi: how to get the sender balance using ton emulator

User<95392270>: Подробнее о нашей 💰 реферальной программе смотрите в этом видео: youtu.be/KqXQcmsRgTA (forwarded from Новости Crypto Bot)

123.Fuxked: I went through it , this is nice. Shoot me a Dm (reply to 36250)

john: Hi all! My friend bought ton domain for me, but now he cant transfer this nfr, reason is: "you not owner of this nft" what is he missing?

User<95392270>: 🔴The TON Believers Fund (TBF), has emerged as a non-profit organization consisting of international communities dedicated to the TON ecosystem. This fund is governed by a tailor-made smart contract designed for its specific purpose.  The core objective and aim of the fund is to appeal to prominent TON holders, early miners, and projects willing to support the community by locking their funds for an extended 5-year period.  The unique smart contract empowers any $TON holder to secure their tokens for 5 years, with an initial 2-year lock-up and a subsequent 3-year vesting period. Moreover, TBF has gained significant support from various key projects.  This initiative has garnered support from the TON Foundation, following a successful vote within the community and by validators on http://ton.vote. The TON Foundation has allocated 1,000,000 TON to the fund's reward pool.  For up-to-date TBF statistics, interested parties can refer to the following links: DefiLlama Tonscan Tonviewer  For guidance on contributing to the fund, a detailed guide is available here. For further information explore the GitHub repository.   🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

Dmitry | backend4you.ton: Did he forgot to claim it after buy? DNS.ton.org (and Tonkeepr as I remember) shows this button. This operation updates internal state of domain, erasing auction info and writing owner not corresponding field.  Or, he already transferred domain to other owner.  You may use @TonDomainInfoBot for example to look “inside” domain data. (reply to 36545)

Asdf: Checks are created with the @wallet command. However, what I want will be a gift code in the gift coupon. When we activate this code with @wallet, tons of coins will come to the wallet, just like with checks. In other words, a code entry field can be added to the @wallet checks section. So I can share the gift codes I want with my friends. Otherwise, if I add checks to the channel, users I don't know can receive the checks. (reply to 36536)

&rey: Bot @CryptoBot has code-locked checks. (reply to 36548)

Dmitry | backend4you.ton: So, you "gift card" is useless, because actual "gift" is a code that only some of card owners can have? Why don't yo want to make this "gift code" a card (NFT I guess?), and dont distribute card that need additional "secrets" to be redeemed?  Or you want one "gift code" to be valid for many cards? (reply to 36548)

Tse: Hi guys! I am looking into understanding the design philosophy of TON's consensus mechanism, like how do they implement fault tolerance, how does validator vote, etc. (Not like a general POS explanation) Which article/document whould you recommend? (If whitepaper is the best option, which chapter/section should I prioritize?)

&rey: You need catchain.pdf. (reply to 36551)

Tse: Well. It's a bit better than reading through the whole whitepaper consider it's only 1/3 long lol  BTW is there any substantial change in TON consensus mechanism after the publication of it? (reply to 36552)

Tse: And I would really appreciate it if there's some summarization like a few pages long

Asdf: I want to do the process using the @wallet command. (reply to 36549)

Creature: Hello. I want to make 10 ton forward transaction.

Creature: I've tried but I can send less than 1 ton.

Creature: I hope someone help me.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: not sure how to help without code of transaction (reply to 36558)

Creature: Nodejs code. (reply to 36560)

Creature: Transaction failed. (reply to 36560)

Creature: What's the matter?

Creature: And I want to exactly know about the send transaction process.

&rey: Are you sending message to the jetton wallet? (reply to 36560)

Creature: yed

&rey: Also, you are attempting to forward 10 TON out of 1 you send.

Creature: yes

Dmitry | backend4you.ton: so, who pays 10-1 = 9 ton ?

Creature: me

Creature: I have some ton in my wallet

Dmitry | backend4you.ton: you send only 1

Creature: How do you know? (reply to 36573)

Dmitry | backend4you.ton: > amount: '1000000000',

Creature: .storeCoins(toNano('10')) This is for 10 tons.

Dmitry | backend4you.ton: re-read TEP-74  you are sending 1ton to your jettonAddress with message (body): send 0.1 jetton to destinationAddress and then forward 10 TON to destinationAddress

Creature: This is a token amount (reply to 36575)

&rey: It isn't. (reply to 36578)

Creature: Then what?

&rey: It is amount of TON you send to the jetton wallet along with some request. Your wallet doesn't care what the request is. (reply to 36580)

Creature: Ok. Let me try.

Creature: I will ask you then.

&rey: This code is sending X nanoTON from your wallet no matter what the addr and payload are. const Tx = {   validUntil: Math.floor(Date.now() / 1000) + 600,   messages: [     {        address: <any addr>,        amount: <X>,        payload: <any payload>     },   ], };

Creature: Oh~ Ok. Thanks.

Creature: Then how can I send jetton?

Creature: Hope you provide me the code.

&rey: The code is almost correct! You just need to figure out how many TON you want to send to destinationAddress and send a bit (+0.2 TON) more in amount: '...'. (reply to 36560)

AYMEN: Can i safely depend in in_msg.value as how amount of TON i received? Can other types of transactions affect it? a.k.a the value isn't about the amount of TON.

&rey: By any chance, do you know that sending jettons uses 3-4 consecutive transactions? (reply to 36585)

Creature: I want to set forward amount 10 ton.

Creature: Oh~ I dunno. (reply to 36591)

&rey: You can. recv_internal is only called when internal messages are received. You also receive msg_value as argument. (reply to 36590)

&rey: Then you need to send 10.2 TON to jetton wallet. amount: '10200000000' (reply to 36592)

Creature: Oh~ I will try . Thank you so much.

AYMEN: Thank you! (reply to 36594)

AYMEN: Incase of a liteserver is down, does tonlib switch server to one of the available in config?

Dmitry | backend4you.ton: tonlib itself - not, you need to reconnect it. but some wrappers over tonlib can detect unavailable liteserver and reconnect automatically (reply to 36598)

&rey: It's offtop. (reply to 36600)

YS: What it means offtop

&rey: The message you've sent is not related to TON engineering/development thus it isn't suitable for this chat. (reply to 36603)

&rey: Also, it quite possibly taps on a political issue which certainly shouldn't be discussed here.

YS: Ok

YS: Hahhahahahh ok ok

Asdf: Hello, I created gift cards. These gift cards will have a code for 1 ton of coins each. I wonder if Ton Coin has such an application? When the gift card holder enters the code, 1 ton of coins will come to his wallet. Checks are created with the @wallet command. However, what I want will be a gift code in the gift coupon. When we activate this code with @wallet, tons of coins will come to the wallet, just like with checks. In other words, a code entry field can be added to the @wallet checks section. So I can share the gift codes I want with my friends. Otherwise, if I add checks to the channel, users I don't know can receive the checks. I want to do the process using the @wallet command.

Creature: Hello.

Creature: Is there any forward limit in ton transaction?

— 2023-10-24 —

Jordan: Any ton devs looking for work?

Howard: for the HD Wallets support: what is the current status? Is there anyone implement this? (reply to 230)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: @tonhunt (reply to 36616)

yi: Hi, is it possible to do a string compare using tact? When I use if for that it shows invalid type for binary operator

sdw: Hello, is there a way to decode the data from Cell on a transaction   for example:  x{7DD2A639713F764A322A923395D886178AFF0CFD32885C1794B07B2B7D395C0C800000E89F3D300096A22B7BEF8CAB447B6E84D526B333D9947FD73748E989DDE9ACA0E846C943B0400000E89F3D300036537220D00014810E58FC0}  x{A_}   x{69FE66666666666666666666666666666666666666666666666666666666666666673FF74A98E5C4FDD928C8AA48CE5762185E2BFC33F4CA21705E52C1ECADF4E5703218C481CCF465A40000001D13E7A60010CA6E441A7CB7B99200000000329B91044_}  x{727811AFA4106DD86E3FF4A15140A7E819B86F87EE1BE7B6D61649480AC39410F716D065EEF19DF3ECDF05071B0EA13FE4890CB134F38142F00C308570E0FFCEAF}  x{04098C481CCF465A58810E58FC11_}   x{46F70C3D090000000000000000016800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000}   x{C00000000000000000000000012D452DA449E50B8CF7DD27861F146122AFE1B546BB8B70FC8216F0C614139F8E04_}   I am not sure if there is a way to do that so please pardon me in advance

Pop: Does anyone know if the ton applet can obtain the friend relationship on telegram?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if it's a simple string you can cast it as slice then use slice compare  let stringAsSliceA: Slice = "StringA".asSlice(); let stringAsSliceB: Slice = "StringB".asSlice();  if( stringAsSliceA.hash == stringAsSliceB.hash) {     // do something } NOTE: Dangerously casts string as slice for future parsing. Use it only if you know what you are doing. (reply to 36620)

Artem: Hi all! How to generate a separate wallet address  in TON for each account on the basis of one wallet, this is generally possible in TON ?

Kushagra: Hi all, I am learning TON and want to understand the fundamentals of the TON. Any suggested resource other than official docs?   Also, specially I have a query about transaction life cycle. Can anyone help me with what happens to my transaction once I send it. Does it go to some public Mempool, then to a validator? OR what is the exact flow?

Kev: Hello everyone, we're looking to launch games on Ton chain.  Can we please get in touch with ecosystem manager?  We will like guidance and support for our launch. We'll like to connect with wallet partners and collaborate with other teams in Ton ecosystem as well to make our launch effective.

Gunnar: Quick question, we run our own lite servers, semi often we get "block is not applied" or "block is not ready" for simple calls like "generic get address state" or "get transactions" - is this normal? Just add a retry loop?

Daniil: yes it is normal (reply to 36632)

Matan: Where would i be able to get statistics on the transaction fees that go to the validators for proposing blocks?

AYMEN: Is that due to sync? (reply to 36633)

Matan: Also is it possible to unstake part of a delegation?

AYMEN: What is better, to ensure that the current Sync state is Done or retry until it gets succeeded? (reply to 36633)

&rey: I think staking pools require you to pull all stake and redelegate whatever you need. Please note that newly staked funds would have to wait till next validation round. (reply to 36638)

Daniil: Retry (reply to 36639)

Sol: Hello What is it? What are the sourses? Was not provided in sourses

Sol: Help me plz

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Share the content of contract folder,  and include/import part of your contract  Tips: tools are designed for helping you to make your life easy, check the blueprint framework (reply to 36644)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Seems you have problem with path of your contract file, double check that and try ./pathToContract if you are on powershell (reply to 36645)

— 2023-10-25 —

Creature: I want to send 10 ton with forward option.

Creature: I set that but transaction failed.

Creature: const tokenBody = beginCell()   .storeUint(0x0f8a7ea5, 32)   .storeUint(0, 64)   .storeCoins(toNano(0.01))   .storeAddress(destinationAddress)   .storeAddress(destinationAddress)   .storeBit(0)   .storeCoins(toNano('10'))   .storeBit(1)   .storeRef(forwardPayload)   .endCell();  const defaultTx = {   validUntil: Math.floor(Date.now() / 1000) + 600,   messages: [     {       address: jettonAddr, // owner's jetton address       amount: '10000000',       payload: tokenBody.toBoc().toString("base64")     }   ] };

Creature: I want to send jetton with 10 ton.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tondev_eng/36577 (reply to 36656)

&rey: . (reply to 36595)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I just created a issue for this as feature request. they already supported imports for built-in traits, let's wait to receive a response from the team, if I can understand its mechanism, I will send PR for it. https://github.com/tact-lang/tact/issues/77 (reply to 36463)

🅰🅻🅰🅽: Thanks 🙌 I hope this feature can be adopted soon. (reply to 36659)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm looking for a function to get readable|real datetime from Unix Timestamp, is there any pre-built method available in func/asm?

Rahul: how do pass a sender in the simplest way?

Rahul: with tonConnectUi

Rahul: what is the simplest way to pass a sender with a contract method? a

DPL: Hey, what is masterchain block for this block - https://tonscan.org/block/0:8000000000000000:39436884 ?

Creature: I tried but transaction failed. (reply to 36657)

Creature: Hope you help me.

Conrad 🐦 SUI: Okay

Creature: Tried again but failed. (reply to 36658)

Shashank: Hey there, everyone! I've just published a blog on Medium where I demystify TON Foundation concepts in a way that's super easy to understand, even for non-developers. Check it out: [Discovering TON Blockchain: A Layman's Guide]🚀 Let's dive into the fascinating world of blockchain together!

Speculator: Can we use twitter or any other wallet in Mini app?

&rey: Do you have transaction link? (reply to 36670)

&rey: Why are you sending 0.1 TON? (reply to 36674)

Creature: Then let me try with 1ton.

Creature: Is this ok?

Creature: Oh. It works.

Creature: Thanks.

&rey: First of all, please describe your thoughts: what funds should be transferred by jetton wallet and where does it get them from? (reply to 36677)

Creature: Jetton airdrop with 10 ton.

Creature: I want to make that event.

&rey: Where the jetton wallet gets 10 TON from? (reply to 36682)

Creature: From the company's wallet.

&rey: Then, you are logically required to send those 10 TON plus transaction fees. (reply to 36685)

Creature: Yes.

&rey: And that's how to debug those errors.

Creature: Thanks.

Ёж: Good afternoon. How can I send NFT(telegram username) for sale on fragment? Just using fragment is not suitable, because I need to specify the settings of auction term and sale step, and there is no such thing on the site

Speculator: how can i store private key on the client side for my telegram mini app

Mikhail: Does anyone know how to solve this?  error: lvalue expected before ~load_uint           $rarity = begin_parse($payload)~load_uint(8); 💥 Compilation failed. Skipping packaging

&rey: Yes! Though, do you use Tact or FunC? (reply to 36693)

Mikhail: tact, happens on compile stage (reply to 36694)

&rey: You should split payload.beginParse().loadUint(8) into two lines. let payloadSlice: Slice = payload.beginParse(); ... payloadSlice.loadUint(8) (reply to 36695)

Mikhail: Thanks! (reply to 36696)

Speculator: ????? (reply to 36692)

Daniil: what private key are you talking about (reply to 36692)

Ёж: Good afternoon. How can I send NFT(telegram username) for sale on fragment? Just using fragment is not suitable, because I need to specify the settings of auction term and sale step, and there is no such thing on the site

walker: How to access telegram wallet in my TWA?

Lukas: Hi probaly a noop question, but can I create a payment request to a smart contract with a inline button in telegram and send mony towards it with the @wallet?  I did not start to learn TON development because If I can not do that it would not be usefull to me. I tryed wallet.tg but it dos not offer what I need.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: short answer yes,  you need to handle request in your bot server but without @wallet, because the wallet interacts with TON with its own mechanism and does not send any requests to the network (to your smart contract) on your behalf.  is easy as running bots?  no, You need to understand how to work with SDKs and TON api to create an @wallet cloned bot.  suggestion: replace your bot payment gateway with an simple TMA and use tonConnectUI to send payments which already supported @wallet and more (reply to 36703)

— 2023-10-26 —

Surhige: need ton faucet sir 100

walker: is there any best practices for atomic asynchronous call similar to the DEFI projects on ethereum?

Parmanand: Hello Team,  I have set up a TON node on an AWS EC2 instance following your documentation. I would like instructions on how to connect my API node in my code and retrieve the RPC endpoint with the port number. Additionally, I would appreciate some sample code for reference.  Thank you.

Dmitry | backend4you.ton: TON nodes does not have HTTP API. What protocol do you expect at RPC endpoint? (reply to 36707)

Bean: Hi guys, when fetching incoming jetton transfer transactions of a specific address, I just can see the Jetton Notify from Jetton Wallet Address to this receiver address. But I want to know the original sender, how can I find it?

Dmitry | backend4you.ton: sender, see transfer_notification in TEP-74 (reply to 36709)

Parmanand: How to use running node in code?? (reply to 36708)

Dmitry | backend4you.ton: https://docs.ton.org/develop/dapps/apis/sdk check this. you can interact with node directly via ADNL, or spin-up additional RPC provider that will communicate with node via ADNL but talk with you  via http (reply to 36711)

Dmitry | backend4you.ton: https://docs.ton.org/develop/dapps/apis/sdk  1) use ADNL lib and talk to your node 2) install RPC too and use RPC SDK (reply to 36713)

GOATS: Can the height map of TG mini APP be adjusted? The var(--tg-viewport-height) setting does not take effect.

GOATS: Does anyone know about this?

Slava: We've got some update regarding TON Bounties. Feel free to share with guys who would be interested to participate:  🍭 39 Active bounties →  👷‍♂️ 8 Approved bounties. Actively searching for an assignee →   💬 12 bounties under suggestions. Share your opinion →

Parmanand: I have tried below code   from pytoniq.adnl.adnl import AdnlTransport, Node  adnl = AdnlTransport(timeout=3)  # start adnl receiving server await adnl.start()  # take peer from public config peer = Node(<IP>, <PORT>, "/YDNd+IwRUgL0mq21oC0L3RxrS8gTu0nciSPUrhqR78=", adnl) await adnl.connect_to_peer(peer) # or await peer.connect()  await peer.disconnect()  # send pings await asyncio.sleep(10)  # stop adnl receiving server await adnl.close()   below errors are coming after executing above code    File "/home/ubuntu/test.py", line 6     await adnl.start()     ^^^^^^^^^^^^^^^^^^ SyntaxError: 'await' outside function (reply to 36714)

Dmitry | backend4you.ton: sorry, i'm not familiar with this. try ask at github (reply to 36719)

Falco: What does "status fast" return? (reply to 36722)

Lukas: Can’t I connect the Ton wallet to my app like https://ton.diamonds/ dos an get the fitting username with an login inline keyboard. And if the user is logged in an connected I can send a msg with contract witch should wallet open like it dos if you place a bit on ton.diamonds?  Also thank you for the suggestion I will look in to it. (reply to 36704)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Take a look at the TWA template on ton, it has everything you said (reply to 36724)

Lukas: Thank you! I guess this is the right repo: https://github.com/ton-community/twa-template (reply to 36725)

999: Who can do nft on ton blockchain please contact me

Roman: Hi everyone! Especially for all the new developers on TON! 🙃  We've made some updates to the TON Dev Kit chats folder and we have also added the TON Dev News channel to keep you updated with the latest news in the developer ecosystem.  Feel free to join!  UPD: the post with fixed links: https://t.me/tondev_eng/36903

Falco: Try running lite-client yourself with higher verbosity and check if there are any errors:   /usr/bin/ton/lite-client/lite-client --global-config /usr/bin/ton/global.config.json —verbosity 3 --cmd last (reply to 36730)

Parmanand: still getting the same errors (reply to 36731)

Falco: Must be something blocking outgoing connections then. Can you share the output again of the last command? (reply to 36732)

Falco: Don't run it in mytonctrl, just run:   /usr/bin/ton/lite-client/lite-client --global-config /usr/bin/ton/global.config.json —verbosity 3 --cmd last

Falco: Seems to work fine then. Must be an issue with mytonctrl, maybe try re-install

Ryn: thanks for your ip (reply to 36739)

Behrang: Hey guys,  Do you know how I can view external messages (logs) of my smart contract?  For example does tonscan.org or tonviewer.com or ton.cx display these logs/messages?

Gunnar: For this speed test scheduled for next week I understand it will be a separate workchain with 256 new nodes for this.   Is there any way to join this network with another node?   Is there documented plans somewhere? They will run the standard node from https://github.com/ton-blockchain/ton ?

TON Answers Bot (not AI): Need help with @tonconnect/ui-react from No Name  Hello, can somebody please provide me with following information: 1. Is there any way to limit wallets, that displayed in modal? For example i want only Tonhub, Tonkeeper an Telegram-Wallet be displayed in connect modal 2. Is there any way to open modal directly to desired wallet? For example i click my Tonkeeper icon and then connect modal appears with Tonkeeper QR already  Thanks! :)  🔗 Answer on TON Overflow

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Not sure why site is not working for me.  1- yes, in version 1.x you can set attribute wallet list to filter them  2- no, you should create your own component for it. I'm not sure why you need to limit your users, ui-react has good ux with all supported wallets for both TWA and websites (reply to 36747)

Bulletproof: someone know if this type of link still works? ton://transfer/address?amount=100000000

Bulletproof: someone knows?

Denis: ton://transfer/subbotin.ton?amount=1000000000

Denis: Works for me

Bulletproof: hmm so maybe is my telegram app

Bulletproof: I clicl in the button from inline keyboard but nothing occurs

Bulletproof: but thanks (reply to 36752)

— 2023-10-27 —

Goldy: Hi everyone,  I am an experienced Blockchain Full Stack Developer with extensive experience and skills, and I am actively looking for a new opportunity now. I believe that the future of technology lies in blockchain, and I am excited to be part of that future. Let's connect to explore how we can shape this digital revolution together.  I can bring your vision to a real life. Please DM me.

&rey: Do you have Github repository? (reply to 36756)

Goldy: Sure (reply to 36757)

Goldy: May I DM you? (reply to 36757)

&rey: Sure you may. (reply to 36759)

freedom: It's so slow to get balance. Is there any way to make it faster?

Oleg: It looks like you are using tonutils-go.  On the first init of client it fetches full chain of proofs, it takes some time. You can init client once per service and use it for every lite server calls, it will be fast after first fetching.  Alternatively you can turn off proof chain check, by passing Fast proof check policy (reply to 36761)

freedom: ok

Oleg: https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go#L34   if you don't need a proofs chain, but still want simple proofs you may change here to ton.ProofCheckPolicyFast

User<1962038049>: i got Parse transferURL error when i try to deploy my contract.

User<1962038049>: ton://transfer/kQGvCwpIbeL299nBNkbSI4U5_yXBGT-FJ0PEGn1NeDklXx5g?text=Deploy&amount=500000000&init=te6cckECFwEAA14AAgE0BAEBQ0ANB4eRws-I249fVuDlIBYOXvnagR7YWe-fRkUEXES0f2gCAQHAAwEFoebTBAEU_wD0pBP0vPLICwUCAWIOBgIBWAoHAgFICQgAdbJu40NWlwZnM6Ly9RbVl6UUhOMm42RDF6RUJ1SnlCbkpybm1oUVd6Z1pXaGFOcHBtd3NBRlc0a05pggABGwr7tRNDSAAGACASAMCwCVt3owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI-WZFp15b--LEcwTgQKuANwDOxymcsHVcjktlhwThOy6ctWadluZ0HSzbKM3RSQAhG3Qxtnm2eNhDAVDQACIALU0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE_7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8Wts88uCCyPhDAcx_AcoAWVkg10mBAQu68uCIINcLCiCBBP-68tCJgwm68uCIzxbLH8ntVBUPA-Dtou37AZIwf-BwIddJwh-VMCDXCx_eIIIQh9Q6wrqOlTDTHwGCEIfUOsK68uCB0x8BMds8f-AgghCUapi2uo6oMNMfAYIQlGqYtrry4IHTPwExyAGCEK_5D1dYyx_LP8n4QgFwbds8f-DAAJEw4w1wFBEQAVz5AYLwxPjXIxLt_e9be-x4M727Fi0VEb14qRKu0PJjevZVcq66joZx2zx_2zHgFAE6bW0ibrOZWyBu8tCAbyIBkTLiECRwAwSAQlAj2zwSAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT_uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x_AcoAASBu8tCAAcyVMXABygDiyQH7ABMAmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwAJPhBbyQQI18DI4ERTQLHBfL0oAHA7UTQ1AH4Y9IAAY4l-kABINdJgQELuvLgiCDXCwoggQT_uvLQiYMJuvLgiAHTH1lsEuD4KNcLCoMJuvLgifpAASDXSYEBC7ry4Igg1wsKIIEE_7ry0ImDCbry4IgB0ds8FgACcHAc9Zw

&rey: Maybe &stateInit= ? (reply to 36767)

User<1962038049>: you mean change the &init= to &stateInit=  ？？

User<1962038049>: i use another way to deploy the contract.. i m using the Tact

Eric: Hi We are developing a intent-centric TG trading bot based on AA and AI agent. We are looking for developers to build together, and feel free to have a look at our project website: https://smarter.web3idea.xyz (under construction). We just won the prize in Areweave Summer Hackathon! Thanks a lot and welcome to join us if you are interested and available!

Rongxin: Question: How does account abstraction apply to TON?

&rey: Each smart contract, including wallets, is a separate account with an isolated state. Each transaction only uses data of incoming message and of contract which is processing the message. (reply to 36772)

Mahdi: Question: How a jetton_wallet proves itself to its master as its child? (Why we can't create a jetton fake wallet with infinite jettons? )

Dario: The same way a wallet verify a message from another wallet: you check if address of sender matches againist a valid "state_init" of the wallet, given user address. The address itself is an hash (reply to 36774)

Mahdi: Thanks 🙏 (reply to 36775)

Sam: If catchain participants are determined at genesis of the catchain, how are new validators added to the masterchain?

Sam: Also, where are the files stored by Storage Providers actually stored?

User<5762094943>: any one know which utility will work with this,  import { Buffer, makeSnakeCell, toKey } from 'utility-library'; //utility-library'

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: it's a helper for building cells, for packing data before store. so any utility|client can build/use it. but I never seen a package with 'utility-library' name. (reply to 36780)

User<5762094943>: just name you right (reply to 36781)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I guess it is a part of an monorepo, right? (reply to 36782)

— 2023-10-28 —

&rey: ton-core package seems suitable for the description, though not sure. Did you get that code example somewhere? (reply to 36780)

Creature: How can I get all jetton holders?

&rey: You need an indexer like dton.io. (reply to 36786)

Creature: How about the ton holders?

&rey: Please note that if jetton has decimals 9, there can be billions of owners. (reply to 36788)

&rey: Same, an indexer. (reply to 36789)

Creature: I can't find where.

Creature: Where can I find holders of "EQDNhy-nxYFgUqzfUzImBEP67JqsyMIcyk2S5_RwNNEYku0k"

Creature: Can you give me the exact url?

Creature: I can't find in dton.io

&rey: https://dton.io/graphql/#query=%7B%0A%20%20transactions(parsed_jetton_wallet_jetton_address_address%3A%20%22CD872FA7C5816052ACDF5332260443FAEC9AACC8C21CCA4D92E7F47034D11892%22)%7B%0A%20%20%20%20gen_utime%20%23%20gen_utime%20of%20block%0A%20%20%20%20parsed_jetton_wallet_balance%20%23%20jetton%20parsed%20balance%0A%20%20%20%20parsed_jetton_wallet_owner_address_address%0A%20%20%20%20account_storage_balance_grams%20%23%20smart-contract%20balance%0A%20%20%7D%0A%7D (reply to 36794)

Creature: Thank you for your reponse. (reply to 36796)

Creature: But I can get only 150 accounts.

Creature: How can I get more?

&rey: Pagination. Please read documentation and ask once you have more questions. (reply to 36801)

Creature: Thank you. (reply to 36802)

Creature: What is a "account_storage_balance_grams"? (reply to 36802)

&rey: Balance of account, IIRC. (reply to 36812)

Creature: Different from tonview.com

bozieff: Guys. I have dictionary with 16 bit keys 1,2,3. Can someone help me with hm_label for BC edge? I know for BD edge its label will be hml_short : 0101. But for BC - I don't know

Ёж: Hello! How send NFT from wallet to Fragment?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tonsociety_chat (reply to 36817)

Denis: https://tonapi.io/v2/jettons/EQDNhy-nxYFgUqzfUzImBEP67JqsyMIcyk2S5_RwNNEYku0k/holders (reply to 36793)

Parmanand: Hi Team  after executing mytonctrl on commad prompt then below errors are coming -   [warning] 28.10.2023, 13:14:51.942 (UTC)  <MainThread>  The config file is broken local.db: {'config': {'logLevel': 'info', 'isLimitLogFile': True, 'isDeleteOldLogFile': False, 'isIgnorLogWarning': False, 'isStartOnlyOneProcess': True, 'memoryUsinglimit': 50, 'isLocaldbSaving': False, 'isWritingLogFile': True}} [debug]   28.10.2023, 13:14:51.944 (UTC)  <MainThread>  Thread self_test started [debug]   28.10.2023, 13:14:51.944 (UTC)  <MainThread>  Thread write_log started [info]    28.10.2023, 13:14:51.944 (UTC)  <MainThread>  Start program /usr/src/mytonctrl/mytonctrl.py Welcome to the console. Enter 'help' to display the help menu. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings  how to solve it??

Emre: I want to jetton transfer on my react project. But I got some unusual error. My internet connection is great. Thats my body:

Emre: const body = beginCell()       .storeUint(0xf8a7ea5, 32) // jetton transfer op code       .storeUint(0, 64) // query_id:uint64       .storeCoins(1000000) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)       .storeAddress(Address.parse(receiver_address)) // destination:MsgAddress       .storeAddress(Address.parse(userFriendlyAddress)) // response_destination:MsgAddress       .storeUint(0, 1) // custom_payload:(Maybe ^Cell)       .storeCoins(50000000) // forward_ton_amount:(VarUInteger 16)       // .storeUInt(0, 1) // forward_payload:(Either Cell ^Cell)       .endCell();     myTransaction = {       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [         {           address: Address.parse(jettonWalletAddress), // sender jetton wallet           amount: 50000000, // for commission fees, excess will be returned           payload: body.toBoc().toString("base64"), // payload with jetton transfer body         },       ],     };

Denis: Interesting. Can you give me address of the page where I can reproduce it?

&rey: I guess it won't work because you send 0.05 TON to jetton wallet and request it to forward the same 0.05 TON? (reply to 36824)

john: hi guys, have constant errors  when trying to compile from sources - is there are another ways ? https://docs.ton.org/develop/howto/compile

Denis: It shouldn't create problem with fee estimating

john: i want to generate-random-id -m adnlid but cannot compile utils, is there are another ways to do my task ?

Falco: Did you run it as root? Run it from the same user you installed it from (reply to 36821)

Parmanand: I have installed as root user and run it as root user (reply to 36830)

Falco: Try to reinstall mytonctrl if you haven't tried it already

Emre: ı tried now. But ıt doesn't work. What can I do? (reply to 36826)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: try to send with +0.5 TON as message value and share the result (reply to 36835)

Emre: can you change this code for me please?

Emre: const body = beginCell()         .storeUint(0xf8a7ea5, 32) // jetton transfer op code         .storeUint(0, 64) // query_id:uint64         .storeCoins(80000000) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)         .storeAddress(Address.parse(userFriendlyAddress)) // destination:MsgAddress         .storeAddress(Address.parse(receiver_address)) // response_destination:MsgAddress         .storeUint(0, 1) // custom_payload:(Maybe ^Cell)         .storeCoins(100000000) // forward_ton_amount:(VarUInteger 16)         // .storeUInt(0, 1) // forward_payload:(Either Cell ^Cell)         .endCell();       myTransaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [           {             address: Address.parse(jettonWalletAddress), // sender jetton wallet             amount: 50000000, // for commission fees, excess will be returned             payload: body.toBoc().toString("base64"), // payload with jetton transfer body           },         ],       };

Emre: :) (reply to 36836)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I want to help but without code, you need to learn,  In this message you are sending 0.05 TON to contract, then you asked for sending 1 TON + gas fee + commission fees from that 0.05 TON messages[0].amount for passing this transaction should be more than 100000000 + gas fee + commission fees  I think 158000000 is OK (reply to 36838)

Emre: Thank you for everthing, I tried but unfortunately :(. Maybe problem is not this. I dont know! but again doesn't work. (reply to 36840)

Emre: I tried least 158000000

Emre: most 498000000

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: const body = beginCell()         .storeUint(0xf8a7ea5, 32) // jetton transfer op code         .storeUint(0, 64) // query_id:uint64         .storeCoins(80000000) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)         .storeAddress(Address.parse(userFriendlyAddress)) // destination:MsgAddress         .storeAddress(Address.parse(receiver_address)) // response_destination:MsgAddress         .storeUint(0, 1) // custom_payload:(Maybe ^Cell)         .storeCoins(toNano('0.05')) // forward_ton_amount:(VarUInteger 16)         .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)         .endCell();       myTransaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [           {             address: Address.parse(jettonWalletAddress), // sender jetton wallet             amount: toNano('0.1'), // for commission fees, excess will be returned             payload: body.toBoc().toString("base64"), // payload with jetton transfer body           },         ],       };  try this and share the result

Emre: firstly I get this error 0 , _ton_ton__WEBPACK_IMPORTED_MODULE_7__.beginCell)(...).storeUint(...).storeUint(...).storeCoins(...).storeAddress(...).storeAddress(...).storeUint(...).storeCoins(...).storeUInt is not a function TypeError: (0 , _ton_ton__WEBPACK_IMPORTED_MODULE_7__.beginCell)(...).storeUint(...).storeUint(...).storeCoins(...).storeAddress(...).storeAddress(...).storeUint(...).storeCoins(...).storeUInt is not a function (reply to 36844)

Emre: for this line  .storeUInt(0, 1) // forward_payload:(Either Cell ^Cell)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I just edited your code, yes you have typo, storeUint is correct (reply to 36846)

Emre: If I remove this line, error is goes but this is not solution ı think

Emre: second storeUint(0,1) was comment line on me

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: fixed, use latest and let me know, good luck (reply to 36848)

Yellowdish (aka Lando): Trying to integrate tonconnect/sdk in react native project and getting error below, we already configured the localstorage but still getting error:  Error: [TON_CONNECT_SDK_ERROR] LocalstorageNotFoundError: Storage was not specified in the DappMetadata and default localStorage was not detected in the environment.

Emre: I already use latest versions     "@ton/ton": "^13.9.0",     "@tonconnect/ui-react": "^2.0.0-beta.4", (reply to 36850)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: use this code, if is doesn't work you need to check your sender then the contract source good luck (reply to 36844)

Emre: ok thx a lot (reply to 36853)

— 2023-10-29 —

Behrang: I've found a workaround, sharing it here in case anyone hit the same problem.  Problem If you have a get method that uses network configs, using lite-client to call it will return an error.   Workaround on client environment Use ton-access with v2 client, v4 will throw the same error. It looks like that v2 uses tonlib, while v4 uses lite-client internally.  Workaround on server environment Use tonlib-cli instead of lite-client. (reply to 34316)

OLZA: Hi, I'd like to start learning more about TON and how to developr things on it. I'm a native iOS developer. Do you have any recommendation from where to start? Is there any roadmap available? Cause I'm kinda new to the blockchains at all

sd: /report (reply to 36858)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: First of all, focus on your goals and don't pay attention to the sidelines, then read the documentation @ docs.ton.org (reply to 36856)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: These political hatreds and sometimes racism have no place in dev spaces, especially in TON (Telegram The Open Network)

Nick: You can look at Vladimir Alefman course, it is great point to start ( https://www.youtube.com/watch?v=Vf3Fx7qgL6k&list=UULFaiBZhZWqYeeQMUeCev18ng&index=11 ) (reply to 36856)

OLZA: Thanks, will take a look 🙂

Maxey: https://www.youtube.com/watch?v=z-utWdvz58k  This link will take you to Ton Dynasty's instructional videos for the Tact Challenge Task4. 🎉  Developers who are interested can come and take a look. 👀 We will be uploading videos for Task 3 and Task 5 shortly. If you have any questions, please feel free to discuss them with us! 🙌

TON Answers Bot (not AI): Jetton transfer with @ton/ton and @tonconnect/react-ui from Emre Aslan  How should we write code if we want to transfer Jetton with a wallet already connected with tonconnect-ui? I connectted wallet and I want to send Jetton to another person/wallet receiver address. But I get two unusual error.  First error in my tx body:  const body = beginCell()         .storeUint(0xf8a7ea5, 32)          .storeUint(0, 64)         .storeCoins(10000000)         .storeAddress(Address.parse(userFriendlyAddress))          .storeAddress(Address.parse(receiver_address))         .storeUint(0, 1))         .storeCoins(50000000)         .storeUInt(0, 1) // ------this line is error line.--------         .endCell();       If I make comment line, error is goes.But this is not a solution.    Uncaught (in promise) TypeError: (0 , tontonWEBPACK_IMPORTED_MODULE_7.beginCell)(...).storeUint(...).storeUint(...).storeCoins(...).storeAddress(...).storeAddress(...).storeUint(...).storeCoins(...).storeUInt is not a function     Second Error: If I make I get Failed to calculated fee on browser wallet        const userFriendlyAddress = useTonAddress();   const rawAddress = useTonAddress(false);   const wallet = useTonWallet();   const tonConnectUI, setOptions = useTonConnectUI();    const jettonAddress = "EQDEPcKFlXaKddKJVUvq2Rfn2QgH7MyFHxZek99FdMyq8XD";   const receiveraddress = "UQA76t6NCey61qBTkqosAs65sSrX2jIk9BloVz3NU76yYMap";    console.log("Address parse::", Address.parse(receiveraddress));   console.log("Address parseFriendly::", Address.parseFriendly(receiveraddress));   // console.log("Address parseRaw::", Address.parseRaw(receiveraddress));   const client = new TonClient({     endpoint: "https://toncenter.com/api/v2/jsonRPC",     apiKey: "myapikey",   });    const jettonTransfer = async () => {     let myTransaction;     if (userFriendlyAddress) {        const body = beginCell()         .storeUint(0xf8a7ea5, 32) // jetton transfer op code         .storeUint(0, 64) // queryid:uint64         .storeCoins(10000000) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)         .storeAddress(Address.parse(userFriendlyAddress)) // destination:MsgAddress         .storeAddress(Address.parse(receiveraddress)) // responsedestination:MsgAddress         .storeUint(0, 1) // custompayload:(Maybe ^Cell)         .storeCoins(50000000) // forwardtonamount:(VarUInteger 16)         .storeUInt(0, 1) // forwardpayload:(Either Cell ^Cell)         .endCell();         myTransaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages:            {             address: Address.parse(jettonAddress), // sender jetton wallet             amount: 100000000, // for commission fees, excess will be returned             payload: body.toBoc().toString("base64"), // payload with jetton transfer body           },         ,       };     }     try {       tonConnectUI.sendTransaction(myTransaction);     } catch (error) {       alert(error);     }   };  🔗 Answer on TON Overflow

Emre: jettonWalletConract  is normal address or instance? If instance, how can I create that

Emre: doc says: "jettonWalletAddress - Address, JettonWallet address, that defined based on JettonMaser and Wallet contracts" but I dont understant that How can I find this.

Dmitry | backend4you.ton: https://t.me/tondev_eng/34329 check this plz (reply to 36877)

Sasha: Hey guys, would TON Connect support new stack navigation update for TWA? so @wallet could be opened within the stack and send user back to the initial TWA

Sasha: If anyone interested to update TON Connect to support this case, feel free to dm me so I will provide more details/userflow/etc

Emre: I understand. How can I determine jetton transfer between two user with @toncconect/react-ui and @ton/ton (reply to 36878)

— 2023-10-30 —

Aber: I have a question to consult you about.  We want to directly integrate with Ton Space without using Ton Connect. Does Ton Space offer a direct connection? Can it provide a link that carries the recipient's address, transfer amount, and a comment, allowing for a direct redirection from my web app to Ton Space's transfer page without the need to connect a wallet in advance?

Aber: Is there no direct redirect link like Tonkeeper, e.g. directly redirect to: https://app.tonkeeper.com/transfer/EQDVJrXsScRIS1vvVZlxj9ogKgC39qwGimxXJsONc-pPvoQ5?jetton=EQCbKMTmEAdSnzsK85LOpaDkDH3HjujEbTePMSeirvEaNq-U&amount=1000000000&text=aaaabbbb

Henry Odia 🌱: Hello everyone, any community API available to track TON price (USD) and 24 hours change?  Aside coin gecko and cmc

Henry Odia 🌱: Can anyone help pls? (reply to 36885)

&rey: CryptoBot also provides some data about current price, so you can run script polling it. (reply to 36885)

Henry Odia 🌱: Any link? (reply to 36887)

&rey: https://help.crypt.bot/crypto-pay-api#getExchangeRates (reply to 36888)

&rey: I guess it can support ton://transfer links. (reply to 36884)

Henry Odia 🌱: thank you! (reply to 36889)

Aber: i mean the link of ton space (reply to 36890)

Max: Hi all 👋 Has anyone encountered an issue where android users get an error when connecting with tonkeeper that the tonconnect-manifest.json file is not found? But for ios users everything works fine.  I am using:  ├── @tonconnect/sdk@3.0.0-beta.1 ├── @tonconnect/ui-react@2.0.0-beta.2  thanks in advance, have a nice day 😂

&rey: ton://transfer is universal link, it should be supported by everything before their own links. (reply to 36892)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I think this is not related to the ton connect, seems it's a http problem, debug your android app, if it's a TWA use this document (reply to 36893)

Gunnar: Have I got this right? Discovering all holders of a particular jetton isn't very easy?   I can look at ALL transactions for all of time and look for Jetton Internal Transactions.   Or I can look at initial minting transfers from the master contract to some wallet, and "follow the money" along other transfers from those wallets?

&rey: https://t.me/tondev_eng/36793 (reply to 36897)

Gunnar: nice!

Speculator: Hi guys, do you have any link to TON Space documentation. Some reference how to integrate TON space in mini app to transfer TON from one tonspace wallet to another

ekt: Hi guys, having issues with ton connect ui and ton connect sdk:  ./node_modules/@tonconnect/sdk/lib/esm/index.mjs Attempted import error: 'Base64' is not exported from '@tonconnect/protocol'.  Do you know what could be causing it?

Roman: Hi everyone! This time, let's attach and pin the post with the fixed links. Thanks to Hqx5 from Dev Chat RU for reporting the bug. 😊

Roman: Hey TON developers!  We've created the TON Dev News channel to keep you updated on the latest updates from the TON Foundation and the Dev Community.  To begin, we are pleased to share a curated list of essential resources and chats specifically designed for you in the TON ecosystem:  Resources for Developers  🛠 Developer Portal: Your primary toolkit with the best SDKs and developer resources.  📖 TON Documentation: Dive deep into TON concepts and get the know-how.  🌍 Awesome TON: A treasure trove of developer resources, curated by the community.  🎮 Mini Apps Platform: Telegram Mini Apps is an open web-based platform to build and deploy crypto-friendly apps and games within Telegram Messenger.  🕹 TON GameFi: Discover the countless possibilities that await game developers who are ready to embrace the power of TON blockchain.  💰TON Grants & Bounties: TON Foundation actively supports projects building core infrastructure, making the ecosystem more developer-friendly, building innovative use cases, or effectively utilizing Telegram Web3 Infrastructure.   Community Chats & Channels  TON Society Chat: Engage with TON contributors, ambassadors, and forward-thinkers.  TON Community: Stay up-to-date with the latest news and updates from the TON ecosystem.  TON Dev Chats: Join our global developer communities - EN, РУ, and  中文.  TON Dev News: Stay updated with the latest for TON developers.  Hack-a-TON Chat: Participate in hackathons driven by TON Foundation.  TON Contests: Official contests announcements channel.  TON Tact Language Chat: Discuss and explore the Tact programming language.  Telegram Developers Community: Developers Community on the Telegram platform.  The Open Network: Engage with key network updates, votings, and official announcements.  TON Jobs: Explore vacancies and seize opportunities in TON projects.  This is a crucial list of community channels to stay up to date on TON development. Want to add all these chats at once?   👉 Click here to Add Folder (forwarded from TON Dev News)

PLATFORM: TOP 🔟 Dapps by unique wallets  📈📊   🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

Kiba: Hey, It seems like there might be a mismatch between the versions of @tonconnect/sdk and @tonconnect/protocol. Ensure that you have the latest versions of both packages installed.   If the issue persists, I'd recommend opening a bug report in the issues section on our GitHub repository: https://github.com/ton-connect/sdk/issues.   This will help us investigate the problem more effectively. (reply to 36901)

0xHowe: hi guys，do everyone have received this comment

0xHowe: I received but I don‘t see this one in the Ton-doc contributors

0xHowe: so is it true？

&rey: The comment is true and related to https://t.me/hack_ton_berfest_2023. It seems I haven't received one yet. (reply to 36907)

john: trying to make ton utils from sourses and keep getting this error lways_inline function '_mm_crc32_u64' requires target feature 'crc32', but would be inlined into function 'crc32c_3way' that is compiled without support for 'crc32'

john: is there any compiled binary for ubuntu ?

0xHowe: okay，I also see it. That see is true. Thanks guys (reply to 36910)

机器人大王: Why is seqno sometimes null when sending transactions

机器人大王: const seqno = await wallet.methods.seqno().call()

机器人大王: This is how I obtained it

&rey: When the wallet is inactive (has sent no transactions before). (reply to 36915)

机器人大王: But I have sent transactions before (reply to 36918)

Resha X 🦉 🦆: Hello

Sam: Still curious about this, as well as my following message. I am referencing section 2.3.2 here https://docs.ton.org/catchain.pdf (reply to 36778)

Emre: Why am ı determine in this field. Faşled but why. ı don't understand

Пескарь™ | фронтент телефонов: send jettons with fee > 0.04 TON (reply to 36925)

Emre: :( look (reply to 36926)

Пескарь™ | фронтент телефонов: what's the exit code? (reply to 36927)

Emre: const body = beginCell()         .storeUint(0xf8a7ea5, 32)         .storeUint(0, 64)         .storeCoins(1000000000)         .storeAddress(Address.parse(receiver_address))         .storeAddress(Address.parse(receiver_address))         .storeUint(0, 1)         .storeCoins(50000000)         .storeUint(0, 1)         .endCell();        myTransaction = {         validUntil: Date.now() + 5 * 60 * 1000,         messages: [           {             address: "EQB0laFk5fzOv48Mw6prQ49U41cbXVV7U9_2S3Ixyrqs92TY", // sender jetton wallet             amount: "60000000", // for commission fees, excess will be returned             payload: body.toBoc().toString("base64"), // payload with jetton transfer body           },         ],       };

Ahmet Said: exit code means the reason of revert in block explorer (reply to 36929)

Пескарь™ | фронтент телефонов: change .storeCoins(50000000) to .storeCoins(1) (reply to 36929)

Emre: unfortunately (reply to 36931)

Пескарь™ | фронтент телефонов: send tx hash (reply to 36933)

Emre: https://tonviewer.com/transaction/fc6d733e7d34c8e0efe1b70bd11e3d0cfe6cc62ea01f2aa325b248f5d636b32e (reply to 36934)

Emre: exit code 705 now

Пескарь™ | фронтент телефонов: it's not your jetton wallet (reply to 36935)

Пескарь™ | фронтент телефонов: try this: EQDnFXwHX6NpU8NR0lZIKaLaaBC6r-cqUVmSrEoILRFEN3gw

Emre: thank you so much bro. How did you find this address and Why I use different address

Emre: we did it: ) huh

Пескарь™ | фронтент телефонов: tonviewer.com/EQDEPcKFlXaKddKJVUvq2Rfn2QgH7_MyFHxZek99FdMyq8XD?section=method (reply to 36939)

Emre: which ? :( and how convert you (reply to 36942)

Пескарь™ | фронтент телефонов: change method to get_wallet_address, click Add Argument, select type(Slice) (reply to 36943)

.: Guys I need one come to me Directly to check my transaction

.: please

.: https://tonviewer.com/transaction/a35c237da11410389f45c9231ff4985c3d66c624ec0cf86c6e2f72236dd582fe?section=trace

.: I need to wait or what ? is completed ? (reply to 36947)

Yulian: Hey folks! Does anyone run archive node? Do u have any troubles after v2023.10 release? I can't understand why I can't run node properly, it always crashing

Igor: Hi everyone!  We are developing a TON-based project that represents a set of rebase tokens. Along the way, we discovered that it is currently impossible to implement such tokens in TON architecture with the existing Jetton standard. So, we propose a new Rebase-Jetton standard.   We have documented all of our investigations of the problem and proposed standard in a separate Medium article: https://united-finance.medium.com/overview-of-ways-to-implement-rebase-tokens-on-ton-blockchain-3e23552cf0b3  We have also raised a corresponding bounty task: https://github.com/ton-society/grants-and-bounties/issues/342  Please join the discussion, especially if you develop rebase-based projects, DApps, services, or DeFi protocols that this standard will interact with if it is approved.

Ibrahim: Trx

Sam: What is the -m "lite" flag used for on installer.sh?

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Need to implement openLink from telegram sdk for mini apps, on ton connect, it is no a good UX to open a link inside mini apps and get closed by this action, this method prevents that 👍

Yulian: Guys! Does anyone know if v2023.06 is suitable for today's benchmark?

— 2023-10-31 —

Charles: Is there some docs to learn FunC？Only official doc？

Jeff: https://www.youtube.com/@AlefmanVladimirEN-xb4pq https://www.youtube.com/@TONDevStudy

Speculator: In english (reply to 36958)

Charles: any language well (reply to 36960)

Jeff: You can check above videos (reply to 36961)

Charles: Got it, thanks bro (reply to 36962)

Jeff: This is also great https://github.com/markokhman/func-course/tree/main (reply to 36963)

Charles: Nice

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: func cookbook can be a great entry point to learn all probable questions (reply to 36958)

Tse: Hi, I'm wondering if the address of a smart contract is calculated based on its own code,  and when the contract is mutable even after deployment, what will happen when we change the code? Does its address change accordingly?

Dmitry | backend4you.ton: no, address will not change (reply to 36968)

&rey: Address is based on StateInit. (reply to 36968)

Dmitry | backend4you.ton: there was a special "empty" contract and console tool to find vanity address (by changing meaningless random init variable), then you deploy this contract (to address found) and then you update code of this contract to your conract code, so you'll   have your contract with vanity address

Tse: oh right. I forgot about that part. But what if, say: 1. I deploy a contract 2. Modified the contract 3. The contract ran out of TONCOIN for storage fee 4. (I suppose) the nodes remove the contract from their storage Then is there a way to recover the contract? I thought the recovery was done by re-uploading the contract's bytecode and calculate  the address to see if it matches the old one. But seems like I was wrong? (reply to 36970)

Tse: Or is the part that will change the StateInit immutable?

Dmitry | backend4you.ton: i guess you'll need to re-upload initial contract (to get same address as before) and then re-modify it again.

Speculator: Why I am getting this error when i am calling tonConnectUI.sendTransaction({...})

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Related to your react code (reply to 36975)

Speculator: const transaction = {     messages: [         {             address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination address             amount: "20000000" //Toncoin in nanotons         }     ]  }  export const Settings = () => {     const [tonConnectUI, setOptions] = useTonConnectUI();      return (         <div>             <button onClick={() => tonConnectUI.sendTransaction(transaction)}>                 Send transaction             </button>         </div>     ); };

Speculator: I am using this code

User<6387275279>: 有中国人吗

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 00:00 - 12:54 (reply to 36978)

Speculator: import { CHAIN, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"; import { Address } from "ton-core"; import { SenderArguments } from "ton-core"; import { Sender } from "ton-core";  export function useTonConnect(): {     sender: Sender;     connected: boolean;     wallet: string | null;     network: CHAIN | null; } {     const [tonConnectUI] = useTonConnectUI()     const wallet = useTonWallet()      return {         sender: {             send: async (args: SenderArguments) => {               tonConnectUI.sendTransaction({                 messages: [                   {                     address: args.to.toString(),                     amount: args.value.toString(),                     payload: args.body?.toBoc().toString("base64"),                   },                 ],                 validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve               });             },             address: wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined           },           connected: !!wallet?.account.address,         wallet: wallet?.account.address ?? null,         network: wallet?.account.chain ?? null              } }

Speculator: I am using this code but this also showing same error

Speculator: And Calling by this    const { network, sender } = useTonConnect();      sender.send({value: params.TON_VAULT_ADDRESS,to:  params.amountIn});

Speculator: is this right??

Speculator: Is there any option for testnet in TON Space wallet

TON Answers Bot (not AI): How to get event emit from smart contract  from yy  For local development I can use track.collect but if I want to get  all events from a deployed contract. Which js sdk method I can use?  🔗 Answer on TON Overflow

Sam: Anyone? (reply to 36952)

Dillon | DIA BD: Hey Ton team, I am Dillon from the BD team at DIA (cross-chain oracles across 38 L1/L2s)   Will your team be attending DevConnect? I'd love to connect our teams in person and open a conversation regarding integrating DIAs oracles on Ton

ekt: Hello, is there a way to connect to TonKeeper or other wallet using ton web?  or use qr code and ton web? :)

&rey: TON Connect and TonWeb are entirely orthogonal (have different scopes). Generally, you use QR and TonWeb. (reply to 36989)

Step: ton performance test on mainnet or testnet ?

Step: https://tps-api.toncenter.com/tps?limit=256&sort=desc&t=-86

Denis: Third separated network (reply to 36991)

Step: any explorer like explorer.toncoin.org ? (reply to 36994)

ekt: Thanks :) (reply to 36990)

Ceren: Congratulations to the Dev Team and anybody who is involved in making this Historic Moment to come true!

fomo: Congrats

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Congratulations to DEV team, ♾

Step: ? (reply to 36995)

Rae: Congrats to the team. The YouTube session was very informative.

J: Hi I've heard that some people says that Ton hit that number is because it's running on the test servers, and Solana would hit 720,000 in theory in test servers. Is that true? I'm team Ton, I just wish to know how to prove Ton is really the fastest.

&rey: Well, if Solana is launched on test servers, then we'll see. TON used 256 cloud servers (ecs.c6.6xlarge, ubuntu_22_04_x64_20G_alibase_20230613.vhd) rented in Alibaba Cloud for validator nodes. (https://github.com/ton-blockchain/performance-test/blob/main/README.md) (reply to 37006)

Daniil: Solana’s max number is below 100k with the same amount of validators (reply to 37006)

Daniil: And don’t forget that solana’s records are counting only simple transactions, while TON counted complex smart contract executions.

President Business: Congratulations to the TON Foundation and all contributors who surpassed 100k TPS! What a time we live in.

J: Thank you! That's the answer I can use to respond those rumours. (reply to 37009)

Speculator: How can i check fetch balance of a connected walled using tonconnect/ui-react ??

Ivan: just tonapi io

Ivan: for ex: Tonkeeper browser extension get balance from clientside by GET: https://keeper.tonapi.io/v2/pubkeys/<PUBKEY>/wallets

Emre: I made a transaction. Transaction return boc value. How can I learn transaction details

Denis: Calculate hash from boc root cell and after ~10-15 seconds call https://tonapi.io/v2/blockchain/messages/{hash}/transaction or https://tonapi.io/v2/traces/{hash}

DevApp : Hello everyone, how to get the hash of a transaction after successful execution? sendTransfer returns undefined

— 2023-11-01 —

Leon｜BitsLab: Hi everyone, when I was trying to deploy the smart contract using blueprint, I got this error. Can anyone help resolve it?

Ahmet Said: need to set your wallet mnemonic and version in your .env file exaclty as prompt in error message (reply to 37019)

Leon｜BitsLab: You mean I should create a .env file in my project? (reply to 37021)

Leon｜BitsLab: I’ll try, thank you sir

Leon｜BitsLab: What should the version be? (reply to 37021)

Ahmet Said: if u r using ubuntu u can set yur variables from console export VARIABLE_NAME="variable_value" like this  for version "v4R2" would work (reply to 37022)

Leon｜BitsLab: Error: Unknown wallet version v4r2

Leon｜BitsLab: 😭

Ahmet Said: whihc walktrhough u r following? (reply to 37026)

Leon｜BitsLab: https://ton-community.github.io/tutorials/02-contract/ (reply to 37028)

Leon｜BitsLab: npx blueprint run

Ahmet Said: in walkthrough everything seems ok u need to set the mnemonic in deploy script and dont forget to fund the test wallet before using (reply to 37029)

Ahmet Said: or use my code i added some scripts and infos using tonkeeper https://github.com/ASaidOguz/Modified-Counter-TON-blockchain

Leon｜BitsLab: I create my project like this

Leon｜BitsLab: @torpedopistolXc41

Leon｜BitsLab: I didn’t modify any piece of code.

Leon｜BitsLab: Then I tried to deploy using npx blueprint run

Ahmet Said: use Tonkeeper wallet for convinience

Leon｜BitsLab: I didn’t have a tonKeeper wallet.

Leon｜BitsLab: If using Mnemonic is available, it would be great.

Leon｜BitsLab: It looks like v4R2 is not supported?

Ahmet Said: yeah it seems so sorry for misleading (reply to 37039)

Ahmet Said: using v4 would solve yur problem

Leon｜BitsLab: It works!

Leon｜BitsLab: Thank you bro.

freedom: Is there an interface for querying transaction status based on hash?

裸裸: hello sir. I am a new ton dev.

裸裸: so. what is in what is out?

裸裸: next question: which api can get the current block number?

Howard: can anyone share with why can't find the Smart contract code here?  https://github.com/RSquad/ton-trustless-bridge-relayer from here then, https://github.com/ton-blockchain/ton-trustless-bridge-relayer

freedom: Is there an interface for querying transaction status based on hash?

裸裸: I use this api request:  curl -X GET -H 'Content-Type: ' -H 'Authorization: ' -d '{}' https://testnet.tonapi.io/v2/blockchain/masterchain-head  then I get "seqno": 14138001,  which means the block number is 14138001  then I use this api to request: curl -X GET -H 'Content-Type: ' -H 'Authorization: ' -d '{}' https://testnet.tonapi.io/v2/blockchain/transactions/fc5833bfacfce678905eb29bdeafa1c8d7c75ae2fb286c6691d9d7a663dc75a8  then I get this:  "block": "(0,8000000000000000,14490693)",  How is this possible?  the tx block number is greater than the current block number?  14490693 > 14138001 why ?

裸裸: "I want to ask, how can I retrieve the current block number? Am I using the wrong interface? Or do I have a misunderstanding of the concept? How is it possible for a transaction's block number to be much greater than the current block number of the blockchain?"

freedom: Can you send me the link to the api document you read? (reply to 37055)

裸裸: https://docs.tonconsole.com/tonapi/api-v2

Howard: cc @Gusarich or @TrueCarry or @pcrafter , I found the repo here: https://docs.ton.org/participate/crosschain/bridge-addresses   Do you know the answer? (reply to 37053)

freedom: thank you (reply to 37059)

freedom: Is there any code in the tonutils-go example that only obtains transaction information based on hash?

Denis: Different workchains (reply to 37055)

Denis: 0 and -1

Denis: Tonutils-go can't get transaction based on hash because it just provide access to liteserver and liteserver require account+Lt+hash for getting tx (reply to 37062)

freedom: How do I parse this address? It is inconsistent with the address I sent. It should be a format problem.

Denis: https://ton.org/address/ https://docs.ton.org/learn/overviews/addresses

freedom: thank you

TON technical overview: Probably you are looking for  https://github.com/RSquad/ton-trustless-bridge-tvm-contracts https://github.com/RSquad/ton-trustless-bridge-evm-contracts (reply to 37053)

freedom: Does golang sdk have this method to resolve addresses? (reply to 37067)

Denis: it's not resolve. just converting between different forms

裸裸: OK thank you. (reply to 37063)

裸裸: {  "workchain_id": -1,  "shard": "8000000000000000",  "seqno": 14141188,  "block": "(0,8000000000000000,14490693)",  the first work chain id is -1 while the second is 0

裸裸: but why?

裸裸: https://testnet.tonapi.io/v2/blockchain/masterchain-head  https://testnet.tonapi.io/v2/blockchain/transactions/fc5833bfacfce678905eb29bdeafa1c8d7c75ae2fb286c6691d9d7a663dc75a8  my request is both use the https://testnet.tonapi.io/v2

裸裸: the mainnet is:

裸裸: https://tonapi.io/v2/blockchain/masterchain-head "workchain_id": -1, "shard": "8000000000000000", "seqno": 33818779,  the testnet is:  https://testnet.tonapi.io/v2/blockchain/masterchain-head "workchain_id": -1, "shard": "8000000000000000", "seqno": 14141394,  but why?

裸裸: I mean the testnet should be workchai_id = 0.

Denis: because you should read about ton architecture

Denis: mainnet and testnet are not workchains. both mainnet and testnet has masterchain and basechain inside

Denis: masterchain it something like beacon chain in ethereum

裸裸: Okay, thank you. I admit that I didn't understand the document because it's in English, and I'm not very proficient in reading English. Moreover, translation tools often don't provide accurate translations. Maybe I should dedicate some time to read the document more thoroughly.

freedom: https://testnet.tonapi.io/v2/blockchain/transactions This is the url to query hash records  https://toncenter.com/api/v2/packAddress This is the url that parses the user address  https://ton-blockchain.github.io/testnet-global.config.json This is to submit the transaction  Is there a unified url address? ? very messy

Denis: Testnet.tonapi.io can submit transaction

Denis: And parsing URL is better to make locally because it just a base64 <-> hex conversion

Denis: Every ton library can do it (reply to 37089)

Howard: Thanks! But first one can't access. (reply to 37073)

TON technical overview: Indeed, first one is TON <- EVM it is not ready yet, second one is TON -> EVM it was published along with https://t.me/tonblockchain/201 (reply to 37091)

freedom: Is this how it is handled? The result is incorrect. Please give me some advice. (reply to 37089)

Denis: https://github.com/tonkeeper/tongo/blob/master/ton/account.go#L56 (reply to 37093)

Denis: or here - https://github.com/xssnick/tonutils-go/blob/a7f4ad3fdb53556b4d9084216e408c05ffaf0bed/address/addr.go#L90

TON technical overview: https://docs.ton.org/develop/smart-contracts/messages#message-modes (reply to 37096)

Creature: Thanks.

freedom: Thank you so much I wish you all the best and good health (reply to 37094)

Denis: good health in my ages is a good wish so thank you

freedom: Ha ha

ETON: hello， dever，Is there a way to print logs in the blueprint framework in a func contract, similar to hardhat's console.log?

DevApp : Hello everyone, how to get the hash of a transaction after successful execution? sendTransfer returns undefined. It’s code js

Budy: Kuis apa ini

裸裸: aha sorry "I just reported an error, but I realized there was no error, so I'm retracting my message."

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: ~dump(data) (reply to 37103)

freedom: How do I determine if an address bounces? Is this field based on ihr_disabled? (reply to 37094)

Speculator: How can i create a manifest file for my mini app?

Dmitry | backend4you.ton: Next line after “ihr disabled”: bounce: <value> (reply to 37110)

Coalus: https://github.com/awesome-doge/TON_Paper/blob/main/zh_ton.pdf  Try this (reply to 37086)

freedom: This should be true, but according to what you said, it is false (reply to 37112)

Dmitry | backend4you.ton: Its message bounces, not address. Address bounce flag is used to indicate desired value for message (reply to 37112)

Dmitry | backend4you.ton: Yes, it’s false. Why you think it must be true? (reply to 37114)

freedom: I need a prefix to resolve the address. How do I get it? (reply to 37116)

Dmitry | backend4you.ton: Here is address formatting. Previous screen was transaction detail. I guess you are trying to solve some problem but asking about some other problems, so I don’t understand the problem (reply to 37117)

freedom: The previous problem was that I obtained the transaction information based on the hash, then obtained the from and to users, and parsed them out. However, when parsing, I needed to determine the bounce to determine the prefix. (reply to 37118)

Dmitry | backend4you.ton: You want to “restore” original address string?

freedom: yes

freedom: I need to determine the bounce value based on the field in the transaction record information. Do you know? (reply to 37120)

Dmitry | backend4you.ton: It’s “impossible” in general. User provided his address as string in some form (bounceable/not). Some program used that address and made a message. Program may set bounce flag explicitly, so flag in tx is not required to be equal to “original”

Dmitry | backend4you.ton: Form of address (bounce/not) is just a visual representation. Both resolves to same raw address.

freedom: https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get  This interface is correct, how does it judge? (reply to 37123)

Dmitry | backend4you.ton: With recent improvement devs agreed to show user wallet addresses as unbounceable and “non-user” smartcontract addresses as bounceable

Dmitry | backend4you.ton: (Detailed link is in Tonkeeper / tonviewwer / … top of screen part)

Dmitry | backend4you.ton: I guess it looks to “type” (smartcontract code / hash), but not sure (reply to 37125)

freedom: can you help me? (reply to 37094)

freedom: Thank you for your reply (reply to 37128)

freedom: I should have judged based on the prefix. (reply to 37128)

Jzuss ┌( ಠ_ಠ)┘: Is it possible to buy gas if I had gas limit (exitCode -13) at the time of computation? Or use calculation splitting?

&rey: Calculation splitting (smaller atomic transactions) is the right way. You can't do anything after you've hit gas limit. (reply to 37132)

&rey: If you want to spend contract's own balance on computations (still no more than 1 TON per transaction), you can use accept_message(); (just as with externals)

Jzuss ┌( ಠ_ಠ)┘: Thanks 🙏 (reply to 37133)

Mikhail: Hello everyone, how can i listen for events?

Rahul: hey, does anyone know what this error means? getting an error when i call the smart contract method in the loop. I have a standard API plan. {"ok":false,"error":"LITE_SERVER_NOTREADY: block is not applied","code":500}

&rey: This means your liteserver is still downloading the last block. You may choose other data provider if so. (reply to 37137)

Rahul: oh ok. so i can't request this all method at once right.  const [days, stakedAt, claimedAt] = await Promise.all([            helperContract.getOption(),              helperContract.getStakedAt(),             helperContract.getClaimedAt()          ]);

Rahul: i need to call individually. but it took 3 seconds. is there any way we can boost it?

&rey: 1. Modify the contract so that it returns all three values from a single get-method. 2. Use sandbox with real blockchain provider, so that contract is downloaded once and then you only call get-methods on local copy.

Rahul: can we modify it? its already deployed

Rahul: but i am using it on mainnet. and contract already deployed on mainnet. (reply to 37142)

Daniil: @drahul540 actually the contract which you're talking about already returns all data in one call. can we continue our conversation in our group? (reply to 37143)

Rahul: yes 🫡 (reply to 37145)

Nikku.Dev |: how to change network in ton keeper wallet ??

Ьιαzе: go to settings -> scroll to bottom -> tap on logo 5 times (reply to 37147)

Nikku.Dev |: I'm doing that from last 1 hour 🐱

Nikku.Dev |: In Mac book

Nikku.Dev |: ?

Ьιαzе: but, It works on my machine (reply to 37149)

Nikku.Dev |: how can we do in mac ??

Nikku.Dev |: got it

Ankit: Is it possible to talk to someone on the TON<>ETH bridge team?

Ankit: We are developing a Ton App which might use the bridge extensively and would like to chat with some one on the bridge team

Ankit: Also are there docs or APIs on how to interact with the bridge?

Budy: Oke thanks

sdw: Hi  DO you maybe know what is the following error?  trying to   data: {          ok: false,           error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +            'Cannot run message on account: inbound external message rejected by transaction 0C713C0536A545C111085B8F88E7A47E69957D90F4FDF202384A72CCDF5E1FFE:\n' +             'exitcode=11, steps=4, gas_used=0\n' +            'VM Log (truncated):\n' +             '...execute SETCP 0\n' +            'execute DICTPUSHCONST 19 (xC_,1)\n' +             'execute DICTIGETJMPZ\n' +            'execute THROWARG 11\n' +             'default exception handler, terminating vm with exit code 11\n',          code: 500   seqno it does not seem to be as when I get the seqno from client is 11 but I have tried to execute it with seqno from 1 to 100 but it does not work.  const resp = await cl.sendFile(Buffer.from(txRaw, 'base64'));

Daniil: Most likely the method is not found (reply to 37160)

sdw: you mean op_code method or something? (reply to 37161)

Daniil: Are you sure the contract accepts external messages? (reply to 37162)

sdw: https://testnet.tonviewer.com/EQAMcTwFNqVFwREIW4-I56R-aZV9kPT98gI4SnLM314f_pCa (reply to 37163)

sdw: that is the contract (reply to 37163)

sdw: I think it does based on the history of txs (reply to 37163)

Daniil: As I see, it only handles internal messages. (reply to 37164)

&rey: Please also use other explorer (https://testnet.tonscan.org/address/kQAMcTwFNqVFwREIW4-I56R-aZV9kPT98gI4SnLM314f_isQ) which shows incoming messages that called the contract. (reply to 37166)

sdw: how do you see its only internal messages? (reply to 37167)

&rey: In disassembled code, there is no recv_external. (reply to 37169)

sdw: and in this case how could someone possibly transfer funds there? (reply to 37170)

&rey: By sending a message from wallet. (reply to 37171)

sdw: I did send fine using MyTonWallet. But when I try to transfer using my code it throws the error mentioned

&rey: You probably want to send external message to your wallet to order it to transfer funds to the contract. (reply to 37173)

sdw: do you have an example :)  ☺️

&rey: However, if you don't understand contract mechanics, you probably should not do this.

sdw: this is testnet :) I am trying to understand

&rey: Do you already happen to know the transaction structure (or at least count) if you're sending funds from one wallet to another? (reply to 37177)

sdw: yeah

&rey: So, how many? (reply to 37179)

sdw: you are asking about the seqno?  the transaction stracture? (reply to 37180)

&rey: The transactions. (reply to 37181)

&rey: Nope. What happens when you send money to other contract?

sdw: You want me to explain message delivery for TON? (reply to 37184)

&rey: On a bit higher level: what messages are there and what transactions will be done. (reply to 37185)

sdw: you call method funds delivered (reply to 37184)

sdw: You send message calling a function from a smart contract, smart contract replies back. In TON inbound message is trigered and sets the outbound (reply to 37186)

&rey: Not precisely so.  You send external message to your wallet. There is transaction on your wallet, processing the message, accepting it and sending the funds. So your wallet sends internal message to the second one.  There is transaction on the second wallet; for v4r2, it ensures that the message doesn't need processing. (reply to 37188)

&rey: In total, there are 2 messages and 2 transactions.

sdw: I see (reply to 37189)

&rey: Now, do you want to guess how many messages are there when you send NFT? (reply to 37191)

— 2023-11-02 —

freedom: I have sent you a private message with my problem. My friend, I hope you can help me. Thank you very much. (reply to 37094)

Speculator: Hi, I did a transaction using tonconnect/ui-react and i want wait until the tx is completed of failed.  .... .... await sender.send({value: toNano(params.amountIn) ,to: params.TON_VAULT_ADDRESS}); .... ....

freedom: The sample code needs to determine the prefix  Now an address; 0:af561194ee9a282986b6d4f5d4e77522a83fa680cf472bf339f041fc274f201e  How to determine the parameters of bounce I don't know how to confirm the prefix  Can anyone help me?

&rey: Is there an associated article on your site, at least? (reply to 37196)

&rey: I think this doesn't carry any additional information for developers' chat so I'll have to delete the repost. (reply to 37196)

MT: When using mode 128, will all TONs in the address be sent?

XOF: Is there an API that can be used to monitor transactions? or like subscribe address? I would like to implement a feature: when a certain address receives money, notify the server.

TON technical overview: Check https://tonapi.io/ and https://docs.dton.io/dton/about-dton.io (reply to 37202)

Tamaghna: Hello everyone, I am curious to know whether Ton supports Account Abstraction or not. Can you guys help me with this?

&rey: TON is *based* on account (actor) abstraction. (reply to 37204)

&rey: https://docs.ton.org/learn/overviews/ton-blockchain (reply to 37204)

User<6558952642>: Hello

User<6558952642>: My name is sara from syrai

Alex: Hi all, I am working on liquid staking  in ton network. There are problems in my deploy script.  And everything is the same everywhere, because if there is a problem in the smart contract, it will be visible in the test. Only the deploy script is error. , someone who can help me please DM)

Henry Odia 🌱: hello devs, anywhere to find contract address for jUSDT?

Henry Odia 🌱: i figured it now (reply to 37210)

Egor: Hello everyone Can someone tell me if there are any active vacancies for a junior tester? I would appreciate it!

Gunnar: I don't understand what the addresses are that come out here.   They _look_ like the hex encoded raw form, but if I add "-1:" at the start - none of the addresses exist 🤔  Like: 094EECEE07D0C80A3335E2453AB5DBCBABF25C8913C88D84A44E11BC0261A79E (reply to 36796)

&rey: They belong to workchain 0:. (reply to 37213)

AYMEN: I wonder why -1 not 0 or 1?

&rey: Workchain -1 is masterchain, an expensive thingy. 0 is basechain. (reply to 37215)

AYMEN: Thank you, is there any special thing for choosing -1 instead of 0 for masterchain and 0 for basechain? (reply to 37216)

Gunnar: ah of course - I am a moron 😅

Gunnar: thank you!

Dmitry | backend4you.ton: 0xFF (reply to 37215)

Patabrava.eth: Gm gm. Quick question. Is it possible to offer multiplayer on a Telgram game using the TON Play SDK?

sdw: Hello,    is there anyway to get from transaction data in ton-core https://test-explorer.toncoin.org/transaction?account=EQAMcTwFNqVFwREIW4-I56R-aZV9kPT98gI4SnLM314f_pCa&lt=16241627000003&hash=631bf63e534c577517a71ceda8ac64e3d71b9a969df0ebf8864d955473891859  the actual rawSigned transaction?

&rey: *signed by whom, validator or wallet owner? (reply to 37224)

sdw: signed by wallet owner (reply to 37225)

&rey: You need to 1) get transaction which processed external message and produced the internal you've pointed at, 2) get body of external message, 3) cut first <signature_size> (512) bits; the remainder is signed. (reply to 37226)

sdw: amazing thank you (reply to 37227)

&rey: Note: this depends on wallet contract and may not be true for non-v4 ones.

sdw: understood. only interested in v4 wallets atm :)

Kushagra: Hi everyone, I am trying to build a Jetton Fungible Token in FunC but facing some challenges. Can someone guide me with tutorial or any Github that have good explaination and working source code. Thanks in advance

JH: hi! Would anyone have a smartcontract model out there that allows token mining?

Gunnar: https://github.com/ton-blockchain/token-contract/tree/main/ft ? (reply to 37231)

JH: 🙏 (reply to 37233)

Kushagra: Thanks, I actually tried the jetton-minter-discoverable.fc in this one, but keep on getting these errors  Error: Func compilation error: ( function `workchain` undefined ) cannot generate code for function `workchain` (reply to 37233)

Kushagra: Also can someone help me with the deployment scripts and wrapper for this JETTON Minter contract - https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc

krau5: /report (reply to 37237)

sd: /report (reply to 37242)

Sol: Hello.How do I scan a qr code from the terminal? It's unreadable.

E: reduce your terminal font size (reply to 37244)

E: or drag it further up

Sol: what? (reply to 37245)

sd: Try google: how to change font size *editor name*  You can also manually open link on your mobile wallet or create qr from it (reply to 37247)

Sol: Cheesecake through the wallet won't open (reply to 37248)

Sol: Big think you (reply to 37248)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: by thinking, use windows cmd/pwshell instead of editor's terminal (reply to 37244)

— 2023-11-03 —

Bean: Hi sir, i can't bridge from bsc to ton using this https://bridge.ton.org/

User<1658592266>: Please help me understand.  I issued tokens of my project in TON, how can I now make wrapped tokens on the Ethereum network?  TON BRIDGE does not perform the transfer. What do I need to do to implement this?

Speculator: Hi, When I am connecting with ton space wallet in mini app, it is redirecting to browser like chrome and safari. How to handle it does anyone faced similar issue?

BNBx9: hello sir...  I won this giveaway and I have sent the address. How long does this process take? from yesterday until now it hasn't landed yet even though there is only 1 winner

Mikhail: It's a scam (reply to 37257)

BNBx9: I checked the official account and there is indeed a giveaway lol 😂 (reply to 37258)

Sam: What is the downtime threshold for a validator before it is slashed?  Additionally, how are complaints submitted and voted on for malicious behavior? Is that an automatic process? Or does each validator need to manually vote on complaints that are manually submitted by other network participants?

Sam: Also, is it required to store the wallet for a validator node on the machine? This seems very unsecure

&rey: That's why there is single-nominator contract that allows to store most funds on cold wallet. (reply to 37264)

___: what do you think when listing on binance

___: who thinks what? (reply to 37266)

&rey: Please don't speculate, since that topic is already boring. (reply to 37266)

Sam: Can you link me to this? It seems like the validator would still need 600k TON of self stake before it can receive nominators. Where is that 600k TON stored?  Also, is that 600k TON required as self stake? Or can it all come from nominators? (reply to 37265)

Sam: I still would love to see what this single-nominator contract you are talking about is. Is it this? https://github.com/EmelyanenkoK/nomination-contract/tree/master  But if I want to use a restricted wallet so that the owner of the TON can be a cold-wallet, is there any documentation on how to use a wallet not created by mytoncore? (reply to 37270)

Dillon | DIA BD: Hello, is the core team attending DevConnect this month? Would love to connect our teams in person and invite you to a side event we are hosting alongside Polygon and a few partners

— 2023-11-04 —

doni: https://github.com/orbs-network/single-nominator (reply to 37271)

Crypto: Gm - am a non dev but doing some due diligence on Ton, would love to hear about the dev experience vs building on other chains and overall thought in FunC if anyone kind enough to share thoughts. Thanks!

Gunnar: I don't quite understand the lite-server smc.load - I can load an address, get an id, then I can use smc.runGetMethod and that id to run a method. How long is that id valid? Do I need to "unload" ever?

Max: Hi all 👋 Has anyone encountered an issue where android users get an error when connecting that the tonconnect-manifest.json file is not found? But for ios/windows users everything works fine.  I am using:  ├── @tonconnect/sdk@3.0.0-beta.1 ├── @tonconnect/ui-react@2.0.0-beta.2  thanks in advance, have a nice day 😂

Kiba: Hi! I would suggest updating to the latest beta version of the @tonconnect/ui-react package, which is @tonconnect/ui-react@2.0.0-beta.5, as it may contain fixes that could resolve your issue.  After updating, please try to reproduce the error. If the problem persists, it would be very helpful if you could create an issue here: https://github.com/ton-connect/sdk/issues.  In the issue, please provide detailed steps to reproduce the problem, along with a simple example project if possible, and specify the Android version and browser you're using. This information will greatly assist in diagnosing and resolving the issue. (reply to 37282)

Victor: Hello everyone,  I hope you're having a good day. I need some assistance. Is there anyone here who can provide an example or guide me on how to process Jetton withdrawals/transfers using the package available at this GitHub repository:  https://github.com/ton-org/ton  Your help would be greatly appreciated. Thank you in advance!

Basil💠 🐺MrBeast Meshchain.Ai #AIXhash SparkChain.RokoAI RICH TA: @TapFantasyGameBot tapfantasy

Giulia: Hello, I am working on a fun project that I won't release to public regarding crypto swapping (take changeNOW as an example)  I still don't know how to implement it an I need a suggestion about how could I structure the front-end and the back-end  I do know web development pretty well: I do know frontend (HTML, JS and CSS) but I also know backend very well (VPS, Python, JavaScript, React, NodeJS, SQL) what else should be necessary to learn to begin this project?

User: You have all necessary things for write own crypto swap service,  except experience in smart contract developing, which is the main part in any dex swaps. You can get some examples of it here: https://github.com/tonswap (reply to 37288)

Howard: can learn from this first https://ton-community.github.io/tutorials/01-wallet/ (reply to 37286)

Giulia: So with my current knowledge + dapp/solidity/smart contact knowledge I should be fine? (reply to 37289)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: solidity? recheck your `init_params` to be sure you have correct address you have to learn Fift - TVM ASM - FunC or Tact, these are TON's development languages (reply to 37291)

Juned: Can any one say me how to earn in ton

Erfan: You sure can work, and ask your boss to pay you in TON (reply to 37293)

Juned: ?

— 2023-11-05 —

User<6181040583>: Hello, is there a Russian chat?

F: @tondev (reply to 37297)

Anthony: You can explore all dev chats here: https://t.me/addlist/1r5Vcb8eljk5Yzcy (reply to 37297)

Juned: Hindi chat?

Anthony: Only https://t.me/TONSocietyIndia (reply to 37300)

Kushagra: Hi everyone, I am learning Jetton tokens and stuck with following:-   - Transfer them from my smart contract to a wallet address.  - Transfer from my wallet to the smart contract and perform some operations on it.   Can someone please help me with some good sample contracts examples?

Howard: FunC? (reply to 37302)

Kushagra: Yes

Miguel: Why are TON domains so expensive?

&rey: To avoid people registering all <8-letter domains. (reply to 37305)

Miguel: are .ton domains going to be a TLD?

Miguel: how can it be used for websites then?

&rey: TON Proxy, in different implementations. (reply to 37309)

Miguel: I found it here https://blog.ton.org/ton-sites thank you 🙏 (reply to 37310)

Miguel: I guess it happened anyway: https://tonscan.org/address/EQCc6kbu1-8uBUwKA4xg7R6XHjDPtzdO_hl-6NcrZ5XpM-tU#nfts (reply to 37306)

&rey: The known words, probably. But not bbbc.ton, for example. (reply to 37312)

&rey: Were domains cheaper, 100% of <8-letter names would be taken.

Miguel: yeah I guess

Miguel: How can I contact a address owner to buy that domain?

&rey: You can send a message to them. Maybe even encrypted, if wallet is active. (reply to 37316)

— 2023-11-06 —

순범: after send connected wallet to confirm some transaction, can I request wallet to cancel the previous transaction before user confirms it?

순범: I'm using @tonconnect/sdk

Felix: That would be on your end I guess. The previous transaction is only an intent to do a transaction, it doesn’t exist anywhere except your UI (reply to 37323)

Felix: Unless it already happened then you can’t cancel it

User<1658592266>: Are there developers of FunC smart contracts for the TON blockchain who want to participate in the creation of the project launch tokenomics?  ✍️ DM

doni: Hi

doni: does anyone know a tool to manage username ,  i want to connect a username collectible to a bot

Daniil: fragment.com (reply to 37331)

doni: thats just for buying and selling no ?

Dmitry | backend4you.ton: It has all docs about connecting/using

Budy: Apa ini

W: Hello everyone, I have a question.  I followed what is written in this document https://docs.ton.org/develop/dapps/ton-connect/sign When running from within Telegram Mini Apps.          After the signature is completed, it will not automatically return to my Telegram Mini Apps, and I also passed the twaReturnUrl parameter.

Mikhail: let hasRole: Bool? = binding.roles.get(needed);  rror: undefined function __tact_dict_get_int_int, defining a global function of unknown type       int $hasRole = __tact_dict_get_int_int($binding'roles, 256, $needed, 1);  Hello everyone, any suggestion with error?

I: Why Dev's community blocked?

&rey: Have you solved this? I guess you can't use bool as value type in map. (reply to 37337)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I tried to help, but that code is not valid for tact (full code available on tact gp) (reply to 37340)

Shayan: i want TON chain wallet address regex

Mikhail: It is, but the problem is that compiler cant recognise map with Int as uint256 as key (reply to 37340)

Daniil: it's basically base64. but note that not any base64 string is a valid TON address and you can't just use some regex to verify it.  https://docs.ton.org/learn/overviews/addresses#user-friendly-address (reply to 37342)

— 2023-11-07 —

Copemaster: hello is there any statistics on total bridge volume and stuff? where can i find this data

Sea💎✈️: ? Project name ton1 ? First created contract name (PascalCase) contract1 Error: Cannot create a contract with the name 'contract1'     at main (/Users/starsky/.npm/_npx/314ef3dfcdb14211/node_modules/create-ton/dist/cli.js:56:15)

&rey: I think you can't use digits in contract name. (reply to 37350)

Sea💎✈️: Thanks , I do it again (reply to 37351)

Sea💎✈️: npm create ton@latest                                                                                  ✔  622  16:09:39   ? Project name tonlearn ? First created contract name (PascalCase) contractlearn Error: Cannot create a contract with the name 'contractlearn'     at main (/Users/starsky/.npm/_npx/b56225140edd990c/node_modules/create-ton/dist/cli.js:56:15)

Sea💎✈️: It is not useful

Sea💎✈️: I know, the contract name should start with upper

MonoBit: Hey guys I have a question about testing Smart Contracts written in Tact!  consider this deploy message:          const deployResult = await testContract.send(             deployer.getSender(),             {                 value: toNano('1'),             },             {                 $$type: 'Deploy',                 queryId: 0n,             }         );  What is the value for? Is it going to be used as commission? I tried to get balance of both deployer and the testContract after deployment but the no matter what the deploy value is, there is not much change in their balances.

Howard: value is the tonCoin value you want to pay for this "Sending Tx" (reply to 37356)

MonoBit: Would this value be added to contract's balance? (reply to 37357)

MonoBit: I checked the contract's balance after sending the deploy message but the value is not adding up to it's balance

Dudi Hivera: anyone can tell me who ti make account on ton ?

&rey: Use some wallet application from https://ton.org/wallets. (reply to 37360)

&rey: And what is its balance then? (reply to 37359)

Sam: Does anyone know the purpose of validator temp key for ton validator node?

MonoBit: 0n (reply to 37362)

MonoBit: I use this snippet to get my contract's balance  console.log((await blockchain.getContract(testContract.address)).balance); (reply to 37362)

Aram: Hey guys, we just went live. A bridge to TON from 30+ networks. You can check it out and will be happy to hear your feedback: https://twitter.com/layerswap/status/1721878962786435399

911: Hello 👋

911: ​TON Foundation partners with Chainbase and Tencent Cloud to help mini-app builders develop and integrate with Web3  TON Foundation announced a strategic partnership with Chainbase and Tencent Cloud. This collaboration not only fosters Web3 mass adoption, but also simplifies the process for mini-app developers to build on TON within Telegram.  Through Tencent Cloud's enhanced support and Chainbase's first-of-its-kind data indexing product, mini-app developers are empowered with the tools they are familiar with for easier, more efficient development.   This partnership offers an unparalleled opportunity to build and integrate projects into a robust and scalable Web3 ecosystem. As more developers are onboarded to TON, the community will benefit from a diversified range of TON-based mini-apps within Telegram, designed to deliver a user experience as seamless as texting.  With 800 million monthly active users on Telegram, the stage is set for a vibrant and rapidly expanding ecosystem of TON-based mini-apps within the messenger.  Projects interested in exploring integration opportunities with Chainbase and Tencent Cloud are encouraged to contact TON Foundation via Telegram.  For more details about this collaboration, read this article. (forwarded from TON Community)

User<1658592266>: I don't understand why you need to build a bridge to the "still healthy" blockchain for all the compromised volume of scams in the DeFi segment?  Why is it still not possible to transfer tokens from TON to ETH and BSC???  This would allow the collection of huge liquidity that exists in these networks and then guide the holders of wrapped tokens into truly functional products based on TON!  Instead, you're just setting up those who believe in TON)))  If I'm missing something, please explain. (reply to 37369)

Aram: The opposite direction (from TON to others) is in development right now.  I don’t see your point. We have a mission on enabling connectivity between networks and we do it.   We don’t label blockchains. We just make sure that they are connected. (reply to 37372)

User<1658592266>: I'm not insinuating anything)))   I'm genuinely curious as to why currently all solutions, including the official TON bridge, work in one direction only (with the exception of Toncoin and a few other tokens). (reply to 37373)

User<1658592266>: I really wouldn't want the DeFi market of the TON blockchain to turn into the same dumpster of relentless scams as in ETH or BSC…  Is anyone seriously considering solutions to secure this market?  I understand that anonymity is the cornerstone of the technology, but implementing a mechanism to protect unqualified investors from scams will be necessary. Otherwise, mass adoption is out of the question! (reply to 37373)

Aram: The opposite direction is in development right now. In 1-2 weeks we will launch it. (reply to 37374)

Sam: Is it possible to just participate in every other consensus round with 300k TON, instead of needing 600kTON to participate continuously?  Also, is there a maximum amount of total stake on a node? I see all the top validators have the same amount of staked TON.

Chimit: Hi! can anybody explain why Tailwind classes work when I open my web app in the browser but don't when it's opened in Telegram?

Aydin: Hi all. I'd like to know how to convert 64 hex private keys back into mnemonics. For example, here:  https://answers.ton.org/question/1620783559922946048/  @pcrafter has replied:  "It should be possible to cut off the last half of key (64 HEX characters), which is actually public key, and use the rest in other wallets."  Now, suppose that I have done the above cutoff, and next, I want to convert the first 64-hex back into mnemonic, so that I can restore the wallet in another app (Tonkeeper, etc.). Now my question is: how to do this?

Daniil: it's not possible (reply to 37381)

Aydin: So, any other way to restore the wallet from the hex? (reply to 37382)

Daniil: what do you mean by "restore the wallet" (reply to 37383)

Aydin: I mean, to be able to access the wallet, and to send transactions from it. E.g., to withdraw tons from it

Aydin: Could you guide me how to do the coding, please?

&rey: You can use TonWeb or @ton/ton to do so. (reply to 37385)

Howard: this method is not easy to read. (reply to 33274)

Sam: Any way I can get a response beyond just a thumbs up? My second question has gone unanswered multiple times (reply to 37379)

&rey: 1. It's possible. 2. Maximal total stake is determined by max_factor * minimal stake among all validators elected (Elector contract maximizes sum of stakes). (reply to 37379)

Sam: Thank you! Where is max_factor defined? (reply to 37390)

&rey: Usually by validator. Upper bound on it is equal to 3 (196608/65536). (reply to 37391)

Sam: How do I define max_factor for a validator I start? Does it default to 3? Or do I need to specify that in a config somewhere? (reply to 37392)

Aydin: Done! Thanks 🙏  Note. Although the 2nd half of the 128-length string was used to generate the public key, for the secret key I had to use the whole length again. Using only the 1st 64-length half caused the error 'bad key size.' (reply to 37387)

Sam: I found that it defaults to 3 (reply to 37393)

Sam: Is there any way to view the mnemonic of the wallet mytoncore creates? I would prefer to just back that up if possible.  Also, is there any way to use an already created wallet instead of the one created by mytoncore?

— 2023-11-08 —

Howard: Sandbox question:   Is there possible to get the specific input value for an index ID within the one tx? Like here          console.log(printTransactionFees(tx.transactions));

User<95392270>: . (reply to 37185)

Pocharapong: Hello everyone, I'm in the process of developing a Telegram bot app and have some questions regarding the image upload input type. I've noticed that it functions smoothly on iOS devices, allowing image uploads to the bot app without any issues. However, I've encountered limitations on Android and the Mac Telegram app, where this functionality seems to be restricted. Does anyone have any suggestions on how to enable media uploads on Telegram for Android?

ETON: hello,everyone, Are any developers familiar with ton-ide-nujan? Can you tell me how to write  message.cell.ts. if my need send msg with value 0.2 TON, where to set msg value on ton-ide-nujan?

Sam: Hello everyone. When configuring a validator what is the purpose of tempkey, if I set it to a different key to permkey the validator does not work. Is there a way to make permkeys permanent as they seem to be deleted after each cycle.

doni: I think thats the desgin  each election has newly generated key …

Nadendla Nagendra: Please tell me how to mine ton coin

&rey: Mining has ended already. (reply to 37407)

Speculator: How can i redirect to my mini app after connecting with ton space wallet? I am using below code, it is redirecting to my bot but not able to start mini app.   actionsConfiguration={{twaReturnUrl: 'https://t.me/<my_bot>/??????'}}

Vikash: Any other new aap (reply to 37408)

Vikash: Please (reply to 37412)

Alex: Table printed via method printTransactionFees method, you can extract this value by the same way https://github.com/ton-org/sandbox/blob/main/src/utils/printTransactionFees.ts#L54 (reply to 37399)

MR: An interesting idea for TON airdrop:  A set of operations could be defined, for example:  1. The user receives 2 TON from their referral. 2. The user converts the 2 TON to jUSDT on DeDust. 3. The user converts the jUSDT back to 2 TON on StoNFI. 4. The user buys an NFT for the airdrop on GetGems for 2 TON. 5. The user sells the same NFT back on Tondimond for 2 TON. 6. The user transfers the 2 TON to their referral on the Telegram wallet.  Then, the user is given 2 TON as an airdrop, part of which also goes to the user's referral. (The operations could be more, for example, including fragmenting and so on.)  If this is done with an airdrop of 20 million TON, it would cause about 3-4 million new users to become familiar with TON ecosystem.  Because it has a referral system, as a result, that referral goes to teach the newcomers because they are also going to get a percentage.

Sol: hello/help me please.

Sam: Are there instructions anywhere on how to run a testnet validator? install.sh seems to default to mainnet and idk how to change that

Sam: Also, what port is used by default by a full node to peer to other nodes?

Sam: Still curious on this as well (reply to 37398)

Behrang: As far as I know, mytonctrl does not generate mnemonic.

Behrang: wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh  bash install.sh -m full -c https://ton-blockchain.github.io/testnet-global.config.json (reply to 37420)

Sam: Do you know if there is any way to have it use a wallet that was generated elsewhere? (reply to 37423)

Maxwell: Why put impure specifier in load_data function in some FunC contract?

Maxwell: Can load_data have some side effect?

Daniil: Changing global variables (reply to 37427)

Bean: When I send a message to contract, I use mode pay fees separately from balance, not from amount), but the tx is always failed untils I put 0.05 ton into message amount? I not sure the reason why? What happen when the fee is  greater than 0.05, how can we make it dynamic?

Daniil: “Pay fees separately” is related to forward fees for sending message. Gas fees are still covered using the value of the message (unless contract decides to cover them on its own) (reply to 37429)

Bean: One more point, do we have any stuff such as estimate gas fees to avoid tx failed?

Daniil: Some APIs have such methods, but usually you just add some constant value for fees (reply to 37431)

Gunnar: is the tonsource ipfs proxy down?

Gunnar: https://tonsource.infura-ipfs.io/ipfs/QmRL9q8iVNphgHQ5sifvxNpNKS3hytZGM8i8Rkn4TX1zr3

Gunnar: ?

Sam: Is there any TON validators chat where I can ask validator-related questions? I still have a lot of unanswered questions about how to run my val...

Anthony: Could you make a list of questions about validators? I will try to help you (reply to 37436)

Sam: - How can you use a wallet not generated by mytoncore? Or are you required to use the wallet that it generates? If the latter, is there a way to back up the mnemonic for that wallet? If the former, can that wallet be a cold wallet, or does it need to be hot?  - How are upgrades of validator-engine announced and rolled out?  - What networking rules are required on ports (inbound and outbound)? Is there a default port that validator-engine uses?  - What are the different levels of the verbosity flag for validator-engine?  - What does the --daemonize flag do on validator-engine? (reply to 37438)

Sam: I also have this GitHub issue open https://github.com/ton-blockchain/nominator-pool/issues/9

Anthony: I will be back in a few hrs (reply to 37439)

Mehdi: Hi Dear Builders  This is #TonQuestion#001  Why Cells in The Ton,have 4 references,why not 3? Or why not 5? The purpose of this question is not numbers? But design behind Ton. As we know in Ton everything is Cell. This is reminiscent of Linux,such that everything is file. We all know how abstraction effectively  helps us as humans understand things better!  This is a community oriented question to enhance learning. We share our knowledge to reach a conclusion.  At the end, ones who have an effective contribution, obviously deserve receiving some Ton. And this is magic,all can participate in Q/A and funding . It means you can ask questions, bring answers and fund  anyone you like,by knowing its username. #ThinkTonic series.Stay Tuned

Behrang: No I don't. (reply to 37425)

Behrang: https://t.me/tonstatus (reply to 37439)

— 2023-11-09 —

&rey: The reason is that dictionaries need 2 refs, thus MERKLE_UPDATEs likely benefit from 4. (reply to 37442)

User<6354011959>: I was looking at the certik report regarding the TON bridge, it said "Just as in the case of the entire blockchain, the stakes of the validators do not exceed the total supply coins of blockchains, and the stakes of the oracles do not exceed the total amount locked."  is there somewhere that i can find the stake of the oracles or the tvl of the bridge?

Howard: Can anyone confirm the validity of the following statement: For any particular (workchain,shard), contiguous seqnos always increment by one.   That is, for an example (0,2000000000000000) shard, if we're at seqno (0,2000000000000000,12345) and if a next seqno exists for that exact shard it will always be (0,2000000000000000,12346).

Andrey: + (reply to 37485)

ywjing: Hello, I’m new to TON. Is there a way to get public key of a TON address without calling a client?

&rey: No. Address is hash of StateInit, so it's impossible to reverse. (reply to 37488)

ywjing: Okay, thanks.

Elis: Oke

Sen: Hi, may I ask a question about validator numbers?  I saw that there should be 400 validator seats, but in fact there are only 319 validators? Is this because there are only so many participants, or is there another mechanism for selection?

MonoBit: Does anybody know what does exit code 130 mean? I could not find it on TVM Exit codes document.  This is a contract deployed with a seed on testnet.

PLATFORM: Before the Gates takes place at the Cypher Capital Hub—a reserved venue for builders, founders, investors, and blockchain enthusiasts within the TON ecosystem. November 9, 4 pm to 7 pm, marks a gathering, sharing a collective interest in the innovation of blockchain technology.   🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

&rey: Is this contract Tact-based? If so, you may find documentation on exit code among compilation artifacts. (reply to 37495)

MonoBit: yes. it is written in Tact. Where can I find that? (reply to 37497)

MonoBit: found It. Thanks (reply to 37497)

Mehdi: Thank you , would you please disscuss it more? (reply to 37447)

Mehdi: Why dictionaries need 2 refs ?what is MERKLE_UPDATE?any refrence link ..

Mehdi: This answer makes our question even harder ! It brings two unknown concepts as well. We are looking for a deep understanding of the design behind Cell in a simple word  and intuitive style. How this design fits into other parts of the system  If anyone is curious about its answer , please offer some nanoTon as a reward 🙏️️️️️️ to encourage more people to answer . I myself offer one ton and transfer it to who make me convince.

Mehdi: This is Question, in sake of freshness (reply to 37442)

Mikhail: Is there a way to sign message on front-end and then send signature to backend which will call a transaction in a contract

Mehdi: This is functionality of wallet in fact. (reply to 37504)

Mikhail: we are trying to make gas free transactions and pay for user (reply to 37505)

Mikhail: so we need user to just sign message in wallet, it's will return signature to us, then we will send it to backend and backend will send this to contract, then the contract will check the signature if it is correct user

Mehdi: I am busy with writing a new article that makes this topics more clear .its link : https://github.com/ton-society/grants-and-bounties/issues/20 (reply to 37506)

Mehdi: Short answer is : Although conventional user wallet have deterministic way of paying gas , but as TVM is complete turing machine , the possibility is endless .you can develop any algorithm you need without any doubt.for special your usecase my suggestion is utilizing sharding as discuss in sharding article in ton blog . it means you need an infrastructure that your user has a special wallet with your specific requirement .

Sam: Have you had a chance to check these questions out yet? (reply to 37441)

&rey: How is sharding even related to that?!! (reply to 37509)

&rey: Do they need to access user's NFTs/jettons? (reply to 37506)

Kushagra: Anyone can help me when error code = 65535 comes while executing a transaction on TON ?

&rey: Unknown opcode. Possibly you send message to the wrong contract. (reply to 37514)

Mehdi: https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons (reply to 37511)

&rey: You've missed the point @bulbadubz makes. He needs service to pay for the entire message (so user can have *zero* balance), not just more optimal contracts architecture. (reply to 37508)

Mikhail: found out about "external messages" guess it's what i need

User<6123789878>: Hello, is there anybody looking for a front-end developer?

Adrian: hello guys, what's the easiest way to go from eth to ton?(with as little fees as possible)

dean: just fixedfloat it (reply to 37521)

Adrian: No I mean literally my mom owns a little eth that I wanted to convert it into ton, from the eth network into ton.

dean: yea fixedfloat it

Adrian: what is that

Adrian: sorry

Adrian: lol

Adrian: thought it was some sort of developer term

dean: not sure if sending links is allowed here but it’s an exchange site

Adrian: Just googled it yes, thank you, on it

dean: make sure to get the official site and not just click the first one that comes up lol

dean: np

Adrian: Good advice for my tired mind, been in crypto since 2013, but truly one can't never be careful enough lol

Mehdi: I sincerely admire your experience and knowledge. We will have a  deep discussion soon .it seems you play with words.I am not pleased with your comment. Sorry for lack of time right now. (reply to 37517)

Aleksandr: Are there any web/web app designers here?  I'm going to hold a contest with a prize of 100 TON

Lichtkunst🐾: hello guys, is there any instruction for beginners how to write and deploy a smart Contract for Ton?

Daniil: https://docs.ton.org/develop/smart-contracts/ (reply to 37541)

Keash: Hi all I have some Exciting News! For whoever is in the UK 🌐 Join us at the Gameball Rally this Friday, November 10th, at the University of Greenwich, where innovation meets collaboration. 🚀 We're thrilled to showcase a lineup of incredible speakers and partners, leading the way in gaming, blockchain, and augmented reality. 🔗 Grab your tickets now and be part of this immersive experience: Event Link https://www.eventbrite.co.uk/e/gameball-rally-elevate-vr-ar-gaming-in-game-assets-tickets-750589281747?utm_experiment=control_share_listing&aff=ebdsshios  🎤 Our speakers will share insights that transcend boundaries, and our partners will unveil the latest advancements. Don't miss out on the future—mark your calendars! 🗓️ #GameballRally #Innovation #GamingTech #BlockchainRevolution #ARExperience

Dario: Currently, you cant pay gas for user. Wallet v5 has support for it https://github.com/tonkeeper/w5 (reply to 37518)

— 2023-11-10 —

ywjing: hi, does anyone know if users can sign arbitrary messages to prove wallet ownership ? I see the doc, it seems only supports signing a transaction.

Sen: Hi, does anyone know the mechanism here? (reply to 37494)

PLATFORM: The gateway has started, stay tuned to TonRadar to cover the news and follow the important news of the event.  🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

Andrey: ? (reply to 37566)

Andrey: Its our event

Andrey: https://www.youtube.com/live/vsAyfdmt374?si=r82OlUOj8MrCQS5C

Matthew: Is there any platform to catch event transfer from wallet on ton network without using workers, like moralis.io with eth, bsc...

Creature: Hello. I want to make a ton web. But when I remove "display: flex" style, wallet connect button not work. Hope anyone help me.

Lichtkunst🐾: Ok, thanks, what do you think about using AI to generate Code for Smart Cotracts? Any Experience with this? (reply to 37542)

User<6354011959>: what are the "fundamental parameters" that calculate the TON inflation rate? I cant find it anywhere

&rey: https://docs.ton.org/develop/howto/blockchain-configs#param-14 (reply to 37578)

User<6354011959>: none of these parameters talk about inflation rate calculation tho (reply to 37588)

&rey: There is no such fundamenal concept as "inflation rate" for TON. (reply to 37589)

&rey: It can be calculated from mint and burn rate, yes.

User<6354011959>: yes but the inflation number is variable so there must be some type of math behind it right? (reply to 37590)

&rey: TON specifies only mint rate (1 / 1.7 TON per block) and burn rate (half of transaction fees). (reply to 37592)

User<6354011959>: like what factors are considered for inflation to be 0.3% or 0.5%

User<6354011959>: do u have source on this? (reply to 37593)

&rey: These rates are specified in config I've linked above. (reply to 37595)

User<6354011959>: ah yea I just ment source saying thats what calculates inflation (reply to 37596)

&rey: Probably best to say that it just happens to be so. (reply to 37594)

User<6354011959>: yea thats fair

&rey: Once at connect. (reply to 37563)

User<6354011959>: can i dm ? i have another question (reply to 37598)

MonoBit: Hi everybody.  I am using blueprint to build my tact written contracts. I am trying to create a transaction via TonConnect ui-react sdk on front-end. How can I create that base64 payload to pass to the SendTransactionRequest object?  I am using the code below:  let data = new TonWeb.boc.Cell(); data.bits.writeUint(1804651575, 32); let task = new TonWeb.boc.Cell(); task.bits.writeString("My new task!"); data.refs.push(task);  // Create Payload TonWeb.utils.bytesToBase64(await data.toBoc())  But there is something wrong with my message that the contract cannot handle it.  Using ton-core was easier with the built wrappers of blueprint but I do not know how to create that boc base64 payload from the snippet below:  beginCell().store(storeMessage({$$type: "Message", "test": "HI"})).endCell()

&rey: Could you show message TL-B scheme from contract build artifacts? (reply to 37602)

MonoBit: ;; ;; Type: NewTodo ;; Header: 0x6b90cc37 ;; TLB: new_todo#6b90cc37 task:^string = NewTodo ;;  (slice, ((slice))) $NewTodo$_load(slice sc_0) inline {     throw_unless(129, sc_0~load_uint(32) == 1804651575);     var v'task = sc_0~load_ref().begin_parse();     return (sc_0, (v'task)); } (reply to 37606)

&rey: The contract can't handle it, or it doesn't get sent either? (reply to 37602)

&rey: So far the only change I would make is ```ts TonWeb.utils.bytesToBase64(await data.toBoc(false)) ```

MonoBit: What is hasIdx? (reply to 37609)

&rey: Big bags-of-cells have index to help to search a specific hash. (reply to 37610)

Anter: HI guys. How to create wallet with python?

Sam: @tsivarev curious if you've had a chance to check these questions out (reply to 37441)

Sam: Is there someway for me to get the 10000 TON required to run a testnet validator?

Brain toncoin: Buy (reply to 37614)

Sam: Its testnet... (reply to 37615)

Brain toncoin: yeah (reply to 37616)

Sam: Wdym "buy" then? Testnet tokens don;t have value...

Brain toncoin: Usdt testnet (reply to 37618)

Sam: How do I get USDT on testnet then?

Sam: I see here that I should ask for help getting testnet TON in this chat https://answers.ton.org/question/1490463706260180992/where-can-i-get-ton-coins-for-testnet

Tumin | Wagmi11: Why is tonkeeper marking tx as spam?

Tumin | Wagmi11: Is there a specific reason why?

&rey: Probably low value, attached comment and some other special algorithm. (reply to 37623)

Tumin | Wagmi11: what is a low value?

&rey: Please message @f_closer or use methods from https://t.me/tondev_eng/32726. (reply to 37614)

Butcher: Ton network charts

&rey: https://tonmon.xyz (reply to 37628)

Behrang: Although 10,000 is the minimum by network config, actually you'll need 50,000 to become a validator on testnet. (reply to 37614)

Sam: Why is that? (reply to 37630)

— 2023-11-11 —

Dynamic: Hey, i wanna create a telegram bot with TON crypto payment. are there any good APIs you could suggest? Thanks 🙂

&rey: I doubt whether they exist on TON. I've heard that markets with combined AMM and order books require complicated floating-point arithmetic. (reply to 37635)

&rey: API? https://help.crypt.bot/crypto-pay-api, for instance. (reply to 37637)

Dynamic: Yeah something like CryptoBot, are there any other available options? (reply to 37639)

&rey: There is certainly option of processing payments manually, and it's not that complicated actually. (reply to 37640)

Dynamic: Is there any recoursse on how to to do that?

sd: https://docs.ton.org/develop/dapps/asset-processing/ (reply to 37642)

Behrang: Current testnet validators stake a lot of TON, and Elector chooses the best subset, so you have to have at least 50,000 TON. (reply to 37632)

J. Victor Mendes: https://pay.wallet.tg/ (reply to 37637)

Maxey: https://www.youtube.com/watch?v=6CJTZK07rZE This link will take you to Ton Dynasty's instructional videos for the Tact Challenge Task3. 🎉  Developers who are interested can come and take a look. 👀 We will be uploading videos for Task 5 shortly. If you have any questions, please feel free to discuss them with us! 🙌

franklin: What about the mainnet? (reply to 37646)

Budy: Ini group apa ya kak

Norton: Description: English-speaking TON Developers Chat. (reply to 37652)

Budy: Bagaimana caranya kak

Behrang: Minimum is 300,000, but the actual min stake is a little higher, around 350,000.   https://tonmon.xyz (reply to 37651)

Norton: Why have two adress on my @wallet? TON space and TON?

Norton: Can explain me @pcrafter ?

&rey: Please don't ping participants of the chat unless the question is urgent... (reply to 37657)

Norton: I felt bad afterwards. Sorry about that

&rey: One is custodial, meaning you don't have secret key and thus true access to wallet. TON Space, on other hand, is non-custodial, providing mnemonic to you. (reply to 37656)

Budy: Bagaimana jika saya tidak mempunyai dana di awal. Apakah saya bisa mencari keuntungan tanpa modal kah ?

Budy: Untuk sementara

&rey: https://github.com/ton-society/grants-and-bounties/, or TON competitions. (reply to 37661)

Norton: My big question is: can you transfer TON regardless of the address? (reply to 37660)

&rey: These accounts are different. (reply to 37664)

Budy: Saya tidak bisa berbahasa inggris

&rey: Check out @toncoin_id_chat (reply to 37666)

Lichtkunst🐾: what happened to TON Marketcap?, dropped from 10 to 19 according to Coingecko

Mert: Hi TON community and devs, we are thinking of creating a desktop GUI for toncli that will transform it to a user-friendly cross platform desktop application. Any feedback is appreciated.

Daniil: Toncli isn’t that popular at the moment because of more user-friendly Blueprint SDK (reply to 37671)

Mehdi: Hi , I need your insight or relavant information or maybe similar project , How we can encourage service provider like gcp aws azure .. accept ton as payment for  subscription , what  step needed , what is biggest problem for adoption

— 2023-11-12 —

Budy: Hallo. Ini apa ya

Sen: Hi, I have a quesrtion: why is the master chain still being verified by validators outside of 100? such as: https://tonwhales.com/explorer/address/Ef9Ja2wbz7Dk5CzULeGhlv8RDCPOLWjXm3xOkwQBjBSta5xD

Bapi: Help me

Aydin: Perhaps the first and foremost obstacle is the fact that the whole TON ecosystem is seriously restricted in the USA.   For example, if you have followed news for the integration of Ton wallets into Telegram, you may have noticed that it is not accessible from the United States.  Even the historic event that finally led to the abandonment of the TON Project by Telegram and its subsequent renaissance as what is at present, was the problem of Telegram with some US restrictions. (reply to 37673)

Edward: It was interesting to search and read a little on Reddit /r/ Crypto about TON. I assume the audience of Reddit Crypto is massively USA based. I was shocked to read that very few people had heard about the project. Once Telegram was mentioned on a thread about TON, everyone then immediately dismissed it as 'Telegram is full of scammers' ... 🤷‍♂️ (reply to 37681)

MBA: hi, how can i approve a transaction with The Boc returned from tonConnectUi.sendTransaction() ?

— 2023-11-13 —

&rey: You mean, check if the transaction resulted in certain actions? (reply to 37689)

Sen: Hi, may I ask why pools always appear in pairs?

Jon Ren | Titan: Hey guys love to ask Does telegram allow us to embled web browser inside?

Behrang: After a round of validation (18 hours), the staked amount is blocked (for 9 hours) to punish misbehaving validators. While waiting, the next round is in progress.  If validators don't create the second pool, their servers will do nothing while waiting. So the second pool helps them to use the server all the time. (reply to 37694)

Sen: Thanks! In order to create two pools, does it require twice the funds? (reply to 37697)

Sen: If so, the actual cost of the server should be a very small part. The additional need for 400k TON is the decisive factor, right?

Daniil: Right. But you can try using nominator pools to collect the required amount if you don't have that much Toncoin. (reply to 37699)

Sen: Thank you! Is there any guide about how to create nominator pools? (reply to 37700)

Sen: Is this one https://github.com/ton-blockchain/nominator-pool that used?

Behrang: This is the smart contract. However, to start a nominator pool, read more here:  https://tonvalidators.org/ (reply to 37702)

Sen: Yeah, I have checked that website, but I can't find any guides about how to create/register new nominator pool to collect stake. (reply to 37703)

Sam: hey guys

Behrang: Looks like the documentation has changed. (reply to 37704)

Sam: is there a way to read blocks in TONWEB >? like we do in evm?

Behrang: Read this blog for nominator pool setup:  https://blog.ton.cat/how-to-validate-the-blockchain/  This may also help: https://github.com/ton-blockchain/mytonctrl/blob/master/docs/en/nominator-pool.md (reply to 37703)

Sam: https://dpaste.org/pyhrb  this is my EVM implementation for it, i am looking to do something similar for TON (reply to 37707)

Sam: is there a way to do that? @behrang ?

Behrang: I don't undestand your question. You want to read the blocks to what end? (reply to 37710)

Sam: like all the transactions of a contract, then do something with the transaction logs ( Events )

Sam: on server @behrang

Sam: seems like its doable in python  https://github.com/yungwine/TonTools  is there a similar js library for it?  ```client = TonCenterClient(orbs_access=True,                          testnet=True)  contract = Contract('EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG', client) print((await contract.get_transactions(limit=10))[-1].out_msgs[0].destination)  # kQCdaMggjCXoW867yRXilPw2bu8Av9dSBlGGCdDPIGNLKM8N```

Behrang: TonWeb is usually used on client side. You may want to look at tonapi.io or toncenter.com for webservices to read blocks. There are also some tools in different languages, like tonutils-go for golang.

Sam: leme check that, thanks fren <3

Sam: /v2/blockchain/accounts/{account_id} /methods/{method_name}  would this api work in case i use contract address as account_id  and in method name i would put the method name whos events i am interested in? @behrang

Behrang: I personally haven't got the chance to use those APIs, other devs here may help you. (reply to 37717)

Denis: i works even you use it as domain name (reply to 37717)

Sam: xD i didnt get the domain name reference (reply to 37719)

Sam: ( i am new to TON )

Denis: https://tonapi.io/v2/blockchain/accounts/subbotin.ton/methods/seqno

Sam: gawd daymn this api seems really nice

Denis: any over forms of account address will work too

Sam: so like i can pool event logs for a contract with this api easily

Sam: seems nice, i was under the impression TON is very hard xD but this api is really handy :"D

Sam: @subden just one question, the transactions this api will give me, would all be success transactions? right?

Sam: in multiversX case i was getting failed and pending TX as well then i had to put a seperate Queue to look out for new status of pending transactions

Denis: in ton trasaction doesn't have really one "Success" attribute

K: is there any other way to manage original base64 pub&private key wallet other than using mytonctrl or lite-client?

Tomek: Hi! I'm trying to figure out the way for TON bot app to open within the Telegram app on desktop, not browser popup on Windows OS. It works perfectly fine on Mac OS. Could you please advise?

PLATFORM: TOP 🔟 Dapps by unique wallets  📈📊  Various projects have a large number of daily transactions. TonRadar website categorizes different projects based on the unique wallets that have transacted with Dapps. Users can give the TonRadar website a view to check the top 10 Dapps on the website, charts, and statistics.  Check top 10 Dapps on TonRadar TMA  🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

K: I am trying to use mytonctrl. Just installed it and keep getting this error. Does anyone know what to do?  Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line I106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings

BNBx9: From the 2nd, I got a Twitter DM to win the TPS prediction giveaway and I sent tons of addresses, but up to this moment there has been no follow-up 😏

BNBx9: strange but True

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Maybe you have turned off the  "in-app browser" in Telegram's windows client  Share the bot ID so I can try it for better help (reply to 37732)

Tomek: Thanks so much.

𝐴𝑅𝐸𝐹 𝑆𝑆: Guys How to use @wallet as payment method?

Khamri: How do I check if an address is whitelisted before connecting to web3/ metamask via an module (rainbowkit etc) ?

Navpreet: [HIRE] Need an experienced TON developers for creating an API. Please DM

Nuno: Hey, is anyone else getting Cannot read properties of undefined (reading '0') when attempting to connect MetaMask in the bridge.ton.org

Sam: Can someone please explain to me the purpose/necessity of all the ports for running a validator node?  - engine.validator.config.out_port - engine.addr.port (I believe this is the only port necessary to be open to the public) - engine.liteServer.port - engine.controlInterface.port

Sam: Where can I see a explorer of testnet vals? https://testnet.tonscan.org/validators doesn;t load for me (reply to 37646)

Sam: Are all validator rewards for the consensus round automatically claimed by mytoncore? Or is a manual tx needed? Does the validator wallet need gas in order to claim the rewards?

Sam: Did you figure this out? I'm wondering the same thing (reply to 35213)

— 2023-11-14 —

Himu Globin: Hey, guys. we are keen to launch our product on TON. Product is solid and market validated for actual revenue generation. How can we go forward with applying for developer grant/support?  thanks

dean: How can i convert 24-word mnemonic to receiving address? I am using the console in wallet.ton.org

Behrang: I don't know, but maybe using mytonctrl on a testnet node, may help. (reply to 37752)

Behrang: I think so, since mytonctrl automates the sending of messages that are needed for validation.  Yes, since the wallet needs to send messages, it needs some TON for gas. (reply to 37753)

Sam: Where did you find the 50k minimum of you don’t have an explorer? (reply to 37758)

Sam: Where can I find how much gas is needed for validation? (reply to 37759)

Behrang: To bring up a node on testnet, you don't need any wallet at all. But to participate in validation rounds on the testnet, you'll need that 50k. So if you just want to test for yourself, you can easily bring a node up.  I developed a smart contract for participating in validations (Hipo), then asked @f_closer for test TON, to test the process in testnet before launching on mainnet. (reply to 37760)

Behrang: That gas amount is minimal compared to the staked amount. For example in the mainnet and nominator pools, apart from the 300k, you'll need around 200 TON per month. As the validator earns TON in the process of validating, nobody cares about that 200 TON. (reply to 37761)

Sam: atleast there are no pending transactions through the api, right? (reply to 37729)

Denis: It depends (reply to 37765)

Sam: so there can be pending transactions? (reply to 37766)

Sam: that would mean if i query transactions and if there are pending ones, ill miss those through the api? as i have already read the first 5, then when i read next 5, the pending one will become success at index 2, making me re read 5th tx on 2nd round, and miss the pending tx which was at index 2?

Denis: Do you have experience in other cryptocurrencies?

Sam: yeah, evm and multiversX, evm doesnt give pending transactions when u read through transactions, multiversX did, so i had to fire an other service which kept track of new status on pending tx

Denis: Forget all what you learned in a school other blockchains  :) (reply to 37770)

Sam: :"D

Sam: enlighten me o wise one, how would i go about pooling tx hashes to read events in TON of a specific contract

Denis: Firstly you are sending to blockchain not transactions but messages. And they create transactions.

Denis: So you can't predict hash of the transaction

Sam: well my usecase doesn't require me to predict, i wanna read the tx which went successful, and then check their logs to make decisions in my server

User<95392270>: https://t.me/tondev_eng/37776

Denis: Liteserver and toncenter return only transactions which encluded to blocks. Tonapi.io also returns emulated transactions in some cases. Something like pending. But in these cases we add in_progress: true (reply to 37776)

Sam: so basically i want to look at liteserver or toncenter apis, as their transactions would always be the successfulones, no failure and no pendings (reply to 37778)

Denis: No pendings - yes. No failure - no

Denis: In TON, each transaction has a million attributes and options for executing various phases, and an attempt to derive from this a single sign of the success of a transaction turns out very poorly. Blockchain is for the smart ones.  In the ethereum a transaction simply has a binary sign of success/unsuccess (well, pending until it is included in the block ).Blockchain for stupids.  And in Bitcoin, all transactions are either successful or not in the blockchain. Blockchain for successful ones.

Denis: Sorry for google translate

Sam: its fine, thanks for the information <3

Sam: this helped alot <3

Sam: so i am looking at this /getTransactions api in https://toncenter.com/ it has a attribute " IT" ( Logical time of transaction to start with, must be sent with hash. ) what does it mean? do i have to specify how long it took for a transaction?

Denis: Wiki: logical time

dean: How can i convert 24-word mnemonic to receiving address? I am using the console in wallet.ton.org

Sam: is logical time unique for all transactions? (reply to 37786)

PLATFORM: Set your alarms for our online session at 11:30am UTC ⏰  We will have an online session with Inal Kardan, Gaming lead at TON blockchain.  During the session we will discuss TMGs and TMAs. Also, stay with us to announce the winners of the contest.  🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

Sam: Hi, can we decode event log in TON ?

Denis: It wasn't a joke (reply to 37771)

Sam: alright, so is there no way? to get event logs decoded in TON? (reply to 37791)

Denis: You can try https://tonapi.io/v2/traces/{tx_hash}

Denis: I think it's more similar to you requirements

Sam: alright, thanks ill look into that

Sam: btw what makes a wallet active? i sent in 5 Ton in a newly generated address, its still inactive

Budy: Hallo kak

dean: you need to make a transaction with it (reply to 37797)

dean: by sending not receiving

Sam: is there a method i can use to find if account is not initiated? (reply to 37799)

Sam: so i can try to initiate it only then

dean: doesn’t it say on tonviewer

dean: active/uninit

Sam: what wallet address are you checking?

Sam: https://testnet.tonscan.org/address/EQATw7jzaDWNjF9xHDLEMHTTn1ORHLmhuH7LWAGV4nms-4Bk

Sam: this is my address

Sam: ah u mean there is no " not initiated state " basically i want to know if i have to do the tx from account or not (reply to 37805)

Sam: to make it active, or is it already active

Sam: programatically ~

dean: it says status - inactive because you havent made a tx from that account if you're asking how to grab that information programatically, not sure

Sam: well when i try to get its balance programtically, it fails

Sam: cause: Error: getaddrinfo ENOTFOUND test.toncenter.com      at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:118:26) {     errno: -3008,    code: 'ENOTFOUND',     syscall: 'getaddrinfo',    hostname: 'test.toncenter.com'   }

Sam: my main issue is not being able to get balance, when i already gave it balance, at this point in my code i dont necessarily need to make a Tx, i just wanna get balance

Sam: a little context i generated the wallet like this  const generateTonWallet = () => {      const KeyPair = TonWeb.utils.nacl.sign.keyPair();     const tonWallet = {         publicKey: TonWeb.utils.bytesToHex(KeyPair.publicKey),         secretKey: TonWeb.utils.bytesToHex(KeyPair.secretKey)     }      return tonWallet }   and then got the public address to fund like this const wallet = new walletClass(tonweb.provider, { publicKey: TonWeb.utils.hexToBytes(tonWallet.publicKey) }); await wallet.getAddress()

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You have to send the code to the contract address to activate it (reply to 37811)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: transaction.code: contract.fromInit(initParams).code

Sam: trying to deploy the wallet like this    const walletClass = tonweb.wallet.all['v3R2'];             const wallet = new walletClass(tonweb.provider, { publicKey: TonWeb.utils.hexToBytes(tonWallet.publicKey) });             const deployTx = wallet.deploy(TonWeb.utils.hexToBytes(tonWallet.secretKey))             const deployTxResult = await deployTx.send()    and its giving me this error TypeError: fetch failed     at Object.fetch (node:internal/deps/undici/undici:11522:11)     at processTicksAndRejections (node:internal/process/task_queues:95:5) {   cause: Error: getaddrinfo ENOTFOUND test.toncenter.com       at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:118:26) {     errno: -3008,     code: 'ENOTFOUND',     syscall: 'getaddrinfo',     hostname: 'test.toncenter.com'   } } (reply to 37818)

Sam: maybe you cant deploy from the same wallet which you want to make active?

Sam: is that how it is?

Sam: but doesnt ton keeper does the same?

Sam: so it should be possible, can anyone please pointout what i am doing wrong here?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: import { getHttpEndpoint } from "@orbs-network/ton-access"; import { mnemonicToKeyPair } from "@ton/crypto"; import TonWeb from "tonweb";  async function main() {   const mnemonic = "words ..."; // your 24 secret words   const key = await mnemonicToKeyPair(mnemonic.split(" "));    // initialize ton rpc client on testnet   const endpoint = await getHttpEndpoint({ network: "testnet" });   const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));    // open wallet (notice the correct wallet version here)   const WalletClass = tonweb.wallet.all["v3R2"];   const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });   const walletAddress = await wallet.getAddress();    console.log("wallet address: ", walletAddress); } (reply to 37825)

Sam: the problem is while deploying, i am getting address and everything, i even funded the wallet

Peter BıƖƖıơŋs: Hello Devs!!  I offer the services of a Product marketer, Research analyst and Web3 content writer.  I'm always available to work with solid projects.

Peter BıƖƖıơŋs: I can work as a short-term volunteer too (reply to 37828)

0xHowe: Hi guys, is there any articles to explain the relationship between FunC and Tact

0xHowe: the official tutorial don't the detail about this (reply to 37830)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: it's written top of FunC FunC —compile to--> Fift Tact —compile to--> FunC —compile to--> Fift (reply to 37830)

Sam: daymn i found the issue :"D if you look at the error closely, its trying ton center with url " test.toncenter.com" while url is testnet.toncenter.com :"D (reply to 37832)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: which I detailed in the code block, good luck and keep coding 🧑‍💻 (reply to 37833)

Sam: thanks fren, now my only issue is, if my script tries to re deploy the wallet, this would not happen right? it will fail? or a address can have 2 wallets deployed on it? (reply to 37834)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: it's related to the contract state but in this code (for initialing a wallet with tonweb) as long as those 24 words and keys do not change, you have the same address (reply to 37836)

Sam: did you mean not at all? so like i cant re deploy the wallet on same address then? right? (reply to 37837)

Sam: thanks <3

2023: 👍

dean: How can i convert 24-word mnemonic to receiving address? I am using the console in wallet.ton.org

Sam: one more question xD is Logical time of transaction unique for all transactions?

dean: Can get it quickly by just importing it but it would be easier to do it with a command (reply to 37841)

Sam: thats how (reply to 37826)

Sam: @cottonfarm ^

&rey: Unique on single account. (reply to 37842)

dean: So do i just copy paste that code into the console (reply to 37844)

dean: That looks different

Sam: ie if transactions are happening on contract, then all transactions will have unique Logical time of transaction (reply to 37846)

Sam: its a js code (reply to 37848)

dean: okay ty

Sam: by the way is there a example on how to decode the logs that i get from transaction ?

dean: It didn't work for some reason, can you show what I did wrong

dean: (this mnemonic is obviously for a wallet that is not funded, do not worry)

dean: oh wait, does the account need to be initialized for that to work

Sam: its a js code that means u need to install those libraries...

dean: I thought wallet.ton.org automatically has that

Sam: guys i am trying to get transactions with this api  https://testnet.toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get  this is the contract  https://testnet.tonscan.org/address/EQAgcUB9SbWSn3HEYTpKfg8ZbCwjBBiK-I22IUqBto1zkiXo  i am copying LT from 2nd transaction and giving it as LT param in the api, api is still sending me 3 transactions result back, is it supposed to be like that? from my understanding it should start reading the transactions from LT time i gave it

KG: hi there can anyone have a look why my tokes was vanished from my wallet

小马: Can TON transaction hash be changed?

0xHowe: Can I interpret it as Tact want simplify the contract writing? (reply to 37832)

Sam: hello, toncenter api is giving unexpected results  curl -X 'GET' \   'https://testnet.toncenter.com/api/v2/getTransactions?address=EQAgcUB9SbWSn3HEYTpKfg8ZbCwjBBiK-I22IUqBto1zkiXo&limit=10&lt=16541429000002&to_lt=16541429000002&archival=false' \   -H 'accept: application/json  i am giving it same LT and TO_LT, and its returning all three transactions of my contract, more over if i only give it LT and no TO_LT, the api still gives all transactions of contract, is this borken?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Mr. Alefman has good content @YouTube which has more details and workshop-based lessons in tact (reply to 37862)

Dmitry | backend4you.ton: for all transactions of this particular address only (reply to 37788)

Sam: @just_dmitry can you look at this problem, it seems weird (reply to 37863)

Sam: AH makes sense alright

Sam: xD thanks <3

Sam: @just_dmitry the event logs will come in  "out_msgs": [] ?

小马: Can TON check which validator packaged this block?

Mehdi: https://youtube.com/playlist?list=PLj6YT8oL2zOmNzTNxHKLuGIYHcNIIvPMi&si=aeRjNL66H4N5s0gO

Kushagra: Hi everyone, i am using jetton-minter in funC and able to sucessfully deploy the contract, but by default it is always taking the token name as SCAM. How can i change this?

Пескарь™ | фронтент телефонов: tonapi/tonviewer moment (reply to 37874)

Kushagra: I am actually using blueprint? Else in tonapi which API are you refereing to i am on this documentation - https://docs.tonconsole.com/tonapi/api-v2 Any example code that you share!!

Denis: sorry. but tonapi/tonkeeper/tonviewer rename all token with symbols from not whitelisted alphabets and has same SYMBOL as whitelisted jettons: https://github.com/tonkeeper/scam_backoffice_rules/blob/main/jetton_verifier.go https://github.com/tonkeeper/ton-assets/ it's made for users safety (reply to 37874)

Denis: пескарь doesn't love users but loves their suffering

小马: Thank you, sir (reply to 37872)

User<6592360178>: 剧本杀

Sam: I mean $500 per month is a pretty substantial amount still, regardless of how much the validator earns. Thank you though! (reply to 37763)

Sam: Do you know where rewards for the validator self stake from a nominator pool go? Do they stay staked in the pool? Or are they sent to the validator wallet? Just trying to figure out if I need to manage manual withdrawals from the pool to cover those fees  Or are those transaction fees taken from the validators stake in the pool, as opposed to the validator wallet itself?

— 2023-11-15 —

小马: Do validators randomly select validators when packaging blocks?

Philip: Hi I am running a full node with lite server, download the snapshot from dump site, every time the node start to download the archive, it crashed, with the latest msg, downloaded archive slice: /data/ton/tmp/tmpXXXXNalgKc

Philip: anything I can do for the debug?

&rey: Yes. You may find the details in https://docs.ton.org/catchain.pdf. (reply to 37884)

ETON: Can TonKeeper wallet import two wallet addresses, are there other TON wallets that can import multiple addresses?

Behrang: This is about nominator pools:  (and I might forgot something but this should give you an idea of how it works)  There is a wallet for the validator. Let's call it ValW.  ValW creates one or two nominator pools, let's call them Pool1, Pool2.  To activate them ValW should send 10,000 TON to pools.  To operate these pools, ValW should have around 200 TON per month to send messages to the network.  When pools are operational, they generate rewards and the accounts in the pool will receive the rewards. Specifically the account holding the validators stake (that 10,000) will receive the reward for the validator. So yes, you may need to withdraw those rewards from time to time. (reply to 37883)

Sam: guys is there a example on how to decode logs from a ton transaction?

Sam: also is writing contract in tact safe?

Sam: or one should rather write in func

Dima: Hey, guys, is TACT production ready? If so, wich version is the most stable and bug free?

Howard: is it possible set the TON dollar value in validator side or in the Config setting side?

Андрей: if you mean the ability to set the validator stake size in dollars, then program mytonctrl does not have this Perhaps other validator control programs can do this, but I don’t know of any (reply to 37896)

Mehdi: Hi , does smart contract without depends on external world , by itself could initiate transaction? Something like cronjob in Linux world.

Sam: nope

Sam: blockchain is like static, until a external entity touches it, it cant do anything (reply to 37898)

Mehdi: I guess so. Is it true for block zero as well ?I meant for first time that Blockchain are about to start? Since every thing is smart contract I am curious. (reply to 37900)

Sam: ye its true for the bootstrap block as well (reply to 37901)

Sam: and smart contract exists on blockchain, blockchain is not a smart contract

Sam: e.g : bitcoin does not support smart contracts, its still a blockchain

Mehdi: Sorry , Blockchain here refers to TON .Thank you for clearness

Dario: thats not true (reply to 37904)

Dario: https://en.bitcoin.it/wiki/Script

Sam: are you implying bitcoin can support traditional type of smart contracts? (reply to 37906)

Dario: depends what you mean by "traditional". there is no standard for such things, tvm and evm themselves are pretty different

Dario: but you can implement simple logic using btc scripts  there are also compilers/toolkits for it  https://min.sc/

Sam: ig i didnt know about this, seems quite cool, thanks for letting me know

Mehdi: Another question , with already tools and specifications in hand , is it possible we develop a whole Blockchain like TON   with one  smart contract as entrypoint? What does it mean ? A unique world or group of smart contract yet benefit from infrastructure TON provided , and also reside on base chain (not new workchian) such that craft everything for themselves,like new TLB schema , protocol and so on .but preserve available and necessary protocol and standard for work with whole system I mean compatibility issues. Why was this question asked? As the TVM is a complete Turing machine it means we can accomplish any algorithms. so why not a unique tiny TON Blockchain for proof of concept. Ultimately think of this process as a Nano service like Microservices in web2. It seems ridiculous, but its purpose is learning by using abstraction.This question does not expect details but an overview like  answer

Mehdi: How can we suggest a new term for the community, where is place for discussion. For example if somebody want to develop a book like " TON Blockchain, Nano Service Design Pattern" and bring this concept in whole community as a how we should think "Tonic"( this is another new word),and approach coding just for newcomers .Or suggest a new term like  "Naton"  that comprised from Nano and TON it has obvious meaning,and meant to replace for nanoton.(this reduce one syllabus for billion times everywhere and have clear concise meaning )

Andrew: Introducing TonSdk.Adnl: Native ADNL Implementation in C# (over TCP) for TON  🔍 We are excited to announce the launch of TonSdk.Adnl - our implementation of the ADNL protocol in C# using TCP. This development greatly simplifies the integration of ADNL into various applications within the TON ecosystem, enhancing both security and reliability of communications.  💡 TonSdk.Adnl includes features for generating ADNL addresses, as well as sending and receiving messages with encryption and digital signing. This makes data exchange between nodes more secure and efficient.  👥 With TonSdk.Adnl, developers can easily implement secure and reliable communication solutions in their projects, expanding the capabilities of the TON network. We believe this innovation will positively impact the development and expansion of the TON ecosystem.  🔗 Links: [github] [nuget] (forwarded from Continuation Team)

Dima: Is there an example of encoding and decoding cells with Tonweb?

sb: Yes, there are lots of repositories on GitHub with examples. First of all, try loadMessage method in ton-core library. If you want to encode cellsl, you should use the Cell class and internal class method toBoc (reply to 37915)

sb: Cell.fromBoc(<Buffer from BoC>);  new Cell().asBuilder().storeAddress(...).asCell().toBoc();

Dima: Thanks, trying that.

sb: https://github.com/ton-community/ton-api-v4/blob/a46540c15091c20ff5df7a67826eb3eb23d336f2/src/utils/rawTransactionToParsedTransaction.ts#L159  https://github.com/ton-defi-org/boc-parser-estimator/  It also can be helpful (reply to 37918)

小马: Thank you, sir (reply to 37888)

小马: Every block in TON is packaged by validators. Do nominators have the right to package it?

小马: Who generated the hash value in the picture? (reply to 37921)

&rey: No. Nominators are most often offline during most of validation round. (reply to 37921)

小马: Is this a random selection of validators? (reply to 37923)

&rey: Nominators are also called stakers. I think most of them open Tonkeeper, stake their funds and go away, periodically checking their balance, and that's all. (reply to 37924)

小马: Are the hashes in the graph randomly cryptographically generated by the validator?

&rey: Validators are full node runners.

小马: Are the 366 verification nodes randomly selected to package blocks? (reply to 37927)

&rey: The question misrepresents the issue. Validator ID is stated above, in "Created by". Transaction hash which is in frame is deterministic hash of transaction cell. (reply to 37926)

&rey: (Transaction hash doesn't depend on validator.)

小马: Which of these two belongs to the block hash value?

小马: So can anyone modify the parameters of this transaction hash value? (reply to 37930)

&rey: Pair of them is commonly used to identify block. (Though, indexers can find block from just one hash, of course) (reply to 37931)

&rey: Rather, no one can, even validators. (reply to 37932)

小马: I tried to find the block by the block hash in the graph but failed

&rey: ? https://dton.io/graphql/#query=%7B%0A%20%20blocks(root_hash%3A%20%2222a24cd0b3f2254e23e094e0c6ee0eddf82ad1408c156624bd9e97b96acb93e9%22)%20%7B%0A%20%20%20%20gen_utime%0A%20%20%20%20seqno%0A%20%20%7D%0A%7D (reply to 37935)

小马: The transaction hash value uses base64 and it should be possible to modify the transaction hash value.

&rey: Does something make you believe so? (reply to 37937)

小马: I just want to figure out this hash security

&rey: SHA256 — no collisions for it have been found yet. (reply to 37939)

小马: Is Root hash generated through File hash? (reply to 37940)

&rey: You should consult whitepaper for that. (reply to 37941)

Gio: Hey guys the managers of the community chat redirected me here

olanre: Hello

Gio: Im looking for a developer or an expert to dedicate a few minutes in DM and answer some questions

Gio: Im pretty excited about this project

Alex: Same question here (reply to 36985)

小马: Is there a 3-second interval between each block generation? (reply to 37942)

小马: First, the data to be calculated is converted into binary format. 2. Then, use a hash algorithm (such as SHA-256) to calculate the binary data. Hashing algorithms convert data into fixed-length hash values. 3. Finally, convert the calculated hash value into hexadecimal format as the final result. Tron's hash value calculation method is similar to other cryptocurrencies, mainly using the SHA-256 algorithm. SHA-256 is a hash algorithm widely used in the cryptocurrency field and is highly secure and irreversible. By calculating hash values, transactions and blockchain verification can be achieved to ensure data integrity and security. At the same time, the calculation of hash values can also be used to generate wallet addresses to protect users’ asset security. In short, the method of calculating the hash value is to convert the data to be calculated into binary format, then use a hash algorithm to calculate the binary data, and finally convert the calculated hash value into hexadecimal format. The calculation of hash values plays an important role in transaction verification, blockchain verification and wallet address generation. (reply to 37942)

&rey: Most questions are already answered in the chat! Do you have a specific project in mind? (TON chats' moderators don't usually DM you, by the way) (reply to 37945)

小马: Transaction hash value can be modified (reply to 37949)

Gio: I do, but I don’t want it to be disclosed publicly as of now (reply to 37950)

&rey: 1. I don't see such conclusion in the text you sent. 2. Have you asked ChatGPT? (reply to 37951)

Gio: It’s obviously based on the open network

小马: Thank you for your patient answer. I am willing to transfer you TON as a reward. (reply to 37950)

Gio: Is it possible to offer rewards here to get questions answered?

&rey: Usually that's not needed. (reply to 37956)

Gio: I have a series of questions that may require a person that is expert or Atleast above average knowledge

Gio: And may require up to 10 minutes to answer

Gio: I respect people’s time

&rey: There is a good mechanism of checks, either by @wallet or @CryptoBot! (reply to 37955)

小马: OK, thanks

&rey: Unfortunately I don't have much time now. (reply to 37959)

Gio: To anyone that has 10 minutes to time to dedicate in dm i offer a reward of 100$ in TON

Gio: No more than 10 minutes, VIA DM, to understand more about a few techicalities in TON, not necessarily Dev related, but still technical

Gio: Paid upfront

Daniil: You can try asking questions here :) (reply to 37965)

Mehdi: Hi  would you please once more explain your concern , maybe I can help . In case of hash , it was well explain every where . (reply to 37949)

小马: Thank you, I have solved the problem (reply to 37968)

Mehdi: We just  accept TON here 😉. We do not deal with dollar  anymore .we can help you for free, come dm (reply to 37964)

Gio: 100$ in TON

Gio: Or is it like 1TON = 1TON here? 😂

小马: You are conflicted here. The former says paid, the latter says free help.😂 (reply to 37970)

Daniel: This group are all scam

Mehdi: Also he told question and answer will be in public, the end invite him Private 😁 (reply to 37973)

Mehdi: Not all , scams exist every where (reply to 37974)

Daniel: I got this group link from a group I was in .I was scammed of my money (reply to 37975)

Daniil: Which group do you mean? (reply to 37977)

Daniel: The group that introduced this group link to me (reply to 37978)

Daniil: And why do you assume that this group is “all scam”? (reply to 37979)

Daniel: It was slk task group

Daniel: Cuz dat platform just scammed me of my money so dat means this platform is also a scam (reply to 37980)

Daniil: TON? (reply to 37982)

Daniel: I meant the SLK TASK GROUP dat invited me to this platform (reply to 37983)

Daniil: We have nothing to do with that group you’re talking about. How is TON related to that (and especially ton developers chat)? (reply to 37984)

Daniel: Cuz the Admin of that group sent the link

Daniil: Anybody can send the link. (reply to 37986)

Daniel: So if I was sc scammed there that means this platform is a also fake

Daniel: That's the head Admin (reply to 37987)

Daniil: Who? (reply to 37989)

Daniel: Michelle

Daniil: Is that an admin of any TON official groups? (reply to 37991)

Daniel: Dats you guys business

Daniel: U guys know wat u are doing

Daniil: Why do you assume this group and TON in general to be “scam” if you were scammed by someone not related to TON in any way? (reply to 37993)

Daniel: Cuz the group was designed this way no difference (reply to 37995)

Daniel: And the head admin introduced yur platform also

researcher: If someone from a scam group sends you a link to Google Support, it doesn't imply that Google itself is a scam. 🙂 Similarly, this is the official TON Dev Chat, aimed at assisting developers. (reply to 37996)

Daniel: So dat means u guys have hidden age nda

Daniel: I know wet am saying (reply to 37998)

Daniil: If you continue to do such assumptions I’ll have to mute you and delete the messages.  You were scammed by someone outside of this (and any other) official groups and we have nothing to do with that.

Mehdi: Also remember this golden sentences, " IN CODE WE TRUST". (reply to 37997)

Daniel: Mmm You guys are really good sweet talkers (reply to 38002)

Daniel: All the same

Daniel: Birds of the same feathers

Mehdi: You should know one purpose of Blockchain is put trust away by means of technology that come with code. Your talk is completely irelavant.sorry (reply to 38005)

Daniel: Well  Enjoy (reply to 38006)

Sam: So validator rewards will go to the pool, but tx fees are paid from the ValW outside of the pool?  And where do you see this 10,000 self-stake requirement? All the docs I have seen say 1000 (reply to 37891)

小马: Is the TON block a Merkle tree structure?

Maksim: it’s not (reply to 38009)

Maksim: some block parts can be replaced with Merkle Proof or Update exotic Cells, you can read about them in docs

小马: How could it have a Root hash if it wasn't? (reply to 38010)

Maksim: because any structure in TON is a Cell tree (reply to 38012)

小马: So it is the Merkle tree (reply to 38013)

Maksim: no :) read something about cells in docs (reply to 38014)

小马: OK (reply to 38015)

Behrang: 1- Yes  2- I'm not sure, maybe I'm wrong about the amount, but the flow is like that I said. (reply to 38008)

Daniil: Well, any cell tree can be efficiently used for merkle proofs (reply to 38015)

Sam: One more question - is the 200 TON per month requirement for a single pool? So I would actually need 400 per month? Or is that 200 TON enough to manage the continuous elections of both pools? (reply to 38017)

Behrang: I don't know for sure. (reply to 38028)

Emre: how can I learn user jetton balance? What can I do ?    const jettonWalletAddress = Address.parse(jettonAddress);      const jettonMaster = client.open(JettonMaster.create(jettonWalletAddress));     const jettonContractUserAddress = (       await jettonMaster.getWalletAddress(Address.parse(userFriendlyAddress))     ).toString();

Mehdi: External inbound message can not bear value. So how first contract get its balance ?I mean there is no smart contract to send it any value because this is first contract  and we can not send value from outside world.

Mehdi: I guess it should related to masterchain, as we know rules and config also is smart contract . so we should have special contract from zero block .

— 2023-11-16 —

F: Need some additional information to understand What this commands output: whoami find / -name "mytoncore.db" 2>/dev/null (reply to 38035)

Emre: When I use my app on mobile, my app closes because I am automatically directed to the Telegram wallet when TX starts. That's why I can't send the following requests, the code stays there. How do I solve this? Since the app is closed on mobile, this only happens on mobile, there is no problem on the web. (forwarded from Emre)

Emre: try {       const tx = await tonConnectUI.sendTransaction(myTransaction);       console.log("tx:", tx);        const bocCell = tonweb.boc.Cell.oneFromBoc(tonweb.utils.base64ToBytes(tx.boc));        const hash = tonweb.utils.bytesToBase64(await bocCell.hash());       console.log("Transaction Hash:", hash);       const explorerUrl = https://tonscan.org/tx/by-msg-hash/ + hash;       try {         await addOrdHistory(           accessToken,           id,           package_name,           package_buying_price,           payment_method,           payment_detail,           package_credit         ); (forwarded from Emre)

Speculator: What is the use of ADNL sdk? can i use it to connect with my liteserver and query basic data like getBlock , getTransaction, etc. if yes, can someone refer me some some good docs or any other resource.

Mr. John: With raw adnl you need to implement your own liteapi realization (reply to 38046)

Anton: the second one (Kon Vik) (reply to 38042)

Speculator: is there any docs for it ? (reply to 38047)

Mr. John: https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl (reply to 38049)

Mr. John: https://core.telegram.org/mtproto/TL

Emre: please help (reply to 38040)

User<6522114433>: Hello, when importing a TON wallet, how can I create my own personal key phrases (24 words) and calculate checksums?

&rey: Please take a look at tonweb-mnemonic module. There is no checksum in mnemonic. (reply to 38054)

S🅰️Ⓜ️⛎EL SEDI☪️: Any Dev here?

User<6522114433>: How to create your own keywords for greater security? (reply to 38055)

&rey: If you don't need to use them in wallet, a better way is to generate 256 random bits (Python's module secrets or other system RNGs) and use them as private key. (reply to 38059)

Sergey: Hi everybody! Why can I receive this error message after logging in via Ton Connect?

&rey: Please be careful; admins don't DM you. (reply to 38056)

User<6522114433>: Okay, how do you start using them in a private key?  There’s just no way to embed/enter your own words in the app. (reply to 38060)

&rey: Probably by app you mean Tonkeeper? There should be button like "import existing wallet"; that requires key phrase of 24 words. (reply to 38063)

User<6522114433>: Yes, that's right. I already use a wallet, but how can I replace my own words?  I want to generate my own words for greater security.  There is no such option in the application.  How to implement it? (reply to 38064)

&rey: Wallet is uniquely identified by its seed phrase; you can log out (if you keep the words, you'll be able to access funds later) and import other phrase. (reply to 38065)

User<6522114433>: Do I understand you correctly?  Will this come with a new update or is it already possible? (reply to 38066)

&rey: It's already possible, on settings tab. (reply to 38067)

User<6522114433>: Thanks for answers. (reply to 38068)

Sergey: this guy seems like a scammer

Sergey: Connect your Wallet using the connection link at the moment for sync to initiate your issue to be resolved (forwarded from User<6236505829>)

Sergey: clone page https://t.me/subden

Tim: https://tondiamonds.github.io/ton-wallet-generator/ (reply to 38065)

lowry: Hello everyone, may I ask if it's possible to receive a callback when using the Share API to share content to a channel, indicating whether the sharing process has been completed?

Bean: Hi guys! with the same contract code, how can I deploy mutil instances of the contract?

Клецка: change initial data (reply to 38085)

Клецка: address is calculated with code and data

Gio: Hello guys.  I’m looking for a developer/s, for an algorithmic smart contract, developer must be of advanced level.  The token project is revolutionary, and it’s the first time such smart contract system is implemented in all of crypto space.  DM me

Coinvent: Let’s discuss your idea in DM :) (reply to 38089)

— 2023-11-17 —

Emre: Help !!! (reply to 38040)

User<6989760788>: Then don't use TX? (reply to 38100)

Emre: Tx succesfully. since my app is closed, I can not send other process for example in this code (reply to 38041)

Emre: I can not see any process after tx line. because app is closed (reply to 38101)

Emre: in mobile

Emre: opened telegram wallet, my app is closed

User<6989760788>: :| I have to look over it when I'm home. I try to write you when I find a mistake

Emre: If you look, I will be soo happyyyy :) (reply to 38106)

&rey: Is your app closed or just paused (don't know Android internals, actually)? Probably the issue is in your app's manifest. (reply to 38102)

Emre: closed. What I change in manifest? (reply to 38108)

Sam: Can someone please explain to me how to create a restricted wallet?

error: Hello everyone! So, when I connect to tesnet via Tonkeeper, ton-connect shows that I'm on chain: "-3", but all the ton-connect docs say it should be -1. Where can I find a list of all chains codes? Is this even normal? not relevant Answer: https://ton-connect.github.io/sdk/enums/_tonconnect_sdk.CHAIN.html

— 2023-11-18 —

TON Answers Bot (not AI): Account derivation from Peter Acs  Since there are no derivation paths, I was thinking about using the same 12 word mnemonic, with a password that would be just a string of numbers incrementing... Is this correct logic?  Also I found it a bit confusing that it has a function   /__  _ Convert mnemonics to HD seed  _ @param mnemonicArray mnemonic array  _ @param password mnemonic password  _ @returns 64 byte seed  */ async function mnemonicToHDSeed(mnemonicArray, password) {     mnemonicArray = normalizeMnemonic(mnemonicArray);     return (await mnemonicToSeed(mnemonicArray, 'TON HD Keys seed', password)); } exports.mnemonicToHDSeed = mnemonicToHDSeed;  But I don't quite understand the purpose of it... in the documentation, it uses mnemonicToPrivateKey which has TON default seed, then in mnemonicToHDSeed it uses TON HD Keys seed. I'm a bit lost, please help.  🔗 Answer on TON Overflow

Mehdi: Is it a way to pay telegram premium subscription through TON? What a bout OpenAI?

Dmitry | backend4you.ton: Premium for ton: fragment.com (reply to 38113)

Mehdi: Thank you, it is new . (reply to 38114)

Mehdi: I wish  ,all other like aws ,gcp , azure, medium and ... have this possibility, It is really something needed . What's bottleneck for this , does anyone knows?

Zenith Studio LLC: hello Devs

Zenith Studio LLC: can i build the game in ETH network using TON sdk OR  i have to use only TON blockchain

Dmitry | backend4you.ton: I guess nobody of us can build ETH app/contract using TON sdk, but this doesn’t mean that you can’t too

Zenith Studio LLC: No like my queries are regarding is it possible to build games using TON sdk in Eth network ?

Zenith Studio LLC: have they given that facility ?

Dmitry | backend4you.ton: Who “they”? People who make ton sdk makes it for ton. It’s in name - “TON sdk”. For sdk to work in eth you need some ETH sdk

&rey: *TON isn't compatible with EVM networks.

Zenith Studio LLC: Thank you (reply to 38126)

Har: data 64

P̣̫̯̬͖a̭̹̲̭̙̦̞͇̱̣̥̟͎bl̦̲̘̖̗̰̭̥͚̗͚ᶤᶰ̞ˢ͇̗͖̙͈͚̤̪̗̘̻̰̙ᵏ̬͔̻̖̖̘ʸ̭̤͕̥̻̬: Doubt:  Have anyone tried to run TON storage in a docker file for raspberry pi 4 in the architecture armv8 ?

Sam: Anyone have any experience with this? (reply to 38110)

Ruslan: You may try this repo, but it wasn’t tested on RPi4 and on arm in general: https://github.com/kdimentionaltree/ton-storage-docker (reply to 38129)

Ruslan: Also, building TON binaries may require 8GB of ram

Oleg: You could also try tonutils storage (alternative ton storage implementation), it runs on any hardware  https://github.com/xssnick/tonutils-storage (reply to 38129)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I have a strange question, why don't we stake the jetton in the user jetton wallet itself? Why should a separate pool be created for it? Can staking jettons have any benefit other than reducing circulating tokens? 🤔

Zenith Studio LLC: can i build the game in TON and make the payouts in ETH or BNB ? (reply to 38126)

&rey: Then TON just has nothing to do with the game? (reply to 38135)

&rey: That is, it will be usual game with ETH/BNB payouts.

Zenith Studio LLC: Can we launch the game using  TON  sdk but still have the main token on ETH ?

Zenith Studio LLC: is it possible ?

Zenith Studio LLC: i am talking about this...if anyone has idea please clear my doubts

Mehdi: Would you please tell me why you want to do this cooperation? General speaking  this is possible because we are powerful tools in hand named code. we can do anything we imagine. But maybe there is no ready smooth route yet. And this is also no problem, as engineer we find a way or we build a way. Ton has much more capabilities than Ethereum. I guess very soon all ecosystem around it consider migration here .so my advice is to stay  away from Ethereum and utilities TON  because the future is here .This is my point of view. (reply to 38138)

— 2023-11-19 —

Zenith Studio LLC: I appreciate your answer but we are doing this because my client wants to have this feature   I run a blockchain company  etherverse.in (reply to 38142)

&rey: Please ask your client what "game on TON" means in their understanding. (reply to 38143)

Sea💎✈️: Hello, if I want to send to Jetton token to ton wallet by ts project. Only offer token name and received ton wallet . Can I complete it? Ton offer demo?

Howard: does anyone know what is the Fee value we should put in here for TON blockchain?   (Validator income => purely all from the gas cost or no?)

Mehdi: 120 Toncoin per day generated in addition to gas fee .Additionally, new coins are generated during validation. These also go to validators. Overall annual coin inflation is about 0.5%. (reply to 38146)

Howard: 120 tonCoin is on the config setting or no? (reply to 38147)

Mehdi: https://docs.ton.org/participate/network-maintenance/staking-incentives#positive-incentives (reply to 38148)

Mehdi: It is not clear what you ask or mean , whoud you please explain more? (reply to 38145)

User: Who can help with liteserver. It just stopped and return this error:  mytonctrl [debug]   19.11.2023, 07:16:35.867 (UTC)  <MainThread>  Thread self_test started [debug]   19.11.2023, 07:16:35.867 (UTC)  <MainThread>  Thread write_log started [info]    19.11.2023, 07:16:35.867 (UTC)  <MainThread>  Start program `/usr/src/mytonctrl/mytonctrl.py` Welcome to the console. Enter 'help' to display the help menu. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 68, in Run     process = subprocess.run(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)   File "/usr/lib/python3.10/subprocess.py", line 505, in run     stdout, stderr = process.communicate(input, timeout=timeout)   File "/usr/lib/python3.10/subprocess.py", line 1154, in communicate     stdout, stderr = self._communicate(input, endtime, timeout)   File "/usr/lib/python3.10/subprocess.py", line 2022, in _communicate     self._check_timeout(endtime, orig_timeout, stdout, stderr)   File "/usr/lib/python3.10/subprocess.py", line 1198, in _check_timeout     raise TimeoutExpired( subprocess.TimeoutExpired: Command '['/usr/bin/ton/validator-engine-console/validator-engine-console', '-k', '/var/ton-work/keys/client', '-p', '/var/ton-work/keys/server.pub', '-a', '127.0.0.1:56687', '-v', '0', '--cmd', 'getconfig']' timed out after 3 seconds

Mehdi: It seems problem is related to network connection issue . timeout , you can utilize simple script just to get config to proof connectivity  , maybe put some more time as it is now 3 second . also check your proxy if you use any . (reply to 38151)

Андрей: It looks like your local node is not working. I would advise looking at the node logs and looking for errors: /var/ton-work/log.thread* (reply to 38151)

Sea💎✈️: I want send LAVE to other wallet by TS . mock TonKeeper (reply to 38150)

User: There are a lot of same messages:  [ 1][t 9][2023-11-17 18:24:26.171143043][transaction.cpp:324][!litequery]       account 92AABEA785A7A090985A265CD31F323D849DA51239737E321FB055695E994FCF does not have a valid ShardAccount to unpack (reply to 38153)

User: https://github.com/AlexGor-dev/Top-Wallets/blob/1f01c4aa851b995c92de3c9672f06134741f428f/tonlib/ton/crypto/block/transaction.cpp#L324  Here link to line which return this error

Mehdi: Check this link , maybe be useful ,https://docs.ton.org/develop/dapps/tutorials/jetton-minter (reply to 38154)

User: Also found, that yesterday it throw this error:  5695E994FCF does not have a valid ShardAccount to unpack [ 0][t 8][2023-11-18 19:43:47.194476910][Status.h:273][!writer] Unexpected Status [PosixError : No space left on device : 28 : Pwrite to [fd:31930] at offset 25800704 has failed] in file /usr/src/ton/validator/db/package.cpp at line 69 [ 0][t 8][2023-11-18 19:44:24.823689025][Status.h:571][!adnldb][&status_.is_ok()]       [Error : 0 : IO error: No space left on device: While appending to file: /var/ton-work/db//adnl/MANIFEST-010566: No space left on device] (reply to 38155)

Андрей: It looks like you are running out of free disk space, you can check: df -f (reply to 38158)

Creature: Hello.

Creature: How can I send multiple transactions at once using tonweb.wallet.methods.transfer?

Creature: I mean multiple data in one transaction.

Dmitry | backend4you.ton: regular wallet can make up to 4 messages (transactions) in one call. "highload" wallet - up to 255

Creature: Thanks but how can I implement that using tonweb? (reply to 38163)

Alex: Hello everyone, is it possible to make an NFT marketplace on Tone that supports audio and video NFTs? Technically possible? Who knows the best NFT marketplaces on Tone - please send me the links

PavelN: https://github.com/fmira21/ton-node-docker  Hi guys! Just published an easy-to-deploy full node and HTTP API setup, take a look:)  I would be grateful for any comments (or stars).

Emre: I want to redirect user to my app again after transaction process. I wrote my telegram address like this:  twaReturnUrl: 'https://t.me/durov'. It worked

Emre: But I want to redirect to inside my app not only my channel. For example  twaReturnUrl: 'https://t.me/durd/buy-ticket'

Emre: I dont want this just. I want to enter Apps section. How can I control this.👌

Emre: with returnTWA on sendTransaction

Emre: help please ?

— 2023-11-20 —

Destroyer: Hi, I am trying to get the staking information about a TON wallet address via TON HTTP APIs, like the accumulated staking rewards and staking amount etc, but I haven’t found any relevant API in the docs. Do TON APIs support such feature?

&rey: This doesn't seem related to TON. (reply to 38172)

&rey: Staking is provided on higher level than blockchain itself, via different services (liquid staking and pools), so you can't have the relevant API. (reply to 38176)

Creature: How can I send multiple transactions at once using tonweb.wallet.methods.transfer? I mean multiple data in one transaction.

&rey: You need to use a somewhat lower level: see contents of that function and store several messages there. (reply to 38180)

Sleapy: Hello, my liteserver is eating lot of rams if it is running a long time. I would like to restart it to free some memory.  Is there a command or what services should I restart to do it cleanly ?

User: https://docs.ton.org/participate/nodes/node-maintenance-and-security#database-grooming  Maybe it will help, but i am not sure that i properly understood your question (reply to 38190)

Kiba: Hey Emre! The functionality you're looking for will be available once the pull request is merged and closed: this includes updates that should allowing you to direct users to your TMA. (reply to 38172)

Emre: Wow is this a new update? (reply to 38192)

Sam: Bumping this - can someone please help me with how to create a restricted wallet? (reply to 38130)

Emre: Will you add this to documentation

User<6351274838>: I have a question I want to create a multi coin wallet using python But my bip39 mnemonics are not compatible with ton, what should I do? I can't do much about it using tonsdk library in python

Emre: How can I see any example about that. (reply to 38192)

Kiba: Yes, this is part of the upcoming updates.   As a developer, you won't see any changes in the interface. TON Connect SDK will work correctly with TON Space and twaReturnUrl after the update. (reply to 38194)

Emre: Good news. When I use this update

Kiba: The update will be available soon. We are currently in the testing phase. (reply to 38200)

Emre: Excited!!! I am waiting this update for our project (reply to 38201)

Tim: So when it will be merged?

Sam: I am also still curious about all of the ports in the config and what each does (reply to 37751)

Sleapy: Thank you I guess that it s what I need (reply to 38191)

Mikhail: Hello everyone, for some reason in Tact receive() functuion cannot change contracts variables

— 2023-11-21 —

researcher: /report (reply to 38207)

Crypto Rookies 🥷: Hello everyone, I'm starting to build on TON, and I'm wondering if there is a good SDK for Rust?

Hakiem: Hi guys, for the jetton metadata standard, what goes in the "image_data" field? I used a base64 string of my svg logo but it does not render on Tonviewer.

&rey: Base64 of PNG or WEBP worked fine. (reply to 38211)

Hakiem: neither png nor webp works for me. logo doesnt render on tonviewer. do i need to refresh the metadata or something like on opensea (reply to 38212)

Behrang: I used a URL to the image like this:  https://app.hipo.finance/hton.png  Source: https://github.com/HipoFinance/contract/blob/main/scripts/deployTreasury.ts#L55 (reply to 38211)

Behrang: What do you mean by restricted wallet? (reply to 38195)

Behrang: AFAIK, one port is used to access liteserver over the internet, another is used for configuring the node from local server (control port I think). (reply to 38204)

Vivek: I didn't get any Money

Vivek: How Could I belive in this App

Vivek: Give Money Then I believe That this app is best

Vivek: Fake

Dmitry | backend4you.ton: what app? this is developer's chat

Hakiem: this is my metadata uri: https://ipfs.io/ipfs/QmQJ6cbf49po4QMuucZoDgW6iUeX59Mzh7Atz4j8sWT5yp  tonviewer manages to read all the fields except image (reply to 38214)

Behrang: I haven't used the metadata uri approach. So your way differs from mine.  Isn't it a caching problem? Maybe you have used an older uri previously and now changed it, but tonviewer cached it?  I had a similar issue with Tonkeeper, and images where cached. I managed to change the URL a little (by adding a ?v=1 at the end) to bypass the cache.

tina: Is it possible to configure redirection upon successful connection or transactions within the TON wallet on Telegram? Why does setting the returnStrategy address for wallet connections enable the return to the respective address, whereas configuring the address within sendTransaction does not take effect?

Wayne: Hi have a quic question, we have a product Dapp already built on Polygon. How can we also offer it on Telegram ?

Wayne: Is there any sort of Wrapper?

User<1166596949>: If you use smart contracts you have to rewrite (reply to 38228)

Wayne: No cross platform possibility ? (reply to 38229)

Wayne: Meaning can we still oparate dapp on ton and on the web that they will be in synchrony

Slava: We've got some update regarding TON Bounties. Feel free to share with guys who would be interested to participate:  🍭 47 Active bounties →  👷‍♂️ 11 Approved bounties. Actively searching for an assignee →   💬 11 bounties under suggestions. Share your opinion →

&rey: Smart contracts (TON) replace backend. (reply to 38230)

&rey: For frontend you'll still need to write an application or website.

User<1166596949>: Yeah i assumed he was talking about the backend (reply to 38234)

User<1166596949>: Existing front-end should be easy to adapt

&rey: If you choose website or app on a crossplatform framework (such as Rust#egui), you'll have full crossplatform-ness. (reply to 38234)

User<1166596949>: But backend needs a rewrite, due to the large differences between the blockchains

&rey: By the way, you can use Polygon wrappers in Telegram web apps. Discussing that further, though, is out of this chat topic. (reply to 38227)

Wayne: DMed you. (reply to 38239)

ⓌⒷ Rosé 🇺🇦: hey there. sorry for replying on your message. this is offtopic, but do you guys handle the same?   🔗 https://t.me/toncoin_chat/174349 (reply to 38239)

shawm \z/: Gm all! (Shom here from Graviton Web3 Accelerator)

shawm \z/: Graviton is a multi-VC syndicate comprising Hashkey, NGC, Moonrock & others in the web3 investment space. Our fund runs a 16 week acceleration program that assigns seed checks & grants to selected teams, in addition to them working alongside some of the best mentors in the industry.  Last portfolio has 3 oversubscribed venture rounds, 1 acquisition & amazing media visibility: Google "Graviton-backed startups" to know more.  We're currently scouting for applications from early stage / growth stage projects.  Our ideal applicants are folks working in lean teams, with a low / high fidelity MVP.   If this is you, please fill up this 2-min form at tally.so/r/mYRD6J or send it to a founder you know 😊️️️️️️   All applications are free. The grant pool is $100K this time. #LFG

&rey: Please message @abslzero with the scammer details and proof. (reply to 38241)

Emre: Many user has this problem like me. Admin said to tonconnect npm package will be upgraded after some changes. We are waiting this feautere as team. I hope, will be okey. I wrote our this problem in this channel (reply to 38224)

Sam: Are there any docs explaining this in more detai?  And this is a restricted wallet: https://docs.ton.org/participate/wallets/contracts#restricted-wallet (reply to 38216)

Mikhail: Hello everyone, why does emiting event with address in params showing mainnet address while in testnet?

Shruti: Hello everyone

Christine: Hyy (reply to 38248)

Sam: Does anyone in this chat run a validator? I would love to discuss some stuff over DM

User<6237448962>: Hi , who is in need of dev?

Sam: Is there any way to use mytonctrl when validator-engine is using something other than /var/ton-work as its db?

— 2023-11-22 —

Rae: Is there any TON wallet that holds and mint NFT?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Interesting, Are you have any idea about how is the process going for this? (reply to 38254)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I had a try to mint directly from wallet by sending a fixed TON amount. But the receiver is an nft collection 🧐 (reply to 38254)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I think you are looking for a super app which has a prebuilt nft minter. Still cool. 🗿

Rae: Yes. I'm looking to give NFT minting ability if user meets certain requirements (reply to 38257)

Trap 🍅: yes there is!!!!

Rae: Which one please (reply to 38259)

&rey: If I understand correctly, you will need a custom smart contract. (reply to 38258)

Rae: Yes, for the requirements but is there a wallet that is able to store and mint atm? (reply to 38261)

Trap 🍅: which one as in ?? (reply to 38260)

Trap 🍅: which one u can mint or ??

Rae: Which wallet (reply to 38263)

Trap 🍅: where ?

Trap 🍅: in which wallet u want to mint ?

Rae: I suppose minting will be a platform of some sort maybe

Rae: Which ton wallet can support nft storage now?

&rey: You don't need support from wallet side, I think? (reply to 38262)

&rey: Wallet can be however old and not know what a NFT is, but if it supports TON Connect 2, it's going to work.

Rae: Thank you (reply to 38271)

Teresa: Hi! I am integrating the tonplay-unity-sdk to a unity project, and following the instructions I don´t know hoe to find the UserJWT because the bot tonplay_dev_bot does not work. Also the Scenes folder under Examples does not exist anymore. Could does someone help me please?

Mike: Hi, Can anyone tell me where i can go with a technical question. I am getting an error when withdrawing TON from MyTonWallet. It fails when confirm via Ledger

botmother: Hello guys, i'm looking for a func developer to develop a land based NFT contract. Please hit me up!

Teresa: HI! Solidity dev here (reply to 38279)

Master: Here (reply to 38279)

Sam: Hello everyone, guys, please tell me. I want to connect to the site a ton, I entered in1.ton.org, port 8080 into the proxy. I enter some address and the connection does not occur. What could be the problem?

— 2023-11-23 —

TON Answers Bot (not AI): I want to know about how can I earn from this project  from Ujjwal Kumar    🔗 Answer on TON Overflow

Ramanna💞Savatri: .kgf movie

Sleapy: Hello. I did not dig into smart contracts and tvm yet but do you know if in the future it is possible to make transactions cheaper ? I found it very expensive (in TON) to transfer tokens. I understand that there is storage rent but even when all the Jettons wallets are deployed it still cost a lot compared to other blpckchains.  Maybe I missed something though

Mehdi: That not true . Please check out this  https://youtube.com/playlist?list=PLj6YT8oL2zOmNzTNxHKLuGIYHcNIIvPMi&si=lKL8j9O-pgGaUOHq It is good starting point . (reply to 38289)

&rey: Yes, validators can vote for such a change. (reply to 38289)

Speculator: let transfer = await walletContract.createTransfer({         seqno: seqno,         secretKey: keyPair.secretKey,         messages: [internal({             value: '0.05',             to: '',             body: 'Test'         })]     }); I want to estimate the fee of this transaction, how can i estimate using "ton" library

Sumit: Sumit, [23-Nov-2023 at 3:12:11 PM]: Hey Ton Fam,  data: {       ok: false,       error: 'INVALID_BAG_OF_CELLS: bodycannot deserialize bag-of-cells: invalid header, error 0',       code: 500     }  i am getting this when sending a transaction after signing it

Sumit: const walletContract = client.open(wallet);      // console.log(walletContract);      const seqno = await walletContract.getSeqno();      console.log(seqno);      // return;      const tx =  await walletContract.createTransfer({          secretKey: key.secretKey,          seqno: seqno,          messages: [              internal({                  to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",                  value: "0.05", // 0.05 TON                  body: "Hello", // optional comment                  bounce: false,              })          ]      });      console.log(tx);      const signedtx = sign(tx,key.secretKey);      const tr = await client.sendFile(signedtx)      console.log(tr); whats wrong in this

Sleapy: I'll have a look thanks (reply to 38290)

Sleapy: Can it be done on the basechain or a new workchain will have to be created ? (reply to 38291)

&rey: It can be changed on the basechain, as well as on masterchain or other workchains if they are created. See "config parameters" in docs. (reply to 38296)

&rey: You don't need to replace tx with signedtx: tx is already signed for that matter, and even if it wasn't you were signing message incorrectly. (reply to 38294)

Sumit: so what can be a solution here @pcrafter

&rey: await walletContract.sendTransfer({   // all of those parameters, starting with secretKey });

User<1166596949>: Hello. What's the place for exchanging Toncoin to fiat with the lowest comission

Sumit: but i want to create sign the transactions in two steps

Sumit: then send]

Sumit: send(provider: ContractProvider, message: Cell): Promise<void>;

Sumit: what is provider hers

Sumit: is it the ton client or

Sumit: clinet.provider()

Sumit: ok then how do i send this signed tx @pcrafter without sendTransfer

&rey: Automatically provided. (reply to 38305)

&rey: await walletContract.send(tx);

&rey: And you won't be able to create and sign transfer separately because wallet contracts and signing procedures for them are different. (reply to 38302)

Sumit: ok

Sumit: then how do we create an arbitrary transaction not just send and then sign it and send it to network

2023: Sm

Sumit: sendFile method of ton client can send any buffer to a network, then why do it doesnt send a buffer signed by the sign function of ton/crypto

Ceren: Hi frens, when one of our community members tried to vote in The Open League voting page they got the error as shown on the image. It is because it does not have the voting power at the height of the block where the voting is opened, so it can participate in the next one but not in the previous one.

Lawree: Okay

&rey: "sign transaction" is meaningless in TON. (reply to 38313)

&rey: You can create an external message and send it; this message is delivered to a contract, usually wallet contract, which parses it; signatures are checked on that level.

Sumit: And how do we get transaction hash of a transaction

Sumit: So you mean you sign a message when you create it there is no way to create a message then sign it separately? (reply to 38319)

Sumit: I just went through the SDK I saw there was a sign function too which takes Cells and produces an buffer

Sumit: Hopefully signed transaction

Sumit: And when I tried to send that it gave me invalid bag of cells

Zheng: Hi, is there any multi-party computation wallet for TON available now?

Daniil: there's an official multisig-contract  but note that it will be replaced by a new version (most likely with multiowner-wallet) soon. (reply to 38325)

Zheng: Thanks! But what I am looking for is something like Web3Auth or Privy works on EVM. Let users create a non-custodial wallet by user's social account (like tg userid) and one or more other key-information (for example, pwd) , for the dapp usage only.

Daniil: any tg user (not from US) can use @wallet's TON Space (reply to 38327)

Zheng: As far as I know, TON Space works like any wallets that impl. the TON Connect, I am not sure is it right?

Daniil: ton space supports ton connect, right (reply to 38329)

Zheng: Thanks. With Ton connect,  before any write message send to the chain may launch the wallet app to sign and send, which blocked some of our users from web2. So I am looking for any non-custodial MPC wallet solution that could help users sign in the app. （Absolutely with lower security, but will be more acceptable for web2 users)

Alex: Hello everyone, MyLocalTon got its upgrade and now has integrated ton-http-api service. In case you have problems enabling ton-http-api out of the box, please refer to the manual installation.

— 2023-11-24 —

tony: how to customize this top bar by myself wothout using playdeck toolkit

678: anyone knows how to troubleshoot?  when uploading preloader (mp4) on TON Play admin panel of playdeck, I am forced to be logged out

678: PlayDeck / Ton Play guys have not replied more than 2 wks it seems quite weird...

tony: same here, no reply from the support bot....... (reply to 38343)

678: No reply from anyone - bot, mail, team member... what happened (reply to 38344)

&rey: This is not related to TON at all. (reply to 38341)

678: that's not about dev bro

Maxwell: I've noticed two different jetton-wallet implementation,  `jetton-wallet.fc, jetton-wallet-discovery.fc`, maybe there're more of them. My contract needs to use the jetton_wallet_code as a parameter to calculate the jetton wallet address on the fly. How do I handle the uncertainty of jetton wallet implematation?

&rey: When you create a jetton, you decide the jetton wallet you use. Most projects use their own ones. (reply to 38352)

Mikhail: How do i store string in a cell?

Maxwell: Ok, so there're is no such thing as standard&unified jetton implementation, it should be handled case by case. (reply to 38353)

&rey: In which programming language? (reply to 38354)

Mikhail: ok got it, solved with string builder (reply to 38356)

Mikhail: i have a question about checking signatures in ton: https://answers.ton.org/question/1602580552903299072/check-signature-check-data-signature-usage-for-signing how do i get public key in front-end? i have something but it's too large number and not in INT format, how do i convert it into int?

Mikhail: i've found this answer, but isnt public key must be sent to contract with signature? why we cant use sender()? (reply to 31622)

Dmitry | backend4you.ton: there are two standard jetton implementations: for TEP-74 (non-discoverable) and TEP-89 (discoverable) (reply to 38355)

&rey: sender() isn't 256-bits slice, it is 267-bit slice containing the contract address. (reply to 38359)

&rey: And public key is usually stored within contract-receiver.

Mikhail: yep, thats the question, my questiong is how can i send public key into contract? (reply to 38361)

&rey: Please consult how wallets work (https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc) for reference. (reply to 38363)

Colin: Hey guys! I'm working on a data visualization platform, and I'd like to get some data into my database to visualize about TON. It doesn't have to be all the data ever, but being able to do some overall analytical queries like count of blocks/transactions per month... maybe a viz of burn rate... things like that. I have looked over some apis and things, but don't see an easy way to bring in this type of data. Any tips? Thanks in advance

— 2023-11-25 —

User<5842008916>: Hi, anyone knows something about that?: i sent a ton nft (anonymous number) to a standard eth wallet. With standard wallet i manage native metis coins, and also i can see the nft on ton explorer that is property of my eth standard wallet. The issue i when i want to connect to ton web3 services, it cant conect. So i tried to open with seedphrase at tonkeeper my wallet... and they arent compatible, seems its another algorism... so now i have an nft what i cant use, and i cant move to a ton wallet... but it is already on ton explorer... if someone knows how to solve my problem, or anyone knows if in the future standard wallets can conect to fragment (for example)? Or i just lost the nft. If any dev with blockchain knowledge can help me understand this o will be very grateful. Thanks for your time

Andrew: Introducing openlib.func: open-source extended library for FunC!  🛠 Currently, we're using this library for smart-contracts development in the Continuation Finance. It not only optimizes gas consumption in common scenarios but also simplifies the development of our contracts.  🔧 Our library comprises three modules:  openlib.func: The core part of the library giving many builders for standard situations, as well as interesting functions that make contract development more efficient.  gaslib.func: This module implements gas params keeping and gas-to-gram calculation in the smart-contract. Recognizing the importance of considering the amount of gas used is crucial within the security context of smart-contract development.  mathlib.func: Currently, this module includes a highly optimized square root function. However, be aware that we plan to complement it with new functions in the future.  🔗 Links: [github] (forwarded from Continuation Team)

Nha: Go to ton.app and check redoubt project. They have everything you asked. (reply to 38367)

Colin: Ok I'll have a look thx a lot (reply to 38371)

Maxwell: yeah, but there's no guarantee projects would use the exact same code from official impls, as jetton_wallet_code is critical for calculate the jetton_wallet_address for some cases. (reply to 38360)

Dmitry | backend4you.ton: If your project critically depends on other projects contract implementation… what is its name? :) (reply to 38373)

Maxwell: > docker run --rm -it -v ./jetton_tests:/code toncli-local run_tests -c jetton_minter  Try to run the jetton_tests under token-contract repo, but it seems the cmd line not working?  the volume binding for jetton_tests as root but it also needs to read the  ../ft/* files. How to resolve this?

Maxwell: There're custom jetton token which my contract is the owner, and I need to send jetton to other wallet, so I need to calculate the jetton_wallet_address on the fly, but the jetton's implementation is agnostic for my contract. (reply to 38374)

Maxwell: My previous (wrong) assumption is there's standrard & unified implementation for jettons, but it turns about to be wrong as @pcrafter suggested, so I need to change the architecture design to handle the uncertainty.

Dmitry | backend4you.ton: You don’t need recipient Jetton address to send jettons to him. Read TEP 74 - you need address of new owner (his main wallet), not his Jetton (reply to 38376)

Dmitry | backend4you.ton: https://t.me/tondev_eng/34329 or check this quick summary

Maxwell: Sorry, I might not be clear enought, I mean calculate the jetton_wallet_address owned by my_contract, not the receivers. (reply to 38376)

Dmitry | backend4you.ton: On chain (in contract) or off-chain (backend/server/…)? (reply to 38380)

Maxwell: Onchain

Dmitry | backend4you.ton: Do you need one project-specific Jetton or all jettons you own?

Maxwell: I could deploy my contract with jetton_wallt_address be null, then send jetton X to my contract, which would generate a new address and set the address to contract or generate the contract on the fly with jetton_master_address and jetton_wallet_code.  The jetton with each instance of my contract could be different.

Maxwell: And does anyone have experience with the toncli docker testing? (reply to 38375)

Dmitry | backend4you.ton: I think making admin-transaction with correct address after initial deployment is the easiest way… (reply to 38384)

User<5842008916>: Any idea about that? 😅 (reply to 38368)

rz: hi every one. I just developed an android app and I wanted to have Ton transactions from my app. for example I have an internal wallet in my app and I want that users be able to deposit and withdraw with Ton coin. can any body tell how I can do this? thanks.

User: use deep links from tonkeeper and tonhub (reply to 38388)

Maxwell: wallet contract doesn't handle bounced messages, so If Toncoin transfers out to some contract, the refund would only be possible if the receiver contract has the logic for sending it back when error happens, right?  https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc#L12

PLATFORM: Presenting openlib.func: A Practical Open-Source FunC Library  for Streamlined Smart-Contract Development  Continuation Finance introduces openlib.func, an open-source library for FunC, enhancing smart-contract development. They likewise stated, "The library consists of 3 modules: The core module offers builders for standard scenarios, while there are 2 other modules: gaslib.func which emphasizes gas management, crucial for security, and mathlib.func . features an optimized square root function." [🐙 link github]   🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

rz: so does ton keeper or tonhub have API so I can find out that the transaction was successful or no? over all after doing transaction through deep links, how should I get the status of that transaction in my app? (reply to 38389)

쑤: Is the site called tonkorea.net a scam?

— 2023-11-26 —

ally11: Hello!

ally11: const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('SENDLAVE')]);     const payloadjet = await jettonWallet.createTransferBody({       jettonAmount: TonWeb.utils.toNano('0.01'),       toAddress: new TonWeb.utils.Address('UQDuvnHYtC4iP4DQtebfXlwaqjPzK0Zs6sRJ2ZsKhGj8mpZJ'),       forwardAmount: TonWeb.utils.toNano('0.01'),       forwardPayload: comment,       responseAddress: new TonWeb.utils.Address(localStorage.address)     });     const payloadboc = TonWeb.utils.bytesToBase64(await payloadjet.toBoc());     console.log(payloadboc);     const transaction = {       validUntil: 165118253458,       seqno: 1021,       messages: [         {           address: 'EQDqZCvLL29Vr7FcBXAOMyszum1hGbp8ixe2kzI00YtS7u8V',           amount: TonWeb.utils.toNano('0.05'),           payload: payloadboc,         },       ],     };      const result = await TONconnector.sendTransaction(transaction);      await axios.post('https://toncenter.com/api/v2/sendBocReturnHash', {       boc: result.boc,     })

ally11: how i can fix that and send lave (reply to 38403)

rz: How can I send Ton to a wallet address with code? I use Kotlin, and I took a look at Ton kotlin documentation but I didnt figure out if its possible or no. Can some one help. Tnx.

Felix: You can use ton4j - it’s a java wrapper works just as well for Kotlin. Comes with examples (reply to 38405)

Felix: https://github.com/neodiX42/ton4j

rz: It seems that it does what Ton APIs do. Which does not include ability of sending Ton to a wallet. Am I wrong? (reply to 38407)

Felix: Sending to a TON wallet means you need to create the transaction (basically a bag of cells), sign it and then push it to the TON node - that is part of the library.

rz: Can you give me a sample of code that how it could be done? (reply to 38410)

Felix: Dm me - will send you an example. (reply to 38411)

rz: Tnx (reply to 38412)

Ọlá: Good day everyone

Ọlá: How do a project apply for their contract to be audited and verified on ton explorer??

Ọlá: Also, how can I send a specific amount of ton to multi wallet with a single transaction

Isaac: https://verifier.ton.org/ (reply to 38415)

Ọlá: Thank you (reply to 38417)

MonoBit: Hi guys I am trying to use the expression below in Tact but I get a compile error that says type Bool does not support bitwise operator |  What do you think the problem is?  nativeThrowUnless(103, (self.a > 0) | (self.b > 0));

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: || (reply to 38419)

Daniil: maybe @ton_mass_payments_bot will fit your needs? (reply to 38416)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I think they asked for programmatically solution which is impossible   Sending multi transactions in single transaction is impossible even in words (reply to 38422)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You have to load addresses, then send the amount in a loop (reply to 38416)

Daniil: Any smart contract can send up to 255 outgoing messages in one transaction.  Regular wallets up to v4 are only designed to send up to 4 messages in one transaction. However, the v5 will be able to send 255 as it’s allowed by blockchain. (reply to 38423)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You mean it's possible to store 255 addresses and send one raw message and then blockchain has ability to process it? we need a handler for this to receive the address book and amount of TON to  send via a loop with 255 limits on sending out (reply to 38425)

Andrew: highload-wallet-v2, preprocessed-wallet-v2 and highload-wallet-v3(soon) can send up to 255 messages in one external transaction (reply to 38426)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: So, they have built in handler 😁 You can create your own client to accept more but you have to process it in your contract  In TON a transaction has ONE receiver and ONE sender even with highload v255 (reply to 38427)

Andrew: If we talk about SEND, that general what need know - transaction can have up to 255 out actions (send message, set_code, set_lib etc.) (reply to 38428)

Andrew: And how receive these messages - other problem :)

Daniil: When you transfer some Toncoin to your friend, 2 messages are being sent and 2 transactions are being executed:  1. Your external message to your wallet that triggers it to transfer toncoin  2. Internal message from your wallet to the receiver’s wallet with attached toncoin which may trigger some other actions on the receiver smart contract  And when you transfer toncoin to multiple addresses at once (with your regular wallet or highload wallet - doesn’t matter), the transaction on your wallet which is triggered by your single external message sends multiple outgoing messages to all receivers. (reply to 38428)

Mehdi: What about fee , I mean external process seems to be efficient than sending computational to smart contract (reply to 38431)

Daniil: Sending multiple messages simultaneously is cheaper than sending each one by one. Especially with preprocessed wallets (like the one from pyAndrew or the upcoming v5 from Tonkeeper). These don’t even run any loops for messages. (reply to 38432)

Mehdi: My solution do not work , external msg can not bear value

JOKer: Can you point me to multiple addresses send using smart contract, sdk or api call? (reply to 38431)

— 2023-11-27 —

Ọlá: Thank you (reply to 38422)

Ọlá: I was referring to something similar to a disperse app on ton though (reply to 38423)

Kushagra: Hi everyone, can someone help with some possible scenario of why this transaction might be failing - https://testnet.tonviewer.com/kQD6SIfTQFGd23GOuzIS0GbmzC_e5QYzRbJ7k1y8EEN8Wp1Q/transaction/f547ac8a79af53b8bdfdeb764a0e36a137cf823f4fff8c4ff6964c358c2e8739

Matthew: hi all, anyone please help me why public key return from parseStateInit (https://github.com/ton-connect/demo-dapp-backend/blob/master/state_init.go) different public key return from https://tonapi.io/v2/tonconnect/stateinit?

&rey: Does https://tonapi.io/v2/tonconnect/stateinit return you something in public key format? I'd be surprised if it is so. (reply to 38444)

Matthew: but i want use parse state init because ton api free only 1 request per second (reply to 38445)

&rey: But you should parse StateInit locally... (reply to 38446)

&rey: Also, why do you want to use tonapi instead of dton.io/graphql?

Matthew: i found the answeer, it is my fault, thank all

rz: hey every one. can any body give me a sample of code for sending ton to a wallet address with code?

🅰🅻🅰🅽: Hi all, does funC allows unsigned integer variants (e.g. uint52, uint224), which cost actually 52 bits, 224 bits respectively of the storage?

MonoBit: Hi I have added slice preload_bits_offset(slice s, int offset, int len) asm "SDSUBSTR"; in imports/stdlib.fc and used   @name(preload_bits_offset) extends native preloadBitsOffset(self: Slice, offset: Int, len: Int): Slice;  for native calls but it is not working! Should I do something else to use this function?

&rey: It should work; what happens when you call it? (reply to 38460)

&rey: All calculations are done in int257, but .store_uint and ~load_uint support any size you mentioned. (reply to 38459)

mohsen: hi how to generate mnemonic (12 words) using tontools in python?

mohsen: I want generate mnemonic (12 words) using python and use It in trust wallet.

🅰🅻🅰🅽: Will a slice or a cell costs more gas than a int257 on storage fee? (reply to 38462)

mohsen: help please (reply to 38464)

&rey: In the end, everything is stored as a tree of cells. If you use .store_ref, you'll use more space than with .store_uint or .store_slice. (reply to 38465)

&rey: Trust Wallet's mnemonics are incompatible with ones TON commonly uses. (though, wallet contracts know only public key so they don't have any problems) (reply to 38464)

— 2023-11-28 —

Front: Hello. How to Decode the boc in javascript? Please help, thanks.

Howard: does anyone know what is the the touch means here in TonStakers?   https://github.com/ton-blockchain/liquid-staking-contract/blob/35d676f6ac6e35e755ea3c4d7d7cf577627b1cf0/contracts/pool.func#L373

Howard: Hello Community, I am exploring and researching mechanisms for projects on other chains to transition to TON, and here is a very challenging question: How can we manage high computational needs on-chain?  I believe this is a critical question and presents a good opportunity for us to try onboarding projects from non-EVM chains to TON.  Essentially, they need to update multiple fields dynamically. However, since I am not an expert in Rust or the MOVE language, I am here to share and find out who can provide insights on how these logics can be implemented in FunC & Tact, among others.  Here is the Medium post that discusses the challenges they faced on Sui: [Medium Article Link].  *Essentially, there also has a work in progress to implement this at the Sui virtual machine level.   It may be beneficial to reference this to understand why they need it, and to discern the differences between the SVM and TVM, I believe.

MonoBit: I had some problems with the Tact extension on vsCode. It is working but underlined by that extension (reply to 38461)

mohsen: How to use the toontools library to generate a mnemonic that can be used in trust wallet and vice versa? (reply to 38468)

Rio: I totally understand your interest in using the ToonTools library to generate a mnemonic that can be used in Trust Wallet and vice versa. However, it seems like there might be a misunderstanding. To my knowledge, there is no specific "ToonTools" library related to generating mnemonics for Trust Wallet or any other wallet.  In general, to generate a mnemonic that can be used in Trust Wallet or other wallets, you can follow these steps:  1. Use a reputable library or tool, such as the BIP39 library, to generate a mnemonic phrase. BIP39 is a widely used standard for generating mnemonics.  2. Make sure to keep your mnemonic phrase secure and private. It's crucial to write it down on paper and store it in a safe place. Do not share it with anyone or store it digitally, as it can increase the risk of it being compromised.  3. When setting up or restoring your Trust Wallet or any other wallet, you will usually have an option to enter or import your mnemonic phrase. Follow the wallet's instructions to complete the process.  Remember, it's essential to be cautious with your mnemonic phrase as it acts as a key to your funds. If you have any specific questions about Trust Wallet or if you need further assistance, feel free to ask! (reply to 38477)

mohsen: Thank you very much for your attention I think there is a misunderstanding that I need to explain further I want to generate mnemonics using Python and then use that to create my wallet address and then create transactions.  The official documentation of the TON site recommends the "TonTools" library for interacting with the blockchain.  Now, using this library, I have started generating new mnemonics. I suddenly realized that the mnemonic expressions generated in this way are not acceptable in the trust wallet. And I even tried to generate mnemonic expressions with the mnemonic and BIP39 libraries, and even they were not acceptable for the "TonTools" library. (reply to 38482)

MonoBit: I defined  (int) divc (int x, int y) asm "DIVC";  in imports/stdlib.fc  and used  @name(divc) native divc(x: Int, y: Int): Int;  but getting this error:  error: undefined function `divc`, defining a global function of unknown type           $out = divc(($out * $in), 10000);                               ^ 💥 Compilation failed. Skipping packaging (reply to 38461)

MonoBit: Solved:  added import "./../imports/stdlib.fc";!! (reply to 38484)

Mikhail: Hello everyone, why does exit code 136 happends when i do self.reply()?

Mikhail: It's says "Invalid Address" but how can it be invalid address if i am replying to contract which called this method?

&rey: Maybe the call comes from masterchain? (reply to 38487)

&rey: Also, is self.reply related to the error?

Mikhail: Ok, after some debbuging i have found that the issue was about saving addresses in Cell, not Self.reply.  So how do i propely save addresses?  the error gone after i commented this code:  let content: Cell = beginCell()                       .storeUint(self.index, 256)                              .storeAddress(self.collection_address)                              .storeAddress(self.owner)                              .storeRef(metadata)                              .endCell(); (reply to 38488)

Mikhail: collection_address and owner are not Null

Maxwell: What's the best practice to set a placeholder address in contract storage? All zero address or using Maybe Address?

Daniil: For MsgAddress type (which load_msg_addr uses) you can set two zero bits (reply to 38492)

Rahul: Error: Unsupported stack item type: list  Using TonClient @ton/ton for provider const stack = (await provider.get('get_contract_data', [])).stack

Rahul: can anyone explain why getting this error? (reply to 38495)

Rahul: Smart Contract Dev said it is working but when i implement it with React it's getting an error.  the error is coming from the wrapper when ton sdk parses that stake. (reply to 38495)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: be sure your index size in the contract and the reader is same (reply to 38490)

mohsen: Thank you very much for your attention I think there is a misunderstanding that I need to explain further I want to generate mnemonics using Python and then use that to create my wallet address and then create transactions.  The official documentation of the TON site recommends the "TonTools" library for interacting with the blockchain.  Now, using this library, I have started generating new mnemonics. I suddenly realized that the mnemonic expressions generated in this way are not acceptable in the trust wallet. And I even tried to generate mnemonic expressions with the mnemonic and BIP39 libraries, and even they were not acceptable for the "TonTools" library. (reply to 38468)

&rey: > Trust Wallet's mnemonics are incompatible with ones TON commonly uses. (reply to 38500)

&rey: You need to use other wallet application or other generation algorithm.

&rey: Are modules up-to-date? (reply to 38495)

mohsen: which generation algorithm? (reply to 38504)

&rey: BIP39. (reply to 38505)

Rahul: yes (reply to 38504)

mohsen: I tried this code but I can't use its mnemonic to work with "tontools". from bip_utils import Bip39MnemonicGenerator, Bip39SeedGenerator, Bip39WordsNum  mnemonic = Bip39MnemonicGenerator().FromWordsNumber(words_num=Bip39WordsNum.WORDS_NUM_24) print("Mnemonic:", mnemonic)  seed_bytes = Bip39SeedGenerator(mnemonic).Generate() print("Seed:", seed_bytes.hex()) (reply to 38502)

&rey: But it won't work with TonTools, it will only work with Trust Wallet... (reply to 38508)

mohsen: What do I need to do to work with TonTools? (reply to 38509)

&rey: You'd need to abandon Trust Wallet support. (reply to 38510)

mohsen: So how does Trust Wallet support TON? If Trust Wallet has been able to create this compatibility, so can we! (reply to 38511)

&rey: On a lower level, with private keys. Those are 256-bit for both (usually stored in 512-bit format, together with public key). (reply to 38512)

Rahul: will anyone help with this please? (reply to 38495)

mohsen: You sure is the TonTools library the best way to generate new addresses and create transactions using Python? (reply to 38513)

Mihai: TON uses different word library than BIP39 I believe (reply to 38508)

mohsen: I know But what does it use? (reply to 38516)

Hovhannes: I'm using tonconnect/ui-react in my telegram web app, and I can successfully connect to my wallet but when I try to make a purchase using my another wallet I get error on my wallet apps. For example when I want to send to my tonkeeper wallet address I get "an error occured", in telegram wallet I get unable to verify transaction. I tried with both, testnet and main, both are the same.  What I'm doing wrong?   await tonConnectUI.sendTransaction({         network: tonConnectUI.wallet?.account.chain,         validUntil: validUntil.getTime(),         messages: [           {             amount: event.price * 1_000_000_000 + "",             address:  // passing wallet which should receive the payment           },         ],       });

Tim: Amount should be integer. Valid until should be unixtime

Hovhannes: Changed both, still same error, also from tonconnect sdk the type of amount is string  https://github.com/ton-connect/sdk/blob/a05bc3a1662d0a2622398ae883344fb817018b53/packages/sdk/src/models/methods/send-transaction/send-transaction-request.ts#L31

Victor: It toggles round update if available https://github.com/ton-blockchain/liquid-staking-contract/blob/35d676f6ac6e35e755ea3c4d7d7cf577627b1cf0/contracts/pool.func#L281  Just as a way to run the contract (reply to 38474)

Aaron: Hello, who would be best to talk with regarding a grant proposal which was submitted over a month ago? As we submitted a grant proposal and it looks like all other proposals submitted around the same time have been rejected, while our proposal remains pending.

— 2023-11-29 —

Sea💎✈️: Hello, How to quickly release Jetton Token on the testnet? We have tool?

&rey: https://minter.ton.org/?testnet=true (reply to 38525)

Howard: 🙈🥹 (reply to 29916)

Front: How to Decode the boc in javascript? Please help, thanks.

Howard: you need to know the TL-B format to decode it! (reply to 38531)

Front: 😘Thanks. This seems too difficult to me and I'm looking for ready-made code. (reply to 38534)

Front: 🫣I don’t understand why there is no sample code in the official tutorial.

Front: 🤔This is important to me, I need to know if the contract execution was successful.

Howard: since decoded the message without TLB is impossible (reply to 38536)

Howard: Does anyone know how to simulate the on-chain Jetton Wallet in the test case?  I believe the contract address I obtained is correct, as it matches the one from the testnet. However, my code's test case is encountering an error.    I suspect that the Jetton Wallet I'm trying to access might not be active.

John: Is there any way we can subscribe to Ton transactions or blocks? Like web3.eth.subscrib() on Ethereum does.

John: I see. Do I have to run my own Ton node to use this liteServer? (reply to 38541)

John: Are there a LiteClient js/ts library I can use?

John: I find a LiteClient go library. But I am not familay with Go language.

Daniil: The thing is that BOC can store basically anything. If you don’t know how and what data was stored there - you can’t “decode” it.  So it depends on where did you get that BOC from. (reply to 38532)

Daniil: But looking at your screenshot, maybe you just wanted to print out the tree of cells? Then you can simply do:  const c = Cell.fromBoc(Buffer.from(“…”, “hex”)) console.log(c)

botmother: Hello everyone! What libraries are there for programatically creating wallet addresses and withdrawing NFTs from generated wallets out.

&rey: Wdym "successful"? There may be many transactions... (reply to 38537)

&rey: This is pretty much same as "please decode number 0x174C615D69". (reply to 38532)

Dmitry | backend4you.ton: https://docs.ton.org/develop/dapps/apis/sdk (reply to 38550)

MonoBit: Is there any way to set storage variables in our contract when we are testing, without creating a transaction to do that?  something like contract.setDataCell() in testing func contracts. (forwarded from MonoBit)

MonoBit: I think this 👇 should work but I am not sure.          contract.init!.data = beginCell()             .store(                 storeData(                     {                         $$type: 'Data',                         owner: user.address,                     }                 )             )         .endCell(); (reply to 38554) (forwarded from MonoBit)

Sea💎✈️: I want to create wallet by Tonweb  const WalletClass = tonweb.wallet.all.v4R2;  const wallet = new WalletClass(tonweb.provider, {     publicKey: keyPair.publicKey });  but it is fail on https://testnet.tonviewer.com/

Sea💎✈️: this is testnet, why no wallet

Sea💎✈️: then I add "  wallet.deploy(keyPair.secretKey).send(); " but it is error

Jeff: Hi, as I remember, there's MULMOD insturction in TVM, but I can't find it now. Is it deprecated?

&rey: 1. TVM instructions generally can't be deprecated, as part of integrity guarantees. 2. MULDIVMOD is available; to get MULMOD, you need to change some flags in opcode. https://docs.ton.org/learn/archive/tvm-instructions#52-division (reply to 38563)

Jeff: 1. Yes...make sense. But 98% sure there was MULMOD in documentation because I printed out TVM instruction.( 2. Thanks! I already have tried using that one. I was just curious. (reply to 38564)

Behrang: Use createShardAccount:  https://github.com/HipoFinance/contract/blob/fa8b09e5a993751d47d37cee4c35f1c3288c7602/tests/Loan.spec.ts#L168 (reply to 38555)

MonoBit: I will try that. Thanks 🙏 (reply to 38566)

Marius: Assuming that an election round has 320 participants. Roughly, how many of them will receive a reward? 5/10/100/320?

&rey: Assuming that 240 validators out of 320 get elected and 1 out of them has some issues/misbehaving, 239 will get rewarded. (reply to 38568)

Marius: But then why does the elector contract only return a number for roughly 20 validators? (reply to 38569)

&rey: Maybe only 20 validators have generated at least one block in this round? (reply to 38570)

Sam: Does anyone have any experience creating a restricted wallet using /usr/src/ton/crypto/smartcont/new-restricted-wallet.fif ?

Sam: I have created a wallet with it and the address shows up in mytonctrl wl, but there is no version, and I can't send the TON in it anywhere (reply to 38572)

Mehdi: Is this still true ? `Bounce Phase  Occurs if the contract fails. If message is bounceable and funds remain, a message is sent back to the sender. Can be a feature to return funds under certain conditions. `

Mehdi: I mean,can we  uilize bounce feature not just in case of failture? for example for every message that even transaction succeed , still return remind value , and proof successfullness

— 2023-11-30 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Yes, You can reply to sender via remaining value with bounce flag on your needs (reply to 38575)

小马: Is there an authorized transfer mechanism for tokens on TON?

Mehdi: So there is some outdated content that emphasizes on failure for send bounce back

&rey: No. If bounce happens, contract state is unchanged. (reply to 38575)

YaYa: We plan to hold a TON conference in Chengdu, China on December 15th. One of the sessions will be developer discussion. If you are willing to share, please sign up

Dmitry | backend4you.ton: afaik, you can’t set “bounced” flag in message you send (reply to 38576)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I mean reply via throwing for bounced or sending mode 64 for succeed, both returns remaining value, then we can verify bounced status other side

Howard: What kind of data you want to track? (reply to 38540)

mohsen: Hi. how to estimate transaction fee using python?

Hovhannes: https://github.com/toncenter/pytonlib/blob/75d2fbf29330866f88e6cb7e5489cf58bc530af6/pytonlib/client.py#L337  Maybe you can use this? (reply to 38586)

mohsen: this not official library? (reply to 38587)

Hovhannes: I'm not sure, actually I'm js dev, but it's listed on ton.org  https://docs.ton.org/develop/dapps/apis/sdk#:~:text=The%20Open%20Network-,pytonlib,-Python (reply to 38588)

Sea💎✈️: Hello, how to create Ton V4 wallet by TS . According to the ton sdk document, I get a address but the wallet is not deployed.  What should I do next

MonoBit: How to convert myAddress() to hex string in Tact?

Andrew: maybe u can use openlib.func with store::number16 (reply to 38591)

MonoBit: Isn't there any built-in solution for Tact?  I have used this function to do so but I want it to return a string instead of Slice:  inline fun addressToHex(value: Int): Slice {   if (value == 0) {     let buffer: Builder = beginCell();     let i: Int = 0;     while (i < 64){       buffer = buffer.storeUint(0, 8);       i = i + 1;     }     return buffer.endCell().beginParse().preloadBits(i * 8);   } else {      let j: Int = value;     let length: Int = 0;     while (j != 0) {       length = length + 1;       j = j >> 4;     }          let mask: Int = 15;     let buffer: Builder = beginCell();      while (value != 0) {       let curr: Int = (value & mask);       if(curr > 9){         buffer = buffer.storeUint(55 + curr, 8);       } else {         buffer = buffer.storeUint(48 + curr, 8);       }       value = value >> 4;     }      let final_cell: Builder = beginCell();      let reversed_buffer: Slice = buffer.endCell().beginParse();     let i: Int = 64;     while(i > 0){       i = i - 1;       let chr: Slice = reversed_buffer.preloadBitsOffset(i * 8, 8);       final_cell = final_cell.storeSlice(chr);     }     return final_cell.endCell().beginParse().preloadBits(512);   } } (reply to 38592)

Dario: i recognize this code  arent string just slice in tact? (reply to 38593)

MonoBit: This is what stonfi uses to convert address hash to hex string.  I don't know how to convert the slice to string. (reply to 38594)

Dario: you are using an old and bugged version (reply to 38595)

Dario: use this one

Dario: https://github.com/ston-fi/funcbox/blob/9664ac18d5ac0128b20cd524d2dc28425417bc1f/contracts/utils.fc#L7

MonoBit: 👍 (reply to 38598)

MonoBit: Thanks

Dario: https://docs.tact-lang.org/language/ref/strings#sliceasstring  seems asString(self: Slice): String; should do the job (reply to 38595)

Dario: just add asString() to the last instruction

MonoBit: I will try that Thank you so much

Dario: do not use that function for computing stuff onchain, only in offchain "get-methods". its really expansive

&rey: No. You can invoke FunC function from Tact using native fun .... (reply to 38593)

Mehdi: In most cases, the sender will attach a small amount of Toncoin (e.g., one Toncoin) to the internal message (sufficient to pay for the processing of this message) and set its "bounce" flag (i.e., send a bounceable internal message); the receiver will return the unused portion of the received value with the answer (deducting message forwarding fees from it). This is normally accomplished by invoking SENDRAWMSG with mode = 64 (cf. Appendix A of the TON VM documentation) .from here It seems we have two scenarios, when an error occurs and when we use it as a feature. Now can I concluded , bounce and bounced is not just due to error?

Mehdi: Note that if, after accept_message, some error is thrown (either in ComputePhase or ActionPhase), the transaction will be written to the blockchain, and fees will be deducted from the contract balance. However, storage will not be updated, and actions will not be applied, as is the case in any transaction with an error exit code.  As a result, if the contract accepts an external message and then throws an exception due to an error in the message data or the sending of an incorrectly serialized message, it will pay for processing but will have no way of preventing message replay. The same message will be accepted by the contract over and over until it consumes the entire balance. This also comes from here

Mehdi: messages will be bounced if sent in bounceable mode and contain enough money to pay for their processing and the creation of bounce messages also comes from previous link

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: "bounced" is a flag, for when an error throw during the process, "bounce" is a rule to configuring sender, when value is false that mean doesn't matter if this message is "bounced" at process. (reply to 38606)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You can set it to true, and sending enough grams to be sure that message with flag "bounced" returns to you if throws. Also you should handle the "bounced" msg in your contract.

&rey: The receiver contract needs to return incoming value separately, not via bounce mechanism. (reply to 38606)

— 2023-12-01 —

Maxwell: Is there any simple way to find out whether a jetton master is discoverable or not? Cause not so many of contracts onchain opensourced.

John: How to convert an account like this "0:3d141ceeeefde8421eede8844e1e4c59ec6dd381fd933af66235d92cd81e0b05" to user friendly address like "EQA9FBzu7v3oQh7t6IROHkxZ7G3Tgf2TOvZiNdks2B4LBdsS" using a JS/TS library?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Lib: @ton/core  Class: Address Method: parse(rawStringAddress) Usage: userFriendlyAddress = Address.parse("0:3d141ceeeefde8421eede8844e1e4c59ec6dd381fd933af66235d92cd81e0b05").toString(); (reply to 38614)

John: thanks (reply to 38615)

&rey: Locally emulate message requesting jetton wallet address, no other way. (reply to 38613)

XuanXue: Is it possible to calculate transaction hash ahead of sending transcation?

Howard: nope, it's based on LT time to generate I remember (reply to 38618)

User<5332466353>: What is the best practice for monitoring the status of transactions in bulk

Maksim: and timestamp. so theoretically you can try to guess but the chances are low (reply to 38619)

User<5332466353>: These transactions were sent out in bulk by me through scripts (reply to 38620)

User<5332466353>: If only using public rpc (reply to 38620)

User<5332466353>: Is it the only way that using the backend to parse each transaction? (reply to 38620)

User<5332466353>: Which version of node do you recommend?

VERTEXFX: Chek inbox (reply to 38626)

Roman: Hello everyone! 👋   Recently, Anton Trunov, the new lead for the Tact language at TON Foundation, created a Tact Roadmap for the development of the Tact language.  We aim to make the Tact language as good as possible for developers. You can help improve the Roadmap by participating in a survey.  The survey consists of 7 questions, but it's crucial to reveal your experience so Anton can tailor the Tact language to your needs:  👉 https://liabbc8a.paperform.co/

Peter: Good afternoon.  We are a team of three designers, with over 10 years of experience. Our capabilities range from UI/UX for websites and apps to animation, illustration and 3D. We have extensive experience in banking, crypto/web3, fintech in general. Our apps have been ranked at the top of MarksWebb rankings. We also have Awwwards, CSSD awards. We have over 20 million views on Dribbble.   We offer our work format for web3 projects - on a subscription basis. That is, you pay a fixed cost monthly, and we solve the tasks you add to the board. If you are interested in our offer, we would be happy to discuss it.  Design shots and cases: https://dribbble.com/AlexBender https://behance.net/HugeArt  Website: https://fancy.design

XuanXue: Is it possible to send transfer in for loop, why does only the first transaction succeed?

Hunter: 🖐Hi, everyone. I am a senior frontend  & solidity developer, just looking for an ongoing project now. I have developed many dapps like dex and defi project and also supported nft marketplace. please contact me if you are looking for a developer.

Daniil: Do you have any experience in TON? (reply to 38631)

Dmitry | backend4you.ton: subsequent sends have same seqno instead of increasing one? (reply to 38630)

User<5332466353>: Imagine I created a batch transfer task, and I need to monitor the status of each transaction in this task (reply to 38620)

XuanXue: Isn't seqno something like block height, which means only after one transaction finalization can send another in for loop

XuanXue: or manually increase seqno?

XuanXue: say how to  send 100 transactions to one block

&rey: "seqno" is in wallets, and common wallet is unlikely to accept more than one external message per block. (reply to 38635)

&rey: There are highload wallet contracts which are only limited by gas fees.

XuanXue: oh, it's helpful, any references?

User<5332466353>: yes (reply to 38635)

User<5332466353>: one by one

XuanXue: https://answers.ton.org/question/1535377779414011904/what-is-considered-highload-usage-for-a-wallet

XuanXue: Is tonkeeper enable to use high-load wallet?

XuanXue: or deploy your own high-load wallet instead

&rey: Please check out https://github.com/tonfactory/tonsdk/blob/master/examples/wallets/highload.py. (reply to 38645)

Emre: Hello, I asked a question a few weeks ago and you said there was a problem with the subject and an update would come. Today I saw you merge on github. Is my problem solved now? Can I use it? When telegram wallet is opened on telegram on mobile, there is no return after the transactions and I could not run my other processes. I'm adding previous conversations and github

Emre: https://github.com/ton-connect/sdk/pull/115

Tim: you should try new beta version (reply to 38649)

Tim: It works for me on some platforms

— 2023-12-02 —

XuanXue: Thanks, will check out, wonder if there is any frontend highload wallet as well (reply to 38646)

Howard: Can we obtain the item_code of any NFT item, even if a 'get' method hasn't been set for it?

Denis: Nft item it's something acts like nft

Howard: ...... yeh (reply to 38654)

Howard: for example, annoy-phone Number didn't return item_code on get method:  https://tonviewer.com/EQDJYwVuFU9Qu0wMzGf81a-YgT96IvGjVsPCBpQBmkB4hGUL?section=method (reply to 38653)

Howard: I am wondering:  1/ Each NFT item should have same item_code, right?  2/ How we get the item_code if it doesn't show on get_method

Denis: Should it? Standard doesn't require it (reply to 38656)

Denis: 1. No 2. Just get account state. It contains code (reply to 38657)

Howard: 1/ But I got different item_code when I check the storage cell:    2/ How can I convert 8000000638EF48178CA529949D0554C10386538D66DED24802B687747410E6044228E6D4C_ set as Cell data type and put into the smart contract ?

Sleapy: Hello, what was the dependencies change for tonlibjson to work on Ubuntu 22.04 ? Previous release work but not the last

Andrey: Check github workflows files (reply to 38661)

Sleapy: I guess it is related to openssl version who changed (reply to 38662)

Maxwell: Wallet A sends message to Contract B with some msg_value, what would happen when contract B throw an error, would the msg_value be returned to Wallet A automaticly or msg_value get stuck in Contract B?

Daniil: that depends on bounce flag of the message sent from Wallet A. if it's set to true - coins will be returned, and if it's set to false - coins will be stuck on contract B. (reply to 38664)

Andrew: 0Q for testnet , typo

Howard: 😵 (reply to 38656)

Howard: yes (reply to 38666)

Howard: any better tool to filter the Cell data tho? (reply to 38660)

Sougnik_gnilik: Hi guys Im so merry to be with you

Sougnik_gnilik: Im cheking for one script that Can help to find private key by useing adresse of the wallet

Sougnik_gnilik: I Will send vidéo for you and see it if YOU Can Do the same

Sougnik_gnilik: This IS the script it Can find any private key of wallet by useing adresse

Alex: ➡️➡️➡️Dear developers, please tell me which files can be used to make NFTs (which files are supported in the telegram @wallet ). Thank!  🙋🙋🙋What resolution (what format) should it be to animate a 3D model in a wallet?

&rey: I suppose you could prove that by finding private key of UQA1Hb5cRWSNXUbcxpc9oe_xWoi6A9gZs2jS0u92jYjR4xq8? (reply to 38679)

&rey: In case you say "YOU should run this script", that will mean that the script is scam so you will be banned.

Alex: Are there any developers here who work with NFT marketplaces? The Lucky project team is looking for a developer to join the team (reply to 38681)

Trap 🍅: yes  there is (reply to 38684)

— 2023-12-03 —

Howard: can we say that the benefit for TVM versus EVM is that:  TVM is hashing the data into the Cell data type, which is sufficient than EVM's SLOT way more?

Maxwell: Contract A send msg(with msg_body bits length 678) to Contract B, and it bounced back, the bounced msg has bits length 288. Does the bounced msg body get truncated?

Andrey: All these cell structures and so on are just a handy data structure so you can do simple Merkle stuff  As far as TVM is involved, the idea is a bit different. TVM is made under the TON actor system, which leads to potential infinite sharding. TVM developers develop smart contracts with the actor system in mind, which in theory allows their contracts to work for a very large number of people with low execution fees. (reply to 38686)

Maxwell: after checking the TON source code, I do find some truncate logic. So weird. (reply to 38687)

walker: How to deeplink the dapp associate with my bot?

walker: like this: https://t.me/tc_twa_demo_bot/start

Maxwell: Why would bounce_msg_body length be limited? It's so inconvienient for on_bounce() handler to extract some crticial data. Would TON update the config in the future?

Kiba: To deep link your dapp with your bot, you need to create a new mini app in @BotFather. Choose your bot and specify your dapp. Then, you should pass twaReturnUrl to the provider, as demonstrated in the example at https://github.com/ton-connect/demo-dapp-with-wallet/blob/master/src/App.tsx#L28 (reply to 38692)

&rey: It will need to update node code but I guess that's possible, considering that Everscale bounces all bits of message root cell. (reply to 38693)

walker: I create my app, and set twaReturnUrl link to my app, but not working, after I confirmed my transaction in wallet, it didn’t return to my app (reply to 38694)

Kiba: You'll need to wait for an update of TON Space, as it's currently not functioning properly on some devices and in certain environments.   https://github.com/ton-connect/sdk/issues/119#issuecomment-1837224727 (reply to 38697)

walker: Thanks a lot (reply to 38698)

mohsen: How can I get the transaction hash after sending it in the TON blockchain?  It is a big issue that the transfer_ton function only provides the response status and not the transaction hash.

User<5332466353>: same (reply to 38700)

User<5332466353>: You need to index them through additional backend services

User<5332466353>: Perhaps it's the only way

Sleapy: Any Ideas ? I tried to update OpenSSL libraries but it's not that apparently and it breaks ssh (reply to 38661)

Андрей: https://github.com/ton-blockchain/mytonctrl/commit/342bad2ccb7a28c23e2b4cde7f0b0c6cd63a5936 (reply to 38661)

Sleapy: Thanks, I finally fixed the issue.  It was caused with the  libsecp256k1 library file. For some reason it asked for libsecp256k1.so.2 who did not exists. I saw in /usr/lib/x86_64-linux-gnu that there was already 2 symlink (libsecp256k1.so and libsecp256k1.so.0) linked to libsecp256k1.so.0.0.0. I just added a new symlink lol.  in the same directory:  sudo ln -s libsecp256k1.so.0.0.0 libsecp256k1.so.2 (reply to 38705)

XuanXue: Is it possible to use walletV4 as highload wallet by providing the same mnemonics?

Maxwell: Haven't check Everscale yet. What's the difference between TON and Everscale, also curious about the rationale for TON to set a limit for bounce_msg_body. (reply to 38696)

&rey: They are different contracts with different addresses, even if key pair is same. (reply to 38708)

Jordan: Is this for testnet only? (reply to 38526)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://minter.ton.org/  now, it's for mainnet. it's not a organized token, you haven't admin rights for this contract (reply to 38711)

XuanXue: Is it possible to tranfer from highload wallet to other types wallet, say walletV4

&rey: Yes. You can send money (messages) from any wallet for which you have secret key to any contract. (reply to 38713)

XuanXue: ok, thanks! https://www.npmjs.com/package/ton-highload-wallet-contract

XuanXue: why call failed for deployed wallet_highload_v2

XuanXue: https://testnet.tonviewer.com/kQAwcZC6hoetFqGtFU6BOV3JyAlztumwZgByJQeJClljOQyr

Aydin: Hi all. When trying to publish my gh-pages following this Lesson, faced strange errors. It doesn't connect to any wallet. Trying to connect to Tonkeeper Web complains:  JSON.parse: unexpected character at line 1 column 1 of the JSON data  Also, trying to connect to Wallet on Telegram throws this:  Dapp manifest not found Any help? (reply to 36980)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You have to fix your manifest  The url: remove / at end The iconUrl: use relative path instead of it, open that url (if exists), right click on your image and select open image in new tab, that address is your relative path (reply to 38722)

— 2023-12-04 —

师兄: Hello everyone, I would like to ask how to use TON Wallet to sign a custom message. After reading the TON Connect documentation for a long time, it seems that TonConnect does not currently support the signature function. Does anyone know other methods🤔

Shashank: Exciting update: 💥🎊🎉💥  All TACT-by-example templates are now live in Nujan! Explore the latest release for a smooth Tact smart contract experience. Your feedback is appreciated!  URL: https://ide.nujan.io/

User<6247944943>: where is the .ton domain contract code tho? (https://dns.ton.org/)

User<6247944943>: https://github.com/ton-blockchain/dns-contract (reply to 38729)

Zheng: hi, how could I decode the BOC returned by ton-connect's sendTransaction method? nearly no docs about it

Neo: Guys can you help me know if I'm getting scammed right now?  Someone offered to buy my blockchain number for a blanket fee of thousands.

Neo: I told him to send the funds first of course and why doesn't he just go do it on his own.

Neo: He ended up sending the funds and they're in my newly created wallet.  They sent in USDT.  Is there something I'm missing?

Daniil: Which network? (reply to 38734)

Daniil: Try depositing them to some exchange (like Binance)

User<535742443>: Newly created wallet. By you? (reply to 38734)

Neo: yes newly created by me (reply to 38737)

Neo: sent over ton, USDT (reply to 38735)

Daniil: Are you sure it’s real USDT? Try buying TON with it on some DEX like dedust.io or ston.fi (reply to 38739)

Neo: Doesn't show a $ sign next to it though?

Daniil: It’s fake (reply to 38741)

Professor: Yes its fake (reply to 38742)

Neo: Phew. Thanks.  The indicator is the $? (reply to 38742)

Neo: You guys are amazing. Thank you so much.

Tim: there's no indicator (reply to 38744)

Tim: you just need to know right one

Neo: Meaning there should be a "$" right? (reply to 38746)

Neo: Do I need to trash this wallet now?

Daniil: It’s not a 100% guarantee either. Tonkeeper just checks if the token can be traded on DEX and shows the price. But anyway, you should always check if it’s the real asset. You can also “hide” fake ones in Tonkeeper (if they weren’t hid by default) (reply to 38744)

Tim: if you didnt give them 24 words you'rem ok (reply to 38749)

User<5332466353>: how to set the account name

Tim: Deposit few million tons, ask tonviewer team to verify (reply to 38752)

User<5332466353>: and the interface

User<5332466353>: how to ask (reply to 38753)

Anthony: Make a PR to https://github.com/tonkeeper/ton-assets (reply to 38755)

User<5332466353>: how about the interface (reply to 38756)

Tim: verify contract on verifier.ton.org, if it'll be popular - i think it will be parsed

Synth: Hello guys I am havingan issue when  running install.sh for full node

Synth: and in step 3 I am getting an error

Synth: [3/4] Launching the mytoninstaller.py logname: no login name

Synth: here is the error

Synth: running it on ubuntu subsystem

Synth: would that be the issue?

XuanXue: Is there any highload browser wallet

TON Answers Bot (not AI): Standard Method for Defining Opcodes in func from Jeff  Hello,  I've been exploring different repositories and noticed inconsistencies in how opcodes are defined. For example, in the ft and nft implementation within the token-contract repository, opcodes are defined as follows:  int op::transfer() asm "0x5fcc3d14 PUSHINT";   However, in the liquid-staking-contract repository, the definition is quite different:  const int op::nft_transfer = 0x5fcc3d14;   While I understand that these are essentially the same, I'm curious about the more commonly accepted or standard method for defining opcodes in func  Additionally, I've observed that the ft and nft implementation in the token-contract repository might be outdated. It uses builder_null from stdlib.fc in this repo, but the stdlib.fc in the official documentation doesn’t include it.  Could someone clarify these points for me?  🔗 Answer on TON Overflow

Mikhail: Hello everyone, i am using TACT and getting this error, does anyone know solution? error: previous function return type ((slice, cell, int, cell, slice, cell, cell, slice, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((slice, cell, int, cell, slice, cell, cell, slice, int), int)

Arti: Are you up for the challenge supported by Redoubt, TON API, TON Keeper, STON.fi, DeDust, Orbs TON Access, and Tonstarter? Join!  Your Mission: Develop a top-tier Liquidation Bot for the TON DeFi ecosystem on top of existing protocols.   📅 Important Dates: -  Dev Phase: Nov 27 - Dec 14 -  Bot Contest: Dec 15 - Dec 21 -  Judging & Winners: Dec 22 - Dec 30  💰 Prizes Galore: - Total Pool: $9,200 across various categories! - 5000 TON in API Credits for early birds.  📌 Join @evaabuidl

Sam: Bumping this - any help would be greatly appreciated! (reply to 38572)

walker: is there any function like signMessage in tonConnect?

Dmytro: I am planing to develop TON payment gateway(receive/send tokens) using nodejs  Which one of libraries i should choose and why? tonweb or ton-org/ton?

Denis: https://github.com/tonkeeper/tongo/blob/master/abi/schemas/ston-fi.xml#L9 (reply to 38757)

Daniil: Tonweb has some problems, so I’d recommend using the one from ton-org (reply to 38818)

Dmytro: Thanks (reply to 38820)

Sam: Is it possible to use mytoncore and mytonctrl with valdator-engine pointing to a data directory other than /var/ton-work?

Dmytro: What about this line in WalletContractV4 constructor https://github.com/ton-org/ton/blob/b4cbd9dd72f36fecc45db845084e8457b68da4e0/src/wallets/WalletContractV4.ts#L37  hardcoded code under the account? how i can verify that it's no malicious tricks under the hood? (reply to 38820)

Dmytro: Seems i dont understand concept of   const ALL = {     'simpleR1': SimpleWalletContractR1,     'simpleR2': SimpleWalletContractR2,     'simpleR3': SimpleWalletContractR3,     'v2R1': WalletV2ContractR1,     'v2R2': WalletV2ContractR2,     'v3R1': WalletV3ContractR1,     'v3R2': WalletV3ContractR2,     'v4R1': WalletV4ContractR1,     'v4R2': WalletV4ContractR2 };  tonweb code*  please is there info about types of wallets declared in library (reply to 38824)

Dmytro: hope it's what I need  https://docs.ton.org/participate/wallets/contracts (reply to 38825)

Mehdi: Virtual machine implementations in C++ and Rust are similar or have difference

Mark: given a spec, and given that both C++ and Rust implementations follow it properly, there shouldn't be any differences (reply to 38827)

Mark: that can be applied to any VM

Mehdi: What is relation between Everscale and TON?

Mark: have you tried google?

Mehdi: Tonlab became Everscale  , all dorov  pdf implemented in Rust , it seems we have others Blockchain in future as well  , am I right?

Mehdi: Yes , I am looking for comprehensive insight , I guess both project had same community in past ! (reply to 38831)

Akuzir: Who is the official Admin in there I need contact

Daniil: You can ask here (reply to 38834)

Slava: Hello everyone! 👋  We've got some updates regarding TON Bounties. Feel free to share with guys who would be interested to participate:  🍭 49 Active bounties →  👷‍♂️ 10 Approved bounties. Actively searching for an assignee →   💬 13 bounties under suggestions. Share your opinion →  You have the chance to create your very own bounty using the @bounties_helper_bot. Go ahead and try it out!

— 2023-12-05 —

ston: Hello, how can I deploy additional NFT items to exising collection?

Rohit: You can deploy additional NFT items by using existing collection address by doing minting. (reply to 38837)

ston: Thanks! Let me check 👍👍 (reply to 38838)

John: Hi guys. How to generate a ton proof and sign with my wallet using the ton-connect SDK? I can only find how to verify ton proof on Ton docs page.

Sviat: hi everyone. doesn anyon knows a tool for transaction graph visualisation for TON? found a tool that's like dune- but it's not exactly type of analytics I'm looking for 🙂

Tim: ton.cx, tonviewer

Denis: Something like this https://cosmograph.app/run/?nodeColor=color-node_color&nodeSize=size-node_value&data=https://dev.tonconsole.com/stats/results/62fdbee5-47d6-4295-a9f2-df8da9167cfb.csv&meta=https://dev.tonconsole.com/stats/results/62fdbee5-47d6-4295-a9f2-df8da9167cfb_meta.csv ? (reply to 38841)

Saidolimkhon: I want to find a job in an interesting and promising project as a marketer

botmother: I keep getting Rate limit exceeded: 1 per 1 second even after adding 2 second delay in between. Connected to https://testnet.toncenter.com/api/v2/jsonRPC   async function delay(ms) {         return new Promise((resolve) => {             setTimeout(resolve, ms);         });         }                      let seqno = await contract.getSeqno();           await delay(2000); // 2-second delay           const tx = await contract.sendTransfer({              secretKey: keyPair.secretKey,              seqno: seqno,              messages: [                internal({                  to: "kQCgEXBLDbipzYC7fYvIG3W1yq-pa0IHUFV5mt631gyC1F5K",                  value: "0.05", // 0.05 TON                  body: "Hello", // optional comment                  bounce: false,                })              ]            });

botmother: Anyone knows what's the issue with my code?

Dmitry | backend4you.ton: There should be wallet v4 FunC code nearby - you should compile it and base64-encode result to compare with this embedded string. (reply to 38824)

John: Wrap your whole function inside a time interval. (reply to 38847)

&rey: You can use ton-access (from Orbs) as an endpoint, it doesn't have rate limits. (reply to 38847)

Ruslan: Hi guys, i am bulding a dapp and i am considering developing it on the TON chain and i have a few questions:  1)is it possible to write the smart contracts in solidity 2) Can i use something like hardhat to develop a full stack dapp( even if i eventualy change to TACT or FunC as a main language) 3) Is there someone who i can talk to in the TON team about these questions  ?

Alex: We are looking for a programmer to join our team who can integrate Blockchain TON  into the WordPress NFT marketplace

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: P.S: that is a WordPress template with integrated some basics around a simple marketplace. Actually you need WordPress developer who has knowledge about TON (reply to 38853)

大哥来区块: hi，how is mnemonic web tonweb？

Irie: Gm guys I recently found out that the wallet addresses for wallet have been set to change completely from EQ to UQ… My question is how or where do I compare an address so I can take a look at the UQ format.

大哥来区块: my is mnemonic not find method

大哥来区块: my get mnemonic  not tonweb get keypair object

大哥来区块: help

Vlad: Ton.org/address (reply to 38856)

大哥来区块: help me (reply to 38860)

Sam: Why might a validator be showing "Local validator status: not working" in mytonctrl status? This is on testnet btw

Howard: what is the current TPS we can check?

Marat: https://status.toncenter.com/d/Dij6N5dVz/overview?orgId=1&refresh=1m&from=1701772207938&to=1701793807938&viewPanel=30 (reply to 38863)

Howard: 🤣 it's impressive that to see the meme culture is help to testing the highest TPS on production tho. (reply to 38864)

Nha: what's happening with the TPS? (reply to 38865)

AlejandroEstranged: ,

MonoBit: hey guys! I get Error: BitBuilder overflow when I try to pass the peyload below as forward_payload. it is not bigger than 1023 bits and its 579 bits I think.  forward_payload: beginCell() .storeUint(0x1, 32) .storeAddress(addr) .storeCoins(10n) .storeAddress(myWallet) .endCell(),  Is there this 1023 bits limitation for message body or the payload itself?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Try to log myWallet using console.log(myWallet.toString()) and confirm that is an address.   Hint: Do you know that 10n means 0.00000001 ton? (reply to 38868)

AYMEN: Is TON down?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Network? What you mean? (reply to 38870)

MonoBit: Thanks I will try that, but I think the error occuring because of the whole transfer message builder.  Yeah I know that. (reply to 38869)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: So share the whole message with values instead of variables, then others can help (reply to 38873)

MonoBit: I don't have access to the code right now, but I will share it asap (reply to 38874)

Master: Hi, I'm very interested in your job (reply to 38853)

Sam: Does anyone in here run validators?

Tim: I'm sure someone does

Joan: GetBlock.io doesn’t run validator nodes, but if you need regular TON RPC endpoints I think it’s the only provider (reply to 38879)

Sam: Not looking for RPC endpoints, I'm looking for assistance with validator operation. All of my questions in here just go unanswered. (reply to 38881)

— 2023-12-06 —

nick: Can anyone help verify whether this public node is normal? It seems that no transaction data is returned through this interface.

nick: curl -X GET 'https://toncenter.com/api/v2/getBlockTransactions?workchain=0&shard=8000000000000000&seqno=xxx'

walker: Me too (reply to 38883)

大哥来区块: getblock not support ton tpc

Behrang: Hey guys,  After yesterday's problem, I can't connect to read data from liteservers.   Can anyone help?  I get this error when trying to read the state of an account:  `failed to check acc state proof: shard proof is incorrect: failed to load shard hashes: wrong ShardDesc magic: 0`  I'm using tonutils-go library.

Falco: What are your questions? (reply to 38882)

Behrang: I've used the just released version of tonutils-go (1.8.8) and it's now fixed, thanks to @xssnick (reply to 38887)

裸裸: "address": "-1:d1c543faf7f5e54daf4f7994171493fa3f0e1f8f83747a4e3a763543c7829c7d",

裸裸: why the address has prefix of "-1"？

Gunnar: it's the workchain_id, -1 is the masterchain, 0 the workchain (reply to 38892)

裸裸: so~ if I have a wallet address. it have both -1 and 0 prefix?

Ceren: Has the RPC issue been resolved?

Samyar: is there a way to change the storage options in ton connect react ui

&rey: You can deploy the same wallet data+code in both, yes. Any created signature will be valid for both then. (reply to 38894)

&rey: They will have different balances, though.

Vincent: Hi can I ask some testnet token, the bot doesn't work. UQAE2ZyYACFn1XQBUcmTg4mwUNPBieZGovjBQAGGy16eaaSL

saul: Is there a problem with Ton Network? I'm getting confirmation that I've sent the coins, but I'm not getting any coins to the recipient address.  I've checked the address several times to see if it's wrong, but I sent it to the correct address.

Anton: How did you send? What client did you use? Did you use a contract (except wallet)? Do you have  txid? (reply to 38900)

Howard: Is there the test-net for DNS.ton.org ?

Petr: Hi, I transferred tokens from the wallet inside the telegrams, but the coins have not been delivered for 15 hours, when will this problem be solved?

Howard: The API infra usually can't load right now. Please wait. (reply to 38903)

Howard: Chain is still congesting as well.

Volodya: https://dns.ton.org/?testnet=true (reply to 38902)

Yurii: Does anyone know what it takes to become a major advertiser on TG?

Howard: right (reply to 38906)

Step: What happened to ton blockchain? Many transactions are pending 🤯

Step: Credibility of live.ton.org ?

saul: There's a problem, right? I wasn't the only one.. (reply to 38909)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Nothing relates to TON, just wait until RPC fixes and avoid to sending new transactions (reply to 38909)

Step: RPC?

researcher: it is related (reply to 38912)

researcher: https://twitter.com/drawesomedoge/status/1732339355090633147 (reply to 38909)

Step: will shards disappear when volume of transactions decrease? (reply to 38915)

Maksim: they should (reply to 38916)

Step: there was only one shard till yesterday (reply to 38918)

TON technical overview: Not the first time mainnet splits, but first time for so long: https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=26853958 (reply to 38919)

Sam: This is what I am most curious about rn https://t.me/tondev_eng/38862  Also, I cannot get a restricted wallet to work, and was wondering if any other validator has had success using one (reply to 38889)

Falco: I would have to check the code, I'm not sure top of my head.  For the wallets, you mean for a validator right? I think only wallets up to v4 work. (V4 Which was added recently I believe) (reply to 38921)

Falco: Is your validator service running properly? @smbond14

Milad: hi everyone. how can i get seqno of a transaction in ton blockchain? i mean the seqno of the sender wallet.

Milad: And for example if i send a transaction with seqno=10 can i send onother transaction by seqno=9? Or the seqno is incremental?

&rey: For common wallets (v3, v4, inplug-v1) seqno is incremented each time. There are highload ones, which have different replay protection. (reply to 38926)

&rey: Only offchain by parsing the first (external) message in tx chain. (reply to 38925)

Milad: thank you. do you have any sample code? (reply to 38928)

&rey: Unfortunately, I don't. (reply to 38929)

&rey: (By the way, what kind of project needs sender's seqno?)

Milad: i need to validate some transactions. i need to know if i send a transaction with higher seqno the transactions with lower seqno will be faild or not. (reply to 38931)

Milad: I think i said it in a bad way :)) (reply to 38932)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Seems everything is working normally 🙏

Milad: Transactions with lower seqno that are not validated in blockchain. I sent some transactions. And finally one of them validated on ton blockchain. Now i want to know other transactions are pending or failed

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: How you can validate a transaction by sequencer? Why you're not going to get it via tracking TX? 😒 (reply to 38935)

saul: It doesn't seem to be working properly yet... (reply to 38934)

Sarvesh Ghildiyal: Hello all!

John: Hi, I am going through the docs and it mentioned: "Notice that Account contains the walletStateInit property which can be helpful for your backend to get user's public key if user's wallet contract doesn't support corresponding get method.". So, How to get the user's public key with walletStateInit?

Vincent: Error: no healthy nodes for v2-testnet the testnet can not use?

Vahid: Do you have toncenter group ?  The toncenter api gives an Gateway time-out

lu: Hello, I’m trying to create high load wallet but whenever I’m sent my bob it just return this message

lu: Nothing happened on chain

Sleapy: https://github.com/ton-blockchain/ton-blockchain.github.io/commit/4cf0848b0567b6514ca260fa3586266232005e33 why did they removed all the public liteservers ?

lu: Not sure

lu: Can you help me on this Sleapy

lu: I’m new

Sergey: how can I make sure the user is using mainnet wallet with js? Should I check workchain parameter? -3 or -239

lu: Can someone plz help, I’m suffering 🥲

Yoyo: Hi everyone!, I have noticed that the mainnet config have 0 liteserevrs, how can I find a liteserver list to use?

— 2023-12-07 —

Bean: Do we have any announcement for this? (reply to 38950)

Bean: Any explain?

Sam: How can I tell that besides using mytonctrl? No useful logs seem to be output even when it is working properly (reply to 38923)

Sleapy: https://github.com/ton-blockchain/ton-blockchain.github.io/blob/4808de0e6f202776f2d43757e0550e3c3cb37942/global.config.json Use the previous file (reply to 38950)

Sleapy: I just used it few hours ago and it still worked.

saul: Is the coin transfer complete? (reply to 38903)

Anteater: swaps are unavailable?

Vincent: Hi I transfer Ton from ehtereum to TON. The oracles servrice is not working?

Pneumonoultramicroscopicsilicovolcanoconiosis: Woah

Pneumonoultramicroscopicsilicovolcanoconiosis: Wait

Pneumonoultramicroscopicsilicovolcanoconiosis: We can launch on ton ?

Howard: all network in congestion (reply to 38958)

Vincent: oh, can I my ton back?

FASBOYZ tomarket 🍅 🐸🌱SEED FLIES 🪰📦 Bums 🐐 🐾: UQB0qKr2qDaTssZv_8aXM8f2g28M99SxUqVZlU3EMAplneS3  Plish hlpmy    0.2 toncoin

User<6247944943>: what is the means here for can_deploy_by_external means in getgems' smart contract code

Arti: Hello! I am looking for co-participants for a hackathon that is focused on developing liquidation bots for the Evaa Protocol, to earn profits by efficiently liquidating undercollateralized positions. DM me.

&rey: Anyone can. It's The Open Network, after all. (reply to 38961)

Cooop: Wen will this end? WEN WORK

лоаd: 🤷‍♂️ (reply to 38969)

Tolya: For the last two days, the TON blockchain has realized a new milestone while experiencing a significant slowdown in transaction processing.  No smart contracts or user assets are at risk. All sent messages will be processed.  We're working on fixing the problem.  Tech report »‎ (forwarded from The Open Network)

User<956848646>: Fragment auctions should be cancelled immediately!

Anthony: TON20 Inscription Use-case on TON Starting on December 5th, The Open Network (TON) experienced an incredible spike in network activity, thanks to the BRC20 Bitcoin Ordinals type of inscription use-case, called TON20, launched by the Tonano team.   Producing over 2 million transactions increased our network usage by 61 times within just half an hour. TON Community is proud to witness a creative use case take-off in TON driven by independent participants in the ecosystem.  Moreover, this sudden growth has revealed many interesting insights for our blockchain. Dynamic sharding technology worked as expected. At its peak, TON split into eleven shardchains, stabilizing at five shardchains to handle the heavy load.  At the same time, this phenomenon also revealed where the community should work to swiftly onboard the exponential increase in network activity expected in the near future. Network validators must ensure that TON is supported by hardware capable of scaling to the performance demanded by high usage.  Network Performance Delays This peak interest also came with a severe congestion of TON network, where validation was severely delayed even though the network validators are still producing blocks.   Popular wallets like @Wallet and Tonkeeper have paused the service temporarily.  TON core developers are aware of the issues affecting users and are working on TON blockchain. An initial technical report is available here. TON core team will be providing us with a further update within the next 24 hours.   We thank you and the community for your patience and unwavering support as we go through the growing pains together, preparing for the unprecedented growth season expected in the near future. (forwarded from TON Community)

User<956848646>: Fragment auctions MUST BE PAUSED or Ton/fragment will lose all credibility.   People are losing tens or hundreds of thousands of $ as we speak because username auctions are ending with no one able to bid up the price.

Sam: It specifically says in the docs that you can use a restricted wallet with a validator https://docs.ton.org/participate/wallets/contracts#restricted-wallet  I'm just not sure how to create one successfully... (reply to 38922)

1: Look Developer to create smart contract for token. Please DM me

Andrey: Shards out message queue  Shards:     #Masterchain: 2023-12-07 15:21:33 UTC, Out msg: 69     #WorkChain, shard 0x800000000000000:   07 Dec  15:17:53 UTC   Out msg: 76,704*   New externals: 2      #WorkChain, shard 0x1800000000000000:   07 Dec  15:21:07 UTC   Out msg: 300,757*   New externals: 0      #WorkChain, shard 0x3000000000000000:   07 Dec  15:20:50 UTC   Out msg: 611,885*   New externals: 0      #WorkChain, shard 0x6000000000000000:   07 Dec  15:20:42 UTC   Out msg: 976,715*   New externals: 0      #WorkChain, shard 0xc000000000000000:   06 Dec  19:16:28 UTC   Out msg: 609,124*   New externals: 179  Total pending messages: 2,575,254   🟢 today, 15:21 UTC / @dtonforum (forwarded from dTON)

Andrey: Current network status, we're try to update in live (reply to 38979)

Pavel: Dashboard with the current ton-20 minting progress

Ruslan: Hi guys, are there any libraries for the tact language like the open zeppelin erc20 and erc721 token standards written for Tact ?

Ruslan: Also another question if I am planning to build advanced DeFi stuff should I use FunC or Tact gives the same opportunities but is easier ?

Dario: Func (reply to 38985)

Ruslan: Because Tact doesn’t provides enough scalability and advantages ?

Dario: Tact is easier, but func is better to understand how to work well with the blockchain

Dario: Tact translates in func, anyway

Ruslan: Yeah I’ve seen that in the docs (reply to 38989)

Ruslan: So was it actually that hard to learn on a deep levels FunC ? (reply to 38988)

Dario: Not really, depends on your background. Func is not hard

Sergey: where can I find documentation about cNFT?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Call for Network Validators to get in contact! The TON blockchain is experiencing reduced performance now due to a backlog of transactions in the queue to be validated. We’ve received a fantastic response from many validators on the network who have already upgraded using the patch provided this morning.  However, there are still some we have been unable to reach. We need to collect the machine specifications from all validators to progress the upgrade as quickly as possible. If you maintain a TON validator node, please get in touch with us urgently so we can resolve the network performance issues.   You can reach the team via this google form. If you know someone who maintains a validator node on TON, please also feel free to forward this message. (forwarded from TON Community)

MICHAEL 水: Anybody in scotland or know any start ups in scotland ?

— 2023-12-08 —

yi: What’s the error code -256

Speculator: How can i use getSender() method without using blockchain.treasury(). or any alternate way to get same value?

Ọlá: How do I become a validator?

Vlad: https://ton.org/validator (reply to 39001)

N: One of my IDs (SantaNFT) has been received a bid for 10 TON after a year 😂 now I see that only three days remaining but the suggested price is still 10 TON. I don't know if I should keep this ID by putting a higher suggestion or let that guy buy it.  But it's a good feeling that someone left a bid on Fragment for my ID lol. (reply to 38976)

N: I for one had big benefits by trading TON Coin (thousands USD) and I see this fragment only as fun. However it was a good feeling that I saw someone left a bid (no matter how tiny value it is)

TON Answers Bot (not AI): The transaction did not arrive from Hottabbe  Hi all. I encountered a problem when transferring TON from 1 wallet to another. The transaction was completed, the balance decreased, but the funds did not reach the recipient. Here is the link to it in the browser https://tonviewer.com/EQBoYF5rlWZ9XHpi1O4vGU0bCteZFqoYliZD64vjlRzaZ1/transaction/53ad9db6715f44d1637f7a6be079157fe30d4b5964b03bb7217e9f715a9724c3 .The screenshot shows what the reviewer writes about this translation. What to do in such a situation?!(https://i.ibb.co/brDxn1j/IMG-20231208-113931.jpg)  🔗 Answer on TON Overflow

裸裸: hello I meet a problem.

裸裸: the two transaction one is 1 input 1 output， while another one is 1 input, 0 output。

裸裸: so why?

裸裸: https://testnet.tonapi.io/v2/blockchain/transactions/dd979231ce0dc18d6fd019daae4d91fce87f05ca06d4e54bcfeb552997b5bf07 https://testnet.tonapi.io/v2/blockchain/transactions/1a0abf5db9bf52bdce4e6c1a632d721eecb7711918f4297ae68db4818bc5f410

裸裸: this is the transaction request get response json.

裸裸: In my project, I want to know what the TransOrd do.

裸裸: to see who transfer to whom how many ton.

saul: https://tonviewer.com/blackout (reply to 39008)

裸裸: for one json I can parse it like this:

裸裸: {          "chain": "TON_TESTNET",          "txid": "1a0abf5db9bf52bdce4e6c1a632d721eecb7711918f4297ae68db4818bc5f410",          "transferTimestamp": 1702028203000,          "blockNum": 16397192,          "confirmations": -1307875,          "result": true,          "remark": "SUCCESS",          "feeSymbol": "TON",          "feeAmountCoin": "0.000333343",          "feeSymbolPrice": "2.294675485035269",          "feeAmountUsdt": "0.000764914010208111674267",          "transfers": [           {            "transferType": "TRANSFER",            "fromAddress": "0:507dea7d606f22d9e85678d3eede39bbe133a868d2a0e3e07f5502cb70b8a512",            "toAddress": "0:deaae6518a11fd24c1da9c53ad38aedd35f4a66d1bef4f1e3081472d9276a920",            "operatorAddress": "",            "symbol": "TON",            "contract": "TON",            "amount": "0.00023",            "amountInUsdt": "0.00052777536155811187",            "logIdx": 0           }          ]         }

裸裸: but for another get this:

裸裸: {          "chain": "TON_TESTNET",          "txid": "dd979231ce0dc18d6fd019daae4d91fce87f05ca06d4e54bcfeb552997b5bf07",          "transferTimestamp": 1702028496000,          "blockNum": 16397394,          "confirmations": -1308060,          "result": true,          "remark": "SUCCESS",          "feeSymbol": "TON",          "feeAmountCoin": "0.000991073",          "feeSymbolPrice": "2.29477546653869",          "feeAmountUsdt": "0.00227429000594889911437",          "transfers": []         }

裸裸: I use this code: t.cvtTransfers(transaction.GetInMsg(), transaction.GetOutMsgs(), price2USD)

User<956848646>: Because the transfer address is still negative. Change the OA. (reply to 39020)

User<956848646>: Which is the reason for TransOrd.

裸裸: my procedure can not get the right result because no outmsgs.

裸裸: still negative is what?

裸裸: how to change the OA?

zeroxx: 跨链卡住了怎么弄哇

裸裸: I am a simple developer with ton. I always make mistake.

裸裸: can you explain to me more details.

裸裸: I even don't know what is OA.

裸裸: the two transactions are both success.

User<956848646>: We call that operator address :D. (reply to 39033)

User<956848646>: I know. But it leads to a 0 output. (reply to 39034)

User<956848646>: I’ll send you the details over. We came across the same issue.

裸裸: the no output transaction is caused by the ton bot. faucet.

User<956848646>: Check your inbox.

裸裸: any other dev can help me?

裸裸: my boss want me to get the "who transfer whom how may ton".

裸裸: [           {            "fromAddress": "0:507dea7d606f22d9e85678d3eede39bbe133a868d2a0e3e07f5502cb70b8a512",            "toAddress": "0:deaae6518a11fd24c1da9c53ad38aedd35f4a66d1bef4f1e3081472d9276a920",            "amount": "0.00023",           }          ]

裸裸: I can get the result even no out_msgs.

裸裸: but I don't know the deep reason.

裸裸: If I don't understand the deep reason, my procedure may have a hole, a bug.

&rey: Destination contract, when receiving message, may send 0-255 messages itself. (reply to 39013)

裸裸: means 0-255 is all ok.

裸裸: I can change my procedure.

裸裸: {          "chain": "TON_TESTNET",          "txid": "dd979231ce0dc18d6fd019daae4d91fce87f05ca06d4e54bcfeb552997b5bf07",          "transferTimestamp": 1702028496000,          "blockNum": 16397394,          "confirmations": -1307359,          "result": true,          "remark": "SUCCESS",          "feeSymbol": "TON",          "feeAmountCoin": "0.000991073",          "feeSymbolPrice": "2.306550222706572",          "feeAmountUsdt": "0.002285959648868470431756",          "transfers": [           {            "transferType": "TRANSFER",            "fromAddress": "0:92112d13658a9c56482882e8486fc88c128e1cbda130988ad4e6a6d082737c7e",            "toAddress": "0:deaae6518a11fd24c1da9c53ad38aedd35f4a66d1bef4f1e3081472d9276a920",            "operatorAddress": "",            "symbol": "TON",            "contract": "TON",            "amount": "5",            "amountInUsdt": "11.53275111353286",            "logIdx": 0           }          ]         }

裸裸: Hope there are no bugs。

裸裸: when the msg have out_msgs the in_msg have no source field.

裸裸: when the msg don't have out_msgs the in_msg have source.

裸裸: So interesting, so strange, so incomprehensible, hahaha, my off work time is up, I will continue tomorrow.

Daniil: in_msg may be external-in which comes from any party in the internet without any direct linking to some address in blockchain. (reply to 39055)

Daniil: this is exactly how wallets work in TON: they are triggered by external-in messages that are coming from your wallet app.

&rey: Make sure to check out transaction chains on tonviewer.com: it shows graphs which may prove useful. (reply to 39057)

裸裸: ok nice thank you.

Fly: Hi guys, can anyone explain why the TON network was down and how it was being fixed, does it mean it might be down again if 1 of the validators is failed?

Anthony: Check out our post: https://t.me/toncoin/1084 (reply to 39062)

Fly: that is the message confused me, if one of the shardchains is down, will that shut down the TON network as a whole? (reply to 39063)

Fly: and is a shardchain run by a single node or this is also a distributed network.

Fly: sorry I am kinda new to TON

Nha: Honestly I think if they just admit that the guy who responsible for this is on vacation, the whole story would be more believable ^_^

Speculator: i am trying to mint jetton tokens tx is getting executed but it is getting failed with exit code 65535   url: https://testnet.tonviewer.com/kQAKVhXV0DeeqbJbFS2tV2LJafmC4EnGDl857xO4xNXjhref/transaction/5b8a0b03713b11f4123d53ee33c8bee39d4abf3bc4db84f6d95744ab76775345

Speculator: can someone help me dubug this

Light: lol (reply to 39067)

&rey: Messages directed to that shardchain are stored in outgoing message queues of other shards, and that creates problems. (reply to 39064)

&rey: Excess TONs are returned to wrong address; please check whether you're filling response_address and similar correctly. (reply to 39068)

Fly: so each validator is single point of failure of a shard, and each shard is a single point of failure of the whole network? (reply to 39072)

Fly: Sorry I might hv asked a dumb question, because I don't really understand

&rey: TON is not really down, but transaction chains may take hours to complete because new messages are put into queue at its end. (reply to 39074)

Fly: so it wont down, but the throughput depends on the weakest validator? (reply to 39076)

Fly: and what is the fix for that, cos I heard that is already been fixed

Fly: I was being asked by someone with this question, and I dont know how to answer cos I dont have strong tech background

&rey: IIRC, approximately that. That's why core team has asked people to disable validators with less than 16 vCPUs. (reply to 39077)

Fly: got it (reply to 39080)

&rey: And it's impossible to simply kick validators from the network, so throughput couldn't be increased immediately.

Fly: So, the dynamic sharding allows TON to theoretically handle an unlimited number of requests simultaneously and place them into a queue. However, the queued messages need to be processed by validators. With an instant spike in incoming messages, some validators might get stuck, resulting in the entire network becoming stuck. Is my interpretation correct?

&rey: Theoretically, if some validators aren't creating blocks fast enough, others should do that. I'm not sure whether it is implemented, though. (reply to 39083)

&rey: And if validation is too slow, that can result in network failure.

Fly: If that is the case, what if a validator dropped out suddenly? will the processing messages be disappeared?

Asya: Hi everyone, really need some help with a question  there are 2 transactions: - first https://tonscan.org/tx/2jE6OLpZx8vN8-aEdK1Je_ufO15OJ57F0_VFkqU_p_M= - second https://tonscan.org/tx/UDuNmCMiBa01wcfB_1LjxTnLEPa3nPEevsjWghFiChE=  According to all our checks and research, they are identical (except for the initialization of the address in the second TX and its absence in the first)  But the first transaction was successful and the funds were credited to the recipient’s address, while the second transaction was successful without funds being credited to the recipient’s address EQAEnDRbX2qGnLTqWcmrXqXYuBb6F5OSv2DB6VkJroH4NL86 (499.9925 TON just disappeared somewhere, they are not at the sender’s address nor did they reach the recipient’s address)  We really need to find out why that’s happened and where did the funds go, appreciate any help here)   Could that be because of a slowdown in transaction processing according to ‘TON Technical Incident Report’? If so, quite some time has passed since the second tx was sent, shouldn’t the funds be credited already?

Andrey: Currenty, 5k messages (not to 0 address with ton-20 comment) are pending, maybe your one is in that queue (reply to 39087)

Andrey: You can find live data here: https://t.me/dtonforum/3130/3135 (reply to 39087)

Andrey: If you see OUT message, your funds are safe, just need some time on current network pressure (reply to 39087)

Asya: Wow, thanks! You even anticipated my question with the following message, thank you a lot! (reply to 39088)

RIZKY: Is there any website IDE to compile and deploy smart contracts?

User: https://ide.nujan.io/ (reply to 39092)

Green: Hello Guys. Ton Minter not support to deploy JETTON on testnet?

jessez: https://minter.ton.org/?testnet=true (reply to 39095)

Mehdi: Hi , I appreciate one who compare postgres and TON DB model , mainly accessing share library in context of TVM !  Clue , everything is Cell, we also have BoC , every Cell have represented hash , I guess can used as something like index in postgres. Where this data stored , how we can reference them in TVM context . TVM base on implementation can access 3 BoC of code. 1. Contract registry 2. Shared library in master chain and library comes with external message.Maybe I am wrong. Take it easy ,please correct it

Jack: Hello Guys! I'm building TWA using Nextjs. I'm making buttons to download files, and it works on the desktop Telegram app, but it doesn't work on the mobile Telegram app, so can I know how?

Mehdi: I recently read it's doc , pointed that these apps are different, and need adaptive approach accordingly, (reply to 39100)

Mehdi: INFO  As long as all applications are being developed separately, there may be variations in how they implement the platform. If you encounter unexpected differences, please consider reporting an (reply to 39100)

Mehdi: https://docs.telegram-mini-apps.com/platform/about-platform

Jack: Thank you for your response. I'll definitely look again based on the site examples you provided.

Green: Just trying but got failed. it said that Network Error. (reply to 39096)

Green: Is there other way to deploy JETTON on testnet?

Green: with on-chain uri, not offchain. thanks.

jessez: Maybe this is due to network problems in recent days. It seems like the testnet was also affected by this. Or u didnt connect from testnet wallet (reply to 39105)

Green: I see. thanks for your update. (reply to 39108)

Green: is there other way to deploy JETTON on testnet? I was trying  with sample code but setting onchain metadata was too complicated and failed too. (reply to 39108)

jessez: https://github.com/toncenter/tonweb/blob/master/src/test-jetton.js (reply to 39110)

Rio: why does telegram wallet use legacy bitcoin address instead of newer segwit or taproot?

jessez: but unfortunately this is off-chain. i saved the onchain method on my computer somewhere, i will look for it a little later (reply to 39110)

Sam: Do you know what might be causing this? (reply to 38922)

Green: oh, really thanks. i'd appreciate your help. 🙏 (reply to 39113)

jessez: u can look here https://github.com/ton-blockchain/minter/blob/main/src/lib/jetton-minter.ts these are the sources of minter.ton.org (reply to 39115)

Andrey: 🏴‍☠️ TON Blackout  Pending messages:      #Messages to zero address:   Count: 2,145,264  Min time: 2023-12-05 16:05:02 UTC      #Messages to other address:   Count: 3,638  Min time: 2023-12-05 16:05:12 UTC  Processed transaction for zero address:     #10m: 17,163     #1h: 97,120     #10h: 342,800  Queue processing ETA: 20.83 hours  Graphana chart: Open chart   🟢 today, 18:18 UTC / @dtonforum (forwarded from dTON)

Fly: Is it the case? (reply to 39086)

Andrey: we added ETA, so soon blockchain will process all messages 🙂 (reply to 39117)

— 2023-12-09 —

Sam: hey! cool stuff. but how do you regenerate the message ? the bot is not answering to me) (reply to 39117)

User<5981401951>: Hi, my name Ivan. I am 37. I am senior cpp developer.  I was the first to understand what the problem. I was blocked in russian development ton chat for several economic posts. Could you unblock me? Thank you very  much

Ọlá: Check now. It has been processed (reply to 39087)

Aryn: Dear validators with hardware for $20, I will switch you to normal equipment for a part of the income from validation. DM 😁

Light: 😂 (reply to 39134)

Howard: hi community, I am trying to put getgems code convert in Tact, now I am facing the issued when checking the accept offer tx.  1/ why the Txs looks like this?   2/ Is it the bug from TonViewer?   - Reference: https://github.com/getgems-io/nft-contracts/blob/410c0acd2d617e3db9978c13dcaa0b8de0ecdf91/packages/contracts/sources/nft-offer.fc#L23

Falco: Did you check the service? I believe it's just called "validator" so you should be able to check with systemctl or journalctl for logs (reply to 39114)

Sleapy: Is it possible to maybe put the weakest validator in "quarantine" during pike pending txs ? They don't slow the network. For now we see that we can easily ddos the network (reply to 39082)

Mehdi: The main ton repo is open source and we can check what is going on by checking commits, but unfortunately, I can not find the relation between the hardware of the validator there.  Maybe I am wrong but it seems we had a space  for abusing the network

A: i am a user of https://thename.pro/  which hold my ton domain do you know what happened and how i can get my domain back =

Alexander: Hello! Does anyone know or have any ideas why there are high requirements to become validator? I'm not only talking about minimum system reqs, but also TON coins quantity.

fesal | Patara 🐢: Because of low decentralization ideas of TON, since their system allows to not many validators. Like solana or aptos. (reply to 39142)

ston: Hello, I'm deploying NFTs using this web. https://tondiamonds.github.io/ton-nft-deployer/ But it saying 'Error: seq not incremented'. Can someone help me? 🙂

Tim: Try using link at the top. Tonconnect version is easier to use

ston: Thanks. Let me check (reply to 39147)

Tim: Write me dm if you have a problem

Maxwell: What's the best practice to get all transactions from TON in time sequence?  like extract all txs from [startBlockId, endBlockId] for futher development.  In other blockchains, it can simple be done by call getBlock and getTransaction, but in TON, the blockId consists of (workchainId, ShardId, Seqno), and the same workchain could have multiple shards.

ston: Thanks. where can I find the link? (reply to 39149)

Tim: What link (reply to 39151)

Tim: ?

Behrang: I haven't done it myself but I think this is a good approximation:  1- Find master chain block with a starting sequence number, let's say 1.  2- Then read the next master chain block with the next sequence number, 2 in this example.  3- Find all shard chains in between from this second master chain block.  4- Read transactions from each shard chain block number found in previous step sequentially, until all shard chains and all transactions are processed.  5- Then repeat this process by moving to the next master chain block. (reply to 39150)

A: who i might tag to find the answer .. my domain is inaccessable. thename /pro was a ton domain sales page and all domains are now locked `? (reply to 39141)

Rahul: anyone knows what is the meaning of error code 33. 33 Action list is too long. it says Action list is too long. anyone know what is the meaning of this error?

Daniil: Means that you try to execute more than 255 actions in one transaction. (reply to 39156)

Rahul: but i am sending 1 token and message every 30 second

Rahul: and i am getting response from transaction but some wallet not received token. it is because ton overloading?

Rahul: when i check the transaction its says pending. so when one transaction is pending then other transaction failed while first was pending?

Emilia: Hi, can someone tell me what happened to the network configuration on 6 December at 16?

User<1946892837>: Please tell me how I can send the created tokens using python, is there any example or lesson, or can someone share information?Thanks .

— 2023-12-10 —

Howard: is the Client4 got the error tho?

Behrang: Not sure, but looks like this dashboard uses the liteserver configs that were removed during that period:  https://github.com/ton-blockchain/ton-blockchain.github.io/commits/main/ (reply to 39161)

VIKTOR: If you use Tonkeeper as an application on your phone, you will receive Push notifications about incoming transactions. (reply to 39166)

User<6326163089>: + (reply to 39133)

Rhonda: Rhonda Baker, [Dec 10, 2023 at 14:10:35]: // make sure wallet is deployed if (!await client.isContractDeployed(wallet.address)) {     console.log("wallet is not deployed");     // deploy wallet     wallet.de }  how to deploy wallet

Emilia: Thank you for your reply. If I understood correctly, after the removal of the emergency configuration key, the network configuration could only be changed by a vote of the validators. Or am I missing something? (reply to 39167)

Ọlá: Ban this guy @admin

Ọlá: @TrueCarry @SwiftAdviser (reply to 39173)

User<6326163089>: ahahahhahaa (reply to 39172)

User<6326163089>: xD

Aryn: I don't think so (reply to 39159)

Behrang: Yes that's right, validators must vote to change any config. However, this has no relation to your previous message and my answer to that. (reply to 39171)

Emilia: I'm not sure I understood. In the case of modifying this global.config.json file for lite servers and DHT servers, no validators vote is needed? (reply to 39178)

User<6247944943>: Does anyone can give the full proper Blueprint repo explain how WalletV5 works?   (Prize: $20 USD)

Behrang: This is a configuration available on ton.org website and it lists initial liteservers. Since wallets where using this config to find liteservers, I guess they disabled it to stop flood of new messages getting queued.  This has nothing to do with network configuration that is stored and available on-chain. (reply to 39179)

isa: I want to shout out to everyone here!  I have been making transfers via blockchain for 10 years and I have no problems.  I only lost money transferring TONs.  Do not transfer on the tone network, I do not recommend it.  I have never seen such a bad blockchain

Daniil: It’s impossible, so probably you’ve sent to a wrong address. (reply to 39183)

isa: I am not stupid

isa: I use smilar sistem 10 years

isa: And I can't get support from anywhere.  nobody can solve the problem.  They are trying to get out of the situation by saying the network is stuck.  complete nonsense

Daniil: You’ve done something wrong. (reply to 39186)

Daniil: Can you share your wallet address from which you’ve sent coins? I can check whether they were actually sent or no.

isa: Who are u

isa: Why l share u

VIKTOR: There are a lot of people here who are technically literate and ready to help. Can you post the details of your transfer and the address of the wallet from which the transfer was made? (reply to 39187)

Daniil: Moderator of this chat. Also if you’re so experienced in blockchain, you might know that sharing your wallet address is not dangerous. (reply to 39190)

isa: UQC6ij7ygmJpKhoUwUXS0ohpCa7H4YAaFeanQuvmf5LvgOdL

isa: Look

isa: Its my adress

VIKTOR: You can also create your own telegram bot and send alerts about the receipt of funds. To work with blockchain you can use Light server + Http-Api  https://github.com/toncenter/ton-http-api/tree/master (reply to 39182)

Daniil: And where exactly did you lose money? (reply to 39194)

isa: Hehe

isa: U can see on ton blockchain

isa: But l cant see this on my wallet

isa: 8 ton

Daniil: Which wallet do you use? (reply to 39201)

isa: Its my wallet

isa: Transfer not ton space adress

Jin: I'll take a look. thanks! (reply to 39197)

isa: I see on transaction  but l cant see on my wallet

isa: Its just 1 problem

isa: Have other problems

isa: I was created pool on the ston.fi and my tons lost

Howard: guys, how to put Cell into HexString in ton SDK btw? 😵😵😵

isa: I cant see anythink

Howard: I just suddenly forgot (reply to 39214)

Howard: I found it!   If you want to put Cell data type to a hexString (so you can do the comparison for the data), you can use:  console.log(theCellData.toBoc().toString("hex")); (reply to 23769)

A: hey guys anyone know thename.pro ?

A: my ton domain is locked there

A: healp!!!!!!!!!!!!#

Howard: is this scam or vulnerable url (reply to 39218)

A: its offline domain (reply to 39221)

A: i wanna know how can i unlock my domain from there or is there any inside information in dev community

A: it was the one and only ton domain marketplace

isa: Ok look evrybody

isa: Here all scammer

isa: He or she want on me my wallet screat keys for solving my problems

isa: 😂😂😂

isa: Here all scammer aq

F: You have the address UQBv...xhD0 in your TON Space wallet But you wrote that you have a different wallet UQC6ij7ygmJpKhoUwUXS0ohpCa7H4YAaFeanQuvmf5LvgOdL  If the address provided to you is a custodial wallet, then you need to contact their technical support  There is no need to post your personal messages here.  And please write your thoughts in one message. Dividing your thoughts into many messages takes a lot of time to read them (reply to 39204)

isa: I wreit my thinks

VIKTOR: I think this should help you.  storage::pools_dict~dict_set(267, pool_address, begin_cell().store_uint(1, 1).end_cell().begin_parse()); save_storage(); (reply to 39234)

Howard: oh yes, storeDict! (reply to 39238)

Mehdi: 👌

Vladimir: Unreal Engine 5 or 4? (reply to 39247)

Andrey: wut? (reply to 39248)

Vladimir: Joke. (reply to 39249)

Trap 🍅: 只爱自己🥰😂

— 2023-12-11 —

Speculator: https://testnet.tonviewer.com/transaction/8647b6b97908198ff20e4a48042d421e37932f1197b6b95d193c0f7e3aea6818?section=trace   i am trying to mint jetton tokens tx is getting executed but it is getting failed with exit code 65535.

Speculator: Someone help me fix this

Speculator: My JettonMinter Address: https://testnet.tonviewer.com/kQD_X0wGxfn3-OwFUpA2tdMiCOrAMqkuvZS7wNoN-PVie1oz  my jettonWallet Address: https://testnet.tonviewer.com/kQA3YGLCXMRsP-5HzDyDEN1CCQnD6ZGKqdjhluhRpcjZ8zrc

brian: What does exit-code 65536 means? I received this with opcode 'excess' in jetton

Speculator: https://testnet.tonviewer.com/kQAb_dhs0by1JeBuxgcxnQlw-_Jx5b7vSCuPGKHv1CUuFceh/transaction/027fc860b5fc43a0817fcaa12735bad4253e699611fd80fb910c5571f6e19be8

Speculator: i am able to mint token but exit-code 65535 'excess' error come again and again

Howard: anyone know how to convert the sharding number here to negative?

Howard: how shard8000000000000000 => -922337203685477580 (reply to 39259)

Daniil: Convert from hex to signed int (reply to 39259)

Ali: Has tvm been updated?

Ali: Hi

Maksim: the validators voting for tvm update is planned for tomorrow (reply to 39262)

Howard: oh nice (reply to 39261)

Conan: Is it necessary to use an archive node to query this？

ston: ✋Hi, How can I deploy 10000 NFT items in a collection?

User: Yes (reply to 39269)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hey, short answer, you need an deployer script (reply to 39269)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if items content are same, you can mint them from collection, single per request or bulk (maximum ~250 per mint request) (reply to 39271)

Maxwell: Is there any chance the TON network would be reorged?  How long can I confirm tx is finalized after I have detect it's included onchain, and would not be double spent?

Dmytro: Hello, is there ultimate guide how to properly track TON coin deposits using nodejs?

Buth™: I wanted to ask if it was possible to transfer my Jettons from one wallet to another with a Ton wallet  Rather with the Ton explorer or Ton viewer

Buth™: Is there such a way??

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: tonkeeper  click on your jetton, input the amount and address, click on send (reply to 39276)

User<538057531>: https://github.com/ton-blockchain/mytonctrl/issues/151

User<538057531>: root@vultr:~# mytonctrl [debug]   11.12.2023, 13:19:07.709 (UTC)  <MainThread>  Thread self_test started [debug]   11.12.2023, 13:19:07.710 (UTC)  <MainThread>  Thread write_log started [info]    11.12.2023, 13:19:07.710 (UTC)  <MainThread>  Start program /usr/src/mytonctrl/mytonctrl.py Welcome to the console. Enter 'help' to display the help menu. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings

User<538057531>: Excuse me, what is the reason? I just run the lite node.

User<538057531>: Ubuntu 22.04 LTS  root  bash install.sh -m lite -d

Anton: Hi! I want to create a DAO on TON blockchain. And I know about Ton.vote  Can someone explain what opportunities my DAO will have if I create it there?   Is it possible to create a DAO independently, using a smart contract on the TON blockchain?

Buth™: The address the with the Jettons were received with my Bitget wallet instead of ton keeper.  I also can't import because I can only copy the private key not the seed phrase (reply to 39278)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I think you have one option, sending transafer request to the jetton wallet via code with your private key. You should do it on your own and don't share key to others (reply to 39287)

Buth™: How Is dat done pls 😭 (reply to 39289)

MonoBit: Hi guys I get TypeError: Cannot read properties of undefined (reading 'v4-testnet') error running npx blueprint run contract --testnet --mnemonic.  Does anybody know why is that?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I don't know how to help if you are not a coder. You did a mistake on using exchange wallet to pay onchain fees. Sorry I can't help. (reply to 39290)

1: Hi, fam  Please, join our project Ton Game App project @baks_ton  A lot of interesting info will come soon.   Devs please join, you will see cool TON+ Telegram mini apps use cases

ally11: hi guys

Buth™: Damn it.. "Will Bitget wallet be able to connect to TON DEXs anytime soon?" (reply to 39292)

ally11: can anyone tell me what is 709 error  https://tonviewer.com/transaction/784ad0a910fbd9e2c0949f20cd6122e10ad03382c49b88f082e3256fdf3fea6a

Slava: Hey guys! What are the recommended specs for a liteserver node these days? Considering the recent increase in processing demands.

John: Hey guys, can you transfer $TON on chain right now?

Mikhail: Hello guys, is testnet alive? cannot send transaction, dropping over here

Priest: Lets am starting a Web 3 project and want to launch it on TON. how can one launch a presale on TON network like Pinksale?

Priest: is there a platform for it? (reply to 39300)

Daniil: For NFTs or for Jettons? (reply to 39300)

Priest: Jettons

kocmo12: check dm (reply to 39303)

fabriregu: Hi,  I'm having some trouble understanding why my wallet address is displayed differently. As you can see from the two screenshots below, the HEX never changes, but I am getting two different addresses for Bounceable and non-bounceable. I used https://ton.org/address/ to get the information in the screenshot.  If I use TonConnect, the address that appears is the one that ends in jETJ. If I check on https://testnet.tonscan.org/, the address is the one that ends in KKG. Also using the mnemonicToKeyPair function of the library tonweb-mnemonic, the account is the one that ends in KKG.  Can you help me understand these differences and how to parse from KKG to jETJ please?  Thank you

Anthony: Hi all! If your projects are experiencing difficulties working with public liteservers due to their increased load recently, then let me know. Let's think about how we can help you.  Send me a DM with a description of your project and expected RPS.

User<6877528525>: i cant use public rpc ,have anyone others?

EternalCØDER: Hey everyone,  Is it possible to transfer TON to another account (with their telegram ID) programmatically using API or something?

fabriregu: Sorry guys. i got it. is because i were on testnet. (reply to 39305)

Андрей: bash install.sh -m full (reply to 39285)

Behrang: How to connect blueprint network provider to a custom liteserver?

aaa: @tsivarev hi , Any one can help me?     LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 80EF4C26A5F7E148E1B402DF8868EDAA1E5369AF9201F3BF245A9097564303F7:\nexitcode=33, steps=33, gas_used=0\nVM Log (truncated):\n...OW\nexecute XCHG s1,s3\nexecute LEQ\nexecute THROWIF 35\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute ENDS\nexecute XCPU s3,s2\nexecute EQUAL\nexecute THROWIFNOT 33\ndefault exception handler, terminating vm with exit code 33\n,

aaa: What's wrong?

aaa: address : EQCA70wmpffhSOG0At-IaO2qHlNpr5IB878kWpCXVkMD91Zs   ,   seqno=2

Tim: wrong seqno or signature?

Пескарь™ | фронтент телефонов: seqno (reply to 39317)

aaa: What's the right seqno?

aaa: I succeeded twice but failed the third time

aaa: But the seqno I submitted two times before may be 0.

aaa: How do I see the seqno stored in my account? Thank you very much for your help. (reply to 39318)

Пескарь™ | фронтент телефонов: run get method seqno (reply to 39323)

aaa: I tried to get seqno, it returned 0, and still reported an error (reply to 39324)

aaa: Wow, that’s amazing. Where can I see this?

Пескарь™ | фронтент телефонов: tonviewer.com/EQCA70wmpffhSOG0At-IaO2qHlNpr5IB878kWpCXVkMD91Zs?section=method (reply to 39328)

aaa: Does this mean I just need to submit 1? (reply to 39329)

Пескарь™ | фронтент телефонов: yep (reply to 39330)

Sleapy: Hi, probably a noob question but when is the state of a block shard available ? On each masterchain block or before ? for example, and we see it more often now than in normal condition, between two masterchain blocks we can have several blocks for a specific shard. if I take block 34716007 and 34716008 on masterchain for reference, on the shard (0,e800000000000000) we see that the last seqno is 40573163 for block 34716007 and 40573165 for block 34716008.  is it possible to have the state of block seqno 40573164 before I get 40573165 ?  Sorry it is not very clear but that's all I have lol

Maple: Hi, Can I use the TonTools library to sending one transaction with transferring different Tons to different addresses? I see it can only include one address in this library. But it said one transaction can include 4  transfer transactions in official docs with v3 and v4 wallets.

Priest: Is there a dapp like pinksale on TON? Recommendations pls

🕷: What is the maximum number of ascii characters that can fit in a memo?

Tim: you probably can fit a lot if you use snakecell (reply to 39338)

User<538057531>: The hardware requirements of the whole node are too high, I just need lite. (reply to 39312)

Tim: You can only install full node if you want your own liteserver (reply to 39341)

Tim: https://docs.ton.org/participate/run-nodes/liteserver

User<538057531>: Okay, thanks.

— 2023-12-12 —

Collective: I have a few good app ideas, if anyone is interested in building them out with me, reach out 🙏🏾

User<538057531>: Can't you just say no (reply to 39345)

User: Can someone suggest, where i can buy vps for liteserver?

Denys: Guys, how can I learn ton? I don't know anything about coding

Dmitrii: Hi, I am working on supporting tonlib emulator and struggling  a bit on getting a structure,  similar to td::Ref<vm::Stack> instead of serialized BoC. Is there a simple way to convert serialized BoC to  vector of vm:StackEntry, or maybe piece of documentation which may help?  Of course i could patch emulator-extern.cpp to avoid conversion to BoC and return the structure similar to one returned in tonlibjson, but maybe there is a simpler way?

User: [ 1][t 2][2023-12-12 09:15:39.111215839][validator-engine.cpp:3504][!validator-engine] failed to parse config: [PosixError : Permission denied : 13 : File "/var/ton-work/db//config.json" can't be opened/created for writing with truncation]  How i can resolve this problem. I restore backup which i download before on my pc and it start give me this error. chmod is not help

Dennis: How is it running? Under which user? Are the files owned by that user?

Beybut: chown? (reply to 39352)

Beybut: Have you started by root user?

User: i started node with root, i don't now which user use validator process (reply to 39355)

Dennis: ps wwaux

Lichtkunst🐾: is there any AI Tool related to TON witch can write smart contracts?

Howard: Hi community, why we put the number here with WalletID? 698983191

User<1237707859>: Hey guys! Has anyone verified the tone of a wallet using ton_proof?  Tell me how to do this - I’ve already tried a lot of options and it doesn’t work Hey guys! Has anyone verified the tone of a wallet using ton_proof?  Tell me how to do this - I’ve already tried a lot of options and it doesn’t work Node Js

Andrey: its default wallet id magic constant (reply to 39359)

User<5762094943>: .

Howard: 🤯🥹   So I tried to implement https://github.com/ton-blockchain/wallet-contract to a blueprint project.   And obviously, the init.code is different than we got from WalletV4 SDK(https://github.com/ton-community/ton/blob/dd87c6e/src/wallets/WalletContractV4.ts#L5) (reply to 39361)

Tim: It should not be different

Tim: and its not obvious

User: systemctl show -pUser,UID validator UID=[not set] User=validator  I found, it work under validator user   SOLVED for future:   chown validator config.json (reply to 39357)

Ali: Hello Is it true that 320 confirmations from validatiors   must be done in Ton blockchain to confirm the transaction? (reply to 39364)

Tim: No (reply to 39367)

Ali: But admin of one of the exchange say it? (reply to 39368)

Tim: He can say what he wants, it's his exchange

Tim: If it's on tonscan its confirmed

User<6063482254>: Hi, do you also have issues with public liteservers? I cannot connect to any public liteserver from ton-http-api

Vahe: Good evening guys, is there a way to verify the relationship between nft-item and collection in contract ? The only one I found requires to have nft-item-code saved, is there a way to get that code  (inside contract ofc) or any other options ?

User: And another question about liteserver. I don't have min amount of memory, 512 gb, and is that possible to fit it into memory which a little bit smaller. Is there any command which will delete old part of db and load new? Is that possible that node make it by itself? (reply to 39366)

@𝐘𝐞𝐥𝐥𝐨𝐰_𝐃𝐮𝐜𝐤: Hi, to which address should I send a spam token for burning in the TON network? Thanks

Daniil: you don't really have to (reply to 39375)

@𝐘𝐞𝐥𝐥𝐨𝐰_𝐃𝐮𝐜𝐤: I want to burn the token. I don't want to see it in my wallet. 😄 (reply to 39376)

Daniil: you can (and it's better to) just hide it in the wallet app (reply to 39377)

@𝐘𝐞𝐥𝐥𝐨𝐰_𝐃𝐮𝐜𝐤: Everything is visible in the tonviewer. (reply to 39378)

Daniil: but they still can't harm you. (reply to 39379)

@𝐘𝐞𝐥𝐥𝐨𝐰_𝐃𝐮𝐜𝐤: Agree. Unfortunately, I consider this as spam advertising (reply to 39380)

User: Or someone who already rent server for litenode, can you share link in dm and what plan you use, please. (reply to 39374)

twiddles: hey guys, quick question. Is the decimal places for the native Toncoin, 9?

— 2023-12-13 —

Mehdi: Silly question: How much time have you set aside to master TL-B,Bag of Cell and Merkel proof ? What's going on? I assumed myself to be talented until I reached this complexity. It's not value; code must be written first for humans, not machines. No tutorial, no documentation, no analogy—every page directs me to another page. Finally, I find myself in pure mathematic, I need help or I run away from this community without look at behind .

Mehdi: Who called this technology The Open Network(TON), come here and be accountable, this is a The Complex Russian Network(TCRN) rather than an The Open Network something like (KGB), I learned Russian in this group and that Russian group, but I am stuck in the basics of technology.  Now I understand why America was against this and was right.  Until you solve this simplification problem, this network will not go further than the cold of Moscow and St. Petersburg.  Now some cold-blooded Russians come like Putin and say that this technology does not need you and your ilk.  Go after your work.

Dennis: Documentation is hard, low hanging fruit gives the most value (what people need most). If there are aspects you don't grasp, you can either ask normally, or run it through a GPT and ask

Daniil: you don't actually need most of what you find "hard" in TON. and the basics are mostly simple and don't require extensive math and CS knowledge. (reply to 39384)

Mehdi: Sir, the person who gives you feedback is ahead of normal person , he is actually your friend, GPT chat is also an illusion and hallucination I have gone all the way, this is my last attempt to ask you for help. This is not meant to be low-level, this must consider basic . And should be open and easy for everyone to grasp (reply to 39387)

Tim: Docs.ton.org is pretty good, I don't understand what exactly do you want

Mehdi: This is main mindset in TON community that makes big dificiency ,I encounter very place with this mindset between seniors , I am sure , with respect, that this mindset is completely wrong, all web3 ecosystem is about trustless .How you tag this concept not basic and said you don't need them , you can not find a line in TON dev without relation with this concept.  If you seek just for operator and monopoly you are right . (reply to 39388)

Mehdi: Please devote 45 minutes and teach me these concept , all doc.ton.org is in my brain . Future more I read almost line by line main repo , even other implementation of TVM as well . Every SDK too . (reply to 39390)

Mehdi: I know when you figured out system, it is very simple, and questioning about them seems silly , I feel you .

Tim: I don't think anybody wants to spend 45 minutes with you for free, but we have ton dev study course for developers

Mehdi: I don't know how dB in all system works? How in TVM scop we can access to outside cells , how cells and bag of cells would organized .

Mehdi: I knew , because if you check other Blockchain you find main projects from all around the words , how about TON? (reply to 39394)

Mehdi: 200 account is full of TON , at least spend some of them for simplicity hard concepts, don't consider it as huge . This is first simple step for every community

Mehdi: I address this problem some other place like these following link , all response are same . Not every developer have courage to told you truth , they simply attract other community, take these advice seriously and make action please .

Mehdi: https://github.com/ton-society/grants-and-bounties/issues/374#issuecomment-1850372772

Dennis: I don't think your "either help me or I'll fuck off" attitude really helps. I mean, post a concrete question, and people can answer. You can't demand time of anyone. Just my 2c.

Mehdi: You can search the chat history to see some of my unanswered questions, I don't think you all understand the concepts either, but just pretend.  If you can't describe concepts in simple words, it means you don't know it either.  Wherever the documents mentioned only a few know this 😂, and it's a shame to even be proud of it

Mehdi: My dear friends, this is not a personal issue, my point is clear and it is related to a basic principles for the community growth.  Its audience is the main decision makers, not you.  Accessible education helps us all.  Obviously teaching fundamental concepts  is not on the agenda at all,  Community maturity is for everyone's benefit.  Please, if you don't support it, at least don't oppose it either , it's very simple, please don't complicate it.

botmother: Hi all, i've got a silly question.  When this is sent in fc       var msg = begin_cell()             .store_uint(0x18, 6)             .store_slice(parent_address)             .store_coins(const::ton_for_fees + const::ton_for_deploy)             .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)             .store_uint(1, 32)             .store_uint(query_id, 64)             .store_uint(item_index, 64)             .store_coins(const::ton_for_fees)             .store_ref(nftItemContent);      send_raw_message(msg.end_cell(), 1);     Then when i do this in another contract, how does it know wether to take query_id or item_index, since both of them have 64 bit uint. What am i missing?      int query_id = in_msg_body~load_uint(64);  Bounty ($2) 🫡

shbn9x: This is not fair , you banned me! please grow and think big (reply to 39402)

botmother: yeah, or put a bounty for your question 😁 (reply to 39400)

shbn9x: Admin why you baned me!? please answer this is my old account and I was banned ,@Mbaneshi1 (reply to 39399)

shbn9x: I address my concern here , if anybody is agree , please support https://github.com/ton-society/grants-and-bounties/issues/393

Dmitry | backend4you.ton: It took 2-3 evenings to understand BoC and write serialization/deser. code for c# sdk. First hard point was due to poor translation about cell length encoding in docs so I used to use original pdf. And second one was about “big” BoCs where some fields should increase in size. Both questions were solved by asking direct and exact questions here. (reply to 39384)

shbn9x: I earn 100 ton credit from my active participation on doc website , this is tonapi account charge , I will offer for bounty ,you mean one billion TON is few for non profit organisation , I add all my TON for them, no need for ban , I fork main repo and make iranian open network for all 😁 kidding, take it easy (reply to 39405)

shbn9x: Thank you for direct answer. Hope more like it (reply to 39408)

Behrang: In my view, the main problem is you haven't asked a good question. Many people ask questions here, but only clear questions get answered.  And why do you expect people to put 45 minutes for you? I've put more than 6 months just to learn the basics. This is what it is, the documentation is poor, but it's improving. If you fill it's not good enough, then come again the next year, or the year after that! Even though it's harder to learn at this stage and this point in time, the reward is also bigger.  Also your tone is not friendly. I think that's why you're banned. (reply to 39402)

Hakiem: Hi guys, is anybody else having issues sending transactions to Tonkeeper wallet using TonConnect on testnet? Transaction confirmation doesnt pop up on tonkeeper

𝐔𝐋𝐓𝐑𝐀: Global problem 🫠 (reply to 39412)

𝐔𝐋𝐓𝐑𝐀: So don’t worry,it’s going from tomorrow

Hakiem: other wallets ok?

𝐔𝐋𝐓𝐑𝐀: Nope 🫠🫠🫠 I’m still waiting for my tons 💎 (reply to 39415)

𝐔𝐋𝐓𝐑𝐀: Wallet telegram, also KuCoin

Mehdi: I thank you , this answer is what I guessed but not sure. and this fact should be considered seriously by decision makers , why someone who spend 6 month to learn basics , should teach others in 6 hours, (reply to 39411)

Behrang: My point was not about that I don't want to teach others. My point is that even if I do want to teach others, first I have to learn more, and then it takes some time to teach. This is how the community grows over time.  BTW, that 6 months is lower now, because of more documentation/learning materials. I think that 6 months can be achieved in 3 or 4 months now. (reply to 39419)

Hakiem: r u saying testnet is down 😱 (reply to 39417)

Mehdi: I want, once more, to thank the Dorov brothers who wrote 550 pages PDF technical state-of-the-art computer science solutions and opened them to the rest of the world. I cannot imagine how big two, powered by 32, will be. It is mind-blowing, but we are currently operating only one chain although it works in somedays not always.what will happen for a main repo which has a few developer  for 4 years? .This mindset is big problem that should be addressed asp I am sure .complexity is not value. simplicity is key.Simplicity makes Network Open. (reply to 39419)

&rey: You can load contract state (balance, code and data). If you choose to call any additional get-methods, you should do so locally on the state obtained (so that new transactions don't break the consistency). (reply to 39423)

Jack: Hi all! I'm a bit stuck with something and would love to hear your thoughts or suggestions.  I have a question about using Botfather for WebApp registration. I know how to register an app and share it externally using the format t.me/BOT_NAME/APP_NAME. However, I'm wondering how to share a more detailed page within the web app. Is it possible to do something like t.me/BOT_NAME/APP_NAME/DETAIL_PAGE? It seems that this format doesn't work. Should I register the detailed page through Botfather as a separate WebApp and then share it using t.me/BOT_NAME/DETAIL_PAGE? Or is there a better way to do this? Any advice would be greatly appreciated!

Mr. Coder: http://t.me/BOT_NAME/APP_NAME?startapp=DETAIL_PAGE

Mr. Coder: Example in my telegram profile description (reply to 39428)

Mr. Coder: http://t.me/BOT_NAME/APP_NAME?startApp=DETAIL_PAGE&startapp=DETAIL_PAGE  For correct work in all devices (reply to 39428)

Jack: Thank you very much for your assistance; I greatly appreciate your help and guidance.

Bruce: K

Ayrat: hey. some txs are not getting submitted to chain right now on mainnet. what can be the problem?

Bobby: yeah

Bobby: me

Bobby: too get TVM exit code 35

街寿小西: When I transfer money, the following message is returned, how do I solve the problem “failed to get account state: adnl request timeout, node 5.9.10.47:19949”

User: Hello, can someone help me with that? (reply to 39374)

Sergey: How is the payment qr code generated if I want to indicate the wallet address and amount? What address should I provide?

User: you can use tonkeeper, tonhub or ton deep links (reply to 39440)

Sergey: where can I see the link sheme? (reply to 39441)

User: https://github.com/tonkeeper/wallet-api?tab=readme-ov-file#payment-urls (reply to 39442)

&rey: Please check out https://t.me/tondev_eng/19663. (reply to 39439)

User: i already set --state-ttl 604800 —archive-ttl 604800 --block-ttl 604800 --verbosity 1, but size continue growing, nothing haven't deleted. (reply to 39444)

&rey: If you set even less, does that fail? (reply to 39445)

Emanuel Lezcano: Hello, I want to know if I can make my own wallet and deploy it to the TON blockchain?

Emanuel Lezcano: If you have any documentation I would appreciate it.

User: what is the lowest number which i can set there? (reply to 39446)

&rey: Yes. Please check out existing wallet codes: https://github.com/pyAndr3w/ton-preprocessed-wallet-v2, https://github.com/ProgramCrafter/wallet-contract/, https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif. (reply to 39447)

&rey: I'd guess 86400 should work fine, storing 1 day of history. (reply to 39449)

Emanuel Lezcano: thank you

User: ok, will try right now. What i can do with old blocks, will it delete all by itself? (reply to 39451)

&rey: They auto-delete. (reply to 39453)

User: it started and work, thank you. But it still store old data, size didn't changed. (reply to 39454)

User<5009066984>: Hello 👋

User: I have a problem with  Local validator out of sync: 169224 s  It's growing (reply to 39454)

— 2023-12-14 —

Tim: check logs

Tim: tail -f /var/ton-work/log*

Jon: Unable to execute get method. Got exit_code: 9        64 |       65 |     async getCounter(provider: ContractProvider) {     > 66 |         const stack = (await provider.get("counter", [])).stack          |                        ^       67 |         return stack.readBigNumber();       68 |     }       69 |

Jon: why

User<5332466353>: how to get the finalized tx data?

User<5332466353>: i'm building a layer2 VM for TON, using inscriptions

User<5332466353>: wanna know how to get the finalized data by timestamp in real time

User<538057531>: Does anyone have their own full node? I want to test whether the ton speed will be faster.

User<538057531>: Excuse me, can I use your whole node test? (reply to 39455)

&rey: All blocks you are able to get are already final. (reply to 39463)

&rey: Have you initialized contract data correctly? (reply to 39461)

Howard: anyone got this error when interacting with the RPC tho?

Jon: const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));  success  but sendNumber fail (reply to 39469)

Jon: Is it initialization data by calling this method?

Bobby: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 39471)

User<5332466353>: which rpc provider are you using? (reply to 39471)

Howard: shit, it's RPC overload issued.   Kind of wired, those RPC endpoint is not stable even in the testnet. OMG. (reply to 39475)

Bobby: you'd better setup a local node

Hacker Hills: API service limits the load ✅ (reply to 39471)

Gunnar: yes, you call get_nft_data on the item, it will tell you which index it claims to have + the collection_address.   Then you call get_nft_address_by_index on the collection and verify that the address of the item comes out. (reply to 39373)

Original: Hello everybody, here i read:  https://docs.ton.org/learn/networking/adnl#adnl-address The ADNL Protocol allows you to send (unreliable) and receive datagrams using only ADNL Addresses. IP Addresses and Ports are hidden by the ADNL Protocol.  But then here i read:  https://docs.ton.org/participate/web3/sites-and-proxy#recommendations Since anonymity will only be available in TON Proxy 2.0, if you do not want to disclose the IP address of your web server, you can do it in two ways:  Run a reverse proxy on a separate server with -R flag as described above.  Make a duplicate server with copy of your website and run reverse proxy locally.  Does it means that there is a way to disclose the IP address of each ADNL address even if it is hidden by default?  Can also full node IP addresses be disclosed from ADNL addresses?

Mehdi: #include "imports/stdlib.fc";  () recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {     slice cs = in_msg.begin_parse();     int flags = cs~load_uint(4);     slice sender_address = cs~load_msg_addr();      set_data(begin_cell().store_slice(sender_address).store_uint(1,32).end_cell()); }   (slice,int) get_sender() method_id {     slice ds = get_data().begin_parse();     return (ds~load_msg_addr(),ds~load_uint(32)); }

Daniil: What? (reply to 39483)

Mehdi: just told you are writing cpp language , Now we have func highlighting 😎

Mehdi: works every where 😎😁

Mehdi: if you write three backticks followed by code of language like c , cpp, Rust , python  , everywhere that markdown file supported , you will have highlighted syntax code block , for example in GitHub , notion ,telegram , and other blog platform like daily_dev and hash node, This makes reading code much more convenient

Mehdi: this will converted to

Mehdi: This , with simple trick

Mehdi: of course we have tree sitter and syntax highlighting project  for func under dev , but till adoption in other plaform this helps

Mehdi: This is for markdown file , one other simple trick for raw code, for example in GitHub repo is  , for example my_code.fc to be highlighted is naming it as my_code_Func.cpp , result is we have both indication that this file is written in Func language but as bonus we have syntax highlighted code as well .

Mehdi: you can see difference for elector code here,raw code and here with trick(highlithed)

xia: hi guys，I met some issues， this method is working fine on the testnet. But it can't work on the main net.

xia: this is a very important part in my program，can someone help me

&rey: Contract isn't initialized. For wallets, this means correct seqno is 0. (reply to 39494)

xia: So I need complete one transaction before I run my program. All done, thank u sir (reply to 39499)

Angela: Hihi developpers in TON. anyone can help me on an tech. issue.

Angela: I sent my NANO inscription to a 12-digit mnemonic wallet, bitget wallet. Now I am not able to transfer it.

Angela: As the TONKEEPER is a 24-digit mnemonic wallet

Angela: Is there anyway I could retrieve my NANO inscription?

Angela: Not able to conntect with any tech. guy in TON...

Angela: Looking for the power of TON community...

Sam: journalctl outputs nothing useful, and I can’t find anything relevant in the log files. However, it seems to be staying in sync based on the “local validator out of sync” line. Just confused why it would say the validator isn’t working if it is staying synced.   This problem only started after I lived it’s data directory away from the default /var/ton-work (reply to 39137)

Falco: Did you change the path from /var/ton-work to something else?   I think it's better if you leave it intact and just use a symlink if you want to store it on some other location. So the validator (and other services) still think it's on that /var/ton-work directory. (reply to 39507)

Sam: I’ll give that a shot, thanks (reply to 39508)

Gunnar: we made https://github.com/bakkenbaeck/highlightjs-func / https://github.com/bakkenbaeck/highlightjs-fift / https://github.com/bakkenbaeck/highlightjs-tact (reply to 39490)

PLATFORM: Hey Talented Fellas!    We're back with the game challenge #2 Get ready for an epic TMG airdrop contest, a dynamic collaboration between TonRadar and Storm Trade; Where the thrill is real, and the prizes are even more exciting – a whopping $250 up for grabs!  📆 Date: 14 December 15.00 UTC - 19 December 15.00 UTC  Epic Prizes Await 🪙: 1st place -   30 TON   2nd place -  20 TON   3rd place -  10 TON    4th place -   8 TON     5th place -   7 TON     6th place -   6 TON     7th place -   5 TON     8th place -   4 TON     9th place -   3 TON    10th place - 2 TON     11-20 places - 2 TON  🕹 Getting started is a breeze: to join the tournament, simply launch @tonradarappbot, tap on the game challenge button, and... you're ready to begin the challenge.  Quick Heads-up: Anyone and everyone can jump in for a shot at glory and cool cash. Don't let FOMO get the best of you! Join the TONRadar bash.  🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

Mehdi: Hi friends , Does anybody knows what the purpose of ton20 is? Assume we mint Deploy transfer bla bla and others do as well,  what's next? I mean what real use case it might have? So far we know it produce co² and bring award for validator and populated network. Not big deal , what's next? I think blockchain is a piece of software which aim to solved humans kind problems somehow,  but base of its protocol definition I can not find any answer but as community and also some big head supported it , I guess I am wrong it should have a real usecase

Daniil: ton20 is a practically useless standard which was adapted from bitcoin to TON just to make some hype (it succeed in that).  Use TEP-74 jettons instead as tokens. (reply to 39512)

Mehdi: I remember guy who was working on it , had received a message from github and they ask for some more line of code in its platform for adoption (reply to 39510)

Mehdi: Are u sure? I know in even bitcoin it assumed to be nasty useless , I am wondering why it gain credit . If you analyse design of smart contracts ,  it is obvious they know bit about how ton works, also their  developer have not known in community,  it seems mysterious , (reply to 39513)

Daniil: that's just what I said: ton20 is a useless standard (reply to 39516)

&rey: I have thought ton20 didn't have a single smart contract? (reply to 39516)

Step: ton20 was stress testing tool for mainnet nothing more or less. 😅

Sam: I tried linking my mounted directory to /var/ton-work, and I'm still getting "Local validator status: not working" in mytonctrl status (reply to 39508)

Falco: What does: systemctl is-active --quiet validator return? (reply to 39521)

Falco: I think it's being used in the code to check that status

Sam: Ahh that would be why - while testing I was using a different service name (reply to 39522)

Falco: Yep that's the reason then :)

Sam: Thank you! Looks good now

Sam: Any idea why Validator index would still be showing as -1?  Is it just bc it isn't currently a validator? (reply to 39525)

Чионг: Everything is as it is

Катя 🖤🖤🖤🖤🖤: Привет

Falco: Yea, I think so (reply to 39527)

Mehdi: Sorry,  what u mean!? (reply to 39518)

Mehdi: Привет! Это английский чат, хотя большинство людей здесь - русские. Я персидский, только начал изучать русский. Заметил, что русские не отвечают, поэтому я взял на себя обязанность обрабатывать ответы. Если хочешь, могу отправить тебе ссылку на русский чат. Если тебе не удобно на английском, Google Translate всегда здесь для помощи. (reply to 39529)

Daniil: ton20 standard doesn't have any smart contracts involved in its logic. (reply to 39531)

Mehdi: I don't think so , we can consider it as stress test tool after incidents and be happy.  But it doesn't mean it is a tool in fact  . Ton as a system like any other system has its own characteristics limitation,  what it means? We can have two power by 32 account in just one workchain . So in normal development design we should  use platform principle architecture design,  here it is sharding or load balancing . On other side that is related to resiliency of network we should consider measurement just discard message that orginated from account who do not know this network. (reply to 39519)

Mehdi: This is wrong,  if we have transaction,  smart contract is prerequisite.  What you call smart contract , we use address , actor, smart contract , account interchangeably . This comes from official document website , if you curious I can send you its link (reply to 39533)

Mehdi: Now a days , TON development approach is to adjust capacity of processing one account inbox message.  It means we are amend unknown company fault. This is wrong.  We must know our limitation,  and force it as our principle design.In this case network works and bad actor( intentionally or non intentionally)learn .

Daniil: you're correct. but I mean that their standard doesn't require any smart-contracts apart from user's wallet itself.  for example, Jettons standard utilises minters and wallets. NFTs utilise collections and items. (reply to 39535)

Mehdi: Every messages,  both internally or externally processes by validator . Ton has special way , to reach conclusion and commit block , and discarding message that want to excess capacity of one entity is just about a single if check which arise error . If we do not change our policy,  sure we have catastrophic incident more and more . Now you senior guys help me to expand basic knowledge needed to enrich community knowledge. I am here just 30 days and do not write a line of code , because how one can write code when he don't know basics primitive of system I mean low level staff ,so please go this link and want to open this unfair closed bounty. Community has power,  do not under estimated it

Daniil: You don’t have to understand some system deeply on a low level to write something for it. (reply to 39538)

Mehdi: I am sure , you don't believe what you said , but I am not sure what intention or motivation reside beneath your point of view,  sorry but knowing low level staff if not necessary,  accept that help extraordinary!  Now the question is why you insist on your point. Long story short , are you OK to help expanding opportunity such that developers learn low level staff by ease. (reply to 39539)

Daniil: I’m not saying you shouldn’t learn. I’m just saying that you can try being more practical instead of theoretical when it comes to software development. (reply to 39541)

Mehdi: I am responsible for writing a article for community,  I search all around Web,  I read all document , see all youtube,  ask my question in every group , guess what happen ? I forced to read main repo to find my answer , and I can not find it yet. So what was article? How manage gas! It was issue 5, now we are issue 400 , this issue have no applicant for 5 month , its reward was 500 $. So tell me does gas usage  is neglectable? Or why you that implement bounty more than any other do not do this . And final question are you plan , every developers do same as me ,This is community on boarding policy!?or should it changes!?

Mehdi: The point is clear , this is not personal issue , this is about community !  If comes to personality I admire and respect you more than anyone,  but my point is another story,  I strongly believe knowing low level staff  should be  in hand of anybody by ease . And this perspective has beneficial for all , without any doubt.  This is not impossible and not even big deal ,it is also very simple . A animation film that start from hash function,  go through actor model,explain how double spending is solved here , stack machine,  async programing , TLB , BoC, Merkel proof , and so on .  Its prompt is, please explain these  as I am 5 ,and  Done!

— 2023-12-15 —

User<580784623>: Hello everyone. I am the CEO of the MetaFarm project and we would like to use the TON ecosystem as a basis for the development of our project. Please, if possible, a contact to start the negotiations

&rey: What would you like to negotiate? TON is The Open Network, it requires no permissions to build projects on it. (reply to 39546)

User<580784623>: Thank you very much for your answer. So I have to give instructions to the technical team and they will already start the works (reply to 39547)

&rey: I also believe documentation link (https://docs.ton.org) will help your team. (reply to 39554)

Speculator: what does this error mean? How to fix it?

Speculator: Func compilation error: ( function builder_null? undefined )                                                                                                                                                                                cannot generate code for function builder_null?:                                                                                                                                                                                            contracts/nft_item.fc:46:9: error: builder_null?                                                                                                                                                                                                  if (~ builder_null?(payload)) {                                                                                                                                                                                                               9 |       10 |     beforeAll(async () => {     > 11 |         code = await compile('NftItem');          |                ^       12 |     });       13 |

Creature: Are you there @gusarich ?

Daniil: you don't have to tag me everytime in public group. just be patient (reply to 39566)

Creature: Hope you answer me.

Faker: raise LiteClientError(f'LiteClient crashed with {result["code"]} code. Message: {result["message"]}') pytoniq.liteclient.client.LiteClientError: LiteClient crashed with 0 code. Message: Not enough data to read at 4

Faker: I want to activate my uninit wallet

Faker: What should I do? Thank you for the answer

Faker: here is my code

Alexander: Guys, do I get it right: When I call context.()value, I get value of incoming message AFTER storage fee is taken?  If it's the case, then checks like context().value >= PROCESSING_FEE are useless 😳

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you are using a function that not exist in the stdlib.fc, compare the stdlib in your project with stdlib where you get func code (reply to 39565)

Speculator: yes, issue is fixed (reply to 39576)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: context value contains incoming amount which already added to the balance. if you are send a reply with mode 64 (send remaining value) then your out msg contains income - contract fees (reply to 39575)

Alexander: Yes, correct, but I get an error before any outcoming message is sent.  E.g. I get incoming message with 5.05 TON and perform a check that require(context().value >= deposit (5 TON) + PROCESSING_FEE(0.05 TON), and this check fails somehow =/ (reply to 39578)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is not valid code. share the contract code and your test code (reply to 39579)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if this msg is incoming from another contract be sure you are using right mode, for example if msg value is fixed on 5.05 ton you must use SendPayGasSeparately (reply to 39579)

大嘴: How to add Ton20 to Little Fox Wallet

Speculator: does anyone deployed nft-item contract and minted nft?

大嘴: RPC   ID？

大嘴: How to add Ton20 to Little Fox Wallet (reply to 39567)

Speculator: i want script to mint nft. (reply to 39583)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://github.com/ton-community/nft-sdk (reply to 39586)

&rey: Does ton20 standard offer complete guarantees or ways to check whether transactions are valid? If it is not so, there is no point in adding it to any wallet. (reply to 39582)

&rey: Storage fees are deducted from contract balance, not message value. Also, PROCESSING_FEE usually stands for value of gas. (reply to 39575)

Alexander: Clear, thanks! (reply to 39591)

Creature: Hi. I've got such an error.

Creature: "TypeError: Cannot read properties of undefined (reading 'v2-mainnet')"

Creature: I do hope someone help me.

Creature: "Can not read node_modules/@orbs-network/ton-access/src/nodes.ts"

Creature: Where can I get ton rpc url?

Creature: I mean ton endpoint.

Anthony: 🔨Dev tools updates  blueprint v0.15.0 This release improves custom API capabilities. Please consult blueprint help run to see detailed flag descriptions. - Added flags --custom-version, --custom-key, --custom-type to run and verify commands to allow better control over custom API behavior - --custom now always adds jsonRPC to API URL for v2 APIs - Fixed argument handling (forwarded from TonTech)

Maple: Hi. I saw ppl can send up to four transfer transactions one time using with JS sdk and v4 wallet. Could I did same thing with python sdk. If so, can anyone recomment me the library? Currently, I am using tonsdk and tontools. Both can not fit my need.

Alexander: Also get a TypeError: Cannot read properties of undefined (reading 'v4-testnet') error.

Tim: Read message above and use custom provider (reply to 39602)

Front: Hello, I have this bug too!!! Please help !!!  import { getHttpEndpoint } from "@orbs-network/ton-access";const endpoint = await getHttpEndpoint({ network: "mainnet" });   ERROR: Cannot read properties of undefined (reading 'v2-mainnet')

Sam: How do current validators monitor their performance? Are there prometheus exporters created anywhere?

Ka: Hi any admin available now? Is TON supported & integrated by any custody solutions? Any recommended solutions can i refer to?

Daniil: What do you mean exactly? (reply to 39606)

Ka: Hi Dannil, has TON worked with any custody wallet vendors? I would like to know which wallet vendor we can reach out to and partner with so as to get access to TON Chain.

Ka: Didn't know this. Can you help to detail the wallet app? (reply to 39609)

Ka: @Gusarich

Daniil: There are many wallets that support Toncoin (reply to 39609)

Ka: Any custody wallet then? have been looking for the custody wallet supporting TON chain (reply to 39612)

Ka: To be clearer, the custodial wallet vendor i target to work with is things like https://www.fireblocks.com/ however, TON chain is not supported by Fireblocks  If there's any custodial wallet supportive for ton, we will go for it

VIKTOR: @wallet (reply to 39614)

Ka: checking

Ka: 🤩

Ka: a quick question, how can i integrate this @wallet to my project? (reply to 39615)

VIKTOR: This wallet only for users. You can use this wallet for your dapp only without api.   If you want integrated own custodial wallet, then try this  https://github.com/gobicycle/bicycle (reply to 39618)

Daniil: Well, there’s Wallet Pay api:  https://pay.wallet.tg (reply to 39619)

Ka: Thanks for this information. I will look into the doc. Really exicited to integrate with Ton (reply to 39619)

Ka: Appreciated. Will further check and ask here if more questions (reply to 39620)

Rahul: Hey, i am ton web developer. If anyone wants to hire me for your project then dm me. Thanks )

Jump: Is the lite server deployer unavailable?

Falco: Copper supports TON. If you're interested in staking TON, let me know. I work for a company that does institutional staking, TON is one (out of many) of the assets we support. (reply to 39606)

Ka: Hi glad to know.  Does copper provide the custodial wallet function that allows my customers to deposit and transfer ton token via my dapp (reply to 39625)

Falco: That I unfortunately don't know, you can probably contact them and ask. I do know one of our clients uses Copper to stake with us. (reply to 39626)

Ka: got it. let me contact copper to figure out this  thank you (reply to 39627)

— 2023-12-16 —

Mike Row Soft: guide on how to install toncli on windows 11 https://medium.com/@nft-lover/how-to-install-toncli-on-windows-11-fe021aee8c3f

Maksim: try another liteserver (reply to 39573)

MonoBit: Is there any onchain example for NFT Tep64 standard?  I mean onchain meta data implementation.

&rey: Onchain attributes don't exist, metadata does. Examples are somewhere in this chat. (reply to 39632)

Anthony: An updated tutorial for the liteserver installation is available now. Thank you everyone in the TON Developer Community for the feedback. (forwarded from TON Dev News)

Farrukh: Greetings  Together with the team, we began to develop an “observer” of transactions in the TON network  A little off-topic When observers wrote on the ETH, BTC and TRX networks, the basis of the logic was block scanning. By scanning the blocks, we went through the transactions in them and, according to the business log, parsed the wallets that participated in these transactions. Accordingly, if we found wallets in transactions that interested us, we sent various alerts.  Now we started studying the TON network and found that this approach (as if) would not work here  Business requirement: When funds arrive in wallets (there can be more than 10 million), send notifications about a new transaction  Question: Is it possible, just like in other blockchains, to scan blocks in the TON network?

Чионг: Let the audit department take care of how much money to transfer. Our community has a lot of work to do, not just waiting for 10 million.

Чионг: Remember one thing, everything can be fixed but the community needs to have enough resources.  Take advantage of what everyone has.

— 2023-12-17 —

CryptoBrasil: Hello, I was trying to compile my solidity smart contract with the TONDev tool in Visual Studio Code but it gives me the following error when trying to compile: Downloading from https://binaries.tonlabs.io/solc_0_72_0_win32.gzError: Download from https:/ /binaries.tonlabs.io/solc_0_72_0_win32.gz failed with 404: Not Found  Does anyone know why? Or is there a more updated way to compile and deploy solidity in TON?

Mehdi: As far as I know , everything on network is public and accessible for anyone, yes TON has different approach , and need a bit more time investing how this system works and how needed data extraction should be addressed . you can start from here (reply to 39636)

Maxwell: What's the best practice to find out whether my external msg trigger txs onchain status?

User<6869304807>: Het there , any ton dev who wants to join our team for building educational platform with ton connect and web app?

Creature: Hello. @Gusarich Are you there?

Aydin: IMHO, the best practice should include  (but not necessarily limited to) the following:  1. Make the system composable by separating the external messages from the rest, and let the wallets handle the externals. This way, other non-wallet contracts won't have to take care of the off-chain issues.  2. Following an external message,  let the wallets send some "trigger" internal messages to other relevant contracts which contain the rest of the business logic.  3. This way, tracking the external-to-internal triggers becomes much easier by monitoring the internal trigger messages from the wallets to the non-wallets. (reply to 39645)

— 2023-12-18 —

Lff: Guys, are there any developers here, those who work with the official bridge to Ton?

Tek Raj: Mnemonic is required to get the public and secret keys. Can the public key (buffer value) be obtained from a simple wallet address without a mnemonic key? I don't require the secret key.

Faker: root@ip-172-26-0-175:/mnt/btc_node_disk/ton_node# mytonctrl [warning] 15.12.2023, 19:13:17.113 (UTC)  <MainThread>  The config file is broken local.db: {'config': {'logLevel': 'info', 'isLimitLogFile': True, 'isDeleteOldLogFile': False, 'isIgnorLogWarning': False, 'isStartOnlyOneProcess': True, 'memoryUsinglimit': 50, 'isLocaldbSaving': False, 'isWritingLogFile': True}} [debug]   15.12.2023, 19:13:17.122 (UTC)  <MainThread>  Thread self_test started [debug]   15.12.2023, 19:13:17.123 (UTC)  <MainThread>  Thread write_log started [info]    15.12.2023, 19:13:17.123 (UTC)  <MainThread>  Start program /usr/src/mytonctrl/mytonctrl.py Welcome to the console. Enter 'help' to display the help menu. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings")

Faker: how can i fix this error when i try to run a ton node ?

Anthony: https://docs.ton.org/participate/run-nodes/full-node#validator-console-is-not-settings (reply to 39664)

nick: LITE_SERVER_NOTREADY: block is not applied

nick: Anybody encountered this? What is the reason why it often occurs?

Roman: https://docs.ton.org/participate/run-nodes/full-node#what-does-block-is-not-applied-mean (reply to 39667)

nick: Thank you. (reply to 39669)

LouiS 💠 📦 | Drops💧 🐾 🍅 🦴 Meshchain.Ai ️✨ Starsfi: When will there be a Toncoin airdrop?

F: Never (reply to 39671)

Speculator: How can i get my bag id for testnet

Mehdi: I remember , a interview which said , TON is community driven project , by participating and bring value into it you will earn TON,I forget where this interview was , but nowadays there are program running ,do the same (here for example ).I think this is better than air drop, but I am curious knowing you and others point of view. (reply to 39671)

Mehdi: Would you please bring its source?Any reference will be highly appreciated! (reply to 39672)

&rey: This claim is the primary source)  At least, if TON decides to hold an event, it would be announced in advance. (reply to 39676)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Your view of airdrops is different from others, but thanks for share (reply to 39675)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://testnet.tonscan.org/address/YOUR_MAINNET_ADDRESS  or go to the https://testnet.tonscan.org and input your mainnet address in the input box (reply to 39673)

yi: hi, how to get the tx hash after transaction submitted using ton sdk or other js lib?

TON Answers Bot (not AI): Withdraw fee coverage from Vitali Kachan  Hi there.  In my app I allow deposit and withdraw some Jetton. I would like to implement withdrawal in such way that user compensate transaction fee (something like 0.05 TON for Jetton transfer). I have several ways to implement it using tonSDK like: - ask transfer 0.05 TON to may wallet and then send Jettons - as Jetton has fixed rate to ton - convert fee to Jetton and take it from withdrawal - add some entity like withdrawal token - user buy some withdrawal tokens amount and then can use it to withdraw Jetton.  But I feel it could be done simpler, like built in feature or may be some well know smart contract, but I'm quite new it this topic.  Could you suggest me something?  🔗 Answer on TON Overflow

LouiS 💠 📦 | Drops💧 🐾 🍅 🦴 Meshchain.Ai ️✨ Starsfi: How to earn TonCoin? (reply to 39675)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: using your client sdk:  utils  export const getTxHash = (   tx: SendTransactionResponse,   encoding: BufferEncoding = 'base64', ): string => {   return Cell.fromBoc(Buffer.from(tx.boc, 'base64'))[0].hash().toString(encoding); }; usage: import { getTxHash } from "./PATH/TO/utils";  const tx = await connector.sendTransaction({ your transaction body });  const txHash = getTxHash(tx); (reply to 39683)

yi: I use ton core, let tx = await contract.sendTransfer  but the tx is empty  https://github.com/ton-core/ton

Mehdi: https://t.me/toncontests/150 (reply to 39685)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: contract.createTransfer seems it's a contract wrapper function. you have to send it via an client provider and a sender, then you can get tx  https://github.com/ton-connect (reply to 39688)

Mehdi: This repository has been deprecated and is no longer actively maintained. We have moved our project to a new repository, which you can find here: ton-org/ton. The new NPM package is available here https://github.com/ton-org/ton (reply to 39688)

yi: How to get the tx hash If I use the sendTransfer?  import { TonClient4} from ‘ton’ let transfer = await contract.sendTransfer({   seqno,   secretKey: keyPair.secretKey,   messages: [internal({

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: it's depended on sendTransfer returns. did you collect the TransactionResponse in your sendTransfer method? did you passed it to the return object? if so, you can get it via transfer.tx or whatever you named (reply to 39692)

Creature: Hello @Gusarich

Mikhail: Hello everyone, could someone please drop some testnet coins? UQD2MBkPb83l-rtAkmUIPdIe11I0keI9bxkncNE7ul_P1wRh reached limit in bot

yi: do you know how to collect the TransactionResponse (reply to 39693)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: const tx = await provider.sendTransaction({ your transaction body });  return {     ...     response: tx  } If you want my help with workable code you have to share your sendTransfer code (reply to 39697)

yi: The code is below, but the tx is empty after sendTransfer.  import { WalletContractV4, beginCell, internal, TonClient4, toNano, Address } from 'ton';  const packed_msg = beginCell().store(             storeMsg({                  $$type: MSG_TYPE,              }),         )         .endCell();   const tx = await contract.sendTransfer({           seqno,           secretKey,           messages: [             internal({                   to: this.contractAddress,                   value: gasFee: toNano('0.02'),                   body: packed_msg,              }),           ],       });

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I said sendTransfer code and valid one. this is not valid.      // create client     const client = new TonClient({         endpoint: 'https://toncenter.com/api/v2/jsonRPC',         apiKey: 'YOUR_API_KEY'     });      // get sender     let workchain = 0;     let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));     let secretKey = keyPair.secretKey;     let wallet_contract = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });     let my_wallet = client.open(wallet_contract);     let seqno: number = await my_wallet.getSeqno();     // send and get TX    // your code from prv msg     const packed_msg = beginCell().store(               storeMsg({                   $$type: MSG_TYPE,               }),          )          .endCell();     await my_wallet.sendTransfer({             seqno,             secretKey,             messages: [              internal({                     to: this.contractAddress,                     value: gasFee: toNano('0.02'),                     body: packed_msg,               }),             ],         });      // get transactions from API     let transactions = await client.getTransactions(my_wallet.address);     console.log(transactions);  you can use blueprint to run your scripts with built-in providers or if it's a web app you should use tonconnect sdk (reply to 39699)

Plini: Hello. I am building a telegram  betting bot. In this case an agregator of liquidity. I want to use the ton blockchain.  However I don´t find any decentralized bookmakers that use ton blockchain. Where I can use to get the liquidity to my telegram bot.  Anyone have any sugestions, of how can I do it? For me to be able to build on ton blockchain?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you need related contracts on TON and wrappers to be used in the client, it doesn't matter what the client is (TG bot in your case) and what the contract logic is (in your case bet) (reply to 39702)

Plini: Ok thanks Hitasp. I will look at it. (reply to 39705)

— 2023-12-19 —

yi: I use the getTransactions before, but can’t find the field of txId, and how to make sure the latest transaction is the one we are looking for if it’s a tx list. (reply to 39700)

yi: I figured out how to solve it. Thanks

Howard: hi  I remember we can succesfully decode the NFT content_data from Cell data type back to URL String right?

Howard: as here (reply to 39710)

Howard: Similar with:  console.log(theCellData.toBoc().toString("hex")); (reply to 39711)

Tim: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md (reply to 39711)

Howard: oh, yeh. I need more fish oil tho (reply to 39714)

Howard: but I am confusing in here:  when I run:     const OFFCHAIN_CONTENT_PREFIX = 0x01;     const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";     let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();           console.log(newContent.toBoc().toString("utf8")); (reply to 39716)

Howard: I will get the error wired code string in the begining and the end. (reply to 39717)

Howard: 🧐 (reply to 39717)

Howard:          console.log(newContent.beginParse().skip(8).loadStringRefTail().toString()); (reply to 39717)

Howard: I think my problem is because the beginCell() also have some bits there. (reply to 39717)

One | Blockdaemon😈: Hey is there anyone who successfully changed the working directory of mytonctrl and validator.service?

One | Blockdaemon😈: Also I'd like to know what to do when ===[ Local validator status ]=== is missing (when typing mytonctrl and status)? (reply to 39724)

Falco: Easiest would be to create a symlink I think (reply to 39724)

Falco: Can you send a screenshot? (reply to 39725)

One | Blockdaemon😈: I got this first then right after tried again then got this

Falco: For this, just try again yea (reply to 39728)

Falco: What does status fast show you? (reply to 39729)

One | Blockdaemon😈: Now I got this. (reply to 39730)

One | Blockdaemon😈: What depends the display of  ===[ Local validator status ]===?

One | Blockdaemon😈: Is it the only way to uninstall.sh then re-`install.sh` for fixing this?

Falco: How did you install it?

Falco: Try with full flag using the mytonctrl installer

One | Blockdaemon😈: Following this guide https://docs.ton.org/participate/run-nodes/full-node   wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh sudo bash install.sh -m full -d (reply to 39736)

Falco: That should be okay. Although I think the -d flag doesn't work.

Falco: You can try uninstall and then install again using -m full (remove -d)

One | Blockdaemon😈: But as you can see it doesn't work. (reply to 39739)

One | Blockdaemon😈: Got it I'll try. Do you recommend to erase all the existing directories also? (reply to 39740)

One | Blockdaemon😈: Or just use uninstall.sh?

Falco: You can try uninstall yes

Tek Raj: Mnemonic is required to get the public and secret keys. Can the public key (buffer value) be obtained from a simple wallet address without a mnemonic key? If yes, how can I get it?

Speculator: No (reply to 39745)

&rey: Only if wallet is deployed. You'll have to read public key from contract storage. (reply to 39745)

F: Something went wrong during installation and the step of creating/assigning a validator wallet was skipped. Check that the validator wallet has been created (wl). If not, create it (nw). Also check that the validator wallet is specified (get validatorWalletName). If not, set it (set validatorWalletName validator_wallet_001) (reply to 39725)

F: This error means that the local node is not yet synchronized and public nodes are being used. Public nodes do not always respond and end up with a timeout error. The solution to the problem is to wait for the local node to synchronize or execute the same command several times before execution. (reply to 39728)

Mehdi: what do these x meaning ?

Mehdi: xxxxxxx Opcode!?

TON technical overview: it is the way to keep width in MD tables (reply to 39755)

Amir Hafez: Hello, I have some currency Tons of wallets  Fragment I made an impression But this money is completely lost. can someone help me

Amir Hafez: I want to return my money, can anyone help me?

&rey: Blockchain transactions can't be cancelled. Please contact Telegram support for manual check what went wrong. (reply to 39759)

Amir Hafez: I don't know exactly which wallet this money went to. And there is no trace of it. Telegram support does not answer (reply to 39760)

NIU: HI

NIU: I have seen TON arrive on the chain, but why don’t I see it in my wallet?

Creature: @Gusarich  are you there?

saul: In a validator node or full node setup, if the SSD is 1TB NVMe, does it matter if it is raid0 or raid1?

Falco: Shouldn't matter (reply to 39765)

Falco: You can also do without raid

Anthony: If there is a choice between raid0 and raid1, then it is a choice between speed and reliability. A server administrator himself must make decisions in such matters. (reply to 39765)

Sam: In the updated docs (https://docs.ton.org/participate/run-nodes/full-node), traffic is quoted at 16 TB/month. Is that inbound, outbound, or combined?

Yoyo: Hi everyone! I think I found a bug in the wallet v4 contract. I tried to send myself some ton (just an experiment) and I get two out actions instead of one out and one in  here is my ton scan link - https://tonscan.org/address/EQDLHPb7j6Udm2uQQnnPnC0nmtsC3PUw16rq8rOi0BEltXgb

— 2023-12-20 —

Dirk: Hey guys, how do I create a wallet or how can I get a TON address that starts with UQD?  Reason I ask this is that an exchange (blockchain) doesnt appear to recognise addresses starting with EQD.

Creature: Hi. @gusarich

&rey: ton.org/address has converter. (reply to 39772)

&rey: Bug is in tonscan: there are rows both for sending and receiving messages, but both are shown as outgoing. (reply to 39771)

Tek Raj: Is there an example of how to do this? (reply to 39747)

Howard: why these 2 represent different Cell Value?           .storeRef(beginCell().storeStringRefTail(forward_payload).endCell())  versus    .storeStringRefTail(forward_payload)

&rey: tonapi.io provides relevant API endpoint. (reply to 39778)

Yuri: The first one stores a reference to an empty data cell with one reference containing the string, the second stores the string as a reference. (reply to 39779)

Howard: seems in Tact we can't decode the second one properly, let me check! (reply to 39782)

Anthony: Combined (50/50) (reply to 39770)

Lucas: Is it mandatory to have an address starting with UQ now?

Lucas: Does the previously generated EQ address need to be upgraded?

&rey: Services may require it to avoid confusion. It's worth noting that address update isn't reflected in blockchain at all. (reply to 39786)

ston: How can I set Tokens to Mint in Jetton metadata? :)  https://github.com/ton-blockchain/minter-contract

&rey: They aren't set there! Rather you mint the required amount and revoke admin rights. (reply to 39789)

The team is working: How to connect to Ton wallet with web3j?

The team is working: Web3j web3j = Web3j.build(new HttpService("WHAT SHOULD PLACE HERE？"));

The team is working: what is the endpoint?

Howard: https://ton-community.github.io/tutorials/01-wallet/ (reply to 39792)

The team is working: thx

Bear: do we have example about Blueprint?    deploy_result.transactions[1].inMessage?.body;

Sam: If average load is expected to be 100 Mbit/s, how is there only 16TB per month of traffic expected? On a 30 day month, 100 Mbit/s avg would be 32.4 TB in a month (reply to 39785)

𝐴𝑅𝐸𝐹 𝑆𝑆: 🥲🥲🥲 (reply to 37741)

Anthony: Traffic is not always the same (reply to 39799)

Light: How do I set a Ton account name for my own address?

Sam: Yeah, but average means average... (reply to 39801)

Anthony: Oh, I got you point. Let me check (reply to 39803)

Sam: Thanks! (reply to 39804)

Light: Does anyone know? (reply to 39802)

Anthony: https://github.com/catchain/address-book (reply to 39802)

Denis: it was screenshot from tonviewer and you gave link to tonscan address book (reply to 39807)

Light: ok， thanks (reply to 39807)

Anthony: I'm looking for the same repo for tonviewer at this moment (reply to 39808)

Denis: github.com/tonkeeper/ton-assets

Light: Thank you very much (reply to 39811)

The team is working: I find 2 address ,one is "Bounceable",anther is "Non-bounceable" (reply to 39812)

The team is working: there's no problem yet

Mehdi: In context of TVM , we can access to 3 type of instruction,  third was those which address outside of actor registry and incoming message,  I know it would be cell and cell hash can be used as something like index ,to bring it to context,  but I don't know where this Cell reside? Is it on master chain ? At the end we should have a database mechanism to find those instruction and bring them in scope. Anybody can help?

Mehdi: Why this question is important,  because in smart contract that have huge usecase , like wallet by using this technique we can reduce storage fee significantly,  like v5 of tonkeeper, in their repo , they said we used shared library,  in master chain . But I don't know how they did that , and which process should be carried out to have this facilities.  Database concepts in TON ,  and how they really works is hard to grasp . Block , smart contract , have id , but what about something like library or specefic cells?

Speculator: how can i compile and deploy func without blueprint from frontend

Mehdi: There are some library that can communicate with network , for deploy contract you need access to code and its data , all data structure in TON is made of Cell , you can find how transfer your smart contract to data structure  and deploy them with those library or SDK ,we have ts,go,py, kotlin among other , of course blueprint itself depend on those library ,

Mehdi: https://github.com/ton-community/awesome-ton (reply to 39818)

Speculator: i want to deploy jetton collection contract

Speculator: is there any sample code to do it?

Speculator: In blueprint i compiled jetton collection contract, the value comes:  first time:  x{FF00F4A413F4BCF2C80B}  x{62_}                                                                                                                                       x{CD}    x{D10638048ADF000E8698180B8D848ADF07D201800E98FE99FF6A2687D20699FEA6A6A184108349E9CA829405D47141BAF8280E8410854658056B84008646582A802E78B127D010A65B509E58FE59F80E78B64C0207D80701B28B9E382F970C892E000F18112E001718119026001F1812F82C207F9784_}     x{3502D33F5313BBF2E1925313BA01FA00D43028103459F0068E1201A44343C85005CF1613CB3FCCCCCCC9ED54925F05E2}     x{357003D4308E378040F4966FA5208E2906A4208100FABE93F2C18FDE81019321A05325BBF2F402FA00D43022544B30F00623BA9302A402DE04926C21E2B3E6303250444313C85005CF1613CB3FCCCCCCC9ED54}     x{01FA40304144C85005CF1613CB3FCCCCCCC9ED54}    x{2_}     x{2_}      x{007232CFFE0A33C5B25C083232C044FD003D0032C0326_}      x{3E401D3232C084B281F2FFF2742_}     x{45AF0047021F005778018C8CB0558CF165004FA0213CB6B12CCCCC971FB00}   x{2_}    x{2_}     x{B8B5D31ED44D0FA40D33FD4D4D43010245F04D0D431D430D071C8CB0701CF16CCC9}     x{2_}      x{B5DAFDA89A1F481A67FA9A9A860D883A1A61FA61FF48061_}      x{B4F47DA89A1F481A67FA9A9A86028BE09E008E003E00B_}    x{BC82DF6A2687D20699FEA6A6A182DE86A182C4_}   second time:  x{FF00F4A413F4BCF2C80B}  x{62_}   x{CD}    x{D10638048ADF000E8698180B8D848ADF07D201800E98FE99FF6A2687D20699FEA6A6A184108349E9CA829405D47141BAF8280E8410854658056B84008646582A802E78B127D010A65B509E58FE59F80E78B64C0207D80701B28B9E382F970C892E000F18112E001718119026001F1812F82C207F9784_}     x{3502D33F5313BBF2E1925313BA01FA00D43028103459F0068E1201A44343C85005CF1613CB3FCCCCCCC9ED54925F05E2}     x{357003D4308E378040F4966FA5208E2906A4208100FABE93F2C18FDE81019321A05325BBF2F402FA00D43022544B30F00623BA9302A402DE04926C21E2B3E6303250444313C85005CF1613CB3FCCCCCCC9ED54}     x{01FA40304144C85005CF1613CB3FCCCCCCC9ED54}    x{2_}     x{2_}      x{007232CFFE0A33C5B25C083232C044FD003D0032C0326_}      x{3E401D3232C084B281F2FFF2742_}     x{45AF0047021F005778018C8CB0558CF165004FA0213CB6B12CCCCC971FB00}   x{2_}    x{2_}     x{B8B5D31ED44D0FA40D33FD4D4D43010245F04D0D431D430D071C8CB0701CF16CCC9}     x{2_}      x{B5DAFDA89A1F481A67FA9A9A860D883A1A61FA61FF48061_}      x{B4F47DA89A1F481A67FA9A9A86028BE09E008E003E00B_}    x{BC82DF6A2687D20699FEA6A6A182DE86A182C4_}

Speculator: the cell looks similar so can i use this same cell to deploy contract from frontend?

www: 有没有不实名买ton的渠道

Laoli: usdt

Laoli: 就tg钱包

— 2023-12-21 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Jetton collection? 🧐 Wdym? A set of jettons? Or jetton master? Do you look for a simple way? Add blueprint package and code the deploy script, or start from this simple code: (prerequisites to send a msg) https://t.me/tondev_eng/39700 (reply to 39821)

ston: Is text inscription possible on TON now?

User<6085560929>: can anyone here help me?

User<6085560929>: i need to fetch all the telegram usernames that a ton address has

User<6085560929>: i dont know how

ston: How can I get comments included in each transaction? 🤔️️

User<6085560929>: bro

User<6085560929>: does anyone know

User<6085560929>: how to transfer an nft with

User<6085560929>: await tonConnectUI.sendTransaction

User<6085560929>: plz

&rey: Use tonapi.io or dton.io/graphql to list all NFTs of the ✈️ usernames collection. (reply to 39833)

User<6085560929>: i need to prompt transfer (reply to 39841)

User<6085560929>: im using https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js

&rey: What API do you use to get transactions? (reply to 39835)

&rey: Form transfer body as in https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102 (reply to 39842)

User<6085560929>: in frontend?

User<6085560929>: msgBody.bits.writeAddress(params.newOwner)

User<6085560929>: is this the address i wanna transfer to

User<6085560929>: ReferenceError: Cell is not defined     at HTMLButtonElement.<anonymous> (market.js:62:30)

&rey: Please try to combine your thoughts into one message.  What lib do you use for working with cells?

User<6085560929>: https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js

User<6085560929>: after this i want to prompt the nft transaction

User<6085560929>: im using tonconnect

User<6085560929>: my goal is to transfer this nft

User<6085560929>: but i want to do all this in the frontend

User<6085560929>: ReferenceError: beginCell is not defined which script do i add to my frontend to define it?

&rey: @ton/ton (reply to 39875)

User<6085560929>: can you please provide me with the cdn link

User<6085560929>: i dont use react

&rey: https://unpkg.com/@ton/ton@latest/dist/index.js

User<6085560929>: Uncaught ReferenceError: exports is not defined     at index.js:19:23 (anonymous) @ index.js:19  ReferenceError: beginCell is not defined     at HTMLButtonElement.<anonymous> (market.js:71:16)

User<6085560929>: is it broken

User<6085560929>: @pcrafter can you transfer nft without begincell

&rey: Please check out TonWeb then; it should work with JS fine. docs.ton.org/ contains a cdn link and usage examples.

ston: https://tonapi.io/ this one. or can you recommend one? :) (reply to 39844)

Speculator: what is the use of tonProof??

Speculator: in tonconnect/ui-react ?

&rey: Please check out relevant article: https://docs.ton.org/develop/dapps/ton-connect/integration#logging-out-and-requesting-tonproof. (reply to 39885)

&rey: On frontend, it generally has no use.

&rey: Doesn't decoded_body contain the comment? (reply to 39884)

ston: Great! Then how can I index TON-20? Should it use GET API for all transactions?  {     "p":"ton-20",     "op":"mint"     "tick":"nano",     "amt":"100000000000" } (reply to 39889)

Anthony: https://docs.ton.org/develop/dapps/ton-connect/react#optional-check-ton_proof-on-the-backend (reply to 39885)

Alexey: Hi! Can anyone suggest resources about development defi projects for TON?

Mehdi: Doc site has dedicated dir , also check awesome ton repo (reply to 39893)

Ken: In Tact this function fun my_func2(x: Slice): Int {         let y: Int = x.skipBits(8).loadUint(8);         return y;     } gives error Func compilation error: lvalue expected before ~load_uint       int $y = $x~skip_bits(8)~load_uint(8); Why is that?

美妞爱化妆（卖TRX、卖能量、卖机器人、卖888、）: 有一些交易所就可以 (reply to 39826)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: fun my_func2(x: Slice): Int {     x.skipBits(8);     // solution #1     let y: Int = x.loadUint(8);     return y;     // solution #2     return x.loadUint(8); } (reply to 39895)

Tek Raj: Is there any Oracle or any API that I can use to fetch the USD price of jettons?

Jeff: Is verifier.ton.org dead?

Andrey: The TON Development plugin is back on JetBrains Marketplace  After temporary suspension and 1-month negotiations, the TON Development plugin returns to the marketplace. The JetBrains team changed the pluginID, so it's necessary to reinstall it from the marketplace.  Update instructions: 1. Remove the old version 2. Restart WebStorm (or IDE you use) 3. Install the new version  Click here to access the plugin. (forwarded from TON Dev News)

Speculator: how can i store a cell in ts?

Speculator: x{FF00F4A413F4BCF2C80B}  x{62_}                                                                                                                                       x{CD}    x{D10638048ADF000E8698180B8D848ADF07D201800E98FE99FF6A2687D20699FEA6A6A184108349E9CA829405D47141BAF8280E8410854658056B84008646582A802E78B127D010A65B509E58FE59F80E78B64C0207D80701B28B9E382F970C892E000F18112E001718119026001F1812F82C207F9784_}     x{3502D33F5313BBF2E1925313BA01FA00D43028103459F0068E1201A44343C85005CF1613CB3FCCCCCCC9ED54925F05E2}     x{357003D4308E378040F4966FA5208E2906A4208100FABE93F2C18FDE81019321A05325BBF2F402FA00D43022544B30F00623BA9302A402DE04926C21E2B3E6303250444313C85005CF1613CB3FCCCCCCC9ED54}     x{01FA40304144C85005CF1613CB3FCCCCCCC9ED54}    x{2_}     x{2_}      x{007232CFFE0A33C5B25C083232C044FD003D0032C0326_}      x{3E401D3232C084B281F2FFF2742_}     x{45AF0047021F005778018C8CB0558CF165004FA0213CB6B12CCCCC971FB00}   x{2_}    x{2_}     x{B8B5D31ED44D0FA40D33FD4D4D43010245F04D0D431D430D071C8CB0701CF16CCC9}     x{2_}      x{B5DAFDA89A1F481A67FA9A9A860D883A1A61FA61FF48061_}      x{B4F47DA89A1F481A67FA9A9A86028BE09E008E003E00B_}    x{BC82DF6A2687D20699FEA6A6A182DE86A182C4_}

Speculator: above is my cell how can i store it?

Speculator: How to store the above compiled Cell in ts variable?

Speculator: Is there any way to do it?

User<6070467562>: Добрый день ! Можно ли за счет LP как то чеканить новые жетоны ?

&rey: Please use @tondev chat for Russian. (reply to 39906)

Howard: how to work through the time in Local Sandbox tho?

Howard: OK, I found.

Adrian Woźniak DW: Hi, can I find a link somewhere where I can try to work in TON Smart Challenge #5 step by step?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://github.com/ton-community/tsc5 read the README, contains everything you need (reply to 39911)

Q: Hey guys, i'm new to TON apps, i've been thinking in building a whole ecosystem to my product, can someone with more experience help me through this?

Q: I would reward for that

Q: and it's flutter related btw

Adrian Woźniak DW: What are the node requirements? (reply to 39912)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: wdym? tasks repository is using a dev tools named blueprint, which is build on TON's dev libraries to simulating  TON chain. details available in README. (reply to 39916)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: at all, you need an IDE and nodeJS to building goods on TON, you can use TON extension for vscode, webstorm or IntelliJ (reply to 39916)

Adrian Woźniak DW: There is a chance to somehow fix the fact that you don't have Telegram premium. Because I can't collect 100k points because I first entered the application and then set up Premium Telegram

Adrian Woźniak DW: How to set up your squad? Just post your link to your own community on Telegram?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this has nothing to do with the discussion topic of this group (reply to 39922)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Hello, I have a question... I was reading the documentation of the function but I don't understand very well... How do I get the data that is inside a slice that has 3 uint values inside?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: var value1 = slice~load_uint(size_value_1); var value2 = slice~load_uint(size_value_2); var value3 = slice~load_uint(size_value_3); (reply to 39926)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: And I have to get the 3 values ​​to access them... Mmmm... I can't access the last one without getting the first value? (reply to 39927)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: no, but you can skip those: slice~load_uint(size_value_1); slice~load_uint(size_value_2);  var value3 = slice~load_uint(size_value_3); (reply to 39928)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Thank you so much (reply to 39929)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: no, to read them, you have to write them again if you make changes, var (value1, value2, value3) = (slice~load_uint(8), slice~load_uint(32), slice~load_uint(32)); value1 += 2; set_data(            begin_cell()              .store_uint(value1, 8)              .store_uint(value2, 32)              .store_uint(value3, 32)            .end_cell()           ); (reply to 39928)

— 2023-12-22 —

botmother: anyone getting this issue on testnet?

Alexey: Hello! Can someone guide me (preferably to the code)?  I want to implement the ability to deposit USDC and issuing pool tokens

Karen: Hello everyone, Is it possible to mint ton's jetons with ReactJS?

Karen: If yes, please provide me some documentation about it

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: React is a UI library. You have to learn TON programming languages. Also you can mint using minter.ton.org without coding. (reply to 39934)

Erfan: React is a library, no framework. (reply to 39936)

User<6476603919>: Hello

Howard: how Collection contract generate more than 4 txs at same time?

Karen: I want to integrate our web project... (reply to 39936)

Slava: every contract can generate up to 255 out txs at the same time (reply to 39939)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You should spend some time on learning basics and one of TON programing languages (reply to 39940)

Karen: So now it is not possible to implement it with React? I need to  implement only the front-end part. (reply to 39942)

Karen: I am new in this area, and if I said something strange things, don't worry 😂

Anthony: Check this repository: https://github.com/ton-blockchain/minter https://minter.ton.org/ (reply to 39943)

Karen: Thanks 👍 (reply to 39945)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You can mint it without coding on ton, then you can add ton's tools, libraries and SDKs in your react app (reply to 39943)

Karen: Thank you very much 👍

User<6070467562>: How mint lp- new jettons ?

User<6070467562>: Any send me GitHub ?

Light: You can get it manually and then use fixed parameters (reply to 39951)

User<5278494102>: Hello devs, please help me!, is this wallet scam? i use this wallet and not working because its feature to make many wallet like metamask 🥹 Tonic wallet i cant move my fund from that when i try to move my fund it said Insufficient balance but i have 3 ton i create many wallet with one mnemonics. all same mnemonics. but all different private keys. and my fund in the second private keys  anyone please help me This is the wallet https://chromewebstore.google.com/detail/tonic-wallet/dlneijncmlmjbgemhibopgljcmndjfde  please help me 😩

Light: You ignored the transfer gas fee (reply to 39954)

User<5278494102>: how to send it??

User<5278494102>: i have 3 ton :(

Light: This is UP， not TON (reply to 39957)

Light: You can try 2.9 (reply to 39958)

User<5278494102>: is it different? is it use ton fee to send any token like up? (reply to 39960)

User<5278494102>: why use fee up?

Light: As long as you are trading on Ton Network, you need Ton (reply to 39962)

User<5278494102>: why cannot send it? i tought it uses ton fee to send UP, (reply to 39964)

Light: send your wallet address (reply to 39966)

User<5278494102>: EQAF1ytxZt0iavVoRkLQX00oTCQP8P9CzSaB0IlQC2DtzozW (reply to 39967)

Light: Address EQAF1ytxZt0iavVoRkLQX00oTCQP8P9CzSaB0IlQC2DtzozW   Balance 3.000999748 TON ≈ $7.03 Last activity 1 hour ago State Inactive (reply to 39968)

User<5278494102>: Yes (reply to 39969)

Light: It looks like your TON should be enough for transfer. I have not used UP coins, maybe it is different. (reply to 39968)

User<5278494102>: ill try send 10 ton (reply to 39971)

User<5278494102>: ah it works, thanks mate hahahaha, sorryy 🤣🥹🥹 you save my day (reply to 39971)

Light: 😁 (reply to 39973)

Robin: https://tonviewer.com/transaction/fbce5ee697bbea43fbe14934d941fa02ee7fbe5bdacbeff3b736758217434198  Why was my transaction bounced? who can help me

Robin: Why was my transaction bounced? who can help me

Speculator: in ton blueprint we use provider.open() but if i want to use in frontend what client.open() is not working. what is the alternate of provider.open()

Speculator: for using in forntend

Speculator: provider: NetworkProvider

Anthony: https://docs.ton.org/learn/overviews/addresses#bounceable-vs-non-bounceable-addresses (reply to 39976)

Robin: How to solve it

Anthony: Active account or use non-bounceable addresses (reply to 39981)

Anthony: https://ton.org/address/ (reply to 39982)

Robin: EQC6MW-m-ZY4jR6aI0iAFhC84q4l5M4srnii6wFYXQDegAY6  EQC6MW-m-ZY4jR6aI0iAFhC84q4l5M4srnii6wFYXQDegAY6

&rey: Please check your address in an explorer like https://tonscan.org. If there is zero money, the wallet is definitely scam. If not, you may be able to use its mnemonic words in another app. (reply to 39954)

Robin: Which one should I use, thanks

User<5278494102>: Is there any wallet that can support private key. Because tonic wallet give me all pharases to all wallet. But different private keys (reply to 39987)

Robin: Is that okay?

Speculator: in ton blueprint we use provider.open() but if i want to use in frontend what client.open() is not working. what is the alternate of provider.open()   for using in forntend provider: NetworkProvider

Speculator: is there nay similar way?

User<5278494102>: This is the example of private key, this private key has 0 balance. except this wallet. what wallet can work with import this kind of private key? 😢 (reply to 39987)

&rey: I've heard Trust Wallet can, as well as mytonctrl (app for running validators). (reply to 39994)

User<5278494102>: invalid mate (reply to 39995)

Robin: Or no transfer?

Ali: Hello friends, I'm currently learning the FunC language. I wanted to know exactly what this language does and what it is used for.

&rey: It's compiled into TVM assembly which is held by smart contracts, executed upon incoming message. (reply to 39999)

Mridul: what is the link of github repo for Ton Smart Challenge 5? the bot is not providing the link

Coalus: https://github.com/ton-community/tsc5 (reply to 40012)

Mridul: thank you @coalus

Adem: Hi

P: всем привет? есть русскоязычный чат?

— 2023-12-23 —

Ruslan: https://t.me/tondev

Łukasz: What is the intended way to test external messages using jest?

Łukasz: All of the tutorial articles online involve only internal messages, while ContractProvider.external has a completely different signature

ston: https://github.com/ton-blockchain/minter-contract How can I mint Jetton after deployment? 🤔️️️️

&rey: Please check out documentation of protocol you're using. Other that TON is used for recording transactions, it has nothing to do with ton-20. (reply to 40032)

User<2043640623>: What is this?

Łukasz: I keep on getting  Error while executing transaction: External message not accepted by smart contract ... Does someone have an idea what can caue that? I do have a () recv_external(slice in_msg_body) impure function in my func code

ROADTONE: how to know public key from private key?

&rey: Contract decides whether it accepts an external message or not (since *it* pays for the message processing in that case). To do so, it needs to call accept_message(); (reply to 40045)

&rey: You need an Ed25519-implementing library. (reply to 40048)

&rey: Hello! This is chat for helping each other in TON development. Please refrain from offtop; irrelevant messages are deleted. (reply to 40064)

Rasoul: Hello, i hope you are doing well. I need some simple regex to check toncoin address in client side, not for validate address just for simple check to avoid user to make mistake.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: import { Address } from '@ton/ton'; ... console.log(Address.isAddress(userInput)); (reply to 40073)

Rasoul: Well i prefer don't use library (reply to 40075)

&rey: Regexp isn't a good solution because it can't verify the checksum + needs to process HEX addresses as well. (reply to 40076)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: So check how this library verifies the address (reply to 40076)

Rasoul: It's okay, i will check it in backend (reply to 40077)

&rey: let r = /[-_+\/0-9a-zA-Z]{64}/; (reply to 40079)

Rasoul: Tnx a lot bro🙏🏻 (reply to 40080)

User<5480620324>: Салом

&rey: Russian chat is @tondev. Welcome to TON development! (reply to 40101)

Łukasz: Right, it makes sense the contract should decide since it pays the gas. Thanks a lot mate! (reply to 40062)

AmirMohammad: Does anyone know how to see how many shards your blockchain is shardring  into?

&rey: https://tonscan.org/block/latest — Shardchain Blocks (reply to 40109)

Quvondiq: Hi

Bear: anyone know the test-case example in sandbox/

Łukasz: Does the signVerify function from ton/crypto even do the same thing as the check_data_signature function from stdlib.fc (aka the CHKSIGNS opcode)? I'm passing some arguments to the typescript function and it returns true, while passing the exact same arguments to the FunC one gives me 0. I'm starting to go insane lol

Łukasz: cell foo = ...; slice sig = ...; int public_key = ...; ~dump(foo.hash()); ~dump(beginCell().storeSlice(sig).endCell().hash()); ~dump(publicKey); ~dump(check_data_signature(foo.begin_parse(), sig, public_key)) ;; output: ;; 14958472273212761102312855245374534176641636690329907629344371254320793581421 ;; 105954788845813801261573263185191684961403976866544849031773972143771548040151 ;; 79806087239433670144589656222002061570211215345972728698695263431303417654146 ;; 0  const foo: Cell = ...; const sig: Buffer = ...; const public_key: Buffer = ...; console.log(foo.hash().toString('hex')); console.log(sig.toString('hex')); console.log(public_key.toString('hex')); console.log(signVerify(foo.hash(), sig, public_key)); // output: // 0x211231fd9b5c8174c0c798bb512fefa89fdd46b631600d7473f9cfe378baf76d // 0xea404908d119810cabef666d1640bca513a29e7fe98637974c182dc6e50ebbd7 // 0xb070a508820f1ba266d230083a8c163a6a4c454bb9fb39362096bce557a96b82 // true  The decimal numbers the contract prints and the hex numbers the typescript snippet prints are the same values. And yet, one accepts and the other one rejects the signature. wtf?

Łukasz: Oh ok

Łukasz: Cell.hash / cell_hash compute a different hash from the one CHKSIGNS does

Łukasz: That, or signVerify hashes its first argument too. Anyway, replacing foo.hash() with foo.beginParse().loadBuffer(foo_size_in_bytes) worked.

Muhammad Javad: did you find an answer for your question? (reply to 37575)

Muhammad Javad: any solution ? (reply to 37136)

Hamidreza: I understand that the SC must call accept_message. But what does this error actually mean and when is it thrown? Why does it say while executing transaction? is the gas credit used up? (reply to 40062)

&rey: The main part it says is "External message not accepted by smart contract". (reply to 40124)

Hamidreza: I do some validations before accepting the message and they may throw errors. Then in SandBox I tried to identify such errors in transactions. What am I doing wrong? Is it the case that in such settings no transaction is submitted? (reply to 40125)

&rey: Yes, failed external messages don't make it to the blockchain. (reply to 40126)

User<6085560929>: Uncaught ReferenceError: exports is not defined how would i fix in https://unpkg.com/@ton/core@latest/dist/index.js

— 2023-12-24 —

Speculator: in ton blueprint we use provider.open() but if i want to use in frontend what client.open() is not working. what is the alternate of provider.open()   for using in forntend provider: NetworkProvider  is there nay similar way?

MonoBit: Hey guys. Should I expect udict_set to add the key if it does not exist in my dict? Or should I use udict_add if the key is not present in my dict?

Howard: "Why doesn't the initial minting of the Jetton token trigger any notifications?"  Since I tested the new minting Jetton here (https://minter.ton.org/?testnet=true), the strange part is that the admin (owner) does not receive transaction notifications, even on the Blockchain Explorer (for example, TonViewer)   Is it normal?

&rey: Both will add. (reply to 40135)

❤️ FAZLIDDIN❤️: helo

❤️ FAZLIDDIN❤️: May frans

TON Answers Bot (not AI): Nft stuck in safepal wallet. Help me get NFT out of there if I change the private key. from No Name  Hi guys. They sent me NFT to the TON address: EQDCgYOsp7papvk4O2_R1qcrtItnRzeZz-knOb4q7xsI_0so  It turns out that this wallet does not have the functionality to withdraw my NFT to another wallet.  But my address created in the safepal wallet, and you cannot import a mnemonic phrase there, and there is only a secret key.  Is there a way to somehow get my NFT out of there, or is it burned out?  🔗 Answer on TON Overflow

not: hey what is the size of the ton chain stored?

not: trying to figure out if i have the resources to spin up a ton node today

Howard: https://t.me/tondev_zh/19055 (reply to 40227)

not: ty howard. 1 TB i got it locally. was hoping to put it on a vps, do you have a rough estimate of current size and growth rate? (reply to 40228)

𝙼𝚒𝚛𝚘𝚜ւ𝚘𝚟𝚎: https://tonviewer.com/transaction/7211f765311a9f8365c39b47513bb7768fda1925497bd2ce42f67ca363bc8f47

𝙼𝚒𝚛𝚘𝚜ւ𝚘𝚟𝚎: Why the error

Howard: check your source code, there has the error code (reply to 40231)

𝙼𝚒𝚛𝚘𝚜ւ𝚘𝚟𝚎: It says on the Internet that this can happen due to a “disconnection” of the smart contract (reply to 40233)

Dmitry | backend4you.ton: it says OpCode = 0xb5ee9c72 what you expected to do by this codee? (reply to 40232)

𝙼𝚒𝚛𝚘𝚜ւ𝚘𝚟𝚎: I have an NFT stuck, I'm trying to send it somehow... (reply to 40235)

Dmitry | backend4you.ton: https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-item-editable-DRAFT.fc  exitcode 0xFFFF (=65535) is throw when NFT recieves "unknown" command. It doesn't understand what you want and fails.

𝙼𝚒𝚛𝚘𝚜ւ𝚘𝚟𝚎: And what to do (reply to 40237)

Dmitry | backend4you.ton: what you WANT to do? (reply to 40239)

𝙼𝚒𝚛𝚘𝚜ւ𝚘𝚟𝚎: So nothing happens, error.... I can't send my nft (reply to 40240)

Dmitry | backend4you.ton: to send NFT to somebody, you should send it command with transfer#5fcc3d14  command

Dmitry | backend4you.ton: what wallet is this? maybe it doesnt support NFT ? (reply to 40241)

𝙼𝚒𝚛𝚘𝚜ւ𝚘𝚟𝚎: С Thank you for your help, but no longer needed, the giveaway is over, that’s why it’s NFT))) (reply to 40243)

— 2023-12-25 —

Zheng: hey, anybody know how to apply for a token of dton.io? thanks

Andrey: Hey! Please use /graphql endpoint, it has 5rps limit (reply to 40252)

Zheng: ok, https://docs.dton.io/dton/usage-limits

Zheng: I am not sure is that the 5 rps shared by globe?

Andrey: It's limit per IP (reply to 40255)

Zheng: ok, that's should be enough for most case, thanks

not: what libs yall use to make wallet not with a mnemonic

not: no python people

not: ?

not: i was using tonos-cli but it didnt have enough words in my mnemonic to be useable in say, tonweb or i forget what else i tried, maybe pytoniq

Keivan: Hi everybody

Keivan: What is the question of telegram competition ?

&rey: You can generate 256-bit private key and feed it into TonWeb/etc. (reply to 40263)

Howard: how can we track the emit log in Sandbox library?

not: yea maybe i'm not feeding it in correctly. i generated wallet with one lib and cannot seem to recreate with a different lib. i am going to start over (reply to 40277)

&rey: https://github.com/ton-community/tsc5/, if I understand question correctly. (reply to 40275)

&rey: Do you specify wallet version explicitly? (reply to 40281)

not: yea. i have my pub and priv key strings and i toss them in a new const WalletClass = tonweb.wallet.all["v4R2"];  const wallet = new WalletClass(tonweb.provider, { publicKey: uintArrayValuePub });   console.log(wallet)  its ok im not a fan of nodejs, i'll probably start over and not use tonos-cli (reply to 40283)

&rey: Unfortunately, I've heard tonos-cli is for Everscale and may be incompatible in some aspects. (reply to 40284)

not: ahhhh (reply to 40285)

not: ty for the heads up

MonoBit: Hi What are you using to pretty print those transactions? (reply to 40278)

Howard: import {     printTransactionFees,     prettyLogTransactions, } from "@ton-community/sandbox";          console.log(printTransactionFees(deploy_result.transactions));         console.log(prettyLogTransactions(deploy_result.transactions)); (reply to 40288)

MonoBit: Thank you very much 🙏 (reply to 40290)

Howard: how to track EmmitLog in Sandbox?   It's shows as this ExternalOut (reply to 40278)

liminal: blockchain.setVerbosityForAddress() (reply to 40278)

Howard: Thanks, but it looks not that human-readable. (reply to 40294)

Behrang: The result returned from sending a transaction has a field called externals. Maybe that can help. (reply to 40292)

miami: gm guys

Howard: awesome (reply to 40296)

Howard: One question: how do we track NFT item information? Let's say it involves scanning and updating the NFT information based on each block transaction, such as listing, selling, transferring status, etc.

Howard: I remember we can use: NFT SDK(https://github.com/ton-community/nft-sdk/tree/main/examples), or using TON API to do so? What else?

Daria: How does the deployment of the contract take place in TON?   For example, contract A sent contract B a message with a state init and body, if the hash from state init matches the address of B, then the contract code from state init will simply be executed with the received message body?

Daria: And what happens if hash of this state_init doesnt matches the address of B?

Behrang: Yeah, mostly.  First, contract will be deployed (if it's not already deployed). That means that code and data are deployed from the state_init.  Then the message will be delivered to the contract. (reply to 40304)

Behrang: The transaction will fail. (reply to 40305)

&rey: Requires testing, in particular regarding frozen contracts. (reply to 40305)

Ken: Could someone refer me to the documentation on how to calculate the checksum in EQ/UQ addresses?

100KMentor: Hi guys,  I am new to ton wallet.   I need help with recovering a token (BLYAT token) sent to my ton wallet address UQAc0z0KhWDrXvDiJ6NP9Wx1GNOjfiGXdCJyWru2fGrQ145A  I can see my token on the ton explorer but no way to access it in ton telegram wallet. I can only see ton, send and receive ton.  I would appreciate any help and guide

100KMentor: I just discovered that there is a ton space and have set up a ton space wallet. I now want to transfer my token from my ton wallet to ton space but the token is not available in ton wallet.  Is there a way to make the token available so that I can transfer it? (reply to 40319)

&rey: @wallet and other custodial services aren't exactly good for working with jettons, you shouldn't send them there in the first place. Maybe support could help you? (reply to 40319)

Vahid: Did you find anything ? (reply to 38995)

Sergey: https://github.com/ton-community/compressed-nft-contract/tree/main there are examples here (reply to 40323)

Тимур: 🥷😠☺☺😭😭😭😭

Тимур: Атаоаиа

User<6085560929>: is it possible to send nfts + balance in one transaction?

User<6085560929>: nfts + ton -> nft

User<6085560929>: would this transaction be possible

User<6085560929>: ?

User<6085560929>: curious, if u can get back to me ty

100KMentor: ok thanks (reply to 40321)

User<6085560929>: hey

User<6085560929>: is it possible to send ton + nft -> nft

User<6085560929>: i ask the user to send ton + nft for my nft on my website

&rey: You can send up to 4 transfers in one external message. They will be received separately, though. (reply to 40328)

User<6085560929>: so it would be possible to do?

User<6085560929>: i need to send 3 nfts + $40

User<6085560929>: for my nft

User<6085560929>: also, can you add a note to the transaction or no? (reply to 40337)

&rey: Yes. You'll need a custom contract accepting those if you want to make it provably secure for user. (reply to 40339)

User<6085560929>: yeah, i wanna do it all in one transaction

&rey: Yes, for each of those 4 transfers. (reply to 40341)

User<6085560929>: and add a comment saying "exchanged 3 nfts + $40 for a new nft"

&rey: TON transaction involves one contract exactly. (reply to 40344)

User<6085560929>: can u show me an example of how a contract would look like in tonkeeper

User<6085560929>: like any contract

&rey: I'm afraid I don't understand. You sort of don't see custom contracts in Tonkeeper? (reply to 40348)

User<6085560929>: my dapp uses tonconnect

User<6085560929>: my goal is to prompt the contract in tonkeeper for them to click confirm and read through

User<6085560929>: how would that look?

&rey: Prompt the what in Tonkeeper? (reply to 40352)

User<6085560929>: the contract that exchanges the nfts + $40 for another nft

User<6085560929>: im trying to make it so that if they pay extra $ they can "upgrade" into a new nft

&rey: Showing that would require me to write the code. I can do so if it is paid. (reply to 40353)

User<6085560929>: ah

User<6085560929>: u got any old pictures of how a contract looks?

User<6085560929>: any at all

&rey: Not a contract (they don't have visual representation) but an emulated message list, sure. (reply to 40359)

User<6085560929>: ah i see

User<6085560929>: wait s

User<6085560929>: so

User<6085560929>: they wont be able to see what they're confirming??

User<6085560929>: but then they won't trust it

&rey: If Tonkeeper works correctly at that exact moment, they will see all assets they send and all assets they receive. (reply to 40365)

User<6085560929>: ah good

Alex: Can you rewrite a smart contract from Solidity to the TON blockchain? (reply to 38878)

Mehroj: Hello

not: does anyone have a suggestion to get libcrypto.so.1.1 available on debian? they started using openssl3 instead of 1.1.1 on debian 12 and im just looking for a place to download that or figure a way to get openssl1.1.1 installed in somewhere else and then move the libcrypto.so.1.1 to my /usr/lib/ does anyone have any suggestions? this is so i can use pytonlib

not: solution was to build newest openssl version 1.1.1 and put the libcrypto.so.1.1 in /user/lib i can make wallets now with pytonlib on debian12

ダーリン: Hello, could you please tell me if there is a possibility to remove wallets from the default modal of tonconnect/ui-react? I’ve only found the option to add a new wallet to it.

not: hey guys i am wondering what this comment means     storeUint(698983191, 32). // subwallet_id     storeUint(Math.floor(Date.now() / 1e3) + 60, 32). // Transaction expiration time, +60 = 1 minute     storeUint(seqno, 32). // store seqno     // Do not forget that if we use Wallet V4, we need to add storeUint(0, 8).     storeUint(3, 8).     storeRef(internalMessage);  // Do not forget that if we use Wallet V4, we need to add storeUint(0, 8).  I am on the last code block in https://docs.ton.org/develop/smart-contracts/tutorials/wallet#contract-deployment-via-wallet

— 2023-12-26 —

botmother: hi, i've got a paid project and looking for any developers here.  The scope is to write the ts files for wrappers and deploy script for the following func contracts that was done by someone else.  Overview of the project is basically to mint NFT with Jettons.  Please PM me if you're able to do it

Howard: https://docs.ton.org/develop/func/stdlib#raw_reserve   What is the combination I should set if I "just want to have storing `at least x amount of TonCoin once receive the message"?

Howard: 1/ nativeReserve(myBalance() + ton("0.1"), 3) something like that?   2/ The description for this in ton.org DOCs is ambiguous for me (reply to 40378)

Howard: https://github.com/ton-blockchain/TEPs/pull/126 (reply to 31898)

Hakiem: hi guys, is there a max init data size for contract deployment?      await my_wallet.sendTransfer({         seqno,         secretKey,         messages: [internal({             value: deployAmount,             to: destination_address,             bounce: false,             init: {                 code: init.code,                 data: init.data             }         })],   This doesnt throw an error but the transaction doesnt appear in wallet/tonscan

Howard: no

Hakiem: it's strange cause the deployment script works for testnet but not mainnet

Hakiem: and the same script works for smaller contracts so i am a bit puzzled (reply to 40382)

Speculator: export async function run(provider: NetworkProvider) {          const randonSeed = Math.floor(Math.random()) * 1000     const nftCollection = provider.open(NftCollection.createFromConfig({         ownerAddress: provider.sender().address as Address,         nextItemIndex: 0,         collectionContent: buildNftCollectionContentCell(             {                 collectionContent: '',                 commonContent: 'tonstorage://0D51A77C4BE0E59ED44D149B5FE32332AE726FE09AE83E84E363FC50A21DFB56/'             }         ),         nftItemCode: await compile('NftItem'),         royaltyParams: {             royaltyFactor: 30,             royaltyBase: 100,             royaltyAddress: provider.sender().address as Address         }     }, await compile('NftCollection')));      await nftCollection.sendDeploy(provider.sender(), toNano('0.05'));      await provider.waitForDeploy(nftCollection.address);      // run methods on `nftCollection` } for the above code how can i write using tonClient.open() instead of provider.open()

Daniil: the same way (reply to 40388)

Speculator: but client.open is now working

Александр: thanks

Alex: Hi

Anthony: 🔨 Dev Tools Updates  Throughout Q4 2023, working alongside Telegram, Wallet, Tonkeeper, Getgems, and TON Diamonds teams, we proudly announce the stable release of TON Connect UI 2.0.0.  This release greatly improves user interaction with Telegram Mini Apps and resolves numerous issues, offering the best TON Connect UI experience to date!  👥 @tonconnect/{ui-react,ui} v2.0.0 • Quick browser-to-Telegram transitions without extra tabs. • Enhanced UX with TON Space on Telegram devices. • Multiple Safari and Privacy Mode fixes. • New no-bounceable address format. • Optimized application loading speed. • Back button handling for Android, discreetly hiding modal windows. • Plus over 50 additional enhancements and fixes.  🙂 Experience it yourself using these links: • https://ton-connect.github.io/demo-dapp-with-wallet for browsers. • https://t.me/tc_twa_demo_bot/start for Telegram Mini Apps.  ⬇️To learn more about TON Connect UI 2.0.0, visit GitHub page at https://github.com/ton-connect/sdk.  💬 Encounter issues? Please report them on GitHub at https://github.com/ton-connect/sdk/issues.  🎁 Special thanks to the collaborative teams for their invaluable assistance in making these enhancements possible. (forwarded from TonTech)

Howard: what is the blockchain LT time we can add on the Sandbox in a tiny tiny way?   my code is: blockchain.now = (await getCurTime()) + 1;

Howard: I noticed the tonStakers.com using this method in testcase https://github.com/ton-blockchain/liquid-staking-contract/blob/35d676f6ac6e35e755ea3c4d7d7cf577627b1cf0/tests/Controller.spec.ts#L106 (reply to 40461)

Dream: Hi bro,does anybody  know how to translate the field 'index' into 'token_id',is there any method or sdks? many thanks~~ {     "address": "0:53dd29e2f34e7583e538b1117749df04686364ecd2834f13cead14e0a7c0e499",     "index": -7213439931283840000,     "owner": {       "address": "0:5efe1c78ded903a9ae056b2eae2b0e624931cf996a4074d8aa101cd71f9dadf7",       "is_scam": false,       "is_wallet": false     },

Dream: like this : "token_id": "42356852489434921730610979361358066647193402903561575857378897017737619159122",

Dream: I just can't get the token_id by token_address when I use this sdk (https://www.npmjs.com/package/tonapi-sdk-js?activeTab=readme)

Master: Plz DM me (reply to 40370)

Samyar: hi guys   I'm trying to find out that how can i transfer Jettons (Tokens) but the code I'm using bellow does not work despite that I followed the instructions of a library   here is the code https://codeshare.io/eVdlxb   i would be pleased to find out why nothing happens   this is my output:  samyar@Samyar:~/pss/te$ bun index.ts wallet address= EQAowzwuq2f6mbQawhd9GZPkyNfHF_CfUdKhWz8rYmZbMg5x jettonWalletAddress= UQAowzwuq2f6mbQawhd9GZPkyNfHF_CfUdKhWz8rYmZbMlO0 {   seqno: 61 } res {   "@type": "ok",   "@extra": "1703601786.2651033:1:0.6917368041938978" }

Samyar: https://tonviewer.com/transaction/568df28c2fa1d77b3118049675e34441e5cd4eaa906a32f571a3c6afb19f3819  also it gives an error without any clear explanation (reply to 40468)

Knight!: hey how do i make smart contracts in funC? where do i find tutorials (videos preferred) I just need a sample project

&rey: You may start on https://docs.ton.org. (reply to 40471)

Knight!: Thanks!

Knight!: Can you provide a link to a sample project where best practices are followed

AmirMohammad: has been tvm updated ?

Andrey: Yes https://t.me/dtonforum/4364/4490 (reply to 40476)

MonoBit: Hi guys I am trying to update the code of my contract using set_code, but nothing happens. I have some fundamental questions 1. Does it change the address of the current contract 2. Does the set_code primitive give me access to new code functions, ... ? 3. I already have the function "A" inside my contract. I was wondering what would happen after calling set_c3.  Updates the current value of c3. Usually, it is used for updating smart contract codes in runtime. Note that after execution of this primitive, the current code (and the stack of recursive function calls) won't change, but any other function call will use a function from the new code.  If the new code has function A, is it possible to call the new code's function A?  And if there is another function, let's say B, in the new code, how to call this new function?    4. I have seen some other examples referenced in docs. They call send_message_back after set_code. Why is that for?

play of the game: Hi everyone I was wondering, how do inputs of recv_internal (or external) work?  For example if I want to get op code of an incoming message, can I put an input? ( Like recv_external(int op)) Or should I just read the first 32 bits of data?

MonoBit: each of the following recv_internal declarations is correct, but those with fewer variables will spend slightly less gas (each unused argument adds additional DROP instructions).  () recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {} () recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {} () recv_internal(cell in_msg_cell, slice in_msg) {} () recv_internal(slice in_msg) {} You have to parse in_msg_body to retrieve the op code based on how sender stored op code in the message.  Ususally, it is stored as the first 32 bit inside in_msg_body. (reply to 40482)

play of the game: Thanks a lot Is there any specific source where I can find such details?  Also in the recent challenge there's the following tl-b scheme for an external message: storage$_ public_key:uint256 execution_time:uint32 receiver:MsgAddressInt seqno:uint32 = Storage;  It's supposed to work all the same right? (reply to 40483)

MonoBit: Yw. Yes, check docs.ton.org (reply to 40484)

MonoBit: It's for the data storage of you contract (reply to 40484)

— 2023-12-27 —

Behrang: 1- No.  2- Not in the current transaction.  3- The map of function ids to their code will be updated. If you have changed the number or order of functions, you may call a wrong function. To fix this, use method_id to fix the id of the function even after update. (reply to 40478)

ئەنیمێی کوردی: hey guys how can i confirm a transaction with boc?  why tf tonconnect when i confirm a transaction only returns boc  what am i supposed to do with it 😐  in javascript

MonoBit: So, there is no way to access a new function after changing the code? We have to make a new transaction to my_address() and continue the process from where we left off? (reply to 40491)

Behrang: You have to use set_c3 in addition to set_code. (reply to 40497)

MonoBit: Thank you so much (reply to 40498)

Speculator: hi, I am getting  {code:_Cell, data: _Cell} and i want to send this in stateInit in message, stateInit is of string type so how can i convert these to string to send in stateInit.

Speculator: messages: [                         {                             address: args.to.toString(),                             amount: args.value.toString(),                             payload: args.body?.toBoc().toString("base64"),                             stateInit: ''                         },                     ],

sikia: messages: [                         {                             address: args.to.toString(),                             amount: args.value.toString(),                             payload: args.body?.toBoc().toString("base64"),                             stateInit: ''                         },                     ],

Speculator: I need to pass the below data structure in stateInit how can i pass it, because stateInit is taking arguments as a string? ``` data =  {code:_Cell, data: _Cell} ```

Daria: Can i call get-method of my contract inside it's contract?

Dmitry | backend4you.ton: yes, but for "current" address only (not other address with same contract code) (reply to 40507)

Daria: thanks (reply to 40509)

Corn: Hi! I have a question and maybe someone here can help me.. regarding ton links and dns domains:  I know how to open foundation.ton with using ton.run, but now I also wanted to use the mytonwallet. I activated the option ton proxy. When I now enter foundation.ton in chrome it just opens the Google results. So how can I open ton links using the mytonwallet extension? Also, there is an option "handle ton:// links". What is this and how does it work? I tried to enter ton://foundation into my browser, but it did not work?  Thanks for any help in advance!

Андрей: http://foundation.ton (reply to 40515)

Corn: Well yes, that is what I wanted to access and what I tried to enter?

Daniil: You had to add http:// (reply to 40517)

Corn: Ah, thanks! Yes! It works now. Can you also tell me what these ton:// links are? So the option in my ton wallet to "handle ton:// links"? This is something else than the proxy option. (reply to 40518)

Sam: Very confused why mytonctrl status is throwing this error MyTonCtrl> status [debug]   27.12.2023, 18:26:17.436 (UTC)  <MainThread>  start GetRootWorkchainEnabledTime function [debug]   27.12.2023, 18:26:17.436 (UTC)  <MainThread>  start GetConfig function (12) [debug]   27.12.2023, 18:26:17.453 (UTC)  <MainThread>  start GetConfig34 function [debug]   27.12.2023, 18:26:17.461 (UTC)  <MainThread>  start GetConfig36 function [debug]   27.12.2023, 18:26:17.470 (UTC)  <MainThread>  start GetValidatorsLoad function (1703699517, 1703701517) [error]   27.12.2023, 18:26:17.771 (UTC)  <MainThread>  args: ['/usr/bin/ton/lite-client/lite-client', '--addr', '127.0.0.1:42710', '--pub', '/var/ton-work/keys/liteserver.pub', '--verbosity', '0', '--cmd', 'checkloadall 1703699517 1703701517 '] Error: LiteClient error: [ 0][t 2][2023-12-27 18:26:17.768798536][block.cpp:1647][!testnode]    Check total_wt >= W[a] failed [pid 1148621] [time 1703701577] Signal: 6 ------- Stack Backtrace ------- /usr/bin/ton/lite-client/lite-client(+0x1374d9)[0x558bbaae84d9] /usr/bin/ton/lite-client/lite-client(+0x135b26)[0x558bbaae6b26] /lib/x86_64-linux-gnu/libc.so.6(+0x42520)[0x7f33ef73b520] /lib/x86_64-linux-gnu/libc.so.6(pthread_kill+0x12c)[0x7f33ef78f9fc] /lib/x86_64-linux-gnu/libc.so.6(raise+0x16)[0x7f33ef73b476] /lib/x86_64-linux-gnu/libc.so.6(abort+0xd3)[0x7f33ef7217f3] /usr/bin/ton/lite-client/lite-client(+0x141767)[0x558bbaaf2767] /usr/bin/ton/lite-client/lite-client(+0x2a9f1c)[0x558bbac5af1c] /usr/bin/ton/lite-client/lite-client(+0x1414c3)[0x558bbaaf24c3] /usr/bin/ton/lite-client/lite-client(+0x13bcca)[0x558bbaaeccca] /usr/bin/ton/lite-client/lite-client(+0x228432)[0x558bbabd9432] /usr/bin/ton/lite-client/lite-client(+0x227f08)[0x558bbabd8f08] /usr/bin/ton/lite-client/lite-client(+0xfc0d6)[0x558bbaaad0d6] /usr/bin/ton/lite-client/lite-client(+0xfaabb)[0x558bbaaababb] /usr/bin/ton/lite-client/lite-client(+0x110b75)[0x558bbaac1b75] /usr/bin/ton/lite-client/lite-client(+0x11074e)[0x558bbaac174e] /usr/bin/ton/lite-client/lite-client(+0x1112cf)[0x558bbaac22cf] /usr/bin/ton/lite-client/lite-client(+0x110e97)[0x558bbaac1e97] /usr/bin/ton/lite-client/lite-client(+0x1115d8)[0x558bbaac25d8] /usr/bin/ton/lite-client/lite-client(+0x11164e)[0x558bbaac264e] /usr/bin/ton/lite-client/lite-client(+0x10febe)[0x558bbaac0ebe] /usr/bin/ton/lite-client/lite-client(+0x10fac5)[0x558bbaac0ac5] /usr/bin/ton/lite-client/lite-client(+0x10fc17)[0x558bbaac0c17] /usr/bin/ton/lite-client/lite-client(+0xf6aec)[0x558bbaaa7aec] /usr/bin/ton/lite-client/lite-client(+0x129b4c)[0x558bbaadab4c] /usr/bin/ton/lite-client/lite-client(+0x129692)[0x558bbaada692] /usr/bin/ton/lite-client/lite-client(+0x106811)[0x558bbaab7811] /usr/bin/ton/lite-client/lite-client(+0xbb73b)[0x558bbaa6c73b] /usr/bin/ton/lite-client/lite-client(+0x106f16)[0x558bbaab7f16] /usr/bin/ton/lite-client/lite-client(+0x14f825)[0x558bbab00825] /usr/bin/ton/lite-client/lite-client(+0x15683a)[0x558bbab0783a] /usr/bin/ton/lite-client/lite-client(+0x155669)[0x558bbab06669] /usr/bin/ton/lite-client/lite-client(+0x1556ce)[0x558bbab066ce] /usr/bin/ton/lite-client/lite-client(+0x113130)[0x558bbaac4130] /lib/x86_64-linux-gnu/libc.so.6(+0x94ac3)[0x7f33ef78dac3] /lib/x86_64-linux-gnu/libc.so.6(+0x126660)[0x7f33ef81f660]

Sam: It was working fine last week. Not sure what would have changed, and I can;t determine what function is calling block.cpp

Sam: It seems like it is failing when trying to query for active validators. This is on testnet btw

F: in testnet this is normal, use status fast (reply to 40521)

Sam: Why does that happen? Because there are no elected validators?

&rey: Those are ton://transfer. (reply to 40519)

Sam: Also wondering why both of my pools are in state 2 right now. How could they both be participating at the same time? (reply to 40524)

Mehdi: Recently,I was in Indian group , androidIDE (android app which brings android app development in android device. Very cool opportunity), one interesting their group rules was , sending output logs as txt file , It will be useful,if we apopted here as well .  🙏 (reply to 40521)

play of the game: Oh my bad, I copied the wrong scheme! update#9df10277 query_id:uint64 signature:bits512 ^[ locked_for:uint32 new_seqno:uint32 ] = ExtInMsgBody This is what I meant (reply to 40486)

MonoBit: Yes, the message you will receive will have a uint32 op code and other information followed by this op in the order with the specific type. (reply to 40529)

Mehdi: Currently sending file is restricted in this group unfortunately (reply to 40528)

DEEP: 🔥 (reply to 40531)

Mehdi: I want thank  @aSpite or @SpiteMoriarty for  this awesome tutorial. I really enjoyed reading it. ❤️❤️❤️

Mehdi: I wish he cover this as well . Because in previous tutorial, this important learning resour is not covered .🙏🙏🙏

Corn: Thank for this info. And this is used to transfer ton to another wallet? Instead of using a wallet or so it is an http command? Or what is the benefit? (reply to 40526)

&rey: Kind of universal link which works for all of Tonkeeper, Tonhub, etc. (reply to 40537)

Corn: Is there a documentation about this with more info? (reply to 40538)

&rey: Indeed there is. (reply to 40539)

Corn: Where exactly? (reply to 40540)

&rey: https://github.com/tonkeeper/wallet-api (reply to 40541)

Corn: Mh well... Thanks for the link. But not quite what I hoped for. It uses at one stage Ton transfer with addresses, but it is not really explaining / documenting this specific command. Not a good docu. (reply to 40542)

Corn: "Opens the pre-filled Send screen and offers user to enter the missing data."  => but at least that is what I can confirm, because I just noticed it when clicking on the ton transfer in your first answer

H.N: Hello. How does this platform work? What is your job?

— 2023-12-28 —

Taewoo | Spacebar Ventures / HabiliAI: anyone knows how to import wallet with a private key (no seed phrase)?

CryptoJason: i'm afraid it haven't private key.

Taewoo | Spacebar Ventures / HabiliAI: i have a key

Taewoo | Spacebar Ventures / HabiliAI: but no seed

Taewoo | Spacebar Ventures / HabiliAI: the wallet address was generated by Mytonctrl

Taewoo | Spacebar Ventures / HabiliAI: I tried to import the previous validator wallet to new one

Galois field: hello? I can't find  the challenges for the TON competition. Where can I find them?

PLATFORM: ▶️ Storm Trade & TONRadar AMA session   Get ready to ring in the New Year with our exclusive AMA session with our special guests 🎤  🎙 Join us on 28th December at 13:00 (UTC time) for an insightful conversation with:  ⚡️Ra, Co-founder of TONRadar  ⚡️ Denis, Co-founder of Stormtrade, a versatile expert with a focus on DeFi and blockchain architecture.   Joining this AMA provides an opportunity to learn about building projects, delve into game creation on TON, and discuss risk management within the Storm Trade etc. It's a straightforward and informative session—no hype, just jump in and have your answers. 💬  📍 TONRadar Channel   🌐Website  ✈️Telegram  ✖️Twitter (forwarded from TonRadar)

botmother: Anyone knows how i can debug in func, i want to see which part of my load_data is causing the error code 9       (int init?, int index, slice collection_address, slice minter_address, slice owner_address, cell content, cell royalty_params) = load_data();

botmother: getting this on tonviewer when i send messages to my deployed contract

Howard: https://explorer.tonnft.tools/nft/EQBDGVKVive8yg5Cic2a_x_CdlvW3LfRQyfOqXWs67RpGuzr   Good tool for developers! 👍

play of the game: hi everyone, am I reading and checking the op code in the right way? also is it the right place to put accept_message() if I want my contract to accept an external message at its own expense? () recv_external(slice in_msg) impure {     accept_message();     int op = in_msg~load_uint(32);     if(op == 0x9df10277) {

Ken: Is it possible to detect whether code is deployed at a specific address in Tact? Such as getting the code size or hash?

Marat: make sure you read query_id right after you read op to make sure you don't mess up reading futher data, and I would accept_message() after all checks to make sure the contract cover gas costs for legitimate messages only (reply to 40559)

play of the game: thanks a lot, also, what is the usage of query_id? in this problem which is from tsc5 I don't see an application, so I wonder why is it even there? (reply to 40561)

Marat: it's common convention but isn't used in tc5 but tests expects it there. just read it and ignore (reply to 40562)

ℝ𝕒𝕒𝕊: hello can some one please help to check this is shit coin or real usdt https://tonviewer.com/transaction/ce9e2303e4669c7aae0977438a8409813ff6a345bdbdec3339c73e855bb96eb0

ℝ𝕒𝕒𝕊: i think im got scammed

User: yes, it is shitcoin (reply to 40564)

ℝ𝕒𝕒𝕊: Why the fuck such thing exist in ton

ℝ𝕒𝕒𝕊: Received fake usdt

&rey: Because anyone can deploy their own jettons. (reply to 40569)

Corn: Yes, I also received fake coins and I also got sent very small amounts of ton, like 0.00001 TON

&rey: The other question is, why did you see it outside of Tonkeeper's list of "jettons to confirm"?

ℝ𝕒𝕒𝕊: Well my mother had stroke my brain didnt worked i saw usdt logo (reply to 40573)

ℝ𝕒𝕒𝕊: not so hard to follow

Corn: Plus I received several scam nft (reply to 40572)

ℝ𝕒𝕒𝕊: where i can find that person how listited this shit coin ?

ℝ𝕒𝕒𝕊: PLEASE HOW THE fuck desgin this shit tonkeepr please add tab for unlisted shit

&rey: 1. Open your wallet in Tonscan at page "Jettons". Example: (reply to 40577)

ℝ𝕒𝕒𝕊: exactly from where ?

&rey: Copy address ("receive" button) then open it in explorer https://tonscan.org. (reply to 40583)

&rey: 2. Click on "USDT" to get to jetton page. Pay attention to "mutable" parameter.

&rey: 3. Click on "owner" address to see who that is. You may also visit their jettons page, displaying a few kinds of fake jettons.

ℝ𝕒𝕒𝕊: love this guy keep scamming every one

ℝ𝕒𝕒𝕊: https://tonscan.org/address/EQAM8ukoY9PW_zAzCLvjtwqkIQYwWBqyvRjtoAg3mlnvpoFc

ℝ𝕒𝕒𝕊: so its not only me who is stupid everyone else fall for your news

Corn: How much did you lose? So I can see very small ton amounts. The other stuff? 3,200 6,000 EQC... is what? (reply to 40588)

ℝ𝕒𝕒𝕊: i lost my number 349 usd something (reply to 40593)

Corn: Oh, sorry to hear this, that's not small

Corn: @pcrafter what is the other stuff, the 3,200 6000 EQC...?

Corn: Here (reply to 40587)

&rey: Those are true identifiers (contract addresses) of jettons which were named USDT/jUSD/etc. (reply to 40597)

ℝ𝕒𝕒𝕊: next time i remmber to exploit this shit not useing rule for name

Corn: Do they have a certain value in real usdt? Is it possible to say how much? Or just some jettons (reply to 40598)

ℝ𝕒𝕒𝕊: worth nothing (reply to 40601)

&rey: You'd need to do your own research to find any value. (reply to 40601)

ℝ𝕒𝕒𝕊: ✅ You’ve received: 0.000000001 TON (forwarded from Кошелёк)

ℝ𝕒𝕒𝕊: transferd 10 to my telegram

Corn: What exactly is this 0.00001 ton small amount scam about?

Corn: So where comes the scam into play?

ℝ𝕒𝕒𝕊: i got 3200 usdt

ℝ𝕒𝕒𝕊: for my number ! its worth nothing

Corn: Thanks for sharing

ℝ𝕒𝕒𝕊: and that guy transaction shows doing exact same thing with many otheres

ℝ𝕒𝕒𝕊: so easily missleading !

Ottavio: hi i got a offer for my  ano. Number about 3k. i don't know if scam or not

Ottavio: Is very strange

Ottavio: Has anyone had similar offers?

ℝ𝕒𝕒𝕊: Give me the telegram accoun (reply to 40620)

ℝ𝕒𝕒𝕊: Just scammed now

ℝ𝕒𝕒𝕊: 3.2k usdt

Mikhail: Hello everyone, is ton-orbs rpc is dead?

Sam: What do "mr" and "wr" mean in config param 34?  "validators": [     {       "adnlAddr": "0B36D104EE7B866A6CB6D79C2B03904499D1F0BFB8BB75BCA8893C273E35AF87",       "pubkey": "E19DCDB1BFEF9EE442E36D936AE239EF8E6DA2096E1AE9E4BF87557831C703F9",       "weight": 157146949659195581,       "mr": 0.9984399375975039,       "wr": 1.265208026407422,       "efficiency": 113.18,       "online": true,       "walletAddr": "kf8aIPw_ay04fXJtrC0a_ogQHzzqzo0z86EgsXv61mSoSbis"     },

Galois field: I am a beginner of Func. I want to send all Tons to receiver with no comments. Is this code correct?

Light: 模式128就行了 (reply to 40629)

Light: 其他代码与正常转账没有区别 (reply to 40629)

Dmitry | backend4you.ton: Depends on what you have after +64+32 :) (reply to 40629)

ℝ𝕒𝕒𝕊: Dude are go8ng to help or what some on scammed me and every same person contacted you are you going to give me his account or what? (reply to 40622)

&rey: You shouldn't respond to offers like "I'll send you some crypto and then you should send the number/username/etc" at all. (reply to 40620)

&rey: To be safe, use getgems.io or other marketplace and put up your NFTs for sale there.

&rey: Then smart contracts will ensure that you get your money for selling asset.

ℝ𝕒𝕒𝕊: Notice any ui bug???

Яша: Fake usdt (reply to 40638)

ℝ𝕒𝕒𝕊: no i mean why in  yesterday ui thereiz TRC20 but to day update they removed it !??? (reply to 40640)

Denis: do you use web app or native app? (reply to 40638)

ℝ𝕒𝕒𝕊: Native app on ios (reply to 40642)

Denis: it's fake usdt (reply to 40643)

ℝ𝕒𝕒𝕊: Ik I'm talking about ui change from yesterday (reply to 40645)

ℝ𝕒𝕒𝕊: They just updated that bug in ui!

ℝ𝕒𝕒𝕊: But over 100 got scammed

Denis: which one bug?

ℝ𝕒𝕒𝕊: Can you c deff from to Pic one is older version another one is latest update

ℝ𝕒𝕒𝕊: One mentioned it worthless second added trc20

ℝ𝕒𝕒𝕊: And why the fuck I should scammed when there is bug in ui!

Denis: i don't understand there is the bug

Denis: ok. and what? we removed displaying description of token. it's useless

Denis: https://tonviewer.com/EQCMhEZwZLojCo1RVZ7tv_WmFfJUIuXcMfTibpvl1FCQxG7c

ℝ𝕒𝕒𝕊: And quests what that useless info lead to miss leading (reply to 40656)

ℝ𝕒𝕒𝕊: Yesterday there was bug which lead me to belive there is trc20 today removed it

ℝ𝕒𝕒𝕊: Can you understand that really?

ℝ𝕒𝕒𝕊: Your bug caused me to lose my number!

ℝ𝕒𝕒𝕊: Next time instant of inventing the while learn from other learn the ducking design pattern

ℝ𝕒𝕒𝕊: There is no single wallet out there you could make token and show it as trc20

Denis: it wasn't a bug. we tried to support jetton standard. but some scammers used this field for writing fake data or link to scam websites. so we decided to remove this description because it useless but can create problems. few months ago. please be careful and keep your software up to date

ℝ𝕒𝕒𝕊: Even you know it and fix it later!

ℝ𝕒𝕒𝕊: So ur big cuse to scammers easily scammers every one (reply to 40664)

ℝ𝕒𝕒𝕊: So you are responsible to my lost

ℝ𝕒𝕒𝕊: Your none sence idea

ℝ𝕒𝕒𝕊: We wanted to support jetyon by helping scammers to scammers and Maki g shit coin looking as legit as possible we didn't even think to reserve well known so scammers could do it easily

ℝ𝕒𝕒𝕊: Nice response!

MonoBit: Hi.  Where can I find out what the limitations of dict, tuple, list, ... are? (Max items we can store inside them)  And how many recursive calls can I have inside my contracts? As long as I pay for the gas?

— 2023-12-29 —

Hakiem: Hi, anyone else have issues sending jettons using MyTonWallet? I get out of gas exit code at recipient jetton wallet contract for JettonInternalTransfer message. Jettons deducted from my balance and not incremented in recipient balance.   Tonhub works fine.

K: Hi   someone can help me pls i got stuck and i can't find how to calculate the "jetton_address", in an example they calculate it using the "jetton_master_addres" and the "jetton_code" which in this case i dont know how to get either =( any help would be appreciated

&rey: 1. Dict: limited only by contract storage which can have at most 65536 cells. 2. Tuple: 255 elements if plain tuple [A, B, C, ...], unlimited with scheme [A, [B, ...rest]]. 3. List: what's that? 4. Recursive calls within contract: should be limited only by gas. 5. Recursive calls between contracts: what's that? Sending messages is limited only by balance (they don't track history per se). (reply to 40671)

botmother: Anyone knows if ratelance is down? URL returns a json error

MonoBit: Thank you 🙏 Lisp-style list I meant.  By recursive, I mean recursive calls of a function. (reply to 40674)

&rey: Thanks for the report! It seems that tonapi has shutdown v1 version so a bit of migration is needed. (reply to 40675)

Vahid: what is different between collection_new.fc and collection.fc ? (reply to 40324)

Keanu reeves: Hello greetings

Keanu reeves: Please what's this group all about

&rey: This group is about project development on TON blockchain (ton.org).

hongzhang: How to best understand how to code in funC? I wanted to do the TON challenge 5 and I was from python before this

Bober🦫: Hello, I want to build a Polish community on TON. Can I count on your official support and information for the community?

Fanenand: Hey, has anyone recently encountered a problem with transactions going through Tonkeeper in testnet when connecting a wallet to the app?

Mehdi: Hi , In task 1 , we should consider smart contract state is populated and state is already there Or  we must   deploy it ourself?

Dmitry | backend4you.ton: Populated (reply to 40698)

Galois field: hello, I have a workchain and 256-bit integer address. How can I obtain a slice?

Mehdi: What is diffrence between load and preload?

Pavel: Hi, in task 2, "You should send messages to the address of your token jack 'jetton_address' " . Where is this address?

Pavel: Preload does not move pointer (reply to 40701)

▄︻デ𝒔𝒂𝒏𝒅𝒚⚡𝒌𝒊𝒍𝒍𝒆𝒓═━一: Hey all

▄︻デ𝒔𝒂𝒏𝒅𝒚⚡𝒌𝒊𝒍𝒍𝒆𝒓═━一: @admin

Андрей: nometa.xyz (reply to 40705)

▄︻デ𝒔𝒂𝒏𝒅𝒚⚡𝒌𝒊𝒍𝒍𝒆𝒓═━一: Small doubt 🧐

▄︻デ𝒔𝒂𝒏𝒅𝒚⚡𝒌𝒊𝒍𝒍𝒆𝒓═━一: I need perches username

▄︻デ𝒔𝒂𝒏𝒅𝒚⚡𝒌𝒊𝒍𝒍𝒆𝒓═━一: Already some one taken

Dmitry | backend4you.ton: In incoming transfer notification, according to TEP-74 (reply to 40702)

K: Store them in a cell and use .begin_parse to get the slice, also make sure to follow the scheme https://docs.ton.org/develop/data-formats/msg-tlb#msgaddressint-tl-b (reply to 40700)

Jarek: excuse me, is there any nvim plugins for func? Only found the syntax usage in docs

Galois field: thanks (reply to 40712)

Mehdi: yes , I am uesd it ,just type : (go to command mode and then type TSInstall  func , enjoy (reply to 40713)

Jarek: Thanks reply. Yes, I know there’s syntax in treesitter. But i’m looking for other plugins supporting other r features like auto-formatting and diagnostics. Do you have any recommendations? (reply to 40715)

Mehdi: I know some work is on progress , lets check ,PR is open already but soon it will be available you can check this page (reply to 40717)

Knight!: Yo! how do you get the value of current time in funC

Mehdi: by calling now() (reply to 40720)

Knight!: Oh its that simple T_T already spent an hour for that (reply to 40721)

Jarek: Will follow up, thanks sir (reply to 40719)

Mehdi: how access op in recieved message ?

Tim: load_uint(32) (reply to 40724)

Mehdi: first 32 bit , from recv_external message body always return number after # (for example here update#9df10277) , am I correct ? if yes , we have only one recv_external() function in one smart contract ? if yes we can branch our logic based on this 32 bit information ,please let me know if there is something missing in between ,    `update#9df10277 query_id:uint64 signature:bits512 ^[ locked_for:uint32 new_seqno:uint32 ] = ExtInMsgBody (reply to 40725)

Tim: i can't even read your message

Mehdi: first 32 bit , from recv_external message body always return number after # (for example # here update#9df10277 in TL-B) , as  we have only one recv_external() function in one smart contract,  we can branch our logic based on this 32 bit information ,please let me know if there is something missing in between ,    🙏

K: the # is just notation that specifies that the number 9df10277 is encoded in hex, each caracter represents 4 bits so there is no # in the data, just the 32-bit number "9df10277" (reply to 40729)

Mehdi: I got it , thank you all .

Luke: how can i create an address slice based on the 256bit part

K: any luck with that ?, i tried to get it from "in_msg" and "in_msg_body" (reply to 40702)

— 2023-12-30 —

Kenny$$Shillz: Hi I have a question that is kinda of dumb but I'm new  to Ton so I hope its ok. How would one verify that a wallet connected to a dapp on ton owns one or more nfts from a specified collection?

botmother: You can use tonapi, get the wallet address and then check for the collections under the address

botmother: https://toncenter.com/

Victoredel: help :v  Error: Func compilation error: contracts/task2.fc:88:21: error: cannot apply function store_uint : (builder, int, int) -> builder to arguments of type (builder, slice, int): cannot unify type slice with int                       .store_coins(10 * 10 / 10)

Knight!: Func compilation error: task1.fc:4:24: error: cannot apply expression of type slice to an expression of type (): cannot unify type () -> ??2 with slice       slice ds=get_data().begin_parse();

Knight!: can someone help me with this 😩

Mehdi: second argument  is slice , you send int (reply to 40739)

Knight!: get_data() returns a cell right? why cant i apply begin_parse() on it?? (reply to 40740)

Mehdi: but error it seems related to type definition ,check signiture (reply to 40743)

Mehdi: Func compilation error: contracts/task1.fc:7:3: error: uint256 is not a type identifier        (uint256 ,uint32 ,uint32   ,uint32  ) unpack() impure inline_ref {

Mehdi: what cause this problem? anybody knows? (reply to 40745)

Knight!: use only int not uint 256 or 32 (reply to 40746)

Knight!: better use var

Knight!: error: cannot apply function _>_ : (int, int) -> int to arguments of type (int, ??64 -> ??65): cannot unify type ??64 -> ??65 with int           throw_unless(124, curr_time > execution_time);

Knight!: Help

Galois field: Have you declared the variables?

Knight!: my bad, i forgot about scope of variables sorry

Galois field: Does anyone know how much TON I should pay in total? Is it all of it, just one, or something else?

Knight!: can i dm you? (reply to 40751)

Knight!: I guess I am reading the inputs wrong, can someone help me with understanding the TL-B scheme

Knight!: ive read 60-70% documentation, didnt find this format in tl-b data format

Knight!: help :(

Andy: Here is what that'd look like in FunC, I think this can help begin_cell()     .store_uint(0x9df10277, 32)     .store_uint(query_id, 64)     .store_slice(signature)     .store_ref(         begin_cell()             .store_uint(locked_for, 32)             .store_uint(seqno, 32)         .end_cell()     ) .end_cell(); (reply to 40756)

Knight!: I am actually confused here :

Knight!: am i reading the values correctly? cause ive no clue whats going on, im unable to log and debug as in usual dev (im new to blockchain, specially funC)

Andy: can you send that in text form? I'll fix it for you

Knight!: () recv_external(slice in_msg) impure {     slice tmp_in_msg = in_msg;     int op = tmp_in_msg~load_uint(32);     int query_id = tmp_in_msg~load_uint(64);          ;; int locked_for = tmp_in_msg~load_uint(32);

Knight!: thanks!

Andy: the locked_for and seqno are stored in a reference, but you are not loading the reference

Knight!: i have actually commented that part to process them under specific operation codes

Knight!: *maybe im wrong* (reply to 40766)

Andy: Here is the code with a bit of explanation. You technically don't need to copy in_msg to tmp_in_msg and to signature but this gets the point across well. slice tmp_in_msg = in_msg; int op = tmp_in_msg~load_uint(32); int query_id = tmp_in_msg~load_uint(64);  ;; Load the reference ;; `begin_parse` converts the reference `cell` to `slice` ;; `cell` for storing, `slice` for reading, `builder` for building cells. slice reference = tmp_in_msg~load_ref().begin_parse();  ;; Load the values from the reference int locked_for = reference~load_uint(32); int new_seqno = reference~load_uint(32);  ;; The signature will be the leftover 512 bits from the previous slice slice signature = tmp_in_msg;

Knight!: i kind of get it, thank you so much but why is signature listed before the reference?? (reply to 40756)

Andy: well, my guess would be: you need the entirety of the reference to do a signature check later, and you can't sign a cell that you have to put your signature inside of :) so the signature has to be outside of the data, and while it could be put in another reference, so it'd be sequentially after the data, there is not really a need, since we still have data bits in the original cell left, so we just store it there as that's more optimized than unnecessary references

Knight!: Okay! This was helpful, Thanks!

Ruslan: Hi guys, a little question are flashloans possible in the TVM network, even thogh the transactions are not different to EVM ?

Knight!: quick question: how do i see logs (outputs from ~dump(); commands) in github actions?

Knight!: if someone can help me debug my code, pls dm :)

Daniil: Flashloans aren’t possible on TON (reply to 40772)

ئەنیمێی کوردی: hey guys i need help with this one  this does not work (returns an empty array witch i spouse it means the transaction not found): /**  * @param  {String} msg_hash  * @return {Promise<GetTxInMsgHashType>}  */ export const getTransactionByInMessageHash = async function(msg_hash: string): Promise<GetTxInMsgHashType> {   const query = {     msg_hash: toBase64Rfc(msg_hash),     include_block: false,     include_msg_body: false   };    console.log(query.msg_hash );    const res = await toncenterV1Http.get(`getTransactionsByInMessageHash`, {     params: query,   })    console.log({axios: res.config});     return res.data[0]; };   but simply copying the hash from the console.log and passing it directly to the  toBase64Rfc works fine and transaction is found  but it's not practical obviously  after 3 days trying to debug code i couldn't  find a way to fix this  i have

hongzhang: How to develop a for loop/loop in funC ?

Daniil: https://docs.ton.org/develop/func/statements#loops (reply to 40777)

Galois field: hello？ (reply to 40754)

Mehdi: what is best practice for updating contract state?

Daniil: set_data() (reply to 40780)

Mehdi: 🎅Holidays Greetings and Exciting News about TON Smart Challenge #5!   As we dive into the holiday season, we're thrilled to see the enthusiasm and incredible talent displayed in TON Smart Challenge #5. Your dedication and skills are impressive!  In the spirit of the holidays and to ensure everyone has a seamless opportunity to showcase their talents, we're excited to announce an extension to the submission deadline. You now have until January 6th, 23:59:59 UTC+4 to submit your solutions.   We hope this gives you a bit more time to polish your submissions and perhaps even enjoy some well-deserved holiday time!  🗓 Updated Timeline:  🚀 Tasks are already live since at this GitHub repository ⏰ New Submission Deadline: January 6th, 23:59:59 UTC+4.   Remember, you can register via the @smartchallengebot on Telegram. The bot is also there to assist you throughout the process.  Happy Holidays and a Happy New Year from all of us at TON Foundation & Codeforces! 🎁🎄🎆 (forwarded from TON Contests)

User<6514207421>: This is exciting to hear! (reply to 40786)

Mehdi: bash     Submission failed Detailed summary report: Error: Process completed with exit code 1.  any idea? after pushing code , it just said failed no more information!

Knight!: Is ton blockchain the best way to try out blockchain?

Knight!: Or should I go with solidity based blockchains

&rey: TON has a rather unique concept that transactions happen on single contract. That improves scalability (see Infinite Sharding Paradigm) and forces to think more about actions atomicity. Exact choice would depend on details of your project, but I've found TON fine so far. (reply to 40792)

Dmitry: I should call get method ‘’’seqno’’’ on your contract address (reply to 40795)

Dmitry: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#--external-and-internal-transactions Sure. You can find example here (reply to 40797)

Dmitry: sorry, I don't know that (reply to 40799)

— 2023-12-31 —

Jarek: `undefined function mint_nft_item, defining a global function of unknown type`  i got the undefined function warning when i run blueprint test, however, the contract can be compiled and test is executed successfully.

Maksim: try use LiteBalancer in pytoniq. it better chooses liteservers (reply to 40802)

Maksim: for the seqno method you can use this example https://github.com/yungwine/pytoniq/blob/master/examples/get_methods.py#L15 (reply to 40808)

User<968543604>: how can i take a Master NFT?

User<968543604>: pleas help me to get this NFT

Isaac: This is the reason why we do not display the ticker of such fake tokens at the transaction list on tonscan.org  Btw, thanks for the report we now marked this token as SCAM. (reply to 40589)

ℝ𝕒𝕒𝕊: hello i found 4 other from same person (reply to 40815)

ℝ𝕒𝕒𝕊: all of them sort of USDT

ℝ𝕒𝕒𝕊: https://tonscan.org/address/UQBvlFibEYmDHb_lfBxu_1ARrYBsE-hDz0GZKoXWUOF1t9Uo#tokens

Isaac: It's sad, but they can generate an infinite number of them. The best solution is to filter tokens that duplicate known tickers in the UI. (reply to 40816)

ℝ𝕒𝕒𝕊: yeah ikn but this guy still scamming people (reply to 40819)

Isaac: Try mytonwallet.io with filtering of zero price jettons. (reply to 40820)

Павел: I am trying to update contract storage such way:    set_data(     begin_cell()         .store_uint(public_key, 256)         .store_uint(execution_time, 32)         .store_slice(receiver)         .store_uint(seqno, 32)         .end_cell() );   But after this update tests shows that seqno was not changed... What I am doing wrong? Do we have some kind of best practices for updating data?

Павел: I figured out. Mistake with with impure. It must be used for function...

Isaac: idk, check this address on tonscan.org (reply to 40822)

Mehdi: first, another smart-contract during handling message may trust those fields (sender may not forge source address, bounced flag, etc); and second, that during serialization we may put to those fields any valid values (anyway those values will be overwritten). what this long line means in smooth english ? this page

Mehdi: I even translated it by google translate , yet didnt figure point out ,sorry for silly question ,`اول، یک قرارداد هوشمند دیگر در حین مدیریت پیام ممکن است به آن فیلدها اعتماد کند (فرستنده ممکن است آدرس منبع، پرچم برگشتی و غیره را جعل نکند). و دوم اینکه در حین سریال سازی ممکن است هر مقدار معتبری را در آن فیلدها قرار دهیم (به هر حال آن مقادیر رونویسی خواهند شد).`

Mehdi: I am wondering, blockchain is hard , TON is harder , and editorial is . ..  is it possible to  put simpler sentences ,shorter , smoother , minimum ambiguity etc.

Den: Hi team, I am working for an exchange.   The new address will start with UQ instead of EQ, and the last four letters will change too. However, would the old addresses work or they will be invalidated?

Den: @SwiftAdviser

Mehdi: Those things should be handled carefully due to the fact that some fields have variable sizes. how handle carefully? this is about message layout and variable field , we should check every variable size field prefex one by one and decide accordingly or it is some better way ?

Mehdi: This is description of  mode 64 , Carry all the remaining value of the inbound message in addition to the value initially indicated in the new message what it means , new message refer to who ,value is not something that validator can rewrite , so what initially indicate means?  we put some value there , and send message , what inbound message here refer to , is it mean incoming message or outgoing message , how they can indicate initially and then by mode it will change , or maybe we should guess all of them and hope we have correct guess

Mehdi: flag +1 it said Pay transfer fees separately from the message value , let say we have 3 smart contract which work together , this message value  here is about action message (message after processing inbound message ) or just  send_raw_message , is it apply for master contract or can be used down the road too

&rey: Let's say we are processing message with value 1.1 TON. Our contract spends 0.1 TON for storage and computations and then sends message with value 3 TON and mode 64.  Message gets sent with value 4 TON. (reply to 40834)

Mehdi: flag +2 said Ignore any errors arising while processing this message during the action phase , if we ignore errors what happen for state , bounce , commit , outgoing message , all will be apply , ignored , some yes , some no ,

Mehdi: For internal message layout we have  technical discussion , for external , it said it  does not need to be as standardized (written by different developers and managed by different owners) , my question is about how we should deal with op code . In TL-B , we have arbitary hex number act as tag or id of schema (after #), but no where we have any clue(or maybe I can not find) that this is op code , and we can access it by calling  op = msg.load_unit(32) (simplified) ,I mean it seems it is convention , and used every where , but why this is not mentioned anywhere ,All information we have is this note : In general, an external message begins with a 256-bit signature (if needed), a 32-bit req-seqno (if needed), a 32-bit expire-at (if needed), and possibly a 32-bit op and other required parameters depending on op. The layout of external messages does not need to be as standardized as that of internal messages because external messages are not used for interaction between different smart contracts (written by different developers and managed by different owners). from this page

— 2024-01-01 —

Mehdi: Why we have 2 . store_ref()

VIKTOR: I think .store_ref() one signal, the other with data) (reply to 40840)

User<6476603919>: Happy New year 🌹🌼

Kenny$$Shillz: Happy new year everyone

User<5018886941>: Compliment of new year

Kenny$$Shillz: Seems to be storing the same value though (reply to 40841)

&rey: Because example stores one cell as a ref twice. (reply to 40840)

Павел: About tsc5: shoul I use recv_internal or recv_external for the 1st task?

Samyar: check this out (i cloned the repo and fixed it for myself by using globalThis.crypto but it's only available in node 19 and higher so i don't think it's a good approach):   https://github.com/toncenter/tonweb/issues/122

Mehdi: description said use  external (reply to 40850)

Павел: Thank you (reply to 40852)

Павел: Can I see somehow dump of value inside smart contract using @ton-community/blueprint?

Howard: is there any tool can help us understand the VM steps?

Denis: Dton.io (reply to 40856)

Gulolio: Hello there guys, one question here. With this TL-B schema from tsc5, on task1.  update#9df10277 signature:bits512 ^[ locked_for:uint32 new_seqno:uint32 ] = ExtInMsgBody  Shouldn't I expect and op code, a signature and a cell with the data, in that same order? Or should I expect some other order, or a query_id for example?

Shashank: ✨🕥 *Happy New Year 2024* ! 🎉 ✨  For next 365 Days , Let's embrace the power of love , innovation, collaboration, technology, nurture healthy minds, and work together towards success and excellence.   🏆 Cheers to a phenomenal Year ahead...Let's carry forward its momentum into 2024.. ✨✨✨  *Thank You for Everything* 🙏🏻😊  If you are building on TON using Tact. Try Nujan, TON's web IDE : https://ide.nujan.io/  Shashank (Team Nujan)

Jared Rui Hoong: There's a query_id after the op code but otherwise yes that's the order. TL-B was updated with it a week ago (reply to 40858)

Gulolio: You are righ it was updated, I had an old version. Thanks man (reply to 40860)

Marat: ~dump(value); (reply to 40855)

Zaniyar | MetaRoom.city: is there an example of a dApp that uses TON for payment in the browser? (is there a wallet like metamask for TON? or how is it working? - asking as a solidity/eth developer)

Jarek: for those who face same issue, the issue ends up my function is declared under where the function is being called in the contract. it can still be compiled though (reply to 40803)

Gulolio: Guys if I parse an address like this,   var (int wc, int address_bits) = parse_std_addr(address);  How can I do the opposite? Having wc the workchain, and the address_bits to obtain the original address. Is it possible?

&rey: .store_uint(4, 3).store_uint(wc, 8).store_uint(address_bits, 256) —> address in a builder. (reply to 40868)

Gulolio: Awesome

Gulolio: I'm confused by these sentence in the tsc5,  The contract should send out to all users according to their shares. You should send messages to the address of your token jack jetton_address according to TEP-0074.  Message Value: 0.02 TON Response address must be equal to the recipient address Forward_amount = 1 nanoTON Without custom_payload / without forward_payload.  Specifically the  send messages to the address of your token jack jetton_address , token jack jetton_address? What this means? Who is Jack?😂 Reading the TEP-0074, I have the impression I have to send a message in this form  () send_jetton(int query_id, int amount, slice to, int mode) impure inline_ref {     cell msg = begin_cell()         .store_uint(0xf8a7ea5, 32) ;; op defined in TEP-0074         .store_uint(query_id, 64)         .store_coins(amount)         .store_slice(to) ;; destination         .store_slice(to) ;; response address         ;; without custom payload         .store_coins(1) ;; forward ton amount         ;; without forward payload     .end_cell();           send_simple_message(jetton::msg_value,to , msg, mode); }  But I still don't know what it's refered as token jack jetton_address. If anyone can shed a light on this.

&rey: You receive transfer notification from your "token jack jetton_address". (reply to 40872)

— 2024-01-02 —

sd: /report (reply to 40879)

Sloth: Isn't that the real thing? Or nah? (reply to 40880)

User<1469058150>: it is i just signed up (reply to 40881)

sd: This is scam. (reply to 40881)

Sloth: I just saw it's not an admin, so you may be onto something (reply to 40883)

Galois field: can i dm you? (reply to 40870)

Kenny$$Shillz: I'm having some error while making a a simple ui to enable minting of nfts from a collection. On my local server it works fine but when I try to deploy to GitHub pages or netilfy I get a type incompatible error. Basically it says that the nftCollection object passed as arg to the client.open() function is not of type Contract. The nftCollection object is assigned to NftCollection.fromAddress() method ... Please is there any reason this is happening or any documents I can go to for help?

Kenny$$Shillz: Ps.. it's my first week experience of tact and funC

Codex: Hey guys

Codex: I'm making a telegram directory bot that helps people find groups easier if anyone is interested. Eventually will be hooked into TON. Wondering what the best way to authenticate a tg user is via miniapps

Codex: Atm just using initdata as the authentication

E: Is there any way to develop @wallet and ton space on testnet now? If not, how can we develop dapp with ton space?

Bear: hi, why we got this suddenly? Wasn't got this before

Kenny$$Shillz: Problem solved .. I just removed the type casting (reply to 40888)

Kenny$$Shillz: I made an nft collection with a minter on testnet is it ok to share here for feed back ?

Jarek: i think it's fine 🙌 (reply to 40896)

Kenny$$Shillz: @dropmojisnft_bot please ignore the UI

Favour: Please who can teach me dis well

Kenny$$Shillz: I would appreciate any interaction and feedback 🙏🙏 (reply to 40898)

Jarek: i can't connect the wallet 😂 (reply to 40900)

Kenny$$Shillz: Are U using Tonkeeper? On testnet? (reply to 40901)

Jarek: yes the link have successfully take me to the Tonkeeper app but when i come back to the bot, it's still disconnected (reply to 40902)

Kenny$$Shillz: Got same feedback elsewhere thanks a lot will work on it (reply to 40903)

Speculator: How to check whether any wallet is owner of collection of nft?

botmother: Just one Collection or multiple? (reply to 40905)

Speculator: multple

botmother: https://docs.tonconsole.com/tonapi/api-v2  /v2/nfts/collections/{account_id}/items

botmother: Get the collection's owner history then find if wallet address owns it

To: have a wallet  https://testnet.tonviewer.com/EQDWN__e2VHld2knphwYJFmfAmfsdnvLVtOhHtHIgeoqggAR how can I display on the web page, I need to show on the page  1.who funded this address  2.how much money was deposited

ZX: Hey guys, I am looking for someone to develop a jetton smart contract for my project based on my requirements.  Please send me a message if anyone here can do it and is pro enough to handle a customized smart contract code on TON 😊

Samyar: is there a tonweb group chat? i have specific questions about it

Samyar: the tokens are not transferred in this code  it replays that the transaction was successful and it's but when i check the transaction (the second image) the token value is 0 :\

Gulolio: In the tsc5 task2, when they refer to "shares" they mean the percentage a given user it's entitled to? For example, let's suppose that the contract has 500 tons, and we have two users, user1: 30 shares, user2: 70 shares. Does that mean that user1 it's entitled to 30 % of the tons of the contract and user2 to the 70 %?? Or shares literally means amount of tons that a given user it's entitled to?

Kenny$$Shillz: Please try now as I believe I have fixed it only you have to refresh after connecting ... Also it should charge 2.7 test ton... (reply to 40898)

Kenny$$Shillz: The problem I face was I was working with a beta version of to connect

Kenny$$Shillz: TonConnectUI/react

Kenny$$Shillz: Also I found a typo in the URL link in my tonconnect-manifest.json , not so sure if that was part of the problem but all I did was to update to lst version and it worked ... Well thats not all I did but eventually that was all I had to do

Rashad: /items

monczkaS: Hey guys, how can I contact with someone from TON Play? Their Docs website is not working and I am stuck I can not work on the game because I need to read Docs

Samyar: https://github.com/toncenter/tonweb/pull/77  if there is a TonWeb Mainter or you know one please tell them merge this pr for a silly type error :D

maxi: yo

maxi: How can we limit supply in a jeeton?

Galois field: I have the same question... (reply to 40917)

Dmitry | backend4you.ton: Task description has a formula (reply to 40917)

Gulolio: That formula it's for tokens, right? Or should be for TONS as well? (reply to 40932)

&rey: Does nature of assets make any difference for how they would be split? (reply to 40933)

&rey: Do you have custom jetton contract? (reply to 40926)

&rey: Percentage. Though, total shares may sum not to 100 but to any other value as well, and users are "entitled" to TONs of incoming message rather than contract itself. (reply to 40917)

jf / @crypto: Hey guys looking for a telegram bot dev to for a bot project

maxi: What type of bot? (reply to 40938)

maxi: nope (reply to 40936)

maxi: I m new to TON

maxi: What language we can use to code the contract?

maxi: isn't it similar to solidity?

&rey: FunC or Tact. (reply to 40942)

&rey: Rather similar but better suited to work with transactions that can take place only on single contract. (reply to 40943)

maxi: where i can find a starter guide?

maxi: For Tact

jf / @crypto: Sniper bot (reply to 40939)

maxi: that's a complex shit

jf / @crypto: It’s almost fully built. Looking for some additional back end support (reply to 40949)

&rey: https://tact-by-example.org/all (reply to 40946)

Galois field: if i don't  want to use custom_payload, should i use ".store_uint(0, 1)" to be a placeholder?

&rey: Yes. (reply to 40957)

Galois field: Is it necessary? (reply to 40959)

&rey: Yes, so that message format is followed. In TL-B, Maybe X stands for "bit 0 if value is absent, bit 1 + value representation if it's available". (reply to 40960)

Galois field: Thanks a lot

Philip 菲力: is there any depth guide about ton-indexer-worker?

Dipanshu ( Normie.Tech ): Sup I wanted to know

Dipanshu ( Normie.Tech ): If I buy a ton domain. ..can it work like a normal web2 dns ? I.e I can link it up with a website and it will work ?

Dipanshu ( Normie.Tech ): In any browser?

#: Approximately how much does it cost to specify a smart contract that creates a collection and NFT that will carry the tokens as part of holding the NFT in the wallet?

— 2024-01-03 —

Luke: anyone know what happened to toncontests chat?

XuanXue: Is there any updated document of running full node?

XuanXue: It says The config file is broken

XuanXue: based on https://docs.ton.org/participate/run-nodes/full-node

Mister Sir: Any experienced ton devs lookin for work

Mister Sir: Dm

Speculator: If i don't know the collection address then how can i do it? (reply to 40909)

Speculator: how to check if a wallet is owner of any nft collection or not?

Dmitry | backend4you.ton: no. you need special client plugin or set special ton proxy in client settings to access .ton domains (reply to 40971)

Speculator: ?? (reply to 40986)

Dipanshu ( Normie.Tech ): Then which browsers currently support that? (reply to 40987)

Dmitry | backend4you.ton: By default? None. Client plugin? At least Chrome, but I didn’t dived deep. Setting proxy? All (reply to 40989)

Howard: oh, I got it. (reply to 40991)

Bear: what is the actionCode 37?

Bear: I am sending sendExternal in the Sandbox tho (reply to 40993)

Piotrek: Hello guys, do you know how I can interact with deployed smart contract using some SDK in JS?

Speculator: use ton or ton/core sdk (reply to 40995)

Piotrek: Ok, thanks

Bear: find it (reply to 40994)

Bear: thank you

Jarek: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc#L36  excuse me, why mint_tokens message format has additional bit in the last. AFAIK, 2 bits after 'created_lt' & 'created_at' fields stand for init fields and whether the msg_body will be serialized, how about the last bit, can't find the info on docs

Facu: Hi!  Anyone here working with @tma.js/sdk-react library with async option for loading?  (usually for using with next.js that do SSR) Because It is working fine with telegram on iphone, pc, ipad, etc... but on android most of the times I got a timeout error.

Mehdi: I remeber in tma doc , maybe in platform part , siad this client have diffrent approach in dev , as these are diffrent project ,and this fact should be considered (reply to 41002)

Mehdi: maybe toke has special TL-B , mentiened in its TEP (reply to 41001)

Facu: This is the documentation: https://docs.telegram-mini-apps.com/packages/typescript/tma-js-sdk-react#launch-parameters  As I am investigating seems to me a "bug/no well supported feature", the async option.  Basically needs to wait for window.Telegram.WebApp to have a value. Maybe something is slower in android and generates that timeout.  I've also reported the issue here: https://github.com/Telegram-Mini-Apps/tma.js/issues/215 I am using latest version 1.1.1 (reply to 41003)

Jarek: haven't read that part yet 😢. let me dig into it. thanks reply (reply to 41004)

Sam: I am trying to run mytonctrl from inside a docker container, but keep getting the error "The config file is broken"  What config file is this referring to? I have now mounted every available directory on the machine into the container, and it still isn't working

Ruslan: This may help you: https://github.com/kdimentionaltree/ton-docker-ctrl (reply to 41007)

maxi: hey where i can deploy tact contract?

maxi: no remix type ide here?

Mehdi: search blueprint in ton doc , may help .we have online ide as well , but i dont know it can deploy or not (51 % it can), all cool stuff can be find in ton awesome repo (reply to 41009)

Jan: Hello

Jan: I am looking for TON developers to help out with a project

&rey: Please provide more details, such as field (DeFi, gaming, etc) (reply to 41013)

Kenny$$Shillz: If you have the nft index/id I can read the owner address from the contract (reply to 40986)

Jan: Interoperability, web3 (reply to 41014)

Jan: I guess you can say DeFi, NFTs etc....

Sam: I don't really want to run the whole node in docker, just a monitoring service I am putting together. What is the config that this error is complaining about? (reply to 41008)

DanIsNearby: Hi guys is there any tutorial on mini apps with a ton connect button etc

DanIsNearby: i saw a example app but it just explains the mini app stuff no ton buttons there

DanIsNearby: kk found this https://github.com/ton-connect/demo-dapp-with-react-ui

— 2024-01-04 —

Jan: I responded back (reply to 41014)

Kenny$$Shillz: https://youtu.be/D6t3eZPdgAU?si=19gIj8mIl7BFfn4D (reply to 41025)

Kenny$$Shillz: please where can i find info on ton storage?

Luke: anyone know what happened to toncontests chat?

VIKTOR: He is OK   https://t.me/toncontests_chat (reply to 41033)

Luke: Did I get kicked then? I never did anything tho (reply to 41034)

botmother: Hello guys, anyone knows where i can find the func code they used for this tutorial in NftCollectionCodeBoc and NftItemCodeCell  https://docs.ton.org/develop/dapps/tutorials/collection-minting

Luke: does anyone know how to make tuples longers than 255 chars?

Luke: because lisp lists dont have indexing functionality

User: You need store tuple in tuple, so you can overcome limit (reply to 41038)

&rey: Thanks. You have no guarantees that a dev will take your offer, though. (reply to 41029)

Galois field: Does tuple support random access？ (reply to 41039)

Luke: Yes, look at the tvm instructions (reply to 41046)

Kenny$$Shillz: hey devs sorry to spam with so many silly questions but is there a way to restrict number of nfts a wallet can mint?

Mehdi: sure , this is basic config afaik (reply to 41048)

Kenny$$Shillz: Sir please explain (reply to 41049)

Qko: Sirs, are there any scanner for ton tokens?

Mehdi: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#get-methods-1 (reply to 41050)

Mehdi: excuse me , I made a mistake , this is jetton supply , (reply to 41050)

Howard: Is there the FunC Library that can put Address Type calculated to String data type for smart contract address?   For example, how do you convert  EQATqIQLRMCQ9IyrByFLNvHP_iYr4encZF1M8li9KIOG0fL_  into  0:13a8840b44c090f48cab07214b36f1cffe262be1e9dc645d4cf258bd288386d1  in the FunC?

Mehdi: maybe you can find in func community library ,I saw some address snippet related  there (reply to 41054)

Mehdi: {-     address.fc      This library provide functions for MsgAddressInt type.  -}   (int) address::is_none(slice _addr) inline {     return equal_slices(_addr, addr_none()); }  (int) address::is_hole(slice _addr) inline {     return equal_slices(_addr, HOLE_ADDRESS); }  (int) address::get_workchain(slice _addr) inline {     (int wc, _) = parse_std_addr(_addr);     return wc; }  (int) address::get_hashpart(slice _addr) inline {     (_, int hp) = parse_std_addr(_addr);     return hp; }  (int) address::check_workchain(slice _addr, int _wc) inline {     return _addr.address::get_workchain() == _wc; }  ;; doest trigger error if addr is addr_none  (int) address::check_workchain_nofail(slice _addr, int _wc) inline {     if _addr.address::is_none() {         return true;     }          return _addr.address::check_workchain(_wc); }  (int) address::check_hashpart(slice _addr, int _hp) inline {     return _addr.address::get_hashpart() == _hp; }  (slice) address::serialize(int _wc, int _hp) inline {     return begin_cell()         .store_uint(4, 3) ;; 0b100 = addr_std$10 tag; No anycast         .store_int(_wc, 8)         .store_uint(_hp, 256)     .as_slice(); }  this in funcbox::address helper

Mehdi: and this is string helper from open contract ;    {-     strings.func         Provides operations on strings. -}  (slice) strings::base64url (slice bytes) {     int size = bytes.slice_bits() / 6;     builder result = begin_cell();      repeat (size) {         int code = bytes~load_uint(6);         if (code < 26) {             result~store_uint(65 + code, 8);         }         if ((code >= 26) & (code < 52)) {             result~store_uint(97 + code - 26, 8);         }         if ((code >= 52) & (code < 62)) {             result~store_uint(48 + code - 52, 8);         }         if (code == 62) {             result~store_uint(45, 8);         }         if (code == 63) {             result~store_uint(95, 8);         }     }      size = bytes.slice_bits();     if (size > 0) {         int code = (bytes~load_uint(size)) << (6 - size);         if (code < 26) {             result~store_uint(65 + code, 8);         }         if ((code >= 26) & (code < 52)) {             result~store_uint(97 + code - 26, 8);         }         if ((code >= 52) & (code < 62)) {             result~store_uint(48 + code - 52, 8);         }         if (code == 62) {             result~store_uint(45, 8);         }         if (code == 63) {             result~store_uint(95, 8);         }     }      return result.end_cell().begin_parse(); }

Mehdi: sorry ,hope helps (reply to 41057)

Jan: Understood, that's why I am asking (reply to 41043)

阿拉凡: {-     strings.func         Provides operations on strings. -}  (slice) strings::base64url (slice bytes) {     int size = bytes.slice_bits() / 6;     builder result = begin_cell();      repeat (size) {         int code = bytes~load_uint(6);         if (code < 26) {             result~store_uint(65 + code, 8);         }         if ((code >= 26) & (code < 52)) {             result~store_uint(97 + code - 26, 8);         }         if ((code >= 52) & (code < 62)) {             result~store_uint(48 + code - 52, 8);         }         if (code == 62) {             result~store_uint(45, 8);         }         if (code == 63) {             result~store_uint(95, 8);         }     }      size = bytes.slice_bits();     if (size > 0) {         int code = (bytes~load_uint(size)) << (6 - size);         if (code < 26) {             result~store_uint(65 + code, 8);         }         if ((code >= 26) & (code < 52)) {             result~store_uint(97 + code - 26, 8);         }         if ((code >= 52) & (code < 62)) {             result~store_uint(48 + code - 52, 8);         }         if (code == 62) {             result~store_uint(45, 8);         }         if (code == 63) {             result~store_uint(95, 8);         }     }      return result.end_cell().begin_parse(); }

Howard: Thanks! Let us me try out! (reply to 41057)

Howard: https://github.com/ston-fi/funcbox/tree/main/contracts (reply to 41057)

Mister Sir: Any devs looking for work dm

Howard: 😂🌊 (reply to 41054)

#: how to print NFT attributes? async def get_nft_address(client, index: int):     stack = (await client.raw_run_method(address='EQAfOby3S0letgu62PKDwjw8-nXhyw-zfnKqan7K0KGoRH6j',                                          method='get_nft_address_by_index', stack_data=[["number", index]]))['stack']     nft_address = read_address(Cell.one_from_boc(b64str_to_bytes(stack[0][1]['bytes']))).to_string(True, True, True)     return nft_address   async def pytonlib_get_owner(client, nft_address):     data = await client.raw_run_method(address=nft_address, method='get_nft_data', stack_data=[])     owner_address = Address(Slice(Cell.one_from_boc(b64str_to_bytes(data['stack'][3][1]['bytes']))).read_msg_addr()).to_string(True, True, True)      print(f"NFT Address: {nft_address}, Owner Address NFT: {owner_address}")      return owner_address  async def main():     client = await get_client()     stack = (await client.raw_run_method(address='EQAfOby3S0letgu62PKDwjw8-nXhyw-zfnKqan7K0KGoRH6j',                                          method='get_collection_data', stack_data=[]))['stack']      next_item_index = int(stack[0][1], 16)     content_bytes = b64str_to_bytes(stack[1][1]['bytes'])     content = Cell.one_from_boc(content_bytes).bits.get_top_upped_array().decode().split('\x01')[-1]      owner_address = Address(Slice(Cell.one_from_boc(b64str_to_bytes(stack[2][1]['bytes']))).read_msg_addr()).to_string(True, True, True)      # Extract NFT addresses dynamically     nft_addresses = []     for i in range(next_item_index):         nft_address = await get_nft_address(client, i)         nft_addresses.append(nft_address)      for nft_address in nft_addresses:         await pytonlib_get_owner(client, nft_address)      await client.close()      if __name__ == '__main__':     asyncio.run(main())

#: how to print NFT attributes?

Mehdi: curl --request GET --url 'https://tonapi.nftscan.com/api/ton/account/own/EQCPxaIxUgHqjK_nyngA0PYqLWcaNyb1CZ9WPB6XGPdunkTZ?show_attribute=true'

Mehdi: From https://docs.nftscan.com/reference/ton/get-all-nfts-by-account

Gulolio: Hi there guys, can anyone pointed out to me any doc related to deploying a smart contract from another. Or maybe a code snippet on how to do it with FunC

Howard: https://ton-community.github.io/tutorials/01-wallet/ (reply to 41072)

Jan: Hey guys, any developers here looking for work?

Чионг: I'm here and available to help, but I'm not a developer myself! If you need assistance or advice on finding developers or connecting with developer communities, I'd be happy to assist you.

Howard: any project want to onboard to TON, remember to approach with ton.org to contact with Ton Foundation, people in there are always willing to help! (reply to 41074)

Jan: @dev_rel do you have their contact?

Чионг: Điều quan trọng khi muốn tham gia dự án liên quan đến TON (Telegram Open Network) là liên hệ trực tiếp với Ton Foundation thông qua trang web chính thức của họ tại ton.org. Ton Foundation là tổ chức chịu trách nhiệm về các dự án liên quan đến TON và có thông tin và hỗ trợ cần thiết cho những ai quan tâm tham gia.  Nhớ rằng việc liên hệ trực tiếp với tổ chức chính là cách tốt nhất để có thông tin chính xác và hỗ trợ từ nguồn tin cậy. Họ có thể cung cấp hướng dẫn, yêu cầu và thông tin chi tiết về cách thức tham gia dự án TON một cách chính xác và an toàn.

Jan: I also need someone like yourself as developers relations

Howard: https://ton.foundation/ (reply to 41077)

DanIsNearby: Hi guys how does ton.app work?

DanIsNearby: why does app with 2 5 star reviews

DanIsNearby: is lower than app with 1 5 star review?

Ottavio: scam?

&rey: @DSamsara @Yoruyami Please use https://t.me/toncoin_it_chat for Italian. (reply to 41089)

&rey: It almost certainly is. For secure deals, please use sale smart contracts (one can be created on getgems.io) and ignore any "USDT" jettons you may receive. (reply to 41086)

User<6955603556>: how fetch data from contracts in js ? i find tonweb but i don't know how can i do it !

Ottavio: yes but my Number Is not listed (reply to 41101)

Ottavio: so strange they find me

&rey: Among some options, they might have found your wallet address. This isn't dangerous but they can know list of your assets. (reply to 41104)

Ottavio: have 15€ in ton ahhah

User<6955603556>: i want to call a function of smart contract in js, can you help me ? (reply to 41102)

not: i am trying to use typescript to make a template literal string to be passed as a memo in a TON tx and i am getting a BitString overflow issue. has anyone any luck with solving such a thing?

not: i am constructing a payload like this  payload:  `string here ${value} {"other": "json"},`

Gulolio: In task3 of tsc5, there's the following TL-B scheme _ new_version:uint32 migration_code:(Maybe ^Cell) = MigrationPayload; _ expected_version:uint32 new_code:(Maybe ^Cell) migrations:(HashmapE 32 MigrationPayload) payload:^Cell = InternalMsgBody;  And later in the description, they refer to the `migrations` dictionary as:  When handling incoming messages in your wrapper (the extra layer you're adding for versioning), you will have a "migration dictionary". This is a list of which versions need storage migration  My confusion it's, in the MigrationPayload scheme, there's one element called migration_code not migration storage or anything that refers to storage. It's ok to assume that this migration_code it's the storage migration they are referring to on the quoted text??

keddy: Are there some Api of TG wallet able to implement send asset  that triggered by specific event  in my program such as timer task

— 2024-01-05 —

裸裸: hello sir.

裸裸: I want request this:  https://testnet.toncenter.com/api/v2/getBlockTransactions?workchain=0&shard=8000000000000000&seqno=17095035&root_hash=8bbb1d9b8ebe77d57792d13e35f36a361d633735e948aa170e1fa804cbdbccb5&count=40  It can work very good.  while my code is use the tonapi-go pkg. it provide the apis https://docs.tonconsole.com/tonapi/api-v2

裸裸: so my question is. how to use the apis in the https://docs.tonconsole.com/tonapi/api-v2 to get the same result of the   https://testnet.toncenter.com/api/v2/getBlockTransactions?workchain=0&shard=8000000000000000&seqno=17095035&root_hash=8bbb1d9b8ebe77d57792d13e35f36a361d633735e948aa170e1fa804cbdbccb5&count=40

裸裸: I don't want to use two sdk. so...

R: What

裸裸: I means this.

裸裸: this is the api in https://testnet.toncenter.com/api/v2/#/blocks/get_block_transactions_getBlockTransactions_get

裸裸: while I want use this: https://docs.tonconsole.com/tonapi/api-v2

裸裸: to get the same result.

裸裸: so how to use.

裸裸: because all the old code is use this https://docs.tonconsole.com/tonapi/api-v2

裸裸: while I really need the function like api in that picture.

Luke: is there an equivalent NULLSWAPIF that returns 0 or some other int instead of null?

裸裸: https://github.com/tonkeeper/tongo/issues/227

裸裸: help

裸裸: Is there any dev can help me in this group?

Howard: fuckkkk basically we have to put String as Slice DataType and put in here right (reply to 41057)

Philip 菲力: simply use liteclient then iterate though all hashs you want (reply to 41130)

裸裸: what is liteclient?

裸裸: I only use one client in my project I think it is enouth.

Philip 菲力: yeah using restful api provided from others is also enough, so it depends on your use case

裸裸: but how to use and use which api. I cannot find it in the doc.

裸裸: may be you can tell me use which api and give me a demo http url.

Philip 菲力: sure, maybe after work

裸裸: thank you. you are very nice.

裸裸: while I need it at once because it blocked my job for about two hours. so Is there any other nice developer can help me.

裸裸: I am thinking about using another API system, so my project will have two sets of API systems. In the future, when I need to buy services, I will have to pay for both sets of API services, and that's definitely not possible. So, if I switch to the other API, I will gradually cancel the current API I'm using and only use the new one. This means I have to make some changes to the code, and I'm not sure if there will be new difficulties waiting for me. Therefore, it's a difficult decision, and I hope everyone can help me. Thank you.

User<6955603556>: what is gasless transactions ? where can i read more about it ? there is gasless transaction in ton roadmap, what is exactly ?

Andy: migration_code contains the code that you need to call to update the storage (reply to 41111)

裸裸: Since no one is helping me, I'll temporarily use the functionalities from https://toncenter.com/. It will give my project two sets of keys, and I feel like it should be fine.

小马: How to export the TON wallet private key? (reply to 41148)

Bear: hi, what happened if my contract that can't use the get method?

小马: I saw only the mnemonic phrase and no private key.

Bear: https://testnet.tonviewer.com/kQCNtWfzvFO9zrXAL6SdOFZzRGzYnRmbJ2mFlj94Z0hfcK2m?section=method   The get_jettonMinter_data is the get method I wrote that not at TEP standard (reply to 41150)

User: Integer overflow. Integer does not fit into −2256 ≤ x < 2256 or a division by zero has occurred.  https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 41152)

Bear: 🥲 (reply to 41153)

Mehdi: What you means ? I don't got exactly what the problem is ? You bring a repo containing this code , from ston.fi , and also you said that you can use literal string as slice , so at least I can't understand what you are looking for. (reply to 41148)

翻斗花园第一深情: hi  const seqno = await wallet.methods.seqno().call();  This code cannot get seqno and the return value is null. Is there any possible error that could cause this?

TON Answers Bot (not AI): Contract type unknown from Prokhor Minin  I created a wallet programmatically by following this article. I just copied the code and executed it. Created a wallet and created 2 transactions (incoming and outcoming)  But on tonscan.org it says that contract type is unknown (first screenhsot). Unlike the wallet that was created in Tonkeeper app (second screenshot)  Why does it work like this and how can I fix it?  !(https://github.com/len0xx/len0xx/assets/21990466/d037d5f4-49ce-4b91-a0c4-d1f6247ef35a)  !(https://github.com/len0xx/len0xx/assets/21990466/3553990e-a849-4389-9ba6-abb22ae6e802)  🔗 Answer on TON Overflow

ninja: hey devs, I transferred 0.1 TON from this wallet to some other wallet, you can see the current balance is 0 But the transaction hash hasn't appeared in the explorer  The wallet wasn't deployed before making the transaction, is that the reason for this failure?

ninja: there is no trace of the funds in the explorer

ninja: the other explorer shows this,   I just executed one transaction programatically  using @orbs-network/ton-access as rpc

ninja: also why is the first deposit labeled SCAM?

ninja: correct me if wrong, these are all network fees since I wanted to transfer 0.1 ton and didn't consider network fees  What is the ideal approach, also why did it kept trying when failed first time? (reply to 41161)

— 2024-01-06 —

not: why does tonweb createtransfermessage use onecell max for payload? whats the recommended way to send a ton transfer with a larger message without manually constructing raw cells

Fellow J: Hello

Fellow J: Any idea why the state shows inactive and the total amount in wallet doesn't show the ton value yet?

Fellow J: Do I need to wait for it to be active?

&rey: If wallet is uninitialized, it will return null. You should do ?? 0 then. (reply to 41156)

翻斗花园第一深情: const TonWeb = require('tonweb');  const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '3b617d26c48aebc729cf5c4601f4732c0cf14331674ad4762e419180704d1330'}));  const wallet = tonweb.wallet.create({address: 'EQAI9IoJmk--P5U9i4wa3UpI0juy-zcF-vJclvWS5NUa58Vh'});  async function sendTransfer() {       console.log(tonweb)     const seqno = await wallet.methods.seqno().call();      console.log(seqno); }  sendTransfer();

&rey: 1. Inactive because blockchain doesn't contain its code yet. You need to deploy the contract for it to work; if it's wallet, it will be deployed on first outgoing transfer by any library you use; any contract can also be deployed by incoming internal message with provided stateInit. (reply to 41167)

&rey: Are you familiar with ?? JS operator? (reply to 41170)

翻斗花园第一深情: Do I need to call a method on tonweb to activate this address?

&rey: Outgoing transfer will do that. (reply to 41174)

翻斗花园第一深情: I have already transferred money to this address

&rey: Yes, and money is there. How the contract would become init when money is transferred? (reply to 41176)

Fellow J: How to create that first outgoing transfer by any library if it's a wallet? (reply to 41172)

&rey: It looks like transactions failed so that seqno protection didn't work. This may be caused by outgoing messages trying to take more value than there is. You should ensure that outgoing messages have flag 2 (SEND_IGNORE_ERRORS). (reply to 41163)

&rey: Please refer to the documentation https://docs.ton.org. There are tutorials for several libraries IIRC. (reply to 41178)

CripticHood | Drops💧: Hello, what module should I add to get the WalletContractV4R2 to get the format used in Tonkeeper ? Currently there's only WalletContractV4 from (@ton/ton)

翻斗花园第一深情: You must obtain seqno before transferring money, but when I call the tonweb SDK method to obtain seqno, it is null. I don’t understand whether there is a problem with my code or what other operations need to be done.

&rey: When seqno is null, it shall be replaced with zero. (reply to 41182)

翻斗花园第一深情: ok   i try again

&rey: Does it return other address? (v4r1 was deprecated because it was hard to use without get-methods) (reply to 41181)

翻斗花园第一深情: thanks

CripticHood | Drops💧: Review your implementation carefully, making sure to follow these steps. It's crucial to obtain the sequence number (seqno) before proceeding: Note that you most get the seqno first 1. const seqno = await WalletContract.getSeqno(); //Outside your whileloop if are useing try() it should be outside the try() 2. let currentSeqno = seqno;  //outside the whileloop   3.  while (currentSeqno == seqno) {  //set your while condition like so      console.log("waiting for transaction to confirm...");      await sleep(1500);      currentSeqno = await walletContract.getSeqno();    }    console.log("transaction confirmed!");  } (reply to 41182)

CripticHood | Drops💧: I can't even find it from @ton/ton module, it only include v1 v3r2...V4 (reply to 41185)

CripticHood | Drops💧: there's no V4R1 or 2

&rey: Just V4 returns other address? (reply to 41189)

Tim: @ton/ton is v4r2 (reply to 41188)

CripticHood | Drops💧: Yes (reply to 41190)

CripticHood | Drops💧: Or are we suppose to import it from another module ? Because there's only V4 in this module of @ton/ton (reply to 41190)

CripticHood | Drops💧: I'm using npm package to install

Howard: is there possible to print Address in String? (reply to 41056)

Andrey: You need to store address to slice with   slice my_cs = “EQATqIQLRMCQ9IyrByFLNvHP_iYr4encZF1M8li9KIOG0fL_”a  Than you can use (int wc, int addr) = parse_std_addr(my_cs);  wc and addr are int with base 10. Next you need to convert wc to utf8 char and address to hex and then to utf8 char string.   For hex convertation:  (use smth like this)  But don’t forget to zero fill result, because encode_number_to_text(addr, 16) will skip first zeroes in any hex form address (so hex address 000…0001 will be just `1`). You need to pad with zero to 64 symbols.  After success convertation you need to concat slices (wc + “:” + addr) to final string (reply to 41054)

Samyar: https://answers.ton.org/question/1654418338874396672/transfer-jetton-destination-address-is-not-useable

&rey: slice my_cs = "EQATqIQLRMCQ9IyrByFLNvHP_iYr4encZF1M8li9KIOG0fL_"a; works as well. (reply to 41198)

Howard: I am stuck in Tact level that; we only have:  myAddress().asSlice() (reply to 41200)

&rey: And it's possible to avoid slice concatenation by storing everything into single builder. (reply to 41200)

Howard: Sorry, I am confusing right now. To solve this:  - You need to know how Address data type can convert to other data type - You need to know what is slice, cell, and string data type (reply to 41198)

#: C:\Users\Ryzen\PycharmProjects\tonnftmint\venv\Scripts\python.exe C:\Users\Ryzen\PycharmProjects\tonnftmint\contracts\deploy_internal.py  Traceback (most recent call last):   File "C:\Users\Ryzen\PycharmProjects\tonnftmint\contracts\deploy_internal.py", line 67, in <module>     asyncio.get_event_loop().run_until_complete(deploy_collection())   File "C:\Users\Ryzen\AppData\Local\Programs\Python\Python311\Lib\asyncio\base_events.py", line 653, in run_until_complete     return future.result()            ^^^^^^^^^^^^^^^   File "C:\Users\Ryzen\PycharmProjects\tonnftmint\contracts\deploy_internal.py", line 39, in deploy_collection     seqno = await get_seqno(client, wallet_address)             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\Ryzen\PycharmProjects\tonnftmint\contracts\deploy_internal.py", line 30, in get_seqno     data = await client.raw_run_method(method='seqno', stack_data=[], address=address)            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\Ryzen\PycharmProjects\tonnftmint\venv\Lib\site-packages\pytonlib\client.py", line 244, in raw_run_method     contract_id = await self._load_contract(address)                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\Ryzen\PycharmProjects\tonnftmint\venv\Lib\site-packages\pytonlib\client.py", line 212, in _load_contract     result = await self.tonlib_wrapper.execute(request, timeout=self.tonlib_timeout)              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ pytonlib.tonlibjson.TonlibError: LITE_SERVER_NOTREADY: block is not applied  Process finished with exit code 1 I entered https://ton.org/global.config.json , the collection is not deployed to the mainnet

Andrey: All comes simple, when you understand basic of TON (cells / slices).   In Func (actually in TVM, because Func is just sugar with some optimizations to TMV OP codes) there’s no custom types and objects. You operate only with int, slice, cell, builder, tuple (there are other types, but they pro level, you never use them irl).  So all you have is very big integers and bits that are separated into cells/slices which are refer to other cell/slice.  Now as we know basic - answer is simple: there is no such thing as string data type or address data type inside func. You only have bit-representation of such things. For bit representations you use TLB schemes and operate with integers, slices, cells for them.  So “EQATqIQLRMCQ9IyrByFLNvHP_iYr4encZF1M8li9KIOG0fL_”a uses Std address tlb scheme to create slice (all func string literals create slices) of such address. And such tlb schema (actually 2 of them, but you don’t use irl second) is only way to correct store address inside TVM. You actually can create own way of store, but all std functions operate with basic TLB schemes (as `parse_std_addr`).  (int wc, int addr) = parse_std_addr(my_cs); is just “fast bit extractor to two integers with usage of std address tlb scheme” because actually what you need from address is workchain and hex (stateinit hash) part. Devs are using them to calculate access levels or validate something.  So all you need to know is what is TVM, what is cell and how TVM operate with them: https://docs.ton.org/tvm.pdf you can start with 1.1 (reply to 41203)

CripticHood | Drops💧: Any update on this (reply to 41193)

Tim: I've replied to you (reply to 41193)

CripticHood | Drops💧: But I can't import V4R2 if you look at the picture I sent there's no 4R2 in the list of options (reply to 41191)

Tim: It's v4r2

Tim: V4 = v4r2

CripticHood | Drops💧: I see, but I'm getting the (K) address format when I query my address

CripticHood | Drops💧: Although it gets converted to E or U when I use tonview or scan. How can I get a desired format ?

Tim: K means Testnet

Kenny$$Shillz: Have U sent a transaction from that wallet? (reply to 41168)

Kenny$$Shillz: May be check the version of ton client you are using .. (reply to 41181)

CripticHood | Drops💧: I'll give that a check when am back on pc

CripticHood | Drops💧: I'll check my network mode code probably it's not updating and I'm stuck on testnet, but when I  use the toggle to switch between mainnet and testnet from by UI I see zero balance on main which is true and 7.27 balance on testnet which is also true, but the address remains unchanged (reply to 41213)

CripticHood | Drops💧: This was the answer I'm looking for 📍   https://docs.ton.org/develop/dapps/cookbook#how-to-obtain-different-types-of-addresses-and-determine-the-address-type

DanIsNearby: i can not send messages as myself on my chat

DanIsNearby: liike for some reason after i connected it as a discussion channel it does not let me even tho i already unlinked the channel and it is not linked

&rey: This chat is related to TON, not Telegram. (reply to 41222)

DanIsNearby: kk fixed if anyone will have issue like that leave and rejoin the group as an owner you will still come back as owner

Dmitry: hey guys is it possible to:  1) get KYC status for specific TON wallet via API? 2) get country of the user for said KYC via API?

&rey: KYC status with respect to what service? TON, The Open Network, doesn't have integrated KYC for smart contracts. (reply to 41232)

Dmitry: I need to understand if I can fetch the fact if certain user with @wallet has passed KYC with wallet and Ideally to understand user country based on said KYC (from @wallet) (reply to 41233)

&rey: I think that's unlikely. (reply to 41234)

Dmitry: how to raise a change request for it? it would be very useful tool

CripticHood | Drops💧: Do you mean ( If its possible to have a contract that can verify other wallet address, to show their status as verified or not verified by a service?) (reply to 41234)

Dmitry: having a smart contract for this would be nice but for now I need to understand if I can call Telegram API (centralized) directly to know KYC status for certain wallet (reply to 41237)

CripticHood | Drops💧: No you can't (reply to 41238)

CripticHood | Drops💧: And telegram doesn't do kyc or collect users data for that, so basically you'll need to create your own app to do that.  It may be helpful when there's a service that requires to know if their users are real. Then the users will have to go to your website for kyc and any service that require to know the authenticity of a wallet will hold you as a trusted supplier.

Dmitry: it does, though (reply to 41240)

CripticHood | Drops💧: Isn't that KYC for P2P trading ? (reply to 41241)

Dmitry: not sure, but this thing could be very useful. so I need to know if I can access this data (not KYC details, just the fact if user passed or not)  if it is not possible to access, I'd love to know how to get developers attention to this, as it could be used in many apps

CripticHood | Drops💧: You can't access that data. But you'd be able to see the KYC status of someone that places a buy or sell order in  P2P market within the webapp is kycd (reply to 41244)

Dmitry: if its possible to access the fact that user has passed KYC in webapp, it means there should be some API to show KYC status  thats exactly what I need (reply to 41245)

CripticHood | Drops💧: I'm not sure I you're following the idea behind  kyc (Know Your Customer) not share your customers data. Even if there's an API they'll only share the status of a wallet with a partnered service not make it open for everyone to see. (reply to 41246)

Dmitry: I am very familiar with KYC and Sumsub KYC they have.  I dont need to know user data (sex, age, name, etc) I just need to know if a certain wallet has passed KYC or not   if wallet passed KYC it is already a good indicator that user is probably not a bot and I can use this fact in my app (reply to 41247)

CripticHood | Drops💧: Well you can talk to @wallet team for that. (reply to 41249)

Dmitry: Thanks! where I can find these guys? :)

Dmitry: asked wallet support already but would love to get a real dev there to pitch them this idea

&rey: Please note that KYC verification fact will not be available in blockchain. If you choose to use that data, you'll lose decentralization, and I wouldn't do that.

Dmitry: it is possible to implement KYC in blockchain too in fact, it is quite easy to do  just need to have a smart contract which will store ton addresses which has passed KYC  this smart contract could be populated based on user input, i.e. only store this information if user specifically agreed to pay some TX fees for that

CripticHood | Drops💧: Unless he's building some centralised services to stay on a decentralized network they required user verification and validity. (reply to 41253)

Dmitry: indeed, this smart contract need to be deployed and maintained via wallet team which is centralized entity..  but even in blockcahin you have centralized things like Oracles to fetch data from the real world it would be just kind of an Oracle for KYC

CripticHood | Drops💧: This looks like a contract agreement, not what I was thinking 💭 (reply to 41254)

&rey: But what stops [centralized entity you choose]'s oracle from allowing their own bots — for instance, to milk airdrops? (reply to 41256)

CripticHood | Drops💧: Trust and faith is our only hope (reply to 41258)

Dmitry: its a matter of a trust... same trust as you have for USDT what if they create USDT out of thin air? (reply to 41258)

&rey: That's why I have more trust for TON...  It seems that you want to know the country of user. It's one stop from blocking certain countries. I don't want to help in building such projects. (reply to 41261)

CripticHood | Drops💧: It all comes down to ethics and   hope they don't abide by the rules. (reply to 41261)

Dmitry: I want to create advertising app, and it is critical to know user country at least you usually want to show ads only for certain specific country (as example) (reply to 41262)

CripticHood | Drops💧: That well you don't need KYC for that (reply to 41264)

CripticHood | Drops💧: Why not just track then with the ip they use when visiting your app?

&rey: If user uses TON Connect 2, you will get request for tonconnect-manifest.json from their device, and that (+ IP) should allow you to determine language/country. (reply to 41264)

&rey: That will allow for all wallets (including non-custodial ones) rather than just @wallet users.  Also, you may introduce a server delay in returning manifest if the request is suspicious (same wallet configuration as with many others).

Dmitry: yeah I dont think wallet will ever give me a country of the KYC, it would be just nice to have

CripticHood | Drops💧: Are you from Facebook ? (reply to 41269)

Dmitry: no core thing I need is to know if user passed KYC or not, thats the main thing which I need.

CripticHood | Drops💧: You seem so eager to get that data 😂

Dmitry: facebook would not be happy with just KYC fact, they'd need all other details and more

CripticHood | Drops💧: Then your request is reasonably fair I guess 😎 (reply to 41273)

翻斗花园第一深情: hi,I created a wallet, but when I checked it in tonview, it showed that it did not exist. When I tried to activate the wallet when I transferred money, it seemed to be returned. Why?  EQD723yz8tajwo1Ow6MZqnkfHbZ3GpkIX3-Tp9H-S3F8i6gf

Creature: Hello. How can I send jetton with js?

CripticHood | Drops💧: How did you create the wallet? programmatically | using wallet app? if yes what app sis you use? (reply to 41275)

CripticHood | Drops💧: Refer to this : https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment (reply to 41276)

Creature: THANK YOU! (reply to 41278)

CripticHood | Drops💧: Keep toning up dev (reply to 41279)

Toheeb: Hi guys   is there anyone attempting the TON Challenge 5?

Creature: How can I wait until the transaction is confirmed? (reply to 41278)

CripticHood | Drops💧: You can introduce    await new Promise(resolve => {         setTimeout(() => {             console.log("Async operation completed.");             resolve();         }, 1000);     }); (reply to 41283)

Creature: I mean, how can I check if the transaction is confirmed? (reply to 41284)

CripticHood | Drops💧: the wallet should handle the confirmation, remember this is not a full implementation.

CripticHood | Drops💧: assuming you are refering to "How to construct a message for a jetton transfer with a comment?" from the cookbook

Creature: https://tonviewer.com/transaction/5ff3b447ea807ff89f343391826e4a6fe68bf1cfb253286320ccf5ddf89bc2d3

Creature: Failed. Hope you help me.

Toheeb: I need help regarding the Tasks (reply to 41282)

Creature: Hope you help me. (reply to 41286)

Creature: const TonWeb = require("tonweb"); const {mnemonicToKeyPair} = require("tonweb-mnemonic");  async function main() {     const tonweb = new TonWeb(new TonWeb.HttpProvider(         'https://toncenter.com/api/v2/jsonRPC', {             apiKey: 'put your api key'         })     );     const destinationAddress = new TonWeb.Address('put destination wallet address');      const forwardPayload = new TonWeb.boc.Cell();     forwardPayload.bits.writeUint(0, 32); // 0 opcode means we have a comment     forwardPayload.bits.writeString('Hello, TON!');      /*         Tonweb has a built-in class for interacting with jettons, which has         a method for creating a transfer. However, it has disadvantages, so         we manually create the message body. Additionally, this way we have a         better understanding of what is stored and how it functions.      */      const jettonTransferBody = new TonWeb.boc.Cell();     jettonTransferBody.bits.writeUint(0xf8a7ea5, 32); // opcode for jetton transfer     jettonTransferBody.bits.writeUint(0, 64); // query id     jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN('5')); // jetton amount, amount * 10^9     jettonTransferBody.bits.writeAddress(destinationAddress);     jettonTransferBody.bits.writeAddress(destinationAddress); // response destination     jettonTransferBody.bits.writeBit(false); // no custom payload     jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0.02')); // forward amount     jettonTransferBody.bits.writeBit(true); // we store forwardPayload as a reference     jettonTransferBody.refs.push(forwardPayload);      const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));     const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {         address: 'put your jetton wallet address'     });      // available wallet types: simpleR1, simpleR2, simpleR3,     // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2     const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {         publicKey: keyPair.publicKey,         wc: 0 // workchain     });      await wallet.methods.transfer({         secretKey: keyPair.secretKey,         toAddress: jettonWallet.address,         amount: tonweb.utils.toNano('0.1'),         seqno: await wallet.methods.seqno().call(),         payload: jettonTransferBody,         sendMode: 3     }).send(); // create transfer and send it }  main().finally(() => console.log("Exiting..."));

Creature: Not work.

Creature: Code from here. (reply to 41278)

CripticHood | Drops💧: Try this approach to check for any error, don't forget to put the required info.   const TonWeb = require("tonweb"); const { mnemonicToKeyPair } = require("tonweb-mnemonic");  async function main() {   try {     console.log("Initializing TonWeb...");      const tonweb = new TonWeb(new TonWeb.HttpProvider(       'https://toncenter.com/api/v2/jsonRPC', {         apiKey: 'put your api key'       })     );      console.log("TonWeb initialized successfully.");      const destinationAddress = new TonWeb.Address('put destination wallet address');      const forwardPayload = new TonWeb.boc.Cell();     forwardPayload.bits.writeUint(0, 32); // 0 opcode means we have a comment     forwardPayload.bits.writeString('Hello, TON!');      const jettonTransferBody = new TonWeb.boc.Cell();     jettonTransferBody.bits.writeUint(0xf8a7ea5, 32); // opcode for jetton transfer     jettonTransferBody.bits.writeUint(0, 64); // query id     jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN('5')); // jetton amount, amount * 10^9     jettonTransferBody.bits.writeAddress(destinationAddress);     jettonTransferBody.bits.writeAddress(destinationAddress); // response destination     jettonTransferBody.bits.writeBit(false); // no custom payload     jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0.02')); // forward amount     jettonTransferBody.bits.writeBit(true); // we store forwardPayload as a reference     jettonTransferBody.refs.push(forwardPayload);      const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));     const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {       address: 'put your jetton wallet address'     });      console.log("Creating transfer...");      const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {       publicKey: keyPair.publicKey,       wc: 0 // workchain     });      const seqno = await wallet.methods.seqno().call();      console.log("Transfer details:");     console.log(`- Destination Address: ${destinationAddress.toString()}`);     console.log(`- Transfer Amount: ${tonweb.utils.fromNano('0.1')} TON`);     console.log(`- Sequence Number: ${seqno}`);      console.log("Sending transfer...");      await wallet.methods.transfer({       secretKey: keyPair.secretKey,       toAddress: jettonWallet.address,       amount: tonweb.utils.toNano('0.1'),       seqno: seqno,       payload: jettonTransferBody,       sendMode: 3     }).send(); // create transfer and send it      console.log("Transfer sent successfully!");   } catch (error) {     console.error("Error:", error);   } finally {     console.log("Exiting...");   } }  main(); (reply to 41295)

Creature: It worked.

Creature: Thank you.

CripticHood | Drops💧: Happy coding 🎉 (reply to 41300)

Gulolio: Guys one question here related to task3 in tsc5. Just to verify if what I'm thinking it's correct, and in case I'm not how can I solve this issue. One of the things that it's required in the task is to "update the contract code" when it's needed. Is it correct to assume the following?  ;; update_code comes in the inbound message, the second argument of the message        ;; set_code will update the contract code after a successful termination of the current run         set_code(update_code);         ;; set_c3 will set the c3, which according to the doc         ;; "Contains the current dictionary, essentially a hashmap containing         ;; the code of all functions used in the program"         ;; So after this call, I could access for example "migrate_one" that it's in the "update_code", right?         set_c3(update_code.begin_parse().bless());         ;; will call "migrate_one" with the current code association in my old c3         ;; in the new code. To avoid this, I've read the it's recommended to fix the         ;; code associated to this method, in both contracts, the new one and the old one.          ;; For example using method_id(1666), I've seen something like this in the elector contract         ;; and in the dns resolver contract. I've put the links bellow.         cell new_storage = migrate_one(old_storage);  Now I think I'm missing something here, because, I have no way to fix "method_id(1666)" in the incoming code, the "update_code" I mean. On my tests when I don't fix this "method_id" to the "migrate_one" and "process_message" as well, I get exit code 11. Which according to the doc it's:  Most oftenly caused by trying to call get-method whose id wasn't found in the code  Links: DNS contract and Elector contract

Mehdi: Replacement of func with c , in code snippets makes highlight works , would you please edit it , thank you (reply to 41302)

zZackz: any lib in rust lang ?

Galois field: Hello! Is there any efficient way to convert an int into a slice?

Pilot: Hello guys  We need a developer to write a Smart contract on TON  Can anyone here do it?

User: The best way is use cell  slice number_to_slice(int number) {     ;; convert int to slice     var msg = begin_cell();      var msg = store_signed(msg, number).end_cell();       return msg.begin_parse(); } (reply to 41305)

Amir: Is it safe to use tontools package? When I installed it, I got an error from my antivirus saying it has a malware called CoinMiner!  ESET detection: a variant of Win64/CoinMiner.TB potentially unwanted application

CripticHood | Drops💧: Am not sure where that came from, but it shouldn't be there. The package is corrupted when downloading. (reply to 41308)

Amir: I just installed it using pip install tontools 🤷‍♂️ (reply to 41310)

Amir: Is there another package I can use to send TON using Python? (reply to 41310)

CripticHood | Drops💧: I saw one in the docs but I can't remember the name

Amir: OK thanks 👍 (reply to 41313)

CripticHood | Drops💧: Run your anti-virus incase there's a malicious program adding that to file that went unnoticed by it (reply to 41312)

— 2024-01-07 —

Gulolio: Anyone? (reply to 41302)

Andy: basically this updating is dependent on the function order, and as long as the migration code will have all the same functions (not sure if all the functions are needed now that I think about it) in the same order the call will work. that's why the migrate_one is within the <<<<< >>>>> update-able part of the code - its place should not be changed. (reply to 41302)

User<968543604>: how can i take a Ton Master NFT?

User<968543604>: Please guide me

Gulolio: If I get you right, this is assuming that you will have recv_internal, process_message and migrate_one only? In this same order. I understand the part of <<< and >>>, to replace the last two, but if you had auxiliar functions before these functions, will that matter? For example if you have in this order, fun1, fun2, recv_internal, process_message and migrate_one, would that affect it? (reply to 41324)

Ainaz: Hello friends How to send an NFT from a user's wallet to another wallet?

Kenny$$Shillz: You can do this using getgems.io (reply to 41328)

Ainaz: I mean by code and Api tools (reply to 41329)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: by sending transfer request transaction from user's wallet to the NFT address (reply to 41328)

Kenny$$Shillz: U send a transfer message to the nft item contract address (reply to 41330)

Amir: How can I get the TX Hash of the transaction after sending? I think I should convert @extra in the response.

Piotrek: Hi, how can I get data of NftCollection and NftItems inside this collection

Piotrek: Or are there any good ton web docs?

TON Answers Bot (not AI): Redirect user after connecting to wallet from No Name  I'm using the ton-connect to connect the wallet from a bot. however after the user confirms the connection in the wallet, he's being redirected to walletbot.me/undefined  how do i change this behavior? ideally I would like the user to be redirected back to the bot. but even just staying inside the wallet is better than the user seeing a blank page  🔗 Answer on TON Overflow

Mehdi: This may help https://docs.ton.org/develop/dapps/cookbook#how-to-change-the-content-in-a-collections-smart-contract (reply to 41334)

Gulolio: In the ton documentation there's this snippet of code, to build the state init: () build_stateinit(cell init_code, cell init_data) {   var state_init = begin_cell()     .store_uint(0, 1) ;; split_depth:(Maybe (## 5))     .store_uint(0, 1) ;; special:(Maybe TickTock)     .store_uint(1, 1) ;; (Maybe ^Cell)     .store_uint(1, 1) ;; (Maybe ^Cell)     .store_uint(0, 1) ;; (HashmapE 256 SimpleLib)     .store_ref(init_code)     .store_ref(init_data)     .end_cell(); }  Shouldn't be this:  () build_stateinit(cell init_code, cell init_data) {   var state_init = begin_cell()     .store_uint(0, 1) ;; split_depth:(Maybe (## 5))     .store_uint(0, 1) ;; special:(Maybe TickTock)     .store_uint(1, 1) ;; (Maybe ^Cell)     .store_ref(init_code)     .store_uint(1, 1) ;; (Maybe ^Cell)     .store_ref(init_data)     .store_uint(0, 1) ;; (HashmapE 256 SimpleLib)     .end_cell(); } The difference it's basically the order in which init_code and init_data it's placed.  The link to the doc can be found here: https://docs.ton.org/develop/func/cookbook#how-to-build-a-stateinit-cell

Gulolio: it doesn't matter right? (reply to 41342)

CripticHood | Drops💧: It shouldn't as long as it behaves the way you expect it to, I haven't started anything on func yet, so my opinion wouldn't add value 😬 (reply to 41343)

Gulolio: What's the point of answering then (reply to 41346)

CripticHood | Drops💧: Not to feel ignored I guess 🤔 (reply to 41347)

Slava: There shouldn't be any difference when you call store_ref as far as you call them in the correct relative order. However, it's better to call them in the end for consistency and readability (convention). (reply to 41342)

Gulolio: Thanks (reply to 41351)

Jack: Hey everyone! I know this is dev chat, but i have a Q about TON as im really excited about its ecosystem  Im currently living in Hawaii, USA and im unable to create a waller within telegram. (Maybe i can try using a VPN on the phone, didnt work on desktop)   Will i be unable to participate in certain functions of TON because of my location? Any insight appreciated

CripticHood | Drops💧: No you won't, since Ton is a decentralized blockchain no one really cares if you're using a vpn unless it's an app specific requirement. Almost all the apps could be accessed using VNP as of now. (reply to 41353)

Jack: thnx for reply chief. I tried VPN on Desktop, no luck. Maybe ill try again on both (mobile/Desktop) restart TG after VPN (reply to 41354)

CripticHood | Drops💧: There's a browser interface and extension wallets you can give them a try. Check list of supported wallets here:  https://ton.org/wallets?locale=en&pagination

NIK: /report (reply to 41358)

— 2024-01-08 —

裸裸: can  anyone help me to calculate the fee.

裸裸: when I transfer from A to B.  the balance is changed. balance A before balance B before balance A after balance B after

裸裸: feeA = Ab - Aa

裸裸: feeB = Bb - Ba

裸裸: while it is the balance change.

裸裸: but how can I calculate it when I only have the transactions?

裸裸: https://testnet.toncenter.com/api/v2/getBlockTransactions?workchain=0&shard=8000000000000000&seqno=17095035&root_hash=3cd2a84eb2843712434e3505fb4a2e10b9eb801b0536460c76d7cdc7509035ae&count=40

裸裸: like this.

裸裸: I have three tx.

裸裸: how to calc the feeA = 8585091

裸裸: can anyone help me?

裸裸: I requested the api and get some fees. and I try to sum them.

裸裸: while the result is not match.

裸裸: help

裸裸: help

Midnightmadwalk: @dev_rel dm

Dr. Fomo McMoon: Hey guys

black: hi

Dr. Fomo McMoon: Quick question here as well, from all the docs it doesnt exactly become clear to me how transactions propagate

Dr. Fomo McMoon: Especially during the 5-6 sec time it takes for them to finalize

black: I didn't find that way

Dr. Fomo McMoon: Is there a mempool on ton or not?

Dr. Fomo McMoon: Or is tx propagation a bit more like solana where all txns go to validators directly

black: Do you know how to use this method? (reply to 41381)

Dr. Fomo McMoon: Not sure but that might be a bit risky (reply to 41386)

Dr. Fomo McMoon: Because sending does not mean it got finalized

Dr. Fomo McMoon: So if u wait until its sent and then try getting it immediately, it could be that its not yet finalized

Dr. Fomo McMoon: At least thats an issue on solana

Dr. Fomo McMoon: So if u have something like "sendAndConfirm", await that instead of maybe put a 7 sec sleep before sending and getting the transaction

black: From what library can I call this method getTransaction I can't use this method at the moment

Nir: Hi all, I'm working on integrating the TON wallet in a bot, however, once the user connects it, it sends him to a blank page instead of returning him to the wallet/bot. how do I cahnge the redirect behaviour of the ton-connect python library?

simple: Hi everyone,curl getMasterchainInfo return below {"ok":false,"error":"No working liteservers with ls_index=None, archival=None","code":503} How to solve?

TON Answers Bot (not AI): How to handle fees for a Jetton from samyar  We are making a Jetton for a game that users can deposit and withdraw from their wallet. But i was wondering how can we handle the fees for the transactions between wallets as it's about 0.05 TON and with a lot of transactions it can cost more than we earn   So what's the solution for this problem ? should we pay the fees ? if it's the user how can i they pay it (right now we have a wallet in database for each user so there are no transactions in the system for now since we plan on creating a wallet for each user)  🔗 Answer on TON Overflow

He: I would like to ask if the balance value of a contract is always 0, which means that the contract has no gas, will this contract be deleted by the ton chain after a period of time?

jasio: Hello guys i have some problem with telegram wallet,, can someone help me?

Piotrek: Hi, is there any possible way to decode Cell data in JavaScript?

Yuri: Hello guys, is there an available implementation of a vesting contract for jettons?

TON Answers Bot (not AI): How to retrieve TON assets from my own Telegram Wallet from jasio  I have problem with telegram toncoin wallet. Yesterday I send some TON assets (called MORFEY) from TONkeeper wallet to Telegram wallet.  Here is tx of transaction: https://tonviewer.com/transaction/cb0c8aed17f58adf24bd443b102a81ad851e66ae863d2160b8e9e3f5b3abe9ff  I send assets to this wallet (I'm the owner): UQATTtxxyOeLOqe6bWSNNpSnEhQXquqExXzRm-jvVTUIrFOP  But I cant do anythink with  this toknes, I dont even see them in my wallet.  On ton viewer wallet have uninit status: https://tonviewer.com/EQATTtxxyOeLOqe6bWSNNpSnEhQXquqExXzRm-jvVTUIrA5K  Please, can someone help me with this problem?  🔗 Answer on TON Overflow

jasio: Please if any one can help

Chicken Little: hey guys, can you point me to tutorial and docs in .TACT, i dont have time to learn FunC

&rey: When balance is -0.1 TON, contract is frozen (code and data replaced by hashes). When it reaches -1.0 TON, it's deleted. (reply to 41397)

&rey: Are you interested in BOC string —> Cell conversion or Cell —> some data? The former: TonWeb.boc.Cell.oneFromBoc(...) or Cell.fromBase64(...) The latter needs TL-B scheme, otherwise it's bunch of bits and references which don't mean anything. (reply to 41400)

He: Thanks🙏

&rey: https://tact-by-example.org/all (reply to 41404)

Chicken Little: thx chief

Nir: Is there a way to create a link in telegram that will send the user directly to the ton space wallet?

He: Is there any way to contact the telegram wallet development organization? Because of the failed transfer, I transferred part of the jetton funds to the Toncoin address in the telegram wallet wallet and could not withdraw it.

He: 😂

&rey: I think you may write to their support but I've heard zero cases when jettons were returned. (reply to 41411)

&rey: It likely shares ticker or name with a well-recognized existing token; is it so? (reply to 41393)

VIKTOR: yes. we wait refund) (reply to 41413)

He: In fact, as long as they provide me with the mnemonic phrase of my wallet, I can withdraw my funds from any external wallet. However, their wallet plug-in does not have the function of obtaining the mnemonic phrase, which is a big headache.

&rey: @subden it seems a Tonviewer problem.. (reply to 41415)

He: And I haven't found any valid contact details That's even more of a headache😂

Denis: we limited sets of unicode alphabet for avoid different USDT/BOLT and over tokens cloning (reply to 41418)

jasio: i have the same issue (reply to 41411)

jasio: and supprot team didnt answare

Chicken Little: can i verify a tact contract on verifier.ton.org?  it doesn't let me drop a .tact contract in the box

Chicken Little: any idea? (reply to 41423)

simple: Using CLCF creates the/usr/bin/ton/local. Config. Json, Use ton-http-api/ to access the "error":"No working liteservers with ls_index=None, archival=None" Is there a solution? We need to run the archive node

Chicken Little: guys please can someone give me a hand on this? (reply to 41423)

Chicken Little: i asked in the verifier support chat and also no answer

CripticHood | Drops💧: Checkout highload wallet, with it you can bundle more transactions in one and send it, but even with the regular wallet I was able to bundle 4 max to one transaction and send it. That should also work for jetton, although I haven't implemented that on my end. Check the Github   https://github.com/scaleton-labs/highload-wallet (reply to 41396)

CripticHood | Drops💧: Or the docs on highload wallets for implementation

CripticHood | Drops💧: They didn't mention anything about their repo. @tonverifier (reply to 41423)

CripticHood | Drops💧: You finally verified 🎉 (reply to 41423)

Chicken Little: i did

Chicken Little: they added tact 1.1.5 for me

Chicken Little: boolish

Chicken Little: thx guys

Андрей: It looks like your node is not synchronized, or the firewall is not allowing packets to reach the node (reply to 41425)

User<6660578851>: Hey fam, glad to be here.   Anyone have any info on how to revoke mint authority on tokens?

CripticHood | Drops💧: Mint authority is only requested when you want to mint and terminated after wards, Tonconnect UI doesn't hold the wallet approval and use it again without your notice. (reply to 41439)

&rey: The common method is transferring that authority to "burn address". I don't remember which address of [null, 0:000...000, -1:000...000, 0:FFF...FFF, -1:FFF...FFF] is recognized as such. (reply to 41439)

ston: Hello, How can I get the jetton wallet address of the wallet connected using TON Connect UI React? 🤔

Gunnar: you can call the get_wallet_address get-method on jetton master contract passing in the wallet address. (but I don't have a code sample for TON Connect handy) (reply to 41442)

Chicken Little: hey guys how using @ton/ton npm packages can I instantiate the sTON dex contract?  https://tonscan.org/address/EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt#source  I see in the source that I can pass an ABI but where do I get that ABI? 🤔  if someone can just point me to a cookie cutter example of listening to swap events on the sTON contract that would be really helpful

Chicken Little: also can someone explain to me what pTon is?

Chicken Little: is it like weth?

Chicken Little: wrapped ton?

Guziec: Guys i am new in the TON world. How to make a app with UI in telegram app? What technologies i need to use?

Chicken Little: use a telegram library with your language of choice and it'll show you how to use the buttons etc (reply to 41449)

Guziec: yo mean the TDLIb? (reply to 41450)

Guziec: https://core.telegram.org/tdlib/docs/

Chicken Little: yeah but use a layer higher

Chicken Little: https://www.npmjs.com/package/node-telegram-bot-api

Guziec: but will it allow me to build the UI applications? like small applications?

Chicken Little: you mean the menu buttons and all that right

Guziec: got it!

iTz_Black: hello, is there any method for looking up transaction and fetching txn data by hash of tx

iTz_Black: such as there is method to fetch blocks and transaction of that block, but there is none to fetch a single tx data

iTz_Black: it explicitly asks for an address why cant i do it with only from_hash

Александр: what the font? (reply to 41463)

iTz_Black: Monaspace Krypton (reply to 41465)

MonoBit: Hey guys I get this error using @stdlib/jetton  Error: Could not resolve import @stdlib/jetton  Do you know how to solve?

Chicken Little: any thoughts on this guys (reply to 41444)

Mehdi: would you please explain this TL-B schema :     tail#_ {bn:#} b:(bits bn) = SnakeData ~0; cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);  thanks in advance

Piotrek: Hi, can I somehow call get gems sale contract function? I want to put NFT on sale on getgems and then buy it from my javascript code

&rey: Generally, some data is stored in the cell, and remaining part in the only ref (in the same snake format). (reply to 41469)

&rey: It's been deprecated and removed from Tact. I've heard something about pending rework. (reply to 41467)

FM: Hi guys I am learning TON and tact and trying to get this piece of code running from https://docs.tact-lang.org/learn/jetton/jetton-3.   import "@stdlib/jetton";  But always get the:   Could not resolve import @stdlib/jetton   How am I supposed to use this lib?

FM: exactly, I am in the same situation (reply to 41467)

Ken: https://github.com/howardpen9/jetton-implementation-in-tact/tree/main

FM: thanks

TON Answers Bot (not AI): STON.fi Simple TON -> USDT Swap from ceds  I'm trying to do a simple TON -> USDT swap on STON.fi.  It seems to be more difficult than anticipated.  See below for function.  Any advise will be appreciated.  The transaction goes through but I don't receive the tokens.   async function stonfi(mnemonic) {   const keyPair = await mnemonicToWalletKey(mnemonic.split(' '));  const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', { apiKey: 'e4cf6......' }));   const WalletClass = tonweb.wallet.all.v4R2;   const wallet = new WalletClass(tonweb.provider, {   publicKey: keyPair.publicKey,  });   const address = await wallet.getAddress();   const JETTON0 = 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA'; //USDT;  const PROXY_TON = 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez';   const router = new Router(tonweb.provider, {   revision: ROUTER_REVISION.V1,   address: ROUTER_REVISION_ADDRESS.V1,  });   const tonToJettonTxParams = await router.buildSwapProxyTonTxParams({   // address of the wallet that holds TON you want to swap   userWalletAddress: address,   proxyTonAddress: PROXY_TON,   // amount of the TON you want to swap   offerAmount: new TonWeb.utils.BN('1000000'),   // address of the jetton you want to receive   askJettonAddress: JETTON0,   // minimal amount of the jetton you want to receive as a result of the swap.   // If the amount of the jetton you want to receive is less than minAskAmount   // the transaction will bounce   minAskAmount: new TonWeb.utils.BN(1),   // query id to identify your transaction in the blockchain (optional)   queryId: 12345,   // address of the wallet to receive the referral fee (optional)   referralAddress: undefined,  });   const seqno = (await wallet.methods.seqno().call()) || 0;   var result = await wallet.methods   .transfer({    secretKey: keyPair.secretKey,    toAddress: ROUTER_REVISION_ADDRESS.V1,    amount: '1000000',    seqno: seqno,    payload: tonToJettonTxParams.payload   })   .send(); }   🔗 Answer on TON Overflow

Michał: hello, i just created a token but I dont know how to add LP and to swap it, can anybody help me?

zZackz: Hello, can anyone help me resolve this error.Alguém pode me ajudar a resolver esse erro. error: failed to run custom build command for `tonlib-sys v2023.6.4`  Caused by:   process didn't exit successfully: `D:\Programing\Rust\ruston\target\debug\build\tonlib-sys-85327df11d590c42\build-script-build` (exit code: 101)   --- stdout   cargo:rerun-if-changed=ton/CMakeLists.txt   cargo:rerun-if-changed=build.rs   CMAKE_TOOLCHAIN_FILE_x86_64-pc-windows-msvc = None   CMAKE_TOOLCHAIN_FILE_x86_64_pc_windows_msvc = None   HOST_CMAKE_TOOLCHAIN_FILE = None   CMAKE_TOOLCHAIN_FILE = None   CMAKE_GENERATOR_x86_64-pc-windows-msvc = None   CMAKE_GENERATOR_x86_64_pc_windows_msvc = None   HOST_CMAKE_GENERATOR = None   CMAKE_GENERATOR = None  I've already tested it on Linux and Windows terminals, and I both get this error when I try to build .

Aaron: Hello, who would be best to talk with regarding a grant proposal which was submitted over a month ago? As we submitted a grant proposal and it looks like all other proposals submitted around the same time have been rejected, while our proposal remains pending.

Dmitrii: Hi. Looks like you have to install cmake. (reply to 41480)

— 2024-01-09 —

Panda: hi i am new one for ton

Panda: I need some help

Panda: How to implement multi wallet with one private key with ton sdk?

Panda: Can anyone give me some hints or examples?

Mehdi: Would you please demistify what is going on , what this notation means ? This is snake cell schema ,the concept is clear ,my concern is TL-B itself (reply to 41471)

PX: does anyone know how to decode the hex string to a regular TON address?

simple: curl localhost:8081/getMasterchainInfo {"ok":false,"error":"No working liteservers with ls_index=None, archival=None","code":503}

simple: I need to run the archive node, now the synchronization is complete but the access is not available, what is the reason

&rey: Prepend -1: and you'll get raw (HEX) form of address. (reply to 41488)

&rey: There are plenty of decentralized exchanges, and most have intuitively obvious process of adding liquidity. (reply to 41479)

Jon: Hi any dev team here that can help build token staking dapp on TON? We have a erc20 token that we will bridge to TON and need a team that is familiar with TON to build the staking contract.   Must have track record and experience on TON.   Any teams interested please PM me 🙏

PX: How can I convert it back to regular TON address? (reply to 41491)

TON Answers Bot (not AI): Missing BNB from Kimberly Volner  im new to cryto so I'm sure of proper phrasing, however I hit a link that was supposed to show how much toncoin I was eligible for since using Telegram. it then came up with an accrued amount that I was eligible for. I followed the video and did it step by step and at the point where I was supposed to collect my phone died. when I turned it back on my $70 of Bnb ( which it said it needed for gas fee) was gone yet I didn't receive anytime toncoin. I can't redo the process cuz it won't connect now cuz it says I do not have enough for the gas speed and I do not know how to track anything down or find out if it just was a possible scam  🔗 Answer on TON Overflow

Kenny$$Shillz: Can I know what Ur end goal is for the users? (reply to 41396)

Kenny$$Shillz: Yes (reply to 41400)

Ken: Is there a service provider for making tons of tokens?

Kenny$$Shillz: I havent seen any standard vesting contract example yet (reply to 41401)

Mehdi: There is a cookbook in doc , covered this (reply to 41494)

Kenny$$Shillz: https://docs.tact-lang.org/ (reply to 41404)

Kenny$$Shillz: Could be something with the contract code (reply to 41413)

F: Write to me in private messages - we will try to help (reply to 41489)

simple: I sent you a private message (reply to 41504)

Chicken Little: can someone show me how to instantiate any contract with the js sdk? not just a wallet contract?

Chicken Little: link to example would be perfect 🙏

Bear: hi guys, how to get the total amount of holders for a jetton token?

SWITCHER | DEV: Hey, how can I get the lp pair address of a smart contract in python/typescript

CripticHood | Drops💧: Check the HD wallet function in the docs under wallet (reply to 41486)

Panda: Thanks (reply to 41511)

&rey: Some indexer is required, this data is unavailable onchain. (reply to 41508)

CripticHood | Drops💧: I'm not sure I understand what you mean by "instantiate" if you mean interact you can check one of the TWA app tutorials. One enables you to send transaction to a contract to receive tokens and the other shows how you can interact with the counter contract. You should be able to build up an idea from there. (reply to 41506)

SWITCHER | DEV: I still don’t understand what exactly happens when adding liquidity on TON, i tried deploying and adding LP and there was like 5-6 transactions involved, i want to make a bot that listens for new pairs, but im not sure what to exactly listen on

SWITCHER | DEV: Which event

Chicken Little: and how do you listen to events in the first place 👀 i havent found a single example showing it

Yhwach: https://tonscan.org/address/UQBHCR5xLb2izCjZNil_0jUhGRon3dHSdQ0v7HCBv95uyqk_#transactions  https://tonscan.org/address/EQBHCR5xLb2izCjZNil_0jUhGRon3dHSdQ0v7HCBv95uyvT6#transactions  how can both of these addresses be the same address?

Yhwach: I've created an address using node.js and it gave me the second one. I tried withdrawing some ton to it and it worked. When I import the mnemonic to another wallet the first address appears. What is the difference?

Yhwach: https://t.me/tonkeeper_news/49  found it. But the node.js client generated EQ wallet. How can I generate UQ addresses?

&rey: address.toString({bounceable: false}) (reply to 41520)

&rey: Only offchain flags (testnet indication, bounceable or not) are different in those addresses. (reply to 41518)

Yhwach: Thanks! It works.  One other thing that I did not understand is how wallets work. This wallet seems to be inactive. How can I activate it and send TON to other addresses? Is there any costs for activating the account? (reply to 41522)

&rey: If that's not implemented by existing DEX platforms, we can only hope that you find out what to listen on; likely that will be contract deployment with specific code. (reply to 41515)

&rey: Though, anyone can create their own DEX and you'll have a hard time determining if a contract is one.

SWITCHER | DEV: I only want to listen on stonfi

Dario: Depends on which dex you are trying to implement. On stonfi, you can check docs.ston.fi and take a look at dex source code, here; https://github.com/ston-fi/dex-core (reply to 41515)

&rey: Generally, any library you encounter will automatically deploy wallet on the first use, so you may just send TON out. (reply to 41523)

Yhwach: I'll try now (reply to 41528)

&rey: There are some non-negligible costs, depending on contract size + after deployment storage fee will increase accordingly.

&rey: Though the deploy cost is commonly < 0.1 TON.

Yhwach: https://tonscan.org/address/UQBHCR5xLb2izCjZNil_0jUhGRon3dHSdQ0v7HCBv95uyqk_#transactions Wonderful, It worked thanks! (reply to 41531)

Yhwach: And last but not least, I'll need to listen for hundreds of wallets at the same time. And sometimes I'll need to send transactions from a few thousand addresses. I can deploy a node. Is there any ways to listen to address txes like tron eventlog? (reply to 41531)

Yhwach: So once an address receives TON, I need to be able to detect that and do things accordingly. I need to listen to multiple addresses at the same time

Yhwach: https://github.com/toncenter/examples/blob/main/deposits.js found it ok

Yhwach: didn't work. How do I listen to blocks? (reply to 41535)

Bear: any 3rd party API has this data? TonAPI doesn't have. either TonViewer.com (reply to 41513)

裸裸: hello sir. I use the  https://testnet.tonviewer.com/transaction/77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92 or the  https://testnet.tonviewer.com/transaction/4c53b8e11851672876e354f537d4ae9d16cf3f9e9f7c3bd47ca2b1fbc8fba0db can get almost same result.  what is the logic of this page?  if I only have  77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92 how can I get the 4c53b8e11851672876e354f537d4ae9d16cf3f9e9f7c3bd47ca2b1fbc8fba0db  or If I only have 4c53b8e11851672876e354f537d4ae9d16cf3f9e9f7c3bd47ca2b1fbc8fba0db  how can I get 77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92  the tonviewer is the tonviewer.   but I want to use the api to get the result. not see by eyes.  which api can I use?

裸裸: this api is not ok: https://testnet.toncenter.com/api/v2/getBlockTransactions?workchain=0&shard=8000000000000000&seqno=17229018&root_hash=77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92&count=40 because it give me 4 results. while I need is 2. so please help me.

Bear: if I have a Cell which is the Dictionary in contract data, how to load it in the dictionary?   it's a jetton content data:  Jetton Content: x{00C_}  x{4}   x{BFF082EB663B57A00192F4A6AC467288DF2DFEDDB9DA1BEE28F6521C8BEBD21F1EC_}    x{0068747470733A2F2F617661746172732E67697468756275736572636F6E74656E742E636F6D2F752F3130343338323435393F733D32303026763D34}   x{2_}    x{2_}     x{BF4546A6FFE1B79CFDD86BAD3DB874313DCDE2FB05E6A74AA7F3552D9617C79D13_}      x{00546F6B656E204E616D65206973206865726521}     x{BF6ED4F942A7848CE2CB066B77A1128C6A1FF8C43F438A2DCE24612BA9FFAB8B03_}      x{00545F545F32}    x{BF89046F7A37AD0EA7CEE73355984FA5428982F8B37C8F7BCEC91F7AC71A7CD104}     x{0054686973206973206465736372697074696F6E206F662054657374204A6574746F6E20546F6B656E20696E20546163742D6C616E67}

mikhail: Hi. I am making a request to get the wallet balance. I get an answer in the form of a long number. Two questions: does this number contain the total balance? How do I get the balance of a specific coin on my wallet?  const TonWeb = require('tonweb'); const tonweb = new TonWeb();  const getData = async () => {     const balance = await tonweb.getBalance('UQAwglRK8d31o2cREAU-g6bh4aUT1HGHTr64m7yYp2ESW8ta')     console.log(balance) } getData()

Panda: Hi guys , Does every ton wallet that I manual deployed require a certain gas fee?

Panda: even subWallet?

&rey: Yes, storage fee. (reply to 41546)

&rey: They are also different contracts so yes. (reply to 41547)

Bear: how to read the data in here in Jetton? (reply to 41543)

Bear: 💀

Yhwach: Why do you think it is not syncing? Port is open

Yhwach: {   "ok": false,   "error": "No working liteservers with ls_index=None, archival=None",   "code": 503 }  I get this error from Ton web api, why do you think this would happen?

Yhwach: {   "ok": false,   "error": "LITE_SERVER_NOTREADY: block is not applied",   "code": 500 }  ok the server didn't pickup the config. Now its working but its waiting for sync. Edit: its synced now but there is another problem. But get transactions is working so I'm done. Thanks!

Brian: Hey guys, when crafting good-looking bot responses with images,  should I use the HTML parse mode or some certain bot APIs?

Mehdi: what is means , I mean in which mode it will translated under hood :            sendMode: SendMode.PAY_GAS_SEPARATELY,

mikhail: Hello, help pls. I have a wallet address, and a coin contract address. I need to find out the balance of this coin in wallet address

Bear: 😳 (reply to 41551)

cell: I receive address from get method, response looks like this:   x{80180A5D3CD50A6164F5DFAEB3579E5CE0A6A8B2D3972479C59AD9DB12352F2E15B_} <=>te6cckEBAQEAJAAAQ4AYCl081QphZPXfrrNXnlzgpqiy05ckecWa2dsSNS8uFbAskZgj   How to convert this to friendly looking address?

MatSadX: Hey starting my first project on TON Blockchain.I can get any problems and questions on my way so i wish find someone here who understanding this blockchain better than me

Yhwach: is there any documentation about which one does what? (reply to 41557)

cell: https://docs.ton.org/develop/func/stdlib/#send_raw_message (reply to 41567)

Yhwach: lovely, thanks (reply to 41568)

Sell Low: How is it possible that you guys were able to go in and change the CA symbol? This was a legit project labeled as NOT / TON and is now reflected as scam? Can someone please review this and correct it. The CA was revoked, LP was burned the community don't understand.   CA: EQACXO4uNQGugE5wg-vyCgVRNranm7diFGO9XTlLKzTNqIGq

Sell Low: It's a reversed TON name meme project.

User<6072338193>: What’s the project about? (reply to 41566)

MatSadX: Landingpage will be done soon so will DM u

MatSadX: So u can check

MatSadX: I got awesome idea but its pretty hard for me connect it with Blockchain.

User<6072338193>: alright I’d be looking for the DM (reply to 41574)

MatSadX: And hard to find someone fluent in FunC

MatSadX: Thanks you ! Will contact you soon (reply to 41576)

User<6072338193>: The blockchain is new but Amazing from what I’ve discovered the hype would soon be moved here and make all projects here blossom (reply to 41577)

MatSadX: Yeah im fun of Telegram app and watching how TON blockchain growing

MatSadX: its why i really want to do my first project on TON

User<6072338193>: Eth, Sol …etc were once at this stage before blowing up.

User<6072338193>: Alright I’d look forward to a part of the journey. (reply to 41581)

MatSadX: Awesome ! Working alone without big budget but im pretty sure i will done this projet

User<6072338193>: Let me know when you’re done with the landing page. (reply to 41584)

User<6072338193>: Quick question do you need help getting the landing page done..? (reply to 41584)

MatSadX: noo

MatSadX: the landing page and game is on me

MatSadX: And few more ideas

MatSadX: Just problem with conecting in ton blockchain

MatSadX: Also wanted in game use NFT but hard to find more about it

User<6072338193>: My DMs are open we could talk batter (reply to 41591)

MatSadX: Yeah lets move there

CripticHood | Drops💧: That occurred during contract verification I suppose, there's already a project Notcoin which is relatively known but has no token. And your project happened to look a little like it's banking on that idea.  It's just like using "@" in you message when sending transactions, that gets flagged too as spam or scam 🚩 (reply to 41570)

User<1838883295>: Hey, are people familiar with the artist who designed the TON duck logo?

User<1838883295>: Ive seen the TONY project and I feel as if he would want to be part of it

Sell Low: The contract was already revoked, LP was already burned. The TON team labeling the project as scam just occurred. The project was not called Notcoin? The label was NOT / TON with a reverse TON logo?   Reverse names have been huge Metas across several chains, what makes TON different? Just because a project hasn't launched yet, make's no sense. (reply to 41596)

Sell Low: If they are able to go in and change the symbol to " SCAM " they can at least review and see that it's not. Basically saying they will mark every project as a SCAM with the name NOT if they are successful.

CripticHood | Drops💧: What I to know is that is you try other explorer do they also return thesame symbol ? (reply to 41599)

Sell Low: Reflect on Ton viewer which reflects on chain and in Ton keeper wallet. (reply to 41601)

CripticHood | Drops💧: They check if contract is verified an get the data from their, talk to @tonverifier team, an explain to them. (reply to 41602)

Sell Low: will do thanks. (reply to 41603)

Sam: In mytonctrl staqtus, why are there 3 values listed for TPS and "Network load average"? What is the difference between them?

cell: Might be dumb question  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure { }  my_balance = Balance before transaction?  Or my_balance = old_balance + msg_value ?  Thanks

User<6085560929>: is it against telegram tos to make a market for usernames / phone numbers?

User<6085560929>: only nfts ofc

— 2024-01-10 —

裸裸: 裸裸 (乐乐)golang开发, [Jan 9, 2024 at 18:39:16]: hello sir. I use the  https://testnet.tonviewer.com/transaction/77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92 or the  https://testnet.tonviewer.com/transaction/4c53b8e11851672876e354f537d4ae9d16cf3f9e9f7c3bd47ca2b1fbc8fba0db can get almost same result.  what is the logic of this page?  if I only have  77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92 how can I get the 4c53b8e11851672876e354f537d4ae9d16cf3f9e9f7c3bd47ca2b1fbc8fba0db  or If I only have 4c53b8e11851672876e354f537d4ae9d16cf3f9e9f7c3bd47ca2b1fbc8fba0db  how can I get 77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92  the tonviewer is the tonviewer.   but I want to use the api to get the result. not see by eyes.  which api can I use?  this api is not ok: https://testnet.toncenter.com/api/v2/getBlockTransactions?workchain=0&shard=8000000000000000&seqno=17229018&root_hash=77fb3cc4ad47a5d9dcd178f91d5454eee42e14c267056375975f227e6df78d92&count=40 because it give me 4 results. while I need is 2. so please help me.

Boris: the api link is for getBlockTransactions, so you get all tx in this block (reply to 41609)

裸裸: so is there anther api can help me?

Boris: maybe, but idk, I just saw the api link, and the result seems to be right

Boris: which site is this? (reply to 41613)

裸裸: I passed the root_hash parameter, but the result is the same as not passing it. Even if I change it to an incorrect hash, I can still retrieve all the transactions.

裸裸: https://testnet.toncenter.com/api/v2/# https://toncenter.com/api/v2/#bin

裸裸: so how to get the relative tx by use api?

裸裸: the page is very good.

裸裸: but my program is not good.

裸裸: I am testiing the transfer between the wallet.

裸裸: first. I get the balance of the two wallet.

裸裸: then I get the relative tx to calculate the balance.

裸裸: then I compare the result with the getBalance from the web.

裸裸: the main point is how to get the next transaction and the next transaction when send a transfer tx.

&rey: Tonviewer isn't reflected onchain! I agree with point about Tonkeeper. (reply to 41602)

&rey: And tonscan.org, almost as popular, uses other data source.

&rey: Courtesy of a centralized service and risk that users mistake icon in small resolution for TON itself. (reply to 41570)

&rey: It's OK. By market, you mean marketplace or sale contracts? (reply to 41607)

User<6085560929>: marketplace

User<6085560929>: bitcoin / ltc / ethereum for tele users

User<6085560929>: my marketplace will be an escrow kinda

User<6085560929>: 2.5% fee to me

裸裸: how to avoid this?

裸裸: Suppose I have opened a store where I sell goods and accept "ton" as the currency. A person made a payment to me and provided the tx hash 89f6f64f58c973b0c7ec33fbe0b72b4d885ac271d67c0c3a5afe7f40aacdb624. After verifying this tx hash, which indeed corresponds to a transaction, I proceeded to give them the goods, considering the transaction complete. However, upon opening my wallet, I discovered that the money did not get credited, but instead, it bounced. At this point, I incurred a loss of both the money and the goods.

裸裸: Therefore, when the other party made a transfer to me and informed me that their hash was "89f6f64f58c973b0c7ec33fbe0b72b4d885ac271d67c0c3a5afe7f40aacdb624," I should immediately recognize that this transaction has gone through the hashes "ee0286602552164251406cbc590a26f63e817f083c142ad9b2ae0541a171cf64" and "641e2a362ac1a4d17b56dafab03f97efe494d31844c8a09d13cf80daf81c9c92" and ultimately bounced back. At this point, I should not have given the goods to the other party.

裸裸: However, now, how can I accomplish these tasks? When the other party sends a transaction, they will have a hash, but I need to understand the complete process behind that hash. I know that through a web browser, it's evident that I can see the results. However, if I want to turn this into an automated process, where a program can recognize this situation, how can I go about identifying it?

裸裸: Suppose I am a shop owner selling goods. When I receive a transfer, I know that the hash for this transfer is 334e166cb9e825d296f52ed020276a11d6b19b70302f94a1a410adb82f870670. I also know that this transaction is from a specific customer. However, which transaction does it correspond to for the customer? If the customer made two purchases but I only received payment for one, how can I determine which one was successful and which one failed? Furthermore, how can I identify which item to send to the customer?

&rey: If your wallet is initialized, money doesn't bounce. (reply to 41642)

&rey: Normally, you include a comment with UID of purchase generated by your service. (reply to 41646)

&rey: Second option. TON Connect provides you with external message which you can match with item. You can track whether the transactions caused by it succeeded.

裸裸: Well, you're absolutely right. I can use "comment=UID" to pass messages.

裸裸: However, I do feel that you need to add an API interface that allows users to retrieve all the hashes associated with a complete transaction using a single hash. Otherwise, your logic cannot be fully closed, and that is also a problem.

Andrey: https://toncenter.com/api/v3/#/default/get_transaction_trace_api_v3_transactionTrace_get (reply to 41617)

裸裸: Wow, this interface seems to be exactly what I was expecting. I'll give it a try first and see if I can get the desired results.

Bhavesh | FlashTrade.xyz: I am planning to integrate wallet in Telegram bot i am developing, and currently I can see only three tokens are available, is there any roadmap available for Wallet? apricate an guidance from community member's help here, Than you.

Kagami: hey can someone help me to verified contract ?

Zero: I am trying to swap TON to Jetton using ston.fi, abke to generate the payload and all but what next

Buth™: Gm everyone.

Chicken Little: gm

Chicken Little: how can I get the tx from an event id?

Chicken Little: what is an event id anyway the explorer doesn't seem to be able to do anything with it

Chicken Little: how can i figure out in which tx this took place in

裸裸: the api you give me can work very good. however, the api is rate limited. even I use the "X-API-Key" it is always 503. (reply to 41652)

裸裸: can the https://testnet.toncenter.com/api/v2/# and https://testnet.toncenter.com/api/v3/# use the same api_key in the headers when request?

Ruslan: Yes (reply to 41669)

Zero: https://docs.ston.fi/docs/developer-section/dev-guide/swap#proxy-ton-jetton  Am able to get the transfer message from this but stuck with what to do after that

Zero: From my understanding all I need to do is execute a transaction send

裸裸: thank you. (reply to 41670)

裸裸: https://testnet.tonapi.io/v2/blockchain/transactions/dd979231ce0dc18d6fd019daae4d91fce87f05ca06d4e54bcfeb552997b5bf07

裸裸: why the "block": "(0,c000000000000000,16397394)",

裸裸: c000000000000000

裸裸: 8000000000000000 I always think the shard is 8000000000000000. but now I get a c000000000000000.

裸裸: and the go sdk define is  type BlockID struct {  Workchain int32  Shard     uint64  Seqno     uint32 }

Maksim: that’s the master shard - when there is only one shard. When blockchain splits the master shard is dividing to c000000000000000 and 4000000000000000 (reply to 41679)

裸裸: OK I will change my code to define it as string type.

Tim: no 😥, it's uint64. You just compare Hex (reply to 41682)

裸裸: ok the hex value.

Joseph: for running liteserver, can i use lite mode ?

Андрей: no, only full (reply to 41685)

MonoBit: Hi guys I get exit code 5 on TokenInternalTransfer op code (0x178d4519). As I see on TVM exit code page on docs.ton.org it says "Integer out of expected range."  But when I increase transaction amount everything is fine. What is the relation between these two facts? If there is an integer out of range in my code why would it work with more ton sent to the contract?

Andy: seems to be including the message value https://docs.ton.org/learn/tvm-instructions/tvm-initialization#internal-message (reply to 41606)

Zero: https://testnet.tonscan.org/tx/tSRnJn8ME2lf9eESQsHSYU-VANNwmH2fJ0-nrRr7tdg=  I did a transaction to swap TON for STON but it didn't seem to work

Zero: goTVQM9ITM20Eu0x8hKz12aD9DEbYJvSw0KgEGqljsk= did another and yet still no swap

Chicken Little: bump (reply to 41663)

zZackz: Hi, I'm trying to get the metadata of a jetton, but when I run the code it enters this stream and it doesn't come out anymore.  Does anyone know what can it be ? I'm using Tonlib.rs

XFT: Hello guys, can you please assist me with docs on how to decode transaction data (msg data)

Joseph: need this too (reply to 41694)

Joseph: hello guys, i already running my liteserver   but when i trying to call i got this error  2024/01/10 20:04:00 failed to get account state: adnl request timeout, node 164.68.99.144:20334

Joseph: sometimes I don't get any errors

Joseph: 2024/01/10 20:21:08 failed to get masterchain info: get masterchain info error (*liteclient.ConnectionPool): adnl request timeout

Joseph: here is my node status

Midnightmadwalk: use api (reply to 41692)

Midnightmadwalk: to get metadata

ninja: Hi guys, is it possible to get transaction hash before the transaction?  Or from the response of sendBoc of TonCenter client?  I am using tonsdk

Falco: I believe it's 1 min, 5 min and 15 min (reply to 41605)

ninja: The sendBocReturnHash method of Toncenter returns a in_msg hash  This hash is there in /v1/getTransactionsByAddress but missing in /v2/getTransactions  is there any way to get in_msg hash in v2? (reply to 41702)

Joseph: hello how to stream transaction using golang

Bear: what is Exit Code 4 means?       4: { message: Integer overflow },

Bear: 👍🏿 (reply to 41153)

Mister.: Здравствуйте

Mister.: Как написать в поддержку комюнити Гаме на русском языке

Mister.: ??

— 2024-01-11 —

Rocket Engineer: Heyy, where can I find the recovery link for bridge?

Yuriy: hi, anyone knows ton tracking wallet bot?

moinho: hey guys can you help me? I'm trying to import @ston-fi/sdk but i got "Unexpected token '?'  I just use that import { Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS } from '@ston-fi/sdk'; console.log(ROUTER_REVISION)  SyntaxError: Unexpected token '?'

裸裸: I have encountered a new question, which is how to scan the blockchain. For example, in the BTC chain, let's say at block height 100, my balance is 1 BTC. Suppose at block height 101, by using "get transactions of block(101)", I retrieve a transaction where I sent out 0.5 BTC. And let's say at block height 102, I receive 1 BTC. At this point, my BTC balance would be 1.5 BTC. This process is straightforward. However, in TON, how can I perform this process? Does anyone know?

裸裸: What I mean is, how can I traverse all transactions from block x to block y in the TON blockchain? I'm not quite sure about the main chain and workchains, and they all have block numbers. Which block number should I use and how should I use it? That's the question.

裸裸: https://testnet.tonapi.io/v2/blockchain/masterchain-head  response is the block is  "workchain_id": -1, "shard": "8000000000000000", "seqno": 15976190,  https://testnet.tonapi.io/v2/blockchain/transactions/d01e41904329c18fc3a8496fb132178a079f67bd3fa21b90884aa94f78e93473  response is: "block": "(0,8000000000000000,17275308)",  so why the 15976190 < 17275308

裸裸: I requested a transaction, and my boss asked me to calculate the number of confirmations for that transaction. Although I know that in TON, once a message is sent, it is considered confirmed, I still need to determine the time difference between the block where the transaction is located and the current latest block.   Confirmations: nowBlockNum - transBlockNum.   However, when I subtract the block number of the transaction on the main chain from the block number on the workchain, I get a negative value. So, how can I calculate the number of confirmations?

Howard: anyone use this searchNFT before?   I want to get full list of NFT item address for a nft collection

User<6072338193>: Alright that’s cool what are you building? (reply to 41724)

User<6072338193>: That’s cool I would appreciate you sending your roadmap to my DM probably we could talk more (reply to 41728)

User<6072338193>: Yeah seen thanks (reply to 41730)

To: How to make a button to send to a certain address for example Donate button  When the button is pressed, coins should be sent.   ton soppest is needed ?

Ton Inu advertising: Hello we build utilities TON chain we can talk? (reply to 36903)

zZackz: Can't search for ADNL? (reply to 41700)

Roman: Attention TON Developers 👍  The TON Dev Community calls on your expertise to contribute to advancing the TON ecosystem. Your insights and experiences in development are invaluable in making TON more robust and user-friendly.  We aim to set up a project rapidly, even in a single evening. The TON Foundation is dedicated to crafting an exceptional experience for all, whether you are just beginning your coding journey or an experienced developer.  We encourage every community member to share their experiences with TON development by participating in our survey.  The survey encompasses four key topics and will take approximately 5-8 minutes of your time.  We invite you to contribute to this important initiative and share your valuable experiences here: 👉 https://agkcv6ne.paperform.co/ (forwarded from TON Dev News)

Ken: Hey guys

Yhwach: How do I send multiple addresses TON in a single transaction? I need to send ton up to 50 addresses every 10 seconds from a single address

Daniil: Use “highload” wallet (reply to 41740)

Yhwach: is there any Node.js libraries to create highload wallet like WalletV4? (reply to 41741)

Tim: I think there's 1 from dedust

Yhwach: I was unable to find any sources sadly (reply to 41743)

裸裸: how to use the workchainBlockID to get the masterchainBlockID ?

Midnightmadwalk: ADNL? (reply to 41736)

裸裸: I'm crawling blocks, and when I retrieve block 35354837 of the Masterchain, I want to fetch the other shard chains. However, when I use https://tonapi.io/v2/blockchain/masterchain/35354837/shards, it only returns the last_known_block_id. Why doesn't it provide me with the first_known_block_id and second_known_block_id? As a developer, I apologize for my lack of understanding of the overall structure and knowledge of TON. I'm wondering, it seems apparent that the blocks of the main chain should correspond to more than one shard chain's blocks. So why am I unable to retrieve the other blocks? Or is it actually the case that it corresponds to only one block?

裸裸: If a block of the main chain corresponds to multiple blocks of shard chains, why aren't all of them returned? Similarly, if it corresponds to only one block, why is this field called "last_known_block_id"?

裸裸: I feel like a fool in this group as a developer, starting to integrate with this chain without much understanding. I want to ask, why is this chain so unfriendly to beginners? Do you really think your chain is so popular that everyone knows all the background knowledge? When designing a complex system like this, I believe at least some videos or diagrams should be provided to explain the whole process. Why does it seem like I'm the only one in the group who knows nothing? I feel overwhelmed and humiliated while developing here. It's really distressing. Can't there be a simpler way to help me solve problems?

zZackz: yes, how to get the metadata of a jetton using lite client? (reply to 41746)

Midnightmadwalk: idk i am using https://tonapi.io/v2/jettons/+jetton_address (reply to 41752)

Midnightmadwalk: lite client was crashing for me

Maksim: because there was only one shard at that moment (reply to 41749)

Maksim: TON is sharding dynamically, so there can be either 1 or 2**64 shards (it depends on blockchain load) (reply to 41749)

Maksim: you better start with docs.ton.org you can find answers for most of your questions there (reply to 41751)

func: how to get test coin?

&rey: @testgiver_ton_bot (reply to 41759)

func: it not worked?

Андрей: it's slow, but it works (reply to 41761)

func: ok ,thanks

Maxey: Has anyone used the forward_payload in ton-sdk? I currently have it packaged as a cell, but it requires bytes, and I'm not sure how to convert it.

Maxey: Argument of type "Cell" cannot be assigned to parameter "forward_payload" of type "bytes" in function "create_transfer_body"      "Cell" is incompatible with "bytes"

Nazmul: I am trying to get TON for testnet for a long time, but it is showing same response after a long time of wait. I have tried the captcha a lot of times, but same result. I have tried deleting chat and start over, but no change.

PLATFORM: CNFT Standard In Crypto World   In today's crypto landscape, many users are acquainted with NFTs and recognize them as an innovative technology. However, it's noteworthy that cNFTs represent the next frontier in digital ownership. The cNFT standard enables the development of NFT collections ranging from 100,000 to 1 million items at the same cost as producing a standard NFT.  What is the cNFT standard and how does it work? TON's asynchronous architecture naturally leads developers to use microservice architectures for their smart contracts. This architecture is also true for the current NFT standard on TON, where each NFT is represented as a separate smart contract.   While this approach helps to reduce the load distribution on smart contracts, it creates challenges for developers: 1. Deploying an NFT collection with 1 million items results in the deployment of 1 million + 1 contracts. 2. Managing the operation of multiple NFTs becomes a significant challenge.  By combining on-chain and off-chain data storage, the cNFT standard creates a new mode called "virtual NFTs". The data of these virtual NFTs, including ownership and metadata, is stored off-chain. While on-chain, a Merkle tree root containing all NFTs in the set is maintained. When the first transfer of a virtual NFT occurs, the NFT will be created on-chain and from that point on, it is indistinguishable from classic NFTs. Currently, the GetGems marketplace supports this standard, and collections for instance, Egg Fight Club, are also made with this standard. This standard helps attract a large number of users and distribute millions of NFTs to projects.  Among the advantages of this standard, the following can be mentioned:  - Creating really huge collections, even up to 1 billion items. - Collection Deploy is offered at a fixed price, regardless of its size. - Collection deployment costs are extremely low, similar to deploying a normal empty collection (almost free). - In this case, claiming virtual NFTs is very affordable, comparable to standard transfer. to a standard transfer.) - Full compatibility with existing NFT standards and mechanics. - Implementation in marketplaces is relatively simple.  Interested people can refer to the Github page of this standard to read more about this standard; Moreover, soon the second part of this article will be more in-depth and More technically, we will discuss how programmers can easily create such collections.  Second part will also be dropped and published soon. Stay tuned.  💜 BOT  | 🌐Website  |  ✈️Telegram  |  🐦Twitter (forwarded from TonRadar)

Клецка: you need to send address to bot now (reply to 41766)

Roykay: Hello there! who can help me answer following questions :  1. What's the maximum number of Mini Apps and Mini Games one can create within a TG bot? 2. Can a TG bot have both Mini Apps and Mini Games at the same time? 3. Any way to open a Mini Game directly through its link? Currently, it involves entering commands in the Bot dialog first. 4. For creating a Mini Game, is using an API a must, or can it be done manually, like creating a Mini App through botfather by entering information(including a H5 game link) directly without configuring an API?   Thanks a bunch for your help!

— 2024-01-12 —

Midnightmadwalk: ok got it (reply to 41752)

Midnightmadwalk: this is rate limiting api (reply to 41753)

He: I want to ask a question about how to get all the transaction records of a contract. I found an rpc provider. https://docs.tonconsole.com/tonapi/api-v2 There is a method called /v2/blockchain/accounts/{account_id}/transactions Partial transaction records can be obtained I don’t know much about the acquisition and principle of after_lt and before_lt. I randomly extracted two values ​​from the transaction record of a certain contract in the blockchain browser. When I requested it here, I found that the obtained result data was insufficient.

Yhwach: why do coinex ask for 500 Block verification to withdraw the money? Is it not OK to verify the payment after 1th block?

&rey: TON blocks are indeed final, and 1 block "confirmation" is sufficient. Reasons of that platform may be beyond us. (reply to 41775)

Егор: hi everyone, looking for a fren who can develop a smart contract on ton to create a gamebot

裸裸: When I use https://testnet.tonapi.io/v2/blockchain/masterchain/16008981/shards, it's clear that I can obtain {"shards":[{"last_known_block_id":"(0,8000000000000000,17308108)"}]}. This tells me the maximum block number of this shard. However, I noticed that there is another shard with the identifier c000000000000000. How can I obtain the latest seqno of this shard?

裸裸: how can I get all the shard by the api?

裸裸: now I knew the shard is 8000000000000000 and c000000000000000

裸裸: is there any other shard?

Denis: shards dynamically split and merge if one can't process all transactions

裸裸: Wow, that's so cool!

裸裸: this is my code. first I have some wallet address. and then get the balance of them. then do some transfer from one to another random.

裸裸: then from the start block num to the current block num. get all the tx and parse them and calculate the balance changes. then get the balance from the chain use api "/v2/accounts/{account_id}" then compare the balance.

裸裸: the balance before + or - the CalculateBalanceChanges equals the balance after transfers.

裸裸: the unit test is success.

裸裸: but!

裸裸: but the code can only work well on the shard 8000000000000000.

botmother: Hi, anyone knows how i can send a BOC in sendTransfer using ton.js. The code below i added BOC but it doesn't go through.    let workchain = 0;               let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });                let contract = client.open(wallet);               let seqno = await contract.getSeqno();               const recipient = new TonWeb.utils.Address('0QCgEXBLDbipzYC7fYvIG3W1yq-pa0IHUFV5mt631gyC1AOP');               const nft = new TonWeb.utils.Address('0QAEvMjv7B6JOOwskLMUUmhMoGd0jH48RWTCZUa1Ubmcson-');               const owner = new TonWeb.utils.Address(contract.address.toString());                const cell = new TonWeb.boc.Cell();               cell.bits.writeUint(0x5fcc3d14, 32); // Transfer operation               cell.bits.writeUint(0, 64);               cell.bits.writeAddress(recipient);               cell.bits.writeAddress(owner);               cell.bits.writeBit(false); // Null custom_payload               cell.bits.writeCoins(TonWeb.utils.toNano('0.02')); // Adjust the value as needed               cell.bits.writeBit(false); // Forward_payload in this slice, not a separate cell                const payload = TonWeb.utils.bytesToBase64(await cell.toBoc());                const tx = await contract.sendTransfer({                  secretKey: keyPair.secretKey,                  seqno: seqno,                  messages: [                    internal({                      to: "0QAEvMjv7B6JOOwskLMUUmhMoGd0jH48RWTCZUa1Ubmcson-",                      value: "0.001", // 0.05 TON                      body: "Hello", // optional comment                      bounce: false,                     payload: payload                   })                  ]                });

Luca | SpyDefi | ⛔️: Hello guys

Luca | SpyDefi | ⛔️: Sorry to ask here pls help

Luca | SpyDefi | ⛔️: I’ve received founds on my ton wallet bot on telegram, but I can’t see it on my ton wallet (I can see only at the address on chain)

Luca | SpyDefi | ⛔️: How I can control? I was doing wrong bcs I the address was TON instead of the TON space one

裸裸: but the code can only work well on the shard 8000000000000000. I must make some mistake but I don't know how to change my code.

Luca | SpyDefi | ⛔️: https://tonviewer.com/EQCByGmj9oEacdLj0W3um-nDbZbeRlC5YOLU1pYPU3ccQz8n (reply to 41797)

Luca | SpyDefi | ⛔️: This where’s the found

Luca | SpyDefi | ⛔️: Thanks if you can help me🙏

&rey: . @wallet accounts are virtual, their balance is stored in custodial service instead of blockchain. (reply to 41796)

Luca | SpyDefi | ⛔️: Ok thank you. So they can help me to send me back to my space account right? (reply to 41802)

Luca | SpyDefi | ⛔️: Thanks guys 🤝🙌

Luca | SpyDefi | ⛔️: I’ll write to the support let’s see when they can answer me! I’ll keep you updated just for info 😉🙏  Have a nice day !!

裸裸: Thanks if you can help me🙏 how to get all the balance changes of a lot of address. (reply to 41792)

裸裸: Thanks if you can help me🙏 I just want to scan the chain and get all tx and then get the change of the balance. (reply to 41784)

裸裸: my code can only loop on the shard 8000000000000000.

裸裸: first get balance before. then send tx. then get the change the balance. then use the balance before + or - the changes to get the balance after.

裸裸: then check the "balance after" equal the balance on the chain.

裸裸: for example. I loop from the (0,8000000000000000,17308362) then (0,8000000000000000,17308363) then (0,8000000000000000,17308364) until the current block num.

裸裸: but I don't know how the find the other shard.

裸裸: if the transfer is record on the c000000000000000 not on the 8000000000000000

裸裸: my code is bug.

裸裸: so my question is: if the master chain id is from 16009000 to 16009825. how to get all the workchain tx.

&rey: You can do it yourself, (reply to 41804)

Luca | SpyDefi | ⛔️: How mate?

Luca | SpyDefi | ⛔️: Can I dm you? (reply to 41821)

&rey: No need to do that. Just use "Send" button on @wallet main page and enter your TON Space address. (reply to 41824)

Tim: It's not hard, but not super easy (reply to 41820)

Tim: Look at how it's done in libs. Ton lite client for js and pytoniq(I think) for python (reply to 41820)

Luca | SpyDefi | ⛔️: Wait I’ve received not TON but another coin that’s why I can’t control it (reply to 41825)

Luca | SpyDefi | ⛔️: If was TON yeah I was able to withdraw

&rey: Please don't split the sentences into different messages. (reply to 41813)

裸裸: thank you. (reply to 41827)

裸裸: ok. (reply to 41830)

&rey: For withdrawing jettons, yes, you can only contact support. Though I have yet to hear a case when jettons are returned. (reply to 41828)

Luca | SpyDefi | ⛔️: Hope I can be the first

裸裸: is this api can be used? https://tonapi.io/v2/blockchain/masterchain/123456/blocks (reply to 41827)

Tim: Yes

💪Qurbonboy💪🕋𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫: Yes (reply to 41836)

裸裸: OK. I think the reason I cann't find the api is. most of the api https://tonapi.io/v2/blockchain/masterchain/16010000/blocks only return two block. one masterchain. one workchain 8000000000000000.

裸裸: while the demo https://tonapi.io/v2/blockchain/masterchain/123456/blocks shows a lot of shards.

裸裸: I have limited knowledge about this chain, and my ability to read English documentation is also weak. As a result, I often encounter many confusions. Thank you all for helping me.

裸裸: another question～

裸裸: how to get master chain seqno by the  workchain block id use the api?

裸裸: how to get master chain seqno by the  transaction hash use the api?

botmother: Anyone knows what package i can use for building BOC with ton js?

Howard: Hey guys what is the difference for TonCenterV2 /V3 here?

Denis: this is two different services inside toncenter so i am monitoring them separately

Ruslan: /api/v2 is ton-http-api: it gets data from LS.  /api/v3 is ton-indexer: indexes data to SQL and gets responses from this DB, does not connect to LS at all. (reply to 41853)

Gulolio: Hi guys one question here about FunC, I'm trying to write a DEBUG method, to later be used in this way:  DEBUG("BALANCE", balance);  The output would be, the same that I got if I would run,   ~strdump("BALANCE"); balance~dump();  I'm trying to write it in this way:  forall X -> () DEBUG(slice text, X value) inline {     ~strdump(text);     value~dump(); }  But in this way I'm getting a STACK underflow in the compilation, with npx blueprint build. Obviously I'm doing something wrong. If anyone have any idea, on how to achieve this.

— 2024-01-13 —

Howard: That is cool (reply to 41858)

User<6443539520>: Hey, any ton devs here who want to help build on a project on ton? Paid work of course

Howard: anyone know where can ask dton's question?  😂😂😂

Howard: Easy to build  https://github.com/howardpen9/nft-template-in-tact (reply to 41868)

User<6443539520>: Oh no, the project is already live

User<6443539520>: Called REDO :)

User<6443539520>: Wanted to create some cool stuff for the project

NMI: @tvorogme (reply to 41869)

Howard: I think this is kind of not useable since the data formate is not friendly    GraphQL URL (reply to 36796)

Luca | SpyDefi | ⛔️: Gm sir can you help me to  contact the @wallet_supportbot (reply to 41876)

Lord.: Hello i am here (reply to 41868)

Lord.: can i send a dm (reply to 41868)

Michael: I don't want it

Yhwach: while trying to send ton I am receiving this error; TypeError: Cannot read properties of undefined (reading 'length')     at /x/x/node_modules/ton-core/dist/types/MessageRelaxed.js:73:100     at Builder.storeWritable (/x/x/node_modules/ton-core/dist/boc/Builder.js:338:13)     at Builder.store (/x/x/node_modules/ton-core/dist/boc/Builder.js:362:14)     at createWalletTransferV4 (/x/x/node_modules/ton/dist/wallets/signing/createWalletTransfer.js:111:61)     at WalletContractV4.createTransfer (/x/x/node_modules/ton/dist/wallets/WalletContractV4.js:79:66)     at WalletContractV4.sendTransfer (/x/x/node_modules/ton/dist/wallets/WalletContractV4.js:68:29)     at Proxy.<anonymous> (/x/x/node_modules/ton-core/dist/contract/openContract.js:38:47)  what could be the problem

Vladimir: Is it possible to use TON wallet integrated to telegram app, to sign EVM compatible blockchains transactions ?  Maybe there is some workaround like storing the ECC signatures algorithm in solidity contract and pass the TON signature as an argument?

jasio: Hey devs, with stonks team we create first trading bot on TON chains. Our next goal will be sniper bot/MEV bot.  If you dont mind, I encourage you to check how it works and test it. I will be greateful if you use my referral link  https://t.me/stonks_sniper_bot?start=4B18EA21408ACC1D3AB59B54182618E6E76D3A89F5E0C4015EE0B801B8AF19ED  sTONks telegram:  @stonksonton  You can dm me if you have some questions :)

FR: Hi devs, I’m solidity dev and I want to learn FunC with a T shape learning. I have a unicorn idea to develop in TON blockchain.  2 questions: How does it will take to learn codes and other things to launch my dApp on TON? (normally)  Is it require to learn just funC or I have to learn other things?  Thanks in advance.

Ruslan: You may also need knowledge in typescript (reply to 41884)

Ruslan: And if you’d like to collaborate with telegram you should have a look at their app libs

Luca | SpyDefi | ⛔️: Anyone here have experience with the the @wallet_supportbot

Luca | SpyDefi | ⛔️: Still waiting an answer from it

Luca | SpyDefi | ⛔️: Or someone know how to connect with TON wallet support🙏

jasio: I spoke with them. Sometimes you need to wait 12h for answer (reply to 41889)

MonoBit: Hey everybody!  How can I get a list of all NFTs of a specific wallet using TonWeb library?

Luca | SpyDefi | ⛔️: Oh thank you 🙏 was scared about no response but I feel better Ty (reply to 41890)

裸裸: Can someone provide me with a transaction hash for a contract token transfer?  Any transaction hash will do, whether it's from the mainnet or testnet. I want to see the differences between data generated from contract token transactions and native currency transactions. Alternatively, can someone explain the differences to me?

Ken: Hello guys.

Ken: I've visited the site and stuff. And nothing looks familiar to me

Ken: No Python, No Javascript

Ken: no solidity

Ken: Ton uses their own programming languages I see.

Ken: Where do I start?

Ken: with which programmming language

F: To start, write your thoughts in one message. (reply to 41899)

Андрей: Contracts for TON are written in FunC: https://docs.ton.org/develop/func/overview (reply to 41898)

DEEP: Truth (reply to 41901)

Dipanshu ( Normie.Tech ): Hi I am looking for a project to do in ton any suggestions

JackryptDev: Hi, i am trying to use SKD for java ton tonlib-java but once the library native-lib.dll is being loading i get the error  Exception in thread "main" java.lang.UnsatisfiedLinkError: Can't find dependent libraries  Any idea what i am missing?

JackryptDev: it is during native-lib.dll library loading is there any java dev on board who uses SDK?

User<6558276512>: Hello please help me

User<6558276512>: I have launxh but don't know how to revoke mint and how to burn supply

User<6558276512>: Sorry for my question but I am newbie

— 2024-01-14 —

User<1463408356>: Hey im really new in blockchain, lets say i want to create my own token on TON how do i let users buy this token through my website? Could you provide me some simple example, thats how i usually learn, I got some programming knowledge (mostly Python, TS)

Kenny$$Shillz: Are U sure u are using a testnet wallet address? (reply to 41766)

Kenny$$Shillz: Yes to number 4 (reply to 41770)

Zero: I wanna keep track of whenever a token is bought, how can that be done using the ton WSS and the token's address

Xaceo: Hello, is it possible to make a token with tax on a ton network? Same as on evm chains?

walker: how to get transaction hash after sendTransfer?

walker: it return void

Dev0x: Is there a game available that I can integrate my deployed token on TON chain with?

Bear: hi, how to get the Tx Hash(in uint256) after I send the Tx?

Bear: For now, I have to use API to get the latest Tx on my wallet address

cell: Any examples on how to correctly create payload for tonConnectUI using TonWeb?          const transaction = {             validUntil: Math.floor(Date.now() / 1000) + 60,             messages: [                 {                     address: address,                     amount: value,                     payload: payload //???                 }             ]         }

User<6072338193>: TON doesn’t have a socialFI yet might starting that? (reply to 41907)

User<6072338193>: What’s the token name? (reply to 41912)

Howard: https://t.me/tondev_eng/39683 (reply to 41926)

Bear: do you have the way in   import * from "ton"; ? (reply to 39687)

Bear: 👍🏿 (reply to 37104)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You have to send this via a client provider, then you can get TX. Contract cannot return anything to you in execution (reply to 41933)

Bear: 3 arguments? What is the Lt we can get? And the hash   Using TonClient4 (reply to 41935)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: import { Address, internal, toNano, beginCell } from "@ton/ton"; import { TonClient, WalletContractV4 } from "@ton/ton"; import { mnemonicToPrivateKey } from '@ton/crypto';   export async function sendTransaction() {     // create client     const client = new TonClient({         endpoint: 'https://toncenter.com/api/v2/jsonRPC',         // OR TESTNET         endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',         apiKey: 'YOUR_MAINNET_API_KEY' OR 'YOUR_TESTNET_API_KEY'     });      // add your mnemonics here     const mnemonics = "  ";      // add your contract address     const destination_address = Address.parse(CONTRACT_ADDRESS);      // crerate sender     let workchain = 0;     let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));     let secretKey = keyPair.secretKey;     let wallet_contract = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });     let my_wallet = client.open(wallet_contract);      // send a message to the contract     let seqno: number = await my_wallet.getSeqno();      // build msg_body     let value = toNano(VALUE);     let msg_body = beginCell();      let res = await my_wallet.sendTransfer({         seqno,         secretKey,         messages: [internal({             value: value,             to: destination_address,             bounce: false,             body: msg_body.endCell()         })]     }); } (reply to 41936)

Bear: yes, I know this. (reply to 41937)

Bear: But I am dealing with the tx_hash ☹️ (reply to 41936)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if you are using same libs I use, res contains tx details to get tx_hash (reply to 41939)

Bear: void data type

Dipanshu ( Normie.Tech ): Hmmmmmmmmmmmmmm (reply to 41929)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I have any type but console.log(res); returns transaction details (reply to 41942)

Bear: Hmmmmmmmmmmmmmmm (reply to 41944)

Kenny$$Shillz: Hi I am confused what kind of game? (reply to 41925)

User<1463408356>: Hey im really new to blockchain, lets say i want to create my own token on TON how do i let users buy this token through my website? Could you provide me some simple example, thats how i usually learn, I got some programming knowledge (mostly Python, TS)

&rey: Are you that sure? https://ton.app/social (reply to 41929)

&rey: Unfortunately, type declarations there aren't precise. (reply to 41942)

B_BIG_MIC: Hello devs. Does anyone have a tutorial on how to build a backend connected to TON?

Dev0x: Available on telegram. maybe someone created app like it (reply to 41947)

JackryptDev: Anyone using java SDK? (reply to 41909)

Bear: What do you mean? (reply to 41953)

ℝ𝕒𝕒𝕊: can some one tell me what framwork used to make game such as notcoin or other game introduced on that

Kenny$$Shillz: Oh no sir you would have to build your own game and integrate your token (reply to 41955)

Kenny$$Shillz: Not coin isn't a game per se imo (reply to 41958)

ℝ𝕒𝕒𝕊: omm okay but do you know how its made ? (reply to 41960)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: by team of programmers built on a backend to store histories + client side technologies to made you interested and important TWA SDK (reply to 41961)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: yeah, It is a sport for the fingers. Soon we will see people whose fingers have bigger muscles than my arm. 😁 (reply to 41960)

Max | TonMap: Hey guys!  I want to create a website and connect a TON contract call to it. A straightforward version. Is there any example of such a website anywhere? A simple website, TON authentication, and interaction with a contract.  Thank you.

Meta: hi

Meta: cant we launch with tax func on ton

Adapt: Hi there. I installed Full Node with mytonctrl. I couldn't find however how to connect to my full node. What's RPC endpoint, the port? There is no word about it in documentation.

Андрей: What exactly do you want to connect to your node? If it's lite-client, then command mytonctrl -> installer -> clcf will help you (reply to 41970)

Adapt: I have my node.js app where I connect to TON network through the https://toncenter.com/api/v2/jsonRPC endpoint. Now I set up my own full node and want to use it to integrate my app with TON blockchain. Hence I need my full node api json RPC endpoint but there is no word about how to access it. Unless full node (mytonctrl) does not offer RPC endpoint for some reason? (reply to 41971)

Adapt: "liteservers" include item with ip port and id. What is the full node rpc endpoint full url? Simply IP:PORT or IP:PORT/api/v2/jsonRPC or something else (for mytonctrl)? (reply to 41971)

Андрей: You can connect to a node using only ADNL over TCP To create an entry point like toncenter you need to raise your local ton-http-api  This can be done in two steps: 1. Update mytonctrl to version 2:  MyTonCtrl> update mytonctrl2  2. Install the required module: MyTonCtrl> installer MyTonInstaller> enable PT (reply to 41972)

Андрей: This is data serialized in BOC and represented in base64 You need to study the documentation on deserialize data from BOC. To deserialize BOC you will need to know the original serialization scheme (TL-B scheme) (reply to 41974)

User<1463408356>: ive created jetton on TON blockchain called tonstars, i got 30mil of tonstars in my tonkeeper wallet. Now I want to make Pre-sale in my react website, ive made simple calculator so 1 TON = 5 TONSTARS, user can connect its wallet through ton-connect, and can pay for tonstars but ive no idea how to transfer tonstar from my main wallet to user that bought

User: Write smart contract (reply to 41977)

User<1463408356>: I used https://github.com/ton-blockchain/minter-contract, won't it work? (reply to 41978)

Vanëk: Have a better idea (reply to 41977)

User<1463408356>: do i need any other functionalities in this contract?

Vanëk: He want to automate process (reply to 41979)

Vanëk: He want module that change x ton on x * 5 tonstars on his site (reply to 41981)

User<1463408356>: yup just like typical pre-sale thing

User<1463408356>: sorry for noob questions but im begginer

User<1463408356>: I thought that i could just request payment from user and then on server side somehow send tonstars from my main wallet to user address

User<1463408356>: but i can't find any example or resources

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://github.com/ton-community/twa-template (reply to 41987)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you have to learn some basics before building goods on TON (reply to 41988)

User<1463408356>: I only want to create pre-sale section on my landing page - not trying to create TWA, im not sure if that template does help in it, like i got my jettons in my main wallet, now i need a way to send jettons from this wallet to wallet X when user perform transaction on React landing page (reply to 41989)

User<1463408356>: or do i miss anything?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you are said example, that template has example code of minting jetton using react app, follow it and learn about jetton standard on TON

User<1463408356>: ah my bad then, i already minted tokens - using minter.ton.com (ofc i used little changed selfhosted version), and got them in my wallet now i want to know how to distribute these tokens along users that can pay for them

Mr FreeMan: Hi, I think there is an issue with toncenter API. The getter functions with new TVM opcode started to get exit code 6 from yesterday. It was working well before and when I switched to orbs it's working well.

Adapt: MyTonCtrl> update mytonctrl2 Error: update error: You are on https://github.com/None/None/tree/mytonctrl2 remote url, to update to the tip use `update https://github.com/None/None/tree/mytonctrl2` command  A little bit confusing. Shall I run  update https://github.com/None/None/tree/mytonctrl2 (reply to 41975)

Adapt: When I try to enable PT I get this problem https://github.com/ton-blockchain/mytonctrl/issues/140  Do you know how can I run the node with linked patch-2 to solve the issue?

Adapt: Local validator out of sync: 6 s  How to read this? Docs says:  "When it falls below 20, the validator is synchronized."  For example, if my full node is out of sync 15 s, will my transaction sent to my full node be handled / forwarded to validator immediately or after 15 s?

Ruslan: It looks like a bug. You need to run this: update https://github.com/ton-blockchain/mytonctrl/tree/mytonctrl2 (reply to 41995)

Ruslan: Out of sync should be less than 60s (reply to 41997)

— 2024-01-15 —

User<1463408356>: Okey i will just let user pay through wallect connect, and then transfer funds from my main wallet to user’s with tonweb, is that good idea? (reply to 41993)

Adapt: This worked. I was able to enable PT. Now, what is the endpoint for RPC for my full node? IP:PORT or IP:PORT/api/v2/jsonRPC or something else? (reply to 41998)

JackryptDev: how to get all token data like name, symbol, decimals, max supply etc. visble on tonviewer via Tokencenter API? I found just that runMethod get_jetton_data method does not return these data

Adapt: What is the risk of having MEV bots on TON? Will sandwitch attack be possible? Can the block order be set by any actor or service? will it be ever possible in the future?

Adapt: Does TON have a mempool-like place to read TXs info before they reach validator?

Ruslan: To get NFT data you may use toncenter.com/api/v3 instead of /api/v2.  Here is an example: 1) Get info about NFT item with method /api/v3/nft/items: https://toncenter.com/api/v3/nft/items?address=EQDee5sSuCj6wn1rLTGfCPmwDqYWbd3MV-WusyqV8mzEA1oS 2) Get info about NFT collection of given item with method /api/v3/nft/collections: https://toncenter.com/api/v3/nft/collections?collection_address=EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz (reply to 42002)

Ruslan: Did you install it after the update to mytonctrl2? The api should be available on 8000 port. Also, check the service with command sudo service ton-http-api status (reply to 42001)

JackryptDev: is there any JS client that calls that endpoint and parses output? (reply to 42005)

Ruslan: Currently, no. You may do it manually

Speculator: Uncaught ReferenceError: Buffer is not defined     at ./node_modules/ton-core/dist/boc/BitString.js   How can i solve this issue in react? Is there similar to vite-plugin-node-polyfills for react?

Bear: does anyone got this? when interacting with DeDust Vault?  Message: (0xd1735400) TakeWalletAddress -> DeDust Vault

TON Answers Bot (not AI): How to add LP to TON Tokens from Covenant Simon  Hello Everyone I would like to know how to add lp to jetton tokens minted through the ton minter.   I just don't want to just transfer between wallets, I want the token to be tradeable and have a value. How do I do this  🔗 Answer on TON Overflow

Bear: Itt's with this https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md (reply to 42019)

To: what are the consequences of not verifying a contract ?   https://verifier.ton.org/

Ceren: Please note that when I've tried to verify a contract Kaspesky has blocked access to https://tonsource.infura-ipfs.io/ipfs/QmWmitaPN6Vgsgg8FAqynrFNUqbGnBADFWyX9FLDpCaE1d (reply to 42022)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: The lack of transparency of the way the contract works for its users (reply to 42022)

To: OK (reply to 42025)

To: Does it have any effect on its functionality?

Luca | SpyDefi | ⛔️: Gm guys

Luca | SpyDefi | ⛔️: https://tonviewer.com/EQCByGmj9oEacdLj0W3um-nDbZbeRlC5YOLU1pYPU3ccQz8n

Luca | SpyDefi | ⛔️: Can someone know if this TONS can be moved from this wallet?  This is the TON wallet custodial… I need this to my TON SPACE wallet (reply to 42030)

Luca | SpyDefi | ⛔️: Wrong address 😭

Luca | SpyDefi | ⛔️: Contacted the support but not answering from 2 days 🫠

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: best pros is when your project is not public but you want to share contracts (or some of them) to your users, verifier can helps (reply to 42028)

Luca | SpyDefi | ⛔️: Idk just asking I know that I need their support but anyone are answering me lol

Luca | SpyDefi | ⛔️: Thank and sorry for disturbing here

Ceren: Is there any TON wallet which supports 12-word mnemonic?

Luca | SpyDefi | ⛔️: If I’m OT pls remove my messages

Bear: ?[ (reply to 42019)

Sol: Hi everyone.are there any people here interested in meeting blockchain enthusiasts ton? bangkok city

Howard: How to turn a hex String to a decoded data?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: let decoded = Buffer.from(hex_String, 'hex'); console.log(decoded); (reply to 42042)

Simon: Dear friends, Please tell me, is it possible to send TON coins and gererate a new TON address with curl and ton-http-api ? I can't find HTTP-RPC methods that do it. Tnx.

Bear: hi is there way to write test case with the mainnet deployed contract? Want to test with ston.fi 's contract

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you can send transactions to any contract, contracts response regardless of your purpose of this transaction. You need TONCOIN to do it (testnet coins/mainnet coins). so, clone contracts and write your tests locally using simulator. It will be much cheaper. (reply to 42045)

Bear: I want to simulator in test-cases

Piotrek: Hi guys, what language should I learn to develop smart contracts on TON? FunC seems pretty low level and hard to learn for starters but TacT looks much better, but is TacT alive?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tactlang (reply to 42048)

Howard: https://tact-by-example.org https://docs.tact-lang.org (reply to 42048)

Ivan: Hey guys, is there a way to find out (on frontend side) is wallet deployed or not, using ton-connect v2 sdk?

Anderson | Steam Protocol: Hey, on the website I can find the average earning of a validator but not of just a full node or just liteserver?

Anderson | Steam Protocol: Can you please let me know how can I find an approximate earning from liteserver?

&rey: I can give a precise one: $0. (reply to 42053)

User<6072338193>: OH that's great let me read through it. (reply to 41952)

Mahdi: Hi everyone I'm hosting the first Helsinki TON meetup on Wednesday in Helsinki XR Center and online via zoom  Please join and ask your Finnish TON enthusiast connections to join as well.  Thank you and hope to see some faces from this group there.  RSVP here: https://www.meetup.com/ton-helsinki/events/298029435/

Anderson | Steam Protocol: So, they don't even get the transaction fees or any kind of rewards? Then why would someone run a node outside of the organisation. Does this mean that all the nodes are just ran by TON which makes it non-decentralised? (reply to 42055)

&rey: Validators are decentralized, liteservers from config are questionably so, but there are services (mostly indexers, like tonconsole.com) which also have liteservers and may get payments. (reply to 42058)

&rey: Transaction fees are exactly deterministic and go to validators, probably to the one who included transaction in block. Intermediate nodes have no say in this.

Anderson | Steam Protocol: Can you please confirm this from someone from the team that do liteservers or full nodes without validator gets the transaction fee or not? (reply to 42060)

Андрей: you can raise a node yourself (not a validator) and see your zero earnings (reply to 42061)

Irie: Is this is scam site

&rey: It may be. If it asks for secret key, don't provide one. (reply to 42063)

Irie: I got it from an admin in Bitget wallet Discord

&rey: Then report them for scam/fraud and don't talk with them anymore. (reply to 42067)

Irie: Yh, but it’s for a Ton problem (reply to 42068)

Irie: This

&rey: Could you explain the problem in writing? (reply to 42076)

Irie: I can’t add the LKY$ token to Bitget

Irie: Or send it out

&rey: 1. Is its address from the site you trust? 2. Visit https://tonscan.org and check out whether LKY address really has a contract deployed. (reply to 42078)

Irie: Yes. Alright.

Irie: Jus checked it doesn’t

Bear: + (reply to 35932)

Maxey: This error code represents Cell underflow. (reply to 42087)

Yuri: Hello, can I get current timestamp of the blockchain using sandbox? Is it possible to advance time? This is currently returning undefined:

Howard:      let getCurTime: () => number;   ...beforeAll(....) {         getCurTime = () => blockchain.now ?? Math.floor(Date.now() / 1000); } (reply to 42089)

Howard: details: https://github.com/ton-blockchain/liquid-staking-contract/blob/35d676f6ac6e35e755ea3c4d7d7cf577627b1cf0/tests/Controller.spec.ts#L106 (reply to 42090)

Howard: maybe also with this extract function: function timestampToDateString(timestamp: number) {     let date = new Date(timestamp * 1000);     let dateString = date.toLocaleTimeString();     return dateString; } (reply to 42089)

Yuri: Gotcha, but then it wouldn't work if there's a way to advance the blockchain time. (reply to 42090)

Shashank: Try https://ide.nujan.io/ this (reply to 42045)

Shashank: You can learn Tact. and play with tact contact you can use https://ide.nujan.io/ and we have all pre-build template to lear tact easily (reply to 42048)

Yuri: Can I change internal blockchain time just by overwriting blockchain.now? (reply to 42091)

NIK: Do you have something similar but for func? (reply to 42094)

Shashank: Yes, when you create a new project it will ask for Func or tact . choose one (reply to 42097)

B_BIG_MIC: Is possible to delete collection from getgems? (My own collection)

Luca | SpyDefi | ⛔️: So anyone can help me move my TONS from here? (reply to 42030)

Luca | SpyDefi | ⛔️: @wallet_supportbot

Luca | SpyDefi | ⛔️: Is this working? (reply to 42102)

Luca | SpyDefi | ⛔️: I need just an answer from the support lol from 3 days almost

Luca | SpyDefi | ⛔️: I think this is just crazy

B_BIG_MIC: How to update description of my NFT (Im a deployer) ?   I mean update contract info. Is it possible?

Mr: I connect my wallet to ston.fi but balance is not syn? Is that error from the web?

Kerry: Can someone help me? im trying to add liquidity to ston.fi but when I click transfer ton it says "Failed to calculate fee" and I have enough ton and tokens

Adapt: Hi. Tonconsole offers mempool endpoint for tracking the stream of pending inbound messages:  https://docs.tonconsole.com/tonapi/streaming-api#real-time-notifications-about-pending-messages-mempool  Is there any built in mempool stream access via full node, for example via ANDL protocol or that would require extra coding and full node modifications?

CripticHood | Drops💧: Stewie, only @wallet team can help you with thay. You don't have the private key or phrase. (reply to 42105)

CripticHood | Drops💧: Probably from stonfi, you could see one complain above. They issue is resolved ? (reply to 42109)

Kerry: Not working with chrome tonkeeper extension neither Firefox, using Firefox does not even detect tonkeeper..  worked using mobile app with QR code (reply to 42112)

Kerry: What a pain😅

Adam Lanchester: hello guys, i looking for some skilled devs that are able to build custom mini apps that works with the ton chain, some nft/defi things  paid ofc if can showcase your skils

CripticHood | Drops💧: The extension is still a working process. (reply to 42113)

— 2024-01-16 —

🅰🅻🅰🅽: Have anyone created liquidity pool on ston.fi (mainnet) before?   I have just deployed a jetton contract named MTS (https://tonviewer.com/EQDDZK6-KljppeIDfr9cLqYFnBa3-9FgC5aOQTMKEudGDo97/jetton/EQAyw3X9tF8juCsraSluoFP5zBkXlvpc6H0jFT2vImwMCG6v), and then i try to provide liquidity on ston finance app with TON/MTS pair.  However, the transaction failed with exit code 136, which is invalid address error. How can i solve this problem? https://tonviewer.com/transaction/af36a6febcce0256432b03a338ec01f7342cf7cc3fc63099f6c22d38a556aed0

Tim: Are you doing it through stonfi ui?

🅰🅻🅰🅽: yes

🅰🅻🅰🅽: By ston.fi UI, the response desination part is empty, i think this is the cause of the error (reply to 42127)

🅰🅻🅰🅽: Is this a bug by ston finance?

Rohit: is there any group for miniappDevelopment?

ai ˙ᵕ˙: https://t.me/twa_dev (reply to 42132)

monczkaS: Hey! I am using Ton Connect SDK but my wallet can not connect on Telegram Mini Dapp - where is the issue? On desktop once I scan QR Code it connects but on Telegram Mini Dapp no

Warren || Takeover $Pepe24K: Hi, I'm having a missing transaction. The platform I'd used to send TON out didn't ask for a memo on their transfer page. It's over a week now they still claim the liquidity provider didn't send the funds yet

Bear: how to get the transaction hash here

&rey: console.log(await wallet_contract...);, it will return an object. (reply to 42137)

Bear: My return is empty (reply to 42138)

&rey: In type hints, or actual value? (reply to 42139)

Bear: Return type as void

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: share the console.log(await wallet_contract...); result (reply to 42141)

Bear: Txid:  undefined      let res = await wallet_contract.sendTransfer({         seqno,         secretKey,         messages: [             internal({                 to: callingContract,                 value: deployAmount,                 bounce: true,                 body: packed,                 init: {                     code: init.code,                     data: init.data,                 },             }),         ],     });     console.log("Txid: ", res);

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: are you sure you are using correct API key and correct end point? (reply to 42143)

Tim: what do you even expect method to return, it's void (reply to 42144)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: client provider return transaction result, how to catch it?  I think blueprint's prebuilt script runner can help on this (reply to 42145)

Tim: Blueprint has custom methods. You don't get that on real network

Tim: You need to scan transactions on your account for one with same body, but i'm not going into that

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'll send you some code to fix it (reply to 42143)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: add this code to previously code you sent  async function untilTransaction(wallet: any, prevs: Transaction[]) {     return new Promise((resolve, reject) => {         let timer = setTimeout(() => {             reject(new Error('timeout'));         }, 10000);         let check = () => {             client.getTransactions(wallet.address, {limit: 11}).then((transactions: Transaction[]) => {                 let news = transactions.filter(t => !prevs.find(pt => pt.prevTransactionHash == t.prevTransactionHash));                 if (news.length > 0) {                     clearTimeout(timer);                     let tx = news[news.length - 1];                     if (tx.description.type == 'generic' && tx.description.aborted) {                         reject(new Error(`aborted`));                     }                     resolve(tx);                 } else {                     setTimeout(check, 200);                 }             });         };         check();     }); } and:     let prevs = await client.getTransactions(my_wallet.address, {limit: 10});     await wallet_contract.sendTransfer({         seqno,         secretKey,         messages: [             internal({                 to: callingContract,                 value: deployAmount,                 bounce: true,                 body: packed,                 init: {                     code: init.code,                     data: init.data,                 },             }),         ],     });     let tx = await untilTransaction(my_wallet, prevs);     console.log(tx);   not tested yet  EDIT: you have to add more checker to be sure you are tracking correct transaction

Tim: Do not do that, some other tx can be sent to your wallet

Tim: you need to find tx with same *body*

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You are absolutely right and I did not pay attention to this point. But it can be a starting point for him as showcase. (reply to 42155)

&rey: In test methods the method is declared to return void as well but returns actual transactions information. (reply to 42145)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: downvote for this? 😁 Or is there another issue? (reply to 42154)

jasio: Hey devs, with stonks team we create first trading bot on TON chains. Our next goal will be sniper bot/MEV bot.  If you dont mind, I encourage you to check how it works and test it. I will be greateful if you use my referral link  @stonks_sniper_bot  sTONks telegram:  @stonksonton  You can dm me if you have some questions 🙂

Howard: Tim means that is not the best way to get TxHash in real network I think (reply to 42158)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: A real programmer doesn't use sample code from forums in real projects, I wrote that post on my phone to help him find a way. Like any other developers forums. (reply to 42160)

walker: I saw this, but don't know how to convert

walker: https://github.com/ton-core/ton/issues/10

walker: maybe someone can do this

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tondev_eng/39687 (reply to 42164)

walker: no, there is no  SendTransactionResponse

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tondev_eng/42153  but it's sample, you have to add more verifier to be sure you are tracking correct transaction (reply to 42166)

walker: need more convenient api in the SDK, really difficult to use for developers, and this is also a very common feature

Samyar: How can i mint a Soulbound nft using a javascript sdk? Tonweb preferred

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Is this a headline news review? 😁  https://t.me/tondev_eng/42157 (reply to 42168)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what library you are using? (reply to 42166)

walker: @ton/ton

walker: just this

walker: const wallet_contract = tonClient.open(wallet); wallet_contract.sendTransfer(...)

walker: like this code

walker: in the backend

walker: not frontend

Samyar: what are you trying to do ? maybe i could help ? i did not get what you want (reply to 42176)

walker: after sendTransfer, how can I get txhash? (reply to 42174)

walker: sendTransfer return void

Samyar: does it return the boc ? (reply to 42179)

walker: void you can see

Samyar: no this is something else

Samyar: i thought it was tonconnectsdk

walker: its in the backend, so cant use tonconnectsdk

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tondev_eng/42153 so this can help?  add a try-catch then try to parse tx.body as msg body you just sent, let me know if you needs help on this (reply to 42187)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: another option is creating temp msg to get hash before sent if you only need hash, using my_wallet.createTransfer({MSG_BODY});

walker: I can try it

walker: what is the Buffer.from in the code? no that method

walker: show some error

walker: I didn't import Buffer

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: oh, I see, it's vs hint 😁  assigning Cell type to the msg can't help? (reply to 42198)

walker: yes

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'll try it soon, I'm not sure we need to recreate msg cell or we can use msg.hash() 🤔 (reply to 42195)

walker: I tried msg.hash, not equal to the txhash on tonviewer (reply to 42201)

Adapt: I set up full node and enabled ton-http-api. Now any request to the http API throws:  Failed to fetch /openapi.json  No info about it in the docs or on a github. Anyone here have any idea what the problem is? Thank you.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Oh, don't use sendTransfer or send, you should use provider to send it (reply to 42202)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: try this and let me know result, thanks await client.sendExternalMessage(not_opened_wallet_on_client, msg); (reply to 42202)

walker: not equal

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: of course base16 != base64 retry with base64 as decoder 🤔 (reply to 42206)

Andrey: luck of computer science base knowledge :C

walker: base64 return J1xkY/27qA298i6lMvM1ujoyLMg87T6WH8bY2vurIfI=

walker: it's not the txhash I think?

&rey: Seems like one. (reply to 42210)

Dmytro: Hello everyone, don’t judge strictly, I’m newbie in TON, I came for help and advice from experienced people.  I'm going to write my own indexer in node js. My goal is to receive blocks and shards in real time - find transactions in them associated with my addresses and save these transactions in the database.  I am now stuck on the question of which protocol and data source should I choose for this purpose.  ADNL or toncenter API v2 or v3 or ton-api?  2) Is it correct to say that the main method of communication between TON nodes is ADNL? And if so, then this protocol will be the most suitable for my task since I, having a list of nodes(https://ton.org/global.config.json), will be able to query them directly about blockchain data.  3) Which library is better to use ton-web or ton-org/ton?  4) Also, after indexing the data, I would like to check it using third-party sources (for example, I get all the data from ADNL and then check it on the toncenter) or does this make no sense?

Karen: Hello everyone. Has anyone done ton connect with qr code?  I would like to know something

JackryptDev: How to find wallet Jetton balance? I have a jetton contract, next calling JettonMaster.getWalletAddress(myWallet). I got the wallet jetton contract, but cannot get the amount of that Jtton balance

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: let contract = JettonWallet.fromAddress(YOUR_JETTON_WALLET); console.log((await contract.getWalletData()).balance); (reply to 42219)

JackryptDev: I've tried but it returns different value than visible in Tonkeeper Does it return balance or Jetton balance? (reply to 42220)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: should return jetton balance, you have to open contract in the client, also you should config endpoint and API key for the client provider. show your code so we can help you to debug it (reply to 42221)

User<956848646>: Lol. scammed by Marketing Directory @ Ton.

User<956848646>: Jack, I said: I agree to the compensation. But I want my last $100. lol

B_BIG_MIC: Anyone know how to update metadata in deployed contract (NFT contract) ?

ٍ: Why is my wallet blocked?

JackryptDev: yep, it works. Thank. (reply to 42222)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: toNano(amount)  fromNano(amount) (reply to 42228)

User<6989496350>: Yo

User<6989496350>: Chads

— 2024-01-17 —

Dmytro: ton-lite-client package  listBlockTransactions has args.mode and by default it == 1 + 2 + 4. Why so? And is ther mode for listBlockTransactions returns full transaction object (instead of only tx hash by default?) (reply to 42213)

Tim: Toncenter v3 is already indexer. Tonapi has some part of indexer open sourced. I don't understand your problem with ton lite client. Just use get Full Block and index every block if you want. But js is not the best Lang for indexing entire blockhain (reply to 42232)

Dmytro: Thanks for your reply. My last question was about the 'mode' parameter in ADNL.listBlockTransactions query, how it works, and what modes exists? (reply to 42233)

Tim: Have you checked block.tlb? (reply to 42234)

Dmytro: No, thanks, I'll check (reply to 42235)

&rey: toNano(amount) = BigInt(amount) * 1000000000n fromNano(amount) = Number(amount) / 1e9 (reply to 42229)

&rey: Are you following safety precaution of using non-custodial one? (reply to 42227)

Dmytro: Please, can same one help me to understand fee amount of tx (E). how to calculate it?   https://tonviewer.com/transaction/44dd0dc0ed8bfd22af1b05d042f3dba5a699bf806e2103616cdd37b9c68e132e  Оn E step  Value: 0.206365500 TON  ->  On F step Value: 0.187412500 TON   there are many types(Total fee,Fwd. fee,Forward Fee,Gas fee, .etc) of fees and I tried to sum them all,but  E_value- Fee_sum != F_value

Big: hello anyone ? i have a question about address ! how i can convert hex address like 0:xxx to base64 address ! Anyone help ?

CripticHood | Drops💧: Check here.  https://t.me/tondev_eng/38615 (reply to 42241)

TON Answers Bot (not AI): How to add LP to TON Tokens (test) from gggggg  How to add LP to TON Tokens test   !(https://127.0.0.1/)  🔗 Answer on TON Overflow

SamAY: userFriendlyAddress = Address.parse("0:3d141ceeeefde8421eede8844e1e4c59ec6dd381fd933af66235d92cd81e0b05").toString();

Vijay: Hello I want to display balance of user with the help of connected wallet how we do? i have build the wallet connection but the balance is not displaying

Speculator: Hi, Anyone have script to mint nft-item without collection?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://github.com/ton-community/nft-sdk/tree/main/cli#create-a-single-nft (reply to 42247)

ٍ: No (reply to 42239)

Speculator: where is the script? (reply to 42248)

Speculator: https://github.com/ton-community/nft-sdk/blob/main/cli/src/nftSingle.ts

Speculator: here? (reply to 42254)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you can't run it via copy-past, you should modify it to run as standalone script (reply to 42255)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: install the CLI, config the API keys, use a high level NFT tools for any scenario. If you need a script for your application or service, yes. This can be a model to do. (reply to 42255)

Angry_Ninja_Dev | Quick Intel Founder: Hi everyone!

Angry_Ninja_Dev | Quick Intel Founder: Does TON offer any builder grants?

&rey: https://github.com/ton-society/grants-and-bounties/ for generally useful projects, and you can see other grant-like ways to obtain funding on https://ton.org. (reply to 42259)

Slava: Please take a look at ton.org/grants (reply to 42259)

Matan: How long does a validator have to be down to be fined the standard fine of 101TON?

Dmytro: https://tonscan.org/tx/sKBqBWyC657aJo9wIDglBBG-TIiWwv2BiCqv9ySb7OU=  Please help.   What king of fees included in 'other'

Anderson | Steam Protocol: Any admin who can resolve this? (reply to 42061)

Anthony: only validators gets transaction fees and rewards (reply to 42061)

XFT: Please help, I'm trying to deploy a contract on the testnet using the Blueprint SDK. At the approval stage, I consistently receive an error when trying to connect the wallet:  Connected to wallet at address: EQBpiplFM9ulL4lqzcBv_4KULYSxjes9E0tbKubKik7-rcQf Error: Invalid address   wallets are activated, and there are test tokens on balance. How to fix it?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: try with deeplink or inline mnemonics (reply to 42269)

XFT: Same error with deeplink,  ? Which network do you want to use? testnet ? Which wallet are you using? Create a ton:// deep link Error: Invalid address  But with mnemonic i got this   Error: Mnemonic deployer was chosen, but env variables WALLET_MNEMONIC and WALLET_VERSION are not set  Where I can set it?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: seems you are connected, can you show your deploy script? (reply to 42269)

D: hello, do you know why I  can't find some transactions from the wallet in blockchain explorer?

User<6514207421>: Check your dm (reply to 41912)

Howard: hi, what is this line of code means?       .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)

— 2024-01-18 —

Big: Thanks you (reply to 42245)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I guess 3 messages forward ton amount and indicators that there is cells with  data in references:  wallet1->wallet2,  wallet2->owner, wallet2->response (reply to 42287)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: oh, I just loaded image, it's mint op, so I don't know 😁 but related to the references indicator and forward amount (reply to 42287)

Howard: I mean.... FunC.....🫥

Jeff: It may help  https://github.com/markokhman/func-course/blob/f56b3f046824d0c8e2df51fc31f5e36a3003cfa2/Chapter%204/Lesson%203.md?plain=1#L240 (reply to 42292)

brian: https://docs.ton.org/develop/smart-contracts/messages (reply to 42292)

Howard: Thanks Jeff (reply to 42293)

aaa: HI ,Can anyone help me? Thanks in advance. I encountered two problems.   The first is that I obtain transaction information based on the block height. How do I collect transaction information to get the complete fund transfer situation? The data observation is not very clear.   The second problem is that I often submit nonces. When encountering return:   LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction A5E1195104A1AFA2CB555EF39C324AADB4C17B4A57563BC9E486D4305F552813:\nexitcode=33, steps=33, gas_used=0\nVM Log (truncated):\n...OW\nexecute XCHG s1,s3\nexecute LEQ\nexecute THROWIF 35\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute ENDS\nexecute XCPU s3,s2\nexecute EQUAL\nexecute THROWIFNOT 33\ndefault exception handler, terminating vm with exit code 33  ,   if I want to be like evm, it is not feasible to submit the pengding nonce in order.

aaa: An example of the first question mentioned above is：https://toncenter.com/api/index/getTransactionsByMasterchainSeqno?seqno=35312390， Look for EQCfb2__slATxko73DUHP8LvQrIlwc-yPKgL_fy2JjFf0QNe. (reply to 42297)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: TON is guesswork, we have poor documentation, so help us to understand 😁 (reply to 42300)

Tim: Look into block.tlb (reply to 42301)

Simon: Hello guys! I need your help please. What is the best way to generate new addresses and sending TON and Jettons via RPC API ? For example, sending TON by curl requests. Toncenter API doesn't have such methods. https://toncenter.com/api/v2/

Denis: you want custodial wallet service (reply to 42304)

Denis: try to check @wallet/@xrocket/@cryptobot APIs

Simon: tnx, but i can't use an external service APIs by safety requirements. I can use  a Full node / liteserver / scripts at our servers only. (reply to 42306)

&rey: If you want to send transactions more often that once 20s, you can find highload wallet useful. (reply to 42297)

Denis: https://github.com/gobicycle/bicycle. (reply to 42307)

Simon: yes, bicycle, but it is impossible to get  ids of withdrawal transactions there. i should give txids to our customers. I find a simple way to solve my task  but can't see anything really workable for 2 days :( (reply to 42309)

Denis: it was added yesterday. maybe still not merged to master (reply to 42310)

Denis: oh. even not pushed to github. you can ask author in https://t.me/tonbicycle

Howard: what is this will be in message op_code? https://github.com/ton-blockchain/token-contract/blob/fe3ac33bc8a2d181ae27464c14942dc2ab513bda/ft/jetton-minter-discoverable.fc#L65   0x0000021, no?

Howard: oh its' 0x0000015  NFT Item: Transfer(0x5fcc3d14) -> 1607220500 (reply to 42313)

Andrey: 21 is 10-base system, 0x - is 16-base (hex) (reply to 42313)

Howard: @andreypfau gm, how can we find the exit code in this repo? It doens't right? Like ExitCode 73.   https://github.com/ton-blockchain/token-contract (reply to 42313)

Andrey: Try to find all 73 literals in project (reply to 42317)

Howard: Can't understand why there is the zero

J.: I have 50 TON coins in Telegram but there are only so many queries. what is the reason?

Ken: What's the message size limit for external messages?

Howard: 2mb before the acceptMessage? (reply to 42322)

Ken: And what's the limit if the first instruction executed is acceptMessage? (reply to 42323)

Daniil: https://github.com/ton-blockchain/token-contract/blob/fe3ac33bc8a2d181ae27464c14942dc2ab513bda/ft/jetton-minter.fc#L60 (reply to 42317)

Daniil: exit code zero = success. (reply to 42319)

Howard: Success? 🥹 (reply to 42326)

Daniil: If transaction is failed, it might be an error during action phase. Tonviewer shows only compute phase exit code in preview. Scroll down to see detailed info about tx (reply to 42327)

Ann: What software is TON built with?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: IDEs maybe with cpp support 🤔 (reply to 42333)

Speculator: hey guys how can i confirm a transaction with boc? in javascript

Speculator: I did a transaction with @tonconnect/ui-react and after succes i got a boc

Speculator: how can i validate that transaction

@𝐘𝐞𝐥𝐥𝐨𝐰_𝐃𝐮𝐜𝐤: Who can answer me.  Why are all my transactions to another user marked as SCAM?  0.3 & 0.2 TON sent and marked as SCAM

User<1463408356>: Hey how do i transfer jettons from main wallet to user, i wrote some code but im having errors like: "Unhandled error API key does not exist", even tho i use correct api key

Howard: how possible we wrote the test-case in FunC? .....

Andrei: Hi, can someone tell me. I use wallet_highload_v2r2 when sending multiple transactions with an interval of 5 seconds. some do not get into the block. we have to re-send it. what is the reason for this happening?

Daniil: it was like this long time ago (reply to 42343)

CripticHood | Drops💧: If you're getting "api key error " try print the api key first to ensure that it is in fact being read from your env file. (reply to 42342)

Speculator: I deployed a single nft item using this code https://github.com/ton-community/nft-sdk/tree/main/src/wrappers/getgems/NftItem

Speculator: My deployed contract is this, but i didn't se nft_item in interface on tonviewer. whats the issue

David: GM guys. Wondering about the general process of grants application other than just the filling out of the questbook. Appreciate if y’all could point me to some wiz to talk to bout it. Thx!

User<1463408356>: it is i ran into another issue thats related to tonweb and i can't really fix it without manipulating source code so i think i will just write my own smart contract (reply to 42347)

User<1463408356>: however im not sure if it's possible to do so: I want to write smart contract for my jetton that after receiving TON payment will send my jettons to user

User<1463408356>: how do i do that?

User<6534687175>: Hey,  Need someone to help in creating NFT mint page

— 2024-01-19 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: They ask you to install malicious software for voice calls and have no information about smart contracts. Beware of their tempting offer. (reply to 42340)

Sleapy: Hello, is there a way for interacting with my Liteserver using TL Schema describes in files "ton_api.tl" and "lite_api.tl" ? I tried with tonlibjson but it does not understand the TL string I send, I guess it only understands what's defines in "tonlib_api.tl"

Speculator: I deployed a single nft item using this code https://github.com/ton-community/nft-sdk/tree/main/src/wrappers/getgems/NftItem  My deployed contract is this, but i didn't se nft_item in interface on tonviewer. whats the issue

Speculator: https://testnet.tonviewer.com/kQAo85wvAnhS4kN9NXKIc09hc6MLAXjOn2WlZQAGEet28ngb This is my deployed contract, I didnt see nft_item in interface

Howard: hi, why these 2 example of sending message in FunC are difference?               .store_uint(0x18, 6)                   .store_uint(0x10, 6)

Howard: oh, `.store_uint(0x10, 6)` means bounceable.   https://t.me/tondev_eng/30102 (reply to 42360)

&rey: 0x18, 6 is bounceable; 0x10, 6 is not. (reply to 42361)

Howard: 👍🏿 (reply to 24052)

Howard: What kind of situation will we get this? No response error code etc.  I think only because my contract didn't have better return message when I send the message? (reply to 42364)

User<1304845162>: Friends, I greet you all. Tell me, do Ton20 have any prospects? Or is it trash that should be thrown away?

&rey: Judging objectively, Ton20 has zero onchain guarantees so it's unrelated to TON. (reply to 42366)

Howard: why having this error when sending the message?

Anderson | Steam Protocol: So, basically all the other nodes except validators are ran by organisation only, be aise why would some other person run it if there is no earning from it. The network becomes non decentralised then. Most of the nodes are run by you guys only (reply to 42268)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: generated link is too long, use mnemonic (reply to 42368)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: in the complex contracts, those with long code (green chars in background), for any operations those needs code, mnemonic is the best option. because you should send code too. (reply to 42368)

Howard: Thanks!

Howard: By the way, is there proper way to import the FunC Hex result? Right now it's mannuall paste is annoying for me

Madhur: Hi guys I just to want to know the documentation of how the ton foundation bridge works exactly like what function of the contract is called.  For example i want to transfer some token from ETH to TON , i know in Ethereum side that i need to call the Lock functionlaity of the bridge smart contract but i don't know what method of the TON Bridge smart contract should i need to call after the 65 blocks confirmation.  It would be very helfpful if i get a low level unferstanding or documentation of it. Thanks I also want a flow like how it happens from the ton bridge contract side after 65 block confirmation, how does it know what account to pick and what step and what operation does it do on the ton side bridge contract

Andrey: https://chat.openai.com/g/g-YLgSk1WeI-ton-blockchain-helper  everybody who has access to prem chatgpt feel free to visit the link. in this custom gpt are uploaded all whitepapers and few public apis of ton. It solves technical questions (tvm, fift, tonapi, blockchain principles) way better than generic gpt 3 or 4

Howard: any chance that the sendMessage in FunC with mode 64 without need put the value right?

Anthony: Sorry, I don’t get your point. What’s difference with other chains (reply to 42369)

TON Answers Bot (not AI): Access TONs in Jetton contract type wallet from Joachim Hodana  hey i wrote smart contract that allow users to send TONs to smart contract address and receive my jettons,everytime i mint new jettons and burn these on my main wallet (im not sure if thats good way but i couldnt find a way to "transfer" these). TON's are on my smart contract wallet but i cant really find a way to access them, how do i do that? Do i need to somehow transfer them to different wallet after every user transaction, how can i code that? Thanks.  smart contract code: https://mystb.in/RingsVaultDiploma   🔗 Answer on TON Overflow

Zero: how do I send transactions using @ton/ton package in nodejs???

Howard: 🌊 🫡 🥹 (reply to 42373)

Howard: () send_text_message( slice to_addr, int value, int mode, builder content) impure {     var body = begin_cell()                 .store_uint(0, 32)                 .store_builder(content)             .end_cell();      var msg = begin_cell()                 .store_uint(0x10, 6) ;; nobounce                 .store_slice(to_addr)                 .store_coins(value)                 .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)                 .store_ref(body)             .end_cell();                  send_raw_message(msg, mode); }

Howard: I see (reply to 33938)

Howard: I need to put return() in the end..... (reply to 42385)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: throw(0) (reply to 42387)

Patrick: Ayo I have a question, I got a request to make a nft minting site on a TON chain, i requested 1.6k usd for the basic features with testing. Was I overcharging or undercharging? Client went silent so I wish to get some feedback from you gs

Maxey: Another approach is to throw(0xffffff) at the end if none of the if conditions are met. (reply to 42387)

Patrick: In my opinion, it was a cheap as fuck price, knowing the market and most of the devs who would do it cheaper would probably leave black holes in terms of security and bugs, I might be wrong tho

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Be sure that no one will do it cheaper than you. However, this has nothing to do with the topic. (reply to 42392)

Patrick: Yeah i did an offtop, sorry but had to source some opinions from the experienced guys (reply to 42393)

Patrick: Thanks!

OMIDREZA: او یه

Big: hello everyone, i have a question. How can a get blockchain fee before call sendTransfer method ?

Big: Anyone help ?

Zero: anyone?? (reply to 42383)

Zero: I just simply want to send TON from one wallet to another

Tim: If you'll create great minting website, you most likely can receive bounty at least for 800 ton. But I don't know how site like that should even look (reply to 42390)

Zero: await contract.sendTransfer({     seqno,     secretKey: keypair.secretKey,     messages: [       internal({         to: "kQBIHFmZcDFolBnTlRfbq9V_8ffm02I6SA7EUOQoSy_5rgxv",         value: toNano("0.5"),         body: "Hello",         bounce: false,       }),     ],   });  I am doing this to do the transfer

Zero: wait, first I did a transfer of 0.22 but that thing happened but then the new transfer of 0.5 went straight, why?

Zero: I created a new account kQBIHFmZcDFolBnTlRfbq9V_8ffm02I6SA7EUOQoSy_5rgxv

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: body: comment("Hello") (reply to 42402)

Zero: is a body needed?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: no (reply to 42406)

Mikhail: cause i guess you set "bounce" flag to "true" when you were sending 0.22 (reply to 42403)

Patrick: Where i can get more info about the bounty? Someone posted it somewhere? (reply to 42401)

Zero: oh okay (reply to 42408)

Zero: lemme try again then

Tim: https://github.com/ton-society/grants-and-bounties (reply to 42409)

Speculator: I deployed a single nft item using this code https://github.com/ton-community/nft-sdk/tree/main/src/wrappers/getgems/NftItem  My deployed contract is this, but i didn't se nft_item in interface on tonviewer. whats the issue

Speculator: https://testnet.tonviewer.com/kQAo85wvAnhS4kN9NXKIc09hc6MLAXjOn2WlZQAGEet28ngb This is my deployed contract, I didnt see nft_item in interface

Zero: thanks, this worked (reply to 42408)

Maxey: Are you asking about the transaction fees incurred when interacting with other contracts, or are you referring to just simple transfers ton to other wallets? (reply to 42397)

Zero: I transferred 0.022 TON from this account to another but the other account didn't receive it

Zero: this was a new account btw

Zero: I first need to deploy it and only then send a transaction?

Maxey: You can deploy the contract and send a transaction at the same time. Can you show me your tx link? (reply to 42419)

Zero: https://testnet.tonviewer.com/transaction/8f07d647b9fde4a2a5166564a809fd681e1bafd279156bf69e10fe8686fa8af1

Zero: this is the deploy message's link (reply to 42421)

Zero: how to deploy a wallet?

Maxey: Is it possible that the first tx has already deployed, and then you sent another deployment message to this contract?🤔

Zero: ig I can simply transfer like 0.001 TON and make it a bouncable transaction

Zero: trying on a new wallet now (reply to 42425)

Zero: any way to check the status?

Zero: I meant using @ton/ton (reply to 42429)

Zero: in JS

Maxey: I haven't used @ton/ton to check, but I have used tonsdk to do so.

Zero: how do I deploy the wallet tho?

Zero: anyway to get the toncoin current price in usd?

Maxey: Do you want to get the price within the Contract, or retrieve it in JS? (reply to 42434)

Zero: just any API (reply to 42435)

Zero: for current price of toncoin

Zero: thought coingecko might have it but nope

Maxey: TON website lists some exchanges that provide TON prices, and you can access the price through the exchange's API.

Zero: there's no direct way of getting price in USDT so what I did is that I get the price of a pool of TON and jUSDT (reply to 42439)

Big: Yeah! Not contract. Just only simple transfers ton to other wallet. (reply to 42416)

&rey: https://help.crypt.bot/crypto-pay-api#getExchangeRates (reply to 42434)

I: Hi guys is it possible to create own fake ton coin and sell it

Xaceo: Genius! 👍 (reply to 42443)

n0body_u_kn0w: Hey guys, did u hear about tonsites.io

User<1463408356>: How can i access tons that are in my jetton contract type wallet (smart contract address), is that even possible? Or how can i transfer these tons in smart contract after SM receive it

— 2024-01-20 —

Howard: 2 ways to set OpCode: Which one is less in gas-cost?   const op::increase = "op::increase"c;   or   int op::redeemMessage() asm "0xe59fbd25 PUSHINT";

&rey: First one, or equal. (reply to 42453)

Maxey: If you are using Jetton Transfer, you can specify an address in the response_destination (the address where to send a response with confirmation of a successful transfer and the rest of the incoming Toncoins). This way, the remaining funds can be transferred to the address you designated. For more information, you can refer to the following link: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 42449)

Howard: 👍🏿 https://answers.ton.org/question/1537301150401826816/what-is-the-recv-internal-function-and-what-are-its-arguments-for#write-post (reply to 1072)

Howard: Did anyone use the function selector in the FunC code?   And it's in Int right? (reply to 41688)

Howard: nice! (reply to 40483)

Behrang: Function selector translates to recv_internal, recv_external, ... in FunC. (reply to 42457)

Howard: mean this right? Method_id. Not the opCode: https://docs.ton.org/develop/func/functions#special-function-names (reply to 42459)

Howard: Question: - What is the different for inline and impure in FunC? - Why there has the situation that can use impure inline at the same time?  https://docs.ton.org/develop/func/functions#specifiers

Howard: https://blog.ton.org/func-journey-2 (reply to 42466)

Daniil: Both of these specifiers are described in details if you scroll a little bit down. (reply to 42466)

Howard: I think more examples or guidance in detail about “why you shouldn't do A or B... because of XYZ” (reply to 42468)

Daniil: inline and inline_ref don't affect the result of computations. but they can optimize gas and storage consumption in certain cases. (reply to 42469)

Daniil: and for impure specifier, please refer to the same docs page above. Everything you need is described there: If impure is not specified and the result of the function call is not used, then the FunC compiler may and will delete this function call.

🦖DINO TON💎: hi all how to get hex format from address? js

Maxey: You can use toRawString(), and get hex format

User<1463408356>: well im still having some problem understanding the concept, like i want to just create pre-sale functionality so user can send TONs and get my jettons basing on fixed rate with max pre-sale supply being 15%, i tried making that in minter, but minting tokens for user and burning the rest to stay at the same supply level don't seem reasonable  I wrote something like this in wallet.fc but im not sure if it's correct https://mystb.in/PowersellerSupervisorsPichunter (reply to 42455)

DanIsNearby: Hi in what app i can mint soulbound nfts?

DanIsNearby: is there an ative app for that something like POAP but for TON?

Howard: output actions, c5 register (reply to 29942)

User<5227284656>: Is there a dev here who could help me with SDK from DeDust and Stonfi. I have everything done but it throws me an error when I do everything according to the github projects.  I will pay of course.

User<5227284656>: Hi, I have the issue when calling pool.getData()  Code snippet import TonWeb from 'tonweb'; import {Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS} from '@ston-fi/sdk';  export async function getStonfiLpData() {   const provider = new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {apiKey: ${apiKey}});   const router = new Router(provider, {     revision: ROUTER_REVISION.V1,     address: ROUTER_REVISION_ADDRESS.V1,   });    const pool = await router.getPool({jettonAddresses: ['EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv', 'EQATcUc69sGSCCMSadsVUKdGwM1BMKS-HKCWGPk60xZGgwsK']});   // here throws an error   const poolData = await pool.getData();    return poolData; }  The response is Error: http provider parse response error     at Function.parseResponse (...\node_modules\tonweb\src\providers\HttpProviderUtils.js:51:25)     at HttpProvider.call2 ....\node_modules\tonweb\src\providers\index.js:159:34)     at processTicksAndRejections (node:internal/process/task_queues:96:5)     at async Y.getData (..../node_modules/@ston-fi/sdk/dist/index.js:244:43)     at async getStonfiLpData (..../src/services/stonfi1.js:13:20)     at async runApp (.../src/app.js:16:3) {   result: {     '@type': 'smc.runResult',     stack: [ [ 'num', '0x13f19' ] ],     exit_code: -13,     '@extra': '1705753807.8920226:7:0.24784247969995787'   } } (forwarded from JackryptDev)

User<5227284656>: 🙏🙏

Sina: Hello guys Is there any step to step video to teach how can i  run a ton website? I have TON DNS but i dont know how can i connect my website to TON dns

Sina: I read the document and tried prompts on linux but it's complicated and i couldnt run the site

🩻ボウダン: Hi guys, is there anyone here who is looking for a Ton Solidity developer?

Howard: What is the c7 register? Can anyone explain it to me as if I were a 3-year-old?  - https://docs.ton.org/learn/tvm-instructions/tvm-initialization#control-register-c7 - https://github.com/ton-community/ton-contract-executor (reply to 31251)

Sina: could you help me to run website with ton domain? (reply to 40990)

User<5227284656>: @admin (reply to 42482)

User<6035507815>: Yes

CripticHood | Drops💧: Try putting it in a try - catch, although this looks like an API error.    try {   const pool = await router.getPool({jettonAddresses: ['EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv', 'EQATcUc69sGSCCMSadsVUKdGwM1BMKS-HKCWGPk60xZGgwsK']});   const poolData = await pool.getData();   return poolData; } catch (error) {   console.error("Error during HTTP request:", error);   throw error; } (reply to 42482)

TON Answers Bot (not AI): I cant send my tokens in chain ton to another wallet. from Artur  i have tonk tonkens. i have them in trustwallet. but i cant import this wallet to another ton wallet because it has 12 words and the others have 24. moreover, I cant see my tokens in trustwallet. i see they are there in the ton explorer scan. but i cant dl anything with them. i need help  🔗 Answer on TON Overflow

Ruslan: This is not an issue. Your browser sends GET request, but it should be POST (reply to 42495)

CripticHood | Drops💧: Ooh 👍🏻 (reply to 42497)

𝐃𝐎𝐍𝐜𝐫𝐲𝐩𝐓𝐎𝐍: Hi Can I ask when this collection will be available for purchase?

Boris: is TACT not widely used?

— 2024-01-21 —

&rey: Probably these NFTs are minted as part of some tutorial. You can purchase one if someone decides to sell their own. (reply to 42499)

Howard: those are not put on sale (reply to 42499)

User<1463408356>: <Cell refs_num: 0, bytearray(b'\x0f\x8a~\xa5\x00\x00\x00\x00\x00\x00\x00\x00@_^\x10\x08\x01-\xa5U\r\x90\x14fa\xafM\xe9y\x1d\x98\xfaf\xcd\x96*\xcb\xa1wQ\x01\x86\xf04\xa3\xfet:\x8f\x00%\xb4\xaa\xa1\xb2\x02\x8c\xcc5\xe9\xbd/#\xb3\x1fL\xd9\xb2\xc5Yt.\xea 0\xde\x06\x94\x7f\xce\x87Q\xc0')> >  {'ok': False, 'error': 'INVALID_BAG_OF_CELLS: bodyinvalid bag-of-cells failed to deserialize cell #23 [Error : 0 : unused space in cell serialization]', 'code': 500}  What could be the problem? I can send code but i use python tonsdk so im not sure if there are people who use it

B_BIG_MIC: Does anyone have a library of ready-made smart contracts?

B_BIG_MIC: Or tool like OpenZeppelin but for TON?

Maxey: Can you show me how you generated this cell? I have previous experience using tonsdk. (reply to 42505)

Maxey: You can check this out (reply to 42506)

User<1463408356>: Damn sorry i will send it to you later this day because im already in bed (5am here :v) (reply to 42508)

User<1463408356>: However im thinking of switching to tontools library because ill be much easier to tranfer jettons with it

Kenny$$Shillz: These are Vladimir alefmans tutorial proof of completion nfts.. I think they are minted out (reply to 42499)

Kenny$$Shillz: I haven't seen such a rep (reply to 42507)

&rey: https://docs.ton.org/develop/smart-contracts/examples (reply to 42506)

Howard: Hey Andrey, why the code at save_data() without the input sometimes tho? (reply to 42515)

&rey: Some contracts store parameters in global variables, and save_data() reads them. Other pass them as arguments to save_data(...).

Howard: so the previous one, doesn't change the contract Storage? (reply to 42518)

&rey: Both set contract persistent storage. (reply to 42519)

Anderson | Steam Protocol: Other chains have more number of validators to it become decentralised, but you guys are not giving anything to run a light node or full node without validator so nobody will run it which make the organisation to control the network (reply to 42381)

User<6198262100>: Please help me out, I'm not familiar with TON and I want to learn. I want to create a website with a button and text, but access to the text should require payment of 0.1 TON. Where is the best place to start and what sections should I read? Is it technically feasible in the current state of the TON network? As far as I understand, I don't need to write contracts for this, and it should be sufficient to just use some API. Could you suggest which specific APIs would be needed?

Tau: Hi! I'm interested in personal trading bot on ton, does anyone sell such bots here?

Speculator: I did a tx using tonConnectUi.sendTransaction(defaultTx) in return i got a  boc = "te6cckEBBQEA4QAB4YgAN/uw2aN5akvA3YwOYzoS4ffk48t93pBXHjFD36hKXCoBiHHEatzVXm4FWanWqR8Y8egKx1pfU8IhhXCDpwXXq2ZkO16y3oJdTKhOfQC1Y6bODKOn/NSqeezqLs6DRT3IKU1NGLstZ1fYAAABkAAcAQJnYgB9JEPpoCjO7bjHXZkJaDNzZhfvcoMZotk9ya5eCCG+LRh6EgAAAAAAAAAAAAAAAAACMgMCAAABFP8A9KQT9LzyyAsEAEjTAdDTAwFxsJFb4PpAMHCAEMjLBVjPFiH6AstqAc8WyYBA+wA6ymtW"

Speculator: How can i decode this boc?

Speculator: I did something like this to get tx hash, But i want to decode whole tx. Can anyone share me some example how to did it.      const bocCell = tonweb.boc.Cell.oneFromBoc(tonweb.utils.base64ToBytes(res));     const hash = tonweb.utils.bytesToBase64(await bocCell.hash());     console.log("Transaction Hash:", hash);

Samyar: wdym? (reply to 42527)

Samyar: Hi           const transaction = await connectWalletUI.sendTransaction({           messages: [             {               address: jettonData.toString(true, true, true),               amount: toNano(0.05).toString(),               payload: tonweb.utils.bytesToBase64(jettonsTranferMessage),             },           ],           network:             clientEnv.NEXT_PUBLIC_TON_NETWORK === 'main'               ? CHAIN.MAINNET               : CHAIN.TESTNET,           validUntil: Math.floor(Date.now() / 1000) + 120, // 120 sec         })    this is my code and it says it's expired in telegram wallet but i have set the valid to 120s

Samyar: if you want to get the transaction data you can use https://toncenter.com/api/index/ api and use getTransactionByInMessageHash  the hash you get is not the transaction it's the message hash (reply to 42527)

&rey: To my knowledge, they may not even exist yet. (reply to 42524)

&rey: And what about those who do? (reply to 42521)

&rey: Anyways, your concerns were already mentioned, and when payment channels become more popular, liteservers may request payment through them.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I saw some bots doing NFT trading, especially on anonymous numbers (reply to 42531)

Tau: It exists for sure, in fact it is just a script to swap tokens on stion.fi directly with some custom triggers (reply to 42531)

Speculator: I want to verify tx is success or failed? (reply to 42528)

&rey: That's external message that has been sent to blockchain. You can emulate it or lookup the corresponding transaction and its results. (reply to 42526)

&rey: There's no clear-cut definition of "success" / "failure", is there? Especially with token swaps or whatever. (reply to 42536)

Speculator: contract deployment of nft item

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: for deployment you can use prebuilt await waitForDeploy(CONTRACT_ADDRESS) if you are using blueprint framework, or you can get an idea of how to do it by checking this function. (reply to 42539)

Speculator: i am not using blueprint

Samyar: I wrote a function to confirm the transaction on my backend (reply to 42539)

Samyar: I send the boc to the backend  And then get hash and confirm it using the destination and the amount

Samyar: I will send you asap

Speculator: Thanks in advance (reply to 42544)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: use try-catch and try get nft_data, if success item deployed if not try it again every 2 sec for 10 sec until success else return deployment failure   there is a sample code that can help: https://t.me/tondev_eng/42153 (reply to 42541)

Speculator: i am using tonconnect/ui-react to send transfer (reply to 42546)

Speculator: .sendDeploy(sender, toNano("0.05"))

Speculator: sender: {             send: async (args: SenderArguments) => {                 const stateInit: StateInit = {                     code: args.init?.code,                     data : args.init?.data                  }                 const initCell = beginCell().store(storeStateInit(stateInit)).endCell();                 tonConnectUI.sendTransaction({                     messages: [                         {                             address: args.to.toString(),                             amount: args.value.toString(),                             payload: args.body?.toBoc().toString("base64"),                             stateInit: initCell.toBoc().toString("base64")                         },                     ],                     validUntil: Date.now() + 5 * 60 * 1000,                 });             }         },

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: good, next line try get_nft_data if it returns the value you expect, deployment success, else retry after 2 seconds, 5 times (10s) is enough to catch transaction success or not (reply to 42549)

M. Yosefpor: Hi all I had a question regarding TON spaces. as I understand, it is a non-custodial version of the previous ton wallet. But it has an option to have email recovery, and it can be imported on other devices with some numbers sent to email. So how can it be non-custodial with having email recovery?  Are there any documentations explaining how it works under the hood? I can guess it is using that number as a seed to recover the private key, but how is that seed is stored/generated?  Also are there any smart-contracts which associates my TON space with my telegram_id / email?

User<1463408356>: Hey here is my code for transfering jettons (i also don't know how to specify where do i specify whatk ind of ton do i want to transfer), you can also see my custom client in the second that https://mystb.in/JewelSecuredLanding (reply to 42508)

Maxey: I think the problem is forward_payload🤔 (reply to 42553)

User<1463408356>: well lemme remove it then and try one more time, how about that code kwarg in jetton_wallet, what do i need to specify in it?

Maxey: The last time I encountered a problem with forward_payload, I resolved it in the following way.

User<1463408356>: well i don't really need it, it's not that important tbh I just want to make it transfer jettons

User<1463408356>: {'ok': False, 'error': 'INVALID_BAG_OF_CELLS: bodyinvalid bag-of-cells failed to deserialize cell #2 [Error : 0 : Not enough bytes [got:31][expected:42]]', 'code': 500}

User<1463408356>: this now

Maxey: dm you

Bear: what is the limit to save the data in FunC array? And how to achieving it?  Like: map<Int in uint256, Bool>

Bear: oh it's dictionary

Bear: storage (reply to 35775)

User<1463408356>: thank you so much @Kobeyourself (reply to 42562)

Andrey: Using dictionary in func is bad practice, try account sharding instead (reply to 42563)

Maxey: Recently, I noticed that RedStone oracles on TON💎 have introduced a more efficient method for updating prices. I'd like to share a method called Actual Price quoting:  When a quoter offers a price of 1 TON = 20 jUSDT, they actually need to deposit 1 TON and 20 jUSDT into the Oracle. If a verifier believes this quote is undervalued, they can directly purchase the 1 TON with 20 jUSDT🤩.  If the quoter's price isn't arbitraged for a period, it indicates the accuracy of the price✅. The Oracle can then incorporate this quote, and the quoter is rewarded💰.  Unlike other oracle's mechanism, which relies on node-sourced quotes and uses token collateral to ensure quote quality, the Actual Price method encourages quoters to provide accurate prices, or else face the risk of arbitrage💀.

Maxey: Furthermore, due to TON's high TPS⚡️, the waiting time for quoters to get verified is relatively faster compared to other chains. Assuming the verification time is 10 blocks, it would take 120 seconds on Ethereum, but only 50 seconds or even less on TON.   This approach is highly compatible with TON's characteristics, making it very suitable for implementation on TON💎.

User<1463408356>: What's wrong, what does that exit code means?  jettons_amount = transaction["jettonsAmount"]     to_address = transaction["toAddress"]     seqno = get_seqno(wallet.address.to_string()) or 0      body = (         begin_cell()         .store_uint(0xF8A7EA5, 32)         .store_uint(0, 64)         .store_coins(int(1000 * jettons_amount))         .store_address(Address(to_address))         .store_address(wallet.address)         .store_bit(False)         .store_coins(0)         .end_cell()     )      # Create transfer message     query = wallet.create_transfer_message(         to_addr="EQCq8ZnUcYtLHLyVCU6NbjNRyCB7mb-NwzF-Zc0RHnEUh1JA",         amount=to_nano(4, "ton"),         seqno=int(seqno),         payload=body,     )     message: Cell = query["message"]      boc = bytes_to_base64(message.to_boc(False))     client.send_boc(boc)

CML Pablo: Hello i have a question how to convert Raw adress to shorter using python? I was looking in the web, and here and didnt found the answer

User<1463408356>: in tonsdk, you use Address("address").to_string(True) (reply to 42572)

User<1463408356>: or wallet.address.to_string(True)

CML Pablo: is there any script without wrapper?

User<1463408356>: not surre

CML Pablo: but tonsdk is for python yes?

User<1463408356>: yes

CML Pablo: thank you sir i will use it

Maxey: If anyone is interested, please check out here for details on our team's implementation of the Actual Price Oracle on TON💎.   Soon, we'll need developers to assist us in testing quotes, to experience both receiving rewards for quoting and the process of verifiers arbitraging on incorrect quotes. We'll appreciate your assistance when the time comes.🙏🙏🙏 (reply to 42569)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: address[:4] + '...' + address[-4:] if address else '' (reply to 42572)

🦖DINO TON💎: hi all!  how to get jetton name by address?  js

User<1463408356>: . (reply to 42571)

Crypto: Hi, maybe someone can tell me, I want to create a DAO (Decentralized autonomous organization) on the TON network.  I've been progressing for a long time, but I won't figure out something in this topic .... If I give advice on where to start or throw useful links, I'll be grateful 🖐 Is it even possible?

Howard: good question (reply to 30712)

Crypto: 😅 (reply to 42587)

Howard: Do you know how raw_reserve_extract() means?  https://docs.ton.org/develop/func/stdlib#raw_reserve_extra (reply to 30714)

User<6072338193>: yeah, I think DAOs are possible on all blockchains so TON shouldn't be difficult also I don't have advice on how to start but I a good direction on how to continue once you've started. (reply to 42586)

Barbell: Hi all I am having an issue

Barbell: return beginCell().storeUint(config.id, 32).storeDict(Object.create({})).endCell();

Barbell: is not working as it's complaining for store dictionary doesn't exist.

— 2024-01-22 —

Nakli Aman: Hey how can i connect to fragments using mytonwallet ?

Nakli Aman: i use ledger and wanted to buy few telegram numbers

Hunter: Hello, is there anybody looking for a frontend & contract developer?

Hunter: feel free to contact me if you need a dev.

Mobin: Hi there, Is there any TON dev community chat in Iran?

Stone: May i know where to get USDT for testnet bridge?

TON Answers Bot (not AI): What is the best way to understand the & and opcode transit in TEP? from Howard  Tags were calculated via tlbc as follows (request_flag is equal to 0x7fffffff and response flag is equal to 0x80000000):  crc32('transfer query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:Maybe ^Cell forward_amount:VarUInteger 16 forward_payload:Either Cell ^Cell = InternalMsgBody') = 0x5fcc3d14 & 0x7fffffff = 0x5fcc3d14  crc32('ownership_assigned query_id:uint64 prev_owner:MsgAddress forward_payload:Either Cell ^Cell = InternalMsgBody') = 0x85138d91 & 0x7fffffff = 0x05138d91   more....    My question is why the first and second one got different result:  - 0x5fcc3d14 & 0x7fffffff => 0x5fcc3d14  🟢 - 0x85138d91 & 0x7fffffff => 0x05138d91 ❓   🔗 Answer on TON Overflow

Jeribond: Hello, is there a tool to batch send tokens to multiple TON wallet addresses? Or do we currently have to do that one by one?

Bear: how (reply to 39941)

people you: We're actively on the hunt for a Lead Smart Contracts Engineer to spearhead the development of our client's cutting-edge open-source Smart Contracts libraries and frameworks. We're in the market for a Solidity Rockstar with a stellar track record of over 4 years in the field. Key Highlights: Mastery in Solidity and proficiency in at least one additional language (excluding Smart Contracts). Robust background and expertise in EVM and Layer 1, 2, and 3 environments. Acquaintance with the intricacies of network node architectures. Proven experience in previous smart contract code audits, either as a maintainer or auditor.  Location: The flexibility to work remotely or be based in our vibrant office, including the dynamic city of London.  Compensation: A competitive salary ranging from $170.000 to $450.000 awaits the chosen Rockstar. To submit your application and for further details, please reach out to the account @BroxyArgon

Howard: if I add more field in the Jetton Token contract like this, will it still be called the Jetton Interface in explorer?

Zero: https://tonviewer.com/transaction/166c506d96ba3007800be40e7c747bd3a65d3037b3a2cda42e2500583dc1afa2  my swap transaction failed, any idea why?

Tim: explorer looks at get methods, get_jetton_data() and such, not at storage (reply to 42605)

Zero: hey Tim any idea about the stonfi swap? (reply to 42607)

Zero: my transactions keep failing

Tim: No. Better ask stonfi (reply to 42608)

Roma: Hello everyone, I apologize in advance for the incompetence in the crypt and the tone) I am an android developer, I have an application like TodoList. I want to implement the storage of these notes in the blockchain using smart contracts. I tried to write smart contracts. I even found an example with an implementation based on an example case like mine. But there is a problem, it's all in ts language. But there is a ton-kotlin library. But the documentation is incomprehensible from the word at all) I don't understand how the work with this library should be structured. Maybe someone has an example of implementing smart contracts using ton-kotlin?

people you: We're actively on the hunt for a Lead Smart Contracts Engineer to spearhead the development of our client's cutting-edge open-source Smart Contracts libraries and frameworks. We're in the market for a Solidity Rockstar with a stellar track record of over 4 years in the field. Key Highlights: Mastery in Solidity and proficiency in at least one additional language (excluding Smart Contracts). Robust background and expertise in EVM and Layer 1, 2, and 3 environments. Acquaintance with the intricacies of network node architectures. Proven experience in previous smart contract code audits, either as a maintainer or auditor.  Location: The flexibility to work remotely or be based in our vibrant office, including the dynamic city of London.  Compensation: A competitive salary ranging from $170.000 to $450.000 awaits the chosen Rockstar. To submit your application and for further details, please reach out to the account @BroxyArgon

Daniil: This is chat related to development on TON blockchain, not Ethereum. (reply to 42612)

botmother: hello @pcrafter , how can i post on your job board?

Howard: In FunC, should we keep the Address? that shows in Storage as well? (reply to 42607)

brian: How can i clear localStorage of my TWA running in cell phone?

Max | TonMap: Hello everyone,  I have a task. It's a store with a lot of products, let's say 10 million products, which means 10 million IDs.   - A user can make a payment and receive a product, and the smart contract will record the user as the owner of a specific product by its ID.  - The user can then verify on the blockchain that they indeed own the product with that ID. In the contract, there will be a pair of wallet and ID stored.  How can this be implemented? Does the contract have a limitation of 32,000 elements in its storage?  Thank you.

Daniil: to sell these products and represent their owner on-chain, you can simply use SBTs (soul-bound nfts) or implement a custom contract for your needs. after that you can easily verify ownership both on-chain (with merkle proofs) and off-chain (simply by fetching item's owner from contract). (reply to 42620)

Shashank: I have written an article titled 'Why TON Will Lead the Charge in Web3 Mass Adoption.' I would appreciate your feedback and would be grateful if you could share it. Thank you.

Daniil: actually, merkle proofs aren't even required. since SBTs (and possibly your custom contract) don't allow owner change, you can just implement a ownership request operation that will send a response with owner address of a given item.  but merkle proofs would allow to do that in a single transaction, which is faster. (reply to 42621)

Max | TonMap: Oh. Good. So. I can use the soul-bound nfts and creating for 10 millions these tokens? Has TON github  example of it? Thanks (reply to 42621)

Daniil: just create an SBT collection and mint items to those who purchase your products.  or if you want to do all that onchain (and if that fits your project needs), you can write a simple smart contract that will accept payments from users and mint SBTs to them. (reply to 42624)

Huy: Hello everyone, i currently build dapp and using tonconnect/ui to connect to tonkeeper, but i only send transfer TON token, i want to integrate contract to send token other, please help me.

&rey: Interfaces for Ratelance are a bit broken since tonapi has shut down v1 version; I'm working on restoring it, including a prettier site. (reply to 42614)

Falco: Is there any (or plan to launch) a telegram channel for TON validators/node operators?

Just: Hi everyone. Who can help with question - how to get transaction hash after transfer send ? I use TypeScript TON library. I made successful transfer sending. But I can not get trasaction hash.  Thank you.

&rey: @tonstatus. (reply to 42632)

Falco: It doesn't allow any communication between validators/node operators (reply to 42634)

TON Answers Bot (not AI): How can I get transaction hash after transfer sen ? from No Name  // Create a transfer const seqno: number = await contract.getSeqno();  const transfer = await contract.createTransfer({   seqno,   secretKey: keyPair.secretKey,   messages: [     internal({       value: '0.11',       to: 'EQBVXzBT4lcTA3S7gdrg5hnl5fnsSWj4oNEzNp09aQxkwj1G',       body: '123456',     }),   ], });  const res = await contract.send(transfer);  I tried to decode transfer with transfer.hash().toString('hex'); But after sending I compared hashes and they was different.  I thought that I can find it in getTransactions(): Transaction[] data after transfer send. With trying to find it by seqno. Cause I know current seqno and transaction with seqno+1 must be that I need. But I didnt find seqno in getTransactions() items.  How can I get actual hash after transfer send? I use TypeScript ton library. Thank you.  🔗 Answer on TON Overflow

Howard: Question: why we set the local parameter in left example? global int ctx_id; with the impure   And right one is inline and without claiming the global int?

Daniil: What’s your question exactly? These are just two different ways of doing the same thing. (reply to 42639)

User<1463408356>: What does that exit code means?

Howard: I mean, can you explain with me how those () save_data() impure {}  and () save_data() impure inline_ref {} in difference? (reply to 42641)

Howard: I see,

Just: Is it possible to find the answer ? Thank you🙏 (reply to 42638)

&rey: You're not providing <Maybe forward_payload>, its absence must be indicated by bit 0. (reply to 42642)

Howard: .store_coins in FunC is in 120 bits right?  https://docs.ton.org/develop/func/stdlib/#store_coins

Daniil: Not exactly. It can range from 4 to 120 bits if I remember correctly (reply to 42648)

Behrang: * at least 4, and at most 124. (reply to 42649)

Behrang: In FunC development (and TVM in general) you can use local variables and pass them on stack when you call different functions.  You can also set global variables, and without passing the variable to a function, use that global variable inside any function afterwards.  Initially I used local variables. But it made my code longer. After refactoring to global variables, I have saved a lot of lines, I think I had about 30% less lines of code, and gas usage was still good. (reply to 42644)

BTC25: TonMiner (reply to 42632)

Behrang: In summary:  coins is an alias for VarUInteger 16, which means it will take a variable bit length depending on the number of bits of the integer.  Since it's VarUInteger 16, it will use 4 bits to store the length of the integer in bytes. So, it can store a number between 0 to 15 in those initial 4 bits.  If your number is zero, only 4 bits of 0 is stored.  If your number is greater, depending on the required bytes, it will store the number of bytes (at most 15) and then store those number of bytes.  Max number is 15 bytes, which is 15 * 8 = 120 bits.  So you can serialize an unsigned integer up to 120 bits in a coins, and you will use at most 124 bits.  Some example numbers and their bit representations:  0 => 0000 1 => 0001 00000001 259 => 0010 00000001 00000011 (reply to 42648)

TON Answers Bot (not AI): a transaction succeeded but to another wallet from pol  Hi all, have a question. I have a new Tonkeeper address, and I've sent to it 25 ton. Nothing arrived, so i checked it out on tonscan.org, and well, when i insert my address, it shows another address and tons are there. I don't really understand what happened, and in the section "contracts" it says: "Uninitialized address This address doesn't contain any data in blockchain — it was either never used or the contract was deleted. Now it just aimlessly floats in the digital void."  does this mean that i've lost my token actually?  i've other tonkeeper wallets on other phones and was always fine!😵‍💫  🔗 Answer on TON Overflow

— 2024-01-23 —

Howard: 👍🏿👍🏿👍🏿 (reply to 42653)

Howard: Extra Currencies in get_balance within the Cell

User<6520246934>: whatup i heard this where the hackers ain't

User<6520246934>: when docs tell you not to install as root they mean it

User<6520246934>: think i didn't accidentally delete the /ton-work/ fully downloaded snapshot before retrying the install? think twice

Howard: Got error when I wrote like this:     (int balance, _) = get_balance();   Error: Error: Func compilation error: contracts/jetton/jetton.fc:273:37: error: cannot assign an expression of type [int, cell] to a variable or pattern of type (int, ??304): cannot unify type (int, ??304) with [int, cell]       (int balance, _) = get_balance(); (reply to 42664)

Howard: Oh, I found. It should be:      int ton_balance = get_balance().pair_first(); (reply to 42669)

User<6520246934>: i'm stuck here. the config is corrupted or something?  ultimately sudo mytonctrl tries to restore the config and then returns  RecursionError: maximum recursion depth exceeded in comparison  i already did the wget mainnet config.json and the .backup stuff so i'm not sure what else to try  any ideas?

Destroyer: Hi, I have a question that how can I know if a transaction status is success or failed via the getTransactions API call of toncenter?

Sina: Hello guys there is a problem, I used this two prompts in linux terminal :  wget https://github.com/ton-utils/reverse-proxy/releases/download/v0.2.0/tonutils-reverse-proxy-linux-amd64 chmod 777 tonutils-reverse-proxy-linux-amd64  ./tonutils-reverse-proxy-linux-amd64 --domain sinadehghan.ton   then i recieved a Qrcode and when i scanned that and paid the fee i got the ADNL domain:  vz4efgqtntyrusz2tuorjr7a5a4jxfpkidjhvcjv2fx4e6ibddttdgm.adnl  and in https://dns.ton.org/ in domain management in "TON Site" tab this address automatically saved:  73c214d09b6788d259d4e8e8a63f0741c4dcaf520693d449ae8b7e13c808c739  but now i get this error :  TON Site vz4efgqtntyrusz2tuorjr7a5a4jxfpkidjhvcjv2fx4e6ibddttdgm.adnl is not responding.  Any help?

Sina: I'm using  Tonutils proxy app to connect to the TON proxy.  I tried many times but nothing changed i still get two type of errors:  RLDP Proxy Error: Get "http://http//vz4efgqtntyrusz2tuorjr7a5a4jxfpkidjhvcjv2fx4e6ibddttdgm.adnl/": dial tcp: lookup http: no such host   or   RLDP Proxy Error: Get "http://vz4efgqtntyrusz2tuorjr7a5a4jxfpkidjhvcjv2fx4e6ibddttdgm.adnl/": failed to connect to site: failed to find address of vz4efgqtntyrusz2tuorjr7a5a4jxfpkidjhvcjv2fx4e6ibddttdgm.adnl (73c214d09b6788d259d4e8e8a63f0741c4dcaf520693d449ae8b7e13c808c739) in DHT, err: value is not found

R: Hello everyone. I would like to ask if there is any way to verify the relationship between the signer and the multisig wallet without private key, basically all I can think of is to generate a multisig wallet with the same parameters and compare it's address, is there a simpler way?

Falco: Have you tried running it as root? Something like: sudo -i and then trying the command again. (reply to 42672)

jasio: Hello everyone.  If you dont mind, I encourage you to check out telegram trading bot on TON - how it works and test it. For now we have around 5.3k registered users.   I will be greateful if you will have some suggestion or tips 🫶🏻  @stonks_sniper_bot  You can dm me if you have some questions 🙂

Sunny: Hey guys I am building a bot and trying to make Menu button as Game button and using this  ctx.setChatMenuButton() but i don't seem to understand how to pass this MenuButtonWebApp as param in it? following this https://core.telegram.org/bots/api#setchatmenubutton

Sunny: something like this button

User<6520246934>: can someone help me get mytonctrl running? it's erroring because of config — i'm new to this

mfckr.ton: hello devs, coming from solidity . where can i find easy guides on deploying NFTs and fungible tokens on Ton . anything that can do better than the official doc

Ken: https://minter.ton.org/ (reply to 42683)

mfckr.ton: Thanks any one for NFTs (reply to 42684)

people you: We're actively on the hunt for a Lead Smart Contracts Engineer to spearhead the development of our client's cutting-edge open-source Smart Contracts libraries and frameworks. We're in the market for a Solidity Rockstar with a stellar track record of over 4 years in the field. Key Highlights: Mastery in Solidity and proficiency in at least one additional language (excluding Smart Contracts). Robust background and expertise in EVM and Layer 1, 2, and 3 environments. Acquaintance with the intricacies of network node architectures. Proven experience in previous smart contract code audits, either as a maintainer or auditor.  Location: The flexibility to work remotely or be based in our vibrant office, including the dynamic city of London.  Compensation: A competitive salary ranging from $170.000 to $450.000 awaits the chosen Rockstar. To submit your application and for further details, please reach out to the account @BroxyArgon

Howard: what is the &&(and) in FunC?

nonam3e: Bitwise & (reply to 42689)

Mika: Good afternoon honourable Developers !   If someone can clarify my question I will appreciate that   ❔ does the Ton have possibility to create a DAO

Daniil: Yes. (reply to 42692)

Mika: Thanks alot (reply to 42693)

Zero: is there a way to get the jettons that an account holds?

Zero: and the balance of how many of each jetton?

Howard: I think using global variable is that you don't need to type-in the parameters all the time right? Even tho your function just changed 1 storage parameter, you still can use unpack() + save_data() to quickly safe the data. (reply to 42651)

Behrang: The reason for using global variables in my code is to remove many lines of code and improve readability.   Here is the commit that I've changed code from using local variables to use global variables:  https://github.com/HipoFinance/contract/commit/a69ab3f2276e61c075da59b4231271af525d6840  In the old version, in every function I had 10 to 20 lines of code just for loading data, and a few more lines to save data.  After the change, there are only two to four lines of code. The logic of each function is easily visible and readable.  The gas cost was not very different from the previous version, so it was worth it. (reply to 42698)

Howard: Brillant! (reply to 42700)

Howard: I think FunC compiler can implement some message structure check or someting?   I stuck in the Exit Code 9 that can't figure out why the tx failed.

Daniil: you're trying to read more from a cell than is there (reply to 42702)

Comrade.ton: Gm! Can someone tell me how to send a bid to an expired TON DNS?

Remi: Gm

Remi: Yeah, check Getgems, you can mint single NFTs or collections there pretty easily  https://getgems.io/nft/create?nft_type=nft_in_collection (reply to 42685)

Howard: haha I found. It's the unknown message OP code (reply to 42709)

Zero: hey my txns keep bouncing

Zero: const { mnemonic } = activeWallet;     // const friendlyAddress = Address.parse(address).toString();     const seed = decrypt(mnemonic);     const { wallet, keyPair } = await getWallet(seed);     const seqno = (await wallet.methods.seqno().call()) || 0;      const transfer = wallet.methods.transfer({       seqno: seqno,       secretKey: keyPair.secretKey,       toAddress: toAddress,       amount: toNano(transferAmount),       sendMode: 3,     });  this is my code

Zero: using tonweb

Tim: Probably your address is bounceable

Zero: meaning?

Zero: it used to happen with @ton/ton too but I could just pass bounce: false in it to avoid this

NIK: Can anyone recommend a design asset pack for TON with toncoin 3D models for creating promo material?

Bear: hi, how to let my contract enable to receive string message "Mint"?

Howard: You can take a look about Hipo's code here: https://github.com/HipoFinance/contract/blob/fa8b09e5a993751d47d37cee4c35f1c3288c7602/contracts/treasury.fc#L1517 (reply to 42718)

User<5227284656>: Hello, Looking for a dev that can build on TON - I mean a bot that is configured with the TON network. Is there anyone like that here and looking for a simple assignment?

Zero: is there a way to check whether an address passed is a Jetton? (reply to 42714)

Just: Hi all. How to decode Slice to json or string with TypeScript Ton SDK ?

Howard: is it possible to use the get method function inside same the FunC code?

Adapt: Hi there. I'm trying to parse the raw transaction. I have example in_msg:  "in_msg": {   "@type": "raw.message",   "source": "EQBK05ruPpEltNYZE4bpUOG_JyuYYpG6Ro54wn6a7emgnYT7",   "destination": "EQARULUYsmJq1RiZ-YiH-IJLcAZUVkVff-KBPwEmmaQGH6aC",   "value": "600235000000",   "fwd_fee": "1321344",   "ihr_fee": "0",   "created_lt": "44028120000002",   "body_hash": "D//8Zajek+sk2k3tq88z50cE1OIgalO92btHO81rBSU=",   "msg_data": {     "@type": "msg.dataRaw",     "body": "te6cckEBAgEAZwABbw+KfqUABeSQPenMGFi7LJcACADvO5kConGyoByJOKUjz+JOcYR6rramIAAe1Ep3rA5wnBA4B0MDAQBT/Pnlj4AGAnpo0IBn5ZHP4Zot3in354PWuSUFZoFsZNpUF0d1VMlhsqkPMulYwQ==",     "init_state": ""   },   "message": "D4p+pQAF5JA96cwYWLsslwAIAO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCcEDgHQwI=\n" }  I'm trying to figure out how to decode message field but cannot find any info in docs. Simple base64 decode is not working.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: extract the method to the separated inline method and use it inside getters or setters (reply to 42723)

— 2024-01-24 —

&rey: And do you know the TL-B scheme of message to be parsed? Is that a simple text message, jetton transfer, or something other? (reply to 42724)

Bear: hi all, I have the code over here, I checked with dump in each line of value, and noticed my value didn't change here with set_data()

Bear:  () save_data() impure inline_ref {     begin_cell()                 .store_coins(storage::total_supply)                 .store_slice(storage::admin_address)                 .store_ref(storage::jetton_content)                 .store_ref(storage::jetton_wallet_code)                  .store_uint(storage::start_time, 32)                 .store_coins(storage::max_supply)                 .store_coins(storage::cost_per_mint)                 .store_uint(storage::total_duration, 16)                 .store_uint(storage::mint_rate, 32)                  .store_uint(storage::last_mint_timestamp, 32)                 .store_uint(storage::acutal_mint_times, 32)                 .store_uint(storage::is_owenr_claimed, 1)                 .store_slice(storage::treasury)     .end_cell()     .set_data(); } (reply to 42735)

Shashank: I have written another article titled 'Challenges in Developer Onboarding on Blockchains: A Closer Look'. and How we are solving it on TON. I would appreciate your feedback and would be grateful if you could share it. Thank you.

Bear: 😭 (reply to 42735)

MS: Hello!  i downloaded binaries file then i wanted to run their. But i am getting these messages.   root@walue-ABRA-A5-V15-4:~/binariesss# ./func --help ./func: error while loading shared libraries: libsecp256k1.so.0: cannot open shared object file: No such file or directory root@walue-ABRA-A5-V15-4:~/binariesss# ./lite-client --help ./lite-client: error while loading shared libraries: libsecp256k1.so.0: cannot open shared object file: No such file or directory root@walue-ABRA-A5-V15-4:~/binariesss# ./fift --help ./fift: error while loading shared libraries: libsecp256k1.so.0: cannot open shared object file: No such file or directory root@walue-ABRA-A5-V15-4:~/binariesss# ./storage-daemon --help ./storage-daemon: error while loading shared libraries: libgsl.so.27: cannot open shared object file: No such file or directory

MS: are there any list of require packages

MS: and how can i install all them?

botmother: Hello guys, anyone knows how to deploy this, it doesn't have blueprint run  https://github.com/dvlkv/nft-jetton-sale-smc/

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you can migrate any tact/func projects to the blueprint project. however, deploy script is not a part of blueprint framework but it's pre-defined script for contract's template (reply to 42744)

Hidanz: hey , please how can i validate a certain address if it is a ton address or not, i am using nodejs typescript.

Andrew: import TonWeb from "tonweb";  export function on_message(bot: Bot<MyContext>) {   bot.on("message", async (ctx) => {     let msg_text = ctx.message.text;     if (       msg_text?.startsWith("EQ") ||       msg_text?.startsWith("UQ") ||       msg_text?.startsWith("kQ") ||       msg_text?.startsWith("0Q")     ) {       if (TonWeb.utils.Address.isValid(msg_text)) {         let net = "Mainnet";         if (msg_text?.startsWith("kQ") || msg_text?.startsWith("0Q")) {           net = "Testnet";         }          let address = new TonWeb.utils.Address(msg_text);         let hex = address.toString(false, true, true);         let bounceable = address.toString(true, true, true);         let non_bounceable = address.toString(true, true, false); (reply to 42746)

botmother: Anyone knows how to use ton js to send jettons?  https://ton-community.github.io

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: import { Address } from '@ton/ton'; ... console.log(Address.isAddress(userInput)); (reply to 42746)

Maxim: Hi guys👋  My name is Maxim, I am an active developer in the TON ecosystem. I have an idea to develop such a project: https://github.com/ton-society/grants-and-bounties/issues/418.  My message is simple: the more we can collect standard and non-standard contract templates in one place - the better for the community. I propose to make 1 control repository with templates of a certain format, and I and my team will develop a convenient web-interface in a container, which will allow to study these templates quickly and easily.   If you are close to my idea, please support my application on Github — 🚀, thanks🙏

&rey: Differences to https://docs.ton.org/develop/smart-contracts/examples? (reply to 42753)

Maxim: I like the way the information on the official resource is structured.   But the idea was to collect more examples of different algorithms that can be implemented in the TON smart contract languages (for example, different kinds of game logics and so on). That is, it will be needed more for demonstration (Education category).  We are interested in wrapping this in an interface so that the description is interesting and easy to read (deep understanding of the logic, e.g. add an animated demonstration etc.). (reply to 42755)

Y̷A̷M̷I̷: Guys, I don't know many things about the testnet. Is there a DEX where I can trade, put liquidity and more into testnet?

Bear: hi why will we get this error in FunC?  Error: Func compilation error: contracts/jetton/jetton.fc:223:50: error: cannot apply expression of type int to an expression of type (): cannot unify type () -> ??298 with int           int claimableAmount = muldiv(my_balance(), 10 , 100);           int claimableAmount = muldiv(my_balance(), 10 , 100);

Bear: oh, it should be my_balance not my_balance()

ダーリン: hello! can i return something from contract method, after it executed on frontend? for example i execute some method and then it returns me a number. I'm using @tonconnect/ui-react

User<6554754495>: where do noobs ask questions?

Dario: stonfi has a testnet version of the dex. No ui for it sadly, you have to use sdk to make txs (reply to 42761)

— 2024-01-25 —

Y̷A̷M̷I̷: Ah.. I'm not able (reply to 42766)

Destroyer: Hi, everyone. Does anyone know how a staking deposit is recorded in the transaction history? I mean I look up a wallet address’ transaction history via toncenter api and how can I distinguish a normal transaction with a staking deposit transaction? Does the staking deposit transaction has a message value with “d” in it?

Madhur: Hi Guys , can someone help me with this error -  data: {       ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state',       code: 500     }  it would be really helpful

Madhur: Trying to do swap on StonFi sdk

Madhur: Here is the method i am trying to run -  const byteArray = Array.from( new TonWeb.boc.Cell(tonToJettonTxParams.payload).toBoc()); const binaryString = String.fromCharCode.apply(null, byteArray) ; const base64Encoded = btoa(binaryString) ;  const d = await contract.createTransfer({   seqno,   secretKey: keyPair.secretKey,   messages: [internal({     value: tonToJettonTxParams.amount,     to: tonToJettonTxParams.to,     body: base64Encoded   })],   sendMode:2 });  await contract.send(d); }

Speculator: Cell {   bits: BitString {                                                                                                                             array: Uint8Array(113) [       136,   0,  55, 251, 176, 217, 163, 121, 106,  75, 192, 221,       140,  14,  99,  58,  18, 225, 247, 228, 227, 203, 125, 222,       144,  87,  30,  49,  67, 223, 168,  74,  92,  42,   6,   5,        70, 104, 177, 151, 251, 205, 171,  25,  79,  62, 110, 189,        66,  62, 104, 254, 181, 195,  64, 106, 114, 240, 150, 102,        73, 237, 214, 234, 125, 174, 246,  15, 163, 141, 189, 241,        31,  87, 213, 231, 178, 225, 149, 161, 103,  25, 130, 116,        10, 131,  33,   7, 108,  22, 196, 175,  72, 106, 199, 119,       117,   8,  65,  77,       ... 13 more items     ],     cursor: 901,     length: 904   },   refs: [ Cell { bits: [BitString], refs: [Array], isExotic: 0 } ],   isExotic: 0 }

Speculator: Hi i am getting this type of cell how to convert it into tx body?

MS: nobody is here for reply? (reply to 42740)

Freud: Hello community, is it very difficult to learn funC language without knowing anything about programming?

Comrade.ton: Anyone here that can help with this? Can't find anything... (reply to 42705)

User<6419135370>: Hey How can i import ton wallet from private key in python?

👨‍🚀DEFINAUT🌕: Hello fam, I have a guy who gives you the bot for free, they're quite good.. they give you the price, the chart and all the details. If you are interested just let me know.

👨‍🚀DEFINAUT🌕: If you have a project and want your own bot is nice idea

👨‍🚀DEFINAUT🌕: For free ;)

Alejo: Hi guys, does anyone know if there's a Ton telelegram channel?

Daniil: @toncoin (reply to 42789)

Name: Hello guys. Has anyone met a similar problem with connecting tonkeeper?  I made everything by the instruction (only the part by the link, before 'Creating connect wallet menu' section) and after opening connect link on my phone and pressing 'connect' i got "done" in tonkeeper app but my app (telegram bot) throwed this error.  error: Uncaught (in promise) Error: [TON_CONNECT_SDK_ERROR] TonConnectError Bridge message parse failed, message undefined

matthew: Hi guys. May be someone see something like that. I successfully connected wallet via ton connect to TMA, but on confirm transaction this screens in ton keeper and tg wallet

spanish-or-vanish: hi everyone

spanish-or-vanish: is it usual that sometimes the ton docs are down

— 2024-01-26 —

Howard: is it possible to read fif code in VS code?

L: Hi all 🙂  When deploying the contract code below with the initDataCell function, it fails. However, if a value other than 0 is used in initDataCell, the deployment is successful.     ;; code #pragma version >=0.2.0;  #include "../imports/stdlib.fc";  (int, int, int) load_data() inline {     slice ds = get_data().begin_parse();     int var1 = ds~load_uint(8);     int var2 = ds~load_uint(256);     int var3 = ds~load_uint(256);      return (         var1,         var2,         var3     ); }  () save_data(     int var1,     int var2,     int var3 ) impure inline {     set_data(         begin_cell()             .store_uint(var1, 8)             .store_uint(var2, 256)             .store_uint(var3, 256)         .end_cell()     ); }  () recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {     if (in_msg_body.slice_empty?()) { ;; ignore empty messages         return ();     }     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);      if (flags & 1) { ;; ignore all bounced messages         return ();     }     slice sender_address = cs~load_msg_addr();      int op = in_msg_body~load_uint(32);     int query_id = in_msg_body~load_uint(64);      throw(0xffff); }  (int) version() method_id {     return (1234); }    // Failed initDataCell in deploy ts script beginCell()       .storeUint(0, 8)       .storeUint(0, 256)       .storeUint(0, 256)  .endCell()  // Successful initDataCell in deploy ts script beginCell()       .storeUint(1, 8)       .storeUint(2, 256)       .storeUint(3, 256)  .endCell()    It seems not to be a Cell data bit length limit issue, but could you provide insights into the cause of this problem?

Snowkid DM BAD NO: Hey I have not quite Dev but important questions, I’m new to TON but I like it.   Questions: How can you tell if a jetton contract has had admin revoked How can you tell if more jettons can or cannot be minted How can you tell where the JSON data for the jetton is stored? (or is that for the image only) Is there an API i can call for these types of things Is TON compatible with ethers.js? Can you tell if a Jetton has been minted with custom codes as opposed to TonMinter?  Thanks, I appreciate the help.

dwusiq: hell,I tried to send the message Tonweb, but got an error message: "BitString overflow",and the payload is : "data:application/json,{\"op\":\"transfer\",\"p\":\"ttt\",\"tick\":\"mm\",\"vin\":[{\"txid\":\"AW7u95LbUHmP387+5/s5OJbzwtJJHEXuI31bd09UHq8=\",\"vout\":\"0\"}],\"vout\":[{\"amt\":\"1\",\"scriptPubKey\":{\"addr\":\"UQCZe-t4-Sr7IXrcDwfbSn6nE-rQT0kaQcd8zYWichdDdbz_\"}}]}",

Andy: Hello I try to build Jetton that I own but I can’t to do deal with change   mnemonics, do you have and tip dealing it ?

Zero: can I get data of some token pre-lp?

&rey: You need to store whatever not fits (starting with 123th byte) into reference. (reply to 42802)

Bryan Dong | TAPP: Hey guys, my team recently build a sniper bot on telegram for tokens on TON! would appreciate if anyone wants to try it and give us some feedback! ❤️ https://t.me/morfeysniperbot

/ Stars Bank: Hey how can I make multiple transactions(Jetton swaps e.g.) in one block? Js

Daniil: is it Tact contract? (reply to 42811)

Andrew: you call jetton_master with a text comment?  Is it should be a mint or some request with binary body? (reply to 42811)

&rey: Send multiple (up to 4). Wherever list of messages is accepted. (reply to 42810)

Seitaro: can you provide link to transaction? (reply to 42818)

&rey: Do you also provide opcode and query ID during deployment? Do you have links to two contracts to compare? (reply to 42798)

Howard: aany example for this

Ihor: Hello! I'm trying to get staking info by address from the self-hosted TON node. Found tonapi.io which provides such endpoint: "/api/v2/staking/nominator/<address>/pools". Is there any other way of getting such kind of data using RPC calls? Thanks in advance!

Falco: What data are you looking for exactly? (reply to 42828)

Ihor: To get info about current staking balances for given address (reply to 42830)

Falco: You want to get info from the nominator address or from the validators end? (reply to 42831)

Ihor: For the nominator (reply to 42832)

Falco: Maybe you can use liteclient if you are running your own node

Falco: But using the API is easiest :D

Vanëk: domains like: EQC9CSGYHvFMMYwrRr6WUlAPe7Z_i28yY4-gABT2jSRD_-2V EQC6LmRZ_RnOZ3zNKTfsPBk1Z91ZLUWSKRxRNC9R_Aejoni_ (reply to 42753)

Ihor: I see, so TON node has functionality to return staking nominator data through ADNL, is that correct? (reply to 42834)

Ihor: maybe you know any additional sources or docs related to this topic

Falco: I think you can use get_pool_data to get info about the pool and nominators for the pool

Falco: There is also list_nominators I believe

Ihor: Thank you for quick response! (reply to 42839)

Daniil: What do you mean by that? (reply to 42814)

Daniil: In which language was your Jetton minter written?

Daniil: Then look in its sources and see what throws such error code. (reply to 42847)

Daniil: Try CTRL+F in the sources of the smart contract. (reply to 42849)

/ Stars Bank: Can I use tonweb for this? (reply to 42820)

&rey: How do you make one transaction? Actually, you can (by rewriting https://docs.ton.org/develop/smart-contracts/tutorials/wallet#sending-multiple-messages-simultaneously), but @ton/ton has better wrappers that allow to send multiple messages simultaneously. (reply to 42851)

&rey: Maybe, there is something like throw_unless("error-name"c, ...);? (reply to 42852)

/ Stars Bank: stonfi sdk & dedust sdk (reply to 42853)

Daniil: Look for “throw” keyword (reply to 42858)

walker: is there any function like signMessage in tonConnect?

&rey: Unfortunately, there isn't. (reply to 42860)

Andre: Viva Homodeus. Tell me who knows. The 8ixer engine is certainly good for creating games, but do they have the same one for 2cheap ones? If not, then what is better to write on, so that you can then connect with the TG tone?

B_BIG_MIC: Anyone know some chatGPT that have implemented TON libraries?

Bear: Update: my teammate was using the wrong version of contract code. That is why I can't find the error code tho.   Thanks for replying. (reply to 42845)

— 2024-01-27 —

Maxey: Does anyone have experience interacting with high-load wallet-v2?

User<6936587615>: Yes (reply to 42869)

0xDragon9: Can't Android Telegram App join the test environment?  https://docs.ton.org/develop/dapps/telegram-apps/testing-apps

Samyar: what is exit code -13  it was not in the docs

Daniil: Contract is not deployed most likely (reply to 42872)

Samyar: thank you   i was copying the testnet address 😐 (reply to 42873)

Radek: Hi, new to the TON coding, but with high exp in EVM ecosystem. Is it possible to do the meta transactions? (i.e. enabling users to do the write tx, while gas is paid by someone else? (so the user would not need to have any TON in her wallet))

🅰🅻🅰🅽: Hi all, i'm building a mini app for our oracle project via react.js / tonconnect-ui, however, is there anyone knows how can i sign our custom payload with private key as metamask does?

Да: Hello guys. 👋   How can I specify comment in ton connect transaction?

&rey: Please refer to the documentation. It's located on https://docs.ton.org. (reply to 42877)

&rey: By default, no. Plugin on user's wallet contract (inplug-v1, for instance), or destination contract has to support that. (reply to 42875)

&rey: There's no signing custom payloads beyond once on login (tonProof). It may be implemented in future, though. (reply to 42876)

Ransika: Hello. I made a twitter thread in my local language and posted the link in TON society group. It was deleted. So, I asked for reason. They said it is not meeting the requirements. Then I asked about requirements. I was banned. Why is that?  😑😑. (reply to 42880)

— 2024-01-28 —

Bear: is it possbile that having the error, when other people deploy my Blueprint repo? (reply to 42883)

Bear: Now we have the issued: I shared the code (in blueprint template) but my friend can't deploy the code properly.

Bear: The code he said is not changed in any place, just yarn start.

User<6639800498>: If you know nothing about trading please permit me to introduce you to a good company that offers 20% of your capital daily they also trade with bot, you can withdraw profit daily if you are interested inbox me privately for the company link

Bear: Love to heard you feedback once you wake up, thank you! @Gusarich (reply to 42889)

🅰🅻🅰🅽: Thanks for your answer, hoping that thay can introduce this feature. I want to bind telegram user to their own wallet address, so user need to prove that they have the control to their private key. Is there any alternatives? (reply to 42880)

Snowkid DM BAD NO: In TON does the blockchain allow the validator to stack the transactions in a favorable order, for example for MEV purposes

ally11: hello guys

ally11: i getting this error every time when i try to send ton tokens

Howard: I got this sometimes, maybe checking the version of TonKeeper (reply to 42895)

Daniil: What’s wrong there on screenshots? (reply to 42890)

Daniil: Ton-proofs from TON Connect. (reply to 42891)

🅰🅻🅰🅽: Is there any usecases for productions with python that can verify the proof is valid？ (reply to 42898)

Daniil: https://docs.ton.org/develop/dapps/ton-connect/sign (reply to 42899)

Bear: pop out the failed with Txs in emulate (reply to 42890)

grow_with_evidence🧿: I haven't gotten any token yet or is it that I will fund my account before I can access any token or Air drops?

&rey: There are no official airdrops, and popular scam is to get user's 24 secret words and steal their wallet contents. (reply to 42904)

grow_with_evidence🧿: Na WA o

grow_with_evidence🧿: I nor sure wetin to believe again self

Да: Unfortunately, there is no information on how to indicate a comment. (reply to 42878)

Snowkid DM BAD NO: what does adnl stand for?  https://docs.ton.org/develop/dapps/apis/adnl

Maksim: abstract datagram network layer (reply to 42909)

Snowkid DM BAD NO: is that unique to ton?

Snowkid DM BAD NO: thanks btw

Snowkid DM BAD NO: is ADNL intended to be used as an abstraction layer on top of TCP or instead of TCP

Snowkid DM BAD NO: Is it possible to change the rpc to another rpc, like in metamask? in the browser extensions for tonkeeper or myTonWallet

&rey: There are both ADNL/TCP (for connecting to liteservers) and ADNL/UDP (inside overlay network). (reply to 42913)

&rey: For browser Tonkeeper, you cannot since there are no alternatives to used indexer (tonapi). For MyTonWallet, you cannot likely because that was not implemented. (reply to 42915)

Snowkid DM BAD NO: yeah I had some issues accessing tonkeeper (browser and desktop) the other day because of a backend issue - I traced the request and it was a cloudflare error / server crash.   In eth/MM - i would just change the rpc if I had an issue like this.

&rey: unless application used fancy RPC that can emulate messages and list user's jettons. (reply to 42918)

Snowkid DM BAD NO: Yeah its different. Trying to get used to the differences…  I’m thinking about setting up a validator on a digital ocean box

BTC25: hi, is there the latest version of how to run the TON validator?

Kenny$$Shillz: Hello everyone. Hope U all having a good day .. please I need some direction. I'm trying to monitor for new token deployments on the ton Blockchain. Currently I'm using the 'subscribe_block' method I found at https://docs.tonconsole.com/tonapi/streaming-api to get the file_hash and root_hash for the blocks. Can some one point to where I can find information to answer the following questions I have: 1.How are new token contracts represented in a block? 2.What information can be used to identify a new token deployment (e.g., contract creation event)? 3. What information can be used to identify a new token deployment (e.g., contract creation event)?

Vladimir: Simple question ... rldp-http-proxy & testnet-global.config.json ... can somebody point me out to the working testnet config ? or how should I reconfigure it ?  tried a ton of options/configs but getting hit by RLDP connection timeout ... ubuntu 22.04 LTS latest ... latest testnet -global.config.json (https://ton-blockchain.github.io/testnet-global.config.json), tried build from source and also from binary releases but no luck. NAT is correctly configured (verified by tcpdump & FW logs) ... ADNL is generated and moved under keyring folder  EDIT: tried with mainnet/global conf ... and that seems to be working ... so the question is WTF is testnet configuration for when its not working for its purpose

— 2024-01-29 —

R: Hey guys, Is there an official signing tool for signing a message to prove that you own this wallet?

Kenny$$Shillz: hey guys is there a document with the list of the various out_message op_codes and decoded_op_name values for onchain transactions?

&rey: Yes. It's called "wallet app that supports TON Connect 2". (reply to 42925)

Kenny$$Shillz: This? (reply to 42922)

&rey: As transaction deploying a contract, which implements jetton master functions. Or a Merkle update including such contract being created. (reply to 42922)

&rey: https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb

Kenny$$Shillz: Yes as transaction deploying contract with Jetton master functions dir (reply to 42930)

Kenny$$Shillz: What's this eir (reply to 42931)

&rey: Representation format of blocks and transactions. (reply to 42933)

Kenny$$Shillz: It's confusing (reply to 42934)

Kenny$$Shillz: I don't know what I'm looking at

Snowkid DM BAD NO: Is there a ~one hour video presentation that covers the basics of TON and what a dev needs to know walking into the ecosystem?  I need coverage of TONs version of basic stuff that you’d normally do on eth (make contract calls, poll for data, deploy contracts) but also an explanation of how sharding applies IRL,  asynchronous contract architecture etc…

Sol: Hello. I'm looking for a job

Kenny$$Shillz: I think I hacked it.. I looked through existing token deploy transactions and saw they all have 0x000015 as the value in their op_code field .. so i filtered for transactions with the same op_code value and about 30minutes later i registered a new jetton deploy (reply to 42934)

Anshu: How to verify a ton transfer transaction status?

Anshu: i did get transaction but failed and success transaction looks same?

𓁪𝐉𝐚𝐡𝐢𝐝𓁵𓊿: Yes (reply to 42945)

Anshu: I did transaction using tonconnect-ui (reply to 42944)

User<6601463160>: Hello, I am an experienced front-end & contract developer.

User<6601463160>: does anyone need a developer?

&rey: You may find last transaction of NFT in question. Use .resolve-contract.ton if you don't have its address. Remember that transaction chains may have no well-defined time due to being spread over time. (reply to 42951)

Ihor: Hi! Is there any documentation or way to determine staking transactions (deposit\withdraw)? Thanks in advance!

🅰🅻🅰🅽: Hi 👋 Can I get all fees used in a transaction (every messages) by this ton center api?  https://toncenter.com/api/v2/#/send/estimate_fee_estimateFee_post  https://answers.ton.org/question/1571421611603529728

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hi🤚 what is the best practice to store big data? for example +1 million address records and some data related to these addresses?

Daniil: Shard that data into separate smart contracts, if possible (reply to 42960)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: a master as indexer and SC for storing their data? same as we do with nft collections and items. right? (reply to 42961)

Daniil: Yes (reply to 42962)

Danny⏱️ S/ACC: Any U.K. based devs in the house? 💎

&rey: This isn't on topic for this chat, you'd better try searching via @tonsociety. (reply to 42965)

Danny⏱️ S/ACC: Ok thanks! 🤝 (reply to 42966)

Howard: That's say I want to keep ''the minimum toncoin in 0.1" after the Tx(but with SendingRemainingValue in the current tx out)  should I set with raw_reserve(0.1ton, 0) or raw_reserve(0.1ton, 1) ? (reply to 36115)

&rey: If I remember correctly you can raw_reserve(0.1ton, 0); send_raw_message(msg, 128);

User<6639351628>: Hello, does anyone need a front-end & solidity developer?

&rey: This chat is related to TON, not Solidity... (reply to 42971)

Howard: I test out: If you want to keep certain amount of Ton after the current upcoming tx. You can:  nativeReserve(ton("0.1"), 2); send(SendParameters{to: self.treasury, value: 0, mode: SendRemainingBalance}); (reply to 42970)

Bear: what is the message value should we set in 0x7362d09c, any value?

Howard: any value, in getgem.io, it could be set with 1 (0.000000001) in 0x05138d91, ownership_assigned I remember. (reply to 42974)

User<2126719794>: https://t.me/addemoji/theopenemojis (forwarded from User<2126719794>)

User<2126719794>: https://blog.ton.org/an-introduction-to-ton-ecosystem-discover-web3-on-telegram

User<6601463160>: I am a senior front-end developer, just looking for a developer position.

User<6601463160>: feel free to contact me if you need a dev.

Mohammad: What is the roadmap for learning, building an application in the Toncoin blockchain?

Mohammad: I need a programmer to build an application on the TonCoin blockchain platform

Coinvent: You can contact us 🙂 (reply to 42987)

— 2024-01-30 —

Howard: [FunC]  Noticing the wired error show up in my VS code, although I still can compile the FunC code properly.

ston: How can I make it possible for anyone who is not an NFT collection deployer can deploy an NFT item on the collection? 🤔

Kenny$$Shillz: https://t.me/TokenCreationsTON guys I made a channel to test my bot that searches for and reports new token deployments on ton network. I will be running it for some time today and I'd like some feedback if anyone has time

Pho: Gm everyone

Bear: how to decode the jetton token content in Cell?               tokenContent.toBoc().toString(),

User<5966479809>: Hey guys pleasee help inwom 10,000 usd airdrop but when I signed the transaction.

User<5966479809>: Nothing arrived to my wallet

Denis: It's scam

User<5966479809>: How come

User<5966479809>: I can see it

User<5966479809>: From the official

User<5966479809>: Ton page itself

User<5966479809>: https://ton.org/en/community

User<5966479809>: Can you pl see advice

Snowkid DM BAD NO: DM (reply to 42995)

Pho: Did you guys see this kind of error, the sdk keep trying to send transaction. But transaction all failed

Pho: even use tonweb or gosdk, situation happenned when trying to put amount (internal message) + gasAmount greater than balance

xing: hi ,How to parse the map in Tact using Golang when I call get method

Denis: you forgot to use send mode=3 (reply to 43012)

Denis: and made invalid out messages (for example with value bigger than you have)

Pho: I used Send Mode 1 (reply to 43015)

Pho: is there any docs related to send mode

Tawfik: Hello developers  i need a little assist in confusion problem I'm trying to build tokens tracker system that give me all transactions like in GeckoTerminal site but all i websockets i found related to TON just return trx id only how can i get realtime transactions for the whole network and filter it for each token like attachment

Kenny$$Shillz: Use tonapi.io (reply to 43019)

Kenny$$Shillz: https://docs.tonconsole.com/tonapi/streaming-api

&rey: Yes, there definitely are. (reply to 43018)

Pho: I only see that 1 is for gas separately  2 is for ignore errors (reply to 43022)

&rey: https://docs.ton.org/develop/smart-contracts/messages#message-modes (reply to 43023)

Pho: So it mean I should use 16 right (reply to 43024)

&rey: I guess 2 would suit you better. External messages, once validated and accepted, should complete execution successfully. (reply to 43025)

User<1304845162>: Hi all. who understands the telegram web app? I want to understand what sizes I should use so that every user has a comfortable experience in the Telegram application.

Kenny$$Shillz: I think you should just use Ur usual mobile responsive pattern and you'll be fine... Cos remember some users may be on telegram desktop so best to optimise for both (reply to 43027)

&rey: What services did you use? Have you kept 24 secret words of the wallet safe? (reply to 43030)

&rey: You do know that inscriptions have zero onchain guarantees (they may be even forgotten after a week), right?

&rey: Maybe something went wrong with the UI. If I understand correctly, inscriptions are not backed by smart contracts so you will be unable to recover those 42 TON. Though haven't they been sent from your wallet to it itself back? (reply to 43039)

Bear: hi, how to decode the jettonContent in cell?

andy: 👋

andy: is @testgiver_ton_bot down?

Howard: yeh, a bit lagging. (reply to 43045)

andy: am I supposed to wait a bit, or the supposed course of action would be to just deposit some mainnet TONs to test? (reply to 43046)

Snowkid DM BAD NO: Can someone explain logical time to me? Lets use this example below which are linked to transactions in a wallet.  44100633000015 44100633000001 44100599000015 44100599000001 44100555000003 44100545000007

&rey: @tawfik_mo please don't post long messages. You can use gist.github.com or Pastebin.

Howard: using TonViewer.com or TonApi I think! (reply to 43043)

Tawfik: https://gist.github.com/FiKa404/0732f283a8e9d768f74b5a4dbff79df8  Can someone tell me how can i get paid and got amount of token and determine if it sold or bought from this response🙃

&rey: In an account-chain, lt is guaranteed to increase. When shardchain imports messages, that is done in order of lt increasing as well. That creates guarantee that if there are two messages A—>B, their order is preserved. (reply to 43052)

Snowkid DM BAD NO: is that number format like blocks plus minutes?

Snowkid DM BAD NO: for instance 44100633000015   block 44100633  item inside the block 000015

&rey: Lt has no meaning beside inducing order. Even if block number can be found there, format is eligible to change without notice. (reply to 43057)

Howard: function timestampToDateString(timestamp: number) {     let date = new Date(timestamp * 1000);     let dateString = date.toLocaleTimeString();     return dateString; } (reply to 43052)

Snowkid DM BAD NO: so do we as devs generally care about block height or are we simply concerned about logical time?

Snowkid DM BAD NO: logical time just seems like a nonce to me

&rey: for flow_item in response['value_flow']:   if not flow_item['account']['is_wallet']: continue   if 'jettons' not in flow_item: continue   if len(flow_item['jettons']) > 1:     print('User worked with more than 1 jetton')     continue   ton_neg = flow_item['ton'] < 0   jetton_neg = flow_item['jettons'][0]['quantity'] < 0   if ton_neg and not jetton_neg:     print('Bought jettons', flow_item['jettons'][0]['symbol'])   elif not ton_neg and jetton_neg:     print('Sold jettons', flow_item['jettons'][0]['symbol']) (reply to 43055)

&rey: Yes, it's generally that. (reply to 43062)

&rey: Devs usually care about neither. Lt is useful for finding transactions, but the same can be done with its hash only.

&rey: If you want to enumerate all transactions on one account, you would use lt. If you want to listen to transactions at large, that requires block height (or, more precisely, last masterchain block + parent references).

Snowkid DM BAD NO: I’m still seeking to understand how blocks are printed. For instance my friend thinks it is similar to solana where the next block is mined before the previous block is finalized

Snowkid DM BAD NO: but also this asynchronous architure throws me off

&rey: Blocks are definitely final before next one is started. Otherwise, how would validator know what message must be processed first? (reply to 43067)

Snowkid DM BAD NO: and im trying to grasp this.   My guess, which is far from educated, is somehow a string of transactions (that would be a single contract call on ETH) is somehow encapsulated so that they execute in order and if one fails they all fail.   Add sharding, im kind of lost but my guess there would be that the string of async transactions would be embedded into a shard to be added

&rey: Have you seen this yet? https://docs.ton.org/learn/overviews/ton-blockchain (reply to 43070)

Snowkid DM BAD NO: in solana they vote on which transactions get mined into block a. each transaction has dependencies and that must be respected before block b gets mined. anything breaks on block b and block a cant be finalized (reply to 43069)

Tawfik: thank you :) (reply to 43063)

Mohammad: I need a programmer for a project, who can create a mini-application on the Telegram blockchain, after the work is completed, the amount will be deposited, the budget is $200

Snowkid DM BAD NO: yes but comprehension goes beyond documents (reply to 43071)

Snowkid DM BAD NO: this one seemed to help a bit  https://ton.org/comparison_of_blockchains.pdf

Mohammad: UIUX design is ready (reply to 43074)

&rey: In TON, each transaction is atomic update of one contract state + incoming messages queue (one message that initiated the transaction is removed) + outgoing messages queue (if contract sends anything). (reply to 43075)

&rey: Blocks are quite limited in size, meaning they can be collated, distributed and validated fast.

Snowkid DM BAD NO: I’ve only seen tonscan - where would you see transactions by block? (reply to 43079)

Snowkid DM BAD NO: besides polling a validator etc

Snowkid DM BAD NO: 44100633000015 44100633000001 44100599000015 44100599000001 44100555000003  given the LT’s above, this appears to be three separate groups of transactions. but maybe they are asynchronous calls from each other.   how would you even know they are linked or dependent on each other?

Snowkid DM BAD NO: thanks for helping me out by the way

Snowkid DM BAD NO: I’m thinking in terms of  tx1 checks a balance and sends a fee tx2 somehow receives the fee and returns a status tx3 sends jettons to wallet that initiated tx 1  But again I’m just guessing at how these asynchronous contracts work

&rey: https://tonscan.org/block/0:8000000000000000:41634281 (reply to 43080)

Snowkid DM BAD NO: thanks (reply to 43086)

&rey: One transaction specifies that its in_msg is a message produced by another one (listed in out_msgs). (reply to 43082)

Snowkid DM BAD NO: so thats basically a dependency

Snowkid DM BAD NO: does that cause the requirement that all messages must be resolved in the same block?

&rey: All unprocessed messages go into queue. (reply to 43090)

Snowkid DM BAD NO: what if I broadcasted an infinite chain of transactions that had inputs and outputs tied to each other (reply to 43091)

&rey: You'd spend much TON making validators happy for that. (reply to 43096)

Snowkid DM BAD NO: or at least to the point where the block size max would be exceeded

Snowkid DM BAD NO: they would get mined with open unresolved messages?

&rey: Blocks will be created with some messages in queue, yes. You may find examples a few weeks ago, when inscriptions were first introduced.

Snowkid DM BAD NO: Ok so this infers that asynchronous transactions which fail cant be rolled back

Snowkid DM BAD NO: maybe im wrong with my impression of what an async tx is

&rey: There is some message, addressed to a smart contract. Once all previous messages in queue have been processed, that message initiates a transaction. Transaction launches contract and determines its response to incoming message: what it sends out and how it changes its persistent storage. Outgoing actions are validated, balance is updated, and outgoing messages are added into queue to be processed later. (reply to 43102)

Snowkid DM BAD NO: that helps. but what if it reverts

Snowkid DM BAD NO: does it have to send a message back to the first contract telling it that it was reverted?

Snowkid DM BAD NO: @pcrafter thanks for the lesson. I will chew on this stuff and come back when I’m ready for more. Most appreciated

&rey: Yes, that's called bouncing. Sender may set that it's not interested in bounces, though. Offchain, that's represented by having destination address converted to unbounceable format (UQ...) (reply to 43105)

Snowkid DM BAD NO: Bonus question  So I guess there has to be a gas transaction that is passed around to all the message receivers in the chain. Appears to be passed via the forward fee field in the message. How do you calculate the gas required for the enitre tx when it spans multiple messages?

Adapt: Hi there, full node (MyTonCtrl) started to display this error when asked for status:  Failed to retrieve unit state: No buffer space available Failed to retrieve unit state: No buffer space available Error: unsupported type for timedelta seconds component: NoneType  Cannot find any info about it. Any ideas?

&rey: Transaction in TON, 🎉 :tada:, by definition spans one message — one that initiated it. How gas is calculated? Sender passes some TON, they're spent for computation and usually whatever remains is forwarded to the next message (contract may instead send a fixed amount, or its entire balance, or something like that; that's based on SendMode). (reply to 43111)

Snowkid DM BAD NO: ok yeah i saw some refund transactions so i guess thats the roundabout way to deal with it too

MBA: hi everyone how can i lower case a string in tact?

David: hi

David: I think someone stole my toncoins

David: i use github library

David: UQB1QBhyiY76wtIDTaV3pFtl8jE_aCrlGeDDTRbz2LaNjTvH

David: 🥲🥲🥲🥲🥲🥲

David: plz help

David: https://github.com/toncenter/tonweb

David: How is it possible

David: the same library of official sites

Tawfik: What is the difference between these two TX_HASHs for the same transaction

Denis: second is not hash of transaction. it's hash of external messages in first transaction.

Denis: tonviewer (and tonapi.io) just allow to search transaction by messages hash for better user expirience

Tawfik: i tried to use tonapi.io it give me the second one but sometimes transactions missed and didn't get notification with it (reply to 43128)

Tawfik: Why does GeckoTerminal site can capture transactions doesn't sent in TonApi SSE?  I mean is there another source to aggregate all transactions in one WebSocket ?

— 2024-01-31 —

Mikey: Same inquiry here (reply to 42876)

Mikey: Are there any library that is similar to signMessage in eth

Mikey: Hope to hear what you guys are building

&rey: because authors of dns.ton.org have forgotten to implement "put domain name back on auction". There's no cooling-off, indeed. (reply to 43135)

🅰🅻🅰🅽: I want to link wallet to a user in our app.  I solved it by ton proof and telegram init data hash verification. I implemented a miniapp backend with python which can extract telegram init data from custom header that send from my react frontend.  Then, after checking the header is valid, I get telegram user id from the init data string. Furthermore, I use pytonconnect to generate a ton proof payload, which will be signed later by wallet.   Last but not least, I return the redirect url which is generated from pytonconnect. Sending it directly to the frontend and ask user for clicking that link.   After clicking the link, wallet app will open with ton proof signing prompt. If user clicks confirm then the backend will receive the singed message. Then I can check the validity of this payload and update the relation of user and received wallet addresses. (reply to 43138)

🅰🅻🅰🅽: We’re building first pure decentralized oracle on TON, if you’re interested in the mechanism, please check this channel 🥰  https://t.me/TictonOfficial (reply to 43140)

Tawfik: What is the difference between these two TX_HASHs for the same transaction

Denis: i answered him few messages above https://t.me/tondev_eng/43129 (reply to 43148)

Tawfik: so but the information about trade is the same in both (reply to 43128)

Tawfik: like amount and things like that

&rey: Why would it be different? (reply to 43150)

&rey: I highly doubt that it's the first. Also, is it intentional that docs are buried in the messages? (reply to 43145)

alkhanov: hi!

alkhanov: pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 651 code. Message: block (0,8000000000000000,41651106) is not in db (possibly out of sync: shard_client_seqno=35804246 ls_seqno=35804296)

alkhanov: help me please

&rey: Liteserver you use has heard about the latest block but wasn't able to download it yet. (reply to 43155)

botmother: Hello, looking for someone to help with a small paid project with a budget of 100USDT to use tonjs library in my express api.  I need 4 things - transfer jettons - transfer nft - already working - transfer ton - already working - get transaction status after doing any of the above 3 actions.  Please write me here or dm me, thank you!

Dane: Hello! Does TON have an SDK for Unity?

Inal: Hey!  There is no ready-to-use SDK for Unity now. There is one for Phaser and another for Cocos2d coming.   What would you like to have in the Unity SDK? (reply to 43160)

Inal: I mean maybe we can help you to implement it without an SDK

🅰🅻🅰🅽: We proudly refer to ourselves as the first pure decentralized oracle because our protocol is capable of obtaining the latest asset values with minimal error. The term 'pure' in this context means that there's no need for running an additional decentralized network for quoting or pricing, nor is there a requirement for liquidity pools to obtain a lagged price weighted average.  Regarding our documentation, we are currently in the process of creating more visually appealing document images to facilitate intuitive understanding. The style is likely to be similar to our brief explanatory videos. We plan to release this alongside our mini app and appreciate your patience in the meantime.  At present, we are learning how to effectively manage our community and have plans in place. Our hope is to soon gather a group of professional developers like yourself to help us identify potential vulnerabilities in our protocol, allowing us and the TON blockchain to grow together. (reply to 43153)

Tawfik: because I don't receive all transactions idk why (reply to 43152)

Maxey: 👋 everyone, this is our 2-minute quick understanding video about the quotation mechanism. Those interested can take a look. (reply to 43163)

IR: Hi everyone!  Our energetic and creative team is looking for a developer for a unique and exciting project: a football game on the TON blockchain with NFT elements, dedicated to Euro 2024! 🏆⚽️  What we offer:  - Participation in the development of an innovative fantasy game in the world of football. - Working with a team of experts in fantasy sports and football. - The opportunity to bring your ideas to a project that has already sparked interest among our user base.  What do we need?  - Your talent and passion for football. - The desire to become a part of our amazing team.  We are currently in the stage of seeking funding, but we have a strong belief in the project's success and the support of our community.  If this interests you and you're ready to contribute to creating something truly special, please send me a direct message.  Let's create something incredible together! ❤️

MBA: hi guys, how can i convert a string msg to slice in tact?

cell: Anyone saw that before?

&rey: s.asSlice(), or, if you're sending it and want to add opcode 0, s.asComment(). (reply to 43169)

MBA: thanks (reply to 43173)

Hunter: Hello, I am an experienced front-end developer, just looking for a project now.

Hunter: feel free to reach out if you need a front-end developer.

Seal: Hi is there a way to have tax on a token on ton?

Snowkid DM BAD NO: Hopefully NOT (reply to 43177)

Seal: It should be

User: rewrite smart contract (reply to 43177)

Seal: I know how to write smart contract

Seal: I want to know if someone was able to do it

Adapt: Hi there. What's this TON network slowdown today? Any official info maybe? Reading data from blockchain is way slower than usual like fetching jetton balance of wallets. This affects public nodes, my own full node as well as ORBS service. Why does it happen?

Andrey: Mining. Again. (reply to 43184)

Andrey: Mining status: https://t.me/dtonforum/5585/5592 (reply to 43184)

Pein ❄️: hi, @hitasp

Alex: guys, could you help me plz find a smart contract NFT collection, i would like to mint big collection like 3k NFT's , and i didn't find any good manual how to do this

Seal: Is there need in miners? (reply to 43185)

Pein ❄️: @hitasp plz dm me

Meeseeks: > 0? 🔍 (reply to 43185)

Adapt: Could you tell us more please? What is that, why and how long does it take to complete? The whole network is extremely slow compared to say yesterday. (reply to 43185)

User<6639351628>: okay. but I am also confident in frontend too. Please reach out me if you need a front-end developer. thank you. (reply to 42972)

— 2024-02-01 —

HoZ_LaSagesse 🍋 🐾SEED 🌱 No DM u First !: Hi guys, with which tool can we make this kind of form and also the buttons of this type surrounded in glass in a telegram group?

Bear: hi how to decode the Jetton Content?

Bear: it('Print out Jetton Content', async () => {         let contentBoc = (await jettonMinter.getGetJettonData()).content;         console.log('Content :' + contentBoc.toBoc().toString());     });

User<6955603556>: Hey I used this tutorials and everything works fine how can i add jetton payment in my bot ? for example i want to use usdt as payment currency ! how can i create payment link for users ?

Howard: user TonAPI or TonCenter (reply to 43197)

Kenny$$Shillz: https://docs.ton.org/develop/dapps/asset-processing/jettons I think U can get info here (reply to 43198)

MS: Hello, How can i download files from storage-daemon with bag-id

boot adbot: is it possible to disable the auto generating button in tonconnectui?

N ! M A: Does anyone know where I can talk to toncenter people?

Tommy: Hey, is there any multisender on Ton?

Daniil: @ton_mass_payments_bot (reply to 43204)

Tommy: For jettons? (reply to 43205)

Daniil: No (reply to 43206)

Tommy: Ok, thanks (reply to 43208)

Tommy: If someone finds one, tag me

Daniil: What? (reply to 43211)

Shahboz: 🤦 🙂 (reply to 43212)

Howard: Why will this pop up when I migrate the libraries?  Property 'toHaveTransaction' does not exist on type 'JestMatchers<BlockchainTransaction[]>'.ts(2339)

TON Answers Bot (not AI): How to implement a VRF like ChainLink? from Mahdi Bagheri  Is there any implementation of VRF like what Chainlink brought to work in The Open Network? If there is no such contract working in mainnet can anybody help me implment my own VRF on-chain?  🔗 Answer on TON Overflow

&rey: For record, I have already created elliptic curve VRF for TON: https://github.com/ProgramCrafter/ecvrf-coordinator-contract.  Its coordinator contract in testnet is kQAkRQPZL7siQjoc26FFXRGgb/r/ZzmdP4P+anwZfcwvkWkh, accepting messages from users according to the following TL-B:  op::subscribe_random#AB4C4859 consumer:MsgAddressInt = InMsgBody; op::provide_random#069CECA8 rnd:u256 = OutMsgBody; (reply to 43216)

Howard: this is cool. (reply to 43219)

Ton Inu advertising: what happened yesterday? a lot of problems with chain data since yesterday

&rey: Yesterday, new jetton was introduced, which is distributed by mining. So people are racing to get more of it. (reply to 43222)

MS: Hello, How can i download files from storage-daemon with bag-id? Hello, How can i download files from storage-daemon with bag-id? Hello, How can i download files from storage-daemon with bag-id? Hello, How can i download files from storage-daemon with bag-id?

Кроль Із Конохи: Hello!  I try to call .get_state() but i get an error:  ton.tonlibjson.TonlibError: LITE_SERVER_UNKNOWN: timeout(during last block synchronization)  I try to connect to all ls_index from here:  https://ton.org/global.config.json

&rey: Because those nodes are down. (reply to 43225)

&rey: https://docs.ton.org/participate/ton-storage/storage-daemon#adding-a-bag-of-files (reply to 43224)

Кроль Із Конохи: is any nodes I can use or just wait? (reply to 43226)

MS: i am getting this error (reply to 43227)

&rey: Then, the file might be already downloaded? (reply to 43230)

MS: i couldnt find in my folders (reply to 43231)

&rey: What does get 0CE2DB175FE69B860025E42FC2A02FCF788A2E228A2A3F4089F1A826904FDE9D return? (reply to 43232)

MS: > get 0CE2DB175FE69B860D25E42FC2A02FCF7B8A2E228A2A3F40B9F1A826904FDE9D --json {    "@type" : "storage.daemon.torrentFull",    "torrent" : {       "@type" : "storage.daemon.torrent",       "hash" : "DOLbF1/mm4YNJeQvwqAvz3uKLiKKKj9AufGoJpBP3p0=",       "flags" : 3,       "total_size" : "69",       "description" : "Description\nSecond line of \"description\"\nBackslash: \\",       "files_count" : "1",       "included_size" : "69",       "dir_name" : "",       "downloaded_size" : "69",       "added_at" : 1706542056,       "root_dir" : "/home/walue/Desktop/TON/STORAGE/Deneme2/",       "active_download" : true,       "active_upload" : true,       "completed" : true,       "download_speed" : 0.000000,       "upload_speed" : 0.000000,       "fatal_error" : ""    },    "files" : [       {          "@type" : "storage.daemon.fileInfo",          "name" : "testlik.txt",          "size" : "10",          "priority" : 1,          "downloaded_size" : "10"       }    ] }

MS: get 0CE2DB175FE69B860D25E42FC2A02FCF7B8A2E228A2A3F40B9F1A826904FDE9D BagID = 0CE2DB175FE69B860D25E42FC2A02FCF7B8A2E228A2A3F40B9F1A826904FDE9D Index = 0 Added: Mon Jan 29 18:27:36 2024 ----------------------------------- Description Second line of "description" Backslash: \ ----------------------------------- Downloaded: 69B/69B (completed) Dir name:  Total size: 69B Upload speed: 0B/s Root dir: /home/walue/Desktop/TON/STORAGE/Deneme2/ 1 files: ######  Prior   Ready/Size       Name      0: (001)     10B/10B     +  testlik.txt

Yuriy Eduardovich: Hi! Is the only windows TON wallet dead? I mean this one https://ton.org/Wallet.exe  It is stuck in sync/update status for days. Plus some lightserver error. Tried many things, including VPN, starting as admin, restoring my old wallet. no luck. Last version 0.9.9.0 was released almost a year ago. Back than it was ok. The same is true for android wallet.

&rey: Something went wrong with testnet node so I migrated ECVRF to mainnet. Enjoy! It should be able to supply new random numbers each 10-20s. (reply to 43219)

Kenny$$Shillz: Hey sir (reply to 43227)

Kenny$$Shillz: I'm so you know of any tact documentation for jettons contracts?

cell: Why chain so slow?

cell: 😔

— 2024-02-02 —

&rey: And how much time is "slow"? (reply to 43242)

Meta: why ?

User<5742274103>: Hi guys

User<5742274103>: So we are preparing to do an ICO for a project we are working on and want to do it with the Ton network. What type of Jetton token is it? My understanding is that we have to use something like: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-ICO.fc. The reason I'm asking this is because I'm trying to figure out how to build an ICO page and send tokens to users tonkeeper wallets, etc. Any reasons or ideas'as to how we could do this would be much appreciated includng into adding it into our tech etc.  I asusme Jetton token are not ER20 correct?

Kenny$$Shillz: Jetton is the term for tokens using the fungible token standard on the ton Blockchain. The equivalent of Erc20 tokens on EVM chains. They have same conceptual principle but very different architecture (reply to 43253)

suisun: Hello community, nice to meet you guys. I have a problem with mytonctrl. I just installed mytonctrl on my azure instance. But it gives me errors. Please help me.

suisun: After updated to mytonctrl2, I got this error.

Yuri: Hello guys, I want to separate the minter from the owner. Is there any problem if I add the minterAddress after the ownerAddress here:

Dmitry | backend4you.ton: Sure. You’ll violate the standard and you may see “unexpected” results when explorers will index your Jetton. (reply to 43257)

Bear: Why do we need these 2 lines in JettonWallet?     throw_unless(708, slice_bits(in_msg_body) >= 1);   slice either_forward_payload = in_msg_body;

Yuri: Gotcha, I thought it wasn't a problem since the minterAddress would be added to the end the tuple would be read until the ownerAddress. (reply to 43258)

Vivi: Does anyone know wallet V5 the Jetton Gasless Tx solution?

Dmitry | backend4you.ton: You can’t be sure how explorers (and exchanges, as we talk about Jetton) parse return value. And as soon as they will not know how to USE additional value - it will always be useless for all except your own code/tool. So for your own use it’s safer to make separate get method - for safety ) (reply to 43260)

Behrang: To check the format of forward payload. The first bit must be 0 or 1. This is defined in the TEP and is checked here in the code. (reply to 43259)

&rey: There's no single standard of wallet v5, to start with. (reply to 43261)

Ihor: Hi! I'm trying to get transactions from self-hosted TON node but keep getting "LITE_SERVER_NOTREADY: block is not applied" when getTransactions endpoint used only with address. In case additional parameters there, like logical time, it works. Node looks like in sync but I was wondering is there a way to fix this or something to check? P.S. I saw in docs that it's kind of a "normal" thing but maybe there is another way of getting latest available data without 500 error. Thanks in advance.

Bear: I can't find in docs sorry, what kind of tx will be 0, whatelse will be 1? (reply to 43263)

&rey: 0 if and only if forward payload doesn't contain some more data. (reply to 43267)

&rey: 1 + following data otherwise.

Bear: Usually the 1 right? (reply to 43269)

Howard: yes (reply to 43271)

Bear: what is the best way to get "total holders for a Jetton Token"? (API)

Dmytro: https://ton.org/global-config.json   Hello, something wrong with liteservers ? (Mainnet)  Anyone response by ADNL

Dmitry | backend4you.ton: All are busy to death: tonstat.us (reply to 43274)

Клецка: hi, people! i've bought TON domain name for 7 ton, and now, this 7 ton are on domain name's balance. is there any way, i can get some of them back?

Клецка: *i've got if from an auction (reply to 43277)

Seal: Wich domain was it (reply to 43278)

Клецка: https://tonscan.org/address/EQC8hwVvtnb8I8nzN6sqx3a7DFoY_4jxY6ZWMvKlS4Q_bIPE#transactions (reply to 43279)

Seal: List it

Клецка: you mean, on auction? (reply to 43281)

Seal: Yeah, you paid for the domain, so you get only money if you sell

Клецка: okay. thank you. another question. how much is domain extension costs? (reply to 43283)

Seal: No idea

Ahmad: Hello, I've been trying to write a js that generates hypothetical wallet addresses from a given seedphrase but havent been successful. been through all the links and tutorials but cant figure out the right library/methods to use, can anyone help please?  Im wondering if I can make it completely offline, without using a "client" to interact with TON api or create an actual wallet, just for verification, for like a seedphrase guessing game  PS: I found this but when testing against the seedphrase of a wallet I generated, it wouldnt end up with the same address in any form

— 2024-02-03 —

Kenny$$Shillz: hi guys please can anyone give some directions on how to solve this problem:  Im writting a jetton smart contract with Tact. The contract tests as expected but when i try to make it ownable and add an owner or admin address to its fields,  it reverts all mint transactions... I have looked around but have not seen any reference to this issue 🙏🏽

Howard: hi gems, besides with fetch all the JettonWallet Addresses to aggregate the data, what is the best way to fetch "the current total holders of one Jetton Address"?  PS: dton.io has the way to do this based on GraphQL for sure.   I know I can use toncenterV3 to get all the JettonWallet List, but that sounds intensive works when the holders amount is like 10k+?, or 20k?

Howard: dton.io URL to get all holders data for a Jetton Token - LINK (reply to 43289)

Pam: dton is good (reply to 43290)

Kenny$$Shillz: Toncenter also has endpoints to fetch data from specific jettons (reply to 43289)

Howard: no, I think no aggregate data for current holders amount.   It is the details list for all the Jetton wallet Address (reply to 43292)

David: Hello, I can't install mytonctrl. Help me please with it

@strivefor10years799999: Do you have any code examples of integrating TON block chain on Game code?

&rey: What functionality exactly do you desire from blockchain? What's the game programming language? (reply to 43296)

@strivefor10years799999: I have a game but I don't know how to connect TON wallet and integrate TON block chain functions into the game (reply to 43297)

&rey: Would an indicator showing count of TON blocks be sufficient? If not, What functionality exactly do you desire from blockchain? What's the game programming language? (reply to 43298)

Nxrix: Hello! I have a question about the structure of ton wallet addresses  If they are made with an algorithm can someone find out someone else seed phrase by reverse work on their address or we are fully safe and the chance is so low? You know I'm a little scared 😄

@strivefor10years799999: I use python language (reply to 43299)

@strivefor10years799999: I want some documents about some code that integrates block chain with TON chain (reply to 43299)

&rey: You'd need to reverse one elliptic curve multiplication (since public key is known anyway), and that is believed to be impossible on current hardware + for some decades into future. (reply to 43300)

&rey: Please note that on Ethereum, for instance, anyone could still find out your public key so it offers no additional security.

&rey: Also, until your wallet is initialized its address is hash of (public key + some data) so there's one additional level resisting private key search.

&rey: https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py https://github.com/yungwine/pytoniq/blob/b8bf21cb6dc85c5081118ab568c1a893c81c9102/pytoniq/contract/wallets/wallet.py#L138 (reply to 43301)

&rey: What do you mean by "documents about some code"? (reply to 43302)

&rey: Also, if you couldn't understand question well, there exist TON Dev Chats in different languages.

Kenny$$Shillz: I don't think there is any documentation specifically or game development. But U can say what operations U want to integrate into your game and may be U can be directed to a solution. (reply to 43302)

Seal: Is there somewhere a place where we can see how much gram is minted?

Seal: Supply and all the info etc

@strivefor10years799999: We want to integrate tonkkeeper wallet connection into our game, do you have the documentation? (reply to 43309)

Kenny$$Shillz: What game engine is the game built on (reply to 43313)

User<5110219069>: How is connecte

Ton Price: how i can create ton wallet ?

Ton Price: Is there an official library?

&rey: Python (not official): pytoniq TypeScript: @ton/ton with many more in different langs. (reply to 43318)

&rey: I believe you're asking about https://docs.ton.org/develop/dapps/ton-connect/? (reply to 43316)

Ton Price: What is the benefit of this? @tonapibot

Ton Price: js ? (reply to 43319)

Ruslan: This bot is for subscriptions on toncenter.com. Subscriptions give you higher request per second limits (reply to 43321)

Ton Price: Can I generate new wallets using curl? via : http://toncenter.com/ (reply to 43324)

Ruslan: You should use some library on top of toncenter.com. For example this one: https://github.com/toncenter/tonweb

Denis: it doesn't provide custodial api for storing money. if you need custodial wallet try @xrocket api (you can find documentation in bot menu) (reply to 43325)

— 2024-02-04 —

Meta: let payload: Slice = msg.forward_payload;         let parent_addr: Address = payload.loadAddress();         let ticket_addr: Address = payload.loadAddress();         let buy_count: Int = payload.loadUint(16);  this my tact code,but return exit code=9

Meta: why exit code is 9

Howard: Help you answer in Mandarin group (reply to 43330)

MS: i wanted upload and download one text file. But i couldn't. Please Help me

MS: get CA552E929EC1C49CE13D052D2BFA8950DA9C77D8A1A3BDAC40CCF7A09FCAA5F3 --json {    "@type" : "storage.daemon.torrentFull",    "torrent" : {       "@type" : "storage.daemon.torrent",       "hash" : "ylUukp7BxJzhPQUtK/qJUNqcd9iho72sQMz3oJ/KpfM=",       "flags" : 3,       "total_size" : "75",       "description" : "aciklama",       "files_count" : "1",       "included_size" : "75",       "dir_name" : "",       "downloaded_size" : "75",       "added_at" : 1707031356,       "root_dir" : "/home/walue/Desktop/TON/STORAGE/Deneme3/",       "active_download" : false,       "active_upload" : true,       "completed" : true,       "download_speed" : 0.000000,       "upload_speed" : 0.000000,       "fatal_error" : ""    },    "files" : [       {          "@type" : "storage.daemon.fileInfo",          "name" : "yuklencekk.txt",          "size" : "13",          "priority" : 1,          "downloaded_size" : "13"       }    ] }

MS: get CA552E929EC1C49CE13D052D2BFA8950DA9C77D8A1A3BDAC40CCF7A09FCAA5F3 BagID = CA552E929EC1C49CE13D052D2BFA8950DA9C77D8A1A3BDAC40CCF7A09FCAA5F3 Index = 0 Added: Sun Feb  4 10:22:36 2024 ----------------------------------- aciklama ----------------------------------- Downloaded: 75B/75B (completed) Dir name:  Total size: 75B Upload speed: 0B/s Root dir: /home/walue/Desktop/TON/STORAGE/Deneme3/ 1 files: ######  Prior   Ready/Size       Name      0: (001)     13B/13B     +  yuklencekk.txt >

Dmitry | backend4you.ton: https://jobs.ton.org (reply to 43337)

Konstantin: Hi!  Could anyone please help me a bit with lesson 5  https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/5lesson/fifthlesson.md  I don't understand how the manager_address is set initially, on init?

Another: Searching for experienced blockchain developer to make 4 urgent corrections to the smart-contracts

CripticHood | Drops💧: We only have 24h and 7d what's with the 25/8  🤔 (reply to 43337)

Daniil: https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/5lesson/fifthlesson.md#contract-data-config  because we set it there (reply to 43339)

Bear: https://docs.ton.org/develop/func/stdlib/#now   What is the an hour in FunC?

Bear: 1 * 60 * 60 = 3600 is the hour in FunC?

Daniil: Yes (reply to 43344)

MS: what is my problem?  71C693256B4F6F0BC3D82B6FC22D4F154967CA126C72A221D0E8975562AFF92C

MS: i am using testnet

MS: !!!!!please help!!!!!

&rey: Bag seems unavailable in the network. (reply to 43346)

MS: i setuped two provider with these steps  1)deploy-provider 2)new-contract-message 3)set-provider-config 4)set-provider-params  Then, i ran these commands 1)create -d "aciklama444" yuklencekk.txt 2)new-contract-message 71C693256B4F6F0BC3D82B6FC22D4F154967CA126C72A221D0E8975562AFF92C yuklencekk.txt --query-id 0 --provider 0:11F31098A18CE598A4E059C5A831BABA209225054B4803AA8E11B817DBA226F3  after that, i tried download with in other storage-provider. It was not happen (reply to 43349)

&rey: And can your storage provider be accessed from the Internet, or is it behind NAT? (reply to 43351)

MS: i setuped inside local machine (reply to 43352)

MS: i dont have static-ip

MS: both provider inside same machine

MS: storage-daemon -v 3 -C testnet-global.config.json -I localhost:3333 -p 5555 -D storage-db --storage-provider  storage-daemon -v 3 -C testnet-global.config.json -I localhost:3334 -p 5556 -D storage-db --storage-provider

Konstantin: Аааh, thanks! (reply to 43342)

&rey: That will very likely not work, as outer IP is still associated with bag ID in the network. (reply to 43353)

MS: There's nothing wrong with what I've done, right? Except that one. Tomorrow I will try to open an external service with a static IP port. (reply to 43358)

Leomur: Hello guys, who can help?

Leomur: @pcrafter What do you think about this?

&rey: Seems like the server (liteserver? API?) you use was down. (reply to 43360)

bahram: Hi

bahram: Hello, no matter what I do, I can't join Notecoin, what should I do? Please help

bahram: No matter what I do, it does not enter the game

Nxrix: Anyone knows any free API for making an app similar to TonViewer? Is it possible to get NFT data of a wallet using ton center API? Also do you guys know any API for jetton prices that is always up to date?

Denis: Tonviewer uses tonapi.io. it has free plans (reply to 43366)

Nxrix: Just how should I use it to get the NFT data like name and image? (reply to 43367)

Nxrix: Thanks alot) (reply to 43369)

Nxrix: That's almost everything I needed

Petr: hi, guys!  can you send some links, where I can find information, how to use TON with official telegram bot (by API)? is it possible? I can't find info in official API, unfortunatelly

&rey: https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-js. Basically, since you have a bot, you have a server, and from it you'll interact with TON. That's why TON interaction isn't in Telegram documentation. (reply to 43372)

Petr: great thanks!  I'm off to study 😊🤗 (reply to 43373)

TON Answers Bot (not AI): Отправка Тон-монет на кошельки from Alexandr Karabedyan  Как, используя API или нечто иное, сделать перевод Тон-монет на сторонний кошелек? Веду разработку бота на телеграм, который и принимает платежи и осуществляет переводы с монего кошелька. Как принимать платежи в документации есть примеры, а как делать переводы я не нахожу.  🔗 Answer on TON Overflow

Sergey: https://docs.ton.org/develop/dapps/ton-connect/transactions (reply to 43376)

Haq: Hi guys 👋🏼 happy to join to the group 😌 do you have any advice on tips about creating NFT on TON?

— 2024-02-05 —

ston: Can I deploy cNFT if I use this? 🤔 https://github.com/ton-community/compressed-nft-api/blob/main/README.md

Shashank: Just wait for today. I will write an article on it (reply to 43188)

Shashank: Try this - https://ide.nujan.io/ (reply to 43239)

Carlos: Hello Guys, I am using the @ton/ton library to generate wallets and send transactions from NodeJS. But when I send it it doesn't work, for some reason I get this error LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n and I can't find any information about it. Could someone help me or give me information on how to solve it?

User<5742274103>: can anyone share tips around doing a ico for a jetton lke types features hat should prsesent within the token/smart contract etc etc

Beybut: /report (reply to 43385)

saul: Hi, Is there a way to stake Toncoin to the nominator using a Ledger wallet?

saul: After connecting the ledger to mytonwallet, I tried staking the nominator, but it didn't work.

MS: storage-daemon -v 3 -C testnet-global.config.json -I 95.3.10.178:3333 -p 5555 -D storage-db --storage-provider storage-daemon -v 3 -C testnet-global.config.json -I 95.3.10.178:3334 -p 5556 -D storage-db --storage-provider  i created new file then ran create command from first storage provider. After that i queried  get command from other storage provider. it wasn't happen   Get command result from other storage provider  > get BACCC03D835C7017002D624168D48098DE65E9A369E3DA3136E2E5ADA530FEC8 BagID = BACCC03D835C7017002D624168D48098DE65E9A369E3DA3136E2E5ADA530FEC8 Index = 0 Added: Mon Feb  5 11:44:55 2024 Torrent info is not available Download speed: 0B/s Upload speed: 0B/s Root dir: /home/walue/Desktop/TON/STORAGE/Deneme4/storage-db/torrent/torrent-files/BACCC03D835C7017002D624168D48098DE65E9A369E3DA3136E2E5ADA530FEC8 Torrent header is not available >

MS: i forgot mentioned you sorry (reply to 43358)

Carlos: Some one know about this error?  'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction 6399DFE1A8E78C68BE043A9002ED0C6366DEED5E31B2C028BCB27F0B0387E6BD:\n'  Im triying to send transfers

Dmitry | backend4you.ton: have you tried to search error text in this chat ? (reply to 43391)

Carlos: Yes but none of them work. I can pay for the solution to send transactions (reply to 43392)

Carlos: If anyone knows how to send transactions, they could pay for that piece of code if it works, I have used the codes in the doc but it doesn't work.

&rey: Is that the full error code, or is there exit code along with the trace of instructions that executed successfully below it? (reply to 43391)

Carlos: This is the full error code 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction 6399DFE1A8E78C68BE043A9002ED0C6366DEED5E31B2C028BCB27F0B0387E6BD:\n' +         'exitcode=-14, steps=20, gas_used=0\n' +         'VM Log (truncated):\n' +         '...LDU 32\n' +         'execute LDU 32\n' +         'execute XCHG s2\n' +         'execute NOW\n' +         'execute LEQ\n' +         'execute THROWIF 36\n' +         'execute PUSH c4\n' +         'execute CTOS\n' +         'execute LDU 32\n' +         'execute LDU 32\n' +         'execute LDU 256\n' +         'handling exception code 9: cell underflow\n' +         'unhandled out-of-gas exception: gas consumed=794, limit=0\n' (reply to 43395)

&rey: Have you deployed wallet correctly? It seems like its storage is broken.

&rey: Could you provide its address, for instance?

Carlos: This is the public address EQBrzVsV0_GNwvksxg3ppis-b6x8qxFOKr2ikHP6W3Yplvb0 (reply to 43398)

Carlos: I have the private too but this not works, here is my full code

Carlos: const publicKeyBuffer = Buffer.from(senderAddress, 'hex');          const secretKeyBuffer = Buffer.from(senderPrivateKey, 'hex')            // Crear instancia de WalletContractV4          const wallet = WalletContractV4.create({              workchain: 0, // Workchain 0 para direcciones TON              publicKey: publicKeyBuffer, // Utilizamos la dirección del remitente como clave pública          });            if(!await client.isContractDeployed(senderAddress)) {            return console.log('Wallet not deployed')          }          console.log('Wallet deployed')                    const contract = client.open(wallet);            const seqno = await contract.getSeqno();            await contract.sendTransfer({            secretKey: secretKeyBuffer,            seqno: seqno,            messages: [              internal({                to: recipientAddress,                value: amount.toString(), // 0.05 TON                bounce: false,              })            ]          }); (reply to 43397)

&rey: It is a most strange error. Maybe you're even contacting a broken liteserver. (reply to 43396)

Carlos: Im using https://toncenter.com/api/v2/jsonRPC with TonClient   const client = new TonClient({      endpoint: 'https://toncenter.com/api/v2/jsonRPC',      apiKey: 'SECRET_KEY',  }); (reply to 43402)

Carlos: Maybe you know one better?

MS: I set the ip port. But it still didn't happen. Please can you help? For some reason I can't upload and download torrent. @pcrafter (reply to 43389)

ston: Hello,  I just deployed cNFT collection using this. https://github.com/ton-community/compressed-nft-api  Then how can I deploy cNFT items? 🥲

User<6404294994>: I am a full-stack developer, and I provide digital marketing services...  Contact me for   1. Web/app Development ✅ 2. Web/app Designing✅ 3. Video editing ✅ 4. SEO✅ 5. Advertising.✅  Thank you

Daniil: Do you work specifically in TON? (reply to 43409)

Nxrix: How can I get a wallet jettons and nfts data list using https://toncenter.com/api/v2

Mohammad: Hello everybody!  Can you help me with understanding how can I deploy my contracts on masterchain?

User<6404294994>: Nah sorry (reply to 43410)

User<6295881685>: Hello, maybe anyone could help me i have this function wrote in tact message SetFeePercent {     fee_percent: Int as uint8; } receive(msg: SetFeePercent)  and I want to send it with tonconnect/ui but I'm not sure how, I came up to this, but this doesn't work const body = beginCell()           .storeUint(0, 32)           .storeBuffer(             Buffer.from(JSON.stringify({ new_max_players: maxPlayers })),           );         const result = await tonConnectUI.sendTransaction({           network: CHAIN.TESTNET,           messages: [             {               address: '',               amount: '0.00001',               payload: body.boc.toString('base64'),             },           ],           validUntil: Math.floor(Date.now() / 1000) + 60,         });

&rey: The correct code to form payload is generated when Tact is compiled, in a wrapper file. (reply to 43415)

&rey: It's definitely not "send JSON to the contract".

User<6295881685>: Found it, thx vm (reply to 43416)

Tawfik: I think there is a problem in tonapi.io api ?

Tawfik: All transaction search give me this error

Ceren: Do you think the Tonconsole issues are related to GRAM mining?

Denis: i think yes

Sergey: GRAM mining? (reply to 43424)

Ceren: Gram Mining Pool💎⛏  Join testing of the Gram Mining Pool — pool.gramcoin.org  The pool allows any user to start mining $GRAM on a personal device and is guaranteed to receive $GRAM for solving a common problem.  If you have any questions about setting up mining, you can use the project chat.  #mining (forwarded from TON Events | Ecosystem News & Insights)

Scott: hey all, giving Ton Keeper a trial on testnet - is it possible to change the wallet’s network to testnet so I can manage testnet assets directly?

Dmitry | backend4you.ton: Go to settings, scroll down and tap several times (5-7) on Tonkeeper logo (reply to 43431)

— 2024-02-06 —

Scott: lol tell me this is a joke (reply to 43432)

Scott: omg its not, thats an actual feature and not a bug

Lugard Digital: Hello sir  How safe is Ton community regarding the attack on Tonkeeper for members who have Ton assets on their wallet.  I even sent Ton to my Tonkeeper wallet but not reflecting on my balance but indicated that I was credited  What would Ton community do to help their community? (reply to 43410)

&rey: Interfaces such as wallets may update quite slowly. Could you provide wallet address to check what happened? (reply to 43437)

Lugard Digital: UQBr-NZ3fdp3oqii3cHBbh3Z50E0kSbYdaUhiTBQMA8xeesI (reply to 43438)

&rey: Please note the difference between https://tonviewer.com/EQBr-NZ3fdp3oqii3cHBbh3Z50E0kSbYdaUhiTBQMA8xebbN and https://tonscan.org/address/UQBr-NZ3fdp3oqii3cHBbh3Z50E0kSbYdaUhiTBQMA8xeesI. There was no attack, just indexing is slow (30 min).

wikig: Hello guys ! I got a silly question here :  What i trying to do is:  1.randomly new a account {acc} 2.user A transfer TON into {acc} 3.user A send the privateKey to user B 4.user B withdraws the TON to it's own account . (Using tonconnect , and sign transaction by Telegram-wallet-bot)  But i meet a troble in step {2} . When i try to send some TON into the address i just created(before deploy into chain) , It failed .  The transaction had successfuly send out , but got auto refund for some reason i don't know .  Then i try directly send TON into the new address by Telegram-wallet-bot , still refund .   Here are the results : https://tonviewer.com/EQCESAKwFXU4j-8q5Z7oRsBh-wuT6orbgF-Or2DtGhta4Tro

wikig: I don't know why it happened , so i use wallet.ton.org to send some TON into the new address , and it work .   During the first 3 failed transaction ,the {Status} of the new address always {nonexsit} . Which means that it should be able to recive TON from other address .   So now i guess , it might be the issues of the {wallet Interfaces} of sending wallet . All the 3 transactions that auto refund are sending from a wallet with {wallet_v4r2} . But the sucess one are using  ${wallet_v3r2} .   I don't really know what the core issue is , and how to slove the issue like it .(How can i transfer TON into a randomly new wallet by Telegram-wallet-bot )  Any ideas ? Thanks ! (reply to 43441)

Lugard Digital: The transaction is close to 2hrs now but not reflecting  Also, Tonkeeper announced on their Telegram regarding the attack they had last night (reply to 43440)

&rey: Search "bounceable address". In short, you need to convert it to unbounceable, UQ... (reply to 43441)

&rey: Nope, just app you use to send funds. (reply to 43442)

Vladimir: Good afternoon. Has anyone implemented proof checking in PHP?

wikig: Thanks! Checking on it . (reply to 43444)

wikig: Thanks !  so i guess the Telegram wallet bot aut o turn the bounceable ON ... ? (reply to 43445)

Kenny$$Shillz: ??? (reply to 43382)

User<459203561>: Hi guys, is testnet dead?

MS: I can't upload my file to Ton Storage.   Someone please help me I don't know what to do? (reply to 43389)

Shashank: This is a web-based IDE for TON like remix (reply to 43449)

Kenny$$Shillz: I know but that's not what I'm looking for (reply to 43453)

Shashank: OK,I will find and send you something relevant. (reply to 43454)

Ton Inu advertising: Whats going on TON chain? from few days is very shit

Daniil: APIs are working unstable right now (reply to 43456)

Ton Inu advertising: which is reason? Gram token? (reply to 43457)

Ton Inu advertising: and PoW?

Daniil: DDoS attacks (reply to 43458)

Ton Inu advertising: everyday? lol (reply to 43460)

Daniil: Why everyday? (reply to 43461)

Ton Inu advertising: the problem has existed for several days (reply to 43462)

Daniil: That’s how attacks work (reply to 43463)

Pranav: Hey folks GM GM! I am trying to find out how to build plugins for v4 - got any resources I can look at?

&rey: I, as author of wallet inplug-v1 (contender to wallet v5 position), recommend to read wallet v5 plans which have different plugin scheme. (reply to 43465)

Pranav: There’s a tutorial requirement for v4 plugins Trying to work on that (reply to 43466)

Tim: They wont be supported in wallets (reply to 43467)

Pranav: Hmmm Why not 🤔 Isn’t the latest version of plugins required for wallets v4? (reply to 43468)

Scott: can some explain to me the rationale behind wallet versions changing the users/contracts public key despite having the same mnemonic? doesn’t this seem like a disaster for UX if a user updates their wallet?

Jeff: Is testnet still not working right?

Jeff: I can't send any transactions

Andrey: Hey everyone, we know that a lot of people are having problems with lightservers right now. We are planning to launch a service with subscription to lightservers. If you need a lightserver - please fill out our form: https://forms.gle/rKowof2qYQu7egsE6.

&rey: Public keys are exactly same, addresses are different. (reply to 43470)

&rey: As for the reason: wallet address, as any smart contract address, is hash of contract code and data. Different wallet versions are different contracts, thus have different codes and addresses.

&rey: Wallet v5 is unlikely to support plugins developed for v4. (reply to 43469)

Pranav: Ah! I see I saw a bounty open asking for content on developing plugins for v4  It might be worthwhile to remove that/ update it (reply to 43477)

Radek: Hi, can anyone please explain the fee config? https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam20  The gas fee is normally defined as 1 gas = 1000 nanotons, but the config #20 shows flat_gas_price:1000000 and #21 flat_gas_price:100000

Alex: Greetings, looking for domainers, channel or chat about domains Who knows please post please

Rami: What should go into LastCleanedTime when I'm initializing the High-Load Wallet  type DataHighloadV4 struct {   SubWalletId     uint32   LastCleanedTime uint64   PublicKey       tlb.Bits256   Queries         tlb.HashmapE[tlb.Uint64, tlb.Any] }  0 or current unix time?

Sol: Hello everyone. How much does a smart contract developer or tester earn?

Nxrix: EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c does this wallet also have a 24 word seed phrase?

Andrey: No (reply to 43485)

Nxrix: well is it possible to have a wallet that has a address like this? I mean if we find the phrase (reply to 43486)

Andrey: https://github.com/ton-community/vanity-contract (reply to 43487)

Daniil: It’s practically impossible (reply to 43487)

Nxrix: Because it's 1 from 2048^24? 😂 (reply to 43489)

Daniil: Because it’s 1 in 2^256 (reply to 43490)

Nxrix: Can I know about why 2^256? (reply to 43491)

Daniil: Address is a sha256 hash (reply to 43492)

Nxrix: How should I get a list of a wallet nft and jettons using toncenter api or jsonrpc?

Nxrix: Is it even possible?

&rey: No, you need an indexer for that. (reply to 43495)

&rey: Considering NFT/jetton transfer may not even include any transactions at destination wallet.

Nxrix: Any free api service to do that? (reply to 43496)

&rey: dton.io/graphql, IIRC. (reply to 43498)

&rey: + 2^256 more if you want to find secret key as well, giving total complexity of 2^257. (reply to 43491)

&rey: $500-1000/week would be a fine estimate for auditor (~= tester + responsibility). (reply to 43484)

&rey: I do believe a few of contract developers work on $0-$20/week.

walker: how to custom endpoint in blueprint?

walker: always show Error: all nodes manager's data are stale

Vanëk: how can i provide stability to jetton? for example i want to mint in my shop jetton that will backed with usdt 1by1? mint tokens to trade? to taken 1000usdt i mint 1000myjet?

Sol: You're absolutely right:) (reply to 43502)

Glen: Any devs here with knowledge regarding pool side transaction creation for miner payout?

Kenny$$Shillz: ?¿??? (reply to 43502)

— 2024-02-07 —

Jeff: Is there any official launching date for wallet v5? Or it depends on each wallets?

Pranav: Hey folks Submitted a proposal here:  https://github.com/ton-society/grants-and-bounties/issues/408#issuecomment-1929154560   Looking forward to hearing back

UTKARSH: Anyone facing issues with orbs-netowrk/ton-access  503 error  What rpc do you use?

Anthony: We don't have an official launch date. But I think April / May (reply to 43512)

Jeff: Oh ok thanks Anthony! (reply to 43517)

CripticHood | Drops💧: Yes, I also get that and 504 the service is not stable. (reply to 43515)

Barbell: hi all

Nxrix: Mostly no (reply to 43520)

Barbell: is dev testnet down?

Anastasiia: When @ton/ton package is used to send a transaction it doesn't return transaction hash or any other data for transaction tracking and the recommended way to search the transaction hash is something like this: https://stackoverflow.com/questions/73817581/how-can-i-wait-for-transaction-to-confirm-using-tonweb.   It's quite unusual compare to packages for other blockchain and honestly creates some bad dev exp.   So I am just curious how TON transaction hash is calculated? Are there any data that can't be precalculated or something?

Barbell: https://testnet.tonapi.io/v2/pubkeys/6817ffa1a1a28726714c2e17fe78ff3ba0027aba530d6d9f9fd803958ab5ea1a/wallets

Barbell: returns 502

Barbell: gateway

Barbell: ?

ston: is TON dead?

Daniil: No (reply to 43529)

Anthony: Only TON API https://t.me/tonconsole_com/87 (reply to 43523)

G: Hi guys

Denis: also we resumed testnet yesterday (reply to 43531)

Denis: should work

Anthony: https://testnet.tonapi.io/v2/pubkeys/6817ffa1a1a28726714c2e17fe78ff3ba0027aba530d6d9f9fd803958ab5ea1a/wallets  502  is it ok? (reply to 43535)

Denis: hm. i will check.

Denis: fixed

Barbell: yeah it's working. Thanks guys

Barbell: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"\n' +       ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +       '<html>\n' +       '  <head>\n' +       '    <title>503 All backends failed or unhealthy</title>\n' +       '  </head>\n' +       '  <body>\n' +       '    <h1>Error 503 All backends failed or unhealthy</h1>\n' +       '    <p>All backends failed or unhealthy</p>\n' +       '    <h3>Error 54113</h3>\n' +       '    <p>Details: cache-syd10141-SYD 1707306185 3918308903</p>\n' +       '    <hr>\n' +       '    <p>Varnish cache server</p>\n' +       '  </body>\n' +       '</html>\n'

Barbell: when I am trying to sign the transaction on testnet

Barbell: still down testnet api

Nxrix: What are the possible letters in wallet addresses?

Barbell: sorry for late update

Barbell: now it's working. I think it just needed some time to come up alive.

Dmitry | backend4you.ton: in user-friendly - base64url, see https://docs.ton.org/learn/overviews/addresses#user-friendly-address (reply to 43543)

Клецка: hi! i'm trying to build simple wallet in nujan.io, but getting this error: Func compilation error: cannot generate code for function `recv_external`:                                                                           main.fc:11:35: error: variable does not have fixed width, cannot manipulate it                                                                    var cs2 = begin_parse(get_data());  17:21:52  Can somebody help me?

Seitaro: Try import stdlib.func/stdlib.fc (reply to 43550)

Клецка: thank you! (reply to 43551)

Vitor: Hey guys. I am starting a new project with TON and I wanted to know if there is a good boilerplate with Next.js

Vitor: with all TON dependencies up to date

andy: Hi! Could you help me please? Wallet address created via wallet.tonkeeper.com does not match. I'm using tonweb for javascript. I generate the public/private keypair using the mnemonic phrase from wallet.tonkeeper.com by using mnemonicToPrivateKey function. Then, I use the TonWeb.Wallets.all.v4R2 constructor to create the wallet object. In the end, I use await wallet.getAddress().toString(true), but the results do not match. I also tried passing a password to mnemonicToPrivateKey as the second parameter, but this does not work anyway. I triple checked wallet's version: v4R2. What am I doing wrong?

andy: @Gaffyse Scammer

andy: I effed up environment variables, sorry. (reply to 43555)

Barbell: Hi guys

Barbell: is there any way to store two dict in smart contract

Barbell: store_dict(dict_a).store_dict(dict_b)?

Dario: yeah  ;;; Stores dictionary D represented by cell [c] or null into builder [b]. ;;; In other words, stores a 1-bit and a reference to [c] if [c] is not null and 0-bit otherwise. builder store_dict(builder b, cell c) asm(c b) "STDICT"; (reply to 43563)

Barbell: hmm

Barbell: so cell c can be ref to another dictionary?

Barbell: would you mind maybe post simple code?

Barbell: also is there any way to see error on SC? I only get failed in my wallet but I can't see actual error msg. Thank you for your help.

— 2024-02-08 —

walker: I think this is a very important and useful feature, why no one answer this question? (reply to 43524)

Zero: Hey! How do i get the list of all jettons which have been deployed on the blockchain?

Nxrix: How can I get a list of all nfts a wallet has using dton.io?

Andrey: https://docs.dton.io/dton/examples#get-all-nfts-of-wallet  Please subscribe to @dtonforum, we soon notice on new API (reply to 43574)

Nxrix: Thanks alot!) (reply to 43578)

Shashank: Hey everyone,  We're collecting feedback on developer experiences TON. We've gathered 30 entries already, but we'd love to gather more. Please share any challenges you've faced. Your input is invaluable to us.   Link   Thank you for your help! Team Nujan

Nxrix: how to turn UQDuW9GLQyxAcV6pcBYn0v7Hujg8im_RDQNDjPJCNSo9pUh8 into EQDuW9GLQyxAcV6pcBYn0v7Hujg8im_RDQNDjPJCNSo9pRW5?

Dmitry | backend4you.ton: https://ton.org/address/ (reply to 43581)

Kenny$$Shillz: the link is access restricted? (reply to 43580)

Shashank: Try it Now. (reply to 43583)

Ally from the Saturn: Hi folks 👋🏻 Looking for a backend dev to perform the development of a smart contract on TON Blockchain asap.  The goal is to create a smart contract for minting 88 additional NFTs in the existent NFT Collection according to the GetGems standards.  Please DM me for more information. ❕❕❕

Muhammadyoqub: Hello. Can I create own smart contract with getgems Fixed price sale https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r2.fc  With Set own fee

TON Answers Bot (not AI): Ссылка получить Тон монеты from kaetosh  можно ли и как сформировать ссылку, которую я могу отправить кому-либо, получатель ссылки, перейдя по ней, получает установленную сумму монет с моего кошелька. В @wallet телеграм есть похожий сервис, когда контакту можнл отравить чек, активировав который, контакт получает перевод. Вот нужно что-то похожее.  🔗 Answer on TON Overflow

Scott: hey all, would like some of your input - if there were any key infrastructure needs missing from TON at the moment, what would they be?

Кроль Із Конохи: how to get the last block with all transactions with toncenter?  I don't understand what the parameters seqno, workchain_id and shard mean, and what they can be

Zero: If anyone helps, i'll pay some ton (reply to 43573)

Zero: And will be very thankful as well

Anastasiia: You may probably use https://tonapi.io/v2/jettons for this. https://docs.tonconsole.com/tonapi/api-v2 (reply to 43573)

Daniil: Please specify your goals and what are you trying to achieve. (reply to 43590)

~ The 17th Letter ~: Hi guys can you tell me  how can i get nfts in react app from my wallet?

Atoz: Are the tonkeeper devs here?

~ The 17th Letter ~: ? (reply to 43595)

Danya: Hi guys!  Is it possible to change the colour of the back button?

Nastya: Same problem, what was the answer you found? (reply to 38444)

Nastya: Different wallets (TonKeeper, MyTonWallet, etc) send different serialized StateInit for the same V4R2 wallet contract while working with TON Connect pipeline  How is that even possible?

Nastya: https://docs.ton.org/learn/overviews/addresses  AccountID is a hash of StateInit and it is immutable  User-friendly "wallet address" is just a representation/serialization form of AccountID + WorkchainID + some flags included (bounceable/non-bounceable, etc)  So, it's okay that "addresses" are different, but they all based on the same base AccountID  Is that correct?

Nastya: The question is, how can there be different StateInit(s) for the same wallet contract? (reply to 43624)

— 2024-02-09 —

Barbell: hi guys

Barbell: I am running npx blueprint run ->

Barbell: and I setup MNEMONIC

Barbell: but I am having an issue with wallet version

Barbell: for whatever reason v4 or v3r2 is not accepted by cli (blueprint)

Barbell: also looking into the code and it seems those types are correct

Barbell: anyone else has been facing the same issue?

Barbell: set WALLET_VERSION=v4r2 && npx blueprint run

Barbell: ?

Dmitry | backend4you.ton: StateInit includes public key which is generated from seed phrase (reply to 43626)

&rey: Cache bits, CRC32, cells index. (reply to 43624)

Nastya: That's right, sure  But for one seed phrase there must be one public key, isn't it?   So, shouldn't different wallet apps generate the same StateInit if they have been initialized using the same seed phrase? (reply to 43637)

Nastya: How to build a StateInit cell doc: https://docs.ton.org/develop/func/cookbook#how-to-build-a-stateinit-cell

Nastya: It looks like there is no any CRC32 checksum or cache bits in StateInit spec :(  Can you tell more details, what do you mean? (reply to 43638)

Nastya: * We are talking about only one instance of V4R2 wallet contract, of course (reply to 43639)

Kenny$$Shillz: Yes (reply to 43639)

Nastya: That's why it is interesting, how can wallet applications send different base64 strings of StateInit when working via TON Connect pipeline (for the very same V4R2 wallet)  It's quite strange :0

Dmitry | backend4you.ton: agree. are you sure you're comparing stateinit's and not external msgs to your deploying wallet? (reply to 43639)

&rey: In BOC serialization there are. (reply to 43641)

Vitor: I am trying to use TonConnectUIProvider on the root of my Next.js 14 app and I am receiving the following error:  TypeError: (0 , N.createContext) is not a function  Anyone has any ideas?

Mikhail: Hello, does anyone have problems with deploying via blueprint right now? seems like ton.access.orbs is dead or smth.

Glen: Hi Ton devs, does anybody know how to get more debug logs -> to understand this msg :   throw_unless(24, hash < pow_complexity);  ;; hash problem NOT solved

Vitor: Posted this question on Stack Overflow  https://stackoverflow.com/questions/77968090/typeerror-0-n-createcontext-is-not-a-function  if anyone has any ideas, please share (reply to 43647)

MS: Please help   i am trying upload and download file. I opened AWS instance for this my issue. I opened storage provider on AWS. Then i created bag after that i wanted download other client. Other client giving this error message "Torrent info is not available"

Muhammadyoqub: + (reply to 43648)

Luka: Hi everyone i am trying to send transaction from my node express server but i am getting this error. I am doing everything as the documentation says, i am using ton library but i keep getting this error at sendTransfer

Оскар: hi, it is necessary to implement royalty params standard for nft collection if I didn't want royalty or this collection only for minting SBT ?

Alex: Hi looking for a bot analog ? Access to chat based on the availability of NFT in the wallet

Tawfik: what is the final result for this transaction is it Buy GRAM or Sell GRAM

Propants: hi, how can i get the client information, like user id etcc... whit miniapps for customize the miniapp?

&rey: "STON.fi DEX" transferred GRAM to "EQCpv", likely some user's wallet. I'll leave you to label that "sell" or "buy". (reply to 43660)

Tawfik: Sell? (reply to 43663)

&rey: Yea, sounds right. (reply to 43664)

Артем: Всем привет, я ищу разработчика смарт контрактов для тона и бэкенд разработчика. Пишите в дм  Hi all, I am looking for a smart contract developer for ton and backend developer. Please dm me

— 2024-02-10 —

User<6890151979>: PM (reply to 43666)

Клецка: hi! is there any standart way of sending simple transfers? I'm using Blueprint. Building transfer message like that: beginCell()     .storeUint(0x18, 6) // nobounce     .storeAddress( address )     .storeCoins( amount )     .storeUint( 0, 1 + 4 + 4 + 64 + 32 + 1 + 1 )  .endCell() Then, adding seqno and mode: const msg = beginCell()                         .storeUint( await this.getSeqNo( provider ), 32)                         .storeUint( mode, 8 )                         .storeRef( message )                     .endCell(); And signing it: let signature: Buffer = sign( message.endCell().hash(), this.secretKey );         return beginCell()             .storeBuffer( signature )             .storeBuilder( message )         .endCell(); But, when i'm sending this message from contract - nothing happens. I'm checking balance of contract i'm sending coins to, but it isn't changing.

Клецка: This is a contract code:  #include "./imports/stdlib.fc";  int getSeqNo() method_id {     var cs2 = begin_parse(get_data());     var stored_seqno = cs2~load_uint(32);     return stored_seqno; }  ;; Simple wallet smart contract  () recv_internal(slice in_msg) impure {   ;; do nothing for internal messages }  () recv_external(slice in_msg) impure {   var signature = in_msg~load_bits(512);   var cs = in_msg;   int msg_seqno = cs~load_uint(32);   var cs2 = begin_parse(get_data());   var stored_seqno = cs2~load_uint(32);   var public_key = cs2~load_uint(256);   cs2.end_parse();   throw_unless(33, msg_seqno == stored_seqno);   throw_unless(34, check_signature(slice_hash(in_msg), signature, public_key));   accept_message();   cs~touch();   if (cs.slice_refs()) {     var mode = cs~load_uint(6);     send_raw_message(cs~load_ref(), mode);   }   cs.end_parse();   set_data(begin_cell().store_uint(stored_seqno + 1, 32).store_uint(public_key, 256).end_cell()); }

Nickolay: hi everyone!  how can i cast Slice (or cell) to CustomStruct?  something like: ….func(Object obj) { CustomClass cc = (CustomClass) obj;

Dmitry | backend4you.ton: You don’t need seqno and signature when sending _from contract_. Because contract-to-contract are internal messages. You need seqno and sig when preparing message for your wallet - you’ll give him external msg that must follow “rules” that  this wallet version expects. (reply to 43672)

~ The 17th Letter ~: hey   can you help me  can you provide doc  how i can get nft data from wallet  thanks

&rey: Only by manually .loadUint and .loadRef-ing Slice. (reply to 43674)

&rey: I've heard something about someSlice % Struct parsing, but that's not implemented currently.

Клецка: i know. this code is making external message for wallet contract (reply to 43675)

Клецка: message, which is being sent BY contract is the first one

Nickolay: Something about json parser maybe if change Slice to String?   Or it’s not exist too yet? (reply to 43679)

&rey: JSON parsing will be prohibitively expensive and doesn't exist yet as well. (reply to 43682)

Nickolay: Merci🤍   Gonna try make it by hands manually. (reply to 43683)

~ The 17th Letter ~: ? (reply to 43677)

I1OFF: Guys, what problems can there be on the liteserver side? It's synchronized, the ports don't seem to interfere. Connected via apii https via raw github. But my local computer gives an error

Aydin: Hi. Is testnet working properly? Seems that I'm experiencing some issues...

Sol: Hello, can you tell me where to find url connect wallet?

Luka: Anybody else experiencing issues with lite servers on the mainnet right now?

— 2024-02-11 —

Bear: how many bits in load_msg_addr

Bear: 256bits?

Behrang: Depends on the actual serialize address. It can be at least 2 bits (for no address), but usually it is a standard address which is 267 bits. (reply to 43696)

&rey: + up to 510 for more exotic addresses, as far as I remember. (reply to 43698)

Bear: Thanks!

Bear: is the sentences here are the same? Just style in differences?       int op = in_msg_body~load_uint(32); ;; by convention, the first 32 bits of incoming message is the op     int query_id = in_msg_body~load_uint(64); ;; also by convention, the next 64 bits contain the "query id", although this is not always the case      (int op, int query_id) = (in_msg_body~load_uint(32), in_msg_body~load_uint(64));

Bear: sorry, let's say I have a dictionary:      storage::pool_id_to_id_map = ds~load_dict(); ;; int -> int (Uint256)  how can I read the value of the dictionary by input the key id?

Bear: https://docs.ton.org/develop/func/stdlib#dict_get ? (reply to 43702)

Seitaro: Yes, you can find example for instance here: https://github.com/newton-blockchain/ton/blob/master/crypto/smartcont/config-code.fc#L430 (reply to 43703)

Bear: func func func

Bear: Thanks. And I think this code is quite difficult to understand:  1/ Why do we need with store_uint(0, 2) in state_init_builder?      builder state_init_builder = begin_cell()         .store_uint(0, 2)         .store_dict(storage::pool_code);   2/ why does the state_init is the address of the contract but in Int?      cell state_init = state_init_builder         .store_uint(0, 1)         .end_cell();

Nxrix: If I select 24 random words from bip39 list in javascript using Math.random is it safe to use it as wallet?

