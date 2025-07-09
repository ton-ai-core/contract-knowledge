Frainkly: // Function to send post request with headers async function sendPostRequest(address, chainId, publicKey, tonProof) {     try {         const response = await axios.post('https://wallet-domain.blum.codes/api/v1/wallet/connect', {             address,             chainId,             publicKey,             tonProof         }, {             headers: {                 'accept': 'application/json, text/plain, */*',                 'accept-language': 'en-US,en;q=0.9',                 'authorization': 'Bearer TOKEN', // Replace with actual token if needed                 'content-type': 'application/json',                 'lang': 'en',                 'origin': 'https://telegram.blum.codes',                 'priority': 'u=1, i',                 'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128", "Microsoft Edge WebView2";v="128"',                 'sec-ch-ua-mobile': '?0',                 'sec-ch-ua-platform': '"Windows"',                 'sec-fetch-dest': 'empty',                 'sec-fetch-mode': 'cors',                 'sec-fetch-site': 'same-site',                 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'             }         });         console.log('Response:', response.data);     } catch (error) {         console.error('Error sending request:', error);     } }  // Call the function to generate wallet details generateWalletDetails();  error     data: { message: "can't decode address " }   },   status: 500 (reply to 104791)

Frainkly: anyone solution pls help (reply to 104793)

Albert: Hello Ton community. I just want to know if there is available resource or example of Authenticating User wallet from frontend to Backend Side using vanilla javascript?

Arbit: hello

Md: Yes (reply to 104802)

Arbit: i was wondering of making a mini app like hampster combat

Arbit: i know about react frameworks

Arbit: how can i start?

Md: oky (reply to 104805)

Arbit: how can  i start

programmer: What is your problem? You need to know node js too (reply to 104806)

programmer: For backend  Also need to know how transfer ton to users (reply to 104813)

Frainkly: need help why my ton proof is not valid

Arbit: yess (reply to 104813)

Frainkly: did i make mistake ??  // Function to generate wallet and get its details async function generateWalletDetails() {     try {         // Get keyPair from mnemonic         const { secretKey, publicKey } = await getKeyPairFromMnemonic(mnemonicPhrase);          // Generate address from public key using TonWeb         const addressFromPublicKey = await getAddressFromPublicKey(publicKey);          // Determine the chain ID         const chainId = "-239";          // Generate timestamp and payload         const timestamp = Math.floor(Date.now() / 1000);         const payload = timestamp.toString(); // Convert payload to string          const domain = 'telegram.blum.codes';         const message = ton-proof-item-v2/${addressFromPublicKey}:${domain}:${timestamp}:${payload};         const signature = generateSignature(message, secretKey);          const tonProof = {             name: 'ton_proof',             proof: {                 timestamp: timestamp,                 domain: {                     lengthBytes: domain.length,                     value: domain                 },                 signature: signature,                 payload: payload // Ensure payload is a string             }         };          console.log('Address:', addressFromPublicKey);         console.log('Public Key:', Buffer.from(publicKey).toString('hex'));         console.log('Chain ID:', chainId);         console.log('Ton Proof:', JSON.stringify(tonProof, null, 2));          await sendPostRequest(addressFromPublicKey, chainId, Buffer.from(publicKey).toString('hex'), tonProof);      } catch (error) {         console.error('Error:', error);     } }   // Generate signature with proper padding and hashing function generateSignature(message, secretKey) {     // Convert message to a Uint8Array for hashing     const messageBytes = Buffer.from(message, 'utf-8');          // Create hash of the message     const hashedMessage = crypto.createHash('sha256').update(messageBytes).digest();          // Create a request cell for signing     const requestCell = beginCell()         .storeUint(0x142c7d04, 32) // Header for the multi-action         .storeBuffer(hashedMessage) // Store the hashed message         .endCell();          // Sign the request cell     const signature = sign(requestCell.hash(), secretKey);      return Buffer.from(signature).toString('base64'); }  // Correctly derive the address from the public key using TonWeb async function getAddressFromPublicKey(publicKey) {     const WalletClass = tonweb.wallet.all.v3R2; // Use the correct wallet version     const wallet = new WalletClass(tonweb.provider, {         publicKey: publicKey,     });      // Get wallet address     const address = await wallet.getAddress();     const addressString = address.toString(false); // Return the address in the correct format          // Ensure the address has the correct format (with '0:' prefix)     if (!addressString.startsWith('0:')) {         return '0:' + addressString;     }          return addressString; }  // Function to send post request with headers async function sendPostRequest(address, chainId, publicKey, tonProof) {     try {         // Customize payload to match the required format         const payload = {             account: {                 address: address,                 chain: chainId,                 publicKey: publicKey             },             tonProof: {                 name: 'ton_proof',                 proof: {                     ask for my phrase domain: {                         lengthBytes: tonProof.proof.domain.value.length, // Length of the domain value                         value: tonProof.proof.domain.value                     },                     payload: tonProof.proof.payload, // Ensure payload is a string                     signature: tonProof.proof.signature, // Signature as base64                     timestamp: tonProof.proof.timestamp // Correct timestamp format                 }             }         };

programmer: Do you want to invest? (reply to 104763)

Arbit: i know that aswell (reply to 104813)

programmer: So what is the problem you can easily make it But no Not easily take 1 months time (reply to 104822)

Arbit: i am not able to find proper steps and actual distrubution for jetton on each tap (reply to 104825)

programmer: Just add scores after each tap  Then mint your all tokens then with JavaScript and tonweb library you can transfer tokens from your wallet to outher wallets (reply to 104827)

Arbit: is there a document about it ? (reply to 104832)

programmer: Yes just search tonweb (reply to 104833)

Arbit: thanks (reply to 104837)

Kron: hey guys,is anyone know how to deploy a contract through tonweb and tonconnect? the official demo is not working

programmer: You should list on dex like stonfi (reply to 104656)

Arbit: cani get link to it? (reply to 104833)

programmer: Pm me (reply to 104843)

Arbit: not accepting the req (reply to 104844)

Arbit: can u ?

KomunTalabu: Hello I use jetton to send USDT, how to input messge in this transaction ?

Nguyễn Linh: anyone know how to estimate fee of tx including contract deploy?

Nguyễn Linh: https://testnet.tonviewer.com/transaction/1bbe705968fb9ecc2965b50666c7a61aba1868256f9b79d3ae3fb4523e72603a

Nguyễn Linh: Im trying to use estimateExternalMessageFee from TonAPI but the actual value is quite different

AnawoRICH: Hello I can't access ton.org What can I do

Ivan: Hi,   I faced with issue on my full node after upgrade. The server got out of memory, then I've cleaned up it (with cleanup, removing some *.OLD.logs, etc). After that I've applied update & upgrade and for now it cannot sync   Network load average (Mbit/s): 34.25, 49.73, 53.29 Memory load: ram:[15.1 Gb, 14.6%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): nvme0n1:[664.94, 99.9%], nvme1n1:[669.18, 99.9%] Mytoncore status: working, 1 days Local validator status: working, 1 days Local validator out of sync: 48056 s Local validator last state serialization: 55509 blocks ago Local validator database size: 536.61 Gb, 65.5%  Everyday  value Local validator out of sync increasing. Yesterday it was 8 hours, today it's 13 hours. Are there any solutions or how can I debug it and understand what can I do to get it work?

programmer: If you use tonweb i can say (reply to 104851)

MRT: guys i need 10 testnet coin please 🙁 kf8zwuqZAqwRBAT_6LbrForAQbKursLYwh6Afmt_JlbxfGJm

Zqy: "Does it mean that if I place an identical user agreement into countless cells, the fee is only calculated for one? Guys, how should I understand this? Looking at the formula  storage_fee = (cells_count * cell_price + bits_count * bit_price) * time_delta / 2^16 , it seems that  cells_count  is only used to calculate cells with different hashes. But I'm confused about  bits_count . If I use many identical cells, the total amount of data is still increasing, so do I still have to pay for the repeated data?"

Zqy: who can help me

Zqy: this is doc about fees-low-level. "I still cannot understand. If I create many identical cells with the same content, and their hashes are the same, the document states that identical cells are not counted multiple times. So, are the bytes within these cells still going to be stacked and added to the storage space for billing purposes?"

&rey: They'll be billed once only. (reply to 104890)

Chad: @malev how to verify testnet contract?

Chad: anyone?

Chad: i need to verify ton contract i use tact how to verify please guide me or help thanks

Zqy: thank you very much

Zqy: thanks (reply to 104891)

MRT: not working today 🙁 i think that fucent is empyy (reply to 104900)

MRT: https://github.com/mrtnetwork/ton_dart  New update:  0.1.0  - Breaking Changes: Updated APIs for NFT, Jetton, and versioned contracts. All related methods have been modified. - Added: Support for WalletV5R1. - Added: Support for MultiOwnerV2R1 contracts. - Added: Support for Stable Jetton contracts.

Ankit j: Are there any bot apps on telegram, through which we can promote our app ?

Vitalii: Hello everyone. Could you please tell me how I can find out through the TON Centre API from a swap transaction which tokens are being converted?

Zqy: Does ton delete cells with completely identical hash values?" (reply to 104891)

&rey: Well, that's the reason why storing them in another cells is called "reference"; multiple (immutable!) references will point to the same data. (reply to 104907)

Zqy: 👍that cool,I know，thanks! (reply to 104910)

Piyush: Hello  I face a problem. My ton transaction is not showing in list when I use testnet api v2 get transaction api.  But when I check my wallet in the testnet tonscan panel where I see my transaction.   Could any one help me what issue is this

Danil: Hey guys! I'm trying to figure out what are conventions for sending log message. I've seen two msg layouts:  Jetton standart: var msg = begin_cell()             .store_uint (12, 4)         ;; ext_out_msg_info$11 src:MsgAddressInt ()             .store_uint (1, 2)          ;; addr_extern$01             .store_uint (256, 9)        ;; len:(## 9)             .store_uint(event_id, 256); ;; external_address:(bits len)  Tact emit: begin_cell()         .store_uint(15211807202738752817960438464513, 104)         .store_ref(body)     .end_cell()  What is more common and used more often? Thanks!

&rey: Whatever takes less gas, of course. Tact version is better here. (reply to 104917)

MRT: https://medium.com/@mrhaydari.t/how-to-send-multi-signature-transactions-on-the-ton-blockchain-38c6aaa90b38

Aleks: Is the chain experiencing some lagging at the moment? Anyone else have pending transactions taking lots of time? Also indexing on the explorers seems to be struggling

&rey: It doesn't seem so; dton.io indicates blocks are coming normal, and there are 10K tx/min. (reply to 104933)

smartestdummy: Yes.. sent some $DOGS to BYBIT 30 minutes ago and this showed up on my txn history. Tokens are gone🤦🏾‍♂️ (reply to 104933)

Aleks: Is your wallet a v4 wallet? (reply to 104937)

Алина: My transactions are sent to the void too

Dmitry | backend4you.ton: https://t.me/tonstatus/139 network has some little problems

Aleks: I actually just received a token I transferred about 30 mins ago

smartestdummy: Yes. 4.10.1 (reply to 104938)

User<7012417474>: why ton so slowly, i sent TON but not receive and can not load any history, it about 30 min

Aleks: Yea it’s also happening to us. They have network issue at the moment. One can hope that they resolve the issue soon 👍️️️️️️ (reply to 104944)

&rey: By the way, there were precedents of that. With higher load, you should expect possibility of such congestion. (reply to 104944)

User<7012417474>: it have a lot issue

Aleks: Sad but true (reply to 104948)

smartestdummy: I just received my tokens on the CEX.. I guess everyone's txns will go through eventually. (reply to 104937)

&rey: It should be noted that TON is designed to process many transaction chains in parallel, but not to process any individual chain quickly. In particular, you shouldn't HFT on TON.

Aleks: You mean high frequency transactions? (reply to 104951)

&rey: High frequency trading against DEXes. (reply to 104952)

Aleks: Yea but now we are facing a situation where simple txs simply take forever to go through. That’s not good (reply to 104953)

مـ🫡ــــــــن 🤛🏻و🤜 تـــــــــــ😍ـو: darling

&rey: That's, how to say, by design (except that with more shards delays could shorten). (reply to 104955)

JJueuu: Hello. There is any way to decode external incoming messages? Need just analog of tonapi decode endpoint, but locally executed. Looks like there is no analog in pytoniq.

Chad: i need to verify ton smart contract at testnet . i use tact for making contract . how to verify please help me thanks

Alver: Hello this is what i have:  // import libraries  export class MainContract implements Contract {   constructor(     readonly address: Address,     readonly init?: { code: Cell, data: Cell }   ) {}   }  const client = new TonClient({   endpoint: await getHttpEndpoint({ network: 'testnet' }), });  const contract = new MainContract(   Address.parse('EQDZoG-C87CAfc7MOLrPqAx_hX3pyKTJV7hbaVK1sDnUpXEC') );  client.open(contract);  I already deployed my contract, but when i try to open it, i get this error  Uncaught (in promise) Error: Invalid address  But thats the correct address.  By the way, im doing https://stepik.org [TON & Telegram Blockchain Course] - 5.3 Reading data from our contract

the_renovatio: is there a channel to see if the ton chain is currently lagging or updates are send?

Ton: hello

Ton: How can I change Address to Int

Ton: in typescript

Wasiq: Hello Is TON down right now ??

arthur: Same, nothing works for me I'm trying to do some transfers but nothing happens (reply to 105002)

Wasiq: Yup my transaction is stuck in pending.. Might be same for you (reply to 105008)

Loai: Hi I sent a transaction in Ton currency to fragment three hours ago, and so far the transaction has not reached the desired address, and I did not find it in tonviwer, and part of my balance has been deducted

Loai: My transaction has been missing and stuck for three hours, will it reach its destination or will it be lost? (reply to 105011)

Wasiq: Look Here Loai, maybe you will find that in pending

Loai: Yes, I found it, but from you three hours so far, you have not reached fragment, what is the reason for all this delay? (reply to 105013)

Wasiq: Idk, maybe validator issue or something but don't know for sure (reply to 105015)

Loai: Ok thank you I hope you solve this problem as soon as possible (reply to 105016)

Wasiq: I don't work at TON lol, I just asumed as TON transaction is suspended on CEX too (reply to 105018)

Loai: Ok, how can I know the cause of the problem, and will my money be wasted or just a matter of time, and the transaction will be sent to its destination? (reply to 105019)

Loai: I noticed 3 and a half hours ago and until now all the transactions sent to fragment before this time, but after there is nothing

Loai: This is the latest transaction

— 2024-09-14 —

Maksym: https://multisig.ton.org/ stopped working  All transactions show in pending without execution

Shimul🦴: Help me

User<7464188086>: what is it? (reply to 105025)

Shimul🦴: If I send Ton to a ton address, ton goes but transaction does not come but ton is cut. It is not received at the address that I give (reply to 105026)

Wasiq: It'll go through once it's back online (reply to 105020)

User<7464188086>: only ton to ton? (reply to 105027)

Shimul🦴: yes (reply to 105029)

Shimul🦴: UQCLP8phWfGuHUW1QgnBAsObMvHRNVynyGD3M47hjiVIiVvl  send my adrs 0.0001$ and check transaction nothing but your dollar reduce. (reply to 105029)

إيشو: Have you made a transaction for more than an hour that has been pending?

DeFi: Some transactions are currently delayed. It's a known issue and being addressed. (reply to 105045)

إيشو: Is this a general problem? (reply to 105046)

DeFi: Yes (reply to 105047)

Abhi: Have a query regarding  TON. Token

ico: Hi, hours ago I deposited tons to my wallet from Binance but I haven't received the ton i sent.

ico: Txid: f02f5f0b3e41a57038eba5e7a60ec4939ad4f73a375767b82e06d099f94f0b78

Greg: Yes transactions on ton are broken right now (reply to 105061)

ico: oh thanks, i thought my tokens were lost. (reply to 105066)

TON Bounty Bridge: ​Ir  🏷 Developer Tool  Summary:B2b b2c sale  Created by Miladpm1

TON Bounty Bridge: ​Ir1  🏷 Resource  Summary:Iran open  Created by Miladpm1

TON Bounty Bridge: ​Iran  🏷 Education  Summary:Kids need 100 btc  Created by Miladpm1

sway 🦴: hello guys, token was sent but it failed, its not in my wallet anymore, help me

smartestdummy: Patience fren, it will go through. Had same issue earlier. (reply to 105075)

sway 🦴: thanks bro, just got confused cause it said its failed (reply to 105080)

Mehrdad: Hi I have sent 700 usdt jetton but after 1 hours it's in pending state and the fund are not in my wallet anymore. What happened?

loo: Same too (reply to 105082)

midcurve: hi what happens if a transaction is in pending and has not failed yet for 1+ hour?

Jason: Hey guys

Jason: how's it going

Sadegh: Sometimes it would be convenient if the gas fee for the transactions would be paid by some other account. In the EVM ecosystem there's EIP-2711 for that: https://eips.ethereum.org/EIPS/eip-2711  Is there something like that on TON blockchain, or the fee must always be paid by the sender?

&rey: By the sender always. It is actually impossible to pay from any other account since it might be in another shard. (reply to 105104)

&rey: The most accurate wording would be "external message has been accepted, but transaction tree originating from it is not complete yet". Well, messages are in queue. TON structure guarantees they will be processed eventually. (reply to 105092)

Sadegh: So as I found, there is no way to transfer jettons from an account without having TON on it. (+not using w5)  Am I correct? (reply to 105106)

Sadegh: Sorry for to many questions, and what if the wallet be v5? I read that this functionality exist in this version but I couldn't found any sample code for it. is there any simple code for it?  I want user sign a jetton transfer transfer and send it to server and server pay the gas for it.

Laisky: Every message should be transfered with some TON within it to pay the forward fee.  The payer is not necessarily the owner of the jetton; whoever pays can initiate the call.  The greatest joy of TON programming is using your imagination to build a call chain. The first caller pays all the costs, ensuring that the remaining value is eventually returned to him. You can do anything you want in between. (reply to 105109)

Sadegh: I want to add options for example hamster users that they just connect their wallet (with just hamster on it) and then I handle all the things for them.  I want somehow create a service that pay the fee for them in the backend with no need to have ton on their wallets.  is this idea possible or not? (reply to 105111)

Sadegh: I'm new to TON, sorry for noob questions. so it's possible to create something like my idea yeah? (reply to 105111)

Laisky: users have Jetton users need to transfer their Jetton to others users do not have any TON coins you want to cover all the fees  Am I getting your requirements right? (reply to 105112)

Sadegh: exactly. (reply to 105115)

ABRAHAM: is there any issue with ton network? I cannot send ton transaction via tonkeeper extension or toncenter API? My wallet has over 100 TON and I just send 1 TON?

Laisky: IMHO, unless users have staked their Jetton in your account, they cannot transfer their own Jetton without paying TON coins.  Typically, only the owner is allowed to initiate a TokenTransfer (0xf8a7ea5) message for their own Jetton. (reply to 105116)

Sadegh: 😔😔 Thanks. But it possible in w5? (reply to 105119)

Laisky: https://github.com/Laisky/tact-utils BTW, I have a template project designed for newcomers to Tact that includes a full implementation of Jetton and NFTs. Take a look if you're interested😁 (reply to 105114)

AMIN̲: Pending for 7 hours 0ab4ecbfdf581b535844132cf055138d37082699c6cc8de71480b83f3e13b3f5

Sadegh: Thanks, I will take a look 🙏🏻 (reply to 105124)

ABRAHAM: at least you still have transaction in tonviewer, for me it disappeared (reply to 105125)

Laisky: Jetton and ERC-20 Tokens have a significant difference: ERC-20 Tokens are stored in a centralized contract, whereas Jettons are decentralized and stored in the user's own Jetton wallet. Therefore, transferring Jettons requires the user to call their own contract personally.  I'm not familiar with wallet v5, but I assume the underlying principle will not change. (reply to 105122)

User<7012417474>: You know why i sent a usdt it always fail in last node, i lost usdt but receiver not receive it (reply to 105128)

&rey: It might be possible in future. Currently, TON Connect 2 does not support that. (reply to 105112)

User<7012417474>: I use code example in https://docs.ton.org/develop/dapps/ton-connect/message-builders

User<7012417474>: Somebody can help me fix that

Laisky: These seem to be two separate transactions. Someone adds money to your account, and then you initiate a Token Transfer. Can these two operations have atomicity? (reply to 105133)

Md: UQATq9W725cbytVUPDArfWqep1ZWL95biLvYHqlKePACni92

Samyar: Hi guys  when i want to send a transaction using @ton/ton for minting an nft, it looks like it does not go on block chain.   it just becomes pending and then it will be removed from the history of my wallet.  what could be the reason? wrong seqno (it's correct)?  404 in tonviewr

Sadegh: Even tonkeeper?  but so how battery works? is it the same what I want to do? (reply to 105133)

Bobby: there are so many txs is still pending. (reply to 139)

Samyar: hey how did you fix this issue? (reply to 68101)

&rey: Please check out if your wallet is in shard which is down right now. (reply to 105138)

&rey: v4 have not, actually. They can only send TON upon incoming message. (reply to 105135)

midcurve: hi has anybody got their pending trades reversed?   https://tonviewer.com/transaction/382b12714e6d5671398abbff3658a380aa70ceaf33c4ad03ecc0fe7e117e6893?section=valueFlow

gavin: Has anyone used https://multisig.ton.org/? I found that it seems to have a bug. The expiration time of the created order is wrong.

&rey: It is still in progress. (reply to 105152)

MA: I also have multiple pending transactions from last night at 9 PM GMT until now (reply to 105152)

Samyar: where can check the shards status? (reply to 105150)

&rey: @tonstatus, for instance. (reply to 105162)

Anmse: Guys, several of my transactions called via the API have been pending for hours now.

meen: Same issues (reply to 105157)

Anmse: ya 😢 (reply to 105166)

Samyar: thanks 👌 i think my wallet belongs to 0,8800000000000000 block ? and is not related to the shard that was down right? i checked the status channel.  is this how you can check the wallet's shard? (reply to 105163)

Leo: 8800..00 is a branch of 9000..00

&rey: They will be delivered if first message is accepted already. Eventually. (reply to 105165)

Samyar: oh, and how did you know that? (trying to learn) (reply to 105170)

Pandario: Hi! is it possible that a Tx from yesterday evening, incoming on my ton space, appears completed by Explorer but there is no confirmation in my wallet balance?

Anmse: ya thx, I get that this happens when shards are being restored, but we still don't know how long the wait will be. (reply to 105171)

Anmse: 🎃

Pandario: I saw that there were block production issues a few hours ago, but if that was my case I don't understand why the TX is confirmed instead of pending or canceled

&rey: What do you mean "cancelled"? If external message to your wallet was recorded, it was the only possible outcome) (reply to 105179)

Pandario: sorry, I used the wrong word. I meant that if there were block production issues when the TX was sent to me, its status should now be pending? (reply to 105181)

Pandario: why is it confirmed but the address balance has not changed?

Joe: Hi, Recently we are monitoring the local validator nodes of the test network. I have some questions to ask. Thank you very much! 1. The query in the link above is for the main network validator. Is there an API for the test network?  https://elections.toncenter.com/docs  https://toncenter.com/api/qos/index.html#/ 2. Can the local validator node build the API in the document ? So that the service is more stable. 3. Does the local validator node have an API to query local node data and performance? I didn’t see it in the official API document. https://toncenter.com/

Bruno: hey please help, my wallet cannot sent or receive tx. When sending a transaction it will appear pending but then get 404 on tonviewer

Pandario: and it's the first time something like this has happened to me (reply to 105175)

Pandario: ok it's a TonScan display error. on tonviewer it's still displayed as pending for several hours (reply to 105181)

🧨: Sell working gpt bot in telegram

MA: is there any way to cancel pending transactions or I should wait until all out messages to mined ?  I am using high load wallet v2 and the external message are handled but all out messages are not mined yet after 12 hours

Cloud: Hello, my local ton node cannot catch up with the latest height of the blockchain after using snapshot reset, and it is always behind by almost the same number of blocks. I tried to reset it many times, but it didn't work. However, my other ton node was not reset, and the configuration, resources, version, etc. were consistent with the problematic ton node. How can I recover the problematic node? I hope to get help from the project. The current version is v2024.09 The execution command is: validator-engine -c ./node/data/config.json -C ./conf/global.json -D ./node/data -t 20 (reply to 105192)

Cloud: my log: [ 3][t13][2024-09-14 09:07:26.561311631][liteserver.cpp:1080][!litequery] obtained data for getState((-1,8000000000000000,40334669):5D6484969C1D23720852C59082A206F0001A000D857058D2CC0D0BABEF7E91A8:FF89B80DB0F1E662C6166787A849B4649119EF11845778EDBD26B88498A27C43) needed by a liteserver query [ 3][t13][2024-09-14 09:07:26.561332725][liteserver.cpp:1272][!litequery] continue getAccountState() query [ 3][t13][2024-09-14 09:07:26.561473992][liteserver.cpp:658][!litequery] requesting state for block ((0,e000000000000000,45638178):B186445816623AF2400BE29CB23334DD2368679753A2DD51E5B14606E649A183:EC404182517961079DFA73E3C3B8BEBB7C1E0BEF275F64AD9BA51B637773D031) [ 3][t13][2024-09-14 09:07:26.561502672][liteserver.cpp:84][!litequery] aborted liteserver query: [Error : 651 : cannot load block (0,e000000000000000,45638178):B186445816623AF2400BE29CB23334DD2368679753A2DD51E5B14606E649A183:EC404182517961079DFA73E3C3B8BEBB7C1E0BEF275F64AD9BA51B637773D031 : block (0,e000000000000000,45638178) is not in db (possibly out of sync: shard_client_seqno=40334658 ls_seqno=40334669)] [ 3][t13][2024-09-14 09:07:26.567449999][liteserver.cpp:311][!litequery] started a getMasterchainInfo(-1) liteserver query [ 3][t13][2024-09-14 09:07:26.567471664][liteserver.cpp:791][!litequery] started a getAccountState((-1,8000000000000000,40334669):5D6484969C1D23720852C59082A206F0001A000D857058D2CC0D0BABEF7E91A8:FF89B80DB0F1E662C6166787A849B4649119EF11845778EDBD26B88498A27C43, 0, EE95AA91C5FC207C3C1D1F9315BDD85652F4951F2EC11F1B486F1BDF90B198BF, -2147483648) liteserver query [ 3][t20][2024-09-14 09:07:26.567617285][liteserver.cpp:1098][!litequery] obtained data for getBlock((-1,8000000000000000,40334669):5D6484969C1D23720852C59082A206F0001A000D857058D2CC0D0BABEF7E91A8:FF89B80DB0F1E662C6166787A849B4649119EF11845778EDBD26B88498A27C43) needed by a liteserver query [ 3][t13][2024-09-14 09:07:26.568827526][liteserver.cpp:1080][!litequery] obtained data for getState((-1,8000000000000000,40334669):5D6484969C1D23720852C59082A206F0001A000D857058D2CC0D0BABEF7E91A8:FF89B80DB0F1E662C6166787A849B4649119EF11845778EDBD26B88498A27C43) needed by a liteserver query [ 3][t13][2024-09-14 09:07:26.568854357][liteserver.cpp:1272][!litequery] continue getAccountState() query [ 3][t13][2024-09-14 09:07:26.568974308][liteserver.cpp:658][!litequery] requesting state for block ((0,e000000000000000,45638178):B186445816623AF2400BE29CB23334DD2368679753A2DD51E5B14606E649A183:EC404182517961079DFA73E3C3B8BEBB7C1E0BEF275F64AD9BA51B637773D031) [ 3][t13][2024-09-14 09:07:26.569003252][liteserver.cpp:84][!litequery] aborted liteserver query: [Error : 651 : cannot load block (0,e000000000000000,45638178):B186445816623AF2400BE29CB23334DD2368679753A2DD51E5B14606E649A183:EC404182517961079DFA73E3C3B8BEBB7C1E0BEF275F64AD9BA51B637773D031 : block (0,e000000000000000,45638178) is not in db (possibly out of sync: shard_client_seqno=40334658 ls_seqno=40334669)]

Crzy: do you need a developer?

Cloud: Yes, I need help from the developer (reply to 105197)

carlbiotic: Hi, The ton bridge is stuck, what should I do?

Sol: why is there a func library?

User<7265582009>: hello, please Dm me, I can help you (reply to 105198)

Niu: This is contract code (reply to 105201)

User<7012417474>: somebody can share me code for jetton transfer usdt :( i try example it always error

User<6943543282>: hello, I am trying to send TON from one Tonkeeper wallet to another, but after confirming action it does not go through, there is no any tx nothing, anyone knows why is that?

User<7012417474>: Now ton have some issue it can not send some tx, pending tx (reply to 105214)

User<6943543282>: I am also using older version of tonkeeper address, does it have anything to do with it?

&rey: Well, that doesn't seem to have any errors... though what responseDestination do you set? (reply to 105213)

Max: Can i get 1000TON on testnet? we are develop contract.

&rey: Have you checked everything using @ton/sandbox first? (reply to 105220)

Max: Yes. checked. I writes many tests. But the final step wanna to test on network (reply to 105221)

&rey: Please check with @f_closer. (reply to 105222)

Max: Thanks. will talk with MR f

User<7012417474>: yes i think i sent wrong destinationAddress and response excess destination (reply to 105218)

User<7012417474>: where can i get a correct jetton address for responseDestination, you know ?

User<7012417474>: and correct usdt jetton address by friendly address

User<6943543282>: swapped several tokens to TON, tokens gone and TON did not arrived, is this blockchain issue as well? even from swaps I did a day ago

carlbiotic: me too (reply to 105228)

User<6943543282>: that’s crazy

Abuman: Hi, I'm new in TON, got this problem after Blueprint run. Seems like i provided a value, but ...

Business: Hello, I need a tone giver for testnet like "testgiver"

Business: please help (reply to 105233)

Niu: @testgiver_ton_bot ？ (reply to 105234)

Business: Doesn't work anymore (reply to 105235)

Business: I need another one like that

Niu: I don’t know another one (reply to 105237)

Fardin: Hello Looks like the ton / toncenter api have issue and its down am i right?  https://tonviewer.com/transaction/1d6ff49f78daf56d07f49f8801742cf01867e441d9a52441a8b9fb5ee693df48

M: Hi  I can't access to this image.    docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-community/ton-docker-ctrl:latest   please help me🥺🥺🥺🥺

User<7012417474>: @pcrafter pls help me know how to get exact jetton address for usdt of a address :(

rexizzzer: Hello everyone, please tell me what to do if inside the Telegram web application, tonconnect ui does not work correctly, when I click on tonkeeper, a page opens on how to install tonkeeper (2 non-working buttons and a sign button that gives an error Web page is unavailable Web page at tonkeeper://ton -connect?), although tonkeeper opens in other web application applications. Some other wallets in tonconnect also do not work correctly

Amirlan: Hello guys is it enough to know TACT language for smart contract development in TON?

Laisky: https://t.me/tondev_eng/105124 here are jetton & nft contracts written in pure Tact (reply to 105268)

User<911648629>: its real? (reply to 105281)

Abdulaziz: Anybody knows how to do "name. t. me" domain on ton space or tonkeeper or any tg wallet?

&rey: Buy corresponding Telegram username and bind it. (reply to 105291)

Abdulaziz: Yes i did first step (reply to 105297)

Abdulaziz: How to do the second step

Abdulaziz: I have "@xxxatom" how to bind it (reply to 105297)

Abdulaziz: I didn't find anything on fragment or dns ton

Abdulaziz: Anybody knows (reply to 105301)

Abdulaziz: Why it's so hard even devs group won't know

Abdulaziz: I don't wanna sign or call 3rd party smart contracts which can stole my wallet nfts (reply to 105305)

&rey: Have patience. (reply to 105305)

MRT: how to detect contract interface ? (is versioned,jetton, nft, highload or etc.) ?

Abdulaziz: There is no docs, no YouTube video, no any hint to do it (reply to 105310)

Defier: Hi guys, I'm curious about setting up a validator.  The docs said we need a minimum of 300k TON.  Is this like cosmos chains where the validator can stake a small amount and other stakes can be delegated by others to reach the minimum?  Or the validator needs to come up with the full 300k?

Defier: Is there a link that lists all the validators we can stake on?

Defier: is there a different channel I should be asking?  I don't see a validator/node operator channel so hoping someone in Dev chat knows about validators.  thanks

User<7012417474>: how to get jetton address have usdt pls help me

Thea: What jetton (reply to 105325)

User<7012417474>: jetton address of usdt to know where address have usdt assets (reply to 105326)

User<7012417474>: const jettonWalletContract = Address.parse(                 'JETTON_ADDRESS',               );                const forwardPayload = beginCell()                 .storeUint(0, 32) // 0 opcode means we have a comment                 .storeStringTail('Hello, TON!')                 .endCell();                const body = beginCell()                 .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer                 .storeUint(0, 64) // query id                 .storeCoins(10000000 * 1e6) // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)                 .storeAddress(                   Address.parse(                     DST_ADDRESS,                   ),                 ) // TON wallet destination address                 .storeAddress(                   Address.parse(tonConnectUI.account?.address || ''),                 ) // response excess destination                 .storeBit(0) // no custom payload                 .storeCoins(1) // forward amount (if >0, will send notification message)                 .storeBit(1) // we store forwardPayload as a reference                 .storeRef(forwardPayload)                 .endCell();                const tx = await tonConnectUI.sendTransaction({                 validUntil: Math.floor(Date.now() / 1000) + 360,                 messages: [                   {                     address: jettonWalletContract.toString(), // sender jetton wallet                     amount: toNano('0.1').toString(), // for commission fees, excess will be returned                     payload: body.toBoc().toString('base64'), // payload with jetton transfer and comment body                   },                 ],               });

User<7012417474>: @oxbonds  i want find JETTON_ADDRESS to send usdt

User<7012417474>: yes

User<7012417474>: i use ton connect ui

Arch: Hello guys, how do i start ton node again. I stopped it and and i deleted the old db snapshot in /var/ton-work/db and i moved new snapshot inside it. Now im trying to start the node but i don't know how.

Setmax: Hey guys, We have this pattern in EVM and Solana-based systems: imagine we have a backend that needs to send some Notcoin to users, and the users need to pay the network fees for these transactions. How can we implement this in TON?

&rey: Here you are: https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offchain. (reply to 105257)

&rey: From https://docs.ton.org/develop/dapps/ton-connect/integration#next-steps scroll above. (reply to 105410)

Nikita: Hi, perhaps any results on getgems issue? (reply to 104772)

— 2024-09-15 —

Alchi: Just make a simple contract using wallet code (reply to 105356)

Alver: do you guys when deploying on testnet get "failed with exit code 9" transaction?

User<7453272423>: I wanna ask, how I can check user has join my channel or not in my telegram mini app

Alver: if anyone can message me, so i can share the code i have (reply to 105441)

Luc: Using the bot api (reply to 105442)

User<7464188086>: you can use bot api. (reply to 105442)

User<7453272423>: Oh okay thanks bro

User<7464188086>: https://api.telegram.org/bot<your_BOT_TOKEN>/getChatMember?chat_id=@<your_channel_id>&user_id=<your_user_id> (reply to 105442)

Abdulaziz: Bot should join in that channel or group? (reply to 105447)

Abdulaziz: What i get as response (reply to 105447)

Luc: Yes (reply to 105448)

TON Bounty Bridge: ​Ok  Created by Omidkalhor65

Gleb: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes  You try to read more bits then you have (reply to 105443)

Setmax: The contract itself shouldn’t be too hard to implement. The question is, how can we partially sign the transaction?  I mean, we need the user to sign the prepared transaction first and then send it to the contract so that it can be signed on behalf of the contract owner, right? (reply to 105432)

Alexander: Hi guys, how can i track a contract event from backend by it's hash?

Laisky: https://toncenter.com/api/v2/ (reply to 105483)

programmer: When a user login to miniapp by referral link in first time Bot will send him message how can i do this ?

abc <: sendData, but it's available only available for Mini Apps launched via a Keyboard button, so this is a rare case and you need to do it yourself through Telegram Bot API calls in backend 👀 (reply to 105487)

programmer: Thank you Ok i know how do it in backend (reply to 105498)

Captain: We are building a Ton project. 80% done.   We need a ton developer onboard. App dev competency (for review purposes) is an advantage.  Who's available?

Cuddlesaurus: I can help you. can you tell me more about your project in detail? (reply to 105510)

Nick: Hey, I've got a question about TON API. I'm using toncenter api and once I obtain address transactions, I'm getting such result  the thing I wanted to ask is: does TON message convert address to some encoding? Coz the screenshot says that account address is EQCH8DiVhCFDrotHOMmN-oYkcSLXb9N4jmTFI1h_pmX1MXNm, but actual address is UQCH8DiVhCFDrotHOMmN-oYkcSLXb9N4jmTFI1h_pmX1MS6j  How can I decode the address from message to default format? The same for the fields source and destination

Cyril M |: Address.parse() both before compare (reply to 105514)

User<7453272423>: Hey, how great tanstack query?. My friend recomend me for use this dependency for build my app.

Rayan: Hi, Does anyone know how to parse message comment from message content body?

User<6452070203>: how i send proxy transaction in @ton/core ?

Molin: Hello everyone. I am looking for additional work on developing something on TON and EVM, if you suddenly need help in development or have an active work task - welcome

Darwin: can you develop  a wallet tracking bot for TON addresses? (reply to 105528)

Rayan: Hi, Does anyone know how to parse message comment from message content body?

Deniel: Could you help me understand how to retrieve the initialization data of a smart contract on the client side (React)? I have an application with a button. When this button is clicked, it sends a NewBanka message to a "Parent" contract. This "Parent" contract then deploys a "Child" contract. I want the client-side application to display the address of the newly deployed "Child" contract. Here's the relevant part of the "Parent"  contract code in tact:  receive(msg: NewBanka) {         self.bankaCount = self.bankaCount + 1;         let init: StateInit = initOf Banka(self.bankaCount);         let ctx: Context = context();         let sender = ctx.sender;         send(SendParameters{             to: contractAddress(init),             value: ton("0.1"),             mode: SendIgnoreErrors,             code: init.code,             data: init.data,             body: InternalAddBanka{goalName: msg.goalName, goalAmount: msg.goalAmount, bankaOwnerAddress: sender}.toCell(),         }); }

Rayan: Hi, Does anyone know how to parse message comment from message content body?

Carter🧹: I'm running both a local node, and ton-http-api in Docker.  The API cannot access the local node for some reason: No working liteservers with ls_index=None, archival=None  I can access the local node liteserver through other means, and have checked that the API container can ping the liteserver.  Anyone have any experience in this area?

User<7265582009>: Hi, I can develop a wallet tracking bot for TON addresses. please DM me (reply to 105529)

Darwin: post your github here first (reply to 105540)

User<7265582009>: can I send github link by DM (reply to 105545)

Anton: https://t.me/tondev_news/151

Darwin: yep (reply to 105550)

User<6964012621>: Anyone want to help with a Telegram Stars Slot web3 mini app ??

User<6964012621>: ??? (reply to 105569)

&: tonapi is better (reply to 105483)

Aleks: Hey all. Is anybody still experience lots of latency on the chain as well as dissapearing txs??

Jason: Hey good evening and good morning guys

BB: Hi

Mat: Is there an administrators who can help me, i ve sent many messages to find someone to get help, only scammers respond to me.  My problem: i ve sent 130 usdt from tonwallet to my blofin wallet and i ve never received the usdt on blofin? What can i do? There s solution to recover my usdt or are they lost ? Help please guys, or tell where i can sent a messages to get helps

เจตต์ธนาพงษ์: /stat@combot

User<6452070203>: how i decompile byte code smart contract?

TYGGËR: No idea (reply to 105622)

boot adbot: is it possible to add a comment to an already generated boc?

TYGGËR: Yes (reply to 105636)

Denis: Hi, do someone have a guide how to fetch Jetton balance using JS tonweb sdk? Thank you

Jenya: how to emulate externals from mempool locally?

Liora: When i want to deploy nft collection based on  https://docs.ton.org/develop/dapps/tutorials/collection-minting Got the following error: {   "ok": false,   "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state",   "code": 500 }

boot adbot: do you have an example of this? (reply to 105637)

Mohammed: I've never tried with tonweb but I managed to fetch it with tonclient  You can use API as well (reply to 105640)

Alver: Thank you (reply to 105465)

— 2024-09-16 —

Mohammed: Have you ever tried tonkeeper? (reply to 105694)

lafi: Ton keeper is good 👍🏼 (reply to 105694)

Frainkly: yo does anyone know how to use ton connect v2?

Aditya: Hello @all,  I am currently trying to implement jettons minting using official code of ToN which is on github. But i am facing this issue while trying to deploy contract.  Property 'getContractState' does not exist on type 'TonClient4 | TonClient'.   Property 'getContractState' does not exist on type 'TonClient4'.ts(2339)  The Ton library getting confused I tried to use instance of TonClient but it seems to not working.  Please any one guide me with the same.  Thank you.

Liora: Hi guys Have anyone solution for this? (reply to 105653)

Buggy: Yeah, wanna know too, somebody help pls (reply to 103921)

User<1016434018>: /stat@combot

Arjun: Hello folks, is there a way to derive testnet wallet address from mainnet address ?

Dmitry | backend4you.ton: Sure! Check address formats (raw and user friendly) in ton docs (reply to 105735)

Buggy: paste an address in here https://ton.org/address/ (reply to 105735)

Arjun: I want to do that programmatically. In js (reply to 105737)

Aditya: Anyone? (reply to 105726)

&rey: Please check out chat history. https://t.me/tondev_eng/93150 (reply to 105738)

Arjun: Thank you🙏🏼 (reply to 105740)

Md: Welcome (reply to 105741)

Laisky: Take a look at this, maybe helpful https://t.me/tondev_eng/104770 (reply to 105726)

Camel: Hi everyone, I have this case: I send a transaction using useTonConnectUI. It works fine, but when the transaction succeeds, it keeps showing the loading image below. The modal from this library doesn't hide.  Please tell me how to hide this modal after the transaction succeeds, or suggest an alternative way to catch the status return from the wallet. Thank you.  Provider setup: <TonConnectUIProvider   manifestUrl={manifestUrl}   actionsConfiguration={{     twaReturnUrl: twaReturnUrl,   }} >   {/* children */} </TonConnectUIProvider>  Trigger function:  import { useTonConnectUI } from "@tonconnect/ui-react";  const [tonConnectUI] = useTonConnectUI();  tonConnectUI.sendTransaction(   {     messages: [         messages     ],     validUntil: validUntil   },   {     modals: ['before', 'success', 'error'],   } );

Aditya: Hello thanks for reply. I am looking for FunC code (reply to 105740)

Aditya: Please help me find out how can I get that in func (reply to 105749)

Vincent: What does exit 9  9 Compute Phase Cell underflow. Read from slice primitive tried to read more bits or references than there are.  probaly happen ?

Flozy: was trying to do a task on Blum app and a message just popped up that I have been blocked.   And I don't know the reason why I was blocked.

Flozy: This screenshot is the message that popped up while I was trying to do a task on Blum app

Flozy: I want to get unblocked, please what do I do?

Jzuss ┌( ಠ_ಠ)┘: Can I create my own State Channel on TON? I mean working with custom smart contract

Frainkly: does anyone know how to code connect wallet to dapps, ill pay u if price good

Tommy: send me DM. I can do it? (reply to 105767)

&: https://www.npmjs.com/package/@tonconnect/ui-react visit here, sdk is easy to understand. (reply to 105767)

Alver: Hello somebody knows what i am missing? I successfuly deployed my contract // import libraries  const client = new TonClient({         endpoint: await getHttpEndpoint({ network: 'testnet' }),       });  const contract = new MyContract(       Address.parse('EQDaFDdH_mcs3Mo6cpo-C5g0xQWjoWFraxdS_mOOlFnjnNVU')     );  console.log('isContractDeployed', await client.isContractDeployed(contract.address));    // GOOD console.log('getContractState', await client.getContractState(contract.address));         // GOOD  client.open(contract);    // Exception  The last instruction gets a Uncaught (in promise) Error: Invalid address

&: that happens due to mismatching between contract and tx structure. Check your code carefully (reply to 105757)

Frainkly: no sir, the script is generate wallet and connect to dapps (reply to 105771)

&: Read carefully. (reply to 105774)

???: /stat@combot

iponer28: 9oiiiiiiiiiiiiiiiffffff;''''''''nmmmotiyseddcbv,mt90yoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.xxxxxxxxxxxxxxxxxxxxba0-9y7777vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

iponer28: vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvem nm

Nguyễn Linh: Hey, I have a question about SendMode: +2/+16. Are these configs same as flag bounce set in internalMessage ?

iponer28: \=c]]]]]]]]]]]]     ,=mmm\

User<7483137682>: I can help you plz dm me (reply to 105767)

Andrii: Hi guys! I use TonConnect and try to connect TonKeeper from localhost:3000, but when connecting I get the error "Failed to load manifest: 500" in TonKeeper, while Bitget Wallet connects normally.The manifest in my application has already been created. Please tell me what could be the problem?

iponer28: ,,,,,,,,,,,,,,,,,hniuy\o)                                                                                                                                                                                   C        ;///////////////76CFv;^^^^^^^^^VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVR?????OL{p-;.llo444444444tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt

Snow Lee: The manifest has to be able to view publiclly (reply to 105807)

Snow Lee: So you'd need to have your domain/manifest.json and it shows the json file and its content on the browser

TKAINU: Regarding upgrade contracts in Ton, are there any issues that need to be taken into account? For example, not being able to add new data, etc.

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 54 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 47  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

sirius: yeah. That is the minimum amount that you can be a validator. If you have got such amount of ton, you can borrow it from the others on the ton community (reply to 105324)

Curio: Hello!! I have a doubt, I have cloned the token-contract repository from https://github.com/ton-blockchain/token-contract, and i see that there is a op-codes.fc contract which contains identifiers for the functions defined in jetton-minter.fc and jetton-wallet.fc, i would like to know if the value of the identifiers in the op-codes.fc file are generated or are random hex numbers defined by the developer. Also i would like to know which contract do i have to compile to create a jetton token, it is enough compiling jetton-minter.fc?? or i have to compile jetton-minter,wallet, op-codes and then upload it?

Curio: it is a bit hard to understand how to deploy correctly a jetton token

TKAINU: please help me (reply to 105813)

Alireza [Fi]: Hi guys I have a question Is it better to delete outdated and useless information from my channel or it will hurt my channel?

TKAINU: I using upgrade of jetton contract token, but error, please help me, when i upgrade, get data is eror

Nrus_X 🇷🇺: Scammer (reply to 105836)

TKAINU: lost all information when calling upgrade contract

&rey: They aren't. (reply to 105794)

Chad: How to create nested map?    stakes: map<Address, map<Address, Stake>>;

Zqy: What do they mean about I HR and HR，here.I I read docs but i can't Understand them. I want to help

Anton: put the nested map into a struct (reply to 105848)

Zqy: I noticed in the document that it mentions  inline-ref , which is used for calling, and it is stated that the gas consumption for hash search and dictionary calls is much lower. So why can't we always use this method for frequent calls? It doesn't have the disadvantage of  inline  which can cause code bloat, it just references, and the gas is low. Are there also many advantages in frequent calls? Compared to dictionaries.

Zqy: please，I have  these two questions

Wick: I was learning TACT but some good dev told me that it is better to start from FunC. so from where do I learn it?

Wick: I find course which are from the TON devs a bit complex to understand

Chad: like this? struct NestedStake{    nested: map<Address, Stake>; }  struct Stake{     amount: Int as uint32;     endTime: Int as uint32; } stakes: map<Address, NestedStake>;  ? (reply to 105851)

Zqy: have Confuse maybe normal thing，But you can just do and Redback docs，Ask questions in group or We can talking about this together

&rey: "Hypercube Routing". Routing in presence of more than 16 shards. (reply to 105849)

Chad: @AntonTrunov  please confirm

Wick: A quick question - Was notcoin created using some FunC or Tact lang ??

Zqy: "Thank you for your reply, does 'IHR' refer to the additional costs required for complex algorithms when there are more than 16 shards?" (reply to 105865)

&rey: I in IHR stands for "instant": message which gets delivered in destination shard instantly, being discarded from normal routing at the same time. This mechanism, if enabled, is supposed to cost additional TON in forward fee. (reply to 105869)

Zqy: You are truly knowledgeable, and I appreciate your answers very much. I hope that one day I can learn as much as you have! (reply to 105870)

User<6789690900>: Just edit it (reply to 105832)

Cyril M |: how do you forcely break a loop? like break?

TKAINU: I want to ask about the steps to upgrade a new logic to a deployed contract, do I just need to edit the code and call op::upgrade?

Boris: Have CN CHANNEL?

&rey: You don't. (reply to 105874)

Lucas | CryptoEngineer ✨: Hi, @everyone.

Lucas | CryptoEngineer ✨: I have some troubleshooting on "npm create ton@latest" command on Command Prompt. I am using windows10 and node version 20. When I run this command, I have such node module error. What is the reason and how to fix it. Please help me thanks

Lucas | CryptoEngineer ✨: Here is my error screenshot on command prompt. Hope your kind help.

Liora: Hey everyone i want to deploy nft-collection contract at first the deloy nft-item contract and finally but in the following git considered the collection deployed before!   https://github.com/romanovichim/TONQuest1

Tech: Gm everyone

Tech: I want ask if there's a way to user Ton Connect directly on a Telegram Bot (my product isn't a mini app). I saw on post on the official Ton website but the implementation is marked as deprecated and doesn't seem to work (the links don't open the connect window). Please let me know if you have a way around it   Thank you

Marko: Hey guys, quick question so after the update regarding payments for digital goods and services, if we use crypto payments inside the TMA but without use of wallet pay and telegram stars, we still risk to be penalised/delisted/removed ? 🙂

Kira: I have a tele app miner and am looking to sell the source code or collaborate with a marketing team. If interested, please inbox me

Minimal ☄️: Guys I need help,  Eruda's network tab isn't showing any requests to my backend even though they are being sent and used in the TMA. Same goes for VConsole, Does anyone know why is that happening?  I am developing a TMA in Wix and backend in .NET.

Lucas | CryptoEngineer ✨: Anybody can help me, please? (reply to 105887)

TON Bounty Bridge: ​Free cold TON wallet (without hardware wallet)  🏷 Developer Tool  Summary:The safest option of crypto storage is storing and using private keys on a completely (and always) o...  Created by mcnckc

Wick: Which is better funC Or tact and why? Would appreciate every reply.   I am confused in these two

Anton: start with Tact, it’s more beginner-friendly and it’s getting better with each release (happens about every 6 weeks) (reply to 105939)

Anton: by the end of 2024 one wouldn’t even need that :) (reply to 105943)

TKAINU: Hello, when i upgrade new logic for code, i using get data errror: Failed to get jetton data: Error: Unable to execute get method. Got exit_code: 9 (reply to 105940)

Chad: Guys I need Job or any paid task would be helpful

Александр: Hello, anyone knows how to check ton raffles lock by python?

Gleb: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 105954)

TON Bounty Bridge: ​Generator of personalized addresses for TON blockchain  🏷 Developer Tool  Summary:User's public address is a random, meaningless string of characters. It is possible to make it not e...  Created by mcnckc

Jonathan: Anyone know of any wallets that support signData RPC?

— 2024-09-17 —

Quillen: Hi, My contract's wallet address is Uninit even i already transfer TON coin to this address, What should i do to active this address?

TKAINU: I want when this is the case, I will complete the internal_transfer function and then stop the process, but using throw will stop the process without performing internal_transfer.

Wick: Thanks mate (reply to 105940)

Wick: Wouldn't need what? (reply to 105947)

Zqy: I noticed in the document that it mentions  inline-ref , which is used for calling, and it is stated that the gas consumption for hash search and dictionary calls is much lower. So why can't we always use this method for frequent calls?  Compared to dictionaries calls.

Zqy: I wonder The inline-ref，Has any different with the library cell ？

Mohammed: Hi , devs 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by account 5CC84C648BC0C1C309DDECD0BC4A0F2ED4803BCB89FEB3715ECD687D91EB197B before smart-contract execution', I need you help on this matter

M/AHMED ELDESOKY: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by account 5CC84C648BC0C1C309DDECD0BC4A0F2ED4803BCB89FEB3715ECD687D91EB197B before smart-contract execution',

Mohammed: why is error occuring?

Toga: dm (reply to 105767)

Mohammed: is testnet going wrong?

Abdulaziz: Damn this thing is invisible on black background and how he wanna scam developers which knows how to create such a cat or dog games? (reply to 106051)

OneWay: Do we have telegram wallet expertise here ? Would like to check if we can have a request of a pool of fund and able to return to individual creditors.

Hassan Isa: Good morning, please I need hands on resources to allow me to write token smart contract on TON, I have finished stepik course but no guide on how to write the token contract.  Thanks (reply to 50741)

Ян: https://github.com/ton-blockchain/token-contract (reply to 106067)

Nguyễn Linh: Can you explain the difference pls? (reply to 105845)

Daniel: Good day,  We want to integrate into our application the purchase of NFT of our collection from getgems directly in the TON network (without going to the getgems website), while receiving all the benefits of the getgems marketplace (displaying our collection in the top collections, receiving a check mark later, etc.).  Will a transaction built on these steps give a result identical to the purchase of NFT by the user through the getgems website page? Steps: 1) Receiving information about nft-items of our collection via the "get_sale_data" method of the "nft_sale_getgems_v3" contract. 2) Creating a transaction for the user to transfer to the address of the contract "nft_sale_getgems_v3" an amount equal to "full_price" + network commission (~0.3 TON)  That is: USER —[GET_SALE_DATA_RESULT.full_price + 0.3 TON]—> [nft_sale_getgems_v3 ADDRESS]  We judge by the documentation from here:

Daniel: Its inpossible to put here the link (reply to 106081)

Aidar | Compass Labs: hi everyone, anyone here experienced writing ZK circuits on ton?

Sunny: ANYBODY PLEASE HELPPPPPP????  how can i get jetton address from user wallet address?????   I am using jettonDeployController   transaction and all is working but not able to get the jetton address of specific wallet

César: How can verify if the transaction was confirmes? Looks status not is correct.

Dmitry | backend4you.ton: And here is this question again :)  FYI: the response of operation "send" does not guarantee that it have already been "executed". When you "send" email - there is no information about it delivery. It may be delivered (tomorrow) return or may return to you (invalid address, etc). You will know "result" later. So, you need some other "operation" to check result of your first action.  Same in TON - you should check (again and again) for signs that you operation executed - for example outbound tx at your wallet, or recieve tx in destination wallet - it depends of what you think "success" is in every situation (reply to 106097)

César: I mean when is confirmed by the user, not in the blockchain. (reply to 106100)

César: When user click the confirm button.

César: This way works in others chains sorry for ask. There is not in the docs what data result return?

Dmitry | backend4you.ton: Hmm, its strange. I'm not a frontend dev, but our front had no problems with understanding result of send... Ok, lets wait somebody more front-oriented

User<7453272423>: Seems like we need solidity to tact converter

Haint: nah, it wont work (reply to 106107)

Haint: the concept is vastly different. It's not a matter of which programming language to use.

Nguyễn Linh: I get this error response when submitting a tx from inactive account. Can anyone help me pls?  error: "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state" ok: false

Vincent: Is there anyone who has the experience to solve "exit code 8" overflow issue? Thanks, I love you, nice ton builders.

H: Cell overflow. Writing to builder is not possible since after operation there would be more than 1023 bits or 4 references. (reply to 106117)

H: slice get_wallet_address(slice owner_address) method_id {     (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();     return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code); } (reply to 106096)

Zqy: How to understand this blue line，After BOC decentralization，I found this data Have not in struct。Is this some opcode？

TON Bounty Bridge: ​Web3 Antivirus (W3A)- real-time protection from Web3 scams and fraud  Created by pixenia

Dmitry | backend4you.ton: https://docs.ton.org/develop/data-formats/cell-boc (reply to 106136)

&rey: It is cell metadata. (reply to 106136)

Lucas | CryptoEngineer ✨: I faced this problem while following the TON tutorial. How can I fix this problem? (reply to 105887)

Zqy: Thanks (reply to 106139)

Zqy: thank you (reply to 106143)

cow: Hello

Chad: in solidity we use uniswap for swap , what is the alternate here in ton?

Андрей: dedust.io (reply to 106171)

ShanX: stonfi and dedust (reply to 106171)

WinK: Hey guys...help me out..  I'm using Ton Connect UI Provider to connect my wallet to my react application.  This is my actual telegram wallet addess: UQCq7ejgyjkFjiNqWJ4pDYsC1pu_v-SBylyB0KDPzdd2G_80  this is the address I'm getting on screen= 0:aaede8e0ca39058e236a589e290d8b02d69bbfbfe481ca5c81d0a0cfcdd7761b

Cube: Can someone help me  My goal is to identify the type of connected wallet. However, the resulting contract code from the tonconnect doesnt match the official one

Donato: Hi

Cosmomatrix: Hi, we are looking to reach out to contacts from ton foundation and ton x, any chance we can get connected with them? Representing stargate and layerzero here

Wick: Let me share my motive to learn funC and know about ton. My ultimate goal is to introduce web3 to as many people as I can. That's why I want to learn it and build mini apps and so continue to reach my goal. Where should I begin first?

Wick: Ton is highly scalable and fast so I decided to work on ton btw

Bcrypto: I have once developed the TON wallet integration using Ton Connect UI provider in telegram mini app and I am looking for a task now. And also I have deep understanding of blockchain technologies and my expertise in programming languages covers Javascript, C/C++, Solidity, Rust, Go. If anyone faces a trouble, don't hesitate to DM me.

Jonathan: Are there any wallets that currently support signData ?

&rey: I don't think so. (reply to 106226)

Rayan: Hi. How should i know that a transaction message is a simple native toncoin transfer message or not? what are the specifications for this kind of transaction? is it about opcodes?

nec306: hi

Rayan: @pcrafter  help please (reply to 106228)

&rey: Any message is a native TON transfer; the question is whether it does something else. Generally, if there is no opcode or opcode 0, nothing else is done. (reply to 106231)

M3hd_.: hello guys anyone know the pass-word?

M3hd_.: GM event password i mean

MRT: You should first detect whether the destination contract is a wallet contract. If it is, your transaction is a simple transfer. However, in the w5 version, we have extensions, and an internal transaction can contain anything. If it's not a wallet contract, you must deserialize the transaction, decode the body of each message, and check the opcodes. If the body contains a command, binary command, or encrypted message, it's still a simple transfer but with some additional message data. Otherwise, it may involve a contract operation. (reply to 106231)

Gijs: Can somebody tell my why after broadcasting a native TON transfer. It never gets propagated to the network? At this point it feels like a coin flip whether after submitting it will have been sent or not. (Using @ton/ton JS sdk and I’m polling for txid after submitting)

&rey: Well, there is no guarantee that any given external message will be included, so indeed some get lost. (reply to 106243)

Gijs: So what would be the timespan after it can be guaranteed to never be included? Are there maybe docs on the specific reason they never get inlcuded? (reply to 106245)

&rey: If wallet ext-message structure supports deadline, then once message won't be included after block with that deadline is generated. (reply to 106246)

sirius: I think that is impossible. (reply to 106081)

🤴King 🤴: "Hello everyone,Please help me.. I have a question about the TON blockchain. In this network, when multiple transactions arrive simultaneously, which one gets prioritized? What are the criteria, in order, for a transaction to be processed sooner for a specific wallet?"

Laisky: All messages will be sorted and processed in sequential (reply to 106316)

— 2024-09-18 —

• BraYaN •: hello  Is there a way to convert the mnemonic to address?

DeFi: They can afford better domains

OneWay: Anyone can help on this? (reply to 106058)

Laisky: Unlike other blockchains, TON determines addresses based on the contract code and initial data rather than the private key. (reply to 106333)

Zqy: Have any tools can make hex to fift code

u7: Hello, could I obtain the transaction hash through bochex, rather than the in_msg_hash?

Maestro 731: Yes, there are several ways to convert a mnemonic seed phrase to a wallet address. -The bip-utils library provides an implementation of BIP39, BIP32, BIP44, BIP49 and BIP84 for generating mnemonics, seeds, private/public keys and addresses for different cryptocurrencies. (in python) - The iancoleman.net BIP39 tool allows you to convert a mnemonic phrase into addresses and private keys for various cryptocurrencies. - You can use the bip39 and hdkey libraries in JavaScript to derive addresses from a mnemonic phrase. (in javascript) (reply to 106333)

MRT: https://github.com/mrtnetwork/mrtwallet                                                                                       The code has been updated with new features: Web3 support for the Ton blockchain Support for the Ton W5 wallet contract

Swapnil 🚀: Hey folks - what's the TAT to get listed on the Telegram Mini Apps center?

^_^: Hi, Nice to meet you, I'm a telegram mini app developer. Can we chat for our collaboration, if you don't mind? Thank you. (reply to 94078)

Chien 🇻🇳: Hi, I have a question. How can I change deploy wallet when using toncli to start and deploy project?

Maestro 731: Hello, sir! I'm Telegram Miniapp Developer. I wanna work with you. Pls DM me. (reply to 94078)

fu: does anybody knows the messages from server :lite server error, code 0: cannot apply external message to current state : Failed to unpack account state. it comes when i do both deploy active one address and transfer ton . and i did just as sourcecode of ton-utils-master in golang

Bcrypto: I am the one who is experienced in telegram mini app development with integrating with TON wallet using TON Wallet UI provider (reply to 94078)

Эльдар: common mistake is using Address from incompatible libraries. (reply to 106403)

Prince: I am planning to build dex on testnet for devs, any friends?

Token: hi, prince... long time no see you. let's do it! (reply to 106408)

Prince: 🤷‍♂️ (reply to 106410)

Prince: not interested, sorry (reply to 106414)

Abdulaziz: Whatahell is wrong with this guy (reply to 106405)

Prince: go to twa_dev for help (reply to 106417)

Abdulaziz: Bro just disappeared

Prince: Will imitate dedust and stonfi and gaspump (reply to 106409)

Token: good idea, I will help you. friend.after then we can run our own (reply to 106423)

Prince: any more guys who want to participate?

Wick: I have a question. does mini apps like notcoin etc also uses smart contract?

Prince: almost (reply to 106426)

Wick: I have a very good plan for creating mini apps like those but before that i must master funC

Prince: we can consult you (reply to 106432)

Wick: appreciated mate....

Prince: after complete that, then next goal is launchpad on testnet (reply to 106424)

Prince: we've already did on mainnet

Wick: (int number) storeNumber() impure {     set_data(         begin_cell()             .store_int(number, 32) ;; Store the integer number in 32 bits             .end_cell()     ); }    int getNum(){ int i = setNum().begin_parse()~load_int(64);  return i ; }    why does the first code accept parameters while the 2nd one returns a type?

Wick: yes

Prince: for contract, boy

Token: prince, we have to have a meeting. (reply to 106441)

Token: our team is waiting for you... pls join us

Prince: ok (reply to 106447)

Abdulaziz: And working with telegram api (reply to 106449)

Token: on mini app, we can do anything

Token: princedev00 did pump fun on mini app

Wick: understood

Abdulaziz: And if he wanna add monetisation with ton payments* (reply to 106457)

Token: depends on requirement

Prince: botson... what are you doing here? I join meeting and now waiting for you... (reply to 106462)

Wick: why we are supposed to read the rightmost bit here  if(number & 1){ return(); }

🤴King 🤴: Please help me.."Hello everyone, I have a question about the TON blockchain. In this network, when multiple transactions arrive simultaneously, which one gets prioritized? What are the criteria, in order, for a transaction to be processed sooner for a specific wallet?"

Andrii Ivaniv: How to check if some jetton has non-standard logic?  For example there is TEN jetton that have implemented jetton_master standard (tonviewer) and also jetton_wallet standart (tonviewer). But this token has some additional logic - it sets 10% tax for buy and sell.

Laisky: IMHO, There are only standard interfaces, but no standard implementation. (reply to 106472)

Andrii Ivaniv: So, there is no possible to check if jetton is honeypot for example? (reply to 106481)

Laisky: If the source code of the contract is available, it can be easily checked. (reply to 106483)

Laisky: answer by AI withing whitepapers:  1. Logical Time: The most likely factor is the logical creation time of the messages. Since messages from the same contract have strictly increasing logical creation times, this naturally establishes an order even for messages seemingly arriving simultaneously. 2. Message Hash: In case of a tie in logical time (extremely unlikely for internal messages within the same block), the message with the smaller hash could be prioritized, as seen in the monotonicity condition (2.2.5) for importing messages from neighboring shardchains. 3. Order of Arrival in OutMsgQueue: While not explicitly mentioned, it's conceivable that the order in which messages were added to the OutMsgQueue of their respective source shardchains could influence their processing order. This would imply maintaining some ordering within the OutMsgQueue, possibly based on arrival time or some other factor. 4. Validator Discretion: The document might leave some aspects of message ordering within a block to the validator's discretion, allowing for flexibility and potential optimizations. However, any such discretion must still adhere to the overall consistency conditions and guarantees of the blockchain. (reply to 106471)

DeletedAccount: Hi everyone, i'm from EVM. I try to lean Func, Can anyone give me advice on whether to use func or tact? Is there any example for master_chef in Ton? Thank you

x: hello, fam this is ton developer is anyone looking for a dve?

Kunal: Start with tact it is easier to get started. (reply to 106497)

Prince: sorry to hear that... my bad (reply to 106475)

Laisky: I recommand TACT, and here is a template repo https://github.com/Laisky/tact-utils (reply to 106497)

Wick: why tact?

Zqy: This link 404

Zqy: I want to use toncli fift. When I read installation.md, 唉，can't download this pre build

Magic: @philstag

Wick: which language is more suitable for creating games like notcoin? TACT or FunC?

Prince: full of bugs... (reply to 106524)

MZ: I use tonconnect/ui-react and getting an error like on the screen when I try to connect with Ton Keeper on Android.   It works perfect when I use iOS. Any ideas?

Zqy: This  link

MZ: Ok, the reason was bad url to the icon in the manifest (reply to 106527)

Granit /: Can you create token in TonNetwork with tax transaction for example  5% liquidity 5% buyback

Peng: hi ton team is your validator enginee recently changed or broke? i used ur offical docker image to spin up a ton node this is wat im getting ton-node        | [ 0][t 1][2024-09-18 12:32:50.675784745][Status.h:273][!validator-engine]     Unexpected Status [Error : 602 : duplicate port] in file /ton/validator-engine/validator-engine.cpp at line 170

FakeName: is it possible to make nft item metadata dynamic   as like storing marks of students ?

&rey: I don't think there is an official Docker image for TON? (reply to 106538)

&rey: Creating it is not worth it. (reply to 106537)

Peng: there is (reply to 106541)

Peng: ghcr.io/ton-blockchain/ton:v2024.08

Granit /: why (reply to 106542)

&rey: It tends to be so. That's like asking "why economy is acting as it is" — something may be explained, something cannot be explained but still happens. (reply to 106547)

Chad: import "@stdlib/deploy";  message UnStake {     index: Int; } message StakeData {     amount: Int; }  struct IndexStake {     m: map<Int,Stake> = emptyMap();//index,Stake }  struct Stake {     amount: Int;     endTime: Int; }  contract Staking with Deployable {      stakes: map<Address, IndexStake>;      receive(msg: UnStake) {         let existingStake: IndexStake = self.stakes.get(sender())!!;         existingStake.m.set(0, null);     }  }   UnStake not working its not delete the values why how to fix?

&rey: Are you aware that contract cannot store arbitrary amount of users, or any other data in cells? (reply to 106550)

&rey: Also, I do not understand economical sense of "staking".

Chad: i am learning ton using tact , i want to explore nested map with struct and i want to store my relevant data into map and then i want to remove that data from nested one (reply to 106552)

&rey: You need to set new value in the root map. (reply to 106558)

Chad: i just want to ask how to delete value from a map that have child struct that have map  receive(msg: UnStake) {         let existingStake: IndexStake = self.stakes.get(sender())!!;         existingStake.m.set(0, null);   } (reply to 106553)

Chad: but i need to remove child not root/parent map (reply to 106562)

Dawid Stach: Hi everyone, I'm trying to send USDT using node.js and the @ton/ton library. Can someone explain to me how it should look correctly? Here's my code that doesn't work  const jettonMasterAddress = Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy') // testnet USDT  const { publicKey, secretKey } = await mnemonicToPrivateKey(SEED_PHRASE); const wallet = WalletContractV4.create({ workchain: 0, publicKey }); const provider = client.provider(jettonMasterAddress, null); const seqno = await wallet.getSeqno(provider); await wallet.sendTransfer(provider, {   seqno,   secretKey,   messages: [     internal({       value: '1',       to: 'recipient_address',       body: 'Hello, world!',       bounce: false     })   ] });

Prince: it's different to send ton (reply to 106567)

Zqy: Who can build fift

Daniel: https://docs.ton.org/develop/dapps/asset-processing/jettons#send-jettons-with-comment (reply to 106567)

Zqy: how to build .fift

Abdulaziz: With hands (reply to 106575)

Zqy: all right, ok, fine, god (reply to 106576)

Farel: из-за чего может валиться Exit code: 10, если я даже не работаю с hash map?

&rey: Contract may throw it manually. (reply to 106579)

Рома: Hi all. I wrote an indexer on go to keep track of the events that the contract emits. But the indexer catches only internal msg. If I understand correctly, the event data is in body, but in external out msg. How is it possible on go to track these invents?  receive("transfer") {         // handle transfer here         // ...         // emit log that the transfer happened         emit(TransferEvent{amount: ton("1.25"), recipient: sender()}.toCell());     }

.: Hi,  How to send USDT using FunC ? I have 10 USDT on address of smart contract and I need to send them to my wallet

Амир: If there's no predefined logic to send jettons - no way (reply to 106608)

.: I don't understand you, here's an example, I call a smart contract and I see Не понял вас, вот тут как пример, вызываю смарт контракт и вижу (reply to 106609)

Ma><im:     MustStoreUInt(jettonTransferOperation, 32).     MustStoreUInt(queryID, 64).     MustStoreCoins(offerJettonAmount).     MustStoreAddr(address.MustParseAddr(jettonDedustVault)).     MustStoreAddr(address.MustParseAddr(myWalletAddress)).     MustStoreBoolBit(false).     MustStoreCoins(forwardAmount).     MustStoreBoolBit(true).     MustStoreRef(forwardPayload).  please tell me what I'm doing wrong when building a message  to jetton_wallet_governed to transfer jettons  receive exit code 9 Cell underflow

Ds: Hello guys, i’m trying to find some working examples of jetton staking smart contracts (func). Can anyone help please?

Prince: /me

User<6753518952>: Is there anyone looking for developer?

SunG: why do you use func? You can use tact lang and it is very simple for developers (reply to 106614)

Ds: I don’t know it yet, unfortunately. But time is limited to learn now. That’s why func (reply to 106618)

SunG: how long have you used func

Prince: with tact, can you build dex kind of dedust or stonfi? (reply to 106618)

SunG: yes foc

Prince: any opensource?

SunG: do you want it?

Prince: you are welcome. I am Func dev and I alreayd did it. bro... just ask you can do it with tact

Prince: we are planning to build dex on testnet for devs

SunG: good, I think we can collaborate (reply to 106628)

Baldwin: how to burn lp token on ton?

Milad: Hi everyone. Can i update the code of highload-v2 to highload-v3 on deployed addresses on Ton?  Is it possible? I have read an article about updating codes on Ton.

&rey: It is possible only if contract code supports that. In particular, highload-v2 does not. (reply to 106636)

.: Hi,  How to send USDT or any other Jetton from address of my smart contract  using FunC ? I have 10 USDT on address of smart contract and I need to send them to my wallet

&rey: 1. contract needs to calculate jetton wallet (https://gist.github.com/ProgramCrafter/53fc3a4846397ee5f3f3b25ca3356ab5) 2. contract needs to send transfer order to its jetton wallet (reply to 106639)

&rey: Smart contracts cannot be modified on whim, of course; if you have sent 10 USDT to a contract which does not support returning them and does not support updating, then they are LOCKED FOREVER.

Fanny: I need a script that can perform the following tasks sequentially   1. Mint a new token.   2. Add liquidity for the newly minted token on DeDust.io.   3. Execute a purchase of the token immediately after the liquidity has been added, ensuring that the purchase is the first one on DeDust.io.  The budget is $300. It is not prepaid. Ping me if you are interested.

&rey: that's probably impossible. (reply to 106648)

Prince: He is insulting us... (reply to 106648)

Svαtoωλ‎: Any instructions, how to with script collect rewards in dedust?

Whistle: How great would it be if we could have pump.fun in TON too.

Алина: Does the choice of liteserver affect how quickly my transactions get into the blockchain?

Donato: HI

Алина: @pcrafter could you please elaborate?

skilla23: Hi

— 2024-09-19 —

Cryptskii: hi

Cryptskii: would anyone like to see zkp on TON?

Cryptskii: and I mean actually on ton not like the one project that actually uses Eth to verify transaction not TON

Prince: we have gaspump... (reply to 106652)

Albert: Hi. Any TON developers here, i need TOn developer PM for details.

fu: is there any official developer .

Vic: Does anyone know why no matter whether the wallet address starts with kq and 0q when transferring money, the kq wallet address will start with 0q ?

Haint: k means bounceable, 0 means non-bounceable (reply to 106717)

Vic: thank u (reply to 106718)

User<6783523151>: I'm seeking a skilled Blockchain Developer proficient in smart contract and dApp development across multiple platforms including Solana, Ethereum, and TON.  The ideal candidate possesses strong full-stack development skills, with expertise in React, Next.js, web3, Tailwind CSS, and Sass.  Key responsibilities include: Developing and deploying smart contracts Creating and maintaining dApps Contributing to full-stack development Collaborating on blockchain solutions  Required skills: Smart contract and dApp development expertise Full-stack development and integration proficiency Experience with multiple blockchain platforms Strong problem-solving skills  If you're passionate about blockchain technology and meet these qualifications, I'd love to hear from you.

User<7464188086>: here (reply to 106724)

Chien 🇻🇳: Goodmorning guys, I have a question for Toncli. How can I change my deploy wallet when using project generate by toncli? I dont want use default wallet of project. Thank u.

Trung đẹp trai: You can try this  toncli deploy -n mainnet --wallet <your_custom_wallet_address> (reply to 106733)

Chien 🇻🇳: oh, no need seedpharse or private key? (reply to 106734)

Trung đẹp trai: Need bro.  Input it when prompted by Toncli during the deployment process. (reply to 106735)

Chien 🇻🇳: Thank u guys. <3

Buggy: Hi guys, I'm using HighloadWalletV3 to transfer multiple txs, and it does work well, with manual input for queryId (manually inject query id one by one). Question is, is there any way to get this parameter on-chain or via any api? Since I don't want to save this to DB and query it when transferring. Thanks for any help.

Lucas | CryptoEngineer ✨: Hi, How are you? I am a newbie on Ton ecosystem. Just before I deployed my own smart contract first and sent transaction. But while looking the ton scan, I have some curious things.  Anyone let me know what is the meaning of such icons on ton scan, please?

Dmitry | backend4you.ton: click this icon - you'll get into tx page and can see detailed text/reason (reply to 106745)

Kryptonite: can someone help me with this error: LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: cannot find block (0,a63de517d3c9e300) lt=21814804000001: lt not in db

Filip: Hi. Has anyone managed to get a lite server up and running on OVH? Mine got blocked for DDoS :)

TKAINU: How it works, thank

z: Hi fam, I wonder what does this means, it seemed very basic ..  0:7c3b4249fa1a9e0c0a830b5386eb33d805fa55f90cf03de77492971b20b5ec98

C.: Do we have an indexer like subgraph in tonchain?

charlie: Hi could u explain why the master block between 22953580 and 22953581 it lost shard block 0:6000000000000000:24624543. here is official link https://testnet.tonscan.org/block/-1:8000000000000000:22953580

Andrey: https://docs.ton.org/develop/blockchain/sharding-lifecycle#sharding-example (reply to 106782)

charlie: ic @tvorogme how can I know which master block the shard block belong to?

charlie: I just know the min mc block

charlie: and I look through last 100 mc block. I can not find the shard block info 0:6000000000000000:24624543.

Fong 🇻🇳: Have you tried with docker image v2024.09? (reply to 106538)

tina | Seekers Alliance: our team is currently building a game on TON. how do we go about launching it live?   Are there people we can talk to?

Mat: Hi

Mat: https://tonviewer.com/UQCBcLfo7OvsKSVXjqnKY_XpuOEIQtb-acHnk5hS7j9ShgDo

Wick: how can I install ton cli in vs code?

TON Bounty Bridge: ​Vue TON TMA template  🏷 Developer Tool  Summary:Create a template for Vue to create a TMA that integrates TON  Created by thebatclaudio

desys: hello like a wallet testnet get more TON? and it takes a very long time to receive 5 TON each time (

Kapil: Why do we use the flood in the multisign contract

Anastasiia: hi i am wondering whether we are able to verify ton transaction signatures like ton proof for wallet connection?

Kapil: In the pack owner info function we are passing two values public key and flood. What does the flood signifies

Ronald: hi  BlockIdExt fullblock = tonlib.lookupBlock(40494125L,-1,-9223372036854775808L,0);  When I use Java Tonlib to execute the above code, no matter what seqno is filled in, I always get the same error:  {"@type":"error","code":500,"message":"INTERNAL: get last block failed LITE_SERVER_NOTREADY: cannot load proof link for (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF : not in db(during last block synchronization)","@extra":"7ce1f5d4-4d84-4ff7-9e8d-fe6a23010261"}

sirius: Hello. Chelsea. Please DM. I can help you (reply to 94078)

Володимир: Hi, can you tell me how to interact with contracts from a site written in react?

Andrew: hi guys, can u help me with one question, how i can get wallet ton balance ? im trying to use tonapi io

Andrew: like /v2/accounts/{account_id}

Andrew: but i get:  {   address: ‘address’,   balance: 0,   last_activity: 0,   status: 'nonexist',   get_methods: [],   is_wallet: false }

Andrew: and i trying connect my wallet, with ton balance

Pavel: hi, I am a FunC Smart Contract Developer, I am currently looking for a job, I have a lot of experience in developing high-load systems. I will be glad to cooperate!

User<6303208636>: Please message me (reply to 106527)

User<6303208636>: Message me (reply to 106840)

Magomed: what contracts are used under the hood here?

Magomed: multisig ton org

Tom: Hey guys, do you guys have any experience of transfering from "ton" to "@ton/ton" sdk?

Tom: I'm trying to build Jetton Onchain Metadata and it gives me headache

Forbes: maybe i can help you (reply to 106854)

Tom: Can you take a look at this please? github/ton-blockchain/minter/blob/main/src/lib/jetton-minter.ts#L53  (sorry, unable to send links) (reply to 106857)

Tom: I tried to convert the function to @ton/ton in hours. It almost works.

Tom: The last testcase is failing

Tom: Expected value comes from the "ton" version. Received value is my implementation of "@ton/ton"

Tom: If possible, please propose your implementation in "@ton/ton". I really appreciate your help sir.

Tom: (Anw, the cell hash is the same)

kevin: Got one like that but it is ston.fi version (reply to 106648)

Ebube Emmaunel: Hello 👋

&rey: You should not compare BOCs, or at least you need to set same flags (checksum, index). (reply to 106863)

&rey: Comparing hashes is indeed the valid way. (reply to 106867)

David: does anyone use react query on mini app?

David: why my query fetches data but the data is still old though I saw api call and set stale time about 30s

TON Bounty Bridge: ​STON.FI Pool Controller Bot with Pyrogram & new STON.FI Data Collection Module  🏷 Developer Tool  Summary:The bot provides the following features:  Created by seriybeliy11

RUN: Hey guys. Is hamster deployed on ton chain?

Дмитрий: Could you please help me? I’m trying to pass verification with Wallet, and when I chose the category “digital goods and games,” I immediately got banned and was told to use Telegram Stars instead.   1. What will happen if I choose a category that implies physical goods payment? Will I pass manual moderation, or is it already not an option?  2. Does the type of application affect moderation? Is it a mini-app or a regular website? I passed moderation when it was a mini-app, but now it’s back to being a website. 3. Why does the bot @mobile sell through Wallet even though it’s also a digital good?

He-he: Hello guys, does anyone know how to retrieve a String from a Slice. I have a forwarded payload from a jetton that contains a textual message, but that Forwarded payload is a Slice. i need that textual message, not sure how to properly get it and later on use in my logic

Tom: I did set the same parameters for both of them. I guess the problem came from my dictionary code (reply to 106877)

Tom: As you can see in my testcases, they are fine until object with multiple props comes (reply to 106863)

&rey: I see that you pass zero arguments to .toBoc(), using default values instead. (reply to 106899)

Tom: That's for the @ton/ton part.

Tom: For "ton", I set it to idx = false, crc = true

Daniel: Admins, someone can ask me? (reply to 106081)

Ali: Hi there I want to build SDK for a new programming language on TVM What way do you suggest? From what level is it possible to add a programming language in TVM?

Ali: Or where can I find an answer to this question?

Ali: @opensource

Small: Can a ton contract initiate a bounced message?

Tim: Depends on what you mean by that. Only option to set bounced flag is to throw error (reply to 106926)

.: Hi, Can anyone help me ? I used https://gist.github.com/ProgramCrafter/53fc3a4846397ee5f3f3b25ca3356ab5 And I have  self.jetton_wallet = calcMyJettonWallet(jetton_master, master_code, master_data);  Where do I need to get the master code (cell) and master data (cell)?

&rey: Take jetton master address, open it in an explorer like Tonscan or Tonviewer, go to tab with code/data cells. There will be base64 BOCs which can be used. (reply to 106928)

.: Thanks, But How need I import cell ? Like code in variable ? (reply to 106929)

Small: this is my code () send_message_to_address(slice addr) impure {     var message = begin_cell()         .store_uint(0x14, 6)         .store_slice(addr)         .store_coins(0)         .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)         .store_uint(0x51937cb2, 32)         .store_uint(0, 64)         .store_coins(100)         .end_cell();      send_raw_message(message, 64); } but in test,the message is been sent with () inMessageBounced: false,why?i have set the flag to ture. (reply to 106927)

Tim: because only way to set bounced bit is to THROW error.

Small: Can I proactively send a bounced message to target contract from my contract if the target contract has not proactively initiated a message to my contract? (reply to 106933)

&rey: cell get_jetton_master_code() asm   """     B"<HEX BOC>" B>boc PUSHREF   """; if I remember correctly. (reply to 106930)

Tim: no, you can only reply with bounce (reply to 106935)

NFTPRINCE: Hello 👋

Small: When a bounced message is sent, is the body of the message the one received in the first place?

Small: and can the bounced message also be bounceable?

Mahi: Hi guys , If you're an owner of a mini app / Tap & Earn bot and you want to reach your app to millions of audience contact me i can help you 😊

User<7468599247>: I'm proficient in Figma design, front-end development, bot and mini app development, and creating smart contracts for various blockchain environments. If you or anyone you know requires these services, please contact me directly.

L2L2🎒: looking for a skilled FE-BE dev for a miniapp project DM

tina | Seekers Alliance: thanks! (reply to 106907)

Suliman: hi

Suliman: How are you all

FakeName: export function useNftCollection() {     const client = useTonClient();     const [contractData, setContractData] = useState<null | {         collection_content: Cell;         next_item_index: number;         owner: Address;     }>();      const [balance, setBalance] = useState<number | null>(0);      const nftCollection = useAsyncInitialize(async () => {         if (!client) return;          const contract = NftCollection.fromAddress(Address.parse('EQDfkb9aldpAIkc37peVwDGCquby5dVhilZ70LUZElo4druo'));         return await client.open(contract);     }, [client]);     Property 'open' does not exist on type '{ client: TonClient | undefined; }'.ts(2339) any   can anyone help me here ?

Dog🐤Gra-Gra: hi all

Alex: Could somebody help me please, how I can get source address (sender address) for specific transaction?  I use the TonClient from @ton/ton.   Example: https://tonviewer.com/transaction/7ce372e3eed6fa7063c953a5bcd2111b5fc21b61c074ac2a145d80aea4ca0721  How I can get sender address like in Event overwiew tab? (UQDSnMVXPUYCCh9ZxWsxZydWkwu-XJVag_RZW5o_vOQZEm6g)

Ezikwa: Hello good to be here

&rey: It can't be. As whitepaper explains, "bounceable" flag in bounced message is automatically reset. (reply to 106941)

&rey: Original body is truncated to 256 bits and 0 refs, then 0xFFFFFFFF is prepended. (reply to 106940)

César: Telegram mini apps dont support vibration? I want to do the mobile vibrate when user click one button but its not working. Any docs confirm dont support it or...?

User<7464188086>: will support vibration. but it will work only real mobile. not work emulator and another virtual devices. (reply to 106998)

César: I know

User<7464188086>: ? (reply to 106998)

César: You know how implement

User<7464188086>: yeah. I know and I have already implemented it in telegram mini app/

Ade (Ø,G): Greetings to everyone

Blocketize: Hi

Blocketize: I want to get transaction when I receive USDT. How can I do this?

Olisaa: You check your history in your selected exchange you used to send or receive crypto (reply to 107011)

Blocketize: Only transfer, not swap

User<6753518952>: I have extensive experience working with Jetton smart contracts and handling complex data structures like Slices. In particular, I’ve successfully retrieved and processed forwarded payloads containing textual messages, allowing for seamless integration into smart contract logic. My deep understanding of Jetton token standards and payload parsing ensures that I can efficiently handle these kinds of tasks, making me an ideal candidate to help with your project. (reply to 106897)

Амир: Are you sure? (reply to 107014)

Prince: looks like he is really really expert... (reply to 107014)

User<6753518952>: yeah sure. (reply to 107043)

User<6753518952>: Thank you. (reply to 107044)

NFTPRINCE: Would love to connect with founders who are building

Mahi: Hi guys , If you're an owner of a mini app / Tap & Earn bot and you want to reach your app to millions of audience contact me i can help you 😊

Mr. Cardholder: Ты рак   о.

Mr. Cardholder: /нт

User<7464188086>: who? (reply to 107058)

&: Why don't you try with tonapi.io apis? You can get tx details from this API. even with sender address. (reply to 106972)

&: Track new txs via SSE from tonapi.io (reply to 107013)

— 2024-09-20 —

User<6724512156>: hi im looking to build on ton and move my liquididty from my private miners to a net work this seems to be the only one well with any options haha

User<6724512156>: if you have any suggestions on bridge frameworks that work well with BTC network please let me know

User<7464188086>: WBTC is an ERC-20 token that represents Bitcoin on the Ethereum blockchain. You can use it to bridge Bitcoin liquidity to other networks. (reply to 107077)

Assigned|| Drops💧: If The Devs or any Member of $Major Team can see this.  A payment of 1000 stars is requested to get a daily rating of 50,000 Major Points.  I subscribed to that since August 28 2024 but couldn’t claim as promised and tried to reach the Team to no avail.  So my question is, is it supposed to be 1000 stars payment daily for 50,000 MP or a one time payment of 1000 stars for 50,000 daily?  That line of information seems a little unclear and I would suggest clarity for me and other users who participate diligently.  I have screenshots.

Assigned|| Drops💧: Just to establish, I had done “The TON Transactions” and tried to claim too soon before the warning message was implemented and still got credited so as for integrity, I’m not insinuating anything negative.

User<6724512156>: so I bought a 2 different node a while back for testing my mining algs. I was working on at the time and well it was good except i bought the node and wallets from *wallet builders ..... garbage they screwed up my vault address and no matter how I tried explain I watched the error happen during set up they wouldn't fix it . so I'm having issues connecting to any bridge because the programs guide lines state my address is to long they maybe it a WBTC1 address ugh any suggestions ? (reply to 107078)

User<6724512156>: i even paid for there wallet app after to try and resolve the problem BUT IT WAS LITTERALLY JUST ALITTLE NODE THATWAS EDITED NOT TO ALLOW NEW SEED CREATION

User<7464188086>: Bitcoin addresses typically range from 26 to 35 characters. If your address exceeds this, it might not be a standard Bitcoin address. (reply to 107082)

User<7464188086>: or another address.

User<6724512156>: its got a legit hash and its registered on the block i think the lessed 1 off the off the and and added a let it the front but it on meempool

User<6724512156>: sorry i have a cast on my hand my ai messes up sometimes

User<7464188086>: I think you might create new wallet.

User<6724512156>: oh 1000% when the node was setting up i watched it blip it tells me there an en error with me seed but the company wont help so im moving the coins ive made

User<7464188086>: what? company wont help?

User<6724512156>: wallet builders the company i purcsed my nodes from origonally

User<6724512156>: i need to alter a btc wallet for permissions

User<6724512156>: the seed error is cause the iimport child seeds to error also

User<7464188086>: I think you can create custom solution using libraries like 'bitcoinjs-lib' or 'bip32' to manage seed imports and permissions programmatically.

User<6724512156>: I've been looking for a the right one to use that i can adapt to all network's i wrote a bridging contract but i don't know front end to set up up i was planning on building aggregators and payment handlers in 1 framework and see how my agent took to running the processing the test went good I cut ties with phantom so looking for  new home and front end dev haha

User<7464188086>: okay. as a front-end developer, I am interested in this. (reply to 107100)

charlie: team, could u help check if this workchain block does not sync to master chain, does it mean that this block will not sync to master workchain forever? https://testnet.tonviewer.com/block/(0,6000000000000000,24624543)

Vic: What is the different between tonviewer and tonscan ? Sometimes when checking records, I can't find them on tonscan.

Kapil: How to generate the code from the build file

Alex: Hello, I am having an issue with the assets-cli, when I deploy a jetton on testnet, none of the fields I set are being deployed with the contract. Eg name description, image url etc

Laisky: you may consider follow this sample https://github.com/Laisky/tact-utils (reply to 107132)

MarcassoX: Hi

Kapil: const NftItemCodeCell = Cell.fromBase64(   "te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu" );                                                                                                                            How to get the nftitemCodeCell

Tom: Guys, what's the best way to deploy contract with tonconnect?

Tanya: maybe you have to use @tonconnect/sdk module (reply to 107154)

Tom: So If I got  const [tonConnectUI] = useTonConnectUI();  Should I include the wrapper from blueprint and interact with them with tonConnectUI?

Tanya: do you use React.js as a frotnend? (reply to 107157)

Tom: Yes I do (reply to 107159)

Tanya: okay. (reply to 107166)

samurai_10x (Ø,G): Gm guys, I want to get started building on ton. I have solidity and react knowledge. Can someone please share materials that helps me learn how to build on ton with this tools

Prince: if you have understand of web3 and contract, not difficult to learn ton with yourself

Prince: Link is not allowed here

Prince: I can share presale contract as opensource

Prince: shit

Prince: anyway it will be my last work

Tanya: be careful (reply to 107177)

Prince: you can participate on us building dex on testnet for devs here

Prince: for that , you have to know Func

Prince: I have to say bye bye...

samurai_10x (Ø,G): Thanks for the tips bro...  Is Func a totally different language? (reply to 107181)

Prince: not at all (reply to 107186)

Prince: ofc for the first time, I couldn't understand but now become intermediate

samurai_10x (Ø,G): aiit I'll check it out

&rey: TON is totally different. Usually, you're better off treating it as another kind of thing, not as EVM-compatible blockchains. (reply to 107186)

samurai_10x (Ø,G): oh I see. Ty ser (reply to 107205)

peilipu: hi everyone, why this transaction marked as SUSPICIOUS transaction at tonviewer ? https://tonviewer.com/transaction/58f8555294aca89b5bf63c57d19e6fde745f26253de81f33f9be4714c85b11a2

lv: Skip Reason: cskip_no_gas

&rey: according to Tonapi's internal algorithms... (reply to 107209)

peilipu: it is invalid transaction or scam transaction ? (reply to 107212)

&rey: Tonviewer marks it as potentially scam. Though, since comment is encrypted, only counterparties might know it. (reply to 107215)

Buggy: Hi everyone, Im using highload wallet to transfer multiple txs to users at once. The problem is I'm not sure about failed transactions. As my understanding, if I send 10 txs, lets say 2 of them failed, 8 txs left will still be executed as it should right? To conclude, no matter if some of tx send with are failed, the rest msg will still go on and executable right?

&rey: Once transaction on highload wallet is complete (funds being successfully sent to each wallet), those 10 transaction subtrees are independent. (reply to 107219)

Buggy: Thanks your ans sir (reply to 107220)

Оля: Hi, there is a problem when verifying a signature using ECRECOVER.  There is a flaky test that kicks out exitCode: 5   Signature verification method: () check_signature(   slice signature,   slice verifying_pubkey ) impure inline {   int sig_v = signature~load_int(8);   int sig_r = signature~load_int(256);   int sig_s = signature~load_int(256);          int verifying_x = verifying_pubkey~load_int(256);   int verifying_y = verifying_pubkey~load_int(256);   int hash = cell_hash(begin_cell().store_uint(123, 128).end_cell());            (_ , int x, int y, int res) = ecdsa_recover(hash, sig_v, sig_r, sig_s);    throw_unless(error::invalid_signature, (x == verifying_x) & (y == verifying_y) & res); }  signature generation:     import { ec as EC } from 'elliptic';      const ec = new EC('secp256k1');     let verifyingAddress = ec.genKeyPair();      const messageHash = beginCell().storeUint(123, 128).endCell().hash();     const secpSig = verifyingAddress.sign(messageHash, 'hex');      const signature = Buffer.concat([         Buffer.from([secpSig.recoveryParam]),         secpSig.r.toBuffer('be', 32),         secpSig.s.toBuffer('be', 32),     ]); And it works once in a while - the check is successful, but mostly exitCode: 5.  Maybe I'm not properly forming the signature in the tests?

Aleksandr: is it possible to sign a message or data using a ton wallet as it is implemented in evm wallets?

User<6753518952>: yeah sure. (reply to 107235)

Ashkan: Does anyone have the wallet_code for the Catizen smart contract wallet with a length of 92?

Sword: hi everybody  how to swap from ton to jetton on testnet

Prince: no dex on testnet (reply to 107269)

Prince: that is why We trying to build contract on testnet

Sword: but we can use stonfi dex deployed on testnet

Sword: is it impossible?

Prince: then use it. ;)

Prince: idk about it

Sword: but it said that have to use pTon to swap ton and jetton

NFTPRINCE: What are you guys building

Prince: dex on testnet for devs

NFTPRINCE: Alright cool (reply to 107278)

Sword: @Prince  so you mean it is not available to swap ton and jetton on testnet?

Prince: 🤷‍♂️

Sword: you are expert, I am starter, plz

Prince: I am not expert

Prince: just only know about Func, contract

Prince: Unlike solana, not enough all on Ton testnet

Sword: I see... I will try and tell you if I find how to manage

Prince: I will share if we complete dex on testnet

Sword: I have developed several solana projects

.: Hi, is it possible to change a deployed smart contract on TON on Tact (it's important, I have resolved the problem with code but on FunC)?

Prince: what do you mean? (reply to 107294)

Prince: you have contract, anyway?

.: https://answers.ton.org/question/1533945080165961728/is-it-possible-to-change-a-deployed-smart-contract-on-ton this code but on Tact is possible  ? (reply to 107295)

Prince: not sure

Prince: That is why we recommend Func

Prince: beginners can use Tact

&rey: Doesn't connecting testnet wallet to Dedust work? (reply to 107269)

Prince: ofc not (reply to 107304)

Prince: or am I missing something?

Prince: it deployed on mainnet and how can we?

Serhii: Hi, maybe someone know how to start develop on TON blockchain?  i want to try create and deploy ton contract for test, but don't know where to start

Serhii: maybe someone know useful tutorials and utilites?

Prince: there is only one ton doc

Prince: docs.ton .org

Serhii: got it

User<7122792395>: Need vue.js developer

User<7464188086>: here (reply to 107325)

mrdw: ton connect died?

mrdw: same shit with tonkeeper (reply to 107327)

Jad 5: Hey can you help  How to integrate telegram stars payment from an app (reply to 73608)

Laisky: Here is a template https://github.com/Laisky/tact-utils (reply to 107319)

— 2024-09-21 —

NFTPRINCE: Yo I want to connect with devs

Akachi: Here (reply to 107372)

Frank C 🆓: Can anybody help me, I'm a dev that created a TON bot and trying to figure out how to get paid from Stars getting spent in my game. the FAQ says to withdraw stars in TON from Fragment. How do I connect my bot to Fragment?

SAIVO SUPPORT: I need to implement a Jetton (token) transfer in a Dart Flutter application. I am using the tonutils package, but I am facing difficulties in creating and sending a Jetton transfer transaction.  How can I correctly create a Jetton transfer? Which methods or classes should I use to send the transaction? Thank you for your help!

NFTPRINCE: Let’s connect guys I’m nftpriest_1 on x

Harry: Hello? Can i custom modal connect UI of @tonconnect/ui-react package to show only TelegramWallet and TonKeeper?

User<7483137682>: Sure, it is possible (reply to 107447)

Harry: really? i try modify walletsListConfiguration but not working? can you give me an example, please (reply to 107450)

User<7483137682>: you would need to configure the wallet list in the walletsList parameter when initializing the TonConnect UI (reply to 107451)

User<7536225125>: Why I can not conec my Walet in telegram?

Harry: I'm currently using the @tonconnect/ui-react package. To fully configure it, do I need to install @tonconnect/sdk as well, or can I manage with just the UI package? (reply to 107452)

&rey: Why? (reply to 107447)

User<7483137682>: if you are using the @tonconnect/ui-react package, you dont need to install the @tonconnect/sdk. The @tonconnect/ui-react package already wraps the functionality of @tonconnect/sdk, so you can manage your wallet connection entirely through the UI package. (reply to 107456)

Harry: Can you give me an example, please? I still can't find that documentation guide (reply to 107458)

Tom: I'm writing a custom sender for tonconnectUI to satisfy sender of @ton/core. But unable to specify second message

User<7483137682>: Sure, I cant share some link in here (reply to 107460)

Harry: i already dm u (reply to 107464)

User<7483137682>: you can send me (reply to 107465)

TheOyster: Hey , does anyone now how we can query balances of the new W5 wallet types ?   I have a test of a test wallet and just want to query the address and balances.

TheOyster: But I cannot find any useful information / simple examples.

Alver: Hello, somebody has a link where i can see explanation how to use tuple, and if they can be stored/read to/from a cell?

Eren: Where should I start making my own game?

&rey: They cannot be stored/read directly. Some examples on working with tuples are in https://docs.ton.org/develop/func/cookbook#how-to-iterate-tuples-in-both-directions. (reply to 107477)

Wasiq: Hello! Small question what do you guys use more FunC or tact ? I'm confused as ik C programming language but don't know if I should go with tact or FunC

&rey: Tact attempts to mask TON concepts, confusing developers (in my opinion). So I go with FunC. (reply to 107484)

Wasiq: Thank You as I know C i think FunC will be better for me.. I don't have much experience in JS and TS so.. (reply to 107485)

M. Aldi: Hello, why I cant see module v4r2 in @ton/ton npm?

末: hi

Tom: Guys, anyone working with Jetton and Blueprint template? I couldn't get sendDeploy to both deploy and mint initialAmount

SAIVO SUPPORT: Future<void> transferJetton(Jetton jetton, String toAddress, BigInt amount) async {   if (toAddress.isEmpty || amount <= BigInt.zero) {     ScaffoldMessenger.of(context).showSnackBar(       SnackBar(content: Text('Invalid address or amount. Please check your input.')),     );     return;   }    setState(() {     isLoading = true; // Yuklanishni boshlash   });    try {     // Tranzaktsiya parametrlarini diagnostika qilish uchun konsolda chop qilish     print('Tranzaktsiya Parametrlari:');     print({       'sender': jetton.walletAddress,       'recipient': toAddress,       'jetton_address': jetton.jettonAddress,       'amount': amount.toString(),     });      // Tranzaktsiyani amalga oshirish uchun SDK metodini chaqirish     final transaction = await connector.sendTransaction({       'sender': jetton.walletAddress,       'recipient': toAddress,       'jetton_address': jetton.jettonAddress,       'amount': amount.toString(),     });      // Tranzaktsiya natijasini chop qilish     print('Tranzaktsiya natijasi:');     print(transaction);      if (transaction.success) {       ScaffoldMessenger.of(context).showSnackBar(         SnackBar(content: Text('Transfer successful!')),       );     } else {       ScaffoldMessenger.of(context).showSnackBar(         SnackBar(content: Text('Transfer failed: ${transaction.error}')),       );     }   } catch (e) {     // Xatolik haqida batafsil ma'lumotni konsolga chop qilish     print('Error during transfer: ${e.toString()}');     ScaffoldMessenger.of(context).showSnackBar(       SnackBar(content: Text('Error during transfer: ${e.toString()}')),     );   } finally {     setState(() {       isLoading = false; // Yuklanishni tugatish     });   } }   Problem log: I/flutter (13286): Transaction data: I/flutter (13286): {sender: 0:a92a5bb8a661c46e521cb5669a0ab7033d8dad6ade9adde47a65cd1d1173feb3, recipient: 0:189358aad3b46ae0a386de1bcb4bdcc7ae8adb12aa57c496ea5dc133736ea12e, jetton_address: 0:2f956143c461769579baef2e32cc2d7bc18283f40d20bb03e432cd603ac33ffc, amount: 1} I/flutter (13286): Ошибка во время перевода: [TON_CONNECT_SDK_ERROR]: null

SAIVO SUPPORT: How can I solve this problem? (reply to 107527)

User<6303208636>: Message me

Wick: https://github.com/romanovichim/TonFunClessons_Eng/blob/main/README.md  is this a good place to learn funC?

Mehdi: does anyone have problem interacting with nodes?

Mehdi: i faced several 500 errors on tx broadcasts. but txs were submitted.

Wick: is TACT lang good enough to write smart contract ( logics for rewarding users ) for developing games like notcoin?

Alver: i want to receive an array-like of int so im looking for any example on how to accomplish it (reply to 107482)

Wick: can someone please tell me? which one will be a better choice? (reply to 107544)

&rey: FunC will be more user-friendly in terms of fees. (reply to 107549)

Wick: so it is only a matter of fees?  I have a question.   Can I learn TACT, develop on it and then ask a funC developer to edit it accordingly?

Wick: btw appreciated you took out some seconds, mate

Prince: why need it? instead of develop TACT, you just let them know about your idea then we will build it with Func (reply to 107551)

&rey: Tact also has a few unsupported items which can be done in FunC. (reply to 107551)

Prince: pls Tell other people know about it (reply to 107561)

Wick: its not about the idea, it is about contribution mate. I want to contribute to the project heavily because it is ofc mine so

Prince: They just misunderstand the difference between Tact and Func is just fee problem

&rey: At the moment, thing missing in Tact is new hash primitives. (reply to 107562)

&rey: Recently, there was no iteration over maps.

Prince: people cant understand. more user-friendly, pls? (reply to 107565)

Prince: fee is serious problem on blockchain (reply to 107551)

Wick: yes you are right and since it is common everywhere I am deciding to work on TACT now (reply to 107570)

Wick: I have been participating in different tg mini games which reward users and etc.. I have closely monitored them and I feel ready to make my own  tg mini game.   Since, I need a team for it, I decided to join this channel and will be looking forward to network with good developers 😁

User<7464188086>: okay. I have interested in this. Also I hope that. (reply to 107573)

Prince: can I see your github? (reply to 107574)

Wick: sure but first I need to go through all the concepts required to do it. I will try my best to share my daily achievements. (reply to 107574)

&rey: Please don't attempt to network with devs here, it is out of scope of the chat, and as it's about mini apps which have increased in quantity the moderation will be strict. Use @tonhunt instead. (reply to 107573)

Prince: ya, agree, here almost devs only for work, not consulting... (reply to 107579)

Wick: ok

Prince: I don't know why they are here... not go to @tonhunt

Prince: always DM and scammed and cry here...

Matin: https://docs.ton.org/develop/data-formats/cell-boc according to this link, about the formula floor(b / 8) + ceil (b / 8):  This descriptor represents the length of the full 4-bit groups of the Cell data (but at least 1 if it isn’t empty) I don't understand the meaning behind "full 4-bit groups". Is a partial 4 bit group considered a full group too? substituting b=9 results in 3 (counting the remaining 1 bit as another group) but substituting b=14 also results in 3 and doesn't account for the 2 remaining bits!

Jenya: const cells = Cell.fromBoc(Buffer.from(boc, 'hex')) const tx = loadTransaction(cells[0].beginParse()) console.log(tx) boc from mempool  Error: Invalid data

Saman: Hi  I participated in the ton blockchain course and finally it finished.  When I receive SBT nft?

Jessica: Hello, can someone help me? I need to convert a public key from the TON network from the format 0:905bd2437fe5b498e37fca33cb01ba5d2af2b8f4c33a459124f22b78e573b8e4 to the readable format EQCQW9JDf-W0mON_yjPLAbpdKvK49MM6RZEk8it45XO45ECC. Thank you in advance!"

&rey: 1. Neither is public key, those are contract addresses. 2. Address.parseRaw('0:905...').toString({userFriendly: true}) (reply to 107642)

Jessica: it's just that I configured the TONAPI REST API to receive the condity of coins received the date and the address ton of the person I send it is returning in this format From: 0:908e4b8cfb4ce35dcad868a02025d1dd6d3537bd9bcbaf048a53cd5a3365ba7f And I wanted to receive the public address of who I send Transaction Hash: 2f768afae59f199ca4608e66713b09a5e57828c82faf9585a36fd681972c8ff3 Status: Success Date: 1726649082 Amount received: 0.0036732 TON, From: 0:908e4b8cfb4ce35dcad868a02025d1dd6d3537bd9bcbaf048a53cd5a3365ba7f (reply to 107643)

— 2024-09-22 —

Niu: Incorrect Error Message Displayed When Sending USDT with Insufficient Balance via @wallet Bot (TON Space)  Description: While using the @wallet Telegram bot on TON Space to send USDT, I encountered an issue where the error message displayed is not accurate. When my USDT balance is insufficient to complete the transaction, instead of showing "Insufficient USDT balance," the bot displays "Unverified transaction." This is misleading, as the actual problem is the lack of sufficient USDT, not an unverified transaction.  Interestingly, when sending TON with an insufficient balance, the error message is correct, clearly indicating that the TON balance is insufficient. However, the error message for USDT is not handled correctly in the same situation, which leads me to believe this could be a bug specific to USDT transactions in TON Space.  Steps to Reproduce: - Attempt to send USDT via @wallet Telegram bot on TON Space with a balance lower than the amount you are trying to send. - The bot returns the message "Unverified transaction" instead of indicating that the USDT balance is insufficient.  Expected Behavior: The bot should display a clear message such as "Insufficient USDT balance" when the user’s USDT balance is not enough to cover the transaction.  Additional Information: - The network fees (TON) are sufficient. - The issue is specific to USDT balance insufficiency. - Error handling works correctly when sending TON with insufficient balance, but not with USDT.  Could you please investigate this and address the inconsistent error messaging for USDT transactions?

Niu: @tsivarev @andreypfau

&rey: Please don't ping random people who are likely not associated with TON Space at all. I doubt TON Space devs are in this chat at all. (reply to 107689)

Prince: sorry if mind. :) (reply to 107690)

Niu: Where can I find ton space developers? (reply to 107690)

Niu: I want to report this bug.

Амир: Consider it as reported (reply to 107694)

Abdulaziz: Don't use chatgpt, so it can have bugs and bugs which makes you hacked (reply to 107527)

&rey: This part of code is totally nonsense does not work with TON (and probably any other blockchain as well). You need to send jetton-transfer-order to user's jetton wallet. (reply to 107527)

&rey: After all, if it worked, someone could use sendTransaction{sender: <your wallet>, recipient: <my wallet>, amount: <however much is there>}

Abdulaziz: Yes, cuz he generated with chatgpt and chatgpt does not know about TON or func (reply to 107698)

Abdulaziz: Is that a typescript or what? (reply to 107527)

SAIVO SUPPORT: Dart (reply to 107702)

Abdulaziz: I don't see that lаnguage оn tоn SDК (reply to 107705)

SAIVO SUPPORT: ton_dart library has

Abdulaziz: Then why its not exist on docs (reply to 107708)

Abdulaziz: What if it's scаm

C.: Did you double check tonconnectui connection?

&rey: Probably because docs were not updated recently. The lib is probably legit. (reply to 107709)

Abdulaziz: How does it connects with blockchain? (reply to 107708)

C.: If you are connecting to you webapp from telegram wallet app on your phone try to refresh the wallet app before a transaction

Abdulaziz: I mean Blockchain connection type (reply to 107715)

SAIVO SUPPORT: from flask import Flask, request, jsonify import asyncio from pytoniq import LiteBalancer, WalletV4R2, begin_cell  app = Flask(__name__)  async def send_jettons(mnemonics, receiver_address, jetton_contract_address, amount):     provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()      wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)     user_address = wallet.address      user_jetton_wallet = (await provider.run_get_method(         address=jetton_contract_address,         method="get_wallet_address",         stack=[begin_cell().store_address(user_address).end_cell().begin_parse()]     ))[0].load_address()           real_amount = int(amount * 100)        forward_payload = (begin_cell()                        .store_uint(0, 32)                        .store_snake_string("Bu yerga comment yozsa bo'ladi")                        .end_cell())      transfer_cell = (begin_cell()                      .store_uint(0xf8a7ea5, 32)                      .store_uint(0, 64)                      .store_coins(real_amount)                       .store_address(receiver_address)                      .store_address(user_address)                      .store_bit(0)                      .store_coins(1)                       .store_bit(1)                      .store_ref(forward_payload)                      .end_cell())      res = await wallet.transfer(destination=user_jetton_wallet, amount=int(0.04 * 1e9), body=transfer_cell)      await provider.close_all()     return res  @app.route('/send-jettons', methods=['POST']) def send_jettons_endpoint():     try:         data = request.json         mnemonics = data.get('mnemonics')         receiver_address = data.get('receiver_address')         jetton_contract_address = data.get('jetton_contract_address')         amount = data.get('amount')         result = asyncio.run(send_jettons(mnemonics, receiver_address, jetton_contract_address, amount))         return jsonify({"status": "success", "result": result})      except Exception as e:                  print(f"Error during send_jettons_endpoint: {str(e)}")         return jsonify({"status": "error", "message": str(e)}), 500  if __name__ == "__main__":     app.run(host='0.0.0.0', port=5000, debug=True) (reply to 107709)

Abdulaziz: Where is endpoint to request (reply to 107718)

SAIVO SUPPORT: The endpoint to request is /send-jettons, which is defined in the send_jettons_endpoint function. You can send a POST request to this endpoint with the necessary JSON payload to trigger the jetton transfer. (reply to 107719)

Abdulaziz: There is no ip or domain which accepts that request (reply to 107721)

SAIVO SUPPORT: Request Details URL:  perl д http://<server-ip>:5000/send-jettons Replace <server-ip> with the server's IP address or localhost if you are testing locally.  Method:  POST Headers:  bash  Content-Type: application/json JSON Payload:  json  {   "mnemonics": "your mnemonic phrase here",   "receiver_address": "receiver wallet address",   "jetton_contract_address": "jetton contract address",   "amount": 10 } Parameters: mnemonics: The mnemonic phrase of the sender's wallet. receiver_address: The address of the recipient wallet. jetton_contract_address: The address of the jetton contract. amount: The amount of jettons to send. Example cURL Command: bash  curl -X POST http://localhost:5000/send-jettons \      -H "Content-Type: application/json" \      -d '{            "mnemonics": "your mnemonic phrase here",            "receiver_address": "receiver wallet address",            "jetton_contract_address": "jetton contract address",            "amount": 10          }' (reply to 107721)

Abdulaziz: Why do you sent request to yourself (reply to 107723)

SAIVO SUPPORT: For testing (reply to 107724)

&rey: In a write-only manner via TON Connect 2, as far as I see. (reply to 107715)

Abdulaziz: Why my messages got deleted

Niu: Thank you (reply to 107695)

Denis: encrypted text mesages and small jetton amount (reply to 107209)

&rey: I retain meaning of conversation removing branches which do not lead anywhere or are false. I feel this is useful for figuring out things faster. (reply to 107728)

&rey: I pretty much understand what happens, though who needs to send jettons and who is receiving?

Abdulaziz: How he wanna do a transaction via sending request to himself but not ton api? I don't understand (reply to 107731)

SAIVO SUPPORT: Can you send me the documentation? (reply to 107724)

Abdulaziz: docs.ton.org (reply to 107734)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment (reply to 107734)

&rey: They use pytoniq, so that's not an issue. (Instead, an issue is that transfer is not guaranteed to happen...) (reply to 107733)

Sadegh: Hi everyone, I have another question.  I want to create a Jetton that limited to be withdraw only to one wallet address and can't be transferable to other wallets.  I want to ask you that is this possible with TON? and If I mint this Jetton, wallet will be shown it without problem?

SAIVO SUPPORT: which library is better. pytoniq or tontools (reply to 107737)

SAIVO SUPPORT: for transfer jettons (reply to 107739)

Jessica: /import requests  # Função para obter transações de uma carteira usando a API def get_transactions(wallet_address):     url = f"https://tonapi.io/v2/blockchain/accounts/{wallet_address}/transactions"     headers = {         "Authorization": "Bearer api"  # Substitua pelo seu token     }      response = requests.get(url, headers=headers)      print("Status da requisição:", response.status_code)      if response.status_code == 200:         data = response.json()         transactions = data.get('transactions', [])         print("Transações encontradas:", len(transactions))          if not transactions:             print("Nenhuma transação encontrada para essa conta.")             return          for tx in transactions:             tx_hash = tx['hash']             success = tx['success']             utime = tx['utime']              # A chave pública do remetente é a wallet_address que você está monitorando             sender_address = wallet_address                print(f"\nTransação Hash: {tx_hash}")             print(f"Status: {'Sucesso' if success else 'Falha'}")             print(f"Data: {utime}")              # Mensagem de entrada             in_msg = tx.get('in_msg')             if in_msg:                 value_in = in_msg['value'] / 1e9  # Converte de nanoton para TON                 from_address = in_msg.get('source', {}).get('address', 'Fonte desconhecida')                 print(f"Valor recebido: {value_in} TON, De: {from_address}")  # Não decodifica o from_address              # Mensagens de saída             out_msgs = tx.get('out_msgs', [])             for out_msg in out_msgs:                 value_out = out_msg['value'] / 1e9  # Converte de nanoton para TON                 to_address = out_msg['destination']['address']                 print(f"Valor enviado: {value_out} TON, Para: {to_address}")              # Imprime o endereço do remetente (no formato original)             print(f"Remetente: {sender_address}")      else:         print("Erro na requisição:", response.text)  if name == "main":     wallet_address = "UQCQjkuM-0zjXcrYaKAgJdHdbTU3vZvLrwSKU81aM2W6f_6t"  # Substitua pela carteira que você está monitorando     get_transactions(wallet_address)

yash: Is there someone from foundation who can help us with audits?

Jessica: Would anyone know how I set up to receive the transactions and the public addresses that will send to this card wallet0:905bd2437fe5b498e37fca33cb01ba5d2af2b8f4c33a459124f22b78e573b8e4 to the readable format EQCQW9JDf-W0mON_yjPLAbpdKvK49MM6RZEk8it45XO45ECC

Eren: Hi all, I have been running into a particular roadblock when I try to test/deploy my smart contract to the testnet.   It always returns   Error: Unable to execute get method. Got exit_code: 11  I have tried using the approach on Stepik and Blueprint.   I think the major issue emanates  from using the get provider.   async getCurrentNValue(provider: ContractProvider): Promise<number> {         const result = await provider.get('get_current_n_value()', []);         return result.stack.readNumber();     }    How do I resolve this? It’s been a major roadblock for me. Thanks.

Bryce: does anyone have Mintless Point Jetton? i will buy for ~0.2 TON

Bryce: so do it (reply to 107752)

Prince: sorry

Shivendra: how to add games in mini app on tg??  we need to build a game on js first then use any other sdk to integrate or whta's the process do anyone know??

Tanya: Prince is always kicked

我要飞: import { Address } from "@ton/core"; import { createTestClient } from "../utils/createTestClient"; import { JettonMaster } from "./JettonMaster"; import { JettonWallet } from "./JettonWallet";  describe('JettonMaster', () => {     it('should resolve jetton wallet address', async () => {         let client = createTestClient('mainnet');         let master = client.open(JettonMaster.create(Address.parse('EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv')));         let walletAddress = await master.getWalletAddress(Address.parse('EQCo6VT63H1vKJTiUo6W4M8RrTURCyk5MdbosuL5auEqpz-C'));         let jettonData = await master.getJettonData();         expect(walletAddress.equals(Address.parse('EQDslTlGmbLTFi0j4MPT7UVggWR7XRDI2bW6vmNG6Tc_FBDE'))).toBe(true);         expect(jettonData.mintable).toBe(true);         expect(jettonData.adminAddress.equals(Address.parse('EQCppzUtmGSMg3FIRlFLzhToqbaC0xjmjzOn0o7H4M8Aua1t'))).toBe(true);                  let wallet = client.open(JettonWallet.create(walletAddress));         let balance = await wallet.getBalance();         expect(balance).toBe(0n);     }); });   这个查询 jatton 的代码，把EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv这个代币换成别的代币 throw new Error("Invalid address: " + type);                   ^  Error: Invalid address: 0  就这个错误

Akachi: I got an issue in interacting with node for the testnet. (reply to 107539)

Akachi: Use Address.parse() from the @ton/ton library. (reply to 107642)

&: you can There's testnet version for ston.fi (reply to 107282)

&: There's sterik videos. (reply to 107170)

&: Send contract deploy tx via tonconnect. Is quite easy. (reply to 107154)

Sword: I used stonfi sdk to exchange ton and jetton, but it does work... and I found that there are several stonfi testnet address such as stonfi swap address as kQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33a1n stonfi provide liquidity address as kQCas2p939ESyXM_BzFJzcIe3GD5S0tbjJDj6EBVn-SPsEkN stonfi router address as kQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4Tp6n what should I have to use (reply to 107789)

&: you can use same address of mainnet Both of them may work (reply to 107792)

KH🆙 UXUY: Hello

starzkeeper: Hi, please tell me how I can watch usdt balance without using LiteServer

Sword: Does it need to active ton keeper wallet by depositing some ton to my wallet for swap jettons on stonfi testnet? (reply to 107793)

Rasoul: Hello friends, I want to extract the transfer history of an nft_item using tonapi, but I did not find the desired request, can anyone help me? https://tonapi.io/api-v2#

Rasoul: I used this command but it doesn't work properly (reply to 107801)

Rasoul: for this  EQAjr-caMxjOmDCZeCIfXlr6XjPkHK-_x5x4D-_gT1s-nZfL (reply to 107802)

Abdulaziz: What happened with validators

Rasoul: :( (reply to 107801)

Token: it's your mind. with wallet or without wallet (reply to 107799)

Tom: Guys, why are my excess transactions always fail?

Tom: Last internal tx

Haint: the excess message needs to have no body (reply to 107813)

Haint: if it has a body payload (in_msg_body is not empty) then it will proceed to check for the opcode

Haint:     if (in_msg_body.slice_empty?()) { ;; ignore all empty messages         return ();     }

Tom: Interesting, I'm using Jetton contract and I think this is the part it returns exceeded fund.  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {     var msg = begin_cell()       .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000       .store_slice(response_address)       .store_coins(msg_value)       .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)       .store_uint(op::excesses(), 32)       .store_uint(query_id, 64);     send_raw_message(msg.end_cell(), 2);   }

Haint: if this is the excesses message then it is a valid one. Problem might be in the destination contract

Haint: 65535 means the opcode is unknown in the destination contract

Tom: The destination contract is the jetton-minter-discoverable.fc It comes from here: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc

Haint: this contract did have the check to ignore empty message do you have a transaction that gave that error? (reply to 107820)

Tom: Can I DM you?

Haint: ok (reply to 107822)

TeleDev: hello, please tell me how to create a TON wallet and send from one to another wallet TON or other tokens (Python)

Raphael: Hey

Rasoul: Hello, I want to get the price of an nft, how can I do this with tonapi?

Jenya: how to emulate externals from mempool locally? 🥺  js

SunG: how to start to develop ton dex aggregator, is there any material for it

SunG: There is not any reference in github... (reply to 107841)

User<6992835458>: Есть русские?

Token: https://t.me/tondev (reply to 107855)

User<6992835458>: Thank bro

Token: They will stop you. ;) (reply to 107857)

Token: you can use testnet bot (reply to 107857)

Chat: Is there any way to revoke smart contract from my wallet

Chat: Plz help me guys

&rey: No contracts can be connected to a wallet contract in manner allowing to withdraw anything,  except if you added a plugin manually (but then you presumably know how to remove it as well). (reply to 107878)

Egene: Hi guys! Is it possible for a Jetton Master to control severeral different Jettons? Theoretically its possible to create a smart contract that has any reasonable functionality. However, are there any known Jetton Masters that control more than 1 Jetton?

Амир: Let's create a collection that controls another collections! 😉 (reply to 107887)

Egene: I am not trying to create one 😂 I am just working on an ERD of a database and am trying to store relations of Jetton Masters to Jettons Since I already have a table for Wallets and a table for Currencies I thought why not store Jetton Masters in Wallets and simply link it to a single currency I just wanted a definite answer on whether Jetton Master <> Jetton is a one to one relationship According to info from Russian Dev chat the answer is: If your Jetton Master Contract controlls several jettons then its violating the standard as per the standard it can only store meta data for a single jetton (reply to 107888)

Амир: Yes, they told you the truth (reply to 107889)

Алина: Is it possible on ston.fi to specify a receiving address different from the sender's address?

Catid: Hello want to ask  I often receive strange NFTs in my v4 wallet   how those people did it  does anyone know?

— 2024-09-23 —

Endgame: a quick question guys, is that possible to show the "Mint" transaction of a Jetton in the transaction / history tab of TonKeeper?

Nixuds: Hi, give me an example please!  I need a comment to be sent from the client side.  I am using Node.js and HTML with Tonconnect UI.

Chien 🇻🇳: Hello guys, I'm using toncli in Windows and have this problem.  I start with the wallet project, and nothing happened. But when I start with nft_collection, I face this error.

Alpha: Guys what the difference between blueprint and toncli?

Black myth: hey guys i need help in contract integration with  React app

Black myth: i'am having trouble while calling this method  , but everytime im not getting any response

Black myth: any core dev member or js dev here

Ankit j: Any dev available here, I have a tg app, 95% work done is, some open issue, need help?

NPA120: I can help you. What is the issue? (reply to 107950)

Sol: Looking for a team or forming my own to participate in a hackathon

Chelsea: Any dev want to join Ton hackathon this time?   We have 1 PM and Product designer and main user flow is ready

8exor 🦴: hey guys i need help in contract integration with  React app

Saurabh ∎: Hi, I'm facing a problem with init data expiry, its not refreshing after mini app launch.

Saurabh ∎: I'm using useLaunchParams from @telegram-apps/sdk-react

Akachi: We also should check the wrapper. (reply to 107961)

Champer Wu: what is the jettonContract meaning? jettonWallet or jettonMinter? you should provide more detail about it. (reply to 107961)

Musharaf: I’m a flutter and Dart dev looking for opportunities. I don’t mind joining you on your projects (reply to 107409)

Alan | Torch: Hey all, is it possible to store TVM tuples into storage directly? It will be great since our team is trying to optimize gas on matrix multiplication, and store the output matrix directly

Valera: Hello. Has anyone had the same problem when install npm create ton@latest? ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function

Arthur: You should probably just table it on Stack (reply to 107950)

Arthur: I'm not sure how active stackoverflow is now but the answers used to come at most after a day

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 40  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

General: The stake flow is active depending on how you use it (reply to 107995)

Arthur: It's been around 2 years since I last used it so I wasn't so sure anymore😅 (reply to 107999)

Nerses: can loading data from received message reorder data ?  let Id: Int = msg.data.preloadInt(257);         let hashlock: Int = msg.data.preloadInt(257);         let timelock: Int = msg.data.preloadInt(257);     as I emit timelock  but actually it emits Id . what can cause this ?

Ankit j: How to make ctx as Any in bot.js file ?

TON Bounty Bridge: ​Create "feedback" feature in the @ton_society_bot  🏷 Developer Tool  Summary:Develop the ability to conveniently receive and respond to feedback when interacting with the bot, a...  Created by coalus

CryptoRaichu: Hello guys, I want to create a fixed supply token, is there any good example?

Danila: Hello everyone! I'm looking for a way to interact with TON Bridge. Are there any SDK's for this? Wasn't able to find anything in the TON docs

shubham: is one else is also facing issue in transfering to another wallet using tonutils ??

shubham: every time i do a txn i get this error  {"error":"failed to get account state: lite server error, code 651: cannot load block (0,e000000000000000,45858264):688ADD30384F14E4D2CC9EF9BECE4F0C6BD907234E39A57BFF0B01AAC06F633C:915B5975B0B95DAE0113C75B43B5C1E7C948E39058E66CC3893B7E48C3857570 : block (0,e000000000000000,45858264) is not in db (possibly out of sync: shard_client_seqno=40587378 ls_seqno=40587530)"}  Using tonutils go library

&rey: "pre" in "preload" does stand for something. Might it cause the effect you met?.. (reply to 108002)

Nerses: i find out that actually all 3 variables are pointing to the same data,thats why i encountered such behavior (reply to 108018)

&rey: Do you know what "preload..." function actually does? (If not — why are you using it instead of "load"? You shouldn't use unknown functions in asset-handling systems.) (reply to 108019)

Nerses: yup pre creates pointer to the data.I need something that will point to next 257 bits (reply to 108020)

&rey: Trivially false since TVM has no pointer concept. Care for a next guess? (reply to 108021)

Nerses: i dont meant there is pointer TVM.I just use that term as abstraction to shortly describe what does pre.It creates seperate data so the var at which is called pre isnt modifed, and it  was needed in my case (reply to 108022)

Max: Hi there. we are developing product on TON contracts. we want finish final tests on testnet, Can we get some TONs on testnet? Thanks.

Nerses: use telegram bot @testgiver_ton_bot (reply to 108025)

Max: Want get 5000 TONs need to claim 1000 times..😥

&rey: Please contact @f_closer then. (reply to 108031)

Max: He did not answer me today😥

Mikhail: Hi everyone! Help me please to understand how to know if transaction failed https://tonviewer.com/transaction/c4e1dfe5dabbe454a9f646767ebfd1173339346cc63f1ed9931fc2f54e89f121  aborted = false action.valid = true action.success = true action.result_code = 0 compute_ph.exit_code = 0  But it still failed. Is there a parameter that indicates transaction status correctly?

Sixone: Hi,  is there an API that I can get metadata of a jetton and a pool? many thanks

Bulat: Hello. Do anyone have issues with ton api streaming? Seems like I don’t get real-time notifications about jetton transactions on mainnet (testnet is working fine).  It worked several days ago but now it doesn’t.

Skyler: Hi, I always met the error as follows, how do I fix it? code 651: too big masterchain block seqno

Chad: i have two contract 1. JetTon Contract token name is "Khan" 2. Manager Contract where i will manage to transfer/send "Khan" token to another wallet address how can i achieve this task please help , guide and share reference

Jason: /admin

Jason: Hey guys can I send info about TON CTF here?

&rey: I don't think it is related to development enough to be useful much, so no you can't. (reply to 108045)

battle: gm

Rasoul: Hello friends, is there a way to see the jetton chart in the past?

Alan | Torch: Hey all, is it possible to store TVM tuples into storage directly? It will be great since our team is trying to optimize gas on matrix multiplication, and store the output matrix directly

我要飞: Could you please help me check what the issue is? My server has 16 cores, 64GB of memory, and 2TB of disk space. I am running a full node on the server, and I have started the LiteServer. Then I converted it to an HTTP RPC node through ton-http-api. This node only processes a small amount of data from my calls. It should normally retrieve data as if accessing it locally. I am also accessing it directly from the server using 127.0.0.1:8080, but I have encountered a strange phenomenon. For the simplest operation, such as fetching wallet assets, the response time is over 3 seconds, and the intervals are inconsistent. Sometimes it even takes up to 10 seconds, which is much slower than public nodes. Can you help me identify where the problem might be? Thank you!

Abdulaziz: Why does chinese people has a lot expensive collection items, like anonymous numbers and 4 digit username? Do they really rich or just validators?

Jupiter: Hi, is there a simple way to mint custom SBTs on TON?

&rey: It is not possible. (reply to 108060)

Alan | Torch: Thanks 🙌 (reply to 108083)

&rey: Validators? That's testable within blockchain history. Though, I won't speculate, especially since it is offtopic. (reply to 108072)

Abdulaziz: I don't fully understand how that Blockchain works, what's the transaction tree, nft ownership assign and etc (reply to 108085)

&rey: Each transaction only changes state of one contract, and incoming+outcoming message queues.  Normal transactions are always handling of a single incoming message, either from outside of blockchain or from a contract. (reply to 108087)

Abdulaziz: You can call this thing message? (reply to 108089)

&rey: Yes, approximately. An internal message goes between smart contracts, carrying some TON, body(payload/comment), and some other things. (reply to 108090)

Abdulaziz: is there another types of messages which we can't see? I'm not talking about encrypted messages (reply to 108091)

&rey: External messages (carrying zero TON as there is no TON outside the blockchain)... they are still visible. (reply to 108092)

battle: Hello... I can help you.. I have sent dm and pls check inbox... (reply to 107961)

User<7413412398>: How to connect to testnet in myTonWallet for desktop version?

Alver: What should be the correct class from @ton/core to read a message that is stored in a slice in my contract?

Alan | Torch: In ton docs, it says that using pfxdict is not suitable for production, is there any reason behind the scene?

Alver: Because it is not an Address, i dont know if the class Slice is what i should use (reply to 108101)

CryptoRaichu: hello guys I am making some transactions on testnet I am sending to an address that starts with k but in toncenter api destination address starts with E what might be wrong? I check on explorer and transaction executed correctly, but I can't get correct address

Anton: hi! you can check the ton docs page, the raw and user-friendly addresses section (reply to 108121)

Alver: somebody here knows the proper way to send a string to a contract using @ton/core library?

Bereket: Hello there 👋  Quick question ❓  How can I subscribe to a wallet events with websocket or a webhook?

Jason: No it’s actually a competition for all Ton developers, they can use FunC and Tact languages to attend and win some rewards (reply to 108048)

— 2024-09-24 —

Ghost: Who wants to test a node ? dm please

peilipu: Hello everyone , can i reject a transaction when the memo comment is against my rules?

Johnny Le: no, cmt like code cmt, wont affect the main logic (reply to 108176)

SunG: swap jettons on stonfi testnet https://testnet.tonviewer.com/transaction/566a78dbf96776e4d2ad038287f179079613d457a2b683d3a22a88876ec2f810

SunG: successfully swapped jettons on stonfi testnet

Mirheydar: Hello everyone, did anyone find the solution to this ton connect issue? (reply to 73531)

Bill: Hi, I am going through the hello world series.  When I run the sample code step7, step8 with the seed phrase from my tonkeeper, it appears the wallet address and balance is different between the typescript code and tonkeeper.  has anyone run into this?  Any help is greatly appreciated!

Alver: hello, is there a way to call a contract sending a string as part of the body msg? if you know any link where i can read it i will thank

Sagara: Hi ,  I have Ton full node and Liteserver enabled. Validator engine have the setting "--archive-ttl 2592000". (30 day retention) I'm trying call the "getTransactions" method for the address("EQA7o4H-vQ7V2YWe4zuFgIvNC0K7KiSqBFekVjT4kK2Ih1ss") which has "Last activity" in "September 12, 8:07" But I'm getting an error.  Request: curl --location 'liteserverip/jsonRPC' \ --header 'Content-Type: application/json' \ --data '{"id":"1","jsonrpc":"2.0","method":"getTransactions","params":{"address":"EQA7o4H-vQ7V2YWe4zuFgIvNC0K7KiSqBFekVjT4kK2Ih1ss","limit":1}}' Response: {     "ok": false,     "error": "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time",     "code": 500 }  What seems to be the issue here ?

Sagara: @tsivarev Would you please provide any help on this? (reply to 108194)

Jupiter: Hi, does anyone know how to create SBTs on TON?

🐤VITALII: /

Ricky: should increase counter      Unable to execute get method. Got exit_code: 11        56 |       57 |     async getCounter(provider: ContractProvider) {    > 58 |         const result = await provider.get('get_counter', []);          |                        ^       59 |         return result.stack.readNumber();       60 |     }       61 |        at SmartContract.get (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:281:19)       at async Blockchain.runGetMethod (node_modules/@ton/sandbox/dist/blockchain/Blockchain.js:210:16)       at async BlockchainContractProvider.get (node_modules/@ton/sandbox/dist/blockchain/BlockchainContractProvider.js:67:24)       at async MyContractV2.getCounter (wrappers/MyContractV2.ts:58:24)       at async Object.<anonymous> (tests/MyContractV2.spec.ts:55:35)  Test Suites: 1 failed, 1 total Tests:       1 failed, 1 passed, 2 total Snapshots:   0 total Time:        4.09 s Ran all test suites.

Champer Wu: refer to TONX API tutorial for deploying the smart contract. https://docs.tonxapi.com/reference/build-a-gamefi and select the sbt item smart contract to compile and inert it into the collection smart contract data  https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/sbt-item.fc (reply to 108202)

Kapil: How to use the ston.fi for swapping token on the testnet

Akachi: Address can be different as it is parsed in the different ways. (reply to 108121)

Chad: is there any graph for ton?

Eren: I ran into the same issue and posted it here. Still yet to resolve it. (reply to 108204)

Chad: https://docs.ston.fi/docs/developer-section/sdk/dex-v1/swap (reply to 108207)

Kapil: It is thrown an error of 429 (reply to 108215)

Akachi: async getCounter(provider: ContractProvider) {      const { stack } = await provider.get("counter", []);      return stack.readBigNumber();    } Try this, exit code 11 means id wasn't found in your code (method_id). Please check your smart contract. (reply to 108204)

Akachi: Interested (reply to 108232)

我要飞: I have a question: when I execute a transaction with code, I receive the TON fee returned twice. When I receive the first one, can I consider my transaction successful?

我要飞: Is there anyone who can clearly explain how to determine if a transaction was successful in its earliest state?  thanks very much

Crzy: is there anyone looking for a developer rn?

shi: how to get TON testcoin?

Anastasiia: https://t.me/testgiver_ton_bot (reply to 108242)

Shomurod: Good day, where i can take animated stickers from telegram to use in mini apps (in telegram)

JORDAN: Hello guys   Is anyone in Europe? I need support on the smoothness of the game.

Gio: Good day, any tutorial available on how to get dynamic TON price from smart contract? Something like chainlink for TON or similar?

&rey: (of course you mean USDT price in TON? 😄) There is IIRC. Please check docs.ton.org. (reply to 108261)

Gennady: Have you solved this problem in any way? (reply to 50929)

Alver: I have a question , is storing an string (a.k.a  “hello world “) in c4 a trivial thing or it cannot be done? Because im trying to find examples and it seems that you can create and manipulate them inside the contract and send them between contract, but when i try to store it (“hello world”), it doesnt work, maybe i need to do something special to achieve it?

&rey: You simply need to store a slice... which you can do in various ways. (reply to 108265)

&rey: TVM has no strings, only slices instead.

&rey: I guess two: one to retrieve jetton wallet address, second to get contained amount. (reply to 50916)

Alver: When i reach my pc i will share my code, because i have tried that and dont see what i am missing (reply to 108266)

Maksim: Hey guys!  Maks from Chainstack here🫡

Maksim: We provide RPC infrastructure. Onboarded TON last week.

Soothereyougo: Can u guys help me getting testnet ton coins?

Shaibu: Please I need a savvy PHP and JavaScript dev for a quick project on a telegram mini app.  I need you to customize an existing app.  Thank you

User<7464188086>: Hi. Can we discuss more detail now? (reply to 108282)

Shaibu: Sure (reply to 108283)

Callan | Chainstack: https://faucet.chainstack.com/ton-testnet-faucet (reply to 108281)

Akachi: I am interstested. (reply to 108282)

BOBBY: Thanks (reply to 108285)

BOBBY: Chcek the docs on how to transfer jetton @MujahidKhanOfficial (reply to 108040)

Kim: HI, everyone, I sent a JETTON transfer through TONWEB, but there is no HX in the return result. How can I confirm whether the transfer is successful?

Malima>>Web3.js Ambassador Lead: nice to be here

Sad Bun 🐇: could you please tell me what root hash and file hash are (I mean, how are they calculated) and what do we need them for (looks like seqno is enough, isn't it)? (reply to 72173)

User<5333494358>: Hi

User<5333494358>: is this money real (reply to 108339)

Anastasiia: anyone familiar with tonproof here?

Abdulaziz: No (reply to 108341)

Abdulaziz: It's just for testing, for example you wanna mint nft, but on mainnet, you should pay (reply to 108341)

&rey: Root hash = representation hash of block root cell. File hash = hash of block BOC.  Seqno indeed should identify block in shardchain uniquely, but network might have signed invalid block which needs replacement at the same seqno. (reply to 108337)

SunG: how can I implement withdraw function in func smart contract?

SunG: Is there any material about it, plz somebody tell me

Akachi: By withdraw function, you mean transferring token from the contract to yourself? (reply to 108352)

Kim: I am also troubled by this problem. I want to confirm whether the transaction I sent out is successful. What if the transaction records I obtained from my account are associated with every transaction I sent out? (reply to 526)

SunG: yes, using func language (reply to 108355)

Merlin: Hello. Anyone instrsted in TON or Ethereum? I'm a full stack blockchain developer. Please hit me when you need my help. All the best.

&rey: Withdraw... what, exactly? (reply to 108352)

Token: maybe he wants raw_reverse (reply to 108375)

Buzz: Hello, everyone.  I am new developer in Ton network. I am facing a problem in making contract. I need to know a special token price in my smart contract.  I want to know how.

Token: use raw_reverse (reply to 108357)

SunG: thank you, I did it (reply to 108388)

&rey: With an intermediate struct. (reply to 108396)

Anton: oh boy, that is gonna cost some gas (reply to 108401)

User<7505271594>: hello everybody

Anton: you are better off using some other data structure (reply to 108396)

Anton: we might support nested maps natively in a future Tact version but it’s not gonna happen tomorrow

Anton: how should I know? we have zero info about your use case (reply to 108428)

Anton: i mean if you want kind of a direct way to do it, then take your 2 keys, hash those and use the hash as an integer key in your non-nested map

&rey: Does Tact have cheap hashing of two integers,  btw? (reply to 108432)

Anton: you can use `asm`-functions if needed (reply to 108434)

CryptoRaichu: hello guys, I deployed a token by using assets-sdk and collecting some tons in that wallet, but when I enter seed phases to the tonkeeper it is not opening the correct wallet do you know why?

User<7062442470>: Help pls  import asyncio from pytoniq import LiteClient   async def main():     async with LiteClient.from_mainnet_config(ls_i=0, trust_level=2) as client:         print(await client.get_transactions(address="EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG", count=3))  if __name__ == "__main__":     asyncio.run(main()) Library: pytoniq Error: asyncio.exceptions.IncompleteReadError: 0 bytes read on a total of 4 expected bytes or pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 651 code

&rey: Try liteservers with other indices. (reply to 108438)

User<7062442470>: import asyncio from pytoniq import LiteBalancer   async def main():     async with LiteBalancer.from_mainnet_config(trust_level=1) as client:         print(await client.get_transactions(address="EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG", count=3))  if __name__ == "__main__":     asyncio.run(main()) The same *I changed the liteclient to a litebalancer* (reply to 108439)

Lucas | CryptoEngineer ✨: Hi, Team. How are you? I am here to get some help about the problem while studying the Ton tutorial. Currently, I am following the tutorial on https://github.com/romanovichim. But I faced some problem on 6th lesson.  In this lesson, I wrote the test script, but it is not working. Here is the error message and I have not fixed it yet. If you have interest in that, please help me. Thanks.

Ramazan: Ramazan SAKARIYA @DİFO: Ramazan SAKARIYA @DİFO: How do I send my txid code to telegram wallet?  Hello sent dogs to my binance account using the tone network via Telegram wallet, I entered incomplete information, I started a binance refund, but I checked for dogs, Telegram Wallace is not accepted, I ask for help  İs there anyone sent txıd code to telegram wallet?

Ramazan: Txıd a550bd6c9d079c6340088a410b5d0db91e27e6d289d7c2cba93de641d5eda733

Ramazan: Can you help me please? (reply to 108472)

Vin: Hey guys,  Seeing this error response with method getTransactions. Any ideas on how to resolve this?  {     "ok": false,     "error": "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time",     "code": 500 }

User<7327594818>: https://buizz.oneton.pro/

Alex: Hey, how to deploy smart contract from backend? TypeScript?

Ramazan: Screenshot (24 Eyl 2024 23:47:04)

Heydar: do we have any python module that can be installed by pip and convert: 0:2f6e6d...3f946 to readable address?

Амир: pytoniq core (reply to 108499)

Ramazan: Why dont anywone help me?

User<7464188086>: hmm... (reply to 108506)

Ramazan: ? (reply to 108509)

&rey: The site on screenshot looks like scam. (reply to 108495)

Egene: Does anyone use TON Center API v3 Get transactionsByMessage ? can we trust values in account_state_before and account_state_after ?  I have a message hash: 6+FyHsahMx+K0tjglzKy2ORcBsYaHPT1smYK1WiYL0Q= direction: out  I receive:       "account_state_before": {         "hash": "1FDjeWBgOBw0suIDi6EV0LsZ988cdhU5k+p3fRO50KI=",         "balance": null,         "account_status": null,         "frozen_hash": null,         "data_hash": null,         "code_hash": null       },       "account_state_after": {         "hash": "MgrEz9CwxXfEU1VY1B2qvNzlqO+Doq436s5g8nxNILw=",         "balance": "1908066885",         "account_status": "active",         "frozen_hash": null,         "data_hash": "7wAbxQepNXJfU2/kAjX54Rkl2iL2uTZBk/533hwUQGc=",         "code_hash": "/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA="       }   balance before is definitely positive, but the API returns null ...  here is the transaction: https://tonviewer.com/transaction/f2f9f80c133208c042f6d012508a455d6e2a76a164eccceeebddc4da2d3aab0a  is this a bug with TON Center API or is something wrong with the transaction ?

Heydar: how take all transactions of a wallet(I have it address) in tonapi(or any better way without limitations)?  and do we have any limitation?

Egene: try this: https://toncenter.com/api/v3/index.html#/blockchain/api_v3_get_transactions (reply to 108534)

Egene: you can get 1000 transactions at a time and have 10 transactions per second at no cost (reply to 108535)

Egene: add the wallet you want to track in account array, then add 1000 in limit If the wallet has more than 1000 transactions use the offset variable to walk through them

DeFi: scam (reply to 108545)

MikieMikePhys: Hi - @AntonTrunov @combot @delovoyslava -  need to find out if i can move NFTs out of a Ton Multisig? Anyhelp would be appreciated. For a small project on Ton

Akachi: Don't use use blueprint for that? (reply to 108491)

— 2024-09-25 —

D_d: guys after I connected wallet using tonconnect. how can I get balance of the wallet?

Akachi: Did you use React? (reply to 108564)

D_d: yes, to be more specific I use lib, @tonconnect/sdk

&: You. didn't include any TON to send tx. and also there's 0 for forward fee. No gas fee included so tx is failed at the first time (reply to 108493)

&: Deploying smart contract is the same with a special tx. Just build a tx that can deploy smart contract. There's details in official doc (reply to 108562)

Vincent: Hi my big bosses, when I trying to deploy a same contract on Ton and call the smart contract I get the error of exit code 9. but last time I use this commit to deploy is ok. How could this be happen? the exit code is showing when the smart contract is trying to deploy another one. Thanks my big bosses, I love you all,

Egene: is there an easy way to get from a bouncable or a non-bouncable address a HEX address ?

-أبـوُ عٌـدي الـشُـامــي𓆰⋆⃝CR: /stat

FatAsianCrypto: hey guys any solutions to this issue on github

Ankit j: My bot doesn't display Monthly users count, is there any setting need to change in bot-farther ?

Ramazan: Ramazan SAKARIYA @DİFO: Ramazan SAKARIYA @DİFO: Ramazan SAKARIYA @DİFO: How do I send my txid code to telegram wallet?  Hello sent dogs to my binance account using the tone network via Telegram wallet, I entered incomplete information, I started a binance refund, but I checked for dogs, Telegram Wallace is not accepted, I ask for help  İs there anyone sent txıd code to telegram wallet?  Txıd a550bd6c9d079c6340088a410b5d0db91e27e6d289d7c2cba93de641d5eda733  Can you help me please?

Alchi: Telegram wallet have many issues. Plz avoid that one. It even restricts some region if you verify your id (reply to 108739)

User<5018886941>: Hey

Champer Wu: you mean @wallet ? (reply to 108746)

Champer Wu: Could you provide your code? (reply to 108733)

Champer Wu: it summarize monthly, if your bot is new, you would see the amount next month (reply to 108734)

Kapil: Why does we use the raw reverse method in func

Jason-Bitslab: https://x.com/ton_blockchain/status/1838555263227642203  💎TON Developers, this is your moment!  Just announced: the Capture The Flag competition on #TON – TON CTF! 🎉 Granted by TON Foundation and organized by Tonbit & TONX Studio.  Calling all #FunC and #Tact developers to join the challenge! Each solved challenge earns you a "flag," which can be exchanged for points. The more points, the higher you climb the leaderboard – and the closer you get to winning your share of the $10,000 prize pool! 💸🏆  🔗 Learn More & Register: https://ctf.tonbit.xyz 🗓 Competition: Sept 28, 2024, 1:00 am UTC – Sept 29, 2024, 1:00 am UTC 📝 Registration Closes: Sept 28, 2024, 1:00 am UTC 🎮 Try a Sample Question: https://ctf.tonbit.xyz/challenges  Don’t miss out – join now and show your skills! 🚀

Jason-Bitslab: Guys, just register and attend the competition, its really fun

&rey: Please remember that TON has no obligation to store past transactions, beyond like one week. (reply to 108534)

Wasiq: Any specific reason ?? Or it's the obvious reason that it costs them ?? (reply to 108762)

&rey: Those past transactions are irrelevant to current blockchain validity so there's no obligation.  There are archive nodes which store all history, just because of good will. (reply to 108763)

Wasiq: Oh i see got it thanks (reply to 108764)

Sad Bun 🐇: just one more question, not sure i got it right    can blocks in basechain's shardchains be replaced after they where added to masterchain? (reply to 108346)

&rey: No. In fact, they can't be replaced when they were signed by a consensus worth of validators either. (reply to 108770)

R: Hi all, how to convert ton address to string The address starts with 0: but on the explorers they are in different format

Ramazan: Thanks (reply to 108746)

Meower: is it still impossible to retrieve tons from jetton wallets? (reply to 45268)

Champer Wu: If the external message just include 1 internal message , I think it wouldn’t trigger the infinite loop. For the bouncable and non-bouncable address is another topic. It’s the reason why I want to see your program (reply to 108780)

Cat: Hello! Could you please tell me if there is any way to get the hash of the sent transaction from tonlib for java?

Champer Wu: If you want to check hash on chain you can visit https://tonviewer.com/ (reply to 108797)

Cat: Thank you. But I need to somehow get the hash itself using tonlib for java to save it in the database. And it looks like it's not quite realistic( (reply to 108798)

Champer Wu: hope following the source code in tonlib for java would help you  https://github.com/ton-blockchain/tonlib-java/blob/49b228fe710cd742e82012875ea5c09a177b1904/src/drinkless/org/ton/TonApi.java#L1906 (reply to 108799)

R: Anyone please help I am stuck here (reply to 108776)

Champer Wu: it’s raw address format. explorers can parse it if you want to see every different type of address. You can use this tool https://ton.org/address/ (reply to 108776)

Техподдержка: Hi everyone)we have game project and we want to find support ,as sponsor or investor. We are open to any offers. Also we ready to find buyer and will be pleased if you send us any groups for that)

Aditya: I have a quick question. Can i do transfer the tokens using smart contracts not by using wallet. Is it possible in TON?

Sally: if anyone's building a small ton mini app game / clickr or similar pls reach out - a specific EVM L1 would want to support it and sponsor its release

Duty✨: Yes. It's possible in Ton chain using smart contracts. (reply to 108810)

Champer Wu: It’s non-sense, because triggering the smart contract would need to be verified by signature of wallet generally. even sending external message should do the action that I mentioned . (reply to 108810)

Alex: Hey, how can i deploy contract with initial amount on it using Tact?

TON Bounty Bridge: ​TG Bot and FunC Development Case and Chinese education materials  🏷 Education  Summary:OpenBuildand TONiverse Labs propose to create a series of educational courses about the development ...  Created by jueduizone

Michal | LI.FI: Why does transferring on the TonKeeper mobile app gives 1 TON for gas, while the same transaction on the browser extension only gives 0.1 TON? It's transfer for custom token implementation.

TON Bounty Bridge: ​.NET(C#) library for verifying ton_proof with examples  🏷 Developer Tool  Summary:Authorization on the backend for .NET(C#) stack applications  Created by WinoGarcia

&: There's func code in official document (reply to 108822)

Alex: I’m using Tact (reply to 108838)

&: I think tact is easy to learn but not good for developing. Idk it will be much better after few years but For now I like func better than tact (reply to 108839)

Hamza: how to get testnet usdt ?

&rey: There's no dedicated USDT in testnet, you can use any jetton there. (reply to 108844)

Dmitriy: as mentioned above, there is no special USDT, but you can use https://minter.ton.org/?testnet=true to mint testnet tokens (reply to 108844)

Hamza: Thanks a lot

Sad Bun 🐇: is it possible that more than one shard will merge or split in a single masterchain block?

TON Bounty Bridge: ​Content for French Community  🏷 Education  Summary:With this bounty, I want to cover Ton and Ton ecosystem during six months (october 2024-october 2025...  Created by Patvib

Оля: Hello 👋  I came across a problem: I'm using global variables to load the contract state. Local tests all pass, everything deploys, data is correct. But during manual testing on the testnet I came across a problem - deploy passes, contract balance is not 0, but when I try to pull the date I get error code 9. When trying to call methods of the contract code unknown_op. As soon as I remove global variables - everything works. Simplified code below  Using global variables: global int ctx_data;  () load_data() impure inline {     slice ds = get_data().begin_parse();      ctx_data = ds~load_uint(16);          ds.end_parse();          }  () save_data() impure inline {     set_data(         begin_cell()             .store_uint(ctx_data, 16)         .end_cell()     ); }  Without global variables:  (int) load_data() impure inline {     slice ds = get_data().begin_parse();        return ds~load_uint(16);     }  () save_data(data) impure inline {     set_data(         begin_cell()             .store_uint(data, 16)         .end_cell()     ); } I've seen this practice in many contracts, this is the first time I've tried it myself, anyone have any ideas why this behavior?

Amit: Hello Need some help. Not able to automate withdrawals.

Amit: also when i'm using telegram miniapp in my mobile and in try to connect wallet via tonkeeper, it doesn't redirect to the tonkeeper wallet. help!!

George: где посмотреть коды ошибок   decode response: error: code 406: {Error:error code: 0 message: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction D549DD46D01849335378571F3663E2E70F650D1FC8E6054C1C0265F3866041C7: exitcode=134, steps=52, gas_used=0 VM Log (truncated): ...T execute XCHG s2 execute NOT execute XCHG2 s0,s7 execute AND execute THROWIF 132 execute XCPU s2,s5 execute EQUAL execute THROWIFNOT 133 execute XCHG2 s3,s6 execute EQUAL execute THROWIFNOT 134 default exception handler, terminating vm with exit code 134 }

User<7069978295>: 👍

&rey: Здесь вопрос к контракту, конечно. (reply to 109018)

isik: Hello, does anybody know how I can with python, retrieve swap transaction information to identify the jettons swapped. Are there specific APIs, libraries, or methods for parsing transaction data on the TON blockchain that would help extract this information? Any guidance or resources would be greatly appreciated!

isik: I can already retrieve the amounts for jettons but cant find the jetton or pool addresses correctly

isik: For stonfi I get an address(contract I guess) but it seems like all jetton to Ton transactions are made via that contract. EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt this one and this one EQARULUYsmJq1RiZ-YiH-IJLcAZUVkVff-KBPwEmmaQGH6aC

Dmitriy: there is a get_pool_address on stonfi router contract to get the address of pool for a certain pair of tokens https://docs.ston.fi/docs/developer-section/api-reference-v1/router#get_pool_address I believe that stonfi sdk has the appropriate function to call it (reply to 109053)

SunG: I swapped jettons using stonfi sdk and trying send a message to stonfi in smart contract to process the swap... body is made using getSwapTonToJettonTxParams in stonfi sdk. but it doesn't work...

SunG: Experts tell me what the solution is (reply to 109058)

pfeffunit: Hello! I’m deploying a contract to store some user data, for each, from my main contract. I need to put some of the user paid fees into the cost of deployment. The deployment occurs after the user pays into the main contract.   What’s the right way to determine that amount? I don’t want to hard code it, that seems brittle.   Is there a solid way to calculate it on the fly? What’s best practice?  Thanks !

— 2024-09-26 —

Haint: even jetton hardcodes the gas required... best practice is to avoid setting that amount higher than necessary, through iterative unit testing. (reply to 109072)

pfeffunit: thanks! gas usage or costs don't fluctuate as much as ethereum? in solidity/EVM that would be crazy to hard code it, since the gas required for a single operation can vary so much (reply to 109151)

Haint: currently it doesn't change much, but it's possible in the future if more people start using the network. you can always monitor and upgrade the code though. the architecture is vastly different from evm so it's not trivial to make gas estimation before submitting the message (reply to 109152)

pfeffunit: interesting, thanks so much

David: Is there a way to destroy some of my jetton accounts to get back the Ton in their balance?

Small: What is the difference between load_int and load_uint, considering that ton only has the type int

pfeffunit: i have a withdraw() function, to pull out the money from customers, but need to leave some amount behind

Haint: moreover evm has a concept of gas which is separated from the native tokens (ETH), so even if the gas price changes, the gas amount stays the same. ton doesn't have this afaik

David: Do you want to share the code? (reply to 109159)

pfeffunit: Sure!  Here's the withdraw code:      } elseif (op == op::withdraw_all) {         throw_unless(error::not_authorized, equal_slices(sender_address, owner_address));          ;; TODO: think i need to set this up         ;; raw_reserve(MIN_STORAGE_FEE, RESERVE_UP_TO);          ;; Create the outgoing message         ;; https://docs.ton.org/develop/func/cookbook#how-to-send-a-message-with-the-entire-balance         cell msg = begin_cell()             .store_uint(0x18, 6) ;; flags             .store_slice(owner_address) ;; destination address             .store_coins(0) ;; we don't care about this value right now             .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)             .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment             .end_cell();         send_raw_message(msg, 128); ;; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (reply to 109162)

pfeffunit: from what i gather, if i call raw_reserve before the fund transfer, mode 128 will leave that amount in the contract

Haint: you can destroy a contract using mode 160 on send_raw_message. Unfortunately, jetton wallet doesn't provide this function, so you can't get the TON back (reply to 109157)

David: got it , but for the existing common Jetton, there is no such method, so there is nothing we can do, right? (reply to 109163)

pfeffunit: raw_reserve is  in stdlib? (reply to 109166)

james.bertol.leonidas$€: Yes

pfeffunit: so not sure what you mean there's nothing we can do

Haint: you can do it with contracts you have control of the code, you don't for jetton wallet (reply to 109170)

pfeffunit: oh yes this is a contract i'm writing

pfeffunit: it just proceses TON payments

David: I think we should promote this as a best practice to add these withdrawal functions into Jetton wallet when developing, otherwise there will be too much dead Ton sitting in those contracts (reply to 109173)

pfeffunit: I also create contracts to track some user data, so i guess i need to forward some amount of TON into those. currently i was not, i was just doing it like this:          var msg = begin_cell()         .store_uint(BOUNCEABLE, 6)         .store_slice(payment_tracker_address)         .store_coins(payment_tracker_deployment_fee)         .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)         .store_ref(state_init)         .store_ref(deposit_body);          ;; Send the message         send_raw_message(msg.end_cell(), 0); ;; Change to mode 1 to keep the remaining balance

pfeffunit: i made payment_tracker_deployment_fee configurable so i could adjust that "gas" fee

pfeffunit: is that amount going to be used to pay the fee to create the contract AND sent into the contract to pay storage fees?

pfeffunit: (thanks so much everyone, so helpful so far!)

Small: What is the difference between load_int and load_uint, considering that ton only has the type int,and if there a security problem if i identify a int 'a' but use 'a=s.load_uint'

Small: and if i send multi times raw_reserve,what will happen?

Small: and for this link code,why it do not have params type?https://github.com/ton-blockchain/bridge-func/blob/e2b93105bda04642814d424a7094715194fa7721/func/message_utils.fc#L15-L24

hk: what is the difference between jetton and ton？

Nikita: No difference. It is same like Ethereum and Bitcoin. I'm joke. You can ask Google (reply to 109196)

Nguyễn Linh: Hey, can a wallet on basechain send ton/jetton to masterchain?

Nikita: Ton - yes, jetton in basic realization - no (reply to 109199)

Nguyễn Linh: So if I send a bounceable message to inactive masterchain wallet address, it still bounce back to me right? (reply to 109200)

Nikita: Yes, tested (reply to 109204)

Nguyễn Linh: Ty (reply to 109205)

&rey: What makes you believe so, by the way? (reply to 109207)

&rey: load_uint and load_int interpret bit sequences from slice in different ways. (reply to 109185)

Nhat Nguyen: I have issue when implement function transferJettons when using @ton/ton can you help me?  data: {      ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state',      code: 500     }

Nguyễn Linh: dm me the sourcecode (reply to 109217)

Nguyễn Linh: I also meet this error before

Small: If I define an int variable in func and assign him a value via load_uint, will there be a safety issue or do I have to assign him a value using load_int (reply to 109212)

&rey: There won't. (A good test: does it type-check? Yes it does.) (reply to 109220)

Small: so What is the use of load_uint when fun is only of type int? (reply to 109221)

Nhat Nguyen: Check ib (reply to 109219)

Shadow: hi, i'm using tonutils-go got error  Failed to run get method: contract exit code: 7 (type check error. An argument to a primitive is of incorrect value type)        amount := big.NewInt(1000432)  jettonSlice := cell.BeginCell().MustStoreAddr(jetton1WalletAddr).EndCell()     result, err := api.WaitForBlock(block.SeqNo).RunGetMethod(context.Background(), block, poolAddr, "get_expected_outputs", amount, jettonSlice)     if err != nil {         logger.Infof("Failed to run get method: %v", err)         return 0, err     }   can someone help me please

Small: What happens when you send stateinit to the address of an already deployed contract

&rey: It is silently ignored. (reply to 109231)

JuunS | Part of Manexus | Web3 Dev: Hi guys is there an example to get jetton balance using tonweb?

hk: how to transfer jetton in testnet?

Tom: Any document about Jetton batch transfer guys? Multiple messages are not an available option

Token: just use tonapi (reply to 109236)

Token: more than 4 transactions, recommend highload wallet (reply to 109245)

Token: ? send message jetton master address (reply to 109244)

Champer Wu: do you mean minting? (reply to 109255)

Tom: Wallet V5 would support up to 255 msgs but in my case, the holder wallet is already deployed. (reply to 109248)

Token: I have done building platform multi send jetton and ton on testnet and mainnet (reply to 109258)

Token: Or As I told you, use highload wallet with script (reply to 109258)

Token: I want to say on (py) but I can't post any... so give you answer here (reply to 109258)

JuunS | Part of Manexus | Web3 Dev: any example for getting balance and sending jetton? (reply to 109247)

Token: sorry, I did it a few months ago and until then, I couldn't find any source (reply to 109263)

Tom: I understand that is possible with highload wallet and script. But the thing is, we have no control over the connected wallet. They come from TonConnect and could be V3, V4 or V5. So we cannot force them to use highload wallet. (reply to 109261)

Token: then send message to deployed contract (reply to 109266)

Tom: Is this contract open source? Or where can I find documentation for this? Thanks a lot. (reply to 109268)

Token: lol, the contract is I deployed. (reply to 109270)

Tom: Afaik, that contract acts as a deployer? Receiving Jetton from sender and distribute them?

JuunS | Part of Manexus | Web3 Dev: Any example on how to get jetton balance & transfer jetton maybe using @ton/ton or tonweb?

Victor: Hello, Could you advice me why transaction failed?

&: This chat history will have code (reply to 109273)

Victor: Exit Code 65535 means i put unknown opcode .... but i don't know what should i do

&: Did you checked the destination contract's code? (reply to 109278)

Victor: this is what i broadcast (reply to 109279)

&: tx looks good.check contract address of the destination (reply to 109280)

Token: yeah, toJettonAddress will be problem (reply to 109280)

Victor: oh..

Victor: Should i put toAddress ? Not toJettonAddress. I will try it

&: each param have meaning.

Token: ah,,, no (reply to 109285)

shi: Why the results different when querying jetton_wallet_code on toncenter and tonviewer?  when querying the USDT address EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs:  On toncenter, the result is:  te6cckEBAQEAIwAIQgKPRS16Tf10BmtoI2UXclntBXNENb52tf1L1divK3w9aCBrv3Y=  On tonviewer, the result is:  b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68  convert to base64: te6ccgEBAQEAIwAIQgKPRS16Tf10BmtoI2UXclntBXNENb52tf1L1divK3w9aA==

Victor: thank you i solved problem

shi: need some help, pls

Token: idk, but I use tonviewer and it works (reply to 109288)

shi: it makes me confuse

&: It can be difference between Cell and slice. There's endcell() for Cell. Most contents are the same but tail is a bit differ (reply to 109288)

shi: 😭

User<6670237218>: Hello everyone

JuunS | Part of Manexus | Web3 Dev: What you prefer? (reply to 109276)

Champer Wu: https://github.com/getgems-io/nft-contracts/blob/8e72b068e2e3c6ea6cd744c954d94abd888f0259/packages/contracts/nft-item/NftItem.data.ts#L101 follow this code. (reply to 109259)

Champer Wu: Have you tried to parse it? (reply to 109288)

TON Bounty Bridge: ​Depth Comparison of Blockchains  🏷 Education  Summary:The need for comprehensive educational materials regarding the differences and features of blockchai...  Created by turic24

Mohammad: Hey everyone, I was trying to write a contract that checks whether an NFT sent to it, is from a specific collection or not. But we cannot prove that the NFT is coming from a specific collection because get_static_data can be faked and there is no other option in TEP-62. That would be nice if there was a flow that we could use to make sure the NFT transferred to our smart contract is an NFT from a specific collection. if get_static_data could ask from collection to provide these information the problem would be solved.  Is there any workaround to make sure an NFT is coming from a specific collection? Would  it be ok to store a dictionary of all NFT addresses in the collection and check them in nft_ownership_assigned operation?

✨Safina✨: Hello! How to parse a transaction hash from boc that we get after tonconnect/ui transaction?

&rey: You can't. What do you want to do with it? (reply to 109306)

✨Safina✨: SetInterval and check when the transaction will be confirmed (reply to 109313)

&rey: 1. You can hash cell that comes from TON Connect; it is hash of the external message (not of transaction!). 2. Probably you can feed that hash into explorers; if it points to a message, it is indeed recorded in blockchain, and the money is sent.

Sword: Help, What role does the sender_address play here? Does it act as a sender for users or contracts that receive messages?

&rey: It is simply part of message payload, with no intrinsic meaning. (reply to 109317)

Victor: guys... i need help, How could i get owner address when i know jetton Address?

Laisky: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#get-methods (reply to 109319)

Vincent: any one knows what is a Error: Invalid CRC32C error when I trying to read a BOC

Vincent: my big bosses help

Victor: gpt gave me how to get owner address from jetton wallet address but it didn't work.

Victor: I want to use Contract but it doesnt have constructor in my sdk :(

Victor: Is there any easy way to get owner address ?

Victor: I tracked my jetton address by getTransactions method, but there were only jetton wallet address in message source. I can't find out owner address..

Endgame: hi there, does anyone know why using testnet toncenter api (https://testnet.toncenter.com/api/v2/getTransactions?address) the wallet address will return address prefix of EQ instead of 0Q? is that a bug?

Lich King: hey, why transfers need to have a transfer notification in order to be considered valid? ""Ensure that the message body is not empty and that the first 32 bits of the message match the transfer notification op code 0x7362d09c. Tonweb example If the message body is empty or the op code is invalid - skip the transaction.". If you send a tx with no tx notification, why would that be invalid? in ton examples for sending withdrawals you sent it without tx notification

🎐*<@Maxim: Because Bounce message without op code.. we have to skip it (reply to 109341)

Filip: Anyone using Ton node validator in Lite-Server mode in Hetzner?

Lich King: ok but why in the docs the jetton withdrawal example here https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js#L188 is actually a transfer without transfer notification? I checked the wallet that was sent the jetton amount and it was credited there, why didn't they send the amount with "forwareded_ton_amount" which triggers a tx notification? (reply to 109348)

Filip: Bug bounty program still active? I found a bug in mytonctrl

🎐*<@Maxim: Perhaps these addresses are equal: to-sender and to-forward ? (reply to 109350)

Lich King: yes, I'm sending to same address, so this is the reason? (reply to 109353)

&rey: Transfer notification is generated by destination's jetton wallet. (reply to 109350)

&rey: Otherwise it isn't a jetton transfer. (reply to 109341)

Ansar Khan: Hi

Ƥυrу: any script to send hamster using typescript or python ?

Александр 🫶: anyone know why hmstr address no returning data, other jettons work good

Luis: Which is the official ton library for go? Tongo or ton-utils?

Gleb: https://github.com/xssnick/tonutils-go (reply to 109371)

Myzst: Holla

SunG: What is same as .storeBit(false) in func language?

&rey: .store_uint(0, 1) (reply to 109385)

SunG: Thank you (reply to 109388)

SunG: One more question, what is same as  builder.storeAddress(undefined) in func?

SunG: I am just converting message in ts to func message...

&rey: .store_uint(0, 2) (reply to 109390)

Wick: where can I learn more about telegram mini apps? since I am working on my own project ( to build something like notcoin ) , I want more information regarding it

ShanX: you can get a lot of info from here - https://github.com/telegram-mini-apps-dev (reply to 109398)

Wick: alr thanks mate (reply to 109399)

cicada.: hi, did you find the answer? (reply to 101420)

Vin: Hi, can I get assitance on this issue I am seeing with this RPC query? Other getTransaction queries work as expected but unsure about what is wrong with this address below.  {"id":"1","jsonrpc":"2.0","method":"getTransactions","params":{"address":"EQA7o4H-vQ7V2YWe4zuFgIvNC0K7KiSqBFekVjT4kK2Ih1ss","limit":1}}  Response {     "ok": false,     "error": "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time",     "code": 500 }

Calvin | Impossible: wow this is a nice throwback. would be a good timing i think to do a ecosystem recap now to revisit all he cool things built in the last year (reply to 31843)

Serhii: anyone familiar with adnl.message.nop message type? what is it for?

Mikko: What was the word that is not allowed? (reply to 109419)

User<7279649895>: what kind of game do you want? (reply to 108433)

User<7279649895>: DM (reply to 106951)

Arayik: Hi guys. I need your help. I used tonconnect/ui to connect the wallet. Wallet connect/disconnect works fine. But the icon is not loading, the URL in the manifest is correct, the icon format is png and the size is 180x180. Can anyone help me?

Mikko: How does this mintless mint work? https://tonviewer.com/EQD6Z9DHc5Mx-8PI8I4BjGX0d2NhapaRAK12CgstweNoMint

Sharmila Blessy: Hi everyone,  I’m using the tonconnect/ui-react package to trigger wallet connections in my project. The wallet connection is established successfully, but after 5 to 10 minutes, I start seeing the following error:  [TON_CONNECT_SDK_ERROR] TonConnectError Operation aborted Error: Operation aborted     at abortController.signal.addEventListener.once (http://localhost:3000/static/js/bundle.js:64575:14)     at signal.addEventListener.once (http://localhost:3000/static/js/bundle.js:64414:108)     ...  Initially, everything works fine, but after some time, this error pops up. It seems to be related to the connection aborting after a certain amount of inactivity.  Has anyone encountered this issue or knows what could be causing the connection to abort after a delay?  Please any one help me to resolve this?

Mikko: In my experience TonConnect is very unstable (reply to 109429)

Sharmila Blessy: Could you recommend an alternative method  for triggering wallet connections? (reply to 109431)

Abdulaziz: Why does wallets not shows how many i have to pay to webapp if i don't have enough ton? It's really inconvenient. You don't know how much more ton you need.

Mikko: There are no alternatives, you just need to live with growing pains and user complains (reply to 109433)

Abdulaziz: Tonkeeper, mytonwallet, tonhub. They just show error message: failed to check transaction (reply to 109434)

Pasha: Testnet not working for everyone? I get an error when trying to deploy my contract  <title>sandbox-v4.tonhubapi.com | 520: Web server returns unknown error</title>.  Who has the same thing? Appriciate any help

Condz: hello

User<7317280605>: hi

Amir: does anyone know how to work with W5 wallet in Python? found nothing on the web

Mehdi: anyone facing pending hamster transaction?

Stephan: Hello guys, do you know, where i can find BOC code of transaction in ton scan or ton viewer?

Âmin: × python setup.py bdist_wheel did not run successfully.   │ exit code: 1   ╰─> [1 lines of output]       error: command 'gcc' failed: Permission denied       [end of output]    note: This error originates from a subprocess, and is likely not a problem with pip.   ERROR: Failed building wheel for crc16   Running setup.py clean for crc16 Failed to build crc16 ERROR: ERROR: Failed to build installable wheels for some pyproject.toml based projects (crc16) ((Bot6:3.10)) [darsijoo@amsterdam-05 Bot5]$ pip install ton   i am trying to install ton library

Token: show us transaction (reply to 109458)

Captain: (scammers don't even bother)  Hello everyone, How does dexscreener and dextools etc get the latest transactions for a token? I tried using websockets on tonapi. and "tonweb.BlockSubscription" using toncenter.  I am not able to get transactions for a pool as fast as dexscreener. How are they doing it!?

Řemmǒřẽ: Hi, what is this?🫥

Řemmǒřẽ: Strange

Řemmǒřẽ: Is the wallet creator frozen?

&rey: Someone created a token, and transferred its ownership to a zero address instead of the null address. That does not make much difference as no one can mint that token directly anyway.

Řemmǒřẽ: Thank you for the valuable information. Can I read more about this somewhere? (reply to 109487)

&rey: Well, that's not a separate topic of study but simply application of TON knowledge several times. (reply to 109488)

Řemmǒřẽ: Then I'd like to clarify some points, if you don't mind. It's a native token of the CATIZEN project. Did they "transfer the rights" to a zero address that no one owns? Or how?🫢 (reply to 109489)

Alver: Hello, i want to send a message but i cannot see the "Congratulations" part in my tonkeeper wallet transaction, this is how the message is built  cell msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(sender_address)     .store_coins(const::tons_reward)     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_slice("Congratulations") .end_cell();  send_raw_message(msg, 1);

Alver: It is testnet

&rey: For message to be parsed as text comment, it must have zero opcode (.store_uint(0, 32) before text itself) (reply to 109506)

Alver: thank you

— 2024-09-27 —

Legend: Hi, everyone. Nice to meet you

Akachi: Interested (reply to 106951)

Akachi: Need to check how did you implement useTonClient() (reply to 106957)

Akachi: import { TonClient, WalletContractV4, internal } from "@ton/ton"; ... const endpoint = await getHttpEndpoint({ network: "testnet" });  const client = new TonClient({ endpoint }); ...  This is the simple fix. (reply to 106957)

Legend: Yes (reply to 106882)

hk: hi, guys, can anyone tell me how to parse tx hash from boc?

G: Hey guys, I have a transaction but the jetton transfer was failed. but there wasn't a place to see what is the exit code from toncenter api. Could someone help me?

G: Here is the toncenter api result  {"account":"0:BBA46A70B8F53F8EB69BFB6CA6FA09D3D1625167B0DA6655B285EC6BC99BF6D5","hash":"oV0x1u2UshKfsFnaXip3h35tXU8mo/8rUN9K8OvyNIw=","lt":"49484899000001","now":1727399556,"mc_block_seqno":40666781,"trace_id":"oV0x1u2UshKfsFnaXip3h35tXU8mo/8rUN9K8OvyNIw=","prev_trans_hash":"sTo6r5h8aCluJaTRU72BwzIhJEdXpOY3DsM0wVUI7bE=","prev_trans_lt":"49467452000002","orig_status":"active","end_status":"active","total_fees":"3370057","description":{"type":"ord","aborted":false,"destroyed":false,"credit_first":true,"storage_ph":{"storage_fees_collected":"16862","status_change":"unchanged"},"compute_ph":{"skipped":false,"success":true,"msg_state_used":false,"account_activated":false,"gas_fees":"1975600","gas_used":"4939","gas_limit":"0","gas_credit":"10000","mode":0,"exit_code":0,"vm_steps":143,"vm_init_state_hash":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=","vm_final_state_hash":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"action":{"success":true,"valid":true,"no_funds":false,"status_change":"unchanged","total_fwd_fees":"806400","total_action_fees":"268795","result_code":0,"tot_actions":1,"spec_actions":0,"skipped_actions":0,"msgs_created":1,"action_list_hash":"8T9+t0xaCP91gbbS79K4gOiHIM9xIbqnDLT8vH2znK8=","tot_msg_size":{"cells":"3","bits":"1521"}}},"block_ref":{"workchain":0,"shard":"B000000000000000","seqno":45902953},"in_msg":{"hash":"uM6shYicqccpCypMTmJ1/7IpTdcg/F7tBELKgLjOCU4=","source":null,"destination":"0:BBA46A70B8F53F8EB69BFB6CA6FA09D3D1625167B0DA6655B285EC6BC99BF6D5","value":null,"fwd_fee":null,"ihr_fee":null,"created_lt":null,"created_at":null,"opcode":"0x7369676e","ihr_disabled":null,"bounce":null,"bounced":null,"import_fee":"0","message_content":{"hash":"JaWjEO1pP5Id12NSu9YPU7TLSY0TgIe8BCowYY7Nukk=","body":"te6cckECBgEAAQEAAaFzaWduf///EWb2B6oAAAABuqdrF/II89c5FjK6Nqp5ctBulo30xN2oG40F2OPauA0E+rFYyaVIjA6t1tp47aV08PsLD0jkzbNevqeCsk/nwKABAgoOw8htAwIDAAABaGIAN/YkLkGw084aL+ipXIe6ddcqMfkFqIFAd+00QVeAY1egF9eEAAAAAAAAAAAAAAAAAAEEAbIPin6lAAAAAAAAAABejUpRAAgBrEj7UFxGngh5dcjGpPGwAV0P4x6gNQ8zzvAmZp4gEy0ALukanC49T+Otpv7bKb6CdPRYlFnsNpmVbKF7GvJm/bVIAmJaAQUAGgAAAAAxYTZkNzYwZWbmjXyY","decoded":null},"init_state":null},"out_msgs":[{"hash":"2Cu9Yg2eW9jojsSWLtIZeOoiGPz3Bo7d2PtcoRd5VWs=","source":"0:BBA46A70B8F53F8EB69BFB6CA6FA09D3D1625167B0DA6655B285EC6BC99BF6D5","destination":"0:6FEC485C8361A79C345FD152B90F74EBAE5463F20B510280EFDA6882AF00C6AF","value":"50000000","fwd_fee":"537605","ihr_fee":"0","created_lt":"49484899000002","created_at":"1727399556","opcode":"0x0f8a7ea5","ihr_disabled":true,"bounce":true,"bounced":false,"import_fee":null,"message_content":{"hash":"quHAjvd8Zy4AUBbPVdRT2904xlwUC5a27dwgs67VccM=","body":"te6cckEBAgEAawABsg+KfqUAAAAAAAAAAF6NSlEACAGsSPtQXEaeCHl1yMak8bABXQ/jHqA1DzPO8CZmniATLQAu6RqcLj1P462m/tspvoJ09FiUWew2mZVsoXsa8mb9tUgCYloBAQAaAAAAADFhNmQ3NjBlZr2BXOc=","decoded":null},"init_state":null}],"account_state_before":{"hash":"qb5IYxzzN59givSznPMFTdmXpp4eyhhkGOtedjzwuTo=","balance":"98073454","account_status":"active","frozen_hash":null,"data_hash":"c1sI+ZzmjOX8IsijewbPjK32dyV4ykP+EeUD9Cg2ACk=","code_hash":"IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8="},"account_state_after":{"hash":"bwFs6rNV1Bg+KCPZ3KdmyJvtghulJvquoEDCXIBfCQE=","balance":"44165792","account_status":"active","frozen_hash":null,"data_hash":"Fb95OIfHe30ENwFXbkGoIrJU4jpM3NG0tIhrYWWrLDg=","code_hash":"IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8="}} (reply to 109561)

Nhat Nguyen: const internalMessage = internal({          body: messageBody,          bounce: true,          to: jettonWalletAddress,          value: '0.1',        });  I create transaction jettons but i don't know what value does. How are they calculated?

Haint: just hardcoded it, the unused ton will be returned back to you (reply to 109577)

Nhat Nguyen: If the value is too small, will it lead to transaction failure? Is this value the same as transaction fee? (reply to 109578)

tp: Hi, does anyone know, why fwd_fee + gas_fee + storage_fee + action_fee < total_fee

Haint: yes and yes (reply to 109579)

Derick: Hello everyone, the deployer address generated with the same mnemonic is different from the address in Tonkeeper. How should I resolve this?   `jetton-implementation-in-tact % yarn deploy yarn run v1.22.22 $ ts-node ./sources/contract.deploy.ts EQAOulQ7GUAMsv1URV6-nB7TqF5UPTY0IZS2JjO8rzE5VDTI`

Derick: let mnemonics = (process.env.mnemonics_2 || "").toString(); // 🔴 Change to your own, by creating .env file!     let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));     let secretKey = keyPair.secretKey;     let workchain = 0; //we are working in basechain.     let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });     console.log(deployer_wallet.address);

Kapil: Is it possible to make the staking contract in ton

Token: sure (reply to 109595)

Token: why can't? (reply to 109595)

sangmin: hi~  Is there anyone who is directly managing a ton-indexer? If so, how did you resolve the issue of PostgreSQL performance degradation as the database size grows significantly?

Nhat Nguyen: how to check balance jettons before transfer to handle error?

Aneesh Sharma: Hello There, How can we check the status of the Game we uploaded on Tapp store?

Aneesh Sharma: It has been more than 40 days and we haven't received the update

6️⃣0️⃣truth: hello fam, where to get the Ton connect API please ?

Legend: I can do that (reply to 109595)

Kapil: Can you share me the code if possible (reply to 109618)

Legend: DM (reply to 109620)

Group Admin: Hi All,  any one know solution for this , Thanks .  {"error": "failed to get account state: lite server error, code 651: too big masterchain block seqno"} @admin

Harshit: hello, i need help regrading the token transfer from the backend, so it will be helpful if anyone can help me

Haint: no way to do that (on contract) (reply to 109608)

Armin: https://tonapi.io/v2/blockchain/accounts/{your jetton wallet address}/methods/get_wallet_data (reply to 109608)

Armin: Find your jetton_wallet address. Then use this url. It returns your jetton balance in hex format, convert it to decimal. (reply to 109627)

Token: we are lost. your backend means contract? (reply to 109624)

Mohammed: I can do it . DM (reply to 109632)

Pushkar: hello

Pushkar: i want to send usdt from one wallet to another using tonconnect or any other code ton library(js) help

Nhat Nguyen: private async getTransactionInfo(address: Address, hash: string) {      console.log('🚀 ~ TransactionService ~ getTransactionInfo ~ hash:', hash);      try {        const res = await this.client.getTransactions(address, {          hash: hash,          limit: 10,        });        console.log('res', res);      } catch (error) {        throw new HttpException('Get transaction Info Error', error);      }    }  How to fix: AxiosError: Request failed with status code 503

SunG: Hello, I have got a send message error: 8 cell overflow. How can I fix it

.: How I can get usdt ton abi

Champer Wu: Why you need abi ? (reply to 109643)

Harshit: No, actually I am working on a script to transfer ton tokens (airdrop ) to multiple users from the backend (server) (reply to 109632)

Jin Crypto: hello everyone . How to send jetton token (HMSTR) to orther wallet ?

TON Bounty Bridge: ​Access blocked  Created by Shaassss

.: is there a way to send usdt in ton network without abi? (reply to 109644)

Nhat Nguyen: I have issue: when create transferJetttons how to check transaction Failed  or Success?

Champer Wu: You just need to assemble the boc for sending internal message to your Jetton wallet then the transfer would be implemented as following this way to assemble your message https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/test/lib/jetton-wallet.ts#L9 (reply to 109660)

Haint: 8 means you store more than 1023 bytes/4 references in a cell (reply to 109641)

Victor: hello guys, i need help...

Victor: "te6cckECCAEAAcsAA7N1PJuDvnD/BOh0b38AMvjbdWrmdR6A1Dp3c2ynucTRINAAAs+dsyhQP36MKlEl/n+0i8SNUnOjhMAeigkl/SGQ5oUoI8ZTtifAAALPh8mlKBZvQqPAABRT+WgBAgMBAaAEAIJyZYRAbq00oUeAe6V9tG8QGCb7OVpw9MEH3pvwIG/UT7d+wjiBAkV49jO762miY72U7R/+BiKA5UItXcSzKiBa2AIXBIDiyQC+vCAYU4gRBgcBsWgApf2TAerIQ/CddiGAkXE4JGGdoN1B2u7XeaYxRhBSHrUAFPJuDvnD/BOh0b38AMvjbdWrmdR6A1Dp3c2ynucTRINQC+vCAAYMhDIAAFnztmUKBM3oVHjABQBtD4p+pQAAAAAAAAAAQF9eEAgBH1k+UrADF0IqBYEOI2LgLB7XsuGXRbE5X0WW8NzOskwgCYloAgCcJ8wHoSAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFvAAAAAAAAAAAAAAAABLUUtpEnlC4z33SeGHxRhIq/htUa7i3D8ghbwxhQTn44EZ6mjcQ=="  this is body data from transaction. Could you recommend me how to decode?

Victor: this is Jetton Transfer Message (reply to 109669)

kevin: what's the transaction ID ?   is the contract verified ? (reply to 109669)

User<7466683040>: hi

.: Thank you. What about ton space(telegram wallet) (reply to 109665)

Lich King: Hey guys, if you build a cex for example, is it actually necessary when you send a jetton withdrawal to also send a forward ton amount to notify the main wallet of user? The user will still end up with the coins in his wallet so not sending forward ton amount would decrease the overall withdrawal costs, right?

Champer Wu: what’s the topic you are asking? ton space is an interface for interacting with wallet contract , it the same application such as tonkeeper, mytonwallet, and openmask (reply to 109682)

PtcBink: There is no way to send USDT without contract. (reply to 109660)

PtcBink: We have plan to build something like sunpumpfun.

PtcBink: Anybody with exp in ton pumpfun? DM me.

final: Does anyone have mining Jetton contract?

Degen: Why does the nft collection fail to send messages to the nft item in part during batch mint?

Degen: But next_item_index is already used

Dmitriy: It’s recommended to always attach at least 1 nanoTON as forward_ton_amount to make transfer_notification message appear in the blockchain, so wallets/explorers can see it (reply to 109687)

Mohammad: Hey guys Can someone please explain what does this line mean?  int right_shard? = sender_address.slice_check_prefix(my_address().preload_bits(2 + 1 + 8 + 4)); ;; constructor + anycast + workchain + part of hash  and why should someone check the request came from the same shard?

Omid: Thief beware

NPA120: Is it possible to call the smart contract write function via Ton explorer like tonviewer?

&rey: No. There are no "calls" or "write functions". (reply to 109756)

&rey: Contracts process messages, mainly internal; to send one, you need to pay from a wallet. (Actually, all TON transfers are internal messages.)

Abdulaziz: $extMsg = $wallet->createTransferMessage(     [         New Transfer(             dest: new Address("EQCrrSblmeNMAw27AXbchzG6MUja9iac7PHjyK3Xn8EMeqbG")             amount: Units::toNano("0.012"),             payload: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",             sendMode: \Olifanton\Ton\SendMode::PAY_GAS_SEPARATELY,         ),     ]  Why it didn't worked

Abdulaziz: It doesn't accept urls as message or what? (reply to 109767)

Kings: Hello. Does anyone use python in using tonsdk?

&rey: @npa120 To do so, you need to reconsider architecture.

NPA120: Signature is a solution? (reply to 109772)

&rey: Almost. (reply to 109775)

&rey: I think I'll run a lecture on that during Hack-TON-berfest instead of trying to explain over and over.

NPA120: In tx data, anybody can see smart contract function name?

&rey: In tx data, anybody can see raw bits+refs of payload; anybody can also see data+code of contract; those can be matched to somewhat interpret the message. (reply to 109780)

Token: ? you can generate 10 wallets and request 5 ton each wallet (reply to 109785)

Akachi: How did you create client? (reply to 109639)

Akachi: Can I check your code occurring  that error? (reply to 109641)

User<729694406>: help me, does anyone have this error when getting balance jetton

User<729694406>: "http provider parse response error"

Bogdan: Could somebody explain me how Hamster Kombat gave me tokens without transactions? I see jetton, but there are no transactions? At least should be contract deploy 💁‍♂

Mr. Barry: hi guys who can help me with my project

Lynqoid: Are they using the new mintless deploy jettons? I read about that somewhere (reply to 109814)

Akachi: Interested (reply to 109817)

Mr. Barry: dm me (reply to 109819)

Bogdan: have no idea. There are no any information by the address. You can see in my jettons Hamster and there are noting inside UQBUIb8KYU9jjj91cAEH6FEZh_961Uoj5w2josbyt8pLpmgO (reply to 109818)

Mr. Barry: I am recruiting experienced developers for my project, write to me if anyone is interested!!

Bogdan: Yep, you are right, thanks! (reply to 109818)

User<7265582009>: hi, please Dm me (reply to 109827)

User<7464188086>: Hello. How are you? I wanna contribute your project. (reply to 109827)

Ricky: I'm looking for tact developers, who are also aware about solidity.  I've got a paid gig & full-time job for my startup.  Anyone interested, please drop a dm

RDx Likhon: Hum please (reply to 109873)

661XRATED666: https://warpcast.com/~/invite-page/367039?id=b49b0a1d

— 2024-09-28 —

The Max: Hello everyone! Could you advise how to implement a jetton claim for users?  As I understand, the current system works similarly to SBT NFTs. The backend checks if the user is eligible for minting, the user sends a transaction with extra gas, the admin wallet mints the SBT NFT and sends it to the user.  What alternatives are available at the moment? Mintless jetton is not working, because token already exist.

Luke: how can i send arbitrary messages from my walle

Luis | BitsLab(MoveBit/TonBit): https://ctf.tonbit.xyz/ Ton CTF is live! Please try it out!

Luke: error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction E87F659B1C7B1B5BD8C1032E628D23955421C3293A14F018BA50B33E851F3D70:\n' +         'exitcode=0, steps=0, gas_used=0',  anyone know why this is happening?

Eric: Please help When interacting with the ton token contract in ton wallet, this error message is reported. Can anyone help analyze the reason? (The ton token balance is sufficient)

Group Admin: hi all . dose any one know  the solution for this , we are stuck here . (reply to 109622)

♍♑ℹ️💲⛎: Dear Devs I have a KYC issue on my wallet  previously I have passed Extended KYC, but  When I tried to pass Advanced KYC, they rejected me. what should I do?

Jason-Bitslab: TON CTF Competition is Officially LIVE! 🚀  Attention all #FunC and #Tact developers, the TON CTF competition has officially begun! This is your chance to showcase your skills, climb the leaderboard, and compete for a share of the $10,000 prize pool.  Competition Timeline: - Start Time: September 28, 2024, 1:00 AM UTC - End Time: September 29, 2024, 1:00 AM UTC  To all registered participants, now is the time to shine! Solve challenges to earn "flags," rack up points, and aim for the top of the leaderboard as you sprint towards the $10,000 prize pool!  Seize the opportunity, show your skills, and win big! 💪

Ankul: Can i recover my tonspace wallat in telegram

Ankul: Please recover my ton space

&rey: No one can do so, even if they claim that they can in DM.  To send anything from your wallet, mnemonic is needed; if you have kept it, you can use it in any wallet app you like (from https://ton.org/wallets/). (reply to 110002)

Sam: i want jetton wallet address from master address but https://tonapi.io/v2/blockchain/accounts/0%3Ac77306e1acbcc711de1686b7336955ca4a78af9f0300629b54b696a66a888b8d/methods/get_wallet_address?args=0%3A8f9d150d5fb3d915034851d59397840e6432283c15860a770a5f75c3465c6084 get_wallet_address returns some error code without details how i must use this method? (i am using tonutils lib)

crypto cobra: Hi I was wondering if someone could double check this contract to see if it was done right? I got the tokens in my wallet but it says unverified

crypto cobra: EQBDuhmuDZaj3CbQDDMKWn3do2T9YjuHVb0z7-_dDh3iPmGk

Олег: Hi, have someone worked before with mintless jettons or merkle tree implementations on TON? Would like to chat with u Thanks

Mohammad: Hey everybody I wanted to mint some jettons on testnet using jetton_wallet_v2 (storing wallet code as library cell) but I don't know how to deploy wallet code as a library. I used NotCoin deployLibrary script on testnet but using this wallet code on testnet gives me (exit_code: 9) everytime I try to mint new jettons. Can someone help me please.  https://testnet.tonviewer.com/kQB_mbuQ72BtkU_-TLg1_QDM6-7bgUe7QmDIwz6c9PHxo8JU

abc: Hello everyone, does anyone know how to upload a game to App Center？ I submitted the information to the review bot, and it indicated that it will take two months

Akhenaten: UQBRqN_ZRiab_9nQJLm62rwsSchJF76Qc6wa4Gs8NLHVyBKM

1: hello, everyone, i have a question, i have 12 word generate by bip39, how to get address and private_key with python

User<5333494358>: /stat@combot

Grigoriy: hi, how read stringTale on func?

Danial N: https://tonviewer.com/EQDd3T_eBjkxGyiC-RtRSHtc4DC_TyvR2etXlmdeOPWlsxgW  What is this? non wallet? what type is that ?

Tommy: Happy weekend! 🌟 Hope you get some time to relax and recharge. Enjoy it to the fullest, and I look forward to catching up next week!

Mohammad: I think this can be helpful:  _ load_text(slice cs) inline {     int len = cs~load_uint(8);     slice text = cs~load_bits(len * 8);     return (cs, text); }  _ load_text_ref(slice cs) inline {     slice text_cs = cs~load_ref().begin_parse();     slice text = text_cs~load_text();     return (cs, text); }  builder store_text(builder b, slice text) inline {     int len = slice_bits(text);     (int bytes, int rem) = len /% 8;     throw_if(err::invalid_length, rem);     return b.store_uint(bytes, 8)             .store_slice(text); } (reply to 110080)

Mohammad: anyone?😢 (reply to 110043)

Grigoriy: yes, thanks, i did this  int lenByte = slice_bits(in_msg_body); slice newDescription = in_msg_body~load_bits(lenByte); (reply to 110093)

Grigoriy: And another question, is it possible to replace something in the hashmap in func, rather than create a new one?

Sam: my account have already 785 HMSTR token and tonviewer confirm that: https://tonviewer.com/EQBU_mDD3L5rrBhORS_5JGKuPcPrjfk4xvl2JKCnpnaojib9?section=tokens but with tonapi https://tonapi.io/v2/accounts/UQBU_mDD3L5rrBhORS_5JGKuPcPrjfk4xvl2JKCnpnaojns4 say account do not exists why this happen? or another example this account have 777 HMSTR https://tonviewer.com/EQC6fmzxgho4nQ22mxxCPtQAx27f8Cw8WZZuSe6K3Rti1yWu?section=tokens but with tonapi jettons https://tonapi.io/v2/accounts/EQC6fmzxgho4nQ22mxxCPtQAx27f8Cw8WZZuSe6K3Rti1yWu/jettons there is not any jetton balance ~?

Sam: Pls help me  It's urgent (reply to 110100)

Rayan: Hi, is there anyone here with experience with running TON Node? If yes, we will pay for your advices.

PtcBink: Great

Shon: https://tonapi.io/v2/accounts/EQBU_mDD3L5rrBhORS_5JGKuPcPrjfk4xvl2JKCnpnaojib9/jettons/EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo?supported_extensions=custom_payload  https://github.com/nessshon/tonutils?tab=readme-ov-file#mintless-jetton-eg-hamster (reply to 110101)

Rayan: Hi, have you done this? (reply to 110109)

Ray: Haloooooo may i know new dev here in TON?

User<7317280605>: hello. do u find developer? (reply to 110120)

darshan: How to withdraw in toncoin in tonviewer

&rey: Tonviewer is intended for viewing blockchain only, not changing it. (reply to 110142)

Ray: Yeah (reply to 110126)

User<7317280605>: I am a developer. I can help u. (reply to 110150)

User<7317280605>: this code seems correct. but I can't tell exactly with this code alone. what's wrong? (reply to 110152)

User<7464188086>: NO (reply to 110120)

User<7317280605>: What format is the secret key in? (reply to 110156)

User<7317280605>: When you use bip39.generateMnemonic(256), you're generating a 256-bit mnemonic, which corresponds to 24 words. Ensure that this is what you intend, as standard mnemonics are often 12, 15, 18, or 21 words. (reply to 110162)

Kings: Yes. I am sure about that. Can you help me to get the signature? Or maybe you know the documentation or code sample to get it. (reply to 110163)

User<7317280605>: const bip39 = require('bip39'); const nacl = require('tweetnacl'); const crypto = require('crypto');  // Function to generate a new mnemonic function generateNewMnemonic() {     return bip39.generateMnemonic(256); // 24 words }  // Function to get the key pair from the mnemonic async function getKeyPairFromMnemonic(mnemonic) {     const seed = await bip39.mnemonicToSeed(mnemonic);     const keyPair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32)); // Use the first 32 bytes     return keyPair; }  // Function to generate a signature function generateSignature(message, secretKey) {     const hashedMessage = crypto.createHash('sha256').update(message).digest();     const signature = nacl.sign.detached(hashedMessage, secretKey);     return Buffer.from(signature).toString('base64'); }  // Main function to execute async function main() {     // Step 1: Generate a mnemonic     const mnemonic = generateNewMnemonic();     console.log("Mnemonic:", mnemonic);      // Step 2: Get the key pair     const keyPair = await getKeyPairFromMnemonic(mnemonic);     const { secretKey, publicKey } = keyPair;      // Step 3: Create a message     const message = "ton-proof-item-v2/sampleAddress:example.com:" + Math.floor(Date.now() / 1000) + ":samplePayload";      // Step 4: Generate the signature     const signature = generateSignature(message, secretKey);     console.log("Signature:", signature); }  main().catch(console.error); (reply to 110164)

Lucas: Hello, how can I get the jettons from a wallet with ton/ton or tonweb using typescript?

Lucas: I prefer not doing that with APIs to prevent any rate limits

Kings: In getting signature. No need to use pubkey? (reply to 110165)

&rey: Have you also provided wallet StateInit? (reply to 110155)

isik: How can I distinguish between jetton transfer and dex swaps, they both have the opcode 0x0f8a7ea5.

&rey: They are pretty much identical from blockchain perspective (because swaps == transfers). Well, you can look at forward payload and check if it contains some order for making a swap. (reply to 110210)

isik: Thanks man, I was thinking about that, if there is no forward payload than we can call it jetton transfer and not swap I guess. Am I right. Also I couldnt find the info in the decoded message about which jetton is sent. (reply to 110212)

&rey: well, that is determined by the two jetton wallets in transaction tree (reply to 110213)

Jason: How do you start a telegram channel?

DNA: Tap pencil - new chanel (reply to 110223)

Kings: Yes sir (reply to 110191)

isik: Oh I see the jetton wallet but how can I understand which jetton’s wallet is it. Any api I can get that info. Since each jetton has it’s own wallet.  Any way I can get the wallet’s assets can solve my problem. (reply to 110218)

RadolyTech🍅: Paid task? (reply to 109708)

— 2024-09-29 —

Alex: Hi guys, do you know how to create a contract with automatic deposit and withdrawal function on TON chain?

Nhat Nguyen: Can someone tell me. When handling transfer jettons in Back-end how to know transaction success or failed.

Leonardo: hello，how use mytonwallt sign self msg，like metamask

TON Bounty Bridge: ​Swagger-like toolset for interaction with contracts and TL-B  🏷 Developer Tool  Summary:My main goal is to solve this problem (and some more problems), to make a specification (let's call ...  Created by voloshinskii

darshan: Bro how get blockchain into toncoin

darshan: Tell us

darshan: My payment send in blockchain view tell us

&rey: This question is impossible to parse, and seems like offtop for development chat. Nevertheless: what do you have, and what do you want to get? (reply to 110274)

darshan: I have how to withdraw toncoin in tonviewer

&rey: It's still unclear. Where are TON now, and where you want them to be? (reply to 110285)

Fawwaz: Everyone, does anyone have the code to send jetton (dogs) in wallet v5?

Mohammed: I have (reply to 110288)

Fawwaz: Can you share with me? I would appreciate it. (reply to 110289)

Dmitry | backend4you.ton: Tonviewer is only a viewer. To “do” something - you need a wallet app, for example Tonkeeper. You can send only from account/address you have “mnemonic” (24 words) for, so wallet app will ask you this words, and then you’ll be able to send something somewhere. (reply to 110285)

kevin: failed to send message: lite server error, code 0: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 771BE310FFA2362C4AFD018BD2BEF7070F6BDD5BE174E45C7B94CA4C955DA922: exitcode=0, steps=0, gas_used=0   anyone known why this， seems exitcode is OK but liteserver fail to process it。

yash: Any funcc devs who want to work on a cool project?

Олег: Hi guys, I want to dive into ton development, where can I find guide? I want to deploy a token

Олег: I also want to use merkle tree implementations to create ICO contract

My: /

Mikko: Here https://tact-lang.org/ (reply to 110302)

Олег: Thx! Any good blueprint docs? I want to call an existing contract, but haven’t found appropriate guide (reply to 110309)

Mikko: It's a new, rough, ecosystem. Do you expect your dinner served on a silver plate. You need to work for it. (reply to 110310)

Mikko: Here is some more example code https://github.com/howardpen9/jetton-implementation-in-tact

Олег: But is this even possible with it?

Mikko: Yes it is possible (reply to 110313)

Mikko: You can also have Tact programming group here https://t.me/tactlang - but please learn the basics first

Олег: I’m coming from solidity lang I guess they are similar in some way

Mikko: Yes, it helps a lot. The main difference is that Solidity is synchronous while Tact/funC is asynchronous and message based. Creates a lot of added complexity, but the chain scales much better.

Олег: Heard of it

Mikko: Note that this is not unique to Ton, but similar characteristics are on Near, others.

Олег: Good to know, thanks

&rey: It hinders a lot, in my experience when explaining some concepts. (reply to 110316)

Max: Hi everyone, How can i get holder address by library code hash?

&rey: You can't; in particular, because there might be multiple holders. (reply to 110325)

Abdulaziz: Is there multisign wallets on ton? I mean can i create my own, bitcoin tron already has this feature (reply to 110334)

&rey: There are. There are interfaces like https://multisig.ton.org/# indeed, though I don't know if they work well. (reply to 110342)

Abdulaziz: But can i create this multisign wallet via deploying smart contract? (reply to 110344)

Max: The library code can have multiple holders？ (reply to 110334)

&rey: Yes, as multisig wallet is a contract. (reply to 110345)

Max: Can I find out which contract holds that wallet code? (reply to 110352)

Max: I want to find that the USDT wallet code holds a contract on master chain🤣

Max: I want find the contact which call set_library_code for save USDT wallet code on masterchain

Abdulaziz: Also can i create wallet contract with my own rules? For example they cannot send single nfts (reply to 110352)

&rey: Probably any of them? So, if you have multisig EQTiN..., then contract EQTiN... holds its code. (reply to 110353)

Max: Sorry for misunderstand. I want to finds the Librarian contract address (For wallet code saved on masterchain). (reply to 110362)

Max: Not the Librarian sender address

Rudolf: Does anyone have an example of transferring mintless tokens from tonconnect to js/ts? Like the one here https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer-with-comment

Max: For example I want to finds the code hash: 8f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68 (From USDT master contract) holder contract on masterchain (should be a Librarian contract deploy on masterchain).

Abdulaziz: Why there is so many scammers on group, with fake whitepapers and etc

Mikko: Because Ton is a hot cryptocurrency ecosystem that is growing, it is easy for scammers to find prey here. Also it is easy to create bot/fake accounts on Telegram. (reply to 110371)

Abdulaziz: TON participants are mostly newbies on crypto (reply to 110372)

Амир: So you answered your own question (reply to 110373)

Abdulaziz: He looks like scammer (reply to 110375)

Mikko: What do you mean? (reply to 110382)

TON Bounty Bridge: ​Typescript TLB-codegen fixes  🏷 Developer Tool  Summary:Fixes forhttps://github.com/ton-community/tlb-codegen  Rewards: • Estimated reward: 1465 usd • Estimated deadline: 10 September 2024  Created by PolyProgrammist

Mikko: Like with all blockchains, including Ton, you cannot generate random numbers this way, because the inputs can be controlled by a validator. (reply to 110385)

Mikko: You need to use an oracle. I am not sure if randomness oracles for Ton exist yet. (reply to 110387)

NPA120: yes , I have (reply to 109709)

NPA120: yes I have a rich experience in it. I have a demo version (reply to 110244)

final: can you share it with me pls? (reply to 110393)

Faheem: Gm

Soothereyougo: Hi is there a way to obtain more than 5 tons/hr ?

Kloy: If the validator gets slashed, where is the penalty deducted from? The validator's stake inside the nominator pool or?

Mikko: What do you mean? (reply to 110403)

&rey: From the validator's stake in the Elector contract. (reply to 110404)

Soothereyougo: The testgiver bot only gives 5 per hour is there a way to get more? (reply to 110408)

slavagm: you can buy it at Ton Console (reply to 110410)

Soothereyougo: Any more ways that i dont need to pay? (reply to 110411)

&rey: Apply to @f_closer explaining why you need testnet TON. (reply to 110415)

Soothereyougo: Alr ty

✨ Uni: buy test tokens for real money sounds good (reply to 110411)

Aleks: Hey guys. This is a Toncenter API plan. Anyone knows if the 25 requests/sec apply to each key individually or it’s 25 req/sec for each keys combined?

slavagm: Testnet requires validation too (reply to 110420)

yarik: Does anyone know how I can call this exact smart contract?

Abráyàdh🐺: Hii does TON have an EVM compiler ?

&rey: No. At least because it has different contracts architecture. (reply to 110427)

Abráyàdh🐺: What would be the best approach when bridging an EVM project to TON? (reply to 110428)

&rey: Start from ideas (what assets) must be moved (where) and (when), forgetting EVM architecture solutions. (reply to 110429)

Abráyàdh🐺: Got it, why i asked is because we have the product built and live on arb.  Looking for opportunities but yea could be a lot more than i thought (reply to 110432)

Alex: Hey devs, can somebody please share an example how to deploy smart contract writen in Tact? I creaded templated, and i' aware how to deploy it manually with blueprint. BUT, now i need to deploy contract from my backend with different params.

Mohammad: How to reserve exactly x TON of incoming msg_value?

Zeynab: Hey @pcrafter, I am trying to use HashEXT_SHA256 to hash large amounts of bits. I want it to have a result exactly as sha256 in Solidity, but in solidity my input data is in bytes, whereas in FunC the asm function receives slices as input. Is there a way I can give ints to this function? Besides that, I need to hash the result of the previous hash, so I think I necessarily need to have a way to hash integers.  Thank you in advance

&rey: begin_cell().store_uint(x, 256) (the asm function may receive builders as input as well)

Артём: Good evening! Tell me please  where to find examples of contracts for sending tokens like TON, USDT and other written in Tact?

&rey: Like here https://github.com/ProgramCrafter/MulDEX/blob/8d0fa457a2b12339ae090ca2ffdc4cb354971ab0/contracts/multitoken_dex.tact#L139-L148, but you need to fix it in some places I don't remember. (reply to 110496)

Артём: Thanks (reply to 110497)

🆙 UXUY: Nhi mil rha (reply to 110509)

Meysam: https://t.me/gominerbot/start?startapp=cmVmZXI9NTc4ODk1

— 2024-09-30 —

D_d: guys in the example of tonnconnect I see line   // you can use signed boc to find the transaction      const someTxData = await myAppExplorerService.getTransaction(result.boc);  How actually I can get the transaction? what service to use? when I am sending transaction?

1: is it right?

final: Bro? (reply to 110393)

NPA120: Dm me (reply to 110552)

D_d: guys how to send myself TON on testnet?

User<7464188086>: Hello. I can't work with WalletContractV5R1. How to use sendTransfer?

D_d: what excatly you can't do?

D_d: guys I have amount like I need to sent 0.25 TON how from number 0.25 I can get nanotons for request correct amount of ton?

Anton: Does this page work for you?  https://docs.tact-lang.org/cookbook/jettons (reply to 110496)

TKAINU: Hello, I'm making a burn transaction from my contract. I want to know if the transaction was successful or not. How can I do that? Does this burn function return true or false status?

Dmitry | backend4you.ton: @testgiver_ton_bot (reply to 110554)

Dmitry | backend4you.ton: Multiply 10^9 (reply to 110564)

Dmitry | backend4you.ton: You can’t. Processing of your message will happen AFTER your code finishes execution.  You can only request new “failure” message, called “bounce”, to be sent to you in case of failure. Set bounce flag inside send-to-Jetton-wallet. You’ll receive it in separate transaction and will have to handle it “independently” (reply to 110569)

User<7464188086>: Hello. import { TonClient, WalletContractV5R1, internal, SendMode } from "@ton/ton"; import { mnemonicToPrivateKey } from "@ton/crypto";  const client = new TonClient({   endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',   apiKey: 'your-api-key', // Optional, but note that without api-key you need to send requests once per second, and with 0.25 seconds });  // Convert mnemonics to private key let mnemonics = "word1 word2 ...".split(" "); let keyPair = await mnemonicToPrivateKey(mnemonics);  // Create wallet contract let wallet = WalletContractV5R1.create({   publicKey: keyPair.publicKey,    workChain: 0, // Usually you need a workchain 0 }); let contract = client.open(wallet);  // Create a transfer let seqno: number = await contract.getSeqno(); await contract.sendTransfer({   secretKey: keyPair.secretKey,    seqno,   sendMode: SendMode.PAY_GAS_SEPARATELY,   messages: [     internal({       to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',       value: '0.05',       body: 'Example transfer body',     }),   ], });  And then how to get the transaction?

sangmin: hello, Does anyone use ton-indexer? The size of postgres capacity has severely slowed down query execution, has anyone fixed it?

D_d: guys on website ton whales you can enter boc string like te6cckEBBAEAtwAB5YgBjMX+8hju03Zm8LshWb3h1acCNfSaeNSbeVfLHBdhQjADm0s7c\/\/\/\/+s30VjgAAAAFc6IYYUanEtxSDGH9snK1LtuugVC8DFbw9incBU7rZTKQXRBXJqofaWHYBeofRMOn11mVkst8z79hwZT4Uc8PBcBAgoOw8htAwMCAGhCAHbCh725JT21X5zkt4J1kQgPLl+/uPBJK1sIgV87gzgpoHc1lAAAAAAAAAAAAAAAAAAAAABg1X8t and you will see parsed boc and first string is a hash of transaction. how can I parse this hash form boc string?

Champer Wu: https://docs.tonxapi.com/reference/build-a-defi follow up this tutorial (reply to 110573)

Hassan Isa: Hello good morning,,  Am still finding it difficult to deploy a token on TON,,  Please I need help on step by step guide,,  I run npm install ton@latest  And install all necessary dependancies,  But am having issues with my token_wallet.fc code.

Merlin: what is the issue? (reply to 110603)

Hassan Isa: I need a working source code for the token_wallet.fc I will share the code with you soon on what I did. (reply to 110604)

Dmitry | backend4you.ton: have you tried "reference jetton implementation" from https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md ? (reply to 110608)

TKAINU: Hello, I am building a jetton token, can I configure the jetton_wallet contract according to my logic?

TKAINU: when i call transfer error

TKAINU: i add only burn_jetton function, I don't know why it affects me when I use transfer

TKAINU: please help me

Akachi: const transaction = await client.getTransactions(wallet.address, { limit: 1 })   Use this one. (reply to 110573)

Hassan Isa: I sent you a DM kindly help me check it (reply to 110611)

Jaskirat: Hey Guys, I am facing ‘digest’ error issue when getting wallet address from web3 auth

Jaskirat: Does anyone have any idea regarding this?

Lucas | CryptoEngineer ✨: Hi, @everyone. Where can I find the other library such params.fc except the stdlib.fc?

Abdulaziz: Hi, i wanna know, if i wanna add nft mint feature on my webapp like notcoin, is ton sdk enough? Or i should write smart contract by myown

&rey: They are written for each contract separately. (reply to 110634)

Lucas | CryptoEngineer ✨: params.fc and op-codes.fc are not standard library? (reply to 110636)

&rey: Indeed they are not. (reply to 110637)

Lucas | CryptoEngineer ✨: Ok. I see. thanks (reply to 110641)

Abdulaziz: I want to do this. Add to some address the ability to mint nft, but that address not owner of the collection. And also at any time I should have the opportunity to change the address that can mintit nft (reply to 110641)

User<1934543593>: Hi ,  Everyone my bot add pay method with TON use telegram wallet , how to connect who knows? java

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 57 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 44  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Curio: Hi, im building a dapp on telegram, that requires to accept payments in usdt. I have been reading this part from the docs, https://docs.ton.org/develop/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses and i understand that i will have to create a wallet that receive that payments but im bit confuse about how to send jetton token from a jetton wallet. until now i have been able to send jettons and receive but from the main wallet that start with O.... but i would like to send the tokens that a wallet with address k... has, is this posible??  thanks!!

Pushkar: facing issue Buffer is not defined ReferenceError: Buffer is not defined

Pushkar: at ./node_modules/@ton/core/dist/boc/BitString.js (http://localhost:3000/static/js/bundle.js:24915:33)     at options.factory (http://localhost:3000/static/js/bundle.js:107136:31)     at webpack_require (http://localhost:3000/static/js/bundle.js:106531:32)     at fn (http://localhost:3000/static/js/bundle.js:106795:21)     at ./node_modules/@ton/core/dist/boc/BitBuilder.js (http://localhost:3000/static/js/bundle.js:24004:21)     at options.factory (http://localhost:3000/static/js/bundle.js:107136:31)     at webpack_require (http://localhost:3000/static/js/bundle.js:106531:32)     at fn (http://localhost:3000/static/js/bundle.js:106795:21)     at ./node_modules/@ton/core/dist/boc/Builder.js (http://localhost:3000/static/js/bundle.js:24939:22)     at options.factory (http://localhost:3000/static/js/bundle.js:107136:31)

Pushkar: issue of buffer not defined for react frontend ap

Johnny Le: let memoCell = beginCell()             .storeUint(msg.order, 32)                .storeUint(msg.level, 32)                .endCell();  here is my memo cell, then I got this raw body:    body:           is_right: false           value:             sum_type: Unknown             op_code: 1356125587             value: b5ee9c7201010101000e00001850d4d5930000000100000002  -> how can I decode value to order and level up there. Thank you

Curio: pnpm add @ton/ton @ton/crypto @ton/core buffer (reply to 110678)

George: Hi!  Can somebody help me with actual peers to prevent :  failed to download archive slice: [Error : 651 : no nodes]

Curio: some developer can help me to better understand this please? (reply to 110664)

Soothereyougo: İs it just me or the testgiver bot doesnt work rn

Zeynab: What if x here is a slice and not int? Can you kind of cast a slice to int in funC? (reply to 110474)

darshan: /stat@combot

D_d: You need install node polyfill to make it work (reply to 110678)

Pushkar: Can you provide answer in detail (reply to 110724)

D_d: Google it please. Buffer is part of nodejs it’s not in browser or your js app by default. Install package separately with npm or yarn (reply to 110728)

Mike: Hi! Can I get this data  "transaction_id": { "@type": "internal.transactionId", "lt": "26418198000001", "hash": "xtowD/c2LkXKZIhN1hjfzGVuCS775HpoOxx78bdohTE=" } from my frontend when a user clicks on the “Deposit” or “Sign transaction” button (library or sdk is not important as long as it is compatible with react)?

Abdulaziz: @pcrafter it's possible? (reply to 110655)

Token: sure, you have to update contract with Func for your own idea (reply to 110743)

Xinyao@InfStones: Hi team! Could you help with us: 1. Which type of token will be rewarded after staking the vesting token? vesting token or liquid token? 2. Is there any operation required to restore the validator if been slashed?

Akachi: const transaction = await client.getTransactions(counterAddress, { limit: 1 }) (reply to 110714)

Mike: Hello! Can I get this data "transaction_id": { "@type": "internal.transactionId", "lt": "26418198000001", "hash": "xtowD/c2LkXKZIhN1hjfzGVuCS775HpoOxx78bdohTE=" }, from my frontend when a user clicks on the “Deposit” or “Sign transaction” button (library or sdk is not important as long as it is compatible with react)?

Zakir: hello

Zakir: we are trying to parse latest network blocks using ton-indexer into sql db but its running exteremely slow any ideas on how we can speed it up? also latest block in the eta 40292899 does not match up to the one in tonscan for the latest block 40729621  [ 3][t 1][2024-09-30 13:32:12.863725537][IndexScheduler.cpp:174][!indexscheduler] Last: 38661803 / 40292899 Blk/s: 0.974538 ETA: 19d 8h 55m 11s Q[3M, 6b, 404t, 742m]

TKAINU: Hello, I would like to ask if it is possible to modify the code in jetton_wallet.fc? because when I edit the code in here, the functions will fail

Token: what do you mean? ofc possible (reply to 110770)

TKAINU: I want to build a deposit, withdraw jetton token system, and have a problem in the withdraw step. When calling withdraw, it will burn token A of the current contract, and return token B to the user, but I don't know if burning token A is possible. Is it successful or not? Is there any way to ensure that token A is burned successfully before returning token B to the user? Thank you very much. (reply to 110771)

&rey: Are tokens A or tokens B controllable by you, or they already exist? More precisely: which codes can you modify? (reply to 110773)

TKAINU: I can modify code A, and the withdraw function is in contract A (reply to 110774)

&rey: Then you don't need a withdraw function. Just create appropriate handler in jetton A's master, working at any burn notification.

User<6719407512>: Hi

Wiz: My gosh. After a week of 9 hour daily dev sessions and hiring a dev to help figure out why my game bot can’t be added to our group (web hooks, flask, not flask, phusion, not phusion, Apache handlers, wsig files, app debug remove for pass, secure port 5000’s and back end port openings) it looks like it’s over. Nothing worked. It might just not be added to groups.    Damn.

Web3: telegram wallet is a third party app thn how it got access to the telegram navigational menu?   How as a developer I can implement same functionality for my bot?

Farzin: hey guys ,  i'm  developing a dapp using ton tether usdt as user's deposit coin,  i need some tether test coin for init  jetton wallet addresses but i couldn't find anymore ? any idea ?

Mohammad: Hey @all Does anybody know where can I find jetton_wallet_v2? Specially what NOTcoin already implemented. I am getting exit code 49 on calling jetton_transfer operation but I can't find where it is throwing this error code.   here is my transfer message:  NOTE: I think the problem is with my forwardpayload but I don't know how to fix it!      builder msg_body = begin_cell()     .store_uint(op::transfer_jetton, 32)     .store_uint(query_id, 64)     .store_coins(jetton_amount)     .store_slice(to_address);          msg_body = msg_body.store_uint(0, 2);       msg_body = msg_body.store_uint(0, 1)     .store_coins(forward_ton_amount)     .store_uint(1, 1)     .store_maybe_ref(null());  default jettons only check this:  slice_bits(in_msg_body) >= 1  but jetton_wallet_v2 checks this:    if (s.preload_uint(1)) {         ;; forward_payload in ref         (int remain_bits, int remain_refs) = slice_bits_refs(s);         throw_unless(error::invalid_message, (remain_refs == 1) & (remain_bits == 1)); ;; we check that there is no excess in the slice     }  What should I do to avoid this exception while I have no forward payload?

Farzin: which db are you using ?  if you want to get hight write rates think about using dbs that is using log structured based storage engine (reply to 110757)

Zakir: postgress 16 (reply to 110834)

Farzin: also you could use some event store like kafka then process your data using multiple workers simultaneously  then use postgres batch insert functionality (reply to 110835)

Alexander: Is there any way to put 4 internal addrs into one cell?

Alan: Hi guys!  Do you know any tools for debugging ton transactions, such as tenderly. I have a transaction bounced on testnet? And i want to clarify what is the reason for the bounce.  https://testnet.tonviewer.com/transaction/c4c8e587353859c54de87ae6bdca3c8fc4e4bcd6316b243623a83273c960f38b

&rey: "Transactions tree" page, link "Debug details". (reply to 110841)

Paul: anyone doing the ton hackathon and would love another teammate? I am a 5x hackathon winner (grand prize winner for starkhack from ETHGlobal)

Paul: would love to participate with anyone already doing the hackathon 😄

Артём: Hello every one! Can you please share any ideas how to modify this smart contract(https://github.com/Gusarich/airdrop) to avoid user pays for Helper contract deploy when claiming?

&rey: Then you can use common jettons and mint 'em from backend. (reply to 110871)

— 2024-10-01 —

Jose Fabio: Hello. Can anyone please explain why mode 3 is bouncable? It seems counter intuitive that ignoring errors makes a message bouncable. Or why people use mode 3 instead of 1?

U: hi guys when I'm sending a jetton transfer I got exit_code 48

U: can someone help me to do jetton transfer (USDT) from the user's wallet to my wallet.

Sam: I can design script for you (reply to 110942)

&rey: User must send jetton transfer order to their USDT jetton wallet. This is commonly done via TON Connect 2. (reply to 110942)

U: thanks for the support. I figured it out. I just needed to send more TON coins for transfer (reply to 110948)

Оля: Hi 👋 I send a transfer message to the token and catch if it bounces But when processing the bounces it kicks out 9error code on the line ifnot (cell_null?(payload)) Sending message:   var msg_body = begin_cell()         .store_op(op::transfer)         .store_query_id(query_id)         .store_coins(amount)         .store_slice(receiver_address)         .store_slice(receiver_address)         .store_maybe_ref(payload)         .store_coins(0)         .store_uint(0, 1)         .end_cell();         var msg = begin_cell()         .store_msg_flags_and_address_none(BOUNCEABLE)         .store_slice(token_jetton_addres)         .store_coins(0)         .store_only_body_ref(msg_body);    return send_raw_message(msg.end_cell(), SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);  Bounce proccessing:      in_msg_body~skip_bits(32);      int op = in_msg_body~load_op();      throw_unless(error::unknown_op_bounced, op == op::transfer);      int query_id = in_msg_body~load_query_id();     in_msg_body~load_coins();     in_msg_body~load_msg_addr();     in_msg_body~load_msg_addr();      cell payload = in_msg_body~load_maybe_ref();      ifnot (cell_null?(payload)) {   ...      } What could be the problem? Error only when bouncing

User<6765041866>: Pls has anyone withdrawn from tondef? I want to know how real it is. I don't want to fall in hands of scammers again

Harpreet: Hey I wanted to know if there is some Loyalty NFT contract template. And would love if some thirdweb like platform for TON.

Phoenix: USDT transfer is same as jetton transfer. (reply to 110942)

TKAINU: Hello, in what cases after changing the code can I no longer upgrade to the old contract? I add some files to the old code and upgrade but the new code will not be accepted.

0xLlama: Who's in charge of partnership with ton ?  gotta talk

&rey: partnership@ton.org only. (reply to 110972)

0xLlama: Need to talk to real human not an electronic mail address (reply to 110981)

&rey: The tool you used for upgrade must've documented everything, because TVM itself only provides SETCODE. (reply to 110971)

Jaskirat: Hey  guys, I am unable to solve the digest error on the web3 auth library. Is there anyone who faced this?

&rey: Idk. Please note that people affiliated with TON Foundation do not DM first; look out for scam. (reply to 110983)

0xLlama: Aiit man thanks.  imma holla (reply to 110986)

Jaskirat: import { CHAIN } from "./constants/chain"; import { Web3Auth } from "@web3auth/node-sdk"; import { CommonPrivateKeyProvider } from "@web3auth/base-provider"; import { Buffer } from "node:buffer"; import { Web3 } from "./web3"; import { getHttpEndpoint } from "@orbs-network/ton-access"; import TonWeb from "tonweb";  const rpc = await getHttpEndpoint();  const tonChainConfig = {   chainNamespace: CHAIN_NAMESPACES.OTHER,   chainId: CHAIN.TON.id,   rpcTarget: rpc,   displayName: "Ton",   blockExplorer: "https://ton.app/explorer",   ticker: "TON",   tickerName: "Ton", };  const tonWeb3Auth = new Web3Auth({   clientId: process.env.CLIENT_ID!,   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, });  const privateKeyProviderTon = new CommonPrivateKeyProvider({   config: {     chainConfig: tonChainConfig,   }, });  tonWeb3Auth.init({ provider: privateKeyProviderTon });  class Web3Ton extends Web3 {   web3AuthInstance: IProvider | null = null;   privateKeys: string | null = null;   keyPairs: {     pub: Buffer;     pri: Buffer;   } | null = null;   tonweb: TonWeb;    constructor(sub: string) {     super(sub, tonWeb3Auth);     this.tonweb = new TonWeb(new TonWeb.HttpProvider(rpc));   }    async getAccounts(): Promise<string> {     try {       console.log("Fetching TON Wallet Address...");          const privateKey = await this.getPrivateKey();       console.log("Private Key:", privateKey);          if (!privateKey) {         throw new Error("Failed to retrieve private key");       }          const keyPair = this.getKeyPairFromPrivateKey(privateKey);       console.log("Key Pair:", keyPair);          const WalletClass = this.tonweb.wallet.all["v3R2"];       const wallet = new WalletClass(this.tonweb.provider, {         publicKey: keyPair.publicKey,       });          // Use the `getAddress` method to fetch the address       const address = await wallet.getAddress();  // Ensure this method is available       console.log("Wallet Address:", address.toString(true, true, true));          return address.toString(true, true, true);     } catch (error) {       console.error("Error getting accounts:", error);       return "";     }   }       public getKeyPairFromPrivateKey(privateKey: string): {     publicKey: Uint8Array;     secretKey: Uint8Array;   } {     const privateKeyBytes = new Uint8Array(       privateKey.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),     );        if (privateKeyBytes.length !== 32) {       const adjustedPrivateKey = new Uint8Array(32);       adjustedPrivateKey.set(privateKeyBytes.slice(0, 32));       return TonWeb.utils.nacl.sign.keyPair.fromSeed(adjustedPrivateKey);     }        return TonWeb.utils.nacl.sign.keyPair.fromSeed(privateKeyBytes);   }      async getPrivateKey(): Promise<string> {     try {       if (!this.web3AuthInstance) {         throw new Error("Web3Auth instance is not initialized");       }              const privateKey = await this.web3AuthInstance.request({         method: "private_key", // Custom method for fetching the private key       });              if (!privateKey) {         throw new Error("Private key not retrieved");       }          return privateKey as string;     } catch (error) {       console.error("Error retrieving private key:", error);       throw error;     }   }      async getBalance(): Promise<string> {     try {       const address = await this.getAccounts();       const balance = await this.tonweb.getBalance(address);       return TonWeb.utils.fromNano(balance);     } catch (error) {       console.error("Error getting balance:", error);       return "0";     }   } }  export { Web3Ton };

Jaskirat: This is my Ton Code, facing this issue after calling getAccounts()

Kapil: Can we send the message to the another contract  if the contract receives the bounced message

Dmitry | backend4you.ton: sure, you can do anything, "bounced" is only a flag in incoming message. but bounced msg contains only 256 bits of original one, so you should carefully design your original msg to be able to extract required (for new msg) info from bounced one. (reply to 110993)

Zakir: so u say to have indexer writing to kafka then to postgress that would be faster? (reply to 110838)

Kapil: can you tell error in this code (reply to 111000)

Aditya: Does anyone has any idead about this error Error: Invalid magic     at parseBoc (/Users/yudizsolutionsltd/Downloads/token-contract-main 4/node_modules/@ton/core/dist/boc/cell/serialization.js:160:15)     at deserializeBoc (/Users/yudizsolutionsltd/Downloads/token-contract-main 4/node_modules/@ton/core/dist/boc/cell/serialization.js:168:15)     at Function.fromBoc (/Users/yudizsolutionsltd/Downloads/token-contract-main 4/node_modules/@ton/core/dist/boc/Cell.js:34:51)     at Object.run (/Users/yudizsolutionsltd/Downloads/token-contract-main 4/scripts/minterController.ts:164:36)     at processTicksAndRejections (node:internal/process/task_queues:95:5)     at async run (/Users/yudizsolutionsltd/Downloads/token-contract-main 4/node_modules/@ton/blueprint/dist/cli/run.js:20:5)     at async main (/Users/yudizsolutionsltd/Downloads/token-contract-main 4/node_modules/@ton/blueprint/dist/cli/cli.js:94:5)

Adem: hi

Abhi: Hi

Sword: Hello everybody Anybody can tell me the testnet and mainnet address of Dedust?

Token: as far as I know, dedust has no test version, but stonfi does (reply to 111035)

Эльдар: dedust actually has deployed contracts in testnet DeDust factory: EQDHcPxlCOSN_s-Vlw53bFpibNyKpZHV6xHhxGAAT_21nCFU DedustNativeVault: EQDshQ2nyhezZleRdlZT12pvrj_cYp9XGmcRgYirA71DWugR (reply to 111062)

Token: pls tell them stonfi's also, we appreciate it (reply to 111063)

Эльдар: sorry idk, i stonfi hater) (reply to 111064)

Token: nowadays I haven't cared about Ton, my shame... anyway is it similar to mainnet? (reply to 111065)

Abdulaziz: It's possible to download TVM on my windows?

Token: https://testnet.tonviewer.com/kQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33a1n (reply to 111065)

Sabbir: Can anyone give me testnet ton please   0QC8XxSvhdj_yclRSGCRzwj4y3vEN1spf-1a5c6f6tbz4Wcv

Lily LaFleur | $REGI: hey folks, purchase subscription button doesn't work in tonapibot  who can help with that?

Pavel: @testgiver_ton_bot (reply to 111080)

Sabbir: I tried there,,but not working🥲 (reply to 111084)

Lily LaFleur | $REGI: three different people tried it, so it's not my Telegram client for sure (reply to 111082)

Pavel: Give me sec (reply to 111086)

Pavel: Done (reply to 111086)

Sabbir: I tried this bot,, unfortunately I don't get any testnet ton (reply to 111090)

Pavel: Capcha problem? Or you make request but dont have any tests ton (reply to 111091)

Sabbir: Make request but don't have any tests ton

Олег: You sure you switched to testnet mode on your wallet?

Олег: I’ve had issued with that😅

Sabbir: Yeah,,sure (reply to 111094)

Abdulaziz: How to download TVM

&rey: Which wrapper for it? Reference TVM implementation is a set of functions and structures. It is component in some executables. (reply to 111100)

Abdulaziz: Use this bot: @testgiver_ton_bot

Abdullah: Not working

Abdulaziz: I wanna learn how to create smart contacts and test it (reply to 111102)

Abdulaziz: I guess im new on it, so i don't understand what u mean. I need some sandbox to try to create and deploy (reply to 111102)

Madre: Also, fluck telegram antispam system, I has been banned, when send first message in this chat with link to togniver :))

RK: Hey

White: I need testnet ton

Rk: Still going

Madre: Bot under ddos attack, it impossible now (reply to 111375)

Артём: Hello everyone! Is it possible to deploy smart contract from frontend?

User<7444105157>: Hey

ダーリン: yes (reply to 111432)

&rey: Works as intended. Please consider not sending links first four hours after join, and wrapping them in backticks. (reply to 111144)

&rey: There is variety of guides, which can be accessed at https://docs.ton.org/develop/overview. Please also consider using other materials, as in the pinned poll. (reply to 111118)

User<6872000545>: will pay in ton if anyone can fix this error about jettons & nft transfers via tonconnect !! dm me

Ibrar: Hello I need testnet ton please

&rey: Please try deploying in sandbox. If you have done so, please try deploying in MyLocalTon. (reply to 111468)

Ibrar: Sandbox didn't responding

Ibrar: Please I need testnet ton coin . It's very important

&rey: What? Pseudo-blockchain ran by TS did not respond? (reply to 111471)

west: I'm looking for a technician who knows ton development very well

Naija: Please i need like 30 testnet ton coin who can help

NPA120: Can we deploy a new utility token with a tax?

AP: is there anything wrong with the TON Blockchain? my contract stopped transacting jettons despite doing so a week ago. any jetton transaction initiated returns Error 5 (Integrer out of expected range). I also noticed the TON testnet giver stopped working

AP: just doublechecked, identical transactions done via script (front end) and deployed contract result in success and failure. I don't know how could this be possible, i doublechecked every integer, one way or another, anything done via blockchain-based contracts results in a fail

&rey: You have to develop its architecture first. You can't deploy unless you succeed in development. (reply to 111496)

&rey: Please send transaction hashes, like succeeded: fafa00e1107..., failed: fa11ed0016.... (reply to 111504)

Legend: What can I help you? (reply to 111480)

— 2024-10-02 —

Akachi: Yes, but you should make the backend to handle the request from frontend. (reply to 111432)

kevin: Hi, anybody knows how dedust pool works,  suppose I provide X TON in, how much Y of jetton should out? what is the formula then ?

kevin: As far as I know, dedust pool will deduct certain amount of fee from either X or Y, but how much will deduct, before or after, what is the difference between volatile or stable pool, these are all black box,  I want a full explain of how it works. (reply to 111541)

Haint: Dont know much about dedust but for typical amm pool fees will be taken from the input amount, for uniswap it's 0.3% iirc (reply to 111542)

Chelsea: Any dev would like to join hackers league? Plz dm

Creator of 🐾: Any one give me testnet token?

final: @testgiver_ton_bot (reply to 111554)

NPA120: I can see the backend repository related to signature implementation. Is there public code related to frontend implementation?

TKAINU: It doesn't work today (reply to 111555)

Creator of 🐾: Tried many time but not receive (reply to 111555)

&rey: What?! Wallets are contracts, not something special-cased by nodes. (reply to 111572)

&rey: No, you don't store tokens in TK, you store them in the distribution contract. (reply to 111574)

sixvxsh: hey there,  i need ton faucet more than 5 ton, what should i do?

TKAINU: Are there any places that allow faucets anymore?

AP: Nevermind, issue was in the "beginCell().storeUint(0xF, 4).endCell().beginParse()" (it's example from TACT docs).   When i added "forward_payload: beginCell().storeUint(0, 1).endCell().beginParse()," instead, everything worked (reply to 111517)

&rey: What new use was suddenly found for testnet TON? Hackaton, or something other? (reply to 111579)

sixvxsh: Testing Dapp for hackaton (reply to 111582)

AP: if u really need a lot of TON it would be easier to deploy on a local blockchain and test it there (reply to 111583)

sixvxsh: for some reason i need to test some functionality on testnet because of speed, More closer to production , etc. (reply to 111584)

AP: i will pray for your soul. i've been testing some stuff that required multi-sending from different wallets and it was a pain, considering how poorly testnet liteservers work and how often they throw 504, 503 errors (reply to 111585)

Creator of 🐾: If anyone need ton faucet dm me..i will send some

TKAINU: me too 😭 (reply to 111588)

Rohit: I am not seeing the option for the testnet in the TON Keeper wallet, even though I have enabled developer mode. If anyone knows how to resolve this, please let me know.

&rey: Switch to main screen and add new wallet. Make sure not to reuse mainnet mnemonic. (reply to 111593)

Rohit: Thank you for your prompt response. I appreciate your help. (reply to 111595)

Rohit: I am using Blueprint, and when I try to connect to the testnet on the Tonhub wallet, it generates a QR code. However, without even scanning it, the wallet throws an error as soon as the QR code is generated. How can I resolve this issue?

TKAINU: May I know when the bot faucet function will work again?\

Rohit: anyone? (reply to 111597)

Long: Hello everyone, I have a question to ask, If on the contract we sending a message to another contract and its failed, function test(){     send_raw_message() -> failed     do_smth() } is this function gonna throw an error or it continue to process to the next line do_smth() ?

&rey: It will continue. In fact, message won't even be processed until computation phase ends. (reply to 111608)

Rayan: Hi guys, Can a jetton wallet send more than one jetton internal transfer to another jetton wallets in a transaction?

Rayan: @pcrafter  can you help me? (reply to 111612)

&rey: Only custom one. Standard permits that. (reply to 111612)

Rayan: Aha thanks. So batch part is done from wallet contract to jetton wallet and then each branch does only one token transfer. (reply to 111614)

&rey: Yes. Writing custom jw would require measurement on message vs dictionary fees. (reply to 111615)

&rey: Though, if jetton is to have tax, batch-order on jw would most likely be cheaper.

&rey: Visit https://github.com/ProgramCrafter/MulDEX/blob/8d0fa457a2b12339ae090ca2ffdc4cb354971ab0/contracts/multitoken_dex.fc#L52. (reply to 111620)

TKAINU: Can anyone give me some testnet tone? I need some to deploy the testnet. Because. Ton bot faucet is erroring

TKAINU: I want to ask how Encrypt message is created

SMI: Hello how can you get data from an api in your ton SC?

&rey: No oracles for that are available. (reply to 111634)

SMI: any way we can do this?

SMI: i want to make a transaction only if is fulfilled a outside condition

SMI: can i do this in the sc? (reply to 111642)

Haint: Just handle the logic in your backend, then call the sc

TON Bounty Bridge: ​Definition of a new NFT standard to enhance NFT ecosystem  🏷 Developer Tool  Summary:This TEP proposes an extension to the existing NFT standard (TEP-62) to introduce a new operation na...  Rewards: • $500 in TON • Footstep SBT  Created by mhbdev

Madre: Does anyone know if TON giver bot in the test network will ever start gives TON, or can we forget about test network?

Captain: I need testnet ton

Max: Hey, @little_pretty_cat   try this: https://faucet.chainstack.com/ton-testnet-faucet (reply to 111655)

Madre: Thank you, I will try (reply to 111656)

Champer Wu: you can add a method for validating a specific raw tx content in contract I was doing this with adding a wallet public key in contract and signing raw tx in backend them send it to app side, let user could mint NFT by them self  export function generateMintSbtBoc(opts: {   // mint payload   privateKey: Buffer;   itemId: bigint;   userAddress: Address;   authorityAddress: Address;    // item payload   itemContent: Cell;    // internal msg   forwardAmount?: string | number | bigint;   queryID?: number; }) {   const itemMessage = beginCell()     .storeAddress(opts.userAddress)     .storeRef(opts.itemContent)     .storeAddress(opts.authorityAddress)     .endCell();    const signingPayload = beginCell()     .storeUint(opts.itemId, 64)     .storeCoins(toNano(opts.forwardAmount ?? "0.01"))     .storeRef(itemMessage)     .endCell()     .asSlice();    const hash = beginCell()     .storeSlice(signingPayload)     .storeAddress(opts.userAddress)     .endCell()     .hash();    const signature = sign(hash, opts.privateKey);    const boc = beginCell()     .storeUint(Opcodes.mintBySig, 32) // 32 bits     .storeUint(opts.queryID ?? 0, 64) // 64 bits     .storeBuffer(signature, 64) // 64 bytes = 512 bits     .storeSlice(signingPayload)     .endCell();    return boc.toBoc(); } (reply to 110871)

Champer Wu: attach func content for you to refer      if (op == 87) { ;; deploy new nft with signature        ;; signature:uint512 item_index:#_ = NewNftItem#_;        slice signature = in_msg_body~load_bits(512); ;; 64-bytes signature       slice signing_payload = in_msg_body;              int item_index = in_msg_body~load_uint(64);       throw_unless(402, item_index <= next_item_index);        throw_unless(435, check_signature(cell_hash(begin_cell().store_slice(signing_payload).store_slice(sender_address).end_cell()), signature, public_key));        var is_last = item_index == next_item_index;        deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());        if (is_last) {         next_item_index += 1;         save_data(owner_address, next_item_index, public_key, content, nft_item_code, royalty_params);       }       return ();     }     if (op == 86) { ;; change public key        ;; new_public_key:bits256 = _;        slice new_public_key = in_msg_body~load_bits(256);       throw_unless(401, equal_slices(sender_address, owner_address));       save_data(owner_address, next_item_index, new_public_key, content, nft_item_code, royalty_params);       return ();     } (reply to 110871)

Alexander: I need to verify that a hash is correctly created. I have an object that has been hash outside of TON. I have the associated proof on-chain. I now want to submit the object on-chain in a permissionless manner. To do this, I need to hash the object to compare against the proven object. The object vary between 200 and 500 Bytes (4000 bits).  However, I cannot stored all of this in a cell without references. According to the docs, this implies I cannot sha256 hash it. It this true?  I have tried various other paths, like trying to convert the information to strings (since strings seems to have less strict size requirements), however this doesn't seem possible either.  How do I get the hash of the object? Specifically a raw sha256 hash, not a chained sha256 hash.

Champer Wu: why not reference? And I just saying, you don’t need to hash all object, all you need is verifying the object is authenticated Perhaps just need to verify the some key field? (reply to 111672)

Alexander: In case data is a String it should have a number of bits divisible by 8, and in case it’s a Slice it must also have no references (i.e. only up to 1023 bits of data in total).

Alexander: https://docs . tact-lang . org/ref/core-math/#sha256 (reply to 111674)

darshan: Withdraw my toncoin in tonblock chains

darshan: How do this method

Alexander: I am comparing the content of a message to the root verified by a light client. (reply to 111674)

darshan: Tell us

darshan: Which method

Alexander: The leaf is the hash of the message and as such, I need to recompute the leaf (hash the message). I can't just hash a partial object since this wouldn't prove anything about the validity of the message.

darshan: Which coding are executed

Champer Wu: https://docs.ton.org/develop/dapps/ton-connect/message-builders#transfer-with-a-comment #simple_transfer (reply to 111687)

Champer Wu: Could you tell me what's your purpose? maybe the way to approach the goal was not only an option (reply to 111686)

Alexander: I want to execute a swap between 2 chains: Ton and another chain. The other chain has a light client that I have already ported to Tact. The light client allows me to trustlessly verify every single transaction and event that happened on that chain.  The block header is the part that is verified. And that part is easy since the block header is less than 120 bytes. The block header contains a merkle root (which I again can easily compute).  However, each leaf of the merkle tree is the hash of the transaction & events. Those are between 200 and 500 bytes. I want to make an inclusion proof of an event (For example, you pay me) so that I can release the tokens for you on Ton.  To get a leaf I need to hash the 200 to 500 bytes. (reply to 111689)

Alexander: The thing is, regardless of how you twist and turn this problem you cannot hash less than the entirety because that "less than entirety" never happened.

𝗠 𝗠: Hello, looking for an experienced developer on TON Pay is great)

Champer Wu: I see you want to build a cross bridge for swaping the token between two different chain. it’s totally a huge project. how about zk tech for compressing your data? (reply to 111691)

Alexander: It doesn't compress the actual transaction object though, only the proof. (reply to 111695)

Denys: Hi all, please tell me testgiver bot is not working as I understand it?

Yasir: can someone tell me where to find the api key?? (reply to 111656)

Max: https://docs.chainstack.com/reference/platform-api-getting-started#create-api-key (reply to 111700)

Yasir: not working (reply to 111701)

Max: did you register on the platform? (reply to 111703)

Yasir: nah

Yasir: is it necessary

Yasir: how can i register

Max: https://console.chainstack.com/user/account#signup (reply to 111708)

Yasir: sent you a text (reply to 111709)

Nerses: is testnet working right now ?

Nerses: Trying to deploy contract I get error 429

&rey: Your problem; add delay of 1.1s between getSeqno and sendTransfer. (reply to 111718)

&rey: HASHEXT_SHA256 multiple slices/builders. (reply to 111672)

Alexander: Once I go beyond 1016 bytes (I can only compare against full bytes), the hashes doesn't match with any other calculator. (reply to 111726)

Nerses: I use tact-deployer for deploying, how I should do that, I think what you mentioned about is done under the hood  of function prepareTactDeployment  which provides the deployer lib (reply to 111725)

&rey: Was order correct? (reply to 111727)

Nerses: seems probelm is just with wallet OpenMask it doesnt even show the balance (reply to 111725)

Alexander: Yes. (reply to 111729)

Safeer Hussain: I need ton test

Eugene: Have a look at https://faucet.chainstack.com/ton-testnet-faucet (reply to 111733)

TradeBitMinds: Hello Does anyone know how to get top NFT holders of certain collection info? TON api give information only about nft holders. I want to get info like address1 - 103 nfts address2 -100nfts address3 - 47nfts and so on Of course I can try to do it by that info manually (by calculation of how much does each address appears in list), but is there any other option?

Nerses: @pcrafter  doing tx i get such error data: { ok: false, error: 'Liteserver timeout', code: 504 }   here I get seqno after 2 second,cant figure out what can be problem

meomeocoj | Mike: hi guy how i can get max number of int type in func ?

&rey: asm "256 PUSHPOW2DEC"; said maximal value is 2^256 - 1. (reply to 111743)

Alexander: Is there a bug bounty for finding bugs in Tact?

Anton: Not yet, but will be in a couple months, give or take (reply to 111756)

Alexander: I would like to responsibly disclose a bug in Tact, how do I do that? (reply to 111757)

Anton: You can open a new GitHub issue: https://github.com/tact-lang/tact/issues/new/choose  and pick the ‘Report a security vulnerability’ option if you think it’s a security-related bug, or just pick the ‘Bug Report’ option for the other cases. You help will be greatly appreciated by the Tact team (reply to 111758)

42: Guys, beware, a serial scammer is trying to launch his project on ton. I lost my money to him. Hope you don't fall for his scam.

K: hi! is it possible to send multiple messages in single transaction using WalletContractV5R1?  for example I want to interact with contract A and send some ton to contract B in single txn

Token: sure (reply to 111799)

SAMMY: Can anybody body please send me testnet ton  The link above isn't working well

NDA: you can use @testgiver_ton_bot, I see it working right now (reply to 111808)

SAMMY: Ok thanks (reply to 111810)

K: thanks! just figured that out, got small question tho. So for example when I'm calling contract A and sending 0.1 TON there - I'm also adding 0.25 TON for gas fees, so in first message value will be 0.1 + 0.25 TON. In case with 2 messages (A and B contracts), should I add those gas fees to both messages or to the last one (or maybe first one?) instead? (reply to 111800)

K: same case (reply to 111799)

Алина: I'm running my own liteserver and it won't respond to requests, it would always timeout. Is it because it didn't synchronize yet or do i have some network configuration issues?

isik: Is there something wrong with stonfi api, its either very slow or not working time to time. (Getting the operations of a wallet)

User<7834860684>: - Fullstack web3 developer (front/backend) - Senior Blockchain Developer  Specialists required for a unique project. dm.

User<866836965>: Gn guys!

User<866836965>: Hello my friends! Is everything okay here? I need partner projects. Is anyone available for possible partner ships?

K: how can I get transaction hash/id before it's confirmed/rejected?

— 2024-10-03 —

Madre: Guys, I use the same seed phrase for the test network in TonKeeper on Android and in the web version of the wallet tonkeeper, but for some reason the web version generates completely different addresses for all wallet versions (W5, V4R2, etc). At the same time, I tried to switch to the mainnet and check my main TON wallet, there the addresses are generated correctly. Has anyone encountered something similar, how is this possible?

User<7834860684>: - Fullstack web3 developer (front/backend) - Senior Blockchain Developer  Specialists required for a unique project. dm.

Abdulaziz: If there is smart contacts so there can be stupid contracts right?

Haint: each message should have individual fees (reply to 111819)

Haint: it's not "one transaction" like you are thinking

TKAINU: How to fix  data: '500 Internal Error' when using blueprint

P: I receive exit code 135 while deploying contract. On exit code  table 135 is "Code of a contract was not found — false flag for a dictionary call". Any one can explain me in detail?

W: /stat

Nhat Nguyen: I have 1 issue: I have 1 TON address and 1 polygon address how can I check if TON include polygon address or not (dont use mnemonic)

Денис: Hello everyone, for several days now I can't figure out how to generate the correct payload for my smart contract. I will be very grateful if someone can help 🙏  There is a smart contract on the clock for accepting payments:  ------------  import "@stdlib/deploy";  message Payment {     orderId: Int as uint32; }  message PaymentReceived {     orderId: Int as uint32;     amount: Int as coins;     sender: Address; }  contract PaymentReceiver with Deployable {     owner: Address;          init(owner: Address) {         self.owner = owner;     }      receive(msg: Payment) {         let ctx: Context = context();                  // Check that the transfer amount is greater than 0         require(ctx.value > 0, "Payment amount must be greater than 0");                  // We will issue an event about the received payment         emit(PaymentReceived{             orderId: msg.orderId,             amount: ctx.value,             sender: ctx.sender         }.toCell());          // We send funds to the owner of the contract         send(SendParameters{             to: self.owner,             value: ctx.value - ton("0.1"), // We leave a little for the commission             mode: SendIgnoreErrors,             bounce: false         });     }      // Handler for the "withdraw" text message, allowing the owner to withdraw funds     receive("withdraw") {         let ctx: Context = context();         require(ctx.sender == self.owner, "Only the owner can withdraw");                  send(SendParameters{             to: self.owner,             value: myBalance() - ton("0.1"), // We leave a little for the commission             mode: SendIgnoreErrors,             bounce: false         });     }      get fun owner(): Address {         return self.owner;     } }  ------------  at the front, I am forming a transaction and trying to form the correct body for the payload  ------------  import type { SendTransactionRequest, SendTransactionResponse } from '@tonconnect/sdk' import { TonConnectButton, useTonAddress, useTonWallet, useTonConnectUI } from '@townsquarelabs/ui-vue' import { beginCell, Address, toNano } from "@ton/core"; import { storePayment, Payment } from ' ./tact_PaymentReceiver'; // Importing the necessary functions from the generated file  ...  const { order_id, amount, payment_address } = paymentInfo.value  const payment: Payment = {   $$type: 'Payment',   orderId: BigInt(order_id) };  const testAmount = 0.05 //test amount  const body = beginCell()     .store(storePayment(payment))     .endCell();   // Forming a const transaction = {   validUntil: Math.floor(Date.now() / 1000) + 600, // Transaction duration (10 minutes)   messages: [ { address: payment_address, // Contract address       amount: toNano(testAmount.toString()).toString(), // Payment amount       stateInit: undefined,       payload: body.toBoc().toString('base64'),     }   ] };  paymentStatus.value = 'sending' const result: SendTransactionResponse = await tonConnectUI.sendTransaction(transaction)  ------------  as soon as I didn't try to generate a correct payload, an error occurs every time 'it is not possible to verify the transaction'  But if you comment out the payload: body.toBoc().toString('base64') line, then the transaction is created and confirmed in the wallet successfully

Long: how do we stop when the error occurs? (reply to 111610)

M: https://t.me/notpixel/app?startapp=f6489798318_s628637

Haint: you cant (reply to 111892)

Haint: messages will only be sent in action phase

Kirills: Hi,  I'm new to using ston.fi and TON. I've implemented the swap functionality in our system, but I'm having trouble accurately calculating the amount spent and the amount received from an executed swap. I understand there are factors like gas fees, ston.fi commissions, and possibly other expenses. Can you provide guidance on how to obtain the correct amount spent and received?  Thank you.

Haint: stonfi should have an sdk that provides those functionalities (reply to 111899)

🐤 adil: I need ton testnet faucet help me please

TKAINU: I want to save a list of moderator addresses, but a cell can only store a maximum of 3 addresses. If I save a cell within a cell, it's too complicated. Is there any way to improve it?

Ankit j: Anyone looking for source code of app like Dogs tg app.. if you want please contact me..

Haint: store those in a dict then but seriously if that is too complicated then you'll be having a hard time (reply to 111912)

Long: Hi guys, how from a tx_hash from A -> B we can get the tx_hash of B-> C

Long: I see tonviewer can get this but not sure which api to look

Luke: can you give me the A -> B tx hash? I think I might have got something (reply to 111920)

TKAINU: u can show error code? (reply to 111918)

Yury: Hi everyone, does anyone have an example of sending Jetton? I use JS/TS

&rey: Docs have. https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment. (reply to 111924)

Yury: 🙏🏻 I will try (reply to 111928)

Liam: https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet   const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));   In the above code portion   “Error: writeInt: value is NaN”  error, is there a workaround? I had the same question in a GitHub issue.

&rey: Doesn't getJettonWalletAddress(data.ownerAddress) work? (reply to 111932)

Madre: Sorry to raise the question, but does anyone know? If the problem is in the derivation path, how can I scan the wallet to see the coins in other addresses? (reply to 111848)

Liam: Oh it works, thank you 👍 (reply to 111933)

Liam: @pcrafter   Can I ask you one more question?  I want to get the JettonWallet Address with only the Jetton Master Address and Toncoin address, is there any way to do it?

&rey: Please look in TON Cookbook; there is a section about it. (reply to 111940)

Liam: TON cookbook ! Thank you 👍 (reply to 111941)

Jessica: Thank you, admin. Sometimes, even asking a question here seems to offend people.

Jessica: Can I ask the admins something? If everything is forbidden, even finding a collaborator to work on a project together, how will the community unite for new projects? Can someone please answer me? I already sent a message asking this, and it was deleted.

&rey: The point of this chat is not to build any community; rather, to help developers know how TON works. Appropriate channel for searching team is @tonhunt. (reply to 111947)

&rey: Or one of TON Society chats, IIRC.

Mehmet Ali: Hi All! We are trying to implement a taxing function for our jetton. Excluding the owner transfers; all jetton transfer would be taxed a %8 of the amount total which is like if addressA sends 100 jetton to addressB then 92 will arrive at destination and 8 will be deducted and transfered to the owner address.

Mehmet Ali: We have successfully deployed standard jettons from mpx-blueprint.

Mehmet Ali: but can't manage to do this taxing function for all transfers except the owner. Anyone have idea?

Mehmet Ali: We have the code structre testing but can't deploy.

Tom: Hey guys, do you know how to get this kind of config for @ton/sandbox? https://testnet.tonviewer.com/config  I'm trying to look into some config and sandbox won't expose them. I do see a config as cell but wonder what's the right way to parse. https://github.com/ton-org/sandbox/blob/fe0fc3b09adc0921d047543e5a7a3b1436d1c819/src/config/defaultConfig.ts

K: I'm calling swap contract A to swap Jetton -> TON. What's the best way to redirect 1% of received TON to another wallet (like fee)? Can I do it in the same txn by adding second message? Like how can I calculate 1% of final received TON amount if slippage was high? Or should I make some wrapper contract B for such logic?

&rey: your swap message will anyways be processed in next transaction, so you need to clarify (reply to 111958)

&rey: Please check out https://tonviewer.com/EQBTr1VlDmXjwt17E74xEo3KYeBEDp1p9xbixjk7eva_OcyH?section=code. (reply to 111951)

Mehmet Ali: I think this is funC, we are working in tact not sure how to undertstand and change it to tact. (reply to 111960)

Tom: Please help, thanks a lot (reply to 111956)

Jessica: I understand, but this is just a channel, not a community. I miss the early days of the internet when it was free and open, like BTC. I get your side of things, and I apologize. (reply to 111948)

Jessica: ok

Yury: I tried this method, but for some reason I only send Ton, not Jetton (reply to 111928)

&rey: Do you really need x1.5 factor in computation fees? (reply to 111962)

final: tact is more expensive than func? (reply to 111973)

User<6711570555>: Hey guys, is there anyone here who understands TON very well? I'm willing to pay for help and answers to questions

final: damn, didnt know it. it is real "educational fees for devs" 😁

Mehmet Ali: Actually do not care about fees at the moment... (reply to 111973)

Jessica: Hi, most of them won't respond. Share your question or what you need, and if possible, I'll help you. (reply to 111978)

Yury: who can help with my func? I create a body but it sends TON, not Jetton

Andrei_ka: sorry for disturbing, i have the same question as @YuryElizarov, in the provided documentation they show only how to create a message but how to send it then? i tried with '@ton/ton' `sendTransfer' function but it doesn't work, maybe someone knows which class/method should be used? (reply to 111928)

Yury: last trxs in wallet https://testnet.tonviewer.com/0QAfi4vtFZsNMYQK87UxHGncK5QkXXuadvEph78YynhcxS1S

Jessica: What do you really want with this? What is the purpose? Do you want to receive the wallet address? (reply to 111985)

Yury: I want send Jetton from my wallet to another wallet using JS (reply to 111990)

Heydar: we can create unlimited rps library from scratch that retrieve data like toncenter? I mean toncenter is just fetching data from unlimited TON blockchain transactions(maybe by protobuf ...) and make an easy way to use , so we can do the same way?! and prevent paying more money?

&rey: Have you directed message with transfer order at your jetton wallet? (reply to 111972)

Yury: Yes, I wanted to send jetton between my test wallets (reply to 111996)

&rey: You have, in fact, directed message at a destination wallet. This is fundamentally wrong. (reply to 111987)

Yury: I create transfer like this where did i go wrong?

Heydar: guys who know guide me please? I need more rps and no payments , is that possible? (reply to 111993)

&rey: Hm, should've went well. Check that you 1) have jetton 2) 0.01 is sufficient for its transfer (usually, 0.06 is required) 3) not mixed up arguments to getJettonWalletAddress (reply to 112000)

Yury: Okay, I'll check now. (reply to 112002)

Ma><im: hello! where can i find source code of v2 stonfi contracts?

Yury: Thanks for information I tried this, i create transaction, but get 709 code, I don't understand where I went wrong (reply to 112002)

Daniel: https://t.me/funcvietnam join func vietnam group💪

Coalus: Try to attach 0.05 TON instead of 0.01 TON. As you can see in the contract code, 709 error means "not enough ton" (reply to 112016)

Xinyao@InfStones: Hi team! Could you help with us: 1. Which type of token will be rewarded after staking the vesting token? vesting token or liquid token? 2. Is there any operation required to restore the validator if been slashed?

Yury: you can see the latest transactions please? I send 0.2 TON, 1 TON, but I get a code 709 https://testnet.tonviewer.com/0QAfi4vtFZsNMYQK87UxHGncK5QkXXuadvEph78YynhcxS1S

Yury: I've been trying to solve the problem of sending jettons for 3 days now

&rey: You're attempting to forward 0.2 TON out of 0.2 TON, aren't you? (reply to 112024)

Yury: I'm trying to send 10 jettons, and I put 0.2 TON in forwardAmount or did I misunderstand the question?

&rey: The issue is here. (reply to 112027)

Yury: and what needs to be done?

west: Find a developer Build ton-connect bridge  Use this package https://github.com/ton-connect/bridge  It is not a cross-chain bridge, but a bridge used to connect ton dapp and wallet

Coalus: U need to make "forwardAmount" smaller (reply to 112029)

Yury: What should the values ​​be approximately? (reply to 112031)

west: Find a developer Build ton-connect bridge Use this package https://github.com/ton-connect/bridge It is not a cross-chain bridge, but a bridge used to connect ton dapp and wallet If you can help me complete this task, please contact me

Coalus: If it's a simple transfer from user to user you can set 1 nanoTON (reply to 112032)

Yury: even if i send jettons? (reply to 112034)

Haint: is this due to the fact that the generated func code is inefficient or another reason that I'm not aware of? (reply to 111973)

&rey: Also, my FunC code was manually optimized compared to common jetton impls. (reply to 112039)

Heydar: bro do we have better APIcenter?  or better way? I need to create something exactly like history of wallet in tonkeeper, It's too hard to use this apis ... (reply to 108535)

&rey: Transactions older than 2 weeks or so are only stored due to good will of certain nodes or indexers. (reply to 108534)

Heydar: guys how I can make a history list like tonkeeper wallet? by python ? can someone give me a good API center or any way?

&rey: pytoniq might help you. It requires no API, connecting to liteservers directly. (reply to 112045)

west: Build ton-connect bridge  Use this package https://github.com/ton-connect/bridge  It is not a cross-chain bridge, but a bridge for connecting ton dapp and wallet

Heydar: but tonkeeper showing you so old transactions too!? or even tonviewer how we can be like them? (reply to 112046)

&rey: Connect to archival node (knowing contents of block with seqno 1), it will return all transactions. (reply to 112049)

Heydar: so is that available in pytoniq (sdk)? or do we have better  API(rest or graphql) that make these response with abstractions? (reply to 112050)

&rey: It is. (reply to 112051)

Heydar: thanks , and please can I ask last question? tonkeepr is using which of them? (sdk or even api endpoint name) (reply to 112052)

&rey: tonapi (tonconsole) (reply to 112053)

Heydar: lol why this happen , I just asked a technical question 😐 @admin (reply to 112056)

TwT: Yes, you scam. Don't ready for call and not talk about payment (reply to 112061)

west: Why should I answer your call? How can I answer your call if I don't know English? Is there something wrong with your brain? (reply to 112065)

TwT: you are a filipino scammer, you can't even estimate the cost of the work (reply to 112067)

west: Are you an idiot? Where did we mention money from the beginning to the end? Did you say how much? I didn't tell you my budget. Are you an idiot? You are a drug-addled idiot biting people here. (reply to 112069)

TwT: Don't work with him, He cheap Philippines schoolboy (reply to 112071)

TwT: Check your data in doxbin

west: Our chat was just a few short sentences. Did I tell you my budget? Did you tell me how much you wanted? We didn't even mention money. You idiot said I'm not going to pay you. Are you mentally ill? Go to the hospital for a checkup and don't delay your treatment.

TwT: Another data I'm upload in doxbin (reply to 112080)

west: I can't speak English, so I can't talk to you through Google meet and Nexcall, and you, you idiot, said I lied to you? What did you lie to me about? What did I do? Or what did you do? You idiot, all the chat records are there, I dare to take them out directly. Why are there low-IQ children like you in this group? (reply to 112075)

TwT: Goodluck ripper (reply to 112082)

west: I need to remind everyone, don't click on this scammer's link, and don't believe what this scammer says.

Sam: Hello i want add 'connect wallet' system in my bot  how can i ?

&rey: @wwwssstttt @Superdaus are hereby both banned.

Abdulaziz: Why this number keeps growing, damn now we can't recieve our testnet tokens

&rey: Because of ongoing hackathon. (reply to 112099)

luis: Hello, who can tell me how I can verify a Jetton token contract so that it doesn't mark me as a SUSPICIOUS transaction in Tonviewer?

Egene: There are plenty of ways to do this, some harder but more reliable some easier but less reliable.  It is too long to explain in a single message, but if you want to reach out and explain what exactly you are trying to do I can try and give you some advice on what has and has not worked for our team of devs. (reply to 112043)

Ali: Hello friends, how can I get some tokens (jetton) on the Ton testnet network?

&rey: You can mint some. The common way: https://minter.ton.org/?testnet=true. (reply to 112117)

Ali: Can you please explain more? (reply to 112118)

&rey: Which thing, specifically? Transferring 'em, perhaps? (reply to 112119)

Exit Liquidator: Guys is there a tone wallet that can be used specifically for testnet?

Exit Liquidator: For example in tonkeeper, I can go to dev menu and set up a testnet account. But the mainnet will be still active

Exit Liquidator: I REALLY need a solution

Exit Liquidator: So when I connect to some testnet dapps with my tonkeeper, they just take my mainnet address, not the testnet one (reply to 112125)

Exit Liquidator: So I need a solution for a browser wallet that has TON testnet ONLY

Алина: My own liteserver did synchronize but it behaves super weird when i make requests to it. Ton LiteClient receives a response for the first request but subsequent requests through the same connection time out.

Exit Liquidator: I hear Ton Keeper can do it, but I couldn't achieve it

&rey: That's dApp issue with formatting addresses, probably. (reply to 112128)

ຮꫀթí: Hi guys

Mehrdad: In the Tonkeeper Chrome extension, go to Settings.  Scroll down to the bottom of the Settings page.  While holding down the Ctrl key, click on the TON logo 5-6 times (fast!) (reply to 112131)

Mehrdad: give me your testnet wallet address in private message and I will send you some just for start, after some chalanges you will learn how to mint your own easily! (reply to 112117)

Madre: Thank you <3 (reply to 112118)

luis: Hello, who can tell me how I can verify a Jetton token contract so that it doesn't mark me as a SUSPICIOUS transaction in Tonviewer?

— 2024-10-04 —

Alex: for the ton mini apps, how do i make it so that the app cant be dragged down, or atleast its full screen

Howard: can check with @tactlang group chat:  https://t.me/tactlang/38429 (reply to 96489)

I: hello

I: hello

I: i cant found method to build wallet to connect the ton connect

sangmin: Is there a way to find the decimals in a Jetton contract and how to retrieve the metadata URL?

luis: Hello, who can tell me how I can verify a Jetton token contract so that it doesn't mark me as a SUSPICIOUS transaction in Tonviewer?

Mansi: Hey Everyone. I have node version 22.9.0 and npm version 10.8.3 but still I am getting this error while creating tact project.  npm ERR! Darwin 23.1.0 npm ERR! argv "/usr/local/Cellar/node/22.9.0/bin/node" "/Users/codecrunch/node_modules/.bin/npm" "install" "--ignore-scripts" npm ERR! node v22.9.0 npm ERR! npm  v2.15.12 npm ERR! path /Users/codecrunch/Documents/mansi/Telegram/escrow(ton)/escrow/node_modules/@types/jest/package.json npm ERR! code ENOTDIR npm ERR! errno -20 npm ERR! syscall open  npm ERR! ENOTDIR: not a directory, open '/Users/codecrunch/Documents/mansi/Telegram/escrow(ton)/escrow/node_modules/@types/jest/package.json' npm ERR!  npm ERR! If you need help, you may report this error at: npm ERR!     <https://github.com/npm/npm/issues>  npm ERR! Please include the following file with any support request: npm ERR!     /Users/codecrunch/Documents/mansi/Telegram/escrow(ton)/escrow/npm-debug.log Error: Command failed: npm install --ignore-scripts     at genericNodeError (node:internal/errors:983:15)     at wrappedFn (node:internal/errors:537:14)     at checkExecSyncError (node:child_process:890:11)     at execSync (node:child_process:962:15)     at main (/Users/codecrunch/.npm/_npx/b56225140edd990c/node_modules/create-ton/dist/cli.js:117:42) {   status: 236,   signal: null,   output: [ null, null, null ],   pid: 41715,   stdout: null,   stderr: null }

Akachi: You can use dictionary, don't you? (reply to 111912)

Akachi: Did you check those different addresses in tonviewr? They can simply have different format. (reply to 111934)

Madre: Yep, already did it, even more, I sent some TON to W5 address from mobile wallet to desktop wallet and addresses still not detected (reply to 112205)

Heydar: This example is from tonapi(their official example query) but it does not works! https://tonapi.io/v2/graphql/playground

Akachi: How did you create? Used this @ton/ton library? (reply to 111848)

Ankit j: Any tg app developer available, need it for open issues fixing only..

Kai: please let me know (reply to 112229)

DigitalDigger77 : I was trying to get some TON from the TON testnet, but unexpectedly got blocked. 😅 Does anyone know a way to resolve this?

Akachi: Interested. (reply to 112229)

TKAINU: i using cell save the address as direction, but function isCheck error: 9 · Cell underflow Please help me fix isCheck

Michaell: Fam, is it possible to integrate the telegram migame into the website or app so users can play directly from there?  If yes, what steps are needed to make it happen?

&rey: Fundamentally, said game is website. TMA is but a form of delivery to users, with certain bans on content. Application is another form, which requires writing native app code instead of webpage though. (reply to 112240)

Michaell: So it is possible, but not easy?  can't use api? (reply to 112246)

&rey: I have said that you ALREADY have a website if you have a TMA. (reply to 112247)

Akachi: Yeah, TMA itself is website. (reply to 112248)

Akachi: var dict_balances = ds.slice_bits() == 0 ? new_dict() : ds~load_dict();  Do I need to check the dict variable is empty or not to initialize? Or is it okay to use the following way?  var dict_balances = ds~load_dict();

Michaell: Understood, I mean users can't play on my own project website/app  To play TMA on my own project web/app is impossible? (reply to 112248)

&rey: The latter way is preferable; you then have to write bit '0' for empty dict during initial storage construction. (reply to 112250)

&rey: If so, you must fix your script so that it does not crash when opened outside of Telegram. (reply to 112252)

Michaell: that's what I said, it is not easy (reply to 112254)

&rey: Is it? I find it hard to write code which would fail outside of Telegram, instead.  Though, you may need some software architect knowledge. @tonhunt is appropriate for searching for it; TON Society chats might also be fine. (reply to 112256)

Michaell: take a lot of time to development, with in months (reply to 112257)

&rey: You might've heard of some developers who work faster and produce better applications. They do exist (even though hard to find, and requested salary does not indicate them very well). (reply to 112258)

Kerimova: Hello, please tell me how to get information about the pool directly from the Ton blockchain, and not from the STON dex. And will it be necessary to decrypt it?

Akachi: Can you let me know if is there any specific reason of using second is preferable? (reply to 112253)

&rey: Because of less branching (and instructions, actually), it is cheaper for TVM. Storing extra bit also allows to keep multiple (<= 4) dictionaries in one cell without risk to mix them up. (reply to 112266)

Token: use tonapi, and if need detail information, just analyze from the api (reply to 112263)

&rey: Depends on the exact pool. Generally, you can retrieve contract state by address, and then parse it locally.  DEX are not generally intended to have standardized read interface (as contracts cannot read others' data), so parse will be required. (reply to 112263)

Madre: No, this seed was generated randomly, but it absolutely valid (reply to 112223)

Akachi: I mean, how did you create wallet from seed phrase? Importing to wallet or using script? (reply to 112271)

Madre: Import existing mnemonic in Tonkeeper (reply to 112272)

darshan: How withdraw in toncoin in blockchain

Akachi: So did you import mneomoic in Tonkeeper. Then you just need to switch to the testnet in Tonkeeper. (reply to 112274)

Madre: You absolutely right, but I already did it :) (reply to 112277)

Akachi: Then, how could the address can be different, because you just switch the chain in one account in Tonkeeper. :) (reply to 112278)

Catid: helow  anyone can help  i use ton connect ui react  when shending transcation  how to proof that without read the api Seqno ?

Madre: I also don't understand it. Same seed, same(almost) app TonKeeper and Tonkeeper-web, but different balances and addresses

Akachi: Yeah, that's weird, so when you switch the chain, then the address is also changed? It might be the bug of Tonkeeper. :) (reply to 112281)

&rey: There can be no proof without reading blockchain. (Actually, there might be no transaction.) (reply to 112280)

Madre: Yep, "O" prefix for testnet, and "U" prefix for mainnet, it works regular (reply to 112283)

&rey: What do you mean actually? TON can by definition only exist inside of blockchain; what do you want to do, knowing that? (reply to 112275)

ae: How do we interact with jettons after deployment? like minting? I can't find any examples.

&rey: Please look into the repository carefully. wrappers —> JettonMinter.ts —> sendMint may be of interest for you. (reply to 112295)

Denisa: Hello. Is there a library or any already built functionality regarding Merkle Trees on Ton?

&rey: There is. See Gusarich's contract for jetton claims, cNFTs, etc. (reply to 112299)

Marc: Can anyone tell me what is the point of TON?

Marc: but like how is it better than aws? (reply to 112304)

Madre: The same as any other cryptocurrency, but with a comfortable interface in Telegram :) (reply to 112303)

Marc: but in what way? (reply to 112307)

Madre: Wait, you mean Amazon Web Services, or what? :D (reply to 112305)

Marc: yes

Madre: How is AWS towards cryptocurrencies?

&rey: Please stop speculating; there was stated point of TON, there is current expansion direction, etc.

Marc: could you send me the link the stated point of TON and current expansion direction? (reply to 112312)

Marc: I mean, I don't understand much, but as far as I understand, TON is somewhere you host the logic of the application same as AWS (reply to 112311)

&rey: Original is at https://docs.ton.org/ton.pdf. A flexible multi-blockchain platform (TON Blockchain; cf. Chapter 2), capable of processing millions of transactions per second, with Turing-complete smart contracts, upgradable formal blockchain specifications, multi-cryptocurrency value transfer, support for micropayment channels and off-chain payment networks. TON Blockchain presents some new and unique features, such as the self-healing vertical blockchain mechanism (cf. 2.1.17) and Instant Hypercube Routing (cf. 2.4.20), which enable it to be fast, reliable, scalable and self-consistent at the same time. (reply to 112313)

Marc: Well, that is a technical explanation of how ton works, but I am more interested in how it is helpful for the business (reply to 112315)

Marc: Like what real problems it solves

Madre: This is a very strange way of looking at things. Yes, TON can be used to execute your business logic through smart contracts, but first of all it is a cryptocurrency that allows you to pay for any services (reply to 112314)

&rey: Blockchain. It can be used for automatic, verifiable decisions like asset transfers: smart contracts guarantee that when action A (incoming transfer, actually) is done, action B is done afterwards.  With some trust in oracles, set of actions A becomes "events": for instance, price of something crossing a given threshold. Then, automatic actions can balance said price change, etc. (reply to 112316)

Mehmet Ali: Anyone, working on TACT, we need a TAX enabled contract example. That if the jetton is transfered a %8 amount will be transfered to owner.

Marc: I see, this makes more sense (reply to 112319)

Kerimova: I looked at the API tone, but did not find any endpoints for getting data from the pool(( (reply to 112268)

Marc: does anyone know if there is like an api where one can fetch all the telegram mini apps?

&rey: Fundamentally there can't be one, since some TMAs are private. (reply to 112327)

Token: @radar_tg_bot (reply to 112327)

Madre: I think this is impossible, since the mini-app can be passed for user simply as a link to any resource through a bot. But at the same time there is a Telegram App Center with approved apps: https://tapps.center (reply to 112327)

BigBang: Have you resolved it yet? (reply to 110164)

luis: Hello, who can tell me how I can verify a Jetton token contract so that it doesn't mark me as a SUSPICIOUS transaction in Tonviewer?

Token: so sometimes you can use dedust and stonfi sdk Or when use tonapi, if you know pool address then it will show you the info (reply to 112324)

Mike Krupin: Hey guys anyone faced an issue during bringing tokens from TON to eth?  Trying to bridge jusd, but can't receive them on ETH. But at the same time they already burned on TON  Ton support doesn't response :)   Already waiting for 20 minutes

Mehrdad: I have a question in toncenter api  How can I check the final tx status with api of getTransactions?  https://testnet.toncenter.com/api/v2/getTransactions?address=0QCIip8uRGT5gqx2XovhhhMX36R09NahrYHSWeSUfsyJj_T1&limit=1&lt=26244908000001&hash=pPF1cpSsB0aNTsS8jCXdpjrXjURT7f1voePJtbTvewM%3D&to_lt=0&archival=true

Salmono: Good morning guys, I have a problem with the multi-sender feature  This happens when sending toncoin assets to a new or inactive address, it is returned to the sender's wallet with a description calling the contract "bounce".  Can anyone explain this? Is this a mistake or is it not possible to use multi sender to an inactive/new wallet address

&rey: Feature might have missed that. (reply to 112364)

Salmono: Ah its deleted 😁

Salmono: I think maybe the same thing happens in the case of air drop if the token distribution uses multi sender?  Moreover, there must be many participants with inactive wallets. (reply to 112366)

ae: Kinda lost here, dont have anything class of ContractProvider on given deployment script. (reply to 112296)

&rey: BlockchainProvider.open (reply to 112372)

&rey: @always_hopeless considering multiple wallets from same mnemonic: Use different subwallet IDs. That is supported by pytoniq, for instance.

Ruslan: Hi everyone! Please tell me what to look for or who should I write to?  I am using cryptocurrency for the first time and 2-3 weeks ago I put up a Fragment collectible username - they placed a bet on it and (it seems) it was bought at auction - today the auction ended. The buyer paid 10 TON, which went for a walk through the wallets, and 4.5 TON was indicated to me for a refund (conditionally). And now in my channel username is shown as collectible. However, 4.5 TON are stuck on a wallet unknown to me and are hanging there. It's been a little less than a day since the sale itself. Thanks

Sam: Can I see your username (reply to 112390)

Ruslan: It’s just @vtbbanks (reply to 112401)

Ruslan: In addition, I found that the transfer to another wallet (not mine) has an unverified contract (reply to 112390)

Grugo: which word is not allowed? (reply to 112419)

&rey: That which stands for token distribution, often unwanted. I'd prefer you did not discuss this topic, actually. (reply to 112420)

K: is there any other way to get jetton metadata if getJettonData is empty? where are explorers getting this data from?

— 2024-10-05 —

meomeocoj | Mike: hi TON developer are there any course about the assembly in func ?

Jason: Hey,  Is there a Discord for TON/miniapp dev specifically?

Catid: yes (reply to 112284)

Catid: when i try use fetch the seqno event 3 minutes  my user has sent their transaction but no detect

Max: Hey guys, I’d love to pay $25 for an answer, why the following USDT transfer code causes 49 Error (invalid_message)   // Pack the USDT transfer message         let packed = beginCell()         .store(             storeTokenTransfer({                 $$type: "TokenTransfer",                 query_id: BigInt(Math.floor(Date.now() / 1000)),                   amount: BigInt(10000000000),                 destination: contractAddress,                 response_destination: userAddress,                 custom_payload: forward_string_test,                 forward_ton_amount: toNano("0.34"),                 forward_payload: newTradeCell,             })         )         .endCell();                      const transaction = {             validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec             messages: [                 {                     address: usdtWalletAddress.toString(),                     amount: "530000000", // 0.53 TON                     payload: packed.toBoc().toString("base64")                 }             ]         };                  const result = await tonConnectUI.sendTransaction(transaction);  Interestingly, the same code worked fine with other jettons

&rey: You're trying to send 10'000 USDT. Are you sure that's correct? Also, error codes might be reused. (reply to 112462)

Max: I tried sending 1, didn’t work either  Seems like the message body/format is incorrect (reply to 112467)

&rey: Also, custom payload is likely not supported for USDT.

Max: I tried setting null custom payload too (reply to 112470)

Triple: Hello @Yang (reply to 64304)

Triple: Is this still available?

&rey: Specific transaction hash? (reply to 112472)

Max: 5319ae48634f096d9cdeb3de6cd44eaf25fa1545f16f60e9dad25c998970d2ae (reply to 112478)

&rey: Forward payload is serialized incorrectly; probably because you use Tact template. It should be written like   .storeCoins(toNano('0.34'))  // forward_ton_amount   .storeMaybeRef(newTradeCell)  // forward_payload (reply to 112462)

Heydar: do we have a thin utility library  for ton interacting in C++?  for example converting address to another formats by that.

Max: Something like this?  let packed = beginCell()     .store(         storeTokenTransfer({             $$type: "TokenTransfer",             query_id: BigInt(0),             amount: toNano(usdtAmount),             destination: marketContractAddress,             response_destination: userAddress,             custom_payload: null,             forward_ton_amount: toNano("0.14"),             forward_payload: beginCell()                 .storeCoins(toNano('0.34'))  // forward_ton_amount                 .storeMaybeRef(newTradeCell)  // forward_payload                 .endCell()         })     )     .endCell(); (reply to 112483)

Jason: Heyhey, Do you know if there's a way to pull all existing Telegram miniapps from the Telegram API and then filter them by active monthly users?

Max: // Pack the USDT transfer message  let packed =  beginCell()         .storeUint(0xf8a7ea5, 32) // request_transfer op         .storeUint(BigInt(0), 64)         .storeCoins(BigInt(1000))         .storeAddress(contractAddress)         .storeAddress(userAddress)         .storeMaybeRef(null) // null custom_payload         .storeCoins(toNano('0.34')) // forward_ton_amount         .storeMaybeRef(newTradeCell) // forward_payload         .endCell();  Like this? (reply to 112483)

&rey: No, there isn't, as some might be private. Also, this is off topic. (reply to 112506)

Jason: Related to a TON app I was thinking of building. (reply to 112510)

Jason: I am surprised this is considered private as this data is readily available when searching the relevant app on TG

Max: Seems like the following code doesn’t work too:  // Pack the USDT transfer message let packed =  beginCell()                     .storeUint(0xf8a7ea5, 32) // request_transfer op                     .storeUint(BigInt(0), 64)                     .storeCoins(toNano(usdtAmount))                     .storeAddress(marketContractAddress)                     .storeAddress(userAddress)                     .storeMaybeRef(null) // null custom_payload                     .storeCoins(toNano('0.34')) // forward_ton_amount                     .storeMaybeRef(null) // forward_payload                     .endCell();                      const transaction = {             validUntil: Math.floor(Date . now() / 1000) + 60, // 60 sec             messages: [                 {                     address: usdtWalletAddress,                     amount: "530000000", // 0.53 TON                     payload: packed.toBoc().toString("base64")                 }             ]         }; (reply to 112483)

Heydar: guys please , who know that library? beause tonlib is really painful for external usage. (reply to 112501)

Token: I send op code and some ton to contract and contract according to that op code, send my ton to another address, then when I sign that transaction, any method to know that? I mean when simulate can I get that from contract to another address?

Aleks: Hey all! I’m doing some transaction batching on testnet and would need a bunch of ton for it

Aleks: Faucet is not providing fast enough!

Aleks: Any generous testnet soul willing to make a donation?

Steve: hi.. does anybody know how to initialize highload wallet? i sent a bit of ton to the created high load wallet, but tonviewer keeps saying it is “uninit”...

SP: You need to transfer from that wallet to others to initiate (reply to 112539)

Steve: do you have code example or know some resource which shows transfer with high load wallet in code? i don’t know of a wallet UI that works with high load wallet

TKAINU: How to delete 1 address on direction cell address?

Haint: ~dict_delete (reply to 112544)

Mehmet Ali: Looking for a jetton smart contract in tact. Taxing enabled. %8 of the total amount will be trasfered to the X address. For alll transfers excluding from and to from some addresses (something like tax exempt list)

&rey: No. (reply to 112668)

Nerses: Is there anyone from the Ston.fi team here who can answer a few questions about the protocol?

Kerimova: Hi everyone! I’m really hoping for your help)  I sent a request to /api/v3/accountStates to obtain information about the pool(s).  Request:   GET https://toncenter.com/api/v3/accountStates?address=EQCpiBkP3tfsReBtkelWmtBY0kyf53HPi9G7W7A5cMcxuFQ&includeboc=true  The problem is that I do not understand how to decode the received information further, and what exactly is encoded in data_boc regarding the pools.  Code:   async function main() {     const [data] = await syncPoolsService.fetchPoolData(["EQCoso0JfwkG-wH3zEgdcttOr0_zO9gOnG50CxJaLOFHNMDX"]); // Fetching pool data     const byteArray = base64ToBytes(data.data_boc); // Converting the base64 string to a byte array      const [cells] = Cell.fromBoc(byteArray); // Creating Cell from the byte array      const slice = cells.beginParse(); // Getting the slice     console.log(slice); }  main();   Terminal output:   Slice {   array: Uint8Array(40) [     101, 175,  49,   7, 164,   0,   8,   1, 178,      50,  14, 213, 174, 183,  60, 204, 183,  42,     253, 199, 220,  69, 216, 191, 107, 136, 211,     227, 199,  33, 120,  48, 193, 152,  54, 159,     221,  89,  51, 192   ],   length: 320,   readCursor: 0,   refs: [     Slice {       array: [Uint8Array],       length: 16,       readCursor: 0,       refs: [Array],       refCursor: 0     },     Slice {       array: [Uint8Array],       length: 80,       readCursor: 0,       refs: [Array],       refCursor: 0     }   ],   refCursor: 0 }

&rey: There is no ready-made solution. (reply to 112693)

Mehrdad: whats happening to Ton price! 🙁

Madre: Are there any ways to pay for a transaction from another wallet in TON? For example, I have 1000 subwallets that accept payments in USDT. I want to keep funds for the fee on the main wallet and pay for the transfer of USDT to it from it, in order to send funds from the "subordinate" wallets to the main one

Амир: Thats how wallet v5 works :) (reply to 112698)

P: Hello everyone. Could you tell me what is exit code 52334?

&rey: Defined by contract; possibly in hexadecimal form 0xCC6E. (reply to 112710)

luis: Hello, who can tell me how I can verify a Jetton token contract so that it doesn't mark me as a SUSPICIOUS transaction in Tonviewer?

&rey: Hell Tonapi knows that. (reply to 112712)

Madre: Oh, thank you so much, you mean gasless transactions, right? But, if I use testnet, and all my jeton's cost equals 0, this won't work? (reply to 112699)

&rey: Wallet v5's core principle is "signed transfer order can be executed even if received with money from another wallet". It doesn't mandate any jetton usage; jettons are simply Tonkeeper's business model. (reply to 112714)

&rey: For instance, I might launch a gas-subsidizing pool for "users in good standing" one time. Or might not, as it happens.

— 2024-10-06 —

Shadow: Hello. I'm using  import { TonClient }" from ton";  and trying to call getTransactions, but it doesn't work on my deployed contract   Error: Request failed with status code 500   if i use it for my wallet - it work. Can somebody help me, please

TKAINU: Hello, I want to save a white list of addresses into the contract, can I save it in a cell or something, because the cell can only store a maximum of 3 addresses, thank you.

SunG: Help, Is it possible to deposit and swap jettons using Dedust SDK on Dedust testnet?

jessepinkman: How can I use v5 wallet with tonconnect sdk? I want to send gasless transactions

&rey: I don't think that is supported. (reply to 112745)

jessepinkman: how can i build v5 gasless transactions? any documentation?

jessepinkman: i would like to get more details on v5 wallet gas-less txn support & txn simulation. im unable to find any docs. any help would be appreciated. thank you!

Rohit: Can anyone please share a crowdfunding contract written in Tact for the TON blockchain?

&rey: Here is one in FunC: https://github.com/aSpite/dominant-assurance-contract. (reply to 112756)

pid | ton: isn't that feature going to be built in layer 2, according to the roadmap? (reply to 112747)

Fardin: Hello my friends

Fardin: https://github.com/tonstakers/tonstakers-sdk  Did any body used this package/sdk before? Is it backed and verified by TON team?

Oleksandr: Does anyone know why in jetton-minter-discoverable int fwd_fee = muldiv(cs~load_coins(), 3, 2); instead of int fwd_fee = cs~load_coins()?

&rey: Because of a top-grade decision in TON to write 2/3 of total forward fee into message cell.  It is not intuitive but somewhat justified: 1/3 is taken by origin shard validators, 2/3 are taken at destination. (reply to 112790)

Pandemoniuz: Hello there. Is it possible to account gas paid for ext-out message sending whilst sending internal message with +64 (carry remaining inbound) flag?  Currently what happens on my blueprint smartcontract test is: 1. Value of msg_value after some gas was consumed by vm execution is 1898623600ng 2. Contract sends ext-out message. 3. It tries to send internal message with +64 mode, but fails with vm message not enough grams to transfer with the message : remaining balance is 1898089200ng, need 1898623600 (including forwarding fees).  If I comment out sending of ext-out message, everything works fine.

Oleksandr: thanks, in case of usage old model where it is not calculated like this, the function will be inoperable? (reply to 112792)

&rey: I don't think there has been any exhaustive check which would determine what impls fail and what succeed. (reply to 112795)

&rey: Almost always, flag 128 is better suited for keeping contract balance as-is. (reply to 112794)

Oleksandr: thank you, do you have any link to documentation describing this? i just want to understand the impact (reply to 112796)

&rey: No. The reasons for accounting forward fee are mainly educated guesses. (reply to 112798)

Pandemoniuz: +128 is for forwarding remaining balance of the whole contract with the new message  What I need is to forward only TONs that are remaining from the ones received in input message of this execution (reply to 112797)

Pandemoniuz: +64 works great for this purpose, but for some reason it doesn't take ext-out message sending fees into account

&rey: IIRC +64 doesn't even account for storage fee, so your contract balance decreases over time. (reply to 112801)

&rey: raw_reserve(0, 4) before sending anything. (reply to 112800)

Pandemoniuz: I'll check it out, tyvm (reply to 112803)

Max: Hey guys, I have a sophisticated issue trying to send a forward payload in a USDT transfer and then retrieve and read it in my contract that receives it. I feel like there are issues with serialization. Any ideas where the issue might be?  1. Here’s what my message looks like (Tact):  message IssueTicket {     depositId: Int as uint32;     provideLiquidity: Bool;     desiredPrice: Int as coins; }  2. Here’s how I initiate a transfer on the front-end:  let issueTicketCell = beginCell()             .storeUint(0xa27db6d6, 32) // op code             .storeUint(0, 32) // depositId             .storeBit(1) // provideLiquidity flag              .storeCoins(Math.round(desiredPrice * SCALING_FACTOR)) // desiredPrice             .endCell();  // Pack the USDT transfer message         const packed = beginCell()                 .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer                 .storeUint(0, 64) // query id                 .storeCoins(usdtAmount * 1e6) // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)                 .storeAddress(marketContractAddress) // TON wallet destination address                 .storeAddress(issuerAddress) // response excess destination                 .storeBit(0) // no custom payload                 .storeCoins(toNano("0.2")) // forward amount (if >0, will send notification message)                 .storeBit(1) // we store forwardPayload as a reference                 .storeRef(issueTicketCell) // forwardPayload                  .endCell();  const transaction = {             validUntil: Math.floor(Date.now() / 1000) + 360, // 6 min             messages: [                 {                     address: usdtWalletAddress.toString(),                     amount: "530000000", // 0.53 TON                     payload: packed.toBoc().toString("base64")                 }             ]         };  3. Here’s how I’m trying to read the forward payload: receive(msg: TokenNotification) {  try {     let issueTicketMessage: IssueTicket = IssueTicket.fromSlice(msg.forward_payload);                                 } catch (e) {     // Always getting an error }  }

Ton.: Hello guys glad to be here. I have some issues with my project and i need some help. I created a jetton and when it reach out 27k mc and join DeDust it apears at wallets as FAKE. How i could verify my jetton and be clear? Could anyone help me with that?

Token: should register on github (reply to 112812)

Ton.: And thats it? I will register and it will verify? (reply to 112813)

Sim: Hi! We need someone who can make changes to the our smart contract on Ton. Write to me, I will explain in more detail. Thanks.

Namon: hi! is there any cSBT smart contract code somewhere?

TKAINU: Hello, I want to verify a smart contract, do I need to add all related sources or just a few main files?

EDITOR FRED: Hi guys, I'm looking for work. Does anyone care to offer me one? I will surely deliver on time. I'm efficient.

Alexander: Hey, is there a way to get info which address deployed the contract without using storage?

&rey: All sources; in total, they must compile to the same bytecode. (reply to 112839)

Catid: hello anyone have reference for nft collection  and another wallet can mint nft ?

— 2024-10-07 —

sangmin: If I modify block, state, archive ttl in mytonctrl, do I need to start systemctl restart?

jessepinkman: Are there any dex aggregators other than swap.coffee ?

Rohit: Thanku so much .. Appreciate your efforts (reply to 112769)

Rohit: Can anyone please share a crowdfunding contract written in Tact for the TON blockchain?  in Tact not func...

TKAINU: Error: main.fif:277: GETSTORAGEFEE:-? error Command failed with exit code 1.   Hello i run: yarn blueprint build error, please help me

&rey: You are assuming that one exists. That's an unfounded assumption. (reply to 112912)

Rohit: actually, i need just concept or code of transfer ton from one contract to another (reply to 112916)

&rey: https://tact-by-example.org/03-send-coins. (reply to 112917)

TKAINU: I want to ask, does jetton's metadata.json file have to be stored on IPFS, or does it just need a storage link? (reply to 112919)

&rey: Any link. (reply to 112920)

Max: Hey guys, I’m having a hard time parsing a forward_payload in a USDT transfer. Am I missing anything here? Am I packing the message correctly?  1. Here’s how I send USDT on the front-end: let issueTicketsCell = beginCell()             .storeUint(2726147798, 32) // op code             .storeBit(1) // provideLiquidity (bool) flag as 1 bit             .storeCoins(toNano(desiredPrice)) // desiredPrice             .endCell();  // Pack the USDT transfer message const packed = beginCell()                 .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer                 .storeUint(0, 64) // query id                 .storeCoins(usdtAmount * 1e6) // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)                 .storeAddress(marketContractAddress) // TON wallet destination address                 .storeAddress(issuerAddress) // response excess destination                 .storeBit(0) // no custom payload                 .storeCoins(toNano("0.2")) // forward amount (if >0, will send notification message)                 .storeBit(1) // we store forwardPayload as a reference                 .storeRef(issueTicketsCell) // forwardPayload                 .endCell();  2. Here’s how I’m trying to read it in my Tact contract: try {     let messageCode: Int = msg.forward_payload.loadUint(32);  // Trying to retreieve the op code  } catch (e) {     // Always fails }

Abdulaziz: What's wrong with zero address, how he could trade

Rohit: thanku so much (reply to 112919)

Uncharted: Good day we are looking for a developer interested in building a project/DApp on TON There is no Upfront payment, but this is guaranteed to be worth your time

TKAINU: i deploy new jetton token,How can I display the price like USDT (reply to 112921)

Abdulaziz: You has deployed stable jetton token? I think you can't do like usdt because token price depends on supply and demand (reply to 112935)

Peng: hi guys im running ton-indexer it seem to be stuck pending trace  have anyone face this issue before?

sangmin: Is it possible to multi send using tonweb library??

Peng: sorry im not familiar with this (reply to 112941)

Peng: i am just running ton-indexer via offical github repo with offical docker compose and docker file pointed to my ton-node db

sangmin: I'm in the same situation. I restarted my indexer. (reply to 112940)

Peng: Did it work? (reply to 112945)

sangmin: yes

Peng: I restarted multiple times

Peng: Can i see your docker compose?

Peng: U are using the official github dockefile right?

sangmin: Have you tried restarting docker compose?

Tom: I tried to estimate fwd_fee of forward_payload depending on their bits and cells but it always gives false result. Could you please explain.  export function computeFwdFees(msgPrices: MsgPrices, cells: bigint, bits: bigint) {     return msgPrices.lumpPrice + (shr16ceil(msgPrices.bitPrice * bits + (msgPrices.cellPrice * cells))); }  For example, forward_payload with - 535 bits, 3 cells => expected 21801200n fwd_fee but the ~dump for the fwd_value (before/after muldiv32) are 730406n/1095609n - 1063 bits, 6 cells => expected 42922400n fwd_fee. Dump is giving  951208n/1426812n (reply to 112792)

Peng: You mean Docker compose restart?  Yes i did many times (reply to 112952)

Peng: Or you meant docker service itself

sangmin: If so, have you tried changing TON_WORKER_FROM in .env?

Peng: yes i did i set it close to newest block height 40880000

Peng: and than i get this pending traces

sangmin: your mytonctrl sync is nomarlize ?

Peng: ===[ Node status ]=== ADNL address of local validator: Public ADNL address of node: Load average[16]: 3.06, 3.06, 3.17 Network load average (Mbit/s): 25.39, 28.51, 48.96 Memory load: ram:[13.08 Gb, 20.9%], swap:[3.6 Gb, 2.6%] Disks load average (MB/s): nvme0n1:[0.36, 0.46%], nvme1n1:[30.79, 100.0%] Mytoncore status: working, 37 days Local validator status: working, 37 days Local validator out of sync: 50502 s Local validator last state serialization: 13299 blocks ago Local validator database size: 229.49 Gb, 27.8% Version mytonctrl: a467af5 (master) Version validator: 1bef6df ()

Peng: this is using mytonctrl2 offical docker repo + dumps set to true

sangmin: Did you access postgresql and see what max(mc_block_seqno) is in the blocks table?

Peng: sorry do you mind walking through this with me, i dont quite get it (reply to 112963)

sangmin: I was in the same situation, but it was normalized after changing TON_WORKER_FROM in .env.

sangmin: Can you enter the latest master seqno in TON_WORKER_FROM?

&rey: You must make the token exchangable at some price via one of DEXes. (reply to 112935)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 58 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 44  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Lauriano: How can you deploy new jetton token when there is already a Jetton token? (reply to 112935)

User<7012417474>: const body = beginCell()           .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer           .storeUint(0, 64) // query id           .storeCoins(Math.ceil(Number(stake) * 1e6)) // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)           .storeAddress(             Address.parse(toAddress),           )           .storeAddress(Address.parse(rawAddress))           .storeBit(0) // no custom payload           .storeCoins(1) // forward amount (if >0, will send notification message)           .storeBit(1) // we store forwardPayload as a reference           .storeRef(forwardPayload)           .endCell();          await tonConnectUI.sendTransaction({           validUntil: Math.floor(Date.now() / 1000) + 360,           messages: [             {               address: jettonWalletContract.toString(), // sender jetton wallet               amount: toNano('0.1').toString(), // for commission fees, excess will be returned               payload: body.toBoc().toString('base64'), // payload with jetton transfer and comment body             },             {               address: jettonWalletContract.toString(), // sender jetton wallet               amount: toNano('0.1').toString(), // for commission fees, excess will be returned               payload: body.toBoc().toString('base64'), // payload with jetton transfer and comment body             },             {               address: jettonWalletContract.toString(), // sender jetton wallet               amount: toNano('0.1').toString(), // for commission fees, excess will be returned               payload: body.toBoc().toString('base64'), // payload with jetton transfer and comment body             },             {               address: jettonWalletContract.toString(), // sender jetton wallet               amount: toNano('0.1').toString(), // for commission fees, excess will be returned               payload: body.toBoc().toString('base64'), // payload with jetton transfer and comment body             },                        ],         });  somebody know improve this to send multi address different in one message with one r commission fees

User<6452070203>: how rate-lite bridge.tonapi.io/bridge/events ?

Sandy: Hello everyone, how can we determine if a transaction is a simple transfer, token transfer, swap, or NFT transfer? Would be great if find the opcodes for these. Thanks in advance!

Cyril M |: what's the wrap jetton token for TON?

Vladik: sup guys) I have a question about the transaction fees, can someone tell me how to dynamically calculate a fee before actual transfer?

&rey: Do you have understanding of transaction phases? (reply to 112991)

Vladik: not really, but as I understood for simple TON transfer, there are 2 phases (reply to 112992)

Vladik: im pretty new to ton, so will be grateful for any help

Tadeusz: Hello there!   Guys, there's a problem with full node deploy. Trying to deploy node via ton-community/ton-docker-ctrl/blob/main/docker-compose.yml (dump=true).  After downloading 193gb the node crashed.  node.addr_list().size() > 0 failed  unfortunately I can't post the pastebin link here, the bot deletes it.

&rey: There are two transactions, with several phases each... 1. external msg to source wallet: <nothing to credit>, storage phase, computation phase, action phase 2. msg with money to dest wallet: credit phase, storage phase, computation phase, <no actions>. (reply to 112995)

Vladik: so, for usual ton transfer, i should consider all phases in order to calculate the total fee, right ? (reply to 112999)

Tadeusz: How can I request user credentials and password to gain access to download dumps? Is there any way to do without ZFS?

&rey: Not improvable. (reply to 112980)

Sandy: Anyone ... (reply to 112987)

Wonder: Hello, could you please let me know how to write map[string->object] in FunC?

Faraz Rayeen: Hello everyone

Abdulaziz: Is that hex number or offset of TVM? (reply to 112980)

mandar ray: Hi Guys I am building a mini game on ton and looking for a plug-and-play privacy layer on top of TON that a developer can leverage to make DeFi and consumer apps privacy preserving both for users and the codebases of smart contracts while ensuring accountability.   For reference, I am thinking of protocols such as Mina and and Nulink have privacy compute abilities.

Yash: Hello everyone, Can anyone please help me with this?   Please consider that Uni V3 Implementation wouldn’t work on TON because it is impossible to implement CLMM architecture with Ticks. Why is it impossible to build concentrated liquidity market maker on TON and why is it generally difficult to build Defi on TON?

Heydar: I just need some little utilities from tonlib in c++ and using tonlib is not good idea. someone know a good thin library around tonlib? that is just depend on c++ core.

Danil: Hello everyone, we are implementing custom modal for tx confirmation using tonconnect/react. We are trying to cancel tx (so user won't be able to confirm it) when user closes modal.   Is there some method for canceling tx?

Wonder: Hi Team, Could anyone please let me know how to write map[string->object] in FunC?

Akachi: I need to store some smart contract addresses in my smart contract. And according to the selected address, I need to call the function of that smart contract of selected address from my smart contract. Is this possible?

Akachi: @pcrafter Can you have a look on this and help me if you don't mind, please? (reply to 113042)

&rey: No, by construction of TON; you only can send a message there. (reply to 113042)

Akachi: The problem is to store the addresses of the smart contracts. Like mapping variable in Solidity, I can implement it like mapping (address  => bool ) smartContractVariables in EVM. Then, I can add/remove address as needed. Is it possible in TON? Then, how can I implement it? (reply to 113044)

&rey: cell, and use it for dictionary (267-bit address => ()). (reply to 113045)

Akachi: Hmm, can you give me specific solution? Like  var dict_addresses = ds~load_dict();  But when we store the dict_addresses~udict_set(31, id, data) id can only be the integer, not the address? (reply to 113046)

&rey: Use dict_set then. (reply to 113047)

⚡️ Ἑρμῆς (Hermes): Hi guys, please tell me that I got it correctly, I want to know jetton wallet balance inside my contract, there is no other way to wait for messages of transfer to my jetton walled and than add received value? Or I shall do it some other way? Thx for help!

Ivan: Hi! Has anyone connected a dart/flutter app to a ton blockchain? Are the existing libraries complete for production?

&rey: You have to wait for transfer notifications, generally. That has a pleasant side effect of correct "synchronization". (reply to 113052)

Nidhi: Can anyone can give me internship in web3?

BizX: do you have any project? (reply to 113069)

Nidhi: Yeah I have few projects in one I worked on just frontend, and other integration (using ethersjs), I have my personal project too in where backend part is still I'm working on along with learning (MongoDB) (reply to 113071)

Nidhi: I can share GitHub repos of it (reply to 113071)

BizX: you mean you are developer? (reply to 113075)

Nidhi: Yeah (reply to 113076)

Gio: Can someone please elaborate why transaction fees for TON and Jettons are so Different 0.03$ for Ton and 0.1 for NOT and other tokens?

&rey: Because jettons aren't native to TON blockchain, instead being implemented with several contracts. (reply to 113103)

Gio: If I get this right, everything other than TON coin costs more per transaction (reply to 113104)

Ksms: Hi guys, I am deploying a contract written in tact and it automatically compiles using version 1.5.2. But the verifier does not accept a version higher than 1.5.1. I've been trying for hours to make it compile with 1.5.1. but I can't make it work, I always get that 1.5.2. is not supported. Do you have any idea Which package imports that? The default  npm create ton@latest causes this issue

دی دی پرایم: Hi how can I run storage-daemon binary on mac? It is showing like a regular text file not executable file

Nil: I am exploring opportunity to participate in the open league hackton ,, my project is on chain data analytics, although i have strong background in cyber security but i am not that great in coding, to build my project 1st step is to collect data on chain transaction, but i am not able to do that i did wrote a python script to exact data using api mainnet as well as testnet but not successful, if anyone  interested to help me that will be great

Nil: I am talking about the one sponsored by Akrham (reply to 113124)

Heydar: swapping unverified tokens in ston.fi can be a scam? I mean they sent tokens , and I can swap the tokens to TON in ston.fi  if I confirms that , it can be an issue?

Heydar: smart contracts can steal money from wallets without 12-24 words (prv keys)? (reply to 113130)

&rey: No (unless they are installed as plugins, but you're unable to do that by accident).  dApps may merely ask you to transfer all valuables to certain contract, sometimes with wrong emulation which'd show you receiving something in exchange. (reply to 113131)

&rey: It's better to do in programmatic way; TON is especially good for that, as the first message upper-bounds how much you can lose.  (About custom tokens: check that jetton wallet returned by it is of that jetton, not of USDT, as otherwise you may be scammed to transfer a more expensive jetton.) (reply to 113130)

— 2024-10-08 —

Akachi: I was using dict_set() to implement address -> () But I found that we don't have dict_get() function How can I load then? (reply to 113048)

Luka: Hello, looking for savvy developers on TON   Scammers - don't even try to write, I don't fall for your tricks)

Akachi: @pcrafter Why we don't have dict_get() here, While we have udict_get() and idict_get()?

Daniel: hey has anyoned faced the Error: Integrity check failed when running npx blueprint run with testnet and connecting using tonhub?

Haint: you can write one, pretty simple   (slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT"; (reply to 113159)

sangmin: hello ~!  Is it possible to multi send with tonweb library?? If possible, I would like to get an example code.

Akachi: https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc I found that use case in this repo, but not sure how I can use it (reply to 113169)

Haint: Instead of uint/int key, you pass in a slice as key. (reply to 113177)

Akachi: Let me try, thanks. (reply to 113178)

TKAINU: How to withdraw excess ton from my contract, does anyone have an example? Thank you very much

Haint: 1. define an operation to withdraw excess 2. use raw_reserve to indicate how much you want to keep in your contract 3. send msg back to your wallet with mode 128 (reply to 113180)

TKAINU: Am I doing this right? (reply to 113181)

&rey: Almost. Remember that outgoing message has some structure which you violated. (reply to 113184)

TKAINU: Can you help me point it out? I can't find the error (reply to 113185)

&rey: /unwarn (reply to 113185)

&rey: Correct code would be begin_cell()   .store_uint(0x18, 6)   .store_uint(sender_address)   .store_coins(0)   .store_uint(0, 107)   .end_cell()   .send_raw_message(128); You can check out differences in docs, or in chat history, or ask. (reply to 113186)

Haint: If you do it like this, everyone can claim the excess. (reply to 113184)

Phoenix: I have ton contract written by tact. But I want to convert it to func. Is there any method?

&rey: Two ways: 1) rewrite it in FunC directly 2) look in build artifacts, find out there's already FunC code (reply to 113198)

Denys: Hi all, please help me with ECRECOVER. I have this code, which should recover public key from message hash and signature:  #include "imports/stdlib.fc";  (int, int, int, int) ecdsa_recover(int hash, int v, int r, int s) asm "ECRECOVER";  (int, int, int, int) get_ecdsa_pub_key(int hash, int v, int r, int s) method_id {         return ecdsa_recover(hash, v, r, s); }  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure { }  As you can see ECRECOVER returns 4 numbers, the first 3 are the values from which the public key can be retrieved and the 4th is a boolean value which means whether the public key was successfully recovered or not. I want to do this check recovered_pubkey == signer_pubkey.  The question is, how can I get the public key from these 3 numbers so that I can compare it with another address?

&rey: You can't compare public key with address, as those are unrelated entities. (reply to 113206)

Denys: and how to get the address from the public key, or the public key from the address, or how to solve this situation differently? (reply to 113208)

&rey: 1. If signer is sending message, then just check that message comes from them (source address in in_msg_full).  2. Otherwise, store signer public key in contract directly, and use check_signature.

&rey: Note: a) you can't get address from public key as there is a lot of wallets, with more to come b) you can't get public key from address as that requires reversing SHA-256 and, once again, knowing specific wallet code

&rey: c) contract interacting with yours may be automated, not having any keypairs for offchain control

Denys: Got it, thanks for the explanation. In this case the second option suits me, I will store the signer public key in the contract to compare it with the recovered one. But how do I get the public key from these 3 numbers that ECRECOVER returns?

&rey: You don't need to recover anything if you have original public key; you can simply check signature, as that has no unintuitive security implications. (reply to 113213)

sangmin: Please tell me how to multi-send ..😭

Denys: and tell me please, how do I get a public key (I understand it can be done from the seed phrase), but through the wallet (for example tonkeeper) it can not be done, I need to write code? (reply to 113214)

Rahul: Be aware of this guy. He try to threaten me with my smart contract. Good day to all of you 😁 (reply to 113223)

User<7464188086>: scammer (reply to 113226)

Peng: [ 3][t 6][2024-10-08 07:34:49.543551398][IndexScheduler.cpp:235][!indexscheduler]       40880002 / 40914876     0.000000/s (-8s)        Q[0M, 0b, 0t, 0m, 0T] [ 3][t 3][2024-10-08 07:34:53.761154301][TraceAssembler.cpp:109][!trace_assembler]       Pending traces: 524 Pending edges: 810 Broken traces: 456   i manged to get the indexer to not be 0 after upgrading my EBS volume iops but its on 40880002 for awhile now  regarding TON_WORKER_FROM i have set it close to the latest block height have u experience trhis before? (reply to 112966)

sangmin: I'm also testing now. Maybe I can't read it because ton node doesn't have that block seqno. How did you set ttl in mytonctrl? (reply to 113231)

Peng: version: "3.9"  x-indexer-environment: &index-common   POSTGRES_DIALECT: ${POSTGRES_DIALECT:-postgresql+asyncpg}   POSTGRES_HOST: postgres   POSTGRES_PORT: "5432"   POSTGRES_USER: postgres   POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password   POSTGRES_DBNAME: ton_center   POSTGRES_DBROOT:   POSTGRES_PUBLISH_PORT:  x-index-api: &index-api   TON_INDEXER_API_ROOT_PATH:   TON_INDEXER_API_PORT: 8081   TON_INDEXER_TON_HTTP_API_ENDPOINT:   TON_INDEXER_IS_TESTNET:   TON_INDEXER_REDIS_DSN: redis://event-cache:6379   TON_INDEXER_WORKERS: 100   <<: *index-common  x-index-worker: &index-worker   TON_WORKER_FROM: 40800000   TON_WORKER_DBROOT: /tondb   TON_WORKER_BINARY: ton-index-postgres-v2   TON_WORKER_ADDITIONAL_ARGS:   <<: *index-common  services:   event-cache:     image: redis:latest     networks:       - internal     command: redis-server --maxclients 40000   event-classifier:     build:       context: indexer       dockerfile: Dockerfile     secrets:       - postgres_password     command: python3 /app/event_classifier.py --pool-size ${TON_INDEXER_WORKERS:-1000} --fetch-size 200000 --batch-size 10000     environment: *index-api      networks:       internal:    index-api:     build:       context: ton-index-go       dockerfile: Dockerfile     secrets:       - postgres_password     command: -prefork -threads ${TON_INDEXER_WORKERS:-1}     ports:       - target: 8081         published: ${TON_INDEXER_API_PORT:-8081}     environment: *index-api     restart: always     networks:       internal:    index-worker:     build:       context: ton-index-cpp       dockerfile: Dockerfile     secrets:       - postgres_password     volumes:       - /var/blockchain/ton2/db:/tondb     environment: *index-worker     networks:       internal:     command: --from ${TON_WORKER_FROM:-1}     restart: unless-stopped    postgres:     image: postgres:16     environment: *index-common     ports:       - ${POSTGRES_PUBLISH_PORT:-5432}:5432     secrets:       - postgres_password     command: postgres -c max_connections=200 -c shared_buffers=40GB -c work_mem=2048MB -c max_wal_size=1GB -c maintenance_work_mem=10GB -c effective_cache_size=60GB -c wal_buffers=16MB -c tcp_keepalives_idle=60 -c tcp_keepalives_interval=60 -c tcp_keepalives_count=60     healthcheck:       test: ["CMD-SHELL", "pg_isready -U postgres"]       interval: 5s       timeout: 5s       retries: 5     shm_size: 2G     restart: always     volumes:       - postgres_data:/var/lib/postgresql/data     networks:       internal:     logging:       driver: local       options:         max-size: 4G  volumes:   postgres_data:     driver: local     driver_opts:       type: none       o: bind       device: /var/blockchain/pg-data-local  networks:   internal:     attachable: true     external: false  secrets:   postgres_password:     file: ${POSTGRES_PASSWORD_FILE:-private/postgres_password} (reply to 113232)

Peng: this is the docker compose from offical repo, i just edited abit

sangmin: Did you install mytonctrl?

Peng: yup i did

Peng: using their new docker setup too

sangmin: Please check ttl by entering mytonctrl > installer > status

Peng: and my AWS instance met the hardware requirements for litserver

Peng: okay (reply to 113240)

Peng: MyTonInstaller> status ===[ Services status ]=== Full node status: enabled Mytoncore status: enabled V.console status: enabled Liteserver status: enabled ===[ Node arguments ]=== --threads: 31 --daemonize:  --global-config: /usr/bin/ton/global.config.json --db: /var/ton-work/db/ --archive-ttl: 2592000 --verbosity: 3  MyTonInstaller>

Peng: what is yours (reply to 113240)

TKAINU: {    "name": "TON Smart Challenge #2 Winners Trophy",    "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",    "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",    "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",    "attributes": [] }  I want to ask if there is a size limit for images

sangmin: I am setting it to 500 and testing it. After index-worker stops, there should be a stopped seqno in the /var/ton-work directory, but we expect it to be erased by ttl.

Peng: how do you change the ttl (reply to 113248)

sangmin: installer > set_node_argument —state-ttl 500

sangmin: unit sec

Peng: can you please tell me if setting to 500 did anything in restarting the state (reply to 113250)

sangmin: After setting 500 seconds, stop index-worker and restart index-worker after time to see if the same error occurs.

sangmin: I hope the indexer developers can solve it quickly...

Peng: but this ttl affects ton-node / mytonctrl which is fetching data to update our database blockheight right? not actually affecting index-worker  as long as  mytonctrl > status > Local validator out of sync is less than 20s means our ton-db is updated  if im not wrong index-worker is reading the db and reorginise it into postgres db so that index-api can work and qurery (reply to 113255)

TKAINU: I want to ask if there is a size limit for images of metadata?

Peng: i assume there is something wrong with index-worker instead of ttl on mytonctrl (reply to 113255)

sangmin: Is it working normally now?

Peng: oh wait you are asking me to test by changing ttl? i thought you tested it (reply to 113260)

sangmin: No, I'm the only one who needs to test. Is there any change since the number you showed me earlier?

Peng: now no (reply to 113262)

sangmin: Maybe /var/ton-work doesn't have 40880002 number block? (reply to 113263)

Peng: hmmm indexer i have restarted it is reschuedling again let me see if restart works (reply to 113264)

sangmin: Got TraceAssemblerState with 209583 pending traces and 2757 pending edges.index-worker-1      | 2024-10-08T08:12:03.454766550Z [ 3][t 6][2024-10-08 08:12:03.454700767][IndexScheduler.cpp:100][!indexscheduler] Accepted 32937 of 32937 existing seqnos. Next seqno: 40912937  I stopped the indexer and ran it again, and this time I found seqno normally (reply to 113265)

Peng: So should add ttls 500 and restart indexer? (reply to 113266)

sangmin: no

sangmin: I tested it with ttl low, but it seems normal.

Peng: normal as in stuck? (reply to 113271)

Peng: it finish rescheduiing now it got worst is 0 / 40916138

Peng: [ 3][t 1][2024-10-08 08:43:12.553812025][TraceAssembler.cpp:109][!trace_assembler]       Pending traces: 68 Pending edges: 810 Broken traces: 0 [ 3][t 3][2024-10-08 08:43:15.557628000][IndexScheduler.cpp:235][!indexscheduler]       0 / 40916177    0.000000/s (-8s)        Q[0M, 0b, 0t, 0m, 0T]

Sarkin🐸: Hello please brothers I need help

Sarkin🐸: How can I sell my NFT?

sangmin: Have you checked max(mc_block_seqno) by directly connecting to postgresql?

Sarkin🐸: Yes bro

Sarkin🐸: I have 3 NFT

Denys: please tell me if it is possible to do func insertions in tact code?

Sarkin🐸: Do you need (reply to 113288)

Denys: I don't know yet, just interested in the possibility. Tact is a relatively new language, so if it suddenly doesn't have the tools I need, can I add them using func? (reply to 113289)

Sarkin🐸: Yes

Sarkin🐸: Just save my number in private I'll send it to you (reply to 113290)

Denys: For example, I went to the Tact documentation and it says that you can't upgrade contracts in this language, unlike func.

Peng: -s, --state-ttl<arg>                 state will be gc'd after this time (in seconds) default=86400 Btw do you know what does gc'd means (reply to 113284)

Kerimova: Hello everyone again)   I found an endpoint on TON for getting information about several pools at once: /api/v3/accountStates.   And how data_boc is encoded in STONFI:  if (op == getter_pool_data) {      var payload = begin_cell()         .store_uint(getter_pool_data, 32)         .store_uint(query_id, 64)         .store_coins(storage::reserve0)         .store_coins(storage::reserve1)         .store_slice(storage::token0_address)         .store_slice(storage::token1_address)         .store_ref(begin_cell()             .store_uint(storage::lp_fee)             .store_uint(storage::protocol_fee)             .store_uint(storage::ref_fee)             .store_slice(storage::protocol_fee_address)             .store_coins(storage::collected_token0_protocol_fee)             .store_coins(storage::collected_token1_protocol_fee)         .end_cell());     send_payload(sender_address, payload.end_cell());     return (true); }   But I can't decode it (the addresses throw an 'unsupported address type' error, and the other values are decoded incorrectly). What could be the mistake? Has anyone worked with this?   async function main(address) {     const data = await syncPoolsService.fetchPoolData(address); // Get pool data     const byteArray = base64ToBytes(data[0].data_boc); // Convert base64 string to byte array     const cells = Cell.oneFromBoc(byteArray); // Create Cell from byte array     const slice = cells.beginParse(); // Get slice     const dataPool = {         op: slice.loadUint(32).toString(),         query_id: slice.loadUint(64).toString(),         reserve0: slice.loadCoins().toString(),         reserve1: slice.loadCoins().toString(),         token0_address: slice.loadAddress().toString(),         token1_address: slice.loadAddress().toString(),         additional_data: {             lp_fee: slice.loadRef().loadUint(16).toString(),             protocol_fee: slice.loadRef().loadUint(16).toString(),             router_address: slice.loadRef().loadAddress().toString(),             protocol_fee_address: slice.loadRef().loadAddress().toString(),             total_supply: slice.loadRef().loadCoins().toString(),             collected_token0_protocol_fee: slice.loadRef().loadCoins().toString(),             collected_token1_address: slice.loadRef().loadCoins().toString(),         }     }     console.log(dataPool); } main('EQD5-gID5XHfmwBl3Pm_iwnM3y9pbJZmW1M-2Sgz19uxBw28');

Felix: Hey guys, this is Felix from Gem💎 We are looking to partner with ton apps, we can list your Jetton on Gem Wallet.

Felix: Also looking for ton apps that can give us spot in quest lists.

Deedee: hello, want store mapping like solidity in func, how i do that

Token: use dict (reply to 113308)

Deedee: like: global dict(slice,int) balances = dict_new();;

Token: you can log the data on first line of main function and can show us the result. I think address must be not string, just Address type, so Address(address) maybe Address import from ton/core (reply to 113303)

Kerimova: Apart from the address error, the rest of the data is decoded incorrectly( Code:  async function main(address) {     try{         const data = await syncPoolsService.fetchPoolData(address); // Получаем данные пула         const byteArray = base64ToBytes(data[0].data_boc); // Преобразуем строку в формате base64 в массив байтов         const cells = Cell.oneFromBoc(byteArray); // Создаем Cell из массива байтов         const slice = cells.beginParse();// получаем slice         console.log(slice);         const dataPool = {             op: slice.loadUint(32).toString(),             query_id: slice.loadUint(64).toString(),             reserve0: slice.loadCoins().toString(),             reserve1: slice.loadCoins().toString(),                     token0_address: slice.loadAddress().toString(),                     token1_address: slice.loadAddress().toString(),                     additional_data: {                         lp_fee: slice.loadRef().loadUint(16).toString(),                         protocol_fee: slice.loadRef().loadUint(16).toString(),                         router_address: slice.loadRef().loadAddress().toString(),                         protocol_fee_address: slice.loadRef().loadAddress().toString(),                         total_supply: slice.loadRef().loadCoins().toString(),                         collected_token0_protocol_fee: slice.loadRef().loadCoins().toString(),                         collected_token1_address: slice.loadRef().loadCoins().toString(),                     }         }         console.log(dataPool);     } catch (e){         console.error(e);     } } main('EQD5-gID5XHfmwBl3Pm_iwnM3y9pbJZmW1M-2Sgz19uxBw28');   Log:   Slice {   array: Uint8Array(105) [     128,  14, 243, 185, 144,  42,  39,  27,  42,   1, 200, 147,     138,  82,  60, 254,  36, 231,  24,  71, 170, 235, 106,  98,       0,   1, 237,  68, 167, 122, 192, 231,   9, 194, 129,  65,      80,   2, 250, 148, 128,  69,  61,  97, 197, 116, 146,  39,       2, 252,  13, 195,  55,  41,   7, 220, 178, 120, 248, 154,     132, 140,  30, 252, 124, 239, 250,  65, 112, 210,   0,   8,     168,  90, 140,  89,  49,  53, 106, 140,  76, 252, 196,  67,     252,  65,  37, 184,   3,  42,  43,  34, 175, 191, 241,  64,     159, 128, 147,  76,     ... 5 more items   ],   length: 840,   readCursor: 0,   refs: [     Slice {       array: [Uint8Array],       length: 328,       readCursor: 0,       refs: [],       refCursor: 0     },     Slice {       array: [Uint8Array],       length: 80,       readCursor: 0,       refs: [Array],       refCursor: 0     },     Slice {       array: [Uint8Array],       length: 80,       readCursor: 0,       refs: [Array],       refCursor: 0     }   ],   refCursor: 0 } Error: unsupported address type     at Slice.loadAddress (/Users/new/Documents/Проекты /Мои /orderbook-syncer-stonfi/src/libs/decode/boc/Slice.js:133:39)     at main (/Users/new/Documents/Проекты /Мои /orderbook-syncer-stonfi/src/test.ts:23:43)     at processTicksAndRejections (node:internal/process/task_queues:95:5) (reply to 113312)

&rey: Not a good idea to store all balances in single contract. (reply to 113310)

BoOmar: Hello guys, I am the founder of the Arab punks Nft project   I have a problem with taking a snapshot of the Holds addresses. Is there anyone who can help me or guide me in this matter?

Deedee: func or tact for good and essay to newbie

Elizabeth: Okay (reply to 113349)

Akachi: @pcrafter Can you let me know when I get Type Check Error (Exit code 7)? https://testnet.tonviewer.com/transaction/430b01fa2f74ccd9fbeac53f876ffd85f0e00df1ce4d125c4c23b2f45f605647

Hassan: Hi

Kunal: I am trying to achieve something similar, can you please share details on how to send multiple messages in one transaction? (reply to 111819)

Token: how many do you want to send? walletv4 only 4 messages and highloadwallet can send 255 messages in one transaction (reply to 113438)

Kunal: I want to initiate multiple jetton transfers in single wallet transaction. less than 3 .

Token: you can read doc about ton,  I think there are js script to send messages. less than 3 is really easy for everyone

Barenboim: hi there guys, I'm new to TON, I'm trying to ingest data, specifically events (events Overview in tonscan). Could anyone tell me about any public API that provides this type of data?

&rey: Tonapi does that. (reply to 113469)

Nil: No one  will help me at least any suggestions or else i have to leave this venture (reply to 113124)

Михаил: Hello everyone! Sorry for a bit off-top, we want to share with you 2 tools we made for TON community:  Cold wallet for TON focused on maximum security: bounty proposal, github Generator of personalized wallet addresses: bounty proposal, github  If you find projects useful, you may react and comment on project proposals and star repositories. This support will help us to be eligible for a bounty program

Ton.: Hello there. I need a simple tip from you guys but not so simple for me.. Is anybody available to give me some info for 1 minute please?

&rey: It would be faster to just ask. Ask. (reply to 113533)

&rey: I don't remember how Tonviewer jetton verification is done.

Ton.: haha how you read that i thought it deleted instant (reply to 113537)

Ton.: did you read what i said or i should say it again without the link?

&rey: Admins have power to read deleted messages in groups.  Btw, deletion by Combot was just, as it had no way to know what was at the link. (reply to 113538)

Ton.: I sent the tonviewer link to show you our token

Ton.: Why this is happening i can not understand seriusly. We have updated DYOR we apdated dexscreener we reach mc to join Dedust..Gas.pump create our token we can not mint more or something like that. Have you any idea with who i have to speak for that one?

Ton.: If anybody could help guys i will appreaciated a lot cause we made some hard work with site socials pay dexscreener and for other verifications..

Igor 🦴: Trying to implement auth with tonProof from example in official docs. Main issue is that wallet.connectItems is always undefined. Any ideas how I can fix it?

X 💎: Hello, what payment gateway do you use to deposit and withdraw Ton?

&rey: TON is a blockchain; there are some gateway templates, but not widely used. (reply to 113550)

X 💎: I use CoinPayment, it is really slow and has a high fee, which service do you suggest I use? (reply to 113551)

&rey: I suggest you use no services and instead watch transactions on TON, via one of APIs provided without charge (TonCenter, Orbs, tonapi, dton.io/graphql, etc). (reply to 113552)

X 💎: Thanks for the advice mate🫶🏻 (reply to 113554)

&rey: Please remember you need a qualified developer, so that each incoming transaction is accounted once exactly, and each outgoing is sent once exactly.  Both of these tasks are possible but error-prone. (reply to 113556)

Igor 🦴: Here is my code btw, nothing special   const login = async (wallet: ConnectedWallet | null) => {     if (!wallet) {       tonConnectUI.setConnectRequestParameters({ state: "loading" });       const { data: payloadToken } = await authService.generatePayload();       tonConnectUI.setConnectRequestParameters({ state: "ready", value: payloadToken });       return;     }      if (wallet.connectItems?.tonProof && !("error" in wallet.connectItems.tonProof)) {     }   };   Trying to figure out what determines the presence of this props (connectItems) in wallet object (reply to 113548)

Michal: Hey, are there any options to manage TON W5 wallet straight from the terminal via some kind of CLI tool? I’ve looked through all of the desktop wallets, but they only support web / GUI interfaces. I’d like to manage multiple wallets straight from the script, so any CLI tool or programming library that would help be with that would be very helpful

/B4ckSl4sh\: Could you please explain what exactly is the problem? (reply to 113545)

Aliaksandr: https://github.com/ton-community/compressed-nft-contract/tree/main (reply to 112834)

Kushagra: Hi everyone, I want to distribute jetton to more than 100 users in a single transaction, is it possible to do it without a smart contract? Also any reference contract example?

Token: recommend highload wallet (reply to 113580)

Kushagra: Thank Son, I guess highload wallet is more for sending multiple transactions, here my ask is for just one transaction but multiple transfer. Are highload wallets useful for this as well? (reply to 113582)

&rey: Fundamentally, as >100 users will be credited on their jetton wallets, it is impossible to do in single transaction.  It's possible to send one message TO your wallet contract, then it will need to send >100 messages to your jetton wallet. preprocessed-wallet-v2 is particularly useful for this. (reply to 113580)

Coffee: Hello I'd like to know that could we use the existing tg wallet instead of using the ton spaces for TMAs?

Coffee: did you found any reason for this? (reply to 108734)

— 2024-10-09 —

BizX: hi, are you looking for developer? (reply to 113651)

Tom: I thought we can send as many messages as we want, as long as the gas limit is not reached? Sorry if I’m mistaken. (reply to 113617)

Kurt | Phước Báu Community: Hi sir, we have just deploy our token in token but still unverified token, how we could solved this problem

final: Well, unverified means what? That the token was not verified, surprisingly… (reply to 113671)

final: Thus you need what..?

MoHaMaD 🇮🇹: Hi, How can I share a GitHub issue here? Can I share its link in this group?

&rey: Please name its repository (not link) and number, that's more certain to be kept by moderation bot. (reply to 113705)

MoHaMaD 🇮🇹: Guys, please answer this issue:   Repository:  ton-blockchain/ton    Number:  1259

&rey: Well, that's not hard: () transfer(slice to, int amount) impure {     slice sender = get_pugy_sender();     var (slice owner, slice name, slice symbol, int decimals, int total_supply, cell balance_dict, cell approve_dict) = load_data();  var cannot be used here. (reply to 113711)

MoHaMaD 🇮🇹: I changed the snippet code with removing `var`: () transfer(slice to, int amount) impure {    slice sender = get_pugy_sender();     (slice owner, slice name, slice symbol, int decimals, int total_supply, cell balance_dict, cell approve_dict) = load_data();         int sender_balance = balance_dict.dict_get(256, sender);    throw_unless(error::insufficient_balance, sender_balance >= amount); But that error throwed again:  ``` Func compilation error: Pugy.fc:44:128: error: cannot assign an expression of type (slice, slice) to a variable or pattern of type (slice, slice, slice, int, int, cell, cell): cannot unify type (slice, slice, slice, int, int, cell, cell) with (slice, slice)      (slice owner, slice name, slice symbol, int decimals, int total_supply, cell balance_dict, cell approve_dict) = load_data(); ``` (reply to 113712)

&rey: Please try reordering functions so that load_data is on the top.  Also, are you aware that your token can be used by 32K people at the very most, and is now written incorrectly? (reply to 113713)

MoHaMaD 🇮🇹: Ok, I test it! (reply to 113714)

MoHaMaD 🇮🇹: Why is my code incorrect? I don't know anything about it! I'm new to FunC. (reply to 113714)

MoHaMaD 🇮🇹: I tried to reorder functions but this error throwed: Func compilation error: Pugy.fc:27:64: error: previous type of function load_data : () -> (slice, slice) cannot be unified with new type () -> (slice, slice, slice, int, int, cell, cell): cannot unify type (slice, slice) with (slice, slice, slice, int, int, cell, cell)    (slice, slice, slice, int, int, cell, cell) load_data() inline { What is the best order for that? (reply to 113714)

&rey: Oh. It seems that another included file had load_data as well, doesn't it? (reply to 113717)

MoHaMaD 🇮🇹: Let I check it! (reply to 113718)

MoHaMaD 🇮🇹: I renamed load_data() to pugy_load_data(), but this new error throwed: Func compilation error: Pugy.fc:35:40: error: lvalue expected before ~load_slice        slice name = name_ref.begin_parse()~load_slice(); (reply to 113718)

&rey: It's a lot to complain about; over all the code, developer assumes that things work a certain way.  — The main issue which you'd notice immediately on testing, is that TON addresses are not 256-bit. — On burn you're trying to transfer tokens to null address, which would only lead to failed action phase and no changes. — Storing all balances in single contract. That could be justified, without — Allowances. How are they supposed to be used? Also, there can be at most 32K allowances over all users, it is impossible to store more in a single contract. — Burn is somewhy only allowed for admin. — [continuing seems suspiciously like an audit, so I'll stop here] (reply to 113716)

MoHaMaD 🇮🇹: Ok, thank you very much. I will alter the code! (reply to 113721)

Микита: Hello everyone, I am looking for any articles or information on how to call contract methods from the server side (Ubuntu VDS). The server should interact with the contract as the owner. I assume that I need to obtain the private key for this, but I’m not sure how to use it afterwards. All I can find online are examples of frontend-side code :(

&rey: w = await WalletV3R2.from_mnemonics(...) await w.send_transfer(...) (reply to 113727)

TKAINU: hello, I am deploying my jetton token on mainnet, but in ton keeper, the token is showing as undefined token, I want to ask how to authenticate the token and display the price like usdt above, thank you very much (reply to 113729)

musashi: maybe adding liquidity to stonfi or dedust could resolve this mate (reply to 113739)

Peng: hello all  has anyone have issue with ton-indexer?

ChainHacker: Hi! Is there a way to get the whole message chain starting with its initial tx when we get a message from a contract in a client app? Thanks!

Baldwin: how to using function check_signature?

&rey: Please check out code of wallets; wallet v4r2, for instance. (reply to 113749)

Minimal ☄️: Guys, how to detect the device which someone is using to enter my app, how to differ between PC and mobile?

Igor 🦴: Could you please tell me if there are any admins from tondev [ru] in this chat? I posted a message with a link to the official documentation, and I got banned. This happened yesterday. Can anyone help?

&rey: Idk but probably the same way that sites detect that; I believe information can be found in internet or in @devs chat history. (reply to 113756)

&rey: Tonapi does that, or you can load transactions one-by-one until you hit one not produced by internal message. (I intentionally avoided "produced by external", as tx chain might be started by tick-tock transaction on the Elector.) (reply to 113747)

Minimal ☄️: Thanks, found it in the meantime, if anyone needs it: const WebApp = Window.Telegram.WebApp var platform = WebApp.platform (reply to 113760)

User<6934166783>: Hello!  I am developing my own exchange that will utilize Ton tokens. To effectively test the functionality and ensure the stability of the platform, I need 10,000 Ton test coins.  These funds will help test the exchange functions, deposit and withdrawal processes, as well as the user interface. I am confident that this testing will help identify potential issues and improve user experience on the platform.  Thank you in advance for your assistance and support!  Ton Testnet Network: 0QBc8iIq7Up64c93dnehzHIBhPep7ZAWqV0wBDo1MyuTxFe1

JOBIANS TECHIE: Bro please help me

JOBIANS TECHIE: async function getUserJettonWalletAddress(userAddress, jettonMasterAddress) {   const client = await initializeClient(NETWORK);   const userAddressCell = beginCell().storeAddress(Address.parse(userAddress)).endCell();    const response = await client.runMethod(jettonMasterAddress, 'get_wallet_address', [     { type: 'slice', cell: userAddressCell },   ]);    return response.stack.readAddress(); } (reply to 113768)

&rey: Please connect it to MyLocalTon.  That effort will most certainly not be wasted, as it will help you in times when APIs are unstable. (reply to 113764)

Haint: the jetton master address is probably incorrect (reply to 113773)

Papa: Hello guys.... I've been trying to build an algorithmic stable coin which is pegged on Ether and unlike traditional stable coins where it's backed up with let's say ether, this one will use algorithms to peg to the price of ether, who is in for this adventure

&rey: Is it related to TON in any way? (reply to 113778)

Haint: copy the jetton master address (reply to 113779)

&rey: @final656 Hereby, you have a moderator warning. Rhetoric questions are often fine; "0 IQ" reaction doesn't help with constructive environment.

JOBIANS TECHIE: It same error , I'm also getting that error from minter_ton_org (reply to 113781)

final: idk how r u so patient (reply to 113782)

Haint: what's the jetton master address? (reply to 113786)

Haint: works fine

Haint: why do you call that function against your wallet address? (reply to 113793)

Haint: call it here  https://testnet.tonviewer.com/kQCdDJT7NP7S4B060qDRdT9d_5mmLa4lflz43OxMLGtrtSFS?section=method

Haint: you probably pass your wallet address as the jetton master address (reply to 113792)

Haint: what is TOKEN_CONTRACT_ADDRESS? (reply to 113797)

JOBIANS TECHIE: jettonMasterAddress (reply to 113798)

Haint: code looks fine did you check the network? (reply to 113799)

Hugo Mai: Excuse me! I would like to ask about telegram miniapp. Could I ask here or move to another group?

🤴King 🤴: Hey guys, does anyone know why after a day there’s no change in the Local validator out of sync and database size? Is my TON light server running properly? How can I check if it’s working right?

Arkadi: Hi everyone, I'm having trouble with sending TON transaction, most transactions are successful but, sometimes I get successful response (txid), but i cant find transaction on tonscan, neither with my address, nor with txid.  Any ideas?

Token: pls share here (reply to 113809)

Arkadi: This is TxId I got: this is what BE responded:  EvS07IFpjCRzAkah2IKQaqgk3VDksbKEibQrMXTqm0g= (reply to 113810)

⚡️ Ἑρμῆς (Hermes): Hi guys, is my understanding correct that JettonTransferNotification.sender is user's Jetton wallet address, not USER address itself?  If so, how can I get USER address from JettonTransferNotification (if I can at all?) If not, what are the workaround? Thx

kevin: Hi, anyone know how to get ton TX accept by chain faster?

Arkadi: No one? (reply to 113809)

JOBIANS TECHIE: testnet (reply to 113800)

Saman: Hi...  When we receive ton blockchain course SBT ?  Please answer🙏

Siddhanth: Is there english version of the course ? (reply to 113825)

Saman: Nope (reply to 113826)

Siddhanth: I can see only chinese and russian version, very wierd that english version is't there!

JOBIANS TECHIE: Brother thanks, I used this package now (reply to 113800)

&rey: Yes it will happen. (reply to 113809)

Sword: Help, I deployed jetton minter contract but can not see any metadata after deployed, can anyone tell me the reason

&rey: message source: YOUR jetton wallet JettonTransferNotification.sender: user's address  Hope this helps. (reply to 113814)

&rey: For any specific purpose? (reply to 113816)

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: Hello everyone can anyone help me. I have problem, that I want to send jettons using JavaScript and it gives error that ton is not defined in ton.boc.Cell() and I understand it, it happens because my code is client-side and i can install libraries using only <script src="">, so I've tried to search on jsdelivr but it still gives same error: ton is not defined. Please, can you help me!

NPA120: Are you working on vanilla javascript? (reply to 113874)

TON Bounty Bridge: ​Developer Education Program on the TON Blockchain.  🏷 Education  Summary:Create and improve educational materials for a 3-week online workshop on TON blockchain development....  Created by HillaryMaende

Akachi: I am interested in 2nd and 3rd fields. (reply to 113651)

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: yes (reply to 113875)

Elizabeth: Okay (reply to 113882)

Pooria: hello there the offical ton course dose not explain the depth of the contract logic and its very un clear to me is there any other course out there to help me understand the fundumentals of FunC?

Akachi: (slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";  var (_, success) = has_contract.dict_get?(32, address); if (success == false) {     has_contract.dict_set(32, address,        begin_cell()       .store_int(-1, 32)       .end_cell()       .begin_parse()     ); }  I used has_contract.dict_get? function like the above, but the success value is always returning false, even I set has_contract to have address index. Can you check what's wrong here?

&rey: Length of TON address isn't 32 but rather 267. (reply to 113889)

Namon: hi everyone! Has anyone deployed cSBT? https://github.com/ton-community/compressed-nft-contract (collection_exotic_sbt.fc) For some reason, when I pass in claim transaction with proof with owner, content & authority, owner remains empty, content is passed correctly, and authority takes the value of owner  Does anyone have any idea what the problem might be?

Akachi: OH, so it should be 267, right? (reply to 113901)

Akachi: (slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT"; var (_, success) = has_contract.dict_get?(267, address); if (success == false) {     has_contract.dict_set(267, address,        begin_cell()       .store_int(-1, 32)       .end_cell()       .begin_parse()     ); }  I tried this, but still the success  is returning false, though I set the has_contract several times. (reply to 113901)

&rey: ~dict_set instead of dot. (reply to 113920)

Akachi: Let me try (reply to 113923)

Akachi: Thanks, it works. (reply to 113923)

Ksms: If I do:   send(SendParameters{         to: ...,         value: 0,         mode: SendRemainingBalance,         bounce: false,       });  when I receive a message, is the storagefee paid from ctx.value or the balance of my contract?

&rey: Doesn't matter: balance will become zero anyways. (reply to 113929)

Ksms: I have implemented a nativeReserve() before that, so the reason I am asking is to see if I hould reserve the storage fee also

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: so can you help me? (reply to 113875)

&rey: It should work fine; you can test, though, because reality is the ultimate arbiter. (reply to 113932)

Sabath: Hi, I need to create a program that will buy Telegram Stars from fragment with my TON wallet's balance. How can I do this?

&rey: I don't think that is possible. (reply to 113938)

Sabath: I've been using third-party API that can order Stars using my TON wallet balance, with secret-phrase as authenticator. (reply to 113940)

&rey: I'm uncertain if they conform to Telegram terms; if not, Stars so obtained may be revoked. (reply to 113946)

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: Can anyone help me, how to create invoice to buy something with Telegram Stars in WebApp, because i haven't found any examples or docs how to pay stars in Web Apps, there are only how to make them in telegram bots(  Can anyone send example?

&rey: Do you have an example? 😄  I believe it isn't implemented yet. (reply to 113948)

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: I haven't got. It is implemented, like you can check out Major bot for example (reply to 113951)

Shadow: Hello! Can somebody help me, please, I'm getting 9: Cell underflow.  int keccak256_tuple(tuple t) asm "DUP TLEN EXPLODEVAR HASHEXT_KECCAK512";  int keccak256_slice(slice s) inline {     tuple slices = empty_tuple();     int continue = true;      while (continue) {         if (~ s.slice_empty?()) {             slice current_slice = s~load_bits(s.slice_bits());             slices~tpush(current_slice);              if (s.slice_refs_empty?()) {                 continue = false;             } else {                 s = s~load_ref().begin_parse();             }         } else {             continue = false;         }     }      return keccak256_tuple(slices); }     I'm sending only "    slice sender = cs~load_msg_addr(); "

&rey: Do your slices sum up to integral number of bytes? (One address is 267 bits.) (reply to 113970)

Shadow: Let me improve, i think, no. Thank you (reply to 113974)

Ksms: Is it possible for a send message that defines no body to bounce?

Shadow: thank you! it works, btw, I also want to insert the result into a cell. Am I correct in understanding that this thing returns 280, and I need to use store_int(result, 280)?  UPD: it's doesn't work( i got 5 · Integer out of expected range (reply to 113974)

NPA120: yes, I can help you, friend (reply to 113933)

— 2024-10-10 —

&rey: Empty body, you mean? Yes, it will still bounce. (reply to 113977)

&rey: 280? If so, opcode will return two integers, which you need to store. (You can store to builder directly, by the way.) (reply to 113981)

Akachi: You should use Telegram mini app with backend. https://t.me/ConfirmationTestBot/Confirmation You want something like this? (reply to 113948)

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: or something like this @DurgerKingBot (reply to 114070)

Akachi: so anyway you want to buy with telegram star, right? I can help you (reply to 114079)

diwo1: hi, Have you solved your problem? I have also encountered the same problem. Can you share the solution (reply to 113808)

diwo1: What should I do to synchronize it

Ksms: Yes I mean something like that. I do not define any body, so how would it be possible that it fails at the receiver?  send(SendParameters{         to: user,         value: 1,         mode: SendPayGasSeparately | SendBounceIfActionFail       }); (reply to 114051)

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: yes (reply to 114091)

Akachi: DM me (reply to 114102)

Akachi: The main logic should be handled in the backend with grammy, then the mini app use it. (reply to 113948)

Ivan: Hello! Im working on interact with a TON contract, and dont know how to get the transaction hash of a contract call. Can anyone help me with this?

Akachi: You can get the tx hash using client. Let me share the code. (reply to 114112)

Akachi: const transaction = await client.getTransactions(counterAddress, { limit: 1 }) const txHash = transaction[0].hash().toString('hex') (reply to 114112)

Peng: does restarting server and restart mytonctrl work? (reply to 114096)

Peng: does restarting server and mytonctrl work? (reply to 113808)

Peng: i had the same issue it went away after awhile

Павел: Hi, guys I need to test minting large set of nfts in testnet. How can I give more than 2 TON per hour via testgiver?

diwo1: After restarting, it did not take effect (reply to 114117)

Ivan: These code can get the last hash in transactions tree of a contract call, but I need the first hash which is shown in TonKeeper's history list on behalf a contract call. (reply to 114114)

Akachi: The first tx in the TonKeeper wallet isn't the latest tx? (reply to 114124)

Ivan: No, it isn't (reply to 114125)

Ivan: It only shows the first tx in txs tree

Peng: Sorry cant help than Do u have ton indexer running? (reply to 114122)

Nik: Hello, could someone help me?  Builded 2024.09 version and got this:   Running simple validator-engine test... /coin/run.sh: line 31:    18 Illegal instruction     (core dumped) validator-engine -h   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current                                  Dload  Upload   Total   Spent    Left  Speed 100    13  100    13    0     0     95      0 --:--:-- --:--:-- --:--:--    95 Running simple validator-engine test... /coin/run.sh: line 31:    18 Illegal instruction     (core dumped) validator-engine -h

sangmin: hello. Please tell me how to multi-send..

Peng: btw sangmin can u share with me ur docker compose (reply to 114131)

sangmin: I'm also using the official version.

Peng: can i see the parameters

Peng: i cant get index-worker to insert data into postgres

Peng: its always stuck on 0/big number

Peng: index-worker:     build:       context: ton-index-cpp       dockerfile: Dockerfile     secrets:       - postgres_password     volumes:       - /var/blockchain/ton2/db:/tondb     environment: *index-worker     networks:       internal:     command:       # - --from       # - "40800000"       - --max-data-depth       - "0"       - --threads       - "32"       - --io-workers       - "10"       - --max-active-tasks       - "1024"       - --max-insert-actors       - "5"       - --max-queue-blocks       - "1"       - --max-queue-txs       - "1"       - --max-queue-msgs       - "1"       - --max-queue-size       - "1"       - --max-batch-blocks       - "1"       - --max-batch-txs       - "1"       - --max-batch-msgs       - "1"       - --max-batch-size       - "1"       - --force

Peng: my index-worker i even use force it does not reindex

sangmin: Try replacing the TON_WORKER_FROM in .env with the latest mc_block_seqno

&rey: Then you get in_msg from that transaction and go backwards from it. (reply to 114124)

Peng: if i do this, it will only index the newest block right? (reply to 114141)

sangmin: That's right. I'd like to know how many blocks are in your /var/ton-work, but I don't know how to figure it out. (reply to 114143)

Peng: U know indexer logs? (reply to 114145)

Peng: [ 3][t20][2024-10-10 09:07:16.403659545][IndexScheduler.cpp:235][!indexscheduler]       40973833 / 40973834     0.323286/s (3s) Q[0M, 0b, 0t, 0m, 0T] (reply to 114145)

Peng: the number on the left <<< is u postgres the number on the right >> is your /var/ton-work/db

sangmin: You need to know the lowest block number, not the latest block number.

Akachi: app.get("/generate-invoice", async (req, res) => {   const title = "Test Product";   const description = "Test description";   const payload = "{}";   const currency = "XTR";   const prices = [{ amount: 1, label: "Test Product" }];    const invoiceLink = await bot.api.createInvoiceLink(     title,     description,     payload,     "", // Provider token must be empty for Telegram Stars     currency,     prices,   );    res.json({ invoiceLink }); }); (reply to 113948)

Akachi: Use this in the backend to generate the invoice url and open it in mini app. (reply to 114152)

Peng: how do u reindex from 1? (reply to 114150)

sangmin: No, I had direct access to postgresql and made sure it was stored up to what block.

Peng: no i mean, how do u force index-worker to start inserting data to postgres from block 1 (reply to 114156)

Peng: i use --from 1 it did not work or i use --force it did not work

sangmin: you need to download the dump file, but as far as I know, there is nothing to provide from number 1.

Peng: ahhh okay

Peng: so the only solution would be to run mytonctrl clean without dumps to get from number 1? (reply to 114159)

sangmin: If you start mytonctrl anew, it will probably sync from the latest block.

Diction: I test in the sandbox, but why it say that i have not deploy the contract? Can someone help me?

Diction: Pls

Diction: But I have already compiled and deployed (reply to 114171)

Diction: #include "imports/stdlib.fc";  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     slice fee_receiver = "EQAC5JO3u44W5m0BNCU0ItINOTKI6xncFaHG0oV9g8AAoipQ"a;     int fee_amount = 4500000;     if (msg_value >= fee_amount) {         cell sc = begin_cell()             .store_uint(0x10, 6)             .store_slice(fee_receiver)             .store_coins(fee_amount)             .end_cell();          send_raw_message(sc, 1);          int refund_amount = msg_value - fee_amount;         if (refund_amount > 0) {             (slice addr_type, slice sender_address) = in_msg_full.begin_parse().load_msg_addr();             cell sc_refund = begin_cell()                 .store_uint(0x10, 6)                 .store_slice(sender_address)                 .store_grams(refund_amount)                 .end_cell();              send_raw_message(sc_refund, 64);         }     } else {         send_raw_message(in_msg_full, 64);     } } (reply to 114175)

Diction: This is my source code (reply to 114177)

Ksms: Sorry for insisting, if I send this , will it bounce back if the recipient implements a receive() that fails or will the funds stay with the recipient? send(SendParameters{         to: user,         value: 1,         mode: SendPayGasSeparately | SendBounceIfActionFail       });

Curio: Hi, im trying to use api.GetTransaction() but all the time throws error like no transaction were found, or panic: lite server error, code -400: requested account id is not contained in the shard of the specified block. I do not know how to fix it. Im generating the api client and the block like this: api := ton.NewAPIClient(client, ton.ProofCheckPolicyFast).WithRetry()   api.SetTrustedBlockFromConfig(cfg)   / connection to TON blockchain /   // we need fresh block info to run get methods   block, err := api.CurrentMasterchainInfo(context.Background())   if err != nil {     panic(err)   }

Curio: someone knows how to get transaction details from single transaction?

Tadeusz: Does anyone have mytonctrl working in docker? Checking system requirements This machine has 24 CPUs and 131017948KB of Memory Setting global config... Setting processor cores Starting validator  Checking system requirements This machine has 24 CPUs and 131017948KB of Memory Setting global config... Setting processor cores Starting validator

&rey: There are no correct parts. (reply to 114177)

kevin: hi, I want asking is there any TON nodes is more faster ?  as it seems that public liteservers in global-config.json seems relative slow , it there is where can I found them.

Alexander: Hi everyone, are there any ton sdk's for C? (not C++, not C# but clean C)

Anan ττ: Where can i buy Stars,thanks

.: I'll develop a turnkey TMA for $3,000

Alex: hey everyone, I am using toncenter api to query latest transactions for the account, the api v2 has params lt and hash, but it returns all transactions happened before the provided lt and hash, I want all transactions after that... Is there a way to achieve that?

Token: if you not set that param, will get latest transactions, that function is provided cause limit is 100 (reply to 114231)

Alex: gonna try, thx (reply to 114232)

Giannis: Hey everyone, quick question—does anyone here have a connection with the TON Foundation?  I’m trying to assign a username to our bot to enable custom emojis, but the fee is currently set at 1000 TON (around $5K USD).  Honestly, I think they may have forgotten to adjust the amount after the recent increase in TON/USD  It seems a bit steep to pay $5K just for a bot attachment, so I was wondering if anyone could help connect me with someone at TON to discuss this. Appreciate any leads! 🙏

Cyril M |: anyone knows the testnet api for stonfi?

Cyril M |: or how to a pool data on testnet

Anton: Folks, we are looking for FunC and Tact smart contract developers: https://t.me/tonhunt/446

Curio: thanks for nothing :)

Олег: Hey guys, who can tell how can I do mapping in funC?

Diction: No correct parts? (reply to 114191)

Diction: Are all of them incorrect?

Pegu: How do i encode like a string text in the message body slice? Example "RANDOM MSG" in message_body    cell msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(addr)     .store_coins(amount)     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_slice(message_body)   .end_cell();

&rey: It will fail but not bounce, both because of insufficient TON. (reply to 114179)

Ksms: insufficient ton on the side of the recipient?

&rey: TON in message, since only those are used for message handing (absent accept_message on that path) (reply to 114266)

&rey: Add 32-bit zero opcode before text bytes. (reply to 114262)

Pegu: thanks! (reply to 114268)

Pegu: Is it the same for jetton transfer message? (reply to 114268)

&rey: There, you need to add those bits into forward payload. (reply to 114271)

Pegu: Gotcha, thank you (reply to 114285)

Denys: Hi guys, hint how to verify Tact contract at https://verifier.ton.org/  If I upload all the files I have in the build folder, I get this error: Error: Compile error  {"stack":"Error: Unsupported tact version: 1.5.2\n at TactSourceVerifier.<anonymous> (/app/src/source-verifier/tact-source-verifier.ts:91:15)\n at Generator.next (<anonymous>)\n at fulfilled (/app/src/source-verifier/tact-source-verifier.ts:28:58)","message":"Unsupported tact version: 1.5.2"}

Pegu: Is there a way to better track transaction using @ton/ton or @ton/core lib? I'm using it to openContract and send transaction through provider.internal but it only return void. Do i need to use another lib to get the hash after sending?

Igor 🦴: What is the best solution you know for on ramp widget (where user can buy ton with fiat a deliver it to selected address automatically) ?

loafing: Quick question: How do I fetch the comment (MEMO) from a transaction with npm ton?

Catid: any one have example build nft smart contract editable with func ?

— 2024-10-11 —

Akachi: Interested (reply to 114249)

Tony: hi, everyone. I am considering build a full TON node lite server (no validator mode) just for the wallet feature. I wonder what is the hardware requirement for that?

Akhil 🍅 🏎 ▪️: How to contact telegram support team?

sangmin: Hello. How to multi send in wallet contact v4 using tonweb library?

D_d: guys can I do sendTransfer with @tonconnect/ui sdk or no? Is it really big difference between sendTransaction and sendTransfer ?

D_d: also guys should we have like normal discord channel ?

Sol: Hello everyone, I am looking for technical assignments on the topic of smart contracts to gain experience. I already have one developed smart contract on my account. If anyone needs it, I will demonstrate the code or its operation

Kraven: how can I store a string as a key dict in contract

&rey: It isn't supported. (reply to 114380)

sangmin: 😭😭Then, is there any other way? (reply to 114392)

&rey: Yes. Multisend using @ton/ton. (reply to 114393)

sangmin: Thank you. Can I get an example link? (reply to 114394)

sangmin: Is @ton/ton an online signature? I'm using an offline signature.

&rey: They refer to exactly same onchain action "send message to some contract". There might be difference in preprocessing message payload (sendTransaction does none, but sendTransfer might). (reply to 114383)

&rey: You mean, cold wallet? In any case, you can take code of either lib (wallet wrapper, specifically) and tweak it. (reply to 114396)

sangmin: okay, thanks ! i will try it ! (reply to 114398)

Jatin Sahijwani: Hey

Jatin Sahijwani: Is there someone who is responsible for Hackathon partnerships in India

Sabath: Hi, is anybody know where I can read documentation of how to use Fragment.com/api ?

User<2044870299>: /stat@combot

Daniel: hey guys im trying to troubleshoot why my contract call to a testnet contract is failing and this is the tx, but i cant seem to find logs here, any idea how we can troubleshoot this? to give more context, the same function call works on local https://testnet.tonviewer.com/transaction/4eccce64e3a46459cfe3b16d6afb829632c57aeec599d1a235c7b4ca6b4e071b

User<2044870299>: 4eccce64e3a46459cfe3b16d6afb829632c57aeec599d1a235c7b4ca6b4e071b

Luqman: Hi

Dmitry | backend4you.ton: Exit code: 65535  Usually this error is thrown when contract received msg with unknown op_code (reply to 114425)

Daniel: thanks! (reply to 114433)

Justin: Hello everyone, is there any way to request a wallet like tonkeeper to sign a boc without sending a transaction? I didn't find a similar method in the tonkeeper api, or did I miss something?

Frankie: Hello, We are developing a smart contract that we want to use dict with its key is string. Is there anyone here has this experience? Thank you!

Token: when I developed presale contract, I have experienced with that. (reply to 114458)

Ho: Hello everyone, I'm integrating ads gram into my project. I built a project based on typescript, I was able to play the ad but the url to reward the user was not called while the ad returned successfully and I also saw adsgram dashboard counting ad views.

Edm: Hello, our tma is using tonconnect/ui. Some of our users are seeing blacked out connect button with loading spinner. And the loading process stuck forever.  Anyone has experienced this before?

Cabdi Qaadir Cali: /Thank you for information Business

Frankie: Thank you for your response! My situation is: 1. We prepare a message to call from BE to contract. This message will store a new element of a dict with the key is string type 2. On the Contract side: we use store_slice to store a string that will be used as the key of dict 3. On the Backend side: We use storeSlice (with the string that we want to send to contract) to prepare the message. But we just can input the address type with storeSlice, we can not input string type. 4. We are using Nodejs and ton/core version 0.56.3  Could you please help me with my case? (reply to 114459)

&rey: There isn't such option, mainly for user funds safety. (reply to 114453)

&rey: Please note that all keys must have the same bit length, and be quite short (I'd suggest <= 800 bits = 100 bytes). (reply to 114458)

&rey: Also, storing addresses as strings is not a good idea, as there are multiple equivalent representations, and storing addresses in dict in a single contract is not a good idea either, unless you're sure there will be few participants (for contract to work cheaply enough, a fine limit would be 255).

Success: Hi

Frankie: Thank you for your response, I appologize if my English makes you confuse. We don't store addresses as strings, my situation is that we are trying to use storeSlice with string type in the backend side to prepare the message but the ton/core doesn't allow us.  We don't know how to send a string to contract from Backend 😢 (reply to 114469)

musashi: try storeStringTail mate (reply to 114472)

Kraven: how to load that one in smart contract? (reply to 114473)

Justin: If I need to perform multi-signature validity checks in smart contracts, how can I get all owners to sign the message when I create it? (reply to 114467)

Akachi: https://docs.ton.org/develop/func/stdlib#:~:text=~dict_set(cell%20dict%2C%20int%20key_len%2C%20slice%20index%2C%20slice%20value)%20asm(value%20index%20dict%20key_len)%20%22DICTSET%22%3B Use this. (reply to 114390)

Akachi: https://docs.ton.org/develop/func/stdlib#:~:text=~dict_set(cell%20dict%2C%20int%20key_len%2C%20slice%20index%2C%20slice%20value)%20asm(value%20index%20dict%20key_len)%20%22DICTSET%22%3B Same question, you can use dict_set() (reply to 114458)

Akachi: I agree, as address is represented as different formats. But what if we need to store address, any other solution? (reply to 114469)

&rey: ~dict_set(267, addr, content); — check that addr is valid and not a null address (two zero bits) beforehand. (reply to 114480)

&rey: It is not implemented in common wallet apps, indeed. Whether it ever will, is an open question and largely depends on what projects are out there.  (Also, DAOs usually just aggregate multiple approval messages, from each owner individually.) (reply to 114475)

&rey: What would you even do with string there? Just forward it, I believe? I'd suggest putting it in a separate reference, as storeStringTail might take all space in current cell. (reply to 114474)

Justin: Thank you very much for your help. I am currently using multiple messages to implement this, and it seems that this is the only way to keep it for now. (reply to 114483)

Kunal: Does ton have alternate to for callStatic in ethereum, which is used to read only execute a function to check its output?

&rey: No. (reply to 114491)

&rey: Or, rather, if you have code and data for contract, you can do RUNVM on it. (There is no onchain way to obtain state of another contract, except The Config). (reply to 114491)

BoOmar: Good day guys here any one from Getgems Ton Nft Marketplace?

Behindthemask 💎🥷🏽: @alexuniverse1 cydm bro

Abdulaziz: What i get if i became full node of ton

ae: Hello, standart jetton wrapper here. what are forward_ton_amount and total_ton_amount values for?

Akshay: I am trying to build transaction tracer on TON and needs some help.  On ethereum,  Block, Receipts and Traces are helpful to trace a transaction.   How to accomplish this on TON.  Masterchain has block hashes of Shardchain to understand the movement. However,  rpc nodes have Traces and Receipts to understand transaction and fees?

live: hi，everybody， Does anyone know the difference between this jetton_wallet_v1 and jetton_wallet contract type?

&rey: v1 probably stands for a specific implementation. They have same functions. (reply to 114545)

live: But when I build the message body this way, all the wallets that send messages to v1 are bounced, what is the reason for this?

BoOmar: Hello everyone, does anyone here know if there is a NFTs holders snapshot tool available on TON?

&rey: Because Tact's serialization is not entirely conforming to TEP-74. You need a zero bit in forward payload, to indicate that all of its non-existent data is written inline, not in ref. (reply to 114549)

live: Modify it like this? (reply to 114551)

Token: use tonapi (reply to 114542)

Token: recommend see doc about ton, there is detail description about ton chain's principle (reply to 114541)

live: thanks，My code is already working fine, is there any documentation on this issue? (reply to 114551)

&rey: It's not an issue, it's mainly developer not noticing that abstraction they use does not fit. (reply to 114564)

peilipu: hi everyone ,when i trying to send transaction , i got error like this ,could someone know this error cause?

peilipu: err:Transfer error failed to send message: lite server error, code 0: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 1BA5BC62DF0B75703630A39CE3CBE9776BC43C9ED74FDC0499C4838D9C9C5DFE: exitcode=33, steps=33, gas_used=0

&rey: Are you sure that seqno is valid? (You've just truncated the most important part of error, its opcode trace.) (reply to 114570)

peilipu: its too long

&rey: No, you have hit rate limit instead. Combine thoughts into one message. (reply to 114574)

peilipu: VM Log (truncated): ...OW execute XCHG s1,s3 execute LEQ execute THROWIF 35 execute PUSH c4 execute CTOS execute LDU 32 execute LDU 32 execute LDU 256 execute ENDS execute XCPU s3,s2 execute EQUAL execute THROWIFNOT 33 default exception handler, terminating vm with exit code 33

peilipu: lite server rate limit ?

&rey: This chat's rate limit. (reply to 114577)

peilipu: ok

peilipu: seems like i will got such error when i send transactions  too fast, how can i fix or prevent it happening

&rey: You can't send next transfer until previous one had changed wallet's seqno. (reply to 114581)

&rey: If you are able to group transfers, you should do so (on either wallet v3r2, preprocessed-v2 or wallet v5). If you aren't able to do that, use highload wallet.

peilipu: can i send transaction with customized seqno. like what i do in ethereum, example i parallel send txs with nonce 18,19,20,21...

&rey: For highload wallet only. Consider that it costs more. (reply to 114584)

Павел: Excuse me, highload wallet operations costs more? (reply to 114593)

Павел: 1tx with 1 message is more expensive on Highload Wallet V3 than on Simple V4 Wallet?? How much? Types of wallets are given for example. @pcrafter (reply to 114594)

&rey: preprocessed-wallet-v2: ~0.00152 TON v4[r2]: 0.002663084 TON (total network fee, including message receipt) highload-v2: ~0.00383 TON (reply to 114595)

Tim: What about v3? (reply to 114597)

&rey: I don't have one at hand; perhaps someone could test and share total fee as shown in Tonviewer? (reply to 114598)

Abdulaziz: What will happen if i put 1mb bytecode on Blockchain

&rey: You will be unable to do so. To start, contract may hold only 65536 unique cells in storage, and each can have 1023 bits of data at most. (reply to 114600)

Tim: I can send tx, but not sure if it’s optimal way (reply to 114599)

Abdulaziz: It says i can put 8mb maximum (reply to 114602)

&rey: highload v3r1: 0.00473039 TON (reply to 114597)

Abdulaziz: I think i can put whole nft image on Blockchain (reply to 114604)

Павел: If I send 250 messages in one tx on highload wallet, would it be 250 * 0.0047... TON? (reply to 114605)

Abdulaziz: So it will be onchain fully (reply to 114606)

&rey: Slightly less. (reply to 114607)

&rey: IIRC there is also limit on external message, either 32 or 64 KB, so you won't be able to fit whole image at once; forward fee would be prohibitive as well. (reply to 114606)

Abdulaziz: I just wanna create unique nft which in onchain not ipfs, even if Blockchain storage is expensive (reply to 114611)

&rey: I've done that (https://github.com/ProgramCrafter/onchain-nft-collectioned) with smaller images. (reply to 114613)

Abdulaziz: Technically it's possible with bigger images, right? I guess onchain metadata makes collection more unique and expensive. (reply to 114614)

Abdulaziz: https://tonapi-img-cache.fra1.digitaloceanspaces.com/8831f6a3351f0682d705f97a7b65f5cc4ba10da8d8707a6522f9b1d47ef29897.webp

Abdulaziz: It's offchain or what

&rey: It's cache link. Deploy sends image to blockchain, not to some offchain service. (reply to 114616)

Abdulaziz: image_data is nft image on onchain right? (reply to 114618)

Abdulaziz: Is that base64 or what

&rey: Once again, a Tonviewer representation, as bytes cannot be shown directly... (reply to 114620)

Nick: I minted a new Jetton and distributed to users, but when they try to transfer it other wallets they get insufficient funds. How do user transfer jettons that have no market value at thus time?

𝓢𝓱𝓪𝓱𝓪𝓫: Hi man  Have you any idea about how to remove unverified label from collection items? (reply to 104612)

𝓢𝓱𝓪𝓱𝓪𝓫: I'll appreciate it if anybody can help me verify my collection on the network

Cyclone: Good day everyone

Cyclone: If you need a nice from need developer

Cyclone: Who will come up with nice UI design and development user friendly

Cyclone: I am available to get the job done

Sravan 💠: I think you need to apply for getgems verification (reply to 114636)

Elliot: Hello. Where can I learn more about actual shardchains? How can I see how many shardchains are currently on the network?

𝓢𝓱𝓪𝓱𝓪𝓫: For this my collection needs to have more than 10,000 TON trade volume  And this is too much   There is no other way? (reply to 114644)

Max: Hey guys, does anyone know if the toncenter’s Total Requests per Seconds limit is per IP or for all users?

chebu: I assume it is for all users but they give you more than 1 api key so you can always fall back in case of rate limits (reply to 114661)

⚡️ Ἑρμῆς (Hermes): Hi guys, need some help, I am trying to calculate my contract Jetton wallet inside the contract struct JettonWalletData {     ownerAddress: Address;     jettonMasterAddress: Address; }  fun calculateJettonWalletAddress(ownerAddress: Address, jettonMasterAddress: Address, jettonWalletCode: Cell): Address {     let initData = JettonWalletData{ownerAddress, jettonMasterAddress};     return contractAddress(StateInit{code: jettonWalletCode, data: initData.toCell()}); } As Jetton I use example from ton-dynasty  function from JettonWallet -  override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {         return initOf ExampleJettonWallet(owner_address, self.jetton_master);     }  Jetton Master function - get fun get_wallet_address(owner_address: Address): Address {         let initCode: StateInit = self.calculate_jetton_wallet_init(owner_address);         return contractAddress(initCode);     }  Yet in my tests I get two diffrent wallets, I am loosing my mind  let masterPredictedWallet = await jettonMaster.getGetWalletAddress(MyCoolContract.address)          console.log(await MyCoolContract.getJettonWallet()) // EQCEMrJerbRirCbXmbDXNik03AmvErXe5_yYR9ZINwNHWFFS         console.log(masterPredictedWallet) // EQAS3hnn6C1KeNNn3ehx90iOqqMAEGaPs6xbNaCRwMtAro3Q  Any Ideas what went wrong?  jettonWalletCode are same, so I am just stuck

chebu: which one? (reply to 114664)

Max: Thanks! It seems like it might be better to use a free tier without an API key, if we have a thousand of concurrent users (reply to 114662)

chebu: thats a fine approach, you can always upgrade later (reply to 114668)

Max: It just seems like there’s no solution if we need thousands of RPS per second

chebu: you could place toncenter api behind your own rate limit / queue (reply to 114674)

Max: So should try to cap it at 1 request per second (reply to 114681)

⚡️ Ἑρμῆς (Hermes): api key so you can always fall back in case of rate limits (reply to 114662)

⚡️ Ἑρμῆς (Hermes): not in this half huh

Catid: hellow what its (reply to 114614)

Catid: I want to create a collection NFT like  Gatto official,   where users can mint their own NFT and enter the JSON in our API,   is that possible?

&rey: The banned word stands for "without any charge". It is autodeleted because it's often used in scam sent here. (reply to 114668)

Catid: exampel like gato

&rey: I'm not sure that init data is calculated that way. Also, do you wish an universal solution which'd work for any jetton? (reply to 114666)

&rey: User-mintable NFTs... possible. You don't need any backend for that, by the way; just comment out the restriction that only admin may mint. (reply to 114708)

Catid: but i dont have source (reply to 114712)

⚡️ Ἑρμῆς (Hermes): I got this approach from tact docs I'd love the universal solution (which does not seem to exist?), but , now would be fine if it would work with my jetton :) (reply to 114711)

Catid: in tutorial in docs ton  its use smart contract getgems (reply to 114712)

&rey: Please check out https://gist.github.com/ProgramCrafter/53fc3a4846397ee5f3f3b25ca3356ab5; Tact version may need to be adjusted, I haven't tried compiling it. (reply to 114714)

Tim: does it include tx to itself? (reply to 114605)

Steve: Hello, forks

Yevhenii: Can anyone advise a good way to parse body of the message_content from the `in_msg`of a jetton transfer? I need to reliably get comment from this message.         "message_content": {           "hash": "Jz4EZfnhD1hcnCyR5GdFcJR6VVFRQGh0z9hdrdSmU0s=",           "body": "te6cckEBAgEAYQABqA+KfqVUbeTv/lkybTmJaAgBXUVauUUOypCmpsuBMMhckfPUWv4srRaz6dUMv3HrtVMANCxEr6AZYFoZEg+FJnRzHfLB0RuzNjcnxgxgPENaSDRCAwEAEAAAAAB0ZXN0UTe4iQ==",           "decoded": null         },

— 2024-10-12 —

Legal Stark Community: Can anyone from Ton ecosystem guide to get Jetton Verified ?

Алина: Is there's a good way of decoding external messages out there? Tonapi doesn't seem to support wallet v5 messages

peilipu: hi guys,i have a question about high-load wallet,if i send 10 messages at once in one transaction, will the 10 messages succeed or fail at the same time,  is there any partial fail situation?

Sravan 💠: Not that I know of,it shouldn't matter it's just a cosmetic thing anyway (reply to 114650)

Good: If anyone can fix this issue, please ping me, thank you.

&rey: builder is type name, it can't be used for variables. (reply to 114773)

&rey: In one transaction, with same query ID? Either all get sent or none do. (reply to 114754)

peilipu: yes same query id, thanks (reply to 114777)

live: Does anyone know how the end characters of the address DOGS:EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS are generated?

live: It's amazing. Is it really a collision?

kevin: anyone if there are faster TON node exists? public liteserver seems pretty slow .

kevin: UQBCLGgGaYn7e5GOPFZ5t-Et33X5OXhGHvV0dQn-p2X_DOGS (reply to 114783)

kevin: Yes, it is possible, just finish this (reply to 114750)

kevin: UQAR1ELBseJgaX7bMEqhI4nwrknf0Tl6D88prPJW7ni_DOGS (reply to 114783)

kevin: type Action struct {   _      tlb.Magic  tlb:"#0ec3c86d"   Mode   uint64     tlb:"## 8"   Empty  *cell.Cell tlb:"^"   OutMsg *cell.Cell tlb:"^" }  type V5R1Header struct {   _          tlb.Magic tlb:"#7369676e"   WalletId   uint64    tlb:"## 32"   ExpireAt   uint64    tlb:"## 32"   Seqno      uint64    tlb:"## 32"   ActionPref uint8     tlb:"## 1"   Action     *Action   tlb:"^" }  check this out (reply to 114750)

kevin: https://github.com/ton-blockchain/token-contract/blob/2c13d3ef61ca4288293ad65bf0cfeaed83879b93/ft/jetton-wallet.fc#L32 (reply to 114727)

kevin: might because builder is a reserved keyword, why not choose another as variable name (reply to 114774)

live: only collision？😂 (reply to 114794)

live: Or other function？

kevin: just collision,  5 chars collision  takes about 1mins on my M3 machine, quite resource intensive calculation, I tried to optimize but no result. (reply to 114802)

kevin: DM you the code (reply to 114803)

Behruz▪️: Hello dear ton developers, I wanted to create a smart contract and the smart contract should have such a function, the ton should be removed from my first wallet to another wallet, and the tokens in the wallet should come to me from the wallet that sent the ton, but if I put the ton in that wallet, it will remove the ton to another wallet if if a smart contract is created and a ton is sent and that wallet is banned from sending a ton to another wallet until the smart contract is executed

Behruz▪️: @pcrafter pls help me bro (reply to 114812)

SunG: hi I can help you to develop this smart contract (reply to 114813)

DaYuan: hello,  We are developing a defi app based on ton. We need to run a validator node, but we don’t have enough test tons to run a validator. Can we apply for 100,000 test tons to test the validator node?

Abdul Rehman: I need an help regarding the ton ecosystem, developing an mini bot for my product, and connecting the ton ecosystem with it.

Happy: can u check this issue please ?  https://github.com/toncenter/tonweb/issues/278

Tuan: Hello everyone, I have a question that what's the difference between ~ and . when calling a method in FunC. I have researched the answer and I have got the answer that if the variable is null or invalid value, the dot "." will return a time exception but the tilde "~" will return null and not throw an exception. Is my answer correct?

&rey: It isn't. v~do_something() is same as (v, ()) = do_something(v); (reply to 114855)

Tuan: I'm new to FunC so can you explain more about (v,()) or any keyword for detail? (reply to 114856)

&rey: In short, tilde says "replace the object by its modified version". With dot, nothing is generally mutated. (reply to 114857)

Tuan: Thank u so much (reply to 114858)

Good: Hi, everyone. I am looking for an expert of TON smart contract. If you are interested in it, please dm me.

&rey: In fact, you may not ask for DMs in the chat. Also, asking "where are you from" from the beginning is unprofessional and intrusive. (reply to 114860)

Good: Well, if you can write smart contract for me, please ping me. I will share my Tokenomics and requirements. (reply to 114861)

Abdul: Hello guys, am new here.

Cryptopher: Hello is there any Blockchain developer?

Sainty: @BishopThe1 are you still hiring

Mehdi: Yep (reply to 114879)

jessepinkman: does tonkeeper/opentonapi on github support gasless transactions?

shutock.eth: Hey guys, could you please help me? 🙏  I'm parsing a raw address and converting it into a user-friendly format. However, the last three characters of the parsed address are different from the ones shown in Tonviewer.   I'm using Address from the @ton/core library to do the parsing. How can I ensure the output matches Tonviewer?  Thanks in advance!

Mehrdad: Hi is it possible an submit a jetton transfer without an jetton notify transaction (0x7362d09c)? Right now I'm struggling with this, how to decode transaction data in this situation?

— 2024-10-13 —

D_d: guys how to check if user followed x or instagram page?

D_d: and how do you track like daily "check ins" for users?

Pegu: Is it possible to use @ton/ton tonClient4 to fetch account latest transaction with just address? (Without lt / hash)

Pegu: hmm what do i put for lt / hash? Its required param (reply to 114939)

Pegu: Also, if i were to indicate lt / hash, it means its fetching the history of transaction history before that hash transaction right? Its not fetching the transaction history after that hash transaction  Example tx1: lt 1 tx2: lt 2 tx3: lt 3  if i were to query for lt 2, it will give me transaction history of tx2 and tx3 and not tx1 and tx2 right?

&rey: You can fetch latest txs from TonClient; it has no lt/hash requirement. Alternatively, get account state. (reply to 114937)

&rey: tx2, tx1, and so on towards earlier transactions. (reply to 114941)

Pegu: ahh thank you for the clarification

Nick: Hi there, I sent the usdt transaction via jetton transfer options. I pulled the last transactions of an address, but how can I determine that this one is exactly with usdt but not ton? Or should I pull jetton transactions api method instead? thanks 🙏

Igor 🦴: Can you share a code of how you are sending usdt transaction? Rn, I am trying to figure out how to implement this, mb u can help me) If u don't mind ofc (reply to 114946)

xiaoyu1998: guys , how can i get tons from test net for my dex testing, i am waiting hours from Testgive TON Bot, which didn't send me 2 tons/

xiaoyu1998: thanks, I have gotten 2 tons.

Marat: Can somebody explain me one thing, What will happen if i will try to deploy 2 smart contracts with same initial code and initial state? In theory, they will have identical address

Marat: Address of deployer is stored in smart contract? So it is not possible to deploy 2 identical smart contracts fron one address?

Token: even possible, from one address, not two contract, so when second you deploy, it will just recall contract you first deployed. (reply to 114986)

&rey: No it isn't. Smart contract initial state is whatever you use for StateInit; contract address is deterministically derived from it. (reply to 114986)

Marat: I understood, thank you!

Tom: It’s like CREATE2 from EVM imo

yarik: does anyone know how to programmatically put up an nft for auction on fragment using smart contracts?

Tech🧑‍💻🐾: You need a Dev for this or it's just a query? (reply to 115006)

yarik: just a querey (reply to 115022)

Bitfiles: How can I renew domains?

.: is there a way to transfer money on python backend without transaction confirmation (telegram wallet)

&rey: pytoniq (for backend) supports transfers using private key/mnemonic, without any wallet applications. (reply to 115044)

Grankeyl: Can I add .ton domain to my telegram mini app, if yes how, any info?

Luqman: Which domain, ton domain? (reply to 115041)

Crypto Lion: How can I report a wallet that has infer traded a mini app?

Luqman: Check right up your wallet, select three botton then report them (reply to 115070)

Crypto Lion: So I can do directly from my wallet? (reply to 115071)

Luqman: Which wallet you use? (reply to 115073)

Crypto Lion: TONKeeper

Crypto Lion: I was drained from some of my tokens and 2 NFTs and the thing is that I used a trusted Mini App site… Boinkers

Luqman: Ok, click NFT then in left available botton of report (reply to 115077)

Crypto Lion: Give me a minute… I’m going there now

Luqman: Good (reply to 115079)

Crypto Lion: I don’t see an option (reply to 115080)

Crypto Lion: Can I dm you my address?

Luqman: Check in settings in your wallet select NFT/token then remove them (reply to 115082)

Crypto Lion: I know how to remove bad NFT’s but I want to report 2 nfts that were taken from me. (reply to 115085)

Luqman: Update your wallet, then go in settings click token or NFT report them automatic is removed (reply to 115087)

Crypto Lion: Give me minute… I’ll try it (reply to 115089)

Luqman: Ok (reply to 115090)

Crypto Lion: Still unable to report my NFTs (reply to 115091)

Crypto Lion: It’s all good…. I guess I’m done with all mini apps 😮‍💨

Luqman: Omg (reply to 115093)

Luqman: Check tomorrow,I will teach you (reply to 115093)

Crypto Lion: I just spoke with TONKeeper support and they said there’s really nothing I can do.  I can’t even report a stolen NFT - 🤔 (reply to 115095)

Luqman: You must report them, option is available within you  You able to remove or return (reply to 115097)

Crypto Lion: I hope so… I’m just glad I only had a few dollars.  Not a whole lot.  So it’s ok 👌 The lost was very minimal 😮‍💨 (reply to 115098)

Luqman: Omg (reply to 115099)

Luqman: If is difficult to you create another wallet transfer your assets then, delete or log out old wallet (reply to 115099)

Crypto Lion: Yes!!! I have already created a new wallet.  Thanks for everything 😊👌 (reply to 115101)

— 2024-10-14 —

Tiqan: Hey. Is it possible to check if sender is from the same contract but with different data? So the code is the same but the data in the init is different.

Leo: yes if you know exactly what the code and data is - so you can check the calculated address matches sender address

Derick: Hello everyone, how can I use sandbox to change the block time in unit tests?

Dannel: hi, did  anyone use checkSignature on smart contract? has any example?

Hiếu: Can someone give me some documents about token ton's smart contract?

&rey: Any wallet contract is an example. (reply to 115119)

&rey: Change parameter .now on blockchain. (reply to 115118)

kevin: Guy anyone know how to make my TX accept by chain faster, public liteservers seem relative slow.

frogish: hi i made a swap in my ton wallet and the transaction failed and i lost my funds could someone take a look ?

Luqman: It's impossible, explain how (reply to 115130)

frogish: i made the swap the swap failed. The funds were gone

Luqman: Make sure before transaction, update your app (reply to 115132)

Luqman: If you want faster transaction, transfer your money midnight because reduced users in Blockchain (reply to 115128)

Luqman: You swap mintless points? (reply to 115140)

frogish: i thought it was a token ? (reply to 115141)

frogish: like any other ?

Luqman: Mintless points un able to swap (reply to 115142)

frogish: so what do you do with them ?

Luqman: You receive like rewards or buy some where (reply to 115143)

frogish: can i get them back somehow ?

Luqman: Never reversed, transaction (reply to 115147)

frogish: i didnt know what was wron

Luqman: You must before do it's (reply to 115149)

frogish: ive been looking in explorers since then now and im not getting any smarter

Luqman: You receive like rewards or buy some where (reply to 115151)

frogish: or reverse the transaction if that  is possible

Daniel: has anyone got a AxiosError: Request failed with status code 404   code: 'ERR_BAD_REQUEST', before even though the function exists in the contract? also weirdly this only happens to testnet and works fine locally

Pluto: hello, can someone will tell me how to identify if the wallet is testnet or mainnet?

Daniel: has anyone managed to call a read function that takes a slice as an arg in testnet/mainnet successfully?

Pluto: I don't know, I'm trying to do that, that's why I asked you guys (reply to 115167)

Nick: as far as I know the same address can exist in both testnet and mainnet separately (reply to 115166)

Nick: By the way don't you know guys how to activate the address in mainnet? Currently I have the address in mainnet and 2 TON on it, but it still has uninitialized state. How can I initialize that?  Activated by transferring the first transaction from this wallet to another

&: Can you tell me address? (reply to 115175)

&: Is that address is the contract you've made? (reply to 115175)

Jordi: Anyone knows how to disconnect tonhub wallet from blueprint? I'm trying to use a different one but it's getting automatically sent to the same wallet all the time

Laisky: delete everything under ./temp (reply to 115181)

Jordi: Got it, thanks! (reply to 115182)

Nick: actually not, I just got outer transfer and have this balance but the address is not initialized yet (reply to 115179)

Grankeyl: I go to adhl address, the site is inaccessible, what's wrong?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 58 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 45  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Christopher: Does TON have a blacklist wallet function like ETH has?

&rey: Being uninit is perfectly normal, you can use it already. (reply to 115175)

Nick: yeah, I figured out that to activate it I need to make a first transfer with some contract. Also I used the wrong wallet version. Life of ton dev integrator is challenging haha (reply to 115210)

Bogdan | Referendum: Hi there. Could you please clarify what needs to be included in the GitHub repository for the Hackers League Winter 2024? Should it contain only the TON smart contract code, or does the submission require the entire app code, including front-end and back-end components?

⚡️ Ἑρμῆς (Hermes): Hi guys, I am trying to make a simple jetton transfer to my contract jetton wallet (uninitialized) async function sendJettonTo(         jettonContractSender : SandboxContract<ExampleJettonWallet>,         sender: SandboxContract<TreasuryContract>,          amount: bigint,          receiver: Address         ) {         console.log(`Jetton sender is ${sender}`)         console.log(`Jetton sender wallet is ${jettonContractSender.address}`)         expect((await jettonContractSender.getGetWalletData()).owner == sender.address);                      const receiverWalletAddress = await jettonMaster.getGetWalletAddress(receiver);         console.log(`Receiver wallet addr - ${receiverWalletAddress}`)          const jettonTransfer: JettonTransfer = {             $$type: 'JettonTransfer',             queryId: 42n,             amount,             destination: receiver,             responseDestination: receiver,             customPayload: null,             forwardTonAmount: toNano('1'),             forwardPayload: beginCell().endCell().asSlice(),         };              const transfterResult = await jettonContractSender.send(             sender.getSender(),             {                 value: toNano('1'),             },             jettonTransfer         );          expect(transfterResult.transactions).toHaveTransaction({             from: sender.address,             to: jettonContractSender.address,             success: true, // TokenTransfer         });          expect(transfterResult.transactions).toHaveTransaction({             from: jettonContractSender.address,             to: receiverWalletAddress,             success: true, // TokenTransferInternal         });          expect(transfterResult.transactions).toHaveTransaction({             from: receiverWalletAddress,             to: receiver,             success: true, // TransferNotification         });      }      async function getAddressWallet(addressOf: Address) {         return  await jettonMaster.getGetWalletAddress(addressOf);     }      });  Yet here   expect(transfterResult.transactions).toHaveTransaction({             from: jettonContractSender.address,             to: receiverWalletAddress,             success: true, // TokenTransferInternal         });  I get an error  tx with error -  {         lt: 24000000n,         now: 1728905596,         outMessagesCount: 1,         oldStatus: 'non-existing',         endStatus: 'non-existing',         totalFees: 133331n,         from: EQB4pYdHxm5W_LUTwb95WJa8TRVRHpOJcOEdhstsOd1kNjFL,         to: EQBKYVaEOCtpLl0GYyAdirl2FTY_ZWmvvQLQfcp9l_-c41O5,         on: EQBKYVaEOCtpLl0GYyAdirl2FTY_ZWmvvQLQfcp9l_-c41O5,         value: 991702000n,         body: x{178D4519000000000000002A10180194DDFF9BA93265B574C215ABD4BFD85D208744D2A7628686A3532A89A239C26F002FD9AE056F45A00DF9FEFDAC41AC65106F9D929FD6E03C8F80C666150175DAA750EE6B2802_},         inMessageBounced: false,         inMessageBounceable: true,         op: 395134233,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: true,         destroyed: false,         exitCode: undefined,         actionResultCode: undefined,         success: false       }     > 292 |         expect(transfterResult.transactions).toHaveTransaction({           |                                              ^       293 |             from: jettonContractSender.address,       294 |             to: receiverWalletAddress,       295 |             success: true, // TokenTransferInternal        at sendJettonTo (tests/NAPSingle.spec.ts:292:46)  I believe the error is because of my smart contract jetton wallet is not being initialized(but I have no idea why)

Denys: Hi everyone, if I want to transfer a Jetton token to a new account (who has not yet deployed a wallet contract), will I pay more gas for deploying a new contract than if the user has already deployed a wallet code and I just transferred the tokens to him?

сколько: Active kindly

&rey: Probably no or negligibly so. (reply to 115243)

&rey: You must send transfer order to your jetton wallet, not receiver's. (reply to 115231)

⚡️ Ἑρμῆς (Hermes): By this you mean jettonTransfer msg? I am (sender) already transferring to jettonContractSender, or I didn't get you? (reply to 115272)

&rey: Oh. But if you don't have jettons beforehand, transfer must fail. (reply to 115273)

Sandy: Anyone know how to obtain the token id of NFTs ? I can get the NFT item address and collection address however I'm wondering about token id.

&rey: Probably item address is meant.

⚡️ Ἑρμῆς (Hermes): I am (the sender) already have jetton, but for being more explicit I also added mint to this function async function sendJettonTo(         jettonContractSender : SandboxContract<ExampleJettonWallet>,         sender: SandboxContract<TreasuryContract>,          amount: bigint,          receiver: Address         ) {           // Mint 1 token to Sender          const mintyResult = await jettonMaster.send(             sender.getSender(),             {                 value: toNano('1'),             },             'Mint:1'         );         // Check that Sender send "Mint:1" msg to JettonMaster         expect(mintyResult.transactions).toHaveTransaction({             from: sender.address,             to: jettonMaster.address,             success: true,         });         ...remaining code is the same  The issue still there -   expect(transfterResult.transactions).toHaveTransaction({           |                                              ^       282 |             from: jettonContractSender.address,       283 |             to: receiverWalletAddress,       284 |             success: true,  with same message - {         lt: 25000000n,         now: 1728913987,         outMessagesCount: 1,         oldStatus: 'non-existing',         endStatus: 'non-existing',         totalFees: 133331n,         from: EQB4pYdHxm5W_LUTwb95WJa8TRVRHpOJcOEdhstsOd1kNjFL,         to: EQBGtzWULWv0m1WLsGcQ31Ho_Np8i1D3WFZhbnBvRMuQhaWX,         on: EQBGtzWULWv0m1WLsGcQ31Ho_Np8i1D3WFZhbnBvRMuQhaWX,         value: 99991698800n,         body: x{178D4519000000000000000010180194DDFF9BA93265B574C215ABD4BFD85D208744D2A7628686A3532A89A239C26F002DF17D1B4D26A55BF1784EE30A1D21836E5B9DDD9158EA21C2C8FF4320F1D9959409502F9002_},         inMessageBounced: false,         inMessageBounceable: true,         op: 395134233,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: true,         destroyed: false,         exitCode: undefined,         actionResultCode: undefined,         success: false       } (reply to 115275)

Eibrahim: Have you found a solution to this ? (reply to 114926)

&rey: Well, something in your code seems to serialize jetton transfers incorrectly, so you'd better check for bounced transactions on mint. (reply to 115278)

Alexe: Hey guys, I'm trying to deploy a child contract with FunC, but I'm getting this strange error   [ 1][t 0][2024-10-14 13:50:57.741000][Fift.cpp:67]      top: <continuation 0xc6c848> level 1: <continuation 0xc864e0> level 2: <text interpreter continuation>  Error: main.fif:2821:   x{:Invalid hex bitstring constant   ELIFECYCLE  Command failed with exit code 1.    This is my code, the issue is from the long hex string most probably, but I don't know how to solve it. Do you know of any workaround to get the bytecode of the child contract?   () deploy_child_contract() impure {     ;; Build the initial message to deploy the child contract     var init_code = begin_cell()         .store_slice("<very long hex string>")         .end_cell();      var init_data = begin_cell().store_slice(my_address()).store_uint(0, 32).end_cell();     (var cntr, var state_init) = contracts::from_sources(init_data, init_code).state_init();      (_, var contract_addr) = cntr.address(address::get_workchain(my_address()));     var body = begin_cell().end_cell();  ;; empty body      msgs::send_with_stateinit(1, contract_addr, state_init, body, QCARRY_ALL_BALANCE); }

Selcuk: Hey everyone,  We're working on a React-based e-commerce app inside Telegram and integrating a Unity game.  We ran into Telegram's policy that says: "You will not implement any ads or any external links on your custom URL pages [1]."  We're a bit confused about what counts as an "external link" in this context.  What exactly qualifies as an external link? Is it okay to link to other domains we own within our web app? Do we need to keep everything under a single domain, or can we use multiple domains that are all ours?  Has anyone dealt with this before or have any insights?  Thx!

D_d: Not yet, probably will do my own backend for it (reply to 115280)

&rey: You don't get to write init code as string. Rather, you must create a function cell push_init_code() asm   "B{B5EE9C...}"   "B>boc PUSHREF"; (reply to 115283)

Eibrahim: Yeah I think that's the case  It depends on your backend structure  You can't easily detect if a user follow an account or not the best approach is to set a timer and assuming they would have followed the page before the time elapse (reply to 115288)

George: tell me how to get the transaction hash. I make a transaction using the tongo library (I transfer ton V5 wallet)  I get the hash by calling extMsgCell.HashString() , but it does not match the hash of my transaction in the scanner

Eibrahim: Use data from your backend for example if you are tracking the time user was active  You can create a function to check if they have logged in a day (reply to 114926)

&rey: Indeed, because that's hash of sent external message; how'd it match? How would your lib get transaction hash? (reply to 115296)

D_d: timer not reliable, but generate codes are easier (reply to 115295)

Eibrahim: Ohh that's great (reply to 115299)

PtcBink: https://docs.ton.org/develop/smart-contracts This would help you. (reply to 115122)

Abdulaziz: How does points token disappeared from my wallet

Abdulaziz: It means tokens which i buу from p2p also can disappear. Somebody explain. (reply to 115307)

&rey: Probably because you neglected to claim them, and the offer was limited in time. (reply to 115307)

Abdulaziz: Im tаlking аbout this (reply to 115311)

&rey: No common jettons do so. Less known ones (and scam, of course) can disappear or change in any way, on the other hand. (None are able to pull TON or other assets from the wallet, though, by design of TON.) (reply to 115309)

Abdulaziz: https://t.me/toncoin/1554 (reply to 115314)

Abdulaziz: I had this one thing (reply to 115311)

&rey: It is only meant for tests; not common, thus. (In fact, you shouldn't have relied on any of its behavior being correct; it was almost a coincidence that everything worked smoothly.) (reply to 115315)

Abdulaziz: Yes i got one of this but it disappeared (reply to 115317)

&rey: is that a transaction? If so, does it have hash or something like that? (reply to 115311)

Abdulaziz: It's just screenshot of token. I mean i had one of this token. But it disappeared from my wallet (reply to 115319)

Abdulaziz: tonviewer doesn't not show how that happened

&rey: Then it means that you neglected to claim them, as the offer was limited in time. (reply to 115321)

Abdulaziz: I already had this token on my address. why i should claim what i have (reply to 115322)

Abdulaziz: And mаx supp was 18,000,000

Abdulaziz: It became 21k

Abdulaziz: How did they stole token from my wallet

&rey: I don't understand why you expect anything particular of this token,  but that was probably an unfortunate representation by Tonviewer. You had no blockchain-confirmed record of having tokens; Tonviewer showed how much you could claim; now you can't claim any.

Abdulaziz: It cost 25$ (reply to 115328)

Abdulaziz: That's whу, i had this token but it disappeared

&rey: Demand from users now forces developers into inconvenient situation, as they intended to remove any liquidity for trading but now can't. (I predict any further discussion about Mintless Points will either reiterate what I said or be off topic.) (reply to 115329)

Abdulaziz: I mean how does it disappeared (reply to 115332)

Abdulaziz: Due to the nature of the blockchain, no one can steal a token without having the private key.

Abdulaziz: This is somehow unclear

&rey: Learn to read please: > you neglected to claim them, as the offer was limited in time. > You had no blockchain-confirmed record of having tokens; Tonviewer showed how much you could claim; now you can't claim any. (reply to 115334)

Abdulaziz: But Tonviewer said that I already have this token, and it was in the "tokens" section. (reply to 115337)

&rey: You should ask @subden for a clearer representation that some tokens are not claimed yet and may expire. (reply to 115338)

Denis: https://github.com/ton-blockchain/TEPs/pull/177/files#diff-b3f5c315ca9f9b58a65aec5653d8a3957cf3ab99fd4193a3df7e2c619ea23b46R57 (reply to 115339)

Abdulaziz: In short, in order for me to keep the token, I should make at least one transaction with it?

Abdulaziz: In general, out of 18 million, only 21k or less people figured this out. (reply to 115342)

Denis: It was a test token

Abdulaziz: Now people wanna buy it for more than 25$ for each one (reply to 115344)

TON Bounty Bridge: ​TLB syntax support for neovim  🏷 Developer Tool  Summary:There is TLB syntax support in func plugin for intelleji IDEs, but not for neovim, zed etc. The goal...  Created by nickshatilo

Abdulaziz: What will happen if i do transaction to myself? Send any token or TON to myown address which im sending from?

Denis: nothing.

Abdulaziz: The transaction will successfull? (reply to 115348)

Token: if you follow the dedust sdk from create pair to add liquidity, everything will be clear. (reply to 115350)

Token: dedust on testnet is similar to mainnet, a little different anyway you can test on that (reply to 115350)

Tom: I find the mintless standard with Merkle tree / Merkle proof is nice but having wallet showing balance is not necessary. It causes all sorts of confusion. (reply to 115332)

Valentin: Hi. Do you know if there exists an api / rpc call I can make to get the source code of a smart contract?

User<7133336342>: hello

Luis: Hello anyone here using the sdks for golang. Do you know how to check the status of a txn using tongo or ton-utils-go?

Token: Hi, guys, on Ton, like solana, we sign the transaction with wallet and on backend, can confirm that?

&rey: On TON, some smart contracts (called "wallets" for obvious reasons) accept signed messages and execute transfer orders embedded in them.  Those transfer orders can be signed either by wallet apps (which then immediately send the message into blockchain) or libraries. (reply to 115372)

Mehrdad: In fact, there is no way to check the status of a transaction unless you define a specific method for doing so. For example, you could check the receiving account for incoming transactions related to your transaction, or you could monitor the blockchain to see how many blocks have been mined since your transaction was included.

Token: thanks for reply, so I mean, not blockchain, out of the chain, with kind of proof, we can confirm that transaction, because we want when users confirm the transaction, not from wallet to chain directly, confirm that transaction on backend based on user's sign (reply to 115376)

&rey: Wallet apps don't support signing something but not sharing it to blockchain. (reply to 115378)

Token: so for example, users can transfer Ton with their wallet, but if they use our platform for that, then we gonna give kind of bonus,  But don't want to use api for detect that, users just sign and on our service backend, want to verify that and do extra work for users, so you mean, is it impossible? (reply to 115379)

Token: hum... then is there any solution? really interested in Ton but actually compare to solana or EVM, important things are missing... ^_^ (reply to 115380)

&: So you want to control user's wallet in your backend? (reply to 115381)

Token: nah, nonono, just confirm the transaction. lol (reply to 115382)

&: I can't understand what you exactly wanna do at here. So if user transfer TON to others via your platform. user can get bonus? (reply to 115380)

Token: kind of yes, ofc it's business, anyway as Mehrdad Amini said(thanks for reply ^_^) we can't use api for detect transactions for all users, so when they use our platform to send transaction, via our backend, add more service (reply to 115384)

&: "use our platform to send transaction" is not clear. You mean all the transactions? (reply to 115385)

Token: uhm... so kind of deposit ton to some pools. :) (reply to 115386)

Token: so any solution, guys???

Token: I think many devs will face this problem,

Luis: How can I do so? Is there any code example? (reply to 115377)

Mehrdad: personaly, I use tonapi.io api events field  status to be "ok".  look these links: https://testnet.tonapi.io/v2/events/d6a8b9c3914ea503e3dbcb8cff3f0a033c9b41cd73b3f7b8e63de12395acce0e  and : https://testnet.tonapi.io/v2/events/f0cb236eeb00048089126262aa06c1ac9b0c933c91aa4e84aee5fd988850cbb6   but for advanced checking you can use another scenarios, like: https://toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get  ....

Token: nah, even you are true, so we have to run API in real time for users? really insufficient (reply to 115399)

Token: what is it for?

Madre: Hi everyone, what is the best way to make sure that a jetton transaction has gone through and been confirmed? I am currently querying all transactions of the jetton wallet from which the transaction was sent and looking for inMsg with opcode 0x0f8a7ea5 (Jetton Transfer in TVM), parsing and identifying the transaction by its queryId. Is this the optimal way, or is there an easier way? It would also be nice to skip all transactions that were made earlier than the expected time, but it seems that for this you need to get the current block logical time from TON at the time of issuing the address, which seems a bit time-consuming

&: Did you tried to use .then(a => .....)? (reply to 115402)

&rey: You can forward user funds via your contract. It can even distribute rewards onchain, where applicable. (reply to 115381)

&: To do that. you have to make a special contract to support user's particular & limited actions. User can send tx to your contract, and contract will help user to do that action. You can input benefits for user at here.  To track all the transactions from all the users is IMPOSSIBLE I think. (reply to 115401)

Token: so let me explain a little more, on solana, users just sign the transaction  with wallet then return kind of  code, and send code to backend so on backend just verify the code and do something more, so on Ton, it's similar to tonproof? (reply to 115405)

&rey: tonproof can be used, but once per wallet connection (you can leverage this to create a bonus scheme but this is harder). I think absence of data signing option is intentional. (reply to 115407)

Madre: Transactions are sent from the frontend, and I want to get confirmation on the backend. All I can get from the frontend is the hash of the inMsg body, while the transaction ID itself remains unknown to me. (reply to 115404)

&rey: Something must wait until message is actually recorded. That will either be frontend or backend, or both for some optimization. (reply to 115411)

Madre: So, in other respects, this is a correct approach, excluding the nuance with logical time? (reply to 115413)

&rey: To acknowledge that jettons have been transferred and can now be used, you should listen to something (message unspecified by standard, but known for any specific jetton) at receiver's jetton wallet. (reply to 115414)

Madre: Okay, thank you so much for your answers

SunG: How to get address from parsed cell data in ts?

Luis: Is there anyway to do it decentralized just by interacting with the rpc node? (reply to 115399)

PuzzledOldman: how to enable testnet in tonkeeper - i tried 6 times on icon above version - no testnet switcher there in app from G Play; i tried downloading apk from tonkeeper site - it says App not installed at the end of install process - how to enable the testnet?

&rey: Enter dev menu. Close dev menu. Add new wallet on the top of main screen. (reply to 115438)

PuzzledOldman: Thank you. It worked. (reply to 115439)

— 2024-10-15 —

PuzzledOldman: Is there a Dart function to convert hex address to user-friendly forms? If not, I gonna write a MIT licensed library  Update: tonutils lib has InternalAddress.parse and toString

PuzzledOldman: I am building a dapp in Flutter. Currently closed source, might change my mind later. (reply to 99547)

PuzzledOldman: I have limited success. there is a darttonconnect and tonutils libs, and chat search on dart reveals more libs. (reply to 113055)

Chi: how to authorize other address to spent jetton token on TON，like erc20 token approve？

Abdulaziz: https://t.me/durov/357  Yo what will happen if someone ddos my api with random numbers, i lost 0.01* 9999 = 99.99$ im not rich as hell

Abdulaziz: It's same if i make my own bot for verification and the user just will share his number contact (reply to 115460)

Joe: Hi, I would like to ask a question, thanks! If the validator node is offline, how long will it take for it to be slashed, or if the efficiency is lower than a certain level, it will be slashed. I didn’t see it in the document.

Martin: GM guys, I'm wondering if there are any DEXs that allow us to flashloan?

Laisky: I am quite skeptical about the possibility of implementing flash loans in the Actor model's ledger. (reply to 115464)

Chi: I doubt that, even the basic Jetton transfer takes multiple transactions, which renders flash loan impossible (reply to 115464)

Bingo: hmm...

Martin: Yeah, that's what I'm thinking right now

Martin: I am trying to implement the liquidation function for a lending project like Aave on EVM, which uses the flashloan. Do you guys have any idea to implement this one?

Laisky: I once discussed this issue with the people from the Arweave AO project (AO is also an Actor model). In the end, we came up with a very complex implementation scheme, but it has never been actually implemented, so I'm not sure if it can truly be used. (reply to 115472)

Martin: We are discussing about building a smart contract that holds assets, then we can take the asset out to liquidate user's positions. But this one may be high-cost and risky.  What do you think of it? (reply to 115474)

Martin: Could you please share more about your idea? It's grateful to hear (reply to 115474)

Laisky: In fact, the result of our discussion at the time was quite similar; we needed a centralized contract to hold all the tokens involved in the transactions. (reply to 115475)

Sword: Help How can I invoke get method of ton smart contract with index parameter?

Martin: Thank you so much. I will discuss it with my team. (reply to 115477)

Martin: I will 🫡 (reply to 115480)

Jaskirat: Hey guys, I am facing this error which implementing Ton center using the Tonweb JS SDK :  Error getting accounts: TypeError: Cannot read properties of undefined (reading 'digest')     at sha256 (webpack-internal:///(rsc)/./node_modules/tonweb/src/utils/Utils.js:18:32)     at Cell.hash (webpack-internal:///(rsc)/./node_modules/tonweb/src/boc/Cell.js:130:37)     at async Cell.getRepr (webpack-internal:///(rsc)/./node_modules/tonweb/src/boc/Cell.js:118:28)     at async Cell.hash (webpack-internal:///(rsc)/./node_modules/tonweb/src/boc/Cell.js:130:44)     at async WalletV3ContractR2.createStateInit (webpack-internal:///(rsc)/./node_modules/tonweb/src/contract/index.js:43:31)     at async WalletV3ContractR2.getAddress (webpack-internal:///(rsc)/./node_modules/tonweb/src/contract/index.js:18:29)     at async Web3Ton.getAccounts (webpack-internal:///(rsc)/./src/lib/ton-service.ts:29:36)     at async Web3Ton.getBalance (webpack-internal:///(rsc)/./src/lib/ton-service.ts:47:29) Error getting accounts: TypeError: Cannot read properties of undefined (reading 'digest')     at sha256 (webpack-internal:///(rsc)/./node_modules/tonweb/src/utils/Utils.js:18:32)     at Cell.hash (webpack-internal:///(rsc)/./node_modules/tonweb/src/boc/Cell.js:130:37)     at async Cell.getRepr (webpack-internal:///(rsc)/./node_modules/tonweb/src/boc/Cell.js:118:28)     at async Cell.hash (webpack-internal:///(rsc)/./node_modules/tonweb/src/boc/Cell.js:130:44)     at async WalletV3ContractR2.createStateInit (webpack-internal:///(rsc)/./node_modules/tonweb/src/contract/index.js:43:31)     at async WalletV3ContractR2.getAddress (webpack-internal:///(rsc)/./node_modules/tonweb/src/contract/index.js:18:29)     at async Web3Ton.getAccounts (webpack-internal:///(rsc)/./src/lib/ton-service.ts:29:36) Error getting balance: Incorrect address

Jaskirat: This is my code :  import TonWeb from "tonweb";  class Web3Ton{   privateKeys: string | null = null;   keyPairs: {     pub: Buffer;     pri: Buffer;   } | null = null;   tonweb: TonWeb;    constructor() {     this.tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));   }    async getAccounts(): Promise<string> {     try {       console.log("Fetching TON Wallet Address...");        const privateKey = "vt58J2v6FaBuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY=";       console.log("Private Key:", privateKey);        if (!privateKey) {         throw new Error("Failed to retrieve private key");       }        const keyPair = this.getKeyPairFromPrivateKey(privateKey);       console.log("Key Pair:", keyPair);        const WalletClass = this.tonweb.wallet.all["v3R2"];       const wallet = new WalletClass(this.tonweb.provider, {         publicKey: keyPair.publicKey,         wc: 0       });        const walletAddress = (await wallet.getAddress()).toString(true, true, true);       console.log("Wallet Address:", walletAddress);        return walletAddress;     } catch (error) {       console.error("Error getting accounts:", error);       return "";     }   }    public getKeyPairFromPrivateKey(privateKey: string): {     publicKey: Uint8Array;     secretKey: Uint8Array;   } {     const privateKeyBytes = TonWeb.utils.base64ToBytes(privateKey)      if (privateKeyBytes.length !== 32) {       const bytes = privateKeyBytes.slice(0, 32)       return TonWeb.utils.nacl.sign.keyPair.fromSeed(bytes);     }      return TonWeb.utils.nacl.sign.keyPair.fromSeed(privateKeyBytes);   }    async getBalance(): Promise<string> {     try {       const address = await this.getAccounts();       const balance = await this.tonweb.getBalance(address);       return TonWeb.utils.fromNano(balance);     } catch (error) {       console.error("Error getting balance:", error);       return "0";     }   } }  export { Web3Ton };

Jaskirat: The error occurs when I try to print the wallet address

Jaskirat: Does anyone has any clue?

Gem: I am looking for a smart contract developer of ton chain

Dino: i am a blockchain engineer, looking for new/challenging jobs.

Dino: dm (reply to 115492)

TKAINU: Hello, i using RPC of  import { getHttpEndpoint } from "@orbs-network/ton-access"; but request limit, Are there any services that can be subscribed to individual or premium plans?

&rey: Wdym request limit? How many are you doing per second? (reply to 115499)

live: hi，everyone, Does anyone know how the gasless feature is done in w5 wallet?

TKAINU: I got an error,Error: Request failed with status code 429 and request volume is about 1 request / 5 minutes (reply to 115500)

musashi: try toncenter paid api service mate (reply to 115508)

Pushkar: usdt tx fails when done through ton mobile wallet, but is success when transferred from browser

Token: tonkeeper.com/en/article/how-tonkeeper-brings-gasless (reply to 115506)

Kyle: Hi guys! Is it any ways to transfer jetton from a wallet to other wallet/contract in smart contract like transfer_from in solidity?

final: send_raw_message (reply to 115516)

Tom: If you're talking about the "approval" then no. It doesnt work like that (reply to 115516)

Kyle: Can someone give me an example?

Tom: Instead of user calling a contract and have it spend our approved tokens.  We send our tokens to the contract with instructions of what to do with them

Happy: Hi, how can i send all balance of a wallet to another wallet?  I mean, I have done the code but it sometimes does not work, can someone check it?  async function sendTon(publicKeyHex, secretKeyHex, destinationAddressBase64, amountTon, senderAddress) {     try {         const publicKey = TonWeb.utils.hexToBytes(publicKeyHex);         const secretKey = TonWeb.utils.hexToBytes(secretKeyHex)          const wallet = tonweb.wallet.create({ publicKey });          const seqno = (await wallet.methods.seqno().call()) || 0          console.log('Seqno before transfer:', seqno);          const amountNanoton = TonWeb.utils.toNano(amountTon.toString())          const destinationAddress = new TonWeb.utils.Address(destinationAddressBase64);          const transfer = wallet.methods.transfer({             secretKey: secretKey,             toAddress: destinationAddress,             amount: amountNanoton,             seqno: seqno,             sendMode: 3         });          function roundUpTo9Decimals(number) {             return Math.ceil(number * 1e9) / 1e9         }          const transferFee = await transfer.estimateFee()         const fee = (transferFee.source_fees.in_fwd_fee + transferFee.source_fees.storage_fee + transferFee.source_fees.gas_fee + transferFee.source_fees.fwd_fee) / 1000000000         const roundedFee = roundUpTo9Decimals(fee)         const balance = await getWalletBalance(senderAddress)          console.log('balance', balance)         console.log('transfer fee', roundedFee)          const walletState = await checkWalletDeployment(senderAddress)          let deployFeeAmount = 0         if (walletState === 'uninitialized') {             const deploy = await wallet.deploy(secretKey)             const deployFeeDetails = await deploy.estimateFee()             const deployFee = (deployFeeDetails.source_fees.in_fwd_fee + deployFeeDetails.source_fees.storage_fee + deployFeeDetails.source_fees.gas_fee + deployFeeDetails.source_fees.fwd_fee) / 1000000000             const roundedDeployFee = roundUpTo9Decimals(deployFee)             deployFeeAmount = roundedDeployFee             console.log('deploy fee', roundedDeployFee)                  if (balance - (roundedFee + roundedDeployFee + 0.001) < 0) {                 throw new Error('balance does not cover transfer & deploy fees!')             }              try {                 await deploy.send()                 console.log("Wallet deployed successfully!")             } catch (error) {                 console.error("Error during wallet deployment:", error)                 return             }         } else if (walletState === 'active') {             if (balance - (roundedFee + 0.001) < 0) {                 throw new Error('balance does not cover transfer fees!')             }         }          const amountToSend = roundUpTo9Decimals(amountTon - (roundedFee + deployFeeAmount + 0.001))         const amountNanoton2 = TonWeb.utils.toNano(amountToSend.toString())          const transfer2 = wallet.methods.transfer({             secretKey: secretKey,             toAddress: destinationAddress,             amount: amountNanoton2,             seqno: seqno,             sendMode: 3         })          const transferSended = await transfer2.send()         console.log(transferSended)         console.log(`Successfully sent ${amountToSend} TON to ${destinationAddress}`)              } catch (error) {         console.error('Error during transfer:', error)     } }  for example i had wallet with 0.01 balance and i sent 0.01 ton from it to another wallet, transfer done but the wallet didnt receive anything and the sender wallet now has 0.008132799 ton in it (u can check here UQDrkfXw9rTLizaqXIPugXaF7boIykTAl4rYrVtL5TpM3awA)

&rey: value: 0, sendMode: 128 with no special fee calculation (reply to 115524)

&rey: No. Contract may only transfer its own jettons. (reply to 115516)

⚡️ Ἑρμῆς (Hermes): So after 3 days of suffering I found an error, I was trying to call this function fun calculateJettonWalletAddress(ownerAddress: Address, jettonMasterAddress: Address): Address {     // let initData = JettonWalletData{ownerAddress, jettonMasterAddress};     // return contractAddress(StateInit{code: jettonWalletCode, data: initData.toCell()});     return contractAddress(initOf ExampleJettonWallet(ownerAddress, jettonMasterAddress)); }   which was NEXT to my contract,not inside it, and that is the reason I got exitCode 135, moving to single line call  -  it worked (reply to 114666)

NPA120: Have you ever heard about Evaafi protocol? (reply to 115479)

Martin: Yes, I had a look at them already. Seems like they implement their own liquidation mechanism (reply to 115531)

NPA120: Do you want your own mechanism? (reply to 115532)

TKAINU: Hello, i using tonweb but err:

Martin: At first I would like to implement liquidation using flashloan, but it maynot be avaiable in TON. Still researching on how to do it (reply to 115533)

Ye: hello everyone! how do I send an internal message via tonapi center V3/V2? I only see the external there

Happy: Good job!✨ what does value: 0 do? (reply to 115525)

&rey: Attaches no TON other that sendMode dictates. (reply to 115542)

Nahm: Hello. Is there a way to get testnet TON in bulk for dApp development ?

Nahm: The faucet gives out TON too stingily, making development really inconvenient.

&rey: dApp development mainly uses @ton/sandbox, doesn't it?

ae: how did you distribute it ? (reply to 114634)

&rey: Users commonly use TON; other ways (paying with jetton itself) are centralized, depending on good will of certain services. You could've sent some TON to users along with your jetton. (reply to 114634)

Success: Hi

Akachi: Interested. (reply to 115492)

Abdulaziz: Is that a phishing transaction?

Armen: there is no doubt! (reply to 115559)

rahul: hello i have faced how we can get the transaction with send amount or received amount getting within the app so please give me any example or functionality

xiaoyu1998: I get this error

xiaoyu1998: AxiosError: maxContentLength size of -1 exceeded

xiaoyu1998: npx blueprint run deployJettonMinter --testnet --tonconnect sometime i got this error AxiosError: maxContentLength size of -1 exceeded

xiaoyu1998: and blueprint run other scripts as well

xiaoyu1998: seems timeout to get data from ton.access.orbs.network

xiaoyu1998: Another problem, I have two func projects, how can i debug with sandbox?

Valentin: Hi community, I'm trying to get a human readeable code programatically from a smart contract     async getContractCode(address: string) {     // Initialize TON Client     const endpoint = await getHttpEndpoint({ network: 'mainnet' });     const client = new TonClient({ endpoint });      try {       // Parse the address       const parsedAddress = Address.parse(address);        // Get account state       const accountState = await client.getContractState(parsedAddress);        if (accountState.code) {         return accountState.code;       } else {         console.log("Contract has no code or account doesn't exist");         return null;       }     } catch (error) {       console.error('Error fetching contract code:', error);       return null;     }   }   This however returns a buffer array, so I'd need to compile it to the actual human readeable format.  Any ideas?

xiaoyu1998: i got this Error: exception in fetch(https://ton.access.orbs.network/mngr/nodes?npm_version=2.3.3): TypeError: fetch failed when i run blueprint

Sabath: How to solve this error please:  f'get method {method} for address {self._process_address(address)} exit code is {response["result"]["exit_code"]}') TonTools.Providers.TonCenterClient.GetMethodError: get method seqno for address EQDnesvdfMEPMyYq06UzMpGG9TGhhbSvLnEn8xLtpmcT8FK9 exit code is -13

xiaoyu1998: i got this error "Can't get https://raw.githubusercontent.com/ton-org/blueprint/main/tonconnect/manifest.json" after tonkeeper scan a QRcode

xiaoyu1998: it seems blueprint need to connect github to download configuration，is there any settings  for this manifest in local? don't connect github every CMD line execution.

&rey: Tonkeeper (on device you use for wallet app) loads manifest, not Blueprint. (reply to 115608)

xiaoyu1998: thanks

Menen: hello team! so im experiencing a problem with the TON wallet, since the system allow me to connect me from the browser but when I go to the mobile, the system redirect me to the wallet, and then back to the system, but the conection is declined, works on Telegram but not on the rest of the wallets as Tonkeeper and so, does any of you have the same problem?

Joe: Hi. Does anyone know how to convert shard from block explorer like "b800000000000000" to int64 for block lookup?

Yeed: Hi

Yeed: Hi everyone, I have transferred jetton successfully (hash: d3f6c28d6e77853a91a5039a43a2a2979b0797c61690a53977cfe87abfa012c3). However in tonviewer, the status is failed  but tonscan, the status is successful how to resolve it?

Valentin: how do I get the code of a verified contract using code?

Hans: any js library or regex for validating a given string is a valid TON address?

&rey: Use Address.parse from @ton/core or similar functions in other SDKs. (reply to 115648)

Ding: hi everyone, Im trying to clone the demo repo of Flappy bird from TON document But Im so struggle with the .env setup, please help me with any ideas to solve this. TY alots.

xiaoyu1998: how can I pack 2 jetton transfers in one message ?

— 2024-10-16 —

Tom: You could write a distributor contract (reply to 115722)

Tuan: Does anyone know how to convert Raw address into User-friendly address in this example in the TON Document? They show no explanation?

Tuan: This is the link: https://docs.ton.org/learn/overviews/addresses#raw-and-user-friendly-addresses

Martin: const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79 const address = Address.parse(raw); Just parse it to get friendly address (reply to 115737)

Muadib: Where can i get test_ton rather than the bot

rahul: I have getting some issues i dont get the transaction value how much i send and receive in the TMA app

Tuan: And is it good for me to know the mechanism of this convert? Thank u so much (reply to 115739)

&rey: It is described at https://docs.ton.org/learn/overviews/addresses#user-friendly-address. (reply to 115742)

sangmin: Please tell me how to multi send using @ton/ton library and contact v4

Mehrdad: did you checked github for some samples? (reply to 115744)

sangmin: Yes, I checked the sample, but it is only for the highload wallet (reply to 115745)

Pushkar: can some one provide me list of names of available stablecoins on ton , apart from usdt, which are also available  on testnet for testting purpose

Ding: hi guys, is there any documents for setup .env of TON?

sangmin: https://ton-community.github.io/ton/index.html  I looked here and copied it, but I got an error. What's the reason? {     "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : failed to parse external message: external message must begin with ext_in_msg_info$10" }

ChainHacker: /report (reply to 115752)

sangmin: I'm trying to make a highloadwallet v3 using tonweb library but I can't find it in import. Is there a solution?

Zqy: Why are these instructions in the document grayed out, but their functionality works normally?

Zqy: 🥹

Victor: Hello everyone, I have a question, I have an idea for developing the following project: a data management system based on the TON modular system, a more advanced service that will provide users with the ability to securely store large, dense files, as well as the ability for users to create their own data, roughly speaking, a decentralized storage. The question is: does it make sense to develop a similar project on TON, when there is TON Storage and interfaces for it, because the technology on which my project is based differs from the technologies on which TON Storage is based (for example, TON Storage for storing files in p2p network uses Torrent 3.0, and I use the IPFS protocol suite)? And how much do you use TON Storage as a file storage?

User<7328481886>: Your project makes sense on TON despite the existence of TON Storage. The key differentiator is that your system uses the IPFS protocol instead of Torrent 3.0, offering benefits like content addressing and file versioning. This could appeal to users looking for advanced data management features. While TON Storage is available, its adoption may not be widespread, leaving room for your project to attract users seeking a more secure and flexible decentralized storage solution. (reply to 115769)

Victor: Thank you for your answer, I will be glad to hear other opinions on this project)

Nikita: Hi! When trying to send a transaction through the mini app (tonconnect), I get this error in all wallets except the Telegram Wallet. Has anyone encountered this? Error message is "Invalid param 'from'" in TonKeeper

Daniel: Has anyone worked with the getgems API? Can they block us if we use their endpoints? I can't send you the link, combot will be offended. You need to type api getgems io, there GraphQL API. In fact, getgems will benefit from using their API, they will get more commissions, but never mind...

Daniel: @alefman @AntonTrunov can u can you unblock my teammate, he posted a link to the doc here and a bot blocked him @poderzhimoimakintosh

Martin: GM guys, a silly question. Is there any way to get the number of bits and cells of a smart contract's storage? Currently I can only get from the blockchain logs of transaction

xiaoyu1998: could you help give a jetton transfer sample code in ts, i have gotten error below

xiaoyu1998: https://testnet.tonviewer.com/transaction/eed4cc64383ff0f9146b9f45caa1c13939593357d496f23cc35f19b11965d8fe

Martin_devTeam: Hi, who can I contact regarding changing the logo for one of the contracts on TON?

Oleksandr: Hello, have you ever met var msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(addr)     .store_coins(grams).store_uint(1, 107) instead of var msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(addr)     .store_coins(grams).store_uint(0, 107) . What does that mean?

co: How to check the success or failure of a transaction？

Alexander: Dear all, I know about testnet TON giver bot, but is there a way to get more testnet TON coins for stress testing, i.e directly from TON Foundation?

&rey: How do you define success for transactions tree? (reply to 115801)

&rey: It means that msg body is in reference. Expand definitions from block.tlb to get more shorthands. (reply to 115793)

xiaoyu1998: I have addressed this error，the grams are not enough to pay gas. (reply to 115788)

Dan: what chain(s) is your protocol on currently? I'm also coming from the EVM mindset and trying to grasp the amount of context switching required to build here (reply to 115805)

Ananya: We are looking for teammate for TON hackathon project. Let me know if you’re interested. (reply to 115827)

Аro: I'm looking at the documentation. There I see the code - .store_uint(123, 16). This function will add the number 123 with a length of 16 bits. But how? 123 is a maximum of 7 bits, where does 16 come from?

⁭устрица молекулы: 0000001 (reply to 115856)

Аro: 7 bit, but in code in ton doc 16, why😶 (reply to 115857)

⁭устрица молекулы: Your cell has 16 bits reserved for any data, digits less than 16 bits will simply be padded with zeros (reply to 115858)

Аro: So these are the "rules" of the ton, right? It makes me nervous that the documentation doesn't spell this sort of thing out (reply to 115859)

Аro: And especially their cookbook, which has useless "useful references" to assembly primitives. As if that makes it clearer..

&rey: That rule is of any computer science. (reply to 115860)

Аro: Why? There are certain rules. If I set 123 under 7 bits, that would be correct, wouldn't it? Why are more 0's being added? (reply to 115867)

&rey: From TVM rules: 1. Cell is but a bit sequence + refs sequence. 2. Integers are represented by i257 and shrinked (with bounds checking) as requested by builder-store primitives.

Naveen: Hi Team, After swap trying to transfer to another wallet getting error as Exit Code 47 , unable to find this in documentation of TON  any one faced similar issue,  USDT transfer works but other Jetton tokens its given either 47/48 error code.

&rey: Your computer wouldn't represent 123 with seven bits either. It would use data type indicated in the program, which is often 32-bit signed integer. (reply to 115870)

Аro: Here) because there is an established rule. Just don't understand why the documentation doesn't say that. Only ask in chat. Also sir, could you please explain how store_uint works? (reply to 115874)

&rey: store_uint(builder place, i257 value, i257 len) -> (builder, ()):  Take last len bits of value, checking that all bits to the left are zero (i.e. that value is in range [0; 2^len)). Check that builder has space for len more bits. Write taken bits and return new builder. (reply to 115875)

Аro: 🤔🤔🤔🤔🤔🤔🤔 (reply to 115879)

&rey: It's not rule special for FunC, and you should set the Schelling fence somewhere. Otherwise you'd need to write that commands in program are executed in order, and so on. (reply to 115875)

?: Okay, how about a little more simple? I don't understand why this function is needed. So it reads for example 32 bits, then discards the read and outputs without 32 bits of initial bits? (reply to 115879)

&rey: Please check out tutorials for interacting with microcontrollers. Smart contracts are similar to them, except they take use of built-in TON transaction atomicity, and have balance. (reply to 115885)

?: 😭😭thx.. (reply to 115886)

?: But can you explain it easier? I don't have time to deal with controllers... (reply to 115886)

&rey: Not having time is very sad, and very dangerous in blockchain engineering. I must advise you against writing any contracts under time pressure.  —— store_uint —— When program must make use of some integer like 0x0f8a7ea5, it stores the integer on stack. TVM represents that integer as something like 0_00000000_00000000_00000000_00000000_00000000_00000000_00000000_0f8a7ea5.  When you decide to store integer in builder (b~store_uint(0x0f8a7ea5, 32)), last 32 bits are written, and all others are checked for being zero. [0_00000000_00000000_00000000_00000000_00000000_00000000_00000000]_[0f8a7ea5] (first part must be full-zero, second part is stored) (reply to 115888)

?: 🙏!!! (reply to 115889)

&rey: (Common computer programs would represent the same integer with 00000000_0f8a7ea5 in some processor register.) (reply to 115889)

?: Are you Nikolai durov? (reply to 115892)

&rey: I'm not (reply to 115893)

?: Where did you get this knowledge from?

&rey: From programming in general, and from whitepapers, from common sense and other sources I mentioned in the pinned poll. (reply to 115895)

?: 😮😮😮 (reply to 115896)

O: No chain atm, S3 data and mobile apps, Ie, front end built, looking to build on chain functions… (reply to 115841)

Anthony: Hi everyone  Do you know if some wallet are able to sign custom message ?

4ll4u: Hello everyone, can anyone explain to me why these values ​​are the same? I want to print to the screen of msg_sender.

4ll4u: can anyone support to me, im a newbie :(

&rey: TVM debug+implementation detail: its slices are actually only views into cells. See bits at the end of log lines. To get only that slice, you would ~dump(begin_cell().store_slice(...).end_cell().begin_parse()); make sure this code doesn't make it into "production". (reply to 115927)

4ll4u: could you give me a code to get msg_sender ? into dump

&rey: from FunC side, dump sender_address.parse_std_addr() from TS side, print address workchain and hash part (as BigInts) separately (reply to 115932)

— 2024-10-17 —

sangmin: const transfer = await wallet.methods.transfer({        secretKey: keyPair.secretKey,         toAddress: toAddress,        amount: withdrawalRequest.amount,         seqno: withdrawalRequest.seqno,        payload: '123' // if necessary, here you can set a unique payload to distinguish the operation     });  Hi guys. I'm using it like this when it's a single transmission, what should I do when it's multiple transmissions? Thank you for sharing the code.

LeeMinThien: Is there anyway to connect mini-app with EVM wallet app like token pocket or trust wallet?

&rey: Yes; it's just a site. (reply to 115954)

Supper: hi guys, how to generate a wallet address and private key using a 12-word phrase similar to importing it into Bitget or Binance Web3 wallets? Is there any current library that can support it? Thanks.

Yoshida: Yes, it's possible to connect a mini-app with an EVM-compatible wallet app like TokenPocket or Trust Wallet by integrating WalletConnect or other wallet providers that support decentralized applications . (reply to 115954)

4ll4u: Hi everyone, every time I update the smart contract, how do I make the blueprint build automatically produce a wrapper file that includes the function name I just defined, or do I have to define it manually in the wrapper file? (im using blueprint)

Johnny: Hi Guys ,i got a problem : when i used method {check_signature,check_data_signature} in my fc file,it will compile success but when deploy it , wallet will decline this deploy ,whatever i use Konkeeper or MyTonwallet

Johnny: Connected to wallet at address: EQAIKHwOW8Ij2QTlEqtj6VjwdddwU8GZYMwiIElYovKE8LDs 11002280

Grounds: Did your program run successfully? (reply to 104820)

Rohit: How can I get my token verified on Tonkeeper?  Thanks in Advance.

Oleksandr: Hello, what is forward_ton_amount used for in jetton_wallet?

Zqy: This must be wrong

Zqy: Pop command, shouldn't it be a direct pop-out? Why is it a replacement here?

&rey: That description is correct. What stack modifications do you expect of it? (reply to 115985)

&rey: Stack elements are not shifted with this opcode. See https://doc.rust-lang.org/stable/std/vec/struct.Vec.html#method.swap_remove for an example of how it works.

Oleksandr: .store_coins(10000000) and how much does that mean (reply to 115983)

&rey: 10_000_000 nanoTON = 0.010 TON. That much is sent to destination contract, to notify about jetton arrival. (reply to 115989)

Oleksandr: thank you, is that the minimal value that can be sent for this purpose? (reply to 115991)

&rey: No. Zero can be passed there for no notification. 1 nanoTON for a useless notification that would only be visible to indexers. (reply to 115992)

Oleksandr: i mean in case the notification is needed, is that possible to pass less? (reply to 115993)

Zqy: Thank you very much for your reply! What I'm trying to say is that there's an ambiguity in the document. It describes "pop s0," which seems to imply that s0 is replacing itself, and thus should remain unchanged. However, in reality, this is equivalent to a drop operation! I believe that clarifying this by stating "pop s0 is equivalent to drop" would make it easier for beginners to understand. (reply to 115988)

&rey: It is indeed swapped with itself, and then last element is dropped. (reply to 115995)

Oleksandr: maybe, there is a minimal value for this? how would it look like here? .store_coins(10000000) thanks (reply to 115994)

&rey: .store_coins(1); no contract is able to handle jetton arrival with such a little amount onchain, but notification will still be there. (reply to 115994)

Oleksandr: could you please suggest the optimal value to set here therefore? (reply to 116002)

&rey: For most use cases, zero. Please detail your use case. (reply to 116003)

Oleksandr: Thank you. I need notification to be sent, contract to be able to handle jetton arrival with that amount, and this amount should be minimal. And I need to know how it should look like in this format  .store_coins(10000000) (reply to 116006)

Alvin: Hi. I've used an online tool to generate 24 words EIP39 . But the wallet(Ton keeper) said it is incorrect.

&rey: Because it isn't. Why did you assume EIP39 is used here? (reply to 116012)

Alvin: I’m a fresher 😅 so where could I generate a random 24 seeds (reply to 116014)

musashi: just use a TON wallet mate (reply to 116015)

musashi: if you want to do it programmatically try ton-crypto node package

Alvin: Yes I used ton keeper (reply to 116016)

musashi: https://www.npmjs.com/package/@ton/crypto (reply to 116019)

Alvin: Thanks I’ll take a look

&rey: Tonkeeper does it itself. (reply to 116015)

Alvin: In dev mode. Testnet . Only one way to generate a wallet - import 24 seed phrase (reply to 116023)

musashi: yes the newMnemonics method should help (reply to 116022)

User<1876379596>: Has anyone seen this error on adsgram?

Marat: Yes, your direct link is incorrect, you need to create a mini app for your bot in botfather, then copy direct link that botfather will give you

Marat: It should be like tme/botname/mini-app-name or something

Grigoriy: Hello everyone, if I send jetton_transfer to the depositor's address in the sandbox, will he receive tokens for jetton_wallet?

Edward: hello！请帮忙看个问题， 在做mintless jettons方式的空投，遇到一个问题，空投完成后，tonview浏览器和tonkeeper钱包上看不到空投余额，是否需要tonkeeper的api加下jetton的白名单哈？  Thanks for help me! aftern i did all as readme, the mintless contract is deployed success. but the address of airdroped does't display amount on explorer and wallet. what can i do to resolve this problem?

sangmin: Is there an example code for jetton transfer? The docs are missing the private key part.

Rohit: Could anyone kindly share any resources on implementing vesting using Tact, if available?

M: Senior devs in here, we need you, we're participating the winter hackathon, let's connect.

4ll4u: Is anyone are senior dev :(

Mirheydar: Hello, everyone. Is there any way on ton to sign the transaction and let someone else initiate it?

&rey: Only proprietary ways like Tonkeeper does for wallets v5.  Newer wallet contracts support that, wallet apps don't and probably won't. (reply to 116091)

匿名少女: Hey guys, Has anyone developed NFTs on the TON blockchain? Is there a more complete example code in Java for deploying an NFT contract? 🥹🙏The documentation I found seems incomplete.

Neo: hi, glad to be here, is it allowed to ask dev questions in here?

&rey: Yes. Only such questions are allowed, indeed. (reply to 116105)

Neo: then why you banned my friend? he is trying to learning to code on ton and had a genuine question

Neo: his question in case someone can explain to him. He is asking about Jetton contracts for tokens on TON. Given that tokens on TON are coded in Jetton contracts, if they have no funds, they get frozen and if user doesn't use these tokens for 6 months (doesn't move them in/out) then this contract gets deleted and user loses the tokens right?  he wasn't to understand if the logic is sound or if he is missing something. thanks

Charles More: Glad to be here

Charles More: Please can someone share a complete jetton token contract?, can't seem to find any yet!

fade: the contract might be frozen, but your funds won't be lost, you can unfreeze any contracts using https://unfreezer.ton.org/ (reply to 116109)

Neo: even after the 6 months of frozen window? (reply to 116112)

fade: i dont know, i only read the docs and haven't personally used this tool before, but if funds can be lost then its a big problem that needs more discussion, if you're that worry, just send a few tons to the contract you want to keep alive

Neo: i just watched Oleg's youtube series on TON development and in there he said that contracts get deleted after being frozen for 6 months. hence my concerns. don't have a token in question, just generally want to understand the situation. Since if you hold many tokens, then just have to check for each of them that they are not frozen. (reply to 116114)

fade: from the way i understand it, the contract code and data will be deleted on-chain, but if you have the code and data you can unfreeze (undelete) it, which is what the unfreezer do, it looks for the code and data in an archive (reply to 116115)

&rey: I didn't. Baseless claims, on the other hand, might see users banned.  > He is asking about Jetton contracts for tokens on TON. Given that tokens on TON are coded in Jetton contracts, if they have no funds, they get frozen and if user doesn't use these tokens for 6 months (doesn't move them in/out) then this contract gets deleted and user loses the tokens right?  Those jetton wallets are frozen. To use them, one needs to reactivate them with some TON; they won't be overwritten with zeroes until they reach -1 TON, which is approximately never. (reply to 116107)

Neo: Hmm, the way i understand it is that you can unfreeze it while it is frozen (6months period), after this it gets permanently deleted (reply to 116116)

fade: can you link the docs for that? (reply to 116119)

Neo: Thanks for the explanation, it is relieving to read this.  Btw when i said ‘you banned him’ i meant one of the mods (reply to 116118)

Neo: Btw is it possible to unban @Dinozaver959 thanks 🙏

&rey: It isn't 6 months, it is until contract balance reaches -1 TON (from -0.1 TON where it was frozen). As frozen state is a couple of hashes, that will happen never. (reply to 116119)

&rey: I don't know how to overrule decisions of Telegram antispam. (reply to 116122)

BizX: are you looking for developer? (reply to 116082)

Charles More: Please!, does jetton support child contracts and contract inheritance?

Mr: Hi guys  anybody knows what wrong with this :  {"ok":false,"error":"LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time","code":500}  I'm tried to get transactions from node and archival=true , address and limit is set, nothing else  i'm tried 'TonCenter'  and some Orbs endpoints

&rey: This looks like a misleading frame. Could you describe what the effect should be, preferably what assets transfers should take place? (reply to 116137)

&rey: Pretty obvious actually, were it true: writing all of smart contracts, backend and frontend. Or assisting, for junior devs. (reply to 116143)

Akshay: Hello there!  I am looking for data dump of transactions for block from genesis to latest for this api. Could someone from TON Foundation assist with this   https://toncenter.com/api/v3/index.html#/blockchain/api_v3_get_transactions_by_masterchain_block  Something like  https://dump.ton.org/dumps/

Akshay: Also, anyone from Toncenter?

— 2024-10-18 —

A: Question. About a week after I issued a tone-based token, a token with the same ticker was issued and listed. I have since received a scam ticket, is there any way to resolve this?

Loda: Hi, is there an API available to check if a user has claimed the Normie Badge?

Laisky: yes, just hour ago (reply to 116254)

Strat8gy: guys please can anyone help with this error message? I got it while trying to see wallet address using npx ts-node. its from the tonhelloworld tutorial

Kings: Does anyone have a code to get balance from a wallet address?

Mirheydar: Hi everyone. Do we have a standard jetton contract that's widely used? And what's the best multi-sig wallet option for jettons?

Hallen: Hi, everyone. Hope you are all doing well. I am developing dapp on ton blockchain. I need to detect ton coin deposit of specific wallet in real time using api. Does anyone have proper tutorial or best solution?

Martin: I usually use the ton-blockchain/token-contract repo (reply to 116266)

Basil 💠: I want to see all previous versions, I saw in tonkeeper and tonhub but they only appeared normal and w5, can you show me an application that shows all versions (reply to 45899)

Dmitry | backend4you.ton: How “real” you want your “realtime” be? User sends tx to network, one of validators executes it and includes in block, sends to other validators, they agrees, block being sent to other (lite)servers, clients who poll lite servers sees that block and includes in their databases - where you want to be in this chain? (reply to 116268)

AstroMint: Hello Team. We're excited about your ecosystem and would like to explore how we can support Ton chain with our decentralized data storage solution. Please may I know who to discuss this with?

Ela | okx wallet: Any decent ton defi projects here?

Derick: "@ton/core Dictionary generateMerkleProof" how to obtain the proof for a single key

Derick: The generateMerkleProof in the mintless-jettons example is different from the latest version of @ton/core.

Daniel: does anyone know if you can separate gas and actual value you want to send to the message?

&rey: No you can't, short of sending a jetton which wraps TON. (reply to 116306)

Daniel: the way im doing it right now is calculate how much gas is needed to call a certain function in my contract, set a upper bound on that, make that a minimum for gas and just send that amount + 1  is there a better way to do this?

&rey: You've forgotten about storage fee. Usually, some excess amount is taken and then sent back; it doubles as confirmation that all transactions happened as needed. (reply to 116308)

Daniel: hmm can you explain more about this? or a link to more info about this would be helpful (reply to 116309)

Haint: what exactly do you want to ask? your picture already describes what to do (reply to 116301)

&rey: User sends required amount + 0.2 TON. Each contract does  raw_reserve(wanted balance diff, 4); next_msg.send_raw_message(128); ... (reply to 116310)

Derick: In mintless-jettons, the generateMerkleProof function takes a single key, but in the latest version of @ton/core, it now takes an array of keys. I want to get the proof for a single key. (reply to 116311)

&rey: [only_key_you_want] is an array. (reply to 116314)

Haint: cant you just provide it with an array of a single key? (reply to 116314)

Derick: The result I want is to obtain the proof for a single key through generateMerkleProof([wallet.address]) (reply to 116317)

Haint: yes, did it work? (reply to 116319)

Derick: Resolved, it works properly now.

Derick: The issue was caused by a problem in my unit test; I forgot to call storeRef(proof).

Menen: Hello guys! I just found out that my app is not working properly on the mobile, but from the mobile version works just fine, do you guys know what is possibly happening?

Kings: async getTokenBalance(address, tokenContractAddress) {         try {             const jettonWalletAddress = await this.tonweb.provider.call2(tokenContractAddress, 'get_wallet_address', [['tvm.Slice', TonWeb.utils.hexToBytes(address.slice(2))]]);             const balance = await this.tonweb.provider.call2(jettonWalletAddress, 'get_wallet_data', []);             return balance[0];         } catch (error) {             console.error('Error fetching token balance:', error);             console.log('Raw response:', error.response?.data);             throw error;         }     }

Kings: Hello can someone help me to get jetton wallet balance? (reply to 116331)

Kings: I'm new to tonconnect. I've tried it many times but it doesn't work. (reply to 116333)

Akshay: @andreypfau @SwiftAdviser (reply to 116172)

rahul: Hello @ll please let me know how we can create wallet when user connected app with main wallet?

Mehdi: Hey folks, can someone explain how can I generate my token address like this -> EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS  Dogs jetton address ends with DOGS. How they did that?

Haint: ton-community/vanity-contract  github (reply to 116340)

User<7376766125>: Any body having issues with fragments

Mirheydar: Hi, everyone. Is there a jetton contract by ton which comes with the batch transfer feature?

Tommy: I am here (reply to 116293)

Mehdi: Is there any bundler in TON blockchain to send multiple transactions in a single transaction. batch transaction. I was wondering if there is a solution to lower the transaction fee.

Mehdi: Same question 😅 (reply to 116353)

SA: Hi everyone, I'm having an issue with TonConnectUI. I want to perform a transaction as a deposit and verify it. When I execute a Jetton transfer, I receive a BOC from which I create a hash. Then, I fetch the transaction from the wallet used for the transfer and compare that hash with the hash of the inMessage . Everything works fine when using TonKeeper as a browser extension, but when I perform the transaction using TonKeeper in the Telegram app on my phone, I get a different BOC (I found out that it’s returning Ton after the transaction instead of the intended Jetton transfer).  Has anyone experienced a similar situation or have any idea why this might be happening? Or do you know of any reliable methods for verifying deposit transactions?

Mickel: Hey, can anyone help? I am trying to integrate TonConnectUI using @tonconnect/ui-react Can you send a link documentation or anything that can help.

Nerses: Is there any limit on execution in TON blockchain ?

Hallen: I want to get notified every time when got new transaction of wallet. (reply to 116276)

&rey: Yes. 1M gas in one transaction (0.4 TON under current basechain prices; 1 transaction = processing of a message on single contract). (reply to 116395)

&rey: Here you are: https://docs.ton.org/develop/dapps/ton-connect/. Docs site has lots of useful information, actually. (reply to 116385)

Mickel: Thank you, I'll check it. (reply to 116400)

&rey: There is preprocessed-v2 wallet supporting up to 255 outgoing messages (which can do anything, like transfer jettons) per one order = in single block. (reply to 116359)

&rey: No there isn't; you have to send each jetton transfer to your jetton wallet separately. (reply to 116353)

لا يضل ربي ولا ينسى: Please help my transaction 6277729715400511390 commente UQDBfjyvFnIzGi5jN94W2GWDGU9Z8JBA6uirv6vQMThBVl9U

لا يضل ربي ولا ينسى: Onus wallet don't get 2.546 ton

Nam: Hi guys i'm quite a newbie in ton. I'm planning to create a tap to earn game. My question is do i need to deploy any smart contracts to store user earned tokens?

Sok: /

pfeffunit: hey devs! i deployed my contract on testnet fine (using blueprint), but i'm getting "9 · Cell underflow" errors when i try to deploy on main

pfeffunit: any ideas why that might be?

Dmitry | backend4you.ton: a) use SDK fr you language and fetch list of transactions for your wallet every X seconds b) use tonapi/tonconsole to fetch json list of last transactions for your wallet every X seconds c) use tonapi streaming api and receive notifications, but not stop listening (reply to 116397)

Grimmie: hey, does anyone use tonconsole streaming websockets?

Алина: i use sse (reply to 116435)

Grimmie: cool

Grimmie: how can i get raw format address from user friendly address? this is user friedly address: UQBm1xC2oXVHhHAxlbRBLRV80NeI3gi5gddH_VUchTb2IIyt (reply to 116437)

Алина: Address.parse('UQBm1xC2oXVHhHAxlbRBLRV80NeI3gi5gddH_VUchTb2IIyt').toRawString() (reply to 116439)

Grimmie: wow, thank you. it works. i was using toString() (reply to 116440)

Grimmie: I was able to get the event log for my mainnet transaction event: {   account_id: '0:447b993d3900cfdf2ee02371ee56b690d2fe2484bd66b48c94042980881e7320',   lt: 50063301000003,   tx_hash: 'ac4d04862fbd3db08cc49a3d802ae9b023e4beb18b7a7b8b6ab8b2cd86992077' } (reply to 116440)

Grimmie: is there any way to parse it? like i want to know the sender, receiver, token name, and token amount, etc (reply to 116442)

Алина: you'll have to use getTransaction or getEvent methods of the api, probably retry a couple of times because they could signal 404 for a while (reply to 116444)

Grimmie: could you please send me the docs link for getTransaction? (reply to 116446)

Grimmie: coz, I am not able to find it in docs search

Алина: https://www.npmjs.com/package/@ton-api/client https://tonapi.io/api-v2 (reply to 116447)

Grimmie: seems like they don't have it in this doc: docs .tonconsole. com/tonapi/rest-api/accounts (reply to 116449)

Алина: they do, look closer (reply to 116455)

Grimmie: getRawTransactions ?

Grimmie: not sure for getTransactions, but I found getEvent :) thanks a lot 👍 (reply to 116459)

BoOmar: Hello guys  How to verify a token on jetton ?

Tiqan: https://verifier.ton.org/ (reply to 116482)

Arthur: Hello. I am tying transfer jettons. But have an error. Can u help me ?

Arthur: It is my func og creating mes

Алина: The error code you can sometimes google or look up in the source code of the smart contract that raised it (reply to 116490)

&rey: You haven't provided custom payload. Probably you meant store_uint(0, 1). (reply to 116491)

Mehdi: 🙏🏻 (reply to 116403)

Arthur: i try both variants (reply to 116495)

Arthur: https://tonscan.org/ru/tx/b16a1366c79504a51aa124933a559e0d35e20f80aabb9e9f60614d0c8f44c488 - my transaction https://tonscan.org/ru/tx/acd52d68e5e789b2209ac328bd581d5b26b1d8b3b69390901bfe816458b1a1c1#overview - ok transacrion

Артур: Hello! Could anybody tell me which class from the ton/ton library corresponds to the W5 Tonkeeper wallet? WalletContractV5R1? I'm trying to check if wallet contract is deployed and it gives me "false" all the time (but it is deployed and has multiple transactions done already). Here is the code:      const walletMnemonic = "my mnemonic exported from TonKeeper app"     const walletKeyPair = await mnemonicToWalletKey(walletMnemonic.split(" "))     const endpoint = await getHttpEndpoint({ network: "testnet" })     const tonClient = new TonClient({ endpoint })     const wallet = WalletContractV5R1.create({ publicKey: walletKeyPair.publicKey, workchain: 0 })     const isContractDeployed = await tonClient.isContractDeployed(wallet.address)     console.log("isContractDeployed: ", isContractDeployed)     const walletContract = tonClient.open(wallet)  I tried to use WalletContractV5R1 and WalletContractV4 but result is the same.

kheil117: Hi, I'd like to retrieve smart contract data that is not available through a defined method, is there a way to get it (I will then parse it manually) ?

&rey: Yes. getAccountState or like. (reply to 116504)

kheil117: thanks, looking into it. (reply to 116513)

Алина: How is last_transaction_id in the return value of /getAddressInformation method calculated?

&rey: Last transaction on that account, known by the server you query. Returned data, code, etc correspond to outcome of that transaction. (reply to 116530)

Алина: Hmm. Is it searching through the latest blocks in the blockchain trying to find a block that have this account id included? (reply to 116531)

Алина: Roughly speaking

&rey: No. It's looking up current contract state from the "global accounts hashmap" of specific shard. Said state includes unique identifiers for last transaction — in particular, time, for storage fee calculation. (reply to 116532)

Алина: Makes sense! I guess, it's just a caching technique/an optimization? To store a pointer to a transaction in the account hashmap. The last source of truth is still blocks that have been accepted to the chain? (reply to 116534)

&rey: Validators' signature mainly refers to current blockchain state (its changes are included, but as optimization on network and block size). (reply to 116536)

— 2024-10-19 —

Tby: Hello @admin is there a provision to connect project to developer in a secured way? Like you want a co developer under a secure environment. Do TON has such opportunities?

Shahboz: Is there a Python script to convert hexadecimal TON addresses to base64 format?

Jaskirat: Hey everyone, I am facing exit code 48 code on my jetton USDT Transfer

Jaskirat: Does anyone has any idea?

&rey: pytoniq_core.Address('-1:c0ffee...').to_str(...) (reply to 116570)

&rey: Project development has historically been out of scope for TON Blockchain. Whatever do you mean by "secure environment", actually? (reply to 116566)

Dimitris: Hi

Dimitris: I have a react app with dot net backend, I want to integrate payment invoice, but I can't find any sample or doc. I check the TonSdk.Connect package for dot net but couldn't find something related with the invoices.

Dimitris: Can someone help? Any doc, sample is well appreciated

Karan: I need some help with the burning of jettons with tonconnect react? Need help, I am kind of stuck

Karan: This is the hash cf156f99151014310e8a88b3908ed67fd09c1c26484d7753ee35e28d1355ff12

Karan: const prepareBurnTransaction = async (amountToBurn:string) => {       const burnMessage = beginCell()       .storeUint(0x595f07bc, 32) // 'burn' method selector       .storeCoins(toNano(amountToBurn)) // Amount to burn in nanotons       .endCell(); // Finalize the cell       console.log(burnMessage,burnMessage.toBoc().toString('base64'));       // Prepare the transaction object       const transaction: SendTransactionRequest = {         validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes         messages: [           {             address: selectedCoin?.address, // Jetton wallet address             amount: toNano('0.05')?.toString(), // Transaction fee (e.g., 0.05 Toncoin for the burn)             payload: burnMessage.toBoc().toString('base64'), // Burn method payload           },         ],       };          return transaction;     };             // Function to handle the burn transaction     const handleBurn = async (successFunction:any) => {       try {         const transaction = await prepareBurnTransaction(amount?.toString()); // Prepare transaction         console.log(transaction)         const response:any=await tonConnectUI.sendTransaction(transaction) // Send transaction via TonConnect         if (response.error) {           setLoading(false);           toast.error('Transaction Failed')         } else {         successFunction();                  }                  } catch (error) {          console.error('Error burning Jettons:', error);         alert('Failed to burn Jettons.');       }     };

&rey: You've forgotten about queryId. (reply to 116610)

Karan: Where to pass it , I am kind of new to ton can you share the updated code?

&rey: Message must be formed according to this structure: burn#595f07bc query_id:uint64 amount:(VarUInteger 16)               response_destination:MsgAddress custom_payload:(Maybe ^Cell)               = InternalMsgBody; (reply to 116612)

&rey: .store_uint(0x595f07bc, 32).store_uint(int(time.time()), 64) .store_coins(amount_to_burn).store_address(user_addr).store_uint(0, 1)

Karan: Let me check

Karan: Do you have TS example? It is giving error

&rey: queryId is internal message structure (burnMessage) (reply to 116618)

Karan: const burnMessage = beginCell()       .storeUint(0x595f07bc, 32)        .storeUint(generateQueryId(), 64) // 'burn' method selector       .storeCoins(1000000000) // Amount to burn in nanotons       .endCell(); // Finalize the cell       console.log(burnMessage,burnMessage.toBoc().toString('base64'));       // Prepare the transaction object       const transaction: SendTransactionRequest = {         validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes         messages: [           {             address: selectedCoin?.address, // Jetton wallet address                          amount: toNano('0.05')?.toString(), // Transaction fee (e.g., 0.05 Toncoin for the burn)             payload: burnMessage.toBoc().toString('base64'), // Burn method payload           },         ],       }; (reply to 116621)

Karan: This is the message {     "validUntil": 1729327012249,     "messages": [         {             "address": "0:2f956143c461769579baef2e32cc2d7bc18283f40d20bb03e432cd603ac33ffc",             "amount": "50000000",             "payload": "te6cckEBAQEAEwAAIVlfB7wAAAGSo+eFt0ATEtAICIBQTQ=="         }     ] }

Haint: the burn message doesn't adhere to tep-74  https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-burn (reply to 116623)

&rey: You have entirely overlooked my message about what fields need to be stored. You shouldn't treat Python as that different from JS (reply to 116623)

Karan: I tried that as well it failed again Check the hash 37c35b45c1aef120cfb88ef0b196025dd995d002bbff78ad79090ff07e8e3709 (reply to 116628)

&rey: Probably you have calculated it incorrectly. Jetton wallet ≠ jetton master. (reply to 116623)

Karan: Wait they are different? Can you explain, in evm, tokens have only one contract address (reply to 116634)

Karan: This is what I am passing here  EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT  for NOT coin

&rey: In TON, jetton master stores metadata, and jetton wallets (one for each jetton&user) store users' balances. (reply to 116635)

Karan: So what is this EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT

Karan: and what I am suppose to use 😢😅😅

Haint: it's the jetton master address (reply to 116638)

Haint: you need to find your jetton wallet address

Karan: Do we have any apis for that? or any code?

Lee: Hello everyone, how to generate boc information?

Lee: I want to call the /sendBoc interface

Haint: https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-jetton-wallet-addresses-for-a-given-user (reply to 116643)

Karan: Done Thanks b91a6e7cfd2fd8229ef22b4662ec9e4b85d3c0481977de2d6f84217c414f34b2

Dimitris: Any advice?

C.: You need to query the jetton master for your own jetton wallet (reply to 116643)

Kirills: Hi all! Can you tell me how I can get the total spent fee for the swap? Which API of yours should I use or how to calculate it?  https://tonviewer.com/transaction/8a58313cab95c36953ca11ea74a4d83ff24b6c338ebd92e86e49177b8538e653?section=valueFlow  interested in the number Total: 0.033441768 TON

Tby: I mean does Ton provide a means to meet developers who are known? I have a project that I need co developers to work with. (reply to 116591)

Vahid Sabet: I'm blockchain developer and ready to cooperate (reply to 116663)

0xErpal: Guys who know how to remove the closure of a web application in any part when scrolling down, I do not understand what method and where to enter it on next.js

Denys: Hi everyone, I have this event created in my contract emit(BridgeFundsOutEvent{             token: msg.token,             recipient: msg.recipient,             amount: msg.amount,             transactionId: msg.transactionId,             sourceChain: msg.sourceChain,             sourceAddress: msg.sourceAddress,         }.toCell());  How can I trace it in tests to check that everything is working correctly? I wrote this code: const transferResult = await bridge.send(receiver.getSender(), { value: toNano('0.5') }, fundsOutMessage);  const events = transferResult.transactions[0].events; console.log(events);  the console displays the following result:   console.log     Events:  [       {         type: 'message_sent',         from: EQBVL2212gyufws6tKtY2Fkn9r65Ys2kJqam7nUcgs6tH7uD,         to: EQBbz87xDR_ufbMtFbszj6byAaPWDJxlbhsKvRPSeuSbOQPp,         value: 500000000n,         body: x{3A60B3618016958C0DEEB4C24F74677D5D3AE348E0CBB23951839F493AD522F9E2C62957DD500154BDB6D76832B9FC2CEAD2AD6361649FDAFAE58B36909A9A9BB9D4720B3AB47C00000000000000000000000000000000000000000000000000000174876E8001_}          x{0000000000000000000000000000000000000000000000000000000000000008C_}           x{536F6C616E61}           x{307830303030},         bounced: false       }     ]

Dimitris: Hello, how can use the payments invoice in dot net ?

Tby: you can send your CV to oxlarni@gmail.com (reply to 116672)

final: lite client stucks at this moment.  how to fix it?

22ICS10009_Ayush: hey guys, I am new to TON. Can anyone suggest some resources to begin with

Justknow: Hi Gm!  Have a little issue.  Token already trading but show up as “Fake” on ton viewer & tonkeeper

Justknow: Any ideas how to fix ?

Dmitry: https://github.com/ton-community/awesome-ton (reply to 116709)

Dmitry: You can also check @hackthetonbot 🌚

Sarem: Hey guys. I want to use react-dev-tool extension for my next.js app. is there any way to add extension to telegram inspect viewer?  or do you know alternative approach?

Naveen: Hi Team,  If receiver wallet is in Nonexist.    state , when we transfer TON to them they are getting bounced, do we need to do anything for making them active in such cases ? how can I check if wallet is Nonexist , if so make it active before initiating tranfers

R: Hello I want to know if there is an rest API to implement the same function of GetAccount in lite-server? it's a pity that args of "/v3/account" contains address no seqno.

Naveen: Send some Toncoin to the calculated address. Note that you need to send them in non-bounce mode since this address has no code yet and thus cannot process incoming messages. non-bounce flag indicates that even if processing fails, money should not be returned with a bounce message. We do not recommend using the non-bounce flag for other transactions, especially when carrying large sums, since the bounce mechanism provides some degree of protection against mistakes. _______________ is this 👆the solution ? 😯   I can get wallet status from👇 api/v2/getAddressInformation  if its uninitialized i will send the TON in non-bounce mode ? (reply to 116736)

&rey: You got that in reverse. First you transfer money without bounce there, and only then it might be activated (not needed, though, once you get step 1). (reply to 116736)

Mr: Hi guys   anybody know how can I get jetton/masters from api v2 ?!  its neccessary endpoint for checking valid wallets and decimal of specefic asset and and couldn't find any thing about this information in version 2 api ?! so developers handle this information manually ? and how can they handle assets payments using v2 api when this important information not supported by this api ? I have to migrate to v3 api ?

Nikita: Hi everyone! Perhaps someone knows why store_uint(4, 3) is used for AnycastInfo when building address in official jetton implementation?  https://github.com/ton-blockchain/minter-contract/blob/main/contracts/imports/jetton-utils.fc

kevin: that should be 3 bits represent bounceable/testnet/addrtype respectively. (reply to 116779)

Nikita: anycast_info$_ depth:(## 5) rewrite_pfx:(depth * Bit) = Anycast; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:uint256 = MsgAddressInt; addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(addr_len * Bit) = MsgAddressInt;  hm, I tried to understand it based on TLB schema. It should be internal address, right? (reply to 116784)

— 2024-10-20 —

Irqaan Waseem 🏅🍅🐦SUI: Hello sir I want ton testnet token in a large quantity for fiva testnet purpose

pony: how can i know why my transaction is failed?  https://tonviewer.com/transaction/8aa80cf5cd0312352d772ed6ac83bbe68312a35afe2c8e1b4a2d54149724ae3e

Riju: Hello everyone, I’m developing a dApp related to crime data. Looking forward to showcase very soon.

Riju: I’m also new to TON, so looking forward to get support from you guys if needed.

Holst 🧙🏻‍♂️: Hello, friends!   Can you tell me if there are custodial solutions for TON or other wallets somewhere in open source? If not, where i can find best practices?

Naveen: How to access api methods via @ton library, I know tonweb has it, was looking similar to it in ton/core.

Abdulaziz: Did he just sign phishing transaction? (reply to 116836)

Abdulaziz: You got scam (reply to 116837)

&rey: That's scam attempting to pull your TON. (reply to 116837)

Abdulaziz: It's too late (reply to 116841)

Abdulaziz: It promising what it doesn't have. In general, even a professional can be a victim of such a scheme, the scammer has already earned 15k$ (reply to 116846)

Abdulaziz: How many do you lose (reply to 116850)

&rey: Generally, professionals don't. Just do not sign txs that you didn't ask for, regardless of you stand to lose or to win. (reply to 116849)

Pivi: anyone knows how to decompile/convert TVM bytecode to fift (ASM)

&rey: Disasm.fif at https://github.com/ton-blockchain/ton/blob/921aa29eb54db42de21e0f89610c347670988ed1/crypto/fift/lib/Disasm.fif#L4 (make sure that your usage is fair use or complies with license). (reply to 116870)

Pivi: thank you. yes i will use it for research for sure (reply to 116872)

Pivi: i need detail guide how to disasm TVM bytecode to fift. anyone knows pls help me

&rey: oh, I just remembered how I did it automatically: https://github.com/ProgramCrafter/wallet-contract/blob/c4e9271abae8abe554a82e7d34f8c87b073acd8e/build.ts#L33

Pivi: thank i will take a look

operator: Sorry for the off-topic, I made a summary of tutorials for beginners in tone on tondev .ton, I did it before I started laying out a year ago on the constructor, a lot of new things have appeared over the year, any suggestions on what guides can be placed? Now the cat is tied to Makosov, I'm generally interested: out of 10k+ developers, is this domain of no value to anyone?)

&rey: One has to research questions asked in dev (and non-dev) chats to understand the required direction of tutorials. Currently, a large chunk of questions is about custodial/other services behaving in unexpected way (which is admittedly off topic and generally deleted); other questions seem to be distributed uniformly randomly over ecosystem topics.  also, you don't mean to say that there are 13.8K developers in this chat? there aren't (reply to 116880)

NPA120: Hello, Can you tell me about the exit code 44 in TVM, please?

NPA120: I was trying to find this in doc but there is not 44 in exit codes (reply to 116907)

&rey: Thrown by contract's code. (reply to 116907)

NPA120: you are correct. I found it. Thanks (reply to 116910)

...: hi everyone, i need to help about smart contract. my ton space wallet was deployed smartcontract by someone who I do not know person and  $TON in my wallet is recieving and sending with auto without my cantroll. please help me for remove smartcontract from my wallet.

&rey: This is either not true, or you have sent secret key to another.  You should explain more precisely. (reply to 116916)

NPA120: throw_unless(44, data::merkle_root == cs~load_uint(256)); I want to get this cs~load_uint(256) value to find the error. (reply to 116910)

Mithra: Hi, what are the Mainnet RPC endpoins I could use for reading & writing?

Alvin: I deploy Jetton contract but transaction failed, how to identify this reason

Mithra: Did it fail in the CLI or on the chain? (reply to 116943)

Alvin: On the chain

Mithra: There should be errors then or error codes (reply to 116945)

Alvin: Actually the wallet already showed it will be failed

Alvin: Just fail so I don’t know why (reply to 116946)

Mithra: Thsi means there were errors in the deployment or fees. (reply to 116947)

Alvin: I gave 0.1 ton to the new contract is this ok ?

Alvin: testnet by the way

Haint: use ~dump (reply to 116927)

Alvin: Just Failed nothing else 😭

Alvin: I deployed other contracts and success

Haint: see the exit code on tonviewer (reply to 116955)

Alvin: Found something

Haint: the op probably doesn't exist on the contract (reply to 116961)

Mithra: Are there any alternative nodes to: https://toncenter.com/api/v2/jsonRPC ?

...: various nft and 0 value tokens were coming to the wallet, i.e. 60,000 dogs worth of bonus and similar nfts were coming and that's it.  as a result, they turned out to be false.  after that $Ton of different value started coming to the wallet from different addresses and immediately sent to 4 5 addresses continuously.  the token received in the wallet will be sent to the same 4 5 addresses within 10 seconds.  the wallet has other $Not $Dogs and some other such tokens, but they can't be tapped because the wallet doesn't have $Tons for commission.  If I put $Ton in the wallet, the situation mentioned above happens.  I searched the shipping addresses and found information about the github site in my wallet, and when I went to it, there was information and codes about the samrt contract.  then when I explained the situation to the support people and asked for help, they said that they could not help and that they might have installed a smart contract on my wallet. (reply to 116924)

Elizabeth: Okay (reply to 116967)

Qyver: Hello everyone, please tell me how reindex works in tonapi Changed the json offchain, the reindex worked on one token, it doesn't work on the others. Updates appeared on ton cx

Camel: Hi everyone, how can I get the user's wallet address when they have already connected their wallet using @tonconnect/ui-react without using a hook?

Alex ▪️◼️⬛️: How to create a sendTransaction for Jetton transfer through the tonconnect/ui-react.  Can’t get that 🥲

Alex ▪️◼️⬛️: Searched up through the chat and haven’t found that neither

Alex ▪️◼️⬛️: That doesn’t mean it’s not exist inhere, I’m just dumb 🧌 (reply to 116995)

Ursss_ysn: Hey

&rey: 1. Create payload for jetton transfer (order) according to TON Cookbook or TEP-74. 2. Obtain sender's jetton wallet address according to TON Cookbook or TEP-74. 3. Send transfer appropriately. Mind fees; try setting forward_amount as low as possible (the best option is zero). (reply to 116994)

Blas: Hi!  I'm building a vaul that accepts jettons. I am trying to set up a test for it, and it's currently failing.  Do you guys have any resource I can use to test that the transfer was submitted correctly?

— 2024-10-21 —

Steven: How do you think exchanges handle deposits??

Steven: Building a TMA and I'm looking for a way to handle custodianship

live: hello，everyone，why is the W5 address calculated in the master branch of the W5 repository using tonkeeper not the same as the address in the tonkeeper wallet?

Haint: what's the difference? (reply to 117050)

live: calculate address is  "kQCPhGYkgm1NzsxpYtyJD07mHvJBuiW8Ot2f2eREGroTPHA-" but the wallet address is "0QA7-rBnJFs0VXrhXnxv1jjz1dEPqvbfBFhdC7hzh8Gw1zxz"

TKAINU: Hello, get real time event of ton smartcontract, can?

live: I've tried changing the parameters, but it's still not the same, and the W5 contracts under the tonkeeper repository don't have a Contract type on top of tonviewer

Mirheydar: Hi everyone! Is Ton Minter a good way to mint a serious jetton?

sangmin: can i use wallet v5 by tonweb library ?

Grigoriy: Hi, is it possible to somehow wait for the deploy contract on func to send the next message to it. Or how to check in func that the contract is deployed? Or is it better to pass init?

rahul: Hello everyone i want to integrated receive functionality within the TMA app from the main TON wallet ?

Forbes: are you looking for dev to do this? (reply to 117079)

rahul: Yes

Oleksandr: Is reentrancy possible in ton?

&rey: On blockchain level, no. Contract execution ends before any of generated messages even start being processed. (reply to 117085)

Oleksandr: thanks you, therefore, no need to put state update after calling another contracts? additional question: is it possible to dynamically calculate msg_forward_fee and not hardcode it? (reply to 117086)

&rey: First: yes, no need. Second: quite hard. (reply to 117087)

Oleksandr: thanks (reply to 117089)

Mirheydar: Hey guys, what is the easiest way of transferring jettons with a message in ts?

Dmitry | backend4you.ton: As you see, there is no any DEV here who can say this is not_scam :) (reply to 117109)

Eric: can I send a message?

Eric: why can't I send a commit url of github

Sad Bun 🐇: hi!  could someone please clarify, do get methods actually cost gas?  it's said in ton docs that Get methods are special functions in smart contracts that are made for querying specific data from them. Their execution doesn't cost any fees and happens outside of the blockchain. - https://docs.ton.org/develop/smart-contracts/guidelines/get-methods  however tonlib's runGetMethod's response contains a field "gasUsed" (and it's not zero)  smc.runResult gas_used:int53 stack:vector<tvm.StackEntry> exit_code:int32 = smc.RunResult; - https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L184 smc.runGetMethod id:int53 method:smc.MethodId stack:vector<tvm.StackEntry> = smc.RunResult; - https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L315  (i'm mostly interested in standard wallet smart contract and its seqno get method 🙏🏻)

Leo: get methods are called off-chain and run in TVM like normal message processing they cost gas in TVM, which is virtual and won't cause any actual balance change on the account

Sad Bun 🐇: thank you! (reply to 117128)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 58 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 45  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Zqy: How should I submit code optimizations?

&rey: Have you checked whether that'd be more optimal across all contracts? After all, your code will generate SWAP STSLICE in many cases. (reply to 117136)

Zqy: Yep

Zqy: Because a cell is created first, and then the slice is put into it, the Slice is always on the stack in front of the cell.

Zqy: Can you give me an example of these different situations in development? (reply to 117138)

Zqy: Is white paper have a wrong word print？

Zqy: ૮₍ɵ̷﹏ɵ̷̥̥᷅₎ა @pcrafter

PuzzledOldman: Hello are there any mempool monitoring services? I see an unfinished github repo on this; are there already working solutions?

&rey: You should check out Asm.fif * ton-blockchain/ton/crypto to check out what TVM actually expects. Both places might have an error; whitepapers are also outdated in certain places. (reply to 117155)

ANDY: Hello Everyone ☺️

Hui: Can I query the return result of another contract in the contract? Is there a code example? Thanks

C.: You can't unless the contract specifically allows it (reply to 117173)

C.: Queries are for off-chain data fetching. TVM is initialized for a singular contract only

Roman: Hi everybody. Just want to ask. Should i update my full-node on 28 october? And what release i neeg to deploy?  this - htps://github.com/ton-blockchain/ton/releases/tag/v2024.09 ?

Grigoriy: Hi, is there any way to send a message sequentially with another from the same contract?

Shahboz: Hello everyone, has anyone created a jetton using the Mintless Jettons method, and how much commission would it take to distribute the jetton to 10,000 addresses?

&rey: You can't wait until transaction tree produced by first message completes. The second message might be sent, and will arrive later than the first if destination contract is same. (reply to 117191)

Mirheydar: Hi  Which one of these contracts are more recommended to use?  https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc

Grimmie: I have a quick question. From mempool sse, I subscribe for real time account notification

Grimmie: but it says the response data is "boc"

Grimmie: may I know how i can get transaction hash from boc and parse it using getEvent/getTransaction api?

Алина: it's /emulation/decode or something like that (reply to 117247)

Алина: mempool is about external messages to the blockchain that will later result in transactions, there's no direct way to get a transaction hash out of a mempool event

Grimmie: that's interesting. from other EVM chains, I used to get the transaction hash from mempool as well 😳 (reply to 117250)

Grimmie: so i can decode boc message instead of getting transaction hash? (reply to 117249)

Grimmie: ok then i will try to do it

Grimmie: yo @nogitsunesmirnova i have another quick question. when i parse confirmed tx, i get different address from this tx: https://tonscan.org/tx/fe4d12124d39fbf9f16de54981fc55a6a8d7ea441cf413f01adc84c558f45947#overview  i see that sender is UQBm1xC2oXVHhHAxlbRBLRV80NeI3gi5gddH_VUchTb2IIyt but the response says EQBm1xC2oXVHhHAxlbRBLRV80NeI3gi5gddH_VUchTb2INFo

&rey: But this is totally non-EVM chain!) Here, once you get transaction hash [and verify it], it is already final. (reply to 117251)

Grimmie: Got it 👍 (reply to 117265)

&rey: those are same (reply to 117264)

Grimmie: ??? (reply to 117267)

Grimmie: it has different characters

Grimmie: if I compare these two strings, it returns false, right? maybe, is there a way to convert one to make it same as another?

&rey: You should convert them to raw addresses; what programming language would you like? (reply to 117272)

Grimmie: I am using typescript

Grimmie: ofc, I can convert it to raw address, but wasn't able to get the friendly addresss back (reply to 117273)

Grimmie: ahh ok got it

&rey: Address.parse('...').toRawString() (reply to 117274)

Grimmie: so for my applications, i don't need to use friendly addresses to store in db

Grimmie: hmm maybe store both friendly and raw addresses :(

&rey: as for what flags to use for friendly address: depends on purpose

&rey: Do you want to — [ ] a. send TON there — [ ] b. send other rewards there / receive any assets from there — [ ] c. show the address in app?

Grimmie: mostly c.

&rey: You should use tonapi's backresolve; it will show nice domain if user has one. (reply to 117282)

Grimmie: awesome. i will consider the domain later

Grimmie: for now, I need to get the original friendly address that users use

&rey: people are getting used to UQ... address (non-bounceable)

Grimmie: so what i need is, from the response address: EQBm1xC2oXVHhHAxlbRBLRV80NeI3gi5gddH_VUchTb2INFo  i need to get the original address: UQBm1xC2oXVHhHAxlbRBLRV80NeI3gi5gddH_VUchTb2IIyt

Grimmie: is it possible?

&rey: Address.parse('...').toString({bounceable: false}) (reply to 117287)

Grimmie: Awesome, thank you. I will try it and let you know (reply to 117291)

Mr: Hi   I tried to get my jetton transactions and the exact transaction that I get and check on explorer its abould to transfer exactly 50 USDT but there isn't any value in transaction json that could fit with this amount   also I to read inmsg.message_content.body that and I use Cell().one_from_boc and it get ref and bytearray now how convert this data to normal and readble data ?  <Cell refs_num: 0, bytearray(b'\x17\x8dE\x19Tm\xe4\xef\x9d\xa6*,@/\xaf\x08\x08\x01GW\x1e\x14\xc4[n/\xa9\xce\x......

Mr: I so confused about cells and how read data from them and coudn't fund any good example for that

Andrew: Hi everybody! Can anyone tell me how to send external message using TypeScript?

PtcBink: Are you still need help bro? (reply to 117079)

A: Hi everyone! I’m trying to run a ton site on the IIS server, I have installed reverse proxy, scanned QR code and tied my ton domain, opened in/out UDP port and with ton proxy I’m able to see my ton site on the machine where my IIS is running. But outside the server my ton site is not reachable. Will really appreciate the help with what I am missing 🙏

&rey: Well, blockchain doesn't operate on readable data, and smart contracts won't parse JSON. (reply to 117310)

&rey: Look at this: https://github.com/toncenter/examples/blob/main/deposits-jettons.js. (reply to 117311)

Mr: no I mean I get whole of transaction information in Json from api and at 'in_msg' i could reach the cell data (reply to 117321)

Mr: based on some tutarials I convert my cell data to int and its start with 010  but the tutarial get diffrent values and change the whole method that not suitable with my binary data and I don't know what should I do with this data and based on what documentation I could validate my bitarray and convert them to normal string !

Mr: thank you let me check that (reply to 117322)

Mr: thank you bro based on this I could find a lead  very helpfull  thank you (reply to 117322)

Valentin: Hi, I'm building an IA code inspector to try to find code vulnerabilities/rugs on Jetton contracts.  So far I found these scam tokens:  https://tonviewer.com/EQCqYp0e7dZ0EuwS1XqPsxj-Qom-Rv2lIi1DQaWSYLN475Lg?section=code  https://tonviewer.com/EQBzv6t0M2mq5nUQ9YFwae5vyVZ2j4yqx_2_RiXwiM7yCGSR?section=code  To train my IA model, I'm trying to figure out which is the actual strategy developers used to build this scammy token

Valentin: Is anyone familiar with token code rugs or scams?

stefan: Hey Guys, how can i Check If a staking telegram app is legit or scam? I gave a validator link but I don't understand it. Pls answer only here in group chat.

stefan: I also received nft in to keeper but don't know how to claim it or us it scam ?

Charles More: Hi devs  Please how do I implement staking in ton smart contract? Staking with duration and rewards  Links and templates are appreciated 👏

Grimmie: It works like a charm (reply to 117291)

— 2024-10-22 —

Rohit: actually i want to send a message to a sender ..Is this correct way ? and one thing more Value 0 is correct or i have to pass something else?

Haint: it's fine, as long as the remaining msg value is enough to cover the gas fees (since you use SendRemainingValue) (reply to 117378)

dann: hi! does anyone have a script that mass creates TON wallets for testing?

Rohit: Appreciate your efforts.   Thanks (reply to 117385)

Nahm: Hello... Does TON chain support multicall contract ?

Haint: no (reply to 117388)

sangmin: Is it possible to deploy wallet v5 with ton library? I want to know how.

Leo: import wallet-v5-related classes from @ton/ton

sangmin: I changed the v4 deploy code to v5 only, but it doesn't work (reply to 117394)

sangmin: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#-deploying-a-wallet I followed this tutorial.

Leo: v5 has different config parameters and the interface is not completely interchangeable with other versions

Leo: you can refer to https://github.com/ton-org/ton/blob/master/src/wallets/v5r1/WalletContractV5R1.ts

sangmin: I saw that, but I'm not sure. T.T

sangmin: Is there an example for wallet v5 deployment?

Eric: does anyone could help me with https://github.com/toncenter/ton-index-worker/issues/87?

Eric: the question is, why there's a concurrent access problem for current_shard_blk_ids_. Thanks a lot (reply to 117401)

Martin: GM guys,  I am facing an issue that hoping someone can help me. I'm using try/catch to handle an error throw in smart contract, but that way makes the transactions successful and there's no way to know what error is thrown.  Any suggestion for this case? Thanks guys

&rey: Don't bother, 100% of those NFTs lead you into scam. (reply to 117362)

stefan: Was also my thoughts (reply to 117410)

Hui: Can you tell me how to calculate the address of Jetton using ton4j given the Jetton information?

Dmitry | backend4you.ton: call get_wallet_address on master (reply to 117417)

Hui: I want to calculate the contract address of Jetton

sunyoki: What kind of deal is this

sunyoki: Where is the TLB documentation？

Leo: check tonstake docs or contract code if they open sourced

sangmin: @leouvw Thanks!!!  I did it !!

Naveen: Hi Team, what is the process to propose TEP plans/ideas, I know first we need to discuss here, is it just start discussion in here, do we need to tag any community owners or dedicated committee ?

Samyar: TON connect gives 403 error and i can't connect any wallet

sangmin: Is there a way to know seqno of the from address in the transaction?

Anoop: I’m looking to set up a TON archive node… does anyone have a working docker image to build from ?

Bryce: hi guys  is there anyway to convert addresses in ton without @ton/ton (without using Buffer)?

Mirheydar: Hey guys

Mirheydar: ??

Mirheydar: What is the most cost efficent option to air /drop my token?

Marat: Maybe mintless jetton processing? I am not sure, I am a newbie

Marat: https://docs.ton.org/develop/dapps/asset-processing/mintless-jettons

Marat: You can read more about this topic here https://docs.ton.org/develop/dapps/asset-processing/mass-mint-tools

Haint: use merkle tree (reply to 117451)

Champer Wu: Does anyone encounter the issue about the MyTonWallet current updated lead mnemonic couldn’t parse the correct private key? this the solution for everyone needs it  import { derivePath } from 'ed25519-hd-key'; import { mnemonicToSeed } from 'bip39'; import { keyPairFromSeed } from '@ton/crypto'; import { WalletContractV5R1 } from '@ton/ton';  async function extractKeysFromMyTonWalletMultiChainMnemonic(mnemonic: string, index: number) {   const seed = await mnemonicToSeed(mnemonic);   const seedContainer = derivePath(`m/44'/607'/${index}'`, seed.toString('hex'));   const keyPair = keyPairFromSeed(seedContainer.key);   const wallet = WalletContractV5R1.create({     workchain: 0,     publicKey: keyPair.publicKey,   });    return { contract: wallet, keyPair }  }   by the way, the Ledger user would face the same issue, it’s also resolved  async function extractKeysFromLedgerMnemonic(mnemonic: string, index: number) {   const seed = await mnemonicToSeed(mnemonic)   const seedContainer = derivePath(`m/44'/607'/0'/0'/${index}'/0'`, seed.toString('hex'))   const keyPair = keyPairFromSeed(seedContainer.key)   const wallet = WalletContractV4.create({     workchain: 0,     publicKey: keyPair.publicKey,   })    return { contract: wallet, keyPair } }

Champer Wu: which app you select? Ton Space? (reply to 117427)

Barbell: func (reply to 93840)

Barbell: Hi guys there is an bug with @ton/Core. I am returning in get method (tuple) with mutliple values as list but I can't parse in the frontend as it's only shows the array of the items. When I call it via api v2, or v3 it's parsing properly. anyone knows why the sdk.js is not parsing properly?  This is what i am getting on client.runMethod

Barbell:  TupleReader {   items: [     [       x{80104B94273ED855F189171667F17A220BE45BE0DF3A00099EA98FEDE7B8034E593_},       1n,       2n,       100000000n     ],

Barbell: but via api direct call is stack": [       [         "tuple",         {           "@type": "tvm.tuple",           "elements": [             {               "@type": "tvm.stackEntryTuple",               "tuple": {                 "@type": "tvm.tuple",                 "elements": [                   {                     "@type": "tvm.stackEntrySlice",                     "slice": {                       "@type": "tvm.slice",                       "bytes": "te6cckEBAQEAJAAAQ4AQS5QnPthV8YkXFmfxeiIL5Fvg3zoACZ6pj+3nuANOWTCDdJ77"                     }                   },                   {

Barbell: funny enough via unit test it's working fine I think the core library 0.59 is kind of broken.

Barbell: rest of the result via api is omitted.

George: Hi everyone, can you please tell me if anyone knows the contacts of @mememebot_bot? I would be very grateful if you could share 🙏🏻

Amir: hi is there any way to understand if transaction is sell or buy on ton api trace end point ? i want to create event data from trace

Ayush: Hey, I am developing a application which will be using a jetton. That Jetton is currently only on mainnet.   Does anyone know any jetton which is on testnet for development?

Ayush: Also, how can I fetch a particular jetton balance for the user of my dapps. As I want to show that in my application

Valentin: Hey is there a way to determine whether an address is a simple wallet, a Jetton, an NFT?

Amir: try ton api accounts/jettons (reply to 117510)

&rey: tonapi, for instance. Note that wallets are smart contracts as well, and different while we're at that. (reply to 117511)

Amir: ton api acoounts/account id  check for interfaces (reply to 117511)

Ayush: this one, right ? from tonapi.io (reply to 117512)

Amir: yes (reply to 117516)

Ayush: ok

Ayush: do you know any jetton on testnet ?

Amir: no (reply to 117519)

Zakir: hey guys https://docs.ton.org/participate/run-nodes/mytonctrl using mytonctrl how can i understand what is the latest block i have in my local system?

Valentin: how can I determine if a contract is a wallet then? (reply to 117513)

Valentin: e.g when I create a wallet with the typical wallet apps, it deploys some code or is it a default contract?

Valentin: got it! thanks! (reply to 117515)

Артём: Hello everyone! Should I wait till contract deploy before sending the second message?

&rey: you shouldn't  wallet apps indeed deploy some code, which can be wallet v3r2 or other (reply to 117523)

&rey: Two A=>B messages are guaranteed to arrive in order so if sender is same you don't have to wait. (reply to 117547)

&rey: Mint one on https://minter.ton.org/?testnet=true. (reply to 117519)

Holst 🧙🏻‍♂️: Hello everyone!  I'm Sergey. We are preparing a decentralized finance product for "The Hackers Winter". Currently, we are looking for additional team members.  Func developer: Knowledge of exchange functions and liquidity interactions. We have mentor which will help you if needed :)  We already possess a concept with a working Func smart contract. As a startup, we are primarily focused on earning rewards through the TON Hackers Winter Hackathon. However, our budget is limited to cover operational expenses for the upcoming month.  Don't hesitate to DM for further details. Thanks, everyone! :)

Ayush: ok, thanks (reply to 117559)

S: ✋

S: who can teach me how to calculate user's usdt wallet address?

&rey: TON Cookbook can teach you that and many other useful things. (reply to 117569)

S: oh my problem is about wallet code

S: b5ee9c7241020f010003d1000114ff00f4a413f4bcf2c80b01020162050202012004030021bc508f6a2686981fd007d207d2068af81c0027bfd8176a2686981fd007d207d206899fc152098402f8d001d0d3030171b08e48135f038020d721ed44d0d303fa00fa40fa40d104d31f01840f218210178d4519ba0282107bdd97deba12b1f2f48040d721fa003012a0401303c8cb0358fa0201cf1601cf16c9ed54e0fa40fa4031fa0031f401fa0031fa00013170f83a02d31f012082100f8a7ea5ba8e85303459db3ce0330c0602d0228210178d4519ba8e84325adb3ce034218210595f07bcba8e843101db3ce032208210eed236d3ba8e2f30018040d721d303d1ed44d0d303fa00fa40fa40d1335142c705f2e04a403303c8cb0358fa0201cf1601cf16c9ed54e06c218210d372158cbadc840ff2f0080701f2ed44d0d303fa00fa40fa40d106d33f0101fa00fa40f401d15141a15288c705f2e04926c2fff2afc882107bdd97de01cb1f5801cb3f01fa0221cf1658cf16c9c8801801cb0526cf1670fa02017158cb6accc903f839206e943081169fde718102f270f8380170f836a0811a7770f836a0bcf2b0028050fb00030903f4ed44d0d303fa00fa40fa40d12372b0c002f26d07d33f0101fa005141a004fa40fa4053bac705f82a5464e070546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c9f9007074c8cb02ca07cbffc9d0500cc7051bb1f2e04a09fa0021925f04e30d26d70b01c000b393306c33e30d55020b0a09002003c8cb0358fa0201cf1601cf16c9ed54007a5054a1f82fa07381040982100966018070f837b60972fb02c8801001cb055005cf1670fa027001cb6a8210d53276db01cb1f5801cb3fc9810082fb00590060c882107362d09c01cb1f2501cb3f5004fa0258cf1658cf16c9c8801001cb0524cf1658fa02017158cb6accc98011fb0001f203d33f0101fa00fa4021fa4430c000f2e14ded44d0d303fa00fa40fa40d15309c7052471b0c00021b1f2ad522bc705500ab1f2e0495115a120c2fff2aff82a54259070546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f401fa00200d019820d70b009ad74bc00101c001b0f2b19130e2c88210178d451901cb1f500a01cb3f5008fa0223cf1601cf1626fa025007cf16c9c8801801cb055004cf1670fa024063775003cb6bccccc945370e00b42191729171e2f839206e938124279120e2216e94318128739101e25023a813a0738103a370f83ca00270f83612a00170f836a07381040982100966018070f837a0bcf2b0048050fb005803c8cb0358fa0201cf1601cf16c9ed5401f9319e

S: I used this hex code but getting wrong address

&rey: Use the option where get-method is invoked, it is more stable. After all, USDT's jetton wallet code is a library cell IIRC. (reply to 117572)

Abdulaziz: Nice after 16 hours of hard work i made answer for /start command

Abdulaziz: I rеally tirеd hаrd

Abdulaziz: I got an error, it was <br> is unsupported in bots, but <b> is supported. Don't repeat my mustake

Valentin: What are interfaces? Is that a field sored in the contract storage? (reply to 117515)

&rey: No. TVM has no notion of interfaces at all; explorers partially parse contract code to check if it has certain get-methods, and so label the contract.  In particular, there is jetton_master,jetton_wallet; in fact, that contract does work as both. (reply to 117587)

Valentin: I'm trying to identify if a contract has malicious code or is a scam.  For that I want to:  1. Check if the admin is the zero address (otherwise it's a red flag) 2. Check if the code has some malicious functions.  Do you have any tips for this? (reply to 117588)

&rey: Not possible in any reasonable time due to complexity theory limits for computation. (reply to 117589)

Valentin: 1 or 2? (reply to 117590)

Valentin: For (1) is there a function I can call to get the admin address?  For (2) I plan on diffing the default jetton contract code with the actual code and see if there are new functions (reply to 117590)

&rey: What says that returned admin address means anything to the contract? So, I'm talking about both points.  You should pass the judgement onto someone else. Probably user; if they get unsolicited token, that's suspicious, etc.

TON Bounty Bridge: ​TON Guide for newbies  🏷 Education  Summary:This guide provides essential information and resources on the following topics:  Created by koodl

Valentin: How do I call the get_jetton_data method of a jetton? I need to get the function signature

Valentin: await this.client.runMethod(         parsedJettonAddress,         'get_jetton_data',       );  I'm running this to get the jetton data for a jetton, but it returns cells as response

Tiqan: how to do large sandbox tests without storage overflow? any ideas?

&rey: Do you remember that actual blockchain also has contract size limits? (reply to 117625)

Tiqan: its not about contract size (reply to 117629)

Tiqan: I run over a million tests

Tiqan: And the blockchain gets stored in memory

Tiqan: and with > 1.000.000 tx's it overflows (reply to 117632)

&rey: Then run several test functions, or re-create blockchain each thousand/... tests. (reply to 117632)

Tiqan: i cant. i need all in one

&rey: Well, you need to store everything in memory and memory not to overflow, have I understood correctly? (reply to 117636)

Tiqan: Basically yes. Is it possible to save blockchain state in between to drive and continue with that or something like that?

Tiqan: Maybe the only chance is to setup local blockchain and test it with that...

&rey: Probably you can pull state of each contract. (reply to 117639)

Mehrdad: Is there a way to run a custom testnet node behind a NAT using Docker Compose? I've looked at some GitHub projects but haven't found a solution that meets my needs.

— 2024-10-23 —

Haint: can't you just use the TupleReader and read the items sequentially in the order that you put them in the get method? (reply to 117486)

Mithra: Hey, guys, is there a good document for connecting TON wallets, for examle, TonKeeper via WalletConect?

Snow Lee: TonKeeper is its own separate wallet, so no (reply to 117695)

Jacob: how to convert int to varint in func smart contract ?

Jacob: I know,  use store_coins (reply to 117699)

Jacob: ;;; Store amounts of TonCoins to the builder as VarUInteger 16 builder store_grams(builder b, int x) asm "STGRAMS"; builder store_coins(builder b, int x) asm "STGRAMS";

TKAINU: hello, i using dict to save key-value. when i get dict, i receive error: cell underflow please help me

Hui: Can anyone help me figure out why the cell data generated by ton4j in Java is different from the cell data generated by @ton/core in TS?  The content of jetton includes name, symbol, description, image

Hui: public static Cell buildOnChainMetadata(String name, String symbol, String image, String description) {   TonHashMapE x = new TonHashMapE(256);   x.elements.put(new BigInteger(Utils.sha256("name"), 16), CellBuilder.beginCell().storeUint(SNAKE_DATA_PREFIX, 8).storeSnakeString(name).endCell());   x.elements.put(new BigInteger(Utils.sha256("symbol"), 16), CellBuilder.beginCell().storeUint(SNAKE_DATA_PREFIX, 8).storeSnakeString(symbol).endCell());   x.elements.put(new BigInteger(Utils.sha256("description"), 16), CellBuilder.beginCell().storeUint(SNAKE_DATA_PREFIX, 8).storeSnakeString(description).endCell());   x.elements.put(new BigInteger(Utils.sha256("image"), 16), CellBuilder.beginCell().storeUint(SNAKE_DATA_PREFIX, 8).storeSnakeString(image).endCell());    Cell cellDict = x.serialize(       k -> CellBuilder.beginCell().storeUint((BigInteger) k, 256).endCell().getBits(),       v -> CellBuilder.beginCell().storeDict((Cell) v).endCell()   );   return CellBuilder.beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(cellDict).endCell(); }  and  ts  export function buildOnchainMetadata(data: { name: string; description: string; image: string; symbol:string }): Cell {     let dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());      // Store the on-chain metadata in the dictionary     Object.entries(data).forEach(([key, value]) => {         console.log(toKey(key));         console.log(makeSnakeCell(Buffer.from(value, "utf8")));         dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")));     });      return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell(); }

Nguyễn: Someone can give me document for learning FunC like solidity.example, I have read FunC tutorial in TOn official docs but it isn't work for me

Nguyễn: Should learn Fun-C or Tact language ?

Nguyễn: please, let me know, I am new programmer in Ton blockchain

&rey: You should learn TON architecture; then, either option is fine (FunC is cheaper in terms of fees). (reply to 117736)

Nguyễn: tks u

Kunal: Hi, I transferred Ton using https://bridge.ton.org/ yesterday. It has been more than 20 hrs, I haven't yet received the tokens to my ton wallet. Anyone else also facing similar issue recently? Any suggestions on what should I do. I have reached out to support already, but no reply yet from them.

crypto expert: yes (reply to 117733)

Jan: Hi, I would like to ask what is the process of getting listed on the TON talent page?

Ayush: anyone got testnet usdt, i need 3 usdt. it is urgent

Snow Lee: there's like a billion different USDT Testnet address (reply to 117753)

Ayush: i want this  https://testnet.tonviewer.com/kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy/jetton/kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy

Saswata: Hey guys I'm new to ton but I'm pretty familiar with EVM ecosystem. I had some question: 1. Is there any ways to fetch events/message of a single transaction in TON using RPC?? 2. Can I get/listen to smart contract logs using RPC/WSS maybe??

Umar: hi i have face some issue when i use 'npm create ton@latest' command then this is a error npm create ton@latest

Umar: Build script running, compiling StakingContract ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function     at resolveFunctionDescriptor  this error

Islom: Hello everyone,  I've developed an SDK for working with TonAPI with Java support. If you're interested, you can check it out here: https://github.com/h6x0r/tonapi4j.  Additionally, I've created a disassembler for interacting with the blockchain itself, also with Java support. You can find it here: https://github.com/h6x0r/ton-disassembler4j.  #java #sdk #tonapi #h6x0r #ton #blockchain

&rey: Old JS/TS, presumably (reply to 117784)

ダーリン: update node version to 22 (reply to 117784)

ANKUSH: Guys, any update on this ? (reply to 117741)

ANKUSH: 20k usd worth ton stuck

ANKUSH: Any insight would be helpful 🙏

&rey: Please note that anyone DMing you is presumably a scam; people affiliated with TF generally don't DM first, I do not either.  Please contact @ton_help_bot. (reply to 117811)

ANKUSH: Thanks for the tip...

Umar: Thanks buddy it's working 😍 (reply to 117806)

Denis: Whats cool. We can make link on your SDK on tonapi.io (reply to 117799)

Denis: And about your disassembler: can you explain is it convert BoC to fift asm or fift asm to funC ?

Pascal: Admin 🧑‍💼 is here? :)

&rey: Admins are here. (reply to 117841)

Mikhail: Hi. Can anyone explain an issue with the CATS jetton transfer from an uninitialized wallet? A few other jettons work fine, but CATS doesn't.  "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction D37AFD7C4B953526145770F1BB5D523648D7519F0068C137283A480F51AEA0ED:\nexitcode=0, steps=0, gas_used=0"

&rey: What invokes a jetton transfer — dApp TON-connected to user's app? (reply to 117847)

Mikhail: Simple POST request to _https://toncenter.com/api/v2/sendBocReturnHash (reply to 117848)

&rey: Does the sender wallet have TON? Does the message sent contain StateInit? (reply to 117850)

Mikhail: I sent 0.1 TON to the wallet for transfer fee https://tonscan.org/address/UQCtKBudKHT-X0sdHYpu0H0T99EOxV-c8j6pEnhf5Rv47CSw  I'm using Tonweb to generate message body, it's hasn't StateInit param

Denis: Don't use tonweb. Use ton/ton and ton/core

Mikko: For Jettons, what is a way to have a dynamic balance for an account similar to Aave aTokens? I would appreciate any Tact/funC reference code if exists.

&rey: *@ton/ton and @ton/core. (reply to 117854)

Mikhail: Perfect solution, thx guys 😄

Uncharted: not a developer but am trying to build something from scractch so please forgive the kind of questions i might ask i really hope to get sufficient help from you all  First how do i get actual function selector for swapping assets from Ston. fi

&rey: First you should abandon Ethereum's notions of "function call", "token contract", etc.  TON contracts do not support pulling any assets from another contract, so you must send tokens to <some contract from ston-fi, I don't remember which>. (reply to 117880)

Uncharted: ohh.. (reply to 117881)

Jzuss ┌( ಠ_ಠ)┘: Hello everyone! Where can I read about working with external out messages? It is necessary for a layer-2 solution

Andreas: I am trying to switch my ios tonkeeper to testnet. It seems I can enable the dev mode switch, but I am unable to switch to testnet. There is a button to import a testnet wallet, but it doesn't seem to do anything at this point.

Andreas: So my deploy transactions are charging ton on mainnet and then fail to deploy.

Andreas: I asked in the TON Community channel and I am now getting a bunch of people trying to "help", hmmm.

&rey: you shouldn't reuse same mnemonic, as signatures are valid across both networks (there is no fundamental difference between testnet and mainnet which would prevent that) (reply to 117917)

Andreas: The problem is more functional. The click of the button just closes the window, but doesn't ask for a mnemonic or switch to testnet 😞

&rey: I'd suggest contacting Tonkeeper support (presumably there are contacts on their site) or using another wallet application. Or using @ton/sandbox for initial testing.

Andreas: ok makes sense. Is there a faucet for testnet?

&rey: There is, https://t.me/testgiver_ton_bot, and sometimes it even works. (reply to 117924)

Andreas: Thanks

— 2024-10-24 —

EVMlord: Is there any equivalent to signing "messages" without gas on TON, to get a signature that can be verified. (reply to 117881)

Dino Tycoon: hi all, my app keeps getting rejected due to "not working as intended", can anyone help?

スパイシーな手羽先: Hey TON Devs. Just wondering if there is a Grants Manager or similar representative that I'll be able to get into contact with regarding a few enquiries.  Thanks Spicy

Hitesh: Hello everyone,  I'm currently developing an explorer and have a couple of questions:  - Are there any APIs or data sources available to retrieve Ton miniapp data? - How can I access data related to miniapp transactions and rewards?  Any guidance or resources would be greatly appreciated!

Hosseini: Hi

Hosseini: How can I connect my website to Tonkeeper and sell my products with Ton?

&rey: 1st isn't needed at all for 2nd. (reply to 117982)

パトリック: Hi, please i need credentials to download archive node dump - mainnet. I'ld appreciate if anyone can help. Thank you!

Denis: Wallets have should have different subwallet_id in different network. For wallet v3/v4 nobody follow this rule. But in v5 tonkeeper uses different subwallet IDs (reply to 117920)

G: Hello TON devs :).   @shawnOD from the TON minter group forwarded me here because of my inquiry.   Im searching to create a Token for my project.   It will be a complex one with Reflection tax, max wallet limit, multiple taxes for the marketing and development teams, maybe some buybacks in future and other small features.  I like TON but my researches for creating the Token on your chain led me to nowhere..   Is it possible to create Opinion.Network Token on TON??

User<7693639737>: Yes it is possible. (reply to 118012)

Роман️: Yes (reply to 118012)

sunyoki: where is the complete opcode

&rey: I believe it would be better not to create it, since all of custom functionality is to net loss for users. (reply to 118012)

G: Searching for creation platform. No time developing from scratch… (reply to 118013)

G: Why, because of taxes? (reply to 118018)

G: I intend to build a new social network. And I think real projects like mine should implement taxes to support marketing, devs and growth.

User<7693639737>: ill dm you (reply to 118020)

Haint: just learn jetton first. Then create a custom implementation based on it. (reply to 118023)

Haint: Those functionalities are all doable. But it'll take more efforts on TON, you need to structure the code well.

G: Thanks for the advice!

Nix: What is mnemonic password and how to add mnemonic with password to wallet such as Tonkeeper or MyTonWallet?

Mikhail: I found stateinit param. Should I put wallet contract initial code and data type code here? (reply to 117852)

Hamit: What address do we use for jetton burning?

&rey: We don't use transfer to burn jettons. Rather, we use their builtin burn functionality if possible. (reply to 118049)

Thundra: I am looking for a TON network blockchain developer, if anyone is interesting, dm me

Thundra: cuz i have client who wants to develop ton project

Tornike: I need your advice and help on my react app

Tornike: I want to know how can I connect myself to Ton wallet in my telegram mini app if I already connected it on my phone but entered app with desktop app and want automatic connection on Ton wallet

&rey: More throughput, and more secure contracts given the same knowledge level of developer. (reply to 118085)

&rey: It isn't a good idea, but you can transfer localStorage variables between the two using your backend. Remember to E2EE them with user-provided password so that server leaks do not allow anyone to get inside the session. (reply to 118072)

vk: What do you mean? (reply to 118087)

&rey: 1. Even if all users want to interact with your contract, fees will not become higher, and no transactions will be dropped. For certain architectures, all transaction trees will be processed quite fast. (reply to 118089)

Tornike: Thanks for your response. Can you specify where should I find docs for that, I mean methods or functions which gives me ability to do that (reply to 118088)

&rey: Please consult browser and JS docs, as that functionality is not provided by TC2 SDK. (reply to 118091)

&rey: It's not like TON can influence Telegram in any way either. They are distinct, after all! (reply to 118092)

&rey: Off topic for this chat, actually.

S: who can teach me how to activate tonkeeper wallet account?

S: I created an account, sent tons to it, but it's in the "uninit" status. why?

MRT: After first transfer from your account (reply to 118108)

S: aha, thank you very much

Michal | LI.FI: Hey what bridges do you know guys for TON. I think about any asset not only TON?

Pibu: hey everyone. I am using tonaccess in my app but I get a lot of 503 and 504 errors, sometimes it works and other times I just get several consecutive 50x errors...

Pibu: ...and I'm wondering if it's me and the way I call the endpoints or is it just how it works? (reply to 118167)

Pibu: it was me, I had two instances of my app running and shutting one down allowed the other to work well (reply to 118168)

Pibu: also another question, is there some library or utility that would allow me to spin up a local tvm so that I could check if my tx will succeed? something similar to how ethers dryRun works?

— 2024-10-25 —

Hitesh: Anyone can help here? (reply to 117974)

Samyar: Hi, i'm trying to implement Ton Proof based on this example in the docs:   https://github.com/liketurbo/demo-dapp-backend-js   When i try to connect integrated telegram wallet i get: unsupported wallet version

Jacob: invalid action 0 found while preprocessing action list: error code 34 how to debug the format of the ouput action?

Jacob: var msg = begin_cell()   .store_uint(0, 1) ;; tag         .store_uint(1, 1) ;; ihr_disabled         .store_uint(1, 1) ;; allow bounces         .store_uint(0, 1) ;; not bounced itself         .store_slice(my_address())  ;; src         .store_slice(_token_account) ;; dst         .store_coins(total_ton_fee)  ;; value         ;;.store_uint(0, 1) ;;         .store_coins(0) ;; ihr_fee         .store_coins(total_ton_fee) ;; fwd_fee         .store_uint(cur_lt(), 64) ;; lt of transaction         .store_uint(now(), 32) ;; unixtime of transaction         .store_uint(0,  1) ;; no init-field flag (Maybe)         ;;.store_uint(1,  1) ;;         .store_uint(0,  1) ;;         ;;.store_ref(mint_request);         .store_slice(begin_cell().end_cell().begin_parse())  .end_cell();

Michael: gm everyone - we’re building a game ecosystem (GOAT Gaming) and need help with a new TG miniapp for our upcoming token launch. Which are some top tier TON-focused dev shops that could support us for a month?

Haint: your message structure is invalid  https://docs.ton.org/develop/smart-contracts/messages (reply to 118225)

&rey: @ton/sandbox IIRC; Blockchain class has options to make it a reflection of real chain. (reply to 118182)

Wills: Could someone please tell me how I can decode boc?  it looks like:      "boc":"te6ccgEBBAEAtwABRYgBvVXMoxQj+kmDtTinWnFdumvpTNo33p48YQKOWyTtUkAMAQGcMZ6id5dkoDZImQ4UC5SqZSN04h/xNpKaEsESJQivKW01aMcWW4qeUUjKm/iZ2nszwBj3uFVcsIr9xFomQvY3DCmpoxdkQjldAAAAcAADAgFkQgAoPvU+sDeRbPQrPGn3bxzd8JnUNGlQcfA/qoFluFxSiRE4gAAAAAAAAAAAAAAAAAEDABIAAAAAaGVsbG8="  it says, "boc" parameter is a serialized instance of a tlb.Message  i code in node.js

Wills: i want to monitor the transactions in mempool their in_msg/payload and other information

Nhat Nguyen: i have account ton have jetton how to check balance jetton in account using ton/ton?

Marat: What is the best way to validate that user uses telegram to access my TMA? Should i validate it before each backend operation or just completely block access to my mini app?

Nguyễn: Someone can explain for me what is different between cell in_msg_full, slice in_msg_body in function "() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure"

Haint: const cell = Cell.fromBase64(boc);  then read from it how you want (reply to 118239)

Wills: thank you for responding 🙏 i did that and the method returns this:  x{8801BD55CCA31423FA4983B538A75A715DBA6BE94CDA37DE9E3C61028E5B24ED52400C_}  x{319EA2779764A03648990E140B94AA652374E21FF136929A12C1122508AF296D3568C7165B8A9E5148CA9BF899DA7B33C018F7B8555CB08AFDC45A2642F6370C29A9A3176442395D000000700003}   x{4200283EF53EB037916CF42B3C69F76F1CDDF099D434695071F03FAA8165B85C528911388000000000000000000000000001}    x{0000000068656C6C6F} Please, how can I decode it further? 🙏 I need tx_hash, body/ payload etc (reply to 118252)

&rey: there will be no transaction hash, since TC2 doesn't wait for transaction to appear (reply to 118256)

Ho: have a method auto send ton to another wallet by tonweb or another service

Nabeel: So how is the recurring  payments ux for stars subscription

Nabeel: like if i have 5 stars and a tg channel have 5 stars for a month

Nabeel: then what happens when i dont have enough to pay for the second motnh will i get kicked out

Nabeel: and what is the ux, is it auto deducting for later months

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: Hi can anyone help me, how to make request to user to create transaction, I mean, user connect wallet then he tap in button "Create Transaction" and it redirect it to his wallet, then he need to send for example some amount of ton

Артём: Hello everyone ! Can you pls share examples how to generate merkle proof in python?

𝙼𝚁 𝙷𝙰𝙼𝙸𝙳 Dev: Hello, I use ton API, when the user connects to Volt, I want an automatic transaction to be made and the user deposits some ton from his account to my account. I want the process to be automatic.  Where is the educational payment page on this site?

Joe: Hi. Is it possible to simulate transaction on ton at the specific block using api/rpc? I see that get methods run through simulation, but is it possible to check that on external message?

&rey: Transactions without user authorization are not possible. Asking for ways to implement them in any other fashion will lead to permanent ban. (reply to 118288)

Joe: I also see such option: https://tonapi.io/api-v2#operations-Emulation-emulateMessageToTrace. However, doesn't seem like block can be passed in there (reply to 118289)

Frankie: Hi, we are using signature to verify data call from user, we have set an expire period in this signature (expire in 5 minutes) to prevent user reuse this signature. But In 5 minute while the signature isn't expire, they still can use this signature again. is there any other ways to make  sure the signature is only used once? In EVM we can store the hash of used signature to check, but TON is new for us

Luis: Do you know if there is anyway to increase this? (reply to 116398)

&rey: No, only a consensus of validators can change that. (reply to 118296)

Cube: You can use nonce at your contract that will be increased after each contract call (reply to 118294)

Павел: If here are admins from Ton Dev Chat (RU), unban me please... I was just making a bad joke... I'm sorry

Nerses: I use @ton/ton  to check wallet state with this code const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });   if (!await client.isContractDeployed(wallet.address)) {     return console.log("Wallet is not deployed");   }   I get the error although i check in block explorer the wallet is in active state. Here is the address 0QBWRYE3_suXo4Ihtii5ZP4KTgY8bJ5ZRgCvxi5LqpJ7UO_H . what can cause this ?

Islom: Hey guys,  Downgraded Java version from 17 to 8. https://github.com/h6x0r/ton-disassembler4j  Downgraded Java version from 17 to 8, fixed bugs related to websocket connection subscription methods. Java SDK for TON API https://github.com/h6x0r/tonapi4j

&rey: Have you remembered to use testnet TON endpoint? Testnet and mainnet are different networks with different RPC URLs. (reply to 118317)

Nerses: yeah. the strange is when i use other testnet wallet the problem doesnt occur

&rey: You couldn't have obtained that address from wallet.address.toString(). (reply to 118317)

&rey: Wallet you're sending is v5r1, and you're attempting to access wallet with (same?) keypair but v4r2.

Nerses: I use this code   const endpoint = await getHttpEndpoint({ network: "testnet" });   const client = new TonClient({ endpoint });    const mnemonic =    const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });   if (!await client.isContractDeployed(wallet.address)) {     return console.log("Wallet is not deployed");   }   So i know mnemonic of my wallet thats why I could specify address (reply to 118321)

Nerses: does TonClient supports wallets of that version ? (reply to 118322)

&rey: Yes, it supports any smart contracts. However, wallet doesn't represent that wallet you have. (reply to 118324)

Nerses: Thanks a lot. Solved (reply to 118325)

Alver: Hello, this might be a novice question but, can somebody tell me the link about type casting? int <-> slice (string), etc

⚡️ Ἑρμῆς (Hermes): Why could I have 0 transactions in here? I get an empty array, when same call on other test works just fine  const deactivationResult = await nftItem.send(             alice.getSender(),             {                 value: toNano('10'),             },             transferMsg,         );         console.log(deactivationResult.transactions);

&rey: Not possible. Why would you do that, actually? (reply to 118329)

Alver: Theres a random number i am generating and want to send that number as a message  int random_number = 2; cell msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(sender_address)     .store_coins(0)     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_uint(0, 32)     .store_uint(random_number, 32) .end_cell(); send_raw_message(msg, 1); (reply to 118348)

&rey: You need to convert it to bytes (ASCII chars) digit-by-digit and store those digits into message, starting with the most significant. (reply to 118349)

Alver: Thank, i will check (reply to 118350)

𝙼𝚁 𝙷𝙰𝙼𝙸𝙳 Dev: The user comes and makes a purchase with his own request (reply to 118290)

&rey: Oh. You don't need anything specific on frontend; the main task is in backend then, to get the incoming transactions and match them to clients. (reply to 118358)

𝙼𝚁 𝙷𝙰𝙼𝙸𝙳 Dev: I want exactly the same documentary (reply to 118359)

حسين عباس لفته: hello

حسين عباس لفته: i just want to ask does the ton miner on the telegram really work

&rey: I haven't heard of legit service by that name. (reply to 118372)

حسين عباس لفته: the bot on the telegram

&rey: Most probably scam. (reply to 118375)

حسين عباس لفته: oh okey but where do i get it (reply to 118376)

حسين عباس لفته: i just want to know how to get ton i need just 5

&rey: Without charge? In testnet only. (reply to 118378)

حسين عباس لفته: what is that (reply to 118379)

&rey: It isn't a good idea to interact with systems not knowing their details.  Testnet is an instance of TON Blockchain where TON are considered worthless, and given via @testgiver_ton_bot. It may reset arbitrarily. (reply to 118380)

— 2024-10-26 —

Deny: Hello, Why all address on explorer start with EQ?

Joshua: /stat

FakeName: Is there any NFT-Fi available in TON ?  Where i can stake my NFT or borrow loans on my NFT ?

&rey: Depends on specific collection. Almost none are considered by such projects to be worth anything. (reply to 118456)

FakeName: okay!  What about if I'm building a Social Trading Platform!   is there any mini-apps available ? Does people use it ? (reply to 118457)

Inayat: Hi Guys,could Someone Help me to get Transaction hash after  const response = await tonConnectUI.sendTransaction(amount); I tried   const bocCellBytes = await TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(response.boc)).hash();  const hashBase64 = TonWeb.utils.bytesToBase64(bocCellBytes);  console.log(hashBase64);  but its gving       at ./node_modules/@ledgerhq/devices/lib/hid-framing.js (hid-framing.js:15:1)     at options.factory (react refresh:6:1)     at __webpack_require__ (bootstrap:24:1)     at fn (hot module replacement:62:1)     at ./node_modules/@ledgerhq/hw-transport-webusb/lib-es/TransportWebUSB.js (TransportWebHID.js:183:1)     at options.factory (react refresh:6:1)     at __webpack_require__ (bootstrap:24:1)     at fn (hot module replacement:62:1)     at ./node_modules/tonweb/src/index.js (index.js:25:1)     at options.factory (react refresh:6:1) which is not going away by any way. please help someone

ROMAN: Any one know how to verify contact address

FakeName: I’m thinking of building a Copy Trading platform within TON mini apps. The idea is to let users follow and automatically replicate trades of top traders, with features like leaderboards, real-time trade mirroring, and performance analytics, all backed by TON’s security and transparency. Does this sound feasible within TON mini apps? Any advice on handling trade replication, user management, or potential challenges with TON?

Leo: that has fund security issue as 'top traders' can easily sandwich followers and make profit from their loss

Mehmet Ali: My TON space wallet has this warning for the jetton we created. How to solve this?

MoonBear: Hello, can any administrator help me? Thank you!  I have two wallets with Normie’s badge. Can I use both or just one with my mobile phone?

Inayat: any help?? (reply to 118463)

&rey: Well that is true. (reply to 118472)

Mehmet Ali: Yes, how to provide correct and legit info to the TON wallet then? (reply to 118475)

User<7194649004>: Any admin here

User<7194649004>: Buddy i created token but tonkeeper showing scam why @pcrafter (reply to 118475)

&rey: All of Tonapi (re Tonkeeper), TON Space, TON Society (re NFT badges) are specific services, which we cannot change. In my experience, they weren't so overwhelmingly important so that I'd know how to work with them.

&rey: @Moonbear01 @Chiefhoppersol hereby, you have moderator warnings. You should've read the latest chat message where I said that I do not know how to work with those specific services. Please also don't ping people arbitrarily or reask too often.

Nick: If you mean just to check if it's valid then you can get an api call for wallet info endpoint in ton api. If you're using toweb or other lib, guess you can just create an address class instance and it'll say if it's valid (reply to 118467)

EVMlord: Use nonce, cur-seqno (reply to 118294)

Max | TonMap: Hey guys! Anyone knows about sdk for Unity? Getting webapp, payment and other.

User<6443554540>: yes, what's the problem? (reply to 118560)

Ilya: Hey, do u guys know how to install toncli on Mac m3?

Max | TonMap: No problem. I want to create TMA with my unity game. But can’t found sdk for it. (reply to 118566)

User<6443554540>: how about the tonapi? (reply to 118596)

Den: Yes

Nick: I googled and found this one https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started  but I'm not sure if what's your requirements. From what I can see it should be enough just to use tonweb (for js) or .net ton libs if you just need to send transactions. Or just pure tonapi as mentioned above (reply to 118596)

Max | TonMap: Thanks Nick! (reply to 118603)

Иван: Hi, everybody Please help me with sending nft, I want to send nf and I send 0.05 tons for shipment, but sometimes 0.046 is returned to me, and sometimes 0.017. Despite the fact that they may be from the same collection, but most return 0.017 and some, as needed, 0.046. I do not understand the reasons at all, I will be very grateful if you help

— 2024-10-27 —

Thanh Phong: Hi

Thanh Phong: Hi everyone

pursue: Can anyone resolve it? npm run build, Error

peacyy: Good afternoon!!!  We are looking for talented developers who have extensive experience with FunC and Fift to write fault-tolerant and scalable smart contracts.  We would be happy to see you in our team and build a long-term working relationship.

Nguyễn: Someone can tell me the common way to debug in FunC , I have search in the internet and got a result :

Aleks: Hey all. What’s the easiest way to identify the version of a wallet? Any standardized get method on wallets we can call to get the version or do we have to compared the hashed code to known wallets code? What nodejs sdk provider a way to do this?

&rey: You should compare code, because versions are universally adopted postfactum. (E.g. my wallet-inplug-v2 could've been the wallet-v5.) (reply to 118691)

Aleks: Thanks!  What about /getWalletInformation from Toncenter V2.  It gives a string like so: wallet_type: 'wallet v5 r1’  Not reliable? (reply to 118692)

&rey: It is based on code hash comparison as well, just that Toncenter internally translates it according to their knowledge. Those labels are not standard, so you shouldn't base app logic on them. (reply to 118693)

Aleks: Gotcha. Thanks a bunch! (reply to 118695)

&rey: However, I don't understand what you're trying to do. Presumably you want to validate that wallet supports "gasless" payments? (reply to 118696)

Aleks: I simply want to have users pay for contract interactions. For example we are minting Sbts and in our logic the Sender is our wallet. So we pay the gas fees ourselves. We want to offload that payment to the users. Maybe there is a more straghtforward way to do this (reply to 118697)

&rey: You need to rework collection so that users are minting items (with permit expressed in form of signature from your backend), and request user to mint via either TC2 or even simple https://app.tonkeeper.com/transfer links. (reply to 118698)

Aleks: Right I see. We deploy single Item sbts, so not attached to any collection. (reply to 118699)

&rey: Even easier then. wait, but how should others verify that a given SBT is deployed from your service? (reply to 118700)

Aleks: So we have to build a transaction and simply wire it to them so that they can sign it? (reply to 118701)

&rey: Yes. Usually both of those steps are done at frontend. (reply to 118702)

Aleks: Ah right. So with UI. It’s happening in the backend for us.. FE only does the wallet connection (reply to 118702)

Aleks: Should be doable in the BE as well I suppose… just have to figure out how to pass a tx back to the UI for the users to sign (reply to 118706)

Евгений: Hi guys. I can successfully connect tonkeeper but with tg wallet - getting error related to manifest file. Is there any specific requirement for TG wallet manifest content?

Zqy: Hello (reply to 118673)

Self Empire: Hello today I can visit our website and withdraw toncoin but unfortunately my wallet balance was deducted

Self Empire: Please revert me any Admin

Self Empire: I have suffered a loss of Rs. 62 on your website, when I went to claim it you made my funds disappear

Self Empire: 62 usdt

Self Empire: Kindly reverse my payment

&rey: Presumably you have visited some unofficial site and confirmed the transaction of loss. Transactions in TON are not reversible.  Please note the official site of TON is https://ton.org (no "tg" or anything like that; Telegram and TON are even very separate entities!). (reply to 118725)

Tom: Hey guys, do you suggest any method to detect different versions of Jettons? The one in the official repository and the one from stable contract. They have different assumption of gas fee. One requires much more than the other. Any way to detect rather than simulation of transactions to see which one fails?

&rey: Unfortunately there's no way to do so. Though, with modified TVM (re: symbolic execution) you can find out fee in one run. (reply to 118730)

Tom: Thanks for the hint. (reply to 118732)

TON Bounty Bridge: ​Funding Education and DeFi Empowerment in Brazil with TON  🏷 Education  Created by danimim

Tom: Should be more complicated than needed so the “easy” way I think could be sticking with a higher assumption of gas usage and build a whitelist for lower gas jettons. The simulation is costly tho so we couldnt try to simulate in runtime. (reply to 118732)

Anoxy (Wally.id) 😎 ❤️ 😎: Hello everyone, I am creating an telegram mini app with different games, where I store the users score as well to show the high score .  I am using JavaScript in front end and php in the backend.  Now to the question, when a user plays a game, I am saving the score to the database. But what about verifying the score before saving it to the database ?  Any ideas and feedback is highly appreciated.  Regards

Anoxy (Wally.id) 😎 ❤️ 😎: I saw this, https://core.telegram.org/method/messages.setGameScore  Can someone give me an example ? (reply to 118739)

api: 1. you can imagine what new score is impossible, take for this situation current score and penalties from it  2. You can send not only score, but also some metrics and recalculate  3. You can encrypt your js code and send data to server with encryption and decrypt on server (reply to 118739)

&rey: 3) won't help.  Also, I observe that those questions are about general programming, not TON-related. (reply to 118743)

Mehmet Ali: Need a guideline and some examples on TON for governance. We have a jetton and want to maintain some governance/voting functions with that.

Mehdi: Hey guys, how to generate wallet w5 address in dotnet? the Ton.Sdk has not greater than v4r2 version?

Mehdi: https://github.com/continuation-team/TonSdk.NET/issues/100

Anoxy (Wally.id) 😎 ❤️ 😎: Is there any group related for general coding for telegram mini apps? (reply to 118744)

Anoxy (Wally.id) 😎 ❤️ 😎: Interesting, if you find anything pls let me know.  May I ask what you develop? (reply to 118748)

&rey: There is, @devs. (reply to 118755)

Anoxy (Wally.id) 😎 ❤️ 😎: Saw that,  thanks  🙏 (reply to 118757)

Mehmet Ali: Have an association, want to implement and maintain some governance functions on a jetton created on TON. (reply to 118756)

Mehdi: What is the serialized WalletSource of version 5?  https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md

Yoki | StakeKit: Hey guys! We are working on adding support for TON staking. We were planning to do a few tests of our integration on testnet first, which would require quite a lot of testnet tokens. Is there maybe a way to quickly get access to a couple hundred tokens? Will take quite a while getting the needed amount from the faucet

api: Just mint tokens (reply to 118816)

Dmitry: You need tokens or TON? (reply to 118816)

Yoki | StakeKit: Would need TON.. don't believe that can be minted, right?

Dmitry: Yeah, lot of TON would be a problem

Dmitry: Maybe you can buy some though

Yoki | StakeKit: Yeah, would need at least like a 100 more TON.

Dmitry: I saw in this chat that you can buy test ton in Ton Console

Dmitry: But didn’t tried it myself

Yoki | StakeKit: Hmm, thanks for the suggestion - will take a look 🙂

Dmitry: tonapi.io

— 2024-10-28 —

battle: I am a highly skilled Ton dev with extensive experience in TON chain development, specializing in smart contracts, NFTs and tg bots, tg mini-app development (e.g. tap games). In general, infinite data structures that can scale to billions of elements are very difficult to implement on blockchains. However, TON chain makes it possible by splitting data across multiple smart contracts. That's why I am interested in TON chain and familiar with Func and tact languages ​​for developing smart contracts. On the front-end side, I have skillfully implemented the integration of smart contracts and front-end using Ton Connect SDK. Looking forward to the opportunity to work with you.

David: Hi guys, is there a way to check onchain if a contract is already deployed on certain address? like if .code is empty?

Leo: No, contracts can only access its own state during execution

Nick: You could check the address state by api and check if it's active (reply to 118879)

gon: Hi, Does the blockchain network support sign messages for ton wallet?

gon: I want to implement code to sign message with simple content(hello world).

ダーリン: yes, use sign in @ton/crypto lib for JS (reply to 118887)

Frankie: https://answers.ton.org/question/1516485184633966592/how-do-i-sign-and-verify-a-message-on-my-local-machine  https://docs.ton.org/develop/dapps/ton-connect/sign  https://docs.ton.org/develop/func/stdlib#signature-checks  you can refer these links (reply to 118887)

gon: Thanks for your support! (reply to 118890)

Isabel: /stat@combot

Matthew: hi all, i want store dict with key  is address same as:         (slice sender_data, int found?) = pre_price_dict.dict_get?(267, sender_address);  in typescript how i convert address to bigint?

Matthew:     let prePriceMap = new Map<bigint, string>()     prePriceMap.set(BigInt("0x" + Address.parse("xxx").hash.toString("hex")), "0.01");     let dictPrePriceCell = beginCell();     serializeDict(prePriceMap, 267, (src, cell) => {         if(src){             console.log(src);             cell.storeCoins(toNano(src));         }     }, dictPrePriceCell);  is correct?

gon: Uncaught (in promise) ReferenceError: Buffer is not defined. I get some error (reply to 118889)

ダーリン: you are trying to run it on node backend or frontend? (reply to 118901)

gon: I run it on frontend application

ダーリン: you need to download node polyfils

ダーリン: React?

gon: yes, i build my dapp with react + vite

gon: Thanks you, it works! (reply to 118906)

gon: Hi, can i get secretKey of my wallet? I using @tonconnect/ui-react lib in frontend app. (reply to 118906)

ダーリン: no, you can't (reply to 118918)

User<6812238814>: Hi, how i can check updates/changelog of ton network?

sh: Hi, everyone, I have a quick question, is there an official link to the TON Explorer?

ダーリン: tonviewer.com

sh: thx!!, it's not tonscanorg? (reply to 118930)

ダーリン: tonscan also a good choice, but i prefer tonviewer over it

sh: thank you response. (reply to 118932)

gon: So, I need a backend to sign messages right? I just want to sign message via frontend app with ton wallet adapter. It's similar to ethereum side. (reply to 118919)

ダーリン: for what u need to sign message? if for verification u should check ton-proof in ton docs (reply to 118940)

gon: I need to sign the message to create a new wallet address (based on the signature). The signature needs to be unique, restoreable and only the owner of the telegram can create it. (reply to 118941)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 57 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 47  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Kaspars: Hi, anyone aware of this update (check below)? How come there is no official release in releases? v2024.10 is missing https://github.com/ton-blockchain/ton/releases

Kaspars: From Ton status channel:  Please update your node software (see "Target versions"): update upgrade master Target versions: — mytonctrl:  e0ead70 — node eed3153  If you are not using mytonctrl, check this instruction.  This update is mandatory for validators and liteservers. Node changelog. Mytonctrl changelog.  If you have several validator nodes, please update them one by one (update, wait for synchronization, move to the next one).

Wisper: how to integrate jetton in unity

An: hi, there are code examples somewhere 1) get a private key for your wallet 2) sending a simple transaction using a private key

Champer Wu: Yes, every external message should be signed by owner or it couldn’t be executed. (reply to 118887)

Champer Wu: the signing operation was implemented by nacl and the secretkey was generated by bip39 (reply to 118887)

Champer Wu: the private key could just be got from mnemonic  import {  mnemonicToPrivateKey } from '@ton/crypto'    async funcion init(mnemonic: string) {     const mnemonicStringArray = mnemonic.split(' ')     const keyPair = await mnemonicToPrivateKey(mnemonicStringArray)       }  here is the simple code in TS (reply to 118963)

An: what about w5? (reply to 118966)

&rey: Why would there be any difference?  Also, I ask you to form thoughts in such a manner so that one can search in this chat afterwards and understand answers, whenever possible. (reply to 118967)

Root: How to get jetton‘s detail？

Smart: you can swap on DEX such as ston.fi (reply to 118976)

Smart: You can use get_jetton_data function in Jetton contract.  This is Typescript code async getJettonData(provider: ContractProvider) {         let res = await provider.get('get_jetton_data', []);         let totalSupply = res.stack.readBigNumber();         let mintable = res.stack.readBoolean();         let adminAddress = res.stack.readAddress();         let content = res.stack.readCell();         let walletCode = res.stack.readCell();         return {             totalSupply,             mintable,             adminAddress,             content,             walletCode         };     } (reply to 118972)

Akun Terhapus: Hello,  I am looking for a service provider who can create a Python script that generates multiple USDT wallets on the TON network. Additionally, I need the script to transfer USDT from these newly created wallets to a single wallet. If possible, I would also like the transfer fees to be in USDT.  Before making any payments, I would like to receive a trial version of the script to ensure it meets my requirements.  Please let me know if you have the expertise to assist with this project and provide any relevant details about your services.  dm me @MrMajorExe

Root: I can't get the token's decimals when use "/api/v3/jetton/masters" and  "kQCKt2WPGX-fh0cIAz38Ljd_OKQjoZE_cqk7QrYGsNP6wfP0" as params

Roi Schtreicher: Hi all My name is Roi, and I do a project for the Land Authority of Israel. We are looking for working use-cases in the world in the field of land registry, so we can see the possibilities and maybe implement them in the context of the project.  If anyone is aware of any  I would be happy to hear about. Thanks, Roi

&rey: For whoever works using DMs: — make sure you do not pay before you get a proof that there is a working script; — make sure you do not send any working scripts before you get paid; — remember that there are lots of scam, certainly more than half of DMs.

&rey: Maintaining multiple wallets will be very expensive in fact. (reply to 118989)

Root: Do you know any json api can get this information？ (reply to 118978)

Akun Terhapus: maybe like tonkeeper the difference is this one uses cli script (reply to 118995)

Avetik: good day. is there anything wrong in this code snippet? the comment  does not append to transaction

Avetik: it is based on off docs

MARCOS: In the Telegram mini app’s TON payment gateway, purchases are going through even with testnet. What is the solution for this?

Isabel: Hola cómo esta

Микита: Hello, I need to monitor transactions directed to my contract by my clients and respond accordingly. Is there something like callbacks that could notify my server when someone transfers tokens to the contract and provide transaction details? Maybe there’s a library that could help with this

musashi: hey guys @pcrafter @andreypfau @slavafomin I'm trying to implement a mechanism to randomly choose an user from a list of depositors to a vault of tokens. The more tokens user deposited to the vault, the more chance to become the winner.  but it's quite hard to do this because each user info is stored in separated contracts. Any idea to solve this

Max | TonMap: Hey. its a TON sdk, not  TMA sdk. right? I cant get webapp object. user object. (reply to 118603)

Nick: Oh, I confused your precious message, sure that's not TMA, sorry (reply to 119026)

Dmitry: Hello everyone. Looking for a mini app developer like Hrum🥠 to use the token

Victor: Hello, everyone! With whom can I discuss the grant proposal that I submitted?

Anthony: Check this article: https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation (reply to 119025)

Dmitry: Hey, I wrote an article on how to use ECDSA signatures on TON. Might be useful if you want to leverage existing EVM tech for TON. Check it out https://x.com/dmitrybase/status/1851019026400518585

TKAINU: async internalMessage(body: Cell): Promise<void> {         try {             const seqno = await this.contract.getSeqno();             const result = await this.contract.sendTransfer({                 seqno,                 secretKey: this.keyPair.secretKey,                 messages: [                     internal({                         value: '0.005',                         to: this.contractAddress,                         body: body,                     }),                 ],                 sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,             });             console.log('Operation sent successfully.', seqno);                      } catch (error) {             console.log('Error sending message:', error);         }     }  how to get transaction hash after sendTransfer(?

musashi: my main issue is to read the state from many user contracts then we can apply the ramdom method in this docs (reply to 119039)

musashi: is this the only way is to store users info in dictionaries within a single contract instead of separate contracts?

— 2024-10-29 —

Xin Jin (NT Capital): Hi, whats the regexp to control TON wallet some starts with UQ or EQ 🙏

Haint: dictionaries in TON can only hold up to 32k entries, so depends on your user count, it might not be viable. what you should do is to have a backend server that constantly monitors the main contract for user deposits. You can perform the random on the BE as well since you have all the data, and then later upload it to the contract. (reply to 119107)

musashi: how to make the backend listen to deposit events while we don't have that 'events' on TON mate? (reply to 119118)

Haint: oh, there are multiple ways (reply to 119119)

Haint: you can certainly emulate "event" on ton

musashi: ok, even that's possible I think it's quite centralized and could be failed if my backend get trouble

TKAINU: Please help me (reply to 119088)

Haint: well, if you are sure that your user count wont exceed the dictionary caps then it is a viable option (reply to 119122)

musashi: yes I'm implement this way, just tried to figure out any optimized solution. Thanks for your advices mate (reply to 119124)

Anoop: You should check out what the folks in Wyoming are doing, and should definitely chat with @msdagnytaggart (reply to 118993)

Nick: Do you mean put custom code in the contract to send https request on contract execution? (reply to 119121)

Haint: what you said isn't even possible (reply to 119130)

Po: anyone come across a good token distribution tool that is not charging a lot? I found one (ton multisender app) but it is charging about 0.12 TON per address Thanks!

Champer Wu: nothing different w5 is contract , and it still store the same type public key in contract (reply to 118967)

Jonathan: Good morning guys I really need some large amount of ton amounts in my testnet account

Eva: dm (reply to 119152)

Frankie: Hello, we are planning to use a loop to read and check data from a dictionary and then If the value matches our condition we will replace it by another value . My questions are: 1. Is there any limitation of using loop to read and compare value from a dictionary 2. How does it cost (gas) if we only use loop to read data from dictionary before doing some action to change the value of variable in blockchain

TKAINU: How can I get transaction hash after transfer send ?

TKAINU: not working for me

TKAINU: How can I get it? (reply to 119166)

TKAINU: Where can I get the message hash from, can you help me with an example, thank you very much (reply to 119168)

TKAINU: i try but err: Error sending message: TypeError: Cannot read properties of undefined (reading 'hash') (reply to 119171)

TKAINU: my code:

Rohit: Does anyone know how to check if a wallet address holds an SBT (Soulbound Token) from TonSociety? I know it can be retrieved through the username, but I need to find it using the wallet address. If anyone knows, please share the process. Thank you so much!

Frankie: I have same problem, how can I get the message hash when call to a function of my smart contract bro? (reply to 119177)

Frankie: and should I use the createTransfer too? because the provider.internal return Void to me (reply to 119181)

Frankie: but we are sending to a contract, does it work? (reply to 119185)

Yusuf: Hey guys i am facing with a problem that i can't solve in days

Yusuf: I have created a miniapp but when i connect user's wallet in to my app user can't click anything in the interface when the user comeback from connecting the wallet

Yusuf: Are there anyone have faced with this problem before?

Yusuf: I tried to trigger tonconnectui.closemodal and closesinglemodal but it doesn't work

Frankie: so we can not get the message hash when using this way? (reply to 119187)

Martin: GM guys, can anyone explain to me what things happens in the Storage phase? I am trying to calculate the storage fee, but it seems like in the storage phase, there's 1 cell and 107 bits are added.

Frankie: so Is there any other way to get message hash when call to Smart contract? I found another way to call to SMC as the image bellow (reply to 119195)

Frankie: thank you for you support!

TKAINU: I got the inMessageHash, now which api do I need to call to get the transaction hash             const inMessageHash = "<Buffer 98 c4 36 06 2e 4b 58 e8 b5 f0 54 39 a7 64 69 18 4d 78 fd e2 55 5c be f6 25 6c 95 88 68 39 de f6>"; (reply to 119199)

𝙼𝚁 𝙷𝙰𝙼𝙸𝙳 Dev: How can we put TON Natcoin in the transaction instead of smart payment request (reply to 119164)

GrimbB: which word is wrong lol, three times my messages are erased

&rey: The one which describes intent of your project. By the way, that message is not welcome here. Please use TON Society chats. (reply to 119208)

GrimbB: Ok, it is more clear now, sorry for that. (reply to 119212)

&rey: Moderator warning for random ping.  You should check out TON Cookbook. In short, sender messages their own jetton wallet (its address depending on exact jetton — USDT/NOT/etc — and sender's address) with transfer order. (reply to 119203)

A: hi  I'm tring to send jetton with tonconnect-ui library is there an example of send jetton with tonconnect-ui?

𝙼𝚁 𝙷𝙰𝙼𝙸𝙳 Dev: Please post a TON cookbook (reply to 119214)

&rey: You can use https://toncenter.com/api/v3/transactionsByMessage?msg_hash=98c436062e4b58e8b5f05439a76469184d78fde2555cbef6256c95886839def6&limit=10&offset=0. Remember to actually send the transfer. Remember that transaction doesn't appear instantly and may be never included. (reply to 119201)

&rey: Here it is: https://docs.ton.org/develop/dapps/cookbook.  @[A] this is relevant for you as well, containing data on how to create jetton transfer order. (reply to 119218)

A: do you have an example code of send jetton with tonconnect-ui ? (reply to 119219)

Sang: hello everyone, I have a trouble when create custom_payload_api_uri on jetton metadata. Hope to explain  how to create this uri

Champer Wu: My message for responding question is also be erased 🫠🫠🫠

&rey: As part of my chat management, conversations are brought towards state where all statements are true and people understand each other.

Frankie: Hello, we are planning to use a loop to read and check data from a dictionary and then If the value matches our condition we will replace it by another value . My questions are: 1. Is there any limitation of using loop to read and compare value from a dictionary 2. How does it cost (gas) if we only use loop to read data from dictionary before doing some action to change the value of variable in blockchain

Champer Wu: does anyone know where can I find ton space open source code? I want to implement the raw sign feature by TON space. it is essential for tracing the source code about ton space

Alex: does anyone have experience doing batch jetton mints with a highload wallet ?

Xin Jin (NT Capital): I would like my Telegram Mini App to auto detect the presence of a wallet.

Xin Jin (NT Capital): if (tg && tg.initDataUnsafe) {     // Check if wallet address is detected     const walletAddress = tg.initDataUnsafe.wallet_address || null; // Adjust this if another key holds wallet data      if (walletAddress) {         alert("Wallet detected: " + walletAddress);     } else {         alert("No wallet detected.");     } } else {     alert("Telegram WebApp or initDataUnsafe not available."); }   It shows "wallet not detected"  Any help 🙏

UniMas: Qq all, someone knows something about this package - @ton-community/simple-token-wallet

Smart: /stat@combot

Grimmie: Hey guys, How can I sign message on TonKeeper wallet and verify that signature in backend? I tried to use  @tonconnect/ui-react but I think it doesn't provide message signing  cc @nogitsunesmirnova

hosermage: Hi is there a sample contract for a mini game with mint/burn mechanics

Yeed: Hello guys, I have transaction transfer token. In toncan state it is success but in tonviewer state it is failure. Please everyone help me. link in tonscan: https://testnet.tonscan.org/tx/PLNhZJQVyN9Mc7QJX4ixS7s5_rEjLlKpFyYxHFr95Tg= link in tonviewer:  https://testnet.tonviewer.com/transaction/3cb361649415c8df4c73b4095f88b14bbb39feb1232e52a91726311c5afde538

Kaspe: you mean, on TON network? (reply to 119271)

hosermage: well yes... isn't all the ton minigames with mint/burn mechanics interacting with coins on ton, or is there another way (reply to 119284)

Mehdi: https://tonviewer.com/transaction/078d1b16b8440cb53374b148721a2b33401b3bfc73df3654cb349b0b2e946953?section=trace  Why this transaction is marked with SUSPICIOUS transaction. How it will be detected?

Mehdi: How to make a similliar transaction without being Suspicious?

S: #include "imports.fc";  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     int opcode = in_msg_body~load_uint(32);          if (opcode == op::click()) {         slice ds = get_data().begin_parse();         int count = ds~load_uint(64);                  count += 1;          set_data(begin_cell().store_uint(count, 64).end_cell());          var cs = in_msg_full.begin_parse();         slice sender_addr = cs~load_msg_addr();          int excess = msg_value - gas::clicker::main;         if (excess > 0) {             send_raw_message(                 begin_cell()                     .store_uint(0x18, 6)                     .store_slice(sender_addr)                     .store_grams(excess)                     .end_cell(),                  0             );         }     }     return (); }  int get_count() method_id {   slice ds = get_data().begin_parse();   int count = ds~load_uint(64);    return count; }

S: not sure why I am getting "unable to execute get method, exit code: 9" error while running test script

S: It's a counter contract which counts contract calls

&rey: Did you set initial data cell to contain 64 bits?  Also, you've skipped reading/storing much of message flags, which leads to errors when processing the internal. Remember that cells are nothing other than bit and ref sequences (in particular, no types for contents), and all preceding data has to be read/skipped. (reply to 119304)

S: right, I needed to initially configure the cell to be 64 bit data. thanks (reply to 119306)

S: can you kindly elaborate it more in terms of message flags?

&rey: cs~load_uint(4) is missing here in between. (reply to 119303)

&rey: As for storing message: first you should determine how much balance should the counter have. 0 TON is a sensible choice if it is used often, as contracts are only frozen on -0.1 TON.

Alex: Hi guys. From the article from docs ton "how to calculate users jetton", there is a method how we can calculate jetton address offline, like this.   const jettonWalletStateInit = beginCell().store(storeStateInit({     code: JETTON_WALLET_CODE,     data: beginCell()         .storeCoins(0)         .storeAddress(USER_ADDRESS)         .storeAddress(JETTON_MASTER_ADDRESS)         .storeRef(JETTON_WALLET_CODE)         .endCell() })) .endCell(); But, also there is the next info:   Most major tokens do not have a different storage structure because they use a standard implementation of the TEP-74 standard. The exception is the new Jetton-with-governance contracts for centralized stablecoins. In these, the difference is the presence of a wallet status field and the absence of a code cell in the vault. Does anybody know how I can determine whether it " Jetton-with-governance contracts for centralized stablecoins." or not from the code perspective?

&rey: Generally, if you face such a question (handling arbitrary jettons), you should assume you know nothing about their structure except TEP-74's interface.  (In particular, you should not assume jetton master is distinct from jetton wallet; just call get-method to know.) (reply to 119324)

Alex: I don't follow. Could you elaborate more?  Right now I'm facing the problem that I cannot calculate user's jetton address because Dogs coin is seems to be of that new "jetton with governance" type (reply to 119326)

&rey: Use the option which calls get-method, it works anyway. Adjacent section in docs. (reply to 119327)

Alex: So there's no option for calculating this offline? I just like the idea when I don't need to call additional endpoints (reply to 119328)

&rey: If you use specific jetton, you can look at its source code and move it into your script, storing all cells like jetton wallet code as Cell.fromBase64('te6cck...') also. (reply to 119329)

Alex: ok, got it. Thanks a lot mate (reply to 119330)

Fic2: Hello

Fic2: Hi, I am currently facing some issue and I would like some help : I have a mnemonic phrase, that I generated with MyTonWallet, and my goal is to retrieve the corresponding public ton address. Here is why I have understood so far :  - a wallet is a smart contract, and it has an intial state  - to compute the address, we first have to derive an eddsa public key from the mnemonic  - then, we have to ˋhash` (not sure of this one) the smart contract code (in my case, my wallet is v5r1) into some ˋbyteRes` -then, ˋpubTonAddress=EQ+hash(hash(eddsa), bytesRes)`  I tried to do it, but I am not able to retrieve the correct public key  Can someone help me connect the missing dots? Is there some documentation that can be helpful for me?

&rey: The structure is similar but specifics are like all wrong: — address from hash part: https://docs.ton.org/learn/overviews/addresses#user-friendly-address — hash part: representation hash of StateInit cell: beginCell().storeUint(6, 5).storeRef(code).storeRef(data).endCell().hash() — data: depends on wallet version very much, contains public key — public key: just Ed25519, from keypair — keypair: generated using TON's algorithm (a few thousand HMAC iterations) from mnemonic  You should check out vanity-contract-s for calculations sped up and all in one place. (reply to 119349)

Fic2: Thank you !  Are you referring to this? https://github.com/ton-community/vanity-contract/tree/main (reply to 119351)

— 2024-10-30 —

Fic2: I have not succeeded doing this, I am ready to pay if someone can implement it for me.  I need a function that takes a mnemonic as input, and outputs a corresponding ton public address (reply to 119349)

MoonBear: Hello for the Degen badge it is necessary to do all the steps if we are only going to use a Trade protocol?  I’m in the Tra Door protocol and the same administrators have told me that there was no need to put the $200 of liquidity, since the Trade ones had a separate Air Dr op

Mohammed: Hi (reply to 118673)

Tech Reviver 🦁 $DCLC 🐍: Guys, is there's any Devs.

Zqy: https://github.com/ton-blockchain/ton/issues/1328#issue-2622800255

Zqy: I've noticed that many disassembly tools in the TON browser use the Disasm.fif script. However, some instructions in it are not documented in the official documentation, nor are they in the white paper, and they are not included in the Fift.fif. I can help add the meanings of these instructions to improve the documentation.

Hen | Helius: Does anyone know why my failed transactions keep retrying? It failed because of lack of Ton in the wallet, but it kept on retrying which used up all the Ton in my wallet.   Wallet: UQCTJAyahPWC_f4TId2s3Tp1wB2uyZGZCORXEPZ3CkDiyDk_

Zqy: This is the syntax comment I provided for one of the instructions." (reply to 119389)

Leo: maybe you can directly add this to fiftbase.tex and make a PR

User<5721366642>: Does anyone know how to connect these games to a Tonkeeper wallet using Python?

User<5721366642>: For example, how can we connect Hamster to Ton?

User<5721366642>: Does anyone have an example or something similar?

Tech🧑‍💻🐾: If I got you right  You have a game that you want to integrate a Ton wallet with? (reply to 119403)

User<5721366642>: I Want to connect any game like notcoin to tonkeeper by python (reply to 119404)

User<5721366642>: bridge. tonapi. io/bridge/events?client_id=4cf543762e81c4a408d96b63d3b5f9f399d556bccde815a30dc5c906&last_event_id=17283257436

User<5721366642>: There is url like this who game requested I don't know how this url created And then I don't know how can I connect tonkeeper to game via this url by python (reply to 119407)

S: hello I want to write a contract which tracks specific data for each user(msg sender address). they say using dictionary is not practical approach as storage size will grow crazy due to its immutability, instead create subcontract for each user. but at least I will need a dictionary to check if a subcontract exists for a certain user, no? Kindly let me know what I am missing.

Zqy: Can someone help me submit it? If you think it's necessary. Because my computer's configuration is too low, to the point where I can't compile or modify LaTeX. Its memory is even less than 1GB. (reply to 119389)

Zqy: So I can only modify the tex, but not the compiled pdf at the same time.

S: Simply the problem is how I know if a certain smart contract with certain address exists or not (reply to 119413)

S: so that I can decide whether to deploy a sub-contract or not

𝕠𝕩𝕥𝕙𝕣𝕠𝕨-𝕦𝕟𝕝𝕖𝕤𝕤: You could consider deploying the sub-contract regardless of whether it already exists, and then have the sub-contract send relevant information back to the main contract. (reply to 119421)

S: right, but how do I make sure if that raw message from parent contract will be sent to child contract or not at first? (reply to 119423)

𝕠𝕩𝕥𝕙𝕣𝕠𝕨-𝕦𝕟𝕝𝕖𝕤𝕤: If you successfully deploy the child contract, it can send a message to the parrent contract to confirm that the message was successfully delivered. (reply to 119424)

S: can you kindly share the sample code of deploying a child contract from parent contract? (reply to 119425)

S: Ender sir. You are awake

𝕠𝕩𝕥𝕙𝕣𝕠𝕨-𝕦𝕟𝕝𝕖𝕤𝕤: https://github.com/ton-blockchain/stablecoin-contract/blob/62f661d79012a259c0110dce611dafc31359be78/contracts/jetton-minter.fc#L37 (reply to 119426)

&rey: Yeah, any jetton, or https://tact-by-example.org/06-authenticating-children. (reply to 119426)

S: like jetton minter is parent of every jetton wallet

S: I can't find any clue that it sends message to jetton wallet in send_to_jetton_wallet function

S: I mean, generating wallet address(if not exist) and sending raw message will deploy a new subcontract of wallet?

&rey: Like that: note that message contains StateInit. (reply to 119432)

S: how do we know that message is aimed to wallet, not other contract or minter itself?

&rey: By destination address, presumably? Remember that contract address is deterministically derived from StateInit. (reply to 119434)

S: right, that's clear when that certain wallet already exists. I am referring to the case when we need to create a new wallet and send message. (reply to 119439)

&rey: Nothing changes. Address is hash of StateInit. Nothing another can be deployed at that place. (reply to 119440)

S: how do we make sure the new wallet contract will handle that first message, but not other contract? (reply to 119441)

&rey: Well,     slice to_wallet_address = calculate_jetton_wallet_address(state_init); handles that doesn't it? (reply to 119442)

&rey: (I recommend against copying any code from TON's implementation of tokens, due to absence of any license which would allow you to do so, and due to abundance of bad practices. Ideas are right, though.)

S: it only calculates(generate) address of an existing(new) wallet. which doesn't contain complicated send, receive functions etc of wallet contract. are not desired. that makes me dumb. (reply to 119443)

S: so I can't be sure it's for deploying new wallet contract

&rey: There's no difference between existing and new "sub"contracts; you still need to know their StateInit for deploy and deploy+interaction, and that allows to determine the single address contract resides at.  StateInit-s are unique <=> contracts are distinct. Just include user's address in the former. (reply to 119445)

S: ok, let's say I have jetton minter and 2 contracts who are potential candidates for sub-contract.(wallet1 and wallet2). user has sent message to a non-existing addr so we need to deploy a new sub-contract and forward that message. Here we generate a new addr and choose wallet. Hope you got what I am confused with. 🙏 (reply to 119447)

&rey: You're approaching this wrong: there are no "wallet1" and "wallet2". In particular, master contract does not store any "sub"contract address. (reply to 119449)

S: I mean

S: let's say I wrote 2 potential subcontracts jettonwallet and dumbwallet

&rey: Nope you haven't. It does not work so.

S: 2 seperate code, seperate fc files

&rey: Such a system is possible to write but unfair and therefore not explored.

S: so TON one dApp can only have up to 2 contracts?

S: not dapp

&rey: More contracts you make in a system, the more error-prone it is, and the less user trust you have. Deservedly.

S: that's true. here another case has just come up with me, when we generate a new addr, it might deploy not the wallet but minter itself, no? new minter contract (reply to 119459)

&rey: I don't think code doing so makes any sense. After all, blockchain doesn't choose what to deploy, it just checks that provided address matches code+data pair. (reply to 119460)

S: ah

S: what if parent contract and child contract have same cell structure?

Haint: I think you are very confused (reply to 119457)

Haint: contract address is derived from stateinit, which consists of 2 cells: 1 for contract code and 1 for initial data. If both of those are the same, then it's not "parent contract" and "child contract" anymore, it's just one contract. (reply to 119463)

S: then don't we fall in the curse of infinite loop? subcontract should contain stateinit info in its cell, which again stateinit contains? would appreciate if you can elaborate it more (reply to 119465)

Haint: subcontract code is likely different from the parent contract (reply to 119466)

S: right

Haint: so the stateinit wont be the same anymore

S: but shouldn't be  the cell structure of message sent to the subcontract and subcontract's cell structure same?

Ratul: I am new so... the obvious question the best place to earn ton

&rey: 1. Remember that in ~100% DMs are scam. 2. Contests ran by TON. 3. Jobs @tonhunt, probably small ones for starters. (reply to 119471)

&rey: Otherwise, off topic.

Ratul: OK am trying this one out

Haint: i dont know if I understand your question correctly...but yes the structure for the stateinit's data cell should be the same as how you store it in the subcontract. (reply to 119470)

Tom: Same structure is not the same content. (reply to 119470)

Tom: If you come from EVM background, you might find the same concept with CREATE2

Tom: It’s deterministic

S: thank you all

gon: Hi, how to enable cloud storage in telegram mini app?

gon: I create TMA but isCloudStorageSupported flag return false

TKAINU: Hello, i send transaction, and receive message hash, Then I used the api to get the tx hash but couldn't find anything (reply to 119219)

Tom: Guys, is there any best practice for refunding excess when throwing error?

Haint: I dont think there is...each one is doing it differently. (reply to 119490)

Haint: personally I only throw errors for things like authentication

Haint: for the rest, I send back a message containing excesses and attaching the exit code

Tom: Thanks for the tips

Haint: try catch is very helpful with this pattern, although the language extension for vscode has been broken for a long time, almost all of my files are red because try catch syntax is not supported..

Tom: Yeah I also wish for a better formatter

Arbit: how to slove this issue please telll me

Sane: Hi everyone, I want to create a website where you connect Tonkeeper and can make transactions through my site.  But I only know how to make websites. Could someone advise me on what I need to get to build this kind of website? Preferably, I’d like to do it through FunC or Tact. Could anyone recommend any videos to watch to help me with this?

&rey: You do not need smart contracts (thus, any FunC or Tact) for that. You should learn about TON Connect 2. (reply to 119506)

&rey: please check also body_hash=..., it might work better (reply to 119488)

User<6218334417>: Hi, everyone, I want to know is there a way to login in  TG test environment on Android?

Minimal ☄️: Can someone tell me difference between tonweb, ton connect, and ton (for ts/js): https://docs.ton.org/develop/dapps/apis/sdk#typescript--javascript  I started with ton connect but I am confused with what are those SDKs now?

User<5721366642>: Does anyone know how to connect these games to a Tonkeeper wallet using Python?

User<5721366642>: For example, how can we connect Hamster to Tonkeeper?

Jerry: Hi, Is there any security policy on ton for my wallet ? Like safe wallet on Ethereum ?

yash: is there a russian ton dev chat

Catid: hellow anyone know how to checking NFT SBT item in dapps ?

Catid: when we connect with ton reactconnect  how to check our NFT SBT Collection ?

GSKrust: Hi, i am facing troubles with mintless jetton. So creation of jetton token using the same code as mintless repo is working, but if i add addtional functionality like ton/jetton withdrawal from jetton wallet - 1st transaction to claim tokens is failing everytime. If i add the same functional but wont use librarian its working good, but using librarian its failing. Is there a problem with library code or maybe i have to put some ton on library balance or so? I was not able to find a lot of info about library so maybe someone here will help

Pegu: Do you need to init a wallet before sending jetton to it?

S: they are found to be practically same

Sane: Hello everyone, I need help with this: I am using Ton Connect on my website. I have a button to make a transfer, and I want the transfer to be possible without connecting a wallet.  For example, you visit the site, click the "Send Funds" button, and then a menu appears to select a wallet, you chose a Wallet for example Ton keeper and then it drags you to it Without connecting your wallet. After that, you choose the wallet to send from, and that's it.  I am using js, Ton connect is connected with CDN

BizX: hi, let's discuss about this project (reply to 119367)

S: is address of a contract represented differently in FunC and TS when I log them?

Alberto: Gm

Alberto: Is there an endpoint that returns the following for transactions being made by an address? {   "txId": "transaction-id",   "from": "sender-address",   "to": "receiver-address",   "value": "transaction-value",   "token": "token-type",   "memo": "transaction-memo",   "success": "transaction-status",   "tx": "complete-transaction-object" }

Alberto: Or multiple endpoints to return that?

&rey: Look at tonapi. Please remember that TON transactions have different meaning than Eth's ones. (reply to 119573)

&rey: There are special wallet versions ("restricted") which limit possible transfer destinations.  Though, TON is safer than EVM by default; assets can only be sent from common wallets (as a result of first transaction in transactions tree), not pulled by any subsequent messages. (reply to 119530)

&rey: You don't need to use TON Connect 2 then; you can simply show QR/open link of kind https://app.tonkeeper.com/transfer/<destination>?amount=<a>&bin=<b>&init=<i>. (reply to 119561)

&rey: No you don't. In fact, jetton transfer may even not touch the wallet contract. (reply to 119548)

dot*2: how to build  a private  TON network?

dot*2: is there any tutorials?

&rey: Not actually supported but you can start with MyLocalTon.  Why, though? (reply to 119594)

dot*2: I want to do some research on TON network

&rey: what do you mean? (reply to 119597)

dot*2: like performance evaluations or some more fine-grained measurements

dot*2: is there any tutorials about MyLocalTon? (reply to 119596)

Vova: Hi is it possible make stonfi Swap TON to jetton in testnet

NASDAQ: Good evening, can you suggest an API with support for creating and activating wallets? Tried tonapi, couldn't activate the address(

Michal: Hey! I'm integrating with TON Blockchian and I'm seeking info about memo that can be attached to transaction, as we can often see, when performing deposit you attach memo. I need to validate that input, but I cannot find any information about max size, allowed characters etc.  Could you please advice? Or point me into the right direction please?

S: hey guys i am back

S: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {   int opcode = in_msg_body~load_uint(32);   throw_unless(error:wrong_op, opcode == op::click);    var cs = in_msg_full.begin_parse();   cs~load_uint(4);   slice sender_addr = cs~load_msg_addr();    int hashed_sender_addr = slice_hash(sender_addr);    (int count, cell dic) = load_data();    ~dump(sender_addr);   ~dump(hashed_sender_addr);   (slice x, int key?) = udict_get?(dic, 256, hashed_sender_addr);   ~dump(key?);    count += 1;   save_data(count, dic);   return();  }

S: here the console only logs until hashed_sender_addr

S: which makes me think there's a problem in dictionary check

S: how do you usually set the initial value of a dictionary when you deploy a contract

S: (int, cell) load_data() inline {   slice ds = get_data().begin_parse();   int count = ds~load_uint(64);   cell dic_data = ds~load_ref();   cell dic = dic_data.begin_parse().slice_bits() == 0 ? new_dict() : dic_data;   ;; cell dic = new_dict();   ds.end_parse();   return (count, dic); }

S: here, I just set the dummy initial dict as contract's compiled code itself

S: () save_data(int count, cell dic) impure inline {   set_data(     begin_cell()     .store_uint(count, 64)     .store_ref(dic)     .end_cell()   ); }  here can't I store empty dictionary as reference?

S: when I deploy a contract, can I initialize the value of a cell as empty dictionary?

S: I got stuck with handling dictionary

S: cell dic = dic_data.begin_parse().slice_bits() == 0 ? new_dict() : dic_data;  why do you think dic_data.begin_parse().slice_bits() is always 0 even though I have added a value before

S: cell dic_data = ds~load_ref();   cell dic = dic_data.begin_parse().slice_bits() == 0 ? new_dict() : dic_data;  here dic_data itself is not an empty cell

Dmitriy: you should check for references as well use slice_bits_refs for it IIRC the root cell of dictionary is empty since it stores the elements in separate cells (reply to 119669)

Dmitriy: but the best choice is to use cell_null? function that checks dict for emptiness

S: contract  = blockchain.openContract(Clicker.createFromConfig({ admin: deployer.address, dic: new Cell() }, code));

S: so initially I deploy it with new Cell()

S: and the first transaction(message) is to add a value to the dict

S: doesn't it always give -1(true) in my case? (reply to 119673)

S: if cell is not a valid dictionary, further methods like udict_get? fail so I need to init it as new_dict() from the very start.

S: @pcrafter

Dmitriy: you don’t need new_dict for it  just use    dic: beginCell().storeDict(null).endCell()   in your TypeScript wrapper during deployment and use   ds~load_dict();   in your FunC code when retreiving a storage via get_data and everything will work (reply to 119682)

Dmitriy: if I got your problem right and you need to initialize the contract with empty dict in the storage

S: oh thank you. (reply to 119687)

S: btw, still I shall store it as ref?

S: you know, dic's type is Cell

Dmitriy: yes, dict is a separate cell that needs to be stored as a reference storeDict does it under the hood you can also use storeRef(beginCell().newCell()) but storeDict is more idiomatic

S: then, I suppose I would need to use load_ref as well

Dmitriy: load_dict() does it under the hood as well :)

Dmitriy: no extra manipulations are needed apart from this (reply to 119686)

S: it fails to load dict. :(  export function clickerConfigToCell(config: ClickerConfig): Cell {     return beginCell().storeUint(0, 64).storeAddress(config.admin).storeRef(config.dic).endCell(); }          clicker = blockchain.openContract(             Clicker.createFromConfig({ admin: deployer.address, dic: beginCell().storeDict(null).endCell() }, code),         );  (int, slice, cell) load_data() inline {   slice ds = get_data().begin_parse();   int count = ds~load_uint(64);   slice amdin_addr = ds~load_msg_addr();   cell dic_data = ds~load_dict();   ~dump(dic_data);   cell dic = dict_empty?(dic_data) == -1 ? new_dict() : dic_data;   ds.end_parse();   return (count, amdin_addr, dic_data); }

S: it fails to log dic_data, which means the previous code of load_dict() didn't work.

Dmitriy: What is config.dic here? (reply to 119700)

S: export type ClickerConfig = {     admin: Address;     dic: Cell; };  here (reply to 119702)

S: If I use load_ref then     (slice x , int key?) = udict_get?(dic, 256, hashed_user_addr); fails

&rey: So do you call load_data at all? Do other logs work? (reply to 119701)

S: if (opcode = op::add) {     ~dump(op::add);     throw_unless(error:not_admin, sender_addr.slice_bits() == admin_addr.slice_bits());     slice user_addr = in_msg_body~load_msg_addr();     int hashed_user_addr = slice_hash(user_addr);     ~dump(hashed_user_addr);          (slice x , int key?) = udict_get?(dic, 256, hashed_user_addr);     ~dump(key?);     ~dump(dic);     (dic, int success?) = udict_add?(dic, 256, hashed_user_addr, begin_cell().end_cell().begin_parse());     ~dump(dic);     ~dump(success?);     (slice y , int _key?) = udict_get?(dic, 256, hashed_user_addr);     ~dump(_key?);     save_data(count, admin_addr, dic);     (count, admin_addr, dic) = load_data();     (x , int _key_?) = udict_get?(dic, 256, hashed_user_addr);     ~dump(_key_?);   }  in this code sir, if I go from new_dict() then it works until the end

S: but although I set the initial value of dic as empty cell in the deployment phase like below  clicker = blockchain.openContract(             Clicker.createFromConfig({ admin: deployer.address, dic: beginCell().storeDict(null).endCell() }, code),         );

S: cell dic = cell_null?(dic_data) == -1 ? new_dict() : dic_data;   cell dic = dict_empty?(dic_data) == -1 ? new_dict() : dic_data;   cell dic = dic_data.begin_parse().slice_bits() == 0 ? new_dict() : dic_data;  if I try to load it using one of these 3 ways, it appears not to be empty dic

S: C{90AEC8965AFABB16EBC3CB9B408EBAE71B618D78788BC80D09843593CAC98DA4} this is the log of the dic. It was supposed to be (), which is new_dict()

S: shall I share the code on github so that it has better look?

S: (int, slice, cell) load_data() inline {   slice ds = get_data().begin_parse();   int count = ds~load_uint(64);   slice amdin_addr = ds~load_msg_addr();   cell dic_data = ds~load_ref();   cell dic = cell_null?(dic_data) == -1 ? new_dict() : dic_data;   cell dic = dict_empty?(dic_data) == -1 ? new_dict() : dic_data;   cell dic = dic_data.begin_parse().slice_bits() == 0 ? new_dict() : dic_data;   ;; cell dic = new_dict();   ds.end_parse();   return (count, amdin_addr, dic); }  this is the load function actually (reply to 119727)

S: you know, I can't init the dic everytime load_data is called and just first initialization suffices

S: I am stuck with that

S: https://github.com/Azymack/clicker

Dmitriy: #DEBUG#: s0 = 3136733728 #DEBUG#: s0 = ()   is it that you expect in the logs? (reply to 119735)

Dmitriy: I mean, dict to be ()

S: yes

S: process fails at the point of udict_get?

S: so further dumps are not logged

Dmitriy: nope (reply to 119741)

Dmitriy: I’ve sent you a .patch file in DM

— 2024-10-31 —

Sane: I want the menu of Ton connect (reply to 119591)

Sane: Типо ты выбираешь кошелек через меню Ton connect и потом уже тебя перекидывает на тот кошелек не подключаю свой кошелек (reply to 119750)

&rey: oh I don't use default menu at all instead writing my own, so I cannot help you here. (reply to 119750)

Sane: Well thanks, good luck (reply to 119753)

Champer Wu: Perhaps, you just need to create a button to show your wallet address qr code let sponsor scans it and sends the fund to you (reply to 119561)

•: https://t.me/tondev (reply to 119534)

Howard: is the https://dns.ton.org/?testnet=true archive? (reply to 38906)

gon: Hi, can i clear my data store in cloud storage?

Giorgi: Hi, nice to meet you all, I have a question regarding the derivation of ton wallets - I was not able to find a doc for that, can you help please?

&rey: Which part — keyPairFromMnemonic or contract (and its address) from keypair? (reply to 119789)

Giorgi: In EVM ecosystem I would have a private key of the wallet and then with manipulation with paths I could derive unlimited amount of wallets deterministically is there anything similar here ?

Leo: mnemonic  ==hmac==>  seed  ==pbkdf==>  privkey  ==ed25519==>  pubkey  ==buildcell==>  stateinit  ==hash==>  walletaddr

&rey: 1. Ed25519 keys. If you find a compatible HD scheme, you can get however many keypairs. 2. Wallet IDs. You can change those, to have multiple wallets with single keypair. (reply to 119791)

Leo: If you use BIP32-like approach instead of the standard TON wallet approach, you can get countless secret keys for wallets. (reply to 119791)

Leo: use the registered TON path 44'/607'/ just like tr_ust_wal_let does

Giorgi: Okay, that makes sense, thanks both of you for such good explanations!

JT: One private = one pubkey. There wont be any EOA as EVM on TON. Instead, TON has smart wallet. Am I right?

&rey: Your message carefully skips that 1. one seed —> multiple possible keypairs, 2. one keypair —> multiple possible wallets. Thus, it is right but inconsequential. (reply to 119802)

JT: One mnemonic seed can generate many private keys. These concept pretty much the same as Bitcoin account

JT: The question he asked is EOA which in fact not existed in TON

JT: One privkey = one pubkey

JT: One EOA in EVM could also have a countless smart contract wallet

Leo: Well, since he said that he can use "private key" to "derive unlimited wallets" in EVM and asked whether he can do the same thing on TON, probably he confused private key with mnemonic and was asking if there's similar HD approach on TON, instead of the EOA thing.

WhyesCode: Hi, it's good to be here.

Ksms: Hello, I perform multiple test transactions and I notice the storageFeesDue keep accumulating. At what point is the DuePayment paid?

Leo: If your contract has enough balance, it should be paid on next transaction, otherwise the account can be frozen/erased after due_payment exceeds corresponding limit.

Mithra: Hey, guys, is there a rule how the Cell key is generated or ordinal numbers can be used?

fils de ismael: Hello I would like to know how to convert your net test tokens

MZ: Do you have idea what happened in this transaction?  https://tonscan.org/tx/82ae78d4b17ba19d45857ed5738a07683016745c24da65b6d54c9687d2eb8f61  User paid 0.75 TON to the wallet generated by Ledger and the wallet automatically returned this transaction. What is the reason?

WhyesCode: Check wallet history for details (reply to 119849)

MZ: Is it possible it has been returned, because I haven't sent any transactions from this wallet yet? (reply to 119850)

MZ: This is how I send transaction. (reply to 119850)

WhyesCode: Possibly! Some wallets require an initial transaction to be properly set up. Your code looks good. You might want to send a small transaction first to "initialize" the wallet. This could resolve the auto-return issue.

Микита: Hello everyone, I’m looking for the most accessible way to get the TON to USDT exchange rate. NodeJS

&rey: Check that COLD_WALLET_ADDRESS... is non-bounceable and that user does not use TON Space. (reply to 119852)

MZ: What does it mean? Is it possible that it returned that amount, because my wallet wasn’t activated (didn’t have any sent transactions)? (reply to 119856)

&rey: Yes. The answer is not to activate wallet; rather, the answer is to send money in non-bounceble mode. (reply to 119857)

MZ: So how can I set transactions to non-bouncable mode using @tonconnect/ui-react ? (reply to 119858)

&rey: Check that address starts from UQ... — if it doesn't, use @ton/core::Address.parse('EQ...').toString({bounceable: false}). (reply to 119861)

MZ: Well, my cold wallet address starts with UQ. When it comes to the user address I don't need to enter it anywhere using tonconnect react. (reply to 119862)

&rey: TON Space manages to ignore such flags; try passing bounce: false in the message object, and if it doesn't work suggest that users not use TON Space. (reply to 119863)

Oleksii: /stat@combot

Ihor: Hello everyone  I have a question regarding the TON HTTP API I need to get data on the USDT contract  data of the following nature  - the balance of the address on a certain date  - track all changes in this balance up to a certain time   is it possible?

P: In solidity i used track contract interactions by filtering events with graphql. Is it available in ton too?

Ursss_ysn: /stat@combot

WhyesCode: Yes! It is possible. (reply to 119878)

WhyesCode: You can use the API to query the balance of an address on a specific date and track changes in the balance up to a certain time. (reply to 119878)

WhyesCode: You'll need to make HTTP requests to the TON HTTP API to fetch the required data.

Ihor: Thanks allot  I just wondered which method I should call?  Or maybe I need to combine for several calls with different methods? (reply to 119884)

WhyesCode: You'll likely need to make several calls to different methods. Use getAccountState to get the balance of an address. (reply to 119886)

WhyesCode: Use getTransactions to track all changes in the balance over time.

Ihor: Thanks  Going to check this (reply to 119888)

WhyesCode: Combine these calls

Yuri: Hello guys, about ton-connect manifest file. Should I provide the t ..... me link to the url field?

Vahid: Is there a list of archive nodes available?

&rey: You can filter them from net config. (reply to 119914)

S: when I send a raw message to a child contract, I suppose it should meet certain cell format? like begin_cell().store_uint(0x18, 6).store_slice(tracker_addr).store_ref(state_init).store_ref(msg_body_to_tracker).end_cell()

Mehrdad: Hello guys, why this transaction is Success on tonscan :  ✅ https://testnet.tonscan.org/tx/a4f1757294ac07468d4ec4bc8c25dda63ad78d4453edfd6fa1e3c9b5b4ef7b03  and is Failed on tonviewer ❌ https://testnet.tonviewer.com/transaction/a4f1757294ac07468d4ec4bc8c25dda63ad78d4453edfd6fa1e3c9b5b4ef7b03  TX ID:  a4f1757294ac07468d4ec4bc8c25dda63ad78d4453edfd6fa1e3c9b5b4ef7b03

S: in this case, msg_body_to_tracker is read as in_msg_body in the child contract? (reply to 119922)

Epsilone: Hello my tons disappeared, what I can do?

Epsilone: Idk how add link, bot remove it

Epsilone: https://tonviewer.com/transaction/442ae757ead3d3b4b1896a99b91e1d8cf1b5e7fed578fffeb4a4a8ae5c9dc91c

Epsilone: What I can do? (reply to 119930)

Леонид: Hey guys, somebody looking for Devcon ?

S: sir

&rey: Yes. To be precise, begin_cell().store_uint(0x18, 6).store_slice(tracker_addr).store_uint(7, 108).store_ref(state_init).store_ref(msg_body_to_tracker).end_cell() (reply to 119922)

S: https://github.com/Azymack/clicker_  can you kindly have a look at this codebase of mine? in the file Clicker.spec.ts line 65 I am trying to get tracker contract's (which is used for storing a uint of vote_id) vote_id and get "Trying to run get method on non-active contract" error.

S: let tracker: (address: Address) => Promise<SandboxContract<Tracker>>; tracker = async (address: Address) =>             blockchain.openContract(Tracker.createFromAddress(await clicker.getTrackerAddress(address))); const deployerTracker = await tracker(deployer.address); const voteIdOfDeployer = await deployerTracker.getVoteId();

S: this is the code from the test script.(just extracted the code related to child contract interaction)

User<7502465584>: hi all

Nikita: my contract only works with tonkeeper and breaks with telegram wallet   is it possible to hide telegram wallet in this official TON Connect component?

S: when I deploy a child contract, shall I use the compiled code directly or further processing is required?

S: I don't think there's good FunC tutorial regarding parent-child contract interaction.

S: does your contract have parent-child contract interaction? (reply to 119970)

0xCrusader: Just for me to know, what rule have I violated so my question got deleted?

Mehrdad: I could not find why! (reply to 119923)

S: I deploy the parent contract using its complied code but it should contain child contract's code as well so that it can deploy child contract with raw message. I am stuck with that part.

S: how to set childcontract's code(Cell) in the test script

S: https://github.com/Azymack/clicker_

S: what does "Trying to run get method on non-active contract" mean?

S: I think I am not providing the child contract's code properly, which will be used for state_init, when I deploy the parent contract           trackerCodeRaw = await compile('Tracker');         const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());         _libs.set(BigInt(0x${trackerCodeRaw.hash().toString('hex')}), trackerCodeRaw);         const libs = beginCell().storeDictDirect(_libs).endCell();         blockchain.libs = libs;         let lib_prep = beginCell().storeUint(2, 8).storeBuffer(trackerCodeRaw.hash()).endCell();         trackerCode = new Cell({ exotic: true, bits: lib_prep.bits, refs: lib_prep.refs });          clicker = blockchain.openContract(Clicker.createFromConfig({ trackerCode: trackerCode, dic: null }, code));

S: here I used sample code from jetton

— 2024-11-01 —

S: right

S: await clicker.sendClick(deployer.getSender(), toNano('1'), 1);  actually this function is supposed to deploy the child contract with state_init code on parent contract

S: var msg_to_tracker =        begin_cell()       .store_uint(0x18, 6)       .store_slice(tracker_addr)       .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)       .store_ref(state_init)       .store_ref(msg_body_to_tracker);  send_raw_message(msg_to_tracker.end_cell(), 1);

S: I think it doesn't though  I tried to log a dummy value in the child contract code and it didn't, which means this message failed

Haint: print out the transactions to see what's wrong with it tips: use flattenTransaction from @ton/test-utils to make it more readable (reply to 120009)

S: it passed until the child contract (reply to 120019)

S: but I still get "trying to ... on non-active contract" error

Haint: read carefully what i said (reply to 120020)

Haint: printing out transaction result would show you the state of the contract (child contract state should be active)

S: ah, deploying doesn;t mean it's active? (reply to 120024)

S: sorry I was asking

Haint: there might be problem when deploying (reply to 120025)

Haint: in that case, the contract state remains uninitialized

S: https://github.com/Azymack/clicker_/blob/master/contracts/clicker.fc

S: maybe the line 69 is the relevant part

Haint: instead of speculating, why not just do what I adviced? You'll see where the problem is.

Haint: learn to debug the code

S: sorry I am new (reply to 120034)

S: all I do for debugging is dump and console

S: btw all the actionResultCodes are 0 and they are all successful

Haint: your unit test is not even a test...all the assertions are commented. No wonder it all passed.

S: no I mean transaction (reply to 120039)

S: damn bot

S: https://github.com/Azymack/clicker_/blob/master/tests/Clicker.spec.ts line 73 gives me error, which gets data from child contract

S: but actually it's deployed by the parent contract when I trigger click operation https://github.com/Azymack/clicker_/blob/master/tests/Clicker.spec.ts line 62

Haint: you need to first make sure the tracker contract is deployed before calling get method on it.  expect(res.transactions).toHaveTransaction({             from: clicker.address,              to: deployerTracker.address,             deploy: true,             success: true,          }); (reply to 120045)

Haint: I dont think this would pass

Haint: that's why I told you to use flattenTransaction to print out the res.transactions, so you'll have some ideas whats going wrong

S: running forloop? (reply to 120050)

Haint: Use whatever. It's just javascript. (reply to 120051)

S: right it's deployed to different address not sure why (reply to 120055)

chung 🆙 UXUY: help me 1 transaction error. I transferred my not coin on Telegram wallet but have not received it.

S: one child contract is deployed but its address is not what I expected. why do you think this would happen though I used same function (reply to 120047)

Haint: it means the stateinit is not the same (reply to 120059)

S: sorry what do you mean? I calculate it once (reply to 120060)

S: between what and what (reply to 120060)

S: here I log my_address() twice but the values are different. Isn't it of a same smart contract?

S: hey Haint (reply to 120060)

S: what's the timeframe of this slowmode?

S: I am encountering an inconsistency when calling my_address() in different contexts in the same contract

S: When I call my_address() within get function, it returns a slice that starts with 0 bits

S: when I call my_address() within an impure function, it returns a slice that starts with 1 bit

S: hey friend any idea with my issue? (reply to 120083)

PuzzledOldman: Try reloading, yesterday I had the same and reloading helped quickly

Sigit H. Yudanto: Already did that mate

Kyle: Hi I want to generate proof using ton wallet to verify in my backend. I'm following the tutorial in ton doc website. But when I connect my extension wallet, I don't have state_init field in proof so I cannot verify in my backend. So what am I missing? Please help me

PuzzledOldman: Someone could just do a TON wallet in C++ alike  С is probably doable on Android with rawdrawandroid lib (reply to 120106)

Champer Wu: use TONX API to get jetton transfer is more easily  https://docs.tonxapi.com/reference/get-jetton-wallets https://docs.tonxapi.com/reference/get-jetton-transfers use this two api could handle histories all you needs (reply to 119878)

S: I am encountering an inconsistency when calling my_address() in different contexts in the same contract  When I call my_address() within get function, it returns a slice that starts with 0 bits  when I call my_address() within an impure function, it returns a slice that starts with 1 bit

S: Is this possible to happen in the same smart contract?

S: oh you don't sleep yet

S: so I have read the transactions

S: I have triggered same operation twice and the messages from the parent contract are sent to same address.

S: const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());         _libs.set(BigInt(0x${trackerCodeRaw.hash().toString('hex')}), trackerCodeRaw);         const libs = beginCell().storeDictDirect(_libs).endCell();         blockchain.libs = libs;         let lib_prep = beginCell().storeUint(2, 8).storeBuffer(trackerCodeRaw.hash()).endCell();         trackerCode = new Cell({ exotic: true, bits: lib_prep.bits, refs: lib_prep.refs });          clicker = blockchain.openContract(             Clicker.createFromConfig({ trackerCode: trackerCode, dic: null }, clickerCode),         );

S: perhaps this is wrong? It's used to get tracker contract's code from raw compiled code. I just copy pasted jetton's

S: thanks

S: {       lt: 7000000n,       now: 1730438526,       outMessagesCount: 1,       oldStatus: 'active',       endStatus: 'active',       totalFees: 1599331n,       from: undefined,       to: EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G,       on: EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G,       value: undefined,       body: x{392EB5CB4FB9D5E366AEE910D958E616BCB343EDC93FF0E0645D841BE76AFBCCC_}        x{D001}         x{620060650571D907B50ED374D20675317103AFB29909354C470A6FFB02F1D2888A9921DCD6500000000000000000000000000000BAF6C2200000000000000001},       inMessageBounced: undefined,       inMessageBounceable: undefined,       op: 959362507,       initData: undefined,       initCode: undefined,       deploy: false,       aborted: false,       destroyed: false,       exitCode: 0,       actionResultCode: 0,       success: true     }        at logTransactions (libs/helper.ts:7:17)    console.log     {       lt: 8000000n,       now: 1730438526,       outMessagesCount: 1,       oldStatus: 'active',       endStatus: 'active',       totalFees: 3472928n,       from: EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G,       to: EQDAygrjsg9qHabppAzqYuIHX2UyEmqYjhTf9gXjpREVMlzF,       on: EQDAygrjsg9qHabppAzqYuIHX2UyEmqYjhTf9gXjpREVMlzF,       value: 1000000000n,       body: x{BAF6C2200000000000000001},       inMessageBounced: false,       inMessageBounceable: true,       op: 3136733728,       initData: undefined,       initCode: undefined,       deploy: false,       aborted: false,       destroyed: false,       exitCode: 0,       actionResultCode: 0,       success: true     }        at logTransactions (libs/helper.ts:7:17)    console.log     {       lt: 9000000n,       now: 1730438526,       outMessagesCount: 0,       oldStatus: 'uninitialized',       endStatus: 'active',       totalFees: 597200n,       from: EQDAygrjsg9qHabppAzqYuIHX2UyEmqYjhTf9gXjpREVMlzF,       to: EQAAjDKrDr0L1TllwESK76UAJ7A814TglMg68dmN-Il2rtNY,       on: EQAAjDKrDr0L1TllwESK76UAJ7A814TglMg68dmN-Il2rtNY,       value: 1000000000n,       body: x{0000000000000001},       inMessageBounced: false,       inMessageBounceable: true,       op: 0,       initData: x{000000000000000068008D0D4580CD8F09522BE7C0390A7A632BDA4A99291C435B767C95367EBE78E9AF00303282B8EC83D00303282B8EC83DA8769BA69033A98B881D7D94C849AA6238537FD8178E944454CA_},       initCode: x{028474DE75DB9B10635FF272C6B709CBAA9CE04C9B52BD590D945E7CD78664D999},       deploy: true,       aborted: false,       destroyed: false,       exitCode: 0,       actionResultCode: 0,       success: true     }        at logTransactions (libs/helper.ts:7:17)    console.log     Transaction Logs:        at logTransactions (libs/helper.ts:5:13)    console.log     {       lt: 10000000n,       now: 1730438526,       outMessagesCount: 1,       oldStatus: 'active',       endStatus: 'active',       totalFees: 1599331n,       from: undefined,       to: EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G,       on: EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G,       value: undefined,       body: x{392EB5CB4FB9D5E366AEE910D958E616BCB343EDC93FF0E0645D841BE76AFBCCC_}        x{D001}         x{620060650571D907B50ED374D20675317103AFB29909354C470A6FFB02F1D2888A9921DCD6500000000000000000000000000000BAF6C2200000000000000002},       inMessageBounced: undefined,       inMessageBounceable: undefined,       op: 959362507,       initData: undefined,       initCode: undefined,       deploy: false,       aborted: false,       destroyed: false,       exitCode: 0,       actionResultCode: 0,       success: true     }        at logTransactions (libs/helper.ts:7:17)

S: this is what I get from executing same operation twice

S: 3 transactions for each operation

S: first time: deploye: true second time: false DAMN slowmode

S: const clickResult = await clicker.sendClick(deployer.getSender(), toNano('1'), 1);         const clickResult_ = await clicker.sendClick(deployer.getSender(), toNano('1'), 2);

S: you know EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G is child's address

S: but what I get from          const deployerTracker = await tracker(deployer.address);          console.log(deployerTracker.address, '-------------------');  is EQAghPf4fSw4KiNAT6jBnUwy93EMHRWch-aAHZHepfIm3ocE

S: let tracker: (address: Address) => Promise<SandboxContract<Tracker>>;         tracker = async (address: Address) =>             blockchain.openContract(Tracker.createFromAddress(await clicker.getTrackerAddress(address)));  this is for getting tracker address in the test script

S: async getTrackerAddress(provider: ContractProvider, address: Address): Promise<Address> {         const res = await provider.get('get_tracker_address', [             {                 type: 'slice',                 cell: beginCell().storeAddress(address).endCell(),             },         ]);         return res.stack.readAddress();  and this is relevant code in the wrapper

S: right (reply to 120143)

S: it was my mistake, sorry. but anyway the addresses are different

Jaskirat: Hey guys, does anyone knows how to get the jetton transactions using tonweb?

S: same? :(

Ayush: getting this error while deploying my next js application, which has telegram sdk

Ayush: what to do ?

Umaid: Hi, I need help to send USDT from one wallet to another using js script. How can I? Anyone helo please

&rey: At which point in docs have you failed? (reply to 120156)

Umaid: Basically I couldn't understand the jetton transfer system through the docs. I have to write a script to send USDT and HMSTR token through backend. (reply to 120157)

&rey: Sender sends appropriate jetton transfer order to their jetton wallet. (reply to 120159)

Umaid: Sounds good. Can I get a script or TON API to send jetton tokens? (reply to 120160)

Umaid: Basically I was stuck for a week on this.🥺 (reply to 120161)

&rey: Since something needs to sign the message, tonapi/toncenter cannot do the transfer themselves, but you'll need one as part of script. (reply to 120161)

Umaid: Can you share the script please (reply to 120164)

Umaid: It will be helpful for me

S: Everyone, pls be careful with using . and ~

S: Thank you Leo

Umaid: @pcrafter here bro?

S: I found that many contract's stdlibs contain way more built-in methods than the original one. I suppose I can directly use some of them by copy paste?

Ab: Hi to  all, I have been looking for a TON developer role.

S: cell msg_body_to_clicker =      begin_cell()     .store_uint(op::response, 32)     .store_uint(status_code, 64)     .store_uint(new_vote_id, 128)     .store_uint(vote_id, 256)     .store_slice(user_addr)     .end_cell();   var msg =      begin_cell()     .store_uint(0x18, 6)     .store_slice(clicker_addr)     .store_coins(msg_value)     .store_uint(1, 107)     .store_ref(msg_body_to_clicker);      ;; send message back to the clicker   send_raw_message(msg.end_cell(), 1);  this is the message I try to send back from the child contract to the parent contract but it fails with actionResult 34 code

S: here store_uint(1, 107) have specific meaning?

S: the send mode was the problem

S: btw, when I try to load the data on the parent contract op::response was supposed to  be read but I get different value

S: int opcode = in_msg_body~load_uint(32);  If I load the first uint_32 data from the message body. op::response is not read?

S: .store_uint(op::response, 32) (reply to 120187)

Umaid: I got this error while transferring HMSTR node:internal/process/promises:288             triggerUncaughtException(err, true /* fromPromise */);             ^  [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "Invalid address".] {   code: 'ERR_UNHANDLED_REJECTION' }

&rey: Check that your project uses only @ton/core, @ton/ton. (reply to 120195)

S: .store_uint(1, 108) and     .store_uint(7, 108) are different in msg_body? (reply to 120188)

Truman: Hi, I just deployed Jetton, to revoke admin role in the Jetton, I need to change the admin to an empty address right? What is an empty address on Ton network?

&rey: b{00} (two zero bits) is. It is commonly represented as null offchain. (reply to 120198)

Mohammad: Someone have example code for conect wallet with php?

&rey: You have the following choice: .store_uint(0, 107).<store payload> .store_uint(1, 107).store_ref(payload) .store_uint(6, 108).store_ref(init).<store payload> .store_uint(7, 108).store_ref(init).store_ref(payload) (reply to 120197)

Mohammad: What is problem?(for reaction) (reply to 120202)

&rey: TON Connect 2 is mainly intended for frontend connection. It's backend-agnostic in that matter. If you need to connect to backend, you can rewrite pytonconnect presumably. (reply to 120203)

Mohammad: Are you have example code for this? (reply to 120204)

&rey: Please visit docs.ton.org instead of me explaining code to everyone who asks. (reply to 120205)

S: do you have any idea why op::response is read differently from the stored one?    cell msg_body_to_clicker =      begin_cell()     .store_uint(op::response, 32)     .store_uint(status_code, 64)     .store_uint(new_vote_id, 128)     .store_uint(vote_id, 256)     .store_slice(user_addr)     .end_cell();    var msg =      begin_cell()     .store_uint(0x18, 6)     .store_slice(clicker_addr)     .store_coins(msg_value)     .store_uint(1, 107)     .store_ref(msg_body_to_clicker);    int opcode = in_msg_body~load_uint(32);  message is succefully delivered and I read it at first

&rey: It should be read correctly, actually. (reply to 120208)

S: same value is read no matter what I store

Leo: you made some basic mistake, obviously just learn something from the docs before writing codes to develop efficiently

Haint: is that the first call using in_msg_body? you might have load something before that statement (reply to 120208)

S: no (reply to 120214)

Haint: you can do some basic debugging such as seeing if the opcode is correct in the printed res.transactions (reply to 120215)

Haint: make some effort using provided tools first before asking

Umaid: const recipientAddress = "UQAX5qMsA6OaJyhtJQocEKLinUvk1dTgnZRRxB-0omT-WHAv"; const jettonAmount = "10"; // String format for safer parsing in toNano const jettonWalletContractAddress =   "EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo";  async function sendHMSTR() {   const tonWeb = new TonWeb();   const keyPair = await mnemonicToWalletKey(mnemonic);    const wallet = tonWeb.wallet.create({     publicKey: keyPair.publicKey,     secretKey: keyPair.secretKey,   });    let seqno;   try {     seqno = await wallet.methods.seqno().call();     if (typeof seqno !== "number" || isNaN(seqno)) {       console.warn("Seqno retrieval failed, setting to 0 as default.");       seqno = 0;     }   } catch (error) {     console.warn("Error retrieving seqno, setting to 0 as default:", error);     seqno = 0;   }    const body = beginCell()     .storeUint(0xf8a7ea5, 32)     .storeUint(0, 64)     .storeCoins(toNano(jettonAmount))     .storeAddress(Address.parse(recipientAddress))     .storeAddress(Address.parse(jettonWalletContractAddress))     .storeBit(0)     .storeCoins(0)     .storeBit(0)     .endCell();    const transaction = {     validUntil: Math.floor(Date.now() / 1000) + 360,     messages: [       {         address: jettonWalletContractAddress,         amount: toNano("0.05").toString(),         payload: body.toBoc().toString("base64"),       },     ],   };    try {     const response = await wallet.methods.transfer({       seqno,       secretKey: keyPair.secretKey,       ...transaction,     });     console.log("Transaction successful:", response);   } catch (error) {     console.error("Transaction failed:", error);   } }  sendHMSTR();    I'm using this script (reply to 120196)

&rey: You've somewhat mixed up TON Connect 2 with common transfers. Who is sending the message: user or you? (reply to 120222)

Umaid: Recipient address is i want to send funds and i was using mnemonics v3R2 wallet to send the HMSTR token (reply to 120224)

TKAINU: hello i want call transfer will show comment on forward payload on tonviewer same value text: hehe, but my contract not show

Xin Jin (NT Capital): Is there any clear documentation about TON Connect please? (reply to 120204)

Minimal ☄️: Hi everyone, can someone help me a little bit on how to use Telegram stars (via Payments API) in TMA (not in chat),  I want the pop-up as all of the games have and as the DurgerKing bot has when one tries to buy something with stars (pop-up of the stars dialog in case one hasn't got enough stars to buy them)

Fuckintosh: hello, how to get w5 wallet address by nodejs?

Grimmie: Hey guys, May I know how to sign and verify message on Ton wallets? Mainly on TonKeeper. I was able to sign and verify by following ton docs, but for the second wallet, it didn't work

Ab: Who can find a TON dev role?

&rey: Yes. It is located where all documentation is: https://docs.ton.org/develop/dapps/ton-connect/. (reply to 120240)

Alex: Hi guys!  I'm facing the problem that using the TonConnectUI, if an user doesn't have the transaction asset wallet (for example GRAM or NOT or whatever) - it initiates the transfer only with TON commission and as a result - it just sends the commission value and pays that commission for nothing. How I can avoid that strange situation? How can I make this transfer failed automatically?

&rey: You can lookup user's jetton balance via tonapi / toncenter / lots of other APIs. (reply to 120255)

Alex: Okay, I will do it.   Is there some another adjustments for the transaction itself in this case? (reply to 120256)

zk: I have a question about liquid staking. I saw in the process described on the Liquid Staking Pool related Github that validators need to actively request funds from controllers. So, in theory, does the pool itself also need to create its own validator?

Minimal ☄️: Hey guys, based on what one app differs multiple telegram accounts and their wallets? Like, when user switches from one account to another, how come the wallet is not in localStorage anymore? Do apps delete it manually or is there some command for telegram to delete it?  Because when I try in my app to switch between accounts, wallet information is still in local storage from the previous account?

Mehmet Ali: Anyone knows how to solve this?

Tony: Anyone using ton4j? My java service works well on windows but got "fatal error has been detected by the Java Runtime Environment" when running on Linux. I have downloaded the latest version of  tonlibjson-linux-x86_64.so file. I really need help here?

sports: they have nonexistent developers yet why people still try to develop in this chain?

&rey: Developers do exist, as well as studios. They do not usually reach out to others via DM, that's the thing. (reply to 120296)

&rey: (Also, might the ongoing conference be a reason why many are inactive?)

User<7932056939>: In my miniapp, I have some problems in implementation deposit functionality via Telegram Wallet. I really need help.

&rey: First you should choose correct chat, which is @devs. Here is TON (smc and related) development, not TMA chat. (reply to 120306)

User<7932056939>: It's based on TON blockchain.

User<7478245202>: Hi everyone! I want use telegram and ton for one crypto project. Actually no have time to work for that. Have any trust company we get offer for this project. Miniapp

User<7478245202>: Dm me please (reply to 120317)

Leandro: Hi, Everyone This is Jack, full stack & blockchain developer from Sydney. I have rich experience over 8 years in web and blockchain development and I am actively looking for a new opportunity. You can check my profile at https://jack-lee.xyz  Followings are my experience and skill sets: -Front-End: React/Redux, Next.js, Vue/Nuxt.js, Svelte/Sveltekit, WordPress, HTML5, CSS3, JavaScript/TypeScript, jQuery, Tailwind CSS, Bootstrap -Mobile: React Native, Native, Android, iOS -Version Control and Project Management: JIRA, Trello, GitHub, GitLab -Blockchain and Web3 Development: Web3.js, solidity, Rust, Golang, Vype, Truffle, Ganache, MetaMask, Hardhat, Blueprint, FunC, Tact -Smart Contract integration development: DeFi platforms, Crypto wallets, NFT marketplaces, Casino bet

— 2024-11-02 —

Kushagra: Hi everyone, can anyone tell me the easiest way to deploy and use a Highload wallet in ton? Any Wallet UI supports it or is can be only done with a contract deployment. Thanks in advance.

TON Bounty Bridge: ​#208  Created by minhantun1995

AlirezaEthDev: Hello 👋🏻

AlirezaEthDev: Can we share our technical questions and issues here?

Ab: Any vacancies for a blockchain dev?

EVMlord: Lets TOLK

&rey: Yes, if they are related to TON (not custodial services like Telegram wallet or like, as we cannot help with those). (reply to 120427)

AlirezaEthDev: What about FunC? (reply to 120430)

&rey: Yes you can, and that's like the point of the chat. (reply to 120431)

Kyle: Hi Is there any way to get transaction info from transaction hash?

zk: Does anyone konw this part?🙏 (reply to 120263)

User<7478245202>: Hi peoples! How much cost for click to play miniapp game. Like a hamster and other all? I want to know cost for dev.

&rey: Also there is cost in form of reputation hit from making such things. (reply to 120450)

Rasoul: Hello friends, I have a question, where does the liquidity that is created for the pools go? The next question is how to calculate the TVL network.

User<1511134913>: From 1500 to 10000 (reply to 120450)

&rey: It is a necessary component for doing swaps in any direction users want. (reply to 120457)

Rasoul: I know, I want to know where the tokens are transferred (reply to 120459)

Allan | Alimango Studios: hi we developed a market maker and vol bot for ton connected to stonfi. for wallets, the max we can do is 4 wallets at a time. is this normal for ton? also the confirmation when buying takes long time. we have private rpc but the buy and sell is painstakingly slow. is this normal for ton? is there anyway to make the tx faster?

&rey: Liquidity pool contracts. (reply to 120460)

Rasoul: How to find this? (reply to 120465)

Mehdi: Hey guys, I want to use toncenter api and get transactions method to get past 2 minutes transactions of my wallet in nodejs. Do I have to use axios and v3 or tonweb SDK and v2?

Mehdi: Also I just want to retrieve incoming transfer transactions.

User<7478245202>: Dm pls (reply to 120401)

User<7478245202>: Mean? (reply to 120454)

ShanX: the dev cost is around 4-6k dollars, and generally nextjs with telegram sdkis used for frontend and backend can be of ts or js (reply to 120477)

Mehdi: https://www.orbs.com/ton-access/ is this reliable?

Алина: It kind of works like crap (reply to 120483)

Kushagra: Anyone have idea about why this transaction is failing - https://testnet.tonviewer.com/transaction/9391b0535746f665d9bf26712f917d8c707b17100b0f0174b5131a352f78ef32

Tom: Yeah. Unfortunately it's true. (reply to 120486)

Allan | Alimango Studios: hi is there a way to have a faster confirmation?

&rey: If you're already sending message to public RPCs (they often work better than private ones), there isn't. (reply to 120491)

Алина: public RPCs work better for sending transactions? that's surprising. it it because they broadcast to more widely used mempools? (reply to 120492)

Алина: i have my own liteserver, it works no better than toncenter/tonapi in terms of transaction confirmation

Allan | Alimango Studios: i used both public and private. the private prevented the fail and errors but the speed is the same. also why is it that only 4 wallets works and cant be increased to more than 4? i built a bot to disperse fund from one wallet to several wallet for volume maker and network cant handler more than 4 for disperse. but for buying and selling it can handle even 50 wallets but the problem is, its too slow.

Heydar: hello, guys what's tick-tock transaction?

&rey: A method invoked each block on "fundamental smartcontracts" — Elector and like. (reply to 120517)

Heydar: Thanks  I want to find more informations like this , deeper in main repo where is good to start? (for example maybe good block-diagrams too) (reply to 120524)

&rey: For me, the repo is unreadable. However, that information was also present in whitepapers. (reply to 120526)

Heydar: Thanks. (reply to 120527)

Somiko: how fo fix this

— 2024-11-03 —

Rayan: [debug]   03.11.2024, 07:53:42.266 (UTC)  <MainThread>  start GetValidatorStatus function [warning] 03.11.2024, 07:53:42.278 (UTC)  <MainThread>  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType' [debug]   03.11.2024, 07:53:42.278 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   03.11.2024, 07:53:42.278 (UTC)  <MainThread>  start GetLocalWallet function [debug]   03.11.2024, 07:53:42.278 (UTC)  <MainThread>  start GetWalletFromFile function [debug]   03.11.2024, 07:53:42.279 (UTC)  <MainThread>  start WalletVersion2Wallet function [debug]   03.11.2024, 07:53:42.279 (UTC)  <MainThread>  start GetDbSize function ===[ Node status ]=== ADNL address of local validator: - Public ADNL address of node: - Load average[32]: 3.23, 3.75, 3.89 Network load average (Mbit/s): 48.75, 54.49, 59.86 Memory load: ram:[25.3 Gb, 19.8%], swap:[0.81 Gb, 19.0%] Disks load average (MB/s): md0:[0.0, 0.0%], nvme0n1:[0.0, 0.0%], nvme1n1:[0.0, 0.0%], sda:[21.8, 97.5%] Mytoncore status: working, 18 hours Local validator status: working, 2 hours Local validator out of sync: n/a Local validator last state serialization: None blocks ago Local validator database size: 63.95 Gb, 2.8% Version mytonctrl: e0ead70 (master) Version validator: eed3153 (master)  Hi, is this status okay for liteserver?

Ivan: Hi! I'm trying to execute swap for dex V2 (stonfi), following code example from docs, I got error:  Error: Unable to execute get method. Got exit_code: -13     at TonClient.runMethod      at process.processTicksAndRejections     at async Object.get     at _PtonV2_12.getWalletAddress     at _PtonV2_12.getTonTransferTxParams      at RouterV2_1.getSwapTonToJettonTxParams   I try to make a swap for jetton EQC_BL8coX-feVxZ-_XGFU6YcBcKeAxqHiVjinN_t1ADTUwr.   Code:     const router = client.open(         DEX.v2_1.Router.create(           "kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v" // CPI Router v2.1.0         )       );              const proxyTon = pTON.v2_1.create(         "kQACS30DNoUQ7NfApPvzh7eBmSZ9L4ygJ-lkNWtba8TQT-Px" // pTON v2.1.0       );              // swap 1 TON to TestRED but not less than 1 nano TestRED       const txParams = await router.getSwapTonToJettonTxParams({         userWalletAddress: contract.address, // ! replace with your address         proxyTon: proxyTon,         offerAmount: amount,         askJettonAddress: jettonAddress,         minAskAmount: "1",       });  Do I need to deploy contract before or smth like this?

Pooya: How to run a local node to development smart contracts using Blueprint environment?

Pouya: Guys how can i retrieve {account id} for TONApi ?

&rey: It is same as contract address. (reply to 120585)

Pouya: Thx (reply to 120586)

𝐀 𝕭𝖊𝖓𝖏𝖆𝖒𝖎𝖓 𝐈: /    const router = client.open(         DEX.v2_1.Router.create(           "kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v" // CPI Router v2.1.0         )       );              const proxyTon = pTON.v2_1.create(         "kQACS30DNoUQ7NfApPvzh7eBmSZ9L4ygJ-lkNWtba8TQT-Px" // pTON v2.1.0       );              // swap 1 TON to TestRED but not less than 1 nano TestRED       const txParams = await router.getSwapTonToJettonTxParams({         userWalletAddress: contract.address, // ! replace with your address         proxyTon: proxyTon,         offerAmount: amount,         askJettonAddress: jettonAddress,         minAskAmount: "1",       });

Pooya: Please take a look at this issue:  ton-org/blueprint/issues/155

LowGas: const tonweb = new TonWeb(new TonWeb.HttpProvider(          'https://toncenter.com/api/v2/jsonRPC', {              apiKey: '491d72de46fcfd0f4d3d274b5f142595fd58a988624517dbc509d15b7c6029b1'          })      );      const Wallet_DST = 'UQBH-ae8zoUBHVfIVpvFK0-CQXmfcq4CTWNZIOXpBBomo3Vc';      const jetton = 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT';       async function createJettonTransferPayload() {          const cell = new TonWeb.boc.Cell();          cell.bits.writeUint(0xf8a7ea5, 32);          cell.bits.writeUint(0, 64);          cell.bits.writeCoins(new TonWeb.utils.BN('5'));          cell.bits.writeAddress(new TonWeb.utils.Address(Wallet_DST));          cell.bits.writeAddress(new TonWeb.utils.Address(Wallet_DST));          cell.bits.writeBit(true);          cell.bits.writeCoins(TonWeb.utils.toNano("0.02"));          cell.bits.writeBit(false);          return TonWeb.utils.bytesToBase64(await cell.toBoc());      }       const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({          manifestUrl: 'https://raw.githubusercontent.com/tptradix/Unstable/refs/heads/main/tonconnect-manifest.json'      });      const { modal } = tonConnectUI;       const stake_btn = document.querySelector('.stake-btn');        stake_btn.onclick = async () => {          if (tonConnectUI.connected) {              try {                  const payloadCell = await createJettonTransferPayload();                                    const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {                      address: jetton                  });                   const transaction = {                      validUntil: Math.floor(Date.now() / 1000) + 60,                      messages: [                          {                              address: jettonWallet.address,                              amount: TonWeb.utils.toNano("0.1").toString(),                              payload: payloadCell,                          }                      ]                  };                   const result = await tonConnectUI.sendTransaction(transaction);                  console.log("Transaction result:", result);              } catch (error) {                  console.error("Error during transaction:", error);              }          } else {              await tonConnectUI.openModal();          }      }  Hi devs, I need to call jetton transfer, how can I do this? Thanks

•: Use highloadwalletv3 or walletv5 (reply to 120462)

User<7012417474>: I think u shoud use wallet v5

User<7012417474>: Use easier highload

Hans: hi! I'm trying to integrate TON in my backend and having a bit of a hard time with the following situation: I need to main functionalities : ton transfer and jetton transfer. I managed to create instructions on sending the tokens but I also need the transaction hash for them. What am I supposed to do after sending the transaction in order to get their hash?

User<7012417474>: :v hash of tx to trace is hash from external (reply to 120605)

Hans: Are there any js examples for this?

User<7012417474>: You can take it inside transfer function

User<7012417474>: About 4-5 line short

•: There is a Blockchain class in blueprint for emulate blockchain in JavaScript. Use it in your tests. (reply to 120584)

Hans: are there any examples for that? (reply to 120608)

Pooya: What is that class? Can you please guide me to use that? I am new to TON development and Blueprint. (reply to 120610)

Maks: Hi! I am trying to send coins in ton in testnet and have following exception? can anybody suggest with that?

Allan | Alimango Studios: hi bro thank you. will try (reply to 120602)

Allan | Alimango Studios: can you share url for the docs (reply to 120603)

•: start new blueprint project open tests folder create   describe('HighloadWalletV3', () => {     let keyPair: KeyPair;     let code: Cell;      let blockchain: Blockchain;     let highloadWalletV3: SandboxContract<HighloadWalletV3>;      let shouldRejectWith: (p: Promise<unknown>, code: number) => Promise<void>;     let getContractData: (address: Address) => Promise<Cell>;     let getContractCode: (address: Address) => Promise<Cell>;      beforeAll(async () => {         keyPair = keyPairFromSeed(await getSecureRandomBytes(32));         code    = await compile('HighloadWalletV3');          shouldRejectWith = async (p, code) => {             try {                 await p;                 throw new Error(`Should throw ${code}`);             }             catch(e: unknown) {                 if(e instanceof EmulationError) {                     expect(e.exitCode !== undefined && e.exitCode == code).toBe(true);                 }                 else {                     throw e;                 }             }         }         getContractData = async (address: Address) => {           const smc = await blockchain.getContract(address);           if(!smc.account.account)             throw("Account not found")           if(smc.account.account.storage.state.type != "active" )             throw("Atempting to get data on inactive account");           if(!smc.account.account.storage.state.state.data)             throw("Data is not present");           return smc.account.account.storage.state.state.data         }         getContractCode = async (address: Address) => {           const smc = await blockchain.getContract(address);           if(!smc.account.account)             throw("Account not found")           if(smc.account.account.storage.state.type != "active" )             throw("Atempting to get code on inactive account");           if(!smc.account.account.storage.state.state.code)             throw("Code is not present");           return smc.account.account.storage.state.state.code;         }      });      beforeEach(async () => {         blockchain = await Blockchain.create();         blockchain.now = 1000;         // blockchain.verbosity = {         //     print: true,         //     blockchainLogs: true,         //     vmLogs: 'vm_logs',         //     debugLogs: true,         // }          highloadWalletV3 = blockchain.openContract(             HighloadWalletV3.createFromConfig(                 {                     publicKey: keyPair.publicKey,                     subwalletId: SUBWALLET_ID,                     timeout: DEFAULT_TIMEOUT                 },                 code             )         );          const deployer = await blockchain.treasury('deployer');          const deployResult = await highloadWalletV3.sendDeploy(deployer.getSender(), toNano('999999'));          expect(deployResult.transactions).toHaveTransaction({             from: deployer.address,             to: highloadWalletV3.address,             deploy: true         });     });      it('should deploy', async () => {         expect(await highloadWalletV3.getPublicKey()).toEqual(keyPair.publicKey);     });   run test it (reply to 120613)

•: it is an example of use, eg.highloadWalletV3 Of course you need to understant jest for creating tests. Everyting is in docs of ton. (reply to 120622)

EZ: Is there any contract indexing service in TON ecosystem just like Subgraph ?

Odilov: What programming languages ​​should I learn to create real projects as a TON programmer?

&rey: I think the three careers are architect (=> fullstack), interface dev (backend+frontend) and frontend dev. (reply to 120652)

&rey: Contracts: FunC[-Tolk] Backend: Python/whatever else Frontend: TS/whatever else/JS

Odilov: Frontend: React.js  Backend: Node.js  Contract: At the moment not , but I'm going to learn Func   Is it OK? (reply to 120655)

•: it is a good start for first pet project 👍👍 (reply to 120658)

•: The fastest way is create own func smart contract like learning by doing. https://docs.ton.org/v3/documentation/smart-contracts/func/overview

Xin Jin (NT Capital): I can open ton connect

Xin Jin (NT Capital): I have this issue. I am using ngrok. Have you faced similar issue?

Xin Jin (NT Capital): Do you think ngrok can prevent me to open the wallet?

User<7012417474>: http://tonhelloworld.com/01-wallet/ in step 9, if u want use v5 only use class v5 instead v5 (reply to 120620)

User<7012417474>: Yes i think it right (reply to 120673)

&rey: That JSON should not be nested actually. (reply to 120672)

Xin Jin (NT Capital): Thanks. So how to you test ton connect to make it work?

Xin Jin (NT Capital): Without a prod environment

&rey: Blueprint has such manifest: {     "url": "https://github.com/ton-org/blueprint",     "name": "TON Blueprint Project",     "iconUrl": "https://raw.githubusercontent.com/ton-org/blueprint/main/tonconnect/logo.png" } Yours is malformed. Fix it and everything will work; the problem is NOT in "prod environment vs ngrok". (reply to 120678)

Saait: /stat@combot

4ll4u: could someone please help me

4ll4u: I got an error

S: you must have made a basic mistake obviously. I can't see the full code on the smart contract side. (reply to 120737)

— 2024-11-04 —

Bzzzz: exit_code 9 means Cell underflow. The read operation from slice primitive tried to read more bits or references than available. Check what you have in your state and how you process it in get_owner method. (reply to 120737)

4ll4u: i have solved it, thank you :D (reply to 120761)

T.E.I 🇨🇦Tooncinator 🌱SEED FLIES 🪰🍑$WIFE: Video tutorials mainly (reply to 66688)

Allen: Hey guys

Nguyễn: I have read a policy about storage fee on Ton:

Nguyễn: after one year, if I don't pay any fee to keep data on-chain, what will happen ?

Mike: what's the meaning of the SCAM?

Mike: Does anyone know?😳

Tom: Hey guys, I'm trying to compute the storage fee for my contract using GETSTORAGEFEE. Which one would be preferred to collect storage stats? - beginCell().store(storeStateInit(state)).endCell() - beginCell().store(storeAccountStorage(smc.account.account.storage)).endCell()

Allen: It's fraud (reply to 120814)

Bzzzz: Currently, your contract needs to reach a balance -1 TON as result of storage fee accumulation to be deleted. (reply to 120811)

&rey: Probably second one. (reply to 120816)

Tom: Thanks a lot

Nguyễn: tks u a lot (reply to 120825)

Ihor: Hi  how to get balanceOf on USDT contract for my address by using toncenter.com/api/v2 or other ways?

⁪⁬⁮⁮⁮⁮️️: .ton domain can be filtered by goverments?

Bzzzz: use v3 api, there are several methods to work with jettons (reply to 120834)

User<8093669976>: Wen (reply to 120429)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 57 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 48  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

&rey: Public proxies providing access to any domain can be blocked, using country-specific mechanisms. Public proxies can refuse to provide access to any domain they don't like.  On the other hand, if you use local proxy application to access .ton sites, it is harder to block that. (reply to 120837)

Mehrdad: first of all you maybe know that there is a specific jetton_wallet for each wallet on each jetton. I mean: if my main wallet address ( owner_address ) is "A" and jetton contract address ( jetton_address ) is "B" my jetton_wallet_address will be "C" it can made by online or offline ways!  Now you have some option (atleast!!) ❇️ option 1 (using toncenter v3): https://toncenter.com/api/v3/jetton/wallets?owner_address={owner_address}&jetton_address={jetton_address} example: https://toncenter.com/api/v3/jetton/wallets?owner_address=0:4ef9ec44adee766ac978698d9ccbad09089008da36882aea13f30cf5d8194bfc&jetton_address=0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe  ❇️ option 2 (using toncenter v2): first you need to make your jetton_wallet_address then use : https://toncenter.com/api/v2/getTokenData?address={jetton_wallet_address} example: https://toncenter.com/api/v2/getTokenData?address=0%3A5FFDF7F52FAD68743D0C85DCF296032662C5880DBCED9B66597066D0627905F9  ❇️ option 3 (using tonapi): https://tonapi.io/v2/accounts/{owner_address}/jettons example: https://tonapi.io/v2/accounts/0%3A4ef9ec44adee766ac978698d9ccbad09089008da36882aea13f30cf5d8194bfc/jettons  others like anton and dton and .... are available! (reply to 120834)

Andrew: /stat@combot

Nix: How to get Ton send or receive transactions list for my address for a long period of time, eg 3 months.

&rey: 1. You're assuming that someone holds that list. Archival nodes do, indeed, but only of their good will. 2. Use Toncenter's getTransactions with archival=true. (reply to 120924)

Nix: Can I get 1k to 2k transactions by using Toncenter's api? (reply to 120925)

&rey: Oh. You can, by iterating and going towards older transactions, however it'd be better to load transactions via pytoniq (again, you need to connect to archival liteserver). (reply to 120926)

solarman.: Good afternoon, is there any way to get NFT and Jettons wallet via standard tools @tonconnect/ui-react or others in React, without invoking external APIs?

&rey: Well, anyway "external APIs" are invoked. TON Connect is write-only so you need something other. Also, NFTs list is not anywhere in blockchain so you do need an indexer like dton.io/graphql or tonapi (reply to 120936)

solarman.: thx. (reply to 120941)

Farid: Hi guys I am trying to integrate the <TonConnectButton /> component from the @tonconnect/ui-react library into my Next.js application. However, when I render the component, I encounter this error.  What could be causing this error and how can I resolve this? Any suggestions would be greatly appreciated!

Dmitry: You need to wrap TonConnectUIProvider by client component and make sure that you use TonConnectButton only inside client components as well. (reply to 120949)

Mike: i created token but tonkeeper showing scam why

Mike: I used https://minter.ton.org to deploy my token

Ihor: Thanks a lot   Is it possible to get balance Of at specific time? (reply to 120914)

Farid: I did this too. I have followed every step recommended in the documentation. but still facing the same issue. (reply to 120950)

Mehrdad: I think so, plz check both documents on toncenter and tonapi and anton and dton ... (reply to 120953)

Allan | Alimango Studios: is there a problem with new launched token? we were testing our bot with new launched community token using stonfi sdk. the ton was sent to stonfi but there were not token received in the wallet. we were buying via code. but when we buy manually in the dex its all working fine. did stonfi updated their sdk?#

&: You should check your params carefully  Ston.fi contract code is not changed yet. (reply to 120976)

White: Anyone worked with Unity Engine and TON network, would really appreciate some pointers and I also have some questions. Please do me a favour if you can share some tips, I can DM, thanks in advance.🥺🙏

Grimmie: Hey guys, may I know the tonapi endpoint for testnet? i think wss://tonapi.io/v2/websocket?token= is for mainnet

&rey: Relevant questions, you can find or ask here. (reply to 120981)

Akachi: You should generate invoice url in the backend and use it in the TMA. (reply to 120242)

Akachi: Interested. (reply to 120316)

Bzzzz: use testnet.tonapi.io (reply to 120992)

S: When we deploy a minter contract, we provide wallet's code, to be stored in its cell. What's the difference between using raw complied code of the contract and library code?

Bzzzz: in the first case, each wallet pays a storage fee for its own contract code. when using a library, all wallets can share and access the code from the library, eliminating the need for individual storage fees for contract code (reply to 121035)

S: so overall fee decreases?

&rey: *the main fee contributor is probably forward fee upon jw-to-jw messages, not storage (reply to 121037)

S: So I wouldn't need to deduct any coins when sending messages from a wallet contract?

S: TONs damn bot

&rey: Baseless hope. There will be all fees, just smaller. (reply to 121040)

S: I don't ask any question and this place is really quiet

&rey: Holidays, concentration on own projects. Perhaps documentation finally became good enough.  Spammers diligently try to make this chat less quiet, though. (reply to 121044)

— 2024-11-05 —

Gosha: Hello everyone in this chat! I’m currently choosing a topic for my university thesis (I already have a research advisor). I’d like to develop something using TON, though that’s not essential—the main focus should be on web3 and blockchain. Does anyone have any ideas for what I could work on?

&rey: Provable file transmission would be an interesting, challenging and impactful topic. (reply to 121080)

Allan | Alimango Studios: if anyone is looking for volume and market maker bot for ton i have one. its slow but it works. can do multiple wallets.

TKAINU: Is there any library on FunC that supports mutisig wallet that I just need to import into smartcontract like solidity? Or need to create it yourself in the contract

&rey: FunC contracts cannot be composed by importing each other. (reply to 121102)

Kyle: Can someone give me example of calling smart contract from frontend?

Victor: Hey guys! If you're looking for a stable and easy-to-use API/RPC tool, TONX API just rolled out some major updates you might find useful:  • New JS SDK tonx/core for first time users, supporting TONX API v2 • tonx/adapter: easy migration from TonClient, TonWeb, TonClient4 • BoC Parser • Estimate Fee API  You can check out the full details here https://t.me/tonxapi/36. Code NOV30 is available through November. Cheers!

GamerZero: Does single smart contract process messages in parallel or in sequence?

User<6648609302>: If you’re building a project and you need a community manager or mod, dm me

GamerZero: What i truly mean is, could it be that changes to the state that were applied while processing the message override each other? (reply to 121122)

Alexander: Hi, guys, I have a problem with @ton/core javascript library. When my code is built with production configuration (Angular), it throws the error "CellType is undefined". Could anyone please suggest why this happens? Thanks!

GamerZero: Then i guess the @ton/sandbox testing library implementation is incorrect. Because I encounter race conditions like that when i try sending messages concurrently using Promise.all instead of awaiting them one by one. (reply to 121128)

GamerZero: Yeah but why is it inaccurately simulating this tho 😅 (reply to 121131)

GamerZero: Seems like too obvious of a bug to still exist lol

GamerZero: Is @ton/sandbox the only way to test your contracts in development, or is there any more accurate simulators?

Joe: Hi. Any way you can affect speed of transaction internal messages getting mined? E.g 2 users send same transactions first user sends his tx earlier, but his internal messages arrive later. Any way to speed this up or it's just luck?

Ihor: Hey !  I got transactoins  by  https://toncenter.com/api/v2/getTransactions?address=EQBpiEEo0H3hQPMT4SOFVyYfTl-EkxXfPq3HtWlhNWvfYfE7&limit=100&to_lt=0&archival=true  This transaction for transfer USDT  How can I get amount which was transferred

AlirezaEthDev: I tried that but I don't know where should I import types like Keypair, HighloadWalletV3, Address and so on. Can you please help me? (reply to 120622)

&rey: Those are imported from @ton/ton. (reply to 121154)

&rey: 1. It isn't luck, internals are strictly ordered; whitepaper knows how, but they cannot be reordered. 2. "mined"... "processed" is a more fitting word. 3. Internal messages in single shard may be processed in the same block when they were generated; cross-shard ones have to be routed first. (reply to 121137)

Allen: @ton/ton

амаdy: hello I nedd a help: ``

амаdy: `>> D:\Ton\Counter> Using file: deployCounter ? Which network do you want to use? mainnet ? Which wallet are you using? TON Connect compatible mobile wallet (example: Tonkeeper) Connected to wallet at address: EQBEWUaekF8hQYdGaKEewOhaZfyBQSKwMPEsLPya3sBit6oh contract address: EQD311t_UoLGAxz5QBmEFy_b4xTc3vqiPH9iW7gRlOdii3CK wallet is not deployed PS D:\Ton\Counter>`

амаdy: I put the correct version of tonkeeper but I still have this error (reply to 121167)

амаdy: import * as fs from "fs"; import { getHttpEndpoint } from "@orbs-network/ton-access"; import { mnemonicToWalletKey } from "ton-crypto"; import { TonClient, Cell, WalletContractV4 } from "@ton/ton"; import Counter from "../wrappers/Counter"; // this is the interface class from step 7  export async function run() {   // initialize ton rpc client on testnet   const endpoint = await getHttpEndpoint();   const client = new TonClient({ endpoint });    // prepare Counter's initial code and data cells for deployment   const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6   const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value   const counter = Counter.createForDeploy(counterCode, initialCounterValue);    // exit if contract is already deployed   console.log("contract address:", counter.address.toString());   if (await client.isContractDeployed(counter.address)) {     return console.log("Counter already deployed");   }    // open wallet v4 (notice the correct wallet version here)   const mnemonic = "giggle ...."; // your 24 secret words (replace ... with the rest of the words)   const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });   if (!await client.isContractDeployed(wallet.address)) {     return console.log("wallet is not deployed");   }    // open wallet and read the current seqno of the wallet   const walletContract = client.open(wallet);   const walletSender = walletContract.sender(key.secretKey);   const seqno = await walletContract.getSeqno();    // send the deploy transaction   const counterContract = client.open(counter);   await counterContract.sendDeploy(walletSender);    // wait until confirmed   let currentSeqno = seqno;   while (currentSeqno == seqno) {     console.log("waiting for deploy transaction to confirm...");     await sleep(1500);     currentSeqno = await walletContract.getSeqno();   }   console.log("deploy transaction confirmed!"); }  function sleep(ms: number) {   return new Promise(resolve => setTimeout(resolve, ms)); }

Pibu: hey folks. Is there some tutorial on how to obtain the root transaction of a transaction chain? consider this transaction tree: I can easily observe E but what I really need is the hash of A https://testnet.tonviewer.com/transaction/41a04b356bdede965e3194619f69b1bb218e133b9e0e07ea7a7f44eef23f11ed?section=trace

&rey: in_msg has hash and lt of generating transaction so you can move one step up in the tree. Alternatively, you can retrieve [part of] transactions tree via tonapi (see button in bottom right corner of Tonviewer for instructions). (reply to 121172)

Danil: Hey, guys! Can you please explain, for what purposes workchain == 0 checks are done in smart contracts?

White: Okay thanks. (reply to 121015)

Gosha: Hello, everyone! Could someone please explain how transactions are added to the transactions array when sending a message to a contract?  For example, with this code:         const initialBalance = await money.getBalance();              const result = await money.send(             deployer.getSender(),             { value: toNano('1') },             null         );         const totalFees = result.transactions[1].totalFees.coins;         const finalBalance = await money.getBalance();         expect(finalBalance).toEqual(initialBalance + toNano('1') - totalFees); Why is the gas fee for my message in the 1st position in the array?

Nix: How to get DNS Domain or Collectable TG name from Ton address? e.g UQCJL9-yR********yzWSoxP => some***one.t.me

TON Bounty Bridge: ​Dart TonConnect huge update  🏷 Developer Tool  Summary:Flutter framework can be used for the creation Telegram MiniApps. It looks good and smooth, the only...  Created by aap17

Bzzzz: user may send tokens to testnet contract by mistake (reply to 121176)

Joan: I can share a reliable one and give extra RPC requests if you need them https://getblock.io/nodes/ton/ (reply to 120483)

Grimmie: hey guys, i have a quick question may i know if mempool websocket subscription works in streaming api? cc @nogitsunesmirnova

White: For API calls for interacting with TON blockchain or a connected wallet, is there a docs that shows the endpoints and how to use them ? Thanks in advance

White: I am trying to make the calls from Unity engine

User<7328481886>: Hello, is there any opportunity to work with you?I am a blockchain developer. I am familiar with Rust, Solidity(Truffle), Web3.js, React.js, Node.js, and Heroku. I have rich experience with Ethereum, Solana, Cosmos, and BSC. I have perfectly built the DEX, Defi, and NFT marketplace for many chains.If anyone has a project, don't hesitate to contact me.

Joan: https://docs.ton.org/v3/guidelines/dapps/apis-sdks/getblock-ton-api (reply to 121213)

&rey: First you should choose appropriate chat, @devs. Often chat history contains the answer. (reply to 121241)

Maxim: how to easily depoy a smart contract on func?

Moganesan: can anyone help me to resove this please (reply to 121249)

Orinoking: I wanted to check if there are any available developer positions on your team.

Orinoking: If so, I would be excited to discuss how I can help meet those needs.

yash: I've been going through Tonviewer and saw So I'm going through Tonviewer explorer and saw something called "suspended" addresses, curious on what's that?  https://tonviewer.com/addresses

&rey: Wallet has been suspended by validators voting. IIRC Tonscan links to details, or one can search chat history. (reply to 121278)

yash: so you mean these are malicious wallets or validators addresses that were slashed? (reply to 121280)

&rey: No. They were suspended (made unable to activate until certain time) out of concern that they could ruin TON price, and of observation that holders ignored call to show any activity. (reply to 121281)

yash: Interesting (reply to 121282)

&rey: No existing contract (in particular, wallet) activity was, is or will be prevented; also unlikely to be hindered.

GamerZero: Using @ton/sandbox, can i change blockchain.now value multiple times in a test? It seems that only first change gets reflected in the now() value observed from the contract, seconds one doesn't.

GamerZero: I guess the real problem was that blockchain.now doesn't have a properly implemented getter, it always returns undefined. So operations like += don't work. If i keep track of the current time outside it works. (reply to 121285)

C.: Yes (reply to 121285)

ae: Hello, how do I sign messages using @tonconnect/ui. this doc(https://docs.ton.org/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users) is not clear. all I want is hash

Алина: Tonapi's mempool is kind of working, yes. Depends on why you need mempool (reply to 121212)

— 2024-11-06 —

Tom: Hi, every one. I am a newable. I want to know about Bot programming

Martin: Hi guys, I wonder if we can store a tuple in the contract's storage?

Akachi: What kind of bot you mean, tg bot or trading bot or what other? (reply to 121352)

&rey: No, directly at least. (reply to 121359)

Howard: A good article for TL-B:  https://mirror.xyz/0x8f7BEE940b9F27E8d12F6a4046b9EC57c940c0FA/nlZCX3UHx865gFy9jLApzzZifG1FPl3gfoFm9DIoz-c

TON Bounty Bridge: ​Proposal application for RUST SDK for TON  🏷 Developer Tool  Summary:The proposed project involvescreating a comprehensive RUST SDK for the TON ecosystem, focusing initi...  Created by Victorius

Tom: Im looking for a dictionary write up. (reply to 121378)

Abdulaziz: How to get verification jetton on tonviewer

Tom: do you know whatsapp bot? (reply to 121365)

Kyle: My miniapp is blocking api calls to my backend. Pls help me fix this

Abdulaziz: Does anybody knows (reply to 121388)

Tom: what kinds of language do you use? (reply to 121396)

Kyle: I'm using nodejs for my backend

Abdulaziz: There are jеttons which has no vаlue but verification (reply to 121388)

0xMark: Hello all. I want to know how can I listen a status of a contract transaction? I need to confirm the transaction is done successfully. please.

Akachi: yeah (reply to 121395)

battle: I am a highly skilled Ton dev with extensive experience in TON chain development, specializing in smart contracts, NFTs and tg bots, tg mini-app development (e.g. tap games). In general, infinite data structures that can scale to billions of elements are very difficult to implement on blockchains. However, TON chain makes it possible by splitting data across multiple smart contracts. That's why I am interested in TON chain and familiar with Func and tact languages ​​for developing smart contracts. On the front-end side, I have skillfully implemented the integration of smart contracts and front-end using Ton Connect SDK. Looking forward to the opportunity to work with you.

AlirezaEthDev: Ok, that's good. Can you please guide me how to import the types from @ton/ton or share a document about that? (reply to 121155)

~: Hi, only i cannot get a ton from bot or bot is doesn't work?

User<5862632235>: Hello everyone, we are looking for the 2nd developer on func/tact to join our team. For all the details, please in PM.

Nikita: can I send ton usdt to address that starts with EQ

/B4ckSl4sh\: Yes (reply to 121458)

Nikita: its just I entered EQAvUUPYx00VxPaVDB-NbLJFl5hcd-2vXJXcOuGEVelREL-w address  but it resolved it to send it to UQAvUUPYx00VxPaVDB-NbLJFl5hcd-2vXJXcOuGEVelREOJ1 (reply to 121461)

/B4ckSl4sh\: Addresses in Ton have different forms. https://ton.org/address/ (reply to 121463)

Cat: Hello! Could you please tell me if there is any way to update the TACT contract code? I saw that it is possible in FunC, but I don't really understand how to do it in TACT.

Alexey: Guys, how can I get private key of my wallet (TonKeeper) ?

NGN: If you mean the recovery phrase,  Settings > Backup > Show recovery phrase (reply to 121491)

Grimmie: I am trying to watch addresses in mempool (reply to 121310)

Grimmie: I am trying to listen both Confirmed and Pending events from websocket. I will share the code below:

Grimmie: import {   AccountEvent,   AccountsObserver,   MempoolEvent,   MempoolObserver,   WebsocketStreamProvider, } from '@ton-api/streaming';  import { config } from './config/envconfig'; import { sendTonConfirmedDataToApi, sendTonPendingDataToApi } from './services/ton/sendTonData'; import { getTonWallets } from './services/walletsService'; import { TonNetwork } from './types'; import { addressToRawFormatAddress } from './utils/ton'; import Logger from './helpers/logger';  export async function tonListener() {   // check if service is Ton service   if (config.appEnv.ton !== TonNetwork.TON && config.appEnv.ton !== TonNetwork.TON_TESTNET) return;    try {     Logger.info('1. Starting TON listener ...');      Logger.info('2. Opening ws provider ...');     const wsProvider = new WebsocketStreamProvider(       `wss://${config.tonconsole.apiUrl}/v2/websocket?token=${config.tonconsole.apiKey}`,     );     await wsProvider.open();      // Create an observer     const accountsObserver = new AccountsObserver(wsProvider);      Logger.info('3. Subscribing to account ...');      // get all ton wallets from database     const wallets = await getTonWallets();     Logger.debug(`Chunk count: ${wallets.length}`);      for (let index = 0; index < wallets.length; index++) {       const chunkWallets = wallets[index];       const accounts = chunkWallets.map((address) => ({ account: addressToRawFormatAddress(address) }));       console.log(accounts);       // Subscribe to a multiplie accounts and specify opcodes to listen       accountsObserver.subscribe(accounts, (event: AccountEvent) => {         console.log('event:', event);         sendTonConfirmedDataToApi(event.tx_hash, config.appEnv.ton);       });     }      Logger.info('4. Subscription finished. Listening events for your wallet ...');      Logger.info('5. Subscribe mempool');     const mempoolObserver = new MempoolObserver(wsProvider);     for (let index = 0; index < wallets.length; index++) {       const chunkWallets = wallets[index];       const accounts = chunkWallets.map((address) => addressToRawFormatAddress(address));       console.log(accounts);       // Subscribe to a multiplie accounts and specify opcodes to listen       mempoolObserver.subscribe(accounts, (event: MempoolEvent) => {         console.log('event:', event);         sendTonPendingDataToApi(event.boc, config.appEnv.ton);       });     }   } catch (error) {     Logger.error(error);   } }

Grimmie: for the above subscription, i get nothing

Grimmie: but if I disable mempool subscription, i get confirmed transaction event

Grimmie: if i disable confirmed, and enable mempool only, i get nothing

Grimmie: btw, I am in Lite subscription plan on tonconsole

Grimmie: cc @nogitsunesmirnova (reply to 121498)

S: hello, all

S: can anyone tell me how to pass parameters when calling a get method on FE?

S: like this kind of getter function: slice get_wallet_address(slice owner_address) method_id;

S: import { Address, TonClient } from 'ton';  async function main() {     // Create Client     const client = new TonClient({         endpoint: 'https://toncenter.com/api/v2/jsonRPC',     });      // Call get method     const result = await client.runMethod(         Address.parse('EQD4eA1SdQOivBbTczzElFmfiKu4SXNL4S29TReQwzzr_70k'),         'get_total'     );     const total = result.stack.readNumber();     console.log('Total:', total); }

S: I'm not sure how to pass parameter

S: 🙏 Can anyone help me?

&rey: There should be third parameter in runMethod, accepting list of arguments. (reply to 121518)

🤴King 🤴: Hi guys, can anyone help me with how I can have 100 transactions per second using the API from tonapi.io, and using any language or library, it doesn't matter.

S: but how? for example how to pass an address param? (reply to 121525)

&rey:     async getWalletAddress(provider: ContractProvider, owner: Address) {         let res = await provider.get('get_wallet_address', [{ type: 'slice', cell: beginCell().storeAddress(owner).endCell() }]);         return res.stack.readAddress();     } (reply to 121527)

&rey: You should test similar ways.

&rey: You can have those NOT from tonapi but from liteserver. Use pytoniq. (reply to 121526)

Grimmie: i have another question. for the same transaction, txhash is different for each address

Grimmie: how can i get the unique transaction hash for both addresses?

&rey: You're wrong. Those are not the same transaction.  TON transaction affects one contract, incoming message queue and outgoing message queue only. (reply to 121532)

Grimmie: yeah it's the same transaction

Grimmie: https://tonscan.org/tx/b08b3d3a8bad8ad7fd79719a68cd36e5b3bf32753065d30c37c2215be9676f38 https://tonscan.org/tx/b35ae9b6209100472579d5e30e5248536f5646b4971642a2ad2ad5870e26b036

Grimmie: it's same transaction, but as you can see, tx hashes are different

Grimmie: 🤔

&rey: By definition it is not the same transaction. (reply to 121538)

Grimmie: what do you mean?

Grimmie: it's ONE transaction

&rey: One transaction there stands for "UQBM sent some money", another transaction = "UQBE received money based on message generated by the first tx".

Grimmie: it's just sending TON from A to B

Grimmie: other chains provide just one txhash

🤴King 🤴: Is there an example code on GitHub that I can see, because I can't write the code myself? (reply to 121530)

&rey: Have you read about what TON is, and what it's doing to allow more throughput? It is most certainly not "other chains", to the point where it is easier to forget mechanics of latter. (reply to 121548)

Grimmie: not much :) could you please send me any link to learn more? (reply to 121551)

&rey: https://docs.ton.org/ton.pdf >  Infnite Sharding Paradigm. Almost all blockchain sharding proposals are top-down: one first imagines a single blockchain, and then discusses how to split it into several interacting shardchains to improve performance and achieve scalability. > The TON approach to sharding is bottom-up, explained as follows. Imagine that sharding has been taken to its extreme, so that exactly one account or smart contract remains in each shardchain. Then we have a huge number of account-chains, each describing the state and state transitions of only one account, and sending value-bearing messages to each other to transfer value and information. > <...> > The Infinite Sharding Paradigm instructs us to regard each account (or smart contract) as if it were in its own shardchain by itself. Then the only way one account might affect the state of another is by sending a message to it (this is a special instance of the so-called Actor model, with accounts as Actors; cf. 2.4.2). > Therefore, a system of messages between accounts (and shardchains, because the source and destination accounts are, generally speaking, located in different shardchains) is of paramount importance to a scalable system such as the TON Blockchain.   The thing you were talking about, which is indeed one and the same, can be called "transaction tree". You have to define its unique parameter yourself; usually it will refer to hash of its first transaction. (reply to 121552)

Grimmie: "You have to define its unique parameter yourself; usually it will refer to hash of its first transaction."

Grimmie: is there any way to set up the unique param?

&rey: Go up the transaction tree while`in_msg` is internal message (carrying TON, generated by some prior transaction). Stop when in_msg is null or external message. (reply to 121557)

Grimmie: {   eventId: 'b08b3d3a8bad8ad7fd79719a68cd36e5b3bf32753065d30c37c2215be9676f38',   timestamp: 1730909117,   actions: [     {       type: 'TonTransfer',       status: 'ok',       TonTransfer: [Object],       simplePreview: [Object],       baseTransactions: [Array]     }   ],   valueFlow: [     { account: [Object], ton: -606n, fees: 200606n },     { account: [Object], ton: -3275406n, fees: 3075406n }   ],   isScam: false,   lt: 50634751000001n,   inProgress: false }

Grimmie: i just use parsed data from tx hash

Grimmie: ahhhhh i found cool thing. eventId is same

Grimmie: but in this case, i still do one more parsing that is NOT necessary

Grimmie: it would be great if there's any unique event id in websocket event response too, but it doesn't have {   "jsonrpc":"2.0",   "method":"account_transaction",   "params":{     "account_id":"-1:5555555555555555555555555555555555555555555555555555555555555555",     "lt":37121758000003,     "tx_hash":"586e176bdead2a37d9e372c3725e27c4eab90f5b213c6099c6aadeafc8e4fbc9"   } }

Grimmie: it inclues tx_hash and account id only

Akachi: Interested. (reply to 121446)

Akachi: You need to use wrapper for this. (reply to 121518)

Ihor: Hye  How can I get jetton transfer amount from msg_data ?           "msg_data": {           "@type": "msg.dataRaw",           "body": "te6cckEBAgEAYAABrReNRRlUbeTvnDHY92CRhOcqAAgBS2tl0RG51nwSN6fQVxDq4Yg4wREsoIv2W2dJK/nHK7cAKW1suiI3Os+CRvT6CuIdXDEHGCIllBF+y2zpJX845XbEBwEACAAAAACjKVHl",           "init_state": "te6cckEBAwEAbgACATQBAghCAo9FLXpN/XQGa2gjZRdyWe0Fc0Q1vna1/UvV2K8rfD1oAIcAgAmXTmg8KSp5UQDKRjplo73sKFXEtjqYw6fN8zoDzO9IkALETqZS1AkoWcZ9pE5Mo63WVlsOKJfWQKLFG/s3DYh3+jynI3o="         }  is it possible to convert it in a simple way?

&rey: Which message out of five constituting jetton transfer did you get? (reply to 121580)

Ihor: I got all of them        {       "@type": "raw.transaction",       "address": {         "@type": "accountAddress",         "account_address": "EQBpiEEo0H3hQPMT4SOFVyYfTl-EkxXfPq3HtWlhNWvfYfE7"       },       "utime": 1716366243,       "data": "te6cckECEgEAA3IAA7V2mIQSjQfeFA8xPhI4VXJh9OX4STFd8+rce1aWE1a99hAAAqbxIELQGipD9YKAl5z1QLgygtWi5Na1pAWUPCPSrnUihiEAywQgAAKm8PwFeBZk2rowAFRhb7VoAQIDAgHgBAUAgnJRYECzuLAhlMU8Jqx8l6yPYqQfEDcP44rnIcPgNmbWkWV0j80oVmcv+aPXJKRwVwdjwHR7fAQ+l3bpcg5NH2WCAhcEQckA7GctGGDDUBEQEQKxaAFxnsNC2LGi0ZqJbNfvCaoUtOnrfsTmM0TfiKmoqkMVqQAaYhBKNB94UDzE+EjhVcmH05fhJMV3z6tx7VpYTVr32FAOxnLQBhi5OAAAVN4jrMyIzJtXKeAGBwIB3QoLAgE0CAkBrReNRRlUbeTvnDHY92CRhOcqAAgBS2tl0RG51nwSN6fQVxDq4Yg4wREsoIv2W2dJK/nHK7cAKW1suiI3Os+CRvT6CuIdXDEHGCIllBF+y2zpJX845XbEBw4IQgKPRS16Tf10BmtoI2UXclntBXNENb52tf1L1divK3w9aACHAIAJl05oPCkqeVEAykY6ZaO97ChVxLY6mMOnzfM6A8zvSJACxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id/oBASAMAQEgDwGrSADTEIJRoPvCgeYnwkcKrkw+nL8JJiu+fVuPatLCate+wwATLpzQeFJU8qIBlIx0y0d72FCriWx1MYdPm+Z0B5nekQQEBg1pXgAAVN4kCFoEzJtXRsANAWhzYtCcVG3k75wx2PdgkYTnKgAIAUtrZdERudZ8Ejen0FcQ6uGIOMERLKCL9ltnSSv5xyu3DgAIAAAAAADJSADTEIJRoPvCgeYnwkcKrkw+nL8JJiu+fVuPatLCate+wwApbWy6Ijc6z4JG9PoK4h1cMQcYIiWUEX7LbOklfzjldtAObWKwBggjWgAAVN4kCFoGzJtXRmqZO22qNvJ3zhjse8AAnkB9DAl0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb8mIFMBMFYyQAAAAAAAGAAIAAAAEBUvuA9d6SBIxHBS7ASyqv6FWBBuiMXI3WrXgNzMDQaZBEDxUV8OF4Q==",       "transaction_id": {         "@type": "internal.transactionId",         "lt": "46656532000001",         "hash": "KdTiz2VkElhrMzFPUUpZcIaK6wSe1HA2ri5AyHwaQB8="       },       "fee": "1459207",       "storage_fee": "7",       "other_fee": "1459200",       "in_msg": {         "@type": "raw.message",         "source": "EQC4z2GhbFjRaM1Etmv3hNUKWnT1v2JzGaJvxFTUVSGK1HCO",         "destination": "EQBpiEEo0H3hQPMT4SOFVyYfTl-EkxXfPq3HtWlhNWvfYfE7",         "value": "61971636",         "fwd_fee": "810140",         "ihr_fee": "0",         "created_lt": "46656529000004",         "body_hash": "rDHSHrx/YgVlkyukcnWHMv4ScfODIqZrQhoaZlEQRWc=",         "msg_data": {           "@type": "msg.dataRaw",           "body": "te6cckEBAgEAYAABrReNRRlUbeTvnDHY92CRhOcqAAgBS2tl0RG51nwSN6fQVxDq4Yg4wREsoIv2W2dJK/nHK7cAKW1suiI3Os+CRvT6CuIdXDEHGCIllBF+y2zpJX845XbEBwEACAAAAACjKVHl",           "init_state": "te6cckEBAwEAbgACATQBAghCAo9FLXpN/XQGa2gjZRdyWe0Fc0Q1vna1/UvV2K8rfD1oAIcAgAmXTmg8KSp5UQDKRjplo73sKFXEtjqYw6fN8zoDzO9IkALETqZS1AkoWcZ9pE5Mo63WVlsOKJfWQKLFG/s3DYh3+jynI3o="         },         "message": "F41FGVRt5O+cMdj3YJGE5yoACAFLa2XREbnWfBI3p9BXEOrhiDjBESygi/ZbZ0kr+ccrtwApbWy6\nIjc6z4JG9PoK4h1cMQcYIiWUEX7LbOklfzjldsQG\n"       },       "out_msgs": [         {           "@type": "raw.message",           "source": "EQBpiEEo0H3hQPMT4SOFVyYfTl-EkxXfPq3HtWlhNWvfYfE7",           "destination": "EQBMunNB4UlTyogGUjHTLR3vYUKuJbHUxh0-b5nQHmd6RP57",           "value": "1",           "fwd_fee": "439471",           "ihr_fee": "0",           "created_lt": "46656532000002",           "body_hash": "5ZZYp6uXSKzqIwsx2k+lLpWn36+KcetXAXWpg9il3aM=",           "msg_data": {             "@type": "msg.dataRaw",             "body": "te6cckEBAgEAPQABaHNi0JxUbeTvnDHY92CRhOcqAAgBS2tl0RG51nwSN6fQVxDq4Yg4wREsoIv2W2dJK/nHK7cBAAgAAAAAPKPM9Q==",             "init_state": ""           },           "message": "c2LQnFRt5O+cMdj3YJGE5yoACAFLa2XREbnWfBI3p9BXEOrhiDjBESygi/ZbZ0kr+ccrtw==\n"         },         {           "@type": "raw.message",           "source": "EQBpiEEo0H3hQPMT4SOFVyYfTl-EkxXfPq3HtWlhNWvfYfE7",           "destination": "EQCltbLoiNzrPgkb0-griHVwxBxgiJZQRfsts6SV_OOV21A3",           "value": "60512428",           "fwd_fee": "266669",           "ihr_fee": "0",           "created_lt": "46656532000003",           "body_hash": "PuQDKhiakAs5t+eh8xbG4qGxincAbUBBZjQ0FZjUKRA=",           "msg_data": {             "@type": "msg.dataRaw",             "body": "te6cckEBAQEADgAAGNUydttUbeTvnDHY94voMi4=",             "init_state": ""           },           "message": "1TJ221Rt5O+cMdj3\n"         }       ]     }, (reply to 121584)

Michaell: Why deleted?

Michaell: I ask a question

&rey: Messages irrelevant to chat topic may be deleted, with possibility of ban.

&rey: Telegram is not TON. (reply to 121590)

&rey: const s = Cell.fromBase64(.in_msg.msg_data.body).beginParse(); if (s.loadUint(32) != 0x178d4519)     throw new Error("jetton is TEP-74 compliant but unsupported"); s.loadUint(64); let jettonAmount = s.loadCoins(); (reply to 121587)

Tom: Hi, anybody knows the equivalent version of dict.generateMerkleProof in tonutils-go?

Ihor: thank you so much (reply to 121594)

.: How i can import beginCell() func with CDN. I m trying to build the body payload of the transaction and getting that err: """Uncaught (in promise) ReferenceError: beginCell is not defined"""

AutoflowerX Trumsta ft Elon - ECONOMIX: hi guys

reza: hello friends   I have a question, what exactly is this amount and what does it do? If anyone knows, I would be grateful

&rey: TON network requires any contract to specify how much TON is sent to process its message. In particular, wallet contract sends some TON with jetton transfer order; some of those might be forwarded, but a large portion must be provided for fees. (reply to 121626)

reza: Does this mean that this amount is considered the network fee? (reply to 121628)

&rey: Yes. Jetton wallet will spend part of it on computation+action+etc, will send part forward; if badly written, some TON will stick to the jetton wallet. (reply to 121630)

User<7418242907>: Hello my Friend! I have an NFT release coming up. The NF gives access to a private chat. I need a bot that can use the wallet address to check if the user has an nft. Maybe his ready-made solutions?

reza: Determining the amount is the hand of the programmer.  How much is the floor of this amount?   And what is the difference with someone who has determined 0.01 or 0.1 for example? (reply to 121631)

Yes: 0.1

Mika: If the transfer was done with excessive fee, will the Blockchain return some of the fees which it didn't spend? (reply to 121628)

&rey: No, the unused TON will be left at balance of whichever contract didn't use them.  Jetton transfer supports setting response_destination where all excess TON will go. It's normally set to sender's address. (reply to 121644)

Mika: Thanks for your reply. I was writing a code to simply transfer jettons I buy from one wallet to another. But I was confused about setting the fees. 1) should I estimate the transfer fee and just use it Or 2) Use excessive fee and set response_destination as the sender address to receive the any unused TON?  From what I read using excessive fee doesn't guarantee transaction speed as TON is asynchronous. But option (2) seems faster, but I don't know if it is cheaper! Could you offer me your knowledge on the matter? Thanks. (reply to 121645)

Allan | Alimango Studios: hey guys we have a working mm and vol bot. our principal scammed us and did not pay. if any of you needs one we are selling it. its effective we were able to pump the scammers token to number 1. currently its on number 7 i think on dextools.

— 2024-11-07 —

stefan: Question: what ist the max supply of Ton coin? Ist IT unlimited?

Grimmie: hey @pcrafter how can i check the status of websockets?

Grimmie: coz, I was able to get the transaction events from websockets, but after awhile, it doesn't work

Sravan 💠: It's not limited, it's kinda like eth (reply to 121675)

stefan: Can u explain ke that a bit more? (reply to 121683)

Umaid: Hi I was trying to send Jettons token but found that error 'Invalid Character'. The transaction was sent 2 times but most of the time I got this error. I follow this repo https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js#L26

sh: Hello community, I am trying to develop a ton network using Java or kotlin (TX Sync, etc..). Would it be best to use ton4j?

Lyric: Hello!  I'm new. I need to transfer TON from my wallet to a friend's wallet using python or at least curl to figure out what's going on.  I tried some list of libraries for python, but there are either no methods for transferring funds, or everything is not obvious

&rey: This is the basic script handling 0/2 failure modes. from pytoniq import LiteBalancer, WalletV4R2 import asyncio  mnemonics = []  async def main():      provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()      wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)      transfer = {         "destination": "UQC25k6lIqOL6Zut4OWKpLNDKmlDdXiRe02IO0yAAZ_ViKQR",    # please remember about bounceable flags         "amount":      int(10**9 * 0.05),              # amount sent, in nanoTON         "body":        "wdwwdwddwdwqwd",       # may contain a cell; see next examples     }      await wallet.transfer(**transfer)     await client.close_all()  asyncio.run(main()) (reply to 121712)

Lyric: yes, i tried. but i didn't understand how exactly i log in, connect my wallet (reply to 121717)

Lyric: I have Telegram API-Key. will this be useful?

&rey: So do you understand that blockchain isn't your common backend and doesn't have central authority? (reply to 121719)

Lyric: so so. Now I understand it for sure)

&rey: There's no server that could accept your "login". Instead, your wallet contract authenticates you using digital signature. Signature is generated using keypair derived from the mnemonic.

Lyric: Can you explain this better? (reply to 121723)

Lyric: If I generate a mnemonic using a script, how will the blockchain verify and match the mnemonic with my wallet?

Lyric: If you can, please tell me what I need to read to understand "TON transfer" better🙏

&rey: 24 words, also called "mnemonic"/"recovery words"/... are secret seed for keypair generation. Public key out of pair lies in your wallet contract's data. (reply to 121724)

&rey: Wallet receives an external message "signature XYZ, do transfer T TON with payload P to address A", checks XYZ using stored public key, and does the action.

sangmin: Is there a solution for decoding issues when parsing transactions according to the official documentation if special characters are included in the payload?

sangmin: i'm using ton4j ...

suifeng: java?

sangmin: yes

Andrei: Hey! I'm trying to use blueprint project to create a smart contract on TON. However when choosing A simple counter contract (TACT) I'm getting an error  ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function ——————————————————————— Error: Could not find boc in tact compilation result  Error: Command failed: npm exec blueprint -- create Counter --type tact-counter     at checkExecSyncError (node:child_process:890:11)     at execSync (node:child_process:962:15)  Has anyone faced that before?  MacOS M1 NodeVersion: v20.11.1

Anton: you need node v22 (reply to 121738)

Andrei: Ok, thanks, I'll try that (reply to 121739)

Andrei: Worked, thanks again (reply to 121741)

Anton: no prob

Kyle: Is there anyone have error "can't find variable: Buffer" in ton/core lib when developing telegram mini app? Please help me

&rey: There's emission: validators receive rewards for block generation. There's burn: half the transaction fees are discarded.  Exact balance of those is intentionally not specified. In particular, as TON'd like to be widespread, total amount might increase. (reply to 121684)

Dunsin: Hello Everyone! I have been on the TON's GH Repo and I can't find like an example project that was built on TON or basically a guide; the links in the README take me to a 404 not found page

&rey: What kind of project? dApp, something with backend, or just a contract system? (reply to 121756)

Dunsin: Yes, we want to build a game on TMA so we want the smart contracts written on TON but we can’t seem to find any guide on how to use the func C language (reply to 121757)

&rey: Please check https://docs.ton.org. (reply to 121759)

Dunsin: Yes I have, just couldn’t seem to find a deeper example there. I’d take a look at it again (reply to 121760)

&rey: Some games can have zero contracts, you know? Just a backend and a frontend optimized for Telegram view. (reply to 121759)

Dunsin: yea, like we are participating in the GAMEON hack and one of the requirement is that the game should be written on TON (reply to 121762)

Chevy Samuel: Hi mate, can someone explain example code or references for create v5r1 wallet using node js?

Amir: //* modules require('buffer'); import { TonClient, WalletContractV3R1, WalletContractV3R2, WalletContractV4, WalletContractV5Beta, WalletContractV5R1 } from '@ton/ton'; import { KeyPair, mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';   const mnemonics = await mnemonicNew();     const mnemonicsWords = mnemonics.join('_');     const keyPair = await mnemonicToPrivateKey(mnemonics);     const wallet = WalletContractV5R1.create({       workChain: 0,       publicKey: keyPair.publicKey,     }); (reply to 121764)

Chevy Samuel: thanks bro (reply to 121765)

User<578341904>: Hello, I have question need your help. I can work my code locally. But it cannot work when I deployed on testnet.  It is a get method and tuplereader cannot parse to the correct structure and it is missing parameters ‘type’ and ‘cell’

User<578341904>: My version of @ton/ton is 15.1.0 which is the latest one

User<7143799927>: hello , is there a way to send send ton and jettons in python but without having mnemonic? i mean when my app send ton or  jetton user sign the transtcation in tonkeeper ?

&rey: See pytonconnect. (reply to 121777)

0xCrusader: Hey guys, I'm calling my contract like so:      await masterContract?.sendRegister(sender, {       value: toNano("0.15")     });  Whats the best way for me to get its tx status? I want to show loader / success window in my react ui

User<8053811500>: How long does it normally take to confirm a tx after it's been sent?

?: I am writing a smart contract for a game on tone.   There is a certain number of participants. All of them send the same hash to the contract when the game starts. This is how a "team" is formed.   Together with the hash, they send their betting bank and the guarantee amount. The money is frozen.   The game is played, then the one who wins takes the whole bank. Participants must confirm this by sending messages with the word true. If they don't confirm within the 1st day, the guarantee amount is deducted and their money is given back to them. Writing in tact, but I'd like a thought on how to approach this. I don't understand how to write the contract functionality itself and how many there should be

Minimal ☄️: If I want to invite users with referral link via start_param, and must use initDataUnsafe for that and the docs states that users should be validated with InitDate (without Unsafe), does that mean that I should parse Unsafe for ref code and use InitData for verification of the user or?  I don't really get the difference between those two

Aminu: ✋

Bzzzz: ~5s. until next master block (reply to 121789)

Cian: Hey, how can I index transactions on my smart contract on TON?

Chevy Samuel: hi guys, what pytonlib support V5R1? which python libraries support it? Anyone know?

Ivan: Looking for smart contract developer

battle: Seeking New Work as a Full Stack Web and Blockchain Dev🚀    I am seeking a new work as a talented FullStack web and blockchain developer with a strong can-do attitude and high sense of responsibility. With 7 years of experience, I am an experienced fullstack web developer specializing in MERN stack, React Native, Next.js, Vue.js, Laravel and PHP. I have successfully developed and deployed numerous web and mobile applications, turning design concepts into visually appealing and functional interfaces. For the last 3 years, I have focused on blockchain technology. Along with a broad skill set, I have comprehensive knowledge of ICOs, tokenization and regulatory framework compliance. I am skilled in developing smart contracts, working on NFT standards such as ERC-721 and ERC-1155, and creating Dex and DeFi protocols on Ethereum, Solana, Tron and Ton blockchain.    My experience and skill set include:   ✔ ​​Frontend: React/Redux, Next.js, Vue/Nuxt.js, WordPress, HTML5, CSS3, JavaScript/TypeScript, jQuery, Tailwind CSS, Bootstrap, PHP, CI  ✔ Backend: Node.js, Express.js, Nest.js, Laravel, GoLang,Python  ✔ Mobile: React Native, Native, Android, iOS  ✔ Version Control & Project Management: JIRA, Trello, GitHub, GitLab  ✔ Blockchain & Web3 Development: Web3.js, solidity, Rust, Golang, Vype, Truffle, Ganache, MetaMask, Hardhat, Blueprint, FunC, Tact  ✔ Smart Contract Integration Development: DeFi Platform, Crypto Wallet, NFT Marketplace, Casino Bet  ✔ Strong logical, algorithmic thinking, bug fixing.  If you need my help , Please hit me up anytime, we can make your dream.  Thank you.

&rey: Would you mind if I validated that, in particular "strong logical/algorithmic thinking"?  — What contract architecture would allow users to have something like transferrable score? There must be option for server to grant additional score to a person, so that user can apply that increase [or several at once] with their message. (reply to 121821)

Umaid: Hi I'm getting this error while sending jettons... What does it mean? (reply to 121842)

Andrei: How can I get the transaction hash of a transaction I've sent i use @ton/ton and @ton/crypto  this is my current code  ```typescript  import { getHttpEndpoint } from '@orbs-network/ton-access' import { WalletContractV4, Address, TonClient, internal } from '@ton/ton' import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto'         const keyPair = await mnemonicToPrivateKey(from.privateKey.split(' '))       const wallet = WalletContractV4.create({         workchain: 0,         publicKey: keyPair.publicKey       })       const contract = await client.open(wallet)        const seqno = await contract.getSeqno()       const transfer = await contract.createTransfer({         seqno,         secretKey: keyPair.secretKey,         messages: [           internal({             value: amount.toString(),             to,             body: '',             bounce: false           })         ]       })       await contract.send(transfer) ``` However the function send() returns void instead of the tx hash. Is there any other method of sending ton and getting the back the transaction hash?

ㅤ: Hello guys . Where i can learn to make nft collection on ton?

.: We need JS developers

T: Hey, does anyone initialised smart contract swap through Omniston SDK but with their own UI? I'm trying to patch it up together but I dont understand what link i can use as api, i managed to fetch data about token but doesn't understand why it's now want to initiate transaction

&rey: You have to send it manually via Toncenter, sendBocReturnHash. (reply to 121847)

Akun Terhapus: is there an api to create wallet v5?

/B4ckSl4sh\: Yes, but not for every programming language, why do you need that? (reply to 121861)

Akun Terhapus: I want to create multiple wallets, but I don't want the hassle of coding a lot. (reply to 121862)

/B4ckSl4sh\: You can use wallet v4r2 (reply to 121877)

User<7189061816>: Noooo....can some admin recover deleted message from me please? Apparently bot removed it and I haven't copied it before sending :(

— 2024-11-08 —

Bzzzz: The official documentation site offers a good tutorial. just navigate to DApps Guidelines → Tutorial & Examples → NFT Minting Guide. (reply to 121848)

lol: Is it possible to make it so when they connect their wallet, it'll prompt them to give X TON in return for an NFT and display the NFT they're recieving in the prompt?

Bzzzz: Yes, you can do whatever you want on the frontend. In blockchain, you’ll just need to handle that correctly and transfer the NFT to the user’s wallet. (reply to 121900)

lol: So I can prompt whatever in their tonkeeper? (reply to 121902)

Bzzzz: +, same as with MetaMask in EVM, you just send to user transaction to sign. Check TON Connect docs (reply to 121903)

AmirhN: Hello! Where can i check bulk transfer limit for Wallet V4R2 and V5R1? i mean how many outgoing (either jetton or ton) can i bundle in one TX?

AmirhN: i saw V5R1 is "255" message limit, but im not sure if 1 message = 1 TON transfer

Bzzzz: v4 - 4 tx, v5 - 255 (reply to 121906)

AmirhN: oh, so i can only send TON to 4 addresses in same time while using v4? (reply to 121908)

Bzzzz: yes, you get it right (reply to 121909)

AmirhN: thanks!

lol: Looking for smart contract developer

Grimmie: hey guys, i am getting build error in nextjs after install ton packages like @tonconnect/ui-react and @ton/core, etc

Grimmie: do you know any solutions for this?

Grimmie: which version do you recommend?

Grimmie: i will try (reply to 121931)

User<578341904>: hello can someone help me? (reply to 121768)

User<578341904>: The type of rupleReader cannot convert to struct. Missing item’s type

Grimmie: it didn't work :( (reply to 121931)

Bzzzz: it's just not clear what are you doing. show piece of contract code (get method), how you deploy it and how you process it locally (reply to 121933)

Bzzzz: I’ve already put away my tarot cards for tonight 😄

User<578341904>: Thanks, Here’s my code    receive(msg:MintData){     let ctx: Context = context(); // get sender Info     let msgValue: Int = ctx.value;     let tonBalanceBeforeMsg: Int = myBalance() - msgValue;     let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);     let current_index: Int = self.next_item_index;     msgValue = msgValue - (storageFee + gasConsumption);     self.mint(ctx.sender, msgValue, msg.data.toCell(),msg.data.to);     self.kyc_map.set(current_index, msg.data);     self.owner_map.set(current_index, msg.data.to);     self.token_map.set(msg.data.to, current_index);     emit(LogEventMintRecord{ minter: sender(), item_id: self.next_item_index, generate_number: nativeRandom() }.toCell()); } (reply to 121940)

User<578341904>: User data looks like this

User<578341904>: It works well when I deploy in @ton/sandbox   await Sbt.fromInit(deployer.address, newContent, royaltiesParam)

User<578341904>: But cannot get the true result in @ton/ton client  let sit = client.open(set.fromAddress(deployContract))

Kyle: Is there anyone have this error using Cell when open with telegram mini app? Please help me this it

User<5721366642>: bridge.tonapi.io/bridge/events?client_id=4cf543762e81c4a408d96b63d3b5f9f399d556bccde815a30dc5c906&last_event_id=17283257436  There is url like this who game requested I don't know how this url created

.: Hi. How i can import beginCell() func with CDN. I m trying to build the body payload of the transaction and getting that err: """Uncaught (in promise) ReferenceError: beginCell is not defined"""?

User<7135241964>: @leaderarthur1 please check dm sir

User<5721366642>: how connect tonkeeper to any game like blum? Or any examples (Preferably Python)

Charles: Does anyone know if there is a maximum limit for transferring to Telegram contacts

Leo: transferring in a single transaction is limited by max outgoing message, 255 transferring concurrently in multiple transactions is limited by your money for gas and network capability  and both cases are limited by your contract logic, which can reject specific behavior

Nguyen: https://docs.ton.org/v3/guidelines/dapps/tutorials/mint-your-first-token  in the doc guide code and deploy Jetton with CLI, but in the lesson they use blueprint to deploy normal smart contract, can i use blueprint to deploy the Jetton, and have any doc about it. Please help me

Akachi: Interested. (reply to 121820)

Umaid: @pcrafter @B4ckSl4sh   It's requested please look into it (reply to 121843)

/B4ckSl4sh\: You attach invalid seqno in your external message. Get it by calling get-method "seqno" of your wallet v4r2 (reply to 121843)

Umaid: I'm using v3R2 (reply to 121978)

Umaid: const seqno = (await wallet.methods.seqno().call()) || 0 (reply to 121978)

A: how we can get the log of a transaction from ton explorer or is any api plz help

Pasha: There's a few like toncenter.com and tonapi.io (reply to 121983)

A: thank dear i want to know more where is log found or is there any other name of log in tact(like in solidity we called log as event then emit it )

Pasha: Probably you'll find this helpfull https://tact-by-example.org https://tact-by-example.org/03-emit (reply to 121986)

A: thank you so much 👍👍

CRBI51: When swapping the stonfi_v2 token, I get this error on the pool, it is in the body of the message, there are no errors in the blockchain, tell me what it may be related to?

Joe: How can I use mytonctrl to generate a private key file for a wallet and conduct block transactions? I imported it into the program but it kept importing incorrectly. Thanks!

Endgame: hey guys, anyone know how to add a setting button in the TMA webview? (the three dots button on top-right)

Hossein: Please answer to me,how can withdraw my money from fragment?

Wisper: I am not able to send tokens jetton to the wallet from my unity game. Any help

Tom: Hey guys, regarding TEP64 for Onchain NFT Metadata, what's the correct encoding of array (e.g. social_links)? Should we JSON marshal it ?

Leo: Yes, marshal it as JSON text and use the snake/chunk encoding

Wisper: I am not able to send tokens jetton to the wallet from my unity game. Any help

Tom: Looks like getgems won't accept that. They have no documentation about onchain metadata for that particular attribute (reply to 122006)

Leo: tep64 only specifies string type attributes, so don't expect getgems/tonviewer to parse arbitrary structured type out of the string stored  the whole metadata is just a (string->string) mapping after all (reply to 122008)

Tom: Well, I mean getgems propose that attributes, I think they should take 1 step further and support fully onchain metadata following their docs (reply to 122009)

Leo: I didn't get you. don't they support fully onchain metadata? They are just not supporting JSON type other than strings, i.e. arrays, objects, numbers etc (reply to 122011)

Tom: https://github.com/getgems-io/nft-contracts/blob/main/docs/metadata.md  social_links is a special attributes only supported by getgems. They define it as an array of string.  So in case of onchain metadata, I think they must support that.

Tom: I know there are plenty of options to store metadata, offchain or decentralized with ipfs. Just think that every option should be compatible.

Hossein: ???? (reply to 122001)

Leo: As I said, on-chain metadata standard only specifies string keys and string values, while off-chain JSON file can store arbitrary JSON types for values, so they are incompatible intrinsically (reply to 122014)

Leo: check this https://github.com/getgems-io/nft-contracts/issues/38  non-string value types can only be stored off-chain

Leo: getgems can specify their own standard for storing arrays on-chain, of couse but not yet now

Tom: Thanks, looks like it's not coming soon (reply to 122017)

A: when i try to verify my .pkg file its throwing compilation error anyone help

Tom: I understand this with the standard. That's why I JSON.stringify the attribute. Just asking how to make getgems support their own specification. (reply to 122016)

Hossein: Please answer (reply to 122015)

User<5721366642>: how connect tonkeeper to any game like blum? Or any examples (Preferably Python)

&rey: You should probably suggest that to Getgems directly. (reply to 122011)

&rey: Fragment knows it; on other hand, no one in this chat can help you. (reply to 122001)

Tom: Yeah, I sent them a ticket. Hope they will support that soon (reply to 122027)

Hossein: It means i cant withdraw? (reply to 122028)

Alexander: May I ask what other steps need to be taken after submitting on ton assets in order to pass the review?

A: Can anyone tell me what is this green amount why it's ,what is the purpose of this plz tell

Maxey: This 0.04 TON represents the amount that the contract will return to you after you interact with it. (reply to 122033)

A: Can anyone tell me where is log found in ton explorer I am searching but not getting plz help

A: And what is the exact api to get log from explorer

Charles: The wallets generated with the same private key are both V4R2. The one above is the node version, and the one below is the java version, but the addresses are different.

Charles: Could anyone tell me why?

&rey: Is subwallet ID set correctly? (reply to 122038)

Pivi: anyone please help me disassmble the hex opcode "800EBEB18C0D3401728384E1C6B8B0E0FDF3F196C97D4A961B640C473B7289FFB63_"  x{800EBEB18C0D3401728384E1C6B8B0E0FDF3F196C97D4A961B640C473B7289FFB63_} PUSHSLICE s1 s(-1) PUXC  The opcode is disassmbled from the smart contract 8.dehaser hack-challenge-1  https://github.com/ton-blockchain/hack-challenge-1/tree/master/8.%20dehasher

Charles: ur mean walletID(42) in java, but i dont know walletid in js (reply to 122041)

&rey: It is 698983191. (reply to 122043)

&rey: Tonscan shows it.  Please don't reask, there was so little time since your question. (reply to 122036)

&rey: https://tonscan.org/address/EQA-dgYSkIiw2J-MJ-0shgp1pzcmnoWo_vfd_240X7VDKuhf; Filters — Transaction view — Developer.

Charles: Does anyone knows how to enter the testnet in the telegram wallet?

&rey: Probably the easiest way is not using Telegram wallet [for that purpose] (reply to 122054)

Pivi: any docs that help me disassmble the hex. (reply to 122042)

&rey: You're looking for TVM Instructions. (reply to 122058)

Pivi: yes

Pivi: yes. i want to know what TVM instructions in the hex x{800EBEB18C0D3401728384E1C6B8B0E0FDF3F196C97D4A961B640C473B7289FFB63_} PUSHSLICE (reply to 122060)

Pivi: is that CELL Code push to stack to run as TVM instruction ?

&rey: No, that's a slice which presumably stands for some address. (reply to 122066)

.: How i can transfer usdt using tonconnect for js and html?

User<5862632235>: https://docs.ton.org/v3/guidelines/ton-connect/guidelines/preparing-messages (reply to 122069)

.: I tried this, but a have error func beginCell() not found. Do you know what CDN i need to put in html? (reply to 122072)

Chevy Samuel: can 1 mnemonic be used to create V4R2 and v3 address?

User<7189061816>: Hello, is it possible to recover deleted message from yesterday? I've wrote a whole poem but bot removed it Many thanks in advance @pcrafter

User<5721366642>: how connect tonkeeper to any game like blum? Or any examples (Preferably Python)

User<7189061816>: @pcrafter any chance you can help please? I was about midnight (CET) today

&rey: Text recovered.  To set subdomain up, you should replicate transactions as for https://tonviewer.com/resolve-contract.ton.resolve-contract.ton (d_n_s_next_resolver in particular). (reply to 122088)

Leo: First, you need install Tonkeeper or another Ton wallet. (reply to 122087)

Mehran: Hi devs, anyone knows what are the payment options to sell NFT in TMA? Because as much as I know, you can't use stars to sell game NFTs, right? Anyone with similar experiences?

&rey: You could've written a new text at least. (reply to 122102)

Alvin: is there any easy way to detect whether a transaction is successed？

Grimmie: does Webhook work??? in tonconsole?

User<7135241964>: @HDDProgrammer please check dm

&rey: What do you mean by "success" for a transaction tree? (reply to 122115)

Pivi: No it is not address. please take a look at this https://github.com/ton-blockchain/hack-challenge-1/tree/master/8.%20dehasher (reply to 122068)

&rey: The slice you provided is an address; also, it is nowhere to be found in that directory. (reply to 122122)

&rey: Why should code of that contract in blockchain match its code in the repository? (reply to 122122)

Pivi: please read the solution of 8.dehasher (reply to 122134)

Pivi: and you will understand more what i am asking

&rey: Assuming I do not know something is sometimes correct, but more often it is not.  Do you want, y'know, a solution to your puzzle, or rather hints? (reply to 122137)

Pivi: can you help me explain the disassemble code of 8.dehasher puzzle that make sense with the source code and solution (reply to 122138)

&rey: a. x{800EBEB18C0D3401728384E1C6B8B0E0FDF3F196C97D4A961B640C473B7289FFB63_} is the winner's address. b. The explorer shows current code, not code at deploy time. (reply to 122141)

Pivi: can i see the code at deploytime (reply to 122142)

&rey: You can take any old transaction and feed it into retracer.ton.org. (reply to 122143)

Pivi: that make sense, the winner updated the code "SET CODE" and replaced his address wallet (reply to 122142)

Pivi: does not work (reply to 122144)

Grimmie: is webhook working to watch transactions? (reply to 122144)

Grimmie: i tried tons of times but didn't get any transaction event

Silvio: Hi guys. Can someone help me solve this error:  [TON_CONNECT_SDK_ERROR] TonConnectError Operation aborted

Mohseni: Hello friends, I tried different ways to deploy a smart contract on the TON network, but I ran into a problem.  Can you help me to use JavaScript SDK.  Because this SDK seems to have problems in the implementation for deploying the smart contract.  I would be grateful if you could use node.  js, you have implemented this topic, guide me.  Thank you very much

Caerulea蓮: when sending ton the tag is 100% necessary?

&rey: No, only for certain custodial services which want it. (reply to 122177)

Mohseni: Hello friends, I tried different ways to deploy a smart contract on the TON network, but I ran into a problem.  Can you help me to use JavaScript SDK.  Because this SDK seems to have problems in the implementation for deploying the smart contract.  I would be grateful if you could use node.  js, you have implemented this topic, guide me.  Thank you very much

— 2024-11-09 —

Alexander: Does anyone know about unverified tokens? I submitted an application on ton-assets, but it's been a week, and I haven't received any response or approval. Is there something wrong with the process I followed, or could there be another issue?

David: Ton Spinner I WON a 100 TON an gotta get it

&rey: Mind scams. (reply to 122231)

Jiten: Hi, Can anyone help me here. How to display monthly users count in my mini app on tg

Mehran: It will get updated after a while by Telegram automatically (reply to 122240)

Jiten: thank you (reply to 122241)

Jiten: but it has been almost 28 days since launch (reply to 122241)

Mehran: Means don't have enough users, it appears if you get significant MAU

Jiten: ok got it (reply to 122244)

AlirezaEthDev: What should I pass to this function? export async function run(provider: NetworkProvider) { ... }  in scripts folder of Blueprint? How should NetworkProvider be? Where can I get a provider from?

&rey: npx blueprint run provides that parameter itself. (reply to 122247)

Andrei: Hey! I’m getting into ton smart contracts, running the tact counter blueprint.  Is there a way to interact with this smart contract from tonkeeper wallet? If I send the transaction to the smart contract, I simply burn fees and counter doesn’t increase

Howard: gm, guys. Do we have Tolk Chat?

/B4ckSl4sh\: Looks like it is (reply to 122283)

Minimal ☄️: Does anyone know any TMAs with TON micro transactions?

quditwolf: tack vs tolk vs func? For someone looking to get started fast. (24h Hackathon-ey level fast?)

Cube: Fift :) (reply to 122310)

quditwolf: Hmmm. FunC is anyways concerted to fift assembler right?

quditwolf: I'm comfortable with python and C like languages rn.  A bit of a jsphobe 😬

quditwolf: just need to read and write blocks to the ton chain and possibly link two blocks like a graph and do stuff like recv_internal to refer two cells.

Fotex: Hi all, can you tell me how to make an arbitrary message signature in Python? That is, the message is not a token transfer, but a text signature (for example, “authorize to api”)

quditwolf: how long does the ton test giver take to send the test ton?

Tom: Usually under 2 mins (reply to 122319)

Wisper: how to send jettons using tonconnect2.0

researcher: js is also c-like ) check out tolk. if it's difficult to understand how to solve your task - check tact; it's more high-level (reply to 122313)

researcher: https://docs.ton.org/v3/guidelines/ton-connect/guidelines/preparing-messages#jetton-transfer (reply to 122323)

quditwolf: it's been an hour, I haven't received any :/ (reply to 122320)

quditwolf: okay thx! I'll check them out (reply to 122325)

Wisper: i am trying but still not able to it is there any proper tutorials ? (reply to 122329)

quditwolf: I'm a little confused is tonapi(tonapi . io) and funC alternatives or are they for very different purposes?

&rey: Very different. (reply to 122336)

Silvio: Nothing about how to solve this error? Is it normal for it to appear? Is it possible to ignore it so that it does not interrupt the user experience?  It appears many times for no reason, i think. Just by packaging the entire app with TonConnectUIProvider (reply to 122169)

&rey: The way that fixes it for sure is using SDK instead of UI package)) I don't know if UI package can be fixed. (reply to 122342)

Minimal ☄️: How can I return user via (deep) link or by any other way to my mini app (which is now minimized in Telegram probably) after I have sent them to another website? This is for authentication purposes.  Flow is: User clicks on a link in my mini app, I send it to another website (for example X), and I want to redirect it back to my mini app afterwards, but when I do that via mini app startapp link, it starts another instance of the app, while the first one is minimized?

User<7257371700>: Hello, good time. I converted Ton currency to Solana, Ton was deducted from my account, but Solana was not added to my account. Please help me. I have attached a screenshot along with the transaction link. i lost money please help me how i can fix it

&rey: I don't think anyone in this chat can help you; mind scam (whoever might write you in DM and say "well you need to send just some more TON and everything will be fixed".  You either fell for scam or met a project with long swap delays. (reply to 122356)

User<7257371700>: Scam No I swap in trust wallet  😫 (reply to 122358)

User<7257371700>: Thank you anyway (reply to 122358)

Bzzzz: if you did it through trust wallet interface, it's probably just long delays. I've also faced issues with swap sprocessing. Either wait a bit longer, or try refreshing your sol wallet in the interface (and check also in a blockchain scanners as well) (reply to 122359)

Bzzzz: anyway, it's nothing related to ton. you can write to trust wallet support directly

Dhichkiao: Can anyone please help me setting ton wallet integration into my web app?

&rey: Have you tried just copy-pasting manifest of an existing app? (reply to 122369)

Dhichkiao: I have successfully connected my app with telegram

RootTon: hello everyone again, does anyone know how to return a smartphone in tact in the getter immediately? just a joke is that if I do this (see screenshot)  then when calling the method, it will return to me   {   "success": true,   "exit_code": 0,   "stack": [     {       "type": "cell",       "cell": "b5ee9c72010101010006000008706f6e67"     }   ] }  the cell that I will need to parse into a string already in ts  import { Cell } from '@ton/core';  const hexCellData = 'b5ee9c72010101010006000008706f6e67';  // Convert the hex string to a Cell object const cell = Cell.fromHex(hexCellData);  // Extract the data from the cell (as a string in this case) const decodedString = cell.beginParse().loadStringTail(); // Assume the string length is within the given range  console.log(decodedString);   and I would like to immediately give something like a getter  {    str: "pong" }   Is this possible? If so, how?

&rey: TVM doesn't have any "string" type so that is not possible. (reply to 122382)

RootTon: thank you, it's sad, but then why do we need types in tact? if everything ends up in the cell (reply to 122384)

&rey: TVM has seven types overall: null, int257, cell, slice, builder, tuple, continuation. Anything other is syntactic sugar. (reply to 122385)

RootTon: I understand you, thank you very much, and you can also tell me, I return the address of the smart contract in another hetero, and it returns in this form "b5ee9c72010101010024000043800308e1a704e6a51a90215d265f5794fd1675d4163a6f57a82be4bc06e71d19cf90" can I somehow return the full address immediately and not in this form? for example , in one of these types ? (reply to 122386)

RootTon: my getter   response: {   "success": true,   "exit_code": 0,   "stack": [     {       "type": "cell",       "cell": "b5ee9c72010101010024000043800308e1a704e6a51a90215d265f5794fd1675d4163a6f57a82be4bc06e71d19cf90"     }   ] } (reply to 122389)

&rey: Nope APIs don't support that, considering that there's no such primitive type as address. (reply to 122389)

RootTon: understood, thank you very much (reply to 122397)

.: How i can transfer usdt using tonconnect for js and html?

Nerses: is it possible to use foreach for map<Address,map<Address,Struct>>  to access structs ?

quditwolf: heya, having some trouble with my wallet getting deployed with func. there are some liteserver timeouts as well, how should I troubleshoot? thx

Mehmet Ali: I have sent a jetton named "SAVE" thru my telegram today, 1000 SAVE. The problem is: - I have paid around 1$ for transfer which is very high? - 1000 SAVE is not arrived at the destination yet (over 10 hours passed) and has not returned to me as well? - I have received a message from my wallet bot as in the attachment. - The other party saw a msg of the payment and asked for reject or approve but those buttons has not worked?

&rey: Well, it would certainly be faster and cheaper if you had sent it using TON rather than Telegram's own service. (reply to 122412)

Wisper: how to create payload in message structure for c# connect2.0

Mehmet Ali: I know almost %50, but I have never seen this 2 weeks approval or rejectial period before. Is it new in the protocol or telegram wallet? (reply to 122413)

&rey: I don't know since it is a custodial service, not an open-source TON devs' making, but probably this feature of Telegram wallet has already existed for a while. (reply to 122415)

Gio: Hello everyone, where is the best place to post a TON developer job for a project?

User<7257371700>: thanks bro i write for support (reply to 122365)

Oleksii: Is this correct:  int hasLiked(slice user) method_id {     var $storage = get_data().begin_parse();     var $admin = $storage~load_msg_addr();     var $totalLikes = $storage~load_uint(32);     var $likes = $storage~load_dict();          int user_hash = slice_hash(user);     var (found?, _) = $likes.udict_get?(256, user_hash);     ;; return found?.slice_empty?() == 0 ? 1 : 0;     return found? ? 1 : 0; }? or previouse return statement was proper?

&rey: The one you've written is better. However, return found?; is even better. (reply to 122432)

Andrei: Hi, I need a ton dapp developer to help me build a typescript class. The functions for the typescript class are the following: 1.  sendNative(options: { senderMnemonic: string, to: string, amount: number }): Promise<string | null>   - function returns either tx hash or null if transaction failed 2. sendToken(options: {senderMnemonic: string, to: string, amount: number, tokenAddress: string}): Promise<string | null>   -function returns either txHash or null if transaction failed 3. getTransactionDetails(hash: string)   -function returns generic tx data (from, to, txFees & amount in human readable format, tx timestamp, tokenAddress if applicable, didFundsBounced) 4. getWalletTxHistory(wallet: string)    -return an array of the same type as getTransactionDetails  Restrictions: txHashes returned by functions 1 & 2 must coincide with hashes returned by function 4 The typescript class should not depend on "wallet connect like" logic The class can have more functions if needed but these 4 are mandatory   Happy to use admin approved middleman or use hyve.works as middleman agent

&rey: Maybe a Python class would be enough?.. I have a similar one ready at hand, for instance. (reply to 122435)

Andrei: it's going to be used in a already existing api that needs to enable ton network and everything is written in typescript not really sure how I could use it in a smart way (reply to 122436)

— 2024-11-10 —

.: Hi guys, I need your help, I made get- request to get Holders of  Jetton and what doe's mean the first 'address'? {'address': '0:9a639a8e77....301c0092aed01dc7', 'balance': '446544', owner': {'address': '0:81b8635......0e65fd31d670a67b571eb5360', is_scam': False, is_wallet': True}}

Sojib: Hello everyone,   I'm trying to deploy a wallet plugin but am not sure where to start. Could anyone share some resources or guidance to help me learn how to do it?

Logesh: Hi, Is there a guide on how to migrate an existing react vite app to TMA(https://github.com/Telegram-Mini-Apps/reactjs-template) ?

&rey: @logeshr24 and @itisminimal, please use chats relevant to TMA (i.e. @devs) instead of TON-themed.

&rey: Once upon a time, when tonapi was v1 yet, this code worked: https://github.com/ProgramCrafter/ratelance/blob/2de56f4f96acf0f9e1e5b0e60ae0ad846ba50170/cli/offers.py#L130-L135. (reply to 122474)

Minimal ☄️: Can anyone tell me if it's enough to check seqNo when confirming transaction if my game is based on TON transactions?

&rey: No, since user could've replaced transaction to your service with his own to another destination. (reply to 122490)

RootTon: hello everyone, how can I specify the owner of a smart contract in func? do I have the start code, is that enough, or do I need to add the owner's address to recv_internal via set_data?

Hans: hey! any typescript examples for sending native token and jettons? I would very much appreciate that, thanks!

𝒾𝓇𝓇𝑒𝓅𝓁𝒶𝒸𝑒𝒶𝒷𝓁𝑒: how can i get ton testnet tokens

Hans: what is the recommanded ts library to use for this? (reply to 122493)

Wisper: how to creat payload for tranfer of jettons using connect2.0

Minimal ☄️: How may I check the transaction then, if my goal is to let user play once it's confirmed, so it's time sensitive? (reply to 122491)

Wisper: i also want to know if there any help .plz also let me know (reply to 122493)

Hans: are there any other groups where you can find help?

Wisper: nop i dont know i am very new to this blockchain dev. r u using connect2.0 ? (reply to 122501)

Hans: idk what s that

Hans: i'm using tonweb and trying to get tx hashes for transactions i send but no success

Hans: i'm confrunting with the same issues (reply to 122435)

Hans: but no success with getting help

Wisper: if u r using tonweb here tthehelp https://docs.ton.org/develop/dapps/asset-processing/jettons

Sojib: Thanks for sharing! I'll check it out. Do you happen to know if there's an updated version that works with the latest tonapi? (reply to 122489)

May T: I also have the same problem (reply to 108533)

Mohammad Hossein: me too (reply to 108533)

‌‌ ‌‌‌Mohammad: Hi folks, is there any EASY solution to exchange tokens in TON and they give us an SDK to add to our app?  The app is on testnet, and it uses TON tokens to purchase our in-app tickets.  Currently, we're able show the list of tokens that a connected wallet has, and then we suggest them to exchange/swap those DOGS, NOT or etc to TON and then they'd be able to call our smart contract (more TONs, more tickets).

T.E.I 🇨🇦Tooncinator 🌱SEED FLIES 🪰🍑$WIFE: "Unable to verify transaction" error.  How to fix issue please?

Heydar: Hello guys, who assign a node to be a validator ? and what should be validate by it? (I mean what's algorithm to assign what should be validated by it?)

&rey: 1. The Elector chooses set of nodes which offered their work and would have the largest total stake. 2. Catchain determines order in which validators generate blocks; however, everyone validates everything [at least on their shardchains]. (reply to 122533)

Heydar: their work? do you mean their powers or their history of working? (reply to 122535)

&rey: To participate, a validator uses mytonctrl and sends stake to the Elector contract; history of working is totally irrelevant there. (reply to 122536)

Heydar: So their power(PC strength) just help them in taking reward faster or slower, is that right?

Heydar: thanks for clear answers always. (reply to 122538)

Wisper: how to send jetons using tonconnect2.0

Wisper: any help will be highly appreciated ?

Wiz: Launching on TON tonight or the morning. Any preferred dexes to launch on or preferred as methods out the gate? Used to launching on Base w dexscreener and Uniswap trending stuff

Abdulaziz: What's the rate of validators rewards on ton Blockchain? For example bitcoin every 10 minutes

Abdulaziz: 3.125 bitcoins (reply to 122556)

&rey: 1 (any base's shardchain) / 1.7 TON (masterchain) per block + half the fees collected. (reply to 122556)

Muhammadreza: Hello TON community.  I'm looking for source code examples of projects we can build on top of TON network. Where can I look for them? One thing which is in my mind is NFT marketplace.

Muhammadreza: One what? 😃  You know, I personally am looking forward to launch a product on TON. I currently made a token and one NFT collection. I am looking for more opportunities. (reply to 122563)

Muhammadreza: Yes. I need it :) (reply to 122565)

Abdulaziz: Is this infiltration or not, if 1 tone is created every second? (reply to 122559)

Abdulaziz: The documentation said that annual inflation was 5%

&rey: There's no hard bound on total issued TON (nor lower nor upper bound). Also, mind that TON intends to cover more and more users. (reply to 122568)

Abdulaziz: The ton is related to the messenger so it's obvious (reply to 122569)

Abdulaziz: How many TONs has ever created right now, how to get this information (reply to 122569)

&rey: It's closer to TON not being related to Telegram, actually. (That perspective helps one to not fall for scam, custodial services; also TMA questions are very distinct in topic from TON-related ones and that's why they are directed to another chat.) (reply to 122571)

&rey: Contracts are frozen upon reaching -0.1 TON of balance.

Wiz: Need to provide liquidity there? Or just like Uniswap v3? (reply to 122553)

Shayan: How can a contract be frozen due to lack of rent. I've just deployed a contract which has 0 balance and is still active. EQAIE0WvsnjqCzA_k7KUjGaIyoT93XeS0oGgTEgSrIhd1WOp

Tanks Go Battle: Hello guys, Is there a way to call metamask intent inside telegram mini apps?

Tanks Go Battle: I was trying wallet connect, but it only works for ios appearantly

&rey: Not relevant to this chat at all, actually. I'd guess @devs is a relevant chat but don't know if they can handle EVM-based wallets. (reply to 122587)

𝒾𝓇𝓇𝑒𝓅𝓁𝒶𝒸𝑒𝒶𝒷𝓁𝑒: hello everyone , after i complete the ton transaction through tonconnetui in javascript , the ton is getting refunded from the destination wallet !!  how to fix this issue !!

NPA120: Please check your destination wallet. perhaps, it is not active wallet (reply to 122602)

Minimal ☄️: Guys, I have looked through all the search result for these keyword but haven't found any clear solutions so I must ask (again) regarding the confirmation of the transaction via tonConnect, because it's an instant condition for user to play my game (it's user's stake in the round).  Once the user signs the tx I have sent using TonConnect, how can I know if I that transactions has passed?  I saw that the closest event that ton connect has for this purpose is 'user signed tx', but I have no proof until some moment that it's confirmed?  I have seen that some people are doing that using seqNo, which I don't know if I can get from TonConnect, is this a moment where I must combine sent transaction via TonConnect with some ton/tonweb or any other sdk for blockchain interaction?

Edward: GM Everyone 😄

Edward: I am new ton Ton Blockchain   Please can anyone share resources which I use to get started with Ton Blockchain

— 2024-11-11 —

battle: Hello everyone. gm. I hope you are doing well. I deployed NFT into mainnet. but it shows Unverified NFT. how to verify my NFT? pls let me know. thx

User<8042106964>: hi, which liteserver do you use? is there any faster liteserver except those public ones ?

&rey: Chat history, and docs.ton.org. It's better to set some goals for a more precise instruction and direction. (reply to 122619)

Howard: What does this error mean?  Success: false Exit code: 57

Wiz: Do you know how much? Dedust is pretty low (reply to 122583)

Top: hi guys, who kowns How can one apply for funding assistance from the TON Foundation?

&rey: Contract source code knows. (reply to 122637)

T.E.I 🇨🇦Tooncinator 🌱SEED FLIES 🪰🍑$WIFE: Sent DM regarding an issue.  Thanks. 🙏 (reply to 122643)

kira: afternoon everyone, i want to write a contract, main function is deposit and withdraw TON and USDT.  My question is: can i interact with TON and USDT in same contract? and can one contract store 2 kinds of token (TON and USDT)?  thank u so much ❤️

User<6773787096>: Hello everybody! Tell me, what should I do if the AML check showed a dirty cryptocurrency on the wallet? I checked my account via   tonchecker. org   and the test is negative, what should I do? I'm thinking of exchanging it in the exchanger, check your crypt too, so as not to get into a bad situation

Andrei: Start conversation with @testgiver_ton_bot, /get, solve capcha, provide testnet address. 2 tons will be sent out. You can perform this operation every hour (reply to 122495)

T.E.I 🇨🇦Tooncinator 🌱SEED FLIES 🪰🍑$WIFE: Never exchange any random tokens or NFTs you receive in wallet.  99.9% of the time its a scam.  Unless your aware of who the sender is, DO NOT interact.  Could very well drain wallet of all assets. (reply to 122663)

battle: I am a highly skilled Ton dev with extensive experience in TON chain development, specializing in smart contracts, NFTs and tg bots, tg mini-app development (e.g. tap games). In general, infinite data structures that can scale to billions of elements are very difficult to implement on blockchains. However, TON chain makes it possible by splitting data across multiple smart contracts. That's why I am interested in TON chain and familiar with Func and tact languages ​​for developing smart contracts. On the front-end side, I have skillfully implemented the integration of smart contracts and front-end using Ton Connect SDK. Looking forward to the opportunity to work with you.

Arpit: Are you at Devcon this week? Would love to meet. (reply to 122669)

Shahzaib: is there a way to interact .net sdk (unity) wtih Tact based smart contracts?

Martin: Hi guys, have you ever use "HASHEXT_SHA256" to concat two slices? I'm trying but it's throwing error 9

&rey: It's worth noting that non-custodial wallets do not have anything common with AML. (reply to 122663)

&rey: Check that total length is divisible by 8 bits. (reply to 122674)

&rey: Yes, just like your common wallet contract can handle any kind of token. (reply to 122660)

Martin: oh, it works. So, the number of bits must be divisible by 8 bits. I am using two addresses to concat, so the total is only 234. Thanks a lot (reply to 122676)

&rey: Btw you can skip some suffix bits instead of appending ones, probability of hash collision won't increase that much) (reply to 122679)

Martin: So instead of adding 2 more bits, I can remove some suffix ones, is it correct?

Aish: I deployed a Jetton on mainnet. Minted all the tokens during deployment and made mintable false.  After deployment Tonviewer is labelling my token as scam  Is there any reason for this.

Utsav Singla: So I cannot deploy solidity smart contract on ton?

Utsav Singla: I need help, since I have a web3 game which uses smart contract for deposit and withdrawal. Idk how to make it happen on TON? Is ton just for payments or what's the case. Please help

Nguyen: Hello, is there any sample about swap contract between Jetton <=> TonCoin. or we must make it ourseft (reply to 98874)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 57 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 50  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

orlimors: how can i run ton proxy but on testnet

&rey: No, those are incompatible by design. (reply to 122684)

Utsav Singla: So the alternative to that is? (reply to 122690)

Andrei: To implement and deploy a new smart contract on TON  https://docs.ton.org/v3/documentation/ton-documentation#smart-contracts-development (reply to 122692)

Utsav Singla: Basically the logic behind withdrawal is to validate all the micro transactions on the game and come to a final balance from which the user can withdraw, but since that's not done on chain. On TON I'll have to manage everything from the backend to create admin approved transaction (reply to 122705)

&rey: See: payment channels, unidirectional, non-closeable. (reply to 122706)

Utsav Singla: Will do thank you (reply to 122707)

Vardan: I'm looking for a developer/advisor with experience in publishing tokens. We have a new token, CrossCoin (CRSC), which is available on ston.fi, but its status in TonKeeper is still marked as 'Unverified Token.' We might have missed something. Could you help us figure out what’s wrong?

Minimal ☄️: Can someone help me, please,  I am trying to 'create' a wallet instance of an existing wallet via TonWeb, so that I can get its seqNo,  I am trying to do that this way (from their gitHub docs): tonweb.wallet.create({address: 'EQDjVXa_oltdBP64Nc__p397xLCvGm2IcZ1ba7anSW0NAkeP'});  But I am getting an error that 'create' doesn't exist? I saw that some people in this group use specific classes for wallet creation such as WalletCreateV4R2 (not sure if i quoted it correctly), but I don't know where to find those methods and are they backward compatible (since I want to let users use my app via any wallet version, as long as it is part of a TonConnect)

&rey: You can simply call the get-method via any API. (reply to 122728)

Minimal ☄️: My goal is to check seqNo, send a transaction and check again until it's incremented, does your response covers that case also?  And why is using API better in this case? (reply to 122729)

&rey: Because TonWeb also uses an API; thus, you have pure benefit of less code loaded. (reply to 122730)

Minimal ☄️: Which APi are you suggesting me to use? (reply to 122731)

&rey: tonapi is a nice one here,  or Toncenter. (reply to 122732)

Andrii Ivaniv: Check out rainbow-swap-sdk npm package (reply to 122527)

Mehmet Ali: The first image is from Blum app after i connect the wallet within telegram miniapp which the button on click returns to Blum Miniapp. The second image is the app i am working on, i have successfully connect wallet of my test application but the button in my app returns to wallet not to my miniapp. How to set the button to return to my miniapp after x seconds or after click?

Silvio: Try:  tonConnectUI.uiOptions = {     twaReturnUrl: 'https://t.me/durov' }; (reply to 122761)

Silvio: "Currently, it is impossible for TMA-wallets to redirect back to previous opened TMA-dApp like native wallet-apps do. It means, that you need to specify the return strategy as a link to your TMA that will be only applied if the dApp is opened in TMA mode." (reply to 122768)

Altaaf | proSEED: Share your challenge with @tonkeeper, you’ll be helped (reply to 122718)

Anderson: i have eth sepolia, how can i bridge eth sepolia to get ton testnet ?

harry: hi, is there anyone looking for a dev?

Sang: hi

Devils: Hello, who can recommend a server in Germany or EU where i can have access to a control panel?

Dr.Sam: Greetings dear admin. I have issues with my tonkeeper. And many scammers wanted to rob me . Who can help me?

Utsav Singla: So I am trying to do a sign and verify code for the wallet, and I am struggling really bad  I have written custom code to send a verification message to backend and verify using that message  But after receiving the payload it's unable to do signature, or create any activity on wallet to make signature

ACOM Sovereign: hey

ACOM Sovereign: We need help with our Jetton

ACOM Sovereign: We created it using Ton Raffles

Akachi: Did you verify your token? (reply to 122718)

ACOM Sovereign: The Image is not showing for the Token Logo

ACOM Sovereign: we used a image upload site

Vardan: Yes (reply to 122816)

Luis: Any tonkeeper sdk for Reactjs?

Leo: @tonconnect/ui (reply to 122830)

Kaspe: I'm looking for a professional guy with high knowledge of TON network.  I have an issue for sending transaction message to send some TON usdt to one wallet address.  I will pay you to solve this issue via crypto.

&: Do you use node? (reply to 122840)

Kaspe: we have to solve this issues on frontend

&rey: alr.. (reply to 122840)

— 2024-11-12 —

Abdulaziz: Do ton use merkle tree?

Daniel: Want to buy p2e mini game   Anyone have completed p2e mini game?

Abdulaziz: What's the budget (reply to 122897)

Abdulaziz: Do anyone have an example of transaction from tonviewer? (reply to 122895)

User<7592219613>: I have a reward of tons spin and paid the fee but have not yet received a reward? Can somebody help me

Guzus: gm

Guzus: ton-org/ton vs toncenter/tonweb which sdk should I use for my trading bot on ton?

Guzus: ton-org/ton has more recent commits but have less stars, so I was curious

ㅤㅤㅤㅤㅤ: /stat@combot

reza: hi   I created a coin meme, how can I enter cash into the currency and lock the capital 🤔🤔

User<7900198091>: I need ton api key to track  transaction

User<7900198091>: Add liquidity (reply to 122718)

Akachi: You can use toncenter api (reply to 122915)

User<7900198091>: Api no responding 😞 (reply to 122920)

Khalid: Did tonkeeper 5.0.1 break the login flow? It redirects to the browser instead of the app?

User<8042106964>: any liteservers except those in the global-config ?

sh: I'm planning to build a service using ton4j for detecting deposits and managing withdrawals using private keys.  Should I set up a LiteServer node myself to achieve this?

&rey: Former is up-to-date. (reply to 122907)

Guzus: thanks (reply to 122942)

.none: Hello everyone When emulating a swap using pytvm, I ran into a problem - there is a stack overflow in tvm - exit code 6. There are no ideas even what to do...  here are the logs    [ 4][t 0][2024-11-12 09:26:58.2885726][transaction.cpp:1702]    starting VM[ 4][t 0][2024-11-12 09:26:58.2890413][stack.cpp:437]   moving 4 top elements to another stack  [ 4][t 0][2024-11-12 09:26:58.2895891][stack.cpp:437]   moving 3 top elements to another stack[ 4][t 0][2024-11-12 09:26:58.2900835][stack.cpp:437]   moving 2 top elements to another stack  [ 4][t 0][2024-11-12 09:26:58.2904150][transaction.cpp:1707]    VM terminated with exit code 6

S: hello, friends

S: in my dapp I can detected if the wallet is connected by testnet or mainnet

S: but I want to make a function to switch networks between them

S: I couldn't find anything related with this

S: can anyone help me?

&rey: You still have to ask user so that they reconnect with another wallet. (reply to 122955)

S: 🤔 so there's no solution for auto switch?

&rey: What would an auto switch even mean? Users commonly have either mainnet or testnet wallet but not both. Also, those wallets don't use same mnemonic (doing otherwise is misguided and makes you lose real TON). (reply to 122960)

Minimal ☄️: Guys, when I use tonweb to get seqNo with: await wallet.methods.seqno().call() || 0;  I get an error: Error sending transaction: Error: writeUint: value is NaN  wallet is being created this way: const wallet = new TonWeb.Wallets.all.v4R2(this.provider, { publicKey: window.tonConnectUI.account.publicKey })  Has somebody encountered this issue?

&rey: tokenAmount vs jettonAmount, perhaps? There was an incorrect type declaration once, I don't know if it's still there. (reply to 122973)

Minimal ☄️: Hm, what do you mean by that?  If we are talking about tx, it's purpose is only to send ton: const transaction = {                 validUntil: Math.floor(Date.now() / 1000) + 360,                 messages: [{                     address: senderAddress                     amount: "200000000", // 0.2 TON                     // payload: null,                 }, ],             }; (reply to 122974)

&rey: Well you cannot assume that user's wallet is v4r2 (it might be v3r2, for instance)? You should use TC2-provided address directly (it does). (reply to 122973)

A: anyone solve this issue

A: ?

A: and this is my sc code   import "@stdlib/deploy";    // Define the events for withdrawal and deposit  message WithdrawEvent {      amount: Int as coins;      to: Address;  // Address of the recipient  }    message DepositEvent {      amount: Int as coins;  // The amount of the deposit  }    message Withdraw {      amount: Int as coins;  // The amount to withdraw      to: Address;  // Address of the recipient  }    message Deposit {      amount: Int as coins;  // The amount to deposit  }    contract SendCoins with Deployable {        deployer: Address;      totalDeposits: Int as coins;  // Track the total deposits for the contract      deposits: map<Address, Int as coins>;  // Map to track individual user deposits        init() {          self.deployer = sender();          self.totalDeposits = ton("0");  // Initialize total deposits to zero          // self.deposits = map<Address,Int as coins>();  // Initialize the map to track user deposits      }        // Deposit function - accept deposits from users or deployer      receive(msg: Deposit) {          // Update the total deposit amount          self.totalDeposits += msg.amount;            // Update the individual user's deposit using the map          let currentDeposit = self.deposits.get(sender());  // Default to 0 if no deposit exists          self.deposits.set(sender(),msg.amount);            // Emit DepositEvent to log the deposit          emit (DepositEvent{amount: msg.amount}.toCell());  // Emit the actual deposit amount      }        // Withdraw function - allows the deployer to withdraw coins      receive(msg: Withdraw) {          require(sender() == self.deployer, "Only deployer is allowed to withdraw");            // Ensure the contract has enough balance to withdraw          let amount: Int = min(msg.amount, myBalance() - context().value);          require(amount > 0, "Insufficient balance");            // Send the specified amount to the provided address          send(SendParameters{              to: msg.to,                bounce: true,              value: amount,              mode: SendRemainingValue          });            // Emit WithdrawEvent to log the withdrawal          emit (WithdrawEvent{amount: amount, to: msg.to}.toCell());  // Emit the withdrawn amount and recipient address      }        // Getter for contract's current balance in TON      get fun balance(): String {          return myBalance().toCoinsString();  // Return the contract's balance      }        // Getter for the total amount of deposits made to this contract      get fun totalDepositAmount(): String {          return self.totalDeposits.toCoinsString();  // Return the total deposits stored in the contract      }        // Getter for the deposit amount of a specific address      // get fun depositAmount(address: Address): String {      //     return self.deposits.get(address).toCoinsString();  // Return the deposit amount for the specified address      // }  }

Andrei: Hey! Looking for an advise. I'm developing a smart contract. Basically upon the call to the smart contract, object should be initiated, then upon other calls, it get's modified, and eventually distributes the funds. After that I don't really need the object anymore.  So, my question is, what is the best design approach here? Should I create 1 smart contract, deploy it, and store/clear objects  Or should I rather deploy a new instance of smart contract upon every object creation (not even sure yet if it's possible though)?  Thanks

&rey: Your "object" sounds logically an isolated smart contract. (reply to 122998)

&rey: I'm not even sure if you need the contract you've already thought of. Contracts can be initialized even with users' messages sent from frontend.

Andrei: Makes sense. IS it possible, however, to deploy a new contract from "master" contract and get back the address to my dapp? (reply to 123001)

&rey: Yes. Normally, you'd know the address even before sending message to master contract. (reply to 123003)

Andrei: Ah, ok, got it. I don't even need a master contract it seems.

Andrei: Perfect, thanks! Is there a chance you could point me to some docs on how to deploy contract from the js/python client? (reply to 123005)

&rey: Provide StateInit within message, as https://docs.ton.org/v3/guidelines/ton-connect/guidelines/sending-messages#smart-contract-deployment does (but using lib of your choice instead of TonWeb). (reply to 123007)

Andrei: Thanks a lot, appreciate it! (reply to 123010)

NASDAQ: does anyone use a tonutils library?

Minimal ☄️: Can someone tell me how are these 2 adresses the same: 1. Deposit address in the wallet: 0QB1SAO0Ok9AUEDgyxnwLxwhqH4yIjlptaPx75TD30eK-c2l  2. account.address field in tonConnect once connected: 0:754803b43a4f405040e0cb19f02f1c21a87e32223969b5a3f1ef94c3df478af9  And which one should I use as a destination address?

Minimal ☄️: Yes, both are the same wallet on the tonkeeper (reply to 123034)

&rey: You should use one of user-friendly forms: 0Q... if crediting something to user, and kQ... if you send some request/money which should bounce if user's wallet is uninit. (reply to 123033)

Minimal ☄️: How can I convert between those two? In case I want to show the user's wallet address, and I can only get the non-user-friendly via TonConnect?  By destination address, I mean on destination address in the transaction body (not when sending assets via wallet) (reply to 123042)

&rey: Address.parse('any form').toString({userFriendly: true, bounceable: false}) (reply to 123045)

Minimal ☄️: I am restricted to tonweb, it doesn't have a parse option :/ (reply to 123046)

&rey: (new Address('any form')).toString(true, true, false, false) (reply to 123047)

&rey: Also, make sure to backresolve user's address via Tonapi in case he has a domain attached (like wallet foundation.ton) so that domain name shown instead of just address.

Mehmet Ali: We have created a jetton and the transfer of the jetton from a wallet to b wallet costs around 0.5$. Is there a method (we use this on TRON) that we buy a big amount of TON and stake it to a contract and that covers some transfer fees of our jettons?

P: I am interested in your posting I am a Full Stack and Blockchain Engineer specializing in innovative solutions for Blockchain, Web3, NFTs, DeFi, Solana, Ethereum, Smart Contracts, Solidity, and Rust. I have experienced Jetton Wallet development, token automatic systems, and other experiences. Could you please give me an opportunity to work with you? (reply to 123057)

&rey: Mind if I validate your claim about "token automatic systems"? (reply to 123061)

P: sure (reply to 123062)

P: Can you  send DM?

&rey: What architecture would you use if jetton represented some game score; score could be increased by server at any time, and client would claim it whenever they want (and preferably sending 1 claim message even if additional jettons were issued ten times)? (reply to 123063)

&rey: Chat moderators usually do not DM first (so it's easier to tell scam from not-scam; whoever DMs first is under suspicion). (reply to 123064)

P: But, Do you have any project of good idea? (reply to 123066)

Heydar: why bug report in issues from ton bug bounty is deleted?! (I mean issues are not avaialble anymore!)

Mr: hello

Mr: do you have problem with USDT transactions now?

Mr: or this is our local issue

Mr: could you please help? any ideas?

Leo: You tried to transfer 10 billion USDT which you didn't have And you're asking what's the problem 🤣🤡

— 2024-11-13 —

Abdulaziz: You got scam, an phishing transaction (reply to 123113)

AmirhN: did u find a solution? i get exit code 48 on HMSTR transfers (reply to 116586)

P: Ton transfer? or jetton transfer? (reply to 123150)

AmirhN: Jetton transfer (reply to 123151)

AmirhN: using tonutils ^ on python

AmirhN: the code looks to be fine (reply to 123155)

AmirhN: Well the libraries are way different, ill wait for someone with same library experience or someone to explain exit code 48 i guess. (reply to 123158)

Tom: Guys, is there anyway to convert from LT to Unix timestamp?

0xGem_Dev: If I wanna start building on Ton where do I start from?

0xGem_Dev: Any easy guide to Ton development

Эльдар: https://docs.ton.org/v3/documentation/ton-documentation (reply to 123172)

Jacob: how to write logic expression? such as    a > b   &&  c > d ?

Jacob: func does not support &&

&rey: (a > b) & (c > d), but mind parentheses if you don't remember operator priority

&rey: (though, that evaulates both expressions; if you need short-circuiting if first is false, you have to use if)

Jacob: Thank you very much (reply to 123185)

Valerii: Hi. I am sending a transaction through the tonconnect UI with the following payload.  The transaction is successfully sent and returns a BOC. When the transaction is in TON currency, I can parse the BOC and obtain in_msg.hash. However, when the transaction is in a token (e.g., HMSTR), parsing the BOC does not work — a hash is generated that I cannot compare with anything because it differs.  The BOC returned by tonconnect: ...

Valerii: "te6cckEBBAEA6wAB5YgBAy0uzg5J0qcQCNEk93xjwHQk9X+zQTN8M/pgtmsaL+gDm0s7c///+Is5ooGQAAAAlPE3AupjyDuR/8Z7V3lP0DeI7tXIEW0L8Pn8VcOg9EqHWSJJdzzEuJzoUzbXDfOpzLGnt83vH/SV5jCCIqGSEAEBAgoOw8htAwMCAM9iAEP3LukdnZYl/EfB9CGoLrDddgI8IP5JVd8Xo+k4EgVroBfXhAAAAAAAAAAAAAAAAAAAD4p+pQAAAAAAAAAAUbISIaAIAFB2h1dyUVm4q8X+DN/C7yvoB0nkoDsI8H32uFdtTc8GAQAAvkTqlw=="

kira: afternoon everyone I want to write a smart contract (by Tact) to deposit and withdraw USDT. Do you have idea how to do it?  Thank u so much ❤️

&rey: It isn't excessively hard, actually. Please look into TON Cookbook's image, remembering that your contract only sees whatever messages it receives/sends. (reply to 123206)

Ziom👽: Hello guys I am new here how and where can I start

kira: so, the contract doesn't store USDT itself, right? and after transact USDT successfully, i will send a message to contract to log the transactions and save it to database?  am i understand right?

&rey: I've marked parts which are not seen to the contract.

&rey: Contract owns USDT but does not store it, right. Jetton wallets do the balance store. (reply to 123209)

&rey: It seems a good idea is by following the chat. (reply to 123208)

kira: hmm, could you explain more about the different between Jetton Wallet A and Jetton Wallet B, please? It's a bit confusing to me 🥲 (reply to 123210)

&rey: Jetton wallet A: a separate contract that stores balance of specific jetton (like NOT) for user A. Jetton wallet B: a separate contract that stores balance of the same jetton for user B. (reply to 123214)

Ziom👽: Thnx for replying So I have no clue what are ppl talking abt (reply to 123213)

&rey: Well, there are smart contracts which are essentially programs with balance and persistent data storage. In particular, wallets (that is, real, non-custodial ones) are smart contracts. (reply to 123216)

Forbes: hello, is there anyone looking for dev?

kira: soo, where the contract will be in your picture? could you explain about the flow of that?  I am doing a task, that when user send USDT to admin, it will be recorded by smart contract, and the transaction will be logged into database!  thank u so much for your help ❤️ (reply to 123215)

Ziom👽: Soo what shld I do now (reply to 123217)

Ziom👽: I think I had read abt it something on website (reply to 123217)

&rey: In its role as sender, contract will be in place of "Wallet A". In receiver role, in place of "Wallet B". (reply to 123219)

&rey: Well I'm not sure what you want to do; I'd suggest deeping into contract examples/whitepapers. (reply to 123220)

kira: oh, i see.  If the contract is the receiver(Wallet B), contract will monitor Jetton Wallet B,  and after each transaction, Jetton Wallet B will send a message (JettonNotification) to contract (wallet B). in the function receive(msg: JettonNotification), emit an event to store transaction to database. am i right?

&rey: Well you don't need any events to monitor transactions, do you? (reply to 123225)

Ziom👽: What is that.? (reply to 123224)

&rey: Whitepapers? They describe what TON strived to be and at what costs it achieved that. https://docs.ton.org/v3/documentation/whitepapers/overview (reply to 123227)

kira: because i want to store the info of transaction in database, so i think i need to trigger an event to the BE can catch it and store to database :D (reply to 123226)

Ziom👽: Thnx 👍 (reply to 123228)

&rey: Well you don't need to trigger any events, you should just listen to transactions on jetton wallet (the one which *sends* TransferNotification). (reply to 123229)

Shayan: First time working with cell references! Let me know if shoud handle it in a different way. (reply to 33)

User<8042106964>: is there a way to send external message directly to validators instead of public liteservers ?

&rey: You can try connecting by their ADNL address. Please report if that succeeds, as now I'm interested in that. (reply to 123246)

TON Bounty Bridge: ​Dasturchilik haqida  🏷 Developer Tool  Summary:Yaratilayotgan yoki takomillashtirilayotgan ishlab chiquvchi vositasi, dasturchilarning samaradorlig...  Created by Islombek08

A: someone help plz

A: i deploy my sc using ide.ton.org and tonkeeper but when i treying to verify its throwing error plz help

A: please helpppppppppppppp?

fade: Does anyone know what to do about the ton node keep hoarding disk? For example when first sync it uses about 200gb, but it keeps increasing and after like 2 months it gets up to 900gb and i have to reinstall the node, the official docs say to clean the logs file but the logs aren't that big

Minimal ☄️: Hey guys, does anybody knows why some transactions on testnet via tonkeeper doesn't appear in it's history (neither funds are deducted for it), or on APIs (tonapi/toncenter), but appears on tonviewer when looking for it's hash?  Every 5th transaction just dissapears and can be seen only on tonviewer

fade: transactions can be "lost" and not processed by ton blockchain, does tonviewer display a pending status for your transaction? (reply to 123265)

Minimal ☄️: Didn't know about that, tonviewer says it's confirmed (reply to 123266)

Minimal ☄️: Don't know how it's confirmed when funds aren't deducted from the wallet

Minimal ☄️: How to know when the transaction is lost so I let user know it should start a new one?

fade: i dont use testnet, but sometimes when you submit an external  message it can be lost, tonviewer could still show it as "pending transaction" but that's only a simulation, it can be deceptive (reply to 123267)

fade: i personally dont handle that case, i just submit to multiple nodes to make sure it's not lost (reply to 123269)

Minimal ☄️: What do you mean by 'external message', like a comment in the payload or? (reply to 123270)

fade: when you submit a message to the blockchain it's called external (reply to 123272)

fade: tonkeeper check the tx status every 30s and re-submitting it if it's not found on chain, i think (reply to 123269)

&rey: When last block time exceeds validUntil you have set. (reply to 123269)

NASDAQ: how to get usdt in testnet?

&rey: You use an arbitrary jetton there. (reply to 123278)

Mehmet Ali: Within tonconnectUI is there any event that fired/triggered when wallet is connected?

Mehmet Ali: After connecting the wallet to my miniapp this screen should have passed out (wallet) but i should click x to close it. How to do this after connecting wallet?

User<7265582009>: Seeking work as a Full stack developer.  I’ m a talented FullStack Web & BlockChain developer who has strong can-do attitude and high responsibility.   Followings are my experience and skill sets:-Front-End: React/Redux, Next.js, Vue/Nuxt.js, WordPress, HTML5, CSS3, JavaScript/TypeScript, jQuery, Tailwind CSS, Bootstrap  -Back-End: Node.js, Nest.js, Django, Flask, Laravel.-Mobile: React Native, Native, Android, iOS  -Version Control and Project Management: JIRA, Trello, GitHub, GitLab-Blockchain and Web3 Development: Web3.js, solidity, Rust, Golang, MetaMask, Hardhat, Blueprint, FunC, Tact  -Smart Contract integration development: DeFi platforms, Crypto wallets, NFT marketplaces, Casino bet  A highly skillful Developer will help you whenever you need.  My portfolio:  hexiao.vercel.app  Thank you

the man: is there any example how to implement SSE in javascript/typescript? in docs, i can see golang example only

Aleksandr: I'm trying to implement deposit logic in daap similar to what DEX's does. when user send TON to specifc address with unique memo. does anybody has an example or tutorial how to implement it? what API can you recommend to listen onchain events?

fjila: In the Stonfi Docs it says  usage of libs in masterchain to make all operations cheaper  How do i deploy libs on the masterchain?

fjila: Is it possible to deploy library cells to masterchain with tolk and blueprint? (reply to 123333)

Alex: Why is the metadata not displayed in tonviewer after nft mint? But in getgems - all ok

Maxim: Maybe because data stored on-chain (reply to 123361)

Alex: Is this a problem? Most collections are centralized (reply to 123363)

Shayan: I put 6 cells like: (1)-->(2)-->(3)-->(4)-->(5)-->(6) in message body and blueprint gave me BitBuilder overflow Error. Why is that?

BizX: I am a passionate and skilled blockchain and web3 frontend developer is htere anyone looking for developer?

(┬┬﹏┬┬): Guys, please remind me of the variable in the body of the transaction tone, where to indicate the wallet to return the commission?

&rey: There is not, as blockchain doesn't know if you intended to increase destination contract's balance. Some standards define response_address which must be handled by compliant contracts. (reply to 123374)

— 2024-11-14 —

Jacob: how to monitor the event of the func contract , like eth getPastEvent?

N 🍅: hallo can someone help me to recovery my 24 pharse ton keeper wallet ?

Omar: Hi, what is the chain ID for ton-mainnet?

&rey: It is not possible if you have not kept it in at least one place. (reply to 123404)

Tom: I'm using dton on testnet but something doesnt add up, it misses some tx

lv: I can if you have private key (reply to 123404)

&rey: Well no you can't. Here's an example of TON testnet private key (even including public key): b";\xdd\xb1\xb0#U\xf2n\xda\xb6\x03\x9f\x9f\xee\xc972\xb6\xa7\xfas\xea\xfa\xb8\xb3\xc7\x87n\x81\xfb\xca\xffQ\xd78\xfe\n9\xd4\x1c\xb6\xd3\x184\xdcz\x1b\xfe\xa6|\xf7Y\xd3Z,\x15\x04\xf20\x1d\x1b\xa5'\xb4". I shall notice you'll be unable to recover TON mnemonic from it! (reply to 123416)

Sane: Oh hell nah tf even is that (reply to 123419)

User<7012417474>: Somebody know why i transfer a jetton -> transaction failed but i still lost jetton ?

User<7012417474>: It still sent to a receiver or burned ?

Stan: Hey guys, does anybody know, tonprovier dot org provides v3/indexer node api as service?

Eugene: https://chainstack.com/build-better-with-ton/ does (reply to 123441)

A: below is my tact sc when i am trying to deposit transaction done  but the value i am depositing is not showing on wallet help?

A: import "@stdlib/deploy";    // Define the events for deposit and withdrawal  message WithdrawEvent {      amount: Int as coins;      to: Address;  // Address of the recipient  }    message DepositEvent {      amount: Int as coins;  // The amount of the deposit      recipient: Address;    // The recipient address for the deposit  }    message Withdraw {      amount: Int as coins;  // The amount to withdraw      to: Address;  // Address of the recipient  }    message Deposit {      amount: Int as coins;  // The amount to deposit  }    contract mycontt100 with Deployable {        deployer: Address;      deposits: map<Address, Int as coins>;  // Map to track individual user balances        // The contract will take an owner address during deployment      owner: Address;          // Contract initialization where the owner is set      init(ownerAddress: Address) {          self.deployer = sender();  // Set the deployer as the contract owner          self.owner = ownerAddress;  // Set the passed owner address      }        // Deposit function - anyone can deposit and the deposit is added to the sender's balance      receive(msg: Deposit) {          let depositAmount: Int = msg.amount;          let senderAddress: Address = sender();  // Get the address of the sender            // Update the deposit map with the sender's address and the deposited amount          let currentDeposit: Int? = self.deposits.get(senderAddress);            if (currentDeposit == null) {              self.deposits.set(senderAddress, depositAmount);  // First deposit for the sender          } else {              self.deposits.set(senderAddress, currentDeposit!! + depositAmount);  // Add to existing deposit          }            // Emit DepositEvent to log the deposit          emit (DepositEvent{amount: depositAmount, recipient: senderAddress}.toCell());      }        // Withdraw function - only the owner (deployer) can withdraw funds from the contract      receive(msg: Withdraw) {          // Ensure that only the contract owner (deployer) can initiate a withdrawal          require(sender() == self.deployer, "Only contract owner can withdraw");            // Check the balance of the to address (recipient) in the contract          let currentDeposit: Int? = self.deposits.get(msg.to);                    // Ensure that the recipient has a deposit (currentDeposit != null)          require(currentDeposit != null, "No deposit found for recipient");                    // Ensure that the recipient has sufficient balance to withdraw          require(currentDeposit!! >= msg.amount, "Insufficient balance to withdraw");            // Send the specified amount from the contract address to the recipient          send(SendParameters{              to: msg.to,              bounce: true,           // Handle bounce (failure of transaction)              value: msg.amount,     // Amount to transfer              mode: SendRemainingValue  // Ensure remaining value is sent properly if any          });            // Update the recipient's deposit balance (reducing by the amount withdrawn)          self.deposits.set(msg.to, currentDeposit!! - msg.amount);            // Emit WithdrawEvent to log the withdrawal          emit (WithdrawEvent{amount: msg.amount, to: msg.to}.toCell());      }        // Getter for the balance of a specific address (from the deposits map)      get fun balanceOf(address: Address): String {          let depositAmount: Int? = self.deposits.get(address);            // If depositAmount is null, return 0, otherwise return depositAmount as a coin string          if (depositAmount == null) {              return ton("0").toCoinsString();  // Return 0 if no deposit is found          } else {              return depositAmount!!.toCoinsString();  // Unwrap and return deposit amount as coin string          }      }  }

A: i am trying to deposit 1 ton in nanotone 10^9 but its not showing in wallet and not on blockchain why??

Heydar: Does somone know the reason? (reply to 123107)

oracle: Hi all, I want to use archive node for my project and have a few questions  1. can I use different disks, for example one 8TB and one 3TB? will it interfere with the fast action of the node?  2. I want to index the whole archive using ton-indexer, do you have any idea if this is a good solution and how big is the database afterwards?  3. if i need some specific time period, can i get it without downloading all 9 TB?

oracle: I've spent a lot of time trying to find answers, but I believe that so far few people have encountered all the problems associated with the archive node

Sherry: Can TON share messages to other platforms? For example, can it share the game score from a Mini App to Twitter or Discord (not just a simple redirect, but getting the game score return value and then sharing it)?

&rey: You are conflating TON and Telegram. Those are different: former is blockchain, and latter is a messenger+webview.  Welcome here is discussion about development on TON, which mainly concerns architecture to choose, smart contract writing and related things. (reply to 123473)

Gabriel Posada [CRG]: hi how about I try to place an idea in the group but the bot deleted it, so I'll try to summarize it as best I can given I don't speak English and I use translator

&rey: That's, like, already implemented? (reply to 123504)

Gabriel Posada [CRG]: burning of tokens and deactivating contract without touching the Jettons (reply to 123507)

&rey: Supported (of course, only one who owns some jettons can burn them). Supported (set admin address to null). (reply to 123509)

Doomer Maiden: do you mean a TON message as in a packet of data from a contract, or just a regular Telegram posted message such as the comment you're reading atm (reply to 123473)

Ivan: where i can get coins in a testnet?

Gabriel Posada [CRG]: In which wallet or app I will be able to see it or where I get more information 🤔❓ (reply to 123512)

— 2024-11-15 —

oracle: may some one help me? (reply to 123465)

Kowser |: which node module now support w5 address?

GONZALES: After minting a new token, where do I request approval so that it shows up as verified in the ton wallet?

&rey: Please clarify in which wallet for TON blockchain? To my knowledge, TON Wallet doesn't even show jettons. (reply to 123621)

GONZALES: Then, is there no way to make the token I issued verified and visible in the ton wallet? If I register the token in the wallet settings, can I make it visible? In the case of the ton keeper wallet, can I make it verified and visible? (reply to 123622)

&rey: You should consult Tonkeeper themselves, they're more likely to know. I've heard jetton TK-verification involves a pull request to their repository and some post. (reply to 123623)

Nasim: Hello everyone Our team is looking for a developer for smart contracts in Ton and Eth. Write to the Dm who are interested

ken: any that can be compiled into javascript. (reply to 123633)

Mantas: Hey! Maybe someone would be able to help me to understand why specific transaction bounced? I do not see any errors on it, or smth unusual. Funds were transfered to simple wallet (not smart contract) and just returned back.

Mantas: This is the tx id: 29083912e343d980fd5be40788599a33459afaf26df71035478b4a0e89535e83

User<8042106964>: that is because following account is in uninit state https://tonviewer.com/UQCNxUppjVm3S49ZbgHw1y826uKAMphFgSDMZVw2AQHPlVJJ (reply to 123650)

Общественное: assembly

TKAINU: i want to ask, a calculation in ton, i have decimal = 6 for example  a = 4/3 * 10^6 = 1333333 So when calculating b = a * 2, the result will be calculated based on a = 4/3 * 10^6 or a = 1333333 Because if you perform many calculations, the numbers after the decimal point will be incorrect

Mantas: what Uninit state means? sorry, I'm new to ton. Also, if that is the case, why some other transactions are successfull? (reply to 123652)

&rey: Only on integers. In particular, you should do arithmetic on indivisible amounts. (reply to 123655)

Akachi: Did you check bouncable flag? (reply to 123650)

Mantas: as I understand from the previous answer the issue that receiving wallet is in Uninit state. Can you help to understand what it means and why some transactions passed and fund were received? Maybe different sender wallets behave differently and some allow to send funds to such "uninit state", some not? (reply to 123661)

&rey: You are quite right.  When sender sets non-bounceable flag (UQ instead of EQ), all wallets except maybe TON Space flag the TON-carrying message as non-bounceable. Those messages do not bounce when their processing fails (as is case with uninit destination). (reply to 123662)

&rey: While I cannot understand the reasons for using wallets which fail on certain well-known usecases (if they in fact do), if you aim to support users of that wallet, you have to initialize the destination wallet.

Mantas: How I can initialize destination wallet? It was just simply created in TrustWallet (reply to 123664)

&rey: Well you can send an outgoing message (even to that wallet itself). (reply to 123666)

Mantas: Ah, so simple, thanks, I will let my client know and get back here if that doesn't solve the issue. Thanks a lot!

Makos: What base do I need to know to start learning tatc language?

&rey: Basically, how TON Blockchain works; what are contracts, messages and transactions. (reply to 123675)

Makos: I mean, javascript base or what? What level do I need to get to so that learning tact is not too difficult? I know about the TON base of transactions, deployment, basic definitions, etc.) (reply to 123676)

&rey: Well you should try https://tact-by-example.org, and clarify whatever is unclear using chat history, reference manual and so on. (reply to 123677)

pawanak: getting this error "TypeError: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')"  when i use the react sdk

ken: which particular sdk are you using? (reply to 123680)

Sojib: How to register extension in Wallet V5? Can anyone give me a minimal example? I am new in ton development. Please guide me. Thank you.

Эльдар: can somebody explain how wallets like tonkeeper display transactions preview  in confirmation step? Outgoing jettons amount and incoming ton amount in dex swap for example.

Dmitry: They just emulate txs using API (reply to 123684)

Dmitry: It’s deterministic

Minimal ☄️: How to deploy HighLoadV3 wallet? What is actually 'deploying' of a wallet?  I have created a keypair and funded its address on testnet but it has uninitialized state and it's unable to perform any batch withdrawals?

Alexander: You need to find a way to send state_init to this wallet, containing it's code and initial data. This can be done from ordinary wallets, multisig contracts etc... (reply to 123701)

Minimal ☄️: Can I send it as a comment via TonKeeper maybe?  I have tried to use wrappers from tutorial but they are written in typescript and tutorial in JS,  and after converting all the used ts files to JS, I always get 500 from toncenter with bunch of data and this message: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state (reply to 123711)

Aleksandr: Hi all! Is anybody tried to set up bicycle? Currently stuck, would be awesome to ask some questions.

2happy: Hello, i'm newbie. I want a special Jetton that pays an N% fee to my address every time it's transferred between users. Is there an example of such an implementation somewhere?

наз: hi, how many bits does .store_coins() take up?

&rey: 4-124 bits. (reply to 123778)

&rey: Here you have an example: https://tonviewer.com/EQBTr1VlDmXjwt17E74xEo3KYeBEDp1p9xbixjk7eva_OcyH?section=code.  Though it might be significantly better to charge fees in TON, which are at least worth something, instead of your jetton. (reply to 123763)

Marco | TAC: Hello fam 🩵

— 2024-11-16 —

Jenya: const keyPair = await mnemonicToWalletKey(mnemonic.split(' '));     const walletContract = WalletContractV5R1.create({ workchain: 0, publicKey: keyPair.publicKey });     const transferMessage = walletContract.createTransfer({         seqno: 75,         sendMode: 3,         secretKey: keyPair.secretKey,         messages: [             internal({                 to: walletContract.address,                 value: toNano(1),             }),         ],     });      const externalMessageBoc = beginCell()         .store(             storeMessage(                 external({                     to: walletContract.address,                     body: transferMessage,                 })             )         )         .endCell().toBoc();      await client.sendMessage(externalMessageBoc);  Error: cannot apply external message to current state : Failed to get account state  tonapi sending everything out normally. liteclient - error

наз: hi, if I declare a function with the impure specifier and use it in another function, do I need to specify the impure specifier in the other function as well?

&rey: Yes – though you may skip it if you intend to reverse all changes made by impure functions so code would behave identically without call to outer function. (reply to 123858)

наз: thx (reply to 123859)

T: nvm i understood problem

Dev: Any possible implementation of Ton Library with Flutter Web App?

Jenya: nobody know? (reply to 123835)

&rey: You've forgotten that wallets need initialization sometimes. sendTransfer would handle that. (reply to 123835)

Jenya: wallet initialized UQBjbzhHtRT86CHt1Ins6TyZF9y1b4yqreIVJbVZZbq-Swap (reply to 123897)

&rey: Have you checked that JS got the same address? (reply to 123898)

Jenya: yes, EQBjbzhHtRT86CHt1Ins6TyZF9y1b4yqreIVJbVZZbq-S1ts (reply to 123899)

Leo: yes. (reply to 123890)

Dev: Okay, Thanks. Have gotten a documentation on it, having a look on it already.🙏 (reply to 123910)

Kohl: Hey fam. I'm seeking direction to list Jetton on dex (ston.fi) but through the contract itself.  I'm building a Jetton launchpad on TON, similar to pump.fun on Solana. Once the funding goal is complete want to list the Jetton ston.fi automatically.

Roi Schtreicher: Thanks 💯  Do you have a link to Wyoming? (reply to 119128)

&rey: 1) NFT collection in blockchain. Logic issuing NFTs in backend. Logic displaying them in frontend.  3) Miniapp is just a view for website. Wherever you host it, it will be hosted (unless there was an AI managing to escape). @devs chat can help you some more on that. (reply to 123926)

&rey: 2) First you should test what you're talking about, secondly learn about pytoniq, and then make an informed choice. (reply to 123926)

AlirezaEthDev: Is there any TON dev community on Discord?

TON Bounty Bridge: ​Flutter Telegram Mini Apps (tApp) Educational Video Series Proposal  🏷 Education  Summary:The Flutter ecosystem lacks comprehensive educational resources for Telegram Mini Apps development. ...  Created by Immadominion

Abhimanyu: I am new to development on TON and I am creating a TS file in which it gives me the wallet address of the given mnemonic   Can anyone help me with this error it's showing that "Cannot use import statement outside a module"

— 2024-11-17 —

Mithra: Can you guys explain why Jetton transferring fails via a Tonkeeper wallet: https://tonviewer.com/transaction/7f648e8f47cc2526545b7aa23309bc858feab487144d0406f11b054db7d39140 while sending from a script works?

Tran: how to create a const to save fee address of my jetton token?

Tran: im using FunC

Эльдар: you can do it like this: slice fee_address() inline {     return "EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Aps_Xzx01x5B"a; } (reply to 124042)

Tran: tks :D (reply to 124044)

Tran: I want to send fee to fee_address, but my code don't work :( here is my code var msg_body = begin_cell()             .store_uint(op::transfer_notification(), 32)             .store_uint(query_id, 64)             .store_coins(fee)             .store_slice(fee_address())             .store_slice(either_forward_payload)             .end_cell();          var msg = begin_cell()             .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract             .store_slice(owner_address)             .store_coins(forward_ton_amount)             .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)             .store_ref(msg_body);          send_raw_message(msg.end_cell(), 1); (reply to 124044)

i01011110: Hey guys, what have been sent on ton isn't reversible?

Kenny$$Shillz: Anyone I. Need of a dev?

наз: hi, is this approach of working with global variables correct?   #include "imports/stdlib.fc"; #pragma version >=0.4.0;  global int test_var;  () save_data() impure inline_ref {     set_data(begin_cell().store_uint(test_var, 1).end_cell()); }  () load_data() impure inline_ref {     slice ds = get_data().begin_parse();     test_var = ds~load_uint(1);     ds.end_parse(); }  () some_func() {     load_data();     test_var = 1;     save_data(); }

наз: If I use a function without the impure specifier in a function with the impure specifier, can it happen that the compiler will delete this function and if it does, will it work properly?

Mohammad: Hey everybody, How can I trace logs of a specific account?  I am using this snippet to emit logs:  send_raw_message(         begin_cell()         .store_uint (12, 4)         .store_uint(0, 100)         .store_builder(data)         .end_cell(),         0     )

Tran: hi all, i want to check transfer to/from DEX (stonfi, dedust), But i dont known address of stonfi and dedust

Tran: Is there any way for me to do this function?

Slava: 👍🏻  Vote for Tact syntax highlighting on GitHub  Please add a thumbs up to enable Tact syntax highlighting on GitHub!  https://t.me/tact_kitchen/42

kira: hi everyone, i have written a message to receive jetton transfer notification message(0x7362d09c) JettonTransferNotification {     queryId: Int as uint64;     amount: Int as coins;     sender: Address;     forwardPayload: Slice as remaining; } and receive like below receive(msg: JettonTransferNotification) {       self.myJettonAmount += msg.amount;     } But i can't receive above message After i send an amount of jetton to my contract P/s: testnet environment Please help me

Vansh: Hey folks, i need some quick help, I am building an app rn and using TON Connect sdk for React, i have put the tonconnect-manifest.json in public folder, running the project using ngrok, checked that manifest is accessible, when I try to scan and login tho, it shows App Manifest error

MT: How to use tonweb to query the nft owned in a wallet?

MT: I tried doing this but got a writeUint: value is NaN error

&rey: So do you set appropriate forward amount? (reply to 124126)

Aleksey BingX | Snow: Hi, can you please give me a link to the current API ton? I am writing a function to check for the presence of NFT on my account, it is advisable to provide me with the API function for checking NFT. Because I have been sitting at the code for the 3rd day, errors are constantly occurring, and the server does not respond

&rey: In this case, tonapi.io suits you better. (reply to 124141)

Aleksey BingX | Snow: import requests  def check_nft_in_wallet(wallet_address, nft_id):     # URL для получения информации о токене или владельцах     url = f"https://tonapi.io/v1/nft/{nft_id}"          try:         response = requests.get(url)         response.raise_for_status()  # Проверяем на ошибки         nft_data = response.json()          # Извлекаем информацию о владельце         owners = nft_data.get('owners', [])         for owner in owners:             if owner['address'].lower() == wallet_address.lower():                 print(f"NFT {nft_id} присутствует в кошельке {wallet_address}.")                 return True          print(f"NFT {nft_id} отсутствует в кошельке {wallet_address}.")         return False              except requests.exceptions.HTTPError as http_err:         print(f"HTTP ошибка: {http_err}")     except Exception as e:         print(f"Ошибка при запросе к API: {e}")  # Задаем адрес кошелька и id NFT wallet_address = "UQBavjrc7HNs-X4nk2jYnQsvKysd24od3sXW5lWacI9Gyxc4" nft_id = "EQAHzmf4vskmqBAzDfbXJVYnGyaeUnbJCRfxpApthcTJgXES"  # Проверяем наличие NFT check_nft_in_wallet(wallet_address, nft_id)   I'm getting error 418, can you help me? It's just important for my project, and I've been working on it for 2-3 days now

Aleksey BingX | Snow: Are there anyone who has dealt with a similar topic? (reply to 124143)

Aleksey BingX | Snow: A colleague has a 503 error, the server simply does not give an answer, what is the reason for this?

наз: when I try to update the contract code I catch 7 exit code, what could be the problem?   if (op == op::upgrade_contract) {     throw_unless(err::not_admin, equal_slices(sender_address, admin_address));     (cell new_data, cell new_code) = (in_msg_body~load_ref(), in_msg_body~load_ref());     in_msg_body.end_parse();     set_data(new_data);     set_code(new_code);     return (); }   export async function run(provider: NetworkProvider) {     const main = provider.open(Main.createFromAddress(Address.parse('')));      const jettonWalletGovernedCodeRaw = await compile('JettonWalletGoverned');     const jettonWalletGovernedCode = jettonWalletCodeFromLibrary(jettonWalletGovernedCodeRaw);      const jettonWalletCode = await compile('JettonWallet')      const userScCode = await compile('User')      const newCodeCell = Cell.fromHex('b5ee9c724102...')     const newDataCell = beginCell()         .storeAddress(Address.parse(''))         .storeAddress(Address.parse(''))         .storeRef(userScCode)         .storeAddress(Address.parse(''))         .storeRef(jettonWalletGovernedCode)         .storeRef(jettonWalletCode)         .storeRef(             beginCell()                 .storeAddress(Address.parse(''))                 .storeAddress(Address.parse(''))                 .endCell()         )         .storeUint(100, 64)         .endCell()      await main.sendUpgradeContract(         provider.sender(),         toNano('2'),         0n,         newCodeCell,         newDataCell,     ); }

kira: hmmm, how do i set the forward amount?  i am using Tonkeeper to send an amount of jetton to contract, but i dont see where to config forward amount? the transaction: https://testnet.tonscan.org/tx/TeZrWuhiK7breW9NdSfjutKzYJbpznTaw0Ot4idUSWc= (reply to 124134)

&rey: Well Tonkeeper decided that users do not need such a thing as notifying contracts that they received some jettons. At this moment, usually a "dApp" (webpage showing QR code / sending message via TC2) is written. (reply to 124188)

kira: i also got another problem when i want to transfer an amount of jetton from contract to my own wallet i config the message message(0xf8a7ea5) JettonTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     responseDestination: Address?;     customPayload: Cell? = null;     forwardTonAmount: Int as coins;     forwardPayload: Slice as remaining; } message WithdrawUSDT {     amount: Int as coins; } and  receive(msg: WithdrawUSDT) {         self.requireOwner();                   send(SendParameters{             to: self.myJettonWalletAddress,             value: ton("0.05"),             body: JettonTransfer{                 queryId: now(),                 amount: msg.amount,                 destination: sender(),                 responseDestination: sender(),                 customPayload: null,                 forwardTonAmount: ton("0.05"),                 forwardPayload: rawSlice("F")             }.toCell(),         });         emit(WithdrawUSDTEvent{amount: msg.amount, balance: self.myJettonAmount, sender: sender()}.toCell());     } But when i run the script  export async function run(provider: NetworkProvider) {   const pawsPurchase = provider.open(     PawsPurchase.fromAddress(Address.parse(CONTRACT_ADDRESS)),   );    // Send USDT to the contract   await pawsPurchase.send(     provider.sender(),     {       value: toNano("0.3"),     },     {       $$type: "WithdrawUSDT",       amount: 5000n     },   ); } i don't receive any jetton from contract, but i still lost 0.3 TON do you see any error in above code? (reply to 124189)

kira: @pcrafter please help me 🥹

— 2024-11-18 —

Jacob: how to emit a event in func contract?  and how to scan the event by another programe?  =========  If I were to implement it myself:  1） Retrieve all transactions of the contract. 2）For each transaction, scan the associated vm_log to find the event strings. 3） Events emitted by the contract are written to the log using ~strdump(event_str).  Is there a good way to do this?"

&rey: forwarding 0.05 TON out of 0.05 incoming, for instance. (reply to 124192)

&rey: Simpler: 1） Retrieve all transactions of the contract. 2）Done. For each transaction, process it according to relevant contract state and message body. (reply to 124236)

Joe: On what does transaction acception time depends? E.g. i can send transaction and receive it's hash in 3 seconds. Or sometimes it takes 10 seconds. Is there any way to achieve consistent speed between sending transaction and its acception?

&rey: It mainly depends on when the subsequent block is generated; one each 4-6s. Your external message cannot become part of blockchain until a new block is generated.   Sometimes the message is broadcasted too slowly, such that it gets into next block. Sometimes it is even lost. (reply to 124264)

🐸📦 BumsEbenmosi: Ton access blocked

🐸📦 BumsEbenmosi: Cloudflare Ray ID: 8e4648466e1a9415Your IP: Click to revealPerformance & security by Cloudflare

🐸📦 BumsEbenmosi: Please I need assistance to get access

Jacob: Thank you very much . BTW, is there any filter mechanical for specify message? such as getPastEvent( filter:{topic}) in ethereum? (reply to 124245)

Akachi: You mean, jetton token? (reply to 124279)

IB: Hello guys , we are telegram mini app game devs , but now i'm in searching for web3 wallet bot , is there anyone with ready solution ?

TKAINU: Hello, what is Ton center return error code: 520?

Kyle: I'm using window.speechSynthesis.speak  for my miniapp but it's not working. I test with a audio file and my miniapp play sound but speechSynthesis does not play any sound. Please help me

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 58 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 39  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

наз: hi, can I use contracts from the mainnet in the sandbox?

TKAINU: please help me (reply to 124295)

Freed: is there a way to verify that user really has access to wallet using wallet connect? like signing a message that proves that user has access to private key without sending transaction?

Edward: Hello am New To Ton Technology    Can anyone help with with resources links so I can start learning how to write, deploy and build smart contracts and dapps on Ton

Tom: https://docs.ton.org/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users (reply to 124358)

TON Bounty Bridge: ​Rust TL-B serialization  🏷 Developer Tool  Summary:TL-B serialization is a fundamental component of the TON blockchain, enabling the encoding and decod...  Rewards: • $5,000 USD in TON equivalent  Created by DevNebulaX

Minimal ☄️: I am only seeing an option to forward ton amount for Jettons,  can I forward an amount when using TON as a main currency in the transactions?

&rey: Well any message is doing exactly that: transferring TON. (reply to 124391)

Marco | TAC: heya team, is there any way to use ton connect api to query if the wallet of the user is connected to TON mainnet or testnet?

Marco | TAC: (and eventually instruct from the dapp side to switch the network?) - pretty much like what happen with the EVM world

Даня: Hi I tried deploying my token using toncli  deploy command my file system is in 1-2 photo  I created project.yaml : project:   name: "TON Booster"   version: "1.0" contracts:   FeeJetton:     func:       - "./contract_FeeJetton.code.boc"     tact:       - "./jetton.tact"   JettonDefaultWallet:     func:       - "./contract_JettonDefaultWallet.code.boc"     tact: [] deploy:   ton: 0   workchain: 0   net: "mainnet" i keep getting this error: File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\utils\system\project_conf.py", line 59, in __init__     func_files_locations = [f"{project_root}/{file_path}" for file_path in contract_config['func']]                                                                            ~~~~~~~~~~~~~~~^^^^^^^^ KeyError: 'func is there way to fix those issues?

&rey: What's the source for that project.yaml layout? (reply to 124430)

Даня: I couldn’t find any tutorials so i asked chat gpt (reply to 124438)

&rey: Chatbots are worse than useless for TON actually. (Or for designing project architecture, as it turned out when I tested.)  An example how to work with toncli is at https://github.com/ProgramCrafter/ton-contract-template. When using it, I assume anything not there is unavailable. (reply to 124440)

Даня: Alright, Thank you

&rey: Network ID: -239 or -3. And no you can't ask the wallet to switch; a particular reason is that users often use different wallet apps for mainnet and testnet. (reply to 124403)

Russell: does anyone need a developer?

2happy: Hello, how can i get decimals value from metadata using tonweb? Why USDT have 6 and not ordinary ones 9?

Marco | TAC: Thanks. Is there a way to retrieve this chainid from the dapp connected with tonconnect? (reply to 124448)

Charles: Hi guys，when l develop mini apps with C#，How to get user information from the client? webhook or js interface？

Chelsea: I was working on hackers league and my dev suddenly ran away, any dev would want to finalize dev work with me and split prize? Contract and a bit of frontend are left. Dm me if u are interested

— 2024-11-19 —

Truman: Hi, does anyone know how to verify tokens? I pushed a pull request on ton-assets with a yaml file but it was not responded or approved. What should I do?

&rey: You do know that TMA is a website, and C# is not run there? So yes, JS interface.  Appropriate chat for this is @devs. (reply to 124485)

Erim | CSC: Are there any project looking for audits?

Gauthami: Hi I am new to ton i am trying to create a wallet and get its balance and do a transfer to another account  . I am able to create and check balance but not able to transfer TON from my account it shows inactive I want a way to activate the account before the transfer how do I do it ? this is the error I get Error sending TON transaction: Error: Received error: {"jsonrpc":"2.0","result":{"@type":"raw.fullAccountState","balance":"1999999260","code":"","data":"","last_transaction_id":{"@type":"internal.transactionId","lt":"28159174000003","hash":"w3MLwF9vjeRrZfsVFgqfCaZyTiWMgHnZAeeQyyu6YuQ="},"block_id":{"@type":"ton.blockIdExt","workchain":-1,"shard":"8000000000000000","seqno":25141047,"root_hash":"KqpmciWXF3MuIoBmbt69utoVVl7ZNHjQ/hYg+8IzIC4=","file_hash":"SS9ZqVU9iL0M4UjVfU3cFsZVcWx7Yh6UNv7r0ftsmwc="},"frozen_hash":"","sync_utime":1731995278,"@extra":"1731995297.0499074:0:0.7961081090161756","state":"uninitialized"},"id":1}   can some one please help me

Ray: I can support you with my skills. (reply to 124493)

TKAINU: Hello, what is Ton center return error code: 520?

&rey: Insufficient information to answer. (reply to 124543)

Eugene: Server-side error, have a look at https://chainstack.com/build-better-with-ton/ as an alternative which supports TON Center APIs as well

oracle: Hello! how can i get user and password credentials to gain access for downloading dumps?

oracle: @AntonTrunov maybe admins can help me?

Minimal ☄️: Yes when it's a direct TON transfer, but what if I want to forward some TON also?  I saw an examples for NFT and Jetton transfers (where one can add forward amount, payload, address) to the transactions, I am wondering if it's possible and how to do the same for TON transfer? (reply to 124394)

oracle: @AnswersTonBot how can i get user and password credentials to gain access for downloading dumps?)

fade: i think the docs is outdated, you dont need credentials to download it now (reply to 124556)

oracle: ur angel, i will try it (reply to 124557)

User<7376766125>: Multisender (reply to 124559)

oracle: its working, tnks (reply to 124557)

&rey: There is no such thing as "jetton" or "forward" on level of blockchain itself, only messages transferring some TON with specific payloads and contracts changing their state.  Therefore, for your question to be well-formed, you must write down what TON transfers do you want to happen. (reply to 124554)

Tom: Hey guys, imagine the state_init containing data of first bit as "false". Inside the recv_internal we use the bit as a lock. Only process if it's false. Then switch it to true.  Is race-condition possible if we send multiple messages with the same state_init in the body? Is it guaranteed that the lock will be concurrent-safe?

Minimal ☄️: Ok, what I want to do is when user sends to me SC for example 1 TON, I want to acquire like 0.05 TON more through (forward) fees that I am later going to use when sending assets to users That's what I am trying to accomplish basically  Does it matter if I am trying to do that while sending transaction via TonConnect (in case that SDK isn't supporting custom forward fees)? (reply to 124564)

&rey: Well you can't obtain any additional TON by design. You must make user send 1.05 TON. (reply to 124572)

Minimal ☄️: Ok, how did some apps (although via Jettons) took more fees than needed and stored them in order to distribute rewards later based on those fees?  Is there some other way or is it because jettons? (reply to 124573)

&rey: Transactions on each contract are executed sequentially. If your scheme works correctly whenever serialized, all is OK (reply to 124571)

&rey: TON Connect 2 shows how much is sent exactly. From that amount, contract may split in arbitrary way (and use previously accumulated balance is needed). (reply to 124574)

Ꭵ ѕ т н Ꭵ α q『』: Hey moderators can u please give me more than 2 ton in testnet?for testing I need like 97ton in testnet... My testnet address  0QB73Y5p2hWfJUPH3JAzYDjPniB4rLx4vxJEnhyh4vBAgYGr

&rey: It would be preferable to know what your project is about (what needs so much for tests?); also, please confirm if you've done tests in ton/sandbox. Usually given that @f_closer can provide some testnet TON. (reply to 124596)

&rey: I find it strange that lots of people have taken test TON but not many said what project they managed to build/fix; would be really interesting to know the interests sphere (DeFi? staking? onchain tx verification? custom contracts?)

&rey: Please note that docs development is shaped by pretty much this; the better the information, the more focused docs pages are.

&rey: Wdym "by API"? You must not provide secret key to any service network-separated from you. Transferring TON from a wallet without a signed message or its secret key is impossible. (reply to 124629)

&rey: In fact I do. https://t.me/tondev_eng/121717.  If u can engage with docs and connect the script parts, that be very good but also immensely more useful to you. (reply to 124632)

Artur: Hello guys. I need help about Ton transactions. How can I get webhook request or something like that to get received transaction to my address. Now I am using cron job to get latest transactions from my address but need to make it more dynamic like using webhook

Artur: Yess (reply to 124685)

&rey: Not a good idea to always call me! Chat history arguably knows more than me!  I don't know if there is a reliable service loading transactions and sending webhook calls. Low-level functionality certainly doesn't provide that — either all transactions are loaded or only requested ones. (reply to 124687)

— 2024-11-20 —

Tom: I learnt a lot from this chat but people like @pcrafter and @haint94 are the most helpful mentors 😁

Wiz: 'MessageRelaxed' and 'CommonMessageInfoRelaxed' errors.  I don't know how to instantiate correctly here or provide a value that fits.  Can somepoint point me in the right direction regarding my deploy.ts script for a token launch

Tom: Hello, everybody

Tom: I wanna know about Svelte project constructrue. Anybody knows?

Oken: Hello, i wanna develop my first smart contract, where to start

Akachi: Try simple counter smart contract example provided by TON. (reply to 124744)

Crypto: I couldn't find any information. It's my second account cuz first got spam (reply to 124746)

Crypto: How to compile funC

Gleb: https://docs.ton.org/v3/documentation/smart-contracts/func/overview#compile-with-js (reply to 124750)

Electrifier Σ: Good day everyone Using this construct (Either Cell ^Cell)  Please how can I store a cell (Cell) in the same Cell as a builder, if I do not want to store it as a reference (^Cell) in FunC Your assistance would be appreciated

Electrifier Σ: I believe slice.load_ref() returns that same Cell I want to store (reply to 124760)

&rey: Well you just store data into builder, not forming a separate cell out of it. That type is more accurately called Any. (reply to 124760)

&rey: So, (Either Any ^Cell).

Electrifier Σ: I am actually trying to add a forward_payload to a #transfer message which gets sent in the #transfer_notification message to my smart contract that deserializes this payload (reply to 124763)

Electrifier Σ: I guess I'll just have to use a reference (reply to 124765)

Electrifier Σ: I appreciate (reply to 124764)

наз: hi, I understand correctly that to send a message using funds from the contract balance and not from the incoming message, you need to use the send mode 64?

&rey: Nope. (reply to 124769)

наз: can I even send a message using my contract balance? (reply to 124770)

&rey: Messages use combined contract balance by default. (reply to 124771)

наз: thx (reply to 124772)

Nick🍅: Please block / de-list Tronkeeper app. It asks users to deposit 1 TON to activate boosted mining rewards. After depositing, the token dosen’t shows up in the app, and several user has reported this issue on X. Moreover, there is no option to contact support and they claim to listed their token after 41 days on bybit+bingx. This is a total scam project.

Khashayar: Tonkeeper app? (reply to 124776)

Khashayar: I think you just fell for a project

Khashayar: And that’s on you  You had to think why a project which claims to pay me $ asked TON from me

Khashayar: Move on

Akachi: https://tonhelloworld.com/01-wallet/ Use this tutorial. (reply to 124748)

&rey: I feel I should mention: the official, safe version of Tonkeeper wallet app is at https://tonkeeper.com/. (Though, it has internal browser which can show any dApp; please be careful working with those.) (reply to 124777)

Minimal ☄️: Guys, do you suggest using ton http api for contractProvider when working with HighLoadWalletV3 or implementing my own (although I don't know what should I implement there)?  Asking this because Ton http api is asking for lower version of ton/core, which is not compatible ton/ton,   I don't know how to solve this

yuichi: The following error occurred when trying to perform a hand swap using a private key created from a mnemonic. Do you know the cause of this? (use tonweb sdk)  Error during USDT to TON swap: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

fjila: It says one Cell can have 4 references. Can these referenced Cells also contain 4 more refs?

/B4ckSl4sh\: Yes (reply to 124821)

2happy: Hello. I have error, when deploying default blueprint counter contract.  What can i do with it https://pastebin.com/UrYhX5tG

2happy: i fust run npm create ton@latest && create simple counter && npx blueprint build && npx blueprint run (try to deploy to testnet. Connected with by testnet tonkeeper waller)

2happy: in mainnet same error

TON Bounty Bridge: ​Trust Score Bot (Capone) - trust level of various TON cryptocurrency  🏷 Developer Tool  Summary:The "Trust Score Bot" is a Telegram bot that enables users to assess the trust level of various cryp...  Created by seriybeliy11

Alexander: Hi! Do you have grants for game developers?

Matan: Are workchain blocks in sync with master chain ones? I.e are they in phase and equal lengths?

User<6375686734>: I'm software developer being familiar with writing func/tact and web3 / AI engineering . if you are in need of developer , reach me out . thanks

Ra: pls dm me i have some q (reply to 124889)

2happy: how can i make in-chain image for nft? Not link, but binary representation of image.

&rey: Ideally, yes. Actually they get generated at somewhat different rates. (reply to 124880)

Matan: Ok makes sense- was analysing average block minting rate every day vs number of masterchain blocks and it was always around 2.7TON (1.7 for masterchain and 1 for workchain) it never matched exactly. I suspected this was due to slight discrepency in masterchain vs workchain block progression? (reply to 124914)

JOBIANS TECHIE: fun processParticipation(ctx: Context, command: String, user: Address) { }  receive(command: String) {     let ctx: Context = context();     if (command == "me") {       self.processParticipation(ctx, "me", address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"));     } else {       let user: Address = address(command);       self.processParticipation(ctx, "", user);     }   } (reply to 124919)

JOBIANS TECHIE: Tact compilation failed                         Error: contracts/simple_counter.tact:125:46: Cannot evaluate expression to a constant: cannot evaluate a variable (reply to 124921)

JOBIANS TECHIE: Please anyone help me please

&rey: address(...) only takes a constexpr (actually, string literal). It cannot produce a TVM-address out of address string passed in slice. (reply to 124921)

JOBIANS TECHIE: What will I do (reply to 124928)

&rey: Well you are your project architect presumably. I'd make a message Participate {user: Address} and receive("me") {} receive(m: Participate) {} (reply to 124929)

JOBIANS TECHIE: Ok thanks (reply to 124930)

User<7418242907>: Hey! Can u help me please? I need example of code "Send usdt in ton" (reply to 124930)

&rey: Well see TON Cookbook. It directly provides code for sending from offchain; just rewrite code into FunC/Tact and you'll be able to send USDT onchain. (reply to 124945)

User<7418242907>: I can use js for that or not? (reply to 124947)

User<7418242907>: Okey, nice. Is some example in the chat or not ?

User<7418242907>: I found that, it code i need? https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment (reply to 124947)

User<7418242907>: When i make request to https://toncenter.com/api/v2/jsonRPC where i need sent api-key? (reply to 124947)

User<7418242907>: X-API-KEY in headers?

&rey: IIRC yes. (Though if you make requests manually, you can use toncenter.com/api/v2/<specific endpoint>.) (reply to 124954)

User<7418242907>: can i dm you? (reply to 124955)

User<7418242907>: i have one small question

User<7418242907>: Я просто на английском не особо говорю (reply to 124955)

User<7418242907>: Oh, okey. So, what mistake i do?  async function sendMessageToNetwork(signedMessage) {     const url = "https://toncenter.com/api/v2/jsonRPC";           const apiKey = "xxxxxxxxxx";      const params = {         method: "sendMessage",         params: {             message: signedMessage.toString("base64")         }     };      try {         const response = await axios.post(url, params, {             headers: {                 "X-API-KEY": apiKey             }         });         console.log(response.data);     } catch (error) {         console.error(error);     } }

User<7418242907>: i get 503 (reply to 124959)

&rey: There is @tondev chat. (reply to 124958)

User<7418242907>: okey, would you answer to my question, please (reply to 124961)

— 2024-11-21 —

&rey: 503 Service Unavailable is not your issue but server's one. (reply to 124960)

User<7418242907>: i use correct method or not? (reply to 124959)

User<7418242907>: just sendTransaction don't work too

&rey: Well where did you get both of those names?

User<7418242907>: ohhh, and what i need use? (reply to 124966)

&rey: I can tell what you should not use: ChatGPT. It lacks knowledge about TON. curl -X 'POST' \   'https://toncenter.com/api/v2/sendBoc' \   -H 'accept: application/json' \   -H 'Content-Type: application/json' \   -d '{  "boc": "te6cck...base64"  }' (reply to 124968)

User<7418242907>: oh, okey. Where i can get example of code "how send  internalMessageCell to ton" in cookbook? (reply to 124970)

&rey: Well that is most commonly done with     await walletWrapper.sendTransfer({...}); and it might be inconvenient to include a single line of code into cookbook. (reply to 124972)

User<7418242907>: Called contract failed how i can fix that? (reply to 124973)

Sarah: Hey, were you able to get it to work?  I'm also running my fullnode with docker and I have issue connecting my node with my local liteserver.. (reply to 98921)

Gauthami: Hi any suggestion on why I am getting this error ? (reply to 124536)

Gauthami: I used this to do the transfer https://ton-community.github.io/ton/

Sol: Development studio from Bangkok looking for technical tasks of any complexity write in lis

Tom: TonKeeper outage? https://boot.tonkeeper.com/keys?lang=en&build=3.24.7&chainName=mainnet&platform=web  {   "error": "yaml: unmarshal errors:\n  line 22: cannot unmarshal !!seq into string" }

دی دی پرایم: I can't run storage-deamon precompiled binaries from ton github in my m1 mac. Can anyone help me with it?

Alex: What kind of error do you have? (reply to 125023)

Sagara: Hi,  Yes, I'm getting error mentioned in these issues reported https://github.com/toncenter/ton-indexer/issues/84 https://github.com/toncenter/ton-indexer/issues/102 (reply to 113741)

User<7768993431>: Hello guys

User<7768993431>: I just met  a case

User<7768993431>: when someone transfers x TON to me, i don't know why my wallet transfers x TON back to the sender in the same transaction

潇洒: Guys, when transferring other tokens, the excess gas is not returned to the transfer wallet. How can I set it up?

User<7418242907>: Hello! Why i get error? https://tonviewer.com/transaction/c67542844dfdb662ebf9a82ddf18a0b5164b26287574cc60683bf12547564438

&rey: Keyword: "bounce". Solution: give unbounceable (UQ...) address to sender. Solution 2: deploy wallet by sending an outgoing transfer. (reply to 125044)

User<7768993431>: Thanks for your response. Solution: give unbounceable (UQ...) address to sender.  => The receiving wallet is already UQ format. Solution 2: deploy wallet by sending an outgoing transfer. => I don't understand this, please give me more information (reply to 125053)

User<7768993431>: as I understand, maybe sender intentionally sent TON with bounce wallet address as true. So I think I need cover this case when analyzing the transaction

&rey: or their wallet app is defective; there have been such reports. (reply to 125057)

Gopal: Hi, can anyone guide me on how to mint nfts on TON network?

User<7768993431>: I think they intentionally made that error. Because only 1 person always got that error. The rest works fine as expected. But anyway, I learned new knowledge from your answer. Much appreciated (reply to 125060)

Jeev: I'm new to ton blockchain. Can anyone guide me to clone tonswap including contract and frontend . Thanks in advance

Akachi: Check bouncable flag (reply to 125044)

User<7418242907>: Help me please (reply to 125050)

WhyesCode: Tonswap? (reply to 125066)

— 2024-11-22 —

Jason: hi , how to use the nested dict in funC smart contract, like mapping(address=>mapping(address=>uint256))

kevin: what is your advice on making my transaction accept faster then others?

TON Bounty Bridge: ​Multilingual localization collaboration system for Tact Docs  🏷 Developer Tool  Summary:The Translation Program is a collaborative effort to translate various documents related to Tact int...  Rewards: • 5000 USD in TON and SBT  Created by TonSquare

TON Bounty Bridge: ​Multilingual localization collaboration system for TMA Docs  🏷 Developer Tool  Summary:The Translation Program is a collaborative effort to translate various documents related to TMA into...  Rewards: • 5000 USD in TON and SBT  Created by TonSquare

&rey: Send the signed external to all public liteservers + tonapi + into overlay if you can. That's pretty much the only way. (And no, private nodes tend to not help.) (reply to 125172)

kevin: Thanks for your kindly reply, that is really helpful for me. (reply to 125187)

TON Bounty Bridge: ​Machine-readable TVM Instructions Specification  🏷 Approved 🏷 Developer Tool  Summary:It's quite painful to reimplement ~700 TVM instructions in each tool (disassembler, decompiler, etc)...  Assignees: hacker-volodya Created by hacker-volodya

Tran: Hello everyone, I would like to ask if there are any best practices for verifying user transactions when paying with Jettons for an in-game item? Currently, I’m adding a memo in the comment section and scanning transactions every 30 seconds using the API from getblock.io.

User<7768993431>: Adding a memo is a simplest way. 30s per scanning is also good for your system. If you need a realtime or nearly realtime , you need to pay for a rpc which allow you to listen your wallet. It is best to combine both methods above to prevent service issues (reply to 125206)

Tran: Ok tks u (reply to 125207)

kspr444: gyroscope doesnt work on ios device in telegram mini app ??

Wiz: GM to everyone.  Happy to BuiDl today!

Diamond 🐧: Can I ask you what frameworks and programming languages were used by Notcoin, Hamster and other apps like that ?

Saqib: Hi! TON Dev team. I'm trying to get the staking amount of a wallet. Can you guys help me figuring this issue out.

MI: Hi guys, how to estimate gas for transfer jetton?

MI: returned fee only 500,000, but actual is 5,000,000

MI: something wrong, but I dont known

MI: golang

Gauthami: Hi is there a API to monitor a transaction status in TON ?

TON Bounty Bridge: ​Bounty: Transcribe and Analyze the Podcast Episode  🏷 Approved 🏷 Education  Summary:The task is to create an article presenting a transcription and analysis of an episode of the podcas...  Rewards: • SBT Bounty Reward • 250 USD in TON  Assignees: expectfun Created by thekiba

Rasoul: Hello everyone,  I recently executed a transaction to create a liquidity pool on the TON network and received 16.45 LP tokens in return. However, these LP tokens aren't appearing in my wallet's transaction history.  Does anyone know how I can verify the amount of LP tokens received for each liquidity pool transaction?  Thanks in advance for your help!

JOBIANS TECHIE: Please how to do this in Tact Language   .len() .substring()

&rey: Impossible and impossible. (reply to 125235)

&rey: (well, you can, parsing Slice manually. But TVM is not well-suited for that.)

JOBIANS TECHIE: Do you know how to get last 11 digits from text in tact (reply to 125236)

&rey: Please see TON Smart Challenges and port FunC solution into Tact. (reply to 125238)

&rey: However you should just not parse strings. Mind that your contract may be used by other contracts.

JOBIANS TECHIE: Can you show me (reply to 125239)

&rey: Well I can (reply to 125241)

Rasoul: Friends, is my question clear enough? (reply to 125234)

TON Bounty Bridge: ​CLI utility to initialize a Telegram Mini Apps application.  🏷 Approved 🏷 Developer Tool 🏷 TMA Resource  Summary:It is necessary to develop an npm package that enables developers to initialize a mini-application u...  Assignees: heyqbnk Created by heyqbnk

JOBIANS TECHIE: Please tell me (reply to 125242)

&rey: Here you are: Caesar cipher. It will be quite easy to port it to parse digits out of string. https://github.com/ProgramCrafter/tsc4/blob/main/contracts/4.fc (reply to 125246)

JOBIANS TECHIE: It tact I'm using (reply to 125254)

&rey: Do you know that code can often be translated ("ported") into other programming languages than it was written in? (reply to 125255)

JOBIANS TECHIE: Why I can't add big texts   let messageBuilder: StringBuilder = beginString(); (reply to 125258)

JOBIANS TECHIE: Like it limited

&rey: TVM doesn't have native support for strings. All operations therefore have to be implemented using lower-level things. (reply to 125259)

&rey: Relevance of this question to developers' chat is unclear. (Also, have you tried to look at LP token balance?) (reply to 125234)

JOBIANS TECHIE: How to break    foreach (key, value in self.oh_my) {             // ...         } (reply to 125261)

JOBIANS TECHIE: If I do, I get error   foreach (key, value in self.oh_my) {             // ...            break;         }

&rey: I don't think that is possible. (reply to 125266)

Izu 🐈 🐈‍⬛ 🍅: Hey guys so i am currently building a blockchain based supplychain platform on Ton. basically the logic of the contracts in this project is based on agreement of both parties involved

oracle: I started the synchronization of arihvn node, and I get the same error in logs:   [ 1][t30][2024-11-22 12:14:41.958228498][transaction.cpp:445][!litequery] account C00860F0CB7F000016000000000000007003000000000000489460F0CB7F0000 does not have a valid ShardAccount to unpack [ 1][t30][2024-11-22 12:14:42.090902326][transaction.cpp:445][!litequery] account D023D7F1CB7F000082E72F0100000000010000000000000040EF55E4CB7F0000 does not have a valid ShardAccount to unpack [ 1][t30][2024-11-22 12:14:42.160856320][transaction.cpp:445][!litequery] account C00860F0CB7F000016000000000000007003000000000000489460F0CB7F0000 does not have a valid ShardAccount to unpack [ 1][t30][2024-11-22 12:14:42.825950303][transaction.cpp:445][!litequery] account D023D7F1CB7F000082E72F01000000000100000000000000605355FDC77F0000 does not have a valid ShardAccount to unpack [ 1][t30][2024-11-22 12:14:43.469354010][transaction.cpp:445][!litequery] account D023D7F1CB7F000082E72F01000000000100000000000000E09012F3C87F0000 does not have a valid ShardAccount to unpack [ 1][t30][2024-11-22 12:14:44.611669494][transaction.cpp:445][!litequery] account D023D7F1CB7F000082E72F01000000000100000000000000409BCFD1C87F0000 does not have a valid ShardAccount to unpack [ 1][t30][2024-11-22 12:14:44.623126582][transaction.cpp:445][!litequery] account D023D7F1CB7F000082E72F0100000000010000000000000080D1D2D1C87F0000 does not have a valid ShardAccount to unpack   should I be worried  it's just that the same address has been mentioned all along.  but the node is slowly being synchronized.

oracle: but Noda's synchronization is too slow

Rasoul: I am developing an application for analytics. The problem is that I cannot tell from the transaction how much LP was received. (reply to 125265)

Rasoul: for example  {   "event_id": "2f82f3e2434664d8f16289e71ba73560e7586038aa1de1682bfacbe0ad09de85",   "account": {     "address": "0:4557f96e5aa74506d5a109e75f5580a29bf4bbc5576e0886b5d9e5d5244113bf",     "is_scam": false,     "is_wallet": true   },   "timestamp": 1732270483,   "actions": [     {       "type": "JettonTransfer",       "status": "ok",       "JettonTransfer": {         "sender": {           "address": "0:4557f96e5aa74506d5a109e75f5580a29bf4bbc5576e0886b5d9e5d5244113bf",           "is_scam": false,           "is_wallet": true         },         "recipient": {           "address": "0:d0ea3e77ab6d47b99b70ea87259bbcf82d4d9c1ba4b638abe9492307e78f1dee",           "is_scam": false,           "is_wallet": false         },         "senders_wallet": "0:22c3503630c1ebae912afe01343f7929e7ecd226a50e2fd29314b1d2b3cd0df4",         "recipients_wallet": "0:b377220dd53e193a81bbd0797ea19ac1afca3e67fcad2d254c652e2217c9595c",         "amount": "136072325825",         "comment": "Call: StonfiProvideLpV2",         "jetton": {           "address": "0:8554d9516fe3471c341fbf743dc6f0d704b2656b2f39e7fc5112cab96435fa28",           "name": "MyTonWallet Coin",           "symbol": "MY",           "decimals": 9,           "image": "https://cache.tonapi.io/imgproxy/Qy038wCBKISofJ0hYMlj6COWma330cx3Ju1ZSPM2LRU/rs:fill:200:200:1/g:no/aHR0cHM6Ly9teXRvbndhbGxldC5pby9sb2dvLTI1Ni1ibHVlLnBuZw.webp",           "verification": "whitelist"         }       },       "simple_preview": {         "name": "Jetton Transfer",         "description": "Transferring 136.072325825 MyTonWallet Coin",         "value": "136.072325825 MyTonWallet Coin",         "value_image": "https://cache.tonapi.io/imgproxy/Qy038wCBKISofJ0hYMlj6COWma330cx3Ju1ZSPM2LRU/rs:fill:200:200:1/g:no/aHR0cHM6Ly9teXRvbndhbGxldC5pby9sb2dvLTI1Ni1ibHVlLnBuZw.webp",         "accounts": [           {             "address": "0:d0ea3e77ab6d47b99b70ea87259bbcf82d4d9c1ba4b638abe9492307e78f1dee",             "is_scam": false,             "is_wallet": false           },           {             "address": "0:8554d9516fe3471c341fbf743dc6f0d704b2656b2f39e7fc5112cab96435fa28",             "is_scam": false,             "is_wallet": false           }         ]       },       "base_transactions": [         "5f22e3a5b278750b84ecf44cffe1b3ac566cc8f1d9a6e360710eb298f4b49566",         "4caa8e36974b093f43de0434129ffc0089f219cc94f806515e3646c39837e614",         "f096f10b92348a6626388378aec2835d2bdf624bc04dcfb2e315c0bd197e90b6",         "c44b660879f2d2e1e54e436ceeaf0f69f6fb00258708d7f6a982972ffdcaec37"       ]     },     {       "type": "TonTransfer",       "status": "ok",       "TonTransfer": {         "sender": {           "address": "0:62b123720a2df7740c0156250f28a2fcd4d9928d7858a0d7b7a2d6bb7065af10",           "is_scam": false,           "is_wallet": false         },         "recipient": {           "address": "0:4557f96e5aa74506d5a109e75f5580a29bf4bbc5576e0886b5d9e5d5244113bf",           "is_scam": false,           "is_wallet": true         },         "amount": 183133591       },       "simple_preview": {         "name": "Ton Transfer",         "description": "Transferring 0.183133591 TON",         "value": "0.183133591 TON",         "accounts": [           {             "address": "0:62b123720a2df7740c0156250f28a2fcd4d9928d7858a0d7b7a2d6bb7065af10",             "is_scam": false,             "is_wallet": false           }         ]       },       "base_transactions": [         "6d3df70564aba7bcf4e812647d065c56e82835f707d9df9f966a79f237470ea7"       ]     },     {       "type": "JettonTransfer",       "status": "ok",       "JettonTransfer": {         "sender": {           "address": "0:4557f96e5aa74506d5a109e75f5580a29bf4bbc5576e0886b5d9e5d5244113bf",           "is_scam": false,           "is_wallet": true         },         "recipient": {           "address": "0:d0ea3e77ab6d47b99b70ea87259bbcf82d4d9c1ba4b638abe9492307e78f1dee",           "is_scam": false,           "is_wallet": false         },         "senders_wallet": "0:d3c7aa3b8261a8f1cb89b7fdc41c480ed519869cbb464f38133ac1b9a4062cd2",

Rasoul: This is a liquidity transaction that resulted in 16.45 LP token, but this number cannot be found in the transaction details. (reply to 125265)

Rasoul: Is the issue clear? (reply to 125265)

&rey: Well I don't think it resulted in any LP tokens, or they are non-TEP-74 compliant.  I'm still unsure if this is on topic. (reply to 125279)

Rasoul: I don't understand what you mean, but if you mean that the transaction does not generate any lp tokens, you are wrong because this is a real transaction and it has been tested. Here is the account to check the history  https://tonviewer.com/UQBFV_luWqdFBtWhCedfVYCim_S7xVduCIa12eXVJEETv9Wb  Let me put it more simply, the problem is that after liquidity is generated in the transactions, there is no sign of receiving lp tokens. (reply to 125282)

Rasoul: And I want to know how to extract it from the network.

Mehmet Ali: Tonkeeper wallet estimates TON fee for jetton transfers differently for each platform Like the tgapp calculated 0.10 TON, desktopapp 0.05 TON and androidapp 0.03 TON. Because our jetton need about 0.09 TON fee, below calculation transfer fails even we have enough TON in our wallets. Trying to reach support for over 2 week from TG, X and LinkedIn. No response!

Rasoul: Can you advise me on what to check to get the answer? (reply to 125282)

&rey: You should contact @subden probably. (reply to 125290)

Tran: I use https://www.npmjs.com/package/@ton/ton for send transfer my jetton, how I get transaction id with this lib

Даня: does anybody know what files do I include in the project.yaml when using toncli deploy? .func files or .boc files?

&rey: Well how do you obtain both? If via blueprint, then it supports deploys itself. (reply to 125354)

Даня: what to you mean how do i obtain them? I got them by compiling tact files (reply to 125355)

Даня: Hi! Do you know if it's possible to copy the tact files of an already existing coin and deploy it?

Father Pepe Of: Hey all, I'm looking for a team to help build a forum built on TON

WhyesCode: If you want to consider an individual Dev. We can chat about the details. (reply to 125370)

Father Pepe Of: Sure send me a message (reply to 125374)

— 2024-11-23 —

AmirhN: Is there any way to find when a contract was deployed? e.g when was the first time a personal wallet became active or a token launched?

Terry: yes, you can use dTON GraphQL API for this (reply to 125400)

AmirhN: Thanks! Will check it out! (reply to 125401)

Terry: or, simply query it via tonscanner if it's not for development purpose (reply to 125400)

AmirhN: it is for development purposes, but i'm not really familiar with GraphQL, so i was more looking for a simple rest API, didn't find anything related in tonapi[.]io (reply to 125404)

AmirhN: but if that's the only way ill figure it out :p

AmirhN: working on a meme token analyzor, as there are memepads launching around, i see many bad actors rugging users

Terry: graphql is nothing more than POST request with a structured body. ChatGPT definitely can help u with that

AmirhN: true 😁 thanks for the help bud! (reply to 125409)

Terry: glad to help

User<5721366642>: https://walletbot.me/tonconnect-bridge/bridge/events?client_id=16982745bae1b61a2e83919f389ea85ab664c  does any one know how this link created?

User<5721366642>: i want to connect my wallet to Blum by python or any other lang

&rey: You should look into source code of TC2 SDK. (reply to 125446)

white: anyone knows about encryptMessageComment function?

Ab: Send some docs of func programming language and projects

Anton: Unless you use the return statement and move your loop into a helper function (reply to 125269)

Matthew: const metadata = {             name: "xxx",             image: "xxxx",             description: "xxxx",             attributes: [{                 trait_type: "xxxx",                 value: "1"             }]         }  export function buildOnchainMetadata(data: { name: string; description: string; image: string }): Cell {     let dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())      // Store the on-chain metadata in the dictionary     Object.entries(data).forEach(([key, value]) => {         if(key == "attributes") {             console.log("attributes", value);             let subDict1 = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())             let index = 0;             for(let attribute of value){                 console.log("attribute", attribute);                 let subDict2 = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())                 Object.entries(attribute).forEach(([subKey, subValue]) => {                     console.log("subKey", subKey);                     console.log("subValue", subValue);                     subDict2.set(toKey(subKey), makeSnakeCell(Buffer.from(subValue, "utf8")))                 })                 subDict1.set(toKey(index.toString()), beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(subDict2).endCell())                 index = index + 1;             }             dict.set(toKey(key), beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(subDict1).endCell())         }        else {             dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")))         }     })      return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell() }  hi all, I want to setup onchain metadata for nft item. Can anyone help me build onchain metadata with attributes type as array, currently I can only build name, description and image

&rey: You're assuming that's possible. It is not, to my knowledge. (reply to 125458)

JOBIANS TECHIE: Please why decimal not showing in tact (reply to 125463)

Tom: Right now it’s not possible (reply to 125458)

&rey: Read chat history, docs.ton.org and some Github (reply to 125454)

&rey: I don't think you ever need decimals onchain? Anyways the calculation is done in indivisible units. (reply to 125466)

JOBIANS TECHIE: I want to add it in comment (reply to 125470)

Эльдар: you can store semi-chain way, store uri to json metadata contains atributes and store data that you need onchain in binary raw format at specific field. I am doing this in testnet getgems indexing that nft without problem, but tonkeeper in testnet did not correctly merge metadata (reply to 125458)

Roman: Pls can you provide an onchain example to test against? (reply to 125482)

2happy: How i can get this parameters in smart contract runtime?  max_tx_gas_price is the price in Toncoins of maximum transaction gas limit of NFT habitat workchain. For the basechain it can be obtained from ConfigParam 21 from gas_limit field.

Tech Reviver 🦁 $DCLC 🐍: May I know why my message is deleted

&rey: Because it is off topic. It might be relevant in @devs. (reply to 125492)

Tech Reviver 🦁 $DCLC 🐍: Oh Ok I am Sorry (reply to 125495)

🏆: Guys when I do ton auth, I write in manifest my app, do I need to register my app somewhere?

— 2024-11-24 —

&rey: No need to do that, the chain is The Open Network after all. (reply to 125533)

‌‌ ‌‌‌Mohammad: Hi folks,  We're testing our smart contract using TON TESTNET token and we're at the stage of requiring more than 150 TON TESTNET.  Can someone do a favor to send a few? 🙏🏼

&rey: It would be preferable to know what your project is about (what needs so much for tests?); also, please confirm if you've done tests in ton/sandbox. Usually given that @f_closer can provide some testnet TON. (reply to 125638)

‌‌ ‌‌‌Mohammad: It's basically a lottery app. We're doing our beta test in testnet And in this case I would like to follow real case scenario instead of lower amounts. So that I needed much more tokens.  I need to mention that we're part of TON Nest lvl 2.  Should I DM @f_closer ? (reply to 125647)

2happy: How much Ton I need in nft smart contract to store it for one year? What happens when the imbalance is zero, when it is removed

&rey: Depends on content repr size. Nothing. Frozen on -0.1 TON, deleted at -1 TON. (reply to 125657)

/B4ckSl4sh\: How the contract may be removed if It doesn't pay for storage (or anything else) when frozen? Or it pays for storage of its 256 bit hash of last state? (reply to 125658)

&rey: It does, + due fees (last transaction) data is also stored. (reply to 125660)

Tom: So if we use calculated address and its deployment as the replay guard, it is technically vulnerable? When that particular contract is out of balance for storage, c4 is empty so the attempt to deploy will succeed? (reply to 125658)

&rey: Please calculate WHEN that will happen. (reply to 125671)

Tom: I mean, if the user is the one who deploy the replay guard they could intentionally leave the balance as low as possible. In common sense, we might have a check for storage fee of 5 years but after that period, they could double claim right? (reply to 125672)

Tom: From my point of view, the chance of that scenario is kinda low but possible. And long vesting is also common in real world.

Tom: So basically the expiration is a good practice and when create a token distribution like this, we have to take the maximum expiration into account for storage requirement.

&rey: Well after something like two thousand years they could claim again, yes. (reply to 125673)

Tom: The more refs and cells my contract has, the higher storage fee required. E.g. this implementation. https://github.com/Gusarich/airdrop So 5 years is still a small amount but 10 years would be noticeable amount for most users. (reply to 125676)

Tom: Could optimize the fee with library cell right?

&rey: Once your contract is frozen at -0.1 TON, it no longer has those refs. (reply to 125677)

Tom: I see, so the c4 slot is still alive? That would explain a lot. (reply to 125679)

Tom: I thought frozen state = load_data will result in an empty state. My bad.

&rey: In frozen state contract will simply refuse to execute anything unless defrosted first. (reply to 125683)

Tom: Thanks a lot. That’s what I’m missing here. (reply to 125684)

&rey: (Therefore it will not forward any requests to your central contract until it reaches -1.0 TON, and that takes two thousand years in basechain.)

Tom: Is this behavior testable with sandbox? I’m going to write one to learn more. Will it behave the same if i change blockchain.now?

&rey: It should, except that to my knowledge TON uses uint32 timestamps which will run out by 2106. (reply to 125687)

Tom: Good to know, I will test it with lower expiration and observe the behavior of frozen state. Thanks a lot for sharing (reply to 125688)

&rey: Well whatever you use for compiling Tact also supports deploying the compiled contracts. (reply to 125357)

Tom: Today I also read about the shard optimization from PixelPlex team. It’s eye-opening and interesting. There is so much to learn  https://docs.ton.org/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice

— 2024-11-25 —

&rey: Wdym? In TON, it is by design impossible to pull something from another contract unless it explicitly supports that. That ensures user safety against honeypots, limiting any potential loss to the amount sent in first transaction. (reply to 125800)

T: Has anyone worked with Omniston SDK? I have a couple of questions regarding loading the token balance and making a swap from other tokens not placed in the demo

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 54 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 41  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Jacob: hi, guys would you like to help me for following issues?  getEndpoints(network, "toncenter-api-v2", suffix, single); getEndpoints(network, "ton-api-v4", suffix, single)    Q1: how can we get the detailed API description for toncenter-api-v2 and ton-api-v4? or there is a standard about toncenter-api-v2 and ton-api-v4?  Q2: const client = new TonClient({ endpoint });  should we use client or TonClient4({endpoint})?  how can we check functions of TonClient4 is suppoorted by xx-api-vXX or not?

&rey: Q1: IIRC you can just see at toncenter.com. Q2: first matches the former, second matches the latter. (reply to 125811)

Jacob: thank you very much (reply to 125816)

JOBIANS TECHIE: Unhandled Runtime Error Error: Invalid address. Got EQBI_UfEeMiG54GC8BmtHV1nEnla1eUGVQMi1Snhatlx_gp3  Source ../build/Ton/tact_Ton.ts (1036:17) @ writeAddress    1034 |     async getGetParticipantInfo(provider: ContractProvider, address: Address) {   1035 |         let builder = new TupleBuilder(); > 1036 |         builder.writeAddress(address);        |                 ^   1037 |         let source = (await provider.get('getParticipantInfo', builder.build())).stack;   1038 |

JOBIANS TECHIE: const participant = Address.parse(address);           const participantResponse = await contract.getGetParticipantInfo(participant);

JOBIANS TECHIE: Please help

&rey: Please check there are no imports to ton or ton-core in your project, as those were deprecated in favor to @ton/ton or @ton/core.

JOBIANS TECHIE: I don't understand (reply to 125856)

Carlton Bags | Kek.fm: hey guys. i am coming from the eth ecosystem and looking into ton now. i read an article that stated transactions are not atomic but async. is there documentation available that explains a bit more on how to ensure then that transactions are rolled back when a transaction-step fails?

&rey: No transaction-steps here; one transaction = one contract changes = one message processed. (reply to 125865)

&rey: You're perhaps speaking of transaction trees – a convenience view of what happens. Anyway, you can't take back any funds which have already been sent.

Carlton Bags | Kek.fm: Isnt that impractical? For example something like flash loans. When you try to repay at the end of the tx but this fails, the rest of the state changes persist. (reply to 125867)

&rey: That is the design of TON. And yeah if something is not implementable (in reality/in TON) then there's no point attempting to implement it as is (in reality/in TON). (reply to 125870)

Carlton Bags | Kek.fm: But what upside is there to have it implemented like that? (reply to 125873)

Carlton Bags | Kek.fm: It makes it really painful to implement  defi apps (reply to 125873)

&rey: All transactions require bounded amount of data and therefore can always progress. More throughput; basically, whatever infinite sharding offers. (reply to 125875)

&rey: You should reconsider need for those dApps and specific implementations then. (Early on, TON was focused on utility applications; there are traces of that in the whitepapers.) (reply to 125877)

Carlton Bags | Kek.fm: Thx for your answers. Can you point to which utility applications were in mind? Instant messaging? (reply to 125879)

Carlton Bags | Kek.fm: Cause defi does not seem to be the target then

Roman: Have you checked TON Blockchain Course already? I believe there was a topic on that. In short you may opt to use internal tokens to represent state of your dApp. However i've never seen the implementation (reply to 125865)

Carlton Bags | Kek.fm: Will check that out (reply to 125885)

Adamu: I every I want to build dapp any doc about it

NPA120: What can I help you? (reply to 125897)

Cryo_mil: Hello erveryone I have made it far with my mini app i am now on the smart contract part and am Having trouble Ive added blueprint sdk but am struggling to invoke functions for NFTS and jettons

WhyesCode: Could you provide more context or clarity what the issue is? (reply to 125919)

Cryo_mil: I want to create a burn contract that Transfers the NFT or jetton to a deadaddress and will give rewards such as ton back to the sender

WhyesCode: If you don't know how to do that. You should consider having a professional doing it for you. (reply to 125939)

WhyesCode: Or do you just need a guide?

Cryo_mil: I just need guidance I’ve looked at the docs am using blueprint sdk and tact language

Cryo_mil: Im tryna do off chain for the NFTs and transfer it to a dead address when NfT address is selected

T: Hi, I have a question about Omniston-SDK, is there any chance i can still use it's SDK with tokens that are not listed on beta version of app, im trying to override it's api and use without additional check from omni but it shows me error of fetching balances each time I'm trying to perform a swap with jettons that isn't listed on beta version of Omniston

&rey: Well firstly there's no onchain method of determining if something is an NFT; secondly, jettons are usually true-burned instead of transfer to zero or null address; thirdly, what if someone mints a fresh NFT and then takes "recycle" reward from your contract? The balance might run out. (reply to 125939)

Mathew: Did you find a way around it (reply to 125945)

Cryo_mil: No (reply to 125952)

Mathew: Did you need help (reply to 125953)

&rey: Offtopic for this chat, irrelevant of whether that's false. (reply to 125958)

— 2024-11-26 —

LowGas: Hi devs, who knows how to buy/sell jettons on GasPump, PumpFun e.t.c  Using @ton/ton JS | TS  Thanks

Nick: Hi, guys, could you help me realize how does ton calculate it's comission when it's included in transaction? (with sending mode of 64 -carry all the remaining value of the inbound message)  I've sent 1 message with 3 Ton transfers inside a single message (0.05 TON each transfer amount). I also tried to estimate the fee with dedicated API method and it said that my fee amount is gonna be about 0.00096203 TON  Hence each transaction should be sent with amount ~0.049 TON but actually each transaction amout is 0.0479308. How does it calculate the fee and how can I try to estimate it the right way? That's tonviewer link with my last 3 transactions in there for a better context

Victor: Hello everyone, I have a question, has anyone tried to save a file in a TON Blockchain, do I just save the bits of the file in a TON cell, and if the file does not fit into the cell, then I transfer them to another cell and connect them with links? Can the same thing be done with any file type, media, text and other formats?

Tom: Yes, basically buffer. (reply to 125981)

Tom: The linking is called snake cell, afaik

Victor: I have another question about TON Storage: does it store data on the blockchain or somehow on distributed network nodes, like IPFS?

Victor: Thanks for the help) (reply to 125983)

&rey: I don't know what's that at all (reply to 125946)

T: it's open code from stonfi this is a decentralized liquidity aggregation protocol designed specifically for TON Blockchain. It aggregates liquidity from various sources, including:  AMM DEXs  On-chain RFQ resolvers (TON) (reply to 126008)

M: 🔄 Question about TON Connect wallet restoration in .NET/Python  I'm working with TON Connect and successfully implemented wallet connection using:   var options = new TonConnectOptions { ManifestUrl = "..." }; var storage = new RemoteStorage(...); // custom storage implementation var tonConnect = new TonConnect(options, storage);  // Later restoring connection var restored = await tonConnect.RestoreConnection();  Few questions about wallet restoration:  1- Is RemoteStorage mandatory for restoration? 2- What's the best practice for storing wallet data - should we persist it in a database or is temporary storage enough? 3- For a web API, would storing the connection details in a user's session be sufficient?  Would appreciate any insights on proper wallet restoration patterns, especially for server-side implementations!  #tonconnect #development #dotnet #python

&rey: You know that usually TON Connect 2 is used on frontend, right? (reply to 126010)

M: Thanks for the response! yes, I understand TON Connect 2 is typically frontend-focused. however, I'm working on a backend service that needs to:  1. Handle authorized wallet operations 2. Maintain wallet sessions for authenticated users 3. Execute automated transactions for approved wallets  Is there a recommended pattern for server-side TON integrations? or should I be architecting this differently - perhaps with frontend handling the wallet connection and passing signed transactions to the backend?  would appreciate any guidance on best practices for this use case! (reply to 126011)

Mujtaba: Hello fam,   I am new to TON ecosystem (though I have read a lot of theory on it) and am trying to customise the Jetton standard contract.   While I noticed a lot of improvement opportunities in the repo but feels like the repository isn’t actively maintained (opened issues are unattended, PRs are waiting indefinitely to be merged and tests failing on the recent config params) Is there a specific reason for this?

Mujtaba: Do we know who are maintaining the repo and are they open to contributions?

&rey: Well the standard impl is provided for validating that your own is working correctly, one should write their own whenever possible.

Даня: Hello  I tried deploying the my project using toncli deploy but I keep running into the same error and do not know what to do. Does anybody have any idea why would i be encountering this error?   PS C:\Users\danil\Desktop\TON_Booster> toncli deploy INFO: 🚀 You want to interact with your contracts ['contract'] in testnet - that's great! INFO: 🦘 Found existing deploy-wallet [kQB7vBkKQZM60dnEMLyVmvTi2bYo5fgkG7zSyXzeukfUJ3LR] (Balance: 2.498173999💎, Is inited: True) in C:\Users\danil\AppData\Local\toncli\toncli INFO: 👻 Your smart contract project [C:\Users\danil\Desktop\TON_Booster] is now going to be deployed, get ready! INFO: 🌈 Start building: C:\Users\danil\Desktop\TON_Booster\build\contract_FeeJetton.code.fc:5:1: error: cannot open source file `contract_FeeJetton.headers.fc`   #include "contract_FeeJetton.headers.fc";   ^  Traceback (most recent call last):   File "<frozen runpy>", line 198, in _run_module_as_main   File "<frozen runpy>", line 88, in _run_code   File "C:\Users\danil\AppData\Roaming\Python\Python312\Scripts\toncli.exe\__main__.py", line 7, in <module>   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\main.py", line 65, in main     CommandsExecuter(command, string_kwargs, parser)   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\utils\commands\commands_executer.py", line 39, in __init__     self.command_mapper[command](self)   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\utils\commands\commands_executer.py", line 70, in deploy_command     return DeployCommand(self.string_kwargs, self.parser)            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\utils\commands\command_classes\deploy_command.py", line 17, in __init__     deployer.publish(real_args[2:])   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\deploy_contract.py", line 79, in publish     self.compile_func(real_contracts)   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\abstract\deployer.py", line 149, in compile_func     fift_build(self.project_root, cwd=self.project_root, contracts=contracts)   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\utils\func\commands.py", line 39, in build     build_files(contract.func_files_locations, contract.to_save_location, func_args, cwd))     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\danil\AppData\Roaming\Python\Python312\site-packages\toncli\modules\utils\func\commands.py", line 63, in build_files     get_output = check_output(build_command,                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Python312\Lib\subprocess.py", line 466, in check_output     return run(*popenargs, stdout=PIPE, timeout=timeout, check=True,            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Python312\Lib\subprocess.py", line 571, in run     raise CalledProcessError(retcode, process.args,

Mathew: Lemme check and see if I can help (reply to 126020)

Andrii: Hello, guys👋. Where i can find all exit_codes reasons? I'm using @ton/ton and trying to get jetton balance. When running the JettonMaster.getWalletAddress() i get the error "Error: Unable to execute get method. Got exit_code: -13". I can't find the reason

Даня: What do you need in order to check? (reply to 126023)

Mathew: This indicates a problem specific to the smart contract logic or the parameters used in the method call. and Unfortunately, there is no universal documentation for all possible exit_code values, as they are specific to each smart contract's implementation. (reply to 126024)

Mathew: Did you trouble double check (reply to 126025)

Andrii: masterAddress is NOT or USDT address.  {     not: '0:2f956143c461769579baef2e32cc2d7bc18283f40d20bb03e432cd603ac33ffc',     usdt: '0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe', } (reply to 126027)

Andrii: if i run methods on tonscan with equal parameters, it works well (reply to 126027)

Mathew: OK please explain in dm

Mujtaba: I think I don’t agree, we should be reusing as much possible to avoid common pitfalls and the standard implementation is meant to be battle-tested not only to verify your implementation (reply to 126019)

Даня: Yeah i did (reply to 126028)

Mathew: It seems like you're working with the wrong Jetton Master address when trying to fetch the wallet address. Based on the details you've provided, here’s what’s likely happening: (reply to 126030)

TON Bounty Bridge: ​Swagger-like toolset for interaction with contracts and TL-B  🏷 Developer Tool  Summary:SummaryMy main goal is to solve this problem (and some more problems), to make a specification (let'...  Created by voloshinskii

&rey: Meanwhile the fact is, it is possible to do better than the a standard impl. Less fees, better for users. (reply to 126032)

Joker: Guys, how I can get selection of nfts by it's attributes? In tonapi I didn't saw any fileds about attributes at all... Maybe there is any api with this possibilities or another way?

Mujtaba: True, but statistically the probability of one person doing better than a community maintained standard implementation is close to zero. And if someone is this smart, he should be contributing this towards the community 🤷‍♂️ (reply to 126038)

Mujtaba: But yeah, thanks for sharing your insight, I think I can do better than this one 😄

Mujtaba: I just hope I don’t miss something that creates trouble in production

Joker: Guys, how I can get selection of nfts by it's attributes? In tonapi I didn't saw any fileds about attributes at all... Maybe there is any api with this possibilities or another way? I need get selection of nft by its attrs for my site

TON Bounty Bridge: ​Improvement of SBT Minter  🏷 Developer Tool  Summary:The functionality of the SBT minter bot developed in#214needs to be extended to improve user-experie...  Rewards: • 800 USDT • Bounty SBT  Created by coalus

khara bet: do you currently need a developer?

Mujtaba: @pcrafter if you’re denying the utility of openzeppelin like contracts in TON, I think we’re creating an unnecessary resistance to mass adoption.

User<8053811500>: Can one parse a number from tx comment in func & friends within the contract?

&rey: Unrelated to topic of this chat. (reply to 126042)

fjila: Hey Guys, how do I throw an error and send the Ton back without bounce?

&rey: Would you like to pay contract's storage fee from its prior balance or from incoming message (that way, contract will have exactly same balance going on)? (reply to 126093)

fjila: I want to Carry the Amount from the incoming message

fjila: I think it works with commit right?

fjila: If i send the ton back, then commit and then throw the error

&rey: I don't understand which option you've chosen. (reply to 126095)

fjila: Storage Fees should be paid from the incoming message

&rey: raw_reserve(0, 4); begin_cell()   .store_uint(0x10, 6)   .store_slice(sender)   .store_uint(0, 4 + 107)   .end_cell().send_raw_message(128); (reply to 126102)

fjila: And how do i set the error code then?

&rey: What would error code mean in a successful transaction (without bounce)? (reply to 126104)

fjila: It is not successfull. But i want to be able to also refund tokens. I want to see that there was an error but also refund tokens. (reply to 126105)

&rey: Well I don't think indicating failure with TVM exit code is a good choice here. I'd just send tokens back with 0xFFFFFFFF in forward payload.  (commit should work correctly though.) (reply to 126107)

— 2024-11-27 —

kevin: any one how to find some private liteserver ?

final: Make yourself (reply to 126149)

kevin: I want as much as possible, and saving costs (reply to 126150)

Bear: int fee = token_amount * 2 / 100;  Will this affect the overflow issued?

Anton: Why not just divide it by 50? (reply to 126184)

Tom: Better use muldiv anw (reply to 126184)

Xu: Can't TonCenter testnet POST requests be sent anymore?

Bear: ha.... 2 is the fixed number I might changed later (reply to 126185)

&rey: Well token amount doesn't exceed 2^120 in any case so there can be no overflow in that expression. (reply to 126184)

Victor: Hello everyone, can you tell me if I can use Pinata as a storage for files of different formats in IPFS and the TON blockchain for hash storage?

kira: afternoon everyone. Is there any way to calculate the gas fee of a transaction at the beginning? For ex, i want to do a transaction with contract, like transfer jetton to contract, i have to config the fixed TON value at the beginning, and the excess will be return to me.

Dant: hi everyone, i am setting archive node so i need user and password for dump downloading. Support me this job, thanks!

Bishop: Hi Anton! Could I DM you for recommendations for trustworthy FunC Devs?   Edit: willing to pay a finders fee.  (I will answer no DMs directed towards me, thank you)  Edit2: Anyone that can get a recommendation from an admin gets major points for the interview. (reply to 126185)

&: DM me if you need FunC dev. (reply to 126207)

Buschi: good mo0rning ++  anyone here who knows a bit about how i can find a GOOD How-To docs to learn, how i can build a minter for tonchain to mint our collection direct out of our ipfs node ? (Linux ubuntu server... the normal madness...

Gift: Hi Guys

Gift: i am new here and currently building a mini app on TON

Gift: i already have a bot

Gift: but not functional

Gift: any assistance will go a lon way

NPA120: What can I help you, bro (reply to 126267)

Gift: can i dm? i need assistance in making my eCommerce platform functional (reply to 126269)

NPA120: Is it related to Ton or Telegram mini app? (reply to 126270)

Gift: completely (reply to 126272)

NPA120: ok, let's discuss in private

Gift: its a minapp on TON

Gift: Just sent a dm (reply to 126274)

FBM: I cam help you too, bro (reply to 126270)

Tóki: Hey guys! :)  I am not a software engineer  A friend has created a channel just experiment with the Telegram-application and invited me to join it. To test how the streaming was he played some computer game. While he was playing the game, it lagged quit some. Why is it that when the TON-community channel streams directly from Dubai that there is no lagg?

&rey: Remember that DMs may carry more scam than usual. In particular, without trust in counterparty one shouldn't prepay job in any significant amount, nor send completed work without guarantee that TON will be received for it. Both kinds of scams are there. (reply to 126277)

Valentin: Does locking liquidity work in ton as in other chains where LP tokens have to be burned?

&rey: IIRC here LP tokens on burn return your liquidity back. You can use pools which do not track added liquidity at all (well now you can't because there are none, but it's an option) or send them to whatever address you see fit. Usually, 0:000000000000000000000000000000000000000000000000 is used. (reply to 126300)

Valentin: but is this typically done here? I'm checking for most well known tokens and the owners of the LP tokens are not 0 address

&rey: Well whoever farms presumably want to pull liquidity out when they choose to move on to another token. (reply to 126303)

&rey: You should DYOR because I haven't.

Valentin: It seems like some LP tokens are held by addresses like blockburner.ton

2happy: How can i call jetton transfer via tonconnect?

&rey: Send jetton transfer order to user's jetton wallet, obtained via get-method. (reply to 126312)

&rey: Well you shouldn't assume it is distinct from 0:000000000000000000000000000000000000000000000000 — those are same. (reply to 126310)

Dylan: anybody in here have experience working with the HighloadV3 wallet? have a few questions.

— 2024-11-28 —

Cryo_mil: how to burn jettons?

Dylan: send burn message to the JettonMaster

Dylan: probs a website for it

Cryo_mil: so I need to call that contract? do I need to import like jetton-master from ton/ton or what is the best method? (reply to 126344)

Dylan: do you just want to burn them once or set it up in code? (reply to 126347)

Cryo_mil: yes one time burn for selected jetton

Dylan: just use the coinfactory ui to do it theres a burn mechanism there

Cryo_mil: ok thank you (reply to 126350)

sangmin: how create address name ?  ex. ByBit 1

Crypto: You can do like name.t.me (reply to 126354)

Crypto: It's exchange names only gives to whales but you can with .ton and t.me (reply to 126354)

User<5970492369>: Help me

Classifiedweb3: U mean dns ? (reply to 126354)

Cryo_mil: import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'; import styled from 'styled-components';  const BurnButton = styled.button`   display: flex;   align-items: center;   justify-content: center;   font-size: 16px;   font-weight: 600;   padding: 12px 24px;   background-color: #FF4500;   color: white;   border: none;   border-radius: 30px;   cursor: pointer;   transition: all 0.3s ease;   box-shadow: 0 4px 6px rgba(255, 69, 0, 0.1);    &:hover {     background-color: #FF5722;     transform: translateY(-2px);     box-shadow: 0 6px 8px rgba(255, 69, 0, 0.2);   }    &:disabled {     background-color: #ccc;     cursor: not-allowed;   } `;  const BurnJetton = ({ token }) => {     const [tonConnectUI] = useTonConnectUI();     const userAddress = useTonAddress();      const burnJettons = async () => {         try {             if (!userAddress) {                 throw new Error("Please connect your wallet first");             }              if (!token) {                 throw new Error("Token information not provided");             }              console.log("Token info:", token);              if (!token.wallet_address) {                 throw new Error(`Jetton wallet address not found. Token data: ${JSON.stringify(token)}`);             }              // Create proper burn message payload             const payload = {                 "op": 0x595f07bc,  // burn operation code                 "query_id": 0,                 "amount": token.balance  "1000000000", // Default to 1 token if balance not provided                 "response_destination": userAddress             };              // Send transaction using TON Connect             await tonConnectUI.sendTransaction({                 messages: [{                     address: token.wallet_address,                     amount: "100000000", // 0.1 TON for fees                     payload: {                         abi: "jetton_wallet",                         method: "burn",                         params: payload                     }                 }],                 validUntil: Date.now() + 5 * 60 * 1000             });         } catch (error) {             console.error("Failed to burn jettons:", error);             alert(error.message);         }     };      return (         <BurnButton              onClick={burnJettons}             disabled={!userAddress}         >             Burn {token?.metadata?.symbol  'Jetton'}         </BurnButton>     ); };  export default BurnJetton;

Cryo_mil: tried sending the burn message with message(0x595f07bc) JettonBurn {     query_id: Int as uint64;        // arbitrary request number     amount: Int as coins;           // amount of jettons to burn     response_destination: Address;  // address where to send a response with confirmation of a successful burn and the rest of the incoming message coins.     custom_payload: Cell?;          // optional custom payload } (reply to 126360)

sangmin: When I check my wallet address, I want it to come out like ByBit1. (reply to 126359)

sangmin: https://tonscan.org/address/UQDD8dqOzaj4zUK6ziJOo_G2lx6qf1TEktTRkFJ7T1c_fKne  If you look at the tonscan, you'll see the name.

Cryo_mil: does tonkeeper web not have testnet option anymore? lol

p: Does v5 wallet support subWalletId?

sangmin: What is the Sendmode to avoid using the fee at the receiving address? I would like to pay the fee for the address I receive from the address I send.

&rey: Well it is not possible since transaction on sender's address ends long before computation on receiver's address starts, or before receiver's storage fee is known. (reply to 126384)

sangmin: I understand. If so, can I know in advance how much fee the recipient will spend? (reply to 126386)

&rey: Onchain, no contract can, because receiver is potentially in another shard and inaccessible to the validator generating block. (reply to 126387)

sangmin: If so, is it correct that the recipient has to pay the fee unconditionally? (reply to 126388)

sangmin: Thank you for the information. !!

Kyle: Is there anyone have this error: web version wallet reports 'Error: Unsupported Link' when tonConnectUI.sendTransaction. Pls help me

Cryo_mil: is test net not a thing anymore on tonkeeper? its not working with blueprint

ethan: hey guys, one of my jetton user wallet has nearly 1 ton balance, is there a way to withdraw the TON coin balance of my jetton user wallet?

&rey: In most cases, impossible. (reply to 126409)

Tom: You are the author of the Jetton, how did you implement your contract? (reply to 126409)

Piri Piri: Hello! I've deployed a "NFT Collection" Contract on test net using WalletContractV5R1 with mnemonic.  However my Tonkeeper wallet address differs from the contract deployer address even thou i am using the same mnemonic. What could be the reason for this discrepancy?

Tom: How different? (reply to 126420)

Piri Piri: Inside tonkeeper wallet (W5 TESTNET) address is a different one than the contract deployer address.  Both addresses have Contract Type wallet v5 r1 (reply to 126421)

Gift: True...my fifth sense is always with me😊 (reply to 126294)

Tom: Do they have the same format of bounceable or testnet? What are the prefixes? (reply to 126423)

Piri Piri: Well for example putting the addresses on ton org/address, results in no common format of the addresses

Piri Piri: bounceable/non-bounceable main/testnet

Piri Piri: about prefixes tonkeeper: 0QBIWDf collection: kQABdd_-

Olesia: why reentrancy is not possible in ton?

Anton: because your messages are not sent immediately but rather queued to be sent after executing your logic (reply to 126438)

Olesia: thank you (reply to 126439)

Anton: but still it’s possible to run into an issue similar to re-entrancy, when you process an incoming message, change the state of your contract so that some security-related invariant is violated (maybe be you are waiting for a response of another contract) and then react to a third-party message in a way that wasn’t intended

Anton: this pattern is usually called message-in-the-middle

Antoxa: Advise which bot to use to pay for a paid subscription to the channel, I would like the payment to be in tone or stars. There are some ready-made solutions.

&rey: You should DYOR on prices/extra features/comparison/etc but I shall suggest the baseline solution: CryptoBot can do that. (reply to 126445)

Tom: Try comparing same prefix or parse and check the raw address (reply to 126431)

&rey: They are indeed different, the changing prefix is not that long. (reply to 126448)

Tom: The kind of attack won’t work if my message containing both deploy state init and specific logic inside body right? (reply to 126442)

Anton: but happens after that? the contract still could be a target (reply to 126450)

Louis: Hi guys I am trying to understand how I can know which token is transferred when I am analysing a jetton_internal_transfer ?

&rey: That information is not provided explicitly, but you can check jetton-data of any participating jetton wallet. (reply to 126452)

Louis: Ok thanks a lot and can this be achieved via the RPC ?

Tom: I mean in the same inMessage. With both body and state init (reply to 126451)

Anton: no, no, message-in-the-middle needs at least two incoming messages to be applicable (reply to 126455)

Kohl: You will need indexing services like Toncenter V3 APIs (reply to 126452)

Antoxa: CryptoBot - well, it's very clumsy, what other options are there, otherwise in this bot you can not choose payment through a keeper or an internal cart wallet. (reply to 126446)

Louis: Actually I am trying to use tonapi but they do not return the information and I was wondering how I can parse it ... (reply to 126458)

Tommy: 🦃 Happy Thanksgiving Day! 🍁  Today, I want to express my gratitude to everyone in the amazing blockchain and developer community. Whether you're building, learning, or supporting, you’re the reason innovation thrives.  Let’s take a moment to appreciate the journey we’ve been on and the milestones ahead. Thank you for being part of it! 🙌  Wishing you all a joyful and warm Thanksgiving filled with happiness, success, and good vibes! 🌟  Cheers to building a brighter future together! 🛠️🚀

Edm: Hi, I've been facing smart contract action phase error with code 50. Does anyone has experience and know what does this mean?

Tom: Highly depends on the implementation of contract if it’s not here  https://docs.ton.org/v3/documentation/tvm/tvm-exit-codes (reply to 126470)

Tom: Btw, somehow the official reference of jetton contract returns the same custom exit code for two different scenario lol 😂 709 if I remember correctly (reply to 126471)

Edm: thanks. I just find out the 50 exit code is standard in tact compiler. Since I don't own the smart contract, is there any way to bypass this error?  https://docs.tact-lang.org/book/exit-codes/#50 (reply to 126471)

Anton: it is not Tact-specific, Tact utilizes exit codes from 128 to 255, it’s just Tact’s documentation documents even more TVM exit code than TON docs (reply to 126474)

Pironmind: Who developed FunC language?

Anton: Nikolai Durov (reply to 126482)

User<7477077163>: ? (reply to 126482)

💠Sh ~: Hi can an admin answer my question plz, are there specific protocols that we have to work with for Volume and Liquidity for Open League season 7? Or we can work with any protocol that has Ton blockchain?

Valentin: Does buy/sell tax exist in dexes?

Angel: I have one question can we create a token with following tokenomics? - xx% owner -xx% for burning -xx% rewards -xx%  exchange for sale

Kenny$$Shillz: So far I haven't seen any tokens with taxes... (reply to 126527)

0xFave: a dev I know did something like this (reply to 126527)

Angel: Can you tell me his contact info, please? (reply to 126535)

Konstantin: EQBH-lTgGoe6x-wBoZGbOSBdVjfImvLEA2bueS_JR3GBsqFb this one has 5% fee EQAWVv2x6txoc5Nel9CltbfYSBMOOf0R9sb7GnqY-4ncmjcQ this one as well EQCQ8FSCoOnCIaeX29YFGOgGdRn7p9A1uS8giVjZKQyRDxui 2% fee EQDhUoC8vFkB8BCDOVrYHylnFeLA343csl8_KSnj4FP3wc0_ 2% fee  All opensourced (reply to 126536)

— 2024-11-29 —

sangmin: I asked for an estimate fee in toncenter api, but destination_fees is returned to an empty value. Why is that?

Kohl: You get only jetton-master address in transaction response, to map address to name you can use another API: https://toncenter.com/api/v3/jetton/masters (reply to 126464)

Cryo_mil: Any devs that can code a Jetton burner and NFT burner on ton blockchain that will give back TON for burn

&rey: Swap fee? It can be there, yes. (reply to 126523)

&rey: Where would said TON come from? (reply to 126556)

Cryo_mil: from closing the cell and withdrawing the ton is what my higher up told me he want done (reply to 126559)

Cryo_mil: basically like sol slugs functionality if youve ever seen it  @pcrafter

&rey: TON doesn't offer any refund on deleting contracts. Moreover, most NFT contracts don't support deletion. (reply to 126560)

Cryo_mil: yes im aware of NFts not burnable they just get sent to a void address normally, my boss is convinced that closing cells that have been previously created would be the way to do it on ton blockchain (reply to 126562)

&rey: Well that would not achieve anything. He's welcome to show transaction, or whitepaper reference, pointing otherwise. (reply to 126566)

Cryo_mil: ive researched and see that you can use jetton burn by sending message to the contract which i havent  figure out but i do believe theres no way to refund it right I would have to have a wallet address filled with ton to redistribute

&rey: Yes. and someone could mint and burn jettons only to make your contract run out. (reply to 126568)

Cryo_mil: ok so he sent me this Below is an implementation of a burn function in FunC for closing cell accounts and retrieving the TON contained within. The function destroys the contract (cell account) and transfers its remaining balance to a specified recipient.

Cryo_mil: the method hes referring to is closing cells

Cryo_mil: @pcrafter

&rey: Well, even if it worked (and it doesn't), it would only transfer contract's balance. (reply to 126572)

Legend: how I can get ton price using oracle contract with tact language

Ar: Hi mates, Is it a common issue when wallets present in testnet aren't found by testnet.tonscan? It is loading for already a long time and doesn't give any result

Cryo_mil: Issue just started yesterday for me (reply to 126594)

Ar: it should be inactive yes, but it isn't supposed that it shouldn't be searchable from tonscan right? (reply to 126595)

Ar: Also I am not able to initiate the wallet in BluePrint project

Cryo_mil: Is ton keeper wallet web not working for testenet? (reply to 126598)

Ar: yes the address is managed by tonkeeper. maybe checking another wallets? lemme do that

v: hello, How to return the corresponding hash in time after calling the contract method？

v: await provider.internal(via, {       value: opts.value,       sendMode: SendMode.PAY_GAS_SEPARATELY,       body: beginCell()           .storeUint(Opcodes.TR, 32)           .storeAddress(opts.jettonWalletAddress)           .storeAddress(opts.responseDestination)           .storeCoins(opts.amount)           .storeCoins(opts.forwardTonAmount)       .endCell(),   });  This is my calling program

2happy: I found a mistake in the documentation  https://docs.ton.org/v3/guidelines/dapps/cookbook#writing-comments-long-strings-in-snake-format  Here we need to replace this   function readStringTail(slice) {     const str = new TextDecoder('ascii').decode(slice.array); // decode uint8array to string     if (cell.refs.length > 0) {         return str + readStringTail(cell.refs[0].beginParse()); // read next cell     } else {         return str;     }  with this function readStringTail(slice) {   const str = new TextDecoder('ascii').decode(slice.array); // decode uint8array to string   if (slice.refs.length > 0)     return str + readStringTail(slice.refs[0]); // read next cell   else     return str; }  How can i contribute?

Ar: No bug still exists

Ar: still can't acces wallets info in testnet tonscan (reply to 126597)

&rey: Info at https://docs.ton.org/v3/contribute#tldr. (reply to 126610)

Piri Piri: Hello again! I come with the same issue from yesterday (sorry but I couldn't figure it out) So I've created this new Tonkeeper wallet and the address shown for W5 Testnet is: 0QDW7gnZ2nTgEbMQti0QspcjtTywaEEm4JYxVoY_L3MgTssO I've followed the guide for NFT Minting, from docs ton org. Even thou I've copied the exact mnemonic, the addresses are not similar to the one in testnet: Bounceable Address:  EQBS1Nn2bIPS2twP9NLk6Gcbj3tL6WfWXAbOtm8DR6i_db6y Non-bounceable Address:  UQBS1Nn2bIPS2twP9NLk6Gcbj3tL6WfWXAbOtm8DR6i_deN3  What could be the reason for this? I can share the code but it's pretty much identical to the one from ton docs

Piri Piri: Basically there is a miss match between address inside Tonkeeper and address in the contract, imported with the mnemonic from Tonkeeper

Ar: is tonkeeper the only wallet with acces to testnet?

Piri Piri: I'm only using Tonkeeper and I have (only) two different testnet wallets inside. Tried with both but I'm facing the same issue

Ar: I may have the same issue, I just thought blueprint gets the address from different place, other then the  one configureded in .env (reply to 126618)

Piri Piri: I meant that inside tonkeeper app I'm using two wallets, and inside the contract i've inserted mnemonics from each. It results into different owner addresses every time

Piri Piri: I mean, each mnemonic generates its own unique deployer address when used inside the contract

Piri Piri: Ok so I've switched the code from WalletContractV5R1 to WalletContractV4, and also in tonkeeper i've added the v4r2 wallet (same mnemonic) and now the addresses are the same.

&rey: Then script's subwalletID is incorrect for testnet. (reply to 126627)

N 🍅: LOL (reply to 123416)

Yei: I can't switch tonkeeper to testnet too, shows a blank screen when i try (reply to 126620)

B: Hello all, serious answers please  I am considering to become a full time Ton Dev, is there a demand as in jobs available out there? And where?

Ar: My subjective opinion is that there is only demand only for seniors now, not only in TON Dev, but the whole Smart Contract and Blockchain industry (reply to 126631)

Ar: you need to be ready to start to work for very low compensation in some companies that want to experiment this new position 'Smart Contract Developer' and be work not only for TON System but for Solana and EVM like networks too

B: Thank you for sharing, I truly appreciate it (reply to 126634)

Ar: Also a very good skill will be to learn write test for your contracts, because what clients value most in the web3 product is it's Safety. Learn some audition too

&rey: I notice also demand for people who can finish things they start.

Ar: Actually I am also not prof, but I am currently in a road I just described. Would appreciate more opinions and sharing too (reply to 126635)

&rey: Азамат: What should the request at Tonconsole invoice endpoint look like?  I get 400 Bad request Idk

&rey: You are using outdated instruction. Please don't do that. Instead, you can add testnet wallet at main menu where wallets are added in general. (reply to 126630)

Ar: the clicking is outdated? where do I switch it then? (reply to 126644)

Ar: I see only wallet management window where I can add wallets for the network chosen

&rey: You don't switch (as having test and mainnet wallets with same keys makes you send money from both), you just add a new wallet with option ~"import testnet wallet" (reply to 126645)

&rey: Have you updated Tonkeeper in the last year? (reply to 126646)

Ar: I just downloaded it

Ar: I see no import testnet, could u please send me some docs? Also Do I get you right, it works like in metamask? The account have the same addresses in testnet?

Ar: It may fix my bug, but in that case what are the addresses when I switch the netwrok by clicking in an outdated way?

2happy: https://github.com/ton-connect/sdk/issues/217  It does not work, can you give me an example? (reply to 126318)

&rey: Maybe different Tonkeeper platforms have different ways. (reply to 126650)

Ar: That's very weird, now when I search my ton-mainnet-address in testnet.tonscan I get the wallet, but with the address that I observed when switching to testnet in tonkeeper with slight modification of first symbol 0->k

Ar: that's fogin weird

&rey: You should maintain them at divergent seqnos then, or TON-carrying messages would get sent from both. (reply to 126654)

Ar: didn't get a thing of what u said sorry :)) (reply to 126657)

&rey: For one message on testnet wallet, send also one on mainnet (with parameters of your choice), and vice versa. Otherwise a certain message will be replicated over both networks, losing you some TON. (reply to 126658)

Mohamad Amin: Hello everyone, I want to create a ton deep link to transfer a specific amont of TON to a wallet with a certain comment. I read some docs and came up with this syntax:  ton://transfer/{address}?amount={amount}&text={comment}but when I open this link with tonkeeper, I can modify the comment and amount. Is there any way to modify the url so that the values are fixed and cannot be changed in application??

Antoxa: How do they connect such a payment service, maybe there is an instruction, you can only connect to the application? Alternatively, you can contact the bot so that when paying for a subscription, there are these payment methods.

&rey: It's ill-advised to disallow user to do something on their device. There's no special parameter. (reply to 126665)

&rey: It's just TON Connect 2; I sense some misconception about "payment service" / "application" / etc; what did you mean? (reply to 126666)

Ar: So to develop on TON testnet I should send messages on both mainnet and testnet? (reply to 126661)

Ar: I am not really familiar with message concept yet, but this sounds not flow-ethical

Antoxa: It can only be connected to an application where you can make payments in tone through it, or you can connect it to a bot to make payments to a paid channel. And how to go to the site or this service. (reply to 126669)

&rey: You should actually use different wallets, one which would have different mnemonics are sufficient to prevent message replication (reply to 126670)

&rey: (generally, if wallet addresses are same modulo flags and checksum, then same signatures and same transfer orders will apply)

Mohamad Amin: I want to prevent mistakes by making the link fool proof. Can I use the ‘bin’ value to pass the comment to the transaction? Doesn’t it make the comment unchangable? (reply to 126667)

Ar: I got the difference. Tonkeeper shows Non-bounceable address of the key, but tonscan shows the bounceable one (reply to 126674)

Ar: And the mainnet and testnet addresses for this both are different but predefined

Ar: But inthat case I'd like to know if all of these are generated from one cryptographic algorithm and one privatekey

Ar: https://ton.org/address/ here all variations can be found

Ar: That's strange guys # Contract Requests on testnet.tonscan AddressRequested->ResponseAddress * Testnet.Non-bounceable -> X * Testnet.bounceable -> Testnet.Bounceable * Mainnet.Non-bounceable -> Testnet.Bounceable * Mainnet.Bounceable -> Testnet.Non-bounceable

Tiqan: How do i top up a library cell?

Louis: Hi guys quick question for you: Will an out_msg always be an in_msg in another transaction ? Sorry for the noob question

&rey: Yes unless it is ext_out_msg (log). (reply to 126690)

&rey: That is, TON guarantees message delivery.

Louis: Thanks ! So this basically means that if I want to map all the value transfers that happen in a transaction I should only consider the in_msg and not the out one as they will be value_transfer in other transactions right ? And does this also applies to jetton ?

Vadim: If you want to try what we’ve got , please try our game : https://t.me/NTPTwisterBot

Louis: And so then if I understood well the ext_out_msg are basically only in_msg right ?

Ar: I don't really get is there a wrapped TON version in TON network itself?

Ar: like wrappedETH exists in ethereum

Alex: Can someone clarify if, in the TON network, the address for receiving TON tokens and USDT tokens is the same or if they are different?

Merlin: same (reply to 126703)

Alex: where to read this info? (reply to 126704)

Ar: I just got into the topic just after you asked (reply to 126705)

Ar: Here is a useful article by binance https://www.binance.com/fr-AF/square/post/11-28-2024-tether-announces-launch-of-usdt-on-ton-chain-via-coinet-16847581082634

Alex: This seems to be more of an announcement rather than official documentation. It highlights the launch of USDT on the TON blockchain and its potential benefits but doesn’t provide technical details or clarify if the address for TON tokens and USDT is the same. (reply to 126710)

Ar: PLease send me one too, I am just learning too (reply to 126711)

Ar: I think the answer was wrong. USDT is just a simple Jetton in terms of TON blockchain, why is it unique? It is integrated into TG. It acts as a simple Jetton, so for each walletAddress holding Jetton there is a different address to hold it and the rest is managed by jeton's  master contract. The model works just like in Solana (reply to 126711)

Ar: I think I am just getting what were u telling me. I should use two different private_keys for production and testing, because when I deploy into mainnet it automatically deploys from tied testnet too? (reply to 126674)

Ar: but what happens  when I deploy from testnet address into testnet???

Ar: what happens with tied mainnet address in mainnet?

&rey: Then message can be sent in mainnet as well. The networks are quite interoperable after all. (reply to 126723)

Tiqan: Do different rpc's make my transactions faster/slower? Or is there any way how to speed them up?

&rey: Send externals to all. The fee is only taken once by the blockchain anyways. (reply to 126757)

&rey: Order for further propagation of messages through blockchain is maintained by validators and whitepapers. The main thing spending time is cross-shard messaging, which has to wait for next masterchain block creation.

𝟮𝟱:𝟮𝟱: Hey guys I have a cors error in my console log  Is there any solution for that?

&rey: At the moment there's no error text yet. Do you have one? (reply to 126782)

𝟮𝟱:𝟮𝟱: I'm sorry I mean cors error   It said that , ton bridge has been blocked my request or my domain  How can I fix it ? (reply to 126783)

Minimal ☄️: Guys,  How to decode 'data' field that I get after a transactions via highload wallet v3 are done, which is an array of numbers?  For example, I'd like to know when the tx fails, for example when there is not enough TON on highload wallet, but I in the response, there is no result code field or anything similar so I suppose it's inside of the data, since it can be clearly seen on the tonviewer explorer?

— 2024-11-30 —

Adam: Guys

Adam: Does anyone know how to send 3 messages in on tx with mnemonic

Adam: But with wallet v5 not highload wallet (reply to 126803)

Gift: please what is reentrancy? (reply to 126441)

Andrew: There is a good manual by Certik of breaking message graphs in TON. (reply to 126814)

Andrew: It is much more re-entrant than Ethereum

Alex: https://eoolk3ab.paperform.co/   Attention TON Developers   The TON Dev Community calls on your expertise to contribute to advancing the TON ecosystem. Your insights and experiences in development are invaluable in making TON more robust and user-friendly.  We encourage every community member to share their experiences with TON development by participating in our survey.  The survey encompasses four key topics and will take approximately 5-10 minutes of your time.  👉https://eoolk3ab.paperform.co/

J.: Hello everyone, I am looking for people that can help build out a project using the TON ecosystem for restaurants. Please DM if you can help. Than you.

J.: Overview This framework outlines how blockchain technology can expand restaurants by involving the community and employees. By creating a utility token ecosystem, aspiring restaurateurs can access funding, while employees gain rewards and a retirement plan, all fostering growth, sustainability, and community engagement.

Ags: Check your DM (reply to 126849)

𝟮𝟱:𝟮𝟱: Hey guys  This is not an ads Just a help to developers and entrepreneurs   I have some dedicated servers If you need a great dedicated server, DM me

User<7062442470>: Hi all. I'm trying to simulate a swap on stonfi, but it gives me a 400 bad request error: const stonfi_api = require('@ston-fi/api'); const stonfi_sdk = require('@ston-fi/sdk');  const PROXY_TON = stonfi_sdk.pTON.v1.address; const NOT = 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT';  const client = new stonfi_api.StonApiClient();  (async function() {     const swap_simulation = await client.simulateSwap({         offerAddress: NOT, // string         offerUnits: '1', // string         askAddress: PROXY_TON, // string         slippageTolerance: '1' // string     });      console.log(swap_simulation); })();

User<7062442470>: Help pls😢 (reply to 126888)

Артур: Hey everyone! I’m currently working on creating a smart contract that can receive NFTs. I’m curious about how I can make it check which collection an NFT belongs to. Has anyone else encountered this issue and has any solutions?

&rey: Well it's pretty hard, one has to pass StateInit for both collection and NFT which'd have to be cross-checked... (reply to 126925)

Артур: I guess one way is to call GetStaticData and check if msg.collection == self.targer_collection 🤔 But this approach adds even more moving parts such as checking that ReportStaticData was not forged etc. (reply to 126927)

Freed: do you want to deploy jetton smart contact and then distribute it among other wallets? (reply to 126935)

&rey: pytoniq, await WalletContractV3R2.send_transfer (reply to 126935)

&rey: Python ways to send messages (thus, create transaction trees) on TON. (reply to 126946)

&rey: Well isn't that in docs.ton.org? It sure is in chat history. And you can reimplement pretty much anything done in smart contract or in TS so that it'd be written in Python instead. The other question is, how you want to send jettons.

— 2024-12-01 —

kevin: hi, is there any alternative of mempool monitor service of tonapi.io ?

dkdn: Who is doing the technology? We can do a project together.

&rey: Well pretty much everyone here is? That is, except scammers. (reply to 127004)

dkdn: At present, I want to do encrypted e-commerce, solve the problem of traditional e-commerce through blockchain, and do such a project.

دی دی پرایم: Has anyone launched TON site using TON Storage and wanna help me?

Imran: `import {   useTonWallet,   useTonAddress,   useTonConnectUI, } from "@tonconnect/ui-react"; import {   Address,   beginCell,   Cell,   contractAddress,   StateInit,   storeStateInit,   toNano, } from "@ton/core";  export default function App() {   const wallet = useTonWallet();   const walletAddress = useTonAddress(true);   const [tonConnectUI] = useTonConnectUI();    const deploySubscription = async () => {     if (!walletAddress) return null;      const BENEFICIARY = "EQB_tUOR3CwzEsHlq2aDrLF6R6Y_FV70GBldzfBwa8Hyq042";     const config = {       wallet: Address.parse(walletAddress),       beneficiary: Address.parse(BENEFICIARY),       amount: toNano(0.5),       period: 120, // 2 mins       startTime: 120,       timeout: 3600,       last_payment_time: 0,       last_request_time: 0,       failed_attempts: 0,       subscription_id: 1,     };      const init = {       code: Cell.fromBase64(         "te6ccgECDwEAAmIAART/APSkE/S88sgLAQIBIAIDAgFIBAUDavIw2zxTNaEnqQT4IyehKKkEAbxRNaD4I7kTsPKe+AByUhC+lFOH8AeOhVOG2zyk4vgjAts8CwwNAgLNBgcBIaDQybZ4E/SI3gQR9IjeBBATCwSP1tngXoaYGY/SAYKYRjgsdOL4QZmemPmEEIMjm6OV1JeAPwGLhBCDq3NbvtnnAphOOC2cdGiEYvhjhBCDq3NbvtnnAVa6TgkECwoKCAJp8Q/SIYQJOIbZ58EsEIMjm6OThACGRlgqgDZ4soAf0BCmW1ZY+JZZ/kuf2AP8EIMjm6OW2eQOCgTwjo0QjF8McIIQdW5rd9s84ArTHzCCEHBsdWeDHrFSELqPSDBTJKEmqQT4IyahJ6kEvvJxCfpEMKYZ+DPQeNch1ws/UmChG76OkjA2+CNwcIIQc3VicydZ2zxQd94QaRBYEEcQNkUTUELbPOA5XwdsIjKCEGRzdHK6CgoNCQEajol/ghBkc3Ry2zzgMAoAaCGzmYIQBAAAAHL7At5w+CdvEYAQyMsFUAXPFiH6AhT0ABPLaRLLH4MGApSBAKAy3skB+wAAMO1E0PpA+kD6ANMf0x/TH9Mf0x/TB9MfMAGAIfpEMCCBOpjbPAGmGfgz0HjXIdcLP6Bw+CWCEHBsdWcigBjIywVQB88WUAT6AhXLahLLHxPLPwH6AssAyXP7AA4AQMhQCs8WUAjPFlAG+gIUyx8Syx/LH8sfyx/LB8sfye1UAFgBphX4M9Ag1wsHgQDRupWBAIjXId7TByGBAN26AoEA3roSsfLgR9M/MKirDw=="       ),       data: beginCell()         .storeAddress(config.wallet)         .storeAddress(config.beneficiary)         .storeCoins(config.amount)         .storeUint(config.period, 32)         .storeUint(config.startTime, 32)         .storeUint(config.timeout, 32)         .storeUint(config.last_payment_time, 32)         .storeUint(config.last_request_time, 32)         .storeUint(config.failed_attempts, 8)         .storeUint(config.subscription_id, 32)         .endCell(),     } satisfies StateInit;      const stateInit = beginCell().store(storeStateInit(init)).endCell();      const address = contractAddress(0, init);      await tonConnectUI.sendTransaction({       validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes       messages: [         {           address: address.toRawString(),           amount: toNano(0.5).toString(),           stateInit: stateInit.toBoc().toString("base64"),         },       ],     });   };    const deployAndInstallSubscription = async () => {     if (!walletAddress) return null;      const BENEFICIARY = "EQB_tUOR3CwzEsHlq2aDrLF6R6Y_FV70GBldzfBwa8Hyq042";      // Configuration for the subscription contract     const config = {       wallet: Address.parse(walletAddress),       beneficiary: Address.parse(BENEFICIARY),       amount: toNano(0.5),       period: 120, // 2 minutes       startTime:  120,       last_payment_time: 0,       last_request_time: 0,       failed_attempts: 0,       subscription_id: 1,     };

Imran: // StateInit: Code and Data for the contract     const stateInit = {       code: Cell.fromBase64(         "te6ccgECDwEAAmIAART/APSkE/S88sgLAQIBIAIDAgFIBAUDavIw2zxTNaEnqQT4IyehKKkEAbxRNaD4I7kTsPKe+AByUhC+lFOH8AeOhVOG2zyk4vgjAts8CwwNAgLNBgcBIaDQybZ4E/SI3gQR9IjeBBATCwSP1tngXoaYGY/SAYKYRjgsdOL4QZmemPmEEIMjm6OV1JeAPwGLhBCDq3NbvtnnAphOOC2cdGiEYvhjhBCDq3NbvtnnAVa6TgkECwoKCAJp8Q/SIYQJOIbZ58EsEIMjm6OThACGRlgqgDZ4soAf0BCmW1ZY+JZZ/kuf2AP8EIMjm6OW2eQOCgTwjo0QjF8McIIQdW5rd9s84ArTHzCCEHBsdWeDHrFSELqPSDBTJKEmqQT4IyahJ6kEvvJxCfpEMKYZ+DPQeNch1ws/UmChG76OkjA2+CNwcIIQc3VicydZ2zxQd94QaRBYEEcQNkUTUELbPOA5XwdsIjKCEGRzdHK6CgoNCQEajol/ghBkc3Ry2zzgMAoAaCGzmYIQBAAAAHL7At5w+CdvEYAQyMsFUAXPFiH6AhT0ABPLaRLLH4MGApSBAKAy3skB+wAAMO1E0PpA+kD6ANMf0x/TH9Mf0x/TB9MfMAGAIfpEMCCBOpjbPAGmGfgz0HjXIdcLP6Bw+CWCEHBsdWcigBjIywVQB88WUAT6AhXLahLLHxPLPwH6AssAyXP7AA4AQMhQCs8WUAjPFlAG+gIUyx8Syx/LH8sfyx/LB8sfye1UAFgBphX4M9Ag1wsHgQDRupWBAIjXId7TByGBAN26AoEA3roSsfLgR9M/MKirDw=="       ),       data: beginCell()         .storeAddress(config.wallet)         .storeAddress(config.beneficiary)         .storeCoins(config.amount)         .storeUint(config.period, 32)         .storeUint(config.startTime, 32)         .storeUint(config.timeout, 32)         .storeUint(config.last_payment_time, 32)         .storeUint(config.last_request_time, 32)         .storeUint(config.failed_attempts, 8)         .storeUint(config.subscription_id, 32)         .endCell(),     };      // Build payload     const payload = beginCell()       .storeUint(1, 8) // op code       .storeUint(0, 8) // plugin wc       .storeCoins(toNano(0.5))       .storeRef(stateInit.code)       .storeRef(stateInit.data)       .endCell();      // Send transaction with the payload     await tonConnectUI.sendTransaction({       validUntil: Date.now() + 5 * 60 * 1000, // Valid for 5 minutes       messages: [         {           address: walletAddress,           amount: toNano(0.5).toString(),           payload: payload.toBoc().toString("base64"),         },       ],     });   };    return (     <div>       <h1>TON Web Subscription</h1>       {wallet ? (         <div>           <p>Wallet connected: {wallet?.account.address}</p>           <button onClick={deploySubscription}>Deploy Subscription</button>           <button onClick={deployAndInstallSubscription}>             Deploy And Install Subscription           </button>         </div>       ) : (         <p>Please connect your TON wallet.</p>       )}     </div>   ); } `

Imran: Can someone help me identify what mistake I’m making? I’m struggling to figure it out. I’m trying to deploy and install the Wallet v4r2 plugin using opcode 1 via @tonconnect/ui-react, but it’s not working as expected.  - The deploySubscription function is working fine and successfully deploying the contract.   - However, the deployAndInstallSubscription function is not working. I’m attempting to send a payload containing the opcode and subscription plugin data to my Wallet v4r2 using @tonconnect/ui-react. Instead of deploying and installing the plugin in my Wallet v4r2, it returns the TON back to my wallet.  Any insights would be greatly appreciated!

&rey: There are two facts any of which is sufficient to explain that. 1. It is impossible to do anything except send some messages (and, once per connection, authenticate user) via TON Connect 2. 2. sendTransaction(...payload) leads to internal message with that payload being sent, not an external one. Plugins are installed via external messages. (reply to 127023)

Gift: Do you own one or you are dev and you looking to work with someone who has started development? (reply to 127010)

Imran: Thank you. It’s not possible to send external message in wallet via @tonconnect/ui-react?  Which package I should use to send external message? (reply to 127025)

&rey: It's not possible to sign it appropriately. (reply to 127030)

Imran: Got it. Based on our conversation, my current understanding is that sending external messages from a wallet without the secret key isn't possible, correct? (reply to 127031)

/B4ckSl4sh\: Correct (reply to 127034)

User<5987561572>: getting this error while integrating ton wallet :((

G: Hello, I'm looking to get some toncoin on the testnet network, following TestGrams-HOWTO document. It says to run runmethod get_pow_params in liteclient, however that method returns "account not initialized yet(cannot run any methods)" for all the testgivers.   Did anyone successfully gain testgrams from mining in the test network? And knows how to do it?

/B4ckSl4sh\: Get testnet tons here @testgiver_ton_bot (reply to 127040)

Imran: Interestingly, there seems to be no way to send an external message from a wallet without using the secret key. If a user connects their wallet to my web app, why can’t I send an external message using any available package? Why is it not possible to install a plugin in the wallet without the secret key? I came across an example that demonstrates deploying and installing a plugin using the secret key. However, I’m looking for a method to achieve this without needing the secret key, where the user can simply sign the message through their wallet. Could you clarify the reason for this limitation?  Reference: https://github.com/toncenter/tonweb/blob/76dfd0701714c0a316aee503c2962840acaf74ef/src/contract/wallet/WalletContractV4R2.js#L75 (reply to 127035)

/B4ckSl4sh\: Because when user connects the wallet he is not sharing private key to you. He just gives you the right to "propose" transaction for him. (reply to 127042)

G: I'm looking for enough test tons to run a test validator, is this the only option? (reply to 127041)

Tom: Sound like GPT to me (reply to 126572)

Imran: We cannot send external messages or install plugins without using the secret key, as there is no way to sign an external message directly from the user's wallet. I believe this is a missing feature in TON. Why doesn’t TON support signing external messages from the user’s wallet without requiring the secret key? Will TON add this type of feature in the future? (reply to 127044)

/B4ckSl4sh\: It would be a security disaster to share your private key with all dapps you connect your wallet to (reply to 127048)

&rey: Well one can send external message without any keys of course. They will simply not be accepted. (reply to 127048)

/B4ckSl4sh\: And installing plugins is also prohibited due to security reasons (except 1 subscription plugin that comes with walletv4r2 on github) (reply to 127048)

&rey: The signing is by definition act of proving message sender possesses an appropriate secret key, and is impossible to do without one. (reply to 127048)

Imran: If a signed message from the user's wallet cannot install a subscription plugin, how can this scenario be handled? For example, in a subscription-based web app, users need to subscribe to access the service. How can a subscription plugin be installed from the web app? Asking users for their secret key is not an option—they would never agree to it. Why is there no way to install a subscription plugin in Wallet V4R2 without requiring the secret key? How can I enable users to install a subscription plugin in their Wallet V4R2 without asking for their secret key? (reply to 127051)

Imran: Cool, I want to install official subscription plugin using @tonconnect/ui-react. (reply to 127054)

Imran: By the way, you can share an example in any programming language that installs an official subscription plugin without explicitly requiring the secret key. The example should sign the message using the user's wallet. (reply to 127061)

/B4ckSl4sh\: I think that example should probably be somewhere in tonconnect examples (reply to 127065)

Imran: I couldn't find any guide online on how to install the official subscription plugin using a user wallet-signed message.

Imran: https://github.com/toncenter/tonweb/blob/76dfd0701714c0a316aee503c2962840acaf74ef/src/contract/wallet/WalletContractV4R2.js#L75

Imran: Above example is installing official subscription plugin using secret key

Imran: But not found how to install plugin using user wallet signed message

Imran: I tried to install official subscription plugin using this code but not working. (reply to 127022)

Imran: Hi @pcrafter , could you please share your thoughts on how to handle the example case? (reply to 127053)

Guzus: is testnet not working rn?

Guzus: can't see my wallet balance in tonkeeper

Mahdi: Hi everyone Do you know any prediction market on TON? like Polymarket

Ziom👽: So  I wanna learn tact language so is there any yt channel or someone who can teach me coz I ain't getting alot out frm books

Roman: Hi everyone. I’m developing a dApp and sending tx using ton connect ui. I updated my tonkeeper mobile app recently, and one of the transactions stopped working, the request is getting ignored by tonkeeper. Other transactions in this dApp are unaffected.  I want to find out what exactly is wrong with failing request on tonkeeper. Is there any tooling i can utilize to debug tonconnect?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: is that receiver contract needs to confirm sender address? I mean do you have any if sender = someAddress? (reply to 127087)

Roman: No, this particular call is for unrestricted method of the contract

Roman: This is how i call for the transaction

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I think that can happen if you are on testnet because of tonkeeper testnet addresses, or mainnet because of wallet version. if you are sure about sender address you should debug your contract code locally. the common mistake is tx doesn't have enough coins (reply to 127092)

Roman: Hm, i would rather start from debugging connection itself, coz i know for sure that this part of a dApp didn’t change and was working properly. When a contract call fails i can see a popup on tonkeeper, like “simulation failed” or i can send a transaction. This time i’m getting nothing. My web part sends the request, and tonkeeper seems to be receiving it, but then totally ignoring

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: are you sure that 0.01 ton is enough for reserve0 + reserve1 + gas + maybeContractFee? (reply to 127098)

&rey: Not possible. (reply to 127055)

&rey: Wallet apps DISable that explicitly. (reply to 127053)

&rey: Wallets assume they never need to subscribe.  actually, if you'd be refused a mnemonic (even frontend-only), you'd also be refused a plugin installation. (reply to 127053)

Imran: If installing a plugin requires a mnemonic, what is the practical use case for the plugin feature in Wallet v4r2? Why did TON add the subscription plugin feature in the first place? If a user’s wallet cannot install the subscription plugin (simple-subscription-plugin.fc) by signing a message, then it seems ineffective or even pointless.  https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/simple-subscription-plugin.fc

&rey: Did TON? It required no blockchain changes. The plugins feature seems to be more about power users who can install them themselves. Though, the choice of architecture was lacking a bit too. (reply to 127123)

Imran: Thanks for the clarification! I see now that the plugin feature is aimed at power users, but the architecture could have been more user-friendly for broader use cases.

Dev: Is Ton Testnet not working at the moment? i can't access it.

Mehran: Hello everyone,  Which one is cheaper (in gas fee):  1) saving a record containing struct in a map   2) Sending a message to another contract to retrieve data  I'm writing a contract in TACT, wondering which is a better approach

Minimal ☄️: I have API key but am also getting only that message, without any details? (reply to 96997)

— 2024-12-02 —

Gene: Hello, Start the script but get an error ./install.sh -m validator -t -d -c https://ton.org/testnet-global.config.json When running the testnet node, it fails to start. How should I solve this error? [ 0][t24][2024-12-02 03:04:46.366036169][manager-init.cpp:358][!starter]  Check `state_->get_block_id() == opts_->init_block_id() || state_->ancestor_is_valid(opts_->init_block_id()) || state_->get_block_id().seqno() < opts_->get_last_fork_masterchain_seqno()` failed [pid 865685] [time 1733108686] Signal: 6

Joker: Hello! Anyone know how to detect address type, e.g. nft, nft-collection, just wallet, jetton master contract?

&rey: Probably depends on map size. For <128 entries, the first option is certainly cheaper. Afterwards, presumably too. (reply to 127154)

WhyesCode: Are you building an nft marketplace? (reply to 127174)

Joker: i already figured this out (reply to 127174)

Joker: yes (reply to 127180)

WhyesCode: Good to hear that (reply to 127182)

Heydar: Can I contribute without stake in testnet? and also my PC is not strong too, I just want to debug somethings.

Naveen: Why don't I see buy option for usdt in wallet? Is it removed?? , I used to buy directly from wallet itself, now only p2p is available 🤔

Ar: Is it ok when TONKeeper address is changed after the day?

Ar: Ok forget about it

User<7062442470>: Can a token on a blum mempad turn out to be a scam?

Gift: yes (reply to 127193)

sangmin: Is there a way to get a storage fee on my address in advance?

Joe: Is there any way to derive shard from contract address?

Minimal ☄️: Guys,  Is it expected for toncenter to return only 'Request failed with status 500' when highload wallet rejects external message because of invalid queryID? Because if they are always returning only that message without any details, it would be really hard to find the issue when something fails.  This is done in testnet, in case it's known that they haven't made those responses descriptive in testnet.

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 17  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Ar: when the contarct is deployed using WALLET_MNEMONIC the unknown sender address is taken. In fact that's normal, tehre can be multiple keypair under single MNEMONIC so I guess it takes one without actually identifying which one I want to use, yes or not? How to make it work correctly?

Ar: Also I see nothing in my TonKeeper Wallet for approving the call from blueprint project, it is connected by I receive no GUI calls of TX to approve

Jake: What is the issue. Just not approving

Jake: Link issue i think (reply to 127224)

Ar: The problem is I dont get the transaction approval call in TonKeeper

Jake: Send me it (reply to 127229)

Jake: The msg

Ar: @Dogebossthe3rd (reply to 127228)

DOT: Anyone here to setup adsgram on my TMA?   React Python flask

Lirâ: why my own token show like a pTON-pTON-ROJ LP LP name on wallet ?

recovery: bro,,  I want to understand why the exception occurs

&rey: Well it shouldn't, unless you deployed jetton master incorrectly? (reply to 127275)

Musharraf: How did you integrate Python and Toncoin, I mean what kind of library did you use? Can you send any documentation explaining this? I want to automatize creating ton wallets. (reply to 127292)

Valentin: If I wanted to detect if a Jetton contract has a buy or sell tax, is it doable via transaction simulation or is it better to plug an AI inspector to the verified code? Thoughts?

fade: lol why is AI even an option here, it's not black magic, just use simulation (reply to 127301)

Valentin: yeah good point, i've done some tests and chatgpt finds the buy and sell tax pretty well that's why i'm considering it   if I were to do it with simulation, you would:  1- Find a holder of this jetton 2- Simulate a transfer to this holder to an arbitrary address  ? (reply to 127303)

fade: its possible to simulate someone else's wallet by disable signature checking, but its vulnerable to honeypot which the jetton's admin or 'special' wallets are allowed to sell

fade: some tax contract uses a dynamically defined tax value in its storage, and some is not verified (close source), AI is useless in such cases

fade: and not all tax jetton takes tax when transferring, some takes tax for swaps only, so you'll need to simulate a complete swap transaction

Valentin: could you point me to some docs or sth so I can try get around this? (reply to 127306)

fade: there's no docs, i had to figure it out on my own

Valentin: would you be open to share a code snippet then?

fade: i dont think so, sorry

Valentin: lol ok

WhyesCode: I don't think anyone has done this before (reply to 127295)

Joy: Lol 🤣, try scraping it's fun (reply to 127315)

Valentin: anyone else knows how to simulate a jetton transfer?

WhyesCode: Of course I do scrap but not videos. How is that even possible. (reply to 127316)

fjila: Hey how do I top up lib cells

Sojib: How ton drainer script is actually work? How drainer script is secretly transferring ton and jettons aftet sign a transaction? Why Ton security can’t prevent it? What is the weakness?

Stelios: Hello everyone, I’m working with the TON blockchain and encountered a situation where I need to convert different transaction IDs to the same one. Is there any solution or method within the TON network that could help achieve this? Any insights or suggestions would be greatly appreciated! Thanks in advance

KYΛMI: I sent usdt on ton network to an address from my bybit 2days ago Unfortunately for me, I don't know how that address got to my address book and I sent it there  I know I did not add the address there manually myself  9e313be0dec02306694ed58dd65fbbcb87bae17f0661ddd8d9cdf2437129fe7c  I will appreciate a response thanks

Stelios: Basically I have this issue here (reply to 56798)

KYΛMI: i am seeing ton of transaction under the txnd, i dont know why

Fahad: This Id don't looks like TON address (reply to 127344)

— 2024-12-03 —

Stelios: Yes please, go ahead (reply to 127360)

Imran: How to transfer wallet Jetton Tokens using Tonconnect? I.e how to transfer USDT using Tonconnect?

KYΛMI: That's the transaction hash (reply to 127361)

Tom: Any methods to debug the “remaining message value”? Mode 64 is causing exit code 37, i have to use mode 128 with raw reserve

KYΛMI: UQABlbgTwNXZds4fnfdDnQ9GG-vUrebORaA4hbRmleZP5M3e This is the address (reply to 127361)

kira: morning everyone i write a contract for owner to withdraw USDT in Tact like below  receive(msg: WithdrawUSDT){         self.requireOwner();         require(msg.amount > 0, "Invalid amount");         require(myBalance() > MinTonForStorage, "Contract's balance is smaller than 0.1 TON");         send(SendParameters{                 to: self.myJettonWalletAddress,                 value: JettonTransferGas,                 body: JettonTransfer{                     queryId: now(),                     amount: msg.amount,                     destination: sender(),                     responseDestination: sender(),                     customPayload: null,                     forwardTonAmount: 1,                     forwardPayload: rawSlice("F")                 }.toCell()             }         );     } but when i run the function to withdraw import { Address, toNano } from '@ton/core'; import { NetworkProvider } from '@ton/blueprint'; import { PawsPurchase } from '../wrappers/PawsPurchase'; import { CONTRACT_ADDRESS } from '../constant';  export async function run(provider: NetworkProvider) {     const pawsPurchase = provider.open(PawsPurchase.fromAddress(Address.parse(CONTRACT_ADDRESS)));      await pawsPurchase.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'WithdrawUSDT',             amount: toNano("0.001"),         },     ); } i got the exitcode 49 when jettonWallet of contract want to "Jetton Internal Transfer" to jettonWallet of owner For ex: https://tonviewer.com/transaction/54367d797b41dcdc49ce879f2b72299d033cc8eaf6949b00ab731e8dabd259b9 could you help me explain why i got that exit code and fault? 🥺

&rey: Just send some money to their hosting contracts. (reply to 127324)

&rey: That's pretty advanced business logic, and no one wished to share it to public yet. Because, why would they? (reply to 127309)

&rey: I'd assume that's because of comments in code, and that ChatGPT would give results worse than chance when given TVM assembly. (reply to 127305)

&rey: const error::invalid_message = 49; Tact's serialization of forward payload isn't exactly matching TEP-74, you need to add one zero bit in front of actual payload to indicate it isn't in reference. (reply to 127400)

kira: forwardPayload: rawSlice("F") you means above line of code should be modified into  forwardPayload: rawSlice("0F") am i right? (reply to 127421)

&rey: Not quite, because you need to add one bit, not 4 bits. (reply to 127423)

kira: ohh, so it's just  forwardPayload: rawSlice("0")

&rey: What do you want the forward payload to be, actually? (reply to 127425)

kira: actually i don't need the payload

kira: i just see the code in Tact documentation, and code along

&rey: rawSlice("4_") or rawSlice("0") will work fine. (reply to 127428)

kira: ohhhh, it works 😁😁😁

Ar: Hi guys, how do I look at the funC compiler version defined in blueprint (reply to 127432)

Akachi: USDT is Jetton, but provided stability by Tether with the highest volume among other stable coins including USDC. Tether extends its border with new introduction of Hadron also. (reply to 126719)

Ar: Ok some additional info great, but anyways TON technically speaking address differs from the the ones of other jettons exsiting in a single account (reply to 127443)

Ar: yes or no?

Akachi: Re-entrance attack is possible in the TON also? TON doesn't hold the balance in the SC, and manage it by jetton  master SC and Wallet SC, I want to know how possible to attack and what is the resolution? (reply to 126441)

Akachi: Yes, I just want to mention that USDT launch on TON is different from other normal jetton launch on TON. :) (reply to 127444)

Richard: We are a developing a project using Jettons tokens on the TON blockchain. A vast amount of the transactions will be small amounts but the cost of small transactions with Jettons on TON is quite high as it seems to be a standard amount for all sizes of transactions rather than scaled based on the size of the transaction. Does anyone know how we can get around this high Gas fees on Jettons. What we are creating could become a huge project bringing in a lot of people into the TON network but a lot of it depends on these fees.

Павел: Hi, guys! In our app user can earn different tokens and withdraw them. Is it any mechanics in Ton that allows us to send tokens from our wallet to user wallet, but to have the commission paid by the user (recipient)?

Павел: Is it real?

pid | ton: what does it mean (reply to 127448)

Павел: May be I can pay fees in token that I send using gasless transactions? (reply to 127455)

User<7483165626>: Active (reply to 127459)

Makos: why doesn't TON go to my testnet wallet? I'm getting tones in the bot @testgiver_ton_bot

Jack: hi,there, can anyone give me a jetton transfer fc contract demo code？

Ush: Did you switch your wallet to testnet? (reply to 127475)

Makos: yes( (reply to 127478)

Ush: I don't see it in tonkeeper. But in tonhub wallet I see my test ton coins. Maybe try it?

Diana: Hi there, we have been developing a large crypto project to allow users managing and manipulating their  custom stable assets.   Now we need developers with experience in solana etherium alchemy fireblocks to create smart contracts and develop other block chain related  functionality. If anybody is interested in this full time opportunity, welcome

Makos: dev menu does not open in tinkeeper chrome extension)))) thanks for the tip, I will try tonhub (reply to 127480)

Ush: True (reply to 127483)

Makos: Is the dev menu activated the same way in tonhub? (reply to 127484)

Ush: Yeap. Just multiple touch on app version number

Makos: they have no extension for browsers( (reply to 127486)

pid | ton: maybe your TON goes into another version of your wallet, maybe wallet v4 (reply to 127475)

pid | ton: tonhub doesn't seem to make v5 wallet the default whereas tonkeeper does. (reply to 127480)

Ush: Do you need v5 to dev something on testnet?😄 (reply to 127500)

pid | ton: dev tonkeeper does it (reply to 127505)

Ush: I know. I mean only that you may need it only in specific tasks (reply to 127506)

&rey: Are those tokens made by you? That is, can custom code be used? (reply to 127455)

&rey: Well, native-TON fees are not scaled either. That ensures fairness and uniform handling of any amount and any assets, at least.  Jettons are not native to TON, the blockchain doesn't see "field in one contract's storage should decrease, same field in another contract increases" but rather "there's a chain of transactions doing certain computation". (reply to 127450)

&rey: The correct statement would be, "it is possible to write smc code incorrectly so it fails on a specific message order, in a way similar to reentrancy attack in other blockchains". You have to learn asynchronous programming to work with this topic productively, or just enumerate all permutations of incoming messages in brute-force manner; specific cases are often highlighted in chat history. (reply to 127447)

Valentin: well in any blockchain simulating a txn is not advanced logic, it should be something obvious (reply to 127419)

&rey: Well in TON you need to simulate transactions tree considering that anyone can intervene sending a parallel message that could, for instance, say to honeypot jetton wallet "for next 20 sec, any transferred jettons are burned instead". (reply to 127514)

Valentin: that's a pretty corner case, right now I just want to test without any other parallel intervention

&rey: @ton/sandbox with RemoteBlockchainStorage does that. (reply to 127516)

Valentin: ok, i'll look into it thanks

fade: The tvm emulator and its code is available here, but no one will tell you exactly how to parse the tx tree and calculate the tax percentage. AFAIK currently, there are only two parties in TON ecosystem capable of doing this. (reply to 127514)

fade: A useful resource: https://github.com/tonkeeper/tongo/blob/master/txemulator/txemulator.go

Valentin: so the difficult part of this is parsing the state of the txn after the transaction has been simulated, e.g to check the resulting balances?

Valentin: maybe another way to look at this is looking at historical txns for that jetton

fade: All you get from the emulator is a tree of transactions, and the states of contracts after the simulation.

&rey: Well actually you can simply invoke await wallet.getBalance() and await jw.getBalance(). (reply to 127522)

fade: Probably the easier way without parsing the tx tree is to run get_expected_outputs and compare the wallet's balance after simulating the swap

Valentin: interesting, I see that they recommend creating an interface of the contract class, but surprised that there's no jetton classes already built (reply to 127517)

Павел: No. They're just on my wallet. What do you mean by "custom code"? (reply to 127509)

&rey: Jettons are special constructs over TON blockchain. They are implemented with code. Code from minter.ton.org can be used, or some custom one. (reply to 127534)

𝟮𝟱:𝟮𝟱: hey friends, I have this issues on my mini app console log. what should i do ?  Access to resource at 'https://ton-bridge.tobiwallet.app/bridge/events?client_id=196ab28bc087ffbc0d9790a540ab1ad740bc5f9ec383e2c0f08a939125101a56' from origin 'https://toncoingame.site' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

&rey: That's quite common issue arising for many TON Connect 2 options, actually. It is possible that wallet's bridge is down or banned by your provider. I've never met that issue when using TC2 SDK instead of UI. (reply to 127591)

𝟮𝟱:𝟮𝟱: So should I use SDK instead of UI ? (reply to 127592)

Kiba: You can safely ignore this CORS error in the console log — it doesn't affect your dApp's functionality. I'll pass this issue to the wallet's development team and they'll fix it on their end. (reply to 127591)

𝟮𝟱:𝟮𝟱: So it can not effect on transactions and balance process ? (reply to 127600)

𝟮𝟱:𝟮𝟱: Also I have a 403 error   GET https://ton-bridge.tobiwallet.app/bridge/events?client_id=9808c3b545605f4e3c1552cfc653b873a021142f4e82f587205b5112b3915645 403 (Forbidden)  what about this issue ? Is it matter ? (reply to 127600)

Kiba: No worries, transactions and balance operations will work fine. The error only affects Tobi Wallet, which currently isn't working for anyone due to this issue. All other wallets will continue to function normally. (reply to 127602)

ᴀʀᴛᴀ: Hey guys

ᴀʀᴛᴀ: Do u have a idea how can i report scam bot?

ᴀʀᴛᴀ: That took all my money

&rey: Well if you already reported those to Telegram that's pretty much all you could do. (reply to 127626)

&rey: No way to do so because transactions are irreversible and indistinguishable from legitimately wanted. (reply to 127630)

ᴀʀᴛᴀ: But it can't be😿 I don't have anything left😓 (reply to 127639)

Heydar: Can I contribute without stake in testnet? and also my PC is not strong too, I just want to debug somethings. (reply to 127185)

— 2024-12-04 —

Jiten: Generally how much time it takes to update the MAU Count ? My MAU count is not getting updated after getting 100K+ users also (reply to 122241)

Shivam maurya: Hello everyone, I’m working on a multisender contract to transfer Jetton tokens. However, I’m facing an issue where the tokens are not being transferred, and I’m not encountering any errors during execution.  Could someone please guide me on what might be causing this issue or suggest ways to debug it?

Shivam maurya: import "@stdlib/deploy"; import "@stdlib/ownable";  message MultiSendJetton {     length: Int;                           sender_jetton_wallet: Address;         token_user_list: map<Int, Address>;      token_sending_value: map<Int, Int>;  }  message TokenTransfer {     queryId: Int as uint64;     amount: Int as coins;                  destination: Address;                  response_destination: Address;         custom_payload: Cell?;     forward_ton_amount: Int as coins;      forward_payload: Slice as remaining; }  // Contract for batch transferring Jetton tokens contract JettonMultiSender with Deployable {     const minTonsForStorage: Int = ton("0.03");      const gasConsumption: Int = ton("0.03");        init() { }      receive(msg: MultiSendJetton) {         let ctx: Context = context();                       let msgValue: Int = ctx.value;                     let senderWallet: Address = ctx.sender;              let value_default: Int = 0;         let sendingValue: Int = 0;          do {             let receiver: Address? = msg.token_user_list.get(value_default);               let token_send_amount: Int? = msg.token_sending_value.get(value_default);             sendingValue = sendingValue + token_send_amount!!;                            // Send tokens using the TokenTransfer message             send(SendParameters{                 to: msg.sender_jetton_wallet,                 value: ton("0.1"),                   mode: SendIgnoreErrors,                 bounce: false,                      body: TokenTransfer {                     queryId: value_default,                     amount: token_send_amount!!,                     destination: receiver!!,                     response_destination: ctx.sender,                     custom_payload: null,                     forward_ton_amount: ton("0.05"),                     forward_payload: emptySlice()                 }.toCell()             });              value_default = value_default + 1;         } until (value_default >= msg.length);          // Send back the remaining value to the sender         self.completed(ctx.sender, msgValue - sendingValue);     }      //  function to complete the transaction and send back any remaining value     fun completed(to_address: Address, value: Int) {         send(SendParameters{             to: to_address,             value: value,  // Return remaining value             mode: SendIgnoreErrors,             bounce: false,             body: "Batch Completed".asComment()         });     }      // Fallback receive method to handle unexpected messages     receive() {         let ctx: Context = context();         send(SendParameters{             to: ctx.sender,             value: 0,             mode: SendIgnoreErrors,             bounce: false         });     } }

Shivam maurya: Hello everyone, I’m working on a multisender contract to transfer Jetton tokens. However, I’m facing an issue where the tokens are not being transferred, and I’m not encountering any errors during execution.  Could someone please guide me on what might be causing this issue or suggest ways to debug it?

B: Hi all! Please tell me how can I remove scrolling in TMA? I wrote the application in view, but there is a scroll on all pages. I can scroll with my finger so that all the content goes up beyond the visible boundaries

B: for the root component? (reply to 127743)

B: app component right?

Shivam maurya: I replace it still getting same error (reply to 127731)

Shivam maurya: . (reply to 127755)

Shivam maurya: Yes, but token is not transferred

Bythos: I have installed thro mytonctrl2, but didnt get anything from 8000, could you please help? (reply to 42006)

Pavel: const client = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' }); // const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });  export async function run(provider: NetworkProvider) {      if (!mnemonic) { return}     const keyPair = await mnemonicToPrivateKey(mnemonic.split(' '))     const workchain = 0;     const walletV5 =  WalletContractV5R1.create({         workchain,         publicKey: keyPair.publicKey,     });      const otherExtension = Address.parse('EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y')     const contractProvider: ContractProvider = client.provider(walletV5.address);      let seqno = await walletV5.getSeqno(contractProvider)      console.log(await walletV5.getExtensionsArray(contractProvider))     await walletV5.sendAddExtension(contractProvider, {         extensionAddress: Address.parse("EQBPQOH2srRyNSVPOf4EJxII8rovKJfi290HoG_xldqkNFHm"),         seqno,         authType: 'external',         secretKey: keyPair.secretKey,     }) } (reply to 123683)

TON Bounty Bridge: ​Tact Doc infrastructure integration and preparation  🏷 Developer Tool  Summary:The Translation Program is a collaborative effort to translate various documents related to Tact int...  Rewards: • 5000 USD in TON and SBT  Created by TonSquare

TON Bounty Bridge: ​TMA Doc infrastructure integration and preparation  🏷 Developer Tool  Summary:The Translation Program is a collaborative effort to translate various documents related to TMA into...  Rewards: • 4000 USD in TON and SBT  Created by TonSquare

Minimal ☄️: Is it expected for toncenter to return only 'Request failed with status 500' when highload wallet rejects external message because of invalid queryID? Because if they are always returning only that message without any details, it would be really hard to find the issue when something fails.  This is done in testnet, in case it's known that they haven't made those responses descriptive in testnet.  I am using jsonRPC

&rey: Use direct request to endpoint instead. (reply to 127794)

0xCrusader: Hey guys, mb anyone knows why I see this error on connecting to ton space? Works fine with tonkeeper and other wallets.  {"url":"https://walletbot.me/tonconnect-proxy/https://app.trade/manifest.json","status":404,"headers":{"access-control-allow-origin":"*","alt-svc":"h3=\":443\"; ma=86400","cf-cache-status":"DYNAMIC","cf-ray":"8ecd6d137e729918-ARN","date":"Wed, 04 Dec 2024 17:13:16 GMT","priority":"u=3,i","server":"cloudflare","server-timing":"cfExtPri"},"response":"Not found because of proxy error: Error: unable to verify the first certificate"}

.none: Hello everyone I use streaming api via pytonapi in order to catch all transactions (I use the top api key) that come to the wallet. I ran into a problem: api streaming does not notify about all transactions. Is there any way to fix this? Maybe there are other ways to listen to the wallet (apart from constantly receiving a list of transactions of everyone on the wallet - this is the only thing that comes to my mind).

&rey: Maybe it comes to mind because it is the correct solution? (reply to 127844)

Konstantin: Hello, everyone. Is anybody deployed cSBT nft? https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/collection_exotic_sbt.fc

— 2024-12-05 —

Anton: That diagram is not correct. Tact is production-ready with a security audit by a top firm (report will be available later), strong team of compiler engineers assembled together, actual projects in production, good tooling support, excellent documentation, and recognized by GitHub. It is one of the officially recommended languages by docs.ton.org. Tact not only supports high-level features like generation of serialization and deserialization routines for messages and contract state, but it also allows you to write low-level asm-functions. If you know what you are doing you can even be almost as gas-efficient as FunC and get upgradable contracts, but both of these will be much easier with the next few upcoming releases (reply to 127916)

Andrew: Yes, this is my personal understanding, and Tact is also evolving and improving (reply to 127922)

Anton: Is it an informed understanding, though? (reply to 127923)

Anton: I’m the Tact compiler lead, so that should give you an idea

Anton: That kind of diagram should be based on research so it does not spread misinformation

Andrew: ok, let me add more details and publish a new one

Leo: AFAIK it's impossible to make granular control with Tact like what FunC can do, at least currently. Btw you declare that one can write TVM assembly and upgradable contracts with Tact but the official documentation seems not agree with that; is this still under development? (reply to 127922)

Anton: The docs are lagging behind on this. Will be merged next week (reply to 127930)

Anton: You are right about total granular control at least for the current release and most likely the next one. You have some granular control

william: DM me, I can help you (reply to 127721)

william: sure (reply to 127721)

WhyesCode: Try using WebSockets for real-time updates and check your API key permissions. (reply to 127844)

Tea the Bottle: hello, I'm trying to write a Faucet contract that let user deposit TON and received my Jetton and latter NFT, but Im stuck on this scene:

Tea the Bottle: how can I display user received NFT on wallet transaction confirm page ?

&rey: You do not mess with display. Smarter wallets emulate transactions tree and show everything as it is. (reply to 127943)

Tea the Bottle: I just dont know how to show transaction scene that: user send X Ton and will received Y return Jetton

Tea the Bottle: Im working on a faucet let user BUY Jetton and NFT from master contract

&rey: Whenever your contract sends jettons in return, that will be displayed automatically.

Tea the Bottle: thanks

Tea the Bottle: Im trying to understand how a transaction call a contract's reciver message

Tea the Bottle: is it to create transaction with messenge ?

Tea the Bottle: example I have receiver message 'hello'

Tea the Bottle: I just create mess on transaction :  .storeStringTail("hello")

sulaiman: Yes (reply to 127958)

&rey: .storeUint(0, 32).storeStringTail("hello"), actually. (reply to 127957)

Tea the Bottle: in this code, it meanmy contract will cover gas, right ?

Tea the Bottle: send(SendParameters{

Tea the Bottle: to: sender(),  bounce: true,value: myBalance() - context().value - self.MinTonForStorage,mode: SendRemainingValue + SendIgnoreErrors

&rey: You should write down what contract had, how much it receives, and how much do you want to keep on its balance.

Tea the Bottle: hello, if I create complicated mess like this: message MultiMath {add: Int as uint32;subtract: Int as uint32;multiply: Int as uint32;} (reply to 127961)

Tea the Bottle: how should frontend call this mes ?

𝟮𝟱:𝟮𝟱: I have this issues in my logs  [TRANSACTION_LOG] Objecterror: "Request failed with status code 404"message: "Failed to retrieve wallet balances"state: "Transaction Error"timestamp: "2024-12-05T10:43:48.472Z"  [[Prototype]]: Object script.js:49 [TRANSACTION_LOG] Objectbalances: {ton: 0, notcoin: 0, dogs: 0}state: "Checking Wallet Balance"timestamp: "2024-12-05T10:43:48.473Z"  [[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ defineGetter__()__defineSetter: ƒ defineSetter__()__lookupGetter: ƒ lookupGetter__()__lookupSetter: ƒ lookupSetter__()__proto: (...)get proto: ƒ proto__()set __proto: ƒ __proto__() /api/transaction/prepare:1                    Failed to load resource: the server responded with a status of 405 (Not Allowed)Understand this errorAI script.js:49 [TRANSACTION_LOG]   whats the proglem ? anyone knows ?

&rey: Then you also have an autogenerated Tact wrapper. (reply to 127982)

发财哥: hello  How should this error be resolved?

&rey: First, you should try doing request directly to sendBoc[ReturnHash] instead of jsonRPC. (reply to 128007)

发财哥: thanks (reply to 128008)

Tom: Any suggestion for public rpc rather than toncenter? Ton access is really unstable

发财哥: How do I get the walletId of my wallet?

Zmey: using Node.js or python? (reply to 128014)

发财哥: Thanks, it's been solved (reply to 128038)

Zmey: you are welcome. (reply to 128044)

Minimal ☄️: Thanks, that seems as a solution but I have an issue, I am unable to find out how to 'intercept' BoC before sending it via provider.external in order to send it to sendBoc directly, do you have any suggestions?  This operation is happening inside of the HighLoadWalletV3 wrapper (reply to 127795)

&rey: Well if you're only testing you can just send BOC second time from console, not intercepting it. (reply to 128046)

Minimal ☄️: That's what I am trying to do, but I am not able to get the BoC from this code (reply to 128047)

Minimal ☄️: I don't know if I need this messageInner or this cell that is being awaited (which has mesageInner in it)

Minimal ☄️: I think it's neither of those, this is what I get when I console log those two: x{000010AD0100005A00000000CEA3C632007084_}  x{62002CFC71EDA9459191C3C13DAE73F7C0B579FC0F2BF35B9E7EF51D0006CB8808591CC4B40000000000000000000000000000AE42E5A4000000000000002D}   x{0EC3C86D01}    x{0EC3C86D01}     x{0EC3C86D01}      x{}      x{620012A731A3757E5840E3DF09D779CCB19C8B46A63EB65C344E80A572E236DEED07202FAF080000000000000000000000000000} ...

&rey: "Network" panel, you can see your [signed] request there, as well as response from Toncenter. (reply to 128048)

Minimal ☄️: I am not sure we understand each other, I'll try to be more detailed,  I am doing all of this (calling exact endpoint, sendBoc) because jsonRPC is not retuning a reason for status 500,  This code that I have copied is from the highload wrapper, which I have used in my microservise for TON distribution,  I don't understand which 'Network panel' can I access in this case? Same goes for toncenter, I only receive 'Request failed with status code 500' error from them (reply to 128052)

Kushagra: Hi everyone, i want to deploy mintless NFTs, can someone help me with any docs or tutorial?

&rey: Well if you can patch you should go up the hierarchy to provider.external until the point where API call is made, and log its JSON response before any parsing. (reply to 128048)

FBM: What chain do you want? (reply to 128062)

FBM: I can help you. I have experience with developing the NFT marketplace We can discuss about that in DM or here (reply to 128062)

Minimal ☄️: Hm, I think I am closer to understanding but still need a little bit, I am not sure if you are telling me that I should follow into provider.external to get to the API call or if I should go back through the methods that are leading to the provider.external (I don't see any API calls there, since I am giving TonClient to provider.external through sendBatch and all the methods in between  provider.external is actually a method: external(message: Cell): Promise<void> of ContactProvider interface,  did you suggest to me to find the implemented external method and the API call inside of it? (reply to 128062)

&rey: Into. (reply to 128068)

Luke: Hi guys, I am searching for tutorials on how to use TonConnectUI to generate a transaction hash before sending that transaction to the blockchain, or an external-in message hash. Any help would be much appreciated, thanks!

Tim: You can’t know hash before tx was executed on chain (reply to 128071)

Luke: How about external in message? It seems that we can build one and get its hash, but I can only find an example using keypair. I am dealing with a React task therefore I can't get a keypair. (reply to 128072)

Tim: Tonconnect returns inmsg

Luke: It is possible to get that only after sending the transaction, but I need to get it before sending :(

&rey: Once again, the only thing that can generate latter hash is blockchain; you cannot calculate it in advance. (Yet?) (reply to 128086)

Luke: with the BOC returned by await sendTransaction(....) we still cannot get the transaction hash from it?

Luke: Alright, many thanks man. Hope that TON foundation will improve this soon.

Ishnoor: const { boc } = await sendTransaction(....) const hash = bocToHash(boc)  using the above hash I am able to find tx in tonviewer its just that its diff  function bocToHash(boc: string) {    return Cell.fromBoc(Buffer.from(boc, 'base64'))[0].hash(0).toString('hex'); }

&rey: Usually such things occur by-design (just as EVM has its own complications leading to new methods added) with no intention of change. However, in this case, you may even be right about improvement. (reply to 128089)

Angel: Hi, @pcrafter. Can I send my tokens to multiple users at one time?

Angel: if yes, how to do it?

Luke: check this out, it might help you https://docs.ton.org/v3/guidelines/ton-connect/guidelines/preparing-messages#jetton-transfer (reply to 128093)

Олег: Hey people! Does anyone here know how can I get the jetton balance of smart contract in the smart contract itself. Basically I need to make a withdrawal function for jetton.

&rey: Not possible. However, there's a certain way to transfer all jettons... it is too expensive for common use but can be implemented. (reply to 128102)

Олег: How can I do this?

&rey: Send 120 jetton transfer orders, ranging from 2^119 to 2^0, in decreasing order. (To optimize costs, ensure forward amount is set to zero.)  There's a mathematical proof that it will transfer all jettons, if you need that? (reply to 128124)

Олег: Oh, I don’t think that’s necessary. I’ll just check the balance off chain

Олег: But thanks a lot anyway

Angel: Hi, sir, can you help me to transfer my jetton to multiple users at one time? (reply to 128125)

Angel: Do I need to build smart contract for it?

Angel: or use normal transactions several times?

&rey: I don't help with scripts for sending unwanted transfers. (reply to 128128)

دی دی پرایم: . (reply to 127016)

&: You can use High load wallet. Deploy it, send token to there, and distribute in one tx (reply to 128128)

— 2024-12-06 —

Tom: Try tonsend.io (reply to 128128)

Angel: Thanks (reply to 128136)

Angel: ok, nice thanks (reply to 128140)

Tiqan: Is it possible to convert logical/lamport time to unix somehow?

Tea the Bottle: can you give more detail ? I understand that I can have commend in my transaction to  Jetton master contract, but I can find no other way to create mes with other format (reply to 127994)

glozziy tobaby: Good day everyone

glozziy tobaby: Latest gist?

T: Hello. Does anyone know if Memelandia is protected IP or if we are allowed to build stories on top of it? I thought of a cool way to include it in the game I am building.

Alex: 📣 Hey, folks! The Tact dev team kindly asks you to share some feedback regarding your experience with smart-contract programming in Tact.  Our mission is to develop a high quality programming language that can be used for every single project on TON and make code easy to write, understand and audit.  The survey covers 4 topics and will only take about 5-8 minutes of your time.   Thank you for your contribution!  👉https://paperform.co/edit/h02jnxtq (forwarded from TON Dev News)

TON Bounty Bridge: ​Unified Grant Progress Tracking Platform  🏷 Developer Tool  Summary:To fund the design and development of a TON-focused responsive web app that tracks all funded grants...  Created by emmanueleclipse

Tea the Bottle: hello, Im using howard's Jetton template, I can send mint mess to master address and received return token, but on confirm scene of wallet, there is no offer back user will received Y Jetton line. How can I display this ?

User<7460221582>: hi nice to meet u i am a blockchain developer and i am interested in the position i have xp in rust and solidity and have some xp in alchemy and fireblocks could u please give me an opportunity to work in a team? (reply to 127482)

User<7460221582>: hi nice to meet u i am a frontend and blockchain developer. before i have worked in web3 industry, i have worked as a frontend developer for various web2 project. is there any chance to work with u? (reply to 127946)

D: Hi, we are looking into integrating with TON and I have some questions:  1. is ADNL required? are there any transactions that can be done only with ADNL but not via HTTP RPC? 2. does ADNL support authentication? if I run a node with ADNL, can I configure it so that only my clients can connect?

Andrew: hi, I need upgrade my contract which is written in tact. I noticed that official documentation didn’t mention that how to upgrade it. So I just want to know how to upgrade my contract. Thanks

&rey: >>> pytoniq.Cell.one_from_boc('te6ccgEBAQEAJwAASgAAAAA1MCBUZWxlZ3JhbSBTdGFycyAKClJlZiNIM1lDT3dKdjA=') <Cell 296[0000000035302054656C656772616D205374617273200A0A52656623483359434F774A7630] -> 0 refs> >>> pytoniq.Cell.one_from_boc('te6ccgEBAQEAJwAASgAAAAA1MCBUZWxlZ3JhbSBTdGFycyAKClJlZiNIM1lDT3dKdjA=').begin_parse().skip_bits(32).load_snake_string() '50 Telegram Stars \n\nRef#H3YCOwJv0' (reply to 128176)

User<5721366642>: ty bro (reply to 128190)

&rey: [It's not like there are details on upgrading Tolk contracts either 😆] not supported IIRC; for instance, how would the added fields on contract be filled? (reply to 128184)

Anton: indeed, no native support currently, but there are some workarounds people shared here: https://github.com/tact-lang/tact/issues/27 (reply to 128184)

Andrew: thanks I will take a look. I just want to change a line code. I only learned solidity before.

Imran: Is it possible to encrypt comments in transactions when using TonConnect, given that the sender's private key is not accessible?

&rey: No. (Unless you have obtained sender's or receiver's private key by some means.) I believe you can use ton://transfer link instead, where the wallet app would have chance to offer comment encryption. (reply to 128209)

Imran: Let's say receiver's is my address. I have my account private key. I can use receiver account private key to encrypt the comment?

&rey: ECDH is symmetric... however, you generally don't have receiver's private key, that was a joke 😀 (reply to 128211)

Imran: I think in tonconnect who connect wallet is the sender. And developer can set the receiver address in tonconnect transaction.

&rey: Ah. Yes you can encrypt that comment in backend. (reply to 128216)

Imran: I’m trying to learn about this but haven’t found any helpful resources. Could you please guide me on how to achieve it?

&rey: Well you need considerable care (for instance, if receiver's private key ends up in dApp, all money will be leaked), common sense, and some programming experience. (reply to 128218)

Imran: I understand the importance of handling things securely. Right now, I'm approaching it in a naive way.

Imran: https://github.com/toncenter/ton-wallet/blob/6aaf8fdc4daf46d17db1d1e3eec407bebf73586b/src/js/util/encryption.js#L186

Imran: We can use the encryptMessageComment function from encryption.js to encrypt the comment. I used the opcode 0x2167da4b in the cell. Is the cell-building process correct?

Imran: Let me work through it. Thanks anyway!

G‘olib G‘ayratovich™: Hi

G‘olib G‘ayratovich™: I have a question

G‘olib G‘ayratovich™: How to turn on automatic payment

G‘olib G‘ayratovich™: ?

Disco: what payment do u mean ? (reply to 128240)

G‘olib G‘ayratovich™: In wallet (reply to 128242)

Disco: maybe you cannot do that on normal web3 wallets (reply to 128243)

Disco: ton keeper as well

G‘olib G‘ayratovich™: Ton wallet (reply to 128244)

G‘olib G‘ayratovich™: Yes I have it (reply to 128245)

Disco: ! (reply to 128244)

Disco: you cannot set auto

Disco: you have to have your custom wallet

G‘olib G‘ayratovich™: I have ton wallet in  tonkeeper and  telegram (reply to 128250)

Disco: so, what process do u like to have as AUTO ? (reply to 128251)

G‘olib G‘ayratovich™: What ? (reply to 128253)

Disco: what do you mean, "set auto payment" ? (reply to 128254)

Daniel(""): g'night, does anyone know a websocket for tracking user transactions?

&rey: IIRC there are no reliable websockets right now. You can use tonapi with caveat that tx delivery [to your backend] is not guaranteed. (reply to 128257)

Valentin: Hey, is there a way to obtain the owner of a given jetton wallet contract?

