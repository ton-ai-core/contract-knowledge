NuSs: hi, how can i get test tons? I tried a bot in teleram, but I could never get any ton :( (reply to 14284)

doni: is your wallet on testnet ? (reply to 14285)

Rasoul: It is strange to me that no one knows the answer (reply to 14272)

NuSs: uhmmm idk, how can I check that? I thought it was (reply to 14286)

doni: which wallet ?

doni: you can use a block explorer   try tonapi.io (reply to 14287)

Rasoul: How can I access it directly from the network itself? (reply to 14290)

doni: checkout toncenter api

Rasoul: Is a node not directly accessible? (reply to 14292)

doni: it is

doni: you need to use lite client protocol

doni: there is a good npm package for that

Rasoul: tonapi.io  Does this website work the same way? (reply to 14297)

doni: https://www.npmjs.com/package/@ton-diamonds/ton-lite-client

doni: yes eventually  when you query a full node   you query its lite server …  toncenter is an http layer over lite client api ,  lite client works over udp (reply to 14298)

NuSs: How can I add my wallet to test net?

— 2022-11-25 —

Slava: You will have to elaborate. (reply to 14304)

G.H.Xu: ImportError: cannot import name 'BitString' from 'bitstring'

G.H.Xu: When executing "toncli start simple_storage"

Andrey: pip install bitstring==3.1.9 (reply to 14310)

муха: Which api i should use, to get sold nfts for some collection?

G.H.Xu: Thanks, that works (reply to 14313)

Slava: No, both networks are now using TON coins and the testnet coins have no direct value. (reply to 14312)

Slava: I guess you can forget about that. (reply to 14317)

NuSs: Is there any documentation? (reply to 14308)

Slava: See the pinned message? (reply to 14320)

NuSs: I started by the hello world but there says that I need a wallet, I thought it was in other networks where a wallet lives in main and in test. But I think I need other previous documentation

NuSs: I think I have to start from this:  https://society.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript

Javad: how load Mnemonic with Tonweb ?

Javad: How convert hex to Account address ? (reply to 14259)

Daniil: Which hex (reply to 14326)

Javad: E4148E2538CAE1D2252952B5F724B43DAD79CE2B341BB58DB74893C133EA8798 (reply to 14327)

Daniil: I mean where did you get this hex from? What does it mean? (reply to 14328)

Javad: it's from transaction in_msg (reply to 14329)

Javad: from this site : https://dton.io/ (reply to 14329)

Daniil: Is it transaction hash? (reply to 14331)

Javad: no it's destination address hex (reply to 14332)

Javad: in_msg_dest_addr_address_hex

Javad: What should I do ? (reply to 14332)

Max: You need to know the workchain of the account (0 or -1) then you can find the account in any explorer with address format <workchain>:<hex> without the <> brackets

Andrey: This is address (reply to 14328)

Andrey: Just add workchain to it

Andrey: 0:E4148E2538CAE1D2252952B5F724B43DAD79CE2B341BB58DB74893C133EA8798 e.g.

Javad: Thanks  but in tonscan show like this   EQDkFI4lOMrh0iUpUrX3JLQ9rXnOKzQbtY23SJPBM-qHmGeh (reply to 14340)

Max: this is the "friendly" format of addresses  you can find an example of how to serialize addresses to this format here https://github.com/ton-community/ton/blob/17b7e9e6154131399d57507b0c4a178752342fd8/src/address/Address.ts#L147 (reply to 14341)

Dario Tarantini (ex Tonox): News   - Updated open-contracts with fixed version of EC math. Now it (should) work with any Elliptic Curve (even pairing friendly ones, imo). I included only secp256k1 paramters.  The main problem is that ecMul with large scalar will easly reach gas limits, making the library non-functional. A better approach could be to create a verifier contract that save the stack and send a message to himself to continue the computation, but I'm not going to implement it.   https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/elliptic-curves (forwarded from Dario Tarantini (ex Tonox))

— 2022-11-26 —

Behrang: Use tonweb-mnemonic: https://github.com/toncenter/tonweb-mnemonic (reply to 14324)

doni: ton-crypto (npm) is a good one

Rasoul: How can I receive the latest toncoin transfer? (reply to 14348)

Rasoul: I tried to recive with the following url but the result is not the last transfer https://tonapi.io/v1/blockchain/getTransactions?limit=1 (reply to 14348)

doni: send me in dm your address

Step: is it possible to validate address using tonweb without making any api request?

Daniil: Depends on what do you mean by "validate" (reply to 14360)

Step: like address format (reply to 14361)

Daniil: You can try tonweb.Address() (reply to 14363)

Step: like this? tonweb.Address(address)

Slava: try { new Address(addressString) } (reply to 14365)

Step: what is the difference in isBounceable: false|true? (reply to 14366)

Daniil: If you send coins to unbounceable address, you won't get them back in case of some error (reply to 14367)

Step: but why ton decided to have such different type of address? these exists in other network? (reply to 14368)

— 2022-11-27 —

G.H.Xu: An error appeared when I sent a message to a contract

G.H.Xu: This is the contract shown in a tutorial, I have deployed it on the testnet successfully and I am able to call a getter method

&rey: Because otherwise you would be unable to initialize new contracts at all - money would instantly bounce back. (reply to 14369)

Hartmann D.: Mami, use English please. (reply to 14376)

Danila: Hi, does someone have example contract with usage of set_code and set_c3 for upgrading?  Ideally, if you also have JS script for interactions with it. Thanks

doni: elector (reply to 14378)

User<456620184>: Hi.  Can a @shopbot becreated that accept Toncoins?

doni: https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc (reply to 14378)

User<5321317577>: To get a grant or funding, should you already have a product on hand even if it's in early development and what if you haven't started?

Abolfazl: Hi guys,  Dose anyone know the company , website , that rent , sales VPS with TonCoin ?

— 2022-11-28 —

G.H.Xu: Is TL-B neccessary for contracts?

G.H.Xu: Can it be generated automatically?

User<5126596027>: Now more often TL-B is used as a supplement to the documentation of smart contracts, written manually. To my knowledge, TL-B compiler in ton c++ monorepo can generate code based on TL-B, but I haven't seen any cases where this has been used in practice outside of ton monorepo. (reply to 14387)

Step: how to solve this error LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

Daniil: This error can appear in different situations. It often happens when you're trying to interact with a not deployed contract (reply to 14390)

Daniil: What did you do exactly?

Step: looks like private key mismatch (reply to 14392)

Step: can you tell me how to convert keyPair to seed? that i will import using tonweb.utils.keyPairFromSeed ? (reply to 14392)

Daniil: If you already have a keypair, you don't need to convert it to anything, just use it in tonweb (reply to 14394)

Step: i need to store as seed that i will use later. (reply to 14395)

Step: size of seed is smaller than secretKey so i prefer seed? 🤔 is it wrong practice ?

Step: 🥹

G.H.Xu: "Request failed with status code 429"

G.H.Xu: Why do I always get this error?

G.H.Xu: So I do not have to learn how to use TL-B for contracts development, right? (reply to 14389)

Step: api has very tight ratelimits. (reply to 14404)

Step: register in bots to get api key with increased limit i.e 10r/s   @tonapi_bot -  tonapi.io @tonapibot  - toncenter.com (reply to 14403)

G.H.Xu: Thanks

Daniil: It is not necessary but still important if you want to develop something big (reply to 14405)

G.H.Xu: I am a newbie, and do not find any scenario I can use TL-B, perhaps I will find one later

Daniil: TL-b is usually used to describe how smart contracts interact with each other. Usually when you write a contract, you also write a tl-b scheme where you explain the format of data that your contract takes as input and maybe return in response (reply to 14410)

Daniil: It is required mostly for internal & external messages because they don't have some exact format for message body. Developer can put any data in any format in it

G.H.Xu: So, is this similar to an api doc?

Daniil: It is similar to ABI for ethereum contracts, but more customizable (reply to 14413)

Daniil: TL-b is a language that can describe how some data type should be serialized and deserialized from binary format

Step: sometimes after auction ends if someone send ton to auction item contract address ton is coming back to sender, is it manually triggered or automatic by contract? (reply to 14411)

Step: is there any book to master skill on ton smart contracts?

Daniil: I'm not sure but probably that behaviour is defined in contract's code, or maybe it just raises an error so coins are bounced back to the sender (reply to 14416)

Daniil: Whitepaper and docs (reply to 14417)

Step: noob programmer cant gain anything from whitepaper. 😏 (reply to 14419)

Step: in ton , address contract type is unknown until there is first outgoing txn?

Daniil: It just should be deoloyed (reply to 14422)

Daniil: And when we're talking about wallets, they're usually deployed with the first outgoing tx

Step: yea this (reply to 14424)

lin: Send 0.01ton to an account, why is it always returned 0.009

Andrey: Because of transaction fee (reply to 14426)

lin: Are transaction fees too low?

Andrey: Yep (reply to 14428)

lin: Do I need to specify a fee to create a transfer transaction?

Andrey: No, it is constant and depends on the executed code (reply to 14430)

lin: How to solve this kind of problem, I use the golang sdk to send the transaction

lin: Does it matter if following toaddress is not excited?

Step: is it possible to know the fee before sending a txn? (reply to 14431)

Step: i may want to drain a wallet to 0 (reply to 14436)

Dario: Set mode = 128 (reply to 14437)

Step: sendMode ? (reply to 14438)

Dario: y

Step: is there any list of mode with its meaning? (reply to 14440)

Step: by default my codes have 3

Dario: https://ton.org/docs/develop/func/stdlib#send_raw_message (reply to 14441)

lin: Is there any other operation required to transfer funds to an inactive wallet? (reply to 14426)

Daniil: Send to unbounceable address (reply to 14444)

&rey: By the way, seed + publicKey = secretKey. (reply to 14397)

Step: yes thanks. (reply to 14446)

Step: is it possible to send ton to 2 different address in single txn ?? (reply to 14438)

Mr. John: yes

Mr. John: you can send up to 4 tx with v3 (or v4) wallet, and up to 255 with highload wallet contract

Step: can you direct me to any tonweb example that implement this? (reply to 14452)

Mr. John: I don't know if tonweb has this kind of examples

Step: 🥹

Mr. John: https://github.com/tonstack/ton3

Mr. John: here is ton3 highload wallet example

Mr. John: https://github.com/tonstack/ton3-contracts/blob/main/src/wallets/wallet.ts#L63

Mr. John: also here is source of <4 tx for non-highload wallet

Step: i want example for v4 address in tonweb

Daniil: Nobody "owns" TON. Idea and early development - Telegram. Currently - open source devs. (reply to 14464)

Andrey: your conclusions are strange, what makes you think so? (reply to 14466)

NuSs: this makes no sense, can be an open source project, but someone has to be the person who pay the deploy of the contract, receive the x millons of tokens, etc. (reply to 14465)

NuSs: also makes no sense, can be usa, china, singapur, all world, woth no proff is better not to talk (reply to 14466)

NuSs: I think is a good question, I just knew that the first time was telegram creator, but after some bad steps he stop the development and transform it in a open source, and other people continue, but dont know who is current owner of the project (reply to 14464)

Daniil: I don't understand what do you mean by "the person who pay the deploy of the contract" (reply to 14468)

Daniil: nobody is "owner" (reply to 14470)

Daniil: there are some core developers who write the most code of TON, but they don't control the whole network. Validators do. But the thing is that there are a lot (200+) validators and that number will only rise with time.

Daniil: Nobody can change something in TON without 50%+ of validators confirmations

User<5321317577>: You think we need Proof Of Reserves on exchanges or entire ecosystem?

NuSs: so, one questoin, who is the person or community who deploy TON on the blackchain? TON can not have an owner but do  a resposible person/people

NuSs: ok, until I can see reading a little (in other words can not be the truth at 100%), just for your knowledge:  the responsible team of current TON is TON foundation (previously NewTon) and the people who deploy the original testnet was Durov, and testnet2 (currently mainnet) NewTon, and I understand that people in charge of eveything is:  https://github.com/orgs/ton-blockchain/people

NuSs: is good to know who worked on the project one is involved

NuSs: I think this is not the right channel for this info, for this reason I apologize for the spam :(

— 2022-11-29 —

lin: https://toncenter.com/api/v2/packAddress?address=0:58aba63e02711a3781e0f2798f7a3db93ac384ec65942abda7504430b5f1080a  https://toncenter.com/api/v2/unpackAddress?address=EQBYq6Y+AnEaN4Hg8nmPej25OsOE7GWUKr2nUEQwtfEICmgZ

lin: Why is the address from pack lost in unpack?

Javad: do you have source of "NFT collection" smart contract ? for example 10K NFT collection ( with mint function )

Behrang: Why testnet is stuck? It looks like last block is validated more than 2000 seconds ago (more than 30 min)

Papiloma: Link? (reply to 14515)

Behrang: I couldn't see my test transactions on testnet.tonscan.org or testnet.ton.cx. Then used lite-client and used last command. It shows me that last block was for more than 2000 seconds ago.

Behrang: Now it's more than 4000 seconds. More than an hour.

Alex: Update of testnet validators. (reply to 14515)

Behrang: The message is very recent. Is something went wrong?

Behrang: A few blocks are accepted, but looks like that it's stuck again.

Rasoul: Hi guys how to find last block id in ton network?

User<5126596027>: https://toncenter.com/api/v2/getMasterchainInfo (reply to 14525)

Rasoul: and other question sry What is seqno and where is it used? (reply to 14527)

User<5126596027>: If your question about wallet smart contracts: It's like nonce in eth, but it isn't as a blockchain feature. Seqno feature provided by wallet smart contract code. But if your question about blocks: it's like "block number" (reply to 14529)

Max: Hey guys! @ton-community/tx-emulator for local transaction emulation has just been released. Please have a look at it and share your thoughts!

— 2022-11-30 —

nick: Hi guys, How can transfer TON out from JettonWallet address? (reply to 14557)

doni: you can use minter  or tonkeeper and tonhub support jetton transfers

doni: . (reply to 14558)

Alexander: Unfortunately, it's not possible (reply to 14558)

nick: native currency TON  not jetton token (reply to 14559)

doni: ow sorry i misread the question

Un gars bien: Hello guys.  Tried to deploy the first contact  from here but got this error : Found existing deploy-wallet [ kQCjfVOocWPAEfHXG1MuGkVDNb2q2qI8p6HrZkawLkmyOZiV] (Balance: 0💎, Is inited: False)  and then after trying to send coins from https://t.me/@testgiver_ton_bot got this error  : An error occurred, please contact with the administrator!  Could anyone help ?

nick: It will receive TON when it receive Jetton tokens, and after a long time, there will be many TONs in that address. (reply to 14561)

Alexander: You should specify response_address to receive excesses.  https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L143  The only way money can stuck is when jetton wallet receives bounce message. (reply to 14565)

Alexander: testnet isn't working at the moment (reply to 14564)

Un gars bien: okay ty (reply to 14567)

nick: I have set responseAddress but only receive few tons. (reply to 14566)

Alexander: You can not get coins FROM a jetton wallet smart contract. The coins  that are sent to the response_address is the rest of coins of the current transaction (msg_value), not a contract balance. (reply to 14561)

neo: https://testnet.toncenter.com/api/v2/  testnet is down? getting Gateway time-out error

Андрей: yes (reply to 14572)

Nasir: hello everyone . wish you great moments

Cpperg: Hey 👋

Adil: hi i am creating a Ton wallet if you have any wallet for ton kindly provide me the github

Eng Mustafa: what should i do i can't find what type of config file be provided

Step: how to decode message like this?  te6ccgEBBAEA5wADrUY3KJrpcF4P-kuLh24Nwo9FtC4edLDciSDuGrTh96kkc2nHs_VKvAdPc-Io1Lw-R2wAkBn64m0r4eAgosi8TmIW2mYDAAAAA2OHh2Jjh4f4BXBlbmlzwAECAwBaAWh0dHBzOi8vbmZ0LmZyYWdtZW50LmNvbS91c2VybmFtZS9wZW5pcy5qc29uAGOAGAUX7Ahh6mJrsavv5apyYYQi3sKCw7dHkQ_0DXCZchhsEjCc5UAAAKAAAcIAASdQEABLAAUAZIAIEbR2UW2Ay0snwgciTTdVU4vxldeBjTs-FVd1ZVMkrXA

User<864573471>: https://www.base64decode.org/ (reply to 14590)

Step: not all data visible ? (reply to 14591)

Step: strange characters like  ��￹r￹�￹F7(￹�p^￹�K￹n￹�￹E�.￹t��￹ �￹����$siǳ�

Daniil: Because that's not just a regular string. That's a serialized message (reply to 14593)

Daniil: You need to use some library like tonweb

Step: can you send me example of tonweb? (reply to 14596)

Coalus: https://github.com/toncenter/tonweb/ (reply to 14597)

Step: i know this library i meant to ask which func or class to use to deserialize the above message, the documentation is not very clear.   tonweb.boc.Cell.oneFromBoc(tonweb.utils.base64ToBytes('')  tried this but i can see only byte arrays. (reply to 14599)

User<470063563>: how to 'initialize' toncli's wallet?

User<470063563>: Found existing deploy-wallet [kQA3yoxDlzrRZOp0dHjZITcKm2nLxqXj4dX_9V9gFvpKmHsh] (Balance: 5.100009982�, Is inited: False)

User<470063563>: How much exactly TON needs to be send to deploy-wallet to finish initialization?

Daniil: less than 0.1 (reply to 14609)

User<470063563>: then... I'm not sure why does toncli complains...

User<470063563>: a bug?

User<470063563>: @Gusarich any hints on how to troubleshoot?

Step: please help me deserialize this with tonweb (reply to 14590)

Андрей: To decode a set of bytes, you need to imagine what is encoded there and how to decrypt it (decryption scheme) It is impossible to decode arbitrary data without knowing what it is and how to work with it. (reply to 14590)

— 2022-12-01 —

Step: i got from fragment. full data {"version":"0","body":{"type":"sign-raw-payload","params":{"source":"EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi","valid_until":1669875028,"messages":[{"address":"EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi","amount":10000000000000,"payload":"te6ccgEBBAEA5wADrUY3KJo-0Uu8LR7qtft8VK7UXunmrlII6Ylxix7SwKdatsZkUNLLXj4J3HwXpfGatI1RncyKUH3OoaOJyo0AygCInYIBAAAAA2OIRApjiESgBXBlbmlzwAECAwBaAWh0dHBzOi8vbmZ0LmZyYWdtZW50LmNvbS91c2VybmFtZS9wZW5pcy5qc29uAGOAGAUX7Ahh6mJrsavv5apyYYQi3sKCw7dHkQ_0DXCZchhsEjCc5UAAAKAAAcIAASdQEABLAAUAZIAIEbR2UW2Ay0snwgciTTdVU4vxldeBjTs-FVd1ZVMkrXA"}]},"response_options":{"callback_url":"https:\/\/fragment.com\/tonkeeper\/rawResponse?id=YyL-8F_8nhGb6yvqY8v2dMa3&qr=1","return_url":"https:\/\/fragment.com\/tonkeeper\/rawResponse?id=YyL-8F_8nhGb6yvqY8v2dMa3","broadcast":true},"expires_sec":1669875028}} (reply to 14624)

Kido Mike: We are looking for developer to write a smart contract.

Nasir: hello .who is the grant team leader of ton ?? how can i contact with them ??

Nasir: hey . i can help you . send me a dm (reply to 14640)

davide: how can i learn writing smart contract on ton?

Daniil: ton.org/docs ton.org/dev (reply to 14647)

User<470063563>: is there any build script for compiling ton under windows?

User<470063563>: script which would download / build all the dependencies like zlib

Сергей: Can someone send some test coins to me? The giver chat-bot seems to be empty. EQDDYqwzSuQP8HkaCT_AnRd5op9dAVa9NzEHE39LxMJ6Xoc1

User<5120074914>: Hello

Nasir: hello guys, anyone here knows ton grant team?

Tigr: testnet is not working for now (reply to 14653)

talkol: https://t.me/tonsociety_chat (reply to 14656)

davide: hello, where is the line of code that specifies the price of a Jetton? here, where i mint the token, I can’t even set a price! https://minter.ton.org

RocketMan: it is not ICO contract, it is just jetton contract (reply to 14662)

davide: so a jetton hasn’t a value ? (reply to 14663)

davide: I understood that it was the equivalent of tons of the ERC20

RocketMan: jetton is kinda ERC20 token (reply to 14664)

davide: an ICO contract can be a jetton contract? (reply to 14663)

davide: so a the jetton contract’s value is set by market (reply to 14663)

RocketMan: you could make ICO inside jetton minter contract (reply to 14667)

RocketMan: yes, you need to list your jetton on some dex, set its price by your project, back it by providing liquidity, etc etc. (reply to 14668)

davide: but the price how is set (reply to 14670)

davide: and In a contract I can write that if the price of the token is at 5$ (for example) it burn some token?

Max: You cannot set a price for erc20 too, because it is not a part of the standard  Most erc20 tokens have value because you can swap them on DEXes and CEXes, and the price is determined from them

Max: You can run an ICO for an erc20 token, but it is not part of the standard  The exact same principle applies to jettons

davide: Ok, but I don’t know how DEX/CEX set a value. do they add code? (reply to 14673)

Max: No Say a DEX has a BTC/USDT pair If there are 10 btc and 150000 usdt in it, it means that 1 btc is worth 150000/10=15000 usdt (susceptible to slippage and price impact)

Max: These 10 btc and 150000 usdt are the 'liquidity" that Aleksandr was referring to

Max: And are usually provided (at least initially) by the creators of a token if it is a new token

davide: mmh ok

Max: You may provide less liquidity for example 1500 usdt and 0.1 btc, but that would cause huge price impacts even for small swaps

davide: is there an open source dex on ton ?

davide: but if in one exchange I provide less liquidity than in anorher, the token would have a different value? (reply to 14680)

Adil: hii

Adil: how can i get ton testnet?

davide: sorr guys for all the questions 😅. i have a last: how an algorithmic stablecoin mantain price pegged to 1 dollar if the price of the token is set by the exchange? How the smart contract knows if the token is unpegged?

RocketMan: yes but arbitrage between dexes will do the job (manual or automated, doesnt matter) (reply to 14683)

RocketMan: if it is pegged, it means you can change it to real dollar somewhere, then again arbitrage between different exchanges does the job (reply to 14688)

Max: yeah but that only works for custodial stables (reply to 14691)

Max: for algorithmic stablecoins you need to read the whitepaper of the stablecoin itself

Max: depends on implementation

RocketMan: ah, that's correct

Max: from what I know (very unsure about my knowledge in this), they are usually backed by some other, unpegged token, and if the price goes down (idk how the smart contract knows that price is dropping), that other token gets sold to maintain the peg

Max: an example would be UST and LUNA

Max: but once again, I may be saying outright wrong things here

Max: not sure about that right now, none that I know of (reply to 14682)

Dario: Yeah, and if in a dex a trade is traded >1$ usually you can mint more from stable protocol itself (by lending etc) and sell them to lower the price (reply to 14696)

davide: yes the problem is how the contract knows? (reply to 14696)

altoshi: SC gets data from oracles (reply to 14696)

Dario: If its backed by crypto, usually they use oracles, a fancy word to say that someone push the data inside the smart contract (reply to 14701)

Max: in ethereum and other EVM networks there's chainlink for example

davide: and in ton,? (reply to 14704)

Max: doesn't exist at the moment

Max: but there is a grant for that I believe although it is only a draft right now

altoshi: https://t.me/tondev_eng/11564 (reply to 14705)

Max: oh that's cool (reply to 14708)

Dario: No code = no trust (reply to 14708)

Step: no one is here can help? 🥹 (reply to 14637)

altoshi: Said stonfi developer Our oracle is open-source. (reply to 14710)

Dario: Where? (reply to 14712)

davide: you have a githyb page? (reply to 14708)

Max: 👀

Dario: Im really curious, i looked for it at the beginning but i didn't find anything on GitHub (reply to 14713)

altoshi: Yes. I need to update it tomorrow (reply to 14714)

altoshi: Dm me, so I won’t forget to give a link to u

Saber: the scheme of your tx data is: OP(32 bits) Signature(512 bits) subwallet Id ( 32 bits) valid_since( 32 bit) valid_till ( 32 bit) username length(8 bit) username(8bit * length) content(ref) auction config(ref) royalty(ref) (reply to 14711)

Vladimir: Can you give a link to everybody?   If not, why do you say it is open source? (reply to 14719)

Step: does not open source neutralize the competition? (reply to 14742)

Step: it is the reason why telegram server is closed source. (reply to 14748)

Step: 🤣

Vladimir: That is a different topic where you can bring gitlab vs github and other examples of open source vs. closed sources.  But if someone says that a code is open source he/she must show the sources, otherwise better he/she should say the sources are closed. (reply to 14749)

Vladimir: Personally for cryptocurrencies I will not trust anything without sources that I can audit and compile.

Sup/b/: Hi guys , I installed tonсli, but the developer's(deploy) wallet was not created at startup

Sup/b/: Has anyone encountered?

davide: we can’t use chainlink on ton. isn’t it?

Max: not yet at least (reply to 14762)

— 2022-12-02 —

altoshi: Testnet is back.  Developers using testnet: please update the config and, if necessary, rebuild the tonlib from last commit of the testnet branch.

altoshi: Chainlink is EVM Oracle, TON is TVM, but I think they can build a new one on TVM using their brand name. (reply to 14762)

davide: but we have to wait chainlink (reply to 14781)

Nasir: hello, who is the lead of grant team and how can i contact with them, i sent apply and don't get answer yet.

Hartmann D.: Hi. Sorry for the late reply. Please ask it here - @tonsociety_chat (reply to 14812)

Hartmann D.: Please address your question to @toncoin_chat or @toncoin_es_chat. This is a dev chat only. Thank you. (reply to 14822)

Nasir: hey thanks for response. do you have Eugene Ponasenkov telegram id? (reply to 14823)

Hartmann D.: Lol https://t.me/tonsociety_chat/6791 (reply to 14826)

Rasoul: Hi guys how to call   function from smart contract  with http request ?

altoshi: I think you need to use Tonweb (reply to 14843)

Rasoul: Have you ever done this? I need documentation. I have not worked with tonweb (reply to 14844)

Rasoul: I did not find anything on tonweb 😢 (reply to 14844)

doni: you mean you want to call a getter ? (reply to 14843)

Rasoul: Yes (reply to 14851)

Rasoul: ? (reply to 14851)

0xSorcerer: hey guys...glad to be here.

0xSorcerer: i'm deploying my collection on getgems testnet with the mass nft deployer.

0xSorcerer: hope i can get a little help here.

0xSorcerer: it's gives me TypeError: NetworkError when attempting to fetch resource.

0xSorcerer: i have the collection base uri pointing to where all the *.json files are for the collection

0xSorcerer: i also have the Collection content URL pointing to where the full metadata.json file is for all the individual *.json were written. What am i doing wrong?

doni: this project will help you get started (reply to 14867)

doni: https://github.com/ton-defi-org/tonstarter-contracts/blob/main/test/counter.spec.ts

Андрей: To get started, write your thoughts in one message, and do not split them up. (reply to 14875)

doni: https://github.com/tonswap/tonswap-web/blob/master/src/services/api/index.ts (reply to 14867)

doni: here is a web example of calling getters

Pablo: Hi everyone! I came here to get new knowledge, could you recommend literature, videos, documentation on this topic. Thanks in advance.

0xSorcerer: ok. thanks. (reply to 14879)

Nikita: https://www.openmask.app/blog/deploy-contract-tutorial (reply to 14883)

Nikita: ‘Finish touch’ block

Nacho: Hey there, pytonlib started to throw this error message suddenly: pytonlib.tonlibjson.TonlibError: INVALID_CONFIG: hardforks differs from embedded hardforks . I'm fetching config data from https://ton-blockchain.github.io/testnet-global.config.json anytime the client is instantiated. Is testnet working?

Ruslan: Hi, yep! It’s an expected. (reply to 14898)

Ruslan: You need to rebuild a binary from testnet branch and pass it to cdll_path

Ruslan: We’ll make a patch soon

Nacho: Thanks Ruslan!

Ruslan: Here is a dockerfile with building instruction: https://github.com/kdimentionaltree/ton-builder/blob/main/amd64.Dockerfile

Hadi: @ruslixag or any other related admin Is it possible to provide at least one example for this question of ton contest 3-text-calculator https://github.com/ton-blockchain/func-contest3#3-text-calculator

.: Hi! Can some one send me tutorial for installation func and fift, please?

Ren: hey, maybe this will help https://t.me/ton_learn (reply to 14928)

.: Thanks! (reply to 14930)

Alex: https://ton.org/docs/develop/smart-contracts/environment/installation (reply to 14928)

.: Thanks a lot! (reply to 14934)

.: How I can fix this error? I tried to check FunC installation in cmd.exe (fift -V -and func -V -and lite-client -V) and it give me error

Anthony: Did you install Open SSL?

.: No (reply to 14938)

.: I will install it and test. Thanks! (reply to 14938)

Andrii: Hi! Just started my developer path, if I have some experience with Java, will It be very tough for me to cope with latest competition?

0xSorcerer: i needed this. thanks much. very familiar with javascript and python and finding FunC as my first dive into C programming. Thanks (reply to 14934)

0xSorcerer: hey Andriy, let me be the first to welcome you. Let's build something together while we learning here. Should be much more exciting we grow that way. (reply to 14942)

Andrii: Always! DM maybe? (reply to 14945)

0xSorcerer: sure (reply to 14946)

— 2022-12-03 —

0xSorcerer: so guys i have npm installed the SDK, but when i try to compile my script, vscode does nothing

0xSorcerer: is it a problem with my environment? with the SDK i understand we don't need to build binaries no more. (reply to 14934)

0xSorcerer: trying to compile my .fc through fift on vs  😢

Desmond: Hello! Am new new to TON, looking forward to learn from you guys and I would be happy if I get in  mentor TON  here

User<5321317577>: Morning from the South  I just finished my final year of secondary education and I'm not planning on going to university but work so I can save and build a PC and learn blockchain development

User<5321317577>: Does TON only use Fift language and where can I learn it?

altoshi: TON uses FunC, which compiles into lower-level Fift  But you can use Fift, which is 100x harder than FunC :) (reply to 14974)

User<5321317577>: 100x harder?😢  Is it also harder than C# or Python? (reply to 14975)

altoshi: FunC is similar to C, so Fift is alien language :) (reply to 14976)

User<5321317577>: I understand, thanks (reply to 14977)

User<5321317577>: I'll do a bit more research before making a decision (reply to 14977)

Yuri: Hello guys, I'm having some problems when installing toncli on windows: ImportError: cannot import name 'BitString' from 'bitstring' (C:\Users\yuria\AppData\Local\Programs\Python\Python311\Lib\site-packages\bitstring.py)

Yuri: Note: bitstring is installed

Nasir: hello guys . is any buddy here doing marketing for NFT project ?? inform me please

Cpperg: Hey guys what is the difference between FunC the language and FunC js npm

Daniil: You just said the difference in that message. Func is a language. And func-js is some npm module (reply to 14988)

Cpperg: Well yes 💀

Igor: Take a kook for this channel - https://t.me/ton_learn (reply to 14974)

Cpperg: But I mean in use cases

Daniil: Func is the main language for ton smart contracts (reply to 14992)

Cpperg: Yes but is there any difference if I would use js or are some functionalities not implemented in the js lib

Cpperg: Thanks (reply to 14991)

Daniil: Read the description of that npm module you're asking about (reply to 14994)

Cpperg: Okay thanks

Yuri: up (reply to 14982)

0xSorcerer: Func is all you need. Great career choice btw. Wish I could go back in time and save all those years I spent in school working through ridiculous courses made even harder by tutors. ✅ (reply to 14979)

0xSorcerer: Can't get the compiler to run in vs. think I should build it from binary?

Андрей: https://t.me/tondev/98751 (reply to 14982)

Rinat | ZilPay (Will not Call or DM you): hello everyone the path of bip44 is right here? https://github.com/satoshilabs/slips/blob/master/slip-0044.md

User<5321317577>: Thank you (reply to 14991)

User<5321317577>: Career Paths? (reply to 14999)

Rinat | ZilPay (Will not Call or DM you): i got a ban there, idk why! cannot join (reply to 15001)

Андрей: pip install bitstring==3.1.9 (reply to 15007)

Rinat | ZilPay (Will not Call or DM you): again, i just clicked to join group it just close a window i have to back this chat((( (reply to 15012)

TON technical overview: Rinat | ZilPay (Will not Call or DM you)  has been banned! Reason: CAS ban. (forwarded from Combot)

Rinat | ZilPay (Will not Call or DM you): but why? i didn't post anything (reply to 15015)

Rinat | ZilPay (Will not Call or DM you): i have a questions about address formats

Daniil: You can ask here (reply to 15017)

Rinat | ZilPay (Will not Call or DM you): what about bip44? and what is different of v2R1, v2R2, v3R1, v3R2, v4R1, v4R2? (reply to 15018)

TON technical overview: https://github.com/toncenter/tonweb/blob/update_contracts/src/contract/ContractSources.md#original-wallets (reply to 15020)

Daniil: https://ton.org/docs/participate/wallets/contracts (reply to 15020)

Rinat | ZilPay (Will not Call or DM you): thanks, what about bip44? i saw all library are useing incorrect method like mnemonic > seed > keyPair but it should be mnemonic > seed > bip44-path + index > keyPair, all popular blockchains use this like bitcoin, eth, sol... (reply to 15021)

Slava: We don't commonly use BIP44 in TON. There's a wallet ID option, that allows you to generate multiple wallets from the same private key. (reply to 15023)

Slava: However, I think I saw an implementation of TON HD wallets somewhere. (reply to 15024)

Rinat | ZilPay (Will not Call or DM you): yes, is have to read the v4,v3 wallet, but what if i want use more then one privateKey? I saw in the Satoshi lab TON with path number 607 is it right? (reply to 15024)

Slava: You can use as many private keys as you want. One for each contract. The way you generate them is up to you though. And if you would use some non-standard generation approach then your wallet contracts will be incompatible with the existing wallet software. (reply to 15026)

Yuri: Thanks mate! (reply to 15001)

Rinat | ZilPay (Will not Call or DM you): i fully understand it, i mean currently i see the issue with generate keys in the TON software, becouse any cryptocurrency has standards which support all platforms. If TON has a path of bip44 standards i don't understand why it doesn't use in the ecosystem (reply to 15030)

Yuri: Maybe it should be left in the docs which is the supported version

Slava: This could be a legacy. TON has a long history and several core development teams in the past. (reply to 15032)

Rinat | ZilPay (Will not Call or DM you): a good approach, i already implemented the bip39, bip44 for TON (javascript only) for derive path which use ed25519 by defualt 😌😌😌 (reply to 15034)

Rinat | ZilPay (Will not Call or DM you): i have tested success it. with https://github.com/satoshilabs/slips/blob/master/slip-0039.md

Slava: By the way, why do you think that HD wallets is a better approach than the current one?

Rinat | ZilPay (Will not Call or DM you): * this is the industry standard * there are 2 possibilities, generating wallet (via contract, HDKey) * it separate keys of others chains * also important is for developers to understand how it works (that's what standards are for) * last one, seed gets 512 bytes, tweetnacl which uses in the library use 256 for derive * if you lose a privateKey, you lose only one account, not all addresses (reply to 15037)

Rinat | ZilPay (Will not Call or DM you): i think if i will make a TON wallet, i will add both methods, so users can manage via bip44 and v4 wallet

Slava: Seems fair :)

User<5441137436>: Okay (reply to 15039)

Ivan: has anyone received ton coins in testnet using @testgiver_ton_bot recently? Because I can't

liminal: same (reply to 15052)

0xSorcerer: I have (reply to 15052)

0xSorcerer: You need to try it at least twice. Also use 4R2 addy (reply to 15052)

Ivan: "4R2 addy" Can you please send a link where I can read about it, because I new to ton😅 (reply to 15056)

liminal: i created browser wallet in testnet, tapped "receive" 2 times and balance is still zero

liminal: can someone transfer to me some test coins plz

Slava: It looks like testnet is not feeling very good recently. I would suggest to use mainnet for now. Considering how small TON transactions fees are, many developers are actually already working this way.

liminal: i sent some real TON to non-bounceable address. it was successful (because of transaction in explorer) but when i'm trying to deploy now, i'm getting notify that my balance is zero (reply to 15062)

Toan V: Hello, I use @testgiver_ton_bot get testnet token

Toan V: but it didnt send anything

Toan V: anyone like me?

Aleksandr: me too (reply to 15073)

Toan V: 🙁

Toan V: I use another telegram account request but still in queue

Aleksandr: this problem is not bot, transactions in the test network do not go through

liminal: https://github.com/newton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2.fif

liminal: do you know that's the example of fift message to highload wallet or sth else&

.: Hi! Which option should I choose for OpenSSL installation?

Ruslan: First one (reply to 15087)

play of the game: Hey everyone, are any of the solutions for smart challenge 2 available?

Coalus: https://github.com/nns2009/TON-FunC-contest-2 / https://github.com/GSA05/TonContest-FunC (reply to 15092)

Saber: Has anyone passed any task of this bot? https://t.me/tsccontests_bot

Jérôme: Hi everyone! Do you know if there is any dashboard/stats for the account growth of TON ?

.: Thanks (reply to 15090)

Boogie.man.07: Hi all! A question from another newbe, which stuck at the very beginning)) I took a "hello world" project, added .env with variable DEPLOYER_MNEMONIC with private key of my wallet, containing 24 words separated by space as per instruction at github. Then build is succeeded, tests succeeded, but deploy failed with the logs attached. The thing is that for some reason this is unfamiliar wallet address, it is not mine. Any help would be nice and sorry if someone already asked the same :)

Yuri: Hello guys, I'm not being able to get Testnet coins from the bot.

Saber: ok it’s working:) (reply to 15100)

— 2022-12-04 —

折耳: hi all! A question from a newbe. I want to test my contracts using tonstarter-contracts(https://github.com/ton-defi-org/tonstarter-contracts) I write a hello function that always return 1, but dont know how to test. I write test code that imitate the code in test/*.spec.ts but it doesnt work. I notced that contracts/main.ts storage some mapping relation between contracts function and hex int, should I add the relation about my hello function? and how can I find the corresponding hex int? Can that be automatically? Any help would be nice and sorry if someone already asked the same :)

J: without a HD wallet, it's hard to switch to different addresses for different purposes, so users are re-using the same address for everything (reply to 15037)

Behrang: Just consider that in TON, the sender address is very useful (based on my current knowledge). So using a new address for each transaction may not be useful.   For example, if you stake your TON in a nominator pool, you have to send the withdrawal request from the same address. (reply to 15038)

Rinat | ZilPay (Will not Call or DM you): You are absolutely right, for me the best way use one privateKey for one address, but the an option of v4 wallet seems maybe need someone, I think need support both (reply to 15130)

Yuri: Hello guys, I can't get any tons from https://t.me/testgiver_ton_bot

Toan V: it's hanging since yesterday

Toan V: I think you should deploy to mainnet

Toan V: just 0.005 TON for 1 time deployment

Toan V: https://tonscan.org/tx/Pgf3P74pxvi7--9xxxzOJyBl2t9mpYbesboovZ-b5w8=

Yuri: I see haha, people will start testing it on mainnet. Will the price go up?

Toan V: hope this will be true (reply to 15137)

Toan V: TON is very cheap now

Yuri: By the way. I'm new with the network, do you know how I can change the default wallet from toncli to one I have control?

Toan V: which machine you use?

Toan V: OS

Yuri: Windows for now

Toan V: I dont know how to, but you can transfer TON to this wallet for deployment testing (reply to 15140)

Toan V: change to your main wallet is risk for sure

Yuri: I see, tried to use WSL before, but had some issues

Toan V: I use macos, I follow with tutorial https://github.com/romanovichim/TonFunClessons_Eng/blob/main/1lesson/firstlesson.md (reply to 15143)

Yuri: Yeah, I wonder why I can generate other addresses from the HD wallet, I provided a mnemonic to TON wallet

Yuri: Ah yeah, this is exactly what I'm doing hehe

Yuri: But got stuck on deployment because no tons

Toan V: it isnt HD wallet, I see it has mutil variant wallet version (reply to 15148)

Yuri: Would be nice to have something like "Metamask". I'm doing a project with some partners, currently building on Ethereum, but we're exploring TON to do so.

Toan V: openmask

Yuri: Hmmm

Toan V: https://www.openmask.app/

Toan V: this is metamask version for TON

Toan V: just made deposit (reply to 15150)

Yuri: Nice nice, downloading it, just Chrome for now, right? (reply to 15155)

Yuri: What you mean? (reply to 15157)

Toan V: if you have TON in another wallet, make a deposit to deployment wallet; if dont have both, buy in CEX or use bridge

Toan V: @wallet

Yuri: Ah yeah, I have it

Yuri: gonna try to do so

Yuri: I try not to touch CEX that much. Bought on uniswap and used bridge

Toan V: you can deposit BTC to @wallet and swap TON (reply to 15164)

Yuri: Why when I change from mainnet to testnet, Openmask asks for the mnemonic again?

Toan V: hmm I didnt see that in my side

Macro: can  someone send me some  Tons ?  I want  to test it.  my  wallet address: UQDXVyCaw5PaB1liYgdqwPbY3F_TGeZCO-EHrP-ddPrE6F5A

Yuri: Hey guys, getting an error when trying to initialize the contract, where can I send the logs?

Yuri: PS C:\Users\yuria\learning\TonFunClessons_Eng\1lesson\solution> toncli deploy -n mainnet INFO: 🚀 You want to interact with your contracts ['contract'] in mainnet - that's great! INFO: 🦘 Found existing deploy-wallet [kQB1zW2FVqWbFB0w4OR9HMw0-lgmt5oj34i1_Cbb3b_a1Vcm] (Balance: 0.495434999💎, Is inited: True) in C:\Users\yuria\AppData\Local\toncli\toncli INFO: 👻 Your smart contract project [C:\Users\yuria\learning\TonFunClessons_Eng\1lesson\solution] is now going to be deployed, get ready! INFO: 🌈 Start building:  INFO: 🌲 Func compiled INFO: 🤗 Run tests on ['C:\\Users\\yuria\\learning\\TonFunClessons_Eng\\1lesson\\solution'] [ 1][t 0][2022-12-04 08:47:54.8228452][Fift.cpp:67]     top: include level 1: <text interpreter continuation> [ 1][t 0][2022-12-04 08:47:54.8230493][fift-main.cpp:205]       Error interpreting file `C:\Users\yuria\AppData\Local\Temp\tmpzped393q.fif`: tmpzped393q.fif:6: include:cannot locate file `C:\Users\yuria\learning\TonFunClessons_Eng\1lesson\solution` INFO: 🌲 Tests passed INFO: 🥳 Start contract manipulation [ 1][t 0][2022-12-04 08:47:54.8530669][Fift.cpp:67]     top: include level 1: <text interpreter continuation> [ 1][t 0][2022-12-04 08:47:54.8532668][fift-main.cpp:205]       Error interpreting file `C:\Users\yuria\AppData\Local\Temp\tmpqod601oi.boc`: tmpqod601oi.boc:2: include:cannot locate file `C:\Users\yuria\learning\TonFunClessons_Eng\1lesson\solution` Traceback (most recent call last):   File "<frozen runpy>", line 198, in _run_module_as_main   File "<frozen runpy>", line 88, in _run_code   File "C:\Users\yuria\AppData\Local\Programs\Python\Python311\Scripts\toncli.exe\__main__.py", line 7, in <module>   File "C:\Users\yuria\toncli\src\toncli\main.py", line 67, in main     CommandsExecuter(command, string_kwargs, parser)   File "C:\Users\yuria\toncli\src\toncli\modules\utils\commands\commands_executer.py", line 42, in __init__     self.command_mapper[command](self)   File "C:\Users\yuria\toncli\src\toncli\modules\utils\commands\commands_executer.py", line 73, in deploy_command     return DeployCommand(self.string_kwargs, self.parser)            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\yuria\toncli\src\toncli\modules\utils\commands\command_classes\deploy_command.py", line 17, in __init__     deployer.publish(real_args[2:])   File "C:\Users\yuria\toncli\src\toncli\modules\deploy_contract.py", line 88, in publish     self.build(real_contracts)   File "C:\Users\yuria\toncli\src\toncli\modules\abstract\deployer.py", line 111, in build     data.append(contract_manipulation(os.path.abspath(contract.to_save_location),                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\yuria\toncli\src\toncli\modules\utils\fift\commands.py", line 96, in contract_manipulation     output = subprocess.check_output(command, cwd=getcwd() if not cwd else cwd)              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\yuria\AppData\Local\Programs\Python\Python311\Lib\subprocess.py", line 465, in check_output     return run(*popenargs, stdout=PIPE, timeout=timeout, check=True,            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   File "C:\Users\yuria\AppData\Local\Programs\Python\Python311\Lib\subprocess.py", line 569, in run     raise CalledProcessError(retcode, process.args, subprocess.CalledProcessError: Command '['C:\\Users\\yuria\\ton-win64-binaries\\fift.exe', '-I', 'C:\\Users\\yuria\\AppData\\Local\\toncli\\toncli\\fift-libs', '-s', 'C:\\Users\\yuria\\AppData\\Local\\Temp\\tmpqod601oi.boc', '']' returned non-zero exit status 2.

User<370297320>: Can someone send me test TON, please ? EQAV1sEMzJw06pwIFcGmvBZB3H4Bzk7uwOYfPBp5_Th7QWPf

User<370297320>: An error occurred, please contact with the administrator! (forwarded from Testgiver TON Bot)

User<370297320>: Cuz faucet is not working or are there any other faucets available? (reply to 15178)

doni: Is test net up ?

play of the game: So how long does this take? Is it working?

play of the game: Address: 0QDyt68zW_ngXlctCevWl0irCSwJ-wtWQC4ZHIbeKdCv15wg Amount: 2 TON  Request added to the queue for execution, please wait! (forwarded from Testgiver TON Bot)

Anthony: Hi all! Is there anyone from India? The First Stage Labs (fslabs.io) team is going to India next week. Maybe we can get to know each other and hang out together.

Slava: I've created a small MongoDB backup service that generates, compresses and encrypts database dumps and pushes them to S3 or a filesystem. It's not a replacement for a proper managed snapshots of course, but it could be useful for disaster recovery, considering how fragile the world becomes.

Amin: Hi, does anybody have ideas where I can find TL-B schema of TVM registers like c5?

Amin: nvm, it's just as OutListNode in block.tlb :) out_list_empty$_ = OutList 0; out_list$_ {n:#} prev:^(OutList n) action:OutAction     = OutList (n + 1); action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;  action_set_code#ad4de08e new_code:^Cell = OutAction;  action_reserve_currency#36e6b809 mode:(## 8) currency:CurrencyCollection = OutAction;  libref_hash$0 lib_hash:bits256 = LibRef; libref_ref$1 library:^Cell = LibRef;  action_change_library#26fa1dd4 mode:(## 7) { mode <= 2 } libref:LibRef = OutAction; out_list_node$_ prev:^Cell action:OutAction = OutListNode; (reply to 15193)

User<5441137436>: I have it (reply to 15193)

Я: Good evening.I have already asked for help, but they did not help me.I hope someone can do it today.Windows 10 laptop does not see fifth.Fifth is circled by a red line

Diako: is there any wallet connect module for js ? like "connect wallet" in getgems

.: Hi. How I can fix this error?  toncli start wallet

.: solved. i needed bitstring (reply to 15210)

.: How I can solve this? VSCode can't read .func files

Anasseh🐐: Hello community can anybody help me here on refund issues, I will truly appreciate thanks

Boogie.man.07: Hi, i have the same issue... You just did "pip install bitstring" and it worked? (reply to 15211)

.: Hi  pip install bitstring==3.1.9 (reply to 15217)

Boogie.man.07: Thanks a lot, worked! (reply to 15218)

— 2022-12-05 —

0xSorcerer: Use a plugin (reply to 15214)

Toan V: for what? (reply to 15225)

Behrang: https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L368 (reply to 15193)

neo: Testnet is down? I'm not able to make any transfers in the test network (reply to 15226)

nick: Hi, Can this method 'sendBocReturnHash' work？

User<5846774480>: Hello Team, Is there ant offline signing example in js?

User<5846774480>: i have to transfer TON

User<2111860119>: Hey guys how can I start

Slava: You can create the message offline and send it later. (reply to 15240)

Slava: Just follow any example up to the moment when the message is getting sent to the network.

User<5846774480>: Hello,  I have to use thirdparty library to sign transaction.

User<5846774480>: for example: https://gist.github.com/andelf/f05f5403e352346e04aad0deec48aad1#file-trc20-offline-sign-js-L37

User<5846774480>: a TRON example, I need same idea

User<5846774480>: Sorry, typing mistake 😁

Slava: https://github.com/toncenter/examples/blob/main/withdrawals.js#L76

Dev: Is Sandbox Faucet working?

Dev: It shows that my request/address was read but I see no response or transfer to wallet

Slava: Do you mean testnet by Whales? (reply to 15255)

Dev: Yes thats the one (reply to 15257)

Slava: It was shut down some time ago. (reply to 15259)

Vassily: Hi! testnet faucet does not give me TONs for three hours since request. How long the wait can take? https://t.me/testgiver_ton_bot - this one

Slava: It looks like testnet is not feeling very good recently. I would suggest to use mainnet for now. Considering how small TON transactions fees are, many developers are actually already working this way. (forwarded from Slava)

Andy: Is c4 supposed to be empty by default?

Sasha Murzin: > Considering how small TON transactions fees are Nice )))  So why TON mainnetwork do not spare i dime to EQAdKMzROm7BavE771uefFKFZStyRSrNGU2KWSwjaws_0ZHn for me? (reply to 15263)

Motty: hey all new to TON. trying to comile https://github.com/ton-defi-org/tonstarter-contracts on ubuntu when running npm run build, it says `FATAL ERROR: 'func' with version >= 0.2.0 executable is not found, is it installed and in path? ` any advice on this please?

Dev: One issue with test faucet seems to be the captcha is not working quite right.

Ruslan: Letters are case sensetive (reply to 15276)

Dev: ok, seems to be working now. I have been added to the queue

Nedim.007: Merhaba

Nedim.007: I'm new here can anyone help me?

Dev: how did you install func? there are a few options available. If you compiled it will be in the build directory under /build/crypto.  Also you may need to set your PATH variable to point to it. (reply to 15270)

Dev: Are you interested in writing smart contracts for TON? and what have you tried so far? (reply to 15284)

shotaro 💧: hey, solidity, evm web3 developer here  i see there is a token bridge eth <-> ton  is there an AMB, arbitrary message bridge?  any plans for an AMB eth <-> ton for cross chain communication?

shotaro 💧: my main interest is exposing ton to some oracles available only on EVM chains in ethereum ecosystem.

Dev: How are the oracles accessed currently on the EVM chains?

Руслан: Guys, the asshole bot doesn't give me test coins, can someone drop one:(((

Ruslan: Nope, do not blame a bot. There are problems in testnet now

Nedim.007: As I said, I am new among you, I have not done anything before, and this will be the first step I will take with your vast knowledge and experience. (reply to 15287)

Dev: you can start here: https://ton.org/docs/develop/getting-started

Dev: For some of the articles you need git installed, and make, cmake to compile. Otherwise the first article by Tal Kol will show you where to get the binaries.

Dev: you can pull the latest ton source from git repo and make. You just need the git installed, cmake and make.  If you are on a mac you need to update PATH in .zshrc file to include the /build/crypto where the build func etc are or you can move those to bin directory. (reply to 15270)

play of the game: Hi, How can I have some array structure in the permanent storage of my smart contract? The only feature I need is being able to iterate through it. Random access isn't necessary but it would be better for me. Thanks in advance

play of the game: Also what if I want such structure in the smart contract runtime (when the code is being executed, say I'd want to store an array of some type) (reply to 15300)

shotaro 💧: the most popular defi oracle is a third party oracle network that is called chainlink. Unfortunately, in practice, the oracle network is backdoored by a multisig and chainlink and first party api provider partners have reputation at stake and relatively robust infrastructure, and its token currently has zero usecase except speculation.  ultimately an AMB bridge would be effectively a multisig secured by validators but works sufficiently well for low value high volume. there are a few zk bridges in development but nothing deployed live on an evm chain (validate the consensus and blockheader of another chain as a zero knowledge proof).  There are other oracles like API3, and Reality.eth paired with a decentralized arbitrator like Kleros. These oracles are secured partially by the network effect of integrated parties and staked token collateral. The idea is that the most secure decentralized oracles concentrate their token liquidity and security on a single chain and message pass results to other chains. I want to message pass oracle results from oracles with network effects to TON. (reply to 15292)

Daniil: Use tuples and serialize them into cells (reply to 15300)

play of the game: I don't quite get the logic behind serialization. What resources do you recommend? (e.g. My array may get arbitrarily large whereas a single cell storage is some constant bits. So I'm guessing some kind of pointer is stored in that cell but then, where exactly is my data stored?) Also any code examples would really help me out. Thanks again (reply to 15303)

Daniil: Cells can have up to 4 references to other cells. You can store almost any amount of data in your contract (reply to 15304)

play of the game: Oh I get it, so this serialization basically creates some kind of linked list structure from cells to be able to store any data right? (reply to 15305)

Daniil: You can go in two ways:  - create a bamboo-like tree of cells, where each of them have exactly 1 reference (except for the last one)  - create a regular tree, using all 4 references for all cells  Both ways are correct. First one is more simple in realisation but it will require you to parse all the cells in the worst case to retrieve only some part of data.  Second way is a bit harder to implement but you'll be able to access any part of data by parsing just log4(N) cells. (reply to 15306)

Daniil: If your contract don't need to retrieve data partially and you need to get the whole array, first method is fine. Because you'll anyway parse all the cells

Fedya: Hi! Could somebody send me some TON in testnet, please? 🙏 EQDnACBW0yKjVUGkboAMxoyG05Cvhnik9crGasauD_eeqRPY

play of the game: Hmmm. Nice thanks (reply to 15308)

&rey: >  - create a bamboo-like tree of cells, where each of them have exactly 1 reference (except for the last one)  Contracts have limited storage depth, so the array won't be able to have more than ~512 elements. https://ton.org/docs/learn/tvm-instructions/tvm_overview#result-of-tvm-execution (reply to 15308)

Daniil: Oh, thank you for clarification. I didn't know that (reply to 15312)

Daniil: But tuples also have a limit - 255 elements. If you need more elements, you just nest them. So if you implement some function for storing arbitrary tuple in cell, it will work fine

Daniil: Easy approach is a recursive function to store tuple in a cell. When it finds some nested tuple, just store it in the next free ref by calling that function again  I've used something like that on TSC2 for one of the tasks

Alberto: Is someone else having problems defining function with asm on task 4?  I’m using  int mulmod(int a, int b, int mod) asm "MULMOD";  and it works just fine here, but I’m getting compilation error when submitting to TSC bot

&rey: Maybe this function is defined in bot's stdlib. You can try changing its name. (reply to 15318)

Alberto: I see, I will try it, thanks!

Alberto: Didn’t work (reply to 15319)

&rey: Then compilation error may mean that bot's assembler is too old and does not contain MULMOD instruction. (reply to 15321)

liminal: hello. i want to send external message to mainnet via "toncli fift sendboc" (ex.   toncli fift sendboc ./fift/usage.fif build/contract EQB36_EfYjFYMV8p_cxSYX61bA0FZ4B65ZNN6L8INY-5gL6w 0 0 0.01). where i should put "-n mainnet" arg?

Iván: is there any info about the nature of the problem? (reply to 15295)

Ruslan: It was forked few days ago. (reply to 15329)

User<5666236056>: Not stop

Florent: Hi, Any developer available to help me build .ton website ? Or video tutorial that match my low level. Thanks

Iván: so some of the nodes has not been updated yet? (reply to 15330)

Ruslan: Hi, try this repo: https://t.me/tondev_eng/12135 You need to run proxy docker and your site on port 80 on the same machine (reply to 15335)

Florent: Hi Ruslan, Will do so thank you (reply to 15338)

.: Hi! How I can fix this error?

— 2022-12-06 —

hadi: Hi. is there any article about ton tokenomic?

Anthony | Sendor - Beyond The Pump: Any solid developers in the chat?

Anthony | Sendor - Beyond The Pump: Any open to building something on the Ton Network together? I am 11 years in this space and interested in supporting some growth on this network.

Daniil: @toncoin_chat for general questions

User<5846774480>: looking for faucet

User<5846774480>: Could somebody send me some TON in testnet, please? 🙏 EQCSOUHMAP__5LGtCnqvqBcnsJtf_sfRkcAbpKwNwPKJ_sUJ

play of the game: Hi, Should I assume empty initial storage for smart challenge 3 tasks if it doesn't say anything?

play of the game: Another question: If I want to use a varUInteger 16 as a dict key, what key_len should I choose?

Daniil: Why do you need the storage in the calculator task? (reply to 15373)

Daniil: Just use regular integers, that's easier (reply to 15374)

play of the game: No I'm trying on the queue task (reply to 15375)

play of the game: It is an integer, I just don't know how large it may be, so should I just put 1023 as key length in dict? (reply to 15376)

Daniil: I think 256 bits will be enough (reply to 15378)

Samuel: Hy,  I'm trying to do the smart challenge second task. However i'm currently trying to understand the part about messages. If need to send a message I need to know the target address. How am I supposed to know it ? I someone could give me a hint this would be awsome

Samuel: Or is it store inside msg and I need to modify msg such that the value is correct ?

Matin: In the statement it says you can send the message to any address. Your own address or any other should do fine (reply to 15382)

Samuel: As an internal or external message ? Because in Ton VM documentation I see 2 types of messages (0 or 11)

Saber: it should be internal message (reply to 15386)

Active: Take stdlib from here https://raw.githubusercontent.com/ton-foundation/ton-stdlib/main/func/stdlib.fc  and in code have this  ``` const compileResult = await compileFunc({     sources: {         "stdlib.fc": readFileSync('../func/stdlib.fc', { encoding: 'utf-8' }),         'main.fc':   readFileSync('../func/main.fc', { encoding: 'utf-8' }),     },     entryPoints: ["stdlib.fc","main.fc"], }) ```  the order of entryPoints matters , god bless ton (I've spent 2 hours on this) (reply to 12552)

Narek: there is no need to include stdlib in entryPoints

Narek: you can just do #include “stdlib.fc”; in main.fc

Active: does not looks so (reply to 15394)

Narek: Could you show code?

Narek: Also in the new version you can just pass function that fetches files from FS

ILYAR: Compact-u16  Compact-u16 Format  A compact-u16 is a multi-byte encoding of 16 bits. The first byte contains the lower 7 bits of the value in its lower 7 bits. If the value is above 0x7f, the high bit is set and the next 7 bits of the value are placed into the lower 7 bits of a second byte. If the value is above 0x3fff, the high bit is set and the remaining 2 bits of the value are placed into the lower 2 bits of a third byte.  hex     |  compact-u16 --------+------------ 0x0000  |  [0x00] 0x0001  |  [0x01] 0x007f  |  [0x7f] 0x0080  |  [0x80 0x01] 0x3fff  |  [0xff 0x7f] 0x4000  |  [0x80 0x80 0x01] 0xc000  |  [0x80 0x80 0x03] 0xffff  |  [0xff 0xff 0x03])  Presumably TL-B schema like this:  // compact-u16.tlb bool_false$0 = BoolFalse; nothing$0 {X:Type} = Maybe X; just$1 {X:Type} value:X = Maybe X; tail#_ b:(bits 7) next:BoolFalse = CompactU16Snaked ~0; cons#_ {n:#} b:(bits 7) next:(Maybe(CompactU16Snaked ~n)) = CompactU16Snaked ~(n + 1);  But this is probably wrong. I will get an error on omit code generation and verbosity level  tlbc -qv compact-u16.tlb compact-u16.tlb:6:37: error: passed an argument of incorrect polarity to `Maybe`   cons#_ {n:#} b:(bits 7) next:(Maybe(CompactU16Snaked ~n)) = CompactU16Snaked ~(n + 1);  How to describe the compact-u16 format to the TL-B schema?

Michael: /

Active: fc - https://gist.github.com/Datswishty/736040793a5c12b14d1deb2a74392cb9 tests - https://gist.github.com/Datswishty/501d0cfd37b7db4dc70613572b640bf7 (reply to 15398)

Narek: не работает так?

Narek: попробуй залогать compileResult там ошибка должна быть

Active: {   status: 'error',   message: 'Func compilation error: main.fc:3:44: error: redefinition of function `recv_internal`\n' +     '  () recv_internal(slice in_msg_body) impure {' } (reply to 15404)

Active: this when I #include  but if I don't do so -  {   status: 'error',   message: 'Func compilation error: cannot generate code for function `recv_internal`:\n' +     'main.fc:6:26: error: variable does not have fixed width, cannot manipulate it\n' +     '      slice ds = get_data().begin_parse();' }  and  main.fc:11:48: error: undefined function `.end_cell`, defining a global function of unknown type       set_data(begin_cell().store_uint(total, 64).end_cell()); (reply to 15405)

play of the game: Guys I just solved a task but my "Itermediate place in contest table" has increased from 20 to 21. What's going on?😐

Samuel: Someone else also managed to solve something

Samuel: The intermediate place for 0 point is (number of people with score > 0) + 1

Samuel: Can we write mutually recursive functions in FunC ? When I'm trying to do this I get a compilation error saying the second function is not defined in the body of the first

play of the game: Oh makes sense (reply to 15409)

Daniil: @toncontests_chat (reply to 15407)

Narek: а поправь чтобы как в примере (reply to 15405)

Narek: ты же на все файлы отдаешь main.fc

Narek: Oh, forgot that it’s the English chat 😁

play of the game: Can I right a function f(x, y) that receives for example two variables x and y (that exist in the scope that f is called) and change their values in the whole program?  If you're familiar with c++, I need such  function: void f(int& x, int& y){     x+=1;     y+=1; }

Narek: just try to replace this:   sources: () => readFileSync("../func/main.fc").toString()  with this:   sources: (path) => readFileSync(__dirname + '/' + path).toString()

Narek: you can’t pass primitive by reference (reply to 15416)

Narek: but you can define global variables

User<2124686369>: How can I sell up my username @admin

TRADE: Türk yokmu

Matin: what does this error mean? lvalue expression constructor is 9 fatal: cannot compile lvalue expression with unknown constructor  edit: sorry, didn't mean to reply (reply to 15409)

Max: you are probably trying to modify a global variable not through assignment but by something like global_var~modifying_function();  if this is the case, either change your code not to use this global variable, or do this modification using a temporary variable (reply to 15428)

Saber: for the first task, as far as I know tpush has limit of 255 elements, and I think in one of the cases my algorithm face this limit, any suggestion or alternative to use?

Max: nested tuples (reply to 15432)

Matin: I want to have a dictionary and I don't want to pass it around to functions, I definitely want to change it's content if necessary, so you're saying I must use local variables? Also if I can't change its content, why is it called a global "variable"?😂 (reply to 15430)

Max: well I faced exactly that error 5 minutes ago and couldn't figure out a way to use global vars with modifying functions I, too, didn't want to pass it around you can change the content like so global_var = ...; and probably with operator assignemnts like +=, *= etc but it seems that right now you can't use modifying functions on global vars (reply to 15434)

Max: my guess as to why would probably be because global variables are not on stack usually, they are put onto the stack with GETGLOB and are set back into globals using SETGLOB, and I guess func can't figure out that it needs to GETGLOB the global before modifying function and then SETGLOB it back

Max: but idk what I'm talking about, could be something way different

Matin: global cell a; () main(){   a = new_dict();   int x = 5;   cell msg = begin_cell().store_uint(0x10, 6).end_cell();   a = udict_set_ref(a, 32, x, msg); }  that one compiles fine, but for some reason, this one won't:  global cell a; () main(){   a = new_dict();   int x = 5;   cell msg = begin_cell().store_uint(0x10, 6).end_cell();   a~udict_set_ref(32, x, msg); } (reply to 15436)

Matin: Anyone know the difference? (reply to 15439)

Max: I actually tried the first one but when there's a multiple assignment using a global var like (global, local1, local2) = ... then it doesn't work too (reply to 15439)

Max: maybe the second one translates into (a) = udict_set_ref which involves tensor unpacking too and maybe that causes the issue

Nick: /report (reply to 15448)

Samuel: I saw a ~debug that dumps the value. Is there a ~print that dumps a slice by interpreting it as a string ?

Max: there's ~strdump (reply to 15450)

play of the game: Do you know any good documentation about how to handle strings in func? (How to read them, how they're represented, etc.)

Max: Description of task3 contains a link to docs where you'll find that (reply to 15452)

play of the game: I read that and understood nothing😂 I probably should first choose which string type to use (which I don't know yet), in order to be able to have random access to i'th character and also have it's size. Also I don't know how to read and store this string from an internal message to my program. Do you know any code examples? (reply to 15453)

Max: so have you seen the Snake string type or not?

play of the game: You mean like: "Blah blah"s ? (reply to 15455)

play of the game: ? (reply to 15456)

Max: well here is an example of a string representation from documentation this one is a format used for "simple comment transfers" i.e. transfers of TON with just a string comment root_cell("0x00000000" - 32 bit, "string" up to 123 bytes)          ↳1st_ref("string continuation" up to 127 bytes)                  ↳1st_ref("string continuation" up to 127 bytes)                          ↳.... the 0x00000000 is the op which you don't need if you just want a string it does not provide random access however, and really I don't know what you could do to get random string access - we don't really have arrays in func unless your string is <=255 chars long, then you can parse it into a tuple and get chars using indices another (ugly) solution would be a dictionary that contains keys as indices and chars as values (reply to 15456)

Nasir: hello guys, we are looking for a Russian CM for our project, if any buddy here interested to work with us, send me a DM

Diako: I need to save data with this struct userAddress => intValue can i use Hashmap ?

Nick: You can, but if it’s supposed to have many users you should avoid sticking this approach. (reply to 15464)

Diako: so what should i do for many users ? (reply to 15465)

Bahram: Hello buddy How is membership and collaboration with your project? (reply to 15460)

Nick: The approach is used for jettons. A separate contract for each user.

Bahram: Friends, did you ask about the sale of Telegram usernames here or not?

User<1485162855>: Hi guys. I started to learn FunC. I'm onboarding now. I'm reading https://blog.ton.org/func-journey this article and found link to instruction to install toncli. In that instruction they wrote that I shoud download .dll from here: https://disk.yandex.ru/d/BJk7WPwr_JT0fw. Seriously in yandex disk?! Is it scam? Where can I find the official guide to install func or should I compile it by myself?

Andrey: 👋, you can download libcrypto wherever you want, this is just example. You can provide an official link to openssl website or other official place where it can be founded. The docs of toncli is open source, so feel free to contribute  I'm not pro-windows user (prefer ArchLinux, you know, it's much easier to develop on it), so that's why I've provided link to yadisk. Also you can use docker image of toncli, it’s easier to run toncli on windows from it: https://github.com/Trinketer22/func_docker (reply to 15471)

.: Hi! Where I can get free ton for test? Testgiver doesn't work for me(

Mark Okhman on TON: why not using https://github.com/ton-community/ton-compiler? (reply to 15471)

Mark Okhman on TON: or you could use this repo, it references to compiled binaries ready to use https://github.com/ton-defi-org/tonstarter-contracts (reply to 15471)

liminal: does this boilerplate have embedded functions to send dictionaries in messages to smart? (reply to 15478)

Saulis: Hello. What is the TON contract.

Diako: do i need implement function for withdraw balance of contract ? or deployer have access to withdraw ?

Daniil: ? (reply to 15481)

Dev: This is a software program written in FunC language and deployed on TON Blockchain.   It can contain not only data like is found on a distributed ledger of payment transactions but also it can contain executable code and business rules that act on that data.   It runs within the TON Virtual Machine. (reply to 15481)

Dev: If you had a smart contract representing a vending machine it would not only keep track of the amount spent but contain the rules and logic of what item should be dispensed for what amount of TON Coin is the classic example.

Vadym: hello, how can I check send_raw_message using ton-cli tests?

Andrey: https://github.com/disintar/toncli/blob/a4c3629cfe71d06e5f34891777b71b1c827615ad/src/toncli/projects/nft_item/tests/nft-tests.func#L501  Use parse_c5 function and parse c5 actions in tests (reply to 15489)

Vadym: tnx ^^ (reply to 15491)

Iván: Hey guys, testnet is still down?

davide: what can be the problem (reply to 15263)

Boogie.man.07: It seems that good news! Just checked again my test wallet balance and tons was there + tried to deploy contract to testnet and all succeeded! It seems that finally it's up again! 🙂

Vadym: Guys, is there any library or documentation for working on Strings?

— 2022-12-07 —

Nick: https://ton.org/docs/develop/func/literals_identifiers#string-literals  It’s a usual slice. (reply to 15497)

User<5846774480>: Any idea: thrown: "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted     Cannot run message on account: inbound external message rejected by transaction

isoscele 💎: Maybe check your PC clock time (reply to 15509)

User<5846774480>: Time is correct

User<5367207172>: any one from kerala

jessez: testnet? (reply to 15509)

User<5846774480>: Yes (reply to 15515)

jessez: This is "normal". Last week(?) the testnet is very buggy. You should handle this error and run the code further if u can (reply to 15517)

User<5846774480>: I failed to make transaction: thrown: "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted     Cannot run message on account: inbound external message rejected by transaction E5AE823F3A9F3070FCB9CB215F14B4D890B23520FF90CBFFED3A3625CC5A3E78:     exitcode=33, steps=33, gas_used=0     VM Log (truncated):     ...OW     execute XCHG s1,s3     execute LEQ     execute THROWIF 35     execute PUSH c4     execute CTOS     execute LDU 32     execute LDU 32     execute LDU 256     execute ENDS     execute XCPU s3,s2     execute EQUAL     execute THROWIFNOT 33     default exception handler, terminating vm with exit code 33     "

User<5846774480>: @jessezV

User<5846774480>: I got this error in below line const response= this.api.provider.sendBoc(boc); (reply to 15518)

.: Hi! Can someone help me to fix this error, please?

.: toncli deploy -n testnet

Diako: i get transactions of my contract and there is "data" field how can i decode this field ?

User<1794278192>: Hello I have a telegram account that I have been using for business adv. Please how do I start registering for ton

User<5901725413>: Hello, I am always getting this error  Check that correct include path is set by -I or by FIFTPATH environment variable, or disable standard preamble by -n.  Fiftlib is installed in /usr/local/lib/fiftlib/

Я: pls (reply to 15208)

𝔎𝔬𝔟𝔢 24 / 8: Hi

𝔎𝔬𝔟𝔢 24 / 8: Is the maintenance of toncli deploy -n testnet finish ?

liminal: how can i send boc(via toncli fift sendboc) in mainnet to highload wallet?

play of the game: Is % the regular modulo operator?

User<5901725413>: FATAL ERROR: 'func' with version >= 0.2.0 executable is not found, is it installed and in path?  Please help

Asad: Hello everyone!  What does "Is inited" means in toncli? Is it necessary to be "true" for deployment?

Anton: Thats mean that code was not uploaded to blockchain. (reply to 15556)

Anton: I guess

Asad: so when I deploy smartcontract it will be "true"?

Asad: Got those errors, while trying to deploy smart contract.   I guess there is some problem with lite-client, but I don't know what exactly I need to do?

kirpi: hey there, could i create phone number as a simple user on TON network

play of the game:  Check `ptr && "deferencing null Ref"` failed what does this error mean guys?

Hacker Hills: Hello everyone, did someone see the contract by numbers with their eyes?

Diako: in tonweb, there is "cell.bits.writeBytes" function. but in ton libaray there not writeBytes function. what should i do ?

Diako: i use this, and i think it's work !  cell.bits.writeBuffer(Buffer.from(serializeUri(uri))); (reply to 15570)

— 2022-12-08 —

Bob: Is there any c# library or sdk for the ton network api calls?

Dev: I don't know of any but you might be able to use https://ironpython.net (reply to 15580)

User<5356691023>: How to create cell from text in ton-contract-executor? Should I use bocToCell()?

User<5901725413>: [ 1][t 1][2022-12-08 11:57:41.316944][lite-client.cpp:153][!testnode] liteserver error: [Error : 0 : cannot apply external message to current state : Failed to get account state] [ 1][t 1][2022-12-08 11:57:41.317123][lite-client.cpp:165][!testnode] fatal error executing command-line queries, skipping the rest

User<5901725413>: Hello, I get this error when deploying on testnet with toncli. Any ideas?

Anton: Do you find answer? (reply to 15264)

Andy: no

play of the game: What is the mod operator in funC? Like this: 13 modulo 5 = 3

play of the game: % gives me errors

doni: (int) math::mod (int x, int y) asm "MOD”;

doni: math::mod(int x, int y)

doni: this taken from tonoxDefi lib

play of the game: Ummm, Isn't there anything in stdlib? I just want to add two numbers then take modulo some prime :( But thanks! (reply to 15603)

doni: in general this means the the opcode MOD exists  wehter it is a part of stdlib or not is a differnet story ( i guess it should be but it doesnt)  and you can declare any opcode if you want

doni: to find out more data on the op code it self ,  i look at the big project

doni: https://github.com/ton-blockchain/ton/

doni: you can search the opcode itslef and find the cpp implemntaion

play of the game: Does the following code swap values of a and b? (Both ints) (a, b) = (b, a);

Step: is there any group for tonjs library related discussion?

Step: const { compileContract } = require("ton-compiler"); const fs = require("fs");       (async () => {                      let result = await compileContract({ files: ['counter.fc'], stdlib: true, version: 'latest' });             if (result.ok) {                 console.log(result.fift); // Compiled Fift assembler                 console.log(result.cell); // Compiled cell Buffer             } else {                 console.warn(result.logs); // Output logs             }         })();

N: I have a global variable  global slice expressionToParse;  why is   slice ca = expressionToParse;           cell cb = ca~load_ref();  compiable but  cell cb = expressionToParse~load_ref();  not?

N: Can anyone help me out?

Step: how to convert fift to cell/binary using ton-compiler library?

Narek: What do you mean?

Step: @Narek this code is giving fift output. how to convert to cell? (reply to 15613)

Narek: there should be “cell” field

Step: not there (reply to 15620)

Narek: >  console.log(result.cell); (reply to 15613)

Narek: this one

Step: https://github.com/ton-community/ton-compiler/blob/master/src/types.ts (reply to 15622)

Step: .output is cell?

Step: all tutorials and docs are outdated not sync with current version of library. 😫

Narek: hm

Narek: Could you try this one?  Should be OK  https://github.com/ton-community/func-js

Narek: looks like output is what you need

Narek: it’s a BOC

Step: it is what i need to deploy as smart contract? (reply to 15630)

Narek: It’s the code of your contract

Narek: You combine that with data and deploy to the network

Step: init data? (reply to 15634)

Narek: Yep

whiki /: How do I create my ton wallet address?

User<1787950895>: hi when i use' toncli deploy -n testnet' or any other commands recive this error can somone help me with this??

Un gars bien: Getting thesame issue 😞 (reply to 15639)

Dr. T: Looking for a strong recruiter within web3 that can scout for an ideal technical co-founder. The recruiter most have technical experience as well.  If that's you, please reach out.

Dani: Hey Guys, Two 2 questions:  1. Are there any working marketplaces for TON ? 2. Is there an example smart contract (ERC721 - NFT like) somewhere ? Thanks!

Coalus: 1. getgems.io/disintar.io 2. TEP62 (reply to 15653)

Dani: ah, funC will not be my fav.

Dani: 😄

Dani: veery diff to any i've seen so far, maybe except lip

Dani: lisp

User<2141498240>: Hello

Denis: why not look for an ideal cofounder straight away? 🙂 (reply to 15648)

Un gars bien: solved this ? (reply to 15639)

Eazy: Also looking for a savvy co-founder that will join me in a project i’m building on Ton Blockchain

Mark: funC support BLS?

Mark: or only ed25519?

Andrey: Only ed25519 (reply to 15671)

— 2022-12-09 —

해성: Hello, how to run full node? I have installed mytonctrl, but the status seems to be out of sync.

Tim: You need to start from dump (reply to 15679)

Tim: dump.ton.org

해성: thank you. I’ll try it (reply to 15681)

Kawakashi: hello guys I have a problem when run func in terminal what should I do (Sorry if it's stupid question, I'm a newbie)

ᅠ: go settings, secure, than u can find notification about it, u should  press "allow" or something like this

Kawakashi: ty bro

User<1787950895>: not yet (reply to 15667)

Dr. T: We obviously do as well, but get too many inquiries that aren't very serious for the size and technical scope of the project, when searching in chats like these. (reply to 15666)

Eazy: Depends on what you are building (reply to 15688)

Elshad: hey everyone. Who can check testnet? I think testnet is down!

play of the game: hi, I'm recently getting this error while using glitch to compile, I understand that I should define the FIFPATH variable, does anyone know the value I should put inside it?

Step: what does this error mean?  i tried to deploy counter.fc smart contract a tutorial by tal kol  it shows above error in transaction lookup.

𝔎𝔬𝔟𝔢 24 / 8: Hi guys , I wish to export FIFTPATH to the tonstarter  contract. How do we proceed pls

Denis: Do you have at least a short description of the role you're searching for? and the project (reply to 15688)

Denis: Same question for you, Sage (reply to 15668)

Eazy: Searching for a co founder with good knowledge about the ton blockchain, nodes and smart contracts (reply to 15702)

Denis: I don't think anyone would consider such a description seriously. It's like "I need a doctor with good knowledge about pills, tablets and capsules" 🙂 No offense, just trying to help. (reply to 15703)

Eazy: I need a cofounder that will be part of my team, someone technical with Ton Blockchain, Nodes and APIs (reply to 15704)

Step: co founders are busy in fragment auction (reply to 15707)

Eazy: The whole 630 developers online here are busy with fragment? (reply to 15708)

Step: here i need to scream like 10times to receive a reply on my help request.

Step: ton foundation has 630 devs? (reply to 15709)

Eazy: I’m not requesting for ton foundation developers, I’m looking for a dev here interested in joining our team (reply to 15711)

Step: main library has no documentation at all if even there something its outdated. (reply to 15710)

Cpperg: Are you looking for developers? (reply to 15711)

Elshad: set FIFTPATH environment variable before the compilation (reply to 15700)

fraffo: hello, how can i buy  a telegram nft number without using tonkeeper?

fraffo: i don't want to install a wallet on my phone, with the dns auction i can place bet with every wallet, just a comment is needed

Step: auction or for sale or random? which one you are trying to buy? (reply to 15724)

Step: i think only for sale number you can buy without tonkeeper.  random requires special payload message. (reply to 15725)

MysteryMan: Hello! I have now staked my TONCOIN coins and just started GPU mining too! :) But what this command does: eth_stratum_mode=nicehash

Step: can not do with ton js library? (reply to 15730)

Step: if anybody know please tell how do we send payload like this te6ccgECBQEAARoABLlGNyibmVnFmqheUamvMdfWIC7-uqFkFD0k2iA05HJ-CH_SamsTw3DDg_SPm_H2XhVftF0NTOQuxymeZQAdiFeKaJboAgAAAAxjk3taY5N78As4ODgwMjQ2MTU3M-ABAgMEAGIBaHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL251bWJlci84ODgwMjQ2MTU3My5qc29uAGuACBG0dlFtgMtLJ8IHIk03VVOL8ZXXgY07PhVXdWVTJK1qBDDiNACgQw4jQACgAAHCAAEnUBAASwAFAGSACBG0dlFtgMtLJ8IHIk03VVOL8ZXXgY07PhVXdWVTJK1wAEPADQI3rPgO9gUnvwzGpO45tZYhpv65B-VhYVPO8WySTv-0 in ton transaction using ton js library?

Step: ? (reply to 15732)

Step: Is this a dev chat or sleeping hall? 😴

doni: checkout toncenter wagger page and use sendboc endpoint (reply to 15732)

fraffo: The One that allows me to use any wallet (reply to 15725)

Step: payload has nothing to do with normal transaction? (reply to 15736)

Step: {"version":"0","body":{"type":"sign-raw-payload","params":{"valid_until":1670609904,"messages":[{"address":"EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N","amount":9000000000,"payload":"te6ccgECBQEAARoABLlGNyibmVnFmqheUamvMdfWIC7-uqFkFD0k2iA05HJ-CH_SamsTw3DDg_SPm_H2XhVftF0NTOQuxymeZQAdiFeKaJboAgAAAAxjk3taY5N78As4ODgwMjQ2MTU3M-ABAgMEAGIBaHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL251bWJlci84ODgwMjQ2MTU3My5qc29uAGuACBG0dlFtgMtLJ8IHIk03VVOL8ZXXgY07PhVXdWVTJK1qBDDiNACgQw4jQACgAAHCAAEnUBAASwAFAGSACBG0dlFtgMtLJ8IHIk03VVOL8ZXXgY07PhVXdWVTJK1wAEPADQI3rPgO9gUnvwzGpO45tZYhpv65B-VhYVPO8WySTv-0"}],"response_options":{"callback_url":"https:\/\/fragment.com\/tonkeeper\/rawResponse?id=BUkffmawEhmx2Uboh2NWuMiD&qr=1","broadcast":true},"expires_sec":1670609904}}  when tonkeeper scans qr code it gets this response from the fragment. (reply to 15736)

doni: yes  thats the boc fragment  genrates and sends to the tonkeepr wallet for signing

doni: the user signs the transaction in the wallet , and the wallet publishes the transaction

Step: i am looking at here https://github.com/tonkeeper/wallet/blob/main/src/core/ModalContainer/NFTOperations/NFTOperations.ts#L367 (reply to 15742)

Step: here no  stateInit ?  Ton.base64ToCell(message.stateInit), (reply to 15740)

Step: only documentation we have is, just looking at source codes.  🤣

— 2022-12-10 —

Ilja: Hey guys, is there a way to see how many username and number NFTs were created in total? I checked several explorer but couldnt find any numbers

King: I have the same problem  @Kash1988

neo: What is the best way to add logs in FunC for testing?

𝔎𝔬𝔟𝔢 24 / 8: Thanks,  please sorry for disturbing . How do we set the FIFTPATH environment ?? (reply to 15717)

𝔎𝔬𝔟𝔢 24 / 8: @mreagayev (reply to 15773)

Step: better to try ton-compiler? (reply to 15773)

Step: https://github.com/ton-community/ton-compiler (reply to 15775)

Step: if you are on windows  goto my computer » properties » advanced system settings » environment variables » new » variable name FIFTPATH variable value absolute path to folder that contains fift executable (reply to 15773)

𝔎𝔬𝔟𝔢 24 / 8: 👌🏾 (reply to 15777)

User<5774583816>: ♥️

Antoxa: Hello everyone, how do I get the coin rate according to the API?

Un gars bien: Hi! just viewed this and got some questions  about FunC dictionaries :  1) Can we indefinitely add key/value pairs to a dictionary ? If no what's the limit ?   2) Does FunC supports nesting  a dictionary in  a dictionary (like in Python) ? Something like :    dict test {     id1 : value1,     id2 : value2,     id3 :               id31 : value31,              id32 : value32,              id33 :                           id331:value331  }

Ilja: Is there anybody from fragment who could help with some questions about anonymous numbers?

Max: 1) your kv pair count would be limited by the key length. Say you choose key length 4 (bits) for your dict, that gives 2^4=16 possible keys, therefore 16 possible kv pairs  2) I guess so, since func dictionaries are represented by cells, and you can store cells in dictionaries (although I would probably recommend *_set_ref primitives for that, it might not be necessary however). However, I believe there is a 1024 cell depth limit, so be careful not to hit that. (reply to 15786)

— 2022-12-11 —

Md Zaan: Hi

Elshad: https://github.com/ton-defi-org/ton-binaries  from this source download the binaries which version is appropriate to your operating system and put them into the same folder (reply to 15773)

Elshad: and later download the zip file from this link: https://github.com/ton-defi-org/ton-binaries/releases/download/fiftlib/fiftlib.zip unarchive and put the extracted folder to somewhere. And now you can set FIFTPATH environment before the compilation. Just type in the terminal: export FIFTPATH=[path to your extracted folder] (reply to 15773)

Elshad: thats all

Coalus: P.S. this link a bit broken, current working link to fiftlib.zip - https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-18-0.3.0/fiftlib.zip (reply to 15817)

Антоп: Ребята привет, в каком формате лучше всего записывать курс в бд? Decimal , 10,2 или 11,6 Hi guys, in what format is it best to record the course in the database? Decimal , 10.2 or 11.6

Degen: If my jetton is listed on a TON Amm dex or coinmarketcap or Coingecko, will tonscan or any other Ton related explorer show the market data price of my token, just like etherscan or solscan? (forwarded from Degen)

Jérôme: Hi everyone, do you guys know if the supply informations here are accurate ? What does initiated supply mean ? Thanks a lot!

User<862437728>: Is it a coincidence that TON decided to engage with a least trusted auditor among global web3 community which is Certik?

Victor: Hey, we've launched a new multi-chain non-custodial wallet with TON support. We are still in early Beta with TON and some of the functionality, so happy for any feedback!  iOS https://apps.apple.com/us/app/ammer-wallet/id1599698329  Android https://play.google.com/store/apps/details?id=ammer.wallet

doni: Great news ! (reply to 15834)

Ammer Wallet: We are also starting to support TON along our entire infrastructure including Point of Sales app and web based payments.

doni: We met in singapore, and discussed about TON if you remeber ?  I happy to see you made progress on TON side

Ammer Wallet: Yes, rings a bell! (reply to 15837)

ᅠ: If your jetton is on TON, you can type me to list on toncap.net :) (reply to 15828)

Ammer Wallet: Your FunC T-Shirt is hard to forget! 😅 (reply to 15838)

User<5321317577>: When we're going to integrate Ton with Telegram and have a special feature to have profile pictures of NFTs we own similar to Twitter but just for Ton???

Ammer Wallet: On-chain p2p payments with TON. :)

altoshi: fabulous! Btw is it legal to pay with crypto? (reply to 15842)

Ammer Wallet: Depends on the jurisdiction. We are Swiss based, here and in the majority of the european countries it is fully legal. (reply to 15843)

Ammer Wallet: Actually we already have few merchants in Zug who are ready to accept TON as a means of payment :)

ᅠ: how to use nfc on ios? or is it closed function? (reply to 15842)

Ammer Wallet: iOS restricts its nfc usage unfortunately (reply to 15848)

Ammer Wallet: https://ec.europa.eu/commission/presscorner/detail/es/ip_22_2764

Ammer Wallet: But likely they will allow this in the near future: https://www.nfcw.com/2022/07/07/377870/european-parliament-passes-law-that-requires-apple-to-open-up-its-nfc-chip/

ᅠ: so, how to use card on ios? no date/cvv to online payments for example (reply to 15849)

Ammer Wallet: It’s not a credit card, it’s a noncustodial wallet. But we use the number as identifier for web payments etc. (reply to 15852)

ᅠ: ah, okay (reply to 15853)

Ammer Wallet: We are basically building a web3 payment network, to compete with with Visa / Mastercard. :) (reply to 15854)

ᅠ: it will be in future ? (reply to 15855)

Ammer Wallet: It looks like a regular credit card payment for a consumer, but it uses decentralized payment infrastructure under the hood

Ammer Wallet: We are already live in closed beta with several merchants in Switzerland. (reply to 15856)

Ammer Wallet: Dm @ammer_wallet_support if you want to be the part of the pilot.

ᅠ: im from another country :) (reply to 15860)

Ammer Wallet: You can also check out our noncustodial merchant app (Android now, iOS is coming) https://play.google.com/store/apps/details?id=ammer.pay

Degen: Yes, this is what I was talking about, very interesting project (reply to 15839)

Degen: I like TON Blockchain because it's connect to telegram, in the coming years, we are going to see all various kinds of applications build on TON

Degen: It will be interesting

Degen: Because TON is not like the outdated common programming language, AKA Solidity (EVM)

Degen: In the future, I guess, we won't need to download wallet to interact with Defi, everything will be done on the telegram app

Degen: Thing like Yearn farming, liquidity mining, collateralized Dept Position

Degen: Well I'm looking to what the future holds for the Telegram Open Network, the corrupt US SEC Government, wanted to stop this innovation, but the Blockchain win

Degen: You can stop the Blockchain, because the founding fathers know that the Government were coming for it, so they scheme a mechanism that will make it harder for them to break

Degen: I'm looking forward to buying and selling a jetton on telegram, without leaving the app, it will be nice doing that slimlessly

Cpperg: How are you doing exchange to fiat? Or are you doing it (reply to 15853)

Cpperg: Or is it ton to ton transaction

Ammer Wallet: It’s ton-ton, but we can offer exchange to fiat through our swiss regulated entity after kyc etc. or the user / merchant can use any of existing providers and exchanges. (reply to 15878)

Cpperg: But lets say I want to take ur payment getway and use in Dubai

Cpperg: Can I get it and make it work from ton to fiay?

Cpperg: Fiat

Ammer Wallet: Sure, you will have to onboard with our swiss entity and we can then process fiat to your bank account. Your can dm @ammer_wallet_support for more details.

Cpperg: Thanks I will make sure to dm for more info

Nikita: https://minter.ton.org/ (reply to 15892)

mr.: 🤝 (reply to 15893)

mr.: Подскажите пожалуйста, я подготавливал проект на троне, но решил перейти на ТОН, там писал код токена и все характеристики, на TON тоже нужно писать или он автоматом все сделает? В частности хотелось бы добавить PoS, minting, burning и распределение реферальных вознаграждений. Как можно осуществить такие функции? Делаю один без программиста и программистом не являюсь, если есть пошаговые инструкции, киньте в меня ими, пожалуйста.🙏 (reply to 15893)

Nikita: Please keep english  By this service you could manully minting, burning and send jettons, for example here: https://github.com/ton-blockchain/minter/pull/132#issuecomment-1322190364  to do more complex things, you propaly have to build service (reply to 15895)

mr.: Thank you! (reply to 15898)

Daniil: This chat is for development related questions. Not a place for your usernames promotion

User<5275582914>: I wish had those username. (reply to 15910)

Я: ubuntu 22.04  toncli error ERROR: [Errno 13] Permission denied: '/home/fera/Загрузки/ton/func'

— 2022-12-12 —

Andy: try chmod +x /home/fera/Загрузки/ton/func (reply to 15913)

Zeeta: Hello how are you, any admins, I wanted to ask you a question!

Daniil: ? (reply to 15917)

User<5846774480>: Can someone help me: thrown: "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state"

影: what is it? Where can I get it

Nano: Hi!

Nano: I have a question

Nano: How can I use a smart contract that allows you to make a payment with another person (P2P), but that the funds are not deposited until both parties have paid?

•⚜️• 𝐀𝟏𝐞𝐤𝐬𝐚𝐫𝐭 •⚜️•: Hi Guys i find a programmer who can make a contract from another network to TON network  Good money

Сергей: dton.io how to connect testnet

Сергей: maybe there is a blockchain event listener?

Сергей: need to catch transactions with payment and change the owner of nft

Ammer News: By the way, we are also looking for engineers to join our team. Frontend / Backend / Mobile / DevOps / SRE. Here is one of our open positions: https://docs.google.com/document/d/1MA6czSH7F0L2B0h8SGvK52ojy5Z5axLI69TxqcVb9QM/edit?usp=sharing

Step: * Starting on December 13 at 12PM UTC, the price of random numbers will increase by 1 every 3 hours until it reaches 99, at which point they will be removed from sale.  does this mean after december 13, we can not buy any number for 9 ton? only the number which have been bought till that date will be available for re-sale/auction?

Bobyloong: hey guyz, anyone heard of whiteswap dex? can u recommend?

Bobyloong: they are having a quiz now and i wonder if anyone had deal with them?

😀: message me ;) (reply to 15934)

Lillpump: yes, its. a new dex, but stable i quess made several swaps already and satisfied (reply to 15946)

Я: Thanks!However, now there is a problem with the fivt...If you know what the mistake is.Please tell me (reply to 15923)

Luke: I'm confused about how this line works. It says it loads an unsigned n-bit number, where n=64 in this case. But how do you know you are loading the variable total? Like why cant it be any other 64 bit number, or rather how does it even know what specific bits you are trying to load?

Slava: Each load* operation reads next n-bits from the bit-string and removes them. So you need to consecutively apply these operations based on the TL-B schema of your binary data. (reply to 15982)

— 2022-12-13 —

Diako: in my website, users enter their own wallet address How do I check that the address is correct ? ( with tonweb and ton library )

Tim: It depends on which wallet they use. If extension - you ask to sign random payload, if tonhub/tonkeeper - you use their auth flow (reply to 15991)

Diako: no, i have string of public key, and i want to check the public key is correct or not ? (reply to 15992)

Tim: Tonweb address has isValid function

Tim: But usually you want to check that user really have access to that address

Andy: You have to specify the path to the fift interpreter (reply to 15972)

User<1787950895>: hi when i generate wallet using 'tonweb' javascript and send testnet toncoin to address  address automate return toncoin to sender??

Diako: do you have example code for auth flow of tonhub/tonkeeper ? (reply to 15995)

Tim: Ton-x for tonhub

Tim: https://github.com/tonkeeper/ton-connect for tonkeeper

Alex: As I understand in a several days it could be https://github.com/ton-connect for both. Isn’t it? (reply to 16001)

Tim: Not sure about days, but probably yes.

Step: is there any replacement for toncenter api?

Tim: Use your own, use adnl directly

Step: i dont have big server to run big node. 🥹 (reply to 16005)

Tim: You don't need server to use adnl

Andy: interesting

Step: what will happen if set sendmode = 128 when transferring nft ownership?

Siger: Hi devs! I was redirected here from the community chat. I accidentally sent the wrong amount of ton to the bsc bridge. I figured out there is a recovery parameter on the bridge which I set to true. But now I'm unsure what to fill out in the amount field. Should it be the amount I actually sent from my wallet? Or the amount that was received by the recipient (with deduction of fees)? Thanks a TON in advance! 😀

Vae: Hey, any way to  buy from fragment automatically by executing smart contract function or it's impossible due to unique payload?

Step: What you want to buy? Number or username? (reply to 16014)

Vae: Anonymous number, but not manually (reply to 16015)

Step: Random? (reply to 16016)

Vae: yep (reply to 16017)

Step: It has very stricter payload

Vae: So is it impossible to simulate it and make it automatical in any way? 🤔 (reply to 16019)

Step: it's upto your scripting skill 🤪 (reply to 16020)

Vae: Anyone have it already implemented? 🤔 I'd rather pay for that

Slava: @ton_help_bot (reply to 16012)

User<5846774480>: anyone (reply to 15926)

F: @cosmicgun, reformulate your message without advertising third-party services

Андрей: It looks like you don't have a smart contract deployed (reply to 15926)

cosmicgun: In some play bot, devs implement generating TON wallets, if i correctly understand this process, in them bot, but i cannot find any information how i can implement it in my project. Maybe somebody knows?

Андрей: You should specify in what language you write. There are libraries for working with TON, where there are functions for creating wallets. For example here is a library for golang: github.com/xssnick/tonutils-go (reply to 16029)

cosmicgun: C# (reply to 16030)

Андрей: I have not yet seen ready-made libraries for this language. I heard that someone was trying to start writing a library for this language. Perhaps it will be more convenient for you to communicate in another language (judging by your dual message in Russian) @tondev (reply to 16032)

cosmicgun: wow, thx. Yeap for c# i couldn't find it either (reply to 16033)

cosmicgun: if I understood correctly i can interact with HTTP req to TON Blockchain, without any library? (reply to 16033)

&rey: Creating wallet consists of three steps: 1. Generating mnemonic (generally 24 words, but really this can be a random string) 2. Calculating key pair from mnemonic (I haven't searched this in C# but almost sure there is something similar to tweetNacl) 3. Calculating contract address from public key (this requires TON-specific code for building cells and so on). This has to be implemented. (reply to 16034)

&rey: Then, to get balance you can just send HTTP request to toncenter (that's not TON Blockchain however it returns actual data about it, at least now). If you need to send message from wallet then you'll have to create signed message, serialize it in BOC format (requires TON-specific code again) and send it to network, maybe through toncenter's method sendBoc. (reply to 16034)

&rey: A kind of workaround: execute subprogram written in another language that has libraries for working with TON. (reply to 16034)

Sloth: Hello, I failed to build the ton proxy image. My docker compose version is v2.12.2. How to deal with it? Sorry, I am new at this. (reply to 12135)

Ruslan: Hello, looks like you have very old cpu. Could you please send information about your ram and cpu? (reply to 16039)

cosmicgun: moment pls (reply to 16038)

Sloth: I ran it on a VPS of banwagan. The cpu model name: QEMU Virtual CPU version (cpu64-rhel6) (reply to 16040)

Sloth: processor  : 0 vendor_id  : GenuineIntel cpu family  : 6 model    : 13 model name  : QEMU Virtual CPU version (cpu64-rhel6) stepping  : 3 microcode  : 0x1 cpu MHz    : 2399.990 cache size  : 16384 KB physical id  : 0 siblings  : 2 core id    : 0 cpu cores  : 2 apicid    : 0 initial apicid  : 0 fpu    : yes fpu_exception  : yes cpuid level  : 13 wp    : yes flags    : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm rep_good nopl xtopology cpuid tsc_known_freq pni pclmulqdq ssse3 cx16 pcid sse4_1 sse4_2 x2apic popcnt aes xsave avx f16c rdrand hypervisor lahf_lm pti fsgsbase smep xsaveopt bugs    : cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit bogomips  : 4799.98 clflush size  : 64 cache_alignment  : 64 address sizes  : 46 bits physical, 48 bits virtual power management:  processor  : 1 vendor_id  : GenuineIntel cpu family  : 6 model    : 13 model name  : QEMU Virtual CPU version (cpu64-rhel6) stepping  : 3 microcode  : 0x1 cpu MHz    : 2399.990 cache size  : 16384 KB physical id  : 0 siblings  : 2 core id    : 1 cpu cores  : 2 apicid    : 1 initial apicid  : 1 fpu    : yes fpu_exception  : yes cpuid level  : 13 wp    : yes flags    : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm rep_good nopl xtopology cpuid tsc_known_freq pni pclmulqdq ssse3 cx16 pcid sse4_1 sse4_2 x2apic popcnt aes xsave avx f16c rdrand hypervisor lahf_lm pti fsgsbase smep xsaveopt bugs    : cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit bogomips  : 4799.98 clflush size  : 64 cache_alignment  : 64 address sizes  : 46 bits physical, 48 bits virtual power management: (reply to 16040)

cosmicgun: In one game they implement 2 type of wallets. One with ingame currency and one with TON. Ton wallet looks like simple wallet but it havent any things like 24 words etc. Just number, but i think i understood how it works (reply to 16038)

Sloth: RAM: 1024 MB (reply to 16040)

Ruslan: He, okay. The problem should be in army virtualisation. Currently I have no solution, can you please DM me to keep in touch? (reply to 16043)

User<470063563>: who is the best person to reach about stucked PR ? https://github.com/ton-blockchain/ton/pull/541

Lyudmila: Hi! I have an lite-client question. What's wrong with the -c param? I can't send the command with the space with it. Lite-client see only first word

Я: if you meant the fift binary file, then I prescribed a path to it.If it's something else, then I'm sorry, but I didn't understand. (reply to 15996)

User<5736167366>: I don't understand the platform, what does it do?

&rey: Can you execute that binary from command line? If it fails to boot, toncli can misinterpret this as lack of fift. (reply to 16052)

Я: Excuse me, but how to launch it?I'm on Linux for the second day and I don't understand a lot (reply to 16055)

&rey: Either this way: cd /home/fera/ton  fift -V (reply to 16056)

&rey: Or this: /home/fera/ton/fift -V (reply to 16056)

Я: thx

&rey: If everything is normal, fift should output its version. If it doesn't, then it may mean that your processor/system is outdated or something similar.

Я: he told me; Invalid instruction (memory stack flushed to disk) (reply to 16060)

&rey: So you'll either need to recompile fift by yourself (sorry, but I can't give any guidance here) or upgrade computer configuration so it supports new instructions. (reply to 16061)

Я: thx

Step: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state how to solve this problem? it happens when we initiate another transaction just after doing a transaction.  is it because of seqno ?

&rey: Yes, it is related to seqno. The external message doesn't get processed immediately at the moment it's sent - instead, lite-servers will see update approximately in 30-45 seconds. This leads to two problems: 1. seqno is not updated, and second external message uses the same number so by the time second external message gets processed, seqno gets different, and the message is rejected; 2. attempt to increment seqno client-side and send second message also fails, because blockchain nodes precheck external messages before including them into set of suggested messages (and thus before finally executing transaction and including it into chain), and at that moment seqno check fails. (reply to 16064)

Luke: Is there a convenient way to deal with and load strings

Step: this error is annoying making the application not function correctly. Is there any way we can avoid it? (reply to 16069)

&rey: Two obvious choices I can see: 1. Use highload wallet; 2. Wait 15-20 seconds before sending next message (usually works, but it's better to do retry loop here). (reply to 16076)

Step: For retry we must re-fetch seqno or just call transfer function again?

&rey: Refetching seqno (or balance, it requires less computational resources as doesn't need to start TVM) is better. (reply to 16078)

Sudo: Is there a full node desctop wallet for Ton?

.: Hi (reply to 16093)

Alex: I'm not sure what do you mean, perhaps this will be usefull for you. (reply to 16094)

Dario: There is mylocalton, for testing (reply to 16094)

Dario: If you want a full node to not trust other nodes like in bitcoin, in ton there is no need to. As long you are doing all cryptographic stuff in your machine (using lite-client, for example) you will be fine.

Sudo: Is there desktop app for Ton? Not mobile one but desktop? (reply to 16098)

Dario: yeah ton wallet has a desktop version

Sudo: Is that the one which opens in the browser as a new tab? (reply to 16108)

Dario: https://github.com/ton-blockchain/wallet-desktop/releases/tag/v0.9.8 (reply to 16109)

Dario: If you need a desktop wallet, i think this is the only one out there. Sadly looks like abandoned and unmaintained, im not sure how safe it is.

Sudo: What is the issue with making good desktop wallet?

Dario: I think there is no one interested in building it. Once HW wallets supports came out, desktop would be basically useless

Sudo: Where i can learn about HW wallets? (reply to 16116)

— 2022-12-14 —

Tim: Why desktop wallet can't work with hw wallet? (reply to 16116)

Sudo: Why every respectful blockchain has wallets for major platforms and TonCoin doesn’t?

1488: @corbendallas777 pm me bro (reply to 5711)

Luke: im looking at the 1st ton hack challenge, but i am confused

Luke: () execute (cell) impure asm "c5 POPCTR";

Luke: what does this line do exaclty

Mark: Will ton support other elliptic curve algorithms besides ed25519?

Behrang: Puts the cell arg to c5 register, which is the register that contains the result actions of the executed smart contract.   Effectively, you can fill it to add some output actions to it and send yourself the money locked in the contract. (reply to 16125)

Luke: thx, I have another question if you dont mind. How does this fift code send a request because from what I've read from the documentation, this only seems to output the cell into a file? How does one actually send it to the wallet (reply to 16133)

Behrang: This script creates an external message ready to be sent to the TON blockchain. You have to then send it manually. For example you can use lite-client to send this file to the network. (reply to 16134)

User<5846774480>: can someone send me test faucet? EQDlroI_Op8wcPy5yyFfFLTYkLI1IP-Qy__tOjYlzFo-ePT6

Андрей: @testgiver_ton_bot (reply to 16137)

Step: can anybody tell me what is the role  of response Address  in nft item transfer?   https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-item.fc#L70

Step: 😫 (reply to 16144)

Step: why we have response address when we already have owner address? anybody please explain. (reply to 16144)

Max: Response address is where unused coins after transfer of nft will go (reply to 16147)

Step: thanks 🙏  if we dont input response address , unused coins will remain with  nft item owner? (reply to 16148)

Tim: with nft

Step: 🤔 nft item address or nft item owner address ? (reply to 16150)

Max: On the nft item

Max: Owner will get coins according to forward_* params

Tony | TokenPocket: I see the coin type of TON was registered as 607 at https://github.com/satoshilabs/slips/blob/master/slip-0044.md. Is it the same coin? (reply to 15038)

Rinat | ZilPay (Will not Call or DM you): yes i saw (reply to 16157)

Bart: hi, how i can generate ton address via python? from seed phrase

Maxim: Hi, I'd like to know more about TON Storage.  How can I get additional info? Any chats, documentation

Parsa: Hi there I have a problem I'm on testnet and When i perform a transfer to an address, it will back to my address  For ex I transfer 1TON  It will return 0.99 TON back to my sender address  I must use an specific sendMode or what's my problem?  I use python TONSDK

&rey: You have to use non-bounceable destination address: sendMode doesn't affect bouncing of messages that were sent successfully. (reply to 16186)

Step: convert your address to non bounceable  Address.toString(true,true,false) (reply to 16186)

Parsa: Thanks 🙏

Step: read here https://github.com/toncenter/tonweb/tree/master/src/utils  if you are using tonweb. (reply to 16188)

Step: i am in read only mode in ton dev russian gp. please somebody release me i dont know what lead to that action. 😏

doni: https://ton.org/address/ (reply to 16188)

Step: he probably want to do it programmatically 🙂 (reply to 16192)

doni: so you need to turn the bounce bit on on the message (reply to 16186)

doni: I see in this package there is an equivlanant (reply to 16188)

doni: wallet.address.to_string(True, True, True)

Javier: Hello. One question.  One validator can withdraw ~270 $TON by day if him want, right?

Dario: News  - Updated log2 with a better version (thanks @Gusarich!) - Added messages.func lib that provides easy functions to craft messages. It doesn't cover everything but should be enough in most cases.  https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages (forwarded from Dario Tarantini (ex Tonox))

Luke: I am trying to use the glitch online ide but it isn't generating the compiled json

Luke: Does anyone know how to fix

Malivix: Hey I’m trying to understand ton project code So I want to know about adnl and rdnl Documents are not completed I think about low levels  only talked about ideas   Also I think in code adnl using tcp in many sdk (ex goton) and in documents focused on udp  I’m confused because each sdk have different approach  Also codebase in c++ is not very easy to read for me but it’s ok  I want to know adnl is based on tcp or udp? Is adnl only abstraction and should write other implementations like rdnl? Or adnl is possible be used alone?  Sorry if my question is ridiculous I’m started today about reading code 😅

Slava: Actually, that's a very good question. Maybe @xssnik will find a time to answer it? (reply to 16226)

Malivix: I’m trying to write lib for ton in rust lang🤔 So I have many other questions but for this step these are the important ones 😅 (reply to 16228)

Andrey: Have you checked whitepaper? https://ton.org/ton.pdf (reply to 16226)

Andrey: Adnl could be over UDP or over TCP

Malivix: Yes Because of that I’m confused  In white paper focus is udp for adnl In official doc udp is TBD and focused on tcp In existing sdk those libs that writes network layer in native they’re using tcp and using andl  Others are porting clib for andl or tonapi (reply to 16230)

Andrey: The best source I know is c++ source code, I guess docs for UDP is not ready yet thats why it’s in TBD status.   Also you can look into Everscale sources in some cases they uses exact same protocols as TON: https://github.com/broxus/everscale-network (reply to 16232)

Malivix: Thanks for your recommendation  I will look on this repo too 😊 (reply to 16233)

Memphis: Hi Everyone! I'm Marcin from Poland. New Here. It's nice to see such a crowd here. What are you up to? Marcin

cvxv666: Good evening friends Tell me, suddenly one of you came across, im bought numbers on a fragment, and for one number the payment was deducted twice, naturally only one number came, and 13 TON were not returned to the balance. Here are the transactions and the address of the number itself in the blockchain, it now has my 13 TON on its balance sheet. Maybe someone knows how to return these TON now. My address EQDdgjjGy7t41K8JHfQ0VbLEHf9W0rkJuHehGGLOZX2QH7mF https://tonapi.io/account/EQBOYrtKxy6qNSoucWceflV7TgL6wuANMkj7sWtM4Mixn0nr https://tonapi.io/transaction/8bfc99347b769a37834de318e12d00740c15e07e0f804dfabc4faa3bd92d016d https://tonapi.io/transaction/65a4c86ebf655cfaa84c84a86f999304fbe357d91e441c58e6de7290d537ea3c

√Punk: Hi Does ton have atomic composeability?

— 2022-12-15 —

Jérôme: Hi everyone, do you guys have any experience configuring Tonkeeper with locked up coins ? looking for some help to setup the config file

Step: what you mean by config file? (reply to 16262)

Oleg: Hey,  ADNL has 2 types: TCP and UDP, TCP is used only for communication with liteserver (node API), UDP is used on internal level for communication between nodes.   Other protocols like DHT and RLDP are based on ADNL UDP and ADNL can be used alone also.  I have implementation of both ADNLs, RLDP and DHT in tonutils-go, you can check the code here, I think it should be easier to read than c++ 🙂   Also you can read documentation about internals, with examples. It is in russian, but google translate should help 🙂 (reply to 16226)

&rey: I've submitted a TEP, and it seems it got stuck a bit. Is that OK? The proposal is deterministic subwallets - generating different key pairs from a single mnemonic (24 words combination) to disallow tracking different wallets to belong to a single owner. https://github.com/ton-blockchain/TEPs/pull/101

Anthony: Is tvm under development?

User<5823987480>: Good to be here

Daniil: It's complete already. And may be updated in future (reply to 16274)

Monk 🥷 🐾: The venture funding, is it a must to submit an MVP demo link for preseed?

Malivix: Thanks man  I will check the doc But you answered the main question 😁 (reply to 16268)

Andrey: The doc is awesome (reply to 16268)

Tony | TokenPocket: Hi, is there a explorer for testnet?

Obsidian: Hello Ton Dev! Have you guys consider to put Toncoin in Crypto.com please. I am from Singapore and it's difficult to buy TonCon from here

User<5846774480>: Hello Team, What Algorithm TON blockchain is using? is it EDDSA?

Абубакр Хамидов Ёлкинович: Hi

Vardan: Hi Ton Dev community, I would like to ask, are their WordPress/WooCommerce plugin which support ton coin?

Degen: Buy it in Uniswap or Pancakeswap (reply to 16296)

Daniil: What's your wallet address? (reply to 16329)

majed.eth: i'll dm you (reply to 16330)

Malivix: In c++ implementation  ExtClient , ExtServer ,…  Is for litenode? It’s seems for lite API ton used these  And I have a specific question about Actor module  Do we have documentation about Actor implementation? Because I’m swimming in code and many things happened by actor so I’m trying to understand actor module 😅 (reply to 16268)

Антоп: TON QR Coder – can I train? For example, I entered the amount, 100 ton, into the imput field, clicked pay and a QR Coder was generated and exited. Link the payment to the wallet, to the QR Coder wallet for payment and the amount.

Mike: Hi guys, is there any news about the gas-fees on the blockchain?

Slava: This chat is for engineering question only. Please abstain from asking auction/Fragment related questions.

zzss: Hello everyone. Can you help me. Is it possible sell and buy Fragment phone numbers via api?

Howard: any smart contract code in example can learn?

Behrang: There are 2 sites that I know of:  - https://testnet.tonscan.org/  - https://testnet.ton.cx/ (reply to 16288)

User<5021395935>: How to transfer From ton wallet?

User<5021395935>: Pls?? (reply to 16362)

Oleg: Ext is about adnl tcp, yes  Not sure about actor docs, but it is like a wrap for entities, which can manage async events and can be destroyed, as i remember (reply to 16334)

Andrey: Today we have launched https://testnet.dton.io/ 💻 (reply to 16360)

User<2026514330>: Hello, Back in Sept I lost over 300 Toncoin using the Ton Eth Bridge. Can someone help me here to recover this lost transaction?

User<2026514330>: I have the wallet address's to look into and hopefully we can find it on block explorer

Slava: @ton_help_bot (reply to 16370)

Slava: Jarrod please use the support bot. This is not the place for TON bridge support.

🇷🇺 Angry: Hi there!

Luke: How do you print varaibles

Coalus: ~dump(smt); (reply to 16436)

Hamidreza: On the toncli build of the ton tools, it raises an error as an unknown function 🤔 (reply to 16437)

Howard: is there place like Ganache for local testnet testing?

Luke: Im trying to download fiftlib.zip, but it says "Not Found". Is there a new link

— 2022-12-16 —

Luke: does anyone have a good tutorial on lite-client

User<1783915887>: hi,I am a  ambassador and marketer, with two years of experience in marketing and guidance and moderator, in Telegram, conditions for I can create a local association. What is your opinion, who should I talk to?

Luke: how do you give input with ton-contract-executor in js, because it says stackInt is undefined

Ama ✨ lux8.net: Is there a dedicated group for ton Validators?

Howard: Hi, how to move and put extension wallet to test net? (reply to 16360)

Behrang: If you want to use the TON Wallet browser extension on the testnet, go to its menu, then "About", and then Shift+click on the version string. (reply to 16464)

Howard: oh!!!!! Thanks a lot (reply to 16466)

Howard: just deployed the contract, can you give me some testnet TON?

Behrang: Use this bot:  https://t.me/testgiver_ton_bot  I checked it now, and its working.

Howard: So in TVM, I still can send the Tx to deploy the contract even tho I don't have any TON to pay the gas?  But the tx is never get executed, until I have the TON in my Wallet(contract)? (reply to 16469)

Behrang: When you create a wallet (or any other smart contract) for the first time, you'll given the potential address of it on the network, but nothing is deployed yet. To deploy it, you have to first increase the balance of this address, by sending some TON to it (using a non-bounceable tx, so it doesn't return back to the sender, because there is nothing there yet). Then, after the address has some balance of TON, you can finally deploy it on the network which consumes the TON on that address to get deployed.

Tim: it can, it has another app called sandbox (reply to 16473)

Howard: OK, found. https://developers.tonhub.com/docs/sandbox https://apps.apple.com/app/ton-development-wallet/id1607857373 (reply to 16475)

User<5021395935>: How to withdraw this pls?? (reply to 16470)

Behrang: Send /get command to the bot, it asks for your address, and then sends you 2 TON on the testnet.

User<5021395935>: Yes how to withdraw the ton coin in the testnet?

Howard: I don't know why TonHub can't support me paste the wallet address in recipent

Behrang: This is not TonHub. This is TON Wallet.

User<5021395935>: ?

♚ 𝑴𝛂𝒉𝒅𝒊: Hello I bought number in https://foxtails.io/gallery but I didn't receive number NFT, What is "Contract Deploy"?

Howard: they supposedly can connect right? (reply to 16483)

Behrang: Sorry, I haven't worked with it, and I can't help here. (reply to 16488)

&rey: I think you can ignore "parse transfer URL error" as for me wallet can transfer money even if this error is present. (reply to 16482)

Noah: is there a useful resource for beginner?

Roman: https://ton.org/dev (reply to 16496)

Diako: How can i verify my project on ton.app ?  @tonpartisan  https://ton.app/nft/tonpartisan

Hartmann D.: Please find the contacts at their web site and submit your product. (reply to 16507)

Liza: Hey guys! Mark, Daniil and I are preparing an online course on programming for TON in FunC smart-contract language.   Course Outline includes both FunC programming as long as basics of building Web 3 apps (dAPP, TWA).   We would really appreciate your feedback, as your experience could guide us towards creating the best course possible.  Here is a form with list of questions. We are collecting responses by December 22 (Thursday)

zzss: Hi guys. I have a question about the one part of code from this library  https://github.com/toncenter/tonweb  For which purposes this part of code, guys?

Reynold: Hi devs. I need help with minting an NFT collection. I have all the attributes (layers) rednered but i still need to render full collection and mint it with all the attributes. I assume this work can be done easily with ton-cli (https://github.com/disintar/toncli/tree/v0.0.4) but I still need help. I can pay for work with royalties from collection or other ways (discuss in dm) DM me if you are interested. Thanks in advance)

r4mze5: hi guys, how do you deploy data of transaction? Need using BOC?

Chun Hsin: Hi everyone,   I'm trying to setup a archival node following this instruction: http://anode2.ton.swisscops.com/ but I'm not getting luck on the username:password for the dump files, been asking for access in tg chat for few days.  My question is, is the dump files necessary for running an archival node? or is it just for speeding up the syncing? if it's necessary, is there any place I can have acess to other dump files? Any help would be apprciated, thansk!

User<1238695930>: Hello

Zeeta: Hello, how are you? I sent you an association email a few days ago and I have no answers. Could you tell me who I can talk to? (reply to 16516)

— 2022-12-17 —

User<5858985737>: Hi

Behrang: To talk to smart contracts on the TON network, you have to use the Cell data structure. You have to write it bit by bit (not bytes) and create it. To send it to the network you have gather all cells together in a BOC (Bag Of Cells) format. (reply to 16523)

Elshad: hello guys. Who knows how to convert address to slice in func? I want to set custom address in cell but first of all I have to convert string wallet address to slice somehow. I don't know how

Andrey: .store_slice("Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a)   ;) (reply to 16584)

Elshad: thanks a lot ) (reply to 16586)

User<5461650450>: Hi, have a quick question.  What is certificate for ton used for? What is certificate for ? How can we get it ?

Диёрыч: I have a problem with installation fift on MacOS:  I took compilled binary from gitbhub and placed it in /usr/local/bin with "chmod +x fift" . I don't get fift version but see commit. Could anybody help me with this? :)

Reynold: Hi guys. Do you know where to find docs about minting NFT collection + minting multiply items in this collection

Никита: Hi! How can I find out the cost of NFT at its address? On tonapi.io there is a method "/v1/nft/GetItems" which, according to the documentation, should additionally add the key of the "sale" object, but it does not do this. NFT is definitely on sale.

Mark Okhman on TON: is this config not working anymore? https://ton-blockchain.github.io/testnet-global.config.json

Mark Okhman on TON: where can i get a working one?

zzss: Do anyone have experience with buying Fragment numbers via api? I have few questions and ready to pay few TON coins

Morning Person: gm - gn everyone.

Yuri: Hey guys, I'm getting this error when trying to compile func to fift:

Yuri: Seems to be something with comments

Mikel: Hello, have anybody built ton on ubuntu 21+?

Mikel: I have 21.10 and got errors on compile

shahar: I’ve built func and fift on 22.04 successfuly (reply to 16623)

Mikel: without any problems with libssl-dev? (reply to 16625)

Ruslan: Could you please provide more info about errors?) (reply to 16624)

shahar: Yes. Where did you get the list of dependencies to install? (reply to 16626)

Mikel: something like that (reply to 16627)

Mikel: I just moved through instructions here - https://github.com/ton-defi-org/ton-binaries, and had problems with install this lib, so i found workaround to install it (reply to 16628)

Ruslan: sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf wget git curl libreadline-dev ccache libmicrohttpd-dev

Ruslan: Try to install this libraries and perform clean build

Ruslan: Build command: export CC=clang export CXX=clang++ cmake -DCMAKE_BUILD_TYPE=Release .. && cmake --build . -j$(nproc)

Zeeta: Hello, how are you? Who can I contact for association issues? (reply to 16627)

Zeeta: I sent an email, but no response

Zeeta: I can send you a DM (reply to 16635)

Mikel: I have error when try to install clang (reply to 16634)

Mikel: libc6-i386 : Depends: libc6 (= 2.31-0ubuntu9.9) but 2.34-0ubuntu3.2 is to be installed

shahar: You would have succeeded with ubuntu18.  There’s a security flaw in libssl-dev which is why it’s not offered on ubuntu20+.   I think the library you should be installing instead is called libssl-1.0.   I can check that for you a bit later though. (reply to 16631)

Ruslan: sudo apt update? (reply to 16640)

Ruslan: Looks like repositories info not updated

Ruslan: I've tried to launch docker with ubuntu21.10 and it fails

Mikel: Yes, here problem with libcrypto-1.0.0, i got libssl-dev, but on ubuntu 19 they update to libcrypto-1.1, so compiler fails (reply to 16644)

Mikel: I start to think I need VM for this))

Ruslan: It can be built with libssl-dev version 3

Ruslan: Or a docker. It would be even better) (reply to 16649)

Slava: Please contact the @ton_help_bot and stop bugging people in the chat. Thank you. (reply to 16637)

Zeeta: oh how rude you are, I thought they were professionals (reply to 16653)

Mikel: Thank you, I decided to install it on mac for the first)) (reply to 16650)

Ruslan: If you decide to use Docker, check the repo: https://github.com/kdimentionaltree/ton-builder (reply to 16656)

Howard: okok (reply to 16493)

Howard: same smae (reply to 16603)

Ruslan: Please, visit @ton_help_bot. This chat is for development questions. (reply to 16678)

𝕖𝕊𝕒𝕓𝕚𝕥: Hey 👋🏻 is there a list or summary with different projects/bots/stores/games utilizing the ton wallet integrated in telegram?

— 2022-12-18 —

Howard: hi where can check daily active Txs on TON?

Yuri: Someone, any clue? I downloaded again the binaries and still getting the same problem (reply to 16617)

Howard: can't understand this part lol  Using docker to code FunC is a disaster if you are using M1 Mac.....

Andrey: Why? (reply to 16712)

Andrey: dton.io (reply to 16708)

Howard: which means every time I want to run the code need have to run by Docker? (reply to 16713)

Howard: those commend lines is not quite convenient. I would rather use Tact tho. https://t.me/tactlang

Andrey: You can compile sources for toncli locally, it’s not that hard. But we working on crossplatform information for package managers, soon you will be able to do brew install ton and use it in toncli. (reply to 16715)

Howard: yeh, totally (reply to 16717)

Howard: that would be great!

Andrey: It’s currnetly not working and freezing. If Tonkeeper or Tonhub team will create working version of tact we will support it in toncli. (reply to 16716)

Howard: I tried to deploy the contract, but then I can't test it out locally or send TON properly to minitor the tx or do the next step. Like Ganache, or localhost like hardhat... (reply to 16712)

Howard: understood. any TBD for local Func for M1 mac support? (reply to 16720)

Andrey: Try local test engine: https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md  There are many examples of good local tests in default projects like toncli start nft_collection (reply to 16721)

Howard: oh, but I can't run  toncli  locally, right? (M1 chips) (reply to 16725)

Andrey: The easiest way is to use docker, or you need to compile TON from sources (reply to 16726)

Andrey: In docker you just mount local directory with projet & config, and it’s running toncli on those project

Howard: 😵‍💫 yes, I follow the tutorial for docker there. Can't find the files in /local/ tho, since I think I deploy successfully tho? (reply to 16727)

Malivix: I think if you reading next paragraph it’s clear  It’s not in /local/ It’s depends on what path you sent to docker for binding as config folder (reply to 16729)

Malivix: About toncli I compiled all of ton project with M1 I didn’t get any issues  There isn’t very clear doc, I agree  But for M1 build you can check https://github.com/ton-blockchain/ton/blob/master/.github/workflows/macos-10.15-compile.yml (reply to 16729)

Howard: thanks. Let me check! (reply to 16732)

Howard: what is this for? (reply to 16732)

Howard: I am adding 'Dev' folder we just got in tutorial to the Docker sharing already btw. (reply to 16733)

Malivix: You should send valid path /path/to/… Is not valid path  You should create a valid path and store config there then sending config folder to docker (reply to 16733)

Malivix: 🤔 github action for compiling on mac (reply to 16735)

Howard: 😵‍💫

Howard: not familiar lol (reply to 16738)

Malivix: Yes it’s hard You should familiar with c++ and toolchains or docker  But It’s temporary I think  Community is working on creating better dev envs (reply to 16740)

Howard: agree. Using Docker is temporary only because of M1 chips right.

Howard: can we just have a daily trend for tx? 😅 (reply to 16714)

Tim: No, it works on m1 without docker, it's just hard to compile not matter m1 or not (reply to 16742)

Ms: Indian anyone here

Ms: We need last quantity toncoin

Diako: I wrote data to cell with bellow code with ton library. but i don't know that how can i read from cell ? cell.bits.writeUint(1, 8); cell.bits.writeBuffer(....);

Malivix: Try cell.fromBoc If it’s Boc (reply to 16753)

Malivix: https://github.com/toncenter/tonweb/blob/master/src/boc/README.md And maybe reading this help you (reply to 16753)

Malivix: For deserialization    // Create some cells const c2 = new TonWeb.boc.Cell(); c2.bits.writeUint(42, 7);  const c3 = new TonWeb.boc.Cell(); c3.bits.writeUint(73, 255);  const c1 = new TonWeb.boc.Cell(); c1.bits.writeUint8(0); c1.refs.push(c2); c1.refs.push(c3);   // Check it deserialized correctly const deC1 = TonWeb.boc.Cell.fromBoc(await c1.toBoc()); (await deC1.hash()).toString() === (await c1.hash()).toString(); (reply to 16753)

Diako: Thank you for response i use tonstarter-contract project  I have something like this.  let ts = new TupleSlice(c1.stack); let content = ts.readCell(); let content_bp = content.beginParse(); content_bp.readUint(8).toString()  i already read uint but i can't read buffer data ! (reply to 16756)

Malivix: Can you send me repo project? (reply to 16757)

Malivix: I think that project using ton package  So after parsing content you will get Slice You can use  content_bp.readBuffer(size); (reply to 16757)

Diako: I don't know what is the size ! (reply to 16760)

Diako: https://github.com/ton-defi-org/tonstarter-contracts (reply to 16758)

Diako: yes, it's use ton library (reply to 16760)

Malivix: When you are reading from buffer you should read specific amount of it Depends on your cell type you have read different amount (reply to 16761)

Diako: The problem is, i don't know the buffer size i want to read content data from a nft collection contract ( get_collection_data function ) (reply to 16764)

kås: What is the best way to get txid of sent transaction?   In two steps like Async send with comment + later check for the comment in transactions list?  Or sync send?

Malivix: can you send me the lib you are using for get_collection_data? different contract can have different data (reply to 16765)

Diako: i use tonstarter-contracts with this function const call1 = await walletContract.client.callGetMethod(contractAddress, "get_collection_data"); (reply to 16767)

Howard: tried a bit but still can't work 😭 (reply to 16737)

Malivix: You didn’t pass data for that folder (reply to 16770)

Malivix: I didn’t work with this contract so I’m investigating  If find something i will let you know (reply to 16768)

𝕖𝕊𝕒𝕓𝕚𝕥: Anything? 🙂 (reply to 16694)

Howard: like this?

Howard: I followed this 😭 (https://hub.docker.com/r/trinketer22/func_docker)

Alex: The docker doesn't explain how to use it. It is assumed that you learn this from other sources or already know. Therefore, I suggest you try to act according to that lesson. (reply to 16777)

Howard: yes, but still need toncli? (reply to 16778)

Alex: As I see you little bit confused with commands, here’s an example of how “update_libs” looks in first time in docker.(M1)  alexg@Aleksejs-MacBook-Air tsc-3-solution % docker run --rm -it \ -v ~/Dev/tsc-3-solution:/code \ -v ~/Dev/toncli/:/root/.config \ toncli-local update_libs  INFO: 🥰 First time run - i'll create config folder 4you and save some stuff there INFO: 🤖 Check all executables are installed... ERROR: [Errno 13] Permission denied: '/code/func' WARNING: 🤖 Can't find executable for func, please specify it, e.g.: /usr/bin/func  Path: /usr/local/bin/func INFO: [' Commit: e37edfb6ab699dc7b430b458ac78c87acf4920f0', ' Date: 2022-10-03 22:36:45 +0300]'] ERROR: [Errno 13] Permission denied: '/code/fift' WARNING: 🤖 Can't find executable for fift, please specify it, e.g.: /usr/bin/fift Path: /usr/local/bin/fift INFO: [' Commit: e37edfb6ab699dc7b430b458ac78c87acf4920f0', ' Date: 2022-10-03 22:36:45 +0300]\nThis is toncli-local version of Fift'] WARNING: 🤖 Can't find executable for lite-client, please specify it, e.g.: /usr/bin/lite-client Path: /usr/local/bin/lite-client INFO: [' Commit: e37edfb6ab699dc7b430b458ac78c87acf4920f0', ' Date: 2022-10-03 22:36:45 +0300]'] INFO: 🥰 Feel free to change it if needed: /root/.config/toncli/config.ini INFO: Succesfully copied fift-libs func-libs test-libs (reply to 16775)

Howard: input Path: /usr/local/bin/func  then got this. Seems correct now! (reply to 16781)

Howard: Thank you a lot! (reply to 16781)

Howard: $docker run --rm -it \ -v ~/Dev/test_project:/code \ toncli-local build  I run with this code to compile the .func file. But seems it doesn't work?

Malivix: so what I see after calling that function you will get this type of data like this { gas_used: t.number,     stack: t.array(t.unknown) }  after that stack should be  (next_item_index, cs~load_ref(), owner_address) with type of (int, cell, slice)  so I think you should write something like this const call1 = await walletContract.client.callGetMethod(contractAddress, "get_collection_data");  let ts = new TupleSlice(call1.stack); let next_item_index = ts.readNumber(); let content = ts.readCell();  after this, it's depends on the type of content (reply to 16768)

Alex: Perhaps you need to check your project.yaml, maybe you have nothing to build.  For the default “wallet” project from toncli this command creates contract.fif.  alexg@Aleksejs-MacBook-Air test_for_build % docker run --rm -it \ -v ~/Dev/test_for_build:/code \ toncli-local build INFO: 🥌 Build [] successfully, check out ./build (reply to 16785)

Howard: Oh. I thought 2 different .func files will generate 2 different .fif file.   The experience for dev on-boarding is painful 🫠 (reply to 16787)

Howard: 😂 Thanks a lot for clarifying

User<5802396425>: Which one of you would like to mentor me a little bit? I just want to some practice in Smart Challenge , but difficult for me to understand after classic langauges and have't enought time. Write me in private message.

Diako: Thank you  I have problem with type of content ! as i told, there is uint and buffer in content ! i don't know how read buffer from content (reply to 16786)

dik: Hi

Malivix: It's depends on each nft There is not any specific content  You can read data and depends on nft parse them For buffer you can check length of slice and read all buffer  If content is big there are many ref cell and you should concat all buffers  Maybe I’m wrong  But this is what I’m find from contract code (reply to 16803)

Malivix: Also if you know the structure of buffer  You can do this  content_bp.readUint(8) let l = content_bp.remaining() content_bp.readBuffer(l)  Something like this  But if content is big and have ref You should traverse on slices and concat them (reply to 16803)

Malivix: I found another function  content_bp. readRemainingBytes() (reply to 16803)

kås: Hey guys! Hot to properly send full balance from a given wallet? How to calc fee in advance? I want the final balance after activation to be zero.  When testing and trying to send full balance (1 TON for example) I got some weird balance drainage, 50+ internal transactions and no incoming transaction.  I’m using V4R2 and xssnick/tonutils-go library is this is important

&rey: Send message with mode 128 ("carry all the remaining balance"). If you wish also to destroy contract, use mode 160 (+32 = "destroy contract if balance is zero"). (reply to 16809)

kås: Thanks a lot! Will try now.   Found this exact message at the js example now. Should look better next time I guess  https://github.com/toncenter/examples/blob/main/deposits-multi-wallet.js (reply to 16810)

Maxim: my binaries (fift, func, lite-client) are now in /usr/local.bit  - 2 point done but i see fift: command not found when i do 3 point - sudo fift -V && func -V && lite-client -V  what is missing?

Диёрыч: Welcome to the club buddy. I haven't resolved this problem yet) Have the same issue on MAC) (reply to 16817)

Диёрыч: binarie's path should be /usr/local/bin (reply to 16816)

Диёрыч: and yours is like /usr/local.bit

Maxim: Looks good in my opinion (reply to 16819)

Диёрыч: sorry, misunderstood) (reply to 16821)

Dmitry: Is ~/.local/bin in your $PATH ? Anyway, try ./fift -V && ./func -V && ./lite-client -V from that directory (you don't need sudo here, btw) (reply to 16821)

Dmitry: Also,I guess, you should make chmod +x for func and lite-client as well. (reply to 16816)

Diako: content_bp.readRemaining().buffer.toString(); Or content_bp.readRemainingBytes().toString(); (reply to 16806)

Dmitriy: hi. Does someone knows is it valid guidline? https://github.com/disintar/toncli/blob/master/INSTALLATION.md

Dmitriy: i've installed toncli by this instruction and faced with some error. Can someone explain the reason?

Alex: It is hard to see anything, but it seems like same issue https://t.me/tondev_eng/15218 (reply to 16828)

Dmitriy: M:\TON\ton-win64-binaries>pip install bitstring Requirement already satisfied: bitstring in c:\users\win10_game_os\appdata\local\packages\pythonsoftwarefoundation.python.3.10_qbz5n2kfra8p0\localcache\local-packages\python310\site-packages (4.0.1) (reply to 16829)

Dmitriy: but in the install guide toncli there is not ask for install some bitstring

User<5906393387>: Hey 👋 1) Should I study C to properly understand FunC? 2) How should I start my journey to write smart contracts in FunC?

Andrey: You need to install specific version,   pip install bitstring==3.1.9  It will be fixed in new release very soon (reply to 16831)

Coalus: 1) no 2) good list by @joechio  The basics of TON Blockchain development:  1️⃣ https://github.com/romanovichim/TonFunClessons_Eng  2️⃣ https://ton-blockchain.github.io/docs/#/  3️⃣ https://society.ton.org/ton-hello-world-step-by-step-guide-for-writing-your-first-smart-contract-in-func  4️⃣ https://www.ton.org/docs  5️⃣https://learnxinyminutes.com/docs/func/  🕖 https://blog.ton.org/func-journey (reply to 16834)

Dario Tarantini (ex Tonox): * If you need libraries / examples, check github.com/TonoxDeFi/open-contracts (reply to 16836)

Coalus: just a question, why strings.func is empty?😢 (reply to 16837)

Dario Tarantini (ex Tonox): I have plan to add functions in the future, i have already some written (like int to string hex rappresentation and so on) that will be uploaded soon (reply to 16838)

Dario Tarantini (ex Tonox): Also soon base64 function will be added (check pr)

Vellasco: hi

Vellasco: Hello, I would like to translate you into Brazilian Portuguese, can you send me a file with the phrases for me to deliver?

Malivix: Second one I think (reply to 16825)

Diako: both works (reply to 16845)

Malivix: So everything is good? (reply to 16846)

Diako: Yes, Thanks.   I have another problem ! i call this function : get_nft_address_by_index and it's get me this   73946329655849735808778334732540589146672953920511584036795979319453593787421  0:73946329655849735808778334732540589146672953920511584036795979319453593787421  do you know how convert it to wallet address ( like tonkeeper wallet address ) with ton library ? (reply to 16847)

Malivix: Did you try .readAddress? (reply to 16848)

Diako: it's not working   bellow code is in contract :  return begin_cell().store_uint(4, 3)                      .store_int(wc, 8)                      .store_uint(cell_hash(state_init), 256)                      .end_cell()                      .begin_parse(); (reply to 16849)

Malivix: Then using this function  Address.parse (reply to 16850)

Malivix: You can find this from address module in ton (reply to 16850)

Diako: let ts2_wc = ts2_parse.readInt(8).toString();   console.log("wc : ", ts2_wc)   let ts2_cell_hash = ts2_parse.readUint(256).toString()   console.log("cell_hash(state_init) : ", ts2_cell_hash)   console.log(Address.parse("0:" + ts2_cell_hash))   i have error on Address.parse : offset is out of bounds (reply to 16851)

Malivix: Try this new Address(ts2_wc, hash); (reply to 16853)

User<1797068122>: Woot woot ... What kind of chain we runnin here ?

Diako: it's works  let ts2_wc = ts2_parse.readInt(8);   console.log("wc : ", ts2_wc.toString())   let ts2_cell_hash = ts2_parse.readUint(256);   console.log("cell_hash(state_init) : ", ts2_cell_hash.toString())   console.log(new Address(ts2_wc.toNumber(), ts2_cell_hash.toBuffer()).toFriendly()) (reply to 16854)

Malivix: 😊 great (reply to 16858)

Dmitriy: spasibo )) (reply to 16835)

zzss: Hello guys. I am using tonweb library for JS and want to decode transactions data. Can you help me how to decode transactions data?

doni: you can use parseTransaction  by npm ton ( not tonweb)  look for the tests folder for good examples

doni: https://www.npmjs.com/package/ton

zzss: Thank you (reply to 16862)

User<1217167239>: Hello

zzss: What is this type of data? Can it be decrypted?

Андрей: b5ee9c72 - it's BOC prefix Perhaps this instruction will help you (you will need a translator): https://github.com/xssnick/ton-deep-doc/blob/master/Cells-BoC.md  the circuit itself: https://github.com/ton-blockchain/ton/blob/master/crypto/tl/boc.tlb#L25 (reply to 16879)

— 2022-12-19 —

Step: Can nft item owner access it's account balance/funds inside it?

Vladislav: Hi guys! Could you please tell me how you calculate transfer fee?

Yuri: Hello, what would be this error when executing fift? [ 1][t 0][2022-12-19 06:43:52.3848540][Fift.cpp:67]     top: <text interpreter continuation> [ 1][t 0][2022-12-19 06:43:52.3849547][fift-main.cpp:204]       Error interpreting file `.\counter.fif`: counter.fif:1: PROGRAM{:-?

Noah: Which aspect of Ton's asynchronous smart contract mechanism is better than other evm?

&rey: Executing contracts is "local" - it doesn't need to retreive other contracts' data, and that means that validators of a shardchain don't need to store full blockchain state. (reply to 16893)

Max: Only if the nft item was written to support that (reply to 16887)

&rey: Sometimes sending NFT to self works. (reply to 16887)

Step: 😳 (reply to 16898)

Step: does this work for telegram numbers? (reply to 16898)

Max: Doesn't the standard specify that forwards and excesses are taken from the transfer message balance and not from nft balance? Or am I missing something (reply to 16898)

Zeb: Hi everyone. Doing DD for the fund I'm working with. Was asking some questions in the main chat, got sent here.   Looking at tonmon, it says there is 1 shard atm. Is that correct? Is this due to that TON atm hasn't needed to shard into more yet, due to low demand?  Are there any stats on blockchain size by now? Tried finding data.  Also I was wondering, not all TON is circulating, even though all was distributed through PoW. Is the non-circulating TON staked TON? Couldn't really think of what else it could mean.

Zeb: Regarding the recent message towards dormant miners. If a dormant miner wallet does NOT make a tx before 1-1-2023. What are the plans with their balances afterwards?  Since the post is saying, it will make the tokenomics more clear, but these miner addresses could just wake up in a year or two. Happens with old BTC wallets all the time, years later. Is there a plan to take these balances, or burn those tokens?

Zeb: Sorry for all the questions, but yeah its interesting stuff and not all is clear. https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons Gives an example where a swap would take 3 messages to complete.  Couple questions here: - due tot he asynchronicity of TON, how often does this go wrong?  - can this completely be abstracted away for users? - are messages tx? would these 3 messages be included in the nr of tx here for instance https://tontech.io/stats/

Slava: Yes, one shard is enough to handle the current load. Blockchain is capable of automatically split and merge, based on the workload. (reply to 16907)

Slava: This is just to increase the visibility regarding the active funds, of course no one is going to burn anything. This would just violate trust in the distributed system and will not do any good. (reply to 16908)

Zeb: yeah exactly.. good (reply to 16912)

Zeb: Anyone else thoughts on the other questions perhaps?

Zeb: Is there a governance forum and are votes happening?

Slava: Validators were voting regarding some technical stuff. For example when the DNS standard was implemented. (reply to 16916)

Slava: https://t.me/tonstatus/37 (reply to 16917)

Slava: Also, the developers community is discussing standards that are under development via TON proposals or TEPs.

Gajesh: i was trying to use func and fift but getting this irriating M1 err  dyld[4027]: Library not loaded: /opt/homebrew/opt/openssl@3/lib/libcrypto.3.dylib    Referenced from: /usr/local/bin/fift    Reason: tried: '/opt/homebrew/opt/openssl@3/lib/libcrypto.3.dylib' (no such file), '/usr/local/lib/libcrypto.3.dylib' (no such file), '/usr/lib/libcrypto.3.dylib' (no such file)  [1]    4027 abort      fift -V

Maxim: already in path (reply to 16823)

Dmitry: openssl is missing. try sudo apt install openssl libssl-dev (reply to 16928)

Maxim: Yes, install(1 screen). After chmod +x fift problem with libcrypto (2 screen) (reply to 16930)

Maxim: ok... i will try Docker or something else as i read above

Dmitry: Did you download binaries for your release of Ubuntu? What is the output of cat /etc/*release ? (reply to 16932)

Chun Hsin: can anyone help me with decodeing tx messgage such as the following:

Chun Hsin: from the encoded mesage data

Chun Hsin: the raw tx data is as follow: https://explorer.toncoin.org/transaction?account=Ef83GamrmzQP-gkMxz2HZnZ37xaaQ1vqMHQ7aqa6n1DPJLbF&lt=32010667000001&hash=22e7cb397163f303b583ef9153238cdd3df7e066d547d7ba22ddb86cb3d27554

Sudo: What is the most reliable TON wallet?

N: Tonkeeper 🤷‍♀ (reply to 16942)

Step: can anybody tell the difference in these cell in_msg_cell ,  slice in_msg ? 🤔

Daniil: cell in_msg_full slice in_msg_body (reply to 16946)

Daniil: These are self-explaining names (reply to 16947)

Step: in_msg_body means payload? (reply to 16947)

Daniil: Yes (reply to 16949)

Step: in_msg_full means a complete transaction info?

Step: where i can see the structure of this?

Daniil: search for "sending messages" in docs (reply to 16952)

Step: anatomy (reply to 16952)

Daniil: in_msg_full contains everything that you put in cell for send_raw_msg function

Dario Tarantini (ex Tonox): https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb (reply to 16952)

Andrei: Hi guys  I'm looking to -offer- TRANSLATION and LOCALIZATION services for Ton software and projects.  Would anybody be interested?

Step: recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body)  order of arguments to recv_internal function is always same?

Daniil: yes (reply to 16958)

Step: https://github.com/TelegramMessenger/telemint/blob/main/func/nft-item.fc#L144 here no int balance why? (reply to 16959)

Step: 🤔

Daniil: It's not necessary to take all the arguments. You can take only some of the last args if you don't need the first ones (reply to 16960)

Daniil: Tvm is stack based so your function will just pop some values from the top of the stack and ignore everything else

Daniil: But the order must be the same (reply to 16962)

Step: what if i skip any argument in between? (reply to 16964)

Daniil: The order must be the same and you can't skip something in between. You can take some number of args from the end (reply to 16965)

Step: var ds = get_data().begin_parse(); does this parse payload boc automatically?  no arguments passed?

Daniil: get_data() returns cell with your contract data (reply to 16967)

Daniil: Not a message payload

Step: so its contract storage boc?

Step: cell or boc?

Max: Boc is a serialization format for cells to be used outside tvm

Max: get_data() returns contract storage cell

Step: all data must be written to this cell? (reply to 16973)

Max: Yes and then set using set_data()

Fortune: Does anyone have any idea how to restore stack order after a recursive call? When control is handed back to the initial invocation scope, the variables in the stack in the line just after end up swapping values and are no longer the values before the call.

Давид: Hi guys, does somebody have an example of deploying single nft item without collection?

— 2022-12-20 —

Howard: is there any possible I can fetch on-chain data easily?

Howard: Like historical balance, or daily txs vol for any smart contract to see the trend.   For example, what is the daily Tx or unique users for Fragment smartContract?

gogreen: Does anyone know what is the advantage of funC language over solidity or rust ?  My admin in the local group does not know and almost banned me because of asking this 😌

Daniil: FunC was made specially for TVM (reply to 17006)

gogreen: Do you have article that can compare funC vs solidity vs rust ? I wonder what are the best parts of funC ? (reply to 17007)

Victor: For what? FunC (and Fift) is the only option to write SCs on TON (reply to 17008)

Howard: and Tact I guess (reply to 17009)

Howard: https://tact-lang.org/

Victor: Tact -> FunC -> Fift (reply to 17010)

gogreen: When i compare eth and sol, i see big difference with their language program. Rust easier than solidity, that's make sol easy to use.  But i try to figure the advantage of funC used by Tonchain, is it more easier or complicated but safer ? Just curious, maybe some smart people here who knows a lot of computer can explain in the simple way 😊 (reply to 17009)

Andrey: dton.io/graphql/ (reply to 17002)

Andrey: https://dton.io/graphql/#query=%7B%0A%20%20transactions(%0A%20%20%20%20parsed_seller_is_closed%3A%201%0A%20%20%20%20parsed_nft_true_nft_in_collection%3A%201%0A%20%20%20%20parsed_nft_collection_address_address%3A%20%22B774D95EB20543F186C06B371AB88AD704F7E256130CAF96189368A7D0CB6CCF%22%0A%20%20%20%20order_by%3A%20%22parsed_seller_max_bid%22%0A%20%20%20%20order_desc%3A%20true%0A%20%20)%20%7B%0A%20%20%20%20parsed_dns_domain%0A%20%20%20%20gen_utime%0A%20%20%20%20parsed_seller_max_bid%0A%20%20%20%20address%0A%20%20%20%20workchain%0A%20%20%20%20seqno%0A%20%20%20%20shard%0A%20%20%20%20fees_collected_grams%0A%20%20%7D%0A%7D  Fragment usernames example (reply to 17002)

Howard: Yeh, I tried. But can't aggregate the timeFrame to daily (reply to 17016)

Maxim: Using this  instruction , and when I run toncli, I get this output:  PS C:\Users\Maxim\Desktop\ton> toncli INFO: 🥰 First time run - i'll create config folder 4you and save some stuff there INFO: 🤖 Check all executables are installed... INFO: Adding path to executable func success! ERROR: Command '['C:\\Users\\Maxim\\Desktop\\ton\\fift.exe', '-V']' returned non-zero exit status 3221225501. WARNING: 🤖 Can't find executable for fift, please specify it, e.g.: /usr/bin/fift Path  tried to do by this instruction have such conclusions:  PS C:\Users\Maxim> func -V FunC semantic version: v0.2.0 Build information: [ Commit: 8537dd60e6341474967f8e9d04a7b7f6a060ec36, Date: 2022-06-13 20:02:32 +0300] PS C:\Users\Maxim> lite-client -V lite-client build information: [ Commit: 8537dd60e6341474967f8e9d04a7b7f6a060ec36, Date: 2022-06-13 20:02:32 +0300] PS C:\Users\Maxim> fift -V PS C:\Users\Maxim>  What could be the problem?

Toby: How to get function operation ? i want to know which function of the contract is executed by the operation shown in tonscan.

Andrey: Hard to say, somehow your fift.exe is not valid. You can try to use WSL with docker. (reply to 17029)

Toby: ton smart contact is asynchronous. then how to implements dex aggregator like a 1inch? maybe it needs atomic process.

Diako: How store "string" in cell ?  int _item_index = 1; cell _uri = begin_cell()           .end_cell();  i want to store something like bellow data :   _item_index + ".txt"

Alex: I'm not sure that it's the best way, but works for me. You can create a string as slice, then store slice in cell:  slice sting = “string”; cell begin_cell().store_slice(string).end_cell(); (reply to 17041)

Diako: i want to merge Int with string like this : _item_index + ".txt" (reply to 17042)

Alex: well, perhaps: slice string = “.txt”; begin_cell().store_uint(_item_index, _item_index_len).store_slice(string).end_cell(); (reply to 17043)

Diako: Okay, let me try (reply to 17044)

Alex: But, if you really need index in the string, it seems you have to (encode/decode) number by your own hands too. Because the cell with “index.txt” will not equal the cell with index number and ”.txt” slice. (reply to 17045)

Diako: how should i do it ? (encode/decode) (reply to 17046)

Alex: Again, I’m not sure that it is the best way, but it works for me:  Encode - Represent each number as a set of symbols [0,..,9], then write their ASCI code into a slice as uint number of length = 8. Decode - Implement from slice to number. (reply to 17047)

PlanL: Hi. I get this error when executing func or fift. Please help me. And I'm using Ubuntu 22.04  func: error while loading shared libraries: libcrypto.so.1.0.0: cannot open shared object file: No such file or directory

Alex: It seems like same issue (reply to 17051)

PlanL: Can you please make it easier for me. I don't know what dockerfile is and how to use it. Sorry for being noob. 😶 (reply to 17052)

Maxim: torskiy@DESKTOP-PCD7KCG:~$ docker build . -t toncli-local [+] Building 0.0s (1/2)  => [internal] load build definition from Dockerfile                                                                              0.0s  => => transferring dockerfile: 2B                                                                                                0.0s failed to solve with frontend dockerfile.v0: failed to read dockerfile: open /var/lib/docker/tmp/buildkit-mount3536167109/Dockerfile: no such file or directory torskiy@DESKTOP-PCD7KCG:~$ docker run --rm -it toncli-local ERROR: Command '['/usr/local/bin/fift', '-V']' died with <Signals.SIGILL: 4>. ERROR: Command '['/usr/local/bin/fift', '-V']' died with <Signals.SIGILL: 4>. ERROR: 😳 Executable path is not working correct, output: WARNING: 🤖 Can't find executable for fift, please specify it, e.g.: /usr/bin/fift Path: (reply to 17034)

Alex: Well, I was wrong in general that issue is not absolutely the same.  Did you follow the installation guide from here? Have you install libcrypto via sudo apt install libatomic1 libssl-dev ? (reply to 17054)

PlanL: I've downloaded files from here. (reply to 17056)

Alex: In general, your source seems ok, I don’t know what is your problem. Maybe anyone else can advise about Ubuntu 22(I have only M1/Windows).  Before this, you can try to use Ubuntu 22 precompiled files from this link. I guess, the problem is that you used precompiled for another Ubuntu(18/16?) version from your link. (reply to 17057)

Amin: you should get binaries built for ubuntu 22.04 as Alex mentioned. Ubuntu 22.04 uses openssl 3/libcrypto.so.3, However, the binary you got requires libcrypto.so.1.0.0 so It's built for previous ubuntu versions (reply to 17051)

Maxim: ubuntu 22 source download links do not work (reply to 17058)

Давид: +1 (reply to 17060)

PlanL: Where can I download Ubuntu 22.04 binaries? (reply to 17059)

Ruslan: Try to download it from artifacts here: https://github.com/SpyCheese/ton/actions/runs/3563457577 (reply to 17062)

Amin: https://github.com/ton-blockchain/ton/actions/runs/3523838657 (reply to 17062)

Ruslan: Yep, this is even better!) (reply to 17064)

Amin: This is the latest master version, you can get the binaries built form latest testnet too. The spycheese version Ruslan just sent is pretty good too for development.

Tigr: Wdym by "a better approach could be to create a verifier contract that save the stack and send a message to himself to continue the computation"  How would this help to reduce the fees? (reply to 14345)

پدرت: 🤷‍♂🤷‍♂🤷‍♂

Kon: Where is the precompiled version? Only from source? (reply to 17011)

Ruslan: You may find it here. (reply to 17064)

Ruslan: You have version of binaries for another version of linux. Download binaries for your ubuntu version. (reply to 17070)

Reynold: Does anybody know where to find docuantation about soulbound NFTs and how to mint them

Kon: https://github.com/toncenter/tonweb/tree/master/src/contract/token/nft (reply to 17078)

Reynold: no single word about soulbounds( (reply to 17080)

Howard: Soulbounds only means a non-transferable token. (reply to 17081)

Dmitry: Here is the standard proposal. Though it has little to do with Vitalik's view of soulbound token. These soulbound tokens for ton are bound to owner's private key. May be transferred only between their wallets.  https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md (reply to 17078)

Reynold: by "their" you mean different versions of 1 wallet (aka v3r2 v4r2)? (reply to 17083)

Dmitry: I meant that. But I may be wrong here.

پدرت: But I'm sure that I'm using the right version. (reply to 17075)

Ruslan: Therefore the problem should be in environment. Make sure you have installed all necessary libraries.

Ruslan: Which ubuntu do you have? I'll give you a single command to check

🇷🇺 Angry: Hello! Who knows - how to create my own group in https://ton.place/ ?

پدرت: Ubuntu 22.04 LTS (reply to 17088)

🇷🇺 Angry: I bought media access by 2.2 ton

Ruslan: apt install -y build-essential cmake clang openssl libssl-dev zlib1g-dev gperf wget git curl libreadline-dev ccache libmicrohttpd-dev (reply to 17090)

Ruslan: Hello, this is a wrong place for such a question) Please try contact support of the platform. (reply to 17089)

پدرت: Thanks for your time. I'm checking them. (reply to 17092)

🇷🇺 Angry: Sorry… (reply to 17093)

Ruslan: Btw, if this command don't help you, you can build your own binaries following this Dockerfile: https://github.com/kdimentionaltree/ton-builder/blob/main/ubuntu-22.Dockerfile

Dario Tarantini (ex Tonox): no, the fees are still damn high for such operations (reply to 17068)

Tigr: that's ridiculus

User<427467139>: What? (reply to 17098)

پدرت: Unfortunately nothing changed. Still giving me the same error. (reply to 17092)

Shazli: Hello, how can I mine Ton with my phone?

Slava: Hello. Wrong chat. (reply to 17102)

Ruslan: Okay, so you have to build binaries by yourself… (reply to 17100)

Ruslan: One more question: what processor do you have? (reply to 17100)

پدرت: Intel Core i5-2450M CPU @ 2.50GHz × 4 (reply to 17105)

پدرت: git submodule update --init  This command is taking so much time. Is it normal? (reply to 17104)

Amin: Yes, they're large dependencies. The compilation will take some time too.  Would you try to list shared dependencies of fift, so we can ensure everything is loaded fine? You can use ldd fift (reply to 17108)

پدرت: What do you mean by shared dependencies? (reply to 17109)

Amin: Ton binaries require some shared libraries to be present, like openssl. Pass one of the binaries to ldd so we can figure out whether all of them are ok or not (reply to 17110)

Max: You can add --depth=1 to fetch only the last commits, then it will be faster (reply to 17108)

Max: ldd $(which fift)

Ruslan: Ah, okay. It seems to be old enough to be different from new CPUs in available extensions. (reply to 17107)

zzss: Hi guys. Can you tell what is the average latency for Ton transactions?

Slava: Hey! New blocks are generated in 3-5 secs. (reply to 17116)

Luke: contracts/2.fc:48:5: error: undefined function `dictval`, defining a global function of unknown type       dictval~udict_set_ref(128, value, msg);       ^ lvalue expression constructor is 8 fatal: cannot compile lvalue expression with unknown constructor  Does anyone know how to fic this

Daniil: in this case, dictval is only defined inside of if {} or else {} block. it's not visible outside of it.  you can define it before if (), and then just set the value in it (reply to 17118)

Luke: so would i just do like cell dictval = 0? because just cell dictval; gave an error (reply to 17119)

Daniil: you can do cell dictval = null() (reply to 17120)

Luke: is there a way to set integers as value in dictionaries, or a way to convert form slice to int and back

Daniil: values are always slices. you can simply store a single integer in a slice if you only need it in a value.  int to slice: int value = 123; slice slice_from_int = begin_cell().store_uint(value, 256).end_cell().begin_parse();  slice to int: slice value = {{{dict get or something else}}} int int_from_slice = value~load_uint(256) (reply to 17122)

Luke: oh ok

zzss: Is it possible install lightweight TON client to have access to new transactions with minimal latency? can you share the link please?

— 2022-12-21 —

CryptoMefka: Hello, everyone

CryptoMefka: Is there any chance to get back sent transaction with wrong memo ?

Luke: is it possible to write to a cell that isnt the contract data, like if i had a linked list of cells with the contract as the root, is there some way i can add a reference in the last cell's storage (im storing a reference in the root cell to the last cell)

Abdulhafiz Nuhu: More blessings Allah blessed ameen

Abdulhafiz Nuhu: Margin trading on Huobi Global  We’re pleased to announce the launch of the TON/USDT trading pair for margin trading on the Huobi Global crypto exchange.  Now, Toncoin leverage trading is available up to 3x on the exchange.  Please note: Trading with financial leverage carries additional risks, and we recommend beginner traders and investors avoid such instruments. (forwarded from TON Community)

Howard: is it possible for @Wallet to interactive with smart contract in TON network?

N: Hi guys I'm a Dog-Noob in programming & Blockchain concept but I have high learning skills. Does anyone know any link (e.g. YouTube) to start learning how to create smart contract and daps?

N: I meant a key to start or something like that (reply to 17145)

Captain: ton.org/docs

Captain: https://ton.org/en/dev

kås: Hi everyone! Who knows how to properly calc storage fees for a given account?  For example I’ve got js calc from https://ton.org/docs/develop/smart-contracts/fees  Decoding base64 contract bytecode gives me 740 bytes  Wich translates to ridiculously low price of 0.0003 TON per year.   Is this right?

Tim: Are you sure there's only one cell?

kås: *corrected for 5920 bits, still got pretty low 0.00284 TON

kås: not sure, how to get actual data? Im decoidng contract bytecode from tonscan contract tab. This is just fresh generated v4r2 account (reply to 17153)

Daniil: There's also some data, not only code (reply to 17155)

Tim: Not sure if there's public function for that, you can try to flatten root cell and count

kås: thanks, will look into it.  I just wanted to undestad a ballpark price for leaving 1000+ accounts active to receive incoming transactions. So for 1000 active accounts I got 2TON is this about right? Does contracts grow overtime with more transactions? (reply to 17157)

Tim: 0.05 per year per account more likely

kås: got it, thanks.

Diako: int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON  What is this code for in nft item ?

doni: each Nft-Item contract should mantain sufficient balance for paying storage fees ( similiar to rent model , you pay fees as long as you using the storage)   So each action should leave at list min ton for storage after trasnfers or any other updates … (reply to 17162)

doni: the same logic happens in Jetton contract as well

Diako: what happen if ton price go up ? i mean if ton price goes to 100$ it's mean every item needs 5$ ? (reply to 17165)

Behrang: If you already have an NFT on the network, you have already paid for it, and the price of TON doesn't matter.  However, new NFTs will cost more. In that case I think the network might decide to reduce gas and storage prices. (reply to 17168)

Diako: i want to create uri in my nft collection contract every nft item need uri, for example 0.json or 1.json  i have int variable and string variable like bellow int _item = 10 slice _file = ".json" and i want to merge it like this "10.json" how can i do it in func ?

Behrang: This might help in just converting the number part to string:  slice to_string(int n) {   builder b = begin_cell();   tuple chars = null();   do {     int r = n~divmod(10);     chars = cons(r + "0"u, chars);   } until (n == 0);   do {     int char = chars~list_next();     b~store_uint(char, 8);   } until (null?(chars));   return b.end_cell().begin_parse(); } (reply to 17171)

User<967403852>: Hi there! I'm developing a nodejs library that encapsulates interaction with different blockchains into strictly typed methods and wanted to ask a few questions regarding the interaction with project.  Right now, after a brief intro to the HTTP API I decided to reach out to the community of devs in order to get a better understanding  1. I've read a discussion in this chat about BIP39 not being supported completely. I would like to know if there is a way to generate a TON wallet from standart 12-15-18-21-24 word mnemonics consistently? Is there a derivation path?  2. Is there a way to identify a block with only an integer to make request to an API? Like in ETH BTC TRX etc

Step: 1. ton, by default uses 24 words. check https://github.com/toncenter/tonweb-mnemonic/tree/master/src (reply to 17176)

User<967403852>: Thanks for the answer! I see that it is possible to generate 12 word mnemonic and function doesn't prevent it. Do you know if there is any derivationpath-like tools to generate multiple addresses from one mnemonic? (reply to 17178)

User<967403852>: I've also tried to generate few mnemonics with openmask, my bip39 tool says that they are invalid

Step: seed or words? (reply to 17181)

Andrey: What you mean about "id chain"? (reply to 17183)

User<967403852>: It tells just "Invalid mnemonic", I've tried to compare lists and found that words are correct (reply to 17182)

Andrey: TON not EVM (reply to 17186)

Andrey: It has its own blockchain and virtual machine for smart contracts- TVM

User<967403852>: https://github.com/slavafomin/tonweb Does anyone know the current state of TS version of tonweb?

Slava: Well, it's work in progress. I don't have much time to work on it, but I'm trying to keep it somewhat alive. It already has bug fixes, performance improvements and new features, like a dedicated Slice class with all the useful Cell parsing methods. It also has a pretty good test coverage. But it's not up to date, regarding the latest vanilla TonWeb version. I'm planning to update it soon. (reply to 17190)

Slava: But I'm using it in production :) (reply to 17191)

Step: which project? (reply to 17192)

User<967403852>: Thanks for the info! for now think I will use both bits of TS and JS code when I will be working with TON. It's very cool to see a TS library, TRON doesn't have one lol (reply to 17191)

Step: tronweb? (reply to 17194)

User<967403852>: Yeah

Slava: Can't say, sorry. It's under NDA. (reply to 17193)

User<967403852>: Tronweb

Step: ok (reply to 17197)

Step: can you tell how to become master in ton smart contract? (reply to 17197)

Slava: The TS version is very good when it comes to source code study, I've tried to make it much more clear and readable. It even has comments :)

Slava: You need to find the TON Smart Contracts Guild and finish the quest-line there. (reply to 17200)

Step: TON Smart Contracts Guild? (reply to 17202)

Slava: It was a TES-related joke. Disregard this. (reply to 17203)

User<967403852>: )))

Dev: For new TON projects beginning now are there recommendations for versions of  FunC, cmake, toncli etc ? just latest?  Javascript vs Typescript?

User<967403852>: Do I really need a private key to estimate tx fee?

Slava: I guess so, because you still need to sign the message. (reply to 17210)

User<967403852>: Thanks, will consider it

User<967403852>: Are there any heuristic methods for approximating the fee?   I will give an example: In ETH i can use the data from gas station and ABI data to estimate fee for transfers/contract executions without requesting the network TRX has some batshit insane energy system that grants you access to constant fee values after sessions of deep dark exploration of the docs BTC just has vbytes and satoshis  Are there any ways to do something like that in TON (reply to 17211)

Slava: The TonWeb will send your message to the TonCenter (HTTP API) that will call the tonlib (a C++ library that implements TON stuff). It will execute the contract using your message and will calculate the fees without actually delivering it to the validator. If you are not on the web, it could be all done locally. There are actually solutions to execute contracts locally from JS, maybe you can use that. (reply to 17214)

User<967403852>: Can you please elaborate regarding the solutions?  Ideally I would like to know if there is way to approximate fee only knowing what I'm transferring (TON or some other currency if thers is) and sender of the transfer (reply to 17215)

Slava: I haven't tried that myself. Maybe someone here will be able to better answer this question. (reply to 17216)

User<967403852>: Thanks a lot for your help! I was very happy to have a chat with dev!

Slava: Sure, feel free to ask 👍🏻 (reply to 17218)

Alex: links fixed. (reply to 17060)

&rey: There are even two of them: https://github.com/ton-society/ton-footsteps/issues/79. Which will become official is unknown (well, and I'm an interested party 🙂) UPD: link to proposal is https://github.com/ton-blockchain/TEPs/pull/101 (reply to 17179)

User<967403852>: Also, I've checked current implementation of mnemonic generation (https://github.com/toncenter/tonweb-mnemonic/blob/master/src/functions/generate-mnemonic.ts I hope this is corrent) and found that it's incompatable with BIP39, because words need particular structure, not just random word from a wordlist. The last word needs to contain a checksum in order to be compatable with BIP39  There is a good description of this at this BTT thread https://bitcointalk.org/index.php?topic=5300691.0 (reply to 17221)

Slava: Yes, only a subset of ETH seed phrases are compatible with TON. (reply to 17224)

User<967403852>: ETH seed phrases? (reply to 17225)

Slava: The BIP39 seed phrases to be precise. (reply to 17226)

Rami: Hi 👋 To whom who worked with NFT projects - how you dealt with indexing of data? Did you use some open source project or did you write your own indexer?

Gajesh: i was trying to compile counter contract from func contest-1 with func-js  but i'm getting this error:  contract.fc:4:8: error: undefined function `get_data, defining a global function of unknown type     n += get_data().begin_parse().preload_uint(64);`

Nati: Hey 👋 I was wondering if there is a simple way to iterate NFTs from a specific collection, and if someone has any example code samples I can learn from! Preferably Python but any programming language will help 💪

Step: stdlib.fc is missing? (reply to 17233)

Gajesh: yep. didn't find it in the repo (reply to 17236)

Step: https://github.com/ton-blockchain/token-contract/blob/main/stdlib.fc (reply to 17237)

Gajesh: thanks! (reply to 17238)

Tse: Hi, I am trying to build an application which requires users to prove that they own a specific address. I think providing  signature might be a way to prove ownership of an address.    But I can’t figure out a way to do it on a local machine. How do I sign a  message via the private key of a ton address? and how do I verify it?   thanks in advance!

Jaimin: Gm TON devvers!  Is anyone developing secure storage for data (within a user’s TON wallet) or otherwise.  I have a use case where I want a TG bot to access data which is encrypted and only available to that specific user. Anyone working on something like this?

Jaimin: Also separate question, is there a TON MPC solution yet where you can sign from TG?

Dario: Encrypt data with some kind of user providen key -> encrypt & serialize this data into a boc -> push data with a transaction  If the size of the boc exceed 64kb you need to truncate the message and send it in different transactions (reply to 17247)

Dario: If you want to explict store something in the Blockchain. This is a bad idea btw, better to use the solution proposed by TF which involves a contract that only acts as a frontend for storing data, to manage payments etc. Everything else.is.done offchain

Jaimin: Hmm contract proposed by TF as a frontend makes sense.. what’s TF tho 😅 (reply to 17250)

Coalus: TF - Ton Foundation (reply to 17251)

Dario: Ton foundation (reply to 17251)

Jaimin: Very excited to dig into this!

User<1237546490>: Hi all, we published open source code (for TON community), coming soon SDK of our Marketplace libermall.com:  FunC Contracts powering NFT Marketplace sell/byy and (T)ON (N)FT (T)ool - All-in-One command-line utility to query, modify, and mint new NFTs on TON blockchain.  Use for your developments, we are happy to work for the benefit of the TON community =)

Andrey: https://dton.io/graphql/#query=%7B%0A%20%20lastTransactionCountSegments(segmentation%3A%20%22day%22%2C%20days%3A%2010)%7B%0A%20%20%20%20segment%0A%20%20%20%20cnt%0A%20%20%7D%0A%7D (reply to 17022)

Jaimin: Hey, just wondering for Ton Storage is it being deprecated or migrated? (reply to 17250)

Dario: Thats not ton storage for sure. Do not connect your wallet to unknown site (reply to 17261)

Reynold: Hi guys. Does anybody know how to get 32 bite hex private key from your mnemonic? tonweb is giving 64 bit private key by mnemonic I need 32 bit key because this library requires 32 bit private_key here in code

Amin: Just use the first 32 bytes, it will be ok. (reply to 17263)

Reynold: thanks. something in library broken probably, because its not reading private key properly and returning invalid inactive address( (reply to 17265)

Amin: Your wallet is v3r2? and you changed the network in config? (reply to 17268)

Kenan Heyatov: How i can get any nft or coin

Reynold: The private key is the same for all versions of addresses, but the address that the library gives does not match mine. And yes I tried both networks (reply to 17272)

User<5909707939>: (cell cur, int k) = udict_get_ref?(d, 16, val);   send_raw_message(cur, 0);     How would I activate the "inplace message body flag (Either)" for this code?

Luke: how can i check if a tuple is empty, as well as how to check if a variable is null

Coalus: https://ton.org/docs/develop/func/cookbook#how-to-determine-if-tuple-is-empty (reply to 17277)

Luke: lvalue expression constructor is 9 fatal: cannot compile lvalue expression with unknown constructor  anyone know what is causing this?

— 2022-12-22 —

A: Contract

Howard: chad! (reply to 17260)

Howard: is it possible to add a filed that is 'Addresses'? Would like to see which smartContractAddresses or Wallet are contributing more in daily Txs. (reply to 17260)

Noah: As i know, ton s smart contract execution between external contract is asynchronous, then if there is dex using x×y =k , how to make atomic swap using more than 2 paths?

Noah: Maybe liquidity need to be stored in one contract? Like balancer?

Tim: You can't make atomic swap between 2 pairs (reply to 17293)

Noah: So need new dex mechanism in ton? (reply to 17295)

Howard: any testnet API RPC is reliable? Want to read the on-chain data for my contract 😅 (reply to 13570)

Andrey: https://testnet.dton.io/graphql/#query=mutation%20%7B%0A%20%20run_method(%0A%20%20%20%20account_search_by_address%3A%20%7Bworkchain%3A%200%2C%20%0A%20%20%20%20%20%20address%3A%20%2270E07BCAE560B590E10250159E9C5BF3904D4CD756C08150D1DB583180761903%22%7D%0A%20%20%09method_name%3A%20%22get_nft_data%22%0A%20%20)%7B%0A%20%20%20%20stack%7B%0A%20%20%20%20%20%20value%0A%20%20%20%20%20%20value_type%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20gas_used%0A%20%20%20%20vm_steps%0A%20%20%7D%0A%7D%0A%20%20 (reply to 17298)

Howard: mutation means test-net in your graphQL structure? (reply to 17299)

Howard: what is the error code 1130 means on tonscan....

Howard: https://tontestnet.com/ didn't pop up this info by the way (reply to 17303)

Chun Hsin: does anyone have a db snapshot for the toncenter indexer? https://github.com/toncenter/ton-indexer  been waiting for my archival node sync for days, not sure how long it will take for the indexer

Tim: Did you install archive node from archive dump?

tk.crypt0x | Drops💧🆙 UXUY: Im new here, I just saw this TON recently..im interested in the project

Chun Hsin: yes (reply to 17306)

Chun Hsin: [LastBlock.cpp:369][!LastBlock][&last_block]   sync: error [Error : 500 : LITE_SERVER_NETWORKadnl query timeout(during check init block)]  been getting this error for a few days with my archival node

Chun Hsin: error on the indexer

User<5319486060>: What toncoin should do 1. Building a decentralized wallet with 24 seed words. so that it shows the number of assets on the Telegram platform and money is available on Telegram 2. Creating a secure p2p transaction platform on the Telegram platform. 3. The possibility of currency exchange and people's financial activity with simple authentication for small amounts. (even with Iranian authentication for small amounts) In this case, currency exchange becomes much easier

User<5319486060>: tonhoub wallet is better than other toncoin wallets, it has only one flaw First, it has a very simple password Second, it is not possible to give a complex password to see the seed Third, it is not possible to have multiple wallet accounts in one wallet

Summer: Hi, how can I set up my wallet address name, https://tonscan.org/address/EQBfAN7LfaUYgXZNw5Wc7GBgkEX2yhuJ5ka95J1JJwXXf4a8

Summer: Like the above screenshot, OKX and Huobi Deposit

Reynold: Does anybody know the difference between royalty parameter in tonweb NftCollection and seller_fee_basis_points in collection json metadata https://github.com/ton-blockchain/token-contract/blob/main/nft/web-example/index.html https://github.com/ton-foundation/token-contract/blob/main/nft/web-example/my_collection.json

Tim: Json Metadata one doesn't matter

Reynold: thx (reply to 17327)

Emilia: Hello, I read that TON Storage is coming by the end of the year. What about TON Proxy 2.0 (privacy) and 3.0 (DeFi) announced in the past?

Daniil: Ask in general chat @toncoin_chat (reply to 17330)

Tse: Hi I just installed pytonlib and when I try to run the example file (generate_wallet.py) I kept getting this error"illegal instruction: 4" and then Python will crash. Do I need to modify the code before using it to generate a wallet?

Dev: what version of python? (reply to 17335)

Tse: python 3.11.1 (reply to 17337)

Dev: if you get this error I think you need to build the library yourself

Dev: git clone https://github.com/psylopunk/pytonlib && cd pytonlib && ./build_tonlib.sh  # docker is needed

Tse: Got it I will try again with self built library (reply to 17342)

wakeup: How can I get all possible data from elector for the current/previous elections ?

Ruslan: Here is pen more way to build binaries: https://github.com/kdimentionaltree/ton-builder (reply to 17346)

Coalus: Hi! The same code(in one i have dump("ok");, in other not, all the difference) work in different ways. When i have dump("ok") everything is ok, but when i remove it i get not a tuple of valid size error, how is this possible?  running on local machine with ton-contract-executor

Muneeb: Hi, I am facing issue in sending ton from account 1 to 2  "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state".

Muneeb: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state   Failed to get account state

Yuri: Hey guys, I'm getting this error when trying to build: PS C:\Users\yuria\learning\TON\lesson5,6> toncli build      ERROR: 🤟 It is not project root [C:\Users\yuria\learning\TON\lesson5,6] - I can't build project without project PS: I have a project.yaml file

Dev: Did you checkout the project with git? if so can you show the results command: git status (reply to 17362)

Dev: I think either your cwd is not the project directory or you may not have all the files in from the repo up to date.  You might need also to do a git pull

Yuri: It's not a git project (reply to 17363)

Dev: where is it?

Yuri: I'm doing it

Dev: can you post project.yaml ?

Yuri: contract:   func:     - func/code.func   tests:     - tests/contract_tests.fc

Dev: or take a picture of it is better.

Yuri: I think I found the issue

Yuri: hehe

Yuri: let me try

Yuri: Alright, didn't work

Yuri: changed from func/code.func to func/code.fc

Saber: I saw this paragraph in ton whitepaper, but I couldn’t find anything about this in the code bases. is there any plan to integrate this into TVM or is it already implemented? “Support for Weil pairings on some elliptic curves, useful for fast implementation of zk-SNARKs, is also present.”

Emilia: Unfortunately no one answered me. (reply to 17332)

Elshad: is testnet.tonscan.org down or only me cannot access

Elshad: ?

Young: Hey all! I'm building a DAO tooling related project on TON. I’m doing some specs up but I’m interested in two types of devs:  1. doing a paid gig for a prototype (I can pay 1-10K), or  2. looking to be a CTO/Tech lead, can net 100-300K yearly   Need: Familiarity with FunC/C, Javascript, Typescript. Blockchain exp not needed. No min years of engineering exp. As long as you're learning FunC  Send me a DM with your CV and Github if that's you!

User<5338839825>: Hi, I'm new here, I'm starting to develop an automatic translation system (based on browser language) for the TON Wallet extension (toncenter/ton-wallet), I'm working with Fork on my GitHub account, when I'm done I think Send the pull request for the merge. Do you think it can be merged with the main project?

Luke: () process(slice msg) impure {     if(~ msg.is_null()){         ~dump(msg);         cell storage = msg~load_ref();         process(msg~load_ref().begin_parse());         processNode(msg, storage);     } }  why is my code skipping the processNode call, i've set it to impure

— 2022-12-23 —

Garden: Hi, guys  Can somebody explain me what can be this ?  I got it from https://tonapi.io/swagger-ui  /v1/blockchain/getTransactions (forwarded from Garden)

Yuri: Hey guys, any thoughts on this? (reply to 17362)

Andy: can you show the processNode code? (reply to 17392)

Luke: i manged to fix it, it was an error with my debugging (reply to 17402)

ً: How i can get ton

Ma_Gee_official_🐰: So how can we earn this ton

Diako: why does contract do not return msg_value when throw occurs ? for example i sent 0.1 TON to contract but, for a reason throw_unless execute and transaction faild ! but my 0.1 TON not return to my account !

Daniil: Did you send it to bounceable or non-bounceable address? (reply to 17410)

Diako: what do you mean ? i send to my contract ! (reply to 17411)

Daniil: Address of the contract can be bounceable and not bounceable (reply to 17412)

Diako: how can i check ? (reply to 17413)

Daniil: How did you retrieve the address? (reply to 17414)

Diako: it's my nft collection ! i deployed with tonstarter-contract (reply to 17415)

Daniil: Can you send the address here? I'll say if it's bounceable or no (reply to 17416)

Diako: EQCo1vURUeh_J0_jPDJeI_SfKiaRy9SNW8Ph37_R1kuqcN_d (reply to 17417)

N: Hope Paul Durov develop an Instagram-like service as lovely as Telegram equipped with TON payment options so you would be able to share pictures, videos, reels & even NFTs. I have big entertainment pages on Instagram but actually tired of it lol.

Daniil: Hm that's strange (reply to 17418)

Diako: so what do you think ? (reply to 17421)

Андрей: https://t.me/tondev_eng/16880 (reply to 17395)

Silvio: This param in TON Storage Provider Smart Contract:  Min file size  1  Max file size  10000000010  is on MB unit?

Silvio: https://testnet.ton.cx/address/EQDYOjKYmTfqw52aYrJIVrw5sbUPUPErUiCOcgvKGd4mn6Wv

Andy: How do I clear the initial data of c4? or detect that it is the initial data in c4?

ً: @Gusarich

ً: @Gusarich answer me please

Daniil: ? (reply to 17430)

ً: Why you blocked me (reply to 17431)

Andrey: It's serialized BoC (bag of cells) (reply to 17395)

User<967403852>: Hi, does anyone have the production ready MongoDB implementation of BlockStorage  interface mentioned in the tonweb library?

Mark Okhman on TON: Hello guys, recent few weeks we've been working on creating a universal WTON together with TF and FS Labs team, as well as DEX developers (namely, @NickNekilov, @junmoDev, @dariolol).  This united team deserves great kudos!   Wrapped TON (WTON) is a jetton that is locking TON 1-to-1 on mint and releases TON on burn. WTON is used to unify interaction between TON and jettons of TEP-74 and TEP-89 standards. There is a need to have a universally adopted WTON with a common standard of interaction and single source of origin.  As a result of this productive work, we have a TEP (Ton Ehnacement Proposal) that in-depth describes the whole initiative together with motivation, guides, specifications, drawbacks and best practices from other blockchains.  We would love to invite you on reviewing this TEP https://github.com/markokhman/TEPs/blob/master/text/0000-wrapped-ton-standard.md and writing your feedback in the pull request of the TEP.  Any feedback will be appreciated!

Yang: Awesome (reply to 17437)

Slava: Hey, I don't think there is. But it should be not that hard to implement. (reply to 17435)

User<967403852>: Yeah I saw the implementation in the library and it appeares to be pretty simple, just asked in case anyone tried (reply to 17443)

User<967403852>: But this part can be rewriten from NlogN to N complexity))))

Andrey: You can submit pull request with better implementation.  Open Source power 💪 (reply to 17445)

User<967403852>: Was just kidding, it's an example in the library, and it's obvious that you will need a db in long-term (reply to 17446)

Диёрыч: Hey guys . I placed fift binary file to /usr/local/bin and when I run command fift -V i get reponse like "Fift build information: [ Commit: ba8f700e26620707f8ff14e46cc9a040a1b3f97c, Date: 2022-11-22 16:30:53 +0300]"

Диёрыч: Could anyone help me to resolve the trouble?

Andy: That's not an error, that's the expected output (reply to 17450)

Диёрыч: So everything ok? (reply to 17451)

Andy: yes (reply to 17452)

Диёрыч: Cause I wait for something like fift v0.1.1 bla bla (reply to 17453)

Диёрыч: Ok, also i have same with lite-client, is OK too? (reply to 17453)

Andy: yes

Диёрыч: Thx (reply to 17456)

Диёрыч: I'm on 5th step of building counter contract and get error "Error interpreting standard preamble file `Fift.fif`: cannot locate file `Fift.fif` Check that correct include path is set by -I or by FIFTPATH environment variable, or disable standard preamble by -n."  What is wrong, could you help me please? (reply to 17456)

Dmitry: What does this error mean? ❌Failed Compute Phase 💻: (exit_code 35)

Andy: Can't help, I haven't encountered that issue before. (reply to 17458)

Диёрыч: resolved!) just added fiftlib to my env variables path (reply to 17458)

Diako: do have any idea ? (reply to 17421)

Amin: Investigated this issue deeper, as I encountered this issue for a ton fork I have and build binaries with GitHub. After analyzing the core dump with gdb, I figured out that the instruction causing the problem is VCVTUSI2SD, It's used by rocksdb and is an AVX512 instruction. TON monorepo builds with -march=native and all capabilities of the host builder are used, which makes the binaries less portable. (AVX512 is not widely available capability, only on special Core-X, Xeon series + Icelake series) Setting the portable flag on, solves the issue. @jtton (reply to 17115)

Slava: That's pretty impressive debugging 👍 (reply to 17475)

Amin: Thanks! It was hours of google search actually:)) (reply to 17476)

— 2022-12-24 —

User<5583863023>: Hello can I use highload wallet mnemonic phrase to login on ton keeper ?

Mark Okhman on TON: Hey friends 🚀    I’ve recorded a video, that is covering some very beginner level topics - how to get data from smart-contract and how to compose a simple message to send it to the smart-contract.  Please let me know if it was useful or not. Thanks!!!

Mark Okhman on TON: Dear firends ❤️  It's been a while since I posted last video. I don't know what's the best way to conveince you, that this is ONLY and ONLY because i'm learning how to program on TON and learning the very core principles that stand behind it. And of course I'm going to share those with you very soon!  However, today I've recorded a new video for those of you, who want to try starting with TON programming. It's quite simple, but it will teach you a lot. BTW, this is a great way to learn what is NFT! Intrigued? Follow the link ❤️  https://youtu.be/wEEQLwQy30Q  Here is the tutorial. I hope you enjoy it! (forwarded from Mark Okhman on TON)

Nati: Does my mainnet wallet also exist in testnet? I was wondering if i can just use my main wallet address in testnet instead of opening another wallet just for testnet.

Behrang: It will work, however nothing is deployed unless you deploy it on the testnet.  Your address will change a little.   However, this is a little dangerous, since you may use your mainnet wallet instead of the testnet wallet accidentally. (reply to 17485)

Nati: Alright so I'll just create a new wallet for testnet - thanks! (reply to 17486)

Diako: @behrangn (reply to 17410)

Nati: Thanks for the tutorial!  Just mined my first NFT 🤩 (on testnet) (reply to 17483)

Mark Okhman on TON: Awesome!!! (reply to 17490)

Behrang: Each message has a flag called "Bounce". When it is set, and the smart contract throws an exception, the excess amount is returned back, but when it is not set, the excess amount is not returned.  There are some reasons for having non-bounceable messages. The main usecase is for deploying a wallet or smart contract for the first time, which does not exist on the network, and sending any message to it will fail. Here, first you have to unset the bounce flag, so that the amount that is sent to a non-existant smart contract is not returned to you, and then you can deploy the smart contract on the address which is now funded and has enough money to be deployed.  I suspect that you have unset the bounce flag, and the amount is not returned to you.  Also, there are to types of addresses, bounceable and non-bounceable. Wallets have a complex logic to determine what to do and set the bounce flag or not. Sometimes they look at the type of the address.   In your case, if you have manually sent the transaction, check whether you have set it or not.  Here is the related TL-B: int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool   src:MsgAddressInt dest:MsgAddressInt    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams   created_lt:uint64 created_at:uint32 = CommonMsgInfo; (reply to 17410)

Howard: What is the cell datatype looks like?

Nati: Not sure if this is the correct place to report this but there is a broken link in one of the ton.org blog posts. It's in this article - in the end. The link leads to this broken link. The correct link would be this.

o8wqc: Hello guys, Is there a tutorial on compiling the ton sdk dynamic link library for android? I can successfully compile the linux version, but the cross-compilation for android fails, and I can't find the corresponding tutorial.

Diako: How can i know what data pass to contract ? for example what data pass in this transaction ? https://tonscan.org/tx/kYzszhSP6vaDyfg1RK7kWfDMzTYV-6cx8gUWvcdCA-U=

Howard: You need decode it. (reply to 17507)

Diako: what data ? (reply to 17508)

Behrang: Each smart contract accepts a few different types of input. It checks the input against those different types. If it matches one, it'll execute it.  Usually, the first 32 bits of data is the operation code and is used to identify the type of data that is being sent.  Smart contracts usually read this 32 bit op code first, and then decode the rest of it. (reply to 17507)

Howard: anyone know how to read mapping data on Smart Contract through TypeScript?

Howard: Like this

Slava: It's in BOC, you need to know the TL-B schema of the data. Then you can use any Slice implementation to read the data according to the schema. (reply to 17519)

𝓢𝓪𝓶𝓾𝓮𝓵: Hello guys! The support team in the general group directed me here to consult Has anyone here collaborated in the development of Toncoin tokenomics? There is an important project that needs economic analysts

𝓢𝓪𝓶𝓾𝓮𝓵: the development of the structure will be special, that is why experts in the area are needed (reply to 17523)

𝓢𝓪𝓶𝓾𝓮𝓵: As Toncoin has had a very genuine tokenomics management, the first ones I wanted to address were you

Slava: Hey! This chat is for engineering questions, not for economics. (reply to 17523)

Stanislav: Hey, sorry for fooling question, I am newbie. Where can I get about definition bounceable and non-bounceable address to see difference between them?

Nati: Bounceable vs non-bounceable addresses  The core idea behind the "bounceable" flag is security for sender.    For example, if the destination smart contract does not exist, or if it throws an unhandled exception while processing this message, the message will be "bounced" back carrying the remainder of the original value (minus all message transfer and gas fees).    In fact, bounceable=false means that receiver is a wallet and bounceable=true is a custom smart contract with own logic (for example, DEX) and you shouldn't send him any non-bounceable messages because of the security reasons.  Read more in Non-bounceable messages article. (reply to 17529)

Nati: Also, a great answer. (reply to 17531)

Howard: Hi, anyone know how to implement fromBoc? (reply to 17519)

Howard: Let say the data I got here is an Object in TypeScript, which is Boc in TVM. (reply to 17519)

Howard: there has data type BOC, Slice, and Cell (reply to 16756)

Dev: This might be useful given the defn of a BoC. https://ton.org/docs/develop/func/cookbook#how-to-iterate-cell-tree-recursively

Howard: Red area is the BOC data.  And the Green area is the Cell deserialization?

Howard: 🙈😵‍💫

Slava: It looks more like BOC represented as a byte array. (reply to 17547)

Andrey: green area - serialized boc in regular bytearray  b5ee9c72 - magic constant for BOC file format (reply to 17547)

Step: What data follows after magic constant?

— 2022-12-25 —

Howard: Yes, the original data structure I stored is like this, does that related?   I still can't read or decoded it properly once I want to read those data directly from Smart Contract then. (reply to 17550)

Howard: what is b5ee9c72 means? (reply to 17552)

Andrey: constructor prefix (reply to 17570)

Howard: it does... looks like magic

Andrey: its crc32 of scheme

Andrey: precalculated

Howard: For `toBoc method, is there any more description for how to use this method in `tonWeb?  - What is idx for? - What is crc32 usage? - What is cacheBits? - What is flags for? (reply to 17571)

Andrey: idx - indexed cells, for optimization purposes crc32 - checksum for boc cacheBits - cache bits for optimization purposes flags - reserved, always 0

Howard: TL-B schema of the data, yeh, I know what is the input I send in.  The TL-B schema is more like this, right?  Person#1 {   name:string;   age:int; }   Then basically is a big object called Cell[] from on-chain data. (reply to 17522)

Howard: seems not this issued (reply to 17579)

Howard: How about reading the data from Smart Contracts? (reply to 16579)

J: in etherscan, one could decomplie bytecode; how to do the same in tonscan,  fif -> func? as in etherscan, how to call the GET methods in toncan directly?

Gkiokan: Hey guys. Is it possible to have a marketplace feature with TON? Basically wanna get payments on a bot and then take a comision fee and send the rest of the money to the shop owner. By looking at the docs there is only described p2p send methods.

Vladimir: A little late, but blessed christmas 2022.

Stanislav: Hey, Maybe someone knows how to fix it toncli run_tests  INFO: 🌈 Start tests /Users/ololo/Library/Application Support/toncli/test-libs/bad_messages_generator.func:19:16: error: undefined function `generate_internal_address`, defining a global function of unknown type     slice ssrc = generate_internal_address()

Alex: Try toncli update_libs. Looks like you have old version. (reply to 17609)

MR: Guys, do you know any FunC video tutorial?

Dmitry: https://www.youtube.com/watch?v=RbIt8bjvvjE (reply to 17619)

Howard: anyone know why I got this error when I try to generate the deploy code? Wouldn't showed up before!

Howard: I used the template here to get deploy code https://github.com/ton-community/tact-template/blob/main/sources/contract.deploy.ts

Howard: what is TVMExecutionResultFail exit code 7 in TVMExecuteConfig?

doni: enum class Excno : int {   none = 0,   alt = 1,   stk_und = 2,   stk_ov = 3,   int_ov = 4,   range_chk = 5,   inv_opcode = 6,   type_chk = 7,   cell_ov = 8,   cell_und = 9,   dict_err = 10,   unknown = 11,   fatal = 12,   out_of_gas = 13,   virt_err = 14,   total };

doni: export const JettonDefaultWallet_errors: { [key: string]: string } = {     '2': `Stack undeflow`,     '3': `Stack overflow`,     '4': `Integer overflow`,     '5': `Integer out of expected range`,     '6': `Invalid opcode`,     '7': `Type check error`,     '8': `Cell overflow`,     '9': `Cell underflow`,     '10': `Dictionary error`,     '13': `Out of gas error`,     '32': `Method ID not found`,     '34': `Action is invalid or not supported`,     '37': `Not enough TON`,     '38': `Not enough extra-currencies`,     '128': `Null reference exception`,     '129': `Invalid serialization prefix`,     '130': `Invalid incoming message`,     '131': `Constraints error`,     '132': `Access denied`,     '133': `Contract stopped`,     '134': `Invalid argument`,     '4429': `Invalid sender`,     '13650': `Invalid bounced message`,     '16059': `Invalid value`,     '62972': `Invalid balance`, }

Howard: Even OpenAI can't understand error I think haha (reply to 17623)

Howard: You think it's Type check error? (reply to 17625)

Howard: seems the issued from TVMExecutionResult (reply to 17626)

Stanislav: By the way, it didn't help, but thanks for advise (reply to 17614)

Dev: can you try reinstall toncli? And if that does not work you might try recompiling func or getting latest binaries for func (reply to 17631)

Stanislav: Thanks, also did not help. Interesting the fact that I can build and deploy code but once I am trying run tests I am getting this error (reply to 17633)

Dev: Have you tried running it here: https://github.com/ton-community/ton-contract-executor (reply to 17635)

Stanislav: Hmm, I haven’t but I guess I will. It looks very friendly. Many thanks 🙏 (reply to 17636)

Dev: I think you are correct its definitely seems to be   type check exception. Next level is to debug and see what type check was being run when this error occurs. (reply to 17628)

Dev: I would create a test case with the parameters you have defined and then debug this test case. All the code including TVM is open source so get end to end debugging working first and it will help to resolve these issues and clarify each question

— 2022-12-26 —

Anton: Is there any difference between this two function declarations (FunC)?  tuple one() { (tuple) two() {   The question come from real code sample from latest contest: https://github.com/ton-blockchain/token-bridge-func/blob/main/src/func/jetton-bridge/votes-collector.fc#L109

User<356947730>: Hi! Bridge eth-ton broken? Last validation 9 hours ago.

Howard: Ok. So it’s not my .tact file get issued, nor the .func got error right. (reply to 17640)

Tim: Tact is experimental, you should not use it if for not tact development

J: pip toncli is broken, if use the github version, this error goes away, also the func, fift and lite-client needs to be patched with spycheese versions, but it's already way behind head (reply to 17635)

kl: How to get the storage fee of the transaction?

ethzanity: Hey guys, what does the number in load_uint(64) actually mean? Why is it sometimes load_uint(4)? Is it a pointer to an object in the slice or just the length of the integer that needs parising?  for eg in  slice~loaduint(64), what if my slice contained two uint variables?

Daniil: It's size of integer in bits (reply to 17660)

Daniil: load_uint(64) means load 64-bit unsinged integer from slice

ethzanity: But what if the slice contains 2 integers, one 32 bit and one 64 bit? (reply to 17662)

Dmitry: type BitString from "ton" is not assignable to type BitString from ton-contract-executor  Who knows how I can fix it?  Argument of type 'import(".../hello-world/node_modules/ton/dist/boc/Cell").Cell' is not assignable to parameter of type 'import(".../hello-world/node_modules/ton-contract-executor/node_modules/ton/dist/boc/Cell").Cell'.   Types of property 'bits' are incompatible.     Type 'import(".../hello-world/node_modules/ton/dist/boc/BitString").BitString' is not assignable to type 'import(".../hello-world/node_modules/ton-contract-executor/node_modules/ton/dist/boc/BitString").BitString'.       Property '#private' in type 'BitString' refers to a different member that cannot be accessed from within type 'BitString'.  contract = await SmartContract.fromCell(initCodeCell, initDataCell);

Alex: Generally int - 257-bit signed integers. But when we work with cells, we can write and read only significant for us part.  Supposed, that you know what you have stored in the readable slice (from the TL-B scheme or from the code of contract that built this cell-slice). In this case, you need to read 2 integers a and b in same order they have written into your slice cs. For example: int a = cs~load_uint(32);  int b = cs~load_uint(64);  You can find out some thoughts in this lessons. (reply to 17663)

Tse: Is it possible to create a hierarchical deterministic wallet on TON?

Tse: I knew that wallet v3 allows users to generate multiple addresses with the same public key, but since public key of each address might be a publicly available data, this approach doesn't seem to effectively protect privacy.

Tim: You can use standard HD path. Ton has its own id

fed: Please tell when I pay storage_fee for contract, it is paid for time range, when that time expired, will the coins be burned?

Daniil: storage_fees are paid on each transaction that happens with your contract (reply to 17675)

fed: https://ton.org/docs/develop/smart-contracts/fees#formula (reply to 17676)

fed: I see time_delta is used in the storage cost calculation (reply to 17676)

Myroslav: Doest tron provide any technical solution which we can integrate in our react-native app to deposit ton coin? by credit card?

Myroslav: Maybe some endpoints, sdks, webview, redirection to deposits??

Daniil: time delta is how much time has passed since last tx (reply to 17678)

fed: I understand, thank you! (reply to 17682)

TON technical overview: Check https://ton.app/exchanges (reply to 17684)

Myroslav: Is that all TON apps, or it's apps which have integrated TON ecosystem? (reply to 17685)

Myroslav: that's not what we need, we don't want to integrate, ability to buy ton thought the middle app, we want to integrate directly TON solution (reply to 17685)

Tim: This is not TONs job to handle. Ethereum foundation doesn't accept deposits for eth too. You can use mercury for ton for example.

🇷🇺 Angry: Hellow! I have a question about buying nft on getgems - I understand correctly - for buy nft I just could transfer proper amount to special-buying-nft-contract-address, then when transaction is done - that contract transfer nft to my wallet address? It’s all? Or being more schemas for buying nft on getgems (for example)?

Kirill: ​Introducing TON Connect 2.0  The TON community is launching TON Connect 2.0 today, an open-source standard allowing users to log in to internet services safely and without usernames or passwords.  This next iteration of TON Connect, launched in April, has received new yet important functions and was a genuine team effort from the community.  One of the key advantages TON Connect 2.0 has over its previous version is the ability to interact directly with decentralized applications based on TON. Users can now connect to mobile and desktop apps, Telegram bots, and other dApps in the interfaces of TON-based crypto wallets.  Connecting to apps happens in the wallet’s browser, and they’ll be available to be used in the wallet — without leaving the app.  TON Connect 2.0 allows users to sign in to online platforms with a single click, granting access to all of Web3’s use cases.  Tonkeeper already supports TON Connect 2.0’s standard, but other wallets have been working on implementing it.  We encourage developers and businesses to integrate TON Connect 2.0 into their products.  You can find TON Connect 2.0’s SDK documentation, helpful integration guides, and a description of the updated standard here: https://tonkeeper.gitbook.io/ton-connect-2.0-guide-for-sdk  TON Connect 2.0 has all the tools needed to become a network-wide standard. (forwarded from TON Community)

Kirill: congratulations to everyone involved!

Igor: Hello to all! Does anyone know how to view NFT sales history using TonWeb

User<5532445836>: Hello. Can I send NFTs from highload address?

User<2120380350>: Hello, when I use tonweb.js it tells me this

Slava: You need to get the API token for TonCenter API.

Slava: https://t.me/tonapibot

User<2120380350>: Where? (reply to 17706)

User<2120380350>: Thanks you (reply to 17707)

User<2120380350>: Error LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted

User<2120380350>: Cannot run message on account: inbound external message rejected by transaction

User<2120380350>: What could cause the error?

Slava: Hello guys!  May I ask you to vote for the JavaScript JSON.parse source text access proposal? It will allow us to parse big numbers that are stored in JSON documents.  I hope this will help moving it forward:  1. Put a star at the GitHub repository.  2. Put a thumbs up under this posts.  Thank you!

User<2120380350>: I don't quite understand what you mean by the message

Slava: Check the seqno. (reply to 17710)

User<2120380350>: It has spaces, shouldn't it take them? (reply to 17715)

Slava: What? (reply to 17716)

User<2120380350>: What is seqno?

Step: @slavafomin how to convert ip here https://ton.org/global-config.json  to readable ip address?

Party: Before sending a transaction, you first need to read the seqno and then pass this parameter when sending the transaction. The seqno is a kind of protection against incorrect transactions. (reply to 17716)

User<2120380350>: One second (reply to 17721)

User<2120380350>: I am doing a console log to seqno

User<2120380350>: seqno null

User<2120380350>: How do I correct it?

Slava: Just break it into four bytes. (reply to 17720)

User<2120380350>: I've lost sorry, how would it be? (reply to 17726)

Slava: See this: https://github.com/toncenter/examples/blob/main/deposits.js#L112 (reply to 17725)

User<2120380350>: I'm using  const PubK=Uint8Array.from(config.PublicKey);  const SecK=Uint8Array.from(config.SecretKey);

User<2120380350>: it keeps giving me null

Step: no idea how to convert this 84478511 into ip address like 1.1.1.1 (reply to 17726)

User<2120380350>: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state (reply to 17728)

User<2120380350>: I despair

Slava: I've sent you a complete example above. Please study it carefully. (reply to 17733)

User<2120380350>: I don't see the error :(

Slava: And now you have to change your API key, because it was compromised... (reply to 17736)

User<2120380350>: async function send_gramms(addr, amount) {     try {     const PubK=Uint8Array.from(config.PublicKey);     const SecK=Uint8Array.from(config.SecretKey);      const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '***'}));              let wallet = tonweb.wallet.create({publicKey: PubK});          const address = await wallet.getAddress();      console.log("Your address: "+address.toString(true,true));      var balance = await tonweb.getBalance(address);     console.log("Balance: "+balance);          const seqno = await wallet.methods.seqno().call();      console.log(seqno);      const transfer = wallet.methods.transfer({         secretKey: SecK,         toAddress: addr,         amount: TonWeb.utils.toNano(amount), // ton amount         seqno: seqno,         payload: '\xF0\x9F\x98\x81 ItchDesu Faucet', // Message         sendMode: 3,     });      //const transferFee = await transfer.estimateFee();      //console.log(transferFee);     const transferSended = await transfer.send();  // send transfer query to blockchain     //console.log(transferSended);     if(transferSended && transferSended['@type']=='ok'){         console.log('TON sent');         return true;     }else{         return false;     }      } catch(e) {         console.log('Error',e);         return e;     } }``

User<2120380350>: Sorry

User<2120380350>: I'm doing something wrong but I don't see the error

Slava: Try this: seqno: (seqno || 0),

User<2120380350>: Ok

Slava: https://www.browserling.com/tools/dec-to-ip (reply to 17731)

User<2120380350>: Good!!!

Slava: By the way, if the transaction was accepted by the HTTP API it is still doesn't guarantee that it will be completed. (reply to 17744)

User<2120380350>: Received (reply to 17746)

User<2120380350>: Thank you very much for your help.

Step: i think its wrong (reply to 17743)

Step: "addrs": [               {                 "@type": "adnl.address.udp",                 "ip": -1307380867,                 "port": 15888               }

Step: 77.237.12.131:15888 connection refused. (reply to 17750)

Nati: Looks like it's using the UDP protocol and you are trying to connect with TCP?

User<1424880488>: Hello, the tonkeeper app is decentralized, is it possible for the government to see my transfer and charge taxes?

Step: yes tcp (reply to 17752)

Step: i choose wrong server

Nati: It's not possible to know who owns a certain wallet, unless you publicly said it's yours. (reply to 17754)

Step: 🤕

Nati: And a better place to ask general questions about TON is here. (reply to 17754)

Step: how to listen for new blocks/transactions in adnl?

Daniil: You can listen to some specific shardchains. But currently there is usually just one shardchain because TPS is low (reply to 17760)

Step: yes but how? (reply to 17761)

Step: const TL_GETTIME = '7af98bb435263e6c95d6fecb497dfd0aa5f031e7d412986b5ce720496db512052e8f2d100cdf068c7904345aad16000000000000'

Step: this for getting time?

Step: i need something to get transactions

Daniil: I don't know how to do it but I think it's possible

User<5532445836>: Hello. Can I send NFTs from highload wallet address to another TON address ?

Daniil: You can send anything (reply to 17770)

— 2022-12-27 —

Howard: Any research report for TON L1?

Jhsu: would love this too (reply to 17791)

🇷🇺 Angry: Hi there! Can you get me some examples for manual transaction, how it composed, how generate payload, for simple transfer nft from my to another wallet? Or reading about.

🇷🇺 Angry: I googled much times and not found answer

🇷🇺 Angry: This is example of external service with params for transfering with tonkeeper:  "params": {   "source": "owner wallet",   "valid_until":1672111633,   "messages": [{     "address":"nft address",     "amount":"68568779", // strange amount, how it calculates?     "payload":"te6cckEBAQEAVQAApV/MPRQAAAAAAAAAAIAJbHMqtRChqxPdhONruHmDbIW0234234234234/JKIkpbAB1yAyuxOOygw/zFrDV0iSDZdyS0uM+sadfaAFSDFasdfd45rsdfa==" // what is it? How it generates?   }] }

🇷🇺 Angry: But how to make same transaction, calculate values for sending with toncenter/tonweb library?

doni: you can checkout the fift wallet code … but reading fift is a bit hard   or you can go over the ton (npm) library  and view the wallet create transfer method (reply to 17794)

doni: https://github.com/orbs-network/single-nominator/blob/main/test/e2e.ts

doni: checkout line 115

🇷🇺 Angry: Thank you! (reply to 17800)

Pranav: Hello

🇷🇺 Angry: I read code, but even not sure that is about NFT transfer… Isn’t there even one example of anyone? It’s just common case of NFT transfer… (reply to 17800)

🇷🇺 Angry: Please anybody, help

🇷🇺 Angry: Maybe exist approach how to understand of standard NFT contract works. It’s same approach for erc NFT on ton and solidity networks or different?

doni: you can checkout tonweb examples (reply to 17806)

🇷🇺 Angry: I just need only two cases - mint standard ton nft and transfer them to another owner (reply to 17814)

🇷🇺 Angry: I need do it with node.js script

🇷🇺 Angry: with javascript api

doni: 1sec

doni: https://github.com/toncenter/tonweb/blob/master/src/test-nft.js

doni: good luck

🇷🇺 Angry: I understand correctly? I think that I need create mounted contract of nft that I want interact, then call that methods for transfer and mint? I'm wondered - how call contract method was transformered to        "messages": [{          "address":"EQBU5XFJ871oiBjmmSmbQQOlbPMIIltkHhiPfz-asdfasdfads",          "amount":"68568779",          "payload":"te6cckEVAQEAVQAApV/MPRQAAAAAAAAAAIAJbHMqtRChqxPdhONruHmDbIW0z3ZYxjklMLG/JKIkpbAB1yAyuxOOygw/zFrDV0iSDZdyS0uM+B8PnIa1X5PONehzEtAIjPgFiB=="        }]      }

🇷🇺 Angry: How appear payload? What that means?

🇷🇺 Angry: And also in https://github.com/toncenter/tonweb/blob/master/src/test-nft.js - using local contract files, but I need to use already mounted contract (nft in mainnet)...

🇷🇺 Angry: Thus, another question, how I can get  const {NftItem} = require("./contract/token/nft/NftItem"); file of already mounted contract (of nft) ?

— 2022-12-28 —

User<1738271217>: Heyy, i found a critical bug in TON chain is there any bug bounty program

Tse: https://github.com/ton-blockchain/bug-bounty (reply to 17856)

Marsel: Hi all!  I've sent tons from erc20 to ton blockchain via https://ton.org/bridge/, but I haven't received it in my wallet. transaction has confirmed in erc20 who can help me with it?

Hartmann D.: Please address your issue to @ton_help_bot (reply to 17861)

Hartmann D.: Hi Abdul! Thank you for your offer. I will forward it to the team for sure. BTW, you can see all available vacancies here jobs.ton.org (reply to 17867)

Howard: What is store_uint(0x18, 6)?

Dario: this stores the flags of the message. to easy read, i suggest to check  https://github.com/TonoxDeFi/open-contracts/blob/main/contracts/messages/messages.func (reply to 17871)

Howard: flags of the message! (reply to 17872)

Dario: yes (?)

Howard: this is more like "the standard", right? Nice (reply to 17872)

Dario: no, it cover some of basic messages that can be used in contracts in simpler way, but doesnt cover everything

Howard: oh, got it. Like the MethodCode.

Dario: its func library, its not releated to tact or anything like that* (reply to 17876)

Howard: ohhhh ok. Thank you. It make sense.

Howard: FunC looks not that difficult to learn. But it is harder to set environment than TACT 🤣

Howard: I still can't run properly on my MacM1

Howard: Sorry, why this message function is different others?  Only it use (0x10,6). Others using store_uint(0x18,6) (reply to 17872)

Anton: I am also newbie in ton development and I found the easiest way for myself to use ton development tools:  # FunC lessons without installing anything to your operating system  ## Disclaimer Unfortunately *anything* means that you should have docker installation able to access your local filesystem (or its part) with volume mounts. You should do it yourself anyhow.  ## Environment preparation  docker pull trinketer22/func_docker alias toncli='docker run --rm -it -v ``pwd``:/code -v toncli:/root/.config trinketer22/func_docker'  Use all commands as described in lessons. (reply to 17883)

Dario: it means no bounce flags, the message wont came back if the execution fails (after removing fees). Can be used to initialize a wallet when there is no code (reply to 17885)

Anton: You can install docker on MacM1 with colima, for example. https://github.com/abiosoft/colima

Dario: two note:  - errors during action phase wont trigger a bounce message - the bounced message will contain only the first 256 bits of the message body, without reference and so on (reply to 17887)

Howard: cc bounceable-messages (reply to 17889)

Howard: After reading deeply in NFT Standard.func, every indexId of NFT token should have different amount? (it's will more like ERC1155)  will it should able to set with different Royalties Fee?

Howard: Would like to know why queryId can be a "arbitrary request number" when I want to transfer the NFT.

Amin: Sometimes contracts send new messages back, notifications to the caller contract, It will have this query_id in its body. Caller uses it to distinguish the received response belongs to which call of it. (reply to 17898)

Howard: OK, then it's a number that can 'randomly' decided by caller, then the Smart Contract that being received the message can know that it's coming from the same caller / same Tx request? Is that correct?

Tim: no (reply to 17912)

Gkiokan: I am a bit lost. Can we have a way to deep link the Wallet with params so we can recieve TON as payment currency for a e.g. eccomerce shop bot?

Tim: yes, ton://transfer (reply to 17914)

Gkiokan: Any docs / api on that?

Tim: it should be documented somewhere on official docs (reply to 17916)

Tim: https://developers.tonhub.com/docs/transfer-link

Tim: you can replace https://tonhub.com with ton:// and https://app.tonkeeper.com(not 100% sure about right url)

Howard: can you explain more @TrueCarry ? (reply to 17913)

Gkiokan: Sounds promissing. Thanks.

Tim: previous message explained everything (reply to 17920)

Gkiokan: What is actually the correct jsonRPC if I want to check my wallet? toncenter or tonhub?

Tim: For tests doesn't matter, for your app - use your own instance (reply to 17923)

Gkiokan: Cuz I found this guide here but this one opens the payment links in the other wallets, I just want to stay in TG and let the user pay with their integrated wallet. I will try what you have said and report back.

Tim: oh, you mean links, not rpc.  I usually display all 3 of them

Tim: because some links don't work on some device/os combinations

Gkiokan: The RPC is for checking the Transactions then if user x has paid transaction with comment y already

Tim: use your own toncenter instance (reply to 17928)

Gkiokan: The guide I found was this one here (they are rare?) https://ton.org/docs/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-js

Gkiokan: Isn't the  https://testnet.toncenter.com/ for that? I will check the docs for that. (reply to 17929)

Tim: it's for tests and development, not for prod usage

Gkiokan: Yea thats fine. In theory I should be able to set a couple payment links for the user and let them pay and search for the transactions on the testnet. (Working on a ecommerce shop bot)

Daniil: I heard that you can get them back by simply sending a number NFT to yourself

Red: Successful thank you

Howard: Is there any NFT marketplace has testnet in TON?

Howard: That I can check the implementation of my code follows the TEP standard.

&rey: testnet.getgems.io (reply to 17949)

TonD: Hello!  Somebody knows how to create tuple with 256 positions onside?  Regular tuple takes only 16 positions.

Step: @slavafomin ton js library is broken?  how do i getseqno?  how to run method like getWalletInformation  ?

Slava: What library? (reply to 17956)

Step: https://github.com/ton-community/ton (reply to 17957)

Step: readme  example is no longer valid?

Slava: tonweb: httpProvider.getWalletInfo() (reply to 17956)

Slava: I have nothing to do with this library, sorry. (reply to 17959)

Step: this is not tonweb (reply to 17958)

Step: hmm

Step: ton.org says tonweb is legacy tonjs is modern

&rey: Push elements one-by-one by ~tpush function / TPUSH assembler instruction. However, tuples in TVM can contain up to 255 elements. (reply to 17954)

Slava: Where? (reply to 17964)

Step: https://ton.org/docs/develop/dapps/#javascript-sdk (reply to 17966)

Step: you had contributed to that repo 🤔 (reply to 17961)

Slava: I did ) (reply to 17968)

Slava: It was a very small fix long time ago.

doni: npm ton  is my choice

Step: but ton library is broken (reply to 17971)

Step: while they attempt to divide into ton-core

Step: there is no relation to current codes and whats shown in readme.md as example.

Muhammed: Hello everyone, guys how I can learn coding on Golang working with TON coin, can you please recommend me some resources to study

Slava: There's a library for Go: https://github.com/xssnick/tonutils-go (reply to 17980)

Jaimin: Is the TON grants program still running?

Victor: She's not running, she's walking... slowly (reply to 17986)

— 2022-12-29 —

Gkiokan: whats the difference from tonhub vs toncenter?

Gkiokan: aren't they getting the same data from the blockchain of TON?

Jaimin: So is that a yes? (reply to 17988)

Howard: Hi, what is ^[xxxxxxxx] here means?  is this mean it is a Cell, and inside this Cell, has 2 parameters in Cell as well?

Alex: This is Cell reference. You can learn here. (reply to 18003)

Nick: Yes, right. (reply to 18003)

Howard: So those 2 parameters (dataTypeL: Cells) also combined and store in a new Cell? (reply to 18004)

Денис: Hello everyone, I get data from the c7 storage using get_c7(), tell me how to get to the values that are in the tuple?

Alex: You should use tuple functions to read them. You can find these functions here and here. But, in your case, are standard functions for c7 register useless? (reply to 18012)

TonD: Thanks. But I have already array for 255 pos (reply to 17965)

Gkiokan: When I am working on the testnet, Do I need a different "test" wallet?

Gkiokan: And if yes, how I am supposed to create it?

Nati: You can use your main wallet in testnet. (The wallet is not deployed unless you deploy it on the testnet.)  Your address will change a little.  Just to note that it's a little dangerous, since you may use your mainnet wallet instead of the testnet wallet accidentally.  I recommend creating a new wallet for testnet 🙂 (reply to 18021)

Nati: To use a wallet in testnet you need to change networks so the application will know to talk with testnet. What wallet are you using?

Gkiokan: To be honest I have no clue. I just create a wallet with the TG Wallet Bot as it was promoted as "integrated wallet system in TG" (reply to 18024)

Gkiokan: I am building a eccomerce shop with crypto payments for orders, so I have a couple env variables I can set this won't mix up. But I have no clue how to proceed

Gkiokan: Ideally would be the feature "pay with your TG wallet -> opens the TG wallet and you pay and you are done"  But I have seen tonhub and toncenter transfer URL's which was used in buttons.

Gkiokan: How do I deploy my wallet to the nets?

Nati: A wallet is deployed most of the time on the first outgoing transaction.  You can still recieve funds when your wallet is not deployed.  To create a wallet in testnet you should use a non-custodial wallet. You can choose one from here but I don't know if all of them are capable of interacting with testnet. (reply to 18025)

Nati: I used TonKeeper to create a wallet in testnet.  To switch to Tonkeeper's testnet, tap the version 5 times in the settings.

Nati: If you need any help feel free to ask questions

Gkiokan: Thanks for the suggestion. I could create a wallet on the wallet with this link here https://wallet.ton.org/?testnet=true

Alex: Some clues for you https://ton.org/docs/participate/wallets/apps.  Also, recently was updated standard for wallets - Ton Connect 2.0 , developers right now updating their wallets.  But this is about non-castodial TON wallets, I'm not sure what do you mean about "pay with your TG wallet". (@CryptoBot, @Wallet ?) (reply to 18026)

Gkiokan: After that I could get the transactions working on the endpoint, which seems to work now.

Nati: Yep this also works (reply to 18033)

Gkiokan: My ecommerce shop bot does create payment links based on the guide on ton.org I just want it easy as possible without interacting with 3rd party wallets. (I mean the wallet is integrated in TG right?) My Ideal solution would be that the "pay with Wallet" button just opens the TG Wallet thing and the user pays. Afterward I need to check if the Transaction has been done with getTransactions (reply to 18034)

Gkiokan: Actually ton://transfer/.... didn't react to anything sofar

Alex: Wallets on your pic is not TG wallets(Wallet, TonHub, Tonkeeper  TON non-castodial wallets). From what you said about expected business process, all you need is implementing payment request via qr/deeplink for non-custodial wallets and check transaction as you said.  About ton://transfer/... was something about TG application will not allow use it for Android.  UPD. Found it here. Because of that Tonkeeper and Tonhub has their own alternative deeplinks. For example for Tonkeepr: https://app.tonkeeper.com/transfer/<address> https://app.tonkeeper.com/transfer/<address>?amount=<nanocoins> https://app.tonkeeper.com/transfer/<address>?text=<url-encoded-utf8-text>  Tonhub transfer links here. (reply to 18037)

soheil: Hello everyone, I have a ready project that I want to connect to TON.  Can anyone guide me?

Jordan: Hi everyone I would like to know if it's possible to export CSV on https://tonscan.org/ ?

Party: no (reply to 18043)

Gkiokan: yep makes sense. But for clarify, the @wallet is the Wallet that TG has integrated and it is even accecable though the attachment menu in the app itself . So is it still considered as non-castodial?   About the deeplinks for Tonkeeper and TonHub you are right and I need to stick for them to be ued like this and it's fine enough when I can pass amount and context (in my case the Order UID) (reply to 18039)

User<5718323121>: I am new on ton

User<5718323121>: I downloaded fift on ubuntu 18

User<5718323121>: and run fift

User<5718323121>: but I got error message

User<5718323121>: Illegal instruction

User<5718323121>: how to solve this problem?

Jordan: Any other metod? would like to filter an adress with a specific Memo (reply to 18044)

Dev: I would install git and clone the ton repo and build it fift yourself. If you create a build directory it will end up in /build/crypto when you follow the build instructions (reply to 18051)

Dev: add /build/crypto to your PATH

Dev: it might also be that you need to download the other dependencies so you could try that first but building is the best way to have latest fift

Alex: Custodial wallet @wallet is telegram web app, that in my understanding is not equal TG integrated wallet. Anyway, I didn't see any information about payment request in @wallet. Just now looked through, and still seems they have no implemented such feature. (reply to 18045)

Yuri: Hey guys, where I can find previous challenges questions to practice?

David: The @wallet bot does not let my buy... (reply to 18057)

Alex: Here is TON developer's chat. Please, ask support https://t.me/wallet_supportbot. (reply to 18060)

Alex: Do you mean Ton Smart Challenge? (reply to 18059)

Yuri: Yes (reply to 18062)

Jordan: Any idea? (reply to 18052)

Gkiokan: I guess you need to loop though and check / filter the tx by the value you want and you are done? (reply to 18064)

ប្រុស: What mean Ton Smart Challenge? (reply to 18062)

Yuri: Yes (reply to 18066)

Gkiokan: Why the hell of earth I can trigger the endpoint for getTransactions on my Postman, but my bot does return 404 on the exact same URL? Both request are made from my local machine. https://testnet.toncenter.com/api/v2/getTransactions?api_key=:key&address=EQCfM-fy18pnCQOvlWFUAbsC02S9CDMVc74f56104R9aQOoz

Alex: #1 https://github.com/ton-blockchain/func-contest1 #1 Tests https://github.com/ton-blockchain/func-contest1-tests  #2 https://github.com/ton-blockchain/func-contest2 #2 Tests https://github.com/ton-blockchain/func-contest2-tests  #3 https://github.com/ton-blockchain/func-contest3 #3 Tests didn't uploaded to public repository. (reply to 18063)

Yuri: Much obliged (reply to 18069)

David: Thanks sorry for the spam! (reply to 18061)

User<5718323121>: I downloaded fift on ubuntu 18 and run fift but I got error message "Illegal instruction" how to solve this problem?

Nati: Someone already answered your question here. (reply to 18072)

User<5718323121>: I see, but I need more detail help (reply to 18073)

User<5718323121>: I can`t find fift source on https://github.com/ton-blockchain/ton

Alex: Did you follow this guide?

User<5718323121>: yeah

User<5718323121>: I`ve done

User<5718323121>: I am working on ubuntu 18.04

User<5718323121>: and fift url is https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-18-0.3.0/fift

User<5718323121>: Is this problem with 18.03 and 18.04?

Alex: Perhaps, sometimes binaries expired.  Unfortunately I have no experience with any Ubuntu OS. Maybe somebody else already faced this before. (reply to 18081)

User<5718323121>: how to find source of fift?

User<5718323121>: I`d like to compile on my ubuntu

Alex: It pretty accurate described here You have to build whole repository and fift will be in the /build/crypto dir. Also some guides for building here.  UPD. I also see here some target build, but never tried this. (reply to 18083)

Dmitry: Is there any functionality in a TON smart-contract for working with time? - repeating an action after some time interval (send message, get data) - to do an action at specific date or time

ប្រុស: Yes I'm here

Thisu | degen.linea.eth: How can i access wallet from the private key, is there any wallet supporting this?

doni: check out ton-crypto

doni: npm package

Mark Okhman on TON: The topic of contract code verification has been in the active discussion for quite some time. I was very much interested about how this could actually work, because this is one of the building blocks to a truly decentralised and trustless, yet mass-adopted, ecosystem.   We've had an outstanding conversation with Shahar Yakir from Orbs team on the ways to bring this into TON ecosystem. This is the real good quality content. Please share that with anybody interested in TON, as we should spread this kind of educational materials, in order to make one billion userbase to happen.  https://www.youtube.com/watch?v=qJOEWL560Lc (forwarded from Mark Okhman on TON)

Mark Okhman on TON: Hello guys, recorded a very cool indepth talk with Shahar about ton contracts verification

Mark Okhman on TON: It's definitely worth your time to watch it through, enjoy!

Channel<1596666163>: Guys I don’t understand Fift

Channel<1596666163>: Can I write smart contract in Russian

soheil: Hi guys I'm new where should i start to learn 🤔

Andrey: You can define words in fift on Ukrainian and code on it (reply to 18099)

Channel<1596666163>: Does anyone even know Fift??

Coalus: no (reply to 18102)

Channel<1596666163>: I think even Nikolai Durov didn’t understand this sh

Andrey: I know. I made fift interpretator on kotlin (reply to 18102)

soheil: Hi andrey i have a project in Android studio and i want to move it to Blockchain how can i do it? (reply to 18101)

Andrey: what you mean of "move to blockchain android studio project"?

Channel<1596666163>: Why we just cant write code in Russian language

Channel<1596666163>: At least english

Channel<1596666163>: Pls make a new coding language for TON and call it: Tegro Lang: Tang!  So devs would be able to write code in Russian language or English

soheil: What I mean is how to convert it into blockchain language (reply to 18107)

&rey: You can try putting your idea text as input to ChatGPT/GitHub Copilot and let it generate the code. The safety of resulting code is questionable, though. (reply to 18109)

Andrey: You can compile 1C code to LLVM and use LLVM compiler by tonlabs for compile in TVM (reply to 18108)

Andrey: In theory

Channel<1596666163>: Boring

&rey: Yes, with the same probability that you will disclose your own mnemonic by doing so. 😁 (reply to 18115)

Andrey: cringe (reply to 18119)

Andrey: Please don't flood in Dev chat. Jokes are awesome, but we need to work .-.

Nati: Maybe it's worth putting the chat in slow mode to avoid spammers

Coalus: or just ban spammers (reply to 18124)

Nati: Yea that's a bit extreme but also works

Mr. Milchik: Hello, we are building a full-stack team for a hackathon. Online. We have ideas and a lot of  experience in hackathons. If interested, DM.Hello, we are building a full-stack team for a hackathon. Online. We have ideas and a lot of  experience in hackathons. If interested, DM.

Mr. Milchik: Or run topics ... (reply to 18124)

Kamil: Hello, what's the exact meaning of proof of work giver contracts and what's the type of work involved?

Slava: This is history. They are no longer operational. (reply to 18134)

Kamil: And how does the token emission work now? (that info is still up on the website BTW)

Slava: Please look at the docs regarding validation and PoS. (reply to 18136)

Kamil: OK thanks

— 2022-12-30 —

User<5391384595>: Can anyone share ton chain explorer?

User<5391384595>: @admin (reply to 18149)

Alex: https://ton.app/explorers (reply to 18149)

User<5391384595>: None of them working!... i wanna search for a transaction using transaction id (reply to 18151)

Daniil: Try ton.cx (reply to 18155)

User<5391384595>: Ok thanks (reply to 18156)

doni: https://github.com/ton-defi-org/tonstarter-contracts (reply to 18100)

Howard: anyone know why I got Actions Failed? (reply to 17885)

User<5391384595>: Because of your mistake😅 (reply to 18161)

Howard: code has the bug?

Howard: but why I still can compile the code then

Howard: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md

Howard: What is "NFT collection with sequential NFT index provide easy way o association and search of linked NFTs." means?  Like "Some NFT collections might be not the index based?" (reply to 18165)

User<5718323121>: I compiled fift on ubuntu, and run fift then I got same error message "Illegal instruction"

Lev: You use the index and the collection address as the initial data for the NFT item contract. That allows you to compute the address of the item from the collection - since in TON, contract addresses are computed like hashes using initial data and code Some collections are not index-based: for instance, for domains you don't have an enumeration of domains - instead, the "index" of an item is the hash of the domain (reply to 18166)

Howard: ok, understand. That is why Domain NFT is not the collection that based on Index ID.

Howard: I am trying to implement NFT standard in Tact. This is why. I thinking where to set the parameter next_item_index.

User<5718323121>: Hello, everyone! I am gonna to create smart contract on ubuntu. But I got some trouble at the beginning. I downloaded fift and execute it, and then I got error message "Illegal Instruction".  So I compiled it over 4 hours, but still same erro message.

User<5718323121>: Please help me

User<5718323121>: very basic problem!

Howard: For instance, if I (the user) want to create a NFT collection, he should decide this feature initially?

Alex: I can't help you with build issue, but as temporary tool creating your smart contract you can try alternatives without binary files:  1) Toncli via from docker, then try figure out creating smart contract from here. 2) Use ton-compiler, that js library needn't binaries. (reply to 18171)

User<5718323121>: Thank you! I am setting up environment. https://ton.org/docs/develop/smart-contracts/environment/installation (reply to 18175)

User<5718323121>: I can`t run fift and func and lite-client

User<5718323121>: "Illegal Instruction"

Lev: Wdym? In an indexed collection, you store this variable and increment it every time you create an item (reply to 18174)

Lev: So you create an item with collection address and current next_item_index as starting data, then increment the index variable in collection

Dario: Hello guys, I have a question. Is this the right way to "hardencode" a value in TL-B? In my case, I want to hardencode an 32bit leng opcode  stuff_op#25938561 = StuffOP;  nvm looks like it is

Howard: do you know why my tx failed in here? Didn't get any error when compile (reply to 18181)

Lev: Runtime error, you should look at the error code

Alex: Yes, I see. I mean you can use alternatives for your main problem "creating smart contract" if you can't compile this at all. Unfortunately I don't know how to solve your building issue. (reply to 18178)

Lev: Also, I would recommend writing tests and debugging locally (reply to 18184)

Howard: How to fetch error code. I use dton explorer. (reply to 18184)

Andrey: Actions failed means, that messages you want to send can't be send. Usually this means you want to send more amount that you have on contract (reply to 18183)

Howard: It’s a token contract. So…. Maybe the logic about fowardFee calculation were wrong. (reply to 18190)

Howard: TVM is complicated🫠

Andrey: I's not runtime error, otherwise dton display computation phase exit code. The computation phase works successful, but action phase failed (reply to 18184)

Howard: Oh. Ok. Thanks. (reply to 18193)

إلياس: same question (reply to 18100)

Howard: "Auction Phase" failed usually means....? (reply to 18193)

Andrey: No_funds: 1, you're trying to send more than you have on smart contract (reply to 18197)

Howard: Thanks. Then how do we bounce the TON back for the failure Tx in 'Action Phase' (reply to 18198)

Andrey: You can't do that, only computation phase is bouncing (reply to 18199)

Howard: then I don't know how to debugging now 🥶🤮😥

Lev: Write tests to do stuff locally

TonD: Somebody knows ton apps which use base64 addresses instead of base64url?

Howard: 🥺 (reply to 18202)

Howard: I just deploy my own NFT collection in testnet. But can't see it on testnet of getgems.io. Why? and how? (reply to 17951)

doni: https://testnet.getgems.io/

User<5036552867>: Hello. I'm setting up the development environment. But I can't download "fiftlib.zip". Not found error occurred. Is there any other way?

Nati: Binaries from the repository releases should work. (reply to 18224)

Howard: it's super super tough lmao (reply to 18202)

Tim: no (reply to 18227)

Tim: https://github.com/getgems-io/nft-contracts/

User<5036552867>: thank you! (reply to 18226)

Lev: It's definitely OK for FunC (look at toncenter/tonstarter-contracts), idk about tact, but should be fine (reply to 18227)

pid | ton: how should i start

Howard: I am implement it to TACT language. I can't code in FunC at this moment. (reply to 18229)

Tim: It doesnt matter, tact is compiled to fift/boc anyway

Howard: question is that, followed TEP0074, why there has two different parameters as "owner"? (reply to 18235)

Tim: it's not owner

Howard: can you tell the difference for response_destination and new_owner?

Tim: new owner gets forward amount and payload response gets unspent money

Howard: but this is NFTs, no quantity in standard tho?

Tim: what?

Howard: Or` response_destination` represent the Collection contract itself.

Tim: response_destination is address where you want unspent money to return

Tim: you send 2 tons to nft for transfer, it uses 0.1, returns 1.9

Howard: More like bounced feature? Okok

User<5718323121>: I am looking for TON smart contract developer

User<5718323121>: please dm me

Howard: hi @D030N, I just implement NFT standard in TACT language and test it out. Right now my code and Txs were all success. But can't see it on https://testnet.getgems.io/.   Is it because the NFTs I created doesn't have the content or the royalty parameters?  If so, any content parameters I can use to test it out. (reply to 18218)

Tim: https://testnet.explorer.tonnft.tools/

Tim: What this site says

Howard: unfortunately, can't call even use the example addres

Howard: But thank you for support, this is the tool I exactly want!

Howard: well, it's not able to click still lmao (reply to 18251)

Tim: it means your get_nft_data is most likely corrupted

Tim: oh you mean example, yeah, it doesnt work

Tim: EQBENzLLw57mCHvc4KawY0Kyk4iZfpMS_nbXSGCPfReGzoY0 works with this one for example

Tim: you should use you contract compiled cell to test get_nft_data with ton-emulator or python tontvm, and compare return with known good nft

Howard: ton-emulator?   Do you have the template that I can test out by using the upgrade method for the collection? ( (reply to 18257)

Tim: Right

Howard: I mean the content / royalty fee setting should be upgradable. Right? (reply to 18262)

Tim: In default contract Royalty fee is set in collection. In nft single royalty is inside nft item

Tim: You should check out func sources

Tim: Getgems repository contains tests for nfts

Howard: 🥹🥹 I am building on Tact.

Howard: If my contract built by Tact is correctly follow the TEP0074, then it should be passed successfully on the tool. Is that correct?   https://testnet.explorer.tonnft.tools/ (reply to 18265)

Tim: more or less

Tim: in this one yes (reply to 18269)

Howard: What do you mean more and less 🥹🫠

Tim: when you say 'passed' it usually means tests, i thought about getgems

Tim: i've already said it, it doesn't matter func compiles to fift and tact compiles to fift (reply to 18268)

Howard: Ok. Let me try. Because there is more I can expand. For example, TEP74 not even asked for Mint functions like EIP721.

Tim: check get_nft_data response

Howard: Yes. Correct. So I am trying to let my Tact file can get similar Func in the end. (reply to 18274)

Mark Okhman on TON: We're getting closer to New Year's Eve, so let me continue bring you nice gifts 🎁  Interview with Tal Kol - TON's ambassador and one of the best TVM developers. Enjoy!  https://www.youtube.com/watch?v=UkMk6IUm6Cg (forwarded from Mark Okhman on TON)

Mark Okhman on TON: Hey guys! Enjoy watching the interview with Tal!

Howard: Why I can't get this account's info in dton 🤣🤣🤣 https://testnet.dton.io/a/EQBENzLLw57mCHvc4KawY0Kyk4iZfpMS_nbXSGCPfReGzoY0 (reply to 18256)

Tim: too old probably

zzss: Hi guys! Can you help me? Is it possible install ton blockchain receiver locally to get them via api locally instead of using toncenter?

Gkiokan: Which endpoint do you use to convert EUR to TON amount?

Gkiokan: I checked binance, but they have only tonwal/btc tonwal/tetherus combi

Dario: @wallet (reply to 18287)

Gkiokan: Programmatically? (reply to 18289)

Dario: binance doesn't support ton, check okx

Alex: Here was similar issue, maybe makes sense for you.

Gkiokan: I will try. Is the price lookup actually free to use of without an api key? (reply to 18292)

Dario: API requires api key

Gkiokan: Honestly I am blind or can't find the endpoint for the ticker / prices https://www.okx.com/okc/docs/dev/docs/api/http.html (reply to 18296)

— 2022-12-31 —

Howard: Hi all, about TEP62-NFT standard, when should we able to let user enable to trigger this message  ReportStaticData(0x8b771735)

MR PROTON: Happy New year to all TON community! Get in the mood! Ho-ho-ho! ❤️😊🫶

🇷🇺 Angry: Hello! Where I can get help with bad, unhonest  behavior of getgems employee?

🇷🇺 Angry: I'm a biggiest nft owner in getgems interesting nft collection

🇷🇺 Angry: But I run into dishonest behavior of employee, telegram chat moderator banned me for no reason!

User<1738271217>: Dump it!! (reply to 18314)

🇷🇺 Angry: What do you mean, bro? (reply to 18316)

Mike: do these get gems people have any relation to the app get gems on telegram years ago?

🇷🇺 Angry: Exactly I don't know, but getgems (as is) maked not so long ago (reply to 18319)

User<1738271217>: Dump the nfts (reply to 18318)

🇷🇺 Angry: How to? NFT haven’t short positions (reply to 18323)

🇷🇺 Angry: I’ll hack them later and will get all the money from ton

F: This chat is exclusively for discussing development issues. All other topics are outside the scope of this chat. (reply to 18314)

Howard: anyone know how to put json file to the Cell data type in TypeScrip? (reply to 7385)

Tim: I've already gave you link to exactly that in pm (reply to 18331)

Party: You wrote five messages and they are absolutely stupid, because they do not contain any information about the error. Therefore, no one will help you, good luck.  UPD: The only message that has value was the sixth, and the answer to it is @ton_help_bot (reply to 18337)

Howard: is there has the way through ton package to turn .json data to a Cell format? 😁😁😁 (reply to 18332)

Андрей: You are stupid, no one can block your wallet on the blockchain. (reply to 18342)

Tim: 🙈🙈

Howard: ohhhhh I got it

Howard: Sorry, not a TS expert

Step: how to convert this address into normal account address?

Step: @TrueCarry (reply to 18351)

Tim: new Address(workchain, hash)

MR PROTON: ❤️ Happy New Year to all TON community!   😎 Turn on the New Year's song about TON and get charged with the mood of the crypto feast!

User<1237546490>: Happy New Year everyone!  Dev community, We launched DEX on TON this New Year's Eve 🍾🍾🍾  Come to test https://Tegro.finance

𝐴𝑅𝐸𝐹 𝑆𝑆: can someone give my a New Year's gift through @GiftsTonBot?

— 2023-01-01 —

Yuri: Hey guys, I'm having a problem when trying to run tests: C:\Users\yuria\AppData\Local\toncli\toncli\test-libs\__init__.func:1:1: error: cannot open source file `address_helpers.func`   #include "address_helpers.func"; PS: address_helpers.func is there in the parent dir PS2: Already ran update_libs.

Howard: anyone try out implement ERC1155 in TON as well? Any marketplace? 🤣 (reply to 18257)

Nasir: Happy new year my developer friends . wish you a great year . Ton Partisan team 💎

Howard: Happy new year guys!

Howard: Seems https://testnet.dton.io/ is down right now. 😥😅 @tvorogme

Be the Future of Web3: Happy New Year! Anyone in Dubai interested in chatting. DM me. Development/CEO

Behrang: Excellent video, thanks. Looking forward for the second part. (reply to 18278)

Yuri: Hey guys, I'm trying to test a recv_internal function: () recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {   (slice sender_address, _) = parse_sender_address(in_msg_full);   slice owner_address = load_data();   var msg = begin_cell()         .store_uint(0x10, 6)         .store_slice(owner_address)         .store_grams(0)         .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)         .store_slice(sender_address)         .store_ref(begin_cell().store_slice(in_msg_body).end_cell())       .end_cell();   send_raw_message(msg, 64); }  With the following test case: int __test_fwd_message() {   slice owner_addr = get_owner_addr();   slice sender_addr = get_owner_addr();    set_owner_addr(owner_addr);    cell in_msg_body = begin_cell()       .store_uint(10, 4) ;; 1010     .end_cell();      cell in_msg_full = begin_cell()       .store_uint(0x6, 4) ;; 0110       .store_slice(sender_addr)     .end_cell();      var (int gas_used, _) = invoke_method(     recv_internal,     [12345, 10, in_msg_full, in_msg_body.begin_parse()]   );    slice actions = get_actions();   actions~load_ref();    int prefix = actions~load_uint(32);   throw_unless(100, prefix == 0x0ec3c86d);    int flag = actions~load_uint(8);   throw_unless(101, flag == 64);    cell msg = actions~load_ref();   slice cs = msg.begin_parse();   cs~skip_bits(6);    slice dest_addr = cs~load_msg_addr();   throw_unless(102, equal_slices(dest_addr, owner_addr));    int grams = cs~load_grams();   ~dump(grams);   ;;throw_unless(103, grams > 0); FAILS    cs~skip_bits(1 + 4 + 4 + 64 + 32 + 1 + 1);    slice sender_addr = cs~load_msg_addr();   throw_unless(104, equal_slices(sender_addr, sender_addr));    slice fwd_msg_body = (cs~load_ref()).begin_parse();   int fwd_msg_value = fwd_msg_body~load_uint(4);   throw_unless(105, fwd_msg_value == 10);    return gas_used; } When I check if the amount of grams is greater than 10 (the amount I provided to int msg_value), it doesn't pass the test. Anyone know the problem?

Yuri: I was wondering, maybe the forwarding of remaining grams after paying for fees (mode 64) substitution in the internal msg occurs afterwards?

Thienmylyhiep: This is an incomplete list of what has been done in 2022. A lot of new people and development teams came into the TON, and a lot of new services and applications were created.  Clearly, we all made a quantum leap this year, just as we did in 2021 when we resurrected TON project.  Despite significant volatility in the crypto industry and around the world, we continue to move forward consistently to make a truly global and massive blockchain network.  Let's do something fantastic next year. (forwarded from TON Rewind 2022)

Thienmylyhiep: TON Developers  — Programmer contests and hackathons began to be held on a periodic basis - a dozen contests were held this year.  — TON has become a sponsor of the competitive programming platform Codeforces.   — Libraries improved, new libraries created: tonweb, ton.js, ton3.js, Kotlin, Rust, Go, Java, Python, Swift, C++.  — Improved and created new APIs: Toncenter, Toncenter Index, TonApi, DTon GrapQL, Foxtails for NFT, GetBlock.   — IDE plugins and development tools created: IntelliJ IDEA, VS Code, toncli, MyLocalTON.  — New documentation, tutorials and articles. AMA sessions started.  — Full featured explorers created: tonscan.org, tonapi.io, dton.io and others.  — TEPs - platform for discussion of new network standards. (forwarded from TON Rewind 2022)

&rey: Test environment doesn't rewrite outgoing messages' value, source, etc. Rewriting is done in action phase. (reply to 18396)

User<1842871751>: Hi. How to develop a bot about DAO and user can create and vote proposals with TON wallet? Can i use TON wallet to sign message with bot ?

Howard: Right now the tx fee is low enough that you can build on chain voting (reply to 18410)

Step: Transaction triggered by external message showing as unknown unknown in both tonkeeper and tonapi io. Anybody know how to fix this? @TrueCarry @slavafomin

Nati: Does the "Anonymous number" contract that Telegram uses is open source?  If it is - will you be kind enough to point to me where I can find this?

isoscele 💎: afaik the telegram name nft item is available here https://github.com/TelegramMessenger/telemint/blob/main/func/nft-item.fc but i don't think there's a release for numbers too. Contracts are similar tho (reply to 18420)

— 2023-01-02 —

S.AB: Hello to all friends Can I make token and write a smart contract in the TON blockchain? Like the Solana blockchain??

Daniil: Yes (reply to 18427)

S.AB: Right now or in the future? (reply to 18428)

Daniil: You can do that already. Check out the docs: ton.org/docs (reply to 18429)

Step: @Gusarich (reply to 18417)

zzss: Hello guys Is it possible decrypt rawIndividualContent? Can you share contract info about it

User<2027316924>: hi guys

User<2027316924>: where to obtain ticker of toncoin?

banana: any exchange that lists ton will do i guess?

Yuri: Hey guys, what happens if you try to parse a value in the slice and there's actually no remanescent bits, is it gonna throw an error or default to some value?

Yuri: Okay, seems like it's code 9 (reply to 18445)

Yuri: Is there a way I can check c4 of a contract after invoking a method (without implementing a get_method on the contract)?

Yuri: During tests

Yuri: Ah okay, the problem turned out to be a missing impure modifier when setting data (reply to 18448)

Stefano: Good morning, I'm not a dev but I wanted to ask if there are any ongoing projects focused on publishing: books and magazines.

pid | ton: what s jetton means

Stefano: You mean Ton Minter developed by the Orbs team?

doni: token (erc20 like ) (reply to 18456)

Saber: I have 2 cross-chain questions:)  Is there anyway to bridge ton with an arbitrary message alongside it? Also testnet bridge seems to be not working, is there any support for that?

Step: . (reply to 18417)

Parsa: Hi there, I got LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state error on sendBoc Transaction  Does anyone know why?

Step: may be bad seqno, or trying to send ton more than what you have in your wallet? (reply to 18464)

banana: Is there any TON feature related to telegram are unique, that other chains can't do?

Евгений: I can’t create tokens using Ton Minter, there are TON ones on the balance sheet. Does ton minter work consistently? And what could be the problem?

User<5866547367>: Anyone experiencing issues sending ton to another address ? I tried sending ton but it keeps reversing back to my wallet . What to do ?

User<5866547367>: is it possible to use a seed phrase for a highload wallet to login on a normal TON wallet ?

Daniil: if you're sending TON to an uninitialized wallet, use unbounceable address (reply to 18473)

User<5866547367>: What does unbounceable address mean ?

User<5866547367>: And how to get it ?

Daniil: you can check it here https://ton.org/address/ or if you need that inside of your program, look at the docs of library that you're using (reply to 18479)

Step: 😭 (reply to 18417)

Howard: chaddddd (reply to 18421)

Howard: Can we say that if the code has the TEP62 functions, and get methods, then it will be able to list on getgems.io and any other marketplace? (reply to 18421)

Victor: Yes. (reply to 18486)

isoscele 💎: i think the transfer function of nft is enough to list any nft to any marketplace using nft sale contract official contract. Anyway fragment uses a different way of selling the nft. The nft can be sold by itself without using an external sale contract. You can read all code about this in the github (reply to 18486)

— 2023-01-03 —

James: Hey guys, I try to interact with the contract on testnet. And I got this response from RPC: data: {       ok: false,       result: '',       error: 'Rate limit exceeded: 1 per 1 second',       code: 429     }

James: Can anyone help me about this

James: Thank you

Step: goto @tontestnetapibot get api key pass it in  {apiKey: 'key'} while client initialization (reply to 18515)

+sepehrian+: ton.org https://ton.org/docs/develop/dapps/apis/toncenter

Daniil: https://ton.org/docs/develop/smart-contracts/ https://ton.org/docs/develop/fift-and-tvm-assembly (reply to 18536)

User<5718323121>: I am looking for ton smart contract developer, please dm me

&rey: nometa.xyz (reply to 18550)

Lev: Guys, what's the preferable way of integrating TON into dApps? Because there's TON Connect, wallet extension, ton:// links... Fragment and getgems use TON connect afaik, but it's not possible to use it if you have your wallet on your desktop (if you don't use Tonkeeper, really). TON DNS uses the extension — but it's impossible to use it on anything other than Chrome desktop

Yuri: Hey guys, what's the best way/material to study Fift?

Lev: Getgems have many ways to log in, but it seems messy to develop Fragment doesn't even support TON Connect — only Tonkeeper The official TON channels promote TON Connect, which looks very good in terms of tech, but only supports 2 wallets. And dns.ton.org developed by TON Foundation doesn't use it — as well as Fragment and getgems (yes, it turns out they support Tonkeeper separately) (reply to 18554)

Stefano: Hi, is anyone developing editorial projects on Ton, like a book marketplace?

Silvio: Does anyone know of a site where I can create QR codes and have them send to a specific address? I have tried several, but they always send me to an address that redirects me to the address I want, therefore, it does not work for me when I scan the QR code with Tonkeeper or Tonhub, but it does when I do it with my camera.

sd: hm. tested https://www.qr-code-generator.com/ (picreal), works fine with tonkeeper, use direct ton:// links and choose 'text' type of qr on the generator - you also can use this solution (reply to 18570)

Silvio: Thanks, i will test now. (reply to 18571)

Silvio: tested - thanks, you saved a cat. (reply to 18571)

Tim: Ton connect released at the end of December,no new services launched since. I think it'll be adopted soon. (reply to 18556)

— 2023-01-04 —

Ilya: Hi, where i can get some toncoins on sandbox network?

Silvio: Hi, you can use this bot: @testgiver_ton_bot (reply to 18580)

Ilya: Thank u! (reply to 18581)

Silvio: u r welcome! (reply to 18582)

Howard: thinking that how we fetch all the owner information for a collection?

Daniil: What do you mean? It is stored in contract's data (reply to 18649)

Step: 😢 (reply to 18417)

Step: will offer reward in $TON whoever helps to solve it. (reply to 18417)

User<1418229103>: Hello, how can I track NFT transfer and mint? Are there some doc or example code so that I can record owner of each NFT item at my local database...At ethereum, I listen block events to filter NFT transfer that I need, I don't know how to do this at TON. Can someone help me?

pid | ton: when we open the wallet in the wallet (telegram bot), where is the recovery phrase stored?

Lev: On their servers (it's custodial) (reply to 18661)

pid | ton: oh, thats help alot thks

Behrang: Anyone know how to run TonKeeper on desktop?  macOS specifically.

Джонни: Same as a phone version (reply to 18666)

Джонни: Download it from AppStore, if u using telegram wallet - it’s easy and pretty fast to transfer your tons there

Джонни: For me it took around 2-4 mins

Nati: please don't advertise in this chat :) (reply to 18671)

Константин: Hello everyone. For a long time I've been trying to do a simple task, parse a comment from an incoming transaction. I've tried a lot of options, but nothing helps. Can someone look at the code and tell me what I'm doing wrong? (one-character comment).

&rey: Have you passed enough TON with message comment of which you are parsing? (reply to 18675)

&rey: If so, could you share contract address? (reply to 18675)

Константин: Yes, i send message via https://wallet.ton.org/?testnet=true (reply to 18676)

Константин: kQAi5dn7BLgzMgYc0e8PUWZm0aOqV6iRtDUP7kXINiEIX6Xf  Address from testnet (reply to 18677)

Behrang: I don't understand. On tonkeeper.com, it's stated that it is a mobile app and available on Google Play store for android and Apple AppStore for iphone. I was that someone run it on macOS. Any hint how to do that? (reply to 18668)

Behrang: Looks like  you haven't given enough gas:  https://testnet.ton.cx/tx/7428066000003:ghDXPkZQfcXdcCBuZMMem0c36j2NyUCeIVHLtgcPwzs=:EQAi5dn7BLgzMgYc0e8PUWZm0aOqV6iRtDUP7kXINiEIXx5V (reply to 18679)

Alexey: Is your MacBook running on an arm processor (m1, m2)? If so, you can download tonkeeper from the AppStore. Arm processors let you run iphone apps on macOS (reply to 18680)

Behrang: Uh! It's Intel based. That must be the reason. Thank you. (reply to 18682)

Константин: Yes, you are right! I have now re-sent the message to this address. this time it is successful, but the result is zero again (reply to 18681)

Константин: https://testnet.ton.cx/tx/7430075000001:h7UpKda4SOEzp/LwaVgq82ZcUdCyQl3yieOZWgBllDg=:EQDdiwDghvwiTg6eveMv35CUTpxu2YlYNOSPOuvXZ7sXZFPX (reply to 18681)

Behrang: Please send at least 0.1 TON on testnet and then send the result. I still think it's related to gas.

Константин: I did it... the result is the same (reply to 18687)

Behrang: This is the last 2 transactions. I don't know why but when you sent 0.1, it looks like that you didn't include any comment, but then when you send a few nano tons, it had a comment (3).

Behrang: When you had no comment, your code throw an exception, which is correct behaviour based on your code.

Константин: Success! Very difficult debugging! Thank you very much! (reply to 18689)

User<1842871751>: hello ,how to sign some message with wallet in telegram?

Lev: I don't think it's supported by @wallet (reply to 18693)

Jason C | Midtown Alpha: gm all, just curious where can i find information on Ton network's current actual performance - TPS / Finality time / Blocktime?

Jason C | Midtown Alpha: Cant seem to find it on any explorer apps

User<1842871751>: Can we develop a bot to sing message within telegram? Or use Tonhub, Tonkeeper to sign the message? (reply to 18694)

Daniil: https://tonhouse.skyring.io/ (reply to 18696)

Daniil: But this website is still in development (reply to 18699)

Lev: You can develop your own wallet bot to sign messages — or use TON Connect which will support other wallets (for now it's Tonkeeper and Openmask) (reply to 18698)

Jason C | Midtown Alpha: thanks mate! much appreciated (reply to 18700)

Jason C | Midtown Alpha: Seems like block finality time isnt available :)

Daniil: Finality time is just like block time + 1sec (reply to 18704)

Jason C | Midtown Alpha: Gotcha!

User<1842871751>: Thanks. And what js sdk can i use to sign message for developing bot? (reply to 18702)

Lev: https://www.npmjs.com/package/ton

User<1842871751>: Sorry ,didn’t find sign api in this npm lib/ (reply to 18708)

Lev: It should look like this

User<1842871751>: little bit complicated… Thanks. Where should i find the docs? (reply to 18711)

Lev: Idk 🤷‍♀️

Step: failed to download proof link: [Error : 651 : no nodes] [ 0][t 2][2023-01-04 14:45:29.056498924][dht.cpp:545][!localid] Check `node.addr_list().size() > 0` failed  trying to run lite server node got this error how to fix?

TON technical overview: Check network configs (firewall) your node can not reach other nodes (reply to 18715)

Anil: .

Gkiokan: If I have a TON value of 0.002 my code can't convert it toNano and says [ethjs-unit] while converting number 0.02409668633681344 to wei, too many decimal places for payment links  So this makes sense, but it should be possible to allow sending 0,xx TON amounts, right?

Lev: How do I convert from 0:... format to EQ...?

Lev: In js

Slava: https://t.me/tondev_eng/4767 (reply to 18723)

Howard: would like to know how to put String in Cell in TypeScript as well (reply to 17041)

Lev: I'm having this error with both ton and tonweb, what does it mean?

Tim: it means you need to define polyfill

Lev: What? (reply to 18729)

Gkiokan: ton://transfer/EQBzX_Suk3d4folmX-LmCLdUE-5wgZDUnvZ6DPECFNuZiU3K?amount=0.02394451962110961&text=b3f989d2-9d07-429b-b90a-fb8b86468603   When I am using this link in my apps, the wallets doesn't take the amount and text parameters. Is this normal behavior? I would expect that everything should be prefilled. Happens in TonHub and TonKeeper the same way.

Slava: What's your runtime? (reply to 18728)

Lev: It's the latest Firefox (reply to 18732)

Slava: Buffer is a Node.js utility, you will need a polyfill to use it on the web. (reply to 18740)

S0co | DM+ME = Block&Report: Hello everyone

S0co | DM+ME = Block&Report: How i can run a storage node on ton?

Lev: https://ton.org/docs/participate/ton-storage/storage-daemon (reply to 18750)

S0co | DM+ME = Block&Report: thank you (reply to 18751)

— 2023-01-05 —

User<1418229103>: Hello, how can I track NFT transfer and mint? Are there some doc or example code so that I can record owner of each NFT item at my local database...At ethereum, I listen block events to filter NFT transfer that I need, I don't know how to do this at TON. Can someone help me?

S0co | DM+ME = Block&Report: Its currently on testnet? (reply to 18751)

Diako: I got a list of transactions of a contract There is msg_data parameters in each transaction How can i decode msg_data ?

User<5140804585>: Which wallet do you use? (reply to 18767)

Diako: I use nodejs with tonweb library (reply to 18768)

Daniil: it's base64 encoded Cell (reply to 18767)

The Tun: Hi guys, how can I add payments by ton for my flutter application? I want useres to sell and buy assets.

Gkiokan: @The Tun usually yes. Seems that this will be the link for triggering the wallets (reply to 18731)

Gkiokan: Really? Why I can't send 0.xx amounts of TON?

Steve: ton have only 9 zeros

Gkiokan: But If I convert lets say 50 USD to TON value though exchange calculations, I get x amount of TON. In this case it's 0,05 USD converted to 0.02394451962110961  TON

Daniil: Round it to 9 decimal points (reply to 18782)

Gkiokan: kk lemme try

Steve: BTW this is an outdated version, everything is different in latest one (reply to 18711)

Gkiokan: Yea. Worked out. But isn't this not accurate then? Can this happen on a larger amount, too? (reply to 18783)

Diako: how can i decode it with tonweb or ton3 library ? (reply to 18772)

Howard: Hi, when I tried to using TonKeeper transfer my own NFT Item(I am testing), got this error for exit code 9.  What is that mean for the NFT Item that Cell underflow?

Step: . (reply to 18417)

Mr. John: https://github.com/tonstack/ton3-core/blob/main/docs/classes/BOC.md#fromstandard (reply to 18787)

Howard: anyone know why got this when using toNano on ton libraries?

Howard: Tried to type in 0.1 TON only.

Gkiokan: 0.1 is a float, not a int

Gkiokan: try to calculate with parseFloat first and then toNano

Howard: thanks! (reply to 18807)

Howard: still got error my friend😅

&rey: You need to pass string to toNano. Like toNano('0.1'). (reply to 18809)

Howard: got it. Thank you! (reply to 18811)

Howard: is the test-net API dead? Was able to fetch data before. Now, it doesn't work then. (reply to 18788)

Howard: Exit code 11

Steve: Usually if it is dead you won’t get error code

Howard: you mean because contract does not have any TON in balance?

Step: @steve_kite can you help me please? (reply to 18417)

Step: example transaction https://testnet.tonapi.io/transaction/a619fd35b2231850463285ab839056418a39f142500153b5381b60c084219943 (reply to 18818)

Howard: Sorry, I was reading the wrong contract address. That is why!  Remember that in TON network, NFT has Collection contract and NFT Item contract! (reply to 18817)

Howard: any method to solve the deploy URL too long?

Howard: 🫥

Slava: How long is it btw? (reply to 18821)

Steve: URL shorterer that resolves to a internal link

Howard: Let me DM you the URL (reply to 18823)

Howard: literrally broader than my monitor lmao

Howard: 🫠

&rey: Please note there is 64 KB restriction on size of external messages. Bigger BOCs have to be split and rebuilt onchain, using some contract like here (https://github.com/ton-blockchain/func-contest3). (reply to 18826)

Howard: I can only code in Tact 😭 (reply to 18829)

Trassos: Guys, do we have a place listing all projects? A guy talked about having a DAO, other about a auction system...

&rey: There is a centralized one, ton.app. And decentralized is up for community to build. Maybe, even up for you 🙂 (reply to 18831)

Slava: The number of characters would be enough... (reply to 18826)

Howard: Can you explain this? (reply to 18824)

Slava: I wonder if it's possible to use some compression, e.g. Brotli to reduce the data size… 🤔

&rey: You'll have to decompress it onchain) (reply to 18835)

Trassos: Thank you, Pal. How you guys host things? (reply to 18832)

Slava: Isn't it's used in the ton-transfer URL? The wallet software can decompress it. (reply to 18836)

Daniil: What do you mean? You can host different things in different ways (reply to 18837)

Trassos: On chain

&rey: I'm going to host my app on PythonAnywhere once they whitelist domains for interacting with TON blockchain. And I think they will, because those  have clear API documentation. (reply to 18837)

Trassos: Great answer thank you (reply to 18841)

Daniil: On-chain things are Smart contracts (reply to 18840)

Daniil: You don't need to "host" them

Steve: Not really, but just cryptographically strong url shortener would be cool (reply to 18835)

ㅤ: Hello, is there currently a way to check the TPS of the network?

S0co | DM+ME = Block&Report: Hello is ton storage currently on testnet?

Alex: Hello, TON developers!👋 Ready to step into the 2023 TON massive adoption year? Let’s do it with Tact!  TLDR  Tact is a high-level, scalable language designed to improve the usability of smart contract development for TON. If you've long wanted to dive into smart contract development, now is the time when you can start from the very basics as a Tact developer. Definitely, your participation will be especially appreciated if you are an experienced FunC developer🤝.  The Tact language project was originally initiated in the summer of 2022 when the original concept was designed.  In December 2022, the Tact compiler development continued, and currently work is in full swing.🌋   What next?  To improve the quality of the Tact compiler an important request🥺  to the great TON community is to play with the compiler according to the template project.   If you will find a BIG problem with the Tact compiler itself, we will be very happy if you tell us about it in the chat or in git issues. Also, feel free to ask your questions in chat.   If you have any questions about the Tact documentation DM me @iftryalexg  - I will disclose all questions ASAP in the documentation or answer you with a link that helps you.🤓

Howard: 🥳 (reply to 18851)

User<1237546490>: Example of DEX on TON API integration in DefiLlama  https://github.com/DefiLlama/DefiLlama-Adapters/blob/main/projects/tegro/index.js  API pairs https://api.tegro.finance/pairs  You can use it as an example of integrations

Bond: Hi, is there a testnet for ton?

Gkiokan: https://testnet.toncenter.com/api/v2/jsonRPC (reply to 18855)

Daniil: What does mode' = mode + 1 means that the sender wants to pay transfer fees separately Mean?  Does it mean that sender and receiver will split the fee 50/50?

&rey: Not 50/50. Sender will send additional TON to cover message delivery fees, while receiver will still pay for own contract storage and processing message. (reply to 18863)

Daniil: So if I send 1 ton with mode=0, receiver will get like 0.99 (-fees)  And if I send 1 ton with mode=1, receiver will get 1 ton and I will pay 1.01 (+fees)? (reply to 18864)

Daniil: Okay, thanks!

User<1972106785>: Hello, does anyone know what algorithm Ton can be mined with?  thank you

Slava: Hello. Please read the docs about validators. (reply to 18868)

Аlexander: Hi there! We have developed a beta version of a marketplace for buying and selling NFTs without any fees and royalties. We have worked hard to make it a truly decentralized platform, using smart contracts for everything. We hope you will give it a try and provide us with some feedback.   Here is the link to our website: https://tonft-10632.web.app/.   We also have a Telegram channel where we post updates and new offers: https://t.me/toNFTapp.   Thanks in advance for your help!

User<5941318761>: 👍👍

Влад: Hi guys! I am newbie on TON so sorry for stupid question) But I see that there is a jeton minter tool and it should create tokens I guess. Is there any exchange to trade these tokens?

Gkiokan: When I try to send a transaction though my bot with the npm ton lib, I get this issue. error:  'LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state'  The parameters seem to be processed correctly unti lthe transfer method is called.

Gkiokan: What means Failed to unpack account state?

Gkiokan: I've followed this guide here. But can't find any information about this error.   https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript

Daniil: something is wrong (reply to 18884)

Daniil: maybe seqno

Gkiokan: seqNo is 0 in my logs

Gkiokan: This are my logs.

Gkiokan: Could it be something with my account type? I've used the given one which is org.ton.wallets.v4 but I#ve created my wallet though wallet.ton.org, just a couple days ago. So I guess it should be the latest type?  Where can I lookup my wallet type?

Slava: Make sure to not use this secret key from now on :) (reply to 18890)

Gkiokan: haha yea thought about it but don't worry, the secret has a bunch of other characters left that aren't on the screenshot. :) (reply to 18894)

Gkiokan: That makes no sense to me and honestly I could try the other library, but I think both are working the same way somehow so I will probably end up with the same error. Failed to unpack account state. I will try v3 to see if I get a different error.   The error is coming from the jsonRPC, so not even the library itself has a hint for that error (500).

Gkiokan: God. Really. Why does it work with the wallet type org.ton.wallets.v3.r2 🤔

Lev: Is there a TON DNS on the testnet?

Gkiokan: Are the Blockchain Fees % based on the tx value that you send?  I am building a ecommerce shop system with marketing payment feature. Means, User buys, the Bot Wallet gets the money, takes it's commision and sends the rest to the Seller Wallet.  Easy stuff. But I am testing right now with low amount TON (0,009x) and I am ending up in having LESS TON's on the Bot Wallet due the fees.  So is this even relyable?

Gkiokan: Here a more specific example in values that I've just tested.  0.009675849 Transaction Value in TON   55% Application Fee ( our comission ) 45% gets the shop owner so 0,004354132 gets the shop owner  calc = (0,009675849 / 100 * (100-55))  Wallet Values pre and post tx. 1,991531338 to 1,99022302 on the Bot Wallet 1,01372162 to 1,017975718 on the Seller Wallet  This  means, even we get 100% and split out the rest money for the seller, we  pay more fees and have less money after the split?

Gkiokan: Bot Wallet tx list of the example

Gkiokan: Okay, another test with higher amount. 8 USD = 3,8792xx TON now.  The fees seems to be at a 1000th decimal place. So no % and this may work then.  Buy Input 3,879xx fee 0,001xx Split to Seller 1,7456xx fee 0,006xx  So we make like 2,1273 TON win out of this Transaction with 55% fee rate.

— 2023-01-06 —

Petr 🇷🇺: Hello! Can you explain - I found two binance smart chain contracts - 1) https://bscscan.com/token/0x357b3804a572B33aF8A03576e31Ac3aa2Ac0f07c - from ton.org, 2) https://bscscan.com/token/0x76A797A59Ba2C17726896976B7B3747BfD1d220f - from ton.club. Why there two contracts in bsc, and what It's mean?

Ssi: someone's deployed them. It's a blockchain so anyone can deploy everything 😉 (reply to 18907)

Ssi: btw, seems the second one is by https://ton.org/

Андрей: This means that you are confusing something. There is only one reliable site, and that is ton.org. It only lists one contract address on the BSC network: 0x76A797A59Ba2C17726896976B7B3747BfD1d220f (reply to 18907)

User<5718323121>: I deployed contract with tonos-cli command, then I got error message  Deploying... Error: {   "code": 504,   "message": "Fetch first block failed: Can not send http request: error sending request for url (https://devnet.evercloud.dev/graphql?query=%7Binfo%7Bversion%20time%20latency%20rempEnabled%7D%7D): error trying to connect: error:14090086:SSL routines:ssl3_get_server_certificate:certificate verify failed:s3_clnt.c:1269: (certificate has expired)",   "data": {     "message_id": "c3fb9a571c5f802986278a29baec2214c104bdd7588c6689987687d9531988a6",     "core_version": "1.39.0",     "config_servers": [       "https://devnet.evercloud.dev"     ]   } }

pid | ton: how much does it cost to deploy a smart contract on the ton mainnet?

User<5718323121>: I am deploying to devnet

User<5597336212>: His

User<5597336212>: Hello

&rey: 0.03 TON will be enough. (reply to 18915)

pid | ton: imprrzzive (reply to 18921)

Step: if we empty a contract account balance to 0 ,its transactions will disappear from blockchain after a period of time?

User<5718323121>: I am looking for developer to have experience to deploy with tonos-cli

User<5718323121>: please dm me

Step: they do not even answer here you expecting them to dm you? 🤣 (reply to 18926)

Daniil: Contract will be destroyed (reply to 18923)

Step: for how long it will stay alive ? (reply to 18928)

Daniil: You shouldn't let your contracts balance to be 0

Step: what is the minimum required balance to keep alive for a year? or beyond (reply to 18930)

Daniil: https://ton.org/docs/develop/smart-contracts/fees#storage-fee (reply to 18931)

Daniil: Storage fees are really low. Usually 0.1 ton is enough for several years

Steve: Don't be delusional for small contracts like a wallet yes, but a huge contracts it could easily became quite expensive

Step: what is the procedure to count cells and bits? is this something doable from explorer? (reply to 18932)

Daniil: Yes, it's possible from an explorer (reply to 18935)

Daniil: For example, the regular wallet-v3 contract is just one cell of code and one cell of data

Daniil: Each cell in that explorer output is on separate line (reply to 18937)

Daniil: And you can count bits approximately by checking the "hex" representation output length

M✨: As a storage provider, how much ton do we get? What is the formula for calculating it?

Daniil: you can set your own price. also note that there are no marketplaces for storage yet, so it'll be hard to find someone to buy your storage right now :) (reply to 18943)

User<5718323121>: I am looking for developer to have experience to deploy with tonos-cli. please dm me.

Gkiokan: Can I query the transaction based on a given text without looping though all transactions?

Daniil: What do you mean (reply to 18955)

Gkiokan: I want to query the transactions based on a message from my wallet. Background of it is that I am accepting payments from my shop bot and do split payments to the seller. So before I do the split, I want to check if there hsa been a transaction before that is an outgoing tx with message of "split $orderUID"  From the testnet toncenter API I can see this data is saved in my transactions in the out_msgs (just noticed the out_msgs are arrays where in_msg is a single object)

Gkiokan: Curerntly I just get the latest 1k transactions and loop though it until I find the string. But this is not a good practice at all and may suffer in processing speed and may be not reliable at all when there are more transactions out of the limit scope.  But I am not sure, if there is a "query by data" method as the docs don't have anything about it.

User<5718323121>: I am looking for developer to have experience to deploy with tonos-cli. please dm me.

User<899400746>: Hi

Step: Toncenter is running any LiteServer for public use?

Step: Ip port? mainnet or testnet? (reply to 18993)

Step: Oh

Step: Skam detected

Rasoul: Hello guys, what is the error?

Nati: toncli couldn't find the func executable.  If you have func on the machine you should pass the exact path to the executable, not the folder. (reply to 19000)

Rasoul: How should I install func? (Ubuntu) 😅 (reply to 19001)

Nati: You can build it yourself from source or use Pre-compiled binaries. (reply to 19002)

Nati: Just to note that the pre-compiled binaries are provided from the official team, so the integrity of the binaries is fine :)

Rasoul: I want  download  func file form this  url https://github.com/ton-defi-org/ton-binaries (reply to 19003)

Rasoul: And give its path to toncli? I was confused (reply to 18999)

Nati: Yes. (reply to 19006)

Gkiokan: When I programmatically send a transfer, I get the seqNo as a return. How can I get the txHash for that particular tx?

Rasoul: Where is the problem? 😢 (reply to 19007)

Mr. John: chmod +x /root/ton/func chmod +x /root/ton/fift (reply to 19009)

Rasoul: I was not paying attention 👍 (reply to 19010)

Rasoul: new error 😅 (reply to 19010)

Mr. John: sudo apt-get install libssl1.0.0 (reply to 19012)

Rasoul: E: Package 'libssl1.0.0' has no installation candidate  I receive this error (reply to 19013)

Mr. John: sudo apt-get update sudo apt-get install libssl1.0.0

User<5597336212>: Hello

Mr. John: https://askubuntu.com/questions/1173587/e-package-libssl1-0-0-has-no-installation-candidate (reply to 19014)

Rasoul: I couldn't start toncli. Is there another way to compile the func codes? (reply to 19017)

doni: you are missing libssl

doni: sudo apt update sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget cd ~ && git clone https://github.com/ton-blockchain/ton.git cd ~/ton && git submodule update --init mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4

doni: try installing libssl-dev

doni: or dl func pre compiled  https://github.com/ton-defi-org/ton-binaries

Step: why need binaries when you can use ton-compiler or func-js and compile on the fly.

Нетоний: How to get valid keypair format for storage daemon? (.pub and private files)  Mytonctrl not working (it’s incompatible with python 3.10?)

Slava: You can calculate the hash of your external message and then use it to find the transaction in the Blockchain via the Index API. (reply to 18957)

Gkiokan: Would that be something like hash my message to data and lookup for that on the api? Have you a link to the index api or how can I access it? (reply to 19038)

Slava: https://toncenter.com/api/index/ (reply to 19039)

Tim: Can you calculate hash of message before it's minted on chain? (reply to 19038)

Gkiokan: Nice, I didn't know that docs exists. Thought only the /api one was available as there was no further access.  I guess in my case it would be the endpoint /getTransactionByInMessageHash (reply to 19042)

Slava: I'm talking about the external message. (reply to 19044)

Gkiokan: There was a method tha does the job on the TonClient I think to convert the message to data hash, need to lookup on that, too.

User<5718323121>: why are my questions removed?

User<5718323121>: why remain only TON tx on history? I have various tokens. Could you explain this?  https://tonscan.org/address/EQATxUMDtyQacmE5lKmIYsF8bvtsaSuJ5PlwwR2eVclyJx5V#tokens  https://tonscan.org/address/EQATxUMDtyQacmE5lKmIYsF8bvtsaSuJ5PlwwR2eVclyJx5V#transactions

Daniil: What do you mean (reply to 19049)

User<5718323121>: I swaped wton with my ton on ston.fi. And I want to see wton tx. but I can`t find it

User<5718323121>: In more detail, I`d like to get the method to swap from ston.fi on my contract

sd: https://tonapi.io/transaction/e8b2b5bdf1b5a99296c930cb6780216bfa6ea8bbafe4199b669b0c83b08be437 (reply to 19049)

User<5578023122>: Бля, ребята, подкиньте денег, очень срочно надо.... Не хватает на негритяночку....

zzss: 🟧⬛️

Gkiokan: When triggering a transfer like this, could it be happen that the transfer will be send 2 times when it gets called multiple times?

Gkiokan: Apprently no, even I tried to call the method multiple times, I can trigger it 2 times, but while in loop it still gets transfered once. But I want to be sure why this happens only once (which is good and what I want).

Gkiokan: Just in case users try to brute force the payout process, I must predict that.

Nati: Because after a successful processing the wallet seqno is increased by one to prevent reply attacks.  And you are still sending the same seqno, which makes the wallet reject the message. (reply to 19064)

Gkiokan: That's what I thought. So even it gets brute forced due whatever, the transaction is always bind to the seqno.

Nati: Yes that's the purpose of the seqno :)

Gkiokan: But if I have valid transactions that goes out on different wallets with different payloads, they will be rejected, too until the seqno is increased then?

Nati: Each wallet has it's own seqno

Nati: I would recommend reading this.

Gkiokan: To be more precise, in my case the wallet is bind to my shop wallet for differnet shops. To take comision on orders I collect the TON on the main wallet and split out the rest to the sellers (like ebay).   So I have different to wallets depending on which order has been made on which shop.

Gkiokan: I see. The article makes sense and explains what you've told me in short already. Thanks for clarify.

Нетоний: How to fix "unknown magic ..." when trying to import key in storage-daemon-cli?  In keys.cpp it needed 4 byte prefix ton_api::pk_ed25519::ID. Where i can get it?  Or what valid file key format for cli tools? (saved as raw and base64 - both not working)  https://github.com/ton-blockchain/ton/blob/ba8f700e26620707f8ff14e46cc9a040a1b3f97c/keys/keys.cpp#L163

Nati: Did you run storage-daemon? (reply to 19075)

Nati: It should generate and use a new pair

Nati: if you just want to generate one use the binary from the utils folder: ./utils/generate-random-id --mode keys

— 2023-01-07 —

Нетоний: Yep! It works. Just found a solution 2 minutes after u send msg 😭😭😭 (reply to 19081)

Nati: Nice, glad you found an answer :D (reply to 19083)

ᅠ: fiftlib.zip is incorrect link  https://ton.org/docs/develop/smart-contracts/environment/installation#2-setup-your-binaries

Nati: Seem to work fine

Nati: The windows one

ᅠ: https://github.com/ton-defi-org/ton-binaries/releases/download/fiftlib/fiftlib.zip ?

ᅠ: This one

Nati: The ZIP should have fift files are they are not platform depended (as far as i know)  You can: 1. Click on "Windows" on that page and click on the fiftlib.zip there, seem to give you a valid file hosted on the website it-self 2. Download from the GitHub releases. (reply to 19089)

leo🦴: what is wrong?

realcryptoidea: Hello,  What should be the connection speed to be a validator? both upload and download

realcryptoidea: Hello, is there any admin who can hear me?  What should be the connection speed to be a validator? both upload and download

Nati: This chat is for TON-related technical questions only. Ton Community Chat would be a better place to ask that. (reply to 19102)

Imposer: hey guys, im getting the error when running fift counter.fif

Nati: You should download fiftlib, more info about environment setup here. (reply to 19109)

Imposer: i have installed fift, i get this when i run fift -V (reply to 19111)

Imposer: but the link doesnt seem to work

Imposer: getting not found when i click on fiftlib.zip (reply to 19114)

Nati: You can download it from here.

Nati: The link for the Linux / MacOS is broken. See the conversation from yesterday.

Imposer: ok thanks (reply to 19117)

realcryptoidea: It's not a difficult question. If you know the answer, you should say it. That is all (reply to 19106)

Nati: I will not answer only for one specific reason, to not encourage people to ask unrelated questions here!  I can, and I have redirected you to the correct chat - where you already got your answer. 😄 (reply to 19120)

Константин: Hello! If I use the rand function several times in an incoming message, do I need to call randomize_lt before each time, or is one time enough?

&rey: One time is enough. Please note that random values after randomize_lt can still be predicted before sending message to your contract. (reply to 19126)

Константин: Can you tell me how? (reply to 19127)

Daniil: check out this:  https://github.com/ton-blockchain/hack-challenge-1/blob/master/Solutions/4.%20lottery.md  https://github.com/ton-blockchain/hack-challenge-1/blob/master/Solutions%20from%20winners/4.%20lottery (reply to 19128)

Slava: @pcrafter this chat is for sharing knowledge in an open fashion. A lot of people spend thousand of hours developing TON and sharing it publicly for free. Trying to sell your knowledge in the chat is just unethical.

Slava: That's all cool and funny, but I will have to cleanup the chat from the flood.

Dario: Shouldn't we ban users that write behind channels not related to ton development here?

Slava: Please stick to the development questions.

User<5061272998>: don’t delete my messages if possible. Devs also should know who they can work with and who they should not. (reply to 19144)

Vadym: How can I generate new ton address? Is it cost-free or it’s require deploying of smart contract?

Andrey: Address of smartcontract is hash of cell with StateInit:  You can learn more about smart contract addresses here: https://ton.org/docs/learn/overviews/addresses#address-of-smart-contract (reply to 19156)

Slava: You can get the address without deploying the contract by the way. (reply to 19156)

Nati: What would be the best approach for "subscribing" to all transactions of a certain contract type?  What I want to do is to get a trigger every time any contract of a certain type is processed.

Nati: The point of that is to get a trigger when someone puts an NFT on auction.

Jangju: yup

Steve: Just watch all blocks and all transactions this is quite easy to do

Nati: How can I watch blocks? Any python / JS library? (reply to 19164)

Steve: v4 api has websockets

Steve: Or you can just pull every 5 seconds for last block

Steve: Also ignore masterchain that everything would be fine

zzss: Is it possible increase fee for transaction in ton network to speed up transaction execution?

Daniil: No (reply to 19170)

zzss: is some any ways to increase speed?

Tim: there's no need to increase speed, tx is mined in <10s

Daniil: Why do you need to speed it up? (reply to 19172)

zzss: I have cases where I need to win a race with other transactions, so it can be done by increasing transaction performance or by improvements in my application (reply to 19174)

Daniil: There is no "race" between transactions (reply to 19175)

altoshi: He means gas auctions. It’s a normal thing in Ethereum (reply to 19176)

Daniil: Gas auctions? (reply to 19177)

Daniil: Oh you mean that

altoshi: Yes. The higher the bid, the faster your transaction will be completed. (reply to 19178)

Daniil: I know what it is, just saying that there's no such thing in TON

altoshi: There is no gas auctions in TON, it was made to avoid cheating, gas fee rise and other bad things. (reply to 19175)

zzss: Thanks (reply to 19182)

User<5718323121>: I am new on TON. I am gonna deploy simple smart contract by deployment script. So I am tracing : https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func But I am still getting error message on part of (const seqno = await wallet.getSeqNo();)

Deivisson: Hello, I am the CEO of Flooyd Brazil LLC company that provides cloud storage. Any release date for TON Storage?

Howard: hi, is there any API I can use for test net deploy?

User<5718323121>: I met same problem

zzss: Can someone help? Is it possible get full information (bid price, owner, auction phone address) about phone number in fragment auction from TON network or it is possible only using website? This endpoints do not provide price information https://tonapi.io/swagger-ui

🎗: How can we contact ton support? (reply to 19158)

Андрей: @ton_help_bot (reply to 19190)

Андрей: It will not be possible to get the seqno of an uninitialized contract, since it is not initialized. As far as I know, it is not needed during initialization. The seqno is needed only when making an outgoing transfer. It is also worth remembering that in order to initialize the contract, there must be a sufficient number of coins at its address (reply to 19184)

User<5718323121>: I am funding some ton

User<5718323121>: But it is previous of wallet.getSeqNo()

Nati: What is the first 5 transactions on each block purpose?

User<5718323121>: I am not passing this part

Dario: Raise your own ton full node (reply to 19175)

Dario: The only way to "speed up" a transaction instead of using public gateways

zzss: https://github.com/toncenter/ton-http-api  this one? (reply to 19198)

zzss: It is already done

Dario: Actually, its better to avoid it.just use liteclient to connect to your node (reply to 19200)

zzss: https://github.com/poma/ton-lite-client  This one? (reply to 19202)

zzss: seems no, can you share the link to be confident?

Dario: Everything is here, you only need to build it

Dario: https://github.com/ton-blockchain/ton

zzss: So when this is done, can I send the transaction to my node, which will execute it and send it to other nodes?

Slava: it's already released. (reply to 19185)

Slava: Use seqno = 0 if your contract is not deployed yet. (reply to 19184)

User<5718323121>: same error with last (reply to 19209)

Slava: Are you using API key for TonCenter? (reply to 19210)

User<5718323121>: could you explain more detail (reply to 19211)

Slava: - https://github.com/slavafomin/tonweb/tree/better-docs#toncenter-api  - https://github.com/slavafomin/tonweb/tree/better-docs#public-toncenter-api (reply to 19212)

Nati: I'm using pytonlib to fetch masterchain blocks - then get the transactions of that block, but I don't get all of the transactions that I can see in https://tonwhales.com/explorer/block/<SEQ_NUM>.  Anyone got any advice how to debug this?

zzss: Can you help me in which format I should pass block id trying to get info via Lite Client?

Nati: see the output of last (reply to 19215)

zzss: thanks (reply to 19216)

Ruslan: Get masterchain block, then get shards and for all these blocks get transactions (reply to 19214)

Ruslan: All user transactions are stored in workchain 0

Nati: Thanks! 🙏 (reply to 19219)

Nati: The problem I had is that I didn't look into shards

Nati: This is awesome :D

Nati: Thanks for the help 🤙 (reply to 19164)

— 2023-01-08 —

Diako: Do you have example of Asynchronous smart contracts ?

Nick: Contract execution is synchronous but interaction with other contacts is asynchronous (with messages) and there isn’t any other approaches (e.g. make a synchronous call as we can you in EVM). (reply to 19230)

Howard: what is the error code 100 means?   Can't find in my Tact compiled TS file. (reply to 9358)

Behrang: It's a custom error, that is raised by the smaart contract. Check docs/source of the smart contract. (reply to 19232)

Behrang: I'm not sure about the Tact part. Maybe it's something internal to Tact.

Howard: Yes, it pop in FunC file that generated by my Tact file. Checking and try to understand what is that mean. (reply to 19233)

Egor: Are there any ton storage browsers? Is it correct that you have to somehow obtain storage address to store your files and there is no built-in browser for these addresses?

Egor: Can someone confirm or deny this? (reply to 19236)

Нетоний: You can use storage-daemon-cli to check bags and files stored on your machine (reply to 19236)

Egor: But what if i want to find another storage in the network?

Egor: For example, I create my storage with daemon, so how users can find me and use my storage? (reply to 19238)

Нетоний: https://ton.org/docs/participate/ton-storage/storage-provider (reply to 19240)

Egor: Ok, so what? Client have to know provider address (for example for this command in docs get-provider-params <address>), I want to know, is there any mechanism for sharing this address without direct contact through third party services, for example some command like get-provider-address-list which will do something like search somewhere idk or something like this. I think today the only way to do this is directly find storage providers through chats and forums (reply to 19241)

Нетоний: I think, there is no easy way to find all storage ADNLs. As I know, you can find addresses of providers contracts with help of explorers/indexers, because you have to report about your existence (via smc) (reply to 19242)

Нетоний: If you want something like torrent-tracker, where you can view all shared files - do it yourself)

Egor: Oh, thanks)

Behrang: There is currently no marketplace developed. This is open for development by anyone, which will connect clients to storage providers. Currently the basic layer is developed which makes it easy for people to create a marketplace on top of it. (reply to 19240)

Egor: Thanks a lot, thats exactly what I wanted to know)

User<5745785596>: Hello does someone know the Ton address? What’s that meaning thank you 🙏

&rey: Do you mean - addresses of contracts in TON blockchain? https://ton.org/docs/learn/overviews/addresses - address of TON contract in another blockchains, like ETH? They are listed, for example, on Coingecko: https://www.coingecko.com/en/coins/toncoin (reply to 19248)

talkol: We are working on an up-to-date version of this tutorial accomodating all the breaking changes in the libraries in the ecosystem (things are changing quickly) - https://github.com/talkol/ton-content/pull/1  Please send me feedback on these changes before we release the new tutorial (reply to 19184)

&rey: Launch fift.exe -V in directory where it's located (ton-win-binaries). (reply to 19251)

&rey: Then, echo %ERRORLEVEL% (this command outputs exit code of previous command). (reply to 19252)

Vladimir: also

&rey: This exit code means "Illegal instruction". You have to either rebuild executables by yourself (personally I don't know how this is done) or upgrade the system/computer. (reply to 19254)

Vladimir: thx

User<5745785596>: Did someone tell me how to find Ton address please 🙏

rub1kub 💻: Hi everyone! Are there easy ways to send coins to an address using Python?

Imposer: hello guys, the deployment script seems outdated in this tutorial. https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func

Imposer: can anyone suggest resources on how to deploy the smart contract

Howard: tact in example https://github.com/ton-community/tact-template (reply to 19260)

Dev: Are you aiming to deploy to testnet, mainet or ton-contract-executor?

Dev: You could try this one uses toncli : https://github.com/romanovichim/TonFunClessons_Eng/blob/main/1lesson/firstlesson.md (reply to 19260)

Dev: Also take a look at the quickstart guide for toncli it has a lot of useful methods for deployment and also to run methods etc. (reply to 19260)

rub1kub 💻: How does it work?

Howard: not expert, but maybe you should share a gist (reply to 19266)

rub1kub 💻: I wrote a small script which should send TON. I used the tonsdk examples (https://github.com/tonfactory/tonsdk)

talkol: Can you take a look at this upcoming updated version? https://github.com/talkol/ton-content/pull/1 (reply to 19259)

Howard: I still had this error since my NFT standard with Transfer method I implement already on Tact..... (reply to 18788)

Howard: - how TonKeeper trigged the NFT Transfer? - What is the wallet app will send to my wallet to move the NFT I have?

B: My Tonhub Address https://tonhub.com/transfer/EQB4sV584VMBNNjKRxwZOeclZbcU2vV4lbaIr31CoCd0HwkG

Howard: 🫠

Dev: Does anyone know where the videos are from the Prague event? I remember an expert presentation on TON architecture and sharding/async model etc translated to English I think on it was on tonspace.co for a while

Alex: https://youtu.be/oEO29KmOpv4Do you mean this video?  This article on the background. (reply to 19276)

Dev: Yes that's video. I will watch it now

Nati: Is there any TL-B to PyTONLib class convertor?  If not, would it be useful if I create one, or it'll be useless?  I feel like it's a tedious work to not automate.

Omid: hi  How to display the jetton transaction in JavaScript

Mohammed: It was released last week (reply to 19185)

— 2023-01-09 —

𝓢𝓪𝓶𝓾𝓮𝓵: Hi guys, I wanted to know what kind of things I can do with my domain, and ask if it can be redirected to an https domain from .ton I also read that you can run smart contracts internally Do you have some kind of guide on the Ton network about utilities on this topic?

Howard: Action Failed is annoying.... (reply to 18161)

Behrang: Currently you can point it to a TON Site, have it as a wallet address, and store some files for it.  However, as a DNS, you can store anything in DNS fields, and the software that is interpreting it is responsible for doing the "right" thing. For example you can have an "https" field on your own .ton domain, pointing to a web site, but you need a special browser which understands .ton domains, and redirects you to that web site. (reply to 19283)

Behrang: Use ton.cx explorer. It's very good for debugging. (reply to 19284)

Jangju: How do I view jettons information in tonkeeper , tonhub ?

Jangju: tx information appears, but the holding balance status cannot be found.

Jangju: Hmm.. It seems that only openmask are possible.

snejok: Hey there! I need devs advice. Can I send a screenshot from DeDust chat here? It seems to me that there is a problem with liquidity pools that is hidden.

snejok: The answer to the last question did not follow. Please could you clarify.

snejok: DeDust have a swap liquidity contract, but no one else has access to it. They claim that it is impossible to manually withdraw liquidity from it. What if they disappear then? The contract will disappear along with them with all the liquidity if you cannot use these pools just by forking.

Nick: What do you mean by forking?

Taewoo | Spacebar Ventures / HabiliAI: Is there any time deadline for the upcoming validator update?   Or does it have to be done on the exact time?

Taewoo | Spacebar Ventures / HabiliAI: Validators: we remind you that tomorrow at 13:00 UTC an network update is scheduled - you will need to update your software at that time.  Please be in touch tomorrow at 13:00 UTC, detailed instructions will be published. (forwarded from TON Status)

snejok: I mean, we have a pool where there are tokens that can be traded. According to the answers, it is clear that the pool does not belong to anyone, but only DeDust has access to it. If DeDust vanished, then tens of thousands of dollars vanished with it at the moment, and possibly hundreds in the future. By "forking" I mean, why is it not possible to use this liquidity of this pool to another dex if DeDust suddenly disappears? This pool will simply remain ownerless forever, which is absurd. (reply to 19294)

Nick: It will be possible in future, as soon as the protocol become more mature and open. Anyone will be able to integrate own platform to the pool.

snejok: Well, ok. Thank you. The situation just confused me and info was needed.

Dev: does toncli run on Apple M1 or is docker still needed?

Alex: It works w/o docker, but people are faced with problems of installing binaries and dependencies solving. Docker just helps you to exclude this part of the problem from installation.  I have both versions of toncli on M1, both works fine. (reply to 19301)

Dev: Did you have an issues with bitstring? When I run toncli start project_name I get: ImportError: cannot import name "BitString" from bitstring (/*/Library/Python/3.9/lib/python/site-packages/bitstring.py) (reply to 19302)

Egor: pip install bitstring==2.0.3 (reply to 19303)

Egor: Newer versions of bitstring library use different namings, but toncli tries to install the latest version, so you should downgrade it manually with this command (reply to 19304)

Dev: Yep that works. Thanks (reply to 19304)

Slava: Thank you for reporting spam messages. If you would need moderator intervention please just mention me.

Step: can we also mention if we need support with code? (reply to 19311)

User<5265797030>: Can someone please teach me? Are you in charge?

Slava: I look through all the messages. If I see questions that I can adequately answer, I do exactly that :) (reply to 19312)

Tigr: How much time on average does it take for a Core TEP to be reviewed?

Slava: That would depend on the TEP and on the current workload of the core team. (reply to 19315)

Tigr: Am I right that Core TEPs are tested on testnet before merging with mainnet?

Daniil: Sometimes TEP does not need any changes in node sources (reply to 19317)

Daniil: For example, TEP can be a format (like jetton or nft)

Tigr: Afaik core teps assume changes in code, like this one  https://github.com/ton-blockchain/TEPs/pull/88 (reply to 19318)

Daniil: Just look at some other merged teps (reply to 19320)

Tigr: There are no merged TEPs with type Core

Daniil: Oh you meant that

Daniil: Where do you see that type?

Daniil: I don't see such label or tag

Tigr: This TEP, for example https://github.com/ton-blockchain/TEPs/pull/88

Tigr: Check out the TEP template (reply to 19325)

Daniil: Ah, I see now

Daniil: I think all major changes are tested in testnet first

Tigr: I see

Tigr: It'd be very handy to have ecrecover function embedded in TVM which is proposed in TEP88

User<5841544202>: Hi! Is there any giver for the testnet with more then 2 coins per ask? I intend to test the validation scripts, so I need to be able  validates on testnet.

Dario: Ecrecover only check signature, you can already do it using check_signature (not ecdsa, only ed25519) (reply to 19331)

&rey: Hi there! I've made a tool visualizing transactions flow: https://ratingers.pythonanywhere.com/tx-explorer/  Features: 1. Tracking multiple accounts. Just enter contract address into text field and possibly a name next to it. 2. Showing account balances. 3. Decoding known opcodes (currently jetton-related; NFT ones are not yet added). 4. Showing transactions in order as they happened, including external messages and messages from/to untracked accounts.  Known TODOs: 1. Add more opcodes to database. 2. Create button to easily add untracked peer of a message to track. 3. Loading transaction exit codes and fees.

Imposer: guys when would this PR be merged? https://github.com/Trinketer22/func_docker/pull/5

Imposer: seems like it would help a lot in using the toncli

Tigr: Implementing it way it is presented in TEP88 will allow to do things besides checking the validity of signature (reply to 19333)

Dario: Yeah.that would be cool (reply to 19337)

Slava: @f_closer (reply to 19332)

User<379834296>: Hi

💤@Roby✨🕶: Hello! How do I become a node storage? could you give me more information?

Nati: Hey 👋🏼 You can find more information about TON Storage daemon here. (reply to 19341)

Nati: If you want to be a storage provider, look here. (reply to 19342)

💤@Roby✨🕶: are we still in the testnet phase? regarding possible earnings? how will the calculation be?

💤@Roby✨🕶: @natisht

User<5220801977>: Pensi che qualcuno comprerà la mia carta d'identità? (reply to 19339)

User<5718323121>: I am new on TON. I am following this article. (https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func) I deployed successfully. but after I changed  "const initialCounterValue = 16;" and then I can`t deploy

User<5718323121>: what problem?

Nati: TON Storage was introduced to mainnet in the 12.2022 Update.  Earning are per smart contract, all depends on the people who deploy them.  See Smart Contract Source Code for specifics. (reply to 19344)

User<5429175398>: Hi,  I am new need  guidelines

— 2023-01-10 —

Silvio: Hi, someone know a easy way to mint SBT in TON whitout coding?

Silvio: Like minter.ton.org but for SBT.

Silvio: None tool like that deploy yet?

doni: sbt ? as soulbound nft ?

Silvio: Yes. (reply to 19367)

Silvio: SBT = Soulbound Token

doni: so basically its an nft that doesn’t support transfer functionality

Dev: yes always say exactly what error message you are seeing.   Send a screenshot or at least indicate the error message and it will be easier to help (reply to 19351)

TonD: Hello!  Somebody knows where I can find a source code of FIFT words? (e.x. priv>pub, i>B, etc)

&rey: https://github.com/ton-blockchain/ton/tree/master/crypto/fift (reply to 19382)

Xalkan: Hi! Greetings from Bariloche, Argentina 🇦🇷

TonD: Thanx (reply to 19383)

PlanL: How can I generate a random integer with FunC?

PlanL: And what is the difference between %, ~% and ^%?

Nati: You have rand() in stdlib. (reply to 19386)

Dev: is there a guarantee that bounced message will be received by the sending contract?

Dev: what effort is made to send the bounced message back to the sender when it cannot be delivered or processed?

&rey: Any successfully sent message is always delivered, this is guaranteed by message queues in shardchains. If the receiving contract failed processing of message (computation phase exit_code not 0 and not 1), and message contains enough value and was sent with bounceable flag, then the bounce message is guaranteed to be sent. (reply to 19390)

Dev: I see. And what about timeouts on messages? Always delivered within a timeframe?  Or I guess it probably determined by the existing network load and generally quite fast. (reply to 19391)

Dev: Also what is proof that a message has been sent successfully? And is that proof always available to the sending contract? (reply to 19391)

&rey: Messages are delivered in order of their creation, usually quite fast. You may be interested in chapter 2. https://ton.org/docs/tblkch.pdf (reply to 19392)

&rey: If the message was sent with mode & 2 == 0, then either the full transaction fails or this outgoing message is sent. Otherwise, there is no way to check whether message was sent (or counting balance, but that's error prone...) (reply to 19393)

Dev: Ok and record of message being sent and its mode is stored locally in the sending contracts own data? or this is just an implementation option for the sender? (reply to 19395)

PlanL: Thanks (reply to 19388)

&rey: No, nothing is stored in contract data when sending message. Your contract may save them, but the message data has no use. By the way, this allows to keep storage fees small, or transactions list could eat up the contract balance. (reply to 19396)

Daniil: This can also be useful: https://ton.org/docs/develop/smart-contracts/guidelines/message-delivery-guarantees (reply to 19394)

&rey: Oh, this article wasn't in place when I visited documentation last time) (reply to 19399)

Dev: I will definitely take a look. I know we want to keep the memory footprint of the contracts light. Perhaps just some meta-data can be stored about the last message sent and overwritten when transaction completes ... (reply to 19399)

Dev: "messages that were sent from one account and transactions which happened on one account are strictly ordered as well. Thanks to this, for every account we always know the order of transactions, received messages and sent messages."  I know that TONAPI has a trace facility but from within the account contract how would this information be accessed?

Dario: Hello guys! Is there any explorer that support onchain image_data in snake format? tonapi doesnt seems to work, but might be an issue from my side

&rey: The contract cannot access blockchain state. Not even its own code as cell. (reply to 19402)

Silvio: Exactly. (reply to 19370)

Slava: https://no-hello.com/

ᅠ: Is any func testing software? (before deployment?)

Daniil: https://github.com/ton-community/tx-emulator

Daniil: https://github.com/ton-community/ton-emulator

TMKz: Hello, when will the January roadmap be updated? Thanks

— 2023-01-11 —

Oleg: Hey guys, we have released TonUtils Reverse Proxy - alternative, fast and simple rldp-http proxy designed to host your own TON Sites!  It is simple to setup reverse proxy which allows you to run your own site in the TON network, and configure domain literally in 1 minute! Domain assigning is done by simple scanning of QR code. Just run this service, scan QR using any TON wallet app, and confirm transaction. Your site will be available on your domain.  This proxy uses completely native TON network stack implementation in golang, with high test coverage. Based on tonutils-go.  Also, to get 100% end2end encryption, I recommend to use TonUtils Proxy on the client side🙂 It is based on the same stack and should work perfectly.  The first site in the TON network which is based on the alternative network stack implementation is already available at http://utils.ton/ 🚀

Step: also please  release vanity_fast for v4 address. (reply to 19417)

Moshe: Hi - I assume the TON team is already aware of this - which I am guessing is a Phishing Scam.  Please be aware.  https://tonwhales.com/explorer/address/EQDUbQFC--hBa_vP0UFMsM1lQi4sr7xNBBGxO15UX63KDq4s

Андрей: If you are talking about a near-zero transfer with a comment about account blocking, then it is aimed at semi-literate users, and yes, this is a phishing scam. This type of phishing has always been in vogue among scammers, and nothing can be done about it. The only solution to the problem is self-education. (reply to 19420)

— 2023-01-12 —

L: Hi, maybe someone know how to get validator list or config params with nodejs? Before has method client.services.configs.getConfigs() in ton library, but in new version is removed.

Александр: Greetings 👋 Can anybody explain plz how are the fees for the smart contracts calculated? I see hardcoded values used to deploy smart contract in both toncli and typescript examples... Are the fees static, should't they be determined dynamically by the network instead?

Daniil: https://ton.org/docs/develop/smart-contracts/fees (reply to 19444)

Daniil: sometimes it's easier to just set a fixed fee that will surely cover everything. the remaining value will just return back to your wallet (reply to 19444)

Steve: If you coded so

Александр: Thanks, that's what I was looking for! Also found one interesting moment: Storage Fee: 4.036608 TON (1.00 MB for 365 days) I thought that the fee is payed when deploying a contract (with corresponding storage amount). Will it be charged every year from the same wallet the contract was deployed with? (reply to 19446)

User<5277567113>: I want to create NFTs give me step by step pls

Александр: Ok I got it Storage fees are collected from the smart contract balance at the Storage phase of any transaction.

Александр: So the storage fee is charged from any wallet interacting with the contract, not the original one from which it was deployed, correct?

Александр: This is interesting how smart contract balance is maintained...

&rey: Not even so. The storage fee is charged from the contract which is processing the message. (reply to 19451)

&rey: You may wish to read abount actor model for contracts in TON - the only interaction method is sending message to other contract. Description is located somewhere in docs. (reply to 19452)

&rey: The fee is taken at transactions == when contract receives a message. (reply to 19448)

Александр: Hmm the only useful doc page I found is this one: https://ton.org/docs/develop/howto/step-by-step

Александр: So the contract balance should be maintained somehow...

Александр: Say I'm developing a kind of forum, so the smart contract shoul then explicitly withdraw the fee for storing a post data from user's wallet making the post it seems...

Alex: What for you want use blockchain for your forum? Maybe these thoughts from original whitepaper(https://ton.org/docs/ton.pdf 2.9.13) will be useful for you. (reply to 19461)

Diako: empty#_ b:bits = Snake ~0;  could you please explain what  ~ and Snake do ?

Александр: The messages of the forum would fit 1024 bits just fine. It's more of a Twitter than Facebook. And the user should pay for the posts in the original design. As for the reason to use blockchain it's simple: in order to avoid restricting resource in some countries and for user privacy/security. (reply to 19462)

Александр: I guess I should learn how NFTs are implemented, as the post would be some kind of paid token as well...

Alex: Your reasons, I think, will be covered by Ton Sites with proxy for your service and Ton auth through wallet for users. Example with facebook and twitter same in one general part - too expensive and useless support "posts" in TON's native blockchain messages. (reply to 19464)

Александр: Thanks, that makes sense. But there's no documentation on creating Ton Sites just yet, correct? (reply to 19466)

Daniil: https://ton.org/docs/participate/web3/sites-and-proxy (reply to 19467)

Александр: I wonder how the storage issue is different for the Ton Sites though.

Александр: Ok I'll study this first, thanks!

Oleg: New version of TON golang library 💎 tonutils v1.5.0 has been released!  Very big update, full network stack was implemented: ADNL UDP, RLDP, DHT (client), RLDP-HTTP. You can create your own TON native services and sites. The code is covered by unit and integration tests, has benchmarks with performance tests + leaks monitoring.  Also, caching of CurrentMasterchainInfo was improved, now when you using sticky context, you will get less errors like 'block not applied' from TON nodes, when working with multiple of them in parallel.  Two cool projects already powered by tonutils' network stack: TonUtils Proxy and TonUtils Reverse Proxy, alternatives to rldp-http-proxy with user-friendly setup. Using them you can access and run your own sites in the TON network.  Changelog: 1. ADNL UDP Protocol client/server implementation 2. RLDP Protocol client/server implementation 3. RLDP-HTTP Protocol client/server implementation 4. DHT Protocol client implementation 5. TL Struct Parser + Serializer 6. DNS Set record payloads 7. Sticky CurrentMasterchainInfo (cache block based on the node id)  🚀 https://github.com/xssnick/tonutils-go

accaa33 |🐍 🌱SEED 🐾 Σ 🆙 UXUY DUCKS 🦆: Hi admin ! How can I get more ton for staking node ? I just requested it but 2 ton per request. Thanks

Diako: @Gusarich (reply to 19463)

User<5718323121>: I send some msg to smart contract by "await client.sendExternalMessage(wallet, transfer)" on typescript. I can`t get any error message, but state is not changed according my desire How can i get error message?

&rey: 1024 bits is 128 bytes (characters), but please note that if person is sending ordinary comment 32 bits is used so only 991 bit (123 characters) is remaining. (reply to 19464)

&rey: But if the forum has less internal functions (like moderating, for example), it will consume significantly less resources. Also, I think some of required computations can be done offchain and their correctness proof presented, like in ZK-SNARK. (reply to 19462)

User<5718323121>: I send some msg to smart contract by "await client.sendExternalMessage(wallet, transfer)" on typescript. I can`t get any error message, but state is not changed according my desire How can i get error message or transaction id or the result of (success or failure)?

Steve: Comments are infinite (reply to 19475)

&rey: If external message failed then there's no place to look its transaction ID, as this message "never existed". Maybe, you should try another library, that will return you the server's response. (reply to 19477)

User<5718323121>: This is my tx (reply to 19479)

User<5718323121>: https://tonscan.org/address/EQA6lau-KEykQMbog-5s8x93KhDkIzfB2nYEA8GGMWccplDp

User<5718323121>: You can see error code 14 on last tx

User<5718323121>: Could you explain about 14?

&rey: Exit code -14 means that there is not enough gas (in this tx, even to launch TVM). (reply to 19482)

User<5718323121>: How can I get description about errors

User<5718323121>: like as url?

&rey: https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes (reply to 19485)

User<5718323121>: thank you! (reply to 19487)

L: hi, where is can read about algo for transforming validator publicKey -> address, can not find.

Hau | SEED🐦 SUI🐾 BabyDoge PAWS 🆙 UXUY: how to remove node, I want to reinstall?

Slava: @f_closer (reply to 19472)

Slava: What node? (reply to 19492)

Hau | SEED🐦 SUI🐾 BabyDoge PAWS 🆙 UXUY: Full Node/Validator

User<5277567113>: How to create NFTs? Pls help?

User<5718323121>: I`d like to get dict from cell from callGetMethod on typescript

User<5718323121>: func(smart contract) source (slice) get_bots() method_id {    var (pending_platform_fee, admin_address, bots) = load_data();   return begin_cell().store_dict(bots).end_cell().begin_parse(); }

User<5718323121>: typescript source  call = await client.callGetMethod(newContractAddress, "get_bots");

User<5718323121>: and then how to get dict datas from call

User: https://getgems.io/ (reply to 19496)

Nati: I have this TL-B scheme:  telemint_text$_ len:(## 8) text:(bits (len * 8)) = TelemintText;  If I understand this correctly, the first 8 bits is len, then the next len * 8 bits is the text?

Nati: Because for some reason when I read the stack cell with pytonlib only the text is present in the data and not the len.  Maybe pytonlib reads the length for me for some reason?

Vadim: Hello everyone! How to create TON DNS Nft? Pls help?

User: https://dns.ton.org/?testnet=true (reply to 19507)

Vadim: Thank you very much!

TonD: Hello guys!  How much time contract is active with zero balance and some data onboard?

Kate: Hey there!  Is anyone in Portugal now?  Looking for a TON specialist who can be a speaker for an offline meetup in Lisbon🤞🏼  Please text me on DM

— 2023-01-13 —

User<5718323121>: How to transfer ton or other coins on smart contract to other wallet?

User<5718323121>: how to send internal message to another contract from my contract?

&rey: Look for send_raw_message article.

Ильдар: Hello. I want to find some team to get experience with TON. I know C++, Python, Solidity, EOS. DM if you may help me

Dario: https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages (reply to 19522)

User<5718323121>: thank you! could you explain about 'body' parameter? (reply to 19525)

Step: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body)    here  my_balance with including the incoming msg_value ? or without?

Daniil: including

Diako: () recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body)  body parameter is for in_msg_body (reply to 19526)

&rey: Is there any TON forum for public discussions? I have an idea for service but it needs to be developed. Which place is the best to post it?

Daniil: If it's something that will help TON in some way, you can try submitting it as a Footstep (reply to 19538)

Liam: ^^^ what @Gusarich is referring to: https://github.com/ton-society/ton-footsteps (reply to 19538)

&rey: Yes, I know this, thank you. However, the concept is in development yet, so I don't think format of Footstep suits it. This is about torrents in TON. (reply to 19540)

tom: I got an error log after I install mytonctrl.Like  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a number, not 'NoneType'.What should I do next?

Андрей: this means that your local node has not yet started syncing. If the node was installed before, you need to wait, synchronization can take up to one day. (reply to 19542)

tom: OK,Big thanks.

G.H.Xu: Which one should I choose for my project, ton-cli or ts template?

Tri: Is there TON wordpress plugin to integrate ton wallet for wordpress users ?

Aleksandr: Guys, who can tell me about storage, if I lose my BagId, did I lose my file?

Dev: One thing I would say is that toncli is useful to be installed even if you use templates because of the types of testing that you can easily do on smart contracts via toncli (reply to 19546)

— 2023-01-14 —

User<1179794801>: Hello, I am new here, greetings from Italy

User<1179794801>: I have got a few question being  a developer but noob about this kind of software creation. At first: can I use c# someway for building apps and web apps with TON blockchain?

•: where can i see new products

Howard: is it possible to build an in-app Dapp?

Silvio: Yes, check @TonSwapOfficialBot (reply to 19563)

Howard: I think this example is outdated. It can't execute https://ton-community.github.io/ton/

Daniil: I just checked it few days ago and it worked fine (reply to 19565)

Daniil: What error do you get?

Liam: let's get you in the TON dApp Working Group (reply to 19563)

Behrang: I think you can create the client side of any app and dApp with C#, but for smart contracts, currently FunC is your best option. (reply to 19559)

MohammadΣ: Why is it not in the trust wallet on its own blockchain?

Howard: do you have the group for TonCenter API? (reply to 19566)

Howard: why will still got "      error: 'API key does not exist.',"

Howard: Hi I got this error since I copy the mnemonics from TonHub(Testnet version, Sanbox)

Howard: Got this error, seems not the Private Key (the Wallet Address I have) issued, or API issued. Here is my code: (reply to 19583)

Howard: For the init code I want to deploy for smart contract, is the code I generated in Tact language folder.

Howard: I am guessing that, the external message means here were the data I send with the Txs? (reply to 19583)

Howard: OK, just fixed. Seems need to give body or bounce in fileds.

Howard: if you are using "https://testnet.toncenter.com/api/v2/jsonRPC"   and by the way, make sure your mnemonics is correct. By using the library     let kk = await mnemonicValidate(mnemonics); you can get a true or false message to verify.    And double check the wallet address you got is exactly the same as your Wallet address or not!

Howard: Anyone can give the example for the usage for series of API over here?  - I want to track the specific address with the "Specific Txs Message" (Let's say method code: 0xd947b7c) Which API should I use?  (aka, then I can have a notification system to track and give notify to my users)

Howard: is TonHub wallet address is the same as V4r2 type of wallet address on TonKeeper?

Alex: Yes (reply to 19602)

Nati: If anyone need a way to get data about Telemint NFTs (smart contract that Telegram is using for fragment.com auctioning)  I've made a Python library for PyTONLib to help with that :) (reply to 19222)

Ekaterina: @andreypfau Hello dear admins, can you please tell why my previous post was deleted?

Andrey: one moment

Ekaterina: I will repeat it one more time:)

Ekaterina: Dear toncoin developers, we have deployed Toncoin beta GraphQL endpoint,  https://n01.ton.dapp.tonlabs.io/graphql api documentation is here https://docs.evercloud.dev/reference/graphql-api

Step: tvm has anything like console.log ?

Dario: ~dump();

Dev: what are the types of testing that can be done on a smart contract in the ton-contract-executor?   And what are its limitations?

Tim: You want to use emulator, it's newer and has more functions. But basically you can check what messages will be sent from contract (reply to 19624)

Dev: Ok, well let me repeat the question then for emulator.  What type of tests can be run and what are its limitations? Also for the test themselves are those typically typescript? (reply to 19625)

Tim: I've described basic outline. You make message and check what it will do to contract state. You can check examples in getgems contracts repository.  Emulator will do the same and a little bit more.

Step: Will you update your ton lite client fork to support newer version of ton js? (reply to 19627)

Tim: it's already updated to use ton-core

Active: Hi guys , is there any contract example that uses jettons? Something like lottery or donations or (even better) dex but opensource

Dev: whats some good test examples to look at in getgems contract repo? (reply to 19629)

Tim: idk, look at all of them, it's not that many

Dev: when I look at the top-level dependencies I don't see emulator there ..  "dependencies": {     "@ton.org/func-js": "^0.1.3",     "@types/uuid": "^8.3.4",     "bn.js": "^5.2.1",     "chai": "^4.3.6",     "mocha": "^10.0.0",     "ton": "^11.18.2",     "ton-compiler": "^1.0.0",     "ton-contract-executor": "^0.5.2",     "uuid": "^8.3.2"   } (reply to 19632)

Dev: is it included via "ton": "^11.18.2"?

Step: may be this https://github.com/ton-community/tx-emulator (reply to 19634)

Dev: yes thats the one

Step: after  const client = new LiteClient({ engine });  how can i know when client is ready to query? it shows engine closed error. if i query something as soon as instantiated (reply to 19629)

Tim: no idea

Step: 🤔

Tim: just wait a bit

Vladimir: No yet. Just var~dump and dump_stack (reply to 19622)

Andrey: And ~strdump (reply to 19641)

Andrey: https://github.com/disintar/sale-dapp/blob/master/func/contract.func#L208 (example)  https://github.com/disintar/sale-dapp/blob/master/func/asm/dump-utils.func (little helpers to dump ints in strings)

T: Hi there! Is there an explorer available for tracking pending/mempool transactions? I've submitted a transaction through the testnet TON Center API over 1h ago and it still didn't get confirmed. All transactions I've submitted before have been confirmed within seconds. Having an explorer which offers a more detailed look into the current network status, individual blocks, and pending transactions would be really useful for development.

— 2023-01-15 —

Howard: is testAddress still works to paste my test-net Wallet like this?

Howard: from ton-emulator

Howard: happy Sunday, anyone can share some testTON for me. Thank you!

kirito: excuse me, i am a new, how big is ton full node？How to deal with the infinite growth of data？

Daniil: testAddress(seed: string, workchain?: number) (reply to 19654)

Daniil: you pass not an address to it, but some seed

Daniil: like testAddress("qwerty")

Daniil: and it will generate some deterministic address from that seed

Daniil: there are no pending txs/mempool in ton (reply to 19646)

Howard: I am using Address.parse("my Address") now (reply to 19657)

Party: The size of the archive node is greater than 2 TB. If you don't need an archive node, then don't store the entire block history. To do this look at launch options validator-engine: --state-ttl<arg>      state will be gc'd after this time --block-ttl<arg>      blocks will be gc'd after this time --archive-ttl<arg>    archived blocks will be deleted after this time  It's from validator-engine --help If you are using mytonctrl, then you need to edit the run command: /etc/systemd/system/validator.service (reply to 19656)

kirito: how big without history? dose ton have the same prblem as eth? https://medium.com/hackernoon/the-ethereum-blockchain-size-has-exceeded-1tb-and-yes-its-an-issue-2b650b5f4f62 (reply to 19663)

Steve: it jus just required for historical data, if you want have all transactions and you usually don't need much

Steve: state itself is not that big

kirito: Ethereum world state consists of account nonces and balances, contract code and storage，If the state size grows infinitely， eth have no future。 How TON can solve this problem？

T: Then where do transactions go after sending, but before being added into a block? Correct me if I'm wrong, but there must be some sort of temporary storage where transactions wait to be included in a block by validators. While there might not be a global mempool, there should at least be one for each work or shard blockchain, I assume. After all, how do validators agree on which blocks to include, if they don't have a picture of all the possible transactions which could've gone into a block?   Sorry if these are dumb questions, but I'm still reading my way through the white paper. :) My main concern is the testnet transaction I sent through TON Center API - why did it never get confirmed, unlike the dozens of transactions I've sent prior? Are there some additional checks my code needs to make and potentially resend the transaction or something similar? I've followed the examples provided in the documentation and didn't notice anything alike. In all examples you shoot and wait for the confirmation, no extra logic to handle cases like mine.  Thank you for your help! (reply to 19661)

Daniil: in TON everybody pays for their storage consumption. if this problem will ever become serious, validators can just increase the storage fees (reply to 19667)

kirito: Is the payment one-time or ongoing? (reply to 19669)

Daniil: external messages are processed by validators. some validator can just ignore your message if something happens and he won't be punished for doing that. external messages have no guarantee of being delivered (reply to 19668)

Daniil: it's like memory*time=storage_fee. you pay it on every transaction, and it's usually VERY small. gas fees consume much more (reply to 19670)

TON technical overview: Besides, storage shards the same way as computation, thus if state become too large for one node to store, it will be expedient to increase number of shards in such a way that part of the state each node need to store will become small enough.

kirito: For example, if I buy some ton and put it in my wallet, it will always take up storage, and I don't think I paid anything. Or I generate some data on other contracts, I think I will only pay when running the contract. Data will exist forever, and the more contracts there are, the more data there will be.

Daniil: you pay on each transaction (reply to 19674)

Daniil: This will help you: https://ton.org/docs/develop/smart-contracts/fees#storage-fee (reply to 19674)

kirito: How can a node validate a block if there is no complete state? (reply to 19673)

Daniil: TON is shardable. each validator only need to store and process the messages within his shard (reply to 19678)

TON technical overview: Validators validate blocks of distinct shards. Thus they need only data of this shard. (reply to 19678)

T: So there's no guarantee the transaction will get delivered? I guess the best option in this case is to re-broadcast it every X seconds or a minute then? Would be nice to include this in the docs, because I think it's a pretty important point, especially when you need to process transactions in a queue, like you do with seqno-wallets, an ignored transaction can brick your entire system, if not handled appropriately. (reply to 19671)

Daniil: yes, you just should resend it. trying like every 15-20 seconds should be fine. (reply to 19681)

T: Got it. Thank you for your help! (reply to 19682)

kirito: Can I think that ton will not encounter eth problems? Especially as mentioned in this article, the number of working nodes is getting smaller and smaller。https://medium.com/hackernoon/the-ethereum-blockchain-size-has-exceeded-1tb-and-yes-its-an-issue-2b650b5f4f62

Daniil: in PoS blockchains, the number of working nodes is getting only higher and higher usually (reply to 19684)

Daniil: because it's pretty profitable to maintain a validator node

Daniil: also note that this article is old (2018), and eth is PoS now too (reply to 19684)

kirito: The above article mentioned that there will be fewer and fewer nodes that can work on eth in the future, and most nodes can only forward messages, but cannot verify them. Because the "world state" is getting more and more, the cost of verification is getting higher and higher。Even though eth has become poS. He still faces this problem? (reply to 19687)

kirito: In fact, I don't care about eth, as long as ton doesn't have this kind of problem, I will be very optimistic about it.

Daniil: ton doesn't have this kind of problem. (reply to 19689)

kirito: short eth 🙈

ally11: Hello developers! What I am need to do with that error. I'm getting it on tonweb (js) when I'm deploying the contract  const deploy = wallet.deploy(keyPair.secretKey); const deploySended = await deploy.send();  Error:  Failed to unpack account state

&rey: Doesn't deploy use keyPair.publicKey as argument? (reply to 19692)

ally11: what's version of contract is using https://wallet.ton.org

&rey: I think that's v3R2 unless it has been updated since summer 2022. (reply to 19694)

ally11: k

ally11: I'm just getting different addresses

ally11: my code   let wallet = WalletContractV3R2.create({ workchain, publicKey: keyPair.publicKey }); let contract = client.open(wallet);  console.log(contract)  and I am getting an different addresses

T: I've updated my code to resend the transaction every 20 seconds and it's still not coming through. What could be the issue? See the sending code attached.  Sending wallet: https://testnet.tonscan.org/address/EQAKgUmCYrQ4L8_Fs8X69QD9mt-vkBDATBJeAmCAca8qoLaO (reply to 19682)

Daniil: are you sure your seqno is correct?

Daniil: you can also try printing the result of that sendTransfer call

Daniil: there should be execution logs somewhere. big chance that your transaction just got rejected because of some wrong parameters

ally11: can u help me? (reply to 19698)

T: Yes seqno is correct. This wallet has only sent 1 transaction so far with seqno 0. You can verify that on tonscan (reply to 19701)

T: SendTransfer doesn't return anything (Promise<void>) (reply to 19702)

T: Hmm not sure where, i haven't been able to find any yet. Will have another look (reply to 19703)

User<1800730764>: hi, where can I see all the tokens and projects on the ton network?

ally11: bodybag of cells is expected to have exactly one root" what is it

T: Double checked the source for "ton" js library and I can't find any way to get logs for the sendTransfer request. Since it uses axios under the hood, I tried adding request/response interceptors, but that also didn't seem to work - I guess the lib gets a different instance of axios than my service. Might need to come up with some temporary hacky way of getting some code added to the lib, so I can log the relevant data myself (reply to 19703)

Simon: hi, how about adding sections to the group.  General, flood, jobs etc. Just in the Russian chat, this person (@f_closer) distributes mutes and bans to everyone.

Alex: I've done deployment script via ton library for tact-wallet and it works, but I'm not sure my way to get pk as Bigint really fine. Could somebody check and advice best practice for TS in this case?

Steve: This is a little bit tricky, but i am just writing 256 bit uint to cell and then read 32 byte buffer from it and vise versa (reply to 19714)

Alex: I understood general idea, but could you give me an example of code or link relates to my case?🙏 (reply to 19715)

shahar: /build_tonlib

T: Not sure if this helps clear things up, but I managed to log the API request & response relating to this issue. API doesn't give any indication that there is something wrong with the transaction. (reply to 19703)

&rey: Have you tried using other API provider? For example, if you're using toncenter.com now, you could try tonapi.io. Or the other way round. Or, you could start lite client in toncli and try to send the BOC from there. (reply to 19721)

T: Haven't tried that, thank you for the suggestion. I'll give that a shot

T: Ok `tonapi.io` does return an error. I'm just not sure what it means (reply to 19722)

&rey: This means transaction is outdated, you have to create new one with later expiration time. (reply to 19724)

T: Hmm but it was generated only seconds before I submitted it through the API. How long is the expiration? And does it matter that my service already submitted this boc through toncenter API before I tried sending it manually? (reply to 19725)

Daniil: Maybe your computer time is wrong (reply to 19726)

T: Oh, you may be right. Looks like the server i was testing on is almost 1min behind. That's why I never encountered this issue on my local machine. Didn't expect the time to have anything to do with this. Nice catch. I'll sync the time and see if that changes anything (reply to 19727)

T: Yep, looks like that was the issue! The moment I synced the clock, transaction went through. Lesson learned - correct time is important to be able to send transactions. Thank you a lot for your help and patience @Gusarich and @pcrafter !!

Power: Hello, does TON uses solidity?

Андрей: No, currently only FunC, in the future Tact lang (reply to 19730)

Steve: Tact already released

Step: if i put ~dump(encode_number_to_text(int variable))    i can see output in explorer? (reply to 19643)

Steve: No

Step: where i can see ? (reply to 19736)

Step: how to debug variables?

Step: 🤔  i am getting exit_code:5 in nft transfer transaction of custom nft contract how to debug it? (reply to 19736)

Andrew: try to use dton.io for debug (Transaction details -> Computation Phase -> Server run) (reply to 19739)

Steve: Why not in browser?

Step: how to debug failure  https://test-explorer.toncoin.org/transaction?account=0:330cc627602385348a0e6dd97666a7a481c4002f1d764057f2992ca820f9b456&lt=7780194000003&hash=ba15159b45455fca3cc8910df9f9388c203defe89be63e46b9789196cfbea562  exit_code : 5 (reply to 19741)

Andrew: https://testnet.dton.io/tx/BA15159B45455FCA3CC8910DF9F9388C203DEFE89BE63E46B9789196CFBEA562?time=2023-01-15%2019:19:00  try server run (reply to 19742)

Step: tons of opcodes which i dont understand 😫 (reply to 19743)

Step: how to know howmuch ton contract attempted to send in a transaction? (reply to 19744)

&rey: Search for STGRAMS opcode. (reply to 19745)

Andrey: Int is negative 👀 (reply to 19747)

Step: what are these numbers? (reply to 19747)

User<5718323121>: ton testnet is not working yet?

TON technical overview: Testnet works fine, but if you didn't touch it for a long time you may need to update network config and upgrade node/tonlib https://t.me/testnetstatus/10 (reply to 19751)

Party: https://testnet.dton.io/ (reply to 19751)

User<5718323121>: I am using ton node version 13.3.0 (latest) (reply to 19752)

User<5718323121>: so I deployed my smart contract to mainnet

User<5718323121>: but it`s not working on testnet

User<5718323121>: talkol said that testnet is often down

User<5718323121>: So I used real ton to test and develop

User<5718323121>: and some are stolen

User<5718323121>: What did I mistake with my source ( https://github.com/hubenokdev/ton_egoswap )

User<5718323121>: https://github.com/hubenokdev/ton_egoswap/blob/master/scripts/deploy.ts#L24

User<5718323121>: you can change (let netmode = 'test')

User<5718323121>: to deploy to testnet

Alex: Hi guys, trying to use tonconnect/reactui, do you know by any chance, if I can so async with it bc it is always null on the first render

𝓢𝓪𝓶𝓾𝓮𝓵: Thank you very much for your reply! What kind of special browser would I need? Do you know of any that are efficient? Regarding the browser, could people with conventional browsers be redirected to the https domain? Or could this action only be executed by using the special browser? (reply to 19285)

𝓢𝓪𝓶𝓾𝓮𝓵: My idea is to pool the traffic, and in this way I can track the DNS backlinks on my website 2.0

𝓢𝓪𝓶𝓾𝓮𝓵: Nothing special, but this would be incredible if you can open https sections as you tell me because you can incorporate landing pages of your services, social networks, products, etc.

— 2023-01-16 —

&rey: It depends on exact contract code. The bottom one is some amount of coins which is attempted to write into builder, however as it's negative execution crashes. (reply to 19749)

&rey: For just browsing .ton network you don't really need a special browser, setting proxy to in1.ton.org does work. For safe and reliable browsing you may install proxy on your own computer. (reply to 19768)

Howard: any know exitCode: -14?

Behrang: I meant that someone could potentially create this imaginary browser or maybe someone can create a browser extension that can add such functionality.   My point was that DNS is a service and it cann have many different uses. But currently there is no https field to do what you asked. (reply to 19768)

Behrang: My friend, you are asking the first question that comes to your mind in this group. This will discourage other people trying to answer harder questions from checking this group.  -14 is just listed as one the standard exit codes here: https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes (reply to 19779)

User<5718323121>: are you working on testnet now?

Howard: yes

Howard: The data for TON is growing

mitokana: How to convert this address format?

Daniil: hash value isn't address (reply to 19789)

mitokana: How to convert to this format?

Daniil: And those destination and source addresses are in raw format.  If you just need to do it manually: ton.org/address  If you need to do in in your code, use some libraries like ton.js and their address classes

mitokana: How to convert hash to base64?

mitokana: LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction CADFC1BAEDB8EFB60E6871FB8E4F8A1F3565E0F41C7DD732BB1A73E3048D4957:\nexitcode=0, steps=0, gas_used=0

mitokana: This is the wrong transfer

Dev: see error running toncli run_tests: /Users/apple/Library/Application Support/toncli/test-libs/bad_messages_generator.func:19:16: error: undefined function generate_internal_address, defining a global function of unknown type     slice ssrc = generate_internal_address();

User<5718323121>: how to get testnet endpoint (url)?

Alex: https://ton.org/docs/develop/smart-contracts/environment/testnet (reply to 19800)

mitokana: How does this hash convert to base64?

mitokana: help

mitokana: Why isn't my address active?

Андрей: In python3 lang: import base64 a = bytes.fromhex("4223566B13DC30AF06C3E0A698BD82E5BEF6A88204F6D1924346D6C516173CD4") b = base64.b64encode(a) c = b.decode("utf-8") print(c) # QiNWaxPcMK8Gw+CmmL2C5b72qIIE9tGSQ0bWxRYXPNQ= (reply to 19802)

&rey: Redirection is possible with a browser extension. Please, could you point web2 parameter on your domain at your HTTP[S] site and name that domain to me so that I could test my proxy extension? dns_web2_address__temp#a908 url:(bits *) = DnsRecord; — I propose to use 0xA908 as 16-bit temporary prefix for setting record type. (reply to 19768)

&rey: Your contract isn't deployed. For wallets that means that you haven't done any outgoing transaction. (reply to 19806)

mitokana: What do I need to do now?

mitokana: This is how I created the address. Any questions?

&rey: Inactive contract isn't an issue, so do whatever you need 🙂 Wallet will be deployed automatically by TonWeb. (reply to 19810)

&rey: Though, do you generate new key pair each time? If so, you may be losing access to previous wallets.

mitokana: No, I only generate it once.

Dev: Do I have the right version of toncli?  toncli --version INFO: v0.0.43 toncli run_tests toncli/test-libs/bad_messages_generator.func:19:16: error: undefined function generate_internal_address, defining a global function of unknown type     slice ssrc = generate_internal_address();

User<5718323121>: So could you let me know correct endpoint url? (reply to 19801)

User<5718323121>: (https://testnet.tonapi.io/api/v2/jsonRPC) ?

— 2023-01-17 —

tom: Can I test the Validator function on testnet?

mitokana: How to get txid after successful transfer?

mitokana: return : { '@type': 'ok', '@extra': '1673920490.6927495:9:0.2514598724190026' }

mitokana: How to get txid after successful transfer?  return : { '@type': 'ok', '@extra': '1673920490.6927495:9:0.2514598724190026' }

Alex: you can't. Check this article, there are some general suggestions about reading contract's transactions. (reply to 19831)

mitokana: ok,thinks

&rey: What are the good ways to create a QR for ton://transfer link with large stateInit? My site is frontend-only so can't host the init cell on server.

&rey: As well, I want to minimize number of loaded external files for my site to be blazingly fast 🚀😀

tom: I have a server in Lan.What should I do on firewall when I want to build a validator?

Howard: Want to know as well (reply to 19836)

Howard: I think you can give the url then let user can click then jump to TonWallet?

&rey: That's a possible solution but it lacks Tonkeeper support. (reply to 19840)

&rey: I've thought a bit and now I think I've created a suitable system concept.

Party: You need to open port UDP to the outside. Use command netstat -ntlup to see what port the node is using (reply to 19837)

tom: Thanks (reply to 19843)

tom: What is the diff between Featured Pools and Nominator Pools on the https://tonvalidators.org page?

&rey: Thank you as well, this is an interesting subject 🙂 Do you know any reverse proxy for RLDP (for example, if my server checks incoming connections to be HTTP and allows all outgoing)? (reply to 19843)

Slava: The qrcode is a popular library that works OK. It's 24 KB uncompressed.  However, the state init could be very big and I'm not sure that's using QR codes is a good fit for this. (reply to 19835)

Slava: You can always use code splitting and dynamic imports to load the code that is not needed immediately. But this is a separate subject. (reply to 19836)

&rey: Yes, I'm using it and have met the problem that everything doesn't fit into QR code, and that's why I initially asked. (reply to 19847)

Slava: As @steve_kite said, maybe we need some URL shortening service for TON. (reply to 19849)

Behrang: Featured pools are not yet active, and they are looking for nominators to join them, so that they can become an active validator. They are highlighted there, to encourage new nominators to consider them.  Nominator pools are the list of all active and inactive pools. (reply to 19845)

NekoSenpai: Help.  in tonhub to start a connection (session) what to type in url? I tried with my web address (app) but when tonhub tries it says bad url.  what to write in that part?  I've been working on it for days XD.

Rimsky: Hi guys, are there any clear instructions regarding the installation of FunC and Fift?

Coalus: https://ton.org/docs/develop/smart-contracts/environment/installation (reply to 19859)

Rimsky: thanks, appreciate that (reply to 19860)

Dario: @steve_kite in ton-compiler, how can I add a fift library during compilation for a contract? My code requires TonUtil.fif but since its missing compileFunc fails.

Steve: impossible

Dario: what is impossible

Dario: the ton-compiler error or impossible to add such lib

Dario: i only need Gram,  which is defined in TonUtil.fif, and ton-compiler gives me error (reply to 19862)

&rey: Isn't it Gram without comma, word that pushes 10^9 to the stack? (reply to 19866)

Himu Globin: Hi, fam!   how to apply for grant to build on TON. We have been invited by a few chains but TON is quite impressive and I will love to know if we can get some support from the foundation for building our application blockchain front on TON  Thanks

Dario: yes, but i need Gram, (reply to 19867)

&rey: Well, I see definition of Gram, as well. Have you included TonUtil.fif in your file? If it still doesn't work, you could try to add instruction definition to your main.fif: { -1 { 1+ 2dup 8 * ufits } until   rot over 4 u, -rot 8 * u, } : Gram, (reply to 19869)

Dario: as I wrote above, the problem is that ton-compiler doesnt include it and compilation fails (reply to 19870)

Dario: im adding definition manually but the code wont be so readable

&rey: "TonUtil.fif" include (reply to 19871)

Dario: No, this works only to output. The problem is that toncompiler runs fift for checking and doesn't output anything if it fails (reply to 19873)

Dario: it works but its really a bad idea for readability (reply to 19872)

tom: Thank you. (reply to 19857)

tom: If I want my pool be displayer on the list of tonvalidators.org ,what should I do?Only charge 10000ton to the pool?

mitokana: How do I get the block height?

tom: thanks

TonD: Hi!  What does it mean error code -14 in compute phase?

Daniil: https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes (reply to 19890)

TonD: Thanx. I use old version of docs. (reply to 19891)

Nirmal: Hello all, I m looking for blockchain developer who can write smart contract

Dario: Hi, @f_closer can you please check pm?

&rey: Bored of using command line to deploy your contract, having to fix and reinstall toncli on every update, etc, etc? Here's a solution — page for deploying contracts! https://ratingers.pythonanywhere.com/deployer/ If you have code BOC and data BOC, you can enter them into fields and get QR for contract deployment, that can be scanned with Tonkeeper.

&rey: For example, you may type in code and data of TON DNS contract (https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz#source), and my tool will produce the same address as actual contract is.

Daniil: Why didn't you host it on GitHub pages? Does your application require backend? (reply to 19896)

&rey: No backend is used (except shortening links, that depends on external message), I'm just considering to make it accessible as TON Site. (reply to 19898)

Tim: short links on front too

&rey: They need to be stored somewhere for Tonkeeper to access them, so there's no way to work around this dependency) (reply to 19900)

Daniil: You're using jsonblob anyway. What's the problem with calling it from front-end js? (reply to 19902)

Dev: is toncli run_tests working for v0.0.43?

Andrey: https://github.com/disintar/toncli/blob/master/src/toncli/lib/test-libs/address_helpers.func  Make sure you have rigth libs in your toncli config folder (reply to 19816)

Dev: well I'm on a Mac M1.  I have python 3.9 and installed via pip3 install toncli - what else needs to be done?  func, fift etc I have compiled from source and point to those (reply to 19911)

Step: i think you need to include address_helpers.func in your test contracts or  address_helpers.func may be missing from your test-libs folder. (reply to 19912)

Daniil: - it's English chat  - it's dev chat (reply to 19904)

Dev: all I am seeing concerning config of toncli in the documentation is:  " Configuration Config folder will create on first deploy, all fift / func libs will copy to it, also deploy wallet contract will be created. "   Does this mean that toncli is not fully configured until it does a deployment? and that's why run_tests does not have access to address_helpers.func ?

Dev: what are the steps to get toncli properly configured?

Dev: what config folder are you referring to?  I don't see documentation of a config folder only its mentioned that a config will be created upon first deployment (reply to 19911)

Dev: Still see error after:  toncli update_libs INFO: Succesfully copied fift-libs func-libs test-libs from /usr/local/lib/python3.10/site-packages/toncli/lib to /Users/apple/Library/Application Support/toncli

User<5971037539>: The Open Network has been audited by SlowMist.  SlowMist, an in-demand auditing firm, has audited the security of the TON blockchain’s core.  The audit was a resounding success because no vulnerabilities were found. The report can be found on Toncoin’s page on CoinMarketCap in the “Audits” section.  In November 2022, auditing behemoth CertiK sifted through TON’s core code and smart contracts — and found zero critical issues.

Dev: Yes, so that fixed it. Thanks.  I replaced 1.address_helpers.func from the config folers and now its running (reply to 19911)

Dev: toncli run_test ;; always returns status code of failed:  toncli run_tests INFO: 🥌 Build successfully, check out ./build Loading private key from file build/contract.pk [ 3][t 0][2023-01-17 23:03:40.815992][vm.cpp:558]  steps: 11 gas: used=1186, max=1000000000, limit=1000000000, credit=0 INFO: Test [__test_gas_limit] status: [FAIL], code: [2] Total gas used (including testing code): [1186]

Dev: the method tested just returns an integer but the status is always FAIL.

Dev: This is the test code. I'm also not seeing a full stack dump.

Vladimir: You can check exit codes at https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes

Vladimir: Exit code 2 means "Stack underflow. Last op-code consumed more elements than there are on the stacks."

Vladimir: invoke_method just returns two things: gas used and the stack  as the called method left it.

Vladimir: You are trying to receive three: (exit_code, gas, stack)

Vladimir: just use (gas, stack)

Vladimir: I wrote an extra-simple example of how to use toncli in section 4 of https://medium.com/@vladimirtmara/developing-and-testing-a-simple-smart-contract-with-toncli-de96ad0a6f5c

Dev: ran the test in the article and I get the same exit code 2

Vladimir: Use the precompiled binaries of ton described at https://github.com/disintar/toncli/blob/master/INSTALLATION.md

Vladimir: They correspond to the TVM of SpyCheese that has more debugging instructions: https://github.com/SpyCheese/ton

Dev: Ok, that's a great reason to use the binaries.

luke: Hi everyone , does anyone konw the problem?

Vladimir: Seems that your Mac is arm64 but you are using binaries that you are trying to use OpenSSL for x86_64.

— 2023-01-18 —

luke: did I install a wrong version of openssl?

Vladimir: Not sure, I don't use Mac.

Vladimir: Your Mac is arm64 based or Intel based?

luke: arm64 based

Vladimir: Are you sure you downloaded precompiled binaries for arm64 ?

Vladimir: Of the TON tools and of openssl?

luke: TON tools are arm64 openssl was installed by brew  I will try to confirm openssl’s version

luke: do you know where is the github of fifi func’s source?

Vladimir: The fork needed by toncli is at: https://github.com/SpyCheese/ton

luke: thanks

Vladimir: 👍

Vladimir: Since the OS that I develop and where I ported TON tools is OpenBSD/adJ.   I could create a virtual machine (amd64) for qemu or VirtualBox with everything ready and configured as explained at https://medium.com/@vladimirtmara/developing-and-testing-a-simple-smart-contract-with-toncli-de96ad0a6f5c

Howard: hi, why / how TVM has an aboriginal random number implementation?  https://ton.org/docs/develop/func/stdlib/#rand

Howard: maybe TG channel can have voting module in side the channel I guess! haha (reply to 19145)

&rey: I think we have a bit of misunderstanding. jsonblob is called from frontend. I was speaking about that jsonblob can be considered external backend.  Apart from that, my page loads only two files, TonWeb and QRCode libraries 😁 I think that's quite successful. (reply to 19903)

tom: I got an error when I want to move ton from pool to the wallet.What should I do?

tom: and a new error

Behrang: I think there was a minimum balance for each pool and you can't withdraw more.

tom: Oh,I see.But I did not get any number about minimum balance in the document............

Mahdi: Hi I have a game idea to implement on ton ecosystem. I will invest up to 500$ for R&D and MVP. My goal is to start with and understand the ton ecosystem. Please PM me of you can assist.

Nasir: @Mfarimani DM me

tom: what is the meaning of error 9 of transactions?

Nati: You can check exit codes at https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes (reply to 19966)

tom: thanks

Dev: what is a typical cause of error code 2?  docs say "1 If you encounter such exception in a _func_ contract it probably means a type error in asm declarations."  what is an example of where asm error could occur and aside from asm declaration what is a typical cause?

Jun: Hi glad to join and im doing some research on TON, and can i find the core team members (including founders) of TON Foundation?

Dev: Can you tell us a bit more about the research you are doing? (reply to 19970)

Dev: Is it related to TON Development?

Daniil: ask in general chat @toncoin_chat (reply to 19970)

&rey: Old stdlibs contain bug in some of dict parsing methods, I don't remember which. (reply to 19969)

Jun: For general research, especially including technology, mechanism, and comparison to other L1s. (reply to 19971)

&rey: Example of type error in assembly. cell type_err() asm "ZERO ENDC";

Jun: Thank you, and sorry if it was inappropriate (reply to 19973)

Slava: That would be even better when we will be able to optimize TonWeb bundling :) (reply to 19958)

liminal: Hi, how can i implement lock up in jetton?

Howard: Logical Time ++? (reply to 19982)

Hotline: Hi could anybody help:last sec bid a t.me name,my ton has sent to address but not received any

Mahdi: Hi fella I'm going to recruit a developer and ask him/her to start learning FunC and create our teams first dApp on ton Blockchain.  Would you tell me please if you want to do the same which tech stacks would you put in job post as must haves of the developer and which tech stacks will be in nice to have competencies? (reply to 19974)

&rey: I think your team must consist of at least three people.  One person must know and design full architecture of your system: backends, frontend, their interaction with contracts and messages between contracts themselves. He must know TON contracts, cells and messages model and be able to predict unusual transaction chains that can be used for hacking sometimes.  The second person must know FunC enough to develop the contracts. I think he must know how to optimize contracts, especially how to create less cells onchain. Knowledge of CI tools for TON is a must. I think Fift isn't that necessary for development though it can be useful for forming static data of contract.  The third person would design frontend pages. He must know how to handle all error cases, including info providers not responding and transactions failing. He needs HTML, JS, CSS in his work and must know CI tools and version control systems as well.  (Post not generated by ChatGPT 🙂) (reply to 19986)

gnoblin: what hacking cases do you mean? thanks (reply to 19987)

&rey: For example, if there is a long transactions chain, user can initiate two of them simultaneously, and that could lead to unpredictable results in some cases. Or, if your contract reserves money by sending TON to itself, user can send two messages so at the moment of processing the second there won't be any coins on contract balance. See TON Hack Challenge 1 for more information. (reply to 19988)

Mahdi: Thanks. How much a team like this will cost? (reply to 19987)

&rey: I think that's not a development question. But my estimate is $1200-$2000 total from start up to project public launch. (reply to 19990)

Kate: Hey! Is there anyone in Portugal? Meet the first TON community meetup in Lisbon!   The program of the event and all the details are already on Eventbrite: https://www.eventbrite.com/e/intro-to-the-ton-ecosystem-crypto-web3-enthusiasts-meetup-tickets-517944194027  Please share this link personally with your folks who are interested in the TON ecosystem,   Look forward to meeting you, talents!  All exclusive information about community events in Lisbon will be in our Telegram chat: https://t.me/tonlisbonhub

&rey: Is this related to development in TON? The same question applies to Russian chat as well. (reply to 19992)

gnoblin: sure it does (reply to 19993)

gnoblin: i’d love to attend, but not in Lisbon atm

Kate: Sure!  TON Lisbon Hub is the local community of blockchain developers entering Web3, programmers and crypto enthusiasts  Join us via link: https://t.me/tonlisbonhub (reply to 19993)

Dev: Well you might consider offering on online option for people to attend virtually and I think some of us would hop in

Kate: Great idea👌 Think about its implementation (reply to 19997)

gnoblin: anyone doing ton onchain games?

&rey: Mint a NFT for everyone who wishes to participate (for example, sends their avatar). Then, create a conference with authentication via TON Connect 2.0 checking for NFT presence. If conference ever needs to be sharded, that can be done with NFT addresses 😄 So that people in one shard could communicate directly with seeing each other's video, and people from other shards would receive only one video stream — featured by shard validator moderator; cross-shard communication would be through text messages then. (reply to 19998)

gnoblin: is there any list of popular ideas for the ecosystem that users want? like voting on lens protocol forum (reply to 20000)

&rey: I don't know about "users want", but there is certainly a list what "TON Community wants": https://github.com/ton-society/ton-footsteps/issues (reply to 20001)

gnoblin: thanks! (reply to 20002)

gnoblin: is there anything like lens or near.social for ton?

User<29348742>: Hi anyone has a tutorial to put a ton site together?

Артем: Hi. Someone can help to get the price of Ton coin in USD in real time (json format)

Kon: check https://min-api.cryptocompare.com/data/pricemulti?fsyms=TONCOIN&tsyms=USD (reply to 20006)

Kon: but there some rate limit exists, if requests too frequently, than you need to cache the result... 1 per minutes is ok, 99.9% that the same result will be there

Артем: it`s update in real time? And can i use this link in my python project to get info? (reply to 20007)

Артем: I need a data update every 15 minutes. (reply to 20008)

Kon: yes, it is the free api from cryptocompare

Артем: Thank you very much ) (reply to 20011)

𝐴𝑅𝐸𝐹 𝑆𝑆: tonkeeper have testnet wallet?

Nikita: Hello Is testnet down?

Andrey: testnet.dton.io  Last known mc block -> 5sec ago (reply to 20018)

Nikita: Is toncenter testnet api down? (reply to 20019)

Kirill A.: Yes, problem is beind addressed (reply to 20020)

Kirill A.: Problem with testnet api has been resolved

tom: what is the meaning of Error, exit code 73 and Error, exit code 9 for pool action like Deposit or Withdraw?

— 2023-01-19 —

User<5140804585>: Explain this

User<29348742>: Anyone know how to create a Ton Site

Un gars bien: plz could anyone help ?

Ruslan: Hello, can you please check again? (reply to 20041)

Un gars bien: Thanks now working (reply to 20043)

Ruslan: Problem was on the backend side

Jorge: Hello Looking for tech support I have issue after node installation  Mytoncore status: working, 1 hours Local validator status: working, 24 minutes Local validator out of sync: 1674099184 s Local validator database size: 0.0 Gb, 5.0%  I have staic ip at my router but node server has static local ip, so I propaly need to forward some ports but I cant find this info

Ruslan: Hello, currently nodes doesn't support NAT. (reply to 20049)

Jorge: ok

Jorge: But If I forward all ports should it help?

Behrang: You need to deposit from the validator account:  throw_unless(73, (sender_wc == -1) & (sender_addr == validator_address));  https://github.com/ton-blockchain/nominator-pool/blob/main/func/pool.fc#L591 (reply to 20027)

&rey: Hello! Do TON Storage nodes support reverse proxy mode = only making outgoing connections? (reply to 20050)

&rey: If not, is there anyone who can write such a tool? I think it can use ADNL over WebRTC to make storage accessible from outside of NAT.

tom: If I want to stop a pool,and take Validator`s ton back,what should I do?It seems that I can not do this when the pool is active.Howerver there is no command to passive a pool.

sepezho2: Can someone send some testnet tons to my wallet?  kQAf9V4MmFbGU_BMKTxJuM4pFSM5E7B70ECi_Od0hnHMGQps  i ran out of faucet limits

Howard: anyone heard of exit code 128?       128: { message: `Null reference exception }`

Slava: @f_closer (reply to 20062)

𝔎𝔬𝔟𝔢 24 / 8: Hi , can someone help me with a concrete example on how to store and load a dictionary on local storage ?

Howard: https://t.me/testgiver_ton_bot is reliable, can claim ever hour (reply to 20062)

///+: How can I start learn Func?

Alex: You can start from here. (reply to 20079)

Max: Hey guys!

Max: @ton-community/tx-emulator has been rebranded into @ton-community/sandbox and significantly improved!  It now uses the new ton-core under the hood and is compatible with all the APIs that it provides, making the creation of smart contract wrappers easier than ever!  More importantly though, the blockchain-experimental features have been merged, so you can now emulate whole chains of transactions and even emulate interactions with existing smart contracts from real networks (both mainnet and testnet)!  Together with it we released another package, test-utils, which, along with the new features  of sandbox, significantly simplifies testing of systems of multiple smart contracts.  Check out the examples provided together with sandbox to see the intended way to use it.  Please note that this tool is still in beta, but we would love to hear any feedback from you!  Also, stay tuned for more detailed tutorials for using this tool! (forwarded from TonTech)

Howard: Wow. Is this Tact language we coded in the smart contract also can use this? (reply to 20082)

Narek: It’s language agnostic (reply to 20083)

Daniil: this library is for testing smart contracts. doesn't matter which language you use because they all are compiled to assembly language anyway (reply to 20083)

A: Hi all, quick ask - I just left Sequoia Crypto and looking to get some tips on getting into TON development myself - wondering whether any devs might be kind enough to speak for 10-15 minutes to offer some advice? Please PM

Moshe: Should add resource to TON Storage to this message. (reply to 12795)

Daniil: And also remove the tonspace link (reply to 20089)

Daniil: And add sandbox & ton-emulator to js libraries

Slava: ? (reply to 20087)

Steve: Looks fake

The Tun: Is there a road map for developers? Or platform boilerplates?

𝔎𝔬𝔟𝔢 24 / 8: // (reply to 20074)

— 2023-01-20 —

User<1766739110>: hello guys!! i need to help me about the TON Storage Provider setting on my server..

User<1766739110>: where can i find that info??

Dmitry: Hi, help please with ton^13 callGetMethod return an error "Unsupported stack item type: list" when dictionary is empty. How can I read the empty dictionary correctly?  p.s. ton^12 doesn't have this problem

talkol: We are looking for a paid moderator for answers.ton.org. The role is for about 2 hours work per day, to edit questions people ask and delete duplicates.  You don’t necessarily need to know how to answer the questions. Please DM me if interested. Compensation is attractive.

Vinayak Dubey: Hi! I am trying to set up a new validator for ton. i have installed the binaries and they are running however the node doesnt seem to be syncing. the DB size has not increased and the out of sync number is increasing  does anyone know what could be the iissue?

Vinayak Dubey: warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType' this is a warning i get when i run status command

Steve: I have checked, he is not fake 🌚 Feel free to contact the guy (reply to 20093)

Dario: have you ever considered to make a bot that forward questions posted on the website in these dev chats? (reply to 20119)

talkol: yes, Roman has a footstep for this exact thing, it's almost ready (reply to 20124)

Daniil: It's already done (reply to 20124)

Daniil: The bot just needs some fixes, the guy who made it is working on it rn

Dario: good

&rey: There should also be option to forward an answer back 🙂 (reply to 20124)

Anthony: Let's add link for the Chinese dev chat https://t.me/tondev_zh (reply to 12795)

𝔎𝔬𝔟𝔢 24 / 8: Hi , can someone help me with a concrete example on how to store and load a dictionary on local storage ?

Slava: Sorry, that chat is unofficial and we are not planning to support more languages than we already do. (reply to 20130)

Slava: It is a very common sense for developers to know English, so we are happy to accept new members here.

Vinayak Dubey: any idea guys? or can anyone point me to the resource that will help me fix this issue? (reply to 20121)

Ton Addict: Whats the minimum stake for a Ton validator?

gnoblin: 600k ton

doni: you can use the various staking pools

Behrang: Around 300,000 TON. (reply to 20155)

Behrang: With 300,000 you can participate and start earning, but in odd or even cycles, not both. With another 300,000, you can participate in both cycles.

Hello, world: guys, how to deposit to my wallet in openmask 1 TON, with testnet

gnoblin: didn’t know that, thanks (reply to 20161)

Dev: how was 300k arrived at as the optimal amount of coin investment? (reply to 20161)

Андрей: In this chat, investment issues are not discussed. (reply to 20164)

gnoblin: sure, but being a validator is pretty related to tech part imho (reply to 20165)

Андрей: From a technical point of view, the bet size of one validator depends on the bet size of other validators. If 100 validators are betting ~300k coins, then a validator with 10k coins will not be able to become a validator, since the average level of all stakes will be about 300k. The reward scheme, where the reward depends on the amount of the bet, pushes all validators to increase the bet. (reply to 20166)

Sloth ⚗️: Is there any solution to make a website on the TON network?

Andrey: https://ton.org/docs/develop/dapps/tutorials/how-to-run-ton-site (reply to 20173)

— 2023-01-21 —

Owdares: Hi is there any way to interact with ton via .net c#? or only through JS, Python, Go, Kotlin?

&rey: Are there any proposals for ADNL reverse proxies, or should I write my own?

&rey: For measurement: please mark my comment with 🔥 if you ever wanted to create a storage node (for example, for hosting own site) behind NAT. As far as I know, this is currently impossible. (reply to 20177)

gnoblin: Just do a tiny micro service on js and communicate with c# via restapi - and be happy. Or do you want to use ton api in unity3d game? Thanks (reply to 20175)

Owdares: Thanks, that's what I plan to do, but I wonder if there are other ways? (reply to 20181)

T: Hi there! I'm trying to send a transaction using js ton library, but the transaction isn't going through. Manually trying to send the boc via tonapi.io resulted in the following error. What does "failed to unpack account state" mean? / Is there some documentation available with an explanation of each error message, so I don't have to bother you guys every time? Thank you!

gnoblin: What are you sending and where to? Are you able to share the code? Thanks (reply to 20184)

T: I'm sending 0.1 TON between two V4 wallets. The source wallet has a balance of ~0.8 TON. This is on testnet. Will share the code, one sec

T: This is the gist of it. I ensure that seqno is correctly assigned and never reused. `withdrawal.amountCoins = 100_000_000`. Have been able to send many withdrawals before, only ran into this after a small refactor, but nothing really changed in the withdrawal code.

T: I can also share the boc, if that helps

T: Here is a bit more context on how withdrawals are sent out

gnoblin: Is the old version working? (reply to 20187)

T: Just tried reverting and yes, it does work. I'll look through the diff and see if I can spot anything. Still interested to know what the error implies tho

Behrang: I think that your wallet is not deployed. The wallet that you're transferring from it. Can you share the address of it?

T: Wallet is definitely deployed - I've sent many deposits and withdrawals to/from it. Address is kQBUfJ41_-cSEfF1q0vsFX9wZG2-t4zRNLYzrgb1kHftRywP (reply to 20192)

Slava: Make sure that your private key and the seqno are correct.

Slava: Also try calculating the address and compare it with the deployed one.

Behrang: Yes, it's deployed on testnet. And you are using the testnet right? not mainnet by mistake? (reply to 20193)

T: I can't find any obvious changes which could've affected sending of withdrawals. The only changes were 1) the `sendWithdrawal()` function was moved into a separate class (it's identical as before), and 2) initialization code in `onApplicationBootstrap()` was moved into the new class as well, only the last line was changed (`this.onBootstrapListeners.forEach((v) => v());` - previously was `this.runCronJobs = true;`).  Code in the screenshots is the only code which could have affected this. The withdrawal database record was created by the broken code, so was the seqno. After reverting to the working code, the same database record was sent out successfully - same seqno and all. Private key is also the same - initialization code stayed the same (only moved to a new class) and so did the mnemonic in the config.  I'm also 100% using testnet - that's configured in the .env file which didn't change during the refactor.

T: Calculate it how? With the library? The address I shared was the result of walletContract.address.toString({ testOnly: true, urlSafe: true }); (reply to 20195)

gnoblin: It’s redo fixes again from scratch (based on previous working version) :)) (reply to 20197)

T: Same code in the working version 🤔

T: Yeah, I guess so. What about the error message tho? What does it imply? That might help me look for the issue in the right place (reply to 20202)

Slava: Yes, with the library. Using the same private key. (reply to 20200)

Slava: Try reverting the changes and apply them again bit by bit checking the results. The "binary search" strategy is a good one for such things. (reply to 20199)

Howard: Happy Luna New Yeaar

Howard: LFG for TON network

Howard: data source from https://dton.io/

Mr.Joe: Hy

Mr.Joe: How can l speak with dev?

Howard: here, sort of (reply to 20213)

Vadim: Hello everyone. Please help! Is there a detailed guide on how to create subdomains? What is the difference between an auto and manual smart contract?

Vadim: For example, I would like to give a subdomain profile.example for a wallet, site.example for a web page, and gift.example to give to a friend. How can this work?

— 2023-01-22 —

Mr. Milchik: What's up buddies ☺️  We're on a mission to create the ultimate hacker haven - a community of builders who dominate online hackathons and game dev jams as a team.   If you want you to be a part of our crew, building and creating with us.   Let's make some magic happen! DM 💎

Howard: what do you mean "Auto" / "Manually" here (reply to 20215)

Howard: Hey, what should I do to catch the Action Failed Txs, since I set a bounce for True, but it didn't turning TON back lmao

Howard: Action failed is as cool as you don't know what kind of shit just happened on your smart contract (reply to 18190)

Tim: for that exit codes exist

Howard: oh, you reminded me that using https://testnet.ton.cx/  Oh yeh, seems it is some bugs there. Thanks (reply to 20224)

Tim: dton actually shows you every asm step in that tx

𝓢𝓪𝓶𝓾𝓮𝓵: Thank you! (reply to 19777)

Alex: Does anybody know recently updated open-source projects that used the last version of ton library? I’m trying to find examples of handling data(writing/reading cells).

Nikita: Building cell is the same, ‘beingCell’ function just moved to ‘ton-core’ package (reply to 20231)

Nikita: https://github.com/ton-community/ton-core

Alex: I understand, that it works in same way, problem is, that I didn't use it early(like the whole TS), and just want to learn how it works, including buffer casting. (reply to 20233)

Nikita: If someone know how to build and read a dictionary with onchain data for jettons, I will match appreciated

Steve: It is re-exported in ton (reply to 20233)

Nikita: It’s copy structure from FunC  ‘beingCell().storeBuffer(Buffer.fom(“hello”, “utf8”)).endCell()’ (reply to 20235)

Nikita: ‘stack.loadBuffer(length)’

Alex: Well, this is the reason, why I'm trying to find out how ton works now. But from the begining it implemented with old ton library version here. (reply to 20236)

kirito: why bot dont give me key?

kirito: oh i need a username

Howard: how to install @ton-community/test-utils properly? Can't see in here (reply to 20082)

Max: yarn add @ton-community/test-utils -D or npm i --save-dev @ton-community/test-utils

Howard: I need more SandBox example!! I am learning. 🔥🔥🔥

Max: there should be a tutorial on it coming soon ish

User<5636807958>: Max

Dev: Is the requirement for sandbox NodeJS 16+ or must it be NodeJS 16?

Dev: Documentation says: Requires node 16. But wanted to confirm Node 18 is ok or not?

Tim: Should be OK, but not 100% (reply to 20261)

Max: Yes it's supposed to be 16+, I'll clarify it

&rey: Does anyone have ADNL implementation on Python? Or could someone say why my implementation https://gist.github.com/ProgramCrafter/c4849c8a19e92c15e273decbbbb4ffb1 fails to connect to lite server? It returns no data and it seems that server closes connection. The same server responds to toncli normally.

𝔎𝔬𝔟𝔢 24 / 8: Hi , can someone help me with a concrete example on how to store and load a dictionary on local storage ?

Un gars bien: Testnet down again ? (reply to 20043)

Ruslan: Nope, it works for me (reply to 20270)

Un gars bien: getting that error again

Un gars bien: Testnet working. seems to be an issue with lite-client. How could I fix it ?

Un gars bien: nvm. tried and worked rn. Is there a way to increase default timeout for lite-client when using toncli ?

— 2023-01-23 —

kalloc: Hi.   Is there anybody who can help me find a problem with ton-emulator?  I got an issue with ton-emulator.   I wrote two tests, for sandbox and for ton-emulator, that test the same code. Sandbox test works well, but ton-emulator test can’t update contract data (c4) during testing.  Showcase: https://github.com/kalloc/ton-emulator-test/

elephan: https://t.me/ton_overview/35

Hartmann D.: @Reivald speak English please

User<1548450460>: Hello, please send me the data, I will add it to the monitoring service  0. DEX API tegro.finance 1. TON RPC node URL 2. TON RPC documentation URL 3. Block explorer URL 4. Dapp smart contract example on the block explorer 5. Dapp transaction example on the block explorer 6. Documentation

Y: Hello Ton Keeper wallet can be exchanged with which wallets

Amir: Hi all, Is there any https://thegraph.com or https://chain.link equivalent that supports TON network?

Anthony: Check https://tonapi.io/ (reply to 20282)

Amir: This is static API for Ton network data, I mean something like Thegraph that developers can register their smart contract and provide their data to the public with graphql. (reply to 20283)

Andrey: https://dton.io/graphql we provide low-level API for blocks, transactions and smart-contracts. We parse most of top smart contracts in network, but currently you can’t register own one 🙁 (reply to 20284)

Howard: Dton is good. (reply to 20285)

Юрий: dear developers, who are in Dubai, DM me pls

Trance: How can I send NFT from highload wallet to another address?

Ran: Hey everyone 👋   We (Orbs and Mint Labs) are hosting a 2 days in person TON workshop in Tel Aviv on 19 -20 February as part of  Hack-a-TONx DoraHacks

Ran: https://www.eventbrite.com/e/first-ever-ton-telegram-hackathon-tlv-tickets-515959156727  This is a great opportunity for developer who are not already familiar with TON to learn the basics of TON and Func and perhaps even build something cool and earn rewards. Space, food, drinks, vibes, and mentors are on us 🍻  If you are in the area please join us!  DMs are open if anyone has questions or want to get in touch

R: Hey How can I send the token to multiple addresses? Does anyone know a method?

Alireza: Hi there,  Regarding the periodic maintenance and database grooming of validator node, the document says:  "... the validator process must be stopped before performing the steps ..."  As I've understood, if we stop the process, the validator cannot perform its job and could be punished due to this disruption. So, I think we need to:  1- pull the server out of the active validatores (need to wait hours for getting deactivated). 2- do the operation. 3- attend in the next ellection for the next validation round (again need to wait hours for getting activated).  This way, the maintenance job takes several hours to be finished, and the server will miss a validation round completely, which is not good at all.  Is there any better solution?

Y: Hello, can you give information about tenepi in the group, thank you I wanted to see how it works??

Slava: Maybe it could be possible to deploy a second server and then switch to it? (reply to 20296)

&rey: It's better not to do that quickly otherwise a fork could be created, which is very bad and (probably) heavily fined. (reply to 20298)

Kloy: This is the message I’m getting when I use mytonctrl. What does it mean and how can I fix it? It was fine earlier.   Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 6, in <module>     from mytoncore import *   File "/usr/src/mytonctrl/mytoncore.py", line 4, in <module>     from fastcrc import crc16 ModuleNotFoundError: No module named 'fastcrc'

F: In the new mytonctrl update, the PR was accepted to use a different hash calculation module. To resolve this error, you need to install the missing module: sudo pip3 install fastcrc (reply to 20300)

Kloy: Awesome. Worked. Thank you! (reply to 20301)

User<5727115339>: Guys how do you think about Dex Audit

doni: we should start with open source  then audits  right?

Howard: @awesome_doge we are hosting in Taipei as well right? (reply to 20292)

User<911434623>: Good evening, can you advise a newcomer, I have studied the information about creating nft on Ton, but did not get an answer whether it is possible to burn nft on this blockchain ? Or is there an archive of zero addresses, to carry out the burning of their nft?

— 2023-01-24 —

𝔎𝔬𝔟𝔢 24 / 8: Heyy, can someone help me in the creation of a new dictionary local storage ?

𝔎𝔬𝔟𝔢 24 / 8: I wish to create write_dict which will have as value filehash of id_writer, timestamp and id_owner(creation of a patient's record ) , type : slice

𝔎𝔬𝔟𝔢 24 / 8: ()recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body){  int op = in_msg_body~load_uint(32); int query_id = in_msg_body~load_uint(64);     cell data = get_data();   slice ds = data.begin_parse();   cell dic = ds.slice_bits() == 0 ? new_dict() : data;    int slice_hash = slice s;    cell write_dict = new_dict(slice_hash, id-writer timestamp id-owner);   if (op == 1)  {  ;; add new entry   int key = in_msg_body~load_uint(256);   dic~udict_set(256, key, in_msg_body);   set_data(dic);   return (); } }

𝔎𝔬𝔟𝔢 24 / 8: When I deploy this , they indicate that there should be something between  slice s and ; at « int slice_hash = slice s; »

Behrang: What is int slice_hash = slice s; It looks like you are assigning a variable type declaration to another variable type declaration. (reply to 20342)

𝔎𝔬𝔟𝔢 24 / 8: Well, normally the syntax of slicehash is « int slice_hash(slice s) asm "HASHSU"; »

𝔎𝔬𝔟𝔢 24 / 8: But I had errors when inserting it

Un gars bien: int slice_hash = slice s;   slice_hash is a function that takes a slice as input and returns an int, but here you defined it as a variable 🤔 (reply to 20342)

𝔎𝔬𝔟𝔢 24 / 8: Yes, Vs code shows errors when inserting the syntax

Howard: is there has Sanbox group for dev?

鷹🦅之沙漠: https://ton.org/docs/develop/dapps/tutorials/accept-payments-in-a-telegram-bot

鷹🦅之沙漠: Is there erro？

鷹🦅之沙漠: should be transaction_id

Slava: Hash of the incoming message can be used to identify the transaction.

elephan: Hello everyone. When I build my development environment on my ubuntu server(20.04), fift is not working.

elephan: Please anyone help me.

elephan: https://ton.org/docs/develop/smart-contracts/environment/installation

elephan: I just followed this guide.

elephan: func -V lite-client -V

elephan: These are working, but only fift -V is not working.

elephan: Please help me.

Dev: If you don't see anything it means that binary fift is not on your PATH (reply to 20365)

Dev: what operating system are you on? (reply to 20365)

elephan: Ubuntu 18.04

elephan: Really. I already set PATH. (reply to 20366)

Eugene: I am not sure I can help, but I suggest you provide more context for those who can:  1. Did you download ready TON binaries or compile from the source? The guide mentions both ways. (reply to 20358)

Eugene: 2. Can you show us the output of these commands? which func which fift (reply to 20358)

Dev: So need to set FIFTPATH too

elephan: Okay.

elephan: I will try again.

Alex: You can try this nice docker https://hub.docker.com/r/trinketer22/func_docker/ if it will work - you can just use it or extract all needed binaries from image  also check pls here: https://github.com/ton-defi-org/ton-binaries (reply to 20365)

Vali | QS: Can you check if FIFTPATH variable is accessible to your local shell, and if you gave execution permission to fift ?

elephan: yes.

Enzifiri.rc🎖: Hi guys

Dev: How can I calculate the fees for TON Storage vs. IPFS?

Max: FYI there's a JS+WASM based CLI for func that need not be compiled, and you only need node (probably v16+) to run it Just run npx func-js (reply to 20376)

Max: If it doesn't work then run npm install -g @ton-community/func-js

Rinat | ZilPay (Will not Call or DM you): hello everyone, i don't understand where is web3 for keeper wallet and why this wallet web3 if all requests through centralized server bridge.tonapi.io????

Daniil: Ipfs is free (reply to 20380)

Daniil: Ton storage too

Daniil: But there can be some paid services made by community

Dev: Ok do those paid services need to be behind or integrated through TON Networking?

Rinat | ZilPay (Will not Call or DM you): wtf bridge.tonapi.io use cloudflare, what if cloudflare is down?

&rey: Then you are able to send the BOC with signed transaction through some other means — for example, via toncli. (reply to 20388)

Rinat | ZilPay (Will not Call or DM you): yes this is funny, keeper use 2 centralized servers 😂😂😂

Daniil: Metamask also sends the transactions to some centralized server (reply to 20390)

Rinat | ZilPay (Will not Call or DM you): sure i can, but why they force web3? If they made is not web3 wallet..... (reply to 20389)

Andrew: I suggest you to read this message from one of the tonkeeper team members (you might have to use translator) (reply to 20383)

Rinat | ZilPay (Will not Call or DM you): true, metamask send to infura but you can change it any time (reply to 20391)

Rinat | ZilPay (Will not Call or DM you): i am Russian, they text about they is not fully web3 but they web3 in the marketing 😂😂😂😂 (reply to 20393)

Rinat | ZilPay (Will not Call or DM you): thanks for this message (reply to 20393)

Dev: ok, so if I want to a service that uses ton storage would it be over adnl ? (reply to 20386)

Dev: Do I need to run a proxy on the server that hosts the service that will accept connections with TON protocols (ADNL/RLDP) and forward them as HTTP?

Dev: What are some of the technical challenges with a DAO on TON right now?

Big hammer: When will the storage of ton go online?

Gc: Hi, i need to build a Docker Image of a validator of TON, so I used this dockerfile https://github.com/ton-blockchain/ton/tree/master/docker   and I am getting this error, any ideas ? By the way, I am trying to build the image using this command  docker build -t ton .

S0co | DM+ME = Block&Report: Hello how to run a ton storage provider to earn tons?

User<5693104230>: Can I start to build from vscode.dev? Because I don't have computer or laptop, can I just starting from web browser at my phone? I'm very stuck to do until my phone can do anything. I just can get job from online, very rare people geive job offline, so its look like I'm very depending to provider of my internet and electricity but I cannot afford money more that 3$ in last 3 days. I think it's very serious If I don't make any change I will be very suffered

Shawn: Hey everyone 👋  Orbs is hosting the Tel Aviv in person workshop on February 19 - 20  as part of the Hack-a-TON -

Shawn: https://www.eventbrite.com/e/first-ever-ton-telegram-hackathon-tlv-tickets-515959156727  This is a great opportunity for developers who are not already familiar with TON to learn the basics of the open network, Func, and perhaps even build something cool and earn rewards.   Space, food, drinks, vibes, and mentors are on us 🍻  If you are in the area please join us!  DMs are open if anyone has questions or want to get in touch

User<1237546490>: GM friends and colleagues!  We have launched API https://api.tegro.finance to interact with DEX  Information on added pairs (listed), token rates (price of coins), trading volume in pairs with TON  You can now fully integrate with tegro.fi into your services and bots.  Regards Brand

A: Hey guys. For an upcoming project I keep bombarding testnet faucet bot with requests as I need a little bit more than. If you have some spare ton on testnet, I would appreciate donation. Thanks. kQDN45JZcgfNZWDdFrzRuwG95Giva5jTKLhHybqCr-a5O1IK

Slava: @f_closer (reply to 20414)

— 2023-01-25 —

User<5218667963>: Hello, happy to be-uild here. Greetings from Cambodia  🇰🇭 ☀️🌴

A: ?? (reply to 20415)

Vinayak Dubey: hi i am setting up a validator and i had a query like right now the funds wallet is generated and stored in the node itself is there any way to decouple the funds wallet from the validator?

Behrang: If you are worried about security of your validator wallet:  1- You can limit it to 10,000 TON, create a nominator pool, and use another wallet to send your funds in the pool. This way, your risk is limited to 10,000.  2- Yesterday I found a very interesting wallet, which allows funds to only be sent to a predesignated address. This I think will help you secure that 10,000 too. I haven't tested it myself, but you can find it here: https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc (reply to 20422)

Vinayak Dubey: awesome thanks

Александр: Hello, is there an existing contract for automatic deviding inputs to other wallets by certain rules (for example equally)? It seams simple and would useful when team work in certain project that gets TON inputs. If not, I would be happy to participate in creating such contract with pretty UI (team members should not communicate with smart contracts API - it should be done via certain JS application in browser)

Eddy: Hello, I joined this channel to know the label, 'FCP'. What are the full words of FCP on TEP?

User<5693104230>: Could you help me bro? I really need support from others (reply to 20425)

Александр: Your question is not clear. Developing something from phone is unrealistic IMHO. But history knows different examples. I am also not making money from TON yet, so can't advice anything. (reply to 20428)

鷹🦅之沙漠: Brothers, who has information or cases of NFT development?

Alex: Here you can find some links to general information. (reply to 20430)

鷹🦅之沙漠: thanks (reply to 20431)

鷹🦅之沙漠: 🫡

鷹🦅之沙漠: The person who helps others is the most handsome😜

Hermès: any TG Web Bot example lilke?

Andrew: @wallet (reply to 20437)

Hermès: I mean example code haha

Slava: Check the grammY framework. (reply to 20439)

211 Capital: Why is someone or something trying to destroy my asset? Who are sending my minted domain to the zero address *AAM9c? Can share more details if needed.

Daniil: ? (reply to 20441)

211 Capital: I own an asset - domain name (minted already). Saw suspicious operations in my transaction history. I did not do them. One example of a transaction:  https://tonapi.io/transaction/652feb4b65afc19629d9813543a2d0c2628876be45b8577f8748081451cd0994  Is my domain name trying to self-destruct?  This always happens during listing on a Fragment. But sometimes spontaneously. Bug? (reply to 20442)

Howard: https://github.com/ton-defi-org/tonstarter-twa  Here is one part (reply to 20439)

User<5693104230>: How about to talk web3 first? If TON supported to web3 it will be very interesting (reply to 20429)

User<5693104230>: I'm not yet thinking about security issues, thank you my friend to remind me about unrealistic side of building TON at smartphone (reply to 20429)

Daniil: I don't see these null-address transactions on tonscan or toncx (reply to 20443)

211 Capital: Yes, an outgoing transaction (that is not made by me) always fails. But why does this even happen? This has happened several times over the past 2 months. (reply to 20447)

Daniil: I've just compared the history in tonapi explorer and other ones. Looks like tonapi shows external messages as messages from null address...

Daniil: Basically, someone sent several external messages to the contract of your username. It's okay, nothing bad can happen. (reply to 20448)

211 Capital: Can a minted asset be revoked or taken away in some way? (reply to 20449)

Daniil: Maybe it's a little bug in Fragment, maybe someone is just having fun. Maybe it's necessary for something. (reply to 20450)

Daniil: NFT - no (reply to 20451)

211 Capital: It's not funny that someone is experimenting with your NFT. Moreover, I observe digital hygiene and exclude mistakes on my part. :) (reply to 20452)

Daniil: Even if these are "experiments" - nothing bad can happen. (reply to 20454)

Anil: Hit the second case

Max: Tonapi just shows external messages in a weird way (reply to 20452)

Daniil: I've mentioned it above (reply to 20457)

Daniil: ^ (reply to 20449)

Max: Oh oops (reply to 20459)

Mike: hey guys, how can I calculate current minimum validadation stake to became a validator?

User<817743285>: Hello! Could you please tell me if these contracts will implement this model: 1. The user sends TON to the address of the contract 2. The contract changes its state 3. The contract sends a jetton according to the rate of 1 TON = 10000 jetton  If yes, how do I test the exchange? If no, what is wrong? What should I add/change? I would be VERY grateful for help.  https://github.com/corruptzero-dev/jetton

User<817743285>: I don't know if I can do that, but if anyone can help make it work (if it does not already), I'll thank you in TON (reply to 20464)

Max: You can use testing tools such as github.com/ton-community/sandbox and test-utils

Steve: yeah famous rip-off of ton-emulator🤡

Max: With famous rip-off of tx-emulator code🤡

Steve: nope, i have been using nick's code,  not yours

Max: I don't know what is copying + renaming variables if not using someone else's code

&rey: Could you check your domain contract on my explorer, https://ratingers.pythonanywhere.com/tx-explorer? It shows other message opcodes. (reply to 20443)

Steve: what? i haven't seen your code at all when i have been writing (reply to 20470)

Steve: i have refined a tonkite's package: https://github.com/tonkite/tonkite/tree/main/packages/vm

Max: Sure, must be the reason why your executor's structure is exactly the same as was the tx-emulator's  Don't see the point of this argument, not going to be responding to your provocations anymore, thanks

Steve: no, there are no common code in tx-emulator like at all

Steve: yeah, just copying new library and rebranding it everywhere - very friendly

Diako: Do you have any example of getting connected to my ton wallet " chrome extension " ?

211 Capital: Let's try to rephrase the question. The point is not that some transaction is shows weird messages. The essence of the problem and the question is that the transaction is spontaneously committed (!) without my participation. And it is visible in other tone explorers (reply to 20457)

211 Capital: https://tonscan.org/tx/ZS_rS2WvwZYp2YE1Q6LQwmKIdr5FuFd_h0gIFFHNCZQ=  who did this? ^_^ has no idea (reply to 20457)

&rey: I think that message was sent by Fragment to end the auction. (reply to 20480)

Язон: Can somebody explane about NFT contracts? I know there is a standart NFT contracts for TON. I saw NFTs, that you can open after some time and get random item. Is this mechanic included in standart contracts or it's implemented by NFT creators? I'd like to read about it if there is info

Daniil: I've already explained. Those are external messages that can be sent by anybody (usually Fragment does that) (reply to 20479)

&rey: It's implemented by NFT creators and I think that's mostly done offchain — you send request to their site and they update the metadata. (reply to 20483)

Lisboa: Greetings, I met the project yesterday.  Doubt, is STORAGE already active?

Daniil: Yes it is (reply to 20486)

Lisboa: How do you access? Is there anything in particular I would need to know? (reply to 20487)

Lisboa: This project is awesome!!!

Daniil: There are no user friendly tools and marketplaces for Ton storage yet (reply to 20488)

Lisboa: Putz! (reply to 20490)

Lisboa: Can we already use it?

Daniil: Yes (reply to 20492)

Lisboa: Could you help me with this? I looked for the site or something talking about it but I only see the news, I'm from Brazil. (reply to 20493)

Slava: Hey! Check this out: https://t.me/toncoin/707 (reply to 20494)

TON Answers Bot (not AI): This is a test question from Slava Yakimenko  How to do ....?  🔗 Answer on TON Overflow

Slava: This is a new bot that forwards questions from answers.ton.org . The bot is under development, if there are suggestions or bug reports, write to me soon. Help in any way you can)

Nati: Great stuff 💎 (reply to 20497)

&rey: Suggestion: let answers be forwarded back to answers.ton.org. (reply to 20497)

Dario: +  Also would be better if not all answers will be forwarded, only stuff that start with smt like  /ans ....stuff... (reply to 20499)

Slava: A good idea.  You need to make a working account of the bot, which, on command in the chat, will send the answer to the site.  Looks good, it can be implemented

Slava: If there is something important, please send me a private message

talkol: This is very difficult to do.. some of the answers span multiple chats. Won’t it create low quality content there? (reply to 20501)

talkol: How difficult is it to open TON Overflow as a TWA here inside TG so people can answer inside the website but still stay in the context of the chat

talkol: Maybe we also do auto login with your TG credentials so it’s a seamless experience

Slava: I don't know, it looks like an overkill IMO. I think it's OK to mark questions for manual review and then moderated import to the QA website, but answers should be posted on the website directly.

Slava: TWA UX is terrible right now, it has a lot of bugs and I think it would be very bad experience for any serious editorial work. For example the input cursor is not getting rendered in TWA for me, also the mouse scrolling doesn't work :)

Slava: So it would be great pain to edit any serious answers with code through TWA.

Slava: And the TWA window is also too small for this.

&rey: A possible solution is to add TON Connect auth to answers.ton.org.

Daniil: There was a Footstep for that iirc  I just remembered how someone proposed it in a chat, but didn't post in footsteps repo. (reply to 20615)

Slava: Yes, that's a great idea. We've also thought about creating an incentive for answer writers so they can receive bounties in TON coins. (reply to 20615)

&rey: Then it will be like overton.netlify.app) I remember its announcement... but somehow the project went dead. (reply to 20619)

Slava: Yeah, the idea seems cool. (reply to 20620)

Slava: If you have found a bug just post it here in a single message or create an issue on GitHub. If this is a security issue, please PM me instead and don't publish it anywhere. Otherwise please abstain from flooding in the chat. Thank you.

Slava: By the way, they suggested changing the bot's avatar to something generated by a neuronet.  If you are interested, you can send me, I will change

Behrang: I think the bot is good enough for now. Let it be like this for a few weeks. If there were lots of questions, then try to improve it. Opening the link and responding may not be that hard. Currently I think the problem is that people aren't asking questions there.

A: Got tons of tons! Thanks! (reply to 20415)

Slava: @Nephyrium I would ask you to stop flooding in the chat and on Q/A portal. You've been given all the instructions on how to report bugs already.

任超 肖: Ok 🥺 (reply to 20652)

— 2023-01-26 —

Hermès: anyone know what is Error: Unable to execute get method. Got exit_code: 11  since I am building a sqrt get function on SmartContract?

Tim: are you sure you're not out of gas?

Hermès: get Fun in Tact seems didn't cost gas?

Hermès: Or wait, the contract should hold initial balance to activate right

Hermès: Let me try out

Tim: Contract should have deployed code, right

Hermès: First get Function - YES Second one - No (reply to 20661)

Tim: are you running in local tvm? If not - you should and check logs

Hermès: I have some ideas, let me test it out!

Hermès: OK, this is a successful implement for sqrt in Tact. ❤️ (reply to 20663)

Hermès: can change delta value for the accuracy you need

Hermès: 👍🏾👍🏾👍🏾 (reply to 19996)

User<5847386827>: Guys how can I get sender address in recv_internal function?

Alex: Hi everyone, A new version of ton4j has just been released - 0.0.8. - Added multisig contract support; - updated internal tonlib binaries to 2022.12 state; - various improvements and bug fixing.

Howard: on-chain Txs!

Anthony: in TON? (reply to 20675)

Howard: Yes! Source: dton.io

User<5847386827>: ❓ (reply to 20672)

Alexey: Here is an example: https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/nft/nft-collection.fc#L80 (reply to 20681)

Tomer: Hi all, I'm looking for a FunC developer if anyone has somebody in mind, please DM me, thanks!

User<5339502733>: Tomee DM me

User<5339502733>: Im React, Javascript and Typescript ✌️

Anton: Hi, do you know if Ton supports Bip 44 or 39 Hd wallet ?

talkol: As far as I know TON has its own word list and its own special derivation scheme so it’s not compatible with Bip44/39  I agree that this isn’t desirable.. maybe somebody built a tool to take a bip44/39 mnemonic and create a ton key pair from it, it shouldn’t be hard.. but this mnemonic will not be supported on the native ton wallets of course

Vali | QS: Hey! Can you please tell me what does the operator intX ^= intY in FunC?

Anton: I found this doc  https://github.com/toncenter/tonweb-mnemonic (reply to 20688)

doni: https://www.npmjs.com/package/ton-crypto (reply to 20690)

Slava: They are not directly compatible, but you can generate a seed phrase that would work for both networks. I've successfully done this in the past. (reply to 20688)

User<967403852>: Wordlists are the same, TON algorithm doesn't calculate the checksum, that bip39 requires, so any bip39 generated mnemonic phrase is compatable with TON (reply to 20688)

Dxo: Why ton place

Slava: That's not exactly right. TON has it's own requirements for the generated seed. (reply to 20694)

Slava: You can see it here: https://github.com/toncenter/tonweb-mnemonic/blob/master/src/functions/generate-mnemonic.ts#L25-L31 (reply to 20696)

Anton: Thank you guys for replying (reply to 20697)

Karn: Hello Everyone!!  We are looking for developer assistance for a GameFi project. Please connect  if you are interested in  working on something really   interesting .Thanks

Shawn: Hey all just bumping this for those that hasn't seen it 😊  Please reach out with any questions/to learn more (reply to 20411)

ᴄʀʏᴘᴛ🔅ᴍᴇɴ: Hello. Can you please tell me if there is a token browser and mass sending to addresses?

— 2023-01-27 —

Howard: One feedback here for https://answers.ton.org/ is that whether we can  paste the image in there? Right now, you have to upload image somewhere, and paste the URL.   Rather than like Notion, Medium able to paste with command + V .   Stackflow using Imgur.

해성: Are there any Korean developers?

Nikita: This guys - https://ozys.io/ (reply to 20708)

해성: thx, but i want to contact personal developer not a org (reply to 20711)

Gc: Hi, I hope someone can help me i am trying to run a full validator using the default configuration and i am getting this error  any ideas??   [ 2][t 6][2023-01-27 05:32:22.395662286][manager-init.cpp:86][!downloadproofreq] failed to download proof link: [Error : 651 : no nodes] [ 2][t 5][2023-01-27 05:32:23.396615085][manager-init.cpp:86][!downloadproofreq] failed to download proof link: [Error : 651 : no nodes]

Justin: Hi! 11-12 Feb there will be a developer in person meetup/mentoring going on in Seoul. (reply to 20713)

Vinayak Dubey: Hi I had a question is there any way to configure monitoring for a ton validator? any way to obtain prometheus metrics? some other way to get alerts maybe

해성: thanks! (reply to 20716)

Justin: please join @hackatonx and we will create dedicated "topics" for each of the city where the meetup will happen (reply to 20725)

Queen 🥚: hi

Queen 🥚: who can i check with to know which NFT standard getgems and other marketplaces accepts? on the TEPs it shows for the collection like so:  {    "image": "https://ton.org/_next/static/media/smart-challenge1.7210ca54.png",    "name": "TON Smart Challenge #2",    "description": "TON Smart Challenge #2 Winners Trophy",    "social_links": [] }  but i cant be sure because in other places its different

Jaimin: Is anyone working on a TON stablecoin?

Dipanshu ( Normie.Tech ): Hey everyone... New to TON here ... coming from solana and Ethereum background.. i wanted to ask ,Like in solidity, a DDOS type attack is prevented because it would be expensive to do one by the hacker ...how does ton try to prevent that here ?

Nati: DDOS what?  Sending a lot of transactions to the blockchain?  TON blockchain is designed for the masses thus can handle millions of transactions per second. (reply to 20731)

Dipanshu ( Normie.Tech ): DDOS in the sense that if a smart contracts has a state change function then i would just spam it ... without actually meaningful data (reply to 20732)

Max: like in EVM chains someone has to pay for any state change so you cant spam forever

User<433042950>: Hello

Madalin: Hey 🙂

ᴄʀʏᴘᴛ🔅ᴍᴇɴ: Can you please tell me the service for sending tokens according to the list of addresses?

elephan: Hello everyone. Could anyone tell me ton there is ton testnet dex or not?

elephan: Now, I only know mainnet dex.

Hello, world: i am love you, developers!

/dev/arandom: Who knows the required disk space for a TON network ?

/dev/arandom: Does it sync well from zero, or are there snapshots?

doni: checkout the spec in mytonctrl (reply to 20744)

/dev/arandom: Nice.

/dev/arandom: It says 8TB

/dev/arandom: I wondered if that is up to date

/dev/arandom: That's quite a large requirement in disk space.

/dev/arandom: Is there no pruning ?

/dev/arandom: Thats some serious storage cost on aws

Dipanshu ( Normie.Tech ): Who pays that in ton? (reply to 20734)

Max: usually users, but dapp devs can choose to sponsor their users

/dev/arandom: Any idea on how long it takes to sync a Ton node on AWS ?

doni: 12h to 24h

/dev/arandom: Nice. I am starting to test the nodes because I am going to list on exchange.

/dev/arandom: But I need to test monitoring blocks and making withdraws.

Tim: don't forget to start from dump (reply to 20755)

/dev/arandom: where are the data dumps ?

Tim: https://dump.ton.org/

Tim: https://github.com/akifoq/highload-wallet  Also look at highload wallet, it's better suited for server use (reply to 20758)

/dev/arandom: thanks mate.

Y: Hello Can anyone give me general information about the tone app? I am new to the tone app

Y: There is no one to help

Feliciss: Hi. May I ask:  1. why it shows I have NO peers after running ‘storage-daemon’?  “”” BagID Download speed: 0B/s Upload speed: 0B/s Peers: 0 ADNL id  Address  Download  Upload  Ready “””  2. Why is there always a message ‘{"statusCode":200,"message":"Torrent added, please refresh the page to download the file"}’ when accessing gateway hash files from browser or curl at the first time?

Feliciss: I applied for testnet-global.config.json

User<5445351555>: how to buy crypto without verify  with usa cards?

— 2023-01-28 —

TON Answers Bot (not AI): Follow the Docs for `send_raw_message`. from Howard  Follow the docs there:https://ton.org/docs/develop/func/overview  back by the code: () send_money(slice address, int amount) impure inline {     var msg = begin_cell()         .store_uint(0x10, 6) ;; nobounce         .store_slice(address)         .store_grams(amount)         .end_cell();      send_raw_message(msg, 64); }    - What is the meaning for 64 here for send_raw_message? - And what is more expand and the usage for .store_uint(0x10, 6)? Is there more than just nobounce? Then what is the number for it.  🔗 Answer on TON Overflow

Howard: 🤨 (reply to 18346)

Behrang: Learn about the details here: https://ton.org/docs/develop/smart-contracts/messages (reply to 20774)

Howard: "A fast, secure, and portable light client for Ethereum" https://github.com/a16z/helios   is there any related project that for TON?

Andrew: I think these links might be helpful:  https://github.com/andreypfau/ton-kotlin/tree/main/ton-kotlin-liteclient https://github.com/tonkite/tonkite/tree/main/packages/lite-api https://github.com/ton-blockchain/ton/tree/master/lite-client https://www.npmjs.com/package/@ton-diamonds/ton-lite-client (reply to 20777)

Duckie: What’s the current APY for validators?

Evgeny: hello. how can i see the full block ? what transactions have taken place. I found it in explorer, but it feels like there is a small part of the transactions ? or is it correct https://tonwhales.com/ru/explorer/block/26907256 ?

Nati: You can see live transactions in dton.io (reply to 20780)

Howard: I remember there has a way to put Cell data decoded, right?

Y: What should we do? (reply to 20783)

Howard: I mean how to decoded it?   Because since I can't read the content I store in my contract, but ton.cx can read it successfully. 😓 (reply to 20782)

User: If i am not mistaken, you can decode it through base64 (reply to 20786)

doni: checkout minter source code

doni: https://github.com/ton-blockchain/minter

doni: function name readjettonMetaData

doni: https://github.com/ton-blockchain/minter/blob/main/src/lib/jetton-minter.ts

Freeze: Hi

Daniil: ask in @toncoin_chat (reply to 20794)

Freeze: Okay

gnoblin: hi! is there any way to read jetton price from dedust pool from the contract?

gnoblin: has anyone done any dex related contracts already? 🙂

Siarhei: Friends, which chatbot (for TG) constructor would you recommend?  unisender.com - ok?

User<5727115339>: automatic answer or you can answer anonym via bot? (reply to 20801)

User<5727115339>: not yet😂 (reply to 20800)

User<5727115339>: https://dorahacks.io/hackathon/hack-a-tonx/detail  $250.00 Prize Pool

Siarhei: I need an interface with buttons, the ability to receive photos from the user and the ability to provide access to Google maps. There is no need to do text input. (reply to 20802)

Егор: How to buy tone coin ?

gnoblin: @wallet

Егор: I need a bot or link,where i will buy this coin

Егор: Ty

User<817743285>: $250? (reply to 20804)

gnoblin: К (reply to 20812)

Dappman: Former Eth dev here looking for a quick start on TON dev that will get me up to speed on what I need to know to create an NFT store.  Can someone drop a link?  Also, does the TON blockchain have native support for NFT/asset ownership, so I can do everything I need purely from a client side browser dApp, or will I need to create a smart contract to handle that?   Finally, what is the equivalent of Metamask for TON, a Chrome extension wallet that I can pop up to allow the user to make payments?  Is there a favorite NPM module for interacting with it, either server or client side?

Dappman: One more Q.  TestNet faucet link?

Eugene: @testgiver_ton_bot (reply to 20815)

Dappman: thx.  Best wallet to use for app dev?  Chrome extension? (reply to 20816)

talkol: Hey everybody!  DoraHacks is starting on Monday and we worked hard to create a new set of onboarding tutorials for new TON developers!  https://ton-community.github.io/tutorials  We will appreciate if you can experiment with the tutorials on Sunday and report issues on anything you see isn’t clear or not working.

Dappman: That's what I needed.  Thanks.👍 (reply to 20818)

elephan: Excellent.

gnoblin: is there any wishlist for dorahacks prototypes? (like what Ton would like to see mvp’ed) (reply to 20818)

Dappman: Do you want tutorial feedback here, or Discord, or where?

Dappman: Nevermind.  Tutorial says to submit a PR, so I assume the first step is to fork the tutorials repo.

talkol: I put a link in the message, the tutorial platform is open source, in its issues: https://github.com/ton-community/tutorials/issues (reply to 20822)

Dappman: 👍 (reply to 20824)

Dappman: Still would like to know if I have to create my own smart contract to manager NFT ownership and transfers for my upcoming NFT store, or if the TON blockchain has native support through an existing platform level smart contract or lib.  Specific docs on thsi subject would be great.

Dappman: Or, if there is an existing popular NFT store that makes its smart contract available publicly so I can do the same through its smart contract, or public REST API if has one, that would work too.  Trying to avoid redo'ing existing work.

talkol: There are multiple NFT store projects that are open source, you can rely on them directly, or fork the contracts.  GetGems Disintar TON Diamonds  Look here if you just want to deploy an NFT: https://github.com/tondiamonds/ton-nft-deployer (reply to 20827)

gnoblin: I hope admin won’t ban me for saying this, but “prepare your *nus”.  You’ll need to deploy a tree of contracts for each collection. Each collection and each nft in that collection are separate contracts.  If you need to store values for each user, you’ll need to shard you dictionaries.  There’re no view methods between contracts, cross contract calls are async, wallets are smart contracts too. (reply to 20826)

gnoblin: but the whole architecture has decent logic behind it and mr @talkol ’s tutorials help a lot

talkol: If you want some details of how TON contract sharding works, you can read this post - https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons  It’s about jettons (fungible tokens) but very similar thing goes on in NFT (reply to 20829)

A: My fift.exe does not understand constant operator. Have I got old version?

— 2023-01-29 —

&rey: You haven't imported Fift.fif. Among other, it defines constant: { 1 'nop does create } : constant Many "primitives" are actually defined there. (reply to 20832)

Sean: Hey guys, I dont know if this is a right place to ask, but does anybody know what's the difference between TON COIN and TON TOKEN?

Behrang: Toncoin is the main native coin on The Open Network. Used for paying fees, staking, etc.  TON Token which is known as Jetton, is a standard for defining new tokens in The Open Network. Like ERC20 in Ethereum. Examples include tokens like USDT, USDC, DAI, DOGE, etc. (reply to 20835)

Sean: I just want to know that TON isn't a scam right?  I think that I bought TON TOKEN through Metamask, recently, I tried to transfer to Bitget exchange and they only support TON Coin instead of TON TOKEN. 😵‍💫

Sean: I mean TON TOKEN isnt a scam right?*

Behrang: NFTs are standardized in TEP 62:  https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md  Basically, you need to create a NFT Collection (using its smart contract), and use it to create a NFT Item smart contract for each item in your collection.   To sell NFTs, you have to create a marketplace smart contract.   Check out the code of reference implementation here:  https://github.com/ton-blockchain/token-contract/tree/main/nft (reply to 20826)

Sean: I am worrying because I am seeing people commenting that it is not original

Behrang: This looks like a shit coin. (reply to 20839)

Sean: What do you mean... Isn't this TON TOKEN? (reply to 20842)

Sean: I guess I am fked?

Andrew: https://coinmarketcap.com/currencies/toncoin/ this is the one and only TON Blockchain coin (reply to 20843)

Sean: Omfg (reply to 20845)

Sean: Thanks....

F: @pchilling this chat is only for development questions, all other questions can be asked in another chat: @toncoin_chat

0101: <MainThread>  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType'

0101: Hi guys, I'm using mytonctrl, does anyone know how to fix this problem

Party: This message says that he was unable to read the state of the node. Most likely the node is out of sync. If you just installed it, then wait a while, synchronization usually takes up to one day. If it’s been a long time, then you need to look for the cause of the node’s problem, you can see the node logs: /var/ton-work/log.thread* (reply to 20849)

Howard: Hey guys, I just implement the NFTs with Royalties Fee in Tact, is there any testnet NFT marketplace I can test?

liminal: How can i update func via terminal? I'm currently using 0.2.0, but i wanna get 0.4.0

User<5446129577>: hi

J: hello

J: 'Ton' is independent developed blockchain?   or Other based blockchain? (like evm)

Alex: independent (reply to 20856)

gnoblin: Any github repo with that cool nft royalty feature? (reply to 20852)

J: thanks

鷹🦅之沙漠: https://tonapi.io/swagger-ui  Brothers, today this API takes a long time, more than 5 seconds. What will affect the time-consuming time of this interface?

A: Let me try again. Can you give me a line to define "one" as 1 I am still stuck... (reply to 20833)

&rey: If you import Fift.fif, 1 constant one should work. If not, you can do { 1 1 'nop } :: one. (reply to 20861)

A: Na... Nothing works for me. Even samples from fiftbase.pdf Other operators are ok. (reply to 20862)

🩵: Fyi (reply to 20838)

Anthony: ¡Hola, amigos! We are launching TON Barcelona Hub, a TON community of builders in Barcelona.  We will organize meetups with speeches by key TON contributors, events for developers, meetings with VC and the TON Foundation, and informal breakfasts discussing TON and Web3.  Join our community and invite your friends! Very soon, we will publish information about our first events.  https://t.me/tonbcnhub

User<5906393387>: Anyone, can you explain, why is there Orbs network, if we can use TON - fast and secure blockchain?  I understood, for ex. Polygon - for slow Ethereum, but TON is a high speed blockchain though.

talkol: Orbs is a layer above TON. Orbs relies on TON as base layer. Orbs is not supposed to help TON scale but to solve infrastructure problems that TON base layer doesn’t try to solve.  For example, to run a DAO governance normally votes need to look at a historic snapshot of holdings. TON contracts can only look at current state. So additional infrastructure layers add these functionalities (reply to 20871)

talkol: Oracles is another example like Chainlink. It’s also an infrastructure layer that runs on top of the L1

User<5906393387>: Thanks for the response! (reply to 20872)

Dmitry: Hello,  I am trying to exec callGetMethod from the browser and am getting this error: Access to XMLHttpRequest at 'https://testnet.toncenter.com/api/v2/jsonRPC' from origin '...' has been blocked by CORS policy: Request header field x-ton-client-version is not allowed by Access-Control-Allow-Headers in preflight response.  I'm using apiKey for TonClient() function  Help please fix it

User<5882834634>: Hi

User<5693104230>: Hi

— 2023-01-30 —

Hacker Hills: Friends, has someone already created an SDK for SWIFT?

Andrey: you can try this: https://github.com/andreypfau/ton-kotlin  example project for ios: https://github.com/andreypfau/ton-kotlin-mpp-example (reply to 20880)

Howard: make sense. (reply to 20873)

Hacker Hills: Kotlin?😂 (reply to 20881)

Andrey: you can call in swift functions and objects from kotlin (reply to 20883)

Howard: Can we say TON Storage also the feature that by using L2 to store the hash for the file you sharing? (reply to 20872)

Hacker Hills: I'd better write my SDK, thanks a lot) (reply to 20884)

해성: can i get full node snapshot data?

Aleksandr: Hello, guys. I developed storage service, who have time and wish, welcome https://storage-two.vercel.app/ (it works on test network now). Thanks a lot of your interest.

elephan: Hello, everyone! Now, tonscan.org is working or not?

elephan: I can't see my transaction history.

Daniil: Yes it is (reply to 20889)

elephan: Really? I am not sure why I can't see transaction history.

elephan: Only 1 hours ago is last update.

Daniil: So there were no transactions for this address in the last hour (reply to 20894)

elephan: hmmm. No, I just swap on ston fi dex, and I also sent some jettons to another address to test.

elephan: But I can's see the history. I think tonscan.org is not working.

elephan: If it is working on your side correctly, please send me screenshot.

elephan: https://tonscan.org/tx/MHJvk5Hj6FzEFxdvFWRGK55ucnFVPvUFYLPxeoNQ6iw=

elephan: https://tonscan.org/address/EQC6AepXyOwc8ywvEanTnrT_AGcRieaGOHcATq2AA1Qbzqgp

elephan: As you can see, it is not working correctly.

elephan: But tonapi.io is working.

kirito: https://github.com/ton-community/ton-onboarding-challenge why i cant run it in my PC? i follow the doc

kirito: https://ton.org/docs/develop/onboarding-challenge#development-environment

해성: can i decode transaction input?

elephan: Please check tonapi.io team. 😄

elephan: Please anyone tell me which scan site is the best for ton chain developers.

해성: are there anyone that analyze input message?

doni: probably tonapi is the best of showing transactions data such as jetton transfers  chained messages  etc … (reply to 20914)

elephan: Could anyone tell me which scan site is the best for ton chain developers?

doni: i like whales explorer

elephan: Thanks.

elephan: How about testnet? (reply to 20917)

해성: yes… but i want to decode cell data that input to transaction. do i have to get structure of message? (reply to 20915)

doni: yes you need to parse by tlb scheme (reply to 20920)

doni: are you using toncenter ?

해성: yes i use toncenter api

해성: I wanted to track some non-public contract transaction. but it seems impossible

doni: toncenter provide getransaction api (reply to 20924)

doni: and there are examples how to parse jetton or nft transfer

doni: nothing is impossible :)

Behrang: Can anyone please tell me the usage of accept_message() in recv_internal?  I saw it for the first time here:  https://github.com/ton-blockchain/nominator-pool/blob/main/func/pool.fc#L468

해성: yes. but can i parse custom contract’s input without  tlb scheme?  for example, with evm, i can parse tx input some uint256, address, slice, ... without ABI. but I cant parse TVM tx input without tlb scheme... (reply to 20928)

Андрей: If you do not know the data structure, then you will not be able to parse this data. In any case, you first need to find out what scheme you need to parse the data. You can guess, of course, but in the end, nothing sensible will come of it. Conventionally, we have 32 bytes in front of us. Without knowing the scheme of this data, we do not know what is in front of us - one key 256 bits long, or two int128, or what else. (reply to 20930)

Howard: Anyone know what is ExitCode9 here? Cell underflow?

Howard: This is NFT Item contract, and this is the issued coming from when I tried to implement the Transfer functions that will trigge by TonKeeper.    I got the initial Transfer(mining logic) successfully

Howard: Got ExitCode9 as well 🫡👋🏽 (reply to 13638)

Howard: Then how to solve this? It's the basic TLB for NFT Item Standard. 😭 (reply to 3583)

&rey: Allows using contract's balance for gas. (reply to 20929)

Howard: Except with https://testnet.getgems.io/, where can we trigged the Transfer method for NFT on any Testnet website? (reply to 20932)

Alex: You can use codespace instead of local IDE or if you want solve you PC issue, please, specify more accurate your problem. (reply to 20906)

ethzanity: Anyone building an MPC solution for TON?

鷹🦅之沙漠: Brothers, is this official website down? https://tonscan.org/

Alex: For me works fine, what is your problem? Do your browser display this page? (reply to 20940)

鷹🦅之沙漠: Thanks bro, I'll check it out (reply to 20941)

Dmitrii: can I issue my coin on the TON network?

User<5725247011>: Hi! How can I get ton rate with API simpliest way?

Daniil: yes! minter.ton.org (reply to 20943)

User<5725247011>: Can someone help me please? (reply to 20944)

Kon: https://min-api.cryptocompare.com/data/pricemulti?fsyms=TONCOIN&tsyms=USD (reply to 20946)

Andrey: https://dton.io/graphql/#query=%7B%0A%20%20actualPrice%3A%20tonPrice(time%3A%20%222023-01-30T00%3A00%3A01%22)%20%7B%0A%20%20%20%20time%0A%20%20%20%20value%0A%20%20%7D%0A%20%20tonPrice%20%7B%0A%20%20%20%20time%0A%20%20%20%20value%0A%20%20%7D%0A%7D (reply to 20944)

User<5725247011>: Thank you guys!

Behrang: I understand it for external messages. What I don't is that in this case it is only inside a specific branch of recv_internal, and I have never saw it in recv_internal on other smart contracts. (reply to 20936)

User<5725247011>: Do you know does it has some limitations? For example, 50 req per sec (reply to 20947)

&rey: By default, only incoming message value is used for internal messages processing, and if it's not sufficient, contract doesn't spend its own balance trying to process a request. (reply to 20950)

Behrang: Great, makes sence. Thanks 👍

Kon: Just use cache... There is something like 60 per seconds, 3600 per minute, etc. You can find all in their documentation... (reply to 20951)

User<5725247011>: Thank you, you helped so much! (reply to 20954)

Feliciss: Did you host your own storage? I see the ton foundation has whitelisted their own. (reply to 20888)

Aleksandr: yes (reply to 20956)

User<2132599553>: Hey there

User<2132599553>: Can anyone please provide me a basic starter template to build dapps on TON?

F: @kartock1 this chat is only for development questions, all other questions can be asked in another chat: @toncoin_chat

talkol: Hi everybody, as you know we have DoraHacks TON hackathon during February-March with a prize pool of $250K.  I live in London and there’s a local event for London on February 25-26 where I will be physically present as a mentor!  Register here:  https://www.eventbrite.com/e/first-ever-ton-telegram-hackathon-london-tickets-518678089127  Come hack with me for 48 hours in person! I’ll help you build a kick ass project and increase your chances of winning :)

— 2023-01-31 —

Feliciss: Anyone knows how to use the storage dapp: https://ndatg.github.io/tonstorage-dapp/?

User<6197590812>: W

User<6197590812>: G

User<6197590812>: 58818

Howard: Hi, for NFT Item Code:  there is a field called init? in get_nft_data() ge method, is this field should be always keep 0, or only before minting set with 0, and after it getting own by a wallt address, should change to 1? (reply to 20932)

Howard: If anyone knows how to debug in TonKeeper, please let know!  I am testing and try to find where the ExitCode 9 Coming from on Mobile, got the error code copy like this. (reply to 20968)

&rey: At the moment of minting, NFT only contains init?, index and collection_address in its storage, with init? set to zero. Upon receiving message from collection it loads all the remaining parameters and sets init? to one. This is needed to make NFT addresses independent of their content. (reply to 20968)

&rey: You can try resolving the same domain (as far as I see, this is about TON DNS) via TonWeb. (reply to 20969)

Howard: seems not this issued, will navigate more and find other possibilities (reply to 20972)

해성: Hi, when I send an internal message to contract A -(msg 1)-> contract B -(msg 2)-> contract C -(msg 3)-> contract D, if msg 3 being processed in contract D throws an exception, all are the msg processing (msg 1, msg2, msg3) reverted or only msg 3 reverted and msg 1,2 executed?

Alex: Only processing of msg 3 will be failed, 1,2 excuted. (reply to 20985)

해성: thank you! (reply to 20986)

해성: one more question, then how can make dex aggregator in ton…? (reply to 20986)

Alex: Developer have to handle all this cases in contracts logic. So, when something going wrong, for example, Contract D should send "notification" message, say, to contract A. But it means, we need to know, what could be wrong, of course. (reply to 20988)

&rey: Acquire everything by your contracts (which probably would not fail) then do all outgoing actions. (reply to 20988)

&rey: That's where formal description and verification is needed) I've recently posted such a footstep so I think someone could take it. (reply to 20989)

해성: then, with dex aggregator case, does all dex provide revert message receiver ( for slippage case ) ? (reply to 20989)

elephan: Hello everyone. I want one typescript file to send jetton to another account. Could anyone help me to share that script?

doni: do you know how to open a wallet in with npm ton ?

Liam: Hack-a-TONx DoraHacks Day 2 Mentoring Q&A Sessions  Today marks the 2nd day of DoraHacks Onboarding Week!  Please join via this Zoom link during the below time zones. Depending on the respective mentors, local language support will be available.   For question participation prize, please post your question in @hackatonx.  ● Korea - 10AM GMT / 7PM KST  Junmo Park @junmoDev (Korean session as needed)  - Bachelor of Computer Science & Engineering, Seoul National University - PATI Games - Software Engineer (Jul 2014 - Sep 2016) - SAP Labs Korea - Software Engineer (Jan 2018 - Nov 2020) - QuotaLab - Software Engineer (Dec 2020 - Sep 2021) - Ozys - Engineering Manager (Sep 2021 - Current)  ● China / Taiwan - 11AM GMT / 7PM CST  Po Chen Wei (Awesome Doge) @awesome_doge (Chinese session as needed)  - Master of Software Engineering of PKU. Former Ph.D. student of NTU EE. - TON Core Community Developer - Co-Founder of Blocktempo, TonX Studio, Entropy Group, Mzyme, Cypherpunks Taiwan, Taipei Bitcoin Meetup Group, Bitcoin Chinese Society   ● India - 1:30PM GMT / 7PM IST  Robin Dey @tnwoih_rd (English session)  - Head of Grants @ TON Foundation / TON DevRel core member - Web3 Technologist - Crypto OG (BTC maxi)  ● EUS / CIS - 4PM GMT / 7PM MSK  Marko Okhman @markokhman (Russian session as needed)  - Full Stack Developer @ TON Whales - TON&Co Co-Founder - TON Core Community Developer (forwarded from TON Society)

Petr 🇷🇺: Hi there! Can I create custom wallet contract compatible with tonkeeper?

Petr 🇷🇺: For example same as default wallet contract, but withdraw nft and ton can be only to specific wallet but don't to another any addresses

DamX: Hi guys

DamX: Who created func language ? 🤔   Just curious (reply to 20999)

&rey: I think you'll need to fork Tonkeeper and add your code + data format, and I believe that's not too hard. (reply to 20997)

&rey: Maybe, Telegram team who have been designing TON a few years ago? (reply to 21000)

Petr 🇷🇺: No, tonkeeper must be standard, only wallet contract is customized (reply to 21001)

&rey: That probably wouldn't work, because Tonkeeper would not sign transaction unless it confirms that there is enough funds on the wallet, and it doesn't support customized contracts as far as I know. (reply to 21003)

Petr 🇷🇺: But I make stayed base logic, just customize withdrawing funds in wallet contract. How tonkeeper checks and found differences? (reply to 21005)

&rey: Tonkeeper stores your seed phrase. Then, on startup (something could be cached, though), app converts it into public key, creates a contract InitState BOC and hashes it to get contract address. (reply to 21007)

F: @fourchet was banned for malicious misinformation

Petr 🇷🇺: One another question, how I can get mnemonic of mounted contract?

Petr 🇷🇺: Or how I can mount a contract with specific mnemonic?

doni: i think you ment   how can you restrict a role in a smart contract   so two best practices   add an owner address to contract storage  and restrict some actions in to contract to messages coming from this owner (reply to 21031)

doni: also you can public key instead  and verify a message signed by a certain key

talkol: Holy sh*t! Did you see you can run getters in https://verifier.ton.org ?  What is TON Verifier?  verifier.ton.org is a due diligence tool that everyone should use before touching a TON contract. You can see the source code + proof it matches what's on-chain.  Why Getters?  Let's say the contract has an admin role. Has it been revoked? Now you can run the getter and see who the admin is!  Integration in any explorer  The verifier has an SDK in ton-community github that allows all explorers embed it and also get the getters functionality.

talkol: Contract writers, please verify your sources!

Chak: Is it possible to use in testnet? (reply to 21036)

&rey: > Now you can run the getter and see who the admin is! *unless get-method returns untrue values, in which cases contract code has to be fully checked. (reply to 21036)

talkol: True! You always have to see the source and make sure the value returned is labeled correctly. (reply to 21039)

Alex: Yeah, I've noticed similar feature in ton.cx and think this is really great opportunity to learn for newcomers. Should I use same tool for Tact guides, wdyt?🤔

User<2132599553>: Can anyone please provide me a basic starter template to build dapps on TON?

Alex: There are fresh(hot!) guides that should help. Also, general information relates to building dApps for TON placed here. (reply to 21042)

talkol: We’re working on a new template here https://github.com/ton-community/func-template  The old template is here https://github.com/ton-defi-org/tonstarter-contracts (reply to 21042)

User<2132599553>: Thanks a lot (reply to 21045)

talkol: If you want tutorials to they’re here: https://github.com/ton-community/tutorials

Dario: what do you think of a command to install libs from https://github.com/TonoxDeFi/open-contracts? (reply to 21045)

talkol: There’s already somethitn development https://github.com/ton-community/fpm but the name will probably change :) (reply to 21048)

talkol: It’s not the main thing in focus but we need help thinking about it

Dario: i will take a look, a package manager for func in the past was one of my goal (reply to 21049)

talkol: We’ll love to get any sort of involvement from you :£

liminal: i have a question. Can we use ADNL protocol in TON just like Whisper in Ethereum?

Gajesh: i was trying to use func-js but keep getting the below error:  could not determine executable to run  any fix?

Levi: Hello, I have some questions about FunC. In Solidity, I can use a mapping like mapping(address => uint[]) and store it as a contract state. How do I do this in FunC (with cell & dict)?   Thanks

Daniil: you can store it like:  cell new_data = begin_cell().store_dict(my_dict).end_cell(); set_data(new_data); (reply to 21055)

Daniil: why do you need dictionary by the way? if you want to have something like user => balance map that will store data of all your users, it will lead to large gas consumption

shahar: In ton.cx it seems it’s available only for contracts known by the explorer, whereas in verifier.ton.org any developer can upload the contract source code and the getters become available immediately. (reply to 21041)

User<5557459855>: Hello everyone

User<5557459855>: I need to help to create my nft. Ton is the hardest network i've ever seen so far. So I need help

User<5557459855>: or is there telegram bot that creates nft with given image ?

Andrew: getgems.io has this option (reply to 21060)

User<5557459855>: is there API ? I want to use it in js or ts scripts

Orkun: Hello, I'am new at TON coin. How can I give myself coin for testnet account. testgiver_ton_bot does not worked for me.

Vali | QS: Have a look at the architecture of the Jetton standard if you plan to use dynamic data structures (reply to 21055)

TON Answers Bot (not AI): No peers when connected to storage-daemon from No Name  Hi there.  Used testnet-global.config.json to connect to lite servers for a query on storage-daemon.  Why it shows there're NO peers after running ‘storage-daemon’?  BagID Download speed: 0B/s Upload speed: 0B/s Peers: 0 ADNL id  Address  Download  Upload  Ready   🔗 Answer on TON Overflow

TON Answers Bot (not AI): File Not Found when compiling storage-provider.fc from No Name  Error:  Error: main.fif:53: file>B:error reading file `storage-contract-code.boc`: [Error : 0 : File not found]    Compiled from https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/storage/storage-daemon/smartcont/storage-provider.fc#L7 using GitHub func-template: https://github.com/ton-community/func-template  Answers?   🔗 Answer on TON Overflow

— 2023-02-01 —

Feliciss: Hi talkol! Is there a testnet version for https://verifier.ton.org? Should I relay on local startup for testnet? (reply to 21036)

Levi: Thank you. My purpose is to know how many item ids belong to an address ( address -> uint [ ]). (reply to 21057)

Levi: Thank you. I check it now. (reply to 21065)

Mark Okhman on TON: GM Fam! It's a big day 🚀  I'm honored to host an online onboarding workshop today as part of the DoraHacks official Hack-a-TONx event.   It's not just some coding session, no. You can treat it almost like an Apple Presentation event, because there is number of new TypeScript tools that will ease your dev process dramatically!  Kudos to TonTech, Tal Kol and the rest of @OrbsNetwork team! Don't miss out and join in a few hours!  https://www.youtube.com/watch?v=5ROXVM-Fojo (forwarded from Mark Okhman on TON)

Behrang: Isn't it renamed to blueprint?  https://github.com/ton-community/blueprint (reply to 21045)

Tim: It is (reply to 21080)

Dmitry | backend4you.ton: Hi here, I'm writing tonlib wrapper for c#/.net, and need some help to understand tonlib <-> liteserver communication "scenario":  When I send getAccountState (for example) - I got couple of updateSyncState before getting actual fullAccountState response. Ok.  In this "updateSyncState" responses I see "sync_state":{"@type":"syncStateInProgress","from_seqno":27005885,"to_seqno":27007091,"current_seqno":27007091} - so it's syncing to 27007091.  But when I couple of seconds later send one more "getAccountState" (even for same account) - I see that it's syncing again, "from_seqno":27005885,"to_seqno":27007091,"current_seqno":27007091!  Why it's syncing again from 27005885 (not from 27007091 it synced couple of seconds earlier)?

Tim: Checkout tonutils-go and it's author, he has some guides about ton architecture. Also it would probably be better to write adnl client instead of tonlib wrapper (reply to 21082)

Andrey: tonlib wrapper actualy more secure due block validation proofs (reply to 21083)

Andrey: you can call every ~5 seconds `sync = ton.BlockIdExt;` function to get actual state and not get out of sync (reply to 21082)

Dmitry | backend4you.ton: Seems not helping. For every "sync" request I get at least 3 responses : updateSyncState+syncStateInProgress, updateSyncState+syncStateDone, ton.blockIdExt, with identical from_seqno and to_seqno (reply to 21085)

Andrey: becouse 27005885 is key-block, seems all fine

Dmitry | backend4you.ton: but why it syncing to 27007820 (for example) several times in a row? It's OK for me that it's syncing to every _new_ block (27007818, 27007819, 27007820) when it appears, but it syncs to same block again and again too. (reply to 21087)

Andrey: becouse 27007820 is last masterchain block at the moment of call (reply to 21088)

Andrey: you syncing blocks from keyblock to current last masterchain block

Dmitry | backend4you.ton: but it did this second earlier. in previous sync call

Andrey: how much time takes this process?

Andrey: more than a second?

Dmitry | backend4you.ton: A little more. I have 1sec interval between every sync request, and every response takes a little.

Dmitry | backend4you.ton: If i replace sync with getAccountState - it does the same: every time syncStateInProgress, then syncStateDone, then fullAccountState. And again - syncStateInProgress repeats for same to_seqno as second earlier.

Andrey: its normal behaivour

Dmitry | backend4you.ton: ok, thanks. it was strange to me that its re-syncing the same block again

Behrang: Awesome. Is there any easy way to pass address as slice to get methods? For example for get_wallet_address(slice) method. (reply to 21036)

Alex: For ton js library Address.parse(‘EQA1PG5ByuhEWf1bzRl7957lRZiTHBFHaja-9vbrF8gmRW6P’) helps get Address object from Address string. Or what do you mean by ‘to pass’? (reply to 21098)

Behrang: I mean, if I want to find my jetton wallet address, I have to send my own wallet address to get_wallet_address as a parameter on this page where I can run get methods. However, when I paste my address, it shows me an error:  Error: Unknown magic prefix  Looks like it expects a slice, but I don't know how to convert my user friendly address or hex address into a slice to use on this page. (reply to 21099)

Alex: What did you try to use? Toncenter API? (reply to 21100)

Vasiliy: Hello! I need detailed instructions on how to create JETON. Help me please.

Daniil: minter.ton.org (reply to 21102)

Vasiliy: Thank you! (reply to 21103)

talkol: yes, I apologize, we didn't expect blueprint to be ready so quickly but TonTech teams is on a roll, so we jumped straight to it (reply to 21080)

Andrew: do you know if the blueprint will support tact when it'll reach the release, by any chance? (reply to 21105)

TON Answers Bot (not AI): Is there any equivalent of emit and event from Solidity? from Nicolas Maissouradze  Hello, is there any equivalent of emit and event. Like in solidity and with possibility to cache all data and access it later? Thank you!  🔗 Answer on TON Overflow

Behrang: https://verifier.ton.org (reply to 21101)

Ghost captain: Are there any Chinese channels?

talkol: it will support tact of course (reply to 21106)

talkol: oh nice, this is something that needs to improve in the getter user interface in verifier. @mrbonezy was working on it, he can fix it. Thanks for the feedback! (reply to 21108)

shahar: I’ll add support for this soon (reply to 21100)

User<5557459855>: How can i generate qr kod for buying an nft ?

User<5557459855>: And I want to ask this, what are these stand for ? Does collection.json must be object array ? And  does collection_base path of images or metadata ? I need help. Thanks COLLECTION_CONTENT=http://yourcollection.com/collection.json COLLECTION_BASE=http://yourcollection.com/nft/

Cpperg: ✈️Dear developers.  If you are in Dubai and work hard on some TON project you can come to TON incubation center and work in co-evolution process with TON staff  ✅️It is available from monday till friday 12:00 - 17:00   📍Location: Al Moosa Tower 1 https://maps.app.goo.gl/5a3Eyn2x4MfNadK97  p.s. before coming write @iorii9

TON Answers Bot (not AI): Is there any zk friendly hash algorithm in func? (like MiMCSponge) from Nicolas Maissouradze  Hello, is there any zk friendly hash algorithm in func? (like MiMCSponge) Or maybe a way to generate it with circom and snarkjs? I know it supports solidity for now. Thanks!  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Equivalent of solidity constructor in Func ? from Nicolas Maissouradze  Hello, how to initialize smart contract data when creating it? I am looking for an equivalent of the solidity constructor which takes parameters when deploying smart contract and then saves them. Or should it be handled differently? For example use an op. Thanks!  🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to declare the string type? from Nicolas Maissouradze  Hello! In solidity, there is the bytes32 type for that. How can I declare a string in func? For example, string text = "abc"; Thank you!  🔗 Answer on TON Overflow

User<5906393387>: No fiftlib.zip file here 😭  https://ton.org/docs/develop/smart-contracts/environment/installation#2-setup-your-binaries  UPD: fiftlib.zip can be found here: https://github.com/ton-defi-org/ton-binaries#instructions

User<5901725413>: Hello, is there any way to generate verifiers for func with circom/snarklibjs ?  Or should I first do it for solidity and then rewrite the verifier to func?

Saber: Hi, pairing operation is not still implemented in TVM and if you want to implement it in func it’ll not be gas efficient You can check my implementation here: https://github.com/SaberDoTcodeR/func-alt-bn128 (reply to 21121)

User<5901725413>: Thanks! Will check it out (reply to 21122)

User<5901725413>: And what about zk friendly hash algorithms ? Like mimcsponge or Poseidon? (reply to 21122)

Maksim: you have any statistics about gas usage? (reply to 21122)

Narek: Great news, guys!  We just released blueprint🔥  Blueprint is a development environment for TON for writing, testing, and deploying smart contracts.  It allows you to setup a development environment in one click.  - no need to download binaries anymore - easy setup - dead simple deployment to mainnet/testnet using your favorite wallet (eg. Tonkeeper) - blazing fast testing of multiple smart contracts in an isolated blockchain running in-process  Check it out and tell us what you think (forwarded from TonTech)

Dario: Only .fc support or i can also use .func? (reply to 21130)

Narek: Support’s both, but standard templates use .fc extension

Max: you'll have to edit compilation files but it should work (reply to 21131)

Dario: Okok (reply to 21133)

&rey: Will it close Footstep 38? https://github.com/ton-society/ton-footsteps/issues/38 (reply to 21130)

Narek: I guess so

Daniil: https://github.com/ton-society/ton-footsteps/issues/15

Daniil: Isn't it more about this?

Narek: That one too

Feliciss: It doesn’t support .boc files in .fc. (reply to 21130)

Narek: what do you mean by that?

Feliciss: https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/storage/storage-daemon/smartcont/storage-provider.fc#L7 (reply to 21142)

Saber: for zk snark we need a pairing operation on 4 points and as far as I checked each miller loop will cost arround 1000 ton , so 4000 for a pairing of 4 points. Basically it’s infeasible in func, I think as Durov mentioned it in the whitepaper the core team should implement the alt-bn128 curve in the TVM opcodes (reply to 21126)

Maksim: but if we only need to verify the proof, will only 1 pairing operation be required? (reply to 21144)

Narek: we try not ton promote usage of Fift (reply to 21143)

Saber: yeah 1 pairing with 4 miller loop (reply to 21145)

Maksim: so this 1 pairing costs 250 ton?) (reply to 21147)

gnoblin: what’s miller loop? and this pairing thing. thanks) (reply to 21147)

Saber: @yungwine edited this one for clarification (reply to 21144)

Maksim: oh got it thanks (reply to 21150)

Maksim: the most expensive computations ever

Saber: if you are interested in details, Vitalik explained it perfect: https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627 (reply to 21149)

User<5901725413>: So it means zk proofs are not possible for now in ton? (reply to 21144)

Saber: hmm, that’s what we are trying to change(I’ll share my update in a few weeks) (reply to 21154)

talkol: We should edit them that both extensions are always supported 😅 (reply to 21133)

Dario: Hi! Is there any explorer that supports exotic cells in getter method stack?  So far, I tried  ton.cx explorer.toncoin.org explorer.toncenter.com dton.io  but none of them works

User<5901725413>: Thank you! Keep me updated haha please 😁 (reply to 21155)

Andrey: Hey, did you try in dton over graphql? It might work  Try this (reply to 21158)

User<1518952680>: How can I change from mainnet to testnet in Tonkeeper or Tonhub app?

Andrew: in Tonkeeper you need to tap the logo multiple times in the settings, for tonhub you need a separate app called sandbox https://play.google.com/store/apps/details?id=com.tonhub.wallet.testnet (reply to 21161)

User<1518952680>: 🙏 (reply to 21162)

Steven: Hey guys, who's up for a collaborative build of an NFT marketplace on TON  Or is there a leading NFT marketplace on the chain already??????

talkol: There are a few, you can decide how good they are:  getgems.io disintar.io ton.diamonds

Steven: I love the first, not gonna lie 🥲 (reply to 21165)

Steven: This calls for the build of something different, a true utility for the NFTs existing on the TON Blockchain

Steven: I'm interested in creating a Lending Protocol for TON NFTs Anyone interested in working on this with me, please send a DM

Levi: Hello, I have a question about WalletV4. How to send an external message to the WalletV4 contract to install & deploy plugins?

liminal: Does someone have ideas how farming can be implemented?

Saber: If you are looking for something like MasterChef, I wrote something similar, maybe it could be helpful for you. https://github.com/oxydev/histopia-ton-contracts/blob/main/contracts/foe.fc (reply to 21173)

liminal: Thanks a lot! (reply to 21174)

Daniil: immediately (reply to 21178)

— 2023-02-02 —

&rey: 1) Check what is contained in transaction to buy NFT done manually. As far as I remember, you don't need to send any body along with transaction. 2) Find out a way to get NFT sale contract address. 3) Send needed amount of money to that contract via TonWeb. (reply to 21185)

TON Answers Bot (not AI): Looking for chain-bloat and staking % from BakuDem  Hi, is there any website to look at how large the TON blockchain is? I can't seem to find anything on chainbloat. Also, can I see somewhere what % of the TON supply is staking?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Are you building on TON and needs a team to help you out? from Anthony Jude  We are a major service firm in the industry, providing marketing and technology services to organizations in both web2 and web3 blockchains such as TON Chain, Ethereum, BNBchain, Polygon, Solana, Cardano, Fantom, and Cronos chain. At Lite Services, we strive to provide services that will assist our clients in achieving their objectives.  🔗 Answer on TON Overflow

TON Answers Bot (not AI): How do I get an RPC endpoint for TON? from Telegram Chat Import  How do I get an RPC endpoint for the TON network, and where can I get relevant documentation for it?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): What is the best block explorer for the TON network? from Telegram Chat Import  What is the best block explorer for the TON network? I'm looking specifically for an explorer that allows developers to look at smart contract bytecode, verify smart contracts, and view the details of transactions in detail.  🔗 Answer on TON Overflow

Nik: how could ios developer start develop something in ton? I love the technology, and would like to be a part of the community. May be somebody needs my skills

Khanh Duong: Hello, i have a question about ton-onboarding-challenge. I want to display miningData, but its only show type of stack TupleReader. Thanks!

Ghost captain: Are there any Chinese channels?

Anthony: https://t.me/tondev_zh (reply to 21194)

Seitaro: Do we have strong reasons to support alt-bn128?  bls12-381 looks more preferable (reply to 21144)

Hermès: dton.io is good (reply to 21190)

Mark Okhman on TON: 🚀 Live again today with Narek Abovyan from TonTech!  Topic is "Creating your first FunC contract".  Links:  YouTube https://youtube.com/live/7RyMxSJZk9Q  Binance Live https://www.binance.com/en/live/video?roomId=2120136 (forwarded from Mark Okhman on TON)

Rick: Hello Guys!  who knows how to burn a token in TON?

Petr 🇷🇺: Hello! It's available to upgrade/update deployed contract on ton blockchain? Or need to use proxy pattern like in EVM blockchains? If upgrading feature available, give, please links to docs where upgrading example described...

Petr 🇷🇺: Is there at least one real ton programmer?

Dario: https://ton.org/docs/develop/func/stdlib/#set_code (reply to 21203)

User<5727115339>: are you finished deploying a contract on ton blockchain? (reply to 21203)

talkol: Hey everybody,  TON Access is now live in Public Beta.   For those of you unfamiliar with this project, TON Access is a reliable decentralized RPC network for TON dapps. It was made so that your dapp users who are anonymous could access the chain without API keys and without throttling.  For more info please see - https://orbs.com/ton-access  To participate in the beta please join the group @TONAccessSupport

Levi: How do I send an external message to deploy & install a plugin with WalletV4 (using ton-client, ton-connect...)? Thanks.

User<5906393387>: In step 8 of this tutorial:  https://ton-community.github.io/tutorials/02-contract/  To install some packs, you just use: npm install ton ton-crypto ton-core (reply to 21208)

User<5557459855>: when i deployed my nft collection, there is no metadata or image of my nfts in my wallet ? Is there any idea why is that happened ?

Simone - Immunefi: is there a faucet for receiving an nft on ton testnet? I'm testing out the multisig contract and would like to try nfts as well

&rey: You can mint NFTs on testnet.getgems.io. (reply to 21211)

Simone - Immunefi: thanks!

Simone - Immunefi: I'm having issues in finding a wallet that can I can connect to testnet.getgems.io that I can switch to testnet. I've tried tonkeeper and ton wallet but they don't seem to have a testnet option. Any suggestion? (reply to 21212)

&rey: In Tonkeeper you can tap version several times, like "developer mode". (reply to 21216)

Simone - Immunefi: man, you are amazing! thanks so much 🔥 (reply to 21217)

Stickerfy: Hi, has someone connected a TON wallet in Unity? I found https://github.com/ton-connect , but there is an implementation only in JS. Maybe there is already exists implementation in C#?

Andrey: Maybe this will help: https://github.com/disintar/ton-connect-python-proof/blob/master/check_proof.ipynb  You can proof login request with any backend, this is Python example (reply to 21219)

WitKoiL | Axiom Labs: It was hard, but we made it. Introducing something brand new. store.devdao.io Domain rentals for sub domains release coming soon. Keep an eye on the service.  By DEVDAO

WitKoiL | Axiom Labs: Domains can be bought instantly, without auction. And after buy, you can already transfer tons by resolving it in wallet. (reply to 21221)

Salandra: How add a new domain?

Victor: Coming soon... (reply to 21223)

Simone - Immunefi: I'm using this multisig contract https://github.com/akifoq/multisig to hold an nft. Now I'd like to move this nft on a different wallet. However I do not see a function that let me move nfts but only funds. Any ideas how this could be achieved?

TON Answers Bot (not AI): Error when sending message to Storage Provider's address with dead long reference from No Name  I followed the steps to generate a store request with a storage provider's address: https://ton.org/docs/participate/ton-storage/storage-provider#a-request-to-store  Then I read and followed this sentence   > The client must then send the message with this body to the provider's address.  to encrypt the body to base64, which is   te6ccgEBAgEAngABaRB8Se8AAAAAAAAAADvaM46LR+ifBrcta6qHuZT2SbKo9ur55S8FZyCafYrwQ7msoAAAFRgIAQDIAAIAAAAAAAAAEbzIoqIVMsZHBtv/p3Ds78kvjKxQuujxKHeE9Y05S/sq5KgAAAAAAAAGeSEkMZDzYVfLTKa4v7GXlyBMMHSEP5wiChpHAVu83/k0AQ5teSBnYXRzYnkgc2l0ZQ==   and send the encrypted reference with a transaction to the provider's address.  And it failed with error Message size has been exceeded by 106 characters.  How to send the message with the body to the provider's address?  🔗 Answer on TON Overflow

— 2023-02-03 —

TON Answers Bot (not AI): Is there any more materials on writing those tests? from Telegram Chat Import  Is there any more materials on writing those tests? Since I am just joined the TON ecosytem. As far as I understood, in order to test internal command, tests is the only way to run them before deploying to blockchain  - Is there any more materials on writing those tests 🙏 - What are pros and cons of doing it with TS vs fift?     🔗 Answer on TON Overflow

Vasiliy: Hello! I want to make a paid subscription to my telegram channel in TONs or my JETONs. Who will tell you how to do it?

User<5693104230>: Yeah, I wanna know it too. Tell Us (reply to 21232)

User<5693104230>: Hello, this look like my name (reply to 21225)

0101: Hi friends, I'm using mytonctrl and want to expose the API using the ton-http-api docker image, but I encountered this error. Can anyone help me out?

WitKoiL | Axiom Labs: Tonrocketbot Has a subscription feature (reply to 21232)

WitKoiL | Axiom Labs: ☝🏿 (reply to 21233)

Behrang: Have you tested @donate bot? (reply to 21232)

Vasiliy: donate bot - does not support JETON. Also be sure to include a bank card. Requires documents. At the same time, who is behind the donation system? I did not find information? To whom should I trust my documents and bank accounts? (reply to 21239)

Chris: u can use @xjetswapbot api (reply to 21232)

Chris: but we dont have subscriptions, u can make them with api

Adam: @tonRocketBot The perfect solution for your task (reply to 21232)

TON Answers Bot (not AI): How i can implement an NFT with lock up feature? from cerrn0  Are there any embedded options to add lock up & lock down feature into NFT smc code? Or how i can implement function that prohibits to transfer NFT for a while?  🔗 Answer on TON Overflow

Simone - Immunefi: Hi all  I've transferred an NFT on a multisig contract over testnet. The nft is owned now by the multisig, however if I visit the explorer here https://testnet.tonscan.org/address/EQAOvel3i3BNatBTSB2WXLjrwApOqaKwRJQobPKvLi4xxum9#transactions on the NFT tabs nothing shows up.  You can see the contract type to be "NFT".  Also, by using the lite-client and printing out the content of the multisig wallet using getaccount there is no reference to the NFT.  Do you know what I'm doing wrong?

Simone - Immunefi: I would have expected to find it under    other:(extra_currencies         dict:hme_empty))   but it's empty

Daniil: I see that NFT's "owner" field is correct (reply to 21245)

Daniil: No, the NFT isn't stored anywhere in wallet. It's a separate contract (reply to 21246)

Simone - Immunefi: I see. Then how can I transfer ownership to another wallet? note that the wallet holding the nft is a multisig

&rey: You need to form a message for transferring NFT and then do whatever appropriate for multisig to get it sent to NFT contract. (reply to 21249)

Petr 🇷🇺: Hello! How I can make my ton contract approved, mean code checked by validators?

&rey: https://verifier.ton.org (only on mainnet)

&rey: Please note that's Orbs validators instead of TON ones. Though this makes a little difference. (reply to 21251)

Petr 🇷🇺: It's what? Orbs or another?

Petr 🇷🇺: Where I can read about differences? (reply to 21253)

User<554673663>: Hey folks Grafana dashboard not working https://tonmon.xyz/?orgId=1&refresh=5m

&rey: I can't find the description though I've read it, probably it is shown while verifying contract. In short: — TON validators execute your contract bytecode. They are responsible for correct execution but they don't know code from which the contract was generated. They are designed for highload and are doing the one thing — generating TON transactions; — Orbs validators, among other things, can check whether onchain code matches one provided by users. If I remember correctly, they have significantly lower stakes. (reply to 21256)

talkol: true, verifying the source code matches is also somethign you can do yourself in your browser so it's much less dangrous (reply to 21258)

talkol: the verify manually button, takes all the sources from IPFS to your browser, and compiles them using WASM and makes sure the bytecode matches the on-chain

talkol: so if you're really paranoid and don't trust anyone, you can do that and have peace of mind

talkol: also, the list of source code verifiers is open and any community verifier is welcome to join - the system is described here: https://github.com/ton-blockchain/TEPs/pull/91  Orbs validators are doing this as volunteer work as a community service, they don't make any money from this :)

&rey: Which part of it? For me it works well. (reply to 21257)

Simone - Immunefi: I was able to create a message to transfer TON tokens but I do not see a method to create a message that let you transfer the NFTs. Do you have an example? (reply to 21250)

Krugo D: Is there an easy way to see how many tx per second TON is currently handling, and at which point the TON BaseChain will shard in to 2 chains?

&rey: https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102 https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/sources/nft-swap.fc#L100 (reply to 21266)

&rey: Then, this message should be included as a payload to message transferring some (~0.1) TON to NFT contract address.

Filiberto: hi, can u host something on the TON network?  (such as websites, telegram bots, etc )

talkol: If it’s a lot of data TON Storage is the way to go, it’s a storage service for static files (reply to 21270)

Feliciss: How to test TON storage hosting on mainnet / testnet? As far as I know https://ndatg.github.io/tonstorage-dapp/ is not working. (reply to 21271)

Filiberto: yes but is it possible to host static website? or hosting a telegram bot? (reply to 21271)

Feliciss: It’s possible with .html files. (reply to 21273)

Filiberto: hosting javascript? (reply to 21274)

Filiberto: or running it?

Feliciss: Unless you compress or import JavaScript scripts to .html files. (reply to 21275)

Feliciss: Several ways to do, e.g. Next.js

Filiberto: yes infact, so potentially i can host a dynamic website? (reply to 21278)

Feliciss: I think it’s no problem with static load (no server on the backend)😉 (reply to 21279)

Filiberto: okok but how can i access the TON storage? (reply to 21280)

Channel<1864631728>: @admin (reply to 21282)

— 2023-02-04 —

User<5984571547>: 有人吗

TON Answers Bot (not AI): What does "dns_storage_address#7473 bag_id:uint256 = DNSRecord;" mean? from No Name  Have seen this: https://ton.org/docs/participate/ton-storage/storage-faq#how-to-host-static-ton-site-in-ton-storage-low-level  > dnsstorageaddress#7473 bagid:uint256 = DNSRecord;  Looks like need to assign bagid to the sha256 of "site" ("site"H) DNS record?  Possibly it can be archived with TonWeb lib like this?  const bagId = new TonWeb.utils.StorageBagId(value) record = TonWeb.dns.createStorageBagIdRecord(bagId) setTx(TonWeb.dns.DNS_CATEGORY_SITE, record)    🔗 Answer on TON Overflow

Krugo D: How does FunC compare to more wider adopted languages such as Solidity? Is there a reason why TON has chosen a proprietary language over something more battletested and widely known?

Andrew: FunC is built as a high-level language over Fift, which is proprietary because TON has it's own VM, called TVM (reply to 21294)

Daniil: Func is actually low level. If Fift is assembly, then Func is like C (reply to 21295)

Daniil: High-level language for ton is currently Tact

Andrew: well right now it is (reply to 21297)

Andrew: I'm talking more about hierarchy: Fift - FunC - Tact

Victor: But Fift is not really assembly and FunC in theory could compile directly into the TVM code. Like solidity does with EVM. (reply to 21296)

Daniil: It was just an analogy (reply to 21300)

Whitey: Hi there! Can I shedule a task for executing each hour, e.g. 1:00, 2:00 ... And in execution process get all transaction information of last hour exactly?

Nikitka: use crontab to schedule your task and tonapi.io to fetch the data (reply to 21303)

Whitey: It's impossible make this processes on chain? (reply to 21304)

Nikitka: why do you need to make it on chain (reply to 21305)

Whitey: Maybe exist some instrument for repeated task by time? In ton blockchain (reply to 21306)

Nikitka: you can send a transaction to your contract every hour

Whitey: I know another way - if some transaction happen - check the time. But in this case, needed many transaction each minute

Whitey: Can I get last hour income fund transaction from the contract code?

Nikitka: assume you need to store each transaction in the contract data, but it could be gas consuming

Whitey: Is it fit, if I send read (free) transactions to the contract? (reply to 21308)

Whitey: But I can get this data from tonapi.io for free? Or I need paying for ability to parse this information? (reply to 21311)

Brian: Buenas me quiero iniciar en esto como lo hago ?

&rey: Yes. You can save old balance and after an hour calculate the difference to get income. (reply to 21310)

Whitey: I need to get not amount, but detailed statistic - who, amount, time - about each transactions in last hour (reply to 21315)

&rey: Income is always associated with message so this will calculate everything exactly hourly. (reply to 21315)

&rey: Well, then you need offchain processing. (reply to 21316)

Whitey: Ton blockchain doesn't have scheduling system? (reply to 21318)

&rey: Otherwise, I could use your contract for storing unlimted amount of data. (reply to 21318)

Whitey: Is it expensive? (reply to 21320)

&rey: Builtin -- no. I am developing one, but there are several problems. (reply to 21319)

&rey: Yes, this is pricey. I can store 1 GB, for example. (reply to 21321)

Whitey: Is it possible - remove last data for make it cheaper? (reply to 21323)

&rey: Yes, tonapi.io is free, or you can launch own lite server. (reply to 21313)

Whitey: How much worth to store 100 megabytes for example? (reply to 21323)

Whitey: If I launch off chain - this is not fairly, I can rule of my own server. Otherwise - my server can lay down, and all system will stop

Whitey: I wanted make all processes on-chain...

Whitey: Schedule system absent in the ton blockchain?

&rey: 400 TON/year https://ton.org/docs/develop/smart-contracts/fees#calculator-example (reply to 21326)

Whitey: But saving every turn it's a small text information... (reply to 21330)

Whitey: Can you help me with scheduling system on-chain like off-chain cron?

&rey: By "sending read-only transactions" (those are called get-methods) you can't change blockchain state. Blockchain doesn't even know whether you have ran some code. (reply to 21312)

&rey: I'd rather wish TON Foundation to approve my footstep https://github.com/ton-society/ton-footsteps/issues/71, after which moment the timer would be available for everyone. (after it's done, of course) (reply to 21332)

&rey: Why do you need many transactions? I think you can safely postpone all processing to time when next message arrives (just do processing first and then put new message into queue). (reply to 21309)

Whitey: Does it mean that full on-chain informational systems it's impossible? Why is this blockchain needed at all then?

&rey: Full onchain systems usually don't need their transactions state. In most cases, they can be reduced to operating with a small chunk of data and current transaction. In TON Blockchain, this is known as transition from global to local consistency conditions. (reply to 21336)

&rey: Storing big amounts of data is not effective for sharding — separating big blockchain into small shards that can operate by themselves.

Whitey: TON chain have a random generator? If that is, Is it real or pseudo random?

&rey: https://ton.org/docs/participate/own-blockchain-software/random (reply to 21339)

&rey: Random is generated by validators, usually from OS randomness source. (reply to 21339)

Whitey: Can I, for example, make contract, that will store history data in new deployed contract for each new day? It makes sense? (reply to 21338)

&rey: Yes, though this history could be too big to be processed afterwards. For reference, each transaction uses at least 649 bits and takes no more than ~0.01 TON from sender. (reply to 21342)

&rey: Also, you have a gas limit of 1 TON per transaction (incoming message).

Whitey: I need only get info about last hour each hour, info older two hours (e.g.) no longer needed

Whitey: Maybe is there have to rewrite information, for make it cheaper?

&rey: What processing do you want to do with it afterwards? (reply to 21345)

&rey: Creating new cells is rather expensive, though it will obviously be needed for storing data in contract's storage. (reply to 21346)

Whitey: For selecting winner (for example) of last hour, combining random + wallet biggest transfer summary amout for increasing probability (reply to 21347)

Whitey: For example - I have one wallet, who make 10% of total amount (in last hour) and who make 90% amount, next will select item randomly from array - [one, two, two, two, two, two, two, two, two, two,]

Whitey: Or 30 ~ 70 - [one, one, one, two, two, two, two, two, two, two]

Whitey: It's draft idea

&rey: You could limit minimal transfer amount to 5 TON.

Whitey: And what does it give? (reply to 21353)

&rey: It limits transactions number to be stored, thus guaranteeing your contract could process them all. (reply to 21354)

Whitey: Because not everyone can afford such expensive payment? (reply to 21355)

Whitey: Is it impossible - rewrite data in TON storage?

&rey: For example, let's say reasonable limit for your contract is 5'000 TON total. This gives 1000 transactions to be stored, and with effective processing this can fit into 400*1000*1e-6 = 0.4 TON, which is reasonable.

&rey: TON Storage is a separate service, inaccessible by smart contracts. However, you can optimize way of storing transaction in contract's data. (reply to 21357)

Whitey: Only optimize, not rewrite? To save space? (reply to 21359)

Whitey: Stored information is stored forever?

&rey: I've meant that you can load source wallet address and transaction amount from in_msg and store only those parts. (reply to 21360)

Whitey: Also time... It's all (reply to 21362)

&rey: No-no, you can delete old cells. (reply to 21361)

&rey: More precisely, for changing contract data you call set_data with new cells DAG. Contract won't be charged storage fee for any cells not in it, nor nodes guarantee to store these cells for a long time.

Whitey: If I will check time differenct of when new customer makes payment - and if it's more than hour time has passed - then I get all transactions for last hour - calculates winner, then remove all information for writes new for next hour. It makes sense, is it better/cheapest than leave all history forever in the ton blockchain? (reply to 21364)

Whitey: Is it right way?

&rey: Yes, this makes sense and is obviously cheaper than leaving history forever. (reply to 21366)

Whitey: Thank you very much! You have no idea how you helped me! (reply to 21368)

&rey: Good luck in buidling on TON) (reply to 21369)

altoshi: “now it turns into some q/a , I think I can continue to answer for a fee.” 😁

&rey: WDYM? (reply to 21371)

altoshi: https://t.me/tondev_eng/19131 (reply to 21373)

User<5807008649>: Hey

Rahul: How we can generate an ABI? I am using func-js.

User<5557459855>: how can i send one of my nft with ts-node ?

Jakhongir: Hi all, I had recently seen the repo for @wallet bot, I was going to learn some parts from it to implement in my bot but can't find it anymore.  Anyone know?

Ahmet Said: while creating contract with npm create ton in final phase i get this error  [3/3] Creating your first contract... Error: Command failed: npx blueprint create firstcontract --type counter     at checkExecSyncError (node:child_process:828:11)     at execSync (node:child_process:899:15)     at main (C:\Users\HP\AppData\Local\npm-cache\_npx\a8f70a173d7840bc\node_modules\create-ton\dist\cli.js:65:34) {   status: 1,   signal: null,   output: [ null, null, null ],   pid: 3280,   stdout: null,   stderr: null } what would be the problem ?

&rey: Are you able to run npx yourself? It seems execution somewhy fails, maybe because it doesn't find the file. (reply to 21379)

Ahmet Said: got this error but i rarely get npm package problems so ıdk how to resolve it

Alex: I'm not sure I can find, repo that you meant, but according to your issue: this article and this repo could be useful. (reply to 21378)

Ahmet Said: even tried in powershell with admin privilage it still give me the same error but different pid (reply to 21380)

Andrew: Abi can be generated for Tact contracts (reply to 21376)

Rahul: If you could share reference for tact also. That would be a great. (reply to 21384)

Andrew: docs.tact-lang.org (reply to 21385)

TON Answers Bot (not AI): What is the touch method on a slice in v4 wallet smart contract? from Telegram Chat Import  I see that there is a touch method in the wallet contract  https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L90  What exactly does it do?   ---  > This question was imported from Telegram Chat:  > https://t.me/tondev/41989  🔗 Answer on TON Overflow

User<5693104230>: Hey

User<5693104230>: Can you help me

User<5693104230>: With ton

liminal: Will Tact totally substitute FunC in the future?

gnoblin: probably not (reply to 21395)

liminal: how can i see what '@stdlib/jetton' contains?

Andrew: https://github.com/ton-core/tact/blob/main/stdlib/libs/jetton/master.tact (reply to 21397)

Ahmet Said: where can i find the exception codes for ton ? for example 0xffff

— 2023-02-05 —

Max: 0xffff is what's sometimes used to indicate that no op defined in the contract matched the one indicated in the message, basically "unknown function"  otherwise, only some tvm exit codes are standardized (such as cell underflow for example), but you wouldn't throw such codes yourself, and smart contract authors are pretty much free to use any codes that are not in that range of standardized ones

Ahmet Said: thanks (reply to 21402)

Dima: hi all, I’m a reasonably experienced solidity dev, but I found that ton uses a different programming language. Before I start learning things about TON and how it works, any chance some can recommend some resources to look into or just some things that would be important to know before starting?

gnoblin: hi! https://ton.org/docs/develop/getting-started - basically everything that you can find here (reply to 21404)

Dima: ok, cool,  thats the one I was looking at (reply to 21405)

Dima: thanks

Tse: I'm trying to run rldp-http-proxy on my  linode server, the server currently served as a reverse proxy to my .io website. Is this a right approach to launch a ton site?

Tse: NVM Iooks like it works just fine. (reply to 21413)

Tse: But I don't know why, I can't get my .adnl domain linked to my .ton domain. is it has to be in hex format?

Tim: Not sure what you mean. Checkout ton utils proxy https://github.com/ton-utils/reverse-proxy it should be easier (reply to 21415)

Tse: I found out that it indeed has to be in hex format, and now my site theopenpass.ton works just as intended. Thanks for your recommendation tho will check that out (reply to 21416)

Deniz: Hello everybody, I'm experiencing some issues with the Tutorial #4 https://ton-community.github.io/tutorials/04-testing/   In step 5, we're supposed to debug print some variables, but I can't see anything from the counter.cell (the debugs added to the recv_internal method in it)  I've downloaded and changed the counter.cell provided by the tutorial in step 5.   Added the test output, thank you for the help,

Max: hello there has been an update to sandbox that broke this  add await blockchain.setVerbosityForAddress(counterContract.address, 'vm_logs')  before the call wallet1.send (reply to 21421)

Deniz: Thank you Max, it works, 👍 Altough to see the same output as the tutorial I also added that snip to the second test (reply to 21422)

Rahul: In DeLabConnect wallet, I am not getting an option for tonkeeper. Do we have to pass any extra configuration for that?

Ahmet Said: is sandbox faucet bot working for test tons ?

liminal: Is it true that local variable (which is used within one function) doesn't impact on gas consumption?

Howard: any openSource project I can check how to integrate the TonKeeper?

Andrew: https://github.com/ton-connect/demo-dapp-with-react-ui (reply to 21427)

Howard: LFGGGG Onboarding billions of usersssss (reply to 21428)

Tolya: Announcement: The Tact documentation is located at https://docs.tact-lang.org/.   Since this language is currently being developed by independent enthusiasts, the documentation located in the project repo, where it will be easier for authors to update it.  New pages which have been on ton.org/docs for some time will be sent there by Pull Request.

TON Answers Bot (not AI): How big is the dictionary for seed phrase generation? from Telegram Chat Import  I know that the seed phrases (mnemonic word sequences used for accessing crypto wallets) are generated using words from a specific "dictionary". In Bitcoin the process is known as "BIP39" and its dictionary is well known. But I could not find information regarding TON. Is the same BIP39 dictionary used for TON wallets or is there a custom TON dictionary? How many words are in that dictionary?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): What does "inactive" wallet status mean? from Telegram Chat Import  I've created a new wallet. It looks ready to use, but explorers like Tonscan say its state is "inactive". What exactly does it mean? How should I make it active?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/82581   🔗 Answer on TON Overflow

User<5116638705>: Hello, I have a question  I want with the library tonweb transef ton

User<5116638705>: how can get hash blockchain tranfer? (reply to 21434)

Alex: In this article you can find very detailed explanation how to do it. To see tonweb code snippets, you need switch on tonweb library via button on the right sidebar. (reply to 21435)

talkol: If anyone would like to PR a fix to the tutorial it would help! (reply to 21422)

Andrew: I think there is a PR already - https://github.com/ton-community/tutorials/pull/7 (reply to 21437)

talkol: The system works!! 💪💪 (reply to 21438)

talkol: Will review and merge tomorrow

Ahmet Said: srry for beginner question but what is the problem here ?

Ahmet Said: trying to use getter from provider but get this error

User<5116638705>: how get txid transfer with tonweb js ?? (reply to 21436)

User<5116638705>: return { '@type': 'ok', '@extra': '1675616937.1691544:6:0.8355217306615476' } (reply to 21446)

Andrew: this contract is not deployed yet https://tonscan.org/address/EQAt0Kc077kaHyRunDhnBnF6brKSR8xsd2wMc_pVvunVwyiI#source (reply to 21442)

User<5116638705>: Help me please (reply to 21449)

Ahmet Said: it even gave me these links how is dat possible ? (reply to 21448)

Alex: As I remember, there is impossible to create such tool for TON blockchain because it's async, you have to read blockchain and parse incoming messages, for example by contract address. Various tools already exist, but not with tx id. (reply to 21447)

User<5116638705>: Oky (reply to 21452)

Ahmet Said: im in testnet btw  https://testnet.tonscan.org/address/EQAt0Kc077kaHyRunDhnBnF6brKSR8xsd2wMc_pVvunVwyiI

Alex: Exit code 9 - means Cell underflow error. Your contract trying to read(more) bit or references, when there is nothing to read. (reply to 21455)

Ahmet Said: so do i need to add some initial value ? im trying to accomplish this https://dev.to/dvlkv/introduction-in-func-how-to-start-developing-in-ton-50hp  but using template from npm create ton

Elvis: sure (reply to 21457)

TON Answers Bot (not AI): What is the address Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF used for? from Telegram Chat Import  The address Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF looks very pretty, holds a lot of TON coins and has a lots of transactions, as can be seen in an explorer: https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF   What exactly is it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/82750   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Are there any open source iOS TON wallets? from Telegram Chat Import  I know there are multiple TON wallets for different platforms. Can you name some open source ones for iOS?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/47147  🔗 Answer on TON Overflow

Ahmet Said: Does api key bot work ? i click on my api token nothing happens so where can i get api key for my queries ?

TON Answers Bot (not AI): What is seqno? from Telegram Chat Import  In the world of TON development, when it comes to messages, I often see references to seqno but I haven't yet understood, what exactly that is? What do we need it for?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/86427  🔗 Answer on TON Overflow

Alex: you can try work with @orbs-network/ton-access (reply to 21461)

Alex: but for me works fine (testnet). Did you try it here? (reply to 21461)

Ahmet Said: yep

Alex: idk, try / start and ask again, maybe. (reply to 21465)

Alex: Well. I think it will be nice option for you, it was developed recently and help to avoid api key issues.

Ahmet Said: orb worked pretty well thanks i mined the nft (reply to 21468)

Tolya: TON Awards 2022  If you've made an open-source, non-commercial product on TON and it's working - submit an entry to the TON Awards 2022.  Learn more - https://github.com/ton-blockchain/ton-awards-2022

Александр: When is a due date? (reply to 21471)

TON Answers Bot (not AI): What is the status of the Tact smart contract language? from Jeremy  Tact is a smart contract langauge compatible with TON. It is closer to Solidity than FunC, which makes it easier for developers to make the switch. However, recently its relevant repositories have been archived. Has Tact been sunset, or is it still in development?  🔗 Answer on TON Overflow

Nikitka: it's been moved to a new repo: https://github.com/ton-core/tact  and it's still under active development (reply to 21479)

— 2023-02-06 —

Krugo D: When will the TON BaseChain start sharding?

Daniil: It can shard already (reply to 21482)

Krugo D: Yup but it hasn’t yet right? Or has it sharded before during peak throughput moments? (reply to 21483)

Krugo D: Like is there a certain amount of TX/s at which another shard kicks in? (reply to 21484)

Seitaro: It is more like if one shard is loaded more than threshold for some time it splits There was a split (and soon after that the merge) event in January, if I remember correctly somebody minted many nft fast. (reply to 21486)

Krugo D: Thats cool! Would love to read a bit more about this event and if it affected UX at all (reply to 21487)

Queen 🥚: i have issue with #include

Queen 🥚: anyone can help?

Queen 🥚: Dependency not found: file://\c%3A\Users

Queen 🥚: Dependency not found

Alex: I’m not sure, if this problem clear enough for somebody else, but for me it looks like luck of context details: IDE, project structure, what did you try to execute.  Currently it’s just as you said - problem that file was not find by path. (reply to 21491)

Queen 🥚: i am having same error like this (reply to 18383)

Queen 🥚: everything is there (reply to 21493)

Queen 🥚: maybe python issue?

Alex: Is it toncli? (reply to 21494)

Queen 🥚: yes

Queen 🥚: Dependency not found: file://\c%3A\Users\

Queen 🥚: maybe this is the issue

Queen 🥚: it assume wrong start of path

Queen 🥚: not sure how to fix

Alex: I understand. Please, collect your thoughts in one message.  1) If it is about toncli installing: TONCLI has many unique problems(path and permissions) that are difficult to solve remotely. Perhaps someone in the chat faced exactly the same problem. But at the moment, it's usually faster to install toncli via docker than to solve some unique case.   Сan you try docker?  2) If it is about toncli project: The best way to make a valid project structure is to run toncli start wallet (reply to 21498)

Queen 🥚: im using python 3.10 for that, but then when i use python 11

Queen 🥚: i get another error cannot import name 'BitString' from 'bitstring

Queen 🥚: hm (reply to 21503)

Queen 🥚: i can try docker but i need to set it up

Alex: oh, this is familiar issue. (reply to 21505)

Queen 🥚: idea to fix?

Alex: You need to install specific version,   pip install bitstring==3.1.9 (reply to 21509)

Krugo D: Does TON have a lending platform yet?

Alex: What do you mean? TON has so much similar entities, so I can't find best answer. (reply to 21511)

Queen 🥚: thank u, but now it get me the old error of include (reply to 21510)

Krugo D: I see TON has a bunch of AMM’s, but I don’t see anything like AAVE yet for TON (reply to 21512)

Krugo D: Am I missing something?

Queen 🥚: funny that toncli start wallet works fine (reply to 21503)

Alex: I'm not sure, what is AAVE(yes, I googled, but it looks really not clear for me) I can't recognize something similar to TON. Do you mean support for development new products or something else? For example, currently DoraHacks event runs all over the world. (reply to 21515)

Alex: and which command caused a problem? (reply to 21516)

Queen 🥚: he means lending platform where user can put collateral and get some token

Queen 🥚: @Krugo_D no there is not but probably aave will get in soon

RocketMan: for now, there is no lending platform in production

Queen 🥚: the one you gave me (reply to 21518)

Queen 🥚: toncli start wallet cd wallet/ toncli deploy -n testnet

Queen 🥚: everything works except building and testing

Queen 🥚: deploying works

Alex: well, it seems like toncli update_libs didn't execute with success. Perhaps. (reply to 21524)

Lucas: Hi,i have some problem,why i have sent TON to another address,but the receiverAddress refund the TON ?

Deniz: I've published a PR for this yesterday @talkol , it's pending approval 🙂  By the way thank you for the great tutorials Tal, they really did bring me up to speed. (reply to 21437)

Igor: hey guys, who can I contact about TON grants?

Behrang: More details needed. At least send the link to this page. (reply to 21527)

&rey: You have sent TON to address in unbounceable mode, and receiver contract is either uninitialized (not deployed) or failed to process the message. (reply to 21527)

talkol: Just remember that if you're writing a dapp (a decentralized app), there's no decent way to rely on an API key because an API key is by definition centralized. This is excellent for development but before the dapp goes to production I recommend that the API Key issue is resolved. (reply to 21461)

talkol: I think sandbox team decided to make another last minute change to the debug api, so let's make sure with them you have the latest version (reply to 21528)

talkol: I want to re-iterate why API keys are conceptually problematic when you're building something decentralized like a dapp.  Lets' say you're building a DEX. Somebody deposits money in the DEX (add liquidity). We want this somebody to be able to withdraw their money at any time in a decentralized way. So access to funds is guaranteed. This is why we're using blockchain.  If your dapp client for the DEX relies on an API key in the withdraw flow, you have added a centralized dependency.  This API Key can be placed in the client code. Not a good solution.. since this has a security issue. Anyone can abuse it. API Keys are normally supposed to be secret to prevent abuse of your credentials.  This API key can also be placed in backend, which is what I noticed some dapps are doing in order to hide it. But then you have a new issue that there's a centralized backend dependency for the dapp which isn't ideal either.  The reason we built TON Access is to resolve this issue. (reply to 21532)

0xyanshu d/acc: Hey TON Devs, we're hosting #TON RPC to make your lives a little easier!

0xyanshu d/acc: https://twitter.com/luganodes/status/1622548624424194054?s=20&t=aOoct9aOwK9AjWs53KQ4tw

tansy: hey guys，anyone know what is the mistake“compute phase 402” ？

ᅠ ᅠ ᅠ ᅠ: Hi guys! I am trying to send Jettons in Python and I keep getting the same error (the last one is https://tonapi.io/account/EQDD0Xn1k_iSi636YquW8mUDLuFH7_eATZyZ71fTe310zOhk ) tonsdk library Code: https://pastebin.com/FiUzVKLX I get Seqno via https://tonapi.io/v1/wallet/getSeqno  What am I doing wrong? Is anyone has ready examples of sending jettons on nodejs/python

TON Answers Bot (not AI): What is the difference for @ton-core/ton-emulator and @ton-community/sandbox from Howard  There has a few difference repo, for me, coding in Tact, I just want a easy way to test my contracts code. (Might be test in FunC files is fine)  What I know/notice are these three: https://github.com/ton-core/ton-emulator https://github.com/ton-community/sandbox https://github.com/ton-community/ton-contract-executor   - Then what is the difference?  - How I can check the variable/status in the contract easily?  🔗 Answer on TON Overflow

Howard: do you have test-net can try out? (reply to 21538)

Seitaro: The ton-emulator and the sandbox implement very similar features, however Tact is most likely more convenient to use with the ton-emulator as it was made by the same developer and more integration examples can be expected. Both ton-emulator and sandbox allows to emulate single transaction as well as chains of transaction for integration tests. In contrast ton-contract-executor (which was made almost a year before alternatives) only allows to emulate ComputationPhase of a single transaction (important, but not the only phase of the transaction). So it is recommended to use ton-emulator/sandbox instead of ton-contract-executor (reply to 21542)

Howard: Sorry, I just deleted the question since I think I can ask a better one.   But thanks for your suggestion! (reply to 21544)

&rey: You are trying to send jettons from root contract instead of minting them. (reply to 21540)

ᅠ ᅠ ᅠ ᅠ: I want to send from wallet, not to mint (reply to 21547)

&rey: You need to direct your request to your jetton wallet, then. For this example, it's EQDd0ljxhzXAOz4QaEMBQ5PwhWrlBU96mck0sXlHQK_bJ4vb. Jetton wallet address can be obtained through get_wallet_address method on jetton root contract. (reply to 21548)

ᅠ ᅠ ᅠ ᅠ: oooohhh thank you very much! I'll try

&rey: In short: jetton balances are stored in separate contracts for each user so that sharding becomes effective. You may want to read more at https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons. (reply to 21550)

TON Answers Bot (not AI): How difficult is it to transfer a Solidity project to TON? from Telegram Chat Import  We have a project written in Solidity. How much effort would it take to move such a project to TON? Does it mean a total rewrite from scratch in FunC, or is it simpler than that?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to switch the TON Wallet browser extension to testnet? from Telegram Chat Import  Among different TON wallets there is a browser extension simply called "TON Wallet": https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd  I can use it with a regular mainnet wallet but I've heard that it also supports testnet. How to switch it from mainnet to testnet?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/79493   🔗 Answer on TON Overflow

Emilia: I had the same question for some time. I cannot understand why the official explorers https://ton.app/explorers do not provide them. Tonapi in particular has an API without this basic data. The only explorer that provides it is https://tontech.io/api/status. Very very strange. (reply to 1616)

TON Answers Bot (not AI): How to get all the active TON wallets addresses? from Telegram Chat Import  I would like to make a list of all the active TON wallets. Since all the information on blockchain is public and can be seen in explorers, theoretically it is possible. But is there a way to do it programmatically using some kind of API?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/79980   🔗 Answer on TON Overflow

0xyanshu d/acc: Hey Howard, no we do not, as we’re not a protocol or a chain. We are a institutional grade staking service provider! (reply to 21543)

0xyanshu d/acc: We run validator nodes for PoS blockchains, (currently are the largest validator on polygon)

matthew: Maybe somebody saw error while trying deploy storage contract storage-provider.fc:7:40: error: `;` expected instead of identifier `torage-contract-code`   cell storage_contract_code() asm """ "storage-contract-code.boc" file>B B>boc PUSHREF “””;

TON Answers Bot (not AI): Is there 'float' in FunC? from Telegram Chat Import  Do I get it right that there is no implementation of a floating-point numbers type such as float in FunC?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/78960   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How high are the fines for validators? from Telegram Chat Import  Validators should have great network connection and high performance since they are responsible for the network reliability. And if they are unavailable, they risk being fined for that. But how exactly are those fines calculated and how high can they be? What happens if the validator has a network outage or it's hardware can't keep up?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/78065   🔗 Answer on TON Overflow

matthew: Guys, trying to deploy storage smart contract .boc file and have this error. Somebody saw this error   [ 1][t 2][2023-02-06 21:17:19.512192702][lite-client.cpp:1154][!testnode]       sending query from file storage-provider-code.boc [ 1][t 2][2023-02-06 21:17:19.560744820][lite-client.cpp:153][!testnode]        liteserver error: [Error : 0 : cannot apply external message to current state : failed to parse external message external message must begin with ext_in_msg_info$10]

— 2023-02-07 —

Lucas: https://tonscan.org/address/EQCVuwSIBGJU0fY4Waw4K2kakJAMayY-E4COTv-L3pfTNVgs    here is my test address link (reply to 21530)

Lucas: https://tonscan.org/address/EQCVuwSIBGJU0fY4Waw4K2kakJAMayY-E4COTv-L3pfTNVgs  here is my test address link,the receiver address is inactive  but can receive TON (reply to 21531)

Filiberto: can i delete an nft from a collection?

Filiberto: or can i delete a collection?

Feliciss: How to host TON site in TON Storage?

Feliciss: May I ask if this tool https://github.com/ton-utils/reverse-proxy works as same for the TON site hosting in TON storage? (reply to 21416)

Tim: no

Feliciss: I tried to modify it to accept hosting in TON Storage, but I found some of the repos on it are close-sourced. (reply to 21571)

Filiberto: Same question (reply to 21569)

Behrang: Looks like you've fixed it recently. Right? (reply to 21565)

Lucas: yes , thanks for supprot (reply to 21574)

Jeff: Hello guys, I'm new to TON. I wonder which is the best practice for creating and executing a smart contracts with wrapper class in typescript? In some examples like ton-onboarding-challenge or getgems, it implements Queries for building msgBody. Other examples, like ton tutorial-2 or examples in the sandbox, created wrapper classes that implement the Contract interface and put messaging methods inside of it. Which way is the latest and recommended way? I guess the latter. Is it?

User<5983133190>: His address future

Filiberto: How to host TON site in TON Storage?

Anand: Hi, can I create multiple wallets/accounts to same mnemonic using browser waller extension? https://wallet.ton.org/?testnet=true

Anand: Is there an IDE like Remix for TON contracts deployment and interaction with getters setters yet?? If not, anything similar to it under development? I know about blueprints

elephan: Ton development is professional, it is not easy for beginners. (reply to 21583)

Anand: Why are Getgems's marketplace contracts not verified yet? Any specific reason? I know their contracts are public but still not verified

LiteCute: For security reasons (reply to 21585)

LiteCute: When it's verified, it makes it vulnerable to attacks (reply to 21585)

Tim: 😂😂😂 (reply to 21587)

elephan: Hmm. I don't think so. If so, this is very bad for project. I think that's because of competitors. (reply to 21587)

elephan: And also, smart contract quality.

Anand: Very bold statement 😉 (reply to 21587)

Tim: You can verify them by yourself. verifier is pretty young in contrast to Getgems contracts

LiteCute: All you need to check is the Audit report (reply to 21589)

Anand: Do we have the Audit report public yet? for Getgems contracts

LiteCute: That's what you should check (reply to 21594)

Anand: Okay I thought you might have reviewed already since you were making comments on its vulnerability. Np

Slava: I am currently working on a blockchain config with technical parameters.  Tell me, what are 7, 8, 9, 14, 18 parameters for?

Slava: I create an explanation (article) of each parameter and it is important to describe everything in detail

&rey: As far as I remember, parameter 9 ensures that some config parameters are always present and cannot be removed by proposal unless parameter 9 is changed before. (reply to 21597)

&rey: 14 — base reward given to validator creating block. (reply to 21597)

&rey: 18 — storage fee parameters, according to https://ton.org/docs/develop/smart-contracts/fees (reply to 21597)

Vali | QS: Have a look at block.tlb for the description of each config params

Ala: Hello I'm using Manjaro as OS and I want to install the fift and func executables but there is only Ubuntu and Debian executables !!

Ruslan: Hello, you can build it from sources: https://ton.org/docs/develop/howto/compile (reply to 21603)

Ruslan: Here is a list of required libraries: https://github.com/kdimentionaltree/ton-builder/blob/ef680808cc400276ac8e9fc8da1d43b5db36d5d5/amd64.Dockerfile#L6

Ala: Thank you 😊 (reply to 21604)

sajjad: Hello friends, do you know someone outside of Iran who can buy us a server to bypass filtering?

Mohammad Javad: why not just usign crypto servers sellers ? (reply to 21607)

sajjad: For example, which one? Do you have a name?🤔 (reply to 21608)

Slava: For which cases is one of the parameters used: normal and critical?  https://explorer.toncoin.org/config (reply to 21597)

&rey: Critical configuration is used for blockchain parameters specified in param 10. They require more voting rounds to get changed. Also, I've heard somewhere that these parameters require approval from 3/4 of validators by stake instead of from 2/3. (reply to 21610)

&rey: Capabilities are described in code. https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/ton/ton-types.h#L54 (reply to 21597)

Andrey: what is the difference between main validators and common validators?

&rey: I think main validators are those working with masterchain, though I'm not exactly sure. Other validators may only work with shardchains. (reply to 21614)

Andrey: Sounds good (reply to 21615)

PlanL: Is there any tutorial for pyTON lib?

PlanL: I want to use Python instead of TS.

User: https://pypi.org/project/ton/ (reply to 21617)

Slava: API key can be tied to a domain name using CORS. And there is no way to actually spoof a domain name besides running locally. Honestly, I don't see any problems with using the API keys. The principal questions is the purpose of using them. And right now they are used primarily for RPS throttling, which should be fine. And if we talk about the TonCenter per se — we've always said that if you are running in production you should start your own instance of the API server (it won't require an API key). Public TC hosted by the Foundation is just for learning/development/testing purposes. (reply to 21534)

TON Answers Bot (not AI): Where is the wallet contract source code? from Telegram Chat Import  I would like to take a look at the source code of wallet contracts (wallet v3 and v4). As far as I understand, both these contracts are open source, but where exactly is their code located? TON ecosystem is so vast it it not always obvious what's where.  ---  > This question was imported from Telegram Chat: https://t.me/tondev/79201   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Can I use IPFS for hosting TON NFT images? from Telegram Chat Import  What protocols are supported by the "image" field in the NFT metadata? Can I use ipfs://, or is it limited to http:// and https:// ?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/79491  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there a way to decompile Fift code back to the FunC code? from Telegram Chat Import  It is well known that code written in FunC gets compiled to the Fift language (which is more low-level). But is there a way to go back and turn Fift code file back into a FunC code file?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/81459   🔗 Answer on TON Overflow

TON Answers Bot (not AI): What open source TON projects is it useful to explore for a new developer? from Telegram Chat Import  I am new to the TON ecosystem and for now I lack understanding how this whole thing works. I would like to learn by looking into the code of some successful open source TON projects. Are there some specific essential projects that would be the most useful?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/84168   🔗 Answer on TON Overflow

Nati: answers.ton.org is really funky on mobile, I'm having rather a hard time trying to answer a question.  Selecting text, moving the cursor and even deleting words is glitching in all sorts of ways 😅

Slava: It's weird trying to do this on mobile in the first place :) (reply to 21630)

Eugene: Let's mention @talkol here in case he'd have an idea what might be done about that :) (reply to 21630)

TON Answers Bot (not AI): Is it possible to change a deployed smart contract in TON? from Telegram Chat Import  Blockchains are considered "append-only" and immutable. But I've heard smart contracts in TON can change their own code. So, is it possible for a contract code to be changed after it was deployed and how does that work?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/84920   🔗 Answer on TON Overflow

Ahmet Said: trying to use  toncli and create simple_storage contract but when i try to use "toncli run_tests" i got this error so how can i resolve this problem ? or maybe i have problem with the installation of the cli ?

Nati: I'm not always by the computer 🙁  Seems like a reasonable thing, maybe it's just me 😅 (reply to 21631)

talkol: Running your own instance of the API gateway is a very bad idea for dapps. This is definitely a centralized dependency. If your server is down because you forgot to pay your AWS bill, all your users’ funds will be stuck inside the DEX and they can’t get them out.  Connecting API keys to domain is also a bad idea. It doesn’t solve any abuse issues. If the API Key is client side, I can easily create a malicious script that will make thousands of API calls using your key until your key is shut down for over use. (reply to 21622)

talkol: There’s a very simple test if your dapp client is decentralized or not. Whether any user can fork it and run it completely by themselves uninterrupted.  If the entire frontend runs client-side on GitHub pages, forking it takes one click. And assuming your don’t have a backend server and you use an RPC service that doesn’t require an API Key, everything will just work.

talkol: I assume it’s glitchy because of CSS. If you can edit and fix the CSS on Chrome dev mode when simulating a mobile device, send us the CSS fix and we’ll upload it. (reply to 21632)

𝐴𝑅𝐸𝐹 𝑆𝑆: toncoin have price api?

— 2023-02-08 —

Slava: > Running your own instance of the API gateway is a very bad idea for dapps. This is definitely a centralized dependency. If your server is down because you forgot to pay your AWS bill, all your users’ funds will be stuck inside the DEX and they can’t get them out.  Well, it needs to be hosted by someone. I hope in the future we will have HTTP API available directly on TON nodes. And I guess your service is also solving this problem, which is cool and all. We didn't have it until recently.  > Connecting API keys to domain is also a bad idea. It doesn’t solve any abuse issues. If the API Key is client side, I can easily create a malicious script that will make thousands of API calls using your key until your key is shut down for over use.  Again, this wasn't designed to be used for production and mission critical applications. We've been always saying that this is for learning/testing/development purposes :) (reply to 21637)

Slava: Yeah, it looks like the current editor is not very good. Browser spellcheck is also not working inside of it. I guess it could be more involving to fix this than updating the CSS :) (reply to 21639)

Andrey: unfortunately, the vast majority of projects on ton are used "for testing" not for testing, but in production cases (reply to 21643)

Lucas: Hi,when i use toncenter-http-api to estimateTxFee here is my data curl -X 'POST' \   'https://toncenter.com/api/v2/estimateFee' \   -H 'accept: application/json' \   -H 'Content-Type: application/json' \   -d '{   "address": "0:95bb0488046254d1f63859ac382b691a90900c6b263e13808e4eff8bde97d335",   "body": "te6cckEBAgEAqQAB4YgBK3YJEAjEqaPscLNYcFbSNSEgGNZMfCcBHJ3/F70vpmoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU1NGLsfGKV4AAAAsAAcAQBmQgBAy0c0WO1ILCOcMIqtGA9huH8nqza1FSTgTSW2qEOS5RzEtAAAAAAAAAAAAAAAAAAAQvY+JQ==",   "init_code": "",   "init_data": "",   "ignore_chksig": true }'  why in result the "gas_feee"&"fwd_fee" always is 0?  and the result deviated from the actual cost

Lucas: {   "ok": true,   "result": {     "@type": "query.fees",     "source_fees": {       "@type": "fees",       "in_fwd_fee": 2509000,       "storage_fee": 349,       "gas_fee": 0,       "fwd_fee": 0     },     "destination_fees": [],     "@extra": "1675826367.2845695:3:0.8782995064149871"   } }

talkol: What annoyed me on mobile is that some words are cut in the middle :) (reply to 21644)

Whitey: Good morning! I have one more question, do you help me? Can I deploy smart contract with my own specific key pair (priv/pub)?

Rinat | ZilPay (Will not Call or DM you): hello, everyone, someone know how i can buy and active virtual phone number without web2.0 tonkeeper wallet???

Rinat | ZilPay (Will not Call or DM you): i just don't want use centralized, which collect your data, this is not anonymous

Daniil: What's the point in being scared by centralized wallet if you'll use the number in centralized Telegram anyway? (reply to 21652)

talkol: what do you mean exactly? is this a general smart contract you're trying to deploy or a wallet? (reply to 21650)

talkol: There are other wallets you can use, like https://www.openmask.app You can even run some of them yourself entirely so they're not based on any third party and run fully client-side (reply to 21652)

Rinat | ZilPay (Will not Call or DM you): i want to be anonymous in centralized system, buy a virtual number the best way, but there only one way to buy via worse wallet tonkeeper which track and collect all users data (reply to 21653)

Rinat | ZilPay (Will not Call or DM you): yes, this is cool wallet but there no way to connect it ((( (reply to 21655)

altoshi: connect to getgems.io via TonHub > buy Telegram Numbers from secondary market. (reply to 21651)

Daniil: But he won't be able to use it without Fragment (reply to 21658)

Daniil: Codes are arriving there

&rey: Is there a proof that Tonkeeper tracks everybody? Other than existence of (public!) tonapi.io. (reply to 21656)

Andrew: define "tracks"

Daniil: Blockchain is a transparent system itself. Everybody can see how you bought that number

Rinat | ZilPay (Will not Call or DM you): they are using centralized server so we don't know what hapends there, so this not possible to trust. (reply to 21661)

Rinat | ZilPay (Will not Call or DM you): wtf do you what hapends after DNS resolve IP? you cannot see and proof the right build of the server (reply to 21661)

Daniil: To send a transaction, your wallet needs to send it to some node first (reply to 21666)

Rinat | ZilPay (Will not Call or DM you): i think ton is blockchain which use p2p protocol and has a lot of others nodes (reply to 21667)

Rinat | ZilPay (Will not Call or DM you): you can see the ip address of the any node and send your transactions (reply to 21667)

Daniil: Wallet needs to send it to some specific one (maybe randomly chosen) (reply to 21668)

Daniil: Yes (reply to 21669)

Daniil: But what's the difference from using the tonkeeper's one?

Daniil: Any node can "track" you the same way

Rinat | ZilPay (Will not Call or DM you): yes, but tonkeeper use a server for connect and send message through this server, so they know any message and what users doing (reply to 21670)

Rinat | ZilPay (Will not Call or DM you): they use themselves server for connect for dapps

Rinat | ZilPay (Will not Call or DM you): under cloudflare 😂😂😂😂

Daniil: Some node can "track" you and associate with your wallet public key. Then the node will be able to just see what transactions are you performing with it

Rinat | ZilPay (Will not Call or DM you): what if the server under ddos? what if cloudflare down? what is server is down?

Daniil: Then tonkeeper will be useless for some time (reply to 21678)

Daniil: What if infura goes down? What will happen with most Ethereum wallets?

Rinat | ZilPay (Will not Call or DM you): i just change to other node (reply to 21680)

Daniil: Most users don't even know what is a node (reply to 21681)

Rinat | ZilPay (Will not Call or DM you): that's right, everything will just stop working for them (reply to 21682)

Daniil: Using centralized and fixed servers provides better UX for regular users. If you need some extra "privacy" you can even host your own node and use it through some TOR networks + anything you want

Rinat | ZilPay (Will not Call or DM you): but smart pl can possible to change node and continue work

Rinat | ZilPay (Will not Call or DM you): not right, possible to make the system like TOX, or Matrix this is decentralized system works very well (reply to 21684)

Rinat | ZilPay (Will not Call or DM you): I don't see any reason to make centralized systems in the blockchain! This is disrespectful to the creator of the technology

Ama ✨ lux8.net: what solution do you think will work better ?

Daniil: Every user needs to have a public IP to use such decentralized systems (reply to 21686)

Rinat | ZilPay (Will not Call or DM you): remove centrolized server and add browser it self like works openmask wallet via messaging directly to wallet (reply to 21688)

Rinat | ZilPay (Will not Call or DM you): in the ton a lot of public nodes they can use it, without any centrolized server which controlled by some humans (reply to 21689)

Daniil: These nodes are controlled by "some humans" (reply to 21691)

Rinat | ZilPay (Will not Call or DM you): if you dont like the node you can launch yourself node and use it (reply to 21692)

Daniil: I just said that above few minutes ago (reply to 21693)

Rinat | ZilPay (Will not Call or DM you): no you said that, private server from tonkeeper is normal (reply to 21694)

Daniil: ^ (reply to 21684)

Rinat | ZilPay (Will not Call or DM you): i didn't say anything about TON itself, only tonkeeper (reply to 21696)

Daniil: Tonkeeper provides good UX for users who don't know what is a blockchain (reply to 21697)

Rinat | ZilPay (Will not Call or DM you): tonkeeper is centrolized and is not trusted wallet, because they using centrolzied server under centrolized DNS services

Daniil: Telegram is centralized and is not trusted messenger. But you use it anyway (reply to 21699)

Daniil: Google is decentralized but you still use it every day. Even if you use something like duckduckgo there's still no guarantee that they don't track you

Daniil: Being obsessed with privacy in our world is strange

Rinat | ZilPay (Will not Call or DM you): Google is centrolized (reply to 21700)

Daniil: If someone will really need to find you, he'll be able to do that

Rinat | ZilPay (Will not Call or DM you): no, if you do right (reply to 21704)

Rinat | ZilPay (Will not Call or DM you): in this approach, then anonymity is not needed at all 😂😂😂 (reply to 21704)

Rinat | ZilPay (Will not Call or DM you): apple also has good UI/UX but it leaks data about you to everyone (reply to 21698)

Daniil: You didn't do it right then. Your privacy is already broken for this tg account (reply to 21705)

Rinat | ZilPay (Will not Call or DM you): I'm not hiding from this account, you can always find me and my activity (reply to 21708)

Daniil: And most users aren't hiding from their wallets (reply to 21709)

Daniil: I don't understand what's your problem with tonkeeper. Just don't use it if you don't like it

Daniil: Run your own node, use some TOR networks, proxies etc. Generate a keypair manually and interact with wallet through your node

Rinat | ZilPay (Will not Call or DM you): but on fragment is not possible to connect other wallet! (reply to 21712)

Daniil: Fragment & Telegram are centralized (reply to 21713)

Daniil: ^ (reply to 21653)

Spite: Should I tell him that any decentralized network is built inside the Internet, which is centralized in its structure?) (reply to 21708)

Rinat | ZilPay (Will not Call or DM you): i know, this just a website, but in the way onle TON itself decentrolized (reply to 21714)

Rinat | ZilPay (Will not Call or DM you): wallet should be also decentrolized (reply to 21714)

Rinat | ZilPay (Will not Call or DM you): internet is decentrolized WTF (reply to 21716)

Daniil: build your own decentralized wallet. You can even apply for a grant then and maybe it'll be successful (reply to 21718)

Spite: Especially the allocation of a range of IP addresses, without which you will not get access to the Internet (reply to 21719)

Rinat | ZilPay (Will not Call or DM you): for what? if we already has open mask? (reply to 21720)

Daniil: Then just use it (reply to 21722)

Rinat | ZilPay (Will not Call or DM you): I am not a teacher and I will not explain why you are wrong (reply to 21721)

Rinat | ZilPay (Will not Call or DM you): fragment is not support it (reply to 21723)

&rey: Especially certificates system and DNS registration. Though, I think this becomes offtop. ⛔️ (reply to 21719)

Daniil: Fragment is centralized and it will track you. Telegram too. Using a "private" and "secure" wallet won't help you (reply to 21726)

&rey: About non-Tonkeeper connection: nothing stops you from feeding the page with valid wallet connection info. (reply to 21726)

Rinat | ZilPay (Will not Call or DM you): no one forces you to use certificates and registrations DNS, this is just a it's just a layer on top of the internet: it's called a protocol (reply to 21727)

Rinat | ZilPay (Will not Call or DM you): he can track at least 10 times if I give him fake data (reply to 21728)

Vahid: Hacking/Becoming The Hacker 1st Edition (2019).pdf at master · dthroner/Hacking · GitHub https://github.com/dthroner/Hacking/blob/master/Becoming%20The%20Hacker%201st%20Edition%20(2019).pdf

Ste: Hi @admin, may I send an important link pertaining to a community initiative?

Ste: 💎Ciao TON community. Here a group of enthusiasts from the official Italian group who want to support our comrade Emilia in shedding light on the tokenomics optimization proposal. We would like to get this letter of questions to the TON foundation, so we ask you to read it and in case you support it we would like you to put a nice reaction to the message and share it, especially if you have contacts in Foundation, being the final recipient.  To make sure the message gets through, we also propose to send the link (https://telegra.ph/A-Community-Proposal-for-Tokenomics-Optimization-02-07) as a message of a transaction to TON Foundation wallets (EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N EQAhE3sLxHZpsyZ_HecMuwzvXHKLjYx4kEUehhOy2JmCcHCT)  Grazie mille!💎

Я: '''raise ValueError(f"😥 No address_text found in {contract.address}") ValueError: 😥 No address_text found in /home/fera/.config/toncli/wallet/build/contract_address ''' Halp me(toncli dont work)

Я: help*

Я: please (reply to 21736)

Alex: You should deploy your contract, before trying to get its address. (reply to 21736)

Howard: Does https://dns.ton.org/ have in test-net version? No?

Andrew: https://dns.ton.org/?testnet=true (reply to 21741)

Howard: oh!! thanks!! was not thinking it is like this hahaha

Ahmet Said: even testnet has bidding time how can we bypass it ? i mean even 160 test ton high amount to farm xddd (reply to 21743)

&rey: Couldn't you take a longer domain name for testing? (reply to 21744)

Я: Excuse me, do tou mean command '''toncli deploy'''??If not, please tell me (reply to 21740)

Ahmet Said: yep u r right  but what about auction time ? is it way to bypass the time ? (reply to 21745)

&rey: I've heard the auction time is significantly smaller. Maybe, that was changed, or dns.ton.org has a glitch. (reply to 21747)

Ahmet Said: yes u r right .Its 3 minutes for auction ;probably its template from main net (reply to 21748)

Я: Эта ошибка появляется при вызове данной команды ((( про которую я говорил ниже (reply to 21740)

Я: Please click translate in telegram.My english very bad (reply to 21751)

Alex: ru chat https://t.me/tondev (reply to 21751)

Я: Thx (reply to 21753)

Ahmet Said: why i get this error ? when i click on github repo it gives 404 error

TON Answers Bot (not AI): How to calculate sine in Fift? from Telegram Chat Import  In different languages there are methods like Math.sin() in Java that return the sine of an angle. How can I calculate such value using Fift?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/50379  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Could TON appear in Metamask in the future? from Telegram Chat Import  Is there a possibility that TON will be added to Metamask later? Or there are some technical / non-technical reasons preventing that from happening?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/50535   🔗 Answer on TON Overflow

TON Answers Bot (not AI): What is a regular expression to check TON addresses? from Telegram Chat Import  Probably the TON community has already crafted the best regular expression for validating TON addresses. In fact, there could be even two expressions: for the raw (hex) and user-friendly representations. What are they?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/52663  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there an Ethereum Remix alternative in the TON ecosystem? from Telegram Chat Import  In the Ethereum world there is remix.ethereum.org — a browser-based IDE which lets you try out your contracts instantly. Is there anything like that in the TON ecosystem?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/62623    🔗 Answer on TON Overflow

User<6157607206>: I can't open a TON account, can someone help me? please...

Slava: What exactly can’t you do?

Andrey: @tvorogme (reply to 21756)

— 2023-02-09 —

TON Answers Bot (not AI): Is there any better way monitoring the new NFT Item being minted? from Howard  I am trying to display data on my front-end to help users comprehend how the smart contract works instantly.  To achieve that, we can call RPC from TonCenterAPI to get net_item_index on the Collection Contract (followed the TEP62).  But the problem is, if I have 100+ users (customers) refreshing my website, then it's impossible for me to call an API for 100 times to get on-chain data. I must store the data in a database. Or, maybe there is something like TheGraph?   Reference: https://answers.ton.org/question/1528335026733715456/thegraph-and-chainlink-equivalent-for-ton-network#post-1531224553609498624 https://docs.orbs.network/v3/orbs-lambda/example-use-cases   🔗 Answer on TON Overflow

Ahmet Said: pretty good tutorials  https://asaidoguz.github.io/first-ton-app/

Andrey: Filesystem permissions? (reply to 21756)

Tim: Newton repo dead (reply to 21768)

Alexey: hi, please how can i find emails on telegram org domain and/or telegram developers contact/email?

Howard: is there the API I can use like Alchemy to fetch all the NFT(or maybe filter with the specific collection I want to show) on a wallet address?

RocketMan: tonapi.io (reply to 21771)

Howard: yeh sir! 🫡 (reply to 21772)

Andrey: {   account_states(     parsed_nft_collection_address_workchain: 0     parsed_nft_collection_address_address: "0E41DC1DC3C9067ED24248580E12B3359818D83DEE0304FABCF80845EAFAFDB2"   ) {     parsed_nft_content_offchain_url     address     workchain     parsed_nft_owner_address_address     parsed_nft_owner_address_workchain   } }   BTW you can load same info from dton.io (but we haven’t got documentation yet) (reply to 21773)

Rahul: I am trying to deploy code-boc with the delab-team/connect  but confused between whats are the initial parameters are required to make contract active

Anand: Hi, do we have any example or tutorials on to transfer jettons from wallet contract to any logic contract or vice-versa?

Daniil: Just send a message to the jetton wallet contract. Check the standard for specification (reply to 21777)

Daniil: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md

RJ: @malev can you please address this to someone can who can help out? (reply to 21775)

Daniil: You need the stateinit (reply to 21776)

Rahul: I tried but it require string value to be passed (reply to 21781)

Daniil: It is explained in a comment (reply to 21782)

Daniil: base64 string

Daniil: Use tonweb or ton.js to form a StateInit cell and just call toBoc method of it

Rahul: Am I missing something

Daniil: Looks correct (reply to 21786)

Daniil: What response do you get?

Rahul: contract is still in inactive state

Daniil: Was the transaction successful? (reply to 21790)

Rahul: yes

Rahul: https://testnet.tonscan.org/address/EQAokFRGcw4XE0h07lTU7U7JKpphpoyOBXBcSWDanFS8QAex

Daniil: Can you send the contract address you're trying deploy?

Rahul: _contractAddress EQAokFRGcw4XE0h07lTU7U7JKpphpoyOBXBcSWDanFS8QAex

Daniil: I see "init:nothing" there

Daniil: Looks like it didn't attach the stateinit , hm

Rahul: Could you help with it, I may be missing some minor details.

Tim: are you sure it's correct data

Tim: that'll mean all your contracts have same address

Rahul: yes, just was trying to figure out with different initial values also. I am using counter example mentioned in   https://ton-community.github.io/tutorials/02-contract/

Tim: await provider.internal(via, {       value: "0.01", // send 0.01 TON to contract for rent       bounce: false     });

Rahul: yes if we will provide same data for same codebase, then address will be the same

Tim: you also send too little money

Rahul: okay

Rahul: Let me check

Daniil: But Rahul wants to deploy via delab connect (reply to 21803)

Tim: it's not about that (reply to 21808)

Rahul: we can send amount with dlab also

Rahul: Thank you @Gusarich @TrueCarry  Now it's working. https://testnet.tonscan.org/address/EQAb6R_Xb16znnoPeEYABghfgkFQzAK3XD5uxtl8jwSLnYWr

User<5871970700>: hello, who can add me in @tondev? (i mean owner or some moderator)

Andrew: you were banned there, and rightfully so

Mark Okhman on TON: Hosting a Technical Q&A session (FunC, TypeScript stack, Web) today 7pm CET.  To join it, please RSVP here and you will see the link on the event page once we're ready to go  FYI, there will be lot's of online sessions in upcoming days and weeks, thanks DoraHacks and TF for such a great flow of new people on TON 😍  To keep up with those - stay tuned on TON&Co. events list (forwarded from Mark Okhman on TON)

James Truong: I am trying to deploy address has uninitialized state to update state to active before transfer token Ton test net. But I got the arror at provider.sendBoc(boc). Has anyone encountered this problem? Can you give me some suggestions?

James Truong: this is error I got it

James Truong: "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 286C11BDC7212D216D5D366C4F7EAD306B5C19F597DE1E70152AE3FFED224D91:\nexitcode=33, steps=33, gas_used=0\nVM Log (truncated):\n...OW\nexecute XCHG s1,s3\nexecute LEQ\nexecute THROWIF 35\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute ENDS\nexecute XCPU s3,s2\nexecute EQUAL\nexecute THROWIFNOT 33\ndefault exception handler, terminating vm with exit code 33\n"

Haider: Hi. What is the difference between v3 and v4 wallet accounts? I have a mnemonic that works for both v3 and v4 account. I do not understand how tonweb and tonwallet know which account to open

Andrew: do we have a decentralized TON usd price source?

Daniil: https://ton.org/docs/participate/wallets/contracts#wallet-v4 (reply to 21821)

Haider: Thanks (reply to 21823)

Ahmet Said: cant connect to repo i think and what the testnet.json contain ? any example for it  ?  so maybe i can create myself (reply to 21768)

Andrey: https://ton.org/testnet-global.config.json (reply to 21825)

Ahmet Said: thanks Andrey it worked  i changed the json file name into "testnet.json" (reply to 21826)

Rahul: How can we resolve it? I didn't find an appropriate solution.

Andrew: this error occurs when you reload the page before the wallet responds with transaction result, because the result becomes irrelevant (reply to 21829)

Rahul: I am getting this error after a successful transaction from Tonkeeper wallet. I didn't do any reload. (reply to 21830)

Andrew: weird, consider creating an issue on github then (reply to 21831)

Rahul: Sure

Shawn: Hey everyone 👋  Orbs is hosting the London in person workshop on February 25-26  as part of the Hack-a-TON x Dorahacks event 🇬🇧 -

Shawn: This workshop is an excellent opportunity for developers who are not already familiar with TON to learn the basics of the open network, Func, and build something cool and have a chance to earn prize money. Working space, food, drinks, vibes, and mentors are on us 🍻  📍 Location - DLT HUB 3 Muirfield Crescent #2nd Floor London E14 9SZ United Kingdom  If you're in the area, please RSVP, either as an individual looking to form a team or someone who's already submitted their project. We're accepting developers of all levels and stages   DMs are open if anyone has questions or wants to get in touch   https://www.eventbrite.com/e/first-ever-ton-telegram-hackathon-london-tickets-518678089127?aff=ebdssbdestsearch

Shawn: Also Tal Kol will be there to provide mentorships, definitely improving the prospects of a winning team coming out of the area  👀

💻S: Hello Tal Kol  İn react app how can I call impure functions with connected toonkeeper wallet?  Can u give me some examples or documents?

Dmitry: Hello. im trying to create Cell. Want to write cell.bits.writeUint(g, 64); But got an error: bitLength is too small for number, got number=3305542420456,bitLength=32

&rey: Maybe, the error originates in some other line of code? (reply to 21840)

Dmitry: Right. Forget to note. I call wallet.transfer method. and put this cell inside payload. and there i've got an error (reply to 21841)

&rey: You've passed invalid operation seqno. (reply to 21843)

Dmitry: holly (reply to 21844)

Dmitry: right. thanks man

&rey: By the way, thank you for sharing screenshot of error — it showed the exact line of error, pointing at message.bits.writeUint(seqno, 32);. (reply to 21843)

Mark Okhman on TON: Hey guys, starting a Technical Q&A session   https://join.toncompany.org/c/onboarding-events/technical-q-a-func-typescript-web

TON Answers Bot (not AI): What does the trust in oracles rely on in TON? from Telegram Chat Import  To interact with the outside world blockchains rely on oracles. But I see a problem here. Let's say we have a betting contract that lets users place their bets during sports events. Can't the oracles instead of the right answers tell the ones that will be profitable for them? To have trustless transactions we have a consensus protocol and "fishermen" to stop the validators from fraudulent actions, but what stops the oracles?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/44643   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there something like "try" in FunC? from Telegram Chat Import  In general-purpose languages there often is some form of try. Is there anything like that in FunC I could use to validate data in msg_body?  > This question was imported from Telegram Chat https://t.me/tondev/45058   🔗 Answer on TON Overflow

Mark Okhman on TON: I've published our today's Technical Q&A 🚀  Thank you guys! We've had 11 people today!  https://www.youtube.com/watch?v=tD-s5Ui9O74   Don't miss out by following this list of events, we are going to have a looooooot of those in upcoming weeks. https://join.toncompany.org/c/onboarding-events/?sort=asc (reply to 21848)

TON Answers Bot (not AI): What to choose for running a TON node? from Telegram Chat Import  I would like to become a part of TON blockchain and run a full node without becoming a validator. What are good options for this? Do node owners usually rent or own a server? Or just have their own at home? What configuration would be optimal for my use case? What hosting services are good for this and how much can it cost?  > This question was imported from Telegram Chat: https://t.me/tondev/48423   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to extract a list of the largest balances from TON? from Telegram Chat Import  On the Ton Whales website there is a "Top 1000 accounts" list sorted by the balance size: https://tonwhales.com/explorer/top   How exactly such a list can be created? What is the parsing approach?  > This question was imported from Telegram Chat: https://t.me/tondev/49631   🔗 Answer on TON Overflow

User<5934181438>: Hi all 👋 Could anybody explain, how can I know with tonweb and getTransactions that wallet received jetton, it’s jetton wallet and amount?

— 2023-02-10 —

&rey: @Fret124 please stop spamming reactions. As far as I remember, this is against chat rules.

&rey: @slavafomin reaction spam is not ending.

Ruslan: Solved

Mohammad Javad: https://manage.edis.at/whmcs/ (reply to 21609)

aaa: hello， I would like to ask someone to know how to use the 'https://toncenter.com/api/v2' interface to get detailed transaction information through the block

aaa: My purpose is to scan all transactions on the chain by incrementing the block height

Haider: Hi! I am getting this error when deploying my smart contract on mainnet. I cannot figure out the reason  liteserver error: [Error : 0 : cannot apply external message to current state : Failed to unpack account state]

Haider: What does this error mean?

Tim: Probably account not deployed

Daniil: Then you should scan from the latest block(s) to the first one.  prev_blocks can have 2 blocks sometimes (on shards merging) (reply to 21868)

User<5934181438>: I need to accept Jetton in webstore, and I need to understand when it come to the seller's wallet from buyer's wallet. What is best approach to this? (reply to 21862)

aaa: Hi, Daniil, Which api can i use to find its details by tx id? (reply to 21872)

Jeff: How can I get TON coin? I bought TON in Gate.io, but withdrawl is currently not available.

Jeff: gate.io is wrapped ton (reply to 21879)

Jeff: okx is ton (reply to 21879)

Jeff: Ah Cool! Thanks! (reply to 21881)

James Truong: Is there any way i can get the asset tokens of a wallet address guys?

Volodya: You can try https://tonapi.io/swagger-ui  v1/jetton/getBalances (reply to 21884)

James Truong: this is my address: EQB5DER03H1uhKGX6BJh_IWa_zV9MzvH2lcy6t30tZ9k4RSL. Look Look like It's not yetton address ?

Haider: I am getting error code 402 when I am transferring my nft from my wallet address to a contract address.   I cannot find error code 402 in https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes

Alex: You need seek this error code in the smart contract's source. (reply to 21887)

Haider: I looked into the smart code and searched for 402 but there is nothing that is throwing the error code 402

Alex: Did you search here? (reply to 21889)

Haider: Oh. No I didn't. This helps. Thank you

James Truong: Does the Ton version support transfer mutiple tokens in ton network everyone?

&rey: Yes, you need to send several (up to 4 for standard wallet contracts) transfer requests in bulk. Sadly, the last version of TonWeb that I've seen didn't support that. (reply to 21892)

Mirelly: Gente me ajudem a abrir a carteira digital não consigo pois tudo e inglês eu moro no Brasil falo português

Haider: Hi, I have a simple contract where I want to transfer the NFT that it has back to my address: https://dpaste.org/GjhLB  This is the simple tonweb script: https://dpaste.org/ZVmnL  I am getting error code 9. I have been stuck on this specific error for a few hours now. Kindly help

&rey: In contract, you are trying to load a reference from payload. In JS, you store everything in a single cell. (reply to 21895)

Haider: So, I should use in_msg_body directly like this?  var nft_address_arg = in_msg_body~load_msg_addr(); var to = in_msg_body~load_msg_addr();

&rey: Yes, after extracting coins amount as well. (reply to 21897)

Haider: It runs but the owner is not changing in the explorer: https://testnet.tonscan.org/nft/EQCa_Im8bK_87zA1-kf4EXstMxY46lMb-WFkB1oN5HVvZ1MI

Haider: There are no errors

Haider: Just to be sure. This code in the smart contract will transfer the nft (the address that I will provide it with to the "to" account)     var coins = in_msg_body~load_coins();     var nft_address_arg = in_msg_body~load_msg_addr();     var to = in_msg_body~load_msg_addr();          var nft_msg = begin_cell()         .store_uint(0x18, 6)          .store_slice(nft_address_arg)         .store_coins(0)         .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)         .store_uint(op::transfer(), 32)         .store_uint(0, 64)         .store_slice(to)        ;; new_owner_address         .store_slice(to)        ;; response_address         .store_int(0, 1)        ;; empty custom_payload         .store_coins(0)         ;; forward amount to new_owner_address         .store_int(0, 1);       ;; empty forward_payload      send_raw_message(nft_msg.end_cell(), 128 + 32); (reply to 21898)

Haider: Should it be     send_raw_message(nft_msg.end_cell(), 128 + 32); or  send_raw_message(nft_msg.end_cell(), 1);

Haider: Also, should the .store_coins(0) be 0 or some value

&rey: As per https://testnet.ton.cx/address/EQCa_Im8bK_87zA1-kf4EXstMxY46lMb-WFkB1oN5HVvZ1MI, owner has been changed successfully to EQB80WqevHSgbMq-6Lp-jCXK0HqJ9-T0epFV6AVRY4Xn4LL6. (reply to 21900)

Haider: Contract address: EQB80WqevHSgbMq-6Lp-jCXK0HqJ9-T0epFV6AVRY4Xn4LL6  My address: EQDtB6w_tuZ6ioePkkTrtFzBDBU4fs4DWHYTMm7itGwHyufW

Haider: This owner changed when I transferred the NFT from my account to the smart contract

&rey: Well. Your contract requires opcode to be 1, and you are sending message with opcode 0x402faf08 to it.

Haider: So I need to change this line??  .store_uint(op::transfer(), 32)

&rey: I think yes. (reply to 21909)

Haider: I'll try it with 1 like this then .store_uint(op::transfer(), 32) .store_uint(1, 32)

Tim: Don't use 32 without good reason, it destroys contract and makes it harder to debug. (reply to 21903)

Haider: I changed it to 1. It did not work. Is the way I am transferring my NFT to the contract wrong? The ownership changes in the ton-scan. But if I click on the NFTs section for the contract address, I do not see anything:  This is my script for transferring to the smart contract:  https://dpaste.org/tRhdc

Channel<1813266068>: Can I write smart contracts on scratch? (reply to 21914)

Alex: Most recently review and explanation, and about used languages information you can learn from the DoraHacks onboarding video.  It is really compact answer for general questions, I think. (reply to 21916)

Haider: @pcrafter @TrueCarry I have been unable to get it working. No errors but I am unable to transfer it back. Pls help😢 (reply to 21913)

&rey: > But if I click on the NFTs section for the contract address, I do not see anything This can be an explorer issue. (reply to 21913)

Alex: Is it expected behavior, that we see only 1 outgoing message? As I understand "success" message was sent, but (amount - fees) funds didn't come back to the sender, right?  https://testnet.dton.io/a/EQCa_Im8bK_87zA1-kf4EXstMxY46lMb-WFkB1oN5HVvZ1MI (reply to 21933)

TON Answers Bot (not AI): Is there a ternary operator in FunC? from Telegram Chat Import  Many programming languages have a ternary operator, such as booleanExpression ? expression1 : expression2 in Java (if booleanExpression equals true, than expression1 gets executed, if not, than expression2 gets executed). Is there such an operator in FunC? Where in the documentation it is described?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/47869    🔗 Answer on TON Overflow

&rey: As far as I see in your code, you've set TON excesses to be forwarded to receiver wallet (response_address). (reply to 21934)

Alex: Ah, I see. Not my code, it's from here. Thank you! (reply to 21900)

TON Answers Bot (not AI): How to get current TON price programmatically? from Telegram Chat Import  Where is it possible to retrieve current TON coin price in USD? Preferably an open API, not a paid one.    ---  > This question was imported from Telegram Chat: https://t.me/tondev/49132  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Where does ~dump make a dump? from Telegram Chat Import  The TON documentation states that "a variable can be dumped to the debug log by the ~dump function". But where exactly it that log? How can I see it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/50016  🔗 Answer on TON Overflow

talkol: Your wallet is not deployed (reply to 21869)

talkol: You’re probably using the wrong version

TON Answers Bot (not AI): Are there any Java TON libraries? from Telegram Chat Import  I mostly work with Java, so it would be convenient for me to develop on TON using that language. Are there any Java libraries to work with TON?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/54883   🔗 Answer on TON Overflow

Alex: The one option would be to use ton4j (reply to 21942)

User<5772651524>: The one option would be to use ton4j (forwarded from Alex)

Andrey: It's a bot :) (reply to 21943)

Alex: Noticed a bit later) (reply to 21945)

User<5340285733>: Anyone devs looking for team members for hackathon?

User<5772651524>: Get

User<1518952680>: I wonder How can I decode data from toncenter api, for example this: {   "ok": true,   "result": [     {       "@type": "raw.transaction",       "utime": 1674729908,       "data": "te6cckECCQEAAkIAA7V2XeCDoAB2OCM7Zmg1TlDkTNQiXxcw1muLHxnl0maQdRAAAfosULEcPQipIMrs7f11CHmqrbE8xj/BxvPaWVRwZceXkZCEDPywAAH6LCLqXDY9JZtAADRklYuoAQIDAgHgBAUAgnIh1ioYBFDDXmEbwJXzLPRkHYN4AXVn7B08gfHllkqpLqVzXGPPvalAUy9F3t9adetsG74GE/XNvBU9np5Cx2NjASUEV0jXprAQY/K+DgGCiwgYUWGCCAGvaAAZGIQTZSQTrB4n3KS+JlUKFOSgZ4hYANfQK5cMgfA0awAZd4IOgAHY4IztmaDVOUORM1CJfFzDWa4sfGeXSZpB1E16awAGJDboAAA/RYoWI4THpLNowAYBAd8HAKoPin6lAAAAAAAAAABSXzjp4AgBP5o5gQtjmBAl6mz4GXJy8//7/++7+76xaanNi9joFCEAJ/NHMCFscwIEvU2fAy5OXn//f/33f3fWLTU5sXsdAoQAAPdYAMu8EHQADscEZ2zNBqnKHImahEvi5hrNcWPjPLpM0g6jAAMjEIJspIJ1g8T7lJfEyqFCnJQM8QsAGvoFcuGQPgaNTL8KQAYUWGAAAD9FihYjiMeks2h/////h8U/UoAAAAAAAAAAKS+cdPAEAJ/NHMCFscwIEvU2fAzAAJxBAshg4AAAAf/+AAAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDJjF9",          "message": "D4p+pQAAAAAAAAAAUl846eAIAT+aOYELY5gQJeps+BlycvP/+//vu/u+sWmpzYvY6BQhACfzRzAh\nbHMCBL1NnwMuTl5//3/993931i01ObF7HQKEAA==\n"       }, How can one make sense from data propertie and how can I decode message"

TON Answers Bot (not AI): How can I accept TON coins payment on my website? from Telegram Chat Import  Suppose I own a website and it is not a web3 dApp or something, just a regular old centralized one. On that website I take payments and I would like to accept TON coins as a form of payment. What should I do (or read) in order to to that?  🔗 Answer on TON Overflow

Ahmet Said: is there code snippet like "wait until deployment"  in  blueprint ton  like in ether js ``await contract.deployed()`` ?

Andrey: for deployment you need attach StateInit to external message while sending it to smart contract, then check when state of account become in active status

Ahmet Said: how can i do it any code snippet i can use ? (reply to 21952)

Alex: like this? (reply to 21951)

Sam: Hi

Sam: i am sending out nfts

Sam: it still stays in my contract

Sam: https://tonscan.org/address/EQAIcu5WsL3JBGXqQwGY89CiOYsse5KyTBnxX0zn6wS-txk0#transactions

Sam: my code      var to = in_msg_body~load_msg_addr();          var nft_msg = begin_cell()         .store_uint(0x18, 6)          .store_slice(nft_address_arg)         .store_coins(0)         .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)         .store_uint(op::transfer(), 32)         .store_uint(0, 64)         .store_slice(to)         .store_slice(to)                 .store_int(0, 1)         .store_coins(0)          .store_int(0, 1);      send_raw_message(nft_msg.end_cell(),1);

Sam: what am i doing wrong?

Alex: Maybe you should add some TON in your message. (reply to 21960)

Sam: i saw an other example      var msg = begin_cell()             .store_uint(0x18, 6)             .store_uint(2,2)             .store_uint(0,9)             .store_uint(nft,256)             .store_coins(amount)             .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)             .store_ref(begin_cell()                 .store_uint(op::transfer(), 32)                 .store_uint(query_id, 64)                 .store_slice(to)  ;; new_owner_address                 .store_slice(to)  ;; response_address                 .store_int(0, 1)  ;; empty custom_payload                 .store_coins(0)   ;; forward amount to new_owner_address                 .store_int(0, 1) ;; empty forward_payload                 .end_cell()             );      send_raw_message(msg.end_cell(), mode); }  what i dont understand is, here nft is a int, how does that work? i have nft address how do i put it as int?

Alex: Here it looks like accountID. According to TL-B scheme Message address for internal message is:  addr_std$10 anycast:(Maybe Anycast)     workchain_id:int8 address:bits256  = MsgAddressInt;  and in this example: ....         .store_uint(2,2)     ;; $10         .store_uint(0,9)     ;; Maybe = (0,1)  + workchain_id = (0,8)         .store_uint(nft,256) ;; address ... (reply to 21963)

Sam: @iftryalexg  this works (reply to 21963)

Sam: thanks anyway

— 2023-02-11 —

Sam: Ton web can be used inside contract? (reply to 21968)

Sam: anyhow i was able to send with the 2nd example function but nice to know ton contracts can be written in ts as well (reply to 21971)

Sam: which is most stable for ton now?

Sam: func? python? ts?

Eugene: Heyo,  Can anyone help drop me some test ton's ? looks like im out of my faucet credits for the next hour.  wallet address kQAJtp7uzS1a0K5at6CtdwpJHJhb8qMLGG7t8BQpBEQMmofS  .  Thanks

Eugene: nevermind. i was told its the right chat to ask (reply to 21981)

Boris: Envie um pull request para os caras com uma tradução para o seu idioma. Isso ajudará não só você (reply to 21894)

Sam: how do i get address of msg sender in func?

Daniil: slice cs = in_msg_full.begin_parse(); cs~skip_bits(4); slice sender = cs~load_msg_addr(); (reply to 21986)

Daniil: Something like that

Sam: would the sender have to manually send his address ?

Daniil: btw first 4 bits (which I skip in the snippet above) contain flags like ihr_disabled, bounce, bounced

Daniil: Nope (reply to 21989)

Beer: It's a shame there's no Chinese

Daniil: in_msg_full - cell with raw message cell that contains all the flags and additional fields  in_msg_body - slice that only contain body of the message

Sam: aa makes sense

Daniil: () recv_internal (int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) {     ... }

Daniil: @tondev_zh (reply to 21992)

&rey: No. After all, it's unsafe — sender could send arbitrary address in message payload. (reply to 21989)

Sam: thanks ill try this (reply to 21995)

Step: how to get stateinit from code and data?  let stateInit = new Cell({refs: [code,data]});    is it right way to do with latest version of ton js library?

Step: 🥹

Daniil: There's type "StateInit" (reply to 22000)

Step: how to use? (reply to 22004)

Daniil: Depends on where do you need it (reply to 22005)

Step: i need to use in tonweb transfer function stateinit param (reply to 22006)

Daniil: Usually you just write {  code: ...,  data: ... }

Daniil: tonweb? Didn't you say "ton js"? (reply to 22007)

Step: i am talking about this param https://github.com/toncenter/tonweb/blob/master/src/test-wallet4.js#L76 (reply to 22008)

Daniil: Tonweb and ton.js are different libraries

&rey: This is example for TonWeb. let stateInit = new TonWeb.boc.Cell(); stateInit.bits.writeUint(6, 5); stateInit.refs.push(code); stateInit.refs.push(data); (reply to 22007)

Step: this data is valid to pass into .storeDict() ?

Sam: Hi guys i am having error code 9 when i uncomment the commented code       if (in_msg_body.slice_empty?()) {          return ();     }          int op = in_msg_body~load_uint(32);      if (op == 0) {         setup(in_msg_body);         return ();     }      if (op == 1) {         var ( _, _, _, _, sender_address) = load_data();          ;; slice cs = in_msg_full.begin_parse();         ;; cs~skip_bits(4);         ;; var (_,sender) = parse_std_addr(cs~load_msg_addr());         ;; cs.end_parse();         ;; throw_unless(35, sender_address == sender);          send_nft(in_msg_body);         return ();     } }

Sam: this is my full code https://dpaste.org/PpwVx

Tim: 9 = cell underflow, contracts wants to read data, but there's no data left, check your cells

&rey: You don't need cs.end_parse();. It checks that there is nothing left in the slice, while this is not the case. (reply to 22014)

Sam: leme try with that, thanks

Sam: still error code 9

Sam: https://dpaste.org/5JgJa  this is how i am intracting with contract  i am using transfer from contract function

&rey: Does anyone know: is wallet plugins support going to be added in TON Connect 2?  By the way, Tonkeeper has support for typical subscriptions, but not for custom ones. I'd be grateful if it is added before the end of Hack-a-TONx)

Александр: hey guys   can you help with task 1 please0

Ahmet Said: Made small repo for manuel message using in contract from https://dev.to/dvlkv/introduction-in-func-how-to-start-developing-in-ton-50hp  with ton typescript package .Added comments on codes i hope it would be useful for the community   https://github.com/ASaidOguz/Modified-Counter-TON-blockchain

PlanL: How should I put TON Address here?

PlanL: I mean the format of putting Address in TS code.

Ahmet Said: this is how you can use human friendly address

TON Answers Bot (not AI): Why the highload wallets are needed? from Telegram Chat Import  There are special "highload wallets" for those who make lots of transactions (like exchanges). But aren't the regular wallets good enough? They look fast and efficient. What limits do they have that are bad for the exchanges?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/43026   🔗 Answer on TON Overflow

TON Answers Bot (not AI): What are the hardware/software requirements to develop for TON? from Telegram Chat Import  Are there any minimum/recommended hardware requirements for developing on TON? And is there any "necessary" software like Xcode is for iOS development? Is it necessary to have a full-fledged IDE or any code editor will do?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/44225   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to transform a user-friendly address into a raw one? from Telegram Chat Import  I have a usual user-friendly bounceable contract address. I need to get the raw HEX form of it. How do I convert it?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/44589   🔗 Answer on TON Overflow

TON Answers Bot (not AI): What is considered "highload usage" for a wallet? from Telegram Chat Import  It is known that a special "highload wallet" is for those who have lots of transactions. But where is the boundary between "regular" usage and "highload"? Is there some number of transactions per second that is considered "a threshold"?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/42987    🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to raise a number to a power in FunC? from Telegram Chat Import  Is there a built-in way to exponentiate numbers in FunC? If there isn't and it is neede to write your own function, probably the community has already written the most optimized one?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/47118  🔗 Answer on TON Overflow

— 2023-02-12 —

Ahmet Said: whats this fift problem ? and where can i learn about this problem

Ahmet Said: and as in line says i tried to disable standard preamble it stuck on that line for long time

Daniil: Their technical support probably (reply to 22036)

Dmitry | backend4you.ton: I found email address in 3 minutes on their site. Did you tried to send there? (reply to 22038)

Will: Hello everyone

Francis: hi i deployed a contract on the ton blockchain how can i listen to its events and transacdtions? what library should i use?

TON Answers Bot (not AI): Are TON whitepapers and other docs available in languages other than English? from Telegram Chat Import  TON whitepapers are helpful for a developer, but they are hard to read, especially when English is not your native language. Maybe there are community translations of the whitepapers and/or other useful TON docs to other languages?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/74645  🔗 Answer on TON Overflow

Francis: hi i deployed a contract on the ton blockchain how can i listen to its events and transacdtions? what library should i use?

TON Answers Bot (not AI): Is there FunC highlighting for vim? from Telegram Chat Import  There are extensions for code editors like Visual Studio Code providing syntax highlighting for FunC. Is there anything like that for the vim editor?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/74376   🔗 Answer on TON Overflow

Andrew: tonapi.io has this functionality you need to log in, create an app and set up the webhook in app's settings (reply to 22044)

TON Answers Bot (not AI): How to create a custom token on TON blockchain? from Telegram Chat Import  Blockchains like Ethereum let people not only use the default ether token, but also create their own tokens on the blockchain. Does TON let people do this? How to create a custom token on TON?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/74837   🔗 Answer on TON Overflow

Francis: hi , can someone help me understand what is the payload url and secret please?

&rey: Probably payload URL is URL of page on your server (where events will be sent), and secret is used for ensuring that tonapi.io sent the request and not some stranger. (reply to 22048)

Francis: ah cool

Francis: so basically i need to create a route on my server, right? (reply to 22049)

Francis: should it be a post rout?

TON Answers Bot (not AI): Hot to find out the current amount of shards in testnet? from Telegram Chat Import  As far as I understand, usually there is just one shard, but where can I check to see if if changed?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/74898   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Why do some projects that accept TON coins require memo? from Telegram Chat Import  Some projects like exchanges ask users to include memo (a comment) in the TON coin transaction. What is the purpose, isn't the address enough for identification?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/74847   🔗 Answer on TON Overflow

Yuri: Hey guys, can I iterate over tuples in FunC?

Yuri: Or use some data structure in FIFO fashion?

Alex: I’m not sure about the best practice, I used tpop(), tpush() in smart challenge#2. I read(get one by one via tpop()) and wrote in new tuple in the same loop, for example.  I think the winners of 3d smart challenge did something really efficient in 1st task solution. It was gas efficient challenge too, so perhaps there you can find best examples. (reply to 22056)

&rey: I'm exploring plugins for v4r2 wallets, and here's what I've found. — TON Connect 2 does not have option to request to add a plugin to wallet; — Tonkeeper does not have a way to add arbitrary plugin, only standard subscription.  I want to change that. Is it appropriate to open this as TON Footstep (as custom plugins might be useful for whole TON community, and there are many wallet apps that should support plugins), or should I open separate issues at each project repository?

Behrang: push and pop is good for a LIFO, Last In First Out.  I think here a queue is needed. Maybe adding items to a dictionary with an increasing key, and then reading the dictionary from the min value works. (reply to 22057)

Kaan: Hi guys. Does npm create ton work? I've been trying, but I'm getting the same error: `Error: Command failed: npx blueprint create TestContract --type counter     at checkExecSyncError (node:child_process:885:11)     at execSync (node:child_process:957:15)     at main (C:\Users\kaank\AppData\Local\npm-cache\_npx\314ef3dfcdb14211\node_modules\create-ton\dist\cli.js:65:34) {   status: 1,   signal: null,   output: [ null, null, null ],   pid: 10824,   stdout: null,   stderr: null }`

&rey: Offtop for this chat. https://ton.org/en/buy-toncoin (reply to 22062)

Kaan: I realised that I'm getting this error in the last(3/3) part of npm create ton. Whether I'm choosing the counter contract or not, it's the same error. My npm is updated and my internet connection is kinda shitty. Does anyone else had this problem before? (reply to 22061)

&rey: Then, does the command mentioned in error npx blueprint create TestContract --type counter work? (reply to 22067)

Ahmet Said: i had the same problem in windovs os and used wvm(ubuntu) with npm create ton@latest to solve it (reply to 22068)

Yuri: I've seem that the first one used a function forall X -> X at(tuple t, int index), can't find it in stdlib. (reply to 22057)

Yuri: Another question, when I do .store_slice on a builder, does it store the slice refs or only the data?

Alex: Check includes. It is imported from fift. Desciption here. (reply to 22070)

Alex: Stores refs too. (reply to 22071)

Yuri: I see, think it would be interesting to have a function to store only the slice data, for now I'm using store_slice(slice.preload_bits(...)) (reply to 22073)

Yuri: in the preload/load bits function, can I always use 1023 bits, even if the slice data doesn't have it?

Alex: no, it will cause exception 9. (reply to 22075)

Yuri: I see, alright, continue using with size slice_bits

User<5847386827>: Hey guys. Send some test coins to this address and check it on explorer. 👽🤪  EQAF5Ygkz7opb8gFQvaIEvRpJD4fyFORATIWwA78aWstiMlm

Yuri: When you say includes, would it be the #include directive in the source file? (Couldn't find the directive there, in the source file I saw the at function) (reply to 22072)

Андрей: @testgiver_ton_bot testnet.tonscan.org (reply to 22078)

User<5847386827>: I don't want coins. That address is some smart contract I deployed and the action of the smart contract is pretty surprising. So I want to share with you. (reply to 22080)

Yuri: Hm, think you were referring to this, right? (reply to 22072)

Yuri: Can k be larger than 15?

&rey: INDEXVAR is usually used; INDEX is used when index to load is known in compile time. (reply to 22082)

Dario: yes also if you need tuples functions check here https://github.com/TonoxDeFi/open-contracts/blob/main/contracts/tuples/tuples.func (reply to 22083)

&rey: "Bouncing" between two contracts. Is that all? (reply to 22081)

User<5847386827>: Yes 😬 until it can't effort fees. (reply to 22086)

Daniil: I have a similar contract in mainnet

Daniil: EQD4nJA6d5eaahMZA6ikwxZXW_2ryt3xOZ-aJD0Ac7_ZPToZ

User<5847386827>: I didn't know that it is possible to send messages to yourself. (reply to 22088)

&rey: I have a similar contract in testnet EQDpVsvhlIxDGO3qZtPfrChaiKzlkVt6Rs-6J4Xd8BKIgQK7 https://testnet.tonscan.org/address/EQDpVsvhlIxDGO3qZtPfrChaiKzlkVt6Rs-6J4Xd8BKIgQK7

User<1087176827>: Hi has anyone worked with vaniton? I have a question  https://github.com/AntonMeep/vaniton

sgatcher: Hi. I'm new to this group. I have a simple question. Can a twa access telegram wallet instead of connect external wallet?

Yuri: It would be like this: forall X -> X at (tuple t, int idx) asm "INDEXVAR";, right? (reply to 22084)

Yuri: Is there an easy way to calculate the crc32 of TL-B equations?

Andrew: there is no telegram wallet ... yet (reply to 22093)

liminal: How can i reach data from a builder? Just like from an ordinary cell?

sgatcher: Thx (reply to 22096)

&rey: Python: import zlib print(zlib.crc32(b'<TL-B>') & 0x7FFFFFFF) (reply to 22095)

&rey: Builders cannot be read from. You need to convert it to cell (expensive) and then to slice (a bit less pricey). (reply to 22097)

Alex: hello i have question how i transfer this address to ton addrss 0:6247ddfbf2e7c34f1661a6976c4933a9819a0b240eaf483731a8d5600aab33a6

Coalus: If you want to convert it to a user-friendly address, use https://ton.org/address/ (reply to 22101)

Daniil: This is ton address. Just in raw format. (reply to 22101)

Alex: how i do that in typescript transfer to Bounceable ?

Daniil: Check Address class in your library (tonweb / ton.js) (reply to 22104)

Francis: can anyone explain to me wht am i doing wrong?  this is supposed to be basic easy

Francis: "tonweb": "^0.0.59"

&rey: You need to create an API key. (reply to 22106)

Francis: where do i put it?

&rey: const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: 'YOUR_MAINNET_TONCENTER_API_KEY'})); (reply to 22109)

Francis: do you know how can i listen to events?

Francis: contract events

Francis: i didnt find it anywhere

&rey: https://tonapi.io/v1/stream/sse/account See https://tonapi.io/swagger-ui for more information. Such APIs are intended only for testing purposes however in reality they are used in production as well. (reply to 22111)

Francis: but the swagger api does not give an option to listen ,  something like this:  constract.on(event) = > log event

Francis: anywhere?

liminal: how i can convert builder that incoming message contains into cell?

Daniil: Incoming message is a cell (reply to 22117)

Daniil: But anyway, you can convert builder to cell like this: cell c = b.end_cell();

liminal: but if it contains builder (reply to 22118)

Daniil: How? (reply to 22120)

Daniil: which message are you talking about?

liminal: with payload in it (reply to 22121)

Daniil: Are you talking about func language? (reply to 22123)

liminal: yes (reply to 22124)

Daniil: If so, the incoming message is cell

Daniil: There's also an argument of slice type that only contains body

User<1087176827>: Does anyone know how to create a custom wallet address?

Daniil: What do you mean? (reply to 22128)

User<1087176827>: EQBiJ8dSbp3_YAb_KuC64zCrFqQTsFbUee5tbzr5el_HEDGE  Like this address for the hedge token  I tried with vaniton but failed (reply to 22129)

&rey: Have you checked if version matches? (reply to 22130)

User<1087176827>: The address was not created to check the wallet version (reply to 22131)

&rey: Oh. How long was the text you were searching for? (reply to 22132)

User<1087176827>: Only 5 letters  Have you worked with vaniton? (reply to 22133)

&rey: No, I haven't. Could you show the pattern? Maybe, it's missing .* either to the left or to the right of address (to match the remaining address part). (reply to 22134)

User<1087176827>: I used the vaniton example but it didn't work  .*abc.* (reply to 22135)

Francis: Rate limit exceeded: 10 per 1 second  how can i controll this?

Francis: how can i controll the rate limit?

Francis: meaning make it wait

Francis: or go slower

liminal: Does anyone know any examples of messages-from-nowhere/messages-to-nowhere implementation?

Daniil: Messages-from-nowhere are just external messages (reply to 22142)

Daniil: You can accept them in contract in recv_external function

Daniil: And send them through any API you want (probably)

liminal: How i can send them to an API from smc? (reply to 22145)

liminal: Sorry, dummy question (reply to 22146)

liminal: How i can send message from an smc to an API?

Daniil: Not a dummy question

Daniil: I just don't know what to answer. Never tried sending messages to external addresses

— 2023-02-13 —

TON Answers Bot (not AI): How we can track transaction in specific address with the "method_id"? from Howard  In TVM, smart contract enable to trigge difference kind of flow based on the message they receive.   - How can I track / monitor specific txs? (Like minting NFT / Stake...etc)  For example, the tx here is in method code: 0x80089e0f, how can I track all the tx like this in this smart contract address. (I know it's unrealistic to track all the Txs in same method code)  !(https://imgur.com/M0rjyqY)   🔗 Answer on TON Overflow

Hardy: Where is the ton wallet api document?

Hardy: I've been looking for a long time and can't find it

James Truong: Is there any way I can get all information about the tokens I own in my wallet address? It's similar to call func getAssets (something like this).

Daniil: Do you want to get this information on-chain inside of smart contract? (reply to 22154)

James Truong: I am writing  simple one dapps to get information about tokens of Ton address when pasting Address on input.

Anand: Hi, this section has breaking url, download url not found. And also setting path is not very much clear from doc reference. Please update.   https://ton.org/docs/develop/smart-contracts/environment/installation  I keep getting below error even after setting path.

Tim: @talkol time to update to blueprint)

Anand: Blueprint is better but let's have some examples over Jetton and NFT contracts deployment and interaction. (for users to customize later). I only see Counter contract till now. Also, Blueprint doesn't support (https://wallet.ton.org/?testnet) yet. Should add it IMO

Tim: Blueprint supports tonconnect, it's enough

Francis: hi guyz can anyone help me understand how to convert this address format   kQDsF-yKhKqg4ygCynLfYRaw_QJeSoK2BeRpamO-nXeuuSiT  to =>  -1:34517c7bdf5187c55af4f8b61fdc321588c7ab768dee24b006df29106458d7cf'  this format

Francis: is it base64 to hex ?

Rinat | ZilPay (Will not Call or DM you): Hello everyone, i cannot find the fragment.com source code, someone know where is it?

Francis: i used this api , bot i got   0:ec17ec8a84aaa0e32802ca72df6116b0fd025e4a82b605e4696a63be9d77aeb9

Howard: 🫡 anyone knows? Fetch on-chain data by Method code (reply to 22151)

Francis: const blockSubscribe = new TonWeb.BlockSubscription(tonweb.provider, storage, onBlock, {  anyone know how to specify workchain?

Francis: const blockSubscribe = new TonWeb.BlockSubscription(tonweb.provider, storage, onBlock, {     mcInterval: 30000,     shardsInterval: 30000,     mcIntervalId: 0,     shardsIntervalId: "-9223372036854775808",   });

Francis: anyone know how to specify workchain?

Tim: there's only one workchain

&rey: kQDsF... is not a masterchain address, I think. (reply to 22163)

&rey: https://tonapi.io/v1/jetton/getBalances (reply to 22156)

Alox: Hi TON! I have some great pilots I am testing and willing to test in future. Would want to request a Grant for such. @alox1008, pm me

Alox: I like paper planes a lot.

Alox: How do we orgami them?

Alex: Hello how i can decode base64 response from tonweb?

&rey: TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(...)) (reply to 22177)

Alex: Thank you now what i do with that?

&rey: Depends on what do you want to extract from there. (reply to 22179)

Alex: Thank you for fast aswer  i try call function and extract from there data (reply to 22180)

&rey: Do you have source code of contract or its documentation? When you don't have any docs for contract, having BOC is pretty useless — it can be interpreted in many different ways. (reply to 22181)

Alex: cell get_users() method_id {     var (_, _, _, _, _, users, _) = load_data();     return users; }  this is function i try call

&rey: Is there a comment with TL-B scheme of contract data? It could be somewhere near load_data().

Alex: ( cell) load_data() inline_ref {     var ds = get_data().begin_parse();     return           ds~load_dict(),     ;; users         ); }

&rey: Well, users is a dictionary. By TL-B I mean something like storage#_ ... users:(HashmapE ??? ???) = ContractStorage; (reply to 22186)

Alex: i supposed only return address

Alex: have you maybe exmaple how to do that diff contract?

User<1783915887>: hi,I am a  ambassador and marketer, with two years of experience in marketing and guidance and moderator, in Telegram, conditions for I can create a local association. What is your opinion, who should I talk to?

Lisa OOO: Attention, developers! 💎  Join us at the upcoming Hack-a-TONxDoraHack offline meetup in Dubai, where you'll have the opportunity not only to pitch ideas for the hackathon but also to learn about the latest advancements in TON blockchain technology and network.  18-19 Feb, TON Foundation office, you'll learn everything you need to know to get started. The full agenda is already published on the website.  Whether you're an experienced developer or just starting out, this is the perfect opportunity to expand your knowledge, network with TON experts, and be a part of the TON community shaping the future of blockchain technology.  👉 Register now and be a part of our meetup.

Alex: i try to do                     const opcode = cell.bits.readUint(32)  i don't have readuinit(32) =/

Tim: it depends on your lib. could be cell.loadUint(32), cell.asSlice().loadUint(32), look for ts typings

&rey: In TonWeb:  let slice = cell.beginParse(); slice.loadUint(32) (reply to 22192)

Alex: i use tonweb 0.59

&rey: Cell.oneFromBoc to load a single cell. (reply to 22196)

Alex: dont have too

Alex: how did i parse that? help please

Behrang: Do you mean "op code"?  "method_id" is for getter functions. (reply to 22167)

Howard: yes, op_code. Track the specific internal message send to the contract. (reply to 22200)

Ahmet Said: token minter works on only mainnet ? does it have testnet token minting page ?

Coalus: https://minter.ton.org/?testnet=true (reply to 22206)

Alox: @coalus can you PM me?

Ahmet Said: https://testnet.tonscan.org/jetton/EQA-Apo7S3u7ZPO4aIcc9PkiPkrz0D-k9DlzW4iZv54ucI5i  i deployed the jetton but it gives me exit code -13 why  ?

Ahmet Said: in ton minter

Anand: Does this connect to OpenMask for anyone? For me it just opens up another tab in chrome (reply to 22207)

Ahmet Said: i have 9 ton in test wallet and use the link i have been given but still tell me not enough balance for deployment (https://minter.ton.org/?testnet=true)

&rey: 1) This is English chat, see @tondev for Russian 2) This is offtop 3) @CryptoBot (reply to 22212)

Anand: +1 (reply to 22213)

Anand: Any other alternatives for jetton deployer supporting testnet?? this repo seems to be deprecated? @talkol (reply to 22207)

User<5116638705>: Who convert int8array to string

User<817743285>: I have the same question. Who? (reply to 22218)

User<5116638705>: 😐 (reply to 22219)

Ahmet Said: it does connect but there s no actual connecton to test net my friend ...Post request sending to mainnet

Alex: It looks like 0 still. Is it testnet mode? (reply to 22222)

Alex: https://t.me/testgiver_ton_bot ? (reply to 22227)

Alex: Note, you should top-up the balance and then activate your wallet via an outgoing message. (reply to 22224)

Chaitu: /ragistration

Step: what is the new replacement for parseStack in new ton js library?

&rey: The easiest way, I think is... to send an internal message of minimal value to some predetermined address that will identify the API. For example, EQA___YOUR_PREDETERMINED_ADDRESS_____________E8h.  Then, you need to listen to transactions to that address. TON delivery system will automatically deliver all the messages into one place (one shard), where they can be checked as easily as deposits to wallets. And even when you wish to setup your own node, it will have to listen to only one shard: one with your address. (reply to 22146)

𝓢𝓪𝓶𝓾𝓮𝓵: Hello people! I am having a problem to renew the contract time of my domain. For some reason, even though I've let days go by and sent him bigger and bigger amounts, he won't let me renew the timer. Can someone help me with this?

TON Answers Bot (not AI): Is there a minter.ton.org alternative for testnet? from Telegram Chat Import  There is an open source tool minter.ton.org for deploying custom Jettons to mainnet. Is there something like it for testnet?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/112241   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is it possible to use balance tied to an NFT? from Telegram Chat Import  As far as I understand, in TON NFT it is possible to associate a wallet with a specific NFT so each of NFTs may have its own "balance". So does it mean it is possible for the NFT creator to use this balance — e.g., for creating a game where points are tied to it or something like that?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/74887   🔗 Answer on TON Overflow

&rey: < No, it's better not to use it that way. < Each NFT is a separate smart contract that really has its own balance (and data and code). < This balance can be withdrawn by user when transferring NFT. Also, it can be filled up by user. This means ingame points based on NFT balance can be changed externally. (reply to 22247)

&rey: However, it seems to me that translation has lost the meaning of original message. (reply to 22247)

Step: if we have 1000+ telegram anonymous number nft we can withdraw 1000 ton from it? each nft has almost 1ton? (reply to 22248)

Step: 😀

TON Answers Bot (not AI): What does "mutable" mean in the case of Jettons? from Telegram Chat Import  In explorers such as Tonscan every Jetton page has a field called "mutable" with "yes/no" value in it. What does that mean, what exactly in Jettons is mutable/immutable?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/74969   🔗 Answer on TON Overflow

Ahmet Said: in this stack how can i  read each cell if they r address or not ? this is from get_jetton_data method .When i use jettondetails interface to decode it but i couldnt make it work

Ahmet Said: this is the error info

Mike: Is there any Docker support?

Mike: I see this: https://github.com/newton-blockchain/general-ton-node wonder if anyone is using it?

Feliciss: How to convert base64 boc to ton address?

liminal: Are there stealth addresses in TON Blockchain, kinda like in Monero? If they are, is it possible to generate them?

Ahmet Said: how can i read address from get method ? how can turn slice into readble format ?

TON Answers Bot (not AI): How to start developing on TON? from Telegram Chat Import  This question has been answered many times before. But people keep asking it again and again in the chats, so it is probably a good idea to have the question here so it can be easily found by googling. So, where to start? Is there a tutorial?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/112331    🔗 Answer on TON Overflow

Levi: How do I deploy a smart contract using Ton-Connect, not with a "mnemonic" ?

Ahmet Said: https://github.com/ASaidOguz/Modified-Counter-TON-blockchain made this repo with learning doc and u can deploy it with tonkeeper (reply to 22261)

Levi: 🙏 Thank you

TON Answers Bot (not AI): Why does FunC use ;; for comments? from Telegram Chat Import  Is there any specific reason why single line comments in FunC start with ;; and not something more common like //? It feels very odd.  ---  > This question was imported from Telegram Chat: https://t.me/tondev/64352   🔗 Answer on TON Overflow

Vyacheslav Pridchin: Greetings to all! Interested in the question, is there any SDK for Unity? Or implementations on .Net Core?

— 2023-02-14 —

Mike: is anyone here running TON nodes in Docker?

Ssi: why? (reply to 22266)

Mike: we normally run all of our nodes in Docker, but this one is particularly challenging with all the install scripts

Mike: was wondering if anyone adapted it Docker

Ssi: I've planned to do that soon but haven't done yet haha

💎Saito: Is there a developer who can help change the NFT collection data? (avatar, description, links, cover art page) For payment

TON Answers Bot (not AI): Are there any tools to make a DAO on TON? from Telegram Chat Import  We are looking to create a DAO on TON. Are there any tools available to create one for us, if not what would you recommend we do until the relevant tooling becomes available?  🔗 Answer on TON Overflow

James Truong: Is there any way for me to mint 1 jetton token on testnet?

Morris: Hi does anyone know how to run mytonctrl on testnet?

Андрей: https://github.com/ton-blockchain/mytonctrl/issues/76 (reply to 22277)

Morris: I already try but stilll connect to mainnet (reply to 22280)

Jérôme: hi everyone, do you guys know how to follow the community vote regarding the locking up of idled addresses ? thanks  al ot

Anand: Any well documented github repo we know which has done Jetton deployment on testnet??

Anand: There is no official tutorial I could find till now

Anand: Only counter contract there

Daniil: https://ton.org/docs/develop/dapps/tutorials/jetton-minter (reply to 22284)

Anand: Does this work on testnet? (reply to 22286)

Martin: I have a question. I am new to TON space. I am doing this lesson from the following link: https://github.com/romanovichim/TonFunClessons_Eng/blob/main/2lesson/secondlesson.md   I am facing the this issue (forwarded from Martin)

Martin: please help @everyone

Gekodô: Hello Everyone, in my point of view I believe that FIAT to Crypto solutions should be developed mainly for crypto users in Africa, in my country (Angola) there is a P2p community of 671 people and they move 5 million Euros per month, but not it is possible to go further because of the limitations, if there was a way to allow Cryptocurrency payments via SEPA I am absolutely sure that the Ton network would be boosted in Africa and more users would emigrate on the Ton Network

Alex: Please, use this lesson, because your was created for old tests.

Martin: anyone hereee???? (reply to 22288)

Daniil: https://t.me/tondev_eng/22291 (reply to 22292)

Tigr: U've probably declared recv_internal twice (reply to 22288)

Martin: no It's not the case (reply to 22294)

Martin: thanks bro (reply to 22293)

James Truong: How do I import a Ton wallet with 12 seed phrases into the Ton hub app that requires 24 seed phrases?

James Truong: please help me how to do it guys ? thanks you

Lucas: Hi,how to create my own FT-Token  wallet address

Amin: 🎉 Rift Framework is Publicly Released! 🎉  We're thrilled to announce the release of Rift, the new Python framework for smart contract development on TON! 🚀  💻 Development Made Easy  With Rift, smart contract development just got a whole lot easier! Write contracts using Python's easy syntax, and leverage its OOP and metaprogramming capabilities to maximize code reuse!  🧪 Test with Ease  Rift comes with a built-in testing framework that makes it simple to test your contracts with an easy-to-use interface.  💎 Interact and Deploy on TON  Use Rift to interact with the TON network, whether you want to query data or deploy contracts.  💫 What makes Rift special?  Rift is a flexible framework that can be plugged in at any stage of your project. You can use it for development, testing existing FunC/Fift contracts, or even just for interacting with TON. Plus, Rift is standalone, all you need is Python 3.10 and the rift-framework package and you're ready to go.  💡 What's next?  Stay tuned! We're working on step-by-step tutorials to help you get started with development on TON. Stay up to date by subscribing to the channel and the community group!  🔗 Rift's Website 🔨 Rift GitHub (forwarded from Skyring)

&rey: Does it compile to FunC or to TVM assembly? (reply to 22303)

Amin: Currently FunC, but TVM is planned (reply to 22304)

Dmitry | backend4you.ton: Hi. I’m making a wrapper for libtonlibjson: https://github.com/justdmitry/TonLib.NET (reply to 22265)

Ömer: hello friends next couple days we will ask so many questions about developing contract so thank you for your passions ☺️

Howard: Can use search feature on Telegram (reply to 22310)

fesal | Patara 🐢: Hey guys, does func supports keyvalue type of variable or map?

fesal | Patara 🐢: Seems like i cannot find it via Docs so

&rey: Hello! These are `cell`s. TVM assembly docs: https://ton.org/docs/learn/tvm-instructions/instructions#10-dictionary-manipulation-primitives (reply to 22312)

&rey: and FunC docs. https://ton.org/docs/develop/func/stdlib#dictionaries-primitives (reply to 22313)

fesal | Patara 🐢: Well on Docs it says Cells only holds up to only 1023 bits of data and only four references to other cells. Is it same with globals? (reply to 22314)

Daniil: Each of these references is also a cell which can also hold 4 references (reply to 22316)

&rey: Global variables are not generally stored in cells. Or did you mean global cell variables? Yes, they also have the same size restriction. (reply to 22316)

Kip-: need a music service on the TON

fesal | Patara 🐢: Yeah i meant global cell variable. Thank you (reply to 22318)

fesal | Patara 🐢: So can it be like Linked List over linked list?  WalletKey references to the data it contains also data contains references to its pages. Also, WalletKey contains reference to the next WalletKey (reply to 22317)

fesal | Patara 🐢: WalletKey -> Data -> Data + 1 | WalletKey + 1 -> Data -> Data + 1

Dario: I suggest to take a look at dictionaries (reply to 22324)

Dario: And try to shard the contracts, so each wallet will be deployed at his own contract

fesal | Patara 🐢: Thanks

Hermès: which API has broadest traffic in Main-net? https://getblock.io/nodes/ton/  TonCenter is not satisfied. Or they has special package?

Mark Okhman on TON: ⭐️ Going live on TON&Co! In 10 mins with Developer Onboarding Manager at TON Foundation — Roman Krutovoy.  — How to start with TON? — What is a secret all-in-one tool to develop smart-contracts? — How to mine your first NFT and become a TVM Developer?  🎙 We will be talking about onboarding process and also go through TON Onboarding Challenge! Moreover, we will cover questions from you guys.  🆘 Don’t miss out to start your adventure with TON!  https://join.toncompany.org/c/onboarding-events/onboarding-challenge-with-head-of-onboarding-roman-krutovoy

Vyacheslav Pridchin: Благодарю) (reply to 22309)

fesal | Patara 🐢: int walletId = in_msg_body~load_uint(256); (slice payload, int success) = udict_get?(dic, 256, walletId);  I need to convert payload to the cell, how can i do that?

fesal | Patara 🐢: Since payload is a dict

Behrang: I'm using blueprint. When I run my tests and they fail, jest shows wrong position of test files. Does anyone know how to fix it? Searched a lot and I couldn't find any solution.  Looks like to be a source map issue.

liminal: foe is sth like farming? (reply to 21174)

Ömer: hi, We have created the contract, but we cannot approve it with the wallet (TonKeeper).

Ömer: gives error after confirmation

Ömer: we stuck there 🙄

Tim: show screenshots, error codes, contract example, everything you have

Tim: more info you give - more chances someone will help

Ömer: https://github.com/Iamknownasfesal/Hack-a-TONx-w-DoraHacks/blob/main/PassTON/contracts/pass_ton_main.fc

Ömer: When i confirm the deploy transaction it shows an error accoured

Ömer: Tried for atleast 10 times

&rey: Well, as far as I see from your messages you're trying to deploy the contract. Is that right? (reply to 22339)

Ömer: Yes (reply to 22348)

&rey: Could you share the code you are calling on frontend? (reply to 22349)

Ömer: https://github.com/Iamknownasfesal/Hack-a-TONx-w-DoraHacks/blob/main/PassTON/contracts/pass_ton_main.fc (reply to 22350)

Ömer: We're calling with blueprint

Alpar: 😀

Saber: yes, it’s an NFT staking contract but with a slight modification it can be a jetton staking contract (reply to 22338)

Jeff: How can I use tonconnect in localhost? It throws 'LocalstorageNotFoundError' when I initialize TonConnect. I set tonconnect-manifest.json in root dir and set url 'http://localhost:3000', but not work.

Tim: you can't

Tim: manifest url should be somewhere on https, but tonconnect will work

Jeff: Then what value should be in 'url' in manifest? I'm currently testing my app on the localhost.

&rey: At least, your manifest must be accessible from wallet app. If you are testing on phone in local network — you may try to point to local address. Not sure if this works, though. (reply to 22355)

TON Answers Bot (not AI): What's the best way to store a date in a smart contract? from Telegram Chat Import  In developing for blockchain it's important to save space, so it seems better to store the dates in 32-bit integers instead of 64-bit. But blockchain is also meant to be "forever", and the dates will fit in the 32-bit integers only till the year 2038. So what is considered the best practice: using 64-bit integers (to future-proof the contracts) or 32-bit (to save space)?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/45383   🔗 Answer on TON Overflow

Jeff: Thanks! I'll try. (reply to 22359)

User<5847386827>: How can I transfer Jettons in FunC?

Ömer: Is there any news about the code (reply to 22350)

TON Answers Bot (not AI): Is there a maximum storage limit for a smart contract? from Telegram Chat Import  It's known that blockchain is not the best place to store lots of data (there is TON Storage for that, while smart contract data should generally be as small as possible). But is there a technical limit of permanent storage size for one smart contract, or a developer can theoretically grow a chain of cells indefinitely? If there is a maximum size, what is it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/45509    🔗 Answer on TON Overflow

TON Answers Bot (not AI): What is the real-life resource usage of a TON full node? from Telegram Chat Import  A question for those who actually run a full node: can you share its usage metrics like traffic consumption, CPU usage, network usage? Preferably using something like Grafana vizualization.   ---  > This question was imported from Telegram Chat: https://t.me/tondev/45621    🔗 Answer on TON Overflow

TON Answers Bot (not AI): What is IHR Fee? from Telegram Chat Import  In a TON explorer the transaction info mentions something titled "IHR Fee" with a value of zero. What does it mean and when it becomes not zero?  !(https://i.imgur.com/CMMrWrw.jpg)  ---  > This question was imported from Telegram Chat: https://t.me/tondev/46317   🔗 Answer on TON Overflow

Step: how to get nft meta data of nft address  through adnl connection?

liminal: Such op-codes are custom, aren't them?

Dmitry | backend4you.ton: I see both Tonkeeper and Tonhub apps (iOS) can store/manage only one address, not "many" generated from single seed words set. Are there other wallet apps that can manage multiple addresses, or this feature is "not yet required" ?

TON Answers Bot (not AI): How to check the current TPS on TON blockchain? from Telegram Chat Import  Is there a way to check how many transactions per second are there currently on the TON blockchain? The tonmon.xyz website is supposed to show this, but for some reason I usually see TPS listed as "N/A" there.  ---  > This question was imported from Telegram Chat: https://t.me/tondev/72599    🔗 Answer on TON Overflow

— 2023-02-15 —

Ahmet Said: in this code i try to get jettons get_wallet_data but it give me always wrong address am ı doing something wrong ?

Ahmet Said: maybe the way of sending arguments into contract ?

Lucas: how get my jetton address by v4R2 address and token's contractAddress?

Spite: Is token's address master wallet's address? (reply to 22377)

Lucas: yes ,like my token's address (reply to 22379)

Spite: Look here. Having an owner wallet and a master wallet address, you can calculate the wallet address of the token: https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-wallet.fc#L62 (reply to 22380)

Lucas: the master wallet address is like contractAddress?

Lucas: or there has another language implemention?

Daniil: You just need to call the "get_wallet_address" get method of the jetton contract.

Daniil: It can be done in any language via API like toncenter.com

James Truong: Could I follow this docs https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonWallet.js to override function transfer token Jetton ?

fesal | Patara 🐢: How can i turn a cell in to a slice?

Alex: FunC? begin_parse (reply to 22388)

fesal | Patara 🐢: Found it thank you, also  can you store a dict in a dict? (reply to 22389)

fesal | Patara 🐢: seems like i cannot do that

James Truong: Is there any one know this one? could give me the answer. thanks a lot (reply to 22387)

Daniil: dict_set_ref() (reply to 22390)

fesal | Patara 🐢: So, is this code wrong?              cell userDic = new_dict();             userDic.udict_set(16, appId, begin_cell().store_uint(appId, 16).store_slice(data).store_slice(pass).end_cell().begin_parse());             dic.idict_set_ref(256, walletId, userDic);             set_data(dic);  results in : { items: [ { type: 'cell', cell: x{} } ] } (reply to 22393)

Daniil: Results where? Do you return anything from that function? (reply to 22394)

fesal | Patara 🐢: (cell) load_data() inline {     var ds = get_data();     return (ds); }  (cell) returnAllData() method_id {     var (data4) = load_data();     return (data4); } (reply to 22395)

fesal | Patara 🐢: Also loading dict:      var ds = load_dict(get_data().begin_parse());  results in:  { items: [ { type: 'int', value: 0n } ] }

fesal | Patara 🐢: would love a example for a dict in a dict, seems like i cannot understand it

HuaDong: Which developer can speak Chinese?

HuaDong: There is a need for commercial system development, and developers/teams who can speak Chinese are needed.

Alex: Your dic was not modified. 1) You need to use set_dict, load_dict primitives to write and read dict. https://ton.org/docs/develop/func/cookbook#how-to-store-and-load-dictionary-in-local-storage 2) Your dict could be modified with operator ~, or you should re-assign result of primitive function invoked with . . Examples: with ~ dic~udict_set(16, appId, slice_data); with . userDic = userDic.idict_set_ref(256, walletId, cell_data); (reply to 22394)

.: hello, could you please answer me some questions?  1) Is there a python TON library or SDK? 2) Is there testnet and faucet to test my applications?

Victor: tonsdk, @testgiver_ton_bot (reply to 22402)

.: thank you!

User<5847386827>: Is it possible to predict the value of rand(n) before signing a transaction?

Tim: depends, in some cases yes (reply to 22405)

User<5847386827>: For example I want to generate a random boolean:  rand(2); (reply to 22406)

Tim: it's more complicated than that

Tim: https://telegra.ph/Istoriya-vzloma-smart-kontrakta-TONFUN-11-04 you can try to read this article

Alex: Hello i'm running ton node on debain i used this guide https://ton.org/docs/participate/nodes/run-node  how i chack if node responce like in evm?

Ahmet Said: where can i find example for get method query with typescript where it gets argument as address ?

Vali | QS: Hi, do you have any doc/examples about how to emit logs and what message format should be used?

Seitaro: https://github.com/ton-blockchain/bridge-func/blob/master/func/message_utils.fc#L26  Format is specified in block.tlb : message header (reply to 22412)

fesal | Patara 🐢: Hey guys, how can i parse a dict in typescript package?          const { stack } = await provider.get('userData', [             {                 type: 'int',                 value: BigInt(1),             },         ]);         const mainDictionaryOfUser = stack             .readCell()             .beginParse()             .loadDictDirect(Dictionary.Keys.Uint(16), Dictionary.Values.Cell()).values;  gives me error : No more references

fesal | Patara 🐢: Normally my cell is :  x{9607E_}  x{5}   x{2_}    x{2_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0C0000000000000000000000000000000000000000002_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0C4000000000000000000000000000000000000000002_}    x{2_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0C8000000000000000000000000000000000000000002_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0CC000000000000000000000000000000000000000002_}   x{2_}    x{2_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0D0000000000000000000000000000000000000000002_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0D4000000000000000000000000000000000000000002_}    x{2_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0D8000000000000000000000000000000000000000002_}     x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0DC000000000000000000000000000000000000000002_}  x{CE_}   x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0E0000000000000000000000000000000000000000002_}   x{1D195CDD1019DB585A5B0B98DBDB5F0000000000000000000000000000000000000000000000000000000000000C4C8CCD0D4C4C0C0E4000000000000000000000000000000000000000002_}

Tim: Your values probably not cells, you need to write custom decoder

fesal | Patara 🐢: they're cells

Tim: how you encode your dict?

fesal | Patara 🐢: https://github.com/Iamknownasfesal/Hack-a-TONx-w-DoraHacks/blob/main/PassTON/contracts/pass_ton_main.fc

Victor: did you run your code? (reply to 22419)

fesal | Patara 🐢: Yep  https://github.com/Iamknownasfesal/Hack-a-TONx-w-DoraHacks/blob/main/PassTON/scripts/deployPassTonMain.ts

Tim: Not sure what exactly is wrong here. You can try to return user dictionary without load.  Also it looks like you want to store every user dict in one main contract, instead you should create one contract for every wallet

fesal | Patara 🐢: Will do sharded contracts later on, trying things about inner dicts etc., gonna try without load now. (reply to 22422)

Tim: No need to do sharded contracts, just One user = one contract

Alex: Guys help please my ton node sync but i don't know how to intract with him 😢

Alex: OS debain

fesal | Patara 🐢: Without loading, it sends slice with a empty cell init  items: [ { type: 'slice', cell: x{} } ] (reply to 22422)

User<5847386827>: tonscan has lots of delay in showing transactions. 😐

Moven: Quick question about "ton" library  on version "^11.18.2", {ExternalMessage, InternalMessage, CellMessage} are available but on version "^13.3.0", these types are deprecated  Does anyone know the alternatives for these types on the new version?

Андрей: I want to clarify few things: do smart contracts have to pay rent? If so, does it mean that bought NFTs will eventually destroy themselves? And also, how auction timer and (auction) contract itself works?

Anil: import {     Address,     beginCell,     BitString,     Cell,     Contract,     contractAddress,     ContractProvider,     Dictionary,     Sender,     toNano, } from 'ton-core'; import { compile, NetworkProvider } from '@ton-community/blueprint'; import { Blockchain } from '@ton-community/sandbox';  export default class PassTon implements Contract {     constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}      static createForDeploy(code: Cell): PassTon {         const data = beginCell().endCell();         const workchain = 0; // deploy to workchain 0         const address = contractAddress(workchain, { code, data });         return new PassTon(address, { code, data });     }      async sendDeploy(provider: ContractProvider, via: Sender) {         await provider.internal(via, {             value: '0.01', // send 0.01 TON to contract for rent             bounce: false,         });     }      createRandomMail(seed: number) {         var randomMail = 'test' + seed + '@gmail.com';         return randomMail;     }      createRandomPassword(seed: number) {         var randomPass = 'test' + seed;         return randomPass;     }      async sendTx(provider: ContractProvider, via: Sender, walletId: number, appId: number) {         const dataBody = 'test@gmail.com';         const password = '12345' + appId;         const messageBody = beginCell()             .storeUint(1, 1)             .storeUint(walletId, 256)             .storeUint(appId, 16)             .storeBits(new BitString(Buffer.from(dataBody + '|', 'utf8'), 0, 360))             .storeBits(new BitString(Buffer.from(password, 'utf8'), 0, 240))             .endCell();          await provider.internal(via, {             value: toNano('0.1'),             body: messageBody,         });     }      async getter(provider: ContractProvider) {         const { stack } = await provider.get('userData', [             {                 type: 'int',                 value: BigInt(1),             },         ]);         const mainDictionaryOfUser = stack.readCell().beginParse();          console.log(mainDictionaryOfUser);         return stack;     } }  export async function run(provider: NetworkProvider) {     const contract = PassTon.createForDeploy(await compile('PassTon'));     const blockchain = await Blockchain.create();     const user = await blockchain.treasury('EQAo6ZtTJ45DaY7Ow5HKL6f9xy4AwJoRvMTNJhdl7v6e_RfG');     const passToMain = blockchain.openContract(contract);      await passToMain.sendDeploy(user.getSender());      for (var i = 0; i < 10; i++) {         for (var j = 0; j < 10; j++) {             await passToMain.sendTx(user.getSender(), i, 1000 + j);         }     }      const result = await passToMain.getter();      console.log(result); }

&rey: 1. Yes, smart contracts pay rent, though if balance is about 1 TON and data size is no more than a few KB then the contract will be stored essentially forever. Storage fee is taken at each transaction (that is, incoming message). To prevent your NFT to be destroyed, you can fillup its balance by sending a message with some value to it. (reply to 22432)

&rey: 2. Generally, auction contracts store end time, and upon receiving any incoming message they check all pending operations. (reply to 22432)

Андрей: But where do these incoming messages come from? (reply to 22435)

&rey: From user interested in receiving the NFT, or from platform, or from someone other. In some auction contracts, even external message (that carries no value) can be used for this purpose. (reply to 22436)

Namelesss: Is there any group for Ton community chat ?? Or any project building on Ton

Андрей: How marketplaces (getgems.io) and ton scanners know that an NFT or FT is owned by the wallet (ton v4r2 address)?

User<5116638705>: How get price TON api ?

Tim: get_nft_data method returns owner (reply to 22440)

TON Answers Bot (not AI): How to hide the smart contract data from the world? from Telegram Chat Import  What if I develop a smart contract on TON but don't want the data included in the initState to be seen by others? Does it mean I need to use encryption?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/112640    🔗 Answer on TON Overflow

Step: parseDict(c.beginParse(), 264, () => null);   what is the equivalent code for new version ton js library?

Андрей: Not "get owner of a NFT", i meant "get owned NFTs" How to do it? (reply to 22442)

Step: any help? (reply to 22444)

Alex: Not sure, but you can try to use loadDict() (reply to 22446)

Step: c.beginParse().loadDict(); ? (reply to 22447)

Step: Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.Uint(16), c.beginParse());  ? (reply to 22444)

Step: 🥹

Step: tried c.beginParse().loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Buffer(32));    error Error: Index 265 > 265 is out of bounds (reply to 22444)

Андрей: Telegram usernames can be used for ton sites?

Step: https://uptits.t.me yes new pranhab in ton blockchain. (reply to 22452)

Ahmet Said: while my wallet has ownership on this jetton https://testnet.tonscan.org/jetton/EQA-Apo7S3u7ZPO4aIcc9PkiPkrz0D-k9DlzW4iZv54ucI5i why cant i see it as owned jetton in jetton section here  https://testnet.tonscan.org/address/EQDjUc7m2zSZ_oWh4wvmLf5a3UqOUfSzvBODeY5RXy9EWy7p#transactions

Yuri: Hey guys, does this TL-B make sense: serialized_node$1 num_refs:(uint 3) ref_indexes:(uint8 * num_refs) data:bits = SerializedNodeMsg; send_msg_node$10 dest_addr:(bits256) = SerializedNodeMsg; The first constructor would have 32 bits op = 1, 3 bits uint representing the number of references, and the indexes of the references (if num_refs=2, it'll have 2 uint8), the rest is the remaining bits of data. The second construtor would habe 32 bits op = 2 and 256 bits address.

Slava: It's a long read, but a very well worth it. Especially if you care about Web/JavaScript ecosystem and FOSS.  By the way, I've worked with Denis when I was implementing a browser-compatibility platform for Sberbank that helped to save TONs of traffic and significantly improve website loading performance. I'm amazed on the complexity and the amount of work that Denis has done. He's an idealist and a living example of self-dedication and servitude to the mankind. So if you have an idea of how to save the core-js, it's the perfect moment to help.

Alox: I can make papers fly! Team, PM me.

‌MisaGH: I am from Iran and I want to cooperate with you. If you intend to provide benefits in Iran, you can inform me. Thank💚

Victor: Hi guys, I've connected to the chat via link from TON quest, I think you should change phrase all correct fractions whose denominator is less than or equal to n to  all reduced proper fractions whose denominator is less than or equal to n because currently i.e. for n=4 fraction 2/4 also should be counted, because this is correct fraction whose denominator is less than or equal to n, but according to the test's results you calculate only reduced proper fractions

Anthony: Hi! What TON quest is? (reply to 22460)

Victor: Chapter 2, problem with trade bot (reply to 22461)

Anthony: Got it. Reported to the team

— 2023-02-16 —

James Truong: I am trying transfer jetton token with func below, But Ican not success.

James Truong: Does anyone know how to transfer jetton tokens?

James Truong: I think this question is my mind (reply to 22362)

James Truong: I am following this func transfer to transfer jetton

James Truong: But I can not understand this transfer func have toAddress 2 field, amount 3 field

James Truong: is thre anyone clear this one ?

Hartmann D.: Витя Пап, please use English. This is an international dev chat. The Russian-speaking one is here @tondev.

Anand: Hi, which TON wallet is more developer friendly for deploying and interacting with FunC contracts? I see so many options, ton connect, ton keeper, ton hub etc?

Spite: Ton Connect is not wallet, it is protocol for connecting wallets to some apps. I recommend to use TonKeeper as wallet and Ton Connect 2.0 as protocol to connect wallets to apps

Anand: Ok thanks

Anand: And does this jetton minter ( https://minter.ton.org  ) really NOT work on testnet? I should try with mainnet instead?

Alex: What is unclear? You want to transfer Jettons from Wallet A to Wallet B(both are wallet contracts). These fields are necessary for the following message chain. 1) You request Wallet A do transfer with your keypair. 2)  Wallet A is sending  internal message to Jetton wallet A(transfer request) 3) Jetton A is sending internal message to Jettton Wallet B (internal transfer) 4) Jetton B is sending internal message to Wallet B(notification)  You can learn more details from this article or specify your question more accurately. (reply to 22473)

Anand: Does blueprint have support for TonKeeper yet? (reply to 22483)

Alex: Testnet environment https://minter.ton.org/?testnet=true (reply to 22485)

Anand: It does not connect with any wallet. Even if it does at backend it reads balance of mainnet account associated.   Did you try minting jettons on testnet here?? (reply to 22488)

Anand: I guess so many people facing this issue

Anand: This. (reply to 22213)

James Truong: thanks a lot for this docs. I will read it carefully before come back (reply to 22486)

Alex: I see, maybe @mrbonezy could advise how to connect in the testnet version https://minter.ton.org/?testnet=true. (reply to 22491)

shahar: Minter doesn’t support testnet for the time being.

ZEEGFA: is it Featured Pools showing new opportunities on the ton network automatically or it is manually and manage by Ton Foundation?  Is it activated or what we see now is active but nobody is interested anymore to help as Nominator to fill the Nominator pool and let the validator be activated and start earning money? (reply to 19857)

Anand: Any other alternatives for beginners? Are we incorporating jetton minter with Blueprint? (reply to 22494)

Андрей: How to store 2-bit integers or individual bit booleans in a smart contract and what's better?

Tim: is there any reason for it? (reply to 22494)

shahar: Just a matter of putting the effort (reply to 22499)

shahar: In the meantime you can use https://github.com/ton-blockchain/minter-contract (which should be upgraded to use blueprint as well) (reply to 22497)

Anand: This fails at setting path (reply to 22158)

Anand: This. (reply to 22159)

Anand: @mrbonezy

shahar: Do you mean that FIFTPATH is in fact exported as an env var, but you still get this error?  In any case we’ll update to blueprint hopefully next week

Anand: Ok Awaiting Blueprint. Thanks

Anand: Finally everything worked on Testnet for me. I would like to raise a PR after updating the docs and readme if required. I see so many people failing to mint on Testnet.

🇪🇺 丰: Пон

Hermès: what is the 25 over here? https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/simple-subscription-plugin.fc#L15

&rey: This converts masterchain (-1) into config param #24 and basechain (0) into config param #25. (reply to 22511)

Hermès: - why config parame need to change here? - And why config parameters are so important? (reply to 22512)

&rey: These two parameters contain transfer fee for messages in masterchain and in basechain, correspondingly. (reply to 22513)

&rey: This transfer fee is used when subscription contract is calculating how much TON it must request from host wallet.

Hermès: ok thank you. Maybe this question is suitable list on Answers.ton.org

int(0.0): Hi guys ... I just fall in the TON rabbit hole xD  Now I got three questions hope you can help with: 1. Is already everything accessable/released which its talked about in the white paper? TON Service, DNS, Proxy, Storage , ... 2. Is there any compiler for other languages than FunC out there? (Like vyper vor solidity) would like something like C, C++, JS, Python... anything more simple than FunC synthax xD 3. What is the best tutorial/guide to start programming with FunC (or others like in 2.)

&rey: 2. Tact (https://tact-lang.org/) / Rift (https://docs.skyring.io/rift) / TVM assembly (🤣) (reply to 22517)

&rey: 1. You may see all plans and ready projects at https://ton.org/roadmap. (reply to 22517)

int(0.0): Thank you looks great :D (reply to 22518)

int(0.0): Is there any good test enviroment out right now? Like hardhat/truffle?

Dario: blueprint  https://github.com/ton-community/blueprint (reply to 22521)

Motty: then we say, suit yourself!

Hermès: Tact is good (reply to 22518)

Yuri: How can I read this cell content: TupleReader {       items: [         { type: 'cell', cell: x{0000000120203_} },         { type: 'cell', cell: x{00000001404060407_} },         { type: 'cell', cell: x{00000001009_} },         { type: 'cell', cell: x{00000001005_} },       ]     } I noticed it happened when I store unit that are not multiple of 1 byte.

User<2142833533>: Hello everyone, I am engaged in a dense study of crypto technologies and I am interested in the question. Anonymous identification of a user through a wallet is cool, but how to regulate the user's age and at the same time remain a new generation project

Hermès: any group that I can find for hiring?  Want to find BD, marekting✌️

Андрей: Host on ton/tor, make a disclaimer "Are you over 18?" if you want (reply to 22529)

User<2142833533>: but its not working with something sensetive like porn (reply to 22531)

shahar: Hi, added support for Minter/Testnet  Example: https://minter.ton.org/jetton/EQBP4L9h4272Z0j_w9PE2tjHhi8OwkrRbTmatKszMyseis05?testnet (reply to 22506)

Андрей: It's literally how every porn site works (reply to 22532)

User<2142833533>: Yes, but how to make porn site, like pornhub and be safe frome child content creators - or onlyfans https://ton.place/feed?section=smart (reply to 22534)

User<2142833533>: Like here - its not confindetional - you information for verification stack on ton.place servers: like in KYC protocols

User<2142833533>: I think one of the must needed solution for web 3.0 its safe and confidentional algorhytm for verification of age and other

User<2142833533>: Privacy-preserving user verification for Web3

User<2142833533>: https://www.dock.io/web3id

User<2142833533>: Web3 ID does not store any user data We only hold user data until the authentication is finished and then immediately delete it. This way, you avoid the risk of storing user data in centralized databases.  But…who control it?

User<5871970700>: wooow, ton.place still alive! (reply to 22535)

Ahmet Said: thanks for test net adding but how can i see my jetton in testnet explorer ?  https://testnet.tonscan.org/address/EQDjUc7m2zSZ_oWh4wvmLf5a3UqOUfSzvBODeY5RXy9EWy7p#transactions just send 5 jetton to my version 4 wallet but nothing shows up in explorer

Apong: i need to retrieve my ton coins i mined from whales pool

Mark Okhman on TON: TON&Co. has some killer update 🚀  🆘  Our regular FunC Q&A will be today with Nick Nekilov from DeDust.io  Russian speaking channel  English speaking channel   Community impact is one of the greatest ways for a project to stand out. Thank you, Nick!  To join the event, follow this link 👉 https://join.toncompany.org/c/onboarding-events/technical-q-a-func-typescript-web-622de7  It starts in 20 mins!   Don't miss out on TON&Co. online technical and business sessions! Here is the events list.

Yuri: I keep getting 34 exit_code on action phase, what that usually means?

Ahmet Said: check your smart contract throw codes it shows its throw reason (reply to 22547)

Yuri: Hmm, I'm using sandbox, know where I can see the reason? (reply to 22548)

Ahmet Said: heres exit code for example

Ahmet Said: it only let u mint if sender is admin

Yuri: These ones are for the compute phase, as far as I know. I'm getting the error in the action phase.

Yuri: The object returned by the tx result: computePhase: {           type: 'vm',           success: true,           messageStateUsed: false,           accountActivated: false,           gasFees: 3733000n,           gasUsed: 3733n,           gasLimit: 5000n,           gasCredit: undefined,           mode: 0,           exitCode: 0,           exitArg: undefined,           vmSteps: 39,           vmInitStateHash: 0n,           vmFinalStateHash: 0n         }

Yuri: Action phase: actionPhase: {           success: false,           valid: false,           noFunds: false,           statusChange: 'unchanged',           totalFwdFees: undefined,           totalActionFees: undefined,           resultCode: 34,           resultArg: undefined,           totalActions: 1,           specActions: 0,           skippedActions: 0,           messagesCreated: 0,           actionListHash: 1016557193545413100498035410295098846945446235253255915907173320893695228842n,           totalMessageSize: [Object]         }

&rey: 34 - Action is invalid or not supported. Set during action phase if current action cannot be applied. https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes (reply to 22547)

Yuri: Ah yeah, I read that, but it's not that descriptive. (reply to 22555)

&rey: Probably, you've serialized outgoing message incorrectly.

Yuri: Hm (reply to 22557)

Yuri: I'm calling the function: () send_msg (slice destination_address, cell big_cell) impure inline {   cell full_msg = begin_cell()       .store_uint(0x18, 6)       .store_slice(destination_address)       .store_coins(0)       .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)       .store_ref(big_cell)     .end_cell();   send_raw_message(full_msg, 0); } (reply to 22557)

&rey: You need to store flag 1, because you store body in a reference. .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) (reply to 22559)

&rey: Also, you send message of zero value with mode zero. Such a message cannot be sent because of transfer fee. You need to send at least 1 nanoTON to recipient + pay for the gas (send in mode 1).

Yuri: Still getting the error (reply to 22561)

Yuri: () send_msg (slice destination_address, cell big_cell) impure inline {   cell full_msg = begin_cell()       .store_uint(0x18, 6)       .store_slice(destination_address)       .store_coins(0)       .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)       .store_ref(big_cell)     .end_cell();   send_raw_message(full_msg, 1); }

&rey: Maybe, the error is in some other action (e.g. set_code)? (reply to 22563)

&rey: However, you are still not sending 1 nanoTON to message recipient. Delivery of such a message is not possible. (reply to 22563)

Yuri: Tried with mode 64, no luck (reply to 22565)

Yuri: I'm just doing this for testing: if (op == op::send_msg) {     ;;cell root = assemble_msg();     send_msg(body, begin_cell().store_uint(10, 8).end_cell());     empty_cache();     return ();   } (reply to 22564)

NecroSyS 🔐 |: cpp? (reply to 22563)

&rey: It seems that destination address is invalid. Could you try send_msg(body~load_msg_addr(), ...);? (reply to 22567)

Yuri: I'm generating the address like this: const destAddr = beginCell()             .storeUint(0, 8)             .storeUint(randomInt(5000), 256)         .endCell().beginParse(); (reply to 22569)

Yuri: added the load_msg_addr() thing (reply to 22569)

Levi: How do I withdraw ton coins from a smart contract?

Yuri: I think you need to implement an op which sends a message with the smart contract balance to another address (reply to 22572)

Levi: Thank you, is this correct:  cell msg = begin_cell()          .store_uint(0x18, 6)          .store_slice(recipient)          .store_coins(amount)          .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)          .store_uint(0, 32)          .store_slice("From SM")      .end_cell();      send_raw_message(msg, 64);

Yuri: Seems correct, the amount should be the balance (reply to 22574)

Levi: Thank you, but it doesn't work on testnet! I don't know why :(

&rey: The correct way is following. const destAddr = beginCell()             .storeUint(4, 3)             .storeUint(0, 8)             .storeUint(randomInt(5000), 256)         .endCell().beginParse(); (reply to 22570)

Yuri: Hmmm, I see, 1 bit of Maybe Anycas, right? addr_std$10 anycast:(Maybe Anycast)     workchain_id:int8 address:bits256  = MsgAddressInt; (reply to 22577)

ℙ𝕒𝕣𝕚𝕤: I was thinking about the unstable situation of stablecoins (they have inappropriate names, their situation is not stable at all these days and there is negative news every moment), it came to my mind since Pavel Durov lives in the UAE and has good relations with the ruler of Dubai, why doesn't he want to create a stable coin in Ton network!  You know that the UAE dirham is pegged to the US dollar and for years the rate per dollar is always equal to 3.67 dirhams.  Now that the United States is a staunch opponent of Telegram and probably won't let the stablecoin dollar be minted in Ton network, then Durov should come and mint TAED (UAE Dirham stable coin in Ton blockchain).  As I said, each dollar is always equal to 3.67 dirhams, so each TAED is equal to $0.272479564032698.  In this way, if the Durov brothers make a decentralized exchange and TAED is used as a stable coin and the gas needed for transfers from Ton coin, I think it can become the best exchange in the world and be at the top with this amount of wealth that exists in this part of the world.

ᴜʟᴛʀᴀ ɪɴꜱᴛɪɴᴄᴛ ᴍᴀʀᴋᴇᴛɪɴɢ®️ 🦴: Hey guys. What is the easiest way to get TON. How to swap BNB or ETH?

ᴜʟᴛʀᴀ ɪɴꜱᴛɪɴᴄᴛ ᴍᴀʀᴋᴇᴛɪɴɢ®️ 🦴: ???

ᴜʟᴛʀᴀ ɪɴꜱᴛɪɴᴄᴛ ᴍᴀʀᴋᴇᴛɪɴɢ®️ 🦴: No one? Wanna swap eth to ton? Why is it so complicated🤨

ᴜʟᴛʀᴀ ɪɴꜱᴛɪɴᴄᴛ ᴍᴀʀᴋᴇᴛɪɴɢ®️ 🦴: I have to swap to usdc first?

ᴜʟᴛʀᴀ ɪɴꜱᴛɪɴᴄᴛ ᴍᴀʀᴋᴇᴛɪɴɢ®️ 🦴: Scammers gtfo from dm

Hasan: C

— 2023-02-17 —

&rey: Tag bits $10 + 1 bit of Maybe Anycast. (reply to 22578)

Jeff: Hi guys! what's difference betweeon toncenter and tonapi?

Howard: can use Tact maybe 😼 (reply to 22010)

Howard: same question when I am learning FunC (reply to 20950)

milad: Hi, I want to recharge my wallet, can you help me?

Howard: again? 🫣 /report (reply to 22595)

milad: /report

milad: Why did I just ask a question? (reply to 22596)

Alex: Guys, there is a task to fork TON blockchain and do all transfers without any fee (0%, 0 TON), can somebody help with this, we are ready to pay for help

James Truong: I am trying to transfer LAVE jetton token. from EQAobBG9xyEtIW1dNmxPfq0wa1wZ9ZfeHnAVKuP_7SJNkXwJ to EQDI8F98obwkJSeS4nPXvh5uZGwLG6mIUOxPdmEj-ZTgueS- via this function. But transation is created only transfer 0.02 TON. but does not transfer 5 LAVE.

James Truong: I dont why is this. Could you help me ?

User: Transfer lave from your wallet to  another and see which contract address it use for create transaction, then paste it into JETTON_WALLET_ADDRESS. (reply to 22601)

Tim: jetton wallet address ends with GJT, but you use fxI

James Truong: Oki, I will update this one

James Truong: I just changed based on above answer but I get the transactions false as like https://tonscan.org/address/EQBDPuoMs6Zl5fJdp0pe2GCc3SVnVVxRvmgZVf8ymwqWDGJT

James Truong: this is detail transaction failed: https://tonscan.org/tx/8rwmfowIOEZNFdob0JqIateTxfeWRYB7J901X0w_Ks4=

James Truong: I lost 0.02 TON but can not transfer 5 LAVE

Howard: - How can we using that? Let's say using a token voting based infra on TVM.   - It's not reliable if we using API to fetch the historical data right? Because that we store by centralized database that we can't verify the liability in general. (reply to 20872)

James Truong: hey https://t.me/TrueCarry , Could you help me? please (reply to 22604)

Tim: I don't want to debug jettons, transactions has exit code, 700 something, open jetton contract and find where it's coming from (reply to 22610)

James Truong: thanks you @Tim (reply to 22611)

Tim: not sure what's wrong with your example, but try to increase amount to 0.05 first (reply to 22612)

James Truong: ok I will try

James Truong: oh, I successs. thanks so much Tim.

Gekodô: Good morning Guys, I have a problem, I want to connect USDT sellers with Buyers using SEPA transaction from Europe, since the demand for users are in 🇵🇹 Portugal, can anyone help me with a solution for this problem???

Martin: I want to pass address of a wallet. how to receive it in my smart contract in .fc file.?

Howard: const a = "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a (reply to 22617)

Martin: no bro. like I want to have an address in recv_internal(), so that I can send message to that address...

Rashmika: Hi guys  Can you give me clarity on the languages that are used in TON?

Victor: Fift/Func for contracts. C++ for running these contracts (low level) JS/Python/Go/others for the high-level interacting (reply to 22620)

&rey: in_msg_body~load_msg_addr() (reply to 22617)

Martin: can you see, I want to pass something like this... (reply to 22622)

Martin: how to receive it in .fc file

Daniil: ^ (reply to 22622)

&rey: int op = in_msg_body~load_uint(32); ... slice to_addr = in_msg_body~load_msg_addr(); (reply to 22623)

Андрей: Nobody's gonna run a giant blockchain for free. And if validators (whoever else) will passively receive income, currency will constantly fall in price (reply to 22599)

Андрей: Do people brute force wallet generation to find funny address?

Tim: Whales have gpu brute force. Around 1kk per second (reply to 22628)

Андрей: Even with GPU?! 🤯🤯🤯

User<6165731821>: t.me/uptits

User<6165731821>: t.me/uptits

Андрей: @uptits

Андрей: Yes

Андрей: Back to the topic: why "GetGems Sales" is a contract, and "GetGems Marketplace" is a wallet?

User<2060215631>: no have wallet.

Martin: when you want to return a slice from a function in .fc file, then to read in .ts file from stack?

Martin: can we directly access the value of any global variable like we do in other languages?

Tim: Yes (reply to 22638)

Martin: you mean we can do this... right?

Martin: ... (reply to 22640)

Tim: Yes

User<6165731821>: Yes

Martin: ok great

Андрей: How it's different from "get_data().begin_parse()"? (reply to 22646)

ᅠ: get_data() contains contract storage data

ᅠ: its get method (reply to 22643)

Tim: I can be wrong, buy I think global params are not initialized at the beginning of execution (reply to 22649)

Tim: You can use load data to populate global params

Андрей: What site can i use to run "get_XXX()"?

Tim: Ton verifier

Andrew: Is it possible on test net? (reply to 22655)

Tim: Probably not

liminal: Which SDK has the best ADNL / RLDP toolkit?

Oleg: You could check https://github.com/xssnick/tonutils-go ADNL UDP, DHT and RLDP are implemented here (reply to 22658)

Андрей: Do you have "op::take_excess()" example?

ᅠ: usage https://github.com/markokhman/sbt-kingyton/blob/6c2619e6d861e25b43fc6cdd0e9ac82014ddb8e4/src/contract/sbt-item.fc  179 line

ᅠ: use github for things like this,  https://github.com/search?q=op%3A%3Atake_excess&type=code (reply to 22660)

User<1518952680>: Is there python function to translate non-friendly address to friendly?

Will: not so sure (reply to 22664)

Coalus: tonsdk.utils.Address('your address').to_string(True, True, True) (reply to 22664)

Ala: Hello everyone I'm just asking if there is any examples of smart contracts that contains strings management

— 2023-02-18 —

𝓢𝓪𝓶𝓾𝓮𝓵: Hello people, could you give me a hand? I have the "short" section blocked for some reason I have tried to put ton.app/ (the name) and as much as you look for variants such as/(the name) https //: ton.app/ (the name) There is no way to add the reference link Could someone tell me what is happening when trying to enter my app?

fesal | Patara 🐢: Can someone other than the owner of the contract can change the state?  Like addr EQBYG1xrmNIJ90Xjr16E448BPtfUISybnqZBfQRc_fyQiGuh creates EQBYG1xrmNIJ235235325fUISybnqZBfQRc_120Bads  and addr EQAo6ZtTJ45DaY7Ow5HKL6f9xy4AwJoRvMTNJhdl7v6e_RfG can send message to  EQBYG1xrmNIJ235235325fUISybnqZBfQRc_120Bads with same init data and init code?

fesal | Patara 🐢: Do i need to check that in contract? If so, how can i do that? Thanks

fesal | Patara 🐢: My contract is one contract for one user

fesal | Patara 🐢: Changing init data every time addr changes

TON Answers Bot (not AI): I've heard about "Ten Lessons" for learning FunC, where can I find them? from Telegram Chat Import  I've heard from the TON Spanish DevChat that there exists "Ten Lessons for learning FunC". Are those video Lessons?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): What would be a good basic pet project to learn FunC with? from Telegram Chat Import  What would be your suggestions on some basic pet projects for studying main concepts of ton? These would be smart contracts to write immidiately after doing the total number of received messages counter tutorial.  🔗 Answer on TON Overflow

User<5807008649>: EQADE_IL9K6T3F4lg5E35q-vCkMrCKJ9cxqqhXx7Wx_zCJ6o

User<5906393387>: Is it still unsafe to use @tonconnect/ui-react in production?

Tim: I don't know, but if it works in your case why not. I think it's working good for generic lib. (reply to 22676)

TON Answers Bot (not AI): How to monitor a price of NFT? from Telegram Chat Import  Is there any API to monitor prices of TON-based NFTs?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113208   🔗 Answer on TON Overflow

Yuri: Hey guys, still having problems with sending a message, someone know what's wrong:     stack: [ 231473000 45169000 C{3300EF3EB08F083D5B9F718A0CF96799CA29F2C61B7A35B337BDCB5610640849} CS{Cell{00b15800000000000000000000000000000000000000000000000000000000000000151500038bd1e8f0202f030c0ac7071b54d81779d667348522825b9735bcaf732490bfd00ac4e5a0061458600000000001ab3f02c7e13eaa40} bits: 705..705; refs: 0..0} 0 ]     code cell hash: 45EF8991371E74B0E233FA5A3992E2E78667234E05D4E78AA679044FA10F4A84 offset: 0     execute SETCP 0     stack: [ 231473000 45169000 C{3300EF3EB08F083D5B9F718A0CF96799CA29F2C61B7A35B337BDCB5610640849} CS{Cell{00b15800000000000000000000000000000000000000000000000000000000000000151500038bd1e8f0202f030c0ac7071b54d81779d667348522825b9735bcaf732490bfd00ac4e5a0061458600000000001ab3f02c7e13eaa40} bits: 705..705; refs: 0..0} 0 ]     code cell hash: 45EF8991371E74B0E233FA5A3992E2E78667234E05D4E78AA679044FA10F4A84 offset: 16     execute DICTPUSHCONST 19 (xC_,1)     stack: [ 231473000 45169000 C{3300EF3EB08F083D5B9F718A0CF96799CA29F2C61B7A35B337BDCB5610640849} CS{Cell{00b15800000000000000000000000000000000000000000000000000000000000000151500038bd1e8f0202f030c0ac7071b54d81779d667348522825b9735bcaf732490bfd00ac4e5a0061458600000000001ab3f02c7e13eaa40} bits: 705..705; refs: 0..0} 0 C{3C4792FB5344AB57046F55C4154A9A31A36D79BFFB8A04BA0238B5EECA4A1973} 19 ]     code cell hash: 45EF8991371E74B0E233FA5A3992E2E78667234E05D4E78AA679044FA10F4A84 offset: 40     execute DICTIGETJMPZ     stack: [ 231473000 45169000 C{3300EF3EB08F083D5B9F718A0CF96799CA29F2C61B7A35B337BDCB5610640849} CS{Cell{00b15800000000000000000000000000000000000000000000000000000000000000151500038bd1e8f0202f030c0ac7071b54d81779d667348522825b9735bcaf732490bfd00ac4e5a0061458600000000001ab3f02c7e13eaa40} bits: 705..705; refs: 0..0} ]     code cell hash: 492E36946E12BC94B00513E1F44A770F365076E1FFCF8ECF961BB7B80B961669 offset: 5     execute LDU 32     handling exception code 9: cell underflow     default exception handler, terminating vm with exit code 9

Yuri: It occurs after executing SENDRAWMSG

Tim: Exit 9 = contract reads more than you sent

Yuri: Yes, I can see that, but think it occurred as part of SENDRAWMSG. (reply to 22681)

Yuri: Can't see where it's wrong

Yuri: code cell hash: 492E36946E12BC94B00513E1F44A770F365076E1FFCF8ECF961BB7B80B961669 offset: 389     execute PUSHINT 64     stack: [ 236304000 50000000 C{EAA0C580BC9D675095286A5A69FC2C34B3C22F5095F3F0BDCBA982624BD6291E} C{6F2B2A989C02B2F01CACFFECE0181576301A6F3E76D5893CC9DFA24C71598A55} 64 ]     code cell hash: 492E36946E12BC94B00513E1F44A770F365076E1FFCF8ECF961BB7B80B961669 offset: 405     execute SENDRAWMSG     installing an output action     stack: [ 236304000 50000000 C{EAA0C580BC9D675095286A5A69FC2C34B3C22F5095F3F0BDCBA982624BD6291E} ]     execute implicit RET

Max: no it does not (reply to 22682)

Max: exit code 9 appears after LDU 32 in your case

Max: which is ~load_uint(32)

Max: maybe it's in an argument of SENDRAWMSG but SENDRAWMSG itself is not at fault

Yuri: Ah, alright, the bounced message was causing this, disabled bounce and it works

Yuri: What you guys think on my solution to func-contest3 task 1? Any recommendations, etc? https://github.com/yuriarthf/func-contest3/blob/main/contracts/task_1.fc

Андрей: Ton dns contract says that the toncoins you pay are burned. Does it mean that there's some passive toncoin income? (Not coming from fees) Or we'll eventually run out of toncoins if we will buy dns adresses?

Daniil: They are just "frozen" forever - basically same as burning (reply to 22691)

Howard: what would it be to get exit code 128? (reply to 20068)

Tim: Custom one

&rey: The income is 1/1.7 TON per block given to validators. (reply to 22691)

User<6089685064>: No, there is small inflation. (reply to 22691)

Андрей: Why do we pay fees, if validators receive passive income?

Howard: keep the network in safety, avoid sybil attack (reply to 22699)

Howard: From a human perspective, free services are often not given the same level of attention or value. Therefore, in a way, it is reasonable to pay for using a certain service.   Just like people answering the questions here as well.

Step: please see private message (reply to 22701)

Nick: Hello, guys. I have a question about quering smart contracts in TON.  How does it might possibly look the way to query all nfts from blokchain that belong to specified address. Obviously they have a certain getter methods, but my kinda question is what is the correct to query a list of those nfts?

Андрей: (Same question)

User<6089685064>: To avoid spammers. (reply to 22699)

Андрей: Can i use jettons as a game win counter?

Step: const payload = beginCell()             .storeUint(0x487a8e81, 32)             .storeUint(0, 64)             .storeRef(beginCell().storeAddress(beneficiary_address).storeUint(min_bid, 64).storeUint(max_bid, 64).storeUint(bid_step, 64).storeUint(extend_time, 64).storeUint(duration, 64).endCell())             .endCell();  is this correct for starting auction? https://github.com/TelegramMessenger/telemint/blob/main/func/nft-item.fc#L237 https://github.com/TelegramMessenger/telemint/blob/main/func/common.fc#L11 https://github.com/TelegramMessenger/telemint/blob/main/func/nft-item.fc#L74

Step: please help anybody (reply to 22707)

Step: 😭

Tse: I'm trying to host a static TON site in TON Storage. I created a bag containing my index.html file and updated the bag id into the "Site" field on TON DNS.  but when I'm trying to open my TON site, it shows that "This file is not on the whitelist. You can run the gateway without the whitelist yourself - GitHub." with a GitHub link of ton-blockchain/storage-gateway

&rey: You have to launch a proxy (gateway) yourself, public one refuses to serve your file. (reply to 22711)

Step: @pcrafter (reply to 22708)

Step: 😔

Step: No one want to help me? 😒 (reply to 22707)

Tse: Does that means users who are using public gateway proxy(the default one comes with MyTonWallet for example) will not be able to access my site? Thanks for the previous answer btw (reply to 22712)

&rey: I haven't worked with auctions, sadly. (reply to 22713)

&rey: Could you share its docs or TL-B schemes? (reply to 22707)

&rey: As far as I think, yes. You could try to use in1.ton.org proxy. (reply to 22716)

Step: Please click the links above (reply to 22718)

Step: Here (reply to 22707)

&rey: Couldn't you send such a message and test if it works? Maybe in testnet. (reply to 22707)

Tse: thanks for your help. do you know why the foundation enabled the whitelist on their proxy server? (reply to 22719)

Step: I don't have this in testnet. I want to make to sure it's correct before sending in mainnet. There is no way to confirm by reading the GitHub contract code? (reply to 22722)

&rey: Otherwise, illegal content could be posted and accessible via that proxy, and that would lead to proxy site (and maybe even ton.org) blocking. (reply to 22723)

&rey: Several times I have made a small mistake that led to message being invalid. I think I've lost (more precisely, not won) 3'000 TON on THC 1 because of that. (reply to 22724)

Tse: But people can still host a TON site via rldp-http-proxy with potentially illegal content and users will be able to access the TON site with illegal content via the foundation's proxy right? (reply to 22725)

Step: In contract, if it's like this int initial_min_bid can i use .storeUint(1000000000,64) ?

Step: Is .storeCoins(amount) equivalent to .storeUint(amount,64) ?

&rey: No. Coins = grams = VarUint16. (reply to 22729)

Step: this? (reply to 22728)

&rey: In this case, no. (reply to 22731)

&rey: https://github.com/TelegramMessenger/telemint/blob/c6e3d326376fa902c932299e6bfd710111ee2fed/func/common.fc#L378 (reply to 22707)

&rey: const payload = beginCell()             .storeUint(0x487a8e81, 32)             .storeUint(0, 64)             .storeRef(beginCell().storeAddress(beneficiary_address).storeCoins(min_bid).storeCoins(max_bid).storeUint(bid_step, 8).storeUint(extend_time, 32).storeUint(duration, 32).endCell())             .endCell(); (reply to 22733)

Step: thanks i am going to check it. (reply to 22734)

Андрей: Iirc you can run your own local mini ton blockchain for these purposes. (reply to 22726)

— 2023-02-19 —

Howard: Also asked in [Answers], what is the logical time define in TVM?   How can we understand it if it is not a practical number that we can use? Checked in WP already.

Nick: Hey, guys maybe someone got answer to that question? (reply to 22703)

Howard: remember there has an API from TonCenter, obviously like you can see in your TonKeeper wallet that shows all NFT you have in specific address (reply to 22703)

Nick: Yeah, I’ve looked through API of ton center and haven’t found any method that helps me resolve the issue directly   The only way see the solution of the task is to create web2 application that will act as proxy and will execute the cron job that  monitors block creation in blockchain, queries for get method in contact, and sync the results in local applications Db. Is this the right approach? (reply to 22739)

Moven: TL-B seems very low-level. Do I need to write a TL-B my own if I'm trying to develop smart contract? In what situation do developers need to understand and write their own TL-B scheme?

Howard: from my understanding, yes. (reply to 22740)

Howard: Normally, we discuss TL-B associated the storage of data in the TVM, or the way we modify data in the smart contract. If you follow the [TEP74-Jetton] and Tact implementations here, you can easily identify where the TL-B points out in each line.  In my opinion, it is more like an API standard that people define if they need it, so that contracts can interact with each other. (reply to 22741)

&rey: Understand - on interaction with other contracts. By the way, schemes used are often informal - not parsable by programs. (reply to 22741)

Yuri: Hey guys, if I use dict_set_ref and provide the value as a cell, can I retrieve as a slice with dict_get instead of dict_get_ref?

&rey: Upon dict_get, you'll get slice with no data and a single reference to your stored cell. (reply to 22745)

Moven: Thanks for ur information. So can I said that the utility of TL-B is somehow similar to ABI but for interactions between contracts? (reply to 22743)

Moven: That's an issue I've been confused for a while. Does the TL-B (.tlb) file actually take part in the process of smart contract deployment? Or just as you've mentioned, not parsable by programs (reply to 22744)

&rey: No, it's rather documentation. (reply to 22748)

Moven: Got it, thanks (reply to 22749)

TON Answers Bot (not AI): Does TON have a Remix equivalent? from Telegram Chat Import  Remix is a great online code editor for developers who want to work with EVMs. Does TON have something similar for the TVM?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there a tutorial anywhere on creating an NFT on TON? from Telegram Chat Import  I'm looking for a good tutorial to make an NFT smart contract on TON.  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Why don't I receive an error when attempting to call a non-existent get method? from Telegram Chat Import  Using the JSON API, I'm attempting to call a get method on a non existing method on a smart contract.   I send a POST request to /runGetMethod.  {  "address": "...",  "method": "nonexistentmethodname",  "stack": [] }   I expect to get an error, but I get the result shown below:  {  "ok": true,  "result": {   "@type": "smc.runResult",   "gas_used": 0,   "stack": [    [     "num",     "0x1083b"    ]   ],   "exit_code": -13,   "@extra": "1661342201.3654168:14:0.5828632398991145"  } }   Does the "-13" refer to the error code 13?  13 - Out of gas error. Thrown by TVM when the remaining gas becomes negative.   🔗 Answer on TON Overflow

&rey: < No, it refers to error thrown by contract when it's launched with unsupported method ID (recv_internal, recv_external, run_ticktock also use fixed IDs). (reply to 22753)

Andrew: tonapi.io has several API methods for querying nfts (reply to 22703)

Andrey: it's a bot, please answer in link below (reply to 22754)

Андрей: Are "Schemas" on tonapi.io used for send_raw_message?

&rey: Yes, I know, and I'm waiting for signing up with TON Connect 2. (reply to 22756)

Андрей: Can i use "wallet v4r2 plugins" to keep enough toncoins required for game session messaging?

TON Answers Bot (not AI): Does TON config update process require any action from the node owners? from Telegram Chat Import  TON configuration parameters can be changed by an election. What does that mean for people running the nodes? In the case such a change happens, all the nodes get updated automatically, or there is some action required from each node owner to update it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113206    🔗 Answer on TON Overflow

&rey: You'll have to withdraw them from user's balance in advance, which implies not so good user experience. (reply to 22761)

liminal: I'm using ton-core sdk. How can i make Dictionary with a bigint-key and a string as a value?

Maxim: Hello guys! I'm trying to realize the creation of wallets through pytonlib but getting this mistake  Exception ignored in: <function TonLib.del at 0x000002593A6F0CA0> Traceback (most recent call last):   File "D:\tonTgWallet\venv\lib\site-packages\ton\tonlibjson.py", line 136, in del RuntimeError: Error in tonlibjson.del: 'TonLib' object has no attribute '_tonlib_json_client_destroy'

Maxim: Just trying to run that code from the example (reply to 22767)

Maxim: Who knows what's wrong? (reply to 22768)

Ruslan: Hello, did you install OpenSSL as it was required in instruction? (reply to 22767)

Maxim: Just tried, didn't help (reply to 22771)

Yuri: Hey guys, can I do something like this: const int P = <some_integer>; int addModP(int x1, int x2) inline asm(P x1 x2) "ADD SWAP MOD";

TON Answers Bot (not AI): What is SendMode in ton-core library and in func in general? from Kalugin Pavel  I'm reffering to this ENUM https://github.com/ton-core/ton-core/blob/main/src/types/SendMode.ts  How to choose a correct SendMode for your send() calls? Is there any difference in SendModes in ton-core and in func (sending messages from contracts)? How to combine different SendModes and what combinations exist?   🔗 Answer on TON Overflow

User<5662080463>: ton development team maybe you will create a bot as a crypto bot, but to sell and buy tokens based on ton?

Daniil: use dex (reply to 22775)

User<5662080463>: we need 2p2 for token creators

User<5662080463>: this is an exchange but we need p2p

Андрей: You mean p2p marketplace from @wallet bot? (reply to 22778)

User<5662080463>: crypto bot automatically transfers cryptocurrencies when payment for Fiat is subject.  need such a platform for the creators of tokens

Daniil: why? (reply to 22778)

Daniil: what's the problem with DEX?

User<5662080463>: it is convenient for buying and selling (reply to 22781)

User<5662080463>: this is for exchange only. (reply to 22782)

Андрей: I'd simply recommend not buying tokens at all ;) (reply to 22783)

Daniil: and what's the difference from p2p exchange? 😁

User<5662080463>: You can buy tokens with Fiat. (reply to 22786)

Андрей: Why not simply exchange before/after going to p2p market? (reply to 22784)

Daniil: buy ton for fiat and then buy token on DEX (reply to 22787)

User<5662080463>: I didn't want to buy a token like that (reply to 22789)

User<5662080463>: need a p2p platform for selling and buying tokens based on ton

B: Ton good payment

— 2023-02-20 —

Hermès: I also noticed that we will get this kind of "series of Tx" if there are multiple recursive Tx with one single message.  I think, in theory, Logical Time (aka LT) can be chopped into tiny timeframes as Nouns in EVM that can distinguish whether the Tx is in the same block or not. (reply to 22737)

Behrang: My current understanding about Logical Time:  When you send a message to a smart contract, and it generates one or more new messages to other smart contracts, and they may generate some too, all of this might happen in a single second, in a single block. Logical Time helps to somehow order messages one after another. (reply to 22794)

Martin: I want to pass address from .spec.ts (test file) to .ts (wrapper file) how do I do so

Martin: like this, see 3rd option in opts object

Martin: ?

Martin: I am passing the increaser.address, you can see the error

fesal | Patara 🐢: Can you try to store address first? (reply to 22799)

Martin: it is stored bro on line 65

fesal | Patara 🐢: No after beginCell firstly store address

Martin: line 65 (reply to 22799)

Martin: you mean like this in like 47 ...

Martin: still the same issue

fesal | Patara 🐢: Can you try to store firstly like this

fesal | Patara 🐢: I am in phone so cannot test it

Martin: like this?

fesal | Patara 🐢: No dude  beginCell().storeAddress

fesal | Patara 🐢: Can you just try this one

fesal | Patara 🐢: And then the uints

Martin: you mean I store it at the very beginning

Martin: oh my bad

Martin: wait bro

Martin: then how do I get it in .fc file?

Martin: look now

Martin: still giving issue

Martin: ?

fesal | Patara 🐢: Cannot understand what is the issue there, will be in office in 15-20 minutes. Will try for you i lf you want

fesal | Patara 🐢: Can you post the code to the github

Martin: jazak Allah Mehmet (reply to 22821)

Martin: it is simple counter contract. I am just adding one thing and that is sending address in recv_internal() that's it. I am very new to FunC. I just create a simple counter contract with blutprint tool.

User<5809517865>: Hi i want make coinbot

fesal | Patara 🐢: Ok will try to help 👍 (reply to 22824)

Martin: ok (reply to 22826)

User<5809517865>: Help me

fesal | Patara 🐢: Don't know anything about coinbots, so sorry 😔 (reply to 22825)

Martin: available now? (reply to 22826)

fesal | Patara 🐢: Will be at office in 3 mins

User<6247944943>: Any idea how we can "update the all royalties fee parameters for those 10,000 NFT Item"?

Martin: ok (reply to 22832)

User<6247944943>: NFT Collection

Tim: You can change royalty

Tim: it's changed on nft collection, not item

Tim: https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-collection-editable.fc#L132

fesal | Patara 🐢: Cannot reproduce the issue, can you just upload the code to the github (reply to 22819)

Martin: https://github.com/Shinwari536/ton-basics.git (reply to 22842)

Martin: this is my code

Martin: can you see it?

User<6247944943>: But we will pass the Collection Content, when Item being minted.   Same as the Royalties Parameters right?   So we will need pay 10,000 Txs to change the royalties fee in each Item? (reply to 22840)

Tim: no

fesal | Patara 🐢: yep (reply to 22844)

fesal | Patara 🐢: will try now

Martin: okay

fesal | Patara 🐢: The issue is not with the address, jest shows wrong line (reply to 22851)

Martin: what's the issue?

fesal | Patara 🐢: your get_addr function

fesal | Patara 🐢: const addr = await counter.getAddress();  your contract returns null but you try to read value

fesal | Patara 🐢: counter.fc line 85

Martin: in Func file? (reply to 22855)

fesal | Patara 🐢: yep

fesal | Patara 🐢: in typescript you try to read null value

fesal | Patara 🐢: that's why it gives an error

Martin: I don't get it bro

Martin: you cannot write await in FunC file bro (reply to 22855)

fesal | Patara 🐢: Counter.fc line 85  (slice) get_addr() method_id {     return addr; }   you return a null value  Counter.ts line 69      async getAddress(provider: ContractProvider) {         const result = await provider.get('get_addr', []);         return result.stack.readAddress();     }   you try to read a null value

Martin: okay

Martin: what's the solution

fesal | Patara 🐢: Just load data and return addr

fesal | Patara 🐢: or on the typescript side do not try to read a null value?

Martin: (slice) get_addr() method_id {     return addr; }  is this not the correct way to load the global?

User<6247944943>: NO need? Or you mean "we can't" (reply to 22848)

Tim: you need to send 1 tx to collection. read message before

fesal | Patara 🐢: No, you need to load them first (reply to 22868)

fesal | Patara 🐢: look at the line 80 or 74

Martin: still

Martin: issue

Martin: please have a look (reply to 22871)

fesal | Patara 🐢: Cuz we still get null

fesal | Patara 🐢: Updating the code via github (reply to 22876)

fesal | Patara 🐢: you can check the changes via my commit

fesal | Patara 🐢: oh i don't have any write permissions

Martin: oh isn't is public?

fesal | Patara 🐢: https://github.com/Iamknownasfesal/ton-basics/commits/main

fesal | Patara 🐢: you can check them from here

Daniil: hello! how can I get pub key from wallet info in testnet?

Daniil: tonapi testnet version not working with cors errors, mainnet version is okay

Daniil: in toncenter api I cannot find methods to get pub key of wallet

Tim: use orbs access

Coalus: You can call get_public_key method of wallet using runGetMethod toncenter method (reply to 22886)

Daniil: 🙏 thank you (reply to 22888)

Андрей: What's the current price for megabyte on ton storage?

Coalus: depends on provider (reply to 22891)

Андрей: But what's it on average? (Sorry, i don't have pc) (reply to 22892)

Coalus: idk, because rn is not a very large number of providers in ton storage   i know only one with rate 0.0001 TON for mb/per day (reply to 22893)

Daniil: There are some providers already? 😳 Can you share where to access them? (reply to 22894)

Coalus: https://ton.cx/address/UQCYNSSutUKJRWI9VgZqpSkBz5E3tfSh60g0SBDxwSP5hakL (reply to 22895)

Vash: Hello guys! Can please anybody explain me what current line means https://github.com/EmelyanenkoK/nomination-contract/blob/04035545e45511ba760cc319b43cf41723b6fe5b/restricted-wallet/wallet.fc#L24   Probably my question is about meaning of first bit in msg

Андрей: It's 375 times more expensive than 100gb for 1 month google cloud subscription 😨 In comparison with more cost-effective plans (2tb/year subscription) the gap is even bigger (reply to 22894)

HT: hi, for ETH-TON bridge,  the transaction seems to be stuck at Oracle confirmation. Anyway I can track that status?

Coalus: market rule, if it is too expensive to use, cheaper providers will appear (reply to 22898)

Андрей: I wish I could've been that cheaper provider 😞

Tim: Buy google plan, store files there, profit

Maks: And if TON goes up in price, which we all wish it would, the gap will be even bigger. (reply to 22898)

Maks: Store files in the Google cloud (with 3-5 replicas), hashes in the TON blockchain - profit. (reply to 22902)

Andrew: or tgfs ;) (reply to 22902)

Daniil: Why do you need hashes then? (reply to 22904)

Maks: To make sure that the file has not been changed. (reply to 22906)

Daniil: Won't save you in case google wants to do something bad (reply to 22907)

Андрей: web TS/JS ton lib only supports https api, but p2p protocol support is possible and is in development?

Андрей: Right? Or it'll only be available to nodejs environment? (reply to 22909)

Andrey: p2p protocol uses ADNL (which built above UDP), so in browser you cant use UDP directly (reply to 22909)

fesal | Patara 🐢: Why doesn't nodes support websocket?

Daniil: what do I need to send in stack field in order to get public key of wallet? (“runGetMethod" on toncenter API)  {   "address": “wallet_address”,   "method": “get_public_key”,   "stack": [     [       "string"     ]   ] }

User<5249936707>: /runGetMethod

User<5249936707>: /runGetMethod

Coalus: example of valid request body (reply to 22913)

Daniil: thanks. I get this response:  "stack": [       [         "num",         "0x1339c"       ]     ],  is this a bug or public key is so short? on mainnet I get correct response (reply to 22917)

&rey: Is the wallet initialized? (reply to 22918)

Daniil: no, how can I do it oon testnet? (reply to 22919)

&rey: Deploy it by sending any message out. (reply to 22920)

Daniil: thank you (reply to 22921)

User<667065854>: If you are building a project and need help building a community, send me a DM.

TON Answers Bot (not AI): Send longer message to smart contract from Alex Kim  Is it possible to send Message to smart contract with 'message' payload that have more than 131 symbols? And if yes, how to parse such message in contract? Official documentation is very poor on that topic https://ton.org/docs/develop/data-formats/cell-boc And I couldn't found any tutorial about it on ton.org docs page  🔗 Answer on TON Overflow

Chak: Folks, could you please give some thumbs up and/or comments to get attention of excercism community and create new track for Func: https://forum.exercism.org/t/create-new-track-for-func/3933

User<6247944943>: which DApp has the most active users / community?

Andrey: In my opinion - DEXes (reply to 22929)

User<6247944943>: Any on-chain data we can check / verify? Like Monthly Active Addresses (reply to 22930)

Andrey: DEXes works on smart contract by design, answer is YES (reply to 22931)

User<6247944943>: Yes, I mean the website or dashboard we can check etc

Andrey: Websites is static pages Wich just gives user-friendly interface for interact with smart contract (reply to 22933)

Danielle: Hi everyone! My name is Danielle and I'm a marketing lead for Sonet.one, a open-source middleware extending Web3 infrastructure & services across Web2 social networks including Telegram and TON!  We have been developing our Soton dApp on TON (https://sonet.one/Soton).  If you have a TON project and would like to participate in an upcoming event in person/virtual in New York please direct message me for more information! Would like to extend it to all TON projects 😊

Daniel Ortega: Hello Guys, could you please repository samples with Unity and  information how to integrate the Ton Blockchain into a simple game

Daniel Ortega: Also do you have repository link to paper-scissors game which got 3rd place during Hackathon #1

liminal: Can someone please explain me what does { 1 } cond mean in fift?

Tigr: import { Dictionary } from "ton-core";  let dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());      dict.set(<key>, <value>);  beginCell() .storeDict(dict) .endCell(); (reply to 22764)

liminal: Thx a lot (reply to 22941)

Tim: This won't work, because you need to use custom encoder for value, not Values.Cell() (reply to 22942)

Tigr: It works here  https://github.com/ton-community/tact-jetton/blob/main/sources/utils/jetton-helpers.ts#L60 (reply to 22943)

Pavel: Hello! QQ: I'm trying to deploy a static site and wondered if ADNL address is a BagID or not?

Vadim: No. You need store your folder with index.html in TON Storage (reply to 22947)

Vadim: I can try to store your site for free. Pm me

Pavel: I have uploaded site content to TON Storage and got a BagID, then I entered BagID to ADNL address input via ton.dns.org. Something is not working, trying to understand what (reply to 22948)

Vadim: Does this Bag available from other storage? Can you download it with add-by-hash <BagID>? (reply to 22950)

Vadim: Maybe network doesn't see your storage

Shaftshaper: Hello everyone, is there someone who know how to recover the tokens from the old whale mining bot ?

M: Yes (reply to 22953)

Shaftshaper: Could you tell me how please ? I have already completed a request form in october but nothing happened (reply to 22954)

Pavel: I can download it via storage-gateway (https://github.com/ton-blockchain/storage-gateway/tree/62517d60ddf13bde78b0fb22d38e1166fd9032a0), using the path /gateway/<bag-id> (reply to 22951)

Vadim: Give me your bagid (reply to 22956)

Pavel: Sent in PM (reply to 22957)

TON Answers Bot (not AI): Step by step guide for working with your first TON wallet (step 7) from Yoel Popovici  I'm following "TON Hello World part 1: Step by step guide for working with your first TON wallet" tutorial and in step 7 I put my mnemonic but the wallet address the console is logging isn't on my testnet or mainet  🔗 Answer on TON Overflow

— 2023-02-21 —

TON Answers Bot (not AI): Are there any libraries that implement the TON standards (TIPs) similar to OpenZeppelin? from Telegram Chat Import  There are TIP standards, but are there interfaces (libraries) that I can use when writing smart contract? Or should I just attept to follow the standard as of now?  🔗 Answer on TON Overflow

.: Hi everyone

.: I'm trying to get Eth Wrapped Toncoin to my Tonkeeper wallet. What's the process for this please and thank you!

Behrang: https://github.com/alirezaravanbakhsh/rps-league (reply to 22937)

Daniel Ortega: Thank you (reply to 22964)

moono: Hi guys. Can I interact with Tonkeeper using Tonweb? If yes, can you give me a reference? really painful right now :-(

moono: I'm sorry if i am rude. I'm not good at English. 😅

Anand: Do we have WTON yet? As in 1 TON = 1 WTON

Xin: In my understanding, you d better use ton connect. (reply to 22966)

moono: OK Thx !! (reply to 22971)

Xin: Ton is friendly to TypeScript, ton core and ton connect. TonWeb is coded in JS.

Daniil: Ton connect is just a tool to connect wallets and interact with them. But you can use additional libraries like tonweb or ton.js to form messages, cells etc (reply to 22971)

Xin: Noted with thanks

Антон: Hello everyone who can help deploy this   https://github.com/TONBANKCARD/gramspay-commerce  deploy it so that it works on the GRAMS [GRM] token issued inside the TON blockchain according to the tokens (Jettons) standard #74

Shelly: everyone how to find out the limitations of FunC ??

Андрей: What is_scam even mean?!

moono: Can't interact with tonkeeper with tonweb?

Kate: Hi everyone! Perhaps some of you are in Lisbon this week? We have a lot of activities in TON Lisbon Hub!)   For example this Wednesday TON Blockchain at the popular event Web3 Wednesday by Chillibangs    How to start growing in the TON ecosystem if you are a beginner developer or specialist with existing products on the market? And which perspectives can already be in a year?  Speaker: Artem Gribanov, Co-founder BlockCzech, R&D Lab, Tonana DAO  How to participate: registration link  Join our telegram channel, there will be a lot of new information: https://t.me/tonlisbonhub ✔

Михаил Х.: The get_nft_data() method from the standard NFT returns a stack with a "content" element of type "cell". But how to unpack it using TypeS? Is there any documentation about this? Help me please.

Victor: Check tonweb source code Method call2 (reply to 22982)

Shelly: Hi Me and my team are trying to build a project on TON chain, I wanted to know what are the limitations of FunC ??

Andrey: Low level data manipulation, no structures/classes/objects/etc. (reply to 22984)

Shelly: Oh! Thanks. (reply to 22985)

Howard: anyone familiar with Jest? or Ton-emulator?    Why the contract statement shows the error?

Maks: add await? (reply to 22987)

Daniil: you can hover the statement with error to see the description in vscode (reply to 22987)

User<5918585456>: Hi guys having a problem when run npm run build            'func' with version >= 0.2.0 executable is not found, is it installed and in path?

Kloy: When I try to vote, it says  Error: argument of type ‘NoneType’ is not iterable  How can I fix? Everything is updated and upgraded already

Anand: I think there's some bug in ton-defi.org/ton-connection on throwing errors while making a connection to OpenMask or TON Wallet. Everytime you're making a fresh connection to the wallets from https://minter.ton.org/ by clicking on "Connect Wallet" , it opens new tab redirecting to the respective extension url. Very tough to establish a connection on refresh. @mrbonezy please have a look.

shahar: That library actually shouldn’t be used. I’ll deprecate it soon because ton connect 2 should answer all your needs (reply to 22992)

Anand: Ok thanks

liminal: ton

User<6247944943>: interesting (reply to 22970)

Ahmet Said: how can i verify deployed code on test net ?

Alex: You can look by the contract's address with testnet explorer. For example https://testnet.ton.cx/address/kQCGMu0PKVjTlmVnauQ4eMZCGrr1OlDfZRKppO7Fb68fDGp1 https://testnet.dton.io/a/EQCGMu0PKVjTlmVnauQ4eMZCGrr1OlDfZRKppO7Fb68fDNH_ (reply to 22997)

Ahmet Said: I mean verified code in func just like it exists in etherscan. (reply to 22998)

Tim: if you verify it - it shows code

Tim: https://verifier.ton.org/

Vali | QS: What happens if we verify the source code in the explorer, but the contract's code gets updated using set_code() instruction? Does the verified source code disappears?

shahar: Yes, you’d need to reverify (reply to 23002)

shahar: Also note that verified code doesn’t appear in testnet yet. (Planned)

Ahmet Said: yes i was about to ask testnet  thanks and its answered already (reply to 23000)

talkol: The source code is indexed by code hash, so if the contract’s on-chain code hash changes, the source code will change/disappear. Also, if you have 100 contracts with identical code hash, it’s enough to verify one of them and all the others will become verified as well (reply to 23002)

Vali | QS: Excellent thanks!

&rey: Will verification for testnet TON be possible?) If so — will verification be cross-chain in order not to store the same code twice? If so — you'll have troubles, because everyone would pay test TON instead of real for verification. 😀 (reply to 23004)

Xalkan: Hi, is there anything like remote-read/remote-fetch to read a contract's state from another one? I know about the get methods for offchain, but what about onchain, any best practice?

&rey: Only messages sending, because the remote contract could be in a separate shard. (reply to 23009)

Xalkan: Okay, thanks. What about onchain signature verification (given the public key, signed data & signature)? (reply to 23010)

&rey: check_signature() (reply to 23011)

shahar: It will be possible, but you’d have to verify on both chains. (reply to 23008)

Ahmet Said: other then using get methods directly what r the benefits of verification in ton blockchain? (reply to 23013)

shahar: For the developer - raises level of trust by contract users.   For the user - lets you inspect the code of the contract you’re interacting with. For any app dealing with substantial amounts this is a must have, otherwise you can’t tell whether there are backdoors or if the dev is dishonest in any way.

Ahmet Said: i see thanks

— 2023-02-22 —

TON Answers Bot (not AI): In FunC, is there an equivalent to Solidity's mapping? from Telegram Chat Import  I have a smart contract that accepts messages from users. I would like to keep a history of requests. How can I save a list of pairs (address, text of the message)? Do I understand correctly that I cannot use tuple for such a case because it has a limit of 256 entries? Are there any best practices for storing such a dynamic list? Similar to a mapping in Solidity.  🔗 Answer on TON Overflow

TON Answers Bot (not AI): What happens if we verify the source code in the explorer, but the contract's code gets updated using set_code() instruction? from Telegram Chat Import  What happens if we verify the source code in the explorer, but the contract's code gets updated using setcode() instruction?   Does the verified source code disappears?   | This question was imported from Telegram Chat: https://t.me/tondeveng/23002  🔗 Answer on TON Overflow

TON Answers Bot (not AI): What specifies the price of a jetton? from Telegram Chat Import  Where is the line of code that specifies the price of a jetton? Is the price of a jetton always what I choose or does it change with supply and demand?  ---  > This question was imported from Telegram Chat:   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Does store_slice act like store_ref? from Howard Peng  Does storeslice act like storeref?  For example, If I use store_slice at sending side, and at receiving side use load_ref and begin_parse would it be fine?  I'm trying to understand the underlaying logic of slice and cell.  If not, what's the most efficient way to store slice as ref?  🔗 Answer on TON Overflow

Nha: hi, is there any API service that translates TON DNS? I mean translate wallet address to name/label

M: Yes (reply to 23021)

Nha: Could you please give me a hint or the link?

changmyeong: Hi admin,  Has FunC something like ecrecover?

Shelly: What kind of dapps cannot be build on tonchain??

M: Yes (reply to 23024)

M: Text me private (reply to 23023)

changmyeong: What is it? (reply to 23026)

Nha: He gonna ask for your recovery keys. Do not talk to him (reply to 23028)

changmyeong: Okay (reply to 23029)

Shelly: Hey, could someone please let me know on this> (reply to 23025)

Step: nothing is impossible in ton blockchain. (reply to 23032)

Shelly: Our team is not familiarized with FunC language. That's why wanted to know. (reply to 23033)

Behrang: One thing that I think is not possible, is Flash Loans. I think since TON blockchain is asynchronous, you cannot get a loan and return it in the same transaction.  I'm not sure if there are other possible ways to implement it in a asynchronous mode. (reply to 23025)

&rey: TonWeb.dns (reply to 23021)

Shelly: Oh, thanks (reply to 23036)

Nha: hi, thank you for your help, tonweb.dns.getWalletAddress('test.ton') only translate name to address. What I need is to translate address to name. (reply to 23037)

Shelly: Hi, would someone please let me know whether can we build an interactive app like Digital Asset Marketplace on tonchain + telegram?

Shelly: Is it feasible?

Jairo: Boa noite

Mike: hi mates, may I know if there are any docs for offline signature and verification in ton wallet, basically similar to opensea login process, may thanks

Andrew: tonapi.io (reply to 23021)

Nha: awesome, thank you so much! (reply to 23046)

TON Answers Bot (not AI): bip39 from bbb  Why wallets Tonhub, Tonkeeper and TON Wallet they give an error when entering the seed phrase generated in an open source service https://iancoleman.io/bip39/? Whereas in OpenMask it accepts a seed. Are the restrictions in Tonhub, Tonkeeper and TON Wallet deterministic vulnerability?  🔗 Answer on TON Overflow

liminal: Do you know how to create a rentable nft with checking if a holder returned nft in fixed time. If not, there should be sth for return it back and maybe punish a holder

User<6152332087>: Yes, write a smart contract (reply to 23052)

changmyeong: Anybody know this? (reply to 23024)

Vali | QS: Have a look at check_signature() (reply to 23056)

changmyeong: i see. thank you (reply to 23057)

Kate: A deep dive into TON ecosystem starts today! There are 3 days ahead for a cool start in TON:   🗓Today, 18.00 TON Blockchain x Web3 Wednesday by Chillibangs. “Web3 in 4 words: Capitalism, Community, Competition and Cooperation” Speaker: Artem Gribanov, Co-founder @blockczech R&D Lab, @tonanadao, and TON Prague Community  Free tickets: here  📍ROVE Bar  🗓25.02-26.02 Hack-a-TONxDoraHacks: educational workshop in Lisbon  25.02 Day 1:  Acquaintance with speakers and mentors, open mic for pitches and free TON Talks!  *drinks and pizza on us! 🎫Tickets and details: here  📍HOOD.pt  26.02 Day 2: Full Boot Camp Day  🎫Tickets and program: here 📍HOOD.pt  We have gathered the best speakers and mentors for easy onboarding and a high-quality start to creating projects on TON Blockchain *Don't forget to register  Our Twitter | Telegram | Eventbrite (forwarded from TON Society Europe: Lisbon🇵🇹)

Steve: Is it possible to commit state of the contract, but on throwing after the fact still bounce the incoming message?

&rey: I think if contract state got changed, incoming message can't be bounced anymore. What if you committed message with mode 64 (forward incoming value), for example? (reply to 23060)

&rey: You can send a failure message with opcode 0xFFFFFFFF, but it's not equivalent to bounce and won't set that flag.

Steve: no, i need bounce. It is required for a lazy deployment, basically even on failed message i want to try to execute deployment code.

Steve: Transparently for users of a contract

&rey: So let's discuss this from blockchain point of view. > What if you committed message with mode 64 (forward incoming value) and also want the message to bounce? (reply to 23063)

Steve: ofc this would break everything

&rey: Then, it's impossible to do this. However, do you need bounce really? If users are sending messages from their own wallets, you may just return remaining incoming value with mode 64. (reply to 23066)

Steve: jeez, ofc i need bounce

Steve: i just need to commit c4 and not c5

&rey: No, there is no partial commit) (reply to 23069)

Dima: Tonkeeper does not scan a QR code. What can be wrong?

User: Wait until it update your balance and try reopen it. (reply to 23072)

Dima: My bad, I generated a QR code for TonHub...

User<6091925019>: PH4VGPIgLD

&rey: Upon checking source code, I've seen Tonkeeper should be able to parse Tonhub links. (reply to 23074)

&rey: https://github.com/tonkeeper/wallet/blob/00c07aaceeb0649b2d8bdf677d8bd564bea7f452/packages/mobile/src/navigation/hooks/useDeeplinkingResolvers.ts#L60 (reply to 23074)

Dima: Well, it did not... (reply to 23076)

Dima: Can you see what is wrong in the contract deployments: https://testnet.tonscan.org/address/EQDn8EQfVXn1Mx5GDa27ebzCEQoD3qwBSuxVheaNyFWVvjjO#transactions ?

&rey: It seems that something is wrong either in code or in sent message, though explorer shows no opcode. Your collection is deployed, you are able to interact with it now. (reply to 23079)

&rey: /report (reply to 23086)

Ihor A.: Does anybody know if tonlib can be build for iOS? Can this lib be used for interacting with tvm? creating wallets / deploying contracts?

Pavel: Has anybody here resolved his .ton address? I'm totally stuck, please dm me if you passed this challenge 😅

Ruslan: What exactly do you need?  I have python code to extract wallet/adnl/subdomain_resolver from a given domain: https://github.com/kdimentionaltree/ton-dns-checker/blob/5fdadd460609f76346762af5f2c2ae828a0692c6/dnschecker/core/dns/utils.py#L103

Amin: سلامتی

— 2023-02-23 —

Arsen: Hi everyone. Where i can get  11K testner coins. That amount is needed for becoming a validator in testnet. Thanks

Pavel: I can't understand how can I send message from client to storage provider. Following the docs I'm making a request to store the data, but I can't find info on how can I activate this request :c (reply to 23090)

Feliciss: You may visit http://webarchive.ton to make a storage request and the request will be automatically activated. Although, the provider is already defined. (reply to 23093)

Pavel: This service is awesome, but I need to do it on my own storage, could you please clarify what is the exact step of sending request to storage provider? After executing command: new-contract-message <BagID> <file> --query-id 0 --provider <address> (reply to 23094)

Moven: I'm trying to keep track of tuple in c4 cell. But still can't figure out how to deserialize data from cell in load_data and serialize data of tuple into cell in store_data part. I've found some references but don't know how to leverage them (https://github.com/TonoxDeFi/open-contracts/blob/main/contracts/tuples/tuples.func).  Have anyone tried to load and store tuple before? Thanks🙏

Feliciss: You can check the source code of step 3 of http://webarchive.ton. It’s already open sourced. (reply to 23095)

Lukas: hey guys is there any method or references about the staking when I issue a ton based token?

User<6152332087>: At the moment, no, just write yourself (reply to 23098)

Lukas: thats sad but thanks for the reply (reply to 23099)

Rahul: I am using func-js. I have codeBOC string. How I can create codecell using tonweb?  I tried but getting error like  - Invalid hex string - to much bytes in BoC serialization

Behrang: Is there any way to get the code cell of the current smart contract?

Nha: hi, what does "inactive" mean for a smc? for example this address is still working but it has inactive status EQBAjaOyi2wGWlk-EDkSabqqnF-MrrwMadnwqrurKpkla9nE

Anand: I am using blueprint and running deploy script for counter contract on testnet. This is Tonkeeper wallet. Why do I get this error?

Victor: Does it work with subdomains? (reply to 23090)

Rahul: Yes they have a function to get codecell "Cell.fromBoc(boc: string | UInt8Array)"  my codeBOC "te6ccgEBBAEAOQABFP8A9KQT9LzyyAsBAgFiAgMANNBsIdMfMO1E0NM/MAHAAZekyMs/ye1UkTDiABGhNDHaiaGmfmE="  everything is working fine with the "ton-core" package but for the current project I have to use "tonweb" (reply to 23105)

Behrang: No I meant a FunC or TVM instruction for getting the current code cell from inside the smart contract. Something opposite of set_code https://ton.org/docs/develop/func/stdlib/#set_code

Spite: https://ton.org/docs/develop/func/stdlib/#get_c3 (reply to 23110)

Step: @truecarry can we use contract.createTransfer.toBoc() created using ton js library in liteserverclient.sendMessage() ?

Rahul: I have a codeBOC and have to create stateInit using tonweb (reply to 23110)

Arsen: Anyone know any testnet faucet giving bigger amounts of test TonCoin ? Around 11k to become a validator in testnet. Will be very thankful if anyone can help thanks.

Behrang: Thanks but that returns a cont not a cell. Need it to use as part of stateInit for another smart contract. (reply to 23111)

Behrang: > Transforms slice s into a simple ordinary continuation c with c.code = s, and an empty stack, and savelist.  Is there anyway to access c.code from a continuation?

TON Answers Bot (not AI): Connect TON wallet to any android or ios app from Affan Ali Khan  Can I connect an android app with any of ton wallet to create a session that can perform different tasks like signing a message, or sending a transaction just like metamask? I am creating an android app and I want to create transaction through my app then sign it using any ton wallet Tonkeeper or Tonhub or any other wallet  🔗 Answer on TON Overflow

Coalus: Who determines the need and divides the workchain into several shards?

&rey: Validators of overloaded shard (as far as I remember, that's over 60% block space/gas usage across several blocks). Merges are determined by validators of both neighboring shards that are able to merge. (reply to 23119)

&rey: Recently, there have been problems in testnet, because more than 1/3 validators were shut down or unable to connect. I doubt you'll receive test TON for purpose of becoming a validator, though you may ask @f_closer. You may try to connect your validator to MyLocalTon, then disabling it will be harmless. (reply to 23116)

&rey: You'll have to do some tricks with JMPXDATA. I think an easier way is to put code in a masterchain library and then reference it from all contracts. (reply to 23117)

&rey: By the way, I also have a question. How can I build validator binaries for Windows from source code myself (to do some patches), how to launch that validator and how to connect it to MyLocalTon? (reply to 23121)

Step: 🥹 (reply to 23112)

Amin: عذر میخواهم چون حس کردم ایرانی هستین فارسی نوشتم،قضیه چیه (reply to 23117)

Amin: چکار دقیقا بایست انجام داد؟؟

Behrang: Thanks. Do you have any code samples for each of these? (reply to 23122)

Behrang: Send your message in private chate please. (reply to 23125)

&rey: I would suggest the code to be the following: SETCP 0 c4 PUSH CTOS PLDREF CTOS BLESS CALLX And put the actual code to first reference of data cell. Of course, you would need to change the code so that this data format is supported. (reply to 23130)

&rey: Though, this way can lead to problems with code verification on tonscan/other explorers. (reply to 23132)

&rey: You haven't included file with recv_internal/main. (reply to 23129)

liminal: is elector's workchain always equal to -1?

&rey: Yes, it's always located in masterchain. (reply to 23135)

Vladimir: i am 4000 participant in this chat. not bad😁

Alex: 3999) (reply to 23137)

Tse: Hi I'm new to FunC. I am trying to figure out how to properly generate a payload to interact with smart contracts. Is there any tutorial, example or documents you would recommend?

&rey: I think you should see old TON Smart Challenges, to get familiar with cell concepts. The tests for TSC1 and TSC2 are provided, which allows to see how the payload is formed. Also, you could examine code of any dApps while also looking at contract code and docs. (reply to 23141)

talkol: https://ton.tools/tutorials (reply to 23141)

Behrang: Let me ask in another way.  Currently, Jettons are implemented by storing the Wallet child smart contract code cell inside the wallet's data cell. Wallet code stores its own code in its data cell.  Isn't this a waste? I think a smart contract should be able to access its own code. (reply to 23132)

&rey: Yes, this is wasting space, though most people don't care. TVM in TON doesn't have GETCODE. Possibly it should be added, as Everscale did. (reply to 23144)

talkol: it will solve just half the waste, still parent needs to hold the child code (reply to 23145)

talkol: but true that there are potentially millions of children so waste is bigger there

Narek: Well i guess code for popular things like jettons or nft’s could be moved to libraries

Dario: yes, it is. And, in my opinion, the solution is the following:   <{ SETCP0     0xHASHLIB hash>libref PUSHREF CTOS BLESS EXECUTE }>c  but sadly looks like there are some broken components that doesnt supports exotic cells, so for now we have to wait. (basically load a code from publib and excute it, so you dont need to store the same long code in all child contract. In internal storage the code used for verification is still this one) (reply to 23144)

Affan: Hi, I am creating an android app and I want to connect my app to the Tonkeeper wallet or Tonhub wallet same as the way it connects to web. How do I achieve that? Please guide. Thank you!'

Teja VC: Where do we get SDK for front end

Teja VC: Couldn’t find that in ton.org/docs

Teja VC: Please help me with this

User<5844664480>: Hello

VV🙏: Hello everyone, tell me, is there an instruction on how to launch a website on the ton blockchain?

&rey: https://ton.org/docs/develop/dapps/tutorials/how-to-run-ton-site (reply to 23156)

Hexablock: Is there any devchat forum. This group is not effective for QA.

Daniil: answers.ton.org (reply to 23158)

User<6247944943>: what will we get in error code 5? Since the out of gas were the same?

Alex: 5 - Integer out of expected range. (reply to 23160)

Ahmet Said: is it possible to call get method of a contract from another contract ?

Alex: No. You should use messages to communicate one contract with another contract. (reply to 23162)

Levi: How can I estimate the transaction fee/gas fee of a transaction before I do it?

Yuri: Hey guys, are there privacy related projects in TON. For example, anonymize transactions for anonymous payments etc.

TON Answers Bot (not AI): Is there TL-B highlighting for Visual Studio Code? from Telegram Chat Import  There are plugins that add FunC code highlighting to Visual Studio Code. Is there something like that but for TL-B?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113988    🔗 Answer on TON Overflow

TON Answers Bot (not AI): Ton-connect sdk in front end jquery/JavaScript in html from eugene tang  hi all im new to this  As i have already build a site using html/css with jquery.  but i am trying to do a ton-connect inside the telegram webapp  which lies to this demo which currently is being done using reactjs https://ton-connect.github.io/demo-dapp/   i am trying to use this code but its not able to work.  which i have followed this link https://ton.org/docs/develop/dapps/ton-connect/integration   <!DOCTYPE html> <html>   <head>     <meta charset="utf-8">     <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>      <style>       body {         width: 1000px;         margin: 0 auto;         font-family: Roboto, sans-serif;       }       .section {         padding: 20px; margin: 20px;         border: 2px #AEFF6A solid; border-radius: 8px;       }       #tonconnect-buttons>button {         display: block;         padding: 8px; margin-bottom: 8px;         font-size: 18px; font-family: inherit;       }       .featured {         font-weight: 800;       }     </style>   </head>   <body>     <div class="section" id="tonconnect-buttons">     </div>          <script>       const $ = document.querySelector.bind(document);              window.onload = async () => {         const connector = new TonConnectSDK.TonConnect();         const walletsList = await connector.getWallets();          let buttonsContainer = $('#tonconnect-buttons');                  for (let wallet of walletsList) {           let connectButton = document.createElement('button');           connectButton.innerText = 'Connect with ' + wallet.name;                      if (wallet.embedded) {             // `embedded` means we are browsing the app from wallet application             // we need to mark this sign-in option somehow             connectButton.classList.add('featured');           }                      if (!wallet.bridgeUrl && !wallet.injected && !wallet.embedded) {             // no `bridgeUrl` means this wallet app is injecting JS code             // no `injected` and no `embedded` -> app is inaccessible on this page             connectButton.disabled = true;           }                      buttonsContainer.appendChild(connectButton);         }       };     </script>   </body> </html>    any advise would be much appreciated.  🔗 Answer on TON Overflow

Yuri: Is it a good idea to send the wallet code in a message, instead of storing it? Or would it impact the fees too much? (reply to 23144)

Kaan: Hi guys. I received my testnet tokens but my wallet still looks inactive. my contract hasn't been deployed in 20 minutes. Is this normal?

Marmi: Hello guys, I'm a Russian who decided to join TON, can anyone explain what's going on in this group?

@A49752: Hey Everyone, Beginner questions warning.  I want to create a contract that one wallet owner can only update. Therefore I'll be happy to know the following: 1. How to store an address on the smart contract? Can I use a global variable for that? 2. what is the data type of a wallet address? Is it a string or a slice? 3. Can the wallet address be fetched from the message data structure? 4. How can I compare two wallet addresses?

Андрей: ton dev chat (reply to 23175)

Marmi: yeah, can i make money?

Marmi: ?

Marmi: do you mind going to private messages?

liminal: Is after_code_upgrade() method necessary in upgradable smc? And what is it need for?

Андрей: I don't mind, but all i can say on how to make money is that there are two ways: scam and actual services.  Under "scam" i mean making thousands of the same NFTs. If you're not a developer (you look like you aren't), you can just copy-paste over and over, or pay someone else maybe a dozen TONcoins to generate thousands of them for you. So called "games" i also apply to this category, but it's more complicated.  And under "actual services" i mean creating something new and useful. (That you can then monetize by adding a little fee or asking for donations.) (reply to 23180)

Marmi: ok thanks i got it

User<6162568171>: Please I’m new and how do I start? (reply to 23182)

— 2023-02-24 —

moono: Hello guys, I deploy my collection first, then, I deploy my NFT from that collection. And transfer my NFT to other address, but transaction is failed with exit code 7. what is wrong?

Howard: Is there any looks like local test-net I can easily visualize the txs like Ganache on EVM?

Howard: OK, founded. (reply to 5431)

Howard: got   11:51:27.290 [MyLocalTon - Dump Block 88] INFO  org.ton.actions.MyLocalTon - (-1,8000000000000000,89)  11:51:27.451 [MyLocalTon - main] INFO  org.ton.main.App - Waiting for UI to start...  11:51:28.454 [MyLocalTon - main] INFO  org.ton.main.App - Waiting for UI to start...   In my commend line, anyone know why?   NO GUI pop-up in my place. (reply to 5431)

&rey: Your contract will be deployed once you wish to use it = send an outgoing message or deploy with a special command. (reply to 23174)

&rey: 1. Global variables don't persist across transactions. You need to store address via putting it in cell and using set_data. 2. Wallet address is slice, usually 267 bit long. 3. your_slice~load_msg_addr() 4. (I'm not sure about whether this function is in the newest stdlib...) int equal_slices(slice, slice) asm "SDEQ"; ... equal_slices(addr1, addr2) (reply to 23176)

Howard: can't upload the image now. But this is the issued when execute on MyLocalTon (reply to 23194)

/var/popey/izhu.ya: Hello guys, where i can check network configuration? im interested at 17 param Cant find anything about stake in global config https://ton.org/global-config.json

Behrang: I don't understand the question. (reply to 23169)

Howard: like this 😵‍💫 (reply to 23194)

Alex: Have you downloaded aarch64 version of MyLocalTon? (reply to 23201)

Howard: yes, I download the prefix with arm64-aarch64, I am using M1 Mac.

Alex: I remember this happening on a VERY slow machines, mostly on small VMs. Thanks for opening issues, I will check what can be improved. (reply to 23194)

Vali | QS: You can see the format in block.tlb and the current value using toncli (reply to 23198)

Howard: hey hey, I just re-started and it works... 😅 (reply to 23204)

Howard: maybe some bug when initialized

Alex: Sometimes blockchain node starts faster than the Java UI 😕There is an infinite loop that waits for UI on start, so one day it will pop up 😀  You can also run: java -jar MyLocalTon debug, this will generate the detailed log files. (reply to 23207)

Howard: can we slow it down a bit, I think my Macbook can't follow up the speed of TVM! 🥴

Hermès: ccol (reply to 23206)

Hermès: is it routed to 127.0.0.1? (reply to 23206)

Андрей: Why java though?

Alex: Yes, i think I need to mention minimum hardware requirements in the readme. It is critical, especially when 7 validators work in parallel) (reply to 23209)

Alex: Yes, ton nodes are running on localhost. (reply to 23211)

Alex: I knew java and there was requirement to be cross platform, so it was quickly started. (reply to 23212)

Howard: Can we extend the block time, for example? I would like to be able to check my smart contract transactions more clearly without being overwhelmed by validator transactions. (reply to 23213)

Андрей: Do you constantly update it because of new features in ton, or it's not required? (reply to 23215)

Alex: No, this comes from validator-engine kernel. This will require binary recompilation. Anyway the changes would be quite massive, it is not trivial. You can stop the autoscrolling in MyLocalTon and peacefully review txs one by one. (reply to 23216)

Alex: Nodes' binaries are up to date. New features come from time to time. I see now, that time has come to go throughout the issues and featues and incorporate them. Will proceed with it soon. (reply to 23217)

User<5116638705>: I transfer ton but back to owner wallet . What is problem

User<5116638705>: ؟

Alex: @yunkijay lets continue our work

🏸: How do I create a smart contract? and where?

🏸: can someone help me?

&rey: I think you need to make address on line 20 unbounceable. As far as I remember, it will start with UQD. (reply to 23220)

Artëm: You can read this: https://ton.org/docs  https://ton.org/docs/develop/getting-started (reply to 23230)

TON Answers Bot (not AI): Who Logged in my telegram login bot from kozanakyel  I created a bot for login and determined the /setDomain. Although I can get the information of the person logging in with this bot at the Client Side,  However when I update the bot information, the /getMe endpoint return me as ok:True and an empty dictionary. How can I find out who logged in via this login bot, and when it terminated the session.  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Telegram auth and usage from kozanakyel  Among the libraries recommended over the python language on the docs, I couldn't find a library or structure that provides this auth part like jwtManager(), and I found very few examples of the auth process. Is there a telegram Auth mechanism you can recommend for an advanced web API (python/flask)  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Endpoint for invote group basically in telegram api from kozanakyel  After identifying the person who is logged in, I want to direct it to the special AI assistant group that we have prepared, what should I do for this, because I could not see an endpoint that directly create a new group or routing to an existing group  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Basic useful enpoints template for beginner from kozanakyel  In Telegram API docs, I could not get the individuals with auth via bot in the libraries given as an example about python. Is there an endpoint docs or basic examples for all endpoints like the swagger where we can find  🔗 Answer on TON Overflow

Daniil: Hello, does anybody knows if any wallet app  supports payment channels acception?

Malcol: Hello guys, I am tring to pass the path for func/fift/lite-client while I am installing toncli. I am taking “permission denied” error. I tried various solutions but couldnt success. Anyone who can help?

liminal: chmod +x func/fift/lite-client? (reply to 23241)

Daniil: how can somebody sign state of payment channel contract?

Daniil: I want to create payment channel from my wallet with somebody, then ask somebody to top up channel with money, and then ask somebody to sign state and sign close channel. is it possible for somebody to do it without code?

talkol: I think usage of a JavaScript library is required for now, not sure anyone created a general purpose client (reply to 23245)

talkol: https://github.com/toncenter/tonweb/tree/master/src/contract/payments  This is the library and the payment channel code

Daniil: thanks for response (reply to 23247)

TON Answers Bot (not AI): Do wallets without transactions lose their value over time? from Telegram Chat Import  It's known that smart contracts on TON have to pay storage fee, it is deducted during each transaction. And if a contract doesn't have any transactions for a very long time, it would get frozen and disappear so it won't be stored eternally for free.  TON wallets are smart contracts too. Does it mean that if a wallet is not used at all for a very long time, its owner will eventually lose all the money in that wallet?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113618   🔗 Answer on TON Overflow

Oleg: 💎 Tonutils Proxy v1.0.0 Released!  Now you can securely access any sites and files located in TON Storage, no whitelist!  Merkle proof checks are implemented, so you always know what you are downloading.  Example of ton storage file, if you want to try after connection: http://85d0998dcf325b6fee4f529d4dcf66fb253fc39c59687c82a0ef7fc96fed4c9f.bag/videoplayback.mp4  Main changes: * TON Storage sites support (with proof checks) * .bag domains support * Core tonutils-go upgrade, DHT speedup * RLDP improvements * RLDP2 ready (needs to be enabled later) * GUI was rewritten to Wails and React  🚀 Download

TON Answers Bot (not AI): Is it possible to make pyramid-like NFT royalty scheme on TON? from Telegram Chat Import  Does TON blockchain let developers set a pyramid-like scheme for selling NFTs where every seller gets a share from all the future resells?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113316    🔗 Answer on TON Overflow

Oleg: 💎 Tonutils Reverse Proxy v0.1.0 Released also!  Tool to host your own TON Site  Main changes: * RLDP2 Support (Seamlessly with RLDP1) * ADNL Server improvements * Minor improvements and fixes (reply to 23251)

Feliciss: https://github.com/tonutils/reverse-proxy/blob/67c14a8da51aae59101f95d0a3a77ebf876d8065/cmd/proxy/main.go#L70 (reply to 23253)

Feliciss: Can you support testnet?

Oleg: Yes, just needed to change url and recompile (reply to 23254)

Oleg: I could recompile for you testnet version if you want

Feliciss: No. I mean can you change it to input parameters? Like -testnet golang flag. (reply to 23256)

Oleg: Hm, I think yes, will do in the next release (reply to 23258)

Tim: having testnet flags for client and server proxies would be super cool

Oleg: Added config url to config "network_config_url" field, released v0.1.1 (reply to 23258)

Oleg: for client proxy will do later too, for cli version (reply to 23260)

Андрей: How much latency p2p ton networking has?

TON Answers Bot (not AI): How to concatenate strings in FunC? from Telegram Chat Import  What is the right way to concatenate strings? I've tried this but didn't succeed:  .store_slice("start test " + VAR1 + " finish text")  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114163    🔗 Answer on TON Overflow

Sky: Hi friends, i have a dapps idea, but , im actually not a dev ... But i would really like to push to realise it anyway since i think its a very good idea ! Do you have any advice to found collaborator/founder , people that would like to create this project with me. Maybe its not the right place to ask, but if you know any platform or tools that can help me found dev willing to work for equity that would be great. Thanks

Mike: what are the tech specs for a testnet validator?

Mike: assuming lower than mainnet

Ihor A.: Do we have documnetation somewhere, where send_mode is described? (for messages)

Tim: Ton docs should have it

Alex: https://ton.org/docs/develop/func/stdlib/#send_raw_message (reply to 23268)

Dario: you can find a library / example here  https://github.com/TonoxDeFi/open-contracts/blob/main/contracts/messages/messages.func (reply to 23268)

Step: hi @truecarry can you tell me how to send external message/raw transaction via ton lite client?

— 2023-02-25 —

Yuri: Hey guys, is there any USD pegged token on TON that I could use for payments in the network (contract pays and receive payments using the jetton)?

TON Answers Bot (not AI): Where is the validator voting history stored? from Telegram Chat Import  I would like to see the whole history of past voting by the validators. How exactly can I do it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114170   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to get the conversion rate of TON to a fiat currency? from Telegram Chat Import  Is there an API to programmatically get the current conversion rate of TON to a fiat currency?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/113809   🔗 Answer on TON Overflow

Danila: Hi, if I need to deposit some tokens before deploying smart contract how tonkeeper or other app manage to deploy wallet at first time?  And is it true, that I pay storage fees for wallet smart contract also?

&rey: If you deploy wallet by sending an outgoing message, you clearly have some TON there. (reply to 23278)

&rey: Yes, you pay storage fees for the wallet contract. (reply to 23278)

Alex: + Smart contract’s balance stored in the blockchain even if a smart contract was not deployed. You can top up(transfer to contract’s address) it before deploying. (reply to 23278)

Danila: As far as I remember, Tonkeeper gives me 24 words and then wallet is created. How they pre-deposit tokens? (reply to 23279)

&rey: Wallet is created without deploying. You can precalculate its address if you know contract's code and data. (reply to 23282)

Danila: Yes, thank you (reply to 23283)

TON Answers Bot (not AI): What delay to set for the transaction to finish? from Telegram Chat Import  I have a wallet that has a jetton in it but no TON coins, so I can't send the jetton from it. I want to send a bit of TON to the wallet and after that send the jetton from it. If I make both these transactions programmatically, what delay should I set between them to be sure that the first transaction has passed and the wallet has received the money before the second transaction will try to use it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113034   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to sort transactions in the order of execution? from Telegram Chat Import  If I want to take a block of transactions from TON blockchain and sort all of them in the order of execution, how should I do it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113621  🔗 Answer on TON Overflow

Step: 🥹 (reply to 23272)

Step: @truecarry please help (reply to 23272)

Step: const body = contract.createTransfer({         seqno: seqno,         secretKey: mysecretKey,         messages: [internal({             value: 1000000,             to: Address.parse('destination address'),         })]     });        const ext = external({         to: Address.parse('my address'),         init: null,         body: body,     })     const pkg = beginCell().store(storeMessage(ext)).endCell().toBoc()      liteclient.sendMessage(pkg) //gives error    please tell me whats wrong in this code (reply to 23288)

Danila: What is storage fee for wallet per year? Just out of interest) (reply to 23280)

&rey: 1 MB is 4 TON, wallet is less than 1/4 KB —> less than 0.001 TON per year. (reply to 23290)

Danila: Thanks) (reply to 23291)

TON Answers Bot (not AI): How can the PUSHINT OP code cause a stack underflow error? from Telegram Chat Import  I wrote a program in Fift, which included the following code:  1 PUSHINT   I receive the following error: "PUSHINT: stack underflow"  This doesn't make sense to me, since it's adding a positive number. How does it throw the stack underflow error?   🔗 Answer on TON Overflow

Danila: Can I upgrade entire smart contract code(recv_internal, method_id's, etc.) with set_code() or only something specific?

Coalus: you can (reply to 23302)

Danila: Yeah, my contract accidently returned an error in all cases, so the update could not happen)

TON Answers Bot (not AI): Can TonKeeper connect to testnet? from Telegram Chat Import  TonKeeper is a widely used wallet for TON mainnet, but can I use it with testnet for development purposes? How can I make it connect to testnet?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113373   🔗 Answer on TON Overflow

— 2023-02-26 —

TON Answers Bot (not AI): How much logic can be feasibly put on-chain? from Telegram Chat Import  If I want to make a board game, in order to show the fairness of the game, I put all the back-end computing on the blockchain.  A board game could require randomness and a lot of logic, could this still be done on-chain?  🔗 Answer on TON Overflow

Андрей: Calling set_code() won't change contract address?

Danila: Yes, address remains the same (reply to 23307)

TON Answers Bot (not AI): How to run integration tests without testnet? from Telegram Chat Import  When developing multiple smart contracts that interact with each other, what can be used for integration testing without putting them all on testnet every time something is changed?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113576   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Why do highload wallets have a limit of 255 simultaneous transactions? from Telegram Chat Import  On TON blockchain there are special highload wallets that can send out multiple transactions at once. But they also have a limit — 255 transactions at once. How was that limit defined? Is there some technical limitation or is it just an arbitrary number set manually?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113198   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Should a P2E game has its own custom token (Jetton)? from Telegram Chat Import  I'm developing a P2E (play-to-earn) game. There will be probably a lot of small transactions. Is it a good idea to create a custom token on TON blockchain to be used as a game currency? Or should I prefer some different approach?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113785   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to create a Jetton? from Telegram Chat Import  I'm interested in creating a Jetton (custom token on TON blockchain). Are there some services that let you do that easily?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113909  🔗 Answer on TON Overflow

Rimsky: Hi guys, I'm learning smart contracts developing on Ton. And maybe my question is kinda stupid but is there any way to create a token on solidity, compile it to func and deploy it to testnet? I tried to use tondev and tonos-cli. these things seem to be outdated, isn't it?

hamoon yaghobi: Professional programmer in func, please send a message

MT: Hi! How can i calculate transaction fee?

Howard: nice question, you can follow here in an overview: https://ton.org/docs/develop/smart-contracts/fees (reply to 23316)

Dario: tonos etc are tools built for everscale. You can easily create a token in ton using minter.ton.org (reply to 23314)

MT: Thanks

Step: i installed mytonctrl now how to start liteserver from it?

TON Answers Bot (not AI): How to transfer all the balance in the wallet? from No Name  https://tonapi.io/transaction/31d2a3344dfaa91e0e89c95417a50a5dd699e89679445c2c5b0568c2fcb6b62a  Here's the one i try to transfer all the balance to myself by using tonweb sdk (https://github.com/toncenter/tonweb), but the transaction broadcast and failed.  I think it is the reason that i did not minus the transaction fee and cause the insufficient balance to finish the transaction . But the estimateFee () return a dynamic value , if i try to minus the fee before i broadcast the transaction , will it causes the few balance left or broadcast fail by lack of tiny transaction fee ?  Tonkeeper do this perfectly and i wonder how they implement this function.  🔗 Answer on TON Overflow

Андрей: After installing mytonctrl, lite-server is already running. You can view the synchronization status through command status, line Local validator out of sync. To create a configuration to connect to your lite-server, use command installer -> clcf. Or to print part of it: installer -> plsc (reply to 23321)

Ahmet Said: after drained to zero , how long it will take to be contract erased from blockchain ?

&rey: It's a good question for testing, though it seems due payments must reach 1 TON. https://explorer.toncoin.org/config#configparam21 (reply to 23324)

Step: does this mean node is syncing?

🏸: Can we use Solidity in ton blockchain?

doni: mytonctrl> status (reply to 23326)

Step: no. just study funC language (reply to 23327)

Step: ===[ TON network status ]=== Transactions per second (TPS): 0.0, 0.0, 0.0 Number of validators: 183(287) Number of shardchains: 1 Number of offers: 0(0) Number of complaints: 0(0) Election status: open  ===[ TON network configuration ]=== Configurator address: -1:5555555555555555555555555555555555555555555555555555555555555555 Elector address: -1:3333333333333333333333333333333333333333333333333333333333333333 Validation period: 65536, Duration of elections: 32768-8192, Hold period: 32768 Minimum stake: 10000.0, Maximum stake: 10000000.0  ===[ TON timestamps ]=== TON network was launched: 15.11.2019 12:44:14 Start of the validation cycle: 27.02.2023 00:32:19 End of the validation cycle: 27.02.2023 18:44:35 Start of elections: 26.02.2023 15:26:11 End of elections: 26.02.2023 22:15:47 Beginning of the next elections: 27.02.2023 09:38:27 (reply to 23328)

Step: nothing about how many blocks synced

doni: can you check your commit hash ?

doni: /usr/src/mytonctrl

doni: i think

Step: [debug]   26.02.2023, 16:37:29.852 (UTC)  <MainThread>  start GetRootWorkchainEnabledTime function [debug]   26.02.2023, 16:37:29.853 (UTC)  <MainThread>  start GetConfig function (12) [warning] 26.02.2023, 16:37:29.853 (UTC)  <MainThread>  GetValidatorStatus warning: ValidatorConsole error: Validator console is not settings [debug]   26.02.2023, 16:37:29.926 (UTC)  <MainThread>  start GetConfig34 function [debug]   26.02.2023, 16:37:30.028 (UTC)  <MainThread>  start GetConfig36 function [debug]   26.02.2023, 16:37:30.308 (UTC)  <MainThread>  start GetValidatorsLoad function (1677427390, 1677429390) [debug]   26.02.2023, 16:37:33.685 (UTC)  <MainThread>  start GetValidatorEfficiency function [warning] 26.02.2023, 16:37:33.685 (UTC)  <MainThread>  GetValidatorEfficiency warning: efficiency not found. [debug]   26.02.2023, 16:37:33.962 (UTC)  <MainThread>  start GetConfig function (15) [debug]   26.02.2023, 16:37:33.980 (UTC)  <MainThread>  start GetConfig function (17) [debug]   26.02.2023, 16:37:34.022 (UTC)  <MainThread>  start GetFullConfigAddr function [debug]   26.02.2023, 16:37:34.083 (UTC)  <MainThread>  start GetFullElectorAddr function [debug]   26.02.2023, 16:37:34.289 (UTC)  <MainThread>  start GetActiveElectionId function [warning] 26.02.2023, 16:37:34.971 (UTC)  <MainThread>  GetValidatorIndex warning: index not found. [debug]   26.02.2023, 16:37:34.971 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   26.02.2023, 16:37:34.971 (UTC)  <MainThread>  start GetLocalWallet function [debug]   26.02.2023, 16:37:34.971 (UTC)  <MainThread>  start GetDbSize function [debug]   26.02.2023, 16:37:34.974 (UTC)  <MainThread>  start GetOffersNumber function [debug]   26.02.2023, 16:37:34.974 (UTC)  <MainThread>  start GetOffers function [debug]   26.02.2023, 16:37:35.576 (UTC)  <MainThread>  start GetComplaintsNumber function [debug]   26.02.2023, 16:37:35.576 (UTC)  <MainThread>  start GetConfig32 function [debug]   26.02.2023, 16:37:36.052 (UTC)  <MainThread>  start GetComplaints function (reply to 23330)

Hermès: No, not yet (reply to 23274)

Step: @d030n please help (reply to 23335)

doni: can you pull out the git log command from /usr/src/mytonctrl ?

doni: did you run the command with the -m full flag ?

Step: i put -m lite (reply to 23339)

Step: i need only lite server function

doni: ok so I dont have expierence on lite server

doni: not sure what sync stand for lite …

doni: try to query your full node with lite client

F: You need to install with key -m full. When installing with key -m lite, the node is not installed. Installed only lite-client, not lite-server. (reply to 23341)

Step: i installed validator-engine separately (reply to 23349)

F: After installing the node in mytonctrl -> status should appear the node/validator section. Inside which the desynchronization time will be written. If this block is not present, then the installation was incorrect. (reply to 23350)

Step: for separate install, i must fill "control" : [           ] block in config.json ? (reply to 23351)

User<6247944943>: 1/ How to get blue mark like @gamee, @CryptoBot, @Wallet for example for my bot?  2/ And why @gamee @wallet is a bot, but without bot in userName?

Daniil: Wrong chat to ask such things (reply to 23353)

Rimsky: Hey, can someone send me a working link to fiftlib.zip? that one from the documentation not working  https://github.com/ton-defi-org/ton-binaries/releases/download/fiftlib/fiftlib.zip

Rimsky: I found it but anyway, 1 thing to fix in docs 🙂

— 2023-02-27 —

Gabriel: hey guys, I am wondering is there any way to obtain onchain randomness when developing smart contract?  I saw there is a random function provided by the stdlib. But this can only generate pseudo-random number. So I am wondering if there is alternatives?

Daniil: There is no way to generate *really* random numbers in computer (maybe only in a quantum one) (reply to 23361)

Daniil: Any random that you see in internet and apps is pseudo-random

Gabriel: Is there a way for us to read it somehow? It doesn't have to be "generated". We're ok if there is a way for us to read it from an oracle or other sources. (reply to 23362)

Daniil: Then you can just generate the random offchain and pass the result to contract on deployment (as I understood, you need to get random on deployment) (reply to 23364)

Gabriel: Not just for deployment, we are looking to betting platform which will requires randomness for each game. And we don't want people to be able to predict the result.

Daniil: https://ton.org/docs/develop/smart-contracts/guidelines/random-number-generation (reply to 23366)

Gabriel: Nice, thanks!

Daniil: It's a bad idea to build 100% on-chain casino. It leads to bad experience for users and risks for owners. (reply to 23366)

Gabriel: We want the part that is related to the result (randomness generation and reward distribution) to be onchain so it's verifiable (reply to 23370)

Daniil: Online gambling websites provide verifiable randomness for many years already (reply to 23371)

Daniil: You just generate the result before the first bet and show hash to users. But be careful and don't hash some simple kind of results like YES/NO

Gabriel: is there a concrete site that I can take a look or try it out? (reply to 23372)

Daniil: I can send you a few links in dm. I don't think sending some casino links in this chat is ok 😁 (reply to 23374)

Gabriel: well received, thank you : ) (reply to 23375)

TON Answers Bot (not AI): Is it possible to turn a seed phrase into a private key and vice versa? from Telegram Chat Import  As far as I understand, a seed phrase (mnemonic words) and a private key are dependent on each other. If I know one of them, can I generate the other from it?   1. If I have a seed phrase, how can I get its private key?  2. If I have a private key, how can I get its seed phrase?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113220   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Where to find validators/staking statistics? from Telegram Chat Import  I would like to know stats on the validators and staking: number of wallets participating in it, amount of coins and so on. There is some info by TON Whales, maybe there is something else like that?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113514   🔗 Answer on TON Overflow

Vinayak Dubey: Hi I had a query. I am running a TON node is there any way I can make, obtain and load snapshots for my node? i looked up online but didnt find any documentation on it

Daniil: What do you mean exactly (reply to 23383)

Vinayak Dubey: for syncing a ton node, i was wondering if there is any way i can sync it using a DB snapshot

Vinayak Dubey: if not readily available any way i can create it myself

Daniil: dump.ton.org

Daniil: Or archival-dump.ton.org for an archival node

Vinayak Dubey: thanks a lot!

hamoon yaghobi: We need a professional programmer to cooperate in the smart contract project in the ton network. Please send a message

Brainoir 💠: Help please! I sent NFT to this address EQA3XezTGMFgyuCUszgToz9udUtsborDztsiRckHOTUsNmjT and now i think make mistake. On tonapi description it's not a wallet it's a smart contract. What i done and waht can do? Sent it further or reverse transaction? Help please, from my side in success case I'll sen my helper 5🌐, all what can do as thanks.

Brainoir 💠: No communication with other side. They understand Blockchain worse than I

Daniil: It's an inactive address (reply to 23391)

Daniil: Maybe the receiver just didn't make any outgoing transactions?

Daniil: Ask them to do so, it will activate the wallet.

Step: TVM has mempool like bitcoin?

Andrew: no (reply to 23396)

Daniil: Well, there are still some message queues (reply to 23397)

Step: how to access and read queue? (reply to 23398)

Daniil: You don't need it (reply to 23399)

Daniil: And you can't really change the order of these messages. They are processed in the order of their Logical time

Step: i just want to read the transaction (reply to 23401)

fesal | Patara 🐢: How can i send batch messages? Like do this and do this stuff in one transaction?

Daniil: Use highload wallets (reply to 23403)

&rey: Currently, you can do nothing, only the other side has control over the NFTs. You may ask them how have they even got this wallet address. (reply to 23391)

Daniil: What do you mean exactly (reply to 23402)

Step: i want to read message/transaction before being added to block or something. (reply to 23406)

Step: is it something possible?

Daniil: Why do you want to do so? (reply to 23407)

Step: i want to compete in transaction race (reply to 23409)

Step: for the purpose of quickly buy nft (reply to 23410)

Daniil: If you already see some tx in that queue, you probably won't be able to compete with it

Daniil: There's still some chance of doing so, but still not guaranteed

Daniil: And also, these "NFT buy" transactions are pretty rare in terms of one single NFT, so there won't be any queue at all (reply to 23412)

Tim: it's about 50\50 actually, but to know tranasctions beforehand you need validator

Step: if two people sending ton to one contract at same time how to be faster and ahead of anyone?

Daniil: Messages are processed in order of their logical time, if we are talking about one exact contract (reply to 23416)

Step: yes single contract (reply to 23417)

Step: how logical time calculated? (reply to 23417)

Daniil: Validator can set almost any logical time to messages that they want. But how it usually happens can be found in the sources of validator engine (reply to 23419)

Step: it has any relation to unix timestamp?

Daniil: No (reply to 23421)

Oleg: Technically it can be done by listening for overlay broadcasts in shardchain network, you can catch external messages with a chance that they not yet reached validator, build your own message and send it directly to validators, then it may be processed faster 😁 but chance is low, it is more like random

Tim: I've tried sending 2 highload messages with interval of 1 second and their execution order is 50/50 (reply to 23423)

Tim: so racing is easy if you know when to do it

Tim: knowing when is very hard, because transactions go straight to validators

Step: can we directly push transaction to validator? (reply to 23426)

Oleg: not straight actually, boradcast goes to 5 random neighbours (reply to 23426)

Oleg: technically yes, over adnl udp you could send broadcast directly, but it is still random, caught message may reach validator before you catch it, you dont know, it is random graph (reply to 23428)

ＡλＩ: Hi will appreciate it if anyone could help me find that Python guide... Looked for it on the Wayback machine, but unfortunately, it didn't save here either... https://t.me/toncoin_chat/103502

User: https://pypi.org/project/ton/ (reply to 23431)

ＡλＩ: Thanks, it's not what I was looking for... The mentioned github.io page had a step-by-step Python guide which is completely deleted. If it's still under development, they should mention that the guide is deprecated, instead of deleting all of them :) (reply to 23432)

Thamer: How to connect a Ton wallet to telegram through a bot conversation, is there any tool or api for that ?

Andrew: github.com/ton-connect (reply to 23434)

Thamer: Can I use it under python ? (reply to 23435)

Andrew: not directly, but it's a standard and you can implement it in python (reply to 23436)

User: https://github.com/stspbu/ton-connect  Here lib for ton connect on python, but if I'm not mistaken it already became legacy and isn't work as stable as TS library can. (reply to 23434)

User<5116638705>: What this error, how can fix it ?

Amin: You need to install openssl-1.1 (library can't find libcrypto.so.1.1) (reply to 23439)

User<5116638705>: How install it ? (reply to 23440)

User: Try download this lib: https://pypi.org/project/pyOpenSSL/ (reply to 23441)

User<5116638705>: No fixed (reply to 23442)

User<5116638705>: How can fix it please help me

Ruslan: Which operating system do you have? (reply to 23440)

Ruslan: I guess it is Ubuntu 22.04. In 22.04 there is no 1.1.1 version of OpenSSL, but 3.0 exists. So you need to recompile binaries for you platform. Also you may download precompiled binaries from this Github Action and put a path to libtonlibjson.so.0.5 file to cdll_path parameter (reply to 23439)

Narek: 🔨Dev tools updates   The latest release of sandbox contains quite a few breaking changes, you can learn about them here.  Changelogs are also available for blueprint and create-ton, but here is a list of the most important changes:  sandbox v0.5.0  - OpenedContract has been renamed to SandboxContract - Get method and send message emulation results now contain log strings (this includes blockchain logs, TVM logs and TVM debug primitives' logs) - Send message result now exposes tree-like structure of the transactions - Empty bodies in bounced messages have been fixed  blueprint v0.3.0  - Several issues on Windows have been fixed, which hopefully makes it possible to properly use blueprint on Windows - NetworkProvider's deploy method has been deprecated in favor of user-implemented sendDeploy and similar methods on Contract instances, as well as newly added waitForDeploy method on NetworkProvider - A template for increment counter script has been added to counter template - Template files have been refactored  create-ton v0.0.10  - Contains new versions of sandbox and blueprint in the template - Checks for git init failures (forwarded from TonTech)

Roman: 💎 Survey for TON developers  Hey, TON devs! You can improve TON with your experience right now! Especially if you have experience with TON Documentation. Your experience could help us improve it! 💪  The TON Onboarding team aims to create a next-generation onboarding experience for everyone: beginners and experienced developers. We can do that together.  That’s why we’ve created a feedback form. We kindly ask all community members to share their experience with development with TON through the survey.  A survey consists of 10 questions and will take no more than 5 minutes.  Share your experience here: 👉 https://tondocs-survey.paperform.co/

User<5116638705>: Ubuntu 20 how ? (reply to 23446)

TON Answers Bot (not AI): How to store strings longer than 1023 bits in TON cells? from Telegram Chat Import  Do I get it right that if my smart contract needs to store a string longer than 1023 bits, I should split that thing in parts and make a chain of cells containing it? Can the length of each part go all the way up to 1023 bits?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114332   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there a "definitive" library for developing on TON? from Telegram Chat Import  There are numerous libraries for interacting with the TON blockchain, so it might be hard for a new developer to choose. Of course, what is the "best" is a highly opinionated question, and this website is not for discussing subjective opinions, so let's not get into that. But maybe there is something like a "most popular", "most functional" or "officially recommended" library?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114231   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is it possible to manage files on a server with a TON smart contract? from Telegram Chat Import  There is a frontend which lets users upload files. There is a server where those files can be stored. Is there a way to manage uploaded files with a TON smart contract? For example, make the uploaded file go to a specific directory on the server based on the rules defined in the contract?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113589    🔗 Answer on TON Overflow

Ruslan: On 20.04 you should simply install it from apt: sudo apt-get install libssl-dev (reply to 23449)

User<5116638705>: What's is it error ?

Ruslan: Absolutely no idea. Could you tell your hardware specs, pls? (reply to 23454)

Андрей: Termux (reply to 23457)

Ruslan: Cpu architecture and model, ram size? (reply to 23454)

User<5116638705>: Ubuntu 20.04 python 3.8.1 (reply to 23459)

User<5116638705>: I'm use https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py

Ruslan: No-no, this is your software. I mean what is your computer specs? (reply to 23461)

User<5116638705>: 1 ram / 1cpu / 25 GB SSD (reply to 23463)

Ruslan: Share the output of lscpu | grep "Model name" please (reply to 23464)

User<5727115339>: Does anyone here have thousands of ETH Goerli testnet tokens ?

User<5159173938>: By any chance, does anyone have any spare TON coins to share (talking testnet, obviously)?  kQDsHLS1xXiFKiojcKs-OegjTKbK3sGk7rp0dXhQfp2y-mGK

User<5116638705>: name:                      Intel(R) Xeon(R) CPU E5-2665 0 @ 2.40GHz (reply to 23465)

Eugene: Hello everyone!  When I try to send external msg to contract in testnet there is always shows me timeout error, but I have given enough time gap.   What can it be, somebody may explain me? 🤔

tX4326: hi guys can someone tell me how many toncoin are needed to run a validator

User<5116638705>: ؟ (reply to 23469)

..: Есть чат на русском скинуть ссылку плиз

Andrew: @tondev (reply to 23474)

Thamer: I think u can use some faucet (reply to 23467)

User<5159173938>: Sure I can. I do.  Yet, it is quite annoying to have a limit of 2 TON per hour per Telegram account. (reply to 23476)

User<5159173938>: However, there is only one Testnet Faucet I know. Please, feel free to share any other I can use! 😏 (reply to 23476)

Thamer: I really couldn't find any other faucet XD

&rey: A question to those who know blockchain details, namely full node developers. I've tried to send a message to address 2:0000000000000000000000000000000000000000000000000000000000000000 (zero address of workchain 2, EQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMTF). The message hasn't got sent, though action phase succeeded: https://dton.io/tx/4E1F615DDD985CC05E87A5FE311A314D830D420D801BAB1EB8677E6B990797DB?time=2023-02-27%2015:27:18. Is that how the blockchain is supposed to work, or is there a bug that must be fixed and corrected as "vertical blockchain"?

— 2023-02-28 —

Eddy Haoyu: Hi guys, quick question, is there any tokens that are currently native to the TON chain?

Yuri: Hey guys, I'm trying to use ' in fift, but it's not recognizing the command or something:

Dmitry | backend4you.ton: there are at least ' and ` - did you used correct one? try to copy-paste character from docs (reply to 23486)

Yuri: Hmm, thought I had tried with "`" before, but it wasn't the case, thanks mate (reply to 23488)

TON Answers Bot (not AI): What is the best way to store the "who follows who" data with TON smart contracts? from Telegram Chat Import  Suppose there is a web3 blog platform where people follow specific writers. Each follower has its own smart contract. Usually data such as "X follows Y" would go to a database, but in web3 we want it to be decentralized and on-chain. What is the best way to store such information?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114286   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there a way to transfer a large NFT collection to a new owner at once? from Telegram Chat Import  There is a wallet with a large NFT collection in it. Now I need to transfer all of it to a different wallet. Sending all the NFTs one-by-one feels very ineffective. Is it the only way, or is it possible to transfer all the collection at once?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113527    🔗 Answer on TON Overflow

hamoon yaghobi: How to find the testnet address from TonKeeper

Dmitry | backend4you.ton: Options, scroll down and tap many times on TonKeeper logo. (reply to 23492)

hamoon yaghobi: ok

hamoon yaghobi: How many coins does the robot pay per day?

User<5802280011>: Noite 🌙 🌃 🌉

Kaan: Hi guys, are there any standart erc-721 or erc-20 contracts that are available in ton? Can't find it on the documentation

Андрей: Here https://github.com/ton-blockchain/TEPs (reply to 23497)

Kaan: Thanks!

Francis: hi guyz, how can i know the reason of failed trx ?   https://tonapi.io/transaction/92d11ca9dd4065dd6231021c66949258e0539b49da9a28b0dfc9851821334168

Tim: gas_credit:nothing mode:0 exit_code:401

Tim: 401 for nft usually means user is not owner

Tim: https://explorer.toncoin.org/transaction?account=0:01a9b66e6ece5edd0405de5c5564cbdd6b195a21d3505aaf16d6b9fcaef56f58&lt=35643570000005&hash=879f93a020353916ffe33e6086cb293fd6dadefedbf81ef2f2caba1153d4b023

Narek: ton-contract-executor@0.7.0 has been released!  This release drops the old ton dependency in favor of the new ton-core. It also contains a few other changes, you can read about them here. (forwarded from TonTech)

Step: can we know the validator that processed the transaction ?

&rey: You need to find out its block and query its creator stats. (reply to 23505)

Step: i am here https://explorer.toncoin.org/block?workchain=0&shard=8000000000000000&seqno=33280150&roothash=517629437A4E8EE20E0B04673A425931067B9F75922F7B18CCC04F68271D288F&filehash=B25B5C3EF1E88F128442AF4A2756AF97A7F48B43D046BF9A51C71A87C2A7AC51    what is next?

Step: 🤔

&rey: View block -- gen_validator_list_hash_short (reply to 23507)

Step: gen_validator_list_hash_short:2039534022 cant we know more about it? like ip address? (reply to 23509)

Step: ? (reply to 23510)

&rey: Hm, the possible way is to query creator stats for current and previous block and find out validator's public key or its first bytes. (reply to 23510)

­: Hello, who worked with rldp-http-proxy? I try to start the proxy according to the instructions, as a result I encounter the error "rldp-http-proxy: command not found" when I enter rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json. I enter from the console into linux. Help please

Ruslan: Hello, try to start proxy from different directory. It seems you are in build directory now (reply to 23513)

Ruslan: It creates folder “keyring” which is already exists in build folder

Step: what this seq mean here? is it the actual order of transaction processed in the block? (reply to 23512)

Steve: yes

­: linux doesn't recognize the command at all. (reply to 23515)

Step: lower lt coming down the list why? (reply to 23517)

Ruslan: Now you need to use absolute path to your binary (reply to 23518)

Step: https://explorer.toncoin.org/block?workchain=0&shard=8000000000000000&seqno=33280150&roothash=517629437A4E8EE20E0B04673A425931067B9F75922F7B18CCC04F68271D288F&filehash=B25B5C3EF1E88F128442AF4A2756AF97A7F48B43D046BF9A51C71A87C2A7AC51   explorer showing wrong order of list? (reply to 23519)

Tim: lt is tied to account

testertesterov: Hello. I tried this instruction from TON Drop, but I also failed to implement my localhost:80 through a proxy from TON. (reply to 23514)

Step: can you explain? (reply to 23522)

­: try it. now linux type "permission denied". (zsh: permission denied: ) (reply to 23520)

Ruslan: Make sure, you have permissions to create folders in your current dir

­: i do it with sudo (reply to 23526)

Ruslan: Please attach logs (reply to 23529)

­: how?

Андрей: To get NFTs owned by a wallet, i have to download the whole transaction history of that wallet and analyze all messages with transfer_ownership type?

J: Qq

Master: Hello everyone. In TON, Jettons are transferred without any approval of users?

Master: And what's this? I don't understand this.

Daniil: Only user can transfer their jettons (reply to 23535)

Daniil: It's tlb scheme of message body  Read more in docs:  - https://ton.org/docs/learn/overviews/tl-b-language  - https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages (reply to 23536)

Daniil: Sadly, but the NFT & Jetton standards does not require the notification message to be sent (it's not necessary by the standard). You basically need to parse the whole blockchain history.. or use the existing APIs like tonapi.io (reply to 23533)

Daniil: By the way, what's the reason to not force the jettons & NFTs to send that notification? Just to save a few 0.001s TON in fees?  There's no possibility to create a wallet that supports NFTs & Jettons without using some 3rd party APIs because of that. (reply to 23539)

&rey: Nothing stops from modifying the standard, except that currently deployed NFTs would not support that. By the way, there could be implemented a feature "upgrade from". (reply to 23540)

Daniil: Hm... But anyway, even if the notification is always sent, we can't really be sure that some old notification is stored on full nodes... (reply to 23540)

&rey: Archive dumps can be checked to be truthful and complete. (reply to 23542)

Daniil: But there's no guarantee that these archival dumps will exist forever. And at some point, all archive nodes may just disappear (reply to 23543)

&rey: They can be "compressed" (all non-notifications could be pruned from tree). However, this requires a way of proving that everything pruned is not transfer notification... (reply to 23544)

Tomer: Hey friends, I need some help integrating my smart contracts to my flutter app, if anyone here is familiar and interested, please DM me, thanks.

TON Answers Bot (not AI): Does FunC allow to call functions recursively? from Telegram Chat Import  Is it possible to call a function in a recursive way in FunC? If so, how exactly should I do it? Is it covered in the FunC documentation?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/87071   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to check the current global gas limit? from Telegram Chat Import  How to check the current global gas limit?  As far as I understand, on TON blockchain there is a globally set gas limit, and its value usually stays the same, but hypothetically it could be changed. If it is so, how to check the current limit value at any given moment?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113797   🔗 Answer on TON Overflow

TON Answers Bot (not AI): What is the ADNL address used for TON Sites? from Telegram Chat Import  I am trying to deploy a static website to TON Sites. What is the "ADNL address" used for linking the domain and where can I get it?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/113575   🔗 Answer on TON Overflow

­: Hello, does anyone know how to fix this error "Error: could not load cache"? command - "cmake --build . --target rldp-http-proxy"

nyf-nyf: Hi guys. I'm trying to make a Request to store my Bag on my storage provider. I configured my storage provider, created contract. I made a request with command  `new-contract-message <BagID> <file> --query-id 0 --provider <address>`  Now I have a file with body. But I can't guess what should I do now? The docs says send the message with this body to the provider's address. How can I make it? I've tried to use lite-client (sendfile command). Also I tried to base64 encode the file body and send it to the provider address using my TonKeeper wallet, but it says that message is too long.

Y̷A̷M̷I̷: hi guy, i am new on ton, i would learn development

Y̷A̷M̷I̷: I would like to learn to program

Y̷A̷M̷I̷: where can i start from scratch?

Андрей: Can government ban adnl?

Vadim: Validators can ban your wallet. So maybe same story with adnl (reply to 23556)

Ahmet Said: how can i set get method to see the balance of my contract ? any clue ?

hamoon yaghobi: Send a message to a professional programmer

User<5116638705>: How can transfer ton with python

User<5116638705>: Vps Ubuntu 20.04 (reply to 23562)

Bert: How much is 1 ton?

Salandra: We are looking for funding (reply to 6172)

Feliciss: You can try to look at http://webarchive.ton on step 3. (reply to 23551)

Arti: DM (reply to 23565)

Y̷A̷M̷I̷: Guys how can I start from scratch learning to code?🥲

Y̷A̷M̷I̷: When I'm in testnet, I can't mount token on jetton, is there any other way?

— 2023-03-01 —

Андрей: Can validators ban individual contracts too? (reply to 23557)

Андрей: afaik TOR used webrtc with fake video stream to trick Russia's censorship (reply to 23557)

achai: Can someone help me？What does "Mutable" mean in TON browser? If the value is YES, does that mean the contract code can be modified?

Y̷A̷M̷I̷: Nobody answering.

Y̷A̷M̷I̷: I thought it was useful to stay here.

Berke: I keep getting  throw Error(`value is out of range for ${bits} bits. Got ${value}`);  while Im trying to sendTransaction with any value(1 or 0.01 doesn't work). Even when I haven't modified the tutorial codes. Any idea why? Seems like bitbuilder gets undefined variable somehow

Step: did you use toNano('0.01') ? (reply to 23583)

Berke: No, I will try asap

Step: if you can show your code snippet i can try to help

Step: yes we barely get any reply from senior ton developers. its disappointing. (reply to 23581)

Y̷A̷M̷I̷: You are right 🥲 (reply to 23587)

Berke: Well the most basic one is from the https://ton-community.github.io/tutorials/01-wallet/  await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",         value: "0.001", // 0.001 TON         body: "Hello", // optional comment         bounce: false,       })     ]   }); (reply to 23583)

Berke: Tried doing value:  value: toNano(1), it turned same       throw Error(`value is out of range for ${bits} bits. Got ${value}`);                       ^ Error: value is out of range for 8 bits. Got undefined

Step: change value: toNano("0.01")    input is string (reply to 23589)

Berke: I think it is sting | number | bigint I changed to  value: toNano("0.01") but still same error, tried with value: toNano("1") too same

Berke: Weird, does the tutorial code work for you?

Step: check line numbers of error origin  , error value does not mean sendtransfer param value. error should be from somewhere i think.  https://github.com/ton-core/ton-core/blob/43472ce33212995584ed0193d0ce31a881a213a1/src/boc/BitBuilder.ts#L96 (reply to 23592)

Berke: Yeah exactly, sorry should've provide you the full error, will try something and update it

Berke: Oh btw, just checked, Tonweb uses amount: TonWeb.utils.toNano("0.001") in its transfer function

Berke: I was rying the tutorial with npm ton

Berke: What are people using for SDK? TonWeb or npm ton

Step: I have used both. But ton is widely used i think. (reply to 23599)

doni: npm ton (reply to 23599)

Berke: Thanks for the answers, tried with new package installs, npm ton keeps giving same undefined error even though im not modifying anything on the packages or code, TonWeb worked for me

Steve: Does anyone know what is expected behaviour of calling impure function from pure one?

Berke: I needed to specify sendMode for some reason, maybe npm ton just got updated (reply to 23589)

Hermès: Any API I can track a wallet address having a collection NFT or not?

Step: tonapi.io ? (reply to 23605)

Step: /nft/searchItems

Step: https://tonapi.io/v1/nft/searchItems?owner=&collection=&include_on_sale=true&limit=1000&offset=0

Hermès: It's kind of slow. I can't be sure whether it's because on the test-net. (reply to 23608)

Step: howmuch slow it is? blockchain transactions always slow it need to be validated and confirmed in block 🤔 (reply to 23609)

TON Answers Bot (not AI): toncli why fift not exacutable from kozanakyel  ERROR: Command ''/home/kozan/Documents/ton-func/fift', '-V'' died with <Signals.SIGILL: 4>.  fift in project directory and i made it exacutable via the chmod +x buut toncli read the func however not read fift why???  🔗 Answer on TON Overflow

&rey: /report (reply to 23614)

Vladimir: Hi everyone! are there any limits in contracts for writing to storage in c4?  I try to load this data, but when I code in contract deal_code  (int, slice, slice, cell, slice) load_data () inline {     var ds = get_data().begin_parse();     return (             ds~load_uint(64), ;; id             ds~load_msg_addr(), ;; owner_address             ds~load_msg_addr(), ;; history_keeper             ds~load_ref(),      ;; deal_code             ds~load_msg_addr() ;; address of buyer     ); }   i am trying to load data from c4 but when i write more code in contract Deal I cannot do it

User<5116638705>: How can use testnet on python lib?

Howard: it's not good for UTC+8 😞 (reply to 23619)

Maksim: Hey everyone! I'm excited to announce the release of TonTools v2.0, a Python library for working with the TON blockchain.  The new version comes with a completely revamped architecture.   · Devs can choose from several providers to interact with the blockchain, including LsClient, TonCenterClient, and TonApiClient.  · I have implemented class-based approaches to work with contracts, including Contract, Wallet, NftItem, JettonWallet, and more.  · There are several new features added to the library, including jetton scan, jetton-wallet scan, nft transfer, jetton transfer, and multi-recipient transaction processing.   · Changed, improved and optimized most of the functions from the first version of the library.  Link: https://github.com/yungwine/TonTools.  issues, PR and stars are welcome  If you have any questions or feedback, feel free to ask here or send me a direct message

Андрей: Does it support direct adnl usage? (Without endpoints such as toncenter or tonapi) (reply to 23621)

Maksim: currently no, i think I'll inplement this in future (reply to 23622)

Step: Howmuch GB is the size of entire ton blockchain?

Step: Is it 2GB currently?

Steve: 2tb

Step: TB? (reply to 23626)

Steve: tb

Step: https://ton.org/docs/participate/nodes/run-node#hardware-requirements

Steve: it is in two states, one is just current state of bch, it is quite small, ~30gb, full transaction history 2tb compressed, 4tb in total

Step: Can I run the node in small vps?

Step: Disk 50GB (reply to 23631)

Step: Server with TBs of SSD is very expensive

Step: How to configure node for only current state? I don't need older transactions (reply to 23630)

Steve: it is a default settings

Step: So i can run the node in a vps with storage 50GB? (reply to 23635)

Abdalrahman: hello, I am creating an webapp to let the user scan a QRcode then he will give the webapp the access for his account, then the webapp retrieve the user account info wallet, balance ,transaction history. I am using Quasar (vuejs framework)  but I didn't know which library should I install to my app and what do I need to prepare or create before

Step: ? (reply to 23636)

Step: do i need to have 10K ton to use validator-engine?   i installed mytonctrl with -m full it said successful and complete. now how to activate liteserver ?

Step: ???? (reply to 23639)

Step: MyTonCtrl> status [debug]   01.03.2023, 19:11:14.357 (UTC)  <MainThread>  start GetRootWorkchainEnabledTime function [debug]   01.03.2023, 19:11:14.357 (UTC)  <MainThread>  start GetConfig function (12) [warning] 01.03.2023, 19:11:14.368 (UTC)  <MainThread>  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a number, not 'NoneType' [debug]   01.03.2023, 19:11:14.571 (UTC)  <MainThread>  start GetConfig34 function [debug]   01.03.2023, 19:11:14.783 (UTC)  <MainThread>  start GetConfig36 function [debug]   01.03.2023, 19:11:14.948 (UTC)  <MainThread>  start GetValidatorsLoad function (1677695814, 1677697814) [debug]   01.03.2023, 19:11:18.796 (UTC)  <MainThread>  start GetValidatorEfficiency function [warning] 01.03.2023, 19:11:18.796 (UTC)  <MainThread>  GetValidatorEfficiency warning: efficiency not found. [debug]   01.03.2023, 19:11:18.960 (UTC)  <MainThread>  start GetConfig function (15) [debug]   01.03.2023, 19:11:19.541 (UTC)  <MainThread>  start GetConfig function (17) [debug]   01.03.2023, 19:11:19.712 (UTC)  <MainThread>  start GetFullConfigAddr function [debug]   01.03.2023, 19:11:19.877 (UTC)  <MainThread>  start GetFullElectorAddr function [debug]   01.03.2023, 19:11:20.123 (UTC)  <MainThread>  start GetActiveElectionId function [warning] 01.03.2023, 19:11:20.336 (UTC)  <MainThread>  GetValidatorIndex warning: index not found. [debug]   01.03.2023, 19:11:20.337 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   01.03.2023, 19:11:20.337 (UTC)  <MainThread>  start GetLocalWallet function [debug]   01.03.2023, 19:11:20.337 (UTC)  <MainThread>  start GetDbSize function [debug]   01.03.2023, 19:11:20.342 (UTC)  <MainThread>  start GetOffersNumber function [debug]   01.03.2023, 19:11:20.342 (UTC)  <MainThread>  start GetOffers function [debug]   01.03.2023, 19:11:20.678 (UTC)  <MainThread>  start GetComplaintsNumber function [debug]   01.03.2023, 19:11:20.678 (UTC)  <MainThread>  start GetConfig32 function [debug]   01.03.2023, 19:11:20.737 (UTC)  <MainThread>  start GetComplaints function ===[ TON network status ]=== Transactions per second (TPS): 0.0, 0.0, 0.0 Number of validators: 187(292) Number of shardchains: 1 Number of offers: 0(0) Number of complaints: 0(0) Election status: open  ===[ TON network configuration ]=== Configurator address: -1:5555555555555555555555555555555555555555555555555555555555555555 Elector address: -1:3333333333333333333333333333333333333333333333333333333333333333 Validation period: 65536, Duration of elections: 32768-8192, Hold period: 32768 Minimum stake: 10000.0, Maximum stake: 10000000.0  ===[ TON timestamps ]=== TON network was launched: 15.11.2019 12:44:14 Start of the validation cycle: 02.03.2023 01:21:23 End of the validation cycle: 02.03.2023 19:33:39 Start of elections: 01.03.2023 16:15:15 End of elections: 01.03.2023 23:04:51 Beginning of the next elections: 02.03.2023 10:27:31

Step: help me please

Step: 😭

Oleg: Your node is active, liteserver works, 10k needed to be a validator, no ton needed to just run a full node  2tb is archival node, simple full mode is ok to run with small disc, it takes near 100gb month I think  You could configure it to not store state and transactions longer than a week (reply to 23641)

Oleg: To get liteserver key execute installer command in mytonctl, then plsc command

Oleg: Then use it to connect in tonutils lib or etc

Андрей: Most likely he means that he does not have section ===[ Local validator status ]=== in his status This is due to the fact that he set mytonctrl in lite mode: https://t.me/tondev_eng/23340  If you want the mytonctrl to display the status of the node, you need to uninstall and reinstall it with full mode: https://t.me/tondev_eng/23349 (reply to 23644)

Step: no. i installed mytonctrl on a new vps with -m full (reply to 23647)

@A49752: Hey, Is there any way to write an init function that would run only once when the contract would be deployed?  To add some context, I want to be able to edit some information from the wallet only via one address, which would be stored when I deploy the deploy the contract.

Step: plsc shows ip,port,key like we see in ton.org/ton-global.config.json but if i try to use in lite client it shows connection refused error. (reply to 23645)

— 2023-03-02 —

Daniil: Just insert that address to StateInit (data cell) (reply to 23650)

&rey: On top of recv_internal you can check if contract data is empty; if it is, run init function. (reply to 23650)

Howard: what do you mean slave node? (reply to 9552)

Howard: Have you fix this?   maybe you should provide an integer parameter for the PUSHINT instruction?   For example, can you could try 123 PUSHINT to push the integer value 123 onto the stack? (reply to 9677)

Daniil: "have you fix this?"  - no, but I understood why it was throwing the error. "PUSHINT" is tvm-asm instruction and required for assembling the smart contract. Analogue from Fift is just writing number "1" or any other that you want (reply to 23656)

doni: checkout the nft contract (reply to 23650)

doni: it has this logic

doni: https://github.com/ton-blockchain/token-contract/tree/main/nft

Mohsen: Hello everyone. Did anyone manage to fix this? I'm following the tutorial and the last two steps worked fine. but this step I get the same error. Linux / node v18.12.1                 throw Error(`value is out of range for ${bits} bits. Got ${value}`);                       ^ Error: value is out of range for 8 bits. Got undefined     at BitBuilder.writeUint (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton-core/dist/boc/BitBuilder.js:83:23)     at Builder.storeUint (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton-core/dist/boc/Builder.js:110:20)     at createWalletTransferV4 (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton/dist/wallets/signing/createWalletTransfer.js:110:24)     at WalletContractV4.createTransfer (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton/dist/wallets/WalletContractV4.js:79:66)     at WalletContractV4.sendTransfer (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton/dist/wallets/WalletContractV4.js:68:29)     at Proxy.<anonymous> (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton-core/dist/contract/openContract.js:38:47)     at main (/home/mohsen/Work/t25/darix/func_test/ton_tut/step9.ts:26:24)     at processTicksAndRejections (node:internal/process/task_queues:95:5) (reply to 23590)

Step: help me (reply to 23651)

Step: 🥹

Mohsen: Update: Checked my wallet version, it was v3r2, [it was v4r2] changed the code, const wallet = WalletContractV3R2.create({ publicKey: key.publicKey, workchain: 0 });  now it says "wallet is not deployed". but it is deployed: https://testnet.tonscan.org/address/EQCKr49f_7hWoETpzrMLaBkPl-kVdqmsmdnqLLCQ0_sDSvvd the step before even shows my balance correctly. (reply to 23661)

Step: check the api endpoint that you use in tonclient (reply to 23667)

Mohsen: what should it be? I just copied it from the tutorial   const endpoint = await getHttpEndpoint({ network: "testnet" }); my wallet is on testnet. (reply to 23668)

Alex: It means your endpoint wrong or you accidentally spoiled you wallet’s mnemonic in script.  You can calculate StateInit and Address and print it in console to check. (reply to 23667)

Mohsen: If my mnemonic was wrong it shouldn't show my correct balance. (reply to 23670)

Step: are you using ton or tonweb library?

Alex: Here it is V4R2 btw. You invokes wallet V3R2. Is it ok? (reply to 23667)

Mohsen: this is the code (minus the mnemonics) copied from step8 https://ton-community.github.io/tutorials/01-wallet/   import { getHttpEndpoint } from "@orbs-network/ton-access"; import { mnemonicToWalletKey } from "ton-crypto"; import { TonClient, WalletContractV4, internal, WalletContractV3R2 } from "ton";  async function main() {   // open wallet v4 (notice the correct wallet version here)        //   const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)    const mnemonic = "learn nature..."; // your 24 secret words (replace ... with the rest of the words)    const key = await mnemonicToWalletKey(mnemonic.split(" "));   console.log(key.publicKey)   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });    // initialize ton rpc client on testnet   const endpoint = await getHttpEndpoint({ network: "testnet" });   const client = new TonClient({ endpoint });    // make sure wallet is deployed   if (!await client.isContractDeployed(wallet.address)) {     return console.log("wallet is not deployed");   }    // send 0.001 TON to EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI   const walletContract = client.open(wallet);   const seqno = await walletContract.getSeqno();   await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",         value: "0.001", // 0.001 TON         body: "Hello", // optional comment         bounce: false,       })     ]   });    // wait until confirmed   let currentSeqno = seqno;   while (currentSeqno == seqno) {     console.log("waiting for transaction to confirm...");     await sleep(1500);     currentSeqno = await walletContract.getSeqno();   }   console.log("transaction confirmed!"); }  main();  function sleep(ms: number) {   return new Promise(resolve => setTimeout(resolve, ms)); } (reply to 23672)

Mohsen: I checked again. my wallet is indeed v4r2. I was looking and the wallet which sent me the 2 TONs. (reply to 23673)

Mohsen: After I corrected my wallet version, I get the same error I was getting:  throw Error(`value is out of range for ${bits} bits. Got ${value}`);                       ^ Error: value is out of range for 8 bits. Got undefined     at BitBuilder.writeUint (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton-core/dist/boc/BitBuilder.js:83:23)     at Builder.storeUint (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton-core/dist/boc/Builder.js:110:20)     at createWalletTransferV4 (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton/dist/wallets/signing/createWalletTransfer.js:110:24)     at WalletContractV4.createTransfer (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton/dist/wallets/WalletContractV4.js:79:66)     at WalletContractV4.sendTransfer (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton/dist/wallets/WalletContractV4.js:68:29)     at Proxy.<anonymous> (/home/mohsen/Work/t25/darix/func_test/ton_tut/node_modules/ton-core/dist/contract/openContract.js:38:47)     at main (/home/mohsen/Work/t25/darix/func_test/ton_tut/step9.ts:26:24)     at processTicksAndRejections (node:internal/process/task_queues:95:5) (reply to 23674)

Mohsen: maybe the reciver is not a wallet???

Mohsen: changed reciver to          to: "EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC", still the same error

Step: import { getHttpV4Endpoint } from "@orbs-network/ton-access"; import { TonClient4 } from "ton"; const endpoint = await getHttpV4Endpoint({   network: "testnet", }); const client = new TonClient4({ endpoint });

Step: try this?

Mohsen: Same exact error.  import { getHttpV4Endpoint } from "@orbs-network/ton-access"; import { mnemonicToWalletKey } from "ton-crypto"; import { TonClient4, WalletContractV4, internal } from "ton";   async function main() {   // open wallet v4 (notice the correct wallet version here)        //   const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)   const mnemonic = "learn nature ... away"; // your 24 secret words (replace ... with the rest of the words)    const key = await mnemonicToWalletKey(mnemonic.split(" "));   console.log(key.publicKey)   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });    // initialize ton rpc client on testnet //   const endpoint = await getHttpEndpoint({ network: "testnet" });   const endpoint = await getHttpV4Endpoint();   const client = new TonClient4({ endpoint });    // make sure wallet is deployed //   if (!await client.isContractDeployed(wallet.address)) { //     return console.log("wallet is not deployed"); //   }    // send 0.001 TON to EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI   const walletContract = client.open(wallet);   const seqno = await walletContract.getSeqno();   await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: "EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC",         value: "0.001", // 0.001 TON         body: "Hello", // optional comment         bounce: false,       })     ]   });    // wait until confirmed   let currentSeqno = seqno;   while (currentSeqno == seqno) {     console.log("waiting for transaction to confirm...");     await sleep(1500);     currentSeqno = await walletContract.getSeqno();   }   console.log("transaction confirmed!"); }  main();  function sleep(ms: number) {   return new Promise(resolve => setTimeout(resolve, ms)); } (reply to 23680)

Step: console.log(walletContract.address.toString()) ? (reply to 23681)

Step: updated (reply to 23682)

Step: what does it show?

Mohsen: EQCKr49f_7hWoETpzrMLaBkPl-kVdqmsmdnqLLCQ0_sDSvvd  https://testnet.tonscan.org/address/EQCKr49f_7hWoETpzrMLaBkPl-kVdqmsmdnqLLCQ0_sDSvvd  it's the correct wallet (reply to 23684)

Андрей: If you installed in full mode and you don't have section ===[ Local validator status ]===, then the installation failed. Try to reinstall again and send all installer output from console here (reply to 23649)

Step: ok (reply to 23686)

Step: [1/4] Starting installation MyTonCtrl [2/4] Checking for required TON components TON exist Cloning into 'mytonctrl'... remote: Enumerating objects: 2025, done. remote: Counting objects: 100% (786/786), done. remote: Compressing objects: 100% (236/236), done. remote: Total 2025 (delta 595), reused 678 (delta 545), pack-reused 1239 Receiving objects: 100% (2025/2025), 2.76 MiB | 5.11 MiB/s, done. Resolving deltas: 100% (1330/1330), done. Submodule 'mypyconsole' (https://github.com/igroman787/mypyconsole.git) registered for path 'mypyconsole' Submodule 'mypylib' (https://github.com/igroman787/mypylib.git) registered for path 'mypylib' Cloning into '/usr/src/mytonctrl/mypyconsole'... remote: Enumerating objects: 33, done. remote: Counting objects: 100% (33/33), done. remote: Compressing objects: 100% (24/24), done. remote: Total 33 (delta 14), reused 24 (delta 7), pack-reused 0 Receiving objects: 100% (33/33), 18.48 KiB | 3.69 MiB/s, done. Resolving deltas: 100% (14/14), done. Cloning into '/usr/src/mytonctrl/mypylib'... remote: Enumerating objects: 135, done. remote: Counting objects: 100% (55/55), done. remote: Compressing objects: 100% (38/38), done. remote: Total 135 (delta 31), reused 38 (delta 16), pack-reused 80 Receiving objects: 100% (135/135), 48.93 KiB | 8.15 MiB/s, done. Resolving deltas: 100% (80/80), done. Submodule path 'mypyconsole': checked out '3538607e412598cace37232c5941673bcdc56ded' Submodule path 'mypylib': checked out '8727d55f87c56e70ff7d71e293f219136aef5f7c' [3/4] Launching the mytoninstaller.py [debug]   02.03.2023, 06:56:45.145 (UTC)  <Logging>     Start WritingLogFile thread. [debug]   02.03.2023, 06:56:45.146 (UTC)  <SelfTesting> Start SelfTesting thread. [info]    02.03.2023, 06:56:45.146 (UTC)  <MainThread>  Start program '/usr/src/mytonctrl/mytoninstaller.py' [debug]   02.03.2023, 06:56:45.146 (UTC)  <MainThread>  start FirstMytoncoreSettings fuction Unit exist. [warning] 02.03.2023, 06:56:45.147 (UTC)  <MainThread>  mytoncore.db already exist. Break FirstMytoncoreSettings fuction [debug]   02.03.2023, 06:56:45.147 (UTC)  <MainThread>  start FirstNodeSettings fuction [warning] 02.03.2023, 06:56:45.147 (UTC)  <MainThread>  Validators config.json already exist. Break FirstNodeSettings fuction [debug]   02.03.2023, 06:56:45.147 (UTC)  <MainThread>  start EnableValidatorConsole function [warning] 02.03.2023, 06:56:45.147 (UTC)  <MainThread>  Server or client key already exist. Break EnableValidatorConsole fuction [debug]   02.03.2023, 06:56:45.148 (UTC)  <MainThread>  start EnableLiteServer function [warning] 02.03.2023, 06:56:45.148 (UTC)  <MainThread>  Liteserver key already exist. Break EnableLiteServer fuction [debug]   02.03.2023, 06:56:45.148 (UTC)  <MainThread>  Backup validator config file 'config.json' to 'config.json.backup' [debug]   02.03.2023, 06:56:45.150 (UTC)  <MainThread>  Backup mytoncore config file 'mytoncore.db' to 'mytoncore.db.backup' [debug]   02.03.2023, 06:56:45.152 (UTC)  <MainThread>  start CreateSymlinks fuction [4/4] Mytonctrl installation completed (reply to 23686)

Step: 🤔

F: Pay attention to the message: Validators config.json already exist. Break FirstNodeSettings fuction This means that you didn't delete all the files before installing, so the installer skips node setup. To remove all components, you need the command: bash /usr/src/mytonctrl/scripts/uninstall.sh

Step: ok

­: Hello, who knows why the adnl address may not work? I enter it in the .ton domain settings, a message is displayed that the address is not correct, but access to the site via adnl can be obtained

Андрей: need a screenshot of the error (reply to 23692)

Step: bash /usr/src/mytonctrl/scripts/uninstall.sh Failed to stop dht-server.service: Unit dht-server.service not loaded. Uninstall Complete

Step: @f_closer (reply to 23694)

Step: installing again

Step: the problem is dht server was not running? (reply to 23694)

Step: why mask address when error says incorrect address? (reply to 23698)

Step: 🤣

F: Failed to stop dht-server.service: Unit dht-server.service not loaded You didn't install it, so it says it couldn't uninstall it. It's ok, you can skip it (reply to 23694)

Step: dht server is essential component for full node? (reply to 23701)

F: It is part of it like other components. But here it means only its separate part without the node itself. You can install DHT-server without a full node. (reply to 23702)

Step: [5/6] Downloading config files --2023-03-02 07:14:09--  https://ton-blockchain.github.io/global.config.json Resolving ton-blockchain.github.io (ton-blockchain.github.io)... 185.199.111.153, 185.199.110.153, 185.199.108.153, ... Connecting to ton-blockchain.github.io (ton-blockchain.github.io)|185.199.111.153|:443... connected. HTTP request sent, awaiting response... 200 OK Length: 13807 (13K) [application/json] Saving to: ‘global.config.json’  global.config.json                              100%[====================================================================================================>]  13.48K  --.-KB/s    in 0s  2023-03-02 07:14:09 (88.5 MB/s) - ‘global.config.json’ saved [13807/13807]  [6/6] TON software installation complete [3/4] Launching the mytoninstaller.py [debug]   02.03.2023, 07:14:09.342 (UTC)  <Logging>     Start WritingLogFile thread. [debug]   02.03.2023, 07:14:09.342 (UTC)  <SelfTesting> Start SelfTesting thread. [info]    02.03.2023, 07:14:09.342 (UTC)  <MainThread>  Start program '/usr/src/mytonctrl/mytoninstaller.py' [debug]   02.03.2023, 07:14:09.342 (UTC)  <MainThread>  start FirstMytoncoreSettings fuction [debug]   02.03.2023, 07:14:09.577 (UTC)  <MainThread>  Start/restart mytoncore service [debug]   02.03.2023, 07:14:09.586 (UTC)  <MainThread>  start FirstNodeSettings fuction [debug]   02.03.2023, 07:14:09.973 (UTC)  <MainThread>  Use addr: <html><head> <meta http-equiv="content-type" content="text/html;charset=utf-8"> <title>403 Forbidden</title> </head> <body text=#000000 bgcolor=#ffffff> <h1>Error: Forbidden</h1> <h2>Your client does not have permission to get URL <code>/</code> from this server.</h2> <h2></h2> </body></html> :53004 [debug]   02.03.2023, 07:14:09.973 (UTC)  <MainThread>  First start validator - create config.json [ 1][t 0][2023-03-02 07:14:09.980304401][validator-engine.cpp:3607]     failed to parse options: [Error : 0 : Failed to resolve host: Name or service not known] [debug]   02.03.2023, 07:14:09.981 (UTC)  <MainThread>  Chown ton-work dir [debug]   02.03.2023, 07:14:09.984 (UTC)  <MainThread>  Start/restart validator service [debug]   02.03.2023, 07:14:09.990 (UTC)  <MainThread>  sleep 10 sec [debug]   02.03.2023, 07:14:20.000 (UTC)  <MainThread>  start EnableValidatorConsole function [debug]   02.03.2023, 07:14:20.017 (UTC)  <MainThread>  Start/restart validator service [debug]   02.03.2023, 07:14:20.023 (UTC)  <MainThread>  sleep 10 sec [debug]   02.03.2023, 07:14:30.175 (UTC)  <MainThread>  start CreateWallet function [debug]   02.03.2023, 07:14:30.195 (UTC)  <MainThread>  start GetLocalWallet function [debug]   02.03.2023, 07:14:30.195 (UTC)  <MainThread>  start GetWalletFromFile function [debug]   02.03.2023, 07:14:30.195 (UTC)  <MainThread>  start GetConfig function (12) [warning] 02.03.2023, 07:14:33.201 (UTC)  <MainThread>  GetValidatorStatus warning: Command '['/usr/bin/ton/validator-engine-console/validator-engine-console', '-k', '/var/ton-work/keys/client', '-p', '/var/ton-work/keys/server.pub', '-a', '127.0.0.1:63361', '-v', '0', '--cmd', 'getstats']' timed out after 3 seconds [debug]   02.03.2023, 07:14:35.146 (UTC)  <MainThread>  start GetConfig function (15) [debug]   02.03.2023, 07:14:37.614 (UTC)  <MainThread>  start WalletVersion2Wallet function [debug]   02.03.2023, 07:14:37.615 (UTC)  <MainThread>  start CreateNewKey function Traceback (most recent call last):   File "/usr/src/mytonctrl/mytoncore.py", line 4434, in <module>     Init()   File "/usr/src/mytonctrl/mytoncore.py", line 3902, in Init     Event(eventName)   File "/usr/src/mytonctrl/mytoncore.py", line 3921, in Event     EnableVcEvent()   File "/usr/src/mytonctrl/mytoncore.py", line 3935, in EnableVcEvent     adnlAddr = ton.CreateNewKey()   File "/usr/src/mytonctrl/mytoncore.py", line 1232, in CreateNewKey     result = self.validatorConsole.Run("newkey")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     process = subprocess.run(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)

Step:    File "/usr/lib/python3.9/subprocess.py", line 507, in run     stdout, stderr = process.communicate(input, timeout=timeout)   File "/usr/lib/python3.9/subprocess.py", line 1134, in communicate     stdout, stderr = self._communicate(input, endtime, timeout)   File "/usr/lib/python3.9/subprocess.py", line 1982, in _communicate     self._check_timeout(endtime, orig_timeout, stdout, stderr)   File "/usr/lib/python3.9/subprocess.py", line 1178, in _check_timeout     raise TimeoutExpired( subprocess.TimeoutExpired: Command '['/usr/bin/ton/validator-engine-console/validator-engine-console', '-k', '/var/ton-work/keys/client', '-p', '/var/ton-work/keys/server.pub', '-a', '127.0.0.1:63361', '-v', '0', '--cmd', 'newkey']' timed out after 3 seconds [debug]   02.03.2023, 07:14:40.651 (UTC)  <MainThread>  Start/restart mytoncore service [debug]   02.03.2023, 07:14:40.664 (UTC)  <MainThread>  start EnableLiteServer function [debug]   02.03.2023, 07:14:40.664 (UTC)  <MainThread>  generate liteserver key [debug]   02.03.2023, 07:14:40.670 (UTC)  <MainThread>  move key [debug]   02.03.2023, 07:14:40.673 (UTC)  <MainThread>  chown 1 [debug]   02.03.2023, 07:14:40.675 (UTC)  <MainThread>  chown 2 [debug]   02.03.2023, 07:14:40.677 (UTC)  <MainThread>  read vconfig [debug]   02.03.2023, 07:14:40.677 (UTC)  <MainThread>  prepare vconfig [debug]   02.03.2023, 07:14:40.677 (UTC)  <MainThread>  write vconfig [debug]   02.03.2023, 07:14:40.677 (UTC)  <MainThread>  Start/restart validator service [debug]   02.03.2023, 07:14:40.683 (UTC)  <MainThread>  sleep 10 sec [debug]   02.03.2023, 07:14:50.693 (UTC)  <MainThread>  read mconfig [debug]   02.03.2023, 07:14:50.694 (UTC)  <MainThread>  edit mytoncore config file [debug]   02.03.2023, 07:14:50.694 (UTC)  <MainThread>  write mconfig [debug]   02.03.2023, 07:14:50.694 (UTC)  <MainThread>  Start/restart mytoncore service [debug]   02.03.2023, 07:14:50.709 (UTC)  <MainThread>  Backup validator config file 'config.json' to 'config.json.backup' [debug]   02.03.2023, 07:14:50.711 (UTC)  <MainThread>  Backup mytoncore config file 'mytoncore.db' to 'mytoncore.db.backup' [debug]   02.03.2023, 07:14:50.713 (UTC)  <MainThread>  start CreateSymlinks fuction [4/4] Mytonctrl installation completed

Step: @f_closer (reply to 23704)

Step: looks like https://ifconfig.me blacked my server ip  while trying to know the public ip ?

F: Yes, it looks like your ip address is in some kind of black list (reply to 23707)

Step: at this point, cant i manually specify my public ip address?

Mohsen: icanhazip.com also gives you your public address. maybe it can help. (reply to 23707)

Step: https://github.com/ton-blockchain/mytonctrl/blob/4b8c0a5c07b01d549256fe21961157bd2d0f56ef/mytoninstaller.py#L293 (reply to 23710)

Step: @f_closer (reply to 23709)

Step: but if i do curl 'https://ifconfig.me' shows ip address (reply to 23708)

Step: something like python useragent blacked?

Alex: It seems, last version ton, ton-core incompatible with this lesson.   You can drop modules and install previous version, it will work fine with these versions: {   "dependencies": {     "@orbs-network/ton-access": "2.2.2",     "@ton-community/func-js": "^0.5.0",     "ton": "13.3.0",     "ton-core": "0.47.0",     "ton-crypto": "3.2.0",     "ts-node": "10.9.1"   } } (reply to 23681)

Mohsen: Thank you. That's what I thought but didn't know the correct version. I'll try it and get back to you. (reply to 23715)

Mohsen: Yay! it worked. thanks! deploy transaction confirmed! (reply to 23715)

Mohsen: If someone has contact to Tal Kol they should notify him to update the tutorial. (reply to 23715)

Step: @talkol (reply to 23718)

Step: now  Local validator out of sync: 23228 s how to make it upto date?

Daniil: it syncing automatically (reply to 23720)

Daniil: you can check the status in a few minutes and "out of sync" will be less and less

Step: 😱

Step: now cant i get recent transactions via liteserver?

Step: recent i mean new

Daniil: check the latest block maybe (reply to 23725)

&rey: httpbin.org/ip (reply to 23709)

Step: installer problem (reply to 23727)

Step: if a validator stake 10k ton howmuch can he earn from mytonctrl?

Daniil: validator stake is about 350k as I remember (reply to 23729)

Step: ===[ TON network configuration ]=== Configurator address: -1:5555555555555555555555555555555555555555555555555555555555555555 Elector address: -1:3333333333333333333333333333333333333333333333333333333333333333 Validation period: 65536, Duration of elections: 32768-8192, Hold period: 32768 Minimum stake: 10000.0, Maximum stake: 10000000.0 (reply to 23730)

Step: full node communicate with other node via liteclient/liteserver ?

­: Who knows why when confirming the adnl address of the ton domain, the payment hangs at the stage of sending? The balance allows you to send a payment with a commission

talkol: yes, thanks for the PR, we are investigating if the issue should be fixed in the tutorial or inside the "ton" library (reply to 23676)

talkol: very cool that the community raises the issues with fixes as soon as they happen!

Step: community need more help and support from senior/legendary ton developers.  it is sometimes disappointing when our question never get a reply. (reply to 23735)

Gajesh: what is the query_id in Jetton transfer?  and do/how can i generate it?

&rey: Random value used to identify transactions chain. (reply to 23737)

Gajesh: oh. so it can be anything? (reply to 23738)

Gajesh: or one can be repeated again?

Step: Local validator out of sync: 6 s  can we keep as low as 1s or 0s ?

Daniil: it should always be <=6 sec (reply to 23741)

Step: why? if new block added i will get that after 6 seconds? (reply to 23742)

&rey: Maybe that's when new block is generated, your validator has only previous block, which is 5-6 s behind. (reply to 23741)

Tal: hey guys. How can I get the private key in ton wallet?

Tal: when mnemonics are imported into func js, the wallet address is always different

Step: if a new block created it will be broadcasted to which validator/node first? (reply to 23744)

Marlee: If u talk about @wallet it's custodial right now (reply to 23745)

&rey: As far as I remember, along semipermanent overlay connections. (reply to 23747)

Step: it will be broadcasted to all node same time? (reply to 23749)

Step: 🤔

Step: i want all block quickly come to my node without any delay

Step: how to do that?

Tal: lol, but how do I do it? (reply to 23748)

Marlee: Do what ? (reply to 23754)

Tal: get my private key

Marlee: You can’t get private key from @wallet

Marlee: Download Tonwallet u have a private key there (reply to 23756)

Tal: ah, i will try it, thank you

­: Who had experience in placing the site on the ton domain? Please write

Daniil: Ask here (reply to 23761)

Daniil: nometa.xyz

Owdares: Hello, How can i send transaction using c#?

Dmitry | backend4you.ton: I started making a tonlibtonjson wrapper https://github.com/justdmitry/TonLib.NET but have only read calls now. (reply to 23764)

Ihor: how to convert cells to hex?

Tim: ToBoc().toString(Hex)

hamoon yaghobi: Why does this step not proceed? Next, we're going to install a JavaScript package named ton that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:  copied! npm install ton ton-crypto ton-core

Tim: Update ton core

hamoon yaghobi: Please advise (reply to 23772)

Ihor: thanks (reply to 23769)

Ihor: what this is library? i using ton lib. (reply to 23769)

Tim: Ton

Ihor: got it

User<5116638705>: How can create address  deposit for user 1 address?

🏸: I want to connect my site to the ton blockchain, does anyone work here?

User<59608113>: 💫 We're thrilled to announce a Technical Q&A session today featuring Marko Okhman, an educator in FunC, TypeScript, and Web development. Join us for this exciting opportunity to get your most pressing technical questions answered by an experienced professional.  👨🏻‍💻During the session, Marko will share insights and tips on FunC smart contracts, TypeScript programming, and web development. Whether you're new to these technologies or a seasoned pro, this session promises to provide valuable insights and knowledge.  🔥Don't miss this chance to connect with a leading expert and get answers to your most burning technical questions. The session will take place today, and we look forward to seeing you there!  🕗 19:00 CET    https://join.toncompany.org/c/onboarding-events/technical-q-a-func-typescript-web-eade13 (forwarded from TON&Co.)

TON Answers Bot (not AI): Is it OK to use a mutex in the smart contract? from Telegram Chat Import  Suppose there is a mutex that locks some operations in the smart contract waiting for some other execution chains outside of the smart contract to finish. Is it okay to use such a pattern or should it be avoided?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114914   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to get a Jetton decimal precision value programmatically? from Telegram Chat Import  Different Jetton tokens have different decimal precision (most use the default value is 9 digits, but some changed it). If I want to know the decimal precision value of a specific Jetton, how can I get it?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/114635   🔗 Answer on TON Overflow

TON Answers Bot (not AI): What are the hardware requirements for the Collator node? from Telegram Chat Import  It's planned to separate the roles of Collator and Validator in TON blockchain. So in addition to current node types such as the Validator node there will be a Collator node type. Is there any information yet on hardware requirements for this new type?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114374   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is Windows suitable for developing TON smart contracts? from Telegram Chat Import  Many TON tutorials and whitepapers mention Linux/macOS-specific things like /usr/lib/fift path, terminal commands and so on. Can I develop smart contract on Windows?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114846   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to generate a transaction graph? from Telegram Chat Import  I'm trying to create a human-readable transaction graph, but haven't succeed yet. Maybe someone has seen successful examples on other blockchains?   !(https://i.imgur.com/1e4sW6o.jpg)  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114591    🔗 Answer on TON Overflow

&rey: Yes, it's possible. You need to deploy proxy contract on mainnet which, upon receiving confirmation that your bet has won, repeats that bet in the same block. (reply to 23788)

&rey: risk parameter will only make contract's balance decrease logarithmically and save some time for owner. (reply to 23788)

Ihor: hello, everybody, someone used @tonconnect/sdk in telegram bots (for connect wallet to telegram and after send requests to transactions)?

Daniil: russian chat: @tondev (reply to 23798)

Daniil: I'm not an admin there (reply to 23801)

Ahmet Said: what is the difference between contract.sendDeploy and provider.deploy  ? How can i populate sendDeploy function ?

Cpperg: hey guys do you know how to @orbs-network/ton-access issue because everytime I want to access to I can pull the balance it is returning lib error

Cpperg: where I am literally using react

Cpperg: if you have idea which lib do you use to pull balance and account info after they login

talkol: https://t.me/TONAccessSupport (reply to 23808)

talkol: Join and please paste there the snippet of code you use or link to GitHub

Abdalrahman: hello guys I got error from the node_module files help me :)  1- in ./node_modules/ton/dist/multisig/MultisigWallet.js  Module parse failed: Unexpected token (29:28) File was processed with these loaders:  * ./node_modules/@quasar/app/lib/webpack/loader.transform-quasar-imports.js You may need an additional loader to handle the result of these loaders. |                 .endCell(), |         }; >         this.address = opts?.address  (0, ton_core_1.contractAddress)(workchain, this.init); |         if (opts?.provider) { |             this.provider = opts.provider;  2- in ./node_modules/ton/dist/client/api/HttpApi.js  Module parse failed: Unexpected token (173:32) File was processed with these loaders:  * ./node_modules/@quasar/app/lib/webpack/loader.transform-quasar-imports.js You may need an additional loader to handle the result of these loaders. |         this.cache = new TonCache_1.InMemoryCache(); |         this.parameters = { >             timeout: parameters?.timeout  30000, |             apiKey: parameters?.apiKey |         };

— 2023-03-03 —

S: Hi, i want to see validators addresses and their stakes. DO you know some explorers that shows it?   What is the stake reward for now?

Ralph: Hi guys

Himkar: Hi, I want to add TON blockchain into my metamask wallet, your help will be appreicated

jelywells: Metamask doesn’t support the TON network, only EVM. But you can install an openmask chrome extension (reply to 23816)

Nikita: www.openmask.app (reply to 23816)

Himkar: so If I create a NFT in TON network, can I see that in my telegram wallet?

Himkar: In my case, I just want to use telegram and its chatbot to create NFT and check it

User<6247944943>: 😋

Howard: https://truecarry.github.io/ton-collection-edit/  Hi Tim, how did you set the minimum for gas fee for txs here?

Step: gas is customizable? (reply to 23823)

Step: 🤔

TON Answers Bot (not AI): Get result/status of transaction from Amir Habibzadeh  Can anyone explain how to get the result of transaction after sending it, TonSDK send transaction method is returning .boc and how can i get the status of this kind of response?  When i checking Tonapi, Toncenter they are only accepting hash of transaction.   🔗 Answer on TON Overflow

Tim: i did not set any fees. (reply to 23823)

Ala: Hello everyone 😀 I created a dict to store in it cotracts addresses so my question is how to add an element into a dict?

ㅤ: Anyone have any cool ton use cases to share?

Андрей: Fragment.com (reply to 23830)

ㅤ: I said cool. (reply to 23831)

Gajesh: where can i find docs on Jetton NFTs?

Step: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 23833)

Step: Library docs or standard? (reply to 23833)

Gajesh: library docs (reply to 23835)

Gajesh: thanks! (reply to 23834)

Step: Tonweb library https://github.com/toncenter/tonweb/tree/master/src/contract/token/ft (reply to 23836)

Step: Libraries do not provide any detailed docs we just need to educate ourselves by looking at source codes. That is what I do most of the time.

Gajesh: thanks! 😄

Oleg: New version of TON golang library 💎 tonutils v1.6.0 has been released!  A big update that adds support for creating and checking Merkle Proofs, RLDP2, Ton Storage downloads, Overlays. Previous functionality such as ADNL TCP, Cells and serializations has been rethought and improved. Added many optimizations and improvements.  Most of the old manual parsers have been replaced with automatic mapping of TL to structures. Some examples have been improved taking into account frequent questions from beginners.  Changelog: 1. Merkle Proofs Creation and Check  2. TON Storage support + Downloader abstraction 3. RLDP2 Support + RLDP improvements 4. Rewrite of ADNL TCP (Liteclient) 5. Raw ADNL Overlays support, DHT resolving + joining, RLDP Overlays (WIP mode) 6. Overlay FEC broadcasts support with sign checking 7. ADNL TCP Authorization support 8. Optimized CellSlice loading and serialization 9. Added Cell hash lazy caching 10. Added TON Storage sites support to HTTP RLDP Transport 11. Changed LSError code to int32 from uint32 12. Added ADNL UDP Optimized gateway abstraction for client and server 13. DHT Client improvements, speedup and better routing, 0 goroutines per peer anymore 14. Fixed parsing of recursive tuple in stack 15. Improved WaitNextMasterBlock method, it works properly now as intended 16. Added TON Storage sites support to Set/GetSiteRecord 17. ADNL UDP Reconnect improvements 18. TL Serialization flags support 19. TL Support of predefined schema id 20. Added optional ADNL key arg for RLDP HTTP transport 21. tlb.BlockInfo soft-moved to ton.BlockIDExt (tlb.BlockInfo deprecated) 22. Added GetBlockTransactionsV2 with better typed args (GetBlockTransactions deprecated) 23. Examples clarified and improved, based on FAQ from tonutils chat 24. Increased test coverage  🚀 https://github.com/xssnick/tonutils-go

TON Answers Bot (not AI): Is it feasible to sort 50 000 objects on-chain? from Telegram Chat Import  Suppose I need to store 50 000 objects and have the ability to sort them (e.g., find an object with the minimal value of some parameter). Is it possible and reasonable to do that on-chain, or does that require an off-chain backend?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114394   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there a Gelato alternative in the TON ecosystem? from Telegram Chat Import  I probably need to use an off-chain backend for my project, but then my app would not be as decentralized as I want it to be. In the EVM ecosystem there is a "decentralized backend" service Gelato. Is there anything like that in the TON ecosystem?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114401   🔗 Answer on TON Overflow

kirito: 👍 ，by the way, is there rust lib? (reply to 23841)

&rey: I think you should explore Everscale tools and check if they are compatible with TON. (reply to 23846)

TON Answers Bot (not AI): Is there a square root function in FunC? from Telegram Chat Import  Is there a built-in square root function in the language? And if not, maybe there is a popular library with the optimal implementation?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/83694  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there an Ethereum epoch equivalent on TON? from Telegram Chat Import  I come from the Ethereum ecosystem, where time is measured in epochs. Is there a thing like epochs in the TON ecosystem?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/82720   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Can any smart contract be an "NFT owner"? from Telegram Chat Import  People who own NFTs can keep them in their wallets such as Tonkeeper. But can non-wallet smart contracts be listed as the NFT owners too? Are there any limits, or any TON smart contract at all can be an NFT owner?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/60319    🔗 Answer on TON Overflow

Cpperg: Is there any other way to get wallet key.publickey beside using ton-crypto lib

Cpperg: Because it is missing buffer lib and I am having the wildest time adding it

Coalus: Try https://github.com/toncenter/tonweb-mnemonic (reply to 23851)

Daniil: yarn add buffer (reply to 23852)

Cpperg: yeah that was my first option and it didnt work (reply to 23854)

Daniil: What happened exactly? (reply to 23856)

Cpperg: this

Cpperg: it neeeded the Buffer because it did not have a way to parse it into a Buffer and needed the lib Nuffer

Cpperg: so am I doing something wrong?

Tim: yes, you need to install it as polyfill

4xMafole: Hi TON Devz,  Running npx func-js ./stdlib.fc  ./bet.fc --boc ./bet.boc. Produces the above error on the image. Anyone facing the same issue, or got solution to that it will be a pleasure.  failed to asynchronously prepare wasm: CompileError: WebAssembly.instantiate():  Seems I have a problem with func-js.

Tim: do you have node 18?

Rahul: I don't think the issue is with the node 18. For me on node 16,18 func-js works perfectly fine.

Rahul: If you could share public repo. I can debug at my end. (reply to 23862)

4xMafole: So I had to get rid of everything npm and the node js. Cleaned up and reinstalled all the packages and updates. That's how I ended up getting rid of the errors. (reply to 23862)

— 2023-03-04 —

Abdalrahman: if I am getting an error from the ton library node_module file what should I do  this is the error: in ./node_modules/ton/dist/multisig/MultisigOrder.js in ./node_modules/ton/dist/client/api/HttpApi.js in ./node_modules/ton/dist/multisig/MultisigWallet.js  @ ./node_modules/ton/dist/index.js 67:23-59  @ ./node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--15-2!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ton.vue?vue&type=script&lang=ts&  @ ./src/components/ton.vue?vue&type=script&lang=ts&  @ ./src/components/ton.vue  @ ./node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--15-2!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=script&lang=ts&  @ ./src/App.vue?vue&type=script&lang=ts&  @ ./src/App.vue  @ ./src/main.ts  @ multi (webpack)-dev-server/client?http://192.168.1.33:8080&sockPath=/sockjs-node (webpack)/hot/dev-server.js ./src/main.ts

Abdalrahman: help me please :( (reply to 23870)

Abdalrahman: sad

Dark: /sockjs

Arthur: /stdlib

TON Answers Bot (not AI): How can I can register .ton domain name? Are dns auction contracts already public? from Telegram Chat Import  How actualy can I register ton domain? And how to particiapte in public auction?   This question was imported from Telegram Chat:  https://t.me/tondeveng/8751 https://t.me/tondeveng/8860    🔗 Answer on TON Overflow

TON Answers Bot (not AI): Why the TonCenter API works with error here? from Telegram Chat Import  https://toncenter.com/api/v2/getTransactions?address=UQCzwxqIw1pt41DND9pgGfAOhJKtQQEgjVcpn0rHxv-4b8Ob&limit=1&lt=23481826000001&hash=OBInamdujxrUx%2Fqebnhix%2FAL%2BWEgQaSEssZrGgLhAZo%3D&tolt=0&archival=true /getTransactions method above returns me 1 transaction with utime 1638465564  https://toncenter.com/api/v2/lookupBlock?workchain=-1&shard=-9223372036854775808&unixtime=1638465564 /lookupBlock method above points me to the block number 16512830  https://toncenter.com/api/v2/getBlockTransactions?workchain=-1&shard=-9223372036854775808&seqno=16512830 /getBlockTransactions for block number 16512830 returns me several transactions, but no one has the same logical time as initial given to /getTransactions method. Is it expected behavior or I am missing something? What is "count" parameter of /getBlockTransactions? It seems it doesn't have effect at all.    > This question was imported from Telegram Chat:https://t.me/tondeveng/1371  🔗 Answer on TON Overflow

TON Answers Bot (not AI): What to read about Fift? from Telegram Chat Import  The main source of knowledge about Fift language is the whitepaper, available at https://ton.org/fiftbase.pdf. It is useful, but are there other articles, videos, tutorials?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/72796    🔗 Answer on TON Overflow

TON Answers Bot (not AI): How expensive is queryId compared to seqno? from Telegram Chat Import  Highload wallets use queryId instead of seqno. It is better suited for large amounts of transactions, but does it come with a cost in terms of gas? How much gas does queryId require compared to seqno?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/72571   🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to get a current date in FunC? from Telegram Chat Import  Are there functions for working with dates in FunC? Is it possible to get the current date or something like that?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/84233   🔗 Answer on TON Overflow

Yuri: Hey guys, how NFT spam could be avoided? For example, I look at my NFT collections using Ton Keeper. It's all displayed there with a simplified version of the metadata etc. If I, for example, start to create NFTs with some ad-like metadata and send a lot to other users

Yuri: It would pop-up these spam NFTs on Ton Keeper NFT section, right?

Maksim: there is no decentralized method to avoid NFT spam. btw it’s too expensive to spam with NFTs cause you need about 200-500TON to mint 10k nfts so i think no one will do that (reply to 23888)

Yuri: I see, quite expensive. But I could distribute some business cards hehe (reply to 23890)

Firuz: Hello, is there anyone interested in developing smart contracts for the ride-sharing platform, we need more developers in our team

liminal: I'm using blueprint framework, so it seems it has some problems in the core

Tigr: It says NaN cannot be converted into BigInt. Probably you are passing some variable (which value is supposed to be a number, but it isn't for some reason) in this lib's function.

talkol: Let’s open an issue in blueprint repo and put some code that reproduces please (reply to 23895)

Howard: any website I can check "how many jetton standard token I have in a wallet address?"

talkol: I think TonApi returns this (reply to 23897)

talkol: Also most explorers should show this, but some of them hide some jettons due to phishing attempts

talkol: https://tonscan.org has a jetton tab for any wallet, the list there used to be complete but after so many phishing attempts of people creating fake jettons with same name, they started censoring the list

Firuz: To what extent is this paper applicable to the TON blockchain. Anyone interested please DM me

Reylen Joy: EQCBAdt-KW0G3GXtW9wrCYTQR0EHXnQQKol8H-9unZGCMbC9

Yuri: Hey guys, any content like this in english? https://www.youtube.com/watch?v=xtMo0AmtYWA&list=PLyDBPwv9EPsCYG-hR4N5FRTKUkfM8POgh&index=1

Yuri: Want some video classes on fift

Alex: There is no such content in English currently, you can use the autogenerated subtitles on YouTube. (reply to 23904)

Yuri: Yeah, not that bad actually. But would be great to populate more the international content (reply to 23906)

Cpperg: I am getting wrong response from get balance after using from nano

Cpperg: any idea if I need to do something to fix it

Cpperg: The response is working rather the wrong amount should I add a specific fundtion of multiply it to get the right amount?

Coalus: show your code (reply to 23908)

Cpperg: const balance = await client.getBalance(wallet.address);     this.balance =fromNano(balance);

Cpperg: this is it

Cpperg: taking the balance then putting it in fromNano

Cpperg: should I add more to it

Coalus: no, getBalance return value in nanotons, after that u convert it from nano, so thats it (reply to 23915)

Cpperg: well I still get the wrong balance after fromNano

Cpperg: in my code all what it is doing is put a comma

Limmy🍋: Hey all,I wanted to share the first draft of a project I’ve been working on with @Gilx1  - It’s an NFT game concept called TookTuks and we’d love to get feedback on the story and art.  Also, we’re looking for a TON developer who could partner with us to work on a simple POC for TookTuks: online 2D PVP board with an integration to the TON open network. More details in the attached doc below:  https://hexoplanets.gitbook.io/ton-tooktuks-intro/

TON Answers Bot (not AI): Can explorers show the smart contract code? from Telegram Chat Import  Is the code of smart contracts visible to the explorers? Can I use some explorer to see the code of any specific smart contract I'm interested in?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/72606   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Are there Go libraries for developing on TON? from Telegram Chat Import  There are numerous libraries for working with TON, but they are mostly for JavaScript / TypeScript. Is it possible to interact with TON using Go language?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/73996     🔗 Answer on TON Overflow

Eren: hi, I want to gather my old minning coins but I can not see anything in my wallet. Is there anything to do about this?

Daniil: Which wallet are you trying? (reply to 23923)

Eren: TON Wallet

Kiba: Keep your private key safe for the next 4 years until your account is unlocked. (reply to 23923)

Kiba: And how many coins you have on the wallet? (reply to 23923)

&rey: *or until validators' voting is held to unlock wallets earlier, which is also possible. (reply to 23926)

&rey: By the way, have you checked the wallet version? (reply to 23923)

Kiba: And please check this issue, I think you have a similar problem https://github.com/ton-blockchain/ton/issues/603 (reply to 23923)

Eren: I think that is 0 coin but I mined lots of coins before /withdrawn code was not worked. (reply to 23927)

liminal: Added English Version of Fift lessons. First video's already been published. https://youtu.be/VvNHOqnMQKY Btw, i'm really sorry for my pronunciation. I hope it will be better soon.

Andrew: were you using tonwhales mining pool by any chance?

Kiba: You can send me your wallet address in pm so I can check it for you (reply to 23931)

Asher: https://www.youtube.com/watch?v=VvNHOqnMQKY (reply to 23904)

Yuri: Amazing, thanks! (reply to 23935)

— 2023-03-05 —

User<5988059446>: Hi

Howard: what is the usage / example for subscription here? (reply to 22010)

Step: ??? (reply to 23945)

Behrang: I tried to use VSCode extension FunC Language Support. Anytime a syntax error occurs, it highlights it, but after I fix it, the error highlight remains, for some time, and after a long while it fixes.  Anyone has the same problem? Any solution?

Howard: I think it's error from FunC syntax, should be fix in nearly future. https://t.me/tactlang/2015 (reply to 23947)

ＡλＩ: Hi What's the difference between pytonlib and TON Center API? Which should I choose for my projects? (I want it to be future proof)

Behrang: I fix the error, but the problem and error highlighting remains. (reply to 23949)

TON Answers Bot (not AI): How to get the latest block number? from Telegram Chat Import  What's the easiest way to get the number of the latest block on the TON blockchain?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/47900   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is it more cost-effective to use Fift instead of FunC? from Telegram Chat Import  As far as I understand, code in FunC languages compiles to Fift, and then from Fift code the resulting bag of cells is generated. Could I make my code more cost-effective (so it will use less gas) by writing it directly in Fift without conversion from FunC? Or the difference would be too small to care?  ---  > This question was imported from Telegram Chat:https://t.me/tondev/72009   🔗 Answer on TON Overflow

User<6247944943>: what is the wrappedTON contract at this moment?

hamoon yaghobi: Hello ,I did the examples through the TON site documentation and I was able to transfer the tokens inside the network in the TON test net environment, but I don't know where I can transfer the tokens I created in the Mainnet.

TON Answers Bot (not AI): Why the masterchain is more expensive than a basechain? from Telegram Chat Import  Technically speaking, masterchain and basechain are similar in many ways. Why does using the masterchain cost much more gas?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/65000   🔗 Answer on TON Overflow

User<5672678895>: cell msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(addr)     .store_coins(amount)     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_uint(op, 32),

User<5672678895>: Can someone explain the concept of store_uint in this snippet of code

Andrew: https://ton.org/docs/develop/smart-contracts/messages#message-layout (reply to 23960)

TON Answers Bot (not AI): What does TonKeeper signing represent? Can we say it is an 'authority' that can ensure the sender is the owner of the wallet address? And is it not a requirement on-chain? from Howard  What does TonKeeper signing represent? Can we say it is an 'authority' that can ensure the sender is the owner of the wallet address? And is it not a requirement on-chain?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): How long can a delay between two blocks be on TON? from Telegram Chat Import  Usually new blocks on TON blockchain are formed every new seconds so there's no reason to worry about waiting too long. But I've heard that under some circumstances delays might exceed a minute. Does that really happen? What is the longest delay it's reasonable to be ready for when developing on TON?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/49142    🔗 Answer on TON Overflow

Howard: This is the most memorable question for me 🤣 (reply to 23959)

Tans: Guys is there any method people can know how safety a 3rd part project on ton ?

Андрей: Can i use TON Payment channels for competitive game sessions?

TON Answers Bot (not AI): In Fift, how does the `word` word work? from Telegram Chat Import  Functions are called "words" in Fift, and there is a special word word. The whitepaper explains it this way:   «word (x – S), parses a word delimited by the character with the Unicode codepoint x from the remainder of the current input line and pushes the result as a String. For instance, bl word abracadabra type will print the string “abracadabra”. If x = 0, skips leading spaces, and then scans until the end of the current input line. If x = 32, skips leading spaces before parsing the next word».  But I don't fully understand how x works, could you explain it in different words? I see that some people use commands like 124 word, what does that stand for? If I want to use \n as a word delimiter, what should I use?    ---  > This question was imported from Telegram Chat: https://t.me/tondev/49423   🔗 Answer on TON Overflow

Tim: If you implement your own wallet with channels support (reply to 23967)

Irany: Bom dia

Alireza: Hello,  Sometimes, the swap space on validator nodes can become full, which requires urgent action to resolve. However, since the server is an active node, any disruption to the process may result in punishment. To perform the necessary operation, I must follow these steps:  1- I must not participate in the next election. 2- I need to wait until the current validation cycle finishes. 3- I can then restart the validator process to free up the filled swap space. 4- I must wait until the next election and validation cycle.  Unfortunately, this means losing an entire cycle for a relatively simple operation that only takes a few seconds.  I would appreciate it if you could answer these questions:  1- Is there a way to pause an active node for a brief period to perform an operation without causing any disruption that could result in punishment?  2- Why does the validator process cause the swap space to become full?

Jerry [ViteX Ref 1039631644]: Hi, I installed a full node now 14 hours passed with almost zero sync progress, is it normal? The node has public ip and both tcp/udp ports are exposed

Jerry [ViteX Ref 1039631644]: ===[ Local validator status ]=== Validator index: -1 Validator efficiency: n/a ADNL address of local validator: 6D411E5B293299CF9881FFC0DC3E7DB2613CEF2B11E6ABCD51F49FAD32407757 Local validator wallet address: Ef9Xpw_7vw7CSvyyyewJFngx092_xCT_h9np1X7g40cVShab Local validator wallet balance: 0 Load average[8]: 0.08, 0.04, 0.0 Network load average (Mbit/s): 0.0, 0.02, 0.08 Memory load: ram:[0.45 Gb, 4.7%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): nvme0n1:[0.43, 0.31%], nvme1n1:[0.0, 0.0%] Mytoncore status: working, 14 hours Local validator status: working, 14 hours Local validator out of sync: 1678020748 s Local validator database size: 0.01 Gb, 21.4% Version mytonctrl:  () Version validator:  ()

Tim: yes, you need to start from a dump

Tim: https://dump.ton.org/

Jerry [ViteX Ref 1039631644]: I also downloaded a dump on https://dump.ton.org/, extracted the files into the db folder as the instruction. This doesn’t seem work

Tim: you didn't do it correctly most likely

Tim: your out of sync is unixtime, means you have nothing in db

Jerry [ViteX Ref 1039631644]: I copied config.json and keyring into the new db

Jerry [ViteX Ref 1039631644]: How should I do it

Tim: I didn't have problems with guide

Tim: try again

liminal: https://youtu.be/I1wtig3MFVU Second lesson's out now.

Jerry [ViteX Ref 1039631644]: Installed twice. Don’t know where is wrong

Jerry [ViteX Ref 1039631644]: Everyone is in /var/ton-work/db

Татьяна: Есть тоже самое только на русском языке?

Asher: Да, на том же канале (reply to 23987)

Андрей: Judging by the near-zero network load, the problem is in connecting to the Internet, perhaps something is restricting it, for example, a firewall.  It is also interesting how you display the version of the mytonctrl and validator. (reply to 23974)

Андрей: You can find the link in the channel description (reply to 23987)

Jerry [ViteX Ref 1039631644]: Found out it was my link to the dump somehow expires so it doesn’t link to the correct db folder. (reply to 23989)

Jerry [ViteX Ref 1039631644]: ===[ Local validator status ]=== Validator index: -1 Validator efficiency: n/a ADNL address of local validator: 6D411E5B293299CF9881FFC0DC3E7DB2613CEF2B11E6ABCD51F49FAD32407757 Local validator wallet address: Ef9Xpw_7vw7CSvyyyewJFngx092_xCT_h9np1X7g40cVShab Local validator wallet balance: 0 Load average[8]: 1.29, 1.26, 1.31 Network load average (Mbit/s): 0.01, 0.03, 0.03 Memory load: ram:[5.13 Gb, 33.1%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): nvme0n1:[0.02, 0.15%], nvme1n1:[12.49, 99.99%] Mytoncore status: working, 32 minutes Local validator status: working, 32 minutes Local validator out of sync: 175723 s Local validator database size: 75.92 Gb, 16.9%

Jerry [ViteX Ref 1039631644]: Does this look normal?

Jerry [ViteX Ref 1039631644]: Out of sync time is increasing

Андрей: It can be seen that you downloaded the database dump, but the node itself does not communicate with other nodes - the network load is near zero. We need to find out why the network load is near zero. (reply to 23992)

Jerry [ViteX Ref 1039631644]: I exposed this port for external connections I think this should be fine?

Kaan: Hi guys. How can i check if the user typed an existing wallet address rather than a random input?

&rey: I think by checking its balance through either your own lite client or some API. (reply to 24004)

Daniil: Use some library like tonweb or ton.js to check the address validity (reply to 24004)

Kaan: Yeah I'm thinking of using Ton http api I've found it just now, there's a method it shows true or false if the address is typed correctly.

Kaan: Thanks for the idea (reply to 24005)

— 2023-03-06 —

Vlad: Hi, guys! I need to store multiple data in the FunC contract. (Ex. array) How can I do it?

Vlad: Wonder if this code will work: set_data(begin_cell()                         .store_uint(counter, 64)     .store_uint(operation,32)     .store_uint(sum,64)     .end_cell())

Daniil: Yes (reply to 24011)

Vlad: and later how can I acces it? var ds = get_data().begin_parse();        var counter = ds~load_uint(64); var op = ds~load_uint(32); var sum =ds~load_uint(64);

Danila: Yes (reply to 24013)

순범: Hi guys, I'm making some multi-sig contract, and I want to know how can I request my app user to make signature.  I'm testing my contract with 'mnemonicToWalletKey' exported from 'ton-crypto' so that I can get my private key, but I'm wondering  how can I request user tonkeeper to sign some data? and above all is it possible to request user tonkeeper to send external message to some contract?

Daniil: There's no way to request a signature of custom data yet in tonkeeper. (reply to 24015)

Daniil: And about external messages - you can send them from the browser or from anywhere else (reply to 24015)

Daniil: Did you know about the official multisig contract by the way? https://github.com/ton-blockchain/multisig-contract

순범: yeah, I read it and making my own contract now (reply to 24018)

순범: thx a lot! maybe I should use internal msg... (reply to 24016)

Vlad: I just don't fully understand how  data is stored and how I access it: Is it stored into the cell in the order I set “store_…” functions? And later I must load it in the same order? What if I want to skip some data entries? (reply to 24014)

Daniil: Data is stored in cells. You just build a cell and do set_data(). Later you can do get_data() to get that cell from contract's data and parse it to load your stored variables (reply to 24021)

Vlad: Then I parse it and get a slice, right? (reply to 24022)

Daniil: Yes, and you can load these values from slice (reply to 24023)

Vlad: I just don’t understand, how the “load_uint” functions know, which of the 64 uints I want to get

Vlad: If I stored two of them for example

Daniil: Cell is just a sequence of bits and some references to other cells (so that you can store almost any amount of data) (reply to 24025)

Daniil: So if you do: .store_uint(0, 3).store_uint(1, 2)  You'll have a cell that has "00011" bits value

Daniil: And .load_uint() loads the values from the beginning of the slice. So: a = s.load_uint(2); ;; '00' b = s.load_uint(3); ;; '011'

Daniil: If you store and load in the same order, you'll get the values correctly for sure

Vlad: Thank you, now I understand it better! (reply to 24030)

Yuri: Hey guys, do you know where I can find the implementation of the libs TonUtil.fif, GetOpt.fif and Asm.fif ?

Seitaro: https://github.com/ton-blockchain/ton/tree/master/crypto/fift/lib (reply to 24032)

User<1418229103>: hello, how to deploy contracts to testnet? I found a guide https://ton-community.github.io/tutorials/02-contract/ to deploy, but there are some expired method at guide.

User<1418229103>: the sendDeploy method didn't work for latest tonclient

changmyeong: You have to declare in ts interface (reply to 24035)

Daniil: It is declared above (reply to 24035)

순범: I have some questions about external msg.  what I understood is that external msg doesn't carry value. but I know that if contract not 'accept_message()', the gas fee (like computation fee) is deducted from msg gas credit. I think it is contradiction and I am misunderstanding it.

Nha: hi, I wonder how TON check the ownership of an NFT. What I see in the smart contract is just something like:    throw_unless(401, equal_slices(sender_address, owner_address));   What if someone crafts a message and states that he is the owner of the NFT and he would like to change_owner to his second wallet?

User<1418229103>: cannot invoke walletContract.sender() method (reply to 24035)

User<1418229103>: I want to deploy getgems collection and nft contracts: https://github.com/getgems-io/nft-contracts. But the guide is not matched latest ton/ton-core method. I'm very confused.

순범: you can also find that in collection contract, so that only deployer of collection (or owner) can deploy the nft.  but if you remove that part from collection and deploy the nft with account (let A) that is not owner of collection, you can make nft whose owner is A.  but you should not remove throw_unless(401) part of nft contract because it maybe about ownership_transfer (reply to 24039)

Daniil: It's impossible to spoof the message sender (reply to 24039)

&rey: If contract does not accept external message, it looks like it never existed in blockchain (maybe except deployment message). (reply to 24038)

순범: but isn't it okay if gas_credit is enough for computation even if contract doesn't 'accept_message()'?  I understood that the fee is deducted  from msg gas credit before 'accept_message()' and  from contract balance after 'accept_message()'  and if I'm right, I'm wondering where the gas credit came from, cause It is external msg (reply to 24044)

&rey: It's only credit: it has to be returned from contract's balance. (reply to 24045)

순범: thanks bro. can you check did I understand rightly?  1. external msg carries msg without value and all the fee is due of contract  2. 'accept_message()' only means that I credit the msg so that I'll set gas limit sufficiently  3. in the forwarding gas fee point of view, the difference of external and internal msg is that external msg is up to contract(receiver), and internal is up to sender  4. so that the total (sender + contract) gas fee for external msg will be equivalent to that of internal msg  is it right? (reply to 24046)

Daniil: accept_message() call means that contract confirms to pay for the fee for this message (reply to 24047)

순범: Thanks a lot! Have a good day~ (reply to 24048)

User<1418229103>: use these code cannot deploy correct collection contracts, what should I do when construct msg payload?

Vlad: I wonder how can I store strings in the contract? or some class? Ex: class student:         string name;          int mark;

Seitaro: You can store strings as slices https://ton.org/docs/develop/func/literals_identifiers#string-literals you also can use these strings to send text comments in messages : slice my_string = "Hello world!";  ... builder msg_body = begin_cell().store_uint(0,32) ;; specify that it is a comment                                                         .store_slice(my_string); (reply to 24051)

Daniil: Also if you want to send a message with long comment (128+ characters), check this docs page: https://ton.org/docs/develop/func/cookbook#how-to-send-a-message-with-a-long-text-comment

Vlad: Thanks! (reply to 24052)

User<1418229103>: how to pass stateInit param when transfer?

User<1418229103>: there is not stateInit param in transfer method

Daniil: Which library is it? (reply to 24056)

User<1418229103>: ton

User<1418229103>: I found a createTransfer method that included stateInit, but cannot send transaction.

User<1418229103>: do you have some doc that explained how to send transfer ?

&rey: Maybe, separate kind of serializing strings should be added in FunC compiler, that would include those 32 zero bits in slice to reduce instructions count? (reply to 24052)

Seitaro: Concatenation of such strings become less obvious, store_comment/store_text_comment helper looks more appropriate choice here (reply to 24061)

&rey: Yes, however I honestly don't know how store_comment could modify passed slice, especially if it's not literal but rather generated in runtime. (reply to 24062)

User<1418229103>: So, how to use ton-community/ton to create contract? How can I pass stateInit argument?

User<6247944943>: Hi, is there a way to fast-track pending transactions for my contract that allows everyone to mint NFTs? We would like to track these transactions and display them on our website or front-end.  The problem is that the TonCenter API is not fast enough to send messages to the user's front-end side. Users will obviously notice if there are a few seconds without any change on the page and won't know if their transaction was sent successfully.

User<1418229103>: How to deploy nft collection contracts? Are there some demo code with nodejs/typescript?

GameZone: Hello Fam! 💎  I hope you're rolling into the new week like a boss 😎  Let me outline the Live Rooms schedule we're hosting on TON&Co. during this week:  Monday 1pm CET - 💻 FunC + Sandbox Q&A by Sepezho (Tonana team) Tuesday 4pm CET - 🛟 Onboarding Q&A with Developer Onboarding Manager at TON Foundation (Roman Krutovoy) Wednesday 7pm CET - 🎤 Weekly draft pitch session with mentor guests Thursday 5pm CET - 🛠 Q&A session with Core Dev of Sandbox testing utility (Mark Okhman) Friday 2:30pm CET - 🇮🇳 🛠 Technical Q&A + TON Programming onboarding (Nujan team)  Check your timezones times here ➡️  https://join.toncompany.org/c/onboarding-events/  Don't miss out! The best way to learn is to socialise with other TON devs 😍  💻 FunC + Sandbox Q&A by Sepezho is starting in 2 hours! (forwarded from TON&Co.)

User<1418229103>: How to write cell to cell?

&rey: 1. append content? Create builder, convert both cells to slices and write both into that builder. 2. store reference? Put your (root/parent) cell content in builder, then use .store_ref(). (reply to 24068)

&rey: TS may have function storeRef, if I remember correctly. (reply to 24070)

User<1418229103>: ok

User<1418229103>: thank you

User<6247944943>: 👀 (reply to 24065)

&rey: 1. In general, you have to wait 15-25 s before transaction is shown in API (that's for mainnet, and testnet was even slower at the time I was checking it). 2. You can use event streams from tonapi.io, and possibly track user's wallet instead of your contract. 3. If you use TON Connect 2.0, you can receive BOC of external message that has been sent; you may track existence of such message in blockchain. (reply to 24065)

User<6247944943>: I can't sure how many wallet addresses are calling to my contract...? But thanks for reply.   Oh cool, so if my pages using TonConnect2.0, I basically can get the log / or data that knowing who is sending Txs to my contracts? (reply to 24076)

&rey: Yes, when you ask user to connect wallet, you receive its address. (reply to 24077)

User<6247944943>: then I paste it tot TonAPI to track his Txs and see if he is sending message to the blockchain? OK....

User<6247944943>: good to try.

Андрей: Should i keep all nfts in a global smart contract, or implement some logic to fetch all nfts?

&rey: Usually, explorers implement logic of NFT enumeration themselves, if you provide a method (on collection contract) to get NFT address by index. (reply to 24081)

&rey: And you shall not keep list of all NFTs in a single contract, as once upon a time the update transaction will have not enough TON and fail.

Андрей: Why should NFTs use TON Storage, if it requires regular payments?

순범: I'm making lazy minting code, and is there any example I can access? or can I get some idea? I'm wondering these.  1. how can I request user wallet (tonkeeper) to sign some data.  2. if #1 is solved and I construct DB, how can I let user's nft after minted to transfer to somewhere I want to send. can I make AuthenticatedProxy in ton chain, i.e. can I use delegate call? and if I can, how can I let nft to give authentication before minted?

User<6247944943>: anyone know how to pop with Back to fragment.com in TonConnect? (reply to 24086)

User<6247944943>: we integrate TonConnect successfully and edit in json file that with URL fields and more. But still can't get this return method as we did in Fragment.com. Why?

Step: fragment uses v1 tonconnect (reply to 24088)

User<6247944943>: wait, what (reply to 24089)

User<6247944943>: So V2(or the latest version) doesn't support fallback to web-page? (reply to 24089)

Tim: It does

Step: i am not sure about v2 just know fragment uses v1 (reply to 24092)

User<6247944943>: is there any code for V1 TonConnect? Thanks! (reply to 24089)

Tim: Use v2 (reply to 24095)

Tim: Tonconnect/ui

User<6247944943>: then can you share where is the field for the return URL we can add? Like I showed on Fragment.com? (reply to 24093)

Tim: Just use working package if you can't make it work by yourself

Tim: ^^ (reply to 24098)

Gajesh: are there any frontend templates for TON apps?

User<6247944943>: ok, thanks a lot. ^^" (reply to 24101)

Gajesh: can there be multiple messages in one tx?

&rey: At most 1 incoming, and 0-255 outgoing. (reply to 24104)

Gajesh: got it. thanks! (reply to 24105)

Step: Can we send ton from multiple wallet in single transaction/external message? (reply to 24105)

&rey: No, however you can forward message to second wallet to make it send next messages. (Though, second wallet will be some other smart contract, or you'll have to install first wallet as plugin of second.) (reply to 24107)

Gajesh: on https://www.npmjs.com/package/@tonconnect/ui-react:  what should i pass in manifestUrl while testing on localhost?

Андрей: Theoretically, it's possible to zero all fees if enough of validators agree?

&rey: Yes, but this could result in network overload not more than after 24 hours. (reply to 24110)

Андрей: Because of storage and compute usage rising up to the sky? (reply to 24111)

&rey: Yes, someone could bet on TON price fall and then deploy contract sending 255 outgoing messages to itself upon each incoming, increasing computations for block exponentially. (reply to 24112)

&rey: Some messages could be sent to random addresses, making sharding less effective.

&rey: Or the same contracts with other data (to randomize address) could be deployed, so they are in another shards, and sharding becomes totally useless.

Dmitry | backend4you.ton: Hi, I need help with tonlib client. I'm using https://ton.org/docs/develop/dapps/asset-processing/#deploying-wallet which says in n.5: "Then use createQuery and sendQuery .." But https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl does not contain any "sendQuery" text at all!  It contains "createQuery" (a bit below compared to line number in docs), but absolutely does not contain "sendQuery". How should I "send" my query?

Marlee: Looking 👀 for Func developer for an Exciting Project  Hello guys 👋, I'm reaching out to this group because I am currently looking for a Func developer for an exciting project that I am working on with a team. I hope this message finds you all doing well 🙌 We are looking for a Func developer with experience who is passionate about building innovative solutions 💻.  As a developer, you would have the opportunity to be a part of the project from the ground up and have a significant impact on its direction and success 🚀 If you or someone you know may be interested in this opportunity, please feel free to reach out to me directly. I would be happy to provide more information and discuss the project in further detail.  Thank you for your time and consideration 🙏

TON Answers Bot (not AI): Where to learn more about emission? from Telegram Chat Import  I'd like to know more about emission on TON blockchain. Where can I read about it? Or maybe instead of reading I should use an explorer to check some special contract addresses and see how it happens? Or read some source codes?   ---  > This question was imported from Telegram Chat: https://t.me/tondev/114806   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is it possible to store both an address and a hash table in the c4 register? from Telegram Chat Import  I'd like to put an address and a hash table into the c4 register. Can I put there both of them there separately or do I have to put the address into the hash table?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114601   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Wrong transaction  from Amirabbas  Hi  i send some usdt binance peg to ton coin binance peg contract address can i recover my money?  🔗 Answer on TON Overflow

Cihangir: Bu ne aq

TON Answers Bot (not AI): Wrong transaction  from Amirabbas  Hi  i send some usdt binance peg to ton coin binance peg contract address can i recover my money?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): How to check an account balance for a specific unixtime? from Telegram Chat Import  Is it possible to check what balance a specific wallet had in a specific moment in the past, given in unixtime? Is it possible to do that via Toncenter?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/52245    🔗 Answer on TON Overflow

vsnation 🟣: How can I get last block of TON blockchain?

vsnation 🟣: Can't find good explorer that will show readable data regarding blocks, not only transactions

Eugene: Maybe this will be of some help: https://answers.ton.org/question/1543146862700138496/how-to-get-the-latest-block-number (reply to 24126)

vsnation 🟣: Great job! Thanks! If i got it right, it's seqno param (reply to 24127)

Step: Hi what is the use of dht server? (reply to 23703)

Step: Does it help connect to lots of other node?

TON Answers Bot (not AI): How much TPS can TON blockchain currently process? from Telegram Chat Import  It is known that TON is designed for scalability and can potentially withstand mass adoption in the future. But since it has not reached its full potential yet, there is no need to push to the limit and implement all the possible optimizations at the time. So what it the maximum bandwidth of the system right now in terms of TPS, how many transactions per second can it process?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/44362    🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there a convention for the "unsupported opcode" error code?  from Telegram Chat Import  What error code should a smart contract use when dealing with an unsupported opcode? Is it up to the smart contract developer, or there is a conventional one for everyone to use?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/114747   🔗 Answer on TON Overflow

Dmitry | backend4you.ton: I found answer myself, maybe it will be useful to anybody:  Instead of sendQuery use query.send id:int53 = Ok, which needs id that is part of query.Info retuned by createQuery. (reply to 24116)

Gajesh: on https://www.npmjs.com/package/@tonconnect/ui-react:  what should i pass in manifestUrl while testing on localhost?

Tim: anything that works

Рома: hello guys, does anyone know how to parse data from the Schemas list, here is the page https://tonapi.io/swagger-ui

Dmitry | backend4you.ton: https://tonapi.io/swagger.json give this json to swagger generator tool for your language. UI is just a human representation of this json with some buttons and input boxes (reply to 24136)

— 2023-03-07 —

TON Answers Bot (not AI): Connection from Chaka Kon  Is t.coincoin.art and TON connected?  🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there an example of snake using the latest ton-core libraries?  from cryptobugbear  I am trying to test and work with an updated version of getgems.io-snake example.   I got my flattensnake working, however for the makeSnakeCell function I run into the following trouble -   export function makeSnakeCell(data: Buffer) {     let chunks = bufferToChunks(data, 127)     let rootCell = beginCell()     let curCell = rootCell      curCell.bits.writeBuffer(chunks[0])     for (let i = 0; i < chunks.length-1; i++) {         let chunk = chunks[i]           if (chunks[i+1]) {             let nextCell = beginCell().storeBuffer(chunks[i+1])       curCell.storeRef(nextCell)             curCell = nextCell         }     }      return rootCell.endCell() }  The rootCell has only the first ref. I think the issue is the assignment of nextCell to curCell as builder and not as a cell. However, if I try to endCell for both curCell and nextCell and then assign it throws an error.  If someone already has an updated version that would be great!  🔗 Answer on TON Overflow

User<456620184>: Hi could I create a commodity token that is pegged to the gold standard with a Jetton altcoin?

Wizgot: Wat wud it be backed by? (reply to 24143)

순범: hi guys. I'm suffering from making signed transaction.  I'm developing some lazy minting code and I wonder how can I let wallet to make signed msg.  I'm using ton-connect and It only has sending msg function, I think there's no signing function.  how can I request wallet to make signed transfer? I know there's funcs in ton, and ton-core so that it will be not that difficult to make signed transfer with mnenomic key but I have no idea how to make request.

&rey: Maybe you should post this as proposal for TON Connect 2.0. (reply to 24145)

순범: oh no,,,, is there any way to request wallet to make signature? (reply to 24146)

&rey: Currently, it seems there isn't. (reply to 24147)

User<6247944943>: nice (reply to 24109)

Gajesh: lol. that was a Q (reply to 24151)

Samyar: how can i use my previously created wallet ? i don't want to create a new wallet.

liminal: Third lesson's out now! Learn how to manipulate hashmaps, builders, cells, slices and how to write efficient recursive functions. https://youtu.be/LlG5xvitnow

doni: if you use the same mnemonics/ private key  you will use your wallet

doni: ☝️ (reply to 24153)

TON Answers Bot (not AI): How can i connect my wallet to my program ? from samyar  I have a backend, and we want to connect a specific wallet to our app and use it to transfer funds and receive funds. I found an SDK to create a wallet but i couldn't find a way to connect my previously created wallet to the app. !(https://i.imgur.com/fHFWl2s.png)  🔗 Answer on TON Overflow

Samyar: oh thank you (reply to 24155)

User<1418229103>: what means of these param? if factory=100, base=200, what is the royalty value? 5%?

Hexablock: can you share ton faucet website?

E: Hi eveyone, We are looking for devs w experience in FunC, TON environment, and/or Telegram API for our killer project. Those interested can DM me for further information.

User<1418229103>: is 50%? (reply to 24159)

Seitaro: 50% You can check standard here https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md (reply to 24159)

User<1418229103>: thanks (reply to 24163)

Vadim: Hi all, got a question - we are negotiating the project and almost there, the big issue that's stading in front of us as of right now - is to write TON smartcontract. Being quite fresh here, please pardon if it is the millionth question hehe 1 with what to start creating this contract? 2 what are the basic requirements for smartcontract? Any help or live experience is highly appreciated

Andrew: 1. official ton.org/docs and blueprint (reply to 24165)

ezji: yo guys, can't find address for getgems contract (marketplace contract address), could you help pls?

User<1418229103>: what is BitBuilder overflow?

Dmitry | backend4you.ton: TonLib.NET now (v0.8) supports sending TON too. (reply to 23764)

Owdares: Good job, thank you (reply to 24169)

Hermès: any reliable API can fetch for TON Price?

Andrew: места не хватает (reply to 24168)

User<6247944943>: I think you can use dTon.io? (reply to 24171)

TON Answers Bot (not AI): Easiest way to send transaction from Gajesh Naik  what's the easiest way to sendTransaction with TonConnect 2.0?  for example,   message: "contribute" value: "0.1 TON" address: "Something"  🔗 Answer on TON Overflow

&rey: /report (reply to 24174)

TON Answers Bot (not AI): How to convert friendly address to address? from Gajesh Naik  How Can I convert friendly address like "EQAl8KJAV7QeFwTnyjrABJc1QE-L3UMe4SEsmsdsdxMhIm-Z" to "E:asdfasjdf;kajsfdsad"  🔗 Answer on TON Overflow

User<5988381845>: 😃

TON Answers Bot (not AI): Can't send transaction from Gajesh Naik  I'm getting the following error:  "The action was canceled because there were no expected changes in the blockchain."  For this code:   const contribute = async () => {      const tx = tonConnectUI.sendTransaction(       {         validUntil: Date.now() + 10000000000000,         messages: {           address: "0:a07951bde91d326bf52118c49d8387e68e55f3961cbf24d90ac4758095f981da",           amount: amount,           // payload: "contribute"         }       }     )   }    🔗 Answer on TON Overflow

User<1518952680>: how can I programatically initialize wallet?

User<1518952680>: i'm tring to deploy wallet from python, at the moment it's not initialized

User<1518952680>: I'm getting error  network.error.NetworkError: 500: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

Marlee: Looking 👀 for Func developer for an Exciting Project  Hello guys 👋, I'm reaching out to this group because I am currently looking for a Func developer for an exciting project that I am working on with a team. I hope this message finds you all doing well 🙌 We are looking for a Func developer with experience who is passionate about building innovative solutions 💻.  As a developer, you would have the opportunity to be a part of the project from the ground up and have a significant impact on its direction and success 🚀 If you or someone you know may be interested in this opportunity, please feel free to reach out to me directly. I would be happy to provide more information and discuss the project in further detail.  Thank you for your time and consideration 🙏

Roman: hey! Try to post a vacancy here:  http://jobs.ton.org/ (reply to 24184)

vsnation 🟣: Is there a way to verify user action? For example, when user connects its wallet I need to verify that it's him.  It mostly similar process with EVM Sign

vsnation 🟣: Maybe WalletStateInit can be verified with address received after the wallet connecting.

Tim: when you connect user with tonconnectv2 you can specify proof that will be signed by wallet

vsnation 🟣: Do you have a link to the doc? (reply to 24188)

Tim: tonconnect v2 github docs

&rey: https://ton.org/docs/develop/dapps/ton-connect/integration#connection-with-tonproof (reply to 24189)

talkol: Tact Software Foundation  We are happy to announce the establishment of a Tact Software Foundation (TSF for short): a non-profit organization whose goal is to build developer tools for the TON ecosystem to accelerate TON adoption. Such tools include Tact Language, core libraries for most major languages, excellent education materials, and many more.  Four founders manage the foundation: * Oleg Andreev (Tonkeeper and Ton Apps) * Steve Korshakov (ex Ton Whales and Telegram) * Tal Kol (Orbs) * Kirill Emelyanenko (TON Foundation)  With help of advisors: * Kirill Malev (First Stage Labs) * Lyubov Shombina  Building for other developers is fun. Therefore, we want to create a solid developer-friendly organization where talented developers can do what they wish in the TON ecosystem without worrying about uninteresting things. Together we can collaborate faster and rapidly expand what is possible in TON by solving most of the long-standing roadblocks to developing new tools and services for TON.  Starting today, we welcome all developers of libraries for Ton for any major language to contact me (@steve_kite) to discuss collaboration options and funding your work under TSF.  In the coming days, we will introduce our new branding guidelines, start fundraising and release Tact v1. (forwarded from TON Development News)

Vladimir: Or maybe you want to give thumbs up to this footstep: https://github.com/ton-society/ton-footsteps/issues/168 (reply to 24189)

vsnation 🟣: Thanks! The issue with lengthBytes of a domain got 1 hour of time. (reply to 24194)

Vladimir: Yes it is hard to understand and to do it right.  Verifying the TonProof should be done once per wallet connecting to the backend.  Did you already  verified authentication with JWT (Json web Token)  that should be done for every request that the backend receives? (reply to 24196)

vsnation 🟣: It's not required to make it in each request. (reply to 24197)

vsnation 🟣: You can put your token into session and that's it

Vladimir: But after you need to verify it.

vsnation 🟣: You need to verify it only once (reply to 24200)

vsnation 🟣: It will be like auth form for a user

Vladimir: Tonproof only once, but the authentication beaer for every request.

vsnation 🟣: authentication beaer is not needed (reply to 24203)

Vladimir: It is JWT, not form authentication.

vsnation 🟣: Moving The Old Castle Defense to TON chain.

Vladimir: Did you analyze the example backend in go? The function getAccountInfo ?

vsnation 🟣: Yes (reply to 24207)

Vladimir: Ok

S.Jeyalakshmi: Hi, can anyone tell how can I compile and deploy the smart contracts from getgems?

vsnation 🟣: Do you know how to receive client id? (reply to 24209)

S.Jeyalakshmi: I had sorted out how to compile the contact but not sure how to deploy then, can only one help me with this?

vsnation 🟣: I've seen that its unique ID for user wallet, address can be forged

Vladimir: My idea is to explain that also in the footstep. (reply to 24211)

Vladimir: So your thumbs up there are appreciated: https://github.com/ton-society/ton-footsteps/issues/168

a: I am trying to create and deploy a custom "jetton" via contract. I have found the TONCLI for the job. I followed a guide while setting it up. "toncli" command works fine. "toncli start jetton_minter" works fine. But when I try "toncli build", I get the error   """ cannot open source file params.func   #include "params.func";   ^ """  The file is in the folder which is stated by the "project.yaml" file. What am I missing?

순범: Maybe it is problem of directory and func file is .fc (reply to 24216)

— 2023-03-08 —

a: Nope, I have already checked it (reply to 24217)

Vlad: Does any one know how to convert a string into slice/integer in tonconnect, so I could send it in a message to the contract ?

User<6172149024>: Hi

liminal: Forth lesson's out now! https://youtu.be/aQ-rbkayOhE

순범: hi. I'm making nft sales contract and I'm wondering is there any schema of nft sales contract like this  https://testnet.tonscan.org/address/EQBIc75KydjQ3BNKmSUVW9mxnrtOqe1UTMJEFUTbAXJs0xc0  and how can I find contract schema of such contract types?

Oğuzhan: I following this repo option 2

Oğuzhan: https://github.com/ton-blockchain/minter-contract

Oğuzhan: But i have a some problem

Vlad: Can a slice contain other slices?

Vlad: If yes, how can I load them?

Dario: https://github.com/TonoxDeFi/open-contracts/blob/main/contracts/slices/slices.func  you can use preload_slice_offset or load_slice (reply to 24234)

Vlad: The thing is that I am using udict_get? and it returns slice corresponding to the key, but I store several slices with each key in the dictionary

Vlad: So I wonder what it will return

Slava: Hello everyone! Based on the objective request from one of the developers in this chat, the idea came up to stop forwarding questions from "FROM TELEGRAM CHAT". Now there will be less flooding and only questions from real people with answers.ton.org will be forwarded.  @AnswersTonBot is at your service!  You can always contact me for feedback on the bot's work. (reply to 24180)

Gajesh: so if i want to transfer jetton tokens from user to smart contract, how can i do that in one transaction?  for example, i'm building a staking pool where user should deposit Jetton tokens.   how can i do that?

Gajesh: or are there codes already implementing this?

Андрей: Can smart contract sign data with some sort of private key unknown to anyone?

Gajesh: smart contracts can sign transactions without private key (reply to 24241)

Daniil: No, but why do you need that? (reply to 24241)

User<6247944943>: What is  the cost to store data in the TVM TON Blockchain at this moment?  And what is the difference if we using TON Storage rather than Cell?

&rey: In blockchain, 1 MB costs 4 TON per year. (reply to 24244)

Dario: ton storage => offline , depends on provider ton cell => check ton storage fee (reply to 24244)

Tim: sounds too cheap (reply to 24245)

User<6247944943>: interesting (reply to 24246)

&rey: TON Storage only ensures storage providers don't receive money if they don't store the file, and not ensures that files are actually stored. This is more about availability. (reply to 24244)

Andrey: There’s some price for deploy it, so I guess it cost more (reply to 24247)

&rey: Yes, the main cost there could be building all those cells. (reply to 24250)

&rey: https://ton.org/docs/develop/smart-contracts/fees#calculator-example (reply to 24245)

Tim: i think you should Math.ceil(size/1023)?

Howard: good point, let me add this to Answers.ton.org (reply to 24249)

Андрей: Can ton storage be used as a CDN?

&rey: I think yes, but currently there are no standard for that. You may propose one. (reply to 24256)

User<6247944943>: anyone know why got this error when put a sale on test getgems.io?  firstTry: fail exit_code #0

mberk: Hey bros is there a any instruction about how to set up a connection between tonkeeper and telegram bot

mberk: Ton keeper or any another wallet it doesnt matter

User: ton-connect (reply to 24264)

mberk: Yes but i research it but i cant find exact instruction

mberk: Is there an example telegram bot that works with Tonkeeper?

User<6247944943>: How can we check whether a NFT Item is in listing status? (reply to 24262)

User<6247944943>: Auction sell will also got this error tho

Howard: Can an NFT expert tell me how to pass the individual_content from a collection to an NFT item initially?   Since we can't put it in the initial parameters, it would change the contract address if we did so.  I am try to implement a editable NFT Collections.

Step: send individual content in payload/body when minting? (reply to 24270)

vsnation 🟣: Is there a way to ask transfer of NFT via TONKeeper qr or link?

Tim: They're implemented, check official contracts (reply to 24270)

Maksim: https://github.com/tonkeeper/wallet-api#transfer-nft (reply to 24274)

vsnation 🟣: Do I need to keep [] in arguments? Url opens sending of TON in any case, not NFT preview or something  nft-address - which one, Raw or human-readable?

Tim: I'm not sure this api is working with all wallets. Better to use base64 encoded payload with transfer body  But [] should not be in the end url

vsnation 🟣: Can you navigate me please to the doc about it? (reply to 24279)

Tim: just transfer/address?amount=1000000000&payload=base64url-of-the-boc

vsnation 🟣: I want to ask user to transfer NFT, so I need to base64 all params? (reply to 24281)

Tim: you need to create message that user will send to nft which will transfer it

Tim: like this

vsnation 🟣: Thanks! Maybe you know, where can I find support of TonKeeper talk to them about this method:  https://app.tonkeeper.com/transfer/<destination-address>?     [nft=<nft-address>&]     [fee-amount=<nanocoins>&]     [forward-amount=<nanocoins>] (reply to 24284)

Diako: https://t.me/tonkeeperdev (reply to 24285)

— 2023-03-09 —

Howard: I used payload for other usages.    The next question will be, “can we combine a Cell with Int and store it in payload and decode those two back 1 cells and one int. (reply to 24271)

Step: Store as ref cell? (reply to 24291)

Step: begincell.storeint().storeref(cell).endcell() ?

Vlad: I am looking into this tutorial, step 9: https://ton-community.github.io/tutorials/02-contract/  async getCounter(provider: ContractProvider) {     const { stack } = await provider.get("counter", []);     return stack.readBigNumber();   } how can I set arguments for the counter getmethod? (in my contract getmethod needs to take one argument) should I set it inside [ ] ?

testertesterov: Maybe this can help

testertesterov: Yes, you can set the arguments for the `get` method inside the square brackets `[]` as an array of arguments.   For example, if your `get` method in the contract takes one argument of type `uint256`, you can set it like this:  ``` const { stack } = await provider.get("get", [123]); // pass 123 as the argument ```  Here, `123` is just an example argument value. You can replace it with the actual value you want to pass to the `get` method.   Make sure to check the argument type and format expected by the `get` method in your contract, and pass the arguments accordingly. (forwarded from ChatGPT4 | Midjourney)

Vlad: Thank you! (reply to 24296)

Howard: Yes, I have used loadRef(), but I don't understand the difference with preloadRef(). (https://docs.tact-lang.org/language/ref/cells#sliceloadref)  My question is, can using preloadRef() cause a crash or result in reading wrong data from another memory space?  What is the difference between loadRef() and preloadRef()? (reply to 24293)

User<6247944943>: 👋🏽 (reply to 24269)

testertesterov: `loadRef()` and `preloadRef()` are both used for loading data from a reference cell in Tact. However, there are some differences between them.  `loadRef()` is a synchronous function that returns the current value of the reference cell. When you call `loadRef()`, it will block the execution of the current program until the value of the reference cell is available. This means that if the value of the reference cell changes frequently, calling `loadRef()` may result in a lot of waiting time.  `preloadRef()` is an asynchronous function that loads the current value of the reference cell in the background while allowing the program to continue executing. This means that `preloadRef()` won't block your program while it's waiting for the value of the reference cell to become available. Instead, it will return a promise that will resolve to the current value of the reference cell when it's available.  The main difference between `loadRef()` and `preloadRef()` is that `preloadRef()` is non-blocking, while `loadRef()` is blocking. This means that using `preloadRef()` is less likely to cause a crash or result in reading wrong data from another memory space, since it won't block the program while waiting for the value of the reference cell to become available.  However, it's important to note that if you use `preloadRef()` and the value of the reference cell changes frequently, you may end up with stale data. In that case, you should consider using `loadRef()` instead to ensure that you always have the most up-to-date data. (forwarded from ChatGPT4 | Midjourney)

testertesterov: Please write if this analysis helped you 👍

Howard: OMG, lol 🤣 (reply to 24301)

Yuri: Wouldn't loadRef, load and consume a reference from a slice and preloadRef, load but doesn't consume the reference from the slice being parsed? (reply to 24301)

testertesterov: I think this piece of documentation can help solve this issue 😎

testertesterov: Yes, you are correct. `loadRef()` and `preloadRef()` differ not only in their blocking behavior, but also in how they handle references to slices.  When you call `loadRef()` on a slice reference, it will consume the reference and return the contents of the slice. This means that the slice reference will no longer be valid after calling `loadRef()` on it.  On the other hand, when you call `preloadRef()` on a slice reference, it will only load the contents of the slice in the background and return a promise that resolves to the contents of the slice. The slice reference is not consumed, so it can still be used to access the contents of the slice later.  So, if you need to access the contents of a slice multiple times, it's better to use `preloadRef()` to avoid consuming the slice reference. However, if you only need to access the contents of the slice once, you can use `loadRef()` to simplify your code and avoid having to deal with promises. (forwarded from ChatGPT4 | Midjourney)

Andrew: it's very misleading (reply to 24306)

Andrew: there are no promises or async whatsoever

testertesterov: I apologize for the confusion. You are correct that there are no promises or async involved in the `loadRef()` and `preloadRef()` functions in Tact.  In Tact, `loadRef()` and `preloadRef()` are used to load data from a reference cell into a variable. However, they differ in how they handle reference cells that contain slices.  When you call `loadRef()` on a reference cell that contains a slice, it will consume the reference to the slice and return the contents of the slice. This means that you can only use `loadRef()` once on a reference cell that contains a slice.  On the other hand, when you call `preloadRef()` on a reference cell that contains a slice, it will load the contents of the slice in the background and return a new reference to the slice. This means that you can use `preloadRef()` multiple times on a reference cell that contains a slice.  I apologize for any confusion my previous response may have caused. (forwarded from ChatGPT4 | Midjourney)

Vlad: How to transform a string into slice off-chain? (Js, typescript)

shahar: Hello, I am building a tool to revive frozen accounts. I’m looking for examples of frozen addresses we can unfreeze to test on - if you have one and would like to try the tool, please contact me.

TON Answers Bot (not AI): How can I convert string type value to Slice type? from Wooogy  I'm trying to save the string data in the contract on the client side (typescript) by using ton-core SDK. beginCell().storeSlice("my string data") Is there any solution or sample code related to this??  https://github.com/getgems-io/nft-contracts/blob/main/packages/nft-content/nftContent.ts I tried to use the example code, but there is an error in it itself.  cs.readRemainingBytes(); -> class Slice https://ton-community.github.io/ton-core/classes/Slice.html doesn't have readRemainingBytes function.  curCell.bits.writeBuffer(chunk); -> class BitString https://ton-community.github.io/ton-core/classes/BitString.html doesn't have writeBuffer function   🔗 Answer on TON Overflow

testertesterov: TextEncoder->strBytes->subarray()->sliceBytes->TextDecode->sliceBytes->sliceStr ? (reply to 24310)

User<6247944943>: How megaton fetch the oracle price btw?

Vlad: It’s actually my colleague😄 (reply to 24312)

Vlad: Can you provide more details, please? (reply to 24313)

testertesterov: The process you described can be used to transform a string into a slice of bytes, and then back into a string. This can be useful in TON when dealing with strings in byte format, which is how they are commonly represented in the TON network. By converting a string to a slice of bytes and vice versa, you can work with these strings in a format that is more compatible with the TON network.  For example, if you need to send a string over the TON network, you would first need to convert it to a slice of bytes using the process you described. Then you could send the slice of bytes over the network. When the slice of bytes is received on the other end, it would need to be converted back into a string using the same process in reverse order.  Similarly, if you are working with an interface that only accepts strings, but you have a slice of bytes that you need to pass to it, you would first need to convert the slice of bytes to a string using the process you described. Then you could pass the string to the interface.  Overall, the process of transforming a string into a slice of bytes and vice versa is a common task when working with strings in byte format on the TON network. (forwarded from ChatGPT4 | Midjourney)

testertesterov: As an AI language model, I am not capable of providing opinions or beliefs as I do not possess personal emotions. However, I can confirm that the process you described can be useful in TON when dealing with strings in byte format. (forwarded from ChatGPT 4.5 | DeepSeek | Midjourney)

User<6247944943>: it's incorrect, right? (reply to 24318)

testertesterov: Depending on what to use, but I think it's worth checking out this code snippet: const str = "Hello World!"; // set string const encoder = new TextEncoder(); // create an instance of the TextEncoder class const strBytes = encoder.encode(str); // convert string to byte array const sliceStart = 1; // set the beginning of the slice const sliceEnd = 5; // set the end of the slice const sliceBytes = strBytes.subarray(sliceStart, sliceEnd); // create a slice from an array of bytes const decoder = new TextDecoder(); // create an instance of the TextDecoder class const sliceStr = decoder.decode(sliceBytes); // convert slice back to string console log(sliceStr); // output the result to the console (reply to 24320)

4xMafole: Remember ChatGPT gives info limited to 2021 September. (reply to 24319)

Andrew: use ton-core lib, it has a comment() method that accepts string and returns cell (reply to 24310)

Andrew: this is useless (reply to 24321)

testertesterov: There are other options? (reply to 24324)

Andrew: yes (reply to 24323)

testertesterov: Please tell me (reply to 24326)

testertesterov: Today I wrote a quicksort in Fift using it. I don't know if it works or not, but I would hardly have mastered it myself :) (reply to 24322)

4xMafole: Yer some Fift works though. But for  funC, it doesn't know if it even exists. Though it can explain it. Wierd. (reply to 24328)

User<6247944943>: I think we can pause the bot first and open a channel for Dev+ChatGPT. Otherwise It will just spam the chaneel (reply to 24321)

testertesterov: I think in this case the questions will remain unanswered in any way :) (reply to 24330)

testertesterov: ton-core version is still minor 0.48.0 It looks like there have already been cases of moving to the archive. You also need to understand that the project will have one more unfinished dependency :) Did I find the correct ton-core? (reply to 24323)

Andrew: yes, it's the correct one (reply to 24332)

testertesterov: Thanks! 👍 (reply to 24333)

Dario: Hello, I need help. Is it just for me or TON right now doesnt support multiple backers for same public library? The transaction just got rejected.

User<6110186685>: Всем привет

testertesterov: Is there an online sandbox for testing programs on Fift?

User<59608113>: 👨‍💻  Just a friendly reminder, that we have a super awesome Q&A session with Max from Sandbox testing suite team.  If you're wondering how TON contracts are beeing tested under the hood on your local machine - you're very welcome!  Please don't forget to RSVP!  Thursday 5pm CET - 🛠 Q&A session with Core Dev of Sandbox testing utility (Mark Okhman)  🗣 RSVP and join session  P.S. It starts in 5 hours 😍 (forwarded from TON&Co.)

Roman: Hey Tim, could you make a small PR with fix for that, please? (reply to 24253)

Tim: I think somebody else should also check it, because it changes yearly cost to 6 tons/mb (reply to 24341)

Tim: https://github.com/ton-community/ton-docs/pull/188 (reply to 24341)

Roman: Thank you! (reply to 24343)

Steve: btw it might be interesting to compare it via emulator

Steve: deploy contract, move time year forward and check how much sotrage was substructed)

testertesterov: As an AI language model, I am not able to RSVP or join the session, but thank you for letting me know about it! (forwarded from ChatGPT 4.5 | DeepSeek | Midjourney)

Alexander: How can I send nft to another user via TONKeeper? The method on the screenshot does not work correctly, it sends TON

Jeff: Hi guys, I'm looking to make a transaction or contract that sends the swapped tokens to other user with stonfi. Any idea or resource that I can find help to get started?

User<5742513670>: Is there anyone from China?

User<59608113>: ⏺ We are going live with a core developer of Sandbox (TON contracts testing suite)  🗣 Join now! (forwarded from TON&Co.)

Howard: cool

Will: Really cool (reply to 24354)

Dario: the stonfi dex just use standard transfer to send jettons. As described in swap api, you can specify to_address  to specify a different address than sender more (reply to 24350)

vsnation 🟣: Is there a way to send bundle of transactions to multiple users?

vsnation 🟣: We're moving The Old Castle Defense P2E Game(@ocd_game) onto TON blockchain. Would be glad for any help.

Andrew: you can use highload wallet contract as a reference (reply to 24357)

vsnation 🟣: it's works like Disperse on EVM?

Andrew: I'm not familiar with disperse, sorry

vsnation 🟣: No probs, will test out multiple txs sending at one time with diff nonce (reply to 24361)

testertesterov: I tried to build Fift from the official documentation. Did not help. Not even the robots helped. Where can I find libraries for fift? path/to/fift/libs?

testertesterov: I already tried building /lite-client , but that didn't help either. /lite-client worked on testnet.

Seitaro: https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/ (reply to 24363)

— 2023-03-10 —

Jeff: Thanks! I'll check. (reply to 24356)

Alex: does anyone know how can I get Transaction information by txHash?

testertesterov: : printstr { s }  s strlen 0 do  dup i type loop  cr ; "Hello, world!" printstr  Will it run in Fift?

Eugene: Not exactly sure where they are in your case, but you can try checking /usr/local/lib/fiftlib (reply to 24363)

&rey: I think no, because definition of printstr seems syntactically incorrect. (reply to 24381)

testertesterov: Agree. It looks like the AI model is stubbornly giving me results in Forth and not in Fift.  I'm trying to teach a robot to write in Fift. Now I uploaded a book from Nikolai with documentation into it. I'll test more tomorrow.

User<6247944943>: Is there a reliable/recommended vendor for buying TON with a credit card that we can implement into our product?   The vendor should have acceptable fees and offer a reliable API/SDK.

Roman: 💎 Testnet Faucet: Receive testnet TON coins even faster!  In the next months, we aim to remake a cutting-edge testnet faucet to make your blockchain testing experience a breeze!   Little surprise! We're thrilled to announce the launch of our small AI assistant, Lenna! We want to test how AI could help us collect feedback in a more experimental way! 😊  She's eager to hear from you and help us collect valuable feedback about your experience with our testnet faucet.  Don't miss this opportunity to have your voice heard and help us improve the testnet faucet!   ☁ Connect with Lenna now through our user-friendly chat platform at https://rhetor.ai/vGIvjU2u.  Your feedback is the key to TON's success!

Step: Give more ton , 2 ton is nothing. (reply to 24387)

Howard: yes please, give me more testTON! (reply to 24387)

сharsss: Hey guys! Are there any beginners guides for python?  How to listen node (get all transactions/blocks live) How to get nft/auction details from block etc

сharsss: Saw few sdk, but didn't find any with proper guides, enough examples (reply to 24392)

TON&Co.: 🟡  Happy Friday Fam!   Just a quick reminder that we have one more FunC Q&A session this week, namely - today 🥳  It will be a regular session hosted by Nujan team based in India.  Nujan is an online IDE for TON that is enabling you to write your smart contracts from anywhere, on any device with no setup. https://nujan.io  Friday 2:30pm CET - 🇮🇳 🛠 Technical Q&A + TON Programming onboarding (Nujan team)  It starts in 20 mins!  🗣 Link to join the session

Eugene: It looks like the link to join is wrong, it leads to another session  Here is the correct one: https://join.toncompany.org/c/onboarding-events/technical-q-a-func-typescript-web-274395 (reply to 24394)

TON&Co.: Thanks! Fixed 🙂

Daniil: Hello, can anyone explain this error when trying to check tonproof with demo dapp backend auth service  proof checking error: wrong domain: {$byte_length $domain_name}  Marked private info with $

Tim: you used wrong domain?

Daniil: 😅 should’ve change in the config of backend

màtín: hi  when i import @twa-dev/sdk i get this error 👇  BREAKING CHANGE: The request './sdk' failed to resolve only because it was resolved as fully specified  (probably because the origin is strict EcmaScript Module, e. g. a module with javascript mimetype, a '*.mjs' file, or a '*.js' file where the package.json contains '"type": "module"').  The extension in the request is mandatory for it to be fully specified.  Add the extension to the request.       "react": "^18.2.0",      "react-dom": "^18.2.0",      "react-scripts": "5.0.1",

TON Answers Bot (not AI): When we set the metadata for the NFT, there is a field for "marketplace". Does that field matter? S from Howard  When we set the metadata for the NFT, there has a field for "marketplace". Does that matter? Should we prepare others to support more NFT marketplace, or future of marketplace?   !(https://ibb.co/khzp4Fn)  🔗 Answer on TON Overflow

Howard: oh, and I think would be great if I can upload the image by ctrl + V rather than screenshot then find a website to upload, then paste the link when I asking the question. (reply to 24401)

Step: is there any comparison table for wallet versions? v1 v2 v3r1 v3r2 v4r1 v4r2 ?

User<6247944943>: good question (reply to 24403)

User<6247944943>: btw what is the "subscription" usage here?   https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc

Step: subscription is automatically deducting ton from your wallet like credit cards for recurring payment. (reply to 24405)

Seitaro: https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md (reply to 24403)

màtín: hi I have a problem   I will be happy if you help me  in my react app I got this error (i didn't use Vite)    Uncaught ReferenceError: Buffer is not defined       "react": "^18.2.0",      "react-app-polyfill": "^3.0.0",      "react-dom": "^18.2.0",      "react-scripts": "5.0.1",  source: https://github.com/MatinJiridity/ton-client.git

Daniil: https://ton.org/docs/participate/wallets/contracts (reply to 24403)

Ala: Hello 👋 please guys did someone have any idea about this error

&rey: It seems that your wallet app tries to show some other request. Or you are sending two transaction requests simultaneously. (reply to 24411)

TON Answers Bot (not AI): Are there guidelines for building a dApp? from Telegram Chat Import  While building a dApp some questions arise such as "where to store static files for UI" and "where and how to cache data for the app to be responsive". Is there any guide that would answer all the questions like that?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/115998   🔗 Answer on TON Overflow

TON Answers Bot (not AI): Is there a way to get more testnet coins? from Telegram Chat Import  There is bot that gives away testnet coins to anyone who asks, but only 2 coins per hour. What to do if I need more than that for testing purposes?  ---  > This question was imported from Telegram Chat: https://t.me/tondev/115983   🔗 Answer on TON Overflow

Daniil: @delovoyslava didn't you say that the bot won't forward questions from 'Telegram Chat Imports' anymore?

Slava: hmm, right.  I'll check (reply to 24415)

ˢᶦᵃ: java (reply to 24420)

Ö: Hi, I am trying to interract with my contract using tonconnect. I couldn't find any doc about contract interactions. Where to start?

Ö: I tried something like this, it sends the transaction but data doesn't change at contract. ''' const messageBody = beginCell()       .storeUint(1, 32) // op (op #1 = increment)       .storeUint(0, 64) // query id       .endCell();  const contractAddress = Address.parse('EQBQe02m6v7svDm2LZq0KcXdSDQrjPSbMtpobOxECyeeucKj').toString(); const defaultTx2 = {  validUntil: Date.now() + 1000000,  messages: [   {    address: contractAddress,    amount: '2000000',    messageBody   },  ], }; tonConnectUi.sendTransaction(defaultTx2) '''

ekt: Hi guys, just wanted to double check, can you burn nft on ton?

Howard: Good question, haven’t see this. But I think can implement a status to check before the Transfer receiver. (reply to 24424)

Howard: But I think there is a “dead” address we can send NFT to? Like how we burn the token in Ethereum? (reply to 24424)

ekt: Do we have a special address allocated for this or could this maybe be implemented ? Thanks :)) (reply to 24426)

Steve: You can deploy an empty contract that accepts any internal (but not external message)

ekt: Thanks :)) will try it out (reply to 24428)

— 2023-03-11 —

Howard: maybe can take reference here:  https://answers.ton.org/question/1544874631742099456/how-do-you-send-jettons-programmatically (reply to 24423)

Howard: is there more tutorial about TON Storage yet?  https://ton.org/docs/develop/howto/compile#storage-daemon

TON Answers Bot (not AI): What is  the cost to store data in the TVM TON Blockchain at this moment?  And what is the difference if we using TON Storage rather than Cell? from Telegram Chat Import  Can you provide information on the cost of storing data in the TVM TON Blockchain at the current moment? Specifically, how much does it cost to store data using TON Storage, and how does this compare to storing data using Cell?  Additionally, could you provide more context on how storage works in the TON ecosystem? I noticed that paying for chain storage is not a one-time fee, but rather a continuous rent payment. Could you elaborate on this process and how it affects smart contracts?    This question was imported from Telegram Chat: https://t.me/tondev/115983  🔗 Answer on TON Overflow

Howard: Saving 1 MB of data for one year on TON will cost you 6.01 TON. Note that you don't usually need to store big amounts of data on-chain.   Consider [TON Storage] if you need decentralized storage. (reply to 24343)

Howard: Hi, I think this website is currently out of maintenance. (I came across this while cleaning up the Q&A on the forum.)  @p37d2zx5 (reply to 2002)

ekt: Hi guys, a bit off topic, but could maybe someone advise what would be the best way to start contributing to Ton / FunC backend, if there are good issues for beginners and if any help is needed on that ? :)

Andrew: take a look at footsteps (reply to 24435)

Andrew: /report (reply to 24437)

Alex: Also, there are small issues could be found here  https://github.com/ton-community/ton-docs/issues (reply to 24435)

ekt: Thanks :)

Alireza: Hi, I want to connect to lite-server and read blockchain data directly. Is there any API and docs?

Mr: منم همین مشکل رو دارم داش عیلرضا اگه جوابتو دادن  ب منم بگو سلطان😁 (reply to 24443)

Gilbert Meshchain.Ai: Hi I have a new project to develop. I would  like to know if there is any Spanish speaking developer?

TON Answers Bot (not AI): Is that possible to get a public key of a wallet (WalletContractV4) knowing only it's address? from Kalugin Pavel    🔗 Answer on TON Overflow

Alireza: It seems a solution, if any other friend may need:  https://github.com/tonkeeper/tongo (reply to 24443)

Alireza: hi soltan 🙂 this may help you too.  https://github.com/tonkeeper/tongo (reply to 24444)

a: Is it possible to put a time limit on a contract that has been deployed beforehand? Like terminate itself or unable to use its functions? I could not find anything about it.

Daniil: Just add some condition in your contract, like throw_if(123, now() >= SOME_TIMESTAMP); (reply to 24451)

a: I did something like this and I am curious if it is stored in the contract this way and will not execute after 2 mins?

a: Also how can I get multiple inputs?

a: I am pretty confused about what's in this and how to index it

Daniil: Why did you add the 6th line? (reply to 24453)

a: to give the int variable a timestamp on the initial deployment and store it into the persistent storage I believe

a: Bad practice or completely wrong approach?

&rey: Wrong approach. (reply to 24458)

Daniil: As I see, you're doing that on each contract execution. It will reset to the current time on each call this way (reply to 24457)

a: I have just started learning x_x Any help would be appreciated

&rey: Yes + that assignment doesn't put value into persistent storage. (reply to 24460)

a: I thought that it would not happen if I don't write this (reply to 24460)

a: So the last part I have sent puts it into the persistent storage and updates at the same time?

&rey: 1. You need the value to be in initial contract storage; 2. You overwrite extracted value with now() result. (reply to 24463)

a: I'm sorry I couldn't understand what do you mean (reply to 24465)

&rey: Try to explain what your contract must do step by step (with smaller steps than "compare value stored with now()"), then rewrite that logic into code. (reply to 24461)

a: My contract should get 2 inputs. First one must be "1" or "2".  Second one must be how many seconds the contract should stay up. I need to calculate how many 1's or 2's that has been picked. (Which I have done already) I need to terminate this contract after the given seconds has passed.  Everything is fine on getting a 1 or 2 and adding them up. And using a get function to get what's the current status. I am unable to figure out how to get an extra input, in this case "how many seconds" input. And also storing the initial deployment time on the contract. (reply to 24467)

&rey: Is that second input sent by everyone? If not, you should make your description more precise and clear. (reply to 24468)

a: No it will be set when the contract is deployed for the first time and now that you have mentioned it, the time can be a constant and doesn't need to be given by everyone. But my question on how to get multiple inputs is still valid :)

a: A fix suggestion maybe :) (reply to 24460)

a: Do you mean under this by "the value to be in initial contract storage"? (reply to 24465)

&rey: I recommend you to get familiar with TON's cell concept, then look through contracts working with NFTs (https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3.fc) and check if you fully understand them. (reply to 24470)

Tomer: Hi friends, ran into some trouble doing the following — how can I sign messages between a non-js framework app with tonconnect/tonkeeper? To be specific a flutter app.  I had managed to create and test the contracts on node js with ton libraries. To which it works perfectly.  But I want to achieve this on flutter  I have done alot of research but seems none worked.  Suggestions and questions are welcomed.

Daniil: Ton connect is just a protocol for communications between the app and the wallet. You don't need to "sign" anything.  1) generate link (or QR code) for authorization 2) fetch the user wallet's data (address, balance etc) 3) when you need to send some transaction from user's wallet, use the ton connect API to do so  Everything above is well covered in documentation: https://ton.org/docs/develop/dapps/ton-connect/integration (reply to 24474)

a: Any document suggestion to "get familiar" with the cell concept? (reply to 24473)

Daniil: https://ton.org/docs/develop/data-formats/cell-boc#cell (reply to 24476)

a: I am basically lost, are there any documentations on this load and save part of the code. And is it possible to store the time when the contract got deployed for the first time (SOME_TIMESTAMP) and prevent it to get updated each time? I mean is there a part of the code-contract just runs for once? (reply to 24452)

Daniil: Just don't save it there each time and it won't "get updated" (reply to 24478)

a: And maybe a contract like a boiler plate or some less code. Instead of this one (reply to 24473)

Daniil: You can "store when contract got deployed" by simply placing the required data in contract's StateInit

a: Let me share the whole code that I have been trying to gather, it is not something spectacular anyways. Where is this contract's StateInit and suggestions for this code. (reply to 24481)

Daniil: Remove the 17th line (reply to 24483)

Daniil: And also add the storing of contract_time_of_deployment to the 33th line

a: Like this?

a: And where to define the contract_time_of_deployment so it gets the time of the deployment?

Daniil: Don't call the set_data() for the second time - it will just override the previous one. Instead, store both Total and Time of deployment in the same cell in a single set_data call (reply to 24486)

Daniil: Depends on how do you deploy the contract. There should be some way to change the contract's data (stateinit) (reply to 24487)

a: I am using toncli and just have this writing "toncli deploy -n testnet".   That goes here (reply to 24489)

a: And that goes there

a: Is it the data.fif that I should change

Daniil: Yep (reply to 24492)

a: Well first time seeing this part, looks interesting. Any suggestion on handling this part

a: Definitely saw this part and read about it but did not think of it

&rey: This is Fift. In short, you need <b   0 64 u,   ?time of deployment? 64 u, b> (reply to 24495)

Daniil: In your case, the structure would be like  <b     0 64 u,     12345678 64 u, b>  Just put the current timestamp instead of 12345678

a: Well 2 questions since you have just gave me the fish. Should I add the thing you have given me directly at to the bottom and how to get the current timestamp through fif? The first one "0 64 u" is about the counter variable that I have and it is a uint64? (reply to 24497)

Daniil: Replace the current <b ... b> from your data.fif with the new one from above (reply to 24498)

Daniil: And yes, 0 64 u will be your total which is 64-bit unsigned integer

a: Should I import something to be able to use this?

a: Oh wait...

a: Nope, I still need something that changes dynamically so a timestamp would be perfect

a: Is this a valid solution to that? Seems pretty wrong, but it deploys. What is the best way to do it? (reply to 24488)

Daniil: Yep, that's right (reply to 24505)

Daniil: No, just write "now" there (reply to 24502)

a: Yep, that did the trick. Thanks, for now 😈

&rey: Good luck in learning and buidling) (reply to 24508)

a: What should I write to get slices instead of uint64 in the fif file {0 64 u,}

a: ."<string>"

a: this did deploy but not sure if it works

a: I am getting this on the test side

a: Anything that I might be missing?

Daniil: And what did you put in data.fif (reply to 24515)

a: this currently

a: nothing else I found deployed

Daniil: Load msg addr is for loading the address (reply to 24519)

Daniil: Not just some arbitrary stings

a: You mean just for the sender address (reply to 24522)

a: How can I achieve this? (reply to 24523)

— 2023-03-12 —

Andrew: /report (reply to 24538)

Vlad: /report (reply to 24542)

Howard: anyone got time out for tonCenterAPI test-net now?

Mohsen: UPDATE: the problem was insufficient gas  hello everyone, I'm trying to send a burn message to a JettonWallet smart contract, but as you can see in tonscan, it keeps failing. https://tonscan.org/tx/JvExjmCFlu5EtqbOAZnlZ9W62h0MedWXAdHuGjaNjF0=  here is my TypeScript code:   async sendBurn(provider: ContractProvider, via: Sender, amount: number) {     const messageBody = beginCell()       .storeUint(OPS.Burn, 32) // op: burn jettons 0x595f07bc       .storeUint(0, 64) // query id       .storeCoins(amount)       .storeAddress(via.address)       .endCell();     await provider.internal(via, {       value: "0.003", // send 0.003 TON for gas       body: messageBody     });   }  I'm doing this with the TON wallet that made the JettonMaster and the JettonWallet. And I'm calling the get method right before this and it returns the correct value.  walletSender = EQDHOO8Bpi3sdh3DXrkOza7QBAYD3sU-H4Z90gQ_Yn_HJ9Jf // walletSender is obviously a v4r2 wallet type, I gave you the address here const CONTERACT_ADDRESS = "EQA1pw561pChrkfOneucsozHxfmqg4xujB0G3hK0n0kYIRiG" const contract = new JettonWallet(     Address.parse(CONTERACT_ADDRESS) // jetton wallet contract address ); let currentNum = await jettonWalletContract.getWalletJettons(); console.log(`wallet jetton count: ${currentNum}`); await counterContract.sendBurn(walletSender, 1000000000);

Mohsen: I think I had the same problem earlier, thought it was my network. (reply to 24547)

Howard: have you check what is the error code 707 means? (reply to 24549)

Mohsen: Turns out 0.003 was not enough for gas. I gave it 0.05 for gas and it worked https://tonscan.org/tx/vo19484znVx8rj3BCKw7VTnfDKYse8Nh7TXMWNG1M1M= (reply to 24551)

Андрей: Iirc nft collections are editable, nft themselves aren't. (At least on getgems) (reply to 24270)

Howard: was fine but can't sure why it's pop error today even I tried in mobile network (reply to 24550)

Ihor: hi, what this is mean?

Step: check whether or how TonConnect  is imported? (reply to 24556)

Ihor: ok, one second

Ihor: "@tonconnect/sdk": "^2.0.7", (reply to 24557)

liminal: 5 lesson is out now! https://youtu.be/GYyUqAaJads

Андрей: Can the government ban ton?

Brave: Can the government ban Cryptocurrency?)6 No! 👾 (reply to 24572)

Coalus: Depends on what do you mean by "ban" (reply to 24572)

Zyxep: no (reply to 24572)

User<6247944943>: Awesome (reply to 24571)

User<6247944943>: I am checking in 1. But will you cover in FunC? (reply to 24571)

liminal: FunC tests? (reply to 24579)

màtín: hi guys; I confused when I should use slice or build or cells

&rey: Cells are something immutable, they are used in persistent storage. Builders are used for creating a cell, and slices for reading from one. (reply to 24583)

User<6247944943>: Can we track and listen for specific method call IDs at a specific address? For example, during the Collection Minting process.  We need to know how many requests are being made and who is calling the minting functions. (reply to 23608)

màtín: do you have simple funC practice?

User<6247944943>: https://ton-community.github.io/tutorials/01-wallet/ (reply to 24586)

màtín: except it 😁 (reply to 24587)

talkol: If you want some Tact practice, I am working on a Tact learning tool and will appreciate feedback:  https://tact-by-example.org  Tact is a higher language for ton that compiles to func

Андрей: I meant the blockchain and its networking systems (reply to 24573)

&rey: Blockchain networking is based on ADNL. It can basically be blocked but then nodes would just migrate to ADNL over WebRTC. (reply to 24590)

Andrey: Blocking adnl protocol itself is imposible. Government can only point-to-point select victim addresses of nodes and ban them (reply to 24591)

&rey: It can be found that packet does not match known signatures (e.g. it does not decode as TLS handshake, etc) so protocol can be blocked. (reply to 24592)

Andrey: Non-known signature is not reason for blocking (reply to 24593)

Andrey: Actually adnl doesn't contains predictable signature at all. All payload is encrypted (even payload length)

A: I’ve got now similar but not same problem. After installing mytonctrl validator is out of sync, there is a network load, but database is not growing at all. Where can I view the logs, why database is not growing, and out of sync is increasing? My tonctrl status: (reply to 23994)

A: ===[ Local validator status ]=== Validator index: -1 Validator efficiency: n/a ADNL address of local validator: E20733BABA39D084D033543DC22930F3B6FD1AC078B87C528E382440413D1AF8 Local validator wallet address: Ef8GXZhg-ad6VfMVxe0XrXXMAwky8PnZLBcNn2cDrh2XdWoE Local validator wallet balance: 3.956409401 Load average[16]: 2.26, 1.7, 0.98 Network load average (Mbit/s): 33.4, 27.79, 27.79 Memory load: ram:[0.63 Gb, 1.2%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): nvme0n1:[205.25, 9.38%], nvme1n1:[205.23, 9.43%] Mytoncore status: working, 11 minutes Local validator status: working, 11 minutes Local validator out of sync: 1678635343 s Local validator database size: 0.0 Gb, 0.8% Version mytonctrl: e703657 (dev) Version validator: e37583e (master)

Андрей: So... There's already a way to mitigate this 🤩 (Just like tor 😃) (reply to 24591)

A: And there is a worning when getting status: [warning] 12.03.2023, 15:35:43.686 (UTC)  <MainThread>  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a number, not 'NoneType' (reply to 24596)

User<1179794801>: Hello, is there a c# layer for TON api for building wallet applications in xamarin?

Nick: Hey any TON developers for hire here?

Dave: Does anyone know how do I store TON on my hardware wallet? (Trezor)

Dave: Can I just import the eth contract of TON to wallet and bridge my TON chain coin to the ETH chain TON?

Dmitry | backend4you.ton: I created TonLib.Net library (in NuGet), it can read data and send transactions, but not have cells operations yet (reply to 24600)

talkol: Use Ledger for ton, not Trezor since Trezor don’t add new protocols (reply to 24603)

User<5906393387>: Hey! Is it better to get data from the contract itself or store and get the data from centralized database? (for example, if a dapp is a marketplace)

talkol: It all depends how much data you have. Ideally if you use blockchain you want to build a dapp - meaning a decentralized app. This means its storage should be decentralized. Contract storage is decentralized but very expensive. Ton Storage (like IPFS) is also pretty decentralized and much cheaper, but immutable.  If you have a lot of data that is changing quickly, then maybe a dapp is not what you need. If you make it centralized with a DB, I don't see much benefit from making it a contract then.. might as well write your backend as a node.js app. (reply to 24607)

Marlee: Are u sure that Ledger supports Ton ? I tried several times to look for Ton and didn’t find it there. (reply to 24606)

talkol: you need to change to dev mode to see the beta apps (reply to 24609)

Marlee: You this ? (reply to 24611)

talkol: think so

Marlee: If yes i still can’t see Ton

Marlee: U sure it shows u Ton ? (reply to 24614)

talkol: this is the repo on ledger's github https://github.com/LedgerHQ/app-ton-new

talkol: see instructions here: https://tonwhales.com/ledger

— 2023-03-13 —

순범: how to send multiple msgs to multiple addresses with only one confirm of wallet? or just two msgs to two address?

User<6247944943>: You can trigger multiple transactions with a single transaction sent to the smart contract. (reply to 24623)

순범: Yeah, I know. but via smart contract, the transaction recorded in wallet will be only one.  I want to know how to send two msg like when I make sale contract in getgems.io They make two transactions in one logical time and one wallet confirmation, and two transactions are recorded (reply to 24624)

Daniil: Smart contract can send up to 255 outgoing messages at once (reply to 24625)

User<6247944943>: sale contract in getgems.io? (reply to 24625)

순범: I mean, let contract A is something that send msgs to contract B and C.  If I send msg to A, the transactions I can see in tonscan.org with my wallet address will be only me -> A 0.2 TON  and with address of A A -> B 0.1 TON A -> C 0.1 TON  but I want to see in tonscan.org with my address like this me -> B 0.1 TON me -> C 0.1 TON (reply to 24626)

Daniil: Then send multiple messages from "me" (reply to 24628)

순범: yes, they make two transactions in one logical time via no contracts (reply to 24627)

순범: so how? (reply to 24629)

Daniil: Actually, "me" in your case is also a smart contract (wallet contract). Regular wallet contracts allow you to send up to 4 messages at once. If you need more - use highload wallet

Daniil: But what's the problem with that anyway? (reply to 24628)

Daniil: Why do you want to see something special on tonscan? Don't you just need the result?

순범: cause this way requires 2/3 gas fees (reply to 24633)

Daniil: What? (reply to 24635)

순범: what kind of package brings multiple msg send? or is there any example? that's my point (reply to 24632)

순범: cause me->A->B,C requires 3 transactions while me -> B,C requires 2 transactions. I want to simplify the process. (reply to 24636)

Daniil: Use the highload wallet

Daniil: But actually there's no problem with that. me->A->B,C,D,E... vs me->B,C,D,E... is just a 1 single message difference (reply to 24638)

순범: thank you! I'll try this (reply to 24639)

Daniil: If you want to send a message to 1000 addresses, it will be just 1000 vs 1001 messages. Not a big deal

순범: yeah but only two msgs I want to send. in that case, I'll send via contracts too (reply to 24642)

순범: anyway thank you for answer (reply to 24642)

Daniil: If you want to send just two msgs - there's no problem with that. Tonweb and ton.js libraries support it for regular wallets (reply to 24643)

Ihor: hello everybody, someone using @tonconnect/sdk for telegram bot? i have a bug, while connect library to telegram bot

Ihor: this is my problem

Daniil: Can you show the part of code where you import the library please (reply to 24647)

Ihor: of course)

Ihor: and for first step i import library using this code:  import TonConnect from '@tonconnect/sdk';  const connector = new TonConnect(); (reply to 24651)

Andrew: that might just be the Tonkeeper's transaction prediction feature. Tonkeeper displays transaction results even before confirming them in the wallet, that's why it can show multiple transactions on the confirmation screen (reply to 24630)

순범: I know Tonkeeper shows predicted feature, but apart from that, two transactions occurs from wallet. (reply to 24653)

TON Answers Bot (not AI): Regarding the API documentation, how can I create a new address?  from Telegram Chat Import  Hello, regarding the API documentation, how can I create a new address?   I didn't see any examples for address creation and sending transactions.   Could you please provide me with some guidance on this?  🔗 Answer on TON Overflow

Howard: Is there any way to increase the speed of transactions being included in the blockchain?  Similar to how EVM allows for paying higher Gwei to incentivize miners to prioritize transactions, is there a way to speed up the inclusion of transactions in the TON blockchain?  To my knowledge, the answer is no. Since every validator works in parallel, the way to check the transactions in TVM is based on Logical Time (LT), and there is no concept of Block Height. (reply to 2121)

Daniil: Gas price is same for everyone (check the config) and you can't "pay more" to force the validator to process your transaction faster. But if you have your own validator you can process your transactions before others (reply to 24656)

User<5906393387>: Thanks for the answer! I know that some DApps are actually CApps. Some of them are using indexers and so on. (reply to 24608)

Howard: thanks. Noted.  https://answers.ton.org/question/1546047049567309824/can-the-rate-of-confirmations-be-increased-in-ton-blockchain-are-exchanges-requesting-too-high-a-number-is-there-a-way-to-boost-transaction-speed#write-post (reply to 24657)

Ihor: someone, can reply on this question? (reply to 24646)

Step: how much ton required to run own validator? (reply to 24657)

&rey: > Since every validator works in parallel, the way to check the transactions in TVM is based on Logical Time (LT), and there is no concept of Block Height. No. Validators know who should produce the next block, and only if he does not respond for some time others start creating that block. There certainly is concept of block height. (reply to 24656)

Marlee: Cool thanks, I hope soon it supports ledger live. (reply to 24618)

Howard: I think we answered in the forum before. (reply to 24661)

Ihor: i'm sorry, but i dont understand this message (reply to 24665)

Eugene: I think Howard intended to reply to a different question (https://t.me/tondev_eng/24661) (reply to 24666)

Howard: https://answers.ton.org/question/1533559950482083840/how-high-are-the-fines-for-validators   https://answers.ton.org/question/1542352647279874048/what-is-the-minimum-stake-for-a-validator (reply to 24661)

Howard: oh yeh, sorry. (reply to 24667)

Step: 🤔 (reply to 24668)

TON Answers Bot (not AI): How to get data about nft from the user using api? from Gens  How to get data about nft from the user using api. And also get nft meta data with values. For example: If there is a defined nft, the user gets additional functionality in the service.  🔗 Answer on TON Overflow

TON&Co.: ⏺ FYI We are starting a FunC technical Q&A session on TON&Co. platform 🥳  https://join.toncompany.org/c/onboarding-events/func-sandbox-q-a-e13bdc (forwarded from TON&Co.)

Yiğit: Ton coin nasıl üye olunur

mr.one orange: sorry for stupid question. how can i create wallet with letters i want in safe way, example EQAy....1TON

Dmitry | backend4you.ton: https://github.com/AntonMeep/vaniton (reply to 24676)

mr.one orange: is this safe? im not dev at all (reply to 24677)

Dmitry | backend4you.ton: use it offline (reply to 24678)

Tim: Don't bother with it if you're not dev, it's not worth it

Tim: if you really need vanity address whales have gpu brute force (~1kk addresses/s), but you can't use it if you can't code

Dmitry | backend4you.ton: 3 letters can be found on average modern pc/notebook, without gpu, in about 1-2hr

Ö: Hey, how can I write a dict in BOC?  I tried dataInit.bits.writeUint(0,1); to write an empty array but I get error throw Error('Unsupported stack item type: ' + s[0]); When I try to read  Error: Unsupported stack item type: list

— 2023-03-14 —

User<1418229103>: Hello, how to pass stateInit param to ton-connector when deploy  nft collection contract? I constructed a raw tx and it is successed: https://github.com/platwin/ton-nft-test/blob/main/scripts/deploy-from-gen-code.ts. However, when I use ton-connect to create tx, it is failed: https://github.com/platwin/soton-web-app/blob/mint/src/components/Transactoin/index.tsx. The success tx is https://testnet.tonapi.io/transaction/75c1fde9e8d9c0fbc1f778be1eee855b758bb800fb73263297d80c8e52a74268, the failed tx is https://testnet.tonapi.io/transaction/903b63fdb031ffce9b74e49715346e3d914e35f71dcc50871f81bfc9e7b388b8

Rahul: 👋🏽

User<1418229103>: hello, can anyone help me? (reply to 24685)

User<1418229103>: https://test-explorer.toncoin.org/transaction?account=0:ddbe9b8b139b02c6656f8fbd87555653b848a7ec8222e98b90d544614dbd11cc&lt=9638387000003&hash=8925ac5660ffd882ec08418db97f6dd376c1ed1d95d68beb0cf5465cd24f3335 it seems that this tx use stateInit as tx body. (reply to 24685)

Master: Hi, everyone. Please tell me how to use https://ton.org/bridge/?testnet=true I'd like to send Toncoin from TON Testnet to Ethereum Goerli Testnet

Dev: Is there a Defi Channel for TON?  I think this would be a good idea.

Howard: Usually the Tx with initial calling for deploy will be like this: https://app.tonkeeper.com/transfer/`CONTRACT_ADDRESS?`text=Deploy%20contract&amount=COST_FOR _DEPLOY&init=YOUR_INITIAL_CODE (reply to 24688)

User<1418229103>: Tried with https://test.tonhub.com/transfer/EQBWyCThT365Pq7PiX6t9ooTSH-onl7IBLI4rBFTrmbDGJta?text=Deploy%20contract&amount=100000000&init=te6cckEBCgEAmAACAAYBBEOAEtY0p9TEQvmBwZK24i02w+sSvXG5V9697BPgD3S+ln5QBQQDAgAYdGVzdC10d2l0dGVyAA50ZXN0LXRnACh0ZXN0LWNvbGxlY3Rpb24tbmFtZQAodGVzdC1jb2xsZWN0aW9uLWlkLTEBFP8A9KQT9LzyyAsHAgFiCQgAGaB5LdqJofSBqampqGEADNBsIccA3He2k0c= , but tonhub sandbox cannot sign... (reply to 24691)

Howard: you can change prefix to connect TonKeeper to try out (reply to 24692)

User<1418229103>: what is the testnet url prefix of tonkeeper

Assi: Hi everyone. I have a problem with Rift Framework  The error  No module named ‘rift.meta’  Can someone help me?

Master: Hi, everyone. Please help me. I can't find the way to use https://ton.org/bridge/?testnet=true I'd like to send Toncoin from TON Testnet to Ethereum Goerli Testnet

&rey: Probably nothing, you just have to switch network in application. (reply to 24694)

màtín: hi guys  I installed toncli on windows11  when i run toncli in ton-win-binaries directory i get this Traceback (most recent call last):    File "<frozen runpy>", line 198, in _run_module_as_main    File "<frozen runpy>", line 88, in _run_code  ImportError: cannot import name 'BitString' from 'bitstring' (C:\Users\Matin\AppData\Local\Programs\Python\Python311\Lib\site-packages\bitstring.py) do you have idea?

User<1418229103>: how to switch network in app? (reply to 24697)

&rey: https://t.me/tondev_eng/7789 (reply to 24699)

&rey: https://t.me/tondev_eng/21510 (reply to 24698)

User<1418229103>: thanks (reply to 24700)

User<1418229103>: tried with Tonkeeper, and it cannot sign. (reply to 24692)

&rey: Maybe, try removing text out of the link (either move it to binary payload or remove completely)? (reply to 24692)

User<1418229103>: cannot sign after remove text param. (reply to 24704)

User<1418229103>: Where is tonhub or tonkeeper source code? How does them handle stateInit param? And how does them construct tx that deployed contracts?

Andrew: github.com/Tonkeeper/wallet & github.com/tonwhales/wallet (reply to 24708)

User<1179794801>: That's awesome anyway! (reply to 24605)

User<1179794801>: Is it open source?

Dmitry | backend4you.ton: sure (reply to 24711)

User<1418229103>: why does tonhub wrap internal msg to external msg?

Step: because all transactions are sent as external message (reply to 24713)

User<1418229103>: Is there any difference between my code and tonhub's code?Why can my code deploy the contract while Tonhub can't? (reply to 24713)

Step: sendTransfer takes care of wrapping txn in external message (reply to 24715)

Dev: Can you include what your import statements are? (reply to 24647)

User<1418229103>: does telegram web app save uploaded image file permanently?

Dev: I would check what version of tonconnect is installed as this line is in the documentation: const connector = new TonConnect({ manifestUrl: 'https://myApp.com/assets/tonconnect-manifest.json' });  // this statement is only needed if you don't have manifest in the root directory of the application.  So please check installed version of tonconnect. As always with all questions include as much information as possible. Versions, and import statements etc. (reply to 24648)

a: Is this a correct way of using dicts on func side? I am trying to put some data into it but I get the error  "throw Error('Unsupported stack item type: ' + s[0]);"

User<6247944943>: Is there a TON anonymous number NFT that can be obtained in the testnet?

Andrew: @TelemintTestnetBot (reply to 24725)

User<6247944943>: this is awesome. Thank you. (reply to 24726)

Lei: TypeError: (0, paddedBits_1.bitsToPaddedBuffer)(bits).copy is not a function. (In '(0, paddedBits_1.bitsToPaddedBuffer)(bits).copy(repr, reprCursor)', '(0, paddedBits_1.bitsToPaddedBuffer)(bits).copy' is undefined) (forwarded from Lei)

Lei: This error is reported when I use the TonClient of the ton framework in an application (forwarded from Lei)

Lei: endpoint is:  https://ton.access.orbs.network/3847c20C2854E83765d585B86498eFcC7Fec6a46/1/testnet/toncenter-api-v2/jsonRPC (forwarded from Lei)

Lei: this error occurs here (forwarded from Lei)

Lei: Can someone please look at this problem？thx

a: what about this? #&rey 2ne:v @&rey 2ne:v (reply to 24724)

&rey: I think error is in some other place. (reply to 24724)

a: If it's not in the contract where could it be?

a: What do you need to see to decide that :)

&rey: This is problem of reading function result, possibly in TonWeb.

&rey: Probably you need to call toncenter yourself to get the call result. Don't sure if there are easier options.

Mohsen: hello everyone, is there any way to get balance of my smart contract in jest (.spec.ts files) without defining a getter on the smart contract itself?

Vladimir: let balanceOfContract = (await blockchain.getContract(contract.address)).balance (reply to 24742)

Vladimir: Anybody knows how to convert Cell to string and back?

Mohsen: it worked, thanks. 🙏🏻 (reply to 24743)

Mohsen: where? in func or ts? (reply to 24744)

Vladimir: ts

Mohsen: <builder>.asSlice.toString() ? (reply to 24747)

Tim: You need toBoc first (reply to 24748)

Vladimir: const _code = await compile('history-keeper') const codestring: string = _code.asSlice().toString() code = Cell.fromBase64(codestring)

Vladimir: I tried this, but it doesn't work

Vladimir: What you mean? (reply to 24749)

Tim: cell.toBoc

Vladimir: Like this: const _code = await compile('history-keeper')         const codestring: string = btoa(_code.toBoc().toString())         code = Cell.fromBase64(codestring)

Tim: toBoc().toString('base64')

Vladimir: Nice! Thank you man👍

Howard: Just want to clarify this: There is no ERC1155 concept in TON, correct? We can't set the NFT with the quality concept here.   But it's different with Jetton right? Because there is no Royalties Fee setting in Jetton. (reply to 18384)

TON&Co.: ⏺ In 30 mins we are going live with Developer Onboarding Manager at TON Foundation (Roman Krutovoy)  Join to give feedback on TON's onboarding process or ask related questions 😍  Link to join the session

TON Answers Bot (not AI): Is there the ERC1155 standard? The NFT with quantity. from Howard  I'm curious if there is an ERC1155 standard for non-fungible tokens (NFTs) with a quantity.   In the past, I've checked and implemented NFTs using the ERC721 standard, which is designed for single, unique tokens. However, I've heard that the ERC1155 standard can be used for tokens with a quantity.  Implementing ERC1155 tokens would require a different approach than ERC721 tokens, since they allow for multiple instances of the same token.   With ERC1155, each token type has a unique ID, and a quantity is associated with each ID. This means that instead of creating individual tokens, you create a supply of a specific token type that can be bought, sold, or traded.  I'm interested in exploring the possibilities of implementing ERC1155 tokens for NFTs with a quantity, and would like to research and learn more about the standard and how it can be used.  https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md    🔗 Answer on TON Overflow

Alexey: Hello, please tell me where to start developing the interface for exchanging your tokens in the wallet? is there any tutorial or documentation?

Alexey: on React

ekt: Hi, maybe bit of a stupid question, but is there a way to attach some sort of config / json / big parameter to nft when minting it on ton?

a: Is there a way to check if someone used the contract before and prevent it being used again by the same address?

&rey: Please remember that someone could transfer their funds to second wallet and use your contract from that. (reply to 24770)

a: Great heads up! This contract will be used in a isolated place lets say :) (reply to 24771)

a: How to do it? Any examples on it? I figure that I need to store the sender_address and how to check if exists?

&rey: If there is limited and quite small number of users, you can store addresses as dictionary keys, probably with empty values. (reply to 24772)

Daniil: simple way - store a dictionary < Address -> boolean > which indicates whether someone has used the contract or no

a: Also is this the way to do it? Any mistakes on the syntax? I know it already comes with the "slice sender_address = cs~load_msg_addr();" But got confused on the storage on contract part.

a: There is no limit for the users that can be in this isolated place (reply to 24778)

a: So there could be 10 100 1000's of people

Daniil: hard and scalable way - deploy a special (but not very complex) contract for each user which will respond to the very first call with True and to all next calls with False. Then to process an action from main contract, first send a query message to that special user's contract and if it'll respond with True, process the action. (reply to 24779)

Daniil: but if your amount of potential users is less than 1-10 thousands, you probably don't need this approach

Daniil: dictionaries in func:  - https://ton.org/docs/develop/func/stdlib/#dictionaries-primitives (reply to 24780)

a: I will get lost trying to do that. Maybe for the future. (reply to 24783)

a: Anything with a func file with all the loads and saves and the get methods maybe? (reply to 24785)

Daniil: you can check out some standard contracts (like wallet-v3) (reply to 24787)

a: I get the idea but I am having a hard time how to implement it (reply to 24779)

a: will do! (reply to 24788)

a: After seeing those codes I wanted to give a shot to the documents :) (reply to 24788)

a: How does this looks

&rey: You should just dict_get? (this function is omitted in stdlib somewhy, you could create it yourself) and check success flag. (reply to 24792)

&rey: Also, you should load dict from contract's storage, not create it from scratch with new_dict() each time contract is called.

&rey: + sender_address is slice, so you should use d~dict_set(267, sender_address, ""); This can raise issues in future, when non-267-bit addresses will be used, though I think this is not that important right now.

a: I could not see a function named dict_get? in the stdlib (reply to 24793)

&rey: You can define it just like udict_get?. As far as I remember, that's (slice, int) dict_get?(cell dict, int key_len, slice key) asm "DICTGET NULLSWAPIFNOT"; (reply to 24796)

a: What does this do? Checks if the address exist in the dictionary? Can I use it in a simple if comparison? Like   if udict_get? == sender_address{       return();     }

a: I have defined this at up top and updated the code to this. How is it now? (reply to 24797)

&rey: (_, int flag) = checker.dict_get?(267, sender_address); if flag {   return (); } (reply to 24800)

a: Oh you have already said that I should check the flag, my bad. Thanks! (reply to 24803)

a: This is the final code if someone is interested now or in the future <3

Stack Merth: Hello I'm in need of a ton Blockchain developer Need help with developing NFT marketplace and NFT upload bot on TON Blockchain

a: contracts/test.fc:60:4: error: undefined function key, defining a global function of unknown type     (key, val, flag) = d~dict_set(267, sender_address, "");      ^ contracts/test.fc:60:9: error: undefined function val, defining a global function of unknown type     (key, val, flag) = d~dict_set(267, sender_address, "");           ^ contracts/test.fc:60:22: error: undefined function d, defining a global function of unknown type     (key, val, flag) = d~dict_set(267, sender_address, "");                        ^ contracts/test.fc:60:57: error: cannot assign an expression of type () to a variable or pattern of type (??82, ??83, int): cannot unify type (??82, ??83, int) with ()     (key, val, flag) = d~dict_set(267, sender_address, ""); (reply to 24803)

a: It looks like I am missing something so simple that I have no idea of

ekt: const mineParams : MineMessageParams = {   expire: unixNow() + 300, // 5 min is enough to make a transaction   mintTo: wallet, // your wallet   data1: new BN(0), // temp variable to increment in the miner   seed };  (property) seed: BN No value exists in scope for the shorthand property 'seed'. Either declare one or provide an initializer.  could someone help and explain what would be a good way to initialize it, please?

— 2023-03-15 —

User<5906393387>: Just curious 🧐 I checked Fragment’s transactions and found this interesting one. How contract can be deployed by itself?  https://tonapi.io/transaction/064101885d674298d81079ce5a904d38b8ac152ec8f9ba341d5930904c09b803

ekt: dataCell.bits.writeAddress(data.ownerAddress)   dataCell.bits.writeUint(data.nextItemIndex, 64)    let commonContent = new Cell()     commonContent.bits.writeBuffer(Buffer.from(data.commonContent))  all of these 3 write functions are incompatible with BitString, is there any way around it?

User<6247944943>: Does https://neocrypto.net/ have an SDK that we can integrate? Or can any payment onramp collaborate?

User<6247944943>: BitString? What do you want to get (reply to 24812)

User<6247944943>: https://dton.io/tx/064101885D674298D81079CE5A904D38B8AC152EC8F9BA341D5930904C09B803?time=2022-10-26T18:43:06   Maybe internel deployed? (reply to 24811)

User<6247944943>: maybe @rulon can answer this (reply to 24811)

Daniil: Tonscan shows more reliable info in this case: https://tonscan.org/tx/BkEBiF1nQpjYEHnOWpBNOLisFS7I-bo0HVkwkEwJuAM=  It was deployed via external message. (reply to 24811)

Step: do you know where to get key for ton.cat api to increase request limit 1r/s? (reply to 24817)

&rey: You can just use checker~dict_set(267, sender_address, ""); as the last line. (reply to 24808)

User<5906393387>: Thanks! Also, I checked the previous transaction and I’m trying to understand what operation codes are? (reply to 24817)

Daniil: They determine which action do you want to perform with a smart contract. It all depends on a contract itself (reply to 24820)

aleksej: https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages (reply to 24820)

Howard: Why will get this error code?  Error: Exit code: -256

Howard: sad (reply to 24824)

Vladimir: Why after sendDeploy I've getting all amount of toncoin back, and no there any execution of the code's lines?

Howard: Or because @Ton-core had the issued? Should I change the package version tho

Howard: seems some issued with package of @ton-core, fixed after yarn add ton @13.3 (reply to 24828)

ekt: I was just trying to compile some of the nft contracts but it seems like some parts were deprecated including methods (reply to 24814)

Андрей: How can i store data in an encrypted form in a contract?

doni: you can but for what purpose ? (reply to 24836)

doni: if you going to use ton blockchain for storage

doni: you probably better of

doni: with using differernt storage solution

Berke: I was playing with https://github.com/ton-blockchain/token-contract  I have my own nft contracts and trying to compile them. But can't use the compiler, Reference is https://github.com/ton-blockchain/ton/releases/tag/func-0.3.0 and ton-compiler package seem not to work when i try to ./compile in any of the contract folders, any idea about how to navigate?

Berke: I wasn't able to compile the original contracts thats why Im asking

Андрей: Paid access to file on ton storage (reply to 24837)

Leo: Hello,  I recently heard about Tact language and this is compared to funC in Ton smart contract development. I am new at Ton ecosystem and am keen to move to this field. So as a beginner, i want to know what is the preferred language for smart contract development in Ton network. Thank you.

Андрей: Right now, FunC (reply to 24844)

Андрей: How can it be implemented? (reply to 24843)

ekt: I had similar issue (reply to 24842)

Berke: Well, I couldnt find a solution, my friend recommended to use what I already got and now Im using the scripts from the tutorials. (reply to 24847)

Berke: & packages

ekt: are they working for you? i get a ton of small and big errors  do you mind if I pm you about some stuff? (reply to 24848)

Berke: Go ahead

User<5906393387>: What do I do wrong?   TVM return exit code 9 (cell underflow) 😭  error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction EE43F7156FCA30D66B04FF04C45EF63F8BD68699ADBB39FCF5B636A306F6B6ED:\n' +         'exitcode=9, steps=19, gas_used=0\n' +         'VM Log (truncated):\n' +         '...te LDU 32\n' +         'execute LDU 256\n' +         'execute LDREF\n' +         'execute LDREF\n' +         'execute LDREF\n' +         'execute SWAP\n' +         'execute CTOS\n' +         'execute LDU 8\n' +         'execute SWAP\n' +         'execute LSHIFT 3\n' +         'execute LDSLICEX\n' +         'handling exception code 9: cell underflow\n' +         'default exception handler, terminating vm with exit code 9\n',       code: 500

talkol: In a second look, it doesn’t look like an external message (reply to 24852)

talkol: External messages have signatures and stuff, why are you sending external directly and not an internal through the wallet?

Spite: Try to put in the body internal message (reply to 24852)

Mohsen: Hello everyone, I'm trying to add a button to my react app to deploy the contract, the contract address is what it should be and deploy transaction goes through, but the contract is still inactive. https://testnet.tonscan.org/address/EQAIZrdg30d5TV22MKAT6fzZFrmm9jwb3Xv9S8xAdVeyeLUT#transactions  here is the code:

Andrey: Maybe it’s just deploy code… If address have TONs it’ll work (reply to 24855)

Mohsen: import { useState } from "react"; import OpinionVerifier from "../contracts/opinionVerifier"; import { useTonClient } from "./useTonClient"; import { useAsyncInitialize } from "./useAsyncInitialize"; import { useTonConnect } from "./useTonConnect"; import { Address, OpenedContract } from "ton-core"; import { useQuery } from "@tanstack/react-query"; import { CHAIN } from "@tonconnect/protocol"; import { Cell } from "ton" // import { useTonAddress } from '@tonconnect/ui-react';  export function useOpinionVerifierContract() {   const { client } = useTonClient();   const { wallet, sender, network } = useTonConnect();    const OpinionVerifierContract = useAsyncInitialize(async () => {     if (!client) return;     if (!wallet) return;     console.log(wallet);     const opinionVerifierCodeBase64 = "te6cckEBBQEAtAABFP8A9KQT9LzyyAsBAgFiAgMBntAyIccAkVvg0NMDMfpAMO1E0NP/+kAwUSLHBfLhkQLTH9M/MYIQFvJBu1Iguo4Q+QJQA7IhAcjL/wHPFsntVJIwMuKCEKbkPlkSupEw4w0EABWhS8PaiaGn//SAYQCC+CdvIjCCCvrwgKEgwv/y4FCNBZGdW5kIGJhY2sgZnJvbSBjb3VudGVygcIAYyMsFUATPFlj6AhLLagHPFsly+wCbo58r";     const opinionVerifierCode = Cell.fromBase64(opinionVerifierCodeBase64)     const contract = OpinionVerifier.createForDeploy(opinionVerifierCode, Address.parse(wallet || ""));      if (await client.isContractDeployed(contract.address)) {       console.log("OpinionVerifier already deployed");     }     return client.open(contract) as OpenedContract<OpinionVerifier>;   }, [client, wallet]);     const { isDeployed } = useQuery(     ["OpinionVerifier"],     async () => {       if (!OpinionVerifierContract) return null;       if (!client) return null;       return (await client.isContractDeployed(OpinionVerifierContract.address));     },     { refetchInterval: 3000 }   );    const { data, isFetching } = useQuery(     ["OpinionVerifier"],     async () => {       if (!OpinionVerifierContract) return null;       return (await OpinionVerifierContract!.getInfo()).hash.toString();     },     { refetchInterval: 3000 }   );    return {     value: isFetching ? null : data,     deployed: isDeployed ? null : isDeployed,     address: OpinionVerifierContract?.address.toString(),     sendPredictionString: () => {       if (!sender) {return}       return OpinionVerifierContract?.sendPredictionString(sender, "teststring");     },     sendDeploy: () => {       if (!sender) {return}       return OpinionVerifierContract?.sendDeploy(sender);     }   }; }

talkol: I hate deploying with external

User<5906393387>: Yes, it’s a deployment code (reply to 24858)

Andrey: Problem is that code you provide run messege body you provide. And message body is empty (reply to 24852)

talkol: In general I recommend to always do internal only unless you’re implementing a wallet contarct

User<5906393387>: Maybe. I’ll try it out (reply to 24862)

jssjjf: is anyone know how to implement normal distribution or like on FunC?

0xSorcerer: Could you show me a link to TON solidity compiler?

0xSorcerer: Any online resources like remix for ton as well, guys?

Berke: I know TON is waiting for storage to get open for onchain nfts but is there any standart for onchain nfts RIGHT NOW_

Berke: https://blog.ton.cat/how-to-nft/ references on chain

Berke: Anyone know whats the standart for explorers?

Yakitori: https://github.com/tonlabs/TON-Solidity-Compiler literally the first link on google (reply to 24867)

Dario: This is not for ton (reply to 24875)

Samyar: i get this error when i want to use sendTransfere:  `     },     data: {       ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by account 28C33C2EAB67FA99B41AC2177D1993E4C8D7C717F09F51D2A15B3F2B62665B32 before smart-contract execution',       code: 500     } `  the only thing seems wrong maybe is the way i turned my secret key to Buffer:   const secretKey = Buffer.from(process.env.PRIVATE_KEY, 'hex')  my secret key is a string  and this is my seqno : const seqno = await wallet.getSeqno()

Maksim: looks like your wallet has no balance (reply to 24877)

Maksim: and even isn’t deployed https://tonscan.org/address/EQAowzwuq2f6mbQawhd9GZPkyNfHF_CfUdKhWz8rYmZbMg5x

Samyar: no it's on testnet

Maksim: and still it’s not deployed   https://testnet.tonscan.org/address/EQAowzwuq2f6mbQawhd9GZPkyNfHF_CfUdKhWz8rYmZbMg5x

Samyar: oh i thoght if you just transfer some ton to it, it will get deployed (reply to 24881)

Maksim: also i don’t really know much about fees in testnet but i think 0.001 ton isn’t enough to deploy or make transaction, so i think you should top up your wallet (reply to 24882)

Samyar: thank  you 😄 (reply to 24883)

Yakitori: You can adapt it 😊 (reply to 24876)

0xSorcerer: So which is? (reply to 24876)

User<5906393387>: Hello, guys 👋 How can I get subwallet_id?

— 2023-03-16 —

a: Cheers this fixed the issue! (reply to 24819)

a: But this part results in a Exit code 9 which is underflow when testing (reply to 24803)

a: What's wrong with it?

a: I have tried slices and bits and the result is the same the exit code 9

a: What am I missing

VU ĐẠO: ChatGPT (reply to 24859)

&rey: Read 4 bits of flags from in_msg_cell. (reply to 24900)

Vlad: Have similar problem even reading the 4 first bits (reply to 24902)

Daniil: and also, read the dicts and other stuff from in_msg_body, not in_msg_cell.

&rey: Also, checker should probably come from contract data, not from cs. (reply to 24903)

D: unrelated qn - is there a TON explorer i can use to check on TON metrics like active addresses, txs etc

Vlad: Here is my sender's address getting function: (slice) parse_sender_address(cell in_msg_full) inline { var cs = in_msg_full.begin_parse();   ;; cell storage; cell into slice var flags = cs~load_uint(4);  ;; subtract(take away) flags  slice sender_address = cs~load_msg_addr(); ;; get sender address return sender_address; } (reply to 24903)

Vlad: Sample message: var msg = begin_cell()         .store_uint(0x18, 6)         .store_slice(addr) ;; sender's address; (ex: "kQDmznN8tOKzSQxHTzMTege2QKFcrCwnkTNRtY2cubGB1IKu"a)         .store_coins(1)  ;; amount of nanoton         .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; execution of serialization primitives ends         ;;(includes 14 parameters)         .store_slice(message_body)         .end_cell(); (reply to 24907)

Vlad: When I call the function, I get 2 bits slice (reply to 24908)

Vlad: CS{Cell{00da6200736739be5a7159a48623a79989bd03db2050ae561613c899a8dac6ce5cd8c0ea0808000000000000000000000000000000000200000000000030396b51446d7a6e4e38744f4b7a53517848547a4d5465676532514b46637243776e6b544e52745932637562474231494b75} bits: 4..6; refs: 0..0} (reply to 24909)

User<6247944943>: Got this error code 5, when I tried to remove my NFT from testnet.getgems.io.   Any ideas?

Daniil: https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes#standard-exit-codes (reply to 24912)

User<6247944943>: seems test-net is not operating right now?

User<6247944943>: All the explorers are paused.

Andrey: Tomorrow, March 16, we are planning stress-tests in testnet from 07:00:00 GMT+0 to 14:00:00 GMT+0. Please schedule your work accordingly.  https://t.me/testnetstatus/18 (reply to 24915)

Andrey: testnet.dton.io is working, but because it is ~25k transactions per minute it index it not so fast as nodes.

Андрей: Yes, marketplaces rn just don't use it. You have to deploy NFTs by yourself. (reply to 24871)

Михаил: /report (reply to 24919)

Михаил: 😔no reports

Andrew: @f_closer could you or other admins enable combot here please?

Alex: Suppose, you need to explain how to deploy a smart contract on TON to the newcomer. Which algorithm you will provide, or maybe link, that from your sight will explain this at the moment?

Andrew: https://github.com/ton-community/blueprint#deploy-one-of-the-contracts I guess (reply to 24924)

User<1460963135>: There are ready deployers from many teams. To prepare link and to deploy from CLI. You should check project templates and tools provided by developers of what are you using...

User<1460963135>: Here is great examples how to automate deploy. Some teams provide interactive wizards and deeplink to deploy from your wallet. (reply to 24925)

User<1460963135>: you should also checkout tact-lang and their tools. For novice it more simple, maybe: https://github.com/tact-lang/tact-deployer (not affiliated with them just using myself BUT with deployer from blueprint)

Alex: Yes, but what particularly do you advise? DYOR,  it’s an obvious answer to this theme.  I need to check different links and cases of explanation.  As I see, your final answer is tact-deployer. Thanks. (reply to 24926)

User<1460963135>: I said I'm using TACT despite of breaking changes; but not their deployer, I need automation but for simple use it will be simpler to deploy from own wallet to stay owner — my final answer is to check out all variants 'cause there is many useful code peaces in every  and one more FREE TIP: if you really want to develop smc you should remember it's can't by done by deploying changes tocheck errors; you will need to run code locally and fast. so check out emulators provided for this purpose  I know it may be hard and great temptation skip ALL THESE TESTS but this is the threshold) (reply to 24929)

Alex: Does anybody else know the source that you could advice with words “read this at first, then you will fully understand how the deployment process works”? Except called above.

User<1460963135>: deployment is just transaction. wtf?  sending coins to new address to pay fees and attached code/initial state

4xMafole: Hi, everyone. I havr been utilizing the tonconnect react ui repo to connect to tonkeeper wallet. But I keep on facing the above error. Any help, or anything I am missing?

User<1460963135>: this error not affiliated with tonconnect  our telepaths are on vacation

Dario: Hey frens - what's the best practice to do gasless on TON?

User<1460963135>: implement SMC that cover minting logic and allowing everybody to mint on their own's

User<6247944943>: thanks for clarification. (reply to 24916)

User<6247944943>: Tact? (reply to 24924)

4xMafole: Ooh! So this is directly on tonkeeper side (reply to 24935)

User<1460963135>: no this is you java backend (reply to 24940)

User<1460963135>: or mobile app  free tip: never think OH THIS IS THEIR ERROR i CANT MOVE FORWARD — this is a trap everytime start from "okay where could I failed"

4xMafole: Thank you, so much. (reply to 24942)

User<1460963135>: wait I may be wrong here

User<1460963135>: this is in tonkeeper itself?

4xMafole: Yes. (reply to 24945)

User<1460963135>: it's react-native and I saw something like this but can't remember right now

4xMafole: absolutely, correct. (reply to 24947)

4xMafole: We used this: https://www.npmjs.com/package/@tonconnect/ui-react package.

User<1460963135>: I remember that was ~year ago I was working with same task and got strage errors even mailed support but there are dump girls for clients not devs

4xMafole: Oops! (reply to 24950)

User<1460963135>: maybe error with some metadata or network error between you and their dc.

4xMafole: How, did you figure that out, then.

User<1460963135>: I can't remember completely but reading emails I can figure out that Keeper on my device was unable to connect to Connect API and this was temporary error.

User<1460963135>: from my app I did login request and after confirmation in wallet and returning to app this happened 'cause lib on back received nothing instead of JSON from their srv and....  on which step you fails?

4xMafole: Let me send it. (reply to 24955)

4xMafole: Here is the bug occurrence.

User<1460963135>: are you sure keeper cat get all needed info from your side?

User<1460963135>: manifest etc

4xMafole: Let me check on that.

Tse: Is it possible to retrieve the public key of other address in a contract?

User<1460963135>: no

a: Reading 4 bits did not helped. I thought that using cs meant getting the data from the (c)ontract (s)torage or something when you have suggested xd. Also I am not loading or saving it like the other variables that I have. I am just using this function. How to store the addresses on the checker dictionary properly? (reply to 24905)

a: code looks like this now and I just have the dictionary right here nowhere else like load data or save data

a: I still get the error "Exit code 9 underflow"

&rey: cs is not magic variable, it just holds what you save there (in your code, slice of in_msg_cell). (reply to 24963)

Berke: Do you guys know how blockchain explorers get address's NFT's as it can't be found from contract without checking every address interaction

Tse: or can a contract send a message to a  wallet contract requesting the wallet contract to verify a signature? (reply to 24962)

Dario: No, there is no such operation rn (reply to 24968)

Dario: But you can verify fully onchain that a pubkey belong to an address onchain, if you know wallet version and subwallet id

Tim: They index every tx (reply to 24967)

Berke: Damn isn't it costy

Daniil: It is (reply to 24972)

Daniil: And it will only get more expensive as the network growths

User<1460963135>: for ppl not familiar with highload and distributed systems maybe

Berke: I know thats how they make money anyways but isn't it really heavy cost to index everything into each other to generate relations, damn

User<1460963135>: this question for core engineers or application developers? as app dev you never need whole BC, think about this. Idea is not so crazy it's scaling on contracts itself. And this happens anyway inside the system, you would like it to be hidden behind pretty interfaces but maybe it's was right desicion to take off this to application

Андрей: Is it possible to store confidential data in a smart contract?

User<1460963135>: yes, cipher data outside and store

Andrew: cs is an example of bad naming, but it's a shorthand from "cell slice" (reply to 24963)

Maksim: i think they get amount of collection’s nfts and for each index from 0 to next_item_index run get_nft_address_by_index method (reply to 24971)

User<1460963135>: look I need to do something very simplar for myself, you can ask later. right now nothing can help remotely. I'm 100% sure this is not bug of keeper or connect but can't help in such way( (reply to 24981)

a: How to load and store the dict in the contract? The examples I am able to find does this but does not work for me? Is there an additional step to this? Maybe converting cell to slice or something beforehand?

Daniil: that looks correct (reply to 24984)

a: gives out error cannot unify type cell with slice

Daniil: are you sure that dict is in your contract's storage when you load it?

Daniil: oh, because the dict is cell (reply to 24987)

Daniil: do it (cell) load_data() {...}

Андрей: Is it possible to use the wallet's private key?

Berke: Do you mean not the ur own address? (reply to 24991)

a: Well I tried that before and did not realize the error was caused by somewhere else. I fixed the others including this, thanks! But now I have a problem about the function that needs to check if an address used the contract before. It is about the inputs and outputs again but I couldn't figure out what's wrong. Here is the function and how I *try* to use it. (checker is the dictionary that I load above) (reply to 24989)

User<1460963135>: try to read more docs more tuts and then examples you are far from even in theory and need some time to try to understand completely (reply to 24991)

a: this gives the error (reply to 24994)

Anton: Hello! Solidity developers please pm

User<1460963135>: I'm saying this without irony: you need more time to understand basic things to be released from such questions (reply to 24991)

User<1460963135>: If this is critical better pm me in your native language but getting single fact wouldnt help. You need some time + hard work not asking in chat how to implement something U think U need but no. You fails at design of. And do not need nothing you asking about.

Tse: If I would like to verify a signature from a customized wallet. Can I ask the signature sender to also provide all the parameters they used to create stateinit of their wallet, and use these parameters to re-create the stateinit and calculate the address in a contract? (reply to 24970)

User<1460963135>: U can directly get stateinit

Obazii: Help me list my usernames on getgems

Tse: will I be able to retrieve public key from their stateinit? (reply to 25001)

a: I did figure this out, it was about the defined variable names on load_data. Was not loading the dict properly. (reply to 24996)

Jeff: Hello, I send a message from a cell like this   &bin=${encodeURIComponent(body.toBoc().toString('base64')  But the msg_data in the transaction result is slightly different. The middle part is totally same, but the start and end are different.   I want to compare it to know if the transaction was sent successfully. But the difference makes it difficult. How do I do?

Tse: I'm not sure if the stateinit is hashed or something, or I could directly read the parameters within it (reply to 25003)

User<1460963135>: if they put it in there (reply to 25003)

User<1460963135>: you don't need this as I said never ever

4xMafole: Solved. Problem was urls on the manifest. (reply to 24957)

User<1460963135>: I think TonKeeper dudes should really attempt to this and fix such non-informative error reporting 'cause it fails onboarding for novices. AFAIK they are in this group. Let's leave this maybe they see :D.

Tse: Then where do they put the public key generally (reply to 25007)

User<1460963135>: it's sending with tx but not sure about TON completely. It depends on wallet SMC I guess.

User<1460963135>: You do not need nobody other keys.

User<1460963135>: crypto primitives provdes by tvm and data formats and what it stores depends on smc implementation

User<1460963135>: https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc here you can see what is initial and what data smc operates and what can be get from it

User<1460963135>: see at line 78: `  var (stored_seqno, stored_subwallet, public_key, plugins) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256), ds~load_dict()); `

User<1460963135>: this is public key of sender so as I said it's packed with TX itself

Moven: May I ask how to verify the public key is from valid address? (reply to 25016)

User<1460963135>: BUT no option to get any key from address, no

User<1460963135>: there is function check_signature (reply to 25019)

Moven: Understood (reply to 25020)

User<1460963135>: signature if first of all, public key in message, checking by stdlib call

Moven: If check_signature return true, does it guarantee the msg has signed by valid address? Or just the fact that the owner of private sign the msg?

Berke: Im trying to send empty cell with deploy_nft but when i do this my nft item contracts gets not initalized any idea why?  cell replaceByNothing = begin_cell().end_cell(); is this a legit way to create empty cell?

User<1460963135>: this is equal cases

Berke: Pushing it for hardcoded zero didnt work either

User<1460963135>: yes signed by valid it's doing core to pass only valid from valid (reply to 25025)

&rey: Most often, get-method get_public_key is provided, that allows to get key if contract is deployed. (reply to 25020)

Moven: Want to make sure that the signature and public key are from the white list address. Not just some random address which honestly signed the msg with private key and sent its public key to the contract (reply to 25029)

User<1460963135>: yeah but address may be inactive for exampel

Moven: Thanks (reply to 25029)

User<1460963135>: you can't "send from another address signed by key of ..." — nonsense

User<1460963135>: because signature will be invalid cause it depends on sender address too

&rey: Why can't you just whitelist public keys and allow incoming messages from any address provided they are signed? (reply to 25031)

Moven: That's a solution! Thank you so much😄 (reply to 25036)

User<1460963135>: remember there is core itself on top of this and messages in tx and tx in blocks are valid but messsage body can store any amount of any keys you like

&rey: Remember that if there are many keys (more than 1000 or unlimited amount of them), you should consider sharding. (reply to 25037)

Tse: I 'm trying to create a contract that allows users to move the fund by providing a message signed by "address A" but does not require the "address A" to be the msg sender  Is this achievable if we do not know the public key of "address A"? (reply to 25039)

&rey: No, I think it isn't. Also you should read proposals on safe signing (some TEP, as far as I remember), otherwise signature could be reused for some unintended purpose. (reply to 25040)

User<1460963135>: this is application logic. you can implement everything you want except of breaking consensus rules. so, inside valid message from A signed by A you can receive any key perform any logic etc

User<1460963135>: ... so you need to accept messages from any address no checks at this point

User<1460963135>: inside message there are some data .... your code doing logic..

Tse: Thanks I get what you are trying to explain. In addition I'm wondering if there's a way I could prove that "a public key is belong to a address" to a contract? (reply to 25042)

Daniil: If you know the wallet version of the contract deployed on "address" (reply to 25045)

Tse: By version do you mean the wallet contract code? or something like v4r2 (reply to 25046)

Daniil: Yes, the code (reply to 25047)

Daniil: The address of any contract in ton depends on both code and data.

User<1460963135>: the great truth is you dont want to do this

Bakenkhonsu | Never DM bro first 💎 I 🍅 StonFi: Hello guys

Bakenkhonsu | Never DM bro first 💎 I 🍅 StonFi: Anyone can help make staking platform?

Bakenkhonsu | Never DM bro first 💎 I 🍅 StonFi: For jetton

Tse: Do I need anything else? or with only contract code and publickey I can calculate the address and see if the result matches what I was looking for (on-chain) (reply to 25046)

Tse: May I know why? security concerns? (reply to 25050)

User<1460963135>: this called financial Pyramide not staking (reply to 25053)

User<1460963135>: there is no such particular problem, why do u need this? (reply to 25055)

User<1460963135>: don't try to solve every task you think you will have. try to start from smth less

Tse: thanks for the advices, I will reconsider if this logic is really essential for my Dapp. (reply to 25058)

User<1460963135>: in common sense address is just hash from public key but in TON things much complicated. adderss you meant may not be wallet address etc etc. to check signature u dont ned it.

Dmitry: Hi all, Why code storeAddress(Address.parse("EQCE...Fgt18")) returns  this error Invalid address. Got EQCE...Fgt18 ? The address is an actual wallet in testnet.  p.s. I use ton-core/ton library

User<1460963135>: to decide is signature correct at app level you should pack this info into data you sign

User<1460963135>: cause you missed smth isnt this obvious?

User<1460963135>: I just spent minutes to check there is no storeAddress nor ton or ton-crypto, maybe using old version dunno

User<1460963135>: and second: provide full address no other way

Moven: okay, I have a clear direction now (reply to 25038)

TON&Co.: ⏺ Going Live with Mark Okhman and technical Q&A Session in 10 mins  Click here to join

User<1460963135>: maybe add few words about who are these ppl.... please tell mark to update SSL at his website lol

Uur: Hi, I'm trying to deploy a contract using ton connector.  https://ton.org/docs/develop/dapps/ton-connect/transactions#transfer-with-comment-contract-deployment In here, theres a line state_init.bits.writeUint(6, 5); What does this do? I couldn't find anything about it.

Tim: how can you set address as index if index is defined as int and address is slice? (reply to 24819)

User<1460963135>: storing number "6" using 5 bits

&rey: For dict_set/dict_get?, index is slice. For udict_set/udict_get?, it's unsigned integer. And for idict_set/idict_get?, it's signed integer. (reply to 25073)

Uur: ok, but, why? It is not related to both code and data (reply to 25074)

User<1460963135>: part of header format maybe or opcode or mode flag. continue yur reseach.

User<1460963135>: this is message header

User<1460963135>: message can be completely raw data or maybe packed using basic formats, this is header for state_init I guess smth like this

&rey: It's flags for StateInit, showing that code and data are in references and there are no libraries attached to contract. (reply to 25076)

User<6247944943>: Is the testnet still congested right now? It seems like all of the explorers are taking a very long time to show transactions. (reply to 24916)

Uur: Oh, thanks! (reply to 25080)

&rey: Is some report going to be published? It could show how stable TON architecture is. 😊 (reply to 24916)

Gica: hello everyone, here its'g Giacomo from astrid. I have a question. does someone know if theres currently any active oracle on TON ecosyste? thanks.

Gica: we a re a team of blockchain devs and data science developers and would love to build on your ecosystem.

Blake: hello

Blake: what is the best wallet on chrome for working on ton testnet?

Blake: I tried TON wallet, MyTonWallet, Coin98 Wallet extension, but couldn't see testnet option there

User<1460963135>: ton wallet click version holding shift

Blake: it works, thanks so much (reply to 25094)

User<1460963135>: extension wallets are not very popular. checkout tonconnect

Uur: Also, press the version a few times for MyTonWallet

Ahmet Said: while deploying contract is  it possible to invoke one of the function in receive_internal function? for example after deployment complete send a message ?

&rey: Yes, this is possible if you provide message body along with stateInit when sending. (reply to 25098)

ezji: yo guys. mb anyone has URI with content for Jetton?

Ö: Hi, I am trying to init a contract with TonWeb library. I can't init the dict in the contract. Contract deploys but after the first call, it starts retuning exit code 9. This is my code.

Ö: I found this function in Tonweb Lib and yought that writing 0 would work

màtín: ✋ hi  I know solidity well  but func  is really complicated for me , it seems totally different from solidity

&rey: Probably there is some error when you read that dict. (reply to 25102)

&rey: Most probably, you read fields in incorrect order (I think this is the most popular error) 😀

Ö: You mean on the contract side? (reply to 25106)

&rey: Yes. Serialization of dict looks correct. (reply to 25107)

Ö: Actually, savedata doesn't get dict. It's set in the contract. This is the savedata: save_data(positive, negative, veto, abstain, contract_time_of_deployment);

Ö: And in contract, it sets the dict like this: (_, int flag) = checker.dict_get?(267, sender_address);   if flag {     return ();   }    ;;  Add to the dictionary if the address does not match   checker~dict_set(267, sender_address, "");

Coalus: Try tact-lang.org (reply to 25104)

Ö: What may be the problem with the contract? (reply to 25108)

màtín: how can deeply familiar with TON architecture ?

Ö: Can you look at our code I provided in previous message and give us an example for storing dicts? (reply to 25108)

Zyxep: jettonprobot (reply to 25100)

RahSha📈: Hello

RahSha📈: Who sell vmess

a: I got this for the dict code. Does anything seems of? It gets deployed but I have no idea how to initialize the dict. Could you guys look into it? (reply to 24904)

a: You have answered that to this contract. (reply to 25108)

a: What is it that we have been missing

a: It should not be this hard to find how to initialize a dict properly

a: You mentioned something about the order what do you mean by that, also what are the other errors? (reply to 25106)

— 2023-03-17 —

Issam: hi guys, is using dicts the best way to handle/store a collection of data ? and is there a way I can define a complex type unlike int and andress ?

jssjjf: hi guys, is it possible to check certain state/value of smartcontract (by hacker) eventhough I didn't provide getter method on smartcontract?

&rey: You don't need to rewrite checker variable in line [18]. (reply to 25121)

Howard: Is this 100% correct?

User<6247944943>: It appears that https://testnet.getgems.io/ is currently not executing or indexing properly.

User<1460963135>: Afaik no

Howard: it's move to here https://github.com/tact-lang (reply to 25133)

User<1460963135>: tact-lang/tact

User<1460963135>: ton-core contains "ton" which was ton-community recently archived (jsts client)

User<1460963135>: Also tact forked ton-emulator and only fork is working

màtín: how can deeply familiar with TON architecture  to help me coding func?

User<1460963135>: func code runs by 'ton itself" but I think it's not necessary to be deeply familiar

User<1460963135>: or what are you asking 😅?

màtín: func structure is so complicated for me🫠

User<1460963135>: Tact-lang google it

màtín: I think func is more useful

Daniil: They both are for writing smart contracts (reply to 25145)

User<1460963135>: They are same yes.

User<1460963135>: tact is just like complex macros on top of

User<1460963135>: func based on fp paradigm its hard even to middle but useful for everyone

màtín: how about interacting with tact?

User<1460963135>: you about cli now? repl?

màtín: type script library?

User<1460963135>: haha man just check it out. it's done for this

User<1460963135>: interfaces and wrappers generated from the box

User<1460963135>: boc files and tlb schemas

User<1460963135>: this is from 1 contract file. even markdown description

User<1460963135>: the class to use next

màtín: ❤️🙏👍

màtín: do you have any suggestion tutorial for tact?

User<1460963135>: everything is in examples folder

User<1460963135>: docs are short just read it whole

màtín: okay (reply to 25163)

User<1460963135>: there is template to start in one call

User<1460963135>: https://github.com/tact-lang/tact-template/tree/main

User<1460963135>: just clone, setup deps and build

ezji: thx) (reply to 25116)

Eugene: tact-by-example.org (reply to 25161)

User<1460963135>: yeah but it's great to read-only dudes and not cover bunch of question which I want to get answered before learning it. I'm not trying to call it bad-job just maybe too simple for real developers...

Mark Okhman on TON: 👨‍💻. Hey Fam, I've just rolled out a 4th Chapter of our FunC course. Next week is going to be big, because we start shooting videos for those lessons 🚀  It is now covering writing tests with Sandbox 😍  Agenda of a chapter: 1. Writing FunC contract with counter logic  2. Writing tests for counter contract 3. Writing FunC contract with deposit/withdrawal logic 4. Writing tests for deposit/withdrawal logic  https://github.com/markokhman/func-course/tree/main/Chapter%204 (forwarded from Mark Okhman on TON)

Андрей: Why await contract.CreateTransfer({...}) doesn't throw error when it fails?

a: Hey that's my bad on the screenshots, it's normally is not there. (reply to 25129)

a: When we try to test the contract, the contract crashes

Berke: Not sure which code u are talking about bur errors might be a response on web side even if its an error on chain side (reply to 25177)

Berke: You will probably find error code on tx in the explorer

a: How did we calculate the 267 value here?

a: I have found a repo that uses the specific function that you have given and it seems to be using 8+256 in the same function.

a: How to calculate this on contract side as well as the testing side?

Daniil: It's just the size of key (reply to 25182)

a: So why the contract crashes while testing it has been 2 to 3 days but we couldn't figure out why (reply to 25188)

a: here is everything about the code, the line [18] does not exists (reply to 25120)

$€£: hello

$€£: starting out on ton and the first codes are already errors ...i wont give up on this dev thing

$€£: tried force,legecy--peer and cache clean (reply to 25192)

Berke: Isnt hardhat for solidity, are you sure u are on your TON dev folder, or am I missing something obvious? (reply to 25192)

$€£: im on a new folder, nothing in it (reply to 25194)

$€£: i guess ,its some interference in cache root (reply to 25194)

Kob: Hello (reply to 25191)

Berke: I was checking tact. Is func enough for TON Development? or should I learn tact, when is it needed? All I know is it might be needed in case of writing wallet contract

Andrew: func is enough, but tact is high-level language that's accompanied by more streamlined dev experience (reply to 25198)

a: Anything on this :/ (reply to 25189)

Ush: Hey guys. Im trying to send jetton using tonweb. But I get only ton on another side and error 705 (reply to 24549)

Ush: Someone know how to fix it?

Raphael: Hi all, is there a specific way to compare two uint32 ? throw_unless(error::unsufficient_amount, in_msg_body~load_uint(32) >= min_deployment_amount); is not working properly and both are uint32.

Arti: Join our first live session related to AIBC.world Summit Hackathon co-organized by @tonanadao:  https://us06web.zoom.us/j/83830726074

Samyar: is it possible to reject deposits to a contract ? i want to filter coming transactions and only allow certain deposit transactions to my contract

E: I havent seen inheritance in FunC smart contract development. Any information? If there is a way to extend an already existing smart contract code.

E: So that the extended smart contract is a single smart contract, and its consumers can see the extension clearly knowing the famous and standard base contract (class). I can do it by doing save as and add code.

jssjjf: when I deploy smartcontract, it send back the whole balance as soon as I deployed. is there anyone know what this issue is?

Step: bounce = false ? (reply to 25212)

jssjjf: I set bounce = false😔 (reply to 25213)

jssjjf: export async function deployTonate(via: Sender, dto: DeployTonateDto) {         // initCode   const tonateCellName = "tonate_" + dto.visibility + "_" + dto.method + ".cell";   // // retreive cell data   const tonateCell = await fetch("https://tonate.xyz/counter.cell")     .then((res) => res.arrayBuffer())     .then((arrayBuffer) => Buffer.from(arrayBuffer));        const tonateCode = Cell.fromBoc(tonateCell)[0];    // initCell   let tonate;   if (dto.visibility == "public"){     tonate = Tonate.createForDeploy(       tonateCode,       initDataPublic(         Address.parse(dto.userAddress!),         Address.parse(TONATE_TRACKER_WALLET_ADDRESS),         dto.userNumber!,         dto.title!       )     );   }   else{ // dto.visibility == "private"     tonate = Tonate.createForDeploy(       tonateCode,       initDataPrivate(         via.address!,         dto.userNumber!,         dto.title!       )     );   }    // // init client to make Open Contract   const client = new TonClient({     endpoint: await getHttpEndpoint({ network: "testnet" }),   });    const tonateContract = client.open(tonate) as OpenedContract<Tonate>;    tonateContract.sendDeploy(via, dto.balance!.toString());       return tonateContract.address; }

jssjjf: export default class Tonate implements Contract {      static createForDeploy(code: Cell, initData: Cell): Tonate {     const workchain = 0; // deploy to workchain 0     const address = contractAddress(workchain, { code: code, data: initData });     return new Tonate(address, { code, data: initData });   }    constructor(     readonly address: Address,     readonly init?: { code: Cell; data: Cell }   ) {}    async sendDeploy(provider: ContractProvider, via: Sender, balance : string) {     await provider.internal(via, {       value: balance,       bounce: false,     });   } }

jssjjf: this is the code. for deploy...

jssjjf: and trx is like this https://testnet.tonscan.org/address/EQAKEWbml0UeXd0aiF-gEyNPTnxIey8gqXhTbUla5JpA2znU

jssjjf: *https://tonate.xyz/counter.cell => should be another link

— 2023-03-18 —

Андрей:  ~/ton-linux-arm64 $ ./storage-daemon -v 3 -C global.config.json -I 127.0.0.1:3333 -p 5555 -D storage-db [ 3][t 1][2023-03-18 05:14:50.674029375][StorageManager.cpp:49][!storage]       Starting Storage manager. DB = /data/data/com.termux/files/home/ton-linux-arm64/storage-db/torrent [ 3][t 1][2023-03-18 05:14:50.734373906][StorageManager.cpp:103][!storage]      Finished loading torrents from db (0 torrents) [ 3][t 1][2023-03-18 05:14:50.734736875][storage-daemon.cpp:252][!storage-daemon]       Started control interface on port 5555 [pid 7397] [time 1679116507] Signal: 31 [pid 7397] [time 1679116507] Can't set ptracer  Just tried using ton bins in termux and it worked! Though i get an error when I try to start storage daemon.

Ahmad Shuaib: Send me ton link for download

Андрей: Fixed by using proot with both daemon and cli (reply to 25221)

Андрей: Can somebody download 87C94FD61481286136828AA93175967903F6CE52D8E5E6B86D8D4745DD8B19A5 using TON Storage? (It's 15mb .png) To test if storage-daemon works on my device.

User<1460963135>: try by storage.ton/gateway/87C94FD61481286136828AA93175967903F6CE52D8E5E6B86D8D4745DD8B19A5 ...

Андрей: .ton requires a proxy, and i can't launch it at this time (reply to 25227)

User<1460963135>: and to check your storage I need to run own storage gateway instance

User<1460963135>: this was mine try. everything I can do)

Андрей: Or storage-daemon right? (reply to 25229)

User<1460963135>: dunno even it's bound to ton node or not

Oleg: You could use https://github.com/xssnick/tonutils-proxy to access any bag (reply to 25228)

User<1460963135>: this is wat youll say your visitors?

Oleg: http://87C94FD61481286136828AA93175967903F6CE52D8E5E6B86D8D4745DD8B19A5.bag/yourimg.png (reply to 25234)

User<1460963135>: yes I saw your id do not following any filename

User<1460963135>: so to download file I must become server as it is right now

User<1460963135>: I find no way to access it from web googling 15 minutes :(

User<1460963135>: reading docs: "download storage-daemon and storage-daemon-cli from..." — there is only daemon-cli, what I'm missing?

User<1460963135>: even trying to run own I can't

User<1460963135>: so maybe "storage-daemon" is just an ENTITY and storage-daemon-cli contains both? but I still need ton node...

Андрей: Download from https://ton.org/docs/develop/smart-contracts/environment/installation (table) (reply to 25240)

User<1460963135>: even IPFS is not suitable for NFT in real life... only if you running own and caching everything and replacing links to it with own http gateway

User<1460963135>: when trying to display nft to user..

Андрей: No, they're different :P   There's also just storage-cli (reply to 25242)

User<1460963135>: Yeah I know but....

User<1460963135>: my point is: just forget about this, it's far from using and even adopting is near from impossible 'cause after 3 attemt's I'm done with this).

User<1460963135>: maybe developers of own close-integrated projects can check it from their servers with full-nodes

Андрей: I can't run it because of the missing arm version. And also I'd like to see if the file is actually accessible from an independent device. (reply to 25234)

User<1460963135>: I was prototyping own NFT marketplace - that times it was possible I guess.. try yo ask developers of this tool :D.

User<1460963135>: NO

User<1460963135>: IT IS NOT

Андрей: I'm just testing. I have only one device accessible to the internet rn and it's my android phone with termux that i use to execute ton stuff. (reply to 25248)

User<1460963135>: man I say it is not because it is equal — error on your side or no way to access it from outer.

User<1460963135>: proxy will not help as I show on screenshot (reply to 25250)

User<1460963135>: using only public gateway require listing on github whitelist AFAIU

Oleg: It is not only proxy, it implements storage protocol too (reply to 25256)

User<1460963135>: RLDP Proxy Error: Get "http://87c94fd61481286136828aa93175967903f6ce52d8e5e6b86d8d4745dd8b19a5.bag/yourimg.png": failed to connect to site: failed to create downloader for storage bag of 87c94fd61481286136828aa93175967903f6ce52d8e5e6b86d8d4745dd8b19a5.bag, err: failed to find storage nodes for this bag, err: no nodes found

Андрей: Can you try again? (reply to 25262)

User<1460963135>: same

Андрей: Okay, thanks 👍

TON Answers Bot (not AI): What is usage for `ton-indexer` over here? Can we say that it's a lite-weight, own usage server that help us track the on-chain Txs easily? from Howard  https://github.com/toncenter/ton-indexer  🔗 Answer on TON Overflow

Zyxep: دوستان کسی رباتی میشناسه که اطلاعات و قیمت لحظه ای jetton ها رو گرفت ازش؟

Howard: Is there a Telegram bot for searching? I am looking for a tool that can analyze when people leave groups  or not and highlight what others were discussing at the time.

User<689845327>: Hi,  I have a question about minting NFT with ton-connect.  Do I need a backend program to send the data to blockchain and mint it? For example, WebApp > Ton-connect: send data with Ton-Proof > Backend makes the data package > Ton wallet approve the Tx of minting NFT > Ton blockchain makes the NFT > Ton blockchain deposit the NFT to the wallet.  Am I right? Or it’s not how it works? Thanks.

&rey: You can make data package on frontend. (reply to 25284)

User<689845327>: So actaully,  The logic may like:  WebApp: bundle the data of NFT and ask Ton-connect to send with Ton-Proof > Ton wallet approve the Tx of minting NFT > Ton blockchain makes the NFT > Ton blockchain deposit the NFT to the wallet.  However, if I want to bundle the  data and store to the server and mint NFT later. I need backend absolutely? (reply to 25285)

&rey: If you want to mint NFT later, you may send a message of minimal value carrying its data so that it's recorded in blockchain (not forever because transactions are not guaranteed to be kept for a long time), then later on frontend you can check such messages and mint NFTs when the time has come. However, you also need to lock minting until specific time in some way. (reply to 25286)

User<1460963135>: Minting if simple tx you even can prepare deeplink to send it. Where u want prepare and send from wallet app

User<689845327>: One more thing. If I want to mint an NFT that follows my own contract. This doesn’t change the logic right?  I mean, when the user decided a data that changes the features of the contract, the WebApp can use Ton-Proof to bundle the data and mint without backend? (reply to 25287)

User<689845327>: bundle the data and send with Ton-Proof* ^ Please correct me if I made mistake

&rey: You don't need ton-proof to send anything, you need just connection to wallet app. (reply to 25290)

User<1460963135>: read docs about nft again. it covers all your questions and your base knowledge missing too much.

User<689845327>: Because our engineer said, it’s impossible to make a custom NFT without backend.

User<1460963135>: You paying him not us. And give backend access to my wallet to mint nft is nonsense too. Why you talking about that proof. No understanding how it works but wanna operate?

User<689845327>: Even the NFT contract is different?

User<1460963135>: Short answer u engineer wrong. Long at docs. backend is http api of node.

User<689845327>: As I know, we have to use Ton Proof to verify user’s identity? and minting the NFT needs to ask the approval of the user.

&rey: Backend is often useful, however it's only required if you need to hold some private keys there, for example to sign NFT minting request. There certainly are custom contracts which don't require backend for operating. See https://github.com/ProgramCrafter/ratelance/ for example. (reply to 25293)

User<1460963135>: no. U event dont  need to login with connect or smth

&rey: You don't need to verify user's identity if you want him to mint NFT by his own. (reply to 25297)

User<689845327>: Thanks. I’m reading. (reply to 25298)

User<689845327>: Ah… So after connected the wallet. We can mint the NFT directly? (reply to 25300)

User<1460963135>: why to connect wallet for what?

User<1460963135>: it's not connecting wallet only informing it's address

&rey: Yes. Also, there are custom NFT contracts without backends: https://ton.org/docs/develop/onboarding-challenge#-getting-started (reply to 25302)

&rey: *and allowing to send transaction requests to wallet application from frontend. (reply to 25304)

User<1460963135>: you can perform deeplink without connecting wallet

User<1460963135>: and provide it as link to click ad open tx in wallet app without connecting anything

&rey: It's often inconvenient to communicate this link to device with wallet app except than via QR codes. (reply to 25308)

User<1460963135>: ok but you don't need it to understand how it works. to avoid such a situation when tying to take full access of user's wallet to send tx from it. like this guy.

User<1460963135>: if you sending tx from back you mint it from own wallet, not user's and where is ton connect in this scheme?

User<689845327>: Thanks @pcrafter & @commonbabylightmyfire  I need time to review the doc but I think I got the idea that how to fix.   Thanks again//

Howard: You can push the data to the chain through a URL and then send it using TonKeeper (Wallet).    Essentially, the data you mentioned here is meant for mining purposes and will be pasted to a smart contract like EVM. How you implement your code will determine if this is possible or not.  If you want to mint an NFT in the TON network, you should know that each NFT has a unique contract address and is signed with the owner's address. That's all. (reply to 25289)

𝑴𝒂𝒉𝒅𝒊: Mask ??

𝑴𝒂𝒉𝒅𝒊: Does anyone here have mask currency?

User<689845327>: Thanks. We can connect the wallet but still work on making NFTs. (reply to 25313)

Howard: can check my repo implement using Tact https://github.com/howardpen9/nft-standard-template (reply to 25316)

User<689845327>: Thanks// (reply to 25317)

Owdares: hello, can you tell me what information the owner of a public node can get if a transaction is sent through it?

User<1460963135>: using http api - same as another webserver but api is not node itself

Owdares: that is, the owners of the nodes can receive the private key with which the transaction was signed?

fesal | Patara 🐢: No

fesal | Patara 🐢: They can only get your public key with the sign

fesal | Patara 🐢: Private key doesn't goes out in any situtation

User<1460963135>: I thought question about IP.

— 2023-03-19 —

Howard: woa! (reply to 2772)

User<1460963135>: For idiots even wood is gun or how it is translated right....hm.... To shoot own leg! (reply to 2766)

User<1460963135>: Dont u know full node owners accesaing ur privates anyway behind wallets ahahah

Marlee: Guys what do you think about @wallet that announced that they going to be a cross chain wallet? Don’t you think Ton is going to loose its network affect advantage compared to other networks?

liminal: 6th lesson's out now https://www.youtube.com/watch?v=TWIErV7B5J8&list=PLtUBO1QNEKwttRsAs9eacL2oCMOhWaOZs

Step: is it possible to get previous owners of nft through liteclient?

User<1460963135>: tracking it's history yes, listening to blockchain through time and saving needed action txs

User<1460963135>: tonapi.io may has smth check it out yourself

Step: tonapi is unreliable

Himu Globin: Hey hey, guys. How to reach out to Tonstarter team?

User<1460963135>: not technical advive just tip

Andrey: Click  Example of low level requests with dton graphql. High level will available very soon (reply to 25332)

User<1460963135>: wow try to contact nft marketplaces developers they continue keep data about nft in old fashion dbs interesting why.... joke. no need to explain.

Ala: hello guys :D did someone have any idea about this Error

Ala: i just want to deploy a contract and when i scan the QR it shows like that

— 2023-03-20 —

Master: Hi, everyone I'd like to know the way how to call get function of deployed contract in my contract

Master: How can I call counter() in my contract?

TON Answers Bot (not AI): Can we say that implementing this TEP-89 in Jetton is now mandatory? from Howard  Can we say that implementing this TEP-89 in Jetton is now mandatory?   https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md  🔗 Answer on TON Overflow

Howard: You can write a TypeScript file to fetch on-chain data. For example, you can refer to this GitHub repository:  https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts https://github.com/toncenter/examples.  Please note that it is not reliable to call a get_method from Contract B in your Contract A for an asynchronous blockchain. The best approach is to use message receive to ask Contract B to return its status. (reply to 25347)

màtín: () recv_internal(slice in_msg_body) impure { throw_if(35,in_msg_body.slice_bits() < 32);  int n = in_msg_body~load_uint(32);  slice ds = get_data().begin_parse();  int total = ds~load_uint(64);  total += n;  set_data(begin_cell().store_uint(total, 64).end_cell());}  int get_total() method_id {  slice ds = get_data().begin_parse();  int total = ds~load_uint(64);   return total; }  I have a question about TVM and smart contracts, for instance, here we only have one variable (total) what happens if we have another var like (id) how does TVM understand that I have another var, and how does it separate two or more same type variables with different value?

User<5906393387>: You store data and specifying number of bits.  Then, when you get the data from the c4 register (slicing data), you use load methods with specifying the amount of bits that you want to get.  If you store 64 bits of total and 64 bits of id and you want to get id variable, you just load first 64 bits to skip total variable and load another 64 bits to get the id var. (reply to 25351)

Андрей: TVM doesn't have variable names, it uses stack position instead (just as every compiled code like c/c++/c#) (reply to 25351)

màtín: so the order of storing is important?

E: 1. First, name the method get_counter() rather than counter() to obey convention: 2. Make a wrapper interface called Counter.ts in Typescript. and add the following method.    async getCounter(provider: ContractProvider) {         const result = await provider.get('get_counter', []);         return result.stack.readNumber();     } (reply to 25347)

E: Notice that the  method_id modifier allows you to call the getter function from Typescript code using the following method and passing the Func getter method name as string key prameter: await provider.get('get_counter', []);         return result.stack.readNumber(); Explained very well in https://ton-community.github.io/tutorials/02-contract/ . Go to step 9. (reply to 25358)

E: In your case if the get methods name is counter() then the typescript caller would be    async getCounter(provider: ContractProvider) {     const { stack } = await provider.get("counter", []);     return stack.readBigNumber();   }

E: And then you would call this interface getCouter method as follows in your Typescript code:  import { getHttpEndpoint } from "@orbs-network/ton-access"; import { TonClient, Address } from "ton"; import Counter from "./counter"; // this is the interface class we just implemented  async function main() {   // initialize ton rpc client on testnet   const endpoint = await getHttpEndpoint({ network: "testnet" });   const client = new TonClient({ endpoint });    // open Counter instance by address   const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8   const counter = new Counter(counterAddress);   const counterContract = client.open(counter);    // call the getter on chain   const counterValue = await counterContract.getCounter();   console.log("value:", counterValue.toString()); }  main();

User<5906393387>: Yes, so you can read in that order (reply to 25357)

E: Hey guys, I am working on two related TEPs as an extension to TEP-74 and TEP-62. TEPs are about Lockable Fungible Tokens Standard and Lockable NFT Standard. It is revolutionary in a sense that it relies on the asynchronous system of TVM where each Jetton wallet is a distinct contract. We have atomicity within a wallet and not among wallets. This allowed us to introduce a class of transactions with a robust scheme that do not need consensus despite changing state. It increases speed, security, while decreasing costs incredibly for some DAPP use cases that involve staking.  Please kindly check the early draft out at https://web3-4.gitbook.io/daoton/lockable-token-standard  I am working on the TEP at the moment  and would be happy to get feedback.

màtín: thank you 🙏 (reply to 25362)

Mark Okhman on TON: First course on programming in TON is coming soon 🚀 (forwarded from Mark Okhman on TON)

Rahul: Do we have any other option to get wallet public key instead of Account using tonapi(/v1/wallet/getWalletPublicKey)?

Rahul: And if wallet is not in active state I am getting an error "Internal Server Error" from tonapi

TON&Co.: ⏺ Vlad (sepezho) is going live on TON&Co. with FunC Q&A   🗣 Join now

User<1460963135>: we don't have any options of this. (reply to 25366)

Andrey: Click   mutation {   run_method(     account_search_by_address: {address_friendly: "EQBlxuPNk1LAWg2tktudUAJvL7jZWp0IWJDqB5lMelU-xzu9"}     method_name: "get_public_key"   ) {     stack {       value       value_type     }   } }   Just run get_public_key method (reply to 25366)

Tim: He needs to extract from state init from uninit wallets. How dton will help (reply to 25370)

Andrey: In today (i hope) update we will add opportunity pass state_init directly to run_method  👉👈 (reply to 25371)

Tim: And how it'll work with v3r1? (reply to 25372)

Andrey: Exact same)

Tim: It has no get public key method

Andrey: So why we need to support it? (reply to 25375)

Tim: We need guide/lib that extracts public keys from state init

Andrey: The idea of parsing stateinit with data is not good at all

User<1460963135>: public key to check sending by sender with tx

Tim: Because he most likely needs that functionality to check tonconnect.tonproof. And when user will connect with v3r1 wallet it'll not work (reply to 25376)

Andrey: We already have interface called get_public_key 🙈 (reply to 25377)

noringood: И чё тут

Tim: It's not implemented in r1 wallets and there're users in the wild who use that (reply to 25381)

Andrey: It's very bad practice to mess with the c4 cell directly.  It will not lead to anything good, especially when we want a lot of new smart contracts and users.  I believe it is possible not to support everyone who has not implemented the method in the contract for the compatibility with custom smart contracts. I heard it's not that hard to get a wallet with working methods. (reply to 25383)

Tim: good luck with telling every user in support to change his wallet

Rahul: It's not working if the wallet doesn't have any transactions. Getting an error "No such transaction" (reply to 25370)

Rahul: Yes, I need it for tonproof (reply to 25380)

Nikita: Have the same issue on our site. Only one question — how did Getgems implement ton-connect2.0 support, working ideal with any version of the wallet? May be the problem was solved directly, not in public. (reply to 25383)

Nikita: Actually, we met the problem with v3R1 only in 70% of all cases. Another 20% and 10% were with v3R2 and v4R2. (reply to 25383)

Tim: check dms

Howard: Is https://wton.dev/ is legit?

Andrew: https://github.com/ozys-io/wrapped-ton 🤔 (reply to 25391)

Kirill: @markokhman can help with this

Steve: Fee for wrapping?

Mark Okhman on TON: hey, we are preparing a new TEP that will be ment to be universal wrapped TON (reply to 25391)

Mark Okhman on TON: https://github.com/ton-community/wton-contract

Mark Okhman on TON: You can already see the contract code here, but the TEP is getting finalized

Mark Okhman on TON: Will be deployed this week

Mark Okhman on TON: on testnet and we will give it to public for tesitng

Tim: Will it use libs? (reply to 25399)

vsnation 🟣: Faced with the new issue when transferring NFT: b'{"error":"error code: 0 , message: cannot apply external message to current state : External message was not accepted\\nCannot run message on account: inbound external message rejected by account FFDF... before smart-contract execution"}\n'  Anyone familar with it?

vsnation 🟣: Probably it's because of not enough gas on my balance. But maybe someone has a list of known errors with tonapi RPC?

vsnation 🟣: When I deposited 1 $TON, the error was changed to:  b'{"error":"error code: 0 , message: cannot apply external message to current state : External message was not accepted\\nCannot run message on account: inbound external message rejected by transaction FFDFASDASDASDSADASD:\\nexitcode=33, steps=23, gas_used=0\\nVM Log (truncated):\\n...te NOW\\nexecute LEQ\\nexecute THROWIF 36\\nexecute PUSH c4\\nexecute CTOS\\nexecute LDU 32\\nexecute LDU 32\\nexecute LDU 256\\nexecute LDDICT\\nexecute ENDS\\nexecute XCPU s4,s3\\nexecute EQUAL\\nexecute THROWIFNOT 33\\ndefault exception handler, terminating vm with exit code 33\\n"}\n' (reply to 25401)

Daniil: Check your seqno (reply to 25403)

vsnation 🟣: Yes, it helped. Do you know send/boc should return tx hash or something? I received "" from tonapi (reply to 25404)

Daniil: Sorry, I didn't work much with tonapi so can't help with that (reply to 25405)

Seitaro: 1. It is unclear do we really need a standard for this? Isn't it just internal implementation details of jetton-DAO system. 2. Indeed, to forbid double voting you need to be able to lock jettons from transfers. But also you need to prevent voting from the same wallet twice somehow. It is unclear how you do that. 3. Nikita Kuznetsov from OpenMask well thought out this concept of DAO, I made my own half-baked implementation here, not ready for production but can be used as proof-of-concept. (reply to 25363)

Andrey: Yeah, unfortunately there are 153k v3r1 wallets.  I sketched out some simple C++ code that parses the state init, maybe it will help somebody🙁  Code / graphql (reply to 25385)

Андрей: If i understand correctly, "subwallet_id" can be used to have multiple wallets with same mnemonics?

Tim: Yes (reply to 25409)

Андрей: Where can i submit ton ecosystem (mainly wallet apps) proposals?

vsnation 🟣: Question: How to decode transaction data and msg_data?

màtín: can somebody explain"proxy smart contract"to me plz?

ethzanity: friendz wen usdc on TON

Ihor: i try to send NFT

— 2023-03-21 —

Howard: sooner I think. In general, you already can find oUSDT on ston.fi or Megaton.fi (reply to 25415)

Howard: How can I track whether users, who are using TonConnect on my frontend pages, are sending a transaction to my contract or not?   And how can I receive a success or failed fallback? (I set difference code error codes in my code for sure)  I need to know whether the transaction was successful or ran out of gas, etc., so that I can display the corresponding pop-up window to the user.

User<6089685064>: Why decentralised economy needs some centralised stuff?) (reply to 25415)

fesal | Patara 🐢: Because in today's situttion, you cannot get your money out of decentralized economy. You need some sort of centralized authority to get your money or even buy new stuff in irl (reply to 25420)

fesal | Patara 🐢: Maybe in the future, when more ppl gets in to crypto, we will be able to use our money within the decentralized systems. That's what i hope aswell

Howard: what will make exit code 5 usually? (reply to 23161)

Alex: As I remember, when I worked with (multi typed) tuples and incorrectly read type for variable I pop() from tuple.  But what is reason of exception "usually", don't know.   You have to debug to find source usually. (reply to 25424)

Андрей: There's BitPay, but i only seen it as an option from xsolla store page and never tried it. Also it doesn't support ton :( *Yet?* (I emailed them, maybe they'll) (reply to 25423)

Andrew: no need to, there's Tonpay already (reply to 25426)

Andrew: you can use explorers' apis and monitor the contract address for incoming transactions from your user (reply to 25419)

Andrew: tonapi even has SSE for such cases

User<6089685064>: P2P (reply to 25422)

fesal | Patara 🐢: ? (reply to 25430)

fesal | Patara 🐢: BitPay eventually a company that sells you dollars for your cryptocurrency (reply to 25426)

fesal | Patara 🐢: Not a swap

User<6089685064>: Sell cryptocurrency for a fiat without third parties (reply to 25431)

Howard: SSE? (reply to 25429)

Andrew: server-sent events (reply to 25435)

